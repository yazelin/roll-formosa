/**
 * @file cityMap.js — Yunlin pack cityMap (P6b).
 *
 * P6b: introduces native Yunlin LANDMARKS (8 curated singletons + goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Yunlin 9 entries (8 curated + goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Yunlin landmark placements
 *   - GOAL_POS    → goal monument position
 *   - DEV_STARTS  → Yunlin-themed teleport keys
 */

import { GOAL_MONUMENT_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_BEIGANG_CHAOTIAN } from './landmarks/beigang_chaotian.js';
import { NM_XILUO_OLDSTREET } from './landmarks/xiluo_oldstreet.js';
import { NM_HUWEI_PUPPET_MUSEUM } from './landmarks/huwei_puppet_museum.js';
import { NM_GUKENG_COFFEE } from './landmarks/gukeng_coffee.js';
import { NM_DOULIU_ROUNDABOUT } from './landmarks/douliu_roundabout.js';
import { NM_JANFUSUN_FANCYWORLD } from './landmarks/janfusun_fancyworld.js';
import { NM_DOUNAN_STATION } from './landmarks/dounan_station.js';
import { NM_YUNLIN_PUPPET_CENTER } from './landmarks/yunlin_puppet_center.js';
import { goalMonument } from './monument.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Yunlin landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Yunlin landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Yunlin landmarks.
 * Convention (same as the base layout POS): origin = ball start,
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll.
 */
