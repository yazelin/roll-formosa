/**
 * @file packs/changhua/landmarks/moruxiang.js — Roll Formosa Changhua pack.
 *
 * 摸乳巷 (Breast-Touching Lane / Moru Lane). A famous narrow alley in Lukang,
 * only about 70 cm wide at its narrowest point. The brick walls of traditional
 * Qing-dynasty shophouses on both sides create this intimate passage. The name
 * comes from the fact that two people passing must press against each other.
 * Features red brick walls, traditional roof tiles, and lanterns.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, HALF_PI } from '../geomHelpers.js';

const BRICK = 0xa86048;     // red brick wall
const BRICK_D = 0x804838;   // darker brick
const STONE = 0xb0a890;     // stone floor
const ROOF = 0x484040;      // dark roof tiles
const WOOD = 0x705840;      // wooden beams
const LANTERN = 0xe84028;   // red lantern

export const NM_MORUXIANG = {
  id: 'moruxiang',
  name: '摸乳巷',
  landmarkId: 10,
  dioramaRHint: 15,
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];
    const alleyWidth = 0.18;
    const wallThickness = 0.12;
    const wallH = 1.2;

    // Stone floor
    parts.push(box(alleyWidth, 0.06, 2.4, STONE, { y: 0.03 }));

    // Left wall (shophouse)
    parts.push(box(wallThickness, wallH, 2.2, BRICK, {
      x: -(alleyWidth / 2 + wallThickness / 2), y: wallH / 2 + 0.06, hex2: BRICK_D,
    }));
    // Left roof overhang
    parts.push(box(0.24, 0.06, 2.2, ROOF, {
      x: -(alleyWidth / 2 + 0.12), y: wallH + 0.09,
    }));

    // Right wall (shophouse)
    parts.push(box(wallThickness, wallH, 2.2, BRICK, {
      x: (alleyWidth / 2 + wallThickness / 2), y: wallH / 2 + 0.06, hex2: BRICK_D,
    }));
    // Right roof overhang
    parts.push(box(0.24, 0.06, 2.2, ROOF, {
      x: (alleyWidth / 2 + 0.12), y: wallH + 0.09,
    }));

    // Additional building mass behind walls (to show it's not just a wall)
    for (const dx of [-1, 1]) {
      parts.push(box(0.50, 1.4, 2.0, BRICK_D, {
        x: dx * (alleyWidth / 2 + wallThickness + 0.25), y: 0.76,
      }));
      // Sloped roof
      parts.push(box(0.60, 0.05, 2.0, ROOF, {
        x: dx * (alleyWidth / 2 + wallThickness + 0.25), y: 1.50,
        rx: dx * 0.25,
      }));
    }

    // Wooden beam crossing the alley (connecting buildings)
    parts.push(box(alleyWidth + wallThickness * 2 + 0.10, 0.06, 0.08, WOOD, {
      y: wallH - 0.20, z: -0.40,
    }));
    parts.push(box(alleyWidth + wallThickness * 2 + 0.10, 0.06, 0.08, WOOD, {
      y: wallH - 0.20, z: 0.40,
    }));

    // Red lanterns hanging in the alley
    for (const z of [-0.60, 0.60]) {
      // Lantern body
      parts.push(cyl(0.06, 0.06, 0.12, 6, LANTERN, {
        y: wallH - 0.35, z,
      }));
      // Lantern string
      parts.push(cyl(0.01, 0.01, 0.10, 4, 0x404040, {
        y: wallH - 0.24, z,
      }));
    }

    // Narrowest point marker (slightly protruding bricks)
    parts.push(box(0.04, 0.30, 0.15, BRICK, {
      x: -(alleyWidth / 2), y: 0.50, z: 0,
    }));
    parts.push(box(0.04, 0.30, 0.15, BRICK, {
      x: (alleyWidth / 2), y: 0.50, z: 0,
    }));

    return finish(parts);
  },
};

export default NM_MORUXIANG;
