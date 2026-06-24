/**
 * @file packs/nantou/landmarks/qingjing_swiss.js — Roll Formosa Nantou pack, landmark 3.
 *
 * 清境小瑞士 — Little Switzerland at Qingjing Farm, featuring:
 * - Alpine-style chalets with steep peaked roofs
 * - The iconic windmill / clock tower
 * - Rolling green pastures with sheep
 * - Mountain backdrop aesthetic
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — alpine village colors
const CHALET_BROWN = 0x6a4530;   // wooden chalet walls
const CHALET_DARK = 0x4a3020;    // dark wood trim
const ROOF_RED = 0xa04040;       // red/brown roof tiles
const ROOF_GREY = 0x606060;      // grey slate roof
const WINDMILL_WHITE = 0xf0f0f0; // windmill body
const WINDMILL_BLADE = 0x8a7a6a; // windmill blades
const GRASS = 0x4a8a40;          // green pasture
const GRASS_DARK = 0x3a6a30;     // darker grass
const SHEEP_WHITE = 0xf8f8f0;    // white sheep
const STONE = 0x707070;          // stone elements
const CLOCK_GOLD = 0xc0a030;     // clock face

export const NM_QINGJING_SWISS = {
  id: 'qingjing_swiss',
  name: '清境小瑞士',
  landmarkId: 3,
  dioramaRHint: 40, // farm area ~80m
  colorHex: GRASS,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.004;
    const parts = [];

    /* ---- 1) Green pasture base ---- */
    parts.push(box(3.0, 0.12, 2.4, GRASS, { y: 0.06, hex2: GRASS_DARK }));

    /* ---- 2) Iconic Windmill Tower ---- */
    parts.push(cyl(0.14, 0.12, 0.7, 6, WINDMILL_WHITE, { x: 0.6, y: 0.5, z: 0.3 }));
    parts.push(cone(0.18, 0.25, 6, ROOF_RED, { x: 0.6, y: 0.98 + j, z: 0.3 }));

    /* ---- 3) Alpine Chalet ---- */
    parts.push(box(0.6, 0.35, 0.45, CHALET_BROWN, { x: -0.7, y: 0.33, z: 0.2, hex2: CHALET_DARK }));
    parts.push(cone(0.5, 0.35, 4, ROOF_RED, { x: -0.7, ry: PI / 4, y: 0.68, z: 0.2, sx: 0.85, sz: 0.7 }));

    /* ---- 4) Smaller Chalet ---- */
    parts.push(box(0.4, 0.28, 0.35, CHALET_BROWN, { x: -0.3, y: 0.26, z: -0.65, hex2: CHALET_DARK }));
    parts.push(cone(0.35, 0.28, 4, ROOF_GREY, { x: -0.3, ry: PI / 4, y: 0.51, z: -0.65, sx: 0.8, sz: 0.7 }));

    /* ---- 5) Sheep (3 simplified blobs) ---- */
    const sheepPos = [{ x: 0.2, z: -0.3 }, { x: 0.9, z: -0.5 }, { x: -0.1, z: 0.7 }];
    for (const sp of sheepPos) {
      parts.push(sph(0.08, SHEEP_WHITE, { ws: 5, hs: 4, x: sp.x, y: 0.18, z: sp.z }));
    }

    /* ---- 6) Fence rail ---- */
    parts.push(box(1.6, 0.04, 0.03, CHALET_DARK, { y: 0.18, z: 0.9 }));

    return finish(parts);
  },
};

export default NM_QINGJING_SWISS;
