/**
 * @file packs/miaoli/collectibles/leicha.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_LEICHA — 客家擂茶 (Hakka pounded tea). Silhouette: a traditional ceramic
 * mortar bowl (擂缽) with rough ridged interior, filled with green-brown pounded
 * tea paste, and a wooden pestle (擂棍) resting diagonally in the bowl. The bowl
 * is wide and shallow with a dark brown exterior; the pestle is a long wooden
 * stick. Reads unmistakably as "Hakka tea grinding set" at thumbnail size.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the tea
 * color tint, never structure.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — ceramic bowl, tea paste, wooden pestle. */
const BOWL_OUT = 0x5a4030; // dark brown ceramic exterior
const BOWL_IN = 0x8a7060; // lighter interior with ridges
const TEA = 0x6a8a50; // green-brown pounded tea paste
const TEA_HI = 0x7a9a60; // lighter tea surface
const PESTLE = 0x9a7a50; // warm wood pestle
const PESTLE_HI = 0xb08a5a; // lighter wood highlight

export const COL_LEICHA = {
  id: 'leicha',
  name: '客家擂茶',
  colorHex: 0x6a8a50, // green-brown tea paste — the body read color

  /**
   * Build the leicha set geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (tea tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030302); // tiny per-instance tea tint nudge
    const tea = TEA + t;
    const parts = [];

    // --- BOWL: wide shallow mortar bowl (擂缽) ---
    // Outer wall: tapered cylinder, wider at top
    parts.push(cyl(1.0, 0.7, 0.7, 12, BOWL_OUT, { y: 0.0, hex2: 0x6a5040 }));
    // Inner wall: slightly smaller, lighter color for ridged interior
    parts.push(cyl(0.88, 0.58, 0.6, 12, BOWL_IN, { y: 0.05, hex2: 0x9a8070 }));
    // Bowl rim: thick lip at the top
    parts.push(cyl(1.0, 0.92, 0.1, 14, BOWL_OUT, { y: 0.35 }));
    // Bowl base: flat bottom
    parts.push(cyl(0.5, 0.5, 0.08, 10, BOWL_OUT, { y: -0.32 }));

    // --- TEA PASTE: green-brown pounded tea filling the bowl ---
    parts.push(cyl(0.78, 0.78, 0.25, 10, tea, { y: 0.08, hex2: TEA_HI }));
    // Slightly domed surface
    parts.push(sph(0.78, TEA_HI, { ws: 8, hs: 3, sy: 0.2, thetaLen: PI * 0.5, y: 0.2 }));

    // --- PESTLE: wooden grinding stick (擂棍) resting diagonally ---
    // Long cylindrical pestle tilted in the bowl
    parts.push(cyl(0.12, 0.1, 1.8, 6, PESTLE, {
      y: 0.7,
      z: 0.1,
      rx: 0.5,
      rz: 0.3,
      hex2: PESTLE_HI,
    }));
    // Rounded tip at the grinding end
    parts.push(sph(0.13, PESTLE, {
      ws: 5,
      hs: 4,
      y: 0.18,
      z: -0.32,
      hex2: PESTLE_HI,
    }));
    // Slightly thicker handle end
    parts.push(sph(0.14, PESTLE_HI, {
      ws: 5,
      hs: 4,
      y: 1.22,
      z: 0.52,
    }));

    return finish(parts);
  },
};

export default COL_LEICHA;
