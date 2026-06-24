/**
 * @file packs/taoyuan/collectibles/yueguang_bing.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_YUEGUANG — 大溪月光餅 (Daxi mooncake): a large, flat, pale-golden round
 * pastry dusted with sesame, with a faint scored cross on top and a red shop
 * stamp at the center, leaning slightly. A small hand-held pastry — flat and
 * round, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges bake tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_YUEGUANG = {
  id: 'yueguang_bing',
  name: '大溪月光餅',
  collectibleId: 5,
  colorHex: 0xeacf86, // pale golden mooncake

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030301);
    const crust = 0xeacf86 + t; // pale gold
    const crustHi = 0xf6e3a8;
    const crustDk = 0xcdb068;
    const sesame = 0xece0c4; // sesame dusting
    const stamp = 0xc23a2f; // red shop stamp

    const parts = [];
    // flat round cake (squat disc) with a gently domed top
    parts.push(cyl(1.0, 1.0, 0.4, 18, crust, { y: 0.24, hex2: crustDk }));
    parts.push(sph(0.98, crust, { ws: 18, hs: 5, sy: 0.22, y: 0.4, hex2: crustHi }));
    // sesame dusting cap
    parts.push(sph(0.92, sesame, { ws: 14, hs: 3, sy: 0.12, thetaLen: 1.5, y: 0.48 }));
    // faint scored cross on top
    parts.push(box(1.5, 0.03, 0.06, crustDk, { y: 0.54 }));
    parts.push(box(0.06, 0.03, 1.5, crustDk, { y: 0.54 }));
    // red center stamp
    parts.push(cyl(0.22, 0.22, 0.05, 10, stamp, { y: 0.57, hex2: 0xd9534a }));

    return finish(parts);
  },
};

export default COL_YUEGUANG;
