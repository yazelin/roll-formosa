/**
 * @file extraPools.js — The 4 SHARED size-class render pools for EXTRA
 * curated archetypes (codes 70..92), backed by THREE.BatchedMesh.
 *
 * INTEGRATION-OWNED (v3). docs/DESIGN-V3.md spawnArchitecture RENDER POOLS
 * specifies "4 SHARED InstancedPools by size class ... flat +4 draws", but a
 * THREE.InstancedMesh carries exactly ONE geometry — it cannot render 雷門
 * and 西郷さん像 from the same pool. BatchedMesh is the draw-call-identical
 * resolution: one mesh (= 1 draw call via WEBGL_multi_draw) holding every
 * class member's geometry, per-instance geometry chosen at alloc(code).
 *
 * The class mirrors the InstancedPool surface that world/curated.js and the
 * ScaleManager/main.js plumbing consume:
 *   alloc(code) free(slot) setTransform(slot,pos,quat,scale) setColor(slot,hex)
 *   fadeIn(slot,s) fadeOut(slot,s, auto-free) update(dt) flush()
 *   rescaleAll(S) rebaseAll(sx,sz) reset() dispose() .mesh .allocatedCount
 * Differences from InstancedPool: alloc takes the archetype CODE (curated
 * passes it; chunk InstancedPools ignore the extra argument), and flush() is
 * a no-op (BatchedMesh owns its data-texture uploads).
 *
 * Zero per-frame allocation in steady state: BatchedMesh addInstance/
 * deleteInstance run only on curated activation/deactivation events (the
 * amortized <=64/frame ring path), never per frame.
 *
 * v4 (docs/DESIGN-V4.md レンダリング統合 — Stream R):
 * - MEMBER-LIST INJECTION IS GENERAL: BatchedExtraPool is code-agnostic — it
 *   maps any injected {code, geometry} member list to BatchedMesh geometry
 *   ids. render/osmPools.js reuses the class verbatim for the two OSM
 *   building batches (codes 94..109); buildExtraPools below stays the
 *   curated EXTRA (70..92) partition.
 * - NON-UNIFORM SCALE: setTransform(slot, pos, quat, sx, sy = sx, sz = sx).
 *   Existing 4-arg callers (curated) are byte-identical (uniform). Fade
 *   animators store/multiply the full scale triple; rescaleAll(S) scales all
 *   three axes (the one-frame similarity stays pixel-identical).
 * - AXIS-ALIGNED-NORMALS CONSTRAINT (binding for non-uniformly scaled
 *   members): BatchedMesh applies NO inverse-transpose normal matrix per
 *   instance, so a non-uniform scale would mislight any sloped face. Every
 *   geometry rendered at non-uniform scale MUST have only +/-X/+/-Y/+/-Z
 *   normals (flat/stepped boxes — the OSM voxel law; boot-asserted in
 *   osmPools.js). Unit-SPHERE members (EXTRA codes) stay uniform-scaled.
 * - RADIUS AUDIT: object radius/size semantics live in the ObjectStore —
 *   no code may derive radius from matrix scale magnitude (the non-uniform
 *   overload would silently break it). See osmPools.devAssertOsmScaleMatchesRadius.
 */

import * as THREE from 'three';
import { ARCHETYPE_ID_BY_CODE, EXTRA_CODE_BASE } from '../world/objects.js';
import { EXTRA_SIZE_CLASS_BY_CODE, EXTRA_POOL_CAPS } from '../config/catalog.js';

const DEV = !!(import.meta.env && import.meta.env.DEV);

/** Fade modes (mirror instances.js). */
const FADE_NONE = 0;
const FADE_IN = 1;
const FADE_OUT = 2;

/* Module scratch — zero per-frame allocation. */
const _M4 = new THREE.Matrix4();
const _POS = new THREE.Vector3();
const _QUAT = new THREE.Quaternion();
const _SCL = new THREE.Vector3();
const _COLOR = new THREE.Color();

/** @param {number} t @returns {number} */
function easeOutCubic(t) {
  const u = 1 - t;
  return 1 - u * u * u;
}

