/**
 * @file packs/yilan/collectibles/sanxing_scallion.js — Roll Formosa Yilan pack.
 *
 * 三星蔥 (Sanxing Scallion) — collectibleId 0. The famous green onion from
 * Yilan's Sanxing Township, known for its tender white stalk and sweet flavor.
 * A bundle of fresh scallions with long green leaves and white roots.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const GREEN_LEAF = 0x4a8a3a;    // scallion green leaves
const GREEN_DARK = 0x3a6a2a;   // darker green
const WHITE_STALK = 0xf0f0e8;  // white stalk
const ROOT = 0xe8e0d0;         // root hairs

export const COL_SANXING_SCALLION = {
  id: 'col_sanxing_scallion',
  name: '三星蔥',
  collectibleId: 0,
  colorHex: 0x4a8a3a, // scallion green — the read color

  buildGeometry(rng) {
    const parts = [];

    // Bundle of 3 scallions
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * PI * 2;
      const xOff = Math.cos(angle) * 0.15;
      const zOff = Math.sin(angle) * 0.15;
      const tilt = (rng ? rng() - 0.5 : i * 0.1) * 0.15;

      // White stalk (bottom)
      parts.push(
        cyl(0.08, 0.10, 0.5, 6, WHITE_STALK, {
          x: xOff,
          y: 0.25,
          z: zOff,
          rz: tilt,
        })
      );

      // Green transition
      parts.push(
        cyl(0.08, 0.06, 0.3, 6, GREEN_LEAF, {
          x: xOff + tilt * 0.3,
          y: 0.65,
          z: zOff,
          rz: tilt,
          hex2: WHITE_STALK,
        })
      );

      // Long green leaf (top) - hollow cylinder
      parts.push(
        cyl(0.05, 0.02, 0.7, 6, i % 2 === 0 ? GREEN_LEAF : GREEN_DARK, {
          x: xOff + tilt * 0.8,
          y: 1.15,
          z: zOff,
          rz: tilt * 1.5,
        })
      );

      // Root hairs (bottom)
      parts.push(
        cyl(0.12, 0.04, 0.1, 5, ROOT, {
          x: xOff,
          y: -0.02,
          z: zOff,
        })
      );
    }

    // Red rubber band holding bundle
    parts.push(
      cyl(0.22, 0.22, 0.06, 8, 0xc02020, {
        y: 0.35,
      })
    );

    return finish(parts);
  },
};

export default COL_SANXING_SCALLION;
