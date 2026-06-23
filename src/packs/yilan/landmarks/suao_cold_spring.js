/**
 * @file packs/yilan/landmarks/suao_cold_spring.js — Roll Formosa Yilan pack.
 *
 * 蘇澳冷泉 (Suao Cold Spring). One of only two natural carbonated cold springs
 * in the world — featuring traditional Japanese-era bathhouses and the famous
 * naturally effervescent 22°C mineral spring water.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const SPRING_WATER = 0x80b8c8; // cold spring blue-green
const BUBBLES = 0xd0e8f0;      // carbonation bubbles
const STONE_POOL = 0x707868;   // pool stone edge
const WOOD_BATH = 0x8a6a48;    // wooden bathhouse
const ROOF_TILE = 0x3a3a3a;    // traditional roof
const TILE_FLOOR = 0xc0b8a0;   // bath tile
const TREE_TRUNK = 0x5a4030;   // surrounding trees
const TREE_GREEN = 0x3a6a2a;   // tree foliage

export const NM_SUAO_COLD_SPRING = {
  id: 'suao_cold_spring',
  name: '蘇澳冷泉',
  landmarkId: 1,  // Yilan landmark #1 — dioramaRHint 28
  dioramaRHint: 28,
  colorHex: 0x80b8c8, // cold spring water — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Main cold spring pool ------------------------------
    // Pool water surface
    parts.push(cyl(0.5, 0.5, 0.08, 6, SPRING_WATER, { y: 0.06 }));
    // Stone edge
    parts.push(cyl(0.55, 0.58, 0.12, 6, STONE_POOL, { y: 0.06 }));
    parts.push(cyl(0.48, 0.48, 0.10, 6, SPRING_WATER, { y: 0.07 })); // inner cut

    // ---- 2) Carbonation bubbles (天然碳酸泡) --------------------
    // 3 bubbles only (low poly)
    parts.push(sph(0.03, BUBBLES, { x: 0.1, y: 0.12, z: 0.1 }));
    parts.push(sph(0.025, BUBBLES, { x: -0.1, y: 0.14, z: 0.05 }));
    parts.push(sph(0.02, BUBBLES, { x: 0.0, y: 0.13, z: -0.1 }));

    // ---- 3) Traditional bathhouse pavilion ---------------------
    // Main structure
    parts.push(box(0.5, 0.30, 0.35, WOOD_BATH, { x: 0.0, y: 0.25, z: -0.55 }));
    // Tiled floor area
    parts.push(box(0.6, 0.04, 0.4, TILE_FLOOR, { x: 0.0, y: 0.08, z: -0.55 }));
    // Traditional sloped roof
    parts.push(
      box(0.6, 0.06, 0.45, ROOF_TILE, {
        x: 0.0,
        y: 0.44,
        z: -0.55,
        rx: 0.15,
      })
    );
    // Roof ridge
    parts.push(box(0.5, 0.03, 0.06, ROOF_TILE, { x: 0.0, y: 0.50, z: -0.55 }));

    // ---- 4) Small private pools --------------------------------
    parts.push(cyl(0.15, 0.15, 0.06, 5, SPRING_WATER, { x: 0.5, y: 0.05, z: 0.3 }));
    parts.push(cyl(0.18, 0.18, 0.08, 5, STONE_POOL, { x: 0.5, y: 0.04, z: 0.3 }));

    // ---- 5) Surrounding trees (low-poly cones) ----------------
    // Tree 1
    parts.push(cyl(0.04, 0.05, 0.25, 4, TREE_TRUNK, { x: -0.6, y: 0.15, z: 0.4 }));
    parts.push(cone(0.15, 0.20, 4, TREE_GREEN, { x: -0.6, y: 0.35, z: 0.4 }));
    // Tree 2
    parts.push(cyl(0.03, 0.04, 0.20, 4, TREE_TRUNK, { x: 0.65, y: 0.12, z: -0.3 }));
    parts.push(cone(0.12, 0.16, 4, TREE_GREEN, { x: 0.65, y: 0.28, z: -0.3 }));

    return finish(parts);
  },
};

export default NM_SUAO_COLD_SPRING;
