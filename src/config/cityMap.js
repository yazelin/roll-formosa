/**
 * @file cityMap.js — v3 箱庭東京 (Hakoniwa Tokyo) — THE map data file (Stream B).
 *
 * ALL coordinates are REAL METERS, ORIGIN = BALL START (binding — keeps
 * BallPhysics.reset's hardcoded (0, r, 0) correct). Axes: +X east, +Z south.
 * sim = meters / worldScale (boot worldScale = 0.02 / 0.5 = 0.04).
 *
 * Contents (docs/DESIGN-V3.md §箱庭東京マップ, frozen export signatures in
 * §インターフェース):
 *  - SHOP        センゴク電子 (v5 rename — 千石電商-inspired parody name;
 *                geometry/exclusions untouched) interior rect, open front,
 *                walls W1-W5,
 *                prisms P1-P4 (the only authored collision besides map
 *                bounds + the Skytree base — world/terrain.js consumes).
 *  - PLACEMENTS  ~400 CuratedPlacement records (≈236 interior from seeded
 *                cluster expansion + ≈148 street/gutter/district + 12
 *                collectibles + 12 landmark placements + shop shell),
 *                expanded at module load from cluster records via
 *                mulberry32(0x544f4b59) — seed-INDEPENDENT: identical across
 *                runs; only chunk filler varies with ?seed=.
 *  - ZONES + bandAllowedAt()  chunk-spawner zone masks (static pure lookup,
 *                REAL METERS; mask 0 inside the shop interior and outside
 *                MAP_BOUNDS; T6 allowed map-wide).
 *  - LANDMARKS   11 landmark defs (frozen landmarkId 0..10, threshold ladder).
 *  - COLLECTIBLE_IDS (frozen EXPLICIT enum, append-only; v5 appends id 12) +
 *    COLLECTIBLES.
 *  - SKYTREE_POS, MAP_BOUNDS (re-export — single source is tuning.js),
 *    DEV_STARTS.
 *  - validateCityMap()  every authored-data assert from the spec; DEV builds
 *                run it at module load; headless tests call it directly.
 *
 * v4 "Real Tokyo" (docs/DESIGN-V4.md 地理マッピング — Stream W):
 *  - GENERATED GEOGRAPHY: every landmark / collectible / district position
 *    below derives from the scripts/osm/geo.mjs reconciliation (real OSM
 *    lat/lon -> 1:5 game mapping). HAND ARITHMETIC IS BANNED — the
 *    OSM_GEN table is generated output (stamped below), district shifts are
 *    computed in code as (generated - v3) deltas, and validateCityMap() v4
 *    cross-checks inter-landmark REAL distances + the coverage rects against
 *    the same formulas geo.mjs uses (identical IEEE math by construction).
 *  - OSM_COVERAGE / OSM_EXCLUSIONS exports (geo.mjs-generated geometry,
 *    re-derived here from the frozen anchor/bboxes — never hand-redefined).
 *  - setOsmCoverageActive(active): ONE-SHOT per-session latch (main calls it
 *    exactly once — on EVT.OSM_READY or at the tier-2 deadline). When active,
 *    bandAllowedAt() masks bands 3 AND 4 OFF inside the coverage geometry
 *    (OSM owns them there); bands 5/6 procedural fill continues map-wide;
 *    band-2 chunk clutter continues everywhere.
 *  - Shop interior, exit lane, gutter carpet, 中央通り strip placements and
 *    the 秋葉原 zone rect are BYTE-IDENTICAL to v3 (opening-minute
 *    no-regress gate). The curated strip x[0,25] x z[-190,190] is an OSM
 *    exclusion zone baked at convert.
 *
 * FROZEN EXTRA archetype codes (docs/DESIGN-V3.md Phase-0 追補):
 *   collectibles: code = 70 + collectibleId (70..81; 80 = ハチ公像 DUAL)
 *   landmarks:    82 西郷さん像, 83 雷門, 84 ラジオ会館風ビル, 85 渋谷109,
 *                 86 スクランブル交差点(デカール), 87 東京ドーム, 88 東京駅,
 *                 89 国会議事堂, 90 レインボーブリッジ橋スパン, 91 東京タワー
 *   92 センゴク電子 (shop shell — v5 rename), 93 東京スカイツリー
 *   (display-name slot ONLY — never spawned into the store; not a placement
 *   here).
 *
 * v5 appendix codes (objects.js V5_CODE_BASE = 110; the 70+id collectible
 * rule is FULL at 82): 110 スタックチャン (collectible id 12),
 * 111 ゲームセンター, 112 家電量販店, 113 メイドカフェ,
 * 114 PCパーツショップビル. v5 placements expand via a SEPARATE rng stream
 * (mulberry32(0x56355041)) appended AFTER the v4 block — v4 placements stay
 * byte-identical.
 */

import { mulberry32 } from '../core/rng.js';
import { ARCHETYPE_CODE_BY_ID, collectibleCodeForId } from '../world/objects.js';
import {
  ABSORB_RATIO,
  CURATED_PLACEMENT_CAP,
  GOAL_CONTACT_PAD,
  GROWTH_K,
  INTERIOR_ITEM_Y_MAX,
  MAP_BOUNDS as MAP_BOUNDS_TUNING,
  OSM_ANCHOR_LAT,
  OSM_ANCHOR_LON,
  OSM_DETAIL_RADIUS_REAL_M,
  OSM_HORIZ_K,
  PICKUP_FORGIVE_K,
  SKYTREE_COLLIDER_K,
  START_RADIUS_M,
  WALL_THICK_M,
  WALL_TOP_M,
} from './tuning.js';

/** @typedef {import('../types.js').CuratedPlacement} CuratedPlacement */
/** @typedef {import('../types.js').LandmarkDef} LandmarkDef */
/** @typedef {import('../types.js').CollectibleDef} CollectibleDef */
/** @typedef {import('../types.js').ZoneRect} ZoneRect */

/* ================================================================== */
/* v4 GENERATED geography (scripts/osm/geo.mjs is the single source of */
/* geographic truth; this block re-derives/re-exports — never redefines)*/
/* ================================================================== */

/* Projection mirrors (IDENTICAL formulas to geo.mjs — the validator's
 * coverage-rect cross-check proves bit-equality at module load). */
const M_PER_DEG_LAT = 110941;
const M_PER_DEG_LON = 111320 * Math.cos((OSM_ANCHOR_LAT * Math.PI) / 180);
/** real lat/lon -> game meters (+X east, +Z south; origin = anchor = ball start). */
function geoToGameX(lon) {
  return (lon - OSM_ANCHOR_LON) * M_PER_DEG_LON * OSM_HORIZ_K;
}
function geoToGameZ(lat) {
  return (OSM_ANCHOR_LAT - lat) * M_PER_DEG_LAT * OSM_HORIZ_K;
}

/** Frozen patch bboxes {s,w,n,e} (geo.mjs SHIBUYA_BBOX / ASAKUSA_BBOX). */
const SHIBUYA_BBOX = Object.freeze({ s: 35.652, w: 139.692, n: 35.666, e: 139.709 });
const ASAKUSA_BBOX = Object.freeze({ s: 35.705, w: 139.789, n: 35.717, e: 139.803 });
/** bbox -> game rect (geo.mjs bboxToGameRect — identical math). */
function bboxToGameRect(bb) {
  return Object.freeze({
    x0: geoToGameX(bb.w), x1: geoToGameX(bb.e),
    z0: geoToGameZ(bb.n), z1: geoToGameZ(bb.s),
  });
}

/** GENERATED CROSS-CHECK CONSTANTS (pasted from `node scripts/osm/geo.mjs`,
 *  2026-06-12, full double precision) — validateCityMap() asserts the rects
 *  computed above are EXACTLY equal, so a drifted formula on either side can
 *  never silently move the coverage geometry. */
const SHIBUYA_RECT_XCHECK = Object.freeze({
  x0: -1397.6243827813041, x1: -1090.2555017039085,
  z0: 725.5541400001221, z1: 1036.1889400000289,
});
const ASAKUSA_RECT_XCHECK = Object.freeze({
  x0: 356.1862916015433, x1: 609.3136054302286,
  z0: -406.0440599999208, z1: -139.7856599999107,
});

/**
 * v4 OSM coverage geometry (geo.mjs-generated; docs/DESIGN-V4.md 地理マッピング):
 * detail disc r = 500 game m (2,500 real m around the anchor) + the Shibuya
 * and Asakusa patch rects. The pipeline clips/excludes against the SAME
 * geometry; bandAllowedAt() masks bands 3/4 inside it once the one-shot
 * coverage latch is active.
 */
export const OSM_COVERAGE = Object.freeze({
  detailRadiusGameM: OSM_DETAIL_RADIUS_REAL_M * OSM_HORIZ_K, // 500
  shibuyaRect: bboxToGameRect(SHIBUYA_BBOX),
  asakusaRect: bboxToGameRect(ASAKUSA_BBOX),
});

/** @param {number} x @param {number} z @param {{x0:number,x1:number,z0:number,z1:number}} r */
function inRect(x, z, r) {
  return x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
}

/**
 * The coverage law (geo.mjs inCoverage, identical): detail disc OR one of the
 * two patch rects. GAME METERS (= the v3 real-meter convention).
 * @param {number} x @param {number} z @returns {boolean}
 */
export function inOsmCoverage(x, z) {
  const r = OSM_COVERAGE.detailRadiusGameM;
  if (x * x + z * z <= r * r) return true;
  return inRect(x, z, OSM_COVERAGE.shibuyaRect) || inRect(x, z, OSM_COVERAGE.asakusaRect);
}

/**
 * GENERATED landmark reconciliation values (geo.mjs reconcileLandmarks() over
 * the committed data/osm-raw/landmarks.json — DO NOT HAND-EDIT; regenerate
 * with `node scripts/osm/geo.mjs`. Stamped 2026-06-12, extractionDate
 * 2026-06-11). x/z are game meters rounded to 0.1 (geo.mjs rounding).
 * validateCityMap() v4 asserts the inter-landmark REAL distances + the
 * bridge span against the frozen ground-truth windows so a stale or
 * mis-pasted table can never ship.
 */
export const OSM_GEN = Object.freeze({
  hachiko: Object.freeze({ x: -1241.6, z: 879.5 }),
  saigo: Object.freeze({ x: 88.1, z: -291.9 }),
  kaminarimon: Object.freeze({ x: 489.9, z: -274.5 }),
  radio_kaikan: Object.freeze({ x: 47.9, z: 18.1 }),
  shibuya109: Object.freeze({ x: -1275.4, z: 867.6 }),
  scramble: Object.freeze({ x: -1242.7, z: 870.7 }),
  dome: Object.freeze({ x: -313.4, z: -151.2 }),
  tokyo_station: Object.freeze({ x: -20.3, z: 386.6 }),
  diet: Object.freeze({ x: -441.6, z: 506.2 }),
  rainbow_bridge: Object.freeze({
    x: -111, z: 1378.6, // midpoint of the true span
    endA: Object.freeze({ x: -189, z: 1347.7 }),
    endB: Object.freeze({ x: -32.9, z: 1409.5 }),
    spanGameM: 167.9, spanRealM: 840,
  }),
  tokyo_tower: Object.freeze({ x: -431.4, z: 890.5 }),
  skytree: Object.freeze({ x: 748.8, z: -251.7 }),
});

