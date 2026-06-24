/**
 * @file catalog.js — Miaoli pack catalog.
 *
 * Assembles the 70 Miaoli chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 codes (collectibles + landmarks) so all 99 codes
 * still resolve.
 *
 * Exports:
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Miaoli chunk archetypes
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
import { BufferGeometry, Float32BufferAttribute } from 'three';

// 8 curated Miaoli landmark geometry descriptors (codes 82..89).
import { NM_SHENGXING_STATION } from './landmarks/shengxing_station.js';
import { NM_NANZHUANG } from './landmarks/nanzhuang_old_street.js';
import { NM_DAHU_STRAWBERRY } from './landmarks/dahu_strawberry.js';
import { NM_SANYI_WOODCARVING } from './landmarks/sanyi_woodcarving.js';
import { NM_TONGXIAO_SHRINE } from './landmarks/tongxiao_station.js';
import { NM_GONGGUAN_TUNG } from './landmarks/gongguan_tung_tree.js';
import { NM_YUANLI_RUSH } from './landmarks/yuanli_tunnel.js';
import { NM_MINGDE_RESERVOIR } from './landmarks/mingde_reservoir.js';

// 13 Miaoli collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_LEICHA } from './collectibles/leicha.js';
import { COL_STRAWBERRY } from './collectibles/strawberry.js';
import { COL_TUNG_BLOSSOM } from './collectibles/tung_blossom.js';
import { COL_HAKKA_BANTIAO } from './collectibles/hakka_bantiao.js';
import { COL_MOCHI } from './collectibles/mochi.js';
import { COL_PERSIMMON_CAKE } from './collectibles/persimmon_cake.js';
import { COL_WOODCARVING } from './collectibles/woodcarving.js';
import { COL_RAIL_BIKE } from './collectibles/rail_bike.js';
import { COL_RUSH_HAT } from './collectibles/rush_hat.js';
import { COL_HAKKA_FLORAL } from './collectibles/hakka_floral.js';
import { COL_CAIBAO } from './collectibles/caibao.js';
import { COL_TUNG_OIL } from './collectibles/tung_oil.js';

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
    `[miaoli/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Miaoli chunk archetypes keyed by id — 70 entries.
 * @type {Record<string, import('../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 = 99 ids                          */
/* ================================================================== */

/**
 * The 8 Miaoli curated landmark geometry descriptors (codes 82..89).
 */
const _MIAOLI_LANDMARKS = [
  { code: 82, nm: NM_SHENGXING_STATION, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_NANZHUANG,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_DAHU_STRAWBERRY,   sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 85, nm: NM_SANYI_WOODCARVING, sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_TONGXIAO_SHRINE,   sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_GONGGUAN_TUNG,     sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_YUANLI_RUSH,       sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_MINGDE_RESERVOIR,  sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Miaoli chunk archetypes PLUS EXTRA/v5.
 * @type {Record<string, import('../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98).
 * @type {Record<number, import('../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code.
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _MIAOLI_LANDMARKS) {
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

/* 13 Miaoli collectibles at codes 70..81 + 94 */
const _MIAOLI_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_LEICHA },
  { code: 72, col: COL_STRAWBERRY },
  { code: 73, col: COL_TUNG_BLOSSOM },
  { code: 74, col: COL_HAKKA_BANTIAO },
  { code: 75, col: COL_MOCHI },
  { code: 76, col: COL_PERSIMMON_CAKE },
  { code: 77, col: COL_WOODCARVING },
  { code: 78, col: COL_RAIL_BIKE },
  { code: 79, col: COL_RUSH_HAT },
  { code: 80, col: COL_HAKKA_FLORAL },
  { code: 81, col: COL_CAIBAO },
  { code: 94, col: COL_TUNG_OIL },
];
for (const { code, col } of _MIAOLI_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // collectibles use the 600-tri hero budget
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* Placeholder entries for codes 90-93, 95-98 (not used in Miaoli yet) */
const _PLACEHOLDER_CODES = [
  { code: 90, name: '保留90' },
  { code: 91, name: '保留91' },
  { code: 92, name: '保留92' },
  { code: 93, name: '保留93' },
  { code: 95, name: '保留95' },
  { code: 96, name: '保留96' },
  { code: 97, name: '保留97' },
  { code: 98, name: '保留98' },
];
for (const { code, name } of _PLACEHOLDER_CODES) {
  const placeholderId = `extra_${code}`;
  const entry = {
    id: placeholderId,
    displayName: name,
    tier: 5,
    naturalBand: 5,
    radiusNominal: 50,
    radiusJitter: 0,
    spawnWeight: 0,
    palette: [0x808080],
    yOffset: 0,
    upright: true,
    collisionScale: 1.0,
    buildGeometry: () => {
      const geo = new BufferGeometry();
      geo.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3));
      return geo;
    },
    extraCode: code,
    sizeClass: 'landmark-xl',
  };
  CATALOG[placeholderId] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'landmark-xl';
}

/**
 * EXTRA render pool caps.
 * @type {Readonly<Record<string, number>>}
 */
export const EXTRA_POOL_CAPS = Object.freeze({
  'collectible-small': 13,
  'landmark-mid': 8,
  'landmark-large': 4,
  'landmark-xl': 4,
});

/* ================================================================== */
/* DISPLAY_NAME_BY_CODE — string[99]                                   */
/* ================================================================== */

/**
 * Code-indexed display names (99 total).
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init empty, fill from Miaoli content.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Miaoli landmark zh-TW names.
  for (const { code, nm } of _MIAOLI_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Miaoli collectible zh-TW names.
  for (const { code, col } of _MIAOLI_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Fill placeholder codes 90-93, 95-98 with placeholder names.
  for (const { code, name } of _PLACEHOLDER_CODES) {
    names[code] = name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[miaoli/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
