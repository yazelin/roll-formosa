/**
 * @file catalog.js — Taipei pack catalog (P5/P6b).
 *
 * Assembles the 70 Taipei chunk ArchetypeDefs from the 7 per-tier files,
 * then merges Tokyo EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Taipei landmark
 * geometries (北門/龍山寺/西門紅樓/圓山大飯店/總統府/中正紀念堂/
 * 自由廣場牌樓/小巨蛋). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged from Tokyo.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Taipei chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Taipei-native
 *     for codes 82..89; remainder from config/catalog.js
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

import {
  CATALOG as TOKYO_CATALOG,
  DISPLAY_NAME_BY_CODE as TOKYO_DISPLAY_NAME_BY_CODE,
  EXTRA_CATALOG as TOKYO_EXTRA_CATALOG,
  EXTRA_SIZE_CLASS_BY_CODE as TOKYO_EXTRA_SIZE_CLASS_BY_CODE,
  EXTRA_POOL_CAPS as TOKYO_EXTRA_POOL_CAPS,
} from '../../config/catalog.js';
import { HERO_TRI_CAP } from '../../config/tuning.js';

import {
  EXTRA_ARCHETYPE_IDS,
  V5_ARCHETYPE_IDS,
  EXTRA_CODE_BASE,
} from '../../world/objects.js';

// P6b: 8 curated Taipei landmark geometry descriptors (codes 82..89).
import { NM_BEIMEN } from './landmarks/beimen.js';
import { NM_LONGSHAN } from './landmarks/longshan.js';
import { NM_XIMEN } from './landmarks/ximen.js';
import { NM_GRAND_HOTEL } from './landmarks/grand_hotel.js';
import { NM_PRESIDENTIAL } from './landmarks/presidential.js';
import { NM_CKS } from './landmarks/cks_memorial.js';
import { NM_LIBERTY_ARCH } from './landmarks/liberty_arch.js';
import { NM_ARENA } from './landmarks/arena.js';

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
    `[taipei/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Taipei chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
 * Code i = the archetype at array position i (tier*10 + slot within tier).
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 Tokyo placeholders = 99 ids       */
/* ================================================================== */

/**
 * The 8 Taipei curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the Tokyo landmark ids at the same codes — the id field is the
 * Taipei landmark id (e.g. 'beimen') not the Tokyo id ('saigo_statue').
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _TAIPEI_LANDMARKS = [
  { code: 82, nm: NM_BEIMEN,        sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_LONGSHAN,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_XIMEN,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_GRAND_HOTEL,   sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_PRESIDENTIAL,  sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_CKS,           sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_LIBERTY_ARCH,  sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_ARENA,         sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/** Set of Tokyo EXTRA ids that are REPLACED by Taipei landmarks (codes 82..89). */
const _REPLACED_TOKYO_IDS = new Set(
  EXTRA_ARCHETYPE_IDS.slice(12, 20) // indices 12..19 = codes 82..89
);

/**
 * Full id-keyed catalog: 70 Taipei chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Taipei landmark geometries; all others carry Tokyo placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

// Copy the Tokyo EXTRA entries by id — but SKIP the 8 ids that Taipei replaces.
for (const id of EXTRA_ARCHETYPE_IDS) {
  if (!_REPLACED_TOKYO_IDS.has(id) && TOKYO_CATALOG[id] !== undefined) {
    CATALOG[id] = TOKYO_CATALOG[id];
  }
}
for (const id of V5_ARCHETYPE_IDS) {
  if (TOKYO_CATALOG[id] !== undefined) {
    CATALOG[id] = TOKYO_CATALOG[id];
  }
}

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98).
 * Codes 82..89 carry Taipei landmark geometries; all others are Tokyo.
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = { ...TOKYO_EXTRA_CATALOG };

/**
 * Size-class pool assignment per EXTRA code.
 * Codes 82..89 use Taipei landmark size classes.
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = { ...TOKYO_EXTRA_SIZE_CLASS_BY_CODE };

for (const { code, nm, sizeClass, tier, naturalBand } of _TAIPEI_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground. A fixed
  // -0.2 left wide/low landmarks (北門/龍山寺/牌樓/小巨蛋) floating (P6b bug).
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

/**
 * EXTRA render pool caps. Taipei has 8 landmark singletons:
 *   landmark-mid (codes 82/83/84/86): 4 alive (matches Tokyo floor)
 *   landmark-large (codes 85/87/88/89): 4 alive
 * Caps are capacity only — same 4 batches, zero extra draws.
 * @type {Readonly<Record<string, number>>}
 */
export const EXTRA_POOL_CAPS = Object.freeze({
  'collectible-small': TOKYO_EXTRA_POOL_CAPS['collectible-small'],
  'landmark-mid': Math.max(TOKYO_EXTRA_POOL_CAPS['landmark-mid'], 4),
  'landmark-large': Math.max(TOKYO_EXTRA_POOL_CAPS['landmark-large'], 4),
  'landmark-xl': TOKYO_EXTRA_POOL_CAPS['landmark-xl'],
});

/* ================================================================== */
/* DISPLAY_NAME_BY_CODE — string[99]                                   */
/* ================================================================== */

/**
 * Code-indexed display names (99 total):
 *   0..69  — zh-TW names from the Taipei chunk archetypes (displayName field)
 *   70..81 — Tokyo placeholder names (collectibles)
 *   82..89 — Taipei landmark zh-TW names (P6b)
 *   90..98 — Tokyo placeholder names (shop shell, bridge, tower, v5)
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: start with Tokyo names, then override 82..89 with zh-TW.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = TOKYO_DISPLAY_NAME_BY_CODE[c] || '';
  }

  // Override codes 82..89 with Taipei landmark zh-TW names.
  for (const { code, nm } of _TAIPEI_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[taipei/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
