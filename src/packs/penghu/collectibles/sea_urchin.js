/**
 * @file packs/penghu/collectibles/sea_urchin.js — Roll Formosa Penghu pack.
 *
 * COL_SEA_URCHIN — 海膽 (Sea Urchin), Penghu's prized seafood delicacy.
 * Fresh sea urchin is a seasonal specialty of the islands.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { sph, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SHELL = 0x4a2838; // purple-black shell
const SHELL_D = 0x321828; // darker
const SPINE = 0x2a1820; // spines
const ROE = 0xf0b050; // orange roe (uni)

export const COL_SEA_URCHIN = {
  id: 'sea_urchin',
  name: '海膽',
  collectibleId: 4,
  colorHex: SHELL,

  buildGeometry(rng) {
    const parts = [];

    // Main shell body
    parts.push(sph(0.6, SHELL, { ws: 8, hs: 5, sy: 0.7, y: 0.4, hex2: SHELL_D }));

    // Simplified spines (8 instead of 16)
    const nSpines = 8;
    for (let i = 0; i < nSpines; i++) {
      const a = (i / nSpines) * PI * 2;
      const rx = Math.cos(a) * 0.5;
      const rz = Math.sin(a) * 0.5;
      parts.push(cyl(0.03, 0.02, 0.5, 4, SPINE, {
        x: rx,
        y: 0.4,
        z: rz,
        rx: Math.sin(a) * 0.3,
        rz: -Math.cos(a) * 0.3,
      }));
    }

    // Visible roe at top opening
    parts.push(sph(0.25, ROE, { ws: 5, hs: 3, y: 0.55, hex2: 0xd89030 }));

    return finish(parts);
  },
};

export default COL_SEA_URCHIN;
