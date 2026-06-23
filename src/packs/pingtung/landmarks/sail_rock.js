/**
 * @file packs/pingtung/landmarks/sail_rock.js — Roll Formosa Pingtung pack.
 *
 * 船帆石 (Sail Rock / Chuanfan Rock, 墾丁 Kenting, 屏東).
 * A famous 18-meter tall coral rock formation shaped like a sail or Nixon's head,
 * standing prominently along the Kenting coastline. The iconic natural landmark
 * rises from the ocean with a distinctive leaning profile.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Coral rock formation (珊瑚礁岩).
const ROCK = 0x8a7a68;       // main coral rock color
const ROCK_D = 0x6a5a48;     // darker rock shadow
const ROCK_L = 0xa09080;     // lighter weathered rock
const WATER = 0x2080a0;      // ocean water
const WATER_D = 0x106080;    // deeper water
const FOAM = 0xe8f0f0;       // sea foam

export const NM_SAIL_ROCK = {
  id: 'sail_rock',
  name: '船帆石',
  dioramaRHint: 75,
  colorHex: 0x8a7a68,
  buildGeometry(rng) {
    const parts = [];

    // ---- Ocean water base ----
    parts.push(box(1.6, 0.12, 1.2, WATER, { y: 0.06, hex2: WATER_D }));
    // Sea foam around rock
    parts.push(cyl(0.35, 0.4, 0.08, 12, FOAM, { y: 0.12 }));

    // ---- Main rock formation (sail shape) ----
    // Base of the rock (wider)
    parts.push(cyl(0.35, 0.42, 0.3, 8, ROCK, { y: 0.12 + 0.15, hex2: ROCK_D }));
    
    // Middle section (the "sail" body, leaning slightly)
    parts.push(box(0.5, 0.6, 0.25, ROCK, { y: 0.42 + 0.3, rx: 0.08, hex2: ROCK_D }));
    
    // Upper tapered section
    parts.push(box(0.38, 0.45, 0.2, ROCK_L, { y: 0.72 + 0.225, rx: 0.1, hex2: ROCK }));
    
    // Top peak (pointed sail tip)
    parts.push(cone(0.22, 0.35, 6, ROCK_L, { y: 1.17 + 0.175, rx: 0.12, hex2: ROCK }));

    // ---- Rock texture details (irregular bumps) ----
    parts.push(sph(0.1, ROCK_D, { x: 0.2, y: 0.5, z: 0.12 }));
    parts.push(sph(0.08, ROCK_D, { x: -0.18, y: 0.65, z: 0.1 }));
    parts.push(sph(0.07, ROCK, { x: 0.12, y: 0.85, z: -0.08 }));
    parts.push(sph(0.09, ROCK_D, { x: -0.1, y: 0.4, z: -0.15 }));

    // ---- Small rocks in the water nearby ----
    parts.push(ico(0.08, 0, ROCK_D, { x: 0.55, y: 0.14, z: 0.3 }));
    parts.push(ico(0.06, 0, ROCK, { x: -0.5, y: 0.13, z: 0.35 }));
    parts.push(ico(0.05, 0, ROCK_D, { x: 0.6, y: 0.12, z: -0.25 }));

    return finish(parts);
  },
};

export default NM_SAIL_ROCK;
