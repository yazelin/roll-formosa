/**
 * @file packs/matsu/landmarks/tianhou_temple.js — Roll Formosa Matsu pack.
 *
 * 境天后宮 (Jinghou Tianhou Temple). The main Mazu temple in Matsu, dedicated
 * to the sea goddess Mazu (媽祖) after whom the islands are named. Traditional
 * Fujian-style temple architecture with curved swallowtail roof ridges, red
 * columns, and ornate dragon decorations. The spiritual heart of Matsu.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — traditional Fujian temple colors.
const RED_PILLAR = 0xb22222; // traditional temple red columns
const RED_DARK = 0x8b1a1a; // darker red accents
const ROOF_GREY = 0x4a4a4a; // grey roof tiles
const ROOF_EDGE = 0x5a5a5a; // roof edge tiles
const GOLD = 0xdaa520; // gold ornaments
const WHITE = 0xf0f0e0; // white walls
const WOOD_DARK = 0x4a3020; // dark wood trim
const STONE = 0x808080; // stone platform

export const NM_TIANHOU_TEMPLE = {
  id: 'tianhou_temple',
  name: '境天后宮',
  landmarkId: 4,
  dioramaRHint: 18, // medium temple ~36m span
  colorHex: RED_PILLAR, // traditional temple red

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Stone platform base --------------------------------------------
    parts.push(box(1.8, 0.10, 1.4, STONE, { y: 0.05 }));
    parts.push(box(1.6, 0.08, 1.2, 0x909090, { y: 0.14 })); // upper platform

    // ---- 2) Main hall structure --------------------------------------------
    // White walls
    parts.push(box(1.2, 0.50, 0.8, WHITE, { y: 0.43, hex2: 0xe8e8d8 }));
    // Red trim band at top
    parts.push(box(1.25, 0.06, 0.85, RED_DARK, { y: 0.71 }));

    // ---- 3) Red pillars (front row) ----------------------------------------
    const pillarN = 4;
    for (let i = 0; i < pillarN; i++) {
      const x = (i - (pillarN - 1) / 2) * 0.35;
      parts.push(cyl(0.045, 0.05, 0.48, 6, RED_PILLAR, { x, y: 0.42, z: 0.42, hex2: RED_DARK }));
    }

    // ---- 4) Curved swallowtail roof (燕尾脊) --------------------------------
    // Main roof body - wide and curved
    parts.push(box(1.5, 0.08, 1.1, ROOF_GREY, { y: 0.78, hex2: ROOF_EDGE }));
    // Roof ridge
    parts.push(box(1.4, 0.05, 0.08, ROOF_EDGE, { y: 0.84 }));
    // Swallowtail tips (燕尾) - the curved upward-sweeping ends
    parts.push(cone(0.06, 0.18, 4, ROOF_GREY, { x: -0.72, y: 0.88, rz: -0.4 }));
    parts.push(cone(0.06, 0.18, 4, ROOF_GREY, { x: 0.72, y: 0.88, rz: 0.4 }));
    // Curved roof edges
    parts.push(box(0.08, 0.06, 1.0, ROOF_EDGE, { x: -0.72, y: 0.80, rz: 0.15 }));
    parts.push(box(0.08, 0.06, 1.0, ROOF_EDGE, { x: 0.72, y: 0.80, rz: -0.15 }));

    // ---- 5) Dragon ornaments on roof ridge ---------------------------------
    // Stylized dragon shapes
    parts.push(sph(0.06, GOLD, { ws: 5, hs: 4, x: -0.25, y: 0.90, sy: 0.6 }));
    parts.push(sph(0.06, GOLD, { ws: 5, hs: 4, x: 0.25, y: 0.90, sy: 0.6 }));
    // Central pagoda ornament
    parts.push(cyl(0.04, 0.05, 0.12, 6, GOLD, { y: 0.92 }));
    parts.push(cone(0.05, 0.08, 6, GOLD, { y: 1.00 }));

    // ---- 6) Temple entrance (dark doorway) ---------------------------------
    parts.push(box(0.22, 0.32, 0.04, WOOD_DARK, { y: 0.34, z: 0.42 }));
    // Door frame
    parts.push(box(0.28, 0.04, 0.06, RED_DARK, { y: 0.52, z: 0.42 }));

    // ---- 7) Incense burner in front ----------------------------------------
    parts.push(cyl(0.08, 0.10, 0.15, 6, 0x8b4513, { y: 0.25, z: 0.65 }));
    // Incense smoke (small wisps)
    parts.push(sph(0.03, 0xcccccc, { ws: 4, hs: 3, y: 0.38, z: 0.65 }));

    // ---- 8) Stone lions at entrance ----------------------------------------
    parts.push(sph(0.06, STONE, { ws: 5, hs: 4, x: -0.35, y: 0.21, z: 0.55, sy: 0.8 }));
    parts.push(sph(0.06, STONE, { ws: 5, hs: 4, x: 0.35, y: 0.21, z: 0.55, sy: 0.8 }));

    return finish(parts);
  },
};

export default NM_TIANHOU_TEMPLE;
