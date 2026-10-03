import { drawPlayer, drawMarker } from "./art.js";
import { STATIONS, GROUPS } from "./content.js";
import { createUI } from "./ui.js";
import { workshop } from "./rooms/workshop.js";
import { lab } from "./rooms/lab.js";
import { terrace } from "./rooms/terrace.js";

const ROOMS = { workshop, lab, terrace };
const VIEW_W = 384; // the zoom is chosen so this much world fits across
const VIEW_H = 224;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Each room renders at native pixel size into `scene`, then is scaled up with no smoothing.
const scene = document.createElement("canvas");
const sctx = scene.getContext("2d");
const backgrounds = {};
for (const room of Object.values(ROOMS)) {
  const c = document.createElement("canvas");
  c.width = room.W;
  c.height = room.H;
  room.drawStatic(c.getContext("2d"));
  backgrounds[room.id] = c;
}

const QUEST = Object.keys(STATIONS).filter((id) => GROUPS.some((gr) => gr.id === STATIONS[id].group));
const SECRETS = Object.keys(STATIONS).filter((id) => STATIONS[id].group === "secret");

/* ---------------- state ---------------- */

const g = {
  room: workshop,
  player: { x: 204, y: 196, dir: "up", frame: 0, frameT: 0, moving: false },
  target: null,
  stuckT: 0,
  keys: new Set(),
  near: null,
  dialog: null,
  started: false,
  fade: 0,
  pending: null,
  seen: new Set(),
  secrets: new Set(),
  snow: false,
  pigeonFlight: 0,
  view: { scale: 3, camX: 0, camY: 0, vw: VIEW_W, vh: VIEW_H },
  findSecret,
};

function load() {
  try {
    const s = JSON.parse(localStorage.getItem("workshop-save") || "{}");
    for (const id of s.seen || []) if (STATIONS[id]) g.seen.add(id);
    for (const id of s.secrets || []) if (STATIONS[id]) g.secrets.add(id);
    if (s.snow) g.snow = true;
  } catch (_) {}
}
function save() {
  try {
    localStorage.setItem("workshop-save", JSON.stringify({ seen: [...g.seen], secrets: [...g.secrets], snow: g.snow }));
  } catch (_) {}
}
load();

const ui = createUI({
  questIds: QUEST,
  secretIds: SECRETS,
  onClose: () => (g.dialog = null),
  onStart: () => {
    g.started = true;
    if (matchMedia("(hover: none)").matches) ui.toast("Tap to walk · tap things to look");
    else ui.toast("Walk up to something and press E");
  },
  onJump: (id) => jumpTo(id),
});
ui.setRoom(g.room.name);
ui.updateProgress(g.seen, g.secrets);

/* ---------------- layout ---------------- */

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  canvas.width = Math.floor(vw * dpr);
  canvas.height = Math.floor(vh * dpr);
  canvas.style.width = vw + "px";
  canvas.style.height = vh + "px";
  const fit = Math.min(vw / VIEW_W, (vh - 24) / VIEW_H);
  let scale = fit;
  if (vw < 700) scale = Math.max(fit, Math.min((vh * 0.86) / VIEW_H, 2.8));
  scale = Math.max(1, scale);
  const snapped = Math.floor(scale * dpr) / dpr;
  if (snapped >= scale * 0.9) scale = snapped;
  g.view.scale = scale;
  g.view.vw = vw / scale;
  g.view.vh = vh / scale;
}
window.addEventListener("resize", resize);
resize();

/* ---------------- input ---------------- */

const KEYMAP = {
  ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
};
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
let konamiPos = 0;

window.addEventListener("keydown", (e) => {
  if (g.started) {
    konamiPos = e.code === KONAMI[konamiPos] ? konamiPos + 1 : e.code === KONAMI[0] ? 1 : 0;
    if (konamiPos === KONAMI.length) {
      konamiPos = 0;
      g.snow = !g.snow;
      save();
      if (g.snow) {
        if (g.secrets.has("snow")) ui.toast("It's snowing in El Kef again.");
        else findSecret("snow", true);
      } else ui.toast("The snow stops.");
    }
  }
  if (!g.started) {
    if (e.key === "Tab") return;
    ui.start();
    e.preventDefault();
    return;
  }
  if (g.dialog) {
    if (["Escape", "KeyE", "Space", "Enter"].includes(e.code)) {
      const inside = ui.dialogEl.contains(document.activeElement) && document.activeElement !== ui.closeEl;
      if ((e.code === "Enter" || e.code === "Space") && inside) return;
      e.preventDefault();
      ui.closeDialog();
    }
    return;
  }
  if (KEYMAP[e.code]) {
    g.keys.add(KEYMAP[e.code]);
    g.target = null;
    e.preventDefault();
  }
  if (["KeyE", "Space", "Enter"].includes(e.code) && g.near) {
    e.preventDefault();
    interact(g.near);
  }
});
window.addEventListener("keyup", (e) => {
  if (KEYMAP[e.code]) g.keys.delete(KEYMAP[e.code]);
});
window.addEventListener("blur", () => g.keys.clear());

