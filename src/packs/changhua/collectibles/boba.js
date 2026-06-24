/**
 * @file packs/taipei/collectibles/boba.js — Roll Formosa Taipei pack, COLLECTIBLE.
 *
 * COL_BOBA — 珍珠奶茶 (bubble / boba milk tea). Silhouette: a tapered clear cup
 * filled with tan milk tea, capped by a low domed lid, a fat straw poking out
 * the top at a jaunty angle, and a cluster of dark tapioca pearls settled in
 * the bottom of the cup. A small, recognizable hand-held cup — wide-ish,
 * never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 350 triangles (collectible budget). rng() only nudges the
 * milk-tea tint, never structure.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_BOBA = {
  id: 'boba',
  name: '珍珠奶茶',
  collectibleId: 1,
  colorHex: 0xc99b6e, // tan milk tea

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x060402); // tiny per-instance milk-tea tint nudge
    const tea = 0xc99b6e + t; // tan milk-tea fill
    const pearl = 0x2a211c; // dark tapioca brown

    return finish([
      // --- milk-tea FILL (slightly tapered, fills lower 3/4 of cup) -------
      // Drawn first/inner so the clear cup wall reads as a tinted glass skin.
      cyl(0.82, 0.62, 1.55, 12, tea, { y: 0.85, hex2: 0xd8b489 }), // tan body → lighter near top

      // --- tapioca PEARLS settled at the bottom of the cup ---------------
      sph(0.18, pearl, { ws: 4, hs: 3, x: 0.0, z: 0.0, y: 0.2 }),
      sph(0.16, pearl, { ws: 4, hs: 3, x: 0.32, z: 0.06, y: 0.18 }),
      sph(0.16, pearl, { ws: 4, hs: 3, x: -0.3, z: -0.1, y: 0.19 }),
      sph(0.15, pearl, { ws: 4, hs: 3, x: 0.08, z: 0.34, y: 0.18 }),
      sph(0.15, pearl, { ws: 4, hs: 3, x: -0.12, z: -0.32, y: 0.2 }),

      // --- clear CUP wall (open tube, faint cool tint = glass over tea) ---
      cyl(0.9, 0.66, 1.7, 12, 0xeaf2f4, { y: 0.9, open: true, hex2: 0xf6fbfc }),
      // cup base disc (closes the bottom)
      cyl(0.66, 0.66, 0.04, 6, 0xdfe8ea, { y: 0.06 }),
      // bright rim lip at the cup mouth
      cyl(0.92, 0.9, 0.07, 10, 0xf4fafb, { y: 1.78 }),

      // --- low domed LID (clear, sits over the rim) ----------------------
      sph(0.92, 0xeef5f7, { ws: 10, hs: 3, thetaLen: PI * 0.5, sy: 0.42, y: 1.78, hex2: 0xfbfeff }),
      // small lid hub where the straw punches through
      cyl(0.2, 0.22, 0.08, 6, 0xdce7e9, { y: 2.06 }),

      // --- fat STRAW poking out the top at a jaunty angle ----------------
      // angled slightly so it reads as casually stuck in.
      cyl(0.13, 0.13, 1.55, 8, 0xe24b5a, { x: 0.13, y: 2.55, z: 0.05, rz: -0.16, hex2: 0xf07480 }),
      // cut/bevel tip highlight at the top of the straw
      cyl(0.13, 0.1, 0.12, 6, 0xf28f99, { x: 0.18, y: 3.32, z: 0.06, rz: -0.16 }),
    ]);
  },
};

export default COL_BOBA;
