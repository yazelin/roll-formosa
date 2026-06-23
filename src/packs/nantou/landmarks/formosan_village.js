/**
 * @file packs/nantou/landmarks/formosan_village.js — Roll Formosa Nantou pack, landmark 2.
 *
 * 九族文化村 — Formosan Aboriginal Culture Village, a theme park showcasing
 * Taiwan's indigenous cultures. Features:
 * - Traditional aboriginal village houses (various tribes)
 * - A tall wooden totem pole / spirit pole
 * - Thatched-roof houses with tribal patterns
 * - Ropeway station (connecting to Sun Moon Lake)
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — aboriginal village colors
const WOOD_BROWN = 0x6a4a30;    // wooden structures
const WOOD_DARK = 0x4a3020;     // dark wood accents
const THATCH = 0x8a7050;        // thatched roof
const THATCH_DARK = 0x5a4a38;   // darker thatch
const TOTEM_RED = 0xc04030;     // painted totem red
const TOTEM_BLUE = 0x3060a0;    // painted totem blue
const TOTEM_WHITE = 0xe0d8d0;   // white paint on totem
const STONE_BASE = 0x686868;    // stone foundations
const BAMBOO = 0x9a8a60;        // bamboo elements

export const NM_FORMOSAN_VILLAGE = {
  id: 'formosan_village',
  name: '九族文化村',
  landmarkId: 2,
  dioramaRHint: 35, // theme park ~70m area
  colorHex: TOTEM_RED,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.004;
    const parts = [];

    /* ---- 1) Ground platform ---------------------------------------------- */
    parts.push(box(2.8, 0.1, 2.4, STONE_BASE, { y: 0.05 }));

    /* ---- 2) Central Totem Pole (精神柱) ----------------------------------- */
    const totemY = 0.10;
    // Main pole with colored bands implied via hex2
    parts.push(cyl(0.1, 0.08, 1.2, 6, TOTEM_RED, { y: totemY + 0.7, hex2: TOTEM_BLUE }));
    // Top ornament
    parts.push(sph(0.12, TOTEM_RED, { ws: 5, hs: 3, y: totemY + 1.35, sy: 1.3 }));

    /* ---- 3) Tribal House 1 (Paiwan style - slate roof) ------------------- */
    const h1x = -0.9, h1z = 0.5;
    parts.push(box(0.55, 0.35, 0.45, WOOD_BROWN, { x: h1x, y: 0.33, z: h1z }));
    parts.push(cone(0.4, 0.22, 4, 0x505050, { x: h1x, ry: PI / 4, y: 0.58, z: h1z }));

    /* ---- 4) Tribal House 2 (Thatch roof style) --------------------------- */
    const h2x = 0.85, h2z = 0.4;
    parts.push(box(0.45, 0.3, 0.4, BAMBOO, { x: h2x, y: 0.3, z: h2z }));
    parts.push(cone(0.4, 0.35, 6, THATCH, { x: h2x, y: 0.6 + j, z: h2z }));

    /* ---- 5) Tribal House 3 (Stilt house) --------------------------------- */
    const h3x = -0.7, h3z = -0.6;
    // Stilts (reduced)
    parts.push(cyl(0.03, 0.03, 0.3, 4, WOOD_DARK, { x: h3x - 0.12, y: 0.25, z: h3z }));
    parts.push(cyl(0.03, 0.03, 0.3, 4, WOOD_DARK, { x: h3x + 0.12, y: 0.25, z: h3z }));
    parts.push(box(0.4, 0.25, 0.32, BAMBOO, { x: h3x, y: 0.52, z: h3z }));
    parts.push(cone(0.35, 0.22, 5, THATCH, { x: h3x, y: 0.74, z: h3z }));

    /* ---- 6) Performance Stage -------------------------------------------- */
    const stageZ = -0.3;
    parts.push(cyl(0.4, 0.4, 0.08, 8, STONE_BASE, { y: 0.14, z: stageZ }));

    /* ---- 7) Ropeway hint ------------------------------------------------- */
    const ropeX = 1.0, ropeZ = -0.7;
    parts.push(cyl(0.06, 0.05, 0.6, 5, 0x505050, { x: ropeX, y: 0.48, z: ropeZ }));

    return finish(parts);
  },
};

export default NM_FORMOSAN_VILLAGE;
