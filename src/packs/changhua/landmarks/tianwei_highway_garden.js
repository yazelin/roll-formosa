/**
 * @file packs/changhua/landmarks/tianwei_highway_garden.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_TIANWEI_HIGHWAY_GARDEN — 田尾公路花園 (Tianwei Highway Garden), Taiwan's
 * largest flower and plant market area. Features endless rows of nurseries,
 * colorful flower displays, and greenhouses along Provincial Highway 1.
 * Known as the "Flower Capital of Taiwan."
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const GREENHOUSE = 0xd0e8e8;  // translucent greenhouse
const FRAME = 0x808080;       // metal frame
const FLOWER_R = 0xe83858;    // red flowers
const FLOWER_Y = 0xf8d838;    // yellow flowers
const FLOWER_P = 0xc848c8;    // pink flowers
const LEAF = 0x48a048;        // green foliage
const ROAD = 0x606060;        // road surface

export const NM_TIANWEI_HIGHWAY_GARDEN = {
  id: 'tianwei_highway_garden',
  name: '田尾公路花園',
  landmarkId: 95,
  dioramaRHint: 50,
  colorHex: FLOWER_R,

  buildGeometry(rng) {
    const parts = [];

    // Road (Provincial Highway 1)
    parts.push(box(1.8, 0.02, 0.25, ROAD, { y: 0.01 }));
    // Road markings
    parts.push(box(0.15, 0.01, 0.02, 0xf8f8f8, { x: -0.50, y: 0.02 }));
    parts.push(box(0.15, 0.01, 0.02, 0xf8f8f8, { x: 0.00, y: 0.02 }));
    parts.push(box(0.15, 0.01, 0.02, 0xf8f8f8, { x: 0.50, y: 0.02 }));

    // Greenhouse on left side
    parts.push(sph(0.30, GREENHOUSE, {
      ws: 8, hs: 4,
      sx: 1.2, sy: 0.4, sz: 0.8,
      y: 0.20, z: -0.40,
      thetaLen: HALF_PI,
    }));
    parts.push(box(0.36, 0.02, 0.24, FRAME, { y: 0.02, z: -0.40 }));

    // Flower beds - left side
    for (let i = 0; i < 3; i++) {
      const x = -0.55 + i * 0.30;
      parts.push(box(0.20, 0.06, 0.15, LEAF, { x, y: 0.05, z: -0.70 }));
      const color = [FLOWER_R, FLOWER_Y, FLOWER_P][i];
      parts.push(sph(0.06, color, { ws: 4, hs: 3, x: x - 0.05, y: 0.12, z: -0.70 }));
      parts.push(sph(0.05, color, { ws: 4, hs: 3, x: x + 0.05, y: 0.11, z: -0.68 }));
    }

    // Nursery stalls - right side
    for (let i = 0; i < 3; i++) {
      const x = -0.45 + i * 0.35;
      // Stall canopy
      parts.push(box(0.25, 0.02, 0.18, 0xf8f8f0, { x, y: 0.30, z: 0.45 }));
      // Support poles
      parts.push(cyl(0.02, 0.02, 0.30, 4, 0x606060, { x: x - 0.10, y: 0.15, z: 0.38 }));
      parts.push(cyl(0.02, 0.02, 0.30, 4, 0x606060, { x: x + 0.10, y: 0.15, z: 0.38 }));
      // Potted plants
      parts.push(cyl(0.04, 0.03, 0.05, 5, 0x8b4513, { x, y: 0.05, z: 0.45 }));
      parts.push(sph(0.05, LEAF, { ws: 4, hs: 3, x, y: 0.12, z: 0.45 }));
    }

    // More flower patches in back
    for (const [x, z, c] of [[-0.70, 0.70, FLOWER_P], [0.70, 0.65, FLOWER_Y], [0.50, -0.70, FLOWER_R]]) {
      parts.push(sph(0.08, c, { ws: 4, hs: 3, x, y: 0.08, z }));
    }

    return finish(parts);
  },
};

export default NM_TIANWEI_HIGHWAY_GARDEN;
