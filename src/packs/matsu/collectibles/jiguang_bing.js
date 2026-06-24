/**
 * @file packs/matsu/collectibles/jiguang_bing.js — Roll Formosa Matsu pack.
 *
 * 繼光餅 (Jiguang Biscuit) — code 72. A round baked biscuit with a distinctive
 * hole in the center. Named after General Qi Jiguang who supposedly strung these
 * on ropes for soldiers to carry. Golden-brown with sesame seeds, this savory
 * biscuit is a classic Matsu/Fuzhou snack often stuffed with braised pork.
 *
 * <= 350 triangles.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

const CRUST = 0xc9923a;      // golden-brown baked crust
const CRUST_HI = 0xdaa84c;   // lighter top
const SESAME = 0xf5e8c6;     // pale sesame seeds

export const COL_JIGUANG_BING = {
  id: 'jiguang_bing',
  name: '繼光餅',
  colorHex: 0xc9923a,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Main biscuit body (thick disc)
    parts.push(cyl(0.9, 0.9, 0.4, 12, CRUST, { y: 0.2, hex2: CRUST_HI }));

    // Slightly domed top
    parts.push(sph(0.88, CRUST_HI, { ws: 10, hs: 3, sy: 0.25, y: 0.4, thetaLen: PI * 0.5 }));

    // Central hole (darker inner edge)
    parts.push(cyl(0.22, 0.22, 0.5, 8, 0x8a6528, { y: 0.2, open: true }));

    // Sesame seeds scattered on top
    const seedY = 0.48;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * PI * 2 + rng() * 0.3;
      const r = 0.35 + rng() * 0.35;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      parts.push(sph(0.06, SESAME, { ws: 4, hs: 2, sy: 0.4, x, y: seedY, z }));
    }

    return finish(parts);
  },
};

export default COL_JIGUANG_BING;
