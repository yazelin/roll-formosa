/**
 * @file packs/taitung/collectibles/rice_bento.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_RICE_BENTO — 池上飯包 (Chishang Rice Lunchbox). The famous wooden
 * lunchbox from Chishang filled with premium local rice, pickles, and
 * traditional side dishes. An icon of Taitung's culinary heritage.
 */

import { box, cyl, finish, PI } from '../geomHelpers.js';

export const COL_RICE_BENTO = {
  id: 'rice_bento',
  name: '池上飯包',
  collectibleId: 5,
  colorHex: 0xc8a060,

  buildGeometry(rng) {
    const WOOD = 0xc8a060; // wooden box
    const WOOD_LO = 0xa88040;
    const RICE = 0xf8f0e0; // white rice
    const PORK = 0xa86848; // braised pork
    const PICKLE_Y = 0xe8c848; // pickled radish
    const PICKLE_G = 0x68a858; // pickled vegetable
    const EGG = 0xf8d070; // egg yolk color
    const EGG_W = 0xf0f0e8;

    const parts = [];

    // Wooden box base
    parts.push(box(1.6, 0.18, 1.2, WOOD, { y: 0.09, hex2: WOOD_LO }));
    // Wooden walls
    parts.push(box(1.64, 0.35, 0.06, WOOD_LO, { y: 0.34, z: 0.58 }));
    parts.push(box(1.64, 0.35, 0.06, WOOD_LO, { y: 0.34, z: -0.58 }));
    parts.push(box(0.06, 0.35, 1.2, WOOD_LO, { y: 0.34, x: 0.79 }));
    parts.push(box(0.06, 0.35, 1.2, WOOD_LO, { y: 0.34, x: -0.79 }));

    // Fluffy rice (main portion)
    parts.push(box(1.0, 0.22, 1.0, RICE, { x: -0.2, y: 0.4 }));

    // Sliced braised pork on top of rice
    parts.push(box(0.5, 0.08, 0.4, PORK, { x: -0.2, y: 0.56, ry: 0.1 }));
    parts.push(box(0.45, 0.08, 0.35, 0xb87858, { x: -0.15, y: 0.55, ry: -0.15 }));

    // Side dishes area
    // Pickled radish (yellow)
    parts.push(box(0.25, 0.15, 0.4, PICKLE_Y, { x: 0.55, y: 0.35, z: 0.25 }));
    // Pickled vegetables (green)
    parts.push(box(0.25, 0.12, 0.35, PICKLE_G, { x: 0.55, y: 0.33, z: -0.25 }));

    // Braised egg half
    parts.push(cyl(0.12, 0.12, 0.08, 8, EGG_W, { x: 0.55, y: 0.48, z: 0 }));
    parts.push(cyl(0.06, 0.06, 0.09, 6, EGG, { x: 0.55, y: 0.49, z: 0 }));

    return finish(parts);
  },
};

export default COL_RICE_BENTO;
