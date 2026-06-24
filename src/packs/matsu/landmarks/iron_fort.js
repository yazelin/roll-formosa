/**
 * @file packs/matsu/landmarks/iron_fort.js — Roll Formosa Matsu pack.
 *
 * 鐵堡 (Iron Fort / Tiebao). A dramatic coastal military fortress carved into
 * a rocky islet connected to Nangan by a narrow causeway. Features a fortified
 * concrete bunker with gun emplacements, observation slits, and a distinctive
 * low profile hugging the granite rock. Originally built for frogman defense.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the戰地 coastal fortification.
const ROCK_DARK = 0x4a4a4a; // dark granite rock base
const ROCK_MID = 0x5a5a5a; // mid-tone rock
const ROCK_LIGHT = 0x6a6a6a; // lighter rock surfaces
const CONCRETE = 0x808080; // military concrete bunker
const CONCRETE_DARK = 0x606060; // weathered concrete
const RUST = 0x8b4513; // rusted metal elements
const WATER = 0x1a3a5a; // dark ocean water

export const NM_IRON_FORT = {
  id: 'iron_fort',
  name: '鐵堡',
  landmarkId: 1,
  dioramaRHint: 8, // small rocky fortification ~16m span
  colorHex: CONCRETE, // military concrete grey

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ocean water base -----------------------------------------------
    parts.push(box(2.0, 0.06, 2.0, WATER, { y: -0.03 }));

    // ---- 2) Rocky islet base (irregular granite mass) ----------------------
    // Main rock mass
    parts.push(sph(0.5, ROCK_DARK, { ws: 6, hs: 5, y: 0.15, sy: 0.5, hex2: ROCK_MID }));
    // Secondary rock lumps
    parts.push(sph(0.35, ROCK_MID, { ws: 5, hs: 4, x: 0.3, y: 0.12, z: -0.2, sy: 0.45 }));
    parts.push(sph(0.3, ROCK_DARK, { ws: 5, hs: 4, x: -0.25, y: 0.10, z: 0.2, sy: 0.4 }));
    // Top rock surface
    parts.push(cyl(0.55, 0.6, 0.08, 8, ROCK_LIGHT, { y: 0.28 }));

    // ---- 3) Narrow causeway connecting to shore ----------------------------
    parts.push(box(0.12, 0.08, 0.8, ROCK_MID, { y: 0.04, z: -0.8 }));

    // ---- 4) Concrete bunker structure (low profile) ------------------------
    // Main bunker body - rectangular and low
    parts.push(box(0.6, 0.22, 0.45, CONCRETE_DARK, { y: 0.40, hex2: CONCRETE }));
    // Bunker roof slab
    parts.push(box(0.65, 0.05, 0.50, CONCRETE, { y: 0.53 }));
    // Observation slit (dark inset)
    parts.push(box(0.35, 0.04, 0.02, 0x202020, { y: 0.42, z: 0.24 }));

    // ---- 5) Gun emplacement / observation post -----------------------------
    // Raised observation post on one side
    parts.push(cyl(0.12, 0.14, 0.15, 6, CONCRETE, { x: 0.22, y: 0.60, hex2: CONCRETE_DARK }));
    // Gun barrel / periscope
    parts.push(cyl(0.025, 0.025, 0.12, 4, RUST, { x: 0.22, y: 0.70, rz: 0.3 }));

    // ---- 6) Defensive features ---------------------------------------------
    // Rusted metal barriers / stakes
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2 + rng() * 0.3;
      const r = 0.55 + rng() * 0.1;
      parts.push(cyl(0.015, 0.02, 0.18, 4, RUST, {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 0.35,
        rz: (rng() - 0.5) * 0.2,
      }));
    }

    // ---- 7) Entrance tunnel (dark opening) ---------------------------------
    parts.push(box(0.12, 0.15, 0.08, 0x1a1a1a, { y: 0.36, z: -0.26 }));

    return finish(parts);
  },
};

export default NM_IRON_FORT;
