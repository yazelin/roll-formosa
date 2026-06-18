/**
 * @file packs/taichung/collectibles/dongquan_sauce.js — Roll Formosa Taichung
 * pack, COLLECTIBLE.
 *
 * COL_DONGQUAN_SAUCE — 東泉辣椒醬 (Dongquan chili sauce), the Taichung-only
 * table condiment every local keeps within arm's reach. Silhouette: a straight
 * squeeze bottle of orange-red sauce, slim and upright, narrowing at the
 * shoulder into a short neck capped by the unmistakable tall WHITE pointed
 * spout cap, with a single white rectangular label slapped on the front of the
 * body. A small hand-held bottle — never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 350 triangles (collectible budget). rng() only nudges the
 * sauce tint, never structure.
 */

import { box, cyl, cone, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_DONGQUAN_SAUCE = {
  id: 'dongquan_sauce',
  name: '東泉辣椒醬',
  collectibleId: 8,
  colorHex: 0xd13b1e, // orange-red chili sauce

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040200); // tiny per-instance sauce tint nudge
    const sauce = 0xc83518 + t; // deep orange-red chili paste fill
    const sauceTop = 0xe05a2a; // lighter near the surface (light through sauce)
    const bottle = 0xe7613f; // red-tinted clear plastic body over the sauce
    const bottleTop = 0xef7a5a;
    const white = 0xf3efe6; // cap / label off-white

    return finish([
      // --- chili-sauce FILL — straight column filling the body. Drawn first
      //     so the tinted plastic wall reads as a translucent skin over it. --
      cyl(0.58, 0.58, 1.72, 12, sauce, { y: 0.92, hex2: sauceTop }),
      // sauce shoulder so the fill follows the body up into the neck
      cyl(0.34, 0.56, 0.3, 12, sauceTop, { y: 1.92 }),

      // --- BOTTLE body (open tube, red-tinted clear plastic over the sauce) -
      cyl(0.62, 0.62, 1.78, 12, bottle, { y: 0.92, open: true, hex2: bottleTop }),
      // bottle base disc (closes the bottom, slightly inset = punt foot)
      cyl(0.58, 0.5, 0.08, 10, 0xcf5232, { y: 0.07 }),
      // rounded shoulder taper from body up to the neck
      cyl(0.36, 0.62, 0.34, 12, bottleTop, { y: 1.92, open: true }),

      // --- NECK — short straight collar under the cap ---------------------
      cyl(0.32, 0.34, 0.2, 10, 0xef7a5a, { y: 2.18, hex2: 0xf48a6c }),

      // --- the iconic tall WHITE pointed spout CAP ------------------------
      // collar ring of the screw cap sitting on the neck
      cyl(0.36, 0.36, 0.18, 10, white, { y: 2.36, hex2: 0xfbf8f1 }),
      // tall pointed cone — the squeeze-tip everyone recognizes
      cone(0.34, 0.92, 10, white, { y: 2.91, hex2: 0xfdfbf5 }),
      // tiny dispensing tip nub at the very top
      cyl(0.07, 0.1, 0.12, 6, 0xe8e2d4, { y: 3.43 }),

      // --- white rectangular LABEL slapped on the front of the body -------
      // sits just proud of the body so it reads as a stuck-on paper label.
      box(0.86, 0.92, 0.04, white, { x: 0, y: 0.92, z: 0.6, hex2: 0xfcf9f2 }),
      // thin red banner stripe across the label (brand band)
      box(0.86, 0.16, 0.02, 0xcf3a1d, { x: 0, y: 1.12, z: 0.625 }),
    ]);
  },
};

export default COL_DONGQUAN_SAUCE;
