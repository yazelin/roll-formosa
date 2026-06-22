/**
 * @file packs/chiayi/collectibles/alishan_tea.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_ALISHAN_TEA — 阿里山高山茶 (Alishan High Mountain Tea). Famous oolong tea from
 * Alishan: a traditional tea pot with a small tea cup, representing the high-altitude
 * tea plantations. Golden-amber tea color, traditional clay teapot.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CLAY = 0x8a5a40;      // yixing-style clay
const CLAY_HI = 0xa87858;   // clay highlight
const TEA = 0xc8a040;       // golden tea color
const TEA_HI = 0xe8c868;    // tea highlight

export const COL_ALISHAN_TEA = {
  id: 'alishan_tea',
  name: '阿里山高山茶',
  colorHex: 0xc8a040,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // TEAPOT
    // Body
    parts.push(sph(0.32, CLAY, { ws: 7, hs: 5, y: 0.35, sy: 0.75, hex2: CLAY_HI }));

    // Lid
    parts.push(cyl(0.18, 0.2, 0.06, 8, CLAY, { y: 0.58, hex2: CLAY_HI }));
    parts.push(sph(0.07, CLAY, { ws: 4, hs: 3, y: 0.65 }));

    // Spout
    parts.push(cyl(0.05, 0.07, 0.22, 5, CLAY, {
      x: 0.32, y: 0.38, rx: 0.4, rz: -0.3, hex2: CLAY_HI,
    }));

    // Handle
    parts.push(torus(0.12, 0.035, 4, 8, CLAY, {
      x: -0.28, y: 0.4, rz: HALF_PI, ry: 0.3,
    }));

    // TEA CUP (small, beside the pot)
    const cupX = 0.45;
    const cupZ = 0.2;
    parts.push(cyl(0.14, 0.12, 0.12, 6, CLAY, { x: cupX, y: 0.06, z: cupZ, hex2: CLAY_HI }));
    // Tea inside cup
    parts.push(cyl(0.11, 0.11, 0.04, 6, TEA, { x: cupX, y: 0.11, z: cupZ + j, hex2: TEA_HI }));

    // Second small cup
    const cup2X = 0.3;
    const cup2Z = -0.35;
    parts.push(cyl(0.13, 0.11, 0.11, 6, CLAY, { x: cup2X, y: 0.055, z: cup2Z, hex2: CLAY_HI }));
    parts.push(cyl(0.1, 0.1, 0.035, 6, TEA, { x: cup2X, y: 0.1, z: cup2Z, hex2: TEA_HI }));

    return finish(parts);
  },
};

export default COL_ALISHAN_TEA;
