/**
 * @file packs/taitung/collectibles/makao_sausage.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_MAKAO_SAUSAGE — 馬告香腸 (Makao Pepper Sausage). A specialty sausage
 * flavored with makao (mountain pepper/litsea cubeba), an aromatic spice
 * used by Taiwan's indigenous peoples. The distinctive citrus-pepper flavor
 * makes it a popular local delicacy.
 */

import { cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_MAKAO_SAUSAGE = {
  id: 'col_makao_sausage',
  name: '馬告香腸',
  collectibleId: 7,
  colorHex: 0xb85a40,

  buildGeometry(rng) {
    const CASING = 0xb85a40; // sausage red-brown
    const CASING_LO = 0x984838;
    const MEAT = 0xc86a50;
    const PEPPER = 0x3a3a30; // makao pepper specks
    const STICK = 0xc8a060; // bamboo stick

    const parts = [];

    // Main sausage body (curved slightly)
    parts.push(cyl(0.2, 0.18, 1.6, 10, CASING, {
      rz: HALF_PI,
      y: 0,
      hex2: CASING_LO,
    }));

    // Tied ends
    parts.push(sph(0.16, CASING_LO, { ws: 6, hs: 4, x: 0.85, sx: 0.7 }));
    parts.push(sph(0.16, CASING_LO, { ws: 6, hs: 4, x: -0.85, sx: 0.7 }));

    // Grill marks
    for (let i = -2; i <= 2; i++) {
      parts.push(cyl(0.21, 0.21, 0.04, 10, 0x5a3020, {
        x: i * 0.28,
      }));
    }

    // Makao pepper specks visible on surface
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2;
      const px = -0.5 + (i % 4) * 0.35;
      parts.push(sph(0.025, PEPPER, {
        ws: 4, hs: 3,
        x: px,
        y: Math.cos(a) * 0.16,
        z: Math.sin(a) * 0.16,
      }));
    }

    // Bamboo skewer stick through it
    parts.push(cyl(0.025, 0.025, 2.2, 6, STICK, {
      rz: HALF_PI,
      y: 0,
    }));

    return finish(parts);
  },
};

export default COL_MAKAO_SAUSAGE;
