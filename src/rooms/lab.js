// Tanilytics, laid out as a room you can walk along. Events ride the belt from
// the browser on the left to ClickHouse on the right; the services that read
// them back sit at the end, under the dashboard.
import { P } from "../palette.js";
import * as A from "../art.js";
import { r, hash } from "../art.js";
import { drawText, drawTextCentered } from "../font.js";

const W = 528;
const H = 224;
const WALL_Y = 64;
const BELT_Y = 102;
const BELT_X0 = 40;
const BELT_X1 = 352;
const BLOOM_X = 150; // duplicates drop here
const ANON_X = 292; // IPs get hashed here

function drawShell(ctx) {
  r(ctx, 0, 0, W, WALL_Y, P.labWall);
  // wall panels
  for (let x = 0; x < W; x += 32) {
    r(ctx, x, 6, 1, WALL_Y - 6, P.labWallDark);
    r(ctx, x + 1, 6, 1, WALL_Y - 6, P.labWallLight);
  }
  r(ctx, 0, 0, W, 6, P.labWallDark);
  for (let x = 4; x < W; x += 24) r(ctx, x, 2, 10, 2, "#4A5366");
  r(ctx, 0, WALL_Y - 3, W, 3, P.labWallDark);

  // floor
  for (let y = WALL_Y; y < H; y += 16) {
    for (let x = 0; x < W; x += 16) {
      const alt = ((x / 16 + (y - WALL_Y) / 16) | 0) % 2 === 0;
      r(ctx, x, y, 16, 16, alt ? P.labFloor : P.labFloorAlt);
      r(ctx, x, y, 16, 1, P.labLine);
      r(ctx, x, y, 1, 16, P.labLine);
      if (hash(x, y) > 0.85) r(ctx, x + 6, y + 7, 2, 1, P.labLine);
    }
  }
  // hazard stripe along the machine line
  for (let x = 8; x < W - 8; x += 6) {
    r(ctx, x, 112, 3, 2, P.hazard);
    r(ctx, x + 3, 112, 3, 2, P.ink);
  }
  // walls & entrance on the left
  r(ctx, 0, 0, 8, H, P.labWallDark);
  r(ctx, W - 8, 0, 8, H, P.labWallDark);
  r(ctx, 0, 128, 8, 46, "#5C4A3A");
  r(ctx, 0, 126, 10, 2, P.metalLight);
  r(ctx, 0, 174, 10, 2, P.metalLight);
  for (let y = 132; y < 172; y += 5) r(ctx, 2, y, 3, 2, P.tileA);
  r(ctx, 0, H - 8, W, 8, P.labWallDark);

  // big sign
  r(ctx, 150, 8, 140, 16, P.labWallDark);
  r(ctx, 151, 9, 138, 14, "#1F242E");
  drawTextCentered(ctx, "TANILYTICS", 220, 11, P.go, 2);
}

/* ---------- machines ---------- */

function labelPlate(ctx, cx, y, text, col) {
  const w = text.length * 4 + 3;
  r(ctx, Math.round(cx - w / 2), y, w, 8, P.ink);
  drawTextCentered(ctx, text, cx, y + 2, col);
}

function drawKiosk(ctx, x, y, t) {
  // a browser on a stand — the tracked website
  r(ctx, x + 14, y + 24, 4, 20, P.metal);
  r(ctx, x + 8, y + 43, 16, 2, P.metal);
  r(ctx, x, y, 32, 26, P.metalDark);
  r(ctx, x + 2, y + 2, 28, 22, P.board);
  r(ctx, x + 2, y + 2, 28, 4, "#D9DCE2");
  r(ctx, x + 3, y + 3, 2, 2, P.ledRed);
  r(ctx, x + 6, y + 3, 2, 2, P.ledAmber);
  r(ctx, x + 9, y + 3, 2, 2, P.ledGreen);
  r(ctx, x + 4, y + 9, 14, 2, P.inkSoft);
  r(ctx, x + 4, y + 13, 22, 1, "#AAB0BC");
  r(ctx, x + 4, y + 15, 18, 1, "#AAB0BC");
  r(ctx, x + 4, y + 18, 9, 4, P.zellige);
  // cursor clicking
  const cx = x + 18 + Math.round(Math.sin(t * 0.9) * 4);
  const cy = y + 17 + Math.round(Math.cos(t * 1.3) * 2);
  r(ctx, cx, cy, 1, 4, P.ink);
  r(ctx, cx + 1, cy + 1, 1, 2, P.ink);
  r(ctx, cx + 2, cy + 2, 1, 1, P.ink);
  labelPlate(ctx, x + 16, y - 10, "SDK", P.code4);
}

