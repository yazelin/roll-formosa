/**
 * @file packs/taitung/landmarks/tiehua_village.js — Roll Formosa Taitung pack, landmark 0.
 *
 * NM_TIEHUA — 鐵花村, Taitung's iconic creative arts village with colorful
 * hot-air-balloon-shaped lanterns hanging from frames. A collection of small
 * wooden market stalls under strings of glowing colorful balloon lanterns.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const WOOD = 0x8a6a4a; // wooden stall frame
const WOOD_LO = 0x6a4a2a; // darker wood
const CANVAS = 0xf5e8d0; // market tent fabric
const LANTERN_R = 0xe84848; // red balloon lantern
const LANTERN_Y = 0xf8c848; // yellow balloon lantern
const LANTERN_G = 0x48c878; // green balloon lantern
const LANTERN_B = 0x4888e8; // blue balloon lantern
const STRING = 0x3a3a36; // hanging strings

export const NM_TIEHUA = {
  id: 'tiehua_village',
  name: '鐵花村',
  landmarkId: 0,
  dioramaRHint: 11,
  colorHex: LANTERN_R,

  buildGeometry(rng) {
    const parts = [];

    // Base platform
    parts.push(box(2.4, 0.12, 1.8, 0x888880, { y: 0.06 }));

    // Wooden market stalls (2 stalls)
    for (const sx of [-0.6, 0.6]) {
      parts.push(box(0.8, 0.06, 0.6, WOOD, { x: sx, y: 0.35, z: 0.2 })); // counter
      parts.push(box(0.06, 0.4, 0.06, WOOD_LO, { x: sx - 0.35, y: 0.2, z: 0.2 })); // leg
      parts.push(box(0.06, 0.4, 0.06, WOOD_LO, { x: sx + 0.35, y: 0.2, z: 0.2 })); // leg
      // Small awning
      parts.push(box(0.9, 0.04, 0.5, CANVAS, { x: sx, y: 0.7, z: 0.3, rx: 0.3 }));
    }

    // Tall frame posts for hanging lanterns
    for (const px of [-0.9, 0.0, 0.9]) {
      parts.push(cyl(0.04, 0.04, 1.5, 8, WOOD_LO, { x: px, y: 0.87, z: -0.4 }));
    }
    // Cross beam
    parts.push(box(2.0, 0.06, 0.06, WOOD, { y: 1.58, z: -0.4 }));

    // Hanging balloon lanterns (the iconic feature)
    const lanternColors = [LANTERN_R, LANTERN_Y, LANTERN_G, LANTERN_B, LANTERN_R, LANTERN_Y];
    for (let i = 0; i < 6; i++) {
      const lx = -0.8 + i * 0.32;
      const ly = 1.28 - (i % 2) * 0.15;
      // String
      parts.push(cyl(0.01, 0.01, 0.26, 4, STRING, { x: lx, y: ly + 0.16, z: -0.4 }));
      // Balloon shape (elongated sphere)
      parts.push(sph(0.12, lanternColors[i], {
        ws: 8, hs: 6,
        sy: 1.3,
        x: lx,
        y: ly,
        z: -0.4,
      }));
      // Bottom basket
      parts.push(box(0.06, 0.04, 0.06, WOOD_LO, { x: lx, y: ly - 0.18, z: -0.4 }));
    }

    return finish(parts);
  },
};

export default NM_TIEHUA;
