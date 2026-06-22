/**
 * @file catalog.js — Taipei pack catalog (P5/P6b).
 *
 * Assembles the 70 Taipei chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Taipei landmark
 * geometries (北門/龍山寺/西門紅樓/圓山大飯店/總統府/中正紀念堂/
 * 自由廣場牌樓/小巨蛋). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged placeholders.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Taipei chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Taipei-native
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
// (70..98) is now Taipei (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Taipei landmark geometry descriptors (codes 82..89).
import { NM_SWORD_LION } from './landmarks/anping_sword_lion.js';
import { NM_CHIHKAN } from './landmarks/chihkan_tower.js';
import { NM_CONFUCIUS } from './landmarks/tainan_confucius.js';
import { NM_WU_TEMPLE } from './landmarks/wu_temple.js';
import { NM_ANPING_FORT } from './landmarks/anping_fort.js';
import { NM_GOLDEN_CASTLE } from './landmarks/golden_castle.js';
import { NM_LIT_MUSEUM } from './landmarks/literature_museum.js';
import { NM_CHIMEI } from './landmarks/chimei_museum.js';

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

// DE-TOKYO: 8 Taipei extended landmarks replace the leftover EXTRA slots (codes 90-93 + 95-98).
import { NM_TREEHOUSE } from './landmarks/anping_treehouse.js';
import { NM_SHENNONG_ST } from './landmarks/shennong_street_lm.js';
import { NM_TAINAN_STATION } from './landmarks/tainan_station.js';
import { NM_SALT_MTN } from './landmarks/salt_mountain.js';
import { NM_KOXINGA } from './landmarks/koxinga_shrine.js';
import { NM_HELE } from './landmarks/hele_plaza.js';
import { NM_LIGHTHOUSE_LM } from './landmarks/anping_lighthouse_lm.js';
import { NM_KAIYUAN } from './landmarks/kaiyuan_temple.js';

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
/* CATALOG — 70 chunk + 29 EXTRA/v5 placeholders = 99 ids             */
/* ================================================================== */

/**
 * The 8 Taipei curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Taipei landmark id (e.g. 'anping_sword_lion') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _TAIPEI_LANDMARKS = [
  { code: 82, nm: NM_SWORD_LION,        sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_CHIHKAN,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_CONFUCIUS,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_WU_TEMPLE,   sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_ANPING_FORT,  sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_GOLDEN_CASTLE,           sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_LIT_MUSEUM,  sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_CHIMEI,         sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Taipei chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Taipei landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Taipei chunk archetypes + the Taipei EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Taipei collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
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

/* P7: 13 Taipei collectibles at codes 70..81 + 94 (replace placeholder album items).
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
   leftover EXTRA archetypes). Grounded like landmarks; not placed yet. */
const _TAIPEI_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_TREEHOUSE,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_SHENNONG_ST,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_TAINAN_STATION,    sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_SALT_MTN,     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_KOXINGA,   sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_HELE,    sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_LIGHTHOUSE_LM,      sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_KAIYUAN, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
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
 *   landmark-mid (codes 82/83/84/86): 4 alive (matches the original engine floor)
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
 *   70..81 — placeholder names (collectibles)
 *   82..89 — Taipei landmark zh-TW names (P6b)
 *   90..98 — placeholder names (shop shell, bridge, tower, v5)
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
