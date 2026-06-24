/**
 * @file packs/penghu/collectibles/windlion.js — Roll Formosa Penghu pack.
 *
 * COL_WINDLION — 風獅爺 (Wind Lion Lord), the iconic guardian deity statues
 * found throughout Penghu (and Kinmen). They protect villages from strong
 * northeast monsoon winds.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const STONE = 0xb8a890; // stone/ceramic color
const STONE_D = 0x988870; // darker
const MANE = 0xc8b8a0; // lion mane
const EYES = 0x2a2824; // dark eyes

export const COL_WINDLION = {
  id: 'windlion',
  name: '風獅爺',
  collectibleId: 5,
  colorHex: STONE,

  buildGeometry(rng) {
    const parts = [];

    // Base pedestal
    parts.push(box(0.7, 0.2, 0.5, STONE_D, { y: 0.1 }));

    // Body (seated lion)
    parts.push(box(0.5, 0.6, 0.4, STONE, { y: 0.5, hex2: STONE_D }));

    // Head (larger, blocky lion face)
    parts.push(box(0.55, 0.5, 0.45, STONE, { y: 1.0, hex2: MANE }));

    // Mane curls
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 0.12;
      parts.push(sph(0.08, MANE, { ws: 5, hs: 3, x, y: 1.25, z: 0.2 }));
    }

    // Eyes
    parts.push(sph(0.06, EYES, { ws: 4, hs: 3, x: -0.12, y: 1.05, z: 0.24 }));
    parts.push(sph(0.06, EYES, { ws: 4, hs: 3, x: 0.12, y: 1.05, z: 0.24 }));

    // Nose/snout
    parts.push(box(0.15, 0.12, 0.12, STONE_D, { y: 0.92, z: 0.26 }));

    // Front paws
    parts.push(box(0.15, 0.2, 0.15, STONE, { x: -0.2, y: 0.25, z: 0.2 }));
    parts.push(box(0.15, 0.2, 0.15, STONE, { x: 0.2, y: 0.25, z: 0.2 }));

    return finish(parts);
  },
};

export default COL_WINDLION;
