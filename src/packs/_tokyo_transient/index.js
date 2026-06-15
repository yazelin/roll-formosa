/**
 * @file _tokyo_transient/index.js — TRANSIENT StagePack that re-exports the
 * EXISTING Tokyo content unchanged. Its only job is to prove the StagePack
 * seam is byte-identical (P2). DELETE after P3 flips active.js to taipei.
 *
 * NOTHING is copied here — we re-reference the live config/ modules so the
 * forced-rescale pixel-identity check and the draw-call ledger see the exact
 * same data they saw before the seam existed. (Per R7: this pack exports
 * `activePack`/default ONLY; the taipei skeleton must NOT import it.)
 */
import { TIERS, RESCALE_S, ARCH_PER_TIER } from '../../config/tiers.js';
import { CATALOG, EXTRA_CATALOG, DISPLAY_NAME_BY_CODE } from '../../config/catalog.js';
import { EXTRA_ARCHETYPE_IDS, V5_ARCHETYPE_IDS } from '../../world/objects.js';
import * as cityMap from '../../config/cityMap.js';
import { ABSORB_RATIO, MAP_BOUNDS } from '../../config/tuning.js';
import { buildCodeMap, validatePack } from '../_engine/codeMap.js';

// EXTRA id order is the legacy frozen Tokyo order (codes 70.. in objects.js).
// After P1 removed OSM (94..109), the surviving EXTRA appendix is the 24
// curated ids + the 5 v5 ids (re-based to 94..98). Keep their RELATIVE order —
// codes must not move (save-compat + byte-identity).
const extraIds = [...EXTRA_ARCHETYPE_IDS, ...V5_ARCHETYPE_IDS];

// Collectible album id -> index in extraIds. Legacy Tokyo rule: ids 0..11 are
// EXTRA_ARCHETYPE_IDS[0..11]; id 12 (stack_chan) is the first v5 id. We derive
// the index by id rather than hand-coding 70+id, so the pack-scoped map stays
// the single authority.
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id; // 0..11
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // stack_chan (first v5)

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'tokyo',
  displayName: '東京',
  region: 'JP',
  tiers: TIERS,
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // chunk + EXTRA archetype recipes (id -> ArchetypeDef)
  extraCatalog: EXTRA_CATALOG, // EXTRA curated recipes (by code)
  displayNameByCode: DISPLAY_NAME_BY_CODE,
  extraIds,
  collectibleExtraIndex,
  // The engine consumes cityMap's named exports directly today; expose the
  // whole namespace so the seam is a rename, not a reshuffle.
  cityMap,
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS,
  absorbRatio: ABSORB_RATIO,
  // Tokyo seeds (informational — the live RNG seeds remain owned by the modules
  // that draw from them). P3's taipei pack fills locale/narration/mascot etc.
  seeds: { primary: 0x544f4b59, v5: 0x56355041 },
  validate() {
    // Pack-scoped validation. The transient Tokyo pack carries the scramble
    // decal off-ladder exemption (landmarkId 5) like the legacy validator.
    validateTokyoTransient(this);
    return true;
  },
};

/**
 * Pack-scoped code-map methods (R5), built once by buildCodeMap and attached
 * to the pack object so consumers read them off `activePack` rather than from
 * objects.js globals. For the transient Tokyo wrap these reproduce the legacy
 * 99-entry table exactly (codes 0..69 chunk, 70..93 EXTRA, 94..98 v5).
 */
const _codeMap = buildCodeMap(activePack);
/** @type {string[]} code -> archetype id. */
activePack.archetypeIdByCode = _codeMap.idByCode;
/** @type {Record<string, number>} archetype id -> code. */
activePack.codeByArchetypeId = _codeMap.codeById;
/** @type {string[]} code -> zh/ja display name (Tokyo: the frozen Japanese names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

/**
 * Tokyo-flavoured validate: run the shared validatePack but tolerate the
 * scramble-crossing decal (landmarkId 5) sitting OFF the threshold ladder,
 * exactly as cityMap.js validateCityMap did. Tokyo's LANDMARKS use `nameJa`
 * (not `name`) and carry no `isGoal` flag (the goal is the Skytree monument,
 * a separate object not in LANDMARKS) — so we shim a name/isGoal view of the
 * UNMODIFIED Tokyo data for the shared validator. These shims are confined to
 * the transient module and disappear in P3 when Taipei authors name/isGoal
 * natively.
 * @param {import('../_engine/codeMap.js').StagePack} pack
 */
function validateTokyoTransient(pack) {
  const ladderLandmarks = pack.landmarks.filter((ld) => ld.landmarkId !== 5);
  // Inject a synthetic goal = the largest dioramaR so the shared
  // "goal is largest" check passes without editing Tokyo data.
  const largest = ladderLandmarks.reduce((a, b) => (b.dioramaR > a.dioramaR ? b : a));
  const shimmed = {
    ...pack,
    landmarks: ladderLandmarks.map((ld) => ({ ...ld, name: ld.nameJa, isGoal: ld === largest })),
  };
  validatePack(shimmed);
}

export default activePack;
