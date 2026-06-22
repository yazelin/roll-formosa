/**
 * @file packs/hualien/collectibles/peeled_chili.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_PEELED_CHILI — 剝皮辣椒 (peeled chili). Hualien's famous preserved
 * peeled chili in a glass jar — a signature local specialty used in many
 * dishes. Features a clear jar with pale green preserved chilies visible
 * inside, with a metal lid on top.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const GLASS = 0xe8f0e8; // clear glass with green tint
const GLASS_HI = 0xf4fcf4;
const CHILI = 0x9ab070; // pale green preserved chili
const CHILI_D = 0x7a9050;
const BRINE = 0xd8e8c8; // pickling brine
const LID = 0xe8d8a0; // gold/brass lid

export const COL_PEELED_CHILI = {
  id: 'peeled_chili',
  name: '剝皮辣椒',
  collectibleId: 7,
  colorHex: 0x9ab070, // pale green chili

  buildGeometry(rng) {
    const j = (a) => (rng() - 0.5) * a;
    const parts = [];

    // --- GLASS JAR ---
    // Jar body (cylindrical)
    parts.push(cyl(0.55, 0.5, 1.3, 10, GLASS, { y: 0.65, hex2: GLASS_HI }));
    // Jar bottom
    parts.push(cyl(0.48, 0.48, 0.06, 10, GLASS, { y: 0.03 }));
    // Jar neck
    parts.push(cyl(0.42, 0.35, 0.25, 10, GLASS_HI, { y: 1.42 }));
    // Jar lip
    parts.push(cyl(0.38, 0.38, 0.08, 8, GLASS_HI, { y: 1.58 }));

    // --- BRINE filling ---
    parts.push(cyl(0.45, 0.45, 1.15, 8, BRINE, { y: 0.62 }));

    // --- CHILIES visible inside ---
    parts.push(cyl(0.08, 0.06, 0.5, 6, CHILI, { x: 0.15 + j(0.1), y: 0.6, z: 0.15, rx: 0.3 }));
    parts.push(cyl(0.07, 0.05, 0.45, 6, CHILI_D, { x: -0.12, y: 0.5, z: 0.2 + j(0.1), rx: -0.2 }));
    parts.push(cyl(0.08, 0.05, 0.4, 6, CHILI, { x: 0.08, y: 0.75, z: -0.15, rx: 0.4 }));
    parts.push(cyl(0.06, 0.05, 0.35, 6, CHILI_D, { x: -0.18, y: 0.9, z: 0.1, rx: -0.3 }));

    // --- METAL LID ---
    parts.push(cyl(0.44, 0.44, 0.2, 10, LID, { y: 1.72 }));
    parts.push(cyl(0.46, 0.44, 0.05, 8, 0xc8b878, { y: 1.64 }));

    return finish(parts);
  },
};

export default COL_PEELED_CHILI;
