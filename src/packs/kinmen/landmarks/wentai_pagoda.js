/**
 * @file packs/kinmen/landmarks/wentai_pagoda.js — Roll Formosa Kinmen pack.
 *
 * 文台寶塔 (Wentai Pagoda). A historic stone pagoda built in 1387 during the
 * Ming Dynasty. Standing 10 meters tall, it is the oldest historical relic
 * in Kinmen and serves as a geomantic tower to suppress evil spirits.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const GRANITE_MAIN = 0x8a8a7a;    // Aged granite
const GRANITE_DARK = 0x6a6a5a;
const GRANITE_LIGHT = 0xa0a090;
const BASE_STONE = 0x707060;
const MOSS_GREEN = 0x4a5a3a;

export const NM_WENTAI_PAGODA = {
  id: 'wentai_pagoda',
  name: '文台寶塔',
  landmarkId: 5,
  dioramaRHint: 25,
  colorHex: GRANITE_MAIN,

  buildGeometry(rng) {
    const parts = [];

    // Stone base platform (octagonal)
    parts.push(cyl(0.9, 1.0, 0.15, 8, BASE_STONE, { y: 0.075, hex2: GRANITE_DARK }));
    parts.push(cyl(0.8, 0.85, 0.1, 8, GRANITE_DARK, { y: 0.2 }));

    // Pagoda tiers (stacked, getting smaller)
    // Tier 1 (base)
    parts.push(cyl(0.7, 0.68, 0.35, 8, GRANITE_MAIN, { y: 0.425, hex2: GRANITE_DARK }));
    parts.push(cyl(0.72, 0.7, 0.06, 8, GRANITE_LIGHT, { y: 0.63 })); // cornice

    // Tier 2
    parts.push(cyl(0.58, 0.56, 0.32, 8, GRANITE_MAIN, { y: 0.82, hex2: GRANITE_DARK }));
    parts.push(cyl(0.6, 0.58, 0.05, 8, GRANITE_LIGHT, { y: 1.0 }));

    // Tier 3
    parts.push(cyl(0.48, 0.46, 0.3, 8, GRANITE_MAIN, { y: 1.18, hex2: GRANITE_DARK }));
    parts.push(cyl(0.5, 0.48, 0.05, 8, GRANITE_LIGHT, { y: 1.35 }));

    // Tier 4
    parts.push(cyl(0.38, 0.36, 0.28, 8, GRANITE_MAIN, { y: 1.52, hex2: GRANITE_DARK }));
    parts.push(cyl(0.4, 0.38, 0.04, 8, GRANITE_LIGHT, { y: 1.68 }));

    // Tier 5 (top)
    parts.push(cyl(0.28, 0.26, 0.25, 8, GRANITE_MAIN, { y: 1.83, hex2: GRANITE_DARK }));
    parts.push(cyl(0.3, 0.28, 0.04, 8, GRANITE_LIGHT, { y: 1.98 }));

    // Spire / finial
    parts.push(cone(0.18, 0.25, 8, GRANITE_DARK, { y: 2.12 }));
    parts.push(sph(0.08, GRANITE_LIGHT, { ws: 5, hs: 4, y: 2.28 }));

    // Carved inscriptions (simplified as recessed areas)
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2;
      parts.push(box(0.12, 0.18, 0.03, GRANITE_DARK, {
        x: Math.cos(a) * 0.66,
        z: Math.sin(a) * 0.66,
        y: 0.5,
        ry: a,
      }));
    }

    // Moss / weathering patches
    parts.push(sph(0.08, MOSS_GREEN, { ws: 4, hs: 3, x: 0.5, y: 0.8, z: 0.3, sz: 0.3 }));
    parts.push(sph(0.06, MOSS_GREEN, { ws: 3, hs: 2, x: -0.35, y: 1.2, z: 0.4, sz: 0.3 }));

    // Surrounding stone platform edge
    parts.push(box(0.12, 0.08, 1.4, BASE_STONE, { y: 0.04, x: 1.0 }));
    parts.push(box(0.12, 0.08, 1.4, BASE_STONE, { y: 0.04, x: -1.0 }));

    return finish(parts);
  },
};

export default NM_WENTAI_PAGODA;
