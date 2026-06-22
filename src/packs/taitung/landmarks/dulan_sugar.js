/**
 * @file packs/taitung/landmarks/dulan_sugar.js — Roll Formosa Taitung pack, landmark 4.
 *
 * NM_DULAN — 都蘭糖廠, the historic Dulan Sugar Factory, now converted into an
 * arts and culture space. Features old industrial buildings with distinctive
 * chimneys and the iconic "都蘭" signage, surrounded by art installations.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

const BRICK = 0xa86850; // red brick
const BRICK_LO = 0x885040; // darker brick
const CONCRETE = 0xb0a898; // concrete
const RUST = 0x8a5a3a; // rusty metal
const ROOF = 0x606058; // industrial roof
const TRIM = 0xd8d0c0; // light trim

export const NM_DULAN = {
  id: 'dulan_sugar',
  name: '都蘭糖廠',
  landmarkId: 4,
  dioramaRHint: 85,
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];

    // Ground platform
    parts.push(box(2.6, 0.12, 2.0, 0x706858, { y: 0.06 }));

    // Main factory building
    parts.push(box(1.4, 0.9, 1.2, BRICK, { x: -0.3, y: 0.57, hex2: BRICK_LO }));

    // Industrial sawtooth roof
    for (let i = 0; i < 3; i++) {
      parts.push(box(0.5, 0.06, 1.3, ROOF, {
        x: -0.3 + (i - 1) * 0.48,
        y: 1.06,
        rx: 0.3,
      }));
    }

    // Tall chimney (sugar factory iconic element)
    parts.push(cyl(0.12, 0.1, 1.4, 10, BRICK, {
      x: 0.7,
      y: 0.82,
      hex2: BRICK_LO,
    }));
    parts.push(cyl(0.14, 0.14, 0.12, 10, CONCRETE, { x: 0.7, y: 1.56 })); // chimney cap

    // Secondary building
    parts.push(box(0.7, 0.6, 0.8, CONCRETE, { x: 0.7, y: 0.42, z: -0.4, hex2: BRICK }));
    parts.push(box(0.8, 0.08, 0.9, ROOF, { x: 0.7, y: 0.76, z: -0.4 }));

    // Windows on main building
    for (let i = 0; i < 3; i++) {
      parts.push(box(0.18, 0.3, 0.04, 0x404850, {
        x: -0.6 + i * 0.28,
        y: 0.55,
        z: 0.61,
      }));
    }

    // Art installation (rusted metal sculpture)
    parts.push(box(0.2, 0.5, 0.2, RUST, { x: -0.9, y: 0.37, z: 0.6, ry: 0.3 }));
    parts.push(box(0.15, 0.3, 0.15, RUST, { x: -0.85, y: 0.6, z: 0.55, ry: -0.5 }));

    // "都蘭" sign board
    parts.push(box(0.6, 0.25, 0.06, TRIM, { x: -0.3, y: 0.9, z: 0.62 }));

    // Loading dock
    parts.push(box(0.4, 0.2, 0.5, CONCRETE, { x: 0.2, y: 0.22, z: 0.75 }));

    return finish(parts);
  },
};

export default NM_DULAN;
