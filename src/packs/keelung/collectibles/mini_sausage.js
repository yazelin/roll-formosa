/**
 * @file packs/keelung/collectibles/mini_sausage.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_SAUSAGE — 一口吃香腸 (Keelung Miaokou one-bite sausages): a few glossy
 * grilled mini sausages on a small dish, speared with a toothpick, served with a
 * clove of raw garlic on the side. A small hand-held snack dish — low and round.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the grill tint.
 */

import { cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_SAUSAGE = {
  id: 'mini_sausage',
  name: '一口吃香腸',
  collectibleId: 3,
  colorHex: 0xb5482f, // grilled sausage red-brown

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const meat = 0xb5482f + t; // sausage red-brown
    const meatHi = 0xcf6442; // glossy highlight
    const plate = 0xeceae3; // white dish
    const plateBand = 0xc23a2f; // red rim
    const stick = 0xdac88a; // toothpick
    const garlic = 0xf0ead8; // garlic clove

    const parts = [];
    // small dish
    parts.push(cyl(1.0, 1.05, 0.16, 16, plate, { y: 0.16, hex2: 0xe1ded5 }));
    parts.push(cyl(1.01, 0.96, 0.06, 16, plateBand, { y: 0.24, open: true }));
    // three glossy mini sausages (capsules lying down, fanned)
    const lay = [{ x: -0.1, z: 0.18, r: 0.2 }, { x: 0.16, z: -0.02, r: -0.3 }, { x: -0.02, z: -0.24, r: 0.6 }];
    for (const s of lay) {
      parts.push(cyl(0.16, 0.16, 0.66, 7, meat, { x: s.x, z: s.z, y: 0.42, rz: HALF_PI, ry: s.r, hex2: meatHi }));
      parts.push(sph(0.16, meat, { ws: 6, hs: 4, x: s.x + Math.cos(s.r) * 0.33, z: s.z - Math.sin(s.r) * 0.33, y: 0.42, hex2: meatHi }));
      parts.push(sph(0.16, meat, { ws: 6, hs: 4, x: s.x - Math.cos(s.r) * 0.33, z: s.z + Math.sin(s.r) * 0.33, y: 0.42, hex2: meatHi }));
    }
    // toothpick poking up from the top sausage
    parts.push(cyl(0.025, 0.025, 0.6, 5, stick, { x: -0.1, y: 0.78, z: 0.18, rz: 0.2 }));
    // garlic clove on the side
    parts.push(sph(0.18, garlic, { ws: 7, hs: 6, sy: 1.3, x: 0.6, z: 0.34, y: 0.42 }));

    return finish(parts);
  },
};

export default COL_SAUSAGE;
