/**
 * @file catalog.js — Hsinchu pack catalog.
 *
 * Assembles the 70 Hsinchu chunk ArchetypeDefs from the 7 per-tier files,
 * then merges the EXTRA/v5 codes so all 99 codes resolve.
 *
 * Overrides EXTRA codes 82..89 with the 8 curated Hsinchu core landmark
 * geometries (新竹火車站/東門城/玻璃博物館/動物園/清華大學/科學園區/
 * 十七公里海岸風車/青草湖大佛). Codes 70..81+94 are collectibles; codes 90..93
 * +95..98 are the extended Hsinchu landmarks. Code 93 (guanxi_service_area)
 * doubles as the goal display-name slot consumed by goalTower.js.
 *
 * Exports (Hsinchu shape):
 *   CHUNK_ARCHETYPES  Record<id, ArchetypeDef> — 70 Hsinchu chunk archetypes
 *   CATALOG           Record<id, ArchetypeDef> — 70 chunk + 29 EXTRA/v5 (99 ids)
 *   DISPLAY_NAME_BY_CODE  string[99] — indices 0..69 zh-TW, 70..98 names
 *   EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS — Hsinchu-native
 */

import { T0_ARCHETYPES } from './archetypes/t0.js';
import { T1_ARCHETYPES } from './archetypes/t1.js';
import { T2_ARCHETYPES } from './archetypes/t2.js';
import { T3_ARCHETYPES } from './archetypes/t3.js';
import { T4_ARCHETYPES } from './archetypes/t4.js';
import { T5_ARCHETYPES } from './archetypes/t5.js';
import { T6_ARCHETYPES } from './archetypes/t6.js';

// DE-TOKYO: the legacy engine catalog is deleted; every EXTRA/v5 code
// (70..98) is now Hsinchu (collectibles + landmarks), registered below.
import { HERO_TRI_CAP } from '../../config/tuning.js';

import { EXTRA_CODE_BASE } from '../../world/objects.js';

// 8 curated Hsinchu core landmark geometry descriptors (codes 82..89).
import { NM_HSINCHU_STATION } from './landmarks/hsinchu_station.js';
import { NM_DONGMEN } from './landmarks/dongmen.js';
import { NM_GLASS_MUSEUM } from './landmarks/glass_museum.js';
import { NM_HSINCHU_ZOO } from './landmarks/hsinchu_zoo.js';
import { NM_TSING_HUA } from './landmarks/tsing_hua.js';
import { NM_SCIENCE_PARK } from './landmarks/science_park.js';
import { NM_SEVENTEEN_KM } from './landmarks/seventeen_km.js';
import { NM_BIG_BUDDHA } from './landmarks/big_buddha.js';

// 13 Hsinchu collectible (rare album) geometries (codes 70..81 + 94).
import { COL_MEATBALL } from './collectibles/meatball.js';
import { COL_RICE_NOODLE } from './collectibles/rice_noodle.js';
import { COL_PERSIMMON } from './collectibles/wind_persimmon.js';
import { COL_GLASS_ART } from './collectibles/glass_art.js';
import { COL_TECH_CHIP } from './collectibles/tech_chip.js';
import { COL_WIND_LION } from './collectibles/wind_lion.js';
import { COL_TRAIN } from './collectibles/train_model.js';
import { COL_DUCK } from './collectibles/duck.js';
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_PANCAKE } from './collectibles/scallion_pancake.js';
import { COL_CHOPSTICKS } from './collectibles/bamboo_chopsticks.js';
import { COL_LEI_CHA } from './collectibles/hakka_lei_cha.js';
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
    `[hsinchu/catalog] expected exactly 70 chunk archetypes, got ${_allTierArchetypes.length}`
  );
}

/**
 * Hsinchu chunk archetypes keyed by id — 70 entries (one per slot across 7 tiers).
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
 * The 8 Hsinchu curated core landmark geometry descriptors (codes 82..89).
 * tier/naturalBand mirror the Kaohsiung pack's per-code assignment:
 *   82 mid, 83 mid, 84 mid, 85 large, 86 mid, 87 large, 88 large, 89 large.
 */
