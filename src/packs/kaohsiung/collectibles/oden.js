/**
 * @file packs/kaohsiung/collectibles/oden.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_ODEN — 黑輪 (oden / 關東煮). Silhouette: a thin bamboo skewer threaded with
 * a stack of night-market oden pieces — a fat golden 甜不辣 (fishcake/tempura) puck
 * at the bottom, a pale 白蘿蔔 (daikon radish) round in the middle, and a glossy
 * boiled 蛋 (egg) near the top, with the skewer poking out above. A small,
 * recognizable hand-held串 — read carries even at thumbnail size.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 400 triangles (collectible budget). rng() only nudges the
 * tempura browning / egg tint, never structure.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — warm fishcake, browned edge, pale radish, glossy egg, bamboo. */
const TEMPURA = 0xd8b070; // golden 甜不辣 puck (the read color)
const TEMPURA_HI = 0xe6c688; // lighter top of the fishcake
const BROWN = 0xb88a48; // pan-browned edge band
const RADISH = 0xefe6cc; // pale boiled daikon
const RADISH_HI = 0xf6f0de;
const EGG = 0xf2ead2; // boiled egg white
const EGG_HI = 0xfaf5e6;
const BAMBOO = 0xddc28a; // bamboo skewer

export const COL_ODEN = {
  id: 'oden',
  name: '黑輪',
  collectibleId: 13,
  colorHex: 0xd8b070, // golden fishcake — the body read color

  /**
   * Build the skewer geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (browning, tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    // Faint per-instance nudge so a tray of skewers isn't identical.
    const brown = Math.floor(rng() * 0x040302); // tempura browning jitter
    const tempura = TEMPURA - brown;

    return finish([
      // --- bamboo SKEWER threading the whole stack (poking out the top) ---
      cyl(0.085, 0.085, 2.7, 6, BAMBOO, { y: 0.2, hex2: 0xc9ad72 }),

      // --- bottom: fat golden 甜不辣 / fishcake puck (the signature read) ---
      cyl(0.78, 0.78, 0.46, 12, tempura, { y: -0.62, hex2: TEMPURA_HI }),
      // pan-browned edge band wrapping the fishcake rim
      cyl(0.81, 0.81, 0.12, 12, BROWN, { y: -0.62, open: true }),

      // --- middle: pale 白蘿蔔 (daikon radish) round ----------------------
      cyl(0.6, 0.64, 0.5, 11, RADISH, { y: 0.06, hex2: RADISH_HI }),
      // faint browned rim on the radish so it reads as simmered
      cyl(0.66, 0.66, 0.06, 11, BROWN, { y: 0.06, open: true }),

      // --- upper: glossy boiled 蛋 (egg), slightly egg-shaped ------------
      sph(0.56, EGG, { ws: 11, hs: 7, sy: 1.18, y: 0.86, hex2: EGG_HI }),
    ]);
  },
};

export default COL_ODEN;
