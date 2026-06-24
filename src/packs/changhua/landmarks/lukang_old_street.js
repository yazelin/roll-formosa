/**
 * @file packs/changhua/landmarks/lukang_old_street.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_LUKANG_OLD_STREET — 鹿港老街 (Lukang Old Street), the famous heritage
 * commercial street with Qing-dynasty arcade shophouses. Features the iconic
 * narrow street with wooden shop facades, red brick arcades, and traditional
 * hanging signs. A top tourist destination in Taiwan.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const BRICK = 0xc86838;       // red brick
const BRICK_D = 0xa85828;     // brick shadow
const WOOD = 0x8b6914;        // wooden facade
const WOOD_D = 0x6b4910;      // wood shadow
const ROOF_TILE = 0x484848;   // gray roof tiles
const LANTERN = 0xd82020;     // red lantern

export const NM_LUKANG_OLD_STREET = {
  id: 'lukang_old_street',
  name: '鹿港老街',
  landmarkId: 91,
  dioramaRHint: 60,
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];

    // Row of connected shophouses - left side
    for (let i = 0; i < 4; i++) {
      const x = -0.55 + i * 0.35;
      // Brick base
      parts.push(box(0.30, 0.35, 0.4, BRICK, { x, y: 0.175, z: -0.35, hex2: BRICK_D }));
      // Wooden upper floor
      parts.push(box(0.30, 0.30, 0.35, WOOD, { x, y: 0.50, z: -0.35, hex2: WOOD_D }));
      // Roof
      parts.push(box(0.34, 0.06, 0.40, ROOF_TILE, { x, y: 0.68, z: -0.35 }));
      // Arcade column
      parts.push(cyl(0.03, 0.03, 0.35, 4, BRICK, { x: x + 0.12, y: 0.175, z: -0.12 }));
    }

    // Row of connected shophouses - right side
    for (let i = 0; i < 4; i++) {
      const x = -0.55 + i * 0.35;
      // Brick base
      parts.push(box(0.30, 0.35, 0.4, BRICK, { x, y: 0.175, z: 0.35, hex2: BRICK_D }));
      // Wooden upper floor
      parts.push(box(0.30, 0.30, 0.35, WOOD, { x, y: 0.50, z: 0.35, hex2: WOOD_D }));
      // Roof
      parts.push(box(0.34, 0.06, 0.40, ROOF_TILE, { x, y: 0.68, z: 0.35 }));
      // Arcade column
      parts.push(cyl(0.03, 0.03, 0.35, 4, BRICK, { x: x + 0.12, y: 0.175, z: 0.12 }));
    }

    // Street surface
    parts.push(box(1.5, 0.02, 0.25, 0x484040, { y: 0.01 }));

    // Red lanterns hanging across street
    for (const x of [-0.40, 0.0, 0.40]) {
      parts.push(sph(0.05, LANTERN, { ws: 5, hs: 3, x, y: 0.55, sy: 1.3 }));
    }

    // Shop signs
    parts.push(box(0.10, 0.12, 0.02, 0xf8e8c8, { x: -0.20, y: 0.42, z: -0.16 }));
    parts.push(box(0.10, 0.12, 0.02, 0xf8e8c8, { x: 0.30, y: 0.42, z: 0.16 }));

    return finish(parts);
  },
};

export default NM_LUKANG_OLD_STREET;
