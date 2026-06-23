/**
 * @file packs/chiayi/landmarks/alishan_train.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_ALISHAN_TRAIN — 阿里山小火車 (Alishan Forest Railway Train). The iconic red
 * narrow-gauge train that climbs from Chiayi up to Alishan. Features the classic
 * red locomotive with its distinctive shape, coupled with wooden passenger carriages.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const TRAIN_RED = 0xc82020;   // classic Alishan red
const TRAIN_RED_HI = 0xe83838;// red highlight
const CARRIAGE = 0x8a6a4a;    // wooden carriage brown
const CARRIAGE_HI = 0xa88a68; // wood highlight
const WINDOW = 0x2a4858;      // dark window
const WHEEL = 0x3a3a3a;       // wheel grey
const TRACK = 0x585858;       // rail track
const TIE = 0x5a4a3a;         // wooden tie

export const NM_ALISHAN_TRAIN = {
  id: 'alishan_train',
  name: '阿里山小火車',
  landmarkId: 1,
  dioramaRHint: 30, // train set
  colorHex: TRAIN_RED,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.008;
    const parts = [];

    // Track base and ties
    parts.push(box(5.5, 0.08, 0.9, 0x4a4038, { y: 0.04 })); // ballast bed
    for (let tx = -2.4; tx <= 2.4; tx += 1.1) {
      parts.push(box(0.12, 0.06, 0.75, TIE, { x: tx, y: 0.11 })); // ties
    }
    // Rails
    parts.push(box(5.4, 0.06, 0.06, TRACK, { y: 0.16, z: -0.25 }));
    parts.push(box(5.4, 0.06, 0.06, TRACK, { y: 0.16, z: 0.25 }));

    // LOCOMOTIVE (front)
    const locoX = 1.6;
    const locoY = 0.19;

    // Main body
    parts.push(box(1.1, 0.55, 0.6, TRAIN_RED, { x: locoX, y: locoY + 0.45, hex2: TRAIN_RED_HI }));
    // Cab (driver compartment at rear of loco)
    parts.push(box(0.45, 0.4, 0.55, TRAIN_RED, { x: locoX - 0.32, y: locoY + 0.78, hex2: TRAIN_RED_HI }));
    parts.push(box(0.3, 0.25, 0.06, WINDOW, { x: locoX - 0.32, y: locoY + 0.8, z: 0.28 })); // cab window

    // Boiler / front nose section
    parts.push(cyl(0.22, 0.24, 0.55, 4, TRAIN_RED, { x: locoX + 0.55, y: locoY + 0.45, rz: HALF_PI, hex2: TRAIN_RED_HI }));
    // Smokestack
    parts.push(cyl(0.08, 0.1, 0.25, 4, 0x2a2a2a, { x: locoX + 0.5, y: locoY + 0.85 }));
    parts.push(cyl(0.12, 0.08, 0.08, 4, 0x3a3a3a, { x: locoX + 0.5, y: locoY + 1.0 }));

    // Headlight
    parts.push(cyl(0.06, 0.06, 0.08, 4, 0xf0e080, { x: locoX + 0.85, y: locoY + 0.55, rz: HALF_PI }));

    // Loco wheels
    for (const wx of [locoX - 0.3, locoX + 0.15, locoX + 0.55]) {
      for (const wz of [-0.32, 0.32]) {
        parts.push(cyl(0.12, 0.12, 0.06, 4, WHEEL, { x: wx, y: locoY + 0.12, z: wz, rx: HALF_PI }));
      }
    }

    // CARRIAGE 1 (middle)
    const car1X = 0.2;
    parts.push(box(1.0, 0.45, 0.55, CARRIAGE, { x: car1X, y: locoY + 0.42, hex2: CARRIAGE_HI }));
    parts.push(box(1.05, 0.08, 0.6, 0x4a3a2a, { x: car1X, y: locoY + 0.68 })); // roof
    // Windows
    for (const wwx of [-0.25, 0.25]) {
      parts.push(box(0.22, 0.2, 0.06, WINDOW, { x: car1X + wwx, y: locoY + 0.45, z: 0.29 }));
      parts.push(box(0.22, 0.2, 0.06, WINDOW, { x: car1X + wwx, y: locoY + 0.45, z: -0.29 }));
    }
    // Wheels
    for (const wx of [car1X - 0.3, car1X + 0.3]) {
      for (const wz of [-0.3, 0.3]) {
        parts.push(cyl(0.1, 0.1, 0.05, 4, WHEEL, { x: wx, y: locoY + 0.1, z: wz, rx: HALF_PI }));
      }
    }

    // CARRIAGE 2 (rear)
    const car2X = -1.2;
    parts.push(box(0.95, 0.42, 0.52, CARRIAGE, { x: car2X, y: locoY + 0.4, hex2: CARRIAGE_HI }));
    parts.push(box(1.0, 0.07, 0.58, 0x4a3a2a, { x: car2X, y: locoY + 0.64 }));
    for (const wwx of [-0.22, 0.22]) {
      parts.push(box(0.2, 0.18, 0.06, WINDOW, { x: car2X + wwx + j, y: locoY + 0.42, z: 0.28 }));
    }
    for (const wx of [car2X - 0.28, car2X + 0.28]) {
      for (const wz of [-0.28, 0.28]) {
        parts.push(cyl(0.09, 0.09, 0.05, 4, WHEEL, { x: wx, y: locoY + 0.1, z: wz, rx: HALF_PI }));
      }
    }

    // Coupling links between cars
    parts.push(box(0.35, 0.06, 0.08, 0x505050, { x: 0.9, y: locoY + 0.25 }));
    parts.push(box(0.3, 0.06, 0.08, 0x505050, { x: -0.45, y: locoY + 0.25 }));

    return finish(parts);
  },
};

export default NM_ALISHAN_TRAIN;
