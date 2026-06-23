/**
 * @file packs/changhua/collectibles/meatball.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_MEATBALL — 彰化肉圓 (Changhua meatball), the signature dish of Changhua.
 * Silhouette: a translucent, dome-shaped dumpling with a chewy tapioca/rice
 * skin filled with meat, bamboo shoots, and topped with sweet soy sauce and
 * cilantro. The see-through skin with the darker filling visible inside is
 * the distinctive visual. Usually served in a small bowl.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI } from '../geomHelpers.js';

const SKIN = 0xe8dcc0;        // translucent tapioca skin
const SKIN_HI = 0xf0e8d4;     // lighter highlight
const FILLING = 0x8a6848;     // meat filling visible through skin
const SAUCE = 0x6a4028;       // sweet soy sauce
const CILANTRO = 0x48a848;    // green cilantro topping
const BOWL = 0xf8f0e0;        // white bowl

export const COL_MEATBALL = {
  id: 'meatball',
  name: '彰化肉圓',
  collectibleId: 1,
  colorHex: SKIN,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201);
    const parts = [];

    // White serving bowl
    parts.push(cyl(0.80, 0.70, 0.30, 10, BOWL, { y: 0.15, open: true }));
    parts.push(cyl(0.65, 0.65, 0.04, 8, BOWL, { y: 0.02 }));

    // Meatball - dome shape with visible filling
    // Filling visible through translucent skin (draw filling first)
    parts.push(sph(0.45, FILLING + t, { ws: 8, hs: 6, y: 0.55, sy: 0.75 }));
    // Translucent skin layer
    parts.push(sph(0.52, SKIN, { ws: 10, hs: 6, y: 0.55, sy: 0.80, thetaLen: HALF_PI, hex2: SKIN_HI }));

    // Sweet soy sauce drizzle on top
    parts.push(sph(0.48, SAUCE, { ws: 8, hs: 3, y: 0.75, sy: 0.15, thetaLen: HALF_PI }));

    // Cilantro garnish
    parts.push(box(0.12, 0.04, 0.08, CILANTRO, { x: -0.10, y: 0.82, z: 0.05 }));
    parts.push(box(0.10, 0.04, 0.10, CILANTRO, { x: 0.08, y: 0.82, z: -0.06 }));

    return finish(parts);
  },
};

export default COL_MEATBALL;
