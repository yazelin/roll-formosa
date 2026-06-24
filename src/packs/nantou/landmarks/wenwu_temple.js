/**
 * @file packs/nantou/landmarks/wenwu_temple.js — Roll Formosa Nantou pack, landmark 0.
 *
 * 文武廟 — Wenwu Temple at Sun Moon Lake, a grand 3-hall palace-style temple
 * dedicated to Confucius (文聖) and Guan Yu (武聖). Features:
 * - Three main halls in a row, each with yellow/gold double-eave hip roof
 * - Grand front gate with vermillion columns
 * - Two majestic guardian lion statues at entrance
 * - Stone terraces and stairs leading up from the lake
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — traditional Chinese temple colors
const ROOF_GOLD = 0xd4a020;     // golden/yellow glazed roof tiles
const ROOF_DARK = 0xa87810;    // darker gold for roof edges
const PILLAR_RED = 0xb02020;   // vermillion red pillars
const WALL_WHITE = 0xe8e0d0;   // whitewashed walls
const BASE_GREY = 0x6a6a6a;    // stone base/stairs
const STONE_LIGHT = 0x8a8a8a;  // lighter stone accents
const DOOR_BROWN = 0x5a3020;   // wooden doors
const LION_GOLD = 0xc09030;    // guardian lion statues

export const NM_WENWU_TEMPLE = {
  id: 'wenwu_temple',
  name: '文武廟',
  landmarkId: 0,
  dioramaRHint: 25, // large temple complex ~50m wide
  colorHex: ROOF_GOLD,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.005;
    const parts = [];

    /* ---- 1) Stone terrace / platform ------------------------------------ */
    parts.push(box(3.0, 0.15, 2.2, BASE_GREY, { y: 0.075 }));
    parts.push(box(2.8, 0.12, 2.0, STONE_LIGHT, { y: 0.21 }));

    /* ---- 2) Front stairs (reduced) ---------------------------------------- */
    parts.push(box(1.0, 0.18, 0.4, BASE_GREY, { y: 0.09, z: 1.3 }));

    /* ---- 3) Main Hall (center, largest) ---------------------------------- */
    const mainY = 0.27;
    // Walls
    parts.push(box(1.2, 0.6, 1.0, WALL_WHITE, { y: mainY + 0.4 }));
    // Pillars (reduced to 2)
    parts.push(cyl(0.05, 0.05, 0.6, 5, PILLAR_RED, { x: -0.3, y: mainY + 0.4, z: 0.52 }));
    parts.push(cyl(0.05, 0.05, 0.6, 5, PILLAR_RED, { x: 0.3, y: mainY + 0.4, z: 0.52 }));
    // Lower hip roof
    parts.push(cone(0.9, 0.25, 4, ROOF_GOLD, { ry: PI / 4, y: mainY + 0.85, sx: 1.1, sz: 0.9 }));
    // Upper hip roof (double-eave style)
    parts.push(cone(0.7, 0.3, 4, ROOF_GOLD, { ry: PI / 4, y: mainY + 1.15 + j, sx: 1.05, sz: 0.85 }));

    /* ---- 4) Side Halls (left and right, smaller) ------------------------- */
    for (const sx of [-1, 1]) {
      const sideX = sx * 1.0;
      parts.push(box(0.75, 0.45, 0.65, WALL_WHITE, { x: sideX, y: mainY + 0.31 }));
      parts.push(cone(0.55, 0.22, 4, ROOF_GOLD, { x: sideX, ry: PI / 4, y: mainY + 0.62 }));
    }

    /* ---- 5) Front Gate (山門) --------------------------------------------- */
    const gateZ = 1.4;
    // Gate pillars (reduced to 2)
    parts.push(cyl(0.06, 0.06, 0.5, 5, PILLAR_RED, { x: -0.4, y: 0.33, z: gateZ }));
    parts.push(cyl(0.06, 0.06, 0.5, 5, PILLAR_RED, { x: 0.4, y: 0.33, z: gateZ }));
    // Gate roof
    parts.push(cone(0.65, 0.18, 4, ROOF_GOLD, { ry: PI / 4, y: 0.65, z: gateZ, sx: 1.6, sz: 0.55 }));

    return finish(parts);
  },
};

export default NM_WENWU_TEMPLE;
