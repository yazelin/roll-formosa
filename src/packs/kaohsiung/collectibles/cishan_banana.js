/**
 * @file packs/kaohsiung/collectibles/cishan_banana.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_CISHAN_BANANA — 旗山香蕉 (Cishan bananas). Silhouette: a small "hand" of
 * bananas — a cluster of crescent-shaped yellow fingers fanning out from a shared
 * brown crown stem, the way bananas come off the bunch. Each finger is a curved
 * yellow body tapering to a little brown blossom tip. Cishan (旗山) in Kaohsiung is
 * Taiwan's banana capital, so the read is unmistakably "a bunch of bananas" at
 * thumbnail size: fat fanned crescents, bright banana yellow, brown crown + tips.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so proportions (not absolute size) are what we author here.
 * Well under the collectible triangle budget. rng() only nudges the fan spread and
 * ripeness tint, never structure.
 */

import { sph, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — banana yellow body, lighter belly, brown crown + blossom tips. */
const PEEL = 0xe8d24a; // banana yellow (the body read color)
const PEEL_HI = 0xf3e487; // lighter inner-curve highlight
const CROWN = 0x6e5a32; // brown shared stem crown
const TIP = 0x4a3a22; // dark brown blossom tip

export const COL_CISHAN_BANANA = {
  id: 'cishan_banana',
  name: '旗山香蕉',
  colorHex: 0xe8d24a, // banana yellow

  /**
   * Build the bunch geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (fan spread, ripeness tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040402); // tiny per-instance ripeness tint nudge
    const peel = PEEL + t; // banana yellow, slightly varied
    const spread = (rng() - 0.5) * 0.16; // small symmetric fan-spread jitter

    const parts = [];

    // --- shared brown CROWN stem at the top: where all fingers meet the bunch. ---
    parts.push(cyl(0.16, 0.22, 0.34, 6, CROWN, { y: 1.18, hex2: 0x5a4828 }));

    /**
     * One banana finger: a chain of squashed yellow balls bent into a crescent,
     * hanging down from the crown and tapering to a dark blossom tip.
     * @param {number} ang Fan angle (rotateZ) so fingers splay around the crown.
     * @param {number} z Depth offset so the front/back fingers don't z-fight.
     */
    const finger = (ang, z) => {
      // Three beads along the curve: fat near the crown, slim near the tip.
      const beads = [
        { r: 0.27, sy: 1.3, y: 0.86, bend: 0.0 },
        { r: 0.23, sy: 1.25, y: 0.42, bend: 0.22 },
        { r: 0.18, sy: 1.15, y: 0.02, bend: 0.5 },
      ];
      for (const b of beads) {
        // Crescent: each lower bead leans further out (bend) → curved finger.
        const x = Math.sin(ang + b.bend) * (1.06 - b.y) * 0.42;
        parts.push(
          sph(b.r, peel, {
            ws: 5,
            hs: 3,
            sx: 0.82,
            sy: b.sy,
            sz: 0.82,
            rz: ang + b.bend,
            x,
            y: b.y,
            z,
            hex2: PEEL_HI,
          }),
        );
      }
      // dark blossom TIP at the bottom end of the finger.
      const tipX = Math.sin(ang + 0.66) * 1.1 * 0.42;
      parts.push(box_tip(tipX, -0.26, z, ang + 0.66));
    };

    // small dark blossom tip = a tiny tapered cap (use a short low-seg cylinder).
    function box_tip(x, y, z, rz) {
      return cyl(0.04, 0.11, 0.14, 4, TIP, { x, y, z, rz });
    }

    // --- the HAND: four fingers fanned across the front of the bunch. ---
    finger(-0.4 + spread, 0.18);
    finger(-0.14 + spread, 0.28);
    finger(0.14 - spread, 0.28);
    finger(0.4 - spread, 0.18);

    return finish(parts);
  },
};

export default COL_CISHAN_BANANA;
