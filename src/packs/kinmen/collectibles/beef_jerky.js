/**
 * @file packs/kinmen/collectibles/beef_jerky.js — Roll Formosa Kinmen pack.
 *
 * 金門牛肉乾 (Kinmen Beef Jerky) — code 75. A famous local specialty,
 * Kinmen's beef jerky is known for its tender texture and savory flavor,
 * made from locally-raised cattle fed on sorghum by-products.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

const JERKY_BROWN = 0x6a3020;
const JERKY_DARK = 0x4a2010;
const JERKY_EDGE = 0x8a4030;
const PACKAGE = 0xc41e3a;
const PACKAGE_GOLD = 0xdaa520;

export const COL_BEEF_JERKY = {
  id: 'beef_jerky_col',
  name: '金門牛肉乾',
  colorHex: JERKY_BROWN,

  buildGeometry(rng) {
    const parts = [];

    // Package/bag
    parts.push(box(0.9, 0.6, 0.25, PACKAGE, { y: 0.3, hex2: 0xa81828 }));

    // Gold trim
    parts.push(box(0.92, 0.08, 0.26, PACKAGE_GOLD, { y: 0.55 }));
    parts.push(box(0.92, 0.08, 0.26, PACKAGE_GOLD, { y: 0.05 }));

    // Label area
    parts.push(box(0.5, 0.25, 0.02, 0xf0e8d0, { y: 0.32, z: 0.13 }));

    // Beef jerky pieces sticking out / displayed
    // Large piece
    parts.push(box(0.35, 0.08, 0.25, JERKY_BROWN, { y: 0.68, x: 0.1, rz: 0.1, hex2: JERKY_DARK }));
    // Irregular edges
    parts.push(sph(0.08, JERKY_EDGE, { ws: 4, hs: 2, x: 0.28, y: 0.68, z: 0.08, sy: 0.3 }));
    parts.push(sph(0.06, JERKY_EDGE, { ws: 3, hs: 2, x: -0.08, y: 0.68, z: -0.1, sy: 0.3 }));

    // Second piece
    parts.push(box(0.28, 0.06, 0.2, JERKY_BROWN, { y: 0.78, x: -0.15, rz: -0.15, hex2: JERKY_DARK }));

    // Texture lines on jerky (dried fibers)
    parts.push(box(0.25, 0.01, 0.02, JERKY_DARK, { y: 0.7, x: 0.08, z: 0.05 }));
    parts.push(box(0.2, 0.01, 0.02, JERKY_DARK, { y: 0.69, x: 0.12, z: -0.03 }));

    return finish(parts);
  },
};

export default COL_BEEF_JERKY;
