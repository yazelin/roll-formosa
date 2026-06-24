/**
 * @file packs/yunlin/collectibles/taro.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_TARO — 芋頭 (Taro). Yunlin produces significant amounts of taro, used in many
 * traditional dishes and desserts. The root vegetable with its distinctive purple
 * flesh and hairy brown skin.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SKIN = 0x6a5048;        // brown taro skin
const SKIN_HI = 0x8a6858;     // skin highlight
const PURPLE = 0x7a5088;      // purple flesh (exposed)
const PURPLE_HI = 0x9a70a8;   // flesh highlight
const ROOT = 0x5a4038;        // root hairs

export const COL_TARO = {
  id: 'taro',
  name: '芋頭',
  colorHex: 0x7a5088,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Main taro body (irregular oval shape)
    parts.push(sph(0.45, SKIN, {
      ws: 7, hs: 5, y: 0.4,
      sx: 0.85, sy: 1.2, sz: 0.9,
      hex2: SKIN_HI
    }));

    // Slight bump on one side (natural irregularity)
    parts.push(sph(0.18, SKIN, { ws: 5, hs: 4, x: 0.28, y: 0.35, z: 0.15, hex2: SKIN_HI }));

    // Cut section showing purple flesh
    parts.push(cyl(0.28, 0.28, 0.08, 8, PURPLE, { y: 0.75, hex2: PURPLE_HI }));
    // White speckles in flesh (characteristic of taro)
    parts.push(sph(0.04, 0xe8e0e8, { ws: 3, hs: 2, x: 0.08, y: 0.76, z: 0.1 }));
    parts.push(sph(0.03, 0xe8e0e8, { ws: 3, hs: 2, x: -0.1, y: 0.77, z: 0.05 }));
    parts.push(sph(0.025, 0xe8e0e8, { ws: 3, hs: 2, x: 0.02, y: 0.76, z: -0.12 }));

    // Root end (bottom)
    parts.push(cyl(0.12, 0.2, 0.1, 5, SKIN, { y: 0.02, hex2: SKIN_HI }));

    // Root hairs/fibers
    parts.push(cyl(0.015, 0.02, 0.12, 3, ROOT, { x: -0.15, y: -0.04, rz: 0.3 + j }));
    parts.push(cyl(0.015, 0.02, 0.1, 3, ROOT, { x: 0.12, y: -0.03, rz: -0.25 }));
    parts.push(cyl(0.012, 0.018, 0.08, 3, ROOT, { x: 0.05, y: -0.02, z: 0.1, rz: -0.1 }));
    parts.push(cyl(0.012, 0.018, 0.09, 3, ROOT, { x: -0.08, y: -0.03, z: -0.08, rz: 0.2 }));

    return finish(parts);
  },
};

export default COL_TARO;