/**
 * One shared size-class pool over a BatchedMesh (1 draw call worst case).
 */
export class BatchedExtraPool {
  /**
   * @param {THREE.Material} material Shared object material.
   * @param {number} capacity Max concurrently-alive instances.
   * @param {Array<{code: number, geometry: THREE.BufferGeometry}>} members
   *   Class members (frozen EXTRA codes + unit-radius geometries).
   */
  constructor(material, capacity, members) {
    /** @type {number} */
    this.capacity = capacity;

    // BatchedMesh requires consistent indexing across geometries; catalog
    // recipes are a mix, so normalize to non-indexed (boot-time copies only;
    // addGeometry copies vertex data into the batch buffers immediately).
    const flat = new Array(members.length);
    let totalVerts = 0;
    for (let i = 0; i < members.length; i++) {
      const g = members[i].geometry;
      flat[i] = g.index !== null ? g.toNonIndexed() : g;
      totalVerts += flat[i].getAttribute('position').count;
    }

    /** @type {THREE.BatchedMesh} Add to scene; visible only when non-empty. */
    this.mesh = new THREE.BatchedMesh(capacity, totalVerts, 0, material);
    this.mesh.visible = false; // empty pools must not cost a draw call
    this.mesh.frustumCulled = false;
    this.mesh.perObjectFrustumCulled = false;
    this.mesh.sortObjects = false;

    /** @type {Map<number, number>} EXTRA code -> BatchedMesh geometryId. */
    this._geomIdByCode = new Map();
    for (let i = 0; i < members.length; i++) {
      this._geomIdByCode.set(members[i].code, this.mesh.addGeometry(flat[i]));
      if (flat[i] !== members[i].geometry) flat[i].dispose(); // throwaway copy
    }

    /* --- per-slot TRS store (slot = BatchedMesh instanceId, < capacity) --- */
    /** @type {Float32Array} */ this._px = new Float32Array(capacity);
    /** @type {Float32Array} */ this._py = new Float32Array(capacity);
    /** @type {Float32Array} */ this._pz = new Float32Array(capacity);
    /** @type {Float32Array} */ this._qx = new Float32Array(capacity);
    /** @type {Float32Array} */ this._qy = new Float32Array(capacity);
    /** @type {Float32Array} */ this._qz = new Float32Array(capacity);
    /** @type {Float32Array} */ this._qw = new Float32Array(capacity);
    /** @type {Float32Array} Base (un-faded) scale X (uniform callers: the one scale). */ this._scale = new Float32Array(capacity);
    /** @type {Float32Array} Base scale Y (v4 non-uniform; == _scale for uniform callers). */ this._scaleY = new Float32Array(capacity);
    /** @type {Float32Array} Base scale Z (v4 non-uniform; == _scale for uniform callers). */ this._scaleZ = new Float32Array(capacity);
    /** @type {Float32Array} Current fade factor in the matrix. */ this._curF = new Float32Array(capacity);
    /** @type {Uint8Array} 1 = allocated. */ this._alive = new Uint8Array(capacity);
    /** @type {Uint8Array} */ this._fadeMode = new Uint8Array(capacity);
    /** @type {Float32Array} */ this._fadeT = new Float32Array(capacity);
    /** @type {Float32Array} */ this._fadeDur = new Float32Array(capacity);
    /** @type {Float32Array} */ this._fadeStartF = new Float32Array(capacity);
    /** @type {Int32Array} Last setColor hex per slot (-1 none) — read back by
     *  the main ABSORB attach handler for the fly-on proxy tint. */
    this._colorHex = new Int32Array(capacity).fill(-1);
    /** @type {number} */
    this._allocated = 0;
  }

  /** Number of currently allocated slots. @returns {number} */
  get allocatedCount() {
    return this._allocated;
  }

