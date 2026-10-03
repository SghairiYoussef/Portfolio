// All the pixel art in the game, drawn with rectangles at 1 logical px.
// Nothing here is loaded from an image file.
import { P } from "./palette.js";

export function r(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

// Small deterministic noise so textures don't shimmer frame to frame.
function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/* ---------------- room shell ---------------- */

export function drawRoom(ctx, W, H, wallY) {
  // back wall plaster with soft texture
  r(ctx, 0, 0, W, wallY, P.plaster);
  for (let y = 0; y < wallY; y += 2)
    for (let x = 0; x < W; x += 2)
      if (hash(x, y) > 0.93) r(ctx, x, y, 1, 1, P.plasterShade);
  // ceiling beam + blue frieze
  r(ctx, 0, 0, W, 4, P.blueDeep);
  r(ctx, 0, 4, W, 2, P.blue);
  for (let x = 2; x < W; x += 8) r(ctx, x, 7, 4, 1, P.blueLight);
  // skirting
  r(ctx, 0, wallY - 5, W, 4, P.blue);
  r(ctx, 0, wallY - 1, W, 1, P.blueDeep);

  // floor: terracotta tiles with a zellige band
  const T = 16;
  for (let y = wallY; y < H; y += T) {
    for (let x = 0; x < W; x += T) {
      const alt = ((x / T + (y - wallY) / T) | 0) % 2 === 0;
      r(ctx, x, y, T, T, alt ? P.tileA : P.tileB);
      r(ctx, x, y, T, 1, P.grout);
      r(ctx, x, y, 1, T, P.grout);
      for (let i = 0; i < 3; i++) {
        const nx = x + 2 + ((hash(x + i, y) * 12) | 0);
        const ny = y + 2 + ((hash(x, y + i) * 12) | 0);
        r(ctx, nx, ny, 1, 1, alt ? P.tileB : P.tileA);
      }
    }
  }
  // zellige band near the wall
  const bandY = wallY + 1;
  r(ctx, 0, bandY, W, 6, P.plasterShade);
  for (let x = 0; x < W; x += 6) {
    r(ctx, x + 2, bandY + 1, 2, 4, P.zellige);
    r(ctx, x + 1, bandY + 2, 4, 2, P.zellige);
    r(ctx, x + 2, bandY + 2, 2, 2, P.ochre);
  }
  r(ctx, 0, bandY + 6, W, 1, P.grout);

  // contact shadow under the wall
  ctx.fillStyle = "rgba(27,26,34,0.12)";
  ctx.fillRect(0, bandY + 7, W, 3);

  // side walls and front edge
  r(ctx, 0, 0, 8, H, P.plasterShade);
  r(ctx, 7, 0, 1, H, P.plasterDeep);
  r(ctx, W - 8, 0, 8, H, P.plasterShade);
  r(ctx, W - 8, 0, 1, H, P.plasterDeep);
  r(ctx, 0, H - 10, W, 10, P.plasterShade);
  r(ctx, 0, H - 10, W, 1, P.plasterDeep);
  r(ctx, 0, 0, 8, 6, P.blueDeep);
  r(ctx, W - 8, 0, 8, 6, P.blueDeep);
}

/* ---------------- wall pieces ---------------- */

export function drawWindow(ctx, x, y, w, h, t) {
  // arched opening
  r(ctx, x - 2, y + 6, w + 4, h - 4, P.blueDeep);
  r(ctx, x + 4, y - 2, w - 8, 10, P.blueDeep);
  r(ctx, x, y + 6, w, h - 6, P.sky);
  r(ctx, x + 6, y, w - 12, 8, P.sky);
  r(ctx, x + 2, y + 2, w - 4, 6, P.sky);
  r(ctx, x, y + 6, w, 6, P.skyHigh);
  r(ctx, x + 6, y, w - 12, 6, P.skyHigh);
  // sun + sea
  r(ctx, x + w - 16, y + 12, 6, 6, P.sun);
  r(ctx, x + w - 17, y + 13, 8, 4, P.sun);
  const seaY = y + h - 14;
  r(ctx, x, seaY, w, 14, P.sea);
  r(ctx, x, seaY + 7, w, 7, P.seaDeep);
  // moving glints
  for (let i = 0; i < 5; i++) {
    const gx = x + ((i * 11 + t * 6) % w);
    r(ctx, gx, seaY + 2 + (i % 3) * 3, 3, 1, "#CFE8F7");
  }
  // distant sail
  const sx = x + 6 + ((t * 2) % (w - 12));
  r(ctx, sx, seaY - 4, 1, 4, P.ink);
  r(ctx, sx + 1, seaY - 4, 3, 3, "#FFFFFF");
  // mullion + blue grille
  r(ctx, x + w / 2 - 1, y, 2, h, P.blue);
  r(ctx, x, y + h / 2, w, 1, P.blue);
  // sill
  r(ctx, x - 4, y + h, w + 8, 3, P.plasterShade);
  r(ctx, x - 4, y + h + 3, w + 8, 1, P.plasterDeep);
  // shutters
  r(ctx, x - 10, y + 6, 7, h - 6, P.blue);
  r(ctx, x + w + 3, y + 6, 7, h - 6, P.blue);
  for (let yy = y + 8; yy < y + h; yy += 3) {
    r(ctx, x - 9, yy, 5, 1, P.blueDeep);
    r(ctx, x + w + 4, yy, 5, 1, P.blueDeep);
  }
}

export function drawLightPatch(ctx, x, w, wallY, t) {
  const a = 0.1 + Math.sin(t * 0.6) * 0.015;
  ctx.fillStyle = `rgba(255,236,170,${a})`;
  ctx.beginPath();
  ctx.moveTo(x, wallY + 8);
  ctx.lineTo(x + w, wallY + 8);
  ctx.lineTo(x + w + 44, wallY + 70);
  ctx.lineTo(x + 30, wallY + 70);
  ctx.closePath();
  ctx.fill();
}

export function drawCorkboard(ctx, x, y, w, h) {
  r(ctx, x + 1, y + 1, w, h, P.shadow);
  r(ctx, x, y, w, h, P.woodDark);
  r(ctx, x + 2, y + 2, w - 4, h - 4, P.cork);
  for (let i = 0; i < 30; i++) r(ctx, x + 3 + hash(i, 1) * (w - 6), y + 3 + hash(1, i) * (h - 6), 1, 1, P.corkDark);
  // notes + a photo
  r(ctx, x + 5, y + 5, 10, 9, P.note1);
  r(ctx, x + 7, y + 8, 6, 1, P.inkSoft);
  r(ctx, x + 7, y + 10, 4, 1, P.inkSoft);
  r(ctx, x + 18, y + 4, 11, 13, "#FFFFFF");
  r(ctx, x + 19, y + 5, 9, 8, P.sea);
  r(ctx, x + 19, y + 10, 9, 3, P.leaf);
  r(ctx, x + 31, y + 7, 9, 8, P.note2);
  r(ctx, x + 33, y + 10, 5, 1, P.inkSoft);
  r(ctx, x + 8, y + 17, 12, 8, P.note3);
  r(ctx, x + 10, y + 20, 7, 1, P.inkSoft);
  // red string between pins, of course
  ctx.strokeStyle = P.markerRed;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 10.5, y + 5.5);
  ctx.lineTo(x + 23.5, y + 4.5);
  ctx.lineTo(x + 35.5, y + 7.5);
  ctx.stroke();
  r(ctx, x + 10, y + 5, 1, 1, P.markerRed);
  r(ctx, x + 23, y + 4, 1, 1, P.markerRed);
  r(ctx, x + 35, y + 7, 1, 1, P.markerRed);
  r(ctx, x + 14, y + 17, 1, 1, P.blue);
}

