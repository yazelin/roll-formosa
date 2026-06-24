/**
 * @file catalog.js — Nantou pack catalog.
 *
 * Assembles the 70 Nantou chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 entries so all 99 codes resolve.
 *
 * Nantou: overrides EXTRA codes 82..89 with the 8 curated Nantou landmark
 * geometries (文武廟/玄光寺/九族文化村/清境小瑞士/紙教堂/集集車站/
 * 日月潭纜車/埔里酒廠). Codes 70..81 (collectibles), 90..93+95..98
 * (extended landmarks), and v5 94 are nantou-specific.
 *
 * Exports:
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Nantou chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — zh-TW names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS
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

// 8 curated Nantou landmark geometry descriptors (codes 82..89).
import { NM_WENWU_TEMPLE } from './landmarks/wenwu_temple.js';
import { NM_XUANGUANG_TEMPLE } from './landmarks/xuanguang_temple.js';
import { NM_FORMOSAN_VILLAGE } from './landmarks/formosan_village.js';
import { NM_QINGJING_SWISS } from './landmarks/qingjing_swiss.js';
import { NM_PAPER_DOME } from './landmarks/paper_dome.js';
import { NM_JIJI_STATION } from './landmarks/jiji_station.js';
import { NM_ROPEWAY_STATION } from './landmarks/ropeway_station.js';
import { NM_PULI_WINERY } from './landmarks/puli_winery.js';

// 13 Nantou collectible geometries (codes 70..81 + 94).
// Taiwan-wide items: black_bear, boba, chicken_cutlet, gua_bao, xiaolongbao,
// pineapple_cake, santaizi, budaixi, mazu
// Nantou-specific: bamboo_basket, shaoxing_wine, ropeway_gondola, qingjing_sheep
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_BOBA } from './collectibles/boba.js';
import { COL_CHICKEN } from './collectibles/chicken_cutlet.js';
import { COL_GUABAO } from './collectibles/gua_bao.js';
import { COL_XLB } from './collectibles/xiaolongbao.js';
import { COL_PINEAPPLE } from './collectibles/pineapple_cake.js';
import { COL_SANTAIZI } from './collectibles/santaizi.js';
import { COL_PUPPET } from './collectibles/budaixi.js';
import { COL_BAMBOO_BASKET } from './collectibles/bamboo_basket.js';
import { COL_SHAOXING_BOTTLE } from './collectibles/shaoxing_bottle.js';
import { COL_ROPEWAY_GONDOLA } from './collectibles/ropeway_gondola.js';
import { COL_QINGJING_SHEEP } from './collectibles/qingjing_sheep.js';
import { COL_MAZU } from './collectibles/mazu.js';

// Extended landmarks (codes 90-93 + 95-98) - use the goal as placeholder
import { NM_CIEN_PAGODA } from './landmarks/cien_pagoda.js';

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
    `[nantou/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Nantou chunk archetypes keyed by id — 70 entries.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 = 99 ids                          */
/* ================================================================== */

/**
 * The 8 Nantou curated landmark geometry descriptors (codes 82..89).
 */
const _NANTOU_LANDMARKS = [
  { code: 82, nm: NM_WENWU_TEMPLE,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_XUANGUANG_TEMPLE,  sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_FORMOSAN_VILLAGE,  sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_QINGJING_SWISS,    sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_PAPER_DOME,        sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_JIJI_STATION,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_ROPEWAY_STATION,   sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_PULI_WINERY,       sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code.
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _NANTOU_LANDMARKS) {
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
    spawnWeight: 0,
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

/* 13 Nantou collectibles at codes 70..81 + 94. */
const _NANTOU_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_BOBA },
  { code: 72, col: COL_CHICKEN },
  { code: 73, col: COL_GUABAO },
  { code: 74, col: COL_XLB },
  { code: 75, col: COL_PINEAPPLE },
  { code: 76, col: COL_SANTAIZI },
  { code: 77, col: COL_PUPPET },
  { code: 78, col: COL_BAMBOO_BASKET },      // nantou: 竹編籃
  { code: 79, col: COL_SHAOXING_BOTTLE },    // nantou: 紹興酒瓶
  { code: 80, col: COL_ROPEWAY_GONDOLA },    // nantou: 日月潭纜車
  { code: 81, col: COL_QINGJING_SHEEP },     // nantou: 清境綿羊
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _NANTOU_COLLECTIBLES) {
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
    spawnWeight: 0,
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

/* Extended landmarks at codes 90-93 + 95-98 - use Ci-En Pagoda variants as placeholders. */
const _NANTOU_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_CIEN_PAGODA, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _NANTOU_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: `${nm.id}_ext${code}`,
    displayName: nm.name,
    tier,
    naturalBand,
    radiusNominal: nm.dioramaRHint || (sizeClass === 'landmark-xl' ? 80 : 30),
    radiusJitter: 0,
    spawnWeight: 0,
    palette: [nm.colorHex],
    yOffset: _yOffset,
    upright: true,
    collisionScale: 1.0,
    heroTriCap: HERO_TRI_CAP,
    buildGeometry: nm.buildGeometry.bind(nm),
    extraCode: code,
    sizeClass,
  };
  CATALOG[entry.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/**
 * EXTRA render pool caps.
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
 *   0..69  — zh-TW names from the Nantou chunk archetypes
 *   70..81 — collectible names
 *   82..89 — Nantou landmark zh-TW names
 *   90..98 — extended landmark names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init empty, then override
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Nantou landmark zh-TW names.
  for (const { code, nm } of _NANTOU_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with collectible zh-TW names.
  for (const { code, col } of _NANTOU_COLLECTIBLES) {
    names[code] = col.name;
  }

  // codes 90..93 + 95..98 -> extended landmark names
  for (const { code, nm } of _NANTOU_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[nantou/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
