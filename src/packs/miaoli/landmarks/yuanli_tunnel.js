/**
 * @file packs/miaoli/landmarks/yuanli_tunnel.js — Roll Formosa Miaoli pack.
 *
 * NM_YUANLI_RUSH — 苑裡藺草博物館 (Yuanli Rush Weaving Museum), dedicated to
 * the traditional craft of rush weaving (藺草編織) that made 苑裡鎮 famous.
 * The museum showcases the history of 大甲蓆/苑裡蓆 rush mat weaving, a craft
 * that dates back over 300 years. The building features traditional Hakka
 * architecture with a courtyard and displays of woven rush products.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Yuanli Rush Weaving Museum materials.
const BRICK = 0xa86040; // red brick walls
const BRICK_D = 0x884830; // darker brick
const RUSH = 0xc8b888; // rush/straw color (藺草)
const RUSH_D = 0xa89868; // darker rush
const WOOD = 0x8a6a40; // wooden beams and frames
const WOOD_D = 0x6a4a28; // darker wood
const TILE = 0x4a3a3a; // dark roof tile
const TILE_D = 0x2a2020; // deeper tile
const WHITE = 0xf0ece0; // whitewashed walls
const STONE = 0xb0a890; // stone courtyard
const STONE_D = 0x908870; // darker stone
const MAT = 0xd4c498; // woven rush mat (lighter)

export const NM_YUANLI_RUSH = {
  id: 'yuanli_rush_museum',
  name: '苑裡藺草博物館',
  dioramaRHint: 45, // ~ museum footprint radius in metres
  colorHex: 0xc8b888, // signature rush/straw color
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Stone courtyard base --------------------------------------------
    parts.push(
      box(3.2, 0.1, 2.2, STONE, { y: 0.05, hex2: STONE_D })
    );

    // ---- Main museum building (traditional Hakka architecture) -----------
    const baseY = 0.1;
    const buildingW = 2.2;
    const buildingD = 1.0;
    const buildingH = 0.7;

    // Building foundation
    parts.push(
      box(buildingW + 0.15, 0.1, buildingD + 0.1, BRICK_D, {
        y: baseY + 0.05,
        z: 0.3,
      })
    );

    // Main building walls (brick with whitewash upper portion)
    parts.push(
      box(buildingW, buildingH * 0.4, buildingD, BRICK, {
        y: baseY + 0.1 + buildingH * 0.2,
        z: 0.3,
        hex2: BRICK_D,
      })
    );
    parts.push(
      box(buildingW, buildingH * 0.6, buildingD, WHITE, {
        y: baseY + 0.1 + buildingH * 0.4 + buildingH * 0.3,
        z: 0.3,
        hex2: 0xe0d8c8,
      })
    );

    // Wooden window frames
    for (const dx of [-0.6, 0, 0.6]) {
      parts.push(
        box(0.25, 0.3, 0.04, WOOD, {
          x: dx,
          y: baseY + 0.1 + buildingH * 0.55,
          z: 0.3 - buildingD / 2 - 0.02,
          hex2: WOOD_D,
        })
      );
    }

    // Main entrance door
    parts.push(
      box(0.35, 0.5, 0.04, WOOD_D, {
        y: baseY + 0.1 + 0.25,
        z: 0.3 - buildingD / 2 - 0.02,
      })
    );

    // ---- Roof (traditional sloped tile roof) -----------------------------
    const roofY = baseY + 0.1 + buildingH;

    parts.push(
      box(buildingW + 0.35, 0.08, buildingD + 0.3, TILE, {
        y: roofY + 0.04,
        z: 0.3,
        hex2: TILE_D,
      })
    );

    // Sloped roof ridge
    parts.push(
      cone((buildingW + 0.2) / 2, 0.35, 4, TILE, {
        ry: HALF_PI / 2,
        y: roofY + 0.08 + 0.175,
        z: 0.3,
        hex2: TILE_D,
      })
    );

    // Roof ridge beam
    parts.push(
      box(buildingW + 0.1, 0.05, 0.08, WOOD, {
        y: roofY + 0.4,
        z: 0.3,
      })
    );

    // ---- Display area with rush weaving exhibits -------------------------
    // Display table with woven rush mats
    parts.push(
      box(0.8, 0.06, 0.5, WOOD, {
        x: -1.1,
        y: baseY + 0.03,
        z: -0.4,
        hex2: WOOD_D,
      })
    );

    // Rush mats on display (stacked)
    parts.push(
      box(0.6, 0.04, 0.4, MAT, {
        x: -1.1,
        y: baseY + 0.08,
        z: -0.4,
      })
    );
    parts.push(
      box(0.5, 0.03, 0.35, RUSH, {
        x: -1.1,
        y: baseY + 0.115,
        z: -0.4 + r,
      })
    );

    // ---- Rush grass bundles (藺草) drying racks --------------------------
    // Drying rack frame
    parts.push(
      cyl(0.03, 0.03, 0.5, 4, WOOD, {
        x: 1.0,
        y: baseY + 0.25,
        z: -0.5,
      })
    );
    parts.push(
      cyl(0.03, 0.03, 0.5, 4, WOOD, {
        x: 1.4,
        y: baseY + 0.25,
        z: -0.5,
      })
    );
    // Horizontal beam
    parts.push(
      box(0.5, 0.04, 0.04, WOOD, {
        x: 1.2,
        y: baseY + 0.48,
        z: -0.5,
      })
    );

    // Rush grass bundles hanging to dry
    for (let i = 0; i < 3; i++) {
      parts.push(
        cyl(0.05, 0.03, 0.3, 5, RUSH, {
          x: 1.05 + i * 0.15,
          y: baseY + 0.3,
          z: -0.5,
          hex2: RUSH_D,
        })
      );
    }

    // ---- Large decorative woven basket -----------------------------------
    parts.push(
      cyl(0.15, 0.12, 0.25, 8, RUSH, {
        x: 0.5,
        y: baseY + 0.125,
        z: -0.35,
        hex2: RUSH_D,
      })
    );

    // ---- Artisan weaving demonstration area ------------------------------
    // Low stool
    parts.push(
      cyl(0.1, 0.1, 0.12, 6, WOOD, {
        x: -0.2,
        y: baseY + 0.06,
        z: -0.6,
        hex2: WOOD_D,
      })
    );

    // Rush weaving frame
    parts.push(
      box(0.35, 0.25, 0.04, WOOD, {
        x: -0.2,
        y: baseY + 0.225,
        z: -0.45,
        hex2: WOOD_D,
      })
    );

    // ---- Museum signage --------------------------------------------------
    parts.push(
      box(0.6, 0.2, 0.04, MAT, {
        y: roofY - 0.15,
        z: 0.3 - buildingD / 2 - 0.05,
      })
    );

    return finish(parts);
  },
};

export default NM_YUANLI_RUSH;
