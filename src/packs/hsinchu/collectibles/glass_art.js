/**
 * @file packs/hsinchu/collectibles/glass_art.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_GLASS_ART — 玻璃藝品 (Glass Art). Hsinchu was historically famous for its
 * glass industry, with a renowned glass museum. Silhouette: an elegant decorative
 * glass vase with swirling colored bands, the characteristic iridescent quality
 * of hand-blown art glass.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const GLASS_BLUE = 0x4a8cc8;    // blue-tinted glass
const GLASS_TEAL = 0x3aa0a0;    // teal swirl
const GLASS_CLEAR = 0xc8e8f0;   // clear glass highlight
const GLASS_AMBER = 0xe8a840;   // amber accent

export const COL_GLASS_ART = {
  id: 'glass_art',
  name: '玻璃藝品',
  collectibleId: 3,
  colorHex: GLASS_BLUE,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x101008);
    const blue = GLASS_BLUE + t;

    return finish([
      // --- vase BASE (wide, stable) ---
      cyl(0.5, 0.6, 0.2, 10, blue, { y: 0.1, hex2: GLASS_TEAL }),
      cyl(0.6, 0.5, 0.15, 10, GLASS_TEAL, { y: 0.22 }),

      // --- vase BODY (bulbous middle) ---
      sph(0.72, blue, { ws: 10, hs: 7, sy: 1.1, y: 0.72, hex2: GLASS_CLEAR }),
      // colored swirl bands
      cyl(0.68, 0.7, 0.08, 12, GLASS_AMBER, { y: 0.52, open: true }),
      cyl(0.72, 0.68, 0.06, 12, GLASS_TEAL, { y: 0.72, open: true }),
      cyl(0.66, 0.72, 0.07, 12, GLASS_AMBER, { y: 0.92, open: true }),

      // --- vase NECK (narrowing up) ---
      cyl(0.35, 0.58, 0.4, 8, blue, { y: 1.32, hex2: GLASS_CLEAR }),
      // decorative ring
      cyl(0.38, 0.38, 0.06, 8, GLASS_TEAL, { y: 1.48 }),

      // --- vase RIM (flared opening) ---
      cyl(0.45, 0.32, 0.18, 8, GLASS_CLEAR, { y: 1.62, hex2: 0xffffff }),
      // rim lip
      cyl(0.48, 0.45, 0.04, 10, 0xe0f4ff, { y: 1.72 }),

      // --- internal glow effect (visible through translucent glass) ---
      sph(0.4, 0xffeedd, { ws: 5, hs: 4, y: 0.72, sy: 0.8 }),

      // --- decorative glass bubbles (characteristic of art glass) ---
      sph(0.08, GLASS_CLEAR, { ws: 4, hs: 3, x: 0.32, y: 0.58, z: 0.48 }),
      sph(0.06, GLASS_CLEAR, { ws: 4, hs: 3, x: -0.38, y: 0.82, z: 0.42 }),
      sph(0.05, GLASS_CLEAR, { ws: 4, hs: 3, x: 0.28, y: 1.02, z: -0.48 }),
    ]);
  },
};

export default COL_GLASS_ART;