export function drawDiploma(ctx, x, y, w, h, t) {
  r(ctx, x + 1, y + 1, w, h, P.shadow);
  r(ctx, x, y, w, h, P.ochre);
  r(ctx, x + 1, y + 1, w - 2, h - 2, "#B98A2E");
  r(ctx, x + 2, y + 2, w - 4, h - 4, P.plaster);
  // dashed placeholder outline — it's empty until 2027
  const on = Math.floor(t * 2) % 2 === 0;
  for (let i = x + 4; i < x + w - 4; i += 2) {
    r(ctx, i, y + 4, 1, 1, on ? P.plasterDeep : P.plasterShade);
    r(ctx, i + 1, y + h - 5, 1, 1, on ? P.plasterShade : P.plasterDeep);
  }
  for (let j = y + 4; j < y + h - 4; j += 2) {
    r(ctx, x + 4, j, 1, 1, P.plasterDeep);
    r(ctx, x + w - 5, j + 1, 1, 1, P.plasterDeep);
  }
  // "2027" in 3x5 digits
  drawTinyText(ctx, "2027", x + w / 2 - 7, y + h / 2 - 2, P.inkSoft);
}

export function drawWhiteboard(ctx, x, y, w, h) {
  r(ctx, x + 1, y + 1, w, h, P.shadow);
  r(ctx, x, y, w, h, P.metalLight);
  r(ctx, x + 1, y + 1, w - 2, h - 2, P.board);
  // boxes and arrows
  const box = (bx, by, bw, c) => {
    r(ctx, bx, by, bw, 1, c);
    r(ctx, bx, by + 6, bw, 1, c);
    r(ctx, bx, by, 1, 7, c);
    r(ctx, bx + bw - 1, by, 1, 7, c);
  };
  box(x + 4, y + 5, 10, P.marker);
  box(x + 20, y + 5, 12, P.marker);
  box(x + 38, y + 5, 10, P.marker);
  box(x + 20, y + 19, 12, P.markerRed);
  r(ctx, x + 14, y + 8, 6, 1, P.marker);
  r(ctx, x + 18, y + 7, 1, 3, P.marker);
  r(ctx, x + 32, y + 8, 6, 1, P.marker);
  r(ctx, x + 36, y + 7, 1, 3, P.marker);
  r(ctx, x + 26, y + 12, 1, 7, P.markerRed);
  r(ctx, x + 25, y + 17, 3, 1, P.markerRed);
  r(ctx, x + 6, y + 21, 10, 1, P.inkSoft);
  r(ctx, x + 6, y + 24, 7, 1, P.inkSoft);
  r(ctx, x + 36, y + 21, 10, 1, P.inkSoft);
  r(ctx, x + 36, y + 24, 6, 1, P.inkSoft);
  // tray + markers
  r(ctx, x + 4, y + h, w - 8, 2, P.metal);
  r(ctx, x + 10, y + h - 1, 5, 1, P.marker);
  r(ctx, x + 17, y + h - 1, 5, 1, P.markerRed);
}

