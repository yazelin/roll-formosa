/**
 * @file packs/taitung/landmarks/takeshi_tree.js — Roll Formosa Taitung pack, landmark 3.
 *
 * NM_TAKESHI_TREE — 金城武樹 (伯朗大道), the famous tree made iconic by actor
 * Takeshi Kaneshiro in a Mr. Brown Coffee commercial. A lone camphor tree
 * standing in the middle of golden rice paddies, a symbol of Taitung's rural beauty.
 */

import { box, cyl, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

const TRUNK = 0x5a4030; // tree trunk brown
const TRUNK_LO = 0x3a2a1a; // darker bark
const LEAVES = 0x3a6a2a; // deep green leaves
const LEAVES_LO = 0x2a5a1a; // shadow green
const PADDY = 0xb8a860; // golden rice paddy
const PADDY_LO = 0x8a7a40; // paddy shadow
const ROAD = 0x9a8a78; // country road

export const NM_TAKESHI_TREE = {
  id: 'takeshi_tree',
  name: '金城武樹',
  landmarkId: 3,
  dioramaRHint: 60,
  colorHex: LEAVES,

  buildGeometry(rng) {
    const parts = [];

    // Rice paddy field base
    parts.push(box(2.8, 0.1, 2.2, PADDY, { y: 0.05, hex2: PADDY_LO }));

    // Country road cutting through
    parts.push(box(2.8, 0.12, 0.4, ROAD, { y: 0.06, z: 0 }));

    // Tree trunk (sturdy camphor)
    parts.push(cyl(0.14, 0.18, 0.8, 8, TRUNK, { y: 0.5, hex2: TRUNK_LO }));
    // Branch spreading
    parts.push(cyl(0.08, 0.06, 0.4, 6, TRUNK, { x: 0.2, y: 0.8, rz: -0.8 }));
    parts.push(cyl(0.08, 0.06, 0.4, 6, TRUNK, { x: -0.2, y: 0.85, rz: 0.7 }));
    parts.push(cyl(0.06, 0.04, 0.3, 6, TRUNK, { z: 0.15, y: 0.9, rx: 0.6 }));

    // Lush canopy (multiple overlapping spheres for full coverage)
    parts.push(sph(0.7, LEAVES, { ws: 10, hs: 6, y: 1.3, hex2: LEAVES_LO }));
    parts.push(sph(0.5, LEAVES_LO, { ws: 8, hs: 5, x: 0.3, y: 1.1, z: 0.2 }));
    parts.push(sph(0.5, LEAVES, { ws: 8, hs: 5, x: -0.35, y: 1.2, z: -0.15 }));
    parts.push(sph(0.4, LEAVES_LO, { ws: 6, hs: 4, x: 0.1, y: 1.5, z: 0.1 }));

    // Small bench under tree (tourist photo spot)
    parts.push(box(0.35, 0.06, 0.12, 0x6a5040, { x: -0.25, y: 0.15, z: -0.35 }));
    parts.push(box(0.04, 0.1, 0.04, 0x5a4030, { x: -0.38, y: 0.08, z: -0.35 }));
    parts.push(box(0.04, 0.1, 0.04, 0x5a4030, { x: -0.12, y: 0.08, z: -0.35 }));

    // Rice paddy texture (small green bundles)
    for (let i = -3; i <= 3; i++) {
      for (const sz of [-0.7, 0.7]) {
        if (Math.abs(i) > 1 || Math.abs(sz) > 0.5) {
          parts.push(box(0.08, 0.06, 0.08, 0x6a8a40, {
            x: i * 0.32 + (Math.abs(sz) > 0.5 ? 0.16 : 0),
            y: 0.13,
            z: sz,
          }));
        }
      }
    }

    return finish(parts);
  },
};

export default NM_TAKESHI_TREE;
