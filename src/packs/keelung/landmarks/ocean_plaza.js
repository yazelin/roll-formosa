/**
 * @file packs/keelung/landmarks/ocean_plaza.js — Roll Formosa Keelung pack.
 *
 * 海洋廣場 — Ocean Plaza, the large waterfront public space at Keelung's inner
 * harbor. Features a distinctive wave-shaped canopy structure, viewing platforms,
 * and the iconic "KEELUNG" sign. A popular gathering spot for watching cruise
 * ships and harbor activities.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const CANOPY_WHITE = 0xf4f8fa;   // White tensile canopy
const STEEL = 0x707880;          // Steel structure
const PLATFORM = 0xa0a4a8;       // Concrete platform
const DECK = 0x8a7060;           // Wooden deck
const WATER = 0x4a8090;          // Harbor water
const SIGN_BLUE = 0x2080c0;      // Blue sign
const BOLLARD = 0xf0b429;        // Yellow bollards
const LIGHT = 0xffd84d;          // Warm lighting

export const NM_OCEAN_PLAZA = {
  id: 'ocean_plaza',
  name: '海洋廣場',
  landmarkId: 5,
  dioramaRHint: 45,
  colorHex: CANOPY_WHITE,

  buildGeometry(rng) {
    const parts = [];

    // ---- Waterfront and platform ----
    // Water strip
    parts.push(box(3.5, 0.06, 0.8, WATER, { y: 0.03, z: 1.0 }));

    // Main plaza platform
    parts.push(box(3.2, 0.16, 1.8, PLATFORM, { y: 0.08 }));

    // Wooden deck area
    parts.push(box(2.0, 0.06, 1.2, DECK, { y: 0.19, z: 0.2 }));

    // ---- Wave-shaped canopy structure ----
    // Main canopy columns
    for (const cx of [-0.8, 0, 0.8]) {
      parts.push(cyl(0.06, 0.06, 1.6, 4, STEEL, { x: cx, y: 0.96, z: -0.3 }));
      // Angled support
      parts.push(cyl(0.04, 0.04, 0.6, 4, STEEL, {
        x: cx, y: 1.5, z: 0.1, rz: 0.5
      }));
    }

    // Wave-form canopy (multiple curved sections)
    parts.push(box(2.4, 0.06, 1.0, CANOPY_WHITE, { y: 1.78, z: 0.1 }));
    parts.push(box(2.2, 0.08, 0.6, CANOPY_WHITE, { y: 1.86, z: 0.2 }));
    parts.push(box(2.0, 0.1, 0.4, CANOPY_WHITE, { y: 1.96, z: 0.25 }));
    // Back wave dip
    parts.push(box(2.3, 0.06, 0.5, CANOPY_WHITE, { y: 1.72, z: -0.4 }));

    // ---- KEELUNG sign ----
    parts.push(box(1.2, 0.4, 0.08, SIGN_BLUE, { y: 0.56, z: 0.78 }));
    // Sign supports
    parts.push(cyl(0.04, 0.04, 0.38, 4, STEEL, { x: -0.5, y: 0.36, z: 0.74 }));
    parts.push(cyl(0.04, 0.04, 0.38, 4, STEEL, { x: 0.5, y: 0.36, z: 0.74 }));

    // ---- Bollards along waterfront ----
    for (let i = -3; i <= 3; i++) {
      parts.push(cyl(0.05, 0.05, 0.18, 4, BOLLARD, { x: i * 0.45, y: 0.25, z: 0.58 }));
    }

    // ---- Viewing platforms ----
    parts.push(box(0.6, 0.12, 0.4, PLATFORM, { x: -1.3, y: 0.22, z: 0.5 }));
    parts.push(box(0.6, 0.12, 0.4, PLATFORM, { x: 1.3, y: 0.22, z: 0.5 }));

    // Railings
    for (const px of [-1.3, 1.3]) {
      parts.push(box(0.62, 0.04, 0.02, STEEL, { x: px, y: 0.36, z: 0.68 }));
      parts.push(cyl(0.02, 0.02, 0.12, 4, STEEL, { x: px - 0.28, y: 0.3, z: 0.68 }));
      parts.push(cyl(0.02, 0.02, 0.12, 4, STEEL, { x: px + 0.28, y: 0.3, z: 0.68 }));
    }

    // ---- Light poles ----
    for (const lx of [-1.2, 1.2]) {
      parts.push(cyl(0.03, 0.03, 0.9, 4, STEEL, { x: lx, y: 0.62, z: -0.5 }));
      parts.push(sph(0.06, LIGHT, { ws: 4, hs: 3, x: lx, y: 1.1, z: -0.5 }));
    }

    return finish(parts);
  },
};

export default NM_OCEAN_PLAZA;
