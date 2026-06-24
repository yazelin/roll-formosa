/**
 * @file packs/keelung/collectibles/li_hu_cake.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_LIHU — 李鵠餅 (Keelung's century-old Li Hu bakery pastry, the 鳳梨/咖哩酥
 * golden flaky cake). Silhouette: a squat round golden pastry built from a few
 * stacked flaky discs with a slightly domed top, a thin pale flour dusting and
 * a small red shop-stamp on the crown, with a second smaller cake leaning at
 * its side. A small hand-held pastry — round and squat, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the read. <= 350 triangles
 * (collectible budget). rng() only nudges the bake tint, never structure.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_LIHU = {
  id: 'li_hu_cake',
  name: '李鵠餅',
  collectibleId: 8,
  colorHex: 0xe0b15c, // golden baked pastry

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040301); // tiny per-instance bake tint nudge
    const crust = 0xe0b15c + t; // golden crust
    const crustHi = 0xf0cb83; // toasted highlight
    const crustDk = 0xc1934a; // bake shading between flaky layers
    const flour = 0xf4ead2; // pale flour dusting
    const stamp = 0xc23a2f; // red shop stamp

    const parts = [];

    // --- MAIN cake: stacked flaky discs (squat round) -------------------
    parts.push(cyl(0.92, 0.96, 0.34, 11, crust, { y: 0.2, hex2: crustDk }));   // base flaky layer
    parts.push(cyl(0.88, 0.92, 0.3, 11, crust, { y: 0.5, hex2: crustHi }));    // middle layer
    parts.push(cyl(0.78, 0.86, 0.26, 11, crust, { y: 0.74, hex2: crustHi }));  // upper layer
    // gently domed top crown
    parts.push(sph(0.78, crust, { ws: 11, hs: 4, sy: 0.4, y: 0.86, hex2: crustHi }));
    // pale flour dusting cap
    parts.push(sph(0.74, flour, { ws: 10, hs: 3, sy: 0.18, thetaLen: 1.5, y: 0.96 }));
    // small red shop stamp on the crown
    parts.push(cyl(0.2, 0.2, 0.05, 6, stamp, { y: 1.06, hex2: 0xd9514a }));

    // --- SECOND smaller cake leaning at the side ------------------------
    const sx = 0.95, sz = 0.35;
    parts.push(cyl(0.5, 0.54, 0.66, 10, crust, { x: sx, z: sz, y: 0.42, rz: 0.5, hex2: crustDk }));
    parts.push(sph(0.5, crust, { ws: 9, hs: 4, sy: 0.42, x: sx + 0.18, z: sz, y: 0.62, rz: 0.5, hex2: crustHi }));
    parts.push(cyl(0.12, 0.12, 0.04, 6, stamp, { x: sx + 0.26, z: sz, y: 0.74, rz: 0.5 }));

    return finish(parts);
  },
};

export default COL_LIHU;