export function drawDoor(ctx, x, y, w, h) {
  // frame & arch
  r(ctx, x - 3, y + 6, w + 6, h - 6, P.plasterDeep);
  r(ctx, x + 3, y - 2, w - 6, 10, P.plasterDeep);
  r(ctx, x, y + 6, w, h - 6, P.blue);
  r(ctx, x + 4, y, w - 8, 8, P.blue);
  r(ctx, x + 2, y + 2, w - 4, 6, P.blue);
  // panels
  r(ctx, x + w / 2, y + 2, 1, h - 2, P.blueDeep);
  // studs — the black nail patterns on Tunisian doors
  const studs = [
    [0, 12], [-4, 16], [4, 16], [0, 20], [-6, 22], [6, 22], [0, 26], [-4, 28], [4, 28], [0, 32],
    [-8, 38], [8, 38], [-4, 40], [4, 40], [0, 44], [-8, 46], [8, 46],
  ];
  const cx = x + w / 2;
  for (const [dx, dy] of studs) if (y + dy < y + h - 2) r(ctx, cx + dx, y + dy, 1, 1, P.ink);
  r(ctx, x + 2, y + 8, w - 4, 1, P.ink);
  // knocker
  r(ctx, cx + 3, y + 30, 3, 1, P.ochre);
  r(ctx, cx + 3, y + 31, 1, 3, P.ochre);
  r(ctx, cx + 5, y + 31, 1, 3, P.ochre);
  r(ctx, cx + 3, y + 34, 3, 1, P.ochre);
  // step
  r(ctx, x - 4, y + h, w + 8, 3, P.plasterDeep);
}

/* ---------------- floor furniture ---------------- */

