/**
 * @file catalog.js — Kaohsiung pack catalog (P5/P6b).
 *
 * Assembles the 70 Kaohsiung chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 codes so all 99 codes resolve.
 *
 * P6b: overrides EXTRA codes 82..89 with the 8 curated Kaohsiung core landmark
 * geometries (光之穹頂/駁二/旗津燈塔/龍虎塔/三鳳宮/流行音樂中心/大港橋/
 * 夢時代摩天輪). Codes 70..81+94 are collectibles; codes 90..93+95..98 are the
 * extended Kaohsiung landmarks. Code 93 (takao_railway) doubles as the goal
 * display-name slot consumed by goalTower.js.
 *
 * Exports (P5/P6b shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Kaohsiung chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Kaohsiung-native
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

// DE-TOKYO: the legacy engine catalog is deleted; every EXTRA/v5 code
// (70..98) is now Kaohsiung (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// P6b: 8 curated Kaohsiung core landmark geometry descriptors (codes 82..89).
import { NM_DOME_OF_LIGHT } from './landmarks/dome_of_light.js';
import { NM_PIER2 } from './landmarks/pier2.js';
import { NM_CIJIN_LIGHTHOUSE } from './landmarks/cijin_lighthouse.js';
import { NM_DRAGON_TIGER } from './landmarks/dragon_tiger.js';
import { NM_SANFENG } from './landmarks/sanfeng_temple.js';
import { NM_MUSIC_CENTER } from './landmarks/music_center.js';
import { NM_DAGANG_BRIDGE } from './landmarks/dagang_bridge.js';
import { NM_DREAM_WHEEL } from './landmarks/dream_mall_wheel.js';

// P7: 13 Kaohsiung collectible (rare album) geometries (codes 70..81 + 94).
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_PAPAYA_MILK } from './collectibles/papaya_milk_king.js';
import { COL_BIG_BOWL_ICE } from './collectibles/big_bowl_ice.js';
import { COL_QIGU_CAKE } from './collectibles/qigu_cake.js';
import { COL_DUCK_MEAT } from './collectibles/duck_meat.js';
import { COL_ODEN } from './collectibles/oden.js';
import { COL_CIJIN_FERRY } from './collectibles/cijin_ferry.js';
import { COL_MRT_GIRLS } from './collectibles/mrt_girls.js';
import { COL_PEDICAB } from './collectibles/pedicab.js';
import { COL_CISHAN_BANANA } from './collectibles/cishan_banana.js';
import { COL_MINI_CONTAINER } from './collectibles/mini_container.js';
import { COL_SPRING_AUTUMN } from './collectibles/spring_autumn.js';
import { COL_MEINONG_UMBRELLA } from './collectibles/meinong_umbrella.js';

// DE-TOKYO: 8 Kaohsiung extended landmarks fill codes 90-93 + 95-98.
import { NM_WEIWUYING } from './landmarks/weiwuying.js';
import { NM_FOGUANGSHAN } from './landmarks/foguangshan.js';
import { NM_TAKAO_RAILWAY } from './landmarks/takao_railway.js';
import { NM_CIHOU_FORT } from './landmarks/cihou_fort.js';
import { NM_CHENGCING } from './landmarks/chengcing_pagoda.js';
import { NM_KAO_ARENA } from './landmarks/kaohsiung_arena.js';
import { NM_HOLY_ROSARY } from './landmarks/holy_rosary.js';
import { NM_LOVE_RIVER_HEART } from './landmarks/love_river_heart.js';

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
    `[kaohsiung/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Kaohsiung chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
 * Code i = the archetype at array position i (tier*10 + slot within tier).
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CHUNK_ARCHETYPES = {};
for (const arch of _allTierArchetypes) {
  CHUNK_ARCHETYPES[arch.id] = arch;
}

/* ================================================================== */
/* CATALOG — 70 chunk + 29 EXTRA/v5 = 99 ids                          */
/* ================================================================== */

/**
 * The 8 Kaohsiung curated core landmark geometry descriptors (codes 82..89).
 * tier/naturalBand mirror the Taipei pack's per-code assignment:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _KAOHSIUNG_LANDMARKS = [
  { code: 82, nm: NM_DOME_OF_LIGHT,     sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_PIER2,             sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_CIJIN_LIGHTHOUSE,  sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_DRAGON_TIGER,      sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_SANFENG,           sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_MUSIC_CENTER,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_DAGANG_BRIDGE,     sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_DREAM_WHEEL,       sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Kaohsiung chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Kaohsiung collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below.
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _KAOHSIUNG_LANDMARKS) {
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

/* P7: 13 Kaohsiung collectibles at codes 70..81 + 94 (rare album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _KAOHSIUNG_COLLECTIBLES = [
  { code: 70, col: COL_BLACK_BEAR },
  { code: 71, col: COL_PAPAYA_MILK },
  { code: 72, col: COL_BIG_BOWL_ICE },
  { code: 73, col: COL_QIGU_CAKE },
  { code: 74, col: COL_DUCK_MEAT },
  { code: 75, col: COL_ODEN },
  { code: 76, col: COL_CIJIN_FERRY },
  { code: 77, col: COL_MRT_GIRLS },
  { code: 78, col: COL_PEDICAB },
  { code: 79, col: COL_CISHAN_BANANA },
  { code: 80, col: COL_MINI_CONTAINER },
  { code: 81, col: COL_SPRING_AUTUMN },
  { code: 94, col: COL_MEINONG_UMBRELLA },
];
for (const { code, col } of _KAOHSIUNG_COLLECTIBLES) {
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
    // Curated singleton (spawnWeight 0, placed not mass-rolled) — uses the
    // 600-tri hero budget like landmarks. Several 高雄 collectibles are richer
    // than the 350 chunk cap; the EXTRA pools size buffers by actual verts.
    heroTriCap: HERO_TRI_CAP,
    buildGeometry: col.buildGeometry.bind(col),
    extraCode: code,
    sizeClass: 'collectible-small',
  };
  CATALOG[col.id] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = 'collectible-small';
}

/* DE-TOKYO: 8 Kaohsiung extended landmarks at codes 90-93 + 95-98.
   Grounded like landmarks; not placed yet (code 93 doubles as goal slot). */
const _KAOHSIUNG_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_WEIWUYING,       sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_FOGUANGSHAN,     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_TAKAO_RAILWAY,   sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_CIHOU_FORT,      sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_CHENGCING,       sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_KAO_ARENA,       sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_HOLY_ROSARY,     sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_LOVE_RIVER_HEART, sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, sizeClass, tier, naturalBand } of _KAOHSIUNG_EXTRA_LANDMARKS) {
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
 * EXTRA render pool caps. Kaohsiung has 8 core landmark singletons:
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
 *   0..69  — zh-TW names from the Kaohsiung chunk archetypes (displayName field)
 *   70..81 — Kaohsiung collectible zh-TW names
 *   82..89 — Kaohsiung core landmark zh-TW names
 *   90..98 — Kaohsiung extended landmark + 媽傘(94) zh-TW names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Kaohsiung zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Kaohsiung core landmark zh-TW names.
  for (const { code, nm } of _KAOHSIUNG_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Kaohsiung collectible zh-TW names (P7).
  for (const { code, col } of _KAOHSIUNG_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Kaohsiung extended landmark zh-TW names.
  for (const { code, nm } of _KAOHSIUNG_EXTRA_LANDMARKS) {
    names[code] = nm.name;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[kaohsiung/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
