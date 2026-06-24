/**
 * @file packs/miaoli/collectibles/hakka_bantiao.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_HAKKA_BANTIAO — 客家粄條 (Hakka flat rice noodles). Silhouette: a ceramic
 * bowl filled with flat, wide rice noodles (粄條), topped with green scallions
 * and a few slices of braised pork. The signature Hakka dish features smooth,
 * chewy flat noodles in a clear broth. Reads unmistakably as "noodle bowl" at
 * thumbnail size: round bowl + pale noodles + green garnish.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * noodle arrangement, never structure.
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — bowl, noodles, broth, toppings. */
const BOWL = 0x4a6a8a; // blue-gray ceramic bowl
const BOWL_HI = 0x5a7a9a; // lighter rim
const NOODLE = 0xf5f0e8; // pale white rice noodles
const NOODLE_HI = 0xfaf8f2; // shiny noodle surface
const BROTH = 0xe8dcc8; // clear pale broth
const SCALLION = 0x4a8a40; // green scallion
const PORK = 0x9a6a4a; // braised pork brown

export const COL_HAKKA_BANTIAO = {
  id: 'hakka_bantiao',
  name: '客家粄條',
  colorHex: 0xf5f0e8, // pale noodle white — the body read color

  /**
   * Build the noodle bowl geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (noodle tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202); // tiny per-instance noodle tint
    const noodle = NOODLE - t;
    const parts = [];

    // --- BOWL: traditional ceramic bowl ---
    // Outer wall: tapered cylinder
    parts.push(cyl(0.95, 0.55, 0.7, 12, BOWL, { y: 0.0, hex2: BOWL_HI }));
    // Inner wall
    parts.push(cyl(0.85, 0.48, 0.6, 12, BOWL_HI, { y: 0.05 }));
    // Bowl rim
    parts.push(cyl(0.95, 0.88, 0.08, 14, BOWL_HI, { y: 0.34 }));
    // Bowl base
    parts.push(cyl(0.35, 0.35, 0.08, 8, BOWL, { y: -0.33 }));

    // --- BROTH: pale clear broth surface ---
    parts.push(cyl(0.78, 0.78, 0.15, 10, BROTH, { y: 0.2 }));

    // --- NOODLES: flat wide rice noodles piled in the bowl ---
    // Several wavy flat strips representing the noodles
    const noodleStrips = [
      { x: 0.0, z: 0.0, ry: 0.0 },
      { x: 0.15, z: 0.2, ry: 0.8 },
      { x: -0.2, z: 0.1, ry: -0.5 },
      { x: 0.1, z: -0.15, ry: 1.2 },
      { x: -0.1, z: -0.2, ry: 2.0 },
    ];
    for (const strip of noodleStrips) {
      // Each noodle strip is a flat elongated box
      parts.push(box(0.5, 0.06, 0.15, noodle, {
        x: strip.x,
        y: 0.32 + rng() * 0.08,
        z: strip.z,
        ry: strip.ry,
        hex2: NOODLE_HI,
      }));
    }
    // Top layer of noodles
    parts.push(box(0.45, 0.05, 0.12, NOODLE_HI, { x: 0.08, y: 0.42, z: 0.05, ry: 0.3 }));
    parts.push(box(0.4, 0.05, 0.12, noodle, { x: -0.05, y: 0.44, z: -0.08, ry: -0.6 }));

    // --- SCALLION: green scallion pieces on top ---
    parts.push(cyl(0.04, 0.04, 0.2, 4, SCALLION, { x: 0.25, y: 0.48, z: 0.1, rz: 0.3 }));
    parts.push(cyl(0.04, 0.04, 0.18, 4, SCALLION, { x: -0.2, y: 0.46, z: 0.15, rz: -0.4 }));
    parts.push(cyl(0.04, 0.04, 0.15, 4, SCALLION, { x: 0.0, y: 0.5, z: -0.18, rz: 0.2 }));

    // --- PORK: a couple slices of braised pork ---
    parts.push(sph(0.12, PORK, { ws: 5, hs: 4, sx: 1.2, sy: 0.4, sz: 0.8, x: 0.3, y: 0.45, z: -0.1 }));
    parts.push(sph(0.1, PORK, { ws: 5, hs: 4, sx: 1.0, sy: 0.4, sz: 0.9, x: -0.25, y: 0.44, z: -0.2 }));

    return finish(parts);
  },
};

export default COL_HAKKA_BANTIAO;
