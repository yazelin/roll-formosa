/**
 * @file catalog.js — Kinmen pack catalog (P5/P6b).
 *
 * Assembles the 70 Kinmen chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..88 with the 7 curated Kinmen landmark
 * geometries (翟山坑道/得月樓/風獅爺/山后民俗文化村/馬山觀測站/
 * 文台寶塔/金門國家公園). Codes 70..81 + 94 (13 collectibles), 89..93 + 95..98
 * (extended landmarks), and the full 99 codes are maintained.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Kinmen chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Kinmen-native
 *     for codes 82..88; remainder from extended landmarks
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

// DE-TOKYO: the legacy engine catalog is deleted; every EXTRA/v5 code
// (70..98) is now Kinmen (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 7 curated Kinmen landmark geometry descriptors (codes 82..88).
import { NM_ZHAISHAN_TUNNEL } from './landmarks/zhaishan_tunnel.js';
import { NM_DEYUE_TOWER } from './landmarks/deyue_tower.js';
import { NM_WIND_LION_GOD } from './landmarks/wind_lion_god.js';
import { NM_SHANHOU_FOLK_VILLAGE } from './landmarks/shanhou_folk_village.js';
import { NM_MASHAN_OBSERVATION } from './landmarks/mashan_observation.js';
import { NM_WENTAI_PAGODA } from './landmarks/wentai_pagoda.js';
import { NM_KINMEN_NATIONAL_PARK } from './landmarks/kinmen_national_park.js';

// P7: 13 Kinmen collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_KAOLIANG_BOTTLE } from './collectibles/kaoliang_bottle.js';
import { COL_GONG_TANG } from './collectibles/gong_tang.js';
import { COL_WIND_LION } from './collectibles/wind_lion.js';
import { COL_OYSTER_OMELETTE } from './collectibles/oyster_omelette.js';
import { COL_BEEF_JERKY } from './collectibles/beef_jerky.js';
import { COL_KNIFE } from './collectibles/knife.js';
import { COL_KINMEN_NOODLES } from './collectibles/kinmen_noodles.js';
import { COL_SORGHUM_CANDY } from './collectibles/sorghum_candy.js';
import { COL_MILITARY_HELMET } from './collectibles/military_helmet.js';
import { COL_ARTILLERY_SHELL } from './collectibles/artillery_shell.js';
import { COL_ONE_POT_RICE } from './collectibles/one_pot_rice.js';
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
    `[kinmen/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Kinmen chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 7 Kinmen curated landmark geometry descriptors (codes 82..88).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Kinmen landmark id (e.g. 'zhaishan_tunnel') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large.
 */
const _KINMEN_LANDMARKS = [
  { code: 82, nm: NM_ZHAISHAN_TUNNEL,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_DEYUE_TOWER,          sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_WIND_LION_GOD,        sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_SHANHOU_FOLK_VILLAGE, sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_MASHAN_OBSERVATION,   sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_WENTAI_PAGODA,        sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_KINMEN_NATIONAL_PARK, sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Kinmen chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..88 are replaced with
 * Kinmen landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Kinmen chunk archetypes + the Kinmen EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Kinmen collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _KINMEN_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground. A fixed
  // -0.2 left wide/low landmarks floating (P6b bug).
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

/* P7: 13 Kinmen collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _KINMEN_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_KAOLIANG_BOTTLE },
  { code: 72, col: COL_GONG_TANG },
  { code: 73, col: COL_WIND_LION },
  { code: 74, col: COL_OYSTER_OMELETTE },
  { code: 75, col: COL_BEEF_JERKY },
  { code: 76, col: COL_KNIFE },
  { code: 77, col: COL_KINMEN_NOODLES },
  { code: 78, col: COL_SORGHUM_CANDY },
  { code: 79, col: COL_MILITARY_HELMET },
  { code: 80, col: COL_ARTILLERY_SHELL },
  { code: 81, col: COL_ONE_POT_RICE },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _KINMEN_COLLECTIBLES) {
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

/* DE-TOKYO: 9 Kinmen extended landmarks at codes 89-93 + 95-98 (replace the
   leftover EXTRA archetypes). Re-use kinmen landmarks with _ext suffix as placeholders.
   Grounded like landmarks; not placed yet. */
const _KINMEN_EXTRA_LANDMARKS = [
  { code: 89, nm: NM_ZHAISHAN_TUNNEL,      id: 'zhaishan_tunnel_ext',      sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 90, nm: NM_DEYUE_TOWER,          id: 'deyue_tower_ext',          sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_WIND_LION_GOD,        id: 'wind_lion_god_ext',        sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_SHANHOU_FOLK_VILLAGE, id: 'shanhou_folk_village_ext', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_MASHAN_OBSERVATION,   id: 'mashan_observation_ext',   sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_WENTAI_PAGODA,        id: 'wentai_pagoda_ext',        sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_KINMEN_NATIONAL_PARK, id: 'kinmen_national_park_ext', sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_ZHAISHAN_TUNNEL,      id: 'zhaishan_tunnel_ext2',     sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_DEYUE_TOWER,          id: 'deyue_tower_ext2',         sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, id, sizeClass, tier, naturalBand } of _KINMEN_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id,
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
  CATALOG[id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/**
 * EXTRA render pool caps. Kinmen has 7 landmark singletons:
 *   landmark-mid (codes 82/83/84/86): 4 alive (matches the original engine floor)
 *   landmark-large (codes 85/87/88): 3 alive
 * Caps are capacity only — same batches, zero extra draws.
 * @type {Readonly<Record<string, number>>}
 */
export const EXTRA_POOL_CAPS = Object.freeze({
  'collectible-small': 13,
  'landmark-mid': 12,
  'landmark-large': 3,
  'landmark-xl': 5,
});

/* ================================================================== */
/* DISPLAY_NAME_BY_CODE — string[99]                                   */
/* ================================================================== */

/**
 * Code-indexed display names (99 total):
 *   0..69  — zh-TW names from the Kinmen chunk archetypes (displayName field)
 *   70..81 — Kinmen collectible zh-TW names
 *   82..88 — Kinmen landmark zh-TW names (P6b)
 *   89..98 — Kinmen extended landmark zh-TW names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Kinmen zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..88 with Kinmen landmark zh-TW names.
  for (const { code, nm } of _KINMEN_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Kinmen collectible zh-TW names (P7).
  for (const { code, col } of _KINMEN_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 89..93 + 95..98 -> Kinmen extended landmark zh-TW names.
  for (const { code, nm } of _KINMEN_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[kinmen/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
