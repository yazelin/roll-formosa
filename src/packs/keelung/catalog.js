/**
 * @file catalog.js — Keelung pack catalog.
 *
 * Assembles the 70 Keelung chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * Overrides EXTRA codes 82..89 with the 8 curated Keelung landmark
 * geometries (廟口夜市牌樓/基隆火車站/觀音像/海洋廣場/仙洞巖/
 * 和平島公園/基隆嶼燈塔/慶安宮). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are Keelung-native.
 *
 * Exports:
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Keelung chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Keelung-native
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

// 8 curated Keelung landmark geometry descriptors (codes 82..89).
import { NM_MIAOKOU_GATE } from './landmarks/miaokou_gate.js';
import { NM_KEELUNG_STATION } from './landmarks/keelung_station.js';
import { NM_GUANYIN_STATUE } from './landmarks/guanyin_statue.js';
import { NM_OCEAN_PLAZA } from './landmarks/ocean_plaza.js';
import { NM_XIANDONYAN } from './landmarks/xiandonyan.js';
import { NM_HEPING_ISLAND } from './landmarks/heping_island.js';
import { NM_KEELUNG_ISLET } from './landmarks/keelung_islet.js';
import { NM_QINGAN_TEMPLE } from './landmarks/qingan_temple.js';

// 13 Keelung collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_BOBA } from './collectibles/boba.js';
import { COL_CHICKEN } from './collectibles/chicken_cutlet.js';
import { COL_GUABAO } from './collectibles/gua_bao.js';
import { COL_XLB } from './collectibles/xiaolongbao.js';
import { COL_PINEAPPLE } from './collectibles/pineapple_cake.js';
import { COL_SANTAIZI } from './collectibles/santaizi.js';
import { COL_PUPPET } from './collectibles/budaixi.js';
import { COL_YOUBIKE } from './collectibles/youbike.js';
import { COL_PRES_TROPHY } from './collectibles/presidential_trophy.js';
import { COL_GONDOLA } from './collectibles/maokong_gondola.js';
import { COL_BIGCHICKEN } from './collectibles/shilin_big_chicken.js';
import { COL_MAZU } from './collectibles/mazu.js';

// 8 Keelung extended landmarks for codes 90-93 + 95-98.
import { NM_ZHENGBIN_COLORHOUSES } from './landmarks/zhengbin_colorhouses.js';
// Reuse the goal monument and some shared structures

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
    `[keelung/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Keelung chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Keelung curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Keelung landmark id (e.g. 'miaokou_gate') not the legacy id.
 */
const _KEELUNG_LANDMARKS = [
  { code: 82, nm: NM_MIAOKOU_GATE,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_KEELUNG_STATION, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_GUANYIN_STATUE,  sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_OCEAN_PLAZA,     sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_XIANDONYAN,      sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_HEPING_ISLAND,   sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_KEELUNG_ISLET,   sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_QINGAN_TEMPLE,   sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Keelung chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Keelung landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Keelung collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below.
 * @type {Record<number, import('../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _KEELUNG_LANDMARKS) {
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
    heroTriCap: HERO_TRI_CAP,
    buildGeometry: nm.buildGeometry.bind(nm),
    extraCode: code,
    sizeClass,
  };
  CATALOG[nm.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/* 13 Keelung collectibles at codes 70..81 + 94. */
const _KEELUNG_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_BOBA },
  { code: 72, col: COL_CHICKEN },
  { code: 73, col: COL_GUABAO },
  { code: 74, col: COL_XLB },
  { code: 75, col: COL_PINEAPPLE },
  { code: 76, col: COL_SANTAIZI },
  { code: 77, col: COL_PUPPET },
  { code: 78, col: COL_YOUBIKE },
  { code: 79, col: COL_PRES_TROPHY },
  { code: 80, col: COL_GONDOLA },
  { code: 81, col: COL_BIGCHICKEN },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _KEELUNG_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // collectibles get the 600-tri hero budget
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* 8 extended landmarks at codes 90-93 + 95-98 — reuse keelung's own 8 landmarks
   (curated/display slots, same as taitung's pattern; no taipei landmarks). */
const _KEELUNG_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_MIAOKOU_GATE,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_KEELUNG_STATION, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_GUANYIN_STATUE,  sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_OCEAN_PLAZA,     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_XIANDONYAN,      sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_HEPING_ISLAND,   sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_KEELUNG_ISLET,   sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_QINGAN_TEMPLE,   sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _KEELUNG_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: `${nm.id}_ext${code}`, // unique — reuses own landmark geom but distinct catalog id (no collision with codes 82-89)
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
 * EXTRA render pool caps. Keelung has 8 landmark singletons + 13 collectibles.
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
 *   0..69  — zh-TW names from the Keelung chunk archetypes (displayName field)
 *   70..81 — collectible names
 *   82..89 — Keelung landmark zh-TW names
 *   90..98 — extended landmark names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init empty, then fill below.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Keelung landmark zh-TW names.
  for (const { code, nm } of _KEELUNG_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with collectible zh-TW names.
  for (const { code, col } of _KEELUNG_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Codes 90..93 + 95..98 -> extended landmark zh-TW names.
  for (const { code, nm } of _KEELUNG_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[keelung/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
