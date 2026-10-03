# Youssef's Workshop

A playable portfolio. Walk around a small pixel-art house in El Kef, go through the arch into a lab that lays out the Tanilytics architecture end to end, and climb up to the roof terrace for the view of the Kasbah.

**Play:** https://youssefsghairiportfolio.vercel.app · **Regular site:** https://sghairiportfolio.vercel.app

## Areas

**House** — a lime-washed Kef stone room with a view of Jebel Dyr.
Desk (current role), bookshelf (side projects), whiteboard (stack), corkboard (experience), frame (INSAT), letterbox (contact).

**Tanilytics lab** — the whole system as a room. Events ride a conveyor belt from a browser, through the Kong gate, past the Go ingestion service's Bloom filter (duplicates drop into a bin), through three Redpanda brokers, into the processing machine (where packets turn grey: the IP is hashed), and into ClickHouse's columns. Redis, the Spring Boot services, the privacy vault and the live dashboard sit at the end; an ops console and the gzip benchmark are in front. Every machine explains its part.

**Terrace** — the Kasbah on its spur under the cliffs of Jebel Dyr, the old town stepping down the slope. A telescope, a Roman column (Sicca Veneria), and the rooftop water tank every house has.

There are seven secrets. One of them needs a very old code.

## Controls

- **WASD / arrow keys** to walk, **E / Space / Enter** to interact, **Esc** to close
- **Tap or click** anywhere to walk there (with pathfinding), or tap an object to walk up and look at it
- The **Discovered** list in the top-right groups every station by area, counts secrets, and walks you to anything you pick
- Progress is saved in your browser

## How it's built

No game engine and no image assets — plain JavaScript on a `<canvas>`.

- `src/main.js` — loop, rooms and doorways, input (keyboard, mouse, touch), BFS pathfinding on a 4px grid, collision sliding, camera, depth sorting, save
- `src/rooms/` — one module per area: layout, collisions, interaction spots, and the pixel art for that room
- `src/kef.js` — the El Kef landscape, drawn procedurally into any rectangle (used by the window and the terrace), plus snow
- `src/art.js`, `src/font.js`, `src/palette.js` — shared props, the player, a 3×5 pixel font, one palette
- `src/ui.js` + `public/style.css` — title card, HUD, prompt, dialogue panel (DOM, so text is selectable and links are real links)
- `src/content.js` — everything the game says

Rooms render at native resolution (the lab is 528×224) and are scaled up with nearest-neighbour filtering; the camera follows the player when a room is wider than the screen.

```bash
npm install
npm run dev
```

Font: [monogram](https://datagoblin.itch.io/monogram) by datagoblin (CC0).
