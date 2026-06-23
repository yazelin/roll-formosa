/**
 * @file packs/yilan/collectibles/brown_sugar_cake.js — Roll Formosa Yilan pack.
 *
 * 黑糖糕 (Brown Sugar Cake) — collectibleId 8. Traditional Yilan snack,
 * a soft, chewy cake made with brown sugar, with a distinctive dark color.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

const CAKE_BROWN = 0x4a3020;   // dark brown sugar color
const CAKE_LIGHT = 0x5a4030;   // lighter brown areas
const PAPER = 0xf0e8d8;        // paper wrapper

export const COL_BROWN_SUGAR_CAKE = {
  id: 'col_brown_sugar_cake',
  name: '黑糖糕',
  collectibleId: 8,
  colorHex: 0x4a3020, // dark brown sugar — the read color

  buildGeometry(rng) {
    const parts = [];

    // Paper wrapper/box
    parts.push(
      box(0.7, 0.08, 0.5, PAPER, {
        y: 0.04,
      })
    );

    // Multiple cake pieces arranged in box
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const x = -0.20 + col * 0.20;
        const z = -0.12 + row * 0.24;
        const yOffset = 0.12 + (rng ? rng() * 0.02 : 0);

        // Individual cake piece (rectangular)
        parts.push(
          box(0.16, 0.10, 0.18, row % 2 === col % 2 ? CAKE_BROWN : CAKE_LIGHT, {
            x: x,
            y: yOffset,
            z: z,
            hex2: CAKE_LIGHT,
          })
        );

        // Slight dome on top of each piece
        parts.push(
          sph(0.08, CAKE_BROWN, {
            x: x,
            y: yOffset + 0.06,
            z: z,
            sy: 0.4,
            ws: 5,
            hs: 3,
          })
        );
      }
    }

    // Paper edges folded up
    parts.push(box(0.72, 0.12, 0.02, PAPER, { y: 0.06, z: 0.26 }));
    parts.push(box(0.72, 0.12, 0.02, PAPER, { y: 0.06, z: -0.26 }));

    return finish(parts);
  },
};

export default COL_BROWN_SUGAR_CAKE;
