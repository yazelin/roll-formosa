/**
 * @file packs/miaoli/collectibles/mochi.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_MOCHI — 客家麻糬 (Hakka mochi/rice cake). Silhouette: a small plate with
 * several round, soft mochi balls dusted with peanut powder. Hakka mochi is a
 * beloved traditional snack, chewy glutinous rice balls rolled in crushed
 * peanut and sugar. Reads unmistakably as "soft rice balls on a plate" at
 * thumbnail size: small plate + round white-beige balls + golden powder coating.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * mochi positions, never structure.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — plate, mochi, peanut powder. */
const PLATE = 0xf5f2ea; // cream white plate
const PLATE_RIM = 0xe8e4da; // slightly darker rim
const MOCHI = 0xfaf8f0; // white glutinous rice
const MOCHI_HI = 0xffffff; // shiny mochi surface
const PEANUT = 0xd4a860; // golden peanut powder
const PEANUT_HI = 0xe0b870; // lighter peanut coating

export const COL_MOCHI = {
  id: 'mochi',
  name: '客家麻糬',
  colorHex: 0xd4a860, // golden peanut powder — the body read color

  /**
   * Build the mochi plate geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (positions).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // --- PLATE: small round serving plate ---
    // Plate surface
    parts.push(cyl(1.0, 1.0, 0.1, 8, PLATE, { y: -0.05 }));
    // Raised rim
    parts.push(cyl(1.0, 0.95, 0.08, 8, PLATE_RIM, { y: 0.0 }));
    // Plate foot
    parts.push(cyl(0.4, 0.4, 0.08, 6, PLATE_RIM, { y: -0.12 }));

    // --- PEANUT POWDER: scattered on the plate ---
    parts.push(cyl(0.85, 0.85, 0.04, 8, PEANUT, { y: 0.02 }));

    // --- MOCHI BALLS: several round rice balls with peanut coating (reduced to 4) ---
    const mochiPositions = [
      { x: 0.0, z: 0.0, s: 1.0 },
      { x: 0.35, z: 0.25, s: 0.9 },
      { x: -0.32, z: 0.3, s: 0.95 },
      { x: 0.25, z: -0.3, s: 0.88 },
    ];

    for (const pos of mochiPositions) {
      const jx = (rng() - 0.5) * 0.08;
      const jz = (rng() - 0.5) * 0.08;
      const r = 0.28 * pos.s;
      // Peanut powder coated mochi ball
      parts.push(sph(r, PEANUT, {
        ws: 5,
        hs: 4,
        sy: 0.85,
        x: pos.x + jx,
        y: 0.18 * pos.s,
        z: pos.z + jz,
        hex2: PEANUT_HI,
      }));
    }

    return finish(parts);
  },
};

export default COL_MOCHI;
