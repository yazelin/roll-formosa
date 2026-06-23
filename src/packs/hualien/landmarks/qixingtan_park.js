/**
 * @file packs/hualien/landmarks/qixingtan_park.js — Roll Formosa Hualien pack.
 *
 * NM_QIXINGTAN — 七星潭風景區 (Qixingtan Scenic Area), the famous crescent-shaped
 * pebble beach with stunning views of the Pacific Ocean and Central Mountain Range.
 * Features the iconic heart-shaped stone sculpture, viewing pavilions, and the
 * distinctive smooth grey pebbles that make this beach unique.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Beach and coastal colors
const PEBBLE = 0x7a7a7a; // grey pebble beach
const PEBBLE_L = 0x9a9a9a; // lighter pebbles
const OCEAN = 0x2a6a8a; // Pacific Ocean blue
const FOAM = 0xe8f0f4; // wave foam
const WOOD = 0x6a5040; // wood structures
const STONE = 0x6a6a6a; // stone sculpture
const HEART = 0xc84040; // red heart accent

export const NM_QIXINGTAN = {
  id: 'qixingtan_park',
  name: '七星潭風景區',
  landmarkId: 2,
  dioramaRHint: 50,
  colorHex: OCEAN,

  buildGeometry(rng) {
    const parts = [];

    // ---- Ocean water plane ------------------------------------------------
    parts.push(box(4.0, 0.08, 1.5, OCEAN, { y: 0.04, z: -0.8 }));
    // Wave foam line
    parts.push(box(3.8, 0.04, 0.15, FOAM, { y: 0.06, z: -0.1 }));

    // ---- Pebble beach (crescent shape implied by layout) ------------------
    parts.push(box(3.6, 0.12, 1.8, PEBBLE, { y: 0.06, z: 0.7 }));
    // Scattered larger pebbles (icosahedrons for organic shape)
    const pebblePositions = [
      [-0.8, 0.3], [0.4, 0.5], [-0.3, 0.8], [1.0, 0.4], [-1.2, 0.6],
      [0.7, 0.9], [-0.5, 1.1], [0.2, 0.2], [1.3, 0.7],
    ];
    for (const [px, pz] of pebblePositions) {
      const size = 0.06 + rng() * 0.04;
      parts.push(ico(size, 0, PEBBLE_L, { x: px, z: pz, y: 0.12 + size / 2 }));
    }

    // ---- Iconic heart-shaped stone sculpture ------------------------------
    // Base pedestal
    parts.push(box(0.5, 0.15, 0.5, STONE, { x: 0, z: 0.5, y: 0.195 }));
    // Heart shape (simplified: two overlapping spheres + triangle bottom)
    parts.push(sph(0.22, HEART, { ws: 8, hs: 6, x: -0.1, z: 0.5, y: 0.52 }));
    parts.push(sph(0.22, HEART, { ws: 8, hs: 6, x: 0.1, z: 0.5, y: 0.52 }));
    parts.push(cone(0.25, 0.35, 4, HEART, { rx: PI, x: 0, z: 0.5, y: 0.42 })); // heart bottom point

    // ---- Viewing pavilion (涼亭) ------------------------------------------
    const pavX = -1.2;
    const pavZ = 0.8;
    // Four corner posts
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(cyl(0.04, 0.04, 0.8, 6, WOOD, { x: pavX + sx * 0.25, z: pavZ + sz * 0.25, y: 0.12 + 0.4 }));
      }
    }
    // Pavilion roof
    parts.push(cone(0.55, 0.35, 4, 0x4a3a2a, { x: pavX, z: pavZ, y: 1.10 }));
    // Bench inside
    parts.push(box(0.4, 0.08, 0.2, WOOD, { x: pavX, z: pavZ, y: 0.24 }));

    // ---- Bike path marker -------------------------------------------------
    parts.push(box(0.15, 0.5, 0.08, 0x3a8a4a, { x: 1.4, z: 1.0, y: 0.37 })); // green path marker
    parts.push(box(0.12, 0.1, 0.06, 0xf0f0f0, { x: 1.4, z: 1.0, y: 0.55 })); // white bike icon area

    // ---- Distant mountain silhouette (Central Mountain Range) -------------
    parts.push(cone(1.2, 0.8, 6, 0x4a5a6a, { x: 0, z: -1.5, y: 0.4, hex2: 0x6a7a8a }));
    parts.push(cone(0.8, 0.6, 5, 0x5a6a7a, { x: -0.8, z: -1.4, y: 0.3 }));
    parts.push(cone(0.7, 0.5, 5, 0x5a6a7a, { x: 0.9, z: -1.3, y: 0.25 }));

    return finish(parts);
  },
};

export default NM_QIXINGTAN;
