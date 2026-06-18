/**
 * @file packs/taichung/landmarks/yizhong_arch.js — Roll Formosa 台中 pack.
 *
 * NM_YIZHONG_ARCH — 一中商圈 (Yizhong Street shopping-district gateway). Not a
 * solemn palace paifang but a NOISY night-market street gate: two chunky
 * pillars carrying a big illuminated horizontal SIGNBOARD beam (bright neon-
 * teal), crowned by a half-round neon ARCH and a stepped sign panel, with a
 * clutter of small saturated shop-sign boxes hung off the pillars and beam.
 * Hot-pink / cyan / yellow / red night palette so it reads as a bustling
 * 商圈 street mouth, distinct from the white-marble 自由廣場 paifang.
 *
 * Silhouette target: WIDE street gate (span > height). Built ONLY with the
 * engine geometry vocabulary (geomHelpers.js): the math is an engine red line.
 * finish() merges → recenters → normalizes to a UNIT bounding sphere (radius
 * 1), so proportions (not absolute size) carry the read. <= 600 tris.
 */

import { box, cyl, torus, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Night-market neon palette.
const PILLAR = 0x2c2f3a; // dark steel/concrete pillar body
const PILLAR_HI = 0x434757; // sunlit pillar edge
const STONE = 0x1c1e26; // base plinth shadow
const BOARD = 0x16c2c8; // main signboard ground — neon teal
const BOARD_HI = 0x4ff0f4; // signboard lit highlight
const FRAME = 0xf2f0e8; // off-white sign frame / lettering band
const NEON_PINK = 0xff3d8b; // hot-pink neon tube / arch glow
const NEON_PINK_HI = 0xff8fc0; // pink highlight
const NEON_YEL = 0xffd23d; // yellow shop-sign / lantern
const NEON_RED = 0xff4b3a; // red shop-sign / lantern
const NEON_GRN = 0x49e07a; // green shop-sign
const NEON_BLU = 0x3fa9ff; // blue shop-sign

/**
 * One small hung shop-sign panel: a thin lit face plate on a dark backing
 * frame. Reads as a protruding 招牌. Two boxes only (tri budget).
 * @param {number} x centre X
 * @param {number} y centre Y
 * @param {number} z front offset
 * @param {number} w panel width
 * @param {number} h panel height
 * @param {number} hex panel face color
 * @returns {import('three').BufferGeometry[]}
 */
function shopSign(x, y, z, w, h, hex) {
  return [
    box(w + 0.06, h + 0.06, 0.06, 0x10131a, { x, y, z: z - 0.05 }), // dark backing frame
    box(w, h, 0.12, hex, { x, y, z, hex2: 0xffffff }), // lit sign face (bottom→top toward white)
  ];
}

export const NM_YIZHONG_ARCH = {
  id: 'yizhong_arch',
  name: '一中商圈',
  landmarkId: 6,
  dioramaRHint: 10, // street-gate scale (~10 m span / ~7 m tall)
  colorHex: BOARD,

  buildGeometry(rng) {
    const r0 = rng() * 0.04; // tiny non-structural jitter on the crown
    const parts = [];

    // ---- ground / base plinths tying the two pillars (WIDE stance) ------
    parts.push(box(6.2, 0.26, 1.0, STONE, { y: 0.13 })); // long shadow base course
    for (const sx of [-1, 1]) {
      parts.push(box(1.0, 0.22, 0.95, PILLAR, { x: sx * 2.35, y: 0.37, hex2: PILLAR_HI })); // pillar footing block
    }

    // ---- two chunky pillars (square columns, flat faces to the axes) ----
    const PH = 2.8; // pillar shaft height (kept low so the gate reads wide)
    const SPAN = 2.1; // half-distance between pillar centres
    const pillarY = 0.48 + PH / 2;
    for (const sx of [-1, 1]) {
      const px = sx * SPAN;
      parts.push(cyl(0.36, 0.42, PH, 4, PILLAR, { ry: PI / 4, x: px, y: pillarY, hex2: PILLAR_HI })); // shaft
      parts.push(box(0.66, 0.16, 0.66, PILLAR_HI, { x: px, y: 0.48 + PH + 0.06 })); // pillar cap
    }

    // ---- the big illuminated SIGNBOARD beam spanning the pillars --------
    const beamY = 0.48 + PH + 0.5;
    parts.push(box(SPAN * 2 + 1.0, 0.86, 0.62, BOARD, { y: beamY, hex2: BOARD_HI })); // main neon signboard body
    parts.push(box(SPAN * 2 + 1.16, 0.16, 0.7, FRAME, { y: beamY + 0.51 })); // top frame rail
    parts.push(box(SPAN * 2 + 1.16, 0.16, 0.7, FRAME, { y: beamY - 0.51 })); // bottom frame rail
    parts.push(box(SPAN * 2 + 0.2, 0.48, 0.07, FRAME, { y: beamY, z: 0.34, hex2: 0xffffff })); // 「一中商圈」lettering plate
    // neon tube outline framing the board front (top + bottom + two ends)
    parts.push(box(SPAN * 2 + 0.7, 0.07, 0.06, NEON_PINK, { y: beamY + 0.38, z: 0.36, hex2: NEON_PINK_HI }));
    parts.push(box(SPAN * 2 + 0.7, 0.07, 0.06, NEON_PINK, { y: beamY - 0.38, z: 0.36, hex2: NEON_PINK_HI }));
    for (const sx of [-1, 1]) {
      parts.push(box(0.07, 0.82, 0.06, NEON_PINK, { x: sx * (SPAN + 0.45), y: beamY, z: 0.36, hex2: NEON_PINK_HI }));
    }

    // ---- crown: low half-round neon ARCH + stepped marquee --------------
    const archBaseY = beamY + 0.44; // sits on the beam top rail
    // Flattened half-torus arch (sy<1 → a low elliptical span) so the gate
    // reads WIDE not tall; hot-pink neon tube reaching pillar-to-pillar.
    parts.push(torus(SPAN, 0.16, 3, 16, NEON_PINK, { y: archBaseY, sy: 0.6, hex2: NEON_PINK_HI }));
    // small stepped marquee panel centred under the arch crown (a lit 牌面)
    parts.push(box(2.2, 0.5, 0.5, BOARD, { y: archBaseY + 0.36, hex2: BOARD_HI })); // marquee tier 1
    parts.push(box(1.4, 0.4, 0.46, FRAME, { y: archBaseY + 0.78 + r0, hex2: 0xffffff })); // marquee tier 2 (stepped)
    // crown finial lamp at the apex
    parts.push(sph(0.15, NEON_YEL, { ws: 6, hs: 4, y: archBaseY + 1.12, hex2: 0xfff2b0 })); // apex lamp

    // ---- clutter of small hung shop signs (the busy 商圈 read) ----------
    // two staggered down the inner face of each pillar, mixed neon colors
    const signColors = [NEON_YEL, NEON_RED, NEON_GRN, NEON_BLU];
    let ci = 0;
    for (const sx of [-1, 1]) {
      const px = sx * SPAN;
      const ys = [1.15, 2.0]; // two signs per pillar
      for (let k = 0; k < ys.length; k++) {
        const hex = signColors[ci % signColors.length];
        ci++;
        parts.push(...shopSign(px - sx * 0.42, ys[k] + (k === 1 ? r0 : 0), 0.5, 0.74 - k * 0.06, 0.46, hex));
      }
    }
    // two more signs hung off the underside of the beam (over the gate mouth)
    parts.push(...shopSign(-1.1, beamY - 0.82, 0.42, 0.86, 0.42, NEON_RED));
    parts.push(...shopSign(1.15, beamY - 0.82, 0.42, 0.86, 0.42, NEON_GRN));

    // ---- two paper-lantern orbs hung at the gate mouth (台味 accent) -----
    for (const sx of [-1, 1]) {
      parts.push(sph(0.22, NEON_RED, { ws: 6, hs: 4, x: sx * 0.6, y: beamY - 1.45, z: 0.3, hex2: 0xff8a6a })); // 紅燈籠
    }

    return finish(parts);
  },
};

export default NM_YIZHONG_ARCH;
