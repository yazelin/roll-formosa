/**
 * @file packs/tainan/collectibles/boba.js — Roll Formosa Tainan pack, COLLECTIBLE.
 *
 * COL_BOBA — 棺材板 (coffin toast). Tainan's signature deep-fried thick-toast
 * "coffin": a tall rectangular block of golden deep-fried bread, hollowed out,
 * with the top slice cut and lifted on a hinge like a coffin lid, revealing a
 * pale creamy seafood-chowder filling inside the hollow with a few diced cubes
 * floating in it. A small hand-held food item — a browned crusty brick with its
 * lid propped open.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 350 triangles (collectible budget). rng() only nudges the
 * fry tint, never structure.
 */

import { box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_BOBA = {
  id: 'boba',
  name: '棺材板',
  collectibleId: 1,
  colorHex: 0xcf9b54, // deep-fried golden toast

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040301); // tiny per-instance fry-tone nudge
    const crust = 0xcf9b54 + t; // golden fried crust (top, lighter)
    const crustLo = 0x9a6a26; // darker browned underside / fried base
    const crumb = 0xead9b0; // pale inner bread crumb
    const cream = 0xf2ead2; // creamy seafood chowder filling
    const dice = 0xd98a5a; // diced seafood/carrot cube
    const dice2 = 0xe8d7b6; // pale diced potato cube

    return finish([
      // --- BREAD BLOCK base (the hollow "coffin") -------------------------
      // A thick toast brick, browned crust top, darker fried base.
      box(2.0, 1.5, 1.4, crust, { y: 0.75, hex2: crustLo }),
      // crusty browned bottom slab so the fried base reads darker
      box(2.04, 0.3, 1.44, crustLo, { y: 0.15 }),

      // --- HOLLOW interior: pale crumb walls + cream filling --------------
      // crumb-coloured inset implying the scooped-out bread well
      box(1.6, 1.1, 1.04, crumb, { y: 0.78 }),
      // creamy seafood-chowder pool sitting in the hollow
      box(1.5, 0.5, 0.94, cream, { y: 0.62, hex2: 0xfbf5e6 }),

      // --- DICED filling cubes floating in the chowder --------------------
      box(0.22, 0.2, 0.22, dice, { x: -0.4, y: 0.82, z: 0.1, ry: 0.4 }),
      box(0.2, 0.18, 0.2, dice2, { x: 0.32, y: 0.8, z: -0.12, ry: -0.5 }),
      box(0.18, 0.18, 0.18, dice, { x: 0.05, y: 0.84, z: 0.2, ry: 0.7 }),
      box(0.18, 0.16, 0.18, dice2, { x: -0.18, y: 0.8, z: -0.22, ry: 0.2 }),

      // --- LIFTED LID: top bread slice cut and propped open on a hinge ----
      // Hinged at the back edge (z negative), tilted up so it reads as a lid.
      box(2.0, 0.34, 1.4, crust, {
        rx: -0.55,
        y: 1.95,
        z: -0.55,
        hex2: 0xe3bd7e,
      }),
      // toasted underside of the lid (the cut crumb face shows)
      box(1.8, 0.14, 1.2, crumb, {
        rx: -0.55,
        y: 1.82,
        z: -0.38,
      }),
    ]);
  },
};

export default COL_BOBA;