  /**
   * Allocate an instance of the given EXTRA archetype. Starts INVISIBLE
   * (zero scale) — call setTransform (+ optional fadeIn).
   * @param {number} code Frozen EXTRA code 70..92.
   * @returns {number} Slot, or -1 when exhausted / unknown code.
   */
  alloc(code) {
    if (this._allocated >= this.capacity) return -1;
    const gid = this._geomIdByCode.get(code);
    if (gid === undefined) {
      if (DEV) console.warn(`[extraPools] alloc for code ${code} — not a member of this pool`);
      return -1;
    }
    const slot = this.mesh.addInstance(gid);
    this._alive[slot] = 1;
    this._px[slot] = 0;
    this._py[slot] = 0;
    this._pz[slot] = 0;
    this._qx[slot] = 0;
    this._qy[slot] = 0;
    this._qz[slot] = 0;
    this._qw[slot] = 1;
    this._scale[slot] = 0;
    this._scaleY[slot] = 0;
    this._scaleZ[slot] = 0;
    this._curF[slot] = 1;
    this._fadeMode[slot] = FADE_NONE;
    this._writeMatrix(slot, 0); // invisible until setTransform
    this._allocated++;
    if (!this.mesh.visible) this.mesh.visible = true;
    return slot;
  }

  /**
   * Kill a slot immediately (BatchedMesh instance deleted; id recycled).
   * Idempotent for already-free slots.
   * @param {number} slot
   */
  free(slot) {
    if (slot < 0 || slot >= this.capacity || this._alive[slot] === 0) return;
    this._alive[slot] = 0;
    this._fadeMode[slot] = FADE_NONE;
    this.mesh.deleteInstance(slot);
    this._allocated--;
    if (this._allocated === 0) this.mesh.visible = false;
  }

  /**
   * Set a slot's TRS (copied; recomposed at the current fade factor).
   * v4: optional non-uniform scale — OSM unit-box members pass
   * (w/2, h/2, d/2) in sim units; 4-arg callers stay uniform (byte-identical).
   * Non-uniform members MUST have axis-aligned normals (header constraint).
   * @param {number} slot @param {THREE.Vector3} pos
   * @param {THREE.Quaternion} quat @param {number} sx Scale X (uniform callers: the scale).
   * @param {number} [sy=sx] Scale Y. @param {number} [sz=sx] Scale Z.
   */
  setTransform(slot, pos, quat, sx, sy = sx, sz = sx) {
    this._px[slot] = pos.x;
    this._py[slot] = pos.y;
    this._pz[slot] = pos.z;
    this._qx[slot] = quat.x;
    this._qy[slot] = quat.y;
    this._qz[slot] = quat.z;
    this._qw[slot] = quat.w;
    this._scale[slot] = sx;
    this._scaleY[slot] = sy;
    this._scaleZ[slot] = sz;
    this._writeMatrix(slot, this._factorOf(slot));
  }

  /** @param {number} slot @param {number} hex Palette tint. */
  setColor(slot, hex) {
    _COLOR.setHex(hex);
    this.mesh.setColorAt(slot, _COLOR);
    this._colorHex[slot] = hex;
  }

  /**
   * Tint read-back for the ABSORB attach handler (EXTRA slots are
   * curated-owned — main reads the tint but never frees them).
   * @param {number} slot @returns {number} hex or -1.
   */
  getColorHex(slot) {
    if (slot < 0 || slot >= this.capacity || this._alive[slot] === 0) return -1;
    return this._colorHex[slot];
  }

  /** Animate scale 0 -> base over `seconds` (ease-out cubic). */
  fadeIn(slot, seconds) {
    if (this._alive[slot] === 0) return;
    if (seconds <= 0) {
      this._fadeMode[slot] = FADE_NONE;
      this._writeMatrix(slot, 1);
      return;
    }
    this._fadeMode[slot] = FADE_IN;
    this._fadeT[slot] = 0;
    this._fadeDur[slot] = seconds;
    this._writeMatrix(slot, 0);
  }

