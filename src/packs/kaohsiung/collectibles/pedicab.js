/**
 * @file packs/kaohsiung/collectibles/pedicab.js — Roll Formosa Kaohsiung pack.
 *
 * COL_PEDICAB — 旗津三輪車 (Cijin sightseeing pedicab). The hand-pedalled
 * tourist trishaw that ferries visitors around Cijin island: a forward-facing
 * pedal-cycle front end (one front wheel + handlebar + saddle) towing a
 * two-wheeled passenger bench at the back, shaded by a bright fringed sun
 * canopy on four corner posts. The read is a cheerful little three-wheeler:
 * TWO rear wheels + ONE front wheel, a cushioned bench seat, and the awning
 * roof overhead.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read, not absolute size:
 * the trike sits low and wide, the canopy floats over the rear bench, the lone
 * front wheel pokes out ahead under the handlebars.
 *
 * The vehicle faces +X (forward), is upright in Y, and the two rear wheels
 * straddle Z so the three-wheel stance reads from any angle. Palette: a deep
 * cherry-red frame/canopy (旗津 trishaws are classically painted bright red),
 * dark tyres, light steel, and a warm canvas bench. rng() only nudges the
 * canopy fringe/saddle a hair — never structure.
 */

import { box, cyl, cone, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const RED = 0xc0403a; // cherry-red frame + canopy (the body read color)
const RED_L = 0xd96b62; // sunlit red highlight
const RED_D = 0x952f2a; // shadowed red
const TYRE = 0x2b2a28; // near-black rubber tyre
const TYRE_L = 0x3c3a37; // tyre highlight
const STEEL = 0x9a9ea4; // grey steel forks / bars / posts
const STEEL_D = 0x76797e; // shadowed steel
const SEATTAN = 0xd8c39a; // warm canvas / vinyl bench cushion
const SEATTAN_D = 0xb89c6e; // shadowed cushion
const GRIP = 0x232323; // black grips / pedal

// Wheel geometry (authored units; trike faces +X).
const WR_R = 0.5; // rear wheel radius (passenger axle)
const WR_F = 0.42; // front wheel radius (a touch smaller)
const REAR_X = -0.78; // rear axle centre X
const FRONT_X = 1.18; // front wheel centre X
const REAR_Z = 0.62; // rear wheels straddle ±REAR_Z

/**
 * One spoked wheel in the X–Y plane, parked at (cx, 0, cz). A dark tyre torus
 * plus two crossing steel bars whose bright overlap reads as the hub.
 * @param {number} r wheel radius
 * @param {number} cx wheel centre X
 * @param {number} cz wheel centre Z
 * @param {() => number} rng
 * @returns {import('three').BufferGeometry[]}
 */
function wheel(r, cx, cz, rng) {
  const p = [];
  // Tyre: cheapest closed tube ring (rs=2) with enough radial segs (ts=8) to
  // round the silhouette; a faint gradient hints at the rim.
  p.push(torus(r, 0.07, 2, 7, TYRE, { x: cx, z: cz, hex2: TYRE_L }));
  // Two crossing spoke bars → 4-spoke star; bright centre reads as the hub.
  const sj = (rng() - 0.5) * 0.06;
  for (let i = 0; i < 2; i++) {
    const a = (i / 2) * PI + sj + 0.3;
    p.push(box(0.045, (r - 0.06) * 2, 0.045, STEEL, { rz: a, x: cx, z: cz, hex2: STEEL_D }));
  }
  return p;
}

export const COL_PEDICAB = {
  id: 'pedicab',
  name: '旗津三輪車',
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // === WHEELS =============================================================
    // Two rear passenger wheels straddling Z, one front cycle wheel ahead.
    parts.push(...wheel(WR_R, REAR_X, REAR_Z, rng));
    parts.push(...wheel(WR_R, REAR_X, -REAR_Z, rng));
    parts.push(...wheel(WR_F, FRONT_X, 0, rng));

    // Rear axle bar tying the two passenger wheels together.
    parts.push(box(0.07, 0.07, REAR_Z * 2, STEEL, { x: REAR_X, y: 0, hex2: STEEL_D }));

    // === CHASSIS ============================================================
    // A flat red floor pan carrying the passenger bench, sitting over the rear
    // axle, with a long draw-bar reaching forward to the cycle front end.
    parts.push(box(1.05, 0.12, 1.18, RED, { x: REAR_X + 0.05, y: 0.36, hex2: RED_L })); // bench floor
    // Draw-bar / boom from the bench front to the head tube (the towing spine).
    const bx = REAR_X + 0.55; // bench front edge X
    const drawDx = FRONT_X - 0.18 - bx;
    parts.push(
      box(Math.hypot(drawDx, 0.16) + 0.1, 0.09, 0.12, RED_D, {
        rz: Math.atan2(-0.16, drawDx),
        x: (bx + (FRONT_X - 0.18)) / 2,
        y: 0.4,
        hex2: RED,
      })
    );

    // === PASSENGER BENCH ====================================================
    // Cushioned seat + upright backrest in warm canvas, two side arm rails.
    const sj = (rng() - 0.5) * 0.03;
    parts.push(box(1.0, 0.18, 1.06, SEATTAN, { x: REAR_X + 0.05, y: 0.55 + sj, hex2: SEATTAN_D })); // seat cushion
    parts.push(box(0.16, 0.62, 1.06, SEATTAN, { x: REAR_X - 0.42, y: 0.86, hex2: SEATTAN_D })); // backrest
    parts.push(box(0.9, 0.08, 0.08, RED_D, { x: REAR_X + 0.1, y: 0.78, z: 0.55, hex2: RED })); // L arm rail
    parts.push(box(0.9, 0.08, 0.08, RED_D, { x: REAR_X + 0.1, y: 0.78, z: -0.55, hex2: RED })); // R arm rail

    // === FRONT CYCLE END ====================================================
    // Head tube rising from the draw-bar to the handlebars, plus front fork.
    const HEADX = FRONT_X - 0.16;
    parts.push(box(0.09, 0.7, 0.09, STEEL, { x: HEADX, y: 0.62, hex2: STEEL_D })); // head tube
    parts.push(box(0.07, 0.5, 0.07, STEEL, { rz: 0.34, x: (HEADX + FRONT_X) / 2, y: 0.22, hex2: STEEL_D })); // fork to front hub
    // Swept handlebar across Z with two dark grips.
    parts.push(box(0.07, 0.07, 0.66, STEEL, { x: HEADX - 0.04, y: 0.98, hex2: STEEL_D }));
    parts.push(box(0.1, 0.09, 0.1, GRIP, { x: HEADX - 0.04, y: 0.98, z: 0.34 }));
    parts.push(box(0.1, 0.09, 0.1, GRIP, { x: HEADX - 0.04, y: 0.98, z: -0.34 }));
    // Driver saddle just behind the head tube.
    parts.push(box(0.06, 0.2, 0.06, STEEL, { x: HEADX - 0.42, y: 0.6, hex2: STEEL_D })); // seat post
    parts.push(box(0.3, 0.08, 0.18, GRIP, { x: HEADX - 0.42, y: 0.73 })); // saddle
    // Pedal crank + one visible pedal block below the head tube.
    parts.push(box(0.18, 0.18, 0.05, STEEL_D, { rz: PI / 4, x: HEADX - 0.2, y: 0.34 }));
    parts.push(box(0.12, 0.04, 0.1, GRIP, { x: HEADX - 0.2, y: 0.18, z: 0.16 }));

    // === SUN CANOPY =========================================================
    // Four corner posts up from the bench corners, a low domed awning roof over
    // them, and a thin fringed valance hanging off the roof edge — the cheerful
    //旗津 trishaw tell.
    const cTop = 1.62; // canopy roof height
    const postY = 1.0; // mid-height of the posts
    const px = [REAR_X + 0.48, REAR_X - 0.4]; // front / back post X
    const pz = [0.5, -0.5]; // ± post Z
    for (const X of px) {
      for (const Z of pz) {
        parts.push(box(0.07, 1.0, 0.07, RED_D, { x: X, y: postY, z: Z, hex2: RED }));
      }
    }
    // Roof: a shallow capped dome (top hemisphere, flattened) in red.
    parts.push(
      cyl(0.04, 0.92, 0.34, 8, RED, { x: REAR_X + 0.04, y: cTop, hex2: RED_L })
    );
    // Flat roof slab so the awning reads solid from above.
    parts.push(box(1.18, 0.08, 1.28, RED, { x: REAR_X + 0.04, y: cTop - 0.1, hex2: RED_L }));
    // Fringe valance: a thin scalloped skirt hanging off the front roof edge.
    const fj = (rng() - 0.5) * 0.02;
    parts.push(box(1.22, 0.16, 0.05, RED_L, { x: REAR_X + 0.04 + fj, y: cTop - 0.24, z: 0.64, hex2: RED }));
    parts.push(box(1.22, 0.16, 0.05, RED_L, { x: REAR_X + 0.04 + fj, y: cTop - 0.24, z: -0.64, hex2: RED }));

    return finish(parts);
  },
};

export default COL_PEDICAB;
