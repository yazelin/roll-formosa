/**
 * @file packs/yunlin/landmarks/gukeng_coffee.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_GUKENG_COFFEE — 古坑咖啡園 (Gukeng Coffee Estate). Taiwan's premier coffee
 * growing region in the hills of Yunlin. Features a rustic coffee plantation
 * building with drying racks, coffee plants, and mountain atmosphere.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WOOD = 0x8a6a4a;        // rustic wood
const WOOD_HI = 0xa88a68;     // wood highlight
const ROOF = 0x5a4a3a;        // dark wood roof
const COFFEE = 0x4a3020;      // coffee bean brown
const LEAF = 0x3a6830;        // coffee plant green
const LEAF_HI = 0x4a7840;     // leaf highlight
const STONE = 0x787068;       // stone path

export const NM_GUKENG_COFFEE = {
  id: 'gukeng_coffee',
  name: '古坑咖啡園',
  landmarkId: 2,
  dioramaRHint: 46, // plantation estate
  colorHex: COFFEE,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Hillside base
    parts.push(box(4.0, 0.25, 3.5, 0x5a7848, { y: 0.125, sx: 1.1, hex2: 0x6a8858 }));
    // Terraced slope suggestion
    parts.push(box(3.5, 0.15, 1.2, 0x4a6838, { y: 0.35, z: -1.0 }));

    const baseY = 0.25;

    // Main coffee house / cafe building
    parts.push(box(1.6, 0.75, 1.2, WOOD, { x: -0.5, y: baseY + 0.375, hex2: WOOD_HI }));
    // Pitched roof
    parts.push(box(1.8, 0.08, 1.4, ROOF, { x: -0.5, y: baseY + 0.79 }));
    parts.push(box(1.5, 0.35, 1.1, ROOF, { x: -0.5, y: baseY + 1.0, sx: 0.7, hex2: 0x6a5a4a }));
    // Chimney
    parts.push(box(0.15, 0.3, 0.15, STONE, { x: -0.9, y: baseY + 1.2 }));

    // Veranda / porch
    parts.push(box(1.0, 0.06, 0.4, WOOD_HI, { x: -0.5, y: baseY + 0.03, z: 0.8 }));
    // Porch posts
    parts.push(cyl(0.04, 0.04, 0.5, 4, WOOD, { x: -0.9, y: baseY + 0.28, z: 0.85 }));
    parts.push(cyl(0.04, 0.04, 0.5, 4, WOOD, { x: -0.1, y: baseY + 0.28, z: 0.85 }));

    // Coffee drying racks
    const rackX = 1.1;
    parts.push(box(1.2, 0.06, 0.8, WOOD_HI, { x: rackX, y: baseY + 0.35, z: 0.2 }));
    // Rack legs
    for (const lx of [-0.45, 0.45]) {
      for (const lz of [-0.3, 0.3]) {
        parts.push(cyl(0.03, 0.03, 0.35, 4, WOOD, { x: rackX + lx, y: baseY + 0.175, z: 0.2 + lz }));
      }
    }
    // Coffee beans drying
    parts.push(box(0.9, 0.05, 0.6, COFFEE, { x: rackX, y: baseY + 0.4, z: 0.2 + j }));

    // Coffee plants (rows)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const px = -1.2 + col * 0.5;
        const pz = -0.8 - row * 0.45;
        // Bush
        parts.push(sph(0.18, LEAF, { ws: 4, hs: 3, x: px, y: baseY + 0.22, z: pz, sy: 0.8, hex2: LEAF_HI }));
        // Coffee cherries (red berries)
        if ((row + col) % 2 === 0) {
          parts.push(sph(0.04, 0xc83030, { ws: 3, hs: 2, x: px + 0.08, y: baseY + 0.28, z: pz }));
        }
      }
    }

    // Stone path
    parts.push(box(0.35, 0.06, 1.8, STONE, { x: 0.4, y: baseY + 0.03, z: 0.3 }));

    // Coffee cup sign
    parts.push(cyl(0.12, 0.14, 0.15, 6, 0xf8f0e0, { x: 0.5, y: baseY + 0.45, z: 1.2 }));
    parts.push(cyl(0.08, 0.1, 0.05, 6, COFFEE, { x: 0.5, y: baseY + 0.5, z: 1.2 }));

    return finish(parts);
  },
};

export default NM_GUKENG_COFFEE;
