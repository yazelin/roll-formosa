/**
 * @file packs/yilan/landmarks/luodong_forestry.js — Roll Formosa Yilan pack.
 *
 * 羅東林業文化園區 (Luodong Forestry Culture Park). Historic logging facility
 * with preserved timber ponds, vintage railway tracks, and traditional wooden
 * buildings — once the hub of Taiwan's logging industry.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const WATER = 0x4a6a7e;     // timber pond
const WOOD_DARK = 0x5a4030; // dark timber logs
const WOOD_LIGHT = 0x8a6a48; // light timber
const ROOF_TILE = 0x4a3828; // traditional roof
const RAIL = 0x606060;      // railway tracks
const GRASS = 0x4a6a3a;     // park grass
const STONE = 0x808080;     // stone paths

export const NM_LUODONG_FORESTRY = {
  id: 'luodong_forestry',
  name: '羅東林業文化園區',
  landmarkId: 4,  // Yilan landmark #4 — dioramaRHint 32
  dioramaRHint: 32,
  colorHex: 0x5a4030, // dark timber — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Timber pond (貯木池) --------------------------------
    parts.push(cyl(1.0, 1.1, 0.06, 12, WATER, { y: 0.03 }));
    // Grass bank
    parts.push(cyl(1.1, 1.2, 0.04, 12, GRASS, { y: 0.02 }));

    // ---- 2) Floating timber logs in pond -----------------------
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * PI * 2 + (rng ? rng() * 0.3 : 0.1 * i);
      const dist = 0.4 + (rng ? rng() * 0.3 : 0.1);
      const logLen = 0.25 + (rng ? rng() * 0.15 : 0.1);
      parts.push(
        cyl(0.04, 0.04, logLen, 6, i % 2 === 0 ? WOOD_DARK : WOOD_LIGHT, {
          x: Math.cos(angle) * dist,
          y: 0.07,
          z: Math.sin(angle) * dist,
          rz: HALF_PI,
          ry: angle + HALF_PI,
        })
      );
    }

    // ---- 3) Historic wooden building (竹林車站) -----------------
    // Main building body
    parts.push(box(0.5, 0.25, 0.35, WOOD_LIGHT, { x: 0.0, y: 0.22, z: -0.6 }));
    // Roof
    parts.push(
      box(0.6, 0.08, 0.45, ROOF_TILE, {
        x: 0.0,
        y: 0.40,
        z: -0.6,
        rx: 0.15,
      })
    );

    // ---- 4) Railway tracks --------------------------------------
    // Two rails
    parts.push(box(1.6, 0.02, 0.03, RAIL, { x: 0.0, y: 0.05, z: 0.4 }));
    parts.push(box(1.6, 0.02, 0.03, RAIL, { x: 0.0, y: 0.05, z: 0.5 }));
    // Sleepers
    for (let i = 0; i < 8; i++) {
      parts.push(
        box(0.04, 0.015, 0.18, WOOD_DARK, {
          x: -0.7 + i * 0.2,
          y: 0.04,
          z: 0.45,
        })
      );
    }

    // ---- 5) Vintage train car ----------------------------------
    parts.push(box(0.3, 0.12, 0.14, WOOD_DARK, { x: 0.5, y: 0.14, z: 0.45 }));
    // Wheels
    parts.push(cyl(0.04, 0.04, 0.02, 6, RAIL, { x: 0.4, y: 0.06, z: 0.4, rx: HALF_PI }));
    parts.push(cyl(0.04, 0.04, 0.02, 6, RAIL, { x: 0.6, y: 0.06, z: 0.4, rx: HALF_PI }));

    // ---- 6) Stone path ------------------------------------------
    parts.push(box(0.15, 0.02, 0.8, STONE, { x: -0.5, y: 0.04, z: 0.0 }));

    return finish(parts);
  },
};

export default NM_LUODONG_FORESTRY;
