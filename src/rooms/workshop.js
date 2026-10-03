// The house: a lime-washed Kef stone room with a view of Jebel Dyr.
import { P } from "../palette.js";
import * as A from "../art.js";
import { r, hash } from "../art.js";
import { drawLandscape, drawSnow } from "../kef.js";
import { drawTextCentered } from "../font.js";

const W = 384;
const H = 224;
const WALL_Y = 64;

function drawShell(ctx) {
  // lime-washed upper wall
  r(ctx, 0, 0, W, WALL_Y, P.lime);
  for (let y = 8; y < 36; y += 2) for (let x = 0; x < W; x += 2) if (hash(x, y) > 0.94) r(ctx, x, y, 1, 1, P.limeShade);
  // timber ceiling: beams + reed between them
  r(ctx, 0, 0, W, 7, P.beamDark);
  for (let x = 0; x < W; x += 3) r(ctx, x, 1, 1, 5, P.beam);
  for (let x = 10; x < W; x += 46) {
    r(ctx, x, 0, 8, 9, P.beam);
    r(ctx, x, 8, 8, 1, P.beamDark);
    r(ctx, x + 1, 1, 1, 7, P.woodLight);
  }
  // stone dado — rough Kef limestone blocks
  const dTop = 34;
  r(ctx, 0, dTop, W, WALL_Y - dTop, P.stone);
  let row = 0;
  for (let y = dTop; y < WALL_Y - 4; y += 7, row++) {
    let x = row % 2 ? -6 : 0;
    let k = row * 17;
    while (x < W) {
      const bw = 10 + ((hash(k, row) * 9) | 0);
      r(ctx, x, y, bw, 7, hash(k, 1) > 0.5 ? P.stone : P.stoneLight);
      r(ctx, x, y, bw, 1, P.stoneLine);
      r(ctx, x, y, 1, 7, P.stoneLine);
      if (hash(k, 3) > 0.6) r(ctx, x + 3, y + 3, 2, 1, P.stoneDark);
      x += bw;
      k++;
    }
  }
  r(ctx, 0, dTop - 1, W, 1, P.limeShade);
  // green skirting
  r(ctx, 0, WALL_Y - 4, W, 3, P.green);
  r(ctx, 0, WALL_Y - 1, W, 1, P.greenDeep);

  // floor
  const T = 16;
  for (let y = WALL_Y; y < H; y += T) {
    for (let x = 0; x < W; x += T) {
      const alt = ((x / T + (y - WALL_Y) / T) | 0) % 2 === 0;
      r(ctx, x, y, T, T, alt ? P.tileA : P.tileB);
      r(ctx, x, y, T, 1, P.grout);
      r(ctx, x, y, 1, T, P.grout);
      for (let i = 0; i < 3; i++) r(ctx, x + 2 + ((hash(x + i, y) * 12) | 0), y + 2 + ((hash(x, y + i) * 12) | 0), 1, 1, alt ? P.tileB : P.tileA);
    }
  }
  ctx.fillStyle = "rgba(27,26,34,0.14)";
  ctx.fillRect(0, WALL_Y, W, 4);

  // side walls (with the arch to the lab on the right)
  r(ctx, 0, 0, 8, H, P.stone);
  r(ctx, 7, 0, 1, H, P.stoneLine);
  r(ctx, W - 8, 0, 8, H, P.stone);
  r(ctx, W - 8, 0, 1, H, P.stoneLine);
  // arch opening
  r(ctx, W - 10, 116, 10, 54, P.labWallDark);
  r(ctx, W - 10, 112, 10, 4, P.stoneDark);
  r(ctx, W - 10, 170, 10, 2, P.stoneDark);
  for (let y = 120; y < 168; y += 4) r(ctx, W - 4, y, 2, 1, "#3B5BA8");
  // light leaking out of the lab
  ctx.fillStyle = "rgba(87,196,220,0.10)";
  ctx.beginPath();
  ctx.moveTo(W - 10, 118);
  ctx.lineTo(W - 10, 168);
  ctx.lineTo(W - 46, 176);
  ctx.lineTo(W - 46, 112);
  ctx.closePath();
  ctx.fill();

  // front edge
  r(ctx, 0, H - 10, W, 10, P.stone);
  r(ctx, 0, H - 10, W, 1, P.stoneLine);
}

