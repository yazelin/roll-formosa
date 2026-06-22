/**
 * @file packs/hualien/collectibles/gongzheng_baozi.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_GONGZHENG_BAOZI — 公正包子 (Gongzheng steamed bun). The legendary
 * steamed bun from Hualien's famous Gongzheng Street shop. A perfectly
 * pleated white bao with the signature spiral pleat pattern on top,
 * served in a small bamboo steamer basket.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BAO = 0xf8f4ef; // white steamed bun
const BAO_HI = 0xfffcf8;
const PLEAT = 0xe8e0d8; // pleat shadow
const BAMBOO = 0xc8a868; // bamboo steamer
const BAMBOO_D = 0xa88848;

export const COL_GONGZHENG_BAOZI = {
  id: 'gongzheng_baozi',
  name: '公正包子',
  collectibleId: 6,
  colorHex: 0xf8f4ef, // white bao

  buildGeometry(rng) {
    const parts = [];

    // --- BAMBOO STEAMER BASE ---
    parts.push(cyl(0.9, 0.9, 0.25, 12, BAMBOO, { y: 0.125, hex2: BAMBOO_D }));
    // Steamer rim
    parts.push(cyl(0.95, 0.95, 0.08, 12, BAMBOO_D, { y: 0.25 }));
    // Inner liner
    parts.push(cyl(0.82, 0.82, 0.04, 10, 0xd8c890, { y: 0.27 }));

    // --- STEAMED BUN (main attraction) ---
    // Plump dome body
    parts.push(sph(0.65, BAO, { ws: 10, hs: 6, sy: 0.75, y: 0.72, hex2: BAO_HI }));

    // --- Spiral pleat pattern on top ---
    // Center pinch
    parts.push(cyl(0.08, 0.12, 0.15, 6, PLEAT, { y: 1.15 }));
    // Pleat ridges (radiating from center)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2;
      const px = Math.cos(a) * 0.25;
      const pz = Math.sin(a) * 0.25;
      parts.push(box(0.04, 0.06, 0.28, PLEAT, { x: px, y: 1.08, z: pz, ry: a }));
    }

    // --- Second bun peeking from behind ---
    parts.push(sph(0.45, BAO, { ws: 8, hs: 5, sy: 0.65, x: -0.4, y: 0.55, z: -0.35, hex2: BAO_HI }));

    return finish(parts);
  },
};

export default COL_GONGZHENG_BAOZI;
