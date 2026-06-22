/**
 * @file packs/keelung/landmarks/zhengbin_colorhouses.js — Roll Formosa hero landmark.
 *
 * NM_ZHENGBIN_COLORHOUSES — 正濱漁港彩色屋, THE KEELUNG GOAL MONUMENT. The iconic
 * row of waterfront houses painted in vibrant pastel colors — yellows, pinks,
 * blues, greens — lining the old fishing harbor. Reflected in the calm harbor
 * water, they've become Keelung's most Instagrammable landmark. Each house is
 * a narrow 2-3 story townhouse with varied roof lines and balconies.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Pastel house colors — the famous rainbow palette
const YELLOW = 0xf5d86a;
const PINK = 0xf2a3b0;
const SALMON = 0xf29a85;
const MINT = 0x8dd4b8;
const BLUE = 0x7cb8d9;
const LAVENDER = 0xb8a8d4;
const CREAM = 0xf8f0dc;
const CORAL = 0xf28c70;

// Structural colors
const ROOF_TILE = 0x6d4a3a;  // terracotta roof tiles
const ROOF_METAL = 0x687078; // corrugated metal roofs
const WINDOW = 0x3a5a6a;     // dark window frames
const BALCONY = 0xd8d0c0;    // concrete balcony
const PIER = 0x4a4a4e;       // concrete pier
const WATER = 0x4a8090;      // harbor water reflection hint

export const NM_ZHENGBIN_COLORHOUSES = {
  id: 'zhengbin_colorhouses',
  name: '正濱漁港彩色屋',
  landmarkId: 8,
  dioramaRHint: 200, // goal must be largest; actual row ~100m long, scaled for gameplay
  colorHex: YELLOW,

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Pier / waterfront base ----
    parts.push(box(4.0, 0.18, 1.4, PIER, { y: 0.09 }));
    // Water strip in front
    parts.push(box(4.2, 0.06, 0.6, WATER, { y: 0.03, z: 1.0 }));

    // ---- 2) Row of colorful houses (left to right, 7 houses) ----
    const houseColors = [YELLOW, PINK, MINT, BLUE, SALMON, LAVENDER, CORAL];
    const houseWidths = [0.52, 0.48, 0.56, 0.50, 0.54, 0.46, 0.52];
    const houseHeights = [1.8, 2.1, 1.9, 2.3, 2.0, 1.85, 2.15];
    let xPos = -1.7;

    for (let i = 0; i < 7; i++) {
      const w = houseWidths[i];
      const h = houseHeights[i];
      const c = houseColors[i];
      const x = xPos + w / 2;
      const y = 0.18 + h / 2;
      const z = 0;

      // Main house body
      parts.push(box(w, h, 0.7, c, { x, y, z }));

      // Windows (2-3 rows depending on height)
      const winRows = h > 2.0 ? 3 : 2;
      for (let r = 0; r < winRows; r++) {
        const wy = 0.18 + 0.45 + r * 0.55;
        if (wy < h) {
          // Front windows
          parts.push(box(0.12, 0.18, 0.04, WINDOW, { x: x - 0.12, y: wy, z: 0.36 }));
          parts.push(box(0.12, 0.18, 0.04, WINDOW, { x: x + 0.12, y: wy, z: 0.36 }));
        }
      }

      // Balcony on some houses
      if (i % 2 === 0 && h > 1.85) {
        parts.push(box(w * 0.8, 0.06, 0.18, BALCONY, { x, y: 0.18 + 0.9, z: 0.44 }));
        // Balcony railing (simple)
        parts.push(box(w * 0.82, 0.12, 0.02, WINDOW, { x, y: 0.18 + 1.02, z: 0.52 }));
      }

      // Roof — alternate between pitched and flat with varying styles
      const roofY = 0.18 + h;
      if (i % 3 === 0) {
        // Pitched roof (gabled)
        parts.push(box(w + 0.04, 0.08, 0.76, ROOF_TILE, { x, y: roofY + 0.04, z }));
        parts.push(box(w * 0.7, 0.2, 0.5, ROOF_TILE, { x, y: roofY + 0.14, z }));
      } else if (i % 3 === 1) {
        // Metal flat roof with slight edge
        parts.push(box(w + 0.02, 0.05, 0.74, ROOF_METAL, { x, y: roofY + 0.025, z }));
        parts.push(box(w + 0.06, 0.08, 0.08, ROOF_METAL, { x, y: roofY + 0.04, z: 0.34 }));
      } else {
        // Flat concrete roof with water tank
        parts.push(box(w + 0.02, 0.04, 0.74, BALCONY, { x, y: roofY + 0.02, z }));
        parts.push(cyl(0.08, 0.08, 0.2, 8, ROOF_METAL, { x, y: roofY + 0.12, z: -0.1 }));
      }

      xPos += w + 0.04;
    }

    // ---- 3) Mooring posts along pier ----
    for (let i = 0; i < 5; i++) {
      const px = -1.5 + i * 0.75;
      parts.push(cyl(0.05, 0.05, 0.28, 6, 0x3a3a3e, { x: px, y: 0.32, z: 0.85 }));
    }

    // ---- 4) Small fishing boats in harbor (optional detail) ----
    // Left boat
    parts.push(box(0.5, 0.12, 0.2, 0x3a6a4a, { x: -1.2, y: 0.09, z: 1.15 }));
    parts.push(box(0.08, 0.18, 0.08, 0x5a4a3a, { x: -1.1, y: 0.2, z: 1.15 })); // cabin
    // Right boat
    parts.push(box(0.45, 0.1, 0.18, 0x4a5a8a, { x: 1.0, y: 0.08, z: 1.2 }));

    return finish(parts);
  },
};

export default NM_ZHENGBIN_COLORHOUSES;
