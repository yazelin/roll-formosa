/**
 * @file cityMap.js — Taipei pack cityMap stub (P3).
 *
 * Re-exports the entire Tokyo cityMap namespace as a placeholder so the
 * engine's P2.5 seam reads can resolve. P6 replaces this with a real
 * Taipei cityMap (北門 → 台北 101 goal anchor, Taipei positions, zh-TW
 * DEV_STARTS keys: shop / night-market / arcade / scooter-sea / wanhua /
 * xinyi / goal).
 *
 * Exporting `* as cityMap` is NOT valid in JS (re-exporting a namespace
 * as a named binding requires an explicit import), so we re-export the
 * named cityMap members the engine reads, and the pack index assembles
 * them into the cityMap namespace object.
 */
export * from '../../config/cityMap.js';
