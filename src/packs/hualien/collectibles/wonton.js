/**
 * @file packs/hualien/collectibles/wonton.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_WONTON — 花蓮扁食 (Hualien wonton). The beloved Hualien-style wonton soup
 * dumpling, served in a small ceramic bowl with clear soup broth. Features
 * plump wontons with translucent skin showing the pork filling, garnished
 * with celery and white pepper. A signature comfort food of Hualien.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { box, cyl, sph, ico, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BOWL = 0xf5f0e8; // ceramic white bowl
const BOWL_RIM = 0xfdfaf4;
const SOUP = 0xf0e8d8; // clear broth
const WRAPPER = 0xf8ece0; // wonton skin (translucent white)
const MEAT = 0xc0907a; // pink pork filling showing through
const CELERY = 0x5a8a4a; // green celery garnish

export const COL_WONTON = {
  id: 'wonton',
  name: '花蓮扁食',
  collectibleId: 2,
  colorHex: 0xf5f0e8, // ceramic bowl white

  buildGeometry(rng) {
    const j = (a) => (rng() - 0.5) * a;
    const parts = [];

    // --- BOWL: small ceramic soup bowl ---
    parts.push(cyl(0.9, 0.5, 0.6, 10, BOWL, { y: 0.3, hex2: BOWL_RIM }));
    // Bowl rim
    parts.push(cyl(0.92, 0.88, 0.08, 10, BOWL_RIM, { y: 0.6 }));
    // Bowl bottom
    parts.push(cyl(0.45, 0.45, 0.04, 8, BOWL, { y: 0.02 }));

    // --- SOUP surface ---
    parts.push(cyl(0.82, 0.82, 0.04, 10, SOUP, { y: 0.55 }));

    // --- WONTONS floating (3 plump dumplings) ---
    // Wonton 1 (front)
    parts.push(sph(0.28, WRAPPER, { ws: 6, hs: 4, x: 0.1, y: 0.68, z: 0.25, sy: 0.7, hex2: MEAT }));
    parts.push(ico(0.08, 0, MEAT, { x: 0.1, y: 0.65, z: 0.25 })); // filling peek

    // Wonton 2 (left)
    parts.push(sph(0.26, WRAPPER, { ws: 6, hs: 4, x: -0.28, y: 0.66, z: -0.05, sy: 0.7, hex2: MEAT }));
    parts.push(ico(0.07, 0, MEAT, { x: -0.28, y: 0.63, z: -0.05 }));

    // Wonton 3 (right-back)
    parts.push(sph(0.24, WRAPPER, { ws: 6, hs: 4, x: 0.22, y: 0.64, z: -0.22, sy: 0.7, hex2: MEAT }));
    parts.push(ico(0.06, 0, MEAT, { x: 0.22, y: 0.61, z: -0.22 }));

    // --- CELERY garnish ---
    parts.push(ico(0.06, 0, CELERY, { x: -0.1 + j(0.1), y: 0.58, z: 0.12 }));
    parts.push(ico(0.05, 0, CELERY, { x: 0.15 + j(0.08), y: 0.58, z: -0.08 }));

    return finish(parts);
  },
};

export default COL_WONTON;
