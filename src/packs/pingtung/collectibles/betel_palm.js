/**
 * @file packs/pingtung/collectibles/betel_palm.js — Roll Formosa Pingtung pack.
 *
 * 檳榔樹 (Betel Palm) — collectibleId 11. Betel nut palms are a distinctive
 * feature of the Pingtung landscape. Silhouette: a tall, slender palm tree
 * with a crown of feathery fronds and clusters of betel nuts.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, sph, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const TRUNK_GREY = 0x8a8a7a;   // grey trunk
const TRUNK_RING = 0x7a7a6a;   // trunk ring marks
const CROWN_GREEN = 0x2a5a2a;  // crown shaft green
const FROND_GREEN = 0x4a8a3a;  // frond green
const NUT_ORANGE = 0xd08030;   // ripe betel nuts

export const COL_BETEL_PALM = {
  id: 'betel_palm',
  name: '檳榔樹',
  collectibleId: 11,
  colorHex: TRUNK_GREY,

  buildGeometry(rng) {
    const parts = [];

    // --- Trunk (tall, slender) ---
    parts.push(cyl(0.18, 0.22, 2.0, 6, TRUNK_GREY, { y: 0.5, hex2: TRUNK_RING }));

    // --- Crown shaft ---
    parts.push(cyl(0.16, 0.18, 0.4, 5, CROWN_GREEN, { y: 1.6 }));

    // --- Fronds (simplified - 5 fronds) ---
    const frondCount = 5;
    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * PI * 2;
      const tilt = 0.7;

      // Main frond as simple cone
      parts.push(cone(0.04, 0.7, 4, FROND_GREEN, {
        x: Math.sin(angle) * 0.5,
        z: Math.cos(angle) * 0.5,
        y: 2.0,
        rx: -tilt * Math.cos(angle),
        rz: tilt * Math.sin(angle),
      }));
    }

    // --- Betel nut cluster (simplified) ---
    parts.push(cyl(0.04, 0.03, 0.2, 4, CROWN_GREEN, { y: 1.35, rx: 0.3 }));
    // 3 nuts only
    parts.push(sph(0.05, NUT_ORANGE, { ws: 4, hs: 3, x: 0.08, y: 1.15, z: 0.06 }));
    parts.push(sph(0.05, NUT_ORANGE, { ws: 4, hs: 3, x: -0.05, y: 1.18, z: 0.08 }));
    parts.push(sph(0.05, NUT_ORANGE, { ws: 4, hs: 3, x: 0.02, y: 1.1, z: -0.05 }));

    return finish(parts);
  },
};

export default COL_BETEL_PALM;