export function drawShelf(ctx, x, y, w, h) {
  r(ctx, x + 2, y + h - 2, w, 4, P.shadow);
  r(ctx, x, y, w, h, P.woodDark);
  r(ctx, x + 2, y + 2, w - 4, h - 4, P.wood);
  const rows = 4;
  const rowH = (h - 4) / rows;
  const colors = [P.rugRed, P.blue, P.ochre, P.zellige, P.plaster, P.inkSoft, P.note3, P.blueLight];
  for (let i = 0; i < rows; i++) {
    const ry = Math.round(y + 2 + i * rowH);
    r(ctx, x + 2, ry + rowH - 2, w - 4, 2, P.woodLight);
    let bx = x + 3;
    let k = i * 3;
    while (bx < x + w - 5) {
      const bw = 2 + ((hash(k, i) * 3) | 0);
      const bh = rowH - 4 - ((hash(i, k) * 3) | 0);
      if (i === 2 && bx > x + w - 12) {
        // a little plant on one shelf
        r(ctx, bx, ry + rowH - 5, 4, 3, P.rugRed);
        r(ctx, bx, ry + rowH - 9, 2, 4, P.leaf);
        r(ctx, bx + 2, ry + rowH - 8, 2, 3, P.leafLight);
        break;
      }
      r(ctx, bx, ry + rowH - 2 - bh, bw, bh, colors[k % colors.length]);
      r(ctx, bx, ry + rowH - 2 - bh + 2, bw, 1, "rgba(255,255,255,0.25)");
      bx += bw + (hash(k, k) > 0.8 ? 2 : 0);
      k++;
    }
  }
  r(ctx, x, y, w, 2, P.woodLight);
}

export function drawRack(ctx, x, y, w, h, t) {
  r(ctx, x + 2, y + h - 2, w, 4, P.shadow);
  r(ctx, x, y, w, h, P.metalDark);
  r(ctx, x + 2, y + 2, w - 4, h - 4, P.metal);
  r(ctx, x, y, w, 2, P.metalLight);
  const units = 8;
  const uh = (h - 8) / units;
  for (let i = 0; i < units; i++) {
    const uy = Math.round(y + 4 + i * uh);
    r(ctx, x + 3, uy, w - 6, uh - 1, P.metalLight);
    r(ctx, x + 4, uy + 1, w - 8, uh - 3, P.metalDark);
    for (let j = 0; j < 4; j++) {
      const seed = hash(i * 7 + j, Math.floor(t * (3 + j)));
      const c = seed > 0.55 ? (j === 3 ? P.ledAmber : P.ledGreen) : P.ledOff;
      r(ctx, x + 6 + j * 3, uy + 2, 2, 1, c);
    }
    r(ctx, x + w - 10, uy + 2, 5, 1, P.metal);
  }
  // label tape
  r(ctx, x + 4, y + h - 4, 14, 2, P.plaster);
  r(ctx, x + 5, y + h - 3, 9, 1, P.inkSoft);
}

export function drawDesk(ctx, x, y, w, h, t) {
  const top = 12;
  r(ctx, x + 2, y + h - 1, w, 4, P.shadow);
  // legs + front
  r(ctx, x, y + top, w, h - top, P.woodDark);
  r(ctx, x + 2, y + top, w - 4, 4, P.wood);
  r(ctx, x + w - 22, y + top + 5, 16, 3, P.woodLight);
  r(ctx, x + w - 15, y + top + 6, 3, 1, P.ochre);
  // top surface
  r(ctx, x - 2, y, w + 4, top, P.woodLight);
  r(ctx, x - 2, y + top - 1, w + 4, 1, P.wood);

  // two monitors
  const mon = (mx, my, mw, phase) => {
    r(ctx, mx, my, mw, 20, P.metalDark);
    r(ctx, mx + 2, my + 2, mw - 4, 15, P.screen);
    const lines = 6;
    for (let i = 0; i < lines; i++) {
      const s = Math.floor(t * 1.5 + phase) + i;
      const len = 3 + ((hash(s, phase) * (mw - 10)) | 0);
      const ind = (hash(phase, s) * 4) | 0;
      const cols = [P.code1, P.code2, P.code3, P.code4];
      r(ctx, mx + 4 + ind, my + 3 + i * 2 + 1, len, 1, cols[s % 4]);
    }
    // cursor blink on the left screen
    if (phase === 0 && Math.floor(t * 2) % 2 === 0) r(ctx, mx + mw - 6, my + 14, 1, 2, P.plaster);
    r(ctx, mx + mw / 2 - 2, my + 20, 4, 3, P.metal);
    r(ctx, mx + mw / 2 - 5, my + 22, 10, 2, P.metalLight);
  };
  mon(x + 6, y - 18, 30, 0);
  mon(x + 38, y - 16, 24, 3);
  // keyboard + mouse
  r(ctx, x + 14, y + 6, 26, 4, P.metalLight);
  for (let i = 0; i < 8; i++) r(ctx, x + 15 + i * 3, y + 7, 2, 1, P.metal);
  r(ctx, x + 44, y + 6, 3, 4, P.metalLight);
  // glass of mint tea with steam
  r(ctx, x + w - 10, y + 2, 5, 7, "rgba(255,255,255,0.55)");
  r(ctx, x + w - 10, y + 5, 5, 4, "#9C6B2F");
  r(ctx, x + w - 9, y + 3, 2, 2, P.leafLight);
  for (let i = 0; i < 3; i++) {
    const sy = y - 2 - ((t * 6 + i * 4) % 12);
    const sx = x + w - 8 + Math.round(Math.sin(t * 2 + i) * 1.5);
    ctx.fillStyle = `rgba(255,255,255,${0.5 - ((t * 6 + i * 4) % 12) / 26})`;
    ctx.fillRect(sx, Math.round(sy), 1, 2);
  }
}

