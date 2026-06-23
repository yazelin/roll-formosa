/**
 * @file packs/newtaipei/collectibles/brown_sugar_cake.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_BROWN_SUGAR_CAKE — 黑糖糕 (Brown Sugar Cake). A traditional steamed
 * cake made with brown sugar (黑糖), popular in Jiufen and other old street
 * markets. Features a distinctive dark brown color with a spongy texture
 * and often cut into small cubes or diamond shapes.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CAKE = 0x5a3020;       // dark brown sugar color
const CAKE_HI = 0x6a4030;    // lighter highlight
const PAPER = 0xf8f4e8;      // parchment paper wrapper

export const COL_BROWN_SUGAR_CAKE = {
  id: 'brown_sugar_cake',
  name: '黑糖糕',
  colorHex: CAKE, // brown sugar read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Paper wrapper/tray -----------------------------------------
    parts.push(box(1.0, 0.08, 0.8, PAPER, { y: 0.04 }));
    // Folded paper edges
    parts.push(box(0.04, 0.12, 0.8, PAPER, { x: -0.52, y: 0.08 }));
    parts.push(box(0.04, 0.12, 0.8, PAPER, { x: 0.52, y: 0.08 }));
    parts.push(box(1.0, 0.12, 0.04, PAPER, { z: -0.42, y: 0.08 }));
    parts.push(box(1.0, 0.12, 0.04, PAPER, { z: 0.42, y: 0.08 }));

    // ---- 2) Main cake block (cut into pieces) --------------------------
    // Multiple small cake cubes arranged in a grid
    const gridX = 3;
    const gridZ = 2;
    const cubeSize = 0.28;
    const gap = 0.02;

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridZ; j++) {
        const x = (i - (gridX - 1) / 2) * (cubeSize + gap);
        const z = (j - (gridZ - 1) / 2) * (cubeSize + gap);
        // Cake cube with slightly rounded top
        parts.push(box(cubeSize, 0.25, cubeSize, CAKE, {
          x, y: 0.23, z,
          hex2: CAKE_HI,
        }));
        // Spongy texture bumps on top
        for (let b = 0; b < 3; b++) {
          const bx = x + (rng() - 0.5) * 0.15;
          const bz = z + (rng() - 0.5) * 0.15;
          parts.push(sph(0.03, CAKE_HI, {
            ws: 4, hs: 3,
            x: bx, y: 0.36, z: bz,
          }));
        }
      }
    }

    // ---- 3) Pores/holes in cake texture --------------------------------
    // Small indentations (darker spots) to show spongy texture
    for (let n = 0; n < 8; n++) {
      const x = (rng() - 0.5) * 0.7;
      const z = (rng() - 0.5) * 0.5;
      parts.push(sph(0.02, 0x3a1810, {
        ws: 4, hs: 3,
        x, y: 0.22, z,
      }));
    }

    return finish(parts);
  },
};

export default COL_BROWN_SUGAR_CAKE;
