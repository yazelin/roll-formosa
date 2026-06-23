/**
 * @file packs/yunlin/collectibles/rice_bowl.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_RICE_BOWL — 碗粿 (Rice Bowl Cake / Wa Gui). Traditional steamed rice cake
 * served in a small bowl, a beloved snack in Yunlin and southern Taiwan. The
 * translucent white rice cake with savory toppings.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BOWL = 0xf0e8d8;       // ceramic bowl
const BOWL_RIM = 0xd8cbb8;   // bowl rim shadow
const RICE_CAKE = 0xf8f4f0;  // white rice cake
const RICE_HI = 0xffffff;    // rice cake highlight
const MEAT = 0x8a5a3a;       // pork topping
const SAUCE = 0x604030;      // soy sauce
const EGG = 0xf0d860;        // egg yolk

export const COL_RICE_BOWL = {
  id: 'rice_bowl',
  name: '碗粿',
  colorHex: 0xf8f4f0,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.015;
    const parts = [];

    // Bowl - outer
    parts.push(cyl(0.45, 0.38, 0.35, 8, BOWL, { y: 0.175, hex2: BOWL_RIM }));

    // Bowl rim
    parts.push(cyl(0.47, 0.47, 0.04, 8, BOWL_RIM, { y: 0.37 }));

    // Rice cake inside bowl (smooth white surface)
    parts.push(cyl(0.38, 0.36, 0.28, 8, RICE_CAKE, { y: 0.32, hex2: RICE_HI }));

    // Rice cake top surface (slightly domed)
    parts.push(sph(0.34, RICE_CAKE, { ws: 6, hs: 3, y: 0.48, sy: 0.25, thetaLen: HALF_PI }));

    // Sauce drizzle on top
    parts.push(box(0.25, 0.02, 0.06, SAUCE, { y: 0.52, ry: 0.3 + j }));
    parts.push(box(0.2, 0.02, 0.05, SAUCE, { y: 0.51, ry: -0.4, x: 0.05 }));

    // Meat topping pieces
    parts.push(box(0.12, 0.04, 0.1, MEAT, { x: -0.1, y: 0.54, z: 0.08, ry: 0.2 }));
    parts.push(box(0.1, 0.035, 0.08, MEAT, { x: 0.12, y: 0.535, z: -0.05, ry: -0.3 }));

    // Egg yolk piece
    parts.push(sph(0.08, EGG, { ws: 4, hs: 3, x: 0.05, y: 0.55, z: 0.12, sy: 0.5 }));

    return finish(parts);
  },
};

export default COL_RICE_BOWL;
