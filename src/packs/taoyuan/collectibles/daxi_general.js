/**
 * @file packs/taoyuan/collectibles/daxi_general.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_GENERAL — 大溪大仙尪仔 (the giant deity-general puppet figures paraded at
 * Daxi's 大溪大禧 / 普濟堂 關聖帝君 festival, Taoyuan's signature folk pageant).
 * Silhouette: a tall robed figure with a comically oversized painted head, a
 * tall gold crown, and a wide draped festival robe over stubby arms, with two
 * little 令旗 back-flags. A small hand-held figure — top-heavy head, never a
 * sleek tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the robe tint.
 */

import { cyl, cone, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_GENERAL = {
  id: 'daxi_general',
  name: '大溪大仙尪仔',
  collectibleId: 6,
  colorHex: 0xc23a2f, // festival red robe

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const robe = 0xc23a2f + t; // festival red
    const robeHi = 0xd9534a;
    const gold = 0xe2b23c; // gold trim / crown
    const face = 0xf0d9b8; // painted pale face
    const faceDk = 0xd9b88f;
    const ink = 0x2a2320; // painted features / hair
    const flag = 0xe8c84a; // 令旗 back-flag

    const parts = [];
    // draped festival ROBE (wide cone, narrow shoulders, wide hem)
    parts.push(cone(0.82, 1.35, 14, robe, { y: 0.67, hex2: robeHi }));
    // gold belt/sash band
    parts.push(cyl(0.6, 0.66, 0.14, 14, gold, { y: 0.7, open: true }));
    // gold hem trim
    parts.push(cyl(0.84, 0.84, 0.1, 14, gold, { y: 0.06, open: true }));
    // stubby arms at the sides
    parts.push(cyl(0.13, 0.13, 0.6, 7, robe, { x: 0.5, y: 0.7, rz: 0.5, hex2: robeHi }));
    parts.push(cyl(0.13, 0.13, 0.6, 7, robe, { x: -0.5, y: 0.7, rz: -0.5, hex2: robeHi }));
    // oversized painted HEAD
    parts.push(sph(0.62, face, { ws: 13, hs: 9, y: 1.6, hex2: faceDk }));
    // painted features: brow band + two eyes + small mouth
    parts.push(box(0.7, 0.1, 0.06, ink, { y: 1.74, z: 0.5 }));
    parts.push(sph(0.08, ink, { ws: 5, hs: 4, x: 0.18, y: 1.62, z: 0.52 }));
    parts.push(sph(0.08, ink, { ws: 5, hs: 4, x: -0.18, y: 1.62, z: 0.52 }));
    parts.push(box(0.18, 0.05, 0.05, 0x9a2a22, { y: 1.42, z: 0.56 }));
    // tall gold CROWN/helmet
    parts.push(cone(0.5, 0.5, 12, gold, { y: 2.2 }));
    parts.push(sph(0.1, 0xd9534a, { ws: 6, hs: 5, y: 2.5 })); // crown jewel
    // two little 令旗 back-flags
    parts.push(box(0.04, 0.66, 0.42, flag, { x: 0.34, y: 1.7, z: -0.4, rz: 0.18, hex2: 0xf2dd72 }));
    parts.push(box(0.04, 0.66, 0.42, flag, { x: -0.34, y: 1.7, z: -0.4, rz: -0.18, hex2: 0xf2dd72 }));

    return finish(parts);
  },
};

export default COL_GENERAL;
