/**
 * @file spatialHash.js — Flat-Int32Array 2D spatial hash (counting-sort packed
 * cells + small loose insert buffer + tombstone removes).
 *
 * Three instances live at all times, one per live tier band (N-1, N, N+1).
 * Objects are STATIC: insert once at spawn, remove on absorb/despawn — zero
 * per-frame maintenance.
 *
 * Structure:
 *  - PACKED region: cellStart Int32Array(TABLE+1) built by counting sort;
 *    entries Int32Array(capacity) holds object indices grouped by hashed cell
 *    key; per-key range is [cellStart[key], cellStart[key+1]).
 *  - Removes tombstone the packed entry (-1) and trigger an opportunistic
 *    repack when tombstones exceed TOMBSTONE_REBUILD_FRAC of live entries.
 *  - Packed arrays cannot take O(1) inserts, so post-rebuild inserts go to a
 *    small LOOSE buffer (<= LOOSE_CAP, swap-remove); when it fills, an
 *    internal repack folds it into the packed region. queryBall scans both.
 *  - Hash key: (imul(xi, HASH_PRIME_X) ^ imul(zi, HASH_PRIME_Z)) & (TABLE-1).
 *    Key collisions only ever ADD candidates (narrowphase distance test in
 *    absorb.js filters); they never lose objects.
 *
 * Full rebuild(store, tierBand) reconstructs membership from store flags —
 * mandatory at tier-up/rescale (positions changed), also used at game reset.
 */

import {
  HASH_TABLE_SIZE,
  HASH_PRIME_X,
  HASH_PRIME_Z,
  TOMBSTONE_REBUILD_FRAC,
  STORE_CAPACITY,
} from '../config/tuning.js';
import { FLAG_ALIVE, FLAG_TOMB } from './objects.js';

const TABLE_MASK = HASH_TABLE_SIZE - 1;
/** Loose-buffer capacity: bounds the per-query loose scan; repack folds it in when full. */
const LOOSE_CAP = 256;
/** Hard clamp on scanned cells per axis (guards pathological query radii). */
const MAX_CELLS_PER_AXIS = 64;
/** Minimum tombstones before an opportunistic repack fires (avoids thrash when tiny). */
const TOMBSTONE_REBUILD_MIN = 32;

/**
 * One spatial-hash instance over a fixed cell size (sim units). All arrays
 * are preallocated for STORE_CAPACITY object indices — zero allocation after
 * construction.
 */
export class SpatialHash {
  /**
   * @param {number} cellSizeSim Cell edge length in sim units (Tier.cellSizeSim).
   */
  constructor(cellSizeSim) {
    /** @type {number} Cell edge length, sim units. queryBall callers may use cellSize*0.5 as a safe maxObjR. */
    this.cellSize = cellSizeSim;
    /** @type {number} */
    this._invCell = 1 / cellSizeSim;

    /** @type {Int32Array} Packed per-key range starts; range = [cellStart[k], cellStart[k+1]). */
    this._cellStart = new Int32Array(HASH_TABLE_SIZE + 1);
    /** @type {Int32Array} Counting-sort scratch / scatter cursors. */
    this._counts = new Int32Array(HASH_TABLE_SIZE);
    /** @type {Int32Array} Packed object indices (tombstone = -1). */
    this._entries = new Int32Array(STORE_CAPACITY);
    /** @type {Int32Array} Double buffer for repack scatter (swapped, never allocated per call). */
    this._entriesScratch = new Int32Array(STORE_CAPACITY);
    /** @type {number} Valid packed region is [0, _packedEnd). */
    this._packedEnd = 0;
    /** @type {number} Tombstoned packed entries awaiting repack. */
    this._tombstones = 0;

    /** @type {Int32Array} Object index -> position in _entries, or -1. */
    this._entryPos = new Int32Array(STORE_CAPACITY).fill(-1);
    /** @type {Int32Array} Object index -> hashed cell key (cached at insert/rebuild), or -1 if absent. */
    this._keyOf = new Int32Array(STORE_CAPACITY).fill(-1);

    /** @type {Int32Array} Loose (recently inserted, not yet packed) object indices. */
    this._loose = new Int32Array(LOOSE_CAP);
    /** @type {Int32Array} Object index -> position in _loose, or -1. */
    this._loosePos = new Int32Array(STORE_CAPACITY).fill(-1);
    /** @type {number} */
    this._looseCount = 0;

    /** @type {number} Total live membership (packed - tombstones + loose). */
    this._size = 0;

    /** @type {Int32Array} Per-query visited-key dedup scratch (cells scanned <= ~25 typical). */
    this._visited = new Int32Array(MAX_CELLS_PER_AXIS * 4);
  }

  /** Number of objects currently in the hash. @returns {number} */
  get size() {
    return this._size;
  }

  /**
   * Hash a cell coordinate pair to a table key.
   * @param {number} xi Cell x index (integer, may be negative).
   * @param {number} zi Cell z index.
   * @returns {number} Key in [0, HASH_TABLE_SIZE).
   */
  _key(xi, zi) {
    return (Math.imul(xi, HASH_PRIME_X) ^ Math.imul(zi, HASH_PRIME_Z)) & TABLE_MASK;
  }

