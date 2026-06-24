/**
 * @file packs/taoyuan/collectibles/lalashan_peach.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_PEACH — 拉拉山水蜜桃 (Lalashan honey peach, Taoyuan's famous high-mountain
 * fruit). Silhouette: a fat blushing peach with the signature vertical cleft,
 * a short stem and a single green leaf at the top. A small hand-held fruit —
 * round and plump, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the blush.
 */

import { sph, cyl, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_PEACH = {
  id: 'lalashan_peach',
  name: '拉拉山水蜜桃',
  collectibleId: 10,
  colorHex: 0xf4c89a, // peach skin

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302);
    const skin = 0xf4c89a + t; // warm peach
    const blush = 0xe87a6a; // red-pink blush cheek
    const cleft = 0xdca877; // shaded cleft
    const stem = 0x8a5a32; // brown stem
    const leaf = 0x5b9a45; // green leaf

    const parts = [];
    // two plump lobes (the cleft) — two overlapping spheres
    parts.push(sph(0.86, skin, { ws: 11, hs: 9, x: 0.16, hex2: blush, y: 0.9 }));
    parts.push(sph(0.86, skin, { ws: 11, hs: 9, x: -0.16, hex2: skin, y: 0.9 }));
    // shaded cleft line down the front
    parts.push(box(0.05, 1.4, 0.6, cleft, { y: 0.9, z: 0.5 }));
    // blush cheek highlight
    parts.push(sph(0.4, blush, { ws: 8, hs: 6, sz: 0.4, x: 0.4, z: 0.55, y: 1.0 }));
    // short stem at top
    parts.push(cyl(0.06, 0.08, 0.24, 6, stem, { y: 1.78, rz: 0.16 }));
    // single leaf
    parts.push(sph(0.26, leaf, { ws: 7, hs: 4, sy: 0.3, sx: 1.4, x: 0.28, z: 0.0, y: 1.82, rz: 0.5, hex2: 0x76b85a }));

    return finish(parts);
  },
};

export default COL_PEACH;
