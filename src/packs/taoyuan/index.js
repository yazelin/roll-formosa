/**
 * @file taoyuan/index.js — Taoyuan StagePack (P6b).
 *
 * Full content surface required by R16. Wires 8 curated Taoyuan core
 * landmarks (大溪橋/大溪老街/中壢車站/虎頭山/慈湖陵寢/永安漁港/
 * 桃園機場航廈/石門水庫) into the cityMap and catalog so they spawn in the world
 * and can be absorbed; the goal is 大溪老街牌樓.
 *
 * Pack identity overrides: id='taoyuan', displayName='桃園', region='TW',
 * locale=zh-TW. Seeds are Taoyuan-specific (TAOY = 0x54414F59,
 * v5 extension = 0x74616F79).
 *
 * Validation: routes through validatePack(pack) (R6). Taoyuan LANDMARKS carry
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

// Taoyuan replaces EXTRA codes 82..89 with the 8 core landmark ids.
// Collectible codes 70..81 (indices 0..11) and codes 90..93/95..98 carry the
// Taoyuan extended landmark ids.
import { NM_DAXI_BRIDGE } from './landmarks/daxi_bridge.js';
import { NM_DAXI_OLDSTREET } from './landmarks/daxi_oldstreet.js';
import { NM_ZHONGLI_STATION } from './landmarks/zhongli_station.js';
import { NM_HUTOUSHAN } from './landmarks/hutoushan.js';
import { NM_CIHU_MAUSOLEUM } from './landmarks/cihu_mausoleum.js';
import { NM_YONGAN_HARBOR } from './landmarks/yongan_harbor.js';
import { NM_TPE_TERMINAL } from './landmarks/tpe_terminal.js';
import { NM_SHIMEN_RESERVOIR } from './landmarks/shimen_reservoir.js';

/**
 * EXTRA id order for the Taoyuan pack.
 * Codes 70..81 (indices 0..11): Taoyuan collectible ids.
 * Codes 82..89 (indices 12..19): Taoyuan core landmark ids.
 * Codes 90..93 (indices 20..23): Taoyuan extended landmark ids.
 * Codes 94..98 (v5 indices 0..4): 媽祖 + 4 extended landmark ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Taoyuan collectibles
  'black_bear', 'boba', 'chicken_cutlet', 'gua_bao', 'longgang_ricenoodle', 'yueguang_bing',
  'santaizi', 'budaixi', 'daxi_top', 'shimen_fish', 'lalashan_peach', 'daxi_douhua',
  // indices 12..19 — codes 82..89: Taoyuan core landmark ids
  NM_DAXI_BRIDGE.id,        // 82 大溪橋
  NM_DAXI_OLDSTREET.id,     // 83 大溪老街
  NM_ZHONGLI_STATION.id,    // 84 中壢車站
  NM_HUTOUSHAN.id,          // 85 虎頭山
  NM_CIHU_MAUSOLEUM.id,     // 86 慈湖陵寢
  NM_YONGAN_HARBOR.id,      // 87 永安漁港
  NM_TPE_TERMINAL.id,       // 88 桃園機場航廈
  NM_SHIMEN_RESERVOIR.id,   // 89 石門水庫
  // indices 20..23 — codes 90..93: Taoyuan extended landmarks (placeholder)
  'longtan_pond', 'xiaowulai_waterfall', 'lala_mountain', 'daxi_pailou',
  // v5 codes 94..98 — 94 媽祖; 95..98 Taoyuan extended landmarks (placeholder)
  'mazu', 'guishan_island', 'xiao_wulai_sky_walk', 'farglory_ocean_park', 'beipu_old_street',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'taoyuan',
  displayName: '桃園',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Taoyuan tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Taoyuan archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Taoyuan city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Taoyuan landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x54414F59, v5: 0x74616F79 }, // TAOY / taoy
  goalMonument, // 大溪老街牌樓 goal monument (buildGeometry/pos/winToast)
  narration,    // 月牙 zh-TW narration tables (replaces config/donackLines.js)
  ending,       // Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Taoyuan LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 core + 大溪牌樓 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Taoyuan zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
