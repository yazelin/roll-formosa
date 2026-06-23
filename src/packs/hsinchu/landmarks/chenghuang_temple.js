/**
 * @file packs/hsinchu/landmarks/chenghuang_temple.js — Roll Formosa Hsinchu pack.
 *
 * 新竹城隍廟 (Hsinchu City God Temple). One of Taiwan's most famous temples,
 * established in 1748 during the Qing dynasty. Known for its elaborate facade,
 * multiple roofs with upturned eaves, and the famous night market surrounding it.
 * The temple is dedicated to the City God (城隍爺), who protects the city.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — traditional Taiwanese temple with elaborate colors.
const STONE = 0x8a8575;      // weathered stone foundation
const STONE_D = 0x706858;    // darker stone shadow
const WALL = 0xd4b090;       // warm temple wall (cream/tan)
const WALL_D = 0xb49070;     // darker wall shadow
const ROOF = 0x3a3530;       // dark temple roof tiles
const ROOF_D = 0x2a2520;     // darker roof
const RED = 0xc82020;        // temple red (pillars, trim)
const RED_D = 0xa81818;      // darker red
const GOLD = 0xd4a840;       // gold accents
const WOOD = 0x8b5a3a;       // wooden eaves
const WOOD_D = 0x6b3a1a;     // darker wood
const LANTERN = 0xff3020;    // red lanterns (signature of temple)
const GREEN = 0x2a6848;      // dragon/roof ornament green

export const NM_CHENGHUANG_TEMPLE = {
  id: 'chenghuang_temple',
  name: '新竹城隍廟',
  landmarkId: 0,              // Goal monument - special ID
  dioramaRHint: 45,           // Temple complex footprint ~45m
  colorHex: 0xc82020,         // Temple red — the iconic color

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Stone foundation platform --------------------------------------
    const baseW = 1.4;
    const baseD = 1.2;
    const baseH = 0.12;
    parts.push(box(baseW, baseH, baseD, STONE_D, { y: baseH * 0.5, hex2: STONE }));

    // Stone steps at front
    for (let i = 0; i < 3; i++) {
      const stepW = 0.5 - i * 0.04;
      parts.push(box(stepW, 0.03, 0.08, STONE, {
        y: 0.015 + i * 0.03,
        z: baseD * 0.5 + 0.04 + i * 0.07,
      }));
    }

    // ---- 2) Main temple building -------------------------------------------
    const mainY = baseH;
    const mainW = 1.2;
    const mainD = 0.9;
    const mainH = 0.45;

    // Main walls
    parts.push(box(mainW, mainH, mainD, WALL_D, { y: mainY + mainH * 0.5, hex2: WALL }));

    // Red pillars at front
    for (const x of [-0.35, -0.12, 0.12, 0.35]) {
      parts.push(cyl(0.04, 0.04, mainH, 6, RED_D, {
        x, y: mainY + mainH * 0.5, z: mainD * 0.5 + 0.02, hex2: RED,
      }));
    }

    // Entrance doors (dark recessed area)
    parts.push(box(0.2, mainH * 0.7, 0.05, WOOD_D, {
      y: mainY + mainH * 0.35, z: mainD * 0.5,
    }));

    // Gold door frame
    parts.push(box(0.24, mainH * 0.72, 0.02, GOLD, {
      y: mainY + mainH * 0.35, z: mainD * 0.5 + 0.025,
    }));

    // ---- 3) Wooden eaves and brackets --------------------------------------
    parts.push(box(mainW + 0.2, 0.04, mainD + 0.2, WOOD, { y: mainY + mainH }));
    parts.push(box(mainW + 0.25, 0.02, mainD + 0.25, WOOD_D, { y: mainY + mainH + 0.04 }));

    // ---- 4) Main roof (multi-layered temple roof) --------------------------
    const roof1Y = mainY + mainH + 0.05;

    // Roof ridges curving upward (front and back slopes)
    for (const s of [-1, 1]) {
      parts.push(box(mainW + 0.3, 0.06, mainD * 0.48, ROOF, {
        rx: s * 0.45,
        y: roof1Y + 0.15,
        z: s * mainD * 0.22,
        hex2: ROOF_D,
      }));
    }

    // Main ridge beam
    parts.push(box(mainW + 0.15, 0.05, 0.06, ROOF_D, { y: roof1Y + 0.26 }));

    // Ridge ornaments (simplified dragon/pagoda decorations)
    for (const x of [-0.5, 0, 0.5]) {
      parts.push(cone(0.04, 0.08, 5, GREEN, { x, y: roof1Y + 0.32 }));
    }

    // Central ridge pagoda finial
    parts.push(cyl(0.03, 0.04, 0.06, 5, GOLD, { y: roof1Y + 0.32 }));
    parts.push(cone(0.05, 0.1, 6, GOLD, { y: roof1Y + 0.40 }));

    // ---- 5) Side wing buildings (典型三開間格局) ----------------------------
    for (const sx of [-1, 1]) {
      const wingX = sx * 0.55;
      const wingW = 0.35;
      const wingD = 0.7;
      const wingH = 0.32;
      const wingY = baseH;

      // Wing wall
      parts.push(box(wingW, wingH, wingD, WALL_D, {
        x: wingX, y: wingY + wingH * 0.5, hex2: WALL,
      }));

      // Wing pillar
      parts.push(cyl(0.03, 0.03, wingH, 5, RED_D, {
        x: wingX, y: wingY + wingH * 0.5, z: wingD * 0.5, hex2: RED,
      }));

      // Wing eaves
      parts.push(box(wingW + 0.1, 0.03, wingD + 0.1, WOOD, {
        x: wingX, y: wingY + wingH,
      }));

      // Wing roof
      for (const sz of [-1, 1]) {
        parts.push(box(wingW + 0.12, 0.04, wingD * 0.45, ROOF, {
          x: wingX, y: wingY + wingH + 0.08, z: sz * wingD * 0.2,
          rx: sz * 0.4, hex2: ROOF_D,
        }));
      }
    }

    // ---- 6) Upturned corner eaves (traditional temple feature) -------------
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(cone(0.05, 0.08, 4, ROOF, {
          x: sx * (mainW * 0.5 + 0.12),
          y: roof1Y + 0.10,
          z: sz * (mainD * 0.5 + 0.08),
          rx: sz * 0.35,
          rz: -sx * 0.35,
        }));
      }
    }

    // ---- 7) Temple lanterns (red lanterns - iconic feature) ----------------
    for (const x of [-0.25, 0.25]) {
      // Lantern body
      parts.push(cyl(0.04, 0.03, 0.08, 6, LANTERN, {
        x, y: mainY + mainH - 0.1, z: mainD * 0.5 + 0.06,
      }));
      // Lantern tassel
      parts.push(cone(0.02, 0.03, 4, RED_D, {
        x, y: mainY + mainH - 0.17, z: mainD * 0.5 + 0.06, ry: PI,
      }));
      // Hanging wire
      parts.push(cyl(0.005, 0.005, 0.05, 3, WOOD_D, {
        x, y: mainY + mainH - 0.02, z: mainD * 0.5 + 0.06,
      }));
    }

    // ---- 8) Incense burner in front courtyard ------------------------------
    // Large bronze incense urn (classic temple feature)
    parts.push(cyl(0.08, 0.1, 0.12, 8, 0x8b7355, {
      y: baseH + 0.06, z: baseD * 0.5 + 0.25,
    }));
    // Incense sticks (simplified as small cylinders)
    for (let i = 0; i < 3; i++) {
      parts.push(cyl(0.005, 0.005, 0.08, 3, 0xff6040, {
        x: (i - 1) * 0.02, y: baseH + 0.16, z: baseD * 0.5 + 0.25,
      }));
    }

    // ---- 9) Stone lions (temple guardians) ---------------------------------
    for (const sx of [-1, 1]) {
      // Simplified sitting lion shape
      parts.push(box(0.06, 0.08, 0.05, STONE_D, {
        x: sx * 0.3, y: baseH + 0.04, z: baseD * 0.5 + 0.15, hex2: STONE,
      }));
      // Lion head
      parts.push(cyl(0.03, 0.035, 0.04, 5, STONE, {
        x: sx * 0.3, y: baseH + 0.10, z: baseD * 0.5 + 0.17,
      }));
    }

    return finish(parts);
  },
};

export default NM_CHENGHUANG_TEMPLE;
