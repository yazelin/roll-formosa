/**
 * @file packs/nantou/landmarks/xuanguang_temple.js — Roll Formosa Nantou pack, landmark 1.
 *
 * 玄光寺 — Xuanguang Temple at Sun Moon Lake, a small hillside temple
 * famous for housing the relics of Xuanzang (玄奘) temporarily before
 * they were moved to 玄奘寺. Features:
 * - Compact single-hall temple with orange/yellow roof
 * - Located on a scenic terrace overlooking the lake
 * - Traditional Chinese architectural style
 * - Famous "日月潭" stone marker nearby
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette
const ROOF_ORANGE = 0xd06820;  // orange glazed roof
const ROOF_DARK = 0xa04810;   // darker roof edges
const PILLAR_RED = 0xb82820;  // vermillion pillars
const WALL_CREAM = 0xf0e8d8;  // cream walls
const BASE_STONE = 0x787878;  // grey stone
const STONE_MARKER = 0x606060; // famous stone marker
const TEXT_RED = 0xc02020;    // red text on marker

export const NM_XUANGUANG_TEMPLE = {
  id: 'xuanguang_temple',
  name: '玄光寺',
  landmarkId: 1,
  dioramaRHint: 15, // smaller hillside temple ~30m
  colorHex: ROOF_ORANGE,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.005;
    const parts = [];

    /* ---- 1) Hillside terrace / platform ---------------------------------- */
    parts.push(box(2.2, 0.12, 1.8, BASE_STONE, { y: 0.06 }));
    parts.push(box(1.5, 0.1, 1.1, BASE_STONE, { y: 0.2 }));

    /* ---- 2) Main temple hall --------------------------------------------- */
    const hallY = 0.26;
    // Walls
    parts.push(box(0.95, 0.5, 0.75, WALL_CREAM, { y: hallY + 0.31 }));
    // Front pillars (reduced to 2)
    parts.push(cyl(0.045, 0.045, 0.5, 5, PILLAR_RED, { x: -0.3, y: hallY + 0.31, z: 0.4 }));
    parts.push(cyl(0.045, 0.045, 0.5, 5, PILLAR_RED, { x: 0.3, y: hallY + 0.31, z: 0.4 }));
    // Main roof (single-eave hip style)
    parts.push(cone(0.7, 0.28, 4, ROOF_ORANGE, { ry: PI / 4, y: hallY + 0.72 + j, sx: 1.0, sz: 0.8 }));

    /* ---- 3) Side wing (smaller) ------------------------------------------ */
    const wingX = 0.75;
    parts.push(box(0.4, 0.32, 0.4, WALL_CREAM, { x: wingX, y: hallY + 0.2 }));
    parts.push(cone(0.35, 0.16, 4, ROOF_ORANGE, { x: wingX, ry: PI / 4, y: hallY + 0.44 }));

    /* ---- 4) Stairs (simplified) ------------------------------------------ */
    parts.push(box(0.6, 0.18, 0.35, BASE_STONE, { y: 0.09, z: 1.1 }));

    /* ---- 5) Famous "日月潭" stone marker ---------------------------------- */
    const markerZ = 1.25;
    parts.push(box(0.25, 0.4, 0.1, STONE_MARKER, { y: 0.2, z: markerZ }));
    parts.push(box(0.18, 0.25, 0.02, TEXT_RED, { y: 0.2, z: markerZ + 0.06 }));

    return finish(parts);
  },
};

export default NM_XUANGUANG_TEMPLE;
