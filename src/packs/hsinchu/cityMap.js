/**
 * @file cityMap.js — Hsinchu pack cityMap.
 *
 * Introduces native Hsinchu LANDMARKS (8 curated singletons + 城隍廟 goal).
 * The 8 curated landmarks are wired into PLACEMENTS so they spawn in the
 * world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Hsinchu 9 entries (8 curated + 城隍廟 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Hsinchu landmark placements
 *   - GOAL_POS    → CHENGHUANG_POS (城隍廟 position)
 *   - DEV_STARTS  → Hsinchu-themed teleport keys
 */

import { CHENGHUANG_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_HSINCHU_STATION } from './landmarks/hsinchu_station.js';
import { NM_DONGMEN } from './landmarks/dongmen.js';
import { NM_GLASS_MUSEUM } from './landmarks/glass_museum.js';
import { NM_HSINCHU_ZOO } from './landmarks/hsinchu_zoo.js';
import { NM_TSING_HUA } from './landmarks/tsing_hua.js';
import { NM_SCIENCE_PARK } from './landmarks/science_park.js';
import { NM_SEVENTEEN_KM } from './landmarks/seventeen_km.js';
import { NM_BIG_BUDDHA } from './landmarks/big_buddha.js';
import { NM_CHENGHUANG_TEMPLE } from './landmarks/chenghuang_temple.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Hsinchu landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Hsinchu landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Hsinchu landmarks.
 * Convention: origin = ball start (城隍廟口 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Hsinchu
 * geography (火車站 central; 東門城 central; 護城河/玻璃博物館 north;
 * 動物園 north; 清華/交大 east; 科學園區 northeast; 十七公里海岸 west coast).
 */
const POS = Object.freeze({
  hsinchu_station: Object.freeze({ x:  -20, z:   40 }),   // 新竹火車站 — near ball start
  dongmen:         Object.freeze({ x:  -80, z:  120 }),   // 東門城 — central circle
  glass_museum:    Object.freeze({ x:  150, z: -180 }),   // 玻璃博物館 — 新竹公園 north
  hsinchu_zoo:     Object.freeze({ x:  200, z: -250 }),   // 動物園 — adjacent to glass museum
  tsing_hua:       Object.freeze({ x:  400, z:  150 }),   // 清華大學 — east campus area
  science_park:    Object.freeze({ x:  550, z: -100 }),   // 科學園區 — northeast
  seventeen_km:    Object.freeze({ x: -450, z:  350 }),   // 十七公里海岸 — west coast
  big_buddha:      Object.freeze({ x:  300, z:  450 }),   // 青草湖大佛 — south
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Hsinchu landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Hsinchu curated landmark singletons. */
const CODE_HSINCHU_STATION = 82;
const CODE_DONGMEN         = 83;
const CODE_GLASS_MUSEUM    = 84;
const CODE_HSINCHU_ZOO     = 85;
const CODE_TSING_HUA       = 86;
const CODE_SCIENCE_PARK    = 87;
const CODE_SEVENTEEN_KM    = 88;
const CODE_BIG_BUDDHA      = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 城隍廟 goal (strictly increasing */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Hsinchu landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  新竹火車站       dioramaR  15 → absorbable @  23.1 m
 *   L1  東門城           dioramaR  28 → absorbable @  43.1 m
 *   L2  玻璃工藝博物館   dioramaR  40 → absorbable @  61.5 m
 *   L3  新竹動物園       dioramaR  60 → absorbable @  92.3 m
 *   L4  清華大學大門     dioramaR  85 → absorbable @ 130.8 m
 *   L5  科學園區探索館   dioramaR 115 → absorbable @ 176.9 m
 *   L6  十七公里海岸風車 dioramaR 150 → absorbable @ 230.8 m
 *   L7  青草湖大佛       dioramaR 190 → absorbable @ 292.3 m
 *   L8  新竹城隍廟(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_HSINCHU_STATION.landmarkId,   // 10
    name: NM_HSINCHU_STATION.name,
    nameJa: NM_HSINCHU_STATION.name,             // nameJa alias for curated.js compat
    x: POS.hsinchu_station.x, z: POS.hsinchu_station.z,
    dioramaR: 15,
    collisionScale: 1.0,
    sizeReal: 18,
    archetypeCode: CODE_HSINCHU_STATION,
    naturalBand: 3,
    colorHex: NM_HSINCHU_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DONGMEN.landmarkId,           // 11
    name: NM_DONGMEN.name,
    nameJa: NM_DONGMEN.name,
    x: POS.dongmen.x, z: POS.dongmen.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 35,
    archetypeCode: CODE_DONGMEN,
    naturalBand: 3,
    colorHex: NM_DONGMEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_GLASS_MUSEUM.landmarkId,      // 12
    name: NM_GLASS_MUSEUM.name,
    nameJa: NM_GLASS_MUSEUM.name,
    x: POS.glass_museum.x, z: POS.glass_museum.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_GLASS_MUSEUM,
    naturalBand: 4,
    colorHex: NM_GLASS_MUSEUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_HSINCHU_ZOO.landmarkId,       // 13
    name: NM_HSINCHU_ZOO.name,
    nameJa: NM_HSINCHU_ZOO.name,
    x: POS.hsinchu_zoo.x, z: POS.hsinchu_zoo.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 75,
    archetypeCode: CODE_HSINCHU_ZOO,
    naturalBand: 4,
    colorHex: NM_HSINCHU_ZOO.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TSING_HUA.landmarkId,         // 14
    name: NM_TSING_HUA.name,
    nameJa: NM_TSING_HUA.name,
    x: POS.tsing_hua.x, z: POS.tsing_hua.z,
    dioramaR: 85,
    collisionScale: 0.8,
    sizeReal: 100,
    archetypeCode: CODE_TSING_HUA,
    naturalBand: 5,
    colorHex: NM_TSING_HUA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SCIENCE_PARK.landmarkId,      // 15
    name: NM_SCIENCE_PARK.name,
    nameJa: NM_SCIENCE_PARK.name,
    x: POS.science_park.x, z: POS.science_park.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 140,
    archetypeCode: CODE_SCIENCE_PARK,
    naturalBand: 5,
    colorHex: NM_SCIENCE_PARK.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SEVENTEEN_KM.landmarkId,      // 16
    name: NM_SEVENTEEN_KM.name,
    nameJa: NM_SEVENTEEN_KM.name,
    x: POS.seventeen_km.x, z: POS.seventeen_km.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 180,
    archetypeCode: CODE_SEVENTEEN_KM,
    naturalBand: 5,
    colorHex: NM_SEVENTEEN_KM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_BIG_BUDDHA.landmarkId,        // 17
    name: NM_BIG_BUDDHA.name,
    nameJa: NM_BIG_BUDDHA.name,
    x: POS.big_buddha.x, z: POS.big_buddha.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 220,
    archetypeCode: CODE_BIG_BUDDHA,
    naturalBand: 5,
    colorHex: NM_BIG_BUDDHA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CHENGHUANG_TEMPLE.landmarkId, // 0 — GOAL
    name: NM_CHENGHUANG_TEMPLE.name,
    nameJa: NM_CHENGHUANG_TEMPLE.name,
    x: CHENGHUANG_POS.x, z: CHENGHUANG_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 65,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: NM_CHENGHUANG_TEMPLE.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Hsinchu landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Hsinchu: starts with the full cityData base set,
 * then appends the 8 Hsinchu landmark singleton placements. The 城隍廟 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _HSINCHU_LANDMARK_PLACEMENTS = LANDMARKS
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
// 82..98 were dropped at bake time. Append the 8 Hsinchu landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._HSINCHU_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 護城河 moat definition for the Hsinchu pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 城隍廟口 shop, +X east, +Z south).
 *
 * The old city moat (護城河) is now a scenic greenway/waterway circling
 * the old city center. A simplified centerline + width traces the moat's
 * path around the old city wall area.
 *
 * color: greenish-blue (城市綠廊 aesthetic)
 * yM: 0.3 m above ground (hides the seam).
 */
export const water = Object.freeze({
  name: '護城河',
  color: 0x4a6a58,
  yM: 0.3,
  width: 30,
  centerline: Object.freeze([
    Object.freeze({ x: -150, z: -50 }),
    Object.freeze({ x:  -50, z: -80 }),
    Object.freeze({ x:   80, z: -60 }),
    Object.freeze({ x:  120, z:  20 }),
    Object.freeze({ x:   80, z: 100 }),
    Object.freeze({ x:  -50, z: 120 }),
    Object.freeze({ x: -120, z:  60 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (新竹城隍廟 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = CHENGHUANG_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Hsinchu ladder keys: shop / night-market / arcade / scooter-sea /
 * moat / campus / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 城隍廟口 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 城隍廟夜市 night-market strip. */
  'night-market': Object.freeze({ x: 30,   z: -50,   r: 0.5  }),
  /** 東門街巷 arcade / old city streets. */
  arcade:      Object.freeze({ x: -80,  z: 100,   r: 3    }),
  /** 機車海 scooter-sea band (mid-map density ramp). */
  'scooter-sea': Object.freeze({ x: 100,  z: 200,   r: 30   }),
  /** 護城河 moat area (mid-radius). */
  moat:        Object.freeze({ x: -100, z: -30,   r: 80   }),
  /** 清大/交大 campus area (mid-large radius). */
  campus:      Object.freeze({ x: 400,  z: 100,   r: 150  }),
  /** 科學園區 area. */
  park:        Object.freeze({ x: 500,  z: -150,  r: 250  }),
  /** Near the 新竹城隍廟 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
