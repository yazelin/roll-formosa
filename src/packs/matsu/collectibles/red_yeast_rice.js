/**
 * @file packs/matsu/collectibles/red_yeast_rice.js — Roll Formosa Matsu pack.
 *
 * 紅糟 (Red Yeast Paste) — code 73. A ceramic jar filled with vibrant red yeast
 * rice paste, a signature Matsu fermented product. Used in cooking aged wine
 * noodles, red yeast pork, and other Fuzhou-style dishes. The deep red color
 * is unmistakable — it gives Matsu cuisine its characteristic hue.
 *
 * <= 350 triangles.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

const JAR = 0xb5895c;        // ceramic jar (warm brown)
const JAR_HI = 0xd4a876;     // lighter top
const PASTE = 0x9c2a2a;      // deep red yeast paste
const PASTE_HI = 0xc43838;   // brighter highlights

export const COL_RED_YEAST_RICE = {
  id: 'red_yeast_rice',
  name: '紅糟',
  colorHex: 0x9c2a2a,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Jar body (wide belly)
    parts.push(sph(0.7, JAR, { ws: 8, hs: 5, sy: 0.9, y: 0.55, hex2: JAR_HI }));

    // Jar neck
    parts.push(cyl(0.38, 0.5, 0.35, 8, JAR, { y: 1.1, hex2: JAR_HI }));

    // Jar rim (lip)
    parts.push(cyl(0.44, 0.42, 0.08, 8, JAR_HI, { y: 1.28 }));

    // Jar base
    parts.push(cyl(0.42, 0.4, 0.12, 8, JAR, { y: 0.02 }));

    // Red yeast paste visible at top (filling the jar mouth)
    parts.push(cyl(0.34, 0.34, 0.1, 8, PASTE, { y: 1.18 }));

    // Paste surface with slight mound
    parts.push(sph(0.32, PASTE_HI, { ws: 6, hs: 3, sy: 0.35, y: 1.24 }));

    // Some paste dripping/smeared on the jar edge
    const jit = (rng() - 0.5) * 0.1;
    parts.push(sph(0.12, PASTE, { ws: 4, hs: 3, sy: 0.8, x: 0.36 + jit, y: 1.08, z: 0.1 }));

    return finish(parts);
  },
};

export default COL_RED_YEAST_RICE;