  /** Animate scale current -> 0 over `seconds`, then AUTO-FREE the slot. */
  fadeOut(slot, seconds) {
    if (this._alive[slot] === 0) return;
    if (seconds <= 0) {
      this.free(slot);
      return;
    }
    this._fadeStartF[slot] = this._factorOf(slot);
    this._fadeMode[slot] = FADE_OUT;
    this._fadeT[slot] = 0;
    this._fadeDur[slot] = seconds;
  }

  /**
   * Step fade animators (called from updateAndFlushPools). Flat scan over
   * capacity: EXTRA pools are <= 12 slots; the v4 OSM pools are 2048/1024 —
   * still a single contiguous Uint8Array pass (~3k byte reads/frame total),
   * cheaper than maintaining a fade list, zero allocation.
   * @param {number} dt
   */
  update(dt) {
    for (let slot = 0; slot < this.capacity; slot++) {
      const mode = this._fadeMode[slot];
      if (mode === FADE_NONE || this._alive[slot] === 0) continue;
      this._fadeT[slot] += dt;
      const t01 = this._fadeT[slot] / this._fadeDur[slot];
      if (t01 >= 1) {
        this._fadeMode[slot] = FADE_NONE;
        if (mode === FADE_OUT) this.free(slot);
        else this._writeMatrix(slot, 1);
      } else if (mode === FADE_IN) {
        this._writeMatrix(slot, easeOutCubic(t01));
      } else {
        const u = 1 - t01;
        this._writeMatrix(slot, this._fadeStartF[slot] * u * u * u);
      }
    }
  }

  /** No-op (BatchedMesh flags its own data textures on every write). */
  flush() {}

  /** One-frame similarity rescale (ScaleManager eachPool) — scales the full
   *  triple so non-uniform slots stay pixel-identical. @param {number} S */
  rescaleAll(S) {
    for (let slot = 0; slot < this.capacity; slot++) {
      if (this._alive[slot] === 0) continue;
      this._px[slot] *= S;
      this._py[slot] *= S;
      this._pz[slot] *= S;
      this._scale[slot] *= S;
      this._scaleY[slot] *= S;
      this._scaleZ[slot] *= S;
      this._writeMatrix(slot, this._curF[slot]);
    }
  }

  /** Floating-origin rebase (ScaleManager eachPool). */
  rebaseAll(sx, sz) {
    for (let slot = 0; slot < this.capacity; slot++) {
      if (this._alive[slot] === 0) continue;
      this._px[slot] -= sx;
      this._pz[slot] -= sz;
      this._writeMatrix(slot, this._curF[slot]);
    }
  }

  /** Full reset (game reset): every live instance deleted, fades cleared. */
  reset() {
    for (let slot = 0; slot < this.capacity; slot++) {
      if (this._alive[slot] === 1) this.mesh.deleteInstance(slot);
      this._alive[slot] = 0;
      this._fadeMode[slot] = FADE_NONE;
    }
    this._allocated = 0;
    this.mesh.visible = false;
  }

  /** Release GPU buffers (teardown only). */
  dispose() {
    this.mesh.dispose();
  }

  /** @param {number} slot @returns {number} Current fade factor (1 = none). */
  _factorOf(slot) {
    const mode = this._fadeMode[slot];
    if (mode === FADE_NONE) return 1;
    const t01 = this._fadeDur[slot] > 0 ? Math.min(this._fadeT[slot] / this._fadeDur[slot], 1) : 1;
    if (mode === FADE_IN) return easeOutCubic(t01);
    const u = 1 - t01;
    return this._fadeStartF[slot] * u * u * u;
  }

  /** Compose + upload one instance matrix at fade factor f (scale triple
   *  multiplied by f — Matrix4.compose handles non-uniform natively). */
  _writeMatrix(slot, f) {
    this._curF[slot] = f;
    _POS.set(this._px[slot], this._py[slot], this._pz[slot]);
    _QUAT.set(this._qx[slot], this._qy[slot], this._qz[slot], this._qw[slot]);
    _SCL.set(this._scale[slot] * f, this._scaleY[slot] * f, this._scaleZ[slot] * f);
    _M4.compose(_POS, _QUAT, _SCL);
    this.mesh.setMatrixAt(slot, _M4);
  }
}

