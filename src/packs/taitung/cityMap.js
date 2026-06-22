/**
 * @file cityMap.js — Taitung pack cityMap (P6b).
 *
 * P6b: introduces native Taitung LANDMARKS (8 curated singletons + Sanxiantai goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Taitung 9 entries (8 curated + Sanxiantai goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Taitung landmark placements
 *   - GOAL_POS    → SANXIANTAI_POS
 *   - DEV_STARTS  → Taitung-themed teleport keys
 */

import { SANXIANTAI_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_TIEHUA } from './landmarks/tiehua_village.js';
import { NM_TAITUNG_STATION } from './landmarks/taitung_station.js';
import { NM_CHISHANG } from './landmarks/chishang_rice.js';
import { NM_TAKESHI_TREE } from './landmarks/takeshi_tree.js';
import { NM_DULAN } from './landmarks/dulan_sugar.js';
import { NM_LUYE_BALLOON } from './landmarks/luye_balloon.js';
import { NM_AMIS } from './landmarks/amis_cultural.js';
import { NM_JHIHBEN } from './landmarks/jhihben_hot_spring.js';
import { NM_SANXIANTAI } from './landmarks/sanxiantai_bridge.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + v5 94) — already filtered at bake time. We append the 8 native
// Taitung landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Taitung landmark positions (game-meter, origin = ball start)       */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Taitung landmarks.
 * Convention (same as the base layout POS): origin = ball start (台東市區 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Taitung
 * geography (鐵花村 central; 池上/金城武樹 north; 知本 south; 三仙台 northeast coast).
 */
const POS = Object.freeze({
  tiehua:       Object.freeze({ x:  -20, z:   25 }),   // 鐵花村 — near start (city center)
  station:      Object.freeze({ x:   60, z:  -30 }),   // 台東火車站 — north of start
  chishang:     Object.freeze({ x: -150, z: -450 }),   // 池上飯包 — far north (Chishang town)
  takeshi:      Object.freeze({ x: -280, z: -520 }),   // 金城武樹 — northwest (Brown Avenue)
  dulan:        Object.freeze({ x:  350, z:  180 }),   // 都蘭糖廠 — northeast coast
  luye:         Object.freeze({ x: -100, z: -350 }),   // 鹿野高台 — north highlands
  amis:         Object.freeze({ x:  180, z:  380 }),   // 阿美族民俗中心 — southeast
  jhihben:      Object.freeze({ x: -320, z:  520 }),   // 知本溫泉 — southwest mountains
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Taitung landmarks)  */
/* ================================================================== */
/** EXTRA codes for the 8 Taitung curated landmark singletons (frozen P6b). */
const CODE_TIEHUA      = 82;
const CODE_STATION     = 83;
const CODE_CHISHANG    = 84;
const CODE_TAKESHI     = 85;
const CODE_DULAN       = 86;
const CODE_LUYE        = 87;
const CODE_AMIS        = 88;
const CODE_JHIHBEN     = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + Sanxiantai goal (strictly       */
/* increasing dioramaR in array order, goal last with isGoal:true)    */
/* ================================================================== */

/**
 * Taitung landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  鐵花村           dioramaR  11 → absorbable @  16.9 m
 *   L1  台東火車站       dioramaR  28 → absorbable @  43.1 m
 *   L2  池上飯包文化故事館 dioramaR  40 → absorbable @  61.5 m
 *   L3  金城武樹         dioramaR  60 → absorbable @  92.3 m
 *   L4  都蘭糖廠         dioramaR  85 → absorbable @ 130.8 m
 *   L5  鹿野高台熱氣球   dioramaR 115 → absorbable @ 176.9 m
 *   L6  阿美族民俗中心   dioramaR 150 → absorbable @ 230.8 m
 *   L7  知本溫泉         dioramaR 190 → absorbable @ 292.3 m
 *   L8  三仙台八拱橋(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_TIEHUA.landmarkId,       // 0
    name: NM_TIEHUA.name,
    nameJa: NM_TIEHUA.name,                 // nameJa alias for curated.js compat
    x: POS.tiehua.x,  z: POS.tiehua.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 15,
    archetypeCode: CODE_TIEHUA,
    naturalBand: 3,
    colorHex: NM_TIEHUA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TAITUNG_STATION.landmarkId, // 1
    name: NM_TAITUNG_STATION.name,
    nameJa: NM_TAITUNG_STATION.name,
    x: POS.station.x, z: POS.station.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 45,
    archetypeCode: CODE_STATION,
    naturalBand: 3,
    colorHex: NM_TAITUNG_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CHISHANG.landmarkId,     // 2
    name: NM_CHISHANG.name,
    nameJa: NM_CHISHANG.name,
    x: POS.chishang.x, z: POS.chishang.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_CHISHANG,
    naturalBand: 3,
    colorHex: NM_CHISHANG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TAKESHI_TREE.landmarkId, // 3
    name: NM_TAKESHI_TREE.name,
    nameJa: NM_TAKESHI_TREE.name,
    x: POS.takeshi.x, z: POS.takeshi.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 80,
    archetypeCode: CODE_TAKESHI,
    naturalBand: 4,
    colorHex: NM_TAKESHI_TREE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DULAN.landmarkId,        // 4
    name: NM_DULAN.name,
    nameJa: NM_DULAN.name,
    x: POS.dulan.x, z: POS.dulan.z,
    dioramaR: 85,
    collisionScale: 0.8,
    sizeReal: 100,
    archetypeCode: CODE_DULAN,
    naturalBand: 4,
    colorHex: NM_DULAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LUYE_BALLOON.landmarkId, // 5
    name: NM_LUYE_BALLOON.name,
    nameJa: NM_LUYE_BALLOON.name,
    x: POS.luye.x, z: POS.luye.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 150,
    archetypeCode: CODE_LUYE,
    naturalBand: 5,
    colorHex: NM_LUYE_BALLOON.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_AMIS.landmarkId,         // 6
    name: NM_AMIS.name,
    nameJa: NM_AMIS.name,
    x: POS.amis.x, z: POS.amis.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 200,
    archetypeCode: CODE_AMIS,
    naturalBand: 5,
    colorHex: NM_AMIS.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_JHIHBEN.landmarkId,      // 7
    name: NM_JHIHBEN.name,
    nameJa: NM_JHIHBEN.name,
    x: POS.jhihben.x, z: POS.jhihben.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 250,
    archetypeCode: CODE_JHIHBEN,
    naturalBand: 5,
    colorHex: NM_JHIHBEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SANXIANTAI.landmarkId,   // 8 — GOAL
    name: NM_SANXIANTAI.name,
    nameJa: NM_SANXIANTAI.name,
    x: SANXIANTAI_POS.x, z: SANXIANTAI_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 320,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xe65c00,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Taitung landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Taitung: starts with the full cityData base set,
 * then appends the 8 Taitung landmark singleton placements. The Sanxiantai goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _TAITUNG_LANDMARK_PLACEMENTS = LANDMARKS
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
// collectibles 70..81 + v5 94); the former legacy landmark/building codes
// 82..98 were dropped at bake time (they OVERFLOWED the landmark-xl pool →
// invisible-but-collidable, and the 8 curated landmarks are re-placed natively
// below). Append the 8 Taitung landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._TAITUNG_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 卑南溪 river definition for the Taitung pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 台東市區 shop, +X east, +Z south).
 *
 * A 5-point centerline + width (120 m) traces the river's real flow
 * from the mountains through Taitung city to the Pacific Ocean. The Beinan River
 * flows generally from northwest to southeast, passing near Taitung City.
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and the Sanxiantai goal (749,-252).
 *
 * color: slightly brownish-green (mountain river carrying sediment),
 * evoking the river's characteristic appearance.
 * yM: 0.3 m above ground (same as other water — hides the seam).
 */
export const water = Object.freeze({
  name: '卑南溪',
  color: 0x4a6858,
  yM: 0.3,
  width: 120,
  centerline: Object.freeze([
    Object.freeze({ x: -400, z: -600 }),    // from mountains (northwest)
    Object.freeze({ x: -150, z: -350 }),    // mid-valley
    Object.freeze({ x:   80, z:  -50 }),    // near city
    Object.freeze({ x:  350, z:  200 }),    // flow southeast
    Object.freeze({ x:  600, z:  450 }),    // toward coast (east)
  ]),
});

/* ================================================================== */
/* Overrides (same as P6a)                                            */
/* ================================================================== */

/**
 * Goal monument real-meter position (三仙台八拱橋 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = SANXIANTAI_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Taitung ladder keys: shop / market / station / paddy / coast / valley / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 台東市區 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 鐵花村 arts market district. */
  market:      Object.freeze({ x: -30,  z: 30,    r: 0.5  }),
  /** 台東火車站 train station area. */
  station:     Object.freeze({ x: 60,   z: -30,   r: 3    }),
  /** 池上稻田 rice paddy area. */
  paddy:       Object.freeze({ x: -200, z: -450,  r: 30   }),
  /** 都蘭海岸 coastal area (mid-radius). */
  coast:       Object.freeze({ x: 350,  z: 180,   r: 120  }),
  /** 縱谷 East Rift Valley approach zone. */
  valley:      Object.freeze({ x: -100, z: -350,  r: 200  }),
  /** Near the 三仙台八拱橋 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
