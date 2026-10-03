// The roof terrace: Jebel Dyr and the Kasbah across the old town.
import { P } from "../palette.js";
import * as A from "../art.js";
import { r, hash } from "../art.js";
import { drawLandscape, drawSnow } from "../kef.js";

const W = 384;
const H = 224;
const FLOOR_Y = 112;

function drawShell(ctx) {
  // floor: pale cement tiles, typical of flat roofs
  for (let y = FLOOR_Y; y < H; y += 12) {
    for (let x = 0; x < W; x += 12) {
      const alt = ((x / 12 + (y - FLOOR_Y) / 12) | 0) % 2 === 0;
      r(ctx, x, y, 12, 12, alt ? "#D8CDB8" : "#CFC3AC");
      r(ctx, x, y, 12, 1, "#B9AC93");
      r(ctx, x, y, 1, 12, "#B9AC93");
      if (hash(x, y) > 0.8) r(ctx, x + 4, y + 5, 2, 1, "#B9AC93");
    }
  }
  // drain channel and front edge
  r(ctx, 0, H - 10, W, 10, P.lime);
  r(ctx, 0, H - 10, W, 1, P.limeShade);
  r(ctx, 0, H - 4, W, 1, P.limeShade);
  // side parapets
  r(ctx, 0, FLOOR_Y - 18, 8, H, P.lime);
  r(ctx, 7, FLOOR_Y - 18, 1, H, P.limeShade);
  r(ctx, W - 8, FLOOR_Y - 18, 8, H, P.lime);
  r(ctx, W - 8, FLOOR_Y - 18, 1, H, P.limeShade);

  // stairwell opening back down to the house
  const sx = 174;
  const sy = 188;
  r(ctx, sx - 2, sy - 2, 40, 26, P.limeShade);
  r(ctx, sx, sy, 36, 24, "#4A3C30");
  for (let i = 0; i < 5; i++) {
    r(ctx, sx + 2, sy + 2 + i * 5, 32, 3, i % 2 ? "#6B5847" : "#7A6552");
    r(ctx, sx + 2, sy + 4 + i * 5, 32, 1, "#3A2F25");
  }
  r(ctx, sx - 2, sy - 2, 2, 26, P.woodDark);
  r(ctx, sx + 36, sy - 2, 2, 26, P.woodDark);
}

function drawParapet(ctx) {
  // low lime-washed wall with the view above it
  r(ctx, 8, FLOOR_Y - 18, W - 16, 18, P.lime);
  r(ctx, 8, FLOOR_Y - 18, W - 16, 3, "#F6F0E4");
  r(ctx, 8, FLOOR_Y - 15, W - 16, 1, P.limeShade);
  r(ctx, 8, FLOOR_Y - 1, W - 16, 1, P.limeShade);
  for (let x = 12; x < W - 12; x += 2) if (hash(x, 4) > 0.9) r(ctx, x, FLOOR_Y - 10 + ((hash(x, 1) * 6) | 0), 1, 1, P.limeShade);
  ctx.fillStyle = "rgba(27,26,34,0.12)";
  ctx.fillRect(8, FLOOR_Y, W - 16, 4);
}

function drawTelescope(ctx, x, y, t) {
  r(ctx, x, y + 26, 16, 3, P.shadow);
  r(ctx, x + 7, y + 10, 2, 16, P.metal);
  r(ctx, x + 2, y + 25, 12, 1, P.metal);
  r(ctx, x + 3, y + 23, 1, 3, P.metal);
  r(ctx, x + 12, y + 23, 1, 3, P.metal);
  r(ctx, x + 1, y + 4, 14, 5, P.ochreDeep);
  r(ctx, x + 1, y + 4, 14, 1, P.ochre);
  r(ctx, x + 13, y + 3, 4, 7, P.ochre);
  r(ctx, x, y + 5, 2, 3, P.ink);
  if (Math.floor(t * 0.7) % 4 === 0) r(ctx, x + 15, y + 5, 1, 1, P.white);
}

