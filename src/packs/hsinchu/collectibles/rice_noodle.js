/**
 * @file packs/hsinchu/collectibles/rice_noodle.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_RICE_NOODLE — 新竹米粉 (Hsinchu Rice Noodles). Hsinchu is famous for its
 * wind-dried rice noodles, a local specialty for over 300 years. Silhouette:
 * a bundle of thin white rice noodles tied together, with the characteristic
 * translucent white color.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const NOODLE = 0xf8f4e8;    // translucent white rice noodle
const NOODLE_HI = 0xffffff; // bright highlight
const TIE = 0xc45c3a;       // red tie/band

export const COL_RICE_NOODLE = {
  id: 'hsinchu_rice_noodle',
  name: '新竹米粉',
  collectibleId: 1,
  colorHex: NOODLE,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202);
    const noodle = NOODLE - t;
    const parts = [];

    // --- bundled NOODLE strands (vertical bundle) ---
    // Center strands
    parts.push(cyl(0.08, 0.08, 2.2, 5, noodle, { y: 0, hex2: NOODLE_HI }));
    parts.push(cyl(0.07, 0.07, 2.1, 5, noodle, { x: 0.14, y: 0.02, hex2: NOODLE_HI }));
    parts.push(cyl(0.07, 0.07, 2.15, 5, noodle, { x: -0.13, y: -0.01, hex2: NOODLE_HI }));
    parts.push(cyl(0.06, 0.06, 2.0, 5, noodle, { x: 0.08, z: 0.12, y: 0.03, hex2: NOODLE_HI }));
    parts.push(cyl(0.06, 0.06, 2.05, 5, noodle, { x: -0.06, z: -0.11, y: -0.02, hex2: NOODLE_HI }));
    // Outer ring strands
    parts.push(cyl(0.05, 0.05, 1.9, 4, noodle, { x: 0.22, z: 0.06, y: 0.04, hex2: NOODLE_HI }));
    parts.push(cyl(0.05, 0.05, 1.85, 4, noodle, { x: -0.2, z: 0.08, y: 0.02, hex2: NOODLE_HI }));
    parts.push(cyl(0.05, 0.05, 1.88, 4, noodle, { x: 0.04, z: 0.2, y: -0.03, hex2: NOODLE_HI }));
    parts.push(cyl(0.05, 0.05, 1.92, 4, noodle, { x: 0.02, z: -0.18, y: 0.01, hex2: NOODLE_HI }));
    parts.push(cyl(0.04, 0.04, 1.8, 4, noodle, { x: -0.18, z: -0.14, y: 0, hex2: NOODLE_HI }));
    parts.push(cyl(0.04, 0.04, 1.82, 4, noodle, { x: 0.16, z: -0.12, y: 0.02, hex2: NOODLE_HI }));

    // --- red TIE band around the middle ---
    parts.push(cyl(0.34, 0.34, 0.12, 8, TIE, { y: 0, open: true }));
    // tie knot
    parts.push(sph(0.08, TIE, { ws: 4, hs: 3, x: 0.28, y: 0, z: 0.12 }));

    // --- slightly splayed ends at top and bottom ---
    parts.push(sph(0.26, noodle, { ws: 5, hs: 3, sy: 0.3, y: 1.1, hex2: NOODLE_HI }));
    parts.push(sph(0.24, noodle, { ws: 5, hs: 3, sy: 0.3, y: -1.08, hex2: NOODLE_HI }));

    return finish(parts);
  },
};

export default COL_RICE_NOODLE;
