/**
 * @file packs/penghu/collectibles/maokong_gondola.js — Roll Formosa Penghu pack.
 *
 * COL_STONE_HOUSE — 石頭屋 (traditional stone house). The iconic Penghu
 * architecture: houses built from local coral stone and basalt, with thick
 * walls to withstand strong winds. Silhouette: a small, squat rectangular
 * house with thick grey stone walls, a traditional red-tiled sloped roof,
 * small windows, and a wooden door. Often with a low stone wall surrounding
 * a small courtyard.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (thick walls, low profile, sloped
 * roof) carry the silhouette, not absolute size.
 *
 * Palette: grey coral stone walls, red/orange roof tiles, dark wood door,
 * small courtyard wall. rng only nudges tiny non-structural details.
 * <= 350 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const STONE = 0x8a8a82;      // grey coral stone walls
const STONE_DK = 0x6a6a62;   // darker stone (shadow/mortar)
const STONE_LT = 0xa0a098;   // lighter stone highlights
const ROOF = 0xb84830;       // traditional red roof tiles
const ROOF_DK = 0x983828;    // darker roof shadow
const WOOD = 0x5a4030;       // dark wood door
const WOOD_LT = 0x7a5a40;    // lighter wood trim
const GROUND = 0xc8b8a0;     // sandy courtyard ground

export const COL_STONE_HOUSE = {
  id: 'stone_house_col',
  name: '石頭屋',
  collectibleId: 10,
  colorHex: STONE, // grey stone — the body read color

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02; // tiny variation
    const parts = [];

    // === GROUND / COURTYARD BASE =============================================
    parts.push(box(2.2, 0.08, 1.8, GROUND, { y: -0.5 }));

    // === MAIN HOUSE BODY (thick stone walls) =================================
    // Core structure — wide, low, thick-walled
    const houseW = 1.4;
    const houseD = 1.1;
    const houseH = 0.7;

    parts.push(box(houseW, houseH, houseD, STONE, {
      y: houseH / 2 - 0.46,
      hex2: STONE_LT
    }));

    // === STONE TEXTURE (visible individual stones) ===========================
    // Horizontal mortar lines
    parts.push(box(houseW + 0.02, 0.03, 0.02, STONE_DK, { y: -0.25, z: houseD / 2 + 0.01 }));
    parts.push(box(houseW + 0.02, 0.03, 0.02, STONE_DK, { y: 0.0, z: houseD / 2 + 0.01 }));
    parts.push(box(0.02, 0.03, houseD + 0.02, STONE_DK, { y: -0.15, x: houseW / 2 + 0.01 }));

    // Stone block variations on front face
    const stones = [
      [-0.4, -0.35, 0.15, 0.18],
      [0.2, -0.3, 0.2, 0.16],
      [-0.2, -0.1, 0.18, 0.15],
      [0.35, -0.15, 0.16, 0.14],
      [-0.5, 0.05, 0.14, 0.12],
      [0.1, 0.0, 0.22, 0.14],
    ];
    for (const [sx, sy, sw, sh] of stones) {
      parts.push(box(sw, sh, 0.04, STONE_LT, {
        x: sx, y: sy, z: houseD / 2 + 0.02
      }));
    }

    // === SLOPED ROOF (traditional red tiles) =================================
    // Two-sided gabled roof
    const roofW = houseW + 0.15;
    const roofD = houseD + 0.1;
    const roofH = 0.4;

    // Roof slopes (using rotated boxes)
    parts.push(box(roofW, 0.08, roofD * 0.7, ROOF, {
      y: houseH / 2 - 0.46 + houseH / 2 + 0.1,
      z: roofD * 0.18,
      rx: -0.4,
      hex2: ROOF_DK
    }));
    parts.push(box(roofW, 0.08, roofD * 0.7, ROOF, {
      y: houseH / 2 - 0.46 + houseH / 2 + 0.1,
      z: -roofD * 0.18,
      rx: 0.4,
      hex2: ROOF_DK
    }));

    // Roof ridge (top beam)
    parts.push(box(roofW + 0.04, 0.06, 0.08, ROOF_DK, {
      y: houseH / 2 - 0.46 + houseH / 2 + 0.28
    }));

    // Gable ends (triangular wall sections under roof)
    parts.push(box(0.06, 0.3, roofD * 0.4, STONE, {
      x: houseW / 2,
      y: 0.2,
      hex2: STONE_LT
    }));
    parts.push(box(0.06, 0.3, roofD * 0.4, STONE, {
      x: -houseW / 2,
      y: 0.2,
      hex2: STONE_LT
    }));

    // === DOOR (dark wood, center front) ======================================
    parts.push(box(0.28, 0.45, 0.04, WOOD, {
      y: -0.23,
      z: houseD / 2 + 0.03,
      hex2: WOOD_LT
    }));
    // Door frame
    parts.push(box(0.32, 0.04, 0.05, WOOD_LT, { y: 0.0, z: houseD / 2 + 0.04 }));
    parts.push(box(0.04, 0.45, 0.05, WOOD_LT, { x: -0.14, y: -0.23, z: houseD / 2 + 0.04 }));
    parts.push(box(0.04, 0.45, 0.05, WOOD_LT, { x: 0.14, y: -0.23, z: houseD / 2 + 0.04 }));

    // === SMALL WINDOWS (one on each side) ====================================
    parts.push(box(0.15, 0.12, 0.04, WOOD, {
      x: 0.45, y: -0.1, z: houseD / 2 + 0.03
    }));
    parts.push(box(0.15, 0.12, 0.04, WOOD, {
      x: -0.45, y: -0.1, z: houseD / 2 + 0.03
    }));
    // Side window
    parts.push(box(0.04, 0.12, 0.15, WOOD, {
      x: houseW / 2 + 0.03, y: -0.1, z: 0
    }));

    // === COURTYARD WALL (low stone enclosure) ================================
    // Front wall with gap for entrance
    parts.push(box(0.6, 0.25, 0.1, STONE_DK, {
      x: -0.7, y: -0.38, z: 0.75, hex2: STONE
    }));
    parts.push(box(0.6, 0.25, 0.1, STONE_DK, {
      x: 0.7, y: -0.38, z: 0.75, hex2: STONE
    }));
    // Side walls
    parts.push(box(0.1, 0.25, 0.6, STONE_DK, {
      x: 0.95, y: -0.38, z: 0.4, hex2: STONE
    }));
    parts.push(box(0.1, 0.25, 0.6, STONE_DK, {
      x: -0.95, y: -0.38, z: 0.4, hex2: STONE
    }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_GONDOLA = COL_STONE_HOUSE;

export default COL_STONE_HOUSE;
