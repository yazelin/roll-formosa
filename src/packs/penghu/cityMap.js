/**
 * @file cityMap.js — Penghu pack cityMap.
 *
 * Native Penghu LANDMARKS (8 curated core singletons + 跨海大橋 goal), wired
 * into PLACEMENTS so they spawn in the world and can be absorbed as the ball
 * grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js (neutral street layout — reused verbatim).
 *
 * Override list:
 *   - LANDMARKS   → native Penghu 9 entries (8 core + 跨海大橋 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Penghu landmark placements
 *   - GOAL_POS    → CROSSSEABRIDGE_POS
 *   - DEV_STARTS  → Penghu-themed teleport keys
 *   - water       → 馬公灣 (Magong Bay) water definition
 */

import { CROSSSEABRIDGE_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated core landmark geometry descriptors for position/color/name.
import { NM_BEIMEN as NM_DOUBLE_HEART } from './landmarks/beimen.js';
import { NM_LONGSHAN as NM_TIANHOU } from './landmarks/longshan.js';
import { NM_XIMEN as NM_BASALT } from './landmarks/ximen.js';
import { NM_GRAND_HOTEL as NM_WHALE_CAVE } from './landmarks/grand_hotel.js';
import { NM_PRESIDENTIAL as NM_SIYU_LIGHTHOUSE } from './landmarks/presidential.js';
import { NM_CKS as NM_ZHONGYANG } from './landmarks/cks_memorial.js';
import { NM_LIBERTY_ARCH as NM_GUANYINTING } from './landmarks/liberty_arch.js';
import { NM_ARENA as NM_AIRPORT } from './landmarks/arena.js';
import { NM_CROSS_SEA_BRIDGE } from './landmarks/taipei101.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Penghu core landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Penghu landmark positions (game-meter, origin = ball start)         */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Penghu core
 * landmarks. Convention (same as the base layout POS): origin = ball start
 * (馬公 shop entrance), +X east, +Z south. Positions are spread progressively —
 * smaller landmarks closer, larger landmarks farther along the roll, loosely
 * echoing 澎湖 geography (馬公/天后宮 core; 西嶼 west; 七美/南海 south).
 *
 * Coords reuse the neutral street layout from the taipei template (they sit
 * inside MAP_BOUNDS and clear the shop + goal) — only the keys/comments change.
 */
const POS = Object.freeze({
  double_heart:    Object.freeze({ x:  -15, z:   30 }),   // 雙心石滬 — just outside the shop core
  tianhou:         Object.freeze({ x: -280, z:  560 }),   // 天后宮 — 馬公市區 west
  basalt:          Object.freeze({ x: -180, z:  200 }),   // 大菓葉玄武岩 — 西嶼
  whale_cave:      Object.freeze({ x:  120, z: -520 }),   // 鯨魚洞 — 小門嶼 north
  siyu_lighthouse: Object.freeze({ x:  -80, z:  -40 }),   // 西嶼燈塔 — 西嶼西端
  zhongyang:       Object.freeze({ x:   80, z:  350 }),   // 中央老街 — 馬公中心
  guanyinting:     Object.freeze({ x:   60, z:  420 }),   // 觀音亭 — 海濱
  airport:         Object.freeze({ x:  340, z: -280 }),   // 澎湖機場 — 東側
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Penghu landmarks)    */
/* ================================================================== */
/** EXTRA codes for the 8 Penghu curated core landmark singletons (frozen). */
const CODE_DOUBLE_HEART    = 82;
const CODE_TIANHOU         = 83;
const CODE_BASALT          = 84;
const CODE_WHALE_CAVE      = 85;
const CODE_SIYU_LIGHTHOUSE = 86;
const CODE_ZHONGYANG       = 87;
const CODE_GUANYINTING     = 88;
const CODE_AIRPORT         = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 core + 跨海大橋 goal (strictly increasing  */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Penghu landmark defs, in strictly-increasing dioramaR order
 * (= landmarkId order). absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR = each landmark file's dioramaRHint — monotone):
 *   L0  雙心石滬        dioramaR  11 → absorbable @  16.9 m
 *   L1  天后宮          dioramaR  28 → absorbable @  43.1 m
 *   L2  大菓葉玄武岩    dioramaR  40 → absorbable @  61.5 m
 *   L3  鯨魚洞          dioramaR  60 → absorbable @  92.3 m
 *   L4  西嶼燈塔        dioramaR  85 → absorbable @ 130.8 m
 *   L5  中央老街        dioramaR 115 → absorbable @ 176.9 m
 *   L6  觀音亭          dioramaR 150 → absorbable @ 230.8 m
 *   L7  澎湖機場        dioramaR 190 → absorbable @ 292.3 m
 *   L8  跨海大橋(goal)  dioramaR 280 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: 0,
    name: NM_DOUBLE_HEART.name,
    nameJa: NM_DOUBLE_HEART.name,          // nameJa alias for curated.js compat
    x: POS.double_heart.x,  z: POS.double_heart.z,
    dioramaR: 11,
    collisionScale: 1.0,
    sizeReal: 13,
    archetypeCode: CODE_DOUBLE_HEART,
    naturalBand: 3,
    colorHex: NM_DOUBLE_HEART.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 1,
    name: NM_TIANHOU.name,
    nameJa: NM_TIANHOU.name,
    x: POS.tianhou.x, z: POS.tianhou.z,
    dioramaR: 28,
    collisionScale: 0.9,
    sizeReal: 56,
    archetypeCode: CODE_TIANHOU,
    naturalBand: 3,
    colorHex: NM_TIANHOU.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 2,
    name: NM_BASALT.name,
    nameJa: NM_BASALT.name,
    x: POS.basalt.x, z: POS.basalt.z,
    dioramaR: 40,
    collisionScale: 0.9,
    sizeReal: 48,
    archetypeCode: CODE_BASALT,
    naturalBand: 3,
    colorHex: NM_BASALT.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 3,
    name: NM_WHALE_CAVE.name,
    nameJa: NM_WHALE_CAVE.name,
    x: POS.whale_cave.x, z: POS.whale_cave.z,
    dioramaR: 60,
    collisionScale: 0.9,
    sizeReal: 110,
    archetypeCode: CODE_WHALE_CAVE,
    naturalBand: 4,
    colorHex: NM_WHALE_CAVE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 4,
    name: NM_SIYU_LIGHTHOUSE.name,
    nameJa: NM_SIYU_LIGHTHOUSE.name,
    x: POS.siyu_lighthouse.x, z: POS.siyu_lighthouse.z,
    dioramaR: 85,
    collisionScale: 0.7,
    sizeReal: 140,
    archetypeCode: CODE_SIYU_LIGHTHOUSE,
    naturalBand: 4,
    colorHex: NM_SIYU_LIGHTHOUSE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 5,
    name: NM_ZHONGYANG.name,
    nameJa: NM_ZHONGYANG.name,
    x: POS.zhongyang.x, z: POS.zhongyang.z,
    dioramaR: 115,
    collisionScale: 0.8,
    sizeReal: 200,
    archetypeCode: CODE_ZHONGYANG,
    naturalBand: 5,
    colorHex: NM_ZHONGYANG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 6,
    name: NM_GUANYINTING.name,
    nameJa: NM_GUANYINTING.name,
    x: POS.guanyinting.x, z: POS.guanyinting.z,
    dioramaR: 150,
    collisionScale: 0.7,
    sizeReal: 250,
    archetypeCode: CODE_GUANYINTING,
    naturalBand: 5,
    colorHex: NM_GUANYINTING.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 7,
    name: NM_AIRPORT.name,
    nameJa: NM_AIRPORT.name,
    x: POS.airport.x, z: POS.airport.z,
    dioramaR: 190,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_AIRPORT,
    naturalBand: 5,
    colorHex: NM_AIRPORT.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8,    // 8 — GOAL
    name: NM_CROSS_SEA_BRIDGE.name,
    nameJa: NM_CROSS_SEA_BRIDGE.name,
    x: CROSSSEABRIDGE_POS.x, z: CROSSSEABRIDGE_POS.z,
    dioramaR: 280,
    collisionScale: 0.5,
    sizeReal: 300,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: NM_CROSS_SEA_BRIDGE.colorHex,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Penghu landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Penghu: starts with the full cityData base set,
 * then appends the 8 Penghu core landmark singleton placements. The 跨海大橋
 * goal is rendered by goalTower.js (code 93 = display-name-only slot, never
 * spawned from PLACEMENTS).
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
// 82..98 were dropped at bake time. Append the 8 Penghu core landmark
// singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._PENGHU_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 馬公灣 (Magong Bay) definition for the Penghu pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start / 馬公 shop, +X east, +Z south).
 *
 * A 6-point centerline + width (180 m) traces the bay's gentle curve through
 * the map as a smooth ribbon (consumed by environment.js via ribbonQuads).
 * The bay wraps around the west and south of the play area.
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000) and
 * every point keeps x ≤ -300 (well west of the shop start and goal column).
 *
 * color: bright turquoise (澎湖's famous clear ocean water).
 * yM: 0.3 m above ground (hides the ground seam).
 */
export const water = Object.freeze({
  name: '馬公灣',
  color: 0x2a8a9e,
  yM: 0.3,
  width: 180,
  centerline: Object.freeze([
    Object.freeze({ x: -700, z: -800 }),
    Object.freeze({ x: -600, z: -400 }),
    Object.freeze({ x: -550, z:    0 }),
    Object.freeze({ x: -500, z:  400 }),
    Object.freeze({ x: -600, z:  800 }),
    Object.freeze({ x: -750, z: 1200 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                          */
/* ================================================================== */

/**
 * Goal monument real-meter position (跨海大橋 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = CROSSSEABRIDGE_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Penghu ladder keys: shop / seafood-market / harbor / magong /
 * port-area / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 馬公 shop — the base 'shop' start. */
  shop:          Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 海鮮攤 seafood market strip. */
  'seafood-market': Object.freeze({ x: 60,   z: -80,   r: 0.5  }),
  /** 漁港碼頭 harbor area. */
  harbor:        Object.freeze({ x: 100,  z: 300,   r: 30   }),
  /** 馬公街區 downtown. */
  magong:        Object.freeze({ x: -300, z: 540,   r: 120  }),
  /** 漁港商區 commercial port area. */
  'port-area':   Object.freeze({ x: 500,  z: -350,  r: 300  }),
  /** Near the 跨海大橋 goal monument. */
  goal:          Object.freeze({ x: 700,  z: -400,  r: 400  }),
});