canvas.addEventListener("pointerdown", (e) => {
  if (!g.started) return ui.start();
  if (g.dialog || g.fade) return;
  const p = screenToWorld(e.clientX, e.clientY);
  const spots = visibleSpots();
  const spot = spots.find((s) => inRect(p, s.hit)) || spots.find((s) => inRect(p, s.zone));
  if (spot) return goTo(spot);
  const b = g.room.bounds;
  setTarget(clamp(p.x, b.x0, b.x1), clamp(p.y + 8, b.y0, b.y1));
});
canvas.addEventListener("pointermove", (e) => {
  if (!g.started || g.dialog) return;
  const p = screenToWorld(e.clientX, e.clientY);
  canvas.style.cursor = visibleSpots().some((s) => inRect(p, s.hit)) ? "pointer" : "default";
});

function visibleSpots() {
  return g.room.spots.filter((s) => !(s.id === "pigeon" && g.pigeonFlight > 0));
}

function goTo(spot) {
  if (!spot) return;
  setTarget(spot.at.x, spot.at.y, spot.id);
}

function setTarget(x, y, then) {
  g.target = { x, y, then, path: findPath(g.player.x, g.player.y, x, y) };
  g.stuckT = 0;
}

// Breadth-first search on a 4px grid, then drop waypoints that are in a straight line of sight.
const CELL = 4;
function findPath(sx, sy, tx, ty) {
  const room = g.room;
  const cols = Math.ceil(room.W / CELL);
  const rows = Math.ceil(room.H / CELL);
  const free = (c, r) => c >= 0 && r >= 0 && c < cols && r < rows && !collides(c * CELL + CELL / 2, r * CELL + CELL / 2);
  const start = [Math.floor(sx / CELL), Math.floor(sy / CELL)];
  let goal = [Math.floor(tx / CELL), Math.floor(ty / CELL)];
  if (!free(goal[0], goal[1])) {
    // aim for the nearest free cell to where the tap landed
    let best = null;
    for (let d = 1; d < 12 && !best; d++)
      for (let dc = -d; dc <= d; dc++)
        for (let dr = -d; dr <= d; dr++)
          if (!best && free(goal[0] + dc, goal[1] + dr)) best = [goal[0] + dc, goal[1] + dr];
    if (!best) return [{ x: tx, y: ty }];
    goal = best;
    tx = goal[0] * CELL + CELL / 2;
    ty = goal[1] * CELL + CELL / 2;
  }
  const key = (c, r) => r * cols + c;
  const prev = new Map([[key(...start), -1]]);
  const queue = [start];
  let found = false;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (queue.length) {
    const [c, r] = queue.shift();
    if (c === goal[0] && r === goal[1]) { found = true; break; }
    for (const [dc, dr] of dirs) {
      const nc = c + dc, nr = r + dr;
      if (prev.has(key(nc, nr)) || !free(nc, nr)) continue;
      if (dc && dr && (!free(c + dc, r) || !free(c, r + dr))) continue;
      prev.set(key(nc, nr), key(c, r));
      queue.push([nc, nr]);
    }
  }
  if (!found) return [{ x: tx, y: ty }];
  const cells = [];
  for (let k = key(...goal); k !== -1; k = prev.get(k)) cells.push({ x: (k % cols) * CELL + CELL / 2, y: Math.floor(k / cols) * CELL + CELL / 2 });
  cells.reverse();
  const clear = (a, b) => {
    const n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2);
    for (let i = 1; i <= n; i++) if (collides(a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n)) return false;
    return true;
  };
  const out = [];
  let from = { x: sx, y: sy };
  let i = 0;
  while (i < cells.length) {
    let j = cells.length - 1;
    while (j > i && !clear(from, cells[j])) j--;
    out.push(cells[j]);
    from = cells[j];
    i = j + 1;
  }
  out[out.length - 1] = { x: tx, y: ty };
  return out;
}

// From the quest list: go to the room that has the station, then walk to it.
function jumpTo(id) {
  for (const room of Object.values(ROOMS)) {
    const spot = room.spots.find((s) => s.id === id);
    if (!spot) continue;
    if (room !== g.room) transition(room, { x: spot.at.x, y: Math.min(spot.at.y + 14, room.bounds.y1), dir: "up" }, id);
    else goTo(spot);
    return;
  }
}

