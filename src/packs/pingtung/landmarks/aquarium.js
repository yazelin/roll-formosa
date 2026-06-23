/**
 * @file packs/pingtung/landmarks/aquarium.js — Roll Formosa Pingtung pack.
 *
 * 海生館 (National Museum of Marine Biology and Aquarium, 車城 Checheng, 屏東).
 * Taiwan's largest aquarium featuring iconic whale sculptures at the entrance,
 * modern curved architecture representing ocean waves, and distinctive blue
 * glass facades. A world-class marine education facility.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Modern aquarium (藍玻璃 + 白牆 + 鯨魚).
const WHITE = 0xf0f0f0;      // white modern walls
const WHITE_D = 0xd0d0d0;    // shadow side
const BLUE_GLASS = 0x3090c8; // blue glass facade
const BLUE_D = 0x2070a0;     // darker blue
const CONCRETE = 0xa8a8a0;   // concrete base
const WHALE_BLUE = 0x4070a0; // whale sculpture blue
const WHALE_D = 0x305080;    // darker whale
const WHALE_WHITE = 0xe8e8e0;// whale belly

export const NM_AQUARIUM = {
  id: 'aquarium',
  name: '海生館',
  dioramaRHint: 140,
  colorHex: 0x3090c8,
  buildGeometry(rng) {
    const parts = [];

    // ---- Concrete plaza base ----
    parts.push(box(1.6, 0.06, 1.2, CONCRETE, { y: 0.03 }));

    // ---- Main building ----
    parts.push(box(0.75, 0.5, 0.65, WHITE, { y: 0.06 + 0.25, hex2: WHITE_D }));
    // Blue glass facade
    parts.push(box(0.78, 0.45, 0.06, BLUE_GLASS, { y: 0.06 + 0.22, z: 0.34 }));

    // ---- Wave-shaped roof ----
    parts.push(cyl(0.45, 0.45, 0.8, 8, WHITE, {
      rx: HALF_PI,
      y: 0.56 + 0.10,
      theta0: 0,
      thetaLen: PI
    }));

    // ---- Left wing ----
    parts.push(box(0.45, 0.35, 0.45, WHITE, { x: -0.5, y: 0.06 + 0.175 }));
    parts.push(box(0.47, 0.3, 0.05, BLUE_GLASS, { x: -0.5, y: 0.06 + 0.15, z: 0.22 }));

    // ---- Right wing ----
    parts.push(box(0.45, 0.4, 0.45, WHITE, { x: 0.5, y: 0.06 + 0.2 }));
    parts.push(box(0.47, 0.35, 0.05, BLUE_GLASS, { x: 0.5, y: 0.06 + 0.175, z: 0.22 }));

    // ---- Whale sculpture (simplified: 1 whale) ----
    parts.push(sph(0.1, WHALE_BLUE, { ws: 5, hs: 3, x: -0.3, y: 0.32, z: 0.5, sx: 1.4, sy: 0.7, sz: 0.6 }));
    parts.push(sph(0.06, WHALE_WHITE, { ws: 4, hs: 2, x: -0.28, y: 0.26, z: 0.5 }));

    return finish(parts);
  },
};

export default NM_AQUARIUM;
