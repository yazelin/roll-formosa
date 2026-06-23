/**
 * @file packs/newtaipei/collectibles/taro_ball.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_TARO_BALL — 芋圓 (Taro Ball). The famous Jiufen dessert: chewy QQ
 * taro balls in multiple colors (purple taro, orange sweet potato, green
 * matcha) served in a bowl with sweet soup or shaved ice. The signature
 * treat of the Jiufen Old Street teahouses.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const TARO = 0x8a6090;       // purple taro ball
const SWEET_POTATO = 0xe8a040; // orange sweet potato ball
const MATCHA = 0x6a9a50;     // green matcha ball
const SOUP = 0xd8c8a0;       // sweet ginger soup
const BOWL = 0xf0ece0;       // ceramic bowl
const BOWL_RIM = 0xe8e0d0;   // bowl rim

export const COL_TARO_BALL = {
  id: 'taro_ball',
  name: '芋圓',
  colorHex: TARO, // purple taro read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ceramic bowl -----------------------------------------------
    // Wide shallow bowl
    parts.push(cyl(0.85, 0.75, 0.35, 10, BOWL, { y: 0.175 }));
    parts.push(cyl(0.9, 0.88, 0.06, 10, BOWL_RIM, { y: 0.38 })); // rim
    // Inner well (darker for depth)
    parts.push(cyl(0.72, 0.68, 0.25, 10, 0xe0d8c8, { y: 0.2 }));

    // ---- 2) Sweet soup base --------------------------------------------
    parts.push(cyl(0.68, 0.65, 0.1, 10, SOUP, { y: 0.22 }));

    // ---- 3) Taro balls - various colors --------------------------------
    // Purple taro balls
    const taroPos = [
      { x: -0.25, z: 0.1 },
      { x: 0.15, z: -0.2 },
      { x: 0.0, z: 0.25 },
    ];
    for (const { x, z } of taroPos) {
      parts.push(sph(0.14, TARO, { ws: 6, hs: 4, x, y: 0.42, z }));
    }

    // Orange sweet potato balls
    const spPos = [
      { x: 0.28, z: 0.15 },
      { x: -0.18, z: -0.18 },
    ];
    for (const { x, z } of spPos) {
      parts.push(sph(0.13, SWEET_POTATO, { ws: 6, hs: 4, x, y: 0.4, z }));
    }

    // Green matcha balls
    const matchaPos = [
      { x: -0.05, z: -0.08 },
      { x: 0.22, z: -0.05 },
    ];
    for (const { x, z } of matchaPos) {
      parts.push(sph(0.12, MATCHA, { ws: 6, hs: 4, x, y: 0.38, z }));
    }

    // ---- 4) Some red beans scattered -----------------------------------
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      const r = 0.35;
      parts.push(sph(0.04, 0x8a2020, {
        ws: 4, hs: 3,
        x: Math.cos(a) * r,
        y: 0.3,
        z: Math.sin(a) * r,
      }));
    }

    // ---- 5) Spoon (optional visual) ------------------------------------
    parts.push(cyl(0.12, 0.1, 0.02, 8, 0xf0e8d8, { x: 0.55, y: 0.35, z: 0.1 })); // spoon bowl
    parts.push(box(0.05, 0.02, 0.3, 0xf0e8d8, { x: 0.7, y: 0.36, z: 0.25 })); // spoon handle

    return finish(parts);
  },
};

export default COL_TARO_BALL;
