/**
 * @file packs/penghu/landmarks/beimen.js — Roll Formosa Penghu pack, landmark 0.
 *
 * 雙心石滬 (Double-Heart Stone Weir) — the iconic twin-heart-shaped stone fish
 * trap at Qimei Island, Penghu. Two interlocking heart-shaped coral stone walls
 * sitting in shallow tidal waters, the most photographed landmark of Penghu.
 * The structure is LOW and WIDE — a tidal flat formation, not a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (wide + low hearts) carry the read.
 *
 * Palette: grey-brown coral stone walls + blue-green tidal water + white foam.
 */

import { box, cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const STONE = 0x8a7d6f; // weathered coral stone (main walls)
const STONE_D = 0x6e6358; // darker stone (underwater portion)
const STONE_L = 0xa09183; // sunlit stone top
const WATER = 0x4a9eb8; // tidal pool blue-green
const WATER_D = 0x3a7e98; // deeper water
const FOAM = 0xe8f0f2; // white foam / wave edge
const SAND = 0xd4c8b0; // sandy base

/**
 * Build one heart-shaped stone wall loop using torus arcs.
 * @param {import('three').BufferGeometry[]} out
 * @param {number} cx center X
 * @param {number} cz center Z
 * @param {number} scale size multiplier
 * @param {number} rot rotation around Y
 */
function heartWall(out, cx, cz, scale, rot) {
  const s = scale;
  const wallH = 0.18 * s;
  const wallW = 0.12 * s;

  // Heart shape: two curved arcs meeting at a point (reduced segments)
  // Left arc of heart
  out.push(
    torus(0.5 * s, wallW, 3, 6, STONE, {
      arc: PI * 0.75,
      rx: HALF_PI,
      ry: rot + PI * 0.2,
      x: cx - 0.35 * s,
      y: wallH / 2,
      z: cz + 0.1 * s,
      hex2: STONE_L,
    })
  );
  // Right arc of heart
  out.push(
    torus(0.5 * s, wallW, 3, 6, STONE, {
      arc: PI * 0.75,
      rx: HALF_PI,
      ry: rot - PI * 0.2 + PI,
      x: cx + 0.35 * s,
      y: wallH / 2,
      z: cz + 0.1 * s,
      hex2: STONE_L,
    })
  );
  // Bottom point connector
  out.push(
    box(0.3 * s, wallH, wallW * 2, STONE, {
      ry: rot,
      x: cx,
      y: wallH / 2,
      z: cz - 0.45 * s,
      hex2: STONE_L,
    })
  );
}

export const NM_DOUBLE_HEART = {
  id: 'double_heart',
  name: '雙心石滬',
  landmarkId: 0,
  dioramaRHint: 25, // ~50 m wide stone weir formation
  colorHex: STONE,

  buildGeometry(rng) {
    const parts = [];

    // ---- tidal flat base (water + sandy edges) ----
    parts.push(cyl(2.2, 2.4, 0.12, 8, SAND, { y: 0.06, hex2: WATER_D }));
    parts.push(cyl(2.0, 2.1, 0.08, 10, WATER, { y: 0.1, hex2: WATER_D }));

    // ---- left (front) heart ----
    heartWall(parts, -0.55, 0.3, 0.9, 0);

    // ---- right (back) heart, slightly larger and offset ----
    heartWall(parts, 0.55, -0.3, 1.0, PI * 0.05);

    // ---- connecting channel between hearts ----
    parts.push(box(0.5, 0.14, 0.15, STONE, { y: 0.07, z: 0, hex2: STONE_L }));

    // ---- scattered stones in the water (reduced) ----
    const stonePositions = [
      [-1.2, 0.5], [1.3, -0.6], [-0.8, -0.8], [0.9, 0.7],
    ];
    for (const [sx, sz] of stonePositions) {
      parts.push(
        sph(0.08, STONE_D, {
          ws: 3,
          hs: 2,
          x: sx,
          y: 0.08,
          z: sz,
          sy: 0.6,
          hex2: STONE,
        })
      );
    }

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_BEIMEN)
export const NM_BEIMEN = NM_DOUBLE_HEART;

export default NM_DOUBLE_HEART;
