/**
 * @file packs/nantou/landmarks/puli_winery.js — Roll Formosa Nantou pack, landmark 7.
 *
 * 埔里酒廠 — Puli Winery, established in 1917, famous for its Shaoxing wine
 * (紹興酒) made with Puli's renowned spring water. Features:
 * - Historic Japanese colonial-era factory buildings
 * - Large sake/wine brewing vats
 * - Distinctive tall chimney/smokestack
 * - Traditional tile-roofed warehouses
 * - Wine jars and barrels
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — historic winery/brewery
const BRICK_RED = 0x8a4030;      // red brick
const BRICK_DARK = 0x6a3025;     // darker brick
const WALL_CREAM = 0xe8e0d0;     // cream walls
const ROOF_GREY = 0x4a4a4a;      // grey roof tiles
const ROOF_BROWN = 0x5a4a3a;     // brown roof
const CHIMNEY = 0x6a3a2a;        // chimney brick
const VAT_WOOD = 0x6a5040;       // wooden vat
const VAT_BAND = 0x404040;       // metal bands on vats
const JAR_BROWN = 0x7a5a40;      // ceramic wine jars
const CONCRETE = 0x888888;       // concrete
const TIMBER = 0x5a4030;         // timber frame
const COPPER = 0xa07050;         // copper elements

export const NM_PULI_WINERY = {
  id: 'puli_winery',
  name: '埔里酒廠',
  landmarkId: 7,
  dioramaRHint: 45, // winery complex ~90m
  colorHex: BRICK_RED,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.004;
    const parts = [];

    /* ---- 1) Factory base ---- */
    parts.push(box(2.8, 0.1, 2.2, CONCRETE, { y: 0.05 }));

    /* ---- 2) Main brewery building ---- */
    parts.push(box(1.1, 0.6, 0.8, BRICK_RED, { x: -0.5, y: 0.5, hex2: BRICK_DARK }));
    parts.push(cone(0.55, 0.3, 4, ROOF_GREY, { x: -0.5, ry: PI / 4, y: 1.0 + j, sx: 1.2, sz: 0.9 }));

    /* ---- 3) Iconic chimney ---- */
    parts.push(cyl(0.12, 0.08, 1.3, 6, CHIMNEY, { x: -1.1, y: 0.9, z: 0.2, hex2: BRICK_DARK }));

    /* ---- 4) Brewing vats (2 simplified) ---- */
    parts.push(cyl(0.18, 0.15, 0.4, 6, VAT_WOOD, { x: 0.6, y: 0.3, z: 0.3 }));
    parts.push(cyl(0.16, 0.13, 0.35, 6, VAT_WOOD, { x: 0.85, y: 0.28, z: -0.1 }));

    /* ---- 5) Warehouse ---- */
    parts.push(box(0.8, 0.45, 0.55, WALL_CREAM, { x: 0.7, y: 0.325, z: -0.6, hex2: BRICK_RED }));
    parts.push(cone(0.4, 0.22, 4, ROOF_BROWN, { x: 0.7, ry: PI / 4, y: 0.7, z: -0.6, sx: 1.1, sz: 0.8 }));

    /* ---- 6) Entrance gate ---- */
    parts.push(box(0.08, 0.35, 0.08, BRICK_RED, { x: -0.4, y: 0.275, z: 1.0 }));
    parts.push(box(0.08, 0.35, 0.08, BRICK_RED, { x: 0.4, y: 0.275, z: 1.0 }));
    parts.push(box(0.9, 0.06, 0.1, BRICK_DARK, { y: 0.48, z: 1.0 }));

    return finish(parts);
  },
};

export default NM_PULI_WINERY;
