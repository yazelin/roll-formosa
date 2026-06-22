/**
 * @file cityMap.js — Taipei pack cityMap (P6b).
 *
 * P6b: introduces native Taipei LANDMARKS (8 curated singletons + 101 goal).
 * The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Taipei 9 entries (8 curated + 101 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Taipei landmark placements
 *   - GOAL_POS    → TAIPEI101_POS (same as P6a)
 *   - DEV_STARTS  → Taipei-themed teleport keys (same as P6a)
 */

import { TAIPEI101_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_SWORD_LION } from './landmarks/anping_sword_lion.js';
import { NM_CHIHKAN } from './landmarks/chihkan_tower.js';
import { NM_CONFUCIUS } from './landmarks/tainan_confucius.js';
import { NM_WU_TEMPLE } from './landmarks/wu_temple.js';
import { NM_ANPING_FORT } from './landmarks/anping_fort.js';
import { NM_GOLDEN_CASTLE } from './landmarks/golden_castle.js';
import { NM_LIT_MUSEUM } from './landmarks/literature_museum.js';
import { NM_CHIMEI } from './landmarks/chimei_museum.js';
import { NM_HAYASHI } from './landmarks/hayashi_dept.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Taipei landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Taipei landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Taipei landmarks.
 * Convention (same as the base layout POS): origin = ball start (迪化街 shop entrance),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, mimicking actual Taipei
 * geography (萬華/西門 west; 圓山 north; 中正紀念堂/自由廣場 south-central;
 * 小巨蛋 east; 信義 east-south for 101).
 */
