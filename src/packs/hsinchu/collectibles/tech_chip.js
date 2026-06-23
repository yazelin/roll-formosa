/**
 * @file packs/hsinchu/collectibles/tech_chip.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_TECH_CHIP — 晶片 (Tech Chip). Hsinchu Science Park is the heart of Taiwan's
 * semiconductor industry. Silhouette: an IC/semiconductor chip package, the
 * characteristic black square body with silver pins along the edges, representing
 * the high-tech industry that defines modern Hsinchu.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CHIP_BODY = 0x1a1a1e;   // dark chip package
const PIN = 0xc0c0c8;         // silver metal pins
const PIN_HI = 0xe0e0e8;      // pin highlight
const DIE = 0x2a3a4a;         // silicon die center
const MARK = 0x808088;        // marking text area

export const COL_TECH_CHIP = {
  id: 'tech_chip',
  name: '晶片',
  collectibleId: 4,
  colorHex: CHIP_BODY,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202);
    const body = CHIP_BODY + t;
    const parts = [];

    // --- main CHIP body (square package) ---
    parts.push(box(1.4, 0.2, 1.4, body, { y: 0.1, hex2: 0x2a2a30 }));
    // top chamfered edge
    parts.push(box(1.35, 0.05, 1.35, 0x2a2a32, { y: 0.22 }));

    // --- silicon DIE (shiny center square) ---
    parts.push(box(0.5, 0.04, 0.5, DIE, { y: 0.24, hex2: 0x3a4a5a }));
    // die pattern lines
    parts.push(box(0.45, 0.02, 0.02, 0x4a5a6a, { y: 0.26 }));
    parts.push(box(0.02, 0.02, 0.45, 0x4a5a6a, { y: 0.26 }));

    // --- orientation NOTCH (corner marking) ---
    parts.push(cyl(0.08, 0.08, 0.06, 6, MARK, { x: -0.52, y: 0.23, z: -0.52 }));

    // --- PINS along all four edges ---
    // X+ side pins
    for (let i = 0; i < 5; i++) {
      const z = -0.4 + i * 0.2;
      parts.push(box(0.18, 0.03, 0.06, PIN, { x: 0.78, y: 0.04, z, hex2: PIN_HI }));
    }
    // X- side pins
    for (let i = 0; i < 5; i++) {
      const z = -0.4 + i * 0.2;
      parts.push(box(0.18, 0.03, 0.06, PIN, { x: -0.78, y: 0.04, z, hex2: PIN_HI }));
    }
    // Z+ side pins
    for (let i = 0; i < 5; i++) {
      const x = -0.4 + i * 0.2;
      parts.push(box(0.06, 0.03, 0.18, PIN, { x, y: 0.04, z: 0.78, hex2: PIN_HI }));
    }
    // Z- side pins
    for (let i = 0; i < 5; i++) {
      const x = -0.4 + i * 0.2;
      parts.push(box(0.06, 0.03, 0.18, PIN, { x, y: 0.04, z: -0.78, hex2: PIN_HI }));
    }

    // --- company marking area (subtle rectangle) ---
    parts.push(box(0.4, 0.01, 0.15, MARK, { x: 0.3, y: 0.25, z: 0.4 }));

    return finish(parts);
  },
};

export default COL_TECH_CHIP;
