/**
 * @file packs/changhua/landmarks/jiuquxiang.js — Roll Formosa Changhua pack.
 *
 * 九曲巷 (Nine-Turn Lane). A famous winding alley in Lukang designed to block
 * the strong coastal winds (九降風). The alley zigzags through the old town,
 * with each turn creating a windbreak. Traditional brick walls line the
 * narrow passages, with the occasional glimpse of old shophouse courtyards.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, HALF_PI } from '../geomHelpers.js';

const BRICK = 0x9c5844;     // red brick wall
const BRICK_D = 0x784438;   // darker brick
const STONE = 0xa8a088;     // stone floor
const ROOF = 0x4a4240;      // dark roof tiles
const WOOD = 0x685038;      // wooden elements
const GREEN = 0x486844;     // moss/plants on old walls

export const NM_JIUQUXIANG = {
  id: 'jiuquxiang',
  name: '九曲巷',
  landmarkId: 10,
  dioramaRHint: 18,
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];
    const wallH = 1.0;
    const wallThick = 0.10;
    const pathW = 0.24;

    // Stone floor base for the winding path
    parts.push(box(2.0, 0.06, 2.0, STONE, { y: 0.03 }));

    // Create zigzag walls (九曲 = 9 turns)
    // Segment 1: North-South
    parts.push(box(wallThick, wallH, 0.50, BRICK, { x: -0.50, z: 0.75, y: wallH / 2 + 0.06, hex2: BRICK_D }));
    parts.push(box(wallThick, wallH, 0.50, BRICK, { x: -0.50 + pathW + wallThick, z: 0.75, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Segment 2: East-West turn
    parts.push(box(0.50, wallH, wallThick, BRICK, { x: -0.25, z: 0.50, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Segment 3: North-South
    parts.push(box(wallThick, wallH, 0.50, BRICK, { x: 0.10, z: 0.25, y: wallH / 2 + 0.06, hex2: BRICK_D }));
    parts.push(box(wallThick, wallH, 0.50, BRICK, { x: 0.10 + pathW + wallThick, z: 0.25, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Segment 4: East-West turn
    parts.push(box(0.45, wallH, wallThick, BRICK, { x: 0.35, z: 0.0, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Segment 5: North-South
    parts.push(box(wallThick, wallH, 0.50, BRICK, { x: 0.50, z: -0.25, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Segment 6: East-West turn
    parts.push(box(0.40, wallH, wallThick, BRICK, { x: 0.25, z: -0.50, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Segment 7: North-South
    parts.push(box(wallThick, wallH, 0.40, BRICK, { x: -0.10, z: -0.70, y: wallH / 2 + 0.06, hex2: BRICK_D }));

    // Outer perimeter walls (shophouse backs)
    parts.push(box(wallThick, wallH * 1.2, 1.8, BRICK_D, { x: -0.90, z: 0, y: wallH * 0.6 + 0.06 }));
    parts.push(box(wallThick, wallH * 1.2, 1.8, BRICK_D, { x: 0.90, z: 0, y: wallH * 0.6 + 0.06 }));

    // Roof overhangs along path
    for (const z of [0.60, -0.20, -0.70]) {
      parts.push(box(0.50, 0.04, 0.30, ROOF, { x: -0.30, z, y: wallH + 0.08 }));
    }
    for (const z of [0.30, -0.40]) {
      parts.push(box(0.50, 0.04, 0.30, ROOF, { x: 0.40, z, y: wallH + 0.08 }));
    }

    // Moss/plant accents on old walls
    parts.push(box(0.15, 0.08, 0.15, GREEN, { x: -0.50, z: 0.90, y: 0.10 }));
    parts.push(box(0.12, 0.06, 0.12, GREEN, { x: 0.50, z: -0.80, y: 0.10 }));

    // Small wooden door in wall
    parts.push(box(0.20, 0.50, 0.04, WOOD, { x: 0.10, z: 0.52, y: 0.31 }));

    return finish(parts);
  },
};

export default NM_JIUQUXIANG;
