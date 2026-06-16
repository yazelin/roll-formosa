# Roll Formosa 高雄關 + 縣市選單 + 架構文件 + 河道緞帶 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 高雄 (Kaohsiung) as a second selectable city in Roll Formosa, behind a 縣市選單, with agent-readable architecture docs and a river-ribbon water system (which also fixes Taipei's blocky-L 基隆河).

**Architecture:** Reuse the StagePack seam (engine reads only `activePack`). Build order **§0 docs → §2 water → §1 kaohsiung pack → §3 city-select**. The kaohsiung pack mirrors the taipei pack file-for-file (taipei is the worked exemplar). City selection is choice-driven + reload (no runtime hot-swap): `active.js` statically imports every pack and synchronously exports the one named by `?city=` / `localStorage`.

**Tech Stack:** Three.js r177, Vite 6, vanilla ESM JS, vitest. Static deploy to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-06-16-roll-formosa-kaohsiung-design.md`

**Key references (read these before authoring):**
- Pack object shape: `src/packs/taipei/index.js`
- Tier table + sky guards: `src/packs/taipei/tiers.js`
- Goal monument: `src/packs/taipei/monument.js`
- Catalog registration + code map: `src/packs/taipei/catalog.js`
- Baked layout: `src/packs/taipei/cityData.js`; namespace + water + landmarks: `src/packs/taipei/cityMap.js`
- Geometry vocab: `src/packs/taipei/geomHelpers.js`; one landmark: `src/packs/taipei/landmarks/taipei101.js`; one collectible: `src/packs/taipei/collectibles/boba.js`; one chunk tier: `src/packs/taipei/archetypes/t0.js`
- Water renderer: `src/render/environment.js` (search `PACK_WATER`, `water` quad build ~line 587)
- Headless verify tool: `scripts/headless-check.mjs` (usage: `node scripts/headless-check.mjs <url> <out.png>`)

**Global conventions for EVERY task:**
- Branch: create `feat/kaohsiung` off `main` first (`git checkout -b feat/kaohsiung`). Commit per task.
- After any source change, the gate is: `npm run build` (exit 0) AND `npx vitest run` (all green). Headless checks where noted.
- zh-TW for all user-facing strings and docs. NO Japanese kana, NO "tokyo"/"東京"/"skytree" anywhere (the no-Tokyo/no-kana test guards enforce this — see Task 1.10).

---

## Phase §0 — Agent-readable architecture docs

Produces a repo that teaches the CURRENT architecture (not the deleted Tokyo one) to contributors' AI tools.

### Task 0.1: Archive the stale Tokyo-era design docs

**Files:**
- Move: `docs/DESIGN.md`, `docs/DESIGN-V2.md`, `docs/DESIGN-V3.md`, `docs/DESIGN-V4.md`, `docs/design/*.json` → `docs/legacy-fable-engine/`
- Create: `docs/legacy-fable-engine/README.md`

- [ ] **Step 1: Move the files**

```bash
cd /home/ct/roll-formosa
mkdir -p docs/legacy-fable-engine/design
git mv docs/DESIGN.md docs/DESIGN-V2.md docs/DESIGN-V3.md docs/DESIGN-V4.md docs/legacy-fable-engine/
git mv docs/design/*.json docs/legacy-fable-engine/design/
```

- [ ] **Step 2: Create the warning README**

`docs/legacy-fable-engine/README.md`:
```markdown
# Legacy — original Fable / 箱庭東京 engine design docs

These documents describe the ORIGINAL upstream game (`aieo-product/fableDemoGame`,
a Tokyo OSM Katamari) that Roll Formosa was forked from. They reference 東京 /
スカイツリー / OSM real-map data — **all removed during the 2026-06 de-Tokyo work**.

They are kept only for historical provenance. **They do NOT describe the current
architecture.** For how Roll Formosa actually works and how to contribute a city,
read `/AGENTS.md` at the repo root.
```

- [ ] **Step 3: Verify no source imports these docs (they are docs, but check screenshots refs in README aren't broken)**

```bash
grep -rn "docs/DESIGN" src README.md || echo "no source refs — safe"
```
Expected: no source references (or only README, fixed in Task 0.4).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: archive original Fable/Tokyo engine design docs to legacy-fable-engine/"
```

### Task 0.2: Write AGENTS.md (the canonical agent-facing architecture + contribution guide)

**Files:**
- Create: `AGENTS.md`

- [ ] **Step 1: Write `AGENTS.md`** with these sections (zh-TW), content drawn from the spec's "Pack 契約" + StagePack description:

```markdown
# Roll Formosa — AGENTS.md

給 AI 工具(Claude Code / Codex / Gemini 等)與貢獻者的架構導覽。**動手前先讀這份。**

## 這是什麼
台灣風 Katamari(滾物成球)3D 網頁遊戲。圖釘 2cm 一路滾到城市地標。Three.js r177 +
Vite 6 + vanilla ESM JS,靜態部署 GitHub Pages。Live:https://yazelin.github.io/roll-formosa/

> 重要:本專案 fork 自一個東京 OSM 遊戲,但**已完全去東京化**。`src/` 不得出現
> 任何 tokyo / 東京 / 日文 / skytree —— 有測試守衛把關(`npm test` 會紅)。
> `docs/legacy-fable-engine/` 是原版歷史文件,**不代表現行架構,別照它做**。

## 架構:StagePack
- 每座城市 = 一個自足資料夾 `src/packs/<city>/`。
- 引擎只讀 `src/packs/active.js` 指的 active pack。`src/config/` 只有引擎常數
  (`tuning.js`、`tiers.js` 的 RESCALE_S/ARCH_PER_TIER/TIER_COUNT),**零城市內容**。
- 引擎拿內容一律走 `activePack`;`world/objects.js` 的全域 code 表是中性 placeholder
  (`chunk_N`/`extra_N`/`v5_N`),每個 pack 用自己的 `archetypeIdByCode` 覆蓋。

## Pack 契約(`src/packs/<city>/index.js` 匯出的 activePack 物件)
[貼上 spec「Pack 契約」整段:身份/尺度/內容/地圖/其他欄位 + validate() + code-map 方法 + 99-code 結構]

## 怎麼加一座城市
1. `cp -r src/packs/taipei src/packs/<city>`,改 `id`/`displayName`/`seeds`(四字 ASCII hex,需與其他城市不同)。
2. 換內容:`tiers.js`(7 階主題)、`monument.js`(終點建物)、`landmarks/`、`collectibles/`、
   `archetypes/t0–t6.js`(70 chunk 幾何)、`narration.js`、`locale.js`、`ending.js`、
   `cityData.js`/`cityMap.js`(SHOP/ZONES/PLACEMENTS/water/GOAL_POS/DEV_STARTS)。
3. 在 `src/packs/manifest.js` 城市登錄表加一筆;`active.js` 會自動可選。
4. 寫測試(鏡射 `src/packs/<city>/*.test.js`),含 no-Tokyo/no-kana 守衛。

## 驗證關卡(動完必過)
- `npm run build` 過、`npx vitest run` 全綠。
- `node scripts/headless-check.mjs http://localhost:4173/?city=<city> /tmp/x.png` → 0 console error、tier 標籤正確。
- pack:`validate()` true、99 codes、`displayNameByCode` 全 zh-TW 無日文。

## 目錄地圖
- `src/main.js` 引擎入口;`src/world/` 物理/地形/spawner;`src/render/` 渲染;
  `src/packs/<city>/` 城市內容;`src/config/tuning.js`/`tiers.js` 引擎常數。
```

- [ ] **Step 2: Verify it builds nothing (doc only) and the build still passes**

```bash
npm run build 2>&1 | tail -2
```
Expected: `✓ built`.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md && git commit -m "docs: add AGENTS.md — StagePack architecture + pack contract + how-to-add-a-city"
```

### Task 0.3: Add CLAUDE.md importing AGENTS.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write `CLAUDE.md`**

```markdown
@AGENTS.md
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md && git commit -m "docs: CLAUDE.md imports AGENTS.md (single source of truth)"
```

### Task 0.4: Expand README with a "貢獻一座城市" pointer

**Files:**
- Modify: `README.md` (the 開發 / 架構 area)

- [ ] **Step 1: Add a section after the StagePack paragraph**

```markdown
## 貢獻一座城市

架構與「怎麼加一座城市」的完整契約寫在 [`AGENTS.md`](AGENTS.md)(你的 Claude/Codex
打開 repo 會自動讀到)。簡言之:複製 `src/packs/taipei/`、換內容、在
`src/packs/manifest.js` 登錄、寫測試。引擎一行不用改。
```
Also fix any `docs/DESIGN*.md` link in README to point under `docs/legacy-fable-engine/`.

- [ ] **Step 2: Build + commit**

```bash
npm run build 2>&1 | tail -1
git add README.md && git commit -m "docs(readme): add 貢獻一座城市 section pointing at AGENTS.md"
```

---

## Phase §2 — River-ribbon water (engine upgrade + fix Taipei 基隆河)

Water becomes a centerline+width ribbon (can curve/angle), with backward-compatible `rects`.

### Task 2.1: Ribbon geometry helper + unit test

**Files:**
- Create: `src/render/waterRibbon.js`
- Test: `src/render/waterRibbon.test.js`

- [ ] **Step 1: Write the failing test** (`src/render/waterRibbon.test.js`)

```js
import { describe, it, expect } from 'vitest';
import { ribbonQuads } from './waterRibbon.js';

describe('waterRibbon', () => {
  it('a 2-point straight centerline (width 10) makes one quad (4 verts) offset perpendicular', () => {
    // centerline along +X; perpendicular is ±Z; width 10 -> ±5 in Z.
    const verts = ribbonQuads([{ x: 0, z: 0 }, { x: 100, z: 0 }], 10);
    // 1 segment -> 6 vertices (2 triangles), each [x,y,z]; y filled by caller (0 here).
    expect(verts.length).toBe(6 * 3);
    const zs = [];
    for (let i = 0; i < verts.length; i += 3) zs.push(verts[i + 2]);
    expect(Math.max(...zs)).toBeCloseTo(5, 5);
    expect(Math.min(...zs)).toBeCloseTo(-5, 5);
  });

  it('N-point centerline makes N-1 segments', () => {
    const v = ribbonQuads([{ x: 0, z: 0 }, { x: 50, z: 0 }, { x: 50, z: 50 }], 8);
    expect(v.length).toBe(2 * 6 * 3); // 2 segments
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`npx vitest run src/render/waterRibbon.test.js`) — "Cannot find module".

- [ ] **Step 3: Implement** (`src/render/waterRibbon.js`)

```js
/**
 * @file waterRibbon.js — build a flat (XZ-plane) ribbon mesh from a centerline
 * polyline + width. Each segment between consecutive centerline points becomes
 * a quad (2 triangles), offset perpendicular to the segment by ±width/2. Y is
 * left 0 (the caller sets the water plane height). Real-meter coordinates.
 */

