/**
 * @file packs/yunlin/collectibles/mullet_roe.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_MULLET — 口湖烏魚子 (cured mullet roe from 口湖鄉, Yunlin's coastal
 * specialty). A pair of glossy amber pressed roe lobes on a small dish, one
 * sliced to show the bright orange interior, with a sliver of garlic-leaf and a
 * radish slice. A small hand-held delicacy — flat and low, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the cure tint.
 */

import { cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_MULLET = {
  id: 'mullet_roe',
  name: '口湖烏魚子',
  collectibleId: 3,
  colorHex: 0xb5712e, // cured amber roe

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const roe = 0xb5712e + t; // amber-brown cured roe
    const roeHi = 0xcf8c44; // glossy sheen
    const inner = 0xe07a2e; // bright orange cut interior
    const plate = 0xeceae3; // white dish
    const plateBand = 0xc23a2f; // red rim
    const garlic = 0xd8e0a8; // garlic-leaf green-white
    const radish = 0xf2eee2; // radish slice

    const parts = [];
    // small dish
    parts.push(cyl(1.0, 1.05, 0.16, 16, plate, { y: 0.16, hex2: 0xe1ded5 }));
    parts.push(cyl(1.01, 0.96, 0.06, 16, plateBand, { y: 0.24, open: true }));
    // whole roe lobe (flat pressed ovoid lying down)
    parts.push(sph(0.66, roe, { ws: 12, hs: 8, sy: 0.32, sz: 0.5, x: -0.2, y: 0.42, rz: 0.1, hex2: roeHi }));
    // sliced roe lobe + a cut slice showing orange interior
    parts.push(sph(0.4, roe, { ws: 10, hs: 6, sy: 0.32, sz: 0.5, x: 0.5, z: 0.18, y: 0.42, hex2: roeHi }));
    parts.push(cyl(0.34, 0.34, 0.1, 12, inner, { x: 0.66, z: 0.0, y: 0.44, rz: HALF_PI, sz: 0.5, hex2: 0xf09a4a })); // cut face
    // garnish: garlic-leaf sliver + radish slice
    parts.push(cyl(0.04, 0.02, 0.6, 5, garlic, { x: -0.1, z: -0.4, y: 0.5, rz: HALF_PI - 0.3 }));
    parts.push(cyl(0.18, 0.18, 0.05, 10, radish, { x: -0.5, z: -0.34, y: 0.42 }));

    return finish(parts);
  },
};

export default COL_MULLET;
