/**
 * @file yilan/index.js — Yilan StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Yilan landmarks
 * (幾米廣場/蘇澳冷泉/頭城老街/宜蘭火車站/羅東林業文化園區/蘭陽博物館/傳藝中心/龜山島)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='yilan', displayName='宜蘭', region='TW',
 * locale=zh-TW. Seeds are Yilan-specific (YILA = 0x59494C41, v5 = 0x79696C61).
 *
 * Validation: routes through validatePack(pack) (R6). Yilan LANDMARKS carry
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

// P6b: Yilan landmarks at EXTRA codes 82..88.
import { NM_JIMMY_PLAZA } from './landmarks/jimmy_plaza.js';
import { NM_SUAO_COLD_SPRING } from './landmarks/suao_cold_spring.js';
import { NM_TOUCHENG_OLD_STREET } from './landmarks/toucheng_old_street.js';
import { NM_YILAN_STATION } from './landmarks/yilan_station.js';
import { NM_LUODONG_FORESTRY } from './landmarks/luodong_forestry.js';
import { NM_LANYANG_MUSEUM } from './landmarks/lanyang_museum.js';
import { NM_CHUANYI_CENTER } from './landmarks/chuanyi_center.js';

// P7: Yilan collectibles.
import { COL_SANXING_SCALLION } from './collectibles/sanxing_scallion.js';
import { COL_SCALLION_PANCAKE } from './collectibles/scallion_pancake.js';
import { COL_DUCK_JERKY } from './collectibles/duck_jerky.js';
import { COL_OX_TONGUE_BISCUIT } from './collectibles/ox_tongue_biscuit.js';
import { COL_CHERRY_DUCK } from './collectibles/cherry_duck.js';
import { COL_MOCHI } from './collectibles/mochi.js';
import { COL_BROWN_SUGAR_CAKE } from './collectibles/brown_sugar_cake.js';
import { COL_PEANUT_CANDY } from './collectibles/peanut_candy.js';
import { COL_YILAN_WINE } from './collectibles/yilan_wine.js';
import { COL_SUAO_FISH } from './collectibles/suao_fish.js';
import { COL_LUWEI_POT } from './collectibles/luwei_pot.js';
import { COL_JIMMY_RABBIT } from './collectibles/jimmy_rabbit.js';
import { COL_GUISHAN_TURTLE } from './collectibles/guishan_turtle.js';

/**
 * EXTRA id order for the Yilan pack.
 * Codes 70..81 (indices 0..11): Yilan collectible ids.
 * Codes 82..88 (indices 12..18): Yilan landmark ids (P6b).
 * Codes 89..93 (indices 19..23): placeholder ids.
 * Codes 94..98 (v5 indices 0..4): 94=龜山島龜, 95..98=placeholder.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Yilan collectibles (P7)
  COL_SANXING_SCALLION.id,  // 70
  COL_SCALLION_PANCAKE.id,  // 71
  COL_DUCK_JERKY.id,        // 72
  COL_OX_TONGUE_BISCUIT.id, // 73
  COL_CHERRY_DUCK.id,       // 74
  COL_MOCHI.id,             // 75
  COL_BROWN_SUGAR_CAKE.id,  // 76
  COL_PEANUT_CANDY.id,      // 77
  COL_YILAN_WINE.id,        // 78
  COL_SUAO_FISH.id,         // 79
  COL_LUWEI_POT.id,         // 80
  COL_JIMMY_RABBIT.id,      // 81
  // indices 12..18 — codes 82..88: Yilan landmark ids (P6b)
  NM_JIMMY_PLAZA.id,        // 82 幾米廣場
  NM_SUAO_COLD_SPRING.id,   // 83 蘇澳冷泉
  NM_TOUCHENG_OLD_STREET.id,// 84 頭城老街
  NM_YILAN_STATION.id,      // 85 宜蘭火車站
  NM_LUODONG_FORESTRY.id,   // 86 羅東林業文化園區
  NM_LANYANG_MUSEUM.id,     // 87 蘭陽博物館
  NM_CHUANYI_CENTER.id,     // 88 傳藝中心
  // indices 19..23 — codes 89..93: unused placeholder ids
  'extra_89', 'extra_90', 'extra_91', 'extra_92', 'extra_93',
  // v5 codes 94..98 — 94 龜山島龜; 95..98 placeholder
  COL_GUISHAN_TURTLE.id, 'extra_95', 'extra_96', 'extra_97', 'extra_98',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // 龜山島龜 (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'yilan',
  displayName: '宜蘭',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Yilan tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Yilan archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Yilan city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Yilan landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x59494C41, v5: 0x79696C61 }, // yilan
  goalMonument, // P6a: 龜山島 goal monument (buildGeometry/pos/winToast)
  narration,    // P7: 月牙 zh-TW narration tables
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Yilan LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 8-entry ladder
    // (7 curated + 龜山島 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Yilan zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
