/**
 * @file packs/tainan/collectibles/shilin_big_chicken.js — Roll Formosa Tainan
 * pack, COLLECTIBLE item (the rare rolled-up treats).
 *
 * 碗粿 (wa-gui / savory steamed rice pudding) — a Tainan breakfast staple: a
 * smooth grey-tan steamed rice pudding set in a small ceramic bowl, with a dark
 * braised-meat / egg-yolk centre, a drizzle of dark sauce and a small shrimp on
 * top. As a small hand-rollable collectible it reads as a low ceramic bowl filled
 * flush with pale pudding, a dark inset centre and a pink shrimp — the classic
 * 碗粿 silhouette.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere, so this is authored
 * in unit-ish space for correct PROPORTIONS: a wide low bowl, pudding filling it
 * flush, a small dark centre topping. rng only nudges the topping a hair. <= 350 tris.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

// Palette — steamed rice-pudding materials.
const BOWL = 0xeae3d4;   // pale ceramic bowl
const BOWL_D = 0xccc3ad; // bowl shadow / inner wall
const RIM = 0x9a5b3a;    // brown painted rim band
const PUDD = 0xc9b48a;   // smooth grey-tan steamed rice pudding
const PUDD_T = 0xddccaa; // glossy pudding highlight
const MEAT = 0x6b3f24;   // dark braised meat centre
const YOLK = 0xd9a52e;   // egg-yolk dab
const SAUCE = 0x4a2a16;  // dark soy-paste drizzle
const SHRIMP = 0xe08a72; // small pink shrimp

export const COL_BIGCHICKEN = {
  id: 'shilin_big_chicken',
  name: '碗粿',
  collectibleId: 11,
  colorHex: 0xc9b48a, // 灰褐 — the steamed-rice-pudding tone
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.05; // tiny non-structural jitter on the topping
    const parts = [];

    // ---- Bowl (wide low ceramic vessel) ----------------------------------
    parts.push(cyl(1.0, 0.66, 0.58, 8, BOWL, { y: -0.2, open: true, hex2: BOWL_D }));
    parts.push(cyl(0.66, 0.66, 0.08, 8, BOWL_D, { y: -0.46 }));     // base disc
    parts.push(cyl(1.0, 1.0, 0.07, 8, RIM, { y: 0.08, open: true })); // painted rim band

    // ---- Pudding (smooth, filling the bowl flush) ------------------------
    parts.push(cyl(0.92, 0.64, 0.34, 8, PUDD, { y: -0.06, hex2: PUDD_T }));
    parts.push(
      sph(0.9, PUDD, { y: 0.1, sy: 0.28, ws: 8, hs: 3, thetaLen: PI / 2, hex2: PUDD_T })
    );

    // ---- Dark braised-meat / egg-yolk centre -----------------------------
    parts.push(cyl(0.4, 0.4, 0.1, 7, MEAT, { y: 0.2, hex2: YOLK }));
    parts.push(sph(0.18, YOLK, { x: 0.06 + r, y: 0.26, ws: 6, hs: 3, sy: 0.7 })); // yolk dab

    // ---- Dark sauce drizzle over the centre ------------------------------
    for (let i = 0; i < 2; i++) {
      const a = (i / 2) * PI + r;
      parts.push(box(0.5, 0.03, 0.04, SAUCE, { rz: 0.05, ry: a, y: 0.27 }));
    }

    // ---- Small shrimp on top ---------------------------------------------
    // A short curved row of pink lumps reads as a little shrimp.
    for (let i = 0; i < 3; i++) {
      const t = i / 2;
      parts.push(
        sph(0.1 - i * 0.015, SHRIMP, {
          x: -0.28 + t * 0.22,
          z: 0.18 - t * 0.08,
          y: 0.28,
          ws: 6,
          hs: 3,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_BIGCHICKEN;
