/**
 * @file packs/hualien/landmarks/liyu_lake.js — Roll Formosa Hualien pack.
 *
 * NM_LIYU — 鯉魚潭 (Liyu Lake / Carp Lake), the largest inland lake in Hualien
 * County. Features swan-shaped paddle boats, a lakeside pagoda pavilion, and
 * views of the surrounding mountains. Named for its carp-like shape when viewed
 * from above.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Lake and nature colors
const WATER = 0x3a7a8a; // lake water
const WATER_D = 0x2a5a6a; // deeper water
const BOAT = 0xf0f0f0; // white swan boat
const BEAK = 0xea8a30; // orange swan beak
const PAGODA_RED = 0xba3020; // pagoda red
const PAGODA_GOLD = 0xd8a820; // pagoda gold
const WOOD = 0x6a5040; // wood dock
const MOUNTAIN = 0x4a6a5a; // mountain green
const TREE = 0x3a6a3a; // trees

export const NM_LIYU = {
  id: 'liyu_lake',
  name: '鯉魚潭',
  landmarkId: 6,
  dioramaRHint: 55,
  colorHex: WATER,

  buildGeometry(rng) {
    const parts = [];

    // ---- Lake surface (carp-shaped implied) ------------------------------
    parts.push(cyl(1.5, 1.4, 0.08, 12, WATER, { y: 0.04, hex2: WATER_D }));
    // Shore edge
    parts.push(cyl(1.6, 1.55, 0.06, 12, 0x8a8070, { y: 0.03 }));

    // ---- Swan-shaped paddle boats (鯉魚潭 signature) ----------------------
    // Swan boat 1
    const swan1X = -0.3;
    const swan1Z = 0.4;
    // Body (elongated hull)
    parts.push(box(0.35, 0.12, 0.18, BOAT, { x: swan1X, z: swan1Z, y: 0.12 }));
    // Neck and head
    parts.push(cyl(0.04, 0.03, 0.25, 6, BOAT, { x: swan1X + 0.12, z: swan1Z, y: 0.28, rx: 0.3 }));
    parts.push(sph(0.06, BOAT, { ws: 6, hs: 4, x: swan1X + 0.18, z: swan1Z, y: 0.38 })); // head
    parts.push(cone(0.03, 0.08, 4, BEAK, { x: swan1X + 0.24, z: swan1Z, y: 0.38, rz: -HALF_PI })); // beak

    // Swan boat 2
    const swan2X = 0.5;
    const swan2Z = -0.2;
    parts.push(box(0.32, 0.11, 0.16, BOAT, { x: swan2X, z: swan2Z, y: 0.115 }));
    parts.push(cyl(0.035, 0.025, 0.22, 6, BOAT, { x: swan2X + 0.10, z: swan2Z, y: 0.26, rx: 0.25 }));
    parts.push(sph(0.055, BOAT, { ws: 6, hs: 4, x: swan2X + 0.15, z: swan2Z, y: 0.35 }));
    parts.push(cone(0.025, 0.07, 4, BEAK, { x: swan2X + 0.20, z: swan2Z, y: 0.35, rz: -HALF_PI }));

    // ---- Lakeside pagoda pavilion ----------------------------------------
    const pagX = -0.9;
    const pagZ = -0.6;
    // Stone base
    parts.push(cyl(0.35, 0.38, 0.1, 8, 0x7a7a6a, { x: pagX, z: pagZ, y: 0.11 }));
    // Red pillars (6 around)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      parts.push(cyl(0.03, 0.03, 0.6, 6, PAGODA_RED, {
        x: pagX + Math.cos(a) * 0.25, z: pagZ + Math.sin(a) * 0.25, y: 0.46,
      }));
    }
    // Hexagonal roof
    parts.push(cone(0.5, 0.35, 6, PAGODA_RED, { x: pagX, z: pagZ, y: 0.95 }));
    // Gold finial
    parts.push(cyl(0.04, 0.02, 0.15, 6, PAGODA_GOLD, { x: pagX, z: pagZ, y: 1.22 }));

    // ---- Wooden dock -----------------------------------------------------
    parts.push(box(0.6, 0.06, 0.25, WOOD, { x: 0.7, z: 0.9, y: 0.09 }));
    // Dock posts
    for (const dx of [-0.25, 0.25]) {
      parts.push(cyl(0.03, 0.03, 0.2, 6, WOOD, { x: 0.7 + dx, z: 1.0, y: 0.16 }));
    }

    // ---- Surrounding mountains -------------------------------------------
    parts.push(cone(0.9, 1.0, 6, MOUNTAIN, { x: 0, z: -1.6, y: 0.5, hex2: 0x5a7a6a }));
    parts.push(cone(0.6, 0.7, 5, MOUNTAIN, { x: -0.9, z: -1.3, y: 0.35 }));
    parts.push(cone(0.5, 0.6, 5, MOUNTAIN, { x: 1.0, z: -1.4, y: 0.30 }));

    // ---- Shoreline trees ------------------------------------------------
    const treePositions = [
      [1.2, 0.5], [-1.1, 0.3], [0.9, -0.7], [-0.7, 0.8],
    ];
    for (const [tx, tz] of treePositions) {
      parts.push(cyl(0.04, 0.05, 0.35, 6, 0x5a4030, { x: tx, z: tz, y: 0.23 }));
      parts.push(cone(0.2, 0.35, 6, TREE, { x: tx, z: tz, y: 0.55 }));
    }

    return finish(parts);
  },
};

export default NM_LIYU;
