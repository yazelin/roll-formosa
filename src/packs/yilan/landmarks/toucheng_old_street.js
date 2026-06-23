/**
 * @file packs/yilan/landmarks/toucheng_old_street.js — Roll Formosa Yilan pack.
 *
 * 頭城老街 (Toucheng Old Street). Yilan's oldest street with preserved
 * Qing-dynasty architecture, traditional shophouses with baroque facades,
 * and historic merchant buildings dating back to the Lanyang Plain's
 * earliest settlement era.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const BRICK_RED = 0x8a4a3a;   // red brick walls
const BRICK_DARK = 0x6a3a2a; // darker brick
const ROOF_TILE = 0x4a3020;  // traditional roof tiles
const WOOD_FRAME = 0x5a4030; // wooden frames
const STONE = 0x909080;       // stone foundation
const SIGN_RED = 0xc02020;    // traditional red signs
const LANTERN = 0xe03030;     // red lanterns

export const NM_TOUCHENG_OLD_STREET = {
  id: 'toucheng_old_street',
  name: '頭城老街',
  landmarkId: 2,  // Yilan landmark #2 — dioramaRHint 28
  dioramaRHint: 28,
  colorHex: 0x8a4a3a, // red brick — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Stone street surface -------------------------------
    parts.push(box(1.4, 0.04, 0.5, STONE, { y: 0.02 }));

    // ---- 2) Historic shophouse row (left side) -----------------
    for (let i = 0; i < 3; i++) {
      const xOff = -0.5 + i * 0.4;
      const height = 0.35 + (rng ? rng() * 0.1 : i * 0.03);
      // Main building
      parts.push(
        box(0.32, height, 0.3, i % 2 === 0 ? BRICK_RED : BRICK_DARK, {
          x: xOff,
          y: height / 2 + 0.04,
          z: -0.35,
        })
      );
      // Baroque facade top
      parts.push(
        box(0.36, 0.08, 0.05, BRICK_RED, {
          x: xOff,
          y: height + 0.08,
          z: -0.22,
          hex2: BRICK_DARK,
        })
      );
      // Roof
      parts.push(
        box(0.34, 0.04, 0.32, ROOF_TILE, {
          x: xOff,
          y: height + 0.06,
          z: -0.35,
          rx: 0.1,
        })
      );
    }

    // ---- 3) Historic shophouse row (right side) ----------------
    for (let i = 0; i < 3; i++) {
      const xOff = -0.5 + i * 0.4;
      const height = 0.32 + (rng ? rng() * 0.1 : i * 0.02);
      parts.push(
        box(0.32, height, 0.28, i % 2 === 0 ? BRICK_DARK : BRICK_RED, {
          x: xOff,
          y: height / 2 + 0.04,
          z: 0.35,
        })
      );
      // Simple roof
      parts.push(
        box(0.34, 0.04, 0.30, ROOF_TILE, {
          x: xOff,
          y: height + 0.06,
          z: 0.35,
          rx: -0.1,
        })
      );
    }

    // ---- 4) Traditional wooden signboards ----------------------
    parts.push(box(0.08, 0.12, 0.02, SIGN_RED, { x: -0.5, y: 0.35, z: -0.19 }));
    parts.push(box(0.08, 0.12, 0.02, SIGN_RED, { x: 0.3, y: 0.38, z: -0.19 }));

    // ---- 5) Red lanterns hanging -------------------------------
    parts.push(sph(0.04, LANTERN, { x: -0.1, y: 0.42, z: -0.20 }));
    parts.push(sph(0.04, LANTERN, { x: 0.1, y: 0.42, z: 0.20 }));

    // ---- 6) Arcade pillars (騎樓) ------------------------------
    for (let i = 0; i < 3; i++) {
      parts.push(
        cyl(0.025, 0.025, 0.25, 6, WOOD_FRAME, {
          x: -0.5 + i * 0.4,
          y: 0.17,
          z: -0.18,
        })
      );
    }

    return finish(parts);
  },
};

export default NM_TOUCHENG_OLD_STREET;
