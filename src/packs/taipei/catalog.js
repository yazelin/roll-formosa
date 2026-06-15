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

// DE-TOKYO: config/catalog.js (the Tokyo catalog) is deleted; every EXTRA/v5 code
// (70..98) is now Taipei (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Taipei landmark geometry descriptors (codes 82..89).
import { NM_BEIMEN } from './landmarks/beimen.js';
import { NM_LONGSHAN } from './landmarks/longshan.js';
import { NM_XIMEN } from './landmarks/ximen.js';
import { NM_GRAND_HOTEL } from './landmarks/grand_hotel.js';
import { NM_PRESIDENTIAL } from './landmarks/presidential.js';
import { NM_CKS } from './landmarks/cks_memorial.js';
import { NM_LIBERTY_ARCH } from './landmarks/liberty_arch.js';
import { NM_ARENA } from './landmarks/arena.js';

// P7: 13 Taipei collectible (rare album) geometries (codes 70..81 + 94).
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

// DE-TOKYO: 8 Taipei extended landmarks replace the leftover Tokyo EXTRA slots (codes 90-93 + 95-98).
import { NM_RAINBOW } from './landmarks/rainbow_bridge_tp.js';
import { NM_SYSHALL } from './landmarks/syshall.js';
import { NM_STATION } from './landmarks/main_station.js';
import { NM_PALACE } from './landmarks/palace_museum.js';
import { NM_XINGTIAN } from './landmarks/xingtian.js';
import { NM_THEATER } from './landmarks/national_theater.js';
import { NM_WHEEL } from './landmarks/miramar_wheel.js';
import { NM_MK_STATION } from './landmarks/maokong_station.js';

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

/**
 * Full id-keyed catalog: 70 Taipei chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Taipei landmark geometries; all others carry Tokyo placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Taipei chunk archetypes + the Taipei EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No Tokyo archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Taipei collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below. No Tokyo entries (de-Tokyo).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

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

/* P7: 13 Taipei collectibles at codes 70..81 + 94 (replace Tokyo album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _TAIPEI_COLLECTIBLES = [
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
for (const { code, col } of _TAIPEI_COLLECTIBLES) {
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

/* DE-TOKYO: 8 Taipei extended landmarks at codes 90-93 + 95-98 (replace the
   leftover Tokyo EXTRA archetypes). Grounded like landmarks; not placed yet. */
const _TAIPEI_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_RAINBOW,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_SYSHALL,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_STATION,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_PALACE,     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_XINGTIAN,   sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_THEATER,    sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_WHEEL,      sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_MK_STATION, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _TAIPEI_EXTRA_LANDMARKS) {
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

  // Codes 70..98: every code is overridden below with a Taipei zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Taipei landmark zh-TW names.
  for (const { code, nm } of _TAIPEI_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Taipei collectible zh-TW names (P7).
  for (const { code, col } of _TAIPEI_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Taipei extended landmark zh-TW names.
  for (const { code, nm } of _TAIPEI_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[taipei/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
