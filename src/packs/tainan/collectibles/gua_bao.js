/**
 * @file packs/tainan/collectibles/gua_bao.js — Roll Formosa Tainan pack.
 *
 * COLLECTIBLE 擔仔麵 (danzai noodles): Tainan's iconic small bowl of oily-noodle
 * — a shallow blue-rimmed ceramic bowl holding a mound of springy egg noodles,
 * crowned with a single whole shrimp, a dollop of dark minced-pork sauce (肉燥),
 * and a little sprig of coriander with a clove of garlic. A small hand-held bowl,
 * wide-and-low, never tall.
 *
 * Authored ONLY from the engine geometry vocabulary (geomHelpers.js:
 * box/cyl/cone/sph/ico/torus + paint/xf + finish) and normalized by finish()
 * to a UNIT bounding sphere (radius 1). Tri budget <= 350 (kept low via small
 * radial segment counts). rng() is used ONLY for tiny deterministic nudges to
 * the loose toppings, never for structure.
 */

import {
  cyl, cone, sph, ico, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

export const COL_GUABAO = {
  id: 'gua_bao',
  name: '擔仔麵',
  collectibleId: 3,
  colorHex: 0xe0c98a, // egg-noodle warm cream

  buildGeometry(rng) {
    const bowlWhite = 0xf4f1e8; // white ceramic bowl
    const bowlShade = 0xddd8c9; // bowl shadow
    const bowlBlue = 0x3a6fb0; // blue-painted rim
    const noodle = 0xe0c98a;    // egg noodles
    const noodleHi = 0xf0dba6;  // brighter noodle highlight
    const broth = 0xc9a868;     // oily broth tint
    const shrimp = 0xf2856a;    // boiled shrimp orange-pink
    const shrimpHi = 0xf7a890;  // shrimp highlight
    const sauce = 0x5a3318;     // dark minced-pork sauce (肉燥)
    const cilantro = 0x3f7a34;  // 香菜 sprig
    const garlic = 0xf0ead6;    // garlic clove

    const j = (a) => (rng() - 0.5) * a;

    return finish([
      // --- CERAMIC BOWL (open cylinder, white with blue rim) --------------
      // shallow flared wall
      cyl(1.5, 0.95, 0.95, 9, bowlWhite, { y: 0.0, open: true, hex2: bowlShade }),
      // low cone floor closing the bottom
      cone(0.95, 0.4, 8, bowlWhite, { y: -0.62, hex2: bowlShade }),
      // blue-painted rim band at the mouth
      torus(1.5, 0.07, 3, 9, bowlBlue, { rx: HALF_PI, y: 0.47 }),

      // --- BROTH surface (oily noodle soup sits low in the bowl) ----------
      cyl(1.36, 1.36, 0.06, 9, broth, { y: 0.18 }),

      // --- NOODLE MOUND (springy egg noodles heaped in the middle) --------
      sph(1.05, noodle, { ws: 8, hs: 4, thetaLen: HALF_PI, sy: 0.5, y: 0.2, hex2: noodleHi }),
      // --- SHRIMP on top (the hero garnish) -------------------------------
      // a curled shrimp: short fat torus arc + a tail fan cone
      torus(0.34, 0.13, 4, 7, shrimp, { rx: HALF_PI * 0.4, x: 0.0, y: 0.66, z: 0.05, arc: PI * 1.3, hex2: shrimpHi }),
      cone(0.13, 0.22, 5, shrimpHi, { x: 0.36, y: 0.6, z: -0.18, rz: -0.6 }), // tail

      // --- MINCED-PORK SAUCE dollop (肉燥) --------------------------------
      ico(0.24, 0, sauce, { x: -0.42 + j(0.08), y: 0.6, z: -0.18 }),

      // --- CORIANDER sprig + GARLIC clove ---------------------------------
      ico(0.14, 0, cilantro, { x: 0.05 + j(0.06), y: 0.78, z: 0.3 }),
      sph(0.14, garlic, { ws: 5, hs: 3, x: 0.34 + j(0.06), y: 0.62, z: 0.3, sy: 1.3 }),
    ]);
  },
};

export default COL_GUABAO;
