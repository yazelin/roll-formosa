/**
 * @file packs/changhua/collectibles/lantern.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_LANTERN — 燈籠 (traditional red lantern), a Lukang craft specialty.
 * Hand-made red silk lanterns have been crafted in Lukang for centuries.
 * Silhouette: a classic oval red lantern with bamboo ribs, gold tassels
 * at bottom, and gold trim. Often hung at temples and old streets.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, cone, finish, HALF_PI, PI } from '../geomHelpers.js';

const RED = 0xd82020;         // lantern red silk
const RED_D = 0xa81818;       // darker red
const GOLD = 0xe8c048;        // gold trim
const BAMBOO = 0xc8a060;      // bamboo frame
const TASSEL = 0xf8d848;      // gold tassel

export const COL_LANTERN = {
  id: 'lantern',
  name: '燈籠',
  collectibleId: 11,
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // Top cap (gold)
    parts.push(cyl(0.18, 0.25, 0.10, 6, GOLD, { y: 1.10 }));

    // Hanging loop
    parts.push(cyl(0.03, 0.03, 0.15, 4, GOLD, { y: 1.22 }));

    // Main lantern body - oval shaped (reduced segments)
    parts.push(sph(0.50, RED, {
      ws: 8, hs: 5,
      sy: 1.4,
      y: 0.65,
      hex2: RED_D,
    }));

    // Vertical bamboo ribs (reduced to 4)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * PI * 2;
      const x = Math.cos(angle) * 0.48;
      const z = Math.sin(angle) * 0.48;
      parts.push(cyl(0.02, 0.02, 0.95, 3, BAMBOO, { x, z, y: 0.65 }));
    }

    // Horizontal bamboo ring (single)
    parts.push(cyl(0.50, 0.50, 0.03, 6, BAMBOO, { y: 0.65, open: true }));

    // Bottom cap (gold)
    parts.push(cyl(0.25, 0.18, 0.10, 6, GOLD, { y: 0.10 }));

    // Tassel (simplified)
    parts.push(cyl(0.04, 0.03, 0.25, 4, TASSEL, { y: -0.08 }));
    parts.push(sph(0.05, TASSEL, { ws: 4, hs: 3, y: -0.22 }));

    return finish(parts);
  },
};

export default COL_LANTERN;
