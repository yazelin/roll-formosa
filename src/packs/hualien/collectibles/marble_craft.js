/**
 * @file packs/hualien/collectibles/marble_craft.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_MARBLE_CRAFT — 大理石藝品 (Taroko marble craft). A polished Hualien marble
 * vase — the iconic souvenir from Taroko National Park, featuring the
 * distinctive grey-white banded patterns of local marble. A small elegant
 * vase with a narrow neck and flared lip.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const MARBLE_W = 0xe8e4e0; // white marble
const MARBLE_G = 0xa8b0a8; // grey-green band
const MARBLE_D = 0x8a8a80; // dark vein
const POLISH = 0xf4f2f0; // polished highlight

export const COL_MARBLE_CRAFT = {
  id: 'marble_craft',
  name: '大理石藝品',
  collectibleId: 3,
  colorHex: 0xe8e4e0, // white marble

  buildGeometry(rng) {
    const parts = [];

    // --- VASE BODY: bulbous base tapering to narrow neck ---
    // Base foot
    parts.push(cyl(0.35, 0.4, 0.15, 10, MARBLE_D, { y: 0.075 }));

    // Wide belly (main body)
    parts.push(cyl(0.55, 0.7, 0.7, 10, MARBLE_W, { y: 0.5, hex2: MARBLE_G }));

    // Belly highlight band
    parts.push(cyl(0.72, 0.72, 0.08, 10, MARBLE_G, { y: 0.75 }));

    // Upper taper
    parts.push(cyl(0.7, 0.35, 0.5, 10, MARBLE_W, { y: 1.1, hex2: POLISH }));

    // Narrow neck
    parts.push(cyl(0.3, 0.25, 0.4, 8, MARBLE_G, { y: 1.55, hex2: MARBLE_W }));

    // Flared lip
    parts.push(cyl(0.25, 0.38, 0.18, 10, MARBLE_W, { y: 1.84, hex2: POLISH }));

    // Lip rim
    parts.push(cyl(0.4, 0.38, 0.05, 10, POLISH, { y: 1.95 }));

    // --- Marble vein/band details ---
    parts.push(cyl(0.73, 0.72, 0.04, 8, MARBLE_D, { y: 0.5 }));
    parts.push(cyl(0.58, 0.58, 0.03, 8, MARBLE_G, { y: 1.0 }));

    return finish(parts);
  },
};

export default COL_MARBLE_CRAFT;
