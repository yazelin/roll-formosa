/**
 * @file kaohsiung/index.js — Kaohsiung StagePack (P6b).
 *
 * Full content surface required by R16. Wires 8 curated Kaohsiung core
 * landmarks (光之穹頂/駁二/旗津燈塔/龍虎塔/三鳳宮/流行音樂中心/大港橋/
 * 夢時代摩天輪) into the cityMap and catalog so they spawn in the world and can
 * be absorbed; the goal is 高雄85大樓.
 *
 * Pack identity overrides: id='kaohsiung', displayName='高雄', region='TW',
 * locale=zh-TW. Seeds are Kaohsiung-specific (KAOH = 0x4B414F48,
 * v5 extension = 0x56354B41).
 *
 * Validation: routes through validatePack(pack) (R6). Kaohsiung LANDMARKS carry
 * native `name` and `isGoal` fields — the legacy shim is removed.
 *
 * Code-map methods (R5): attached on the pack object via buildCodeMap.
 */

import { TIERS, RESCALE_S, ARCH_PER_TIER, validateTiersStructure } from './tiers.js';
import {
  CATALOG,
  EXTRA_CATALOG,
  DISPLAY_NAME_BY_CODE,
  EXTRA_SIZE_CLASS_BY_CODE,
  EXTRA_POOL_CAPS,
} from './catalog.js';
import { EXTRA_ARCHETYPE_IDS, V5_ARCHETYPE_IDS } from '../../world/objects.js';
import * as cityMap from './cityMap.js';
import { ABSORB_RATIO, MAP_BOUNDS } from '../../config/tuning.js';
import { buildCodeMap, validatePack } from '../_engine/codeMap.js';
import { locale } from './locale.js';
import { goalMonument } from './monument.js';
import * as narration from './narration.js';
import { ending } from './ending.js';

// Kaohsiung replaces EXTRA codes 82..89 with the 8 core landmark ids.
// Collectible codes 70..81 (indices 0..11) and codes 90..93/95..98 carry the
// Kaohsiung extended landmark ids.
import { NM_DOME_OF_LIGHT } from './landmarks/dome_of_light.js';
import { NM_PIER2 } from './landmarks/pier2.js';
import { NM_CIJIN_LIGHTHOUSE } from './landmarks/cijin_lighthouse.js';
import { NM_DRAGON_TIGER } from './landmarks/dragon_tiger.js';
import { NM_SANFENG } from './landmarks/sanfeng_temple.js';
import { NM_MUSIC_CENTER } from './landmarks/music_center.js';
import { NM_DAGANG_BRIDGE } from './landmarks/dagang_bridge.js';
import { NM_DREAM_WHEEL } from './landmarks/dream_mall_wheel.js';

/**
 * EXTRA id order for the Kaohsiung pack.
 * Codes 70..81 (indices 0..11): Kaohsiung collectible ids.
 * Codes 82..89 (indices 12..19): Kaohsiung core landmark ids.
 * Codes 90..93 (indices 20..23): Kaohsiung extended landmark ids.
 * Codes 94..98 (v5 indices 0..4): 美濃油紙傘 + 4 extended landmark ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Kaohsiung collectibles
  'black_bear', 'papaya_milk_king', 'big_bowl_ice', 'qigu_cake', 'duck_meat', 'oden',
  'cijin_ferry', 'mrt_girls', 'pedicab', 'cishan_banana', 'mini_container', 'spring_autumn_pavilion',
  // indices 12..19 — codes 82..89: Kaohsiung core landmark ids
  NM_DOME_OF_LIGHT.id,     // 82 美麗島站光之穹頂
  NM_PIER2.id,             // 83 駁二藝術特區
  NM_CIJIN_LIGHTHOUSE.id,  // 84 旗津燈塔
  NM_DRAGON_TIGER.id,      // 85 龍虎塔
  NM_SANFENG.id,           // 86 三鳳宮
  NM_MUSIC_CENTER.id,      // 87 高雄流行音樂中心
  NM_DAGANG_BRIDGE.id,     // 88 大港橋
  NM_DREAM_WHEEL.id,       // 89 夢時代摩天輪
  // indices 20..23 — codes 90..93: Kaohsiung extended landmarks
  'weiwuying', 'foguangshan', 'takao_railway_museum', 'cihou_fort',
  // v5 codes 94..98 — 94 美濃油紙傘; 95..98 Kaohsiung extended landmarks
  'meinong_umbrella', 'chengcing_pagoda', 'kaohsiung_arena', 'holy_rosary_cathedral', 'love_river_heart',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'kaohsiung',
  displayName: '高雄',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Kaohsiung tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Kaohsiung archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Kaohsiung city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Kaohsiung landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4B414F48, v5: 0x56354B41 }, // KAOH / V5KA
  goalMonument, // 高雄85大樓 goal monument (buildGeometry/pos/winToast)
  narration,    // 月牙 zh-TW narration tables (replaces config/donackLines.js)
  ending,       // Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Kaohsiung LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 core + 高雄85 goal) must pass the strictly-increasing threshold
    // check and the goal-is-largest invariant.
    validatePack(this);
    return true;
  },
};

/**
 * Pack-scoped code-map methods (R5), built once by buildCodeMap and attached
 * to the pack object so consumers read them off `activePack`.
 */
const _codeMap = buildCodeMap(activePack);
/** @type {string[]} code -> archetype id. */
activePack.archetypeIdByCode = _codeMap.idByCode;
/** @type {Record<string, number>} archetype id -> code. */
activePack.codeByArchetypeId = _codeMap.codeById;
/** @type {string[]} code -> display name (Taipei zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
