/**
 * @file packs/changhua/landmarks/yuanlin_station.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_YUANLIN_STATION — 員林車站 (Yuanlin Station), a modern elevated railway
 * station completed in 2014. Features a distinctive curved roof design with
 * glass curtain walls. The station serves as a major transportation hub
 * for central Changhua County.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const ROOF = 0xc0c0c8;        // silver-gray curved roof
const ROOF_D = 0xa0a0a8;      // roof shadow
const GLASS = 0x88c8e8;       // glass curtain wall
const STRUCTURE = 0xe8e8e0;   // white concrete structure
const PLATFORM = 0x606060;    // platform gray

export const NM_YUANLIN_STATION = {
  id: 'yuanlin_station',
  name: '員林車站',
  landmarkId: 90,
  dioramaRHint: 45,
  colorHex: ROOF,

  buildGeometry(rng) {
    const parts = [];

    // Elevated platform base
    parts.push(box(2.0, 0.25, 0.8, PLATFORM, { y: 0.50 }));

    // Main building structure
    parts.push(box(1.6, 0.5, 0.6, STRUCTURE, { y: 0.88 }));

    // Glass curtain walls
    parts.push(box(1.5, 0.4, 0.02, GLASS, { y: 0.85, z: 0.30 }));
    parts.push(box(1.5, 0.4, 0.02, GLASS, { y: 0.85, z: -0.30 }));

    // Curved roof - using elongated half-spheres
    parts.push(sph(0.90, ROOF, {
      ws: 10, hs: 5,
      sx: 1.8, sy: 0.25, sz: 0.8,
      y: 1.25,
      thetaLen: HALF_PI,
      hex2: ROOF_D,
    }));

    // Support columns
    for (const x of [-0.65, -0.25, 0.25, 0.65]) {
      parts.push(cyl(0.04, 0.04, 0.50, 4, STRUCTURE, { x, y: 0.25, z: 0.35 }));
      parts.push(cyl(0.04, 0.04, 0.50, 4, STRUCTURE, { x, y: 0.25, z: -0.35 }));
    }

    // Entrance canopy at ground level
    parts.push(box(0.5, 0.03, 0.4, ROOF, { x: 0, y: 0.35, z: 0.55 }));

    // Platform railings
    parts.push(box(1.8, 0.05, 0.02, 0x404040, { y: 0.65, z: 0.38 }));
    parts.push(box(1.8, 0.05, 0.02, 0x404040, { y: 0.65, z: -0.38 }));

    return finish(parts);
  },
};

export default NM_YUANLIN_STATION;
