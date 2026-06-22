/**
 * @file packs/hualien/landmarks/swallow_grotto.js — Roll Formosa Hualien pack.
 *
 * NM_SWALLOW — 燕子口 (Swallow Grotto / Yanzikou), one of the most famous
 * scenic spots in Taroko National Park. Features dramatic marble cliff faces
 * with countless small caves (where swallows nest), the Liwu River cutting
 * through the gorge, and the narrow trail carved into the cliff side.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Gorge and marble colors
const MARBLE_W = 0xe8e0d8; // white marble
const MARBLE_G = 0xb0b8a8; // grey-green marble
const MARBLE_D = 0x8a8a80; // darker marble shadows
const RIVER = 0x5ab8c8; // turquoise Liwu River
const RIVER_D = 0x3a8898; // deeper river
const TRAIL = 0x7a7060; // trail surface
const RAILING = 0x5a5a5a; // trail railing
const CAVE = 0x3a3a3a; // cave openings

export const NM_SWALLOW = {
  id: 'swallow_grotto',
  name: '燕子口',
  landmarkId: 7,
  dioramaRHint: 60,
  colorHex: MARBLE_W,

  buildGeometry(rng) {
    const parts = [];

    // ---- River (Liwu River cutting through gorge) ------------------------
    parts.push(box(1.0, 0.1, 4.0, RIVER, { y: 0.05, hex2: RIVER_D }));

    // ---- Left cliff face (main marble wall with caves) -------------------
    // Dramatic vertical cliff
    parts.push(box(0.8, 3.5, 3.2, MARBLE_W, { x: -1.0, y: 1.85, hex2: MARBLE_G }));
    // Cliff face texture (staggered boxes for layered look)
    parts.push(box(0.15, 1.0, 0.8, MARBLE_G, { x: -0.55, y: 1.5, z: 0.6 }));
    parts.push(box(0.12, 0.8, 0.6, MARBLE_D, { x: -0.58, y: 2.3, z: -0.4 }));
    parts.push(box(0.18, 1.2, 0.7, MARBLE_G, { x: -0.52, y: 0.8, z: -0.8 }));

    // Swallow cave openings (small dark holes in the cliff)
    const cavePositions = [
      [-0.58, 2.0, 0.3], [-0.55, 2.4, -0.2], [-0.56, 1.6, 0.8],
      [-0.54, 2.8, 0.5], [-0.57, 1.3, -0.5], [-0.55, 2.2, 1.0],
      [-0.56, 1.8, -0.9], [-0.54, 2.6, -0.7], [-0.58, 1.1, 0.2],
    ];
    for (const [cx, cy, cz] of cavePositions) {
      const size = 0.06 + rng() * 0.04;
      parts.push(cyl(size, size * 0.8, 0.08, 6, CAVE, { x: cx, y: cy, z: cz, ry: HALF_PI }));
    }

    // ---- Right cliff face ------------------------------------------------
    parts.push(box(0.6, 2.8, 2.8, MARBLE_G, { x: 1.0, y: 1.5, hex2: MARBLE_D }));
    parts.push(box(0.12, 0.9, 0.7, MARBLE_W, { x: 0.68, y: 1.8, z: 0.4 }));
    parts.push(box(0.15, 1.1, 0.5, MARBLE_W, { x: 0.65, y: 1.2, z: -0.6 }));

    // ---- Trail carved into left cliff ------------------------------------
    // Trail platform
    parts.push(box(0.25, 0.08, 2.5, TRAIL, { x: -0.48, y: 0.14, z: 0 }));
    // Safety railing (simplified)
    parts.push(box(0.02, 0.2, 2.4, RAILING, { x: -0.35, y: 0.24, z: 0 }));
    // Railing posts
    for (let z = -1.0; z <= 1.0; z += 0.5) {
      parts.push(cyl(0.015, 0.015, 0.22, 6, RAILING, { x: -0.35, y: 0.21, z }));
    }

    // ---- Rocky outcrops and boulders in river ----------------------------
    parts.push(ico(0.15, 1, MARBLE_G, { x: 0.1, y: 0.15, z: 0.5 }));
    parts.push(ico(0.12, 1, MARBLE_W, { x: -0.15, y: 0.12, z: -0.3 }));
    parts.push(ico(0.10, 0, MARBLE_D, { x: 0.2, y: 0.10, z: -0.8 }));

    // ---- Viewing platform sign post -------------------------------------
    parts.push(box(0.04, 0.4, 0.04, 0x5a4030, { x: -0.3, y: 0.30, z: 0.8 }));
    parts.push(box(0.15, 0.08, 0.02, 0xf0e0c0, { x: -0.3, y: 0.48, z: 0.8 })); // sign

    // ---- Distant gorge continuation -------------------------------------
    parts.push(box(0.3, 1.5, 0.8, MARBLE_D, { x: -0.85, y: 0.75, z: -1.7 }));
    parts.push(box(0.25, 1.3, 0.7, MARBLE_G, { x: 0.8, y: 0.65, z: -1.6 }));

    return finish(parts);
  },
};

export default NM_SWALLOW;