function interact(id) {
  const spot = g.room.spots.find((s) => s.id === id);
  if (spot && spot.exit) {
    const to = ROOMS[spot.exit.to];
    transition(to, to.arrivals[g.room.id]);
    return;
  }
  openStation(id);
}

function openStation(id) {
  const st = STATIONS[id];
  if (!st) return;
  g.target = null;
  g.keys.clear();
  g.dialog = id;
  g.player.moving = false;
  if (st.group === "secret") findSecret(id, false);
  else if (QUEST.includes(id) && !g.seen.has(id)) {
    g.seen.add(id);
    save();
    ui.updateProgress(g.seen, g.secrets, id);
  }
  ui.openDialog(st);
  ui.hidePrompt();
}

function findSecret(id, announce) {
  if (g.secrets.has(id)) return;
  g.secrets.add(id);
  save();
  ui.updateProgress(g.seen, g.secrets);
  const n = `${g.secrets.size}/${SECRETS.length}`;
  ui.toast(announce ? `Secret found: ${STATIONS[id].title} · ${n}` : `Secret found · ${n}`);
}

function transition(room, spawn, thenOpen) {
  if (g.fade) return;
  g.target = null;
  g.keys.clear();
  g.pending = { room, spawn, thenOpen };
  g.fade = 0.0001;
}

/* ---------------- movement ---------------- */

const SPEED = 62;
const FEET = { w: 8, h: 4 };

function collides(x, y) {
  const b = g.room.bounds;
  const fx = x - FEET.w / 2;
  const fy = y - FEET.h;
  // doorways let you step past the normal bounds
  for (const s of g.room.spots) if (s.exit && inRect({ x, y }, s.exit.trigger)) return false;
  if (fx < b.x0 || fx + FEET.w > b.x1 || y < b.y0 || y > b.y1) return true;
  for (const s of g.room.solids) if (fx < s.x + s.w && fx + FEET.w > s.x && fy < s.y + s.h && y > s.y) return true;
  return false;
}

function update(dt) {
  const pl = g.player;
  let dx = 0;
  let dy = 0;
  if (g.keys.size) {
    if (g.keys.has("left")) dx -= 1;
    if (g.keys.has("right")) dx += 1;
    if (g.keys.has("up")) dy -= 1;
    if (g.keys.has("down")) dy += 1;
  } else if (g.target) {
    const path = g.target.path;
    while (path && path.length > 1 && Math.hypot(path[0].x - pl.x, path[0].y - pl.y) < 2) path.shift();
    const wp = path && path.length ? path[0] : g.target;
    const tx = wp.x - pl.x;
    const ty = wp.y - pl.y;
    const dist = Math.hypot(tx, ty);
    if (dist < 2 && (!path || path.length <= 1)) {
      const then = g.target.then;
      g.target = null;
      if (then) {
        faceToward(then);
        interact(then);
      }
    } else {
      dx = tx / dist;
      dy = ty / dist;
    }
  }

  const len = Math.hypot(dx, dy);
  pl.moving = len > 0;
  if (pl.moving) {
    dx /= len;
    dy /= len;
    const step = SPEED * dt;
    const bx = pl.x;
    const by = pl.y;
    if (!collides(pl.x + dx * step, pl.y)) pl.x += dx * step;
    if (!collides(pl.x, pl.y + dy * step)) pl.y += dy * step;
    if (Math.abs(dx) > Math.abs(dy)) pl.dir = dx > 0 ? "right" : "left";
    else pl.dir = dy > 0 ? "down" : "up";
    pl.frameT += dt;
    if (pl.frameT > 0.12) {
      pl.frameT = 0;
      pl.frame = (pl.frame + 1) % 4;
    }
    if (g.target) {
      const moved = Math.hypot(pl.x - bx, pl.y - by);
      g.stuckT = moved < step * 0.2 ? g.stuckT + dt : 0;
      if (g.stuckT > 0.25) {
        const then = g.target.then;
        g.target = null;
        if (then && nearestSpot() === then) interact(then);
      }
    }
  } else pl.frame = 0;

  // walking into a doorway takes you through it
  if (!g.fade) {
    for (const s of g.room.spots) {
      if (s.exit && inRect(pl, s.exit.trigger)) {
        const to = ROOMS[s.exit.to];
        transition(to, to.arrivals[g.room.id]);
        break;
      }
    }
  }

  if (g.room.update) g.room.update(dt, g, pl);
  g.near = nearestSpot();
}

