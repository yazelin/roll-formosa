/**
 * @file packs/taipei/collectibles/pineapple_cake.js — Roll Formosa Taipei pack,
 * COLLECTIBLE (rare-album item the ball rolls up).
 *
 * COL_PINEAPPLE — 鳳梨酥 (pineapple cake). Silhouette: a small, squat
 * rounded-rectangle pastry BLOCK with a flat golden top that is lightly
 * BROWNED, soft chamfered vertical edges, and a slightly paler underside.
 * Reads as a hand-held bite-size pastry: wider than it is tall, the classic
 * "金磚" (gold brick) bar shape, with a faint center seam pressed into the top
 * crust and rounded corner posts so the outline never looks like a hard cube.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a low golden bar with a browned crown.
 *
 * Palette: warm golden-yellow body (baked shortcrust), a toasted amber/brown
 * top crust, and a pale buttery underside. rng() only nudges the bake tone of
 * the top crust a hair — never structure. <= 350 triangles.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

export const COL_PINEAPPLE = {
  id: 'pineapple_cake',
  name: '鳳梨酥',
  collectibleId: 5,
  colorHex: 0xe7b24e, // warm golden pastry body

  buildGeometry(rng) {
    const body = 0xe7b24e; // golden shortcrust side
    const bodyLo = 0xd99e3a; // slightly deeper gold lower on the sides
    const pale = 0xf0cd84; // pale buttery underside
    // toasted top crust — tiny per-instance bake variation (lighter↔darker)
    const bakeT = rng() < 0.5 ? 0x000000 : 0x070402;
    const crust = 0xc98a3e - bakeT; // toasted amber top
    const crustHot = 0xb87832 - bakeT; // darker browned ridges

    // Footprint of the bar (wider than deep, low height). Corner posts and an
    // edge skirt round off the box so the silhouette is a soft "gold brick".
    const HW = 1.7; // half-width  (x)
    const HD = 1.15; // half-depth  (z)
    const H = 0.74; // total body height
    const HH = H / 2; // half-height
    const r = 0.2; // corner / chamfer radius

    return finish([
      // --- main golden body: inset box with a vertical gradient -----------
      // bottom (paler/buttery) -> top (golden) so the bar reads baked.
      box(HW * 2, H, HD * 2, body, { y: HH, hex2: body }),
      // slightly narrower over-block to imply the soft pressed-down top
      box(HW * 2 - 0.12, H * 0.9, HD * 2 - 0.12, bodyLo, {
        y: HH * 0.96,
        hex2: body,
      }),

      // --- rounded corner POSTS (vertical chamfer so no hard cube edges) --
      cyl(r, r, H, 6, body, { x: HW - r, z: HD - r, y: HH, hex2: body }),
      cyl(r, r, H, 6, body, { x: -(HW - r), z: HD - r, y: HH, hex2: body }),
      cyl(r, r, H, 6, body, { x: HW - r, z: -(HD - r), y: HH, hex2: body }),
      cyl(r, r, H, 6, body, { x: -(HW - r), z: -(HD - r), y: HH, hex2: body }),

      // --- side edge skirt: a low band that softens the bottom edge -------
      box(HW * 2 - 0.16, 0.16, HD * 2 + 0.04, bodyLo, { y: 0.08 }),
      box(HW * 2 + 0.04, 0.16, HD * 2 - 0.16, bodyLo, { y: 0.08 }),

      // --- pale buttery UNDERSIDE plate -----------------------------------
      box(HW * 2 - 0.18, 0.1, HD * 2 - 0.18, pale, { y: 0.05 }),

      // --- toasted TOP CRUST: a slightly inset slab capping the body ------
      box(HW * 2 - 0.2, 0.18, HD * 2 - 0.2, crust, { y: H + 0.03, hex2: crust }),
      // rounded crust corners to echo the body posts
      cyl(r * 0.85, r * 0.85, 0.18, 6, crust, {
        x: HW - r,
        z: HD - r,
        y: H + 0.03,
      }),
      cyl(r * 0.85, r * 0.85, 0.18, 6, crust, {
        x: -(HW - r),
        z: HD - r,
        y: H + 0.03,
      }),
      cyl(r * 0.85, r * 0.85, 0.18, 6, crust, {
        x: HW - r,
        z: -(HD - r),
        y: H + 0.03,
      }),
      cyl(r * 0.85, r * 0.85, 0.18, 6, crust, {
        x: -(HW - r),
        z: -(HD - r),
        y: H + 0.03,
      }),

      // --- faint pressed center SEAM across the top crust (browned ridge) -
      box(HW * 2 - 0.5, 0.06, 0.12, crustHot, { y: H + 0.12 }),
      // two short cross ticks toward the ends for the baked "stamp" look
      box(0.12, 0.06, HD * 2 - 0.7, crustHot, { x: HW - 0.5, y: H + 0.12 }),
      box(0.12, 0.06, HD * 2 - 0.7, crustHot, { x: -(HW - 0.5), y: H + 0.12 }),
    ]);
  },
};

export default COL_PINEAPPLE;
