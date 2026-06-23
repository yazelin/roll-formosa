/**
 * @file packs/taitung/collectibles/surfboard.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_SURFBOARD — 衝浪板 (Surfboard). Taitung's east coast, especially areas
 * like Donghe and Jinzun, is famous for surfing. The Pacific swells make it
 * one of Taiwan's best surfing destinations.
 */

import { box, cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_SURFBOARD = {
  id: 'surfboard',
  name: '衝浪板',
  collectibleId: 11,
  colorHex: 0x48a8d8,

  buildGeometry(rng) {
    const DECK = 0x48a8d8; // ocean blue
    const DECK_LO = 0x3898c8;
    const STRIPE_W = 0xf0f0e8;
    const STRIPE_Y = 0xf8c848;
    const FIN = 0x2a2a28;
    const WAX = 0xf8f8f0;

    const parts = [];

    // Main board body (elongated rounded shape)
    parts.push(box(2.4, 0.12, 0.6, DECK, {
      y: 0.06,
      hex2: DECK_LO,
    }));

    // Rounded nose
    parts.push(sph(0.3, DECK, {
      ws: 8, hs: 4,
      sx: 0.5,
      sz: 0.9,
      x: 1.35,
      y: 0.06,
    }));

    // Pointed tail
    parts.push(cone(0.25, 0.4, 6, DECK_LO, {
      rz: -HALF_PI,
      x: -1.35,
      sy: 0.3,
      sz: 0.8,
    }));

    // Decorative stripes
    parts.push(box(2.0, 0.13, 0.08, STRIPE_W, { y: 0.07, z: 0.18 }));
    parts.push(box(2.0, 0.13, 0.08, STRIPE_Y, { y: 0.07, z: 0 }));
    parts.push(box(2.0, 0.13, 0.08, STRIPE_W, { y: 0.07, z: -0.18 }));

    // Fins (thruster setup - 3 fins)
    // Center fin
    parts.push(box(0.15, 0.18, 0.04, FIN, {
      x: -0.9,
      y: -0.06,
      rx: 0.2,
    }));
    // Side fins
    parts.push(box(0.12, 0.14, 0.04, FIN, {
      x: -0.7,
      y: -0.05,
      z: 0.18,
      ry: 0.3,
    }));
    parts.push(box(0.12, 0.14, 0.04, FIN, {
      x: -0.7,
      y: -0.05,
      z: -0.18,
      ry: -0.3,
    }));

    // Wax patches (where feet go)
    parts.push(box(0.4, 0.02, 0.35, WAX, { x: 0.3, y: 0.13, z: 0 }));
    parts.push(box(0.35, 0.02, 0.3, WAX, { x: -0.3, y: 0.13, z: 0 }));

    // Leash plug
    parts.push(cyl(0.03, 0.03, 0.04, 6, 0x2a2a28, { x: -1.0, y: 0.06 }));

    return finish(parts);
  },
};

export default COL_SURFBOARD;
