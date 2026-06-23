/**
 * @file newtaipei/index.js — New Taipei StagePack.
 *
 * Full content surface required by R16. Wires 8 curated New Taipei landmarks
 * (九份老街茶樓/十分天燈廣場/鶯歌陶瓷博物館/三峽祖師廟/紅毛城/平溪車站/林本源園邸/新北市政府)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='newtaipei', displayName='新北', region='TW',
 * locale=zh-TW. Seeds are New Taipei-specific.
 *
 * Validation: routes through validatePack(pack) (R6). New Taipei LANDMARKS carry
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
import { EXTRA_ARCHETYPE_IDS } from '../../world/objects.js';
import * as cityMap from './cityMap.js';
import { ABSORB_RATIO, MAP_BOUNDS } from '../../config/tuning.js';
import { buildCodeMap, validatePack } from '../_engine/codeMap.js';
import { locale } from './locale.js';
import { goalMonument } from './monument.js';
import * as narration from './narration.js';
import { ending } from './ending.js';

// New Taipei landmark imports (codes 82..89)
import { NM_JIUFEN_TEAHOUSE } from './landmarks/jiufen_teahouse.js';
import { NM_SHIFEN_LANTERN } from './landmarks/shifen_lantern.js';
import { NM_YINGGE_MUSEUM } from './landmarks/yingge_museum.js';
import { NM_SANXIA_TEMPLE } from './landmarks/sanxia_temple.js';
import { NM_FORT_SAN_DOMINGO } from './landmarks/fort_san_domingo.js';
import { NM_PINGXI_STATION } from './landmarks/pingxi_station.js';
import { NM_LIN_FAMILY_GARDEN } from './landmarks/lin_family_garden.js';
import { NM_NEWTAIPEI_CITYHALL } from './landmarks/newtaipei_cityhall.js';

// New Taipei collectible imports (codes 70..81 + 94)
import { COL_AGEI } from './collectibles/agei.js';
import { COL_IRON_EGG } from './collectibles/iron_egg.js';
import { COL_TARO_BALL } from './collectibles/taro_ball.js';
import { COL_FISHBALL } from './collectibles/fishball.js';
import { COL_SKY_LANTERN } from './collectibles/sky_lantern.js';
import { COL_YINGGE_VASE } from './collectibles/yingge_vase.js';
import { COL_TEAPOT } from './collectibles/teapot.js';
import { COL_MINER_LAMP } from './collectibles/miner_lamp.js';
import { COL_SOUR_PLUM_DRINK } from './collectibles/sour_plum_drink.js';
import { COL_CERAMIC_BOWL } from './collectibles/ceramic_bowl.js';
import { COL_PINGXI_TRAIN } from './collectibles/pingxi_train.js';
import { COL_BROWN_SUGAR_CAKE } from './collectibles/brown_sugar_cake.js';
import { COL_MAZU } from '../taipei/collectibles/mazu.js'; // shared from Taipei

/**
 * EXTRA id order for the New Taipei pack.
 * Codes 70..81 (indices 0..11): New Taipei collectible ids.
 * Codes 82..89 (indices 12..19): New Taipei landmark ids.
 * Codes 90..93 (indices 20..23): placeholder ids.
 * Codes 94..98 (v5 indices 0..4): v5 ids (94 = 媽祖, 95-98 placeholders).
 */
const extraIds = [
  // indices 0..11 — codes 70..81: New Taipei collectibles
  COL_AGEI.id,              // 70 阿給
  COL_IRON_EGG.id,          // 71 鐵蛋
  COL_TARO_BALL.id,         // 72 芋圓
  COL_FISHBALL.id,          // 73 魚丸
  COL_SKY_LANTERN.id,       // 74 天燈
  COL_YINGGE_VASE.id,       // 75 鶯歌花瓶
  COL_TEAPOT.id,            // 76 茶壺
  COL_MINER_LAMP.id,        // 77 礦工燈
  COL_SOUR_PLUM_DRINK.id,   // 78 酸梅湯
  COL_CERAMIC_BOWL.id,      // 79 陶碗
  COL_PINGXI_TRAIN.id,      // 80 平溪小火車
  COL_BROWN_SUGAR_CAKE.id,  // 81 黑糖糕
  // indices 12..19 — codes 82..89: New Taipei landmark ids
  NM_JIUFEN_TEAHOUSE.id,    // 82 九份老街茶樓
  NM_SHIFEN_LANTERN.id,     // 83 十分天燈廣場
  NM_YINGGE_MUSEUM.id,      // 84 鶯歌陶瓷博物館
  NM_SANXIA_TEMPLE.id,      // 85 三峽祖師廟
  NM_FORT_SAN_DOMINGO.id,   // 86 紅毛城
  NM_PINGXI_STATION.id,     // 87 平溪車站
  NM_LIN_FAMILY_GARDEN.id,  // 88 林本源園邸
  NM_NEWTAIPEI_CITYHALL.id, // 89 新北市政府
  // indices 20..23 — codes 90..93: placeholders (90-92) + goal display slot (93)
  'extra_placeholder_90', 'extra_placeholder_91', 'extra_placeholder_92', 'lover_bridge',
  // v5 codes 94..98 — 94 媽祖; 95..98 placeholders
  COL_MAZU.id, 'extra_placeholder_95', 'extra_placeholder_96', 'extra_placeholder_97', 'extra_placeholder_98',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // 媽祖 at v5 index 0 = code 94

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'newtaipei',
  displayName: '新北',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // New Taipei tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // New Taipei archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // New Taipei city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // New Taipei landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4E455754, v5: 0x6E657774 }, // "NEWT", "newt"
  goalMonument, // 淡水漁人碼頭情人橋 goal monument
  narration,    // 月牙 zh-TW narration tables
  ending,       // Formosa-island reveal definition
  validate() {
    // Structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // New Taipei LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 情人橋 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (New Taipei zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