  /**
   * Full rebuild from the object store: membership = slots with FLAG_ALIVE
   * set, FLAG_TOMB clear, and tierOf === tierBand. Counting sort into the
   * packed region; loose buffer and tombstones are cleared. Mandatory after
   * rescaleAll()/rebaseAll() (positions changed); also used at game reset.
   * @param {import('./objects.js').ObjectStore} store The SoA object store.
   * @param {number} tierBand Tier index this hash instance owns.
   * @param {number} [cellSizeCur] The band's cell size in CURRENT sim units
   *   (ScaleManager.bandCellSizeCur). Re-banding a hash MUST carry the band's
   *   cell size or queryBall's maxObjR bound (cellSize * 0.5) goes wrong.
   */
  rebuild(store, tierBand, cellSizeCur) {
    if (cellSizeCur !== undefined && cellSizeCur > 0 && cellSizeCur !== this.cellSize) {
      this.cellSize = cellSizeCur;
      this._invCell = 1 / cellSizeCur;
    }
    const cap = store.capacity;
    const flags = store.flags;
    const tierOf = store.tierOf;
    const px = store.px;
    const pz = store.pz;
    const invCell = this._invCell;
    const counts = this._counts;
    const cellStart = this._cellStart;
    const keyOf = this._keyOf;

    counts.fill(0);
    keyOf.fill(-1);
    this._entryPos.fill(-1);
    this._loosePos.fill(-1);
    this._looseCount = 0;
    this._tombstones = 0;

    // Pass 1: cache keys, count per key.
    let total = 0;
    for (let i = 0; i < cap; i++) {
      const f = flags[i];
      if ((f & FLAG_ALIVE) === 0 || (f & FLAG_TOMB) !== 0 || tierOf[i] !== tierBand) continue;
      const key = this._key(Math.floor(px[i] * invCell), Math.floor(pz[i] * invCell));
      keyOf[i] = key;
      counts[key]++;
      total++;
    }

    // Prefix sum -> cellStart; reuse counts as scatter cursors.
    let sum = 0;
    for (let k = 0; k < HASH_TABLE_SIZE; k++) {
      cellStart[k] = sum;
      sum += counts[k];
      counts[k] = cellStart[k];
    }
    cellStart[HASH_TABLE_SIZE] = sum;

    // Pass 2: scatter.
    const entries = this._entries;
    const entryPos = this._entryPos;
    for (let i = 0; i < cap; i++) {
      const key = keyOf[i];
      if (key === -1) continue;
      const pos = counts[key]++;
      entries[pos] = i;
      entryPos[i] = pos;
    }
    this._packedEnd = total;
    this._size = total;
  }

  /**
   * Insert an object at (x, z) sim units. O(1): appends to the loose buffer
   * (folded into the packed region by an internal repack when full).
   * Re-inserting an index already present moves it (remove + insert).
   * @param {number} i Object store index.
   * @param {number} x Sim-space x.
   * @param {number} z Sim-space z.
   */
  insert(i, x, z) {
    if (this._keyOf[i] !== -1) this.remove(i); // defensive re-insert = move
    if (this._looseCount === LOOSE_CAP) this._repack();
    const key = this._key(Math.floor(x * this._invCell), Math.floor(z * this._invCell));
    this._keyOf[i] = key;
    this._loosePos[i] = this._looseCount;
    this._loose[this._looseCount++] = i;
    this._size++;
  }

  /**
   * Remove an object. Loose entries are swap-removed; packed entries are
   * tombstoned (-1) with an opportunistic repack past TOMBSTONE_REBUILD_FRAC.
   * No-op if the index is not present.
   * @param {number} i Object store index.
   */
  remove(i) {
    if (this._keyOf[i] === -1) return;
    this._keyOf[i] = -1;

    const lp = this._loosePos[i];
    if (lp !== -1) {
      const last = --this._looseCount;
      const moved = this._loose[last];
      this._loose[lp] = moved;
      if (moved !== i) this._loosePos[moved] = lp;
      this._loosePos[i] = -1;
      this._size--;
      return;
    }

    const ep = this._entryPos[i];
    if (ep === -1) return;
    this._entries[ep] = -1;
    this._entryPos[i] = -1;
    this._tombstones++;
    this._size--;

    if (
      this._tombstones > TOMBSTONE_REBUILD_MIN &&
      this._tombstones > TOMBSTONE_REBUILD_FRAC * (this._size + this._tombstones)
    ) {
      this._repack();
    }
  }

