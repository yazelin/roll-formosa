/**
 * @file cityMap.js — Yilan pack cityMap (P6b).
 *
 * P6b: introduces native Yilan LANDMARKS (7 curated singletons + 龜山島 goal).
 * The 7 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Yilan 8 entries (7 curated + 龜山島 goal)
 *   - PLACEMENTS  → cityData base placements + the 7 Yilan landmark placements
 *   - GOAL_POS    → GUISHAN_POS (龜山島 position)
 *   - DEV_STARTS  → Yilan-themed teleport keys
 */

import { GUISHAN_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 7 curated landmark geometry descriptors for position/color/name.
import { NM_JIMMY_PLAZA } from './landmarks/jimmy_plaza.js';
import { NM_SUAO_COLD_SPRING } from './landmarks/suao_cold_spring.js';
import { NM_TOUCHENG_OLD_STREET } from './landmarks/toucheng_old_street.js';
import { NM_YILAN_STATION } from './landmarks/yilan_station.js';
import { NM_LUODONG_FORESTRY } from './landmarks/luodong_forestry.js';
import { NM_LANYANG_MUSEUM } from './landmarks/lanyang_museum.js';
import { NM_CHUANYI_CENTER } from './landmarks/chuanyi_center.js';
import { NM_GUISHAN } from './landmarks/guishan.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 龜山島龜 94) — already filtered at bake time. We append the 7 native
// Yilan landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Yilan landmark positions (game-meter, origin = ball start)          */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 7 curated Yilan landmarks.
 * Convention (same as the base layout POS): origin = ball start (宜蘭市區),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Yilan
 * geography (宜蘭市中心 start; 羅東 south; 蘇澳 southeast; 龜山島 northeast).
 */
const POS = Object.freeze({
  jimmy_plaza:    Object.freeze({ x:  -20, z:   25 }),   // 幾米廣場 — near start (宜蘭站旁)
  suao_cold:      Object.freeze({ x:  320, z:  480 }),   // 蘇澳冷泉 — southeast
  toucheng:       Object.freeze({ x: -180, z: -350 }),   // 頭城老街 — north
  yilan_station:  Object.freeze({ x:   10, z:    0 }),   // 宜蘭火車站 — start area
  luodong:        Object.freeze({ x:  -80, z:  360 }),   // 羅東林業文化園區 — south
  lanyang_museum: Object.freeze({ x:  100, z: -420 }),   // 蘭陽博物館 — north (near Wushi Harbor)
  chuanyi:        Object.freeze({ x: -280, z:  520 }),   // 傳藝中心 — southwest
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..88 = Yilan landmarks)     */
/* ================================================================== */
/** EXTRA codes for the 7 Yilan curated landmark singletons (frozen P6b). */
const CODE_JIMMY_PLAZA    = 82;
const CODE_SUAO_COLD      = 83;
const CODE_TOUCHENG       = 84;
const CODE_YILAN_STATION  = 85;
const CODE_LUODONG        = 86;
const CODE_LANYANG_MUSEUM = 87;
const CODE_CHUANYI        = 88;

/* ================================================================== */
/* LANDMARKS — 8 entries: 7 curated + 龜山島 goal (strictly increasing */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Yilan landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be strictly monotone while respecting real-world scale):
 *   L0  幾米廣場         dioramaR  12 → absorbable @  18.5 m
 *   L1  蘇澳冷泉         dioramaR  26 → absorbable @  40.0 m
 *   L2  頭城老街         dioramaR  29 → absorbable @  44.6 m
 *   L3  宜蘭火車站       dioramaR  32 → absorbable @  49.2 m
 *   L4  羅東林業文化園區 dioramaR  36 → absorbable @  55.4 m
 *   L5  蘭陽博物館       dioramaR  42 → absorbable @  64.6 m
 *   L6  傳藝中心         dioramaR  50 → absorbable @  76.9 m
 *   L7  龜山島(goal)     dioramaR 250 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_JIMMY_PLAZA.landmarkId,     // 0
    name: NM_JIMMY_PLAZA.name,
    nameJa: NM_JIMMY_PLAZA.name,               // nameJa alias for curated.js compat
    x: POS.jimmy_plaza.x,  z: POS.jimmy_plaza.z,
    dioramaR: 12,
    collisionScale: 1.0,
    sizeReal: 15,
    archetypeCode: CODE_JIMMY_PLAZA,
    naturalBand: 2,
    colorHex: NM_JIMMY_PLAZA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SUAO_COLD_SPRING.landmarkId, // 1
    name: NM_SUAO_COLD_SPRING.name,
    nameJa: NM_SUAO_COLD_SPRING.name,
    x: POS.suao_cold.x, z: POS.suao_cold.z,
    dioramaR: 26,
    collisionScale: 0.9,
    sizeReal: 35,
    archetypeCode: CODE_SUAO_COLD,
    naturalBand: 3,
    colorHex: NM_SUAO_COLD_SPRING.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TOUCHENG_OLD_STREET.landmarkId, // 2
    name: NM_TOUCHENG_OLD_STREET.name,
    nameJa: NM_TOUCHENG_OLD_STREET.name,
    x: POS.toucheng.x, z: POS.toucheng.z,
    dioramaR: 29,
    collisionScale: 0.9,
    sizeReal: 40,
    archetypeCode: CODE_TOUCHENG,
    naturalBand: 3,
    colorHex: NM_TOUCHENG_OLD_STREET.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_YILAN_STATION.landmarkId,   // 3
    name: NM_YILAN_STATION.name,
    nameJa: NM_YILAN_STATION.name,
    x: POS.yilan_station.x, z: POS.yilan_station.z,
    dioramaR: 32,
    collisionScale: 0.9,
    sizeReal: 45,
    archetypeCode: CODE_YILAN_STATION,
    naturalBand: 3,
    colorHex: NM_YILAN_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LUODONG_FORESTRY.landmarkId, // 4
    name: NM_LUODONG_FORESTRY.name,
    nameJa: NM_LUODONG_FORESTRY.name,
    x: POS.luodong.x, z: POS.luodong.z,
    dioramaR: 36,
    collisionScale: 0.85,
    sizeReal: 50,
    archetypeCode: CODE_LUODONG,
    naturalBand: 3,
    colorHex: NM_LUODONG_FORESTRY.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LANYANG_MUSEUM.landmarkId,  // 5
    name: NM_LANYANG_MUSEUM.name,
    nameJa: NM_LANYANG_MUSEUM.name,
    x: POS.lanyang_museum.x, z: POS.lanyang_museum.z,
    dioramaR: 42,
    collisionScale: 0.8,
    sizeReal: 55,
    archetypeCode: CODE_LANYANG_MUSEUM,
    naturalBand: 4,
    colorHex: NM_LANYANG_MUSEUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CHUANYI_CENTER.landmarkId,  // 6
    name: NM_CHUANYI_CENTER.name,
    nameJa: NM_CHUANYI_CENTER.name,
    x: POS.chuanyi.x, z: POS.chuanyi.z,
    dioramaR: 50,
    collisionScale: 0.8,
    sizeReal: 60,
    archetypeCode: CODE_CHUANYI,
    naturalBand: 4,
    colorHex: NM_CHUANYI_CENTER.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_GUISHAN.landmarkId,         // 7 — GOAL
    name: NM_GUISHAN.name,
    nameJa: NM_GUISHAN.name,
    x: GUISHAN_POS.x, z: GUISHAN_POS.z,
    dioramaR: 250,
    collisionScale: 0.5,
    sizeReal: 401,  // ~401 m peak height
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0x3a6a3e,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 7 Yilan landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Yilan: starts with the full cityData base set,
 * then appends the 7 Yilan landmark singleton placements. The 龜山島 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _YILAN_LANDMARK_PLACEMENTS = LANDMARKS
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
// collectibles 70..81 + 龜山島龜 94); the former legacy landmark/building codes
// 82..98 were dropped at bake time (they OVERFLOWED the landmark-xl pool →
// invisible-but-collidable, and the 7 curated landmarks are re-placed natively
// below). Append the 7 Yilan landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._YILAN_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 蘭陽溪 river definition for the Yilan pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 宜蘭市, +X east, +Z south).
 *
 * A 5-point centerline + width (180 m) traces the river's real west→east
 * flow from the mountains to the sea (consumed by environment.js via ribbonQuads).
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and the 龜山島 goal (749,-252).
 *
 * color: slightly murky greenish-brown (蘭陽溪 characteristic muddy look from
 * mountain sediment), yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '蘭陽溪',
  color: 0x4a5a48,
  yM: 0.3,
  width: 180,
  centerline: Object.freeze([
    Object.freeze({ x: -600, z:  200 }),   // upstream (west, from mountains)
    Object.freeze({ x: -200, z:  180 }),   // mid-plain
    Object.freeze({ x:  200, z:  150 }),   // near 羅東
    Object.freeze({ x:  600, z:  100 }),   // downstream
    Object.freeze({ x: 1000, z:   50 }),   // near river mouth (Wushi Harbor)
  ]),
});

/* ================================================================== */
/* Overrides (Yilan-specific)                                         */
/* ================================================================== */

/**
 * Goal monument real-meter position (龜山島 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = GUISHAN_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Yilan ladder keys: shop / night-market / arcade / scooter-sea /
 * lanyang / suao / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 宜蘭市區 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 羅東夜市 night-market strip (south quadrant). */
  'night-market': Object.freeze({ x: -60,  z: 300,   r: 0.5  }),
  /** 宜蘭市 arcade / 街區 district. */
  arcade:      Object.freeze({ x: -50,  z: 80,    r: 3    }),
  /** 機車海 scooter-sea band (mid-map density ramp). */
  'scooter-sea': Object.freeze({ x: 100,  z: 200,   r: 30   }),
  /** 蘭陽平原 / 傳藝中心 district (mid-radius). */
  lanyang:     Object.freeze({ x: -280, z: 500,   r: 120  }),
  /** 蘇澳漁港 (approach zone near coast). */
  suao:        Object.freeze({ x: 400,  z: 450,   r: 200  }),
  /** Near the 龜山島 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
