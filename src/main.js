import { W, H, BOUNDS, SPAWN, SOLIDS, SPOTS, drawStatic, drawWall, floorDrawables } from "./world.js";
import { drawPlayer, drawMarker } from "./art.js";
import { STATIONS } from "./content.js";
import { createUI } from "./ui.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Scene is drawn at native pixel size into `scene`, then scaled up with no smoothing.
const scene = document.createElement("canvas");
scene.width = W;
scene.height = H;
const sctx = scene.getContext("2d");

const bg = document.createElement("canvas");
bg.width = W;
bg.height = H;
drawStatic(bg.getContext("2d"));

const QUEST_IDS = SPOTS.filter((s) => STATIONS[s.id].quest).map((s) => s.id);

const state = {
  player: { x: SPAWN.x, y: SPAWN.y, dir: "up", frame: 0, frameT: 0, moving: false },
  target: null, // {x, y, then: spotId?}
  stuckT: 0,
  keys: new Set(),
  near: null,
  seen: new Set(),
  dialog: null,
  started: false,
  view: { scale: 3, ox: 0, oy: 0, camX: 0, camY: 0, vw: W, vh: H },
};

try {
  const saved = JSON.parse(localStorage.getItem("workshop-seen") || "[]");
  for (const id of saved) if (STATIONS[id]) state.seen.add(id);
} catch (_) {}

const ui = createUI({
  questIds: QUEST_IDS,
  onClose: () => (state.dialog = null),
  onStart: () => {
    state.started = true;
    if (matchMedia("(hover: none)").matches) ui.toast("Tap to walk · tap things to look");
    else ui.toast("Walk up to something and press E");
  },
  onJump: (id) => goTo(SPOTS.find((s) => s.id === id)),
});
ui.updateProgress(state.seen);

/* ---------------- layout ---------------- */

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  canvas.width = Math.floor(vw * dpr);
  canvas.height = Math.floor(vh * dpr);
  canvas.style.width = vw + "px";
  canvas.style.height = vh + "px";

  // Fit the whole room when possible; on narrow screens zoom in and follow the player.
  const fit = Math.min(vw / W, (vh - 24) / H);
  let scale = fit;
  if (vw < 700) scale = Math.max(fit, Math.min((vh * 0.86) / H, 2.8));
  scale = Math.max(1, scale);
  // snap to a multiple of 1/dpr pixels-per-texel so pixels stay crisp
  const snapped = Math.floor(scale * dpr) / dpr;
  if (snapped >= scale * 0.9) scale = snapped;
  state.view.scale = scale;
  state.view.vw = vw / scale;
  state.view.vh = vh / scale;
}
window.addEventListener("resize", resize);
resize();

/* ---------------- input ---------------- */

const KEYMAP = {
  ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
};

window.addEventListener("keydown", (e) => {
  if (!state.started) {
    if (e.key === "Tab") return;
    ui.start();
    e.preventDefault();
    return;
  }
  if (state.dialog) {
    if (e.code === "Escape" || e.code === "KeyE" || e.code === "Space" || e.code === "Enter") {
      // Let Enter/Space activate a focused link or button inside the dialog.
      if ((e.code === "Enter" || e.code === "Space") && document.activeElement && ui.dialogEl.contains(document.activeElement)) return;
      e.preventDefault();
      ui.closeDialog();
    }
    return;
  }
  if (KEYMAP[e.code]) {
    state.keys.add(KEYMAP[e.code]);
    state.target = null;
    e.preventDefault();
  }
  if ((e.code === "KeyE" || e.code === "Space" || e.code === "Enter") && state.near) {
    e.preventDefault();
    openStation(state.near);
  }
});
window.addEventListener("keyup", (e) => {
  if (KEYMAP[e.code]) state.keys.delete(KEYMAP[e.code]);
});
window.addEventListener("blur", () => state.keys.clear());

canvas.addEventListener("pointerdown", (e) => {
  if (!state.started) return ui.start();
  if (state.dialog) return;
  const p = screenToWorld(e.clientX, e.clientY);
  const spot = SPOTS.find((s) => inRect(p, s.hit) || inRect(p, s.zone));
  if (spot) return goTo(spot);
  state.target = {
    x: clamp(p.x, BOUNDS.x0, BOUNDS.x1),
    y: clamp(p.y + 8, BOUNDS.y0, BOUNDS.y1), // aim the feet a little below the tap
  };
  state.stuckT = 0;
});

canvas.addEventListener("pointermove", (e) => {
  if (!state.started || state.dialog) return;
  const p = screenToWorld(e.clientX, e.clientY);
  canvas.style.cursor = SPOTS.some((s) => inRect(p, s.hit)) ? "pointer" : "default";
});

function goTo(spot) {
  if (!spot) return;
  state.target = { x: spot.at.x, y: spot.at.y, then: spot.id };
  state.stuckT = 0;
}

