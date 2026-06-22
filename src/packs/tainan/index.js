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

// P6b: Taipei replaces EXTRA codes 82..89 (legacy landmark ids at indices 12..19)
// with Taipei landmark ids. Collectible codes 70..81 (indices 0..11) and codes
// 90..93 (indices 20..23) remain frozen placeholder ids.
import { NM_SWORD_LION } from './landmarks/anping_sword_lion.js';
import { NM_CHIHKAN } from './landmarks/chihkan_tower.js';
import { NM_CONFUCIUS } from './landmarks/tainan_confucius.js';
import { NM_WU_TEMPLE } from './landmarks/wu_temple.js';
import { NM_ANPING_FORT } from './landmarks/anping_fort.js';
import { NM_GOLDEN_CASTLE } from './landmarks/golden_castle.js';
import { NM_LIT_MUSEUM } from './landmarks/literature_museum.js';
import { NM_CHIMEI } from './landmarks/chimei_museum.js';

/**
 * EXTRA id order for the Taipei pack.
 * Codes 70..81 (indices 0..11): frozen collectible ids.
 * Codes 82..89 (indices 12..19): Taipei landmark ids (P6b).
 * Codes 90..93 (indices 20..23): frozen bridge/tower/shop/goal-tower ids.
 * Codes 94..98 (v5 indices 0..4): frozen v5 ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Taipei collectibles (P7)
  'black_bear', 'boba', 'chicken_cutlet', 'gua_bao', 'xiaolongbao', 'pineapple_cake',
  'santaizi', 'budaixi', 'youbike', 'presidential_trophy', 'maokong_gondola', 'shilin_big_chicken',
  // indices 12..19 — codes 82..89: Tainan landmark ids
  NM_SWORD_LION.id,    // 82 安平劍獅
  NM_CHIHKAN.id,       // 83 赤崁樓
  NM_CONFUCIUS.id,     // 84 臺南孔廟
  NM_WU_TEMPLE.id,     // 85 祀典武廟
  NM_ANPING_FORT.id,   // 86 安平古堡
  NM_GOLDEN_CASTLE.id, // 87 億載金城
  NM_LIT_MUSEUM.id,    // 88 臺灣文學館
  NM_CHIMEI.id,        // 89 奇美博物館
  // indices 20..23 — codes 90..93: Tainan extended landmarks
  'anping_treehouse', 'shennong_street_lm', 'tainan_station', 'qigu_salt_mountain',
  // v5 codes 94..98 — 94 媽祖; 95..98 Tainan extended landmarks
  'mazu', 'koxinga_shrine', 'hele_plaza', 'anping_lighthouse_landmark', 'kaiyuan_temple',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'tainan',
  displayName: '台南',
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
  seeds: { primary: 0x5441494E, v5: 0x7461696E }, // tainan (scaffold — change if it collides)
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
