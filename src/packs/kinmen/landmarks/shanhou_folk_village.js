/**
 * @file packs/kinmen/landmarks/shanhou_folk_village.js — Roll Formosa Kinmen pack.
 *
 * 山后民俗文化村 (Shanhou Folk Culture Village). A well-preserved traditional
 * Hokkien village featuring 18 two-story houses with swallow-tail roofs,
 * built by overseas Chinese returning from Japan in the late 19th century.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const WALL_BRICK = 0xb87050;    // Red brick
const WALL_CREAM = 0xf0e6d0;
const ROOF_RED = 0x8b3020;      // Traditional red tiles
const ROOF_DARK = 0x6a2018;
const BASE_STONE = 0x707070;
const WOOD_BROWN = 0x6a4a2a;
const WINDOW_DARK = 0x2a3a4a;

export const NM_SHANHOU_FOLK_VILLAGE = {
  id: 'shanhou_folk_village',
  name: '山后民俗文化村',
  landmarkId: 3,
  dioramaRHint: 15,
  colorHex: WALL_BRICK,

  buildGeometry(rng) {
    const parts = [];

    // Ground / courtyard
    parts.push(box(2.2, 0.08, 1.8, BASE_STONE, { y: 0.04 }));

    // Main ancestral hall (center, larger)
    // Base
    parts.push(box(0.8, 0.5, 0.6, WALL_BRICK, { y: 0.33, z: -0.4, hex2: WALL_CREAM }));
    // Swallow-tail roof
    parts.push(box(0.95, 0.08, 0.7, ROOF_RED, { y: 0.62, z: -0.4, hex2: ROOF_DARK }));
    parts.push(cone(0.12, 0.2, 3, ROOF_RED, { y: 0.72, z: -0.4, x: -0.42, rz: -0.4 })); // swallow tail
    parts.push(cone(0.12, 0.2, 3, ROOF_RED, { y: 0.72, z: -0.4, x: 0.42, rz: 0.4 }));
    // Central roof ridge
    parts.push(box(0.65, 0.12, 0.08, ROOF_DARK, { y: 0.72, z: -0.4 }));
    // Door
    parts.push(box(0.15, 0.3, 0.02, WOOD_BROWN, { y: 0.25, z: -0.09 }));

    // Left wing house
    parts.push(box(0.55, 0.4, 0.45, WALL_BRICK, { y: 0.28, z: -0.35, x: -0.65, hex2: WALL_CREAM }));
    parts.push(box(0.65, 0.06, 0.52, ROOF_RED, { y: 0.52, z: -0.35, x: -0.65 }));
    parts.push(box(0.1, 0.18, 0.02, WINDOW_DARK, { y: 0.28, z: -0.12, x: -0.65 }));

    // Right wing house
    parts.push(box(0.55, 0.4, 0.45, WALL_BRICK, { y: 0.28, z: -0.35, x: 0.65, hex2: WALL_CREAM }));
    parts.push(box(0.65, 0.06, 0.52, ROOF_RED, { y: 0.52, z: -0.35, x: 0.65 }));
    parts.push(box(0.1, 0.18, 0.02, WINDOW_DARK, { y: 0.28, z: -0.12, x: 0.65 }));

    // Front row of smaller houses
    for (let i = -1; i <= 1; i++) {
      parts.push(box(0.4, 0.32, 0.35, WALL_CREAM, { y: 0.24, z: 0.45, x: i * 0.55, hex2: WALL_BRICK }));
      parts.push(box(0.48, 0.05, 0.4, ROOF_RED, { y: 0.44, z: 0.45, x: i * 0.55 }));
      parts.push(box(0.08, 0.14, 0.02, WINDOW_DARK, { y: 0.22, z: 0.64, x: i * 0.55 }));
    }

    // Decorative wall / entrance gate
    parts.push(box(0.5, 0.35, 0.06, WALL_BRICK, { y: 0.255, z: 0.8 }));
    parts.push(box(0.15, 0.25, 0.08, WALL_CREAM, { y: 0.205, z: 0.8 })); // gate opening

    // Stone lions at entrance
    parts.push(sph(0.06, BASE_STONE, { ws: 4, hs: 3, x: -0.2, y: 0.14, z: 0.72, sy: 1.2 }));
    parts.push(sph(0.06, BASE_STONE, { ws: 4, hs: 3, x: 0.2, y: 0.14, z: 0.72, sy: 1.2 }));

    return finish(parts);
  },
};

export default NM_SHANHOU_FOLK_VILLAGE;