export function drawChair(ctx, x, y) {
  r(ctx, x + 1, y + 13, 14, 3, P.shadow);
  r(ctx, x + 7, y + 8, 2, 6, P.metal);
  r(ctx, x + 2, y + 13, 12, 1, P.metal);
  r(ctx, x, y + 4, 16, 5, P.inkSoft);
  r(ctx, x + 1, y, 14, 5, P.ink);
  r(ctx, x + 1, y + 4, 14, 1, P.inkSoft);
}

export function drawRug(ctx, x, y, w, h) {
  r(ctx, x, y, w, h, P.rugDark);
  r(ctx, x + 2, y + 2, w - 4, h - 4, P.rugRed);
  r(ctx, x + 5, y + 5, w - 10, 1, P.rugCream);
  r(ctx, x + 5, y + h - 6, w - 10, 1, P.rugCream);
  // kilim diamonds
  const cy = y + h / 2;
  for (let cx = x + 14; cx < x + w - 8; cx += 18) {
    for (let d = 0; d < 7; d++) {
      r(ctx, cx - d, cy - 7 + d, 1, 1, P.rugCream);
      r(ctx, cx + d, cy - 7 + d, 1, 1, P.rugCream);
      r(ctx, cx - d, cy + 7 - d, 1, 1, P.rugCream);
      r(ctx, cx + d, cy + 7 - d, 1, 1, P.rugCream);
    }
    r(ctx, cx - 1, cy - 1, 3, 3, P.ochre);
    r(ctx, cx, cy - 3, 1, 1, P.ink);
    r(ctx, cx, cy + 3, 1, 1, P.ink);
  }
  // fringe
  for (let fx = x + 1; fx < x + w; fx += 2) {
    r(ctx, fx, y - 2, 1, 2, P.rugCream);
    r(ctx, fx, y + h, 1, 2, P.rugCream);
  }
}

export function drawCat(ctx, x, y, t, awake) {
  const breathe = Math.sin(t * 2) > 0 ? 1 : 0;
  r(ctx, x - 1, y + 7, 16, 2, "rgba(27,26,34,0.25)");
  // body loaf
  r(ctx, x, y + 2 - breathe, 12, 6 + breathe, P.cat);
  r(ctx, x + 1, y + 1 - breathe, 10, 1, P.cat);
  r(ctx, x + 2, y + 3 - breathe, 2, 4, P.catDark);
  r(ctx, x + 6, y + 3 - breathe, 2, 4, P.catDark);
  // head
  r(ctx, x + 9, y - 1, 6, 6, P.cat);
  r(ctx, x + 9, y - 3, 2, 2, P.cat);
  r(ctx, x + 13, y - 3, 2, 2, P.cat);
  r(ctx, x + 10, y - 2, 1, 1, P.catDark);
  r(ctx, x + 14, y - 2, 1, 1, P.catDark);
  r(ctx, x + 10, y + 3, 4, 2, P.catLight);
  if (awake) {
    r(ctx, x + 10, y + 1, 1, 1, P.ink);
    r(ctx, x + 13, y + 1, 1, 1, P.ink);
  } else {
    r(ctx, x + 10, y + 1, 2, 1, P.catDark);
    r(ctx, x + 13, y + 1, 1, 1, P.catDark);
  }
  r(ctx, x + 12, y + 3, 1, 1, P.note3);
  // tail
  const flick = Math.sin(t * 1.3) > 0.7 ? -1 : 0;
  r(ctx, x - 3, y + 5 + flick, 4, 2, P.catDark);
  r(ctx, x - 4, y + 3 + flick, 2, 3, P.catDark);
  // Zzz
  if (!awake) {
    const z = (t * 0.8) % 3;
    ctx.globalAlpha = Math.max(0, 1 - z / 3);
    drawTinyText(ctx, "z", x + 15 + z * 2, y - 6 - z * 4, P.inkSoft);
    ctx.globalAlpha = 1;
  }
}

