/**
 * @file packs/penghu/landmarks/ximen.js — Roll Formosa Penghu pack, landmark 2.
 *
 * 大菓葉玄武岩 (Daguoye Basalt Columns) — spectacular columnar basalt formations
 * on Xiyu Island, Penghu. Natural hexagonal basalt pillars formed by volcanic
 * cooling, standing in dramatic vertical columns against the cliff face. One of
 * Penghu's most impressive geological features.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1).
 *
 * Palette: dark grey-brown basalt + vegetation green on top + cliff rock base.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const BASALT = 0x4a4540; // dark basalt column
const BASALT_L = 0x5a5550; // lighter basalt (sunlit faces)
const BASALT_D = 0x3a3530; // darker basalt (shadow)
const ROCK = 0x6a6055; // cliff rock base
const ROCK_D = 0x4a4035; // darker rock
const GREEN = 0x3a5a30; // vegetation on top
const GREEN_D = 0x2a4020; // darker vegetation
const SOIL = 0x6a5040; // exposed soil

export const NM_BASALT_PILLARS = {
  id: 'basalt_pillars',
  name: '大菓葉玄武岩',
  landmarkId: 2,
  dioramaRHint: 35, // ~70 m wide cliff formation
  colorHex: BASALT,

  buildGeometry(rng) {
    const parts = [];

    // ---- cliff base / rock foundation ----
    parts.push(box(4.5, 0.6, 2.0, ROCK_D, { y: 0.3, hex2: ROCK }));
    parts.push(box(4.2, 0.4, 1.8, ROCK, { y: 0.8, hex2: SOIL }));

    // ---- main basalt column array (hexagonal prisms) ----
    // Create a wall of vertical hexagonal columns of varying heights
    // Reduced to 10 columns for triangle budget
    const columnPositions = [
      // Front row
      { x: -1.6, z: 0.5, h: 2.4 }, { x: -0.8, z: 0.5, h: 2.8 },
      { x: 0.0, z: 0.48, h: 3.1 }, { x: 0.8, z: 0.5, h: 2.7 },
      { x: 1.6, z: 0.5, h: 2.3 },
      // Back row (taller, visible behind)
      { x: -1.2, z: -0.2, h: 3.2 }, { x: -0.4, z: -0.15, h: 3.5 },
      { x: 0.4, z: -0.15, h: 3.4 }, { x: 1.2, z: -0.2, h: 3.0 },
      // Center back
      { x: 0.0, z: -0.7, h: 3.6 },
    ];

    for (const col of columnPositions) {
      const heightVar = 1 + (rng() - 0.5) * 0.15;
      const h = col.h * heightVar;
      const r = 0.22;

      // Hexagonal column (6-sided cylinder)
      parts.push(
        cyl(r, r * 0.98, h, 6, BASALT_D, {
          x: col.x,
          y: 0.9 + h / 2,
          z: col.z,
          hex2: BASALT_L,
        })
      );
    }

    // ---- vegetation on top of cliff ----
    parts.push(box(4.0, 0.25, 1.2, GREEN_D, { y: 4.2, z: -0.8, hex2: GREEN }));
    // Scattered bushes/grass clumps (reduced)
    for (let i = 0; i < 3; i++) {
      const bx = -1.2 + i * 1.2;
      parts.push(
        sph(0.25, GREEN_D, {
          ws: 4, hs: 2,
          x: bx, y: 4.3, z: -0.7,
          sy: 0.5,
          hex2: GREEN,
        })
      );
    }

    // ---- fallen rock debris at base (reduced) ----
    for (let i = 0; i < 4; i++) {
      const rx = -1.5 + i * 1.0;
      parts.push(
        sph(0.12, ROCK_D, {
          ws: 3, hs: 2,
          x: rx, y: 0.15, z: 0.9,
          sy: 0.6,
          hex2: ROCK,
        })
      );
    }

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_XIMEN)
export const NM_XIMEN = NM_BASALT_PILLARS;

export default NM_BASALT_PILLARS;
