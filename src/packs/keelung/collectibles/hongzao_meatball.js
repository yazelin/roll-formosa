/**
 * @file packs/keelung/collectibles/hongzao_meatball.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_HONGZAO — 紅糟肉圓 (Keelung's red-yeast 肉圓): a glossy translucent dome of
 * steamed dough on a small plate, the red-yeast pork filling glowing through, a
 * drizzle of red sauce on top. A small hand-held plated snack — low and round.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the dough tint.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_HONGZAO = {
  id: 'hongzao_meatball',
  name: '紅糟肉圓',
  collectibleId: 5,
  colorHex: 0xe8d6b0, // translucent dough

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201);
    const dough = 0xcfd0c2; // greyish translucent rice-skin (NOT egg-white)
    const doughHi = 0xdedfd2;
    const filling = 0x9a2f24; // dark red-yeast pork
    const fillingHi = 0xc04434;
    const plate = 0xeceae3; // white plate
    const plateBand = 0x3f6fae; // blue rim
    const redsauce = 0xc8362b; // 海山醬 red sauce
    const garlic = 0xf2efdf; // pale garlic paste

    const parts = [];
    // small plate
    parts.push(cyl(1.05, 1.1, 0.14, 16, plate, { y: 0.14, hex2: 0xe1ded5 }));
    parts.push(cyl(1.06, 1.0, 0.05, 16, plateBand, { y: 0.21, open: true }));
    // low wide greyish translucent rice-skin body (squat, irregular)
    parts.push(sph(0.92, dough, { ws: 15, hs: 8, sy: 0.42, y: 0.24, thetaLen: PI * 0.5, hex2: doughHi }));
    parts.push(sph(0.6, dough, { ws: 10, hs: 5, sy: 0.4, x: 0.18, z: -0.12, y: 0.4, hex2: doughHi })); // lumpy bulge
    // OPEN top: the red-yeast filling shows through a torn window in the skin
    parts.push(sph(0.42, filling, { ws: 10, hs: 6, sy: 0.5, y: 0.52, hex2: fillingHi }));
    parts.push(sph(0.24, fillingHi, { ws: 7, hs: 4, sy: 0.5, x: 0.06, y: 0.62 })); // glistening pork chunk
    // red 海山醬 swoosh + pale garlic paste drizzle across the top (off-centre, not a yolk)
    parts.push(cyl(0.06, 0.06, 0.8, 6, redsauce, { y: 0.66, z: 0.1, rz: PI / 2, ry: 0.3 }));
    parts.push(cyl(0.04, 0.04, 0.66, 5, garlic, { y: 0.68, z: -0.12, rz: PI / 2, ry: -0.4 }));

    return finish(parts);
  },
};

export default COL_HONGZAO;
