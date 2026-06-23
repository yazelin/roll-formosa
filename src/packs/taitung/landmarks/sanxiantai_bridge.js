/**
 * @file packs/taitung/landmarks/sanxiantai_bridge.js — Roll Formosa hero landmark.
 *
 * NM_SANXIANTAI — 三仙台八拱橋, THE GOAL MONUMENT. Taitung's iconic eight-arch
 * pedestrian bridge connecting the mainland to Sanxiantai Island. The bridge
 * is a striking series of arched spans rising and falling like dragon humps
 * over the Pacific Ocean, painted in distinctive red-orange with white supports.
 * The arches rise progressively then descend, creating a dramatic silhouette
 * against the sea and sky.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Iconic red-orange bridge with white structural supports
const ORANGE = 0xe65c00; // bridge deck orange-red
const ORANGE_LO = 0xc04a00; // darker orange for shadows
const WHITE = 0xf5f5f0; // white structural supports
const RAIL = 0xd84a2a; // railing red
const CONCRETE = 0xc0b8a8; // concrete pier bases
const SEA = 0x2a6a8a; // sea color hint

export const NM_SANXIANTAI = {
  id: 'sanxiantai_bridge',
  name: '三仙台八拱橋',
  landmarkId: 8,
  dioramaRHint: 420, // hero diorama hint
  colorHex: ORANGE,

  buildGeometry(rng) {
    const parts = [];

    // Bridge spans horizontally across X-axis, arches rise in Y
    // Eight arches with varying heights, creating the iconic dragon-hump silhouette
    const archCount = 8;
    const spanWidth = 0.48; // width of each span
    const archHeights = [0.52, 0.72, 0.88, 1.0, 0.96, 0.82, 0.66, 0.48]; // dragon hump profile
    const deckThick = 0.08;

    // Starting X position (centered)
    const startX = -((archCount - 1) * spanWidth) / 2;

    // ---- Build each arch ----
    for (let i = 0; i < archCount; i++) {
      const cx = startX + i * spanWidth;
      const h = archHeights[i];
      const prevH = i > 0 ? archHeights[i - 1] : h * 0.6;
      const nextH = i < archCount - 1 ? archHeights[i + 1] : h * 0.6;

      // Arch top deck segment (orange)
      const deckY = h;
      parts.push(box(spanWidth + 0.06, deckThick, 0.38, ORANGE, {
        x: cx,
        y: deckY,
        hex2: ORANGE_LO,
      }));

      // White arch support (curved approximation with cylinders)
      // Main arch spans - approximated with angled supports
      const archBaseL = cx - spanWidth * 0.4;
      const archBaseR = cx + spanWidth * 0.4;

      // Left rising support
      if (i > 0) {
        const leftLeg = Math.min(h, prevH);
        parts.push(cyl(0.04, 0.04, leftLeg * 0.8, 4, WHITE, {
          x: archBaseL,
          y: leftLeg * 0.4,
          rz: 0.25,
        }));
      }

      // Right rising support
      if (i < archCount - 1) {
        const rightLeg = Math.min(h, nextH);
        parts.push(cyl(0.04, 0.04, rightLeg * 0.8, 4, WHITE, {
          x: archBaseR,
          y: rightLeg * 0.4,
          rz: -0.25,
        }));
      }

      // Vertical pier support from water level
      parts.push(cyl(0.06, 0.08, h - 0.15, 4, WHITE, {
        x: cx,
        y: (h - 0.15) / 2 + 0.05,
        hex2: CONCRETE,
      }));

      // (pier-base + railings removed to stay under heroTriCap 600 — same budget
      //  as 台北101; the 8-arch hump silhouette is what reads at finale scale)
    }


    // ---- Island at the far end (Sanxiantai) ----
    const islandX = startX + (archCount - 0.5) * spanWidth + 0.3;
    parts.push(sph(0.36, 0x5a6a4a, {
      ws: 5, hs: 4,
      sy: 0.5,
      x: islandX,
      y: 0.18,
      hex2: 0x4a5a3a,
    })); // green rocky island
    // Three rock pinnacles (the "three immortals" rocks)
    parts.push(sph(0.12, 0x6a6a60, { ws: 6, hs: 4, x: islandX - 0.12, y: 0.42, sy: 1.4 }));
    parts.push(sph(0.14, 0x5a5a56, { ws: 6, hs: 4, x: islandX + 0.08, y: 0.48, sy: 1.6 }));
    parts.push(sph(0.10, 0x7a7a70, { ws: 6, hs: 4, x: islandX + 0.20, y: 0.38, sy: 1.3 }));

    // ---- Mainland side ----
    const mainlandX = startX - 0.4;
    parts.push(box(0.5, 0.16, 0.6, CONCRETE, {
      x: mainlandX,
      y: 0.08,
      hex2: 0xa09888,
    })); // mainland platform

    return finish(parts);
  },
};

export default NM_SANXIANTAI;
