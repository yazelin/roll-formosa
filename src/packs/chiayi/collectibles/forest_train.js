/**
 * @file packs/chiayi/collectibles/forest_train.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_FOREST_TRAIN — 阿里山小火車 (Alishan Forest Railway model). A miniature/toy
 * version of the iconic red narrow-gauge train. Collectible-sized cute rendition.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const TRAIN_RED = 0xc82020;   // Alishan red
const TRAIN_HI = 0xe84040;   // red highlight
const WHEEL = 0x3a3a3a;       // wheel grey
const WINDOW = 0x2a4858;      // dark window

export const COL_FOREST_TRAIN = {
  id: 'forest_train',
  name: '森林小火車',
  colorHex: 0xc82020,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Toy/miniature locomotive
    const y0 = 0.1;

    // Main body
    parts.push(box(0.5, 0.28, 0.32, TRAIN_RED, { y: y0 + 0.14, hex2: TRAIN_HI }));

    // Cab
    parts.push(box(0.22, 0.2, 0.3, TRAIN_RED, { x: -0.14, y: y0 + 0.38, hex2: TRAIN_HI }));
    parts.push(box(0.15, 0.12, 0.05, WINDOW, { x: -0.14, y: y0 + 0.4, z: 0.14 }));

    // Boiler (front cylinder)
    parts.push(cyl(0.12, 0.13, 0.24, 6, TRAIN_RED, { x: 0.2, y: y0 + 0.14, rz: HALF_PI, hex2: TRAIN_HI }));

    // Smokestack
    parts.push(cyl(0.05, 0.06, 0.14, 5, 0x2a2a2a, { x: 0.2, y: y0 + 0.35 + j }));
    parts.push(cyl(0.07, 0.05, 0.05, 5, 0x3a3a3a, { x: 0.2, y: y0 + 0.44 }));

    // Headlight
    parts.push(cyl(0.035, 0.035, 0.04, 5, 0xf0e080, { x: 0.35, y: y0 + 0.18, rz: HALF_PI }));

    // Wheels
    for (const wx of [-0.12, 0.1, 0.25]) {
      parts.push(cyl(0.08, 0.08, 0.04, 6, WHEEL, { x: wx, y: 0.08, z: 0.18, rx: HALF_PI }));
      parts.push(cyl(0.08, 0.08, 0.04, 6, WHEEL, { x: wx, y: 0.08, z: -0.18, rx: HALF_PI }));
    }

    // Cute face (toy style)
    parts.push(sph(0.025, 0x101010, { ws: 3, hs: 2, x: 0.35, y: y0 + 0.22, z: 0.06 }));
    parts.push(sph(0.025, 0x101010, { ws: 3, hs: 2, x: 0.35, y: y0 + 0.22, z: -0.06 }));

    return finish(parts);
  },
};

export default COL_FOREST_TRAIN;
