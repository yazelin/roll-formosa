/**
 * @file packs/pingtung/collectibles/bluefin_tuna.js — Roll Formosa Pingtung pack.
 *
 * 黑鮪魚 (Bluefin Tuna) — collectibleId 1. The iconic Donggang bluefin tuna,
 * a prized catch celebrated in the annual Donggang Bluefin Tuna Festival.
 * Silhouette: a sleek torpedo-shaped fish with a forked tail, dorsal fin,
 * and the characteristic dark blue back fading to silver belly.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const DARK_BLUE = 0x1a3a5c;   // dorsal dark blue
const SILVER = 0xc0c8d0;      // belly silver
const FIN_DARK = 0x2a4a6c;    // fin color

export const COL_BLUEFIN_TUNA = {
  id: 'bluefin_tuna',
  name: '黑鮪魚',
  collectibleId: 1,
  colorHex: DARK_BLUE,

  buildGeometry(rng) {
    const parts = [];

    // --- Main body (simplified: 2 sections) ---
    parts.push(sph(0.6, DARK_BLUE, { ws: 6, hs: 4, sx: 0.9, sy: 0.8, sz: 2.0, z: 0.2, hex2: SILVER }));
    // Tail section
    parts.push(sph(0.3, DARK_BLUE, { ws: 5, hs: 3, sx: 0.6, sy: 0.55, sz: 1.0, z: -1.3 }));

    // --- Snout ---
    parts.push(cone(0.2, 0.45, 5, FIN_DARK, { z: 1.5, rx: HALF_PI }));

    // --- Dorsal fin ---
    parts.push(box(0.04, 0.4, 0.3, FIN_DARK, { y: 0.55, z: 0.1 }));

    // --- Pectoral fins ---
    parts.push(box(0.4, 0.04, 0.2, FIN_DARK, { x: 0.45, y: -0.1, z: 0.5, rz: -0.25 }));
    parts.push(box(0.4, 0.04, 0.2, FIN_DARK, { x: -0.45, y: -0.1, z: 0.5, rz: 0.25 }));

    // --- Tail fin ---
    parts.push(box(0.04, 0.45, 0.25, FIN_DARK, { y: 0.25, z: -1.8, rx: 0.4 }));
    parts.push(box(0.04, 0.45, 0.25, FIN_DARK, { y: -0.25, z: -1.8, rx: -0.4 }));

    return finish(parts);
  },
};

export default COL_BLUEFIN_TUNA;
