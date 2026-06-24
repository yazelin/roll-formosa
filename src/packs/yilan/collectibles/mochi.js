/**
 * @file packs/yilan/collectibles/mochi.js — Roll Formosa Yilan pack.
 *
 * 宜蘭麻糬 (Yilan Mochi) — collectibleId 10. Soft, chewy mochi rice cakes,
 * a traditional treat in Yilan, often filled with peanut or red bean.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { sph, cyl, box, finish, PI } from '../geomHelpers.js';

const MOCHI_WHITE = 0xf8f4f0;   // white mochi skin
const MOCHI_PINK = 0xf0c0c0;   // pink mochi
const MOCHI_GREEN = 0xb8d8a8;  // green tea mochi
const PEANUT_FILL = 0xc8a060;  // peanut powder
const PLATE = 0xe8e0d8;        // serving plate

export const COL_MOCHI = {
  id: 'col_mochi',
  name: '宜蘭麻糬',
  collectibleId: 10,
  colorHex: 0xf8f4f0, // mochi white — the read color

  buildGeometry(rng) {
    const parts = [];

    // Serving plate
    parts.push(
      cyl(0.5, 0.55, 0.05, 10, PLATE, {
        y: 0.025,
      })
    );

    // Peanut powder bed
    parts.push(
      cyl(0.42, 0.42, 0.03, 10, PEANUT_FILL, {
        y: 0.065,
      })
    );

    // Mochi pieces - various colors and positions
    const mochiPieces = [
      { x: 0.0, z: 0.0, color: MOCHI_WHITE },
      { x: 0.18, z: 0.12, color: MOCHI_PINK },
      { x: -0.16, z: 0.14, color: MOCHI_GREEN },
      { x: 0.14, z: -0.14, color: MOCHI_WHITE },
      { x: -0.12, z: -0.10, color: MOCHI_PINK },
    ];

    for (let i = 0; i < mochiPieces.length; i++) {
      const m = mochiPieces[i];
      const yJitter = rng ? rng() * 0.02 : 0;

      // Soft rounded mochi shape
      parts.push(
        sph(0.12, m.color, {
          x: m.x,
          y: 0.14 + yJitter,
          z: m.z,
          sy: 0.7,
          ws: 6,
          hs: 4,
        })
      );
    }

    // Some peanut powder sprinkled on top
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * PI * 2;
      const dist = 0.08 + (rng ? rng() * 0.15 : 0.1);
      parts.push(
        sph(0.02, PEANUT_FILL, {
          x: Math.cos(angle) * dist,
          y: 0.18,
          z: Math.sin(angle) * dist,
          ws: 3,
          hs: 2,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_MOCHI;
