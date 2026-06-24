/**
 * @file catalog.js — Matsu pack catalog.
 *
 * Assembles the 70 Matsu chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 entries so all 99 codes resolve.
 *
 * Codes 82..89 are the 8 curated Matsu landmarks:
 *   82 藍眼淚沙灘, 83 鐵堡, 84 八角據點遺址, 85 北海坑道,
 *   86 境天后宮, 87 芹壁聚落, 88 東引燈塔, 89 媽祖巨神像 (goal placeholder)
 *
 * Codes 70..81 + 94 are 13 Matsu collectibles.
 * Codes 90..93 + 95..98 are extended landmarks.
 *
 * Exports:
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Matsu chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — all zh-TW names
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
import { box, finish } from './geomHelpers.js';

// 8 curated Matsu landmark geometry descriptors (codes 82..89).
import { NM_BLUE_TEARS_BEACH } from './landmarks/blue_tears_beach.js';
import { NM_IRON_FORT } from './landmarks/iron_fort.js';
import { NM_BAJIU_AOYA } from './landmarks/bajiu_aoya.js';
import { NM_BEIHAI_TUNNEL } from './landmarks/beihai_tunnel.js';
import { NM_TIANHOU_TEMPLE } from './landmarks/tianhou_temple.js';
import { NM_QINBI_VILLAGE } from './landmarks/qinbi_village.js';
import { NM_DONGYIN_LIGHTHOUSE } from './landmarks/dongyin_lighthouse.js';
import { NM_MATSU_GODDESS } from './landmarks/matsu_goddess.js';

// 13 Matsu collectibles (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_AGED_WINE_BOWL } from './collectibles/aged_wine_bowl.js';
import { COL_JIGUANG_BING } from './collectibles/jiguang_bing.js';
import { COL_RED_YEAST_RICE } from './collectibles/red_yeast_rice.js';
import { COL_KAOLIANG_BOTTLE } from './collectibles/kaoliang_bottle.js';
import { COL_BLUE_TEARS } from './collectibles/blue_tears.js';
import { COL_WIND_LION } from './collectibles/wind_lion.js';
import { COL_OYSTER_PLATE } from './collectibles/oyster_plate.js';
import { COL_FISHING_BOAT } from './collectibles/fishing_boat.js';
import { COL_STONE_HOUSE_MODEL } from './collectibles/stone_house_model.js';
import { COL_MILITARY_HELMET } from './collectibles/military_helmet.js';
import { COL_CUTTLEFISH } from './collectibles/cuttlefish.js';
import { COL_MAZU_STATUE } from './collectibles/mazu_statue.js';

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
    `[matsu/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Matsu chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
 * Code i = the archetype at array position i (tier*10 + slot within tier).
 * @type {Record<string, import('../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 = 99 ids                           */
/* ================================================================== */

/**
 * The 8 Matsu curated landmark geometry descriptors (codes 82..89).
 * Ordered by dioramaRHint (smallest to largest, goal last).
 */
const _MATSU_LANDMARKS = [
  { code: 82, nm: NM_BLUE_TEARS_BEACH,   sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_IRON_FORT,          sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_BAJIU_AOYA,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_BEIHAI_TUNNEL,      sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_TIANHOU_TEMPLE,     sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_QINBI_VILLAGE,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_DONGYIN_LIGHTHOUSE, sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_MATSU_GODDESS,      sizeClass: 'landmark-xl',    tier: 6, naturalBand: 6 },
];

/**
 * Full id-keyed catalog: 70 Matsu chunk archetypes PLUS EXTRA/v5 entries.
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

for (const { code, nm, sizeClass, tier, naturalBand } of _MATSU_LANDMARKS) {
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

/* 13 Matsu collectibles at codes 70..81 + 94. */
const _MATSU_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_AGED_WINE_BOWL },
  { code: 72, col: COL_JIGUANG_BING },
  { code: 73, col: COL_RED_YEAST_RICE },
  { code: 74, col: COL_KAOLIANG_BOTTLE },
  { code: 75, col: COL_BLUE_TEARS },
  { code: 76, col: COL_WIND_LION },
  { code: 77, col: COL_OYSTER_PLATE },
  { code: 78, col: COL_FISHING_BOAT },
  { code: 79, col: COL_STONE_HOUSE_MODEL },
  { code: 80, col: COL_MILITARY_HELMET },
  { code: 81, col: COL_CUTTLEFISH },
  { code: 94, col: COL_MAZU_STATUE },
];

for (const { code, col } of _MATSU_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // collectibles may be hero-sized for visibility
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* Extended landmarks at codes 90..93 + 95..98 (placeholder names for now).
   Must return valid geometry (not null) to pass hero-geometry.test.js. */
const _MATSU_EXTRA_LANDMARKS = [
  { code: 90, id: 'ext_landmark_90', name: '擴充地標90', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, id: 'ext_landmark_91', name: '擴充地標91', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, id: 'ext_landmark_92', name: '擴充地標92', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, id: 'ext_landmark_93', name: '擴充地標93', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, id: 'ext_landmark_95', name: '擴充地標95', sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, id: 'ext_landmark_96', name: '擴充地標96', sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, id: 'ext_landmark_97', name: '擴充地標97', sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, id: 'ext_landmark_98', name: '擴充地標98', sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];

// Placeholder geometry builder — simple gray cube (never rendered, just passes tests).
const _placeholderGeometry = () => finish([box(1, 1, 1, 0x808080)]);

for (const { code, id, name, sizeClass, tier, naturalBand } of _MATSU_EXTRA_LANDMARKS) {
  const entry = {
    id,
    displayName: name,
    tier,
    naturalBand,
    radiusNominal: sizeClass === 'landmark-xl' ? 80 : 30,
    radiusJitter: 0,
    spawnWeight: 0,
    palette: [0x808080],
    yOffset: -0.5,
    upright: true,
    collisionScale: 1.0,
    heroTriCap: HERO_TRI_CAP,
    buildGeometry: _placeholderGeometry, // placeholder — not placed but must return valid geometry
    extraCode: code,
    sizeClass,
  };
  CATALOG[id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
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

  // Init codes 70..98 to empty.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Matsu landmark zh-TW names.
  for (const { code, nm } of _MATSU_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Matsu collectible zh-TW names.
  for (const { code, col } of _MATSU_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Override codes 90..93 + 95..98 with extended landmark names.
  for (const { code, name } of _MATSU_EXTRA_LANDMARKS) {
    names[code] = name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[matsu/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
