/**
 * @file packs/tainan/landmarks/anping_treehouse.js — Roll Formosa Tainan pack.
 *
 * 安平樹屋 (Anping Tree House) — a derelict 19th-century brick warehouse in 安平
 * that has been completely swallowed by a giant 老榕 (banyan). Roofless red-brick
 * walls stand with empty window and door openings while thick grey banyan trunks
 * climb through and over them, a big green leaf canopy domes the top, and thin
 * aerial roots drape down like curtains.
 *
 * Silhouette read: a low roofless brick box pierced by openings, a dominant
 * green foliage canopy crowning it, grey trunks and dangling aerial roots — the
 * tree clearly winning over the ruin.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1). rng() is used only for hair-fine root/leaf jitter — never
 * structure. Hero model budget: <= 600 triangles.
 */

import { box, cyl, sph, ico, finish, PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const BRICK = 0x9c4f3a; // weathered red-brick wall
const BRICK_L = 0xb56a52; // sunlit brick top course
const BRICK_D = 0x6f3527; // shadowed brick / opening reveal
const OPENING = 0x2a1c16; // dark void of a window / door opening
const TRUNK = 0x8a8377; // grey banyan trunk
const TRUNK_D = 0x6c655b; // shadowed bark
const FOLIAGE = 0x7a8b4a; // banyan canopy green (hero color)
const FOLIAGE_L = 0x96a560; // sunlit leaf clump
const FOLIAGE_D = 0x586633; // deep canopy shadow
const ROOT_C = 0x9c9486; // pale aerial root

export const NM_TREEHOUSE = {
  id: 'anping_treehouse',
  name: '安平樹屋',
  landmarkId: 12,
  dioramaRHint: 60,
  colorHex: FOLIAGE,

  buildGeometry(rng) {
    const parts = [];

    // === ROOFLESS BRICK WAREHOUSE SHELL =====================================
    // Four low walls forming an open box (no roof). Footprint ~3.4 x 2.4.
    const W = 3.4, D = 2.4, wallH = 1.5, wallT = 0.22;
    const baseY = -0.4; // ground level of the shell
    const wallMidY = baseY + wallH / 2;

    // Two long walls (±Z), two short walls (±X).
    for (const sz of [-1, 1]) {
      parts.push(box(W, wallH, wallT, BRICK, { z: sz * (D / 2), y: wallMidY, hex2: BRICK_L }));
    }
    for (const sx of [-1, 1]) {
      parts.push(box(wallT, wallH, D, BRICK, { x: sx * (W / 2), y: wallMidY, hex2: BRICK_L }));
    }
    // A ragged broken top course so the walls read as a ruin (lighter caps).
    parts.push(box(W + 0.08, 0.1, wallT + 0.05, BRICK_L, { z: (D / 2), y: baseY + wallH + 0.02 }));
    parts.push(box(W * 0.7, 0.1, wallT + 0.05, BRICK_L, { z: -(D / 2), x: -0.3, y: baseY + wallH - 0.04 }));

    // Empty openings on the long front wall (+Z): two windows + one door void.
    const frontZ = D / 2 + 0.01;
    parts.push(box(0.5, 0.5, 0.16, OPENING, { x: -1.0, y: baseY + 0.95, z: frontZ })); // window
    parts.push(box(0.5, 0.5, 0.16, OPENING, { x: 0.9, y: baseY + 0.95, z: frontZ }));  // window
    parts.push(box(0.55, 0.95, 0.16, OPENING, { x: -0.05, y: baseY + 0.5, z: frontZ })); // door
    // Opening reveals (dark brick frames) so the voids read crisp.
    parts.push(box(0.62, 0.62, 0.1, BRICK_D, { x: -1.0, y: baseY + 0.95, z: frontZ - 0.04 }));
    parts.push(box(0.62, 0.62, 0.1, BRICK_D, { x: 0.9, y: baseY + 0.95, z: frontZ - 0.04 }));
    // One window void on a short wall too.
    parts.push(box(0.16, 0.5, 0.5, OPENING, { x: W / 2 + 0.01, y: baseY + 1.0, z: -0.4 }));

    // === GREY BANYAN TRUNKS growing through / over the walls ================
    // A fat main trunk rising up one corner and flopping over the wall top.
    parts.push(cyl(0.28, 0.42, wallH + 0.7, 8, TRUNK, {
      x: -W / 2 + 0.2, z: D / 2 - 0.3, y: baseY + (wallH + 0.7) / 2, hex2: TRUNK_D,
    }));
    // A trunk leaning over the back wall, splaying outward at the top.
    parts.push(cyl(0.22, 0.3, wallH + 0.4, 8, TRUNK, {
      x: 0.8, z: -D / 2 + 0.1, y: baseY + (wallH + 0.4) / 2 + 0.1, rz: 0.18, hex2: TRUNK_D,
    }));
    // A thick root-buttress hugging the front wall (banyan creeping over brick).
    parts.push(cyl(0.16, 0.34, wallH * 0.9, 8, TRUNK_D, {
      x: 1.3, z: D / 2 - 0.05, y: baseY + wallH * 0.45, rz: -0.22,
    }));
    // A horizontal limb crossing the open top (the tree bridging the walls).
    parts.push(cyl(0.16, 0.16, W * 0.8, 6, TRUNK, {
      rz: PI / 2, y: baseY + wallH + 0.5, x: 0.1, hex2: TRUNK_D,
    }));

    // === BIG GREEN CANOPY on top ============================================
    // A cluster of foliage spheres doming over the whole shell — the hero mass.
    const canopyY = baseY + wallH + 1.0;
    parts.push(ico(1.55, 0, FOLIAGE, { y: canopyY, sy: 0.78, hex2: FOLIAGE_L }));
    parts.push(ico(1.0, 0, FOLIAGE_L, { x: -1.0, y: canopyY - 0.1, z: 0.3, hex2: FOLIAGE }));
    parts.push(ico(0.95, 0, FOLIAGE_D, { x: 1.0, y: canopyY - 0.15, z: -0.3, hex2: FOLIAGE }));
    parts.push(ico(0.7, 0, FOLIAGE_L, { x: 0.2, y: canopyY + 0.7, z: 0.2, hex2: FOLIAGE }));
    parts.push(sph(0.6, FOLIAGE, { x: -0.7, y: canopyY + 0.3, z: -0.6, ws: 7, hs: 5, hex2: FOLIAGE_L }));

    // === AERIAL ROOTS draping down (thin vertical cylinders) ================
    const nRoots = 9;
    for (let i = 0; i < nRoots; i++) {
      const ax = -1.4 + (2.8 / (nRoots - 1)) * i + (rng() - 0.5) * 0.15;
      const az = -0.9 + rng() * 1.8;
      const len = 0.7 + rng() * 0.8;
      const r = 0.018 + rng() * 0.012;
      parts.push(cyl(r, r, len, 3, ROOT_C, { x: ax, z: az, y: canopyY - 0.3 - len / 2 }));
    }

    return finish(parts);
  },
};

export default NM_TREEHOUSE;
