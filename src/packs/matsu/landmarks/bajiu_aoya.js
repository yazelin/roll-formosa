/**
 * @file packs/matsu/landmarks/bajiu_aoya.js — Roll Formosa Matsu pack.
 *
 * 八角據點遺址 (Bajiu Aoya / Octagonal Military Outpost Ruins). A distinctive
 * Cold War era octagonal concrete observation post and defensive position,
 * now a historical ruin. The octagonal shape allowed 360-degree coverage
 * and is a signature silhouette of Matsu's military heritage.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the戰地遺址 weathered military ruins.
const CONCRETE_OLD = 0x6b6b6b; // aged concrete
const CONCRETE_DARK = 0x4a4a4a; // dark weathered concrete
const CONCRETE_STAIN = 0x5a5a50; // stained / mossy patches
const RUST = 0x8b4513; // rusted rebar / metal
const GRASS = 0x4a5a3a; // overgrown grass patches
const GROUND = 0x5a5040; // bare earth

export const NM_BAJIU_AOYA = {
  id: 'bajiu_aoya',
  name: '八角據點遺址',
  landmarkId: 2,
  dioramaRHint: 10, // medium ruins site ~20m span
  colorHex: CONCRETE_OLD, // weathered military concrete

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ground / terrain base ------------------------------------------
    parts.push(cyl(1.0, 1.1, 0.08, 12, GROUND, { y: 0.04, hex2: GRASS }));

    // ---- 2) Octagonal foundation platform ----------------------------------
    // The octagon uses seg=8 cylinder
    parts.push(cyl(0.65, 0.7, 0.12, 8, CONCRETE_DARK, { y: 0.10, hex2: CONCRETE_OLD }));

    // ---- 3) Octagonal wall structure (partially ruined) --------------------
    // Main octagonal walls - using 8 box segments around the perimeter
    const wallN = 8;
    const wallR = 0.52;
    const wallW = 0.38; // width of each wall segment
    for (let i = 0; i < wallN; i++) {
      const a = (i / wallN) * PI * 2;
      // Vary heights to show partial ruins
      const h = 0.25 + rng() * 0.15;
      // Some walls are broken / missing
      if (rng() > 0.15) {
        parts.push(box(wallW, h, 0.08, CONCRETE_OLD, {
          x: Math.cos(a) * wallR,
          z: Math.sin(a) * wallR,
          y: 0.16 + h / 2,
          ry: -a,
          hex2: CONCRETE_STAIN,
        }));
      }
    }

    // ---- 4) Central observation post (partially intact) --------------------
    parts.push(cyl(0.22, 0.25, 0.30, 8, CONCRETE_DARK, { y: 0.31, hex2: CONCRETE_OLD }));
    // Roof slab (tilted / damaged)
    parts.push(cyl(0.26, 0.22, 0.06, 8, CONCRETE_OLD, { y: 0.48, rz: 0.08 }));

    // ---- 5) Observation slits in walls -------------------------------------
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2 + PI / 8;
      parts.push(box(0.08, 0.03, 0.02, 0x202020, {
        x: Math.cos(a) * 0.54,
        z: Math.sin(a) * 0.54,
        y: 0.32,
        ry: -a,
      }));
    }

    // ---- 6) Exposed rebar / structural damage ------------------------------
    for (let i = 0; i < 5; i++) {
      const a = rng() * PI * 2;
      const r = 0.45 + rng() * 0.15;
      parts.push(cyl(0.012, 0.012, 0.15, 4, RUST, {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 0.35 + rng() * 0.1,
        rz: (rng() - 0.5) * 0.4,
        rx: (rng() - 0.5) * 0.3,
      }));
    }

    // ---- 7) Overgrown grass patches ----------------------------------------
    for (let i = 0; i < 6; i++) {
      const x = (rng() - 0.5) * 1.2;
      const z = (rng() - 0.5) * 1.2;
      parts.push(sph(0.06 + rng() * 0.04, GRASS, {
        ws: 4, hs: 3, x, z, y: 0.10, sy: 0.4,
      }));
    }

    return finish(parts);
  },
};

export default NM_BAJIU_AOYA;