function drawGate(ctx, x, y, t, limited) {
  // Kong: an arch the belt passes through
  r(ctx, x, y, 6, 46, P.kong);
  r(ctx, x + 26, y, 6, 46, P.kong);
  r(ctx, x, y, 32, 8, P.kong);
  r(ctx, x + 2, y + 2, 28, 4, "#128078");
  r(ctx, x + 5, y + 8, 1, 38, "#128078");
  r(ctx, x + 31, y + 8, 1, 38, "#128078");
  r(ctx, x + 13, y + 10, 6, 6, P.ink);
  r(ctx, x + 14, y + 11, 4, 4, limited ? P.ledRed : P.ledGreen);
  labelPlate(ctx, x + 16, y - 10, "KONG", P.kong);
}

function drawIngest(ctx, x, y, t) {
  // intake funnel + Go machine + Bloom sieve
  r(ctx, x, y + 6, 52, 40, P.metal);
  r(ctx, x + 2, y + 8, 48, 36, P.metalLight);
  r(ctx, x + 2, y + 8, 48, 3, P.go);
  r(ctx, x + 6, y + 14, 18, 12, P.screen);
  for (let i = 0; i < 4; i++) r(ctx, x + 8, y + 16 + i * 2, 4 + ((hash(i, Math.floor(t * 2)) * 10) | 0), 1, P.go);
  // Bloom sieve
  r(ctx, x + 30, y + 14, 16, 12, P.ink);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) r(ctx, x + 32 + j * 4, y + 16 + i * 4, 2, 2, hash(i * 4 + j, Math.floor(t * 3)) > 0.5 ? P.ledAmber : "#3A3530");
  r(ctx, x + 6, y + 30, 40, 2, P.metal);
  r(ctx, x + 6, y + 34, 40, 1, P.metal);
  // gopher-ish ears, because Go
  r(ctx, x + 4, y + 2, 4, 4, P.go);
  r(ctx, x + 44, y + 2, 4, 4, P.go);
  labelPlate(ctx, x + 26, y - 10, "INGEST", P.go);
  // reject bin for duplicates
  r(ctx, BLOOM_X - 6, BELT_Y + 9, 14, 8, P.metalDark);
  r(ctx, BLOOM_X - 5, BELT_Y + 9, 12, 1, P.metalLight);
  drawText(ctx, "DUP", BLOOM_X - 5, BELT_Y + 11, P.ledAmber);
}

function drawRedpanda(ctx, x, y, t) {
  // three brokers
  for (let i = 0; i < 3; i++) {
    const bx = x + i * 22;
    r(ctx, bx, y + 4, 18, 42, P.pandaDark);
    r(ctx, bx + 1, y + 2, 16, 42, P.panda);
    r(ctx, bx + 3, y, 12, 3, P.panda);
    r(ctx, bx + 3, y + 6, 2, 34, "rgba(255,255,255,0.18)");
    // fill level moving up and down = consumer lag
    const lvl = 10 + Math.round((Math.sin(t * 0.7 + i * 1.7) + 1) * 8);
    r(ctx, bx + 12, y + 8, 3, 30, P.pandaDark);
    r(ctx, bx + 12, y + 38 - lvl, 3, lvl, P.ledAmber);
    drawText(ctx, String(i), bx + 6, y + 10, P.white);
    // pipe down to the belt
    r(ctx, bx + 7, y + 46, 4, 4, P.metalLight);
  }
  labelPlate(ctx, x + 22, y - 10, "REDPANDA", P.panda);
}

function drawPandaPlush(ctx, x, y, t) {
  const b = Math.floor(t * 0.5) % 6 === 0 ? 1 : 0;
  r(ctx, x, y + 3 - b, 9, 6, P.panda);
  r(ctx, x + 1, y - b, 7, 4, P.panda);
  r(ctx, x, y - 1 - b, 2, 2, P.pandaDark);
  r(ctx, x + 7, y - 1 - b, 2, 2, P.pandaDark);
  r(ctx, x + 2, y + 1 - b, 5, 2, P.white);
  r(ctx, x + 3, y + 1 - b, 1, 1, P.ink);
  r(ctx, x + 5, y + 1 - b, 1, 1, P.ink);
  r(ctx, x + 1, y + 7 - b, 2, 2, P.pandaDark);
  r(ctx, x + 6, y + 7 - b, 2, 2, P.pandaDark);
  r(ctx, x + 9, y + 5 - b, 3, 2, P.pandaDark);
}