function drawColumn(ctx, x, y) {
  // fallen drum + a short standing shaft with a worn capital
  r(ctx, x - 2, y + 30, 40, 4, P.shadow);
  r(ctx, x + 18, y + 18, 20, 14, "#D9CFBC");
  r(ctx, x + 18, y + 18, 20, 2, "#E9E2D3");
  for (let i = 0; i < 4; i++) r(ctx, x + 20 + i * 5, y + 20, 1, 12, "#BDB19A");
  r(ctx, x + 36, y + 20, 2, 12, "#C9BEA9");
  r(ctx, x + 2, y + 4, 12, 28, "#E2D9C7");
  for (let i = 0; i < 3; i++) r(ctx, x + 4 + i * 4, y + 6, 1, 26, "#C2B59C");
  r(ctx, x, y, 16, 5, "#D3C8B3");
  r(ctx, x - 1, y + 2, 2, 2, "#C2B59C");
  r(ctx, x + 15, y + 2, 2, 2, "#C2B59C");
  r(ctx, x + 6, y + 14, 3, 2, "#A99C84");
}

function drawTank(ctx, x, y) {
  r(ctx, x, y + 38, 40, 4, P.shadow);
  r(ctx, x + 4, y + 24, 2, 16, P.metal);
  r(ctx, x + 34, y + 24, 2, 16, P.metal);
  r(ctx, x + 2, y + 24, 36, 2, P.metal);
  r(ctx, x, y + 4, 40, 20, "#2B2B30");
  r(ctx, x + 2, y + 2, 36, 2, "#2B2B30");
  r(ctx, x + 3, y + 5, 34, 2, "#45454C");
  for (let i = 0; i < 4; i++) r(ctx, x + 6 + i * 9, y + 8, 1, 14, "#3A3A41");
  r(ctx, x + 16, y, 8, 3, "#3A3A41");
  r(ctx, x + 38, y + 18, 6, 2, P.metalLight);
}

function drawDish(ctx, x, y) {
  r(ctx, x + 6, y + 10, 2, 8, P.metalLight);
  r(ctx, x, y, 14, 10, "#E8E6E0");
  r(ctx, x + 1, y + 1, 12, 8, "#D6D3CB");
  r(ctx, x + 6, y + 4, 4, 1, P.metal);
  r(ctx, x + 10, y + 3, 2, 3, P.metal);
}

function drawTable(ctx, x, y, t, eaten) {
  r(ctx, x, y + 18, 34, 3, P.shadow);
  r(ctx, x + 3, y + 8, 2, 11, P.woodDark);
  r(ctx, x + 29, y + 8, 2, 11, P.woodDark);
  r(ctx, x, y + 4, 34, 6, P.woodLight);
  r(ctx, x, y + 9, 34, 2, P.wood);
  // bowl of borzgane
  r(ctx, x + 10, y + 1, 14, 5, P.white);
  r(ctx, x + 9, y + 1, 16, 1, "#E7E2D8");
  if (!eaten) {
    r(ctx, x + 11, y - 1, 12, 2, "#E9C77C");
    r(ctx, x + 13, y - 2, 2, 1, "#6B3A1E");
    r(ctx, x + 18, y - 1, 2, 1, "#6B3A1E");
    r(ctx, x + 16, y - 2, 1, 1, P.markerRed);
    for (let i = 0; i < 2; i++) {
      const k = (t * 5 + i * 5) % 10;
      ctx.fillStyle = `rgba(255,255,255,${0.5 - k / 20})`;
      ctx.fillRect(x + 14 + i * 4, Math.round(y - 4 - k), 1, 2);
    }
  }
  // two stools
  r(ctx, x - 10, y + 10, 8, 3, P.green);
  r(ctx, x - 9, y + 13, 1, 6, P.greenDeep);
  r(ctx, x - 4, y + 13, 1, 6, P.greenDeep);
  r(ctx, x + 36, y + 10, 8, 3, P.green);
  r(ctx, x + 37, y + 13, 1, 6, P.greenDeep);
  r(ctx, x + 42, y + 13, 1, 6, P.greenDeep);
}

