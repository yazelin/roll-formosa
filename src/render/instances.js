/**
 * @file instances.js — InstancedPool: one InstancedMesh per (archetype, tier
 * band) for world objects, and per archetype family for ball-stuck pools.
 *
 * Mechanics (DESIGN.md レンダリング):
 * - free-list slots; dead/hidden slots get a ZERO-SCALE matrix; mesh.count
 *   stays at the high-water mark while ANY slot is live (degenerate tris are
 *   pre-raster rejected), and collapses to 0 + mesh.visible=false the moment
 *   the pool fully drains — empty pools never cost a draw call.
 * - all spawn/fade/despawn transitions animate per-instance matrix SCALE,
 *   never material opacity (one opaque shader program, no sorting).
 * - instanceMatrix/instanceColor use DynamicDrawUsage + r177 updateRanges
 *   partial uploads; needsUpdate at most ONCE per mesh per frame via flush().
 * - frustumCulled = false (culling is gameplay-driven: spawn ring + fog).
 * - rewriteAll()/rescaleAll() rewrite every live slot in one tight loop for
 *   the one-frame similarity rescale (single full-range upload).
 *
 * Per-frame protocol (call order matters):
 *   pool.update(dt)   — steps scale-fade animators (writes matrices)
 *   ...gameplay writes (setTransform/fadeIn/fadeOut, <= INSTANCE_WRITE_BUDGET
 *      spawner-driven writes per frame — budget enforced by callers)...
 *   pool.flush()      — one needsUpdate + updateRanges per dirty attribute
 * or use the updateAndFlushPools(pools, dt) helper from main.js step 7.
 *
 * Zero-allocation: all state lives in preallocated typed arrays; matrices are
 * composed scalar-wise straight into instanceMatrix.array.
 *
 * v4 (docs/DESIGN-V4.md レンダリング統合): setTransform gains an OPTIONAL
 * non-uniform scale overload `setTransform(slot, pos, quat, s, sy = s,
 * sz = s)` — existing 4-arg callers are byte-identical in behavior (uniform).
 * Fade animators store and multiply the full scale TRIPLE; rescaleAll(S)
 * multiplies all three axes (a similarity stays a similarity). NOTE for
 * non-uniform users: radius/size semantics must come from the ObjectStore,
 * NEVER be derived from matrix scale magnitude (Stream R audit item), and
 * non-uniformly scaled geometry must keep axis-aligned normals (InstancedMesh
 * applies no inverse-transpose) — see render/extraPools.js header.
 */

import * as THREE from 'three';
import { FreeList } from '../core/pool.js';
import { easeOutCubic } from '../core/mathUtils.js';

/** Module-level scratch color (setColor). */
const _COLOR = new THREE.Color();

/** Fade modes. */
const FADE_NONE = 0;
const FADE_IN = 1;
const FADE_OUT = 2;

/** @type {THREE.MeshLambertMaterial|null} */
let _sharedMaterial = null;

/**
 * THE single shared object material (DESIGN.md: exactly one
 * MeshLambertMaterial({vertexColors:true}) for all objects + ball).
 * Lazily created singleton — pass this to every InstancedPool.
 * @returns {THREE.MeshLambertMaterial}
 */
export function getSharedObjectMaterial() {
  if (_sharedMaterial === null) {
    _sharedMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });
  }
  return _sharedMaterial;
}

/**
 * Fixed-capacity instanced pool over one InstancedMesh.
 *
 * Frozen interface (DESIGN.md モジュール間インターフェース):
 *   new InstancedPool(geometry, material, capacity)
 *   alloc():slot|-1; free(slot); setTransform(slot,pos,quat,scale);
 *   setColor(slot,hex); fadeIn(slot,s); fadeOut(slot,s);
 *   rewriteAll(fn); flush()
 *
 * NOTE fadeOut() AUTO-FREES the slot when the fade completes (zero-scale +
 * free-list reclaim). Callers free their store/hash entries immediately at
 * despawn and let the pool finish the visual fade on its own.
 */
