/**
 * @file packs/tainan/collectibles/xiaolongbao.js — Roll Formosa Tainan pack,
 * COLLECTIBLE (rare-album item the ball rolls up).
 *
 * COL_XLB — 牛肉湯 (Tainan beef soup). The famous breakfast bowl of clear amber
 * beef broth poured over thin slices of raw beef that cook in the heat of the
 * soup. Silhouette: a wide shallow ceramic bowl of amber broth with several
 * thin pink-red beef slices draped over the rim and floating on top, plus a few
 * green-onion bits. Wide-and-low, a hand-held soup bowl, never tall.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a wide broth bowl draped with thin beef slices.
 *
 * Palette: pink-red raw beef, amber broth, soft golden onion, white bowl with
 * a painted rim. rng() only jitters the floating bits — never structure.
 * Budget: <= 350 triangles.
 */

import { box, cyl, cone, sph, torus, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

/** @type {CollectibleDef} */
export const COL_XLB = {
  id: 'xiaolongbao',
  name: '牛肉湯',
  collectibleId: 4,
  colorHex: 0xb5482f, // raw-beef pink-red

  buildGeometry(rng) {
    const beef = 0xb5482f;     // thin raw beef slice
    const beefHi = 0xd8755c;   // beef marbling highlight
    const broth = 0xc98e3c;    // amber beef broth
    const brothHi = 0xe3b262;  // broth surface sheen
    const bowlWhite = 0xf4f1e8; // white ceramic bowl
    const bowlShade = 0xddd8c9; // bowl shadow
    const bowlRim = 0x3a6fb0;   // painted blue rim
    const onion = 0x6fa838;     // green-onion bit

    const j = (a) => (rng() - 0.5) * a;

    const parts = [
      // --- WIDE CERAMIC BOWL ----------------------------------------------
      cyl(1.55, 1.0, 0.85, 12, bowlWhite, { y: 0.0, open: true, hex2: bowlShade }),
      cone(1.0, 0.42, 12, bowlWhite, { y: -0.55, hex2: bowlShade }), // floor
      torus(1.55, 0.07, 4, 12, bowlRim, { rx: HALF_PI, y: 0.42 }),   // blue rim

      // --- AMBER BROTH surface (sits high, near the rim) ------------------
      cyl(1.45, 1.45, 0.06, 12, broth, { y: 0.3, hex2: brothHi }),
    ];

    // --- THIN BEEF SLICES draped over the rim / floating on the broth -----
    // Each slice: a very thin flat box, slightly curled (small rotation),
    // a couple draped over the rim, a couple floating flat on the broth.
    const slices = [
      { x: 0.0, z: 0.95, y: 0.4, ry: 0.0, rx: 0.5, w: 0.9, d: 0.7 },   // over front rim
      { x: -0.85, z: -0.4, y: 0.42, ry: 0.7, rx: -0.45, w: 0.85, d: 0.6 }, // over back-left rim
      { x: 0.5, z: -0.3, y: 0.34, ry: -0.4, rx: 0.0, w: 0.8, d: 0.55 }, // floating
      { x: -0.2, z: 0.2, y: 0.34, ry: 0.3, rx: 0.0, w: 0.75, d: 0.5 },  // floating
      { x: 0.35, z: 0.55, y: 0.35, ry: 1.0, rx: 0.1, w: 0.7, d: 0.5 },  // floating
    ];
    for (let i = 0; i < slices.length; i++) {
      const s = slices[i];
      parts.push(
        box(s.w, 0.05, s.d, beef, {
          x: s.x, z: s.z, y: s.y, ry: s.ry, rx: s.rx, hex2: beefHi,
        }),
      );
    }

    // --- GREEN-ONION bits floating on the broth ---------------------------
    const onions = [[-0.3, 0.5], [0.6, -0.5], [0.1, -0.6], [-0.55, 0.35]];
    for (let i = 0; i < onions.length; i++) {
      const [ox, oz] = onions[i];
      parts.push(
        cyl(0.06, 0.06, 0.16, 5, onion, {
          rz: HALF_PI, ry: rng() * 3,
          x: ox + j(0.1), z: oz + j(0.1), y: 0.36,
        }),
      );
    }

    return finish(parts);
  },
};

export default COL_XLB;
