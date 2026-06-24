/**
 * @file packs/keelung/collectibles/shrimp_geng.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_SHRIMP_GENG — 蝦仁羹 (Keelung Miaokou shrimp thick-soup). A wide bowl of
 * glossy amber starchy broth with plump pink shrimp and a few greens, a flat
 * spoon resting in it. A small hand-held bowl — wide and squat, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the broth tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_SHRIMP_GENG = {
  id: 'shrimp_geng',
  name: '蝦仁羹',
  collectibleId: 2,
  colorHex: 0xd8a24e, // amber broth

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030201);
    const broth = 0xd8a24e + t; // glossy amber starchy broth
    const brothHi = 0xe7bd6f;
    const bowl = 0xf2efe8; // white bowl
    const bowlBand = 0x3f6fae; // blue rim
    const shrimp = 0xe8806e; // pink shrimp
    const shrimpHi = 0xf2a08e;
    const green = 0x6aa84a;
    const wood = 0xcaa86e;

    const parts = [];
    parts.push(cyl(0.92, 0.58, 0.82, 16, bowl, { y: 0.48, hex2: 0xe6e2da }));
    parts.push(cyl(0.94, 0.9, 0.1, 16, bowlBand, { y: 0.84, open: true }));
    parts.push(cyl(0.58, 0.58, 0.05, 8, 0xe2ded6, { y: 0.08 }));
    // amber broth surface
    parts.push(cyl(0.84, 0.84, 0.07, 16, broth, { y: 0.84, hex2: brothHi }));
    // plump shrimp (curled: a sphere + a tail nub)
    parts.push(sph(0.22, shrimp, { ws: 8, hs: 6, x: 0.18, z: 0.05, y: 0.92, hex2: shrimpHi }));
    parts.push(sph(0.16, shrimp, { ws: 7, hs: 5, x: -0.22, z: 0.18, y: 0.9, hex2: shrimpHi }));
    parts.push(sph(0.15, shrimp, { ws: 7, hs: 5, x: 0.0, z: -0.26, y: 0.9, hex2: shrimpHi }));
    // greens
    parts.push(sph(0.09, green, { ws: 5, hs: 3, x: 0.32, z: -0.18, y: 0.92 }));
    parts.push(sph(0.08, green, { ws: 5, hs: 3, x: -0.1, z: 0.3, y: 0.92 }));
    // spoon
    parts.push(box(0.12, 1.0, 0.05, wood, { x: 0.42, y: 1.18, z: 0.06, rz: 0.42, hex2: 0xb8945e }));
    parts.push(sph(0.16, wood, { ws: 6, hs: 4, sy: 0.4, x: 0.04, y: 0.84, z: 0.06, rz: 0.42 }));

    return finish(parts);
  },
};

export default COL_SHRIMP_GENG;
