/**
 * @file packs/penghu/landmarks/arena.js — Roll Formosa Penghu pack, landmark 7.
 *
 * 澎湖機場 (Penghu Airport / Magong Airport, MZG) — the main airport serving
 * Penghu County, located in Huxi Township. A modern airport terminal with a
 * distinctive curved roof design, control tower, and runway. The main gateway
 * for visitors to the Penghu islands.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1).
 *
 * Palette: white/grey terminal + glass facade + tarmac grey + runway markings.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const WHITE = 0xf0ece4; // terminal white
const WHITE_D = 0xd8d4cc; // shaded white
const GREY = 0x8a8884; // structural grey
const GREY_D = 0x686460; // darker grey
const GLASS = 0x6ab0c8; // glass facade
const GLASS_L = 0x98d0e8; // glass highlight
const TARMAC = 0x4a4845; // runway/tarmac
const TARMAC_L = 0x5a5855; // lighter tarmac
const MARKING = 0xf0f0e8; // runway white markings
const GRASS = 0x5a8048; // grass areas
const ORANGE = 0xe87020; // windsock/markers

export const NM_PENGHU_AIRPORT = {
  id: 'penghu_airport',
  name: '澎湖機場',
  landmarkId: 7,
  dioramaRHint: 120, // large airport complex
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // ---- ground / tarmac base ----
    parts.push(box(6.0, 0.1, 4.5, GRASS, { y: 0.05, hex2: 0x4a6838 }));
    parts.push(box(5.5, 0.08, 1.8, TARMAC, { y: 0.12, z: 0.8 }));

    // ---- runway ----
    parts.push(box(5.8, 0.06, 0.8, TARMAC_L, { y: 0.14, z: -1.2, hex2: TARMAC }));
    // Runway centerline marking (single long stripe)
    parts.push(box(5.0, 0.02, 0.06, MARKING, { y: 0.18, z: -1.2 }));

    // ---- main terminal building ----
    const termX = 0;
    const termZ = 0.9;
    const termY = 0.2;

    // Terminal base
    parts.push(box(3.5, 0.6, 1.2, WHITE_D, { x: termX, y: termY + 0.3, z: termZ, hex2: WHITE }));

    // Glass facade (front)
    parts.push(box(3.3, 0.5, 0.08, GLASS, { x: termX, y: termY + 0.35, z: termZ + 0.58, hex2: GLASS_L }));

    // Curved roof (signature design - reduced segments)
    parts.push(
      sph(2.2, WHITE, {
        ws: 8,
        hs: 3,
        thetaLen: PI * 0.3,
        theta0: PI * 0.35,
        x: termX,
        y: termY + 0.2,
        z: termZ,
        sy: 0.35,
        sz: 0.5,
        hex2: 0xfaf8f4,
      })
    );

    // ---- control tower ----
    const towX = 1.6;
    const towZ = 0.5;
    const towY = 0.2;

    // Tower shaft
    parts.push(cyl(0.22, 0.25, 1.6, 6, WHITE_D, { x: towX, y: towY + 0.8, z: towZ, hex2: WHITE }));

    // Control room (wide top)
    parts.push(cyl(0.38, 0.35, 0.35, 6, GREY, { x: towX, y: towY + 1.75, z: towZ, hex2: GREY_D }));

    // Tower roof
    parts.push(cone(0.35, 0.2, 6, WHITE, { x: towX, y: towY + 2.05, z: towZ }));

    // ---- parked aircraft (simplified) ----
    const planeX = -0.8;
    const planeZ = -0.1;
    const planeY = 0.2;
    // Fuselage
    parts.push(cyl(0.12, 0.12, 0.9, 5, WHITE, { rx: HALF_PI, x: planeX, y: planeY + 0.12, z: planeZ }));
    // Wings
    parts.push(box(0.7, 0.03, 0.18, GREY, { x: planeX, y: planeY + 0.12, z: planeZ }));

    // ---- windsock ----
    parts.push(cyl(0.02, 0.02, 0.5, 4, GREY, { x: 2.3, y: 0.45, z: -0.8 }));
    parts.push(cone(0.06, 0.18, 4, ORANGE, { rx: HALF_PI * 0.8, x: 2.3, y: 0.72, z: -0.72 }));

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_ARENA)
export const NM_ARENA = NM_PENGHU_AIRPORT;

export default NM_PENGHU_AIRPORT;
