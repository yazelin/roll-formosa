/**
 * @file packs/taoyuan/collectibles/guanyin_lotus.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_LOTUS — 觀音蓮花 (the lotus of Taoyuan's 觀音區 lotus season 蓮花季).
 * Silhouette: an open pink lotus bloom — a ring of pointed petals opening from a
 * green-yellow central seed-pod, sitting on a flat green lily pad. A small
 * hand-held flower — wide and open, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the petal tint.
 */

import { cyl, cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_LOTUS = {
  id: 'guanyin_lotus',
  name: '觀音蓮花',
  collectibleId: 3,
  colorHex: 0xe888a6, // lotus pink

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030102);
    const petal = 0xe888a6 + t; // pink
    const petalHi = 0xf4b3c6; // pale petal tip
    const pad = 0x4f8c3f; // green lily pad
    const padHi = 0x6aa84a;
    const pod = 0xbcc24a; // green-yellow seed pod
    const water = 0x4a7fae; // hint of water under the pad

    const parts = [];
    // lily pad (flat disc) + faint water ring
    parts.push(cyl(1.15, 1.15, 0.05, 18, pad, { y: 0.08, hex2: padHi }));
    parts.push(cyl(1.3, 1.3, 0.03, 18, water, { y: 0.04 }));
    // outer ring of 8 open petals (flattened cones leaning outward)
    const N = 8;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * PI * 2;
      parts.push(cone(0.22, 0.7, 6, petal, {
        x: Math.cos(a) * 0.42, z: Math.sin(a) * 0.42, y: 0.42,
        rx: Math.sin(a) * 0.7, rz: -Math.cos(a) * 0.7, hex2: petalHi,
      }));
    }
    // inner ring of 5 smaller upright petals
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * PI * 2 + 0.3;
      parts.push(cone(0.16, 0.5, 6, petalHi, {
        x: Math.cos(a) * 0.2, z: Math.sin(a) * 0.2, y: 0.5,
        rx: Math.sin(a) * 0.35, rz: -Math.cos(a) * 0.35,
      }));
    }
    // central seed pod
    parts.push(cyl(0.2, 0.26, 0.2, 10, pod, { y: 0.56, hex2: 0xd2d66a }));

    return finish(parts);
  },
};

export default COL_LOTUS;
