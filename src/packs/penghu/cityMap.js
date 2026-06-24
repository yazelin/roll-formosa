/**
 * @file cityMap.js — Penghu pack cityMap (P6b).
 *
 * P6b: introduces native Penghu LANDMARKS (8 curated singletons + 跨海大橋 goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Penghu 9 entries (8 curated + 跨海大橋 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Penghu landmark placements
 *   - GOAL_POS    → CROSS_SEA_BRIDGE_POS (same as P6a)
 *   - DEV_STARTS  → Penghu-themed teleport keys (same as P6a)
 */

import { CROSS_SEA_BRIDGE_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_DOUBLE_HEART } from './landmarks/double_heart_weir.js';
import { NM_TIANHOU } from './landmarks/tianhou_temple.js';
import { NM_ZHONGYANG } from './landmarks/zhongyangstreet.js';
import { NM_DAGUOYE } from './landmarks/daguoye_basalt.js';
import { NM_XIYU_LIGHTHOUSE as NM_LIGHTHOUSE } from './landmarks/xiyu_lighthouse.js';
import { NM_ERKAN } from './landmarks/erkan_village.js';
import { NM_WHALE_CAVE as NM_WHALE } from './landmarks/whale_cave.js';
import { NM_FENGGUI } from './landmarks/fenggui_cave.js';
import { NM_CROSS_SEA_BRIDGE } from './landmarks/cross_sea_bridge.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Penghu landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Penghu landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Penghu landmarks.
 * Convention (same as the base layout POS): origin = ball start (馬公商圈),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Penghu
 * geography (七美 southwest; 西嶼 northwest; 馬公 central; 白沙 north).
 */
