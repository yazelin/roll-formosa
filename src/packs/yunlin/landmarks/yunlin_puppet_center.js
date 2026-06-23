/**
 * @file packs/yunlin/landmarks/yunlin_puppet_center.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_YUNLIN_PUPPET_CENTER — 雲林布袋戲偶文物館 (Yunlin Puppet Cultural Center).
 * A cultural center dedicated to preserving and showcasing Taiwan's traditional
 * glove puppetry (布袋戲) heritage, featuring exhibition halls and puppet displays.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WALL = 0xd8c8b0;        // warm cream wall
const WALL_HI = 0xf0e8d8;     // wall highlight
const ROOF = 0x8a2828;        // traditional red roof
const ROOF_HI = 0xa83838;     // roof highlight
const PUPPET_GOLD = 0xd8a830; // golden puppet accent
const CURTAIN = 0xa82020;     // stage curtain red
const WOOD = 0x6a5040;        // dark wood

export const NM_YUNLIN_PUPPET_CENTER = {
  id: 'yunlin_puppet_center',
  name: '雲林布袋戲偶文物館',
  landmarkId: 4,
  dioramaRHint: 50, // cultural center
  colorHex: ROOF,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Foundation / plaza
    parts.push(box(3.8, 0.12, 2.8, 0x787068, { y: 0.06 }));

    const baseY = 0.12;

    // Main exhibition building
    parts.push(box(2.2, 0.9, 1.6, WALL, { y: baseY + 0.45, hex2: WALL_HI }));

    // Traditional curved roof (swallowtail style)
    parts.push(box(2.5, 0.1, 1.9, ROOF, { y: baseY + 0.95 }));
    parts.push(box(2.2, 0.3, 1.6, ROOF, { y: baseY + 1.15, sx: 0.9, sz: 0.9, hex2: ROOF_HI }));
    // Ridge
    parts.push(box(2.3, 0.08, 0.12, ROOF_HI, { y: baseY + 1.32 }));
    // Swallowtail tips
    for (const sx of [-1.1, 1.1]) {
      parts.push(cone(0.1, 0.18, 4, ROOF, {
        x: sx, y: baseY + 1.28, ry: (sx > 0 ? -1 : 1) * 0.3 + PI / 4, sz: 0.5
      }));
    }

    // Entrance with decorative frame
    parts.push(box(0.6, 0.7, 0.12, WOOD, { y: baseY + 0.4, z: 0.82 }));
    parts.push(box(0.45, 0.55, 0.14, 0x2a2828, { y: baseY + 0.32, z: 0.83 })); // door opening

    // Stage-style display window
    parts.push(box(0.8, 0.5, 0.1, CURTAIN, { x: 0.55, y: baseY + 0.55, z: 0.82 }));
    // Curtain folds
    parts.push(box(0.12, 0.45, 0.12, 0xc83030, { x: 0.2, y: baseY + 0.55, z: 0.84 }));
    parts.push(box(0.12, 0.45, 0.12, 0xc83030, { x: 0.9, y: baseY + 0.55, z: 0.84 }));

    // Puppet figure displays (outside)
    // Puppet 1 - heroic figure
    const p1x = -1.4;
    parts.push(box(0.2, 0.5, 0.12, 0x5a4030, { x: p1x, y: baseY + 0.25, z: 0.6 })); // stand
    parts.push(sph(0.1, 0xf8d8b8, { ws: 4, hs: 3, x: p1x, y: baseY + 0.6, z: 0.6 })); // head
    parts.push(box(0.18, 0.25, 0.1, 0x2858a8, { x: p1x, y: baseY + 0.42, z: 0.6 })); // body
    parts.push(cone(0.12, 0.15, 4, PUPPET_GOLD, { x: p1x, y: baseY + 0.72, z: 0.6, ry: PI / 4 })); // headdress

    // Puppet 2 - villain figure
    const p2x = 1.4;
    parts.push(box(0.2, 0.5, 0.12, 0x5a4030, { x: p2x, y: baseY + 0.25, z: 0.6 })); // stand
    parts.push(sph(0.1, 0xe8c8a8, { ws: 4, hs: 3, x: p2x, y: baseY + 0.6 + j, z: 0.6 })); // head
    parts.push(box(0.18, 0.25, 0.1, 0x282828, { x: p2x, y: baseY + 0.42, z: 0.6 })); // body
    parts.push(box(0.22, 0.08, 0.12, 0xc82020, { x: p2x, y: baseY + 0.68, z: 0.6 })); // hat

    // Side wing - workshop
    parts.push(box(0.8, 0.6, 1.0, WALL, { x: -1.3, y: baseY + 0.3, z: -0.2, hex2: WALL_HI }));
    parts.push(box(0.9, 0.08, 1.1, ROOF, { x: -1.3, y: baseY + 0.64, z: -0.2 }));
    parts.push(cone(0.45, 0.25, 4, ROOF, { x: -1.3, y: baseY + 0.82, z: -0.2, ry: PI / 4 }));

    // Decorative golden dragon on roof
    parts.push(cyl(0.05, 0.04, 0.3, 4, PUPPET_GOLD, {
      y: baseY + 1.42, rz: 0.8, hex2: 0xe8b840
    }));

    // Information sign
    parts.push(box(0.6, 0.4, 0.08, 0x285898, { x: 1.3, y: baseY + 0.3, z: -0.4 }));
    parts.push(cyl(0.04, 0.04, 0.5, 4, 0x3a3a3a, { x: 1.3, y: baseY + 0.25, z: -0.5 }));

    // Stone path
    parts.push(box(0.4, 0.05, 1.0, 0x888078, { y: baseY + 0.025, z: 0.3 }));

    return finish(parts);
  },
};

export default NM_YUNLIN_PUPPET_CENTER;
