/**
 * @file packs/penghu/landmarks/longshan.js — Roll Formosa Penghu pack, landmark 1.
 *
 * 澎湖天后宮 (Penghu Tianhou Temple / Magong Mazu Temple) — the oldest Mazu temple
 * in Taiwan (circa 1604), located in Magong. A traditional Minnan-style temple
 * with red columns, curved swallowtail eaves (燕尾), and intricate roof
 * decorations. The temple has a characteristic wide, low silhouette with
 * multiple tiered roofs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (wide + low temple) carry the read.
 *
 * Palette: red lacquer columns + dark green/blue glazed tile roof + gold trim.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const STONE = 0xb8b0a0; // temple courtyard stone
const STONE_D = 0x9a9284; // darker stone
const RED = 0xb82828; // lacquered red columns/walls
const RED_D = 0x8e1e1e; // deeper red shadow
const GREEN = 0x1a4a3a; // dark green glazed roof tile
const GREEN_D = 0x0e3028; // darker green underside
const GOLD = 0xd4a030; // gold trim / ridge ornaments
const WHITE = 0xf0e8d8; // plastered wall sections

/**
 * Build a swallowtail roof tier (simplified).
 * @param {import('three').BufferGeometry[]} out
 * @param {number} y roof base height
 * @param {number} hw half-width
 * @param {number} hd half-depth
 * @param {number} th thickness
 * @param {number} ridgeH ridge height
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  // Main tile slab
  out.push(box(hw * 2, th * 0.6, hd * 2, GREEN, { y: y + th * 0.7, hex2: GREEN_D }));

  // Gold main ridge
  out.push(box(hw * 2 - 0.02, ridgeH * 0.5, 0.1, GOLD, { y: y + th + ridgeH * 0.7 }));

  // Simplified swallowtail corner spurs (only front two)
  const sweep = 0.5;
  const spurLen = hw * 0.65;
  for (const sx of [-1, 1]) {
    out.push(
      box(spurLen, 0.06, 0.1, GREEN, {
        rz: sx * sweep,
        x: sx * hw - sx * spurLen * 0.3,
        y: y + th * 0.5 + spurLen * 0.15,
        z: hd,
      })
    );
  }
}

export const NM_TIANHOU_TEMPLE = {
  id: 'tianhou_temple',
  name: '澎湖天后宮',
  landmarkId: 1,
  dioramaRHint: 30, // ~60 m temple complex footprint
  colorHex: RED,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02; // tiny jitter
    const parts = [];

    // ---- stone courtyard platform ----
    parts.push(box(4.0, 0.28, 2.8, STONE, { y: 0.14, hex2: STONE_D }));
    parts.push(box(3.4, 0.2, 2.2, STONE_D, { y: 0.28 }));
    parts.push(box(2.8, 0.12, 0.35, STONE, { y: 0.34, z: 1.1 })); // front steps

    // ---- main hall body ----
    const bodyY = 0.4;
    parts.push(box(2.8, 0.9, 1.9, WHITE, { y: bodyY + 0.45 }));
    parts.push(box(2.4, 0.9, 1.6, RED_D, { y: bodyY + 0.45 }));

    // Front colonnade (red columns - reduced)
    for (const cx of [-1.0, 1.0]) {
      parts.push(cyl(0.1, 0.11, 0.95, 4, RED, { x: cx, y: bodyY + 0.475, z: 0.9, hex2: RED_D }));
    }
    // Column head beam
    parts.push(box(2.9, 0.12, 0.12, RED, { y: bodyY + 0.95, z: 0.9 }));

    // ---- lower swallowtail roof ----
    swallowRoof(parts, bodyY + 1.02, 1.9, 1.35, 0.16, 0.45);

    // ---- upper hall (setback) ----
    const upperY = bodyY + 1.02 + 0.16 + 0.35;
    parts.push(box(1.7, 0.55, 1.15, RED, { y: upperY + 0.275, hex2: RED_D }));
    parts.push(box(1.8, 0.04, 1.2, GOLD, { y: upperY + 0.55 }));
    swallowRoof(parts, upperY + 0.57, 1.25, 0.88, 0.13, 0.38);

    // ---- crowning ridge ornament ----
    const topY = upperY + 0.57 + 0.13 + 0.38;
    parts.push(box(0.6, 0.1, 0.15, GOLD, { y: topY + 0.05 }));
    parts.push(cone(0.06, 0.14, 4, GOLD, { y: topY + 0.22 + j }));

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_LONGSHAN)
export const NM_LONGSHAN = NM_TIANHOU_TEMPLE;

export default NM_TIANHOU_TEMPLE;
