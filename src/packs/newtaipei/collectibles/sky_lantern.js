/**
 * @file packs/newtaipei/collectibles/sky_lantern.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_SKY_LANTERN — 天燈 (Sky Lantern). The iconic Pingxi/Shifen experience:
 * a large paper lantern with wishes written on it, released to float up into
 * the sky. Features the traditional barrel shape with a wire frame at the
 * bottom holding the fuel source, and colorful paper panels.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const PAPER_RED = 0xe84040;   // red paper (most common)
const PAPER_GOLD = 0xffd040;  // gold/yellow paper
const PAPER_PINK = 0xf090a0;  // pink paper
const WIRE = 0x4a4a4a;        // wire frame
const FIRE = 0xffa840;        // fire glow

export const COL_SKY_LANTERN = {
  id: 'sky_lantern',
  name: '天燈',
  colorHex: PAPER_RED, // red paper read color

  buildGeometry(rng) {
    // Random color variation
    const colors = [PAPER_RED, PAPER_GOLD, PAPER_PINK];
    const mainColor = colors[Math.floor(rng() * colors.length)];
    const parts = [];

    // ---- 1) Main paper body (barrel shape) -----------------------------
    // Lantern is wider at middle, tapers at top and bottom
    parts.push(cyl(0.5, 0.6, 0.4, 8, mainColor, { y: 0.2 })); // bottom section
    parts.push(cyl(0.6, 0.65, 0.5, 8, mainColor, { y: 0.65, hex2: 0xffeedd })); // middle (widest)
    parts.push(cyl(0.65, 0.5, 0.4, 8, mainColor, { y: 1.1 })); // upper section
    parts.push(cyl(0.5, 0.35, 0.25, 8, mainColor, { y: 1.45 })); // top taper
    parts.push(cyl(0.35, 0.2, 0.15, 8, mainColor, { y: 1.67 })); // top opening

    // ---- 2) Opening at top ---------------------------------------------
    parts.push(cyl(0.22, 0.18, 0.05, 8, 0x3a3a3a, { y: 1.78 })); // dark opening
    // Wire ring at top
    parts.push(cyl(0.24, 0.24, 0.03, 8, WIRE, { y: 1.76, open: true }));

    // ---- 3) Wire frame at bottom (holds fuel) --------------------------
    // Cross wire frame
    parts.push(box(0.8, 0.02, 0.04, WIRE, { y: 0.05 }));
    parts.push(box(0.04, 0.02, 0.8, WIRE, { y: 0.05 }));
    // Corner attachment wires going up to lantern edge
    for (const x of [-0.35, 0.35]) {
      for (const z of [-0.35, 0.35]) {
        parts.push(cyl(0.015, 0.015, 0.15, 4, WIRE, {
          x: x * 0.7, y: 0.1, z: z * 0.7,
          rx: x > 0 ? 0.2 : -0.2,
          rz: z > 0 ? -0.2 : 0.2,
        }));
      }
    }

    // ---- 4) Fuel source and fire glow ----------------------------------
    // Fuel pad (soaked in kerosene)
    parts.push(box(0.2, 0.04, 0.2, 0x4a3a2a, { y: 0.08 }));
    // Fire glow
    parts.push(sph(0.1, FIRE, { ws: 6, hs: 4, y: 0.15 }));
    parts.push(sph(0.06, 0xffdd88, { ws: 4, hs: 3, y: 0.18 })); // bright center

    // ---- 5) Written wishes (simplified as dark lines) ------------------
    // Vertical "writing" on one panel
    for (let i = 0; i < 3; i++) {
      parts.push(box(0.04, 0.25, 0.02, 0x2a2a2a, {
        x: -0.1 + i * 0.1,
        y: 0.7,
        z: 0.62,
      }));
    }

    return finish(parts);
  },
};

export default COL_SKY_LANTERN;
