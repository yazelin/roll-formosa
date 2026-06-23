/**
 * @file packs/hualien/landmarks/pine_garden.js — Roll Formosa Hualien pack.
 *
 * NM_PINE_GARDEN — 松園別館 (Pine Garden), a historic Japanese military
 * officer's club built in 1943. Features elegant colonial architecture
 * with arched windows, surrounded by old Ryukyu pines with distinctive
 * sprawling branches that give the site its name.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Colonial building colors
const WALL = 0xe8e0c8; // cream/beige plastered walls
const WALL_D = 0xc8c0a8; // shadowed walls
const WOOD = 0x5a4030; // dark wood trim
const ROOF = 0x6a4a3a; // terracotta-brown roof tiles
const WINDOW = 0x3a5a7a; // window glass (dark blue)
const PINE = 0x2a5a3a; // pine tree foliage
const TRUNK = 0x4a3a2a; // pine tree trunk

export const NM_PINE_GARDEN = {
  id: 'pine_garden',
  name: '松園別館',
  landmarkId: 1,
  dioramaRHint: 40,
  colorHex: WALL,

  buildGeometry(rng) {
    const parts = [];

    // ---- Ground/garden platform -------------------------------------------
    parts.push(box(3.5, 0.08, 2.8, 0x4a6a4a, { y: 0.04 })); // grass/garden
    parts.push(box(2.8, 0.04, 1.0, 0x8a8070, { y: 0.02, z: 0.6 })); // stone path

    // ---- Main building (L-shaped colonial structure) ----------------------
    // Main wing
    const mainW = 2.2;
    const mainD = 1.2;
    const mainH = 1.4;
    parts.push(box(mainW, mainH, mainD, WALL, { y: 0.08 + mainH / 2, hex2: WALL_D }));

    // Side wing (creating L-shape)
    const wingW = 0.9;
    const wingD = 1.6;
    parts.push(box(wingW, mainH * 0.9, wingD, WALL, { x: -mainW / 2 - wingW / 2 + 0.1, z: -0.3, y: 0.08 + mainH * 0.45, hex2: WALL_D }));

    // ---- Arched windows and doors -----------------------------------------
    // Main facade arched windows (simplified as recessed dark boxes)
    for (let i = 0; i < 4; i++) {
      const wx = -0.75 + i * 0.5;
      parts.push(box(0.28, 0.6, 0.08, WINDOW, { x: wx, z: mainD / 2 + 0.01, y: 0.08 + 0.8 }));
      // Arch top (small box)
      parts.push(box(0.32, 0.08, 0.06, WALL_D, { x: wx, z: mainD / 2 + 0.02, y: 0.08 + 1.15 }));
    }

    // ---- Roof -------------------------------------------------------------
    const roofY = 0.08 + mainH;
    // Main roof (hipped)
    parts.push(box(mainW + 0.3, 0.1, mainD + 0.3, WOOD, { y: roofY + 0.05 })); // eave
    parts.push(box(mainW + 0.1, 0.4, mainD + 0.1, ROOF, { y: roofY + 0.25 })); // roof body
    parts.push(box(mainW - 0.2, 0.08, 0.15, ROOF, { y: roofY + 0.5 })); // ridge

    // Side wing roof
    parts.push(box(wingW + 0.2, 0.08, wingD + 0.2, WOOD, { x: -mainW / 2 - wingW / 2 + 0.1, z: -0.3, y: 0.08 + mainH * 0.9 + 0.04 }));
    parts.push(box(wingW, 0.3, wingD, ROOF, { x: -mainW / 2 - wingW / 2 + 0.1, z: -0.3, y: 0.08 + mainH * 0.9 + 0.2 }));

    // ---- Signature Ryukyu pine trees --------------------------------------
    // Pine 1 (large, front-left)
    parts.push(cyl(0.12, 0.15, 1.2, 6, TRUNK, { x: -1.3, z: 0.8, y: 0.68 }));
    // Spreading branches (simplified as flat ellipsoid-ish cones)
    parts.push(cone(0.8, 0.25, 8, PINE, { x: -1.3, z: 0.8, y: 1.45 }));
    parts.push(cone(0.5, 0.2, 6, PINE, { x: -1.0, z: 1.0, y: 1.55 }));

    // Pine 2 (medium, front-right)
    parts.push(cyl(0.10, 0.12, 0.9, 6, TRUNK, { x: 1.2, z: 0.7, y: 0.53 }));
    parts.push(cone(0.6, 0.22, 8, PINE, { x: 1.2, z: 0.7, y: 1.15 }));

    // Pine 3 (small, back)
    parts.push(cyl(0.08, 0.10, 0.7, 6, TRUNK, { x: 0.5, z: -1.0, y: 0.43 }));
    parts.push(cone(0.45, 0.18, 6, PINE, { x: 0.5, z: -1.0, y: 0.90 }));

    return finish(parts);
  },
};

export default NM_PINE_GARDEN;
