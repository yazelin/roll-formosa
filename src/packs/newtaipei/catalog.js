/**
 * @file catalog.js — New Taipei pack catalog.
 *
 * Assembles the 70 New Taipei chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * Overrides EXTRA codes 82..89 with the 8 curated New Taipei landmark
 * geometries (九份老街茶樓/十分天燈/鶯歌陶瓷博物館/三峽祖師廟/淡水紅毛城/
 * 平溪車站/林本源園邸/新北市政府). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged placeholders.
 *
 * Exports:
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 New Taipei chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — New Taipei-native
 *     for codes 82..89; remainder from the legacy engine catalog
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// 8 curated New Taipei landmark geometry descriptors (codes 82..89).
import { NM_JIUFEN_TEAHOUSE } from './landmarks/jiufen_teahouse.js';
import { NM_SHIFEN_LANTERN } from './landmarks/shifen_lantern.js';
import { NM_YINGGE_MUSEUM } from './landmarks/yingge_museum.js';
import { NM_SANXIA_TEMPLE } from './landmarks/sanxia_temple.js';
import { NM_FORT_SAN_DOMINGO } from './landmarks/fort_san_domingo.js';
import { NM_PINGXI_STATION } from './landmarks/pingxi_station.js';
import { NM_LIN_FAMILY_GARDEN } from './landmarks/lin_family_garden.js';
import { NM_NEWTAIPEI_CITYHALL } from './landmarks/newtaipei_cityhall.js';

// 13 New Taipei collectible (rare album) geometries (codes 70..81 + 94).
import { COL_AGEI } from './collectibles/agei.js';
import { COL_IRON_EGG } from './collectibles/iron_egg.js';
import { COL_TARO_BALL } from './collectibles/taro_ball.js';
import { COL_FISHBALL } from './collectibles/fishball.js';
import { COL_SKY_LANTERN } from './collectibles/sky_lantern.js';
import { COL_YINGGE_VASE } from './collectibles/yingge_vase.js';
import { COL_TEAPOT } from './collectibles/teapot.js';
import { COL_MINER_LAMP } from './collectibles/miner_lamp.js';
import { COL_SOUR_PLUM_DRINK } from './collectibles/sour_plum_drink.js';
import { COL_CERAMIC_BOWL } from './collectibles/ceramic_bowl.js';
import { COL_PINGXI_TRAIN } from './collectibles/pingxi_train.js';
import { COL_BROWN_SUGAR_CAKE } from './collectibles/brown_sugar_cake.js';
// 媽祖 is shared across Taiwan — reuse from Taipei pack
import { COL_MAZU } from '../taipei/collectibles/mazu.js';

// Extended landmarks (codes 90-93 + 95-98): reuse 情人橋 (goal) placeholder for
// code 93, and fill remaining with placeholder entries.
import { NM_LOVER_BRIDGE } from './landmarks/lover_bridge.js';

/* ================================================================== */
/* 70 chunk archetypes, assembled in tier order (code = tier*10 + slot)*/
/* ================================================================== */

