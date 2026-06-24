/**
 * @file packs/yilan/collectibles/yilan_wine.js — Roll Formosa Yilan pack.
 *
 * 宜蘭酒 (Yilan Wine) — collectibleId 11. Local rice wine from Yilan,
 * in a traditional ceramic bottle.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const CERAMIC_BROWN = 0x8a6a50;  // ceramic bottle
const CERAMIC_DARK = 0x6a4a38;  // darker glaze
const LABEL_RED = 0xc03030;     // red label
const LABEL_GOLD = 0xd4a830;    // gold text/border
const CORK = 0xa08060;          // cork stopper

export const COL_YILAN_WINE = {
  id: 'col_yilan_wine',
  name: '宜蘭酒',
  collectibleId: 11,
  colorHex: 0x8a6a50, // ceramic brown — the read color

  buildGeometry(rng) {
    const parts = [];

    // Bottle body (traditional rounded shape)
    parts.push(
      cyl(0.30, 0.35, 0.5, 10, CERAMIC_BROWN, {
        y: 0.25,
        hex2: CERAMIC_DARK,
      })
    );

    // Bottle shoulder (narrowing)
    parts.push(
      cyl(0.18, 0.30, 0.15, 10, CERAMIC_BROWN, {
        y: 0.58,
      })
    );

    // Bottle neck
    parts.push(
      cyl(0.10, 0.18, 0.18, 8, CERAMIC_BROWN, {
        y: 0.75,
      })
    );

    // Bottle lip
    parts.push(
      cyl(0.12, 0.10, 0.06, 8, CERAMIC_DARK, {
        y: 0.87,
      })
    );

    // Cork stopper
    parts.push(
      cyl(0.08, 0.08, 0.08, 6, CORK, {
        y: 0.94,
      })
    );

    // Red label on front
    parts.push(
      box(0.22, 0.25, 0.02, LABEL_RED, {
        y: 0.32,
        z: 0.32,
      })
    );

    // Gold border on label
    parts.push(
      box(0.24, 0.02, 0.02, LABEL_GOLD, {
        y: 0.43,
        z: 0.33,
      })
    );
    parts.push(
      box(0.24, 0.02, 0.02, LABEL_GOLD, {
        y: 0.21,
        z: 0.33,
      })
    );

    // Base
    parts.push(
      cyl(0.36, 0.36, 0.04, 10, CERAMIC_DARK, {
        y: 0.02,
      })
    );

    return finish(parts);
  },
};

export default COL_YILAN_WINE;
