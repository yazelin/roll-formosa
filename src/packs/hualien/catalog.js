/**
 * @file catalog.js — Hualien pack catalog.
 *
 * Assembles the 70 Hualien chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 (collectibles + landmarks) so all 99 codes resolve.
 *
 * Codes 82..89: 8 curated Hualien landmarks
 * Codes 70..81 + 94: 13 Hualien collectibles
 * Codes 90..93 + 95..98: extended landmarks (placeholder or reused)
 *
 * Exports:
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Hualien chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
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

// 8 curated Hualien landmark geometry descriptors (codes 82..89).
import { NM_QINGXIU } from './landmarks/qingxiu_temple.js';
import { NM_PINE_GARDEN } from './landmarks/pine_garden.js';
import { NM_FARGLORY } from './landmarks/farglory_ocean.js';
import { NM_CULTURAL_PARK } from './landmarks/cultural_park.js';
import { NM_DONGDAMEN } from './landmarks/dongdamen_arch.js';
import { NM_LIYU } from './landmarks/liyu_lake.js';
import { NM_SWALLOW } from './landmarks/swallow_grotto.js';
import { NM_QIXINGTAN } from './landmarks/qixingtan_park.js';

// 13 Hualien collectible geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_MOCHI } from './collectibles/mochi.js';
import { COL_WONTON } from './collectibles/wonton.js';
import { COL_MARBLE_CRAFT } from './collectibles/marble_craft.js';
import { COL_QIXINGTAN_STONE } from './collectibles/qixingtan_stone.js';
import { COL_ABORIGINAL_WEAVE } from './collectibles/aboriginal_weave.js';
import { COL_GONGZHENG_BAOZI } from './collectibles/gongzheng_baozi.js';
import { COL_PEELED_CHILI } from './collectibles/peeled_chili.js';
import { COL_DAYLILY } from './collectibles/daylily.js';
import { COL_FLYING_FISH } from './collectibles/flying_fish.js';
import { COL_ABORIGINAL_PLATE } from './collectibles/aboriginal_plate.js';
import { COL_CRESCENT } from './collectibles/crescent_sculpture.js';
import { COL_MAZU } from './collectibles/mazu.js';

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
    `[hualien/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Hualien chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
 * Code i = the archetype at array position i (tier*10 + slot within tier).
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
 * The 8 Hualien curated landmark geometry descriptors (codes 82..89).
 * tier/naturalBand match the size-class assignment.
 */
const _HUALIEN_LANDMARKS = [
  { code: 82, nm: NM_QINGXIU,       sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_PINE_GARDEN,   sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_CULTURAL_PARK, sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 85, nm: NM_DONGDAMEN,     sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 86, nm: NM_LIYU,          sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_SWALLOW,       sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_QIXINGTAN,     sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_FARGLORY,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

// CATALOG = 70 Hualien chunk archetypes + the Hualien EXTRA/v5 (collectibles +
// landmarks) registered by the loops below.
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
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _HUALIEN_LANDMARKS) {
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

/* 13 Hualien collectibles at codes 70..81 + 94. */
const _HUALIEN_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_MOCHI },
  { code: 72, col: COL_WONTON },
  { code: 73, col: COL_MARBLE_CRAFT },
  { code: 74, col: COL_QIXINGTAN_STONE },
  { code: 75, col: COL_ABORIGINAL_WEAVE },
  { code: 76, col: COL_GONGZHENG_BAOZI },
  { code: 77, col: COL_PEELED_CHILI },
  { code: 78, col: COL_DAYLILY },
  { code: 79, col: COL_FLYING_FISH },
  { code: 80, col: COL_ABORIGINAL_PLATE },
  { code: 81, col: COL_CRESCENT },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _HUALIEN_COLLECTIBLES) {
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

/* Extended landmarks at codes 90-93 + 95-98 — reuse some Hualien landmarks as
   placeholders for now. These can be expanded with additional landmarks later. */
const _HUALIEN_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_QINGXIU,       sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_PINE_GARDEN,   sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_CULTURAL_PARK, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_DONGDAMEN,     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_LIYU,          sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_SWALLOW,       sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_QIXINGTAN,     sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_FARGLORY,      sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _HUALIEN_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: `${nm.id}_xl`,
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
  CATALOG[entry.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/**
 * EXTRA render pool caps. Hualien has 8 landmark singletons:
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
 *   0..69  — zh-TW names from the Hualien chunk archetypes (displayName field)
 *   70..81 — collectible names
 *   82..89 — Hualien landmark zh-TW names
 *   90..98 — extended landmark names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init ''
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Hualien landmark zh-TW names.
  for (const { code, nm } of _HUALIEN_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Hualien collectible zh-TW names.
  for (const { code, col } of _HUALIEN_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Codes 90..93 + 95..98 -> extended landmark zh-TW names.
  for (const { code, nm } of _HUALIEN_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[hualien/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
