/**
 * @file packs/taoyuan/landmarks/tpe_terminal.js — Roll Formosa Taoyuan pack.
 *
 * 桃園國際機場第一航廈 (TPE Terminal 1) — Taiwan's main international airport,
 * opened in 1979. The terminal building features a distinctive curved roof
 * and modern glass facades. Terminal 1 handles a significant portion of
 * international flights and is an iconic gateway to Taiwan.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: white curved roof, glass curtain walls, grey tarmac.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const ROOF = 0xf0ece8; // white terminal roof
const GLASS = 0x88b8d8; // glass curtain walls
const STEEL = 0x7a8088; // steel structure
const TARMAC = 0x505458; // airport tarmac
const CONCRETE = 0xb0b0a8; // concrete apron

export const NM_TPE_TERMINAL = {
  id: 'tpe_terminal',
  name: '桃園機場航廈',
  landmarkId: 6, // large landmark
  dioramaRHint: 160, // ~180 m terminal building
  colorHex: GLASS,

  buildGeometry(rng) {
    const parts = [];

    // === MAIN TERMINAL BUILDING ==============================================
    // Long curved terminal hall
    parts.push(box(5.0, 1.2, 2.0, GLASS, { y: 0.6, hex2: 0xa8d0e8 }));

    // Curved roof (barrel vault)
    parts.push(cyl(1.4, 1.4, 5.2, 12, ROOF, {
      rx: HALF_PI,
      theta0: 0,
      thetaLen: PI,
      y: 1.5,
      hex2: 0xf8f4f0,
    }));

    // Steel structural ribs
    for (let i = 0; i < 6; i++) {
      parts.push(box(0.06, 1.3, 2.1, STEEL, { x: -2.2 + i * 0.88, y: 0.65 }));
    }

    // === DEPARTURE HALL FACADE ===============================================
    parts.push(box(4.6, 0.9, 0.12, 0x90c0e0, { y: 0.75, z: -1.0 })); // front glass

    // === JET BRIDGES =========================================================
    for (let i = 0; i < 4; i++) {
      const gx = -1.5 + i * 1.0;
      parts.push(box(0.25, 0.3, 1.0, CONCRETE, { x: gx, y: 0.45, z: 1.5 }));
      parts.push(box(0.3, 0.2, 0.3, 0x4a5058, { x: gx, y: 0.35, z: 2.05 })); // bridge end
    }

    // === CONTROL TOWER =======================================================
    parts.push(cyl(0.2, 0.15, 1.2, 6, CONCRETE, { x: 2.3, y: 1.8 }));
    parts.push(cyl(0.28, 0.25, 0.3, 8, 0x78a8c0, { x: 2.3, y: 2.55 })); // cab
    parts.push(cyl(0.04, 0.04, 0.5, 6, 0xd0d8e0, { x: 2.3, y: 2.95 })); // antenna

    // === APRON / TARMAC ======================================================
    parts.push(box(6.0, 0.08, 3.0, TARMAC, { y: 0.04, z: 2.5 }));
    // Taxiway markings
    parts.push(box(5.5, 0.02, 0.15, 0xe0e050, { y: 0.1, z: 2.0 }));

    // === TERMINAL SIGNAGE ====================================================
    parts.push(box(0.8, 0.25, 0.06, 0x3060a0, { y: 1.9, z: -1.0 })); // TPE sign

    // === PARKING STRUCTURE (foreground) ======================================
    parts.push(box(2.0, 0.5, 1.0, 0x909090, { x: -0.5, y: 0.25, z: -2.0, hex2: 0xa0a0a0 }));

    return finish(parts);
  },
};

export default NM_TPE_TERMINAL;
