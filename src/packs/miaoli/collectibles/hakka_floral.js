/**
 * @file packs/miaoli/collectibles/hakka_floral.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_HAKKA_FLORAL — 客家花布 (Hakka floral fabric). Silhouette: a folded piece
 * of traditional Hakka floral-print fabric, showing the iconic bright red/pink
 * base with bold peony flowers. The fabric is shown as a decorative folded
 * square/bundle, the way it might be sold or displayed. Reads unmistakably as
 * "floral fabric" at thumbnail size: red base + colorful flower pattern + soft folds.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * fabric tint, never structure.
 */

import { box, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — Hakka floral fabric colors. */
const FABRIC_RED = 0xc83050; // bright red base fabric
const FABRIC_HI = 0xd84060; // lighter red
const PEONY_PINK = 0xf080a0; // pink peony flower
const PEONY_RED = 0xe05070; // deeper red peony
const LEAF_GREEN = 0x40a060; // green leaves
const LEAF_DARK = 0x308050; // darker green
const YELLOW = 0xf0d040; // yellow flower center

export const COL_HAKKA_FLORAL = {
  id: 'hakka_floral',
  name: '客家花布',
  colorHex: 0xc83050, // bright red fabric — the body read color

  /**
   * Build the floral fabric geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (fabric tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040202); // tiny per-instance fabric tint
    const fabricRed = FABRIC_RED - t;
    const parts = [];

    // --- FOLDED FABRIC BASE: layered folded cloth bundle ---
    // Bottom layer (slightly larger, visible edges)
    parts.push(box(1.4, 0.2, 1.3, fabricRed, { y: -0.2, hex2: FABRIC_HI }));
    // Middle fold
    parts.push(box(1.3, 0.18, 1.2, FABRIC_HI, { y: 0.0 }));
    // Top layer (slightly smaller)
    parts.push(box(1.2, 0.15, 1.1, fabricRed, { y: 0.18, hex2: FABRIC_HI }));

    // Soft rolled edges to suggest fabric texture
    parts.push(sph(0.15, FABRIC_HI, { ws: 5, hs: 3, sx: 4.5, sy: 0.6, sz: 0.8, y: 0.32, z: 0.55 }));
    parts.push(sph(0.15, fabricRed, { ws: 5, hs: 3, sx: 4.5, sy: 0.6, sz: 0.8, y: 0.32, z: -0.55 }));

    // --- FLORAL PATTERN: peony flowers printed on fabric ---
    // Large central peony
    parts.push(sph(0.3, PEONY_PINK, { ws: 7, hs: 4, sy: 0.35, x: 0.0, y: 0.35, z: 0.0, hex2: PEONY_RED }));
    // Peony petals radiating out
    const petalN = 6;
    for (let i = 0; i < petalN; i++) {
      const ang = (i / petalN) * Math.PI * 2;
      const px = Math.cos(ang) * 0.25;
      const pz = Math.sin(ang) * 0.25;
      parts.push(sph(0.15, PEONY_PINK, {
        ws: 5,
        hs: 3,
        sy: 0.25,
        x: px,
        y: 0.32,
        z: pz,
        hex2: PEONY_RED,
      }));
    }
    // Yellow center
    parts.push(sph(0.1, YELLOW, { ws: 5, hs: 3, sy: 0.4, y: 0.38 }));

    // Smaller side flowers
    parts.push(sph(0.2, PEONY_RED, { ws: 6, hs: 3, sy: 0.3, x: 0.45, y: 0.32, z: 0.35 }));
    parts.push(sph(0.08, YELLOW, { ws: 4, hs: 3, sy: 0.35, x: 0.45, y: 0.36, z: 0.35 }));
    parts.push(sph(0.18, PEONY_PINK, { ws: 6, hs: 3, sy: 0.3, x: -0.4, y: 0.32, z: -0.3 }));
    parts.push(sph(0.07, YELLOW, { ws: 4, hs: 3, sy: 0.35, x: -0.4, y: 0.35, z: -0.3 }));

    // --- LEAVES: green leaves between flowers ---
    const leafPositions = [
      { x: 0.35, z: -0.1, ry: 0.5 },
      { x: -0.3, z: 0.2, ry: -0.8 },
      { x: 0.15, z: 0.4, ry: 1.2 },
      { x: -0.2, z: -0.35, ry: 2.0 },
    ];
    for (const leaf of leafPositions) {
      parts.push(sph(0.15, LEAF_GREEN, {
        ws: 5,
        hs: 3,
        sx: 0.6,
        sy: 0.2,
        sz: 1.2,
        ry: leaf.ry,
        x: leaf.x,
        y: 0.3,
        z: leaf.z,
        hex2: LEAF_DARK,
      }));
    }

    return finish(parts);
  },
};

export default COL_HAKKA_FLORAL;