/**
 * Size-class pool index (0..3, curated's EXTRA_POOL_CLASS order) for an
 * EXTRA code, or -1 (chunk codes / 93 Skytree display slot).
 * @param {number} code @returns {number}
 */
export function extraClassIndexForCode(code) {
  const cls = EXTRA_SIZE_CLASS_BY_CODE[code];
  if (cls === null || cls === undefined) return -1;
  const k = CLASS_INDEX[cls];
  return k === undefined ? -1 : k;
}

/** curated.js EXTRA_POOL_CLASS index order (frozen partition). */
const CLASS_INDEX = Object.freeze({
  'collectible-small': 0,
  'landmark-mid': 1,
  'landmark-large': 2,
  'landmark-xl': 3,
});

/**
 * Instance caps per class — the render-side capacity AUTHORITY (catalog.js
 * EXTRA_POOL_CAPS is the documented spec floor; this array is what
 * BatchedExtraPool is actually constructed with — keep CLASS_CAPS[k] >=
 * EXTRA_POOL_CAPS[class], asserted below in dev). v4 audit: landmark-mid
 * worst case 5 concurrent (80,82,83,84,86), landmark-XL 5 (3 bridge spans +
 * tower + shell) at T5/T6 map-wide load radii. v5 audit: collectible-small
 * gains stack_chan (code 110) -> 12 member archetypes, cap 13; landmark-mid
 * gains the 6 Akihabara placements of codes 111..114 -> worst co-location
 * 5 + 6 = 11, cap 12. Caps are MEMORY only (one BatchedMesh per class) —
 * never extra draws.
 */
const CLASS_CAPS = Object.freeze([13, 12, 6, 6]);

/* Boot DEV feasibility assert: the constructed caps may never silently fall
   below the catalog.js spec floors (the v4 mismatch trap — EXTRA_POOL_CAPS
   raised without this mirror would overflow the live pools). */
if (DEV) {
  const order = ['collectible-small', 'landmark-mid', 'landmark-large', 'landmark-xl'];
  for (let k = 0; k < order.length; k++) {
    if (!(CLASS_CAPS[k] >= EXTRA_POOL_CAPS[order[k]])) {
      throw new Error(
        `[extraPools.js invariant] CLASS_CAPS[${k}] (${CLASS_CAPS[k]}) < EXTRA_POOL_CAPS` +
          `['${order[k]}'] (${EXTRA_POOL_CAPS[order[k]]}) — render pools would overflow`
      );
    }
  }
}

/**
 * Build the 4 shared size-class pools from the boot geometry map.
 * @param {Object<string, THREE.BufferGeometry>} geos buildAllGeometries(CATALOG).
 * @param {THREE.Material} material getSharedObjectMaterial().
 * @returns {Array<BatchedExtraPool|null>} [collectible-small, landmark-mid,
 *   landmark-large, landmark-xl] — index order matches curated's
 *   EXTRA_POOL_CLASS partition.
 */
export function buildExtraPools(geos, material) {
  /** @type {Array<Array<{code: number, geometry: THREE.BufferGeometry}>>} */
  const members = [[], [], [], []];
  for (let code = EXTRA_CODE_BASE; code < ARCHETYPE_ID_BY_CODE.length; code++) {
    const cls = EXTRA_SIZE_CLASS_BY_CODE[code];
    if (cls === null || cls === undefined) continue; // 93 Skytree display slot
    const k = CLASS_INDEX[cls];
    const g = geos[ARCHETYPE_ID_BY_CODE[code]];
    if (k === undefined || !g) {
      if (DEV) console.warn(`[extraPools] no geometry/class for EXTRA code ${code}`);
      continue;
    }
    members[k].push({ code, geometry: g });
  }
  const pools = new Array(4);
  for (let k = 0; k < 4; k++) {
    pools[k] = members[k].length > 0 ? new BatchedExtraPool(material, CLASS_CAPS[k], members[k]) : null;
  }
  return pools;
}
