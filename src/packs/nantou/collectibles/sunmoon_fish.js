/**
 * @file packs/nantou/collectibles/sunmoon_fish.js — Roll Formosa Nantou pack, COLLECTIBLE.
 *
 * COL_FISH — 日月潭奇力魚 (the little qili fish of Sun Moon Lake, the lake's
 * signature catch, often fried crisp). A small silvery fish, body slightly
 * arched, with a forked tail, a dorsal fin and a bright eye, resting on a folded
 * bamboo leaf. A small hand-held catch — long and low, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the scale sheen.
 */

import { cyl, sph, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_FISH = {
  id: 'sunmoon_fish',
  name: '日月潭奇力魚',
  collectibleId: 5,
  colorHex: 0xc7cdd2, // silvery fish

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202);
    const fish = 0xc7cdd2 + t; // silver
    const fishHi = 0xe2e7ea;
    const belly = 0xf2f4f5; // pale belly
    const fin = 0xa9b6c0; // grey fin
    const leaf = 0x6aa84a; // bamboo leaf
    const eye = 0x2a2320;

    const parts = [];
    // bamboo leaf under the fish (flat elongated sphere)
    parts.push(sph(1.05, leaf, { ws: 10, hs: 5, sy: 0.06, sz: 0.42, y: 0.12, hex2: 0x86c267 }));
    // fish body — capsule lying along X, slightly arched
    parts.push(cyl(0.34, 0.34, 1.2, 12, fish, { rz: HALF_PI, y: 0.4, sz: 0.7, hex2: fishHi }));
    parts.push(sph(0.34, fish, { ws: 11, hs: 7, x: 0.6, y: 0.4, sz: 0.7, hex2: fishHi })); // head
    parts.push(sph(0.26, fish, { ws: 9, hs: 6, x: -0.58, y: 0.4, sz: 0.7 })); // tail base
    parts.push(cyl(0.34, 0.32, 1.2, 9, belly, { rz: HALF_PI, y: 0.3, sz: 0.42 })); // pale belly
    // forked tail fin (two flat triangles)
    parts.push(box(0.42, 0.44, 0.03, fin, { x: -0.95, y: 0.52, rz: 0.5 }));
    parts.push(box(0.42, 0.44, 0.03, fin, { x: -0.95, y: 0.3, rz: -0.5 }));
    // dorsal fin
    parts.push(box(0.5, 0.3, 0.03, fin, { x: 0.0, y: 0.72, rz: 0.1 }));
    // eye
    parts.push(sph(0.07, eye, { ws: 5, hs: 4, x: 0.74, y: 0.5, z: 0.16 }));

    return finish(parts);
  },
};

export default COL_FISH;
