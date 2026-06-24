/**
 * @file packs/penghu/collectibles/santaizi.js — Roll Formosa Penghu pack, COLLECTIBLE.
 *
 * COL_WIND_LION — 風獅爺 (Wind Lion God). The iconic guardian statues found
 * throughout Penghu villages, traditionally placed to ward off evil spirits
 * and strong winds. Silhouette: a squat, powerful lion figure sitting upright
 * with an oversized head, bulging eyes, curly mane, open roaring mouth showing
 * teeth, and stubby legs. Often painted in bright colors — commonly blue,
 * green, yellow, or natural stone. The fierce face and compact body are the
 * unmistakable reads.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (huge head, compact body, fierce
 * face) carry the read — never absolute size. <= 350 triangles, so segment
 * counts are kept low. rng() only nudges the mane curl; never structure.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// ---- Wind Lion palette (traditional turquoise-blue coloring) ----------------
const BODY = 0x4a9090;       // turquoise-blue stone body
const BODY_HI = 0x68b0b0;    // lighter body highlight
const BODY_DK = 0x386868;    // darker body shadow
const MANE = 0xe8c860;       // golden-yellow curly mane
const MANE_DK = 0xc4a040;    // darker mane shadow
const FACE = 0x4a9090;       // face same as body
const EYE_WHITE = 0xf0f0f0;  // bulging white eyes
const EYE_PUPIL = 0x1a1a1a;  // dark pupils
const MOUTH = 0xc83030;      // red inside mouth
const TEETH = 0xf0e8d8;      // white teeth
const BASE = 0x8a7a6a;       // stone pedestal base

export const COL_WIND_LION = {
  id: 'wind_lion_col',
  name: '風獅爺',
  collectibleId: 6,
  colorHex: BODY,

  buildGeometry(rng) {
    const parts = [];

    // === STONE PEDESTAL BASE ================================================
    parts.push(box(1.4, 0.25, 1.0, BASE, { y: 0.12 }));

    // === SQUAT BODY (sitting lion pose) =====================================
    parts.push(sph(0.5, BODY, {
      ws: 5, hs: 3, sx: 1.0, sy: 0.9, sz: 0.85,
      y: 0.72, hex2: BODY_HI
    }));

    // === FRONT PAWS =========================================================
    parts.push(box(0.2, 0.35, 0.2, BODY, { x: 0.25, y: 0.42, z: 0.22 }));
    parts.push(box(0.2, 0.35, 0.2, BODY, { x: -0.25, y: 0.42, z: 0.22 }));

    // === OVERSIZED HEAD (dominant feature) ==================================
    parts.push(sph(0.52, FACE, {
      ws: 5, hs: 4, sy: 0.95,
      y: 1.32, hex2: BODY_HI
    }));

    // === CURLY MANE (golden, simplified) ====================================
    const MANE_COUNT = 5;
    for (let i = 0; i < MANE_COUNT; i++) {
      const angle = (i / MANE_COUNT) * PI * 2;
      parts.push(sph(0.18, MANE, {
        ws: 3, hs: 2,
        x: Math.cos(angle) * 0.35,
        y: 1.45,
        z: Math.sin(angle) * 0.3 - 0.1,
        hex2: MANE_DK
      }));
    }

    // === FIERCE FACE FEATURES ===============================================
    // Eyes (bulging)
    parts.push(sph(0.12, EYE_WHITE, { ws: 3, hs: 2, x: 0.22, y: 1.42, z: 0.38 }));
    parts.push(sph(0.12, EYE_WHITE, { ws: 3, hs: 2, x: -0.22, y: 1.42, z: 0.38 }));

    // Snout / nose
    parts.push(sph(0.18, FACE, {
      ws: 4, hs: 2, sz: 0.8, sy: 0.7,
      y: 1.22, z: 0.42, hex2: BODY_DK
    }));

    // Open roaring mouth
    parts.push(box(0.28, 0.12, 0.15, MOUTH, { y: 1.08, z: 0.45 }));
    // Teeth
    parts.push(box(0.22, 0.04, 0.06, TEETH, { y: 1.13, z: 0.5 }));

    // === TAIL (curled up on the back) =======================================
    parts.push(sph(0.12, MANE, { ws: 3, hs: 2, y: 1.0, z: -0.4, hex2: MANE_DK }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_SANTAIZI = COL_WIND_LION;

export default COL_WIND_LION;