/** Inter-landmark REAL-distance ground truth (real meters, [min,max] —
 *  mirrors geo.mjs DISTANCE_GROUND_TRUTH, frozen). Asserted in validate. */
const DISTANCE_GROUND_TRUTH = Object.freeze([
  Object.freeze({ a: 'hachiko', b: 'shibuya109', minM: 60, maxM: 200 }),
  Object.freeze({ a: 'hachiko', b: 'scramble', minM: 10, maxM: 150 }),
  Object.freeze({ a: 'tokyo_station', b: 'radio_kaikan', minM: 1500, maxM: 2500 }),
  Object.freeze({ a: 'kaminarimon', b: 'skytree', minM: 900, maxM: 1700 }),
  Object.freeze({ a: 'tokyo_tower', b: 'diet', minM: 1500, maxM: 2500 }),
  Object.freeze({ a: 'dome', b: 'radio_kaikan', minM: 1400, maxM: 2400 }),
]);
/** Rainbow Bridge true-span window (real m — geo.mjs BRIDGE_SPAN_REAL_M). */
const BRIDGE_SPAN_REAL_M = Object.freeze({ min: 650, max: 950 });

/** 上野動物園 表門 reference coordinate (real lat/lon, design ~(42,-387)) —
 *  the パンダのぬいぐるみ collectible maps through the SAME projection. */
const UENO_ZOO_GATE = Object.freeze({
  x: geoToGameX(139.77162),
  z: geoToGameZ(35.71614),
});

/* v3 -> v4 DISTRICT SHIFT DELTAS (computed, never hand-typed): each remote
 * district's zone rect, dressing clusters and collectibles ride the SAME
 * delta = (reconciled landmark) - (v3 authored landmark position), so every
 * district keeps its authored internal layout at its TRUE geo position. */
/** @param {{x:number,z:number}} gen @param {number} v3x @param {number} v3z */
function delta(gen, v3x, v3z) {
  return Object.freeze({ x: gen.x - v3x, z: gen.z - v3z });
}
const D_UENO = delta(OSM_GEN.saigo, -80, -420); //        西郷さん像 anchor
const D_ASAKUSA = delta(OSM_GEN.kaminarimon, 350, -600); // 雷門 anchor
const D_MARUNOUCHI = delta(OSM_GEN.tokyo_station, -120, 480);
const D_NAGATACHO = delta(OSM_GEN.diet, -650, 650);
const D_SHIBUYA = delta(OSM_GEN.shibuya109, -1150, 950);
const D_SCRAMBLE = delta(OSM_GEN.scramble, -1180, 990);
const D_SUIDOBASHI = delta(OSM_GEN.dome, -550, -120);
const D_WANGAN = delta(OSM_GEN.rainbow_bridge, 440, 1430); // 橋 midpoint anchor

/* ================================================================== */
/* v4 OSM coverage latch (chunk-spawner band masks 3/4)                */
/* ================================================================== */

/** Active = OSM owns bands 3/4 inside coverage (bandAllowedAt masks them). */
let osmCoverageActive = false;
/** ONE-SHOT guard — per session, never re-armed by resetWorld. */
let osmCoverageDecided = false;

/**
 * ONE-SHOT per-session latch (frozen interface — main.js calls this EXACTLY
 * ONCE, on EVT.OSM_READY (true) or at the tier-2 deadline (false), always
 * before band 3 ever matters (~80 s slack). After the single flip the masks
 * are static again, preserving chunk determinism on the normal path (the
 * failure path is the documented determinism caveat).
 * @param {boolean} active
 */
export function setOsmCoverageActive(active) {
  if (osmCoverageDecided) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      throw new Error('[cityMap] setOsmCoverageActive called twice — one-shot per session');
    }
    return; // prod: latched, ignore
  }
  osmCoverageDecided = true;
  osmCoverageActive = !!active;
}

/**
 * v4 OSM EXCLUSION zones (geo.mjs buildExclusions, re-derived from the SAME
 * inputs: shop interior +2 m, the frozen curated 中央通り strip, dioramaR*1.2
 * circles at the reconciled positions of the 6 deduped landmarks, and the
 * Skytree base circle r=110). The pipeline bakes these (verify asserts zero
 * violations); exported for the validator + headless cross-checks.
 * Built after LANDMARKS below (dioramaR source) — see the assignment there.
 * @type {Array<{kind:string,label:string}>}
 */
export let OSM_EXCLUSIONS = null; // assigned once below (module load)

/* ================================================================== */
/* Bounds / fixed positions                                            */
/* ================================================================== */

/** Diorama bounds — re-export, SINGLE SOURCE IS tuning.js (no double upkeep). */
export const MAP_BOUNDS = MAP_BOUNDS_TUNING;

/** 東京スカイツリー (GOAL) fixed position — finale contact + permanent terrain
 *  base collider + environment silhouette azimuth all derive from this.
 *  v4: GENERATED (rounded reconciled position — DESIGN-V4 frozen (749,-252));
 *  terrain.js imports this with ZERO code change. */
export const SKYTREE_POS = Object.freeze({
  x: Math.round(OSM_GEN.skytree.x), // 749
  z: Math.round(OSM_GEN.skytree.z), // -252
});

/** Dev teleport starts (?at=name&r=meters; main.js devTeleport). FROZEN. */
export const DEV_STARTS = Object.freeze({
  shop: Object.freeze({ x: 0, z: 0, r: 0.02 }),
  street: Object.freeze({ x: 30, z: 0, r: 0.3 }),
  ueno: Object.freeze({ x: -150, z: -400, r: 4 }),
  marunouchi: Object.freeze({ x: -100, z: 450, r: 40 }),
  tower: Object.freeze({ x: -420, z: 1000, r: 250 }),
  goal: Object.freeze({ x: 700, z: -400, r: 400 }),
});

/* ================================================================== */
/* EXTRA archetype codes (frozen Phase-0 appendix)                     */
/* ================================================================== */

/** First EXTRA curated code (collectible id 0). Codes 0..69 are chunk codes. */
export const EXTRA_CODE_BASE = 70;
const CODE_SAIGO = 82;
const CODE_KAMINARIMON = 83;
const CODE_RADIO_KAIKAN = 84;
const CODE_SHIBUYA109 = 85;
const CODE_SCRAMBLE = 86;
const CODE_DOME = 87;
const CODE_TOKYO_STATION = 88;
const CODE_DIET = 89;
const CODE_BRIDGE_SPAN = 90;
const CODE_TOKYO_TOWER = 91;
/** センゴク電子 shop shell (activates at terrain release, absorbable @6.2m). */
export const CODE_SHOP_SHELL = 92;

/* v5 EXTRA codes (objects.js V5_CODE_BASE appendix — the collectible
 * code = 70 + id rule is FULL at code 82 (西郷さん像), so v5 archetypes
 * append after the 110-entry table; objects.js collectibleCodeForId() is the
 * single mapping authority and the validator asserts through it). */
const CODE_STACK_CHAN = 110; //      スタックチャン collectible (id 12)
const CODE_GAME_CENTER = 111; //     ゲームセンター
const CODE_DENKI_RETAILER = 112; //  家電量販店
const CODE_MAID_CAFE = 113; //       メイドカフェ
const CODE_PC_PARTS_BLDG = 114; //   PCパーツショップビル

/** Chunk-code lookup (frozen tier table order via objects.js). */
const C = ARCHETYPE_CODE_BY_ID;

/* ================================================================== */
/* A. PARTS SHOP 「センゴク電子」 — terrain + interior                  */
/* ================================================================== */

/**
 * Shop geometry (world/terrain.js consumes; REAL METERS, ball-origin coords).
 * Interior rect x[-1.4, +4.6] x z[-4.8, +3.2] (6x8 m), FULL-WIDTH open front
 * on the east face x = +4.6, opening z[-3.6, +2.0] (5.6 m clear, gate radius
 * 2.8 m). Floor flush with the street at h = 0 — zero steps anywhere.
 */
export const SHOP = Object.freeze({
  interior: Object.freeze({ x0: -1.4, x1: 4.6, z0: -4.8, z1: 3.2 }),
  /** Open front: east face, no door object exists. */
  openFront: Object.freeze({ x: 4.6, z0: -3.6, z1: 2.0, gateRadiusM: 2.8 }),
  /** Shop center (shell placement; authored around the origin = ball start). */
  center: Object.freeze({ x: 1.6, z: -0.8 }),
  /** @type {import('../types.js').TerrainWall[]} W1 west, W2 north, W3 south, W4/W5 east jambs. */
  walls: Object.freeze([
    Object.freeze({ x0: -1.4, z0: -4.8, x1: -1.4, z1: 3.2, thickness: WALL_THICK_M, yTop: WALL_TOP_M }),
    Object.freeze({ x0: -1.4, z0: -4.8, x1: 4.6, z1: -4.8, thickness: WALL_THICK_M, yTop: WALL_TOP_M }),
    Object.freeze({ x0: -1.4, z0: 3.2, x1: 4.6, z1: 3.2, thickness: WALL_THICK_M, yTop: WALL_TOP_M }),
    Object.freeze({ x0: 4.6, z0: -4.8, x1: 4.6, z1: -3.6, thickness: WALL_THICK_M, yTop: WALL_TOP_M }),
    Object.freeze({ x0: 4.6, z0: 2.0, x1: 4.6, z1: 3.2, thickness: WALL_THICK_M, yTop: WALL_TOP_M }),
  ]),
  /** @type {import('../types.js').TerrainPrism[]} P1 shelf A, P2 shelf B, P3 counter, P4 low table. */
  prisms: Object.freeze([
    Object.freeze({ x0: -1.4, z0: -4.8, x1: 0.1, z1: -1.6, h: 1.4 }),
    Object.freeze({ x0: -1.4, z0: 0.8, x1: 0.1, z1: 3.2, h: 1.4 }),
    Object.freeze({ x0: 1.2, z0: -4.8, x1: 3.9, z1: -3.4, h: 0.95 }),
    Object.freeze({ x0: 2.0, z0: 0.4, x1: 3.4, z1: 2.0, h: 0.4 }),
  ]),
});

/* ================================================================== */
/* Zone masks (chunk spawner)                                          */
/* ================================================================== */

/** @param {...number} bands @returns {number} Bitmask with the given bands set. */
function bandMask(...bands) {
  let m = 0;
  for (const b of bands) m |= 1 << b;
  return m;
}

/** T6 (スカイライン) chunk band is allowed MAP-WIDE (added to every zone). */
const MASK_T6 = bandMask(6);

/** Shift a v3 zone rect by a generated district delta (same size — v4 rule). */
function zoneShift(x0, x1, z0, z1, d, mask) {
  return Object.freeze({ x0: x0 + d.x, x1: x1 + d.x, z0: z0 + d.z, z1: z1 + d.z, bandMask: mask });
}
const D_NONE = Object.freeze({ x: 0, z: 0 });

/**
 * Zone-mask rects, FIRST MATCH WINS, evaluated in order. ~10 axis-aligned
 * rects in REAL METERS (docs/DESIGN-V3.md §C district masks). Everything
 * else inside MAP_BOUNDS falls back to GENERAL_FILL_MASK. Bands 0/1 are
 * allowed NOWHERE — T0/T1 content is 100% curated (shop interior + gutter).
 * v4: remote district rects are RE-CENTERED on the reconciled landmark
 * positions (same sizes, computed deltas — hand arithmetic banned); the
 * 中央通り strip and 秋葉原 blocks stay byte-identical (opening minute).
 * @type {ZoneRect[]}
 */
