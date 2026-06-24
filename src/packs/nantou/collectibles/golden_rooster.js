/**
 * @file packs/nantou/collectibles/golden_rooster.js — Roll Formosa Nantou pack, COLLECTIBLE.
 *
 * COL_ROOSTER — 紫南宮金雞 (the golden "money rooster" 金雞母 of 竹山紫南宮, where
 * pilgrims borrow lucky seed-money). A plump gilded rooster: round body, raised
 * head with a red comb and wattle, a small gold beak, and a fan of upturned
 * tail feathers, on stubby legs. A small hand-held figurine — round, tail up.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the gild tint.
 */

import { cyl, cone, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_ROOSTER = {
  id: 'golden_rooster',
  name: '紫南宮金雞',
  collectibleId: 4,
  colorHex: 0xe0b54e, // gilded gold

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const gold = 0xe0b54e + t; // gild
    const goldHi = 0xf2cf73;
    const goldDk = 0xc1973a;
    const comb = 0xc8362b; // red comb/wattle
    const beak = 0xd98a2e; // orange beak
    const eye = 0x2a2320;

    const parts = [];
    // plump body (egg) tilted up at the front
    parts.push(sph(0.7, gold, { ws: 11, hs: 7, sy: 1.05, sz: 1.2, y: 0.78, hex2: goldHi }));
    // raised head
    parts.push(sph(0.34, gold, { ws: 9, hs: 6, x: 0.0, z: 0.6, y: 1.35, hex2: goldHi }));
    // neck join
    parts.push(cyl(0.22, 0.3, 0.4, 9, gold, { z: 0.42, y: 1.05, rx: -0.5, hex2: goldDk }));
    // red comb (a row of bumps) + wattle
    parts.push(sph(0.1, comb, { ws: 6, hs: 4, z: 0.58, y: 1.62 }));
    parts.push(sph(0.09, comb, { ws: 6, hs: 4, z: 0.7, y: 1.58 }));
    parts.push(sph(0.08, comb, { ws: 5, hs: 4, z: 0.62, y: 1.18 })); // wattle
    // beak
    parts.push(cone(0.1, 0.24, 6, beak, { z: 0.92, y: 1.32, rx: 1.5708 }));
    // eyes
    parts.push(sph(0.05, eye, { ws: 4, hs: 3, x: 0.16, z: 0.78, y: 1.42 }));
    parts.push(sph(0.05, eye, { ws: 4, hs: 3, x: -0.16, z: 0.78, y: 1.42 }));
    // fan of upturned tail feathers (a few gold cones)
    for (let i = -1; i <= 1; i++) {
      parts.push(cone(0.13, 0.8, 6, gold, { x: i * 0.18, z: -0.66, y: 1.1, rx: 0.9, rz: i * 0.2, hex2: goldDk }));
    }
    // stubby legs
    parts.push(cyl(0.06, 0.06, 0.34, 6, goldDk, { x: 0.18, z: 0.1, y: 0.24 }));
    parts.push(cyl(0.06, 0.06, 0.34, 6, goldDk, { x: -0.18, z: 0.1, y: 0.24 }));

    return finish(parts);
  },
};

export default COL_ROOSTER;
