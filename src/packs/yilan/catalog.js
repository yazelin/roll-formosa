/**
 * @file catalog.js — Yilan pack catalog (P5/P6b).
 *
 * Assembles the 70 Yilan chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..88 with the 7 curated Yilan landmark
 * geometries (幾米廣場/蘇澳冷泉/頭城老街/宜蘭火車站/羅東林業文化園區/
 * 蘭陽博物館/傳藝中心). Codes 70..81 (collectibles), 89..92 (unused),
 * 93 (goal display slot), and v5 94..98 (collectibles + unused).
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Yilan chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Yilan-native
 *     for codes 82..88; remainder from the legacy engine catalog
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

// DE-TOKYO: the legacy engine catalog is deleted; every EXTRA/v5 code
// (70..98) is now Yilan (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';
import { BoxGeometry } from 'three';

// P6b: 7 curated Yilan landmark geometry descriptors (codes 82..88).
import { NM_JIMMY_PLAZA } from './landmarks/jimmy_plaza.js';
import { NM_SUAO_COLD_SPRING } from './landmarks/suao_cold_spring.js';
import { NM_TOUCHENG_OLD_STREET } from './landmarks/toucheng_old_street.js';
import { NM_YILAN_STATION } from './landmarks/yilan_station.js';
import { NM_LUODONG_FORESTRY } from './landmarks/luodong_forestry.js';
import { NM_LANYANG_MUSEUM } from './landmarks/lanyang_museum.js';
import { NM_CHUANYI_CENTER } from './landmarks/chuanyi_center.js';

// P7: 13 Yilan collectible (rare album) geometries (codes 70..81 + 94).
import { COL_SANXING_SCALLION } from './collectibles/sanxing_scallion.js';
import { COL_SCALLION_PANCAKE } from './collectibles/scallion_pancake.js';
import { COL_DUCK_JERKY } from './collectibles/duck_jerky.js';
import { COL_OX_TONGUE_BISCUIT } from './collectibles/ox_tongue_biscuit.js';
import { COL_CHERRY_DUCK } from './collectibles/cherry_duck.js';
import { COL_MOCHI } from './collectibles/mochi.js';
import { COL_BROWN_SUGAR_CAKE } from './collectibles/brown_sugar_cake.js';
import { COL_PEANUT_CANDY } from './collectibles/peanut_candy.js';
import { COL_YILAN_WINE } from './collectibles/yilan_wine.js';
import { COL_SUAO_FISH } from './collectibles/suao_fish.js';
import { COL_LUWEI_POT } from './collectibles/luwei_pot.js';
import { COL_JIMMY_RABBIT } from './collectibles/jimmy_rabbit.js';
import { COL_GUISHAN_TURTLE } from './collectibles/guishan_turtle.js';

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
    `[yilan/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Yilan chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 7 Yilan curated landmark geometry descriptors (codes 82..88).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Yilan landmark id (e.g. 'jimmy_plaza') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 small, 83 mid, 84 mid, 85 mid, 86 mid, 87 mid, 88 mid.
 */
const _YILAN_LANDMARKS = [
  { code: 82, nm: NM_JIMMY_PLAZA,         sizeClass: 'landmark-mid',   tier: 2, naturalBand: 2 },
  { code: 83, nm: NM_SUAO_COLD_SPRING,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_TOUCHENG_OLD_STREET, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_YILAN_STATION,       sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 86, nm: NM_LUODONG_FORESTRY,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 87, nm: NM_LANYANG_MUSEUM,      sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 88, nm: NM_CHUANYI_CENTER,      sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
];

/**
 * Full id-keyed catalog: 70 Yilan chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..88 are replaced with
 * Yilan landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../types.js').Archetype>}
 */
// CATALOG = 70 Yilan chunk archetypes + the Yilan EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Yilan collectible (70..81+94) or landmark (82..88+89..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
 * @type {Record<number, import('../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _YILAN_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground. A fixed
  // -0.2 left wide/low landmarks (幾米廣場/頭城老街/傳藝中心) floating (P6b bug).
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

/* P7: 13 Yilan collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _YILAN_COLLECTIBLES = [
  { code: 70, col: COL_SANXING_SCALLION },
  { code: 71, col: COL_SCALLION_PANCAKE },
  { code: 72, col: COL_DUCK_JERKY },
  { code: 73, col: COL_OX_TONGUE_BISCUIT },
  { code: 74, col: COL_CHERRY_DUCK },
  { code: 75, col: COL_MOCHI },
  { code: 76, col: COL_BROWN_SUGAR_CAKE },
  { code: 77, col: COL_PEANUT_CANDY },
  { code: 78, col: COL_YILAN_WINE },
  { code: 79, col: COL_SUAO_FISH },
  { code: 80, col: COL_LUWEI_POT },
  { code: 81, col: COL_JIMMY_RABBIT },
  { code: 94, col: COL_GUISHAN_TURTLE },
];
for (const { code, col } of _YILAN_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // collectibles with tris > 350 need this
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* Fill remaining EXTRA codes 89..93 + 95..98 with placeholder entries.
   These are NOT used by Yilan (only 7 landmarks + 13 collectibles),
   but the engine expects 99 codes. */
const _UNUSED_EXTRA_CODES = [89, 90, 91, 92, 93, 95, 96, 97, 98];
for (const code of _UNUSED_EXTRA_CODES) {
  const entry = {
    id: `extra_${code}`,
    displayName: `額外${code}`,
    tier: 5,
    naturalBand: 5,
    radiusNominal: 50,
    radiusJitter: 0,
    spawnWeight: 0,
    palette: [0x888888],
    yOffset: -0.2,
    upright: true,
    collisionScale: 1.0,
    buildGeometry: () => new BoxGeometry(1, 1, 1),
    extraCode: code,
    sizeClass: 'landmark-xl',
  };
  CATALOG[entry.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'landmark-xl';
}

/**
 * EXTRA render pool caps. Yilan has 7 landmark singletons:
 *   landmark-mid (codes 82..88): 7 alive
 * Caps are capacity only — same batches, zero extra draws.
 * @type {Readonly<Record<string, number>>}
 */
export const EXTRA_POOL_CAPS = Object.freeze({
  'collectible-small': 13,
  'landmark-mid': 7,
  'landmark-large': 0,
  'landmark-xl': 0,
});

/* ================================================================== */
/* DISPLAY_NAME_BY_CODE — string[99]                                   */
/* ================================================================== */

/**
 * Code-indexed display names (99 total):
 *   0..69  — zh-TW names from the Yilan chunk archetypes (displayName field)
 *   70..81 — Yilan collectible zh-TW names
 *   82..88 — Yilan landmark zh-TW names (P6b)
 *   89..98 — placeholder names (unused slots)
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Yilan zh-TW name
  // (collectibles 70..81+94, landmarks 82..88). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..88 with Yilan landmark zh-TW names.
  for (const { code, nm } of _YILAN_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Yilan collectible zh-TW names (P7).
  for (const { code, col } of _YILAN_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Fill unused codes 89..93 + 95..98 with placeholder zh-TW names.
  for (const code of _UNUSED_EXTRA_CODES) {
    names[code] = `額外${code}`;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[yilan/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
