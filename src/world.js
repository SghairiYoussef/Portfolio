// Room layout: where things are, what blocks movement, where you stand to interact.
import * as A from "./art.js";

export const W = 384;
export const H = 224;
export const WALL_Y = 64;

// Walkable area for the player's feet.
export const BOUNDS = { x0: 12, y0: WALL_Y + 10, x1: W - 12, y1: H - 12 };

export const SPAWN = { x: 204, y: 196 };

// Solid rectangles (feet collide with these).
export const SOLIDS = [
  { x: 72, y: 62, w: 32, h: 12 }, // shelf
  { x: 334, y: 64, w: 28, h: 14 }, // rack
  { x: 34, y: 110, w: 76, h: 26 }, // desk
  { x: 190, y: 143, w: 18, h: 9 }, // cat
  { x: 12, y: 192, w: 16, h: 12 }, // jasmine
  { x: 356, y: 192, w: 16, h: 12 }, // plant
];

// Interaction spots. `at` is where the player walks to when the station is clicked.
// `zone` is the area in which the prompt shows. `marker` floats above the object.
export const SPOTS = [
  { id: "corkboard", zone: { x: 16, y: 72, w: 50, h: 22 }, at: { x: 40, y: 82 }, marker: { x: 40, y: 14 }, hit: { x: 20, y: 16, w: 40, h: 28 } },
  { id: "shelf", zone: { x: 68, y: 74, w: 40, h: 20 }, at: { x: 88, y: 84 }, marker: { x: 88, y: 14 }, hit: { x: 72, y: 14, w: 32, h: 60 } },
  { id: "window", zone: { x: 116, y: 72, w: 56, h: 18 }, at: { x: 144, y: 80 }, marker: null, hit: { x: 110, y: 8, w: 68, h: 50 } },
  { id: "diploma", zone: { x: 178, y: 72, w: 32, h: 20 }, at: { x: 194, y: 82 }, marker: { x: 194, y: 14 }, hit: { x: 184, y: 18, w: 20, h: 24 } },
  { id: "whiteboard", zone: { x: 214, y: 72, w: 60, h: 20 }, at: { x: 244, y: 82 }, marker: { x: 244, y: 12 }, hit: { x: 218, y: 12, w: 52, h: 36 } },
  { id: "door", zone: { x: 284, y: 72, w: 40, h: 22 }, at: { x: 304, y: 82 }, marker: { x: 304, y: 12 }, hit: { x: 290, y: 12, w: 28, h: 52 } },
  { id: "rack", zone: { x: 326, y: 78, w: 46, h: 22 }, at: { x: 348, y: 90 }, marker: { x: 348, y: 10 }, hit: { x: 334, y: 10, w: 28, h: 68 } },
  { id: "desk", zone: { x: 30, y: 136, w: 84, h: 22 }, at: { x: 72, y: 150 }, marker: { x: 72, y: 84 }, hit: { x: 34, y: 92, w: 76, h: 44 } },
  { id: "cat", zone: { x: 178, y: 136, w: 44, h: 28 }, at: { x: 199, y: 160 }, marker: null, hit: { x: 184, y: 138, w: 26, h: 16 } },
];

// Background that never changes: plaster, floor, rug, wall pieces drawn per-frame for animation.
export function drawStatic(ctx) {
  A.drawRoom(ctx, W, H, WALL_Y);
  A.drawRug(ctx, 156, 128, 96, 48);
  A.drawCorkboard(ctx, 20, 16, 40, 28);
}

// Animated wall pieces (behind everything on the floor).
export function drawWall(ctx, t) {
  A.drawWindow(ctx, 120, 10, 48, 42, t);
  A.drawDiploma(ctx, 184, 18, 20, 24, t);
  A.drawWhiteboard(ctx, 218, 12, 52, 34);
  A.drawDoor(ctx, 290, 12, 28, 52);
  A.drawLightPatch(ctx, 124, 40, WALL_Y, t);
}

// Floor objects, depth-sorted with the player by their base y.
export function floorDrawables(t, catAwake) {
  return [
    { y: 74, draw: (c) => A.drawShelf(c, 72, 14, 32, 60) },
    { y: 78, draw: (c) => A.drawRack(c, 334, 10, 28, 68, t) },
    { y: 136, draw: (c) => A.drawDesk(c, 36, 112, 72, 24, t) },
    { y: 152, draw: (c) => A.drawChair(c, 64, 138) },
    { y: 152, draw: (c) => A.drawCat(c, 191, 145, t, catAwake) },
    { y: 204, draw: (c) => A.drawPlant(c, 12, 182, "jasmine", t) },
    { y: 204, draw: (c) => A.drawPlant(c, 356, 182, "fern", t) },
  ];
}
