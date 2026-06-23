/**
 * @file packs/chiayi/collectibles/egg_pancake.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_EGG_PANCAKE — 蛋餅 (Egg Pancake / Dan Bing). Classic Taiwanese breakfast item:
 * a thin crepe wrapped around egg, often with fillings. Chiayi has many famous
 * traditional breakfast spots. Golden-brown rolled pancake.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CREPE = 0xe8c878;     // golden pancake
const CREPE_HI = 0xf0d898;  // pancake highlight
const EGG = 0xf8e878;       // egg yellow
const CHAR = 0xc89848;      // char marks

export const COL_EGG_PANCAKE = {
  id: 'egg_pancake',
  name: '蛋餅',
  colorHex: 0xe8c878,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Plate
    parts.push(cyl(0.55, 0.58, 0.05, 8, 0xf0e8d8, { y: 0.025 }));

    // Rolled pancake - main cylinder shape
    parts.push(cyl(0.18, 0.18, 0.65, 8, CREPE, { y: 0.23, rz: HALF_PI, hex2: CREPE_HI }));

    // Visible layers at the end (spiral)
    parts.push(cyl(0.16, 0.16, 0.04, 8, CREPE_HI, { x: 0.33, y: 0.23, rz: HALF_PI }));
    parts.push(cyl(0.12, 0.12, 0.03, 6, EGG, { x: 0.34, y: 0.23, rz: HALF_PI }));

    // Other end
    parts.push(cyl(0.15, 0.15, 0.04, 8, CREPE_HI, { x: -0.33, y: 0.23, rz: HALF_PI }));
    parts.push(cyl(0.1, 0.1, 0.03, 6, EGG, { x: -0.34, y: 0.23, rz: HALF_PI }));

    // Char/grill marks on surface
    parts.push(box(0.08, 0.02, 0.5, CHAR, { y: 0.4 + j, rz: 0.1 }));
    parts.push(box(0.06, 0.02, 0.45, CHAR, { x: 0.1, y: 0.38, z: -0.05, rz: -0.1 }));

    // Small sauce dish
    parts.push(cyl(0.12, 0.14, 0.06, 6, 0xe8e0d0, { x: 0.35, y: 0.08, z: 0.3 }));
    parts.push(cyl(0.1, 0.1, 0.03, 6, 0x4a2818, { x: 0.35, y: 0.1, z: 0.3 })); // soy sauce

    return finish(parts);
  },
};

export default COL_EGG_PANCAKE;