/**
 * @param {{x:number,z:number}[]} centerline >= 2 points, real meters.
 * @param {number} width ribbon width (real meters).
 * @returns {number[]} flat [x,y,z] triples, 6 verts (2 tris) per segment, y=0.
 */
export function ribbonQuads(centerline, width) {
  const out = [];
  const h = width / 2;
  for (let i = 0; i < centerline.length - 1; i++) {
    const a = centerline[i];
    const b = centerline[i + 1];
    let dx = b.x - a.x;
    let dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len; dz /= len;
    // perpendicular in XZ: (-dz, dx)
    const px = -dz * h;
    const pz = dx * h;
    const a0x = a.x + px, a0z = a.z + pz;
    const a1x = a.x - px, a1z = a.z - pz;
    const b0x = b.x + px, b0z = b.z + pz;
    const b1x = b.x - px, b1z = b.z - pz;
    // tri 1: a0,b0,b1   tri 2: a0,b1,a1   (CCW from +Y)
    out.push(a0x, 0, a0z, b0x, 0, b0z, b1x, 0, b1z);
    out.push(a0x, 0, a0z, b1x, 0, b1z, a1x, 0, a1z);
  }
  return out;
}
```

- [ ] **Step 4: Run — expect PASS.** Commit.

```bash
git add src/render/waterRibbon.js src/render/waterRibbon.test.js
git commit -m "feat(water): ribbon geometry helper (centerline + width) + test"
```

### Task 2.2: environment.js consumes centerline ribbon (fallback to rects)

**Files:**
- Modify: `src/render/environment.js` (the `PACK_WATER.rects` water-quad build, ~line 587)

- [ ] **Step 1:** Read `src/render/environment.js` around the `if (PACK_WATER !== null && PACK_WATER.rects.length > 0)` block. Import the helper at top: `import { ribbonQuads } from './waterRibbon.js';`

- [ ] **Step 2:** Replace the vertex-build so that when `PACK_WATER.centerline` exists it builds from `ribbonQuads(PACK_WATER.centerline, PACK_WATER.width)` (writing `yM` into each vertex's Y), else uses the existing rects path. Guard the outer condition with `(PACK_WATER.centerline?.length >= 2 || PACK_WATER.rects?.length > 0)`. The quay-wall strip (built from `rects[0]`): when only a centerline is present, derive a quay strip along the first centerline segment's near bank, OR skip it if `PACK_WATER.quay === false`. Keep all existing material/fog/rebase behavior.

- [ ] **Step 3:** Build (`npm run build`) — expect `✓ built`, no errors. Tests green.

- [ ] **Step 4: Commit**

```bash
git add src/render/environment.js
git commit -m "feat(water): environment.js renders centerline ribbon (rects fallback kept)"
```

### Task 2.3: Migrate Taipei 基隆河 to a centerline (fix the L)

**Files:**
- Modify: `src/packs/taipei/cityMap.js` (the `export const water` block)

- [ ] **Step 1:** Replace the 2-rect `water` with a centerline tracing the river's real north→northeast arc (real meters, origin = ball start; stay inside MAP_BOUNDS x:-1800..1800 z:-1800..2000; clear shop (0,0) and goal (749,-252)):

```js
export const water = Object.freeze({
  name: '基隆河',
  color: 0x3a5a52,
  yM: 0.3,
  width: 150,
  centerline: Object.freeze([
    Object.freeze({ x: -200, z: -620 }),
    Object.freeze({ x:  400, z: -640 }),
    Object.freeze({ x:  900, z: -560 }),
    Object.freeze({ x: 1250, z: -420 }),
    Object.freeze({ x: 1350, z: -200 }),
  ]),
});
```

- [ ] **Step 2:** Start the preview and headless-check Taipei; eyeball the river is now a smooth diagonal ribbon, not an L.

```bash
npx vite preview --port 4173 --strictPort &  # (run in background per harness)
node scripts/headless-check.mjs "http://localhost:4173/?city=taipei" /tmp/rf-river.png
```
Expected: 0 console errors; screenshot shows a curved river band (not a blocky L). (The river is north of the start; teleport not required — it's visible from the opening as the ball grows, but for a direct look append `&at=xinyi`.)

- [ ] **Step 3: Commit**

```bash
git add src/packs/taipei/cityMap.js
git commit -m "fix(taipei): 基隆河 uses a centerline ribbon — no more blocky L"
```

---

## Phase §1 — 高雄 pack (`src/packs/kaohsiung/`)

The bulk. Mirrors the taipei pack. **Geometry tasks (1.4/1.5/1.6) are parallel-authorable** (one file per item, commit per file). Each authored geometry file must follow its taipei counterpart's EXACT export shape — taipei files are the worked template.

### Task 1.1: Scaffold kaohsiung as a re-id'd taipei clone + make active.js choice-driven

This makes `?city=kaohsiung` load a VALID (placeholder-content) pack so later tasks can verify incrementally.

**Files:**
- Create: `src/packs/kaohsiung/` (copy of `src/packs/taipei/`)
- Create: `src/packs/manifest.js`
- Modify: `src/packs/active.js`
- Modify: `src/packs/kaohsiung/index.js` (id/displayName/seeds), `src/packs/kaohsiung/monument.js` (rename export symbol later in 1.3)
- Test: `src/packs/active.test.js`

- [ ] **Step 1: Copy the pack**

```bash
cp -r src/packs/taipei src/packs/kaohsiung
# drop taipei's test snapshots that assert taipei-specific ids; they get re-authored in 1.10
rm -f src/packs/kaohsiung/*.test.js
```

- [ ] **Step 2: Re-id** in `src/packs/kaohsiung/index.js`: `id:'kaohsiung'`, `displayName:'高雄'`, `seeds:{ primary:0x4B414F48, v5:0x56354B41 }`. Leave content as the taipei clone for now (it is a valid pack; content is re-themed in later tasks).

- [ ] **Step 3: Write the city manifest** (`src/packs/manifest.js`)

```js
/**
 * @file manifest.js — city registry (single source of truth for the selector
 * and active.js). status: 'ready' = playable; 'soon' = greyed "即將推出".
 */
