/**
 * @file packs/matsu/collectibles/black_bear.js — Roll Formosa Matsu pack.
 *
 * 台灣黑熊 (Formosan black bear) — code 70. A tiny chibi figurine the
 * katamari can roll up: a glossy black, big-headed plush-bear silhouette sitting
 * upright. Round head with two round ears, stubby arms and legs, and the signature
 * cream "V" crescent mark on the chest (the trait that tells a Formosan black bear
 * apart from any other bear). Pan-Taiwan collectible shared across all packs.
 *
 * <= 350 triangles.
 */

import { sph, box, finish } from '../geomHelpers.js';

const FUR = 0x1c1c22;
const FUR_HI = 0x2a2a34;
const CREAM = 0xf3ead2;
const MUZZLE = 0x8c7c68;
const NOSE = 0x101014;
const EYE = 0x0c0c10;

export const COL_BLACK_BEAR = {
  id: 'black_bear',
  name: '台灣黑熊',
  colorHex: 0x1c1c22,

  /**
   * Build the figurine geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (ear tilt, fur jitter).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    const furJit = (rng() - 0.5) * 0.06;
    const furHi = furJit > 0 ? FUR_HI : FUR;
    const earTilt = (rng() - 0.5) * 0.18;

    // Body
    parts.push(sph(0.62, FUR, { ws: 7, hs: 5, sx: 1.0, sy: 1.08, sz: 0.92, y: 0.46, hex2: furHi }));

    // Cream chest crescent (V mark)
    parts.push(sph(0.3, CREAM, { ws: 6, hs: 4, sx: 0.85, sy: 0.95, sz: 0.28, rx: -0.32, y: 0.62, z: 0.5 }));

    // Head
    parts.push(sph(0.62, FUR, { ws: 7, hs: 5, sx: 1.06, sy: 1.0, sz: 1.0, y: 1.32, hex2: furHi }));

    // Muzzle
    parts.push(sph(0.26, MUZZLE, { ws: 6, hs: 4, sx: 1.0, sy: 0.82, sz: 0.9, y: 1.16, z: 0.52 }));
    parts.push(box(0.13, 0.1, 0.1, NOSE, { y: 1.2, z: 0.72 }));

    // Ears
    const earY = 1.78;
    const earX = 0.42;
    const earZ = -0.04;
    parts.push(sph(0.24, FUR, { ws: 5, hs: 3, sz: 0.5, rz: earTilt, x: -earX, y: earY, z: earZ, hex2: furHi }));
    parts.push(sph(0.24, FUR, { ws: 5, hs: 3, sz: 0.5, rz: -earTilt, x: earX, y: earY, z: earZ, hex2: furHi }));

    // Eyes
    parts.push(box(0.09, 0.11, 0.07, EYE, { x: -0.22, y: 1.42, z: 0.52 }));
    parts.push(box(0.09, 0.11, 0.07, EYE, { x: 0.22, y: 1.42, z: 0.52 }));

    // Arms
    parts.push(sph(0.22, FUR, { ws: 5, hs: 3, sx: 0.9, sy: 1.1, sz: 0.9, x: -0.6, y: 0.5, z: 0.18, hex2: furHi }));
    parts.push(sph(0.22, FUR, { ws: 5, hs: 3, sx: 0.9, sy: 1.1, sz: 0.9, x: 0.6, y: 0.5, z: 0.18, hex2: furHi }));

    // Legs/feet
    parts.push(sph(0.26, FUR, { ws: 5, hs: 3, sx: 1.0, sy: 0.7, sz: 1.2, x: -0.32, y: -0.04, z: 0.34, hex2: furHi }));
    parts.push(sph(0.26, FUR, { ws: 5, hs: 3, sx: 1.0, sy: 0.7, sz: 1.2, x: 0.32, y: -0.04, z: 0.34, hex2: furHi }));

    return finish(parts);
  },
};

export default COL_BLACK_BEAR;
