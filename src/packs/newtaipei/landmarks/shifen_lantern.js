/**
 * @file packs/newtaipei/landmarks/shifen_lantern.js — Roll Formosa New Taipei pack.
 *
 * NM_SHIFEN_LANTERN — 十分天燈派出所 (Shifen Sky Lantern Police Station). The
 * iconic building at the heart of Shifen Old Street where tourists release
 * sky lanterns. Features a railway track running through the narrow street,
 * the distinctive police station building, and sky lanterns rising above.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const BUILDING = 0xd4c8a8;   // cream colored station building
const ROOF = 0x8b4513;       // brown tile roof
const RAIL = 0x4a4a4a;       // railway track steel
const TIE = 0x5a3a2a;        // wooden railway ties
const LANTERN_RED = 0xe84040;  // red sky lantern
const LANTERN_ORG = 0xff8c40;  // orange sky lantern
const LANTERN_YLW = 0xffd040;  // yellow sky lantern
const SIGN = 0x2a4a8a;       // blue police station sign

export const NM_SHIFEN_LANTERN = {
  id: 'shifen_lantern',
  name: '十分天燈派出所',
  landmarkId: 1,
  dioramaRHint: 20, // ~20 m footprint
  colorHex: LANTERN_RED, // red lantern read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Main station building --------------------------------------
    parts.push(box(0.8, 0.7, 0.6, BUILDING, { y: 0.35, z: -0.3 }));
    // pitched roof
    parts.push(cyl(0.45, 0.5, 0.06, 4, ROOF, { ry: HALF_PI/2, y: 0.73, z: -0.3, rx: 0 }));
    parts.push(cone(0.42, 0.25, 4, ROOF, { y: 0.88, z: -0.3, ry: HALF_PI/2 }));
    // police sign
    parts.push(box(0.3, 0.12, 0.02, SIGN, { y: 0.5, z: 0.01 }));
    // windows
    parts.push(box(0.12, 0.15, 0.02, 0xaaccff, { x: 0.2, y: 0.4, z: 0.01 }));
    parts.push(box(0.12, 0.15, 0.02, 0xaaccff, { x: -0.2, y: 0.4, z: 0.01 }));
    // entrance door
    parts.push(box(0.14, 0.25, 0.02, 0x5a3a2a, { y: 0.12, z: 0.01 }));

    // ---- 2) Railway tracks running through the street ------------------
    // tracks on ground level
    const trackZ = 0.4;
    parts.push(box(2.0, 0.04, 0.08, RAIL, { y: 0.02, z: trackZ - 0.15 })); // left rail
    parts.push(box(2.0, 0.04, 0.08, RAIL, { y: 0.02, z: trackZ + 0.15 })); // right rail
    // wooden ties
    for (let i = -4; i <= 4; i++) {
      parts.push(box(0.1, 0.03, 0.4, TIE, { x: i * 0.22, y: 0.0, z: trackZ }));
    }

    // ---- 3) Sky lanterns floating up -----------------------------------
    const lanternColors = [LANTERN_RED, LANTERN_ORG, LANTERN_YLW, LANTERN_RED, LANTERN_ORG];
    const lanternPos = [
      { x: 0.3, y: 1.1, z: 0.2 },
      { x: -0.4, y: 1.4, z: 0.1 },
      { x: 0.1, y: 1.7, z: -0.1 },
      { x: -0.2, y: 1.3, z: 0.3 },
      { x: 0.5, y: 1.55, z: 0.0 },
    ];
    for (let i = 0; i < lanternPos.length; i++) {
      const { x, y, z } = lanternPos[i];
      // lantern body (barrel shape with fire glow at bottom)
      parts.push(cyl(0.07, 0.08, 0.14, 6, lanternColors[i], { x, y, z, hex2: 0xffeeaa }));
      // lantern top cap
      parts.push(cyl(0.04, 0.06, 0.02, 4, 0x3a3a3a, { x, y: y + 0.08, z }));
      // fire glow
      parts.push(sph(0.03, 0xffaa44, { ws: 4, hs: 3, x, y: y - 0.06, z }));
    }

    // ---- 4) Shop fronts on street sides --------------------------------
    // left shop
    parts.push(box(0.4, 0.5, 0.35, 0xc8b090, { x: -0.7, y: 0.25, z: 0.4 }));
    parts.push(box(0.42, 0.06, 0.37, 0x6a4a3a, { x: -0.7, y: 0.53, z: 0.4 }));
    // right shop
    parts.push(box(0.4, 0.5, 0.35, 0xd8c4a0, { x: 0.7, y: 0.25, z: 0.4 }));
    parts.push(box(0.42, 0.06, 0.37, 0x7a5a4a, { x: 0.7, y: 0.53, z: 0.4 }));

    return finish(parts);
  },
};

export default NM_SHIFEN_LANTERN;
