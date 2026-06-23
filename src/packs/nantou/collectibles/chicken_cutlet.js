/**
 * @file packs/taipei/collectibles/chicken_cutlet.js — Roll Formosa Taipei pack,
 * collectible 2.
 *
 * 雞排 — the Taiwanese night-market deep-fried chicken cutlet: an oversized,
 * irregular, golden-brown breaded slab so big it overflows the little white
 * paper sleeve it's served in. Silhouette: a flat crispy slab tilted up out of
 * a small open paper bag, the cutlet's craggy fried edge poking above the sleeve
 * rim, dusted with pepper specks.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * read: a wide thin golden slab standing in a short paper sleeve.
 *
 * Palette: golden-brown crispy crust (warm top, darker fried underside), a
 * couple of charred bites, off-white paper sleeve. rng() is used only for a
 * hair of pepper-speck and edge jitter — never for structure.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const CRUST = 0xc8902f; // golden fried breading (top face)
const CRUST_D = 0x9a6a1c; // darker fried underside / crust shadow
const CRUST_L = 0xe0b35a; // sunlit crispy highlight
const CHAR = 0x6b4413; // over-fried charred bite
const PAPER = 0xf2ece0; // off-white paper sleeve
const PAPER_D = 0xd8cfbb; // sleeve shadow / inner fold
const PEPPER = 0x3b2a18; // black-pepper / spice speck

export const COL_CHICKEN = {
  id: 'chicken_cutlet',
  name: '雞排',
  collectibleId: 2,
  colorHex: CRUST,

  /**
   * @param {() => number} rng Boot rng — tiny cosmetic jitter only.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];
    const j = () => (rng() - 0.5); // signed jitter in [-0.5, 0.5]

    // === PAPER SLEEVE ========================================================
    // A short open paper bag: thin slightly-tapered shell standing on the
    // ground, the cutlet rising out of its open mouth. Hexagonal so it reads
    // as folded paper, not a smooth cup.
    parts.push(
      cyl(1.18, 1.0, 1.5, 6, PAPER, { y: -0.55, open: true, hex2: PAPER_D }),
    );
    // Front lip folded down a touch lighter so the open mouth reads.
    parts.push(
      cyl(1.22, 1.18, 0.22, 6, PAPER, { y: 0.21, open: true }),
    );
    // Flat paper bottom to close the sleeve base.
    parts.push(
      box(1.5, 0.12, 1.5, PAPER_D, { y: -1.24, ry: PI / 6 }),
    );

    // === CHICKEN CUTLET SLAB =================================================
    // A wide, thin, irregular golden slab tilted up out of the sleeve. Built
    // from three overlapping flat boxes (a big central panel plus two skewed
    // wings) so the outline is craggy, not a clean rectangle. Tilted back ~12°
    // and the whole assembly leans so the top edge crests above the rim.
    const TILT = -0.20; // lean back so it peeks out of the bag
    const LIFT = 0.95; // raise center of slab above the rim

    // central crispy panel — top golden, underside darker via gradient
    parts.push(
      box(2.05, 1.65, 0.34, CRUST, {
        rz: TILT,
        rx: -0.10,
        y: LIFT,
        z: 0.06,
        hex2: CRUST_L,
      }),
    );
    // left wing — slightly rotated & lower so the silhouette is irregular
    parts.push(
      box(1.05, 1.35, 0.30, CRUST_D, {
        rz: TILT + 0.30,
        x: -1.12,
        y: LIFT - 0.34,
        z: 0.02,
        hex2: CRUST,
      }),
    );
    // right wing — flares out the other way
    parts.push(
      box(1.0, 1.5, 0.30, CRUST_D, {
        rz: TILT - 0.26,
        x: 1.18,
        y: LIFT - 0.18,
        z: 0.0,
        hex2: CRUST,
      }),
    );
    // top crispy crest — a small bump poking highest, the iconic ragged edge
    parts.push(
      box(1.4, 0.6, 0.32, CRUST_L, {
        rz: TILT + 0.06,
        y: LIFT + 1.0,
        z: 0.07,
        hex2: CRUST,
      }),
    );

    // === FRIED-EDGE CRAGGINESS & CHAR ========================================
    // A couple of charred over-fried nubs along the rim to sell "deep fried".
    parts.push(
      box(0.5, 0.46, 0.36, CHAR, {
        rz: TILT + 0.5,
        x: -0.78,
        y: LIFT + 1.18,
        z: 0.08,
      }),
    );
    parts.push(
      box(0.44, 0.4, 0.36, CHAR, {
        rz: TILT - 0.6,
        x: 0.92,
        y: LIFT + 0.92,
        z: 0.05,
      }),
    );

    // === PEPPER / SPICE SPECKS ===============================================
    // Tiny dark cubes scattered across the front golden face (cosmetic only).
    const specks = [
      [-0.45, LIFT + 0.45],
      [0.35, LIFT + 0.1],
      [0.05, LIFT + 0.85],
      [-0.7, LIFT - 0.1],
      [0.6, LIFT + 0.6],
      [-0.15, LIFT - 0.35],
    ];
    for (let i = 0; i < specks.length; i++) {
      const [sx, sy] = specks[i];
      parts.push(
        box(0.12, 0.12, 0.1, PEPPER, {
          x: sx + j() * 0.12,
          y: sy + j() * 0.12,
          z: 0.26 + j() * 0.03,
        }),
      );
    }

    return finish(parts);
  },
};
