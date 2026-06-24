/**
 * @file packs/kinmen/collectibles/artillery_shell.js — Roll Formosa Kinmen pack.
 *
 * 砲彈殼 (Artillery Shell Casing) — code 80. During the 1958 artillery
 * bombardment, nearly half a million shells landed on Kinmen. Now these
 * shell casings are recycled into famous Kinmen knives and souvenirs.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const BRASS_MAIN = 0xb89850;
const BRASS_DARK = 0x987840;
const BRASS_LIGHT = 0xd8b870;
const STEEL_GREY = 0x6a6a6a;

export const COL_ARTILLERY_SHELL = {
  id: 'artillery_shell',
  name: '砲彈殼',
  colorHex: BRASS_MAIN,

  buildGeometry(rng) {
    const parts = [];

    // Main shell casing (standing upright)
    parts.push(cyl(0.25, 0.22, 1.2, 6, BRASS_MAIN, { y: 0.6, hex2: BRASS_DARK }));

    // Base rim
    parts.push(cyl(0.28, 0.28, 0.08, 6, BRASS_DARK, { y: 0.04 }));

    // Base extraction groove
    parts.push(cyl(0.26, 0.26, 0.04, 6, BRASS_LIGHT, { y: 0.1 }));

    // Primer in base
    parts.push(cyl(0.08, 0.08, 0.02, 5, STEEL_GREY, { y: 0.01 }));

    // Shoulder taper toward top
    parts.push(cyl(0.22, 0.16, 0.15, 6, BRASS_MAIN, { y: 1.27 }));

    // Neck
    parts.push(cyl(0.15, 0.14, 0.1, 6, BRASS_LIGHT, { y: 1.4 }));

    // Open mouth (where bullet was)
    parts.push(cyl(0.12, 0.14, 0.04, 6, BRASS_DARK, { y: 1.47 }));

    // Embossed markings (simplified)
    parts.push(box(0.15, 0.05, 0.01, BRASS_DARK, { y: 0.3, z: 0.23, rx: 0 }));

    // Second shell lying down
    parts.push(cyl(0.18, 0.16, 0.8, 6, BRASS_DARK, { y: 0.18, x: 0.5, z: 0.1, rz: HALF_PI, hex2: BRASS_MAIN }));
    parts.push(cyl(0.2, 0.2, 0.05, 6, BRASS_MAIN, { y: 0.18, x: 0.12, z: 0.1, rz: HALF_PI }));

    // Patina / weathering
    parts.push(sph(0.06, 0x4a6a5a, { ws: 3, hs: 2, x: 0.15, y: 0.8, z: 0.15, sz: 0.3 }));

    return finish(parts);
  },
};

export default COL_ARTILLERY_SHELL;
