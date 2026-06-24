/**
 * @file packs/kinmen/collectibles/kinmen_noodles.js — Roll Formosa Kinmen pack.
 *
 * 金門麵線 (Kinmen Thin Noodles) — code 77. Traditional sun-dried wheat noodles
 * made on Kinmen. Often served in soup with local stone oysters or with
 * sesame oil and egg - a classic comfort food.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const BOWL_BLUE = 0x3a5a8a;
const BOWL_WHITE = 0xf8f8f0;
const NOODLE_CREAM = 0xf4e8c8;
const SOUP = 0xe0c8a0;
const OYSTER = 0x8a8a7a;
const EGG_YELLOW = 0xf0c040;
const CILANTRO = 0x4a8a3a;

export const COL_KINMEN_NOODLES = {
  id: 'kinmen_noodles',
  name: '金門麵線',
  colorHex: NOODLE_CREAM,

  buildGeometry(rng) {
    const parts = [];

    // Bowl
    parts.push(cyl(0.55, 0.65, 0.4, 10, BOWL_BLUE, { y: 0.2, hex2: BOWL_WHITE }));
    parts.push(cyl(0.5, 0.5, 0.02, 10, BOWL_WHITE, { y: 0.38 })); // rim
    parts.push(cyl(0.3, 0.3, 0.05, 8, BOWL_BLUE, { y: 0.025 })); // base

    // Soup
    parts.push(cyl(0.48, 0.48, 0.08, 10, SOUP, { y: 0.42 }));

    // Thin noodles (coiled strands)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      const r = 0.2 + (i % 2) * 0.1;
      parts.push(cyl(0.04, 0.04, 0.35, 4, NOODLE_CREAM, {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 0.55,
        rx: 0.3 + rng() * 0.3,
        rz: rng() * 0.4,
      }));
    }

    // Stone oysters
    parts.push(sph(0.08, OYSTER, { ws: 4, hs: 3, x: 0.15, z: 0.1, y: 0.52, sy: 0.5 }));
    parts.push(sph(0.06, OYSTER, { ws: 3, hs: 2, x: -0.12, z: 0.15, y: 0.5, sy: 0.5 }));
    parts.push(sph(0.07, OYSTER, { ws: 4, hs: 3, x: 0.05, z: -0.18, y: 0.51, sy: 0.5 }));

    // Poached egg
    parts.push(sph(0.1, EGG_YELLOW, { ws: 5, hs: 3, x: -0.1, z: -0.05, y: 0.55, sy: 0.4 }));

    // Cilantro garnish
    parts.push(sph(0.05, CILANTRO, { ws: 3, hs: 2, x: 0.22, z: -0.08, y: 0.52, sy: 0.3 }));
    parts.push(sph(0.04, CILANTRO, { ws: 3, hs: 2, x: 0.18, z: 0.15, y: 0.51, sy: 0.3 }));

    // Chopsticks
    parts.push(cyl(0.02, 0.015, 0.6, 4, 0x6a4020, { x: 0.4, y: 0.5, rz: 0.8, rx: 0.1 }));
    parts.push(cyl(0.02, 0.015, 0.6, 4, 0x6a4020, { x: 0.35, y: 0.52, rz: 0.75, rx: 0.15 }));

    return finish(parts);
  },
};

export default COL_KINMEN_NOODLES;
