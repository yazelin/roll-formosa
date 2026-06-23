/**
 * @file packs/taitung/collectibles/hot_air_balloon.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_HOT_AIR_BALLOON — 熱氣球 (Hot Air Balloon). Taitung's famous annual
 * hot air balloon festival at Luye Highland, featuring colorful balloons
 * rising over the scenic valley.
 */

import { sph, box, cyl, finish, PI } from '../geomHelpers.js';

export const COL_HOT_AIR_BALLOON = {
  id: 'col_hot_air_balloon',
  name: '熱氣球',
  collectibleId: 4,
  colorHex: 0xe84848,

  buildGeometry(rng) {
    const ENVELOPE_R = 0xe84848;
    const ENVELOPE_Y = 0xf8c848;
    const ENVELOPE_B = 0x4888e8;
    const BASKET = 0x8a6a4a;
    const ROPE = 0x5a5048;
    const BURNER = 0x606060;

    const parts = [];

    // Balloon envelope (teardrop shape)
    parts.push(sph(0.7, ENVELOPE_R, {
      ws: 12, hs: 8,
      sy: 1.4,
      y: 0.7,
      hex2: ENVELOPE_Y,
    }));

    // Decorative stripes
    for (let i = -2; i <= 2; i++) {
      parts.push(cyl(0.72 - Math.abs(i) * 0.08, 0.72 - Math.abs(i) * 0.08, 0.08, 12, i % 2 ? ENVELOPE_B : ENVELOPE_Y, {
        y: 0.7 + i * 0.25,
      }));
    }

    // Envelope opening at bottom
    parts.push(cyl(0.25, 0.25, 0.1, 10, 0x3a3030, { y: -0.1 }));

    // Burner and frame
    parts.push(cyl(0.08, 0.08, 0.15, 8, BURNER, { y: -0.2 }));

    // Suspension ropes
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2;
      parts.push(cyl(0.015, 0.015, 0.35, 4, ROPE, {
        x: Math.cos(a) * 0.15,
        z: Math.sin(a) * 0.15,
        y: -0.4,
      }));
    }

    // Wicker basket
    parts.push(box(0.28, 0.18, 0.28, BASKET, { y: -0.68 }));
    // Basket rim
    parts.push(cyl(0.17, 0.17, 0.04, 8, 0x6a4a2a, { y: -0.57 }));

    return finish(parts);
  },
};

export default COL_HOT_AIR_BALLOON;
