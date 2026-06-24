/**
 * @file packs/nantou/landmarks/jiji_station.js — Roll Formosa Nantou pack, landmark 5.
 *
 * 集集車站 — Jiji Station, a historic Japanese colonial-era wooden railway
 * station on the Jiji Line. One of Taiwan's most beloved heritage stations.
 * Features:
 * - Japanese colonial wooden architecture
 * - Distinctive hip-and-gable roof with dark tiles
 * - Cream/white wooden walls with dark timber frame
 * - Platform canopy
 * - Vintage railway feel
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — Japanese colonial railway station
const WALL_CREAM = 0xf0e8d0;    // cream/white wooden walls
const TIMBER = 0x5a4030;        // dark timber frame/trim
const TIMBER_LIGHT = 0x7a6050;  // lighter timber
const ROOF_DARK = 0x3a3a3a;     // dark grey roof tiles
const ROOF_BROWN = 0x4a4040;    // brownish roof
const PLATFORM = 0x808080;      // concrete platform
const PLATFORM_EDGE = 0xc0b040; // yellow platform edge
const RAIL = 0x505050;          // railway tracks
const WOOD_FLOOR = 0xa08060;    // wooden floor/deck

export const NM_JIJI_STATION = {
  id: 'jiji_station',
  name: '集集車站',
  landmarkId: 5,
  dioramaRHint: 20, // station building ~40m
  colorHex: WALL_CREAM,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.004;
    const parts = [];

    /* ---- 1) Platform base ------------------------------------------------ */
    parts.push(box(2.8, 0.12, 1.2, PLATFORM, { y: 0.06 }));

    /* ---- 2) Main station building ---------------------------------------- */
    const bldgY = 0.12;
    // Main walls (Japanese colonial style - cream with timber frame)
    parts.push(box(1.3, 0.55, 0.7, WALL_CREAM, { y: bldgY + 0.355 }));
    // Timber frame - horizontal beam (top only)
    parts.push(box(1.35, 0.03, 0.72, TIMBER, { y: bldgY + 0.6 }));
    // Timber frame - vertical posts (reduced to 2)
    parts.push(box(0.04, 0.5, 0.03, TIMBER, { x: -0.4, y: bldgY + 0.37, z: 0.36 }));
    parts.push(box(0.04, 0.5, 0.03, TIMBER, { x: 0.4, y: bldgY + 0.37, z: 0.36 }));

    /* ---- 3) Hip-and-gable roof ------------------------------------------- */
    parts.push(cone(0.6, 0.32, 4, ROOF_DARK, { ry: PI / 4, y: bldgY + 0.8 + j, sx: 1.5, sz: 0.85 }));

    /* ---- 4) Platform canopy (待合所) -------------------------------------- */
    const canopyX = 1.0;
    parts.push(cyl(0.04, 0.04, 0.5, 5, TIMBER, { x: 0.8, y: bldgY + 0.37, z: 0.45 }));
    parts.push(box(0.8, 0.04, 0.5, ROOF_DARK, { x: canopyX, y: bldgY + 0.64, z: 0.4 }));

    /* ---- 5) Side waiting room / office ----------------------------------- */
    const sideX = -0.95;
    parts.push(box(0.5, 0.4, 0.5, WALL_CREAM, { x: sideX, y: bldgY + 0.32 }));
    parts.push(cone(0.38, 0.2, 4, ROOF_DARK, { x: sideX, ry: PI / 4, y: bldgY + 0.6 }));

    /* ---- 6) Railway tracks (simplified) ---------------------------------- */
    const trackZ = 0.85;
    parts.push(box(2.8, 0.03, 0.04, RAIL, { y: 0.015, z: trackZ - 0.06 }));
    parts.push(box(2.8, 0.03, 0.04, RAIL, { y: 0.015, z: trackZ + 0.06 }));

    return finish(parts);
  },
};

export default NM_JIJI_STATION;
