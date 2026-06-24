/**
 * @file packs/penghu/collectibles/chicken_cutlet.js — Roll Formosa Penghu pack,
 * collectible 2.
 *
 * COL_BROWN_SUGAR_CAKE — 黑糖糕 (brown sugar cake). A small traditional Penghu
 * specialty: a dark, spongy steamed cake made with local brown sugar. Silhouette:
 * a short, squat rectangular slab with a glossy dark-brown surface, slightly
 * domed top from the steam rising, and a porous spongy texture visible on the
 * cut sides. Often served in thick slices. The deep molasses-brown color is
 * the unmistakable read.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * read: a low, dark, dense cake block with a slightly domed glossy top.
 *
 * Palette: deep brown sugar (molasses brown), slightly lighter caramelized top,
 * porous texture on sides. rng() is used only for tiny pore placement jitter.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const CAKE = 0x4a2a16;      // deep molasses brown sugar cake
const CAKE_TOP = 0x5c3820;  // slightly lighter caramelized top
const CAKE_DK = 0x381e0e;   // darker base / shadow
const GLOSS = 0x6b4428;     // glossy surface sheen
const PORE = 0x2e1a0a;      // dark pore holes in sponge texture

export const COL_BROWN_SUGAR_CAKE = {
  id: 'brown_sugar_cake_col',
  name: '黑糖糕',
  collectibleId: 2,
  colorHex: CAKE,

  /**
   * @param {() => number} rng Boot rng — tiny cosmetic jitter only.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];
    const j = () => (rng() - 0.5); // signed jitter in [-0.5, 0.5]

    // Cake footprint dimensions
    const W = 1.6;   // width (x)
    const D = 1.2;   // depth (z)
    const H = 0.9;   // height (y)

    // === MAIN CAKE BODY =====================================================
    // Core slab — dark brown sugar cake with gradient (darker at bottom)
    parts.push(box(W, H, D, CAKE, { y: H / 2, hex2: CAKE_TOP }));

    // === DOMED TOP (slightly raised from steam rising) ======================
    // A flattened sphere on top gives the characteristic steamed-cake dome
    parts.push(sph(0.7, CAKE_TOP, {
      ws: 8, hs: 4, sy: 0.25,
      y: H + 0.05,
      hex2: GLOSS
    }));

    // === GLOSSY TOP SURFACE =================================================
    // Thin glossy layer on top (the caramelized sugar sheen)
    parts.push(box(W - 0.1, 0.06, D - 0.1, GLOSS, { y: H + 0.08 }));

    // === ROUNDED EDGES (steamed cakes have soft corners) ====================
    // Corner cylinders to soften the rectangular shape
    const r = 0.12;
    const corners = [
      [W / 2 - r, D / 2 - r],
      [-(W / 2 - r), D / 2 - r],
      [W / 2 - r, -(D / 2 - r)],
      [-(W / 2 - r), -(D / 2 - r)],
    ];
    for (const [cx, cz] of corners) {
      parts.push(cyl(r, r, H, 6, CAKE, { x: cx, y: H / 2, z: cz, hex2: CAKE_TOP }));
    }

    // === POROUS SPONGE TEXTURE (visible on cut sides) =======================
    // Small dark holes scattered on the front and side faces
    const pores = [
      // Front face (z+)
      [-0.4, 0.3, D / 2 + 0.02],
      [0.2, 0.5, D / 2 + 0.02],
      [-0.1, 0.7, D / 2 + 0.02],
      [0.5, 0.35, D / 2 + 0.02],
      [-0.5, 0.6, D / 2 + 0.02],
      [0.3, 0.2, D / 2 + 0.02],
      // Side face (x+)
      [W / 2 + 0.02, 0.4, 0.2],
      [W / 2 + 0.02, 0.6, -0.15],
      [W / 2 + 0.02, 0.25, -0.3],
      [W / 2 + 0.02, 0.55, 0.35],
    ];
    for (const [px, py, pz] of pores) {
      const s = 0.06 + j() * 0.02;
      parts.push(sph(s, PORE, {
        ws: 4, hs: 3,
        x: px + j() * 0.05,
        y: py + j() * 0.05,
        z: pz
      }));
    }

    // === BASE SHADOW (grounding the cake) ===================================
    parts.push(box(W + 0.04, 0.06, D + 0.04, CAKE_DK, { y: 0.03 }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_CHICKEN = COL_BROWN_SUGAR_CAKE;

export default COL_BROWN_SUGAR_CAKE;