  /**
   * Internal repack: counting-sort the surviving packed entries + loose buffer
   * into the scratch entries array (cached keys, no store access), then swap
   * buffers. O(table + entries), zero allocation.
   */
  _repack() {
    const counts = this._counts;
    const cellStart = this._cellStart;
    const src = this._entries;
    const dst = this._entriesScratch;
    const keyOf = this._keyOf;
    const entryPos = this._entryPos;
    const loose = this._loose;
    const looseCount = this._looseCount;
    const packedEnd = this._packedEnd;

    counts.fill(0);
    let total = 0;
    for (let p = 0; p < packedEnd; p++) {
      const i = src[p];
      if (i === -1) continue;
      counts[keyOf[i]]++;
      total++;
    }
    for (let l = 0; l < looseCount; l++) {
      counts[keyOf[loose[l]]]++;
      total++;
    }

    let sum = 0;
    for (let k = 0; k < HASH_TABLE_SIZE; k++) {
      cellStart[k] = sum;
      sum += counts[k];
      counts[k] = cellStart[k];
    }
    cellStart[HASH_TABLE_SIZE] = sum;

    for (let p = 0; p < packedEnd; p++) {
      const i = src[p];
      if (i === -1) continue;
      const pos = counts[keyOf[i]]++;
      dst[pos] = i;
      entryPos[i] = pos;
    }
    for (let l = 0; l < looseCount; l++) {
      const i = loose[l];
      const pos = counts[keyOf[i]]++;
      dst[pos] = i;
      entryPos[i] = pos;
      this._loosePos[i] = -1;
    }

    this._entries = dst;
    this._entriesScratch = src;
    this._packedEnd = total;
    this._looseCount = 0;
    this._tombstones = 0;
  }

  /**
   * Collect candidate object indices whose cells overlap the ball's reach.
   * Scans cells covering [x +- (r + maxObjR), z +- (r + maxObjR)] with
   * per-query key dedup (hash collisions between scanned cells), then the
   * loose buffer (key-matched). Over-inclusive on key collisions — caller
   * MUST narrowphase with a real distance test. y is accepted for signature
   * symmetry but unused (2D hash). Zero allocation.
   * @param {number} x Ball center x, sim units.
   * @param {number} y Ball center y (unused).
   * @param {number} z Ball center z, sim units.
   * @param {number} r Ball radius, sim units.
   * @param {number} maxObjR Largest possible object radius in this band (use hash.cellSize * 0.5 as a safe bound).
   * @param {Int32Array} outI32 Preallocated output; results are clamped to its length.
   * @returns {number} Number of candidate indices written to outI32.
   */
  queryBall(x, y, z, r, maxObjR, outI32) {
    const reach = r + maxObjR;
    const invCell = this._invCell;
    let x0 = Math.floor((x - reach) * invCell);
    let x1 = Math.floor((x + reach) * invCell);
    let z0 = Math.floor((z - reach) * invCell);
    let z1 = Math.floor((z + reach) * invCell);
    // Pathological query radii: clamp CENTERED on the ball cell (a one-sided
    // clamp would scan a rect offset from the ball and miss near contacts).
    const half = MAX_CELLS_PER_AXIS >> 1;
    if (x1 - x0 >= MAX_CELLS_PER_AXIS) {
      const cx = Math.floor(x * invCell);
      x0 = cx - half + 1;
      x1 = cx + half;
    }
    if (z1 - z0 >= MAX_CELLS_PER_AXIS) {
      const cz = Math.floor(z * invCell);
      z0 = cz - half + 1;
      z1 = cz + half;
    }

    const visited = this._visited;
    const cellStart = this._cellStart;
    const entries = this._entries;
    const outCap = outI32.length;
    let visitedCount = 0;
    let visitedSat = false; // dedup scratch overflowed — loose pass must be over-inclusive
    let count = 0;

    for (let zi = z0; zi <= z1; zi++) {
      for (let xi = x0; xi <= x1; xi++) {
        const key = this._key(xi, zi);
        let seen = false;
        for (let v = 0; v < visitedCount; v++) {
          if (visited[v] === key) {
            seen = true;
            break;
          }
        }
        if (seen) continue;
        if (visitedCount < visited.length) visited[visitedCount++] = key;
        else visitedSat = true;

        const end = cellStart[key + 1];
        for (let p = cellStart[key]; p < end; p++) {
          const i = entries[p];
          if (i === -1) continue;
          if (count >= outCap) return count;
          outI32[count++] = i;
        }
      }
    }

    // Loose buffer: include entries whose cached key matches a scanned key.
    // If the visited scratch saturated, keys may be missing from it — fall
    // back to including ALL loose entries (over-inclusive is allowed; the
    // caller narrowphases) so touching objects are never silently dropped.
    const loose = this._loose;
    const keyOf = this._keyOf;
    const looseCount = this._looseCount;
    for (let l = 0; l < looseCount; l++) {
      const i = loose[l];
      if (visitedSat) {
        if (count >= outCap) return count;
        outI32[count++] = i;
        continue;
      }
      const key = keyOf[i];
      for (let v = 0; v < visitedCount; v++) {
        if (visited[v] === key) {
          if (count >= outCap) return count;
          outI32[count++] = i;
          break;
        }
      }
    }
    return count;
  }

  /** Empty the hash completely (game reset without a store pass). */
  clear() {
    this._cellStart.fill(0);
    this._keyOf.fill(-1);
    this._entryPos.fill(-1);
    this._loosePos.fill(-1);
    this._packedEnd = 0;
    this._looseCount = 0;
    this._tombstones = 0;
    this._size = 0;
  }
}
