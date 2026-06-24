/**
 * @file packs/kinmen/landmarks/deyue_tower.js — Roll Formosa Kinmen pack.
 *
 * 得月樓 (Deyue Tower). A famous historical building in Shuitou Village,
 * built in 1931 by overseas Chinese. The four-story Western-style tower
 * served as a defensive structure against pirates.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const WALL_CREAM = 0xf0e6d0;
const WALL_ACCENT = 0xe0d4c0;
const ROOF_GREY = 0x5a5a5a;
const WINDOW_DARK = 0x2a3a4a;
const TRIM_WHITE = 0xf8f8f8;
const BASE_STONE = 0x707070;

export const NM_DEYUE_TOWER = {
  id: 'deyue_tower',
  name: '得月樓',
  landmarkId: 1,
  dioramaRHint: 8,
  colorHex: WALL_CREAM,

  buildGeometry(rng) {
    const parts = [];

    // Base platform
    parts.push(box(1.2, 0.15, 1.0, BASE_STONE, { y: 0.075 }));

    // Tower body - four stories
    // First floor
    parts.push(box(0.9, 0.5, 0.8, WALL_CREAM, { y: 0.4, hex2: WALL_ACCENT }));
    // Windows
    parts.push(box(0.12, 0.2, 0.02, WINDOW_DARK, { y: 0.35, z: 0.41, x: -0.25 }));
    parts.push(box(0.12, 0.2, 0.02, WINDOW_DARK, { y: 0.35, z: 0.41, x: 0.25 }));

    // Second floor
    parts.push(box(0.08, 0.02, 0.85, TRIM_WHITE, { y: 0.66 })); // floor line
    parts.push(box(0.85, 0.45, 0.75, WALL_CREAM, { y: 0.9, hex2: WALL_ACCENT }));
    parts.push(box(0.1, 0.18, 0.02, WINDOW_DARK, { y: 0.85, z: 0.38, x: -0.22 }));
    parts.push(box(0.1, 0.18, 0.02, WINDOW_DARK, { y: 0.85, z: 0.38, x: 0.22 }));

    // Third floor
    parts.push(box(0.08, 0.02, 0.8, TRIM_WHITE, { y: 1.14 }));
    parts.push(box(0.8, 0.42, 0.7, WALL_CREAM, { y: 1.36, hex2: WALL_ACCENT }));
    parts.push(box(0.09, 0.16, 0.02, WINDOW_DARK, { y: 1.32, z: 0.36, x: -0.2 }));
    parts.push(box(0.09, 0.16, 0.02, WINDOW_DARK, { y: 1.32, z: 0.36, x: 0.2 }));

    // Fourth floor (gun tower / lookout)
    parts.push(box(0.08, 0.02, 0.75, TRIM_WHITE, { y: 1.58 }));
    parts.push(box(0.7, 0.35, 0.6, WALL_CREAM, { y: 1.78, hex2: WALL_ACCENT }));
    // Gun slits
    parts.push(box(0.08, 0.06, 0.02, WINDOW_DARK, { y: 1.75, z: 0.31, x: -0.18 }));
    parts.push(box(0.08, 0.06, 0.02, WINDOW_DARK, { y: 1.75, z: 0.31, x: 0 }));
    parts.push(box(0.08, 0.06, 0.02, WINDOW_DARK, { y: 1.75, z: 0.31, x: 0.18 }));

    // Roof with battlements
    parts.push(box(0.75, 0.08, 0.65, ROOF_GREY, { y: 1.98 }));
    // Corner battlements
    parts.push(box(0.12, 0.15, 0.1, WALL_CREAM, { y: 2.08, x: -0.32, z: 0.28 }));
    parts.push(box(0.12, 0.15, 0.1, WALL_CREAM, { y: 2.08, x: 0.32, z: 0.28 }));
    parts.push(box(0.12, 0.15, 0.1, WALL_CREAM, { y: 2.08, x: -0.32, z: -0.28 }));
    parts.push(box(0.12, 0.15, 0.1, WALL_CREAM, { y: 2.08, x: 0.32, z: -0.28 }));

    // Entrance porch
    parts.push(box(0.25, 0.35, 0.15, WALL_CREAM, { y: 0.32, z: 0.52 }));
    parts.push(box(0.3, 0.04, 0.18, ROOF_GREY, { y: 0.52, z: 0.54 }));

    return finish(parts);
  },
};

export default NM_DEYUE_TOWER;
