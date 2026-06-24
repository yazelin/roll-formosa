/**
 * @file packs/miaoli/collectibles/rail_bike.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_RAIL_BIKE — 舊山線鐵道自行車 (Old Mountain Line rail bike). Silhouette:
 * a small rail bike cart used on the historic Longteng Old Mountain Railway
 * Line (龍騰斷橋). The bike features a covered canopy, pedal-powered wheels
 * that ride on narrow-gauge rails, and bench seating. Reads unmistakably as
 * "rail cart" at thumbnail size: covered top + wheels on rails + bench seats.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * canopy color, never structure.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — rail bike parts. */
const FRAME = 0x2a4a6a; // blue metal frame
const FRAME_HI = 0x3a5a7a; // lighter blue
const CANOPY = 0xe84040; // red canopy cover
const CANOPY_HI = 0xf05050; // lighter red
const SEAT = 0x3a3a3a; // dark gray seat
const WHEEL = 0x2a2a2a; // dark wheel
const WHEEL_HI = 0x4a4a4a; // lighter wheel rim
const RAIL = 0x6a5a4a; // rusty brown rail

export const COL_RAIL_BIKE = {
  id: 'rail_bike',
  name: '舊山線鐵道自行車',
  colorHex: 0xe84040, // red canopy — the body read color

  /**
   * Build the rail bike geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (canopy tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201); // tiny per-instance canopy tint
    const canopy = CANOPY - t;
    const parts = [];

    // --- RAILS: two parallel rails underneath ---
    parts.push(box(0.08, 0.06, 2.2, RAIL, { x: 0.4, y: -0.5, hex2: 0x7a6a5a }));
    parts.push(box(0.08, 0.06, 2.2, RAIL, { x: -0.4, y: -0.5, hex2: 0x7a6a5a }));
    // Rail ties
    for (let i = -2; i <= 2; i++) {
      parts.push(box(1.0, 0.05, 0.1, 0x5a4a3a, { y: -0.52, z: i * 0.45 }));
    }

    // --- WHEELS: four flanged wheels on the rails ---
    const wheelZ = [0.65, -0.65];
    const wheelX = [0.4, -0.4];
    for (const wz of wheelZ) {
      for (const wx of wheelX) {
        // Wheel disk
        parts.push(cyl(0.18, 0.18, 0.06, 8, WHEEL, {
          x: wx,
          y: -0.35,
          z: wz,
          rx: PI / 2,
          hex2: WHEEL_HI,
        }));
        // Wheel flange
        parts.push(cyl(0.22, 0.22, 0.03, 8, WHEEL_HI, {
          x: wx > 0 ? wx + 0.04 : wx - 0.04,
          y: -0.35,
          z: wz,
          rx: PI / 2,
        }));
      }
    }

    // --- FRAME: metal frame structure ---
    // Main platform
    parts.push(box(0.9, 0.08, 1.4, FRAME, { y: -0.18, hex2: FRAME_HI }));
    // Side rails
    parts.push(box(0.06, 0.35, 1.3, FRAME, { x: 0.42, y: 0.0 }));
    parts.push(box(0.06, 0.35, 1.3, FRAME, { x: -0.42, y: 0.0 }));

    // --- SEATS: bench seats facing forward ---
    // Front bench
    parts.push(box(0.7, 0.12, 0.25, SEAT, { y: 0.0, z: 0.35 }));
    parts.push(box(0.7, 0.3, 0.08, SEAT, { y: 0.15, z: 0.48 }));
    // Back bench
    parts.push(box(0.7, 0.12, 0.25, SEAT, { y: 0.0, z: -0.35 }));
    parts.push(box(0.7, 0.3, 0.08, SEAT, { y: 0.15, z: -0.48 }));

    // --- CANOPY: curved roof cover ---
    // Four support posts
    const postPos = [
      { x: 0.38, z: 0.55 },
      { x: -0.38, z: 0.55 },
      { x: 0.38, z: -0.55 },
      { x: -0.38, z: -0.55 },
    ];
    for (const p of postPos) {
      parts.push(cyl(0.04, 0.04, 0.6, 5, FRAME, { x: p.x, y: 0.48, z: p.z }));
    }
    // Canopy roof - curved top
    parts.push(sph(0.9, canopy, {
      ws: 8,
      hs: 4,
      sy: 0.35,
      sx: 0.6,
      thetaLen: PI * 0.5,
      y: 0.85,
      hex2: CANOPY_HI,
    }));
    // Canopy front and back edges
    parts.push(box(0.55, 0.08, 0.06, canopy, { y: 0.72, z: 0.58 }));
    parts.push(box(0.55, 0.08, 0.06, canopy, { y: 0.72, z: -0.58 }));

    return finish(parts);
  },
};

export default COL_RAIL_BIKE;
