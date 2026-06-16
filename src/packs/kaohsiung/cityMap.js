/**
 * @file cityMap.js — Kaohsiung pack cityMap (P6b).
 *
 * Native Kaohsiung LANDMARKS (8 curated core singletons + 高雄85 goal), wired
 * into PLACEMENTS so they spawn in the world and can be absorbed as the ball
 * grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js (neutral street layout — reused verbatim).
 *
 * Override list:
 *   - LANDMARKS   → native Kaohsiung 9 entries (8 core + 高雄85 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Kaohsiung landmark placements
 *   - GOAL_POS    → KAOHSIUNG85_POS (reuses the legacy goal anchor)
 *   - DEV_STARTS  → Kaohsiung-themed teleport keys
 *   - water       → 愛河 centerline ribbon
 */

import { KAOHSIUNG85_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated core landmark geometry descriptors for position/color/name.
import { NM_DOME_OF_LIGHT } from './landmarks/dome_of_light.js';
import { NM_PIER2 } from './landmarks/pier2.js';
import { NM_CIJIN_LIGHTHOUSE } from './landmarks/cijin_lighthouse.js';
import { NM_DRAGON_TIGER } from './landmarks/dragon_tiger.js';
import { NM_SANFENG } from './landmarks/sanfeng_temple.js';
import { NM_MUSIC_CENTER } from './landmarks/music_center.js';
import { NM_DAGANG_BRIDGE } from './landmarks/dagang_bridge.js';
import { NM_DREAM_WHEEL } from './landmarks/dream_mall_wheel.js';
import { NM_KAOHSIUNG85 } from './landmarks/kaohsiung85.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 美濃油紙傘 94) — already filtered at bake time. We append the 8
// native Kaohsiung core landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Kaohsiung landmark positions (game-meter, origin = ball start)     */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Kaohsiung core
 * landmarks. Convention (same as the base layout POS): origin = ball start
 * (鹽埕 shop entrance), +X east, +Z south. Positions are spread progressively —
 * smaller landmarks closer, larger landmarks farther along the roll, loosely
 * echoing 高雄 geography (鹽埕/美麗島 core; 駁二/旗津 harbour west; 蓮潭 north;
 * 三鳳宮 north-central; 海音中心/大港橋 灣區; 夢時代 east bay).
 *
 * Coords reuse the neutral street layout from the taipei template (they sit
 * inside MAP_BOUNDS and clear the shop + goal) — only the keys/comments change.
 */
const POS = Object.freeze({
  dome_of_light:    Object.freeze({ x:  -15, z:   30 }),   // 美麗島光之穹頂 — just outside the shop core
  pier2:            Object.freeze({ x: -280, z:  560 }),   // 駁二藝術特區 — 鹽埕/港邊 west
  cijin_lighthouse: Object.freeze({ x: -180, z:  200 }),   // 旗津燈塔 — 旗津 island west
  dragon_tiger:     Object.freeze({ x:  120, z: -520 }),   // 龍虎塔 — 蓮池潭 north
  sanfeng_temple:   Object.freeze({ x:  -80, z:  -40 }),   // 三鳳宮 — 三民 north-central
  music_center:     Object.freeze({ x:   80, z:  350 }),   // 流行音樂中心 — 亞洲新灣區
  dagang_bridge:    Object.freeze({ x:   60, z:  420 }),   // 大港橋 — 駁二/灣區 swing bridge
  dream_wheel:      Object.freeze({ x:  340, z: -280 }),   // 夢時代摩天輪 — 前鎮 bay east
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Kaohsiung landmarks) */
/* ================================================================== */
/** EXTRA codes for the 8 Kaohsiung curated core landmark singletons (frozen). */
const CODE_DOME_OF_LIGHT    = 82;
const CODE_PIER2            = 83;
const CODE_CIJIN_LIGHTHOUSE = 84;
const CODE_DRAGON_TIGER     = 85;
const CODE_SANFENG          = 86;
const CODE_MUSIC_CENTER     = 87;
const CODE_DAGANG_BRIDGE    = 88;
const CODE_DREAM_WHEEL      = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 core + 高雄85 goal (strictly increasing    */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Kaohsiung landmark defs, in strictly-increasing dioramaR order
 * (= landmarkId order). absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR = each landmark file's dioramaRHint — monotone):
 *   L0  美麗島光之穹頂  dioramaR  11 → absorbable @  16.9 m
 *   L1  駁二藝術特區    dioramaR  28 → absorbable @  43.1 m
 *   L2  旗津燈塔        dioramaR  40 → absorbable @  61.5 m
 *   L3  龍虎塔          dioramaR  60 → absorbable @  92.3 m
 *   L4  三鳳宮          dioramaR  85 → absorbable @ 130.8 m
 *   L5  流行音樂中心    dioramaR 115 → absorbable @ 176.9 m
 *   L6  大港橋          dioramaR 150 → absorbable @ 230.8 m
 *   L7  夢時代摩天輪    dioramaR 190 → absorbable @ 292.3 m
 *   L8  高雄85大樓(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: 0,
    name: NM_DOME_OF_LIGHT.name,
    nameJa: NM_DOME_OF_LIGHT.name,          // nameJa alias for curated.js compat
    x: POS.dome_of_light.x,  z: POS.dome_of_light.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 13,
    archetypeCode: CODE_DOME_OF_LIGHT,
    naturalBand: 3,
    colorHex: NM_DOME_OF_LIGHT.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 1,
    name: NM_PIER2.name,
    nameJa: NM_PIER2.name,
    x: POS.pier2.x, z: POS.pier2.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 56,
    archetypeCode: CODE_PIER2,
    naturalBand: 3,
    colorHex: NM_PIER2.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 2,
    name: NM_CIJIN_LIGHTHOUSE.name,
    nameJa: NM_CIJIN_LIGHTHOUSE.name,
    x: POS.cijin_lighthouse.x, z: POS.cijin_lighthouse.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 48,
    archetypeCode: CODE_CIJIN_LIGHTHOUSE,
    naturalBand: 3,
    colorHex: NM_CIJIN_LIGHTHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 3,
    name: NM_DRAGON_TIGER.name,
    nameJa: NM_DRAGON_TIGER.name,
    x: POS.dragon_tiger.x, z: POS.dragon_tiger.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 110,
    archetypeCode: CODE_DRAGON_TIGER,
    naturalBand: 4,
    colorHex: NM_DRAGON_TIGER.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 4,
    name: NM_SANFENG.name,
    nameJa: NM_SANFENG.name,
    x: POS.sanfeng_temple.x, z: POS.sanfeng_temple.z,
    dioramaR: 85,
    collisionScale: 0.7,
    sizeReal: 140,
    archetypeCode: CODE_SANFENG,
    naturalBand: 4,
    colorHex: NM_SANFENG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 5,
    name: NM_MUSIC_CENTER.name,
    nameJa: NM_MUSIC_CENTER.name,
    x: POS.music_center.x, z: POS.music_center.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 200,
    archetypeCode: CODE_MUSIC_CENTER,
    naturalBand: 5,
    colorHex: NM_MUSIC_CENTER.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 6,
    name: NM_DAGANG_BRIDGE.name,
    nameJa: NM_DAGANG_BRIDGE.name,
    x: POS.dagang_bridge.x, z: POS.dagang_bridge.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 250,
    archetypeCode: CODE_DAGANG_BRIDGE,
    naturalBand: 5,
    colorHex: NM_DAGANG_BRIDGE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 7,
    name: NM_DREAM_WHEEL.name,
    nameJa: NM_DREAM_WHEEL.name,
    x: POS.dream_wheel.x, z: POS.dream_wheel.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_DREAM_WHEEL,
    naturalBand: 5,
    colorHex: NM_DREAM_WHEEL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8,    // 8 — GOAL
    name: NM_KAOHSIUNG85.name,
    nameJa: NM_KAOHSIUNG85.name,
    x: KAOHSIUNG85_POS.x, z: KAOHSIUNG85_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 378,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: NM_KAOHSIUNG85.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Kaohsiung landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Kaohsiung: starts with the full cityData base set,
 * then appends the 8 Kaohsiung core landmark singleton placements. The 高雄85
 * goal is rendered by goalTower.js (code 93 = display-name-only slot, never
 * spawned from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _KAOHSIUNG_LANDMARK_PLACEMENTS = LANDMARKS
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
// collectibles 70..81 + 美濃油紙傘 94); the former legacy landmark/building codes
// 82..98 were dropped at bake time. Append the 8 Kaohsiung core landmark
// singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._KAOHSIUNG_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 愛河 (Love River) definition for the Kaohsiung pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 鹽埕 shop, +X east, +Z south).
 *
 * A 6-point centerline + width (120 m) traces the river's gentle north→south
 * arc through the map as a smooth diagonal ribbon (consumed by environment.js
 * via ribbonQuads). The river runs down the west flank of the play area,
 * clearing both the shop start (0,0) and the 高雄85 goal (749,-252).
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * every point keeps x ≤ -300 (well west of the shop start and goal column).
 *
 * color: cool blue-green tinted river water (siltier than open-sea 0x2a4a6e).
 * yM: 0.3 m above ground (hides the ground seam).
 */
export const water = Object.freeze({
  name: '愛河',
  color: 0x2f5a66,
  yM: 0.3,
  width: 120,
  centerline: Object.freeze([
    Object.freeze({ x: -560, z: -900 }),
    Object.freeze({ x: -480, z: -500 }),
    Object.freeze({ x: -440, z: -120 }),
    Object.freeze({ x: -420, z:  280 }),
    Object.freeze({ x: -460, z:  680 }),
    Object.freeze({ x: -540, z: 1080 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (高雄85大樓 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = KAOHSIUNG85_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Kaohsiung ladder keys: shop / liuhe-market / scooter-sea / port /
 * bay-area / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 鹽埕 shop — the base 'shop' start. */
  shop:          Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 六合夜市 night-market strip. */
  'liuhe-market': Object.freeze({ x: 60,   z: -80,   r: 0.5  }),
  /** 機車海 scooter-sea band (mid-map density ramp). */
  'scooter-sea': Object.freeze({ x: 100,  z: 300,   r: 30   }),
  /** 港邊 / 駁二 harbour district (west). */
  port:          Object.freeze({ x: -300, z: 540,   r: 120  }),
  /** 亞洲新灣區 bay-area CBD (approach zone). */
  'bay-area':    Object.freeze({ x: 500,  z: -350,  r: 300  }),
  /** Near the 高雄85大樓 goal monument. */
  goal:          Object.freeze({ x: 700,  z: -400,  r: 400  }),
});
