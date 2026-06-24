/**
 * @file packs/kinmen/collectibles/sorghum_candy.js — Roll Formosa Kinmen pack.
 *
 * 高粱糖 (Sorghum Candy) — code 78. Candy made with Kinmen's famous kaoliang
 * (sorghum) liquor. The alcohol gives it a unique flavor that's distinctly
 * Kinmen - often wrapped in colorful paper.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const WRAPPER_RED = 0xc41e3a;
const WRAPPER_GOLD = 0xdaa520;
const WRAPPER_GREEN = 0x2a6a3a;
const CANDY_AMBER = 0xe8a050;
const CANDY_BROWN = 0xc08040;

export const COL_SORGHUM_CANDY = {
  id: 'sorghum_candy',
  name: '高粱糖',
  colorHex: CANDY_AMBER,

  buildGeometry(rng) {
    const parts = [];

    // Pile of wrapped candies

    // Candy 1 (red wrapper)
    parts.push(sph(0.2, WRAPPER_RED, { ws: 6, hs: 4, y: 0.15, x: 0, z: 0, sx: 1.3, hex2: 0xa81020 }));
    parts.push(cyl(0.08, 0.04, 0.12, 4, WRAPPER_RED, { x: -0.22, y: 0.15, rz: HALF_PI }));
    parts.push(cyl(0.08, 0.04, 0.12, 4, WRAPPER_RED, { x: 0.22, y: 0.15, rz: HALF_PI }));

    // Candy 2 (gold wrapper)
    parts.push(sph(0.18, WRAPPER_GOLD, { ws: 6, hs: 4, y: 0.35, x: 0.2, z: 0.15, sx: 1.3, hex2: 0xb09010 }));
    parts.push(cyl(0.07, 0.03, 0.1, 4, WRAPPER_GOLD, { x: 0, y: 0.35, z: 0.15, rz: HALF_PI }));
    parts.push(cyl(0.07, 0.03, 0.1, 4, WRAPPER_GOLD, { x: 0.4, y: 0.35, z: 0.15, rz: HALF_PI }));

    // Candy 3 (green wrapper)
    parts.push(sph(0.17, WRAPPER_GREEN, { ws: 6, hs: 4, y: 0.32, x: -0.18, z: 0.18, sx: 1.3, hex2: 0x1a5a2a }));
    parts.push(cyl(0.06, 0.03, 0.1, 4, WRAPPER_GREEN, { x: -0.36, y: 0.32, z: 0.18, rz: HALF_PI }));
    parts.push(cyl(0.06, 0.03, 0.1, 4, WRAPPER_GREEN, { x: 0, y: 0.32, z: 0.18, rz: HALF_PI }));

    // Candy 4 (red, on top)
    parts.push(sph(0.16, WRAPPER_RED, { ws: 5, hs: 4, y: 0.5, x: 0.05, z: -0.1, sx: 1.3, hex2: 0xb01828 }));

    // Unwrapped candy showing amber color
    parts.push(sph(0.15, CANDY_AMBER, { ws: 6, hs: 4, y: 0.18, x: 0.35, z: -0.2, sx: 1.2, hex2: CANDY_BROWN }));

    // Decorative tin/box underneath
    parts.push(box(0.8, 0.08, 0.7, WRAPPER_RED, { y: 0.04, hex2: WRAPPER_GOLD }));

    return finish(parts);
  },
};

export default COL_SORGHUM_CANDY;