export class InstancedPool {
  /**
   * @param {THREE.BufferGeometry} geometry Shared archetype geometry (unit bounding radius).
   * @param {THREE.Material} material Shared material (getSharedObjectMaterial()).
   * @param {number} capacity Max simultaneous instances (128-512 typical).
   */
  constructor(geometry, material, capacity) {
    /** @type {number} */
    this.capacity = capacity;

    /** @type {THREE.InstancedMesh} Add to scene (world pools) or ballGroup (stuck pools). */
    this.mesh = new THREE.InstancedMesh(geometry, material, capacity);
    this.mesh.count = 0;
    this.mesh.visible = false; // empty pools must not cost a draw call
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Eager instanceColor (default white) so the shader program never rebuilds.
    const colors = new Float32Array(capacity * 3);
    colors.fill(1);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

    /** @type {FreeList} */
    this._free = new FreeList(capacity);
    /** @type {number} High-water mark — mesh.count tracks it while live; resets when the pool drains. */
    this._highWater = 0;

    /* --- per-slot TRS store (source of truth for matrix recomposition) --- */
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
    /** @type {Float32Array} Current fade factor written into the matrix (0..1). */ this._curF = new Float32Array(capacity);
    /** @type {Uint8Array} 1 = allocated. */ this._alive = new Uint8Array(capacity);

    /* --- fade animator state --- */
    /** @type {Uint8Array} FADE_NONE/IN/OUT. */ this._fadeMode = new Uint8Array(capacity);
    /** @type {Float32Array} Elapsed (s). */ this._fadeT = new Float32Array(capacity);
    /** @type {Float32Array} Duration (s). */ this._fadeDur = new Float32Array(capacity);
    /** @type {Float32Array} Factor at fade-out start. */ this._fadeStartF = new Float32Array(capacity);
    /** @type {Int32Array} Compact list of fading slots. */ this._fadeList = new Int32Array(capacity);
    /** @type {Int32Array} slot -> index in _fadeList, -1 if none. */ this._fadeIdx = new Int32Array(capacity);
    this._fadeIdx.fill(-1);
    /** @type {number} */ this._fadeCount = 0;

    /* --- dirty ranges (slot indices; -1 = clean) --- */
    /** @type {number} */ this._dirtyMin = -1;
    /** @type {number} */ this._dirtyMax = -1;
    /** @type {number} */ this._colorDirtyMin = -1;
    /** @type {number} */ this._colorDirtyMax = -1;
  }

  /** Number of currently allocated slots. @returns {number} */
  get allocatedCount() {
    return this._free.allocatedCount;
  }

  /**
   * Allocate an instance slot. The slot starts INVISIBLE (zero matrix from
   * construction / previous free()) — call setTransform (+ optional fadeIn).
   * @returns {number} Slot index, or -1 if the pool is exhausted.
   */
  alloc() {
    const slot = this._free.alloc();
    if (slot === -1) return -1;
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
    if (slot + 1 > this._highWater) {
      this._highWater = slot + 1;
      this.mesh.count = this._highWater;
    }
    if (!this.mesh.visible) this.mesh.visible = true; // first live instance
    return slot;
  }

  /**
   * Kill a slot immediately: zero-scale matrix + free-list reclaim. Cancels
   * any running fade. Idempotent for already-free slots.
   * @param {number} slot
   */
  free(slot) {
    if (this._alive[slot] === 0) return;
    if (this._fadeIdx[slot] !== -1) this._removeFadeAt(this._fadeIdx[slot], slot);
    this._alive[slot] = 0;
    this._fadeMode[slot] = FADE_NONE;
    this._curF[slot] = 0;
    this._zeroMatrix(slot);
    this._free.free(slot);
    if (this._free.allocatedCount === 0) {
      // Fully drained: shed the draw call AND the high-water mark so old-band
      // pools stop costing degenerate-instance vertex work for the whole run.
      this._highWater = 0;
      this.mesh.count = 0;
      this.mesh.visible = false;
    }
  }

