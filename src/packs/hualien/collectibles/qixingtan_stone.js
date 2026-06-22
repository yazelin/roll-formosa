/**
 * @file packs/hualien/collectibles/qixingtan_stone.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_QIXINGTAN_STONE — 七星潭石 (Qixingtan beach stone). The famous smooth
 * pebbles of Qixingtan Beach, polished by the Pacific waves. A stack of
 * three colorful rounded stones (white, grey, and teal) arranged in a
 * zen-like balance — a symbol of this iconic pebble beach.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const STONE_W = 0xe8e0d8; // white pebble
const STONE_G = 0x7a8078; // grey pebble
const STONE_T = 0x5a8a8a; // teal/green pebble
const POLISH = 0xf4f0e8; // wet polish shine

export const COL_QIXINGTAN_STONE = {
  id: 'qixingtan_stone',
  name: '七星潭石',
  collectibleId: 4,
  colorHex: 0x5a8a8a, // teal beach stone

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020101);
    const parts = [];

    // --- Bottom stone: large white pebble (base) ---
    parts.push(sph(0.65, STONE_W, { ws: 8, hs: 5, sy: 0.55, y: 0.0, hex2: POLISH }));

    // --- Middle stone: medium grey pebble ---
    parts.push(sph(0.48, STONE_G, { ws: 7, hs: 5, sy: 0.5, y: 0.55, hex2: 0x8a8880 }));

    // --- Top stone: small teal pebble ---
    parts.push(sph(0.35, STONE_T + t, { ws: 7, hs: 5, sy: 0.55, y: 0.95, hex2: 0x6a9a9a }));

    // --- Subtle polish highlights ---
    parts.push(sph(0.25, POLISH, { ws: 4, hs: 3, thetaLen: PI * 0.3, x: 0.25, y: 0.15, z: 0.2 }));
    parts.push(sph(0.15, POLISH, { ws: 4, hs: 3, thetaLen: PI * 0.3, x: -0.15, y: 0.65, z: 0.2 }));

    return finish(parts);
  },
};

export default COL_QIXINGTAN_STONE;
