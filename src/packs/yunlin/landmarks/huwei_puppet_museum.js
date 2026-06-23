/**
 * @file packs/yunlin/landmarks/huwei_puppet_museum.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_HUWEI_PUPPET_MUSEUM — 虎尾布袋戲館 (Huwei Puppet Museum). Housed in a historic
 * Japanese-era building, this museum showcases Taiwan's traditional glove puppetry
 * heritage. Features colonial architecture with a prominent tower and arched windows.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WALL = 0xe8d8c0;        // cream colonial wall
const WALL_HI = 0xf8f0e0;     // wall highlight
const ROOF = 0x4a3830;        // dark roof tile
const ROOF_HI = 0x5a4840;     // roof highlight
const WINDOW = 0x2a3848;      // dark window
const TRIM = 0x8a7a68;        // trim color
const PUPPET_RED = 0xc82828;  // red accent (puppet colors)

export const NM_HUWEI_PUPPET_MUSEUM = {
  id: 'huwei_puppet_museum',
  name: '虎尾布袋戲館',
  landmarkId: 0,
  dioramaRHint: 42, // museum building
  colorHex: WALL,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Foundation platform
    parts.push(box(3.2, 0.15, 2.2, 0x787068, { y: 0.075 }));

    const baseY = 0.15;

    // Main building body - colonial style
    parts.push(box(2.4, 0.85, 1.6, WALL, { y: baseY + 0.425, hex2: WALL_HI }));

    // Arched windows row (front)
    for (const wx of [-0.7, 0, 0.7]) {
      parts.push(box(0.28, 0.4, 0.08, WINDOW, { x: wx, y: baseY + 0.5, z: 0.82 }));
      // Arch tops
      parts.push(sph(0.14, WALL_HI, { ws: 4, hs: 2, x: wx, y: baseY + 0.72, z: 0.82, sy: 0.35 }));
    }

    // Entrance door
    parts.push(box(0.35, 0.55, 0.1, 0x5a4030, { y: baseY + 0.325, z: 0.82 }));

    // Central tower
    parts.push(box(0.9, 0.6, 0.8, WALL, { y: baseY + 1.15, hex2: WALL_HI }));
    // Tower clock face / decorative circle
    parts.push(cyl(0.2, 0.2, 0.08, 8, 0xf8f0d8, { y: baseY + 1.25, z: 0.42, rx: HALF_PI }));
    parts.push(cyl(0.15, 0.15, 0.1, 8, TRIM, { y: baseY + 1.25, z: 0.44, rx: HALF_PI }));

    // Tower roof - pyramidal
    parts.push(box(1.0, 0.08, 0.9, ROOF, { y: baseY + 1.49 }));
    parts.push(cone(0.5, 0.45, 4, ROOF, { y: baseY + 1.75, ry: PI / 4, hex2: ROOF_HI }));
    // Spire
    parts.push(cyl(0.04, 0.02, 0.25, 4, TRIM, { y: baseY + 2.1 + j }));

    // Main roof
    parts.push(box(2.6, 0.1, 1.8, ROOF, { y: baseY + 0.9 }));
    parts.push(box(2.4, 0.2, 1.6, ROOF, { y: baseY + 1.0, sx: 0.92, sz: 0.92, hex2: ROOF_HI }));

    // Side wings
    for (const sx of [-1.0, 1.0]) {
      parts.push(box(0.55, 0.65, 1.2, WALL, { x: sx, y: baseY + 0.325, hex2: WALL_HI }));
      parts.push(box(0.6, 0.06, 1.3, ROOF, { x: sx, y: baseY + 0.68 }));
    }

    // Decorative puppet display stand (outside)
    parts.push(box(0.3, 0.5, 0.15, 0x5a4030, { x: -1.3, y: baseY + 0.25, z: 0.9 }));
    // Puppet figure suggestion
    parts.push(sph(0.08, PUPPET_RED, { ws: 4, hs: 3, x: -1.3, y: baseY + 0.55, z: 0.9 }));
    parts.push(box(0.12, 0.2, 0.08, 0xe8c848, { x: -1.3, y: baseY + 0.4, z: 0.9 }));

    // Banner / sign
    parts.push(box(0.8, 0.15, 0.05, PUPPET_RED, { y: baseY + 0.75, z: 0.88 }));

    return finish(parts);
  },
};

export default NM_HUWEI_PUPPET_MUSEUM;