  /**
   * Set a slot's TRS (stored, then composed straight into instanceMatrix at
   * the current fade factor). pos/quat are copied — caller keeps ownership.
   * v4: optional non-uniform scale (sy, sz) — defaults keep the uniform
   * behavior byte-identical for every existing 4-arg caller.
   * @param {number} slot
   * @param {THREE.Vector3} pos
   * @param {THREE.Quaternion} quat
   * @param {number} scale Base scale X (uniform callers: = bounding radius for unit-radius geometry).
   * @param {number} [sy=scale] Base scale Y (v4 non-uniform overload).
   * @param {number} [sz=scale] Base scale Z (v4 non-uniform overload).
   */
  setTransform(slot, pos, quat, scale, sy = scale, sz = scale) {
    this._px[slot] = pos.x;
    this._py[slot] = pos.y;
    this._pz[slot] = pos.z;
    this._qx[slot] = quat.x;
    this._qy[slot] = quat.y;
    this._qz[slot] = quat.z;
    this._qw[slot] = quat.w;
    this._scale[slot] = scale;
    this._scaleY[slot] = sy;
    this._scaleZ[slot] = sz;
    this._writeMatrix(slot, this._factorOf(slot));
  }

  /**
   * Set a slot's instanceColor tint.
   * @param {number} slot
   * @param {number} hex e.g. 0xffcc88 (palette tint from the catalog).
   */
  setColor(slot, hex) {
    _COLOR.setHex(hex);
    const arr = this.mesh.instanceColor.array;
    const base = slot * 3;
    arr[base] = _COLOR.r;
    arr[base + 1] = _COLOR.g;
    arr[base + 2] = _COLOR.b;
    if (this._colorDirtyMin === -1 || slot < this._colorDirtyMin) this._colorDirtyMin = slot;
    if (slot > this._colorDirtyMax) this._colorDirtyMax = slot;
  }

  /**
   * Animate the slot's scale 0 -> base over `seconds` (ease-out cubic).
   * Used for spawns that land inside fog range (SPAWN_FADE_S).
   * @param {number} slot
   * @param {number} seconds
   */
  fadeIn(slot, seconds) {
    if (this._alive[slot] === 0) return;
    if (seconds <= 0) {
      this._cancelFade(slot);
      this._writeMatrix(slot, 1);
      return;
    }
    this._fadeMode[slot] = FADE_IN;
    this._fadeT[slot] = 0;
    this._fadeDur[slot] = seconds;
    this._addFade(slot);
    this._writeMatrix(slot, 0);
  }

