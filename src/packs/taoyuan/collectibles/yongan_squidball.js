/**
 * @file packs/taoyuan/collectibles/yongan_squidball.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_SQUIDBALL — 永安花枝丸 (fried cuttlefish balls from 永安漁港, Taoyuan's only
 * fishing harbour). Silhouette: three golden deep-fried cuttlefish balls speared
 * on a bamboo skewer with a squeeze of sauce on top. A small hand-held snack —
 * a short skewer of balls, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the fry tint.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_SQUIDBALL = {
  id: 'yongan_squidball',
  name: '永安花枝丸',
  collectibleId: 2,
  colorHex: 0xd9a64e, // fried golden

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040301);
    const fry = 0xd9a64e + t; // golden fried
    const fryHi = 0xeac06f;
    const fryDk = 0xb9863a;
    const bamboo = 0xdac88a; // skewer
    const sauce = 0xb5402e; // red sauce drizzle

    const parts = [];
    // bamboo skewer (vertical, poking out the top)
    parts.push(cyl(0.06, 0.05, 2.4, 6, bamboo, { y: 0.9, hex2: 0xc7b271 }));
    parts.push(cyl(0.05, 0.0, 0.18, 5, 0xe8dcab, { y: 2.18 })); // whittled tip
    // three fried balls stacked on the skewer (slightly lumpy = fried read)
    parts.push(sph(0.56, fry, { ws: 10, hs: 7, y: 0.5, hex2: fryHi }));
    parts.push(sph(0.54, fry, { ws: 10, hs: 7, y: 1.18, hex2: fryDk }));
    parts.push(sph(0.5, fry, { ws: 9, hs: 6, y: 1.8, hex2: fryHi }));
    // a few fry bumps for craggy texture
    parts.push(sph(0.16, fryHi, { ws: 5, hs: 4, x: 0.34, z: 0.16, y: 0.56 }));
    parts.push(sph(0.14, fryHi, { ws: 5, hs: 4, x: -0.3, z: 0.1, y: 1.22 }));
    parts.push(sph(0.13, fryDk, { ws: 5, hs: 4, x: 0.22, z: -0.24, y: 1.82 }));
    // red sauce drizzle over the top ball
    parts.push(sph(0.3, sauce, { ws: 8, hs: 4, sy: 0.3, y: 2.06 }));

    return finish(parts);
  },
};

export default COL_SQUIDBALL;