export const CITIES = Object.freeze([
  Object.freeze({ id: 'taipei',    displayName: '台北', status: 'ready' }),
  Object.freeze({ id: 'kaohsiung', displayName: '高雄', status: 'ready' }),
]);

export const DEFAULT_CITY = 'taipei';

/** Resolve the chosen city id from ?city= then localStorage, validated against CITIES. */
export function resolveCityId() {
  let id = null;
  try {
    const u = new URLSearchParams(globalThis.location?.search || '');
    id = u.get('city');
    if (!id && globalThis.localStorage) id = globalThis.localStorage.getItem('rf_city');
  } catch { /* SSR/test: fall through to default */ }
  const ok = CITIES.some((c) => c.id === id && c.status === 'ready');
  return ok ? id : DEFAULT_CITY;
}
```

- [ ] **Step 4: Write the failing test** (`src/packs/active.test.js`)

```js
import { describe, it, expect } from 'vitest';
import { CITIES, DEFAULT_CITY, resolveCityId } from './manifest.js';

describe('city manifest', () => {
  it('lists taipei + kaohsiung as ready', () => {
    const ready = CITIES.filter((c) => c.status === 'ready').map((c) => c.id);
    expect(ready).toContain('taipei');
    expect(ready).toContain('kaohsiung');
  });
  it('resolveCityId defaults to taipei when nothing is set', () => {
    expect(resolveCityId()).toBe(DEFAULT_CITY);
  });
});
```

- [ ] **Step 5: Make active.js choice-driven** (`src/packs/active.js`) — static-import every pack (sync model; reload swaps), export the resolved one:

```js
/**
 * @file active.js — the engine's single content seam. Statically imports every
 * city pack and synchronously exports the one chosen by ?city= / localStorage
 * (see manifest.js). Switching city = reload with a new ?city (no runtime swap,
 * which the "load-time baked activePack" reads in the engine cannot support).
 */
