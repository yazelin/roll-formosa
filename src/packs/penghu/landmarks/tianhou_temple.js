/**
 * @file packs/penghu/landmarks/tianhou_temple.js — Roll Formosa Penghu pack, landmark 1.
 *
 * NM_TIANHOU — 澎湖天后宮 (Penghu Tianhou Temple), 馬公市. Taiwan's oldest Mazu
 * temple, established in 1604. Silhouette: a traditional southern Fujian style
 * temple with sweeping swallowtail roofs, dragon ridges, and intricate ceramic
 * decorations — the spiritual heart of Penghu.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget); rng() only nudges roof tint.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — red-orange temple with traditional roof.
const ROOF = 0xc84420; // traditional red-orange roof tiles
const ROOF_D = 0xa03618; // darker roof ridge
const WALL = 0xe8dcc0; // cream temple wall
const PILLAR = 0xc43020; // red lacquered pillar
const GOLD = 0xd4a820; // gold decorations
const STONE = 0x9c9590; // stone base

export const NM_TIANHOU = {
  id: 'tianhou_temple',
  name: '澎湖天后宮',
  landmarkId: 1,
  dioramaRHint: 30, // temple complex ~60m
  colorHex: ROOF,

  buildGeometry(rng) {
    const tint = Math.floor(rng() * 0x080404);
    const roofCol = ROOF - tint;
    const parts = [];

    // ---- Stone platform base ----
    parts.push(box(2.4, 0.2, 1.8, STONE, { y: 0.1 }));

    // ---- Main hall body ----
    parts.push(box(1.8, 1.0, 1.4, WALL, { y: 0.7 }));

    // ---- Red pillars at entrance ----
    for (const sx of [-0.65, 0.65]) {
      parts.push(cyl(0.08, 0.08, 0.9, 8, PILLAR, { x: sx, y: 0.65, z: 0.72 }));
    }
    for (const sx of [-0.3, 0.3]) {
      parts.push(cyl(0.06, 0.06, 0.9, 6, PILLAR, { x: sx, y: 0.65, z: 0.72 }));
    }

    // ---- Main swallowtail roof ----
    // Central ridge
    parts.push(box(1.9, 0.15, 0.12, ROOF_D, { y: 1.65 }));
    // Roof slopes (simplified as angled boxes)
    parts.push(box(2.2, 0.08, 1.0, roofCol, { y: 1.4, rz: 0.15, z: 0.3, hex2: ROOF_D }));
    parts.push(box(2.2, 0.08, 1.0, roofCol, { y: 1.4, rz: -0.15, z: -0.3, hex2: ROOF_D }));
    // Eave overhang
    parts.push(box(2.4, 0.06, 1.7, roofCol, { y: 1.25, hex2: ROOF_D }));

    // ---- Swallowtail ridge ends ----
    for (const sx of [-1, 1]) {
      // Upturned roof corners (翹角)
      parts.push(box(0.25, 0.06, 0.06, ROOF_D, { x: sx * 1.1, y: 1.72, rz: sx * 0.4, ry: sx * 0.3 }));
      parts.push(box(0.2, 0.05, 0.05, GOLD, { x: sx * 1.2, y: 1.78, rz: sx * 0.5, ry: sx * 0.3 }));
    }

    // ---- Front entrance gate decoration ----
    parts.push(box(0.5, 0.8, 0.1, 0x8a3020, { y: 0.6, z: 0.75 })); // door
    parts.push(box(0.6, 0.1, 0.12, GOLD, { y: 1.05, z: 0.76 })); // lintel decoration

    // ---- Dragon ridge decorations (simplified) ----
    parts.push(box(0.15, 0.2, 0.1, GOLD, { x: -0.85, y: 1.75 }));
    parts.push(box(0.15, 0.2, 0.1, GOLD, { x: 0.85, y: 1.75 }));

    // ---- Incense burner in courtyard ----
    parts.push(cyl(0.12, 0.1, 0.25, 8, 0x5a4a3a, { z: 1.1, y: 0.22 }));

    return finish(parts);
  },
};

export default NM_TIANHOU;