const POS = Object.freeze({
  beimen:       Object.freeze({ x:  -15, z:   30 }),   // 北門 — just outside the shop district
  longshan:     Object.freeze({ x: -280, z:  560 }),   // 龍山寺 — 萬華 district west
  ximen:        Object.freeze({ x: -180, z:  200 }),   // 西門紅樓 — 西門町 district
  grand_hotel:  Object.freeze({ x:  120, z: -520 }),   // 圓山大飯店 — northern hill
  presidential: Object.freeze({ x:  -80, z:  -40 }),   // 總統府 — 凱達格蘭大道 core
  cks_memorial: Object.freeze({ x:   80, z:  350 }),   // 中正紀念堂 — 中山南路
  liberty_arch: Object.freeze({ x:   60, z:  420 }),   // 自由廣場牌樓 — adjacent to CKS
  arena:        Object.freeze({ x:  340, z: -280 }),   // 小巨蛋 — 松山 district east
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Taipei landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Taipei curated landmark singletons (frozen P6b). */
const CODE_BEIMEN       = 82;
const CODE_LONGSHAN     = 83;
const CODE_XIMEN        = 84;
const CODE_GRAND_HOTEL  = 85;
const CODE_PRESIDENTIAL = 86;
const CODE_CKS          = 87;
const CODE_LIBERTY_ARCH = 88;
const CODE_ARENA        = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 101 goal (strictly increasing   */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Taipei landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  北門(承恩門)   dioramaR  11 → absorbable @  16.9 m
 *   L1  龍山寺         dioramaR  28 → absorbable @  43.1 m
 *   L2  西門紅樓       dioramaR  40 → absorbable @  61.5 m
 *   L3  圓山大飯店     dioramaR  60 → absorbable @  92.3 m
 *   L4  總統府         dioramaR  85 → absorbable @ 130.8 m
 *   L5  中正紀念堂     dioramaR 115 → absorbable @ 176.9 m
 *   L6  自由廣場牌樓   dioramaR 150 → absorbable @ 230.8 m
 *   L7  小巨蛋         dioramaR 190 → absorbable @ 292.3 m
 *   L8  台北101(goal)  dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_SWORD_LION.landmarkId,       // 0
    name: NM_SWORD_LION.name,
    nameJa: NM_SWORD_LION.name,                 // nameJa alias for curated.js compat
    x: POS.beimen.x,  z: POS.beimen.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 13,
    archetypeCode: CODE_BEIMEN,
    naturalBand: 3,
    colorHex: NM_SWORD_LION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CHIHKAN.landmarkId,     // 1
    name: NM_CHIHKAN.name,
    nameJa: NM_CHIHKAN.name,
    x: POS.longshan.x, z: POS.longshan.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 56,
    archetypeCode: CODE_LONGSHAN,
    naturalBand: 3,
    colorHex: NM_CHIHKAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CONFUCIUS.landmarkId,        // 2
    name: NM_CONFUCIUS.name,
    nameJa: NM_CONFUCIUS.name,
    x: POS.ximen.x, z: POS.ximen.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 48,
    archetypeCode: CODE_XIMEN,
    naturalBand: 3,
    colorHex: NM_CONFUCIUS.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_WU_TEMPLE.landmarkId,  // 3
    name: NM_WU_TEMPLE.name,
    nameJa: NM_WU_TEMPLE.name,
    x: POS.grand_hotel.x, z: POS.grand_hotel.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 110,
    archetypeCode: CODE_GRAND_HOTEL,
    naturalBand: 4,
    colorHex: NM_WU_TEMPLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ANPING_FORT.landmarkId, // 4
    name: NM_ANPING_FORT.name,
    nameJa: NM_ANPING_FORT.name,
    x: POS.presidential.x, z: POS.presidential.z,
    dioramaR: 85,
    collisionScale: 0.7,
    sizeReal: 140,
    archetypeCode: CODE_PRESIDENTIAL,
    naturalBand: 4,
    colorHex: NM_ANPING_FORT.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_GOLDEN_CASTLE.landmarkId,          // 5
    name: NM_GOLDEN_CASTLE.name,
    nameJa: NM_GOLDEN_CASTLE.name,
    x: POS.cks_memorial.x, z: POS.cks_memorial.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 200,
    archetypeCode: CODE_CKS,
    naturalBand: 5,
    colorHex: NM_GOLDEN_CASTLE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LIT_MUSEUM.landmarkId, // 6
    name: NM_LIT_MUSEUM.name,
    nameJa: NM_LIT_MUSEUM.name,
    x: POS.liberty_arch.x, z: POS.liberty_arch.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 250,
    archetypeCode: CODE_LIBERTY_ARCH,
    naturalBand: 5,
    colorHex: NM_LIT_MUSEUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CHIMEI.landmarkId,        // 7
    name: NM_CHIMEI.name,
    nameJa: NM_CHIMEI.name,
    x: POS.arena.x, z: POS.arena.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_ARENA,
    naturalBand: 5,
    colorHex: NM_CHIMEI.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_HAYASHI.landmarkId,    // 8 — GOAL
    name: NM_HAYASHI.name,
    nameJa: NM_HAYASHI.name,
    x: TAIPEI101_POS.x, z: TAIPEI101_POS.z,
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
/* PLACEMENTS — cityData base placements + 8 Taipei landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Taipei: starts with the full cityData base set,
 * then appends the 8 Taipei landmark singleton placements. The 101 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _TAIPEI_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 Taipei landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._TAIPEI_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 安平運河 river definition for the Tainan pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start, +X east, +Z south).
 *
 * A west→inland canal: anchored at the far-west edge (安平港 direction) and
 * curving east-southeast toward the city core, as a smooth ribbon (consumed by
 * environment.js via ribbonQuads). Distinct from 台北 基隆河's northern arc.
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * clears the shop start (0,0) and the goal (749,-252) — closest approach ~640 m.
 *
 * color: brackish canal green; yM: 0.3 m above ground (hides the seam).
 */
export const water = Object.freeze({
  name: '安平運河',
  color: 0x3a5a52,
  yM: 0.3,
  width: 110,
  centerline: Object.freeze([
    Object.freeze({ x: -1700, z: 200 }),
    Object.freeze({ x: -1100, z: 400 }),
    Object.freeze({ x:  -500, z: 560 }),
    Object.freeze({ x:   100, z: 640 }),
    Object.freeze({ x:   650, z: 600 }),
  ]),
});

/* ================================================================== */
/* Overrides (same as P6a)                                            */
/* ================================================================== */

/**
 * Goal monument real-meter position (台北101 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = TAIPEI101_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Taipei ladder keys: shop / night-market / arcade / scooter-sea /
 * wanhua / xinyi / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 迪化街 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 饒河街夜市 night-market strip (east quadrant). */
  'night-market': Object.freeze({ x: 60,   z: -80,   r: 0.5  }),
  /** 西門町 arcade / 娛樂街 district. */
  arcade:      Object.freeze({ x: -180, z: 120,   r: 3    }),
  /** 機車海 scooter-sea band (mid-map density ramp). */
  'scooter-sea': Object.freeze({ x: 100,  z: 300,   r: 30   }),
  /** 萬華 / 龍山寺 district (mid-radius). */
  wanhua:      Object.freeze({ x: -350, z: 600,   r: 120  }),
  /** 信義計畫區 Xinyi CBD (approach zone near 101). */
  xinyi:       Object.freeze({ x: 500,  z: -350,  r: 300  }),
  /** Near the 台北101 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -400,  r: 400  }),
});
