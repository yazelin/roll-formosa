/**
 * @file packs/changhua/landmarks/baguashan_skyway.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_BAGUASHAN_SKYWAY — 八卦山天空步道 (Baguashan Skywalk), a 1km elevated
 * walkway on Bagua Mountain offering panoramic views of Changhua Plain.
 * Features a winding elevated steel pathway with glass floor sections,
 * connecting various scenic spots on the mountain.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const STEEL = 0x808888;       // steel structure
const DECK = 0xc8b088;        // wooden deck
const RAILING = 0x909090;     // gray railing
const GLASS = 0x88d8f8;       // glass floor section
const FOREST = 0x308030;      // forest green

export const NM_BAGUASHAN_SKYWAY = {
  id: 'baguashan_skyway',
  name: '八卦山天空步道',
  landmarkId: 93,
  dioramaRHint: 80,
  colorHex: STEEL,

  buildGeometry(rng) {
    const parts = [];

    // Elevated walkway - curving path
    // Section 1 (straight)
    parts.push(box(0.6, 0.03, 0.18, DECK, { x: -0.55, y: 0.50 }));
    // Section 2 (angled)
    parts.push(box(0.5, 0.03, 0.18, DECK, { x: -0.10, y: 0.55, ry: 0.3 }));
    // Section 3 (glass section)
    parts.push(box(0.35, 0.02, 0.18, GLASS, { x: 0.25, y: 0.58, ry: 0.3 }));
    // Section 4 (straight)
    parts.push(box(0.5, 0.03, 0.18, DECK, { x: 0.60, y: 0.60, ry: 0.1 }));

    // Support columns
    for (const [x, y] of [[-0.75, 0.25], [-0.35, 0.275], [0.05, 0.29], [0.45, 0.30], [0.80, 0.30]]) {
      parts.push(cyl(0.04, 0.04, y * 2, 4, STEEL, { x, y }));
    }

    // Railings along the walkway
    parts.push(box(0.6, 0.06, 0.01, RAILING, { x: -0.55, y: 0.55, z: 0.09 }));
    parts.push(box(0.6, 0.06, 0.01, RAILING, { x: -0.55, y: 0.55, z: -0.09 }));
    parts.push(box(0.5, 0.06, 0.01, RAILING, { x: -0.10, y: 0.60, z: 0.09, ry: 0.3 }));
    parts.push(box(0.5, 0.06, 0.01, RAILING, { x: -0.10, y: 0.60, z: -0.09, ry: 0.3 }));
    parts.push(box(0.5, 0.06, 0.01, RAILING, { x: 0.60, y: 0.65, z: 0.09, ry: 0.1 }));
    parts.push(box(0.5, 0.06, 0.01, RAILING, { x: 0.60, y: 0.65, z: -0.09, ry: 0.1 }));

    // Forest canopy below (simplified tree tops)
    for (const [x, z] of [[-0.5, 0.3], [0.0, 0.35], [0.5, 0.30], [-0.3, -0.3], [0.3, -0.35]]) {
      parts.push(sph(0.15, FOREST, { ws: 5, hs: 3, x, y: 0.15, z }));
    }

    // Viewing platform at end
    parts.push(cyl(0.15, 0.15, 0.04, 8, DECK, { x: 0.90, y: 0.62 }));
    parts.push(cyl(0.16, 0.16, 0.06, 8, RAILING, { x: 0.90, y: 0.67, open: true }));

    return finish(parts);
  },
};

export default NM_BAGUASHAN_SKYWAY;
