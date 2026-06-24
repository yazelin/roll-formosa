/**
 * @file packs/yilan/landmarks/chuanyi_center.js — Roll Formosa Yilan pack.
 *
 * 國立傳統藝術中心 (National Center for Traditional Arts). A sprawling
 * cultural park preserving Taiwan's traditional crafts and folk arts —
 * featuring reconstructed historic streets, traditional architecture,
 * and artisan workshops along scenic canals.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const BRICK_RED = 0x8a4a3a;     // traditional red brick
const ROOF_TILE = 0x4a3828;     // dark roof tiles
const WOOD = 0x6a5038;          // wooden structures
const STONE = 0x808078;         // stone paths
const WATER = 0x5a8090;         // canal water
const LANTERN_RED = 0xc82020;   // red lanterns
const GRASS = 0x4a7a3a;         // park grass
const PAILOU = 0xa04040;        // ceremonial gate

export const NM_CHUANYI_CENTER = {
  id: 'chuanyi_center',
  name: '傳藝中心',
  landmarkId: 6,  // Yilan landmark #6 — dioramaRHint 35
  dioramaRHint: 35,
  colorHex: 0x8a4a3a, // traditional red brick — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Central canal (運河) -------------------------------
    parts.push(box(1.4, 0.05, 0.25, WATER, { y: 0.025 }));
    // Canal banks
    parts.push(box(1.4, 0.06, 0.04, STONE, { y: 0.03, z: 0.15 }));
    parts.push(box(1.4, 0.06, 0.04, STONE, { y: 0.03, z: -0.15 }));

    // ---- 2) Traditional pailou gate (牌樓) ---------------------
    // Main pillars
    parts.push(cyl(0.05, 0.06, 0.5, 6, PAILOU, { x: -0.2, y: 0.28, z: 0.5 }));
    parts.push(cyl(0.05, 0.06, 0.5, 6, PAILOU, { x: 0.2, y: 0.28, z: 0.5 }));
    // Cross beam
    parts.push(box(0.5, 0.08, 0.08, PAILOU, { x: 0.0, y: 0.50, z: 0.5 }));
    // Roof
    parts.push(
      box(0.6, 0.04, 0.15, ROOF_TILE, {
        x: 0.0,
        y: 0.58,
        z: 0.5,
        rx: 0.1,
      })
    );

    // ---- 3) Traditional street buildings -----------------------
    // Left building
    parts.push(box(0.35, 0.30, 0.25, BRICK_RED, { x: -0.5, y: 0.20, z: -0.45 }));
    parts.push(box(0.38, 0.04, 0.28, ROOF_TILE, { x: -0.5, y: 0.38, z: -0.45, rx: 0.12 }));
    // Right building
    parts.push(box(0.35, 0.28, 0.25, BRICK_RED, { x: 0.5, y: 0.19, z: -0.45 }));
    parts.push(box(0.38, 0.04, 0.28, ROOF_TILE, { x: 0.5, y: 0.36, z: -0.45, rx: 0.12 }));

    // ---- 4) Artisan workshop (工藝坊) --------------------------
    parts.push(box(0.30, 0.22, 0.20, WOOD, { x: 0.0, y: 0.16, z: -0.50 }));
    parts.push(box(0.32, 0.03, 0.22, ROOF_TILE, { x: 0.0, y: 0.30, z: -0.50 }));

    // ---- 5) Stone bridge over canal ----------------------------
    parts.push(box(0.25, 0.06, 0.35, STONE, { x: 0.4, y: 0.10, z: 0.0, ry: HALF_PI }));

    // ---- 6) Red lanterns hanging -------------------------------
    parts.push(sph(0.035, LANTERN_RED, { x: -0.5, y: 0.42, z: -0.32 }));
    parts.push(sph(0.035, LANTERN_RED, { x: 0.5, y: 0.40, z: -0.32 }));
    parts.push(sph(0.035, LANTERN_RED, { x: 0.0, y: 0.56, z: 0.5 }));

    // ---- 7) Park grass areas -----------------------------------
    parts.push(cyl(0.18, 0.18, 0.03, 8, GRASS, { x: -0.6, y: 0.015, z: 0.35 }));
    parts.push(cyl(0.15, 0.15, 0.03, 8, GRASS, { x: 0.6, y: 0.015, z: 0.35 }));

    return finish(parts);
  },
};

export default NM_CHUANYI_CENTER;
