/**
 * @file packs/matsu/collectibles/aged_wine_bowl.js — Roll Formosa Matsu pack.
 *
 * 老酒麵線 (Aged Wine Noodles) — code 71. A deep ceramic bowl holding a tangle
 * of thin vermicelli noodles in a rich amber-red broth made with Matsu's famous
 * aged rice wine. The distinctive color comes from red yeast. A signature Matsu
 * comfort dish, especially warming on foggy island days.
 *
 * <= 350 triangles.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

const BOWL = 0x8b6f5c;       // earthy ceramic brown
const BOWL_HI = 0xa68b74;    // lighter rim
const BROTH = 0xb54d32;      // red yeast wine broth (amber-red)
const NOODLE = 0xf5e6c8;     // pale vermicelli
const NOODLE_HI = 0xfff4dc;

export const COL_AGED_WINE_BOWL = {
  id: 'aged_wine_bowl',
  name: '老酒麵線',
  colorHex: 0xb54d32,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];
    const jit = (rng() - 0.5) * 0.08;

    // Bowl outer wall
    parts.push(cyl(0.9, 0.5, 0.7, 10, BOWL, { y: 0.35, hex2: BOWL_HI }));
    // Bowl inner (darker)
    parts.push(cyl(0.82, 0.42, 0.6, 10, BOWL, { y: 0.42, open: true }));
    // Bowl rim
    parts.push(cyl(0.94, 0.88, 0.08, 10, BOWL_HI, { y: 0.7 }));
    // Bowl bottom
    parts.push(cyl(0.5, 0.5, 0.05, 8, BOWL, { y: 0.08 }));
    // Foot ring
    parts.push(cyl(0.38, 0.32, 0.1, 8, BOWL, { y: 0.02 }));

    // Broth surface
    parts.push(cyl(0.76, 0.76, 0.12, 10, BROTH, { y: 0.58 }));

    // Noodle tangles (curved strands on top)
    parts.push(sph(0.3, NOODLE, { ws: 6, hs: 3, sx: 1.4, sy: 0.3, sz: 0.8, y: 0.72, x: 0.1 + jit, hex2: NOODLE_HI }));
    parts.push(sph(0.28, NOODLE, { ws: 6, hs: 3, sx: 0.9, sy: 0.25, sz: 1.3, y: 0.74, x: -0.15, z: 0.12, hex2: NOODLE_HI }));
    parts.push(sph(0.25, NOODLE, { ws: 5, hs: 3, sx: 1.2, sy: 0.28, sz: 0.7, y: 0.78, z: -0.18 + jit, hex2: NOODLE_HI }));
    parts.push(sph(0.22, NOODLE, { ws: 5, hs: 3, sx: 0.8, sy: 0.22, sz: 1.1, y: 0.76, x: 0.2, z: 0.2, hex2: NOODLE_HI }));

    return finish(parts);
  },
};

export default COL_AGED_WINE_BOWL;
