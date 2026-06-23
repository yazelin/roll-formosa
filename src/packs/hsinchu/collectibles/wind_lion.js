/**
 * @file packs/hsinchu/collectibles/wind_lion.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_WIND_LION — 風獅爺 (Wind Lion God). Traditional guardian statue found in
 * Hsinchu region, protecting against the famous Hsinchu winds. Silhouette: a
 * squat, fierce lion figure with bulging eyes, wide mouth, and curled mane,
 * the characteristic stone guardian pose.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { box, cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const STONE = 0xa09080;       // weathered stone gray-tan
const STONE_HI = 0xc0b0a0;    // stone highlight
const STONE_DARK = 0x706050;  // shadow areas
const EYE = 0x1a1a1a;         // dark eye
const MOUTH = 0x602020;       // red mouth interior

export const COL_WIND_LION = {
  id: 'wind_lion',
  name: '風獅爺',
  collectibleId: 5,
  colorHex: STONE,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x060604);
    const stone = STONE + t;
    const parts = [];

    // --- stone PEDESTAL base ---
    parts.push(box(0.9, 0.2, 0.7, STONE_DARK, { y: 0.1, hex2: stone }));

    // --- lion BODY (squat, barrel-shaped) ---
    parts.push(sph(0.5, stone, { ws: 7, hs: 5, sx: 0.9, sy: 0.8, sz: 1.0, y: 0.52, hex2: STONE_HI }));

    // --- front LEGS (two stubby cylinders) ---
    parts.push(cyl(0.12, 0.14, 0.32, 5, stone, { x: -0.25, y: 0.36, z: 0.32, hex2: STONE_HI }));
    parts.push(cyl(0.12, 0.14, 0.32, 5, stone, { x: 0.25, y: 0.36, z: 0.32, hex2: STONE_HI }));
    // paws
    parts.push(sph(0.14, stone, { ws: 4, hs: 3, x: -0.25, y: 0.22, z: 0.38, sy: 0.6 }));
    parts.push(sph(0.14, stone, { ws: 4, hs: 3, x: 0.25, y: 0.22, z: 0.38, sy: 0.6 }));

    // --- HEAD (large, blocky lion face) ---
    parts.push(sph(0.42, stone, { ws: 7, hs: 5, sx: 1.1, sy: 1.0, sz: 0.9, y: 1.0, z: 0.15, hex2: STONE_HI }));

    // --- bulging EYES ---
    parts.push(sph(0.12, 0xf0f0e8, { ws: 5, hs: 3, x: -0.2, y: 1.12, z: 0.38 }));
    parts.push(sph(0.12, 0xf0f0e8, { ws: 5, hs: 3, x: 0.2, y: 1.12, z: 0.38 }));
    // pupils
    parts.push(sph(0.06, EYE, { ws: 3, hs: 2, x: -0.2, y: 1.12, z: 0.46 }));
    parts.push(sph(0.06, EYE, { ws: 3, hs: 2, x: 0.2, y: 1.12, z: 0.46 }));

    // --- wide MOUTH (open, fierce) ---
    parts.push(box(0.32, 0.1, 0.14, MOUTH, { y: 0.88, z: 0.42 }));
    // upper and lower jaw/lips
    parts.push(sph(0.18, stone, { ws: 5, hs: 3, sy: 0.5, y: 0.96, z: 0.44, hex2: STONE_HI }));
    parts.push(sph(0.16, stone, { ws: 5, hs: 3, sy: 0.4, y: 0.82, z: 0.44, hex2: STONE_HI }));

    // --- curled MANE (stylized stone curls around head) ---
    parts.push(sph(0.14, stone, { ws: 4, hs: 3, x: -0.38, y: 1.18, z: -0.1 }));
    parts.push(sph(0.14, stone, { ws: 4, hs: 3, x: 0.38, y: 1.18, z: -0.1 }));
    parts.push(sph(0.12, stone, { ws: 4, hs: 3, x: -0.32, y: 1.32, z: 0.05 }));
    parts.push(sph(0.12, stone, { ws: 4, hs: 3, x: 0.32, y: 1.32, z: 0.05 }));
    parts.push(sph(0.13, stone, { ws: 4, hs: 3, y: 1.38, z: -0.08 }));

    // --- NOSE ---
    parts.push(sph(0.1, STONE_DARK, { ws: 4, hs: 3, y: 1.02, z: 0.48 }));

    return finish(parts);
  },
};

export default COL_WIND_LION;