function drawProcessor(ctx, x, y, t) {
  r(ctx, x, y + 6, 52, 40, P.metal);
  r(ctx, x + 2, y + 8, 48, 36, P.metalLight);
  r(ctx, x + 2, y + 8, 48, 3, P.go);
  const steps = ["GEO", "IP", "UA", "SES"];
  const active = Math.floor(t * 2.5) % 4;
  for (let i = 0; i < 4; i++) {
    const sx = x + 4 + i * 12;
    r(ctx, sx, y + 14, 11, 9, P.ink);
    drawText(ctx, steps[i], sx + (steps[i].length === 2 ? 2 : 0), y + 16, i === active ? P.go : "#4A5366");
  }
  // shredder teeth
  for (let i = 0; i < 10; i++) r(ctx, x + 8 + i * 4, y + 30 + (i % 2), 2, 4, P.metalDark);
  r(ctx, x + 6, y + 28, 40, 2, P.ink);
  labelPlate(ctx, x + 26, y - 10, "PROCESS", P.go);
}

function drawClickhouse(ctx, x, y, t) {
  // columnar storage: literal columns
  r(ctx, x, y - 10, 44, 56, P.ink);
  for (let i = 0; i < 6; i++) {
    const cx = x + 3 + i * 7;
    r(ctx, cx, y - 7, 5, 50, "#2A2A22");
    const fill = 20 + ((hash(i, 1) * 26) | 0) + Math.round(Math.sin(t + i) * 2);
    r(ctx, cx, y + 43 - fill, 5, fill, i === 5 ? "#C9A92E" : P.ch);
  }
  labelPlate(ctx, x + 22, y - 20, "CLICKHOUSE", P.ch);
}

function drawRedis(ctx, x, y, t) {
  r(ctx, x, y + 6, 24, 40, "#8E2219");
  r(ctx, x + 1, y + 7, 22, 38, P.redis);
  r(ctx, x + 3, y + 10, 18, 10, P.ink);
  // HyperLogLog-ish counter
  const n = 1200 + Math.floor(t * 7) % 300;
  drawText(ctx, String(n), x + 4, y + 13, P.ledGreen);
  for (let i = 0; i < 4; i++) r(ctx, x + 4 + i * 5, y + 26, 3, 2, Math.floor(t * 4 + i) % 3 ? P.ledGreen : P.ledOff);
  r(ctx, x + 3, y + 32, 18, 1, "#8E2219");
  r(ctx, x + 3, y + 36, 18, 1, "#8E2219");
  labelPlate(ctx, x + 12, y - 10, "REDIS", P.redis);
}

function drawService(ctx, x, y, name, t, i) {
  r(ctx, x, y + 10, 16, 36, P.metalDark);
  r(ctx, x + 1, y + 11, 14, 34, P.metal);
  r(ctx, x + 1, y + 11, 14, 2, P.spring);
  for (let k = 0; k < 5; k++) r(ctx, x + 3, y + 16 + k * 5, 10, 1, P.metalLight);
  r(ctx, x + 3, y + 40, 2, 2, Math.floor(t * 3 + i) % 2 ? P.spring : P.ledOff);
  drawText(ctx, name, x + 1, y + 2, P.spring);
}

function drawVault(ctx, x, y, t) {
  r(ctx, x, y + 10, 22, 36, "#4B5160");
  r(ctx, x + 1, y + 11, 20, 34, "#5F6676");
  // round vault door with a dial that turns
  r(ctx, x + 4, y + 16, 14, 14, "#7B8395");
  r(ctx, x + 6, y + 14, 10, 18, "#7B8395");
  const a = t * 1.2;
  r(ctx, x + 10 + Math.round(Math.cos(a) * 3), y + 22 + Math.round(Math.sin(a) * 3), 2, 2, P.ink);
  r(ctx, x + 10, y + 22, 2, 2, P.ochre);
  // little clock: midnight salt rotation
  r(ctx, x + 6, y + 36, 10, 6, P.ink);
  drawText(ctx, "00", x + 7, y + 37, P.ledAmber);
  drawText(ctx, "GDPR", x + 3, y + 2, P.spring);
}

