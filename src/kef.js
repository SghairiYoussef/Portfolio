// El Kef from a distance: the flat top and cliffs of Jebel Dyr, the Kasbah on
// its promontory, the old town spilling down the slope. Drawn into any rectangle.
import { P } from "./palette.js";
import { r, hash } from "./art.js";

const SNOW = "#F4F7F8";

export function drawLandscape(ctx, x, y, w, h, t, snow) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const X = (f) => Math.round(x + f * w);
  const Y = (f) => Math.round(y + f * h);

  // sky in soft bands
  const sky = snow ? ["#B4C2CE", "#C3CED8", "#D1DAE1", "#DEE4E9"] : [P.skyHigh, P.sky, "#BDE1F3", P.skyLow];
  for (let i = 0; i < 4; i++) r(ctx, x, Y(i * 0.15), w, Math.ceil(h * 0.15) + 1, sky[i]);
  r(ctx, x, Y(0.6), w, h, sky[3]);
  if (!snow) {
    const s = Math.max(3, Math.round(w / 48));
    r(ctx, X(0.1) - s, Y(0.12) - s + 1, s * 2, s * 2 - 2, P.sun);
    r(ctx, X(0.1) - s + 1, Y(0.12) - s, s * 2 - 2, s * 2, P.sun);
  }
  for (let i = 0; i < 3; i++) {
    const cw = Math.round(w * (0.1 + i * 0.03));
    const cx = x + ((i * w * 0.41 + t * (2 + i)) % (w + cw)) - cw;
    const cy = Y(0.05 + i * 0.05);
    const c = snow ? "#EEF2F5" : "#F6FBFD";
    r(ctx, cx, cy, cw, 2, c);
    r(ctx, cx + cw * 0.25, cy - 1, cw * 0.4, 1, c);
  }

  // distant ridge on the right
  for (let i = 0; i < w; i++) {
    const f = i / w;
    const top = Y(0.5) - Math.round((Math.sin(f * 7) * 0.04 + Math.sin(f * 2.3) * 0.05) * h);
    r(ctx, x + i, top, 1, h, snow ? "#C9D1D3" : "#A9B98B");
  }

  // Jebel Dyr: a long flat top with a sheer cliff face
  const plateau = 0.14;
  const cliffBottom = 0.36;
  const left = 0.3;
  for (let i = X(left - 0.06); i < x + w; i++) {
    const f = (i - x) / w;
    let top = plateau + Math.sin(f * 40) * 0.004;
    if (f < left) top = plateau + (left - f) * 2.2; // the mountain's western shoulder
    const ty = Y(top);
    // cliff
    const cb = Y(cliffBottom + Math.sin(f * 9) * 0.02);
    r(ctx, i, ty, 1, cb - ty, hash(i, 1) > 0.55 ? P.cliff : P.mountainDark);
    if ((i - x) % 4 === 0) r(ctx, i, ty + 2, 1, cb - ty - 2, P.mountainDark);
    r(ctx, i, ty, 1, 2, snow ? SNOW : P.mountainLight);
    // scree slope under the cliff with olive scrub
    r(ctx, i, cb, 1, h, hash(i, 2) > 0.5 ? P.mountain : P.mountainLight);
    if (hash(i, 3) > 0.86) r(ctx, i, cb + 2 + ((hash(i, 4) * h * 0.12) | 0), 2, 2, snow ? "#DDE3E2" : P.leafDark);
  }

  // the promontory the Kasbah stands on
  for (let i = x; i < X(0.42); i++) {
    const f = (i - x) / w;
    const top = 0.4 - Math.sin(Math.min(1, f / 0.42) * Math.PI) * 0.14;
    r(ctx, i, Y(top), 1, h, hash(i, 6) > 0.5 ? P.mountain : P.mountainDark);
    if (snow) r(ctx, i, Y(top), 1, 1, SNOW);
  }

  // the Kasbah: long ramparts, square towers, crenellations
  const kx = X(0.08);
  const kw = Math.max(18, Math.round(w * 0.26));
  const ky = Y(0.25);
  const kh = Math.max(5, Math.round(h * 0.1));
  r(ctx, kx, ky, kw, kh, P.kasbah);
  r(ctx, kx, ky + kh - 1, kw, 1, P.kasbahShade);
  for (let i = 0; i < kw; i += 3) r(ctx, kx + i, ky - 2, 2, 2, P.kasbah);
  const tw = Math.max(3, Math.round(w * 0.03));
  const towers = [0, 0.38, 0.72, 1];
  for (const tf of towers) {
    const tx = Math.round(kx + tf * (kw - tw));
    const th = Math.round(kh * (tf === 0.38 ? 1.9 : 1.5));
    r(ctx, tx, ky + kh - th, tw, th, P.kasbah);
    r(ctx, tx + tw - 1, ky + kh - th, 1, th, P.kasbahShade);
    for (let i = 0; i < tw; i += 2) r(ctx, tx + i, ky + kh - th - 1, 1, 1, P.kasbah);
    if (snow) r(ctx, tx, ky + kh - th, tw, 1, SNOW);
    if (w > 120) r(ctx, tx + 1, ky + kh - th + 3, 1, 2, P.kasbahShade);
  }
  if (snow) r(ctx, kx, ky - 1, kw, 1, SNOW);
  const flagTower = Math.round(kx + 0.38 * (kw - tw) + tw / 2);
  const flagTop = ky + kh - Math.round(kh * 1.9) - 1;
  r(ctx, flagTower, flagTop - 6, 1, 6, P.inkSoft);
  r(ctx, flagTower + 1, flagTop - 6, 4, 3 - (Math.floor(t * 4) % 2), "#C8102E");

  // the old town: houses cascade down from the Kasbah, thinning out to the right
  const rows = w > 200 ? 6 : 3;
  const unit = w > 200 ? 1 : 0.6;
  for (let row = 0; row < rows; row++) {
    const depth = row / (rows - 1); // 0 = far, 1 = near
    const ry = Y(0.4 + depth * 0.56);
    const size = (1 + depth * 0.9) * unit;
    const reach = 0.5 + depth * 0.4; // nearer rows spread wider
    let hx = x - 3 + (row % 2) * 4;
    let k = row * 53;
    while (hx < X(reach)) {
      const bw = Math.round((5 + hash(k, row) * 6) * size);
      const bh = Math.round((3 + hash(row, k) * 4) * size);
      const fade = (hx - x) / (w * reach);
      if (hash(k, 21) < 0.15 + fade * 0.6) {
        // gap: an olive tree or nothing
        if (hash(k, 22) > 0.5) {
          r(ctx, hx + 1, ry - Math.round(3 * size), Math.round(4 * size), Math.round(3 * size), snow ? "#C9D3CC" : P.leafDark);
          r(ctx, hx + Math.round(2 * size), ry - 1, 1, 2, P.woodDark);
        }
        hx += Math.round(bw * 0.7);
        k++;
        continue;
      }
      const col = hash(k, k) > 0.3 ? P.roof : P.stoneLight;
      r(ctx, hx, ry - bh, bw, bh + Math.round(4 * size), col);
      r(ctx, hx + bw - 1, ry - bh, 1, bh + Math.round(4 * size), P.roofShade);
      r(ctx, hx, ry - bh, bw, 1, snow ? "#FFFFFF" : "#F6F1E7");
      if (size > 1.4 && hash(k, 2) > 0.3) {
        const wx = hx + 2 + ((hash(k, 4) * Math.max(1, bw - 5)) | 0);
        r(ctx, wx, ry - bh + 2, Math.round(size), Math.round(size * 1.4), hash(k, 7) > 0.65 ? P.green : P.inkSoft);
      } else if (hash(k, 2) > 0.5) r(ctx, hx + 2, ry - bh + 2, 1, 1, P.inkSoft);
      // the odd white dome
      if (hash(k, 11) > 0.88 && bw > 8) {
        const dw = bw - 4;
        r(ctx, hx + 2, ry - bh - Math.round(2 * size), dw, Math.round(2 * size), "#FFFFFF");
        r(ctx, hx + 3, ry - bh - Math.round(3 * size), dw - 2, 1, "#FFFFFF");
      }
      hx += bw;
      k++;
    }
  }
  // a minaret
  const mx = X(0.33);
  const mBase = Y(0.62);
  const mh = Math.round(h * 0.2);
  r(ctx, mx, mBase - mh, 4, mh, P.roof);
  r(ctx, mx + 3, mBase - mh, 1, mh, P.roofShade);
  r(ctx, mx - 1, mBase - mh, 6, 2, P.roofShade);
  r(ctx, mx + 1, mBase - mh - 3, 2, 3, P.roof);
  r(ctx, mx + 1, mBase - mh + 5, 1, 2, P.inkSoft);

  ctx.restore();
}

// Falling snow over any rectangle. Deterministic per flake, so it never jitters.
export function drawSnow(ctx, x, y, w, h, t, density = 1) {
  const n = Math.round(((w * h) / 380) * density);
  for (let i = 0; i < n; i++) {
    const speed = 8 + hash(i, 1) * 10;
    const fx = x + ((hash(i, 2) * w + Math.sin(t * 0.8 + i) * 3 + w) % w);
    const fy = y + ((hash(i, 3) * h + t * speed) % h);
    const big = hash(i, 4) > 0.85;
    ctx.fillStyle = big ? "#FFFFFF" : "rgba(255,255,255,0.8)";
    ctx.fillRect(Math.round(fx), Math.round(fy), big ? 2 : 1, big ? 2 : 1);
  }
}
