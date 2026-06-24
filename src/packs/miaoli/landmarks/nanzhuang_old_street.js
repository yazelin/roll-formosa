/**
 * @file packs/miaoli/landmarks/nanzhuang_old_street.js — Roll Formosa Miaoli pack.
 *
 * NM_NANZHUANG_OLD_STREET — 南庄老街 (Nanzhuang Old Street), a classic Hakka
 * old street (桂花巷) in the mountain township of 南庄鄉. Famous for its
 * well-preserved wooden storefronts, red brick facades, and the iconic
 * 洗衫坑 (laundry canal). The narrow street features traditional two-story
 * shophouses with wooden balconies, selling 桂花釀 (osmanthus wine),
 * 客家擂茶 (Hakka pounded tea), and local crafts.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Nanzhuang Old Street materials (Hakka old street).
const BRICK = 0xa04030; // 紅磚 red brick facade
const BRICK_D = 0x802820; // darker brick shadow
const WOOD = 0x7a5820; // aged wooden storefronts / balconies
const WOOD_D = 0x5a3c15; // darker wood
const WOOD_L = 0x8a6830; // sunlit wood
const TILE = 0x4a4040; // dark roof tile
const TILE_D = 0x2a2828; // deeper tile shadow
const STONE = 0xb0a890; // stone street / canal edge
const STONE_D = 0x908870; // darker stone
const WATER = 0x4080a0; // 洗衫坑 canal water
const LANTERN = 0xd04040; // red lanterns
const WHITE = 0xf0ece0; // whitewashed walls / trim

export const NM_NANZHUANG = {
  id: 'nanzhuang_old_street',
  name: '南庄老街',
  dioramaRHint: 45, // ~ old street footprint radius in metres
  colorHex: 0xa04030, // signature red brick color
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Stone-paved street base -----------------------------------------
    parts.push(
      box(3.0, 0.1, 1.6, STONE, { y: 0.05, hex2: STONE_D })
    );

    // ---- 洗衫坑 laundry canal running along the street -------------------
    parts.push(
      box(2.8, 0.12, 0.2, WATER, { y: 0.04, z: 0.5 })
    );
    // Canal stone edges
    parts.push(
      box(2.9, 0.08, 0.06, STONE_D, { y: 0.08, z: 0.42 })
    );
    parts.push(
      box(2.9, 0.08, 0.06, STONE_D, { y: 0.08, z: 0.58 })
    );

    // ---- Row of shophouses (left side of street) -------------------------
    const shopW = 0.5;
    const shopH = 0.8;
    const shopD = 0.5;

    for (let i = 0; i < 4; i++) {
      const sx = -1.1 + i * 0.72;
      const isWood = i % 2 === 0;
      const wallColor = isWood ? WOOD : BRICK;
      const wallColorD = isWood ? WOOD_D : BRICK_D;

      // Ground floor shop front
      parts.push(
        box(shopW, shopH * 0.55, shopD, wallColor, {
          x: sx,
          y: 0.1 + shopH * 0.275,
          z: -0.45,
          hex2: wallColorD,
        })
      );

      // Second floor with wooden balcony
      parts.push(
        box(shopW, shopH * 0.45, shopD * 0.9, wallColor, {
          x: sx,
          y: 0.1 + shopH * 0.55 + shopH * 0.225,
          z: -0.45,
          hex2: WOOD_L,
        })
      );

      // Wooden balcony overhang
      parts.push(
        box(shopW * 1.1, 0.04, 0.15, WOOD, {
          x: sx,
          y: 0.1 + shopH * 0.55,
          z: -0.45 + shopD / 2 + 0.05,
        })
      );

      // Roof (sloped tile)
      parts.push(
        box(shopW * 1.15, 0.08, shopD * 1.1, TILE, {
          x: sx,
          y: 0.1 + shopH + 0.04,
          z: -0.45,
          hex2: TILE_D,
        })
      );

      // Shop entrance (dark opening)
      parts.push(
        box(shopW * 0.5, shopH * 0.4, 0.04, WOOD_D, {
          x: sx,
          y: 0.1 + shopH * 0.2,
          z: -0.45 + shopD / 2 + 0.02,
        })
      );
    }

    // ---- Shops on the other side (simpler representation) ----------------
    for (let i = 0; i < 3; i++) {
      const sx = -0.7 + i * 0.7;

      // Two-story shophouse
      parts.push(
        box(0.55, shopH, 0.4, BRICK, {
          x: sx,
          y: 0.1 + shopH / 2,
          z: 0.75,
          hex2: BRICK_D,
        })
      );

      // Roof
      parts.push(
        box(0.65, 0.08, 0.5, TILE, {
          x: sx + r,
          y: 0.1 + shopH + 0.04,
          z: 0.75,
          hex2: TILE_D,
        })
      );
    }

    // ---- Red lanterns hanging across the street --------------------------
    for (let i = 0; i < 3; i++) {
      const lx = -0.7 + i * 0.7;
      // Lantern string
      parts.push(
        box(0.02, 0.5, 0.02, WOOD_D, {
          x: lx,
          y: 0.1 + shopH + 0.25,
          z: 0.1,
        })
      );
      // Red lantern
      parts.push(
        cyl(0.08, 0.08, 0.15, 6, LANTERN, {
          x: lx,
          y: 0.1 + shopH + 0.1,
          z: 0.1,
        })
      );
    }

    // ---- Street details (barrels, signs) ---------------------------------
    parts.push(
      cyl(0.08, 0.1, 0.15, 6, WOOD, {
        x: 0.8,
        y: 0.175,
        z: 0.15,
        hex2: WOOD_D,
      })
    );

    return finish(parts);
  },
};

export default NM_NANZHUANG;
