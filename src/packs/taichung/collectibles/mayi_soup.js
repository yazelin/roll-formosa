/**
 * @file packs/taichung/collectibles/mayi_soup.js — Roll Formosa Taichung pack.
 *
 * COLLECTIBLE 麻薏湯 (má-ínn soup): Taichung's summer signature — a squat ceramic
 * bowl brimming with thick, dark-green jute-leaf (麻薏) soup, with a couple of
 * pale orange sweet-potato (地瓜) dice settled at the surface. A small
 * hand-held bowl of green soup, read from a 3/4 view.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js: box/cyl +
 * finish); the geometry math is an engine red line. finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1), so we author RELATIVE
 * proportions, not absolute size. Tri budget <= 350 (kept low via small radial
 * segment counts). rng() only nudges the sweet-potato dice + soup tint, never
 * structure.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_MAYI_SOUP = {
  id: 'mayi_soup',
  name: '麻薏湯',
  collectibleId: 6,
  colorHex: 0x4a5d2e, // dark jute-green soup

  buildGeometry(rng) {
    const bowlOut = 0xeae3d4;  // warm off-white ceramic outer glaze
    const bowlIn = 0xd9cfbb;   // shaded ceramic interior
    const bowlRim = 0xf4eee2;  // bright rim lip highlight
    const foot = 0xcfc6b2;     // unglazed foot ring (a touch darker)
    const soup = 0x4a5d2e;     // thick dark jute-green
    const soupTop = 0x6f8540;  // lighter, sun-lit soup surface
    const yam = 0xd99a55;      // sweet-potato dice (orange)
    const yamHi = 0xeab877;    // sweet-potato highlight

    // tiny deterministic nudge for the loose dice (never structural)
    const j = (a) => (rng() - 0.5) * a;
    // faint per-instance soup tint so no two bowls look identical
    const tint = Math.floor(rng() * 0x040502);

    return finish([
      // --- ceramic bowl shell (squat, wider at the mouth) -------------------
      // Outer wall: open tube flaring out toward the top, glaze gradient.
      cyl(1.18, 0.62, 0.92, 14, bowlOut, {
        y: 0.5, open: true, hex2: 0xf2ecdf,
      }),
      // Inner wall liner (slightly smaller) so the bowl reads as having walls,
      // shaded so the interior looks recessed.
      cyl(1.06, 0.56, 0.9, 14, bowlIn, {
        y: 0.52, open: true, hex2: 0xe6ddca,
      }),
      // Bowl base disc (closes the bottom, sits on the foot).
      cyl(0.58, 0.5, 0.12, 10, bowlOut, { y: 0.12 }),
      // Foot ring the bowl stands on (short open tube under the base).
      cyl(0.5, 0.46, 0.18, 12, foot, { y: 0.07, open: true }),
      // Bright rim lip at the mouth (thin ring band).
      cyl(1.2, 1.16, 0.08, 14, bowlRim, { y: 0.95 }),

      // --- soup: a flat dark-green surface filling the bowl to the brim -----
      // Sits just below the rim; gradient from deep green base to lit top.
      cyl(1.04, 0.7, 0.66, 14, soup + tint, { y: 0.6, hex2: soupTop }),
      // Thin lighter skin disc right at the soup surface (the sun-lit read).
      cyl(1.02, 1.0, 0.05, 14, soupTop, { y: 0.9 }),

      // --- sweet-potato (地瓜) dice settled at the surface ------------------
      box(0.26, 0.2, 0.26, yam, {
        x: 0.3 + j(0.08), y: 0.96, z: 0.16 + j(0.06), ry: 0.5 + j(0.4), hex2: yamHi,
      }),
      box(0.24, 0.18, 0.24, yam, {
        x: -0.34 + j(0.08), y: 0.95, z: -0.1 + j(0.06), ry: -0.6 + j(0.4), hex2: yamHi,
      }),
      box(0.2, 0.16, 0.2, yam, {
        x: 0.02 + j(0.08), y: 0.95, z: -0.34 + j(0.06), ry: 0.2 + j(0.4), hex2: yamHi,
      }),
    ]);
  },
};

export default COL_MAYI_SOUP;
