/**
 * @file osmPools.js — The 2 OSM building render batches (v4 Real Tokyo,
 * docs/DESIGN-V4.md レンダリング統合 — Stream R).
 *
 * makeOsmPools(material, osmGeometries) -> { detail, large }: two
 * BatchedExtraPool instances (the proven v3 class from render/extraPools.js,
 * 1 draw call each via WEBGL_multi_draw):
 *   - detail: cap OSM_POOL_DETAIL_CAP (2048) — serves alive bands 2-3
 *   - large:  cap OSM_POOL_LARGE_CAP  (1024) — serves alive bands 4-5
 *
 * POOL ROUTING IS BY BAND, membership is by GEOMETRY: both pools register
 * ALL 16 OSM voxel geometries (codes 94..109). Rationale: an OSM record's
 * band is derived from its r_eff (size), not its archetype — any code can in
 * principle appear in any band (a tiny osm_office_mid is band 3; a huge
 * osm_merged_block is band 4) — so a per-code membership split could reject
 * a legal alloc. Registering all 16 in both batches costs only the duplicated
 * unit-box vertex data (16 x <=216 verts, a few KB of GPU buffer per pool)
 * and makes pool selection a pure band test: band <= 3 -> detail, else large
 * (osmPoolForBand). Draw-call ledger is unchanged: 2 batches = +2 draws
 * (honest v4 worst 68 <= DRAW_CALL_CAP 72).
 *
 * BOOT FEASIBILITY ASSERTS (UNCONDITIONAL — boot-time only, frozen Phase-0
 * contract; slot exhaustion must be structurally impossible):
 *   OSM_ALIVE_CAP.b2 + b3 (1728) <= OSM_POOL_DETAIL_CAP (2048)
 *   OSM_ALIVE_CAP.b4 + b5 (896)  <= OSM_POOL_LARGE_CAP  (1024)
 *
 * UNIT-BOX CONVENTION (boot-asserted): every OSM geometry has half-extents
 * <= 1 (a 2x2x2 box archetype); render scale is the NON-UNIFORM triple
 * (w/2, h/2, d/2) in sim units via BatchedExtraPool.setTransform's v4
 * overload, while the ObjectStore radius stays r_eff. The unit-SPHERE
 * convention stays binding for all non-OSM archetypes.
 *
 * AXIS-ALIGNED-NORMALS CONSTRAINT (boot-asserted): BatchedMesh applies no
 * per-instance inverse-transpose, so non-uniform scale would mislight any
 * sloped face — every OSM geometry's normals must be +/-X/+/-Y/+/-Z (flat or
 * stepped boxes only in v1; see render/extraPools.js header).
 *
 * RADIUS AUDIT (DEV): nothing may derive object radius from matrix scale —
 * with non-uniform scale the magnitude is no longer the bounding radius.
 * The OSM spawner should call devAssertOsmScaleMatchesRadius on alloc in DEV:
 * for a unit box scaled by (w/2, h/2, d/2)/ws the half-diagonal
 * sqrt(sx^2 + sy^2 + sz^2) equals r_eff/ws = the store radius (sim) exactly.
 *
 * Integration (main.js, integrator-only): construct at the V4-STUB osmPools
 * slot; scene.add both meshes; register BOTH pools in the `instances` map
 * (reserved keys 'osm:detail'/'osm:large') AND in `poolList` exactly like
 * extraPools — ScaleManager's eachPool then covers RESCALE/REBASE and
 * updateAndFlushPools covers fade stepping. Spawner/curated only look pools
 * up by archetype id, so the reserved keys never collide.
 */

import { BatchedExtraPool } from './extraPools.js';
import { OSM_ALIVE_CAP, OSM_POOL_DETAIL_CAP, OSM_POOL_LARGE_CAP } from '../config/tuning.js';

const DEV = !!(import.meta.env && import.meta.env.DEV);

/** Expected OSM archetype count (codes 94..109 — frozen Phase 0 in world/objects.js). */
const OSM_ARCHETYPE_COUNT = 16;
/** Unit-box half-extent tolerance. INTEGRATION FIX (lead): Stream C's frozen
 *  geometry contract allows accent parts (awnings/eaves/signage/door insets)
 *  to overhang the [-1,1]^3 body by up to +-0.1 (its geometryFactory boot
 *  assert enforces exactly that); 13/16 shipped OSM voxels use it (worst
 *  1.09). The half-diagonal radius audit below is independent of the accent
 *  span (it compares render scale vs store radius), so this eps is visual
 *  honesty only — accents may draw <=9% beyond the OBB, collision honesty
 *  stays with catalog collisionScale. Was 1e-3 (float dust), relaxed to the
 *  C-stream accent eps at integration. */
const UNIT_BOX_EPS = 0.1 + 1e-3;
/** Axis-aligned normal tolerance: dominant component >= this after normalize. */
const NORMAL_AXIS_MIN = 0.999;

/**
 * Build the two OSM building batches.
 * @param {import('three').Material} material The single shared object material
 *   (render/instances.js getSharedObjectMaterial() / v4 objectMaterial.js).
 * @param {Array<{code: number, geometry: import('three').BufferGeometry}>} osmGeometries
 *   The 16 OSM voxel archetypes, one entry per frozen code 94..109 (order
 *   free, codes unique). Geometries are unit-box (catalog unitBox:true) with
 *   axis-aligned normals — both boot-asserted here.
 * @returns {{detail: BatchedExtraPool, large: BatchedExtraPool}}
 */
