/**
 * @file packs/changhua/collectibles/face_tea.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_FACE_TEA — 面茶 (face tea / roasted flour tea), a traditional Lukang
 * drink. Made from roasted wheat flour mixed with hot water, creating a
 * thick, brown, grainy beverage. Often served with sugar and sesame oil.
 * The distinctive brown color and grainy texture in a traditional bowl.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const TEA = 0xb89060;         // roasted flour brown
const TEA_D = 0x987040;       // darker swirl
const SESAME = 0xf0e0b0;      // sesame oil sheen
const BOWL = 0xe8e0d0;        // traditional ceramic bowl
const BOWL_D = 0xc8c0b0;      // bowl shadow

export const COL_FACE_TEA = {
  id: 'face_tea',
  name: '面茶',
  collectibleId: 8,
  colorHex: TEA,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201);
    const parts = [];

    // Traditional ceramic bowl
    parts.push(cyl(0.80, 0.68, 0.35, 10, BOWL, { y: 0.175, open: true, hex2: BOWL_D }));
    parts.push(cyl(0.64, 0.64, 0.04, 8, BOWL, { y: 0.02 }));

    // Face tea content - thick, grainy surface
    parts.push(cyl(0.62, 0.62, 0.25, 10, TEA + t, { y: 0.28, hex2: TEA_D }));

    // Grainy surface texture
    parts.push(sph(0.55, TEA, { ws: 10, hs: 3, y: 0.42, sy: 0.15, thetaLen: HALF_PI }));

    // Swirl pattern (how it's traditionally served)
    parts.push(box(0.35, 0.02, 0.06, TEA_D, { y: 0.44, ry: 0.3 }));
    parts.push(box(0.30, 0.02, 0.06, TEA_D, { y: 0.44, ry: -0.5 }));

    // Sesame oil drizzle on top (golden sheen)
    parts.push(sph(0.40, SESAME, { ws: 8, hs: 2, y: 0.46, sy: 0.05, thetaLen: HALF_PI }));

    // Some powder granules on the rim
    parts.push(sph(0.04, TEA, { ws: 3, hs: 2, x: 0.55, y: 0.38 }));
    parts.push(sph(0.03, TEA, { ws: 3, hs: 2, x: -0.52, y: 0.38, z: 0.15 }));

    return finish(parts);
  },
};

export default COL_FACE_TEA;
