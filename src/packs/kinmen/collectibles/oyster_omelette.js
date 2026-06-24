/**
 * @file packs/kinmen/collectibles/oyster_omelette.js — Roll Formosa Kinmen pack.
 *
 * 石蚵煎 (Kinmen Oyster Omelette) — code 74. Kinmen's stone oysters are
 * famous for being grown on granite rocks. The oyster omelette is a local
 * specialty featuring these unique small, sweet oysters.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const PLATE_WHITE = 0xf8f8f0;
const EGG_YELLOW = 0xf0c040;
const EGG_BROWN = 0xc89030;
const OYSTER_GREY = 0x8a8a7a;
const SAUCE_RED = 0xc04020;
const GREENS = 0x4a8a3a;

export const COL_OYSTER_OMELETTE = {
  id: 'oyster_omelette',
  name: '石蚵煎',
  colorHex: EGG_YELLOW,

  buildGeometry(rng) {
    const parts = [];

    // Plate
    parts.push(cyl(0.7, 0.72, 0.06, 10, PLATE_WHITE, { y: 0.03 }));
    parts.push(cyl(0.6, 0.6, 0.02, 10, 0xf0f0e8, { y: 0.07 }));

    // Omelette base (irregular shape)
    parts.push(sph(0.45, EGG_YELLOW, { ws: 7, hs: 4, y: 0.15, sy: 0.2, hex2: EGG_BROWN }));

    // Crispy edges
    parts.push(sph(0.15, EGG_BROWN, { ws: 4, hs: 2, x: 0.35, z: 0.1, y: 0.12, sy: 0.15 }));
    parts.push(sph(0.12, EGG_BROWN, { ws: 4, hs: 2, x: -0.32, z: -0.15, y: 0.12, sy: 0.15 }));

    // Stone oysters (small grey lumps)
    parts.push(sph(0.08, OYSTER_GREY, { ws: 4, hs: 3, x: 0.1, z: 0.15, y: 0.2, sy: 0.6 }));
    parts.push(sph(0.07, OYSTER_GREY, { ws: 4, hs: 3, x: -0.15, z: 0.05, y: 0.18, sy: 0.6 }));
    parts.push(sph(0.06, OYSTER_GREY, { ws: 3, hs: 2, x: 0.0, z: -0.12, y: 0.17, sy: 0.5 }));
    parts.push(sph(0.07, OYSTER_GREY, { ws: 4, hs: 3, x: 0.18, z: -0.08, y: 0.19, sy: 0.6 }));
    parts.push(sph(0.05, OYSTER_GREY, { ws: 3, hs: 2, x: -0.08, z: 0.2, y: 0.18, sy: 0.5 }));

    // Sweet chili sauce drizzle
    parts.push(box(0.25, 0.02, 0.04, SAUCE_RED, { y: 0.24, z: 0.0, rz: 0.2 }));
    parts.push(box(0.18, 0.02, 0.04, SAUCE_RED, { y: 0.24, x: 0.08, z: 0.1, rz: -0.3 }));

    // Cilantro / greens garnish
    parts.push(sph(0.06, GREENS, { ws: 4, hs: 2, x: 0.25, z: 0.2, y: 0.18, sy: 0.3 }));
    parts.push(sph(0.05, GREENS, { ws: 3, hs: 2, x: -0.22, z: 0.18, y: 0.17, sy: 0.3 }));

    return finish(parts);
  },
};

export default COL_OYSTER_OMELETTE;
