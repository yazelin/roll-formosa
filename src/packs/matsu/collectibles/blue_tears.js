/**
 * @file packs/matsu/collectibles/blue_tears.js — Roll Formosa Matsu pack.
 *
 * 藍眼淚 (Blue Tears) — code 75. The famous bioluminescent phenomenon that
 * lights up Matsu's coastline with ethereal blue glow, caused by dinoflagellates.
 * Represented as a swirling cluster of glowing blue particles rising from dark
 * water — the iconic natural wonder that draws visitors every spring/summer.
 *
 * <= 350 triangles.
 */

import { sph, cyl, finish, PI } from '../geomHelpers.js';

const WATER = 0x0a1628;      // dark sea water
const GLOW = 0x00b4ff;       // bright bioluminescent blue
const GLOW_HI = 0x4dd4ff;    // lighter glow
const GLOW_DIM = 0x0080c0;   // dimmer particles

export const COL_BLUE_TEARS = {
  id: 'blue_tears',
  name: '藍眼淚',
  colorHex: 0x00b4ff,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Dark water base (wave-like surface)
    parts.push(sph(0.8, WATER, { ws: 8, hs: 4, sy: 0.35, y: 0.15, thetaLen: PI * 0.6 }));
    parts.push(cyl(0.85, 0.85, 0.12, 10, WATER, { y: 0.02 }));

    // Bioluminescent particles rising from water
    // Main glow clusters
    parts.push(sph(0.25, GLOW, { ws: 5, hs: 4, x: 0.1, y: 0.35, z: 0.05, hex2: GLOW_HI }));
    parts.push(sph(0.2, GLOW_HI, { ws: 5, hs: 3, x: -0.2, y: 0.5, z: 0.15 }));
    parts.push(sph(0.22, GLOW, { ws: 5, hs: 4, x: 0.25, y: 0.55, z: -0.1, hex2: GLOW_HI }));

    // Scattered smaller particles
    for (let i = 0; i < 10; i++) {
      const angle = rng() * PI * 2;
      const r = 0.2 + rng() * 0.4;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = 0.25 + rng() * 0.6;
      const size = 0.06 + rng() * 0.1;
      const color = rng() > 0.5 ? GLOW : GLOW_DIM;
      parts.push(sph(size, color, { ws: 4, hs: 3, x, y, z, hex2: GLOW_HI }));
    }

    // Rising trail effect (elongated vertical particles)
    parts.push(sph(0.1, GLOW_HI, { ws: 4, hs: 3, sy: 2.0, x: 0, y: 0.7, z: 0 }));
    parts.push(sph(0.08, GLOW, { ws: 4, hs: 3, sy: 1.8, x: -0.15, y: 0.65, z: 0.12 }));
    parts.push(sph(0.09, GLOW_HI, { ws: 4, hs: 3, sy: 1.6, x: 0.18, y: 0.62, z: -0.08 }));

    return finish(parts);
  },
};

export default COL_BLUE_TEARS;
