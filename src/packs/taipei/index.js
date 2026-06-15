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
import { NM_BEIMEN } from './landmarks/beimen.js';
import { NM_LONGSHAN } from './landmarks/longshan.js';
import { NM_XIMEN } from './landmarks/ximen.js';
import { NM_GRAND_HOTEL } from './landmarks/grand_hotel.js';
import { NM_PRESIDENTIAL } from './landmarks/presidential.js';
import { NM_CKS } from './landmarks/cks_memorial.js';
import { NM_LIBERTY_ARCH } from './landmarks/liberty_arch.js';
import { NM_ARENA } from './landmarks/arena.js';

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
  // indices 12..19 — codes 82..89: Taipei landmark ids (P6b)
  NM_BEIMEN.id,        // 82 北門(承恩門)
  NM_LONGSHAN.id,      // 83 龍山寺
  NM_XIMEN.id,         // 84 西門紅樓
  NM_GRAND_HOTEL.id,   // 85 圓山大飯店
  NM_PRESIDENTIAL.id,  // 86 總統府
  NM_CKS.id,           // 87 中正紀念堂
  NM_LIBERTY_ARCH.id,  // 88 自由廣場牌樓
  NM_ARENA.id,         // 89 小巨蛋
  // indices 20..23 — codes 90..93: Taipei extended landmarks (de-Tokyo)
  'rainbow_bridge_tp', 'sun_yat_sen_hall', 'taipei_main_station', 'palace_museum',
  // v5 codes 94..98 — 94 媽祖; 95..98 Taipei extended landmarks (de-Tokyo)
  'mazu', 'xingtian_temple', 'national_theater', 'miramar_wheel', 'maokong_station',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'taipei',
  displayName: '台北',
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
  seeds: { primary: 0x54414950, v5: 0x56355441 }, // TAIP / V5TA
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
