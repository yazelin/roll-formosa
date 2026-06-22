/**
 * @file cityMap.js — Chiayi pack cityMap.
 *
 * Introduces native Chiayi LANDMARKS (8 curated singletons + 射日塔 goal).
 * The 8 curated landmarks are wired into PLACEMENTS so they spawn in the
 * world and can be absorbed as the ball grows.
 *
 * Override list:
 *   - LANDMARKS   → native Chiayi 9 entries (8 curated + 射日塔 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Chiayi landmark placements
 *   - GOAL_POS    → SUN_SHOOTING_TOWER_POS
 *   - DEV_STARTS  → Chiayi-themed teleport keys
 *   - water       → 八掌溪 (Bazhang River)
 */

import { SUN_SHOOTING_TOWER_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_SACRED_TREE } from './landmarks/sacred_tree.js';
import { NM_HINOKI_VILLAGE } from './landmarks/hinoki_village.js';
import { NM_CHIAYI_STATION } from './landmarks/chiayi_station.js';
import { NM_CENTRAL_FOUNTAIN } from './landmarks/central_fountain.js';
import { NM_WENHUA_NIGHT_MARKET } from './landmarks/wenhua_night_market.js';
import { NM_CHIAYI_PARK } from './landmarks/chiayi_park.js';
import { NM_ALISHAN_TRAIN } from './landmarks/alishan_train.js';
import { NM_BEIGANG_CHAOTIAN } from './landmarks/beigang_chaotian.js';
import { NM_SUN_SHOOTING_TOWER } from './landmarks/sun_shooting_tower.js';

// Re-export the pack-owned baked layout (cityData.js).
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Chiayi landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Chiayi landmarks.
 * Convention: origin = ball start (文化路夜市 entrance), +X east, +Z south.
 * Positions are spread progressively — smaller landmarks closer, larger
 * landmarks farther along the roll.
 */