export function drawPlant(ctx, x, y, kind, t) {
  // pot
  r(ctx, x + 2, y + 20, 14, 3, P.shadow);
  r(ctx, x + 2, y + 12, 12, 10, kind === "jasmine" ? P.blue : P.tileA);
  r(ctx, x + 1, y + 12, 14, 2, kind === "jasmine" ? P.blueDeep : P.grout);
  if (kind === "jasmine") {
    for (let i = 0; i < 3; i++) r(ctx, x + 4 + i * 3, y + 16, 1, 1, P.plaster);
  }
  // leaves
  const sway = Math.round(Math.sin(t * 0.9 + x) * 0.6);
  const leaves = [
    [6, 2, 4, 10], [3, 5, 4, 6], [9, 4, 4, 7], [1, 8, 3, 4], [12, 7, 3, 5], [7, -2, 2, 5],
  ];
  for (const [lx, ly, lw, lh] of leaves) {
    r(ctx, x + lx + sway, y + ly, lw, lh, P.leaf);
    r(ctx, x + lx + sway, y + ly, 1, lh, P.leafDark);
    r(ctx, x + lx + lw - 1 + sway, y + ly, 1, 2, P.leafLight);
  }
  if (kind === "jasmine") {
    const dots = [[4, 4], [10, 3], [7, 7], [2, 9], [13, 9], [8, 0]];
    for (const [dx, dy] of dots) r(ctx, x + dx + sway, y + dy, 2, 2, P.jasmine);
  }
}

/* ---------------- the player ---------------- */

