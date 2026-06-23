/**
 * @file cityMap.js — New Taipei pack cityMap.
 *
 * Native New Taipei LANDMARKS (8 curated singletons + 情人橋 goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native New Taipei 9 entries (8 curated + 情人橋 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 New Taipei landmark placements
 *   - GOAL_POS    → LOVER_BRIDGE_POS
 *   - DEV_STARTS  → New Taipei-themed teleport keys
 *   - water       → 淡水河 (NOT 基隆河!)
 */

import { LOVER_BRIDGE_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_JIUFEN_TEAHOUSE } from './landmarks/jiufen_teahouse.js';
import { NM_SHIFEN_LANTERN } from './landmarks/shifen_lantern.js';
import { NM_YINGGE_MUSEUM } from './landmarks/yingge_museum.js';
import { NM_SANXIA_TEMPLE } from './landmarks/sanxia_temple.js';
import { NM_FORT_SAN_DOMINGO } from './landmarks/fort_san_domingo.js';
import { NM_PINGXI_STATION } from './landmarks/pingxi_station.js';
import { NM_LIN_FAMILY_GARDEN } from './landmarks/lin_family_garden.js';
import { NM_NEWTAIPEI_CITYHALL } from './landmarks/newtaipei_cityhall.js';
import { NM_LOVER_BRIDGE } from './landmarks/lover_bridge.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// New Taipei landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* New Taipei landmark positions (game-meter, origin = ball start)    */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated New Taipei landmarks.
 * Convention (same as the base layout POS): origin = ball start (九份老街 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual New Taipei
 * geography (九份/平溪 east mountains; 淡水 north river; 鶯歌/三峽 south;
 * 板橋 central; 漁人碼頭 northwest for 情人橋 goal).
 */
const POS = Object.freeze({
  jiufen_teahouse:  Object.freeze({ x:  -20, z:   25 }),   // 九份老街茶樓 — starting area (east mountains)
  shifen_lantern:   Object.freeze({ x: -150, z:  -80 }),   // 十分天燈 — 平溪線 north-east
  yingge_museum:    Object.freeze({ x:  180, z:  380 }),   // 鶯歌陶瓷博物館 — 鶯歌 south
  sanxia_temple:    Object.freeze({ x: -280, z:  520 }),   // 三峽祖師廟 — 三峽 south-west
  fort_san_domingo: Object.freeze({ x:  320, z: -450 }),   // 淡水紅毛城 — 淡水 north
  pingxi_station:   Object.freeze({ x: -100, z: -180 }),   // 平溪車站 — 平溪線 north-east
  lin_family_garden: Object.freeze({ x:  60, z:  280 }),   // 林本源園邸 — 板橋 central
  newtaipei_cityhall: Object.freeze({ x: 420, z: -120 }), // 新北市政府 — 板橋 新站特區
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = New Taipei landmarks)*/
/* ================================================================== */
/** EXTRA codes for the 8 New Taipei curated landmark singletons. */
const CODE_JIUFEN_TEAHOUSE   = 82;
const CODE_SHIFEN_LANTERN    = 83;
const CODE_YINGGE_MUSEUM     = 84;
const CODE_SANXIA_TEMPLE     = 85;
const CODE_FORT_SAN_DOMINGO  = 86;
const CODE_PINGXI_STATION    = 87;
const CODE_LIN_FAMILY_GARDEN = 88;
const CODE_NEWTAIPEI_CITYHALL = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 情人橋 goal (strictly increasing */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * New Taipei landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  九份老街茶樓     dioramaR  15 → absorbable @  23.1 m
 *   L1  十分天燈         dioramaR  22 → absorbable @  33.8 m
 *   L2  鶯歌陶瓷博物館   dioramaR  38 → absorbable @  58.5 m
 *   L3  三峽祖師廟       dioramaR  55 → absorbable @  84.6 m
 *   L4  淡水紅毛城       dioramaR  75 → absorbable @ 115.4 m
 *   L5  平溪車站         dioramaR 100 → absorbable @ 153.8 m
 *   L6  林本源園邸       dioramaR 135 → absorbable @ 207.7 m
 *   L7  新北市政府       dioramaR 185 → absorbable @ 284.6 m
 *   L8  淡水情人橋(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_JIUFEN_TEAHOUSE.landmarkId, // 0
    name: NM_JIUFEN_TEAHOUSE.name,
    nameJa: NM_JIUFEN_TEAHOUSE.name,           // nameJa alias for curated.js compat
    x: POS.jiufen_teahouse.x, z: POS.jiufen_teahouse.z,
    dioramaR: 15,
    collisionScale: 1.0,
    sizeReal: 18,
    archetypeCode: CODE_JIUFEN_TEAHOUSE,
    naturalBand: 3,
    colorHex: NM_JIUFEN_TEAHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SHIFEN_LANTERN.landmarkId,  // 1
    name: NM_SHIFEN_LANTERN.name,
    nameJa: NM_SHIFEN_LANTERN.name,
    x: POS.shifen_lantern.x, z: POS.shifen_lantern.z,
    dioramaR: 22,
    collisionScale: 0.9,
    sizeReal: 25,
    archetypeCode: CODE_SHIFEN_LANTERN,
    naturalBand: 3,
    colorHex: NM_SHIFEN_LANTERN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_YINGGE_MUSEUM.landmarkId,   // 2
    name: NM_YINGGE_MUSEUM.name,
    nameJa: NM_YINGGE_MUSEUM.name,
    x: POS.yingge_museum.x, z: POS.yingge_museum.z,
    dioramaR: 38,
    collisionScale: 0.9,
    sizeReal: 55,
    archetypeCode: CODE_YINGGE_MUSEUM,
    naturalBand: 3,
    colorHex: NM_YINGGE_MUSEUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SANXIA_TEMPLE.landmarkId,   // 3
    name: NM_SANXIA_TEMPLE.name,
    nameJa: NM_SANXIA_TEMPLE.name,
    x: POS.sanxia_temple.x, z: POS.sanxia_temple.z,
    dioramaR: 55,
    collisionScale: 0.9,
    sizeReal: 80,
    archetypeCode: CODE_SANXIA_TEMPLE,
    naturalBand: 4,
    colorHex: NM_SANXIA_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_FORT_SAN_DOMINGO.landmarkId, // 4
    name: NM_FORT_SAN_DOMINGO.name,
    nameJa: NM_FORT_SAN_DOMINGO.name,
    x: POS.fort_san_domingo.x, z: POS.fort_san_domingo.z,
    dioramaR: 75,
    collisionScale: 0.85,
    sizeReal: 100,
    archetypeCode: CODE_FORT_SAN_DOMINGO,
    naturalBand: 4,
    colorHex: NM_FORT_SAN_DOMINGO.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_PINGXI_STATION.landmarkId,  // 5
    name: NM_PINGXI_STATION.name,
    nameJa: NM_PINGXI_STATION.name,
    x: POS.pingxi_station.x, z: POS.pingxi_station.z,
    dioramaR: 100,
    collisionScale: 0.8,
    sizeReal: 120,
    archetypeCode: CODE_PINGXI_STATION,
    naturalBand: 5,
    colorHex: NM_PINGXI_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LIN_FAMILY_GARDEN.landmarkId, // 6
    name: NM_LIN_FAMILY_GARDEN.name,
    nameJa: NM_LIN_FAMILY_GARDEN.name,
    x: POS.lin_family_garden.x, z: POS.lin_family_garden.z,
    dioramaR: 135,
    collisionScale: 0.75,
    sizeReal: 200,
    archetypeCode: CODE_LIN_FAMILY_GARDEN,
    naturalBand: 5,
    colorHex: NM_LIN_FAMILY_GARDEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_NEWTAIPEI_CITYHALL.landmarkId, // 7
    name: NM_NEWTAIPEI_CITYHALL.name,
    nameJa: NM_NEWTAIPEI_CITYHALL.name,
    x: POS.newtaipei_cityhall.x, z: POS.newtaipei_cityhall.z,
    dioramaR: 185,
    collisionScale: 0.7,
    sizeReal: 250,
    archetypeCode: CODE_NEWTAIPEI_CITYHALL,
    naturalBand: 5,
    colorHex: NM_NEWTAIPEI_CITYHALL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8,                              // 8 — GOAL
    name: NM_LOVER_BRIDGE.name,
    nameJa: NM_LOVER_BRIDGE.name,
    x: LOVER_BRIDGE_POS.x, z: LOVER_BRIDGE_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 165,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xf0f2ff, // pale white-lilac of the bridge
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 New Taipei landmark singletons */
/* ================================================================== */

/**
 * Curated placements for New Taipei: starts with the full cityData base set,
 * then appends the 8 New Taipei landmark singleton placements. The 情人橋 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _NEWTAIPEI_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 New Taipei landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._NEWTAIPEI_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 淡水河 river definition for the New Taipei pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 九份老街 shop, +X east, +Z south).
 *
 * A 5-point centerline + width (180 m) traces the river's real north→northwest
 * arc as a smooth ribbon flowing toward the river mouth at 淡水漁人碼頭 (consumed
 * by environment.js via ribbonQuads).
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and flows toward the 情人橋 goal (749,-252).
 *
 * color: slightly greenish-muddy teal (characteristic of 淡水河's estuarine
 * mix of fresh and salt water).
 * yM: 0.3 m above ground (same as other water — hides the seam).
 */
export const water = Object.freeze({
  name: '淡水河',
  color: 0x3a6a5a, // greenish-brown estuarine water
  yM: 0.3,
  width: 180, // wider river than 基隆河
  centerline: Object.freeze([
    Object.freeze({ x: -600, z: 800 }),   // upstream (south-east, toward 三峽)
    Object.freeze({ x: -200, z: 400 }),   // mid-river bend
    Object.freeze({ x:  200, z: -100 }),  // flowing north
    Object.freeze({ x:  500, z: -350 }),  // approaching 淡水
    Object.freeze({ x:  850, z: -400 }),  // river mouth near 漁人碼頭
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (淡水漁人碼頭情人橋 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = LOVER_BRIDGE_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * New Taipei ladder keys: shop / oldstreet / lantern / ceramic /
 * riverside / cityhall / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 九份老街 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 九份老街 old street district (starting area). */
  oldstreet:   Object.freeze({ x: -30,  z: 40,    r: 0.5  }),
  /** 十分/平溪 lantern sky area (early-mid). */
  lantern:     Object.freeze({ x: -120, z: -100,  r: 3    }),
  /** 鶯歌陶瓷 ceramic district (mid-map). */
  ceramic:     Object.freeze({ x: 160,  z: 350,   r: 30   }),
  /** 淡水河岸 riverside area (mid-radius). */
  riverside:   Object.freeze({ x: 280,  z: -380,  r: 100  }),
  /** 新北市政府 / 板橋特區 (approach zone). */
  cityhall:    Object.freeze({ x: 400,  z: -80,   r: 200  }),
  /** Near the 淡水漁人碼頭情人橋 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -350,  r: 400  }),
});