function drawDashboard(ctx, x, y, t) {
  r(ctx, x, y, 44, 32, P.metalDark);
  r(ctx, x + 2, y + 2, 40, 28, "#101722");
  // live line chart scrolling left
  let prev = null;
  for (let i = 0; i < 36; i++) {
    const v = Math.sin((i + t * 3) * 0.35) * 5 + Math.sin((i + t * 3) * 0.11) * 4;
    const py = Math.round(y + 18 - v);
    r(ctx, x + 4 + i, py, 1, 1, P.code1);
    if (prev !== null && Math.abs(prev - py) > 1) r(ctx, x + 4 + i, Math.min(prev, py), 1, Math.abs(prev - py), P.code1);
    prev = py;
  }
  r(ctx, x + 4, y + 25, 8, 2, P.code2);
  r(ctx, x + 14, y + 25, 12, 2, P.code3);
  r(ctx, x + 28, y + 25, 6, 2, P.code4);
  // LIVE dot
  if (Math.floor(t * 2) % 2) r(ctx, x + 36, y + 4, 3, 3, P.ledRed);
  r(ctx, x + 20, y + 32, 4, 12, P.metal);
  labelPlate(ctx, x + 22, y - 10, "DASHBOARD", P.next);
}

function drawBelt(ctx, t) {
  r(ctx, BELT_X0 - 4, BELT_Y, BELT_X1 - BELT_X0 + 8, 8, P.metalDark);
  r(ctx, BELT_X0 - 4, BELT_Y + 1, BELT_X1 - BELT_X0 + 8, 5, "#2A2E36");
  const off = Math.floor(t * 20) % 6;
  for (let x = BELT_X0 - 4 + off; x < BELT_X1 + 4; x += 6) r(ctx, x, BELT_Y + 3, 3, 1, "#3E4450");
  for (let x = BELT_X0; x < BELT_X1; x += 24) r(ctx, x, BELT_Y + 8, 2, 4, P.metal);
}

// Packets riding the belt. Every 7th one is a duplicate and drops into the bin at the Bloom filter.
function drawPackets(ctx, t) {
  const L = BELT_X1 - BELT_X0;
  const n = 12;
  for (let i = 0; i < n; i++) {
    const p = ((t * 26 + (i * L) / n) % L) / L;
    const x = BELT_X0 + p * L;
    const cycle = Math.floor((t * 26 + (i * L) / n) / L);
    const dup = (i + cycle) % 7 === 0;
    if (dup && x > BLOOM_X) {
      const fall = x - BLOOM_X;
      if (fall < 10) r(ctx, BLOOM_X + Math.round(fall * 0.2), BELT_Y - 1 + Math.round(fall), 4, 3, P.ledAmber);
      continue;
    }
    const hashed = x > ANON_X;
    const y = BELT_Y - 2;
    r(ctx, Math.round(x), y, 5, 4, dup ? P.ledAmber : hashed ? P.packetHashed : P.packet);
    r(ctx, Math.round(x), y, 5, 1, "rgba(255,255,255,0.35)");
    if (!hashed && !dup) r(ctx, Math.round(x) + 1, y + 2, 3, 1, P.inkSoft);
    if (hashed) r(ctx, Math.round(x) + 1, y + 2, 1, 1, P.inkSoft), r(ctx, Math.round(x) + 3, y + 2, 1, 1, P.inkSoft);
  }
}

// Data flowing on the wall cable from storage to the services and up to the screen.
function drawCable(ctx, t) {
  const pts = [
    [372, 54], [372, 58], [470, 58], [470, 46], [482, 46],
  ];
  ctx.fillStyle = "#4A5366";
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0) + 1, Math.abs(y1 - y0) + 1);
  }
  const total = 4 + 98 + 12 + 12;
  for (let k = 0; k < 4; k++) {
    let d = (t * 30 + (k * total) / 4) % total;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const seg = Math.abs(x1 - x0) + Math.abs(y1 - y0);
      if (d <= seg) {
        const f = d / seg;
        r(ctx, Math.round(x0 + (x1 - x0) * f), Math.round(y0 + (y1 - y0) * f), 2, 2, P.ch);
        break;
      }
      d -= seg;
    }
  }
}

