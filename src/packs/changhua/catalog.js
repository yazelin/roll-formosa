/**
 * @file catalog.js — Changhua pack catalog (P5/P6b).
 *
 * Assembles the 70 Changhua chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Changhua landmark
 * geometries (鹿港龍山寺/鹿港天后宮/扇形車庫/彰化孔廟/摸乳巷/九曲巷/
 * 玻璃廟/王功燈塔). Codes 70..81 (collectibles), 90..93 (extended landmarks),
 * and v5 94..98 are Changhua-native (mazu + extended landmarks).
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Changhua chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Changhua-native
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
// (70..98) is now Changhua (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Changhua landmark geometry descriptors (codes 82..89).
import { NM_LUKANG_LONGSHAN } from './landmarks/lukang_longshan.js';
import { NM_LUKANG_TIANHOU } from './landmarks/lukang_tianhou.js';
import { NM_ROUNDHOUSE } from './landmarks/roundhouse.js';
import { NM_CHANGHUA_CONFUCIUS } from './landmarks/changhua_confucius.js';
import { NM_MORUXIANG } from './landmarks/moruxiang.js';
import { NM_JIUQUXIANG } from './landmarks/jiuquxiang.js';
import { NM_GLASS_TEMPLE } from './landmarks/glass_temple.js';
import { NM_WANGGONG_LIGHTHOUSE } from './landmarks/wanggong_lighthouse.js';

// P7: 13 Changhua collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_MEATBALL } from './collectibles/meatball.js';
import { COL_KONGROU_RICE } from './collectibles/kongrou_rice.js';
import { COL_OYSTER_OMELET } from './collectibles/oyster_omelet.js';
import { COL_OX_TONGUE_CAKE } from './collectibles/ox_tongue_cake.js';
import { COL_PHOENIX_EYE } from './collectibles/phoenix_eye_cake.js';
import { COL_MISUA } from './collectibles/misua.js';
import { COL_FACE_TEA } from './collectibles/face_tea.js';
import { COL_OLD_LOCOMOTIVE } from './collectibles/old_locomotive.js';
import { COL_PAPER_FAN } from './collectibles/paper_fan.js';
import { COL_LANTERN } from './collectibles/lantern.js';
import { COL_LUGANG_INCENSE } from './collectibles/lugang_incense.js';
import { COL_MAZU } from './collectibles/mazu.js';

// DE-TOKYO: 8 Changhua extended landmarks replace the leftover EXTRA slots (codes 90-93 + 95-98).
import { NM_YUANLIN_STATION } from './landmarks/yuanlin_station.js';
import { NM_LUKANG_OLD_STREET } from './landmarks/lukang_old_street.js';
import { NM_CHANGHUA_STATION } from './landmarks/changhua_station.js';
import { NM_BAGUASHAN_SKYWAY } from './landmarks/baguashan_skyway.js';
import { NM_TIANWEI_HIGHWAY_GARDEN } from './landmarks/tianwei_highway_garden.js';
import { NM_LUKANG_WENKAI_ACADEMY } from './landmarks/lukang_wenkai_academy.js';
import { NM_LUKANG_FIRST_STREET } from './landmarks/lukang_first_street.js';
import { NM_XILUO_BRIDGE } from './landmarks/xiluo_bridge.js';

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
    `[changhua/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Changhua chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Changhua curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Changhua landmark id (e.g. 'lukang_longshan') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _CHANGHUA_LANDMARKS = [
  { code: 82, nm: NM_LUKANG_LONGSHAN,     sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_LUKANG_TIANHOU,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_ROUNDHOUSE,          sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_CHANGHUA_CONFUCIUS,  sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_MORUXIANG,           sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_JIUQUXIANG,          sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_GLASS_TEMPLE,        sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_WANGGONG_LIGHTHOUSE, sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Changhua chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Changhua landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Changhua chunk archetypes + the Changhua EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Changhua collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _CHANGHUA_LANDMARKS) {
  // Ground offset: build the finished (unit-sphere-normalized) geometry once and
  // set yOffset = -1 - minY so the landmark's BASE rests on the ground. A fixed
  // -0.2 left wide/low landmarks (龍山寺/天后宮/etc) floating (P6b bug).
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

/* P7: 13 Changhua collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _CHANGHUA_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_MEATBALL },
  { code: 72, col: COL_KONGROU_RICE },
  { code: 73, col: COL_OYSTER_OMELET },
  { code: 74, col: COL_OX_TONGUE_CAKE },
  { code: 75, col: COL_PHOENIX_EYE },
  { code: 76, col: COL_MISUA },
  { code: 77, col: COL_FACE_TEA },
  { code: 78, col: COL_OLD_LOCOMOTIVE },
  { code: 79, col: COL_PAPER_FAN },
  { code: 80, col: COL_LANTERN },
  { code: 81, col: COL_LUGANG_INCENSE },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _CHANGHUA_COLLECTIBLES) {
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

/* DE-TOKYO: 8 Changhua extended landmarks at codes 90-93 + 95-98 (replace the
   leftover EXTRA archetypes). Grounded like landmarks; not placed yet. */
const _CHANGHUA_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_YUANLIN_STATION,        sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_LUKANG_OLD_STREET,      sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_CHANGHUA_STATION,       sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_BAGUASHAN_SKYWAY,       sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_TIANWEI_HIGHWAY_GARDEN, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_LUKANG_WENKAI_ACADEMY,  sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_LUKANG_FIRST_STREET,    sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_XILUO_BRIDGE,           sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _CHANGHUA_EXTRA_LANDMARKS) {
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
 * EXTRA render pool caps. Changhua has 8 landmark singletons:
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
 *   0..69  — zh-TW names from the Changhua chunk archetypes (displayName field)
 *   70..81 — placeholder names (collectibles)
 *   82..89 — Changhua landmark zh-TW names (P6b)
 *   90..98 — placeholder names (shop shell, bridge, tower, v5)
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Changhua zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Changhua landmark zh-TW names.
  for (const { code, nm } of _CHANGHUA_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Changhua collectible zh-TW names (P7).
  for (const { code, col } of _CHANGHUA_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Changhua extended landmark zh-TW names.
  for (const { code, nm } of _CHANGHUA_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[changhua/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