// (x, y) is the point between the feet.
export function drawPlayer(ctx, x, y, dir, frame, moving) {
  const ox = Math.round(x) - 6;
  const bob = moving && frame % 2 === 1 ? -1 : 0;
  const oy = Math.round(y) - 19 + bob;
  const step = moving ? frame % 4 : 0; // 0 neutral,1 left fwd,2 neutral,3 right fwd

  ctx.fillStyle = "rgba(27,26,34,0.3)";
  ctx.fillRect(ox + 1, Math.round(y) - 1, 10, 2);
  ctx.fillRect(ox + 2, Math.round(y) - 2, 8, 1);

  // legs
  const lUp = step === 1 ? 1 : 0;
  const rUp = step === 3 ? 1 : 0;
  if (dir === "left" || dir === "right") {
    const back = step === 1 ? -2 : step === 3 ? 2 : 0;
    r(ctx, ox + 4 + back, oy + 13, 3, 4, P.pants);
    r(ctx, ox + 6 - back, oy + 13, 3, 4, P.pants);
    r(ctx, ox + 4 + back + (dir === "right" ? 0 : -1), oy + 17, 4, 1, P.shoe);
    r(ctx, ox + 6 - back + (dir === "right" ? 0 : -1), oy + 17, 4, 1, P.shoe);
  } else {
    r(ctx, ox + 3, oy + 13, 3, 4 - lUp, P.pants);
    r(ctx, ox + 7, oy + 13, 3, 4 - rUp, P.pants);
    r(ctx, ox + 3, oy + 17 - lUp, 3, 1, P.shoe);
    r(ctx, ox + 7, oy + 17 - rUp, 3, 1, P.shoe);
  }

  // hoodie
  r(ctx, ox + 2, oy + 7, 9, 7, P.hoodie);
  r(ctx, ox + 2, oy + 13, 9, 1, P.hoodieShade);
  if (dir === "down") {
    r(ctx, ox + 6, oy + 8, 1, 5, P.hoodieShade);
    r(ctx, ox + 5, oy + 8, 1, 2, P.plaster);
    r(ctx, ox + 7, oy + 8, 1, 2, P.plaster);
    r(ctx, ox + 4, oy + 11, 5, 2, P.hoodieShade);
  } else if (dir === "up") {
    r(ctx, ox + 3, oy + 7, 7, 2, P.hoodieShade);
  }
  // arms swing
  const swing = moving ? (step === 1 ? 1 : step === 3 ? -1 : 0) : 0;
  if (dir === "left" || dir === "right") {
    const ax = dir === "right" ? ox + 5 : ox + 6;
    r(ctx, ax + swing, oy + 8, 2, 5, P.hoodieShade);
    r(ctx, ax + swing, oy + 13, 2, 1, P.skin);
  } else {
    r(ctx, ox + 1, oy + 8 + swing, 2, 5, P.hoodieShade);
    r(ctx, ox + 10, oy + 8 - swing, 2, 5, P.hoodieShade);
    r(ctx, ox + 1, oy + 13 + swing, 2, 1, P.skin);
    r(ctx, ox + 10, oy + 13 - swing, 2, 1, P.skin);
  }

  // head
  r(ctx, ox + 3, oy, 7, 7, P.skin);
  r(ctx, ox + 3, oy + 6, 7, 1, P.skinShade);
  // hair
  r(ctx, ox + 2, oy - 1, 9, 3, P.hair);
  r(ctx, ox + 3, oy - 2, 7, 1, P.hair);
  if (dir === "down") {
    r(ctx, ox + 2, oy + 2, 1, 2, P.hair);
    r(ctx, ox + 10, oy + 2, 1, 2, P.hair);
    r(ctx, ox + 4, oy + 2, 2, 1, P.hair);
    r(ctx, ox + 4, oy + 3, 1, 2, P.ink);
    r(ctx, ox + 8, oy + 3, 1, 2, P.ink);
    r(ctx, ox + 5, oy + 5, 3, 1, P.skinShade);
    // beard shadow
    r(ctx, ox + 3, oy + 5, 1, 2, P.hair);
    r(ctx, ox + 9, oy + 5, 1, 2, P.hair);
    r(ctx, ox + 4, oy + 6, 5, 1, P.hair);
  } else if (dir === "up") {
    r(ctx, ox + 2, oy + 2, 9, 4, P.hair);
    r(ctx, ox + 3, oy + 6, 7, 1, P.hoodieShade);
  } else {
    const f = dir === "right";
    r(ctx, f ? ox + 2 : ox + 7, oy + 2, 4, 4, P.hair);
    r(ctx, f ? ox + 8 : ox + 4, oy + 3, 1, 2, P.ink);
    r(ctx, f ? ox + 10 : ox + 2, oy + 4, 1, 1, P.skin);
    r(ctx, f ? ox + 6 : ox + 4, oy + 6, 4, 1, P.hair);
  }
}

/* ---------------- tiny 3x5 font for in-world numbers ---------------- */

const GLYPHS = {
  "0": "111101101101111", "2": "111001111100111", "7": "111001010010010",
  z: "000111001010111", "!": "010010010000010",
};
export function drawTinyText(ctx, s, x, y, c) {
  let cx = Math.round(x);
  for (const ch of s) {
    const g = GLYPHS[ch];
    if (g) for (let i = 0; i < 15; i++) if (g[i] === "1") r(ctx, cx + (i % 3), Math.round(y) + ((i / 3) | 0), 1, 1, c);
    cx += 4;
  }
}

// Small floating marker above a station the player hasn't visited yet.
export function drawMarker(ctx, x, y, t, seen) {
  const b = Math.round(Math.sin(t * 4) * 1.5);
  const c = seen ? "rgba(239,232,218,0.55)" : P.ochre;
  r(ctx, x - 2, y - 8 + b, 5, 5, P.ink);
  r(ctx, x - 1, y - 7 + b, 3, 3, c);
  r(ctx, x, y - 3 + b, 1, 2, P.ink);
}
