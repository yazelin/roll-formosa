/**
 * @file packs/keelung/collectibles/squid.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_SQUID — 八斗子透抽 (fresh squid from Keelung's 八斗子 fishing harbour). A
 * pale pearly squid: a long tapered mantle with two side fins at the tip, big
 * round eyes, and a fan of dangling tentacles. A small hand-held catch — long
 * and tapered, tentacles down.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the pearly tint.
 */

import { cyl, cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_SQUID = {
  id: 'squid',
  name: '八斗子透抽',
  collectibleId: 6,
  colorHex: 0xf0dcd2, // pearly squid

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020102);
    const flesh = 0xf0dcd2 + t; // pearly pink-white
    const fleshHi = 0xf8ebe4;
    const spot = 0xd98a86; // faint chromatophore speckle
    const eye = 0x2a2320;
    const tent = 0xeed3c8; // tentacles

    const parts = [];
    // mantle — long tapered body pointing up (cone, apex up)
    parts.push(cone(0.5, 1.7, 12, flesh, { y: 1.1, hex2: fleshHi }));
    parts.push(sph(0.5, flesh, { ws: 12, hs: 8, y: 0.4, hex2: fleshHi })); // rounded head end (bottom)
    // two side fins near the pointed tip (flattened cones)
    parts.push(cone(0.3, 0.5, 6, flesh, { x: 0.34, y: 1.7, rz: -1.1, hex2: fleshHi }));
    parts.push(cone(0.3, 0.5, 6, flesh, { x: -0.34, y: 1.7, rz: 1.1, hex2: fleshHi }));
    // faint speckles
    parts.push(sph(0.06, spot, { ws: 4, hs: 3, x: 0.2, z: 0.32, y: 1.0 }));
    parts.push(sph(0.05, spot, { ws: 4, hs: 3, x: -0.16, z: 0.3, y: 1.3 }));
    // big round eyes on the head
    parts.push(sph(0.13, fleshHi, { ws: 6, hs: 5, x: 0.34, z: 0.28, y: 0.42 }));
    parts.push(sph(0.13, fleshHi, { ws: 6, hs: 5, x: -0.34, z: 0.28, y: 0.42 }));
    parts.push(sph(0.07, eye, { ws: 5, hs: 4, x: 0.36, z: 0.38, y: 0.42 }));
    parts.push(sph(0.07, eye, { ws: 5, hs: 4, x: -0.36, z: 0.38, y: 0.42 }));
    // fan of dangling tentacles below the head
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      parts.push(cyl(0.05, 0.02, 0.7, 5, tent, {
        x: Math.cos(a) * 0.18, z: Math.sin(a) * 0.18, y: -0.18,
        rx: Math.sin(a) * 0.3, rz: -Math.cos(a) * 0.3,
      }));
    }

    return finish(parts);
  },
};

export default COL_SQUID;
