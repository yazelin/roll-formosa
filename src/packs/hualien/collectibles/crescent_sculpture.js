/**
 * @file packs/hualien/collectibles/crescent_sculpture.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_CRESCENT — 月牙彎 (Crescent Bay sculpture). The iconic white crescent
 * moon sculpture at Qixingtan Beach (七星潭), a popular photo spot with the
 * Pacific Ocean in the background. Features a graceful white curved arc
 * mounted on a stone base.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { torus, cyl, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SCULPT = 0xf4f4f4; // white sculpture
const SCULPT_HI = 0xffffff;
const STONE = 0x7a7870; // grey stone base
const STONE_D = 0x5a5850;

export const COL_CRESCENT = {
  id: 'crescent_sculpture',
  name: '月牙彎',
  collectibleId: 11,
  colorHex: 0xf4f4f4, // white sculpture

  buildGeometry(rng) {
    const parts = [];

    // --- STONE BASE (rough natural stone) ---
    parts.push(box(0.8, 0.25, 0.6, STONE, { y: 0.125, hex2: STONE_D }));
    // Stone texture
    parts.push(box(0.5, 0.12, 0.35, STONE_D, { x: 0.1, y: 0.06, z: 0.1 }));

    // --- CRESCENT MOON ARC (partial torus) ---
    // The main curved white sculpture
    parts.push(torus(0.7, 0.12, 8, 12, SCULPT, {
      y: 0.85,
      rx: HALF_PI,
      theta0: PI * 0.15,
      thetaLen: PI * 0.7, // partial arc
      hex2: SCULPT_HI,
    }));

    // --- Support posts connecting to base ---
    parts.push(cyl(0.08, 0.08, 0.35, 6, SCULPT, { x: -0.45, y: 0.42, z: 0, hex2: SCULPT_HI }));
    parts.push(cyl(0.08, 0.08, 0.35, 6, SCULPT, { x: 0.45, y: 0.42, z: 0, hex2: SCULPT_HI }));

    // --- Small decorative sphere at one end ---
    // (representing the playful design element)
    parts.push(cyl(0.1, 0.08, 0.15, 6, SCULPT_HI, { x: 0.55, y: 1.38, z: 0.1 }));

    return finish(parts);
  },
};

export default COL_CRESCENT;
