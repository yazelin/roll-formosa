/**
 * @file packs/yunlin/collectibles/coffee_cup.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_COFFEE_CUP — 古坑咖啡 (Gukeng Coffee). Yunlin's Gukeng Township is Taiwan's
 * famous coffee-growing region. A classic coffee cup with saucer, featuring the
 * rich brown color of locally-grown Taiwanese coffee.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, torus, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CUP = 0xf8f4e8;        // white ceramic cup
const CUP_RIM = 0xe8e0d0;    // cup rim shadow
const SAUCER = 0xf0ece0;     // saucer color
const COFFEE = 0x3a2218;     // dark coffee
const COFFEE_HI = 0x5a3828;  // coffee highlight (crema)
const HANDLE = 0xf0e8d8;     // cup handle

export const COL_COFFEE_CUP = {
  id: 'coffee_cup',
  name: '古坑咖啡',
  colorHex: 0x3a2218,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Saucer (flat disc)
    parts.push(cyl(0.5, 0.52, 0.05, 8, SAUCER, { y: 0.025 }));
    // Saucer rim
    parts.push(torus(0.48, 0.025, 3, 8, CUP_RIM, { y: 0.04, rx: HALF_PI }));
    // Saucer center depression
    parts.push(cyl(0.22, 0.24, 0.02, 6, CUP_RIM, { y: 0.06 }));

    // Cup body
    parts.push(cyl(0.22, 0.18, 0.32, 8, CUP, { y: 0.22, hex2: CUP_RIM }));

    // Cup rim
    parts.push(torus(0.21, 0.015, 3, 8, CUP_RIM, { y: 0.38, rx: HALF_PI }));

    // Coffee inside
    parts.push(cyl(0.18, 0.18, 0.05, 6, COFFEE, { y: 0.35 + j, hex2: COFFEE_HI }));

    // Crema layer on top
    parts.push(cyl(0.16, 0.16, 0.015, 6, COFFEE_HI, { y: 0.385 }));

    // Cup handle (torus segment on side)
    parts.push(torus(0.1, 0.025, 3, 6, HANDLE, {
      x: 0.28, y: 0.26, rz: HALF_PI, arc: PI
    }));

    // Small spoon on saucer
    // Spoon bowl
    parts.push(sph(0.05, 0xc0c0c0, { ws: 4, hs: 3, x: 0.32, y: 0.08, z: 0.2, sy: 0.4 }));
    // Spoon handle
    parts.push(box(0.02, 0.01, 0.2, 0xb0b0b0, { x: 0.32, y: 0.07, z: 0.35 }));

    return finish(parts);
  },
};

export default COL_COFFEE_CUP;
