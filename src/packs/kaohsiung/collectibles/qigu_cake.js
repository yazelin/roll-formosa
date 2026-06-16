/**
 * @file packs/kaohsiung/collectibles/qigu_cake.js — Roll Formosa Kaohsiung pack,
 * COLLECTIBLE (album item the katamari rolls up).
 *
 * COL_QIGU_CAKE — 旗鼓餅 (Qigu cake), 旗津名產. Silhouette: a round, squat
 * SHORTCRUST DISC pastry — a flat golden puck, slightly domed on top with a
 * lightly toasted crown, a flaky chamfered rim band, and a paler buttery
 * underside. The read is "round baked sweet biscuit": clearly wider than it is
 * tall, with a pressed FLOWER STAMP impressed into the top crust (a small
 * center hub + radiating petal ridges), the trait that tells a stamped Qigu
 * cake apart from a plain cracker at thumbnail size.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a low golden disc with a browned, flower-stamped crown.
 *
 * Palette: warm golden-yellow crust body (0xd8a860), a toasted amber top, and a
 * pale buttery underside. rng() only nudges the bake tone of the top crust a
 * hair and faintly rotates the petal stamp — never structure. ~250–350 tris.
 */

import { cyl, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

export const COL_QIGU_CAKE = {
  id: 'qigu_cake',
  name: '旗鼓餅',
  colorHex: 0xd8a860, // warm golden shortcrust body

  buildGeometry(rng) {
    const body = 0xd8a860; // golden crust side
    const bodyLo = 0xc8954c; // deeper gold lower on the rim
    const pale = 0xe9c98a; // pale buttery underside
    // toasted top crust — tiny per-instance bake variation (lighter↔darker)
    const bakeT = rng() < 0.5 ? 0x000000 : 0x060402;
    const crust = 0xc28a44 - bakeT; // toasted amber crown
    const crustHot = 0xa9702f - bakeT; // darker browned pressed ridges

    const R = 1.55; // disc radius
    const H = 0.62; // body height (low — wider than tall)
    const HH = H / 2;
    const stampSpin = (rng() - 0.5) * 0.5; // faint rotation of the flower stamp

    const parts = [
      // --- main golden DISC body (vertical gradient, paler base → golden) ---
      cyl(R, R * 0.98, H, 14, body, { y: HH, hex2: body }),
      // narrower over-disc implying the soft pressed-down profile
      cyl(R * 0.92, R * 0.9, H * 0.92, 12, bodyLo, { y: HH * 0.98, hex2: body }),

      // --- flaky RIM band that softens the bottom edge of the disc --------
      cyl(R + 0.04, R + 0.04, 0.16, 14, bodyLo, { y: 0.08 }),

      // --- pale buttery UNDERSIDE plate -----------------------------------
      cyl(R - 0.1, R - 0.1, 0.1, 10, pale, { y: 0.05 }),

      // --- gently DOMED toasted top crust capping the disc ----------------
      cyl(R * 0.9, R * 0.98, 0.16, 14, crust, { y: H + 0.02, hex2: crust }),
      // small raised crown center to suggest a baked dome
      cyl(R * 0.42, R * 0.66, 0.12, 10, crust, { y: H + 0.13, hex2: crust }),
    ];

    // --- pressed FLOWER STAMP on the top crust: center hub + petal ridges --
    // Center hub button.
    parts.push(cyl(0.26, 0.3, 0.1, 8, crustHot, { y: H + 0.2 }));
    // Six radiating petal ridges (thin browned bars) around the hub.
    const petals = 6;
    const ringR = 0.78; // petal mid-radius from center
    for (let i = 0; i < petals; i++) {
      const a = stampSpin + (i / petals) * PI * 2;
      parts.push(
        box(0.62, 0.06, 0.16, crustHot, {
          x: Math.cos(a) * ringR,
          z: Math.sin(a) * ringR,
          y: H + 0.17,
          ry: -a,
        }),
      );
    }

    return finish(parts);
  },
};

export default COL_QIGU_CAKE;
