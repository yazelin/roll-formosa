/**
 * @file packs/chiayi/collectibles/mochi.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_MOCHI — 麻糬 (Mochi). Soft sticky rice cakes, popular throughout Taiwan.
 * Chiayi has famous mochi shops. Round, pale colored with various fillings
 * visible through the translucent skin.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SKIN = 0xf0e8e0;      // pale mochi skin
const SKIN_HI = 0xf8f4f0;   // skin highlight
const PEANUT = 0xc8a060;    // peanut filling
const SESAME = 0x2a2a2a;    // black sesame
const RED_BEAN = 0x7a3030;  // red bean

export const COL_MOCHI = {
  id: 'mochi',
  name: '麻糬',
  colorHex: 0xf0e8e0,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Plate/tray base
    parts.push(cyl(0.6, 0.62, 0.06, 8, 0xd8c8b8, { y: 0.03 }));

    // Main mochi - center (peanut)
    parts.push(sph(0.22, SKIN, { ws: 6, hs: 5, y: 0.24, sy: 0.7, hex2: SKIN_HI }));
    // Filling visible through top
    parts.push(sph(0.08, PEANUT, { ws: 4, hs: 3, y: 0.32 + j }));

    // Mochi - left (sesame)
    parts.push(sph(0.2, SKIN, { ws: 6, hs: 5, x: -0.32, y: 0.22, z: 0.1, sy: 0.68, hex2: SKIN_HI }));
    parts.push(sph(0.07, SESAME, { ws: 4, hs: 3, x: -0.32, y: 0.29, z: 0.1 }));

    // Mochi - right (red bean)
    parts.push(sph(0.19, SKIN, { ws: 6, hs: 5, x: 0.3, y: 0.21, z: -0.08, sy: 0.65, hex2: SKIN_HI }));
    parts.push(sph(0.06, RED_BEAN, { ws: 4, hs: 3, x: 0.3, y: 0.27, z: -0.08 }));

    // Mochi - back
    parts.push(sph(0.18, SKIN, { ws: 6, hs: 5, x: 0.05, y: 0.2, z: -0.32, sy: 0.65, hex2: SKIN_HI }));
    parts.push(sph(0.06, PEANUT, { ws: 4, hs: 3, x: 0.05, y: 0.26, z: -0.32 }));

    return finish(parts);
  },
};

export default COL_MOCHI;
