/**
 * @file taipei/index.js — Taipei StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Taipei landmarks
 * (北門/龍山寺/西門紅樓/圓山大飯店/總統府/中正紀念堂/自由廣場牌樓/小巨蛋)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='taipei', displayName='台北', region='TW',
 * locale=zh-TW. Seeds are Taipei-specific (T A I P E I = 0x54414950,
 * v5 extension = 0x56355441).
 *
 * Validation: routes through validatePack(pack) (R6). Taipei LANDMARKS carry
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

// Codes 82..89 (extraIds indices 12..19) carry keelung's own landmark ids, aligned
// with the catalog's 82..89 geometry (NM_MIAOKOU_GATE … NM_QINGAN_TEMPLE). Same order.
import { NM_MIAOKOU_GATE } from './landmarks/miaokou_gate.js';
import { NM_KEELUNG_STATION } from './landmarks/keelung_station.js';
import { NM_GUANYIN_STATUE } from './landmarks/guanyin_statue.js';
import { NM_OCEAN_PLAZA } from './landmarks/ocean_plaza.js';
import { NM_XIANDONYAN } from './landmarks/xiandonyan.js';
import { NM_HEPING_ISLAND } from './landmarks/heping_island.js';
import { NM_KEELUNG_ISLET } from './landmarks/keelung_islet.js';
import { NM_QINGAN_TEMPLE } from './landmarks/qingan_temple.js';

/**
 * EXTRA id order for the keelung pack.
 * Codes 70..81 (indices 0..11): frozen collectible ids.
 * Codes 82..89 (indices 12..19): keelung landmark ids.
 * Codes 90..93 (indices 20..23): frozen bridge/tower/shop/goal-tower ids.
 * Codes 94..98 (v5 indices 0..4): frozen v5 ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Taipei collectibles (P7)
  'black_bear', 'boba', 'shrimp_geng', 'mini_sausage', 'taro_ball', 'hongzao_meatball',
  'squid', 'crab', 'li_hu_cake', 'water_lantern', 'jiguela', 'paopao_ice',
  // indices 12..19 — codes 82..89: keelung landmark ids (aligned with catalog 82..89)
  NM_MIAOKOU_GATE.id,    // 82 廟口
  NM_KEELUNG_STATION.id, // 83 基隆車站
  NM_GUANYIN_STATUE.id,  // 84 中正公園觀音像
  NM_OCEAN_PLAZA.id,     // 85 海洋廣場
  NM_XIANDONYAN.id,      // 86 仙洞巖
  NM_HEPING_ISLAND.id,   // 87 和平島
  NM_KEELUNG_ISLET.id,   // 88 基隆嶼
  NM_QINGAN_TEMPLE.id,   // 89 慶安宮
  // indices 20..23 — codes 90..93: keelung extended landmarks (reuse own, _ext id)
  'miaokou_gate_ext90', 'keelung_station_ext91', 'guanyin_statue_ext92', 'ocean_plaza_ext93',
  // v5 codes 94..98 — 94 媽祖; 95..98 keelung extended landmarks
  'mazu', 'xiandonyan_ext95', 'heping_island_ext96', 'keelung_islet_ext97', 'qingan_temple_ext98',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'keelung',
  displayName: '基隆',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Taipei tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Taipei archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Taipei city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Taipei landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4B45454C, v5: 0x6B65656C }, // keelung (scaffold — change if it collides)
  goalMonument, // P6a: 台北101 goal monument (buildGeometry/pos/winToast)
  narration,    // P7: 月牙 zh-TW narration tables (replaces config/donackLines.js)
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Taipei LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 101 goal) must pass the strictly-increasing threshold
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
