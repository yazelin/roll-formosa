/**
 * @file packs/changhua/collectibles/old_locomotive.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_OLD_LOCOMOTIVE — 蒸汽火車頭 (steam locomotive), representing the famous
 * Changhua Roundhouse (扇形車庫). A classic black steam engine with a large
 * boiler, smokestack, cowcatcher, and red wheels. The roundhouse is one of
 * only a few remaining operational fan-shaped locomotive depots in the world.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, cone, finish, HALF_PI, PI } from '../geomHelpers.js';

const BLACK = 0x2a2a2a;       // locomotive black
const BLACK_HI = 0x404040;    // highlight
const RED = 0xc82828;         // red wheels
const BRASS = 0xd8b048;       // brass fittings
const STEEL = 0x808888;       // steel parts
const SMOKE = 0x606060;       // smokestack

export const COL_OLD_LOCOMOTIVE = {
  id: 'old_locomotive',
  name: '蒸汽火車頭',
  collectibleId: 9,
  colorHex: BLACK,

  buildGeometry(rng) {
    const parts = [];

    // Main boiler - large horizontal cylinder (reduced segments)
    parts.push(cyl(0.38, 0.35, 1.20, 6, BLACK, { y: 0.55, rx: HALF_PI, hex2: BLACK_HI }));

    // Smokebox front
    parts.push(cyl(0.38, 0.38, 0.12, 6, BLACK_HI, { y: 0.55, z: 0.65, rx: HALF_PI }));

    // Smokestack (simplified)
    parts.push(cyl(0.14, 0.14, 0.35, 5, SMOKE, { y: 0.95, z: 0.35 }));

    // Dome (steam dome)
    parts.push(cyl(0.14, 0.16, 0.18, 5, BRASS, { y: 0.88, z: -0.10 }));

    // Cab (driver's compartment)
    parts.push(box(0.50, 0.50, 0.35, BLACK, { y: 0.65, z: -0.65 }));
    parts.push(box(0.46, 0.05, 0.30, STEEL, { y: 0.92, z: -0.65 }));

    // Cowcatcher (simplified)
    parts.push(box(0.50, 0.18, 0.15, STEEL, { y: 0.20, z: 0.78 }));

    // Wheels - 2 pairs (reduced from 3)
    for (const z of [-0.30, 0.20]) {
      parts.push(cyl(0.22, 0.22, 0.08, 6, RED, { x: 0.32, y: 0.22, z, ry: HALF_PI }));
      parts.push(cyl(0.22, 0.22, 0.08, 6, RED, { x: -0.32, y: 0.22, z, ry: HALF_PI }));
    }

    // Connecting rod
    parts.push(box(0.55, 0.04, 0.02, STEEL, { x: 0.36, y: 0.22, z: -0.05 }));
    parts.push(box(0.55, 0.04, 0.02, STEEL, { x: -0.36, y: 0.22, z: -0.05 }));

    // Headlight
    parts.push(cyl(0.08, 0.08, 0.06, 4, BRASS, { y: 0.82, z: 0.72 }));

    return finish(parts);
  },
};

export default COL_OLD_LOCOMOTIVE;
