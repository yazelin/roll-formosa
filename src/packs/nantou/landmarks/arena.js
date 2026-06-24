/**
 * @file packs/taipei/landmarks/arena.js — Roll Formosa Taipei pack, hero LANDMARK.
 *
 * NM_ARENA — 小巨蛋 (Taipei Arena). Silhouette: a low, flattened SILVER DOME
 * (shallow hemispherical cap) seated on a short cylindrical GLASS base ring.
 * Clean silver/grey dome + a banded glass curtain skirt with a thin cornice
 * lip where the two meet. Wide-and-low proportions — never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 600 triangles (hero budget). rng() only nudges glass tint.
 */

import { cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

export const NM_ARENA = {
  id: 'taipei_arena',
  name: '小巨蛋',
  landmarkId: 7,
  dioramaRHint: 60, // real Taipei Arena footprint ~ 120 m across, dome ~ 60 m high
  colorHex: 0xc6cdd4, // silver-grey dome

  buildGeometry(rng) {
    const t = rng() < 0.5 ? 0x0 : 0x040404; // tiny per-instance glass tint nudge
    const glass = 0x7fb8d4 - t;

    return finish([
      // --- short cylindrical GLASS base ring (wide + low) ----------------
      cyl(2.05, 2.1, 0.62, 16, glass, { y: 0.31, hex2: 0xaee0f4 }), // glazed curtain skirt (vertical sheen)
      cyl(2.12, 2.16, 0.07, 12, 0x9aa2aa, { y: 0.04 }), // ground plinth lip
      torus(2.07, 0.05, 3, 10, 0xd6dbe0, { rx: PI / 2, y: 0.62 }), // bright cornice ring (glass→dome seam)

      // --- vertical mullion glints around the glass ring -----------------
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { x: 2.06, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { x: -2.06, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { z: 2.06, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { z: -2.06, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { x: 1.46, z: 1.46, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { x: -1.46, z: 1.46, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { x: 1.46, z: -1.46, y: 0.32 }),
      cyl(0.03, 0.03, 0.6, 3, 0xe6ecf0, { x: -1.46, z: -1.46, y: 0.32 }),

      // --- low flattened SILVER DOME (shallow cap, vertically squashed) ---
      // Only the TOP hemisphere (thetaLen = HALF_PI) is built, then squashed
      // sy=0.5 → a wide shallow dome; no wasted hidden underside polys.
      sph(2.1, 0xc6cdd4, { ws: 16, hs: 6, thetaLen: HALF_PI, sy: 0.5, y: 0.62, hex2: 0xeef2f6 }), // silver dome (grey base → near-white crown)

      // --- crown detailing: concentric rib ring + apex vent --------------
      torus(1.5, 0.035, 3, 10, 0xb6bdc4, { rx: PI / 2, y: 0.95 }), // mid rib ring
      cyl(0.32, 0.36, 0.1, 10, 0xaab1b8, { y: 1.2 }), // apex skylight drum
      cyl(0.3, 0.3, 0.04, 8, 0xdfe4e8, { y: 1.27 }), // apex glazing cap
    ]);
  },
};

export default NM_ARENA;
