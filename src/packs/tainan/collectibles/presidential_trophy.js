/**
 * @file packs/tainan/collectibles/presidential_trophy.js — Roll Formosa collectible.
 *
 * 關廟鳳梨 (Guanmiao pineapple) — Tainan Guanmiao's famous sweet pineapple. As a
 * small hand-rollable collectible it reads as a classic pineapple: an oval
 * golden-brown body with a faceted diamond skin, crowned by a spiky tuft of green
 * leaves spiking up and out. The stretched body + leafy spike crown is the read.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the silhouette: a tall oval
 * fruit body topped by a crown of leaves about half the body height. A low-detail
 * ico gives the diamond-skin faceting cheaply. rng only nudges the leaves a hair.
 * Well under the 350-triangle collectible budget.
 */

import { cone, ico, finish, PI } from '../geomHelpers.js';

const FLESH = 0xd9a52e;  // golden-brown pineapple skin
const FLESH_T = 0xeac558; // sunlit highlight of the skin
const FLESH_D = 0xb07f1c; // shadowed skin (gradient base)
const LEAF = 0x4f8a3a;    // green crown leaf
const LEAF_T = 0x76b057;  // sunlit leaf tip
const LEAF_D = 0x356026;  // shadowed inner leaf

export const COL_PRES_TROPHY = {
  id: 'presidential_trophy',
  name: '關廟鳳梨',
  collectibleId: 9,
  colorHex: FLESH,
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.08; // micro jitter on the leaves, never structural
    const parts = [];

    // ---- Fruit body (oval, faceted diamond skin) -------------------------
    // A detail-1 icosahedron stretched tall gives the rounded oval body with a
    // faceted "diamond skin" feel, far cheaper than a textured sphere.
    parts.push(
      ico(0.78, 1, FLESH, { y: -0.18, sy: 1.4, hex2: FLESH_T })
    );
    // A second smaller ico low down deepens the base shading.
    parts.push(
      ico(0.62, 0, FLESH_D, { y: -0.7, sy: 0.9, hex2: FLESH })
    );

    // ---- Crown of spiky green leaves -------------------------------------
    // Several cones fanning up and out from the top, plus one tall central
    // spike — the unmistakable pineapple tuft.
    parts.push(cone(0.16, 0.9, 5, LEAF, { x: j, y: 0.82, hex2: LEAF_T })); // central spike
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * PI * 2;
      const tilt = 0.6 + (rng() - 0.5) * 0.12;
      parts.push(
        cone(0.12, 0.66, 4, LEAF, {
          rz: Math.cos(a) * tilt,
          rx: Math.sin(a) * tilt,
          x: Math.cos(a) * 0.18,
          z: Math.sin(a) * 0.18,
          y: 0.62,
          hex2: i % 2 ? LEAF_T : LEAF_D,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_PRES_TROPHY;
