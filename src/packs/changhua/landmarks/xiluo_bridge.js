/**
 * @file packs/changhua/landmarks/xiluo_bridge.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_XILUO_BRIDGE — 西螺大橋 (Xiluo Bridge), the iconic red truss bridge
 * spanning the Zhuoshui River. Built in 1952, it was once the longest bridge
 * in East Asia at 1,939 meters. Its distinctive red Warren truss design
 * is a beloved landmark on the border of Changhua and Yunlin counties.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const TRUSS = 0xc82828;       // red truss structure
const TRUSS_D = 0xa82020;     // darker red
const DECK = 0x606060;        // road deck
const PIER = 0xb0a890;        // concrete piers
const WATER = 0x6090b0;       // river water

export const NM_XILUO_BRIDGE = {
  id: 'xiluo_bridge',
  name: '西螺大橋',
  landmarkId: 98,
  dioramaRHint: 100,
  colorHex: TRUSS,

  buildGeometry(rng) {
    const parts = [];

    // River water
    parts.push(box(2.0, 0.04, 0.8, WATER, { y: -0.02 }));

    // Bridge deck
    parts.push(box(1.8, 0.05, 0.22, DECK, { y: 0.25 }));

    // Concrete piers (reduced to 2)
    parts.push(box(0.12, 0.28, 0.25, PIER, { x: -0.50, y: 0.12 }));
    parts.push(box(0.12, 0.28, 0.25, PIER, { x: 0.50, y: 0.12 }));

    // Simplified truss - 2 sections with fewer elements
    for (let section = 0; section < 2; section++) {
      const baseX = -0.45 + section * 0.90;

      // Top chord (both sides combined into single wider beams)
      parts.push(box(0.85, 0.04, 0.03, TRUSS, { x: baseX + 0.42, y: 0.50, z: 0.10 }));
      parts.push(box(0.85, 0.04, 0.03, TRUSS, { x: baseX + 0.42, y: 0.50, z: -0.10 }));

      // Bottom chord
      parts.push(box(0.85, 0.04, 0.03, TRUSS, { x: baseX + 0.42, y: 0.28, z: 0.10 }));
      parts.push(box(0.85, 0.04, 0.03, TRUSS, { x: baseX + 0.42, y: 0.28, z: -0.10 }));

      // Verticals (only at ends)
      parts.push(box(0.02, 0.22, 0.02, TRUSS, { x: baseX, y: 0.39, z: 0.10 }));
      parts.push(box(0.02, 0.22, 0.02, TRUSS, { x: baseX, y: 0.39, z: -0.10 }));

      // Diagonal members (simplified - 2 per section per side)
      parts.push(box(0.38, 0.03, 0.02, TRUSS_D, { x: baseX + 0.22, y: 0.39, z: 0.10, rz: 0.6 }));
      parts.push(box(0.38, 0.03, 0.02, TRUSS_D, { x: baseX + 0.62, y: 0.39, z: 0.10, rz: -0.6 }));
      parts.push(box(0.38, 0.03, 0.02, TRUSS_D, { x: baseX + 0.22, y: 0.39, z: -0.10, rz: 0.6 }));
      parts.push(box(0.38, 0.03, 0.02, TRUSS_D, { x: baseX + 0.62, y: 0.39, z: -0.10, rz: -0.6 }));

      // Cross bracing
      parts.push(box(0.02, 0.02, 0.18, TRUSS, { x: baseX + 0.42, y: 0.50 }));
    }

    // End portals
    parts.push(box(0.03, 0.25, 0.22, TRUSS, { x: -0.90, y: 0.40 }));
    parts.push(box(0.03, 0.25, 0.22, TRUSS, { x: 0.90, y: 0.40 }));

    return finish(parts);
  },
};

export default NM_XILUO_BRIDGE;
