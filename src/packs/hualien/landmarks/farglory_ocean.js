/**
 * @file packs/hualien/landmarks/farglory_ocean.js — Roll Formosa Hualien pack.
 *
 * NM_FARGLORY — 遠雄海洋公園 (Farglory Ocean Park), Taiwan's first marine theme
 * park featuring the iconic Dolphin Lagoon arena, Sea Lion Theater, and the
 * distinctive cable car system connecting different zones across the hillside.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Theme park colors
const ARENA = 0x3a8aca; // blue arena/pool
const SEAT = 0xe8e0d0; // stadium seating
const ROOF = 0x2a7aba; // blue roof structures
const CABLE = 0x8a8a8a; // cable car system
const CABIN = 0xea4a3a; // red cable car cabins
const PALM = 0x3a7a4a; // palm trees
const TRUNK = 0x6a5040; // palm trunk

export const NM_FARGLORY = {
  id: 'farglory_ocean',
  name: '遠雄海洋公園',
  landmarkId: 3,
  dioramaRHint: 80,
  colorHex: ARENA,

  buildGeometry(rng) {
    const parts = [];

    // ---- Hillside terrain base -------------------------------------------
    parts.push(box(4.0, 0.15, 3.5, 0x5a7a5a, { y: 0.075 })); // grass base
    // Sloped terrain (simplified)
    parts.push(box(3.5, 0.3, 1.5, 0x5a7a4a, { y: 0.15, z: -0.8 }));

    // ---- Dolphin Lagoon arena (main attraction) ---------------------------
    const arenaX = 0.3;
    const arenaZ = 0.5;
    // Circular pool
    parts.push(cyl(0.7, 0.7, 0.15, 12, ARENA, { x: arenaX, z: arenaZ, y: 0.225 }));
    // Stadium seating (semi-circle)
    parts.push(cyl(1.0, 0.85, 0.4, 12, SEAT, {
      x: arenaX, z: arenaZ - 0.15, y: 0.35,
      theta0: 0, thetaLen: PI, // half circle
    }));
    // Shade canopy roof
    parts.push(cyl(1.1, 0.6, 0.08, 8, ROOF, { x: arenaX, z: arenaZ - 0.3, y: 0.65 }));
    // Performance platform
    parts.push(box(0.5, 0.08, 0.3, 0xc0c0c0, { x: arenaX, z: arenaZ + 0.5, y: 0.34 }));

    // ---- Sea Lion Theater (smaller venue) --------------------------------
    const sealX = -1.0;
    const sealZ = 0.3;
    parts.push(cyl(0.4, 0.4, 0.10, 10, ARENA, { x: sealX, z: sealZ, y: 0.20 }));
    parts.push(cyl(0.55, 0.5, 0.25, 8, SEAT, { x: sealX, z: sealZ - 0.1, y: 0.28 }));

    // ---- Cable car system (signature feature) ----------------------------
    // Support towers
    const towerPositions = [
      [-1.3, -0.8], [-0.2, -1.2], [1.2, -0.9],
    ];
    for (const [tx, tz] of towerPositions) {
      parts.push(cyl(0.06, 0.08, 1.4, 6, CABLE, { x: tx, z: tz, y: 0.85 }));
      parts.push(box(0.5, 0.04, 0.08, CABLE, { x: tx, z: tz, y: 1.55 })); // cross arm
    }
    // Cable car cabins
    const cabinPositions = [
      [-0.75, -1.0, 1.3], [0.5, -1.05, 1.35], [1.0, -0.85, 1.28],
    ];
    for (const [cx, cz, cy] of cabinPositions) {
      parts.push(box(0.15, 0.18, 0.12, CABIN, { x: cx, z: cz, y: cy }));
      parts.push(cyl(0.02, 0.02, 0.15, 4, CABLE, { x: cx, z: cz, y: cy + 0.15 })); // hanger
    }

    // ---- Palm trees (tropical atmosphere) --------------------------------
    const palmPositions = [
      [1.5, 0.8], [-1.5, 0.7], [0.8, 1.2], [-0.5, 1.0],
    ];
    for (const [px, pz] of palmPositions) {
      parts.push(cyl(0.05, 0.06, 0.6, 6, TRUNK, { x: px, z: pz, y: 0.45 }));
      parts.push(cone(0.25, 0.3, 6, PALM, { x: px, z: pz, y: 0.85 }));
    }

    // ---- Entrance arch ---------------------------------------------------
    parts.push(box(0.6, 0.5, 0.15, 0x2a6a9a, { x: 0, z: 1.4, y: 0.40 }));
    parts.push(box(0.08, 0.6, 0.12, 0x2a6a9a, { x: -0.3, z: 1.4, y: 0.45 }));
    parts.push(box(0.08, 0.6, 0.12, 0x2a6a9a, { x: 0.3, z: 1.4, y: 0.45 }));

    return finish(parts);
  },
};

export default NM_FARGLORY;
