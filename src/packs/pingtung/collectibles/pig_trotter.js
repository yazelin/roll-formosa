/**
 * @file packs/pingtung/collectibles/pig_trotter.js — Roll Formosa Pingtung pack.
 *
 * 萬巒豬腳 (Wanwan Braised Pig's Trotter) — collectibleId 2. The famous
 * Wanwan-style braised pig's trotter, a Pingtung delicacy known for its
 * gelatinous texture and savory soy glaze. Silhouette: a glossy braised
 * trotter on a small plate, with the characteristic dark caramelized color.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { cyl, sph, box, finish, HALF_PI } from '../geomHelpers.js';

const BRAISED = 0x5c2a1a;      // dark braised soy color
const BRAISED_HI = 0x7a3a2a;   // glossy highlight
const PLATE = 0xf0f0f0;        // white plate
const BONE = 0xf5f0e8;         // bone end

export const COL_PIG_TROTTER = {
  id: 'pig_trotter',
  name: '萬巒豬腳',
  collectibleId: 2,
  colorHex: BRAISED,

  buildGeometry(rng) {
    const parts = [];

    // --- Plate base (simplified) ---
    parts.push(cyl(1.0, 1.0, 0.06, 8, PLATE, { y: 0 }));

    // --- Main trotter body (simplified: 2 lumps) ---
    parts.push(sph(0.5, BRAISED, { ws: 6, hs: 4, sx: 1.0, sy: 0.75, sz: 1.2, y: 0.45, hex2: BRAISED_HI }));
    parts.push(sph(0.35, BRAISED_HI, { ws: 5, hs: 3, y: 0.8, z: 0.1 }));

    // --- Hoof end with bone ---
    parts.push(cyl(0.15, 0.2, 0.3, 5, BRAISED, { z: 0.7, y: 0.3, rx: 0.3 }));
    parts.push(cyl(0.07, 0.08, 0.12, 4, BONE, { z: 0.9, y: 0.28, rx: 0.3 }));

    return finish(parts);
  },
};

export default COL_PIG_TROTTER;
