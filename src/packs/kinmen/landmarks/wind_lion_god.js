/**
 * @file packs/kinmen/landmarks/wind_lion_god.js — Roll Formosa Kinmen pack.
 *
 * 風獅爺 (Wind Lion God). The iconic guardian deity of Kinmen, standing at
 * village entrances to ward off evil winds and spirits. This represents one
 * of the many stone lion statues scattered across the island.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const STONE_MAIN = 0xa08060;    // Sandy stone color
const STONE_DARK = 0x806040;
const STONE_LIGHT = 0xc0a080;
const PEDESTAL = 0x6a6a6a;
const RIBBON_RED = 0xc41e3a;    // Red sash/ribbon
const EYES_WHITE = 0xf0f0f0;
const EYES_BLACK = 0x1a1a1a;

export const NM_WIND_LION_GOD = {
  id: 'wind_lion_god',
  name: '風獅爺',
  landmarkId: 2,
  dioramaRHint: 10,
  colorHex: STONE_MAIN,

  buildGeometry(rng) {
    const parts = [];

    // Stone pedestal
    parts.push(box(1.0, 0.2, 0.8, PEDESTAL, { y: 0.1 }));
    parts.push(box(0.85, 0.1, 0.65, PEDESTAL, { y: 0.25 }));

    // Lion body (sitting posture)
    // Haunches / rear
    parts.push(sph(0.4, STONE_MAIN, { ws: 7, hs: 5, y: 0.6, z: -0.15, sy: 0.7, hex2: STONE_DARK }));

    // Front body / chest
    parts.push(sph(0.35, STONE_MAIN, { ws: 7, hs: 5, y: 0.75, z: 0.12, sx: 0.9, hex2: STONE_LIGHT }));

    // Front legs
    parts.push(cyl(0.1, 0.08, 0.35, 6, STONE_MAIN, { x: -0.2, z: 0.25, y: 0.48 }));
    parts.push(cyl(0.1, 0.08, 0.35, 6, STONE_MAIN, { x: 0.2, z: 0.25, y: 0.48 }));
    // Paws
    parts.push(sph(0.1, STONE_DARK, { ws: 5, hs: 4, x: -0.2, z: 0.28, y: 0.32, sy: 0.5 }));
    parts.push(sph(0.1, STONE_DARK, { ws: 5, hs: 4, x: 0.2, z: 0.28, y: 0.32, sy: 0.5 }));

    // Head
    parts.push(sph(0.32, STONE_MAIN, { ws: 7, hs: 5, y: 1.1, z: 0.18, hex2: STONE_LIGHT }));

    // Face features
    // Snout
    parts.push(box(0.2, 0.12, 0.15, STONE_DARK, { y: 1.05, z: 0.42 }));
    // Nose
    parts.push(sph(0.06, STONE_DARK, { ws: 4, hs: 3, y: 1.08, z: 0.52 }));

    // Eyes
    parts.push(sph(0.06, EYES_WHITE, { ws: 4, hs: 3, x: -0.1, y: 1.15, z: 0.4 }));
    parts.push(sph(0.06, EYES_WHITE, { ws: 4, hs: 3, x: 0.1, y: 1.15, z: 0.4 }));
    parts.push(sph(0.03, EYES_BLACK, { ws: 3, hs: 2, x: -0.1, y: 1.15, z: 0.44 }));
    parts.push(sph(0.03, EYES_BLACK, { ws: 3, hs: 2, x: 0.1, y: 1.15, z: 0.44 }));

    // Mane (stylized curls)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * PI + PI * 0.5;
      const r = 0.28;
      parts.push(sph(0.1, STONE_DARK, {
        ws: 4, hs: 3,
        x: Math.cos(a) * r * 0.8,
        y: 1.25 + Math.sin(i) * 0.05,
        z: 0.12 + Math.sin(a) * r * 0.5,
      }));
    }

    // Ears
    parts.push(cone(0.08, 0.12, 4, STONE_MAIN, { x: -0.18, y: 1.38, z: 0.05, rx: -0.2 }));
    parts.push(cone(0.08, 0.12, 4, STONE_MAIN, { x: 0.18, y: 1.38, z: 0.05, rx: -0.2 }));

    // Red ribbon / sash around neck
    parts.push(cyl(0.28, 0.26, 0.08, 8, RIBBON_RED, { y: 0.92, z: 0.15 }));
    // Ribbon tails
    parts.push(box(0.06, 0.25, 0.03, RIBBON_RED, { x: -0.15, y: 0.75, z: 0.35 }));
    parts.push(box(0.06, 0.22, 0.03, RIBBON_RED, { x: 0.12, y: 0.76, z: 0.33 }));

    // Tail curled up behind
    parts.push(cyl(0.06, 0.04, 0.25, 5, STONE_MAIN, { y: 0.85, z: -0.35, rx: 0.5 }));
    parts.push(sph(0.08, STONE_DARK, { ws: 4, hs: 3, y: 1.0, z: -0.45 }));

    return finish(parts);
  },
};

export default NM_WIND_LION_GOD;
