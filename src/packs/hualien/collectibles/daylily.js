/**
 * @file packs/hualien/collectibles/daylily.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_DAYLILY — 金針花 (daylily / golden needle flower). The iconic orange
 * flower of Hualien's Liushidan Mountain (六十石山), blooming in late summer.
 * Features bright orange lily-like blooms on slender green stems, bundled
 * together as a small bouquet.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const PETAL = 0xf0a030; // bright orange petal
const PETAL_HI = 0xffc050;
const STEM = 0x5a8a4a; // green stem
const STAMEN = 0xe8c040; // yellow stamen

export const COL_DAYLILY = {
  id: 'daylily',
  name: '金針花',
  collectibleId: 8,
  colorHex: 0xf0a030, // bright orange

  buildGeometry(rng) {
    const parts = [];

    // --- STEMS (bundled) ---
    parts.push(cyl(0.04, 0.05, 1.2, 6, STEM, { x: 0, y: 0.6, z: 0 }));
    parts.push(cyl(0.035, 0.04, 1.1, 6, STEM, { x: 0.15, y: 0.55, z: 0.08, rx: 0.15 }));
    parts.push(cyl(0.035, 0.04, 1.0, 6, STEM, { x: -0.12, y: 0.5, z: 0.1, rx: -0.12, rz: 0.1 }));

    // --- MAIN BLOOM (center) ---
    // Petals (6 radiating)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      const px = Math.cos(a) * 0.2;
      const pz = Math.sin(a) * 0.2;
      parts.push(cone(0.15, 0.4, 5, PETAL, {
        x: px, y: 1.35, z: pz,
        rx: Math.sin(a) * 0.8,
        rz: -Math.cos(a) * 0.8,
        hex2: PETAL_HI,
      }));
    }
    // Center stamen
    parts.push(cyl(0.06, 0.04, 0.25, 6, STAMEN, { y: 1.45 }));
    parts.push(sph(0.06, 0xe0a020, { ws: 5, hs: 3, y: 1.58 }));

    // --- SECOND BLOOM (side) ---
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * PI * 2 + 0.3;
      const px = 0.2 + Math.cos(a) * 0.15;
      const pz = 0.1 + Math.sin(a) * 0.15;
      parts.push(cone(0.1, 0.3, 5, PETAL, {
        x: px, y: 1.15, z: pz,
        rx: Math.sin(a) * 0.7,
        rz: -Math.cos(a) * 0.7,
        hex2: PETAL_HI,
      }));
    }
    parts.push(sph(0.05, STAMEN, { ws: 4, hs: 3, x: 0.2, y: 1.2, z: 0.1 }));

    // --- UNOPENED BUD ---
    parts.push(cone(0.08, 0.25, 6, PETAL, { x: -0.15, y: 1.08, z: 0.12 }));

    return finish(parts);
  },
};

export default COL_DAYLILY;
