/**
 * @file catalog.js — Penghu pack catalog (P5/P6b).
 *
 * Assembles the 70 Penghu chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Penghu landmark
 * geometries (雙心石滬/天后宮/中央老街/大菓葉玄武岩/漁翁島燈塔/
 * 二崁聚落/鯨魚洞/風櫃洞). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged placeholders.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Penghu chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Penghu-native
 *     for codes 82..89; remainder from the legacy engine catalog
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

// DE-TOKYO: the legacy engine catalog is deleted; every EXTRA/v5 code
// (70..98) is now Penghu (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Penghu landmark geometry descriptors (codes 82..89).
import { NM_DOUBLE_HEART } from './landmarks/double_heart_weir.js';
import { NM_TIANHOU } from './landmarks/tianhou_temple.js';
import { NM_ZHONGYANG } from './landmarks/zhongyangstreet.js';
import { NM_DAGUOYE } from './landmarks/daguoye_basalt.js';
import { NM_XIYU_LIGHTHOUSE as NM_LIGHTHOUSE } from './landmarks/xiyu_lighthouse.js';
import { NM_ERKAN } from './landmarks/erkan_village.js';
import { NM_WHALE_CAVE as NM_WHALE } from './landmarks/whale_cave.js';
import { NM_FENGGUI } from './landmarks/fenggui_cave.js';

// P7: 13 Penghu collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_CACTUS_ICE } from './collectibles/cactus_ice.js';
import { COL_BROWN_SUGAR_CAKE } from './collectibles/brown_sugar_cake.js';
import { COL_DRIED_SQUID } from './collectibles/dried_squid.js';
import { COL_SEA_URCHIN } from './collectibles/sea_urchin.js';
import { COL_WINDLION } from './collectibles/windlion.js';
import { COL_CORAL_STONE } from './collectibles/coral_stone.js';
import { COL_PEANUT_CANDY } from './collectibles/peanut_candy.js';
import { COL_FISHING_BOAT } from './collectibles/fishing_boat.js';
import { COL_ALOE } from './collectibles/aloe_product.js';
import { COL_BASALT } from './collectibles/basalt_souvenir.js';
import { COL_SEASHELL } from './collectibles/seashell.js';
import { COL_MAZU } from './collectibles/mazu.js';

// DE-TOKYO: Penghu extended landmarks to replace the leftover EXTRA slots (codes 90-93 + 95-98).
// For Penghu, we just use the goal monument reference for slot 93 and leave 90-92/95-98 as placeholders.
import { NM_CROSS_SEA_BRIDGE } from './landmarks/cross_sea_bridge.js';

/* ================================================================== */
/* 70 chunk archetypes, assembled in tier order (code = tier*10 + slot)*/
/* ================================================================== */

/** @type {import('../../../types.js').Archetype[]} */
const _allTierArchetypes = [
  ...T0_ARCHETYPES,
  ...T1_ARCHETYPES,
  ...T2_ARCHETYPES,
  ...T3_ARCHETYPES,
  ...T4_ARCHETYPES,
  ...T5_ARCHETYPES,
  ...T6_ARCHETYPES,
];

