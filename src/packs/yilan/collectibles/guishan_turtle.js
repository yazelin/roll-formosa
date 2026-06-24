/**
 * @file packs/yilan/collectibles/guishan_turtle.js — Roll Formosa Yilan pack.
 *
 * 龜山島龜 (Guishan Turtle) — collectibleId 12. A souvenir turtle figurine
 * representing the iconic Guishan Island, shaped like a turtle.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { sph, cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const SHELL_GREEN = 0x4a6a4a;   // turtle shell green
const SHELL_DARK = 0x3a4a3a;   // darker shell pattern
const BODY = 0x6a7a5a;         // turtle body/legs
const HEAD = 0x7a8a6a;         // lighter head
const EYE = 0x202020;          // eyes
const STAND = 0x8a7a6a;        // wooden stand

export const COL_GUISHAN_TURTLE = {
  id: 'col_guishan_turtle',
  name: '龜山島龜',
  collectibleId: 12,
  colorHex: 0x4a6a4a, // turtle shell green — the read color

  buildGeometry(rng) {
    const parts = [];

    // Wooden display stand
    parts.push(
      cyl(0.45, 0.45, 0.06, 8, STAND, {
        y: 0.03,
      })
    );

    // Turtle shell (domed)
    parts.push(
      sph(0.35, SHELL_GREEN, {
        y: 0.28,
        sy: 0.6,
        sz: 1.1,
        ws: 8,
        hs: 5,
        hex2: SHELL_DARK,
      })
    );

    // Shell pattern ridges
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * PI - PI / 2;
      parts.push(
        box(0.28, 0.02, 0.04, SHELL_DARK, {
          y: 0.35,
          z: -0.05,
          ry: angle,
        })
      );
    }

    // Turtle body (underneath shell)
    parts.push(
      sph(0.32, BODY, {
        y: 0.16,
        sy: 0.35,
        sz: 1.05,
        ws: 7,
        hs: 4,
      })
    );

    // Head
    parts.push(
      sph(0.12, HEAD, {
        x: 0.0,
        y: 0.18,
        z: 0.40,
        sx: 0.8,
        ws: 6,
        hs: 4,
      })
    );

    // Eyes
    parts.push(
      sph(0.02, EYE, {
        x: -0.04,
        y: 0.20,
        z: 0.48,
        ws: 3,
        hs: 2,
      })
    );
    parts.push(
      sph(0.02, EYE, {
        x: 0.04,
        y: 0.20,
        z: 0.48,
        ws: 3,
        hs: 2,
      })
    );

    // Four legs
    const legPositions = [
      { x: -0.22, z: 0.18 },
      { x: 0.22, z: 0.18 },
      { x: -0.20, z: -0.22 },
      { x: 0.20, z: -0.22 },
    ];
    for (const pos of legPositions) {
      parts.push(
        sph(0.08, BODY, {
          x: pos.x,
          y: 0.10,
          z: pos.z,
          sx: 0.7,
          sy: 0.5,
          sz: 1.0,
          ws: 5,
          hs: 3,
        })
      );
    }

    // Tail
    parts.push(
      cone(0.04, 0.10, 4, BODY, {
        x: 0.0,
        y: 0.12,
        z: -0.38,
        rx: HALF_PI,
      })
    );

    return finish(parts);
  },
};

export default COL_GUISHAN_TURTLE;
