/**
 * @file taitung/index.js — Taitung StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Taitung landmarks
 * (鐵花村/台東火車站/池上飯包/金城武樹/都蘭糖廠/鹿野高台/阿美族民俗中心/知本溫泉)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='taitung', displayName='台東', region='TW',
 * locale=zh-TW. Seeds are Taitung-specific.
 *
 * Validation: routes through validatePack(pack) (R6). Taitung LANDMARKS carry
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

// P6b: Taitung replaces EXTRA codes 82..89 (legacy landmark ids at indices 12..19)
// with Taitung landmark ids. Collectible codes 70..81 (indices 0..11) and codes
// 90..93 (indices 20..23) remain frozen placeholder ids.
import { NM_TIEHUA } from './landmarks/tiehua_village.js';
import { NM_TAITUNG_STATION } from './landmarks/taitung_station.js';
import { NM_CHISHANG } from './landmarks/chishang_rice.js';
import { NM_TAKESHI_TREE } from './landmarks/takeshi_tree.js';
import { NM_DULAN } from './landmarks/dulan_sugar.js';
import { NM_LUYE_BALLOON } from './landmarks/luye_balloon.js';
import { NM_AMIS } from './landmarks/amis_cultural.js';
import { NM_JHIHBEN } from './landmarks/jhihben_hot_spring.js';

/**
 * EXTRA id order for the Taitung pack.
 * Codes 70..81 (indices 0..11): Taitung collectible ids.
 * Codes 82..89 (indices 12..19): Taitung landmark ids (P6b).
 * Codes 90..93 (indices 20..23): Taitung extended landmark ids.
 * Codes 94..98 (v5 indices 0..4): Taitung v5 ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Taitung collectibles (P7)
  // Note: 'col_' prefix distinguishes collectibles from chunk archetypes with same name
  'col_sugar_apple', 'flying_fish', 'millet_wine', 'col_tribal_beads', 'col_hot_air_balloon', 'rice_bento',
  'tao_boat', 'col_makao_sausage', 'boar_meat', 'paiwan_pot', 'surfboard', 'black_bear',
  // indices 12..19 — codes 82..89: Taitung landmark ids (P6b)
  NM_TIEHUA.id,         // 82 鐵花村
  NM_TAITUNG_STATION.id, // 83 台東火車站
  NM_CHISHANG.id,       // 84 池上飯包文化故事館
  NM_TAKESHI_TREE.id,   // 85 金城武樹
  NM_DULAN.id,          // 86 都蘭糖廠
  NM_LUYE_BALLOON.id,   // 87 鹿野高台熱氣球
  NM_AMIS.id,           // 88 阿美族民俗中心
  NM_JHIHBEN.id,        // 89 知本溫泉
  // indices 20..23 — codes 90..93: Taitung extended landmarks (display-only)
  'tiehua_village_ext90', 'taitung_station_ext91', 'chishang_rice_ext92', 'sanxiantai_bridge_ext93',
  // v5 codes 94..98 — 94 媽祖; 95..98 Taitung extended landmarks (display-only)
  'mazu', 'takeshi_tree_ext95', 'dulan_sugar_ext96', 'luye_balloon_ext97', 'amis_cultural_ext98',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // mazu (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'taitung',
  displayName: '台東',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Taitung tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Taitung archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Taitung city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Taitung landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x54414954, v5: 0x74616974 }, // taitung
  goalMonument, // P6a: 三仙台八拱橋 goal monument (buildGeometry/pos/winToast)
  narration,    // P7: 月牙 zh-TW narration tables (replaces config/donackLines.js)
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Taitung LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + Sanxiantai goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Taitung zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
