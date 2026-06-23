/**
 * @file hsinchu/index.js — Hsinchu StagePack.
 *
 * Full content surface required by R16. Wires 8 curated Hsinchu landmarks
 * (新竹火車站/東門城/玻璃博物館/動物園/清華大學/科學園區/十七公里海岸風車/青草湖大佛)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='hsinchu', displayName='新竹', region='TW',
 * locale=zh-TW. Seeds are Hsinchu-specific (H S I N = 0x4853494E,
 * v5 extension = 0x6873696E).
 *
 * Validation: routes through validatePack(pack) (R6). Hsinchu LANDMARKS carry
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

// Hsinchu replaces EXTRA codes 82..89 with the 8 core landmark ids.
// Collectible codes 70..81 (indices 0..11) and codes 90..93/95..98 carry the
// Hsinchu extended landmark ids.
import { NM_HSINCHU_STATION } from './landmarks/hsinchu_station.js';
import { NM_DONGMEN } from './landmarks/dongmen.js';
import { NM_GLASS_MUSEUM } from './landmarks/glass_museum.js';
import { NM_HSINCHU_ZOO } from './landmarks/hsinchu_zoo.js';
import { NM_TSING_HUA } from './landmarks/tsing_hua.js';
import { NM_SCIENCE_PARK } from './landmarks/science_park.js';
import { NM_SEVENTEEN_KM } from './landmarks/seventeen_km.js';
import { NM_BIG_BUDDHA } from './landmarks/big_buddha.js';

/**
 * EXTRA id order for the Hsinchu pack.
 * Codes 70..81 (indices 0..11): Hsinchu collectible ids.
 * Codes 82..89 (indices 12..19): Hsinchu core landmark ids.
 * Codes 90..93 (indices 20..23): Hsinchu extended landmark ids.
 * Codes 94..98 (v5 indices 0..4): 媽祖 + 4 extended landmark ids.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Hsinchu collectibles
  'hsinchu_meatball', 'hsinchu_rice_noodle', 'wind_persimmon', 'glass_art', 'tech_chip', 'wind_lion',
  'steam_train_model', 'duck_rice_bowl', 'black_bear', 'scallion_pancake', 'bamboo_chopsticks', 'hakka_lei_cha',
  // indices 12..19 — codes 82..89: Hsinchu core landmark ids
  NM_HSINCHU_STATION.id,  // 82 新竹火車站
  NM_DONGMEN.id,          // 83 東門城
  NM_GLASS_MUSEUM.id,     // 84 玻璃工藝博物館
  NM_HSINCHU_ZOO.id,      // 85 新竹動物園
  NM_TSING_HUA.id,        // 86 清華大學大門
  NM_SCIENCE_PARK.id,     // 87 科學園區探索館
  NM_SEVENTEEN_KM.id,     // 88 十七公里海岸風車
  NM_BIG_BUDDHA.id,       // 89 青草湖大佛
  // indices 20..23 — codes 90..93: Hsinchu extended landmark ids
  `${NM_HSINCHU_STATION.id}_ext`, `${NM_DONGMEN.id}_ext`, `${NM_GLASS_MUSEUM.id}_ext`, `${NM_HSINCHU_ZOO.id}_ext`,
  // v5 codes 94..98 — 94 媽祖; 95..98 Hsinchu extended landmarks
  'mazu', `${NM_TSING_HUA.id}_ext`, `${NM_SCIENCE_PARK.id}_ext`, `${NM_SEVENTEEN_KM.id}_ext`, `${NM_BIG_BUDDHA.id}_ext`,
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'hsinchu',
  displayName: '新竹',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Hsinchu tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Hsinchu archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Hsinchu city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Hsinchu landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4853494E, v5: 0x6873696E }, // hsinchu (scaffold — change if it collides)
  goalMonument, // P6a: 新竹城隍廟 goal monument (buildGeometry/pos/winToast)
  narration,    // P7: 月牙 zh-TW narration tables (replaces config/donackLines.js)
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Hsinchu LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 城隍廟 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Hsinchu zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
