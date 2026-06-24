/**
 * @file packs/yilan/landmarks/guishan.js — Roll Formosa Yilan pack.
 *
 * 龜山島 (Guishan Island / Turtle Island). Yilan's iconic volcanic island off
 * the coast, shaped like a turtle swimming — a distinctive silhouette with a
 * high volcanic peak ("turtle head") at one end and a lower ridge ("turtle
 * tail") at the other, all surrounded by ocean.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so this is authored with correct PROPORTIONS —
 * the integration step owns the size-ladder; dioramaRHint is the real-world
 * footprint hint. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — volcanic island colors
const ROCK = 0x4a5a4e;     // dark volcanic rock
const ROCK_L = 0x6a7a6e;   // lighter rock
const GREEN = 0x3a6a3e;    // lush vegetation
const GREEN_D = 0x2a4a2e;  // darker vegetation shadow
const OCEAN = 0x2a5a7e;    // deep blue sea around the island
const LIGHTHOUSE = 0xfafafa; // white lighthouse
const LIGHT_TOP = 0xffe066;  // lighthouse light
const SULFUR = 0xc8c090;   // sulfur vents at turtle head

export const NM_GUISHAN = {
  id: 'guishan_island',
  name: '龜山島',
  landmarkId: 7,  // Yilan landmark #7 — GOAL (dioramaRHint 250)
  dioramaRHint: 250, // ~2.8 km long island; game r ~ 250 m (integration may override)
  colorHex: 0x3a6a3e, // lush green island — the main read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ocean base ring (island sits in the sea) ---------------------
    parts.push(cyl(1.3, 1.4, 0.08, 14, OCEAN, { y: 0.04 })); // sea surface ring

    // ---- 2) Main island body (turtle shape) ------------------------------
    // The "turtle shell" = elongated rocky base
    parts.push(
      sph(0.9, ROCK, {
        ws: 10, hs: 6,
        thetaLen: HALF_PI,
        sy: 0.45,  // squash to a low island base
        sx: 1.3,   // elongate east-west (turtle body)
        y: 0.12,
        hex2: GREEN,
      })
    );

    // Vegetation layer on top
    parts.push(
      sph(0.82, GREEN, {
        ws: 10, hs: 5,
        thetaLen: HALF_PI,
        sy: 0.42,
        sx: 1.25,
        y: 0.18,
        hex2: GREEN_D,
      })
    );

    // ---- 3) Turtle head (volcanic peak at one end) -----------------------
    // Higher volcanic cone at the "head" end (+x)
    parts.push(
      cone(0.35, 0.65, 8, ROCK_L, { x: 0.7, y: 0.42, hex2: ROCK })
    );
    parts.push(
      sph(0.28, GREEN, { ws: 8, hs: 4, x: 0.7, y: 0.60, sy: 0.7 })
    ); // vegetation cap

    // Sulfur vent / crater at the very top
    parts.push(
      cyl(0.08, 0.10, 0.08, 6, SULFUR, { x: 0.72, y: 0.78 })
    );

    // ---- 4) Turtle tail (lower ridge at the other end) -------------------
    parts.push(
      cone(0.22, 0.35, 6, ROCK, { x: -0.65, y: 0.26, hex2: GREEN_D })
    );
    parts.push(
      sph(0.18, GREEN_D, { ws: 6, hs: 4, x: -0.7, y: 0.38, sy: 0.6 })
    );

    // ---- 5) Rocky outcrops / coastal features ----------------------------
    // A few small rocky bumps around the coast
    parts.push(box(0.12, 0.14, 0.10, ROCK, { x: 0.1, z: 0.72, y: 0.14 }));
    parts.push(box(0.10, 0.12, 0.08, ROCK, { x: -0.3, z: -0.65, y: 0.12 }));
    parts.push(box(0.08, 0.10, 0.10, ROCK_L, { x: 0.5, z: -0.55, y: 0.13 }));

    // ---- 6) Lighthouse on the tail ridge ---------------------------------
    parts.push(
      cyl(0.04, 0.04, 0.22, 6, LIGHTHOUSE, { x: -0.55, y: 0.46 })
    );
    parts.push(
      cyl(0.06, 0.06, 0.04, 6, ROCK, { x: -0.55, y: 0.34 }) // base
    );
    parts.push(
      sph(0.045, LIGHT_TOP, { ws: 6, hs: 4, x: -0.55, y: 0.58 }) // light dome
    );

    // ---- 7) "Turtle head" facial features (rocky protrusion) -------------
    // Small rocky "snout" protrusion at the head
    parts.push(
      box(0.14, 0.18, 0.12, ROCK, { x: 1.0, y: 0.24, hex2: ROCK_L })
    );

    return finish(parts);
  },
};

export default NM_GUISHAN;
