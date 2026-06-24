/**
 * @file packs/kinmen/collectibles/mazu.js — Roll Formosa Kinmen pack.
 *
 * 媽祖神像 (Mazu Goddess Figurine) — code 94 (v5). A small devotional statue
 * of Mazu, the sea goddess widely worshipped in Kinmen and Taiwan. She
 * protects fishermen and sailors.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const ROBE_RED = 0xc41e3a;
const ROBE_GOLD = 0xdaa520;
const FACE = 0xf5deb3;
const CROWN = 0xffd700;
const BASE_WOOD = 0x6a4a2a;

export const COL_MAZU = {
  id: 'mazu',
  name: '媽祖神像',
  colorHex: ROBE_RED,

  buildGeometry(rng) {
    const parts = [];

    // Wooden base
    parts.push(cyl(0.35, 0.38, 0.1, 6, BASE_WOOD, { y: 0.05 }));

    // Lower robe (flowing skirt)
    parts.push(cyl(0.32, 0.18, 0.6, 6, ROBE_RED, { y: 0.4, hex2: ROBE_GOLD }));

    // Robe layers
    parts.push(cyl(0.34, 0.2, 0.1, 6, ROBE_GOLD, { y: 0.2 }));

    // Upper body
    parts.push(cyl(0.18, 0.14, 0.35, 6, ROBE_RED, { y: 0.87 }));

    // Arms (blessing pose)
    parts.push(cyl(0.05, 0.04, 0.25, 4, ROBE_RED, { x: -0.15, y: 0.85, rz: 0.5 }));
    parts.push(cyl(0.05, 0.04, 0.25, 4, ROBE_RED, { x: 0.15, y: 0.85, rz: -0.5 }));
    // Hands
    parts.push(sph(0.05, FACE, { ws: 3, hs: 2, x: -0.32, y: 1.0 }));
    parts.push(sph(0.05, FACE, { ws: 3, hs: 2, x: 0.32, y: 1.0 }));

    // Neck
    parts.push(cyl(0.06, 0.055, 0.08, 4, FACE, { y: 1.08 }));

    // Head
    parts.push(sph(0.12, FACE, { ws: 5, hs: 4, y: 1.2 }));

    // Crown / headdress
    parts.push(cyl(0.14, 0.1, 0.08, 5, CROWN, { y: 1.32 }));
    parts.push(box(0.18, 0.1, 0.04, CROWN, { y: 1.4 })); // front panel
    parts.push(cyl(0.08, 0.05, 0.08, 4, CROWN, { y: 1.48 })); // top

    // Halo
    parts.push(cyl(0.2, 0.2, 0.015, 6, CROWN, { y: 1.2, z: -0.1, rx: HALF_PI * 0.1 }));

    return finish(parts);
  },
};

export default COL_MAZU;
