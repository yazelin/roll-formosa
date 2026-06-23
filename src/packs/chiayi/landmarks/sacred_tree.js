/**
 * @file packs/chiayi/landmarks/sacred_tree.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_SACRED_TREE — 阿里山神木 (Alishan Sacred Tree). The famous ancient red cypress
 * (紅檜) trees in Alishan, with massive trunks, gnarled bark texture, and misty
 * forest atmosphere. Though the original sacred tree fell, the area remains iconic.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { cyl, cone, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const BARK = 0x5a3a28;      // reddish-brown bark
const BARK_HI = 0x7a5a48;   // bark highlight
const FOLIAGE = 0x2a4828;   // dark forest green
const FOLIAGE_HI = 0x3a5838;// foliage highlight
const MIST = 0xc8d8e0;      // mountain mist
const FERN = 0x3a6838;      // fern green
const GROUND = 0x4a4838;    // forest floor

export const NM_SACRED_TREE = {
  id: 'sacred_tree',
  name: '阿里山神木',
  landmarkId: 7,
  dioramaRHint: 60, // ancient giant tree
  colorHex: BARK,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Forest floor
    parts.push(cyl(2.0, 2.2, 0.12, 6, GROUND, { y: 0.06, hex2: 0x5a5848 }));

    // Main trunk base - massive gnarled base with buttress roots
    const trunkY = 0.12;

    // Buttress roots spreading outward
    for (let a = 0; a < PI * 2; a += PI / 3) {
      const rx = Math.sin(a) * 0.7;
      const rz = Math.cos(a) * 0.7;
      parts.push(cyl(0.12, 0.2, 0.4, 5, BARK, {
        x: rx * 0.5, y: trunkY + 0.2, z: rz * 0.5,
        rx: -Math.cos(a) * 0.4, rz: Math.sin(a) * 0.4,
        hex2: BARK_HI,
      }));
    }

    // Massive main trunk - tapered cylinder with irregular bulges
    parts.push(cyl(0.4, 0.65, 0.8, 6, BARK, { y: trunkY + 0.4, hex2: BARK_HI }));
    parts.push(cyl(0.32, 0.4, 0.7, 7, BARK, { y: trunkY + 1.15, hex2: BARK_HI }));
    parts.push(cyl(0.25, 0.32, 0.65, 4, BARK, { y: trunkY + 1.82, hex2: BARK_HI }));
    parts.push(cyl(0.18, 0.25, 0.55, 4, BARK, { y: trunkY + 2.4, hex2: BARK_HI }));

    // Major branches spreading out
    const branchY = trunkY + 2.2;
    for (const ba of [0, PI * 0.6, PI * 1.3]) {
      const bx = Math.sin(ba) * 0.35;
      const bz = Math.cos(ba) * 0.35;
      parts.push(cyl(0.08, 0.12, 0.55, 5, BARK, {
        x: bx, y: branchY + 0.3, z: bz,
        rx: -Math.cos(ba) * 0.5, rz: Math.sin(ba) * 0.5,
        hex2: BARK_HI,
      }));
    }

    // Foliage canopy - multiple overlapping cloud shapes
    const canopyY = trunkY + 2.6;
    parts.push(sph(0.55, FOLIAGE, { ws: 7, hs: 5, y: canopyY + 0.4, sx: 1.2, sy: 0.8, sz: 1.2, hex2: FOLIAGE_HI }));
    parts.push(sph(0.4, FOLIAGE, { ws: 4, hs: 3, x: -0.35, y: canopyY + 0.2, z: 0.2, hex2: FOLIAGE_HI }));
    parts.push(sph(0.38, FOLIAGE, { ws: 4, hs: 3, x: 0.32, y: canopyY + 0.15, z: -0.25, hex2: FOLIAGE_HI }));
    parts.push(sph(0.32, FOLIAGE, { ws: 5, hs: 4, x: 0.15, y: canopyY + 0.65 + j, z: 0.28, hex2: FOLIAGE_HI }));

    // Smaller companion tree
    parts.push(cyl(0.12, 0.18, 0.9, 4, BARK, { x: 1.1, y: trunkY + 0.45, z: -0.3, hex2: BARK_HI }));
    parts.push(cyl(0.08, 0.12, 0.6, 5, BARK, { x: 1.1, y: trunkY + 1.2, z: -0.3, hex2: BARK_HI }));
    parts.push(sph(0.35, FOLIAGE, { ws: 4, hs: 3, x: 1.1, y: trunkY + 1.75, z: -0.3, hex2: FOLIAGE_HI }));

    // Forest floor ferns
    for (const fx of [-0.9, 0.7, -0.4]) {
      parts.push(cone(0.18, 0.22, 4, FERN, { x: fx, y: trunkY + 0.11, z: fx * 0.5 + 0.6, hex2: 0x4a7848 }));
    }

    // Mist / fog patches at base (translucent suggestion)
    parts.push(sph(0.6, MIST, { ws: 5, hs: 3, x: -0.5, y: trunkY + 0.3, z: 0.8, sy: 0.3, sx: 1.5 }));
    parts.push(sph(0.5, MIST, { ws: 5, hs: 3, x: 0.6, y: trunkY + 0.25, z: -0.7, sy: 0.25, sx: 1.3 }));

    // Wooden viewing platform / walkway
    parts.push(box(0.9, 0.08, 0.4, 0x6a5a48, { x: -0.8, y: trunkY + 0.16, z: -0.9 }));
    parts.push(cyl(0.04, 0.04, 0.2, 4, 0x5a4a38, { x: -1.1, y: trunkY + 0.22, z: -0.9 }));
    parts.push(cyl(0.04, 0.04, 0.2, 4, 0x5a4a38, { x: -0.5, y: trunkY + 0.22, z: -0.9 }));

    return finish(parts);
  },
};

export default NM_SACRED_TREE;
