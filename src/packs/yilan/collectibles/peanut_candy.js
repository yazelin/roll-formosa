/**
 * @file packs/yilan/collectibles/peanut_candy.js — Roll Formosa Yilan pack.
 *
 * 花生糖 (Peanut Candy) — collectibleId 9. Traditional peanut brittle candy,
 * a crispy sweet snack popular in Yilan's traditional shops.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

const CANDY_TAN = 0xd8b870;     // candy maltose color
const PEANUT = 0xb08050;       // peanut brown
const PEANUT_DARK = 0x906040; // darker peanut
const WRAPPER = 0xe0d0c0;      // paper wrapper

export const COL_PEANUT_CANDY = {
  id: 'col_peanut_candy',
  name: '花生糖',
  collectibleId: 9,
  colorHex: 0xd8b870, // candy tan — the read color

  buildGeometry(rng) {
    const parts = [];

    // Main candy slab
    parts.push(
      box(0.6, 0.12, 0.4, CANDY_TAN, {
        y: 0.08,
        hex2: 0xc8a860,
      })
    );

    // Visible peanuts embedded in candy
    const peanutCount = 12;
    for (let i = 0; i < peanutCount; i++) {
      const x = -0.22 + (rng ? rng() * 0.44 : (i % 4) * 0.15);
      const z = -0.12 + (rng ? rng() * 0.24 : Math.floor(i / 4) * 0.12);
      const color = i % 2 === 0 ? PEANUT : PEANUT_DARK;

      parts.push(
        sph(0.04, color, {
          x: x,
          y: 0.14,
          z: z,
          sx: 1.3,
          sy: 0.6,
          ws: 4,
          hs: 3,
        })
      );
    }

    // Cut edge showing peanut cross-sections
    parts.push(
      box(0.02, 0.10, 0.38, CANDY_TAN, {
        x: 0.31,
        y: 0.08,
        z: 0.0,
      })
    );

    // Some peanut halves visible on cut edge
    for (let i = 0; i < 4; i++) {
      parts.push(
        sph(0.025, PEANUT, {
          x: 0.31,
          y: 0.08 + (i - 1.5) * 0.02,
          z: -0.10 + i * 0.07,
          sx: 0.3,
          ws: 4,
          hs: 3,
        })
      );
    }

    // Paper under the candy
    parts.push(
      box(0.65, 0.02, 0.45, WRAPPER, {
        y: 0.01,
      })
    );

    return finish(parts);
  },
};

export default COL_PEANUT_CANDY;
