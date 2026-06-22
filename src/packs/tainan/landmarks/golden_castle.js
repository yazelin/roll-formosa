/**
 * @file packs/tainan/landmarks/golden_castle.js — Roll Formosa Tainan pack.
 *
 * NM_GOLDEN_CASTLE — 億載金城 (Eternal Golden Castle). Taiwan's first Western-style
 * coastal fort: a low SQUARE earthwork rampart with angled BASTION corners
 * (diamond points jutting from each corner), a red-brick ARCHED gateway in the
 * front wall, grassy green ramparts on top, an old cannon on the wall, and a
 * thin moat ring hinted around the whole work.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). The fort is authored WIDE + LOW — a flat star of
 * grassy ramparts, never a tower. Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const GRASS = 0x8a9a5b; // grassy rampart top
const GRASS_DK = 0x6f7e46; // earthwork slope shadow
const EARTH = 0x9c8f63; // raw earth wall face
const BRICK = 0xb1493a; // red-brick gateway arch
const BRICK2 = 0x933a2e; // darker brick / arch shadow
const STONE = 0xcfc7b2; // gate surround / coping
const IRON = 0x3a3d40; // old iron cannon
const MOAT = 0x4e8a86; // blue-green moat water

export const NM_GOLDEN_CASTLE = {
  id: 'eternal_golden_castle',
  name: '億載金城',
  landmarkId: 5,
  dioramaRHint: 70, // square bastioned fort, ~ wide low earthwork
  colorHex: GRASS,
  buildGeometry(rng) {
    const r0 = rng() * 0.02; // tiny non-structural jitter
    const parts = [];

    /* ---- hint of moat: thin flat blue-green ring around the fort ------- */
    parts.push(box(4.7, 0.06, 4.7, MOAT, { y: 0.03 })); // moat water plate (peeks out past the walls)

    /* ---- square earthwork rampart (battered walls + grassy top) -------- */
    // Battered earth wall: wider at base, narrowing up (square prism, seg=4).
    parts.push(cyl(1.9, 2.2, 0.95, 4, EARTH, { y: 0.55, ry: PI / 4, hex2: GRASS_DK }));
    // Grassy rampart top deck.
    parts.push(box(3.4, 0.22, 3.4, GRASS, { y: 1.1, hex2: 0x9aab66 }));
    // Low parapet lip running the perimeter.
    parts.push(box(3.5, 0.12, 3.5, GRASS_DK, { y: 1.24 }));
    // Hollow centre suggestion: a slightly sunken inner parade ground.
    parts.push(box(2.2, 0.08, 2.2, GRASS_DK, { y: 1.18 }));

    /* ---- four angled BASTION corner points (diamond spurs) ------------- */
    // Each bastion is a small square prism (seg=4) pushed out on a diagonal so
    // its corner faces outward — the classic star-fort spur.
    const b = 1.55; // diagonal offset to each corner
    for (const [bx, bz] of [[-b, -b], [b, -b], [-b, b], [b, b]]) {
      parts.push(cyl(0.55, 0.72, 1.0, 4, EARTH, { x: bx, y: 0.55, z: bz, hex2: GRASS_DK })); // bastion earthwork
      parts.push(box(0.95, 0.18, 0.95, GRASS, { x: bx, y: 1.12, z: bz, ry: PI / 4, hex2: 0x9aab66 })); // bastion grassy cap (corner forward)
    }

    /* ---- red-brick arched gateway in the front wall -------------------- */
    // Stone gate surround projecting from the front rampart.
    parts.push(box(1.1, 1.05, 0.4, STONE, { y: 0.6, z: 2.05, hex2: 0xe2dcc9 })); // gate block
    // Red-brick arch face inset into the surround.
    parts.push(box(0.84, 0.9, 0.14, BRICK, { y: 0.55, z: 2.22, hex2: BRICK2 })); // brick arch ground
    parts.push(cyl(0.4, 0.4, 0.16, 8, BRICK, { y: 0.92, z: 2.22, rx: HALF_PI, thetaLen: PI, theta0: 0, hex2: BRICK2 })); // semicircular arch head
    // Dark recessed doorway opening.
    parts.push(box(0.46, 0.66, 0.1, BRICK2, { y: 0.45, z: 2.3 })); // gate opening shadow

    /* ---- old cannons on the rampart ------------------------------------ */
    // A long iron barrel pointing out over the front-left wall.
    parts.push(cyl(0.09, 0.11, 0.85, 8, IRON, { x: -0.8, y: 1.36, z: 1.2, rx: HALF_PI - 0.25 }));
    parts.push(box(0.26, 0.18, 0.3, 0x4a3a2c, { x: -0.8, y: 1.26, z: 1.0 })); // wood carriage
    // A second cannon on the right bastion, angled differently.
    parts.push(cyl(0.08, 0.1, 0.7, 8, IRON, { x: 1.0, y: 1.36, z: 0.9, rx: HALF_PI - 0.2, ry: 0.4 + r0 }));

    return finish(parts);
  },
};

export default NM_GOLDEN_CASTLE;
