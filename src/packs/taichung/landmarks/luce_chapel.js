/**
 * @file packs/taichung/landmarks/luce_chapel.js — Roll Formosa Taichung landmark.
 *
 * NM_LUCE_CHAPEL — 路思義教堂 (東海大學, Tunghai University, 西屯區). I.M. Pei's
 * iconic chapel: FOUR curved thin shells (hyperbolic-paraboloid panels) leaning
 * together into a tall pointed tent. Each shell is WIDE at the ground and TAPERS
 * up to the soaring ridge; the four ridges meet at a single apex while the four
 * feet splay out to land at the corners, leaving the gaps (the glazed slits at
 * the ridges + the open central base) that make the form read as a pointed
 * conoid tent rather than a solid pyramid.
 *
 * Modelled with the engine geometry vocabulary only (geomHelpers.js): each shell
 * is built from a wide LOWER segment and a slimmer UPPER segment, both thin boxes
 * tilted inward (the upper one tilted harder) so the silhouette curves in toward
 * the apex — the closest the box/cyl primitives get to Pei's warped surface. The
 * four shells are placed on two facing pairs (front/back, left/right) so adjacent
 * panels touch at four ridge seams. finish() recenters → normalizes to a UNIT
 * bounding sphere, so PROPORTIONS carry the read. <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const TILE_LO = 0xb38f5c; // beige Mosaic shell tile (lower / in shadow)
const TILE_HI = 0xd8b985; // sunlit beige tile (upper, catching light)
const RIDGE = 0xe6d2ab; // pale grout line along the four ridge seams
const SILL = 0x6f5836; // dark base sill where the shells meet the ground
const PLINTH = 0x7d6a4a; // earth-tone ground plinth / plaza
const GLASS = 0x2b3a44; // shadowed glazed slit at the ridge gaps

export const NM_LUCE_CHAPEL = {
  id: 'luce_chapel',
  name: '路思義教堂',
  landmarkId: 12,
  dioramaRHint: 19, // chapel apex ≈ 19 m
  colorHex: TILE_HI,

  buildGeometry(rng) {
    const parts = [];

    // ---- 0) Ground plinth / plaza -----------------------------------------
    // A square earth-tone slab the four feet land on (square cross-section via
    // a 4-seg cyl rotated PI/4 so its flat faces point along the axes).
    parts.push(cyl(1.05, 1.18, 0.18, 4, PLINTH, { ry: PI / 4, y: 0.09, hex2: 0x8c7858 })); // plaza base
    parts.push(box(1.5, 0.07, 1.5, 0x5f5238, { y: 0.035 })); // thin ground edge

    // ---- shell builder ----------------------------------------------------
    // One curved shell = a wide LOWER plate tilted gently inward + a slimmer
    // UPPER plate tilted harder, stacked so the panel narrows and leans toward
    // the apex. `dir` faces the panel outward along +Z; the caller rotates the
    // whole shell with ry to place the four panels. Each plate is a thin box
    // (depth = shell thickness) with a pale grout strip up its outer ridge.
    const APEX = 3.05; // ridge apex height (top of the tent)
    const FOOT = 0.22; // y where the splayed feet meet the plinth

    /**
     * Push one curved shell, rotated by `ry` about the vertical axis.
     * @param {number} ryAng rotation of the whole shell (0 / PI/2 / PI / 3PI/2)
     */
    function shell(ryAng) {
      // --- LOWER segment: wide at the foot, leaning slightly in -----------
      // Box authored upright then tilted so its top edge moves toward center.
      // wide (X) × tall (Y) × thin (Z). Outer face is +Z before rotation.
      const lwW = 1.18; // foot width
      const lwH = 1.55; // lower segment height
      const lwTilt = 0.32; // inward lean (radians) of the lower plate
      const lwZ = 0.62; // how far the foot sits from the central axis
      const lwY = FOOT + 0.55; // segment center height
      parts.push(
        box(lwW, lwH, 0.07, TILE_LO, {
          rx: -lwTilt, z: lwZ, y: lwY, ry: ryAng, hex2: TILE_HI,
        }) // lower shell plate (wide foot)
      );
      // pale grout strip running up the centre of the lower plate
      parts.push(
        box(0.05, lwH, 0.085, RIDGE, {
          rx: -lwTilt, z: lwZ, y: lwY, ry: ryAng,
        }) // lower ridge grout line
      );

      // --- UPPER segment: slimmer, leaning hard toward the apex -----------
      const upW = 0.62; // upper width (tapered narrower)
      const upH = 1.55; // upper segment height
      const upTilt = 0.92; // sharper inward lean toward the ridge
      const upZ = 0.30; // upper plate hugs closer to the axis
      const upY = APEX - 0.95; // center height of the upper plate
      parts.push(
        box(upW, upH, 0.07, TILE_LO, {
          rx: -upTilt, z: upZ, y: upY, ry: ryAng, hex2: TILE_HI,
        }) // upper shell plate (tapers to apex)
      );
      parts.push(
        box(0.05, upH, 0.085, RIDGE, {
          rx: -upTilt, z: upZ, y: upY, ry: ryAng,
        }) // upper ridge grout line
      );

      // --- splayed foot sill: a dark wedge where the shell meets ground ---
      parts.push(
        box(lwW + 0.06, 0.18, 0.16, SILL, {
          z: lwZ + 0.14, y: FOOT, ry: ryAng,
        }) // foot sill block
      );
    }

    // ---- 1) Four shells around the centre ---------------------------------
    // Front, right, back, left — adjacent panels touch at the four ridge seams.
    shell(0);
    shell(HALF_PI);
    shell(PI);
    shell(PI + HALF_PI);

    // ---- 2) Ridge apex cap ------------------------------------------------
    // A small steep 4-sided cap closing the very top where the four ridges
    // meet, plus a slim pale finial so the apex reads as a sharp point.
    parts.push(cyl(0.0, 0.16, 0.5, 4, TILE_HI, { ry: PI / 4, y: APEX - 0.18, hex2: 0xeedec0 })); // apex cone cap

    // ---- 3) Glazed ridge slits (the gaps between the shells) --------------
    // Four thin dark panes set just inside each ridge seam so the gaps between
    // the curved shells read as the chapel's vertical glazing from 3/4 view.
    for (let i = 0; i < 4; i++) {
      const a = i * HALF_PI + PI / 4; // seam angles, between the panels
      parts.push(
        box(0.07, 2.3, 0.05, GLASS, {
          x: Math.sin(a) * 0.06, z: Math.cos(a) * 0.06,
          rx: -0.5, ry: a, y: 1.55,
        }) // glazed ridge slit
      );
    }

    return finish(parts);
  },
};

export default NM_LUCE_CHAPEL;
