/**
 * @file packs/nantou/collectibles/shiitake.js — Roll Formosa Nantou pack, COLLECTIBLE.
 *
 * COL_SHIITAKE — 椴木香菇 (log-grown shiitake from Nantou's 埔里/中寮 hills, the
 * cracked-cap "花菇" prize grade). A fat mushroom: a thick cream stem under a
 * domed tan cap webbed with pale cracks, plus a small second button beside it.
 * A small hand-held mushroom — squat and round, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the cap tint.
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_SHIITAKE = {
  id: 'shiitake',
  name: '椴木香菇',
  collectibleId: 3,
  colorHex: 0x9a6b3e, // shiitake cap brown

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030201);
    const cap = 0x9a6b3e + t; // tan-brown cap
    const capHi = 0xb5854f;
    const crack = 0xe8dcc0; // pale 花菇 cracks
    const stem = 0xeae0cc; // cream stem
    const gill = 0xd8c9a8; // gills underside

    const parts = [];
    // thick stem
    parts.push(cyl(0.3, 0.36, 0.66, 12, stem, { y: 0.36, hex2: 0xddd2bb }));
    // gills underside disc
    parts.push(cyl(0.74, 0.74, 0.08, 14, gill, { y: 0.7 }));
    // domed cap
    parts.push(sph(0.82, cap, { ws: 14, hs: 7, sy: 0.6, y: 0.74, thetaLen: PI * 0.55, hex2: capHi }));
    // pale 花菇 cracks across the cap (a cross of thin pale bars)
    parts.push(box(1.4, 0.05, 0.12, crack, { y: 1.04 }));
    parts.push(box(0.12, 0.05, 1.4, crack, { y: 1.04 }));
    parts.push(box(1.0, 0.05, 0.1, crack, { y: 1.02, ry: 0.8 }));
    // small second button mushroom beside it
    parts.push(cyl(0.16, 0.2, 0.34, 9, stem, { x: 0.66, z: 0.18, y: 0.2 }));
    parts.push(sph(0.36, cap, { ws: 10, hs: 5, sy: 0.6, x: 0.66, z: 0.18, y: 0.42, thetaLen: PI * 0.55, hex2: capHi }));

    return finish(parts);
  },
};

export default COL_SHIITAKE;
