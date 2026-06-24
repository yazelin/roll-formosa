/**
 * @file packs/yilan/collectibles/ox_tongue_biscuit.js — Roll Formosa Yilan pack.
 *
 * 牛舌餅 (Ox Tongue Biscuit) — collectibleId 1. Yilan's famous crispy,
 * tongue-shaped pastry filled with maltose. Golden-brown elongated oval
 * shape resembling an ox tongue.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const BISCUIT_GOLD = 0xc8a040;   // golden brown crust
const BISCUIT_DARK = 0xa88030;  // darker baked edges
const SESAME = 0xf0e8d0;        // sesame seeds on top

export const COL_OX_TONGUE_BISCUIT = {
  id: 'col_ox_tongue_biscuit',
  name: '牛舌餅',
  collectibleId: 1,
  colorHex: 0xc8a040, // golden biscuit — the read color

  buildGeometry(rng) {
    const parts = [];

    // Main biscuit body - elongated oval (tongue shape)
    parts.push(
      cyl(0.45, 0.45, 0.12, 10, BISCUIT_GOLD, {
        y: 0.06,
        sx: 1.8,  // elongate to tongue shape
        sz: 1.0,
        hex2: BISCUIT_DARK,
      })
    );

    // Top surface slightly domed
    parts.push(
      sph(0.42, BISCUIT_GOLD, {
        y: 0.10,
        sx: 1.8,
        sy: 0.3,
        sz: 1.0,
        ws: 8,
        hs: 4,
      })
    );

    // Baked darker rim
    parts.push(
      cyl(0.48, 0.48, 0.04, 10, BISCUIT_DARK, {
        y: 0.02,
        sx: 1.8,
        sz: 1.0,
      })
    );

    // Sesame seeds scattered on top
    const seedCount = 8;
    for (let i = 0; i < seedCount; i++) {
      const angle = (i / seedCount) * PI * 2 + (rng ? rng() * 0.5 : i * 0.1);
      const dist = 0.15 + (rng ? rng() * 0.2 : 0.1);
      parts.push(
        sph(0.03, SESAME, {
          x: Math.cos(angle) * dist * 1.5,
          y: 0.16,
          z: Math.sin(angle) * dist * 0.8,
          ws: 4,
          hs: 3,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_OX_TONGUE_BISCUIT;
