/**
 * @file packs/keelung/collectibles/crab.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_CRAB — 基隆海蟹 (the seasonal crab of Keelung's harbour, the port city's
 * signature seafood). A steamed orange-red crab: a wide low domed carapace, two
 * big front claws raised, and a row of walking legs splayed out to the sides. A
 * small hand-held catch — wide and low, claws up.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the shell tint.
 */

import { cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_CRAB = {
  id: 'crab',
  name: '基隆海蟹',
  collectibleId: 7,
  colorHex: 0xe2683a, // steamed orange-red

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const shell = 0xe2683a + t; // orange-red
    const shellHi = 0xf0855a;
    const shellDk = 0xc4542c;
    const eye = 0x2a2320;

    const parts = [];
    // carapace — wide low dome
    parts.push(sph(0.95, shell, { ws: 11, hs: 6, sy: 0.5, sz: 0.85, y: 0.55, hex2: shellHi }));
    // underside plate
    parts.push(cyl(0.78, 0.86, 0.12, 12, shellDk, { sz: 0.85, y: 0.3 }));
    // two eyes on short stalks at the front
    parts.push(cyl(0.05, 0.05, 0.16, 5, shell, { x: 0.2, z: 0.7, y: 0.66 }));
    parts.push(cyl(0.05, 0.05, 0.16, 5, shell, { x: -0.2, z: 0.7, y: 0.66 }));
    parts.push(sph(0.08, eye, { ws: 5, hs: 4, x: 0.2, z: 0.74, y: 0.76 }));
    parts.push(sph(0.08, eye, { ws: 5, hs: 4, x: -0.2, z: 0.74, y: 0.76 }));
    // two big front CLAWS raised (upper arm + pincer)
    for (const sgn of [1, -1]) {
      parts.push(cyl(0.1, 0.12, 0.5, 5, shell, { x: sgn * 0.9, z: 0.5, y: 0.5, rz: sgn * 0.7, hex2: shellHi }));
      parts.push(sph(0.26, shell, { ws: 7, hs: 5, sy: 0.7, x: sgn * 1.15, z: 0.74, y: 0.74, hex2: shellHi })); // pincer
      parts.push(sph(0.14, shellDk, { ws: 5, hs: 4, x: sgn * 1.28, z: 0.86, y: 0.84 })); // claw tip
    }
    // walking legs splayed to the sides (3 per side)
    for (const sgn of [1, -1]) {
      for (let i = 0; i < 3; i++) {
        parts.push(cyl(0.05, 0.03, 0.66, 4, shell, {
          x: sgn * 0.85, z: -0.1 - i * 0.34, y: 0.42, rz: sgn * HALF_PI * 0.8, hex2: shellDk,
        }));
      }
    }

    return finish(parts);
  },
};

export default COL_CRAB;
