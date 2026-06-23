/**
 * @file packs/pingtung/collectibles/paiwan_pot.js — Roll Formosa Pingtung pack.
 *
 * 排灣陶壺 (Paiwan Pottery) — collectibleId 10. The traditional ceramic pot
 * of the Paiwan indigenous people of Pingtung. These pots feature distinctive
 * geometric patterns and the sacred hundred-pace viper motifs.
 * Silhouette: a rounded pot with narrow neck and decorative bands.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { sph, cyl, torus, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const TERRACOTTA = 0x9a5a3a;   // main pot color
const DARK_CLAY = 0x6a3a2a;    // darker clay
const PATTERN = 0x2a1a10;      // dark pattern lines

export const COL_PAIWAN_POT = {
  id: 'paiwan_pot',
  name: '排灣陶壺',
  collectibleId: 10,
  colorHex: TERRACOTTA,

  buildGeometry(rng) {
    const parts = [];

    // --- Main pot body (bulbous) ---
    parts.push(sph(0.8, TERRACOTTA, { ws: 8, hs: 5, sx: 1.0, sy: 0.9, sz: 1.0, y: 0.5 }));

    // --- Narrowing shoulder ---
    parts.push(cyl(0.6, 0.8, 0.3, 6, TERRACOTTA, { y: 1.1, hex2: DARK_CLAY }));

    // --- Neck ---
    parts.push(cyl(0.35, 0.55, 0.4, 6, DARK_CLAY, { y: 1.45 }));

    // --- Rim/lip ---
    parts.push(cyl(0.4, 0.35, 0.12, 6, TERRACOTTA, { y: 1.72 }));

    // --- Base ---
    parts.push(cyl(0.5, 0.55, 0.15, 6, DARK_CLAY, { y: -0.2 }));

    // --- Decorative pattern bands (simplified) ---
    parts.push(torus(0.72, 0.04, 3, 8, PATTERN, { y: 0.85 }));
    parts.push(torus(0.78, 0.04, 3, 8, PATTERN, { y: 0.5 }));

    // --- Snake pattern elements (4 only) ---
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * PI * 2;
      const x = Math.cos(angle) * 0.75;
      const z = Math.sin(angle) * 0.75;
      parts.push(box(0.08, 0.15, 0.03, PATTERN, { x, y: 0.68, z, ry: angle }));
    }

    return finish(parts);
  },
};

export default COL_PAIWAN_POT;
