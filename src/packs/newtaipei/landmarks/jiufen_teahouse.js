/**
 * @file packs/newtaipei/landmarks/jiufen_teahouse.js — Roll Formosa New Taipei pack.
 *
 * NM_JIUFEN_TEAHOUSE — 九份老街茶樓 (Jiufen Old Street Tea House). The iconic
 * red-lantern-hung wooden teahouse perched on the hillside, with multiple
 * levels cascading down the slope, paper lanterns glowing, and a viewing
 * balcony overlooking the sea. The read is a multi-tiered wooden structure
 * with dark wooden beams, red lanterns, and warm amber glow.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — warm mountain teahouse colors.
const WOOD = 0x5a3a24;      // dark wooden beams and structure
const WOOD_LT = 0x7a5a3a;   // lighter wood panels
const LANTERN = 0xd83a2a;   // red paper lanterns
const LANTERN_GLOW = 0xff6a4a; // lantern glow (brighter)
const ROOF_TILE = 0x3a3a3a; // dark grey traditional tiles
const BALCONY = 0x6a4a32;   // balcony wood
const WINDOW = 0xffeebb;    // warm window glow

export const NM_JIUFEN_TEAHOUSE = {
  id: 'jiufen_teahouse',
  name: '九份老街茶樓',
  landmarkId: 0,
  dioramaRHint: 15, // ~15 m footprint
  colorHex: LANTERN, // red lantern read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Multi-level cascading wooden structure ---------------------
    // Ground/lowest level (widest)
    parts.push(box(1.2, 0.5, 1.0, WOOD, { y: 0.25 })); // base structure
    parts.push(box(1.3, 0.08, 1.1, ROOF_TILE, { y: 0.54 })); // flat roof

    // Middle level (set back on the "hill")
    parts.push(box(0.9, 0.5, 0.8, WOOD_LT, { y: 0.75, z: -0.15 }));
    parts.push(box(1.0, 0.08, 0.9, ROOF_TILE, { y: 1.04, z: -0.15 }));

    // Top level (smallest, with peaked roof)
    parts.push(box(0.6, 0.45, 0.55, WOOD, { y: 1.26, z: -0.25 }));
    // peaked roof
    parts.push(cyl(0.45, 0.5, 0.06, 4, ROOF_TILE, { ry: HALF_PI/2, y: 1.52, z: -0.25 }));
    parts.push(cone(0.42, 0.3, 4, ROOF_TILE, { y: 1.67, z: -0.25, ry: HALF_PI/2 }));

    // ---- 2) Balcony viewing platform (cantilevered) --------------------
    parts.push(box(1.4, 0.06, 0.35, BALCONY, { y: 0.5, z: 0.67 })); // balcony floor
    parts.push(box(1.4, 0.15, 0.04, WOOD, { y: 0.6, z: 0.85 })); // balcony rail
    // balcony support posts
    for (const x of [-0.6, 0, 0.6]) {
      parts.push(cyl(0.04, 0.04, 0.5, 4, WOOD, { x, y: 0.25, z: 0.75 }));
    }

    // ---- 3) Red paper lanterns hanging from eaves ----------------------
    const lanternY = [0.48, 0.98, 1.46];
    const lanternZ = [0.45, 0.35, 0.2];
    for (let i = 0; i < 2; i++) {
      for (const x of [-0.35, 0.35]) {
        // lantern body (oval sphere)
        parts.push(sph(0.08, LANTERN, { ws: 6, hs: 5, sy: 1.3, x, y: lanternY[i], z: lanternZ[i] }));
        // glow spot
        parts.push(sph(0.04, LANTERN_GLOW, { ws: 4, hs: 3, x, y: lanternY[i], z: lanternZ[i] }));
        // hanging cord
        parts.push(cyl(0.01, 0.01, 0.08, 4, WOOD, { x, y: lanternY[i] + 0.12, z: lanternZ[i] }));
      }
    }

    // ---- 4) Warm window glow panels ------------------------------------
    // Windows on each level
    parts.push(box(0.15, 0.18, 0.02, WINDOW, { x: 0.35, y: 0.3, z: 0.51 }));
    parts.push(box(0.15, 0.18, 0.02, WINDOW, { x: -0.35, y: 0.3, z: 0.51 }));
    parts.push(box(0.12, 0.15, 0.02, WINDOW, { x: 0.25, y: 0.8, z: 0.26 }));
    parts.push(box(0.12, 0.15, 0.02, WINDOW, { x: -0.25, y: 0.8, z: 0.26 }));

    // ---- 5) Stone steps leading up the hillside ------------------------
    for (let i = 0; i < 2; i++) {
      parts.push(box(0.5, 0.08, 0.15, 0x7a7a7a, { y: 0.04 + i * 0.1, z: 0.35 - i * 0.2 }));
    }

    return finish(parts);
  },
};

export default NM_JIUFEN_TEAHOUSE;
