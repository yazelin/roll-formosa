/**
 * @file packs/changhua/collectibles/lugang_incense.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_LUGANG_INCENSE — 鹿港線香 (Lukang incense), famous traditional incense
 * made in Lukang for over 200 years. Silhouette: a bundle of thin red incense
 * sticks tied together, with some sticks lit showing smoke trails. Used in
 * temples throughout Taiwan. The red-tipped sticks in a bundle are distinctive.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const STICK = 0xc84028;       // red incense stick
const STICK_D = 0xa83020;     // darker red
const ASH = 0x606060;         // burnt ash
const EMBER = 0xff6020;       // glowing ember
const TIE = 0xd8a850;         // yellow tie string
const SMOKE = 0xd0d0d0;       // smoke wisp

export const COL_LUGANG_INCENSE = {
  id: 'lugang_incense',
  name: '鹿港線香',
  collectibleId: 12,
  colorHex: STICK,

  buildGeometry(rng) {
    const parts = [];

    // Bundle of incense sticks (reduced to 6)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * PI * 2;
      const r = 0.12;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Main stick body
      parts.push(cyl(0.025, 0.025, 1.4, 3, STICK, {
        x, z, y: 0.7, hex2: STICK_D,
      }));
    }

    // Center stick (longer)
    parts.push(cyl(0.03, 0.03, 1.55, 3, STICK, { y: 0.775 }));
    // Ember on center stick
    parts.push(sph(0.04, EMBER, { ws: 4, hs: 3, y: 1.58 }));

    // Tie string (single)
    parts.push(cyl(0.20, 0.20, 0.05, 6, TIE, { y: 0.35, open: true }));

    // Smoke wisp
    parts.push(sph(0.05, SMOKE, { ws: 4, hs: 3, y: 1.75, sy: 2.5 }));

    return finish(parts);
  },
};

export default COL_LUGANG_INCENSE;
