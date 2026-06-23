/**
 * @file packs/pingtung/landmarks/hengchun_south_gate.js — Roll Formosa Pingtung pack.
 *
 * 恆春古城南門 (Hengchun South Gate, 恆春 Hengchun, 屏東).
 * Historic city gate from the Qing dynasty (1879), one of four surviving gates of
 * Hengchun Old Town. Features a red brick arched gateway with a two-story watchtower
 * above, topped with traditional Chinese green-tiled roof.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Qing dynasty city gate (紅磚 + 綠瓦).
const BRICK = 0xa05030;      // red brick walls
const BRICK_D = 0x7a3a22;    // darker brick shadow
const STONE = 0x8a8070;      // grey stone foundation/trim
const STONE_D = 0x6a6050;    // darker stone
const TILE = 0x3a6b50;       // green glazed roof tiles
const TILE_D = 0x2a4a38;     // darker tile
const WOOD = 0x5a4030;       // dark wooden beams/eaves
const ARCH = 0x3a3030;       // dark arch passage

export const NM_HENGCHUN_SOUTH_GATE = {
  id: 'hengchun_south_gate',
  name: '恆春古城南門',
  dioramaRHint: 25,
  colorHex: 0xa05030,
  buildGeometry(rng) {
    const parts = [];

    // ---- Stone foundation/platform ----
    parts.push(box(1.3, 0.15, 0.9, STONE, { y: 0.075, hex2: STONE_D }));

    // ---- Main gate wall (brick) ----
    parts.push(box(1.2, 0.55, 0.8, BRICK, { y: 0.15 + 0.275, hex2: BRICK_D }));

    // ---- Arched gateway passage (central) ----
    parts.push(box(0.35, 0.4, 0.82, ARCH, { y: 0.15 + 0.2 }));
    // Arch top (half cylinder)
    parts.push(cyl(0.175, 0.175, 0.82, 8, ARCH, { rz: HALF_PI, y: 0.55, theta0: 0, thetaLen: PI }));

    // ---- Watchtower base (brick) ----
    parts.push(box(0.9, 0.35, 0.6, BRICK, { y: 0.7 + 0.175, hex2: BRICK_D }));

    // ---- Watchtower windows (dark recesses) ----
    parts.push(box(0.12, 0.15, 0.05, WOOD, { x: -0.25, y: 0.9, z: 0.31 }));
    parts.push(box(0.12, 0.15, 0.05, WOOD, { x: 0.25, y: 0.9, z: 0.31 }));
    parts.push(box(0.12, 0.15, 0.05, WOOD, { x: -0.25, y: 0.9, z: -0.31 }));
    parts.push(box(0.12, 0.15, 0.05, WOOD, { x: 0.25, y: 0.9, z: -0.31 }));

    // ---- Traditional Chinese roof (歇山頂 hip-and-gable) ----
    // Main hip roof
    parts.push(cone(0.0, 0.25, 4, TILE, { ry: HALF_PI / 2, y: 1.05 + 0.125, sx: 1.8, sz: 1.2, hex2: TILE_D }));
    // Ridge decoration
    parts.push(box(0.8, 0.04, 0.05, TILE_D, { y: 1.22 }));
    // Eave overhang (wooden bracket simulation)
    parts.push(box(1.0, 0.04, 0.7, WOOD, { y: 1.05 }));

    // ---- Corner finials (roof ornaments) ----
    parts.push(cone(0.03, 0.08, 4, TILE, { x: 0.4, y: 1.12, z: 0.28 }));
    parts.push(cone(0.03, 0.08, 4, TILE, { x: -0.4, y: 1.12, z: 0.28 }));
    parts.push(cone(0.03, 0.08, 4, TILE, { x: 0.4, y: 1.12, z: -0.28 }));
    parts.push(cone(0.03, 0.08, 4, TILE, { x: -0.4, y: 1.12, z: -0.28 }));

    return finish(parts);
  },
};

export default NM_HENGCHUN_SOUTH_GATE;
