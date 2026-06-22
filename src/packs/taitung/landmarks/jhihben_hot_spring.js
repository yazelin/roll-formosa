/**
 * @file packs/taitung/landmarks/jhihben_hot_spring.js — Roll Formosa Taitung pack, landmark 7.
 *
 * NM_JHIHBEN — 知本溫泉, the famous Jhihben Hot Spring resort area, known for
 * its healing waters, luxury resort buildings, and lush forest setting in
 * the mountains of Taitung.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const POOL = 0x68a8b8; // hot spring pool water
const POOL_STEAM = 0xd0e8f0; // steam/mist
const STONE = 0x8a8878; // natural stone
const STONE_LO = 0x6a6858; // darker stone
const WOOD = 0x8a6a4a; // resort wood
const ROOF = 0x5a4a3a; // traditional roof
const BAMBOO = 0x7a9a5a; // bamboo/greenery
const RESORT = 0xe0d8c8; // resort building

export const NM_JHIHBEN = {
  id: 'jhihben_hot_spring',
  name: '知本溫泉',
  landmarkId: 7,
  dioramaRHint: 190,
  colorHex: POOL,

  buildGeometry(rng) {
    const parts = [];

    // Mountain backdrop base
    parts.push(box(2.8, 0.2, 2.4, 0x5a7a4a, { y: 0.1, hex2: 0x4a6a3a }));

    // Main hot spring pool (outdoor onsen style)
    parts.push(cyl(0.6, 0.6, 0.15, 12, STONE, { y: 0.25, hex2: STONE_LO }));
    parts.push(cyl(0.5, 0.5, 0.12, 12, POOL, { y: 0.26 }));
    // Steam effect (translucent spheres)
    parts.push(sph(0.25, POOL_STEAM, { ws: 6, hs: 4, y: 0.45, sz: 0.4 }));
    parts.push(sph(0.18, POOL_STEAM, { ws: 6, hs: 4, x: 0.15, y: 0.52, sz: 0.35 }));

    // Natural stone borders
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2;
      parts.push(sph(0.12 + (i % 2) * 0.04, STONE, {
        ws: 5, hs: 4,
        x: Math.cos(a) * 0.58,
        z: Math.sin(a) * 0.58,
        y: 0.26,
        sy: 0.6,
      }));
    }

    // Secondary pool
    parts.push(cyl(0.35, 0.35, 0.1, 10, STONE_LO, { x: -0.85, z: 0.3, y: 0.22 }));
    parts.push(cyl(0.28, 0.28, 0.08, 10, POOL, { x: -0.85, z: 0.3, y: 0.23 }));

    // Resort building
    parts.push(box(0.9, 0.6, 0.7, RESORT, { x: 0.8, z: -0.5, y: 0.5, hex2: WOOD }));
    parts.push(box(1.0, 0.08, 0.8, ROOF, { x: 0.8, z: -0.5, y: 0.84 }));
    parts.push(box(0.9, 0.06, 0.7, ROOF, { x: 0.8, z: -0.5, y: 0.9, hex2: 0x4a3a2a }));
    // Windows
    for (let i = 0; i < 3; i++) {
      parts.push(box(0.15, 0.2, 0.04, 0x4a6080, { x: 0.55 + i * 0.22, y: 0.5, z: -0.12 }));
    }

    // Wooden bath house
    parts.push(box(0.5, 0.4, 0.45, WOOD, { x: -0.7, z: -0.6, y: 0.4 }));
    parts.push(box(0.55, 0.06, 0.5, ROOF, { x: -0.7, z: -0.6, y: 0.64 }));

    // Bamboo/forest elements
    for (const pos of [[-1.1, 0.7], [1.1, 0.6], [-0.2, -0.9], [0.9, 0.7]]) {
      parts.push(cyl(0.04, 0.04, 0.6, 6, BAMBOO, { x: pos[0], z: pos[1], y: 0.5 }));
      parts.push(sph(0.15, 0x4a7a3a, { ws: 6, hs: 4, x: pos[0], z: pos[1], y: 0.85 }));
    }

    // Stone path
    for (let i = 0; i < 5; i++) {
      parts.push(box(0.18, 0.04, 0.22, STONE, {
        x: -0.1 + i * 0.2,
        y: 0.22,
        z: 0.75,
        ry: (i % 2 - 0.5) * 0.3,
      }));
    }

    return finish(parts);
  },
};

export default NM_JHIHBEN;
