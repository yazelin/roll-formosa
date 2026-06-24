/**
 * @file packs/kinmen/collectibles/black_bear.js — Roll Formosa Kinmen pack.
 *
 * 台灣黑熊 (Taiwan Black Bear) — code 70. The mascot of Taiwan, featuring
 * the distinctive white V-shaped chest mark. A beloved symbol appearing
 * throughout the game as the character "月牙" (Crescent Moon).
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const FUR_BLACK = 0x1a1a1a;
const FUR_DARK = 0x2a2a2a;
const CHEST_WHITE = 0xf0f0f0;
const NOSE_BROWN = 0x4a3020;
const EYES_BLACK = 0x0a0a0a;

export const COL_BLACK_BEAR = {
  id: 'black_bear',
  name: '台灣黑熊',
  colorHex: FUR_BLACK,

  buildGeometry(rng) {
    const parts = [];

    // Body
    parts.push(sph(0.5, FUR_BLACK, { ws: 7, hs: 5, y: 0.5, sy: 0.8, hex2: FUR_DARK }));

    // Head
    parts.push(sph(0.35, FUR_BLACK, { ws: 7, hs: 5, y: 1.0, hex2: FUR_DARK }));

    // Ears
    parts.push(sph(0.1, FUR_BLACK, { ws: 4, hs: 3, x: -0.22, y: 1.28 }));
    parts.push(sph(0.1, FUR_BLACK, { ws: 4, hs: 3, x: 0.22, y: 1.28 }));

    // Snout
    parts.push(sph(0.12, FUR_DARK, { ws: 5, hs: 3, y: 0.95, z: 0.3, sx: 1.2 }));
    parts.push(sph(0.06, NOSE_BROWN, { ws: 4, hs: 3, y: 0.98, z: 0.38 }));

    // Eyes
    parts.push(sph(0.05, EYES_BLACK, { ws: 4, hs: 3, x: -0.12, y: 1.05, z: 0.25 }));
    parts.push(sph(0.05, EYES_BLACK, { ws: 4, hs: 3, x: 0.12, y: 1.05, z: 0.25 }));

    // White V chest mark (月牙)
    parts.push(box(0.08, 0.2, 0.05, CHEST_WHITE, { x: -0.1, y: 0.65, z: 0.38, rz: 0.3 }));
    parts.push(box(0.08, 0.2, 0.05, CHEST_WHITE, { x: 0.1, y: 0.65, z: 0.38, rz: -0.3 }));

    // Front legs
    parts.push(cyl(0.1, 0.08, 0.3, 6, FUR_BLACK, { x: -0.2, y: 0.2, z: 0.15 }));
    parts.push(cyl(0.1, 0.08, 0.3, 6, FUR_BLACK, { x: 0.2, y: 0.2, z: 0.15 }));

    // Back legs
    parts.push(sph(0.15, FUR_BLACK, { ws: 5, hs: 4, x: -0.25, y: 0.18, z: -0.15, sy: 0.6 }));
    parts.push(sph(0.15, FUR_BLACK, { ws: 5, hs: 4, x: 0.25, y: 0.18, z: -0.15, sy: 0.6 }));

    return finish(parts);
  },
};

export default COL_BLACK_BEAR;