function drawLaundry(ctx, t) {
  // a washing line between two poles, swaying
  const x0 = 236;
  const x1 = 352;
  const y0 = 126;
  r(ctx, x0, y0, 2, 30, P.woodDark);
  r(ctx, x1, y0, 2, 30, P.woodDark);
  r(ctx, x0 - 2, y0 + 29, 6, 2, P.shadow);
  r(ctx, x1 - 2, y0 + 29, 6, 2, P.shadow);
  for (let x = x0 + 2; x < x1; x++) {
    const sag = Math.round(Math.sin(((x - x0) / (x1 - x0)) * Math.PI) * 3);
    r(ctx, x, y0 + 1 + sag, 1, 1, "#8A8478");
  }
  const clothes = [
    [250, 12, 10, "#C8102E"],
    [266, 9, 13, P.white],
    [282, 14, 8, P.blue],
    [302, 10, 12, P.ochre],
    [320, 12, 9, P.greenLight],
  ];
  for (const [cx, cw, ch, col] of clothes) {
    const sag = Math.round(Math.sin(((cx - x0) / (x1 - x0)) * Math.PI) * 3);
    const sw = Math.round(Math.sin(t * 1.6 + cx) * 1);
    r(ctx, cx + sw, y0 + 2 + sag, cw, ch, col);
    r(ctx, cx + sw, y0 + 2 + sag + ch - 1, cw, 1, "rgba(0,0,0,0.15)");
    r(ctx, cx + 1, y0 + 1 + sag, 1, 2, P.woodLight);
  }
}

function drawPigeon(ctx, x, y, t, flight) {
  if (flight > 0) {
    // flying away up and to the right
    const fx = x + flight * 90;
    const fy = y - flight * 70 - Math.sin(flight * 20) * 2;
    if (fy < -10) return;
    const flap = Math.floor(t * 12) % 2;
    r(ctx, fx, fy, 6, 3, "#8C93A0");
    r(ctx, fx - 3, fy - 1 - flap * 2, 4, 2, "#6E7582");
    r(ctx, fx + 5, fy - 1 - flap * 2, 4, 2, "#6E7582");
    r(ctx, fx + 6, fy, 2, 2, "#8C93A0");
    return;
  }
  const peck = Math.sin(t * 2.3) > 0.85 ? 1 : 0;
  r(ctx, x - 1, y + 5, 9, 1, "rgba(27,26,34,0.2)");
  r(ctx, x, y, 7, 5, "#8C93A0");
  r(ctx, x + 1, y + 1, 4, 2, "#A7AEBA");
  r(ctx, x + 5, y - 2 + peck, 3, 3, "#6E7582");
  r(ctx, x + 6, y - 1 + peck, 1, 1, P.ink);
  r(ctx, x + 8, y + peck, 1, 1, "#C9A25B");
  r(ctx, x + 5, y + 1, 1, 1, "#6FB09A");
  r(ctx, x - 2, y + 1, 2, 2, "#6E7582");
  r(ctx, x + 2, y + 5, 1, 1, "#C9786B");
  r(ctx, x + 4, y + 5, 1, 1, "#C9786B");
}

const PIGEON = { x: 132, y: 89 };

