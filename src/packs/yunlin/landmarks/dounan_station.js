/**
 * @file packs/yunlin/landmarks/dounan_station.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_DOUNAN_STATION — 斗南火車站 (Dounan Railway Station). A traditional railway
 * station in Dounan Township, Yunlin, serving the Western Line. Features classic
 * station architecture with a platform canopy and clock tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WALL = 0xe8e0d0;        // station wall cream
const WALL_HI = 0xf8f4e8;     // wall highlight
const ROOF = 0x4a5a68;        // dark blue-grey roof
const ROOF_HI = 0x5a6a78;     // roof highlight
const WINDOW = 0x2a3848;      // dark window
const PLATFORM = 0x888078;    // platform grey
const TRACK = 0x585858;       // rail track
const WOOD = 0x8a6a4a;        // wooden accents

export const NM_DOUNAN_STATION = {
  id: 'dounan_station',
  name: '斗南火車站',
  landmarkId: 1,
  dioramaRHint: 44, // train station
  colorHex: ROOF,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Ground / plaza
    parts.push(box(4.0, 0.1, 3.0, 0x787068, { y: 0.05 }));

    const baseY = 0.1;

    // Main station building
    parts.push(box(2.0, 0.75, 1.2, WALL, { y: baseY + 0.375, hex2: WALL_HI }));

    // Windows row
    for (const wx of [-0.6, 0, 0.6]) {
      parts.push(box(0.25, 0.35, 0.08, WINDOW, { x: wx, y: baseY + 0.45, z: 0.62 }));
    }

    // Main entrance door
    parts.push(box(0.4, 0.5, 0.1, WOOD, { y: baseY + 0.3, z: 0.62 }));

    // Main roof
    parts.push(box(2.2, 0.1, 1.4, ROOF, { y: baseY + 0.8, hex2: ROOF_HI }));
    parts.push(box(2.0, 0.25, 1.2, ROOF, { y: baseY + 0.975, sx: 0.85, sz: 0.85, hex2: ROOF_HI }));

    // Central tower / clock tower
    parts.push(box(0.6, 0.45, 0.5, WALL, { y: baseY + 1.12, hex2: WALL_HI }));
    // Clock face
    parts.push(cyl(0.12, 0.12, 0.06, 8, 0xf8f8f0, { y: baseY + 1.2, z: 0.27, rx: HALF_PI }));
    // Tower roof
    parts.push(cone(0.35, 0.3, 4, ROOF, { y: baseY + 1.5, ry: PI / 4, hex2: ROOF_HI }));

    // Platform
    parts.push(box(3.5, 0.15, 0.8, PLATFORM, { y: baseY + 0.075, z: -0.9 }));

    // Platform canopy
    parts.push(box(3.2, 0.06, 0.6, ROOF, { y: baseY + 0.65, z: -0.9 }));
    // Canopy support posts
    for (const px of [-1.2, 0, 1.2]) {
      parts.push(cyl(0.04, 0.04, 0.55, 4, 0x3a3a3a, { x: px, y: baseY + 0.35, z: -0.9 }));
    }

    // Railway tracks
    parts.push(box(4.0, 0.04, 0.06, TRACK, { y: baseY + 0.02, z: -1.35 }));
    parts.push(box(4.0, 0.04, 0.06, TRACK, { y: baseY + 0.02, z: -1.55 }));
    // Ties
    for (let tx = -1.8; tx <= 1.8; tx += 0.5) {
      parts.push(box(0.08, 0.03, 0.35, 0x5a4a3a, { x: tx + j, y: baseY + 0.015, z: -1.45 }));
    }

    // Station sign
    parts.push(box(0.8, 0.2, 0.06, 0x285898, { y: baseY + 0.55, z: -0.55 }));

    // Bench on platform
    parts.push(box(0.5, 0.12, 0.15, WOOD, { x: 0.8, y: baseY + 0.21, z: -0.85 }));

    // Small garden/tree at entrance
    parts.push(cyl(0.05, 0.05, 0.3, 4, 0x5a4a3a, { x: -1.3, y: baseY + 0.15, z: 0.8 }));
    parts.push(sph(0.2, 0x48a848, { ws: 5, hs: 4, x: -1.3, y: baseY + 0.42, z: 0.8 }));

    return finish(parts);
  },
};

export default NM_DOUNAN_STATION;
