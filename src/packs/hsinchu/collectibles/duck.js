/**
 * @file packs/hsinchu/collectibles/duck.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_DUCK — 鴨香飯碗 (Duck Rice Bowl). Hsinchu's famous duck rice (鴨肉飯) is
 * a local comfort food specialty. Silhouette: a traditional rice bowl filled
 * with sliced duck meat over rice, garnished with pickled vegetables.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BOWL = 0xf5f5f0;        // ceramic bowl white
const BOWL_RIM = 0x2050a0;    // traditional blue rim
const RICE = 0xfaf8f0;        // white rice
const DUCK = 0x9c7050;        // braised duck meat
const DUCK_HI = 0xb08060;     // duck highlight
const SAUCE = 0x604020;       // soy sauce glaze
const PICKLE = 0x8a9c40;      // pickled mustard green

export const COL_DUCK = {
  id: 'duck_rice_bowl',
  name: '鴨香飯碗',
  collectibleId: 7,
  colorHex: DUCK,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302);
    const duck = DUCK + t;
    const parts = [];

    // --- ceramic BOWL ---
    // bowl body
    parts.push(cyl(0.85, 0.55, 0.55, 10, BOWL, { y: 0.28, hex2: 0xffffff }));
    // bowl foot
    parts.push(cyl(0.45, 0.45, 0.1, 8, BOWL, { y: 0.05 }));
    // blue rim band
    parts.push(cyl(0.87, 0.85, 0.08, 10, BOWL_RIM, { y: 0.52, open: true }));

    // --- white RICE bed ---
    parts.push(sph(0.72, RICE, { ws: 8, hs: 4, sy: 0.45, y: 0.56, hex2: 0xffffff }));

    // --- sliced DUCK meat pieces layered on top ---
    // main duck slices
    parts.push(box(0.5, 0.08, 0.35, duck, { x: 0, y: 0.72, z: 0, rz: 0.1, hex2: DUCK_HI }));
    parts.push(box(0.4, 0.07, 0.28, duck, { x: 0.15, y: 0.78, z: 0.12, rz: -0.05, hex2: DUCK_HI }));
    parts.push(box(0.38, 0.06, 0.25, duck, { x: -0.1, y: 0.82, z: -0.08, rz: 0.08, hex2: DUCK_HI }));
    // sauce glaze on duck
    parts.push(box(0.35, 0.02, 0.2, SAUCE, { y: 0.86, hex2: 0x805030 }));

    // --- pickled vegetable GARNISH ---
    parts.push(sph(0.12, PICKLE, { ws: 4, hs: 3, x: 0.4, y: 0.7, z: 0.25 }));
    parts.push(sph(0.1, PICKLE, { ws: 4, hs: 3, x: -0.38, y: 0.68, z: 0.22 }));
    parts.push(sph(0.08, 0x9aac48, { ws: 4, hs: 3, x: 0.32, y: 0.66, z: -0.3 }));

    // --- ginger slices ---
    parts.push(box(0.15, 0.02, 0.08, 0xf0d8a0, { x: -0.25, y: 0.74, z: 0.35 }));

    return finish(parts);
  },
};

export default COL_DUCK;
