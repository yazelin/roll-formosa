/**
 * @file cityMap.js — Taipei pack cityMap (P6b).
 *
 * P6b: introduces native Taipei LANDMARKS (8 curated singletons + 101 goal)
 * replacing the Tokyo landmark stub. The 8 curated landmarks are wired into
 * PLACEMENTS so they spawn in the world and can be absorbed as the ball grows.
 *
 * Everything else (SHOP, PLACEMENTS body, ZONES, COLLECTIBLES, COLLECTIBLE_IDS,
 * bandAllowedAt, validateCityMap, MAP_BOUNDS, …) still re-exports from the
 * Tokyo city map — these will be replaced in future passes.
 *
 * Override list:
 *   - LANDMARKS   → native Taipei 9 entries (8 curated + 101 goal)
 *   - PLACEMENTS  → Tokyo PLACEMENTS + the 8 Taipei landmark placements appended
 *   - SKYTREE_POS → TAIPEI101_POS (same as P6a)
 *   - DEV_STARTS  → Taipei-themed teleport keys (same as P6a)
 */

import { TAIPEI101_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_BEIMEN } from './landmarks/beimen.js';
import { NM_LONGSHAN } from './landmarks/longshan.js';
import { NM_XIMEN } from './landmarks/ximen.js';
import { NM_GRAND_HOTEL } from './landmarks/grand_hotel.js';
import { NM_PRESIDENTIAL } from './landmarks/presidential.js';
import { NM_CKS } from './landmarks/cks_memorial.js';
import { NM_LIBERTY_ARCH } from './landmarks/liberty_arch.js';
import { NM_ARENA } from './landmarks/arena.js';
import { NM_TAIPEI101 } from './landmarks/taipei101.js';

// Re-export everything from the Tokyo city map that we do NOT override.
export {
  SHOP,
  MAP_BOUNDS,
  ZONES,
  bandAllowedAt,
  COLLECTIBLES,
  COLLECTIBLE_IDS,
  validateCityMap,
  EXTRA_CODE_BASE,
  CODE_SHOP_SHELL,
} from '../../config/cityMap.js';

// Import Tokyo PLACEMENTS as a base (we append Taipei landmark placements).
import { PLACEMENTS as _TOKYO_PLACEMENTS } from '../../config/cityMap.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Taipei landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Taipei landmarks.
 * Convention (same as Tokyo POS): origin = ball start (迪化街 shop entrance),
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
    landmarkId: NM_BEIMEN.landmarkId,       // 0
    name: NM_BEIMEN.name,
    nameJa: NM_BEIMEN.name,                 // nameJa alias for curated.js compat
    x: POS.beimen.x,  z: POS.beimen.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 13,
    archetypeCode: CODE_BEIMEN,
    naturalBand: 3,
    colorHex: NM_BEIMEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LONGSHAN.landmarkId,     // 1
    name: NM_LONGSHAN.name,
    nameJa: NM_LONGSHAN.name,
    x: POS.longshan.x, z: POS.longshan.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 56,
    archetypeCode: CODE_LONGSHAN,
    naturalBand: 3,
    colorHex: NM_LONGSHAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_XIMEN.landmarkId,        // 2
    name: NM_XIMEN.name,
    nameJa: NM_XIMEN.name,
    x: POS.ximen.x, z: POS.ximen.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 48,
    archetypeCode: CODE_XIMEN,
    naturalBand: 3,
    colorHex: NM_XIMEN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_GRAND_HOTEL.landmarkId,  // 3
    name: NM_GRAND_HOTEL.name,
    nameJa: NM_GRAND_HOTEL.name,
    x: POS.grand_hotel.x, z: POS.grand_hotel.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 110,
    archetypeCode: CODE_GRAND_HOTEL,
    naturalBand: 4,
    colorHex: NM_GRAND_HOTEL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_PRESIDENTIAL.landmarkId, // 4
    name: NM_PRESIDENTIAL.name,
    nameJa: NM_PRESIDENTIAL.name,
    x: POS.presidential.x, z: POS.presidential.z,
    dioramaR: 85,
    collisionScale: 0.7,
    sizeReal: 140,
    archetypeCode: CODE_PRESIDENTIAL,
    naturalBand: 4,
    colorHex: NM_PRESIDENTIAL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CKS.landmarkId,          // 5
    name: NM_CKS.name,
    nameJa: NM_CKS.name,
    x: POS.cks_memorial.x, z: POS.cks_memorial.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 200,
    archetypeCode: CODE_CKS,
    naturalBand: 5,
    colorHex: NM_CKS.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_LIBERTY_ARCH.landmarkId, // 6
    name: NM_LIBERTY_ARCH.name,
    nameJa: NM_LIBERTY_ARCH.name,
    x: POS.liberty_arch.x, z: POS.liberty_arch.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 250,
    archetypeCode: CODE_LIBERTY_ARCH,
    naturalBand: 5,
    colorHex: NM_LIBERTY_ARCH.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ARENA.landmarkId,        // 7
    name: NM_ARENA.name,
    nameJa: NM_ARENA.name,
    x: POS.arena.x, z: POS.arena.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_ARENA,
    naturalBand: 5,
    colorHex: NM_ARENA.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TAIPEI101.landmarkId,    // 8 — GOAL
    name: NM_TAIPEI101.name,
    nameJa: NM_TAIPEI101.name,
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
/* PLACEMENTS — Tokyo placements + 8 Taipei landmark singletons        */
/* ================================================================== */

/**
 * Curated placements for Taipei: starts with the full Tokyo authored set,
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

export const PLACEMENTS = [..._TOKYO_PLACEMENTS, ..._TAIPEI_LANDMARK_PLACEMENTS];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 基隆河 river definition for the Taipei pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 迪化街 shop, +X east, +Z south).
 *
 * Two rects approximate the river's north-to-east arc:
 *   - north band  x[-200, 1400]  z[-700, -550]  (main east-west stretch)
 *   - east leg    x[1200, 1400]  z[-700, -200]  (northeastern bend turning south)
 *
 * Both rects stay within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and clear
 * the shop start (0,0) and the 101 goal (749,-252) — the east leg ends at
 * z=-200 (north of the goal) and the goal is at x=749 (west of x=1200).
 *
 * color: slightly greenish-muddy blue (siltier than open-sea 0x2a4a6e),
 * evoking the river's characteristic turbid look.
 * yM: 0.3 m above ground (same as the old Tokyo Bay — hides the seam).
 */
export const water = Object.freeze({
  name: '基隆河',
  color: 0x3a5a52,
  yM: 0.3,
  rects: Object.freeze([
    Object.freeze({ x0: -200, x1: 1400, z0: -700, z1: -550 }),  // north band
    Object.freeze({ x0: 1200, x1: 1400, z0: -700, z1: -200 }),  // east leg (bend)
  ]),
});

/* ================================================================== */
/* Overrides (same as P6a)                                            */
/* ================================================================== */

/**
 * Goal monument real-meter position (same as P6a — Skytree world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use SKYTREE_POS).
 */
export const SKYTREE_POS = TAIPEI101_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Taipei ladder keys: shop / night-market / arcade / scooter-sea /
 * wanhua / xinyi / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 迪化街 shop — identical to Tokyo 'shop'. */
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