import { activePack as taipei } from './taipei/index.js';
import { activePack as kaohsiung } from './kaohsiung/index.js';
import { resolveCityId } from './manifest.js';

const PACKS = { taipei, kaohsiung };
export const activePack = PACKS[resolveCityId()] || taipei;
export default activePack;
```

- [ ] **Step 6: Build + test + headless both cities**

```bash
npm run build 2>&1 | tail -1
npx vitest run 2>&1 | tail -3
# both cities boot (kaohsiung is still a taipei clone at this point):
node scripts/headless-check.mjs "http://localhost:4173/?city=taipei" /tmp/t.png
node scripts/headless-check.mjs "http://localhost:4173/?city=kaohsiung" /tmp/k.png
```
Expected: build ✓, tests green, both headless probes 0 console errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(kaohsiung): scaffold pack (re-id'd taipei clone) + choice-driven active.js + city manifest"
```

### Task 1.2: 高雄 tier ladder (`tiers.js`)

**Files:**
- Modify: `src/packs/kaohsiung/tiers.js`

- [ ] **Step 1:** Re-theme the 7 `TIERS` to the port-city table (spec §1): T0 鹽埕柑仔店桌頭, T1 六合夜市, T2 鹽埕騎樓, T3 機車海+港邊, T4 鹽埕街屋與廟, T5 港區與商業, T6 亞洲新灣區天際線. **Keep `enterTrueRadius`/`cellSizeSim`/`loadRadiusSim`/`objectsPerChunk` IDENTICAL to taipei** (so the fog/load-floor guard in `validateTiersStructure` passes). Author a port-city sky/fog palette (暮色港都;moonDir values may be copied from taipei to satisfy MOON_DIR_MIN_ELEV). Set each tier's `name` (zh-TW, drives HUD) and `archetypeIds` (10 ids per tier, slots 8/9 = chunk landmarks) to NEW kaohsiung chunk ids matching the theme (these ids are implemented in Task 1.4). Keep `validateTiersStructure` (with the relocated sky guards) unchanged.