export const ZONES = Object.freeze([
  // 中央通り strip — curated dressing only (gutter line / vending rows); no
  // chunk filler so the exit street stays authored. T6 still allowed. FROZEN.
  zoneShift(4.6, 18, -180, 180, D_NONE, MASK_T6),
  // 秋葉原 blocks — origin-anchored (the shop IS the anchor). FROZEN.
  zoneShift(18, 260, -260, 260, D_NONE, bandMask(2, 3) | MASK_T6),
  // 上野公園 (西郷さん像 anchor).
  zoneShift(-300, 200, -650, -250, D_UENO, bandMask(3, 4) | MASK_T6),
  // 浅草 (雷門 anchor).
  zoneShift(200, 600, -750, -450, D_ASAKUSA, bandMask(3, 4) | MASK_T6),
  // 丸の内/銀座 (東京駅 anchor).
  zoneShift(-350, 150, 300, 750, D_MARUNOUCHI, bandMask(4, 5) | MASK_T6),
  // 永田町/霞が関 (国会議事堂 anchor).
  zoneShift(-850, -450, 500, 850, D_NAGATACHO, bandMask(4, 5) | MASK_T6),
  // 渋谷 (渋谷109 anchor).
  zoneShift(-1400, -950, 800, 1200, D_SHIBUYA, bandMask(3, 4, 5) | MASK_T6),
  // 水道橋 (東京ドーム anchor).
  zoneShift(-750, -350, -300, 50, D_SUIDOBASHI, bandMask(4, 5) | MASK_T6),
  // 湾岸 (レインボーブリッジ midpoint anchor).
  zoneShift(100, 900, 1100, 1600, D_WANGAN, bandMask(5, 6)),
]);

/** General fill for everywhere else inside bounds. */
const GENERAL_FILL_MASK = bandMask(4, 5) | MASK_T6;

/**
 * Is chunk band `band` allowed to place filler at (xReal, zReal)?
 * STATIC PURE LOOKUP (zero allocation, called per chunk placement after the
 * deterministic draws — chunk contents stay a pure function of
 * (seed, cx, cz, band)). Mask 0 inside the shop interior rect and outside
 * MAP_BOUNDS.
 * v4: once the ONE-SHOT coverage latch is ACTIVE, bands 3 and 4 are masked
 * OFF inside the OSM coverage geometry (OSM owns them there — static after
 * the single per-session flip, before band 3 ever matters).
 * @param {number} xReal Real-meter X (origin = ball start).
 * @param {number} zReal Real-meter Z.
 * @param {number} band  Chunk band 0..6.
 * @returns {boolean}
 */
export function bandAllowedAt(xReal, zReal, band) {
  if (
    xReal < MAP_BOUNDS.x[0] || xReal > MAP_BOUNDS.x[1] ||
    zReal < MAP_BOUNDS.z[0] || zReal > MAP_BOUNDS.z[1]
  ) {
    return false;
  }
  const sh = SHOP.interior;
  if (xReal >= sh.x0 && xReal <= sh.x1 && zReal >= sh.z0 && zReal <= sh.z1) return false;
  // v4: OSM owns bands 3/4 inside coverage (one-shot latch; see header).
  if (osmCoverageActive && (band === 3 || band === 4) && inOsmCoverage(xReal, zReal)) {
    return false;
  }
  const bit = 1 << band;
  for (let i = 0; i < ZONES.length; i++) {
    const z = ZONES[i];
    if (xReal >= z.x0 && xReal <= z.x1 && zReal >= z.z0 && zReal <= z.z1) {
      return (z.bandMask & bit) !== 0;
    }
  }
  return (GENERAL_FILL_MASK & bit) !== 0;
}

/* ================================================================== */
/* Landmark singletons (frozen landmarkId 0..10)                       */
/* ================================================================== */

/** Collectible gold tint (matches RARE_TINT semantics; render hint). */
const GOLD = 0xffd84a;

/**
 * Geo-faithful at 1:5 compression; absorb threshold = dioramaR / 0.65.
 * landmarkId order = threshold ladder order (frozen Phase-0 appendix).
 * ハチ公像 (id 0) is DUAL landmark+collectible — its single placement is
 * emitted from COLLECTIBLES below (code 80) carrying BOTH ids.
 * v4: x/z are the geo.mjs-GENERATED reconciled positions (OSM_GEN above);
 * dioramaR / collisionScale / sizeReal / threshold ladder UNCHANGED from v3
 * (growth ladder untouched — binding).
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  { landmarkId: 0, nameJa: 'ハチ公像', x: OSM_GEN.hachiko.x, z: OSM_GEN.hachiko.z, dioramaR: 1.2, collisionScale: 1.0, sizeReal: 1.6, archetypeCode: 70 + 10, naturalBand: 2, colorHex: 0x7a6a4f },
  { landmarkId: 1, nameJa: '西郷さん像', x: OSM_GEN.saigo.x, z: OSM_GEN.saigo.z, dioramaR: 4.0, collisionScale: 1.0, sizeReal: 3.7, archetypeCode: CODE_SAIGO, naturalBand: 3, colorHex: 0x6e7b5a },
  { landmarkId: 2, nameJa: '雷門', x: OSM_GEN.kaminarimon.x, z: OSM_GEN.kaminarimon.z, dioramaR: 7.0, collisionScale: 0.8, sizeReal: 11.7, archetypeCode: CODE_KAMINARIMON, naturalBand: 3, colorHex: 0xc0392b },
  // ラジオ会館: the REAL one (~180 m real east of the fictional shop) — its
  // real OSM footprint is deduped out by the exclusion circle below.
  { landmarkId: 3, nameJa: 'ラジオ会館風ビル', x: OSM_GEN.radio_kaikan.x, z: OSM_GEN.radio_kaikan.z, dioramaR: 24, collisionScale: 0.9, sizeReal: 46, archetypeCode: CODE_RADIO_KAIKAN, naturalBand: 4, colorHex: 0xd8d3c0 },
  { landmarkId: 4, nameJa: '渋谷109', x: OSM_GEN.shibuya109.x, z: OSM_GEN.shibuya109.z, dioramaR: 28, collisionScale: 0.9, sizeReal: 60, archetypeCode: CODE_SHIBUYA109, naturalBand: 4, colorHex: 0xc7ccd4 },
  // スクランブル交差点: flat decal r18 (yK flattens the rest pose); the x16
  // crowd is authored as curated 'person' placements in DISTRICT_CLUSTERS.
  { landmarkId: 5, nameJa: 'スクランブル交差点', x: OSM_GEN.scramble.x, z: OSM_GEN.scramble.z, dioramaR: 18, collisionScale: 0.1, sizeReal: 50, archetypeCode: CODE_SCRAMBLE, naturalBand: 4, colorHex: 0x8a8f99 },
  { landmarkId: 6, nameJa: '東京ドーム', x: OSM_GEN.dome.x, z: OSM_GEN.dome.z, dioramaR: 55, collisionScale: 0.9, sizeReal: 56, archetypeCode: CODE_DOME, naturalBand: 5, colorHex: 0xe8e6df },
  // 東京駅丸の内駅舎 — Phase-3 ladder respace: dioramaR 65 -> 88 so the
  // absorb threshold (135.4m) sits ABOVE the Tokyo Dome landing (~131m).
  { landmarkId: 7, nameJa: '東京駅丸の内駅舎', x: OSM_GEN.tokyo_station.x, z: OSM_GEN.tokyo_station.z, dioramaR: 88, collisionScale: 0.55, sizeReal: 335, archetypeCode: CODE_TOKYO_STATION, naturalBand: 5, colorHex: 0xa0522d },
  // 国会議事堂 — respaced 75 -> 140 (thresh 215.4m > Station landing ~210m).
  // 3,350 m real from the anchor = OUTSIDE detail coverage by design.
  { landmarkId: 8, nameJa: '国会議事堂', x: OSM_GEN.diet.x, z: OSM_GEN.diet.z, dioramaR: 140, collisionScale: 0.7, sizeReal: 206, archetypeCode: CODE_DIET, naturalBand: 5, colorHex: 0xcfc8b8 },
  // レインボーブリッジ: 3 deck segments share landmarkId 9 (placements below,
  // GENERATED from the true bridge-way span — midpoint here). Respaced 90 ->
  // 150 (thresh 230.8m); the bridge->tower run IS the intended finale ramp.
  { landmarkId: 9, nameJa: 'レインボーブリッジ', x: OSM_GEN.rainbow_bridge.x, z: OSM_GEN.rainbow_bridge.z, dioramaR: 150, collisionScale: 0.5, sizeReal: 798, archetypeCode: CODE_BRIDGE_SPAN, naturalBand: 5, colorHex: 0xdfe3e8 },
  // 東京タワー — PENULTIMATE (1:1, absorbed normally @ ~262m; its GROWTH_K=10
  // jump to ~406m IS the ramp into the finale band — BINDING resolution).
  { landmarkId: 10, nameJa: '東京タワー', x: OSM_GEN.tokyo_tower.x, z: OSM_GEN.tokyo_tower.z, dioramaR: 170, collisionScale: 0.45, sizeReal: 333, archetypeCode: CODE_TOKYO_TOWER, naturalBand: 5, colorHex: 0xe85d3d },
]);

/** v4 GENERATED bridge deck segments: 3 points at t = 1/6, 1/2, 5/6 along the
 *  TRUE span (endA -> endB from the actual OSM bridge ways — ~168 game m,
 *  direction SSW). All three share landmarkId 9. */
const BRIDGE_SPANS = Object.freeze([1 / 6, 1 / 2, 5 / 6].map((t) =>
  Object.freeze({
    x: OSM_GEN.rainbow_bridge.endA.x + t * (OSM_GEN.rainbow_bridge.endB.x - OSM_GEN.rainbow_bridge.endA.x),
    z: OSM_GEN.rainbow_bridge.endA.z + t * (OSM_GEN.rainbow_bridge.endB.z - OSM_GEN.rainbow_bridge.endA.z),
  })
));

/* OSM_EXCLUSIONS (declared with the coverage block above; built HERE where
 * LANDMARKS' dioramaR values exist — geo.mjs buildExclusions, same inputs). */
{
  /** Landmark key -> landmarkId (the dioramaR source is LANDMARKS itself —
   *  no duplicated radii; geo.mjs EXCLUSION_LANDMARK_KEYS order). */
  const idByKey = {
    radio_kaikan: 3, shibuya109: 4, tokyo_station: 7,
    diet: 8, dome: 6, kaminarimon: 2,
  };
  const dioramaRByKey = {};
  for (const key of Object.keys(idByKey)) {
    dioramaRByKey[key] = LANDMARKS[idByKey[key]].dioramaR;
  }
  const sh = SHOP.interior;
  const out = [
    Object.freeze({ kind: 'rect', x0: sh.x0 - 2, x1: sh.x1 + 2, z0: sh.z0 - 2, z1: sh.z1 + 2, label: 'shop interior +2m' }),
    Object.freeze({ kind: 'rect', x0: 0, x1: 25, z0: -190, z1: 190, label: '中央通り curated strip' }),
  ];
  for (const key of ['radio_kaikan', 'shibuya109', 'tokyo_station', 'diet', 'dome', 'kaminarimon']) {
    out.push(Object.freeze({
      kind: 'circle', x: OSM_GEN[key].x, z: OSM_GEN[key].z,
      r: dioramaRByKey[key] * 1.2, label: `landmark ${key} dioramaR*1.2`,
    }));
  }
  out.push(Object.freeze({ kind: 'circle', x: OSM_GEN.skytree.x, z: OSM_GEN.skytree.z, r: 110, label: 'skytree base' }));
  OSM_EXCLUSIONS = Object.freeze(out);
}