/** @type {import('../../types.js').Archetype[]} */
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
    `[newtaipei/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * New Taipei chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
 * Code i = the archetype at array position i (tier*10 + slot within tier).
 * @type {Record<string, import('../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 placeholders = 99 ids             */
/* ================================================================== */

/**
 * The 8 New Taipei curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the New Taipei landmark id (e.g. 'jiufen_teahouse') not the legacy id.
 * tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 mid, 86 mid, 87 large, 88 large, 89 large.
 */
const _NEWTAIPEI_LANDMARKS = [
  { code: 82, nm: NM_JIUFEN_TEAHOUSE,   sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_SHIFEN_LANTERN,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_YINGGE_MUSEUM,     sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_SANXIA_TEMPLE,     sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_FORT_SAN_DOMINGO,  sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_PINGXI_STATION,    sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_LIN_FAMILY_GARDEN, sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_NEWTAIPEI_CITYHALL,sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 New Taipei chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * New Taipei landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../types.js').Archetype>}
 */
// CATALOG = 70 New Taipei chunk archetypes + the New Taipei EXTRA/v5 (collectibles +
// landmarks) registered by the loops below.
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * New Taipei collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below.
 * @type {Record<number, import('../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _NEWTAIPEI_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground.
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  /** @type {import('../../types.js').Archetype & {extraCode:number, sizeClass:string}} */
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

/* 13 New Taipei collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _NEWTAIPEI_COLLECTIBLES = [
  { code: 70, col: COL_AGEI },
  { code: 71, col: COL_IRON_EGG },
  { code: 72, col: COL_TARO_BALL },
  { code: 73, col: COL_FISHBALL },
  { code: 74, col: COL_SKY_LANTERN },
  { code: 75, col: COL_YINGGE_VASE },
  { code: 76, col: COL_TEAPOT },
  { code: 77, col: COL_MINER_LAMP },
  { code: 78, col: COL_SOUR_PLUM_DRINK },
  { code: 79, col: COL_CERAMIC_BOWL },
  { code: 80, col: COL_PINGXI_TRAIN },
  { code: 81, col: COL_BROWN_SUGAR_CAKE },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _NEWTAIPEI_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // collectibles get the 600-tri hero budget
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* Extended landmark slots (codes 90-93 + 95-98):
   - Code 93: goal display slot (情人橋 — rendered by goalTower.js, display-name-only).
   - Codes 90-92, 95-98: placeholder entries (empty placeholder, not placed). */
const _NEWTAIPEI_EXTRA_LANDMARKS = [
  // Code 93 is the goal display slot — fill with lover_bridge for display name
  { code: 93, nm: NM_LOVER_BRIDGE, sizeClass: 'landmark-xl', tier: 6, naturalBand: 6 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _NEWTAIPEI_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: nm.id,
    displayName: nm.name,
    tier,
    naturalBand,
    radiusNominal: nm.dioramaRHint || 80,
    radiusJitter: 0,
    spawnWeight: 0, // goal — not placed via PLACEMENTS
    palette: [nm.colorHex],
    yOffset: _yOffset,
    upright: true,
    collisionScale: 1.0,
    heroTriCap: HERO_TRI_CAP,
    buildGeometry: nm.buildGeometry.bind(nm),
    extraCode: code,
    sizeClass,
  };
  CATALOG[nm.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

// Fill remaining EXTRA codes (90-92, 95-98) with placeholder entries so 99-code contract holds.
const _PLACEHOLDER_NAMES = {
  90: '預留欄位 90',
  91: '預留欄位 91',
  92: '預留欄位 92',
  95: '預留欄位 95',
  96: '預留欄位 96',
  97: '預留欄位 97',
  98: '預留欄位 98',
};
for (const code of [90, 91, 92, 95, 96, 97, 98]) {
  if (!EXTRA_SIZE_CLASS_BY_CODE[code]) {
    EXTRA_SIZE_CLASS_BY_CODE[code] = null;
    // Create a minimal placeholder entry for the code
    const placeholderId = `extra_placeholder_${code}`;
    const entry = {
      id: placeholderId,
      displayName: _PLACEHOLDER_NAMES[code],
      tier: 6,
      naturalBand: 6,
      radiusNominal: 50,
      radiusJitter: 0,
      spawnWeight: 0,
      palette: [0x808080],
      yOffset: 0,
      upright: true,
      collisionScale: 1.0,
      heroTriCap: HERO_TRI_CAP,
      // geometryFactory BUILDS every CATALOG id — null crashed DEV boot. Reuse a
      // real (already tri-capped) landmark; these codes are spawnWeight 0 / unplaced.
      buildGeometry: CATALOG['jiufen_teahouse'].buildGeometry,
      extraCode: code,
      sizeClass: null,
    };
    CATALOG[placeholderId] = entry;
    EXTRA_CATALOG[code] = entry;
  }
}

/**
 * EXTRA render pool caps. New Taipei has 8 landmark singletons:
 *   landmark-mid (codes 82/83/84/85/86): 5 alive
 *   landmark-large (codes 87/88/89): 3 alive
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
 *   0..69  — zh-TW names from the New Taipei chunk archetypes (displayName field)
 *   70..81 — New Taipei collectible zh-TW names
 *   82..89 — New Taipei landmark zh-TW names
 *   90..98 — placeholder names (shop shell, bridge, tower, v5)
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init '' then override with actual names.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with New Taipei landmark zh-TW names.
  for (const { code, nm } of _NEWTAIPEI_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with New Taipei collectible zh-TW names.
  for (const { code, col } of _NEWTAIPEI_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Code 93: goal display name (情人橋)
  names[93] = NM_LOVER_BRIDGE.name;

  // Codes 90-92, 95-98: placeholder names (must be non-empty for test)
  names[90] = '預留欄位 90';
  names[91] = '預留欄位 91';
  names[92] = '預留欄位 92';
  names[95] = '預留欄位 95';
  names[96] = '預留欄位 96';
  names[97] = '預留欄位 97';
  names[98] = '預留欄位 98';

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[newtaipei/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
