/**
 * @file packs/taichung/collectibles/da_changbao.js — Roll Formosa Taichung pack.
 *
 * COLLECTIBLE 大腸包小腸 (da chang bao xiao chang — "the big sausage wraps the
 * little sausage"): the night-market "Taiwanese hot dog". A fat, pale-cream
 * grilled glutinous-rice sausage (大腸 / 糯米腸) split open lengthwise, cradling
 * a thinner reddish-brown grilled pork sausage (小腸 / 香腸) in its groove.
 * Both lie HORIZONTALLY along the X axis; grill char darkens the ends and a few
 * dark grill-mark stripes ladder across the pork sausage on top.
 *
 * Authored ONLY from the engine geometry vocabulary (geomHelpers.js:
 * box/cyl/sph + paint/xf + finish), normalized by finish() to a UNIT bounding
 * sphere (radius 1), so RELATIVE proportions are what we author. Tri budget
 * <= 350 (kept low via small radial segment counts). rng() is used ONLY for a
 * tiny deterministic char/glaze nudge, never for structure.
 */

import {
  box, cyl, sph, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_DA_CHANGBAO = {
  id: 'da_changbao',
  name: '大腸包小腸',
  collectibleId: 5,
  colorHex: 0xc08a5a, // grilled glutinous-rice sausage — warm toasted cream

  /**
   * Build the geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny char/glaze nudge only.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    // Tiny per-instance char nudge so a tray of them isn't identical.
    const t = Math.floor(rng() * 0x040301);

    const rice = 0xe8d6b2 + t;   // 糯米腸 — pale toasted glutinous-rice cream
    const riceHi = 0xf2e6c8;     // sunlit top of the rice sausage
    const riceCut = 0xf6efdd;    // the soft split-open cut face (lighter, sticky)
    const grill = 0x9a6a38;      // grilled / charred surface tone
    const charEnd = 0x6e4322;    // darkened seared casing at the cut ends
    const pork = 0xa8482c + t;   // 香腸 — reddish-brown grilled pork sausage
    const porkHi = 0xc8603a;     // glazed highlight along the top of the pork
    const porkEnd = 0x5e2616;    // seared dark pork sausage tips
    const mark = 0x4f2414;       // dark diagonal grill-mark stripes

    return finish([
      // ============================================================ 大腸 (bun)
      // The split rice sausage = TWO long parallel half-bodies running along X,
      // pinched a touch apart so a groove opens along the top-center where the
      // little sausage sits. Each lobe is a fat cylinder laid on its side.
      // back lobe (sits a touch lower / behind)
      cyl(0.6, 0.6, 2.0, 10, rice, { rz: HALF_PI, z: -0.34, y: -0.04, hex2: riceHi }),
      // front lobe
      cyl(0.6, 0.6, 2.0, 10, rice, { rz: HALF_PI, z: 0.34, y: -0.04, hex2: riceHi }),
      // rounded seared end caps for each lobe (so the casing reads as closed)
      sph(0.58, charEnd, { ws: 6, hs: 3, x: -1.0, z: -0.34, y: -0.04 }),
      sph(0.58, charEnd, { ws: 6, hs: 3, x: 1.0, z: -0.34, y: -0.04 }),
      sph(0.58, charEnd, { ws: 6, hs: 3, x: -1.0, z: 0.34, y: -0.04 }),
      sph(0.58, charEnd, { ws: 6, hs: 3, x: 1.0, z: 0.34, y: -0.04 }),
      // sticky split cut-face running along the inner top of each lobe
      box(2.0, 0.16, 0.34, riceCut, { z: -0.2, y: 0.42 }),
      box(2.0, 0.16, 0.34, riceCut, { z: 0.2, y: 0.42 }),
      // a faint grilled char stripe low along each lobe (flat slab, cheap)
      box(1.9, 0.1, 0.22, grill, { z: -0.34, y: -0.5 }),
      box(1.9, 0.1, 0.22, grill, { z: 0.34, y: -0.5 }),

      // ============================================================ 小腸 (pork)
      // The grilled pork sausage nests in the groove, proud of the bun, slightly
      // shorter than the rice sausage with seared rounded tips poking out.
      cyl(0.36, 0.36, 1.74, 8, pork, { rz: HALF_PI, y: 0.34, hex2: porkHi }),
      sph(0.35, porkEnd, { ws: 6, hs: 3, x: -0.87, y: 0.34 }),
      sph(0.35, porkEnd, { ws: 6, hs: 3, x: 0.87, y: 0.34 }),

      // dark diagonal grill-mark stripes laddering across the top of the pork
      box(0.1, 0.08, 0.6, mark, { x: -0.45, y: 0.62, rz: 0.18, ry: 0.5 }),
      box(0.1, 0.08, 0.6, mark, { x: 0.0, y: 0.64, rz: 0.18, ry: 0.5 }),
      box(0.1, 0.08, 0.6, mark, { x: 0.45, y: 0.62, rz: 0.18, ry: 0.5 }),
    ]);
  },
};

export default COL_DA_CHANGBAO;
