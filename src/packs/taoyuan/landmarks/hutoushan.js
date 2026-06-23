/**
 * @file packs/taoyuan/landmarks/hutoushan.js — Roll Formosa Taoyuan pack.
 *
 * 虎頭山 (Hutoushan / Tiger Head Mountain) — a popular recreational mountain
 * park in Taoyuan City, featuring hiking trails, a children's playground, and
 * a distinctive observation tower. The mountain rises 251m above sea level
 * and offers panoramic views of the Taoyuan Plateau and its famous ponds.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: green forested slopes, grey observation tower, earth tones.
 */

import { box, cyl, cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const FOREST_D = 0x3a5a3a; // dark forest canopy
const FOREST = 0x4a7a4a; // forest green
const FOREST_L = 0x5a9a5a; // lighter forest patches
const TOWER = 0x8a8a88; // concrete observation tower
const TOWER_L = 0xa8a8a4; // tower highlight
const EARTH = 0x7a6a58; // exposed earth/trails
const RAILING = 0x606060; // tower railing

export const NM_HUTOUSHAN = {
  id: 'hutoushan',
  name: '虎頭山',
  landmarkId: 3, // medium landmark
  dioramaRHint: 50, // ~60 m mountain representation
  colorHex: FOREST,

  buildGeometry(rng) {
    const parts = [];

    // === MOUNTAIN BASE =======================================================
    // Layered cones to create mountain silhouette
    parts.push(cone(2.8, 1.2, 8, FOREST_D, { y: 0.6, hex2: FOREST }));
    parts.push(cone(2.2, 0.9, 8, FOREST, { y: 1.5, hex2: FOREST_L }));
    parts.push(cone(1.4, 0.7, 6, FOREST_L, { y: 2.2, hex2: 0x6aaa6a }));

    // Secondary peaks (tiger head shape)
    parts.push(cone(1.2, 0.6, 6, FOREST, { x: -1.0, y: 1.0, hex2: FOREST_L }));
    parts.push(cone(1.0, 0.5, 6, FOREST, { x: 1.2, y: 0.9, hex2: FOREST_L }));

    // === OBSERVATION TOWER ===================================================
    // The distinctive multi-level observation tower
    parts.push(cyl(0.25, 0.25, 1.4, 6, TOWER, { y: 3.4, hex2: TOWER_L }));
    // Observation deck levels
    parts.push(cyl(0.4, 0.4, 0.12, 8, TOWER_L, { y: 3.85 }));
    parts.push(cyl(0.35, 0.35, 0.1, 8, TOWER_L, { y: 4.15 }));
    // Roof cap
    parts.push(cone(0.4, 0.25, 6, 0x606058, { y: 4.35 }));
    // Railing
    parts.push(cyl(0.42, 0.42, 0.15, 8, RAILING, { y: 3.95, open: true }));

    // === HIKING TRAILS =======================================================
    // Winding trail (represented as earth-colored patches)
    parts.push(box(0.15, 0.04, 0.8, EARTH, { x: 0.5, y: 1.8, z: 0.3, ry: 0.3 }));
    parts.push(box(0.12, 0.04, 0.6, EARTH, { x: -0.3, y: 1.4, z: -0.4, ry: -0.4 }));

    // === FOREST CANOPY DETAILS ===============================================
    // Tree clusters (spherical canopy representations)
    const treePos = [
      { x: 0.8, y: 1.6, z: 0.6 },
      { x: -0.9, y: 1.4, z: 0.4 },
      { x: 0.4, y: 1.9, z: -0.5 },
      { x: -0.5, y: 1.7, z: -0.6 },
    ];
    for (const p of treePos) {
      parts.push(sph(0.25 + rng() * 0.1, FOREST_L, { ws: 5, hs: 4, ...p }));
    }

    // === BASE GROUND =========================================================
    parts.push(box(4.0, 0.1, 4.0, 0x6a5a48, { y: 0.05 }));

    return finish(parts);
  },
};

export default NM_HUTOUSHAN;
