/**
 * @file packs/chiayi/collectibles/fangkuaisu.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_FANGKUAISU — 方塊酥 (Fangkuaisu / Square Pastry). Chiayi's signature layered
 * pastry: golden-brown square-shaped flaky cookies with multiple crispy layers.
 * Usually sold in stacks or gift boxes. The read: golden square biscuit with
 * visible flaky layers on the sides.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { box, cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CRUST_TOP = 0xe8c878;   // golden top
const CRUST_MID = 0xd8b058;   // mid tone
const LAYER = 0xf0d890;       // flaky layer pale
const LAYER_DARK = 0xc8a040;  // layer shadow

export const COL_FANGKUAISU = {
  id: 'fangkuaisu',
  name: '方塊酥',
  colorHex: 0xe8c878,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Stack of 3 square pastries
    const size = 0.42;
    const h = 0.14;

    // Bottom pastry
    parts.push(box(size, h, size, CRUST_MID, { y: h / 2, hex2: CRUST_TOP }));
    // Layer lines on side
    for (let ly = 0.03; ly < h; ly += 0.035) {
      parts.push(box(size + 0.01, 0.012, 0.02, LAYER, { y: ly, z: size / 2 + 0.01 }));
      parts.push(box(0.02, 0.012, size + 0.01, LAYER, { y: ly, x: size / 2 + 0.01 }));
    }

    // Middle pastry (slightly offset for natural stack look)
    const y2 = h + 0.02;
    parts.push(box(size, h, size, CRUST_MID, { x: 0.02 + j, y: y2 + h / 2, z: -0.01, hex2: CRUST_TOP }));
    for (let ly = y2 + 0.03; ly < y2 + h; ly += 0.035) {
      parts.push(box(size + 0.01, 0.012, 0.02, LAYER, { x: 0.02, y: ly, z: size / 2 - 0.01 }));
    }

    // Top pastry (slightly rotated)
    const y3 = y2 + h + 0.02;
    parts.push(box(size, h, size, CRUST_MID, {
      x: -0.03, y: y3 + h / 2, z: 0.02, ry: 0.08, hex2: CRUST_TOP,
    }));
    // Top surface texture (light scoring pattern)
    parts.push(box(0.35, 0.015, 0.02, LAYER_DARK, { x: -0.03, y: y3 + h + 0.005, z: 0.02 }));
    parts.push(box(0.02, 0.015, 0.35, LAYER_DARK, { x: -0.03, y: y3 + h + 0.005, z: 0.02 }));

    return finish(parts);
  },
};

export default COL_FANGKUAISU;
