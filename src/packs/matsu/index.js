/**
 * @file matsu/index.js — Matsu StagePack (連江馬祖).
 *
 * Full content surface for the Matsu pack. Wires 8 curated Matsu landmarks
 * (藍眼淚沙灘/鐵堡/八角據點/北海坑道/境天后宮/芹壁聚落/東引燈塔/媽祖巨神像)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity: id='matsu', displayName='連江馬祖', region='TW',
 * locale=zh-TW. Seeds are Matsu-specific.
 *
 * Code-map methods attached via buildCodeMap.
 */

import { TIERS, RESCALE_S, ARCH_PER_TIER, validateTiersStructure } from './tiers.js';
import {
  CATALOG,
  EXTRA_CATALOG,
  DISPLAY_NAME_BY_CODE,
  EXTRA_SIZE_CLASS_BY_CODE,
  EXTRA_POOL_CAPS,
} from './catalog.js';
import { EXTRA_ARCHETYPE_IDS } from '../../world/objects.js';
import * as cityMap from './cityMap.js';
import { ABSORB_RATIO, MAP_BOUNDS } from '../../config/tuning.js';
import { buildCodeMap, validatePack } from '../_engine/codeMap.js';
import { locale } from './locale.js';
import { goalMonument } from './monument.js';
import * as narration from './narration.js';
import { ending } from './ending.js';

// Import Matsu landmark descriptors for extraIds.
import { NM_BLUE_TEARS_BEACH } from './landmarks/blue_tears_beach.js';
import { NM_IRON_FORT } from './landmarks/iron_fort.js';
import { NM_BAJIU_AOYA } from './landmarks/bajiu_aoya.js';
import { NM_BEIHAI_TUNNEL } from './landmarks/beihai_tunnel.js';
import { NM_TIANHOU_TEMPLE } from './landmarks/tianhou_temple.js';
import { NM_QINBI_VILLAGE } from './landmarks/qinbi_village.js';
import { NM_DONGYIN_LIGHTHOUSE } from './landmarks/dongyin_lighthouse.js';
import { NM_MATSU_GODDESS } from './landmarks/matsu_goddess.js';

/**
 * EXTRA id order for the Matsu pack.
 * Codes 70..81 (indices 0..11): Matsu collectibles.
 * Codes 82..89 (indices 12..19): Matsu landmark ids.
 * Codes 90..93 (indices 20..23): extended landmarks (placeholder).
 * Codes 94..98 (v5 indices 0..4): v5 collectibles + extended landmarks.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Matsu collectibles
  'black_bear', 'aged_wine_bowl', 'jiguang_bing', 'red_yeast_rice', 'kaoliang_bottle', 'blue_tears',
  'wind_lion', 'oyster_plate', 'fishing_boat', 'stone_house_model', 'military_helmet', 'cuttlefish',
  // indices 12..19 — codes 82..89: Matsu landmark ids
  NM_BLUE_TEARS_BEACH.id,   // 82 藍眼淚沙灘
  NM_IRON_FORT.id,          // 83 鐵堡
  NM_BAJIU_AOYA.id,         // 84 八角據點遺址
  NM_BEIHAI_TUNNEL.id,      // 85 北海坑道
  NM_TIANHOU_TEMPLE.id,     // 86 境天后宮
  NM_QINBI_VILLAGE.id,      // 87 芹壁聚落
  NM_DONGYIN_LIGHTHOUSE.id, // 88 東引燈塔
  NM_MATSU_GODDESS.id,      // 89 媽祖巨神像
  // indices 20..23 — codes 90..93: extended landmarks (placeholder)
  'ext_landmark_90', 'ext_landmark_91', 'ext_landmark_92', 'ext_landmark_93',
  // v5 codes 94..98 — 94 媽祖神像; 95..98 extended landmarks (placeholder)
  'mazu_statue', 'ext_landmark_95', 'ext_landmark_96', 'ext_landmark_97', 'ext_landmark_98',
];

// Collectible album id -> index in extraIds.
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // mazu_statue (v5 94)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'matsu',
  displayName: '連江馬祖',
  region: 'TW',
  locale, // zh-TW t()/fmt()
  tiers: TIERS, // Matsu tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Matsu archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE,
  extraIds,
  collectibleExtraIndex,
  cityMap, // Matsu city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Matsu landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4D415453, v5: 0x6D617473 }, // MATS / mats
  goalMonument, // 媽祖巨神像 goal monument
  narration,    // 月牙 zh-TW narration tables
  ending,       // Formosa-island reveal definition
  validate() {
    // Structural ladder invariants.
    validateTiersStructure();

    // Matsu LANDMARKS validation.
    validatePack(this);
    return true;
  },
};

/**
 * Pack-scoped code-map methods, built once by buildCodeMap and attached
 * to the pack object so consumers read them off `activePack`.
 */
const _codeMap = buildCodeMap(activePack);
/** @type {string[]} code -> archetype id. */
activePack.archetypeIdByCode = _codeMap.idByCode;
/** @type {Record<string, number>} archetype id -> code. */
activePack.codeByArchetypeId = _codeMap.codeById;
/** @type {string[]} code -> display name (Matsu zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
