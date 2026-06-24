/**
 * @file cityMap.js — Matsu pack cityMap.
 *
 * Defines the Matsu-specific map layout with 8 curated landmarks
 * (藍眼淚沙灘/鐵堡/八角據點/北海坑道/境天后宮/芹壁聚落/東引燈塔/媽祖巨神像).
 *
 * Override list:
 *   - LANDMARKS   → 8 Matsu landmarks (7 curated + 1 goal)
 *   - PLACEMENTS  → cityData base placements + the 7 Matsu landmark placements
 *   - GOAL_POS    → MAZU_GODDESS_POS
 *   - DEV_STARTS  → Matsu-themed teleport keys
 *   - water       → 馬祖海域 coastal waters
 */

import { MAZU_GODDESS_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated Matsu landmark geometry descriptors.
import { NM_BLUE_TEARS_BEACH } from './landmarks/blue_tears_beach.js';
import { NM_IRON_FORT } from './landmarks/iron_fort.js';
import { NM_BAJIU_AOYA } from './landmarks/bajiu_aoya.js';
import { NM_BEIHAI_TUNNEL } from './landmarks/beihai_tunnel.js';
import { NM_TIANHOU_TEMPLE } from './landmarks/tianhou_temple.js';
import { NM_QINBI_VILLAGE } from './landmarks/qinbi_village.js';
import { NM_DONGYIN_LIGHTHOUSE } from './landmarks/dongyin_lighthouse.js';
import { NM_MATSU_GODDESS } from './landmarks/matsu_goddess.js';

// Re-export the pack-owned baked layout (cityData.js).
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// Base placements from cityData.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Matsu landmark positions (game-meter, origin = ball start)          */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Matsu landmarks.
 * Origin = ball start (南竿介壽澳口), +X east, +Z south.
 * Landmarks spread progressively — smaller closer, larger farther.
 */
const POS = Object.freeze({
  blue_tears_beach:   Object.freeze({ x:  -50, z:   80 }),   // 藍眼淚沙灘 — near start
  iron_fort:          Object.freeze({ x: -180, z:  250 }),   // 鐵堡 — coastal west
  bajiu_aoya:         Object.freeze({ x:  120, z:  180 }),   // 八角據點 — eastern hills
  beihai_tunnel:      Object.freeze({ x: -320, z:  420 }),   // 北海坑道 — northern coast
  tianhou_temple:     Object.freeze({ x:  -80, z: -120 }),   // 境天后宮 — central village
  qinbi_village:      Object.freeze({ x:  280, z: -380 }),   // 芹壁聚落 — northern Beigan
  dongyin_lighthouse: Object.freeze({ x:  450, z: -550 }),   // 東引燈塔 — far northeast
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Matsu landmarks)     */
/* ================================================================== */
const CODE_BLUE_TEARS_BEACH   = 82;
const CODE_IRON_FORT          = 83;
const CODE_BAJIU_AOYA         = 84;
const CODE_BEIHAI_TUNNEL      = 85;
const CODE_TIANHOU_TEMPLE     = 86;
const CODE_QINBI_VILLAGE      = 87;
const CODE_DONGYIN_LIGHTHOUSE = 88;
const CODE_MATSU_GODDESS      = 89;

/* ================================================================== */
/* LANDMARKS — 8 entries: 7 curated + 1 goal (strictly increasing      */
/* dioramaR in array order, goal last with isGoal:true)                */
/* ================================================================== */

/**
 * Matsu landmark defs, in strictly-increasing dioramaR order.
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder:
 *   L0  藍眼淚沙灘     dioramaR   6 → absorbable @   9.2 m
 *   L1  鐵堡           dioramaR   8 → absorbable @  12.3 m
 *   L2  八角據點遺址   dioramaR  10 → absorbable @  15.4 m
 *   L3  北海坑道       dioramaR  15 → absorbable @  23.1 m
 *   L4  境天后宮       dioramaR  18 → absorbable @  27.7 m
 *   L5  芹壁聚落       dioramaR  25 → absorbable @  38.5 m
 *   L6  東引燈塔       dioramaR  30 → absorbable @  46.2 m
 *   L7  媽祖巨神像(goal) dioramaR 420 → goal
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_BLUE_TEARS_BEACH.landmarkId,  // 0
    name: NM_BLUE_TEARS_BEACH.name,
    nameJa: NM_BLUE_TEARS_BEACH.name,
    x: POS.blue_tears_beach.x, z: POS.blue_tears_beach.z,
    dioramaR: 6,
    collisionScale: 1.0,
    sizeReal: 8,
    archetypeCode: CODE_BLUE_TEARS_BEACH,
    naturalBand: 3,
    colorHex: NM_BLUE_TEARS_BEACH.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_IRON_FORT.landmarkId,  // 1
    name: NM_IRON_FORT.name,
    nameJa: NM_IRON_FORT.name,
    x: POS.iron_fort.x, z: POS.iron_fort.z,
    dioramaR: 8,
    collisionScale: 0.9,
    sizeReal: 12,
    archetypeCode: CODE_IRON_FORT,
    naturalBand: 3,
    colorHex: NM_IRON_FORT.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_BAJIU_AOYA.landmarkId,  // 2
    name: NM_BAJIU_AOYA.name,
    nameJa: NM_BAJIU_AOYA.name,
    x: POS.bajiu_aoya.x, z: POS.bajiu_aoya.z,
    dioramaR: 10,
    collisionScale: 0.9,
    sizeReal: 15,
    archetypeCode: CODE_BAJIU_AOYA,
    naturalBand: 3,
    colorHex: NM_BAJIU_AOYA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_BEIHAI_TUNNEL.landmarkId,  // 3
    name: NM_BEIHAI_TUNNEL.name,
    nameJa: NM_BEIHAI_TUNNEL.name,
    x: POS.beihai_tunnel.x, z: POS.beihai_tunnel.z,
    dioramaR: 15,
    collisionScale: 0.9,
    sizeReal: 25,
    archetypeCode: CODE_BEIHAI_TUNNEL,
    naturalBand: 4,
    colorHex: NM_BEIHAI_TUNNEL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TIANHOU_TEMPLE.landmarkId,  // 4
    name: NM_TIANHOU_TEMPLE.name,
    nameJa: NM_TIANHOU_TEMPLE.name,
    x: POS.tianhou_temple.x, z: POS.tianhou_temple.z,
    dioramaR: 18,
    collisionScale: 0.9,
    sizeReal: 30,
    archetypeCode: CODE_TIANHOU_TEMPLE,
    naturalBand: 4,
    colorHex: NM_TIANHOU_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_QINBI_VILLAGE.landmarkId,  // 5
    name: NM_QINBI_VILLAGE.name,
    nameJa: NM_QINBI_VILLAGE.name,
    x: POS.qinbi_village.x, z: POS.qinbi_village.z,
    dioramaR: 25,
    collisionScale: 0.8,
    sizeReal: 50,
    archetypeCode: CODE_QINBI_VILLAGE,
    naturalBand: 5,
    colorHex: NM_QINBI_VILLAGE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DONGYIN_LIGHTHOUSE.landmarkId,  // 6
    name: NM_DONGYIN_LIGHTHOUSE.name,
    nameJa: NM_DONGYIN_LIGHTHOUSE.name,
    x: POS.dongyin_lighthouse.x, z: POS.dongyin_lighthouse.z,
    dioramaR: 30,
    collisionScale: 0.85,
    sizeReal: 60,
    archetypeCode: CODE_DONGYIN_LIGHTHOUSE,
    naturalBand: 5,
    colorHex: NM_DONGYIN_LIGHTHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_MATSU_GODDESS.landmarkId,  // 7 — GOAL
    name: NM_MATSU_GODDESS.name,
    nameJa: NM_MATSU_GODDESS.name,
    x: MAZU_GODDESS_POS.x, z: MAZU_GODDESS_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 296,
    archetypeCode: CODE_MATSU_GODDESS,
    naturalBand: 6,
    colorHex: NM_MATSU_GODDESS.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 7 Matsu landmark singletons */
/* ================================================================== */

const _MATSU_LANDMARK_PLACEMENTS = LANDMARKS
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

export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._MATSU_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body — 馬祖海域 (surrounding ocean)                           */
/* ================================================================== */

/**
 * Matsu is an island archipelago, so we define a coastal water ring
 * around the play area (not an internal river).
 *
 * color: deep blue-green ocean
 * yM: 0.3 m above ground
 */
export const water = Object.freeze({
  name: '馬祖海域',
  color: 0x2a4a6e,
  yM: 0.3,
  width: 200,
  centerline: Object.freeze([
    Object.freeze({ x: -800, z: -800 }),
    Object.freeze({ x:  800, z: -800 }),
    Object.freeze({ x: 1200, z:    0 }),
    Object.freeze({ x:  800, z:  800 }),
    Object.freeze({ x: -800, z:  800 }),
    Object.freeze({ x: -1200, z:   0 }),
    Object.freeze({ x: -800, z: -800 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                           */
/* ================================================================== */

/**
 * Goal monument real-meter position (媽祖巨神像 world anchor).
 */
export const GOAL_POS = MAZU_GODDESS_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 */
export const DEV_STARTS = Object.freeze({
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  harbor:      Object.freeze({ x: 60,   z: 80,    r: 0.5  }),
  village:     Object.freeze({ x: -100, z: 150,   r: 3    }),
  tunnel:      Object.freeze({ x: -280, z: 400,   r: 30   }),
  qinbi:       Object.freeze({ x: 250,  z: -350,  r: 120  }),
  lighthouse:  Object.freeze({ x: 420,  z: -520,  r: 300  }),
  goal:        Object.freeze({ x: 700,  z: -400,  r: 400  }),
});
