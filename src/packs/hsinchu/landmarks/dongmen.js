/**
 * @file packs/hsinchu/landmarks/dongmen.js — Roll Formosa Hsinchu pack.
 *
 * 東門城 (East Gate / Dongmen / Yingxi Gate). The only remaining gate of the
 * original Hsinchu city wall, built in 1829 during the Qing dynasty. A traditional
 * Chinese-style city gate with a two-tiered pagoda-style pavilion on top of a
 * stone archway base. Now sits in a traffic circle as a historic landmark.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — traditional Chinese city gate.
const STONE = 0x8a8075;      // weathered grey stone base
const STONE_D = 0x706860;    // darker stone shadow
const BRICK = 0xc4a880;      // tan/beige brick upper walls
const BRICK_D = 0xa08860;    // darker brick
const ROOF = 0x3a3835;       // dark grey traditional tile roof
const ROOF_D = 0x2a2825;     // roof shadow
const WOOD = 0x8b6b4a;       // wooden eaves / trim
const WOOD_D = 0x6b4b2a;     // darker wood
const RED = 0xb83830;        // red trim accent (traditional)
const ARCH = 0x4a4540;       // dark archway interior

export const NM_DONGMEN = {
  id: 'dongmen_gate',
  name: '東門城',
  landmarkId: 11,
  dioramaRHint: 28,
  colorHex: 0x8a8075, // weathered stone grey — the gate's aged appearance

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Traffic circle base (modern context) -----------------------------
    parts.push(cyl(1.3, 1.4, 0.08, 12, STONE_D, { y: 0.04 }));

    // ---- 2) Stone base platform (the old city wall remnant) ------------------
    const baseW = 1.1;
    const baseD = 0.9;
    const baseH = 0.35;
    parts.push(box(baseW, baseH, baseD, STONE_D, { y: 0.08 + baseH * 0.5, hex2: STONE }));

    // Stone molding at top of base
    parts.push(box(baseW + 0.04, 0.05, baseD + 0.04, STONE, { y: 0.08 + baseH }));

    // ---- 3) Central archway through the gate ---------------------------------
    const archY = 0.08;
    const archH = baseH * 0.85;
    // Dark interior of the arch
    parts.push(box(0.35, archH, baseD + 0.02, ARCH, { y: archY + archH * 0.5 }));
    // Arch opening (semi-circular top)
    parts.push(cyl(0.175, 0.175, baseD + 0.02, 6, ARCH, {
      y: archY + archH, rx: HALF_PI, thetaLen: PI
    }));

    // ---- 4) Upper pavilion structure (first tier) ----------------------------
    const pav1Y = 0.08 + baseH + 0.03;
    const pav1W = 0.9;
    const pav1D = 0.7;
    const pav1H = 0.28;

    // Wooden platform
    parts.push(box(pav1W + 0.06, 0.04, pav1D + 0.06, WOOD_D, { y: pav1Y }));

    // Brick walls
    parts.push(box(pav1W, pav1H, pav1D, BRICK_D, { y: pav1Y + pav1H * 0.5, hex2: BRICK }));

    // Red trim band
    parts.push(box(pav1W + 0.02, 0.03, pav1D + 0.02, RED, { y: pav1Y + pav1H }));

    // Wooden eaves support
    parts.push(box(pav1W + 0.15, 0.04, pav1D + 0.15, WOOD, { y: pav1Y + pav1H + 0.02 }));

    // ---- 5) First tier roof (traditional upturned eaves) ---------------------
    const roof1Y = pav1Y + pav1H + 0.04;
    // Main roof slopes
    for (const s of [-1, 1]) {
      parts.push(box(pav1W + 0.2, 0.04, pav1D * 0.52, ROOF, {
        rx: s * 0.5,
        y: roof1Y + 0.1,
        z: s * pav1D * 0.24,
        hex2: ROOF_D,
      }));
    }
    // Ridge beam
    parts.push(box(pav1W + 0.1, 0.03, 0.05, ROOF_D, { y: roof1Y + 0.16 }));

    // ---- 6) Second tier (smaller upper pavilion) -----------------------------
    const pav2Y = roof1Y + 0.18;
    const pav2W = 0.55;
    const pav2D = 0.45;
    const pav2H = 0.22;

    // Wooden platform
    parts.push(box(pav2W + 0.04, 0.03, pav2D + 0.04, WOOD_D, { y: pav2Y }));

    // Upper walls
    parts.push(box(pav2W, pav2H, pav2D, BRICK_D, { y: pav2Y + pav2H * 0.5, hex2: BRICK }));

    // Red trim
    parts.push(box(pav2W + 0.02, 0.025, pav2D + 0.02, RED, { y: pav2Y + pav2H }));

    // Eaves support
    parts.push(box(pav2W + 0.12, 0.03, pav2D + 0.12, WOOD, { y: pav2Y + pav2H + 0.015 }));

    // ---- 7) Second tier roof -------------------------------------------------
    const roof2Y = pav2Y + pav2H + 0.03;
    for (const s of [-1, 1]) {
      parts.push(box(pav2W + 0.15, 0.035, pav2D * 0.55, ROOF, {
        rx: s * 0.55,
        y: roof2Y + 0.08,
        z: s * pav2D * 0.22,
        hex2: ROOF_D,
      }));
    }
    // Ridge
    parts.push(box(pav2W + 0.06, 0.025, 0.04, ROOF_D, { y: roof2Y + 0.13 }));

    // ---- 8) Roof finial ------------------------------------------------------
    parts.push(cyl(0.02, 0.03, 0.06, 5, WOOD, { y: roof2Y + 0.16 }));
    parts.push(cone(0.04, 0.05, 5, ROOF_D, { y: roof2Y + 0.215 }));

    // ---- 9) Corner upturned eave decorations ---------------------------------
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        // First tier eave corners
        parts.push(cone(0.04, 0.06, 4, ROOF, {
          x: sx * (pav1W * 0.5 + 0.08),
          y: roof1Y + 0.06,
          z: sz * (pav1D * 0.5 + 0.06),
          rx: sz * 0.3,
          rz: -sx * 0.3,
        }));
      }
    }

    return finish(parts);
  },
};

export default NM_DONGMEN;
