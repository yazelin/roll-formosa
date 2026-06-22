/**
 * @file packs/tainan/landmarks/ximen.js — Roll Formosa Tainan pack, landmark 2.
 *
 * 臺南孔子廟 (Tainan Confucius Temple), 全臺首學 — the first place of learning in
 * Taiwan. Silhouette: a long, low RED-walled temple hall (大成殿) crowned by a
 * wide double-tier hip-and-gable tiled roof (重簷) whose eaves sweep up into
 * swallowtail (燕尾) points, fronted by a low red boundary wall. Wide and low,
 * the signature 首學-red wall under a dark glazed roof — never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read. rng() only nudges
 * ridge jitter, never structure.
 *
 * Palette: 首學 warm ochre-red walls, red columns, dark grey glazed tile roof.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const RED = 0xc0392b; // 首學 ochre-red wall
const RED_D = 0x982a20; // deeper red shadow side
const RED_L = 0xd4503e; // sunlit red
const OCHRE = 0xcaa066; // plaster band / steps
const OCHRE_L = 0xddb47e; // sunlit ochre
const ROOF = 0x40464a; // dark grey glazed tile
const ROOF_D = 0x30363a; // eave underside / shadow
const RIDGE = 0x525a5e; // ridge tile
const GOLD = 0xc7a24a; // small swallowtail tip / ridge finial

/** Four upturned swallowtail corner spurs (燕尾) at half-spans hx/hz around y. */
function _spurs(out, y, hx, hz, len) {
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      out.push(
        box(len, 0.08, 0.1, ROOF, {
          rz: sx * 0.55,
          ry: sx * sz * 0.45,
          x: sx * hx,
          y,
          z: sz * hz,
          hex2: GOLD,
        })
      );
    }
  }
}

export const NM_XIMEN = {
  id: 'ximen_redhouse',
  name: '臺南孔廟',
  landmarkId: 2,
  dioramaRHint: 24, // long temple hall footprint radius (m)
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // === LOW RED BOUNDARY WALL (front, +Z) ==================================
    // The low red 宮牆 in front of the hall.
    parts.push(box(7.2, 0.7, 0.3, RED, { y: 0.35, z: 3.0, hex2: RED_L }));
    parts.push(box(7.4, 0.16, 0.42, ROOF, { y: 0.78, z: 3.0, hex2: RIDGE })); // little tiled wall cap
    parts.push(box(1.0, 0.96, 0.34, RED_D, { y: 0.48, z: 3.0 })); // gateway opening frame

    // === STONE PLINTH + STEPS ===============================================
    parts.push(box(6.4, 0.34, 3.2, OCHRE, { y: 0.17, hex2: OCHRE_L })); // plinth
    parts.push(box(2.4, 0.18, 0.6, OCHRE_L, { y: 0.27, z: 1.7 })); // front entry steps

    // === LONG RED HALL BODY (大成殿) =========================================
    // Wide, low hall: red columns down the front, red walls behind.
    parts.push(box(5.8, 1.5, 2.6, RED, { y: 1.1, hex2: RED_L })); // wall mass
    parts.push(box(5.5, 0.14, 2.4, RED_D, { y: 0.55 })); // recessed string course
    // Front colonnade of red columns.
    for (let i = -2; i <= 2; i++) {
      parts.push(cyl(0.13, 0.15, 1.4, 8, RED_L, { x: i * 1.2, y: 1.05, z: 1.28, hex2: RED }));
    }
    parts.push(box(5.3, 0.2, 0.18, RED_D, { y: 1.78, z: 1.32 })); // architrave beam over columns
    // Central doorway.
    parts.push(box(1.1, 1.1, 0.2, RED_D, { y: 0.78, z: 1.3 }));

    // === DOUBLE-TIER HIP-AND-GABLE ROOF (重簷) ===============================
    // Lower (large) eave tier.
    const r1y = 1.9;
    parts.push(box(7.0, 0.1, 3.4, ROOF_D, { y: r1y })); // eave underside (deep overhang)
    parts.push(box(6.9, 0.16, 3.3, ROOF, { y: r1y + 0.12, hex2: RIDGE })); // eave course
    parts.push(cone(3.0, 0.5, 4, ROOF, { ry: PI / 4, y: r1y + 0.42, sx: 1.55, sz: 0.78, hex2: RIDGE })); // hip slope (long)
    _spurs(parts, r1y + 0.06, 3.45, 1.65, 0.46);

    // Upper (smaller) eave tier — the 重簷 second roof.
    const r2y = 2.6;
    parts.push(box(5.6, 0.14, 2.5, ROOF, { y: r2y, hex2: RIDGE })); // upper eave course
    parts.push(box(5.5, 0.06, 2.4, ROOF_D, { y: r2y - 0.07 })); // underside
    parts.push(cone(2.5, 0.56, 4, ROOF, { ry: PI / 4, y: r2y + 0.42, sx: 1.5, sz: 0.78, hex2: RIDGE })); // upper hip
    _spurs(parts, r2y + 0.04, 2.75, 1.25, 0.4);

    // Main ridge running the long axis + swallowtail end ornaments.
    const j = (rng() - 0.5) * 0.02;
    parts.push(box(4.6, 0.13, 0.16, RIDGE, { y: r2y + 0.72 + j, hex2: GOLD }));
    for (const sx of [-1, 1]) {
      // upturned swallowtail forks at the ridge ends
      parts.push(box(0.5, 0.1, 0.12, GOLD, { x: sx * 2.4, y: r2y + 0.84, rz: sx * 0.6 }));
    }

    return finish(parts);
  },
};

export default NM_XIMEN;
