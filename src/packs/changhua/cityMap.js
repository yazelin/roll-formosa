/**
 * @file cityMap.js — Changhua pack cityMap (P6b).
 *
 * P6b: introduces native Changhua LANDMARKS (8 curated singletons + goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Changhua 9 entries (8 curated + goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Changhua landmark placements
 *   - GOAL_POS    → BAGUASHAN_BUDDHA_POS
 *   - DEV_STARTS  → Changhua-themed teleport keys
 */

import { BAGUASHAN_BUDDHA_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_LUKANG_LONGSHAN } from './landmarks/lukang_longshan.js';
import { NM_LUKANG_TIANHOU } from './landmarks/lukang_tianhou.js';
import { NM_ROUNDHOUSE } from './landmarks/roundhouse.js';
import { NM_CHANGHUA_CONFUCIUS } from './landmarks/changhua_confucius.js';
import { NM_MORUXIANG } from './landmarks/moruxiang.js';
import { NM_JIUQUXIANG } from './landmarks/jiuquxiang.js';
import { NM_GLASS_TEMPLE } from './landmarks/glass_temple.js';
import { NM_WANGGONG_LIGHTHOUSE } from './landmarks/wanggong_lighthouse.js';
import { NM_BAGUASHAN_BUDDHA } from './landmarks/baguashan_buddha.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Changhua landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Changhua landmark positions (game-meter, origin = ball start)       */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Changhua landmarks.
 * Convention (same as the base layout POS): origin = ball start (鹿港老街 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Changhua
 * geography (鹿港 west coast; 彰化市 central; 王功 southwest coast;
 * 八卦山 east for the goal).
 */
const POS = Object.freeze({
  moruxiang:        Object.freeze({ x:  -20, z:   35 }),   // 摸乳巷 — narrow alley in Lukang
  jiuquxiang:       Object.freeze({ x:  -35, z:   80 }),   // 九曲巷 — winding alley in Lukang
  lukang_longshan:  Object.freeze({ x: -120, z:  200 }),   // 鹿港龍山寺 — historic temple
  lukang_tianhou:   Object.freeze({ x: -180, z:  150 }),   // 鹿港天后宮 — Mazu temple
  roundhouse:       Object.freeze({ x:  280, z:  -80 }),   // 扇形車庫 — fan-shaped depot
  changhua_confucius: Object.freeze({ x: 150, z:  250 }), // 彰化孔廟 — Confucius temple
  glass_temple:     Object.freeze({ x: -380, z:  480 }),   // 玻璃廟 — glass temple in Lugang
  wanggong_lighthouse: Object.freeze({ x: -520, z: 620 }), // 王功燈塔 — coastal lighthouse
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Changhua landmarks)  */
/* ================================================================== */
/** EXTRA codes for the 8 Changhua curated landmark singletons (frozen P6b). */
const CODE_LUKANG_LONGSHAN    = 82;
const CODE_LUKANG_TIANHOU     = 83;
const CODE_ROUNDHOUSE         = 84;
const CODE_CHANGHUA_CONFUCIUS = 85;
const CODE_MORUXIANG          = 86;
const CODE_JIUQUXIANG         = 87;
const CODE_GLASS_TEMPLE       = 88;
const CODE_WANGGONG_LIGHTHOUSE = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + goal (strictly increasing        */
/* dioramaR in array order, goal last with isGoal:true)                */
/* ================================================================== */

/**
 * Changhua landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  摸乳巷           dioramaR   8 → absorbable @  12.3 m
 *   L1  九曲巷           dioramaR  12 → absorbable @  18.5 m
 *   L2  鹿港龍山寺       dioramaR  25 → absorbable @  38.5 m
 *   L3  鹿港天后宮       dioramaR  30 → absorbable @  46.2 m
 *   L4  扇形車庫         dioramaR  55 → absorbable @  84.6 m
 *   L5  彰化孔廟         dioramaR  70 → absorbable @ 107.7 m
 *   L6  玻璃廟           dioramaR 100 → absorbable @ 153.8 m
 *   L7  王功燈塔         dioramaR 140 → absorbable @ 215.4 m
 *   L8  八卦山大佛(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_MORUXIANG.landmarkId,        // 0
    name: NM_MORUXIANG.name,
    nameJa: NM_MORUXIANG.name,                  // nameJa alias for curated.js compat
    x: POS.moruxiang.x,  z: POS.moruxiang.z,
    dioramaR: 8,
    collisionScale: 1.0,
    sizeReal: 10,
    archetypeCode: CODE_MORUXIANG,
    naturalBand: 3,
    colorHex: NM_MORUXIANG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_JIUQUXIANG.landmarkId,       // 1
    name: NM_JIUQUXIANG.name,
    nameJa: NM_JIUQUXIANG.name,
    x: POS.jiuquxiang.x, z: POS.jiuquxiang.z,
    dioramaR: 12,
    collisionScale: 0.9,
    sizeReal: 15,
    archetypeCode: CODE_JIUQUXIANG,
    naturalBand: 3,
    colorHex: NM_JIUQUXIANG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LUKANG_LONGSHAN.landmarkId,  // 2
    name: NM_LUKANG_LONGSHAN.name,
    nameJa: NM_LUKANG_LONGSHAN.name,
    x: POS.lukang_longshan.x, z: POS.lukang_longshan.z,
    dioramaR: 25,
    collisionScale: 0.9,
    sizeReal: 45,
    archetypeCode: CODE_LUKANG_LONGSHAN,
    naturalBand: 3,
    colorHex: NM_LUKANG_LONGSHAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LUKANG_TIANHOU.landmarkId,   // 3
    name: NM_LUKANG_TIANHOU.name,
    nameJa: NM_LUKANG_TIANHOU.name,
    x: POS.lukang_tianhou.x, z: POS.lukang_tianhou.z,
    dioramaR: 30,
    collisionScale: 0.9,
    sizeReal: 50,
    archetypeCode: CODE_LUKANG_TIANHOU,
    naturalBand: 3,
    colorHex: NM_LUKANG_TIANHOU.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ROUNDHOUSE.landmarkId,       // 4
    name: NM_ROUNDHOUSE.name,
    nameJa: NM_ROUNDHOUSE.name,
    x: POS.roundhouse.x, z: POS.roundhouse.z,
    dioramaR: 55,
    collisionScale: 0.8,
    sizeReal: 80,
    archetypeCode: CODE_ROUNDHOUSE,
    naturalBand: 4,
    colorHex: NM_ROUNDHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CHANGHUA_CONFUCIUS.landmarkId, // 5
    name: NM_CHANGHUA_CONFUCIUS.name,
    nameJa: NM_CHANGHUA_CONFUCIUS.name,
    x: POS.changhua_confucius.x, z: POS.changhua_confucius.z,
    dioramaR: 70,
    collisionScale: 0.8,
    sizeReal: 100,
    archetypeCode: CODE_CHANGHUA_CONFUCIUS,
    naturalBand: 4,
    colorHex: NM_CHANGHUA_CONFUCIUS.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_GLASS_TEMPLE.landmarkId,     // 6
    name: NM_GLASS_TEMPLE.name,
    nameJa: NM_GLASS_TEMPLE.name,
    x: POS.glass_temple.x, z: POS.glass_temple.z,
    dioramaR: 100,
    collisionScale: 0.7,
    sizeReal: 130,
    archetypeCode: CODE_GLASS_TEMPLE,
    naturalBand: 5,
    colorHex: NM_GLASS_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_WANGGONG_LIGHTHOUSE.landmarkId, // 7
    name: NM_WANGGONG_LIGHTHOUSE.name,
    nameJa: NM_WANGGONG_LIGHTHOUSE.name,
    x: POS.wanggong_lighthouse.x, z: POS.wanggong_lighthouse.z,
    dioramaR: 140,
    collisionScale: 0.85,
    sizeReal: 180,
    archetypeCode: CODE_WANGGONG_LIGHTHOUSE,
    naturalBand: 5,
    colorHex: NM_WANGGONG_LIGHTHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_BAGUASHAN_BUDDHA.landmarkId, // 8 — GOAL
    name: NM_BAGUASHAN_BUDDHA.name,
    nameJa: NM_BAGUASHAN_BUDDHA.name,
    x: BAGUASHAN_BUDDHA_POS.x, z: BAGUASHAN_BUDDHA_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 508,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xd4a84b,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Changhua landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Changhua: starts with the full cityData base set,
 * then appends the 8 Changhua landmark singleton placements. The goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _CHANGHUA_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 Changhua landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._CHANGHUA_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 濁水溪 river definition for the Changhua pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 鹿港老街 shop, +X east, +Z south).
 *
 * A 5-point centerline + width (180 m) traces the Zhuoshui River's real
 * west→east flow across southern Changhua County. The river forms the
 * southern border between Changhua and Yunlin counties.
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and the goal (680,-320).
 *
 * color: muddy brown-gray (siltier than coastal water), evoking the
 * characteristic turbid look of Taiwan's largest river by discharge.
 * yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '濁水溪',
  color: 0x5a6858,
  yM: 0.3,
  width: 180,
  centerline: Object.freeze([
    Object.freeze({ x: -1600, z: 1400 }),
    Object.freeze({ x:  -800, z: 1350 }),
    Object.freeze({ x:     0, z: 1280 }),
    Object.freeze({ x:   800, z: 1200 }),
    Object.freeze({ x:  1500, z: 1100 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                           */
/* ================================================================== */

/**
 * Goal monument real-meter position (八卦山大佛 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = BAGUASHAN_BUDDHA_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Changhua ladder keys: shop / lukang / roundhouse / tianwei /
 * wanggong / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 鹿港老街 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 鹿港老街 heritage district (west quadrant). */
  lukang:      Object.freeze({ x: -100, z: 100,   r: 0.5  }),
  /** 扇形車庫 fan-shaped roundhouse (east side). */
  roundhouse:  Object.freeze({ x: 280,  z: -80,   r: 30   }),
  /** 田尾公路花園 flower market (mid-map). */
  tianwei:     Object.freeze({ x: 200,  z: 400,   r: 80   }),
  /** 王功漁港 fishing harbor (southwest coast). */
  wanggong:    Object.freeze({ x: -500, z: 600,   r: 150  }),
  /** Near the 八卦山大佛 goal monument. */
  goal:        Object.freeze({ x: 650,  z: -350,  r: 400  }),
});
