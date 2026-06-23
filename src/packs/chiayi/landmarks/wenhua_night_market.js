/**
 * @file packs/chiayi/landmarks/wenhua_night_market.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_WENHUA_NIGHT_MARKET — 文化路夜市 (Wenhua Road Night Market). Chiayi's famous
 * night market street lined with food stalls, bright signage, and the characteristic
 * arcade awnings. Known for 雞肉飯 (turkey rice), 方塊酥, and various local snacks.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const AWNING_RED = 0xc83030;   // red market awning
const AWNING_YEL = 0xe8c020;   // yellow awning
const STALL = 0x906840;        // wooden stall frame
const SIGN_RED = 0xd82828;     // red signage
const SIGN_GOLD = 0xe8b820;    // gold signage
const NEON_PINK = 0xff6090;    // neon accent
const NEON_GREEN = 0x50ff80;   // neon accent
const ROAD = 0x484848;         // asphalt

export const NM_WENHUA_NIGHT_MARKET = {
  id: 'wenhua_night_market',
  name: '文化路夜市',
  landmarkId: 3,
  dioramaRHint: 40, // night market street
  colorHex: AWNING_RED,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Street base
    parts.push(box(4.0, 0.1, 2.5, ROAD, { y: 0.05 }));

    // Row of stalls on left side
    for (let i = 0; i < 4; i++) {
      const sx = -1.5 + i * 1.0;
      const awningColor = i % 2 === 0 ? AWNING_RED : AWNING_YEL;
      // Stall counter
      parts.push(box(0.8, 0.5, 0.6, STALL, { x: sx, y: 0.35, z: -0.85 }));
      // Awning
      parts.push(box(0.9, 0.06, 0.8, awningColor, { x: sx, y: 0.75, z: -0.7, rx: 0.2 }));
      // Support poles
      parts.push(cyl(0.03, 0.03, 0.7, 4, 0x707070, { x: sx - 0.35, y: 0.45, z: -0.4 }));
      parts.push(cyl(0.03, 0.03, 0.7, 4, 0x707070, { x: sx + 0.35, y: 0.45, z: -0.4 }));
    }

    // Row of stalls on right side
    for (let i = 0; i < 3; i++) {
      const sx = -1.0 + i * 1.0;
      const awningColor = i % 2 === 0 ? AWNING_YEL : AWNING_RED;
      parts.push(box(0.7, 0.45, 0.55, STALL, { x: sx, y: 0.325, z: 0.85 }));
      parts.push(box(0.8, 0.05, 0.7, awningColor, { x: sx, y: 0.68, z: 0.7, rx: -0.2 }));
    }

    // Large entrance arch/signage
    const archX = 1.6;
    parts.push(box(0.12, 1.2, 0.12, 0x808080, { x: archX, y: 0.7, z: -0.9 })); // left post
    parts.push(box(0.12, 1.2, 0.12, 0x808080, { x: archX, y: 0.7, z: 0.9 }));  // right post
    parts.push(box(0.35, 0.4, 2.0, SIGN_RED, { x: archX, y: 1.3, z: 0 }));      // sign board
    parts.push(box(0.28, 0.25, 1.6, SIGN_GOLD, { x: archX + 0.04, y: 1.32, z: 0 })); // gold inset

    // Hanging signboards / banners
    parts.push(box(0.5, 0.35, 0.06, SIGN_RED, { x: -0.5, y: 0.95, z: -0.35 }));
    parts.push(box(0.45, 0.3, 0.06, SIGN_GOLD, { x: 0.5, y: 0.88, z: -0.35 }));

    // Neon lights
    parts.push(cyl(0.02, 0.02, 0.8, 4, NEON_PINK, { x: -1.2, y: 1.0, z: -0.5, ry: PI / 6 }));
    parts.push(cyl(0.02, 0.02, 0.6, 4, NEON_GREEN, { x: 0.8, y: 0.95, z: 0.5, ry: -PI / 6 }));

    // Light bulbs string above street
    for (let bx = -1.5; bx <= 1.5; bx += 0.5) {
      parts.push(sph(0.04, 0xfff0a0, { ws: 4, hs: 3, x: bx + j, y: 0.95, z: 0 }));
    }

    // Steam/smoke from cooking (represented as small light spheres)
    parts.push(sph(0.08, 0xd0d0d0, { ws: 4, hs: 3, x: -0.5, y: 0.85, z: -0.7, sx: 1.2, sy: 0.8 }));

    return finish(parts);
  },
};

export default NM_WENHUA_NIGHT_MARKET;
