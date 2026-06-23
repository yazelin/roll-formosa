/**
 * @file pingtung/index.js — Pingtung StagePack (P6b).
 *
 * Full content surface required by R16. P6b wires 8 curated Pingtung landmarks
 * (恆春南門/福安宮/萬金聖母聖殿/凱撒飯店/海生館/鵝鑾鼻燈塔/貓鼻頭/船帆石)
 * into the cityMap and catalog so they spawn in the world and can be absorbed.
 *
 * Pack identity overrides: id='pingtung', displayName='屏東', region='TW',
 * locale=zh-TW.
 *
 * Validation: routes through validatePack(pack) (R6). Pingtung LANDMARKS carry
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

// P6b: Pingtung landmarks (codes 82..89)
import { NM_HENGCHUN_SOUTH_GATE } from './landmarks/hengchun_south_gate.js';
import { NM_FUAN_TEMPLE } from './landmarks/fuan_temple.js';
import { NM_WANJIN_BASILICA } from './landmarks/wanjin_basilica.js';
import { NM_CAESAR_HOTEL } from './landmarks/caesar_hotel.js';
import { NM_AQUARIUM } from './landmarks/aquarium.js';
import { NM_ELUANBI } from './landmarks/eluanbi_lighthouse.js';
import { NM_MAOBITOU } from './landmarks/maobitou.js';
import { NM_SAIL_ROCK } from './landmarks/sail_rock.js';
import { NM_SOUTH_BAY } from './landmarks/south_bay.js';

/**
 * EXTRA id order for the Pingtung pack.
 * Codes 70..81 (indices 0..11): Pingtung collectibles.
 * Codes 82..89 (indices 12..19): Pingtung landmark ids (P6b).
 * Codes 90..93 (indices 20..23): extended landmarks.
 * Codes 94..98 (v5 indices 0..4): v5 collectible + extended landmarks.
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Pingtung collectibles (P7)
  'black_bear', 'bluefin_tuna', 'pig_trotter', 'mango', 'onion', 'sisal',
  'whale_shark', 'penguin', 'diving_mask', 'banana_boat', 'paiwan_pot', 'betel_palm',
  // indices 12..19 — codes 82..89: Pingtung landmark ids (P6b)
  NM_HENGCHUN_SOUTH_GATE.id, // 82 恆春南門
  NM_FUAN_TEMPLE.id,         // 83 福安宮
  NM_WANJIN_BASILICA.id,     // 84 萬金聖母聖殿
  NM_CAESAR_HOTEL.id,        // 85 凱撒飯店
  NM_AQUARIUM.id,            // 86 海生館
  NM_ELUANBI.id,             // 87 鵝鑾鼻燈塔
  NM_MAOBITOU.id,            // 88 貓鼻頭
  NM_SAIL_ROCK.id,           // 89 船帆石
  // indices 20..23 — codes 90..93: Pingtung extended landmarks
  `${NM_SOUTH_BAY.id}_ext90`, `${NM_ELUANBI.id}_ext91`, `${NM_AQUARIUM.id}_ext92`, `${NM_CAESAR_HOTEL.id}_ext93`,
  // v5 codes 94..98 — 94 萬金十字架; 95..98 extended landmarks
  'wanjin_cross', `${NM_MAOBITOU.id}_ext95`, `${NM_SAIL_ROCK.id}_ext96`, `${NM_FUAN_TEMPLE.id}_ext97`, `${NM_HENGCHUN_SOUTH_GATE.id}_ext98`,
];

// Collectible album id -> index in extraIds (legacy rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // wanjin_cross (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'pingtung',
  displayName: '屏東',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // Pingtung tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Pingtung archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Pingtung city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Pingtung landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x50494E47, v5: 0x70696E67 }, // pingtung
  goalMonument, // Pingtung goal monument (buildGeometry/pos/winToast)
  narration,    // zh-TW narration tables
  ending,       // Formosa-island reveal definition
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P6b: Pingtung LANDMARKS carry native name/isGoal — run the real
    // validatePack directly with no shim.
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
/** @type {string[]} code -> display name (Pingtung zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
