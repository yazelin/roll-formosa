/**
 * @file packs/taipei/collectibles/santaizi.js — Roll Formosa Taipei pack, COLLECTIBLE.
 *
 * COL_SANTAIZI — 電音三太子 (Electro Third Prince). The temple-fair big-head
 * deity doll danced to electro/techno beats at Taiwanese festivals. Silhouette:
 * an OVERSIZED cartoon head (way bigger than the body) wearing an ornate
 * multi-peaked golden HELMET/CROWN with a red central jewel and side spikes,
 * a chubby rosy childlike face, and a tiny stubby body with little arms/legs.
 * Bright festival palette — gold crown, red robe, white face, pink cheeks.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (huge head, tiny body, tall
 * ornate crown) carry the read — never absolute size. <= 350 triangles, so
 * segment counts are kept low and cheap boxes/cones stand in for round detail.
 * rng() only nudges the cheek blush tint; never structure.
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// ---- festival palette -------------------------------------------------------
const GOLD = 0xf2c12e; // crown / helmet body
const GOLD_L = 0xffe27a; // crown highlight (top gradient)
const RED = 0xe0322b; // robe / central crown jewel
const RED_D = 0xb31f1b; // robe shadow / deep accents
const SKIN = 0xfbe9d6; // big-head face (porcelain doll)
const CHEEK = 0xf08c8c; // rosy blush cheeks
const BLACK = 0x241c1c; // eyes / hair fringe
const GREEN = 0x2fa05a; // crown side gem
const BLUE = 0x2f7fd0; // crown side gem
const WHITE = 0xf6f2ea; // collar / pompom trim

// faceted "gem" — a box rotated 45° on two axes reads as a cut jewel (12 tris,
// cheaper than ico's 20). Diameter d, color hex, placed at (x,y,z).
function gem(d, hex, x, y, z) {
  return box(d, d, d, hex, { x, y, z, ry: PI / 4, rz: PI / 4 });
}

export const COL_SANTAIZI = {
  id: 'santaizi',
  name: '電音三太子',
  collectibleId: 6,
  colorHex: GOLD,

  buildGeometry(rng) {
    const blush = CHEEK - (rng() < 0.5 ? 0 : 0x040404); // tiny per-instance cheek nudge

    return finish([
      // ===== TINY CHILDLIKE BODY (small relative to the giant head) ========
      cyl(0.46, 0.52, 0.62, 6, RED, { y: 0.46, hex2: RED_D }), // stubby red robe torso  (24)
      box(0.9, 0.1, 0.4, WHITE, { y: 0.78 }), // white collar slab                       (12)

      // little stubby legs / boots + arms (sleeves) + pompom mitts
      box(0.18, 0.24, 0.18, GOLD, { x: -0.2, y: 0.02 }), //                              (12)
      box(0.18, 0.24, 0.18, GOLD, { x: 0.2, y: 0.02 }), //                               (12)
      box(0.14, 0.34, 0.14, RED, { x: -0.5, y: 0.5, rz: 0.55 }), //                       (12)
      box(0.14, 0.34, 0.14, RED, { x: 0.5, y: 0.5, rz: -0.55 }), //                       (12)
      gem(0.18, WHITE, -0.64, 0.34), //                                                  (12)
      gem(0.18, WHITE, 0.64, 0.34), //                                                   (12)

      // ===== OVERSIZED CARTOON HEAD (dominant mass) =======================
      sph(0.92, SKIN, { ws: 6, hs: 4, y: 1.62 }), //                                      (36)
      sph(0.94, BLACK, { ws: 6, hs: 2, y: 1.66, thetaLen: HALF_PI * 0.9 }), // hair fringe (18)

      // big flat cartoon eyes (dark boxes) + smiling mouth
      box(0.18, 0.24, 0.06, BLACK, { x: -0.32, y: 1.62, z: 0.82 }), //                    (12)
      box(0.18, 0.24, 0.06, BLACK, { x: 0.32, y: 1.62, z: 0.82 }), //                     (12)
      box(0.26, 0.07, 0.06, RED_D, { y: 1.34, z: 0.86 }), // mouth                        (12)

      // rosy blush cheeks
      box(0.18, 0.12, 0.05, blush, { x: -0.5, y: 1.42, z: 0.74 }), //                     (12)
      box(0.18, 0.12, 0.05, blush, { x: 0.5, y: 1.42, z: 0.74 }), //                      (12)

      // ===== ORNATE GOLDEN HELMET / CROWN =================================
      cyl(0.96, 0.98, 0.3, 6, GOLD, { y: 1.96, hex2: GOLD_L }), // helmet brow band       (24)
      cone(0.82, 0.7, 6, GOLD, { y: 2.42, hex2: GOLD_L }), // tapered crown dome          (12)

      // tall central crown peak with a red jewel finial + gold tip
      cone(0.22, 0.5, 6, GOLD, { y: 2.8, hex2: GOLD_L }), //                              (12)
      gem(0.28, RED, 0, 3.12), // red jewel finial atop the central peak                  (12)

      // front-center crown jewel (big red gem on the brow band)
      gem(0.3, RED, 0, 2.02, 0.92), //                                                    (12)

      // symmetric ornate side spikes / wings — gold cones tipped with gems
      cone(0.14, 0.5, 5, GOLD, { x: -0.86, y: 2.22, rz: 0.5, hex2: GOLD_L }), //          (10)
      cone(0.14, 0.5, 5, GOLD, { x: 0.86, y: 2.22, rz: -0.5, hex2: GOLD_L }), //          (10)
      gem(0.22, GREEN, -1.04, 2.42), //                                                   (12)
      gem(0.22, BLUE, 1.04, 2.42), // mismatched green/blue = festive ornate read         (12)
    ]);
  },
};

export default COL_SANTAIZI;
