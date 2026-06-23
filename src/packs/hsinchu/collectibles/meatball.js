/**
 * @file packs/hsinchu/collectibles/meatball.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_MEATBALL — 新竹貢丸 (Hsinchu Meatball). Hsinchu's signature pork meatball,
 * famous throughout Taiwan. Silhouette: a round, slightly irregular ball with
 * a glistening surface, showing the characteristic bounce-worthy texture.
 * The meatball sits in a small bowl with broth.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const MEAT = 0xd4a574;      // warm pork meatball color
const MEAT_HI = 0xe8c4a0;   // highlight
const BOWL = 0xf5f5f0;      // ceramic bowl white
const BROTH = 0xf0e8d8;     // light soup broth

export const COL_MEATBALL = {
  id: 'hsinchu_meatball',
  name: '新竹貢丸',
  collectibleId: 0,
  colorHex: MEAT,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302);
    const meat = MEAT + t;

    return finish([
      // --- ceramic BOWL base ---
      cyl(0.9, 0.7, 0.4, 10, BOWL, { y: 0.2, hex2: 0xffffff }),
      // bowl interior (slightly darker)
      cyl(0.82, 0.62, 0.35, 10, 0xe8e8e4, { y: 0.22 }),
      // broth in bowl
      cyl(0.78, 0.58, 0.18, 8, BROTH, { y: 0.24 }),

      // --- main MEATBALL (slightly bumpy sphere) ---
      sph(0.52, meat, { ws: 8, hs: 6, y: 0.72, sx: 1.0, sy: 0.95, sz: 1.0, hex2: MEAT_HI }),
      // surface texture bumps
      sph(0.12, meat, { ws: 4, hs: 3, x: 0.28, y: 0.82, z: 0.22 }),
      sph(0.1, meat, { ws: 4, hs: 3, x: -0.24, y: 0.78, z: 0.26 }),
      sph(0.11, meat, { ws: 4, hs: 3, x: 0.08, y: 0.88, z: -0.28 }),

      // --- second smaller meatball peeking from broth ---
      sph(0.32, meat, { ws: 6, hs: 4, x: 0.42, y: 0.48, z: -0.18, hex2: MEAT_HI }),

      // --- green scallion garnish floating in broth ---
      cyl(0.04, 0.04, 0.18, 4, 0x4a8c3f, { x: -0.32, y: 0.36, z: 0.24, rz: 0.3 }),
      cyl(0.04, 0.04, 0.14, 4, 0x5a9c4f, { x: 0.28, y: 0.35, z: 0.32, rz: -0.2 }),
    ]);
  },
};

export default COL_MEATBALL;
