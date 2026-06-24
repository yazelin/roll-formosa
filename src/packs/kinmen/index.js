/**
 * @file kinmen/index.js — Kinmen StagePack.
 *
 * Full content surface required by R16. Wires 7 curated Kinmen landmarks
 * (翟山坑道/得月樓/風獅爺/山后民俗村/馬山觀測站/文台寶塔/金門國家公園)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='kinmen', displayName='金門', region='TW',
 * locale=zh-TW. Seeds are Kinmen-specific (K I N M = 0x4B494E4D,
 * v5 extension = 0x6B696E6D).
 *
 * Validation: routes through validatePack(pack) (R6). Kinmen LANDMARKS carry
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

// Kinmen replaces EXTRA codes 82..88 (legacy landmark ids at indices 12..18)
// with Kinmen landmark ids. Collectible codes 70..81 (indices 0..11) and codes
// 89..93 (indices 19..23) are extended landmarks.
import { NM_ZHAISHAN_TUNNEL } from './landmarks/zhaishan_tunnel.js';
import { NM_DEYUE_TOWER } from './landmarks/deyue_tower.js';
import { NM_WIND_LION_GOD } from './landmarks/wind_lion_god.js';
import { NM_SHANHOU_FOLK_VILLAGE } from './landmarks/shanhou_folk_village.js';
import { NM_MASHAN_OBSERVATION } from './landmarks/mashan_observation.js';
import { NM_WENTAI_PAGODA } from './landmarks/wentai_pagoda.js';
import { NM_KINMEN_NATIONAL_PARK } from './landmarks/kinmen_national_park.js';

/**
 * EXTRA id order for the Kinmen pack.
 * Codes 70..81 (indices 0..11): Kinmen collectible ids.
 * Codes 82..88 (indices 12..18): Kinmen landmark ids.
 * Codes 89..93 (indices 19..23): Kinmen extended landmarks.
 * Codes 94..98 (v5 indices 0..4): v5 ids (94 媽祖; 95..98 extended).
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Kinmen collectibles
  'black_bear', 'kaoliang_bottle_col', 'gong_tang_col', 'wind_lion_col', 'oyster_omelette',
  'beef_jerky_col', 'knife', 'kinmen_noodles', 'sorghum_candy', 'military_helmet',
  'artillery_shell', 'one_pot_rice',
  // indices 12..18 — codes 82..88: Kinmen landmark ids
  NM_ZHAISHAN_TUNNEL.id,      // 82 翟山坑道
  NM_DEYUE_TOWER.id,          // 83 得月樓
  NM_WIND_LION_GOD.id,        // 84 風獅爺
  NM_SHANHOU_FOLK_VILLAGE.id, // 85 山后民俗村
  NM_MASHAN_OBSERVATION.id,   // 86 馬山觀測站
  NM_WENTAI_PAGODA.id,        // 87 文台寶塔
  NM_KINMEN_NATIONAL_PARK.id, // 88 金門國家公園
  // indices 19..23 — codes 89..93: Kinmen extended landmarks
  'zhaishan_tunnel_ext', 'deyue_tower_ext', 'wind_lion_god_ext', 'shanhou_folk_village_ext', 'mashan_observation_ext',
  // v5 codes 94..98 — 94 媽祖; 95..98 Kinmen extended landmarks
  'mazu', 'wentai_pagoda_ext', 'kinmen_national_park_ext', 'juguang_tower_ext', 'lieyu_ext',
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // mazu (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'kinmen',
  displayName: '金門',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Kinmen tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Kinmen archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Kinmen city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Kinmen landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4B494E4D, v5: 0x6B696E6D }, // KINM / kinm
  goalMonument, // Kinmen goal monument (莒光樓 buildGeometry/pos/winToast)
  narration,    // Kinmen zh-TW narration tables
  ending,       // v6: Formosa-island reveal definition (islandOutline/cities/colors)
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Kinmen LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim. The landmark ladder
    // (7 curated + goal) must pass the strictly-increasing threshold
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
/** @type {string[]} code -> display name (Kinmen zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
