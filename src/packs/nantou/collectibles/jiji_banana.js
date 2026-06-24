/**
 * @file packs/nantou/collectibles/jiji_banana.js — Roll Formosa Nantou pack, COLLECTIBLE.
 *
 * COL_BANANA — 集集香蕉 (the bananas of 集集, Nantou's famous banana town on the
 * old branch railway). A small hand of bright-yellow bananas curving up from a
 * brown stem, with green-brown tips. A small hand-held bunch — squat and curved,
 * never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the ripeness tint.
 */

import { cyl, cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_BANANA = {
  id: 'jiji_banana',
  name: '集集香蕉',
  collectibleId: 7,
  colorHex: 0xe8c63a, // ripe banana yellow

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040401);
    const peel = 0xe8c63a + t; // banana yellow
    const peelHi = 0xf4dc6a;
    const peelDk = 0xc9a32c; // ridge shade
    const tip = 0x5e6e2c; // green-brown tip
    const stem = 0x7a5a32; // brown stem

    const parts = [];
    // brown stem/crown at the top where the hand joins
    parts.push(cyl(0.22, 0.16, 0.3, 8, stem, { y: 1.5, hex2: 0x8a6a3c }));
    // a hand of 5 curved bananas fanning down-and-out
    const N = 5;
    for (let i = 0; i < N; i++) {
      const a = (i / (N - 1) - 0.5) * 2.2; // fan spread
      const cx = Math.sin(a) * 0.5;
      const cz = Math.cos(a) * 0.18;
      // each banana = a tapered cylinder leaning out, with a dark tip cap
      parts.push(cyl(0.16, 0.12, 1.25, 8, peel, {
        x: cx, z: cz, y: 0.85, rz: a * 0.5, rx: -0.2, hex2: peelHi,
      }));
      // ridge shade stripe
      parts.push(cyl(0.04, 0.03, 1.2, 4, peelDk, { x: cx + 0.1, z: cz, y: 0.85, rz: a * 0.5, rx: -0.2 }));
      // green-brown tip at the bottom end
      parts.push(cone(0.12, 0.18, 6, tip, { x: cx + Math.sin(a * 0.5) * 0.5, z: cz, y: 0.28, rz: a * 0.5 }));
    }

    return finish(parts);
  },
};

export default COL_BANANA;
