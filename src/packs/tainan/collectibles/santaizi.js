/**
 * @file packs/tainan/collectibles/santaizi.js — Roll Formosa Tainan pack, COLLECTIBLE.
 *
 * COL_SANTAIZI — 虱目魚 (milkfish). Tainan's signature aquaculture fish: a whole
 * silvery milkfish lying on a small plate. Silhouette: an elongated tapered
 * fish body (a stretched ellipsoid, silvery blue-grey on top fading to a lighter
 * belly), a deeply forked tail fin, a low dorsal fin, a small pectoral fin, and
 * a dark round eye near the snout. A small hand-held food item — the long fish
 * resting flat on a low dish.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (long tapered body, forked tail)
 * carry the read — never absolute size. <= 350 triangles, so segment counts are
 * kept low. rng() only nudges the body sheen tint; never structure.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// ---- milkfish palette -------------------------------------------------------
const BODY = 0xb8c2c8;   // silvery blue-grey back
const BACK = 0x8a9aa6;   // darker dorsal sheen (top gradient)
const BELLY = 0xeef2f4;  // pale silver belly
const FIN = 0x9aa6ae;    // grey fins
const EYE = 0x201c1c;    // dark eye
const PLATE = 0xf3ede2;  // off-white plate
const PLATE_D = 0xdacfbd; // plate rim shadow

export const COL_SANTAIZI = {
  id: 'santaizi',
  name: '虱目魚',
  collectibleId: 6,
  colorHex: BODY,

  buildGeometry(rng) {
    const sheen = BODY - (rng() < 0.5 ? 0 : 0x040404); // tiny per-instance sheen nudge

    return finish([
      // ===== PLATE the fish rests on ======================================
      cyl(1.65, 1.45, 0.18, 10, PLATE, { y: -0.42, hex2: PLATE_D }),
      cyl(1.6, 1.6, 0.1, 10, PLATE_D, { y: -0.33, open: true }), // rim band

      // ===== FISH BODY (elongated tapered ellipsoid along X) ==============
      // belly lighter (bottom), back darker (top) via vertical gradient.
      sph(0.62, sheen, { ws: 8, hs: 5, sx: 2.5, sz: 0.78, y: 0.0, hex2: BACK }),
      // pale belly underside slab to brighten the lower flank
      sph(0.5, BELLY, { ws: 6, hs: 4, sx: 2.4, sz: 0.7, y: -0.18 }),

      // tapered snout at the head end (+X) and pinched tail base (-X)
      cone(0.34, 0.6, 7, sheen, { rz: -HALF_PI, x: 1.4, y: 0.02, hex2: BACK }),
      cone(0.26, 0.5, 7, sheen, { rz: HALF_PI, x: -1.35, y: 0.0, hex2: BACK }),

      // ===== FORKED TAIL FIN (-X end) =====================================
      // two splayed flat triangular lobes = the deep milkfish fork
      box(0.7, 0.62, 0.05, FIN, { x: -1.95, y: 0.28, rz: 0.55 }),
      box(0.7, 0.62, 0.05, FIN, { x: -1.95, y: -0.28, rz: -0.55 }),

      // ===== DORSAL FIN (low triangular fin on the back) ==================
      cone(0.4, 0.45, 4, FIN, { x: -0.1, y: 0.62, sx: 0.4 }),

      // ===== PECTORAL FIN (small fin on the side flank) ===================
      box(0.4, 0.28, 0.04, FIN, { x: 0.45, y: -0.18, z: 0.42, rz: -0.4, ry: 0.5 }),

      // ===== EYE (dark sphere near the snout) =============================
      sph(0.14, EYE, { ws: 6, hs: 5, x: 1.18, y: 0.18, z: 0.4 }),
      sph(0.14, EYE, { ws: 6, hs: 5, x: 1.18, y: 0.18, z: -0.4 }),
    ]);
  },
};

export default COL_SANTAIZI;