/* ================================================================== */
/* Collectibles (FROZEN EXPLICIT ids 0..11 — append-only, never reused) */
/* ================================================================== */

/**
 * FROZEN ID ENUM (binding, MINOR 14): explicit integer ids, NOT array order.
 * Future patches append ids 12+ and bump the displayed total only; ids are
 * never reused or reordered; the localStorage album mask is keyed by these.
 */
export const COLLECTIBLE_IDS = Object.freeze({
  GOLD_MANEKI_NEKO: 0,
  VACUUM_TUBE: 1,
  RETRO_GAME_CONSOLE: 2,
  AKIBA_FIGURE: 3,
  GAMING_PC: 4,
  OTORO: 5,
  DARUMA: 6,
  PANDA_PLUSH: 7,
  KAMINARI_OKOSHI: 8,
  GOLDEN_OBJET: 9,
  HACHIKO: 10,
  YAKATABUNE: 11,
  STACK_CHAN: 12, // v5 append (code 110 via collectibleCodeForId — 70+id is full)
});

/**
 * 13 collectible defs (archetypeCode = collectibleCodeForId(id): 70 + id for
 * ids 0..11, v5 appendix codes 110+ for ids 12+). y = surface
 * rest height (shop shelf/table items); landmarkId -1 except ハチ公像.
 * v4: district collectibles (ids 5..11) are RECOMPUTED via geo.mjs values —
 * shop interior (0..3) and the 秋葉原 exit-lane ゲーミングPC (4) are FROZEN
 * (opening minute byte-identical). パンダ sits at the GENERATED 上野動物園
 * 表門 mapping; ハチ公像 at its reconciled position.
 * @type {CollectibleDef[]}
 */
export const COLLECTIBLES = Object.freeze([
  { id: 0, nameJa: '金の招き猫', x: 2.1, y: 0.4, z: 0.7, radiusReal: 0.05, archetypeCode: 70, landmarkId: -1, naturalBand: 1, rIntent: 0.3 },
  { id: 1, nameJa: '真空管', x: 3.34, y: 0.4, z: 1.5, radiusReal: 0.028, archetypeCode: 71, landmarkId: -1, naturalBand: 1, rIntent: 0.3 },
  { id: 2, nameJa: 'レトロゲーム機', x: 0.45, y: 0, z: 3.0, radiusReal: 0.07, archetypeCode: 72, landmarkId: -1, naturalBand: 1, rIntent: 0.15 },
  { id: 3, nameJa: '秋葉原フィギュア', x: 0.06, y: 0.7, z: -2.9, radiusReal: 0.05, archetypeCode: 73, landmarkId: -1, naturalBand: 1, rIntent: 0.4 },
  { id: 4, nameJa: 'ゲーミングPC', x: 9, y: 0, z: -38, radiusReal: 0.25, archetypeCode: 74, landmarkId: -1, naturalBand: 2, rIntent: 0.4 },
  { id: 5, nameJa: '特上大トロ', x: -100 + D_MARUNOUCHI.x, y: 0, z: 460 + D_MARUNOUCHI.z, radiusReal: 0.3, archetypeCode: 75, landmarkId: -1, naturalBand: 2, rIntent: 0.5 },
  { id: 6, nameJa: 'だるま', x: -120 + D_UENO.x, y: 0, z: -380 + D_UENO.z, radiusReal: 0.5, archetypeCode: 76, landmarkId: -1, naturalBand: 2, rIntent: 0.8 },
  { id: 7, nameJa: 'パンダのぬいぐるみ', x: UENO_ZOO_GATE.x, y: 0, z: UENO_ZOO_GATE.z, radiusReal: 0.6, archetypeCode: 77, landmarkId: -1, naturalBand: 2, rIntent: 1.0 },
  { id: 8, nameJa: '雷おこし', x: 360 + D_ASAKUSA.x, y: 0, z: -585 + D_ASAKUSA.z, radiusReal: 0.4, archetypeCode: 78, landmarkId: -1, naturalBand: 2, rIntent: 0.7 },
  { id: 9, nameJa: '金色のオブジェ', x: 430 + D_ASAKUSA.x, y: 0, z: -560 + D_ASAKUSA.z, radiusReal: 3.0, archetypeCode: 79, landmarkId: -1, naturalBand: 3, rIntent: 5 },
  // DUAL landmark+collectible: emits EVT.COLLECT FIRST then EVT.LANDMARK.
  { id: 10, nameJa: 'ハチ公像', x: OSM_GEN.hachiko.x, y: 0, z: OSM_GEN.hachiko.z, radiusReal: 1.2, archetypeCode: 80, landmarkId: 0, naturalBand: 2, rIntent: 1.85 },
  { id: 11, nameJa: '屋形船', x: 380 + D_WANGAN.x, y: 0, z: 1340 + D_WANGAN.z, radiusReal: 8.0, archetypeCode: 81, landmarkId: -1, naturalBand: 4, rIntent: 12.5 },
  // v5: スタックチャン (the open-source M5Stack robot — Donack's cousin) on
  // the shelf-A mid level: an electronics shop shelf is its natural home.
  // Code 110 = the first v5 EXTRA appendix code (70+id rule is full at 82).
  { id: 12, nameJa: 'スタックチャン', x: 0.065, y: 0.7, z: -2.6, radiusReal: 0.04, archetypeCode: CODE_STACK_CHAN, landmarkId: -1, naturalBand: 1, rIntent: 0.4 },
]);

/* ================================================================== */
/* Cluster records -> PLACEMENTS expansion                             */
/* ================================================================== */

/**
 * Cluster record (authoring format, expanded at module load):
 * [archetypeId, x, z, n, spread, rMin, rMax, ySurf, rIntent, rect|null]
 * - x/z: cluster center (REAL m); spread: +-uniform jitter (m).
 * - rect {x0,x1,z0,z1}: optional hard clamp region (shelf/table-top clusters)
 *   — expansion rejection-resamples until inside.
 * - ySurf: surface height the item rests on (0 = floor; <= INTERIOR_ITEM_Y_MAX
 *   for interior). Item CENTER = ySurf + radiusReal.
 * - rIntent: ball true radius (m) at which the validator checks the 3D-reach
 *   inequality (auto-raised to radiusReal / ABSORB_RATIO).
 */

/* Shelf-mid rect (shelves A/B front face x = 0.1; items inset <= 0.06). */
const SHELF_X = { x0: 0.04, x1: 0.09 };

/** Interior clusters (~232 placements). All heights <= INTERIOR_ITEM_Y_MAX. */
const INTERIOR_CLUSTERS = [
  // --- T0 floor bins (ネジ/抵抗/コンデンサ ... along the aisles) ---
  ['screw', 0.5, -2.0, 10, 0.35, 0.006, 0.010, 0, 0.02, null],
  ['screw', 1.8, -0.6, 9, 0.40, 0.006, 0.010, 0, 0.02, null],
  ['screw', 0.9, 0.3, 8, 0.35, 0.006, 0.010, 0, 0.02, null],
  ['screw', 4.3, 1.6, 8, 0.30, 0.006, 0.010, 0, 0.02, null],
  ['resistor', 2.6, -1.0, 9, 0.40, 0.006, 0.009, 0, 0.02, null],
  ['resistor', 0.4, -3.0, 8, 0.30, 0.006, 0.009, 0, 0.02, null],
  ['resistor', 3.4, -0.2, 8, 0.40, 0.006, 0.009, 0, 0.02, null],
  ['capacitor', 1.3, -1.2, 8, 0.35, 0.007, 0.011, 0, 0.02, null],
  ['capacitor', 1.5, 0.5, 8, 0.35, 0.007, 0.011, 0, 0.02, null],
  ['capacitor', 0.6, -4.2, 7, 0.25, 0.007, 0.011, 0, 0.02, null],
  ['led', 3.0, -2.6, 8, 0.30, 0.006, 0.009, 0, 0.02, null],
  ['led', 1.0, 1.4, 7, 0.30, 0.006, 0.009, 0, 0.02, null],
  ['button_battery', 3.8, -1.4, 7, 0.30, 0.006, 0.010, 0, 0.02, null],
  ['button_battery', 1.2, 2.6, 7, 0.30, 0.006, 0.010, 0, 0.02, null],
  // 消しゴム/クリップ near the counter base.
  ['paperclip', 2.4, -3.0, 8, 0.30, 0.006, 0.010, 0, 0.02, null],
  ['paperclip', 0.5, -0.5, 7, 0.35, 0.006, 0.010, 0, 0.02, null],
  ['eraser', 3.2, -3.0, 7, 0.25, 0.010, 0.012, 0, 0.025, null],
  ['eraser', 1.6, 1.2, 6, 0.25, 0.010, 0.012, 0, 0.025, null],
  ['junk_board', 1.2, -2.4, 5, 0.30, 0.030, 0.050, 0, 0.08, null],
  ['junk_board', 3.9, 0.0, 4, 0.30, 0.030, 0.050, 0, 0.08, null],
  ['soldering_iron', 3.6, -1.8, 3, 0.25, 0.025, 0.035, 0, 0.06, null],
  // --- T0 on P4 low table (y 0.4) — ICチップ/LED/ボタン電池 near the edges ---
  ['ic_chip', 2.05, 1.2, 8, 0.6, 0.007, 0.011, 0.4, 0.30, { x0: 2.02, x1: 2.08, z0: 0.6, z1: 1.8 }],
  ['led', 2.7, 0.45, 7, 0.5, 0.006, 0.009, 0.4, 0.30, { x0: 2.2, x1: 3.2, z0: 0.42, z1: 0.48 }],
  ['button_battery', 3.35, 1.2, 7, 0.6, 0.006, 0.010, 0.4, 0.30, { x0: 3.32, x1: 3.38, z0: 0.6, z1: 1.8 }],
  // --- T1 floor (雑誌たば/丸イス/ダンボール箱/工具箱/スピーカー...) ---
  ['magazine_stack', 4.0, -2.4, 4, 0.30, 0.06, 0.08, 0, 0.13, null],
  ['magazine_stack', 0.6, 1.7, 3, 0.25, 0.06, 0.08, 0, 0.13, null],
  ['cardboard_box', 0.55, -4.3, 3, 0.20, 0.06, 0.08, 0, 0.13, null],
  ['cardboard_box', 4.1, 0.2, 3, 0.25, 0.06, 0.08, 0, 0.13, null],
  ['cardboard_box', 1.0, 2.8, 2, 0.20, 0.06, 0.08, 0, 0.13, null],
  ['round_stool', 1.5, 0.2, 2, 0.15, 0.07, 0.09, 0, 0.15, null],
  ['round_stool', 3.9, 2.7, 2, 0.15, 0.07, 0.09, 0, 0.15, null],
  ['toolbox', 2.9, -1.8, 3, 0.25, 0.06, 0.08, 0, 0.13, null],
  ['speaker', 4.25, -0.8, 3, 0.20, 0.05, 0.07, 0, 0.11, null],
  ['junk_hdd', 2.0, -2.7, 3, 0.25, 0.045, 0.06, 0, 0.10, null],
  ['mouse', 4.3, -3.0, 3, 0.20, 0.045, 0.06, 0, 0.10, null],
  // --- T1 shelf mid-levels (y 0.7 ONLY — honestly late-T1, reach r ~0.4) ---
  ['mouse', 0.065, -2.15, 5, 0.3, 0.050, 0.060, 0.7, 0.40, { ...SHELF_X, z0: -2.4, z1: -1.9 }],
  ['game_soft', 0.065, -3.5, 6, 0.35, 0.045, 0.055, 0.7, 0.40, { ...SHELF_X, z0: -3.8, z1: -3.2 }],
  ['speaker', 0.065, -4.35, 3, 0.3, 0.050, 0.060, 0.7, 0.40, { ...SHELF_X, z0: -4.6, z1: -4.1 }],
  ['junk_hdd', 0.065, 1.4, 4, 0.35, 0.050, 0.065, 0.7, 0.40, { ...SHELF_X, z0: 1.1, z1: 1.7 }],
  ['mouse', 0.065, 2.35, 4, 0.3, 0.050, 0.060, 0.7, 0.40, { ...SHELF_X, z0: 2.1, z1: 2.6 }],
  ['game_soft', 0.065, 2.95, 5, 0.2, 0.045, 0.055, 0.7, 0.40, { ...SHELF_X, z0: 2.8, z1: 3.1 }],
];

