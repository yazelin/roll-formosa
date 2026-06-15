/**
 * @file catalog.js — Taipei pack catalog (P5).
 *
 * Assembles the 70 Taipei chunk ArchetypeDefs from the 7 per-tier files,
 * then merges Tokyo EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * Exports (P5 shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Taipei chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 Tokyo names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — re-exported from
 *     config/catalog.js (P6/P7 replace landmarks/collectibles later)
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
} from '../../config/catalog.js';

import {
  EXTRA_ARCHETYPE_IDS,
  V5_ARCHETYPE_IDS,
  EXTRA_CODE_BASE,
} from '../../world/objects.js';

// Re-export the EXTRA/v5 pool metadata unchanged — P6/P7 replace these later.
export {
  EXTRA_CATALOG,
  EXTRA_SIZE_CLASS_BY_CODE,
  EXTRA_POOL_CAPS,
} from '../../config/catalog.js';

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
 * Full id-keyed catalog: 70 Taipei chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98) Tokyo placeholder archetypes.
 * P6/P7 replace the landmark/collectible entries with Taipei equivalents.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

// Copy the Tokyo EXTRA and v5 entries by id so they still resolve.
for (const id of EXTRA_ARCHETYPE_IDS) {
  if (TOKYO_CATALOG[id] !== undefined) {
    CATALOG[id] = TOKYO_CATALOG[id];
  }
}
for (const id of V5_ARCHETYPE_IDS) {
  if (TOKYO_CATALOG[id] !== undefined) {
    CATALOG[id] = TOKYO_CATALOG[id];
  }
}

/* ================================================================== */
/* DISPLAY_NAME_BY_CODE — string[99]                                   */
/* ================================================================== */

/**
 * Code-indexed display names (99 total):
 *   0..69  — zh-TW names from the Taipei chunk archetypes (displayName field)
 *   70..98 — Tokyo names from config/catalog.js (Japanese, placeholder)
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: Tokyo placeholder names from the frozen Tokyo table.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = TOKYO_DISPLAY_NAME_BY_CODE[c] || '';
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[taipei/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
