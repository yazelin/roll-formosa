/**
 * @file packs/yunlin/collectibles/straw_hat.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_STRAW_HAT — 斗笠 (Farmer's Straw Hat). The iconic conical bamboo hat worn by
 * farmers in Yunlin's agricultural fields. Woven from bamboo strips with a wide brim
 * for sun protection during rice planting and harvest.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cone, cyl, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const STRAW = 0xc8a860;       // bamboo straw color
const STRAW_HI = 0xe0c880;    // straw highlight
const STRAW_DARK = 0xa88840;  // straw shadow/weave
const BAND = 0x6a4830;        // dark band
const CORD = 0x4a3020;        // chin cord

export const COL_STRAW_HAT = {
  id: 'straw_hat',
  name: '斗笠',
  colorHex: 0xc8a860,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Main conical hat shape
    parts.push(cone(0.7, 0.6, 12, STRAW, { y: 0.3, hex2: STRAW_HI }));

    // Pointed top
    parts.push(cone(0.08, 0.15, 6, STRAW_DARK, { y: 0.65 }));

    // Brim edge ring
    parts.push(torus(0.68, 0.03, 3, 12, STRAW_DARK, { y: 0.02, rx: HALF_PI }));

    // Inner brim (underside visible)
    parts.push(cyl(0.65, 0.3, 0.02, 10, STRAW_DARK, { y: 0.01 }));

    // Weave pattern rings (horizontal bands)
    parts.push(torus(0.55, 0.015, 3, 10, STRAW_DARK, { y: 0.12 + j, rx: HALF_PI }));
    parts.push(torus(0.42, 0.015, 3, 10, STRAW_DARK, { y: 0.22, rx: HALF_PI }));
    parts.push(torus(0.28, 0.015, 3, 10, STRAW_DARK, { y: 0.32, rx: HALF_PI }));
    parts.push(torus(0.15, 0.015, 3, 10, STRAW_DARK, { y: 0.42, rx: HALF_PI }));

    // Dark band around lower part
    parts.push(torus(0.62, 0.025, 3, 10, BAND, { y: 0.08, rx: HALF_PI }));

    // Chin cord attachment points
    parts.push(cyl(0.025, 0.025, 0.06, 4, CORD, { x: -0.5, y: -0.02, z: 0 }));
    parts.push(cyl(0.025, 0.025, 0.06, 4, CORD, { x: 0.5, y: -0.02, z: 0 }));

    // Chin cord (hanging)
    parts.push(cyl(0.015, 0.015, 0.25, 3, CORD, { x: -0.5, y: -0.17, rz: 0.3 }));
    parts.push(cyl(0.015, 0.015, 0.25, 3, CORD, { x: 0.5, y: -0.17, rz: -0.3 }));

    return finish(parts);
  },
};

export default COL_STRAW_HAT;