  /**
   * Animate the slot's scale current -> 0 over `seconds`, then AUTO-FREE the
   * slot. Used for ring-exit despawn (DESPAWN_FADE_S) and sub-pixel cleanup
   * (SUBPIXEL_FADE_S). The caller must drop its own reference to the slot
   * immediately (store/hash removal happens at despawn time, not fade end).
   * @param {number} slot
   * @param {number} seconds
   */
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
    this._addFade(slot);
  }

  /**
   * Step fade animators by dt. Call once per render frame BEFORE flush().
   * Active-fade cohort is bounded by the spawn/despawn budgets, so per-frame
   * matrix writes here stay small.
   * @param {number} dt Frame delta (s).
   */
  update(dt) {
    for (let i = this._fadeCount - 1; i >= 0; i--) {
      const slot = this._fadeList[i];
      this._fadeT[slot] += dt;
      const t01 = this._fadeT[slot] / this._fadeDur[slot];
      const mode = this._fadeMode[slot];
      if (t01 >= 1) {
        this._removeFadeAt(i, slot);
        this._fadeMode[slot] = FADE_NONE;
        if (mode === FADE_OUT) {
          this.free(slot); // zero-scale + reclaim
        } else {
          this._writeMatrix(slot, 1);
        }
      } else if (mode === FADE_IN) {
        this._writeMatrix(slot, easeOutCubic(t01));
      } else {
        const u = 1 - t01;
        this._writeMatrix(slot, this._fadeStartF[slot] * u * u * u);
      }
    }
  }

  /**
   * RESCALE ONLY: invoke fn(slot, pool) for every live slot, then mark the
   * full live range dirty (one full-range upload at the next flush()).
   * fn typically mutates via setTransform(). Prefer rescaleAll(S) for the
   * standard similarity transform — it is a single tight loop.
   * @param {(slot: number, pool: InstancedPool) => void} fn
   */
  rewriteAll(fn) {
    for (let slot = 0; slot < this._highWater; slot++) {
      if (this._alive[slot] === 1) fn(slot, this);
    }
    if (this._highWater > 0) {
      this._dirtyMin = 0;
      this._dirtyMax = this._highWater - 1;
    }
  }

  /**
   * The one-frame similarity rescale: position *= S, base scale TRIPLE *= S
   * for every live slot, matrices recomposed in place at the current fade
   * factor. Quaternions and fade state are scale-free. A uniform similarity
   * composed with a non-uniform base scale stays pixel-identical (the triple
   * scales together). Full-range upload on flush().
   * @param {number} S RESCALE_S (0.2).
   */
  rescaleAll(S) {
    for (let slot = 0; slot < this._highWater; slot++) {
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

  /**
   * Floating-origin rebase (ScaleManager.maybeRebase): subtract (sx, sz) from
   * every live slot's translation — both the TRS store and matrix elements
   * 12/14 directly. Quaternions, scales and fade factors are shift-invariant,
   * so no recomposition is needed. Full-range upload on flush().
   * @param {number} sx Integer-snapped X shift, sim units.
   * @param {number} sz Integer-snapped Z shift, sim units.
   */
  rebaseAll(sx, sz) {
    const te = this.mesh.instanceMatrix.array;
    for (let slot = 0; slot < this._highWater; slot++) {
      if (this._alive[slot] === 0) continue;
      this._px[slot] -= sx;
      this._pz[slot] -= sz;
      te[slot * 16 + 12] -= sx;
      te[slot * 16 + 14] -= sz;
    }
    if (this._highWater > 0) {
      this._dirtyMin = 0;
      this._dirtyMax = this._highWater - 1;
    }
  }

  /**
   * Upload dirty attribute ranges: at most ONE needsUpdate per attribute per
   * frame, with r177 updateRanges partial uploads. Call once per render frame
   * (main.js step 7), after update() and all gameplay writes.
   */
  flush() {
    if (this._dirtyMin !== -1) {
      const attr = this.mesh.instanceMatrix;
      attr.clearUpdateRanges();
      attr.addUpdateRange(this._dirtyMin * 16, (this._dirtyMax - this._dirtyMin + 1) * 16);
      attr.needsUpdate = true;
      this._dirtyMin = -1;
      this._dirtyMax = -1;
    }
    if (this._colorDirtyMin !== -1) {
      const attr = this.mesh.instanceColor;
      attr.clearUpdateRanges();
      attr.addUpdateRange(this._colorDirtyMin * 3, (this._colorDirtyMax - this._colorDirtyMin + 1) * 3);
      attr.needsUpdate = true;
      this._colorDirtyMin = -1;
      this._colorDirtyMax = -1;
    }
  }

  /** Full reset (game reset): all slots freed, count 0, fades cleared. */
  reset() {
    const m = this.mesh.instanceMatrix.array;
    for (let i = 0; i < this._highWater * 16; i++) m[i] = 0;
    this._alive.fill(0);
    this._fadeMode.fill(FADE_NONE);
    this._fadeIdx.fill(-1);
    this._fadeCount = 0;
    this._free.reset();
    this._highWater = 0;
    this.mesh.count = 0;
    this.mesh.visible = false;
    this._dirtyMin = -1;
    this._dirtyMax = -1;
    this._colorDirtyMin = -1;
    this._colorDirtyMax = -1;
  }

  /** Release GPU buffers (teardown only — geometry/material are shared, not disposed). */
  dispose() {
    this.mesh.dispose();
  }

  /* ------------------------------------------------------------------ */
  /* Internals                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Current fade factor of a slot (1 when not fading).
   * @param {number} slot @returns {number}
   */
  _factorOf(slot) {
    const mode = this._fadeMode[slot];
    if (mode === FADE_NONE) return 1;
    const t01 = this._fadeT[slot] / this._fadeDur[slot];
    if (mode === FADE_IN) return t01 >= 1 ? 1 : easeOutCubic(t01);
    const u = 1 - (t01 >= 1 ? 1 : t01);
    return this._fadeStartF[slot] * u * u * u;
  }

  /** @param {number} slot */
  _cancelFade(slot) {
    if (this._fadeIdx[slot] !== -1) this._removeFadeAt(this._fadeIdx[slot], slot);
    this._fadeMode[slot] = FADE_NONE;
  }

  /** @param {number} slot */
  _addFade(slot) {
    if (this._fadeIdx[slot] !== -1) return; // already in list — state fields were just rewritten
    this._fadeList[this._fadeCount] = slot;
    this._fadeIdx[slot] = this._fadeCount;
    this._fadeCount++;
  }

  /**
   * Swap-remove from the active-fade list.
   * @param {number} i    Index in _fadeList.
   * @param {number} slot The slot at that index.
   */
  _removeFadeAt(i, slot) {
    const last = this._fadeCount - 1;
    const moved = this._fadeList[last];
    this._fadeList[i] = moved;
    this._fadeIdx[moved] = i;
    this._fadeIdx[slot] = -1;
    this._fadeCount = last;
  }

  /**
   * Compose TRS (scale triple * fade factor) straight into
   * instanceMatrix.array — zero allocation, column-major like Matrix4.compose
   * (column k scaled by axis k, exactly what compose(pos, quat, scale) does).
   * @param {number} slot
   * @param {number} factor Fade factor 0..1.
   */
  _writeMatrix(slot, factor) {
    this._curF[slot] = factor;
    const sx = this._scale[slot] * factor;
    const sy = this._scaleY[slot] * factor;
    const sz = this._scaleZ[slot] * factor;
    const x = this._qx[slot], y = this._qy[slot], z = this._qz[slot], w = this._qw[slot];
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const te = this.mesh.instanceMatrix.array;
    const o = slot * 16;
    te[o] = (1 - (yy + zz)) * sx;
    te[o + 1] = (xy + wz) * sx;
    te[o + 2] = (xz - wy) * sx;
    te[o + 3] = 0;
    te[o + 4] = (xy - wz) * sy;
    te[o + 5] = (1 - (xx + zz)) * sy;
    te[o + 6] = (yz + wx) * sy;
    te[o + 7] = 0;
    te[o + 8] = (xz + wy) * sz;
    te[o + 9] = (yz - wx) * sz;
    te[o + 10] = (1 - (xx + yy)) * sz;
    te[o + 11] = 0;
    te[o + 12] = this._px[slot];
    te[o + 13] = this._py[slot];
    te[o + 14] = this._pz[slot];
    te[o + 15] = 1;
    this._markDirty(slot);
  }

  /**
   * Write the degenerate zero matrix (pre-raster rejected — invisible).
   * @param {number} slot
   */
  _zeroMatrix(slot) {
    const te = this.mesh.instanceMatrix.array;
    const o = slot * 16;
    for (let i = 0; i < 16; i++) te[o + i] = 0;
    te[o + 15] = 1;
    this._markDirty(slot);
  }

  /** @param {number} slot */
  _markDirty(slot) {
    if (this._dirtyMin === -1 || slot < this._dirtyMin) this._dirtyMin = slot;
    if (slot > this._dirtyMax) this._dirtyMax = slot;
  }
}

/**
 * Helper for main.js step 7: step + flush a flat array of pools in one call.
 * Plain indexed loop — zero allocation.
 * @param {InstancedPool[]} pools
 * @param {number} dt Frame delta (s).
 */
export function updateAndFlushPools(pools, dt) {
  for (let i = 0; i < pools.length; i++) {
    pools[i].update(dt);
    pools[i].flush();
  }
}
