/**
 * @file packs/kinmen/collectibles/military_helmet.js — Roll Formosa Kinmen pack.
 *
 * 鋼盔 (Military Steel Helmet) — code 79. A relic of Kinmen's military past,
 * these helmets were worn by soldiers during the decades of confrontation
 * with mainland China. Now displayed as historical artifacts.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const HELMET_GREEN = 0x4a5a3a;
const HELMET_DARK = 0x3a4a2a;
const HELMET_LIGHT = 0x5a6a4a;
const STRAP_BROWN = 0x4a3020;
const METAL_GREY = 0x6a6a6a;

export const COL_MILITARY_HELMET = {
  id: 'military_helmet',
  name: '鋼盔',
  colorHex: HELMET_GREEN,

  buildGeometry(rng) {
    const parts = [];

    // Main helmet dome
    parts.push(sph(0.55, HELMET_GREEN, {
      ws: 8, hs: 5,
      y: 0.5,
      sy: 0.65,
      theta0: 0,
      thetaLen: HALF_PI * 1.1,
      hex2: HELMET_DARK,
    }));

    // Helmet rim (flared edge)
    parts.push(cyl(0.58, 0.6, 0.06, 8, HELMET_DARK, { y: 0.22 }));

    // Inner lining edge visible
    parts.push(cyl(0.5, 0.52, 0.04, 8, STRAP_BROWN, { y: 0.24 }));

    // Chin strap
    parts.push(cyl(0.02, 0.02, 0.3, 4, STRAP_BROWN, { x: -0.45, y: 0.15, rx: 0.5, rz: 0.2 }));
    parts.push(cyl(0.02, 0.02, 0.3, 4, STRAP_BROWN, { x: 0.45, y: 0.15, rx: 0.5, rz: -0.2 }));

    // Chin strap buckle
    parts.push(box(0.06, 0.04, 0.02, METAL_GREY, { x: 0, y: -0.02, z: 0.35 }));

    // Strap attachment rivets
    parts.push(cyl(0.03, 0.03, 0.02, 4, METAL_GREY, { x: -0.52, y: 0.25, z: 0.2 }));
    parts.push(cyl(0.03, 0.03, 0.02, 4, METAL_GREY, { x: 0.52, y: 0.25, z: 0.2 }));

    // Weathering / battle marks (dents)
    parts.push(sph(0.05, HELMET_DARK, { ws: 3, hs: 2, x: 0.2, y: 0.6, z: -0.25, sy: 0.3 }));

    // Camouflage netting remnants
    parts.push(box(0.15, 0.01, 0.1, 0x5a5040, { x: 0.15, y: 0.72, z: 0.2, rz: 0.2 }));

    return finish(parts);
  },
};

export default COL_MILITARY_HELMET;
