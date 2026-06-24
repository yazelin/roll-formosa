/**
 * @file packs/penghu/collectibles/pineapple_cake.js — Roll Formosa Penghu pack,
 * COLLECTIBLE (rare-album item the ball rolls up).
 *
 * COL_PEANUT_CANDY — 花生酥 (peanut candy / peanut brittle). A traditional Penghu
 * specialty: crispy layered peanut candy made with local peanuts and maltose.
 * Silhouette: a small rectangular block of layered golden-brown candy with
 * visible peanut chunks embedded throughout, often wrapped in a clear wrapper
 * or displayed as a bare candy block. The read: a golden-tan layered bar with
 * bumpy peanut texture.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a low wide bar with visible peanut bumps.
 *
 * Palette: golden-tan candy base, darker caramelized layers, peanut brown
 * chunks. rng() only nudges the peanut placement — never structure.
 * <= 350 triangles.
 */

import { box, cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// Palette: golden candy and peanut colors
const CANDY = 0xe8c478;      // golden maltose candy base
const CANDY_DK = 0xc9a050;   // darker caramelized layer
const CANDY_HI = 0xf2d898;   // lighter sugar crystallized top
const PEANUT = 0xb8864a;     // roasted peanut brown
const PEANUT_DK = 0x8a6232;  // darker peanut skin
const LAYER = 0xd4a860;      // visible layer line

export const COL_PEANUT_CANDY = {
  id: 'peanut_candy_col',
  name: '花生酥',
  collectibleId: 5,
  colorHex: CANDY, // golden candy — the body read color

  buildGeometry(rng) {
    // Candy bar dimensions
    const W = 1.8;
    const D = 1.0;
    const H = 0.65;

    const parts = [];

    // === MAIN CANDY BODY ====================================================
    parts.push(box(W, H, D, CANDY, { y: H / 2, hex2: CANDY_HI }));

    // === VISIBLE LAYERS (the flaky / layered texture) =======================
    parts.push(box(W - 0.1, 0.04, D + 0.02, LAYER, { y: 0.2 }));
    parts.push(box(W - 0.1, 0.04, D + 0.02, LAYER, { y: 0.45 }));

    // === PEANUT CHUNKS (visible throughout the candy) =======================
    // Scattered on top surface (reduced)
    const topPeanuts = [
      [-0.4, H + 0.05, 0.2],
      [0.3, H + 0.05, -0.15],
      [0.0, H + 0.05, 0.3],
      [0.5, H + 0.05, 0.0],
    ];
    for (const [px, py, pz] of topPeanuts) {
      parts.push(sph(0.1, PEANUT, {
        ws: 3, hs: 2, sx: 1.3, sy: 0.7,
        x: px, y: py, z: pz,
        hex2: PEANUT_DK
      }));
    }

    // Peanuts visible on the front face (reduced)
    const frontPeanuts = [
      [-0.3, 0.3, D / 2 + 0.04],
      [0.3, 0.4, D / 2 + 0.03],
    ];
    for (const [px, py, pz] of frontPeanuts) {
      parts.push(sph(0.08, PEANUT, {
        ws: 3, hs: 2, sx: 1.2, sz: 0.6,
        x: px, y: py, z: pz,
        hex2: PEANUT_DK
      }));
    }

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_PINEAPPLE = COL_PEANUT_CANDY;

export default COL_PEANUT_CANDY;
