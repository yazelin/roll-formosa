/**
 * @file packs/pingtung/landmarks/south_bay.js — Roll Formosa Pingtung pack.
 *
 * 墾丁南灣 (South Bay / Nanwan Beach, 恆春 Hengchun, 屏東).
 * Famous beach entrance featuring a decorative arch with "南灣" signage,
 * flanked by palm trees. The iconic gateway to one of Taiwan's most popular
 * beach destinations in Kenting National Park.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Beach entrance (白色拱門 + 棕櫚樹).
const WHITE = 0xf0ece0;      // white arch structure
const WHITE_D = 0xd0ccc0;    // shadow side
const BLUE = 0x3080c0;       // ocean blue accent
const SAND = 0xe0d0a0;       // sandy ground
const PALM_TRUNK = 0x7a6040; // palm tree trunk
const PALM_LEAF = 0x2a6030;  // palm fronds
const PALM_LEAF_D = 0x1a4020;

export const NM_SOUTH_BAY = {
  id: 'south_bay',
  name: '墾丁南灣',
  dioramaRHint: 55,
  colorHex: 0x3080c0,
  buildGeometry(rng) {
    const parts = [];

    // ---- Sandy ground base ----
    parts.push(box(1.8, 0.08, 1.0, SAND, { y: 0.04 }));

    // ---- Main arch structure ----
    // Left pillar
    parts.push(box(0.18, 0.7, 0.18, WHITE, { x: -0.55, y: 0.08 + 0.35, hex2: WHITE_D }));
    // Right pillar
    parts.push(box(0.18, 0.7, 0.18, WHITE, { x: 0.55, y: 0.08 + 0.35, hex2: WHITE_D }));
    // Top beam
    parts.push(box(1.28, 0.15, 0.2, WHITE, { y: 0.78 + 0.075, hex2: WHITE_D }));
    // Arch decoration (curved top)
    parts.push(cyl(0.45, 0.45, 0.18, 12, WHITE, { rx: HALF_PI, y: 0.5, theta0: 0, thetaLen: PI, hex2: WHITE_D }));

    // ---- Decorative wave pattern on arch (blue) ----
    parts.push(box(0.9, 0.06, 0.05, BLUE, { y: 0.9, z: 0.12 }));
    parts.push(box(0.9, 0.06, 0.05, BLUE, { y: 0.9, z: -0.12 }));

    // ---- Pillar bases ----
    parts.push(box(0.24, 0.08, 0.24, WHITE_D, { x: -0.55, y: 0.08 + 0.04 }));
    parts.push(box(0.24, 0.08, 0.24, WHITE_D, { x: 0.55, y: 0.08 + 0.04 }));

    // ---- Left palm tree ----
    parts.push(cyl(0.06, 0.08, 0.8, 6, PALM_TRUNK, { x: -0.9, y: 0.08 + 0.4 }));
    // Palm fronds (simplified as cones radiating out)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * PI * 2;
      parts.push(cone(0.15, 0.35, 4, PALM_LEAF, { 
        x: -0.9 + Math.cos(angle) * 0.12, 
        y: 0.9, 
        z: Math.sin(angle) * 0.12,
        rx: 0.8,
        ry: angle,
        hex2: PALM_LEAF_D
      }));
    }

    // ---- Right palm tree ----
    parts.push(cyl(0.06, 0.08, 0.75, 6, PALM_TRUNK, { x: 0.9, y: 0.08 + 0.375 }));
    // Palm fronds
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * PI * 2 + 0.3;
      parts.push(cone(0.14, 0.32, 4, PALM_LEAF, { 
        x: 0.9 + Math.cos(angle) * 0.11, 
        y: 0.85, 
        z: Math.sin(angle) * 0.11,
        rx: 0.75,
        ry: angle,
        hex2: PALM_LEAF_D
      }));
    }

    // ---- Beach umbrella (decorative) ----
    parts.push(cyl(0.02, 0.02, 0.4, 6, 0x8a6040, { x: 0.2, y: 0.28, z: 0.4 }));
    parts.push(cone(0.2, 0.1, 8, 0xe04040, { x: 0.2, y: 0.5, z: 0.4 }));

    return finish(parts);
  },
};

export default NM_SOUTH_BAY;
