/**
 * @file packs/kinmen/collectibles/wind_lion.js — Roll Formosa Kinmen pack.
 *
 * 風獅爺公仔 (Wind Lion God Figure) — code 73. A miniature souvenir version
 * of Kinmen's iconic Wind Lion God guardians. These stone lion statues
 * protect villages from evil winds and spirits.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const STONE_MAIN = 0xc0a878;   // Sandy stone
const STONE_DARK = 0x908050;
const RIBBON_RED = 0xc41e3a;
const EYES_WHITE = 0xf0f0f0;
const EYES_BLACK = 0x1a1a1a;

export const COL_WIND_LION = {
  id: 'wind_lion_col',
  name: '風獅爺公仔',
  colorHex: STONE_MAIN,

  buildGeometry(rng) {
    const parts = [];

    // Base
    parts.push(box(0.6, 0.1, 0.5, 0x707070, { y: 0.05 }));

    // Body (sitting)
    parts.push(sph(0.28, STONE_MAIN, { ws: 6, hs: 4, y: 0.35, sy: 0.7, hex2: STONE_DARK }));

    // Front body
    parts.push(sph(0.22, STONE_MAIN, { ws: 6, hs: 4, y: 0.45, z: 0.08, hex2: STONE_DARK }));

    // Front legs
    parts.push(cyl(0.07, 0.05, 0.2, 5, STONE_MAIN, { x: -0.12, z: 0.15, y: 0.2 }));
    parts.push(cyl(0.07, 0.05, 0.2, 5, STONE_MAIN, { x: 0.12, z: 0.15, y: 0.2 }));

    // Head
    parts.push(sph(0.2, STONE_MAIN, { ws: 6, hs: 4, y: 0.7, z: 0.1, hex2: STONE_DARK }));

    // Snout
    parts.push(box(0.12, 0.08, 0.1, STONE_DARK, { y: 0.65, z: 0.28 }));

    // Eyes
    parts.push(sph(0.04, EYES_WHITE, { ws: 3, hs: 2, x: -0.07, y: 0.73, z: 0.25 }));
    parts.push(sph(0.04, EYES_WHITE, { ws: 3, hs: 2, x: 0.07, y: 0.73, z: 0.25 }));
    parts.push(sph(0.02, EYES_BLACK, { ws: 2, hs: 2, x: -0.07, y: 0.73, z: 0.28 }));
    parts.push(sph(0.02, EYES_BLACK, { ws: 2, hs: 2, x: 0.07, y: 0.73, z: 0.28 }));

    // Ears
    parts.push(cone(0.05, 0.08, 3, STONE_MAIN, { x: -0.12, y: 0.88, z: 0.02 }));
    parts.push(cone(0.05, 0.08, 3, STONE_MAIN, { x: 0.12, y: 0.88, z: 0.02 }));

    // Mane
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI + PI * 0.5;
      parts.push(sph(0.06, STONE_DARK, {
        ws: 3, hs: 2,
        x: Math.cos(a) * 0.15,
        y: 0.82,
        z: 0.08 + Math.sin(a) * 0.1,
      }));
    }

    // Red ribbon
    parts.push(cyl(0.18, 0.16, 0.05, 6, RIBBON_RED, { y: 0.55, z: 0.1 }));
    parts.push(box(0.04, 0.15, 0.02, RIBBON_RED, { x: -0.1, y: 0.42, z: 0.22 }));
    parts.push(box(0.04, 0.12, 0.02, RIBBON_RED, { x: 0.08, y: 0.43, z: 0.2 }));

    return finish(parts);
  },
};

export default COL_WIND_LION;
