/**
 * @file packs/taitung/collectibles/millet_wine.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_MILLET_WINE — 小米酒 (Millet Wine). Traditional indigenous alcoholic
 * beverage made from millet, served in a gourd-shaped bottle or traditional
 * ceramic vessel. An important part of indigenous ceremonies.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_MILLET_WINE = {
  id: 'millet_wine',
  name: '小米酒',
  collectibleId: 2,
  colorHex: 0xc8a060,

  buildGeometry(rng) {
    const GOURD = 0xc8a060; // amber/tan gourd
    const GOURD_LO = 0xa88040;
    const WINE = 0xe8c878; // golden wine
    const CORD = 0x8a5a3a; // woven cord
    const BEAD = 0xc84040; // decorative bead

    const parts = [];

    // Lower bulb of gourd
    parts.push(sph(0.5, GOURD, {
      ws: 10, hs: 6,
      y: 0.5,
      hex2: GOURD_LO,
    }));

    // Upper narrow part
    parts.push(cyl(0.25, 0.18, 0.5, 10, GOURD_LO, {
      y: 1.0,
    }));

    // Neck
    parts.push(cyl(0.12, 0.14, 0.25, 8, GOURD, {
      y: 1.35,
    }));

    // Opening
    parts.push(cyl(0.15, 0.15, 0.06, 8, 0x3a3030, {
      y: 1.5,
    }));

    // Wine visible in opening
    parts.push(cyl(0.12, 0.12, 0.04, 8, WINE, {
      y: 1.48,
    }));

    // Decorative woven cord around neck
    for (let i = 0; i < 3; i++) {
      parts.push(cyl(0.16, 0.16, 0.04, 8, CORD, {
        y: 1.25 + i * 0.06,
      }));
    }

    // Decorative beads
    parts.push(sph(0.06, BEAD, { ws: 5, hs: 4, x: 0.18, y: 1.28, z: 0 }));
    parts.push(sph(0.05, 0x48a868, { ws: 5, hs: 4, x: 0.12, y: 1.32, z: 0.12 }));

    return finish(parts);
  },
};

export default COL_MILLET_WINE;
