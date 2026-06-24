/**
 * @file packs/matsu/landmarks/blue_tears_beach.js — Roll Formosa Matsu pack.
 *
 * 藍眼淚沙灘 (Blue Tears Beach). The world-famous bioluminescent phenomenon where
 * tiny dinoflagellates glow electric blue in the waves at night. Represented as
 * a curved sandy beach with glowing blue wave crests and scattered bio-luminescent
 * dots along the shoreline — a magical seaside scene unique to Matsu.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the藍眼淚 bioluminescent beach at night.
const SAND = 0x8b7355; // dark beach sand at night
const SAND_WET = 0x5c4d3a; // wet sand near waterline
const WATER_DARK = 0x0a1a2a; // dark ocean water
const WATER_MID = 0x102840; // mid-depth water
const GLOW_BLUE = 0x00d4ff; // bright bioluminescent blue (the signature blue tears)
const GLOW_DIM = 0x0088aa; // dimmer glow in wave foam
const FOAM = 0x3399bb; // phosphorescent foam line

export const NM_BLUE_TEARS_BEACH = {
  id: 'blue_tears_beach',
  name: '藍眼淚沙灘',
  landmarkId: 0,
  dioramaRHint: 6, // small beach scene ~12m span
  colorHex: GLOW_BLUE, // the signature electric blue glow

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Sandy beach base (curved crescent shape) -----------------------
    // Beach platform - wide and flat
    parts.push(box(1.8, 0.08, 1.2, SAND, { y: 0.04, hex2: SAND_WET }));
    // Wet sand strip near waterline
    parts.push(box(1.9, 0.03, 0.3, SAND_WET, { y: 0.085, z: 0.35 }));

    // ---- 2) Dark ocean water surface ---------------------------------------
    parts.push(box(2.0, 0.06, 0.8, WATER_DARK, { y: 0.03, z: 0.75, hex2: WATER_MID }));

    // ---- 3) Glowing wave crests (the blue tears effect) --------------------
    // Main glowing wave line
    parts.push(box(1.7, 0.04, 0.12, GLOW_DIM, { y: 0.11, z: 0.42, hex2: GLOW_BLUE }));
    // Second wave line
    parts.push(box(1.5, 0.03, 0.08, GLOW_DIM, { y: 0.095, z: 0.55, hex2: GLOW_BLUE }));
    // Foam edge
    parts.push(box(1.6, 0.02, 0.05, FOAM, { y: 0.10, z: 0.38 }));

    // ---- 4) Scattered bioluminescent glowing dots on beach -----------------
    const dotN = 12;
    for (let i = 0; i < dotN; i++) {
      const x = (rng() - 0.5) * 1.4;
      const z = rng() * 0.4 + 0.2;
      const glow = rng() > 0.5 ? GLOW_BLUE : GLOW_DIM;
      parts.push(sph(0.025 + rng() * 0.015, glow, { ws: 4, hs: 3, x, y: 0.10, z }));
    }

    // ---- 5) Glowing dots in the water (dinoflagellates) --------------------
    const waterDotN = 8;
    for (let i = 0; i < waterDotN; i++) {
      const x = (rng() - 0.5) * 1.6;
      const z = rng() * 0.5 + 0.5;
      parts.push(sph(0.02 + rng() * 0.02, GLOW_BLUE, { ws: 4, hs: 3, x, y: 0.08, z }));
    }

    // ---- 6) Beach rocks / features -----------------------------------------
    // A few dark rocks on the beach
    parts.push(sph(0.08, 0x3a3a3a, { ws: 5, hs: 4, x: -0.7, y: 0.12, z: -0.2, sy: 0.6 }));
    parts.push(sph(0.06, 0x4a4a4a, { ws: 4, hs: 3, x: 0.65, y: 0.10, z: -0.15, sy: 0.5 }));

    return finish(parts);
  },
};

export default NM_BLUE_TEARS_BEACH;