function drawOpsDesk(ctx, x, y, t) {
  r(ctx, x + 2, y + 22, 64, 4, P.shadow);
  r(ctx, x, y + 10, 64, 14, P.metalDark);
  r(ctx, x, y + 8, 64, 4, P.metal);
  // screens: k8s pods, a Prometheus graph, a Jaeger trace
  r(ctx, x + 2, y - 10, 18, 16, P.ink);
  for (let i = 0; i < 9; i++) r(ctx, x + 4 + (i % 3) * 5, y - 8 + Math.floor(i / 3) * 4, 3, 3, i === Math.floor(t) % 9 ? P.ledAmber : P.blueLight);
  r(ctx, x + 23, y - 10, 18, 16, P.ink);
  for (let i = 0; i < 14; i++) {
    const v = 3 + ((hash(i, Math.floor(t * 2 + i)) * 8) | 0);
    r(ctx, x + 25 + i, y + 4 - v, 1, v, "#E6522C");
  }
  r(ctx, x + 44, y - 10, 18, 16, P.ink);
  const spans = [[0, 14], [2, 6], [4, 8], [8, 5], [3, 3]];
  spans.forEach(([s, l], i) => r(ctx, x + 46 + s, y - 8 + i * 3, l, 2, i ? "#7FD1B9" : "#60D0E4"));
  r(ctx, x + 6, y + 6, 22, 2, P.metalLight);
  labelPlate(ctx, x + 32, y - 20, "OPS", P.blueLight);
}

function drawDuck(ctx, x, y, t) {
  const bob = Math.floor(t * 1.5) % 4 === 0 ? 1 : 0;
  r(ctx, x, y + 2 + bob, 8, 5, P.ochre);
  r(ctx, x + 4, y - 1 + bob, 5, 4, P.ochre);
  r(ctx, x + 9, y + 1 + bob, 2, 1, "#E07A2C");
  r(ctx, x + 7, y + bob, 1, 1, P.ink);
  r(ctx, x + 1, y + 3 + bob, 3, 1, "#C99A35");
}

function drawEasel(ctx, x, y) {
  r(ctx, x + 2, y + 34, 40, 3, P.shadow);
  r(ctx, x + 4, y + 10, 2, 26, P.woodDark);
  r(ctx, x + 38, y + 10, 2, 26, P.woodDark);
  r(ctx, x, y, 44, 30, P.board);
  r(ctx, x, y, 44, 1, P.metalLight);
  drawText(ctx, "GZIP", x + 3, y + 3, P.inkSoft);
  // two bars: plain vs gzip
  r(ctx, x + 4, y + 12, 34, 5, P.markerRed);
  r(ctx, x + 4, y + 20, 2, 5, P.zellige);
  drawText(ctx, "-94%", x + 9, y + 20, P.zellige);
}

function drawSign(ctx, x, y) {
  r(ctx, x + 2, y + 24, 30, 3, P.shadow);
  r(ctx, x + 14, y + 14, 4, 12, P.metal);
  r(ctx, x, y, 32, 16, P.go);
  r(ctx, x + 1, y + 1, 30, 14, P.ink);
  drawTextCentered(ctx, "START", x + 16, y + 3, P.go);
  drawTextCentered(ctx, "HERE", x + 16, y + 9, P.white);
}

