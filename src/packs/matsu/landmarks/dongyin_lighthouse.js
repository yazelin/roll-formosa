/**
 * @file packs/matsu/landmarks/dongyin_lighthouse.js — Roll Formosa Matsu pack.
 *
 * 東引燈塔 (Dongyin Lighthouse / East Cliff Lighthouse). A historic white
 * lighthouse perched dramatically on a cliff on Dongyin Island. Built in 1904
 * during the Qing Dynasty, it features a cylindrical white tower with a red
 * lantern room at top, keeper's quarters, and sits on a scenic coastal cliff.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the historic lighthouse.
const WHITE = 0xf8f8f0; // lighthouse tower white
const WHITE_SHADOW = 0xe0e0d8; // shadowed white
const RED_LANTERN = 0xcc3333; // red lantern room
const GLASS = 0x8acce0; // lantern glass
const ROOF_DARK = 0x3a3a3a; // dark roof
const CLIFF_DARK = 0x5a5a5a; // dark cliff rock
const CLIFF_MID = 0x6a6a6a; // mid cliff
const GRASS = 0x4a6a3a; // cliff-top grass
const WATER = 0x2a5a7a; // ocean

export const NM_DONGYIN_LIGHTHOUSE = {
  id: 'dongyin_lighthouse',
  name: '東引燈塔',
  landmarkId: 6,
  dioramaRHint: 30, // lighthouse on cliff ~60m scene
  colorHex: WHITE, // distinctive white tower

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ocean base -----------------------------------------------------
    parts.push(box(2.2, 0.10, 2.2, WATER, { y: 0.05 }));

    // ---- 2) Dramatic cliff base --------------------------------------------
    // Main cliff mass - tall and steep
    parts.push(box(1.2, 0.70, 1.0, CLIFF_DARK, { y: 0.40, z: -0.3, hex2: CLIFF_MID }));
    // Cliff top plateau
    parts.push(box(1.3, 0.08, 1.1, GRASS, { y: 0.78, z: -0.3 }));
    // Cliff face variations
    parts.push(sph(0.3, CLIFF_MID, { ws: 5, hs: 4, x: -0.5, y: 0.35, z: 0.1, sy: 0.6, hex2: CLIFF_DARK }));
    parts.push(sph(0.25, CLIFF_DARK, { ws: 5, hs: 4, x: 0.45, y: 0.30, z: 0.15, sy: 0.5 }));

    // ---- 3) Lighthouse tower (the hero element) ----------------------------
    // Base platform
    parts.push(cyl(0.22, 0.24, 0.10, 8, WHITE_SHADOW, { y: 0.87, z: -0.2 }));
    // Main cylindrical tower - tapers slightly
    parts.push(cyl(0.12, 0.16, 0.55, 8, WHITE_SHADOW, { y: 1.15, z: -0.2, hex2: WHITE }));
    // Gallery deck below lantern room
    parts.push(cyl(0.18, 0.14, 0.04, 8, WHITE, { y: 1.44, z: -0.2 }));
    // Gallery railing
    parts.push(cyl(0.17, 0.17, 0.06, 8, 0xc0c0c0, { y: 1.48, z: -0.2, open: true }));

    // ---- 4) Lantern room (red with glass) ----------------------------------
    parts.push(cyl(0.10, 0.12, 0.12, 8, RED_LANTERN, { y: 1.56, z: -0.2 }));
    // Glass panels
    parts.push(cyl(0.09, 0.11, 0.10, 8, GLASS, { y: 1.56, z: -0.2 }));
    // Lantern room roof
    parts.push(cone(0.13, 0.10, 8, ROOF_DARK, { y: 1.66, z: -0.2 }));
    // Lightning rod / finial
    parts.push(cyl(0.01, 0.01, 0.12, 4, 0x808080, { y: 1.76, z: -0.2 }));
    // Light beacon (bright)
    parts.push(sph(0.03, 0xffff88, { ws: 5, hs: 4, y: 1.56, z: -0.2 }));

    // ---- 5) Keeper's quarters building -------------------------------------
    parts.push(box(0.35, 0.18, 0.25, WHITE_SHADOW, { x: -0.30, y: 0.91, z: -0.35, hex2: WHITE }));
    parts.push(box(0.38, 0.04, 0.28, ROOF_DARK, { x: -0.30, y: 1.02, z: -0.35 }));
    // Window
    parts.push(box(0.06, 0.06, 0.02, 0x303030, { x: -0.30, y: 0.90, z: -0.22 }));
    // Door
    parts.push(box(0.06, 0.10, 0.02, 0x4a3020, { x: -0.18, y: 0.87, z: -0.22 }));

    // ---- 6) Stone pathway to lighthouse ------------------------------------
    parts.push(box(0.12, 0.02, 0.4, 0x707070, { x: -0.05, y: 0.79, z: -0.05 }));

    // ---- 7) Cliff-top vegetation -------------------------------------------
    for (let i = 0; i < 5; i++) {
      const x = (rng() - 0.5) * 0.9;
      const z = -0.5 + rng() * 0.4;
      parts.push(sph(0.06 + rng() * 0.04, GRASS, { ws: 4, hs: 3, x, y: 0.82, z, sy: 0.4 }));
    }

    // ---- 8) Waves crashing at cliff base -----------------------------------
    parts.push(box(1.0, 0.03, 0.08, 0x99ccdd, { y: 0.12, z: 0.25 }));

    return finish(parts);
  },
};

export default NM_DONGYIN_LIGHTHOUSE;
