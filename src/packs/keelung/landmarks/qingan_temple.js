/**
 * @file packs/keelung/landmarks/qingan_temple.js — Roll Formosa Keelung pack.
 *
 * 慶安宮 — Qing'an Temple (Dianji Temple), the most important Mazu temple in
 * Keelung, first built in 1780 during the Qing dynasty. Located right behind
 * the famous Miaokou Night Market, it's the spiritual heart of old Keelung.
 * Features elaborate traditional architecture with swallowtail ridges.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const RED = 0xc42a28;         // Temple red
const GOLD = 0xe8c860;        // Gold decorations
const ROOF_TILE = 0x3a3e44;   // Dark glazed tiles
const ROOF_GREEN = 0x2a6a4a;  // Green glaze (common in Keelung temples)
const STONE = 0x9a9690;       // Stone base
const WOOD = 0x6a4a3a;        // Dark wood
const LANTERN = 0xe83a28;     // Red lanterns

export const NM_QINGAN_TEMPLE = {
  id: 'qingan_temple',
  name: '慶安宮',
  landmarkId: 2,
  dioramaRHint: 28,
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // ---- Stone platform base ----
    parts.push(box(2.8, 0.18, 2.0, STONE, { y: 0.09 }));
    parts.push(box(2.6, 0.1, 1.8, STONE, { y: 0.23, hex2: 0xa8a4a0 }));

    // ---- Main hall body ----
    parts.push(box(2.2, 1.2, 1.5, RED, { y: 0.88 }));

    // ---- Colonnade (front pillars) ----
    for (const px of [-0.8, -0.4, 0.4, 0.8]) {
      parts.push(cyl(0.08, 0.08, 1.1, 6, RED, { x: px, y: 0.83, z: 0.8 }));
      parts.push(cyl(0.1, 0.1, 0.08, 6, STONE, { x: px, y: 0.32, z: 0.8 })); // base
    }

    // ---- Entrance doors ----
    parts.push(box(0.4, 0.8, 0.08, WOOD, { x: -0.3, y: 0.68, z: 0.78 }));
    parts.push(box(0.4, 0.8, 0.08, WOOD, { x: 0.3, y: 0.68, z: 0.78 }));

    // ---- Decorated beam (彩繪樑) ----
    parts.push(box(2.0, 0.14, 0.12, GOLD, { y: 1.4, z: 0.75 }));

    // ---- Main swallowtail roof ----
    // Lower eave
    parts.push(box(2.6, 0.08, 1.8, ROOF_TILE, { y: 1.52 }));
    parts.push(box(2.7, 0.04, 1.9, GOLD, { y: 1.56 })); // edge trim

    // Roof slope
    parts.push(box(2.4, 0.1, 1.6, ROOF_GREEN, { y: 1.64 }));
    parts.push(box(2.1, 0.12, 1.3, ROOF_GREEN, { y: 1.74 }));
    parts.push(box(1.8, 0.14, 1.0, ROOF_GREEN, { y: 1.86 }));

    // Main ridge
    parts.push(box(1.6, 0.16, 0.2, ROOF_TILE, { y: 1.98 }));

    // ---- Swallowtail ridge ends (燕尾脊) ----
    for (const sx of [-1, 1]) {
      // Upturned corner eaves
      for (const sz of [-1, 1]) {
        parts.push(box(0.3, 0.06, 0.06, GOLD, {
          x: sx * 1.3, y: 1.6, z: sz * 0.9,
          rz: sx * -0.45, ry: sx * sz * 0.4
        }));
      }
      // Swallowtail points
      parts.push(box(0.35, 0.08, 0.12, ROOF_TILE, {
        x: sx * 0.95, y: 2.08, rz: sx * 0.5
      }));
    }

    // ---- Dragon ridge ornaments (龍飾) ----
    parts.push(box(0.2, 0.25, 0.15, GOLD, { x: -0.6, y: 2.1 }));
    parts.push(box(0.2, 0.25, 0.15, GOLD, { x: 0.6, y: 2.1 }));

    // ---- Pagoda finial (宝顶) ----
    parts.push(cyl(0.1, 0.12, 0.2, 6, GOLD, { y: 2.18 }));
    parts.push(cone(0.08, 0.15, 6, GOLD, { y: 2.35 }));

    // ---- Red lanterns ----
    for (const lx of [-0.6, 0.6]) {
      parts.push(cyl(0.08, 0.1, 0.2, 6, LANTERN, { x: lx, y: 1.25, z: 0.82 }));
      parts.push(cyl(0.04, 0.04, 0.04, 6, GOLD, { x: lx, y: 1.37, z: 0.82 }));
    }

    // ---- Incense burner in front ----
    parts.push(cyl(0.15, 0.12, 0.25, 6, 0x8a6a4a, { y: 0.4, z: 1.0 }));

    return finish(parts);
  },
};

export default NM_QINGAN_TEMPLE;
