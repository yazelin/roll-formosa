/**
 * @file packs/changhua/collectibles/paper_fan.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_PAPER_FAN — 紙扇 (traditional paper fan), a Lukang craft specialty.
 * Hand-painted folding fans have been made in Lukang for generations.
 * Silhouette: an open fan with bamboo ribs and painted paper, often featuring
 * calligraphy or landscape paintings. The semi-circular spread is key.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const PAPER = 0xf4ece0;       // rice paper
const PAPER_D = 0xe8dcc8;     // paper shadow
const BAMBOO = 0xc8a868;      // bamboo ribs
const BAMBOO_D = 0xa88848;    // darker bamboo
const INK = 0x2a2828;         // ink painting
const RED = 0xc83838;         // red seal stamp

export const COL_PAPER_FAN = {
  id: 'paper_fan_collectible',
  name: '紙扇',
  collectibleId: 10,
  colorHex: PAPER,

  buildGeometry(rng) {
    const parts = [];

    // Paper surface - semi-circular fan spread (reduced segments)
    parts.push(sph(0.90, PAPER, {
      ws: 10, hs: 4,
      sy: 0.05,
      thetaStart: 0,
      thetaLen: PI,
      y: 0.70,
      hex2: PAPER_D,
    }));

    // Bamboo ribs (reduced to 5)
    for (let i = 0; i < 5; i++) {
      const angle = -HALF_PI + (i / 4) * PI;
      const len = 0.85;
      const x = Math.cos(angle) * len * 0.45;
      const y = Math.sin(angle) * len * 0.45 + 0.70;
      parts.push(box(len, 0.025, 0.015, BAMBOO, {
        x, y, rz: -angle + HALF_PI, hex2: BAMBOO_D,
      }));
    }

    // Pivot point and handle
    parts.push(cyl(0.06, 0.06, 0.04, 4, BAMBOO_D, { y: 0.20 }));
    parts.push(box(0.06, 0.25, 0.02, BAMBOO, { y: 0.08 }));

    // Ink decoration (simplified)
    parts.push(box(0.03, 0.18, 0.01, INK, { x: -0.12, y: 0.75, z: 0.01 }));

    // Red seal stamp
    parts.push(box(0.06, 0.06, 0.01, RED, { x: 0.25, y: 0.55, z: 0.01 }));

    return finish(parts);
  },
};

export default COL_PAPER_FAN;
