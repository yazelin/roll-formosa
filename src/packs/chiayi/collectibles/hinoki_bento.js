/**
 * @file packs/chiayi/collectibles/hinoki_bento.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_HINOKI_BENTO — 檜木便當盒 (Hinoki Wood Bento Box). Traditional Japanese-style
 * wooden bento box made from local hinoki cypress wood, associated with the
 * 檜意森活村 (Hinoki Village) heritage. Light-colored aromatic wood grain.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { box, cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const HINOKI = 0xd8c8a0;    // pale hinoki wood
const HINOKI_HI = 0xe8dcc0; // wood highlight
const GRAIN = 0xc8b080;     // wood grain
const BAND = 0x8a6a4a;      // decorative band
const RICE = 0xf8f4e8;      // rice inside

export const COL_HINOKI_BENTO = {
  id: 'hinoki_bento',
  name: '檜木便當盒',
  colorHex: 0xd8c8a0,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.015;
    const parts = [];

    // Bento box base
    parts.push(box(0.7, 0.28, 0.5, HINOKI, { y: 0.14, hex2: HINOKI_HI }));

    // Wood grain lines on sides
    for (const gx of [-0.25, 0, 0.25]) {
      parts.push(box(0.015, 0.22, 0.02, GRAIN, { x: gx, y: 0.14, z: 0.26 }));
    }

    // Inner compartment divider
    parts.push(box(0.02, 0.18, 0.42, GRAIN, { x: 0.15, y: 0.17 }));

    // Rice visible inside (main compartment)
    parts.push(box(0.32, 0.08, 0.38, RICE, { x: -0.12, y: 0.25 }));

    // Some food in smaller compartment (simple colored blocks)
    parts.push(box(0.15, 0.06, 0.12, 0xc86030, { x: 0.25, y: 0.22, z: 0.1 })); // meat
    parts.push(box(0.12, 0.05, 0.1, 0x48a048, { x: 0.25, y: 0.22, z: -0.1 + j })); // vegetable

    // Lid (slightly lifted to show contents)
    parts.push(box(0.72, 0.06, 0.52, HINOKI, { y: 0.38, x: 0.1, rz: 0.15, hex2: HINOKI_HI }));
    // Lid grain
    parts.push(box(0.6, 0.02, 0.015, GRAIN, { y: 0.4, x: 0.1, z: 0, rz: 0.15 }));

    // Decorative band/strap
    parts.push(box(0.06, 0.02, 0.54, BAND, { y: 0.3, x: -0.25 }));

    return finish(parts);
  },
};

export default COL_HINOKI_BENTO;
