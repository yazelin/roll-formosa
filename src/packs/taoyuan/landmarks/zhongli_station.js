/**
 * @file packs/taoyuan/landmarks/zhongli_station.js — Roll Formosa Taoyuan pack.
 *
 * 中壢車站 (Zhongli Station) — a major transportation hub in Taoyuan, serving
 * both TRA (Taiwan Railways) and the future MRT lines. The station building
 * features a modern curved roof design with glass curtain walls, representing
 * Taoyuan's role as a transportation gateway.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: steel grey structure, glass blue curtain walls, white roof.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const STEEL = 0x6a7078; // steel frame
const GLASS = 0x88b8d0; // glass curtain wall
const ROOF = 0xe8e4e0; // white curved roof
const PLATFORM = 0x8a8a88; // platform grey
const RAIL = 0x4a4a4a; // railway tracks

export const NM_ZHONGLI_STATION = {
  id: 'zhongli_station',
  name: '中壢車站',
  landmarkId: 2, // medium-small landmark
  dioramaRHint: 35, // ~40 m station building
  colorHex: STEEL,

  buildGeometry(rng) {
    const parts = [];

    // === MAIN STATION BUILDING ===============================================
    // Glass curtain wall body
    parts.push(box(3.2, 1.4, 1.6, GLASS, { y: 0.7, hex2: 0xa8d0e0 }));

    // Steel frame accents
    for (let i = 0; i < 4; i++) {
      parts.push(box(0.08, 1.5, 1.7, STEEL, { x: -1.2 + i * 0.8, y: 0.75 }));
    }

    // === CURVED ROOF =========================================================
    // Main curved roof (barrel vault style)
    parts.push(cyl(2.0, 2.0, 3.4, 12, ROOF, {
      rx: HALF_PI,
      theta0: 0,
      thetaLen: PI,
      y: 1.7,
      hex2: 0xf0ece8,
    }));

    // Roof edge trim
    parts.push(box(3.4, 0.08, 0.12, STEEL, { y: 1.7, z: 1.0 }));
    parts.push(box(3.4, 0.08, 0.12, STEEL, { y: 1.7, z: -1.0 }));

    // === PLATFORM CANOPY =====================================================
    // Extended canopy over the platform
    parts.push(box(4.0, 0.1, 1.2, ROOF, { y: 1.2, z: 1.4, hex2: 0xf0ece8 }));
    // Canopy supports
    for (let i = 0; i < 4; i++) {
      parts.push(cyl(0.06, 0.06, 1.1, 6, STEEL, { x: -1.4 + i * 0.93, y: 0.65, z: 1.4 }));
    }

    // === PLATFORM & TRACKS ===================================================
    parts.push(box(4.2, 0.15, 0.6, PLATFORM, { y: 0.08, z: 1.6 }));
    // Railway tracks
    for (const zOff of [2.0, 2.3]) {
      parts.push(box(4.5, 0.04, 0.08, RAIL, { y: 0.02, z: zOff }));
    }

    // === ENTRANCE PLAZA ======================================================
    parts.push(box(3.6, 0.08, 1.0, 0xb0b0a8, { y: 0.04, z: -1.2 }));

    // === STATION SIGN ========================================================
    parts.push(box(1.2, 0.3, 0.08, 0x2040a0, { y: 1.55, z: -0.85 })); // blue sign board

    return finish(parts);
  },
};

export default NM_ZHONGLI_STATION;
