/**
 * @file packs/keelung/collectibles/jiguela.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_JIGUELA — 吉古拉 (Keelung Miaokou grilled chikuwa). Silhouette: a stout
 * browned fish-paste tube with a hollow core (the signature hole running
 * through it), charred grill spots down the side, threaded onto a thin bamboo
 * skewer that pokes out one end. A small hand-held grilled snack — fat tube,
 * never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the read. <= 350 triangles
 * (collectible budget). rng() only nudges the char tint, never structure.
 */

import { cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_JIGUELA = {
  id: 'jiguela',
  name: '吉古拉',
  collectibleId: 10,
  colorHex: 0xc88a3e, // grilled golden-brown fish paste

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x050301); // tiny per-instance char tint nudge
    const skin = 0xc88a3e + t; // grilled golden-brown
    const skinHi = 0xdca55a; // lighter toasted highlight
    const char = 0x6e4318; // dark grill char
    const hole = 0x7a5a30; // shaded inner tube hole
    const bamboo = 0xdac88a; // pale bamboo skewer

    // tube lies horizontal along X (rotate cylinders rz: HALF)
    const parts = [];

    // --- main TUBE body (browned, slightly tapered toward the far end) ---
    parts.push(cyl(0.5, 0.46, 1.7, 12, skin, { rz: HALF_PI, y: 0.0, hex2: skinHi }));
    // open browned end ring (near end) so the hollow read is unmistakable
    parts.push(cyl(0.5, 0.5, 0.12, 12, skin, { rz: HALF_PI, x: 0.82, hex2: char, open: true }));
    // dark inner hole at the near end (a recessed shaded disc + short bore)
    parts.push(cyl(0.26, 0.24, 0.5, 10, hole, { rz: HALF_PI, x: 0.66 }));

    // --- CHAR grill spots scattered along the upper side ----------------
    parts.push(sph(0.1, char, { ws: 4, hs: 3, sx: 1.4, sy: 0.4, sz: 1.0, x: 0.2, y: 0.42, z: 0.08 }));
    parts.push(sph(0.09, char, { ws: 4, hs: 3, sx: 1.4, sy: 0.4, sz: 1.0, x: -0.34, y: 0.4, z: -0.1 }));
    parts.push(sph(0.08, char, { ws: 4, hs: 3, sx: 1.3, sy: 0.4, sz: 1.0, x: -0.06, y: 0.36, z: 0.34 }));
    parts.push(sph(0.07, char, { ws: 4, hs: 3, sx: 1.3, sy: 0.4, sz: 1.0, x: 0.46, y: 0.34, z: -0.28 }));

    // --- BAMBOO skewer threaded through the core, poking out the far end -
    parts.push(cyl(0.06, 0.05, 2.5, 6, bamboo, { rz: HALF_PI, y: 0.0, hex2: 0xc7b271 }));
    // whittled skewer tip
    parts.push(cyl(0.05, 0.0, 0.16, 5, 0xe8dcab, { rz: HALF_PI, x: -1.32 }));

    return finish(parts);
  },
};

export default COL_JIGUELA;
