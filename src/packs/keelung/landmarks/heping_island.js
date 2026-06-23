/**
 * @file packs/keelung/landmarks/heping_island.js — Roll Formosa Keelung pack.
 *
 * 和平島公園 — Heping Island Park, featuring dramatic weathered rock formations
 * sculpted by wind and waves, including mushroom rocks, tofu rocks, and sea
 * caves. The park offers stunning views of Keelung's rugged northern coastline
 * and is known for its unique geological landscape.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const ROCK = 0x8a8478;        // Sandstone rock
const ROCK_WET = 0x6a6862;    // Wet rock near water
const ROCK_ORANGE = 0xa08060; // Iron-stained rock
const WATER = 0x3a7888;       // Sea water
const FOAM = 0xe8f0f4;        // White foam
const GRASS = 0x5a7a48;       // Grass on cliff tops
const PATH = 0xa09888;        // Walkway

export const NM_HEPING_ISLAND = {
  id: 'heping_island',
  name: '和平島公園',
  landmarkId: 6,
  dioramaRHint: 55,
  colorHex: ROCK,

  buildGeometry(rng) {
    const parts = [];

    // ---- Sea water base ----
    parts.push(box(3.4, 0.12, 2.0, WATER, { y: 0.06 }));
    // Foam edges
    parts.push(box(3.2, 0.04, 0.2, FOAM, { y: 0.14, z: 0.85 }));
    parts.push(box(3.2, 0.04, 0.15, FOAM, { y: 0.14, z: -0.75 }));

    // ---- Main rock platform ----
    parts.push(box(2.8, 0.4, 1.4, ROCK, { y: 0.32 }));
    parts.push(box(2.4, 0.2, 1.2, ROCK_WET, { y: 0.62, hex2: ROCK }));

    // ---- Mushroom rocks (蕈狀岩) ----
    // Left mushroom
    parts.push(cyl(0.2, 0.26, 0.5, 8, ROCK, { x: -0.8, y: 0.75, z: 0.3 }));
    parts.push(sph(0.35, ROCK_ORANGE, { ws: 8, hs: 6, x: -0.8, y: 1.15, z: 0.3, sy: 0.6 }));

    // Center mushroom (larger)
    parts.push(cyl(0.25, 0.32, 0.65, 8, ROCK, { x: 0.1, y: 0.85, z: 0.2 }));
    parts.push(sph(0.45, ROCK, { ws: 8, hs: 6, x: 0.1, y: 1.35, z: 0.2, sy: 0.55 }));

    // Right mushroom
    parts.push(cyl(0.18, 0.22, 0.45, 8, ROCK_WET, { x: 0.9, y: 0.72, z: 0.4 }));
    parts.push(sph(0.3, ROCK_ORANGE, { ws: 6, hs: 5, x: 0.9, y: 1.05, z: 0.4, sy: 0.55 }));

    // ---- Tofu rocks (豆腐岩) — grid pattern ----
    for (let tx = 0; tx < 3; tx++) {
      for (let tz = 0; tz < 2; tz++) {
        parts.push(box(0.28, 0.15 + rng() * 0.1, 0.28, ROCK, {
          x: -1.0 + tx * 0.32,
          y: 0.6 + rng() * 0.05,
          z: -0.5 + tz * 0.32
        }));
      }
    }

    // ---- Sea cave hint on left side ----
    parts.push(box(0.5, 0.4, 0.3, 0x3a3a3e, { x: -1.3, y: 0.4, z: 0.0 }));

    // ---- Grassy cliff top ----
    parts.push(box(1.2, 0.08, 0.6, GRASS, { x: 0.6, y: 0.78, z: -0.4 }));

    // ---- Viewing platform / walkway ----
    parts.push(box(0.8, 0.08, 0.3, PATH, { x: 0.8, y: 0.72, z: 0.5 }));
    // Railing
    parts.push(box(0.82, 0.06, 0.02, 0x707478, { x: 0.8, y: 0.82, z: 0.64 }));

    // ---- Distant rock pinnacle ----
    parts.push(cyl(0.15, 0.25, 0.7, 6, ROCK_WET, { x: -1.2, y: 0.47, z: -0.6 }));
    parts.push(cyl(0.08, 0.15, 0.3, 6, ROCK, { x: -1.2, y: 0.9, z: -0.6 }));

    return finish(parts);
  },
};

export default NM_HEPING_ISLAND;
