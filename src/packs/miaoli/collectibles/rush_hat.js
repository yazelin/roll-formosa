/**
 * @file packs/miaoli/collectibles/rush_hat.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_RUSH_HAT — 藺草帽 (rush-woven traditional hat). Silhouette: a classic
 * woven straw hat made from rush grass (藺草), a traditional craft from Yuanli
 * Township (苑裡鎮) in Miaoli. The hat has a wide circular brim, a rounded
 * crown, and visible woven texture bands. Reads unmistakably as "woven hat"
 * at thumbnail size: flat wide brim + domed top + natural straw color.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * straw tint, never structure.
 */

import { cyl, sph, torus, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — natural rush/straw tones. */
const STRAW = 0xd8c8a0; // natural rush straw color
const STRAW_HI = 0xe8d8b0; // lighter straw highlight
const STRAW_LO = 0xc8b890; // darker woven bands
const BAND = 0x8a7a60; // decorative band
const INNER = 0xc0b088; // inner hat color

export const COL_RUSH_HAT = {
  id: 'rush_hat',
  name: '藺草帽',
  colorHex: 0xd8c8a0, // natural straw — the body read color

  /**
   * Build the rush hat geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (straw tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030302); // tiny per-instance straw tint
    const straw = STRAW + t;
    const parts = [];

    // --- BRIM: wide flat circular brim with slight upward curve at edge ---
    // Main brim surface
    parts.push(cyl(1.2, 0.6, 0.08, 10, straw, { y: 0.0, hex2: STRAW_HI }));
    // Underside of brim (slightly darker)
    parts.push(cyl(1.15, 0.58, 0.06, 10, STRAW_LO, { y: -0.04 }));
    // Outer edge of brim - slightly raised
    parts.push(torus(1.1, 0.06, 4, 10, STRAW_HI, { y: 0.02, rx: PI / 2 }));

    // --- CROWN: rounded dome top ---
    // Main crown dome
    parts.push(sph(0.55, straw, {
      ws: 7,
      hs: 4,
      sy: 0.75,
      thetaLen: PI * 0.5,
      y: 0.35,
      hex2: STRAW_HI,
    }));
    // Crown-to-brim transition
    parts.push(cyl(0.6, 0.55, 0.2, 8, straw, { y: 0.1, hex2: STRAW_LO }));

    // --- WOVEN TEXTURE: horizontal bands suggesting weave pattern ---
    // Two thin darker bands around the crown
    parts.push(cyl(0.58, 0.58, 0.04, 8, STRAW_LO, { y: 0.2, open: true }));
    parts.push(cyl(0.45, 0.45, 0.04, 8, STRAW_LO, { y: 0.42, open: true }));

    // --- DECORATIVE BAND: ribbon or band around crown base ---
    parts.push(cyl(0.62, 0.62, 0.12, 8, BAND, { y: 0.08, open: true }));

    // --- TOP BUTTON: small decorative element at crown apex ---
    parts.push(sph(0.08, BAND, { ws: 4, hs: 3, y: 0.68 }));

    return finish(parts);
  },
};

export default COL_RUSH_HAT;