function drawWindow(ctx, x, y, w, h, t, g) {
  r(ctx, x - 3, y - 2, w + 6, h + 4, P.stoneDark);
  drawLandscape(ctx, x, y, w, h, t, g.snow);
  if (g.snow) drawSnow(ctx, x, y, w, h, t, 2);
  // wooden frame + grille
  r(ctx, x - 1, y - 1, w + 2, 1, P.woodDark);
  r(ctx, x - 1, y + h, w + 2, 1, P.woodDark);
  r(ctx, x - 1, y, 1, h, P.woodDark);
  r(ctx, x + w, y, 1, h, P.woodDark);
  r(ctx, x + w / 2, y, 1, h, P.woodDark);
  r(ctx, x, y + h / 2, w, 1, P.woodDark);
  // sill + green shutters
  r(ctx, x - 5, y + h + 1, w + 10, 3, P.stoneLight);
  r(ctx, x - 5, y + h + 4, w + 10, 1, P.stoneLine);
  r(ctx, x - 11, y, 7, h, P.green);
  r(ctx, x + w + 4, y, 7, h, P.green);
  for (let yy = y + 2; yy < y + h; yy += 3) {
    r(ctx, x - 10, yy, 5, 1, P.greenDeep);
    r(ctx, x + w + 5, yy, 5, 1, P.greenDeep);
  }
}

function drawDoor(ctx, x, y, w, h) {
  r(ctx, x - 3, y - 2, w + 6, h + 2, P.stoneDark);
  r(ctx, x - 2, y - 1, w + 4, 2, P.stoneLight);
  r(ctx, x, y + 1, w, h - 1, P.green);
  r(ctx, x + w / 2, y + 1, 1, h - 1, P.greenDeep);
  for (let yy = y + 6; yy < y + h - 2; yy += 6) {
    for (let xx = x + 3; xx < x + w - 2; xx += 5) r(ctx, xx, yy, 1, 1, P.ink);
  }
  r(ctx, x + 2, y + 3, w - 4, 1, P.greenDeep);
  // knocker
  r(ctx, x + w / 2 + 3, y + 26, 3, 1, P.ochre);
  r(ctx, x + w / 2 + 3, y + 27, 1, 3, P.ochre);
  r(ctx, x + w / 2 + 5, y + 27, 1, 3, P.ochre);
  r(ctx, x + w / 2 + 3, y + 30, 3, 1, P.ochre);
  // hamsa above the door
  r(ctx, x + w / 2 - 2, y - 8, 5, 4, P.ochre);
  for (let i = 0; i < 5; i += 1) r(ctx, x + w / 2 - 2 + i, y - 10 - (i % 2), 1, 2, P.ochre);
  r(ctx, x + w / 2, y - 7, 1, 1, P.blue);
  // step
  r(ctx, x - 4, y + h, w + 8, 3, P.stoneLight);
  r(ctx, x - 4, y + h + 2, w + 8, 1, P.stoneLine);
}

function drawLetterbox(ctx, x, y, t, g) {
  r(ctx, x + 1, y + 1, 16, 14, P.shadow);
  r(ctx, x, y, 16, 14, P.ochreDeep);
  r(ctx, x + 1, y + 1, 14, 12, P.ochre);
  r(ctx, x + 3, y + 4, 10, 2, P.ink);
  // a letter sticking out, wiggling until it's been read
  if (!g.seen.has("letterbox")) {
    const wig = Math.floor(t * 3) % 2;
    r(ctx, x + 4, y + 1 - wig, 8, 4, P.white);
    r(ctx, x + 6, y + 2 - wig, 4, 1, P.markerRed);
  }
  drawTextCentered(ctx, "@", x + 8, y + 8, P.ochreDeep);
}

function drawLooseTile(ctx, x, y, found) {
  r(ctx, x + 1, y + 1, 14, 14, found ? P.grout : P.tileA);
  r(ctx, x + 2, y + 2, 13, 1, "rgba(255,255,255,0.15)");
  r(ctx, x + 5, y + 6, 4, 1, P.grout);
  r(ctx, x + 8, y + 7, 3, 1, P.grout);
  if (found) {
    r(ctx, x + 2, y + 2, 12, 12, "#7E4A2C");
    r(ctx, x + 1, y + 1, 14, 1, P.grout);
  }
}

function drawLabSign(ctx, x, y) {
  r(ctx, x + 2, y + 18, 22, 3, P.shadow);
  r(ctx, x + 3, y + 10, 2, 10, P.woodDark);
  r(ctx, x + 20, y + 10, 2, 10, P.woodDark);
  r(ctx, x, y, 26, 12, P.labWall);
  r(ctx, x + 1, y + 1, 24, 10, P.labWallLight);
  drawTextCentered(ctx, "LAB >", x + 13, y + 4, P.go);
}

