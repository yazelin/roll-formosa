/**
 * @file packs/chiayi/landmarks/central_fountain.js — Roll Formosa Chiayi pack, LANDMARK.
 *
 * NM_CENTRAL_FOUNTAIN — 中央噴水池 (Central Fountain Roundabout). The iconic traffic
 * roundabout in downtown Chiayi with its signature white fountain sculpture, a landmark
 * at the intersection where the city's main roads converge. The fountain features a
 * tiered white sculpture with water jets.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { cyl, box, sph, torus, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const POOL = 0x6ab4c8;      // water blue
const POOL_HI = 0x98d4e8;   // water highlight
const WHITE = 0xf0ece4;     // white marble sculpture
const WHITE_HI = 0xf8f6f0;  // marble highlight
const ROAD = 0x484848;      // asphalt
const SIDEWALK = 0xa8a090;  // concrete sidewalk

export const NM_CENTRAL_FOUNTAIN = {
  id: 'central_fountain',
  name: '中央噴水池',
  landmarkId: 0,
  dioramaRHint: 25, // roundabout fountain
  colorHex: POOL,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.008;
    const parts = [];

    // Circular road / roundabout
    parts.push(cyl(2.2, 2.2, 0.1, 8, ROAD, { y: 0.05 }));
    // Inner sidewalk ring
    parts.push(cyl(1.5, 1.5, 0.14, 8, SIDEWALK, { y: 0.07 }));

    // Fountain pool base (circular pool)
    parts.push(cyl(1.1, 1.15, 0.2, 8, 0x808080, { y: 0.18 })); // pool rim
    parts.push(cyl(1.0, 1.0, 0.12, 8, POOL, { y: 0.26, hex2: POOL_HI })); // water surface

    // Central fountain sculpture - tiered white structure
    const baseY = 0.26;

    // First tier - wide base
    parts.push(cyl(0.55, 0.6, 0.3, 8, WHITE, { y: baseY + 0.15, hex2: WHITE_HI }));
    parts.push(torus(0.55, 0.05, 4, 8, WHITE_HI, { rx: HALF_PI, y: baseY + 0.32 }));

    // Second tier - middle bowl
    parts.push(cyl(0.25, 0.35, 0.25, 8, WHITE, { y: baseY + 0.45, hex2: WHITE_HI }));
    parts.push(cyl(0.38, 0.38, 0.06, 8, WHITE_HI, { y: baseY + 0.60 })); // bowl lip
    parts.push(cyl(0.32, 0.32, 0.04, 8, POOL, { y: baseY + 0.58, hex2: POOL_HI })); // water in bowl

    // Third tier - top bowl
    parts.push(cyl(0.12, 0.2, 0.3, 6, WHITE, { y: baseY + 0.78, hex2: WHITE_HI }));
    parts.push(cyl(0.22, 0.22, 0.05, 6, WHITE_HI, { y: baseY + 0.95 }));
    parts.push(cyl(0.18, 0.18, 0.03, 6, POOL, { y: baseY + 0.96, hex2: POOL_HI }));

    // Central water jet spout
    parts.push(cyl(0.04, 0.05, 0.2, 4, WHITE, { y: baseY + 1.1 }));
    parts.push(cyl(0.015, 0.02, 0.45, 4, POOL_HI, { y: baseY + 1.42 + j })); // water jet

    // Side water jets (shooting outward)
    for (let a = 0; a < PI * 2; a += PI / 3) {
      const jx = Math.sin(a) * 0.75;
      const jz = Math.cos(a) * 0.75;
      parts.push(cyl(0.025, 0.02, 0.2, 3, POOL_HI, {
        x: jx * 0.5, y: baseY + 0.5, z: jz * 0.5,
        rx: -0.6 * Math.cos(a), rz: 0.6 * Math.sin(a),
      }));
    }

    // Traffic lights / street elements around
    for (const ang of [0, PI / 2, PI, PI * 1.5]) {
      const px = Math.sin(ang) * 1.9;
      const pz = Math.cos(ang) * 1.9;
      parts.push(cyl(0.04, 0.04, 0.6, 4, 0x505050, { x: px, y: 0.4, z: pz }));
    }

    return finish(parts);
  },
};

export default NM_CENTRAL_FOUNTAIN;
