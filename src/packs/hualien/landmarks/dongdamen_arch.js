/**
 * @file packs/hualien/landmarks/dongdamen_arch.js — Roll Formosa Hualien pack.
 *
 * NM_DONGDAMEN — 東大門夜市牌樓 (Dongdamen Night Market Arch), the main entrance
 * gate to Hualien's largest night market. Features a modern illuminated archway
 * with traditional design elements, neon lighting, and the bustling food stall
 * atmosphere behind it.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Night market colors (neon-lit)
const ARCH_RED = 0xda3a2a; // vermillion red arch
const ARCH_GOLD = 0xe8b830; // gold accents
const NEON_PINK = 0xff6090; // neon pink
const NEON_CYAN = 0x40e0d0; // neon cyan
const LANTERN = 0xea5a3a; // red lanterns
const STALL = 0xe8d8b8; // stall canopy
const STEAM = 0xd0d0d0; // steam from cooking

export const NM_DONGDAMEN = {
  id: 'dongdamen_arch',
  name: '東大門夜市',
  landmarkId: 5,
  dioramaRHint: 30,
  colorHex: ARCH_RED,

  buildGeometry(rng) {
    const parts = [];

    // ---- Ground/street surface -------------------------------------------
    parts.push(box(4.0, 0.06, 3.0, 0x4a4a4a, { y: 0.03 })); // asphalt
    parts.push(box(2.5, 0.04, 2.0, 0x5a5a5a, { y: 0.02, z: -0.3 })); // market area

    // ---- Main entrance arch (modern Chinese style) ------------------------
    const archW = 2.4;
    const archH = 2.2;
    // Two main pillars
    for (const sx of [-1, 1]) {
      parts.push(box(0.25, archH, 0.25, ARCH_RED, { x: sx * archW / 2, z: 0.8, y: 0.06 + archH / 2 }));
      // Gold base ring
      parts.push(box(0.30, 0.12, 0.30, ARCH_GOLD, { x: sx * archW / 2, z: 0.8, y: 0.12 }));
      // Gold top cap
      parts.push(box(0.28, 0.10, 0.28, ARCH_GOLD, { x: sx * archW / 2, z: 0.8, y: 0.06 + archH }));
    }

    // Cross beam with sign
    parts.push(box(archW + 0.3, 0.4, 0.35, ARCH_RED, { z: 0.8, y: 0.06 + archH - 0.3 }));
    // Sign panel (東大門 implied)
    parts.push(box(1.8, 0.28, 0.05, ARCH_GOLD, { z: 0.8 + 0.18, y: 0.06 + archH - 0.3 }));

    // Roof element (simplified Chinese roof top)
    parts.push(box(archW + 0.5, 0.15, 0.5, ARCH_RED, { z: 0.8, y: 0.06 + archH + 0.15 }));
    // Upturned corners
    for (const sx of [-1, 1]) {
      parts.push(box(0.2, 0.12, 0.15, ARCH_RED, { x: sx * (archW / 2 + 0.2), z: 0.8, y: 0.06 + archH + 0.24, rz: sx * 0.3 }));
    }

    // ---- Neon lighting strips --------------------------------------------
    parts.push(box(2.2, 0.04, 0.04, NEON_PINK, { z: 0.8 + 0.2, y: 0.06 + archH - 0.55 }));
    parts.push(box(2.2, 0.04, 0.04, NEON_CYAN, { z: 0.8 + 0.2, y: 0.06 + archH - 0.05 }));

    // ---- Red lanterns hanging from arch ----------------------------------
    for (const sx of [-0.6, 0, 0.6]) {
      parts.push(cyl(0.08, 0.06, 0.18, 8, LANTERN, { x: sx, z: 0.8, y: 0.06 + archH - 0.65 }));
    }

    // ---- Food stalls behind the arch -------------------------------------
    // Stall 1 (left)
    parts.push(box(0.7, 0.6, 0.5, STALL, { x: -0.8, z: -0.2, y: 0.36 }));
    parts.push(box(0.8, 0.08, 0.6, LANTERN, { x: -0.8, z: -0.2, y: 0.70 })); // red awning
    // Steam rising
    parts.push(cyl(0.05, 0.03, 0.15, 6, STEAM, { x: -0.7, z: -0.2, y: 0.75 }));

    // Stall 2 (center)
    parts.push(box(0.6, 0.55, 0.5, STALL, { x: 0.2, z: -0.3, y: 0.335 }));
    parts.push(box(0.7, 0.08, 0.6, 0xf0a030, { x: 0.2, z: -0.3, y: 0.65 })); // orange awning

    // Stall 3 (right)
    parts.push(box(0.65, 0.58, 0.5, STALL, { x: 1.0, z: -0.15, y: 0.35 }));
    parts.push(box(0.75, 0.08, 0.6, 0x40a0d0, { x: 1.0, z: -0.15, y: 0.68 })); // blue awning

    // ---- Street lamps ---------------------------------------------------
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.04, 0.04, 1.0, 6, 0x3a3a3a, { x: sx * 1.7, z: 0.5, y: 0.56 }));
      parts.push(sph(0.08, 0xf0e8d0, { ws: 6, hs: 4, x: sx * 1.7, z: 0.5, y: 1.10 })); // lamp
    }

    return finish(parts);
  },
};

export default NM_DONGDAMEN;
