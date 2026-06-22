/**
 * @file chiayi/index.js — Chiayi StagePack.
 *
 * Full content surface required by R16. Wires 8 curated Chiayi landmarks
 * (阿里山神木/檜意森活村/嘉義車站/中央噴水池/文化路夜市/嘉義公園/阿里山小火車/北港朝天宮)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='chiayi', displayName='嘉義', region='TW',
 * locale=zh-TW. Seeds are Chiayi-specific.
 *
 * Validation: routes through validatePack(pack) (R6). Chiayi LANDMARKS carry
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

// Chiayi replaces EXTRA codes 82..89 (landmark ids at indices 12..19)
// with Chiayi landmark ids. Collectible codes 70..81+94 use Chiayi collectibles.
import { NM_SACRED_TREE } from './landmarks/sacred_tree.js';
import { NM_HINOKI_VILLAGE } from './landmarks/hinoki_village.js';
import { NM_CHIAYI_STATION } from './landmarks/chiayi_station.js';
import { NM_CENTRAL_FOUNTAIN } from './landmarks/central_fountain.js';
import { NM_WENHUA_NIGHT_MARKET } from './landmarks/wenhua_night_market.js';
import { NM_CHIAYI_PARK } from './landmarks/chiayi_park.js';
import { NM_ALISHAN_TRAIN } from './landmarks/alishan_train.js';
import { NM_BEIGANG_CHAOTIAN } from './landmarks/beigang_chaotian.js';
import { NM_SUN_SHOOTING_TOWER } from './landmarks/sun_shooting_tower.js';

/**
 * EXTRA id order for the Chiayi pack.
 * Codes 70..81 (indices 0..11): Chiayi collectible ids.
 * Codes 82..89 (indices 12..19): Chiayi landmark ids.
 * Codes 90..93 (indices 20..23): Chiayi extended landmark ids.
 * Codes 94..98 (v5 indices 0..4): Chiayi v5 ids (94 = mazu).
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Chiayi collectibles
  'black_bear', 'turkey_rice', 'fangkuaisu', 'hinoki_bento', 'alishan_tea', 'mochi',
  'santaizi', 'budaixi', 'forest_train', 'egg_pancake', 'milkfish', 'stone_monkey',
  // indices 12..19 — codes 82..89: Chiayi landmark ids
  NM_SACRED_TREE.id,        // 82 阿里山神木
  NM_HINOKI_VILLAGE.id,     // 83 檜意森活村
  NM_CHIAYI_STATION.id,     // 84 嘉義車站
  NM_CENTRAL_FOUNTAIN.id,   // 85 中央噴水池
  NM_WENHUA_NIGHT_MARKET.id,// 86 文化路夜市
  NM_CHIAYI_PARK.id,        // 87 嘉義公園
  NM_ALISHAN_TRAIN.id,      // 88 阿里山小火車
  NM_BEIGANG_CHAOTIAN.id,   // 89 北港朝天宮
  // indices 20..23 — codes 90..93: Chiayi extended landmarks (placeholder with goal)
  `${NM_SUN_SHOOTING_TOWER.id}_90`, `${NM_SUN_SHOOTING_TOWER.id}_91`,
  `${NM_SUN_SHOOTING_TOWER.id}_92`, `${NM_SUN_SHOOTING_TOWER.id}_93`,
  // v5 codes 94..98 — 94 媽祖; 95..98 Chiayi extended landmarks
  'mazu',
  `${NM_SUN_SHOOTING_TOWER.id}_95`, `${NM_SUN_SHOOTING_TOWER.id}_96`,
  `${NM_SUN_SHOOTING_TOWER.id}_97`, `${NM_SUN_SHOOTING_TOWER.id}_98`,
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // mazu (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'chiayi',
  displayName: '嘉義',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Chiayi tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Chiayi archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // Chiayi zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Chiayi city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Chiayi landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x43484941, v5: 0x63686961 }, // CHIA / chia in ASCII
  goalMonument, // 射日塔 goal monument (buildGeometry/pos/winToast)
  narration,    // 月牙 zh-TW narration tables
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Chiayi LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 射日塔 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Chiayi zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
