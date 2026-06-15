/**
 * @file codeMap.js — PACK-AGNOSTIC engine helper. Builds the archetype
 * code<->id mapping at LOAD from the active pack's lists (pack-scoped, NOT a
 * global append-only frozen table). Also exports validatePack().
 *
 * Code layout (pack-scoped):
 *   codes 0..chunkCount-1  : chunk archetypes, tier-major
 *                            (code = sum of prior tiers' lengths + slot)
 *   codes chunkCount..      : EXTRA curated archetypes, in pack.extraIds order
 *                            (append-only within a pack for save compat).
 * Collectible album ids are append-only and resolve through
 * collectibleCodeForId(id) — never hand-roll "extraBase + id".
 *
 * @typedef {Object} StagePack
 * @property {string} id
 * @property {string} displayName
 * @property {string} region
 * @property {Array<{index:number, archetypeIds:string[], enterTrueRadius:number}>} tiers
 * @property {Record<string, object>} archetypes  id -> ArchetypeDef
 * @property {object} map
 * @property {Array<object>} landmarks
 * @property {object} goalMonument
 * @property {object} ending
 * @property {object} narration
 * @property {object} mascot
 * @property {object} locale
 * @property {object} seeds
 * @property {string[]} extraIds  EXTRA curated ids in code order (append-only)
 * @property {Record<number, number>} collectibleExtraIndex  collectibleId -> index in extraIds
 * @property {() => true} validate
 *
 * @typedef {Object} CodeMap
 * @property {string[]} idByCode
 * @property {Record<string, number>} codeById
 * @property {number} chunkCount
 * @property {number} extraBase
 * @property {(id:number) => number} collectibleCodeForId
 */

/**
 * Build the pack-scoped archetype code map (unique, hole-free, deterministic).
 * @param {StagePack} pack
 * @returns {CodeMap}
 */
export function buildCodeMap(pack) {
  const idByCode = [];
  const codeById = {};
  for (let t = 0; t < pack.tiers.length; t++) {
    const ids = pack.tiers[t].archetypeIds;
    for (let i = 0; i < ids.length; i++) {
      const code = idByCode.length;
      idByCode.push(ids[i]);
      codeById[ids[i]] = code;
    }
  }
  const chunkCount = idByCode.length;
  const extraBase = chunkCount;
  const extraIds = pack.extraIds || [];
  for (let e = 0; e < extraIds.length; e++) {
    const code = extraBase + e;
    idByCode.push(extraIds[e]);
    codeById[extraIds[e]] = code;
  }
  const colIndex = pack.collectibleExtraIndex || {};
  /** @param {number} id Collectible album id @returns {number} archetype code */
  const collectibleCodeForId = (id) => {
    const idx = colIndex[id];
    if (idx === undefined) {
      throw new Error(`[codeMap] no EXTRA slot for collectible id ${id}`);
    }
    return extraBase + idx;
  };
  return { idByCode, codeById, chunkCount, extraBase, collectibleCodeForId };
}

/**
 * Per-pack invariants (replaces the OLD global frozen asserts:
 * tiers.js TIERS.length===7 + seen.size===70, objects.js 99-entry table,
 * cityMap.js hardcoded landmark/collectible counts). Throws on violation.
 *
 * Invariants:
 *  - exactly 7 tiers, each with 10 archetypeIds (5x scale ladder convention)
 *  - every archetypeId resolves in pack.archetypes
 *  - chunk ids are unique (no duplicate across tiers)
 *  - landmark dioramaR / absorbRatio strictly increasing (ladder order)
 *  - the goal landmark (isGoal) is the LARGEST dioramaR
 *  - all landmark positions inside map bounds
 * @param {StagePack & {map:{bounds:{x:number[],z:number[]}}, absorbRatio:number}} pack
 * @returns {true}
 */
export function validatePack(pack) {
  const fail = (msg) => { throw new Error(`[validatePack:${pack.id}] ${msg}`); };

  if (pack.tiers.length !== 7) fail(`exactly 7 tiers required, got ${pack.tiers.length}`);
  const seen = new Set();
  for (let t = 0; t < pack.tiers.length; t++) {
    const tier = pack.tiers[t];
    if (tier.index !== t) fail(`tier ${t}: index field mismatch (${tier.index})`);
    if (tier.archetypeIds.length !== 10) {
      fail(`tier ${t}: exactly 10 archetypeIds (slots 8/9 = chunk landmarks), got ${tier.archetypeIds.length}`);
    }
    for (const id of tier.archetypeIds) {
      if (seen.has(id)) fail(`duplicate chunk archetype id '${id}'`);
      seen.add(id);
      if (!pack.archetypes[id]) fail(`archetypeId '${id}' does not resolve in pack.archetypes`);
    }
    if (t > 0 && !(tier.enterTrueRadius > pack.tiers[t - 1].enterTrueRadius)) {
      fail(`tier ${t}: enterTrueRadius must be strictly increasing`);
    }
  }

  // Landmark ladder + goal-is-largest + bounds. Pass 1 collects bounds /
  // goal / max so the goal-is-largest invariant is checked independently of
  // (and before) the strictly-increasing ladder step error — a non-goal
  // bigger than the goal is reported as a goal/largest violation, not masked
  // by the ladder step it also happens to break.
  const ratio = pack.absorbRatio || 0.65;
  const b = pack.map.bounds;
  let goal = null;
  let maxDioramaR = -Infinity;
  for (const ld of pack.landmarks) {
    if (ld.x < b.x[0] || ld.x > b.x[1] || ld.z < b.z[0] || ld.z > b.z[1]) {
      fail(`landmark '${ld.name}' position (${ld.x},${ld.z}) outside map bounds`);
    }
    if (ld.dioramaR > maxDioramaR) maxDioramaR = ld.dioramaR;
    if (ld.isGoal) goal = ld;
  }
  if (goal === null) fail('no landmark flagged isGoal');
  if (goal.dioramaR < maxDioramaR) fail('goal landmark must be the largest dioramaR (largest = last on the ladder)');

  // Pass 2: strictly-increasing threshold ladder (authored ladder order).
  let prevThresh = 0;
  for (const ld of pack.landmarks) {
    const thresh = ld.dioramaR / ratio;
    if (!(thresh > prevThresh)) {
      fail(`landmark ladder must be strictly increasing at '${ld.name}' (thresh ${thresh.toFixed(2)} <= prev ${prevThresh.toFixed(2)})`);
    }
    prevThresh = thresh;
  }
  return true;
}
