/**
 * @file packs/hsinchu/collectibles/wind_persimmon.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_PERSIMMON — 柿餅 (Dried Persimmon). Traditional wind-dried persimmon cake
 * from Hsinchu's Xinpu area, a famous autumn specialty. Silhouette: flattened
 * round persimmon with wrinkled surface, the characteristic orange-amber color
 * with natural white sugar bloom on the surface.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const PERSIMMON = 0xd4712a;     // deep orange-amber
const PERSIMMON_HI = 0xe88b40;  // brighter highlight
const BLOOM = 0xf5efe8;         // white sugar bloom
const STEM = 0x5a4030;          // dark brown stem/calyx

export const COL_PERSIMMON = {
  id: 'wind_persimmon',
  name: '柿餅',
  collectibleId: 2,
  colorHex: PERSIMMON,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x080402);
    const persimmon = PERSIMMON + t;

    return finish([
      // --- main flattened PERSIMMON body ---
      sph(0.8, persimmon, { ws: 10, hs: 6, sy: 0.5, y: 0, hex2: PERSIMMON_HI }),

      // --- wrinkled surface texture (radial ridges) ---
      sph(0.12, persimmon, { ws: 4, hs: 3, x: 0.4, y: 0.08, z: 0.3, hex2: PERSIMMON_HI }),
      sph(0.1, persimmon, { ws: 4, hs: 3, x: -0.35, y: 0.1, z: 0.35, hex2: PERSIMMON_HI }),
      sph(0.11, persimmon, { ws: 4, hs: 3, x: 0.38, y: 0.06, z: -0.32, hex2: PERSIMMON_HI }),
      sph(0.1, persimmon, { ws: 4, hs: 3, x: -0.42, y: 0.08, z: -0.28, hex2: PERSIMMON_HI }),

      // --- natural white sugar BLOOM patches ---
      sph(0.18, BLOOM, { ws: 4, hs: 3, sy: 0.3, x: 0.2, y: 0.22, z: 0.15 }),
      sph(0.14, BLOOM, { ws: 4, hs: 3, sy: 0.25, x: -0.25, y: 0.2, z: -0.18 }),
      sph(0.12, BLOOM, { ws: 4, hs: 3, sy: 0.25, x: 0.1, y: 0.18, z: -0.3 }),

      // --- dried CALYX (star-shaped stem remnant on top) ---
      cyl(0.12, 0.08, 0.1, 5, STEM, { y: 0.28 }),
      // calyx leaves (4 dried sepals)
      cyl(0.04, 0.08, 0.18, 4, 0x6a5040, { x: 0.12, y: 0.32, rz: 0.4, hex2: 0x8a7060 }),
      cyl(0.04, 0.08, 0.16, 4, 0x6a5040, { x: -0.11, y: 0.31, rz: -0.35, hex2: 0x8a7060 }),
      cyl(0.04, 0.08, 0.15, 4, 0x6a5040, { z: 0.1, y: 0.30, rx: -0.38, hex2: 0x8a7060 }),
      cyl(0.04, 0.08, 0.17, 4, 0x6a5040, { z: -0.11, y: 0.33, rx: 0.42, hex2: 0x8a7060 }),

      // --- bottom indentation (characteristic of dried persimmon) ---
      sph(0.25, 0xc06020, { ws: 5, hs: 3, thetaLen: PI * 0.5, sy: 0.4, y: -0.18, hex2: persimmon }),
    ]);
  },
};

export default COL_PERSIMMON;