const POS = Object.freeze({
  double_heart: Object.freeze({ x: -320, z:  680 }),   // 雙心石滬 — 七美 southwest
  tianhou:      Object.freeze({ x:  -20, z:   40 }),   // 天后宮 — 馬公市中心
  zhongyang:    Object.freeze({ x:   30, z:   80 }),   // 中央老街 — 馬公市中心
  daguoye:      Object.freeze({ x: -480, z: -320 }),   // 大菓葉玄武岩 — 西嶼
  lighthouse:   Object.freeze({ x: -580, z: -440 }),   // 漁翁島燈塔 — 西嶼最西端
  erkan:        Object.freeze({ x: -420, z: -180 }),   // 二崁聚落 — 西嶼
  whale:        Object.freeze({ x:  180, z: -380 }),   // 鯨魚洞 — 小門嶼
  fenggui:      Object.freeze({ x: -180, z:  350 }),   // 風櫃洞 — 馬公南方
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Penghu landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Penghu curated landmark singletons (frozen P6b). */
const CODE_DOUBLE_HEART = 82;
const CODE_TIANHOU      = 83;
const CODE_ZHONGYANG    = 84;
const CODE_DAGUOYE      = 85;
const CODE_LIGHTHOUSE   = 86;
const CODE_ERKAN        = 87;
const CODE_WHALE        = 88;
const CODE_FENGGUI      = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 跨海大橋 goal (strictly increasing */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Penghu landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  雙心石滬       dioramaR  15 → absorbable @  23.1 m
 *   L1  澎湖天后宮     dioramaR  25 → absorbable @  38.5 m
 *   L2  中央老街       dioramaR  40 → absorbable @  61.5 m
 *   L3  大菓葉玄武岩   dioramaR  60 → absorbable @  92.3 m
 *   L4  漁翁島燈塔     dioramaR  80 → absorbable @ 123.1 m
 *   L5  二崁聚落       dioramaR 110 → absorbable @ 169.2 m
 *   L6  鯨魚洞         dioramaR 150 → absorbable @ 230.8 m
 *   L7  風櫃洞         dioramaR 190 → absorbable @ 292.3 m
 *   L8  跨海大橋(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_DOUBLE_HEART.landmarkId,  // 0
    name: NM_DOUBLE_HEART.name,
    nameJa: NM_DOUBLE_HEART.name,            // nameJa alias for curated.js compat
    x: POS.double_heart.x,  z: POS.double_heart.z,
    dioramaR: 15,
    collisionScale: 1.0,
    sizeReal: 50,
    archetypeCode: CODE_DOUBLE_HEART,
    naturalBand: 3,
    colorHex: NM_DOUBLE_HEART.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TIANHOU.landmarkId,       // 1
    name: NM_TIANHOU.name,
    nameJa: NM_TIANHOU.name,
    x: POS.tianhou.x, z: POS.tianhou.z,
    dioramaR: 25,
    collisionScale: 0.9,
    sizeReal: 45,
    archetypeCode: CODE_TIANHOU,
    naturalBand: 3,
    colorHex: NM_TIANHOU.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ZHONGYANG.landmarkId,     // 2
    name: NM_ZHONGYANG.name,
    nameJa: NM_ZHONGYANG.name,
    x: POS.zhongyang.x, z: POS.zhongyang.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 60,
    archetypeCode: CODE_ZHONGYANG,
    naturalBand: 3,
    colorHex: NM_ZHONGYANG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DAGUOYE.landmarkId,       // 3
    name: NM_DAGUOYE.name,
    nameJa: NM_DAGUOYE.name,
    x: POS.daguoye.x, z: POS.daguoye.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 80,
    archetypeCode: CODE_DAGUOYE,
    naturalBand: 4,
    colorHex: NM_DAGUOYE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LIGHTHOUSE.landmarkId,    // 4
    name: NM_LIGHTHOUSE.name,
    nameJa: NM_LIGHTHOUSE.name,
    x: POS.lighthouse.x, z: POS.lighthouse.z,
    dioramaR: 80,
    collisionScale: 0.7,
    sizeReal: 40,
    archetypeCode: CODE_LIGHTHOUSE,
    naturalBand: 4,
    colorHex: NM_LIGHTHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ERKAN.landmarkId,         // 5
    name: NM_ERKAN.name,
    nameJa: NM_ERKAN.name,
    x: POS.erkan.x, z: POS.erkan.z,
    dioramaR: 110,
    collisionScale: 0.8,
    sizeReal: 150,
    archetypeCode: CODE_ERKAN,
    naturalBand: 5,
    colorHex: NM_ERKAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_WHALE.landmarkId,         // 6
    name: NM_WHALE.name,
    nameJa: NM_WHALE.name,
    x: POS.whale.x, z: POS.whale.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 100,
    archetypeCode: CODE_WHALE,
    naturalBand: 5,
    colorHex: NM_WHALE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_FENGGUI.landmarkId,       // 7
    name: NM_FENGGUI.name,
    nameJa: NM_FENGGUI.name,
    x: POS.fenggui.x, z: POS.fenggui.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 120,
    archetypeCode: CODE_FENGGUI,
    naturalBand: 5,
    colorHex: NM_FENGGUI.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CROSS_SEA_BRIDGE.landmarkId, // 8 — GOAL
    name: NM_CROSS_SEA_BRIDGE.name,
    nameJa: NM_CROSS_SEA_BRIDGE.name,
    x: CROSS_SEA_BRIDGE_POS.x, z: CROSS_SEA_BRIDGE_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 2494,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xeef0f4,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Penghu landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Penghu: starts with the full cityData base set,
 * then appends the 8 Penghu landmark singleton placements. The 跨海大橋 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _PENGHU_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 Penghu landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._PENGHU_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 澎湖灣 sea definition for the Penghu pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 馬公商圈, +X east, +Z south).
 *
 * A 5-point centerline + width (250 m) traces the sea's presence around
 * the islands, representing the 澎湖內海 (inner sea between islands).
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and the 跨海大橋 goal (749,-252) — every point is at
 * z ≤ -500 (north of the play area / goal).
 *
 * color: deep turquoise blue (澎湖 is known for crystal-clear water),
 * evoking the characteristic clear ocean surrounding the islands.
 * yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '澎湖灣',
  color: 0x2a6878,
  yM: 0.3,
  width: 250,
  centerline: Object.freeze([
    Object.freeze({ x: -600, z: -700 }),
    Object.freeze({ x:  100, z: -680 }),
    Object.freeze({ x:  600, z: -620 }),
    Object.freeze({ x: 1100, z: -500 }),
    Object.freeze({ x: 1400, z: -300 }),
  ]),
});

/* ================================================================== */
/* Overrides (same as P6a)                                            */
/* ================================================================== */

/**
 * Goal monument real-meter position (跨海大橋 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = CROSS_SEA_BRIDGE_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Penghu ladder keys: shop / night-market / arcade / scooter-sea /
 * fishing-village / basalt / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 馬公商圈 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 漁港夜市 night-market strip (south quadrant). */
  'night-market': Object.freeze({ x: 60,   z: 80,    r: 0.5  }),
  /** 馬公市區 arcade / commercial district. */
  arcade:      Object.freeze({ x: 40,   z: 60,    r: 3    }),
  /** 機車海 scooter-sea band (mid-map density ramp). */
  'scooter-sea': Object.freeze({ x: 100,  z: 200,   r: 30   }),
  /** 漁村 fishing village district (mid-radius). */
  'fishing-village': Object.freeze({ x: -350, z: 400,   r: 120  }),
  /** 玄武岩海岸 basalt coast (approach zone near goal). */
  basalt:      Object.freeze({ x: 500,  z: -350,  r: 300  }),
  /** Near the 跨海大橋 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -280,  r: 400  }),
});
