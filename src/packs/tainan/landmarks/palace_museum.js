/**
 * @file packs/tainan/landmarks/palace_museum.js — Roll Formosa Tainan pack.
 *
 * 七股鹽山 (Qigu Salt Mountain) — the famous man-made white mountain of salt left
 * on the 七股 salt fields. Silhouette: ONE big, tall, pure-white slightly lumpy
 * cone of salt rising from a flat pale salt-field base, with a tiny dark
 * staircase zig-zagging up one side and a small sign at the foot. Mostly one
 * dominant white cone — kept deliberately simple.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so the single white cone owns the read. rng() is used only
 * for hair-fine lump jitter — never structure. Hero model budget: <= 600 tris.
 */

import { box, cone, finish } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const SALT = 0xf0f2f4; // pure white salt (hero color)
const SALT_SH = 0xd7dde2; // faint cool shadow on the salt slopes
const SALT_HI = 0xfbfdff; // sunlit crest
const FIELD = 0xdfe4e6; // pale salt-field pan
const FIELD_D = 0xc4cccf; // dike / shadowed pan edge
const STAIR = 0x6d7378; // dark metal staircase
const SIGN = 0x9c5a36; // small wooden sign post
const SIGN_BD = 0xe6ddc8; // sign board

export const NM_PALACE = {
  id: 'palace_museum',
  name: '七股鹽山',
  landmarkId: 9,
  dioramaRHint: 60,
  colorHex: SALT,

  buildGeometry(rng) {
    const parts = [];

    const baseY = -0.6;

    // === FLAT SALT-FIELD BASE ===============================================
    // A broad shallow pale pan the mountain sits on, with a low dike rim.
    parts.push(box(5.2, 0.18, 4.0, FIELD, { y: baseY + 0.09, hex2: FIELD_D }));
    parts.push(box(5.4, 0.1, 4.2, FIELD_D, { y: baseY + 0.02 })); // dike rim
    // A couple of faint pan-division lines (thin dark strips).
    for (const sx of [-1, 1]) {
      parts.push(box(0.04, 0.04, 3.6, FIELD_D, { x: sx * 1.4, y: baseY + 0.19 }));
    }

    // === THE WHITE SALT MOUNTAIN (the hero) =================================
    // One tall white cone. A few stacked slightly-offset cones make it read as a
    // lumpy salt pile rather than a clean geometric cone.
    const mtH = 3.0;
    const mtR = 1.9;
    const mtBaseY = baseY + 0.18;
    parts.push(cone(mtR, mtH, 12, SALT, { y: mtBaseY + mtH / 2, hex2: SALT_HI }));
    // Lumpy re-skins: lower fatter skirt + an off-centre bulge near the base.
    parts.push(cone(mtR + 0.18, mtH * 0.45, 12, SALT_SH, { y: mtBaseY + mtH * 0.22, hex2: SALT }));
    const bx = (rng() - 0.5) * 0.3;
    parts.push(cone(mtR * 0.7, mtH * 0.5, 10, SALT, { x: 0.25 + bx, z: -0.2, y: mtBaseY + mtH * 0.28, hex2: SALT_HI }));
    parts.push(cone(mtR * 0.5, mtH * 0.45, 10, SALT_HI, { y: mtBaseY + mtH * 0.66, hex2: SALT }));

    // === TINY STAIRCASE up one side =========================================
    // A short zig-zag of small dark treads climbing the front-right slope.
    const nSteps = 7;
    for (let i = 0; i < nSteps; i++) {
      const t = i / (nSteps - 1);
      const sx = 0.5 + t * 0.7; // climbs from base outward-in toward the cone
      const sy = mtBaseY + 0.1 + t * (mtH * 0.7);
      const sz = mtR * 0.55 * (1 - t * 0.7); // hugs the slope, front side
      parts.push(box(0.16, 0.05, 0.12, STAIR, { x: sx, y: sy, z: sz, rz: -0.35 }));
    }
    // A thin handrail line beside the stair.
    parts.push(box(0.02, 0.02, 1.4, STAIR, { x: 0.95, y: mtBaseY + 0.9, z: 0.55, rx: 0.5, ry: 0.4 }));

    // === SMALL SIGN at the foot =============================================
    parts.push(box(0.05, 0.4, 0.05, SIGN, { x: -1.4, y: mtBaseY + 0.2, z: 1.3 }));
    parts.push(box(0.5, 0.26, 0.06, SIGN_BD, { x: -1.4, y: mtBaseY + 0.4, z: 1.3, hex2: SALT_HI }));

    return finish(parts);
  },
};

export default NM_PALACE;