/** Akiba street dressing (~71) — 中央通り strip x[4.6,18] z[-180,180].
 *  Phase-3 fix: the gutter LINES are authored with rect clamps (square
 *  x/z jitter previously scattered ~50% of the dressing OUTSIDE the 13.4m
 *  strip, incl. vending machines in the empty backlot west of the shop —
 *  thinning the authored shop-exit growth chain). */
const STREET_CLUSTERS = [
  ['vending_machine', 16.5, -30, 6, 25, 0.50, 0.65, 0, 1.0, { x0: 15.5, x1: 17.8, z0: -55, z1: -5 }],
  ['vending_machine', 16.5, 40, 6, 30, 0.50, 0.65, 0, 1.0, { x0: 15.5, x1: 17.8, z0: 10, z1: 70 }],
  ['bicycle', 7, -55, 6, 20, 0.50, 0.60, 0, 0.95, { x0: 5.6, x1: 8.5, z0: -75, z1: -35 }],
  ['bicycle', 7, 25, 6, 18, 0.50, 0.60, 0, 0.95, { x0: 5.6, x1: 8.5, z0: 7, z1: 43 }],
  ['signboard', 12, -90, 4, 30, 0.40, 0.55, 0, 0.9, { x0: 10, x1: 14, z0: -120, z1: -60 }],
  ['signboard', 12, 70, 4, 30, 0.40, 0.55, 0, 0.9, { x0: 10, x1: 14, z0: 40, z1: 100 }],
  ['nobori_banner', 6.5, -20, 4, 12, 0.40, 0.50, 0, 0.8, { x0: 5.4, x1: 7.6, z0: -32, z1: -8 }],
  ['nobori_banner', 6.5, 60, 4, 15, 0.40, 0.50, 0, 0.8, { x0: 5.4, x1: 7.6, z0: 45, z1: 75 }],
  // 通行人 crowds thickening near the shop.
  ['person', 8, -12, 6, 8, 0.32, 0.38, 0, 0.6, { x0: 5.5, x1: 10.5, z0: -20, z1: -4 }],
  ['person', 11, 14, 5, 8, 0.32, 0.38, 0, 0.6, { x0: 8.5, x1: 13.5, z0: 6, z1: 22 }],
  ['person', 10, -70, 4, 25, 0.32, 0.38, 0, 0.6, { x0: 7, x1: 13, z0: -95, z1: -45 }],
  ['cat', 6, 8, 2, 4, 0.12, 0.16, 0, 0.25, { x0: 5, x1: 8, z0: 4, z1: 12 }],
  ['cat', 15, -45, 2, 6, 0.12, 0.16, 0, 0.25, { x0: 13, x1: 17, z0: -51, z1: -39 }],
  ['pigeon', 9, -6, 4, 5, 0.06, 0.08, 0, 0.13, { x0: 6, x1: 12, z0: -11, z1: -1 }],
  ['pigeon', 13, 30, 4, 6, 0.06, 0.08, 0, 0.13, { x0: 10, x1: 16, z0: 24, z1: 36 }],
  ['trash_can', 16.5, -15, 2, 8, 0.28, 0.33, 0, 0.55, { x0: 15.8, x1: 17.5, z0: -23, z1: -7 }],
  ['trash_can', 16.5, 90, 2, 10, 0.28, 0.33, 0, 0.55, { x0: 15.8, x1: 17.5, z0: 80, z1: 100 }],
  ['utility_pole', 17.2, -120, 4, 60, 3.2, 3.6, 0, 6, { x0: 16.9, x1: 17.6, z0: -180, z1: -60 }],
  ['yatai_stall', 10, -130, 1, 0, 1.1, 1.3, 0, 2.1, null],
  ['yatai_stall', 12, 110, 1, 0, 1.1, 1.3, 0, 2.1, null],
];

/**
 * EXIT-BRIDGE GUTTER LINE (~22): 空き缶/ペットボトル/チラシたば/軍手 as
 * T0/T1-scale recipes along the east gutter, dense near the shop, thinning
 * with distance — bridges the r 0.10..0.4 shop-exit growth chain (validator
 * prints the table).
 */
const GUTTER_CLUSTERS = [
  ['eraser', 17.2, -8, 3, 5, 0.030, 0.040, 0, 0.07, { x0: 16.6, x1: 17.8, z0: -13, z1: -3 }],
  ['eraser', 17.2, 18, 2, 6, 0.030, 0.040, 0, 0.07, { x0: 16.6, x1: 17.8, z0: 12, z1: 24 }],
  ['button_battery', 17.0, -25, 3, 8, 0.025, 0.035, 0, 0.06, { x0: 16.6, x1: 17.8, z0: -33, z1: -17 }],
  ['game_soft', 17.3, 35, 2, 8, 0.040, 0.050, 0, 0.08, { x0: 16.6, x1: 17.8, z0: 27, z1: 43 }],
  ['game_soft', 17.3, -45, 2, 8, 0.040, 0.050, 0, 0.08, { x0: 16.6, x1: 17.8, z0: -53, z1: -37 }],
  ['magazine_stack', 17.0, -60, 2, 10, 0.060, 0.080, 0, 0.13, { x0: 16.6, x1: 17.8, z0: -70, z1: -50 }],
  ['magazine_stack', 17.0, 55, 2, 10, 0.060, 0.080, 0, 0.13, { x0: 16.6, x1: 17.8, z0: 45, z1: 65 }],
  ['toolbox', 17.4, -85, 2, 12, 0.050, 0.060, 0, 0.10, { x0: 16.6, x1: 17.8, z0: -97, z1: -73 }],
  ['cardboard_box', 17.2, 80, 2, 10, 0.060, 0.080, 0, 0.13, { x0: 16.6, x1: 17.8, z0: 70, z1: 90 }],
  ['eraser', 17.1, -110, 2, 12, 0.030, 0.040, 0, 0.07, { x0: 16.6, x1: 17.8, z0: -122, z1: -98 }],
  // ---- Phase-3 exit-lane carpet (shop-exit whiplash fix): a straight
  // eastward exit previously OUTRAN its own growth chain (r stayed ~0.42m to
  // the map edge — the only 0.1-0.4m supply was the single gutter line).
  // These rows put a continuous 0.025-0.30m litter carpet ON the lane the
  // player is funneled down (x[5,18], z[-40,40]) so the 0.43->0.55m
  // transition happens within ~20m of the gate without backtracking.
  ['paperclip', 11, 0, 8, 6, 0.025, 0.040, 0, 0.07, { x0: 5.2, x1: 17.6, z0: -10, z1: 10 }],
  ['game_soft', 11, -20, 7, 11, 0.045, 0.055, 0, 0.09, { x0: 5.2, x1: 17.6, z0: -30, z1: -8 }],
  ['mouse', 11, 18, 7, 12, 0.050, 0.065, 0, 0.10, { x0: 5.2, x1: 17.6, z0: 6, z1: 30 }],
  ['magazine_stack', 11, -29, 6, 11, 0.070, 0.100, 0, 0.16, { x0: 5.5, x1: 17.5, z0: -40, z1: -18 }],
  ['cardboard_box', 11, 27, 6, 13, 0.100, 0.160, 0, 0.25, { x0: 5.5, x1: 17.5, z0: 14, z1: 40 }],
  ['trash_can', 12, 0, 4, 16, 0.220, 0.300, 0, 0.47, { x0: 6, x1: 17, z0: -16, z1: 16 }],
];

/** District dressing (~55, incl. the scramble crowd x16). v4: each row rides
 *  its district's GENERATED shift delta (computed above — same authored
 *  layout at the reconciled geo positions; hand arithmetic banned). */
const DISTRICT_CLUSTERS = [
  ['street_tree', -150 + D_UENO.x, -380 + D_UENO.z, 4, 60, 2.0, 2.4, 0, 3.8, null], // 上野公園
  ['person', -240 + D_UENO.x, -455 + D_UENO.z, 4, 12, 0.32, 0.38, 0, 0.6, null], // 動物園前
  ['kiosk', -130 + D_UENO.x, -395 + D_UENO.z, 2, 15, 1.6, 1.9, 0, 3.0, null], // 上野みやげ屋
  ['machiya', 320 + D_ASAKUSA.x, -560 + D_ASAKUSA.z, 3, 30, 2.8, 3.4, 0, 5.3, null], // 浅草
  ['kiosk', 355 + D_ASAKUSA.x, -575 + D_ASAKUSA.z, 2, 12, 1.6, 1.9, 0, 3.0, null], // 仲見世
  ['torii', 340 + D_ASAKUSA.x, -630 + D_ASAKUSA.z, 1, 0, 1.5, 1.7, 0, 2.7, null], // 浅草
  ['taxi', -110 + D_MARUNOUCHI.x, 470 + D_MARUNOUCHI.z, 4, 30, 0.95, 1.05, 0, 1.7, null], // 丸の内
  ['car', -90 + D_MARUNOUCHI.x, 440 + D_MARUNOUCHI.z, 4, 35, 0.90, 1.00, 0, 1.6, null],
  ['bus', -140 + D_MARUNOUCHI.x, 500 + D_MARUNOUCHI.z, 2, 25, 1.40, 1.60, 0, 2.5, null],
  // スクランブル交差点 crowd x16 (T2-size 通行人; decal is the landmark).
  ['person', -1163 + D_SCRAMBLE.x, 975 + D_SCRAMBLE.z, 16, 16, 0.32, 0.38, 0, 0.6, null],
  ['signboard', -1135 + D_SHIBUYA.x, 940 + D_SHIBUYA.z, 3, 18, 0.45, 0.55, 0, 0.9, null], // 渋谷
  ['street_tree', -600 + D_NAGATACHO.x, 620 + D_NAGATACHO.z, 3, 40, 2.0, 2.4, 0, 3.8, null], // 永田町
  ['truck', -520 + D_SUIDOBASHI.x, -100 + D_SUIDOBASHI.z, 3, 35, 1.10, 1.30, 0, 2.1, null], // 水道橋
  ['person', -100 + D_MARUNOUCHI.x, 455 + D_MARUNOUCHI.z, 4, 15, 0.32, 0.38, 0, 0.6, null], // 東京駅前 (寿司屋台まわり)
];

