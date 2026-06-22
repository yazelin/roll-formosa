/**
 * @file packs/taipei/collectibles/xiaolongbao.js — Roll Formosa Taipei pack,
 * COLLECTIBLE (rare-album item the ball rolls up).
 *
 * COL_XLB — 小籠包 (xiaolongbao soup dumpling). Silhouette: a pale, plump
 * PLEATED DOME of dumpling skin gathered up into a small TWISTED TOP KNOT,
 * sitting inside a shallow round BAMBOO STEAMER (蒸籠) basket. A ring of
 * angled pleat folds fans out from the knot down the dome so it reads as a
 * hand-folded dumpling, not a plain bun — wide-and-low, never tall.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a squashed dumpling dome that overfills a thin bamboo ring.
 *
 * Palette: warm pale-cream dough, soft golden bamboo basket. rng() only nudges
 * the dough tint a hair and jitters pleat angles — never structure.
 * Budget: <= 350 triangles.
 */

import { cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

/** @type {CollectibleDef} */
export const COL_XLB = {
  id: 'xiaolongbao',
  name: '小籠包',
  collectibleId: 4,
  colorHex: 0xf2e8d6, // pale dumpling-dough cream

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x040302; // hair of per-instance dough warmth
    const dough = 0xf2e8d6 - tint; // pale cream skin
    const doughTop = 0xfdf6ea; // brighter near the pinched crown
    const shade = 0xe2d2b6; // soft shadowed pleat valleys
    const bamboo = 0xd6b67a; // golden bamboo basket
    const bambooDark = 0xc09a58; // basket slat shading

    const parts = [
      // --- BAMBOO STEAMER basket (蒸籠) — shallow round ring it sits in ----
      // Thin open wall: a low cylinder skirt with a slat-shaded gradient.
      cyl(1.06, 1.06, 0.30, 12, bamboo, { y: 0.15, open: true, hex2: bambooDark }),
      // Top rim hoop (the bound bamboo band) + low cone basket floor.
      torus(1.06, 0.05, 3, 9, bambooDark, { rx: HALF_PI, y: 0.30 }),
      cone(1.05, 0.12, 10, bamboo, { y: 0.0, hex2: bambooDark }), // basket floor the dumpling rests on

      // --- DUMPLING DOME — plump squashed skin overfilling the basket -----
      // Top hemisphere only, squashed flat → wide soup-dumpling belly.
      sph(0.92, dough, { ws: 12, hs: 4, thetaLen: HALF_PI, sy: 0.62, y: 0.30, hex2: doughTop }),
      // Tucked underside lip (short shaded cone skirt) so the dome reads as
      // gathered overhanging the basket rim, not a bare half-ball — cheaper
      // than a torus, and its hidden underside is never seen.
      cone(0.86, 0.22, 10, shade, { rx: PI, y: 0.40, hex2: dough }),
    ];

    // --- PLEAT FOLDS — ring of angled flaps fanning up to the knot --------
    const PLEATS = 9;
    for (let i = 0; i < PLEATS; i++) {
      const a = (i / PLEATS) * PI * 2;
      const jit = (rng() - 0.5) * 0.05; // tiny non-structural angle wobble
      const r = 0.40; // radius of the pleat ring around the crown
      // Each pleat: a thin tall flap leaning inward toward the top knot.
      parts.push(
        cone(0.085, 0.40, 3, i % 2 === 0 ? dough : shade, {
          ry: a,
          rz: 0.62, // lean inward toward the knot
          x: Math.cos(a + jit) * r,
          z: Math.sin(a + jit) * r,
          y: 0.74,
          hex2: doughTop,
        })
      );
    }

    // --- TWISTED TOP KNOT — pinched, swirled crown where pleats meet ------
    parts.push(
      // Gathered collar where every pleat converges.
      cyl(0.20, 0.30, 0.14, 8, shade, { y: 0.88, hex2: dough }),
      // The twist: a short stubby swirl rising and tapering off-axis.
      cyl(0.12, 0.19, 0.18, 6, dough, { y: 1.00, rz: 0.18, hex2: doughTop }),
      // Final pinched tip of the knot.
      sph(0.10, doughTop, { ws: 6, hs: 4, x: 0.03, y: 1.12 })
    );

    return finish(parts);
  },
};

export default COL_XLB;
