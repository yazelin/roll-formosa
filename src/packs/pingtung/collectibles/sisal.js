/**
 * @file packs/pingtung/collectibles/sisal.js — Roll Formosa Pingtung pack.
 *
 * 瓊麻 (Sisal) — collectibleId 5. One of Hengchun's Three Treasures (恆春三寶).
 * The sisal plant was historically important to the Hengchun area for rope
 * and fiber production. Silhouette: a rosette of long, stiff, pointed leaves
 * radiating from a central base, with the characteristic spiky tips.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { cone, cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const LEAF_GREEN = 0x4a7a3a;    // main leaf green
const LEAF_LIGHT = 0x6a9a5a;   // leaf highlights
const LEAF_DARK = 0x3a5a2a;    // leaf shadows
const SPINE = 0x8a6a4a;        // brown spine tip
const BASE = 0x5a4a3a;         // brown base

export const COL_SISAL = {
  id: 'sisal',
  name: '瓊麻',
  collectibleId: 5,
  colorHex: LEAF_GREEN,

  buildGeometry(rng) {
    const parts = [];

    // --- Central base ---
    parts.push(sph(0.25, BASE, { ws: 6, hs: 4, sy: 0.6, y: -0.1 }));

    // --- Radiating leaves (stiff, sword-like) ---
    const leafCount = 12;
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * PI * 2;
      const tilt = 0.3 + (rng() - 0.5) * 0.15;
      const len = 0.9 + (rng() - 0.5) * 0.2;
      const leafColor = i % 3 === 0 ? LEAF_LIGHT : (i % 3 === 1 ? LEAF_GREEN : LEAF_DARK);
      
      const x = Math.sin(angle) * 0.3;
      const z = Math.cos(angle) * 0.3;
      
      // Leaf blade (long, narrow, pointed)
      parts.push(box(0.08, 0.03, len, leafColor, {
        x: x * 1.5,
        z: z * 1.5,
        y: 0.3 + len * 0.3,
        rx: -tilt * Math.cos(angle),
        rz: tilt * Math.sin(angle),
        ry: angle,
      }));
      
      // Spine tip
      parts.push(cone(0.025, 0.12, 4, SPINE, {
        x: x * 2.8 + Math.sin(angle) * len * 0.6,
        z: z * 2.8 + Math.cos(angle) * len * 0.6,
        y: 0.5 + len * 0.55,
        rx: -tilt * Math.cos(angle) * 0.5,
        rz: tilt * Math.sin(angle) * 0.5,
      }));
    }

    // --- Inner young leaves (more upright) ---
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * PI * 2 + 0.3;
      const x = Math.sin(angle) * 0.1;
      const z = Math.cos(angle) * 0.1;
      
      parts.push(box(0.05, 0.02, 0.5, LEAF_LIGHT, {
        x,
        z,
        y: 0.5,
        rx: -0.15 * Math.cos(angle),
        rz: 0.15 * Math.sin(angle),
      }));
    }

    return finish(parts);
  },
};

export default COL_SISAL;
