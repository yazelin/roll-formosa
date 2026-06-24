/**
 * @file packs/changhua/collectibles/phoenix_eye_cake.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_PHOENIX_EYE — 鳳眼糕 (phoenix eye cake), a famous Lukang traditional
 * pastry. Named for its eye-like shape, this small, delicate cake has a
 * white powdery exterior with a sweet filling. Often stacked in traditional
 * red gift boxes. The almond-shaped form with powdery white coating is key.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const POWDER = 0xf8f4f0;      // white powdery coating
const POWDER_D = 0xe8e0d8;    // slightly darker base
const FILLING = 0xd8c8a0;     // sweet mung bean filling
const GIFT_BOX = 0xc82020;    // traditional red gift box

export const COL_PHOENIX_EYE = {
  id: 'phoenix_eye_cake',
  name: '鳳眼糕',
  collectibleId: 6,
  colorHex: POWDER,

  buildGeometry(rng) {
    const parts = [];

    // Traditional red gift box (底座)
    parts.push(box(1.0, 0.25, 0.70, GIFT_BOX, { y: 0.125 }));
    parts.push(box(0.96, 0.04, 0.66, 0xf8d888, { y: 0.27 })); // gold trim

    // Stack of phoenix eye cakes - simplified to 4 cakes total
    // Bottom layer (2 cakes)
    parts.push(sph(0.22, POWDER_D, {
      ws: 5, hs: 3, sx: 0.50, sy: 0.35, sz: 1.0,
      x: -0.25, y: 0.38, z: 0, hex2: POWDER,
    }));
    parts.push(sph(0.22, POWDER_D, {
      ws: 5, hs: 3, sx: 0.50, sy: 0.35, sz: 1.0,
      x: 0.25, y: 0.38, z: 0, hex2: POWDER,
    }));

    // Top layer (2 cakes offset)
    parts.push(sph(0.22, POWDER, {
      ws: 5, hs: 3, sx: 0.50, sy: 0.35, sz: 1.0,
      x: 0, y: 0.52, z: -0.10, hex2: 0xfff8f4,
    }));
    parts.push(sph(0.22, POWDER, {
      ws: 5, hs: 3, sx: 0.50, sy: 0.35, sz: 1.0,
      x: 0, y: 0.52, z: 0.10, hex2: 0xfff8f4,
    }));

    return finish(parts);
  },
};

export default COL_PHOENIX_EYE;
