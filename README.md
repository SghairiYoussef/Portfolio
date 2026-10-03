# Youssef's Workshop

A playable portfolio: walk around a small pixel-art room in Tunis and look at things to find my work, projects and contact details.

**Play:** https://youssefsghairiportfolio.vercel.app · **Regular site:** https://sghairiportfolio.vercel.app

## What's in the room

| Station | What you learn |
|---|---|
| Desk | Current role — Full Stack Engineer at SpecTraceAI |
| Server rack | Tanilytics, the privacy-first analytics platform |
| Bookshelf | Side projects (GrindAI, CareSync, MeetQuest, DungeonAI, Atlas) |
| Whiteboard | Stack, split by work vs. projects |
| Corkboard | Previous experience and activities |
| Frame | INSAT — and why it's still empty |
| Door | Contact, CV, links |

There are also a window and a cat. The cat is called Kafka.

## Controls

- **WASD / arrow keys** to walk, **E / Space / Enter** to interact, **Esc** to close
- **Tap or click** the floor to walk there, or tap an object to walk up and look at it
- The **Discovered** counter in the top-right lists every station and can walk you to one

## How it's built

No game engine and no image assets. Everything is plain JavaScript on a `<canvas>`:

- `src/art.js` — all pixel art, drawn with 1px rectangles from one palette (`src/palette.js`): plaster and blue Sidi Bou Said walls, terracotta floor, a kilim rug, a studded Tunisian door
- `src/world.js` — room layout, collisions and interaction zones
- `src/main.js` — loop, input (keyboard, mouse, touch), collision sliding, camera, depth sorting
- `src/ui.js` + `public/style.css` — title card, HUD, prompt, dialogue panel (DOM, so text is selectable and links are real links)
- `src/content.js` — everything the stations say

The scene renders at 384×224 and is scaled up with nearest-neighbour filtering. On narrow screens the camera zooms in and follows the player.

```bash
npm install
npm run dev
```

Font: [monogram](https://datagoblin.itch.io/monogram) by datagoblin (CC0).
