/**
 * @file packs/kaohsiung/collectibles/duck_meat.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_DUCK_MEAT — 鹽埕鴨肉 (Yancheng-style sliced duck). Silhouette: a shallow
 * round plate holding a small mound of warm white rice, capped by a fan of
 * sauce-glazed sliced duck meat and a scatter of green spring-onion. A small,
 * hand-held dish — wide and low, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 600 triangles (collectible budget; aims ~150-400). rng() only
 * nudges the sauce tint, never structure.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

export const COL_DUCK_MEAT = {
  id: 'duck_meat',
  name: '鹽埕鴨肉',
  colorHex: 0xb06a40, // sauce-glazed duck meat

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201); // tiny per-instance sauce tint nudge
    const meat = 0xb06a40 + t; // braised duck — warm sauce brown
    const meatHi = 0xc6855a; // glazed highlight on top of each slice
    const rice = 0xf3ece0; // warm white rice
    const plate = 0xeef2f4; // pale ceramic plate
    const plateRim = 0xdbe3e7; // cooler rim shadow
    const scallion = 0x4f7a3a; // spring-onion green

    return finish([
      // --- PLATE: a shallow round dish, wide and low --------------------
      cyl(0.95, 0.78, 0.16, 16, plate, { y: 0.08, hex2: 0xfafcfd }),
      // raised plate rim lip (reads as a dish edge)
      cyl(0.99, 0.95, 0.08, 16, plateRim, { y: 0.2, open: true, hex2: 0xeef2f4 }),

      // --- RICE: a low mound of white rice sitting in the plate ---------
      sph(0.6, rice, { ws: 10, hs: 4, sy: 0.5, y: 0.26, hex2: 0xfffaf2 }),

      // --- DUCK SLICES: a fan of flat sauce-glazed slabs over the rice ---
      // Drawn as thin tilted boxes so the cross-grain slices read clearly.
      box(0.5, 0.07, 0.34, meat, { x: -0.22, y: 0.46, z: 0.12, rz: 0.12, rx: -0.18, hex2: meatHi }),
      box(0.5, 0.07, 0.34, meat, { x: 0.04, y: 0.5, z: 0.16, rz: -0.05, rx: -0.22, hex2: meatHi }),
      box(0.5, 0.07, 0.34, meat, { x: 0.3, y: 0.46, z: 0.1, rz: -0.14, rx: -0.16, hex2: meatHi }),
      box(0.46, 0.07, 0.32, meat, { x: -0.06, y: 0.56, z: -0.16, rz: 0.04, rx: 0.16, hex2: meatHi }),
      box(0.46, 0.07, 0.32, meat, { x: 0.2, y: 0.54, z: -0.2, rz: -0.08, rx: 0.2, hex2: meatHi }),

      // --- SAUCE pooling at the lower edge of the meat fan --------------
      sph(0.34, meat, { ws: 6, hs: 3, sy: 0.22, x: 0.02, y: 0.34, z: 0.34, hex2: meatHi }),

      // --- SPRING-ONION garnish: tiny green flecks on top --------------
      box(0.16, 0.04, 0.05, scallion, { x: -0.18, y: 0.62, z: 0.04, rz: 0.3 }),
      box(0.15, 0.04, 0.05, scallion, { x: 0.16, y: 0.62, z: 0.18, rz: -0.4 }),
      box(0.14, 0.04, 0.05, scallion, { x: 0.05, y: 0.66, z: -0.12, rz: 0.15 }),
    ]);
  },
};

export default COL_DUCK_MEAT;