export const workshop = {
  id: "workshop",
  name: "House · El Kef",
  W,
  H,
  bounds: { x0: 12, y0: WALL_Y + 10, x1: W - 12, y1: H - 12 },
  solids: [
    { x: 72, y: 62, w: 32, h: 12 },
    { x: 34, y: 110, w: 76, h: 26 },
    { x: 190, y: 143, w: 18, h: 9 },
    { x: 12, y: 192, w: 16, h: 12 },
    { x: 340, y: 116, w: 26, h: 6 }, // lab sign
  ],
  spots: [
    { id: "corkboard", zone: { x: 16, y: 72, w: 50, h: 22 }, at: { x: 40, y: 82 }, marker: { x: 40, y: 14 }, hit: { x: 20, y: 14, w: 40, h: 28 } },
    { id: "shelf", zone: { x: 68, y: 74, w: 40, h: 20 }, at: { x: 88, y: 84 }, marker: { x: 88, y: 14 }, hit: { x: 72, y: 14, w: 32, h: 60 } },
    { id: "window", zone: { x: 116, y: 72, w: 56, h: 18 }, at: { x: 144, y: 80 }, hit: { x: 110, y: 8, w: 68, h: 50 } },
    { id: "diploma", zone: { x: 178, y: 72, w: 32, h: 20 }, at: { x: 194, y: 82 }, marker: { x: 194, y: 14 }, hit: { x: 184, y: 16, w: 20, h: 24 } },
    { id: "whiteboard", zone: { x: 214, y: 72, w: 60, h: 20 }, at: { x: 244, y: 82 }, marker: { x: 244, y: 12 }, hit: { x: 218, y: 12, w: 52, h: 36 } },
    { id: "letterbox", zone: { x: 326, y: 72, w: 36, h: 22 }, at: { x: 340, y: 82 }, marker: { x: 340, y: 22 }, hit: { x: 330, y: 28, w: 18, h: 16 } },
    { id: "desk", zone: { x: 30, y: 136, w: 84, h: 22 }, at: { x: 90, y: 150 }, marker: { x: 72, y: 84 }, hit: { x: 34, y: 92, w: 76, h: 44 } },
    { id: "cat", zone: { x: 178, y: 136, w: 44, h: 28 }, at: { x: 199, y: 160 }, hit: { x: 184, y: 138, w: 26, h: 16 } },
    { id: "coin", zone: { x: 298, y: 178, w: 28, h: 26 }, at: { x: 312, y: 196 }, hit: { x: 304, y: 176, w: 16, h: 16 }, quiet: true },
    { id: "toTerrace", label: "Terrace", zone: { x: 286, y: 72, w: 36, h: 10 }, at: { x: 304, y: 75 }, hit: { x: 290, y: 18, w: 28, h: 46 },
      exit: { to: "terrace", trigger: { x: 292, y: 70, w: 24, h: 6 }, spawn: { x: 192, y: 182, dir: "up" } } },
    { id: "toLab", label: "Tanilytics lab", zone: { x: 352, y: 120, w: 24, h: 50 }, at: { x: 374, y: 146 }, hit: { x: 366, y: 112, w: 18, h: 60 },
      exit: { to: "lab", trigger: { x: 368, y: 120, w: 16, h: 50 }, spawn: { x: 26, y: 152, dir: "right" } } },
  ],
  arrivals: { terrace: { x: 304, y: 84, dir: "down" }, lab: { x: 354, y: 146, dir: "left" } },

  drawStatic(ctx) {
    drawShell(ctx);
    A.drawRug(ctx, 156, 128, 96, 48);
    A.drawCorkboard(ctx, 20, 12, 40, 28);
  },
  drawBack(ctx, t, g) {
    drawWindow(ctx, 120, 10, 48, 40, t, g);
    A.drawDiploma(ctx, 184, 16, 20, 24, t);
    A.drawWhiteboard(ctx, 218, 10, 52, 34);
    drawDoor(ctx, 290, 18, 28, 46);
    drawLetterbox(ctx, 331, 28, t, g);
    drawLooseTile(ctx, 304, 176, g.secrets.has("coin"));
    // window light on the floor
    ctx.fillStyle = `rgba(255,236,170,${g.snow ? 0.05 : 0.1})`;
    ctx.beginPath();
    ctx.moveTo(122, WALL_Y + 6);
    ctx.lineTo(166, WALL_Y + 6);
    ctx.lineTo(210, WALL_Y + 66);
    ctx.lineTo(152, WALL_Y + 66);
    ctx.closePath();
    ctx.fill();
  },
  drawables(t, g) {
    return [
      { y: 74, draw: (c) => A.drawShelf(c, 72, 14, 32, 60) },
      { y: 136, draw: (c) => A.drawDesk(c, 36, 112, 72, 24, t) },
      { y: 152, draw: (c) => A.drawChair(c, 64, 138) },
      { y: 152, draw: (c) => A.drawCat(c, 191, 145, t, g.near === "cat" || g.dialog === "cat") },
      { y: 122, draw: (c) => drawLabSign(c, 340, 104) },
      { y: 204, draw: (c) => A.drawPlant(c, 12, 182, "jasmine", t) },
    ];
  },
};
