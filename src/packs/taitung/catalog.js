/**
 * @file catalog.js — Taitung pack catalog (P5/P6b).
 *
 * Assembles the 70 Taitung chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Taitung landmark
 * geometries (鐵花村/台東火車站/池上飯包/金城武樹/都蘭糖廠/鹿野高台/
 * 阿美族民俗中心/知本溫泉). Codes 70..81 (collectibles), 90..92 (shop/bridge/
 * tower slot), 93 (goal display slot), and v5 94..98 are unchanged placeholders.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Taitung chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Taitung-native
 *     for codes 82..89; remainder from the legacy engine catalog
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

// P6b: 8 curated Taitung landmark geometry descriptors (codes 82..89).
import { NM_TIEHUA } from './landmarks/tiehua_village.js';
import { NM_TAITUNG_STATION } from './landmarks/taitung_station.js';
import { NM_CHISHANG } from './landmarks/chishang_rice.js';
import { NM_TAKESHI_TREE } from './landmarks/takeshi_tree.js';
import { NM_DULAN } from './landmarks/dulan_sugar.js';
import { NM_LUYE_BALLOON } from './landmarks/luye_balloon.js';
import { NM_AMIS } from './landmarks/amis_cultural.js';
import { NM_JHIHBEN } from './landmarks/jhihben_hot_spring.js';

// P7: 13 Taitung collectible (rare album) geometries (codes 70..81 + 94).
import { COL_SUGAR_APPLE } from './collectibles/sugar_apple.js';
import { COL_FLYING_FISH } from './collectibles/flying_fish.js';
import { COL_MILLET_WINE } from './collectibles/millet_wine.js';
import { COL_TRIBAL_BEADS } from './collectibles/tribal_beads.js';
import { COL_HOT_AIR_BALLOON } from './collectibles/hot_air_balloon.js';
import { COL_RICE_BENTO } from './collectibles/rice_bento.js';
import { COL_TAO_BOAT } from './collectibles/tao_boat.js';
import { COL_MAKAO_SAUSAGE } from './collectibles/makao_sausage.js';
import { COL_BOAR_MEAT } from './collectibles/boar_meat.js';
import { COL_PAIWAN_POT } from './collectibles/paiwan_pot.js';
import { COL_SURFBOARD } from './collectibles/surfboard.js';
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_MAZU } from './collectibles/mazu.js';

// 8 Taitung extended landmarks at codes 90-93 + 95-98 (display-only slots).
// For Taitung these are placeholder entries derived from the 8 curated landmarks.
import { NM_SANXIANTAI } from './landmarks/sanxiantai_bridge.js';

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
    `[taitung/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Taitung chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Taitung curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Taitung landmark id (e.g. 'tiehua_village') not the legacy id.
 * P6b: tier/naturalBand match the EXTRA_POOL_CLASS assignment in curated.js:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _TAITUNG_LANDMARKS = [
  { code: 82, nm: NM_TIEHUA,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_TAITUNG_STATION, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_CHISHANG,       sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_TAKESHI_TREE,   sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_DULAN,          sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_LUYE_BALLOON,   sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_AMIS,           sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_JHIHBEN,        sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Taitung chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Taitung landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
// CATALOG = 70 Taitung chunk archetypes + the Taitung EXTRA/v5 (collectibles +
// landmarks) registered by the loops below.
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Taitung collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below.
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _TAITUNG_LANDMARKS) {
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

/* P7: 13 Taitung collectibles at codes 70..81 + 94 (replace placeholder album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _TAITUNG_COLLECTIBLES = [
  { code: 70, col: COL_SUGAR_APPLE },
  { code: 71, col: COL_FLYING_FISH },
  { code: 72, col: COL_MILLET_WINE },
  { code: 73, col: COL_TRIBAL_BEADS },
  { code: 74, col: COL_HOT_AIR_BALLOON },
  { code: 75, col: COL_RICE_BENTO },
  { code: 76, col: COL_TAO_BOAT },
  { code: 77, col: COL_MAKAO_SAUSAGE },
  { code: 78, col: COL_BOAR_MEAT },
  { code: 79, col: COL_PAIWAN_POT },
  { code: 80, col: COL_SURFBOARD },
  { code: 81, col: COL_BLACK_BEAR },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _TAITUNG_COLLECTIBLES) {
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
    heroTriCap: HERO_TRI_CAP, // curated collectibles get the 600-tri hero budget
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* Taitung extended landmarks at codes 90-93 + 95-98 (display-only slots).
   Code 93 = goal display slot (三仙台八拱橋); others are placeholder names. */
const _TAITUNG_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_TIEHUA,         sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_TAITUNG_STATION, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_CHISHANG,       sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_SANXIANTAI,     sizeClass: 'landmark-xl',  tier: 6, naturalBand: 6 },
  { code: 95, nm: NM_TAKESHI_TREE,   sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_DULAN,          sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_LUYE_BALLOON,   sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_AMIS,           sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _TAITUNG_EXTRA_LANDMARKS) {
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
 * EXTRA render pool caps. Taitung has 8 landmark singletons:
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
 *   0..69  — zh-TW names from the Taitung chunk archetypes (displayName field)
 *   70..81 — Taitung collectible zh-TW names
 *   82..89 — Taitung landmark zh-TW names (P6b)
 *   90..98 — Taitung extended landmark names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init '' then override with registered names below.
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Taitung landmark zh-TW names.
  for (const { code, nm } of _TAITUNG_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Taitung collectible zh-TW names (P7).
  for (const { code, col } of _TAITUNG_COLLECTIBLES) {
    names[code] = col.name;
  }

  // Codes 90..93 + 95..98 -> Taitung extended landmark zh-TW names.
  for (const { code, nm } of _TAITUNG_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[taitung/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