- [ ] **Step 2:** `npx vitest run` — taipei tier test still green; kaohsiung tier structure validated at pack import. (kaohsiung tier test added in 1.10.) Build ✓.

- [ ] **Step 3: Commit**

```bash
git add src/packs/kaohsiung/tiers.js
git commit -m "feat(kaohsiung): 7 port-city tier themes (鹽埕/六合/港區/新灣區)"
```

### Task 1.3: 高雄 goal monument — 85 大樓 (`monument.js`)

**Files:**
- Modify: `src/packs/kaohsiung/monument.js`
- Modify: `src/packs/kaohsiung/landmarks/taipei101.js` → rename file + export to the 85 building

- [ ] **Step 1:** Author `monument.js` following `src/packs/taipei/monument.js`'s exact shape: export `KAOHSIUNG85_POS = Object.freeze({ x: 749, z: -252 })` (reuse the goal world anchor) and `goalMonument = Object.freeze({ id, name:'高雄85大樓', pos: KAOHSIUNG85_POS, baseRadiusM, buildGeometry, winToast, ... })` — same fields taipei's `goalMonument` exposes (diff them to be exact). Real height ~378 m. The geometry is the iconic「高」-shape: two outer towers + a tall central spire joining at the upper floors. Keep tri budget within the hero cap (600).

- [ ] **Step 2:** Rename the goal-tower landmark file: `git mv src/packs/kaohsiung/landmarks/taipei101.js src/packs/kaohsiung/landmarks/kaohsiung85.js`; rename its export `NM_TAIPEI101` → `NM_KAOHSIUNG85` (id `'kaohsiung_85'`, name `'高雄85大樓'`). Update `cityMap.js`/`catalog.js` imports of it (done fully in 1.7/1.8).

- [ ] **Step 3:** Build ✓, tests green (taipei untouched). Commit.

```bash
git add -A && git commit -m "feat(kaohsiung): 高雄85大樓 goal monument + landmark geometry"
```

### Task 1.4: 70 chunk archetypes (`archetypes/t0–t6.js`) — PARALLEL per tier

**Files:**
- Modify: `src/packs/kaohsiung/archetypes/t0.js` … `t6.js` (7 files, 10 archetypes each)

**Template:** `src/packs/taipei/archetypes/t0.js` — each file exports `T<n>_ARCHETYPES` (a `{ id: { id, tier, naturalBand, spawnWeight, palette[4-6], yOffset, collisionScale, displayName, buildGeometry(rng) } }` map of 10). Tri cap 350 (chunk). Use `geomHelpers.js` vocab. `displayName` zh-TW. `yOffset = -1 - minY` for grounding (compute as taipei does).

- [ ] **Step 1 (per tier file t0..t6):** Replace the 10 archetypes with kaohsiung-themed low-poly geometries matching that tier's `archetypeIds` (Task 1.2) and theme — e.g. T1 六合夜市: 木瓜牛奶杯/烤魷魚/鹽水雞…; T3: 機車/貨櫃/鐵捲門…; T6: 85大樓量體/展覽館/海音… The id strings MUST equal the `archetypeIds` set in `tiers.js`. Match the taipei archetype field shape exactly.

- [ ] **Step 2 (per file):** Quick check the file imports + the ids line up: `node --input-type=module -e "import('./src/packs/kaohsiung/archetypes/t1.js').then(m=>console.log(Object.keys(m.T1_ARCHETYPES).length))"` → 10.

- [ ] **Step 3 (per file): Commit** `git add src/packs/kaohsiung/archetypes/t<n>.js && git commit -m "feat(kaohsiung): T<n> chunk archetypes (<theme>)"`

