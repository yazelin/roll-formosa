/**
 * @file packs/pingtung/landmarks/fuan_temple.js — Roll Formosa Pingtung pack.
 *
 * 車城福安宮 (Checheng Fuan Temple, 車城 Checheng, 屏東).
 * One of the largest Mazu temples in Taiwan, famous for its "money-burning" furnace
 * and elaborate traditional architecture. Multi-tiered temple with ornate roofs,
 * bright red columns, and golden decorative elements.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Traditional Mazu temple (紅柱 + 綠瓦 + 金飾).
const RED = 0xb03020;        // temple red columns/walls
const RED_D = 0x8a2018;      // darker red
const TILE = 0x2a5a40;       // green glazed roof tiles
const TILE_D = 0x1a3a28;     // darker tile
const GOLD = 0xd4a030;       // golden decorations
const GOLD_D = 0xa08020;     // darker gold
const STONE = 0x9a9080;      // stone base
const WOOD = 0x5a3a20;       // wooden eaves

export const NM_FUAN_TEMPLE = {
  id: 'fuan_temple',
  name: '車城福安宮',
  dioramaRHint: 40,
  colorHex: 0xb03020,
  buildGeometry(rng) {
    const parts = [];

    // ---- Stone foundation platform ----
    parts.push(box(1.5, 0.1, 1.0, STONE, { y: 0.05 }));

    // ---- Main hall base ----
    parts.push(box(1.3, 0.5, 0.85, RED, { y: 0.1 + 0.25, hex2: RED_D }));

    // ---- Front columns ----
    for (let i = -2; i <= 2; i++) {
      parts.push(cyl(0.05, 0.06, 0.5, 8, RED, { x: i * 0.28, y: 0.1 + 0.25, z: 0.44 }));
    }

    // ---- Main roof (first tier, 歇山頂) ----
    parts.push(box(1.5, 0.06, 1.0, WOOD, { y: 0.6 }));
    parts.push(cone(0.0, 0.22, 4, TILE, { ry: HALF_PI / 2, y: 0.6 + 0.11, sx: 2.2, sz: 1.5, hex2: TILE_D }));
    // Ridge
    parts.push(box(1.1, 0.04, 0.04, GOLD, { y: 0.82 }));

    // ---- Second tier (smaller hall above) ----
    parts.push(box(0.8, 0.35, 0.55, RED, { y: 0.82 + 0.175, hex2: RED_D }));
    // Second tier columns
    parts.push(cyl(0.035, 0.04, 0.35, 6, RED, { x: -0.3, y: 1.0, z: 0.29 }));
    parts.push(cyl(0.035, 0.04, 0.35, 6, RED, { x: 0.3, y: 1.0, z: 0.29 }));

    // ---- Second roof tier ----
    parts.push(box(1.0, 0.05, 0.7, WOOD, { y: 1.17 }));
    parts.push(cone(0.0, 0.18, 4, TILE, { ry: HALF_PI / 2, y: 1.17 + 0.09, sx: 1.5, sz: 1.1, hex2: TILE_D }));
    // Ridge
    parts.push(box(0.7, 0.035, 0.035, GOLD, { y: 1.35 }));

    // ---- Top pagoda/finial ----
    parts.push(cyl(0.08, 0.1, 0.15, 6, RED, { y: 1.35 + 0.075 }));
    parts.push(cone(0.12, 0.12, 4, TILE, { ry: HALF_PI / 2, y: 1.5 + 0.06, hex2: TILE_D }));
    parts.push(sph(0.04, GOLD, { y: 1.62 }));

    // ---- Dragon decorations on roof ridges (simplified) ----
    parts.push(box(0.08, 0.06, 0.15, GOLD_D, { x: -0.5, y: 0.85, rz: 0.3 }));
    parts.push(box(0.08, 0.06, 0.15, GOLD_D, { x: 0.5, y: 0.85, rz: -0.3 }));

    // ---- Incense burner in front ----
    parts.push(cyl(0.08, 0.1, 0.12, 8, GOLD, { y: 0.06, z: 0.6 }));

    return finish(parts);
  },
};

export default NM_FUAN_TEMPLE;
