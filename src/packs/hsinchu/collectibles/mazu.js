/**
 * @file packs/hsinchu/collectibles/mazu.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * 媽祖 — the sea-goddess deity statue, a rare hand-held figurine the katamari
 * can roll up. Silhouette: a serene SEATED figure in wide ornate robes (a
 * bell-shaped skirt that flares to the ground), a small folded-hands lap, a
 * round serene face, and — the read-defining detail — a FLAT-TOPPED beaded
 * crown (冕, mian) whose front edge drips short strings of beads (旒). Palette
 * is temple red lacquer + gold trim, the classic Mazu icon look.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the read is PROPORTION: wide robed base,
 * compact seated torso, flat crown wider than the head. A small statue —
 * never tall/thin. <= 350 triangles. rng() only nudges the lacquer tint a
 * hair; structure is fixed.
 */

import { box, cyl, sph, torus, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const GOLD = 0xe8b740; // crown / robe trim / beads — temple gold
const RED = 0xb01e22; // lacquer robe red
const SKIN = 0xf0d8b8; // serene face / hands — pale gilt skin

export const COL_MAZU = {
  id: 'mazu',
  name: '媽祖',
  collectibleId: 12,
  colorHex: RED,

  buildGeometry(rng) {
    // tiny per-instance lacquer nudge — cosmetic only, never structural
    const red = RED + (rng() < 0.5 ? 0x000000 : 0x080404);
    const redDeep = 0x7e1418; // shadowed lower robe (gradient bottom)
    const redLit = 0xc83034; // sunlit upper robe (gradient top)

    return finish([
      // --- ROBED BASE: bell-shaped skirt flaring to the ground -----------
      cyl(1.18, 1.44, 0.5, 10, redDeep, { y: 0.25, hex2: red }), // flared hem, dark→red up

      // --- LAP / SEATED TORSO: narrowing robe body -----------------------
      cyl(0.72, 1.18, 0.58, 8, red, { y: 0.79, hex2: redLit }), // belly of the robe
      // folded hands resting in the lap (small flat gilt block)
      box(0.42, 0.12, 0.26, SKIN, { y: 0.78, z: 0.58 }),
      box(0.46, 0.06, 0.28, GOLD, { y: 0.72, z: 0.58 }), // hand-cradle sleeve cuff

      // --- CHEST / SHOULDERS: upper robe with collar ---------------------
      cyl(0.5, 0.72, 0.42, 8, red, { y: 1.21, hex2: redLit }),
      torus(0.5, 0.06, 2, 8, GOLD, { rx: HALF_PI, y: 1.2 }), // shoulder collar gold
      // two draped sleeves bulging at the sides
      sph(0.3, red, { ws: 4, hs: 3, x: 0.62, y: 0.94, sy: 0.85 }),
      sph(0.3, red, { ws: 4, hs: 3, x: -0.62, y: 0.94, sy: 0.85 }),

      // --- NECK + HEAD: round serene face --------------------------------
      cyl(0.22, 0.24, 0.14, 6, SKIN, { y: 1.46, open: true }), // neck (caps hidden)
      sph(0.36, SKIN, { ws: 7, hs: 5, y: 1.74, sy: 1.05 }), // head

      // --- FLAT-TOPPED BEADED CROWN (冕, mian) ---------------------------
      // a wide flat board sitting on the head — wider than the face, the
      // single most recognizable Mazu-icon feature.
      cyl(0.34, 0.34, 0.16, 8, RED, { y: 1.99, open: true }), // crown band (caps hidden by head/board)
      box(0.7, 0.07, 0.46, 0x1a1a1a, { y: 2.11 }), // flat black crown board (冕板) — TOP
      box(0.72, 0.03, 0.48, GOLD, { y: 2.15 }), // gold edge of the board

      // --- 旒 BEAD STRINGS dripping from the crown's front edge ----------
      // front row of beads (5 short strands) — the dangling jeweled curtain.
      // open cylinders: end caps are never seen, so we skip them (cheaper).
      cyl(0.02, 0.02, 0.22, 4, GOLD, { x: 0.26, y: 1.99, z: 0.24, open: true }),
      cyl(0.02, 0.02, 0.25, 4, GOLD, { x: 0.13, y: 1.98, z: 0.24, open: true }),
      cyl(0.02, 0.02, 0.27, 4, GOLD, { x: 0.0, y: 1.97, z: 0.24, open: true }),
      cyl(0.02, 0.02, 0.25, 4, GOLD, { x: -0.13, y: 1.98, z: 0.24, open: true }),
      cyl(0.02, 0.02, 0.22, 4, GOLD, { x: -0.26, y: 1.99, z: 0.24, open: true }),

      // --- centered gold forehead jewel (額珠) ---------------------------
      sph(0.06, GOLD, { ws: 4, hs: 2, y: 1.78, z: 0.33 }),
    ]);
  },
};

export default COL_MAZU;
