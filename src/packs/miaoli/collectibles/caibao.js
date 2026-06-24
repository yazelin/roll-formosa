/**
 * @file packs/miaoli/collectibles/caibao.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_CAIBAO — 客家菜包 (Hakka vegetable bun). Silhouette: a crescent-shaped
 * steamed bun with distinctive pleated edges, filled with savory vegetables
 * and dried radish. The bun has a pale white glutinous rice wrapper with
 * visible green filling peeking through. A classic Hakka snack. Reads
 * unmistakably as "steamed bun" at thumbnail size: white crescent + pleated edge.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * wrapper tint, never structure.
 */

import { sph, cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — bun wrapper, filling. */
const WRAPPER = 0xf8f6f0; // pale white glutinous rice wrapper
const WRAPPER_HI = 0xffffff; // bright white highlight
const WRAPPER_LO = 0xe8e4dc; // slightly darker fold shadows
const FILLING = 0x5a8a50; // green vegetable filling
const FILLING_DARK = 0x4a7a40; // darker filling bits
const STEAM = 0xf0ece4; // steamed texture

export const COL_CAIBAO = {
  id: 'col_caibao',
  name: '客家菜包',
  colorHex: 0xf8f6f0, // pale white wrapper — the body read color

  /**
   * Build the caibao geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (wrapper tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202); // tiny per-instance wrapper tint
    const wrapper = WRAPPER - t;
    const parts = [];

    // --- MAIN BODY: crescent/half-moon shaped bun ---
    // Main body: elongated half-sphere shape
    parts.push(sph(0.7, wrapper, {
      ws: 10,
      hs: 6,
      sx: 1.5,
      sy: 0.7,
      sz: 0.9,
      thetaLen: PI * 0.55,
      y: 0.1,
      hex2: WRAPPER_HI,
    }));

    // Rounded ends of the crescent
    parts.push(sph(0.35, wrapper, {
      ws: 6,
      hs: 4,
      sy: 0.7,
      sz: 0.85,
      x: 0.85,
      y: 0.08,
      hex2: WRAPPER_HI,
    }));
    parts.push(sph(0.35, wrapper, {
      ws: 6,
      hs: 4,
      sy: 0.7,
      sz: 0.85,
      x: -0.85,
      y: 0.08,
      hex2: WRAPPER_HI,
    }));

    // Bottom flat surface (where it sits)
    parts.push(cyl(0.55, 0.55, 0.08, 10, WRAPPER_LO, { y: -0.22, sx: 1.8 }));

    // --- PLEATED EDGE: distinctive folded seam along the top ---
    // Central ridge where the pleats meet
    parts.push(sph(0.12, WRAPPER_LO, {
      ws: 6,
      hs: 3,
      sx: 5.0,
      sy: 0.5,
      sz: 0.6,
      y: 0.42,
    }));

    // Individual pleats along the seam
    const pleatN = 7;
    for (let i = 0; i < pleatN; i++) {
      const px = (i - (pleatN - 1) / 2) * 0.2;
      parts.push(sph(0.08, WRAPPER_HI, {
        ws: 4,
        hs: 3,
        sy: 0.6,
        sz: 0.5,
        x: px,
        y: 0.45,
        z: 0.02,
      }));
      // Fold shadows between pleats
      if (i < pleatN - 1) {
        parts.push(sph(0.04, WRAPPER_LO, {
          ws: 3,
          hs: 2,
          sy: 0.5,
          x: px + 0.1,
          y: 0.43,
          z: 0.0,
        }));
      }
    }

    // --- FILLING: green vegetable filling visible at edges ---
    // Filling peeking through where wrapper is translucent
    parts.push(sph(0.5, FILLING, {
      ws: 7,
      hs: 4,
      sx: 1.4,
      sy: 0.5,
      sz: 0.7,
      y: 0.05,
      hex2: FILLING_DARK,
    }));

    // Small bits of darker filling visible at the pleated edge
    parts.push(sph(0.06, FILLING_DARK, { ws: 4, hs: 3, x: 0.15, y: 0.38, z: 0.08 }));
    parts.push(sph(0.05, FILLING_DARK, { ws: 4, hs: 3, x: -0.25, y: 0.36, z: 0.06 }));

    return finish(parts);
  },
};

export default COL_CAIBAO;
