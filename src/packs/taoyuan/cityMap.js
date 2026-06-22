/**
 * @file cityMap.js — Taoyuan pack cityMap (P6b).
 *
 * P6b: introduces native Taoyuan LANDMARKS (8 curated singletons + 大溪牌樓 goal).
 * The 8 curated landmarks are wired into PLACEMENTS so they spawn in the world
 * and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) is the pack's own baked, city-agnostic
 * data in ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Taoyuan 9 entries (8 curated + 大溪牌樓 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Taoyuan landmark placements
 *   - GOAL_POS    → DAXI_PAILOU_POS (same monument.js anchor)
 *   - DEV_STARTS  → Taoyuan-themed teleport keys
 *   - water       → 大漢溪 (Dahan River, not 基隆河)
 */

import { DAXI_PAILOU_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated landmark geometry descriptors for position/color/name.
import { NM_DAXI_BRIDGE } from './landmarks/daxi_bridge.js';
import { NM_DAXI_OLDSTREET } from './landmarks/daxi_oldstreet.js';
import { NM_ZHONGLI_STATION } from './landmarks/zhongli_station.js';
import { NM_HUTOUSHAN } from './landmarks/hutoushan.js';
import { NM_CIHU_MAUSOLEUM } from './landmarks/cihu_mausoleum.js';
import { NM_YONGAN_HARBOR } from './landmarks/yongan_harbor.js';
import { NM_TPE_TERMINAL } from './landmarks/tpe_terminal.js';
import { NM_SHIMEN_RESERVOIR } from './landmarks/shimen_reservoir.js';
import { NM_DAXI_PAILOU } from './landmarks/daxi_pailou.js';

// Re-export the pack-owned baked layout (cityData.js). The engine consumes
// SHOP (terrain colliders) + bandAllowedAt (spawn gating); MAP_BOUNDS is the
// engine world bound; ZONES is bandAllowedAt's data.
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements (chunk dressing 0..69 + collectibles
// 70..81 + 媽祖 94) — already filtered at bake time. We append the 8 native
// Taoyuan landmark singletons below.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Taoyuan landmark positions (game-meter, origin = ball start)        */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Taoyuan landmarks.
 * Convention (same as the base layout POS): origin = ball start (start point),
 * +X east, +Z south. Positions are spread progressively — smaller landmarks
 * closer, larger landmarks farther along the roll, reflecting Taoyuan geography
 * (大溪 southeast; 中壢 central; 機場 northwest; 石門水庫 south).
 */
const POS = Object.freeze({
  daxi_bridge:      Object.freeze({ x:  -20, z:   25 }),   // 大溪橋 — near start, small
  daxi_oldstreet:   Object.freeze({ x:   80, z:  150 }),   // 大溪老街 — early game
  zhongli_station:  Object.freeze({ x: -150, z:  280 }),   // 中壢車站 — west-central
  hutoushan:        Object.freeze({ x:  180, z: -180 }),   // 虎頭山 — northeast
  cihu_mausoleum:   Object.freeze({ x:  280, z:  420 }),   // 慈湖陵寢 — southeast (near Daxi)
  yongan_harbor:    Object.freeze({ x: -380, z:  -80 }),   // 永安漁港 — coastal west
  tpe_terminal:     Object.freeze({ x: -280, z: -380 }),   // 桃園機場 — northwest
  shimen_reservoir: Object.freeze({ x:  480, z:  650 }),   // 石門水庫 — far south (largest)
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Taoyuan landmarks)   */
/* ================================================================== */
/** EXTRA codes for the 8 Taoyuan curated landmark singletons (frozen P6b). */
const CODE_DAXI_BRIDGE      = 82;
const CODE_DAXI_OLDSTREET   = 83;
const CODE_ZHONGLI_STATION  = 84;
const CODE_HUTOUSHAN        = 85;
const CODE_CIHU_MAUSOLEUM   = 86;
const CODE_YONGAN_HARBOR    = 87;
const CODE_TPE_TERMINAL     = 88;
const CODE_SHIMEN_RESERVOIR = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 大溪牌樓 goal (strictly increasing */
/* dioramaR in array order, goal last with isGoal:true)               */
/* ================================================================== */

/**
 * Taoyuan landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder (dioramaR chosen to be monotone while respecting real-world scale):
 *   L0  大溪橋         dioramaR  12 → absorbable @  18.5 m
 *   L1  大溪老街       dioramaR  25 → absorbable @  38.5 m
 *   L2  中壢車站       dioramaR  35 → absorbable @  53.8 m
 *   L3  虎頭山         dioramaR  50 → absorbable @  76.9 m
 *   L4  慈湖陵寢       dioramaR  70 → absorbable @ 107.7 m
 *   L5  永安漁港       dioramaR 100 → absorbable @ 153.8 m
 *   L6  桃園機場航廈   dioramaR 160 → absorbable @ 246.2 m
 *   L7  石門水庫       dioramaR 200 → absorbable @ 307.7 m
 *   L8  大溪老街牌樓(goal) dioramaR 420 → goal (not absorbed via normal path)
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: NM_DAXI_BRIDGE.landmarkId,       // 0
    name: NM_DAXI_BRIDGE.name,
    nameJa: NM_DAXI_BRIDGE.name,                 // nameJa alias for curated.js compat
    x: POS.daxi_bridge.x,  z: POS.daxi_bridge.z,
    dioramaR: 12,
    collisionScale: 1.0,
    sizeReal: 15,
    archetypeCode: CODE_DAXI_BRIDGE,
    naturalBand: 3,
    colorHex: NM_DAXI_BRIDGE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DAXI_OLDSTREET.landmarkId,    // 1
    name: NM_DAXI_OLDSTREET.name,
    nameJa: NM_DAXI_OLDSTREET.name,
    x: POS.daxi_oldstreet.x, z: POS.daxi_oldstreet.z,
    dioramaR: 25,
    collisionScale: 0.9,
    sizeReal: 30,
    archetypeCode: CODE_DAXI_OLDSTREET,
    naturalBand: 3,
    colorHex: NM_DAXI_OLDSTREET.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_ZHONGLI_STATION.landmarkId,   // 2
    name: NM_ZHONGLI_STATION.name,
    nameJa: NM_ZHONGLI_STATION.name,
    x: POS.zhongli_station.x, z: POS.zhongli_station.z,
    dioramaR: 35,
    collisionScale: 0.9,
    sizeReal: 40,
    archetypeCode: CODE_ZHONGLI_STATION,
    naturalBand: 3,
    colorHex: NM_ZHONGLI_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_HUTOUSHAN.landmarkId,         // 3
    name: NM_HUTOUSHAN.name,
    nameJa: NM_HUTOUSHAN.name,
    x: POS.hutoushan.x, z: POS.hutoushan.z,
    dioramaR: 50,
    collisionScale: 0.9,
    sizeReal: 60,
    archetypeCode: CODE_HUTOUSHAN,
    naturalBand: 4,
    colorHex: NM_HUTOUSHAN.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_CIHU_MAUSOLEUM.landmarkId,    // 4
    name: NM_CIHU_MAUSOLEUM.name,
    nameJa: NM_CIHU_MAUSOLEUM.name,
    x: POS.cihu_mausoleum.x, z: POS.cihu_mausoleum.z,
    dioramaR: 70,
    collisionScale: 0.8,
    sizeReal: 80,
    archetypeCode: CODE_CIHU_MAUSOLEUM,
    naturalBand: 4,
    colorHex: NM_CIHU_MAUSOLEUM.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_YONGAN_HARBOR.landmarkId,     // 5
    name: NM_YONGAN_HARBOR.name,
    nameJa: NM_YONGAN_HARBOR.name,
    x: POS.yongan_harbor.x, z: POS.yongan_harbor.z,
    dioramaR: 100,
    collisionScale: 0.85,
    sizeReal: 120,
    archetypeCode: CODE_YONGAN_HARBOR,
    naturalBand: 5,
    colorHex: NM_YONGAN_HARBOR.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_TPE_TERMINAL.landmarkId,      // 6
    name: NM_TPE_TERMINAL.name,
    nameJa: NM_TPE_TERMINAL.name,
    x: POS.tpe_terminal.x, z: POS.tpe_terminal.z,
    dioramaR: 160,
    collisionScale: 0.8,
    sizeReal: 180,
    archetypeCode: CODE_TPE_TERMINAL,
    naturalBand: 5,
    colorHex: NM_TPE_TERMINAL.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_SHIMEN_RESERVOIR.landmarkId,  // 7
    name: NM_SHIMEN_RESERVOIR.name,
    nameJa: NM_SHIMEN_RESERVOIR.name,
    x: POS.shimen_reservoir.x, z: POS.shimen_reservoir.z,
    dioramaR: 200,
    collisionScale: 0.85,
    sizeReal: 240,
    archetypeCode: CODE_SHIMEN_RESERVOIR,
    naturalBand: 5,
    colorHex: NM_SHIMEN_RESERVOIR.colorHex,
    isGoal: false,
  },
  {
    landmarkId: NM_DAXI_PAILOU.landmarkId,       // 8 — GOAL
    name: NM_DAXI_PAILOU.name,
    nameJa: NM_DAXI_PAILOU.name,
    x: DAXI_PAILOU_POS.x, z: DAXI_PAILOU_POS.z,
    dioramaR: 420,
    collisionScale: 0.5,
    sizeReal: 18,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xc83828,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Taoyuan landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Taoyuan: starts with the full cityData base set,
 * then appends the 8 Taoyuan landmark singleton placements. The 大溪牌樓 goal is
 * rendered by goalTower.js (code 93 = display-name-only slot, never spawned
 * from PLACEMENTS).
 *
 * NOTE: positions (x/z) must be inside MAP_BOUNDS (±1800 x, -1800..2000 z).
 */
const _TAOYUAN_LANDMARK_PLACEMENTS = LANDMARKS
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
// below). Append the 8 Taoyuan landmark singletons.
export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._TAOYUAN_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)              */
/* ================================================================== */

/**
 * 大漢溪 (Dahan River) definition for the Taoyuan pack.
 *
 * Authored in REAL METERS (same coordinate frame as all cityMap geometry:
 * origin = ball start, +X east, +Z south).
 *
 * A 5-point centerline + width (120 m) traces the river's real east→south
 * arc from 石門水庫 flowing toward 大溪. The Dahan River is the main river
 * of Taoyuan, passing through Daxi and eventually joining the Tamsui River.
 *
 * The centerline stays within MAP_BOUNDS (x:-1800..1800, z:-1800..2000).
 *
 * color: slightly brown-green (silty mountain river from the reservoir),
 * evoking the river's characteristic appearance.
 * yM: 0.3 m above ground (same as the old bay water — hides the seam).
 */
export const water = Object.freeze({
  name: '大漢溪',
  color: 0x4a6858,
  yM: 0.3,
  width: 120,
  centerline: Object.freeze([
    Object.freeze({ x:  400, z:  800 }),   // south (near 石門水庫)
    Object.freeze({ x:  350, z:  550 }),   // flowing north
    Object.freeze({ x:  200, z:  350 }),   // near 大溪
    Object.freeze({ x:   50, z:  150 }),   // continuing north
    Object.freeze({ x: -100, z:  -50 }),   // exits map toward northwest
  ]),
});

/* ================================================================== */
/* Overrides (same as P6a)                                            */
/* ================================================================== */

/**
 * Goal monument real-meter position (大溪老街牌樓 world anchor).
 * Preserves existing engine imports (terrain.js, goalTower.js use GOAL_POS).
 */
export const GOAL_POS = DAXI_PAILOU_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Taoyuan ladder keys: shop / night-market / oldstreet / ponds /
 * airport / reservoir / goal.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the starting shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 中壢夜市 night-market strip. */
  'night-market': Object.freeze({ x: -80,  z: 100,   r: 0.5  }),
  /** 大溪老街 district. */
  oldstreet:   Object.freeze({ x: 80,   z: 150,   r: 3    }),
  /** 埤塘農路 pond-road band (mid-map density ramp). */
  ponds:       Object.freeze({ x: 100,  z: 300,   r: 30   }),
  /** 桃園機場 airport area. */
  airport:     Object.freeze({ x: -280, z: -380,  r: 120  }),
  /** 石門水庫 reservoir area. */
  reservoir:   Object.freeze({ x: 480,  z: 650,   r: 200  }),
  /** Near the 大溪老街牌樓 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -300,  r: 400  }),
});
