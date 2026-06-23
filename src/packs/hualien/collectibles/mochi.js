/**
 * @file packs/hualien/collectibles/mochi.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_MOCHI — 花蓮麻糬 (Hualien mochi). A plump, soft round rice cake — the
 * signature sweet snack of Hualien, often filled with peanut or red bean.
 * Silhouette: a white, slightly squashed sphere with a small dimple at top
 * dusted with white powder. A simple but iconic hand-sized treat.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { sph, cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const MOCHI = 0xf8f4ef; // soft off-white mochi exterior
const MOCHI_HI = 0xfffcf8; // highlight
const POWDER = 0xfdfaf4; // dusting powder
const FILL = 0x8a6040; // peanut filling peeking through

export const COL_MOCHI = {
  id: 'mochi',
  name: '花蓮麻糬',
  collectibleId: 1,
  colorHex: 0xf8f4ef, // soft white mochi

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020101);
    const mochi = MOCHI + t;
    const parts = [];

    // --- Main body: a plump squashed sphere (the mochi) ---
    parts.push(sph(0.95, mochi, { ws: 10, hs: 7, sy: 0.7, y: 0.0, hex2: MOCHI_HI }));

    // --- Slight dimple/pinch at top (where it was folded/sealed) ---
    parts.push(cyl(0.15, 0.2, 0.12, 8, mochi, { y: 0.55 }));

    // --- A subtle exposed filling glimpse (small dark spot on side) ---
    parts.push(sph(0.12, FILL, { ws: 5, hs: 3, x: 0.4, y: 0.1, z: 0.3 }));

    // --- Powder dusting on top ---
    parts.push(sph(0.6, POWDER, { ws: 6, hs: 3, thetaLen: PI * 0.3, sy: 0.3, y: 0.55 }));

    return finish(parts);
  },
};

export default COL_MOCHI;
