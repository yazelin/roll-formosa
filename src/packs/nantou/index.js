/**
 * @file nantou/index.js — Nantou StagePack.
 *
 * Full content surface required by R16. Nantou wires 8 curated Nantou landmarks
 * (文武廟/玄光寺/九族文化村/清境小瑞士/紙教堂/集集車站/日月潭纜車站/埔里酒廠)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='nantou', displayName='南投', region='TW',
 * locale=zh-TW. Seeds are Nantou-specific (NANT = 0x4E414E54,
 * v5 extension = 0x6E616E74 = 'nant' lowercase).
 *
 * Validation: routes through validatePack(pack) (R6). Nantou LANDMARKS carry
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

// Nantou replaces EXTRA codes 82..89 (legacy landmark ids at indices 12..19)
// with Nantou landmark ids. Collectible codes 70..81 (indices 0..11) and codes
// 90..93 (indices 20..23) remain frozen placeholder ids.
import { NM_WENWU_TEMPLE } from './landmarks/wenwu_temple.js';
import { NM_XUANGUANG_TEMPLE } from './landmarks/xuanguang_temple.js';
import { NM_FORMOSAN_VILLAGE } from './landmarks/formosan_village.js';
import { NM_QINGJING_SWISS } from './landmarks/qingjing_swiss.js';
import { NM_PAPER_DOME } from './landmarks/paper_dome.js';
import { NM_JIJI_STATION } from './landmarks/jiji_station.js';
import { NM_ROPEWAY_STATION } from './landmarks/ropeway_station.js';
import { NM_PULI_WINERY } from './landmarks/puli_winery.js';
// Extended landmark placeholder (codes 90-93 + 95-98)
import { NM_CIEN_PAGODA } from './landmarks/cien_pagoda.js';

/**
 * EXTRA id order for the Nantou pack.
 * Codes 70..81 (indices 0..11): Nantou collectibles (incl 4 nantou-specific).
 * Codes 82..89 (indices 12..19): Nantou landmark ids.
 * Codes 90..93 (indices 20..23): extended landmark placeholders.
 * Codes 94..98 (v5 indices 0..4): 94=mazu; 95..98 extended landmark placeholders.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Nantou collectibles
  'black_bear', 'boba', 'sun_moon_egg', 'shiitake', 'golden_rooster', 'sunmoon_fish',
  'thao_canoe', 'jiji_banana', 'bamboo_basket_col', 'shaoxing_wine', 'ropeway_gondola', 'qingjing_sheep',
  // indices 12..19 — codes 82..89: Nantou landmark ids
  NM_WENWU_TEMPLE.id,      // 82 文武廟
  NM_XUANGUANG_TEMPLE.id,  // 83 玄光寺
  NM_FORMOSAN_VILLAGE.id,  // 84 九族文化村
  NM_QINGJING_SWISS.id,    // 85 清境小瑞士
  NM_PAPER_DOME.id,        // 86 紙教堂
  NM_JIJI_STATION.id,      // 87 集集車站
  NM_ROPEWAY_STATION.id,   // 88 日月潭纜車站
  NM_PULI_WINERY.id,       // 89 埔里酒廠
  // indices 20..23 — codes 90..93: extended landmark placeholders (use cien_pagoda)
  `${NM_CIEN_PAGODA.id}_ext90`, `${NM_CIEN_PAGODA.id}_ext91`,
  `${NM_CIEN_PAGODA.id}_ext92`, `${NM_CIEN_PAGODA.id}_ext93`,
  // v5 codes 94..98 — 94 媽祖; 95..98 extended landmark placeholders
  'mazu',
  `${NM_CIEN_PAGODA.id}_ext95`, `${NM_CIEN_PAGODA.id}_ext96`,
  `${NM_CIEN_PAGODA.id}_ext97`, `${NM_CIEN_PAGODA.id}_ext98`,
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // mazu (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'nantou',
  displayName: '南投',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Nantou tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Nantou archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // Nantou zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Nantou city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Nantou landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4E414E54, v5: 0x6E616E74 }, // NANT / nant
  goalMonument, // Nantou: 慈恩塔 goal monument (buildGeometry/pos/winToast)
  narration,    // Nantou zh-TW narration tables
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Nantou LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The 9-entry ladder
    // (8 curated + 慈恩塔 goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Nantou zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
