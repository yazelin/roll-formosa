/**
 * @file packs/keelung/landmarks/miaokou_gate.js — Roll Formosa Keelung pack.
 *
 * 廟口夜市牌樓 — The iconic entrance gate to Keelung's famous Miaokou Night Market,
 * one of Taiwan's oldest and most renowned night markets. The traditional Chinese
 * archway marks the entrance to a culinary paradise featuring 鼎邊銼, 營養三明治,
 * 天婦羅 and other Keelung specialties.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const RED = 0xc42a28;       // Traditional Chinese red
const GOLD = 0xf0b429;      // Gold trim and characters
const STONE = 0x8a8680;     // Stone pillars
const ROOF_TILE = 0x3a3e44; // Dark glazed tiles
const ROOF_EDGE = 0xd4a84a; // Gold roof edge
const LANTERN = 0xe83a28;   // Red lanterns
const WOOD = 0x5a3a24;      // Dark wood

export const NM_MIAOKOU_GATE = {
  id: 'miaokou_gate',
  name: '廟口夜市牌樓',
  landmarkId: 0,
  dioramaRHint: 11,
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // ---- Base and pillars ----
    // Four main pillars (red with gold tops)
    const pillarX = [0.9, -0.9];
    const pillarZ = [0.3, -0.3];
    for (const px of pillarX) {
      for (const pz of pillarZ) {
        parts.push(cyl(0.14, 0.16, 2.0, 8, RED, { x: px, y: 1.0, z: pz }));
        parts.push(cyl(0.18, 0.18, 0.12, 8, STONE, { x: px, y: 0.06, z: pz })); // base
        parts.push(cyl(0.16, 0.14, 0.1, 8, GOLD, { x: px, y: 2.02, z: pz })); // capital
      }
    }

    // ---- Main beam (橫樑) ----
    parts.push(box(2.4, 0.2, 0.7, RED, { y: 2.1 }));
    parts.push(box(2.5, 0.08, 0.75, GOLD, { y: 2.22 })); // gold trim on top

    // Sign board (匾額) with "廟口夜市" implied
    parts.push(box(1.4, 0.5, 0.1, GOLD, { y: 2.0, z: 0.36 }));
    parts.push(box(1.3, 0.44, 0.06, RED, { y: 2.0, z: 0.4 })); // inner panel

    // ---- Multi-tiered roof ----
    // Lower roof tier
    parts.push(box(2.8, 0.08, 1.0, ROOF_TILE, { y: 2.32 }));
    parts.push(box(2.9, 0.04, 1.1, ROOF_EDGE, { y: 2.36 }));

    // Roof slope
    for (let i = 0; i < 3; i++) {
      const w = 2.6 - i * 0.3;
      const d = 0.9 - i * 0.1;
      parts.push(box(w, 0.08, d, ROOF_TILE, { y: 2.42 + i * 0.1 }));
    }

    // Upper roof tier (smaller)
    parts.push(box(1.8, 0.06, 0.7, ROOF_TILE, { y: 2.72 }));
    parts.push(box(1.9, 0.04, 0.8, ROOF_EDGE, { y: 2.76 }));

    // Ridge
    parts.push(box(1.6, 0.12, 0.14, ROOF_TILE, { y: 2.84 }));
    parts.push(box(0.16, 0.18, 0.18, GOLD, { x: -0.84, y: 2.9 })); // ridge end
    parts.push(box(0.16, 0.18, 0.18, GOLD, { x: 0.84, y: 2.9 }));  // ridge end

    // Upturned eave corners (翹脊)
    for (const sx of [-1, 1]) {
      parts.push(box(0.3, 0.06, 0.06, ROOF_EDGE, {
        x: sx * 1.42, y: 2.4, z: 0.48,
        rz: sx * -0.4
      }));
      parts.push(box(0.3, 0.06, 0.06, ROOF_EDGE, {
        x: sx * 1.42, y: 2.4, z: -0.48,
        rz: sx * -0.4
      }));
    }

    // ---- Red lanterns ----
    for (const lx of [-0.5, 0.5]) {
      parts.push(cyl(0.08, 0.08, 0.02, 8, WOOD, { x: lx, y: 1.88, z: 0.38 })); // hanger
      parts.push(cyl(0.12, 0.14, 0.28, 8, LANTERN, { x: lx, y: 1.7, z: 0.38 })); // lantern body
      parts.push(cyl(0.06, 0.06, 0.04, 8, GOLD, { x: lx, y: 1.85, z: 0.38 })); // top cap
      parts.push(cyl(0.05, 0.05, 0.06, 8, GOLD, { x: lx, y: 1.53, z: 0.38 })); // bottom
    }

    return finish(parts);
  },
};

export default NM_MIAOKOU_GATE;