const POS = Object.freeze({
  sacred_tree:        Object.freeze({ x: 600, z: -650 }),   // 阿里山神木 — mountain area
  hinoki_village:     Object.freeze({ x: -120, z: -180 }),  // 檜意森活村 — near station
  chiayi_station:     Object.freeze({ x: -80, z: -60 }),    // 嘉義車站 — central
  central_fountain:   Object.freeze({ x: 50, z: 80 }),      // 中央噴水池 — downtown core
  wenhua_night_market:Object.freeze({ x: 0, z: 200 }),      // 文化路夜市 — near start
  chiayi_park:        Object.freeze({ x: 300, z: -300 }),   // 嘉義公園 — northeast
  alishan_train:      Object.freeze({ x: 450, z: -480 }),   // 阿里山小火車 — heading to mountain
  beigang_chaotian:   Object.freeze({ x: -400, z: 550 }),   // 北港朝天宮 — south-west
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Chiayi landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Chiayi curated landmark singletons. */
const CODE_SACRED_TREE        = 82;
const CODE_HINOKI_VILLAGE     = 83;
const CODE_CHIAYI_STATION     = 84;
const CODE_CENTRAL_FOUNTAIN   = 85;
const CODE_WENHUA_NIGHT_MARKET= 86;
const CODE_CHIAYI_PARK        = 87;
const CODE_ALISHAN_TRAIN      = 88;
const CODE_BEIGANG_CHAOTIAN   = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 射日塔 goal                      */
/* ================================================================== */

/**
 * Chiayi landmark defs, in **strictly-increasing dioramaR order** (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (sorted by dioramaR ascending):
 *   L0  中央噴水池       dioramaR  25 → absorbable @  38.5 m
 *   L1  阿里山小火車     dioramaR  30 → absorbable @  46.2 m
 *   L2  嘉義車站         dioramaR  35 → absorbable @  53.8 m
 *   L3  文化路夜市       dioramaR  40 → absorbable @  61.5 m
 *   L4  檜意森活村       dioramaR  45 → absorbable @  69.2 m
 *   L5  嘉義公園         dioramaR  50 → absorbable @  76.9 m
 *   L6  北港朝天宮       dioramaR  55 → absorbable @  84.6 m
 *   L7  阿里山神木       dioramaR  60 → absorbable @  92.3 m
 *   L8  射日塔(goal)     dioramaR  62 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: 0,                               // 0 - 中央噴水池 (smallest)
    name: NM_CENTRAL_FOUNTAIN.name,
    nameJa: NM_CENTRAL_FOUNTAIN.name,
    x: POS.central_fountain.x, z: POS.central_fountain.z,
    dioramaR: 25,
    collisionScale: 0.9,
    sizeReal: 30,
    archetypeCode: CODE_CENTRAL_FOUNTAIN,
    naturalBand: 4,
    colorHex: NM_CENTRAL_FOUNTAIN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 1,                               // 1 - 阿里山小火車
    name: NM_ALISHAN_TRAIN.name,
    nameJa: NM_ALISHAN_TRAIN.name,
    x: POS.alishan_train.x, z: POS.alishan_train.z,
    dioramaR: 30,
    collisionScale: 0.65,
    sizeReal: 40,
    archetypeCode: CODE_ALISHAN_TRAIN,
    naturalBand: 5,
    colorHex: NM_ALISHAN_TRAIN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 2,                               // 2 - 嘉義車站
    name: NM_CHIAYI_STATION.name,
    nameJa: NM_CHIAYI_STATION.name,
    x: POS.chiayi_station.x, z: POS.chiayi_station.z,
    dioramaR: 35,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_CHIAYI_STATION,
    naturalBand: 3,
    colorHex: NM_CHIAYI_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 3,                               // 3 - 文化路夜市
    name: NM_WENHUA_NIGHT_MARKET.name,
    nameJa: NM_WENHUA_NIGHT_MARKET.name,
    x: POS.wenhua_night_market.x, z: POS.wenhua_night_market.z,
    dioramaR: 40,
    collisionScale: 0.7,
    sizeReal: 55,
    archetypeCode: CODE_WENHUA_NIGHT_MARKET,
    naturalBand: 4,
    colorHex: NM_WENHUA_NIGHT_MARKET.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 4,                               // 4 - 檜意森活村
    name: NM_HINOKI_VILLAGE.name,
    nameJa: NM_HINOKI_VILLAGE.name,
    x: POS.hinoki_village.x, z: POS.hinoki_village.z,
    dioramaR: 45,
    collisionScale: 0.85,
    sizeReal: 60,
    archetypeCode: CODE_HINOKI_VILLAGE,
    naturalBand: 3,
    colorHex: NM_HINOKI_VILLAGE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 5,                               // 5 - 嘉義公園
    name: NM_CHIAYI_PARK.name,
    nameJa: NM_CHIAYI_PARK.name,
    x: POS.chiayi_park.x, z: POS.chiayi_park.z,
    dioramaR: 50,
    collisionScale: 0.8,
    sizeReal: 70,
    archetypeCode: CODE_CHIAYI_PARK,
    naturalBand: 5,
    colorHex: NM_CHIAYI_PARK.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 6,                               // 6 - 北港朝天宮
    name: NM_BEIGANG_CHAOTIAN.name,
    nameJa: NM_BEIGANG_CHAOTIAN.name,
    x: POS.beigang_chaotian.x, z: POS.beigang_chaotian.z,
    dioramaR: 55,
    collisionScale: 0.85,
    sizeReal: 75,
    archetypeCode: CODE_BEIGANG_CHAOTIAN,
    naturalBand: 5,
    colorHex: NM_BEIGANG_CHAOTIAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 7,                               // 7 - 阿里山神木
    name: NM_SACRED_TREE.name,
    nameJa: NM_SACRED_TREE.name,
    x: POS.sacred_tree.x, z: POS.sacred_tree.z,
    dioramaR: 60,
    collisionScale: 0.8,
    sizeReal: 80,
    archetypeCode: CODE_SACRED_TREE,
    naturalBand: 3,
    colorHex: NM_SACRED_TREE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8,                               // 8 — GOAL 射日塔
    name: NM_SUN_SHOOTING_TOWER.name,
    nameJa: NM_SUN_SHOOTING_TOWER.name,
    x: SUN_SHOOTING_TOWER_POS.x, z: SUN_SHOOTING_TOWER_POS.z,
    dioramaR: 62,
    collisionScale: 0.5,
    sizeReal: 62,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xbcc5cb, // aluminum
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Chiayi landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Chiayi: starts with the full cityData base set,
 * then appends the 8 Chiayi landmark singleton placements.
 */
const _CHIAYI_LANDMARK_PLACEMENTS = LANDMARKS
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
  ..._CHIAYI_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 八掌溪 (Bazhang River) definition for the Chiayi pack.
 *
 * A major river flowing through southern Chiayi, running from the mountains
 * toward the sea. The centerline traces a west-to-east diagonal through the
 * southern portion of the map, representing the river's path through the plain.
 *
 * color: brownish-green river water (agricultural plain river character)
 * yM: 0.3 m above ground
 */
export const water = Object.freeze({
  name: '八掌溪',
  color: 0x4a6a58,
  yM: 0.3,
  width: 120,
  centerline: Object.freeze([
    Object.freeze({ x: -1600, z: 800 }),
    Object.freeze({ x: -800, z: 750 }),
    Object.freeze({ x: 0, z: 680 }),
    Object.freeze({ x: 800, z: 600 }),
    Object.freeze({ x: 1500, z: 520 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (射日塔 world anchor).
 */
export const GOAL_POS = SUN_SHOOTING_TOWER_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Chiayi ladder keys: shop / night-market / station / hinoki /
 * park / alishan / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 文化路 shop — the base 'shop' start. */
  shop:           Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 文化路夜市 night-market strip. */
  'night-market': Object.freeze({ x: 0,    z: 180,   r: 0.5  }),
  /** 嘉義車站 area. */
  station:        Object.freeze({ x: -80,  z: -60,   r: 3    }),
  /** 檜意森活村 hinoki village district. */
  hinoki:         Object.freeze({ x: -120, z: -180,  r: 30   }),
  /** 嘉義公園 (mid-radius). */
  park:           Object.freeze({ x: 300,  z: -300,  r: 50   }),
  /** 阿里山 approach (mountain area). */
  alishan:        Object.freeze({ x: 500,  z: -500,  r: 150  }),
  /** Near the 射日塔 goal monument. */
  goal:           Object.freeze({ x: 650,  z: -620,  r: 300  }),
});
