/**
 * @file packs/matsu/collectibles/stone_house_model.js — Roll Formosa Matsu pack.
 *
 * 閩東石屋 (Mindong Stone House) — code 79. A miniature model of the traditional
 * Fuzhou-style stone houses unique to Matsu. Features granite walls, a distinctive
 * curved tile roof with upturned eaves, and small wooden windows. These
 * historic buildings define the village landscapes of Qinbi and other settlements.
 *
 * <= 350 triangles.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

const STONE = 0x7a7a72;      // granite gray
const STONE_HI = 0x9a9a90;   // lighter stone
const ROOF = 0x5a4030;       // dark brown tiles
const ROOF_HI = 0x7a5a42;    // lighter roof edge
const WOOD = 0x6b5040;       // wooden details
const WINDOW = 0x2a2a28;     // dark window openings

export const COL_STONE_HOUSE_MODEL = {
  id: 'stone_house_model',
  name: '閩東石屋',
  colorHex: 0x7a7a72,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Foundation/base
    parts.push(box(1.0, 0.08, 0.8, STONE, { y: 0.04 }));

    // Main stone walls (rectangular body)
    parts.push(box(0.9, 0.55, 0.7, STONE, { y: 0.355, hex2: STONE_HI }));

    // Stone texture accents (horizontal bands)
    parts.push(box(0.92, 0.03, 0.72, STONE_HI, { y: 0.25 }));
    parts.push(box(0.92, 0.03, 0.72, STONE_HI, { y: 0.45 }));

    // Wooden door frame
    parts.push(box(0.18, 0.35, 0.04, WOOD, { y: 0.26, z: 0.36 }));
    // Door opening
    parts.push(box(0.12, 0.28, 0.06, WINDOW, { y: 0.23, z: 0.37 }));

    // Windows (small rectangular openings)
    parts.push(box(0.12, 0.12, 0.04, WINDOW, { x: -0.28, y: 0.42, z: 0.36 }));
    parts.push(box(0.12, 0.12, 0.04, WINDOW, { x: 0.28, y: 0.42, z: 0.36 }));

    // Curved roof base
    parts.push(box(1.05, 0.08, 0.85, ROOF, { y: 0.67 }));

    // Roof ridge (curved upward at ends - Fuzhou style)
    parts.push(sph(0.5, ROOF, { ws: 8, hs: 3, sx: 1.15, sy: 0.22, sz: 0.9, y: 0.78, thetaLen: PI * 0.5, hex2: ROOF_HI }));

    // Upturned eaves at corners
    parts.push(sph(0.12, ROOF_HI, { ws: 4, hs: 3, sy: 0.6, x: 0.48, y: 0.72, z: 0.38 }));
    parts.push(sph(0.12, ROOF_HI, { ws: 4, hs: 3, sy: 0.6, x: -0.48, y: 0.72, z: 0.38 }));
    parts.push(sph(0.12, ROOF_HI, { ws: 4, hs: 3, sy: 0.6, x: 0.48, y: 0.72, z: -0.38 }));
    parts.push(sph(0.12, ROOF_HI, { ws: 4, hs: 3, sy: 0.6, x: -0.48, y: 0.72, z: -0.38 }));

    // Roof ridge decoration
    parts.push(cyl(0.04, 0.04, 0.95, 6, ROOF_HI, { y: 0.88, rx: PI / 2 }));

    return finish(parts);
  },
};

export default COL_STONE_HOUSE_MODEL;