export function makeOsmPools(material, osmGeometries) {
  /* ---- boot feasibility asserts (unconditional; frozen Phase-0 contract) ---- */
  const detailDemand = OSM_ALIVE_CAP.b2 + OSM_ALIVE_CAP.b3;
  const largeDemand = OSM_ALIVE_CAP.b4 + OSM_ALIVE_CAP.b5;
  if (detailDemand > OSM_POOL_DETAIL_CAP) {
    throw new Error(
      `[osmPools] detail pool infeasible: OSM_ALIVE_CAP b2+b3 = ${detailDemand} > cap ${OSM_POOL_DETAIL_CAP}`
    );
  }
  if (largeDemand > OSM_POOL_LARGE_CAP) {
    throw new Error(
      `[osmPools] large pool infeasible: OSM_ALIVE_CAP b4+b5 = ${largeDemand} > cap ${OSM_POOL_LARGE_CAP}`
    );
  }
  if (!Array.isArray(osmGeometries) || osmGeometries.length !== OSM_ARCHETYPE_COUNT) {
    throw new Error(
      `[osmPools] expected ${OSM_ARCHETYPE_COUNT} OSM member geometries, got ` +
        `${Array.isArray(osmGeometries) ? osmGeometries.length : typeof osmGeometries}`
    );
  }
  const seen = new Set();
  for (let i = 0; i < osmGeometries.length; i++) {
    const m = osmGeometries[i];
    if (!m || typeof m.code !== 'number' || !m.geometry) {
      throw new Error(`[osmPools] member ${i} is not {code, geometry}`);
    }
    if (seen.has(m.code)) throw new Error(`[osmPools] duplicate OSM code ${m.code}`);
    seen.add(m.code);
    assertUnitBoxAxisAligned(m.geometry, m.code);
  }

  /* Both pools span all 16 geometries — routing is by band (see header). */
  const detail = new BatchedExtraPool(material, OSM_POOL_DETAIL_CAP, osmGeometries);
  const large = new BatchedExtraPool(material, OSM_POOL_LARGE_CAP, osmGeometries);
  return { detail, large };
}

/**
 * Pool routing — pure band test (the only legal way to pick an OSM pool).
 * @param {{detail: BatchedExtraPool, large: BatchedExtraPool}} pools makeOsmPools result.
 * @param {number} band OSM band 2..5 (decoded from r_eff — tuning.osmBandForReff).
 * @returns {BatchedExtraPool} detail for bands 2-3, large for bands 4-5.
 */
export function osmPoolForBand(pools, band) {
  return band <= 3 ? pools.detail : pools.large;
}

/**
 * DEV radius audit (Stream R audit item — call from the OSM spawner on alloc
 * in DEV builds): for a unit-box geometry scaled by (w/2, h/2, d/2) in sim
 * units, the scaled half-diagonal sqrt(sx^2+sy^2+sz^2) must equal the
 * ObjectStore radius r_eff/worldScale. A mismatch means some code path is
 * deriving radius from matrix scale (or scale from the wrong source) — the
 * exact bug class the non-uniform overload can hide.
 * @param {number} sx Render scale X (sim) — w/2 / worldScale.
 * @param {number} sy Render scale Y (sim) — h/2 / worldScale.
 * @param {number} sz Render scale Z (sim) — d/2 / worldScale.
 * @param {number} storeRadiusSim ObjectStore radius for the slot (sim units).
 * @returns {boolean} True when consistent (always check the return in tests;
 *   in DEV builds a mismatch also console.errors with the numbers).
 */
export function devAssertOsmScaleMatchesRadius(sx, sy, sz, storeRadiusSim) {
  const halfDiag = Math.sqrt(sx * sx + sy * sy + sz * sz);
  const tol = Math.max(1e-6, storeRadiusSim * 1e-3);
  const ok = Math.abs(halfDiag - storeRadiusSim) <= tol;
  if (!ok && DEV) {
    console.error(
      `[osmPools] scale/radius mismatch: half-diag ${halfDiag} vs store radius ` +
        `${storeRadiusSim} (sx=${sx} sy=${sy} sz=${sz}) — radius must come from the store`
    );
  }
  return ok;
}

/**
 * Boot assert: unit-box bounds + axis-aligned normals (throws — boot-time
 * only, the violation is a content bug that must never ship).
 * @param {import('three').BufferGeometry} geometry
 * @param {number} code For the error message.
 */
function assertUnitBoxAxisAligned(geometry, code) {
  const pos = geometry.getAttribute('position');
  if (!pos) throw new Error(`[osmPools] OSM code ${code}: geometry has no position attribute`);
  const pa = pos.array;
  for (let i = 0; i < pa.length; i++) {
    if (Math.abs(pa[i]) > 1 + UNIT_BOX_EPS) {
      throw new Error(
        `[osmPools] OSM code ${code}: not unit-box — |position| ${Math.abs(pa[i])} > 1 ` +
          `(half-extents must be <= 1; render scale carries w/2,h/2,d/2)`
      );
    }
  }
  const nrm = geometry.getAttribute('normal');
  if (!nrm) throw new Error(`[osmPools] OSM code ${code}: geometry has no normal attribute`);
  const na = nrm.array;
  for (let i = 0; i < na.length; i += 3) {
    const ax = Math.abs(na[i]);
    const ay = Math.abs(na[i + 1]);
    const az = Math.abs(na[i + 2]);
    const len = Math.sqrt(ax * ax + ay * ay + az * az);
    if (len < 1e-6 || Math.max(ax, ay, az) / len < NORMAL_AXIS_MIN) {
      throw new Error(
        `[osmPools] OSM code ${code}: normal (${na[i]}, ${na[i + 1]}, ${na[i + 2]}) is not ` +
          `axis-aligned — non-uniform scale would mislight it (flat/stepped boxes only in v1)`
      );
    }
  }
}
