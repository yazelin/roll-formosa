/**
 * @file packs/pingtung/collectibles/wanjin_cross.js — Roll Formosa Pingtung pack.
 *
 * 萬金聖母十字架 (Wanjin Holy Mother Cross) — collectibleId 12. The cross from
 * Wanjin Basilica (萬金聖母聖殿), the oldest Catholic church in Taiwan, located
 * in Wanjin village, Pingtung. Silhouette: an ornate Catholic cross with
 * decorative elements and the sacred heart motif.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { box, sph, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const GOLD = 0xd4a84a;         // gold cross
const GOLD_LIGHT = 0xe8c060;   // gold highlight
const GOLD_DARK = 0xb08030;    // gold shadow
const RED = 0xc02020;          // sacred heart red
const WHITE = 0xf8f8f0;        // white decorative elements

export const COL_WANJIN_CROSS = {
  id: 'wanjin_cross',
  name: '萬金聖母十字架',
  collectibleId: 12,
  colorHex: GOLD,

  buildGeometry(rng) {
    const parts = [];

    // --- Main vertical beam ---
    parts.push(box(0.18, 1.8, 0.08, GOLD, { y: 0.6, hex2: GOLD_LIGHT }));
    // Vertical beam edges (beveled look)
    parts.push(box(0.02, 1.85, 0.1, GOLD_DARK, { x: 0.1, y: 0.6 }));
    parts.push(box(0.02, 1.85, 0.1, GOLD_DARK, { x: -0.1, y: 0.6 }));

    // --- Horizontal crossbar ---
    parts.push(box(1.1, 0.16, 0.08, GOLD, { y: 1.1, hex2: GOLD_LIGHT }));
    // Crossbar edges
    parts.push(box(1.15, 0.02, 0.1, GOLD_DARK, { y: 1.18 }));
    parts.push(box(1.15, 0.02, 0.1, GOLD_DARK, { y: 1.02 }));

    // --- Decorative finials (ends of cross arms) ---
    // Top finial
    parts.push(sph(0.12, GOLD_LIGHT, { ws: 5, hs: 4, y: 1.6 }));
    parts.push(cone(0.08, 0.15, 5, GOLD, { y: 1.72 }));
    // Bottom finial
    parts.push(sph(0.1, GOLD_LIGHT, { ws: 5, hs: 4, y: -0.35 }));
    // Left finial
    parts.push(sph(0.1, GOLD_LIGHT, { ws: 5, hs: 4, x: -0.6, y: 1.1 }));
    // Right finial
    parts.push(sph(0.1, GOLD_LIGHT, { ws: 5, hs: 4, x: 0.6, y: 1.1 }));

    // --- Sacred Heart at center (traditional Catholic symbol) ---
    // Heart shape (simplified)
    parts.push(sph(0.15, RED, { ws: 6, hs: 4, sx: 1.0, sy: 1.1, sz: 0.6, y: 1.1, z: 0.08 }));
    // Heart point
    parts.push(cone(0.08, 0.12, 4, RED, { y: 0.95, z: 0.08, rx: PI }));
    // Flames above heart (gold)
    parts.push(cone(0.04, 0.1, 4, GOLD_LIGHT, { y: 1.28, z: 0.1 }));
    parts.push(cone(0.03, 0.08, 4, GOLD_LIGHT, { x: 0.05, y: 1.25, z: 0.1, rz: 0.2 }));
    parts.push(cone(0.03, 0.08, 4, GOLD_LIGHT, { x: -0.05, y: 1.25, z: 0.1, rz: -0.2 }));

    // --- Decorative rays (emanating from center) ---
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      // Skip rays that would overlap with cross arms
      if (Math.abs(Math.cos(angle)) > 0.7 || Math.abs(Math.sin(angle)) > 0.7) continue;
      const rx = Math.cos(angle) * 0.35;
      const ry = Math.sin(angle) * 0.35 + 1.1;
      parts.push(box(0.02, 0.12, 0.02, GOLD_LIGHT, { x: rx, y: ry, z: 0.05, rz: angle - HALF_PI }));
    }

    // --- Base/stand ---
    parts.push(cyl(0.2, 0.25, 0.1, 6, GOLD_DARK, { y: -0.5 }));
    parts.push(cyl(0.3, 0.2, 0.06, 6, GOLD, { y: -0.58 }));

    // --- INRI plaque (above center) ---
    parts.push(box(0.22, 0.1, 0.03, WHITE, { y: 1.38, z: 0.06 }));

    return finish(parts);
  },
};

export default COL_WANJIN_CROSS;
