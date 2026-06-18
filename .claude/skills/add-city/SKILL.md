---
name: add-city
description: Use when adding a new city (StagePack) to Roll Formosa. Guides the spec → scaffold → content → asset → verify flow so a city ships consistent with 台北/高雄. Read docs/ADD-A-CITY.md for the full reference.
---

# Add a City — guided flow

You are adding a new StagePack city to Roll Formosa. Follow these phases in
order. The authoritative reference (every file, every field, the skyline prompt,
the gotchas) is **`docs/ADD-A-CITY.md`** — read it first. This skill is the
process; that doc is the detail.

Methodology = 甲方思維:**開規格 → 下發包 → 做驗收**. Do not skip Phase 0.

## Phase 0 — Spec (get sign-off BEFORE touching code)

Write a short spec and confirm it with the user. Decide:

- **終點 monument** — the city's TRUE icon (tall tower OR a cultural landmark;
  do not force a tower if the city has none).
- **7-tier theme arc** — the city's own version of 柑仔店→夜市→街→街屋/廟→商業→天際線.
- **8 landmarks + 13 collectibles** — all genuinely local; the food album should
  read as this city.
- **per-tier palette / neon mood.**

Cultural rules (these caused real bugs):
- Never borrow another city's signature (e.g. 機車海/機車瀑布 belongs to 台北).
- Narration in the city's own register/dialect (高雄 uses 台語).
- No tokyo / 東京 / Japanese kana / skytree (test guards will fail).
- Verify any number you state (heights, dates) — don't write from memory.

**Stop and get the user's OK on the spec before building.**

## Phase 1 — Scaffold

```bash
node scripts/new-city.mjs <id> <displayName> <tagline>
```

Creates `src/packs/<id>/` (a taipei copy with id/displayName/seeds rewritten)
and registers it `status:'soon'` in manifest.js. Content is still taipei's.

## Phase 2 — Content

Swap each file per docs/ADD-A-CITY.md Phase 2 (tiers, monument, landmarks,
collectibles, archetypes t0–t6, narration, locale, cityMap/cityData, ending).
**Rewrite the copied `*.test.js` expectations** — they still assert taipei's
values and will fail until updated. Geometry is all code; the engine is untouched.

## Phase 3 — Skyline asset (the only hand-made file)

Make `public/assets/title/skyline-<id>.webp` via the `codex-imagegen` skill
using the prompt recipe in docs/ADD-A-CITY.md (transparent RGBA, ~3:1, neon
silhouette of this city's landmarks). MISSING ⇒ the title silently shows the
台北 skyline — easy to forget, always check.

## Phase 4 — Verify, then flip to ready

```bash
npm run build && npx vitest run
node scripts/headless-check.mjs http://localhost:4173/?city=<id> /tmp/x.png
npm run dev   # NOT prod preview (DEV-only asserts). Eyeball:
              #  - objects sit on the ground (no floating)
              #  - skyline + title/result strings are THIS city
```

When all green: flip manifest `'soon'` → `'ready'`, and update README's
playable-cities list. Only then is it playable.
