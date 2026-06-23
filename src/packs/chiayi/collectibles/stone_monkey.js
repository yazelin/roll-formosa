/**
 * @file packs/chiayi/collectibles/stone_monkey.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_STONE_MONKEY — 石猴 (Stone Monkey). Traditional stone carving art from Chiayi,
 * particularly from the 交趾陶 and stone carving traditions. A cute carved stone
 * monkey figure, a popular Chiayi craft souvenir.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const STONE = 0x787878;     // grey stone
const STONE_HI = 0x989898;  // stone highlight
const STONE_DARK = 0x585858;// stone shadow

export const COL_STONE_MONKEY = {
  id: 'stone_monkey',
  name: '石猴',
  colorHex: 0x787878,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Base/pedestal
    parts.push(cyl(0.35, 0.38, 0.1, 6, STONE_DARK, { y: 0.05 }));

    // Body (sitting pose)
    parts.push(sph(0.28, STONE, { ws: 6, hs: 5, y: 0.35, sy: 0.9, hex2: STONE_HI }));

    // Head
    parts.push(sph(0.22, STONE, { ws: 6, hs: 5, y: 0.7, hex2: STONE_HI }));

    // Face (flattened muzzle area)
    parts.push(sph(0.1, STONE_HI, { ws: 5, hs: 4, y: 0.65, z: 0.18, sy: 0.7 }));

    // Ears
    parts.push(sph(0.06, STONE, { ws: 4, hs: 3, x: -0.2, y: 0.75, z: -0.02 }));
    parts.push(sph(0.06, STONE, { ws: 4, hs: 3, x: 0.2, y: 0.75, z: -0.02 }));

    // Eyes (carved indents)
    parts.push(sph(0.03, STONE_DARK, { ws: 3, hs: 2, x: -0.08, y: 0.72, z: 0.2 }));
    parts.push(sph(0.03, STONE_DARK, { ws: 3, hs: 2, x: 0.08, y: 0.72, z: 0.2 }));

    // Nose
    parts.push(sph(0.035, STONE_DARK, { ws: 3, hs: 2, y: 0.65, z: 0.26 + j }));

    // Arms (folded in front)
    parts.push(cyl(0.08, 0.08, 0.2, 5, STONE, { x: -0.2, y: 0.35, z: 0.15, rz: 0.5, hex2: STONE_HI }));
    parts.push(cyl(0.08, 0.08, 0.2, 5, STONE, { x: 0.2, y: 0.35, z: 0.15, rz: -0.5, hex2: STONE_HI }));

    // Feet/legs (sitting)
    parts.push(sph(0.12, STONE, { ws: 5, hs: 4, x: -0.15, y: 0.15, z: 0.2, sy: 0.6, hex2: STONE_HI }));
    parts.push(sph(0.12, STONE, { ws: 5, hs: 4, x: 0.15, y: 0.15, z: 0.2, sy: 0.6, hex2: STONE_HI }));

    // Tail (curled)
    parts.push(cyl(0.04, 0.035, 0.2, 4, STONE, { x: 0, y: 0.25, z: -0.25, rx: -0.8, hex2: STONE_HI }));

    return finish(parts);
  },
};

export default COL_STONE_MONKEY;
