/**
 * @file packs/kinmen/landmarks/zhaishan_tunnel.js — Roll Formosa Kinmen pack.
 *
 * 翟山坑道 (Zhaishan Tunnel). A military tunnel carved into granite during the
 * Cold War for hiding small boats. The tunnel opens to a dramatic underground
 * waterway inside the mountain, now a popular tourist attraction.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const GRANITE_DARK = 0x4a4a4a;
const GRANITE_MID = 0x5a5a5a;
const GRANITE_LIGHT = 0x6a6a6a;
const WATER_DARK = 0x1a3040;
const WATER_GLOW = 0x2a6080;
const TUNNEL_DARK = 0x1a1a1a;
const CONCRETE = 0x707070;

export const NM_ZHAISHAN_TUNNEL = {
  id: 'zhaishan_tunnel',
  name: '翟山坑道',
  landmarkId: 0,
  dioramaRHint: 6,
  colorHex: WATER_GLOW,

  buildGeometry(rng) {
    const parts = [];

    // Water base
    parts.push(box(2.0, 0.08, 1.6, WATER_DARK, { y: 0.04, hex2: WATER_GLOW }));

    // Mountain / cliff mass
    parts.push(box(1.4, 0.85, 0.65, GRANITE_DARK, { y: 0.52, z: -0.35, hex2: GRANITE_MID }));
    parts.push(sph(0.55, GRANITE_MID, { ws: 6, hs: 4, y: 0.95, z: -0.38, sy: 0.3 }));

    // Side cliff extensions
    parts.push(box(0.35, 0.65, 0.45, GRANITE_DARK, { x: -0.75, y: 0.42, z: -0.2 }));
    parts.push(box(0.32, 0.6, 0.45, GRANITE_DARK, { x: 0.72, y: 0.4, z: -0.22 }));

    // Tunnel entrance arch
    parts.push(cyl(0.25, 0.25, 0.12, 8, CONCRETE, {
      y: 0.35, z: 0.0, rx: HALF_PI, thetaLen: PI, theta0: 0,
    }));
    // Dark interior
    parts.push(cyl(0.21, 0.21, 0.35, 8, TUNNEL_DARK, {
      y: 0.33, z: -0.12, rx: HALF_PI, thetaLen: PI, theta0: 0,
    }));
    parts.push(box(0.42, 0.32, 0.3, TUNNEL_DARK, { y: 0.26, z: -0.18 }));

    // Glowing water inside
    parts.push(box(0.36, 0.05, 0.45, WATER_GLOW, { y: 0.12, z: -0.08 }));

    // Dock / walkway
    parts.push(box(0.55, 0.05, 0.18, CONCRETE, { y: 0.12, z: 0.28, x: -0.32 }));

    // Rocky outcrops
    parts.push(sph(0.1, GRANITE_MID, { ws: 5, hs: 4, x: 0.55, y: 0.1, z: 0.45, sy: 0.45 }));
    parts.push(sph(0.08, GRANITE_DARK, { ws: 4, hs: 3, x: -0.62, y: 0.08, z: 0.5, sy: 0.4 }));

    return finish(parts);
  },
};

export default NM_ZHAISHAN_TUNNEL;
