/**
 * @file packs/chiayi/landmarks/chiayi_park.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_CHIAYI_PARK — 嘉義公園 (Chiayi Park). A historic Japanese-era park featuring
 * traditional stone lanterns, a torii gate entrance, the Shinto shrine remnants,
 * and lush tropical gardens. The park also houses the 射日塔 (but that's separate).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const STONE = 0x888880;     // grey stone
const STONE_HI = 0xa8a898;  // stone highlight
const TORII = 0xc83020;     // vermillion torii
const WOOD = 0x7a5a40;      // dark wood
const GARDEN = 0x4a6a40;    // garden green
const PATH = 0xc8b898;      // sand path

export const NM_CHIAYI_PARK = {
  id: 'chiayi_park',
  name: '嘉義公園',
  landmarkId: 5,
  dioramaRHint: 50, // park grounds
  colorHex: GARDEN,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Park ground
    parts.push(box(4.0, 0.1, 3.5, GARDEN, { y: 0.05, hex2: 0x5a7a50 }));

    // Sand path leading through
    parts.push(box(0.6, 0.08, 3.2, PATH, { y: 0.09, z: -0.1 }));

    // Torii gate at entrance
    const toriiZ = 1.4;
    // Vertical pillars
    parts.push(cyl(0.08, 0.09, 1.1, 6, TORII, { x: -0.5, y: 0.65, z: toriiZ }));
    parts.push(cyl(0.08, 0.09, 1.1, 6, TORII, { x: 0.5, y: 0.65, z: toriiZ }));
    // Top beam (kasagi)
    parts.push(box(1.4, 0.12, 0.15, TORII, { y: 1.25, z: toriiZ }));
    parts.push(box(1.5, 0.06, 0.2, TORII, { y: 1.35, z: toriiZ, rx: -0.05 })); // curved top
    // Secondary beam (nuki)
    parts.push(box(1.1, 0.08, 0.1, TORII, { y: 1.0, z: toriiZ }));

    // Stone lantern (tōrō) - left side
    const lanternX = -1.2;
    const lanternZ = 0.3;
    parts.push(box(0.25, 0.08, 0.25, STONE, { x: lanternX, y: 0.14, z: lanternZ })); // base
    parts.push(cyl(0.06, 0.08, 0.35, 6, STONE, { x: lanternX, y: 0.36, z: lanternZ })); // shaft
    parts.push(box(0.2, 0.18, 0.2, STONE, { x: lanternX, y: 0.62, z: lanternZ, hex2: STONE_HI })); // fire box
    parts.push(cone(0.18, 0.22, 4, STONE, { x: lanternX, y: 0.82, z: lanternZ, ry: PI / 4, hex2: STONE_HI })); // roof

    // Stone lantern - right side
    const lantern2X = 1.2;
    parts.push(box(0.22, 0.07, 0.22, STONE, { x: lantern2X, y: 0.135, z: lanternZ }));
    parts.push(cyl(0.055, 0.07, 0.32, 6, STONE, { x: lantern2X, y: 0.34, z: lanternZ }));
    parts.push(box(0.18, 0.16, 0.18, STONE, { x: lantern2X, y: 0.58, z: lanternZ, hex2: STONE_HI }));
    parts.push(cone(0.16, 0.2, 4, STONE, { x: lantern2X, y: 0.76, z: lanternZ, ry: PI / 4, hex2: STONE_HI }));

    // Shrine remnants (stone platform + simple structure)
    const shrineZ = -1.0;
    parts.push(box(1.4, 0.15, 1.0, STONE, { y: 0.175, z: shrineZ })); // platform
    parts.push(box(1.0, 0.6, 0.7, WOOD, { y: 0.55, z: shrineZ, hex2: 0x8a6a50 })); // shrine body
    parts.push(box(1.2, 0.08, 0.9, 0x3a3632, { y: 0.88, z: shrineZ })); // eave
    parts.push(cone(0.55, 0.35, 4, 0x3a3632, { y: 1.1, z: shrineZ, ry: PI / 4, sz: 0.7 })); // roof

    // Trees in the park
    // Left tree
    parts.push(cyl(0.1, 0.1, 0.55, 5, 0x5a4a3a, { x: -1.5, y: 0.375, z: -0.5 }));
    parts.push(sph(0.45, GARDEN, { ws: 6, hs: 4, x: -1.5, y: 0.95 + j, z: -0.5, hex2: 0x5a7a50 }));
    // Right tree
    parts.push(cyl(0.08, 0.08, 0.45, 5, 0x5a4a3a, { x: 1.4, y: 0.325, z: 0.8 }));
    parts.push(sph(0.35, GARDEN, { ws: 6, hs: 4, x: 1.4, y: 0.78, z: 0.8, hex2: 0x5a7a50 }));

    // Decorative pond (small)
    parts.push(cyl(0.4, 0.42, 0.08, 8, STONE, { x: 0.8, y: 0.14, z: -0.5 }));
    parts.push(cyl(0.36, 0.36, 0.05, 8, 0x5898a8, { x: 0.8, y: 0.17, z: -0.5, hex2: 0x78b8c8 }));

    return finish(parts);
  },
};

export default NM_CHIAYI_PARK;
