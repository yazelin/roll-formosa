/**
 * @file packs/penghu/collectibles/coral_stone.js — Roll Formosa Penghu pack.
 *
 * COL_CORAL_STONE — 咾咕石 (Coral Stone), the traditional building material
 * of Penghu. Made from fossilized coral, used to build walls and houses
 * throughout the islands.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CORAL = 0xd8d0c0; // pale coral stone
const CORAL_D = 0xb8b0a0; // darker coral
const CORAL_L = 0xe8e0d0; // lighter

export const COL_CORAL_STONE = {
  id: 'coral_stone',
  name: '咾咕石',
  collectibleId: 6,
  colorHex: CORAL,

  buildGeometry(rng) {
    const parts = [];

    // Stack of coral stones showing the porous texture
    const stones = [
      { x: 0, y: 0.15, z: 0, w: 0.8, h: 0.3, d: 0.6, r: 0 },
      { x: 0.15, y: 0.4, z: 0.05, w: 0.65, h: 0.25, d: 0.5, r: 0.1 },
      { x: -0.1, y: 0.6, z: -0.05, w: 0.55, h: 0.22, d: 0.45, r: -0.05 },
    ];

    for (const s of stones) {
      const col = CORAL + Math.floor(rng() * 0x101010) - 0x080808;
      parts.push(box(s.w, s.h, s.d, col, {
        x: s.x,
        y: s.y,
        z: s.z,
        ry: s.r,
        hex2: CORAL_D,
      }));
    }

    // Porous texture (small indentations)
    for (let i = 0; i < 6; i++) {
      const x = (rng() - 0.5) * 0.5;
      const y = 0.2 + rng() * 0.45;
      const z = 0.25 + rng() * 0.1;
      parts.push(box(0.08, 0.08, 0.06, CORAL_D, { x, y, z }));
    }

    return finish(parts);
  },
};

export default COL_CORAL_STONE;
