/**
 * @file packs/changhua/landmarks/lukang_wenkai_academy.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_LUKANG_WENKAI_ACADEMY — 鹿港文開書院 (Lukang Wenkai Academy), a Qing
 * dynasty academy established in 1824 for civil service exam preparation.
 * Features traditional Fujian-style architecture with a main hall, lecture
 * rooms, and a beautiful courtyard garden. A national historic site.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const WALL = 0xe8dcc8;        // cream-colored walls
const WALL_D = 0xc8bcb0;      // wall shadow
const ROOF = 0x383838;        // dark gray tiles
const WOOD = 0x8b5a28;        // wooden beams
const COLUMN = 0xc82828;      // red columns
const COURTYARD = 0x989080;   // stone courtyard

export const NM_LUKANG_WENKAI_ACADEMY = {
  id: 'lukang_wenkai_academy',
  name: '鹿港文開書院',
  landmarkId: 96,
  dioramaRHint: 35,
  colorHex: WALL,

  buildGeometry(rng) {
    const parts = [];

    // Main hall building
    parts.push(box(0.70, 0.35, 0.45, WALL, { y: 0.175, z: -0.35, hex2: WALL_D }));

    // Main hall roof (hip-and-gable style)
    parts.push(box(0.80, 0.08, 0.50, ROOF, { y: 0.40, z: -0.35 }));
    parts.push(box(0.60, 0.06, 0.40, ROOF, { y: 0.48, z: -0.35 }));

    // Front entrance porch
    parts.push(box(0.45, 0.25, 0.15, WALL, { y: 0.125, z: -0.10 }));
    parts.push(box(0.50, 0.05, 0.18, ROOF, { y: 0.28, z: -0.10 }));

    // Red columns at entrance
    for (const x of [-0.18, 0.18]) {
      parts.push(cyl(0.03, 0.03, 0.25, 6, COLUMN, { x, y: 0.125, z: -0.02 }));
    }

    // Side wings (lecture rooms)
    for (const x of [-0.50, 0.50]) {
      parts.push(box(0.25, 0.28, 0.35, WALL, { x, y: 0.14, z: -0.20 }));
      parts.push(box(0.28, 0.05, 0.38, ROOF, { x, y: 0.30, z: -0.20 }));
    }

    // Courtyard
    parts.push(box(0.60, 0.02, 0.35, COURTYARD, { y: 0.01, z: 0.20 }));

    // Stone pathways
    parts.push(box(0.10, 0.02, 0.30, 0x888080, { y: 0.02, z: 0.05 }));

    // Courtyard trees
    parts.push(cyl(0.03, 0.03, 0.15, 4, 0x604020, { x: -0.20, y: 0.08, z: 0.25 }));
    parts.push(sph(0.10, 0x408040, { ws: 5, hs: 3, x: -0.20, y: 0.20, z: 0.25 }));
    parts.push(cyl(0.03, 0.03, 0.15, 4, 0x604020, { x: 0.20, y: 0.08, z: 0.25 }));
    parts.push(sph(0.10, 0x408040, { ws: 5, hs: 3, x: 0.20, y: 0.20, z: 0.25 }));

    // Front gate
    parts.push(box(0.08, 0.20, 0.05, WALL, { x: -0.30, y: 0.10, z: 0.40 }));
    parts.push(box(0.08, 0.20, 0.05, WALL, { x: 0.30, y: 0.10, z: 0.40 }));
    parts.push(box(0.68, 0.04, 0.06, ROOF, { y: 0.22, z: 0.40 }));

    return finish(parts);
  },
};

export default NM_LUKANG_WENKAI_ACADEMY;
