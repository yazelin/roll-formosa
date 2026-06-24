/**
 * @file packs/nantou/collectibles/qingjing_sheep.js — Roll Formosa Nantou pack.
 *
 * 清境綿羊 (Qingjing Sheep) — collectibleId for nantou. A cute fluffy sheep
 * from the famous Qingjing Farm (清境農場). Features:
 * - Fluffy white wool body
 * - Black face and legs
 * - Chibi proportions (cute miniature)
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles.
 */

import { sph, cyl, box, finish } from '../geomHelpers.js';

const WOOL = 0xf8f8f0;        // fluffy white wool
const WOOL_SHADE = 0xe0e0d8;  // wool shadow
const FACE = 0x2a2a28;        // black face
const LEGS = 0x1a1a18;        // black legs
const EYE = 0x101010;         // eyes
const NOSE = 0x3a3a38;        // nose

export const COL_QINGJING_SHEEP = {
  id: 'qingjing_sheep',
  name: '清境綿羊',
  collectibleId: 11, // replaces shilin_big_chicken
  colorHex: 0xf8f8f0,

  buildGeometry(rng) {
    const parts = [];
    const j = (rng ? rng() - 0.5 : 0) * 0.02;

    // --- Fluffy wool body (big cloud-like ellipsoid) ---
    parts.push(sph(0.6, WOOL, { ws: 8, hs: 6, y: 0.5, sx: 1.2, sy: 0.85, sz: 0.9, hex2: WOOL_SHADE }));

    // --- Head (black face, smaller) ---
    parts.push(sph(0.28, FACE, { ws: 6, hs: 5, y: 0.7 + j, z: 0.55, sx: 0.9, sy: 1.0, sz: 0.8 }));

    // --- Wool tuft on head ---
    parts.push(sph(0.22, WOOL, { ws: 5, hs: 4, y: 0.88, z: 0.45, hex2: WOOL_SHADE }));

    // --- Ears (small, sticking out) ---
    parts.push(sph(0.1, FACE, { ws: 4, hs: 3, x: -0.22, y: 0.78, z: 0.5, sx: 0.5, sy: 1.0, sz: 0.8 }));
    parts.push(sph(0.1, FACE, { ws: 4, hs: 3, x: 0.22, y: 0.78, z: 0.5, sx: 0.5, sy: 1.0, sz: 0.8 }));

    // --- Eyes (small dots) ---
    parts.push(box(0.05, 0.06, 0.04, EYE, { x: -0.1, y: 0.72, z: 0.72 }));
    parts.push(box(0.05, 0.06, 0.04, EYE, { x: 0.1, y: 0.72, z: 0.72 }));

    // --- Nose ---
    parts.push(box(0.06, 0.05, 0.04, NOSE, { y: 0.62, z: 0.74 }));

    // --- Legs (4 short black legs) ---
    const legPositions = [
      { x: -0.3, z: 0.2 },
      { x: 0.3, z: 0.2 },
      { x: -0.3, z: -0.2 },
      { x: 0.3, z: -0.2 },
    ];
    for (const lp of legPositions) {
      parts.push(cyl(0.08, 0.06, 0.25, 6, LEGS, { x: lp.x, y: 0.12, z: lp.z }));
    }

    // --- Tail (small wool puff) ---
    parts.push(sph(0.12, WOOL, { ws: 4, hs: 3, y: 0.5, z: -0.55 }));

    return finish(parts);
  },
};

export default COL_QINGJING_SHEEP;
