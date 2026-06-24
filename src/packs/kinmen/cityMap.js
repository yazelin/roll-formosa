/**
 * @file cityMap.js — Kinmen pack cityMap.
 *
 * Introduces native Kinmen LANDMARKS (7 curated singletons + juguang_tower goal).
 * The 7 curated landmarks are wired into PLACEMENTS so they spawn in the world
 * and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Kinmen 8 entries (7 curated + juguang_tower goal)
 *   - PLACEMENTS  → cityData base placements + the 7 Kinmen landmark placements
 *   - GOAL_POS    → JUGUANG_TOWER_POS
 *   - DEV_STARTS  → Kinmen-themed teleport keys
 *   - water       → 金門海域 (ocean surrounding the island)
 */

import { JUGUANG_TOWER_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 7 curated landmark geometry descriptors for position/color/name.
import { NM_ZHAISHAN_TUNNEL } from './landmarks/zhaishan_tunnel.js';
import { NM_DEYUE_TOWER } from './landmarks/deyue_tower.js';
import { NM_WIND_LION_GOD } from './landmarks/wind_lion_god.js';
import { NM_SHANHOU_FOLK_VILLAGE } from './landmarks/shanhou_folk_village.js';
import { NM_MASHAN_OBSERVATION } from './landmarks/mashan_observation.js';
import { NM_WENTAI_PAGODA } from './landmarks/wentai_pagoda.js';
import { NM_KINMEN_NATIONAL_PARK } from './landmarks/kinmen_national_park.js';
import { NM_JUGUANG_TOWER } from './monument.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + collectible 94) — already filtered at bake time. We append the 7
// native Kinmen landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Kinmen landmark positions (game-meter, origin = ball start)         */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 7 curated Kinmen landmarks.
 * Convention (same as the base layout POS): origin = ball start (柑仔店 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Kinmen
 * geography (金城鎮 west-central; 金沙鎮 northeast; 金寧鄉 north; 金湖鎮 south).
 */
const POS = Object.freeze({
  zhaishan_tunnel:     Object.freeze({ x: -120, z:  180 }),   // 翟山坑道 — 金城鎮西南海岸
  deyue_tower:         Object.freeze({ x: -200, z:  280 }),   // 得月樓 — 水頭聚落
  wind_lion_god:       Object.freeze({ x:  150, z:  -80 }),   // 風獅爺 — 金沙鎮村落
  shanhou_folk_village: Object.freeze({ x:  280, z: -180 }),   // 山后民俗文化村 — 金沙鎮東北
  mashan_observation:  Object.freeze({ x:  350, z: -420 }),   // 馬山觀測所 — 金沙鎮最北端
  wentai_pagoda:       Object.freeze({ x: -320, z:  450 }),   // 文台寶塔 — 金城鎮南端
  kinmen_national_park: Object.freeze({ x:  450, z:  320 }),   // 金門國家公園 — 金湖鎮中央
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Kinmen landmarks)    */
/* ================================================================== */
/** EXTRA codes for the 7 Kinmen curated landmark singletons. */
const CODE_ZHAISHAN_TUNNEL     = 82;
const CODE_DEYUE_TOWER         = 83;
const CODE_WIND_LION_GOD       = 84;
const CODE_SHANHOU_FOLK_VILLAGE = 85;
const CODE_MASHAN_OBSERVATION  = 86;
const CODE_WENTAI_PAGODA       = 87;
const CODE_KINMEN_NATIONAL_PARK = 88;

/* ================================================================== */
/* LANDMARKS — 8 entries: 7 curated + juguang_tower goal (strictly    */
/* increasing dioramaR in array order, goal last with isGoal:true)    */
/* ================================================================== */

/**
 * Kinmen landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 -> absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  翟山坑道           dioramaR  11 -> absorbable @  16.9 m
 *   L1  得月樓             dioramaR  28 -> absorbable @  43.1 m
 *   L2  風獅爺             dioramaR  40 -> absorbable @  61.5 m
 *   L3  山后民俗文化村     dioramaR  60 -> absorbable @  92.3 m
 *   L4  馬山觀測所         dioramaR  85 -> absorbable @ 130.8 m
 *   L5  文台寶塔           dioramaR 115 -> absorbable @ 176.9 m
 *   L6  金門國家公園       dioramaR 150 -> absorbable @ 230.8 m
 *   L7  莒光樓(goal)       dioramaR 420 -> goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_ZHAISHAN_TUNNEL.landmarkId,       // 0
    name: NM_ZHAISHAN_TUNNEL.name,
    nameJa: NM_ZHAISHAN_TUNNEL.name,                 // nameJa alias for curated.js compat
    x: POS.zhaishan_tunnel.x,  z: POS.zhaishan_tunnel.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 15,
    archetypeCode: CODE_ZHAISHAN_TUNNEL,
    naturalBand: 3,
    colorHex: NM_ZHAISHAN_TUNNEL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DEYUE_TOWER.landmarkId,           // 1
    name: NM_DEYUE_TOWER.name,
    nameJa: NM_DEYUE_TOWER.name,
    x: POS.deyue_tower.x, z: POS.deyue_tower.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 18,
    archetypeCode: CODE_DEYUE_TOWER,
    naturalBand: 3,
    colorHex: NM_DEYUE_TOWER.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_WIND_LION_GOD.landmarkId,         // 2
    name: NM_WIND_LION_GOD.name,
    nameJa: NM_WIND_LION_GOD.name,
    x: POS.wind_lion_god.x, z: POS.wind_lion_god.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 3,
    archetypeCode: CODE_WIND_LION_GOD,
    naturalBand: 3,
    colorHex: NM_WIND_LION_GOD.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SHANHOU_FOLK_VILLAGE.landmarkId,  // 3
    name: NM_SHANHOU_FOLK_VILLAGE.name,
    nameJa: NM_SHANHOU_FOLK_VILLAGE.name,
    x: POS.shanhou_folk_village.x, z: POS.shanhou_folk_village.z,
    dioramaR: 60,
    collisionScale: 0.85,
    sizeReal: 120,
    archetypeCode: CODE_SHANHOU_FOLK_VILLAGE,
    naturalBand: 4,
    colorHex: NM_SHANHOU_FOLK_VILLAGE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_MASHAN_OBSERVATION.landmarkId,    // 4
    name: NM_MASHAN_OBSERVATION.name,
    nameJa: NM_MASHAN_OBSERVATION.name,
    x: POS.mashan_observation.x, z: POS.mashan_observation.z,
    dioramaR: 85,
    collisionScale: 0.8,
    sizeReal: 50,
    archetypeCode: CODE_MASHAN_OBSERVATION,
    naturalBand: 4,
    colorHex: NM_MASHAN_OBSERVATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_WENTAI_PAGODA.landmarkId,         // 5
    name: NM_WENTAI_PAGODA.name,
    nameJa: NM_WENTAI_PAGODA.name,
    x: POS.wentai_pagoda.x, z: POS.wentai_pagoda.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 10,
    archetypeCode: CODE_WENTAI_PAGODA,
    naturalBand: 5,
    colorHex: NM_WENTAI_PAGODA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_KINMEN_NATIONAL_PARK.landmarkId,  // 6
    name: NM_KINMEN_NATIONAL_PARK.name,
    nameJa: NM_KINMEN_NATIONAL_PARK.name,
    x: POS.kinmen_national_park.x, z: POS.kinmen_national_park.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 350,
    archetypeCode: CODE_KINMEN_NATIONAL_PARK,
    naturalBand: 5,
    colorHex: NM_KINMEN_NATIONAL_PARK.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_JUGUANG_TOWER.landmarkId,         // 8 — GOAL
    name: NM_JUGUANG_TOWER.name,
    nameJa: NM_JUGUANG_TOWER.name,
    x: JUGUANG_TOWER_POS.x, z: JUGUANG_TOWER_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 17,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: NM_JUGUANG_TOWER.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 7 Kinmen landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Kinmen: starts with the full cityData base set,
 * then appends the 7 Kinmen landmark singleton placements. The juguang_tower
 * goal is rendered by goalTower.js (code 93 = display-name-only slot, never
 * spawned from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (+/-1800 x, -1800..2000 z).
 */
const _KINMEN_LANDMARK_PLACEMENTS = LANDMARKS
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
// collectibles 70..81 + collectible 94); the former legacy landmark/building
// codes 82..98 were dropped at bake time. Append the 7 Kinmen landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._KINMEN_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 金門海域 ocean definition for the Kinmen pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 柑仔店 shop, +X east, +Z south).
 *
 * Kinmen is an island surrounded by ocean, so the water wraps around the
 * northern and southern edges of the map. The centerline traces the Taiwan
 * Strait to the north of the island.
 *
 * color: deep ocean blue (0x2a5a6e) — cleaner than river water, evoking the
 * open strait between Kinmen and mainland China.
 * yM: 0.3 m above ground (hides terrain seams).
 */
export const water = Object.freeze({
  name: '金門海域',
  color: 0x2a5a6e,
  yM: 0.3,
  width: 300,
  centerline: Object.freeze([
    Object.freeze({ x: -1600, z: -800 }),
    Object.freeze({ x:  -800, z: -750 }),
    Object.freeze({ x:     0, z: -700 }),
    Object.freeze({ x:   800, z: -720 }),
    Object.freeze({ x:  1600, z: -780 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (莒光樓 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = JUGUANG_TOWER_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Kinmen ladder keys: shop / kaoliang / tunnel / village / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 柑仔店 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 高粱田 kaoliang sorghum fields (early game area). */
  kaoliang:    Object.freeze({ x: 80,   z: -60,   r: 0.5  }),
  /** 翟山坑道 Zhaishan Tunnel entrance. */
  tunnel:      Object.freeze({ x: -120, z: 180,   r: 15   }),
  /** 山后民俗文化村 Shanhou Folk Village. */
  village:     Object.freeze({ x: 280,  z: -180,  r: 80   }),
  /** 馬山觀測所 Mashan Observation Post (mid-to-late game). */
  mashan:      Object.freeze({ x: 350,  z: -420,  r: 120  }),
  /** Near the 莒光樓 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
