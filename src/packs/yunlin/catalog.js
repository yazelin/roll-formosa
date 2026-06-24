/**
 * @file catalog.js — Yunlin pack catalog (P5/P6b).
 *
 * Assembles the 70 Yunlin chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 placeholders so all 99 codes still resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Yunlin landmark
 * geometries (北港朝天宮/西螺老街/虎尾布袋戲館/古坑咖啡園/斗六圓環/
 * 劍湖山世界/斗南火車站/雲林布袋戲偶文物館). Codes 70..81 (collectibles),
 * 90..93 (extended landmarks), and v5 94..98 are Yunlin-specific.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Yunlin chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Yunlin-native
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

// P6b: 8 curated Yunlin landmark geometry descriptors (codes 82..89).
import { NM_BEIGANG_CHAOTIAN } from './landmarks/beigang_chaotian.js';
import { NM_XILUO_OLDSTREET } from './landmarks/xiluo_oldstreet.js';
import { NM_HUWEI_PUPPET_MUSEUM } from './landmarks/huwei_puppet_museum.js';
import { NM_GUKENG_COFFEE } from './landmarks/gukeng_coffee.js';
import { NM_DOULIU_ROUNDABOUT } from './landmarks/douliu_roundabout.js';
import { NM_JANFUSUN_FANCYWORLD } from './landmarks/janfusun_fancyworld.js';
import { NM_DOUNAN_STATION } from './landmarks/dounan_station.js';
import { NM_YUNLIN_PUPPET_CENTER } from './landmarks/yunlin_puppet_center.js';

// Goal monument for extended landmarks
import { NM_XILUO_BRIDGE } from './landmarks/xiluo_bridge.js';

// P7: 13 Yunlin collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_SOY_SAUCE } from './collectibles/soy_sauce.js';
import { COL_PEANUT } from './collectibles/peanut.js';
import { COL_PUPPET } from './collectibles/puppet.js';
import { COL_COFFEE_CUP } from './collectibles/coffee_cup.js';
import { COL_RICE_BOWL } from './collectibles/rice_bowl.js';
import { COL_SANTAIZI } from './collectibles/santaizi.js';
import { COL_BUDAIXI } from './collectibles/budaixi.js';
import { COL_STRAW_HAT } from './collectibles/straw_hat.js';
import { COL_TARO } from './collectibles/taro.js';
import { COL_WATERMELON } from './collectibles/watermelon.js';
import { COL_SUGARCANE } from './collectibles/sugarcane.js';
import { COL_MAZU } from './collectibles/mazu.js';

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
    `[yunlin/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Yunlin chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Yunlin curated landmark geometry descriptors (codes 82..89).
 * These REPLACE the placeholder landmark ids at the same codes — the id field is
 * the Yunlin landmark id (e.g. 'beigang_chaotian') not the legacy id.
 */
const _YUNLIN_LANDMARKS = [
  { code: 82, nm: NM_BEIGANG_CHAOTIAN,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_XILUO_OLDSTREET,     sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_HUWEI_PUPPET_MUSEUM, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_GUKENG_COFFEE,       sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_DOULIU_ROUNDABOUT,   sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_JANFUSUN_FANCYWORLD, sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_DOUNAN_STATION,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_YUNLIN_PUPPET_CENTER,sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Yunlin chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Codes 82..89 are replaced with
 * Yunlin landmark geometries; all others carry placeholder archetypes.
 * Total: exactly 99 ids.
 * @type {Record<string, import('../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Yunlin collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below.
 * @type {Record<number, import('../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _YUNLIN_LANDMARKS) {
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

/* 13 Yunlin collectibles at codes 70..81 + 94. */
const _YUNLIN_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_SOY_SAUCE },
  { code: 72, col: COL_PEANUT },
  { code: 73, col: COL_PUPPET },
  { code: 74, col: COL_COFFEE_CUP },
  { code: 75, col: COL_RICE_BOWL },
  { code: 76, col: COL_SANTAIZI },
  { code: 77, col: COL_BUDAIXI },
  { code: 78, col: COL_STRAW_HAT },
  { code: 79, col: COL_TARO },
  { code: 80, col: COL_WATERMELON },
  { code: 81, col: COL_SUGARCANE },
  { code: 94, col: COL_MAZU },
];
for (const { code, col } of _YUNLIN_COLLECTIBLES) {
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

/* 8 Yunlin extended landmarks at codes 90-93 + 95-98 (reuse goal monument). */
const _YUNLIN_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_XILUO_BRIDGE, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _YUNLIN_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: `${nm.id}_${code}`, // make unique id for each code
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
 * EXTRA render pool caps. Yunlin has 8 landmark singletons:
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
 *   0..69  — zh-TW names from the Yunlin chunk archetypes (displayName field)
 *   70..81 — collectible names
 *   82..89 — Yunlin landmark zh-TW names
 *   90..98 — extended landmark names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: init '' then override
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Yunlin landmark zh-TW names.
  for (const { code, nm } of _YUNLIN_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Yunlin collectible zh-TW names.
  for (const { code, col } of _YUNLIN_COLLECTIBLES) {
    names[code] = col.name;
  }

  // codes 90..93 + 95..98 -> Yunlin extended landmark zh-TW names.
  for (const { code, nm } of _YUNLIN_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[yunlin/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
