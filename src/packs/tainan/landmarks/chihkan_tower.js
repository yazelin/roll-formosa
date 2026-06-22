/**
 * @file packs/tainan/landmarks/chihkan_tower.js — Roll Formosa Tainan pack, landmark 1.
 *
 * 赤崁樓 (Chihkan Tower / Fort Provintia). The Dutch-era fort base was rebuilt
 * into a Han Chinese landmark: a tall RED-walled raised brick/stone platform
 * carrying TWO traditional pavilions side by side, each with two tiers of
 * upturned-eave glazed-tile roofs and slender red columns. The silhouette reads
 * as a red podium crowned by twin tiered pavilions — wide and low, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so temple PROPORTIONS carry the read. rng() only
 * nudges ridge jitter, never structure.
 *
 * Palette: 赤 red walls/columns, ochre plaster, dark grey-green tiled hip roofs.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const RED = 0xb23a2e; // 赤崁 red wall / column
const RED_D = 0x8c2a20; // deeper red shadow
const RED_L = 0xc85040; // sunlit red
const OCHRE = 0xc89a64; // ochre plaster band / steps
const OCHRE_L = 0xd9b07c; // sunlit ochre
const ROOF = 0x3c4a44; // dark grey-green glazed tile
const ROOF_D = 0x2c3832; // eave underside / shadow
const RIDGE = 0x4e5c54; // ridge tile (a touch lighter)
const GOLD = 0xc7a24a; // small ridge finial / spur tip

/** Four upturned corner eave spurs (翹角) at half-spans hx/hz around (cx,y). */
function _spurs(out, cx, y, hx, hz) {
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      out.push(
        box(0.36, 0.07, 0.07, ROOF, {
          rz: sx * 0.5,
          ry: sx * sz * 0.5,
          x: cx + sx * hx,
          y,
          z: sz * hz,
          hex2: GOLD,
        })
      );
    }
  }
}

/**
 * Author one two-tier upturned-eave pavilion centered at (cx, baseY) sitting
 * on the platform, pushing parts into `out`. Hip roofs are low 4-side cones
 * (ry PI/4) with box eaves and small upturned corner spurs.
 */
function _pavilion(out, cx, baseY, rng) {
  const W = 1.7; // pavilion body half-footprint-ish width scale
  const D = 1.3;

  // Red column cage (4 corner columns) + ochre wall infill.
  const colY = baseY + 0.6;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      out.push(cyl(0.12, 0.14, 1.2, 6, RED, { x: cx + sx * W * 0.5, y: colY, z: sz * D * 0.5, hex2: RED_L }));
    }
  }
  out.push(box(W * 0.92, 1.1, D * 0.84, OCHRE, { x: cx, y: colY, hex2: OCHRE_L })); // wall body
  out.push(box(W * 0.36, 0.9, 0.1, RED_D, { x: cx, y: baseY + 0.5, z: D * 0.45 })); // front doorway

  // --- Lower (larger) roof tier ---
  const r1y = baseY + 1.2;
  out.push(box(W + 0.5, 0.1, D + 0.5, ROOF_D, { x: cx, y: r1y })); // eave underside (big overhang)
  out.push(box(W + 0.42, 0.14, D + 0.42, ROOF, { x: cx, y: r1y + 0.1, hex2: RIDGE })); // eave course
  out.push(cone(W * 0.74, 0.42, 4, ROOF, { ry: PI / 4, x: cx, y: r1y + 0.34, sx: 1.18, sz: 0.9, hex2: RIDGE })); // hip slope
  _spurs(out, cx, r1y + 0.06, (W + 0.42) * 0.5, (D + 0.42) * 0.5);

  // --- Upper (smaller) roof tier ---
  const r2y = baseY + 1.78;
  out.push(box(W * 0.7, 0.12, D * 0.7, ROOF, { x: cx, y: r2y, hex2: RIDGE })); // upper eave course
  out.push(box(W * 0.66, 0.06, D * 0.66, ROOF_D, { x: cx, y: r2y - 0.06 })); // underside
  out.push(cone(W * 0.55, 0.5, 4, ROOF, { ry: PI / 4, x: cx, y: r2y + 0.36, sx: 1.16, sz: 0.9, hex2: RIDGE })); // upper hip

  // Ridge crest + gold finial.
  const j = (rng() - 0.5) * 0.02;
  out.push(box(W * 0.5, 0.1, 0.12, RIDGE, { x: cx, y: r2y + 0.66 + j, hex2: GOLD }));
  out.push(cone(0.12, 0.24, 6, GOLD, { x: cx, y: r2y + 0.84 }));
}

export const NM_CHIHKAN = {
  id: 'chihkan_tower',
  name: '赤崁樓',
  landmarkId: 1,
  dioramaRHint: 28, // raised platform + twin pavilions footprint radius (m)
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // === RAISED RED PLATFORM =================================================
    // Tall brick/stone podium with battered red walls and an ochre coping.
    parts.push(box(6.2, 0.3, 3.4, OCHRE, { y: 0.15, hex2: OCHRE_L })); // ground step
    parts.push(box(5.8, 1.5, 3.0, RED, { y: 1.05, hex2: RED_D })); // main red wall mass (vertical shade)
    parts.push(box(6.0, 0.22, 3.2, OCHRE_L, { y: 1.86 })); // coping deck (pavilions sit on this)
    // Front entrance arch into the podium.
    parts.push(box(0.9, 0.9, 0.2, RED_D, { y: 0.7, z: 1.5 }));
    parts.push(cyl(0.45, 0.45, 0.2, 8, RED_D, { rx: HALF_PI, theta0: 0, thetaLen: PI, y: 1.15, z: 1.5 }));

    // === TWIN PAVILIONS ======================================================
    const deck = 1.97;
    _pavilion(parts, -1.6, deck, rng); // left pavilion
    _pavilion(parts, 1.6, deck, rng); // right pavilion

    return finish(parts);
  },
};

export default NM_CHIHKAN;
