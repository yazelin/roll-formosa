/**
 * @file taipei/index.js — Taipei StagePack (P3 skeleton).
 *
 * Full content surface required by R16: re-exports Tokyo content from
 * config/* as placeholders so the engine boots byte-identically while P4
 * (tiers), P5 (catalog), and P6 (cityMap/landmarks/monument) replace each
 * layer with real Taipei data.
 *
 * Pack identity overrides: id='taipei', displayName='台北', region='TW',
 * locale=zh-TW. Seeds are Taipei-specific (T A I P E I = 0x54414950,
 * v5 extension = 0x56355441).
 *
 * Validation: routes through validatePack(pack) (R6). The Tokyo LANDMARKS
 * use `nameJa` (not `name`) and carry no `isGoal` flag — we shim a name/
 * isGoal view for validatePack (identical to the _tokyo_transient shim)
 * since LANDMARKS are still the Tokyo stub in P3. P6 authors native
 * name/isGoal on the Taipei landmarks and the shim disappears.
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

// EXTRA id order (frozen Tokyo order for code compat — P5 retains or renames).
const extraIds = [...EXTRA_ARCHETYPE_IDS, ...V5_ARCHETYPE_IDS];

// Collectible album id -> index in extraIds (legacy Tokyo rule preserved).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'taipei',
  displayName: '台北',
  region: 'TW',
  locale, // zh-TW t()/fmt() (R10: routes HUD/screens strings)
  tiers: TIERS, // P3 stub: Tokyo tiers; P4 replaces with Taipei ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // P3 stub: Tokyo recipes; P5 replaces
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // P5 replaces with zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // P3 stub: Tokyo city map namespace; P6 replaces
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // P3 stub: Tokyo landmarks; P6 replaces
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x54414950, v5: 0x56355441 }, // TAIP / V5TA
  // P6 will add: goalMonument, ending, narration, mascot
  validate() {
    // P4: structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // P5: all 70 chunk ids now resolve in CATALOG; run the real archetype-
    // resolution invariant. EXTRA/v5 ids also resolve via Tokyo placeholders.
    // P3 landmark shim retained for nameJa/isGoal (Tokyo LANDMARKS still used;
    // P6 authors native name/isGoal and removes this shim).
    const ladderLandmarks = this.landmarks.filter((ld) => ld.landmarkId !== 5);
    const largest = ladderLandmarks.reduce((a, b) => (b.dioramaR > a.dioramaR ? b : a));
    const shimmed = {
      ...this,
      landmarks: ladderLandmarks.map((ld) => ({ ...ld, name: ld.nameJa, isGoal: ld === largest })),
    };
    validatePack(shimmed);
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
/** @type {string[]} code -> display name (P3: still Tokyo Japanese names; P5 replaces). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
