/**
 * @file packs/pingtung/collectibles/diving_mask.js — Roll Formosa Pingtung pack.
 *
 * 潛水面鏡 (Diving Mask) — collectibleId 8. Kenting is famous for its
 * diving and snorkeling spots. Silhouette: a diving/snorkeling mask with
 * clear lens, silicone frame, and adjustable strap.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const FRAME_BLUE = 0x2060a0;   // blue frame
const SILICONE = 0x2a2a2a;     // black silicone
const LENS = 0xd0e8f8;         // clear lens (tinted)
const STRAP = 0x1a1a1a;        // black strap

export const COL_DIVING_MASK = {
  id: 'diving_mask',
  name: '潛水面鏡',
  collectibleId: 8,
  colorHex: FRAME_BLUE,

  buildGeometry(rng) {
    const parts = [];

    // --- Main frame (simplified: single wide frame) ---
    parts.push(sph(0.5, FRAME_BLUE, { ws: 5, hs: 4, sx: 2.0, sy: 0.9, sz: 0.35, y: 0 }));

    // --- Lenses (boxes instead of spheres) ---
    parts.push(box(0.35, 0.35, 0.08, LENS, { x: -0.45, y: 0, z: 0.12 }));
    parts.push(box(0.35, 0.35, 0.08, LENS, { x: 0.45, y: 0, z: 0.12 }));

    // --- Nose pocket ---
    parts.push(sph(0.2, SILICONE, { ws: 4, hs: 3, sx: 0.5, sy: 0.7, sz: 0.4, y: -0.3, z: -0.08 }));

    // --- Strap (simplified) ---
    parts.push(box(0.4, 0.12, 0.03, STRAP, { x: -1.0, y: 0.1, z: -0.1 }));
    parts.push(box(0.4, 0.12, 0.03, STRAP, { x: 1.0, y: 0.1, z: -0.1 }));
    parts.push(box(0.6, 0.15, 0.03, STRAP, { x: 0, y: 0.1, z: -0.5 }));

    return finish(parts);
  },
};

export default COL_DIVING_MASK;
