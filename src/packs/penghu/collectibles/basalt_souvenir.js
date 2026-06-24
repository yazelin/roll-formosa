/**
 * @file packs/penghu/collectibles/basalt_souvenir.js — Roll Formosa Penghu pack.
 *
 * COL_BASALT — 玄武岩紀念品 (Basalt Souvenir), a small hexagonal basalt column
 * paperweight or decoration, representing Penghu's famous geological formations.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BASALT = 0x4a4e52; // dark basalt
const BASALT_D = 0x36393c; // darker
const BASALT_L = 0x5a5e64; // lighter top

export const COL_BASALT = {
  id: 'basalt_souvenir',
  name: '玄武岩紀念品',
  collectibleId: 10,
  colorHex: BASALT,

  buildGeometry(rng) {
    const parts = [];

    // Cluster of hexagonal columns of varying heights
    const columns = [
      { x: 0, z: 0, h: 1.2 },
      { x: 0.22, z: 0.12, h: 0.9 },
      { x: -0.2, z: 0.15, h: 1.0 },
      { x: 0.15, z: -0.18, h: 0.8 },
      { x: -0.18, z: -0.12, h: 1.1 },
    ];

    for (const c of columns) {
      const col = BASALT + Math.floor(rng() * 0x0a0a0a) - 0x050505;
      parts.push(cyl(0.15, 0.14, c.h, 6, col, {
        x: c.x,
        y: c.h / 2,
        z: c.z,
        hex2: BASALT_D,
      }));
      // Top cap
      parts.push(cyl(0.14, 0.13, 0.04, 6, BASALT_L, {
        x: c.x,
        y: c.h + 0.02,
        z: c.z,
      }));
    }

    return finish(parts);
  },
};

export default COL_BASALT;
