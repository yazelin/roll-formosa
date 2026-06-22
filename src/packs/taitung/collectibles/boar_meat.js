/**
 * @file packs/taitung/collectibles/boar_meat.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_BOAR_MEAT — 山豬肉 (Wild Boar Meat). A traditional indigenous food,
 * often grilled on skewers or smoked. Wild boar hunting is an important
 * part of indigenous culture in Taitung's mountain areas.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_BOAR_MEAT = {
  id: 'boar_meat',
  name: '山豬肉',
  collectibleId: 8,
  colorHex: 0xa85848,

  buildGeometry(rng) {
    const MEAT = 0xa85848; // red meat
    const MEAT_LO = 0x884838;
    const FAT = 0xf0e8d8; // fat layers
    const CHAR = 0x4a3028; // charred edges
    const STICK = 0x8a6a4a;

    const parts = [];

    // Main meat chunk (irregular shape)
    parts.push(box(0.9, 0.5, 0.6, MEAT, { y: 0.25, hex2: MEAT_LO }));

    // Fat marbling layers
    parts.push(box(0.85, 0.08, 0.55, FAT, { y: 0.38 }));
    parts.push(box(0.7, 0.06, 0.5, FAT, { y: 0.15, x: 0.08 }));

    // Charred edges (from grilling)
    parts.push(box(0.92, 0.06, 0.62, CHAR, { y: 0.52 }));
    parts.push(box(0.92, 0.06, 0.62, CHAR, { y: 0.02 }));

    // Second piece on skewer
    parts.push(box(0.7, 0.4, 0.5, MEAT_LO, { x: 0.9, y: 0.2, hex2: MEAT }));
    parts.push(box(0.65, 0.06, 0.45, FAT, { x: 0.9, y: 0.32 }));
    parts.push(box(0.72, 0.05, 0.52, CHAR, { x: 0.9, y: 0.42 }));

    // Third piece
    parts.push(box(0.6, 0.35, 0.45, MEAT, { x: -0.8, y: 0.18, hex2: MEAT_LO }));
    parts.push(box(0.55, 0.05, 0.4, FAT, { x: -0.8, y: 0.28 }));

    // Bamboo skewer
    parts.push(cyl(0.04, 0.04, 2.6, 6, STICK, {
      rz: HALF_PI,
      y: 0.25,
    }));

    return finish(parts);
  },
};

export default COL_BOAR_MEAT;