const _HSINCHU_LANDMARKS = [
  { code: 82, nm: NM_HSINCHU_STATION, sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 83, nm: NM_DONGMEN,         sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 84, nm: NM_GLASS_MUSEUM,    sizeClass: 'landmark-mid',   tier: 3, naturalBand: 3 },
  { code: 85, nm: NM_HSINCHU_ZOO,     sizeClass: 'landmark-large', tier: 4, naturalBand: 4 },
  { code: 86, nm: NM_TSING_HUA,       sizeClass: 'landmark-mid',   tier: 4, naturalBand: 4 },
  { code: 87, nm: NM_SCIENCE_PARK,    sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 88, nm: NM_SEVENTEEN_KM,    sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
  { code: 89, nm: NM_BIG_BUDDHA,      sizeClass: 'landmark-large', tier: 5, naturalBand: 5 },
];

/**
 * Full id-keyed catalog: 70 Hsinchu chunk archetypes PLUS the 24 EXTRA
 * (codes 70..93) and 5 v5 (codes 94..98). Total: exactly 99 ids.
 * @type {Record<string, import('../../../types.js').Archetype>}
 */
export const CATALOG = { ...CHUNK_ARCHETYPES };

/* ================================================================== */
/* EXTRA_CATALOG, EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS            */
/* ================================================================== */

/**
 * EXTRA archetypes keyed by frozen code (70..93 + v5 94..98). Every code is a
 * Hsinchu collectible (70..81+94) or landmark (82..93+95..98), filled by the
 * registration loops below.
 * @type {Record<number, import('../../../types.js').Archetype & {extraCode:number, sizeClass:string|null}>}
 */
export const EXTRA_CATALOG = {};

/**
 * Size-class pool assignment per EXTRA code (filled by the loops below).
 * @type {Record<number, string|null>}
 */
export const EXTRA_SIZE_CLASS_BY_CODE = {};

for (const { code, nm, sizeClass, tier, naturalBand } of _HSINCHU_LANDMARKS) {
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

/* 13 Hsinchu collectibles at codes 70..81 + 94 (rare album items).
   Grounded like landmarks (yOffset = -1 - minY); curated-only (spawnWeight 0). */
const _HSINCHU_COLLECTIBLES = [
  { code: 70, col: COL_MEATBALL },      // 新竹貢丸
  { code: 71, col: COL_RICE_NOODLE },   // 新竹米粉
  { code: 72, col: COL_PERSIMMON },     // 柿餅
  { code: 73, col: COL_GLASS_ART },     // 玻璃藝品
  { code: 74, col: COL_TECH_CHIP },     // 晶片
  { code: 75, col: COL_WIND_LION },     // 風獅爺
  { code: 76, col: COL_TRAIN },         // 火車模型
  { code: 77, col: COL_DUCK },          // 鴨子
  { code: 78, col: COL_BLACK_BEAR },    // 台灣黑熊
  { code: 79, col: COL_PANCAKE },       // 蔥油餅
  { code: 80, col: COL_CHOPSTICKS },    // 竹筷
  { code: 81, col: COL_LEI_CHA },       // 客家擂茶
  { code: 94, col: COL_MAZU },          // 媽祖
];
for (const { code, col } of _HSINCHU_COLLECTIBLES) {
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
    // 600-tri hero budget like landmarks. Several Hsinchu collectibles are richer
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

/* DE-TOKYO: 8 Hsinchu extended landmarks at codes 90-93 + 95-98.
   Reuse core landmarks with _ext suffix to fill these codes.
   Code mapping:
     90 hsinchu_station_ext (reuse 新竹火車站)
     91 dongmen_gate_ext (reuse 東門城)
     92 glass_museum_ext (reuse 玻璃博物館)
     93 hsinchu_zoo_ext (reuse 動物園 — goal display slot)
     95 tsing_hua_gate_ext (reuse 清華大學)
     96 science_park_center_ext (reuse 科學園區)
     97 coastal_wind_turbine_ext (reuse 十七公里海岸風車)
     98 qingcao_buddha_ext (reuse 青草湖大佛)
*/
const _HSINCHU_EXTRA_LANDMARKS = [
  { code: 90, nm: NM_HSINCHU_STATION, extId: 'hsinchu_station_ext',       extName: '新竹火車站', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 91, nm: NM_DONGMEN,         extId: 'dongmen_gate_ext',          extName: '東門城',     sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 92, nm: NM_GLASS_MUSEUM,    extId: 'glass_museum_ext',          extName: '玻璃博物館', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 93, nm: NM_HSINCHU_ZOO,     extId: 'hsinchu_zoo_ext',           extName: '新竹動物園', sizeClass: 'landmark-xl',  tier: 5, naturalBand: 5 },
  { code: 95, nm: NM_TSING_HUA,       extId: 'tsing_hua_gate_ext',        extName: '清華大學',   sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
  { code: 96, nm: NM_SCIENCE_PARK,    extId: 'science_park_center_ext',   extName: '科學園區',   sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 97, nm: NM_SEVENTEEN_KM,    extId: 'coastal_wind_turbine_ext',  extName: '海岸風車',   sizeClass: 'landmark-mid', tier: 5, naturalBand: 5 },
  { code: 98, nm: NM_BIG_BUDDHA,      extId: 'qingcao_buddha_ext',        extName: '青草湖大佛', sizeClass: 'landmark-mid', tier: 4, naturalBand: 4 },
];
for (const { code, nm, extId, extName, sizeClass, tier, naturalBand } of _HSINCHU_EXTRA_LANDMARKS) {
  const _g = nm.buildGeometry(() => 0.5);
  _g.computeBoundingBox();
  const _yOffset = -1 - _g.boundingBox.min.y;
  if (_g.dispose) _g.dispose();
  const entry = {
    id: extId,
    displayName: extName,
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
  CATALOG[extId] = entry;
  EXTRA_CATALOG[code] = entry;
  EXTRA_SIZE_CLASS_BY_CODE[code] = sizeClass;
}

/**
 * EXTRA render pool caps. Hsinchu has 8 core landmark singletons:
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
 *   0..69  — zh-TW names from the Hsinchu chunk archetypes (displayName field)
 *   70..81 — Hsinchu collectible zh-TW names
 *   82..89 — Hsinchu core landmark zh-TW names
 *   90..98 — Hsinchu extended landmark + 媽祖(94) zh-TW names
 * @type {string[]}
 */
export const DISPLAY_NAME_BY_CODE = (() => {
  const names = new Array(99);

  // Codes 0..69: zh-TW chunk names in tier-major, slot-minor order.
  for (let i = 0; i < _allTierArchetypes.length; i++) {
    names[i] = _allTierArchetypes[i].displayName || '';
  }

  // Codes 70..98: every code is overridden below with a Hsinchu zh-TW name
  // (collectibles 70..81+94, landmarks 82..93+95..98). Init '' (de-Tokyo).
  for (let c = EXTRA_CODE_BASE; c < 99; c++) {
    names[c] = '';
  }

  // Override codes 82..89 with Hsinchu core landmark zh-TW names.
  for (const { code, nm } of _HSINCHU_LANDMARKS) {
    names[code] = nm.name;
  }

  // Override codes 70..81 + 94 with Hsinchu collectible zh-TW names.
  for (const { code, col } of _HSINCHU_COLLECTIBLES) {
    names[code] = col.name;
  }

  // DE-TOKYO: codes 90..93 + 95..98 -> Hsinchu extended landmark zh-TW names.
  for (const { code, extName } of _HSINCHU_EXTRA_LANDMARKS) {
    names[code] = extName;
  }

  return names;
})();

if (DISPLAY_NAME_BY_CODE.length !== 99) {
  throw new Error(
    `[hsinchu/catalog] DISPLAY_NAME_BY_CODE must be 99 entries, got ${DISPLAY_NAME_BY_CODE.length}`
  );
}
