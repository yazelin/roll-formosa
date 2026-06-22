/**
 * @file packs/taitung/landmarks/amis_cultural.js — Roll Formosa Taitung pack, landmark 6.
 *
 * NM_AMIS — 阿美族民俗中心, the Amis Folk Center showcasing the largest
 * indigenous group in Taiwan. Features traditional A-frame thatched-roof houses,
 * totem poles with geometric tribal patterns, and ceremonial gathering spaces.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const THATCH = 0x9a8a5a; // dried grass thatch
const THATCH_LO = 0x7a6a3a; // darker thatch
const WOOD = 0x6a4a2a; // dark wood posts
const BAMBOO = 0xa89a6a; // bamboo walls
const TOTEM_R = 0xc84040; // red tribal paint
const TOTEM_B = 0x3a5a8a; // blue tribal pattern
const TOTEM_Y = 0xe8c040; // yellow pattern
const STONE = 0x8a8a80; // stone base

export const NM_AMIS = {
  id: 'amis_cultural',
  name: '阿美族民俗中心',
  landmarkId: 6,
  dioramaRHint: 150,
  colorHex: TOTEM_R,

  buildGeometry(rng) {
    const parts = [];

    // Ground base
    parts.push(box(2.8, 0.12, 2.2, 0x706050, { y: 0.06 }));

    // Main A-frame traditional house
    // Stone foundation platform
    parts.push(box(1.3, 0.15, 1.1, STONE, { x: -0.4, y: 0.19 }));

    // A-frame thatch roof (main visual)
    parts.push(box(1.5, 0.08, 1.3, THATCH, {
      x: -0.4,
      y: 0.8,
      rx: 0.6,
      hex2: THATCH_LO,
    }));
    parts.push(box(1.5, 0.08, 1.3, THATCH_LO, {
      x: -0.4,
      y: 0.8,
      rx: -0.6,
    }));

    // Bamboo wall panels
    parts.push(box(0.05, 0.45, 0.9, BAMBOO, { x: -1.05, y: 0.5 }));
    parts.push(box(0.05, 0.45, 0.9, BAMBOO, { x: 0.25, y: 0.5 }));

    // Support posts
    for (const px of [-0.9, 0.1]) {
      parts.push(cyl(0.06, 0.06, 0.8, 8, WOOD, { x: px, y: 0.5, z: 0.4 }));
      parts.push(cyl(0.06, 0.06, 0.8, 8, WOOD, { x: px, y: 0.5, z: -0.4 }));
    }

    // Totem pole (ceremonial, with geometric patterns)
    parts.push(cyl(0.12, 0.1, 1.6, 8, WOOD, { x: 0.9, y: 0.92 }));
    // Pattern bands
    parts.push(cyl(0.13, 0.13, 0.15, 8, TOTEM_R, { x: 0.9, y: 0.4 }));
    parts.push(cyl(0.13, 0.13, 0.15, 8, TOTEM_Y, { x: 0.9, y: 0.7 }));
    parts.push(cyl(0.13, 0.13, 0.15, 8, TOTEM_B, { x: 0.9, y: 1.0 }));
    parts.push(cyl(0.13, 0.13, 0.15, 8, TOTEM_R, { x: 0.9, y: 1.3 }));
    // Carved top figure (stylized)
    parts.push(sph(0.14, WOOD, { ws: 6, hs: 4, x: 0.9, y: 1.78, sy: 0.8 }));

    // Smaller totem
    parts.push(cyl(0.08, 0.07, 1.0, 8, WOOD, { x: 1.1, y: 0.62, z: 0.5 }));
    parts.push(cyl(0.09, 0.09, 0.1, 8, TOTEM_Y, { x: 1.1, y: 0.5, z: 0.5 }));
    parts.push(cyl(0.09, 0.09, 0.1, 8, TOTEM_R, { x: 1.1, y: 0.8, z: 0.5 }));

    // Ceremonial fire pit area
    parts.push(cyl(0.3, 0.3, 0.08, 10, STONE, { x: 0.3, y: 0.16, z: -0.6 }));
    parts.push(cyl(0.18, 0.18, 0.06, 8, 0x3a3030, { x: 0.3, y: 0.2, z: -0.6 })); // ash

    // Hanging decorations (beads/feathers)
    for (let i = 0; i < 4; i++) {
      parts.push(box(0.02, 0.18, 0.02, i % 2 ? TOTEM_R : TOTEM_Y, {
        x: -0.4 + i * 0.15,
        y: 0.85,
        z: 0.55,
      }));
    }

    return finish(parts);
  },
};

export default NM_AMIS;
