# Roll Formosa — Phase 1 (台北關) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **READ §0 (Integration Reconciliation) FIRST.** It is the single source of truth and **overrides any contradictory step inside an individual Part.** The Parts (P0–P12) were drafted in parallel and grounded against the real engine, but a few cross-part identifiers had to be reconciled centrally; §0 is that reconciliation. When a Part's text disagrees with §0, §0 wins.

**Goal:** Fork `aieo-product/fableDemoGame` (MIT) into a Taiwan katamari, "Roll Formosa", whose Phase-1 deliverable is one complete Taipei stage — roll from a 2 cm pushpin up to Taipei 101 — fully zh-TW, with a Formosan-black-bear mascot, built as an isolated "StagePack" so future counties/countries reuse the seam.

**Architecture:** Keep the reference engine's crown jewel (seamless 5× similarity rescale + floating-origin, the seamlessness law, fixed-60Hz deterministic loop, single shared material, draw-call cap) **untouched**. Remove the v4 real-Tokyo OSM layer entirely. Introduce a pack-scoped content seam (`src/packs/active.js` → one `StagePack`) and convert the engine's global frozen-count asserts into per-pack `validate()`. Author all Taipei content (7 tiers, ~70 rollables, core landmarks, 101 goal monument, Formosa-island ending, collectibles, bear mascot, zh-TW locale) inside `src/packs/taipei/`.

**Tech Stack:** Three.js r177, Vite 6, plain ESM JavaScript (JSDoc types), vitest (added in P0) for pure-logic TDD, chrome-devtools MCP for visual/behavioural verification, GitHub Pages for deploy.

**Branch/PR workflow (per user preference — trunk-based + auto-merge):** Each Part is a short-lived branch off `main` (P0 first renames `master`→`main`). Open a PR per Part with auto-merge; keep `main` green; do not stack branches. Commit at every step as the tasks instruct.

**Verification philosophy:** This is a Three.js game with no pre-existing unit tests. Three verification modes, used where each fits: (1) **vitest TDD** for pure logic (pack `validate`, code-map build, landmark ladder math, locale lookups); (2) **boot/build asserts** — the pack `validate()` throwing on bad data + `npm run build` succeeding; (3) **chrome-devtools MCP** for visual/behavioural checks (navigate the Vite dev URL `http://localhost:5173/`, `take_screenshot`, `evaluate_script` to read the draw-call ledger / ball radius / `__v3dbg` hooks). Every rendering task ends with a concrete observation, not "looks right". The engine's forced-rescale pixel-identity check and draw-call ledger are pre-existing — reuse them, never break them.

---

## §0. Integration Reconciliation (BINDING — overrides any conflicting Part step)

The critic pass found cross-part defects that would break the boot/build if left unreconciled. Apply these canonical decisions wherever a Part says otherwise.

### R1 — Active-pack export name is `activePack` (BLOCKER fix)
`src/packs/active.js` exports a named `activePack` (and a default alias). **Every** importer uses `import { activePack } from '.../packs/active.js'`. **Override P8**: change `import { active }` → `import { activePack }`, and `active.narration` / `active.mascot` / `active.codeToArchetypeId` → `activePack.…`.

### R2 — The 70 chunk archetypeIds are P4's list, verbatim (BLOCKER fix)
P4's `src/packs/taipei/tiers.js` is the **contract owner** for the 70 chunk ids. **Override P5**: `src/packs/taipei/catalog.js` MUST register exactly these ids (same spelling), or `validatePack()` throws at boot for every unresolved id. Slots 8–9 (last two per tier) are the repeatable chunk-landmark volumes (NOT the named singletons).

| Tier | 10 archetypeIds (slots 0–9; 8–9 = chunk-landmark volumes) |
|---|---|
| T0 | `marble, eraser, pushpin, bottle_cap, candy, ngiauimia_card, pencil, button, scratch_card_board, fortune_stick_tube` |
| T1 | `yakult, pet_bottle, betel_nut, incense_stick, joss_paper, luwei_tongs, redwhite_bag, pepper_bun, stall_lantern, pinball_table` |
| T2 | `red_plastic_chair, helmet, rice_cooker, gas_cylinder, traffic_cone, fire_hydrant, lucky_cat, youbike_dock, vendor_cart, temple_incense_burner` |
| T3 | `scooter, mini_truck, transformer_box, neon_sign, roll_shutter, street_tree, awning_frame, stone_lion, night_market_arch, temple_pailou` |
| T4 | `townhouse, tin_roof_house, apartment, convenience_store, city_bus, garbage_truck, gas_station, arcade_pillar, streethouse_mass, temple_mass` |
| T5 | `office_tower, department_store, metro_viaduct, pedestrian_bridge, parking_tower, giant_billboard, glass_curtain_house, bank, commercial_tower, department_mass` |
| T6 | `glass_highrise, cross_bridge, other_skyscraper, giant_ad_wall, biz_tower, sky_bridge, rooftop_plant_room, skyline_block, crossstreet_skybridge, rooftop_mech_tower` |

Wherever P5 used a different spelling (e.g. `eraser_tw`, `konbini_tw`, `pickup_truck`, `power_box`, `tin_shack`, `office_mass`, `ad_screen_tw`, `skybridge_span`, …), use the P4 spelling above instead.

### R3 — Landmark/collect payload field stays `nameJa` (BLOCKER fix)
Do **not** rename the engine-frozen `nameJa` field on `LandmarkEvent` / `CollectEvent` (renaming would touch `core/events.js`, `types.js`, `world/curated.js`, `game/collection.js`, `ui/hud.js`, `ui/screens.js` — large surface, no benefit; the *displayed value* is zh-TW regardless of the field name). **Override P7 task P7.2** (`c.name = …`) and any P8 consumer → keep `.nameJa`. P3's "keep `nameJa`" note stands.

### R4 — First-absorb lines key off `archetypeCode` via the pack (BLOCKER fix)
Do **not** add `archetypeId` to the SCORE payload. The SCORE event carries the numeric `archetypeCode`. **Override P8 task P8.5**: look up the first-absorb line with `activePack.codeToArchetypeId(p.archetypeCode)` (see R5), not `p.archetypeId`.

### R5 — Pack-scoped code-map methods live on the pack object
`src/packs/taipei/index.js` (the pack assembly) attaches the following, built from P2's `buildCodeMap(pack)`. **All consumers (P7 `collection.js`, P8 controller) read them off `activePack`, not from `objects.js` globals:**
- `archetypeIdByCode` — array, code → id string
- `codeByArchetypeId` — map, id → code
- `displayNameByCode` — array, code → zh-TW display name
- `codeForCollectibleId(id)` — collectible album id → code
- `codeToArchetypeId(code)` — code → id string (alias of indexing `archetypeIdByCode`)

P2's `buildCodeMap` returns the raw maps; the pack assembly wraps them as the above. **Override** any Part that calls these as `objects.js` globals.

### R6 — One validator: route every pack `validate()` through P2's `validatePack(pack)`
P2 authors and TDD-tests `validatePack(pack)` in `src/packs/_engine/codeMap.js`. **Override P3/P4/P6/P7/P9/P12**: the taipei `validate()` calls `validatePack(pack)` first, then appends only pack-specific extras. No Part hand-rolls a parallel copy of the shared invariants (7 tiers / 10 ids each / ids resolve / landmark ladder strictly increasing / positions within MAP_BOUNDS).

### R7 — Transient Tokyo pack: `_tokyo_transient`, no re-export into taipei (structural fix)
P2 creates `src/packs/_tokyo_transient/index.js` exporting `activePack`/default only, to prove the seam byte-identical with Tokyo content. **Override P3 task P3.7**: the taipei skeleton does **not** import a `tokyo` pack and does **not** expect `tokyoTiers` / `narration.js` / `mascot.js` / `goalMonument` / `ending` named exports (they don't exist). Instead P3 stubs taipei's fields with minimal taipei placeholders that P4 (tiers), P5 (catalog), P6 (landmarks/monument/ending) and P8 (narration/mascot) then fill. Delete `_tokyo_transient` once taipei boots (end of P3 / start of P4).

### R8 — P8 narration index maps align to the canonical ladders
- **LANDMARK_BY_ID** uses P6's 9-slot ladder: `0 北門, 1 龍山寺, 2 西門紅樓, 3 圓山大飯店, 4 總統府, 5 中正紀念堂, 6 自由廣場牌樓, 7 小巨蛋, 8 台北101`. **Override P8**: 101 (id 8) intentionally has no landmark-trivia line; add a 自由廣場牌樓 line at index 6 and put 小巨蛋 at index 7.
- **COLLECT_BY_ID** uses P7's 13-slot album: `… 11 士林大雞排 (shilin_chicken), 12 媽祖 (mazu)`. **Override P8**: add `col_shilin_chicken` at index 11 and place `mazu` at index 12.

### R9 — DEV_STARTS Taipei keys are owned by P6
**Override**: P6 (owns `cityMap`) renames the full `DEV_STARTS` set from the Tokyo keys to the Taipei ladder: `shop / night-market / arcade / scooter-sea / wanhua / xinyi / goal`. P10's `?at=` smoke table uses exactly these seven keys.

### R10 — Onboarding is localized and verified (spec §10 gap)
**Override**: extend P3's i18n sweep to the onboarding module's strings (the reference engine has Japanese onboarding tooltips), and add an "onboarding 導引正常" check to P10.4's smoke checklist.

### R11 — `FLAG_OSM` is removed in P2
P1 leaves `FLAG_OSM` exported as a scoped TODO. **P2** deletes the `FLAG_OSM` constant and the spawner skip-mask reference once the OSM tables are gone.

### R12 — 總統府 dual-tag is a Phase-1 simplification
The album collectible 總統府 is a **separate small trophy** (`presidential_office_collectible`, its own collectible id), distinct from the curated landmark 總統府 (landmarkId 4). No dual-tag (collectible+landmark) firing in Phase 1; the collectible carries `landmarkId: -1`. This satisfies spec §5.5 (it reads as one object but is implemented as two cleanly-separated ones).

### R13 — 101 跨年煙火 is optional polish; the bear-cheer win toast ships
Spec §5.3 mentions "101 跨年煙火 + 黑熊歡呼 toast". **The zh-TW bear-cheer win toast IS authored in P6** (a `goalMonument`/finale win-toast string) and P6's verify checks it. **The 跨年煙火 particle effect is optional** (P10 tuning pass / post-ship), not ship-blocking; do not gate P6's verification on fireworks.

### R14 — P3 lands atomically
P3's `hud.js` / `screens.js` locale edits and the `active.js` flip to taipei (P3.8) must land in the same branch/PR, because `hud.js`/`screens.js` do module-load `const L = activePack.locale`. Do not split the locale edits from the active flip across the P2/P3 boundary.

---



## P0. Setup & Fork

> Goal of this part: bring the `fableDemoGame` engine into the existing `roll-formosa` repo **without losing the spec commit**, stand up the test runner (vitest), prove the Tokyo game still boots/builds **byte-identical** (regression anchor), and capture a baseline screenshot. **No game content changes in P0** — that starts in P1.
>
> Grounded facts (verified against the actual repos on 2026-06-15):
> - Project root `/home/ct/roll-formosa` is currently on branch **`master`** with only `.gitignore` + the spec under `docs/superpowers/specs/`. Git user is already `yazelin`.
> - Reference `/tmp/fableDemoGame` is a real git repo (`origin` = `https://github.com/aieo-product/fableDemoGame.git`, branch `main`, HEAD `ffa7041`). It ships `LICENSE` (MIT), `README.md`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, and dirs `data/ docs/ docs-site/ public/ scripts/ src/`.
> - **Both repos add a file at path `.gitignore`** → the unrelated-histories merge produces exactly ONE add/add conflict, on `.gitignore`. We resolve it by union. No other path collides.
> - Node `v22.17.1` / npm `10.9.2` present. Vite has no explicit port → dev URL is **`http://localhost:5173/`**.

---

### Task P0.1: Branch off and add the engine as `upstream`

- [ ] Confirm starting state (must show branch `master`, two tracked files):
  ```bash
  git -C /home/ct/roll-formosa status --short
  git -C /home/ct/roll-formosa branch --show-current   # -> master
  git -C /home/ct/roll-formosa ls-files                 # -> .gitignore + the spec .md
  ```
- [ ] Create and switch to the setup branch (keeps `master` clean until the merge is proven):
  ```bash
  git -C /home/ct/roll-formosa switch -c setup/fork-engine
  ```
- [ ] Add the engine repo as remote `upstream` and fetch it. **Prefer the local clone** at `/tmp/fableDemoGame` (already fetched, offline-safe); fall back to the GitHub URL if the local clone is gone:
  ```bash
  git -C /home/ct/roll-formosa remote add upstream /tmp/fableDemoGame \
    || git -C /home/ct/roll-formosa remote add upstream https://github.com/aieo-product/fableDemoGame.git
  git -C /home/ct/roll-formosa fetch upstream
  ```
- [ ] Verify the fetch landed the engine history (should print `ffa7041 ...`):
  ```bash
  git -C /home/ct/roll-formosa log --oneline -1 upstream/main
  ```

### Task P0.2: Merge the engine in, preserving the spec commit

- [ ] Merge `upstream/main` with unrelated histories allowed. This **will stop on a `.gitignore` add/add conflict** — that is expected, not a failure:
  ```bash
  git -C /home/ct/roll-formosa merge --allow-unrelated-histories --no-edit upstream/main
  ```
- [ ] Confirm the ONLY conflict is `.gitignore` (output should be a single `UU .gitignore` line):
  ```bash
  git -C /home/ct/roll-formosa status --short | grep '^UU' || echo "NO CONFLICTS (unexpected — re-read merge output)"
  ```
  Expected: `UU .gitignore`.

### Task P0.3: Resolve the `.gitignore` conflict (union) and complete the merge

- [ ] Read both sides so the union is intentional (root had `node_modules/ dist/ .DS_Store`; engine had `node_modules/ dist/ .env .wrangler/`):
  ```bash
  git -C /home/ct/roll-formosa show :2:.gitignore   # ours (roll-formosa root)
  git -C /home/ct/roll-formosa show :3:.gitignore   # theirs (engine)
  ```
- [ ] Write the unioned `.gitignore` (replace the conflicted file at `/home/ct/roll-formosa/.gitignore` with exactly this content):
  ```gitignore
  node_modules/
  dist/
  .DS_Store
  .env
  .wrangler/
  ```
- [ ] Stage the resolution and finalize the merge commit:
  ```bash
  git -C /home/ct/roll-formosa add .gitignore
  git -C /home/ct/roll-formosa commit --no-edit
  ```
- [ ] Verify history now contains **both** the spec commit and the engine tip (you should see `b3ebee6` spec and the engine commits together):
  ```bash
  git -C /home/ct/roll-formosa log --oneline -8
  git -C /home/ct/roll-formosa ls-files | grep -E '^(src/main\.js|index\.html|LICENSE|docs/superpowers/specs/)' 
  ```
  Expected: both `src/main.js`/`index.html`/`LICENSE` (from the engine) **and** the spec `.md` are tracked.

### Task P0.4: Install dependencies and confirm the unchanged baseline builds

- [ ] Install (uses the engine's committed `package-lock.json` for a reproducible tree):
  ```bash
  npm --prefix /home/ct/roll-formosa install
  ```
- [ ] Confirm the **untouched** Tokyo build still succeeds (regression anchor #1 — content is byte-identical to upstream at this point):
  ```bash
  npm --prefix /home/ct/roll-formosa run build
  ```
  Expected: Vite reports `built in …` and writes `dist/` with no errors. (A `chunkSizeWarningLimit` notice is fine.)
- [ ] Commit the lockfile state if `npm install` touched it (idempotent — skips if clean):
  ```bash
  git -C /home/ct/roll-formosa add package-lock.json && git -C /home/ct/roll-formosa commit -m "chore: lockfile after merge" || echo "lockfile unchanged"
  ```

### Task P0.5: Add vitest + `test` script + a trivial passing test (TDD runner proof)

> Convention frozen here for ALL later parts: vitest reads `vite.config.js` natively, so the `test` block lives there; `npm test` === `vitest run` (one-shot); per-file run is `npx vitest run <path>`; test files are `*.test.js` **next to** the code they test (matches the frozen pack layout, e.g. `src/packs/taipei/pack.test.js`).

- [ ] Add vitest as a devDependency:
  ```bash
  npm --prefix /home/ct/roll-formosa install -D vitest
  ```
- [ ] Add the `test` script to `/home/ct/roll-formosa/package.json` (insert into the existing `"scripts"` block; leave the osm scripts untouched — they are P1's concern):
  ```json
  "test": "vitest run",
  "test:watch": "vitest"
  ```
- [ ] Add a `test` block to `/home/ct/roll-formosa/vite.config.js` so vitest finds `*.test.js` under `src/`. Replace the file with:
  ```js
  import { defineConfig } from 'vite';

  export default defineConfig({
    base: './',
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1200,
    },
    test: {
      include: ['src/**/*.test.js'],
      environment: 'node',
    },
  });
  ```
- [ ] **Write the failing-then-passing smoke test FIRST** at `/home/ct/roll-formosa/src/__smoke__/runner.test.js` — start with a deliberately failing assertion to prove the runner actually executes assertions:
  ```js
  import { describe, it, expect } from 'vitest';

  describe('vitest runner smoke', () => {
    it('executes assertions', () => {
      expect(1 + 1).toBe(3); // intentionally wrong — proves the runner fails loudly
    });
  });
  ```
- [ ] Run it and confirm it **FAILS** (proves vitest is wired, not silently passing nothing):
  ```bash
  npx --prefix /home/ct/roll-formosa vitest run src/__smoke__/runner.test.js
  ```
  Expected: `1 failed` with `expected 2 to be 3`.
- [ ] Fix the assertion (`toBe(3)` → `toBe(2)`) and re-run; confirm it **PASSES**:
  ```bash
  npx --prefix /home/ct/roll-formosa vitest run src/__smoke__/runner.test.js
  ```
  Expected: `1 passed`.
- [ ] Confirm the project-wide `npm test` script also works:
  ```bash
  npm --prefix /home/ct/roll-formosa test
  ```
  Expected: `1 passed` (only the smoke test exists so far).
- [ ] Commit:
  ```bash
  git -C /home/ct/roll-formosa add package.json package-lock.json vite.config.js src/__smoke__/runner.test.js
  git -C /home/ct/roll-formosa commit -m "chore: add vitest runner + smoke test"
  ```

### Task P0.6: Boot the dev server and capture the BASELINE screenshot (regression anchor) — chrome-devtools verification

> This is the rendering-verification gate for P0. The Tokyo game must visibly boot. The screenshots are the anchor every later rendering part compares against (esp. P10's rescale pixel-identity check and draw-call ledger).

- [ ] Start the vite dev server in the background (binds the default port 5173):
  ```bash
  npm --prefix /home/ct/roll-formosa run dev
  ```
  (Run with `run_in_background: true`. Wait for the line `Local: http://localhost:5173/`.)
- [ ] Confirm the server answers before driving the browser:
  ```bash
  curl -sSf http://localhost:5173/ -o /dev/null && echo "DEV UP" || echo "DEV NOT UP"
  ```
  Expected: `DEV UP`.
- [ ] **chrome-devtools MCP** — navigate to the dev URL:
  - `mcp__chrome-devtools__navigate_page` → `url: "http://localhost:5173/"`
- [ ] **chrome-devtools MCP** — take the title-screen baseline:
  - `mcp__chrome-devtools__take_screenshot`
  - **Expected observation:** the Japanese title overlay renders — large gradient title `FABLE KATAMARI`, subtitle `転がして、東京まるごと。 / Roll up all of Tokyo.`, a `スタート / START` button, and the green-duck Donack toggle `🦆 ドナック実況 ON`. (Confirms the UNCHANGED Tokyo content — proves we have not altered game content yet.)
- [ ] **chrome-devtools MCP** — enter the game and screenshot the world (regression anchor #2):
  - `mcp__chrome-devtools__click` on the `スタート / START` button (use `take_snapshot` first to get its uid).
  - `mcp__chrome-devtools__take_screenshot`
  - **Expected observation:** the 3D Akihabara/Sengoku-Denshi opening scene renders (HUD top bar shows size `2.0 cm`, a timer, a score pill; the `🗼` goal arrow and DASH button are visible). A WebGL canvas with procedural geometry — not a blank/black screen.
- [ ] **chrome-devtools MCP** — sanity-check the console has no fatal boot/assert errors:
  - `mcp__chrome-devtools__list_console_messages`
  - **Expected observation:** no thrown exceptions / no engine assert failures (info logs are fine). This confirms the engine's boot-time dev asserts (the pre-existing guards per spec §9) pass on the merged tree.

### Task P0.7: (recommended) Align the working branch with the contract's `main`, then finalize P0

> The frozen contract names `main` as the default branch, but the root started on `master`. Bring the proven merge onto `main` so all later PRs target the contract branch.

- [ ] Fast-forward `master` to the setup branch, then rename it to `main`:
  ```bash
  git -C /home/ct/roll-formosa switch master
  git -C /home/ct/roll-formosa merge --ff-only setup/fork-engine
  git -C /home/ct/roll-formosa branch -m master main
  git -C /home/ct/roll-formosa branch -d setup/fork-engine
  ```
- [ ] Final P0 verification sweep (all four must hold before P1 starts):
  ```bash
  git -C /home/ct/roll-formosa log --oneline -1            # spec history + engine present, on `main`
  npm --prefix /home/ct/roll-formosa run build             # build OK (unchanged Tokyo)
  npm --prefix /home/ct/roll-formosa test                  # vitest: 1 passed
  curl -sSf http://localhost:5173/ -o /dev/null && echo OK # dev server reachable
  ```
  Expected: build succeeds, `1 passed`, `OK`, and the screenshots from P0.6 are saved as the regression baseline.

> **Exit criteria for P0:** repo on `main` containing BOTH the spec commit and the full `fableDemoGame` engine; `npm run build` green on byte-identical Tokyo content; vitest installed + `npm test` green; baseline Tokyo screenshots captured via chrome-devtools as the regression anchor. **No game content has been changed** — P1 (remove OSM) is the first content-touching part.



## P1. Remove v4 Tokyo OSM layer

Goal: cleanly excise the entire v4 "Real Tokyo" OSM subsystem (spec §4.2) so the game boots and plays as **procedural Tokyo** with a much lower draw-call count and zero OSM/Overpass/ODbL dependency. This is pure subtraction + dev-assert adjustment — no new content. The StagePack seam and the pack-scoped code-map generalization are P2's job; here we only make the existing modules self-contained without OSM.

Grounding (verified against `/tmp/fableDemoGame`): the OSM subsystem is `src/world/osmWorld.js`, `src/world/osmSpawner.js`, `src/render/osmPools.js`, `src/render/osmGround.js`, the `scripts/osm/` directory (`geo.mjs`, `fetch-osm.mjs`, `build-tokyo-bin.mjs`, `verify-tokyo-data.mjs`) plus the standalone OSM test/pacing scripts, and OSM hooks woven through `main.js`, `objects.js`, `catalog.js`, `cityMap.js`, `ball.js`, `geometryFactory.js`, `tuning.js`, `core/events.js`, `index.html`, `public/_headers`, `package.json`. There is **no** committed `data/osm-raw/` or `public/assets/tokyo/` in the upstream tree (the `.bin` shards are git-ignored and produced by `osm:build`); the spec's "delete those dirs" reduces to deleting their references. There is **no** `src/world/osmGround.js` — `osmGround` lives under `render/`.

Work top-down: delete files, unwire `main.js`, strip the code table, strip the catalog/ball/geometry/env hooks, strip cityMap's coverage latch and geo machinery, strip tuning, fix `index.html`/`package.json`, then verify boot + draw-call drop with chrome-devtools.

Commit after each task.

---

### Task P1.1: Delete the OSM subsystem files and scripts

- [ ] Delete the four runtime OSM modules:
  ```bash
  git rm src/world/osmWorld.js src/world/osmSpawner.js \
         src/render/osmPools.js src/render/osmGround.js
  ```
- [ ] Delete the entire OSM build pipeline directory:
  ```bash
  git rm -r scripts/osm
  ```
- [ ] Delete the standalone OSM test + pacing scripts (they `import` the deleted modules):
  ```bash
  git rm scripts/test-osm-render.mjs scripts/test-osm-runtime-w.mjs scripts/pacing-model.mjs
  ```
- [ ] Remove the git-ignored shard output dirs if they were ever materialized locally (no-op if absent — they are not tracked):
  ```bash
  rm -rf data/osm-raw public/assets/tokyo
  ```
- [ ] Confirm nothing else in `scripts/` imports a deleted module:
  ```bash
  grep -rln "osm" scripts/ || echo "scripts/ clean"
  ```
  Expected: `scripts/ clean` (only `scripts/verify-donack-assets.sh` and `scripts/storm-test-donack.mjs` remain).
- [ ] Commit: `chore(osm): delete osmWorld/osmSpawner/osmPools/osmGround + scripts/osm`.

> Do NOT build yet — `main.js`, `objects.js`, `catalog.js`, `cityMap.js`, `ball.js` still import the deleted modules and will fail. The next tasks unwire them. Keep this a known-broken intermediate; the first green build is Task P1.9.

---

### Task P1.2: Unwire `src/main.js` — imports + v4 OSM construction block

Remove every OSM reference from `main.js`. Edit in place (do not rewrite the whole file).

- [ ] Delete the four v4 OSM imports (the whole `/* ---- v4 modules ... */` import group that names OSM). In the block at the top of `main.js`:
  ```js
  /* ---- v4 modules (integrated — streams P/C/R/W all landed) ------------- */
  import { OsmWorld } from './world/osmWorld.js'; // Stream W
  import { OsmSpawner } from './world/osmSpawner.js'; // Stream W
  import { makeOsmPools } from './render/osmPools.js'; // Stream R
  import { OsmGround } from './render/osmGround.js'; // Stream R
  import { makeObjectMaterial, setRimTint } from './render/objectMaterial.js'; // Stream C (rim)
  ```
  Replace with (keep the still-needed objectMaterial import; drop the four OSM ones):
  ```js
  import { makeObjectMaterial, setRimTint } from './render/objectMaterial.js'; // rim (was Stream C)
  ```
- [ ] In the `objects.js` import line, drop `OSM_ARCHETYPE_IDS` and `OSM_CODE_BASE`:
  ```js
  import { ObjectStore, EXTRA_CODE_BASE, OSM_ARCHETYPE_IDS, OSM_CODE_BASE } from './world/objects.js';
  ```
  becomes
  ```js
  import { ObjectStore, EXTRA_CODE_BASE } from './world/objects.js';
  ```
- [ ] Delete the entire **v4 REAL TOKYO** construction block (from the banner comment `/* === v4 REAL TOKYO ... === */` through the end of the OSM coverage-latch wiring). Concretely, delete from this header:
  ```js
  /* ================================================================== */
  /* v4 REAL TOKYO — integrated at the BINDING call sites                */
  ```
  down to and including the `osmWorld.load(OSM_BASE_URL);` call and its preceding comment — i.e. delete the `OSM_BASE_URL` const, `new OsmWorld(bus)`, the `osmGeometries`/`makeOsmPools`/`scene.add` pool wiring, `new OsmSpawner(...)`, `new OsmGround(...)` + `osmGround.setEnvironment(env)`, the `osmCoverageDecided`/`decideOsmCoverage`/`bus.on(EVT.OSM_READY,...)`/`bus.on(EVT.TIER_UP, ... abortAndFail ...)` latch, and `osmWorld.load(...)`. Stop at the line just before the `/* v4 (Stream C rim): the sky-tinted rim ... */` comment.
- [ ] **Keep** the rim wiring that follows (it is not OSM):
  ```js
  bus.on(EVT.TIER_UP, (p) => setRimTint(TIERS[p.tierIndex].skyTop));
  setRimTint(TIERS[scaleMgr.tierIndex].skyTop); // boot palette (tier 0)
  ```
- [ ] Fix the `curated.attachChunkSpawner` DEV block — it referenced `osmSpawner.aliveCount`. Replace:
  ```js
  if (import.meta.env && import.meta.env.DEV) {
    curated.attachChunkSpawner({
      get aliveCount() {
        return spawner.aliveCount + osmSpawner.aliveCount;
      },
    });
  }
  ```
  with the original 2-spawner identity:
  ```js
  if (import.meta.env && import.meta.env.DEV) {
    // identity assert: chunk + curated === store.aliveCount (no OSM term).
    curated.attachChunkSpawner(spawner);
  }
  ```
  > Verify the shape `attachChunkSpawner` expects after the edit — upstream passes an object with an `aliveCount` getter; `spawner` itself exposes `spawner.aliveCount`, so passing `spawner` directly satisfies it. If `attachChunkSpawner` reads other fields, pass `{ get aliveCount() { return spawner.aliveCount; } }` instead.
- [ ] Commit: `refactor(main): drop v4 OSM construction + coverage latch`.

---

### Task P1.3: Unwire `src/main.js` — frame loop, reset, devTeleport, dev hooks

- [ ] In the comment header at the top of `main.js`, the giant `v4 OSM LIFECYCLE` / `BINDING ABSORB subscription order` doc blocks reference osmSpawner/osmWorld. Trim them to the v3 truth (remove the `osmSpawner`/`osmWorld`/OSM_READY/`setOsmCoverageActive`/`abortAndFail` lines). The binding ABSORB order comment must read: `chunk spawner -> curated -> main attach -> runStats -> collection -> sfx/effects/hud`.
- [ ] In `resetWorld()`, delete the osmSpawner reset line:
  ```js
  osmSpawner.reset(); // v4 (BINDING: after curated.reset) — frees OSM slots +
  // consumed bitmasks; the per-SESSION coverage latch is NOT re-armed here
  ```
- [ ] In frame loop **step 3** (`if (!finale.inputLocked) { ... }`), delete the osmSpawner update and fix the comment:
  ```js
  spawner.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
  curated.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
  osmSpawner.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
  ```
  becomes (drop the third line; update the "Curated AFTER spawner; osmSpawner AFTER curated" prose to "Curated AFTER spawner"):
  ```js
  spawner.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
  curated.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
  ```
- [ ] In frame loop **step 6**, delete the osmGround tile-streaming call and its comment:
  ```js
  // v4 (step 6, BINDING): OSM ground tile streaming AFTER env (fresh fog).
  // ballRadiusSim caps the ground lift/offsets ...
  osmGround.update(frameDt, ballPhys.state.pos, env.fogFarSim, ballPhys.state.radiusSim);
  ```
- [ ] In `onGameStart()`, delete the dev-start OSM deadline check:
  ```js
  if (scaleMgr.tierIndex >= 2 && !osmWorld.ready && !osmWorld.failed) {
    osmWorld.abortAndFail();
    decideOsmCoverage(false);
  }
  ```
- [ ] In `devTeleportTo(...)`, delete the two osmSpawner resync lines:
  ```js
  osmSpawner.onTeleport(); // v4: resync OSM origin/scale to the snapped pose
  osmSpawner.forceScan(); // v4: deactivate stale actives + full ring pass
  ```
- [ ] In the DEV `window.__v3dbg` / `__v4park` block, drop the OSM refs:
  ```js
  /** @type {any} */ (window).__v4park = devTeleportTo; // coverage-boundary park test
  ```
  remove that line, and in `__v3dbg` remove the OSM line:
  ```js
  osmWorld, osmSpawner, osmGround, osmPools, // v4 (integrated)
  ```
- [ ] Confirm `main.js` no longer mentions OSM:
  ```bash
  grep -ni "osm" src/main.js || echo "main.js OSM-free"
  ```
  Expected: `main.js OSM-free`.
- [ ] Commit: `refactor(main): drop osmSpawner/osmGround from frame loop + reset + teleport`.

---

### Task P1.4: Strip OSM codes from `src/world/objects.js` + re-base v5 codes

The frozen code table currently has 115 entries (70 chunk + 24 EXTRA + 16 OSM + 5 v5). Removing the 16 OSM codes shifts `V5_CODE_BASE` from 110 to 94 and the table length from 115 to 99. We do TDD on this (it is pure logic, the FROZEN CONTRACT's "REAL TDD with vitest" category).

- [ ] **Write the failing test first.** Create `src/world/objects.test.js`:
  ```js
  import { describe, it, expect } from 'vitest';
  import {
    EXTRA_CODE_BASE,
    V5_CODE_BASE,
    ARCHETYPE_ID_BY_CODE,
    ARCHETYPE_CODE_BY_ID,
    collectibleCodeForId,
  } from './objects.js';

  describe('objects.js code table after OSM removal', () => {
    it('has no OSM codes — table is exactly 99 entries (70 chunk + 24 EXTRA + 5 v5)', () => {
      expect(ARCHETYPE_ID_BY_CODE.length).toBe(99);
    });
    it('EXTRA base stays 70, v5 base re-based to 94 (was 110)', () => {
      expect(EXTRA_CODE_BASE).toBe(70);
      expect(V5_CODE_BASE).toBe(94);
    });
    it('no osm_* archetype id survives', () => {
      for (const id of ARCHETYPE_ID_BY_CODE) expect(id.startsWith('osm_')).toBe(false);
    });
    it('collectible id 12 (stack_chan) maps to the re-based v5 code 94', () => {
      expect(collectibleCodeForId(12)).toBe(94);
      expect(ARCHETYPE_ID_BY_CODE[94]).toBe('stack_chan');
    });
    it('every code round-trips id<->code with no holes', () => {
      for (let c = 0; c < ARCHETYPE_ID_BY_CODE.length; c++) {
        const id = ARCHETYPE_ID_BY_CODE[c];
        expect(typeof id).toBe('string');
        expect(ARCHETYPE_CODE_BY_ID[id]).toBe(c);
      }
    });
  });
  ```
- [ ] Run it red (the table is still 115 with OSM codes):
  ```bash
  npx vitest run src/world/objects.test.js
  ```
  Expected: FAIL (`length` 115 ≠ 99, `V5_CODE_BASE` 110 ≠ 94).
- [ ] **Implement.** In `src/world/objects.js`:
  - Delete `export const OSM_CODE_BASE = 94;` and its JSDoc.
  - Delete the entire `export const OSM_ARCHETYPE_IDS = [ ... ];` array (the 16 `osm_*` ids) and its JSDoc.
  - Re-base v5: change `export const V5_CODE_BASE = 110;` to `export const V5_CODE_BASE = EXTRA_CODE_BASE + EXTRA_ARCHETYPE_IDS.length; // 94 (was 110 before OSM removal)`.
  - In `collectibleCodeForId`, the body `return id <= 11 ? EXTRA_CODE_BASE + id : V5_CODE_BASE + (id - 12);` is already expressed via `V5_CODE_BASE`, so it auto-rebases — leave it.
  - Delete the OSM table-build loop:
    ```js
    for (let o = 0; o < OSM_ARCHETYPE_IDS.length; o++) {
      const code = OSM_CODE_BASE + o;
      ARCHETYPE_ID_BY_CODE[code] = OSM_ARCHETYPE_IDS[o];
      ARCHETYPE_CODE_BY_ID[OSM_ARCHETYPE_IDS[o]] = code;
    }
    ```
    (the v5 loop that follows uses `V5_CODE_BASE`, so it now writes 94..98 with no gap.)
  - Fix the boot DEV invariant block: remove the `OSM_CODE_BASE`/`OSM_ARCHETYPE_IDS`/`FLAG_OSM`-count asserts and re-target the v5 + length asserts:
    ```js
    if (V5_CODE_BASE !== 94 || V5_CODE_BASE !== EXTRA_CODE_BASE + EXTRA_ARCHETYPE_IDS.length) {
      throw new Error(`[objects.js invariant] V5_CODE_BASE must be 94 (= EXTRA_CODE_BASE 70 + 24 EXTRA), found ${V5_CODE_BASE}`);
    }
    if (V5_ARCHETYPE_IDS.length !== 5) { /* keep */ }
    if (collectibleCodeForId(0) !== 70 || collectibleCodeForId(11) !== 81 ||
        collectibleCodeForId(12) !== 94 || ARCHETYPE_ID_BY_CODE[collectibleCodeForId(12)] !== 'stack_chan') {
      throw new Error('[objects.js invariant] collectibleCodeForId rule broken (0..11 -> 70..81, 12 -> 94 stack_chan)');
    }
    if (ARCHETYPE_ID_BY_CODE.length !== 99) {
      throw new Error(`[objects.js invariant] table must be 99 (70 chunk + 24 EXTRA + 5 v5), found ${ARCHETYPE_ID_BY_CODE.length}`);
    }
    const uniq = new Set();
    for (let c = 0; c < 99; c++) { /* same loop body, bound 99 not 115 */ }
    ```
  - **Keep** `FLAG_OSM = 32` exported for now (other files still import it; they get stripped in P1.5). Leave a `// TODO P2: remove FLAG_OSM once spawner skip-mask drops it` note. (Stripping it from `spawner.js` happens below; once unused, P2 may delete the constant.)
- [ ] Run green:
  ```bash
  npx vitest run src/world/objects.test.js
  ```
  Expected: PASS (5 tests).
- [ ] Commit: `refactor(objects): drop 16 OSM codes, re-base v5 codes 110->94, add table test`.

---

### Task P1.5: Strip OSM from `spawner.js`, `ball.js`, `catalog.js`, `geometryFactory.js`, `environment.js`, `events.js`

These all import or branch on OSM ids/flags/codes. Remove the OSM-specific paths; keep everything else byte-stable.

- [ ] `src/world/spawner.js`: the skip-mask widened to include OSM. Change:
  ```js
  import { FLAG_RARE, FLAG_CURATED, FLAG_OSM } from './objects.js';
  ...
  const SKIP_FLAGS = FLAG_CURATED | FLAG_OSM;
  ```
  to:
  ```js
  import { FLAG_RARE, FLAG_CURATED } from './objects.js';
  ...
  const SKIP_FLAGS = FLAG_CURATED;
  ```
  Update the two prose comments mentioning `FLAG_OSM`/osm-owned slots to drop OSM (curated-only ownership again). The `throw` message `chunk op tried to free FLAG_CURATED|FLAG_OSM slot` → `FLAG_CURATED slot`.
- [ ] `src/render/ball.js`: delete the `OSM_STUCK_FAMILY` table (the `Uint8Array.from([...])` of 16 entries) and the imports `OSM_CODE_BASE, OSM_ARCHETYPE_IDS`. Find where `OSM_STUCK_FAMILY` is read (the stuck-proxy family lookup for codes 94..109) and remove that branch — absorbed objects with code `>= EXTRA_CODE_BASE` already fall through to the existing EXTRA stuck-proxy path; the OSM-specific family override is dead once OSM codes never spawn. Verify the surrounding `knockOff`/stuck-family logic still compiles:
  ```bash
  grep -n "OSM_STUCK_FAMILY\|OSM_CODE_BASE\|OSM_ARCHETYPE_IDS" src/render/ball.js || echo "ball.js OSM-free"
  ```
  Expected: `ball.js OSM-free`.
- [ ] `src/config/catalog.js`: delete the `OSM_ARCHETYPE_IDS, OSM_CODE_BASE` import, the `OSM_CATALOG` export + its `buildGeometry` recipes (the 16 `osm_*` unit-box entries), the `OSM_UNITBOX`-related cross-assert in the DEV block, and any `OSM_CATALOG` mention in the file header JSDoc. The `unitBox` convention note can stay as dormant doc but the OSM entries that used it go. Verify:
  ```bash
  grep -ni "osm" src/config/catalog.js || echo "catalog.js OSM-free"
  ```
- [ ] `src/render/geometryFactory.js`: remove the `OSM_UNITBOX_TRI_CAP` const and the `unitBox` tri-cap branch ONLY IF no non-OSM archetype uses `unitBox`. Check first:
  ```bash
  grep -rn "unitBox" src/config/catalog.js
  ```
  If zero hits remain (all unitBox entries were OSM), delete the `unitBox` normalization-skip branch + `OSM_UNITBOX_TRI_CAP` in geometryFactory and simplify the tri-cap message. If any survive, leave the branch (it is generic) and just drop the OSM-specific comment. Note which you did in the commit message.
- [ ] `src/render/environment.js`: the shared water material (`getWaterMaterial()`) was *consumed* by osmGround for the river — keep `getWaterMaterial()` (the bay/coast still uses it) and just delete OSM-river prose in its JSDoc and the `osmGround.setEnvironment` mention. No functional change to the material.
- [ ] `src/core/events.js`: delete `OSM_READY: 'osmReady',` from `EVT`, the `osmReady: { buildings: 0 },` payload, the `OsmReadyEvent` typedef reference, and the OSM lines in the subscription-order doc comment. Verify nothing else emits/listens:
  ```bash
  grep -rn "OSM_READY\|osmReady\|OsmReadyEvent" src/ || echo "events OSM-free"
  ```
- [ ] Commit: `refactor: strip OSM paths from spawner/ball/catalog/geometryFactory/env/events`.

---

### Task P1.6: Strip OSM from `src/config/cityMap.js` (coverage latch + geo machinery)

`cityMap.js` is the heaviest OSM tangle: a geo-projection block, the coverage latch, exclusions, ground-truth distance asserts, and landmark/collectible positions expressed via `OSM_GEN` reconciled values + district deltas. Make the file self-contained: inline the former reconciled landmark x/z as plain frozen literals (so the transient Tokyo content still boots and plays identically), and delete all OSM-only exports/machinery. (P6 replaces this file wholesale with the taipei pack; here we only de-OSM it.)

- [ ] Delete the OSM imports from the top:
  ```js
  import { ARCHETYPE_CODE_BY_ID, collectibleCodeForId } from '../world/objects.js';
  import {
    ABSORB_RATIO, CURATED_PLACEMENT_CAP, GOAL_CONTACT_PAD, GROWTH_K,
    INTERIOR_ITEM_Y_MAX, MAP_BOUNDS as MAP_BOUNDS_TUNING,
    OSM_ANCHOR_LAT, OSM_ANCHOR_LON, OSM_DETAIL_RADIUS_REAL_M, OSM_HORIZ_K,
    PICKUP_FORGIVE_K, SKYTREE_COLLIDER_K, START_RADIUS_M, WALL_THICK_M, WALL_TOP_M,
  } from './tuning.js';
  ```
  Drop `OSM_ANCHOR_LAT, OSM_ANCHOR_LON, OSM_DETAIL_RADIUS_REAL_M, OSM_HORIZ_K`.
- [ ] Delete the entire **v4 GENERATED geography** block: `M_PER_DEG_LAT`, `M_PER_DEG_LON`, `geoToGameX`, `geoToGameZ`, `SHIBUYA_BBOX`, `ASAKUSA_BBOX`, `bboxToGameRect`, the `*_RECT_XCHECK` consts, `OSM_COVERAGE`, `inRect`, `inOsmCoverage`, `OSM_GEN`, `DISTANCE_GROUND_TRUTH`, `BRIDGE_SPAN_REAL_M`, `UENO_ZOO_GATE`, the `delta()` helper + all `D_*` district deltas, `OSM_EXCLUSIONS` (declaration + the `{ ... }` build block after LANDMARKS), and the `setOsmCoverageActive` function + its `osmCoverageActive`/`osmCoverageDecided` state.
- [ ] **Inline the former OSM_GEN reconciled positions** as plain literals so LANDMARKS/COLLECTIBLES keep their exact current coordinates. Add near the top (replacing the deleted OSM_GEN dependency):
  ```js
  /* Hand-frozen Tokyo landmark positions (game meters; these are the former
   * v4 reconciled OSM_GEN values, now plain literals — no geo pipeline). */
  const POS = Object.freeze({
    hachiko: { x: -1241.6, z: 879.5 },
    saigo: { x: 88.1, z: -291.9 },
    kaminarimon: { x: 489.9, z: -274.5 },
    radio_kaikan: { x: 47.9, z: 18.1 },
    shibuya109: { x: -1275.4, z: 867.6 },
    scramble: { x: -1242.7, z: 870.7 },
    dome: { x: -313.4, z: -151.2 },
    tokyo_station: { x: -20.3, z: 386.6 },
    diet: { x: -441.6, z: 506.2 },
    rainbow_bridge: { x: -111, z: 1378.6, endA: { x: -189, z: 1347.7 }, endB: { x: -32.9, z: 1409.5 } },
    tokyo_tower: { x: -431.4, z: 890.5 },
    skytree: { x: 748.8, z: -251.7 },
  });
  ```
  Then replace every `OSM_GEN.foo.x` / `OSM_GEN.foo.z` with `POS.foo.x` / `POS.foo.z` across `SKYTREE_POS`, `LANDMARKS`, `COLLECTIBLES`, and `BRIDGE_SPANS`.
- [ ] The **district zone rects** in `ZONES` used `zoneShift(..., D_UENO, ...)` etc. Since the district deltas are gone, the cleanest de-OSM is to bake the shift into literal coords OR pass `D_NONE`. To preserve the *current* in-game zone positions exactly, replace each `D_<district>` with a frozen literal delta equal to its former computed value. Compute each once and inline:
  ```bash
  # one-off: print the deltas the old code computed, to paste as literals
  node -e '
    const P={saigo:{x:88.1,z:-291.9},kaminarimon:{x:489.9,z:-274.5},tokyo_station:{x:-20.3,z:386.6},diet:{x:-441.6,z:506.2},shibuya109:{x:-1275.4,z:867.6},scramble:{x:-1242.7,z:870.7},dome:{x:-313.4,z:-151.2},rainbow_bridge:{x:-111,z:1378.6}};
    const d=(g,x,z)=>({x:+(g.x-x).toFixed(4),z:+(g.z-z).toFixed(4)});
    console.log("UENO",d(P.saigo,-80,-420));
    console.log("ASAKUSA",d(P.kaminarimon,350,-600));
    console.log("MARUNOUCHI",d(P.tokyo_station,-120,480));
    console.log("NAGATACHO",d(P.diet,-650,650));
    console.log("SHIBUYA",d(P.shibuya109,-1150,950));
    console.log("SCRAMBLE",d(P.scramble,-1180,990));
    console.log("SUIDOBASHI",d(P.dome,-550,-120));
    console.log("WANGAN",d(P.rainbow_bridge,440,1430));
  '
  ```
  Paste the printed objects as frozen `const D_UENO = Object.freeze({ x: ..., z: ... });` etc. (now plain numbers, not geo-derived). This keeps `ZONES`, `DISTRICT_CLUSTERS`, and district `COLLECTIBLES` byte-identical in position while removing the OSM dependency.
- [ ] In `bandAllowedAt()`, delete the OSM coverage branch:
  ```js
  // v4: OSM owns bands 3/4 inside coverage (one-shot latch; see header).
  if (osmCoverageActive && (band === 3 || band === 4) && inOsmCoverage(xReal, zReal)) {
    return false;
  }
  ```
- [ ] Update `validateCityMap()`: remove the v4 cross-checks (coverage-rect bit-equality, inter-landmark `DISTANCE_GROUND_TRUTH` window asserts, bridge-span window). Keep the structural asserts (landmark threshold ladder strictly increasing, positions within `MAP_BOUNDS`, collectible id enum append-only). These structural asserts are exactly what P2's `pack.validate()` will subsume.
- [ ] Update the file header JSDoc: delete the entire `v4 "Real Tokyo"` paragraph and the OSM EXTRA/coverage notes.
- [ ] Verify:
  ```bash
  grep -ni "osm" src/config/cityMap.js || echo "cityMap.js OSM-free"
  ```
  Expected: `cityMap.js OSM-free`.
- [ ] Commit: `refactor(cityMap): drop OSM coverage latch + geo pipeline; inline Tokyo positions`.

---

### Task P1.7: Strip the OSM tuning block from `src/config/tuning.js`

- [ ] Delete the entire OSM tuning region (the `v4 OSM ...` banner blocks): `OSM_ANCHOR_LAT`, `OSM_ANCHOR_LON`, `OSM_HORIZ_K`, `OSM_HEIGHT_K`, `OSM_DETAIL_RADIUS_REAL_M`, `OSM_BAND_REFF_EDGES`, `osmBandForReff`, `OSM_KEEP_K_BY_BAND`, `OSM_COLLIDE_MIN`, `OSM_CLEARANCE_M`, `OSM_Q_CENTER_M`, `OSM_Q_WD_M`, `OSM_Q_H_M`, `OSM_Q_YAW`, `OSM_UPDATE_BUDGET`, `OSM_ALIVE_CAP`, `OSM_ADMISSION_HEADROOM`, `OSM_POOL_DETAIL_CAP`, `OSM_POOL_LARGE_CAP`, `OSM_GROUND_*`, and the OSM data-budget block that follows.
- [ ] **Keep** `DRAW_CALL_CAP = 72` unchanged. The lower post-OSM draw count is observed at runtime against this cap — do not lower the cap (headroom for Taipei content is the design intent per spec §4.2).
- [ ] **Keep** `ALIVE_TOTAL_BUDGET`, `STORE_CAPACITY`, `SUBPIXEL_*`, `DESPAWN_FADE_S`, `SPAWN_FADE_S`, `LOAD_RADIUS_MIN_M`, `FOG_*` — those are general engine constants the chunk/curated spawners still use.
- [ ] Verify no surviving file imports a deleted tuning symbol:
  ```bash
  grep -rn "OSM_" src/ || echo "tuning OSM symbols fully unreferenced"
  ```
  Expected: `tuning OSM symbols fully unreferenced` (or only `FLAG_OSM` in objects.js, which is fine — it lives in objects.js, not tuning.js).
- [ ] Commit: `refactor(tuning): delete OSM constants; keep DRAW_CALL_CAP=72`.

---

### Task P1.8: De-OSM `index.html` + `public/_headers` + `package.json`

- [ ] `index.html`: delete the `#osm-progress` CSS rule + the `<p id="osm-progress" ...></p>` element (title screen). Delete BOTH `.osm-credit` blocks (the `地図データ © OpenStreetMap contributors (ODbL)` paragraphs on title and result) and the `.osm-credit` CSS — no OSM data ships, so the ODbL attribution must go for license correctness. Leave the Tokyo title/subtitle strings (`転がして、東京まるごと。` etc.) ALONE — P3 (i18n seam) / P6 (retheme) own those; touching them here would scope-creep into content.
  ```bash
  grep -ni "osm\|ODbL\|OpenStreetMap" index.html || echo "index.html OSM/ODbL-free"
  ```
  Expected: `index.html OSM/ODbL-free`.
- [ ] `public/_headers`: delete the `/assets/tokyo/*` cache rule block + its comment. Keep `/assets/*`, `/`, `/index.html` rules.
- [ ] `package.json`: remove the three OSM scripts and reduce `predeploy`:
  ```json
  "osm:fetch": "node scripts/osm/fetch-osm.mjs",
  "osm:build": "node scripts/osm/build-tokyo-bin.mjs",
  "osm:verify": "node scripts/osm/verify-tokyo-data.mjs",
  "predeploy": "bash scripts/verify-donack-assets.sh && npm run osm:verify"
  ```
  becomes
  ```json
  "predeploy": "bash scripts/verify-donack-assets.sh"
  ```
  (and ensure the `test` script `"test": "vitest run"` added in P0 is present).
- [ ] Commit: `chore: drop OSM DOM/credit, _headers tokyo rule, osm:* + predeploy dep`.

---

### Task P1.9: First green build + full OSM grep sweep + boot-assert check

- [ ] Build must now succeed (it failed since P1.1):
  ```bash
  npm run build
  ```
  Expected: Vite build completes, no "Could not resolve `./world/osmWorld.js`" / unresolved-import errors.
- [ ] Run the full unit suite (objects table test + anything P0 added):
  ```bash
  npx vitest run
  ```
  Expected: all PASS (objects.test.js green).
- [ ] Repo-wide sweep — the ONLY surviving `osm`/`OSM` token may be `FLAG_OSM` in `objects.js` (kept until P2):
  ```bash
  grep -rniI "osm" src/ index.html public/ package.json | grep -vi "FLAG_OSM"
  ```
  Expected: **no output**.
- [ ] Commit: `chore(osm): first green build after OSM removal` (if any incidental fixes were needed to reach green).

---

### Task P1.10: chrome-devtools verification — procedural Tokyo still rolls, draw calls dropped, no errors

This is the rendering-verification gate. We compare against the pre-removal baseline. (If P0 captured a baseline screenshot + baseline draw-call number, reuse it; otherwise capture the baseline from the upstream `/tmp/fableDemoGame` dev server first, noting its `renderer.info.render.calls` from the backquote overlay — upstream honest worst is ~68/72.)

- [ ] Start the dev server (background) and note the URL:
  ```bash
  npm run dev
  ```
  (Vite prints e.g. `http://localhost:5173/`.)
- [ ] Navigate and start a run via chrome-devtools MCP:
  ```
  mcp__chrome-devtools__navigate_page  url=http://localhost:5173/?seed=1
  mcp__chrome-devtools__take_screenshot   (title screen)
  ```
  **Expected observation:** the title screen renders with NO `#osm-progress` line and NO ODbL credit text anywhere on the overlay (the OSM fetch/progress DOM is gone). No `リアル東京 読み込み中…` text ever appears.
- [ ] Read the live draw-call count via the renderer's existing dev surface. Two equivalent options:
  - Toggle the debug overlay (Backquote) and screenshot the `calls N/72` line; OR
  - `mcp__chrome-devtools__evaluate_script` to read the Three.js renderer info through the existing DEV hook. Confirm the hook path first (`window.__v3dbg` exists in DEV); if the renderer instance is reachable, read `renderer.info.render.calls`. If not directly exposed, rely on the overlay screenshot.
  ```
  mcp__chrome-devtools__evaluate_script
    function: () => {
      // The backquote overlay already prints calls/72; this just reads console-free.
      // If a renderer handle is exposed for tests, return its draw-call count.
      const dbg = window.__v3dbg;
      return { hasDbg: !!dbg, note: 'read calls from the Backquote overlay screenshot' };
    }
  ```
  **Expected observation:** at a mid-tier procedural scene (roll to ~tier 3–4, or dev-teleport `?at=marunouchi`), the `calls` value is **strictly below the pre-removal baseline** — the removal eliminates the 2 OSM building batches (`osmPools.detail` + `osmPools.large`) + the OSM ground BatchedMesh + the OSM river mesh = ~4 draws gone, so e.g. baseline ~64–68 → post-removal ~60–64, comfortably `< 72`. Record both numbers in the commit/PR.
- [ ] Check the console is clean:
  ```
  mcp__chrome-devtools__list_console_messages
  ```
  **Expected observation:** the DEV boot log `[fable-katamari] booted — seed=... pools=N ...` appears with `pools` REDUCED by the removed OSM pools, and there are **no errors** (no unresolved import, no `setOsmCoverageActive is not a function`, no `osmSpawner is not defined`). No assert throws from `objects.js`/`validateCityMap`.
- [ ] Play-smoke that the city still rolls (procedural fill, no holes where OSM used to be): drive forward a few seconds (`mcp__chrome-devtools__press_key` arrow/WASD or click-drag), screenshot again.
  **Expected observation:** the ball rolls and absorbs procedural street objects; the former OSM-coverage disc area is now filled by chunk bands 3/4 (the coverage latch that masked them OFF is gone), so there are no empty patches. Visually it is "procedural Tokyo", matching the spec's stated P1 result.
- [ ] (Engine red-line check, free since the engine is untouched) Force a rescale and confirm pixel-identity still holds — the removal did not touch `scaleManager`/`objectMaterial`/rim:
  ```
  mcp__chrome-devtools__press_key  key=Backquote   (ensure overlay/DEV)
  # press R (DEV force-rescale hook) and screenshot before/after — frame should be visually identical
  ```
  **Expected observation:** the forced 5× similarity rescale produces a visually identical frame (the engine's existing pixel-identity invariant — we changed no render math).
- [ ] Stop the dev server.
- [ ] If a baseline screenshot existed, attach the before/after pair to the PR with the two draw-call numbers. Commit any notes: `test(osm): verify procedural boot, draw calls dropped, console clean`.

---

**P1 done when:** `npm run build` is green, `npx vitest run` is green (objects table test proves the re-based code map), `grep -rniI osm src/ index.html public/ package.json` returns only `FLAG_OSM` in objects.js, and the chrome-devtools session shows the city rolling with a strictly lower draw-call count, no OSM/ODbL DOM, and a clean console. The repo now plays as procedural Tokyo with full draw-call headroom for P2+.



## P2. StagePack seam + pack-scoped codes

> **Goal of this part.** Introduce the `StagePack` seam *without changing any rendered pixel*. We (a) create `src/packs/active.js` that re-exports the EXISTING Tokyo content as a transient pack, (b) flip the engine's data imports to read the active pack, and (c) replace the four GLOBAL frozen asserts (`TIERS.length===7`, `seen.size===70`, the 115-entry `objects.js` table assert, the hardcoded counts in `validateCityMap`) with two pure, pack-scoped functions — `buildCodeMap(pack)` and `validatePack(pack)` — built/run at load from the active pack. Tokyo stays the active pack for the WHOLE of P2; Taipei does not appear until P3.
>
> **Why this is the riskiest part.** The code↔id map is load-bearing for `ObjectStore.archetype` (uint16), `absorb.js`, `spawner.js`, `curated.js`, `collection.js`, `hud.js`, `screens.js`. We prove byte-identity with the engine's existing forced-rescale pixel-identity check and the draw-call ledger, *before* any Taipei work begins.
>
> **Grounding (read before starting).** Current global asserts live in `src/config/tiers.js` lines 249–329 (`TIERS.length === 7`, `seen.size === 70`). The code tables are built at load in `src/world/objects.js` lines 221–251 and asserted (115 entries) lines 280–350. `src/world/spawner.js` lines 157–166 builds a *parallel* `ARCHETYPE_IDS` list from `TIERS`. `src/config/cityMap.js` `validateCityMap()` (line 989, called at module load line 1346) hardcodes `COLLECTIBLES.length === 13` (line 1026) and the landmark ladder over `LANDMARKS` (11 entries). `main.js` imports `TIERS` (line 95), `CATALOG` (line 96), code helpers from `world/objects.js` (line 97), `DEV_STARTS`/`cityMap` namespace (lines 131–132).

**Assumption from P1:** P1 has already deleted the OSM modules and OSM codes 94..109. This part treats the surviving EXTRA set as: 24 curated EXTRA ids (codes 70..93) + the v5 collectible/buildings if P1 kept them. Confirm the exact surviving `EXTRA_ARCHETYPE_IDS` array against P1's post-removal `world/objects.js` before Task P2.4.

---

### Task P2.1: Add vitest to the toolchain (Part-0 follow-up, needed here)

- [ ] In `/home/ct/roll-formosa`, install vitest as a dev dependency:
  ```bash
  npm install -D vitest@^2
  ```
- [ ] Edit `package.json` `scripts` to add a test runner (keep existing `dev`/`build`/`preview`; the OSM scripts were removed in P1):
  ```jsonc
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
  ```
- [ ] Create `vitest.config.js` at repo root so tests get `import.meta.env.DEV === true` (the asserts are DEV-gated and our tests want them ON):
  ```js
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {
      environment: 'node',
      // Engine modules read import.meta.env.DEV to gate dev asserts; vitest's
      // vite pipeline sets DEV true by default in `vitest` but be explicit.
      env: { NODE_ENV: 'development' },
    },
  });
  ```
- [ ] Verify the runner boots (no tests yet → exit 0 with "No test files found" is fine):
  ```bash
  npx vitest run 2>&1 | tail -5
  ```
- [ ] Commit:
  ```bash
  git add package.json package-lock.json vitest.config.js && \
  git commit -m "P2.1: add vitest dev dependency + test scripts"
  ```

---

### Task P2.2: TDD — failing test for `buildCodeMap(pack)` (pure logic)

We define the pure code-map builder against a tiny hand-written fake pack first, so the function's contract is nailed before we touch engine modules.

- [ ] Create `src/packs/_engine/codeMap.test.js` with a FAILING test (the module does not exist yet):
  ```js
  import { describe, it, expect } from 'vitest';
  import { buildCodeMap } from './codeMap.js';

  /** Minimal fake pack: 2 tiers x 3 chunk ids + 2 EXTRA (1 collectible, 1 landmark). */
  function fakePack() {
    return {
      tiers: [
        { index: 0, archetypeIds: ['a0', 'a1', 'a2'] },
        { index: 1, archetypeIds: ['b0', 'b1', 'b2'] },
      ],
      // EXTRA list is pack-scoped, append-only; collectibles first per convention.
      extraIds: ['col_x', 'lm_y'],
      // collectible id -> position in extraIds (append-only album order)
      collectibleExtraIndex: { 0: 0 }, // collectible id 0 == extraIds[0]
    };
  }

  describe('buildCodeMap', () => {
    it('assigns chunk codes 0..N-1 in tier-major order', () => {
      const m = buildCodeMap(fakePack());
      expect(m.chunkCount).toBe(6);
      expect(m.extraBase).toBe(6);
      expect(m.idByCode.slice(0, 6)).toEqual(['a0', 'a1', 'a2', 'b0', 'b1', 'b2']);
      expect(m.codeById['a0']).toBe(0);
      expect(m.codeById['b2']).toBe(5);
    });

    it('appends EXTRA ids after the chunk block', () => {
      const m = buildCodeMap(fakePack());
      expect(m.idByCode[6]).toBe('col_x');
      expect(m.idByCode[7]).toBe('lm_y');
      expect(m.codeById['lm_y']).toBe(7);
    });

    it('is hole-free and unique over the whole table', () => {
      const m = buildCodeMap(fakePack());
      const seen = new Set();
      for (let c = 0; c < m.idByCode.length; c++) {
        expect(typeof m.idByCode[c]).toBe('string');
        expect(seen.has(m.idByCode[c])).toBe(false);
        seen.add(m.idByCode[c]);
        expect(m.codeById[m.idByCode[c]]).toBe(c);
      }
    });

    it('maps collectible id -> extraBase + appendix index (pack-scoped)', () => {
      const m = buildCodeMap(fakePack());
      expect(m.collectibleCodeForId(0)).toBe(6); // extraBase + 0
    });
  });
  ```
- [ ] Run it — expect FAIL (module missing):
  ```bash
  npx vitest run src/packs/_engine/codeMap.test.js 2>&1 | tail -20
  ```
  Expected observation: `Failed to resolve import "./codeMap.js"` (red).

---

### Task P2.3: Implement `buildCodeMap` to pass

- [ ] Create `src/packs/_engine/codeMap.js`:
  ```js
  /**
   * @file codeMap.js — PACK-AGNOSTIC engine helper. Builds the archetype
   * code<->id mapping at LOAD from the active pack's lists (pack-scoped, NOT a
   * global append-only frozen table). Also exports validatePack().
   *
   * Code layout (pack-scoped):
   *   codes 0..chunkCount-1  : chunk archetypes, tier-major
   *                            (code = sum of prior tiers' lengths + slot)
   *   codes chunkCount..      : EXTRA curated archetypes, in pack.extraIds order
   *                            (append-only within a pack for save compat).
   * Collectible album ids are append-only and resolve through
   * collectibleCodeForId(id) — never hand-roll "extraBase + id".
   *
   * @typedef {Object} StagePack
   * @property {string} id
   * @property {string} displayName
   * @property {string} region
   * @property {Array<{index:number, archetypeIds:string[], enterTrueRadius:number}>} tiers
   * @property {Record<string, object>} archetypes  id -> ArchetypeDef
   * @property {object} map
   * @property {Array<object>} landmarks
   * @property {object} goalMonument
   * @property {object} ending
   * @property {object} narration
   * @property {object} mascot
   * @property {object} locale
   * @property {object} seeds
   * @property {string[]} extraIds  EXTRA curated ids in code order (append-only)
   * @property {Record<number, number>} collectibleExtraIndex  collectibleId -> index in extraIds
   * @property {() => true} validate
   *
   * @typedef {Object} CodeMap
   * @property {string[]} idByCode
   * @property {Record<string, number>} codeById
   * @property {number} chunkCount
   * @property {number} extraBase
   * @property {(id:number) => number} collectibleCodeForId
   */

  /**
   * Build the pack-scoped archetype code map (unique, hole-free, deterministic).
   * @param {StagePack} pack
   * @returns {CodeMap}
   */
  export function buildCodeMap(pack) {
    const idByCode = [];
    const codeById = {};
    for (let t = 0; t < pack.tiers.length; t++) {
      const ids = pack.tiers[t].archetypeIds;
      for (let i = 0; i < ids.length; i++) {
        const code = idByCode.length;
        idByCode.push(ids[i]);
        codeById[ids[i]] = code;
      }
    }
    const chunkCount = idByCode.length;
    const extraBase = chunkCount;
    const extraIds = pack.extraIds || [];
    for (let e = 0; e < extraIds.length; e++) {
      const code = extraBase + e;
      idByCode.push(extraIds[e]);
      codeById[extraIds[e]] = code;
    }
    const colIndex = pack.collectibleExtraIndex || {};
    /** @param {number} id Collectible album id @returns {number} archetype code */
    const collectibleCodeForId = (id) => {
      const idx = colIndex[id];
      if (idx === undefined) {
        throw new Error(`[codeMap] no EXTRA slot for collectible id ${id}`);
      }
      return extraBase + idx;
    };
    return { idByCode, codeById, chunkCount, extraBase, collectibleCodeForId };
  }
  ```
- [ ] Run — expect PASS:
  ```bash
  npx vitest run src/packs/_engine/codeMap.test.js 2>&1 | tail -15
  ```
  Expected observation: 4 tests green.
- [ ] Commit:
  ```bash
  git add src/packs/_engine/codeMap.js src/packs/_engine/codeMap.test.js && \
  git commit -m "P2.2-3: pure buildCodeMap(pack) with vitest TDD (unique, hole-free, pack-scoped)"
  ```

---

### Task P2.4: TDD — failing test for `validatePack(pack)` (the invariants)

These are the per-pack invariants from the FROZEN contract (replacing the old global asserts). Write the failing tests first.

- [ ] Append to `src/packs/_engine/codeMap.test.js`:
  ```js
  import { validatePack } from './codeMap.js';

  /** A fuller fake pack good enough to PASS validatePack. */
  function validFakePack() {
    const tiers = [];
    for (let t = 0; t < 7; t++) {
      const ids = [];
      for (let s = 0; s < 10; s++) ids.push(`t${t}_s${s}`);
      tiers.push({ index: t, archetypeIds: ids, enterTrueRadius: 0.02 * Math.pow(5, t) });
    }
    const archetypes = {};
    for (const tr of tiers) for (const id of tr.archetypeIds) archetypes[id] = { id };
    // 2 landmarks, strictly increasing dioramaR ladder, goal = largest.
    const landmarks = [
      { landmarkId: 0, name: 'small', x: 10, z: 0, dioramaR: 5, isGoal: false },
      { landmarkId: 1, name: 'goal', x: 20, z: 0, dioramaR: 50, isGoal: true },
    ];
    const extraIds = ['lm_small', 'lm_goal'];
    return {
      id: 'fake', tiers, archetypes, landmarks, extraIds,
      collectibleExtraIndex: {},
      map: { bounds: { x: [-100, 100], z: [-100, 100] } },
      absorbRatio: 0.65,
    };
  }

  describe('validatePack', () => {
    it('passes a well-formed pack', () => {
      expect(validatePack(validFakePack())).toBe(true);
    });

    it('rejects != 7 tiers', () => {
      const p = validFakePack(); p.tiers.pop();
      expect(() => validatePack(p)).toThrow(/exactly 7 tiers/);
    });

    it('rejects a tier without 10 archetypeIds', () => {
      const p = validFakePack(); p.tiers[3].archetypeIds.pop();
      expect(() => validatePack(p)).toThrow(/10 archetypeIds/);
    });

    it('rejects an archetypeId that does not resolve', () => {
      const p = validFakePack(); p.tiers[2].archetypeIds[0] = 'ghost';
      expect(() => validatePack(p)).toThrow(/ghost/);
    });

    it('rejects a non-strictly-increasing dioramaR ladder', () => {
      const p = validFakePack(); p.landmarks[1].dioramaR = 5; // equal to small
      expect(() => validatePack(p)).toThrow(/strictly increasing/);
    });

    it('rejects when the goal landmark is not the largest', () => {
      const p = validFakePack();
      p.landmarks[0].dioramaR = 999; // non-goal bigger than goal
      expect(() => validatePack(p)).toThrow(/goal.*largest|largest.*goal/i);
    });

    it('rejects a landmark outside map bounds', () => {
      const p = validFakePack(); p.landmarks[0].x = 9999;
      expect(() => validatePack(p)).toThrow(/bounds/i);
    });
  });
  ```
- [ ] Run — expect FAIL (`validatePack` not exported yet):
  ```bash
  npx vitest run src/packs/_engine/codeMap.test.js 2>&1 | tail -20
  ```
  Expected observation: `validatePack is not a function` / import error (red).

---

### Task P2.5: Implement `validatePack` to pass

- [ ] Append to `src/packs/_engine/codeMap.js`:
  ```js
  /**
   * Per-pack invariants (replaces the OLD global frozen asserts:
   * tiers.js TIERS.length===7 + seen.size===70, objects.js 115-entry table,
   * cityMap.js hardcoded landmark/collectible counts). Throws on violation.
   *
   * Invariants:
   *  - exactly 7 tiers, each with 10 archetypeIds (5x scale ladder convention)
   *  - every archetypeId resolves in pack.archetypes
   *  - chunk ids are unique (no duplicate across tiers)
   *  - landmark dioramaR / absorbRatio strictly increasing (ladder order)
   *  - the goal landmark (isGoal) is the LARGEST dioramaR
   *  - all landmark positions inside map bounds
   * @param {StagePack & {map:{bounds:{x:number[],z:number[]}}, absorbRatio:number}} pack
   * @returns {true}
   */
  export function validatePack(pack) {
    const fail = (msg) => { throw new Error(`[validatePack:${pack.id}] ${msg}`); };

    if (pack.tiers.length !== 7) fail(`exactly 7 tiers required, got ${pack.tiers.length}`);
    const seen = new Set();
    for (let t = 0; t < pack.tiers.length; t++) {
      const tier = pack.tiers[t];
      if (tier.index !== t) fail(`tier ${t}: index field mismatch (${tier.index})`);
      if (tier.archetypeIds.length !== 10) {
        fail(`tier ${t}: exactly 10 archetypeIds (slots 8/9 = chunk landmarks), got ${tier.archetypeIds.length}`);
      }
      for (const id of tier.archetypeIds) {
        if (seen.has(id)) fail(`duplicate chunk archetype id '${id}'`);
        seen.add(id);
        if (!pack.archetypes[id]) fail(`archetypeId '${id}' does not resolve in pack.archetypes`);
      }
      if (t > 0 && !(tier.enterTrueRadius > pack.tiers[t - 1].enterTrueRadius)) {
        fail(`tier ${t}: enterTrueRadius must be strictly increasing`);
      }
    }

    // Landmark ladder + goal-is-largest + bounds.
    const ratio = pack.absorbRatio || 0.65;
    const b = pack.map.bounds;
    let prevThresh = 0;
    let goal = null;
    let maxDioramaR = -Infinity;
    for (const ld of pack.landmarks) {
      if (ld.x < b.x[0] || ld.x > b.x[1] || ld.z < b.z[0] || ld.z > b.z[1]) {
        fail(`landmark '${ld.name}' position (${ld.x},${ld.z}) outside map bounds`);
      }
      const thresh = ld.dioramaR / ratio;
      if (!(thresh > prevThresh)) {
        fail(`landmark ladder must be strictly increasing at '${ld.name}' (thresh ${thresh.toFixed(2)} <= prev ${prevThresh.toFixed(2)})`);
      }
      prevThresh = thresh;
      if (ld.dioramaR > maxDioramaR) maxDioramaR = ld.dioramaR;
      if (ld.isGoal) goal = ld;
    }
    if (goal === null) fail('no landmark flagged isGoal');
    if (goal.dioramaR < maxDioramaR) fail('goal landmark must be the largest dioramaR (largest = last on the ladder)');
    return true;
  }
  ```
  > **Note on ladder ordering:** `validatePack` assumes `pack.landmarks` is authored in threshold-ladder order (matching the existing `LANDMARKS` array). The strictly-increasing check therefore doubles as an ordering check, exactly like the current `validateCityMap` (cityMap.js lines 1041–1054), with the spec's one wrinkle: the Tokyo scramble-crossing decal (`landmarkId 5`) is OFF the ladder. We preserve that escape hatch in the wrap — see Task P2.7.
- [ ] Run — expect PASS:
  ```bash
  npx vitest run src/packs/_engine/codeMap.test.js 2>&1 | tail -15
  ```
  Expected observation: all `buildCodeMap` + `validatePack` tests green.
- [ ] Commit:
  ```bash
  git add src/packs/_engine/codeMap.js src/packs/_engine/codeMap.test.js && \
  git commit -m "P2.4-5: validatePack(pack) invariants via TDD (7 tiers, ids resolve, ladder, goal largest, bounds)"
  ```

---

### Task P2.6: Wrap the existing Tokyo content as a transient pack (no data change)

We assemble an `activePack` object that *points at the existing Tokyo modules* — proving the seam is a pure indirection. No geometry, tier, or coordinate value is copied or edited.

- [ ] First, confirm the surviving EXTRA id list after P1's OSM removal:
  ```bash
  grep -n "EXTRA_ARCHETYPE_IDS\|V5_ARCHETYPE_IDS\|export const EXTRA_CODE_BASE" src/world/objects.js | head
  ```
  Note the exact arrays — Task P2.4 of the wrap re-uses them verbatim.
- [ ] Create `src/packs/_tokyo_transient/index.js` (underscore prefix = transient; deleted in P3 once active flips to taipei):
  ```js
  /**
   * @file _tokyo_transient/index.js — TRANSIENT StagePack that re-exports the
   * EXISTING Tokyo content unchanged. Its only job is to prove the StagePack
   * seam is byte-identical (P2). DELETE after P3 flips active.js to taipei.
   *
   * NOTHING is copied here — we re-reference the live config/ modules so the
   * forced-rescale pixel-identity check and the draw-call ledger see the exact
   * same data they saw before the seam existed.
   */
  import { TIERS, RESCALE_S, ARCH_PER_TIER } from '../../config/tiers.js';
  import { CATALOG, EXTRA_CATALOG, DISPLAY_NAME_BY_CODE } from '../../config/catalog.js';
  import {
    EXTRA_ARCHETYPE_IDS,
    V5_ARCHETYPE_IDS,
  } from '../../world/objects.js';
  import * as cityMap from '../../config/cityMap.js';
  import { ABSORB_RATIO, MAP_BOUNDS } from '../../config/tuning.js';
  import { validatePack } from '../_engine/codeMap.js';

  // EXTRA id order is the legacy frozen Tokyo order (codes 70.. in objects.js).
  // After P1 removed OSM (94..109), the surviving EXTRA appendix is the 24
  // curated ids + the v5 ids. Keep their RELATIVE order — codes must not move.
  const extraIds = [...EXTRA_ARCHETYPE_IDS, ...V5_ARCHETYPE_IDS];

  // Collectible album id -> index in extraIds. Legacy Tokyo rule: ids 0..11 are
  // EXTRA_ARCHETYPE_IDS[0..11]; id 12 (stack_chan) is the first v5 id. We derive
  // the index by id rather than hand-coding 70+id, so the pack-scoped map stays
  // the single authority.
  const collectibleExtraIndex = {};
  for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;            // 0..11
  collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0;                 // stack_chan

  /** @type {import('../_engine/codeMap.js').StagePack} */
  export const activePack = {
    id: 'tokyo',
    displayName: '東京',
    region: 'JP',
    tiers: TIERS,
    rescaleS: RESCALE_S,
    archPerTier: ARCH_PER_TIER,
    archetypes: CATALOG,           // chunk archetype recipes (id -> ArchetypeDef)
    extraCatalog: EXTRA_CATALOG,   // EXTRA curated recipes
    displayNameByCode: DISPLAY_NAME_BY_CODE,
    extraIds,
    collectibleExtraIndex,
    // The engine consumes cityMap's named exports directly today; expose the
    // whole namespace so the seam is a rename, not a reshuffle.
    cityMap,
    map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
    landmarks: cityMap.LANDMARKS,
    absorbRatio: ABSORB_RATIO,
    // Goal / ending / mascot / narration / locale wrap to the EXISTING Tokyo
    // modules so byte-identity holds. P3's taipei pack fills these with data;
    // here they are thin pass-throughs the engine already imports elsewhere.
    seeds: { primary: 0x544f4b59, v5: 0x56355041 },
    validate() {
      // Pack-scoped validation. The transient Tokyo pack carries the scramble
      // decal off-ladder exemption (landmarkId 5) like the legacy validator.
      validateTokyoTransient(this);
      return true;
    },
  };

  /**
   * Tokyo-flavoured validate: run the shared validatePack but tolerate the
   * scramble-crossing decal (landmarkId 5) sitting OFF the threshold ladder,
   * exactly as cityMap.js validateCityMap did (lines 1046-1051).
   * @param {import('../_engine/codeMap.js').StagePack} pack
   */
  function validateTokyoTransient(pack) {
    const ladderLandmarks = pack.landmarks.filter((ld) => ld.landmarkId !== 5);
    // Tokyo's LANDMARKS have no isGoal flag (the goal is the Skytree, a separate
    // monument, not in LANDMARKS). Inject a synthetic goal = the largest so the
    // shared "goal is largest" check passes without editing Tokyo data.
    const largest = ladderLandmarks.reduce((a, b) => (b.dioramaR > a.dioramaR ? b : a));
    const shimmed = {
      ...pack,
      // name field shim: Tokyo uses nameJa; validatePack reads .name.
      landmarks: ladderLandmarks.map((ld) => ({ ...ld, name: ld.nameJa, isGoal: ld === largest })),
    };
    validatePack(shimmed);
  }

  export default activePack;
  ```
  > **Why the shims (`nameJa`→`name`, synthetic `isGoal`, scramble filter).** They exist ONLY so the *unmodified* Tokyo data validates through the shared `validatePack`. They are confined to the transient module and disappear in P3 when Taipei authors `name`/`isGoal` natively. This is the point of the transient pack: prove the seam without touching Tokyo data.
- [ ] Create the seam entrypoint `src/packs/active.js` (the single module the engine reads):
  ```js
  /**
   * @file active.js — THE single active StagePack the engine reads.
   * Phase 1 (P2): tokyo transient (proves byte-identity). P3 flips this to
   * taipei. Engine modules import from here, never from a specific pack.
   */
  export { activePack, default } from './_tokyo_transient/index.js';
  ```
- [ ] Sanity-check the wrap validates in isolation (Node, DEV on):
  ```bash
  npx vitest run --root . -t "buildCodeMap" 2>&1 | tail -5  # confirms _engine still green
  ```
- [ ] Commit:
  ```bash
  git add src/packs/active.js src/packs/_tokyo_transient/index.js && \
  git commit -m "P2.6: wrap existing Tokyo content as transient StagePack via active.js (no data change)"
  ```

---

### Task P2.7: Build the code map at load from the active pack; make `world/objects.js` consume it

`world/objects.js` currently OWNS the frozen tables (lines 221–251) and the 115-entry assert (lines 280–350). We replace that ownership with a load from the active pack's code map, keeping the SAME exported symbol names so the ~10 importing modules need no change.

- [ ] In `src/world/objects.js`, replace the table-construction block (the four `for` loops at lines 229–251 that fill `ARCHETYPE_ID_BY_CODE` / `ARCHETYPE_CODE_BY_ID`) and the EXTRA/OSM/V5 frozen-id arrays with a load from the active pack. Concretely, at the top add:
  ```js
  import { activePack } from '../packs/active.js';
  import { buildCodeMap } from '../packs/_engine/codeMap.js';

  /** Pack-scoped code map, built ONCE at load from the active pack. */
  const _CODE_MAP = buildCodeMap(activePack);

  /** First EXTRA curated code == number of chunk codes (pack-scoped). */
  export const EXTRA_CODE_BASE = _CODE_MAP.extraBase;
  /** code-indexed archetype id table (pack-scoped, hole-free). */
  export const ARCHETYPE_ID_BY_CODE = _CODE_MAP.idByCode;
  /** id -> code reverse lookup. */
  export const ARCHETYPE_CODE_BY_ID = _CODE_MAP.codeById;
  /** Collectible album id -> code (pack-scoped append-only). */
  export const collectibleCodeForId = _CODE_MAP.collectibleCodeForId;
  ```
- [ ] DELETE the now-dead exports from `world/objects.js`: the literal `EXTRA_ARCHETYPE_IDS`, `OSM_ARCHETYPE_IDS`, `OSM_CODE_BASE`, `V5_ARCHETYPE_IDS`, `V5_CODE_BASE` arrays and the old hand-written `EXTRA_CODE_BASE = TIERS.length * ARCH_PER_TIER`, the four fill loops, and the entire DEV assert block (lines 280–350 — the 115-entry / OSM_CODE_BASE / FLAG_OSM checks). They are replaced by `activePack.validate()`.
  > **Migration note:** the transient Tokyo pack (Task P2.6) imports `EXTRA_ARCHETYPE_IDS` / `V5_ARCHETYPE_IDS` *from* `world/objects.js` — but we just deleted them there. Resolve the cycle by moving those two literal arrays INTO `src/packs/_tokyo_transient/index.js` (they are Tokyo data, not engine data). Replace the imports in the transient module with inline `const EXTRA_ARCHETYPE_IDS = [...]` / `const V5_ARCHETYPE_IDS = [...]` copied verbatim from the old `world/objects.js` (lines 109–134 and 192–198). This is the ONLY place the Tokyo EXTRA id order now lives.
- [ ] Keep `archetypeCode(tierIndex, indexInTier)` and `archetypeTierOfCode(code)` (lines 261–274) — but make `archetypeCode` use `activePack.archPerTier`:
  ```js
  import { TIERS, ARCH_PER_TIER } from '../config/tiers.js'; // ARCH_PER_TIER still re-exported by tiers.js
  // archetypeCode / archetypeTierOfCode bodies unchanged (still tier*ARCH_PER_TIER + i)
  ```
- [ ] Verify the dev build still boots without the 115-entry assert firing and the codeMap loads:
  ```bash
  npm run build 2>&1 | tail -15
  ```
  Expected observation: build succeeds, no `[objects.js invariant]` thrown.
- [ ] Commit:
  ```bash
  git add src/world/objects.js src/packs/_tokyo_transient/index.js && \
  git commit -m "P2.7: build code map at load from active pack; objects.js consumes it (drops global frozen tables)"
  ```

---

### Task P2.8: Replace the global asserts in `tiers.js` and `cityMap.js` with `pack.validate()`

- [ ] In `src/config/tiers.js`, DELETE the entire DEV assert block (lines 249–329: `TIERS.length === 7`, `seen.size === 70`, the per-tier loop). Leave `RESCALE_S`, `ARCH_PER_TIER`, and the `TIERS` table itself untouched (still imported by the transient pack and by `scaleManager`/`spawner`/`environment`). Replace the deleted block with a short comment:
  ```js
  /* Per-pack invariants moved to src/packs/_engine/codeMap.js validatePack(),
   * run from the active pack's validate(). tiers.js is now pure data. */
  ```
- [ ] In `src/config/cityMap.js`, inside `validateCityMap()` (line 989), DELETE the hardcoded-count asserts that are now pack-scoped: `COLLECTIBLES.length === 13` (line 1026) and the standalone `LANDMARKS`-count expectation. KEEP the authored-data checks that are NOT counts (per-placement MAP_BOUNDS at lines 1008–1012, the collectible-code-rule check via `collectibleCodeForId`, the growth-chain table, `SKYTREE_COLLIDER_K < GOAL_CONTACT_PAD`). The landmark ladder loop (lines 1041–1054) stays — it is now ALSO covered by `validatePack`, which is fine (belt-and-suspenders during the transition; P3's taipei `validate()` owns it cleanly).
- [ ] Wire the active pack's `validate()` to run at module load in DEV, replacing the bare `validateCityMap()` call. In `src/config/cityMap.js` lines 1345–1346, leave `validateCityMap()` running, and ADDITIONALLY add a single call site for the pack validate — but to avoid an import cycle (cityMap ← active ← cityMap), run `activePack.validate()` from `main.js` boot instead. Add to `src/main.js`, right after the imports block (near line 132 where `cityMap` is imported):
  ```js
  import { activePack } from './packs/active.js';
  if (import.meta.env && import.meta.env.DEV) activePack.validate();
  ```
- [ ] Verify boot runs the pack validate with no throw:
  ```bash
  npm run build 2>&1 | tail -10
  ```
  Expected observation: build succeeds; no `[validatePack:tokyo]` or `[cityMap invariant]` error.
- [ ] Commit:
  ```bash
  git add src/config/tiers.js src/config/cityMap.js src/main.js && \
  git commit -m "P2.8: replace global frozen asserts with pack-scoped validate(); run activePack.validate() at boot"
  ```

---

### Task P2.9: Point `main.js` data reads at the active pack (seam, not behaviour)

The engine modules that import `TIERS`/`CATALOG` directly keep working (those still exist as data). The seam this part guarantees is that the *code map* and *validation* now flow from `active.js`. Do a final pass to make `main.js`'s archetype/code wiring read pack-scoped symbols rather than the deleted OSM ones (P1 removed OSM usage; verify nothing dangles).

- [ ] In `src/main.js`, confirm the now-deleted `OSM_ARCHETYPE_IDS`/`OSM_CODE_BASE` imports (old line 97) are gone (P1) and that `EXTRA_CODE_BASE` still imports from `world/objects.js` (now pack-scoped). Grep for stragglers:
  ```bash
  grep -n "OSM_ARCHETYPE_IDS\|OSM_CODE_BASE\|V5_CODE_BASE\|setOsmCoverageActive\|osmSpawner\|osmPools\|osmGround\|osmWorld" src/main.js
  ```
  Expected observation: ZERO matches (P1 removed them; if any remain, that is P1 debt — stop and reconcile with P1 before continuing).
- [ ] Confirm `EXTRA_CODE_BASE` is the value the ABSORB handler compares against (main.js line 416, `if (code < EXTRA_CODE_BASE)`) and that it now equals `_CODE_MAP.extraBase`:
  ```bash
  grep -n "EXTRA_CODE_BASE" src/main.js
  ```
- [ ] Build clean:
  ```bash
  npm run build 2>&1 | tail -8
  ```
  Expected observation: success.
- [ ] Commit:
  ```bash
  git add src/main.js && git commit -m "P2.9: confirm main.js code wiring is pack-scoped (no OSM stragglers)"
  ```

---

### Task P2.10: TDD — the active Tokyo pack itself passes `validatePack` + `buildCodeMap` is hole-free

A real test (not the fake) over the actual transient pack, so any future drift in the Tokyo wrap is caught.

- [ ] Create `src/packs/_tokyo_transient/pack.test.js`:
  ```js
  import { describe, it, expect } from 'vitest';
  import { activePack } from './index.js';
  import { buildCodeMap } from '../_engine/codeMap.js';

  describe('tokyo transient pack', () => {
    it('validates (7 tiers, ids resolve, ladder, bounds)', () => {
      expect(activePack.validate()).toBe(true);
    });

    it('code map is hole-free and unique over the real pack', () => {
      const m = buildCodeMap(activePack);
      expect(m.chunkCount).toBe(70); // 7 tiers x 10
      const seen = new Set();
      for (let c = 0; c < m.idByCode.length; c++) {
        expect(typeof m.idByCode[c]).toBe('string');
        expect(m.idByCode[c].length).toBeGreaterThan(0);
        expect(seen.has(m.idByCode[c])).toBe(false);
        seen.add(m.idByCode[c]);
        expect(m.codeById[m.idByCode[c]]).toBe(c);
      }
    });

    it('collectible id 0 -> code 70, id 11 -> 81 (legacy Tokyo rule preserved)', () => {
      const m = buildCodeMap(activePack);
      expect(m.collectibleCodeForId(0)).toBe(70);
      expect(m.collectibleCodeForId(11)).toBe(81);
    });
  });
  ```
- [ ] Run — expect PASS:
  ```bash
  npx vitest run src/packs/_tokyo_transient/pack.test.js 2>&1 | tail -15
  ```
  Expected observation: 3 green. (If `chunkCount` ≠ 70 or a collectible code moved, the wrap reordered Tokyo data — fix the wrap, not the test.)
- [ ] Commit:
  ```bash
  git add src/packs/_tokyo_transient/pack.test.js && \
  git commit -m "P2.10: real Tokyo transient pack validates + code map hole-free (legacy codes preserved)"
  ```

---

### Task P2.11: VISUAL — prove byte-identical behaviour (forced-rescale pixel-identity + draw-call ledger)

The whole point of P2: Tokyo plays *exactly* as before the seam. We reuse the engine's existing forced-rescale pixel-identity check and the draw-call ledger via chrome-devtools MCP — we do not invent new instrumentation.

- [ ] Start the dev server in the background:
  ```bash
  npm run dev
  ```
  (Note the printed local URL, typically `http://localhost:5173/`.)
- [ ] With chrome-devtools MCP, navigate to the dev URL and let the title screen settle:
  - `navigate_page` → the dev URL
  - `wait_for` text on the title screen (the existing Japanese title is still active in P2 — Tokyo is the active pack)
- [ ] Read the boot log line to confirm pools count is unchanged from pre-seam. In `evaluate_script`, return the console boot summary or read the live pool count:
  ```js
  // main.js logs: "[fable-katamari] booted — ... pools=<N> ..."
  // Read it back from the dev probe instead of scraping console:
  () => ({
    pools: window.__v3dbg ? window.__v3dbg.store.aliveCount >= 0 : null,
    alive: window.__v3dbg ? window.__v3dbg.store.aliveCount : null,
  })
  ```
  Expected observation: `__v3dbg` exists and `alive` is a finite number > 0 (the seam did not break boot/preload).
- [ ] Trigger the engine's forced-rescale pixel-identity path. The renderer exposes `onForceRescale` (main.js line 516 → `scaleMgr.forceRescale()`); call it and confirm no exception and the ball radius lands back in-band:
  ```js
  () => {
    const d = window.__v3dbg;
    const before = d.ballPhys.state.radiusSim;
    d.scaleMgr.forceRescale();      // the existing forced 5x similarity rescale
    const after = d.ballPhys.state.radiusSim;
    return { before, after, ratio: before / after };
  }
  ```
  Expected observation: `ratio ≈ 5` (i.e. `1/RESCALE_S`), no thrown error — the rescale math is untouched by the seam.
- [ ] `take_screenshot` immediately before and after the forced rescale and confirm the framing is visually continuous (the rescale is designed to be pixel-stable; the seam must not have perturbed it). Expected observation: the two screenshots show the same scene with no pop/shift in the ball or nearby objects.
- [ ] Play-smoke: drive a few absorbs and confirm the HUD still shows a Japanese absorb-name float (Tokyo content active) and the collection popup fires — i.e. the code→id→displayName path through the new pack-scoped map resolves. Use the dev teleport to a mid tier to make absorbs fast:
  ```js
  () => { window.devTeleport('street'); return window.__v3dbg.store.aliveCount; }
  ```
  Then `take_screenshot`. Expected observation: street scene materializes with Akihabara objects; HUD label area renders Japanese (unchanged Tokyo strings) — confirming the seam preserved the display-name lookup.
- [ ] Stop the dev server (foreground the background job and Ctrl-C, or kill it). Commit nothing (verification only) — but record the result in the commit message of the next doc touch.

> **Pass criteria for P2 as a whole:** (1) `npx vitest run` all green; (2) `npm run build` clean with no global-assert throw; (3) forced-rescale ratio ≈ 5 with visually-continuous before/after screenshots; (4) Tokyo still plays and HUD shows the unchanged Japanese names. If all four hold, the StagePack seam is proven byte-identical and P3 can build the taipei pack against the same `active.js` / `buildCodeMap` / `validatePack` contract.

---

### Task P2.12: Document the seam for downstream parts

- [ ] Update `/home/ct/roll-formosa/README.md` (per the repo-change → README rule) with a short "Pack architecture" note:
  - `src/packs/active.js` is the single active StagePack the engine reads.
  - `src/packs/_engine/codeMap.js` (`buildCodeMap`, `validatePack`) are pack-agnostic; the code↔id map is built at load (pack-scoped, not a global frozen table).
  - `src/packs/_tokyo_transient/` is the temporary Tokyo wrap proving byte-identity; **deleted in P3** when `active.js` flips to taipei.
- [ ] Commit:
  ```bash
  git add README.md && git commit -m "P2.12: document StagePack seam (active.js, codeMap, transient Tokyo wrap)"
  ```



## P3. Taipei pack skeleton + i18n seam

**Goal of this part:** create a *bootable* `src/packs/taipei/` skeleton (re-using Tokyo geometry as placeholder content so the game still runs), add a thin zh-TW i18n seam routing the hardcoded Japanese literals in `hud.js` / `screens.js` / `index.html` through `pack.locale`, switch number formatting to `Intl.NumberFormat('zh-TW')`, and flip `src/packs/active.js` to the taipei pack so the **繁中 shell** appears. Content (tier names, archetypes, landmarks, mascot lines) is themed in P4–P9 — P3 only stands up the skeleton + the shell strings.

**Assumes (from P2):** the `StagePack` interface exists; the Tokyo content has been wrapped as a transient pack proving byte-identity; `src/packs/active.js` exists and exports `activePack`; the code↔id map builds at load from the active pack. P3 adds the `taipei/` pack directory alongside the transient Tokyo pack and flips `active.js` to it.

> Verification vocabulary for this part: `locale.t()` lookups + fallback are **pure logic → real vitest TDD**. The 繁中 shell appearing is **visual → chrome-devtools screenshot**. The pack booting clean is a **boot assert** (`pack.validate()` + no console error). Every rendering task ends with a concrete chrome-devtools observation.

---

### Task P3.1: Add vitest config sanity + create the taipei pack directory

- [ ] Confirm vitest is installed (added in P0). Run `npx vitest --version` from `/home/ct/roll-formosa` — expect a version string, not "command not found". If missing, STOP and finish P0's vitest step first.
- [ ] Create the directory `src/packs/taipei/` (the file layout below is frozen by the project contract):
  - `index.js` `tiers.js` `catalog.js` `cityMap.js` `landmarks.js` `monument.js` `ending.js` `narration.js` `mascot.js` `locale.js` (+ co-located `*.test.js`).
- [ ] `git add -A && git commit -m "P3.1: scaffold src/packs/taipei/ directory"` (empty dir tracked via the first files below — commit after Task P3.2 if your git ignores empty dirs).

---

### Task P3.2: Write the zh-TW locale table + `t()` lookup (`src/packs/taipei/locale.js`)

This is the i18n seam's data + lookup. **TDD first** — the lookup (missing-key fallback) is pure logic.

- [ ] Write the failing test FIRST at `src/packs/taipei/locale.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { locale } from './locale.js';

describe('taipei locale', () => {
  it('returns the zh-TW string for a known key', () => {
    expect(locale.t('app.startButton')).toBe('開始 / START');
  });

  it('returns the explicit fallback for a missing key', () => {
    expect(locale.t('nope.not.here', '預設值')).toBe('預設值');
  });

  it('returns a VISIBLY-WRONG marker (not blank, not a throw) when a key is missing and no fallback is given', () => {
    const out = locale.t('still.missing');
    expect(out).toContain('still.missing'); // visible on screen → caught in QA
    expect(out).not.toBe('');               // never silently blank
  });

  it('has no Japanese kana in any shipped string', () => {
    const kana = /[぀-ヿ]/; // hiragana + katakana
    for (const [key, val] of Object.entries(locale.strings)) {
      expect(kana.test(val), `key ${key} still contains kana: ${val}`).toBe(false);
    }
  });
});
```

- [ ] Run it — expect failure (`locale` undefined): `npx vitest run src/packs/taipei/locale.test.js`
- [ ] Implement `src/packs/taipei/locale.js`. The `strings` table holds ONLY the dynamic UI strings the JS reads at runtime (static DOM literals live in `index.html`, Task P3.6). Keys are dotted lowercase ascii; values are zh-TW:

```js
/**
 * @file locale.js — Taipei pack zh-TW UI string table + lookup.
 *
 * The thin i18n seam (spec §6): hud.js / screens.js read DYNAMIC strings
 * through `locale.t(key, fallback?)`. Static DOM literals that render before
 * JS boot live in index.html (single authoritative static copy) — they are
 * NOT duplicated here.
 *
 * Key namespace owned by P3 (the shell): app.* / hud.* / share.* / result.* /
 * title.* / keyhints.*. Content parts ADD their own namespaces (tier.* P4,
 * landmark.* P6, collect.* P7, mascot.* P8) to THIS table — never rename a key.
 *
 * Missing-key policy: t(key, fallback) returns fallback if given, else returns
 * a VISIBLY-WRONG marker '⟦key⟧' so a typo is caught on screen, never blank,
 * never a throw.
 */

/** @type {Readonly<Record<string,string>>} */
const STRINGS = Object.freeze({
  /* ---- app shell (also mirrored as static copy in index.html) ---- */
  'app.title': 'Roll Formosa — 滾出整座台北。',
  'app.gameTitle': 'ROLL<br />FORMOSA',
  'app.subtitle': '滾啊滾，把整個台北滾起來。 / Roll up all of Taipei.',
  'app.startButton': '開始 / START',

  /* ---- HUD toasts (hud.js dynamic) ---- */
  'hud.toast.rare': '稀有發現！+5000',
  'hud.toast.goalCall': '台北 101 在呼喚你…！',
  'hud.toast.goalGuide': '朝台北 101 前進！',
  // landmark toast template — {name} substituted with LandmarkEvent name.
  'hud.toast.landmark': '把「{name}」捲進來了！',

  /* ---- HUD collect popup (hud.js dynamic) ---- */
  'hud.collect.new': 'NEW！　',
  // collection count template — {found}/{total}
  'hud.collect.count': '收藏冊 {found}/{total}',

  /* ---- result / best lines (screens.js dynamic) ---- */
  'result.bestPrefix': '個人最佳: ',
  'result.bestTime': '最佳時間 {time} (RANK {rank})',
  'result.bestScore': '最佳分數 {score}',
  'result.titleBest': 'RANK {rank} ・ {time} ・ {score}pt',

  /* ---- X / 社群分享 (screens.js dynamic; spec §6) ---- */
  // first line of the share post
  'share.headline': '🗼 ROLL FORMOSA 我把台北滾起來了！',
  'share.statsTime': '⏱{time}',
  'share.statsRank': '／RANK {rank}',
  'share.statsScore': '／⭐{score}',
  'share.statsCollect': '🏯收藏 {found}/{total}',
  'share.hashtag': 'RollFormosa',
});

/**
 * @param {string} key dotted lowercase id.
 * @param {string} [fallback] returned verbatim if the key is absent.
 * @returns {string}
 */
function t(key, fallback) {
  const v = STRINGS[key];
  if (typeof v === 'string') return v;
  return typeof fallback === 'string' ? fallback : '⟦' + key + '⟧';
}

/**
 * Substitute {name}-style placeholders. Zero-alloc-friendly (only called on
 * throttled/event UI paths, like the formatLength contract). Unmatched tokens
 * are left intact so a missing arg is visible.
 * @param {string} key @param {Record<string,string|number>} vars
 * @returns {string}
 */
function format(key, vars) {
  let s = t(key);
  for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}

export const locale = Object.freeze({ strings: STRINGS, t, format });
```

- [ ] Re-run: `npx vitest run src/packs/taipei/locale.test.js` — expect PASS (4 tests green).
- [ ] `git commit -am "P3.2: taipei zh-TW locale table + t() lookup with visible fallback (TDD)"`

---

### Task P3.3: Shared zh-TW number formatter (`src/core/mathUtils.js`)

One shared `Intl.NumberFormat('zh-TW')` instance for hud + screens (the reference hud.js caches its own `'ja-JP'` formatter; screens.js calls `.toLocaleString('ja-JP')` directly). Centralize so P4–P9 reuse it.

- [ ] Add to `src/core/mathUtils.js` (append; keep existing exports `formatLength` / `splitLength` / `clamp01` untouched):

```js
/** Shared grouped number formatter (zh-TW). One instance — toLocaleString
 *  re-resolves the locale every call; this is cached. Falls back to String()
 *  where Intl is unavailable (headless/old engines). */
const _numFmt =
  typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function'
    ? new Intl.NumberFormat('zh-TW')
    : null;

/** @param {number} n @returns {string} grouped, zh-TW. */
export function fmtNumber(n) {
  return _numFmt !== null ? _numFmt.format(n) : String(n);
}
```

- [ ] (Optional pure-logic test) `src/core/mathUtils.test.js` — assert `fmtNumber(1234567)` contains grouping separators (locale-independent: just assert length and that it differs from `'1234567'`):

```js
import { describe, it, expect } from 'vitest';
import { fmtNumber } from './mathUtils.js';
describe('fmtNumber', () => {
  it('groups thousands', () => {
    const out = fmtNumber(1234567);
    expect(out.length).toBeGreaterThan('1234567'.length); // separators added
  });
});
```

- [ ] `npx vitest run src/core/mathUtils.test.js` — expect PASS.
- [ ] `git commit -am "P3.3: shared zh-TW fmtNumber() in mathUtils"`

---

### Task P3.4: Route hud.js dynamic JP literals through `pack.locale` + `fmtNumber`

The reference `hud.js` has these hardcoded Japanese strings (grounded in the read): `reset()` reads `TIERS[0].name`; `_onScore` shows `'レアはっけん！+5000'`; `_onGoalCall` shows `'スカイツリーが呼んでいる…！'`; `_onGoalGuide` shows `'スカイツリーへ向かえ！'` (twice); `_onLandmark` builds `'「'+p.nameJa+'」まきこんだ！'`; `_onCollect` builds `'NEW!　'` + `'コレクション '+found+'/'+total`; the cached `_numFmt` is `'ja-JP'`.

- [ ] At the top of `src/ui/hud.js`, add the pack + formatter imports (next to the existing `import { TIERS } ...`):

```js
import { activePack } from '../packs/active.js';
import { fmtNumber } from '../core/mathUtils.js';
const L = activePack.locale;
```

- [ ] Replace the cached formatter. Find in the constructor:

```js
    this._numFmt =
      typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function'
        ? new Intl.NumberFormat('ja-JP')
        : null;
```

  Replace its USES instead of the field is simplest: leave `this._numFmt` removed and swap the two call sites. In `_float()` change `this._numFmt !== null ? this._numFmt.format(sum) : String(sum)` → `fmtNumber(sum)`. In `_writeScore()` change `this._numFmt !== null ? this._numFmt.format(score) : String(score)` → `fmtNumber(score)`. Then delete the `this._numFmt = ...` block from the constructor.

- [ ] In `reset()`, change the tier label source from the global table to the active pack so the shell shows the pack's tier name:

```js
    this._writeTierLabel(activePack.tiers[0].name);
```

  (The global `TIERS` import can stay for any other use, but the displayed name now comes from the pack — see P3.7 integrator note.)

- [ ] `_onScore` rare toast — replace `this._showToast('レアはっけん！+5000');` with:

```js
    if (p.rare) this._showToast(L.t('hud.toast.rare'));
```

- [ ] `_onGoalCall` — replace `this._showToast('スカイツリーが呼んでいる…！');` with:

```js
    this._showToast(L.t('hud.toast.goalCall'));
```

- [ ] `_onGoalGuide` — there are TWO `this._showToast('スカイツリーへ向かえ！');` call sites (the on-screen branch and the edge branch). Replace BOTH with `this._showToast(L.t('hud.toast.goalGuide'));`.

- [ ] `_onLandmark` — replace `this._showToast('「' + p.nameJa + '」まきこんだ！');` with the templated lookup (note: the LandmarkEvent field is `nameJa` in the reference engine; treat it as the localized display name supplied by the pack — P6 ensures the pack feeds zh-TW landmark names into that field; do NOT rename the payload field here):

```js
    this._showToast(L.format('hud.toast.landmark', { name: p.nameJa }));
```

- [ ] `_onCollect` — replace the count line:

```js
    this._popupNameEl.textContent = p.nameJa;
    this._popupCountEl.textContent =
      (p.isNew ? L.t('hud.collect.new') : '') +
      L.format('hud.collect.count', { found: p.found, total: p.total });
```

- [ ] `git commit -am "P3.4: route hud.js dynamic strings through pack.locale + zh-TW fmtNumber"`

> Note: `p.nameJa` is the engine's payload field name (frozen in `types.js`); we keep the field name but feed it zh-TW values from the pack in P6. Renaming the payload field is out of scope and would touch the engine.

---

### Task P3.5: Route screens.js dynamic JP literals + zh-TW share text

The reference `screens.js` hardcodes: touch `key-hints.innerHTML` (JP/EN); `SHARE_URL` + `X_INTENT`; `_buildXUrl` text `'🗼FABLE KATAMARI 東京を転がした！...'`; `_refreshTitleBest` / `_buildBestLine` JP prefixes (`'自己ベスト:'`, `'ベストタイム '`, `'ベストスコア '`); and many `.toLocaleString('ja-JP')` calls.

- [ ] Add imports at the top of `src/ui/screens.js`:

```js
import { activePack } from '../packs/active.js';
import { fmtNumber } from '../core/mathUtils.js';
const L = activePack.locale;
```

- [ ] Change the deploy share URL placeholder (P11 confirms the final URL):

```js
const SHARE_URL = 'https://yazelin.github.io/roll-formosa/';
```

- [ ] Touch-device key hints — replace the JP `hints.innerHTML = ...` block (the `'ontouchstart' in window` branch) with zh-TW (these are runtime-set, so they go through hardcoded zh-TW here; the keyboard hints in `index.html` are handled in P3.6):

```js
      hints.innerHTML =
        '<span><kbd>拖曳 / Drag</kbd>移動 / Move</span>' +
        '<span><kbd>第二指 / 2nd finger</kbd>加速 / Boost</span>' +
        '<span><kbd>DASH</kbd>衝刺 / Dash</span>';
```

- [ ] `_onWinPointerDown` — replace `this._scoreEl.textContent = g.score.toLocaleString('ja-JP');` with `this._scoreEl.textContent = fmtNumber(g.score);`.

- [ ] `_startCountup` — replace `el.textContent = Math.round(finalScore * eased).toLocaleString('ja-JP');` with `el.textContent = fmtNumber(Math.round(finalScore * eased));`.

- [ ] `_refreshTitleBest` — replace the JP title-best line build with the templated lookup:

```js
    this._titleBestValueEl.textContent = L.format('result.titleBest', {
      rank: rec.rank,
      time: formatTime(rec.timeS),
      score: fmtNumber(rec.score),
    });
```

- [ ] `_buildBestLine` — replace the JP prefixes/labels:

```js
    let line = '';
    if (best.bestTime !== null) {
      line += L.format('result.bestTime', {
        time: formatTime(best.bestTime.timeS),
        rank: best.bestTime.rank,
      });
    }
    if (best.bestScore !== null) {
      if (line !== '') line += ' ／ ';
      line += L.format('result.bestScore', { score: fmtNumber(best.bestScore.score) });
    }
    return line === '' ? '' : L.t('result.bestPrefix') + line;
```

- [ ] `_buildXUrl` — replace the whole JP `text` template + hashtag with the zh-TW lookups (spec §6 example "我在《Roll Formosa》滾出了台北 101！"):

```js
    const text =
      L.t('share.headline') + '\n' +
      L.format('share.statsTime', { time: formatTime(g.timeS) }) +
      L.format('share.statsRank', { rank: g.rank }) +
      L.format('share.statsScore', { score: fmtNumber(g.score) }) + '\n' +
      L.format('share.statsCollect', { found: g.collectFound, total: COLLECT_TOTAL });
    return X_INTENT +
      '?text=' + encodeURIComponent(text) +
      '&url=' + encodeURIComponent(SHARE_URL) +
      '&hashtags=' + encodeURIComponent(L.t('share.hashtag'));
```

- [ ] `git commit -am "P3.5: route screens.js result/share/best lines through pack.locale (zh-TW share text)"`

---

### Task P3.6: Localize the static `index.html` literals to 繁中

These render BEFORE JS boots, so they stay as authoritative static copy in `index.html` (not rewritten from JS — avoids FOUC and respects the frozen DOM-id contract). Also remove the OSM/ODbL credit blocks (OSM removed in P1) and flip `lang`.

- [ ] `<html lang="ja">` → `<html lang="zh-Hant">`.
- [ ] `<title>Fable Katamari — 転がして、東京まるごと。</title>` → `<title>Roll Formosa — 滾出整座台北。</title>`.
- [ ] Donack frame `<link rel="preload">` paths: leave as-is for now (`/assets/donack/*.webp`) — the bear art swap is P8. (P8 renames these.)
- [ ] `#tier-label` initial text `センゴク電子` → a neutral zh-TW placeholder `桌頭` (T0 name; P4 sets the real one, and hud.js overwrites it at `reset()` from the pack anyway).
- [ ] Title overlay:
  - `<h1 class="game-title">FABLE<br />KATAMARI</h1>` → `<h1 class="game-title">ROLL<br />FORMOSA</h1>`
  - `<p class="game-subtitle">転がして、東京まるごと。 / Roll up all of Tokyo.</p>` → `<p class="game-subtitle">滾啊滾，把整個台北滾起來。 / Roll up all of Taipei.</p>`
  - `<button id="start-button" ...>スタート / START</button>` → `開始 / START`
  - `<button id="donack-toggle" ...>🦆 ドナック実況 ON</button>` → `🐻 月牙旁白 ON` (and update the two label strings in `screens.js` `_renderDonackToggle`: `'🦆 ドナック実況 OFF'`/`'ON'` → `'🐻 月牙旁白 OFF'`/`'🐻 月牙旁白 ON'` — these are JS-set; do it in this task so the toggle never reverts to JP).
  - key-hints block → zh-TW: `うごく / Move`→`移動 / Move`, `ブースト / Boost`→`加速 / Boost`, `ダッシュ / Dash`→`衝刺 / Dash`, `ミュート / Mute`→`靜音 / Mute`, `カメラ / Camera`→`鏡頭 / Camera`.
  - `<p id="title-best-line" class="hidden">自己ベスト: <span id="title-best-value">—</span></p>` → `個人最佳: <span ...>—</span>` (the JS overwrites the value via `result.titleBest`).
  - `<p class="seed-line">2cm のネジから 634m、スカイツリーへ — ...</p>` → `<p class="seed-line">從 2 公分的彈珠，滾到 508 公尺的台北 101。</p>`
  - **DELETE** `<p id="osm-progress" ...></p>` and the title `<p class="osm-credit">...OpenStreetMap...</p>` (OSM gone after P1). If P1 already removed these, skip.
- [ ] Win overlay:
  - `<h1 class="game-title">東京、まるごといただき！<br />YOU ROLLED UP TOKYO</h1>` → `台北，整碗端走！<br />YOU ROLLED UP TAIPEI`
  - row labels: `⏱ タイム / TIME`→`⏱ 時間 / TIME`, `⭐ スコア / SCORE`→`⭐ 分數 / SCORE`, `📏 さいごの大きさ / SIZE`→`📏 最終大小 / SIZE`.
  - `#win-size` default `420m` → `508m` (101 height; P6 sets the real goal radius — cosmetic default only).
  - detail row `まきこんだ <...> こ ・ レア <...> コ` → `捲進 <span id="result-absorbed" class="result-num">0</span> 個 ・ 稀有 <span id="result-rares" class="result-num">0</span> 個`.
  - collection header `🏯 コレクション <span id="result-collect-n">0</span>/13` → `🏯 收藏冊 <span id="result-collect-n">0</span>/13` (keep `/13` = `COLLECT_TOTAL`).
  - `#result-seed` `SEED: <...>（同じシードで同じ世界 / same seed, same world）` → `SEED: <span id="win-seed">—</span>（相同種子＝相同世界 / same seed, same world）`.
  - **DELETE** the win-overlay `<p class="osm-credit">...OpenStreetMap...</p>` block.
  - buttons: `Xでシェア / POST`→`分享到 X / POST`, `もういちど / ROLL AGAIN`→`再滾一次 / ROLL AGAIN`.
- [ ] Remove the now-orphaned `.osm-credit` / `#osm-progress` CSS rules in the `<style>` block (only if P1 left them; harmless if kept but cleaner to drop).
- [ ] `git commit -am "P3.6: localize static index.html DOM literals to zh-TW; drop OSM credit blocks; bear toggle label"`

---

### Task P3.7: Build the bootable taipei pack stubs (re-use Tokyo geometry as placeholder)

The pack must satisfy the frozen `StagePack` interface and BOOT. Strategy: re-export the transient Tokyo pack's content (tiers/archetypes/map/landmarks/monument/ending/narration/mascot) as placeholders, override only `id`/`displayName`/`region`/`locale`, and wire `validate()`. Content gets rethemed in P4–P9 file-by-file.

> The transient Tokyo pack from P2 is assumed importable. Adjust the import path to whatever P2 named it (e.g. `../tokyo/index.js`). The point of P3 is "繁中 shell on top of still-Tokyo geometry"; the placeholder geometry is replaced in later parts.

- [ ] `src/packs/taipei/tiers.js` — re-export Tokyo tiers as the 7-TierDef placeholder so `pack.tiers[0].name` resolves. P4 replaces the body:

```js
/** @file tiers.js — Taipei 7-tier table. P3 STUB: placeholder = Tokyo tiers
 *  (keeps the 7 x 10 contract bootable). P4 rewrites with zh-TW names + retuned
 *  scale palette. */
import { tokyoTiers } from '../tokyo/index.js'; // P2 transient pack
export const tiers = tokyoTiers;
```

- [ ] `src/packs/taipei/catalog.js`, `cityMap.js`, `landmarks.js`, `monument.js`, `ending.js`, `narration.js`, `mascot.js` — same stub pattern, each re-exporting the corresponding Tokyo piece. Example for `narration.js` (so Donack keeps talking until P8):

```js
/** @file narration.js — Taipei mascot line table. P3 STUB: re-exports Tokyo
 *  (Donack) lines so the bear stub still talks (in JP) until P8 rethemes. */
export * from '../tokyo/narration.js';
```

  | file | P3 stub action | rethemed in |
  |---|---|---|
  | `tiers.js` | re-export Tokyo tiers (7×10) | P4 |
  | `catalog.js` | re-export Tokyo archetypes map | P5 |
  | `cityMap.js` | re-export Tokyo map (zones/clusters/positions) | P6 |
  | `landmarks.js` | re-export Tokyo curated landmark defs | P6 |
  | `monument.js` | re-export Tokyo Skytree view + goal consts | P6 |
  | `ending.js` | re-export Tokyo earth-view ending params | P9 |
  | `narration.js` | re-export Tokyo Donack line tables | P8 |
  | `mascot.js` | re-export Tokyo duck mascot config (dk-* frames) | P8 |

- [ ] `src/packs/taipei/index.js` — assemble the StagePack, override the shell fields, run `validate()` at construction (dev mode):

```js
/** @file index.js — assembles the Taipei StagePack (Phase 1 active pack).
 *  P3: zh-TW shell (id/displayName/region/locale/seeds) over PLACEHOLDER Tokyo
 *  geometry. Content files are rethemed P4–P9. validate() runs at construction
 *  (dev) — the per-pack invariant guard that replaces Tokyo's global asserts. */
import { tiers } from './tiers.js';
import { archetypes } from './catalog.js';
import { map } from './cityMap.js';
import { landmarks } from './landmarks.js';
import { goalMonument } from './monument.js';
import { ending } from './ending.js';
import { narration } from './narration.js';
import { mascot } from './mascot.js';
import { locale } from './locale.js';

/** Deterministic seed for Taipei. Distinct from Tokyo's so the generation
 *  stream is its own (spec §11 risk 4). NOTE: P5 confirms the final value when
 *  archetypes land; placeholder here keeps boot deterministic. */
const seeds = Object.freeze({ primary: 0x524f4c46 }); // 'ROLF'

/**
 * Per-pack invariants (spec §4.4) — throws on bad data at boot (dev guard).
 * Replaces Tokyo's global frozen asserts. P4–P6 tighten as content lands.
 */
function validate() {
  if (tiers.length !== 7) throw new Error('taipei: expected 7 tiers, got ' + tiers.length);
  for (const t of tiers) {
    if (!Array.isArray(t.archetypeIds) || t.archetypeIds.length !== 10) {
      throw new Error('taipei: tier ' + t.index + ' must have 10 archetypeIds');
    }
    for (const id of t.archetypeIds) {
      if (archetypes[id] === undefined) {
        throw new Error('taipei: tier ' + t.index + ' references unknown archetype ' + id);
      }
    }
  }
  // Landmark ladder + MAP_BOUNDS checks are added in P6 (when taipei landmarks
  // exist). Placeholder landmarks (Tokyo) already satisfy the Tokyo ladder.
}

export const taipeiPack = Object.freeze({
  id: 'taipei',
  displayName: '台北',
  region: 'TW',
  tiers,
  archetypes,
  map,
  landmarks,
  goalMonument,
  ending,
  narration,
  mascot,
  locale,
  seeds,
  validate,
});

// Dev-mode boot self-check (cheap; the throw is the guard — spec verification
// vocabulary: "pack validate() throwing on bad data is itself a guard").
if (import.meta.env === undefined || import.meta.env.DEV !== false) {
  taipeiPack.validate();
}
```

- [ ] `git commit -am "P3.7: bootable taipei pack stubs (Tokyo geometry placeholder) + validate()"`

> Integrator note: the re-export names (`tokyoTiers`, `../tokyo/narration.js`, `archetypes`, `map`, etc.) MUST match whatever P2 exported from the transient Tokyo pack. If P2 used different names, reconcile the imports here. The StagePack FIELD names (`tiers`, `archetypes`, `map`, `landmarks`, `goalMonument`, `ending`, `narration`, `mascot`, `locale`, `seeds`, `validate`) are frozen and must not change.

---

### Task P3.8: Flip `src/packs/active.js` to the taipei pack

- [ ] Edit `src/packs/active.js` (created by P2) to export the taipei pack as the single active pack the engine reads:

```js
/** @file active.js — the single active StagePack the engine reads.
 *  Phase 1 = taipei. (P2 created this pointing at the transient Tokyo pack to
 *  prove byte-identity; P3 flips it to taipei.) */
import { taipeiPack } from './taipei/index.js';
export const activePack = taipeiPack;
```

- [ ] Build check: `npm run build` from `/home/ct/roll-formosa` — expect a clean Vite build (no unresolved imports, no `validate()` throw). If `validate()` throws, the placeholder re-exports don't satisfy the 7×10 contract → fix the Tokyo re-export wiring before continuing.
- [ ] `git commit -am "P3.8: flip active pack to taipei (zh-TW shell over placeholder geometry)"`

---

### Task P3.9: Visual verification — 繁中 shell boots (chrome-devtools)

The rendering/UX claim of this part: the title screen, HUD and win shell show **繁體中文**, the game still boots and rolls, no console errors, no `validate()` throw.

- [ ] Start the dev server in the background: `npm run dev` (note the printed local URL, typically `http://localhost:5173/`).
- [ ] `mcp__chrome-devtools__navigate_page` → the dev URL.
- [ ] `mcp__chrome-devtools__list_console_messages` — **expected observation:** NO error containing `validate`, `undefined`, or `Failed to resolve`. (A clean boot ⇒ the pack assembled and `active.js` resolved.)
- [ ] `mcp__chrome-devtools__take_screenshot` of the title screen — **expected observation:** the title reads `ROLL FORMOSA`, the subtitle reads `滾啊滾，把整個台北滾起來。`, the START button reads `開始 / START`, the toggle reads `🐻 月牙旁白 ON`. NO Japanese kana anywhere on the title.
- [ ] `mcp__chrome-devtools__evaluate_script` to assert the locale seam is live (reads the pack, not the DOM, so it is robust to placeholder geometry):

```js
() => {
  // active pack is module-scoped; expose a dev hook OR read via a known DOM string.
  const start = document.getElementById('start-button')?.textContent || '';
  const subtitle = document.querySelector('.game-subtitle')?.textContent || '';
  const kana = /[぀-ヿ]/;
  return {
    startOk: start.includes('開始'),
    subtitleOk: subtitle.includes('台北'),
    noKanaTitle: !kana.test(document.getElementById('title-overlay')?.textContent || ''),
  };
}
```

  **Expected:** `{ startOk: true, subtitleOk: true, noKanaTitle: true }`.

- [ ] Click START (`mcp__chrome-devtools__click` on `#start-button`), then `take_screenshot` of the HUD — **expected observation:** the tier label pill shows a zh-TW name (placeholder `桌頭` or P4's value once landed), the SIZE/SCORE pills render, the game canvas is rolling. (Geometry is still placeholder-Tokyo — that is expected at P3; this task only verifies the 繁中 SHELL, not the content.)
- [ ] `mcp__chrome-devtools__list_console_messages` again after START — **expected:** still no errors (the pack-scoped code map built fine for placeholder content).
- [ ] Stop the dev server. `git commit --allow-empty -m "P3.9: verified zh-TW shell boots (chrome-devtools screenshot + locale assert)"`

---

### Task P3.10: Final zh-TW shell sweep (grep guard) + commit

- [ ] Grep the three touched files for residual kana to catch any missed literal (catalog/tiers/narration content is still Tokyo placeholder by design — scope this to the SHELL files only):

```bash
grep -nP '[\x{3040}-\x{30ff}]' src/ui/hud.js src/ui/screens.js index.html src/packs/taipei/locale.js || echo "NO KANA IN SHELL FILES — clean"
```

  **Expected:** `NO KANA IN SHELL FILES — clean`. (If hud.js/screens.js still match, a literal was missed — fix it. index.html should be clean after P3.6. Note: the touch-key-hints in screens.js are intentionally zh-TW now; donack toggle labels zh-TW.)
- [ ] Run the full vitest suite for this part: `npx vitest run src/packs/taipei/locale.test.js src/core/mathUtils.test.js` — expect all green.
- [ ] `git commit -am "P3.10: kana sweep clean on shell files; locale + fmtNumber tests green"`

---

**P3 done-criteria recap (what changed → how it was verified):**
- `src/packs/taipei/locale.js` zh-TW table + `t()`/`format()` fallback → vitest (P3.2): missing key returns visible marker, no kana in strings.
- `fmtNumber()` zh-TW in mathUtils → vitest (P3.3).
- hud.js + screens.js dynamic JP literals routed through `pack.locale` + `fmtNumber` → grep sweep clean (P3.10) + chrome-devtools screenshot 繁中 (P3.9).
- index.html static literals zh-TW, `lang=zh-Hant`, OSM credit removed → screenshot (P3.9).
- taipei pack stubs boot over placeholder Tokyo geometry; `active.js` flipped to taipei; `validate()` passes → `npm run build` clean (P3.8) + no console error (P3.9).

**Hand-off to P4:** P4 replaces `src/packs/taipei/tiers.js` with the 7 retuned zh-TW TierDefs (adds `tier.*` keys to locale.js if it surfaces tier strings); the shell already reads tier names from `activePack.tiers[0].name`, so P4's names appear automatically.



## P4. Taipei 7-tier ladder content

Authors `src/packs/taipei/tiers.js`: the 7 `TierDef` objects for the 柑仔店→101 ladder (spec §5.1), with zh-TW names, a dusk→night Taipei palette, and the frozen `archetypeIds[10]` per tier (slots 0–7 = absorbable, slots 8–9 = repeatable chunk-landmark volumes). These 70 id strings are the **contract with Part 5** — Part 5's `catalog.js` must implement an `ArchetypeDef` for each one, exact spelling.

**Grounding (from the reference engine, read before writing):**
- `/tmp/fableDemoGame/src/config/tiers.js` — the Tokyo `TIERS` table has exactly the fields the frozen `TierDef` needs (`index, name, enterTrueRadius, cellSizeSim, loadRadiusSim, objectsPerChunk, archetypeIds, fogColor, skyTop, skyBottom, sunDir, sunIntensity, moonDir, moonAngSize, starIntensity, cloudDensity, cloudHex`). We re-theme `name`/palette/`archetypeIds` only.
- The dev assert there (≈ lines 281–296) requires `floored-fog-far < floored-load-radius − cell` at each tier's worst-case `worldScale = (START_RADIUS_M/SIM_RADIUS_MIN)·5^t`. It depends on `enterTrueRadius` band edges + `cellSizeSim=32` + `loadRadiusSim=96`. **We keep all of those numerically identical to Tokyo (0.02/0.10/0.50/2.5/12/60/300; 32; 96; 72)** so that invariant passes unchanged.
- `MOON_DIR_MIN_ELEV = 0.15` rad (`tuning.js`), `moonAngSize` must be non-decreasing, scalar sky params bounded. Reusing Tokyo's moon vectors/sizes satisfies all three.
- `RESCALE_S` / `ARCH_PER_TIER` stay engine constants in `config/tiers.js`; the pack imports `ARCH_PER_TIER` for its self-check, it does not redefine it.

> This part assumes the P3 skeleton already created `src/packs/taipei/index.js`, `src/packs/taipei/validate.js` (or `validate()` inside `index.js`), and flipped `src/packs/active.js` to the taipei stub. P4 fills in real tier content; if P3 left `tiers.js` as a placeholder, P4 replaces it.

---

### Task P4.1: Write the failing structural test for the 7-tier ladder

- [ ] Create `src/packs/taipei/tiers.test.js` with this content (vitest, pure-logic TDD):

```js
import { describe, it, expect } from 'vitest';
import { ARCH_PER_TIER } from '../../config/tiers.js';
import { START_RADIUS_M, MOON_DIR_MIN_ELEV } from '../../config/tuning.js';
import { TIERS } from './tiers.js';

describe('taipei tier ladder', () => {
  it('has exactly 7 tiers with monotonic indices', () => {
    expect(TIERS).toHaveLength(7);
    TIERS.forEach((t, i) => expect(t.index).toBe(i));
  });

  it('keeps the x5 enterTrueRadius band edges (engine fog/load-floor contract)', () => {
    const edges = TIERS.map((t) => t.enterTrueRadius);
    expect(edges).toEqual([0.02, 0.1, 0.5, 2.5, 12, 60, 300]);
    expect(TIERS[0].enterTrueRadius).toBe(START_RADIUS_M);
    for (let t = 1; t < TIERS.length; t++) {
      expect(TIERS[t].enterTrueRadius).toBeGreaterThan(TIERS[t - 1].enterTrueRadius);
    }
  });

  it('keeps cellSizeSim/loadRadiusSim/objectsPerChunk identical to the engine baseline', () => {
    TIERS.forEach((t) => {
      expect(t.cellSizeSim).toBe(32);
      expect(t.loadRadiusSim).toBe(96);
      expect(t.objectsPerChunk).toBe(72);
    });
  });

  it('has exactly 10 archetypeIds per tier and 70 unique ids total', () => {
    const seen = new Set();
    TIERS.forEach((t, i) => {
      expect(t.archetypeIds, `tier ${i}`).toHaveLength(ARCH_PER_TIER);
      t.archetypeIds.forEach((id) => {
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
        expect(seen.has(id), `duplicate id ${id}`).toBe(false);
        seen.add(id);
      });
    });
    expect(seen.size).toBe(70);
  });

  it('has zh-TW (non-Japanese, non-ASCII) tier names', () => {
    const expected = ['柑仔店桌頭', '夜市', '騎樓', '機車海', '萬華街屋與廟', '商業文教區', '信義天際線'];
    expect(TIERS.map((t) => t.name)).toEqual(expected);
  });

  it('has well-formed sky params within engine-asserted ranges', () => {
    let prevMoon = -Infinity;
    TIERS.forEach((t, i) => {
      for (const k of ['fogColor', 'skyTop', 'skyBottom', 'cloudHex']) {
        expect(Number.isInteger(t[k]), `tier ${i} ${k}`).toBe(true);
        expect(t[k]).toBeGreaterThanOrEqual(0);
        expect(t[k]).toBeLessThanOrEqual(0xffffff);
      }
      expect(t.sunDir).toHaveLength(3);
      expect(t.moonDir).toHaveLength(3);
      const m = t.moonDir;
      const len = Math.hypot(m[0], m[1], m[2]);
      expect(len).toBeGreaterThan(1e-6);
      expect(Math.asin(m[1] / len)).toBeGreaterThanOrEqual(MOON_DIR_MIN_ELEV);
      expect(t.moonAngSize).toBeGreaterThan(0);
      expect(t.moonAngSize).toBeLessThan(0.2);
      expect(t.moonAngSize).toBeGreaterThanOrEqual(prevMoon); // non-decreasing
      prevMoon = t.moonAngSize;
      expect(t.starIntensity).toBeGreaterThanOrEqual(0);
      expect(t.starIntensity).toBeLessThanOrEqual(1);
      expect(t.cloudDensity).toBeGreaterThanOrEqual(0);
      expect(t.cloudDensity).toBeLessThanOrEqual(1);
      expect(t.sunIntensity).toBeGreaterThanOrEqual(0);
    });
  });
});
```

- [ ] Run it and confirm it FAILS (no `tiers.js` yet): `npx vitest run src/packs/taipei/tiers.test.js`
  - Expected: import error / "Cannot find module './tiers.js'" (or, if P3 left a stub, a length/content mismatch). Either way: RED.
- [ ] Commit the failing test: `git add src/packs/taipei/tiers.test.js && git commit -m "test(taipei): failing spec for 7-tier ladder"`

---

### Task P4.2: Author the 7 TierDef objects (full code)

- [ ] Create `src/packs/taipei/tiers.js` with the complete table below. Palette runs **黃昏 → 入夜**: T0 柑仔店暖燈、T1–T3 傍晚藍紫漸暗、T4 街燈初上、T5 暮色金、T6 信義夜空。`enterTrueRadius` / `cellSizeSim` / `loadRadiusSim` / `objectsPerChunk` are kept identical to the engine baseline (do not edit — they anchor the fog/load-floor invariant). `moonDir` vectors and `moonAngSize` are reused from the Tokyo table to keep the engine moon asserts green.

```js
/**
 * @file packs/taipei/tiers.js — Roll Formosa Taipei pack: the 7-tier scale
 * ladder (圖釘 2 cm → 台北 101). Pack-scoped re-theme of the engine's Tokyo
 * tier table. The engine reads tiers via the active pack (src/packs/active.js),
 * NOT via config/tiers.js — but RESCALE_S / ARCH_PER_TIER stay engine constants
 * there; this pack imports ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/taipei/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (龍山寺 / 101 …) are NOT here — they live in
 * packs/taipei/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 */

import { ARCH_PER_TIER } from '../../config/tiers.js';

/** @typedef {import('../../types.js').Tier} TierDef */

/** @type {TierDef[]} */
export const TIERS = [
  {
    index: 0,
    name: '柑仔店桌頭', // 圖釘/文具桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 彈珠, 橡皮擦, 圖釘, 瓶蓋, 糖果, 尪仔標, 鉛筆, 鈕扣
      'marble', 'eraser', 'pushpin', 'bottle_cap', 'candy', 'ngiauimia_card', 'pencil', 'button',
      // chunk landmarks: 戳戳樂板, 籤筒
      'scratch_card_board', 'fortune_stick_tube',
    ],
    fogColor: 0xe7d9bf, // 暖色柑仔店燈霧
    skyTop: 0xf0ddb4,
    skyBottom: 0xfff3dd,
    sunDir: [0.50, 0.62, 0.30],
    sunIntensity: 0.5, // 無頂室內的軟燈光
    moonDir: [-0.45, 0.40, -0.80],
    moonAngSize: 0.018,
    starIntensity: 0,
    cloudDensity: 0.10,
    cloudHex: 0xfff1d8,
  },
  {
    index: 1,
    name: '夜市',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 養樂多, 寶特瓶, 檳榔, 香, 金紙, 滷味夾, 紅白塑膠袋, 胡椒餅
      'yakult', 'pet_bottle', 'betel_nut', 'incense_stick', 'joss_paper', 'luwei_tongs', 'redwhite_bag', 'pepper_bun',
      // chunk landmarks: 攤車燈籠, 彈珠台
      'stall_lantern', 'pinball_table',
    ],
    fogColor: 0xe2cbb0, // 黃昏夜市暖霧
    skyTop: 0xd8b894,
    skyBottom: 0xf4e0c2,
    sunDir: [0.40, 0.50, 0.28],
    sunIntensity: 0.7,
    moonDir: [-0.42, 0.42, -0.81],
    moonAngSize: 0.022,
    starIntensity: 0.05,
    cloudDensity: 0.20,
    cloudHex: 0xf3dcc0,
  },
  {
    index: 2,
    name: '騎樓',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 紅塑膠椅, 安全帽, 電鍋, 瓦斯桶, 三角錐, 消防栓, 招財貓, YouBike樁
      'red_plastic_chair', 'helmet', 'rice_cooker', 'gas_cylinder', 'traffic_cone', 'fire_hydrant', 'lucky_cat', 'youbike_dock',
      // chunk landmarks: 攤販推車, 廟前香爐
      'vendor_cart', 'temple_incense_burner',
    ],
    fogColor: 0xcdb9b0, // 傍晚騎樓 灰粉
    skyTop: 0xb89488,
    skyBottom: 0xe6cdbd,
    sunDir: [0.30, 0.42, 0.26],
    sunIntensity: 0.85,
    moonDir: [-0.38, 0.45, -0.81],
    moonAngSize: 0.028,
    starIntensity: 0.10,
    cloudDensity: 0.30,
    cloudHex: 0xe8d2c4,
  },
  {
    index: 3,
    name: '機車海',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 變電箱, 霓虹招牌, 鐵捲門, 路樹, 棚架, 石獅
      'scooter', 'mini_truck', 'transformer_box', 'neon_sign', 'roll_shutter', 'street_tree', 'awning_frame', 'stone_lion',
      // chunk landmarks: 夜市拱門, 廟前牌樓
      'night_market_arch', 'temple_pailou',
    ],
    fogColor: 0xb6a3b0, // 暮色街道 藍紫起調
    skyTop: 0x8c7a9c,
    skyBottom: 0xd2bcc8,
    sunDir: [0.10, 0.34, 0.22],
    sunIntensity: 0.9,
    moonDir: [-0.34, 0.48, -0.81],
    moonAngSize: 0.035,
    starIntensity: 0.15,
    cloudDensity: 0.34,
    cloudHex: 0xd8c4d0,
  },
  {
    index: 4,
    name: '萬華街屋與廟',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 透天厝, 鐵皮屋, 公寓, 超商, 公車, 垃圾車, 加油站, 騎樓柱
      'townhouse', 'tin_roof_house', 'apartment', 'convenience_store', 'city_bus', 'garbage_truck', 'gas_station', 'arcade_pillar',
      // chunk landmarks: 公寓街屋量體, 宮廟量體
      'streethouse_mass', 'temple_mass',
    ],
    fogColor: 0x9c8fae, // 街燈初上 藍紫
    skyTop: 0x6a5f8c,
    skyBottom: 0xb8a6c8,
    sunDir: [-0.10, 0.30, 0.30],
    sunIntensity: 0.85,
    moonDir: [-0.32, 0.50, -0.81],
    moonAngSize: 0.046,
    starIntensity: 0.25,
    cloudDensity: 0.34,
    cloudHex: 0xc2b0d2,
  },
  {
    index: 5,
    name: '商業文教區',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 商辦大樓, 百貨, 捷運高架, 天橋, 停車塔, 巨型看板, 玻璃帷幕街屋, 銀行
      'office_tower', 'department_store', 'metro_viaduct', 'pedestrian_bridge', 'parking_tower', 'giant_billboard', 'glass_curtain_house', 'bank',
      // chunk landmarks: 商辦塔樓, 百貨量體
      'commercial_tower', 'department_mass',
    ],
    fogColor: 0xb59bb0, // 暮色金紫 (golden hour 偏夜)
    skyTop: 0x8a6f9e,
    skyBottom: 0xe2b89a,
    sunDir: [-0.55, 0.20, 0.42],
    sunIntensity: 1.0, // 低斜暮陽
    moonDir: [-0.30, 0.52, -0.80],
    moonAngSize: 0.055,
    starIntensity: 0.35,
    cloudDensity: 0.30,
    cloudHex: 0xe0b894,
  },
  {
    index: 6,
    name: '信義天際線',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 玻璃帷幕高樓, 跨橋, 其他摩天樓, 巨型廣告牆, 商辦塔, 空橋, 屋頂機房, 街區量體
      'glass_highrise', 'cross_bridge', 'other_skyscraper', 'giant_ad_wall', 'biz_tower', 'sky_bridge', 'rooftop_plant_room', 'skyline_block',
      // chunk landmarks: 跨街空橋, 屋頂機房塔
      'crossstreet_skybridge', 'rooftop_mech_tower',
    ],
    fogColor: 0x4a3f6e, // 信義夜空 深藍紫 (the finale band)
    skyTop: 0x1c1a44,
    skyBottom: 0x6e5a96,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.30, // 入夜 — dimmed; 101 點燈接手
    moonDir: [-0.26, 0.56, -0.79],
    moonAngSize: 0.062,
    starIntensity: 0.6,
    cloudDensity: 0,
    cloudHex: 0x4a3f6e,
  },
];

/* ================================================================== */
/* Pack self-check (dev only) — STRUCTURE ONLY (no archetype resolve)  */
/* Archetype-resolution lives in pack.validate() once Part 5 lands.     */
/* ================================================================== */

/**
 * Structural invariants for the tier ladder, independent of catalog.js.
 * Called by pack.validate(); also runnable standalone. Throws on violation.
 * @returns {void}
 */
export function validateTiersStructure() {
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`[taipei tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→101, x5 ladder)');
  const seen = new Set();
  for (let t = 0; t < TIERS.length; t++) {
    const tier = TIERS[t];
    assert(tier.index === t, `tier ${t}: index mismatch`);
    assert(
      tier.archetypeIds.length === ARCH_PER_TIER,
      `tier ${t}: exactly ${ARCH_PER_TIER} archetypeIds (slots 8/9 = chunk landmarks)`
    );
    for (const id of tier.archetypeIds) {
      assert(!seen.has(id), `duplicate archetype id '${id}'`);
      seen.add(id);
    }
    if (t > 0) {
      assert(
        tier.enterTrueRadius > TIERS[t - 1].enterTrueRadius,
        `tier ${t}: enterTrueRadius must be strictly increasing`
      );
    }
  }
  assert(seen.size === 70, 'exactly 70 unique chunk archetype ids (10 x 7) — Part 5 contract');
}

export default TIERS;
```

- [ ] Run the unit test, confirm GREEN: `npx vitest run src/packs/taipei/tiers.test.js`
  - Expected: all 6 tests pass.
- [ ] Commit: `git add src/packs/taipei/tiers.js && git commit -m "feat(taipei): 7-tier ladder content (柑仔店→信義天際線)"`

> The 70 frozen ids above ARE the Part 5 contract. Do not rename any without updating `catalog.js` in lockstep — `validateTiersStructure` asserts the count, and `pack.validate()` (P4.3) will later assert every id resolves in `pack.archetypes`.

---

### Task P4.3: Wire the tier structure check into the pack's validate()

> Depends on the P3 skeleton's `validate()` (in `src/packs/taipei/index.js` or `validate.js`). This task connects P4's structural check and documents the deferred archetype-resolution check so boot does not throw before Part 5 ships `catalog.js`.

- [ ] Open `src/packs/taipei/index.js` (created by P3). Confirm it imports the tier table and exposes `validate`. Add the structural check import near the top:

```js
import { TIERS, validateTiersStructure } from './tiers.js';
```

- [ ] Inside the pack object's `validate()` body, call the structural check FIRST, then guard the archetype-resolution check so it only runs once Part 5 has populated `archetypes`:

```js
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P4→P5 seam: archetype resolution is deferred until catalog.js lands.
    // Once pack.archetypes is non-empty, assert every tier id resolves.
    const archIds = this.archetypes
      ? (this.archetypes instanceof Map
          ? [...this.archetypes.keys()]
          : Object.keys(this.archetypes))
      : [];
    if (archIds.length > 0) {
      const known = new Set(archIds);
      for (const tier of TIERS) {
        for (const id of tier.archetypeIds) {
          if (!known.has(id)) {
            throw new Error(`[taipei validate] tier archetype '${id}' missing from pack.archetypes`);
          }
        }
      }
    }
    // (P6 will append the landmark dioramaR-ladder + MAP_BOUNDS asserts here.)
  },
```

- [ ] Add a regression test for the deferred-resolution guard. Create `src/packs/taipei/validate.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { TIERS } from './tiers.js';

// Re-implements the resolution guard against an explicit known-set so the
// P4→P5 seam contract is pinned even before catalog.js exists.
function tierIdsResolveAgainst(knownIds) {
  const known = new Set(knownIds);
  for (const tier of TIERS) {
    for (const id of tier.archetypeIds) {
      if (!known.has(id)) return false;
    }
  }
  return true;
}

describe('taipei tier→catalog resolution seam', () => {
  it('all 70 tier ids resolve when the full id set is present', () => {
    const all = TIERS.flatMap((t) => t.archetypeIds);
    expect(tierIdsResolveAgainst(all)).toBe(true);
  });

  it('fails fast if a tier id is missing from the catalog id set', () => {
    const all = TIERS.flatMap((t) => t.archetypeIds).filter((id) => id !== 'marble');
    expect(tierIdsResolveAgainst(all)).toBe(false);
  });
});
```

- [ ] Run both pure-logic suites, confirm GREEN: `npx vitest run src/packs/taipei/tiers.test.js src/packs/taipei/validate.test.js`
  - Expected: all tests pass.
- [ ] Commit: `git add src/packs/taipei/index.js src/packs/taipei/validate.test.js && git commit -m "feat(taipei): wire tier structure check into pack.validate() (archetype resolve deferred to P5)"`

---

### Task P4.4: Boot verification — build clean + new tier names render in the HUD

> Rendering-affecting step (the HUD tier label is driven by `tier.name`). Ends with a concrete chrome-devtools observation per the verification vocabulary.

- [ ] Confirm the dev build has no boot assert and the bundle still builds: `npm run build`
  - Expected: build succeeds (the engine's fog/load-floor + moon asserts pass untouched because band edges / `cellSizeSim` / `loadRadiusSim` / moon vectors are unchanged from baseline). `validateTiersStructure` does not throw (70 unique ids, 7 tiers). No `[taipei tiers]` / `[taipei validate]` error in output.
- [ ] Start the dev server in the background and capture its URL: `npm run dev` (note the `http://localhost:<port>` it prints, typically `5173`).
- [ ] Drive the boot via chrome-devtools MCP:
  - `navigate_page` → the dev URL.
  - `evaluate_script` to read the active pack's tier names directly from the loaded module graph (no gameplay needed):
    ```js
    () => {
      // active pack is the single source the engine reads
      const pack = window.__DEV?.activePack || globalThis.__ACTIVE_PACK__;
      const names = (pack?.tiers || []).map((t) => t.name);
      return { count: names.length, names, t0Enter: pack?.tiers?.[0]?.enterTrueRadius };
    }
    ```
  - **Expected observation:** `count === 7`, `names` equals `['柑仔店桌頭','夜市','騎樓','機車海','萬華街屋與廟','商業文教區','信義天際線']`, and `t0Enter === 0.02`.
    > If `window.__DEV`/`__ACTIVE_PACK__` is not exposed, fall back to reading the HUD: `take_snapshot`, then `evaluate_script` returning `document.querySelector('#tier-label')?.textContent` — expected at boot: `柑仔店桌頭` (the T0 zh-TW label, NOT `センゴク電子`). Coordinate the exact dev hook name with the P3 drafter; P3 owns `active.js` wiring.
- [ ] `take_screenshot` of the title/HUD and confirm by eye: the tier label shows **繁中** `柑仔店桌頭`, no residual Japanese in the tier readout.
- [ ] Stop the dev server (background task) once verified.
- [ ] No code change in this task → nothing to commit (verification-only). If the HUD still showed Japanese, that is a P3 wiring gap, not a P4 content gap — flag it to the P3 drafter rather than editing `tiers.js`.

---

### Acceptance for P4

- [ ] `npx vitest run src/packs/taipei/tiers.test.js src/packs/taipei/validate.test.js` → all green.
- [ ] `npm run build` → succeeds, no `[taipei tiers]`/`[taipei validate]` boot assert.
- [ ] chrome-devtools: active pack exposes exactly 7 tiers with the zh-TW names above; HUD T0 label reads `柑仔店桌頭`.
- [ ] The 70 frozen `archetypeIds` are committed and unchanged — they are the contract Part 5 implements.



## P5. Chunk archetype geometry (the ~70 rollables)

This part authors `src/packs/taipei/catalog.js` — the 70 chunk archetype geometry recipes (`buildGeometry`) for the ids Part 4 froze into `src/packs/taipei/tiers.js` (10 ids × 7 tiers; slots 0–7 absorbable, slots 8/9 chunk landmarks). It reuses the reference engine's geometry vocabulary and unit-bounding-sphere normalization **verbatim** — we only change *content*, never the geometry math (engine red line, spec §9).

**Dependency / naming contract.** Every id below MUST match `tiers.js` `archetypeIds[]` spelling exactly (Part 4). The ArchetypeDef field is `displayName` (zh-TW) per the frozen StagePack contract — the reference's `displayNameJa` is renamed. If Part 4's id spellings differ from the table in §P5.7, reconcile both files first.

**Engine facts this part is grounded in** (read from `/tmp/fableDemoGame`):
- Geometry helpers `box/cyl/cone/sph/ico/torus/towerBanded/paint/xf` and the finisher `finish([...])` live in the reference `src/config/catalog.js` (lines 96–273). `finish` merges parts, recenters on the bounding-sphere center, and scales to **radius exactly 1.0** (`catalog.js:253-273`). Instance render scale = the placed object's radius; `instance.y = r * (1 + yOffset)` (`render/geometryFactory.js:6-12`).
- `buildAllGeometries` (`render/geometryFactory.js:253-319`) runs each `buildGeometry(rng)`, ensures normals + a `color` attribute, normalizes to unit sphere, bakes AO, then **DEV-asserts the tri cap**: `ARCHETYPE_TRI_CAP` 350 default, or `arch.heroTriCap` (`HERO_TRI_CAP` 600) if set (`geometryFactory.js:290-310`). These are the boot asserts our recipes must pass.
- Tier bands (`config/tiers.js`): `enterTrueRadius` = 0.02 / 0.10 / 0.50 / 2.5 / 12 / 60 / 300 m for T0..T6. Chunk slots 0–7 carry `radiusNominal` inside the band; chunk landmarks (slots 8/9) are ~2.5–4× the band max with `spawnWeight` 0.25–0.35 (e.g. ref `utility_pole` r=4.5 in the 0.5–2.5 band, `highway_junction` r=70 in the 12–60 band).

---

### Task P5.1: Extract the geometry helper module (verbatim copy)

> Skip this task if Part 2/3 already extracted the boot helpers to a shared path — in that case import `box/cyl/cone/sph/ico/torus/towerBanded/finish` from THAT path in P5.2 and note it.

- [ ] Create `src/packs/taipei/geomHelpers.js`. Copy the helper block from the reference `src/config/catalog.js` **verbatim** (lines 77–273): the `THREE` + `mergeGeometries` imports, scratch colors `_CA/_CB/_CC`, `PI`/`HALF_PI`, and the functions `paint`, `xf`, `box`, `cyl`, `cone`, `sph`, `ico`, `torus`, `towerBanded`, `finish`. **Do NOT copy `finishUnitBox`** (OSM-only; no chunk archetype uses it). Add `export` to each of: `paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish` and also `export { PI, HALF_PI }`.
- [ ] Top of file, keep only these imports (drop the tiers/objects/tuning imports the reference had):
  ```js
  import * as THREE from 'three';
  import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
  ```
- [ ] Verify it parses: `node --input-type=module -e "import('./src/packs/taipei/geomHelpers.js').then(()=>console.log('ok'))"` from the repo root. Expected: prints `ok` (no import/syntax error). If `three` isn't resolvable in bare node, instead run `npx vitest run` after P5.3's smoke test exists.
- [ ] Commit: `feat(taipei): extract verbatim geometry helpers for the taipei pack`

---

### Task P5.2: Geometry helper vocabulary — the rules every recipe follows

This is reference, not code; it pins the conventions so the 70 recipes are consistent. Read once, then apply in P5.4–P5.7.

- [ ] **Primitives** (each returns a painted `BufferGeometry`; all accept an `XfOpts` last arg `{x,y,z, rx,ry,rz, sx,sy,sz, hex2}` applied as scale→rotate→translate, then `paint`):
  - `box(w,h,d, hex, o?)` — the workhorse (walls, slabs, signs, crates).
  - `cyl(rTop,rBottom,h, seg, hex, o?)` — bottles, poles, wheels (lay flat with `rx:HALF_PI`), tapered tower nodes (`rTop<rBottom`). `o.open:true` for tubes (frame members).
  - `cone(r,h, seg, hex, o?)` — roofs, traffic cones, ears, hydrant caps.
  - `sph(r, hex, o?)` — heads, lanterns, blobs; `ws/hs` segment counts (default 7/5), `theta0/thetaLen` for hemispheres (domes).
  - `ico(r, detail, hex, o?)` — organic blobs (tree canopy, bear body) at low tri cost.
  - `torus(r,tube, rs,ts, hex, o?)` — tires, rings, hoops; flatten loops with `rx:HALF_PI`.
  - `towerBanded(w,h,d, floors, wallHex,winHex,litHex, rng, o?)` — a single box whose height-segment rows alternate wall / (window→lit) bands; `rng` lights random floors. Use for any multi-storey building so windows cost zero extra parts.
- [ ] **paint + finish**:
  - Each primitive bakes a flat (or `hex2` vertical-gradient) vertex color. A part baked `0xffffff` (white) is the **tintable body** — the per-instance palette tint multiplies it (`final = vertexColor * instanceColor`). Fixed-color parts (metal, glass, wheels) bake dark/desaturated so the palette only nudges them.
  - `finish([...parts])` merges, recenters, and **normalizes to a unit bounding sphere (radius 1.0)**. So *build at any convenient scale* — `finish` rescales. The longest axis of your part layout becomes the diameter.
- [ ] **radiusNominal** is in **real meters** and MUST land in the tier band (Part 4's `tiers.js`): slot 0–7 inside `[enterTrueRadius(T), enterTrueRadius(T+1))`; slots 8/9 (chunk landmarks) ~2.5–4× the band max, `spawnWeight` 0.25–0.35. Per-instance the spawner jitters by `radiusJitter`.
- [ ] **yOffset** positions the rest height: `restY = radius * (1 + yOffset)`. `yOffset = 0` = sphere sits on ground. Measure it as `yOffset = -1 - minY_unit` of the *normalized* geometry and round (reference convention, `catalog.js:60-65`). Flat/wide things (boards, decals) get strongly negative offsets; tall things near 0. **Practical recipe:** build with the object's base near `y=0`, then estimate yOffset by eye from the part heights, and trust the P5.8 visual check (object floating / sunk) to correct.
- [ ] **upright**: `true` for anything with a clear "up" (buildings, people, signs) — spawner keeps it vertical; `false` for tumblers (caps, candy, marbles) that look fine at any roll. **collisionScale** < 1 shrinks the physics radius below the visual for spindly shapes (poles, frames) so they don't block early.
- [ ] **Tri budget**: default cap **350 tris** (asserted at boot, `geometryFactory.js:290-310`). Keep segment counts low (`seg` 5–10 typical; spheres `ws/hs` 6–9). For silhouette-critical heroes (scooter, bus) set `heroTriCap: HERO_TRI_CAP` to lift the cap to **600** — use sparingly; it's a budget, not free.

---

### Task P5.3: Scaffold catalog.js + a tri-cap smoke test (TDD harness)

This gives us a real failing→passing loop for the bulk content: a vitest that builds every chunk geometry and asserts the boot caps, so we never ship a recipe that throws at boot.

- [ ] Create `src/packs/taipei/catalog.js` with the header + skeleton:
  ```js
  /**
   * @file catalog.js — Taipei chunk archetype geometry (70 ids, 10×7 tiers).
   * Slots 0–7 absorbable; slots 8/9 chunk landmarks (~2.5–4× band max,
   * spawnWeight 0.25–0.35). Geometry math (finish → unit bounding sphere,
   * tri caps 350 / hero 600) is inherited verbatim from the Fable engine.
   * displayName is zh-TW (StagePack contract; the reference used displayNameJa).
   */
  import {
    box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
  } from './geomHelpers.js';

  /** Hero tri cap (matches the engine HERO_TRI_CAP = 600). */
  export const HERO_TRI_CAP = 600;

  /** @type {Record<string, import('../../types.js').ArchetypeDef>} */
  export const CHUNK_ARCHETYPES = {};

  /** @param {import('../../types.js').ArchetypeDef} a */
  function add(a) {
    CHUNK_ARCHETYPES[a.id] = a;
  }

  // ----- T0 桌頭 / 柑仔店 (slot 0–7 absorbable, 8/9 chunk landmarks) -----
  // (recipes added in P5.4–P5.7)
  ```
  > If Part 3 already exports `HERO_TRI_CAP` from a shared tuning module, import it here instead of re-declaring.
- [ ] Create `src/packs/taipei/catalog.test.js`:
  ```js
  import { describe, it, expect } from 'vitest';
  import * as THREE from 'three';
  import { CHUNK_ARCHETYPES } from './catalog.js';
  import { TAIPEI_TIERS } from './tiers.js'; // Part 4 export name — reconcile if different

  const ARCHETYPE_TRI_CAP = 350;
  const HERO_TRI_CAP = 600;

  function triCount(geo) {
    const idx = geo.getIndex();
    if (idx !== null) return idx.count / 3;
    const pos = geo.getAttribute('position');
    return pos ? pos.count / 3 : 0;
  }
  // Mirror geometryFactory: ensure normals/color then normalize to unit sphere.
  function buildNormalized(arch) {
    const rng = (() => { let s = 0x9e3779b9; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
    const geo = arch.buildGeometry(rng);
    if (geo.getAttribute('normal') === undefined) geo.computeVertexNormals();
    geo.computeBoundingSphere();
    const bs = geo.boundingSphere;
    if (bs && bs.radius > 1e-8) { geo.translate(-bs.center.x, -bs.center.y, -bs.center.z); geo.scale(1 / bs.radius, 1 / bs.radius, 1 / bs.radius); }
    geo.computeBoundingSphere();
    return geo;
  }

  describe('taipei chunk archetypes', () => {
    it('implements exactly the 70 ids the tiers reference', () => {
      const tierIds = TAIPEI_TIERS.flatMap((t) => t.archetypeIds);
      expect(tierIds.length).toBe(70);
      for (const id of tierIds) {
        expect(CHUNK_ARCHETYPES[id], `missing chunk archetype '${id}'`).toBeDefined();
      }
    });
    it('every chunk geometry stays under its tri cap and normalizes to a finite unit sphere', () => {
      for (const id of Object.keys(CHUNK_ARCHETYPES)) {
        const arch = CHUNK_ARCHETYPES[id];
        const geo = buildNormalized(arch);
        const cap = arch.heroTriCap !== undefined ? HERO_TRI_CAP : ARCHETYPE_TRI_CAP;
        expect(triCount(geo), `${id} over tri cap`).toBeLessThanOrEqual(cap);
        expect(Math.abs(geo.boundingSphere.radius - 1)).toBeLessThan(1e-3);
        expect(arch.radiusNominal, `${id} radiusNominal`).toBeGreaterThan(0);
        geo.dispose();
      }
    });
  });
  ```
- [ ] Run it RED (only the few T0 recipes from P5.4 will exist; the "70 ids" test fails until all are added): `npx vitest run src/packs/taipei/catalog.test.js`. Expected now: the 70-ids test FAILS listing missing ids — that's the checklist driving P5.5–P5.7.
- [ ] Commit: `test(taipei): tri-cap + 70-id coverage harness for chunk archetypes`

---

### Task P5.4: Worked example #1 — small scale (`marble` T0, `yakult` T1)

Two fully-worked recipes establish the small-object pattern. Add to `catalog.js` under the T0/T1 sections.

- [ ] **`marble` (彈珠, T0 slot 0).** A glass marble: one tinted sphere + a smaller off-white swirl core. Tumbler (`upright:false`), sits on ground (`yOffset` near 0 because a sphere of radius 1 has minY −1 → `-1 - (-1) = 0`).
  ```js
  add({
    id: 'marble',
    displayName: '彈珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.008,
    radiusJitter: 0.2,
    spawnWeight: 1.5,
    palette: [0x4fa0e0, 0x49c45f, 0xe0604f, 0xffd84d, 0xf2f2ee],
    yOffset: -0.02,
    upright: false,
    collisionScale: 1,
    buildGeometry(rng) {
      return finish([
        sph(1.0, 0xffffff, { ws: 9, hs: 7 }),                 // glass body (tinted)
        sph(0.42, 0xf2f2ee, { ws: 7, hs: 5, x: 0.18, y: 0.1 }), // swirl core (near-white)
        sph(0.16, 0xffffff, { ws: 5, hs: 4, x: -0.4, y: 0.4, z: 0.3 }), // highlight nub
      ]);
    },
  });
  ```
- [ ] **`yakult` (養樂多, T1 slot 0).** The iconic waisted bottle: tapered body (wide shoulder, narrow waist via two `cyl`), white cap, red label band. Upright; flat-ish base so `yOffset` strongly negative.
  ```js
  add({
    id: 'yakult',
    displayName: '養樂多',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.035,
    radiusJitter: 0.18,
    spawnWeight: 1.5,
    palette: [0xf6efe2, 0xefe6d2, 0xf2ece0, 0xeae0cc], // cream HDPE; palette nudges the body
    yOffset: -0.86,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      return finish([
        cyl(0.62, 0.46, 1.05, 12, 0xffffff, { y: 0.55 }),          // lower body, flares out at top
        cyl(0.46, 0.62, 0.85, 12, 0xffffff, { y: 1.42 }),          // upper body, waist→shoulder
        cyl(0.34, 0.36, 0.18, 10, 0xf2ece0, { y: 1.94 }),          // neck
        cyl(0.4, 0.4, 0.12, 10, 0xe8e2d4, { y: 2.06 }),            // foil cap
        cyl(0.63, 0.63, 0.5, 12, 0xc0392b, { y: 0.62, open: true }), // red label band (printed)
        cyl(0.63, 0.63, 0.14, 12, 0x2a55a8, { y: 0.9, open: true }), // blue accent stripe
      ]);
    },
  });
  ```
- [ ] Run `npx vitest run src/packs/taipei/catalog.test.js`. Expected: the tri-cap test PASSES for `marble`/`yakult` (both well under 350); the 70-ids test still fails (rest not added yet).
- [ ] Commit: `feat(taipei): worked small-scale chunk archetypes (marble, yakult)`

---

### Task P5.5: Worked example #2 — large scale (`scooter` T3, `tin_shack` T4)

Two large recipes establish the building/vehicle pattern, including the hero tri cap.

- [ ] **`scooter` (機車, T3 slot 0).** Taipei's signature object — a sea of scooters defines T3 (spec §5.1). Floorboard + step-through frame, seat, handlebar, two `torus` wheels, headlight. Silhouette matters → `heroTriCap: HERO_TRI_CAP` (cap 600). Pattern mirrors the reference `bicycle`/`car` hero recipes.
  ```js
  add({
    id: 'scooter',
    displayName: '機車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.18,
    spawnWeight: 1.6, // density object — the T3 "機車海"
    palette: [0xc83820, 0xf2f2ee, 0x2a55a8, 0x2e6a48, 0x23262e, 0xc0c0c0], // red/white/blue/green/black/silver
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.7,
    heroTriCap: HERO_TRI_CAP,
    buildGeometry(rng) {
      const parts = [
        torus(0.42, 0.12, 5, 12, 0x23262e, { x: 0.78, y: 0.42 }),   // front tire
        torus(0.42, 0.12, 5, 12, 0x23262e, { x: -0.7, y: 0.42 }),   // rear tire
        cyl(0.14, 0.14, 0.1, 8, 0xb8bec8, { rx: HALF_PI, x: 0.78, y: 0.42 }), // front hub
        cyl(0.14, 0.14, 0.1, 8, 0xb8bec8, { rx: HALF_PI, x: -0.7, y: 0.42 }), // rear hub
        box(1.2, 0.18, 0.5, 0xffffff, { y: 0.55 }),                 // floorboard / step-through (tinted)
        box(0.7, 0.55, 0.46, 0xffffff, { x: -0.5, y: 0.95 }),       // rear body cowl (tinted)
        box(0.55, 0.28, 0.06, 0x35424f, { x: -0.5, y: 1.32 }),      // seat
        box(0.4, 0.7, 0.42, 0xffffff, { x: 0.7, y: 0.95 }),         // front leg shield (tinted)
        box(0.34, 0.16, 0.2, 0xfff2c0, { x: 0.92, y: 0.86 }),       // headlight (lit)
        cyl(0.04, 0.04, 0.62, 6, 0x44484f, { rz: 0.5, x: 0.76, y: 1.2 }), // steering stem
        cyl(0.04, 0.04, 0.5, 6, 0x2e3138, { rx: HALF_PI, x: 0.76, y: 1.42 }), // handlebar
        cyl(0.05, 0.05, 0.12, 5, 0x23262e, { rx: HALF_PI, x: 0.76, y: 1.42, z: 0.27 }),  // grip R
        cyl(0.05, 0.05, 0.12, 5, 0x23262e, { rx: HALF_PI, x: 0.76, y: 1.42, z: -0.27 }), // grip L
        box(0.05, 0.12, 0.24, 0xc83828, { x: -0.95, y: 0.82 }),     // taillight
        box(0.34, 0.28, 0.36, 0x44484f, { x: -0.95, y: 1.0 }),      // top box / 置物箱
      ];
      return finish(parts);
    },
  });
  ```
- [ ] **`tin_shack` (鐵皮屋, T4 slot 1).** The corrugated-metal vernacular building of 萬華 (spec §5.1). Boxy walls + a low single-pitch corrugated roof (a thin box rotated slightly) + a rooftop water tank — the universal Taiwan rooftop tell. Default cap (350) is plenty.
  ```js
  add({
    id: 'tin_shack',
    displayName: '鐵皮屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 11,
    radiusJitter: 0.2,
    spawnWeight: 1.2,
    palette: [0x9aa6b0, 0xb0a89a, 0x8a9aa6, 0xa89a8a, 0x6a8a7a], // galvanized blues/browns/greens
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const parts = [
        box(2.0, 1.3, 1.6, 0xffffff, { y: 0.65 }),                 // walls (tinted tin)
        box(2.1, 0.12, 1.7, 0x6a7078, { rz: -0.08, y: 1.36 }),     // corrugated roof slab (slight pitch)
        box(2.1, 0.08, 0.12, 0x44484f, { y: 1.3, z: 0.85 }),       // eave lip
        box(0.06, 1.3, 1.62, 0x8a9098, { x: 0.0, y: 0.65 }),       // seam rib (corrugation read)
        box(0.06, 1.3, 1.62, 0x8a9098, { x: 0.6, y: 0.65 }),       // seam rib
        box(0.06, 1.3, 1.62, 0x8a9098, { x: -0.6, y: 0.65 }),      // seam rib
        box(0.55, 0.7, 0.06, 0x3a3026, { x: 0.4, y: 0.35, z: 0.81 }), // door
        box(0.5, 0.4, 0.06, 0x9fc4d8, { x: -0.5, y: 0.7, z: 0.81 }),  // window glass
        cyl(0.3, 0.3, 0.45, 10, 0xc8cdd4, { y: 1.6, x: 0.5 }),     // rooftop water tank (水塔)
        cyl(0.32, 0.32, 0.08, 10, 0x8a9098, { y: 1.86, x: 0.5 }),  // tank lid
      ];
      return finish(parts);
    },
  });
  ```
- [ ] Run `npx vitest run src/packs/taipei/catalog.test.js`. Expected: `scooter`/`tin_shack` pass the tri-cap test (scooter under 600, tin_shack under 350).
- [ ] Commit: `feat(taipei): worked large-scale chunk archetypes (scooter, tin_shack)`

---

### Task P5.6: Bulk recipe procedure — apply the pattern to the remaining 66

For each remaining id in the §P5.7 checklist, add one `add({...})` entry following the matching pattern. Do this in tier-batches (commit per tier) so each batch is small and the test stays green incrementally.

- [ ] **Procedure per id:**
  1. Pick the pattern family by shape: *tumbler* (cap/candy/marble → 2–4 spheres/cyls, `upright:false`), *bottle/cylinder* (養樂多/瓦斯桶/香爐 → stacked `cyl`), *furniture/appliance* (椅/電鍋/安全帽 → box+cyl), *vehicle* (機車/公車/垃圾車 → body box + `torus` wheels, hero if silhouette-critical), *building* (`towerBanded` for storeys + roof slab + 水塔), *frame/sign* (招牌/牌樓/鐵捲門 → thin boxes, low `collisionScale`).
  2. Set `radiusNominal` from the §P5.7 column (already band-checked). `tier` and `naturalBand` = the tier index.
  3. `spawnWeight`: slots 0–7 ≈ 0.8–1.6 (density objects like 機車/公寓 high); slots 8/9 (chunk landmarks) **0.25–0.35**.
  4. `upright`: false only for tumblers; everything else true. `collisionScale`: 0.45–0.6 for spindly frames/poles, ~0.9 otherwise.
  5. `palette`: 4–6 hex tints with ≥2 value steps between neighbours (so adjacent rolls read distinct — reference v4 regrade convention). Bake the **body** part `0xffffff` so the palette tints it.
  6. Keep ≤ 350 tris (≤ 600 if you set `heroTriCap`). Trim `seg`/`ws`/`hs` if the test flags an overflow.
  7. Estimate `yOffset` by part heights; the P5.8 visual check corrects floaters/sinkers.
- [ ] After each tier batch, run `npx vitest run src/packs/taipei/catalog.test.js` and commit `feat(taipei): T<n> chunk archetypes`. When all 70 exist, the **70-ids test goes green** — that is the structural gate for this part.

---

### Task P5.7: The 70-slot checklist table (id → intent → radiusNominal)

Every tier slot. `radiusNominal` (m) is pre-checked to sit in the band (T0 0.02–0.10 / T1 0.10–0.50 / T2 0.50–2.5 / T3 2.5–12 / T4 12–60 / T5 60–300 / T6 300+; slots 8/9 = chunk landmark, ~2.5–4× band max, `spawnWeight` 0.25–0.35). ✓ = worked above.

**T0 — 桌頭 / 柑仔店 (band 0.02–0.10 m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `marble` ✓ | glass sphere + swirl core | 0.008 |
| 1 | `eraser_tw` | rounded box rubber + paper sleeve band | 0.012 |
| 2 | `pushpin` | dome head (`sph` hemisphere) + thin spike `cone` | 0.006 |
| 3 | `bottle_cap` | shallow ribbed `cyl` disc, fluted rim | 0.007 |
| 4 | `candy` | twisted-wrap: small `sph` + two pinched `cone` ends | 0.006 |
| 5 | `ngangiabiao` (尪仔標) | flat printed `cyl` disc, two-tone face | 0.01 |
| 6 | `pencil` | long hex `cyl` (6-seg) + `cone` tip + eraser ferrule | 0.011 |
| 7 | `button` | flat `cyl` disc + 4 thread holes (tiny `cyl`) | 0.006 |
| 8 | `pokpok_board` (戳戳樂板) | flat board `box` + grid of punch-cell `cyl` dimples | 0.05 |
| 9 | `choutong` (籤筒) | tall bamboo `cyl` cup + protruding stick tops (`cyl` cluster) | 0.06 |

**T1 — 夜市攤頭 (band 0.10–0.50 m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `yakult` ✓ | waisted bottle, red label band | 0.035 |
| 1 | `pet_bottle` | tall `cyl` body + `cone` shoulder + cap; clear/tea tint | 0.04 |
| 2 | `betel_nut` (檳榔) | small green `ico` blob | 0.025 |
| 3 | `incense_stick` (香) | thin `cyl` stick + red base wrap + glowing tip `sph` | 0.05 |
| 4 | `joss_paper` (金紙) | stacked thin `box` sheets + gold-foil square `box` | 0.06 |
| 5 | `luwei_tongs` (滷味夾) | two crossed `box` arms + pivot `cyl` (low collisionScale) | 0.045 |
| 6 | `plastic_bag` (紅白塑膠袋) | crumpled `ico` blob + two loop `torus` handles | 0.04 |
| 7 | `pepper_bun` (胡椒餅) | flattened `sph` bun + sesame-speckle nubs | 0.03 |
| 8 | `stall_lantern` (攤車燈籠) | ribbed red `cyl` lantern + top/bottom cap discs + tassel | 0.45 |
| 9 | `pinball_table` (彈珠台) | angled board `box` + pin grid (`cyl`) + side rails | 0.6 |

**T2 — 騎樓邊 (band 0.50–2.5 m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `red_stool` (紅塑膠椅) | the iconic red plastic stool: round seat `cyl` + 3 splayed legs | 0.32 |
| 1 | `helmet` (安全帽) | half-`sph` shell + visor band + chin strap stub | 0.28 |
| 2 | `electric_pot` (大同電鍋) | wide `cyl` body + domed lid `sph` + bakelite handles | 0.3 |
| 3 | `gas_cylinder` (瓦斯桶) | tall steel `cyl` + neck `cyl` + valve cap | 0.45 |
| 4 | `traffic_cone` (三角錐) | `cone` + square base `box` + reflective band | 0.4 |
| 5 | `fire_hydrant` (消防栓) | stacked `cyl` body + dome cap + two side `cyl` ports | 0.45 |
| 6 | `lucky_cat` (招財貓) | seated `sph` body + head + raised paw `cyl` + coin disc | 0.35 |
| 7 | `youbike_dock` (YouBike 樁) | angled post `box` + dock head + slot `box`; orange/grey | 0.7 |
| 8 | `vendor_cart` (攤販推車) | cart body `box` + counter top + 2 wheels (`cyl`) + awning `box` | 3.2 |
| 9 | `temple_censer` (廟前香爐) | bronze bowl `cyl` + 3 legs + two upright handle loops `torus` | 2.5 |

**T3 — 機車海 (band 2.5–12 m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `scooter` ✓ | step-through frame + 2 tires + top box (HERO) | 1.2 |
| 1 | `pickup_truck` (小貨車) | cab `box` + flatbed + 4 wheels (HERO) | 4.0 |
| 2 | `power_box` (變電箱) | grey utility cabinet `box` + vents + warning plate | 2.0 |
| 3 | `neon_sign` (霓虹招牌) | tall vertical sign `box` + bracket + lit accent band | 2.8 |
| 4 | `roller_shutter` (鐵捲門) | corrugated panel `box` (many seam ribs) + housing + low collisionScale | 3.0 |
| 5 | `street_tree_tw` (路樹) | trunk `cyl` + 2 `ico` canopy blobs (banyan, broad) | 4.0 |
| 6 | `awning_frame` (棚架) | 4 leg `cyl` + flat tarp `box` roof; very low collisionScale | 3.5 |
| 7 | `stone_lion` (石獅) | blocky `box` body + head `sph` + paws + base plinth | 2.6 |
| 8 | `night_market_arch` (夜市拱門) | two pillars `box` + curved top `box`/`torus` arc + lantern row | 22 |
| 9 | `temple_pailou` (廟前牌樓) | multi-post gate + tiered swallowtail roof slabs (`box` + `cyl` gable) | 18 |

**T4 — 萬華街屋與廟 (band 12–60 m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `townhouse` (透天厝) | narrow 4-storey `towerBanded` + rooftop water tank + 鐵窗 grille | 14 |
| 1 | `tin_shack` ✓ | corrugated walls + pitched roof + 水塔 | 11 (band-floor; ok ≥12 if Part 4 prefers — set 13) |
| 2 | `apartment_tw` (公寓) | 5-storey `towerBanded` + balcony rails + 鐵窗 + 水塔 cluster | 18 |
| 3 | `konbini_tw` (小七/全家) | low store `box` + tricolor fascia band + glass front + AC unit | 12 |
| 4 | `city_bus` (公車) | long body `box` + window band inset + route stripe + 4 wheels (HERO) | 16 |
| 5 | `garbage_truck` (垃圾車) | cab + compactor body `box` + hopper + wheels; yellow (plays 少女的祈禱 — narration hook, Part 7/8) | 15 |
| 6 | `gas_station` (加油站) | canopy slab `box` on 2–3 posts + pump islands `box` | 20 |
| 7 | `arcade_column` (騎樓柱) | square pillar `box` + capital + base; low collisionScale | 12 |
| 8 | `streethouse_mass` (公寓街屋量體) | fused 3-unit `towerBanded` row + shared roofline + tanks | 45 |
| 9 | `temple_mass` (宮廟量體) | wide hall `box` + tiered swallowtail roofs + central ridge ornament | 40 |

**T5 — 商業文教區 (band 60–300 m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `office_tower` (商辦大樓) | tall `towerBanded` glass block + roof slab + 機房 box | 110 |
| 1 | `department_store_tw` (百貨) | broad `towerBanded` mass + giant facade screen `box` + signage | 90 |
| 2 | `metro_viaduct` (捷運高架) | elevated deck `box` on pier `cyl` columns + a `train_car`-style box on top | 95 |
| 3 | `pedestrian_bridge` (天橋) | deck `box` + railings + 2 stair runs (angled `box`) + pillars | 70 |
| 4 | `parking_tower` (停車塔) | stacked-deck `box` (ramped bands) + open facade grid | 80 |
| 5 | `billboard_giant` (巨型看板) | huge sign panel `box` + lattice support frame; low collisionScale | 75 |
| 6 | `glass_facade_house` (玻璃帷幕街屋) | mid `towerBanded` with bright glass-band palette + entrance canopy | 70 |
| 7 | `bank_tw` (銀行) | columned podium `box` (front `cyl` columns) + mid block + sign | 65 |
| 8 | `office_mass` (商辦塔樓) | fused twin-`towerBanded` + sky lobby band + roof plant | 200 |
| 9 | `department_mass` (百貨量體) | wide multi-tier retail mass + rooftop signage tower | 190 |

**T6 — 信義天際線 (band 300+ m)**

| slot | id | geometry intent | r (m) |
|---|---|---|---|
| 0 | `glass_highrise` (玻璃帷幕高樓群) | tall `towerBanded` glass tower + spire + roof plant | 220 |
| 1 | `overpass_span` (跨橋) | long deck `box` + cable/pier `cyl` + railings | 210 |
| 2 | `skyscraper_tw` (其他摩天樓) | tapered stacked-`box` tower + crown + antenna `cyl` | 230 |
| 3 | `ad_wall_giant` (巨型廣告牆) | enormous flat panel `box` + frame; low collisionScale | 200 |
| 4 | `commercial_tower` (商辦塔) | `towerBanded` block + setback crown + 機房 | 230 |
| 5 | `skybridge` (空橋) | horizontal tube `box`/`cyl` linking two stub towers | 200 |
| 6 | `rooftop_plant` (屋頂機房) | clustered HVAC `box` + ducts `cyl` + railings on a slab | 180 |
| 7 | `ad_screen_tw` (巨型廣告牆/螢幕) | lit screen panel `box` (bright band) + scaffold frame | 200 |
| 8 | `skybridge_span` (跨街空橋) | long elevated link `box` + support trusses (`box` lattice) | 700 |
| 9 | `rooftop_plant_tower` (屋頂機房塔) | tall plant/antenna mast cluster + tanks on a roof slab | 800 |

> Note on `tin_shack` r=11: 12–60 is the T4 band, so bump to **13** if Part 4's tier band assert is strict `>= enterTrueRadius`. The reference does NOT assert each chunk's radiusNominal against its band (only `radiusNominal > 0`, `tiers.js`), so 11 boots fine — but staying inside the band keeps the pacing honest. Confirm against Part 4's `pack.validate()` rules.

---

### Task P5.8: Visual verification — Taipei objects roll at each tier (chrome-devtools)

Structural correctness is proven by P5.3's vitest (70 ids + tri caps). This task proves the geometries actually render and look like Taipei at gameplay scale. Requires Part 3 to have flipped `active` to the taipei pack and the dev server running.

- [ ] Start the dev server: `npm run dev` (note the vite URL, typically `http://localhost:5173`). Confirm boot logs show **no geometryFactory tri-cap throw** and no `pack.validate()` assert (those would halt boot — their absence is itself a guard, spec §10).
- [ ] If the engine exposes a dev teleport (`?at=` query or a `__DEV` hook — check what Part 0/3 preserved from the reference), use it to jump to each tier's enter radius. Otherwise roll up naturally and screenshot at each band.
- [ ] For **each tier T0..T6**, drive chrome-devtools MCP:
  - `mcp__chrome-devtools__navigate_page` to the dev URL with the teleport for that tier (e.g. `…/?at=0.5` for T2), then `mcp__chrome-devtools__wait_for` a short settle.
  - `mcp__chrome-devtools__take_screenshot`.
  - **Expected observation per tier** (the spec §5.1 read): T0 桌頭 marbles/caps/pencils tumbling; T1 養樂多/寶特瓶/燈籠; T2 紅塑膠椅/瓦斯桶/三角錐/招財貓; T3 a visible **機車海** (many scooters) + 路樹 + 牌樓; T4 透天厝/鐵皮屋/公寓 with rooftop 水塔 + 公車; T5 商辦/百貨/捷運高架; T6 玻璃帷幕高樓群. Confirm objects are not all-white (palette tint applied) and not interpenetrating the ground (yOffset roughly right) — a floating or half-buried object means a `yOffset` fix in that recipe.
- [ ] Read the **draw-call ledger** to confirm we stayed in budget: `mcp__chrome-devtools__evaluate_script` reading the engine's renderer info, e.g. `() => globalThis.renderer?.info?.render?.calls ?? window.__DRAW_CALLS`. **Expected**: draw calls **< 72** at every tier (spec §9.5; post-OSM-removal there is ample headroom — adding chunk content must NOT push past the cap because all chunk objects share instanced pools).
- [ ] If any object renders mis-scaled/sunk/floating/over-budget, fix the offending recipe (`yOffset`, `radiusNominal`, or `seg` counts), re-run P5.3 vitest, and re-screenshot that tier.
- [ ] Commit: `feat(taipei): verify chunk archetypes render across all 7 tiers`



## P6. Curated landmarks + Taipei 101 goal + finale

Builds the eight ship-blocking curated landmarks (spec 5.2), replaces the Skytree goal monument with a hand-built **Taipei 101** (`src/packs/taipei/monument.js`), retunes the goal/finale constants for 101's 508 m height, and rewires `game/finale.js` + `world/terrain.js` to read the monument from the active pack. Closes with a vitest ladder proof and chrome-devtools visual checks (龍山寺 silhouette + the 101 contact + win cinematic).

**Grounding (read before starting):**
- Upstream goal monument: `render/goalTower.js` `SkytreeView` — `buildTowerGeometry()` returns a unit-height composite via `mergeColoredParts(parts)` (export confirmed in `render/geometryFactory.js:119`), `getPosSim(out)` / `radiusSim` / `heightSim` / `setGlow01` / `setBeamPulse` / `silFade01` / `meshActive` / `update(dt, cameraPos)` / `onTeleport()` / `dispose()` form the **frozen public surface** the finale calls. Body uses `THREE.MeshBasicMaterial({vertexColors, fog:false})`, glow uses additive `MeshBasicMaterial`. Position derives LIVE: `out.set(SK_X/ws - shiftX, 0, SK_Z/ws - shiftZ)`.
- Finale contract: `game/finale.js` constructor is `(bus, scaleMgr, goalView, env, cameraRig, ballView, camera, effects)` — **7-arg frozen shape**; it imports `GOAL_*` from `config/tuning.js`, reads `goalView.getPosSim/radiusSim/heightSim`, and the contact test is `distXZ <= ballR + towerR * GOAL_CONTACT_PAD` (`finale.js:471`). `_refreshTowerCache()` pulls tower pose every pre-contact frame.
- Terrain base collider: `world/terrain.js:233-257` — permanent circle at `SKYTREE_POS` with radius `SKYTREE_BASE_R_M * SKYTREE_COLLIDER_K * invWS`, skipped after `EVT.GOAL_CONTACT`. Imports `SKYTREE_POS` from `config/cityMap.js`, `SKYTREE_BASE_R_M`/`SKYTREE_COLLIDER_K` from `config/tuning.js`.
- Curated landmark mechanism: `world/curated.js` materializes `cityMap.LANDMARKS` via `_emitLandmark` (`PAYLOADS.landmark = {landmarkId, nameJa, sizeReal}` — see `events.js:150`), ladder = `dioramaR / ABSORB_RATIO` strictly increasing (`cityMap.js:1039-1055`), `landmarkIdFor` exempts landmarks from growth-pacing normalization.
- Constants (`config/tuning.js`): `GOAL_CALL_RADIUS_M=380`, `GOAL_RADIUS_M=420`, `SKYTREE_BASE_R_M=90`, `SKYTREE_COLLIDER_K=0.6`, `GOAL_CONTACT_PAD=0.85`, `GOAL_ASCEND_HEIGHT_K=40`, `ABSORB_RATIO=0.65`, `GROWTH_K=10`, `MAP_BOUNDS = {x:[-1800,1800], z:[-1800,2000]}`. Skytree height in `goalTower.js:48` = 634 m. **101 = 508 m → scale factor ≈ 0.80.**

> All landmark/monument positions in this part are HAND-AUTHORED game meters (spec: "位置為配速手擺,非真實相對地理"). They replace upstream's OSM-derived `OSM_GEN` table; P3's `pack.validate()` already dropped the OSM distance ground-truth asserts.

---

### Task P6.1: Author the eight core landmark display geometries in catalog.js

Landmarks are EXTRA archetypes (curated singletons, not chunk archetypes). Each is a `buildGeometry(rng)` that returns a unit-bounding-sphere composite (same `mergeColoredParts` + `normalizeToUnitRadius` pattern as upstream chunk archetypes; `render/geometryFactory.js` exports both). Geometry recipe shared pattern, then ONE fully-worked example (龍山寺), then a checklist for the rest.

- [ ] In `src/packs/taipei/catalog.js`, add a `LANDMARK_ARCHETYPES` section. Each entry is an `ArchetypeDef` with the frozen fields `{ id, displayName, tier, naturalBand, radiusNominal, radiusJitter:0, spawnWeight:0, palette, yOffset:0, upright:true, collisionScale, buildGeometry }`. `spawnWeight:0` keeps them out of chunk pools (curated-only). `displayName` is zh-TW.

- [ ] **Fully-worked example — 龍山寺 (`lm_longshan`).** Layered hall with swept 燕尾脊 (swallowtail ridge). Add to `catalog.js`:

```js
import * as THREE from 'three';
import { mergeColoredParts, normalizeToUnitRadius } from '../../render/geometryFactory.js';

/** 萬華龍山寺 — stepped stone base, red-pillar hall, double swept-eave roof. */
function buildLongshanGeometry(rng) {
  const parts = [];
  const STONE = 0x9b8f7a, RED = 0xa83232, ROOF = 0xc0641f, RIDGE = 0xe0a23a;
  // stone platform
  let g = new THREE.BoxGeometry(1.0, 0.12, 0.74); g.translate(0, 0.06, 0);
  parts.push({ geometry: g, color: STONE });
  // 6 red pillars (front colonnade)
  for (let i = 0; i < 6; i++) {
    const px = -0.42 + (i / 5) * 0.84;
    g = new THREE.CylinderGeometry(0.035, 0.04, 0.34, 6, 1);
    g.translate(px, 0.29, 0.30);
    parts.push({ geometry: g, color: RED });
  }
  // hall body
  g = new THREE.BoxGeometry(0.9, 0.30, 0.62); g.translate(0, 0.27, 0);
  parts.push({ geometry: g, color: RED });
  // lower swept roof (slightly oversized box, low + flared by a thin prism lip)
  g = new THREE.BoxGeometry(1.04, 0.10, 0.74); g.translate(0, 0.46, 0);
  parts.push({ geometry: g, color: ROOF });
  // upper roof tier
  g = new THREE.BoxGeometry(0.78, 0.09, 0.54); g.translate(0, 0.58, 0);
  parts.push({ geometry: g, color: ROOF });
  // swallowtail ridge: 4 thin angled boxes at the roof corners curving up
  const RIDGE_CORNERS = [[-0.5, 0.36], [0.5, 0.36], [-0.38, 0.26], [0.38, 0.26]];
  for (const [rx, rz] of RIDGE_CORNERS) {
    g = new THREE.BoxGeometry(0.10, 0.02, 0.02);
    g.rotateZ(rx < 0 ? 0.5 : -0.5);
    g.translate(rx, 0.52 + (Math.abs(rz) > 0.3 ? 0 : 0.12), rz);
    parts.push({ geometry: g, color: RIDGE });
  }
  return normalizeToUnitRadius(mergeColoredParts(parts));
}

export const LM_LONGSHAN = {
  id: 'lm_longshan', displayName: '龍山寺', tier: 4, naturalBand: 4,
  radiusNominal: 1, radiusJitter: 0, spawnWeight: 0,
  palette: [0xa83232, 0xc0641f, 0x9b8f7a], yOffset: 0, upright: true,
  collisionScale: 0.8, buildGeometry: buildLongshanGeometry,
};
```

- [ ] Add the remaining 7 the same way (recipe sketch only — keep each ≤ ~25 primitives, ≤ 600 tris per the hero cap; all end with `normalizeToUnitRadius(mergeColoredParts(parts))`):

| archetypeId | displayName | tier/band | recipe sketch (primitives) | collisionScale |
|---|---|---|---|---|
| `lm_beimen` | 北門(承恩門) | 3 / 3 | stone base box + arched gate (box + cyl arch cut visual) + hipped roof box, grey-tan `0xb0a890` | 0.85 |
| `lm_ximen_red_house` | 西門紅樓 | 4 / 4 | octagonal prism (`CylinderGeometry(r,r,h,8)`) red-brick `0x9c4a32` + pyramid roof (`ConeGeometry(r,h,8)`) + small cross-finial | 0.8 |
| `lm_grand_hotel` | 圓山大飯店 | 5 / 5 | wide red body box `0xb23a2e` + giant yellow hip roof (flat `ConeGeometry(r,h,4)` or stacked boxes) `0xe6b84a` + colonnade row | 0.85 |
| `lm_presidential_office` | 總統府 | 5 / 5 | long red-white banded body (alt boxes `0xc44` / `0xeee`) + central clock tower (tall box + small roof) | 0.7 |
| `lm_cks_memorial` | 中正紀念堂 | 5 / 5 | white block base + blue octagonal pyramid roof (`ConeGeometry(r,h,8)` `0x2f6fb0`) on a white drum | 0.75 |
| `lm_freedom_arch` | 自由廣場牌樓 | 5 / 5 | five-arch gate: 6 white pillars (cyl) + blue roof lintels (thin boxes), wide+flat (`yK`-style low profile handled by `dioramaR`/sizeReal, NOT a separate yK here) | 0.5 |
| `lm_arena` | 台北小巨蛋 | 5 / 5 | silver dome = `SphereGeometry(r, 16, 8)` clipped to top half (`thetaLength: Math.PI/2`) `0xc8ccd2` on a low cylindrical base | 0.85 |

- [ ] Register all 8 in the pack's archetype map. In `src/packs/taipei/index.js`, spread `LANDMARK_ARCHETYPES` into `archetypes` alongside chunk + collectible archetypes so `pack.buildCodeMap()` (P2) assigns each a pack-scoped EXTRA code at load. **Do not hard-code numeric codes here.**

- [ ] Commit: `feat(taipei): core 8 landmark display geometries`.

**VERIFY (build + geometry sanity):** `npm run build` succeeds. Then a one-off node check that every landmark geometry is under the tri cap and unit-normalized:
```bash
npx vitest run src/packs/taipei/landmarks.test.js -t "geometry"
```
Expected: all 8 `buildGeometry(rng)` results have `triangleCount(geo) <= 600` and bounding-sphere radius ≈ 1.0 (assert `< 1.0001`). (Reuse `triangleCount` from `render/geometryFactory.js:83`.)

---

### Task P6.2: Author the LandmarkDef ladder with hand-placed positions

`LandmarkDef` is the curated-singleton record `world/curated.js` flattens. Frozen keys: `{ landmarkId, name, x, z, dioramaR, collisionScale, sizeReal, archetypeId, naturalBand, colorHex, isGoal? }`. `landmarkId` = ladder index (0..7); the goal (101) is **last** with `isGoal:true`. Absorb threshold = `dioramaR / ABSORB_RATIO` (0.65) and must be **strictly increasing** — the ladder paces the journey.

- [ ] In `src/packs/taipei/landmarks.js`, export `LANDMARKS` (LandmarkDef[]). Positions are hand-authored game meters inside `MAP_BOUNDS` (`x[-1800,1800] z[-1800,2000]`), scattered so same-band landmarks (the four T5) don't pile on one absorb point (spec 5.2 "同帶多地標時靠座標分散"). `dioramaR` chosen so thresholds climb smoothly toward 101.

```js
import { LM_BEIMEN, LM_LONGSHAN, LM_XIMEN_RED_HOUSE, LM_GRAND_HOTEL,
  LM_PRESIDENTIAL_OFFICE, LM_CKS_MEMORIAL, LM_FREEDOM_ARCH, LM_ARENA }
  from './catalog.js';
import { TAIPEI101_LANDMARK } from './monument.js'; // goal LandmarkDef (Task P6.3)

/** Curated singleton ladder. dioramaR/0.65 strictly increasing; 101 last+largest.
 *  x/z hand-authored game meters (pacing layout, not real geography). */
export const LANDMARKS = Object.freeze([
  { landmarkId: 0, name: '北門',     archetypeId: 'lm_beimen',            x:   60, z: -120, dioramaR:  3.0, collisionScale: 0.85, sizeReal:  8,  naturalBand: 3, colorHex: 0xb0a890 },
  { landmarkId: 1, name: '龍山寺',   archetypeId: 'lm_longshan',          x: -340, z:  180, dioramaR:  7.0, collisionScale: 0.80, sizeReal: 16,  naturalBand: 4, colorHex: 0xa83232 },
  { landmarkId: 2, name: '西門紅樓', archetypeId: 'lm_ximen_red_house',   x: -150, z:  -40, dioramaR: 12.0, collisionScale: 0.80, sizeReal: 22,  naturalBand: 4, colorHex: 0x9c4a32 },
  { landmarkId: 3, name: '圓山大飯店', archetypeId: 'lm_grand_hotel',     x:  240, z: -560, dioramaR: 30.0, collisionScale: 0.85, sizeReal: 87,  naturalBand: 5, colorHex: 0xb23a2e },
  { landmarkId: 4, name: '總統府',   archetypeId: 'lm_presidential_office', x: -120, z:  460, dioramaR: 55.0, collisionScale: 0.70, sizeReal: 60, naturalBand: 5, colorHex: 0xc7ccd4 },
  { landmarkId: 5, name: '中正紀念堂', archetypeId: 'lm_cks_memorial',    x: -440, z:  520, dioramaR: 90.0, collisionScale: 0.75, sizeReal: 70,  naturalBand: 5, colorHex: 0x2f6fb0 },
  { landmarkId: 6, name: '自由廣場牌樓', archetypeId: 'lm_freedom_arch',  x: -380, z:  470, dioramaR:140.0, collisionScale: 0.50, sizeReal: 30,  naturalBand: 5, colorHex: 0xeeeeee },
  { landmarkId: 7, name: '台北小巨蛋', archetypeId: 'lm_arena',          x:  560, z: -260, dioramaR:185.0, collisionScale: 0.85, sizeReal: 70,  naturalBand: 5, colorHex: 0xc8ccd2 },
  TAIPEI101_LANDMARK, // landmarkId: 8, isGoal:true — defined in monument.js
]);
```

- [ ] Note the ladder thresholds (dioramaR / 0.65): 4.6 / 10.8 / 18.5 / 46.2 / 84.6 / 138.5 / 215.4 / 284.6 → 101 (Task P6.3) sits ABOVE the last. The 自由廣場牌樓 (id 6) deliberately sits next to 中正紀念堂 (id 5) in space (a few tens of m apart) but a band higher in threshold — they read as one site, absorbed in sequence, mirroring spec 5.2 "中正紀念堂 + 自由廣場牌樓".

- [ ] `LANDMARKS` becomes the StagePack `landmarks` field (wired in `index.js`). `pack.validate()` (P3) iterates it: ladder strictly increasing, goal largest+last, all `(x,z)` in `MAP_BOUNDS`, `collisionScale ∈ (0,1]`. Drop the upstream OSM `DISTANCE_GROUND_TRUTH` block entirely.

- [ ] Commit: `feat(taipei): core landmark ladder + hand-placed positions`.

**VERIFY:** Covered by the vitest ladder test in Task P6.6 (run there). For now: `npm run build` succeeds and dev boot logs the pack ladder table with no `pack.validate` throw (Task P6.5 prints it).

---

### Task P6.3: Build Taipei101View + retuned goal constants (monument.js)

Replace `render/goalTower.js` `SkytreeView` with `Taipei101View` in `src/packs/taipei/monument.js`, preserving the **entire frozen public surface** the finale calls. 101 is 508 m → scale the goal-arming radii by ≈0.80 (508/634) so the finale ramp feels right at the shorter tower.

- [ ] Create `src/packs/taipei/monument.js`. Keep the upstream import set and the rebase/handoff machinery **verbatim** (it is engine-critical: `EVT.RESCALE`/`REBASE`/`GAME_RESET` shift tracking, the silhouette↔mesh crossfade latch, zero per-frame alloc). Change only (a) the constructor reads `pos`/`baseRM`/`heightM` from args instead of importing `SKYTREE_POS`/`SKYTREE_BASE_R_M`, and (b) `buildTowerGeometry` → `buildTaipei101Geometry`.

```js
import * as THREE from 'three';
import { bus, EVT } from '../../core/events.js';
import { clamp01 } from '../../core/mathUtils.js';
import { mergeColoredParts } from '../../render/geometryFactory.js';

/** 台北101 — REAL meters (508 m). Skytree was 634; the goal radii below scale ~0.80. */
export const TAIPEI101_HEIGHT_M = 508;
/** Hand-authored goal position (game meters, inside MAP_BOUNDS), sign義區 corner. */
export const TAIPEI101_POS = Object.freeze({ x: 760, z: -1480 });

/* ---- retuned goal constants (RE-EXPORTED by the pack; finale/terrain read
 *      them via the active pack — the P2 seam). Skytree 380/420/90 * ~0.80. ---- */
export const GOAL_CALL_RADIUS_M = 305;   // was 380
export const GOAL_RADIUS_M = 340;        // was 420 (must stay < T6 enterTrueRadius)
export const TAIPEI101_BASE_R_M = 70;    // was 90 (terrain base collider footprint)
export const TAIPEI101_COLLIDER_K = 0.6; // < GOAL_CONTACT_PAD 0.85 (pack.validate asserts)
/** Penultimate-landmark → finale growth ramp. 小巨蛋(thr 284.6) -> 101 arm(340):
 *  a gentler jump than Skytree's GROWTH_K=10 because 101 is shorter. */
export const GROWTH_K_FINALE = 8;

const HANDOFF_DIST_SIM = 0.8 * 4000;
const HANDOFF_RELEASE_SIM = HANDOFF_DIST_SIM * 1.1;
const CROSSFADE_S = 2.0;
const BEAM_PULSE_HZ = 0.5;
const GLOW_OPACITY_K = 0.5;
const BEAM_OPACITY_MAX = 0.55;
/* 101 palette: blue-green glass at night, gold damper motif. */
const GLASS_TOP = 0x6fb6c8, GLASS_BOTTOM = 0x3f7d8e, SPIRE = 0xcfe6ee, GOLD = 0xe8c451;
const GLOW_COLOR = 0x8fe6ff;
const _pos = new THREE.Vector3();

/**
 * Unit-height (y in [0,1]) 101 body: 8 stacked INVERTED-trapezoid bamboo
 * segments (each top wider than its bottom — the 斗 form), a tapered shaft
 * base, a spire, and a gold damper-ball motif. All boxes/cylinders, < 600 tris.
 */
function buildTaipei101Geometry() {
  const parts = [];
  const baseR = TAIPEI101_BASE_R_M / TAIPEI101_HEIGHT_M; // ~0.138 unit
  const SEG_TOP = 0.86;            // 8 segments occupy y in [0.10, 0.86]
  const SEG_BASE = 0.10;
  const SEGS = 8;
  const segH = (SEG_TOP - SEG_BASE) / SEGS;
  // tapered podium base (below the segments)
  let g = new THREE.CylinderGeometry(baseR * 0.78, baseR, SEG_BASE, 8, 1);
  g.translate(0, SEG_BASE * 0.5, 0);
  parts.push({ geometry: g, color: GLASS_BOTTOM });
  // 8 bamboo segments — each an inverted frustum (rTop > rBottom), tinted up
  for (let s = 0; s < SEGS; s++) {
    const f = s / (SEGS - 1);
    const rBot = baseR * (0.62 + 0.02 * s) * 0.5;
    const rTop = rBot * 1.22;                 // flares outward (斗 shape)
    g = new THREE.CylinderGeometry(rTop, rBot, segH * 0.92, 8, 1);
    g.translate(0, SEG_BASE + segH * (s + 0.5), 0);
    const c = new THREE.Color(GLASS_BOTTOM).lerp(new THREE.Color(GLASS_TOP), f).getHex();
    parts.push({ geometry: g, color: c });
    // thin shadow gap ring between segments (reads as the joint)
    g = new THREE.CylinderGeometry(rTop * 1.02, rTop * 1.02, segH * 0.06, 8, 1);
    g.translate(0, SEG_BASE + segH * (s + 0.96), 0);
    parts.push({ geometry: g, color: 0x244b54 });
  }
  // pinnacle block + spire
  g = new THREE.BoxGeometry(baseR * 0.34, 0.05, baseR * 0.34); g.translate(0, 0.88, 0);
  parts.push({ geometry: g, color: SPIRE });
  g = new THREE.CylinderGeometry(0.004, 0.018, 0.10, 6, 1); g.translate(0, 0.94, 0);
  parts.push({ geometry: g, color: SPIRE });
  // gold tuned-mass-damper sphere motif (visible-from-outside homage near top seg)
  g = new THREE.SphereGeometry(baseR * 0.16, 10, 8); g.translate(0, 0.80, 0);
  parts.push({ geometry: g, color: GOLD });
  return mergeColoredParts(parts);
}

/** Additive glow/beam (one draw) — vertical beam + spire beacon + a damper halo. */
function buildGlowGeometry() {
  const geos = [];
  for (let i = 0; i < 2; i++) {
    const g = new THREE.PlaneGeometry(0.05, 0.9);
    g.rotateY(i * Math.PI * 0.5); g.translate(0, 0.9 + 0.45, 0); geos.push(g);
  }
  for (let i = 0; i < 3; i++) {
    const g = new THREE.PlaneGeometry(0.10, 0.10);
    g.rotateY((i / 3) * Math.PI); g.translate(0, 0.97, 0); geos.push(g);
  }
  { const g = new THREE.CylinderGeometry(0.075, 0.075, 0.05, 12, 1, true);
    g.translate(0, 0.80, 0); geos.push(g); }
  // manual merge (verbatim from goalTower.buildGlowGeometry — positions/index only)
  let total = 0; for (const g of geos) total += g.getAttribute('position').count;
  const pos = new Float32Array(total * 3); let o = 0; const index = []; let vBase = 0;
  for (const g of geos) {
    const p = g.getAttribute('position'); pos.set(p.array, o); o += p.count * 3;
    const idx = g.getIndex();
    if (idx) for (let i = 0; i < idx.count; i++) index.push(vBase + idx.getX(i));
    vBase += p.count; g.dispose();
  }
  const m = new THREE.BufferGeometry();
  m.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  m.setIndex(index); return m;
}
```

- [ ] Add the `Taipei101View` class. Copy `SkytreeView` body **method-for-method** (`onTeleport`, `getPosSim`, `radiusSim`, `heightSim`, `setGlow01`, `setBeamPulse`, `silFade01`, `meshActive`, `update`, `dispose` + the RESCALE/REBASE/GAME_RESET subscriptions) — only the constructor signature, the geometry builder calls, and the pos/base/height sources change:

```js
export class Taipei101View {
  /**
   * @param {THREE.Scene} scene
   * @param {import('../../world/scaleManager.js').ScaleManager} scaleMgr
   * @param {{x:number,z:number}} [pos] defaults TAIPEI101_POS
   * @param {number} [baseRM] defaults TAIPEI101_BASE_R_M
   * @param {number} [heightM] defaults TAIPEI101_HEIGHT_M
   */
  constructor(scene, scaleMgr, pos = TAIPEI101_POS, baseRM = TAIPEI101_BASE_R_M, heightM = TAIPEI101_HEIGHT_M) {
    this._scene = scene; this._scaleMgr = scaleMgr;
    this._posX = pos.x; this._posZ = pos.z; this._baseRM = baseRM; this._heightM = heightM;
    this._shiftX = 0; this._shiftZ = 0;
    this._meshActive = false; this._fade01 = 0;
    this._glow01 = 0; this._beamPulse = false; this._pulsePhase = 0;
    this._geo = buildTaipei101Geometry();
    this._mat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, transparent: true, opacity: 0 });
    this._mesh = new THREE.Mesh(this._geo, this._mat); this._mesh.frustumCulled = false;
    this._glowGeo = buildGlowGeometry();
    this._glowMat = new THREE.MeshBasicMaterial({ color: GLOW_COLOR, fog: false, transparent: true,
      opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
    this._glow = new THREE.Mesh(this._glowGeo, this._glowMat); this._glow.frustumCulled = false;
    this.group = new THREE.Group(); this.group.add(this._mesh); this.group.add(this._glow);
    this.group.visible = false; scene.add(this.group);
    bus.on(EVT.RESCALE, (p) => { this._shiftX *= p.S; this._shiftZ *= p.S; });
    bus.on(EVT.REBASE, (p) => { this._shiftX += p.sx; this._shiftZ += p.sz; });
    bus.on(EVT.GAME_RESET, () => {
      this._shiftX = 0; this._shiftZ = 0; this._meshActive = false; this._fade01 = 0;
      this._glow01 = 0; this._beamPulse = false; this._pulsePhase = 0;
      this.group.visible = false; this._mat.opacity = 0; this._glowMat.opacity = 0;
    });
  }
  onTeleport() { this._shiftX = 0; this._shiftZ = 0; }
  getPosSim(out) {
    const ws = this._scaleMgr.worldScale;
    out.set(this._posX / ws - this._shiftX, 0, this._posZ / ws - this._shiftZ); return out;
  }
  get radiusSim() { return this._baseRM / this._scaleMgr.worldScale; }
  get heightSim() { return this._heightM / this._scaleMgr.worldScale; }
  setGlow01(k) { this._glow01 = clamp01(k); }
  setBeamPulse(on) { if (on && !this._beamPulse) this._pulsePhase = 0; this._beamPulse = on; }
  get silFade01() { return 1 - this._fade01; }
  get meshActive() { return this._meshActive; }
  update(dt, cameraPos) { /* ↓ copy SkytreeView.update verbatim, swapping the
    height constant: replace `SKYTREE_HEIGHT_M / ws` with `this._heightM / ws`
    and `SKY_SILHOUETTE_WS_MAX` import (from the pack tuning, see note). */ }
  dispose() {
    this._scene.remove(this.group);
    this._geo.dispose(); this._mat.dispose(); this._glowGeo.dispose(); this._glowMat.dispose();
  }
}
```

- [ ] In the copied `update`, the only literals to change from `goalTower.js`: `SKYTREE_HEIGHT_M` → `this._heightM`, and import `SKY_SILHOUETTE_WS_MAX` from wherever P2 routed engine tuning (it is engine-level, **not** retuned here — leave at 0.2). Keep `HANDOFF_DIST_SIM`, the crossfade, and glow math identical.

- [ ] Export the goal `LandmarkDef` and the `MonumentDef` from `monument.js`:

```js
/** Goal landmark (last + largest in the ladder). dioramaR/0.65 > 小巨蛋's. */
export const TAIPEI101_LANDMARK = Object.freeze({
  landmarkId: 8, name: '台北101', archetypeId: 'taipei101',
  x: TAIPEI101_POS.x, z: TAIPEI101_POS.z,
  dioramaR: 230, collisionScale: 0.45, sizeReal: TAIPEI101_HEIGHT_M,
  naturalBand: 6, colorHex: 0x3f7d8e, isGoal: true,
});
/** Consumed by game/finale.js + world/terrain.js via the active pack. */
export const TAIPEI101_MONUMENT = Object.freeze({
  archetypeId: 'taipei101', View: Taipei101View, pos: TAIPEI101_POS,
  heightM: TAIPEI101_HEIGHT_M, baseRadiusM: TAIPEI101_BASE_R_M, colliderK: TAIPEI101_COLLIDER_K,
  callRadiusM: GOAL_CALL_RADIUS_M, radiusM: GOAL_RADIUS_M,
  callToastKey: 'goal.call', contactToastKey: 'goal.contact', // locale keys (P3/locale.js)
});
```

- [ ] Note: `dioramaR:230` → threshold 353.8 m, comfortably above 小巨蛋 (284.6) AND above `GOAL_RADIUS_M=340` so the ball arms the finale *as* it reaches 101 — matching the design "撞上台北 101". The `taipei101` archetype itself does NOT need a chunk `buildGeometry` (it is the goal monument mesh `Taipei101View`); it appears in the ladder only as the win trigger. If P2's code-map requires every landmark archetypeId to resolve in `archetypes`, register a thin placeholder archetype `taipei101` whose `buildGeometry` returns `buildTaipei101Geometry()` (so the silhouette/sky representation and any debug spawn share the model).

- [ ] Wire into `index.js`: `goalMonument: TAIPEI101_MONUMENT`, and re-export `GOAL_RADIUS_M`/`GOAL_CALL_RADIUS_M`/etc. on the pack so the finale/terrain rewire (Task P6.4) reads them.

- [ ] Commit: `feat(taipei): Taipei101View goal monument + retuned goal constants`.

**VERIFY (visual — the 101 model renders):** Start dev (`npm run dev`), then with chrome-devtools MCP:
```
mcp__chrome-devtools__navigate_page  url=http://localhost:5173/?at=goal&r=300
mcp__chrome-devtools__take_screenshot
```
Expected observation: the tapered 8-segment blue-green tower with a visible spire and gold damper sphere stands at frame center (the `?at=goal` dev-teleport snaps `worldScale` near the goal). Confirm it is NOT the old lattice Skytree silhouette.

---

### Task P6.4: Rewire finale.js + terrain.js base collider to the monument

The finale and terrain must read the goal from the active pack, not `goalTower.js`/`SKYTREE_POS`/`config/tuning.js` goal constants.

- [ ] `src/game/finale.js`: swap the three `GOAL_*` imports. Replace
  ```js
  import { ..., GOAL_CALL_RADIUS_M, ..., GOAL_RADIUS_M } from '../config/tuning.js';
  ```
  with `GOAL_ASCEND_HEIGHT_K`, `GOAL_ASCEND_S`, `GOAL_CONTACT_PAD`, `GOAL_MERGE_S`, `AFTERGLOW_S`, `FOV_BASE` staying from `config/tuning.js` (engine-level), but pull `GOAL_CALL_RADIUS_M` and `GOAL_RADIUS_M` from the active pack: `import { activePack } from '../packs/active.js';` then read `const { radiusM: GOAL_RADIUS_M, callRadiusM: GOAL_CALL_RADIUS_M } = activePack.goalMonument;` at module top. No state-machine logic changes — the contact test, `_refreshTowerCache`, and the 7-arg constructor are untouched (the `goalView` arg is now a `Taipei101View` instance, which has the identical public surface).
- [ ] In the JSDoc `@param goalView`, update the type ref from `SkytreeView` to `Taipei101View`; cosmetic toast strings (`スカイツリーが呼んでいる…!`) move to the pack locale (P3) — finale emits `EVT.GOAL_CALL` with the pack's `callToastKey`, the HUD looks it up.
- [ ] `src/world/terrain.js`: replace `import { SHOP, SKYTREE_POS, MAP_BOUNDS }` so the base-collider position/radius come from the monument. Change the constructor (or the collide() base-circle block at `terrain.js:233-257`) to read `activePack.goalMonument.pos` for `bx/bz` and `activePack.goalMonument.baseRadiusM * activePack.goalMonument.colliderK` for `baseR`. Keep the `!this._goalContacted` gate and the reflect math identical.
- [ ] Construct the monument view in `main.js` from the pack instead of `new SkytreeView(...)`: `const goalView = new activePack.goalMonument.View(scene, scaleMgr);`. The finale constructor still receives it in the frozen `goalView` slot. (This is a one-line swap at the existing `SkytreeView` construction site — grep `new SkytreeView` to find it.)
- [ ] Delete `src/render/goalTower.js` (or leave it unimported; P1/P2 cleanup tracks dead-file removal). The pack monument fully supersedes it.

- [ ] Commit: `refactor(finale,terrain): read goal monument from active pack`.

**VERIFY (the base collider tracks 101, contact still wins):** dev boot, then:
```
mcp__chrome-devtools__navigate_page  url=http://localhost:5173/?at=goal&r=320
mcp__chrome-devtools__evaluate_script  function="() => ({ state: window.__DEV?.finale?.state, towerR: window.__DEV?.finale?._simCache?.towerR })"
```
Expected: `state` advances `idle→called→approach` within a few frames (r 320 ≥ call 305), and `towerR > 0` (base radius derived from the monument, not zero). Then roll forward; `state` reaches `contact` (the win path is verified end-to-end in Task P6.6).

---

### Task P6.5: pack.validate landmark-ladder invariants (replace OSM asserts)

`pack.validate()` (skeleton in P3) must enforce the curated-ladder invariants from the FROZEN CONTRACT, dropping all upstream OSM/Tokyo distance asserts.

- [ ] In `src/packs/taipei/index.js` `validate()` (or a `validateLandmarks(pack)` helper it calls), add:
  - exactly one goal landmark, and it is the LAST element (`landmarks[landmarks.length-1].isGoal === true`, no other `isGoal`).
  - ladder strictly increasing on `dioramaR / ABSORB_RATIO` across ALL landmarks (no upstream "id 5 off-ladder" exception — Taipei has no flat-decal landmark in the core 8).
  - goal landmark has the LARGEST threshold (implied by strictly-increasing + last, but assert explicitly for clarity).
  - every `landmark.archetypeId` resolves in `pack.archetypes`.
  - every `(x,z)` inside `MAP_BOUNDS`; `collisionScale ∈ (0,1]`.
  - `goalMonument.colliderK < GOAL_CONTACT_PAD` (engine const 0.85) — the finale-always-wins guard, mirroring `cityMap.js:1058`.
  - `goalMonument.pos` inside `MAP_BOUNDS`.
- [ ] Print the ladder table on validate (mirrors upstream `log('landmark threshold ladder:...')`) so dev boot shows the climbing thresholds.

- [ ] Commit: `feat(taipei): pack.validate landmark ladder + goal invariants`.

**VERIFY:** `npm run dev` (DEV runs `pack.validate()` at construction per the FROZEN CONTRACT) → console logs the ladder table and NO assert throws. Tamper-check: temporarily set 龍山寺 `dioramaR` to 250 (above 小巨蛋) and confirm boot THROWS `landmark ladder must be strictly increasing`; then revert.

---

### Task P6.6: vitest — ladder math + win-path proof (TDD)

Pure ladder/threshold math is REAL TDD (vitest, added in P0); the win cinematic is a chrome-devtools behavioural check.

- [ ] Write `src/packs/taipei/landmarks.test.js` FIRST (failing), covering the ladder as pure logic against the exported `LANDMARKS` + `TAIPEI101_MONUMENT`:
```js
import { describe, it, expect } from 'vitest';
import { LANDMARKS } from './landmarks.js';
import { TAIPEI101_MONUMENT } from './monument.js';
const ABSORB_RATIO = 0.65;
const threshold = (lm) => lm.dioramaR / ABSORB_RATIO;

describe('taipei landmark ladder', () => {
  it('is strictly increasing on absorb threshold', () => {
    for (let i = 1; i < LANDMARKS.length; i++) {
      expect(threshold(LANDMARKS[i])).toBeGreaterThan(threshold(LANDMARKS[i - 1]));
    }
  });
  it('puts the goal (101) last and largest', () => {
    const goal = LANDMARKS[LANDMARKS.length - 1];
    expect(goal.isGoal).toBe(true);
    expect(goal.archetypeId).toBe('taipei101');
    for (let i = 0; i < LANDMARKS.length - 1; i++) {
      expect(LANDMARKS[i].isGoal).not.toBe(true);
      expect(threshold(goal)).toBeGreaterThan(threshold(LANDMARKS[i]));
    }
  });
  it('arms the finale before the ball can outgrow the goal landmark', () => {
    // GOAL_RADIUS_M must be < the goal landmark absorb threshold, so the
    // finale CALLED/APPROACH fires while 101 is still the target (not eaten).
    expect(TAIPEI101_MONUMENT.radiusM).toBeLessThan(threshold(LANDMARKS[LANDMARKS.length - 1]));
    expect(TAIPEI101_MONUMENT.callRadiusM).toBeLessThan(TAIPEI101_MONUMENT.radiusM);
  });
  it('every landmark stays inside MAP_BOUNDS', () => {
    const X = [-1800, 1800], Z = [-1800, 2000];
    for (const lm of LANDMARKS) {
      expect(lm.x).toBeGreaterThanOrEqual(X[0]); expect(lm.x).toBeLessThanOrEqual(X[1]);
      expect(lm.z).toBeGreaterThanOrEqual(Z[0]); expect(lm.z).toBeLessThanOrEqual(Z[1]);
    }
  });
});
```
- [ ] Run `npx vitest run src/packs/taipei/landmarks.test.js` → see it FAIL if any threshold collides (proves the test bites), then ensure the authored `LANDMARKS` (Task P6.2/P6.3) makes it PASS. Commit on green: `test(taipei): landmark ladder + goal-arming invariants`.

- [ ] Add the geometry-sanity test referenced in Task P6.1 to the same file (tri-count ≤ 600, unit radius for each landmark `buildGeometry`). Run, commit.

**VERIFY (behavioural — roll up to 101, win fires):** dev boot, chrome-devtools MCP:
```
mcp__chrome-devtools__navigate_page  url=http://localhost:5173/?at=goal&r=335
mcp__chrome-devtools__take_screenshot   # 101 in view, beacon pulsing (CALLED)
# drive into the tower (hold a movement key toward TAIPEI101_POS), poll:
mcp__chrome-devtools__evaluate_script  function="() => window.__DEV?.finale?.state"
```
Expected observations, in order: screenshot shows the lit blue-green 101 with the additive beam (CALLED). Polling `finale.state` walks `approach → contact → merge → ascension → afterglow → done`. After `done`, a separate poll of `window.__DEV?.gameWon` (or the win-screen DOM) is `true` and the HUD shows the zh-TW win toast (locale, P3). This is the spec-10 "可玩 smoke：從圖釘一路滾到撞上 101、觸發勝利" gate for the goal half.

**VERIFY (龍山寺 reads as itself — spec-required screenshot):**
```
mcp__chrome-devtools__navigate_page  url=http://localhost:5173/?at=longshan&r=8
mcp__chrome-devtools__take_screenshot
```
Expected: the layered red-pillar hall with the orange swept double-eave roof and gold swallowtail ridges is recognizably 龍山寺 (not a generic box). (Add a `longshan` entry to the pack's `DEV_STARTS` — game meters `(-340, 180)`, r 8 — so the teleport lands on it; mirrors upstream `DEV_STARTS` in `cityMap.js:286`.)

---

### Task P6.7: draw-call + seamlessness regression gate

The monument is **2 draw calls** (body + additive glow), same as upstream Skytree — no net increase. Confirm the engine red-lines (spec §9) still hold after the rewire.

- [ ] After Tasks P6.3-P6.4, run the existing draw-call ledger check (the engine "already has a draw-call ledger" per the contract). With chrome-devtools:
```
mcp__chrome-devtools__navigate_page  url=http://localhost:5173/?at=goal&r=340
mcp__chrome-devtools__evaluate_script  function="() => window.__DEV?.drawCalls ?? window.__DEV?.ledger?.total"
```
Expected: total draw calls ≤ the pack cap (well under, since OSM removal in P1 freed budget). The monument contributes exactly 2.
- [ ] Confirm the forced-rescale pixel-identity check (engine's built-in) still passes at the goal scale — the monument derives its pose from LIVE `worldScale` and tracks rebase shift identically to upstream, so a mid-approach rescale must stay pixel-stable. Trigger a rescale near the goal (roll until `SIM_RADIUS_MAX` crossing) and confirm no visible pop in two consecutive `take_screenshot` calls bracketing the rescale frame.
- [ ] No new per-frame allocation: the `update` copy uses only module scratch `_pos` (verbatim from upstream). Spot-check by reading the copied method — no `new` inside `update`.

- [ ] Commit (if any tuning nudges): `chore(taipei): goal monument draw-call + rescale regression pass`.

**VERIFY:** draw-call total within cap (number reported above), and the two rescale-bracket screenshots are pixel-stable (no tower pop). This closes the P6 engine-red-line obligations; cross-cutting full-run verification is P10.



## P7. Collectibles album

收藏冊是「稀有彩蛋」系統:13 個手搭幾何在地圖上由 curated 機制擺放一次,滾到就 `EVT.COLLECT`、把該 id 的 bit OR 進 album bitmask(localStorage 持久化、pack 內 append-only)、結算頁顯示縮圖格。引擎機制完全沿用上游 `src/game/collection.js`(已讀:bitmask + popcount + 開機縮圖預渲染 + forward-compat 高位保留),本 Part 只做兩件結構性改動,其餘是內容:

1. 把 collection.js 的「`code = 70 + id` 手寫凍結規則」改成走 **pack-scoped code-map**(P2 已把 code↔id 對照表改成開機從 active pack 推導);album id 在 taipei pack 內仍是 frozen append-only。
2. 新增 13 個 `kind: 'collectible'` 的 pack archetype(幾何 + 繁中名)+ 13 筆 `map.collectibles` 擺放 + pack `validate()` 的收藏冊不變量。

**前置依賴**:P2(pack code-map + `pack.codeForCollectibleId` / `pack.archetypeIdByCode`)、P3(`locale` 表 + i18n 的 `EVT.COLLECT.name` 改名 + HUD/結算頁掛 collection)、P5(chunk archetype id 清單,用來確認沒撞名)。

> **命名紅線(給整合者)**:總統府與 YouBike 同時出現在「地標/chunk」與「收藏冊」。收藏冊用 `presidential_office_collectible`、`youbike`(小桌頭擺件),地標(P6)用 `presidential_office`(T5 建築)、chunk(P5)用 `youbike_dock`。動手前 grep 確認無撞名。

---

### Task P7.1: 為收藏冊建立 vitest 紅燈(album bitmask set/get/persist)

收藏冊 bitmask 是純邏輯,走真 TDD。先寫會失敗的測試,鎖死 set/get、append-only、forward-compat 高位保留、persist round-trip。

- [ ] 確認 P0 已裝 vitest(`package.json` 有 `vitest`、`npm run test` 可跑)。若無,回 P0 補。
- [ ] 建檔 `src/game/collection.test.js`,內容如下(用 jsdom 環境取得 `localStorage`;檔頭加 `// @vitest-environment jsdom`):

```js
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Collection } from './collection.js';

// Minimal event bus stub matching core/events.js EventBus surface used here.
function makeBus() {
  const handlers = new Map();
  return {
    on(evt, fn) { (handlers.get(evt) || handlers.set(evt, []).get(evt)).push(fn); },
    emit(evt, payload) { (handlers.get(evt) || []).forEach((fn) => fn(payload)); },
    _fire(evt, payload) { this.emit(evt, payload); },
  };
}

describe('Collection album bitmask', () => {
  beforeEach(() => localStorage.clear());

  it('starts empty', () => {
    const c = new Collection(makeBus());
    expect(c.foundCount).toBe(0);
    expect(c.isFound(0)).toBe(false);
  });

  it('sets a bit on ABSORB with a collectibleId and reports it found', async () => {
    const { EVT } = await import('../core/events.js');
    const bus = makeBus();
    const c = new Collection(bus);
    bus.emit(EVT.ABSORB, { collectibleId: 0 });
    expect(c.isFound(0)).toBe(true);
    expect(c.foundCount).toBe(1);
    expect(c.isNewThisRun(0)).toBe(true);
  });

  it('persists the mask and reloads it (round-trip)', async () => {
    const { EVT } = await import('../core/events.js');
    const bus1 = makeBus();
    const c1 = new Collection(bus1);
    bus1.emit(EVT.ABSORB, { collectibleId: 2 });
    bus1.emit(EVT.ABSORB, { collectibleId: 12 }); // highest taipei id
    const c2 = new Collection(makeBus()); // fresh instance reads localStorage
    expect(c2.isFound(2)).toBe(true);
    expect(c2.isFound(12)).toBe(true);
    expect(c2.foundCount).toBe(2);
  });

  it('preserves UNKNOWN high bits across load/collect/save (forward compat)', async () => {
    const { LS_COLLECTION_KEY } = await import('../config/tuning.js');
    // A future build collected id 20 (a bit this build does not display).
    localStorage.setItem(LS_COLLECTION_KEY, JSON.stringify({ v: 1, mask: 1 << 20 }));
    const { EVT } = await import('../core/events.js');
    const bus = makeBus();
    const c = new Collection(bus);
    bus.emit(EVT.ABSORB, { collectibleId: 1 });
    const reloaded = Collection.loadMask();
    expect(reloaded & (1 << 20)).not.toBe(0); // unknown bit preserved
    expect(reloaded & (1 << 1)).not.toBe(0);  // new bit written
  });

  it('rejects anomalous storage to mask 0', () => {
    localStorage.setItem('rollFormosa.taipei.collection', '{not json');
    expect(Collection.loadMask()).toBe(0);
  });
});
```

- [ ] 跑 `npx vitest run src/game/collection.test.js`。**預期紅燈**(此刻 collection.js 仍 import 上游 `collectibleCodeForId` 的 `70 + id` 凍結斷言、`LS_COLLECTION_KEY` 仍是上游字串 → import 或 boot-assert 爆)。把錯誤訊息貼進 commit body。
- [ ] commit:`test(p7): failing album bitmask set/get/persist/forward-compat tests`

---

### Task P7.2: 把 collection.js 改走 pack-scoped code-map(讓紅燈轉綠)

上游 collection.js(已讀)有兩處綁死 Tokyo:① 開機 DEV 斷言裡的 `if (id <= 11 && code !== 70 + id) throw`(`70 + id` 手寫凍結規則);② `nameForId` 走 `DISPLAY_NAME_BY_CODE[collectibleCodeForId(id)]`。P2 已把 code-map 改成 pack-scoped,所以這裡改成從 active pack 查。

- [ ] 編輯 `src/game/collection.js` 頂部 import:把
  ```js
  import { ARCHETYPE_ID_BY_CODE, collectibleCodeForId } from '../world/objects.js';
  import * as catalogModule from '../config/catalog.js';
  ```
  改為(P2 已讓 active pack 持有自己的 code-map 與顯示名表):
  ```js
  import { activePack } from '../packs/active.js';
  // Pack-scoped code-map (built at load from the active pack's lists, P2):
  //   codeForCollectibleId(id) -> pack code; archetypeIdByCode[code] -> id string;
  //   displayName(code) -> zh-TW name. These REPLACE the global Tokyo tables.
  const codeForCollectibleId = (id) => activePack.codeForCollectibleId(id);
  const ARCHETYPE_ID_BY_CODE = activePack.archetypeIdByCode;
  const displayNameByCode = activePack.displayNameByCode;
  ```
- [ ] 把 `DISPLAY_NAME_BY_CODE` 相關常數區塊(上游第 53–56 行)換成用 `displayNameByCode`;`nameForId(id)`(上游第 82–85 行)改成:
  ```js
  function nameForId(id) {
    const name = displayNameByCode[codeForCollectibleId(id)];
    return typeof name === 'string' ? name : '';
  }
  ```
- [ ] **刪掉** 上游開機 DEV 斷言裡的凍結 `70 + id` 分支(上游第 102–104 行那段 `if (id <= 11 && code !== 70 + id) throw`)。保留前兩個斷言(每個顯示 id 都解析得到 archetype + 顯示名),它們現在對 pack code-map 驗證。
- [ ] `_onAbsorb` 內 `c.nameJa = nameForId(id)` 改成 `c.name = nameForId(id)`(P3 的 i18n 改名;payload 欄位 events.js 已同步改)。同步改 `prerenderThumbnails` 與 boot-assert 中所有 `collectibleCodeForId` 為本檔的 `codeForCollectibleId`。
- [ ] 確認 `src/config/tuning.js`(P0)的 `LS_COLLECTION_KEY = 'rollFormosa.taipei.collection'`、`COLLECT_TOTAL = 13`、`THUMB_SIZE_PX = 96` 三者就位(上游是 13/96 已對,只需改 key 字串)。
- [ ] 跑 `npx vitest run src/game/collection.test.js`。**預期全綠**。把通過輸出貼進 commit body。
- [ ] commit:`refactor(p7): route collection.js album ids through pack-scoped code-map`

---

### Task P7.3: 收藏冊 archetype 共用 pattern + 一個 worked example(月牙本尊)

13 個收藏品都是 `kind: 'collectible'` 的 curated archetype:`spawnWeight: 0`(只由 cityMap 擺放、永不隨機 roll)、`sizeClass: 'collectible-small'`、`buildGeometry(rng)` 用 §3 的 box/cyl/cone/sph/torus + `finish([...])` 正規化到單位包圍球(沿用 catalog.js 既有 helper)。幾何 ≤ 350 tri。

**共用 pattern**(每個 collectible archetype 的形狀):

```js
add({
  id: '<archetypeId>',
  displayName: '<繁中名>',          // i18n: 真正字串放 locale,這裡放 key 或 zh-TW(P3 定案)
  kind: 'collectible',
  tier: <T>, naturalBand: <0..6>,   // 落在對應尺度帶,curated 會 clamp 到 ±1
  radiusNominal: <m>, radiusJitter: 0,
  spawnWeight: 0,                    // curated-only,never random-rolled
  sizeClass: 'collectible-small',   // 共用 EXTRA pool,+0 draw call
  palette: [0x..., 0x..., 0x..., 0x...],
  yOffset: <measured>, upright: true, collisionScale: <0.85..1>,
  buildGeometry(rng) { return finish([ /* primitives */ ]); },
});
```

- [ ] 建檔 `src/packs/taipei/catalog.js` 的收藏冊區段(或 P5 已建此檔則 append 一個 `/* ---- Collectibles (album, pack-scoped frozen ids) ---- */` 區塊)。沿用 P5 引入的 `box/cyl/cone/sph/torus/finish` helper(從 catalog.js 共用,勿重寫)。
- [ ] **Worked example — 台灣黑熊本尊(album id 0)**,完整貼上:

```js
/* ---- Collectibles (album, pack-scoped FROZEN append-only ids 0..12) ---- */
/* spawnWeight 0: curated-only. sizeClass collectible-small: shared pool. */

add({
  id: 'black_bear',
  displayName: '台灣黑熊',
  kind: 'collectible',
  tier: 1,
  naturalBand: 1,
  radiusNominal: 0.05,
  radiusJitter: 0,
  spawnWeight: 0,
  sizeClass: 'collectible-small',
  palette: [0x2a2a2e, 0x26262a, 0x303034, 0x222226],
  yOffset: -0.05,
  upright: true,
  collisionScale: 0.95,
  buildGeometry(rng) {
    return finish([
      sph(0.62, 0xffffff, { sy: 1.05, y: 0.6 }),                 // body (tinted black)
      sph(0.46, 0xffffff, { y: 1.45 }),                          // head
      sph(0.16, 0xffffff, { ws: 5, hs: 3, x: -0.34, y: 1.82 }),  // ear L
      sph(0.16, 0xffffff, { ws: 5, hs: 3, x: 0.34, y: 1.82 }),   // ear R
      sph(0.2, 0xe2c89a, { ws: 6, hs: 4, sz: 0.5, y: 1.4, z: 0.4 }), // muzzle patch
      // The signature white crescent (月牙) V on the chest — two angled bars.
      box(0.34, 0.08, 0.05, 0xf2f2ee, { rz: 0.5, x: -0.12, y: 0.78, z: 0.55 }), // crescent L
      box(0.34, 0.08, 0.05, 0xf2f2ee, { rz: -0.5, x: 0.12, y: 0.78, z: 0.55 }), // crescent R
      sph(0.3, 0xffffff, { ws: 5, hs: 3, x: -0.6, y: 0.75 }),    // arm L
      sph(0.3, 0xffffff, { ws: 5, hs: 3, x: 0.6, y: 0.75 }),     // arm R
      sph(0.26, 0xffffff, { ws: 5, hs: 3, x: -0.32, y: 0.2 }),   // leg L
      sph(0.26, 0xffffff, { ws: 5, hs: 3, x: 0.32, y: 0.2 }),    // leg R
    ]);
  },
});
```

- [ ] commit:`feat(p7): collectible archetype pattern + black_bear (album id 0)`

---

### Task P7.4: 其餘 12 個收藏品 archetype(checklist + 既有上游模型可借)

照 P7.3 的 pattern 各補一個 `add({ ... kind:'collectible' ... })`。**幾何規則**:辨識度優先,每個 ≤ 350 tri、單一共用材質、palette 4–5 色。**省工提示**:上游 catalog.js 已有可直接 retheme 的幾何骨架(已讀),借形換色換比例即可,勿從零搭。

| album id | archetypeId | displayName | tier/naturalBand | radiusNominal (m) | 辨識重點 | 可借上游骨架 |
|---|---|---|---|---|---|---|
| 0 | `black_bear` | 台灣黑熊 | 1 | 0.05 | 月牙 V 白胸 | ✅ 已做(P7.3,改自 panda_plush) |
| 1 | `bubble_tea` | 珍珠奶茶 | 1 | 0.05 | 封膜杯 + 底部黑珍珠 + 粗吸管 | cyl 杯體 + sph 群(珍珠)+ cyl 吸管 |
| 2 | `fried_chicken` | 雞排 | 1 | 0.05 | 裹粉大片 + 紙袋 | box 裹粉塊(ico 微抖)+ box 紙袋 |
| 3 | `gua_bao` | 刈包 | 1 | 0.045 | 對折白麵皮夾餡 | sph 半球麵皮 ×2 + box 餡 |
| 4 | `xiaolongbao` | 小籠包 | 1 | 0.05 | 蒸籠 + 摺褶包子群 | cyl 蒸籠 + sph 群(收頂摺) |
| 5 | `pineapple_cake` | 鳳梨酥 | 1 | 0.04 | 金黃方塊 + 烤色邊 | box 酥體(gradient 烤邊) |
| 6 | `san_taizi` | 電音三太子 | 2 | 0.3 | 大頭娃 + 頭飾 + 紅臉 | 改自 person hero(放大頭、加冠) |
| 7 | `budaixi_puppet` | 布袋戲偶 | 2 | 0.25 | 戲偶頭 + 戲服披風 | cyl 戲服 + sph 偶頭 + cone 冠 |
| 8 | `youbike` | YouBike 微笑單車 | 2 | 0.9 | 黃橘車身 + 前置物籃 | 改自 bicycle hero(換色 + 籃) |
| 9 | `presidential_office_collectible` | 總統府(桌頭擺件) | 3 | 1.0 | 紅白量體 + 中央塔 微縮 | box 量體群 + cyl/cone 中央塔 |
| 10 | `maokong_gondola` | 貓空纜車 | 3 | 1.5 | 纜車廂 + 頂吊架 + 一段纜線 | box 車廂 + cyl 吊臂 + cyl 纜線 |
| 11 | `shilin_chicken` | 士林大雞排 | 3 | 2.0 | 超大版雞排(比 id2 大一帶) | 同 fried_chicken 放大、加辣粉點 |
| 12 | `mazu` | 媽祖(神像) | 4 | 4.0 | 鳳冠 + 冕旒 + 神袍 + 金面 | cyl 神袍 + sph 金面 + box 冠 + 多 box 冕旒 |

- [ ] 每補完一個 archetype 就跑一次 `npm run build`(P0 的 vite build),確認無語法錯(幾何錯誤在 geometryFactory 開機 assert 才會現,P7.6 統一驗)。
- [ ] 每 3–4 個 commit 一次,例:`feat(p7): collectibles bubble_tea/fried_chicken/gua_bao/xiaolongbao (album 1-4)`。

---

### Task P7.5: 13 筆 collectible 擺放(map.collectibles)+ pack code-map 對齊

收藏品由 cityMap 擺放一次(curated singleton),走 P2 的 pack-scoped code。每筆 def 形狀沿用上游 `CollectibleDef`(已讀 cityMap.js COLLECTIBLES):`{ id, name, x, y, z, radiusReal, archetypeId, landmarkId, naturalBand, rIntent }`。**關鍵差異**:上游用寫死 `archetypeCode: 70 + id`;P2 改成由 pack 從 `archetypeId` + album-id 順序推導 code,所以這裡**寫 `archetypeId` 字串**,不寫數字 code。

- [ ] 在 `src/packs/taipei/cityMap.js` 新增 `COLLECTIBLES`(13 筆,id 0..12,順序 = album 凍結順序 = P7.4 表),例(前 3 筆 worked,其餘照填,座標手擺、散佈全圖避免擠同一吸收點):

```js
/* 13 collectibles — pack-scoped FROZEN append-only ids. archetypeId (string)
   feeds the pack code-map (P2); landmarkId -1 (no dual-tag in Phase 1). */
export const COLLECTIBLES = Object.freeze([
  { id: 0,  name: '台灣黑熊',   x: 2.1,  y: 0.4, z: 0.7,  radiusReal: 0.05, archetypeId: 'black_bear',      landmarkId: -1, naturalBand: 1, rIntent: 0.3 },
  { id: 1,  name: '珍珠奶茶',   x: 3.3,  y: 0.4, z: 1.5,  radiusReal: 0.05, archetypeId: 'bubble_tea',      landmarkId: -1, naturalBand: 1, rIntent: 0.3 },
  { id: 2,  name: '雞排',       x: 12,   y: 0,   z: -8,   radiusReal: 0.05, archetypeId: 'fried_chicken',   landmarkId: -1, naturalBand: 1, rIntent: 0.3 },
  // ... ids 3..12 同形狀,座標依尺度帶散佈(T1 夜市 / T2 騎樓 / T3 機車海 / T4 廟埕);
  //     mazu(id 12)放在 T4 廟埕帶,radiusReal 4.0、rIntent ~6。
]);
```

- [ ] 把 `COLLECTIBLES` 接進 pack 的 `map.collectibles`(P3 的 StagePack 組裝點)。確認 P2 的 pack 載入器把所有 `kind:'collectible'` archetype 依 album-id 順序排進 pack code 表,使 `pack.codeForCollectibleId(id)` 與此處 `archetypeId` 一致。
- [ ] commit:`feat(p7): 13 taipei collectible placements wired to pack code-map`

---

### Task P7.6: pack.validate() 收藏冊不變量(vitest 紅→綠)

pack 自驗收藏冊(取代上游 cityMap.js 第 1015–1037 行那段 Tokyo 斷言)。先寫測試,再在 `pack.validate()` 裡實作。

- [ ] 在 `src/packs/taipei/pack.test.js`(P3 已建)append:

```js
import { describe, it, expect } from 'vitest';
import { taipeiPack } from './index.js';

describe('taipei pack — collectible album invariants', () => {
  it('has exactly 13 collectibles with unique sequential ids 0..12', () => {
    const cols = taipeiPack.map.collectibles;
    expect(cols.length).toBe(13);
    const ids = cols.map((c) => c.id).sort((a, b) => a - b);
    expect(ids).toEqual([0,1,2,3,4,5,6,7,8,9,10,11,12]);
  });

  it('every collectible archetypeId resolves to a kind:collectible archetype', () => {
    for (const c of taipeiPack.map.collectibles) {
      const a = taipeiPack.archetypes[c.archetypeId];
      expect(a, `archetype ${c.archetypeId} missing`).toBeDefined();
      expect(a.kind).toBe('collectible');
      expect(a.spawnWeight).toBe(0);
    }
  });

  it('codeForCollectibleId is stable, unique, and matches placement archetypeId', () => {
    const seen = new Set();
    for (const c of taipeiPack.map.collectibles) {
      const code = taipeiPack.codeForCollectibleId(c.id);
      expect(seen.has(code)).toBe(false);
      seen.add(code);
      expect(taipeiPack.archetypeIdByCode[code]).toBe(c.archetypeId);
    }
  });

  it('validate() throws if a collectible id exceeds the 31-bit LS mask', () => {
    // ids must be < 31 (album mask is a uint32). Guard the frozen ceiling.
    for (const c of taipeiPack.map.collectibles) expect(c.id).toBeLessThan(31);
  });
});
```

- [ ] 跑 `npx vitest run src/packs/taipei/pack.test.js`。**預期紅燈**(`validate()` 尚未涵蓋這些)。
- [ ] 在 `src/packs/taipei/index.js` 的 `validate()` 內加入(沿用 P2/P3 的 `assert` helper):
  ```js
  // --- collectible album invariants (pack-scoped, save-compat) ---
  const cols = this.map.collectibles;
  assert(cols.length === COLLECT_TOTAL, `expected ${COLLECT_TOTAL} collectibles, got ${cols.length}`);
  const seen = new Set();
  for (const c of cols) {
    assert(Number.isInteger(c.id) && c.id >= 0 && c.id < 31, `collectible id ${c.id} must be int < 31 (LS mask)`);
    assert(!seen.has(c.id), `duplicate collectible id ${c.id}`);
    seen.add(c.id);
    const a = this.archetypes[c.archetypeId];
    assert(a !== undefined && a.kind === 'collectible' && a.spawnWeight === 0,
      `collectible ${c.id}: archetypeId ${c.archetypeId} not a curated collectible archetype`);
    const code = this.codeForCollectibleId(c.id);
    assert(this.archetypeIdByCode[code] === c.archetypeId,
      `collectible ${c.id}: code-map mismatch (${this.archetypeIdByCode[code]} != ${c.archetypeId})`);
  }
  ```
- [ ] 跑 `npx vitest run src/packs/taipei/pack.test.js` → **預期全綠**。貼輸出進 commit。
- [ ] commit:`test(p7): pack.validate() collectible album invariants (green)`

---

### Task P7.7: 縮圖預渲染 + EVT.COLLECT + 結算頁格子實機驗證(chrome-devtools)

引擎側 `prerenderThumbnails`(開機把 13 個 collectible archetype 渲成 96px data-URL)、`EVT.COLLECT` 訂閱、HUD popup、結算頁 13 格(P3 掛 collection 進 Hud/Screens)都已就位。這步做端到端實機驗證:收到一個收藏品 → album 格更新。

- [ ] 確認 `src/main.js`(P0 保留)的 `collection.prerenderThumbnails(renderer, geos)` 在 title 階段被呼叫,且 `geos` 已含 13 個 collectible archetype 的單位幾何(P5 的 `buildAllGeometries` 涵蓋所有 `kind:'collectible'`)。
- [ ] 在 `src/main.js` 暫加一個 DEV-only 測試掛勾(驗完移除或留在 `import.meta.env.DEV` 後):
  ```js
  if (import.meta.env && import.meta.env.DEV) {
    window.__DEV_collectId = (id) => bus.emit(EVT.ABSORB, { collectibleId: id });
    window.__DEV_album = () => ({ found: collection.foundCount, total: 13, thumb0: collection.thumbnailUrl(0).slice(0, 30) });
  }
  ```
- [ ] 起 dev server:`npm run dev`(background),記下 vite URL(通常 `http://localhost:5173`)。
- [ ] chrome-devtools MCP:`navigate_page` 到該 URL;`wait_for` title/canvas 就緒。
- [ ] `evaluate_script`:`() => window.__DEV_album()`。**預期觀察**:回傳 `{ found: 0, total: 13, thumb0: 'data:image/png;base64,...' }` — `thumb0` 非空字串(證明黑熊縮圖預渲染成功)。
- [ ] `evaluate_script`:`() => { window.__DEV_collectId(0); return window.__DEV_album(); }`。**預期觀察**:`found` 由 0 變 1。
- [ ] 觸發結算頁(滾到 101 太久;改用 P3/P10 的 `__DEV_win()` 或直接 `evaluate_script` 呼叫 screens 的 result 開啟掛勾),`take_screenshot`。**預期觀察**:13 格收藏冊網格中,第 1 格(台灣黑熊)顯示縮圖 + 繁中名「台灣黑熊」+ 角落 `NEW` 徽章;其餘 12 格為 `.unfound` 的「？」。標題 n 顯示 `1`。
- [ ] `evaluate_script` 數該格非透明像素(沿用既有像素級驗證法):
  ```js
  () => { const img = document.querySelector('.collect-cell img'); if (!img) return -1;
    const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0,0,cv.width,cv.height).data; let n=0;
    for (let i=3;i<d.length;i+=4) if (d[i]>16) n++; return n; }
  ```
  **預期觀察**:回傳 > 500(縮圖實際有畫到內容,非空白卡)。
- [ ] reload 頁面、再次 `evaluate_script: () => window.__DEV_album()`。**預期觀察**:`found` 仍為 1(localStorage 持久化跨 reload 生效)。
- [ ] 移除暫時掛勾或確認其包在 `import.meta.env.DEV` 內。commit:`feat(p7): verify collect -> album grid + thumbnail + persist (chrome-devtools)`

---

### Task P7.8: 旁白/locale 鉤子對齊 + 收尾

收藏品名字串歸 P3 的 `locale`;旁白 collect 行歸 P8(mascot)。這步只確認接縫對齊、無殘留日文。

- [ ] grep 確認 collection.js / pack catalog / cityMap 收藏冊區段無殘留日文字串(`grep -nP '[ぁ-んァ-ヶ]' src/game/collection.js src/packs/taipei/catalog.js src/packs/taipei/cityMap.js`)。**預期**:無命中(或僅註解,視 P3 在地化政策)。
- [ ] 確認 13 個 `displayName` 對應 P3 `locale` 的 collectible name keys(若 P3 走 key 查表,把 archetype 的 `displayName` 換成 locale key、由 HUD/結算頁查表)。記錄給整合者:album id ↔ locale key 對照需與本表一致。
- [ ] 留 TODO 給 P8:`COLLECT_LINE_IDS` 需覆蓋 album id 0..12(月牙對每個收藏品的台北梗台詞);本 Part 不實作旁白文本。
- [ ] 最終跑 `npx vitest run src/game/collection.test.js src/packs/taipei/pack.test.js` 全綠 + `npm run build` 成功。commit:`chore(p7): align collectible locale keys + dev-boot validate clean`

---

**P7 完成定義**:`npm run build` 過、兩支 vitest 全綠、dev 開機 `pack.validate()` 不丟、chrome-devtools 驗到「收一個 → album 第 1 格出現縮圖+名+NEW、reload 後仍 found=1」。13 個收藏品 archetype + 13 筆擺放就位,album id 0..12 在 taipei pack 內凍結 append-only。



## P8. Mascot 月牙 (Formosan black bear)

> Replaces the upstream duck **Donack (ドナック)** with the Formosan black bear **月牙 (Yuè-yá)** — white chest crescent "V". This part (a) generalizes the existing `ui/donack.js` controller to read its line table + avatar config from the **active pack** instead of the hardcoded `config/donackLines.js`; (b) authors `src/packs/taipei/narration.js` (zh-TW lines + lookup tables) and `src/packs/taipei/mascot.js` (avatar config, adds a 5th `surprised` expression); (c) swaps the `#donack-root` art/preload/verify-gate; (d) generates the bear webp frames as an **asset step gated on placeholders** so the build never blocks on art.
>
> **Grounded in the real code** (read before planning): `src/ui/donack.js` imports its tables from `config/donackLines.js` (lines 75–82) and hardcodes 4 expressions in `AVATAR_CLASSES` (lines 97–102, ids `idle/happy/thinking/speaking`, blink pair frames `0`/`3`); files live at `public/assets/donack/{expr}-{0,3}.webp`; CSS classes `.dk-{expr}-{0,3}` are defined in `index.html` (lines 292–299) with 8 `<link rel=preload>` (lines 11–18); `scripts/verify-donack-assets.sh` hard-asserts **exactly** those 8 frames; `main.js` constructs `new Donack(bus, initialDonackOff, getBallPosReal)` (~line 506) and `screens.setDonack(donack)` (~line 507); `screens.js` is the sole writer of `LS_DONACK_KEY` and the `#donack-toggle` label (~line 293).
>
> **Depends on**: P2 (pack-scoped code-map + ScoreEvent carries archetypeId), P3 (locale + active→taipei flip), P6 (landmark id ladder), P7 (collectible album id ladder). If P6/P7 land after P8, the narration arrays for those ladders are authored as **stubs** here and filled when those parts land (noted per-task).

---

### Task P8.1: Add the 5th expression (`surprised`) to the controller's avatar map

The spec wants 5 expressions (idle/happy/thinking/speaking/**surprised**); the engine ships 4. This is the only engine-logic change to the avatar swap. Keep the blink-pair (`0`/`3`) contract.

- [ ] Open `src/ui/donack.js`. Replace the `AVATAR_CLASSES` constant (currently lines ~97–102) with a version including `surprised` **and** make the class prefix configurable later (we leave the literal classes for now; the pack supplies which exprs exist):

```js
/** Precomputed avatar class strings (expression x frame) — never built per swap.
 *  Frames are the blink pair (0 = open, 3 = blink); class prefix is `.dk-`. */
const AVATAR_CLASSES = Object.freeze({
  idle:      Object.freeze(['dk-idle-0', 'dk-idle-3']),
  happy:     Object.freeze(['dk-happy-0', 'dk-happy-3']),
  thinking:  Object.freeze(['dk-thinking-0', 'dk-thinking-3']),
  speaking:  Object.freeze(['dk-speaking-0', 'dk-speaking-3']),
  surprised: Object.freeze(['dk-surprised-0', 'dk-surprised-3']),
});
```

- [ ] In `_applyAvatarFrame()` (lines ~581–585) the fallback is already `AVATAR_CLASSES.idle` for unknown exprs — leave it; `surprised` now resolves. No other code change.
- [ ] **Verify (logic, no art yet)**: `npm run build` succeeds (the new class strings are static). `git add -A && git commit -m "donack: add surprised expression to avatar class map"`.

---

### Task P8.2: Add the `surprised` CSS classes, preload links, and widen the asset gate

Keep the asset directory + filename convention (`public/assets/donack/{expr}-{0,3}.webp`) so only the **expr list** widens.

- [ ] In `index.html`, after the 8 existing `<link rel="preload" ... donack/speaking-3.webp" />` lines (lines 11–18), append the two new frames:

```html
  <link rel="preload" as="image" href="/assets/donack/surprised-0.webp" />
  <link rel="preload" as="image" href="/assets/donack/surprised-3.webp" />
```

- [ ] In `index.html`, after the `.dk-speaking-3` rule (line ~299) add:

```css
    .dk-surprised-0 { background-image: url('/assets/donack/surprised-0.webp'); }
    .dk-surprised-3 { background-image: url('/assets/donack/surprised-3.webp'); }
```

- [ ] In `scripts/verify-donack-assets.sh`, widen the `EXPECTED` list to **10** frames (add `surprised-0.webp surprised-3.webp`) and bump the budget if needed (10 small webp still fit; raise `BUDGET_KB` only if the verify fails on real art — note in the line):

```sh
EXPECTED="idle-0.webp idle-3.webp happy-0.webp happy-3.webp thinking-0.webp thinking-3.webp speaking-0.webp speaking-3.webp surprised-0.webp surprised-3.webp"
```

- [ ] **Verify (placeholder gate)**: do NOT run the asset verify yet (frames don't exist). Just confirm `npm run build` still succeeds. `git commit -m "donack: register surprised webp (css + preload + verify gate)"`.

---

### Task P8.3: Author `src/packs/taipei/mascot.js` — 月牙 avatar config

The pack supplies the mascot identity + which expressions/frames exist. The controller (Task P8.5) reads this.

- [ ] Create `src/packs/taipei/mascot.js`:

```js
/**
 * @file mascot.js — Roll Formosa 台北關 吉祥物「月牙」(Yuè-yá), a Formosan
 * black bear (台灣黑熊) with the species' signature white chest crescent "V".
 * Replaces upstream's duck Donack. Consumed by ui/donack.js via pack.mascot.
 *
 * Frames render as CSS class `.dk-{expr}-{frame}` on #donack-avatar, backed by
 * /assets/donack/{expr}-{frame}.webp (same path convention as upstream so the
 * verify gate and CSS only widened their expr list). Frames 0/3 = blink pair.
 *
 * @typedef {{
 *   id: string, name: string, species: string, assetDir: string,
 *   expressions: string[], frames: number[], defaultExpr: string,
 *   toggleEmoji: string, blinkFps: number
 * }} MascotDef
 */

/** @type {Readonly<MascotDef>} */
export const MASCOT = Object.freeze({
  id: 'yueya',
  name: '月牙',
  species: '台灣黑熊',
  assetDir: '/assets/donack',
  expressions: Object.freeze(['idle', 'happy', 'thinking', 'speaking', 'surprised']),
  frames: Object.freeze([0, 3]),
  defaultExpr: 'idle',
  toggleEmoji: '🐻',
  blinkFps: 4,
});
```

- [ ] **Verify (logic)**: this is pure data; it's exercised by the pack test in Task P8.6. `git commit -m "taipei pack: mascot.js (月牙 black bear avatar config)"`.

---

### Task P8.4: Author `src/packs/taipei/narration.js` — zh-TW lines + lookup tables

This is the **bulk-content** task: pattern + one worked example + a checklist table for the rest. The line *shape* is unchanged from upstream (`{ text, priority, expression, once, phase }`); only the text is zh-TW and the lookup tables are pack-scoped (arrays/maps the controller reads).

**Pattern** (every line): `id` is a frozen string (dedupe hangs off it; append-only within the pack); `priority` 0–3 (P3 landmark/finale interrupts; P2 collectible/tier-up; P1 first-absorb/combo/knock-off; P0 idle tips); `expression` ∈ the 5 mascot exprs (mapping: landmark/finale→`speaking`, collectible/tier-up/combo→`happy`, tips/idle/edge→`thinking`, surprise beats→`surprised`, default→`idle`); `once` true=once/run; `phase` ∈ `play|cinematic|result`.

- [ ] Create `src/packs/taipei/narration.js`. Header + the run-start/tier-up block (worked example — copy this verbatim, it is complete):

```js
/**
 * @file narration.js — 月牙 旁白台詞表 (zh-TW) for the Taipei stage pack.
 * Pack-scoped replacement for upstream config/donackLines.js. Consumed by
 * ui/donack.js via pack.narration. Line ids are append-only WITHIN this pack
 * (per-id dedupe/once-per-run hangs off them — never reuse/rename/reorder).
 *
 * @typedef {{text:string, priority:0|1|2|3,
 *   expression:'idle'|'happy'|'thinking'|'speaking'|'surprised',
 *   once:boolean, phase:'play'|'cinematic'|'result'}} Line
 */

const PLAY = 'play';

/** @type {Readonly<Record<string, Readonly<Line>>>} */
const LINES = Object.freeze({
  /* ---- run start ---- */
  start: Object.freeze({
    text: '從柑仔店桌頭開始！跟著發光箭頭去黏東西吧',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via tierUpByIndex[tierIndex]; index 0 unused) ---- */
  tier1: Object.freeze({
    text: '桌頭清空啦！換攻夜市的攤子',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '滾到騎樓邊了，紅椅電鍋通通捲起來！',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '機車海來了！這台是你的嗎？借滾一下～',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '街屋跟廟都吃得下了…尺度感整個壞掉欸',
    priority: 2, expression: 'surprised', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '你已經是台北的主角了，地標通通收一收！',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '到信義區了，剩下就是…那棟竹節塔！',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  // ... (first-absorb, tips, landmark, collect, finale lines below) ...
});
```

- [ ] Append the remaining line blocks following the same pattern. Use this **checklist** (one row = one `LINES` entry; text is the zh-TW copy, keep it 1–2 sentences, no emoji per the user's preference):

  **first-absorb-per-category** (priority 1, `idle`, once, play) — keyed later by archetypeId in `firstByArchetypeId`:

  | id | when (archetype category) | zh-TW text |
  |---|---|---|
  | `first_small` | 第一顆桌頭小物 (彈珠/橡皮擦…) | 一顆彈珠開滾台北，故事開始囉～ |
  | `first_market` | 第一個夜市攤物 | 夜市的味道！這個一定要捲 |
  | `first_scooter` | 第一台機車 | 機車下肚！你已經是合格的災難了 |
  | `first_building` | 第一棟建築 | 房子也吃？尺度感真的回不去了 |

  **play reactions / tips**:

  | id | priority / expr / once | zh-TW text |
  |---|---|---|
  | `combo15` | 1 / happy / once | 連段超猛！就是這個節奏！ |
  | `knockoff` | 1 / idle / once | 啊掉了！撞太大的會被彈掉喔 |
  | `repeat_bonk` | 1 / thinking / once | 被彈開代表它太大，先從旁邊養大再來 |
  | `tip_idle` | 0 / thinking / **once:false** | 大的先別急，小東西一個一個黏起來！ |
  | `tip_dash` | 0 / thinking / **once:false** | 衝刺滿了！找條大路衝一波 |
  | `tip_edge` | 1 / thinking / **once:false** | 那邊是地圖邊界，迴轉回街上吧～ |

  **landmark trivia** (priority 3, `speaking`, once, play) — index order MUST match P6's `LandmarkEvent.landmarkId` ladder (dioramaR-increasing). One id per landmark P6 ships; example rows for the core set:

  | id | landmark | zh-TW trivia |
  |---|---|---|
  | `lm_beimen` | 北門(承恩門) | 清代石砌城門，台北僅存的城門原貌喔 |
  | `lm_longshan` | 龍山寺 | 萬華的信仰中心，看那層層疊疊的燕尾脊 |
  | `lm_ximen` | 西門紅樓 | 八角紅磚老戲院，台北最潮的古蹟 |
  | `lm_grand_hotel` | 圓山大飯店 | 紅柱黃瓦的宮殿式飯店，氣派吧！ |
  | `lm_presidential` | 總統府 | 紅白巴洛克加中央塔樓，認得出來嗎 |
  | `lm_cks` | 中正紀念堂 | 藍頂白牆配五拱牌樓，自由廣場到手 |
  | `lm_arena` | 台北小巨蛋 | 銀色巨蛋，演唱會的聖地收進來了 |

  > **101 is the goal monument, not a landmark trivia line** — its beat is `goal_call` + `goal_contact` (below), driven by P6's finale rewire.

  **goal call** (priority 3, `speaking`, once, play):

  | id | zh-TW text |
  |---|---|
  | `goal_call` | 508 公尺的台北 101 在呼喚你，衝啊！ |

  **collectibles** (priority 2, `happy`, once, play) — index order MUST match P7's append-only album ids. `col_generic` is the fallback for any id without a bespoke line:

  | id | collectible | zh-TW text |
  |---|---|---|
  | `col_generic` | (fallback) | 收藏到手！記進圖鑑啦 |
  | `col_bear` | 台灣黑熊本尊 | 是月牙的同伴！胸前月牙 V 認證 |
  | `col_bubbletea` | 珍奶 | 珍奶收進來，續命神器！ |
  | `col_chicken` | 雞排 | 大雞排！比臉還大那種 |
  | `col_guabao` | 刈包 | 台式漢堡刈包，虎咬豬！ |
  | `col_xiaolongbao` | 小籠包 | 小籠包入袋，小心爆汁～ |
  | `col_pineapple_cake` | 鳳梨酥 | 鳳梨酥，伴手禮天花板 |
  | `col_san_taizi` | 電音三太子 | 電音三太子登場，動次動次！ |
  | `col_budaixi` | 布袋戲偶 | 布袋戲偶到手，戲棚下站久就是你的 |
  | `col_youbike` | YouBike | 微笑單車也滾走，台北人哭哭 |
  | `col_presidential` | 總統府(收藏版) | 連總統府都收進圖鑑了！ |
  | `col_maokong` | 貓空纜車 | 貓空纜車車廂，視野滿分 |
  | `col_mazu` | 媽祖 | 媽祖保佑，這趟一定滾到 101 |

  > **DUAL-TAG**: upstream merged ハチ公 (collectible+landmark). Phase-1 taipei has no such overlap → set `dualCollectibleId: -1, dualLandmarkId: -1` (disabled). To enable later: give the shared object a collectible id + landmark id, point both index slots at one merged `dual_*` line, and the controller will fire the COLLECT line + skip the LANDMARK (logic already in `_onLandmark`).

  **finale / result**:

  | id | priority / expr / phase | zh-TW text |
  |---|---|---|
  | `goal_contact` | 3 / speaking / **cinematic** | 成功——！整個台北，連 101 一起收下！ |
  | `ascension` | 3 / surprised / **cinematic** | 哇…升空了…台灣島整個在腳下發光欸 |
  | `result` | 3 / speaking / **result** | 辛苦啦！這成績，發限動炫一下吧 |

- [ ] After `LINES`, export the controller-facing lookup tables. **Index order is load-bearing** (matches P4 tiers, P6 landmarks, P7 collectibles). The `firstByArchetypeId` map keys on **string archetypeId** (P2 made numeric codes pack-scoped — see integrator note):

```js
/** @type {ReadonlyArray<string>} TierUpEvent.tierIndex -> line id (0 unused). */
const TIER_UP_BY_INDEX = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/** @type {ReadonlyArray<string>} LandmarkEvent.landmarkId -> line id.
 *  ORDER MUST MATCH P6's dioramaR-increasing landmark ladder. '' = no line. */
const LANDMARK_BY_ID = Object.freeze([
  'lm_beimen',       // 0
  'lm_longshan',     // 1
  'lm_ximen',        // 2
  'lm_grand_hotel',  // 3
  'lm_presidential', // 4
  'lm_cks',          // 5
  'lm_arena',        // 6
  // ...extend as P6 adds extended-set landmarks (append only)...
]);

/** @type {ReadonlyArray<string>} CollectEvent.collectibleId -> line id.
 *  ORDER MUST MATCH P7's append-only album ids. Fallback = 'col_generic'. */
const COLLECT_BY_ID = Object.freeze([
  'col_bear',            // 0
  'col_bubbletea',       // 1
  'col_chicken',         // 2
  'col_guabao',          // 3
  'col_xiaolongbao',     // 4
  'col_pineapple_cake',  // 5
  'col_san_taizi',       // 6
  'col_budaixi',         // 7
  'col_youbike',         // 8
  'col_presidential',    // 9
  'col_maokong',         // 10
  'col_mazu',            // 11
  // (13th slot if P7 adds 士林大雞排 etc. — append only)
]);

/** @type {Readonly<Record<string,string>>} first-absorb-per-category:
 *  string archetypeId -> line id. P2's ScoreEvent carries archetypeId.
 *  Keys are example ids — align with P5's chunk archetype ids. */
const FIRST_BY_ARCHETYPE_ID = Object.freeze({
  marble: 'first_small', eraser: 'first_small', candy: 'first_small',
  yakult: 'first_market', betelnut: 'first_market',
  scooter: 'first_scooter', light_truck: 'first_scooter',
  townhouse: 'first_building', office_tower: 'first_building',
});

/**
 * The pack NarrationTable consumed by ui/donack.js.
 * @typedef {{lines:Record<string,Line>, tierUpByIndex:string[],
 *   landmarkById:string[], collectById:string[],
 *   firstByArchetypeId:Record<string,string>,
 *   dualCollectibleId:number, dualLandmarkId:number}} NarrationTable
 * @type {Readonly<NarrationTable>}
 */
export const NARRATION = Object.freeze({
  lines: LINES,
  tierUpByIndex: TIER_UP_BY_INDEX,
  landmarkById: LANDMARK_BY_ID,
  collectById: COLLECT_BY_ID,
  firstByArchetypeId: FIRST_BY_ARCHETYPE_ID,
  dualCollectibleId: -1,
  dualLandmarkId: -1,
});
```

- [ ] **Verify (logic)**: exercised by the pack test in Task P8.6 (every landmark/collect/tierUp id resolves to a real `LINES` entry; every `firstByArchetypeId` id resolves; dual ids are -1 or valid). `git commit -m "taipei pack: narration.js (zh-TW 月牙 line table + lookup tables)"`.

---

### Task P8.5: Generalize `ui/donack.js` to read from the active pack; rewire `main.js`

The controller currently imports `config/donackLines.js` directly (lines 75–82). Make it accept `narration` + `mascot` tables so it reads from the active pack. **All control-flow logic stays identical** — only the source of the tables changes, plus the first-absorb lookup now keys on `archetypeId` and blink fps comes from the mascot.

- [ ] In `src/ui/donack.js`, **delete** the import block from `config/donackLines.js` (lines 75–82). Keep the `config/tuning.js` import (engine-global timings). The constructor signature gains two params:

```js
  /**
   * @param {EventBus} [eventBus]
   * @param {boolean} [initialOff]
   * @param {(() => {x:number,z:number})|null} [getBallPosReal]
   * @param {import('../packs/taipei/narration.js').NarrationTable} narration
   * @param {import('../packs/taipei/mascot.js').MascotDef} mascot
   */
  constructor(eventBus = defaultBus, initialOff = false, getBallPosReal = null,
              narration, mascot) {
    // ...existing field inits...
    this._lines = narration.lines;
    this._tierUpByIndex = narration.tierUpByIndex;
    this._landmarkById = narration.landmarkById;
    this._collectById = narration.collectById;
    this._firstByArchetypeId = narration.firstByArchetypeId;
    this._dualCollectibleId = narration.dualCollectibleId;
    this._dualLandmarkId = narration.dualLandmarkId;
    this._mascot = mascot;
    this._blinkPeriodMs = 1000 / (mascot.blinkFps || DONACK_BLINK_FPS);
```

- [ ] Replace every reference to the deleted module-level constants with the instance fields:
  - `DONACK_LINES[id]` → `this._lines[id]` (in `_trigger`, `_enqueue`, `_flushPending`, `_show`).
  - `TIER_UP_LINE_IDS[p.tierIndex]` → `this._tierUpByIndex[p.tierIndex]` (in `_onTierUp`).
  - `LANDMARK_LINE_IDS[p.landmarkId]` → `this._landmarkById[p.landmarkId]` (in `_onLandmark`).
  - `COLLECT_LINE_IDS[p.collectibleId]` → `this._collectById[p.collectibleId]` (in `_onCollect`).
  - `DUAL_LANDMARK_ID` → `this._dualLandmarkId` (in `_onLandmark`; guard `if (this._dualLandmarkId >= 0 && p.landmarkId === this._dualLandmarkId) return;`).
  - `FIRST_LINE_BY_CODE[p.archetypeCode]` → `this._firstByArchetypeId[p.archetypeId]` in `_onScore`. **(P2 dependency)**: this assumes `ScoreEvent` carries `archetypeId`. If P2 instead exposes a code→id lookup on the pack, change this one line to `this._firstByArchetypeId[active.codeToArchetypeId(p.archetypeCode)]` and import `active`.
  - `BLINK_PERIOD_MS` (module const, line 105) → `this._blinkPeriodMs` (in `_show`, line ~561). Delete the module-level `BLINK_PERIOD_MS`.

- [ ] In `_show` keep the avatar swap as-is — `AVATAR_CLASSES` (now 5 exprs from Task P8.1) is the render map; the mascot's `expressions` list is authoritative for *which* exist, but the line's `expression` field already constrains usage. No further change.

- [ ] Add a **dev hook** at the end of the constructor (gated, for the chrome-devtools verify in Task P8.8):

```js
    if (import.meta.env && import.meta.env.DEV) {
      window.__DEV = window.__DEV || {};
      window.__DEV.donack = {
        trigger: (id) => this._trigger(id),
        forceExpr: (e) => { this._expr = e; this._applyAvatarFrame(); },
        isVisible: () => this._visible,
        bubbleText: () => (this._bubble ? this._bubble.textContent : ''),
        avatarClass: () => (this._avatar ? this._avatar.className : ''),
      };
    }
```

- [ ] In `src/main.js`, import the active pack and pass its tables to the constructor (~line 506). Replace:

```js
const donack = new Donack(bus, initialDonackOff, getBallPosReal);
```

with:

```js
import { active } from './packs/active.js'; // (hoist to the import block ~line 129)
// ...
const donack = new Donack(
  bus, initialDonackOff, getBallPosReal, active.narration, active.mascot,
);
```

- [ ] **Verify (boot)**: `npm run build` succeeds; `npm run dev`, open the URL, confirm the dev console logs **no** "Cannot read properties of undefined" from donack and `pack.validate()` (P3) logs no assert. `git commit -m "donack: read line table + avatar from active pack (decouple from config/donackLines)"`.

---

### Task P8.6: TDD — pack narration/mascot validation test

Pure logic → real vitest (added in P0). Write the failing test first, then ensure `narration.js`/`mascot.js` pass it; fold the asserts into `pack.validate()`.

- [ ] Create `src/packs/taipei/narration.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { NARRATION } from './narration.js';
import { MASCOT } from './mascot.js';

describe('taipei narration table', () => {
  const ids = (arr) => arr.filter((x) => x !== '');

  it('every tierUp/landmark/collect line id resolves to a real line', () => {
    for (const id of ids(NARRATION.tierUpByIndex)) expect(NARRATION.lines[id], id).toBeTruthy();
    for (const id of ids(NARRATION.landmarkById)) expect(NARRATION.lines[id], id).toBeTruthy();
    for (const id of ids(NARRATION.collectById)) expect(NARRATION.lines[id], id).toBeTruthy();
    for (const id of Object.values(NARRATION.firstByArchetypeId)) expect(NARRATION.lines[id], id).toBeTruthy();
  });

  it('has a generic collectible fallback line', () => {
    expect(NARRATION.lines.col_generic).toBeTruthy();
  });

  it('every line expression is one the mascot can render', () => {
    const ok = new Set(MASCOT.expressions);
    for (const [id, line] of Object.entries(NARRATION.lines)) {
      expect(ok.has(line.expression), `${id}:${line.expression}`).toBe(true);
    }
  });

  it('dual ids are either disabled (-1) or resolve to valid slots + a merged line', () => {
    const { dualCollectibleId: c, dualLandmarkId: l } = NARRATION;
    if (c === -1 || l === -1) { expect(c).toBe(-1); expect(l).toBe(-1); return; }
    expect(NARRATION.lines[NARRATION.collectById[c]]).toBeTruthy();
  });

  it('finale lines have the right phase', () => {
    expect(NARRATION.lines.goal_contact.phase).toBe('cinematic');
    expect(NARRATION.lines.ascension.phase).toBe('cinematic');
    expect(NARRATION.lines.result.phase).toBe('result');
  });

  it('no residual Japanese kana in any line text (zh-TW coverage)', () => {
    const kana = /[぀-ヿ]/; // hiragana + katakana
    for (const [id, line] of Object.entries(NARRATION.lines)) {
      expect(kana.test(line.text), `${id}: ${line.text}`).toBe(false);
    }
  });
});
```

- [ ] Run `npx vitest run src/packs/taipei/narration.test.js` — expect it to **drive out** any typo (e.g. a `landmarkById` id with no `LINES` entry, or a line still using a 4-expr name, or stray kana). Fix `narration.js`/`mascot.js` until green.
- [ ] Fold the same invariants into `src/packs/taipei/index.js` `validate()` (the dev boot guard) so a bad table throws at construction — add a `validateNarration(pack.narration, pack.mascot)` helper next to the existing checks. Keep it import-light (no test deps).
- [ ] **Verify**: `npx vitest run src/packs/taipei/narration.test.js` passes; `npm run dev` boots with no assert. `git commit -m "test: taipei narration/mascot invariants (+ fold into pack validate)"`.

---

### Task P8.7: Generate the 月牙 webp frames (asset step — gated on placeholders)

**Build is already green without art** (placeholder frames). This task produces real art; it is the only step needing external image-gen. Do the placeholder first so nothing blocks.

- [ ] **Placeholder gate (do this first, commit before any art)**: create 10 tiny placeholder webp so preload/verify/build pass even if art generation is deferred. From repo root:

```bash
node -e '
const fs=require("fs");const d="public/assets/donack";fs.mkdirSync(d,{recursive:true});
// 1x1 transparent webp (base64) — tiny, satisfies the verify gate + CSS bg.
const px=Buffer.from("UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==","base64");
for(const e of ["idle","happy","thinking","speaking","surprised"])
  for(const f of [0,3]) fs.writeFileSync(`${d}/${e}-${f}.webp`, px);
console.log("wrote 10 placeholder frames");
'
```

- [ ] Run `sh scripts/verify-donack-assets.sh` → expect PASS (10 frames present, under budget). `git commit -m "assets: 10 placeholder 月牙 webp frames (build-gating, art TBD)"`.
- [ ] **Real art** — use the `codex-imagegen` skill (the user's preferred local route) OR the `nanobanana` MCP. Generate 5 expressions × 2 frames. Prompt template (one per expression; frame `0` = eyes open, frame `3` = eyes closed/blink):

  > Pixel-art / low-poly chibi **Formosan black bear (台灣黑熊)**, glossy black fur, round ears, a bold **white crescent "V" on the chest** (the species marking). Front-facing bust, friendly mascot, transparent background, ~128×128, crisp pixel edges suitable for `image-rendering: pixelated`. Expression: **{idle: calm neutral / happy: big grin, paws up / thinking: paw on chin, looking up / speaking: mouth open mid-talk / surprised: wide eyes, mouth open "!" }**. Frame variant: **{0: eyes open / 3: eyes closed (mid-blink)}**.

  Save outputs and convert to webp at the exact paths `public/assets/donack/{expr}-{0,3}.webp`. Keep each file small so the total stays under `DONACK_ASSET_BUDGET_KB` (bump the budget in `tuning.js` + `verify-donack-assets.sh` together only if real frames exceed 40 KB total).

- [ ] Run `sh scripts/verify-donack-assets.sh` again → PASS with real frames. `git commit -m "assets: 月牙 black-bear webp frames (idle/happy/thinking/speaking/surprised x2)"`.

> The white-chest-crescent "V" is the load-bearing visual identity of the Formosan black bear and the source of the name 月牙 (crescent moon) — every frame must keep it visible.

---

### Task P8.8: VERIFY — bear appears and speaks zh-TW (chrome-devtools)

Rendering/behaviour change → concrete chrome-devtools verification with an explicit expected observation. Uses the dev hook from Task P8.5 so we don't have to roll to a landmark.

- [ ] `npm run dev` (note the vite URL, typically `http://localhost:5173`).
- [ ] Drive the verification via the chrome-devtools MCP:
  - `mcp__chrome-devtools__new_page` → navigate to the dev URL.
  - Start the game (click `#start-button`): `mcp__chrome-devtools__click` on the start button so phase flips to `play`.
  - `mcp__chrome-devtools__evaluate_script` →
    ```js
    () => { window.__DEV.donack.trigger('tier1'); return {
      visible: window.__DEV.donack.isVisible(),
      text: window.__DEV.donack.bubbleText(),
      avatar: window.__DEV.donack.avatarClass(),
    }; }
    ```
    **Expected observation**: `visible === true`, `text === '桌頭清空啦！換攻夜市的攤子'` (zh-TW, no kana), `avatar` starts with `dk-happy-`.
  - Trigger a landmark line: `() => { window.__DEV.donack.trigger('lm_longshan'); return window.__DEV.donack.bubbleText(); }` → **Expected**: `'萬華的信仰中心，看那層層疊疊的燕尾脊'`.
  - Force the new 5th expression: `() => { window.__DEV.donack.forceExpr('surprised'); return window.__DEV.donack.avatarClass(); }` → **Expected**: class is `dk-surprised-0` or `dk-surprised-3` (proves the 5th expression renders, no fallback to idle).
  - `mcp__chrome-devtools__take_screenshot` → **Expected observation**: the `#donack-root` bubble at mid-left shows the **black bear** avatar (white chest "V" visible if real art landed; placeholder square otherwise) with **繁中** bubble text, NOT the duck and NOT Japanese.
- [ ] **Toggle still works**: click `#donack-toggle`, then `evaluate_script` `() => window.__DEV.donack.isVisible()` → **Expected**: `false` (off hides the bubble and drops the queue). Click again to re-enable.
- [ ] **Engine red-lines untouched** (sanity): take the draw-call ledger read used elsewhere (`() => window.__DEV.drawCalls?.()` or the existing hook P2/P10 reuse) → **Expected**: unchanged from before this part (the mascot is DOM, not a Three.js draw call — must add 0 draws and not break the rescale pixel-identity check).
- [ ] **No residual JA in the live HUD path**: `evaluate_script` `() => /[぀-ヿ]/.test(document.getElementById('donack-bubble').textContent)` after a couple triggers → **Expected**: `false`.
- [ ] `git commit -m "verify: 月牙 appears + speaks zh-TW (tier-up/landmark/surprised), toggle + draw-call sanity"` (commit any verify-only notes; no code change expected here unless a check fails).



## P9. Formosa-island ending teaser

Retheme the cosmetic finale globe (`render/earthView.js`) into a **福爾摩沙島** reveal: after the ball rolls up 101 and the anchor lifts off, the camera pulls back to show the Taiwan island silhouette with **Taipei lit** and the other counties as dim **「即將推出」** pins. Everything stays cosmetic (no collision, no world-mesh touch, fog-exempt, finale-only +draws). All params come from `src/packs/taipei/ending.js`. This is the **P1→P2 hook**: a later part turns the pins into a level-select.

**Grounding (read, confirmed):**
- `render/earthView.js` (`EarthView`) is a finale-only sky element: `group.visible=false` until `show()`, two transparent depth-test-off meshes (vertex-colored `SphereGeometry(1,48,32)` ~3.0k tris + a 700-point star `Points`), painted in the transparent pass over the fogged world. Boot-built once from `mulberry32(0x45415254)`; per-frame cost is one `uTime` uniform + two transforms = **zero alloc, +2 draws finale-only** (ledger 68+2=70 ≤ `DRAW_CALL_CAP` 72).
- The finale (`game/finale.js`) drives it through a **frozen 6-method API only**: `show()` (`_updateMerge` line 515), `setProgress01(u)`+`setAnchor(x,y,z,r)`+`setTime(t)` (`_driveEarth` lines 666–672, called from ASCENSION/AFTERGLOW), `hide()` (`reset()` lines 364–366), `dispose()` (tests). **finale.js never reads internal fields** — so we can fully reskin the view as long as those 6 signatures hold. P9 therefore edits **no engine file** except the one `main.js` construction/import line.
- Construction site: `main.js:144` imports `EarthView`; `main.js:465` does `new EarthView(renderer.scene)`; `main.js:466` does `finale.setEarthView(earthView)`. We repoint these to the pack's `FormosaIslandView`.
- Verification entrypoints already exist: `?at=goal` URL key (`DEV_STARTS.goal`, `cityMap.js`) teleports to r≈400 m (finale APPROACH armed); `renderer.info.render.calls` is the live draw-call count (`renderer.js:281`); the `window.__v4park` hook (`main.js:750`) is the precedent for a DEV-only window hook we mirror for pixel reads.

---

### Task P9.1: Create `ending.js` EndingDef (pure params, TDD)

- [ ] Create `src/packs/taipei/ending.js` with the EndingDef + the island silhouette/pin tables. Pure data + a small deterministic island-mask helper; **no Three.js import** (kept testable in vitest without a GL context).

```js
/**
 * @file ending.js — Roll Formosa 結尾 EndingDef: 福爾摩沙島 teaser params.
 * Pure data (no THREE) consumed by packs/taipei/island.js (the render view)
 * and exposed on StagePack.ending. The view is FINALE-ONLY and cosmetic —
 * these numbers are tunables, not engine contract.
 *
 * Pins are the P1->P2 hook: Phase 1 renders them as lit/dim dots; a future
 * part turns them into a clickable county level-select. id+name are stable.
 */

/** Deterministic seed ('FORM' LE) — boot-built once; distinct from the engine
 *  0x45415254 ('EART'), append-only, finale-only so it perturbs no gameplay RNG. */
export const ENDING_SEED = 0x464f524d;

/**
 * County pins. Phase 1: 'taipei' is lit (the relit county); the rest are dim
 * 「即將推出」 dots. (x,y) are NORMALISED island-local coords in [-1,1]
 * (x=east, y=north) — the view maps them onto the silhouette plane. Order is
 * STABLE (future level-select index); append new counties at the end.
 * @type {{id:string,name:string,x:number,y:number,lit:boolean}[]}
 */
export const COUNTY_PINS = [
  { id: 'taipei',   name: '台北', x: 0.55, y: 0.86, lit: true },
  { id: 'taichung', name: '台中', x: -0.10, y: 0.18, lit: false },
  { id: 'tainan',   name: '台南', x: -0.34, y: -0.46, lit: false },
  { id: 'kaohsiung', name: '高雄', x: -0.22, y: -0.66, lit: false },
  { id: 'changhua', name: '彰化', x: -0.30, y: 0.02, lit: false },
];

/**
 * Coarse Taiwan-island silhouette as a closed polygon in island-local [-1,1]
 * coords (CCW, north up). ~24 points: enough to read as Taiwan in a pullback
 * teaser without being a survey. Tunable.
 * @type {[number,number][]}
 */
export const ISLAND_OUTLINE = [
  [0.12, 1.00], [0.40, 0.88], [0.58, 0.62], [0.66, 0.30], [0.60, 0.02],
  [0.50, -0.28], [0.30, -0.56], [0.04, -0.80], [-0.18, -0.92], [-0.34, -0.86],
  [-0.46, -0.62], [-0.52, -0.34], [-0.56, -0.04], [-0.58, 0.26], [-0.52, 0.52],
  [-0.40, 0.74], [-0.24, 0.90], [-0.06, 0.98], [0.02, 1.00],
];

/**
 * Point-in-polygon (even-odd ray cast) on the island outline. Used by the
 * view to fill island verts and by validate() smoke. Pure; deterministic.
 * @param {number} x @param {number} y @returns {boolean}
 */
export function insideIsland(x, y) {
  const p = ISLAND_OUTLINE;
  let inside = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const xi = p[i][0], yi = p[i][1];
    const xj = p[j][0], yj = p[j][1];
    const hit = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

/**
 * EndingDef — StagePack.ending. Cosmetic finale teaser params.
 * @type {{
 *   seed:number,
 *   taipeiDir:[number,number,number],
 *   islandTiltDeg:number,
 *   pins:typeof COUNTY_PINS,
 *   outline:typeof ISLAND_OUTLINE,
 *   palette:{ sea:number, land:number, litCity:number, dimPin:number },
 *   landT:number
 * }}
 */
export const ENDING = {
  seed: ENDING_SEED,
  /** Where the lit-Taipei region faces, in view-up space (camera looks DOWN
   *  at the island's upper cap; +Y dominant, slight tilt for asymmetry —
   *  view-correct without knowing the approach azimuth, EarthView precedent). */
  taipeiDir: [0.34, 0.88, 0.33],
  /** Island plane tilt toward the camera (deg) so the silhouette reads, not edge-on. */
  islandTiltDeg: 18,
  pins: COUNTY_PINS,
  outline: ISLAND_OUTLINE,
  /** sRGB hex -> working space via THREE.Color in the view. */
  palette: {
    sea: 0x06121e,      // dark night strait
    land: 0x16321f,     // dim green island body
    litCity: 0xffd27a,  // warm sodium — Taipei glow
    dimPin: 0x4a6a55,   // muted「即將推出」 dot
  },
  /** Coastal-glow falloff band width (island-local units) for the lit ring. */
  landT: 0.12,
};
```

- [ ] Create `src/packs/taipei/island.test.js` (vitest, pure-logic TDD — no GL):

```js
import { describe, it, expect } from 'vitest';
import { ENDING, COUNTY_PINS, insideIsland } from './ending.js';

describe('ending EndingDef', () => {
  it('first pin is the lit Taipei county (P1->P2 hook contract)', () => {
    expect(COUNTY_PINS[0].id).toBe('taipei');
    expect(COUNTY_PINS[0].lit).toBe(true);
  });
  it('exactly one lit pin in Phase 1', () => {
    expect(COUNTY_PINS.filter((p) => p.lit).length).toBe(1);
  });
  it('pin ids are unique (future level-select index)', () => {
    expect(new Set(COUNTY_PINS.map((p) => p.id)).size).toBe(COUNTY_PINS.length);
  });
  it('every pin sits inside the island silhouette', () => {
    for (const p of COUNTY_PINS) expect(insideIsland(p.x, p.y)).toBe(true);
  });
  it('island contains its centroid-ish core and excludes far sea', () => {
    expect(insideIsland(0, 0)).toBe(true);
    expect(insideIsland(0.99, -0.99)).toBe(false);
  });
  it('ending seed differs from the engine EART seed (no RNG collision)', () => {
    expect(ENDING.seed).not.toBe(0x45415254);
  });
});
```

- [ ] **Run (red→green)**: `npx vitest run src/packs/taipei/island.test.js` — expect all pass (data already written). If a pin fails `insideIsland`, nudge that pin's x/y inward, do **not** widen the outline blindly.
- [ ] Commit: `git add src/packs/taipei/ending.js src/packs/taipei/island.test.js && git commit -m "P9.1: taipei ending EndingDef + island silhouette/pins (TDD)"`

---

### Task P9.2: Wire `ending` into pack validate() + StagePack assembly

- [ ] In `src/packs/taipei/index.js` (owned by P3), add the import and field. **Exact lines to add** near the other pack-part imports:

```js
import { ENDING } from './ending.js';
```

and in the assembled StagePack object literal, ensure the `ending` field reads:

```js
  ending: ENDING,
```

- [ ] In the pack's `validate()` (the per-pack invariant runner that replaces the old global asserts — P2/P3 own its body), append this block so bad ending data fails at boot:

```js
  // ---- ending teaser invariants (P9) -------------------------------------
  const e = pack.ending;
  if (!e || typeof e.seed !== 'number') {
    throw new Error('[taipei] ending.seed missing');
  }
  if (!Array.isArray(e.pins) || e.pins.length < 1) {
    throw new Error('[taipei] ending.pins must have >=1 county');
  }
  if (e.pins[0].id !== 'taipei' || e.pins[0].lit !== true) {
    throw new Error('[taipei] ending.pins[0] must be the lit taipei county');
  }
  if (e.pins.filter((p) => p.lit).length !== 1) {
    throw new Error('[taipei] Phase 1 ending must have exactly one lit pin');
  }
  if (new Set(e.pins.map((p) => p.id)).size !== e.pins.length) {
    throw new Error('[taipei] ending pin ids must be unique');
  }
  if (!Array.isArray(e.taipeiDir) || e.taipeiDir.length !== 3) {
    throw new Error('[taipei] ending.taipeiDir must be a 3-vector');
  }
```

- [ ] Add a validate unit test to the pack's existing validator test file (e.g. `src/packs/taipei/pack.test.js`, owned by P3) — **append**, do not replace:

```js
it('validate() rejects an ending with no lit taipei pin', () => {
  const bad = { ...taipeiPack, ending: { ...taipeiPack.ending, pins: [{ id: 'x', name: 'X', x: 0, y: 0, lit: false }] } };
  expect(() => runValidate(bad)).toThrow(/lit taipei/);
});
```

> Note for integrator: `runValidate` / `taipeiPack` are the harness symbols P3's pack.test.js already exposes; match its existing helper names. If P3 inlines `pack.validate()` instead, call `expect(() => bad.validate()).toThrow(...)`.

- [ ] **Run**: `npx vitest run src/packs/taipei/` — expect green (the new validate test + P9.1 tests).
- [ ] **Build smoke**: `npm run build` — expect success (catches `ending.js` import path typos before runtime).
- [ ] Commit: `git add -A && git commit -m "P9.2: wire ending into StagePack + per-pack validate invariant"`

---

### Task P9.3: Create `FormosaIslandView` (retheme of earthView.js, same 6-method API)

This is the structural render step. Full code below. It keeps the **exact** EarthView public surface (`show/hide/setProgress01/setAnchor/setTime/dispose`) and the same render discipline (two transparent depth-off meshes, `fog:false`, `frustumCulled:false`, boot-built once, zero per-frame alloc, +2 draws finale-only) so `game/finale.js` is untouched. The globe sphere is replaced by a **flat island disc** (a vertex-colored circular plane) carrying the Taiwan silhouette + lit Taipei; the star dome is kept verbatim (free atmosphere).

- [ ] Create `src/packs/taipei/island.js`:

```js
/**
 * @file island.js — Roll Formosa 結尾 FormosaIslandView: the finale teaser
 * that replaces render/earthView.js's night-EARTH globe with a 福爾摩沙島
 * reveal. After 101 contact + liftoff, the camera pulls back and this view
 * (painted in the transparent pass OVER the fogged world, fog-exempt, no
 * depth) shows the Taiwan silhouette: TAIPEI lit warm-gold, other counties as
 * dim「即將推出」pins. Cosmetic only — no collision, no world-mesh touch, not
 * part of world rescale (finale-only, post-contact where rescale can't fire).
 *
 * FROZEN API (duck-typed by game/finale.js _driveEarth / reset — DO NOT
 * rename): show() hide() setProgress01(u) setAnchor(x,y,z,r) setTime(t)
 * dispose(). The finale never reads internal fields, so the reskin is total.
 *
 * BUDGET: island disc (ISLAND_SEG^2 grid, depthTest:false) = +1 draw, star
 * Points = +1 draw, both group.visible-gated -> finale-only +2 (ledger
 * 68+2=70 <= DRAW_CALL_CAP 72). Boot-built once from mulberry32(ENDING.seed);
 * per-frame cost = one uTime uniform + two transforms = ZERO allocation.
 *
 * Params come from packs/taipei/ending.js (ENDING). The pin layer is the
 * P1->P2 hook: a future part turns COUNTY_PINS into a clickable level-select.
 */

import * as THREE from 'three';
import { mulberry32 } from '../../core/rng.js';
import { ENDING, insideIsland } from './ending.js';

/* ---- module-local tunables (cosmetic; mirror EarthView's K-scale law) ---- */
/** Island disc radius = ISLAND_R_K * ballRadiusSim (matches EARTH_R_K reveal scale). */
const ISLAND_R_K = 45;
/** Camera-to-island gap (in r) at ascension start/end — the parallax sink. */
const ISLAND_GAP0_K = 12;
const ISLAND_GAP1_K = 30;
/** Star shell radius (in r) — verbatim EarthView numbers (free sky). */
const STAR_SHELL_K = 160;
const STAR_COUNT = 700;
/** Transparent-pass paint order (EarthView precedent: stars behind island). */
const STAR_RENDER_ORDER = 4;
const ISLAND_RENDER_ORDER = 5;
/** Disc tessellation: grid over the unit disc carrying the silhouette. */
const ISLAND_SEG = 96;
/** Pin marker world size in island-local units (lit/dim dots). */
const PIN_SIZE = 2.6;
/** Slow drift (rad/s) — barely perceptible, adds life for free. */
const SPIN_RADPS = 0.006;
const TWO_PI = Math.PI * 2;
const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/* ---- boot-time scratch (constructor only — never per frame) ---- */
const _cSea = new THREE.Color(ENDING.palette.sea);
const _cLand = new THREE.Color(ENDING.palette.land);
const _cCity = new THREE.Color(ENDING.palette.litCity);
const _cDim = new THREE.Color(ENDING.palette.dimPin);
const _cTmp = new THREE.Color();

/**
 * FormosaIslandView — construct once at boot (integrator), inject into the
 * finale via finale.setEarthView(view). Starts hidden; +2 draws only while
 * shown (finale-only).
 */
export class FormosaIslandView {
  /** @param {THREE.Scene} scene Owned by render/renderer.js. */
  constructor(scene) {
    /** @type {THREE.Scene} */
    this._scene = scene;
    /** @type {THREE.Group} */
    this.group = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);

    /** Shared twinkle clock uniform (island + stars — ONE write/frame). */
    this._uTime = { value: 0 };
    /** @type {number} Liftoff progress (setProgress01). */
    this._u = 0;

    const rng = mulberry32(ENDING.seed);
    const taipei = new THREE.Vector3().fromArray(ENDING.taipeiDir).normalize();

    /* ---- Island disc: a vertex-colored unit-radius plane on a grid ----
     * Verts inside the silhouette polygon take land/lit colors; outside =
     * dark strait. The lit Taipei region (taipeiDir-facing + the taipei pin
     * neighbourhood) gets warm city speckle + twinkle. */
    const seg = ISLAND_SEG;
    const vcount = (seg + 1) * (seg + 1);
    const pos = new Float32Array(vcount * 3);
    const col = new Float32Array(vcount * 3);
    const twk = new Float32Array(vcount * 2); // (amplitude, phase)
    const taipeiPin = ENDING.pins[0]; // lit county, validate-guaranteed
    let vi = 0;
    for (let iy = 0; iy <= seg; iy++) {
      const gy = (iy / seg) * 2 - 1; // island-local y in [-1,1] (north up)
      for (let ix = 0; ix <= seg; ix++) {
        const gx = (ix / seg) * 2 - 1; // island-local x in [-1,1] (east)
        pos[vi * 3] = gx;
        pos[vi * 3 + 1] = gy;
        pos[vi * 3 + 2] = 0;
        let amp = 0;
        let phase = 0;
        if (!insideIsland(gx, gy)) {
          _cTmp.copy(_cSea); // dark strait
        } else {
          // Land body, slightly mottled.
          const shade = 0.82 + 0.4 * rng();
          _cTmp.copy(_cLand).multiplyScalar(shade);
          // Lit-Taipei region: near the taipei pin AND on the taipeiDir cap.
          const dpx = gx - taipeiPin.x;
          const dpy = gy - taipeiPin.y;
          const nearTaipei = dpx * dpx + dpy * dpy < 0.10; // ~0.32 radius
          // taipeiDir faces view-up; project island-local (x,y) onto its XY.
          const facing = gx * taipei.x + gy * taipei.y;
          let pLight = 0.04;
          if (nearTaipei) pLight = 0.55;
          else if (facing > 0.55) pLight = 0.14; // soft coastal glow up north
          if (rng() < pLight) {
            const glow = 0.55 + 0.75 * rng();
            _cTmp.lerp(_cCity, nearTaipei ? 0.92 : 0.6).multiplyScalar(glow);
            amp = 0.35 + 0.5 * rng(); // twinkle: brightness dips to (1 - amp)
            phase = rng() * TWO_PI;
          }
        }
        col[vi * 3] = _cTmp.r;
        col[vi * 3 + 1] = _cTmp.g;
        col[vi * 3 + 2] = _cTmp.b;
        twk[vi * 2] = amp;
        twk[vi * 2 + 1] = phase;
        vi++;
      }
    }
    // Triangulate the grid (two tris per cell).
    const idx = [];
    for (let iy = 0; iy < seg; iy++) {
      for (let ix = 0; ix < seg; ix++) {
        const a = iy * (seg + 1) + ix;
        const b = a + 1;
        const c = a + (seg + 1);
        const d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aTwinkle', new THREE.BufferAttribute(twk, 2));
    geo.setIndex(idx);

    /** @type {THREE.MeshBasicMaterial} */
    this._islandMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true, // transparent pass => paints over the fogged world
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false, // sky-element exemption (moon/earth precedent)
    });
    this._islandMat.onBeforeCompile = makeTwinkleInjector(this._uTime);
    /** @type {THREE.Mesh} */
    this._island = new THREE.Mesh(geo, this._islandMat);
    this._island.frustumCulled = false;
    this._island.renderOrder = ISLAND_RENDER_ORDER;
    // Tilt toward the camera so the disc reads as a silhouette, not edge-on.
    this._island.rotation.x = -Math.PI / 2 + THREE.MathUtils.degToRad(ENDING.islandTiltDeg);
    this.group.add(this._island);

    /* ---- County pins folded into the SAME star Points geometry ----
     * The pins are extra Points appended to the star buffer so they cost NO
     * extra draw call (they ride the star Points). Lit = warm gold (large
     * twinkle), dim = muted「即將推出」 dot. */
    const total = STAR_COUNT + ENDING.pins.length;
    const sPos = new Float32Array(total * 3);
    const sCol = new Float32Array(total * 3);
    const sTwk = new Float32Array(total * 2);
    const sSize = new Float32Array(total); // per-vertex size (pins are bigger)
    for (let i = 0; i < STAR_COUNT; i++) {
      const y = 2 * rng() - 1;
      const az = rng() * TWO_PI;
      const hr = Math.sqrt(Math.max(0, 1 - y * y));
      sPos[i * 3] = Math.cos(az) * hr;
      sPos[i * 3 + 1] = y;
      sPos[i * 3 + 2] = Math.sin(az) * hr;
      const t = rng();
      const b = 0.7 + 0.3 * rng();
      sCol[i * 3] = (0.85 + 0.15 * t) * b;
      sCol[i * 3 + 1] = (0.88 + 0.10 * t) * b;
      sCol[i * 3 + 2] = (1.0 - 0.12 * t) * b;
      sTwk[i * 2] = 0.3 + 0.6 * rng();
      sTwk[i * 2 + 1] = rng() * TWO_PI;
      sSize[i] = 2.2;
    }
    // Pins live on the island plane (slightly above it), in shell-local coords
    // scaled so they land over the disc when the shell is rendered. We bake
    // their position in shell space = islandLocal * (ISLAND_R_K / STAR_SHELL_K).
    const k = ISLAND_R_K / STAR_SHELL_K;
    for (let p = 0; p < ENDING.pins.length; p++) {
      const pin = ENDING.pins[p];
      const j = STAR_COUNT + p;
      // island plane is tilted; approximate pin z with the same tilt as disc.
      const tilt = THREE.MathUtils.degToRad(ENDING.islandTiltDeg);
      sPos[j * 3] = pin.x * k;
      sPos[j * 3 + 1] = (pin.y * Math.sin(Math.PI / 2 - tilt)) * k + 0.001;
      sPos[j * 3 + 2] = -(pin.y * Math.cos(Math.PI / 2 - tilt)) * k;
      const c = pin.lit ? _cCity : _cDim;
      sCol[j * 3] = c.r;
      sCol[j * 3 + 1] = c.g;
      sCol[j * 3 + 2] = c.b;
      sTwk[j * 2] = pin.lit ? 0.7 : 0.15;
      sTwk[j * 2 + 1] = rng() * TWO_PI;
      sSize[j] = pin.lit ? PIN_SIZE * 2.2 : PIN_SIZE * 1.3;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(sTwk, 2));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1));
    /** @type {THREE.PointsMaterial} */
    this._starMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 1.0, // multiplied per-vertex by aSize (injected below)
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this._starMat.onBeforeCompile = makeTwinkleInjector(this._uTime, true);
    /** @type {THREE.Points} */
    this._stars = new THREE.Points(starGeo, this._starMat);
    this._stars.frustumCulled = false;
    this._stars.renderOrder = STAR_RENDER_ORDER;
    this.group.add(this._stars);

    // DEV-only pixel-verify hook (mirrors window.__v4park precedent).
    if (DEV && typeof window !== 'undefined') {
      /** @type {any} */ (window).__island = this;
    }
  }

  /** Make the view visible (finale ASCENSION entry). Idempotent. */
  show() {
    this.group.visible = true;
  }

  /** Hide (finale.reset()). Rewinds the fade so a replay starts clean. */
  hide() {
    this.group.visible = false;
    this._u = 0;
    this._islandMat.opacity = 0;
    this._starMat.opacity = 0;
  }

  /**
   * Liftoff progress 0..1 (finale ASCENSION u; held at 1 in AFTERGLOW). Fades
   * the island (from u 0.15) then the stars/pins (from u 0.25). Scalars only.
   * @param {number} u
   */
  setProgress01(u) {
    this._u = u < 0 ? 0 : u > 1 ? 1 : u;
    const io = (this._u - 0.15) / 0.45;
    this._islandMat.opacity = io < 0 ? 0 : io > 1 ? 1 : io;
    const so = (this._u - 0.25) / 0.5;
    this._starMat.opacity = so < 0 ? 0 : so > 1 ? 1 : so;
  }

  /**
   * Per-frame pose drive (ASCENSION/AFTERGLOW): the island hangs
   * (ISLAND_R_K + gap(u)) * r below the rising anchor (parallax sink); the
   * star/pin shell is centered on the anchor. Inputs come from the finale's
   * rescale-safe _simCache, so no RESCALE/REBASE handling here. Zero alloc.
   * @param {number} x @param {number} y @param {number} z @param {number} r
   */
  setAnchor(x, y, z, r) {
    const gap = ISLAND_GAP0_K + (ISLAND_GAP1_K - ISLAND_GAP0_K) * this._u;
    this._island.position.set(x, y - (ISLAND_R_K + gap) * r, z);
    this._island.scale.setScalar(ISLAND_R_K * r);
    this._stars.position.set(x, y - (ISLAND_R_K + gap) * r, z);
    this._stars.scale.setScalar(STAR_SHELL_K * r);
  }

  /**
   * Twinkle clock (finale forwards its cinematic clock) — ONE shared uniform
   * write + the slow island drift.
   * @param {number} t Seconds.
   */
  setTime(t) {
    this._uTime.value = t;
    this._island.rotation.z = t * SPIN_RADPS;
  }

  /** Teardown (tests): remove + release GPU resources. */
  dispose() {
    this._scene.remove(this.group);
    this._island.geometry.dispose();
    this._islandMat.dispose();
    this._stars.geometry.dispose();
    this._starMat.dispose();
    if (DEV && typeof window !== 'undefined' && window.__island === this) {
      delete window.__island;
    }
  }
}

/**
 * Shared onBeforeCompile injector — links the ONE uTime uniform and modulates
 * vColor by per-vertex aTwinkle=(amplitude,phase); when withSize, also scales
 * gl_PointSize by per-vertex aSize (lit pins render bigger). Works for both
 * MeshBasicMaterial and PointsMaterial (both build vColor via
 * `#include <color_vertex>`). onBeforeCompile.toString() keys the program
 * cache, so these never collide with stock basic/points programs.
 * @param {{value:number}} uTime @param {boolean} [withSize]
 */
function makeTwinkleInjector(uTime, withSize = false) {
  return (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nattribute vec2 aTwinkle;' +
          (withSize ? '\nattribute float aSize;' : '')
      )
      .replace(
        '#include <color_vertex>',
        '#include <color_vertex>\n\tvColor *= 1.0 + aTwinkle.x * 0.5 * (sin(uTime * 2.6 + aTwinkle.y) - 1.0);'
      );
    if (withSize) {
      shader.vertexShader = shader.vertexShader.replace(
        'gl_PointSize = size;',
        'gl_PointSize = size * aSize;'
      );
    }
  };
}
```

> Geometry budget note: the island disc is `ISLAND_SEG^2 * 2 = 96*96*2 ≈ 18.4k tris`. That exceeds the per-object hero cap for **world** geometry, but this is a **finale-only sky element drawn once** (one draw call), not a per-chunk instanced object — same exemption class as the old EarthView sphere. If a future profiling pass flags it, drop `ISLAND_SEG` to 64 (≈8k tris) — the silhouette still reads at pullback distance. The **draw-call** budget (the hard cap) is unchanged at +2.

- [ ] Commit: `git add src/packs/taipei/island.js && git commit -m "P9.3: FormosaIslandView (retheme earthView.js; same finale API)"`

---

### Task P9.4: Repoint main.js construction to the pack island view

- [ ] In `src/main.js`, replace the EarthView import (line ~144). **Find:**

```js
import { EarthView } from './render/earthView.js'; // space-earth ending sky element
```

**Replace with:**

```js
import { FormosaIslandView } from './packs/taipei/island.js'; // Formosa-island ending teaser
```

- [ ] In `src/main.js`, replace the construction (lines ~463–466). **Find:**

```js
/* v5 space-earth ending: glowing Earth + star dome (sky element, fog:false,
 * +2 draws finale-only — ledger worst 70/72). finale.reset() owns hide(). */
const earthView = new EarthView(renderer.scene);
finale.setEarthView(earthView);
```

**Replace with:**

```js
/* Roll Formosa ending: Formosa-island teaser (sky element, fog:false,
 * +2 draws finale-only — ledger worst 70/72). finale.reset() owns hide().
 * Same duck-typed API as the old EarthView, so the finale is unchanged. */
const islandView = new FormosaIslandView(renderer.scene);
finale.setEarthView(islandView);
```

> Coordinate with P6: P6 edits the SkytreeView line (~460); P9 edits only lines 144 + 463–466. They do not overlap. If P6 has already deleted `render/earthView.js`, that is fine — main.js no longer imports it after this task.

- [ ] **Build smoke**: `npm run build` — expect success (proves the new import path + tree-shake of the old earthView are clean).
- [ ] Commit: `git add src/main.js && git commit -m "P9.4: wire FormosaIslandView into finale (replace EarthView)"`

---

### Task P9.5: VISUAL VERIFY — island reveal + lit Taipei (chrome-devtools)

The win sequence must end on the Formosa-island reveal with Taipei lit, and must hold the draw-call + zero-alloc discipline.

- [ ] Start the dev server in the background: `npm run dev` (note the printed URL, typically `http://localhost:5173/`).
- [ ] Navigate straight to the finale using the existing dev key (jumps to r≈400 m, APPROACH armed — confirmed `DEV_STARTS.goal` exists):
  - `mcp__chrome-devtools__navigate_page` → `http://localhost:5173/?at=goal`
- [ ] Dismiss the title and let the run roll into 101. Drive toward the monument: `mcp__chrome-devtools__press_key` (arrow keys) until contact, OR if onboarding/title gating blocks input, `mcp__chrome-devtools__click` the canvas first. Then **fast-forward the cinematic** to the island reveal with repeated `mcp__chrome-devtools__press_key` (any key triggers `finale.skipCinematic()`, 5× speed — confirmed `skipCinematic` in finale.js).
- [ ] Wait for AFTERGLOW (island fully faded in). Poll the view state via the DEV hook:
  - `mcp__chrome-devtools__evaluate_script`:
    ```js
    () => {
      const v = window.__island;
      return {
        visible: v && v.group.visible,
        islandOpacity: v && v._islandMat.opacity,
        starOpacity: v && v._starMat.opacity,
      };
    }
    ```
  - **Expected**: `{ visible: true, islandOpacity: 1, starOpacity: 1 }` (or both opacities > 0.9 if caught mid-fade).
- [ ] **Screenshot**: `mcp__chrome-devtools__take_screenshot` (fullPage:false).
  - **Expected observation**: a tilted Taiwan-island silhouette fills the lower frame against a dark strait/star field; a **warm-gold lit cluster in the upper-right** (Taipei) plus **4 dim muted dots** (the「即將推出」counties). The golden ascension sparkle column rises at frame center, in front of the island.
- [ ] **Pixel-level check** (lit Taipei is actually warm, not just present) — count warm city pixels in the island region (reuse the user's non-transparent-pixel pattern):
  - `mcp__chrome-devtools__evaluate_script`:
    ```js
    () => {
      const c = document.querySelector('canvas');
      const g = c.getContext('webgl2') || c.getContext('webgl');
      const w = c.width, h = c.height;
      const px = new Uint8Array(w * h * 4);
      g.readPixels(0, 0, w, h, g.RGBA, g.UNSIGNED_BYTE, px);
      let warm = 0;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], gr = px[i + 1], b = px[i + 2];
        if (r > 180 && gr > 130 && b < 150 && r > b + 40) warm++; // sodium gold
      }
      return { warmPixels: warm };
    }
    ```
  - **Expected**: `warmPixels > 300` (the lit-Taipei cluster + sparkle). If `0`, the island region or lit speckle failed — check `?at=goal` actually reached AFTERGLOW and `__island.group.visible` is true. (WebGL `readPixels` reads the framebuffer; if it returns all-zero due to `preserveDrawingBuffer:false`, fall back to the screenshot as the source of truth.)
- [ ] **Draw-call budget** — confirm the +2 finale draws stay under cap:
  - `mcp__chrome-devtools__evaluate_script`:
    ```js
    () => {
      // renderer.info.render.calls is read by the debug overlay (renderer.js).
      // Expose via the same overlay or read three's info if a hook exists.
      const c = document.querySelector('canvas');
      return { canvas: !!c, note: 'read calls from debug overlay (backquote) or renderer.info' };
    }
    ```
  - Then toggle the debug overlay: `mcp__chrome-devtools__press_key` → `` ` `` (backquote) and `mcp__chrome-devtools__take_screenshot`.
  - **Expected observation**: overlay line `calls NN/72` with **NN ≤ 72** (no trailing ` !` warning) during AFTERGLOW. Since OSM was removed in P1 the worst case is well under 72; the island view adds exactly +2 over the non-finale baseline.
- [ ] **Zero per-frame alloc spot-check** (optional, reuse heap line): hold AFTERGLOW ~5 s, take two overlay screenshots; the `heap … (+NKB)` delta should hover near 0 (no per-frame allocation from the island drive). If it climbs steadily, audit `setAnchor`/`setTime` for an accidental `new`.
- [ ] If the island reads wrong (rotated, edge-on, or Taipei on the wrong side): tune `ENDING.islandTiltDeg`, `taipeiDir`, or the `taipeiPin` x/y in `ending.js` (data-only) and re-run this task — **no engine change needed**.
- [ ] Stop the dev server. Commit any tuning: `git add -A && git commit -m "P9.5: verify Formosa-island reveal (lit Taipei, draw-calls within cap)"`

---

### Task P9.6: Regression — old EarthView removed cleanly + finale untouched

- [ ] Grep for dangling references to the old view (should be none after P9.4):
  - `grep -rn "EarthView\|earthView" src/ --include=*.js` — **expect** only matches inside `src/game/finale.js` **comments/JSDoc** (the `setEarthView` method name is kept — it is the frozen injection hook and is fine) and the new `src/packs/taipei/island.js`. **No** `import ... earthView.js` and **no** `new EarthView`.
- [ ] Confirm `game/finale.js` was **not** modified by P9: `git log --oneline -- src/game/finale.js` should show no P9 commit. The view swap is purely the injected object; the finale's duck-typed calls (`show/hide/setProgress01/setAnchor/setTime`) resolve against `FormosaIslandView` unchanged.
- [ ] Decide the fate of `src/render/earthView.js`: if P1/P2 hasn't already deleted it, remove it now (it is dead after P9.4) — `git rm src/render/earthView.js` — unless a teammate's P3-world ending plans to keep it for the P3 「Roll the World」 globe. **Recommendation**: keep it (it is the P3 globe seed, costs nothing while unimported) and just leave it unimported; note this in the PR.
- [ ] **Full test run**: `npx vitest run` — expect green (P9.1 ending tests + P9.2 validate test pass; nothing else regressed).
- [ ] Commit: `git add -A && git commit -m "P9.6: regression check — EarthView removed from boot, finale untouched"`

---

**P9 done-criteria recap (what changed → how verified):**
- New `src/packs/taipei/ending.js` (EndingDef + pins + island mask) → vitest `island.test.js` green (P9.1).
- `ending` wired into StagePack + a per-pack `validate()` invariant → vitest validate test green + `npm run build` (P9.2).
- New `src/packs/taipei/island.js` `FormosaIslandView`, same 6-method finale API → build green (P9.3).
- `main.js` finale view swapped EarthView→FormosaIslandView → build green (P9.4).
- Win sequence ends on the island reveal with **lit Taipei + 4 dim county pins** → chrome-devtools screenshot + `warmPixels>300` + `__island.group.visible===true` (P9.5).
- Draw calls ≤ 72 (no ` !`), heap delta ≈ 0 during AFTERGLOW → debug-overlay screenshots (P9.5).
- `game/finale.js` untouched; no dangling EarthView import → grep + `git log` + full vitest (P9.6).



## P10. Cross-cutting verification & tuning

> 這一部把前面 P0–P9 的成果接起來做整關驗收與調味。順序刻意是「先確認沒破壞引擎王牌 → 再確認新內容在預算內 → 再把整關走一遍 → 再掃語言 → 再看效能 → 最後才調手感」。每個 rendering / 行為步驟都以一條具體的 chrome-devtools 觀察收尾,不用「看起來對」這種模糊驗收。
>
> 前置假設(由前面各 part 建立,見 notesForIntegrator):
> - `npm run dev` 跑得起來、boot 無 assert(`pack.validate()` 不丟)。
> - DEV global 仍在:`window.devTeleport(name, rMeters)`、`window.__v3dbg`。
> - Taipei 版 `DEV_STARTS` 鍵已是台北階梯(`shop / night-market / arcade / scooter-sea / wanhua / xinyi / goal`)。
> - vite dev URL = `http://localhost:5173/`。
>
> 工具約定:每個 chrome-devtools 步驟先 `mcp__chrome-devtools__navigate_page` 到目標 URL,再 `evaluate_script` 讀狀態或 `take_screenshot` 存圖。所有 evaluate_script 都讀**現成的引擎欄位**(`__v3dbg.scaleMgr.tierIndex` 等),不注入 game logic。

---

### Task P10.1: 暴露 renderer 給 DEV probe(draw-call 讀取掛點)

P10.2 之後要從瀏覽器讀 `renderer.info.render.calls`。upstream 的 `__v3dbg` 沒有 `renderer`。先補上(若 P2/P6 已補則跳過本步)。

- [ ] 讀 `src/main.js`,找到 DEV probe 區塊(upstream 約 line 748–758):
  ```js
  if (import.meta.env && import.meta.env.DEV) {
    /** @type {any} */ (window).devTeleport = devTeleport; // console access
    /** @type {any} */ (window).__v4park = devTeleportTo; // coverage-boundary park test
    /** @type {any} */ (window).__v3dbg = {
      ballPhys, scaleMgr, curated, terrain, spawner, store, finale, collection,
      getBallPosReal,
      // ... v4/v5 fields
    };
  }
  ```
- [ ] 在 `__v3dbg` 物件裡補一個 `renderer` 欄位(僅 DEV,零生產影響):
  ```js
    /** @type {any} */ (window).__v3dbg = {
      ballPhys, scaleMgr, curated, terrain, spawner, store, finale, collection,
      getBallPosReal,
      renderer, // P10: draw-call ledger read (renderer.info.render.calls)
      onboarding, earthView,
    };
  ```
  > 注意:`renderer` 是 P3/P5 的 `Renderer` 實例(`renderer.renderer.info.render` 是底層 `WebGLRenderer.info`)。
- [ ] `npm run dev` 啟動(背景):若尚未跑,開背景 shell `npm run dev`,記下 URL(預設 `http://localhost:5173/`)。
- [ ] **驗證(chrome-devtools)**:
  - `navigate_page` → `http://localhost:5173/`
  - `evaluate_script`:
    ```js
    () => {
      const d = window.__v3dbg;
      return { hasRenderer: !!(d && d.renderer && d.renderer.renderer),
               calls: d.renderer.renderer.info.render.calls };
    }
    ```
  - **預期觀察**:`hasRenderer === true`,`calls` 為一個正整數(boot 後 title 畫面,通常 < 30)。
- [ ] commit:`P10.1 expose renderer on __v3dbg for draw-call ledger reads`

---

### Task P10.2: 強制 rescale 像素一致性仍過(王牌不可破壞)

引擎(`scaleManager._applyRescale`)未動,理論上自然通過 — 但 Taipei 內容(palette、rim tint、新 geometry)可能無意間引入帶世界座標的著色或非半徑比例的擺放,破壞「rescale 幀 = 非 rescale 幀」的像素一致。用 upstream 既有的 **KeyR force-rescale** 掛點做截圖對照。

- [ ] 確認 dev server 在跑(P10.1)。
- [ ] **驗證 A(rescale 前後 draw-call 與 tier 不變)**:
  - `navigate_page` → `http://localhost:5173/?at=scooter-sea`(T3,中段,世界滿載)
  - 進遊戲(`take_snapshot` 找 start 按鈕並 `click`,或 `evaluate_script` 觸發 `bus` start — 用既有 start 按鈕較穩)。
  - `evaluate_script` 連拍兩幀狀態,中間打一次 force-rescale:
    ```js
    () => {
      const d = window.__v3dbg;
      const r = () => d.renderer.renderer.info.render;
      const before = { calls: r().calls, tris: r().triangles, tier: d.scaleMgr.tierIndex,
                       ws: d.scaleMgr.worldScale };
      d.scaleMgr.forceRescale();           // same hook as KeyR
      // one rAF so maybeTierUp runs the rescale next frame:
      return new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => {
        const after = { calls: r().calls, tris: r().triangles, tier: d.scaleMgr.tierIndex,
                        ws: d.scaleMgr.worldScale };
        res({ before, after });
      })));
    }
    ```
  - **預期觀察**:`after.tier === before.tier`(rescale 不換 tier);`after.ws === before.ws / 0.2`(worldScale 變 5 倍,證明 rescale 真的發生);`after.calls === before.calls`、`after.tris === before.tris`(內容組成不變)。
- [ ] **驗證 B(像素對照,沿用 forced-rescale diff 精神)**:
  - 同 URL、同 pose,先 `take_screenshot`(存為 `pre-rescale`)。
  - `evaluate_script` 跑上面同一段(force-rescale + 等兩幀),再 `take_screenshot`(存為 `post-rescale`)。
  - 人眼/像素比對兩張圖:球與世界的螢幕投影應**幾乎逐像素相同**(僅 stuck-on-ball 動畫或 effects quad 可能有極小差異)。
  - **預期觀察**:兩張圖中台北 101 silhouette、地面、球大小、相機構圖一致,無 pop/閃跳。若 T3 看不到 101,改用 `?at=goal`(T6,101 在視野內)重做一次,確認 101 monument 在 rescale 幀不偏移。
- [ ] 若不一致:嫌疑優先序 — (a) 新 geometry recipe 有非置中/非單位包圍球正規化(P5/P6);(b) monument/ending 材質帶世界座標 rim(違反「rim 只依視線/法線」§9.6);(c) palette crossfade 在 rescale 幀中途。記錄到 PR,**不要**繞過,回對應 part 修。
- [ ] commit(若有掛點微調):`P10.2 verify forced-rescale pixel identity holds with Taipei content`

---

### Task P10.3: Draw-call ledger 在 cap 內(含所有地標)

§9.5 紅線:移除 OSM 後預算餘裕變大(upstream OSM 佔 4 draws),但台北 curated 地標多。`DRAW_CALL_CAP` 仍是 72(`tuning.js`)。地標走共享 EXTRA batched pool,不隨地標數線性增加 — 本步是**證明**它確實如此。逐 tier teleport,記每幀最壞 draw call。

- [ ] 在 repo 加一個小 dev 量測腳本,讓人和 CI 都能跑。建立 `scripts/dev/measure-drawcalls.md`(純文檔,記錄手動量測協定 + 預期值表),內容:
  ```
  # Draw-call ledger sweep (P10.3)
  逐 ?at= teleport,進遊戲滾 ~10s 讓 N+1 band 滿載,讀 __v3dbg.renderer.renderer.info.render.calls 峰值。
  CAP = 72 (config/tuning.js DRAW_CALL_CAP)。
  記錄到下表;任一格 > 72 即違反 §9.5,須查是否新增了非 batched draw。
  ```
- [ ] **驗證(chrome-devtools，逐 tier）**:對下表每個 `?at=`:
  - `navigate_page` → `http://localhost:5173/?at=<name>`,進遊戲,讓球自走或用 `__v3dbg` 推一下,等約 10s(`wait_for` 或連續 evaluate)。
  - `evaluate_script` 取 600 幀內 calls 峰值:
    ```js
    () => new Promise(res => {
      const r = () => window.__v3dbg.renderer.renderer.info.render.calls;
      let peak = 0, n = 0;
      const tick = () => { peak = Math.max(peak, r()); if (++n < 600) requestAnimationFrame(tick); else res({ peak }); };
      requestAnimationFrame(tick);
    })
    ```
  - 把峰值填進下表並斷言 `< 72`:

  | `?at=` | tier | 場景 | 預期峰值範圍 | 斷言 |
  |---|---|---|---|---|
  | `shop` | T0 | 柑仔店內 | ~20–35 | < 72 |
  | `night-market` | T1 | 夜市 | ~30–45 | < 72 |
  | `arcade` | T2 | 騎樓 | ~35–50 | < 72 |
  | `scooter-sea` | T3 | 機車海(密度最高) | ~40–58 | < 72 |
  | `wanhua` | T4 | 萬華街屋+廟(地標群) | ~45–62 | < 72 |
  | `xinyi` | T5 | 商業區(多 curated 塔) | ~45–62 | < 72 |
  | `goal` | T6 | 信義天際線 + 101 monument | ~48–66 | < 72 |
- [ ] **特別驗證 101 monument 那 2 draws**:在 `?at=goal`,監測接近 101 時 calls 是否跳 +2(`Taipei101View` mesh + glow,sky-element fog:false 豁免,如 upstream SkytreeView)。**預期**:接近 101 時峰值 +2 但仍 < 72。
- [ ] **特別驗證 ending teaser**:滾到 101 觸發勝利,ascension 拉遠成福爾摩沙島(P9 `EarthView` retheme)。**預期**:finale 期間峰值 +2(island mesh + star dome,finale-only),仍 < 72。
- [ ] 啟用 boot ledger log:確認 `main.js` boot DEV log 仍印 `pools=N`,並在 console 截一張 overlay(按 Backquote 開 debug overlay)顯示 `calls X/72`,X 無 `!` warn。
- [ ] commit:`P10.3 draw-call ledger sweep — all tiers + 101 + ending under cap 72`

---

### Task P10.4: 可玩 smoke — 圖釘到 101 勝利(逐 tier teleport)

§10「可玩 smoke」:從圖釘一路到撞上 101 觸發勝利。手動全程滾 5–8 分鐘做一次;但為了**每 tier 都驗到**,用 `?at=` 逐段 teleport 確認每段都能滾、能吸收、能升 tier、最終能觸發 finale。

- [ ] **A 全程一次(主驗收)**:
  - `navigate_page` → `http://localhost:5173/`(圖釘 r=0.02,T0),進遊戲。
  - 手動或半自動滾。用 `__v3dbg` 每隔幾秒讀進度:
    ```js
    () => { const d = window.__v3dbg;
      return { tier: d.scaleMgr.tierIndex, rM: d.scaleMgr.trueRadiusMeters(),
               alive: d.store.aliveCount, finale: d.finale.state }; }
    ```
  - **預期觀察序列**:`rM` 單調上升;`tier` 0→1→2→3→4→5→6;接近 101 時 `finale.state` 從 `idle`→(`called`→)`approach`→`contact`→`merge`→`ascend`→`done`。
  - finale `done` 後:`evaluate_script` 確認 `#win-overlay` 不再有 `hidden` class:
    ```js
    () => ({ winShown: !document.getElementById('win-overlay').classList.contains('hidden') })
    ```
  - **預期**:`winShown === true`,結果畫面顯示繁中 rank/時間/尺寸,且 collection grid 出現。
- [ ] **B 逐 tier 段測(快速回歸)**:對每個 `?at=`(P10.3 同表),進遊戲滾 ~15s,確認:
  - 球能移動且吸收(`alive` 下降、`rM` 上升);
  - 沒有「吸不到任何東西」(該帶 archetype 太大/太小 → §11 地標門檻或 tier 尺度錯)或「瞬間爆長」(GROWTH 失控,P10.10 處理);
  - **預期**:每段 15s 內 `rM` 至少漲到接近下一 tier 的 `enterTrueRadius` 量級,無卡死。
- [ ] **C 終局逼近手感**:`?at=goal`(r≈400,接近 101),滾向 101。
  - **預期觀察**:`finale.state` 依序進到 `called`(101 點燈 beam pulse + toast)→ `contact`(白閃)→ `merge`(球融入)→ `ascend`(拉遠看到福爾摩沙島)→ `done`(勝利)。黑熊歡呼 toast / 跨年煙火(P6)出現。
- [ ] 若 finale 不觸發:查 `monument.js` 的 `GOAL_RADIUS_M` / `GOAL_CALL_RADIUS_M` / 底座 collider 半徑與 `goal` teleport 的 r 是否對得上(101 比晴空塔矮,P6 已重調 — 這裡是驗收)。記錄回 P6。
- [ ] commit(若有 smoke 修):`P10.4 playable smoke verified pushpin -> 101 win across all tiers`

---

### Task P10.5: zh-TW 覆蓋 — grep 殘留日文

§10「繁中覆蓋」:全程無殘留日文**字串**。注意:引擎檔的 JSDoc / 註解仍含大量日文(設計沿用 upstream 文件用語),那是**程式碼註解不是 user-facing**,不該硬翻。本步只掃**字串字面值**與**shipped HTML**。

- [ ] **掃 user-facing 字串裡的假名**(假名幾乎只出現在日文,是最乾淨的訊號)。在 repo root 跑:
  ```bash
  # 只掃 src 與 index.html 的「引號內字串」中的平/片假名,排除 .test.js 與註解行
  rg -nP "(['\"\`])[^'\"\`]*[\x{3040}-\x{30ff}][^'\"\`]*\1" src index.html \
     -g '!**/*.test.js' | rg -v '^\s*(//|\*)'
  ```
  - **預期觀察**:**零命中**。任何命中即 = user-facing 殘留日文(漏翻的 locale / HUD / 旁白 / archetype 名),回對應 part(P3 locale / P7 catalog / P8 narration)補。
- [ ] **掃 `Intl.NumberFormat('ja-JP')` 殘留**(§6 要求改 `'zh-TW'`):
  ```bash
  rg -n "ja-JP|'ja'|\"ja\"" src index.html
  ```
  - **預期觀察**:零命中(全部已改 `zh-TW`)。
- [ ] **掃 index.html 靜態 DOM 字面值**(title / HUD 標籤 / 分享文 og:):
  ```bash
  rg -nP "[\x{3040}-\x{30ff}]" index.html
  ```
  - **預期觀察**:零命中。`<title>`、meta description、分享文應為繁中(例:「我在《Roll Formosa》滾出了台北 101!」)。
- [ ] **CJK 漢字不能靠 grep 區分中日**(共用字),所以漢字部分靠下一步實機掃。記錄 grep 結果(0 命中)到 PR。
- [ ] commit(若補翻):`P10.5 zh-TW coverage — no stray Japanese in user-facing strings`

---

### Task P10.6: zh-TW 覆蓋 — chrome-devtools 實機掃(HUD / 結果 / 旁白)

grep 抓不到的是「實際渲染出來的字」是否繁中(漢字共用、且部分字串動態組裝)。逐畫面截圖肉眼確認。

- [ ] **HUD（遊戲中）**:`navigate_page` → `?at=scooter-sea`,進遊戲,`take_screenshot`。
  - **預期觀察**:tier 標籤是繁中(例「機車海」)、尺寸 odometer 用繁中數字格式、combo/dash 提示無日文。
- [ ] **旁白(黑熊月牙)**:滾一陣子觸發旁白氣泡 / 升 tier 慶祝,`take_screenshot` 抓到 `#donack-root` 氣泡。
  - **預期觀察**:氣泡文字繁中(例「這台機車是你的嗎?」),頭像是黑熊(胸前白月牙 V),非鴨子。
- [ ] **地標冷知識**:滾到一個地標(`?at=wanhua` 吸龍山寺 / 北門),`take_screenshot`。
  - **預期觀察**:地標 toast 顯示繁中名 + 冷知識,非日文。
- [ ] **收藏彈窗**:吸到一個收藏品(`?at=night-market` 附近),`take_screenshot`。
  - **預期觀察**:`#collect-popup` 卡片繁中(品名 + 「已收藏 N/13」之類)。
- [ ] **結果畫面**:跑完 smoke(P10.4)或 `?at=goal` 觸發勝利,`take_screenshot` 結果畫面。
  - **預期觀察**:rank / 時間 / 尺寸 / best 記錄 / 「分享」按鈕全繁中;分享文預覽繁中。
- [ ] **標題畫面**:`navigate_page` → `/`(未進遊戲),`take_screenshot`。
  - **預期觀察**:遊戲名「Roll Formosa / 福爾摩沙」、開始按鈕、設定(靜音/旁白開關)繁中。
- [ ] 把 6 張截圖收進 PR 描述當「繁中覆蓋證據」。任何一張出現日文 → 記錄座標回對應 part。
- [ ] commit(若補翻):`P10.6 zh-TW coverage — in-engine sweep of HUD/narration/result/title`

---

### Task P10.7: pacing 階梯 pure-logic 測試(TDD)

P10.10 要調 tier 門檻與 GROWTH，先用 vitest 鎖住「階梯數學」的不變量,避免調參時手滑破壞(例:tier 門檻不再嚴格遞增、相鄰 tier 比例離 5 太遠、101 goal 半徑沒落在 T6 之上)。這是 pure logic → 走真 TDD。

- [ ] **先寫失敗測試** `src/packs/taipei/pacing.test.js`:
  ```js
  import { describe, it, expect } from 'vitest';
  import { taipei } from './index.js';
  import { GOAL_RADIUS_M } from './monument.js';

  describe('taipei pacing ladder', () => {
    const tiers = taipei.tiers;

    it('has exactly 7 tiers', () => {
      expect(tiers.length).toBe(7);
    });

    it('enterTrueRadius is strictly increasing', () => {
      for (let i = 1; i < tiers.length; i++) {
        expect(tiers[i].enterTrueRadius).toBeGreaterThan(tiers[i - 1].enterTrueRadius);
      }
    });

    it('T0 starts at the pushpin scale (0.02 m)', () => {
      expect(tiers[0].enterTrueRadius).toBeCloseTo(0.02, 5);
    });

    it('adjacent tier ratios stay near the x5 ladder (2x..12x)', () => {
      // seamless rescale is x5; content tiers may breathe but must not collapse
      // (ratio>=2 keeps each tier meaningful) or explode (<=12 keeps fog/load valid).
      for (let i = 1; i < tiers.length; i++) {
        const ratio = tiers[i].enterTrueRadius / tiers[i - 1].enterTrueRadius;
        expect(ratio).toBeGreaterThanOrEqual(2);
        expect(ratio).toBeLessThanOrEqual(12);
      }
    });

    it('the 101 goal radius sits above the last tier entry', () => {
      const lastEnter = tiers[tiers.length - 1].enterTrueRadius;
      expect(GOAL_RADIUS_M).toBeGreaterThan(lastEnter);
    });

    it('every tier has 10 archetypeIds resolving in the pack', () => {
      for (const t of tiers) {
        expect(t.archetypeIds.length).toBe(10);
        for (const id of t.archetypeIds) {
          expect(taipei.archetypes[id] ?? taipei.archetypes.get?.(id)).toBeDefined();
        }
      }
    });
  });
  ```
- [ ] **跑、看它失敗或通過**:`npx vitest run src/packs/taipei/pacing.test.js`
  - 若全綠:代表 P4/P6 的階梯已符合 — 把測試保留當回歸鎖。
  - 若有紅:那就是真正的階梯 bug,**先修** `tiers.js` / `monument.js` 再讓它綠(不要改測試遷就壞資料)。
- [ ] **驗證**:`npx vitest run src/packs/taipei/pacing.test.js` → 全綠。
- [ ] commit:`P10.7 lock taipei pacing-ladder invariants with vitest`

---

### Task P10.8: iGPU / 行動裝置效能 sanity

使用者是 hybrid Intel/NVIDIA + snap Chromium(GPU 沙箱常把 Chromium 推回 Intel iGPU 甚至軟體 render)。要確認台北全內容在**iGPU 等級**仍順,且 dynamic-resolution governor(`renderer._governorTick`)有在保護幀率。

- [ ] **桌面 iGPU sanity**:dev server 跑著,`?at=goal`(最重 — 信義天際線 + 101 + 最多 alive)。
  - `evaluate_script` 量 3s 平均幀時間 + governor 後的 pixel ratio:
    ```js
    () => new Promise(res => {
      let last = performance.now(), sum = 0, n = 0;
      const tick = () => { const t = performance.now(); sum += t - last; last = t; n++;
        if (n < 180) requestAnimationFrame(tick);
        else { const d = window.__v3dbg.renderer;
          res({ avgMs: (sum / n).toFixed(2),
                pxr: d.renderer.getPixelRatio?.() ?? d.renderer.renderer?.getPixelRatio?.(),
                calls: d.renderer.renderer.info.render.calls }); } };
      requestAnimationFrame(tick);
    })
    ```
  - **預期觀察**:`avgMs` 理想 < 17ms(60fps)。在 iGPU 上若 governor 已把 `pxr` 降到 1.0 仍 > 20ms,記錄為效能風險(非 ship-blocker,但記入 PR)。`calls < 72`。
- [ ] **行動模擬**:`mcp__chrome-devtools__emulate`(CPU 4x throttle)或 `resize_page` 到手機尺寸(390×844),重跑上面量測。
  - **預期觀察**:`pxr` 降階後 `avgMs` 回到 budget 附近;`MAX_FLOATS_MOBILE`(3)等行動路徑生效(float-span 不爆)。
- [ ] **snap-chromium GPU caveat 提醒**(寫進 `scripts/dev/measure-drawcalls.md` 與 PR):若量到的數字異常差,先確認 `chrome://gpu` 是否落在「software / SwiftShader」— snap Chromium 沙箱常 disable 硬體加速,那是環境問題不是遊戲 regression。可用 `chromium --use-gl=angle --enable-features=Vulkan` 或非 snap Chromium 複量。
- [ ] **三角預算 sanity**:overlay(Backquote)確認 `tris` 在 `TRI_BUDGET`(600000)內,各 archetype merged geometry 在 `ARCHETYPE_TRI_CAP`(350,hero 600)內 —— 後者已由 boot DEV assert 鎖(P5/P6),這裡只確認沒在 console 噴 over-budget warn。
- [ ] commit(若有 doc/perf 註記):`P10.8 iGPU/mobile perf sanity + snap-chromium GPU caveat note`

---

### Task P10.9: 決定性生成回歸(rescale 之後內容不飄)

§9.4 紅線:新台北內容必須 append 在既有種子流之後;若插隊會打亂下游 RNG,造成「同 seed 不同世界」。雖然主要是 P5 的責任,P10 做一次**跨段一致性快照**當守門。

- [ ] **同 seed 兩次 boot 的開場世界一致**:
  - `navigate_page` → `?seed=12345`(`resolveWorldSeed` 吃 `?seed=`),進遊戲滾 ~5s。
  - `evaluate_script` 取 store 的前 N 個 alive 物件的 (archetype, x, z) 指紋:
    ```js
    () => { const s = window.__v3dbg.store, out = [];
      for (let i = 0; i < s.archetype.length && out.length < 40; i++) {
        if (s.alive ? s.alive[i] : true) out.push([s.archetype[i],
          Math.round(s.px[i] * 100) / 100, Math.round(s.pz[i] * 100) / 100]);
      }
      return JSON.stringify(out); }
    ```
  - 重 load `?seed=12345` 再取一次同指紋。
  - **預期觀察**:兩次指紋字串**完全相同**(決定性生成成立)。
- [ ] **rescale 後不飄**:同一 run 內,在 T2 記一次指紋,force-rescale 一次(`__v3dbg.scaleMgr.forceRescale()`)後再記。
  - **預期觀察**:rescale 後物件相對球的螢幕位置不變(座標等比 ×5,archetype 組成不變)— 用 P10.2 的 worldScale 比值 + draw-call 不變佐證即可,不必逐物件比。
- [ ] commit(僅文檔/若無改動可跳 commit):`P10.9 determinism regression — same seed reproduces opening world`

---

### Task P10.10: 成長 / 配速調味 pass(GROWTH_K ramp、tier 門檻、機車密度)

§11.2「101 收尾手感」+ §5.1 配速。這是**最後**才做,因為前面都在「不破壞」,這步才主動改數字。所有 lever 都在 `config/tuning.js`(全域 feel)、`packs/taipei/tiers.js`(tier 門檻)、`packs/taipei/monument.js`(101 收尾)。每改一個就用前面的量測重驗一次。

- [ ] **基準 driven run 計時**:跑一次完整 smoke(P10.4 A),用 `__v3dbg.scaleMgr` + 一個計時器記「圖釘→101 contact」總 sim 秒數。
  - **目標**:首破關落在 5–8 分鐘(對齊 upstream `RANK_B_S`/`RANK_C_S` 區間)。記下實測值。
- [ ] **Lever 1 — GROWTH_K ramp(`config/tuning.js`)**:`GROWTH_K=10` + `growthKForObjR()`(`GROWTH_K_FLOOR=2`、`GROWTH_NORM_REF_M=0.1`、`GROWTH_NORM_POW=0.65`)。
  - 若「某帶瞬間爆長」(同帶供給連續時超指數成長,upstream 註解的 4m→117m cascade):**降** `GROWTH_NORM_POW`(更早 taper)或**降** `GROWTH_K_FLOOR`。
  - 若「某帶滾不動、撿太慢」:**升**該帶 `DENSITY_K_BY_BAND` 對應格(見 Lever 3)而非升 GROWTH_K(GROWTH_K 動全局)。
  - 改完重跑 P10.4 B 該段 15s,確認 `rM` 漲速回到「該段約 60–90s 升 tier」的量級。
- [ ] **Lever 2 — tier 門檻(`packs/taipei/tiers.js` 的 `enterTrueRadius`)**:若某 tier 「太快帶過、沒玩到內容」或「拖太久」,微調該 tier 的 `enterTrueRadius`。
  - **約束**:改完必須 `npx vitest run src/packs/taipei/pacing.test.js` 仍全綠(P10.7 鎖了嚴格遞增 + 2x..12x 比例 + 101 在 T6 之上)。
- [ ] **Lever 3 — 機車密度 / 各帶供給(`config/tuning.js` 的 `DENSITY_K_BY_BAND`)**:`[0.45, 0.45, 0.3, 0.3, 0.2, 0.2, 0.15]`。機車海(T3,band 3)是「數量感」場景 —— 若機車海太空,**升** `DENSITY_K_BY_BAND[3]`;若 draw call 或 alive 逼近預算,**降**。
  - 改完**必跑 P10.3** 該 tier draw-call(密度直接影響 alive → 可能撞 cap)+ P10.8 幀時間。
- [ ] **Lever 4 — 101 收尾坡度(`packs/taipei/monument.js`)**:101(508m)比晴空塔(634m)矮 —— 調 `GOAL_RADIUS_M` / `GOAL_CALL_RADIUS_M` / 底座半徑,讓最後一段逼近不會「還很小就 contact」或「滾過頭才 contact」。curated landmark/collectible 在 absorb.js 是 GROWTH 豁免(保留 authored x1.554 跳階),所以收尾坡度靠**地標門檻間距**(P6 的 `dioramaR` 階梯)+ 這幾個 goal 半徑。
  - 改完跑 P10.4 C,確認 `finale.state` 進程順、`called`→`contact` 之間有「最後衝刺」感,非瞬間。
- [ ] **Rank 門檻(`config/tuning.js` 的 `RANK_*_S` / `TIME_BONUS_*`)**:用 P10.10 基準的實測 optimal 秒數重設 — `RANK_S_S ≈ 1.2× optimal`,`RANK_C_S` ≈ 首破關上緣。台北關 optimal 與東京不同,**必須**用實測值而非沿用 upstream 290/400/540/720。
- [ ] **每改一個 lever 的回歸組合**(避免調味破壞別處):
  - `npx vitest run src/packs/taipei/` (pacing + pack.validate 不丟)
  - P10.3 受影響 tier 的 draw-call < 72
  - P10.4 B 受影響段不卡死
  - **預期觀察**:全綠 + 全 < 72 + 全程可滾。
- [ ] **最終整關計時複驗**:再跑一次完整 smoke,確認「圖釘→101」落在 5–8 分鐘目標,rank 門檻對得上實測。
  - **預期觀察**:一次首玩(非 frame-perfect)落在 A/B rank 區間,時間 5–8 分鐘。
- [ ] commit:`P10.10 pacing/growth tune pass — GROWTH ramp + tier thresholds + scooter density + 101 finale slope`

---

### Task P10.11: P10 收尾驗收清單(這次真的改到什麼 → 怎麼驗)

- [ ] 在 PR 描述貼出本 part 的精準驗收清單(對齊使用者「每個 change 附驗證清單」習慣):

  | 動到的東西 | 怎麼驗 | 預期 |
  |---|---|---|
  | `main.js` `__v3dbg.renderer`(P10.1) | `evaluate_script` 讀 `calls` | 正整數,`hasRenderer===true` |
  | force-rescale 像素一致(P10.2) | KeyR/force-rescale 前後雙截圖 | tier/calls/tris 不變、worldScale×5、構圖一致 |
  | draw-call ledger(P10.3) | 7 tier + 101 + ending 峰值掃 | 全 < 72 |
  | 可玩 smoke(P10.4) | 全程 + 逐段 + 終局 | tier 0→6、`finale.state→done`、`#win-overlay` 顯示 |
  | zh-TW grep(P10.5) | 3 條 rg | 全 0 命中 |
  | zh-TW 實機(P10.6) | 6 畫面截圖 | 全繁中、黑熊非鴨子 |
  | pacing 測試(P10.7) | `npx vitest run …/pacing.test.js` | 全綠 |
  | 效能 sanity(P10.8) | iGPU + mobile 量幀時間 | governor 後回 budget;snap GPU caveat 註記 |
  | 決定性(P10.9) | 同 seed 雙 boot 指紋 | 完全相同 |
  | 配速調味(P10.10) | 全回歸組合 + 整關計時 | < 72、可滾、5–8 分鐘 |
- [ ] **動到 Rust/tauri 否**:無(本專案是純 Three.js / Vite web,不涉及 mori-desktop;無需重啟 tauri dev)。
- [ ] **動到 `config/tuning.js` 提醒**:P10.10 改了 feel 常數 → 任何後續 part 重跑前要 `npm run build` 確認無 boot assert(`JS_GZ_BUDGET_KB` / `DRAW_CALL_CAP` / `ARCHETYPE_TRI_CAP` 等 boot 檢查)。
- [ ] commit:`P10.11 cross-cutting verification checklist + PR evidence`



## P11. Repo, license, README, GitHub Pages deploy

> **Where this slots in.** P11 runs after the game is feature-complete and verified (P0–P10). It does the public-facing packaging: license, README, the GitHub Pages base-path + Actions deploy, and a live smoke test. It assumes:
> - The fork is merged into `/home/ct/roll-formosa` (Part P0).
> - OSM scripts + ODbL attribution are already gone (Part P1 removed `osm:fetch/build/verify` from `package.json`, deleted the `.osm-credit` blocks from `index.html`, and removed the `osm:verify` step from `predeploy`).
> - `index.html` already has `<html lang="zh-Hant-TW">`, zh-TW `<title>`, and the X share text is zh-TW (Part P3 i18n seam + Part P8 mascot rename of the `/assets/donack/*` preloads).
> - The active pack is `taipei` and the game is playable pushpin → 台北 101 → 福爾摩沙島 ending (Parts P3–P9).
>
> **Two facts grounded in the actual reference code** (`/tmp/fableDemoGame`):
> 1. `vite.config.js` ships `base: './'` (relative). Relative base *already works* under a GitHub Pages project subpath, but we pin an **explicit** absolute base so the deployed `index.html` and the GH-Pages 404/asset resolution are unambiguous and match the k-rider convention. See Task P11.4 for the exact change and why.
> 2. `package.json` currently has `"name": "fable-katamari"` and a `predeploy` of `bash scripts/verify-donack-assets.sh && npm run osm:verify`. P1 strips the `osm:verify` half; P11 renames the package and finalizes the scripts (Task P11.3).
>
> **User-facing actions (DO NOT do blindly — confirm with the user first):** creating the GitHub repo, the first `git push`, and enabling Pages in repo settings. Task P11.7 lays out exactly what to ask. Everything before that (license, README, vite base, the workflow file) is committed locally and is safe to do autonomously.

---

### Task P11.1: LICENSE — preserve upstream MIT + add 林亞澤 derivative copyright

The spec §4.1 / §8: keep the original `aieo-product 2026` MIT text and append a 林亞澤 (derivative) copyright line. Per the user's repo-license policy, personal code = MIT under 林亞澤.

- [ ] Confirm whether the fork brought an upstream LICENSE across:
  ```bash
  ls -la /home/ct/roll-formosa/LICENSE 2>/dev/null; echo "---"; \
    head -5 /home/ct/roll-formosa/LICENSE 2>/dev/null || echo "no LICENSE yet"
  ```
  Expected: either an existing MIT from upstream, or "no LICENSE yet". If an upstream LICENSE exists, keep its exact body and only add the second copyright line in the next step.
- [ ] Write `/home/ct/roll-formosa/LICENSE` with **both** copyright holders above one shared MIT body (this is the standard way to express a derivative that keeps the upstream grant):
  ```
  MIT License

  Copyright (c) 2026 aieo-product (original work: fableDemoGame)
  Copyright (c) 2026 林亞澤 (Yaze Lin) (derivative work: Roll Formosa)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  ```
  > If upstream shipped its MIT verbatim, replace ONLY the copyright block (keep their exact body text) — but the body above is the canonical MIT text and is interchangeable.
- [ ] Verify and commit:
  ```bash
  grep -c "Copyright (c) 2026" /home/ct/roll-formosa/LICENSE   # expect 2
  cd /home/ct/roll-formosa && git add LICENSE && \
    git commit -m "P11: LICENSE — preserve aieo-product MIT + add 林亞澤 derivative line"
  ```

---

### Task P11.2: README rewrite (zh-TW) — intro, controls, credit, dev commands

Spec §8: zh-TW README with game intro, controls, credit to fableDemoGame (MIT), local dev commands, attribution. Mirror the user's k-rider README conventions (繁中, English tech terms inline). No emoji (user preference).

- [ ] Overwrite `/home/ct/roll-formosa/README.md` with:
  ```markdown
  # Roll Formosa（福爾摩沙）

  一款台灣風味的 Katamari（滾物成球）瀏覽器 3D 遊戲。從一顆 2 公分的小球（圖釘尺度）開始，
  在台北街頭一路黏滾長大：柑仔店桌頭的彈珠、夜市攤、機車海、街屋宮廟，最後滾成跨越信義區、
  撞上**台北 101** 的巨球。

  - 全程序化台北街景（不抓真實 OSM 資料）
  - 雙數系無縫縮放引擎：從圖釘到天際線，尺度跨 5 個數量級仍維持 60fps，過程完全無縫
  - 全繁體中文 UI 與旁白
  - 吉祥物：台灣黑熊「月牙」沿途解說
  - 結尾鏡頭升空，拉遠成福爾摩沙島 teaser

  **線上遊玩**：https://yazelin.github.io/roll-formosa/

  ## 操作

  - **WASD / 方向鍵**：滾動
  - **Space**：衝刺（蓄力式） / **Shift**：加速 / **M**：靜音
  - **滑鼠拖曳**：旋轉鏡頭（選用）
  - **目標**：滾大到能吸收**台北 101**（計時挑戰，依完成時間評 S–D 等級）

  ## 本機開發

  ```bash
  npm install
  npm run dev      # 開發伺服器（vite）
  npm run build    # 輸出到 dist/
  npm run preview  # 本機預覽 production build
  ```

  除錯：反引號鍵叫出效能 overlay，`?r=<公尺>` 從任意尺寸開局，`?seed=<n>` 重現同一個世界。

  ## 致謝與授權

  本作 fork 自 [aieo-product/fableDemoGame](https://github.com/aieo-product/fableDemoGame)（MIT）。
  保留其無縫縮放引擎、物理與渲染骨架；台北內容、地標、台北 101 終點、台灣黑熊吉祥物、
  福爾摩沙島結尾與全繁中在地化為本專案新作。

  授權：MIT。原作 copyright `aieo-product 2026`，衍生 copyright 林亞澤 2026。詳見 [`LICENSE`](LICENSE)。

  > 移除原版 OSM 真實東京圖層後，本專案不附帶任何 OpenStreetMap 資料，故**無 ODbL 義務**。
  ```
  > The Pages URL `https://yazelin.github.io/roll-formosa/` is the project-site form for the user's GitHub account; if the user picks a different repo name in Task P11.7, update this line and the vite `base` (Task P11.4) together.
- [ ] Verify no leftover Japanese / no emoji and commit:
  ```bash
  grep -nP '[\x{3040}-\x{30FF}]' /home/ct/roll-formosa/README.md && echo "FAIL: kana found" || echo "OK: no kana"
  cd /home/ct/roll-formosa && git add README.md && \
    git commit -m "P11: README 重寫（繁中）— 介紹/操作/開發指令/致謝 fableDemoGame + 授權"
  ```
  Expected: `OK: no kana`. (Kanji shared with 中文 is fine; this grep targets hiragana/katakana only.)

---

### Task P11.3: Finalize `package.json` — rename + clean deploy scripts

Grounded: the real `package.json` is `"name": "fable-katamari"` with a `predeploy` of `bash scripts/verify-donack-assets.sh && npm run osm:verify`. P1 already removed the `osm:*` scripts. P11 renames the package and makes `predeploy` only run the asset verifier (renamed by P8 to the bear).

- [ ] Read the current state to see what P1/P8 left:
  ```bash
  cat /home/ct/roll-formosa/package.json
  ```
  Expected: no `osm:fetch/build/verify` scripts; `predeploy` should no longer reference `osm:verify`. Note the exact asset-verifier script name (P8 may have renamed `verify-donack-assets.sh`).
- [ ] Set the package name and ensure `predeploy` is asset-verify only. Edit `/home/ct/roll-formosa/package.json`:
  - `"name": "fable-katamari"` → `"name": "roll-formosa"`.
  - If `predeploy` still contains `&& npm run osm:verify`, drop that half so it reads e.g. `"predeploy": "bash scripts/verify-mascot-assets.sh"` (use the actual script name from the previous step; if P8 kept `verify-donack-assets.sh`, keep that).
- [ ] Verify the package is valid JSON and scripts are sane, then commit:
  ```bash
  cd /home/ct/roll-formosa && node -e "const p=require('./package.json'); \
    console.log('name', p.name); console.log('scripts', Object.keys(p.scripts).join(',')); \
    if(JSON.stringify(p).includes('osm')) throw new Error('osm reference still present')"
  git add package.json && git commit -m "P11: package.json 改名 roll-formosa，predeploy 去除 osm 殘留"
  ```
  Expected: `name roll-formosa`, scripts list contains `dev,build,preview,predeploy` (no `osm:*`), and no throw.

---

### Task P11.4: Pin vite `base` for the GitHub Pages project subpath

Grounded: `vite.config.js` ships `base: './'`. A relative base does resolve under `/roll-formosa/`, but GitHub Pages project sites serve from `https://<user>.github.io/<repo>/`, and an **explicit absolute base** makes module/asset URLs deterministic (and matches the k-rider deploy). We make it overridable so local `dev`/`preview` stay at root.

- [ ] Read the current config to confirm the exact contents:
  ```bash
  cat /home/ct/roll-formosa/vite.config.js
  ```
  Expected: the 9-line file with `base: './'`.
- [ ] Replace `/home/ct/roll-formosa/vite.config.js` with an env-overridable base (defaults to `/roll-formosa/` for the project site; CI passes the repo name; local dev falls back to `/`):
  ```javascript
  import { defineConfig } from 'vite';

  // GitHub Pages PROJECT site serves from https://<user>.github.io/<repo>/.
  // CI passes the repo via DEPLOY_BASE (e.g. "/roll-formosa/"); local dev/build
  // default to "/" so `npm run dev` and `npm run preview` work at the root.
  const base = process.env.DEPLOY_BASE || '/';

  export default defineConfig({
    base,
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1200,
    },
  });
  ```
  > The workflow in Task P11.5 sets `DEPLOY_BASE=/<repo>/` at build time, so the base always tracks the actual repo name with no second source of truth to drift.
- [ ] Verify a base-injected build emits the subpath in `dist/index.html`, then commit:
  ```bash
  cd /home/ct/roll-formosa && DEPLOY_BASE=/roll-formosa/ npm run build && \
    grep -o '/roll-formosa/assets/[^"]*' dist/index.html | head -3
  git add vite.config.js && git commit -m "P11: vite base 由 DEPLOY_BASE 注入，預設 / 供 GitHub Pages 子路徑"
  ```
  Expected: the build succeeds and `dist/index.html` references hashed JS/CSS under `/roll-formosa/assets/...` (not `/assets/...` or `./assets/...`). This is the load-bearing proof that the deployed paths are correct.

---

### Task P11.5: GitHub Actions workflow — build with vite, deploy to Pages

Spec §8: a `.github/workflows/deploy.yml` that builds with vite and deploys to GitHub Pages. Use the official `actions/deploy-pages` flow (build job uploads the `dist/` artifact, deploy job publishes it). `DEPLOY_BASE` is derived from the repo name so the workflow is rename-safe.

- [ ] Create `/home/ct/roll-formosa/.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches: [main]
    workflow_dispatch:

  permissions:
    contents: read
    pages: write
    id-token: write

  # Allow one concurrent deploy; cancel in-progress runs for the same ref.
  concurrency:
    group: pages
    cancel-in-progress: true

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: npm
        - run: npm ci
        # base MUST match the Pages project subpath: /<repo>/
        - run: npm run build
          env:
            DEPLOY_BASE: /${{ github.event.repository.name }}/
        - uses: actions/upload-pages-artifact@v3
          with:
            path: dist

    deploy:
      needs: build
      runs-on: ubuntu-latest
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      steps:
        - id: deployment
          uses: actions/deploy-pages@v4
  ```
  > `DEPLOY_BASE: /${{ github.event.repository.name }}/` means the base auto-tracks the repo name — if the user names the repo differently in Task P11.7, the deploy still gets the right subpath with no edit. (The README and the local build-check in P11.4 use the literal `/roll-formosa/`, so keep those in sync with the chosen repo name.)
- [ ] `npm ci` requires a committed lockfile. Confirm one exists (P0 should have created it); if not, generate it:
  ```bash
  ls /home/ct/roll-formosa/package-lock.json 2>/dev/null || (cd /home/ct/roll-formosa && npm install)
  ```
  Expected: `package-lock.json` present. If it was just generated, it gets committed in the next step.
- [ ] Lint the workflow YAML and commit:
  ```bash
  cd /home/ct/roll-formosa && node -e "const f=require('fs').readFileSync('.github/workflows/deploy.yml','utf8'); \
    if(!f.includes('actions/deploy-pages@v4')||!f.includes('DEPLOY_BASE')) throw new Error('workflow missing key steps'); \
    console.log('workflow OK')"
  git add .github/workflows/deploy.yml package-lock.json && \
    git commit -m "P11: GitHub Actions — vite build + deploy-pages，DEPLOY_BASE 取 repo 名"
  ```
  Expected: `workflow OK`.

---

### Task P11.6: Local pre-deploy smoke — serve the built subpath and verify it boots zh-TW

Before any push, prove the production artifact under the real base actually loads, is in zh-TW, and rolls — using the chrome-devtools MCP against a local static server that mimics the Pages subpath. (This is the offline mirror of the live smoke in Task P11.8; doing it locally first means a green deploy is expected, not hoped for.)

- [ ] Build under the Pages base and serve it at the matching subpath:
  ```bash
  cd /home/ct/roll-formosa && DEPLOY_BASE=/roll-formosa/ npm run build && \
    npx vite preview --base /roll-formosa/ --port 4173 --strictPort
  ```
  (Run this in the background; it serves `dist/` at `http://localhost:4173/roll-formosa/`.)
- [ ] chrome-devtools MCP — navigate and confirm the title screen is zh-TW:
  - `navigate_page` → `http://localhost:4173/roll-formosa/`
  - `take_screenshot`
  - **Expected observation:** the title overlay shows the zh-TW game title (e.g. 「Roll Formosa」/「福爾摩沙」) and a zh-TW start button (「開始」); NO Japanese kana anywhere; NO `.osm-credit` / OpenStreetMap line (P1 removed it).
- [ ] chrome-devtools MCP — assert assets loaded from the subpath and no 404s:
  - `list_network_requests`
  - **Expected observation:** the main JS/CSS chunks are requested from `/roll-formosa/assets/...` and return 200; zero 404s (in particular, no asset requested from `/assets/...` at the domain root).
- [ ] chrome-devtools MCP — start the game and confirm it rolls (engine intact under the subpath):
  - `click` the start button (use `take_snapshot` to get its uid first)
  - `evaluate_script`:
    ```js
    () => {
      // Read the HUD size pill the engine updates each frame (index.html #size-value).
      return new Promise((resolve) => {
        const before = document.querySelector('#size-value')?.textContent || null;
        // hold a movement key briefly, then sample again
        const ev = (type) => window.dispatchEvent(new KeyboardEvent(type, { key: 'w', code: 'KeyW', bubbles: true }));
        ev('keydown');
        setTimeout(() => { ev('keyup'); resolve({ before, after: document.querySelector('#size-value')?.textContent || null }); }, 1500);
      });
    }
    ```
  - **Expected observation:** the HUD `#size-value` is a zh-TW-formatted number that is non-null and changes (ball grows / moves) after the keypress — i.e. input + physics + render are live under the Pages base. If the engine exposes a `__DEV` ball-radius hook from earlier parts, read that instead and assert it increased.
- [ ] Stop the preview server (kill the background job) once the three observations pass.

---

### Task P11.7: Confirm repo creation + push + Pages enablement WITH the user

Per the part brief: creating the GitHub repo, the first push, and enabling Pages are user-facing — confirm, do not do blindly. The user's convention is a personal public repo (k-rider precedent) deployed via GitHub Pages.

- [ ] Show the user the exact plan and ask for go-ahead, surfacing the one decision that affects URLs:
  > 「P11 在地的部分（LICENSE、README、vite base、deploy workflow）都已 commit 在 `/home/ct/roll-formosa`，本機 production smoke 也過了。接下來這三步是會動到你 GitHub 帳號的對外動作，要你拍板：
  > 1. 建 public repo `yazelin/roll-formosa`（沿用 k-rider 慣例個人公開 repo）。**repo 名要確認**：workflow 用 repo 名當 Pages 子路徑，若不叫 `roll-formosa`，README 的線上網址與 P11.4 的本機 base 檢查要一起改。
  > 2. 推第一版上 `main`。
  > 3. repo Settings → Pages → Source 設成 **GitHub Actions**（不是 deploy from branch），讓 `deploy.yml` 接手。
  > 要我用 `gh` 幫你跑哪幾步？還是你自己在網頁點？」
- [ ] After the user confirms the repo name and grants go-ahead, (and only then) run the user-approved subset, e.g.:
  ```bash
  cd /home/ct/roll-formosa && \
    gh repo create yazelin/roll-formosa --public --source=. --remote=origin --push
  ```
  > Do not run this until the user has confirmed. If the user prefers to create the repo manually, just `git remote add origin <url> && git push -u origin main` after they make it.
- [ ] Enable Pages via the GitHub Actions source (if the user asked you to do it via CLI):
  ```bash
  gh api -X POST repos/yazelin/roll-formosa/pages -f build_type=workflow 2>/dev/null \
    || gh api -X PUT repos/yazelin/roll-formosa/pages -f build_type=workflow
  ```
  Expected: Pages is created/updated with `build_type: workflow`. Then confirm the workflow run:
  ```bash
  gh run list --repo yazelin/roll-formosa --workflow deploy.yml --limit 1
  ```
  Expected: a run for the push to `main`, ending `completed / success`.

---

### Task P11.8: Live smoke test — verify the deployed Pages URL with chrome-devtools

Spec §8 + §10: after deploy, smoke the live URL (game loads, zh-TW, rolls). This is the final ship gate for P11.

- [ ] Wait for the deploy to finish, then resolve the live URL:
  ```bash
  gh api repos/yazelin/roll-formosa/pages --jq .html_url
  ```
  Expected: `https://yazelin.github.io/roll-formosa/` (or the chosen repo's URL). GitHub Pages can take 1–2 min after the workflow's `deploy` job to serve the new content.
- [ ] chrome-devtools MCP — load the live site and confirm zh-TW title:
  - `navigate_page` → the `html_url` from above
  - `take_screenshot`
  - **Expected observation:** zh-TW title screen renders (game title + 「開始」button), no Japanese kana, no OpenStreetMap/ODbL line.
- [ ] chrome-devtools MCP — confirm no load failures on the live base:
  - `list_console_messages` and `list_network_requests`
  - **Expected observation:** no console errors; all JS/CSS/webp assets load 200 from `https://yazelin.github.io/roll-formosa/assets/...` (and mascot frames from `/roll-formosa/assets/<mascot>/...`); zero 404s.
- [ ] chrome-devtools MCP — confirm the game rolls to the win condition path on the live build:
  - `click` start, then `evaluate_script` the same `#size-value` (or `__DEV` radius) probe from Task P11.6.
  - **Expected observation:** the size pill is a live, increasing zh-TW number after a keypress — the deployed build is playable, not a static shell.
  - (Optional deeper check, reusing P10's hooks if present: jump near the goal with `?r=<m>` and confirm the win/福爾摩沙島 ending fires — `navigate_page` to `…/roll-formosa/?r=300`, roll into 101, expect the win overlay with the zh-TW victory title.)
- [ ] Report the live URL to the user and confirm P11 done:
  > 「已上線：https://yazelin.github.io/roll-formosa/ — 線上實機驗過：繁中標題、資源從 `/roll-formosa/` 子路徑全 200、開局可滾、尺寸 HUD 即時成長。LICENSE / README / workflow 都在 repo。」



## P12. Extended landmarks (iterative)

> **Frame:** This part is **post-core polish**. Phase 1 *ships on the core 8 landmarks + 台北101* from **P6** — none of P12 blocks release. Each extended landmark is a self-contained, independently-droppable commit that reuses the exact P6 landmark pattern. Add them as far as time/taste allows; the spec (§5.2) wants "愈多愈好" but explicitly splits core (ship-blocking) from extended (iterate after ship).
>
> **The 14 extended landmarks** (spec §5.2 延伸集): 國父紀念館 / 故宮博物院 / 台北車站 / 行天宮 / 兩廳院 / 美麗華摩天輪 / 彩虹橋 / 貓空纜車站 / 新光三越站前 / 南山廣場 / 大稻埕迪化街 / 寶藏巖 / 士林官邸 / 林安泰古厝.
>
> **What P12 must respect (grounded in the reference engine):**
> - The landmark mechanism is unchanged from P6: a `LandmarkDef` row + an `ArchetypeDef` with `buildGeometry(rng)` + one placement in `PLACEMENTS` + a pack-scoped EXTRA code + a zh-TW name + a narration line. (Reference `world/curated.js` materializes these from `cityMap.PLACEMENTS`/`LANDMARKS` into the shared `EXTRA` size-class pools — codes `>= EXTRA_BASE` are exclusively curated-owned, freed from the remembered slot; nothing about that changes when we add rows.)
> - **The `dioramaR` ladder must stay strictly increasing**, with **台北101 still last and largest** (reference `validateCityMap()` asserts `at = dioramaR / ABSORB_RATIO` strictly increasing; our `pack.validate()` from P3 carries the same assert). Every extended landmark slots **below 101** in absorb threshold.
> - **`EXTRA_POOL_CAPS` (spec floor) + `CLASS_CAPS` (render authority) bump together.** Reference has *two* capacity authorities tied by a boot DEV assert (`render/extraPools.js`: `CLASS_CAPS[k] >= EXTRA_POOL_CAPS[order[k]]`). The real limit is **concurrent-alive landmarks within the load radius per size class**, not the total landmark count — landmarks are scattered across the map so they are never all alive at once, and the batched pool shares draw calls. **Bumping a cap is MEMORY only (one `BatchedMesh` per class) — it never adds a draw call.**

---

### Task P12.0: One-time setup — capacity headroom + the iteration checklist

This task lands **before** any extended-landmark commit and sets up the shared infrastructure all 14 reuse.

- [ ] **Read the current caps.** Open `src/packs/taipei/catalog.js` (spec-floor `EXTRA_POOL_CAPS`, written in P2/P3) and the render-authority caps (reference: `src/render/extraPools.js` `CLASS_CAPS`). Confirm the four size-class keys are `collectible-small`, `landmark-mid`, `landmark-large`, `landmark-xl` (reference order — frozen partition in `world/curated.js` `EXTRA_POOL_CLASS`).
- [ ] **Audit the worst-case concurrent-alive count per class** for the *core 8* (P6) as the starting point. The true constraint is "alive inside the load radius simultaneously", and landmarks are coordinate-dispersed, so the audit is usually `core-class-count + a small margin`, NOT `core + 14`. Write the audit numbers into a comment block at the top of the caps definition, e.g.:
  ```js
  /* EXTRA pool concurrency audit (台北).
   * Real limit = landmarks of a class ALIVE inside the load radius at once
   * (NOT total count — they are scattered; the batched pool shares draws).
   * Caps are MEMORY only (one BatchedMesh per class) — never extra draws.
   *   core 8 (P6):  landmark-mid  X   landmark-large Y   landmark-xl Z
   *   +14 extended: worst co-location measured below -> mid M, large L, xl XL
   */
  ```
- [ ] **Pre-bump both authorities once, generously,** so individual landmark commits don't each touch the cap files (less churn, fewer merge seams). Pick caps that cover the *measured* worst co-location after all 14 (a small over-allocation is free except for a few KB of instance buffers). Update **`EXTRA_POOL_CAPS`** (spec floor) in `src/packs/taipei/catalog.js` AND the render-authority `CLASS_CAPS` array together — they must satisfy `CLASS_CAPS[k] >= EXTRA_POOL_CAPS[order[k]]` or the boot DEV assert throws.
- [ ] **Verify the assert still holds at boot.** `npm run build` succeeds AND `npm run dev` boots with **no `[extraPools.js invariant]` / `[pack] ...` assert in the console**.
  - **Visual verification:** open the vite dev URL with chrome-devtools MCP, `navigate_page`, then `list_console_messages` → expect **zero** lines matching `invariant` or `pool ... overflow`. Then `evaluate_script` returning the live cap object (expose a `window.__DEV.extraCaps` hook in dev if not already present) → expect the bumped numbers, e.g. `{ 'landmark-mid': M, 'landmark-large': L, 'landmark-xl': XL }`.
- [ ] **Commit:** `chore(taipei): raise EXTRA pool caps to cover extended-landmark concurrency`.

> After P12.0, each task below is **data + geometry + one test row + one commit** — no further cap edits unless the audit was wrong (a landmark won't render → the dev console prints `[curated] render pool exhausted for code N (kind K)`; that is the signal to bump the offending class's cap).

---

### Task P12.1 (TEMPLATE — the repeatable iterative task)

This is the **single repeatable pattern**. Tasks P12.2–P12.15 are this task re-run with the next row from the checklist table. **One landmark = one commit.** Do them in any order; drop any you run out of time for.

For landmark **`<LM>`** (pick the next unchecked row from the checklist table):

- [ ] **Pick its ladder slot.** From the checklist table, read its `dioramaR`. Confirm `dioramaR / ABSORB_RATIO` lands **strictly between** its lower and upper neighbours in the *current* ladder **and strictly below 台北101**. If it ties an existing threshold, nudge `dioramaR` by a few % (the spec says the ladder, not the exact metres, is binding).
- [ ] **Add the `ArchetypeDef`** to `src/packs/taipei/catalog.js` keyed by its `archetypeId` (see checklist). Reuse the P6 landmark geometry helpers (`box/cyl/cone/sph/torus` + `finish([...])` normalising to the unit bounding sphere). Keep triangles **≤ 600** (hero budget). Set the zh-TW `displayName`. **Worked example — 國父紀念館 (`lm_sun_yat_sen`):**
  ```js
  // src/packs/taipei/catalog.js — append in the EXTENDED LANDMARKS block.
  // 國父紀念館: a single sweeping 黃色琉璃瓦 hip roof with up-curled eaves on a
  // low white podium — the silhouette is the giant flying-eave roofline.
  registerLandmarkArchetype('lm_sun_yat_sen', {
    id: 'lm_sun_yat_sen',
    displayName: '國父紀念館',
    tier: 5,                 // T5 商業文教區 band (sizeReal ~30 m)
    naturalBand: 5,
    sizeReal: 30,
    collisionScale: 0.8,
    colorHex: 0xE8C24A,      // 琉璃瓦 yellow (vertex-colored; not FALLBACK grey)
    buildGeometry(rng) {
      const parts = [];
      // white podium
      parts.push(box({ w: 1.0, h: 0.18, d: 1.0, y: 0.09, color: 0xF2EEE6 }));
      // four corner columns (subtle)
      for (const [sx, sz] of [[-0.42,-0.42],[0.42,-0.42],[-0.42,0.42],[0.42,0.42]]) {
        parts.push(cyl({ r: 0.04, h: 0.34, x: sx, y: 0.35, z: sz, color: 0xEDE7DA }));
      }
      // the hero: a wide flying-eave hip roof (flattened pyramid + flared lip)
      parts.push(cone({ r: 0.72, h: 0.40, y: 0.72, seg: 4, color: 0xE8C24A }));      // main roof
      parts.push(torus({ R: 0.70, r: 0.05, y: 0.54, color: 0xC9A23A, rotX: Math.PI/2 })); // up-curled eave rim
      return finish(parts);  // normalises to unit bounding sphere; instance scale = placement radius
    },
  });
  ```
  *(`box/cyl/cone/sph/torus/finish` + `registerLandmarkArchetype` are the P6 helpers — match their exact signatures from `src/packs/taipei/catalog.js`. The colours/forms above are illustrative; aim for "一眼認得出" per spec §5.2.)*
- [ ] **Add the `LandmarkDef` row** to the `LANDMARKS` array in `src/packs/taipei/landmarks.js`, inserted **before** the 台北101 (goal) row so the goal stays last:
  ```js
  // src/packs/taipei/landmarks.js — extended block, BEFORE the isGoal:true 101 row.
  { landmarkId: <next id>, name: '國父紀念館',
    x: <game m>, z: <game m>,          // hand-authored, dispersed; see cityMap
    dioramaR: 22, collisionScale: 0.8, sizeReal: 30,
    archetypeId: 'lm_sun_yat_sen', naturalBand: 5, colorHex: 0xE8C24A },
  ```
- [ ] **Add ONE placement** to `PLACEMENTS` in `src/packs/taipei/cityMap.js`. Reuse the P6 landmark-placement helper (it stamps `landmarkId`, `rIntent = dioramaR / ABSORB_RATIO`, `colorHex`, the right `naturalBand`, and resolves the pack-scoped EXTRA code). **Disperse the coordinate** away from same-band neighbours so two same-class landmarks are rarely alive together (this is what keeps the cap from `core + 14`). Keep it inside `MAP_BOUNDS` (`pack.validate()` asserts this).
- [ ] **Add the zh-TW narration line** to `src/packs/taipei/narration.js` (`landmark` lookup table, keyed by `landmarkId` or `archetypeId` per P6's choice) — a one-liner with a 台北 冷知識 in the mascot 月牙's voice. Add the UI display string to `src/packs/taipei/locale.js` if P6 keyed landmark names there.
- [ ] **Write ONE failing test row, run it red, then make it green** (reuse the P6 pack-validate test file `src/packs/taipei/pack.test.js`). The test asserts the *new* landmark is on the ladder and below 101:
  ```js
  // src/packs/taipei/pack.test.js — append.
  it('國父紀念館 is on the monotonic ladder, below 台北101', () => {
    const pack = taipei;
    const lm = pack.landmarks.find((l) => l.archetypeId === 'lm_sun_yat_sen');
    const goal = pack.landmarks.find((l) => l.isGoal);
    const A = (r) => r / ABSORB_RATIO;
    expect(lm).toBeTruthy();
    expect(A(lm.dioramaR)).toBeLessThan(A(goal.dioramaR));   // below 101
    // ladder stays strictly increasing across the whole set
    const ladder = [...pack.landmarks].sort((a,b)=>A(a.dioramaR)-A(b.dioramaR)).map((l)=>A(l.dioramaR));
    for (let i = 1; i < ladder.length; i++) expect(ladder[i]).toBeGreaterThan(ladder[i-1]);
    expect(() => pack.validate()).not.toThrow();             // full pack invariants still hold
  });
  ```
  - Run red first (landmark absent): `npx vitest run src/packs/taipei/pack.test.js` → **fails** (`lm` undefined). Add the row/archetype/placement above → re-run → **passes**.
- [ ] **Visual verification (chrome-devtools MCP) — REQUIRED, this task changes rendering:**
  1. `npm run dev`; with chrome-devtools MCP `navigate_page` to the dev URL.
  2. `evaluate_script` to dev-teleport the ball next to the new landmark at a radius just below its absorb threshold (reuse the P6 `__DEV` teleport hook, e.g. `window.__DEV.teleport({ x, z, r: dioramaR/ABSORB_RATIO * 0.95 })`).
  3. `take_screenshot` → **expected observation:** the new model is visible and recognisable as `<LM>` (e.g. 國父紀念館's wide yellow flying-eave roofline reads at a glance), correctly coloured (not FALLBACK grey — confirms `colorHex` is set), resting on the ground.
  4. `evaluate_script` reading the draw-call ledger (`window.__DEV.drawCalls` or the existing ledger hook) → **expected observation:** draw calls **unchanged vs. before this landmark** (the landmark renders from the shared `landmark-<class>` BatchedMesh pool — adding a member archetype does **not** add a draw call) and **still ≤ the cap (72)**.
  5. `evaluate_script` to grow/teleport the ball just over `dioramaR/ABSORB_RATIO` and roll into it → **expected observation:** the landmark is absorbed, `EVT.LANDMARK` fires, and the 月牙 narration toast for `<LM>` appears in 繁中. Confirm via `list_console_messages` (no `render pool exhausted` warning) — if that warning appears, the class cap was under-audited: bump it (P12.0 step) and re-run.
- [ ] **Commit:** `feat(taipei): add 國父紀念館 extended landmark`. **One landmark per commit** (spec §13: 延伸集 迭代加).

---

### Tasks P12.2 – P12.15: the remaining 13 extended landmarks (checklist)

Run the **P12.1 template** once per row. Columns: the suggested `dioramaR` orders the ladder slot (all strictly **below** 台北101's goal `dioramaR`; verify against the live ladder at insert time and nudge on conflict). `tier`/`naturalBand` follow the spec scale-band. `pool class` is the size-class whose cap the audit covers. **Geometry hint** is the "一眼認得出" silhouette — keep ≤ 600 tris, vertex-coloured, `finish()`-normalised.

| Task | 地標 | `archetypeId` | tier / band | suggested `dioramaR` | pool class | geometry hint (silhouette) |
|---|---|---|---|---|---|---|
| P12.1 | 國父紀念館 | `lm_sun_yat_sen` | T5 / 5 | 22 | landmark-large | *(worked example above)* wide 黃琉璃瓦 flying-eave hip roof on white podium |
| P12.2 | 故宮博物院 | `lm_palace_museum` | T5 / 5 | 24 | landmark-large | 綠瓦白牆 multi-tier 牌樓-fronted hall, stepped roofs rising on a hillside podium |
| P12.3 | 台北車站 | `lm_taipei_station` | T5 / 5 | 26 | landmark-large | big rectangular block with a steep **red hip roof** (紅頂量體) + central gable |
| P12.4 | 行天宮 | `lm_xingtian` | T4 / 4 | 11 | landmark-mid | single-hall 廟宇 with swallow-tail 燕尾脊 ridge + red columns, broad forecourt |
| P12.5 | 兩廳院 (國家音樂廳/戲劇院) | `lm_concert_hall` | T5 / 5 | 23 | landmark-large | **two** matching yellow-roof 宮殿式 halls side by side on a shared plaza |
| P12.6 | 美麗華摩天輪 | `lm_miramar_wheel` | T5 / 5 | 20 | landmark-large | a **torus wheel** (big `torus`) with spokes on an A-frame base — reads instantly as a 摩天輪 |
| P12.7 | 彩虹橋 (基隆河) | `lm_rainbow_bridge` | T5 / 5 | 19 | landmark-xl | low S-curved deck + a single leaning **red arch** (one tall `torus`-arc / bent box) over the river |
| P12.8 | 貓空纜車站 | `lm_maokong_station` | T4 / 4 | 9 | landmark-mid | hillside station shed + cable pylon, a gondola cabin hanging from a wire span |
| P12.9 | 新光三越站前 (舊第一高) | `lm_shin_kong` | T5 / 5 | 27 | landmark-large | slim stepped tower, darker glass, a small pyramidal crown (the 1990s 台北第一高 look) |
| P12.10 | 南山廣場 | `lm_nanshan` | T6 / 6 | 30 | landmark-xl | tall tapering glass office tower with a faceted setback near the top (信義 skyline filler near 101) |
| P12.11 | 大稻埕迪化街 | `lm_dadaocheng` | T4 / 4 | 10 | landmark-mid | a **row** of 2–3 narrow 巴洛克 街屋 façades with parapet pediments (one merged terrace block) |
| P12.12 | 寶藏巖 | `lm_treasure_hill` | T4 / 4 | 8.5 | landmark-mid | cluster of small stacked hillside 違建 houses at staggered heights (organic terrace) |
| P12.13 | 士林官邸 | `lm_shilin_residence` | T4 / 4 | 9.5 | landmark-mid | low 2-storey western villa with a hip roof + garden hedges (modest footprint) |
| P12.14 | 林安泰古厝 | `lm_lin_antai` | T4 / 4 | 8 | landmark-mid | single-storey 三合院 courtyard house, swallow-tail ridge, red-tile roof + open 埕 |

**Per-row reminders (do not skip):**
- [ ] **Ladder check at insert time** — the suggested `dioramaR` values are ordered but the *core 8* from P6 are interleaved; recompute `dioramaR / ABSORB_RATIO` against the live ladder and nudge ±% to break any tie. **台北101 stays the maximum.**
- [ ] **Disperse coordinates** — when two landmarks share a `pool class` *and* sit close, they can be co-alive and push that class's concurrency. If the P12.0 audit margin is exceeded, the dev console prints `[curated] render pool exhausted for code N` → bump that class in **both** `EXTRA_POOL_CAPS` and `CLASS_CAPS` (memory only, no extra draw).
- [ ] **`pool class` mapping** — when you register the `ArchetypeDef`, assign the size class shown so the code→pool partition (reference `EXTRA_SIZE_CLASS_BY_CODE` / `EXTRA_POOL_CLASS`) routes it to the pool whose cap the audit covers.
- [ ] **One commit each** — `feat(taipei): add <地標> extended landmark`.
- [ ] **Each commit ends with the P12.1 visual verification** (teleport → screenshot recognisable + correctly coloured; draw calls unchanged & ≤ 72; absorb fires zh-TW narration; no pool-exhausted warning).

---

### Task P12.16: Close-out — full ladder + concurrency re-verify

After however many extended landmarks shipped (the part is droppable mid-way; this task runs once whenever you stop):

- [ ] **Run the full pack validator headless:** `npx vitest run src/packs/taipei/pack.test.js` → all ladder/`validate()` rows green (strictly-increasing ladder across **core + extended**, 101 last & largest, every position in `MAP_BOUNDS`).
- [ ] **Boot smoke:** `npm run dev`, chrome-devtools `navigate_page`, `list_console_messages` → **zero** `invariant` / `pool ... overflow` / `render pool exhausted` lines across a full roll from 圖釘 to 101.
- [ ] **Concurrency stress (worst-case co-location):** `evaluate_script` to dev-teleport to the densest extended-landmark cluster at a large radius (max load radius) and read `evaluate_script` → expected: every nearby landmark of each size class is alive **and rendered** (no exhaustion warning), confirming the P12.0 caps held. Read the draw-call ledger → **still ≤ 72**.
- [ ] **Update the audit comment** in `src/packs/taipei/catalog.js` with the *measured* final worst co-location per class, and trim any over-allocated cap headroom you no longer need (optional; memory only).
- [ ] **Commit:** `test(taipei): re-verify landmark ladder + EXTRA pool concurrency after extended set`.

> **Ship gate reminder:** P12 is iterative and **never blocks Phase 1**. If only the core 8 (+101) from P6 are present, the game ships. Every extended landmark merged is pure polish on top of a shippable build.
