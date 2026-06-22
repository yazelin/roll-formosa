/**
 * @file packs/newtaipei/landmarks/fort_san_domingo.js — Roll Formosa New Taipei pack.
 *
 * NM_FORT_SAN_DOMINGO — 淡水紅毛城 (Fort San Domingo / Tamsui Fort). The iconic
 * red-brick Dutch/Spanish colonial fortress overlooking the Tamsui River.
 * Features distinctive red walls, corner bastions, a white British consular
 * residence attached, and a flagpole. The fort is perched on a hillside with
 * commanding views of the river mouth.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const RED_BRICK = 0xb84030;  // distinctive red brick walls
const BRICK_DK = 0x8a3028;   // darker red for shadows
const WHITE = 0xf0f0e8;      // British consular residence white
const ROOF = 0x5a5a5a;       // grey tile roof
const STONE = 0xa09080;      // stone foundation
const WOOD = 0x6a4a32;       // wooden doors/shutters

export const NM_FORT_SAN_DOMINGO = {
  id: 'fort_san_domingo',
  name: '淡水紅毛城',
  landmarkId: 4,
  dioramaRHint: 25, // ~25 m footprint
  colorHex: RED_BRICK, // red brick read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Stone hillside foundation ----------------------------------
    parts.push(box(1.4, 0.15, 1.0, STONE, { y: 0.075 })); // base platform
    parts.push(cyl(0.8, 1.0, 0.12, 8, STONE, { y: 0.21, sy: 0.3 })); // hill mound

    // ---- 2) Main fort structure (red brick square fort) ----------------
    const fortY = 0.27;
    // Fort walls (thick red brick)
    parts.push(box(0.7, 0.45, 0.6, RED_BRICK, { y: fortY + 0.225 })); // main keep
    // Wall detail (slight batter / slope inward)
    parts.push(box(0.72, 0.08, 0.62, BRICK_DK, { y: fortY })); // base course

    // ---- 3) Corner bastions (angled defensive projections) -------------
    for (const x of [-0.35, 0.35]) {
      for (const z of [-0.3, 0.3]) {
        // Small angled bastion at each corner
        parts.push(box(0.15, 0.4, 0.15, RED_BRICK, { x, y: fortY + 0.2, z }));
        // Crenellation on top
        parts.push(box(0.08, 0.06, 0.16, RED_BRICK, { x, y: fortY + 0.45, z }));
      }
    }

    // ---- 4) Fort parapet with crenellations ----------------------------
    const parapetY = fortY + 0.45;
    // Merlons (the tooth-like projections)
    for (let i = -2; i <= 2; i++) {
      parts.push(box(0.08, 0.08, 0.04, RED_BRICK, { x: i * 0.14, y: parapetY + 0.04, z: 0.32 }));
      parts.push(box(0.08, 0.08, 0.04, RED_BRICK, { x: i * 0.14, y: parapetY + 0.04, z: -0.32 }));
    }

    // ---- 5) British Consular Residence (white colonial building) -------
    const consulX = -0.55;
    parts.push(box(0.35, 0.4, 0.45, WHITE, { x: consulX, y: fortY + 0.2, z: 0.1 }));
    // Verandah with columns
    parts.push(box(0.1, 0.35, 0.47, WHITE, { x: consulX + 0.22, y: fortY + 0.18 }));
    for (const z of [-0.15, 0.15]) {
      parts.push(cyl(0.02, 0.02, 0.35, 6, WHITE, { x: consulX + 0.22, y: fortY + 0.18, z }));
    }
    // Grey pitched roof
    parts.push(box(0.38, 0.04, 0.48, ROOF, { x: consulX, y: fortY + 0.42 }));
    parts.push(cyl(0.28, 0.32, 0.04, 4, ROOF, { x: consulX, y: fortY + 0.46, ry: HALF_PI/2 }));

    // ---- 6) Entrance gate and wooden door ------------------------------
    parts.push(box(0.15, 0.25, 0.04, WOOD, { y: fortY + 0.12, z: 0.32 }));
    // Arched top
    parts.push(cyl(0.075, 0.075, 0.04, 8, RED_BRICK, { y: fortY + 0.25, z: 0.32, rx: HALF_PI, thetaLen: PI }));

    // ---- 7) Flagpole ---------------------------------------------------
    parts.push(cyl(0.015, 0.02, 0.6, 6, 0xffffff, { x: 0.25, y: fortY + 0.75, z: 0 }));
    // Small flag
    parts.push(box(0.12, 0.08, 0.01, 0x2244aa, { x: 0.32, y: fortY + 0.98, z: 0 }));

    // ---- 8) Courtyard and path -----------------------------------------
    parts.push(box(0.25, 0.02, 0.6, 0x8a7a6a, { x: 0.15, y: fortY - 0.03, z: 0.5 })); // path

    return finish(parts);
  },
};

export default NM_FORT_SAN_DOMINGO;
