/**
 * @file packs/taitung/landmarks/luye_balloon.js — Roll Formosa Taitung pack, landmark 5.
 *
 * NM_LUYE_BALLOON — 鹿野高台熱氣球, the iconic Luye Highland Hot Air Balloon
 * Festival site. Features a grassy highland platform with colorful hot air
 * balloons tethered and ready for flight, a major summer attraction.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const GRASS = 0x5a8a3a; // highland grass
const GRASS_LO = 0x4a7a2a; // grass shadow
const ENVELOPE_R = 0xe84848; // red balloon
const ENVELOPE_Y = 0xf8c848; // yellow balloon
const ENVELOPE_B = 0x4888e8; // blue balloon
const BASKET = 0x8a6a4a; // wicker basket
const ROPE = 0x5a5048; // tether rope
const PLATFORM = 0xc0b8a8; // viewing platform

export const NM_LUYE_BALLOON = {
  id: 'luye_balloon',
  name: '鹿野高台熱氣球',
  landmarkId: 5,
  dioramaRHint: 115,
  colorHex: ENVELOPE_R,

  buildGeometry(rng) {
    const parts = [];

    // Highland grass base (gently sloped)
    parts.push(box(2.8, 0.18, 2.2, GRASS, { y: 0.09, hex2: GRASS_LO }));

    // Main balloon (center, largest)
    // Envelope
    parts.push(sph(0.55, ENVELOPE_R, {
      ws: 12, hs: 8,
      sy: 1.3,
      y: 1.4,
      hex2: 0xc83838,
    }));
    // Basket
    parts.push(box(0.2, 0.14, 0.2, BASKET, { y: 0.25 }));
    // Burner frame
    parts.push(cyl(0.02, 0.02, 0.5, 6, 0x606060, { y: 0.58 }));
    // Tether ropes
    for (const a of [0, 1.2, 2.4, 3.6]) {
      parts.push(cyl(0.015, 0.015, 0.3, 4, ROPE, {
        x: Math.cos(a) * 0.3,
        z: Math.sin(a) * 0.3,
        y: 0.15,
        rz: Math.cos(a) * -0.4,
        rx: Math.sin(a) * 0.4,
      }));
    }

    // Second balloon (left, yellow)
    parts.push(sph(0.4, ENVELOPE_Y, {
      ws: 10, hs: 6,
      sy: 1.3,
      x: -0.9,
      y: 1.15,
      z: 0.3,
      hex2: 0xd8b838,
    }));
    parts.push(box(0.14, 0.1, 0.14, BASKET, { x: -0.9, y: 0.22, z: 0.3 }));

    // Third balloon (right, blue, lower/preparing)
    parts.push(sph(0.35, ENVELOPE_B, {
      ws: 10, hs: 6,
      sy: 1.2,
      x: 0.85,
      y: 0.7,
      z: -0.4,
      hex2: 0x3878d8,
    }));
    parts.push(box(0.12, 0.08, 0.12, BASKET, { x: 0.85, y: 0.2, z: -0.4 }));

    // Viewing platform with tourists
    parts.push(box(0.8, 0.08, 0.5, PLATFORM, { x: -0.5, y: 0.22, z: -0.7 }));
    // Railing
    parts.push(box(0.82, 0.06, 0.02, 0x808078, { x: -0.5, y: 0.32, z: -0.45 }));

    // Ground crew tent
    parts.push(box(0.4, 0.3, 0.35, 0xf0e8d8, { x: 1.0, y: 0.27, z: 0.5 }));

    // Grass texture tufts
    for (let i = 0; i < 6; i++) {
      const gx = -1.0 + i * 0.38 + (i % 2) * 0.1;
      parts.push(box(0.08, 0.08, 0.08, 0x4a7a2a, { x: gx, y: 0.22, z: 0.8 }));
    }

    return finish(parts);
  },
};

export default NM_LUYE_BALLOON;
