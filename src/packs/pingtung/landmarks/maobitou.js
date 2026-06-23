/**
 * @file packs/pingtung/landmarks/maobitou.js — Roll Formosa Pingtung pack.
 *
 * 貓鼻頭 (Maobitou / Cat Nose Cape, 恆春 Hengchun, 屏東).
 * A rocky cape at the southern tip of Taiwan, famous for its coral reef coastline
 * and observation deck overlooking the Bashi Channel. The cape gets its name from
 * a rock formation that resembles a crouching cat.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Rocky cape with observation deck.
const ROCK = 0x7a6a58;       // coral reef rock
const ROCK_D = 0x5a4a38;     // darker rock
const ROCK_L = 0x9a8a78;     // lighter weathered rock
const WATER = 0x1878a0;      // ocean water
const WATER_D = 0x0858780;   // deeper water
const CONCRETE = 0xc0b8a8;   // observation deck concrete
const RAIL = 0x606060;       // metal railing
const WOOD = 0x8a6a40;       // wooden deck

export const NM_MAOBITOU = {
  id: 'maobitou',
  name: '貓鼻頭',
  dioramaRHint: 100,
  colorHex: 0x7a6a58,
  buildGeometry(rng) {
    const parts = [];

    // ---- Ocean water base ----
    parts.push(box(1.8, 0.1, 1.4, WATER, { y: 0.05, hex2: WATER_D }));

    // ---- Main rocky cape formation ----
    // Large irregular rocky platform
    parts.push(box(1.0, 0.25, 0.8, ROCK, { y: 0.1 + 0.125, z: -0.15, hex2: ROCK_D }));
    parts.push(box(0.7, 0.2, 0.6, ROCK_L, { y: 0.225 + 0.1, z: -0.2, hex2: ROCK }));
    
    // ---- Cat-shaped rock formation (the "cat nose") ----
    // Cat body (crouching)
    parts.push(sph(0.18, ROCK, { x: 0.35, y: 0.35, z: 0.15, sx: 1.2, sy: 0.8, sz: 0.9 }));
    // Cat head
    parts.push(sph(0.12, ROCK_L, { x: 0.5, y: 0.42, z: 0.18 }));
    // Cat ears (small cones)
    parts.push(cone(0.04, 0.08, 4, ROCK, { x: 0.46, y: 0.52, z: 0.22 }));
    parts.push(cone(0.04, 0.08, 4, ROCK, { x: 0.54, y: 0.52, z: 0.22 }));

    // ---- Additional rock formations ----
    parts.push(ico(0.12, 0, ROCK_D, { x: -0.4, y: 0.18, z: 0.3 }));
    parts.push(ico(0.09, 0, ROCK, { x: -0.55, y: 0.14, z: 0.15 }));
    parts.push(ico(0.08, 0, ROCK_D, { x: 0.5, y: 0.12, z: -0.4 }));

    // ---- Observation deck structure ----
    // Concrete platform
    parts.push(box(0.45, 0.08, 0.35, CONCRETE, { x: -0.3, y: 0.35 + 0.04, z: -0.25 }));
    // Wooden deck surface
    parts.push(box(0.42, 0.03, 0.32, WOOD, { x: -0.3, y: 0.43 + 0.015, z: -0.25 }));
    
    // ---- Railing around observation deck ----
    // Front rail
    parts.push(box(0.44, 0.08, 0.02, RAIL, { x: -0.3, y: 0.48, z: -0.08 }));
    // Side rails
    parts.push(box(0.02, 0.08, 0.32, RAIL, { x: -0.51, y: 0.48, z: -0.25 }));
    parts.push(box(0.02, 0.08, 0.32, RAIL, { x: -0.09, y: 0.48, z: -0.25 }));
    
    // ---- Rail posts ----
    parts.push(cyl(0.015, 0.015, 0.1, 6, RAIL, { x: -0.51, y: 0.43 + 0.05, z: -0.08 }));
    parts.push(cyl(0.015, 0.015, 0.1, 6, RAIL, { x: -0.09, y: 0.43 + 0.05, z: -0.08 }));
    parts.push(cyl(0.015, 0.015, 0.1, 6, RAIL, { x: -0.3, y: 0.43 + 0.05, z: -0.08 }));

    // ---- Information sign ----
    parts.push(box(0.02, 0.12, 0.08, WOOD, { x: -0.15, y: 0.35 + 0.06, z: -0.1 }));
    parts.push(box(0.01, 0.08, 0.12, 0xe0d8c8, { x: -0.14, y: 0.35 + 0.1, z: -0.1 }));

    return finish(parts);
  },
};

export default NM_MAOBITOU;