const POS = Object.freeze({
  beigang_chaotian:    Object.freeze({ x: -280, z:  400 }),   // 北港朝天宮 — west, major temple
  xiluo_oldstreet:     Object.freeze({ x: -150, z:  200 }),   // 西螺老街 — historic district
  huwei_puppet_museum: Object.freeze({ x:  -50, z:   80 }),   // 虎尾布袋戲館 — central
  gukeng_coffee:       Object.freeze({ x:  180, z: -350 }),   // 古坑咖啡園 — eastern hills
  douliu_roundabout:   Object.freeze({ x:   60, z:  -30 }),   // 斗六圓環 — county seat center
  janfusun_fancyworld: Object.freeze({ x:  320, z: -450 }),   // 劍湖山世界 — eastern theme park
  dounan_station:      Object.freeze({ x: -100, z:  300 }),   // 斗南火車站 — railway station
  yunlin_puppet_center:Object.freeze({ x:  200, z:  150 }),   // 雲林布袋戲偶文物館 — cultural center
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Yunlin landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Yunlin curated landmark singletons (frozen P6b). */
const CODE_BEIGANG_CHAOTIAN    = 82;
const CODE_XILUO_OLDSTREET     = 83;
const CODE_HUWEI_PUPPET_MUSEUM = 84;
const CODE_GUKENG_COFFEE       = 85;
const CODE_DOULIU_ROUNDABOUT   = 86;
const CODE_JANFUSUN_FANCYWORLD = 87;
const CODE_DOUNAN_STATION      = 88;
const CODE_YUNLIN_PUPPET_CENTER= 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + goal (strictly increasing       */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Yunlin landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  虎尾布袋戲館       dioramaR  42 → absorbable @  64.6 m
 *   L1  斗南火車站         dioramaR  44 → absorbable @  67.7 m
 *   L2  古坑咖啡園         dioramaR  46 → absorbable @  70.8 m
 *   L3  西螺老街           dioramaR  48 → absorbable @  73.8 m
 *   L4  雲林布袋戲偶文物館 dioramaR  50 → absorbable @  76.9 m
 *   L5  斗六圓環           dioramaR  52 → absorbable @  80.0 m
 *   L6  北港朝天宮         dioramaR  55 → absorbable @  84.6 m
 *   L7  劍湖山世界         dioramaR  60 → absorbable @  92.3 m
 *   L8  goal monument      dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_HUWEI_PUPPET_MUSEUM.landmarkId,        // 0
    name: NM_HUWEI_PUPPET_MUSEUM.name,
    nameJa: NM_HUWEI_PUPPET_MUSEUM.name,
    x: POS.huwei_puppet_museum.x, z: POS.huwei_puppet_museum.z,
    dioramaR: NM_HUWEI_PUPPET_MUSEUM.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 45,
    archetypeCode: CODE_HUWEI_PUPPET_MUSEUM,
    naturalBand: 3,
    colorHex: NM_HUWEI_PUPPET_MUSEUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DOUNAN_STATION.landmarkId, // 1
    name: NM_DOUNAN_STATION.name,
    nameJa: NM_DOUNAN_STATION.name,
    x: POS.dounan_station.x, z: POS.dounan_station.z,
    dioramaR: NM_DOUNAN_STATION.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_DOUNAN_STATION,
    naturalBand: 3,
    colorHex: NM_DOUNAN_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_GUKENG_COFFEE.landmarkId,  // 2
    name: NM_GUKENG_COFFEE.name,
    nameJa: NM_GUKENG_COFFEE.name,
    x: POS.gukeng_coffee.x, z: POS.gukeng_coffee.z,
    dioramaR: NM_GUKENG_COFFEE.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_GUKENG_COFFEE,
    naturalBand: 4,
    colorHex: NM_GUKENG_COFFEE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_XILUO_OLDSTREET.landmarkId,     // 3
    name: NM_XILUO_OLDSTREET.name,
    nameJa: NM_XILUO_OLDSTREET.name,
    x: POS.xiluo_oldstreet.x, z: POS.xiluo_oldstreet.z,
    dioramaR: NM_XILUO_OLDSTREET.dioramaRHint,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_XILUO_OLDSTREET,
    naturalBand: 4,
    colorHex: NM_XILUO_OLDSTREET.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_YUNLIN_PUPPET_CENTER.landmarkId,        // 4
    name: NM_YUNLIN_PUPPET_CENTER.name,
    nameJa: NM_YUNLIN_PUPPET_CENTER.name,
    x: POS.yunlin_puppet_center.x, z: POS.yunlin_puppet_center.z,
    dioramaR: NM_YUNLIN_PUPPET_CENTER.dioramaRHint,
    collisionScale: 0.85,
    sizeReal: 55,
    archetypeCode: CODE_YUNLIN_PUPPET_CENTER,
    naturalBand: 4,
    colorHex: NM_YUNLIN_PUPPET_CENTER.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DOULIU_ROUNDABOUT.landmarkId, // 5
    name: NM_DOULIU_ROUNDABOUT.name,
    nameJa: NM_DOULIU_ROUNDABOUT.name,
    x: POS.douliu_roundabout.x, z: POS.douliu_roundabout.z,
    dioramaR: NM_DOULIU_ROUNDABOUT.dioramaRHint,
    collisionScale: 0.8,
    sizeReal: 55,
    archetypeCode: CODE_DOULIU_ROUNDABOUT,
    naturalBand: 4,
    colorHex: NM_DOULIU_ROUNDABOUT.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_BEIGANG_CHAOTIAN.landmarkId,       // 6
    name: NM_BEIGANG_CHAOTIAN.name,
    nameJa: NM_BEIGANG_CHAOTIAN.name,                 // nameJa alias for curated.js compat
    x: POS.beigang_chaotian.x,  z: POS.beigang_chaotian.z,
    dioramaR: NM_BEIGANG_CHAOTIAN.dioramaRHint,
    collisionScale: 1.0,
    sizeReal: 60,
    archetypeCode: CODE_BEIGANG_CHAOTIAN,
    naturalBand: 5,
    colorHex: NM_BEIGANG_CHAOTIAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_JANFUSUN_FANCYWORLD.landmarkId,          // 7
    name: NM_JANFUSUN_FANCYWORLD.name,
    nameJa: NM_JANFUSUN_FANCYWORLD.name,
    x: POS.janfusun_fancyworld.x, z: POS.janfusun_fancyworld.z,
    dioramaR: NM_JANFUSUN_FANCYWORLD.dioramaRHint,
    collisionScale: 0.8,
    sizeReal: 80,
    archetypeCode: CODE_JANFUSUN_FANCYWORLD,
    naturalBand: 5,
    colorHex: NM_JANFUSUN_FANCYWORLD.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8,    // 8 — GOAL
    name: goalMonument.name || '雲林地標',
    nameJa: goalMonument.name || '雲林地標',
    x: GOAL_MONUMENT_POS.x, z: GOAL_MONUMENT_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 508,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0x68c8c8,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Yunlin landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Yunlin: starts with the full cityData base set,
 * then appends the 8 Yunlin landmark singleton placements. The goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _YUNLIN_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 Yunlin landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._YUNLIN_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 濁水溪 river definition for the Yunlin pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start, +X east, +Z south).
 *
 * A 5-point centerline + width (200 m) traces the river's path along the
 * southern edge of Yunlin (consumed by environment.js via ribbonQuads).
 *
 * color: silty brown-grey typical of the Zhuoshui River (Taiwan's longest).
 * yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '濁水溪',
  color: 0x6a7a68,
  yM: 0.3,
  width: 200,
  centerline: Object.freeze([
    Object.freeze({ x: -1200, z: 900 }),
    Object.freeze({ x: -600, z: 850 }),
    Object.freeze({ x: 0, z: 780 }),
    Object.freeze({ x: 600, z: 820 }),
    Object.freeze({ x: 1200, z: 750 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                           */
/* ================================================================== */

/**
 * Goal monument real-meter position (world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = GOAL_MONUMENT_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Yunlin ladder keys: shop / huwei / douliu / beigang / janfusun / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 虎尾 Huwei district (puppet museum area). */
  huwei:       Object.freeze({ x: -50,  z: 80,    r: 0.5  }),
  /** 斗六 Douliu city center (roundabout). */
  douliu:      Object.freeze({ x: 60,   z: -30,   r: 3    }),
  /** 北港 Beigang temple district. */
  beigang:     Object.freeze({ x: -280, z: 400,   r: 30   }),
  /** 古坑 Gukeng coffee hills. */
  gukeng:      Object.freeze({ x: 180,  z: -350,  r: 120  }),
  /** 劍湖山 Janfusun Fancyworld theme park. */
  janfusun:    Object.freeze({ x: 320,  z: -450,  r: 200  }),
  /** Near the goal monument. */
  goal:        Object.freeze({ x: 500,  z: -500,  r: 400  }),
});
