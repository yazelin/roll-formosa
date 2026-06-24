/**
 * @file penghu/index.js — Penghu StagePack.
 *
 * Full content surface required by R16. Wires 8 curated Penghu landmarks
 * (雙心石滬/天后宮/大菓葉玄武岩/鯨魚洞/西嶼燈塔/中央老街/觀音亭/澎湖機場)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='penghu', displayName='澎湖', region='TW',
 * locale=zh-TW. Seeds are Penghu-specific (PENG = 0x50454E47,
 * v5 extension = 0x70656E67).
 *
 * Validation: routes through validatePack(pack) (R6). Penghu LANDMARKS carry
 * native `name` and `isGoal` fields.
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

// Penghu replaces EXTRA codes 82..89 with Penghu landmark ids.
import { NM_BEIMEN } from './landmarks/beimen.js';
import { NM_LONGSHAN } from './landmarks/longshan.js';
import { NM_XIMEN } from './landmarks/ximen.js';
import { NM_GRAND_HOTEL } from './landmarks/grand_hotel.js';
import { NM_PRESIDENTIAL } from './landmarks/presidential.js';
import { NM_CKS } from './landmarks/cks_memorial.js';
import { NM_LIBERTY_ARCH } from './landmarks/liberty_arch.js';
import { NM_ARENA } from './landmarks/arena.js';

/**
 * EXTRA id order for the Penghu pack.
 * Codes 70..81 (indices 0..11): Penghu collectible ids.
 * Codes 82..89 (indices 12..19): Penghu landmark ids.
 * Codes 90..93 (indices 20..23): Penghu extended landmark ids.
 * Codes 94..98 (v5 indices 0..4): 媽祖 + Penghu extended landmarks.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Penghu collectibles
  'black_bear', 'cactus_ice', 'brown_sugar_cake_col', 'seafood_noodles', 'dried_squid_col', 'peanut_candy_col',
  'wind_lion_col', 'fishing_boat_col', 'sea_urchin', 'coral', 'stone_house_col', 'oyster',
  // indices 12..19 — codes 82..89: Penghu landmark ids
  NM_BEIMEN.id,        // 82 雙心石滬
  NM_LONGSHAN.id,      // 83 天后宮
  NM_XIMEN.id,         // 84 大菓葉玄武岩
  NM_GRAND_HOTEL.id,   // 85 鯨魚洞
  NM_PRESIDENTIAL.id,  // 86 西嶼燈塔
  NM_CKS.id,           // 87 中央老街
  NM_LIBERTY_ARCH.id,  // 88 觀音亭
  NM_ARENA.id,         // 89 澎湖機場
  // indices 20..23 — codes 90..93: Penghu extended landmarks (reuse landmarks with _ext suffix)
  'double_heart_ext', 'tianhou_temple_ext', 'basalt_pillars_ext', 'cross_sea_bridge_display',
  // v5 codes 94..98 — 94 媽祖; 95..98 Penghu extended landmarks
  'mazu', 'whale_cave_ext', 'siyu_lighthouse_ext', 'guanyinting_ext', 'airport_ext',
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
  displayNameByCode: DISPLAY_NAME_BY_CODE, // zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Penghu city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Penghu landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x50454E47, v5: 0x70656E67 }, // penghu
  goalMonument, // 跨海大橋 goal monument (buildGeometry/pos/winToast)
  narration,    // 月牙 zh-TW narration tables
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // Structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Penghu LANDMARKS carry native name/isGoal — run the real
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
