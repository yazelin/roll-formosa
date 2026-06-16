/**
 * @file packs/kaohsiung/collectibles/papaya_milk_king.js — Roll Formosa
 * Kaohsiung pack, COLLECTIBLE.
 *
 * COL_PAPAYA_MILK — 木瓜牛奶 (papaya milk), the signature drink of 高雄牛乳大王
 * (Kaohsiung's beloved "Milk King" stand). Silhouette: a round, pot-bellied
 * clear glass cup — fatter than a bubble-tea cup, bulging at the belly and pulling
 * back to a narrow base — brimming with creamy pale-yellow papaya milk, topped
 * by a domed dollop of froth and a fat straw poking out at a jaunty angle.
 * Small and hand-held; the round belly is what tells it apart from a milk-tea
 * cup at thumbnail size.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. Collectible budget (well under 600 tris). rng() only nudges the
 * milk tint, never structure.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_PAPAYA_MILK = {
  id: 'papaya_milk_king',
  name: '木瓜牛奶',
  collectibleId: 13,
  colorHex: 0xf4e3a0, // creamy pale-yellow papaya milk

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040402); // tiny per-instance milk tint nudge
    const milk = 0xf4e3a0 + t; // creamy papaya milk fill
    const froth = 0xfdf3cf; // lighter froth/foam on top

    return finish([
      // --- papaya-milk FILL — a fat pot-bellied body (sph, squashed to a
      //     barrel) so it reads rounder than a tapered tea cup. Drawn first
      //     so the clear glass wall reads as a tinted skin over it. ---------
      sph(0.78, milk, { ws: 12, hs: 7, sy: 1.18, y: 0.92, hex2: 0xfaeec0 }),
      // a little extra fill at the very top so the surface sits near the rim
      cyl(0.6, 0.66, 0.22, 12, milk, { y: 1.58, hex2: froth }),

      // --- domed froth dollop sitting on the milk surface ----------------
      sph(0.58, froth, { ws: 12, hs: 4, thetaLen: PI * 0.5, sy: 0.5, y: 1.62, hex2: 0xfffbe8 }),

      // --- clear GLASS wall (open tube, round-bellied: wide middle, narrow
      //     base) so the glass hugs the milk. Faint cool tint = glass. ------
      cyl(0.62, 0.5, 0.5, 14, 0xeef4f2, { y: 0.32, open: true, hex2: 0xf6fbf9 }),
      cyl(0.84, 0.62, 0.7, 14, 0xeef4f2, { y: 0.85, open: true, hex2: 0xf6fbf9 }),
      cyl(0.78, 0.84, 0.6, 14, 0xeef4f2, { y: 1.45, open: true, hex2: 0xf8fcfb }),
      // glass base disc (closes the bottom)
      cyl(0.5, 0.5, 0.05, 8, 0xe2ecea, { y: 0.06 }),
      // bright rim lip at the cup mouth
      cyl(0.8, 0.78, 0.07, 12, 0xf4fafb, { y: 1.76 }),

      // --- fat STRAW poking out the top at a jaunty angle ----------------
      cyl(0.12, 0.12, 1.5, 8, 0xff8a3d, { x: -0.18, y: 2.32, z: 0.06, rz: 0.18, hex2: 0xffb06a }),
      // cut/bevel tip highlight at the top of the straw
      cyl(0.12, 0.09, 0.12, 6, 0xffc28a, { x: -0.28, y: 3.05, z: 0.06, rz: 0.18 }),
    ]);
  },
};

export default COL_PAPAYA_MILK;
