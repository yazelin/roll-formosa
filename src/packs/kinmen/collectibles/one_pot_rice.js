/**
 * @file packs/kinmen/collectibles/one_pot_rice.js — Roll Formosa Kinmen pack.
 *
 * 廣東粥 (Kinmen Congee / One Pot Rice) — code 81. A unique Kinmen breakfast
 * where rice is cooked until it breaks down completely into a smooth porridge,
 * served with various toppings like meat, fish, and eggs.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const BOWL_BLUE = 0x3a5a8a;
const BOWL_WHITE = 0xf8f8f0;
const CONGEE = 0xf8f4e8;
const MEAT_BROWN = 0x8a5030;
const EGG_YELLOW = 0xf0c040;
const GREENS = 0x4a8a3a;
const FISH_GREY = 0xa0a090;

export const COL_ONE_POT_RICE = {
  id: 'one_pot_rice',
  name: '廣東粥',
  colorHex: CONGEE,

  buildGeometry(rng) {
    const parts = [];

    // Bowl
    parts.push(cyl(0.6, 0.68, 0.35, 10, BOWL_BLUE, { y: 0.175, hex2: BOWL_WHITE }));
    parts.push(cyl(0.55, 0.55, 0.02, 10, BOWL_WHITE, { y: 0.35 })); // rim
    parts.push(cyl(0.28, 0.28, 0.04, 8, BOWL_BLUE, { y: 0.02 })); // base

    // Congee (smooth rice porridge)
    parts.push(cyl(0.52, 0.52, 0.06, 10, CONGEE, { y: 0.38 }));

    // Meat slices (pork/beef)
    parts.push(box(0.15, 0.03, 0.1, MEAT_BROWN, { y: 0.43, x: 0.15, z: 0.1, rz: 0.2 }));
    parts.push(box(0.12, 0.03, 0.08, MEAT_BROWN, { y: 0.44, x: -0.1, z: 0.2, rz: -0.15 }));

    // Fish pieces
    parts.push(sph(0.08, FISH_GREY, { ws: 4, hs: 3, x: 0.2, z: -0.15, y: 0.42, sy: 0.4 }));
    parts.push(sph(0.06, FISH_GREY, { ws: 3, hs: 2, x: -0.18, z: -0.1, y: 0.41, sy: 0.4 }));

    // Egg (poached or century egg)
    parts.push(sph(0.1, EGG_YELLOW, { ws: 5, hs: 3, x: 0, z: 0.05, y: 0.45, sy: 0.35 }));

    // Green onion / cilantro
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2 + rng() * 0.5;
      const r = 0.25 + rng() * 0.15;
      parts.push(box(0.08, 0.01, 0.02, GREENS, {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 0.44,
        ry: a,
      }));
    }

    // Fried dough stick (youtiao) on side
    parts.push(cyl(0.04, 0.035, 0.35, 5, 0xd4a050, { x: 0.5, y: 0.25, rz: 0.3, hex2: 0xc08030 }));
    parts.push(cyl(0.04, 0.035, 0.35, 5, 0xd4a050, { x: 0.55, y: 0.22, rz: 0.4, hex2: 0xc08030 }));

    // Spoon
    parts.push(sph(0.08, 0xf0f0e8, { ws: 5, hs: 3, x: -0.45, y: 0.3, z: 0.15, sy: 0.4, sz: 0.6 }));
    parts.push(cyl(0.02, 0.015, 0.2, 4, 0xf0f0e8, { x: -0.55, y: 0.32, z: 0.3, rz: 0.6 }));

    return finish(parts);
  },
};

export default COL_ONE_POT_RICE;
