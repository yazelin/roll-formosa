/**
 * @file packs/taitung/landmarks/taitung_station.js — Roll Formosa Taitung pack, landmark 1.
 *
 * NM_TAITUNG_STATION — 台東火車站, Taitung's main railway station with its
 * distinctive indigenous-inspired triangular roof design and earth-tone colors.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const WALL = 0xc0a888; // earth-tone station walls
const WALL_LO = 0xa08868; // darker wall
const ROOF = 0x5a4a3a; // dark triangular roof
const ROOF_ACCENT = 0x8a6a4a; // roof accent
const TRIM = 0xe8d8c0; // light trim
const GLASS = 0x6090b0; // glass panels

export const NM_TAITUNG_STATION = {
  id: 'taitung_station',
  name: '台東火車站',
  landmarkId: 1,
  dioramaRHint: 28,
  colorHex: WALL,

  buildGeometry(rng) {
    const parts = [];

    // Platform base
    parts.push(box(2.6, 0.14, 1.4, 0x888880, { y: 0.07 }));

    // Main station building body
    parts.push(box(2.0, 0.8, 1.0, WALL, { y: 0.54, hex2: WALL_LO }));

    // Large triangular roof (indigenous-inspired)
    // Front triangle
    parts.push(cone(0.05, 1.4, 3, ROOF, {
      x: 0,
      y: 1.65,
      z: 0,
      rx: PI,
      sy: 0.6,
      sx: 2.4,
      sz: 1.2,
      hex2: ROOF_ACCENT,
    }));

    // Glass entrance
    parts.push(box(0.6, 0.6, 0.08, GLASS, { y: 0.44, z: 0.52 }));
    parts.push(box(0.7, 0.08, 0.1, TRIM, { y: 0.78, z: 0.52 })); // entrance lintel

    // Side windows
    for (const sx of [-0.6, 0.6]) {
      parts.push(box(0.3, 0.4, 0.06, GLASS, { x: sx, y: 0.54, z: 0.52 }));
    }

    // Entrance canopy
    parts.push(box(1.2, 0.06, 0.4, ROOF, { y: 0.92, z: 0.7 }));
    // Canopy supports
    parts.push(cyl(0.04, 0.04, 0.7, 6, TRIM, { x: -0.5, y: 0.58, z: 0.85 }));
    parts.push(cyl(0.04, 0.04, 0.7, 6, TRIM, { x: 0.5, y: 0.58, z: 0.85 }));

    // Indigenous pattern trim band
    parts.push(box(2.1, 0.1, 0.04, 0xc04020, { y: 0.4, z: 0.51 }));
    parts.push(box(2.1, 0.1, 0.04, 0xf0a020, { y: 0.3, z: 0.51 }));

    // Station name sign
    parts.push(box(0.8, 0.2, 0.04, TRIM, { y: 1.1, z: 0.52 }));

    return finish(parts);
  },
};

export default NM_TAITUNG_STATION;
