/**
 * @file packs/penghu/collectibles/peanut_candy.js — Roll Formosa Penghu pack.
 *
 * COL_PEANUT_CANDY — 花生酥 (Peanut Candy), Penghu's famous peanut brittle/candy.
 * Made from local peanuts grown in the sandy soil of the islands.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CANDY = 0xd8a860; // golden peanut candy
const CANDY_D = 0xb88840; // darker
const PEANUT = 0xc89850; // peanut pieces
const WRAPPER = 0xf4f0e8; // paper wrapper

export const COL_PEANUT_CANDY = {
  id: 'peanut_candy',
  name: '花生酥',
  collectibleId: 7,
  colorHex: CANDY,

  buildGeometry(rng) {
    const parts = [];

    // Paper wrapper base
    parts.push(box(1.2, 0.08, 0.9, WRAPPER, { y: 0.04 }));

    // Main candy block
    parts.push(box(1.0, 0.35, 0.7, CANDY, { y: 0.25, hex2: CANDY_D }));

    // Visible peanut pieces on top
    for (let i = 0; i < 8; i++) {
      const x = (rng() - 0.5) * 0.7;
      const z = (rng() - 0.5) * 0.5;
      parts.push(sph(0.08, PEANUT, {
        ws: 5, hs: 3,
        sx: 1.2, sy: 0.7,
        x,
        y: 0.42,
        z,
        ry: rng() * PI,
      }));
    }

    // Side texture (broken peanut pieces visible)
    for (let i = 0; i < 3; i++) {
      const y = 0.15 + i * 0.12;
      parts.push(box(0.06, 0.08, 0.35, PEANUT, { x: 0.48, y, z: (rng() - 0.5) * 0.3 }));
    }

    return finish(parts);
  },
};

export default COL_PEANUT_CANDY;
