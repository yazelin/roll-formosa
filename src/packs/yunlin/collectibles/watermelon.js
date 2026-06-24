/**
 * @file packs/yunlin/collectibles/watermelon.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_WATERMELON — 西瓜 (Watermelon). Yunlin is one of Taiwan's major watermelon
 * producing regions. A juicy watermelon slice showing the bright red flesh,
 * black seeds, and green rind.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const RIND = 0x2a8a3a;        // dark green rind
const RIND_LIGHT = 0x4ab858;  // light green stripe
const WHITE = 0xe8f0e8;       // white layer under rind
const FLESH = 0xe82838;       // red watermelon flesh
const FLESH_HI = 0xf84858;    // flesh highlight
const SEED = 0x1a1a1a;        // black seeds

export const COL_WATERMELON = {
  id: 'watermelon',
  name: '西瓜',
  colorHex: 0xe82838,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Watermelon slice (wedge shape)
    // Main flesh (half cylinder wedge)
    parts.push(cyl(0.5, 0.5, 0.35, 8, FLESH, {
      y: 0.175,
      thetaLen: PI * 0.6,
      theta0: -PI * 0.3,
      hex2: FLESH_HI
    }));

    // Flat cut face (red)
    parts.push(box(0.48, 0.32, 0.02, FLESH, { y: 0.16, z: 0.24, hex2: FLESH_HI }));
    parts.push(box(0.48, 0.32, 0.02, FLESH, { y: 0.16, z: -0.24, hex2: FLESH_HI }));

    // White layer (thin)
    parts.push(cyl(0.52, 0.52, 0.38, 8, WHITE, {
      y: 0.19,
      thetaLen: PI * 0.65,
      theta0: -PI * 0.325,
      open: true
    }));

    // Green rind (outer)
    parts.push(cyl(0.56, 0.56, 0.4, 8, RIND, {
      y: 0.2,
      thetaLen: PI * 0.7,
      theta0: -PI * 0.35,
      open: true
    }));

    // Light green stripes on rind
    parts.push(box(0.04, 0.38, 0.08, RIND_LIGHT, { x: 0.52, y: 0.19, z: 0, ry: -0.2 }));
    parts.push(box(0.04, 0.36, 0.08, RIND_LIGHT, { x: 0.35, y: 0.18, z: 0.38, ry: 0.5 + j }));
    parts.push(box(0.04, 0.36, 0.08, RIND_LIGHT, { x: 0.35, y: 0.18, z: -0.38, ry: -0.5 }));

    // Seeds (scattered on flesh)
    parts.push(sph(0.03, SEED, { ws: 3, hs: 2, x: 0.2, y: 0.2, z: 0.1, sy: 1.5 }));
    parts.push(sph(0.025, SEED, { ws: 3, hs: 2, x: 0.3, y: 0.18, z: -0.08, sy: 1.4 }));
    parts.push(sph(0.028, SEED, { ws: 3, hs: 2, x: 0.15, y: 0.22, z: -0.15, sy: 1.5 }));
    parts.push(sph(0.03, SEED, { ws: 3, hs: 2, x: 0.35, y: 0.16, z: 0.15, sy: 1.4 }));
    parts.push(sph(0.022, SEED, { ws: 3, hs: 2, x: 0.25, y: 0.24, z: 0.02, sy: 1.5 }));

    return finish(parts);
  },
};

export default COL_WATERMELON;
