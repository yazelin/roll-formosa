/**
 * @file packs/newtaipei/landmarks/pingxi_station.js — Roll Formosa New Taipei pack.
 *
 * NM_PINGXI_STATION — 平溪車站 (Pingxi Railway Station). A small, charming
 * historic railway station on the Pingxi Line, known for the narrow tracks
 * running right through the village and sky lantern culture. Features a
 * traditional Japanese-era wooden station building with a platform, tracks,
 * and the signature hanging lanterns.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WOOD = 0x7a5a3a;       // weathered wood station
const WOOD_DK = 0x5a3a2a;    // darker trim
const ROOF = 0x4a4a4a;       // dark grey metal roof
const PLATFORM = 0x9a9a9a;   // concrete platform
const RAIL = 0x505050;       // steel rails
const TIE = 0x5a4030;        // wooden ties
const LANTERN = 0xe84040;    // red lanterns
const SIGN = 0xf8f8e0;       // station name sign

export const NM_PINGXI_STATION = {
  id: 'pingxi_station',
  name: '平溪車站',
  landmarkId: 5,
  dioramaRHint: 18, // ~18 m footprint
  colorHex: WOOD, // wooden station read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Platform and tracks ----------------------------------------
    parts.push(box(1.8, 0.1, 0.5, PLATFORM, { y: 0.05, z: 0.25 })); // platform
    // Rails
    parts.push(box(1.9, 0.03, 0.06, RAIL, { y: 0.015, z: -0.15 })); // left rail
    parts.push(box(1.9, 0.03, 0.06, RAIL, { y: 0.015, z: -0.35 })); // right rail
    // Wooden ties
    for (let i = -8; i <= 8; i += 2) {
      parts.push(box(0.08, 0.02, 0.3, TIE, { x: i * 0.11, y: 0, z: -0.25 }));
    }

    // ---- 2) Station building (traditional wooden) ----------------------
    const stationZ = 0.42;
    parts.push(box(0.7, 0.4, 0.35, WOOD, { y: 0.3, z: stationZ }));
    // Darker wood trim
    parts.push(box(0.72, 0.06, 0.02, WOOD_DK, { y: 0.12, z: stationZ + 0.18 }));
    parts.push(box(0.72, 0.06, 0.02, WOOD_DK, { y: 0.48, z: stationZ + 0.18 }));

    // ---- 3) Pitched roof -----------------------------------------------
    parts.push(box(0.8, 0.04, 0.42, ROOF, { y: 0.52, z: stationZ }));
    // Roof ridge
    parts.push(cyl(0.25, 0.28, 0.04, 4, ROOF, { y: 0.56, z: stationZ, ry: PI/4, rz: HALF_PI }));
    // Eave overhang toward platform
    parts.push(box(0.82, 0.03, 0.15, ROOF, { y: 0.5, z: stationZ - 0.2 }));

    // ---- 4) Platform shelter (canopy) ----------------------------------
    parts.push(box(0.5, 0.03, 0.25, ROOF, { x: -0.4, y: 0.42, z: 0.08 }));
    // Support posts
    for (const x of [-0.6, -0.2]) {
      parts.push(cyl(0.025, 0.025, 0.32, 4, WOOD_DK, { x, y: 0.26, z: -0.02 }));
    }

    // ---- 5) Station name sign ------------------------------------------
    parts.push(box(0.25, 0.1, 0.02, SIGN, { y: 0.38, z: stationZ + 0.19 }));
    // Chinese characters placeholder (dark rectangle)
    parts.push(box(0.2, 0.06, 0.025, 0x1a1a1a, { y: 0.38, z: stationZ + 0.195 }));

    // ---- 6) Hanging lanterns -------------------------------------------
    for (const x of [-0.25, 0.25]) {
      // Under platform shelter
      parts.push(cyl(0.01, 0.01, 0.06, 4, 0x3a3a3a, { x: x - 0.4, y: 0.36, z: 0.08 })); // cord
      parts.push(sph(0.04, LANTERN, { ws: 5, hs: 4, sy: 1.3, x: x - 0.4, y: 0.32, z: 0.08 }));
    }
    // On station eave
    for (const x of [-0.2, 0.2]) {
      parts.push(cyl(0.008, 0.008, 0.05, 4, 0x3a3a3a, { x, y: 0.45, z: stationZ + 0.08 }));
      parts.push(sph(0.035, LANTERN, { ws: 5, hs: 4, sy: 1.3, x, y: 0.41, z: stationZ + 0.08 }));
    }

    // ---- 7) Entrance and bench -----------------------------------------
    parts.push(box(0.12, 0.22, 0.02, WOOD_DK, { y: 0.21, z: stationZ + 0.18 })); // door
    // Wooden bench on platform
    parts.push(box(0.25, 0.06, 0.08, WOOD, { x: 0.5, y: 0.15, z: 0.35 })); // seat
    parts.push(box(0.04, 0.12, 0.08, WOOD_DK, { x: 0.38, y: 0.16, z: 0.35 })); // leg
    parts.push(box(0.04, 0.12, 0.08, WOOD_DK, { x: 0.62, y: 0.16, z: 0.35 })); // leg

    return finish(parts);
  },
};

export default NM_PINGXI_STATION;