/* ================================================================== */
/* v5 cluster tables (owner playtest polish — docs/DESIGN-V3 format)   */
/* ================================================================== */

/**
 * v5 OPENING SPAWN CARPET (~40): T0 parts ringing the 2 cm ball start so the
 * FIRST absorb lands within ~2 s of rolling in ANY direction (owner req 2 —
 * the live-run diagnosis showed the nearest v4 interior parts 0.5-0.9 m out
 * while fog far at 2 cm is ~1.1 m: an empty brown floor). Same authoring
 * format; interior rejection keeps every item out of the prisms/walls.
 */
const V5_OPENING_CLUSTERS = [
  ['screw', 0.55, 0.0, 8, 0.55, 0.006, 0.010, 0, 0.02, null],
  ['resistor', -0.45, -0.4, 8, 0.50, 0.006, 0.009, 0, 0.02, null],
  ['led', 0.0, 0.6, 8, 0.55, 0.006, 0.009, 0, 0.02, null],
  ['capacitor', 0.3, -0.7, 8, 0.60, 0.007, 0.011, 0, 0.02, null],
  ['button_battery', -0.5, 0.5, 8, 0.55, 0.006, 0.010, 0, 0.02, null],
];

/**
 * v5 BREADCRUMB TRAIL (~24): a dense parts lane rect-clamped onto the
 * interior exit corridor (|z| <= 0.3, prism-free by the exit-lane assert) —
 * connects the spawn carpet to the gate, where the frozen v3/v4 exterior
 * gutter + exit-lane carpet takes over. The onboarding guide arrow
 * (game/onboarding.js) walks the same lane.
 */
const V5_TRAIL_RECT = { x0: 0.6, x1: 4.4, z0: -0.3, z1: 0.3 };
const V5_TRAIL_CLUSTERS = [
  ['screw', 2.5, 0, 8, 0, 0.006, 0.010, 0, 0.02, V5_TRAIL_RECT],
  ['led', 2.5, 0, 8, 0, 0.006, 0.009, 0, 0.02, V5_TRAIL_RECT],
  ['paperclip', 2.5, 0, 8, 0, 0.006, 0.010, 0, 0.02, V5_TRAIL_RECT],
];

/**
 * v5 AKIBA curated buildings (6 singletons, codes 111..114, naturalBand 4 —
 * absorbable mid-game at ball r ~9..22 m): ゲームセンター x2, 家電量販店,
 * メイドカフェ, PCパーツショップビル x2 dress the 電気街 zone east of the
 * curated strip. Format: [code, x, z, radiusReal] — yaw comes from the v5
 * rng stream; rIntent = radiusReal / ABSORB_RATIO. Positions keep every
 * footprint east of the strip edge (x - r > 25) and clear of the
 * ラジオ会館風ビル landmark disc (dist >= dioramaR 24 + r); interpenetration
 * with generic OSM footprints is accepted hakoniwa style (single-constant
 * nudges on screenshot review).
 */
const V5_AKIBA_CLUSTERS = [
  [CODE_GAME_CENTER, 34, -60, 8],
  [CODE_GAME_CENTER, 44, 95, 7.5],
  [CODE_DENKI_RETAILER, 66, 60, 14],
  [CODE_MAID_CAFE, 32, -8, 6],
  [CODE_PC_PARTS_BLDG, 36, -25, 9],
  [CODE_PC_PARTS_BLDG, 66, -105, 10],
];

/* ------------------------------------------------------------------ */
/* Expansion (module load, seed-INDEPENDENT mulberry32(0x544f4b59))    */
/* ------------------------------------------------------------------ */

/** @param {number} x @param {number} z @returns {boolean} Inside any prism footprint. */
function pointInPrism(x, z) {
  const ps = SHOP.prisms;
  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    if (x >= p.x0 && x <= p.x1 && z >= p.z0 && z <= p.z1) return true;
  }
  return false;
}

/** Interior floor margin (clear of wall thickness). */
const IN_MARGIN = 0.07;

/**
 * Expand one cluster table into CuratedPlacement records.
 * @param {() => number} rng Shared mulberry32 stream (single authoring order).
 * @param {Array} clusters Cluster rows (see format above).
 * @param {boolean} interior True for shop-interior rows (validity rejection).
 * @param {CuratedPlacement[]} out
 */
function expandClusters(rng, clusters, interior, out) {
  for (let ci = 0; ci < clusters.length; ci++) {
    const [id, cx, cz, n, spread, rMin, rMax, ySurf, rIntent, rect] = clusters[ci];
    const code = C[id];
    for (let k = 0; k < n; k++) {
      let x = cx;
      let z = cz;
      if (rect !== null) {
        // Hard clamp region (shelf/table tops): sample uniformly inside it.
        x = rect.x0 + rng() * (rect.x1 - rect.x0);
        z = rect.z0 + rng() * (rect.z1 - rect.z0);
      } else {
        for (let attempt = 0; attempt < 24; attempt++) {
          x = cx + (rng() * 2 - 1) * spread;
          z = cz + (rng() * 2 - 1) * spread;
          if (!interior) break; // outdoor: no spatial constraint
          const sh = SHOP.interior;
          if (x < sh.x0 + IN_MARGIN || x > sh.x1 - IN_MARGIN) continue;
          if (z < sh.z0 + IN_MARGIN || z > sh.z1 - IN_MARGIN) continue;
          if (pointInPrism(x, z)) continue;
          break;
        }
      }
      const r = rMin + rng() * (rMax - rMin);
      const yaw = rng() * Math.PI * 2;
      out.push({
        archetypeCode: code,
        x, y: ySurf, z,
        radiusReal: r,
        yaw,
        naturalBand: (code / 10) | 0,
        landmarkId: -1,
        collectibleId: -1,
        interior,
        interiorElevated: interior && ySurf > 0,
        releaseGated: false,
        yK: 1,
        colorHex: -1,
        rIntent,
      });
    }
  }
}

/**
 * THE flat curated placement list (world/curated.js slot source).
 * @type {CuratedPlacement[]}
 */
export const PLACEMENTS = [];
{
  const rng = mulberry32(0x544f4b59); // 'TOKY' — seed-independent authoring stream
  expandClusters(rng, INTERIOR_CLUSTERS, true, PLACEMENTS);
  expandClusters(rng, STREET_CLUSTERS, false, PLACEMENTS);
  expandClusters(rng, GUTTER_CLUSTERS, false, PLACEMENTS);
  expandClusters(rng, DISTRICT_CLUSTERS, false, PLACEMENTS);

  // 13 collectibles (FLAG_RARE|FLAG_CURATED in curated.js; gold tint).
  // v5: id 12 (スタックチャン) is also a shop-interior shelf item.
  for (const cdef of COLLECTIBLES) {
    const inShop = cdef.id <= 3 || cdef.id === 12;
    PLACEMENTS.push({
      archetypeCode: cdef.archetypeCode,
      x: cdef.x, y: cdef.y, z: cdef.z,
      radiusReal: cdef.radiusReal,
      yaw: 0,
      naturalBand: cdef.naturalBand,
      landmarkId: cdef.landmarkId,
      collectibleId: cdef.id,
      interior: inShop,
      interiorElevated: inShop && cdef.y > 0,
      releaseGated: false,
      yK: 1,
      colorHex: GOLD,
      rIntent: cdef.rIntent,
    });
  }

  // 11 landmark singletons (ハチ公 id 0 came from COLLECTIBLES above;
  // レインボーブリッジ id 9 emits 3 span placements).
  for (const ld of LANDMARKS) {
    if (ld.landmarkId === 0) continue; // dual-tagged via collectible id 10
    if (ld.landmarkId === 9) {
      for (const sp of BRIDGE_SPANS) {
        PLACEMENTS.push({
          archetypeCode: ld.archetypeCode,
          x: sp.x, y: 0, z: sp.z,
          radiusReal: ld.dioramaR,
          yaw: 0,
          naturalBand: ld.naturalBand,
          landmarkId: ld.landmarkId,
          collectibleId: -1,
          interior: false, interiorElevated: false, releaseGated: false,
          yK: 0.35, // low deck profile
          colorHex: ld.colorHex,
          rIntent: ld.dioramaR / ABSORB_RATIO,
        });
      }
      continue;
    }
    PLACEMENTS.push({
      archetypeCode: ld.archetypeCode,
      x: ld.x, y: 0, z: ld.z,
      radiusReal: ld.dioramaR,
      yaw: 0,
      naturalBand: ld.naturalBand,
      landmarkId: ld.landmarkId,
      collectibleId: -1,
      interior: false, interiorElevated: false, releaseGated: false,
      yK: ld.landmarkId === 5 ? 0.05 : 1, // scramble decal lies flat
      colorHex: ld.colorHex,
      rIntent: ld.dioramaR / ABSORB_RATIO,
    });
  }

  // Shop shell 「センゴク電子」 — activates only after the terrain release
  // (trueRadius >= SHOP_TERRAIN_RELEASE_M); absorbable @ 4.0/0.65 ~ 6.2m.
  PLACEMENTS.push({
    archetypeCode: CODE_SHOP_SHELL,
    x: SHOP.center.x, y: 0, z: SHOP.center.z,
    radiusReal: 4.0,
    yaw: 0,
    naturalBand: 3,
    landmarkId: -1,
    collectibleId: -1,
    interior: false, interiorElevated: false,
    releaseGated: true,
    yK: 1,
    colorHex: 0xc9b9a0,
    rIntent: 6.2,
  });

  /* ---- v5 expansion appendix (DETERMINISM LAW): a SEPARATE rng stream,
   * appended strictly AFTER the v4 block above — the 0x544f4b59 stream is
   * never touched, so every v4 placement stays byte-identical (no
   * opening-minute regression risk from an rng-stream shift). ---- */
  const rng2 = mulberry32(0x56355041); // 'V5PA' — v5 authoring stream
  expandClusters(rng2, V5_OPENING_CLUSTERS, true, PLACEMENTS);
  expandClusters(rng2, V5_TRAIL_CLUSTERS, true, PLACEMENTS);

  // 6 akiba building singletons (codes 111..114; explicit naturalBand 4 —
  // the chunk-code (code/10)|0 rule does not apply to EXTRA appendix codes).
  // colorHex 0xffffff (identity tint, landmark convention): these archetypes
  // are fully vertex-colored (signage bands / pink awnings) — colorHex -1
  // would fall back to the curated FALLBACK_PALETTE greys, which multiply
  // the vertex colors and wash the facades to dull grey (v5 integration fix).
  for (const [code, x, z, r] of V5_AKIBA_CLUSTERS) {
    PLACEMENTS.push({
      archetypeCode: code,
      x, y: 0, z,
      radiusReal: r,
      yaw: rng2() * Math.PI * 2,
      naturalBand: 4,
      landmarkId: -1,
      collectibleId: -1,
      interior: false, interiorElevated: false, releaseGated: false,
      yK: 1,
      colorHex: 0xffffff,
      rIntent: r / ABSORB_RATIO,
    });
  }
}

