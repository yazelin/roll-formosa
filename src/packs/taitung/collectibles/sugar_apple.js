/**
 * @file packs/taitung/collectibles/sugar_apple.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_SUGAR_APPLE — 釋迦 (Sugar Apple / Custard Apple). Taitung's signature
 * fruit, with its distinctive bumpy green skin divided into segments like
 * a closed pine cone or scaly dragon fruit.
 */

import { sph, box, finish, PI } from '../geomHelpers.js';

export const COL_SUGAR_APPLE = {
  id: 'col_sugar_apple',
  name: '釋迦',
  collectibleId: 0,
  colorHex: 0x5a8a4a,

  buildGeometry(rng) {
    const GREEN = 0x5a8a4a;
    const GREEN_LO = 0x4a7a3a;
    const STEM = 0x5a4030;

    const parts = [];

    // Main fruit body - low-poly bumpy sphere
    parts.push(sph(0.9, GREEN, { ws: 6, hs: 5, hex2: GREEN_LO }));

    // Simplified bumps ring (6 bumps around middle)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      parts.push(sph(0.2, GREEN_LO, {
        ws: 3, hs: 2,
        x: Math.cos(a) * 0.65,
        z: Math.sin(a) * 0.65,
        y: 0.1,
      }));
    }

    // Top crown (single bump)
    parts.push(sph(0.18, GREEN_LO, { ws: 3, hs: 2, y: 0.75 }));

    // Stem at top
    parts.push(box(0.08, 0.2, 0.08, STEM, { y: 0.95 }));

    return finish(parts);
  },
};

export default COL_SUGAR_APPLE;