export const lab = {
  id: "lab",
  name: "Tanilytics lab",
  W,
  H,
  bounds: { x0: 4, y0: 120, x1: W - 12, y1: H - 12 },
  solids: [
    { x: 60, y: 166, w: 64, h: 14 }, // ops desk
    { x: 196, y: 184, w: 44, h: 6 }, // easel
    { x: 30, y: 176, w: 6, h: 6 }, // start sign post
    { x: 486, y: 192, w: 26, h: 12 }, // plant
  ],
  spots: [
    { id: "intro", zone: { x: 16, y: 174, w: 40, h: 22 }, at: { x: 34, y: 194 }, marker: { x: 32, y: 152 }, hit: { x: 16, y: 156, w: 32, h: 28 } },
    { id: "sdk", zone: { x: 18, y: 120, w: 40, h: 16 }, at: { x: 38, y: 126 }, marker: { x: 38, y: 34 }, hit: { x: 22, y: 50, w: 32, h: 50 } },
    { id: "gateway", zone: { x: 64, y: 120, w: 38, h: 16 }, at: { x: 84, y: 126 }, marker: { x: 84, y: 34 }, hit: { x: 68, y: 50, w: 32, h: 50 } },
    { id: "ingest", zone: { x: 108, y: 120, w: 60, h: 16 }, at: { x: 136, y: 126 }, marker: { x: 140, y: 34 }, hit: { x: 114, y: 50, w: 52, h: 58 } },
    { id: "stream", zone: { x: 176, y: 120, w: 52, h: 16 }, at: { x: 202, y: 126 }, marker: { x: 214, y: 34 }, hit: { x: 182, y: 50, w: 46, h: 52 } },
    { id: "panda", zone: { x: 228, y: 120, w: 26, h: 16 }, at: { x: 240, y: 126 }, hit: { x: 230, y: 40, w: 16, h: 14 }, quiet: true },
    { id: "processing", zone: { x: 258, y: 120, w: 60, h: 16 }, at: { x: 290, y: 126 }, marker: { x: 290, y: 34 }, hit: { x: 264, y: 50, w: 52, h: 52 } },
    { id: "clickhouse", zone: { x: 324, y: 120, w: 52, h: 16 }, at: { x: 350, y: 126 }, marker: { x: 350, y: 24 }, hit: { x: 328, y: 40, w: 44, h: 62 } },
    { id: "redis", zone: { x: 378, y: 120, w: 32, h: 16 }, at: { x: 394, y: 126 }, marker: { x: 394, y: 34 }, hit: { x: 382, y: 50, w: 24, h: 50 } },
    { id: "services", zone: { x: 412, y: 120, w: 38, h: 16 }, at: { x: 430, y: 126 }, marker: { x: 430, y: 40 }, hit: { x: 414, y: 52, w: 36, h: 48 } },
    { id: "privacy", zone: { x: 450, y: 120, w: 28, h: 16 }, at: { x: 464, y: 126 }, marker: { x: 464, y: 40 }, hit: { x: 454, y: 52, w: 22, h: 48 } },
    { id: "dashboard", zone: { x: 478, y: 120, w: 40, h: 16 }, at: { x: 498, y: 126 }, marker: { x: 498, y: 6 }, hit: { x: 478, y: 14, w: 44, h: 46 } },
    { id: "ops", zone: { x: 56, y: 180, w: 56, h: 20 }, at: { x: 84, y: 190 }, marker: { x: 92, y: 126 }, hit: { x: 60, y: 134, w: 64, h: 46 } },
    { id: "duck", zone: { x: 112, y: 168, w: 22, h: 30 }, at: { x: 128, y: 184 }, hit: { x: 108, y: 158, w: 14, h: 10 }, quiet: true },
    { id: "bench", zone: { x: 190, y: 190, w: 56, h: 18 }, at: { x: 218, y: 198 }, marker: { x: 218, y: 148 }, hit: { x: 196, y: 152, w: 44, h: 38 } },
    { id: "toHouse", label: "House", zone: { x: 4, y: 128, w: 22, h: 46 }, at: { x: 6, y: 152 }, hit: { x: 0, y: 124, w: 12, h: 54 },
      exit: { to: "workshop", trigger: { x: 0, y: 130, w: 9, h: 42 } } },
  ],
  arrivals: { workshop: { x: 26, y: 152, dir: "right" } },

  drawStatic(ctx) {
    drawShell(ctx);
  },
  drawBack(ctx, t, g) {
    // ceiling lights pulse slowly
    for (let x = 40; x < W; x += 96) {
      const a = 0.05 + (Math.sin(t * 1.2 + x) + 1) * 0.02;
      ctx.fillStyle = `rgba(87,196,220,${a})`;
      ctx.fillRect(x - 20, 6, 40, 4);
    }
    drawCable(ctx, t);
    drawKiosk(ctx, 22, 56, t);
    drawGate(ctx, 68, 56, t, Math.floor(t / 3) % 5 === 0);
    drawIngest(ctx, 114, 56, t);
    drawRedpanda(ctx, 182, 52, t);
    drawPandaPlush(ctx, 232, 44, t);
    drawProcessor(ctx, 264, 56, t);
    drawClickhouse(ctx, 328, 56, t);
    drawRedis(ctx, 382, 56, t);
    drawService(ctx, 414, 56, "AUTH", t, 0);
    drawService(ctx, 432, 56, "QRY", t, 1);
    drawVault(ctx, 454, 56, t);
    drawDashboard(ctx, 478, 18, t);
    drawBelt(ctx, t);
    drawPackets(ctx, t);
    // belt passes through the gate: redraw its front post on top
    r(ctx, 94, 56 + 8, 6, 46, P.kong);
  },
  drawables(t, g) {
    return [
      { y: 180, draw: (c) => drawOpsDesk(c, 60, 156, t) },
      { y: 181, draw: (c) => drawDuck(c, 110, 160, t) },
      { y: 190, draw: (c) => drawEasel(c, 196, 154) },
      { y: 182, draw: (c) => drawSign(c, 16, 160) },
      { y: 204, draw: (c) => A.drawPlant(c, 490, 182, "fern", t) },
    ];
  },
};
