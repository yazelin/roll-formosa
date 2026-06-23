/**
 * @file packs/yunlin/collectibles/puppet.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_PUPPET — 布袋戲偶 (Glove Puppet). Yunlin is the heartland of Taiwanese budaixi
 * puppet theater. A traditional puppet figure with ornate costume, painted opera face,
 * and distinctive theatrical headdress.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const FACE = 0xf0d8c0;      // painted face
const ROBE = 0xc82838;      // red robe (different from budaixi)
const ROBE_HI = 0xe04858;   // robe highlight
const GOLD = 0xe8c030;      // gold trim
const HAIR = 0x1a1a1a;      // black hair/headdress
const SLEEVE = 0x2858a8;    // blue sleeves

export const COL_PUPPET = {
  id: 'puppet',
  name: '布袋戲偶',
  colorHex: 0xc82838,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Robe body (triangular shape for puppet)
    parts.push(cone(0.35, 0.6, 6, ROBE, { y: 0.3, hex2: ROBE_HI }));

    // Gold robe collar
    parts.push(cyl(0.2, 0.22, 0.08, 6, GOLD, { y: 0.6 }));

    // Face/head
    parts.push(sph(0.2, FACE, { ws: 6, hs: 5, y: 0.78, hex2: 0xf8e8d8 }));

    // Painted eyes (dramatic opera style)
    parts.push(box(0.08, 0.04, 0.02, 0x1a1a1a, { x: -0.07, y: 0.8, z: 0.17, ry: -0.15 }));
    parts.push(box(0.08, 0.04, 0.02, 0x1a1a1a, { x: 0.07, y: 0.8, z: 0.17, ry: 0.15 }));

    // Eyebrows (arched dramatically)
    parts.push(box(0.1, 0.02, 0.02, 0x1a1a1a, { x: -0.07, y: 0.85, z: 0.16, rz: 0.2 }));
    parts.push(box(0.1, 0.02, 0.02, 0x1a1a1a, { x: 0.07, y: 0.85, z: 0.16, rz: -0.2 }));

    // Red painted lips
    parts.push(box(0.06, 0.02, 0.02, 0xc83030, { y: 0.72, z: 0.18 }));

    // Headdress/crown
    parts.push(box(0.24, 0.12, 0.2, HAIR, { y: 0.95 + j }));
    parts.push(cone(0.08, 0.18, 4, GOLD, { y: 1.1 }));

    // Side ornaments on crown
    parts.push(sph(0.05, GOLD, { ws: 4, hs: 3, x: -0.15, y: 0.98 }));
    parts.push(sph(0.05, GOLD, { ws: 4, hs: 3, x: 0.15, y: 0.98 }));

    // Sleeves (blue, extended for puppet pose)
    parts.push(cyl(0.08, 0.1, 0.28, 5, SLEEVE, { x: -0.3, y: 0.48, rz: 0.7 }));
    parts.push(cyl(0.08, 0.1, 0.28, 5, SLEEVE, { x: 0.3, y: 0.48, rz: -0.7 }));

    // Hands
    parts.push(sph(0.05, FACE, { ws: 4, hs: 3, x: -0.46, y: 0.56 }));
    parts.push(sph(0.05, FACE, { ws: 4, hs: 3, x: 0.46, y: 0.56 }));

    return finish(parts);
  },
};

export default COL_PUPPET;
