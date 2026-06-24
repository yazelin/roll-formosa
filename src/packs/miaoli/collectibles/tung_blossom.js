/**
 * @file packs/miaoli/collectibles/tung_blossom.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_TUNG_BLOSSOM — 桐花 (oil-paper tung tree blossom). Silhouette: a delicate
 * white five-petaled flower with a pink/red center and yellow stamens. Tung
 * blossoms are iconic to the Hakka regions of Miaoli, blooming in April-May
 * and covering the hillsides in "May snow" (五月雪). Reads unmistakably as
 * "white flower" at thumbnail size: five white rounded petals in a star.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * petal tint, never structure.
 */

import { sph, cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — white petals, pink center, yellow stamens. */
const PETAL = 0xfaf8f5; // pure white petal
const PETAL_HI = 0xffffff; // bright white highlight
const PETAL_BASE = 0xf0e8e0; // slightly cream at petal base
const CENTER = 0xd85070; // pink-red center
const CENTER_HI = 0xe86080; // lighter pink
const STAMEN = 0xf0d040; // yellow stamens
const STAMEN_TIP = 0xffa020; // orange pollen tips

export const COL_TUNG_BLOSSOM = {
  id: 'tung_blossom',
  name: '桐花',
  colorHex: 0xfaf8f5, // white petal — the body read color

  /**
   * Build the tung blossom geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (petal tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201); // tiny per-instance petal tint
    const petal = PETAL - t;
    const parts = [];

    // --- PETALS: five rounded white petals arranged in a star ---
    const petalN = 5;
    for (let i = 0; i < petalN; i++) {
      const ang = (i / petalN) * PI * 2;
      const px = Math.cos(ang) * 0.65;
      const pz = Math.sin(ang) * 0.65;
      // Each petal is an elongated flattened sphere
      parts.push(sph(0.45, petal, {
        ws: 5,
        hs: 3,
        sx: 0.7,
        sy: 0.15,
        sz: 1.0,
        ry: -ang,
        x: px,
        y: 0.0,
        z: pz,
        hex2: PETAL_HI,
      }));
    }

    // --- CENTER: pink-red flower center (ovary) ---
    parts.push(sph(0.25, CENTER, { ws: 6, hs: 4, sy: 0.6, y: 0.08, hex2: CENTER_HI }));
    // Textured center with small bumps
    parts.push(cyl(0.18, 0.18, 0.1, 6, CENTER_HI, { y: 0.12 }));

    // --- STAMENS: yellow filaments radiating from center (reduced to 5) ---
    const stamenN = 5;
    for (let i = 0; i < stamenN; i++) {
      const ang = (i / stamenN) * PI * 2 + 0.2;
      const sx = Math.cos(ang) * 0.22;
      const sz = Math.sin(ang) * 0.22;
      // Thin yellow stamen filament
      parts.push(cyl(0.03, 0.02, 0.3, 4, STAMEN, {
        x: sx,
        y: 0.25,
        z: sz,
        rz: Math.sin(ang) * 0.3,
        rx: -Math.cos(ang) * 0.3,
      }));
      // Orange pollen tip (anther)
      parts.push(sph(0.05, STAMEN_TIP, {
        ws: 3,
        hs: 2,
        x: sx + Math.cos(ang) * 0.08,
        y: 0.42,
        z: sz + Math.sin(ang) * 0.08,
      }));
    }

    return finish(parts);
  },
};

export default COL_TUNG_BLOSSOM;
