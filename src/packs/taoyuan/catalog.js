/**
 * @file catalog.js — Taoyuan pack catalog (P5/P6b).
 *
 * Assembles the 70 Taoyuan chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Taoyuan landmark
 * geometries (大溪橋/大溪老街/中壢車站/虎頭山/慈湖陵寢/永安漁港/
 * 桃園機場航廈/石門水庫). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged placeholders.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Taoyuan chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Taoyuan-native
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
// (70..98) is now Taoyuan (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Taoyuan landmark geometry descriptors (codes 82..89).
import { NM_DAXI_BRIDGE } from './landmarks/daxi_bridge.js';
import { NM_DAXI_OLDSTREET } from './landmarks/daxi_oldstreet.js';
import { NM_ZHONGLI_STATION } from './landmarks/zhongli_station.js';
import { NM_HUTOUSHAN } from './landmarks/hutoushan.js';
import { NM_CIHU_MAUSOLEUM } from './landmarks/cihu_mausoleum.js';
import { NM_YONGAN_HARBOR } from './landmarks/yongan_harbor.js';
import { NM_TPE_TERMINAL } from './landmarks/tpe_terminal.js';
import { NM_SHIMEN_RESERVOIR } from './landmarks/shimen_reservoir.js';

// P7: 13 Taiwan collectible (rare album) geometries (codes 70..81 + 94).
// These are Taiwan-wide items that fit all cities.
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_BOBA } from './collectibles/boba.js';
import { COL_SQUIDBALL } from './collectibles/yongan_squidball.js';
import { COL_LOTUS } from './collectibles/guanyin_lotus.js';
import { COL_RICENOODLE } from './collectibles/longgang_ricenoodle.js';
import { COL_YUEGUANG } from './collectibles/yueguang_bing.js';
import { COL_GENERAL } from './collectibles/daxi_general.js';
import { COL_LEICHA } from './collectibles/hakka_leicha.js';
import { COL_TOP } from './collectibles/daxi_top.js';
import { COL_FISH } from './collectibles/shimen_fish.js';
import { COL_PEACH } from './collectibles/lalashan_peach.js';
import { COL_DOUHUA } from './collectibles/daxi_douhua.js';
import { COL_MAZU } from './collectibles/mazu.js';

// DE-TOKYO: 8 Taoyuan extended landmarks replace the leftover EXTRA slots (codes 90-93 + 95-98).
// For Taoyuan, we use the goal monument (大溪牌樓) at code 93 and placeholder entries for others.
import { NM_DAXI_PAILOU } from './landmarks/daxi_pailou.js';

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
    `[taoyuan/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Taoyuan chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Taoyuan curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Taoyuan landmark id (e.g. 'daxi_bridge') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 mid, 86 mid, 87 large, 88 large, 89 large.
 */
const _TAOYUAN_LANDMARKS = [
  { code: 82, nm: NM_DAXI_BRIDGE,      sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_DAXI_OLDSTREET,   sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_ZHONGLI_STATION,  sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_HUTOUSHAN,        sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_CIHU_MAUSOLEUM,   sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_YONGAN_HARBOR,    sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_TPE_TERMINAL,     sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_SHIMEN_RESERVOIR, sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Taoyuan chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Taoyuan landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Taoyuan chunk archetypes + the Taoyuan EXTRA/v5 (collectibles +
// landmarks) registered by the loops below. No placeholder archetypes (de-Tokyo).
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Taiwan collectible (70..81+94) or Taoyuan landmark (82..93+95..98), filled by the
 * registration loops below. No placeholder entries (de-Tokyo).
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _TAOYUAN_LANDMARKS) {
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

/* P7: 13 Taiwan collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _TAIWAN_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_BOBA },
  { code: 72, col: COL_SQUIDBALL },
  { code: 73, col: COL_LOTUS },
  { code: 74, col: COL_RICENOODLE },
  { code: 75, col: COL_YUEGUANG },
  { code: 76, col: COL_GENERAL },
  { code: 77, col: COL_LEICHA },
  { code: 78, col: COL_TOP },
  { code: 79, col: COL_FISH },
  { code: 80, col: COL_PEACH },
  { code: 81, col: COL_DOUHUA },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _TAIWAN_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // collectibles get the 600-tri hero budget
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* DE-TOKYO: codes 90-93 + 95-98 -> Taoyuan placeholder/goal landmark entries.
   Code 93 = goal display slot (大溪牌樓); others are placeholder slots. */
const _TAOYUAN_EXTRA_LANDMARKS = [
  // Reuse taoyuan's own landmarks for variety (was 8× 大溪牌樓 = the goal repeated).
  { code: 90, nm: NM_DAXI_BRIDGE,      sizeClass: 'landmark-xl', tier: 6, naturalBand: 6 },
  { code: 91, nm: NM_DAXI_OLDSTREET,   sizeClass: 'landmark-xl', tier: 6, naturalBand: 6 },
  { code: 92, nm: NM_ZHONGLI_STATION,  sizeClass: 'landmark-xl', tier: 6, naturalBand: 6 },
  { code: 93, nm: NM_HUTOUSHAN,        sizeClass: 'landmark-xl', tier: 6, naturalBand: 6 },
  { code: 95, nm: NM_CIHU_MAUSOLEUM,   sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 96, nm: NM_YONGAN_HARBOR,    sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_TPE_TERMINAL,     sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_SHIMEN_RESERVOIR, sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _TAOYUAN_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: `${nm.id}_${code}`, // unique id per code to avoid collision
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
 * EXTRA render pool caps. Taoyuan has 8 landmark singletons:
 *   landmark-mid (codes 82/83/84/85/86): 5 alive
 *   landmark-large (codes 87/88/89): 3 alive
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
 *   0..69  — zh-TW names from the Taoyuan chunk archetypes (displayName field)
 *   70..81 — collectible zh-TW names
 *   82..89 — Taoyuan landmark zh-TW names (P6b)
 *   90..98 — placeholder/goal names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Taoyuan zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Taoyuan landmark zh-TW names.
  for (const { code, nm } of _TAOYUAN_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Taiwan collectible zh-TW names (P7).
  for (const { code, col } of _TAIWAN_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Taoyuan goal/placeholder zh-TW names.
  for (const { code, nm } of _TAOYUAN_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[taoyuan/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
