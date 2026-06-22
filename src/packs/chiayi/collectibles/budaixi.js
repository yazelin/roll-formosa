/**
 * @file packs/chiayi/collectibles/budaixi.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_BUDAIXI — 布袋戲偶 (Budaixi Puppet). Traditional Taiwanese glove puppet used in
 * 布袋戲 (pò͘-tē-hì) puppet theater. Ornate costume, painted face, distinctive
 * theatrical headdress. Chiayi/Yunlin area is famous for budaixi tradition.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const FACE = 0xf0d8c0;      // painted face
const ROBE = 0x2048a0;      // blue robe
const ROBE_HI = 0x3868c8;   // robe highlight
const GOLD = 0xe8c030;      // gold trim
const HAIR = 0x1a1a1a;      // black hair/headdress

export const COL_BUDAIXI = {
  id: 'budaixi',
  name: '布袋戲偶',
  colorHex: 0x2048a0,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Robe body (triangular shape)
    parts.push(cone(0.35, 0.55, 6, ROBE, { y: 0.275, hex2: ROBE_HI }));

    // Robe collar
    parts.push(cyl(0.18, 0.2, 0.08, 6, GOLD, { y: 0.55 }));

    // Face/head
    parts.push(sph(0.18, FACE, { ws: 6, hs: 5, y: 0.72, hex2: 0xf8e8d8 }));

    // Painted eyes (dramatic opera style)
    parts.push(box(0.08, 0.03, 0.02, 0x1a1a1a, { x: -0.06, y: 0.74, z: 0.16, ry: -0.2 }));
    parts.push(box(0.08, 0.03, 0.02, 0x1a1a1a, { x: 0.06, y: 0.74, z: 0.16, ry: 0.2 }));

    // Eyebrows (arched dramatically)
    parts.push(box(0.1, 0.02, 0.02, 0x1a1a1a, { x: -0.06, y: 0.78, z: 0.15, ry: -0.3, rz: 0.2 }));
    parts.push(box(0.1, 0.02, 0.02, 0x1a1a1a, { x: 0.06, y: 0.78, z: 0.15, ry: 0.3, rz: -0.2 }));

    // Beard (for scholar/general character)
    parts.push(cone(0.08, 0.15, 4, HAIR, { y: 0.58, z: 0.1, rx: 0.3 }));

    // Headdress/crown
    parts.push(box(0.22, 0.1, 0.18, HAIR, { y: 0.88 + j }));
    parts.push(cone(0.06, 0.15, 4, GOLD, { y: 1.02 }));
    // Side ornaments
    parts.push(sph(0.04, GOLD, { ws: 4, hs: 3, x: -0.14, y: 0.9 }));
    parts.push(sph(0.04, GOLD, { ws: 4, hs: 3, x: 0.14, y: 0.9 }));

    // Sleeves (extended outward for puppet pose)
    parts.push(cyl(0.08, 0.1, 0.25, 5, ROBE, { x: -0.28, y: 0.45, rz: 0.8, hex2: ROBE_HI }));
    parts.push(cyl(0.08, 0.1, 0.25, 5, ROBE, { x: 0.28, y: 0.45, rz: -0.8, hex2: ROBE_HI }));

    // Hands
    parts.push(sph(0.05, FACE, { ws: 4, hs: 3, x: -0.42, y: 0.55 }));
    parts.push(sph(0.05, FACE, { ws: 4, hs: 3, x: 0.42, y: 0.55 }));

    return finish(parts);
  },
};

export default COL_BUDAIXI;
