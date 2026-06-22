/**
 * @file packs/tainan/landmarks/national_theater.js — Roll Formosa Tainan pack.
 *
 * 河樂廣場 (The Spring) — a modern urban lagoon park built where the old 中國城
 * mall was demolished, leaving a shallow rectangular water plaza ringed by
 * stepped concrete terraces. Silhouette: a large low rectangular pool of teal
 * water, stepped concrete terraces / planters around it, a few white pergola
 * arches on slim columns, and small green trees dotting the terraces.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so the broad flat water + low stepped terraces carry the
 * read. rng() is hair-fine tree placement jitter only. Hero budget: <= 600 tris.
 */

import { box, cyl, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const WATER = 0x4a8a9a; // shallow lagoon water (hero color)
const WATER_HI = 0x6fb0bd; // sunlit ripple
const CONC = 0xc6c1b4; // concrete terrace
const CONC_L = 0xd6d2c6; // sunlit concrete tread
const CONC_D = 0xa6a294; // shadowed step riser
const PERGOLA = 0xeae6dc; // white pergola arch / column
const TRUNK = 0x6f5436; // small tree trunk
const LEAF = 0x6a9a4a; // tree foliage
const LEAF_D = 0x4d7a35; // shaded foliage

export const NM_THEATER = {
  id: 'national_theater',
  name: '河樂廣場',
  landmarkId: 9,
  dioramaRHint: 50,
  colorHex: WATER,

  buildGeometry(rng) {
    const parts = [];

    const baseY = -0.5;

    // === STEPPED CONCRETE TERRACES forming a sunken basin ===================
    // Three concentric rectangular rings stepping DOWN toward the central pool.
    const rings = [
      { w: 5.4, d: 4.2, y: baseY + 0.5, t: 0.22 },
      { w: 4.4, d: 3.3, y: baseY + 0.32, t: 0.2 },
      { w: 3.5, d: 2.6, y: baseY + 0.16, t: 0.18 },
    ];
    for (const r of rings) {
      // Top tread.
      parts.push(box(r.w, r.t, r.d, CONC, { y: r.y, hex2: CONC_L }));
      // Riser shadow band just below.
      parts.push(box(r.w + 0.02, 0.08, r.d + 0.02, CONC_D, { y: r.y - r.t / 2 - 0.04 }));
    }

    // === CENTRAL SHALLOW POOL OF WATER ======================================
    const poolW = 2.7, poolD = 1.9;
    const poolY = baseY + 0.06;
    parts.push(box(poolW, 0.06, poolD, WATER, { y: poolY, hex2: WATER_HI }));
    // A couple of faint ripple slabs for surface read.
    parts.push(box(poolW * 0.6, 0.02, poolD * 0.55, WATER_HI, { y: poolY + 0.04, x: 0.3, z: -0.2 }));
    // Low pool coping rim.
    parts.push(box(poolW + 0.16, 0.06, poolD + 0.16, CONC_L, { y: poolY + 0.02 }));

    // === WHITE PERGOLA ARCHES on slim columns ===============================
    // Two arches straddling one terrace edge (the park's shade structures).
    const archX = [-1.1, 0.9];
    const archZ = poolD / 2 + 0.7;
    const archY = baseY + 0.5;
    for (const ax of archX) {
      // Two columns.
      for (const sx of [-1, 1]) {
        parts.push(cyl(0.06, 0.07, 0.9, 8, PERGOLA, { x: ax + sx * 0.5, y: archY + 0.45, z: archZ }));
      }
      // Half-ring arch top (torus arc=PI sits as a rainbow over the columns).
      parts.push(torus(0.5, 0.05, 4, 12, PERGOLA, { arc: PI, x: ax, y: archY + 0.9, z: archZ, sy: 0.7 }));
    }
    // A flat pergola beam linking the two arches.
    parts.push(box(2.6, 0.06, 0.08, PERGOLA, { x: -0.1, y: archY + 1.18, z: archZ }));

    // === SMALL GREEN TREES dotting the terraces =============================
    const treeSpots = [
      { x: -2.3, z: 1.6 }, { x: 2.4, z: -1.4 }, { x: 2.2, z: 1.5 },
    ];
    for (const s of treeSpots) {
      const jx = (rng() - 0.5) * 0.2, jz = (rng() - 0.5) * 0.2;
      const tx = s.x + jx, tz = s.z + jz;
      parts.push(cyl(0.05, 0.07, 0.4, 6, TRUNK, { x: tx, y: baseY + 0.7, z: tz }));
      parts.push(ico(0.32, 0, LEAF, { x: tx, y: baseY + 1.0, z: tz, hex2: LEAF_D, sy: 1.1 }));
    }

    return finish(parts);
  },
};

export default NM_THEATER;
