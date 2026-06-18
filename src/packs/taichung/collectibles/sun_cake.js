/**
 * @file packs/taichung/collectibles/sun_cake.js — Roll Formosa Taichung pack,
 * COLLECTIBLE (album item the ball rolls up).
 *
 * COL_SUN_CAKE — 太陽餅 (Taichung sun cake). Silhouette: one round, flat-ish
 * flaky pastry sitting on a small square WHITE PAPER liner. The body is a low
 * golden disc whose TOP is built from a few concentric, gently shrinking flaky
 * layers (the signature 同心圓酥層 ring-rings of the crust), doming up to a small
 * pressed center swirl. The paper liner peeks out as a pale square under the
 * round cake, so the read from a 3/4 view is unmistakably "golden flaky round
 * pastry on its paper".
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the read:
 * a wide low disc, far wider than it is tall, ringed on top. <= 350 triangles.
 *
 * Palette: warm golden flaky crust (0xd9a557 body / 0xc8923f deeper toward the
 * edge), a slightly toasted amber on the upper layers, a pale buttery underside,
 * and an off-white paper liner. rng() only nudges the bake tone of the crust a
 * hair — never structure.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// Concrete hexes — flaky golden crust, toasted upper layers, pale base, paper.
const CRUST = 0xd9a557; // warm golden flaky pastry (body read color)
const CRUST_LO = 0xc8923f; // deeper gold toward the outer rim
const CRUST_HI = 0xe6bd74; // lighter flaky highlight up the layers
const PALE = 0xe6cf96; // pale buttery underside
const PAPER = 0xf3efe2; // off-white paper liner
const PAPER_SH = 0xddd6c4; // faint shaded fold on the paper

export const COL_SUN_CAKE = {
  id: 'sun_cake',
  name: '太陽餅',
  collectibleId: 2,
  colorHex: 0xd9a557, // warm golden flaky crust — the body read color

  /**
   * Build the sun-cake geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (bake tone).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Faint per-instance bake variation so a tray of cakes isn't identical.
    const bake = rng() < 0.5 ? 0x000000 : 0x060402; // crust a hair darker
    const crust = CRUST - bake;
    const crustLo = CRUST_LO - bake;

    // --- WHITE PAPER liner: a thin square sheet under the round cake, set a
    //     touch wider so its corners peek out past the disc. A second slightly
    //     inset shaded sheet hints at the soft fold of the paper cup. ---
    parts.push(box(2.5, 0.1, 2.5, PAPER, { y: 0.05, hex2: PAPER }));
    parts.push(box(2.2, 0.08, 2.2, PAPER_SH, { y: 0.12, hex2: PAPER }));

    // --- BODY: a low golden disc, far wider than it is tall — the round cake.
    //     Vertical gradient deeper at the rim, lighter on top so it reads baked
    //     and flaky rather than a flat coin. Slight taper (rTop < rBot) gives a
    //     soft rounded edge. Kept at the highest segment count (it is the main
    //     round read). ---
    parts.push(cyl(1.75, 1.82, 0.5, 20, crustLo, { y: 0.42, hex2: crust }));

    // --- CONCENTRIC FLAKY LAYERS: a couple of gently shrinking discs stacked on
    //     the body, each raised a hair. Their stepped edges read from a 3/4 view
    //     as the sun cake's 同心圓 ring-rings of crust, doming toward the center.
    //     Segment count drops with radius to stay cheap. ---
    parts.push(cyl(1.42, 1.48, 0.22, 16, crust, { y: 0.72, hex2: CRUST_HI }));
    parts.push(cyl(1.02, 1.08, 0.2, 12, crust, { y: 0.9, hex2: CRUST_HI }));

    // --- CENTER SWIRL: a small low domed cap (rTop < rBot) pressed into the top
    //     middle — the baked center where the flaky layers spiral inward — with
    //     two short crossed ridge ticks stamped over it for the swirl mark. ---
    parts.push(cyl(0.36, 0.66, 0.26, 10, CRUST_HI, { y: 1.05, hex2: CRUST_HI }));
    parts.push(box(0.6, 0.06, 0.1, crustLo, { y: 1.2 }));
    parts.push(box(0.1, 0.06, 0.6, crustLo, { y: 1.2 }));

    // --- PALE UNDERSIDE plate: a slightly inset buttery disc tucked under the
    //     body so the bottom edge reads soft and pale, not raw. ---
    parts.push(cyl(1.6, 1.6, 0.1, 10, PALE, { y: 0.22, hex2: PALE }));

    return finish(parts);
  },
};

export default COL_SUN_CAKE;
