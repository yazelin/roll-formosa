/**
 * @file cityMap.js — Nantou pack cityMap.
 *
 * Nantou: introduces native Nantou LANDMARKS (8 curated singletons + 慈恩塔 goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Nantou 9 entries (8 curated + 慈恩塔 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Nantou landmark placements
 *   - GOAL_POS    → CIEN_PAGODA_POS
 *   - DEV_STARTS  → Nantou-themed teleport keys
 *   - water       → 日月潭 (Sun Moon Lake) — ellipse shape
 */

import { CIEN_PAGODA_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_WENWU_TEMPLE } from './landmarks/wenwu_temple.js';
import { NM_XUANGUANG_TEMPLE } from './landmarks/xuanguang_temple.js';
import { NM_FORMOSAN_VILLAGE } from './landmarks/formosan_village.js';
import { NM_QINGJING_SWISS } from './landmarks/qingjing_swiss.js';
import { NM_PAPER_DOME } from './landmarks/paper_dome.js';
import { NM_JIJI_STATION } from './landmarks/jiji_station.js';
import { NM_ROPEWAY_STATION } from './landmarks/ropeway_station.js';
import { NM_PULI_WINERY } from './landmarks/puli_winery.js';
import { NM_CIEN_PAGODA } from './landmarks/cien_pagoda.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Nantou landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Nantou landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Nantou landmarks.
 * Convention (same as the base layout POS): origin = ball start (竹山老街 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Nantou
 * geography (竹山 south; 埔里 center; 日月潭 north-east; 清境 far north).
 */
const POS = Object.freeze({
  wenwu_temple:     Object.freeze({ x:  200, z: -300 }),   // 文武廟 — 日月潭北岸
  xuanguang_temple: Object.freeze({ x:  350, z: -200 }),   // 玄光寺 — 日月潭南岸
  formosan_village: Object.freeze({ x:  450, z: -450 }),   // 九族文化村 — 日月潭西邊山區
  qingjing_swiss:   Object.freeze({ x:  100, z: -650 }),   // 清境小瑞士 — 高山區
  paper_dome:       Object.freeze({ x: -150, z:   80 }),   // 紙教堂 — 埔里桃米村
  jiji_station:     Object.freeze({ x: -400, z:  350 }),   // 集集車站 — 集集線
  ropeway_station:  Object.freeze({ x:  550, z: -350 }),   // 日月潭纜車站 — 伊達邵
  puli_winery:      Object.freeze({ x:  -80, z:  -50 }),   // 埔里酒廠 — 埔里市區
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Nantou landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Nantou curated landmark singletons. */
const CODE_WENWU_TEMPLE     = 82;
const CODE_XUANGUANG_TEMPLE = 83;
const CODE_FORMOSAN_VILLAGE = 84;
const CODE_QINGJING_SWISS   = 85;
const CODE_PAPER_DOME       = 86;
const CODE_JIJI_STATION     = 87;
const CODE_ROPEWAY_STATION  = 88;
const CODE_PULI_WINERY      = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 慈恩塔 goal (strictly increasing */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Nantou landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be STRICTLY INCREASING while respecting real-world scale):
 *   L0  文武廟         dioramaR  30 → absorbable @  46.2 m
 *   L1  玄光寺         dioramaR  32 → absorbable @  49.2 m
 *   L2  九族文化村     dioramaR  35 → absorbable @  53.8 m
 *   L3  清境小瑞士     dioramaR  80 → absorbable @ 123.1 m
 *   L4  紙教堂         dioramaR  85 → absorbable @ 130.8 m
 *   L5  集集車站       dioramaR 100 → absorbable @ 153.8 m
 *   L6  日月潭纜車站   dioramaR 105 → absorbable @ 161.5 m
 *   L7  埔里酒廠       dioramaR 110 → absorbable @ 169.2 m
 *   L8  慈恩塔(goal)   dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_WENWU_TEMPLE.landmarkId,       // 0
    name: NM_WENWU_TEMPLE.name,
    nameJa: NM_WENWU_TEMPLE.name,                 // nameJa alias for curated.js compat
    x: POS.wenwu_temple.x,  z: POS.wenwu_temple.z,
    dioramaR: 30,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_WENWU_TEMPLE,
    naturalBand: 3,
    colorHex: NM_WENWU_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_XUANGUANG_TEMPLE.landmarkId,   // 1
    name: NM_XUANGUANG_TEMPLE.name,
    nameJa: NM_XUANGUANG_TEMPLE.name,
    x: POS.xuanguang_temple.x, z: POS.xuanguang_temple.z,
    dioramaR: 32,
    collisionScale: 0.9,
    sizeReal: 35,
    archetypeCode: CODE_XUANGUANG_TEMPLE,
    naturalBand: 3,
    colorHex: NM_XUANGUANG_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_FORMOSAN_VILLAGE.landmarkId,   // 2
    name: NM_FORMOSAN_VILLAGE.name,
    nameJa: NM_FORMOSAN_VILLAGE.name,
    x: POS.formosan_village.x, z: POS.formosan_village.z,
    dioramaR: 35,
    collisionScale: 0.9,
    sizeReal: 80,
    archetypeCode: CODE_FORMOSAN_VILLAGE,
    naturalBand: 3,
    colorHex: NM_FORMOSAN_VILLAGE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_QINGJING_SWISS.landmarkId,     // 3
    name: NM_QINGJING_SWISS.name,
    nameJa: NM_QINGJING_SWISS.name,
    x: POS.qingjing_swiss.x, z: POS.qingjing_swiss.z,
    dioramaR: 80,
    collisionScale: 0.9,
    sizeReal: 120,
    archetypeCode: CODE_QINGJING_SWISS,
    naturalBand: 4,
    colorHex: NM_QINGJING_SWISS.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_PAPER_DOME.landmarkId,         // 4
    name: NM_PAPER_DOME.name,
    nameJa: NM_PAPER_DOME.name,
    x: POS.paper_dome.x, z: POS.paper_dome.z,
    dioramaR: 85,
    collisionScale: 0.8,
    sizeReal: 25,
    archetypeCode: CODE_PAPER_DOME,
    naturalBand: 4,
    colorHex: NM_PAPER_DOME.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_JIJI_STATION.landmarkId,       // 5
    name: NM_JIJI_STATION.name,
    nameJa: NM_JIJI_STATION.name,
    x: POS.jiji_station.x, z: POS.jiji_station.z,
    dioramaR: 100,
    collisionScale: 0.8,
    sizeReal: 30,
    archetypeCode: CODE_JIJI_STATION,
    naturalBand: 5,
    colorHex: NM_JIJI_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ROPEWAY_STATION.landmarkId,    // 6
    name: NM_ROPEWAY_STATION.name,
    nameJa: NM_ROPEWAY_STATION.name,
    x: POS.ropeway_station.x, z: POS.ropeway_station.z,
    dioramaR: 105,
    collisionScale: 0.85,
    sizeReal: 45,
    archetypeCode: CODE_ROPEWAY_STATION,
    naturalBand: 5,
    colorHex: NM_ROPEWAY_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_PULI_WINERY.landmarkId,        // 7
    name: NM_PULI_WINERY.name,
    nameJa: NM_PULI_WINERY.name,
    x: POS.puli_winery.x, z: POS.puli_winery.z,
    dioramaR: 110,
    collisionScale: 0.85,
    sizeReal: 60,
    archetypeCode: CODE_PULI_WINERY,
    naturalBand: 5,
    colorHex: NM_PULI_WINERY.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CIEN_PAGODA.landmarkId,        // 8 — GOAL
    name: NM_CIEN_PAGODA.name,
    nameJa: NM_CIEN_PAGODA.name,
    x: CIEN_PAGODA_POS.x, z: CIEN_PAGODA_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 46,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0x8b6914,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Nantou landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Nantou: starts with the full cityData base set,
 * then appends the 8 Nantou landmark singleton placements. The 慈恩塔 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _NANTOU_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 Nantou landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._NANTOU_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 日月潭 (Sun Moon Lake) definition for the Nantou pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 竹山老街 shop, +X east, +Z south).
 *
 * Sun Moon Lake is roughly elliptical, ~4 km E-W × ~3 km N-S. We represent it
 * as a 5-point centerline tracing the lake's shape (consumed by environment.js
 * via ribbonQuads).
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * is positioned in the north-east quadrant where the goal (慈恩塔) sits.
 *
 * color: deep blue-green (清澈的高山湖泊).
 * yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '日月潭',
  color: 0x2a5a6a,
  yM: 0.3,
  width: 300,
  centerline: Object.freeze([
    Object.freeze({ x:  150, z: -450 }),
    Object.freeze({ x:  400, z: -400 }),
    Object.freeze({ x:  650, z: -350 }),
    Object.freeze({ x:  800, z: -250 }),
    Object.freeze({ x:  700, z: -150 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (慈恩塔 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = CIEN_PAGODA_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Nantou ladder keys: shop / snack-street / bamboo / tea-terrace /
 * puli / qingjing / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 竹山老街 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 埔里小吃街 snack street (埔里 center). */
  'snack-street': Object.freeze({ x: -80,  z: -40,   r: 0.5  }),
  /** 竹山老街 bamboo craft district. */
  bamboo:      Object.freeze({ x: -150, z: 100,   r: 3    }),
  /** 茶園梯田 tea terrace hills. */
  'tea-terrace': Object.freeze({ x: -200, z: 200,   r: 30   }),
  /** 埔里街屋 / 地母廟 district (mid-radius). */
  puli:        Object.freeze({ x: -100, z: 50,    r: 120  }),
  /** 清境農場 Qingjing highland (approach zone near goal). */
  qingjing:    Object.freeze({ x: 100,  z: -600,  r: 300  }),
  /** Near the 慈恩塔 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
