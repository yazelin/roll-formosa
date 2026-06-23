/**
 * @file cityMap.js — Pingtung pack cityMap (P6b).
 *
 * P6b: introduces native Pingtung LANDMARKS (8 curated singletons + goal).
 * The 8 curated landmarks are wired into PLACEMENTS so they spawn in the
 * world and can be absorbed as the ball grows.
 */

import { ELUANBI_POS as MONUMENT_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated Pingtung landmark geometry descriptors.
import { NM_HENGCHUN_SOUTH_GATE } from './landmarks/hengchun_south_gate.js';
import { NM_FUAN_TEMPLE } from './landmarks/fuan_temple.js';
import { NM_WANJIN_BASILICA } from './landmarks/wanjin_basilica.js';
import { NM_CAESAR_HOTEL } from './landmarks/caesar_hotel.js';
import { NM_AQUARIUM } from './landmarks/aquarium.js';
import { NM_ELUANBI } from './landmarks/eluanbi_lighthouse.js';
import { NM_MAOBITOU } from './landmarks/maobitou.js';
import { NM_SAIL_ROCK } from './landmarks/sail_rock.js';

// Re-export the pack-owned baked layout (cityData.js).
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// Base placements from cityData.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Pingtung landmark positions (game-meter, origin = ball start)      */
/* ================================================================== */
const POS = Object.freeze({
  hengchun_south_gate: Object.freeze({ x:  -15, z:   30 }),
  fuan_temple:         Object.freeze({ x: -280, z:  560 }),
  wanjin_basilica:     Object.freeze({ x: -180, z:  200 }),
  caesar_hotel:        Object.freeze({ x:  120, z: -520 }),
  aquarium:            Object.freeze({ x:  -80, z:  -40 }),
  eluanbi:             Object.freeze({ x:   80, z:  350 }),
  maobitou:            Object.freeze({ x:   60, z:  420 }),
  sail_rock:           Object.freeze({ x:  340, z: -280 }),
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Pingtung landmarks) */
/* ================================================================== */
const CODE_HENGCHUN_SOUTH_GATE = 82;
const CODE_FUAN_TEMPLE         = 83;
const CODE_WANJIN_BASILICA     = 84;
const CODE_CAESAR_HOTEL        = 85;
const CODE_AQUARIUM            = 86;
const CODE_ELUANBI             = 87;
const CODE_MAOBITOU            = 88;
const CODE_SAIL_ROCK           = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + goal (strictly increasing       */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Pingtung landmark defs, in strictly-increasing dioramaR order.
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: 0,
    name: NM_HENGCHUN_SOUTH_GATE.name,
    nameJa: NM_HENGCHUN_SOUTH_GATE.name,
    x: POS.hengchun_south_gate.x, z: POS.hengchun_south_gate.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 13,
    archetypeCode: CODE_HENGCHUN_SOUTH_GATE,
    naturalBand: 3,
    colorHex: NM_HENGCHUN_SOUTH_GATE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 1,
    name: NM_FUAN_TEMPLE.name,
    nameJa: NM_FUAN_TEMPLE.name,
    x: POS.fuan_temple.x, z: POS.fuan_temple.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 56,
    archetypeCode: CODE_FUAN_TEMPLE,
    naturalBand: 3,
    colorHex: NM_FUAN_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 2,
    name: NM_WANJIN_BASILICA.name,
    nameJa: NM_WANJIN_BASILICA.name,
    x: POS.wanjin_basilica.x, z: POS.wanjin_basilica.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 48,
    archetypeCode: CODE_WANJIN_BASILICA,
    naturalBand: 3,
    colorHex: NM_WANJIN_BASILICA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 3,
    name: NM_CAESAR_HOTEL.name,
    nameJa: NM_CAESAR_HOTEL.name,
    x: POS.caesar_hotel.x, z: POS.caesar_hotel.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 110,
    archetypeCode: CODE_CAESAR_HOTEL,
    naturalBand: 4,
    colorHex: NM_CAESAR_HOTEL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 4,
    name: NM_AQUARIUM.name,
    nameJa: NM_AQUARIUM.name,
    x: POS.aquarium.x, z: POS.aquarium.z,
    dioramaR: 85,
    collisionScale: 0.7,
    sizeReal: 140,
    archetypeCode: CODE_AQUARIUM,
    naturalBand: 4,
    colorHex: NM_AQUARIUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 5,
    name: NM_ELUANBI.name,
    nameJa: NM_ELUANBI.name,
    x: POS.eluanbi.x, z: POS.eluanbi.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 200,
    archetypeCode: CODE_ELUANBI,
    naturalBand: 5,
    colorHex: NM_ELUANBI.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 6,
    name: NM_MAOBITOU.name,
    nameJa: NM_MAOBITOU.name,
    x: POS.maobitou.x, z: POS.maobitou.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 250,
    archetypeCode: CODE_MAOBITOU,
    naturalBand: 5,
    colorHex: NM_MAOBITOU.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 7,
    name: NM_SAIL_ROCK.name,
    nameJa: NM_SAIL_ROCK.name,
    x: POS.sail_rock.x, z: POS.sail_rock.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_SAIL_ROCK,
    naturalBand: 5,
    colorHex: NM_SAIL_ROCK.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8, // GOAL
    name: '鵝鑾鼻燈塔',
    nameJa: '鵝鑾鼻燈塔',
    x: MONUMENT_POS.x, z: MONUMENT_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 508,
    archetypeCode: 93,
    naturalBand: 6,
    colorHex: 0xf8f8f0,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Pingtung landmark singletons */
/* ================================================================== */

const _PINGTUNG_LANDMARK_PLACEMENTS = LANDMARKS
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
  ..._PINGTUNG_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 大鵬灣 bay definition for the Pingtung pack.
 */
export const water = Object.freeze({
  name: '大鵬灣',
  color: 0x2a6a8e,
  yM: 0.3,
  width: 300,
  centerline: Object.freeze([
    Object.freeze({ x: -800, z: 1200 }),
    Object.freeze({ x:  200, z: 1400 }),
    Object.freeze({ x: 1000, z: 1200 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                           */
/* ================================================================== */

export const GOAL_POS = MONUMENT_POS;

export const DEV_STARTS = Object.freeze({
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  'night-market': Object.freeze({ x: 60,   z: -80,   r: 0.5  }),
  arcade:      Object.freeze({ x: -180, z: 120,   r: 3    }),
  kenting:     Object.freeze({ x: 100,  z: 300,   r: 30   }),
  donggang:    Object.freeze({ x: -350, z: 600,   r: 120  }),
  hengchun:    Object.freeze({ x: 500,  z: -350,  r: 300  }),
  goal:        Object.freeze({ x: 700,  z: -400,  r: 400  }),
});
