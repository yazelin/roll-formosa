/**
 * @file rng.js — mulberry32 seeded PRNG + integer hash for deterministic chunk seeding.
 *
 * Same (worldSeed, cx, cz, tier) ALWAYS regenerates the identical chunk —
 * the foundation of the deterministic spawner (DESIGN.md スポーン / カタログ).
 * Chunk coordinates are kept in ORIGIN-UNSHIFTED global coords so determinism
 * survives floating-origin rebases.
 */

/**
 * mulberry32 — fast 32-bit seeded PRNG, excellent distribution for game use.
 * @param {number} seed Any number; truncated to uint32.
 * @returns {() => number} Generator returning floats in [0, 1).
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Avalanche integer hash of (seed, cx, cz, tier) -> uint32, suitable as a
 * mulberry32 seed for one chunk. Handles negative chunk coordinates.
 * @param {number} seed World seed (uint32).
 * @param {number} cx   Chunk x coordinate (integer, may be negative).
 * @param {number} cz   Chunk z coordinate (integer, may be negative).
 * @param {number} tier Tier index 0..5.
 * @returns {number} uint32 hash.
 */
export function hash(seed, cx, cz, tier) {
  let h = (seed >>> 0) ^ Math.imul(cx | 0, 0x27d4eb2f) ^ Math.imul(cz | 0, 0x165667b1) ^ Math.imul((tier + 1) | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * Resolve the world seed: ?seed= URL param if present, else Date.now().
 * Shown on the win screen for shareable runs.
 * @param {string} [search] Override of location.search (for tests).
 * @returns {number} uint32 world seed.
 */
export function resolveWorldSeed(search) {
  const s = search !== undefined ? search : (typeof location !== 'undefined' ? location.search : '');
  const m = /[?&]seed=(\d+)/.exec(s);
  if (m !== null) return Number(m[1]) >>> 0;
  return Date.now() >>> 0;
}
