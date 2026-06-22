/**
 * @file packs/chiayi/collectibles/turkey_rice.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_TURKEY_RICE — 嘉義雞肉飯 (Chiayi Turkey Rice). The iconic dish of Chiayi:
 * shredded turkey meat over a mound of rice, drizzled with fragrant turkey oil
 * and served in a small bowl. The turkey meat has a distinctive pale beige color.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BOWL = 0xf0e8d8;      // white ceramic bowl
const BOWL_RIM = 0xd8cbb8;  // bowl rim shadow
const RICE = 0xf8f4e8;      // white rice
const TURKEY = 0xe8d0a8;    // pale turkey meat
const TURKEY_HI = 0xf0dcc0; // meat highlight
const OIL = 0xc8a060;       // turkey oil/gravy

export const COL_TURKEY_RICE = {
  id: 'turkey_rice',
  name: '雞肉飯',
  colorHex: 0xe8d0a8,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.015;
    const parts = [];

    // Bowl - outer
    parts.push(cyl(0.5, 0.42, 0.38, 8, BOWL, { y: 0.19, hex2: BOWL_RIM }));
    // Bowl rim
    parts.push(cyl(0.52, 0.52, 0.06, 8, BOWL_RIM, { y: 0.41 }));

    // Rice mound inside bowl
    parts.push(cyl(0.38, 0.35, 0.18, 8, RICE, { y: 0.38 }));
    parts.push(sph(0.34, RICE, { ws: 6, hs: 4, y: 0.52, sy: 0.5, thetaLen: HALF_PI }));

    // Shredded turkey meat on top - arranged strands
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * PI * 2 + j;
      const mx = Math.sin(angle) * 0.15;
      const mz = Math.cos(angle) * 0.15;
      parts.push(box(0.22, 0.04, 0.08, TURKEY, {
        x: mx, y: 0.62, z: mz, ry: angle + 0.3, hex2: TURKEY_HI,
      }));
    }
    // Central pile
    parts.push(box(0.18, 0.05, 0.12, TURKEY, { y: 0.66, ry: 0.5, hex2: TURKEY_HI }));
    parts.push(box(0.15, 0.04, 0.1, TURKEY, { y: 0.7, ry: -0.3, hex2: TURKEY_HI }));

    // Oil/gravy drizzle (glossy spots)
    parts.push(sph(0.06, OIL, { ws: 4, hs: 3, x: 0.1, y: 0.65, z: 0.08, sy: 0.4 }));
    parts.push(sph(0.05, OIL, { ws: 4, hs: 3, x: -0.08, y: 0.63, z: -0.1, sy: 0.4 }));

    return finish(parts);
  },
};

export default COL_TURKEY_RICE;
