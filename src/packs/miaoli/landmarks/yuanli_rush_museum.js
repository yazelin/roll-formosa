/**
 * @file packs/miaoli/landmarks/yuanli_rush_museum.js — Roll Formosa Miaoli pack.
 *
 * NM_YUANLI_RUSH_MUSEUM — 苑裡藺草博物館 (Yuanli Rush Grass Weaving Museum),
 * dedicated to the traditional craft of 藺草編織 (rush grass weaving) in 苑裡鎮.
 * Yuanli was historically Taiwan's center for rush grass cultivation and
 * weaving, producing 藺草帽 (rush hats) and 藺草蓆 (rush mats) since the
 * Japanese era. The museum showcases traditional weaving techniques and
 * the cultural heritage of this Hakka craft.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Yuanli Rush Museum materials.
const RUSH = 0xc8a860; // dried rush grass (藺草) tan color
const RUSH_D = 0xa88840; // darker rush shadow
const RUSH_L = 0xd8b870; // lighter rush highlight
const WOOD = 0x7a5a30; // wooden structure
const WOOD_D = 0x5a3a20; // darker wood
const TILE = 0x4a4040; // roof tile
const TILE_D = 0x2a2828; // darker tile
const WHITE = 0xf5f0e8; // whitewashed walls
const WHITE_D = 0xe0d8c8; // shadowed white
const GREEN = 0x6a8a50; // fresh rush grass (green)
const GREEN_D = 0x4a6a30; // darker green
const CONCRETE = 0xb8b0a0; // building foundation

export const NM_YUANLI_RUSH_MUSEUM = {
  id: 'yuanli_rush_museum',
  landmarkId: 6,
  name: '苑裡藺草博物館',
  dioramaRHint: 70, // ~ museum footprint radius in metres
  colorHex: 0xc8a860, // signature rush grass tan color
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Ground / courtyard ------------------------------------------------
    parts.push(
      box(3.5, 0.1, 2.4, CONCRETE, { y: 0.05, hex2: 0xa8a090 })
    );

    // ---- Main museum building ----------------------------------------------
    const baseY = 0.1;
    const buildingW = 2.2;
    const buildingD = 1.2;
    const buildingH = 0.85;

    // Building foundation
    parts.push(
      box(buildingW + 0.2, 0.12, buildingD + 0.2, CONCRETE, {
        y: baseY + 0.06,
        hex2: WHITE_D,
      })
    );

    // Main building body (whitewashed walls)
    parts.push(
      box(buildingW, buildingH, buildingD, WHITE, {
        y: baseY + 0.12 + buildingH / 2,
        hex2: WHITE_D,
      })
    );

    // Wooden window frames
    for (const dx of [-0.6, 0, 0.6]) {
      parts.push(
        box(0.25, 0.35, 0.04, WOOD, {
          x: dx,
          y: baseY + 0.12 + buildingH * 0.5,
          z: -buildingD / 2 - 0.02,
          hex2: WOOD_D,
        })
      );
    }

    // Entrance door
    parts.push(
      box(0.35, 0.5, 0.04, WOOD_D, {
        y: baseY + 0.12 + 0.25,
        z: -buildingD / 2 - 0.02,
      })
    );

    // ---- Traditional roof with wooden beams --------------------------------
    const roofY = baseY + 0.12 + buildingH;

    // Main roof slab
    parts.push(
      box(buildingW + 0.35, 0.07, buildingD + 0.3, TILE, {
        y: roofY + 0.035,
        hex2: TILE_D,
      })
    );

    // Sloped roof ridge
    parts.push(
      box(buildingW + 0.2, 0.3, 0.2, TILE, {
        y: roofY + 0.07 + 0.15,
        hex2: TILE_D,
      })
    );

    // Roof ridge beam
    parts.push(
      box(buildingW + 0.1, 0.04, 0.1, WOOD, {
        y: roofY + 0.35,
      })
    );

    // ---- Giant rush grass hat sculpture (藺草帽) ---------------------------
    // Display piece in the courtyard — iconic oversized woven hat
    const hatX = -1.3;
    const hatZ = 0.7;

    // Hat brim (wide, flat cone)
    parts.push(
      cone(0.5, 0.15, 8, RUSH, {
        x: hatX,
        y: baseY + 0.3,
        z: hatZ,
        hex2: RUSH_D,
      })
    );

    // Hat crown (dome)
    parts.push(
      cyl(0.25, 0.15, 0.25, 8, RUSH, {
        x: hatX,
        y: baseY + 0.4 + r,
        z: hatZ,
        hex2: RUSH_L,
      })
    );

    // Woven texture bands on hat
    parts.push(
      cyl(0.4, 0.4, 0.03, 8, RUSH_D, {
        x: hatX,
        y: baseY + 0.25,
        z: hatZ,
      })
    );

    // Display pedestal
    parts.push(
      box(0.4, 0.15, 0.4, CONCRETE, {
        x: hatX,
        y: baseY + 0.075,
        z: hatZ,
      })
    );

    // ---- Rush grass drying rack (曬藺草架) ---------------------------------
    const rackX = 1.2;

    // Rack frame posts
    for (const dz of [-0.3, 0.3]) {
      parts.push(
        cyl(0.03, 0.03, 0.7, 4, WOOD, {
          x: rackX,
          y: baseY + 0.35,
          z: dz,
        })
      );
    }

    // Crossbar
    parts.push(
      box(0.05, 0.05, 0.7, WOOD, {
        x: rackX,
        y: baseY + 0.68,
        z: 0,
      })
    );

    // Hanging rush grass bundles (drying)
    for (let i = 0; i < 4; i++) {
      const bz = -0.25 + i * 0.17;
      parts.push(
        cyl(0.04, 0.02, 0.35, 4, GREEN, {
          x: rackX,
          y: baseY + 0.48,
          z: bz,
          hex2: GREEN_D,
        })
      );
    }

    // ---- Fresh rush grass field (藺草田) -----------------------------------
    parts.push(
      box(0.8, 0.06, 0.6, 0x507030, {
        x: 1.4,
        y: baseY + 0.03,
        z: -0.6,
      })
    );

    // Rush grass plants (upright stalks)
    for (let i = 0; i < 6; i++) {
      const gx = 1.2 + (rng() - 0.5) * 0.5;
      const gz = -0.6 + (rng() - 0.5) * 0.4;
      parts.push(
        cyl(0.015, 0.01, 0.25 + rng() * 0.1, 4, GREEN, {
          x: gx,
          y: baseY + 0.15 + (rng() - 0.5) * 0.05,
          z: gz,
          hex2: GREEN_D,
        })
      );
    }

    // ---- Woven rush mats display -------------------------------------------
    // Rolled mat near entrance
    parts.push(
      cyl(0.08, 0.08, 0.4, 6, RUSH, {
        rx: HALF_PI,
        x: 0.5,
        y: baseY + 0.08,
        z: -buildingD / 2 - 0.25,
        hex2: RUSH_D,
      })
    );

    // Flat mat sample
    parts.push(
      box(0.5, 0.02, 0.35, RUSH_L, {
        x: -0.4,
        y: baseY + 0.06,
        z: -buildingD / 2 - 0.3,
      })
    );

    return finish(parts);
  },
};

export default NM_YUANLI_RUSH_MUSEUM;
