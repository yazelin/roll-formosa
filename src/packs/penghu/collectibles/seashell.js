/**
 * @file packs/penghu/collectibles/seashell.js — Roll Formosa Penghu pack.
 *
 * COL_SEASHELL — 貝殼 (Seashell), beautiful shells collected from Penghu's beaches.
 * The islands are surrounded by pristine waters with abundant marine life.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { sph, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SHELL = 0xf0e8d8; // pale shell
const SHELL_D = 0xd8c8b0; // darker
const PINK = 0xf0c0c0; // pink tint inside
const CORAL = 0xe0d0c0; // coral bits

export const COL_SEASHELL = {
  id: 'seashell_collection',
  name: '貝殼收藏',
  collectibleId: 11,
  colorHex: SHELL,

  buildGeometry(rng) {
    const parts = [];

    // Main large spiral shell (conch-like)
    parts.push(sph(0.5, SHELL, {
      ws: 10, hs: 6,
      sx: 1.3, sy: 0.8, sz: 0.9,
      y: 0.35,
      hex2: SHELL_D,
    }));
    // Spiral texture
    parts.push(cyl(0.08, 0.2, 0.25, 6, SHELL_D, {
      x: 0.35, y: 0.4, rz: 0.4,
    }));
    // Pink interior opening
    parts.push(sph(0.2, PINK, {
      ws: 6, hs: 4,
      x: -0.3, y: 0.3, z: 0.2,
    }));

    // Smaller shells scattered
    parts.push(sph(0.2, SHELL_D, {
      ws: 6, hs: 4,
      sx: 1.2, sy: 0.6,
      x: 0.4, y: 0.15, z: 0.25,
      ry: rng() * PI,
    }));
    parts.push(sph(0.15, CORAL, {
      ws: 5, hs: 3,
      x: -0.35, y: 0.12, z: -0.2,
    }));

    // Sand/coral base
    parts.push(sph(0.7, CORAL, {
      ws: 8, hs: 4,
      sy: 0.15,
      y: 0.05,
      hex2: SHELL_D,
    }));

    return finish(parts);
  },
};

export default COL_SEASHELL;
