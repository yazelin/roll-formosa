/**
 * @file packs/yilan/collectibles/duck_jerky.js — Roll Formosa Yilan pack.
 *
 * 鴨賞 (Duck Jerky) — collectibleId 2. Yilan's iconic smoked duck delicacy,
 * traditionally prepared with sugarcane smoke. Flat, reddish-brown dried
 * duck meat strips.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

const MEAT_RED = 0x8a3020;     // smoked duck meat color
const MEAT_DARK = 0x6a2018;   // darker marinated areas
const FAT_WHITE = 0xe8d8c8;   // duck fat layer
const PLATE = 0xf0e8e0;       // serving plate

export const COL_DUCK_JERKY = {
  id: 'col_duck_jerky',
  name: '鴨賞',
  collectibleId: 2,
  colorHex: 0x8a3020, // smoked meat red — the read color

  buildGeometry(rng) {
    const parts = [];

    // Serving plate
    parts.push(
      cyl(0.6, 0.65, 0.06, 10, PLATE, {
        y: 0.03,
      })
    );

    // Multiple duck jerky slices stacked/arranged
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * PI * 1.5 - PI * 0.25;
      const xOff = Math.cos(angle) * 0.2;
      const zOff = Math.sin(angle) * 0.2;
      const yOff = 0.08 + i * 0.03;

      // Main meat slice
      parts.push(
        box(0.35, 0.04, 0.15, i % 2 === 0 ? MEAT_RED : MEAT_DARK, {
          x: xOff,
          y: yOff,
          z: zOff,
          ry: angle,
          hex2: MEAT_DARK,
        })
      );

      // Thin fat layer on top of some slices
      if (i % 2 === 0) {
        parts.push(
          box(0.30, 0.015, 0.12, FAT_WHITE, {
            x: xOff,
            y: yOff + 0.025,
            z: zOff,
            ry: angle,
          })
        );
      }
    }

    return finish(parts);
  },
};

export default COL_DUCK_JERKY;
