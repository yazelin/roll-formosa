/**
 * @file packs/pingtung/collectibles/mango.js — Roll Formosa Pingtung pack.
 *
 * 芒果 (Mango) — collectibleId 3. Pingtung mangoes, especially from Fangshan,
 * are famous throughout Taiwan. Silhouette: a plump, golden-orange mango
 * with the characteristic curved shape, stem, and blush coloring.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, cyl, box, finish } from '../geomHelpers.js';

const ORANGE = 0xe8a020;       // main mango orange
const YELLOW = 0xf0c040;       // yellow highlights
const RED_BLUSH = 0xd04030;    // red blush spots
const GREEN = 0x60a030;        // near stem green
const STEM = 0x5a4030;         // brown stem

export const COL_MANGO = {
  id: 'mango',
  name: '芒果',
  collectibleId: 3,
  colorHex: ORANGE,

  buildGeometry(rng) {
    const parts = [];
    const jit = (rng() - 0.5) * 0.03;

    // --- Main mango body (asymmetric oval) ---
    // Core shape - slightly curved/kidney-shaped
    parts.push(sph(0.75, ORANGE, { ws: 10, hs: 7, sx: 0.85, sy: 0.9, sz: 1.3, y: 0, hex2: YELLOW }));
    
    // --- Curved belly side ---
    parts.push(sph(0.5, YELLOW, { ws: 7, hs: 5, sx: 0.7, sy: 0.75, sz: 0.9, x: 0.25, y: -0.1, z: 0.15 }));

    // --- Tapered tip end ---
    parts.push(sph(0.35, ORANGE, { ws: 6, hs: 4, sx: 0.6, sy: 0.65, sz: 0.8, z: 0.85, hex2: YELLOW }));
    parts.push(sph(0.2, YELLOW, { ws: 4, hs: 3, sx: 0.5, sy: 0.55, sz: 0.6, z: 1.1 }));

    // --- Red blush areas ---
    parts.push(sph(0.35, RED_BLUSH, { ws: 5, hs: 4, sx: 0.8, sy: 0.6, sz: 0.7, x: -0.35, y: 0.25, z: -0.3 }));
    parts.push(sph(0.25, RED_BLUSH, { ws: 4, hs: 3, sx: 0.7, sy: 0.5, sz: 0.6, x: 0.15, y: 0.35, z: -0.15 }));

    // --- Green near stem ---
    parts.push(sph(0.3, GREEN, { ws: 5, hs: 4, sx: 0.7, sy: 0.6, sz: 0.6, z: -0.75, y: 0.1 }));

    // --- Stem ---
    parts.push(cyl(0.08, 0.06, 0.25, 5, STEM, { z: -0.95, y: 0.15, rx: -0.2 + jit }));
    // Stem cap
    parts.push(sph(0.1, STEM, { ws: 4, hs: 3, z: -0.85, y: 0.12 }));

    return finish(parts);
  },
};

export default COL_MANGO;
