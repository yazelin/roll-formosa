/**
 * @file packs/changhua/collectibles/ox_tongue_cake.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_OX_TONGUE_CAKE — 牛舌餅 (ox tongue cake), a famous Lukang specialty.
 * Named for its elongated, tongue-like shape, this traditional pastry has
 * a crispy, flaky exterior and a sweet malt sugar filling. The thin, flat,
 * oval shape with subtle golden-brown coloring is distinctive.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI } from '../geomHelpers.js';

const PASTRY = 0xe8d4a8;      // golden pastry exterior
const PASTRY_HI = 0xf0e0c0;   // lighter highlight
const PASTRY_D = 0xc8b488;    // darker baked spots
const FILLING = 0xc89848;     // malt sugar filling

export const COL_OX_TONGUE_CAKE = {
  id: 'ox_tongue_cake',
  name: '牛舌餅',
  collectibleId: 5,
  colorHex: PASTRY,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201);
    const parts = [];

    // Main tongue-shaped pastry body - elongated oval, very flat
    // Use a squashed sphere stretched along one axis
    parts.push(sph(0.75, PASTRY + t, {
      ws: 10, hs: 6,
      sx: 0.45, // narrow width
      sy: 0.15, // very flat
      sz: 1.0,  // long
      y: 0.12,
      hex2: PASTRY_HI,
    }));

    // Slightly darker bottom layer
    parts.push(sph(0.70, PASTRY_D, {
      ws: 8, hs: 4,
      sx: 0.42,
      sy: 0.10,
      sz: 0.95,
      y: 0.06,
    }));

    // Subtle surface texture - baked spots
    parts.push(sph(0.10, PASTRY_D, { ws: 4, hs: 3, x: 0.08, y: 0.18, z: 0.20 }));
    parts.push(sph(0.08, PASTRY_D, { ws: 4, hs: 3, x: -0.06, y: 0.18, z: -0.15 }));
    parts.push(sph(0.09, PASTRY_D, { ws: 4, hs: 3, x: 0.05, y: 0.18, z: -0.30 }));

    // Filling visible at edges (slightly oozing out)
    parts.push(sph(0.06, FILLING, { ws: 4, hs: 3, x: 0.28, y: 0.10, z: 0.40 }));
    parts.push(sph(0.05, FILLING, { ws: 4, hs: 3, x: -0.26, y: 0.10, z: -0.38 }));

    return finish(parts);
  },
};

export default COL_OX_TONGUE_CAKE;
