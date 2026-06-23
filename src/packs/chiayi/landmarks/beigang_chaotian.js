/**
 * @file packs/chiayi/landmarks/beigang_chaotian.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_BEIGANG_CHAOTIAN — 北港朝天宮 (Beigang Chaotian Temple). One of Taiwan's most
 * important Mazu temples, featuring ornate traditional temple architecture with
 * multi-tiered swallowtail roofs, intricate dragon decorations, and red pillars.
 * Though technically in Yunlin, it's a major religious destination for Chiayi area.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const ROOF_GOLD = 0xc8a030;   // golden temple roof
const ROOF_HI = 0xe8c850;     // roof highlight
const PILLAR = 0xb82020;      // red temple pillar
const WALL = 0xe8d8c0;        // cream temple wall
const DRAGON = 0x28a848;      // green dragon
const LANTERN = 0xd82828;     // red lantern

export const NM_BEIGANG_CHAOTIAN = {
  id: 'beigang_chaotian',
  name: '北港朝天宮',
  landmarkId: 6,
  dioramaRHint: 55, // large temple complex
  colorHex: ROOF_GOLD,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Temple platform
    parts.push(box(3.5, 0.2, 2.8, 0x888078, { y: 0.1 }));

    // Main hall base
    const mainY = 0.2;
    parts.push(box(2.4, 0.8, 1.8, WALL, { y: mainY + 0.4, hex2: 0xf0e8d8 }));

    // Red pillars at front
    for (const px of [-0.9, -0.3, 0.3, 0.9]) {
      parts.push(cyl(0.08, 0.09, 0.85, 6, PILLAR, { x: px, y: mainY + 0.525, z: 0.95 }));
    }

    // Main roof - swallowtail style (燕尾脊)
    parts.push(box(2.8, 0.12, 2.1, ROOF_GOLD, { y: mainY + 0.95, hex2: ROOF_HI }));
    // Curved roof body
    parts.push(box(2.5, 0.35, 1.8, ROOF_GOLD, { y: mainY + 1.2, sx: 0.95, hex2: ROOF_HI }));
    // Ridge beam
    parts.push(box(2.6, 0.12, 0.15, ROOF_HI, { y: mainY + 1.4 }));

    // Swallowtail tips (curved roof ends)
    for (const rx of [-1.25, 1.25]) {
      parts.push(cone(0.12, 0.25, 4, ROOF_GOLD, {
        x: rx, y: mainY + 1.35, ry: (rx > 0 ? -1 : 1) * 0.4 + PI / 4,
        sz: 0.5, hex2: ROOF_HI
      }));
    }

    // Dragon decorations on roof ridge
    for (const dx of [-0.6, 0.6]) {
      parts.push(cyl(0.06, 0.04, 0.28, 5, DRAGON, {
        x: dx, y: mainY + 1.52, rz: (dx > 0 ? -1 : 1) * 0.5, hex2: 0x38b858
      }));
    }
    // Central pagoda finial
    parts.push(cyl(0.08, 0.1, 0.18, 6, ROOF_HI, { y: mainY + 1.55 }));
    parts.push(sph(0.07, ROOF_GOLD, { ws: 5, hs: 3, y: mainY + 1.68 + j }));

    // Front entrance gate/archway
    parts.push(box(1.6, 0.6, 0.2, WALL, { y: mainY + 0.5, z: 1.3 }));
    parts.push(box(0.5, 0.5, 0.22, 0x2a2828, { y: mainY + 0.45, z: 1.3 })); // entrance opening

    // Side buildings (wings)
    for (const sx of [-1.45, 1.45]) {
      parts.push(box(0.8, 0.55, 1.2, WALL, { x: sx, y: mainY + 0.375, hex2: 0xf0e8d8 }));
      parts.push(box(0.95, 0.1, 1.4, ROOF_GOLD, { x: sx, y: mainY + 0.7, hex2: ROOF_HI }));
      parts.push(cone(0.5, 0.28, 4, ROOF_GOLD, { x: sx, y: mainY + 0.92, ry: PI / 4, sz: 0.8 }));
    }

    // Hanging lanterns
    for (const lx of [-0.5, 0.5]) {
      parts.push(sph(0.1, LANTERN, { ws: 6, hs: 4, x: lx, y: mainY + 0.7, z: 1.0, sy: 1.3 }));
    }

    // Incense burner in courtyard
    parts.push(cyl(0.18, 0.22, 0.35, 8, 0x8a7a60, { y: mainY + 0.275, z: 0.5 }));
    parts.push(cyl(0.06, 0.04, 0.2, 4, 0x888888, { y: mainY + 0.55, z: 0.5 })); // incense sticks

    return finish(parts);
  },
};

export default NM_BEIGANG_CHAOTIAN;
