/**
 * @file packs/pingtung/collectibles/banana_boat.js — Roll Formosa Pingtung pack.
 *
 * 香蕉船 (Banana Boat) — collectibleId 9. The classic inflatable banana boat
 * ride, a popular water activity at Kenting beaches. Silhouette: a bright
 * yellow inflatable boat shaped like a banana with handles.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, cyl, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const YELLOW = 0xf0d020;       // bright banana yellow
const YELLOW_DARK = 0xd0b010;  // shaded yellow
const GREEN = 0x40a030;        // stem green
const HANDLE = 0x303030;       // black handles

export const COL_BANANA_BOAT = {
  id: 'banana_boat',
  name: '香蕉船',
  collectibleId: 9,
  colorHex: YELLOW,

  buildGeometry(rng) {
    const parts = [];

    // --- Main banana body (simplified: 2 main sections) ---
    // Front/middle section
    parts.push(sph(0.55, YELLOW, { ws: 6, hs: 4, sx: 0.9, sy: 0.8, sz: 2.0, z: 0.3, y: 0.15, hex2: YELLOW_DARK }));
    // Back section (tapered)
    parts.push(sph(0.4, YELLOW, { ws: 5, hs: 3, sx: 0.8, sy: 0.7, sz: 1.0, z: -1.2, y: 0.2, hex2: YELLOW_DARK }));

    // --- Tips ---
    parts.push(sph(0.15, GREEN, { ws: 4, hs: 2, z: -1.7, y: 0.25 }));
    parts.push(sph(0.12, 0x5a4030, { ws: 3, hs: 2, z: 1.5, y: 0.35 }));

    // --- Handles (simplified: 2 handles as boxes) ---
    parts.push(box(0.08, 0.15, 0.08, HANDLE, { z: 0.4, y: 0.5 }));
    parts.push(box(0.08, 0.15, 0.08, HANDLE, { z: -0.4, y: 0.5 }));

    return finish(parts);
  },
};

export default COL_BANANA_BOAT;
