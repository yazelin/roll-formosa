/**
 * @file packs/hsinchu/collectibles/bamboo_chopsticks.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_CHOPSTICKS — 竹筷 (Bamboo Chopsticks). Representing the bamboo crafts of
 * the Hsinchu region. Silhouette: a pair of elegant bamboo chopsticks, slightly
 * tapered, with the natural bamboo grain color and texture.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BAMBOO = 0xd4b896;      // natural bamboo tan
const BAMBOO_HI = 0xe8d4b0;   // bamboo highlight
const BAMBOO_DARK = 0xb09070; // bamboo nodes/grain
const TIP = 0xc0a080;         // tapered tip

export const COL_CHOPSTICKS = {
  id: 'bamboo_chopsticks',
  name: '竹筷',
  collectibleId: 10,
  colorHex: BAMBOO,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302);
    const bamboo = BAMBOO + t;
    const parts = [];

    // --- first CHOPSTICK (slightly angled) ---
    // main shaft
    parts.push(cyl(0.06, 0.04, 2.2, 6, bamboo, { x: -0.12, y: 0, z: 0, rz: 0.05, hex2: BAMBOO_HI }));
    // tapered tip
    parts.push(cyl(0.04, 0.02, 0.25, 5, TIP, { x: -0.06, y: -1.2, z: 0, rz: 0.05, hex2: bamboo }));
    // top end cap
    parts.push(cyl(0.065, 0.06, 0.08, 5, BAMBOO_DARK, { x: -0.17, y: 1.12, z: 0, rz: 0.05 }));
    // bamboo node rings
    parts.push(cyl(0.065, 0.065, 0.04, 6, BAMBOO_DARK, { x: -0.14, y: 0.5, z: 0, rz: 0.05 }));
    parts.push(cyl(0.062, 0.062, 0.03, 6, BAMBOO_DARK, { x: -0.1, y: -0.2, z: 0, rz: 0.05 }));

    // --- second CHOPSTICK (parallel, slightly offset) ---
    // main shaft
    parts.push(cyl(0.06, 0.04, 2.2, 6, bamboo, { x: 0.12, y: 0.05, z: 0, rz: -0.04, hex2: BAMBOO_HI }));
    // tapered tip
    parts.push(cyl(0.04, 0.02, 0.25, 5, TIP, { x: 0.17, y: -1.12, z: 0, rz: -0.04, hex2: bamboo }));
    // top end cap
    parts.push(cyl(0.065, 0.06, 0.08, 5, BAMBOO_DARK, { x: 0.08, y: 1.2, z: 0, rz: -0.04 }));
    // bamboo node rings
    parts.push(cyl(0.065, 0.065, 0.04, 6, BAMBOO_DARK, { x: 0.1, y: 0.55, z: 0, rz: -0.04 }));
    parts.push(cyl(0.062, 0.062, 0.03, 6, BAMBOO_DARK, { x: 0.14, y: -0.15, z: 0, rz: -0.04 }));

    // --- decorative carved pattern on top portions ---
    // simple line engravings (represented as thin boxes)
    parts.push(box(0.008, 0.15, 0.04, BAMBOO_DARK, { x: -0.15, y: 0.8, z: 0.05 }));
    parts.push(box(0.008, 0.15, 0.04, BAMBOO_DARK, { x: 0.1, y: 0.85, z: 0.05 }));

    return finish(parts);
  },
};

export default COL_CHOPSTICKS;
