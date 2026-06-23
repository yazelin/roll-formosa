/**
 * @file packs/pingtung/landmarks/caesar_hotel.js — Roll Formosa Pingtung pack.
 *
 * 墾丁凱撒飯店 (Caesar Park Hotel Kenting, 恆春 Hengchun, 屏東).
 * Iconic 5-star resort hotel in Kenting, featuring a distinctive Spanish colonial
 * style architecture with white stucco walls, terracotta roofs, and palm-lined
 * entrance. One of Taiwan's most recognizable beach resort destinations.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Spanish colonial resort (白牆 + 紅瓦 + 棕櫚).
const WHITE = 0xf8f4e8;      // white stucco walls
const WHITE_D = 0xd8d4c8;    // shadow side
const TILE = 0xb86040;       // terracotta roof tiles
const TILE_D = 0x8a4830;     // darker tile
const BALCONY = 0xd0ccc0;    // balcony railings
const PALM_TRUNK = 0x7a6040; // palm tree trunk
const PALM_LEAF = 0x2a6830;  // palm fronds
const WINDOW = 0x4080a0;     // blue-tinted windows
const GOLD = 0xc8a030;       // golden accents

export const NM_CAESAR_HOTEL = {
  id: 'caesar_hotel',
  name: '墾丁凱撒飯店',
  dioramaRHint: 180,
  colorHex: 0xf8f4e8,
  buildGeometry(rng) {
    const parts = [];

    // ---- Ground/garden base ----
    parts.push(box(1.8, 0.06, 1.2, 0x4a8a40, { y: 0.03 }));

    // ---- Main building (central tower) ----
    parts.push(box(0.55, 0.9, 0.5, WHITE, { y: 0.06 + 0.45, hex2: WHITE_D }));
    // Windows grid (simplified)
    for (let floor = 0; floor < 5; floor++) {
      parts.push(box(0.45, 0.06, 0.02, WINDOW, { y: 0.2 + floor * 0.16, z: 0.26 }));
    }
    // Roof
    parts.push(cone(0.0, 0.2, 4, TILE, { ry: HALF_PI / 2, y: 0.96 + 0.1, sx: 1.6, sz: 1.4, hex2: TILE_D }));
    parts.push(box(0.58, 0.04, 0.52, TILE_D, { y: 0.96 }));

    // ---- Left wing ----
    parts.push(box(0.45, 0.65, 0.4, WHITE, { x: -0.45, y: 0.06 + 0.325, hex2: WHITE_D }));
    // Windows
    for (let floor = 0; floor < 4; floor++) {
      parts.push(box(0.35, 0.05, 0.02, WINDOW, { x: -0.45, y: 0.18 + floor * 0.14, z: 0.21 }));
    }
    // Balconies
    parts.push(box(0.48, 0.02, 0.08, BALCONY, { x: -0.45, y: 0.35, z: 0.25 }));
    parts.push(box(0.48, 0.02, 0.08, BALCONY, { x: -0.45, y: 0.55, z: 0.25 }));
    // Roof
    parts.push(cone(0.0, 0.15, 4, TILE, { ry: HALF_PI / 2, x: -0.45, y: 0.71 + 0.075, sx: 1.3, sz: 1.1, hex2: TILE_D }));

    // ---- Right wing ----
    parts.push(box(0.45, 0.65, 0.4, WHITE, { x: 0.45, y: 0.06 + 0.325, hex2: WHITE_D }));
    // Windows
    for (let floor = 0; floor < 4; floor++) {
      parts.push(box(0.35, 0.05, 0.02, WINDOW, { x: 0.45, y: 0.18 + floor * 0.14, z: 0.21 }));
    }
    // Balconies
    parts.push(box(0.48, 0.02, 0.08, BALCONY, { x: 0.45, y: 0.35, z: 0.25 }));
    parts.push(box(0.48, 0.02, 0.08, BALCONY, { x: 0.45, y: 0.55, z: 0.25 }));
    // Roof
    parts.push(cone(0.0, 0.15, 4, TILE, { ry: HALF_PI / 2, x: 0.45, y: 0.71 + 0.075, sx: 1.3, sz: 1.1, hex2: TILE_D }));

    // ---- Entrance portico ----
    parts.push(box(0.35, 0.25, 0.15, WHITE, { y: 0.06 + 0.125, z: 0.35, hex2: WHITE_D }));
    parts.push(box(0.38, 0.04, 0.18, TILE, { y: 0.31 + 0.02, z: 0.35 }));
    // Entrance columns
    parts.push(cyl(0.03, 0.035, 0.25, 8, WHITE_D, { x: -0.14, y: 0.06 + 0.125, z: 0.42 }));
    parts.push(cyl(0.03, 0.035, 0.25, 8, WHITE_D, { x: 0.14, y: 0.06 + 0.125, z: 0.42 }));
    // Golden door
    parts.push(box(0.1, 0.18, 0.02, GOLD, { y: 0.15, z: 0.43 }));

    // ---- Palm trees ----
    // Left palm
    parts.push(cyl(0.04, 0.05, 0.5, 6, PALM_TRUNK, { x: -0.75, y: 0.06 + 0.25, z: 0.4 }));
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * PI * 2;
      parts.push(cone(0.1, 0.25, 4, PALM_LEAF, { 
        x: -0.75 + Math.cos(angle) * 0.08, 
        y: 0.58, 
        z: 0.4 + Math.sin(angle) * 0.08,
        rx: 0.7,
        ry: angle
      }));
    }
    // Right palm
    parts.push(cyl(0.04, 0.05, 0.55, 6, PALM_TRUNK, { x: 0.75, y: 0.06 + 0.275, z: 0.4 }));
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * PI * 2 + 0.4;
      parts.push(cone(0.1, 0.25, 4, PALM_LEAF, { 
        x: 0.75 + Math.cos(angle) * 0.08, 
        y: 0.63, 
        z: 0.4 + Math.sin(angle) * 0.08,
        rx: 0.7,
        ry: angle
      }));
    }

    // ---- Swimming pool (front) ----
    parts.push(box(0.6, 0.04, 0.25, 0x40a0c0, { y: 0.06 + 0.02, z: 0.6 }));

    return finish(parts);
  },
};

export default NM_CAESAR_HOTEL;
