/**
 * @file packs/chiayi/collectibles/black_bear.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_BLACK_BEAR — 台灣黑熊 (Formosan Black Bear). Taiwan's iconic endemic bear with
 * the distinctive white V-shaped chest mark. This is a shared Taiwan-wide collectible.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BLACK = 0x1a1a1a;
const BLACK_HI = 0x2a2a2a;
const V_MARK = 0xf0e8d8; // white V chest mark
const NOSE = 0x3a3030;

export const COL_BLACK_BEAR = {
  id: 'black_bear',
  name: '台灣黑熊',
  colorHex: 0x1a1a1a,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Body
    parts.push(sph(0.55, BLACK, { ws: 7, hs: 5, y: 0.4, sx: 0.9, sy: 0.75, sz: 0.85, hex2: BLACK_HI }));

    // V-mark on chest
    parts.push(cone(0.15, 0.22, 3, V_MARK, { y: 0.35, z: 0.42, rx: 0.3 }));

    // Head
    parts.push(sph(0.32, BLACK, { ws: 6, hs: 4, y: 0.85, z: 0.15, hex2: BLACK_HI }));

    // Ears
    parts.push(sph(0.1, BLACK, { ws: 4, hs: 3, x: -0.18, y: 1.05, z: 0.05 }));
    parts.push(sph(0.1, BLACK, { ws: 4, hs: 3, x: 0.18, y: 1.05, z: 0.05 }));

    // Snout
    parts.push(sph(0.12, NOSE, { ws: 4, hs: 3, y: 0.78, z: 0.38 + j }));

    // Eyes
    parts.push(sph(0.04, 0x101010, { ws: 3, hs: 2, x: -0.1, y: 0.9, z: 0.32 }));
    parts.push(sph(0.04, 0x101010, { ws: 3, hs: 2, x: 0.1, y: 0.9, z: 0.32 }));

    // Legs
    for (const lx of [-0.22, 0.22]) {
      parts.push(cyl(0.11, 0.12, 0.35, 5, BLACK, { x: lx, y: 0.175, z: -0.15 }));
      parts.push(cyl(0.11, 0.12, 0.35, 5, BLACK, { x: lx, y: 0.175, z: 0.2 }));
    }

    return finish(parts);
  },
};

export default COL_BLACK_BEAR;
