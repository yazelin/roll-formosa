/**
 * @file hualien/index.js — Hualien StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Hualien landmarks
 * (慶修院/松園別館/七星潭風景區/遠雄海洋公園/花蓮文創園區/東大門夜市/鯉魚潭/燕子口)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='hualien', displayName='花蓮', region='TW',
 * locale=zh-TW. Seeds are Hualien-specific (H U A L = 0x4855414C,
 * v5 extension = 0x6875616C).
 *
 * Validation: routes through validatePack(pack) (R6). Hualien LANDMARKS carry
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

// P6b: Hualien replaces EXTRA codes 82..89 (legacy landmark ids at indices 12..19)
// with Hualien landmark ids. Collectible codes 70..81 (indices 0..11) and code 94
// are Hualien collectibles; codes 90..93 + 95..98 are extended landmarks.
import { NM_QINGXIU } from './landmarks/qingxiu_temple.js';
import { NM_PINE_GARDEN } from './landmarks/pine_garden.js';
import { NM_QIXINGTAN } from './landmarks/qixingtan_park.js';
import { NM_FARGLORY } from './landmarks/farglory_ocean.js';
import { NM_CULTURAL_PARK } from './landmarks/cultural_park.js';
import { NM_DONGDAMEN } from './landmarks/dongdamen_arch.js';
import { NM_LIYU } from './landmarks/liyu_lake.js';
import { NM_SWALLOW } from './landmarks/swallow_grotto.js';

// 13 Hualien collectible ids (codes 70..81 + 94)
import { COL_BLACK_BEAR } from './collectibles/black_bear.js';
import { COL_MOCHI } from './collectibles/mochi.js';
import { COL_WONTON } from './collectibles/wonton.js';
import { COL_MARBLE_CRAFT } from './collectibles/marble_craft.js';
import { COL_QIXINGTAN_STONE } from './collectibles/qixingtan_stone.js';
import { COL_ABORIGINAL_WEAVE } from './collectibles/aboriginal_weave.js';
import { COL_GONGZHENG_BAOZI } from './collectibles/gongzheng_baozi.js';
import { COL_PEELED_CHILI } from './collectibles/peeled_chili.js';
import { COL_DAYLILY } from './collectibles/daylily.js';
import { COL_FLYING_FISH } from './collectibles/flying_fish.js';
import { COL_ABORIGINAL_PLATE } from './collectibles/aboriginal_plate.js';
import { COL_CRESCENT } from './collectibles/crescent_sculpture.js';
import { COL_MAZU } from './collectibles/mazu.js';

/**
 * EXTRA id order for the Hualien pack.
 * Codes 70..81 (indices 0..11): Hualien collectible ids.
 * Codes 82..89 (indices 12..19): Hualien landmark ids (P6b).
 * Codes 90..93 (indices 20..23): extended landmarks (placeholder).
 * Codes 94..98 (v5 indices 0..4): 媽祖 + extended landmarks.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Hualien collectibles
  COL_BLACK_BEAR.id,     // 70 台灣黑熊
  COL_MOCHI.id,          // 71 花蓮麻糬
  COL_WONTON.id,         // 72 花蓮扁食
  COL_MARBLE_CRAFT.id,   // 73 大理石藝品
  COL_QIXINGTAN_STONE.id,// 74 七星潭石
  COL_ABORIGINAL_WEAVE.id,// 75 原住民編織
  COL_GONGZHENG_BAOZI.id,// 76 公正包子
  COL_PEELED_CHILI.id,   // 77 剝皮辣椒
  COL_DAYLILY.id,        // 78 金針花
  COL_FLYING_FISH.id,    // 79 飛魚
  COL_ABORIGINAL_PLATE.id,// 80 船型木盤
  COL_CRESCENT.id,       // 81 月牙彎
  // indices 12..19 — codes 82..89: Hualien landmark ids (P6b)
  NM_QINGXIU.id,         // 82 慶修院
  NM_PINE_GARDEN.id,     // 83 松園別館
  NM_CULTURAL_PARK.id,   // 84 花蓮文創園區
  NM_DONGDAMEN.id,       // 85 東大門夜市
  NM_LIYU.id,            // 86 鯉魚潭
  NM_SWALLOW.id,         // 87 燕子口
  NM_QIXINGTAN.id,       // 88 七星潭風景區
  NM_FARGLORY.id,        // 89 遠雄海洋公園
  // indices 20..23 — codes 90..93: extended landmarks (placeholder — reuse)
  `${NM_QINGXIU.id}_xl`,
  `${NM_PINE_GARDEN.id}_xl`,
  `${NM_CULTURAL_PARK.id}_xl`,
  `${NM_DONGDAMEN.id}_xl`,
  // v5 codes 94..98 — 94 媽祖; 95..98 extended landmarks (placeholder)
  COL_MAZU.id,           // 94 媽祖
  `${NM_LIYU.id}_xl`,
  `${NM_SWALLOW.id}_xl`,
  `${NM_QIXINGTAN.id}_xl`,
  `${NM_FARGLORY.id}_xl`,
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // 媽祖 (first v5 = code 94)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'hualien',
  displayName: '花蓮',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Hualien tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Hualien archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // Hualien zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Hualien city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Hualien landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4855414C, v5: 0x6875616C }, // hualien
  goalMonument, // P6a: 太魯閣牌樓 goal monument (buildGeometry/pos/winToast)
  narration,    // P7: 月牙 zh-TW narration tables
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Hualien LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 太魯閣牌樓 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Hualien zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
