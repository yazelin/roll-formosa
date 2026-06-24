/**
 * @file packs/matsu/collectibles/oyster_plate.js — Roll Formosa Matsu pack.
 *
 * 蚵仔煎 (Oyster Omelette) — code 77. A plate of the beloved Taiwanese
 * street food: crispy egg batter with plump oysters, leafy greens, and
 * drizzled with sweet-savory orange sauce. The golden-brown omelette with
 * visible oysters is a night market staple found throughout Taiwan and Matsu.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

const PLATE = 0xf0ebe0;      // white ceramic plate
const PLATE_HI = 0xffffff;
const EGG = 0xdaa520;        // golden-brown egg batter
const EGG_HI = 0xf0c050;     // crispy edges
const OYSTER = 0x8a8a7a;     // grayish oyster
const GREENS = 0x4a8a4a;     // leafy vegetables
const SAUCE = 0xd4652a;      // orange sweet sauce

export const COL_OYSTER_PLATE = {
  id: 'oyster_plate',
  name: '蚵仔煎',
  colorHex: 0xdaa520,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Plate base
    parts.push(cyl(0.95, 0.95, 0.08, 10, PLATE, { y: 0.04, hex2: PLATE_HI }));
    // Plate rim (slight lip)
    parts.push(cyl(1.0, 0.92, 0.06, 10, PLATE_HI, { y: 0.1 }));

    // Omelette base (irregular oval shape)
    parts.push(sph(0.7, EGG, { ws: 8, hs: 4, sx: 1.1, sy: 0.25, sz: 0.9, y: 0.22, hex2: EGG_HI }));

    // Crispy edges (slightly raised bumpy texture)
    parts.push(sph(0.15, EGG_HI, { ws: 4, hs: 3, sy: 0.4, x: 0.5, y: 0.28, z: 0.3 }));
    parts.push(sph(0.14, EGG_HI, { ws: 4, hs: 3, sy: 0.4, x: -0.55, y: 0.26, z: -0.2 }));
    parts.push(sph(0.13, EGG_HI, { ws: 4, hs: 3, sy: 0.4, x: 0.3, y: 0.27, z: -0.45 }));

    // Oysters (plump grayish lumps)
    const jit = (rng() - 0.5) * 0.15;
    parts.push(sph(0.16, OYSTER, { ws: 5, hs: 3, sx: 1.2, sy: 0.6, x: 0.15 + jit, y: 0.32, z: 0.1 }));
    parts.push(sph(0.14, OYSTER, { ws: 5, hs: 3, sx: 1.1, sy: 0.55, x: -0.2, y: 0.30, z: -0.15 + jit }));
    parts.push(sph(0.15, OYSTER, { ws: 5, hs: 3, sx: 1.15, sy: 0.58, x: 0.05, y: 0.31, z: -0.25 }));

    // Leafy greens peeking out
    parts.push(sph(0.12, GREENS, { ws: 4, hs: 3, sx: 1.5, sy: 0.3, x: 0.35, y: 0.26, z: -0.1 }));
    parts.push(sph(0.1, GREENS, { ws: 4, hs: 3, sx: 1.4, sy: 0.25, x: -0.3, y: 0.25, z: 0.2 }));

    // Orange sauce drizzle
    parts.push(sph(0.2, SAUCE, { ws: 5, hs: 3, sx: 1.3, sy: 0.15, sz: 0.8, y: 0.36, x: 0.05 }));
    parts.push(sph(0.1, SAUCE, { ws: 4, hs: 2, sx: 1.5, sy: 0.12, x: -0.15, y: 0.35, z: 0.18 }));

    return finish(parts);
  },
};

export default COL_OYSTER_PLATE;