function openStation(id) {
  state.target = null;
  state.keys.clear();
  state.dialog = id;
  state.player.moving = false;
  if (STATIONS[id].quest && !state.seen.has(id)) {
    state.seen.add(id);
    try {
      localStorage.setItem("workshop-seen", JSON.stringify([...state.seen]));
    } catch (_) {}
    ui.updateProgress(state.seen, id);
  }
  ui.openDialog(STATIONS[id]);
  ui.hidePrompt();
}

/* ---------------- movement ---------------- */

const SPEED = 62; // logical px / second
const FEET = { w: 8, h: 4 };

function collides(x, y) {
  const fx = x - FEET.w / 2;
  const fy = y - FEET.h;
  if (fx < BOUNDS.x0 || fx + FEET.w > BOUNDS.x1 || fy < BOUNDS.y0 - FEET.h || y > BOUNDS.y1) return true;
  for (const s of SOLIDS) {
    if (fx < s.x + s.w && fx + FEET.w > s.x && fy < s.y + s.h && y > s.y) return true;
  }
  return false;
}

function update(dt) {
  const pl = state.player;
  let dx = 0;
  let dy = 0;

  if (state.keys.size) {
    if (state.keys.has("left")) dx -= 1;
    if (state.keys.has("right")) dx += 1;
    if (state.keys.has("up")) dy -= 1;
    if (state.keys.has("down")) dy += 1;
  } else if (state.target) {
    const tx = state.target.x - pl.x;
    const ty = state.target.y - pl.y;
    const dist = Math.hypot(tx, ty);
    if (dist < 2) {
      const then = state.target.then;
      state.target = null;
      if (then) {
        faceToward(then);
        openStation(then);
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

    // click-to-move gives up if blocked, but still opens the station if we're in its zone
    if (state.target) {
      const moved = Math.hypot(pl.x - bx, pl.y - by);
      state.stuckT = moved < step * 0.2 ? state.stuckT + dt : 0;
      if (state.stuckT > 0.25) {
        const then = state.target.then;
        state.target = null;
        if (then && nearestSpot() === then) openStation(then);
      }
    }
  } else {
    pl.frame = 0;
  }

  state.near = state.dialog ? null : nearestSpot();
}

function faceToward(id) {
  const s = SPOTS.find((sp) => sp.id === id);
  const cx = s.hit.x + s.hit.w / 2;
  const cy = s.hit.y + s.hit.h / 2;
  const dx = cx - state.player.x;
  const dy = cy - state.player.y;
  state.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
}

function nearestSpot() {
  const p = state.player;
  let best = null;
  let bestD = Infinity;
  for (const s of SPOTS) {
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
  const pl = state.player;
  sctx.drawImage(bg, 0, 0);
  drawWall(sctx, t);

  const items = floorDrawables(t, state.near === "cat" || state.dialog === "cat");
  items.push({ y: pl.y, draw: (c) => drawPlayer(c, pl.x, pl.y, pl.dir, pl.frame, pl.moving) });
  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.draw(sctx);

  // markers over undiscovered stations
  for (const s of SPOTS) {
    if (!s.marker || !STATIONS[s.id].quest) continue;
    if (state.seen.has(s.id) && state.near !== s.id) continue;
    drawMarker(sctx, s.marker.x, s.marker.y, t + s.marker.x * 0.01, state.seen.has(s.id));
  }

  // tap target ring
  if (state.target && !state.target.then) {
    sctx.fillStyle = "rgba(239,232,218,0.7)";
    const tx = Math.round(state.target.x);
    const ty = Math.round(state.target.y);
    sctx.fillRect(tx - 3, ty, 7, 1);
    sctx.fillRect(tx, ty - 2, 1, 5);
  }

  // camera
  const v = state.view;
  const camX = v.vw >= W ? (W - v.vw) / 2 : clamp(pl.x - v.vw / 2, 0, W - v.vw);
  const camY = v.vh >= H ? (H - v.vh) / 2 : clamp(pl.y - 10 - v.vh / 2, 0, H - v.vh);
  v.camX = camX;
  v.camY = camY;

  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#14131A";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  const s = v.scale * dpr;
  ctx.drawImage(scene, Math.round(-camX * s), Math.round(-camY * s), Math.round(W * s), Math.round(H * s));

  // prompt bubble, positioned in screen space
  if (state.near && state.started && !state.dialog) {
    const spot = SPOTS.find((sp) => sp.id === state.near);
    const anchor = spot.marker || { x: spot.hit.x + spot.hit.w / 2, y: spot.hit.y };
    ui.showPrompt(STATIONS[state.near].label, (anchor.x - camX) * v.scale, (anchor.y - camY) * v.scale - 6);
  } else {
    ui.hidePrompt();
  }
}

/* ---------------- loop ---------------- */

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (state.started && !state.dialog) update(dt);
  render(now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------------- helpers ---------------- */

function screenToWorld(sx, sy) {
  const rect = canvas.getBoundingClientRect();
  const v = state.view;
  return { x: (sx - rect.left) / v.scale + v.camX, y: (sy - rect.top) / v.scale + v.camY };
}
function inRect(p, r) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// test hook
window.__workshop = { state, openStation, goTo: (id) => goTo(SPOTS.find((s) => s.id === id)) };