export const terrace = {
  id: "terrace",
  name: "Terrace · El Kef",
  W,
  H,
  bounds: { x0: 12, y0: FLOOR_Y + 6, x1: W - 12, y1: H - 12 },
  solids: [
    { x: 24, y: 136, w: 40, h: 14 }, // column
    { x: 200, y: 112, w: 18, h: 8 }, // telescope
    { x: 324, y: 128, w: 44, h: 14 }, // tank
    { x: 106, y: 166, w: 54, h: 12 }, // table + stools
    { x: 236, y: 150, w: 4, h: 6 },
    { x: 352, y: 150, w: 4, h: 6 },
  ],
  spots: [
    { id: "telescope", zone: { x: 186, y: 116, w: 44, h: 22 }, at: { x: 208, y: 126 }, marker: { x: 208, y: 84 }, hit: { x: 196, y: 92, w: 22, h: 30 } },
    { id: "column", zone: { x: 16, y: 148, w: 60, h: 26 }, at: { x: 44, y: 160 }, marker: { x: 32, y: 112 }, hit: { x: 20, y: 116, w: 44, h: 34 } },
    { id: "tank", zone: { x: 318, y: 140, w: 56, h: 22 }, at: { x: 344, y: 150 }, hit: { x: 320, y: 98, w: 50, h: 42 } },
    { id: "borzgane", zone: { x: 100, y: 176, w: 66, h: 22 }, at: { x: 134, y: 188 }, hit: { x: 112, y: 156, w: 30, h: 14 }, quiet: true },
    { id: "pigeon", zone: { x: 112, y: 116, w: 44, h: 18 }, at: { x: 134, y: 124 }, hit: { x: 126, y: 82, w: 16, h: 12 }, quiet: true },
    { id: "toHouse", label: "Downstairs", zone: { x: 172, y: 176, w: 40, h: 14 }, at: { x: 192, y: 196 }, hit: { x: 172, y: 186, w: 40, h: 28 },
      exit: { to: "workshop", trigger: { x: 178, y: 192, w: 28, h: 20 } } },
  ],
  arrivals: { workshop: { x: 192, y: 180, dir: "up" } },

  drawStatic(ctx) {
    drawShell(ctx);
  },
  drawBack(ctx, t, g) {
    drawLandscape(ctx, 0, 0, W, FLOOR_Y - 16, t, g.snow);
    drawParapet(ctx);
    drawDish(ctx, 286, 80);
    // potted geraniums along the parapet
    for (const px of [60, 168, 252]) {
      r(ctx, px, FLOOR_Y - 26, 12, 8, P.tileA);
      r(ctx, px - 1, FLOOR_Y - 26, 14, 2, P.grout);
      for (let i = 0; i < 4; i++) r(ctx, px + 1 + i * 3, FLOOR_Y - 30 - (i % 2) * 2, 2, 4, P.leaf);
      for (let i = 0; i < 3; i++) r(ctx, px + 2 + i * 4, FLOOR_Y - 33 + (i % 2), 2, 2, i === 1 ? P.white : "#D63A4A");
    }
    drawPigeon(ctx, PIGEON.x, PIGEON.y, t, g.pigeonFlight);
  },
  drawables(t, g) {
    return [
      { y: 150, draw: (c) => drawColumn(c, 24, 118) },
      { y: 120, draw: (c) => drawTelescope(c, 200, 92, t) },
      { y: 142, draw: (c) => drawTank(c, 324, 100) },
      { y: 178, draw: (c) => drawTable(c, 116, 158, t, g.secrets.has("borzgane")) },
      { y: 156, draw: (c) => drawLaundry(c, t) },
      { y: 206, draw: (c) => A.drawPlant(c, 14, 184, "jasmine", t) },
      { y: 206, draw: (c) => A.drawPlant(c, 354, 184, "fern", t) },
    ];
  },
  drawFront(ctx, t, g) {
    if (g.snow) drawSnow(ctx, 0, 0, W, H, t, 1.4);
  },
  update(dt, g, player) {
    // the pigeon leaves when you get close — and that counts as finding it
    if (g.pigeonFlight > 0) g.pigeonFlight = Math.min(2, g.pigeonFlight + dt * 0.8);
    else if (Math.hypot(player.x - (PIGEON.x + 3), player.y - (PIGEON.y + 30)) < 30) {
      g.pigeonFlight = 0.001;
      g.findSecret("pigeon", true);
    }
  },
};
