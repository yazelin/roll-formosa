/**
 * @file packs/matsu/collectibles/cuttlefish.js — Roll Formosa Matsu pack.
 *
 * 墨魚乾 (Dried Cuttlefish) — code 81. A Matsu specialty dried seafood item.
 * The flattened, amber-brown dried cuttlefish with its distinctive oval body
 * shape and tentacle ends. Often seen drying in the sun at Matsu harbors,
 * a beloved local snack and cooking ingredient.
 *
 * <= 350 triangles.
 */

import { sph, cyl, box, finish, PI } from '../geomHelpers.js';

const BODY = 0xb8956a;       // amber-brown dried color
const BODY_HI = 0xd4aa7a;    // lighter highlights
const TENTACLE = 0xa08058;   // slightly darker tentacles
const SPOTS = 0x8a6a4a;      // darker markings

export const COL_CUTTLEFISH = {
  id: 'cuttlefish',
  name: '墨魚乾',
  colorHex: 0xb8956a,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Main body (flattened oval - the mantle)
    parts.push(sph(0.6, BODY, { ws: 8, hs: 5, sx: 0.9, sy: 0.2, sz: 1.4, y: 0.12, hex2: BODY_HI }));

    // Body texture/ridges
    parts.push(sph(0.2, BODY_HI, { ws: 5, hs: 3, sx: 0.8, sy: 0.1, sz: 1.2, y: 0.18, z: 0.15 }));
    parts.push(sph(0.18, BODY_HI, { ws: 5, hs: 3, sx: 0.7, sy: 0.08, sz: 1.0, y: 0.18, z: -0.1 }));

    // Darker spots/markings
    parts.push(sph(0.1, SPOTS, { ws: 4, hs: 2, sy: 0.15, x: 0.15, y: 0.2, z: 0.25 }));
    parts.push(sph(0.08, SPOTS, { ws: 4, hs: 2, sy: 0.15, x: -0.12, y: 0.2, z: 0.1 }));
    parts.push(sph(0.09, SPOTS, { ws: 4, hs: 2, sy: 0.15, x: 0.05, y: 0.2, z: -0.2 }));

    // Head area (slightly wider end)
    parts.push(sph(0.35, BODY, { ws: 6, hs: 4, sx: 1.0, sy: 0.25, sz: 0.8, y: 0.14, z: -0.6, hex2: BODY_HI }));

    // Tentacles (short dried appendages at head end)
    const tentY = 0.1;
    const tentZ = -0.85;
    for (let i = 0; i < 6; i++) {
      const x = (i - 2.5) * 0.12;
      const len = 0.2 + rng() * 0.1;
      const curl = (rng() - 0.5) * 0.3;
      parts.push(cyl(0.04, 0.02, len, 4, TENTACLE, {
        x,
        y: tentY,
        z: tentZ - len / 2,
        rx: -0.2 + curl,
        rz: (i - 2.5) * 0.08
      }));
    }

    // Side fins (dried, curled edges)
    parts.push(sph(0.2, BODY_HI, { ws: 5, hs: 3, sx: 0.15, sy: 0.1, sz: 0.6, x: 0.45, y: 0.1, z: 0.1 }));
    parts.push(sph(0.2, BODY_HI, { ws: 5, hs: 3, sx: 0.15, sy: 0.1, sz: 0.6, x: -0.45, y: 0.1, z: 0.1 }));

    return finish(parts);
  },
};

export default COL_CUTTLEFISH;
