/**
 * @file packs/yilan/collectibles/jimmy_rabbit.js — Roll Formosa Yilan pack.
 *
 * 幾米兔子 (Jimmy's Rabbit) — collectibleId 7. The iconic rabbit character
 * from Jimmy Liao's (幾米) picture books, seen at Yilan's Jimmy Plaza.
 * A whimsical rabbit figurine with oversized head.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const RABBIT_WHITE = 0xf8f0e8;  // rabbit white fur
const RABBIT_PINK = 0xf0a8a0;  // inner ear pink
const EYE = 0x202020;          // eyes
const NOSE = 0xd08080;         // pink nose
const DRESS = 0xe86060;        // red dress

export const COL_JIMMY_RABBIT = {
  id: 'col_jimmy_rabbit',
  name: '幾米兔子',
  collectibleId: 7,
  colorHex: 0xf8f0e8, // rabbit white — the read color

  buildGeometry(rng) {
    const parts = [];

    // Body with red dress
    parts.push(
      cyl(0.25, 0.30, 0.4, 8, DRESS, {
        y: 0.20,
        hex2: 0xc04040,
      })
    );

    // Upper body/shoulders
    parts.push(
      sph(0.22, RABBIT_WHITE, {
        y: 0.45,
        ws: 7,
        hs: 5,
      })
    );

    // Big round head (chibi proportions)
    parts.push(
      sph(0.35, RABBIT_WHITE, {
        y: 0.85,
        ws: 8,
        hs: 6,
      })
    );

    // Long ears
    parts.push(
      cyl(0.06, 0.04, 0.4, 6, RABBIT_WHITE, {
        x: -0.12,
        y: 1.30,
        z: 0.0,
        rx: -0.15,
      })
    );
    parts.push(
      cyl(0.06, 0.04, 0.4, 6, RABBIT_WHITE, {
        x: 0.12,
        y: 1.30,
        z: 0.0,
        rx: 0.15,
      })
    );

    // Inner ear pink
    parts.push(
      box(0.03, 0.25, 0.02, RABBIT_PINK, {
        x: -0.12,
        y: 1.30,
        z: 0.03,
      })
    );
    parts.push(
      box(0.03, 0.25, 0.02, RABBIT_PINK, {
        x: 0.12,
        y: 1.30,
        z: 0.03,
      })
    );

    // Eyes
    parts.push(
      sph(0.04, EYE, {
        x: -0.12,
        y: 0.90,
        z: 0.30,
        ws: 4,
        hs: 3,
      })
    );
    parts.push(
      sph(0.04, EYE, {
        x: 0.12,
        y: 0.90,
        z: 0.30,
        ws: 4,
        hs: 3,
      })
    );

    // Nose
    parts.push(
      sph(0.03, NOSE, {
        x: 0.0,
        y: 0.82,
        z: 0.32,
        ws: 4,
        hs: 3,
      })
    );

    // Arms
    parts.push(
      cyl(0.05, 0.04, 0.20, 5, RABBIT_WHITE, {
        x: -0.28,
        y: 0.38,
        z: 0.1,
        rz: 0.5,
      })
    );
    parts.push(
      cyl(0.05, 0.04, 0.20, 5, RABBIT_WHITE, {
        x: 0.28,
        y: 0.38,
        z: 0.1,
        rz: -0.5,
      })
    );

    // Feet
    parts.push(
      sph(0.10, RABBIT_WHITE, {
        x: -0.12,
        y: 0.02,
        z: 0.08,
        sy: 0.5,
        sz: 1.2,
        ws: 5,
        hs: 3,
      })
    );
    parts.push(
      sph(0.10, RABBIT_WHITE, {
        x: 0.12,
        y: 0.02,
        z: 0.08,
        sy: 0.5,
        sz: 1.2,
        ws: 5,
        hs: 3,
      })
    );

    return finish(parts);
  },
};

export default COL_JIMMY_RABBIT;
