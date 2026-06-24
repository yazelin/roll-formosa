/**
 * @file packs/kinmen/collectibles/knife.js — Roll Formosa Kinmen pack.
 *
 * 金門菜刀 (Kinmen Kitchen Knife) — code 76. Famous knives forged from
 * recycled artillery shells fired from mainland China. The high-quality
 * steel makes excellent kitchen knives, turning weapons into tools.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const BLADE_STEEL = 0xc0c8d0;
const BLADE_EDGE = 0xe0e8f0;
const BLADE_DARK = 0x8090a0;
const HANDLE_WOOD = 0x5a3a20;
const HANDLE_DARK = 0x3a2010;
const RIVET = 0xb0a090;

export const COL_KNIFE = {
  id: 'knife',
  name: '金門菜刀',
  colorHex: BLADE_STEEL,

  buildGeometry(rng) {
    const parts = [];

    // Blade body (wide Chinese cleaver style)
    parts.push(box(0.9, 0.5, 0.04, BLADE_STEEL, { y: 0.5, x: 0.2, hex2: BLADE_DARK }));

    // Blade edge (sharpened bottom)
    parts.push(box(0.92, 0.03, 0.02, BLADE_EDGE, { y: 0.24, x: 0.2 }));

    // Blade spine (top, thicker)
    parts.push(box(0.88, 0.04, 0.05, BLADE_DARK, { y: 0.76, x: 0.2 }));

    // Handle
    parts.push(box(0.35, 0.12, 0.08, HANDLE_WOOD, { y: 0.5, x: -0.4, hex2: HANDLE_DARK }));

    // Handle rivets
    parts.push(cyl(0.025, 0.025, 0.09, 5, RIVET, { x: -0.32, y: 0.5, rz: HALF_PI }));
    parts.push(cyl(0.025, 0.025, 0.09, 5, RIVET, { x: -0.48, y: 0.5, rz: HALF_PI }));

    // Tang (blade metal extending into handle)
    parts.push(box(0.15, 0.08, 0.02, BLADE_DARK, { y: 0.5, x: -0.3 }));

    // Bolster (where blade meets handle)
    parts.push(box(0.04, 0.14, 0.06, BLADE_DARK, { y: 0.5, x: -0.2 }));

    // Reflection / polish line on blade
    parts.push(box(0.6, 0.02, 0.01, BLADE_EDGE, { y: 0.55, x: 0.25, z: 0.022 }));

    // Second knife underneath (showing it's a set)
    parts.push(box(0.85, 0.45, 0.035, BLADE_DARK, { y: 0.12, x: 0.22, hex2: BLADE_STEEL }));
    parts.push(box(0.3, 0.1, 0.07, HANDLE_DARK, { y: 0.12, x: -0.38 }));

    return finish(parts);
  },
};

export default COL_KNIFE;
