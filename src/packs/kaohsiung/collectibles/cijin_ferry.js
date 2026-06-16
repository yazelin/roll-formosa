/**
 * @file packs/kaohsiung/collectibles/cijin_ferry.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_CIJIN_FERRY — 旗津渡輪 (Cijin ferry). The little blue-and-white passenger
 * boat that shuttles across Kaohsiung Harbour between Gushan and Cijin. Silhouette:
 * a low white hull with a blue waterline stripe, an open white lower deck, a small
 * boxy wheelhouse / pilot cabin up front, and a flat upper sun deck on top with a
 * stubby blue funnel/mast. A small hand-held boat — wide and low, never a ship.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so proportions (not absolute size) are what we author here.
 * <= 600 triangles (collectible budget; this one lands ~300). rng() only nudges
 * the hull tint, never structure.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — Cijin-ferry blue-and-white livery. */
const HULL_BLUE = 0x3f78ad; // deep harbour-blue lower hull
const STRIPE = 0x5a8fc0; // brighter blue waterline stripe (the read color)
const WHITE = 0xf2f5f8; // ferry white superstructure
const WHITE_HI = 0xffffff; // top-of-deck highlight
const DARK = 0x20303c; // window / opening dark
const FUNNEL = 0x2f6798; // blue funnel / mast

export const COL_CIJIN_FERRY = {
  id: 'cijin_ferry',
  name: '旗津渡輪',
  collectibleId: 13,
  colorHex: 0x5a8fc0, // blue-white ferry blue

  /**
   * Build the ferry geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (hull tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040608); // tiny per-instance hull tint nudge
    const blue = STRIPE + t; // waterline blue, faintly varied

    return finish([
      // --- HULL: a long low box, tapered toward the bow (front, +z). --------
      // Lower hull = deep blue, with a brighter blue waterline stripe on top of it.
      box(0.78, 0.34, 2.0, HULL_BLUE, { y: 0.18, hex2: HULL_BLUE }),
      // bow wedge — a narrower box pushed forward so the prow reads as a point.
      box(0.5, 0.32, 0.5, HULL_BLUE, { y: 0.18, z: 1.16, sx: 1.0, sz: 1.0, ry: 0.0 }),
      // angled bow cap (cone laid on its side, point forward) for a boat nose.
      cyl(0.0, 0.39, 0.42, 4, HULL_BLUE, { rx: 1.5708, y: 0.2, z: 1.42 }),
      // bright waterline STRIPE running the hull length (the signature blue band).
      box(0.82, 0.1, 1.96, blue, { y: 0.38, hex2: blue }),

      // --- LOWER DECK: open white passenger deck sitting on the hull. --------
      box(0.74, 0.32, 1.7, WHITE, { y: 0.6, z: -0.04, hex2: WHITE_HI }),
      // dark window band along the open lower deck side.
      box(0.78, 0.12, 1.5, DARK, { y: 0.6, z: -0.04 }),
      // white roof of the lower deck (= floor of the upper deck).
      box(0.78, 0.06, 1.74, WHITE, { y: 0.79, z: -0.04, hex2: WHITE_HI }),

      // --- WHEELHOUSE / PILOT CABIN: small boxy cabin up front (+z). ---------
      box(0.56, 0.34, 0.56, WHITE, { y: 0.99, z: 0.52, hex2: WHITE_HI }),
      // wraparound windscreen (dark band) on the cabin.
      box(0.6, 0.16, 0.6, DARK, { y: 1.04, z: 0.52 }),
      // thin cabin roof lip.
      box(0.62, 0.05, 0.62, WHITE_HI, { y: 1.18, z: 0.52 }),

      // --- UPPER SUN DECK: flat open deck on the cabin roof line, aft. -------
      box(0.66, 0.06, 1.0, WHITE, { y: 0.86, z: -0.26, hex2: WHITE_HI }),
      // low railing strip around the rear of the upper deck.
      box(0.7, 0.14, 0.06, WHITE_HI, { y: 0.93, z: -0.78 }),
      box(0.06, 0.14, 0.96, WHITE_HI, { x: -0.34, y: 0.93, z: -0.28 }),
      box(0.06, 0.14, 0.96, WHITE_HI, { x: 0.34, y: 0.93, z: -0.28 }),

      // --- FUNNEL / MAST: stubby blue funnel rising amidships. ---------------
      cyl(0.13, 0.15, 0.4, 8, FUNNEL, { y: 1.12, z: -0.18, hex2: 0x3f78ad }),
      // white cap ring on top of the funnel.
      cyl(0.16, 0.15, 0.06, 8, WHITE_HI, { y: 1.34, z: -0.18 }),
    ]);
  },
};

export default COL_CIJIN_FERRY;
