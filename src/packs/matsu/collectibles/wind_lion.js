/**
 * @file packs/matsu/collectibles/wind_lion.js — Roll Formosa Matsu pack.
 *
 * 風獅爺 (Wind Lion God) — code 76. Guardian lion statue found throughout
 * Matsu (and Kinmen), believed to ward off evil spirits and protect against
 * strong winds. A stout stone lion figure sitting upright with an expressive
 * face, often painted with bright colors (red, yellow, blue accents).
 *
 * <= 350 triangles.
 */

import { sph, box, cyl, cone, finish, PI } from '../geomHelpers.js';

const STONE = 0xa09080;      // weathered stone gray-brown
const STONE_HI = 0xc0b0a0;   // lighter highlights
const ACCENT = 0xc9463a;     // red paint accents
const EYES = 0x1a1a1a;       // dark eyes
const MANE = 0x8a7a6a;       // darker mane/fur detail

export const COL_WIND_LION = {
  id: 'wind_lion',
  name: '風獅爺',
  colorHex: 0xa09080,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Base pedestal
    parts.push(box(0.9, 0.15, 0.7, STONE, { y: 0.075, hex2: STONE_HI }));

    // Body (stout, sitting upright)
    parts.push(sph(0.5, STONE, { ws: 7, hs: 5, sx: 0.9, sy: 1.0, sz: 0.8, y: 0.55, hex2: STONE_HI }));

    // Head (large, expressive)
    parts.push(sph(0.42, STONE, { ws: 7, hs: 5, y: 1.1, hex2: STONE_HI }));

    // Mane (curly tufts around head)
    parts.push(sph(0.2, MANE, { ws: 5, hs: 3, x: -0.32, y: 1.2, z: -0.1 }));
    parts.push(sph(0.2, MANE, { ws: 5, hs: 3, x: 0.32, y: 1.2, z: -0.1 }));
    parts.push(sph(0.18, MANE, { ws: 5, hs: 3, x: 0, y: 1.4, z: -0.15 }));

    // Snout
    parts.push(sph(0.22, STONE_HI, { ws: 5, hs: 4, sx: 1.0, sy: 0.7, sz: 0.9, y: 1.0, z: 0.35 }));

    // Eyes (bulging, expressive)
    parts.push(sph(0.1, EYES, { ws: 4, hs: 3, x: -0.18, y: 1.18, z: 0.32 }));
    parts.push(sph(0.1, EYES, { ws: 4, hs: 3, x: 0.18, y: 1.18, z: 0.32 }));

    // Nose
    parts.push(box(0.1, 0.08, 0.08, ACCENT, { y: 1.02, z: 0.48 }));

    // Open mouth (red inside)
    parts.push(box(0.16, 0.08, 0.1, ACCENT, { y: 0.9, z: 0.42 }));

    // Front legs
    parts.push(cyl(0.14, 0.16, 0.35, 6, STONE, { x: -0.28, y: 0.32, z: 0.25, hex2: STONE_HI }));
    parts.push(cyl(0.14, 0.16, 0.35, 6, STONE, { x: 0.28, y: 0.32, z: 0.25, hex2: STONE_HI }));

    // Ears (small triangular)
    parts.push(cone(0.1, 0.18, 4, STONE_HI, { x: -0.28, y: 1.38, z: 0.05 }));
    parts.push(cone(0.1, 0.18, 4, STONE_HI, { x: 0.28, y: 1.38, z: 0.05 }));

    // Tail (curled up behind)
    parts.push(sph(0.12, STONE, { ws: 4, hs: 3, sy: 1.5, x: 0, y: 0.7, z: -0.4 }));

    return finish(parts);
  },
};

export default COL_WIND_LION;
