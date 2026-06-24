/**
 * @file packs/taoyuan/collectibles/daxi_douhua.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_DOUHUA — 大溪豆花 (Daxi tofu pudding): a bowl of silky white douhua in pale
 * sugar syrup, topped with a scoop of soft peanuts, with a flat spoon resting in
 * it. A small hand-held bowl — wide and squat, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the syrup tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_DOUHUA = {
  id: 'daxi_douhua',
  name: '大溪豆花',
  collectibleId: 11,
  colorHex: 0xf3eee2, // silky white tofu

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020301);
    const tofu = 0xf3eee2 + t; // silky white
    const tofuHi = 0xfbf8f0;
    const bowl = 0xe9e3d8; // cream ceramic bowl
    const bowlBand = 0xb5532e; // red-brown rim
    const syrup = 0xe4c98a; // pale sugar syrup
    const peanut = 0xcaa15e; // soft peanut
    const wood = 0xcaa86e; // wooden spoon

    const parts = [];
    // bowl
    parts.push(cyl(0.9, 0.58, 0.82, 16, bowl, { y: 0.48, hex2: 0xddd6c9 }));
    parts.push(cyl(0.92, 0.88, 0.1, 16, bowlBand, { y: 0.86, open: true }));
    parts.push(cyl(0.58, 0.58, 0.05, 8, 0xd6cfc2, { y: 0.08 }));
    // syrup surface
    parts.push(cyl(0.82, 0.82, 0.05, 16, syrup, { y: 0.84, hex2: 0xeed29a }));
    // silky tofu mound
    parts.push(sph(0.66, tofu, { ws: 14, hs: 6, sy: 0.42, y: 0.9, hex2: tofuHi }));
    parts.push(sph(0.34, tofu, { ws: 9, hs: 4, sy: 0.5, x: -0.2, z: 0.16, y: 1.08, hex2: tofuHi }));
    // peanut topping cluster
    parts.push(sph(0.13, peanut, { ws: 5, hs: 4, x: 0.22, z: 0.0, y: 1.06 }));
    parts.push(sph(0.12, peanut, { ws: 5, hs: 4, x: 0.34, z: 0.16, y: 1.04 }));
    parts.push(sph(0.11, peanut, { ws: 5, hs: 4, x: 0.12, z: 0.24, y: 1.04 }));
    // wooden spoon resting in the bowl
    parts.push(box(0.12, 1.0, 0.05, wood, { x: 0.42, y: 1.2, z: 0.04, rz: 0.42, hex2: 0xb8945e }));
    parts.push(sph(0.16, wood, { ws: 6, hs: 4, sy: 0.4, x: 0.04, y: 0.86, z: 0.04, rz: 0.42 }));

    return finish(parts);
  },
};

export default COL_DOUHUA;
