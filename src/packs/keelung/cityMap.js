/**
 * @file cityMap.js — Keelung pack cityMap.
 *
 * Native Keelung LANDMARKS (8 curated singletons + 正濱漁港彩色屋 goal).
 * The 8 curated landmarks are wired into PLACEMENTS so they spawn in
 * the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Keelung 9 entries (8 curated + 正濱漁港彩色屋 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Keelung landmark placements
 *   - GOAL_POS    → ZHENGBIN_POS (正濱漁港彩色屋)
 *   - DEV_STARTS  → Keelung-themed teleport keys
 *   - water       → 基隆港 harbor
 */

import { ZHENGBIN_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_MIAOKOU_GATE } from './landmarks/miaokou_gate.js';
import { NM_KEELUNG_STATION } from './landmarks/keelung_station.js';
import { NM_GUANYIN_STATUE } from './landmarks/guanyin_statue.js';
import { NM_OCEAN_PLAZA } from './landmarks/ocean_plaza.js';
import { NM_XIANDONYAN } from './landmarks/xiandonyan.js';
import { NM_HEPING_ISLAND } from './landmarks/heping_island.js';
import { NM_KEELUNG_ISLET } from './landmarks/keelung_islet.js';
import { NM_QINGAN_TEMPLE } from './landmarks/qingan_temple.js';
import { NM_ZHENGBIN_COLORHOUSES } from './landmarks/zhengbin_colorhouses.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Keelung landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Keelung landmark positions (game-meter, origin = ball start)       */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Keelung landmarks.
 * Convention (same as the base layout POS): origin = ball start (廟口夜市 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Keelung
 * geography (廟口 central; 火車站 west; 中正公園 hill north; 和平島 northeast;
 * 正濱漁港 east for goal).
 */
const POS = Object.freeze({
  miaokou_gate:    Object.freeze({ x:  -20, z:   25 }),   // 廟口夜市牌樓 — near the shop district
  keelung_station: Object.freeze({ x: -150, z:  -60 }),   // 基隆火車站 — west of harbor
  guanyin_statue:  Object.freeze({ x:  180, z: -380 }),   // 中正公園觀音像 — northern hill
  ocean_plaza:     Object.freeze({ x:   60, z:  -20 }),   // 海洋廣場 — harbor front
  xiandonyan:      Object.freeze({ x: -320, z: -450 }),   // 仙洞巖 — western cliff
  heping_island:   Object.freeze({ x:  480, z: -520 }),   // 和平島公園 — northeast island
  keelung_islet:   Object.freeze({ x:  650, z: -680 }),   // 基隆嶼燈塔 — far northeast sea
  qingan_temple:   Object.freeze({ x: -100, z:  180 }),   // 慶安宮 — south of harbor
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Keelung landmarks)  */
/* ================================================================== */
/** EXTRA codes for the 8 Keelung curated landmark singletons. */
const CODE_MIAOKOU_GATE    = 82;
const CODE_KEELUNG_STATION = 83;
const CODE_GUANYIN_STATUE  = 84;
const CODE_OCEAN_PLAZA     = 85;
const CODE_XIANDONYAN      = 86;
const CODE_HEPING_ISLAND   = 87;
const CODE_KEELUNG_ISLET   = 88;
const CODE_QINGAN_TEMPLE   = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 正濱漁港彩色屋 goal (strictly    */
/* increasing dioramaR in array order, goal last with isGoal:true)    */
/* ================================================================== */

/**
 * Keelung landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  廟口夜市牌樓   dioramaR  12 → absorbable @  18.5 m
 *   L1  基隆火車站     dioramaR  35 → absorbable @  53.8 m
 *   L2  中正公園觀音像 dioramaR  23 → absorbable @  35.4 m
 *   L3  海洋廣場       dioramaR  45 → absorbable @  69.2 m
 *   L4  仙洞巖         dioramaR  18 → absorbable @  27.7 m
 *   L5  和平島公園     dioramaR  55 → absorbable @  84.6 m
 *   L6  基隆嶼燈塔     dioramaR  80 → absorbable @ 123.1 m
 *   L7  慶安宮         dioramaR  28 → absorbable @  43.1 m
 *   L8  正濱漁港彩色屋(goal) dioramaR 25 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  // L0 — 廟口夜市牌樓 (dioramaR 11)
  {
    landmarkId: NM_MIAOKOU_GATE.landmarkId,       // 0
    name: NM_MIAOKOU_GATE.name,
    nameJa: NM_MIAOKOU_GATE.name,
    x: POS.miaokou_gate.x, z: POS.miaokou_gate.z,
    dioramaR: NM_MIAOKOU_GATE.dioramaRHint,
    collisionScale: 1.0,
    sizeReal: 15,
    archetypeCode: CODE_MIAOKOU_GATE,
    naturalBand: 3,
    colorHex: NM_MIAOKOU_GATE.colorHex,
    isGoal: false,
  },
  // L1 — 中正公園觀音像 (dioramaR 23)
  {
    landmarkId: NM_GUANYIN_STATUE.landmarkId,     // 1
    name: NM_GUANYIN_STATUE.name,
    nameJa: NM_GUANYIN_STATUE.name,
    x: POS.guanyin_statue.x, z: POS.guanyin_statue.z,
    dioramaR: NM_GUANYIN_STATUE.dioramaRHint,
    collisionScale: 0.85,
    sizeReal: 25,
    archetypeCode: CODE_GUANYIN_STATUE,
    naturalBand: 3,
    colorHex: NM_GUANYIN_STATUE.colorHex,
    isGoal: false,
  },
  // L2 — 慶安宮 (dioramaR 28)
  {
    landmarkId: NM_QINGAN_TEMPLE.landmarkId,      // 2
    name: NM_QINGAN_TEMPLE.name,
    nameJa: NM_QINGAN_TEMPLE.name,
    x: POS.qingan_temple.x, z: POS.qingan_temple.z,
    dioramaR: NM_QINGAN_TEMPLE.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 35,
    archetypeCode: CODE_QINGAN_TEMPLE,
    naturalBand: 3,
    colorHex: NM_QINGAN_TEMPLE.colorHex,
    isGoal: false,
  },
  // L3 — 基隆火車站 (dioramaR 35)
  {
    landmarkId: NM_KEELUNG_STATION.landmarkId,    // 3
    name: NM_KEELUNG_STATION.name,
    nameJa: NM_KEELUNG_STATION.name,
    x: POS.keelung_station.x, z: POS.keelung_station.z,
    dioramaR: NM_KEELUNG_STATION.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 60,
    archetypeCode: CODE_KEELUNG_STATION,
    naturalBand: 4,
    colorHex: NM_KEELUNG_STATION.colorHex,
    isGoal: false,
  },
  // L4 — 仙洞巖 (dioramaR 40)
  {
    landmarkId: NM_XIANDONYAN.landmarkId,         // 4
    name: NM_XIANDONYAN.name,
    nameJa: NM_XIANDONYAN.name,
    x: POS.xiandonyan.x, z: POS.xiandonyan.z,
    dioramaR: NM_XIANDONYAN.dioramaRHint,
    collisionScale: 0.7,
    sizeReal: 30,
    archetypeCode: CODE_XIANDONYAN,
    naturalBand: 4,
    colorHex: NM_XIANDONYAN.colorHex,
    isGoal: false,
  },
  // L5 — 海洋廣場 (dioramaR 45)
  {
    landmarkId: NM_OCEAN_PLAZA.landmarkId,        // 5
    name: NM_OCEAN_PLAZA.name,
    nameJa: NM_OCEAN_PLAZA.name,
    x: POS.ocean_plaza.x, z: POS.ocean_plaza.z,
    dioramaR: NM_OCEAN_PLAZA.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_OCEAN_PLAZA,
    naturalBand: 4,
    colorHex: NM_OCEAN_PLAZA.colorHex,
    isGoal: false,
  },
  // L6 — 和平島公園 (dioramaR 55)
  {
    landmarkId: NM_HEPING_ISLAND.landmarkId,      // 6
    name: NM_HEPING_ISLAND.name,
    nameJa: NM_HEPING_ISLAND.name,
    x: POS.heping_island.x, z: POS.heping_island.z,
    dioramaR: NM_HEPING_ISLAND.dioramaRHint,
    collisionScale: 0.8,
    sizeReal: 80,
    archetypeCode: CODE_HEPING_ISLAND,
    naturalBand: 5,
    colorHex: NM_HEPING_ISLAND.colorHex,
    isGoal: false,
  },
  // L7 — 基隆嶼燈塔 (dioramaR 80)
  {
    landmarkId: NM_KEELUNG_ISLET.landmarkId,      // 7
    name: NM_KEELUNG_ISLET.name,
    nameJa: NM_KEELUNG_ISLET.name,
    x: POS.keelung_islet.x, z: POS.keelung_islet.z,
    dioramaR: NM_KEELUNG_ISLET.dioramaRHint,
    collisionScale: 0.7,
    sizeReal: 100,
    archetypeCode: CODE_KEELUNG_ISLET,
    naturalBand: 5,
    colorHex: NM_KEELUNG_ISLET.colorHex,
    isGoal: false,
  },
  // L8 — 正濱漁港彩色屋 (dioramaR 200) — GOAL
  {
    landmarkId: NM_ZHENGBIN_COLORHOUSES.landmarkId, // 8
    name: NM_ZHENGBIN_COLORHOUSES.name,
    nameJa: NM_ZHENGBIN_COLORHOUSES.name,
    x: ZHENGBIN_POS.x, z: ZHENGBIN_POS.z,
    dioramaR: NM_ZHENGBIN_COLORHOUSES.dioramaRHint,
    collisionScale: 0.5,
    sizeReal: 100,
    archetypeCode: 93,
    naturalBand: 6,
    colorHex: NM_ZHENGBIN_COLORHOUSES.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Keelung landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Keelung: starts with the full cityData base set,
 * then appends the 8 Keelung landmark singleton placements. The 正濱漁港彩色屋 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _KEELUNG_LANDMARK_PLACEMENTS = LANDMARKS
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
// 82..98 were dropped at bake time. Append the 8 Keelung landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._KEELUNG_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 基隆港 harbor definition for the Keelung pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 廟口夜市 shop, +X east, +Z south).
 *
 * A multi-point centerline + width traces the harbor's U-shaped basin
 * (consumed by environment.js via ribbonQuads).
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0). The harbor is north/northeast of the city center.
 *
 * color: deeper harbor blue-grey (reflecting Keelung's working port character),
 * slightly murkier than open sea.
 * yM: 0.3 m above ground (same as other water — hides the seam).
 */
export const water = Object.freeze({
  name: '基隆港',
  color: 0x2a4a5e,
  yM: 0.3,
  width: 200,
  centerline: Object.freeze([
    Object.freeze({ x: -400, z: -180 }),
    Object.freeze({ x: -100, z: -120 }),
    Object.freeze({ x:  200, z: -100 }),
    Object.freeze({ x:  500, z: -150 }),
    Object.freeze({ x:  700, z: -280 }),
    Object.freeze({ x:  850, z: -450 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (正濱漁港彩色屋 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = ZHENGBIN_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Keelung ladder keys: shop / miaokou / harbor / hill / heping / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 廟口夜市 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 廟口夜市 night-market strip (central). */
  miaokou:     Object.freeze({ x: -30,  z: 40,    r: 0.5  }),
  /** 基隆港 harbor front area. */
  harbor:      Object.freeze({ x: 100,  z: -80,   r: 3    }),
  /** 中正公園 hill area (觀音像 territory). */
  hill:        Object.freeze({ x: 200,  z: -400,  r: 30   }),
  /** 和平島 park area (larger ball). */
  heping:      Object.freeze({ x: 450,  z: -500,  r: 120  }),
  /** Near the 正濱漁港彩色屋 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 200  }),
});
