/**
 * @file cityMap.js — Hualien pack cityMap (P6b).
 *
 * P6b: introduces native Hualien LANDMARKS (8 curated singletons + 太魯閣牌樓 goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Hualien 9 entries (8 curated + 太魯閣牌樓 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Hualien landmark placements
 *   - GOAL_POS    → TAROKO_GATE_POS
 *   - DEV_STARTS  → Hualien-themed teleport keys
 */

import { TAROKO_GATE_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_QINGXIU } from './landmarks/qingxiu_temple.js';
import { NM_PINE_GARDEN } from './landmarks/pine_garden.js';
import { NM_QIXINGTAN } from './landmarks/qixingtan_park.js';
import { NM_FARGLORY } from './landmarks/farglory_ocean.js';
import { NM_CULTURAL_PARK } from './landmarks/cultural_park.js';
import { NM_DONGDAMEN } from './landmarks/dongdamen_arch.js';
import { NM_LIYU } from './landmarks/liyu_lake.js';
import { NM_SWALLOW } from './landmarks/swallow_grotto.js';
import { NM_TAROKO_GATE } from './landmarks/taroko_gate.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Hualien landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Hualien landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Hualien landmarks.
 * Convention (same as the base layout POS): origin = ball start (文創小店 entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking Hualien
 * geography (市區/文創 central; 七星潭 northeast; 太魯閣 northwest).
 */
const POS = Object.freeze({
  qingxiu:      Object.freeze({ x:  -20, z:   40 }),   // 慶修院 — near start (吉安)
  pine_garden:  Object.freeze({ x:   80, z:  -80 }),   // 松園別館 — north of city center
  qixingtan:    Object.freeze({ x:  250, z: -350 }),   // 七星潭風景區 — northeast coast
  farglory:     Object.freeze({ x: -320, z:  400 }),   // 遠雄海洋公園 — south end
  cultural_park: Object.freeze({ x:  -50, z:  150 }), // 花蓮文創園區 — city center
  dongdamen:    Object.freeze({ x:  120, z:  280 }),   // 東大門夜市 — east market district
  liyu_lake:    Object.freeze({ x: -400, z:  100 }),   // 鯉魚潭 — west valley
  swallow:      Object.freeze({ x:  450, z: -450 }),   // 燕子口 — approaching gorge
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Hualien landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Hualien curated landmark singletons (frozen P6b). */
const CODE_QINGXIU       = 82;
const CODE_PINE_GARDEN   = 83;
const CODE_QIXINGTAN     = 84;
const CODE_FARGLORY      = 85;
const CODE_CULTURAL_PARK = 86;
const CODE_DONGDAMEN     = 87;
const CODE_LIYU          = 88;
const CODE_SWALLOW       = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 太魯閣牌樓 goal (strictly increasing   */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Hualien landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  慶修院           dioramaR   8 → absorbable @  12.3 m
 *   L1  松園別館         dioramaR  15 → absorbable @  23.1 m
 *   L2  七星潭風景區     dioramaR  35 → absorbable @  53.8 m
 *   L3  遠雄海洋公園     dioramaR  55 → absorbable @  84.6 m
 *   L4  花蓮文創園區     dioramaR  80 → absorbable @ 123.1 m
 *   L5  東大門夜市       dioramaR 110 → absorbable @ 169.2 m
 *   L6  鯉魚潭           dioramaR 140 → absorbable @ 215.4 m
 *   L7  燕子口           dioramaR 180 → absorbable @ 276.9 m
 *   L8  太魯閣牌樓(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_QINGXIU.landmarkId,       // 0
    name: NM_QINGXIU.name,
    nameJa: NM_QINGXIU.name,                 // nameJa alias for curated.js compat
    x: POS.qingxiu.x,  z: POS.qingxiu.z,
    dioramaR: 8,
    collisionScale: 1.0,
    sizeReal: 10,
    archetypeCode: CODE_QINGXIU,
    naturalBand: 3,
    colorHex: NM_QINGXIU.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_PINE_GARDEN.landmarkId,   // 1
    name: NM_PINE_GARDEN.name,
    nameJa: NM_PINE_GARDEN.name,
    x: POS.pine_garden.x, z: POS.pine_garden.z,
    dioramaR: 15,
    collisionScale: 0.9,
    sizeReal: 25,
    archetypeCode: CODE_PINE_GARDEN,
    naturalBand: 3,
    colorHex: NM_PINE_GARDEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_QIXINGTAN.landmarkId,     // 2
    name: NM_QIXINGTAN.name,
    nameJa: NM_QIXINGTAN.name,
    x: POS.qixingtan.x, z: POS.qixingtan.z,
    dioramaR: 35,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_QIXINGTAN,
    naturalBand: 3,
    colorHex: NM_QIXINGTAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_FARGLORY.landmarkId,      // 3
    name: NM_FARGLORY.name,
    nameJa: NM_FARGLORY.name,
    x: POS.farglory.x, z: POS.farglory.z,
    dioramaR: 55,
    collisionScale: 0.9,
    sizeReal: 100,
    archetypeCode: CODE_FARGLORY,
    naturalBand: 4,
    colorHex: NM_FARGLORY.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CULTURAL_PARK.landmarkId, // 4
    name: NM_CULTURAL_PARK.name,
    nameJa: NM_CULTURAL_PARK.name,
    x: POS.cultural_park.x, z: POS.cultural_park.z,
    dioramaR: 80,
    collisionScale: 0.8,
    sizeReal: 120,
    archetypeCode: CODE_CULTURAL_PARK,
    naturalBand: 4,
    colorHex: NM_CULTURAL_PARK.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DONGDAMEN.landmarkId,     // 5
    name: NM_DONGDAMEN.name,
    nameJa: NM_DONGDAMEN.name,
    x: POS.dongdamen.x, z: POS.dongdamen.z,
    dioramaR: 110,
    collisionScale: 0.8,
    sizeReal: 180,
    archetypeCode: CODE_DONGDAMEN,
    naturalBand: 5,
    colorHex: NM_DONGDAMEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LIYU.landmarkId,          // 6
    name: NM_LIYU.name,
    nameJa: NM_LIYU.name,
    x: POS.liyu_lake.x, z: POS.liyu_lake.z,
    dioramaR: 140,
    collisionScale: 0.75,
    sizeReal: 220,
    archetypeCode: CODE_LIYU,
    naturalBand: 5,
    colorHex: NM_LIYU.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SWALLOW.landmarkId,       // 7
    name: NM_SWALLOW.name,
    nameJa: NM_SWALLOW.name,
    x: POS.swallow.x, z: POS.swallow.z,
    dioramaR: 180,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_SWALLOW,
    naturalBand: 5,
    colorHex: NM_SWALLOW.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TAROKO_GATE.landmarkId,   // 8 — GOAL
    name: NM_TAROKO_GATE.name,
    nameJa: NM_TAROKO_GATE.name,
    x: TAROKO_GATE_POS.x, z: TAROKO_GATE_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 15, // real gate is ~15m but game scale is bigger
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: NM_TAROKO_GATE.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Hualien landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Hualien: starts with the full cityData base set,
 * then appends the 8 Hualien landmark singleton placements. The 太魯閣牌樓 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _HUALIEN_LANDMARK_PLACEMENTS = LANDMARKS
  .filter((ld) => !ld.isGoal)
  .map((ld) => ({
    archetypeCode: ld.archetypeCode,
    x: ld.x, y: 0, z: ld.z,
    radiusReal: ld.dioramaR,
    yaw: 0,
    naturalBand: ld.naturalBand,
    landmarkId: ld.landmarkId,
    collectibleId: -1,
    interior: false, interiorElevated: false, releaseGated: false,
    yK: 1,
    colorHex: ld.colorHex,
    rIntent: ld.dioramaR / ABSORB_RATIO,
  }));

// cityData.PLACEMENTS is already the kept curated base (chunk dressing 0..69 +
// collectibles 70..81 + 媽祖 94); the former legacy landmark/building codes
// 82..98 were dropped at bake time (they OVERFLOWED the landmark-xl pool →
// invisible-but-collidable, and the 8 curated landmarks are re-placed natively
// below). Append the 8 Hualien landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._HUALIEN_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 美崙溪 river definition for the Hualien pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 文創小店, +X east, +Z south).
 *
 * A 5-point centerline + width (80 m) traces the river's real west→east
 * flow through the city toward the Pacific Ocean, passing north of the
 * main urban area before the ball heads west toward Taroko.
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and the goal (749,-252) — every point is at
 * z ≤ -150 (north of the play area).
 *
 * color: clear mountain stream blue-green (cleaner than Taipei's river),
 * evoking the river's characteristic clean mountain water from Taroko.
 * yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '美崙溪',
  color: 0x4a8a9a,
  yM: 0.3,
  width: 80,
  centerline: Object.freeze([
    Object.freeze({ x: -600, z: -350 }),
    Object.freeze({ x: -200, z: -380 }),
    Object.freeze({ x:  200, z: -420 }),
    Object.freeze({ x:  600, z: -380 }),
    Object.freeze({ x: 1000, z: -300 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (太魯閣牌樓 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = TAROKO_GATE_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Hualien ladder keys: shop / night-market / aboriginal / qixingtan /
 * taroko / gorge / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 文創小店 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 東大門夜市 night-market strip. */
  'night-market': Object.freeze({ x: 120,  z: 280,   r: 0.5  }),
  /** 原民街巷 aboriginal craft district. */
  aboriginal:  Object.freeze({ x: -100, z: 120,   r: 3    }),
  /** 七星潭 beach area (mid-map). */
  qixingtan:   Object.freeze({ x: 250,  z: -350,  r: 30   }),
  /** 太魯閣入口 Taroko entrance area. */
  taroko:      Object.freeze({ x: 450,  z: -400,  r: 120  }),
  /** 峽谷區 gorge area (approach zone near goal). */
  gorge:       Object.freeze({ x: 600,  z: -350,  r: 300  }),
  /** Near the 太魯閣牌樓 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
