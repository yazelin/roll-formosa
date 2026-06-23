/**
 * @file packs/yunlin/landmarks/xiluo_oldstreet.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_XILUO_OLDSTREET — 西螺老街 (Xiluo Old Street). A historic street featuring
 * baroque-style shophouses from the Japanese colonial era, with ornate facades,
 * decorative parapets, and arched colonnades. Known for soy sauce and rice products.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const BRICK = 0xb87858;       // red brick
const BRICK_HI = 0xd89878;    // brick highlight
const CREAM = 0xf0e8d0;       // cream facade
const CREAM_HI = 0xfcf4e8;    // cream highlight
const WINDOW = 0x3a4858;      // dark window
const ROOF = 0x4a4038;        // dark roof tile
const COLUMN = 0xd8d0c0;      // column white

export const NM_XILUO_OLDSTREET = {
  id: 'xiluo_oldstreet',
  name: '西螺老街',
  landmarkId: 3,
  dioramaRHint: 48, // row of shophouses
  colorHex: BRICK,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Street base
    parts.push(box(4.5, 0.1, 2.5, 0x686058, { y: 0.05 }));

    // Row of baroque shophouses
    const baseY = 0.1;

    // Building 1 (left) - cream baroque
    const b1x = -1.5;
    parts.push(box(1.1, 1.0, 0.9, CREAM, { x: b1x, y: baseY + 0.5, hex2: CREAM_HI }));
    // Baroque parapet with curved top
    parts.push(box(1.2, 0.25, 0.15, CREAM, { x: b1x, y: baseY + 1.15, z: 0.4 }));
    parts.push(sph(0.18, CREAM_HI, { ws: 5, hs: 3, x: b1x, y: baseY + 1.32, z: 0.4, sy: 0.6 }));
    // Windows
    parts.push(box(0.25, 0.35, 0.08, WINDOW, { x: b1x - 0.25, y: baseY + 0.6, z: 0.46 }));
    parts.push(box(0.25, 0.35, 0.08, WINDOW, { x: b1x + 0.25, y: baseY + 0.6, z: 0.46 }));
    // Arcade columns
    parts.push(cyl(0.06, 0.07, 0.6, 6, COLUMN, { x: b1x - 0.35, y: baseY + 0.3, z: 0.6 }));
    parts.push(cyl(0.06, 0.07, 0.6, 6, COLUMN, { x: b1x + 0.35, y: baseY + 0.3, z: 0.6 }));

    // Building 2 (center) - brick baroque, taller
    const b2x = 0;
    parts.push(box(1.2, 1.15, 0.95, BRICK, { x: b2x, y: baseY + 0.575, hex2: BRICK_HI }));
    // Ornate parapet
    parts.push(box(1.3, 0.3, 0.12, BRICK, { x: b2x, y: baseY + 1.3, z: 0.42 }));
    parts.push(cone(0.12, 0.2, 4, BRICK_HI, { x: b2x - 0.45, y: baseY + 1.5, z: 0.42, ry: PI / 4 }));
    parts.push(cone(0.12, 0.2, 4, BRICK_HI, { x: b2x + 0.45, y: baseY + 1.5, z: 0.42, ry: PI / 4 }));
    parts.push(sph(0.12, BRICK_HI, { ws: 5, hs: 3, x: b2x, y: baseY + 1.48, z: 0.42, sy: 0.5 }));
    // Arched windows
    parts.push(box(0.22, 0.4, 0.08, WINDOW, { x: b2x - 0.3 + j, y: baseY + 0.65, z: 0.48 }));
    parts.push(box(0.22, 0.4, 0.08, WINDOW, { x: b2x + 0.3, y: baseY + 0.65, z: 0.48 }));
    // Arcade
    parts.push(cyl(0.07, 0.08, 0.65, 6, COLUMN, { x: b2x - 0.4, y: baseY + 0.325, z: 0.65 }));
    parts.push(cyl(0.07, 0.08, 0.65, 6, COLUMN, { x: b2x + 0.4, y: baseY + 0.325, z: 0.65 }));

    // Building 3 (right) - cream with green trim
    const b3x = 1.5;
    parts.push(box(1.0, 0.95, 0.85, CREAM, { x: b3x, y: baseY + 0.475, hex2: CREAM_HI }));
    // Stepped parapet
    parts.push(box(1.1, 0.2, 0.12, 0x68a078, { x: b3x, y: baseY + 1.05, z: 0.38 }));
    parts.push(box(0.6, 0.15, 0.12, 0x68a078, { x: b3x, y: baseY + 1.22, z: 0.38 }));
    // Windows
    parts.push(box(0.2, 0.32, 0.08, WINDOW, { x: b3x, y: baseY + 0.55, z: 0.44 }));
    // Columns
    parts.push(cyl(0.05, 0.06, 0.55, 6, COLUMN, { x: b3x - 0.32, y: baseY + 0.275, z: 0.55 }));
    parts.push(cyl(0.05, 0.06, 0.55, 6, COLUMN, { x: b3x + 0.32, y: baseY + 0.275, z: 0.55 }));

    // Arcade roof/awning
    parts.push(box(4.0, 0.08, 0.5, ROOF, { y: baseY + 0.68, z: 0.65 }));

    // Street lamp
    parts.push(cyl(0.04, 0.04, 0.8, 4, 0x3a3a3a, { x: 1.8, y: baseY + 0.4, z: -0.8 }));
    parts.push(sph(0.08, 0xf8e8a0, { ws: 4, hs: 3, x: 1.8, y: baseY + 0.85, z: -0.8 }));

    return finish(parts);
  },
};

export default NM_XILUO_OLDSTREET;
