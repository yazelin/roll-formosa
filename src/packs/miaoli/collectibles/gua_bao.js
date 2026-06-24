/**
 * @file packs/taipei/collectibles/gua_bao.js — Roll Formosa Taipei pack.
 *
 * COLLECTIBLE 刈包 (gua bao): a small hand-held folded steamed-bun "Taiwanese
 * taco" — a soft white bun folded over braised pork belly, with pickled
 * mustard greens, a sprig of cilantro and a dusting of peanut powder peeking
 * out of the fold.
 *
 * Authored ONLY from the engine geometry vocabulary (geomHelpers.js:
 * box/cyl/cone/sph/ico/torus + paint/xf + finish) and normalized by finish()
 * to a UNIT bounding sphere (radius 1). Tri budget <= 350 (kept low via small
 * radial segment counts). rng() is used ONLY for tiny deterministic nudges to
 * the loose fillings, never for structure.
 *
 * Build orientation: the fold runs along the X axis; the bun opens toward +Z
 * (front), so the fillings spill out of the front lip.
 */

import {
  box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

export const COL_GUABAO = {
  id: 'gua_bao',
  name: '刈包',
  collectibleId: 3,
  colorHex: 0xf2ece0, // steamed-bun off-white

  buildGeometry(rng) {
    const bun = 0xf3ecdf;      // soft steamed-bun white
    const bunShade = 0xe2d8c4; // creased underside shadow
    const pork = 0x6f3d22;     // braised pork belly (dark soy brown)
    const porkFat = 0xe9d8c0;  // fat striations
    const pickle = 0x8a8f3a;   // pickled mustard greens (酸菜)
    const peanut = 0xd9b066;   // peanut powder dusting
    const cilantro = 0x3f7a34; // 香菜 sprig

    // tiny deterministic nudge for the loose fillings (never structural)
    const j = (a) => (rng() - 0.5) * a;

    return finish([
      // --- folded bun shell -------------------------------------------------
      // The bun is a half-pipe (open-bottom cylinder, theta covering the top
      // 220deg) running along X. Two near-parallel walls pinched at the top
      // give the classic taco fold.
      // back wall of the fold (leans back)
      cyl(0.9, 0.9, 1.7, 8, bun, {
        rx: HALF_PI, theta0: HALF_PI * 0.2, thetaLen: PI * 1.15,
        open: true, z: -0.18, y: 0.05, hex2: bunShade,
      }),
      // front wall of the fold (leans forward, opens to +Z)
      cyl(0.86, 0.86, 1.66, 8, bun, {
        rx: HALF_PI, theta0: HALF_PI * 0.2, thetaLen: PI * 1.15,
        open: true, z: 0.18, y: 0.02, hex2: bunShade,
      }),
      // rounded end caps so the bun reads as a puffy closed pillow on the sides
      sph(0.74, bun, { ws: 6, hs: 3, x: -0.82, y: 0.18, sz: 0.7, hex2: bunShade }),
      sph(0.74, bun, { ws: 6, hs: 3, x: 0.82, y: 0.18, sz: 0.7, hex2: bunShade }),
      // pinched top ridge where the two lobes meet (the crease of the fold)
      cyl(0.14, 0.14, 1.5, 5, bunShade, { rz: HALF_PI, y: 0.92 }),
      // soft puffy top accents on each lobe so the silhouette stays plump
      sph(0.42, bun, { ws: 6, hs: 3, x: 0.0, y: 0.6, z: -0.42, sz: 0.7 }),
      sph(0.4, bun, { ws: 6, hs: 3, x: 0.0, y: 0.55, z: 0.42, sz: 0.7 }),

      // --- fillings peeking out of the fold (toward +Z, low in the pocket) --
      // braised pork belly slab — the hero, dark soy brown, with fat stripes
      box(1.18, 0.46, 0.5, pork, { y: 0.0, z: 0.46 }),
      box(1.18, 0.09, 0.52, porkFat, { y: 0.14, z: 0.47 }),  // top fat striation
      box(1.18, 0.09, 0.52, porkFat, { y: -0.12, z: 0.47 }), // lower fat striation
      // rounded glossy front edge of the pork
      cyl(0.23, 0.23, 1.18, 6, pork, { rz: HALF_PI, y: -0.04, z: 0.66 }),

      // pickled mustard greens (酸菜) — a couple of olive-green tufts
      ico(0.2, 0, pickle, { x: -0.42 + j(0.1), y: 0.16, z: 0.6 + j(0.06) }),
      ico(0.18, 0, pickle, { x: 0.34 + j(0.1), y: 0.18, z: 0.62 + j(0.06) }),

      // cilantro sprig poking up out of the fold
      ico(0.13, 0, cilantro, { x: -0.1 + j(0.08), y: 0.42, z: 0.5 }),
      ico(0.1, 0, cilantro, { x: 0.34 + j(0.08), y: 0.38, z: 0.52 }),

      // peanut-powder dusting — a few flat tan flecks along the front lip
      box(0.5, 0.04, 0.18, peanut, { x: -0.3, y: 0.3, z: 0.55, rz: 0.15 }),
      box(0.42, 0.04, 0.16, peanut, { x: 0.3, y: 0.32, z: 0.55, rz: -0.12 }),
    ]);
  },
};

export default COL_GUABAO;