if (_allTierArchetypes.length !== 70) {
  throw new Error(
    `[penghu/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Penghu chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
 * Code i = the archetype at array position i (tier*10 + slot within tier).
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 placeholders = 99 ids             */
/* ================================================================== */

/**
 * The 8 Penghu curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Penghu landmark id (e.g. 'double_heart_weir') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _PENGHU_LANDMARKS = [
  { code: 82, nm: NM_DOUBLE_HEART, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_TIANHOU,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_ZHONGYANG,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_DAGUOYE,      sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_LIGHTHOUSE,   sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_ERKAN,        sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_WHALE,        sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_FENGGUI,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Penghu chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Penghu landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Penghu chunk archetypes + the Penghu EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Penghu collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _PENGHU_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground. A fixed
  // -0.2 left wide/low landmarks (雙心石滬/天后宮/...) floating (P6b bug).
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  /** @type {import('../../../types.js').Archetype & {extraCode:number, sizeClass:string}} */
  const entry = {
    id: nm.id,
    displayName: nm.name,
    tier,
    naturalBand,
    radiusNominal: nm.dioramaRHint,
    radiusJitter: 0,
    spawnWeight: 0, // curated-only — never random-rolled
    palette: [nm.colorHex],
    yOffset: _yOffset,
    upright: true,
    collisionScale: 1.0,
    heroTriCap: HERO_TRI_CAP, // landmark geometries use the 600-tri hero budget
    buildGeometry: nm.buildGeometry.bind(nm),
    extraCode: code,
    sizeClass,
  };
  CATALOG[nm.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/* P7: 13 Penghu collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _PENGHU_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_CACTUS_ICE },
  { code: 72, col: COL_BROWN_SUGAR_CAKE },
  { code: 73, col: COL_DRIED_SQUID },
  { code: 74, col: COL_SEA_URCHIN },
  { code: 75, col: COL_WINDLION },
  { code: 76, col: COL_CORAL_STONE },
  { code: 77, col: COL_PEANUT_CANDY },
  { code: 78, col: COL_FISHING_BOAT },
  { code: 79, col: COL_ALOE },
  { code: 80, col: COL_BASALT },
  { code: 81, col: COL_SEASHELL },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _PENGHU_COLLECTIBLES) {
  const _g = col.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: col.id,
    displayName: col.name,
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.3,
    radiusJitter: 0,
    spawnWeight: 0, // curated-only — placed, never random-rolled
    palette: [col.colorHex],
    yOffset: _yOffset,
    upright: true,
    collisionScale: 1.0,
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* Penghu extended landmarks at codes 90-93 + 95-98: for Penghu pack,
   code 93 is the goal display slot (跨海大橋). Others are placeholder duplicates
   of smaller landmarks (not placed, but codes must resolve). */
const _PENGHU_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_DOUBLE_HEART, sizeClass: 'landmark-xl',  tier: 3, naturalBand: 3 },
  { code: 91, nm: NM_TIANHOU,      sizeClass: 'landmark-xl',  tier: 3, naturalBand: 3 },
  { code: 92, nm: NM_ZHONGYANG,    sizeClass: 'landmark-xl',  tier: 3, naturalBand: 3 },
  { code: 93, nm: NM_CROSS_SEA_BRIDGE, sizeClass: 'landmark-xl',  tier: 6, naturalBand: 6 },
  { code: 95, nm: NM_DAGUOYE,      sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_LIGHTHOUSE,   sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 97, nm: NM_ERKAN,        sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_WHALE,        sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _PENGHU_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: nm.id,
    displayName: nm.name,
    tier,
    naturalBand,
    radiusNominal: nm.dioramaRHint || (sizeClass === 'landmark-xl' ? 80 : 30),
    radiusJitter: 0,
    spawnWeight: 0, // curated-only — not placed yet
    palette: [nm.colorHex],
    yOffset: _yOffset,
    upright: true,
    collisionScale: 1.0,
    heroTriCap: HERO_TRI_CAP,
    buildGeometry: nm.buildGeometry.bind(nm),
    extraCode: code,
    sizeClass,
  };
  // For extended slots, only register in EXTRA_CATALOG if not already registered
  // (avoid overwriting the primary landmark entry in CATALOG)
  if (!CATALOG[nm.id]) {
    CATALOG[nm.id] = entry;
  }
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/**
 * EXTRA render pool caps. Penghu has 8 landmark singletons:
 *   landmark-mid (codes 82/83/84/86): 4 alive (matches the original engine floor)
 *   landmark-large (codes 85/87/88/89): 4 alive
 * Caps are capacity only — same 4 batches, zero extra draws.
 * @type {Readonly<Record<string, number>>}
 */
export const EXTRA_POOL_CAPS = Object.freeze({
  'collectible-small': 13,
  'landmark-mid': 12,
  'landmark-large': 4,
  'landmark-xl': 4,
});

/* ================================================================== */
/* DISPLAY_NAME_BY_CODE — string[99]                                   */
/* ================================================================== */

/**
 * Code-indexed display names (99 total):
 *   0..69  — zh-TW names from the Penghu chunk archetypes (displayName field)
 *   70..81 — Penghu collectible names
 *   82..89 — Penghu landmark zh-TW names (P6b)
 *   90..98 — Penghu extended landmark names (v5)
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Penghu zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Penghu landmark zh-TW names.
  for (const { code, nm } of _PENGHU_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Penghu collectible zh-TW names (P7).
  for (const { code, col } of _PENGHU_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Penghu extended landmark zh-TW names.
  for (const { code, nm } of _PENGHU_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[penghu/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
