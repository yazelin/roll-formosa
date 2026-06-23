/**
 * @file packs/yilan/landmarks/jimmy_plaza.js — Roll Formosa Yilan pack.
 *
 * 幾米廣場 (Jimmy Plaza). The whimsical outdoor installation at Yilan Station
 * featuring iconic illustrations by Taiwanese artist Jimmy (幾米): a tilted
 * flying man sculpture, colorful suitcases, and a red-roofed waiting shelter
 * with illustrated panels.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const PLAZA = 0xc8c0b0;    // stone plaza floor
const SUITCASE_R = 0xc83030; // red suitcase
const SUITCASE_B = 0x3060a0; // blue suitcase
const SUITCASE_Y = 0xe0a020; // yellow suitcase
const SHELTER_R = 0xc04040;  // red roof
const SHELTER_W = 0xf0ece0;  // white shelter walls
const FIGURE = 0x50607a;     // flying man sculpture (bronze-ish)
const RAIL = 0x8a8a8a;       // metal rail

export const NM_JIMMY_PLAZA = {
  id: 'jimmy_plaza',
  name: '幾米廣場',
  landmarkId: 0,  // Yilan landmark #0 — smallest (dioramaRHint 12)
  dioramaRHint: 12,
  colorHex: 0xc04040, // red shelter roof — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Plaza floor ---------------------------------------------
    parts.push(cyl(1.2, 1.3, 0.08, 12, PLAZA, { y: 0.04 }));

    // ---- 2) Waiting shelter (red roof + white posts) ----------------
    // Posts
    parts.push(box(0.06, 0.6, 0.06, SHELTER_W, { x: -0.4, z: 0.35, y: 0.34 }));
    parts.push(box(0.06, 0.6, 0.06, SHELTER_W, { x: 0.4, z: 0.35, y: 0.34 }));
    parts.push(box(0.06, 0.6, 0.06, SHELTER_W, { x: -0.4, z: -0.15, y: 0.34 }));
    parts.push(box(0.06, 0.6, 0.06, SHELTER_W, { x: 0.4, z: -0.15, y: 0.34 }));
    // Red roof
    parts.push(box(1.0, 0.08, 0.7, SHELTER_R, { y: 0.68, z: 0.1 }));
    // Back panel (illustrated wall)
    parts.push(box(0.9, 0.4, 0.04, SHELTER_W, { y: 0.44, z: 0.48 }));

    // ---- 3) Suitcase stack ------------------------------------------
    parts.push(box(0.22, 0.14, 0.16, SUITCASE_R, { x: -0.6, y: 0.15, z: -0.4 }));
    parts.push(box(0.18, 0.12, 0.14, SUITCASE_B, { x: -0.58, y: 0.28, z: -0.38 }));
    parts.push(box(0.14, 0.10, 0.12, SUITCASE_Y, { x: -0.56, y: 0.39, z: -0.36 }));

    // ---- 4) Flying man sculpture ------------------------------------
    // A tilted figure on a pole (simplified)
    parts.push(cyl(0.04, 0.04, 0.8, 6, RAIL, { x: 0.5, z: -0.5, y: 0.44, rz: 0.3 }));
    // Body (capsule-like)
    parts.push(
      cyl(0.12, 0.10, 0.4, 6, FIGURE, { x: 0.7, z: -0.7, y: 0.72, rz: 0.6 })
    );
    // Head
    parts.push(sph(0.08, FIGURE, { ws: 6, hs: 4, x: 0.82, z: -0.82, y: 0.88 }));
    // Arms spread out
    parts.push(box(0.5, 0.05, 0.05, FIGURE, { x: 0.7, z: -0.7, y: 0.72, rz: 0.6, ry: 0.2 }));

    // ---- 5) Bench ---------------------------------------------------
    parts.push(box(0.5, 0.06, 0.16, 0x8a6a4a, { x: 0.0, z: -0.65, y: 0.14 }));
    parts.push(box(0.04, 0.10, 0.04, RAIL, { x: -0.22, z: -0.65, y: 0.05 }));
    parts.push(box(0.04, 0.10, 0.04, RAIL, { x: 0.22, z: -0.65, y: 0.05 }));

    // ---- 6) Small decorative elements -------------------------------
    // A couple of illustrated panels on the ground
    parts.push(box(0.15, 0.02, 0.15, 0xf0d0a0, { x: 0.7, z: 0.3, y: 0.09 }));

    return finish(parts);
  },
};

export default NM_JIMMY_PLAZA;
