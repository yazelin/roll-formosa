/**
 * @file penghu/index.js — Penghu StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Penghu landmarks
 * (雙心石滬/天后宮/中央老街/大菓葉玄武岩/漁翁島燈塔/二崁聚落/鯨魚洞/風櫃洞)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='penghu', displayName='澎湖', region='TW',
 * locale=zh-TW. Seeds are Penghu-specific (P E N G = 0x50454E47,
 * v5 extension = 0x70656E67).
 *
 * Validation: routes through validatePack(pack) (R6). Penghu LANDMARKS carry
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

// P6b: Penghu replaces EXTRA codes 82..89 (legacy landmark ids at indices 12..19)
// with Penghu landmark ids. Collectible codes 70..81 (indices 0..11) and codes
// 90..93 (indices 20..23) remain frozen placeholder ids.
import { NM_DOUBLE_HEART } from './landmarks/double_heart_weir.js';
import { NM_TIANHOU } from './landmarks/tianhou_temple.js';
import { NM_ZHONGYANG } from './landmarks/zhongyangstreet.js';
import { NM_DAGUOYE } from './landmarks/daguoye_basalt.js';
import { NM_XIYU_LIGHTHOUSE as NM_LIGHTHOUSE } from './landmarks/xiyu_lighthouse.js';
import { NM_ERKAN } from './landmarks/erkan_village.js';
import { NM_WHALE_CAVE as NM_WHALE } from './landmarks/whale_cave.js';
import { NM_FENGGUI } from './landmarks/fenggui_cave.js';

/**
 * EXTRA id order for the Penghu pack.
 * Codes 70..81 (indices 0..11): Penghu collectible ids.
 * Codes 82..89 (indices 12..19): Penghu landmark ids (P6b).
 * Codes 90..93 (indices 20..23): frozen bridge/tower/shop/goal-tower ids.
 * Codes 94..98 (v5 indices 0..4): frozen v5 ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Penghu collectibles (P7)
  'black_bear', 'cactus_ice', 'brown_sugar_cake', 'dried_squid', 'sea_urchin', 'windlion',
  'coral_stone', 'peanut_candy', 'fishing_boat_model', 'aloe_product', 'basalt_souvenir', 'seashell_collection',
  // indices 12..19 — codes 82..89: Penghu landmark ids (P6b)
  NM_DOUBLE_HEART.id,  // 82 雙心石滬
  NM_TIANHOU.id,       // 83 天后宮
  NM_ZHONGYANG.id,     // 84 中央老街
  NM_DAGUOYE.id,       // 85 大菓葉玄武岩
  NM_LIGHTHOUSE.id,    // 86 漁翁島燈塔
  NM_ERKAN.id,         // 87 二崁聚落
  NM_WHALE.id,         // 88 鯨魚洞
  NM_FENGGUI.id,       // 89 風櫃洞
  // indices 20..23 — codes 90..93: Penghu extended landmarks (de-Tokyo)
  'double_heart_weir_xl', 'tianhou_temple_xl', 'zhongyang_street_xl', 'cross_sea_bridge',
  // v5 codes 94..98 — 94 媽祖; 95..98 Penghu extended landmarks (de-Tokyo)
  'mazu', 'daguoye_basalt_ext', 'xiyu_lighthouse_ext', 'erkan_village_ext', 'whale_cave_ext',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // mazu (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'penghu',
  displayName: '澎湖',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Penghu tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Penghu archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Penghu city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Penghu landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x50454E47, v5: 0x70656E67 }, // penghu (scaffold — change if it collides)
  goalMonument, // P6a: 跨海大橋 goal monument (buildGeometry/pos/winToast)
  narration,    // P7: 月牙 zh-TW narration tables (replaces config/donackLines.js)
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Penghu LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 跨海大橋 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Penghu zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
