/**
 * @file packs/penghu/collectibles/aloe_product.js — Roll Formosa Penghu pack.
 *
 * COL_ALOE — 蘆薈產品 (Aloe Product), Penghu's natural aloe vera products.
 * The islands are known for their aloe cultivation due to the sunny climate.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BOTTLE = 0xe0f0e8; // green-tinted bottle
const GEL = 0x90d090; // green aloe gel
const CAP = 0x40a060; // green cap
const LABEL = 0xf8f4f0; // white label

export const COL_ALOE = {
  id: 'aloe_product',
  name: '蘆薈產品',
  collectibleId: 9,
  colorHex: GEL,

  buildGeometry(rng) {
    const parts = [];

    // Bottle body
    parts.push(cyl(0.32, 0.32, 1.0, 10, BOTTLE, { y: 0.5, hex2: 0xc8e0d8 }));

    // Bottle neck
    parts.push(cyl(0.18, 0.2, 0.25, 8, BOTTLE, { y: 1.12 }));

    // Cap
    parts.push(cyl(0.22, 0.22, 0.18, 8, CAP, { y: 1.32 }));

    // Label
    parts.push(box(0.5, 0.5, 0.02, LABEL, { y: 0.55, z: 0.31 }));
    // Label text (green bar)
    parts.push(box(0.4, 0.15, 0.025, CAP, { y: 0.55, z: 0.32 }));

    // Visible gel inside (slightly darker area)
    parts.push(cyl(0.28, 0.28, 0.85, 8, GEL, { y: 0.48, hex2: 0x70b070 }));

    return finish(parts);
  },
};

export default COL_ALOE;
