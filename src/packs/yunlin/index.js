/**
 * @file yunlin/index.js — Yunlin StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Yunlin landmarks
 * (北港朝天宮/西螺老街/虎尾布袋戲館/古坑咖啡園/斗六圓環/劍湖山世界/
 * 斗南火車站/雲林布袋戲偶文物館) into the cityMap and catalog so they spawn
 * in the world and can be absorbed.
 *
 * Pack identity overrides: id='yunlin', displayName='雲林', region='TW',
 * locale=zh-TW. Seeds are Yunlin-specific.
 *
 * Validation: routes through validatePack(pack) (R6). Yunlin LANDMARKS carry
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

// P6b: Yunlin replaces EXTRA codes 82..89 (legacy landmark ids at indices 12..19)
// with Yunlin landmark ids. Collectible codes 70..81 (indices 0..11) and codes
// 90..93 (indices 20..23) remain frozen placeholder ids.
import { NM_BEIGANG_CHAOTIAN } from './landmarks/beigang_chaotian.js';
import { NM_XILUO_OLDSTREET } from './landmarks/xiluo_oldstreet.js';
import { NM_HUWEI_PUPPET_MUSEUM } from './landmarks/huwei_puppet_museum.js';
import { NM_GUKENG_COFFEE } from './landmarks/gukeng_coffee.js';
import { NM_DOULIU_ROUNDABOUT } from './landmarks/douliu_roundabout.js';
import { NM_JANFUSUN_FANCYWORLD } from './landmarks/janfusun_fancyworld.js';
import { NM_DOUNAN_STATION } from './landmarks/dounan_station.js';
import { NM_YUNLIN_PUPPET_CENTER } from './landmarks/yunlin_puppet_center.js';

/**
 * EXTRA id order for the Yunlin pack.
 * Codes 70..81 (indices 0..11): frozen collectible ids.
 * Codes 82..89 (indices 12..19): Yunlin landmark ids (P6b).
 * Codes 90..93 (indices 20..23): frozen placeholder ids (unused in Yunlin).
 * Codes 94..98 (v5 indices 0..4): frozen v5 ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Yunlin collectibles (P7)
  'black_bear', 'soy_sauce', 'peanut', 'mullet_roe', 'coffee_cup', 'rice_bowl',
  'santaizi', 'budaixi', 'straw_hat', 'taro', 'watermelon', 'sugarcane',
  // indices 12..19 — codes 82..89: Yunlin landmark ids (P6b)
  NM_BEIGANG_CHAOTIAN.id,    // 82 北港朝天宮
  NM_XILUO_OLDSTREET.id,     // 83 西螺老街
  NM_HUWEI_PUPPET_MUSEUM.id, // 84 虎尾布袋戲館
  NM_GUKENG_COFFEE.id,       // 85 古坑咖啡園
  NM_DOULIU_ROUNDABOUT.id,   // 86 斗六圓環
  NM_JANFUSUN_FANCYWORLD.id, // 87 劍湖山世界
  NM_DOUNAN_STATION.id,      // 88 斗南火車站
  NM_YUNLIN_PUPPET_CENTER.id,// 89 雲林布袋戲偶文物館
  // indices 20..23 — codes 90..93: Yunlin extended landmarks (reuse goal monument)
  'xiluo_bridge_90', 'xiluo_bridge_91', 'xiluo_bridge_92', 'xiluo_bridge_93',
  // v5 codes 94..98 — 94 媽祖; 95..98 Yunlin extended landmarks
  'mazu',
  'xiluo_bridge_95', 'xiluo_bridge_96', 'xiluo_bridge_97', 'xiluo_bridge_98',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'yunlin',
  displayName: '雲林',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Yunlin tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Yunlin archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Yunlin city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Yunlin landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x59554E4C, v5: 0x79756E6C }, // yunlin (scaffold — change if it collides)
  goalMonument, // P6a: goal monument (buildGeometry/pos/winToast)
  narration,    // P7: zh-TW narration tables (replaces config/donackLines.js)
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Yunlin LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Yunlin zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
