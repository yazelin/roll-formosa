/**
 * @file packs/pingtung/collectibles/penguin.js — Roll Formosa Pingtung pack.
 *
 * 企鵝 (Penguin) — collectibleId 7. The adorable penguins at the
 * National Museum of Marine Biology and Aquarium (海生館) in Checheng.
 * Silhouette: a cute standing penguin with classic black back, white belly,
 * orange beak and feet.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, cone, box, finish, HALF_PI } from '../geomHelpers.js';

const BLACK = 0x1a1a20;        // back/head black
const WHITE = 0xf8f8f8;        // belly white
const ORANGE = 0xe87020;       // beak and feet

export const COL_PENGUIN = {
  id: 'penguin',
  name: '企鵝',
  collectibleId: 7,
  colorHex: BLACK,

  buildGeometry(rng) {
    const parts = [];

    // --- Body (simplified: single sphere with belly/back) ---
    parts.push(sph(0.6, BLACK, { ws: 6, hs: 4, sx: 0.85, sy: 1.2, sz: 0.8, y: 0.5, hex2: WHITE }));

    // --- Head ---
    parts.push(sph(0.38, BLACK, { ws: 5, hs: 4, y: 1.3, hex2: WHITE }));

    // --- Eyes (boxes instead of spheres) ---
    parts.push(box(0.06, 0.06, 0.04, 0x101010, { x: 0.18, y: 1.38, z: 0.28 }));
    parts.push(box(0.06, 0.06, 0.04, 0x101010, { x: -0.18, y: 1.38, z: 0.28 }));

    // --- Beak ---
    parts.push(cone(0.08, 0.2, 4, ORANGE, { y: 1.25, z: 0.4, rx: HALF_PI - 0.2 }));

    // --- Wings (boxes) ---
    parts.push(box(0.08, 0.4, 0.2, BLACK, { x: 0.5, y: 0.5, rz: -0.25 }));
    parts.push(box(0.08, 0.4, 0.2, BLACK, { x: -0.5, y: 0.5, rz: 0.25 }));

    // --- Feet (boxes) ---
    parts.push(box(0.15, 0.06, 0.2, ORANGE, { x: 0.18, y: -0.1, z: 0.15 }));
    parts.push(box(0.15, 0.06, 0.2, ORANGE, { x: -0.18, y: -0.1, z: 0.15 }));

    return finish(parts);
  },
};

export default COL_PENGUIN;
