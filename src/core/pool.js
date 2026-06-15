/**
 * @file pool.js — Free-list index allocator + ring-buffer helpers over typed arrays.
 *
 * Used by ObjectStore (SoA slots), InstancedPool (instance slots) and the
 * spawner's amortized spawn/despawn queues. Zero allocation after construction.
 */

/**
 * LIFO free-list index allocator over a fixed capacity. alloc() pops an index,
 * free() pushes it back. First allocations come out 0, 1, 2, ...
 */
export class FreeList {
  /** @param {number} capacity Total number of slots. */
  constructor(capacity) {
    /** @type {number} */
    this.capacity = capacity;
    /** @type {Int32Array} Stack of free indices; valid entries are [0, _top). */
    this._stack = new Int32Array(capacity);
    /** @type {number} */
    this._top = capacity;
    for (let i = 0; i < capacity; i++) this._stack[i] = capacity - 1 - i;
  }

  /** Number of currently allocated slots. @returns {number} */
  get allocatedCount() {
    return this.capacity - this._top;
  }

  /**
   * Allocate a slot index.
   * @returns {number} Slot index, or -1 if exhausted.
   */
  alloc() {
    if (this._top === 0) return -1;
    this._top--;
    return this._stack[this._top];
  }

  /**
   * Return a slot to the pool. Caller guarantees no double-free (the SoA
   * flags byte is the alive/dead source of truth).
   * @param {number} index Previously allocated slot index.
   */
  free(index) {
    this._stack[this._top] = index;
    this._top++;
  }

  /** Reset to fully-free state (game reset). */
  reset() {
    this._top = this.capacity;
    for (let i = 0; i < this.capacity; i++) this._stack[i] = this.capacity - 1 - i;
  }
}

/**
 * Fixed-capacity FIFO ring buffer of NON-NEGATIVE int32 values (object/chunk
 * queue entries). Capacity is rounded up to a power of two for mask indexing.
 * Returns -1 on empty — stored values MUST be >= 0.
 */
export class IntRing {
  /** @param {number} capacity Minimum capacity (rounded up to power of two). */
  constructor(capacity) {
    let cap = 1;
    while (cap < capacity) cap <<= 1;
    /** @type {number} Actual (power-of-two) capacity. */
    this.capacity = cap;
    /** @type {Int32Array} */
    this._buf = new Int32Array(cap);
    /** @type {number} */
    this._mask = cap - 1;
    /** @type {number} Monotonic read cursor. */
    this._head = 0;
    /** @type {number} Monotonic write cursor. */
    this._tail = 0;
  }

  /** Number of queued values. @returns {number} */
  get length() {
    return this._tail - this._head;
  }

  /**
   * Enqueue a value.
   * @param {number} value Non-negative int32.
   * @returns {boolean} False if the ring is full (caller must handle, e.g. retry next frame).
   */
  push(value) {
    if (this._tail - this._head === this.capacity) return false;
    this._buf[this._tail & this._mask] = value;
    this._tail++;
    return true;
  }

  /**
   * Dequeue the oldest value.
   * @returns {number} The value, or -1 if empty.
   */
  shift() {
    if (this._head === this._tail) return -1;
    const v = this._buf[this._head & this._mask];
    this._head++;
    return v;
  }

  /**
   * Peek the oldest value without removing it.
   * @returns {number} The value, or -1 if empty.
   */
  peek() {
    if (this._head === this._tail) return -1;
    return this._buf[this._head & this._mask];
  }

  /** Drop all queued values. */
  clear() {
    this._head = 0;
    this._tail = 0;
  }
}
