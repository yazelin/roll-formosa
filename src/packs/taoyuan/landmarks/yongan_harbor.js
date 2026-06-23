/**
 * @file packs/taoyuan/landmarks/yongan_harbor.js — Roll Formosa Taoyuan pack.
 *
 * 永安漁港 (Yongan Fishing Harbor) — a charming fishing port on Taoyuan's
 * coast, famous for its green fishing boats, fresh seafood restaurants, and
 * the iconic 永安觀海橋 (Yongan Sea-Viewing Bridge). The harbor represents
 * Taoyuan's coastal heritage and fishing industry.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: green fishing boats, blue-grey water, red bridge, concrete pier.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const BOAT_GREEN = 0x38a050; // traditional green fishing boat
const BOAT_BLUE = 0x3878a8; // blue boat variant
const WATER = 0x4a6a80; // harbor water
const PIER = 0xa0988c; // concrete pier
const BRIDGE = 0xc84040; // red observation bridge
const HULL = 0x284030; // boat hull dark

export const NM_YONGAN_HARBOR = {
  id: 'yongan_harbor',
  name: '永安漁港',
  landmarkId: 5, // medium-large landmark
  dioramaRHint: 100, // ~120 m harbor area
  colorHex: BOAT_GREEN,

  buildGeometry(rng) {
    const parts = [];

    // === HARBOR WATER ========================================================
    parts.push(box(4.5, 0.12, 3.0, WATER, { y: 0.06, z: 0.5 }));

    // === CONCRETE PIER =======================================================
    // Main pier structure
    parts.push(box(4.0, 0.35, 0.8, PIER, { y: 0.17, z: -1.0 }));
    // Pier edge bollards
    for (let i = 0; i < 5; i++) {
      parts.push(cyl(0.08, 0.06, 0.2, 6, 0x606058, { x: -1.5 + i * 0.75, y: 0.45, z: -0.65 }));
    }

    // === FISHING BOATS =======================================================
    // Green boat 1
    parts.push(box(1.2, 0.25, 0.4, BOAT_GREEN, { x: -1.0, y: 0.2, z: 0.3, hex2: HULL }));
    parts.push(box(0.2, 0.35, 0.3, 0xe0e0d8, { x: -0.6, y: 0.45, z: 0.3 })); // wheelhouse
    parts.push(cyl(0.03, 0.03, 0.4, 6, 0x5a4030, { x: -1.3, y: 0.5, z: 0.3 })); // mast

    // Blue boat 2
    parts.push(box(1.0, 0.22, 0.35, BOAT_BLUE, { x: 0.5, y: 0.18, z: 0.6, hex2: 0x1a3850 }));
    parts.push(box(0.18, 0.3, 0.25, 0xe8e8e0, { x: 0.8, y: 0.4, z: 0.6 })); // wheelhouse

    // Green boat 3 (smaller)
    parts.push(box(0.8, 0.2, 0.3, BOAT_GREEN, { x: 1.6, y: 0.16, z: 0.2, hex2: HULL }));

    // === 永安觀海橋 (Observation Bridge) =====================================
    // The iconic red arched bridge
    parts.push(cyl(1.2, 1.2, 0.2, 12, BRIDGE, {
      rx: HALF_PI,
      theta0: 0,
      thetaLen: PI,
      x: 0,
      y: 0.7,
      z: 1.5,
    }));
    // Bridge deck
    parts.push(box(2.2, 0.1, 0.4, 0xd0c8c0, { y: 0.7, z: 1.5 }));
    // Bridge pylons
    parts.push(cyl(0.12, 0.12, 0.7, 6, BRIDGE, { x: -1.0, y: 0.35, z: 1.5 }));
    parts.push(cyl(0.12, 0.12, 0.7, 6, BRIDGE, { x: 1.0, y: 0.35, z: 1.5 }));

    // === SEAFOOD MARKET BUILDING =============================================
    parts.push(box(1.4, 0.6, 0.8, 0xc8c0b8, { x: 1.5, y: 0.3, z: -1.4, hex2: 0xd8d0c8 }));
    parts.push(box(1.5, 0.1, 0.9, 0x8a4030, { x: 1.5, y: 0.65, z: -1.4 })); // red roof

    // === LIGHTHOUSE / MARKER =================================================
    parts.push(cyl(0.1, 0.08, 0.5, 6, 0xe0e0e0, { x: -1.8, y: 0.45, z: -0.8 }));
    parts.push(cone(0.12, 0.15, 6, 0xe05030, { x: -1.8, y: 0.78 })); // red cap

    return finish(parts);
  },
};

export default NM_YONGAN_HARBOR;
