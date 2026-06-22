/**
 * @file packs/hualien/collectibles/aboriginal_plate.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_ABORIGINAL_PLATE — 船型木盤 (boat-shaped wooden plate). A traditional
 * Amis (阿美族) wooden serving plate carved in the shape of a canoe/boat,
 * used for serving traditional dishes. Dark polished wood with simple
 * carved decorations along the rim.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const WOOD = 0x5a3a28; // dark polished wood
const WOOD_HI = 0x7a5a40;
const CARVE = 0x4a2a18; // carved decoration darker
const FOOD = 0x8a6a4a; // millet or food inside

export const COL_ABORIGINAL_PLATE = {
  id: 'aboriginal_plate',
  name: '船型木盤',
  collectibleId: 10,
  colorHex: 0x5a3a28, // dark wood

  buildGeometry(rng) {
    const parts = [];

    // --- BOAT-SHAPED PLATE BODY ---
    // Main elongated bowl (elliptical)
    parts.push(cyl(0.5, 0.3, 0.35, 10, WOOD, {
      y: 0.175,
      sx: 2.2,
      hex2: WOOD_HI,
    }));

    // --- Pointed bow (front) ---
    parts.push(cyl(0.35, 0.05, 0.4, 6, WOOD, {
      x: 1.0, y: 0.2,
      rz: -0.3,
      hex2: WOOD_HI,
    }));

    // --- Pointed stern (back) ---
    parts.push(cyl(0.35, 0.05, 0.4, 6, WOOD, {
      x: -1.0, y: 0.2,
      rz: 0.3,
      hex2: WOOD_HI,
    }));

    // --- Rim decoration (carved lines) ---
    parts.push(box(1.8, 0.04, 0.08, CARVE, { x: 0, y: 0.38, z: 0.25 }));
    parts.push(box(1.8, 0.04, 0.08, CARVE, { x: 0, y: 0.38, z: -0.25 }));

    // --- Diamond pattern along rim ---
    for (let i = -2; i <= 2; i++) {
      parts.push(box(0.06, 0.05, 0.06, CARVE, { x: i * 0.35, y: 0.40, z: 0.3, ry: 0.78 }));
    }

    // --- Food inside (millet grains) ---
    parts.push(sph(0.3, FOOD, { ws: 6, hs: 3, sy: 0.4, y: 0.25, hex2: 0x9a7a5a }));
    parts.push(sph(0.2, FOOD, { ws: 5, hs: 3, sy: 0.35, x: 0.3, y: 0.22, z: 0.05 }));

    return finish(parts);
  },
};

export default COL_ABORIGINAL_PLATE;
