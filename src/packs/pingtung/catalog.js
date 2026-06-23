/**
 * @file catalog.js — Pingtung pack catalog (P5/P6b).
 *
 * Assembles the 70 Pingtung chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Pingtung landmark
 * geometries. Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged placeholders.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Pingtung chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Pingtung-native
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
// (70..98) is now Pingtung (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Pingtung landmark geometry descriptors (codes 82..89).
import { NM_HENGCHUN_SOUTH_GATE } from './landmarks/hengchun_south_gate.js';
import { NM_FUAN_TEMPLE } from './landmarks/fuan_temple.js';
import { NM_WANJIN_BASILICA } from './landmarks/wanjin_basilica.js';
import { NM_CAESAR_HOTEL } from './landmarks/caesar_hotel.js';
import { NM_AQUARIUM } from './landmarks/aquarium.js';
import { NM_ELUANBI } from './landmarks/eluanbi_lighthouse.js';
import { NM_MAOBITOU } from './landmarks/maobitou.js';
import { NM_SAIL_ROCK } from './landmarks/sail_rock.js';

// P7: 13 Pingtung collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_BLUEFIN_TUNA } from './collectibles/bluefin_tuna.js';
import { COL_PIG_TROTTER } from './collectibles/pig_trotter.js';
import { COL_MANGO } from './collectibles/mango.js';
import { COL_ONION } from './collectibles/onion.js';
import { COL_SISAL } from './collectibles/sisal.js';
import { COL_WHALE_SHARK } from './collectibles/whale_shark.js';
import { COL_PENGUIN } from './collectibles/penguin.js';
import { COL_DIVING_MASK } from './collectibles/diving_mask.js';
import { COL_BANANA_BOAT } from './collectibles/banana_boat.js';
import { COL_PAIWAN_POT } from './collectibles/paiwan_pot.js';
import { COL_BETEL_PALM } from './collectibles/betel_palm.js';
import { COL_WANJIN_CROSS } from './collectibles/wanjin_cross.js';

// DE-TOKYO: Extended landmarks for codes 90-93 + 95-98.
import { NM_SOUTH_BAY } from './landmarks/south_bay.js';

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
    `[pingtung/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Pingtung chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Pingtung curated landmark geometry descriptors (codes 82..89).
 */
const _PINGTUNG_LANDMARKS = [
  { code: 82, nm: NM_HENGCHUN_SOUTH_GATE, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_FUAN_TEMPLE,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_WANJIN_BASILICA,     sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_CAESAR_HOTEL,        sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_AQUARIUM,            sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_ELUANBI,             sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_MAOBITOU,            sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_SAIL_ROCK,           sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Pingtung chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Pingtung landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Pingtung chunk archetypes + the Pingtung EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Pingtung collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _PINGTUNG_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground.
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

/* P7: 13 Pingtung collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _PINGTUNG_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_BLUEFIN_TUNA },
  { code: 72, col: COL_PIG_TROTTER },
  { code: 73, col: COL_MANGO },
  { code: 74, col: COL_ONION },
  { code: 75, col: COL_SISAL },
  { code: 76, col: COL_WHALE_SHARK },
  { code: 77, col: COL_PENGUIN },
  { code: 78, col: COL_DIVING_MASK },
  { code: 79, col: COL_BANANA_BOAT },
  { code: 80, col: COL_PAIWAN_POT },
  { code: 81, col: COL_BETEL_PALM },
  { code: 94, col: COL_WANJIN_CROSS },
];
for (const { code, col } of _PINGTUNG_COLLECTIBLES) {
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

/* DE-TOKYO: Extended landmarks at codes 90-93 + 95-98.
   For Pingtung, we reuse some landmarks at different codes. */
const _PINGTUNG_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_SOUTH_BAY,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_ELUANBI,      sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_AQUARIUM,     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_CAESAR_HOTEL, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_MAOBITOU,     sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_SAIL_ROCK,    sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_FUAN_TEMPLE,  sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_HENGCHUN_SOUTH_GATE, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _PINGTUNG_EXTRA_LANDMARKS) {
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
 * EXTRA render pool caps. Pingtung has landmark singletons:
 *   landmark-mid (codes 82/83/84): mid-size landmarks
 *   landmark-large (codes 85..89): large landmarks
 * Caps are capacity only.
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
 *   0..69  — zh-TW names from the Pingtung chunk archetypes (displayName field)
 *   70..81 — Pingtung collectibles
 *   82..89 — Pingtung landmark zh-TW names (P6b)
 *   90..98 — extended landmarks
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Pingtung zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Pingtung landmark zh-TW names.
  for (const { code, nm } of _PINGTUNG_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Pingtung collectible zh-TW names (P7).
  for (const { code, col } of _PINGTUNG_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Pingtung extended landmark zh-TW names.
  for (const { code, nm } of _PINGTUNG_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[pingtung/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
