/**
 * @file packs/kinmen/collectibles/gong_tang.js — Roll Formosa Kinmen pack.
 *
 * 貢糖 (Gong Tang / Tribute Candy) — code 72. Kinmen's signature peanut candy,
 * a flaky, layered confection made from maltose and peanuts. The rectangular
 * wrapped candy is a must-buy souvenir.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const WRAPPER = 0xf4e8d0;     // paper wrapper
const WRAPPER_GOLD = 0xdaa520;
const CANDY_BEIGE = 0xe8d4b0;
const CANDY_DARK = 0xc8a880;
const PEANUT = 0xb08050;

export const COL_GONG_TANG = {
  id: 'gong_tang_col',
  name: '貢糖',
  colorHex: CANDY_BEIGE,

  buildGeometry(rng) {
    const parts = [];

    // Wrapped candy (rectangular)
    parts.push(box(1.0, 0.4, 0.5, WRAPPER, { y: 0.2, hex2: WRAPPER_GOLD }));

    // Paper twist at ends
    parts.push(cyl(0.12, 0.08, 0.2, 5, WRAPPER, { x: -0.55, y: 0.2, rz: HALF_PI }));
    parts.push(cyl(0.12, 0.08, 0.2, 5, WRAPPER, { x: 0.55, y: 0.2, rz: HALF_PI }));

    // Gold band/seal
    parts.push(box(0.15, 0.42, 0.52, WRAPPER_GOLD, { y: 0.2, x: 0 }));

    // Exposed candy showing layers (at one end)
    parts.push(box(0.08, 0.35, 0.45, CANDY_BEIGE, { x: -0.46, y: 0.2, hex2: CANDY_DARK }));

    // Peanut bits visible
    parts.push(sph(0.04, PEANUT, { ws: 3, hs: 2, x: -0.48, y: 0.25, z: 0.1 }));
    parts.push(sph(0.03, PEANUT, { ws: 3, hs: 2, x: -0.48, y: 0.15, z: -0.08 }));
    parts.push(sph(0.035, PEANUT, { ws: 3, hs: 2, x: -0.47, y: 0.22, z: -0.15 }));

    // Second candy piece nearby
    parts.push(box(0.9, 0.38, 0.48, WRAPPER, { y: 0.58, x: 0.1, rz: 0.15, hex2: WRAPPER_GOLD }));
    parts.push(box(0.14, 0.4, 0.5, WRAPPER_GOLD, { y: 0.58, x: 0.1, rz: 0.15 }));

    return finish(parts);
  },
};

export default COL_GONG_TANG;
