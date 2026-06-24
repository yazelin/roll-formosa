/**
 * @file packs/yunlin/landmarks/douliu_roundabout.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_DOULIU_ROUNDABOUT — 斗六圓環 (Douliu Roundabout). The iconic traffic circle
 * in downtown Douliu, the county seat of Yunlin. Features a central monument,
 * fountain, and surrounding commercial buildings.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const ROAD = 0x4a4a48;        // asphalt
const CURB = 0xc8c0b8;        // concrete curb
const GRASS = 0x4a8848;       // center island grass
const MONUMENT = 0x888888;    // grey monument
const WATER = 0x4888b8;       // fountain water
const BUILDING = 0xe0d8c8;    // building cream

export const NM_DOULIU_ROUNDABOUT = {
  id: 'douliu_roundabout',
  name: '斗六圓環',
  landmarkId: 5,
  dioramaRHint: 52, // traffic roundabout
  colorHex: GRASS,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Road base (circular roundabout, reduced segments)
    parts.push(cyl(1.8, 1.8, 0.12, 10, ROAD, { y: 0.06 }));
    // Center island
    parts.push(cyl(0.9, 0.9, 0.18, 8, GRASS, { y: 0.09, hex2: 0x5a9858 }));

    const baseY = 0.18;

    // Central monument / pillar
    parts.push(cyl(0.25, 0.28, 0.15, 6, MONUMENT, { y: baseY + 0.075 })); // base
    parts.push(cyl(0.12, 0.15, 0.8, 5, MONUMENT, { y: baseY + 0.55, hex2: 0x989898 })); // column
    // Monument top
    parts.push(cone(0.18, 0.35, 5, 0x989898, { y: baseY + 1.12 }));

    // Fountain basin
    parts.push(cyl(0.4, 0.4, 0.06, 6, WATER, { y: baseY + 0.03, hex2: 0x58a8d8 }));

    // Surrounding buildings (reduced to 3)
    const bldgR = 2.2;
    for (let b = 0; b < 3; b++) {
      const angle = (b * PI * 2) / 3;
      const bx = Math.cos(angle) * bldgR;
      const bz = Math.sin(angle) * bldgR;
      parts.push(box(0.6, 0.5, 0.5, BUILDING, {
        x: bx, y: baseY + 0.25, z: bz,
        ry: -angle, hex2: 0xf0e8d8
      }));
    }

    return finish(parts);
  },
};

export default NM_DOULIU_ROUNDABOUT;
