/**
 * @file packs/hualien/landmarks/cultural_park.js — Roll Formosa Hualien pack.
 *
 * NM_CULTURAL_PARK — 花蓮文創園區 (Hualien Cultural and Creative Industries Park),
 * formerly the Hualien Wine Factory (花蓮酒廠). Features historic Japanese-era
 * industrial buildings converted into art galleries, studios, and creative spaces.
 * The distinctive sake warehouses with red brick and grey industrial architecture.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Industrial heritage colors
const BRICK = 0x8a4a3a; // red brick walls
const BRICK_D = 0x6a3a2a; // darker brick
const GREY = 0x7a7a7a; // grey concrete/industrial
const ROOF = 0x4a4a4a; // industrial roof
const WOOD = 0x5a4a3a; // wood accents
const CHIMNEY = 0x5a5a5a; // smokestack grey
const WINDOW = 0x4a6a7a; // window glass

export const NM_CULTURAL_PARK = {
  id: 'cultural_park',
  name: '花蓮文創園區',
  landmarkId: 4,
  dioramaRHint: 45,
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];

    // ---- Ground plaza ----------------------------------------------------
    parts.push(box(4.0, 0.06, 3.2, 0x8a8070, { y: 0.03 })); // stone plaza
    parts.push(box(1.0, 0.04, 2.8, 0x6a6050, { y: 0.02, x: 0 })); // walking path

    // ---- Main warehouse building (largest) --------------------------------
    const mainW = 2.0;
    const mainD = 1.2;
    const mainH = 1.3;
    parts.push(box(mainW, mainH, mainD, BRICK, { y: 0.06 + mainH / 2, x: -0.5, hex2: BRICK_D }));
    // Windows (industrial style)
    for (let i = 0; i < 4; i++) {
      parts.push(box(0.25, 0.4, 0.05, WINDOW, { x: -1.2 + i * 0.5, z: mainD / 2 + 0.01, y: 0.06 + 0.8 }));
    }
    // Gable roof
    parts.push(box(mainW + 0.2, 0.08, mainD + 0.2, WOOD, { x: -0.5, y: 0.06 + mainH + 0.04 }));
    parts.push(box(mainW - 0.2, 0.5, mainD - 0.1, ROOF, { x: -0.5, y: 0.06 + mainH + 0.3 }));
    parts.push(box(mainW - 0.4, 0.1, 0.12, ROOF, { x: -0.5, y: 0.06 + mainH + 0.55 })); // ridge

    // ---- Secondary warehouse (smaller, to the side) -----------------------
    const secW = 1.3;
    const secD = 0.9;
    const secH = 1.0;
    parts.push(box(secW, secH, secD, GREY, { x: 1.1, z: 0.1, y: 0.06 + secH / 2 }));
    // Flat industrial roof
    parts.push(box(secW + 0.1, 0.12, secD + 0.1, ROOF, { x: 1.1, z: 0.1, y: 0.06 + secH + 0.06 }));
    // Loading door
    parts.push(box(0.35, 0.55, 0.04, WOOD, { x: 1.1, z: secD / 2 + 0.03, y: 0.06 + 0.30 }));

    // ---- Historic chimney/smokestack (signature element) ------------------
    const chimX = 0.6;
    const chimZ = -0.8;
    parts.push(cyl(0.18, 0.22, 2.0, 8, CHIMNEY, { x: chimX, z: chimZ, y: 0.06 + 1.0 }));
    parts.push(cyl(0.22, 0.22, 0.15, 8, 0x4a4a4a, { x: chimX, z: chimZ, y: 0.06 + 2.0 })); // top ring
    // Smoke wisps (implied by small light grey shapes)
    parts.push(cyl(0.08, 0.04, 0.2, 6, 0xc0c0c0, { x: chimX + 0.05, z: chimZ, y: 2.25 }));

    // ---- Art installation (modern contrast) -------------------------------
    // Abstract sculpture
    parts.push(box(0.12, 0.8, 0.12, 0xea5a3a, { x: -1.5, z: 0.9, y: 0.46 })); // red pillar
    parts.push(box(0.3, 0.08, 0.08, 0x3a5aea, { x: -1.5, z: 0.9, y: 0.90 })); // blue cross piece

    // ---- Trees and greenery ----------------------------------------------
    parts.push(cyl(0.06, 0.07, 0.5, 6, 0x5a4030, { x: 1.6, z: -0.5, y: 0.31 }));
    parts.push(cone(0.3, 0.5, 6, 0x3a6a3a, { x: 1.6, z: -0.5, y: 0.70 }));

    return finish(parts);
  },
};

export default NM_CULTURAL_PARK;
