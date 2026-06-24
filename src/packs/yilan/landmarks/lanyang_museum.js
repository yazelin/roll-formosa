/**
 * @file packs/yilan/landmarks/lanyang_museum.js — Roll Formosa Yilan pack.
 *
 * 蘭陽博物館 (Lanyang Museum). The striking modern museum designed to mimic the
 * cuesta rock formations of the Yilan coastline — a dramatically tilted
 * triangular glass-and-steel building rising from a reflecting pool, appearing
 * to "emerge" from the water like a geological formation.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const WATER = 0x3a6a8e;    // reflecting pool
const GLASS = 0x7090a8;    // glass facade
const GLASS_D = 0x506070;  // darker glass panels
const STEEL = 0x505860;    // steel frame
const STONE = 0x9a9890;    // stone base
const GRASS = 0x4a6a3a;    // surrounding grass

export const NM_LANYANG_MUSEUM = {
  id: 'lanyang_museum',
  name: '蘭陽博物館',
  landmarkId: 5,  // Yilan landmark #5 — dioramaRHint 35
  dioramaRHint: 35,
  colorHex: 0x7090a8, // glass facade — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Reflecting pool (water base) ----------------------------
    parts.push(cyl(1.3, 1.4, 0.06, 14, WATER, { y: 0.03 }));
    // Grass bank around
    parts.push(cyl(1.4, 1.5, 0.04, 14, GRASS, { y: 0.02 }));

    // ---- 2) Stone platform emerging from water ----------------------
    parts.push(box(0.8, 0.12, 0.6, STONE, { y: 0.12, z: 0.1 }));

    // ---- 3) Main building — tilted triangular prism -----------------
    // The museum is a dramatically tilted wedge shape
    // We approximate with a tilted box that's narrower at top

    // Lower section (wider)
    parts.push(
      box(0.9, 0.4, 0.5, GLASS, {
        y: 0.38,
        z: 0.0,
        rz: -0.18, // slight tilt
        hex2: GLASS_D,
      })
    );

    // Upper section (narrower, more tilted)
    parts.push(
      box(0.7, 0.5, 0.4, GLASS_D, {
        y: 0.72,
        z: -0.08,
        rz: -0.22,
        hex2: GLASS,
      })
    );

    // Peak section
    parts.push(
      box(0.45, 0.35, 0.3, GLASS, {
        y: 0.98,
        z: -0.15,
        rz: -0.25,
        hex2: STEEL,
      })
    );

    // ---- 4) Steel frame lines ---------------------------------------
    // Horizontal lines across the facade
    for (let i = 0; i < 4; i++) {
      const yy = 0.28 + i * 0.22;
      parts.push(
        box(0.95 - i * 0.12, 0.02, 0.52 - i * 0.05, STEEL, {
          y: yy,
          z: -0.02 - i * 0.04,
          rz: -0.18 - i * 0.02,
        })
      );
    }

    // ---- 5) Entrance walkway ----------------------------------------
    parts.push(box(0.4, 0.04, 0.2, STONE, { x: 0.0, z: 0.5, y: 0.10 }));

    // ---- 6) Small observation deck area -----------------------------
    parts.push(box(0.25, 0.04, 0.15, STEEL, { x: -0.5, z: -0.3, y: 0.18 }));

    return finish(parts);
  },
};

export default NM_LANYANG_MUSEUM;
