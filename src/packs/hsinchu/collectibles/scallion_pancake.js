/**
 * @file packs/hsinchu/collectibles/scallion_pancake.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_PANCAKE — 蔥抓餅 (Scallion Pancake). Popular Taiwanese street food found
 * throughout Hsinchu's night markets. Silhouette: a flaky, layered golden-brown
 * pancake with visible scallion bits, the characteristic crispy layers showing.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const DOUGH = 0xe8c880;       // golden fried dough
const DOUGH_HI = 0xf0d890;    // lighter crispy parts
const DOUGH_DARK = 0xc0a060;  // darker fried spots
const SCALLION = 0x4a8c3f;    // green scallion bits
const PAPER = 0xf8f4e8;       // white paper wrapper

export const COL_PANCAKE = {
  id: 'scallion_pancake',
  name: '蔥抓餅',
  collectibleId: 9,
  colorHex: DOUGH,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040402);
    const dough = DOUGH + t;
    const parts = [];

    // --- paper wrapper base (half-wrapped style) ---
    parts.push(cyl(0.75, 0.7, 0.08, 10, PAPER, { y: 0.04, hex2: 0xffffff }));
    parts.push(box(0.8, 0.04, 0.6, PAPER, { x: -0.3, y: 0.1, hex2: 0xffffff }));

    // --- main flaky PANCAKE body ---
    // base layer
    parts.push(cyl(0.7, 0.68, 0.15, 10, DOUGH_DARK, { y: 0.16, hex2: dough }));

    // flaky crispy layers (irregular, pulled apart look)
    parts.push(cyl(0.65, 0.6, 0.1, 8, dough, { y: 0.28, hex2: DOUGH_HI }));
    parts.push(cyl(0.55, 0.5, 0.08, 8, dough, { x: 0.08, y: 0.36, hex2: DOUGH_HI }));

    // crispy flaky bits sticking up
    parts.push(sph(0.15, DOUGH_HI, { ws: 5, hs: 3, sx: 1.2, sy: 0.4, x: 0.25, y: 0.4, z: 0.15 }));
    parts.push(sph(0.12, DOUGH_HI, { ws: 5, hs: 3, sx: 1.1, sy: 0.35, x: -0.2, y: 0.38, z: -0.2 }));
    parts.push(sph(0.14, dough, { ws: 5, hs: 3, sx: 1.0, sy: 0.4, x: 0.1, y: 0.42, z: -0.18 }));
    parts.push(sph(0.1, DOUGH_HI, { ws: 4, hs: 3, sx: 1.1, sy: 0.3, x: -0.3, y: 0.36, z: 0.22 }));

    // --- visible SCALLION bits ---
    parts.push(cyl(0.03, 0.03, 0.12, 4, SCALLION, { x: 0.2, y: 0.35, z: 0.08, rx: 0.3, hex2: 0x5a9c4f }));
    parts.push(cyl(0.03, 0.03, 0.1, 4, SCALLION, { x: -0.15, y: 0.32, z: 0.18, rx: -0.2, hex2: 0x5a9c4f }));
    parts.push(cyl(0.025, 0.025, 0.08, 4, SCALLION, { x: 0.05, y: 0.38, z: -0.12, rz: 0.4, hex2: 0x5a9c4f }));
    parts.push(cyl(0.03, 0.03, 0.09, 4, SCALLION, { x: -0.25, y: 0.3, z: -0.15, rx: 0.25, hex2: 0x5a9c4f }));
    parts.push(cyl(0.025, 0.025, 0.1, 4, 0x5a9c4f, { x: 0.3, y: 0.34, z: -0.05, rz: -0.3 }));

    // --- crispy edge bits ---
    parts.push(sph(0.08, DOUGH_DARK, { ws: 4, hs: 3, x: 0.55, y: 0.22, z: 0.1 }));
    parts.push(sph(0.07, DOUGH_DARK, { ws: 4, hs: 3, x: -0.5, y: 0.2, z: -0.15 }));

    return finish(parts);
  },
};

export default COL_PANCAKE;