(Full catalog tri-cap/shape validation runs in Task 1.7's catalog test.)

### Task 1.5: 8 curated landmarks (`landmarks/*.js`) — PARALLEL per landmark

**Files:**
- Replace the 8 curated landmark files under `src/packs/kaohsiung/landmarks/` with kaohsiung landmarks; remove the leftover taipei extended-landmark files not used.

**Template:** `src/packs/taipei/landmarks/longshan.js` — each exports `NM_<NAME> = { id, name, colorHex, dioramaRHint, buildGeometry(rng) }`. Hero tri cap 600. `finish([...])` normalizes to unit bounding sphere.

- [ ] **Step 1 (per landmark):** Author one file each, dioramaR small→large to keep the ladder strictly increasing (the catalog/validate enforce it):
  1. `dome_of_light.js` — 美麗島站光之穹頂 (glass dome) — id `'dome_of_light'`
  2. `pier2.js` — 駁二藝術特區 (warehouse + big figure) — `'pier2_art'`
  3. `dragon_tiger.js` — 龍虎塔 (蓮池潭 pagoda + dragon/tiger) — `'dragon_tiger_towers'`
  4. `sanfeng_temple.js` — 三鳳宮 — `'sanfeng_temple'`
  5. `music_center.js` — 高雄流行音樂中心(海音) — `'kaohsiung_music_center'`
  6. `dagang_bridge.js` — 大港橋(旋轉橋) — `'dagang_bridge'`
  7. `cijin_lighthouse.js` — 旗津燈塔 — `'cijin_lighthouse'`
  8. `dream_mall_wheel.js` — 夢時代摩天輪 — `'dream_mall_wheel'`
  (Goal `kaohsiung85.js` from Task 1.3 is the 9th, isGoal.)

- [ ] **Step 2 (per file): Commit** `git add src/packs/kaohsiung/landmarks/<file> && git commit -m "feat(kaohsiung): <name> landmark"`

### Task 1.6: 13 collectibles (`collectibles/*.js`) — PARALLEL per collectible

**Files:**
- Under `src/packs/kaohsiung/collectibles/`: keep `black_bear.js` (月牙, collectible 0 — universe constant, unchanged); replace the other 12 with kaohsiung items.

**Template:** `src/packs/taipei/collectibles/boba.js` — each exports `COL_<NAME> = { id, name, colorHex, buildGeometry(rng) }`.

- [ ] **Step 1 (per collectible):** Author one file each: 木瓜牛奶 `papaya_milk`, 大碗公冰 `big_bowl_ice`, 旗鼓餅 `qigu_cake`, 鹽埕鴨肉 `duck_rice`, 黑輪 `oden`, 烤魷魚 `grilled_squid`, 旗津渡輪 `cijin_ferry`, 高捷少女 `mrt_girls`, 旗津三輪車 `pedicab`, 旗山香蕉 `banana`, 貨櫃 `container`. (11 new + black_bear = 12; plus one more to reach 13 — add 蓮池潭春秋閣 mini `spring_autumn` OR per user's later call.) Match taipei collectible shape exactly.

- [ ] **Step 2 (per file): Commit** `git add src/packs/kaohsiung/collectibles/<file> && git commit -m "feat(kaohsiung): <name> collectible"`

### Task 1.7: catalog.js — register kaohsiung archetypes/landmarks/collectibles

**Files:**
- Modify: `src/packs/kaohsiung/catalog.js`
- Test: `src/packs/kaohsiung/catalog.test.js`

- [ ] **Step 1:** Update imports + the `_KAOHSIUNG_LANDMARKS` / `_KAOHSIUNG_COLLECTIBLES` / `_KAOHSIUNG_EXTRA_LANDMARKS` registration lists to the new ids/files (mirror taipei catalog.js structure: chunk T0–T6 + the three EXTRA registration loops computing `yOffset = -1 - boundingBox.min.y`, plus the `DISPLAY_NAME_BY_CODE` override loops). Codes: 70..81+94 collectibles, 82..89 landmarks, 90..93+95..98 extended landmarks (re-use the same code slots taipei uses). The 8 curated landmarks map to codes 82..89; the goal display slot is 93 (or as taipei).

- [ ] **Step 2: Write the failing test** (`src/packs/kaohsiung/catalog.test.js`) — mirror taipei's `catalog.test.js`: 99-id CATALOG, every chunk geometry under tri cap + unit-sphere, `DISPLAY_NAME_BY_CODE` length 99, **no Japanese kana in any of the 99 names** (`const kana = /[぀-ゟ゠-ヿ]/`), and one or two anchor assertions (e.g. `CATALOG['kaohsiung_85']` defined; `DISPLAY_NAME_BY_CODE[?] === '高雄85大樓'`).

- [ ] **Step 3:** `npx vitest run src/packs/kaohsiung/catalog.test.js` — fix authoring until green (this surfaces any tri-cap/shape/kana issues from Tasks 1.4–1.6).

- [ ] **Step 4: Commit**

```bash
git add src/packs/kaohsiung/catalog.js src/packs/kaohsiung/catalog.test.js
git commit -m "feat(kaohsiung): catalog registration + 99-code/kana-guard test"
```

### Task 1.8: cityMap.js + cityData.js (layout, landmarks, 愛河, GOAL_POS, DEV_STARTS)

**Files:**
- Modify: `src/packs/kaohsiung/cityMap.js`, `src/packs/kaohsiung/cityData.js`

- [ ] **Step 1:** In `cityMap.js`: update landmark imports + the `LANDMARKS` array (9 entries: 8 curated + 85 goal, strictly-increasing `dioramaR`, goal `isGoal:true` last) + `_KAOHSIUNG_LANDMARK_PLACEMENTS` + `PLACEMENTS` (cityData base + landmark placements) + `GOAL_POS = KAOHSIUNG85_POS` + `SKYTREE_POS`→already `GOAL_POS` post-de-Tokyo + `DEV_STARTS` (kaohsiung teleport keys: shop/夜市/機車海/港區/新灣區/goal) + `water` (愛河 centerline+width, real-meter,穿城, inside MAP_BOUNDS, clear of shop & goal). Re-export `SHOP/MAP_BOUNDS/ZONES/bandAllowedAt` from `./cityData.js`.

- [ ] **Step 2:** In `cityData.js`: keep the baked `PLACEMENTS`/`SHOP`/`ZONES`/`bandAllowedAt` (taipei coords are neutral street layout — acceptable to reuse as kaohsiung's; or hand-tune SHOP to a 鹽埕 shell). Rename the file header to kaohsiung. (Re-baking new placements is optional polish — out of scope for v1; the coords are city-neutral.)

- [ ] **Step 3:** Boot check: `node --input-type=module -e "import('./src/packs/kaohsiung/cityMap.js').then(m=>console.log('placements',m.PLACEMENTS.length,'goal',JSON.stringify(m.GOAL_POS),'water',m.water.name))"` → sane numbers, `water` = 愛河.

- [ ] **Step 4: Commit**

```bash
git add src/packs/kaohsiung/cityMap.js src/packs/kaohsiung/cityData.js
git commit -m "feat(kaohsiung): cityMap landmarks/placements + 愛河 ribbon + GOAL_POS/DEV_STARTS"
```

### Task 1.9: narration / locale / ending / geomHelpers

**Files:**
- Modify: `src/packs/kaohsiung/narration.js`, `locale.js`, `ending.js`; keep `geomHelpers.js` (identical copy is fine)

- [ ] **Step 1:** `narration.js`: re-write 月牙's lines for the 高雄 ladder (zh-TW + a little 台語味), referencing 高雄 places (迪化街→鹽埕/六合夜市/港邊…), keeping the same export shape as taipei's narration. `locale.js`: zh-TW strings (re-use taipei's, adjust any city-specific copy). `ending.js`: same Formosa-island reveal definition but **高雄 (南部) is the lit/celebrated city**; keep `islandOutline/cities/colors` shape.

- [ ] **Step 2:** `npx vitest run` (locale test added in 1.10). Build ✓.

- [ ] **Step 3: Commit**

```bash
git add src/packs/kaohsiung/narration.js src/packs/kaohsiung/locale.js src/packs/kaohsiung/ending.js
git commit -m "feat(kaohsiung): 月牙 narration + zh-TW locale + 南部 ending reveal"
```

### Task 1.10: Wire index.js + full kaohsiung test suite + headless play

**Files:**
- Modify: `src/packs/kaohsiung/index.js`
- Test: create `src/packs/kaohsiung/pack.test.js`, `tiers.test.js`, `locale.test.js`, `validate.test.js`

- [ ] **Step 1:** Finalize `index.js`: imports point at the kaohsiung landmark/collectible files; `extraIds` lists the kaohsiung ids in code order (collectibles 70..81+94, landmarks 82..89, extended 90..93+95..98); `goalMonument` from kaohsiung `monument.js`; `seeds` KAOH/V5KA. Mirror taipei `index.js` exactly otherwise.

- [ ] **Step 2: Write the tests** mirroring taipei's: `pack.test.js` (id/region/displayName='高雄', validate() true, code map 99 hole-free, code→id anchors), `tiers.test.js` (7 tiers, 70 unique ids, sky guards), `locale.test.js`, `validate.test.js`. **Include the kana guard** in `pack.test.js`: assert no `/[぀-ゟ゠-ヿ]/` in any of the 99 `displayNameByCode` and in any `extraIds`/`archetypeIdByCode` entry.

- [ ] **Step 3:** `npx vitest run` — ALL green (taipei + kaohsiung). `npm run build` ✓.

- [ ] **Step 4: Headless play kaohsiung**

```bash
node scripts/headless-check.mjs "http://localhost:4173/?city=kaohsiung" /tmp/rf-kao.png
```
Expected: 0 console errors; probe `tierLabel` = the kaohsiung T0 name (e.g. "鹽埕柑仔店桌頭"). View the screenshot — port-city scene, 月牙 narration, neon HUD.

- [ ] **Step 5: Commit**

```bash
git add src/packs/kaohsiung/index.js src/packs/kaohsiung/*.test.js
git commit -m "feat(kaohsiung): wire pack object + full test suite (pack/tiers/locale/validate + kana guard)"
```

---

## Phase §3 — 縣市選單 (city-select screen)

`active.js` + manifest already choice-driven (Task 1.1). This adds the UI.

### Task 3.1: City-select screen module

**Files:**
- Create: `src/ui/citySelect.js`
- Modify: `index.html` (add the selector overlay markup + neon styles, mirroring the existing title/HUD neon classes)
- Modify: `src/main.js` (show the selector before/at title when no `?city=` is pinned)

- [ ] **Step 1:** `index.html`: add a `#city-select` overlay (hidden by default) with one neon card per `CITIES` entry rendered by JS; `status:'soon'` cities render greyed "即將推出". Style with the existing `var(--c-*)` / Bungee / neon classes (no hardcoded rgba) — match the title's 夜市霓虹 look.

- [ ] **Step 2:** `src/ui/citySelect.js`: render cards from `CITIES`; on click of a `ready` card → `localStorage.setItem('rf_city', id)` then `location.search = '?city=' + id` (reload into that city). Export `showCitySelect()` / `hideCitySelect()`.

- [ ] **Step 3:** `src/main.js`: on boot, if the URL has no explicit `?city=` AND there's no stored `rf_city`, show the city-select first (so first-time players choose); otherwise go straight into the resolved city (with a small "換城市" button on the title/result screen that calls `showCitySelect()`). Keep it minimal.

- [ ] **Step 4: Build + headless**: click the 高雄 card → page reloads to `?city=kaohsiung` → kaohsiung tier label. Extend `scripts/headless-check.mjs` invocation: load `/`, click `#city-select [data-city="kaohsiung"]`, wait for reload, probe tierLabel.

```bash
node scripts/headless-check.mjs "http://localhost:4173/" /tmp/rf-select.png
```
Expected: 0 console errors; selector visible with 台北/高雄 cards.

- [ ] **Step 5: Commit**

```bash
git add src/ui/citySelect.js index.html src/main.js
git commit -m "feat(city-select): neon 縣市選單 (台北/高雄 cards, reload-based switch)"
```

### Task 3.2: README + AGENTS.md note the selector; final full verification

**Files:**
- Modify: `README.md`, `AGENTS.md` (操作 section: `?city=` + selector)

- [ ] **Step 1:** Document `?city=taipei|kaohsiung` and the in-game selector in README 操作 + AGENTS.md.

- [ ] **Step 2: Full gate**

```bash
npm run build 2>&1 | tail -1
npx vitest run 2>&1 | tail -3
grep -rniE "skytree|スカイツリー|tokyo|東京" src --include=*.js | grep -v "\.test\.js" | grep -vi "de-tokyo" | wc -l   # → 0
grep -rlnE "[぀-ゟ゠-ヿ]" src --include=*.js | grep -v "\.test\.js" | wc -l   # → 0
node scripts/headless-check.mjs "http://localhost:4173/?city=taipei" /tmp/t.png
node scripts/headless-check.mjs "http://localhost:4173/?city=kaohsiung" /tmp/k.png
```
Expected: build ✓, all tests green, zero Tokyo/kana, both cities render with 0 errors.

- [ ] **Step 3: Commit + finish the branch** (PR/merge per repo workflow)

```bash
git add README.md AGENTS.md && git commit -m "docs: document ?city= + 縣市選單"
```
Then use **superpowers:finishing-a-development-branch** to merge `feat/kaohsiung` → `main` (push auto-deploys).

---

## Self-Review (against the spec)

- **§0 docs** → Tasks 0.1–0.4 ✓ (archive Tokyo docs, AGENTS.md, CLAUDE.md, README).
- **§2 water** → Tasks 2.1–2.3 ✓ (ribbon helper+test, environment.js, migrate 基隆河).
- **§1 kaohsiung pack** → Tasks 1.1–1.10 ✓ (scaffold+active.js+manifest, tiers, monument, 70 archetypes, 8 landmarks, 13 collectibles, catalog, cityMap/cityData+愛河, narration/locale/ending, index+tests).
- **§3 city-select** → Tasks 3.1–3.2 ✓ (screen, docs, final gate).
- **Pack contract** (seeds distinct, 99 codes, no-Tokyo/no-kana guards) covered in 1.1/1.7/1.10.
- **Build order** §0→§2→§1→§3 preserved.
- Type/name consistency: `GOAL_POS` (not SKYTREE_POS, post-de-Tokyo), `NM_KAOHSIUNG85`, `KAOHSIUNG85_POS`, `resolveCityId`, `CITIES`, `ribbonQuads`, `water.centerline`/`water.width` — used consistently across tasks.
- Open content choice deferred to authoring: the 13th collectible (Task 1.6) — 春秋閣 mini is the placeholder pick; swap if the user prefers another 高雄 item.