function faceToward(id) {
  const s = g.room.spots.find((sp) => sp.id === id);
  if (!s) return;
  const dx = s.hit.x + s.hit.w / 2 - g.player.x;
  const dy = s.hit.y + s.hit.h / 2 - g.player.y;
  g.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
}

function nearestSpot() {
  const p = g.player;
  let best = null;
  let bestD = Infinity;
  for (const s of visibleSpots()) {
    if (!inRect(p, s.zone)) continue;
    const d = Math.hypot(p.x - s.at.x, p.y - s.at.y);
    if (d < bestD) {
      bestD = d;
      best = s.id;
    }
  }
  return best;
}

/* ---------------- render ---------------- */

function render(t) {
  const room = g.room;
  const pl = g.player;
  if (scene.width !== room.W || scene.height !== room.H) {
    scene.width = room.W;
    scene.height = room.H;
  }
  sctx.drawImage(backgrounds[room.id], 0, 0);
  room.drawBack(sctx, t, g);

  const items = room.drawables(t, g);
  items.push({ y: pl.y, draw: (c) => drawPlayer(c, pl.x, pl.y, pl.dir, pl.frame, pl.moving) });
  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.draw(sctx);

  for (const s of room.spots) {
    if (!s.marker || !QUEST.includes(s.id)) continue;
    if (g.seen.has(s.id) && g.near !== s.id) continue;
    drawMarker(sctx, s.marker.x, s.marker.y, t + s.marker.x * 0.01, g.seen.has(s.id));
  }
  if (room.drawFront) room.drawFront(sctx, t, g);

  if (g.target && !g.target.then) {
    sctx.fillStyle = "rgba(239,232,218,0.7)";
    const tx = Math.round(g.target.x);
    const ty = Math.round(g.target.y);
    sctx.fillRect(tx - 3, ty, 7, 1);
    sctx.fillRect(tx, ty - 2, 1, 5);
  }

  const v = g.view;
  const camX = v.vw >= room.W ? (room.W - v.vw) / 2 : clamp(pl.x - v.vw / 2, 0, room.W - v.vw);
  const camY = v.vh >= room.H ? (room.H - v.vh) / 2 : clamp(pl.y - 10 - v.vh / 2, 0, room.H - v.vh);
  v.camX = camX;
  v.camY = camY;

  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#14131A";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  const s = v.scale * dpr;
  ctx.drawImage(scene, Math.round(-camX * s), Math.round(-camY * s), Math.round(room.W * s), Math.round(room.H * s));

  if (g.fade) {
    const a = g.fade < 0.5 ? g.fade * 2 : (1 - g.fade) * 2;
    ctx.fillStyle = `rgba(20,19,26,${Math.min(1, a * 1.1)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (g.near && g.started && !g.dialog && !g.fade) {
    const spot = room.spots.find((sp) => sp.id === g.near);
    const st = STATIONS[g.near];
    const quiet = spot.quiet && !g.secrets.has(spot.id);
    const label = spot.exit ? spot.label : quiet ? "?" : st.label;
    const anchor = spot.marker || { x: spot.hit.x + spot.hit.w / 2, y: spot.hit.y };
    ui.showPrompt(label, (anchor.x - camX) * v.scale, (anchor.y - camY) * v.scale - 6, !!spot.exit);
  } else ui.hidePrompt();
}

/* ---------------- loop ---------------- */

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (g.fade) {
    const before = g.fade;
    g.fade += dt * 2.6;
    if (before < 0.5 && g.fade >= 0.5 && g.pending) {
      const { room, spawn, thenOpen } = g.pending;
      g.room = room;
      g.player.x = spawn.x;
      g.player.y = spawn.y;
      g.player.dir = spawn.dir || "down";
      g.player.moving = false;
      g.near = null;
      ui.setRoom(room.name);
      if (thenOpen) {
        const spot = room.spots.find((sp) => sp.id === thenOpen);
        if (spot) goTo(spot);
      }
      g.pending = null;
    }
    if (g.fade >= 1) g.fade = 0;
  }
  if (g.started && !g.dialog && (!g.fade || g.fade > 0.5)) update(dt);
  render(now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------------- helpers ---------------- */

function screenToWorld(sx, sy) {
  const rect = canvas.getBoundingClientRect();
  const v = g.view;
  return { x: (sx - rect.left) / v.scale + v.camX, y: (sy - rect.top) / v.scale + v.camY };
}
function inRect(p, rc) {
  return p.x >= rc.x && p.x <= rc.x + rc.w && p.y >= rc.y && p.y <= rc.y + rc.h;
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// test hook
window.__workshop = { g, ROOMS, interact, jumpTo, goTo: (id) => goTo(g.room.spots.find((sp) => sp.id === id)) };
