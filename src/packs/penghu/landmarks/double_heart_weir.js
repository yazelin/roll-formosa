/**
 * @file packs/penghu/landmarks/double_heart_weir.js — Roll Formosa Penghu pack, landmark 0.
 *
 * NM_DOUBLE_HEART — 雙心石滬 (Double-Heart Stone Weir), 七美鄉. An ancient fish
 * trap made of basalt and coral stones, arranged in two interlocking hearts —
 * Taiwan's most romantic landmark and Penghu's signature. Silhouette: two
 * low-profile heart shapes made of dark stone walls sitting in shallow water,
 * the iconic aerial view from postcards.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget); rng() only nudges stone tint.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — dark basalt stone walls in turquoise shallow water.
const STONE = 0x4a4e52; // dark basalt/coral stone
const STONE_D = 0x363a3e; // shadowed stone
const WATER = 0x5aa8b8; // turquoise shallow water
const SAND = 0xd6c8a6; // sandy beach around

export const NM_DOUBLE_HEART = {
  id: 'double_heart_weir',
  name: '雙心石滬',
  landmarkId: 0,
  dioramaRHint: 15, // ~50m across in real life
  colorHex: STONE,

  buildGeometry(rng) {
    const tint = Math.floor(rng() * 0x0a0a0a);
    const stoneCol = STONE + tint;
    const parts = [];

    // Heart shape approximation using box segments
    // Each heart is roughly V-shaped with rounded lobes

    // ---- Left Heart ----
    const lhX = -0.55; // left heart center X
    const lhZ = 0;
    // Left lobe of left heart
    parts.push(box(0.35, 0.12, 0.08, stoneCol, { x: lhX - 0.2, z: lhZ + 0.3, ry: -0.3, y: 0.06, hex2: STONE_D }));
    parts.push(box(0.3, 0.12, 0.08, stoneCol, { x: lhX - 0.35, z: lhZ + 0.15, ry: -0.6, y: 0.06, hex2: STONE_D }));
    // Right lobe of left heart
    parts.push(box(0.35, 0.12, 0.08, stoneCol, { x: lhX + 0.2, z: lhZ + 0.3, ry: 0.3, y: 0.06, hex2: STONE_D }));
    parts.push(box(0.3, 0.12, 0.08, stoneCol, { x: lhX + 0.35, z: lhZ + 0.15, ry: 0.6, y: 0.06, hex2: STONE_D }));
    // Bottom V of left heart
    parts.push(box(0.4, 0.12, 0.08, stoneCol, { x: lhX - 0.15, z: lhZ - 0.25, ry: 0.4, y: 0.06, hex2: STONE_D }));
    parts.push(box(0.4, 0.12, 0.08, stoneCol, { x: lhX + 0.15, z: lhZ - 0.25, ry: -0.4, y: 0.06, hex2: STONE_D }));
    // Tip
    parts.push(box(0.12, 0.14, 0.12, stoneCol, { x: lhX, z: lhZ - 0.45, y: 0.07, hex2: STONE_D }));

    // ---- Right Heart ----
    const rhX = 0.55;
    const rhZ = 0;
    // Left lobe of right heart
    parts.push(box(0.35, 0.12, 0.08, stoneCol, { x: rhX - 0.2, z: rhZ + 0.3, ry: -0.3, y: 0.06, hex2: STONE_D }));
    parts.push(box(0.3, 0.12, 0.08, stoneCol, { x: rhX - 0.35, z: rhZ + 0.15, ry: -0.6, y: 0.06, hex2: STONE_D }));
    // Right lobe of right heart
    parts.push(box(0.35, 0.12, 0.08, stoneCol, { x: rhX + 0.2, z: rhZ + 0.3, ry: 0.3, y: 0.06, hex2: STONE_D }));
    parts.push(box(0.3, 0.12, 0.08, stoneCol, { x: rhX + 0.35, z: rhZ + 0.15, ry: 0.6, y: 0.06, hex2: STONE_D }));
    // Bottom V of right heart
    parts.push(box(0.4, 0.12, 0.08, stoneCol, { x: rhX - 0.15, z: rhZ - 0.25, ry: 0.4, y: 0.06, hex2: STONE_D }));
    parts.push(box(0.4, 0.12, 0.08, stoneCol, { x: rhX + 0.15, z: rhZ - 0.25, ry: -0.4, y: 0.06, hex2: STONE_D }));
    // Tip
    parts.push(box(0.12, 0.14, 0.12, stoneCol, { x: rhX, z: rhZ - 0.45, y: 0.07, hex2: STONE_D }));

    // ---- Connecting wall between hearts ----
    parts.push(box(0.25, 0.1, 0.08, stoneCol, { x: 0, z: 0.15, y: 0.05, hex2: STONE_D }));

    // ---- Water pool inside hearts ----
    parts.push(cyl(0.35, 0.35, 0.02, 8, WATER, { x: lhX, z: lhZ, y: 0.01 }));
    parts.push(cyl(0.35, 0.35, 0.02, 8, WATER, { x: rhX, z: rhZ, y: 0.01 }));

    // ---- Surrounding tidal flat / sand ----
    parts.push(box(2.6, 0.02, 1.4, SAND, { y: -0.01, hex2: WATER }));

    return finish(parts);
  },
};

export default NM_DOUBLE_HEART;
