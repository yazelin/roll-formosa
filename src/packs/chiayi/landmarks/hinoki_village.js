/**
 * @file packs/chiayi/landmarks/hinoki_village.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_HINOKI_VILLAGE — 檜意森活村 (Hinoki Village). A Japanese-era hinoki cypress
 * timber dormitory village with traditional wooden houses, tatami-style low eaves,
 * wooden verandahs, and cypress timber frames. The signature read: brown wooden
 * structures with dark tile roofs arranged in a garden compound.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const HINOKI = 0xa08060;    // warm hinoki wood
const HINOKI_HI = 0xc8a880; // light cypress
const ROOF = 0x3a3632;      // dark tile roof
const ROOF_HI = 0x4e4a44;   // roof highlight
const TATAMI = 0xd8c8a0;    // tatami/shoji cream
const BASE = 0x5a5048;      // stone foundation
const GARDEN = 0x486840;    // garden green

export const NM_HINOKI_VILLAGE = {
  id: 'hinoki_village',
  name: '檜意森活村',
  landmarkId: 4,
  dioramaRHint: 45, // village compound
  colorHex: HINOKI,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Ground plane / garden compound
    parts.push(box(4.2, 0.12, 3.5, GARDEN, { y: 0.06, hex2: 0x5a7850 }));

    // Main building - central dormitory
    const mainY = 0.12;
    parts.push(box(1.8, 0.14, 1.5, BASE, { y: mainY + 0.07 })); // stone foundation
    parts.push(box(1.6, 0.8, 1.3, HINOKI, { y: mainY + 0.54, hex2: HINOKI_HI })); // timber body
    parts.push(box(1.1, 0.5, 0.08, TATAMI, { y: mainY + 0.45, z: 0.62 })); // shoji screens
    // Hip roof
    parts.push(box(1.9, 0.08, 1.6, ROOF, { y: mainY + 0.98 })); // eave
    parts.push(cone(0.95, 0.55, 4, ROOF, { y: mainY + 1.3, ry: PI / 4, sz: 0.85, hex2: ROOF_HI }));

    // Left wing building
    const lx = -1.4;
    parts.push(box(1.1, 0.1, 1.0, BASE, { x: lx, y: mainY + 0.05, z: 0.3 }));
    parts.push(box(0.9, 0.6, 0.8, HINOKI, { x: lx, y: mainY + 0.42, z: 0.3, hex2: HINOKI_HI }));
    parts.push(box(1.15, 0.06, 1.05, ROOF, { x: lx, y: mainY + 0.75, z: 0.3 }));
    parts.push(cone(0.58, 0.38, 4, ROOF, { x: lx, y: mainY + 0.98, z: 0.3, ry: PI / 4, sz: 0.75, hex2: ROOF_HI }));

    // Right wing building
    const rx = 1.4;
    parts.push(box(1.0, 0.1, 1.1, BASE, { x: rx, y: mainY + 0.05, z: -0.2 }));
    parts.push(box(0.8, 0.55, 0.9, HINOKI, { x: rx, y: mainY + 0.4, z: -0.2, hex2: HINOKI_HI }));
    parts.push(box(1.05, 0.06, 1.15, ROOF, { x: rx, y: mainY + 0.7, z: -0.2 }));
    parts.push(cone(0.55, 0.35, 4, ROOF, { x: rx, y: mainY + 0.92, z: -0.2, ry: PI / 4, sz: 0.8, hex2: ROOF_HI }));

    // Wooden verandah posts
    for (const px of [-0.65, 0.65]) {
      parts.push(cyl(0.04, 0.04, 0.65, 4, HINOKI_HI, { x: px, y: mainY + 0.45, z: 0.72 }));
    }

    // Stone path
    parts.push(box(0.4, 0.06, 2.2, 0x787068, { y: 0.15, z: -0.5 + j }));

    // Garden tree (hinoki cypress)
    parts.push(cyl(0.08, 0.08, 0.4, 5, 0x5a4a3a, { x: -0.6, y: 0.32, z: -1.2 }));
    parts.push(cone(0.35, 0.7, 6, 0x3a5830, { x: -0.6, y: 0.85, z: -1.2, hex2: 0x4a6840 }));

    return finish(parts);
  },
};

export default NM_HINOKI_VILLAGE;
