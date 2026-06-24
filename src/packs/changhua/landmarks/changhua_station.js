/**
 * @file packs/changhua/landmarks/changhua_station.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_CHANGHUA_STATION — 彰化車站 (Changhua Station), a major railway station
 * built in 1958 with a classic mid-century modern design. Features a rectangular
 * main building with a prominent clock tower and covered platforms. A key
 * transportation hub for Changhua County.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const BUILDING = 0xe8e0d0;    // cream-colored building
const BUILDING_D = 0xc8c0b0;  // building shadow
const ROOF = 0x505050;        // dark roof
const WINDOW = 0x78a8c8;      // blue-tinted windows
const CLOCK = 0xf8f8f0;       // white clock face

export const NM_CHANGHUA_STATION = {
  id: 'changhua_station',
  name: '彰化車站',
  landmarkId: 92,
  dioramaRHint: 50,
  colorHex: BUILDING,

  buildGeometry(rng) {
    const parts = [];

    // Main station building
    parts.push(box(1.4, 0.45, 0.6, BUILDING, { y: 0.225, hex2: BUILDING_D }));

    // Roof
    parts.push(box(1.5, 0.06, 0.65, ROOF, { y: 0.48 }));

    // Central clock tower
    parts.push(box(0.25, 0.35, 0.25, BUILDING, { y: 0.625 }));
    parts.push(box(0.28, 0.04, 0.28, ROOF, { y: 0.82 }));

    // Clock faces (front and back)
    parts.push(cyl(0.08, 0.08, 0.02, 8, CLOCK, { y: 0.70, z: 0.13, rx: HALF_PI }));
    parts.push(cyl(0.08, 0.08, 0.02, 8, CLOCK, { y: 0.70, z: -0.13, rx: HALF_PI }));

    // Window rows
    for (const x of [-0.50, -0.25, 0.25, 0.50]) {
      parts.push(box(0.15, 0.20, 0.02, WINDOW, { x, y: 0.25, z: 0.31 }));
      parts.push(box(0.15, 0.20, 0.02, WINDOW, { x, y: 0.25, z: -0.31 }));
    }

    // Main entrance
    parts.push(box(0.20, 0.25, 0.02, 0x404040, { y: 0.125, z: 0.31 }));

    // Platform canopy (extended to the side)
    parts.push(box(0.8, 0.03, 0.35, ROOF, { x: 0.85, y: 0.35 }));
    parts.push(cyl(0.03, 0.03, 0.35, 4, 0x606060, { x: 0.55, y: 0.175, z: 0.12 }));
    parts.push(cyl(0.03, 0.03, 0.35, 4, 0x606060, { x: 0.55, y: 0.175, z: -0.12 }));
    parts.push(cyl(0.03, 0.03, 0.35, 4, 0x606060, { x: 1.15, y: 0.175, z: 0.12 }));
    parts.push(cyl(0.03, 0.03, 0.35, 4, 0x606060, { x: 1.15, y: 0.175, z: -0.12 }));

    // Platform
    parts.push(box(0.8, 0.08, 0.30, 0x707070, { x: 0.85, y: 0.04 }));

    return finish(parts);
  },
};

export default NM_CHANGHUA_STATION;