/* ================================================================== */
/* validateCityMap()                                                   */
/* ================================================================== */

/**
 * Validate every authored-data invariant from docs/DESIGN-V3.md §箱庭東京マップ.
 * Throws on violation; prints the aisle table, the street growth-chain table,
 * the landmark threshold ladder and the interior growth budget. DEV builds
 * run it at module load; headless tests call it directly.
 * @returns {true}
 */
export function validateCityMap() {
  /** @param {boolean} cond @param {string} msg */
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`[cityMap invariant] ${msg}`);
  };
  const log = (...a) => console.log('[cityMap]', ...a);

  /* ---- counts ---- */
  assert(PLACEMENTS.length <= CURATED_PLACEMENT_CAP,
    `PLACEMENTS ${PLACEMENTS.length} exceeds CURATED_PLACEMENT_CAP ${CURATED_PLACEMENT_CAP}`);
  for (const p of PLACEMENTS) {
    // Codes 0..92 (chunk + frozen EXTRA) plus the v5 appendix 110..114.
    assert(
      Number.isInteger(p.archetypeCode) &&
      ((p.archetypeCode >= 0 && p.archetypeCode <= 92) ||
        (p.archetypeCode >= CODE_STACK_CHAN && p.archetypeCode <= CODE_PC_PARTS_BLDG)),
      `placement archetypeCode out of range: ${p.archetypeCode}`);
    assert(p.radiusReal > 0, 'placement radiusReal must be > 0');
    assert(p.naturalBand >= 0 && p.naturalBand <= 6, 'naturalBand out of range');
    assert(
      p.x >= MAP_BOUNDS.x[0] && p.x <= MAP_BOUNDS.x[1] &&
      p.z >= MAP_BOUNDS.z[0] && p.z <= MAP_BOUNDS.z[1],
      `placement outside MAP_BOUNDS at (${p.x}, ${p.z})`
    );
  }

  /* ---- collectible ids: unique, < 31, code rule via collectibleCodeForId
   *      (70 + id for ids 0..11; v5 appendix 110 + (id - 12) for ids 12+ —
   *      objects.js is the single mapping authority) ---- */
  {
    const ids = Object.values(COLLECTIBLE_IDS);
    const seen = new Set();
    for (const id of ids) {
      assert(Number.isInteger(id) && id >= 0 && id < 31, `collectible id ${id} must be an int < 31 (LS mask)`);
      assert(!seen.has(id), `duplicate collectible id ${id}`);
      seen.add(id);
    }
    assert(COLLECTIBLES.length === 13, 'exactly 13 collectible defs in v5');
    for (const cd of COLLECTIBLES) {
      assert(seen.has(cd.id), `collectible def id ${cd.id} missing from COLLECTIBLE_IDS`);
      assert(cd.archetypeCode === collectibleCodeForId(cd.id),
        `collectible ${cd.id}: code ${cd.archetypeCode} != collectibleCodeForId ${collectibleCodeForId(cd.id)}`);
    }
    // The frozen 70+id range must never be extended past 81 (82 = 西郷さん像).
    for (const cd of COLLECTIBLES) {
      if (cd.id <= 11) assert(cd.archetypeCode === EXTRA_CODE_BASE + cd.id, `v3/v4 collectible ${cd.id}: code must be 70 + id`);
      else assert(cd.archetypeCode >= CODE_STACK_CHAN, `v5 collectible ${cd.id}: code must be in the 110+ appendix`);
    }
  }

  /* ---- landmark ladder (absorb threshold = dioramaR / ABSORB_RATIO) ---- */
  {
    let prev = 0;
    const rows = [];
    for (const ld of LANDMARKS) {
      const at = ld.dioramaR / ABSORB_RATIO;
      rows.push(`  L${ld.landmarkId} ${ld.nameJa}: dioramaR ${ld.dioramaR}m -> absorbable @ ${at.toFixed(1)}m`);
      // スクランブル交差点 (id 5) is OFF the ladder by spec — its 'absorbable'
      // entry is the T2-size crowd, the flat decal is incidental.
      if (ld.landmarkId !== 5) {
        assert(at > prev, `landmark ladder must be strictly increasing at ${ld.nameJa}`);
        prev = at;
      }
      assert(ld.collisionScale > 0 && ld.collisionScale <= 1, `landmark ${ld.nameJa}: collisionScale`);
    }
    log('landmark threshold ladder:\n' + rows.join('\n'));
  }

  /* ---- finale always wins over the base collider ---- */
  assert(SKYTREE_COLLIDER_K < GOAL_CONTACT_PAD,
    `SKYTREE_COLLIDER_K ${SKYTREE_COLLIDER_K} must be < GOAL_CONTACT_PAD ${GOAL_CONTACT_PAD}`);
  assert(
    SKYTREE_POS.x >= MAP_BOUNDS.x[0] && SKYTREE_POS.x <= MAP_BOUNDS.x[1] &&
    SKYTREE_POS.z >= MAP_BOUNDS.z[0] && SKYTREE_POS.z <= MAP_BOUNDS.z[1],
    'SKYTREE_POS inside MAP_BOUNDS'
  );

  /* ---- zones inside bounds; shop interior masked 0 ---- */
  for (const zn of ZONES) {
    assert(zn.x0 < zn.x1 && zn.z0 < zn.z1, 'zone rect degenerate');
    assert(
      zn.x0 >= MAP_BOUNDS.x[0] && zn.x1 <= MAP_BOUNDS.x[1] &&
      zn.z0 >= MAP_BOUNDS.z[0] && zn.z1 <= MAP_BOUNDS.z[1],
      'zone rect outside MAP_BOUNDS'
    );
  }
  for (let b = 0; b <= 6; b++) {
    assert(!bandAllowedAt(SHOP.center.x, SHOP.center.z, b), 'shop interior must be mask 0');
    assert(!bandAllowedAt(MAP_BOUNDS.x[1] + 1, 0, b), 'outside bounds must be mask 0');
  }
  assert(!bandAllowedAt(500, 0, 0) && !bandAllowedAt(500, 0, 1),
    'bands 0/1 are curated-only (allowed nowhere)');
  assert(bandAllowedAt(100, 100, 2), 'akiba blocks must allow band 2');
  assert(bandAllowedAt(1500, 0, 6), 'T6 must be allowed map-wide (general fill)');

  /* ---- shop geometry: aisles, ball start, exit lane ---- */
  const sh = SHOP.interior;
  const ps = SHOP.prisms;
  {
    // Aisle table: the 5 spec pairs (binding, min 1.1 m).
    const aisles = [
      ['central band P1<->P2 (z)', ps[1].z0 - ps[0].z1], // 0.8 - (-1.6) = 2.4
      ['P1 <-> P3 (x)', ps[2].x0 - ps[0].x1], // 1.2 - 0.1 = 1.1
      ['P2 <-> P4 (x)', ps[3].x0 - ps[1].x1], // 2.0 - 0.1 = 1.9
      ['P4 <-> E wall (x)', sh.x1 - ps[3].x1], // 4.6 - 3.4 = 1.2
      ['P4 <-> S wall (z)', sh.z1 - ps[3].z1], // 3.2 - 2.0 = 1.2
    ];
    const rows = [];
    for (const [name, gap] of aisles) {
      rows.push(`  ${name}: ${gap.toFixed(2)}m`);
      assert(gap >= 1.1 - 1e-9, `aisle '${name}' must be >= 1.1m (got ${gap})`);
    }
    // Documented dead-end pocket P3 <-> E wall (0.7 m, open to the corridor at
    // z > -3.4 — no seal/stranding possible on a flat floor, ball just backs out).
    rows.push(`  (pocket P3 <-> E wall: ${(sh.x1 - ps[2].x1).toFixed(2)}m — open, documented)`);
    log('aisle table:\n' + rows.join('\n'));

    // Ball start (0,0): inside interior, outside every prism, clear of walls.
    assert(!pointInPrism(0, 0), 'ball start must not be inside a prism footprint');
    let minD = Infinity;
    for (const p of ps) {
      const dx = Math.max(p.x0 - 0, 0, 0 - p.x1);
      const dz = Math.max(p.z0 - 0, 0, 0 - p.z1);
      minD = Math.min(minD, Math.hypot(dx, dz));
    }
    assert(minD >= 0.3, `ball-start prism clearance >= 0.3m (got ${minD.toFixed(2)})`);

    // Exit lane: straight +X corridor |z| <= 0.35 from origin through the gate
    // — must intersect no prism, and the gate must span z = 0.
    for (const p of ps) {
      const hit = p.x0 <= 5.6 && p.x1 >= 0 && p.z0 <= 0.35 && p.z1 >= -0.35;
      assert(!hit, 'exit lane (+X, |z|<=0.35) blocked by a prism');
    }
    assert(SHOP.openFront.z0 < -0.35 && SHOP.openFront.z1 > 0.35, 'open front must span the exit lane');
  }

  /* ---- interior placements: rect, prism footprints, height cap, reach ---- */
  let sigmaR3 = 0;
  let interiorCount = 0;
  const reachK = 1 + PICKUP_FORGIVE_K; // 1.45 — forgiven 3D absorb reach
  for (const p of PLACEMENTS) {
    if (!p.interior) continue;
    interiorCount++;
    sigmaR3 += p.radiusReal ** 3;
    assert(p.y <= INTERIOR_ITEM_Y_MAX + 1e-9, `interior item height ${p.y} > INTERIOR_ITEM_Y_MAX`);
    assert(
      p.x >= sh.x0 && p.x <= sh.x1 && p.z >= sh.z0 && p.z <= sh.z1,
      `interior placement outside the interior rect at (${p.x.toFixed(2)}, ${p.z.toFixed(2)})`
    );
    // Footprint rule: floor items must not sit inside a prism; elevated items
    // MUST sit on the prism whose top is their surface height.
    let onPrism = null;
    for (const pr of ps) {
      if (p.x >= pr.x0 && p.x <= pr.x1 && p.z >= pr.z0 && p.z <= pr.z1) onPrism = pr;
    }
    if (p.y === 0) {
      assert(onPrism === null, `floor placement inside a prism footprint at (${p.x.toFixed(2)}, ${p.z.toFixed(2)})`);
    } else {
      assert(onPrism !== null && p.y <= onPrism.h + 1e-9,
        `elevated placement (y=${p.y}) must rest on a prism of sufficient height`);
    }
    // 3D-reach inequality at the intended tier radius:
    //   sqrt(dXZ^2 + (yCenter - r)^2) <= (1 + PICKUP_FORGIVE_K) * r + objR
    // with dXZ = inset-from-nearest-open-face + r (dXZ >= r).
    const objR = p.radiusReal;
    const r = Math.max(p.rIntent || 0, objR / ABSORB_RATIO);
    let inset = 0;
    if (onPrism !== null) {
      inset = Math.min(
        p.x - onPrism.x0, onPrism.x1 - p.x,
        p.z - onPrism.z0, onPrism.z1 - p.z
      );
    }
    const dXZ = inset + r;
    const yCenter = p.y + objR;
    const lhs = Math.hypot(dXZ, yCenter - r);
    const rhs = reachK * r + objR;
    assert(lhs <= rhs + 1e-9,
      `3D-reach fails at (${p.x.toFixed(2)}, ${p.z.toFixed(2)}) y=${p.y} objR=${objR.toFixed(3)} ` +
      `rIntent=${r.toFixed(2)}: ${lhs.toFixed(3)} > ${rhs.toFixed(3)}`);
  }

  /* ---- growth budget + NO-SEAL ---- */
  {
    const fullClear = Math.cbrt(START_RADIUS_M ** 3 + GROWTH_K * sigmaR3);
    const gate = SHOP.openFront.gateRadiusM;
    log(`interior placements: ${interiorCount}, SigmaR^3 = ${sigmaR3.toFixed(4)} m^3, ` +
      `full-clear radius = ${fullClear.toFixed(3)} m (gate r ${gate} m)`);
    assert(fullClear < 0.5 * gate,
      `NO-SEAL: full-clear ${fullClear.toFixed(3)} must be < 0.5 * gate ${0.5 * gate}`);
    assert(fullClear >= 0.28, `growth budget: full-clear ${fullClear.toFixed(3)} must support r ~0.30m`);
    assert(fullClear <= 0.58, `growth budget: full-clear ${fullClear.toFixed(3)} should stay <= ~0.55m`);
  }

  /* ---- street growth chain (exit radii -> absorbable supply <= 150 m) ---- */
  {
    const rows = [];
    for (const r of [0.10, 0.15, 0.25, 0.4]) {
      let count = 0;
      for (const p of PLACEMENTS) {
        if (p.interior) continue;
        if (p.radiusReal > ABSORB_RATIO * r) continue;
        if (Math.hypot(p.x, p.z) > 150) continue;
        count++;
      }
      rows.push(`  exit r=${r}m: ${count} absorbables (objR <= ${(ABSORB_RATIO * r).toFixed(3)}m) within 150m`);
      assert(count >= 8, `growth chain: need >= 8 absorbables within 150m for exit r=${r} (got ${count})`);
    }
    log('street growth-chain table:\n' + rows.join('\n'));
  }

  /* ---- landmark/collectible placements present exactly once ---- */
  {
    const lmCount = new Array(11).fill(0);
    const colCount = new Array(13).fill(0);
    let shell = 0;
    for (const p of PLACEMENTS) {
      if (p.landmarkId >= 0) lmCount[p.landmarkId]++;
      if (p.collectibleId >= 0) colCount[p.collectibleId]++;
      if (p.archetypeCode === CODE_SHOP_SHELL) shell++;
    }
    for (let i = 0; i < 11; i++) {
      const want = i === 9 ? 3 : 1; // bridge = 3 spans
      assert(lmCount[i] === want, `landmark ${i} placement count ${lmCount[i]} != ${want}`);
    }
    for (let i = 0; i < 13; i++) assert(colCount[i] === 1, `collectible ${i} placement count != 1`);
    assert(shell === 1, 'exactly one shop-shell placement');
  }

  /* ---- v5 appendix placements (akiba buildings + スタックチャン) ---- */
  {
    // Expected concurrency per v5 code (extraPools capacity audit input).
    const wantByCode = { 110: 1, 111: 2, 112: 1, 113: 1, 114: 2 };
    const gotByCode = { 110: 0, 111: 0, 112: 0, 113: 0, 114: 0 };
    const rk = LANDMARKS[3]; // ラジオ会館風ビル (dioramaR 24) — strip neighbor
    for (const p of PLACEMENTS) {
      if (p.archetypeCode < CODE_STACK_CHAN || p.archetypeCode > CODE_PC_PARTS_BLDG) continue;
      gotByCode[p.archetypeCode]++;
      if (p.archetypeCode === CODE_STACK_CHAN) continue; // interior shelf item
      // Building footprints stay east of the curated strip edge (x = 25)...
      assert(p.x - p.radiusReal > 25,
        `v5 akiba building code ${p.archetypeCode} at (${p.x}, ${p.z}) overlaps the curated strip`);
      // ...and clear of the ラジオ会館風ビル landmark disc.
      const d = Math.hypot(p.x - rk.x, p.z - rk.z);
      assert(d >= rk.dioramaR + p.radiusReal - 1e-9,
        `v5 akiba building code ${p.archetypeCode} at (${p.x}, ${p.z}) intersects ラジオ会館風ビル (d=${d.toFixed(1)})`);
      assert(p.naturalBand === 4 && p.rIntent >= p.radiusReal / ABSORB_RATIO - 1e-9,
        `v5 akiba building code ${p.archetypeCode}: band/rIntent rule`);
    }
    for (const code of Object.keys(wantByCode)) {
      assert(gotByCode[code] === wantByCode[code],
        `v5 code ${code} placement count ${gotByCode[code]} != ${wantByCode[code]}`);
    }
  }

  /* ================================================================ */
  /* v4 OSM geography asserts (docs/DESIGN-V4.md — Stream W)           */
  /* ================================================================ */

  /* ---- coverage rects EXACTLY equal the geo.mjs-generated values ----
     (identical projection formulas -> identical IEEE doubles; the pasted
     cross-check constants prove neither side drifted). */
  {
    const pairs = [
      ['shibuya', OSM_COVERAGE.shibuyaRect, SHIBUYA_RECT_XCHECK],
      ['asakusa', OSM_COVERAGE.asakusaRect, ASAKUSA_RECT_XCHECK],
    ];
    for (const [name, got, want] of pairs) {
      for (const k of ['x0', 'x1', 'z0', 'z1']) {
        assert(got[k] === want[k],
          `OSM coverage ${name}.${k} drifted: ${got[k]} !== geo.mjs ${want[k]}`);
      }
      assert(
        got.x0 >= MAP_BOUNDS.x[0] && got.x1 <= MAP_BOUNDS.x[1] &&
        got.z0 >= MAP_BOUNDS.z[0] && got.z1 <= MAP_BOUNDS.z[1],
        `OSM coverage ${name} rect outside MAP_BOUNDS`
      );
    }
    assert(OSM_COVERAGE.detailRadiusGameM === 500, 'detail disc must be 500 game m');
    assert(inOsmCoverage(0, 0) && inOsmCoverage(30, 0), 'origin/street must be inside coverage');
    assert(!inOsmCoverage(OSM_GEN.diet.x, OSM_GEN.diet.z),
      '国会議事堂 is OUTSIDE detail coverage by design');
  }

  /* ---- reconciled landmark positions: bounds + REAL-distance truth ----
     (real distance = game distance / OSM_HORIZ_K — structurally catches any
     hand-typed/stale OSM_GEN row). */
  {
    for (const [key, e] of Object.entries(OSM_GEN)) {
      assert(
        e.x >= MAP_BOUNDS.x[0] && e.x <= MAP_BOUNDS.x[1] &&
        e.z >= MAP_BOUNDS.z[0] && e.z <= MAP_BOUNDS.z[1],
        `OSM_GEN.${key} outside MAP_BOUNDS at (${e.x}, ${e.z})`
      );
    }
    const rows = [];
    for (const gt of DISTANCE_GROUND_TRUTH) {
      const a = OSM_GEN[gt.a];
      const b = OSM_GEN[gt.b];
      const realM = Math.hypot(a.x - b.x, a.z - b.z) / OSM_HORIZ_K;
      rows.push(`  ${gt.a}<->${gt.b}: ${realM.toFixed(0)} m real (want ${gt.minM}..${gt.maxM})`);
      assert(realM >= gt.minM && realM <= gt.maxM,
        `landmark distance ${gt.a}<->${gt.b} = ${realM.toFixed(0)} m real outside [${gt.minM}, ${gt.maxM}]`);
    }
    log('v4 inter-landmark distance cross-checks:\n' + rows.join('\n'));
    // Rainbow Bridge: TRUE span window (the draft's 2.1 km hand-typing error
    // is structurally impossible now).
    const rb = OSM_GEN.rainbow_bridge;
    const spanGame = Math.hypot(rb.endB.x - rb.endA.x, rb.endB.z - rb.endA.z);
    const spanReal = spanGame / OSM_HORIZ_K;
    assert(spanReal >= BRIDGE_SPAN_REAL_M.min && spanReal <= BRIDGE_SPAN_REAL_M.max,
      `bridge span ${spanReal.toFixed(0)} m real outside [${BRIDGE_SPAN_REAL_M.min}, ${BRIDGE_SPAN_REAL_M.max}]`);
    assert(Math.abs(spanGame - rb.spanGameM) < 1, 'bridge endA/endB vs spanGameM desync');
    // SKYTREE_POS = rounded reconciled goal (DESIGN-V4 frozen (749, -252)).
    assert(SKYTREE_POS.x === 749 && SKYTREE_POS.z === -252,
      `SKYTREE_POS (${SKYTREE_POS.x}, ${SKYTREE_POS.z}) != frozen generated (749, -252)`);
  }

  /* ---- OSM exclusions: built once, every circle covers dioramaR*1.2 ---- */
  {
    assert(Array.isArray(OSM_EXCLUSIONS) && OSM_EXCLUSIONS.length === 9,
      'OSM_EXCLUSIONS must be shop + strip + 6 landmark circles + skytree');
    const idByKey = {
      radio_kaikan: 3, shibuya109: 4, tokyo_station: 7,
      diet: 8, dome: 6, kaminarimon: 2,
    };
    for (const ex of OSM_EXCLUSIONS) {
      if (ex.kind !== 'circle' || ex.label === 'skytree base') continue;
      const key = ex.label.split(' ')[1];
      const ld = LANDMARKS[idByKey[key]];
      assert(ld !== undefined, `exclusion label ${ex.label} resolves no landmark`);
      assert(ex.x === ld.x && ex.z === ld.z, `exclusion ${key} not centered on its landmark`);
      assert(Math.abs(ex.r - ld.dioramaR * 1.2) < 1e-9,
        `exclusion ${key} r ${ex.r} != dioramaR*1.2 ${ld.dioramaR * 1.2}`);
    }
    const sky = OSM_EXCLUSIONS[OSM_EXCLUSIONS.length - 1];
    assert(sky.label === 'skytree base' && sky.r === 110, 'skytree exclusion r=110 game m');
  }

  /* ---- v4 travel-leg reprint (landmark moves change the legs — review
     artifact; Phase-3 runs decide any dioramaR nudges) ---- */
  {
    const leg = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
    const rows = [
      `  議事堂 -> タワー: ${leg(OSM_GEN.diet, OSM_GEN.tokyo_tower).toFixed(0)} game m (~390 expected)`,
      `  タワー -> スカイツリー: ${leg(OSM_GEN.tokyo_tower, OSM_GEN.skytree).toFixed(0)} game m (~1,640 — trivial at r>=406)`,
      `  雷門 -> スカイツリー: ${leg(OSM_GEN.kaminarimon, OSM_GEN.skytree).toFixed(0)} game m`,
    ];
    log('v4 travel legs:\n' + rows.join('\n'));
  }

  log(`OK — ${PLACEMENTS.length} curated placements (cap ${CURATED_PLACEMENT_CAP})`);
  return true;
}

/* DEV builds validate at module load (stripped from prod by the guard). */
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
  validateCityMap();
}
