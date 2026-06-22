/**
 * @file packs/chiayi/landmarks/chiayi_station.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_CHIAYI_STATION — 嘉義車站 (Chiayi Railway Station). A historic Japanese-colonial
 * era station building with Renaissance Revival architecture: a central clock tower,
 * arched windows, red brick facade, and the iconic Alishan Forest Railway starting here.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const BRICK = 0x8a5a4a;     // red brick
const BRICK_HI = 0xa87060;  // brick highlight
const CREAM = 0xe8e0d0;     // cream trim
const ROOF = 0x4a4038;      // dark roof
const WINDOW = 0x2a3844;    // dark glass
const CLOCK = 0xf0e8d8;     // clock face

export const NM_CHIAYI_STATION = {
  id: 'chiayi_station',
  name: '嘉義車站',
  landmarkId: 2,
  dioramaRHint: 35, // station building
  colorHex: BRICK,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.008;
    const parts = [];

    // Platform base
    parts.push(box(4.5, 0.15, 2.2, 0x686058, { y: 0.075 }));

    // Main station body - long horizontal building
    const mainY = 0.15;
    parts.push(box(3.8, 0.9, 1.6, BRICK, { y: mainY + 0.45, hex2: BRICK_HI }));

    // Cream trim bands
    parts.push(box(3.9, 0.08, 1.65, CREAM, { y: mainY + 0.12 })); // base trim
    parts.push(box(3.9, 0.1, 1.65, CREAM, { y: mainY + 0.92 })); // cornice

    // Arched windows (front facade)
    for (const wx of [-1.2, -0.4, 0.4, 1.2]) {
      parts.push(box(0.35, 0.5, 0.08, WINDOW, { x: wx, y: mainY + 0.48, z: 0.82 }));
      parts.push(cyl(0.175, 0.175, 0.08, 6, WINDOW, { x: wx, y: mainY + 0.74, z: 0.82, rx: HALF_PI }));
    }

    // Central entrance - larger arch
    parts.push(box(0.6, 0.65, 0.1, WINDOW, { y: mainY + 0.48, z: 0.82 }));
    parts.push(cyl(0.3, 0.3, 0.1, 6, WINDOW, { y: mainY + 0.82, z: 0.82, rx: HALF_PI }));

    // Main roof
    parts.push(box(3.95, 0.12, 1.8, ROOF, { y: mainY + 1.0 }));
    parts.push(box(3.7, 0.25, 1.5, ROOF, { y: mainY + 1.2, hex2: 0x5a5048 }));

    // Central clock tower (the station's signature)
    const towerY = mainY + 1.0;
    parts.push(box(0.7, 0.9, 0.7, BRICK, { y: towerY + 0.45, hex2: BRICK_HI }));
    parts.push(box(0.75, 0.06, 0.75, CREAM, { y: towerY + 0.92 })); // tower cornice

    // Clock faces (front and sides)
    for (const cz of [0.36, -0.36]) {
      parts.push(cyl(0.18, 0.18, 0.04, 8, CLOCK, { y: towerY + 0.6, z: cz, rx: HALF_PI }));
    }
    for (const cx of [0.36, -0.36]) {
      parts.push(cyl(0.18, 0.18, 0.04, 8, CLOCK, { x: cx, y: towerY + 0.6, rz: HALF_PI }));
    }

    // Tower roof - pyramidal
    parts.push(cone(0.48, 0.5, 4, ROOF, { y: towerY + 1.2, ry: PI / 4, hex2: 0x5a5048 }));

    // Finial
    parts.push(cyl(0.04, 0.04, 0.15, 4, 0xc8b090, { y: towerY + 1.52 + j }));
    parts.push(sph(0.05, 0xc8b090, { ws: 4, hs: 3, y: towerY + 1.62 }));

    // Side canopy extensions
    for (const sx of [-1.6, 1.6]) {
      parts.push(box(0.5, 0.08, 1.8, ROOF, { x: sx, y: mainY + 0.7, z: 0.3 }));
    }

    return finish(parts);
  },
};

export default NM_CHIAYI_STATION;
