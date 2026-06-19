# 物件圖鑑 (Object Showcase) — Design

2026-06-19. Status: **approved** (yazelin) — build autonomously, review 2026-06-20.

## Goal
Turn the dev-only geometry gallery (`preview.html` / `src/preview.js`) into a polished,
player-facing **物件圖鑑** reachable from the title screen — so players can browse every
hand-built 3D object per city and feel the game's richness（「裡面東西很多」）. Also a free
teaser for future `'soon'` cities (the switcher reads the manifest; none exist today — all
three cities are `'ready'`).

## Decisions (approved)
- Ambition: **分區圖鑑** (sectioned showcase) — not a flat grid, not cinematic.
- Architecture: **standalone page** — upgrade `preview.html`, add it as a 2nd Vite build
  input + a neon **「物件圖鑑」** button on the title screen. NOT an in-game overlay.
- Street objects (chunks): **grouped by the 7 tiers**, each band labelled with its tier name.
- No `'soon'` cities right now — handle gracefully, spend no effort on that case today.

## Layout
- Top bar (HTML overlay): **city switcher** pills (台北 / 高雄 / 台中, active highlighted) +
  「← 返回」(back to `index.html`). Switching cities **re-renders in-page** (no reload — this
  is not the game engine, just rebuild the meshes) and syncs `?city=` via `history.replaceState`.
- Header line: city name · total count · scale range, e.g. 「台中 · 99 件物件 · 2 cm → 508 m」
  (scale from engine constants `START_RADIUS_M` / `MONUMENT_HEIGHT_M`; same across cities).
- Sections in roll order, each a labelled band with a count:
  ★ 終點 (1) · 地標 (16) · 收藏 (13) · 街頭物 by tier T0–T6 (10 each = 70).
- Each object: lit, gently spinning geometry + zh name; colour-coded by kind
  (gold / green / pink / blue). **Click → focus overlay**: enlarged spin + name + kind/tier.

## Reuse / scope
- Reuse: preview.js glob discovery + geometry build / normalize / lighting; citySelect neon
  card styling; index.html `.btn` / `--c-*` glow vocabulary.
- Cut (YAGNI): no player-facing search/filter (dev `?kind` / `?item` stay), no intro camera move.

## Files
- `vite.config.js`: `build.rollupOptions.input = { main: index.html, preview: preview.html }`.
- `preview.html`: chrome markup (switcher bar, header, back, focus overlay) + neon styles.
- `src/preview.js`: sectioned layout, in-page switcher, header count/scale, raycast click-to-focus.
- `index.html`: 「物件圖鑑」 button in `#title-overlay` (near `#change-city-button`).
- title-button wiring: navigate to `preview.html?city=<current>` on click.
- README / AGENTS: note the gallery is now a player-facing page (`?kind`/`?item` still dev-usable).

## Verify
`npm run build` (preview.html lands in dist) · `npx vitest run` green · headless showcase
screenshots for all 3 cities + focus mode + the title-button link · 0 console errors.
