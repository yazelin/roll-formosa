/**
 * @file packs/matsu/landmarks/qinbi_village.js — Roll Formosa Matsu pack.
 *
 * 芹壁聚落 (Qinbi Village). The iconic traditional Fujian stone village on
 * Beigan Island, often called the "Mediterranean of the East." Clusters of
 * granite stone houses with traditional Minnan architecture cascade down a
 * hillside facing the sea, with narrow stone lanes between buildings.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the傳統閩東建築 Fujian stone village.
const GRANITE = 0x8a8a7a; // grey granite stone walls
const GRANITE_DARK = 0x6a6a5a; // darker stone shadows
const GRANITE_LIGHT = 0x9a9a8a; // lighter stone surfaces
const ROOF_TILE = 0x5a4a3a; // brown-grey roof tiles
const ROOF_DARK = 0x4a3a2a; // darker roof tiles
const WINDOW_DARK = 0x2a2a2a; // dark window openings
const WOOD = 0x6a4a2a; // wooden doors/trim
const GREEN = 0x4a6a4a; // hillside vegetation
const WATER = 0x3a6a8a; // sea water

export const NM_QINBI_VILLAGE = {
  id: 'qinbi_village',
  name: '芹壁聚落',
  landmarkId: 5,
  dioramaRHint: 25, // village cluster ~50m span
  colorHex: GRANITE, // distinctive grey granite stone

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Hillside terrain base ------------------------------------------
    // Sloped hillside - higher at back, lower at front (toward sea)
    parts.push(box(2.0, 0.15, 2.0, GREEN, { y: 0.08, rz: 0.1 }));
    // Sea in front
    parts.push(box(2.2, 0.08, 0.6, WATER, { y: 0.04, z: 1.1 }));

    // ---- 2) Stone houses cascading down hillside ---------------------------
    // Row 1 (back/top row) - 3 houses
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.42;
      const baseY = 0.30 + rng() * 0.05;
      const h = 0.22 + rng() * 0.08;
      // Main house body
      parts.push(box(0.28, h, 0.24, GRANITE, {
        x, y: baseY + h / 2, z: -0.5, hex2: GRANITE_LIGHT,
      }));
      // Roof
      parts.push(box(0.32, 0.04, 0.28, ROOF_TILE, {
        x, y: baseY + h + 0.02, z: -0.5, hex2: ROOF_DARK,
      }));
      // Window
      parts.push(box(0.06, 0.06, 0.02, WINDOW_DARK, {
        x, y: baseY + h * 0.6, z: -0.36,
      }));
    }

    // Row 2 (middle row) - 4 houses
    for (let i = 0; i < 4; i++) {
      const x = (i - 1.5) * 0.38;
      const baseY = 0.20 + rng() * 0.04;
      const h = 0.20 + rng() * 0.06;
      parts.push(box(0.26, h, 0.22, GRANITE_DARK, {
        x, y: baseY + h / 2, z: -0.1, hex2: GRANITE,
      }));
      parts.push(box(0.30, 0.04, 0.26, ROOF_DARK, {
        x, y: baseY + h + 0.02, z: -0.1, hex2: ROOF_TILE,
      }));
      // Door
      parts.push(box(0.05, 0.10, 0.02, WOOD, {
        x, y: baseY + 0.05, z: 0.03,
      }));
    }

    // Row 3 (front/bottom row) - 3 houses
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.45;
      const baseY = 0.12 + rng() * 0.03;
      const h = 0.18 + rng() * 0.05;
      parts.push(box(0.25, h, 0.20, GRANITE, {
        x, y: baseY + h / 2, z: 0.35, hex2: GRANITE_LIGHT,
      }));
      parts.push(box(0.28, 0.035, 0.24, ROOF_TILE, {
        x, y: baseY + h + 0.02, z: 0.35,
      }));
    }

    // ---- 3) Stone lanes / paths between houses -----------------------------
    parts.push(box(0.08, 0.02, 0.9, GRANITE_DARK, { x: -0.2, y: 0.16, z: -0.1 }));
    parts.push(box(0.08, 0.02, 0.9, GRANITE_DARK, { x: 0.25, y: 0.16, z: -0.1 }));

    // ---- 4) Larger prominent building (temple or main house) ---------------
    parts.push(box(0.35, 0.28, 0.28, GRANITE_LIGHT, { x: 0.6, y: 0.34, z: -0.3, hex2: GRANITE }));
    parts.push(box(0.40, 0.05, 0.32, ROOF_DARK, { x: 0.6, y: 0.50, z: -0.3 }));
    // Red door (temple entrance)
    parts.push(box(0.08, 0.14, 0.02, 0x8b2222, { x: 0.6, y: 0.27, z: -0.14 }));

    // ---- 5) Seawall at waterfront ------------------------------------------
    parts.push(box(1.8, 0.12, 0.10, GRANITE_DARK, { y: 0.14, z: 0.78 }));

    // ---- 6) Vegetation patches ---------------------------------------------
    for (let i = 0; i < 4; i++) {
      const x = (rng() - 0.5) * 1.5;
      const z = (rng() - 0.5) * 0.8 - 0.5;
      parts.push(sph(0.08 + rng() * 0.05, GREEN, { ws: 4, hs: 3, x, y: 0.20, z, sy: 0.5 }));
    }

    return finish(parts);
  },
};

export default NM_QINBI_VILLAGE;
