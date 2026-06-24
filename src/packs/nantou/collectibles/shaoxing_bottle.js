/**
 * @file packs/nantou/collectibles/shaoxing_bottle.js — Roll Formosa Nantou pack.
 *
 * 紹興酒瓶 (Shaoxing Wine Bottle) — collectibleId for nantou. The iconic
 * ceramic bottle of Puli's famous Shaoxing rice wine. Features:
 * - Traditional brown/tan ceramic bottle shape
 * - Red seal/label
 * - Cork or ceramic stopper
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

const CERAMIC = 0x8a6a50;      // tan ceramic body
const CERAMIC_DARK = 0x6a4a38; // darker ceramic
const SEAL_RED = 0xc02020;     // red seal/label
const CORK = 0xa08060;         // cork stopper
const GLAZE = 0x9a7a5a;        // glazed shine

export const COL_SHAOXING_BOTTLE = {
  id: 'shaoxing_wine',
  name: '紹興酒瓶',
  collectibleId: 9, // replaces presidential_trophy
  colorHex: 0x8a6a50,

  buildGeometry(rng) {
    const parts = [];
    const j = (rng ? rng() - 0.5 : 0) * 0.02;

    // --- Wide body (bulbous ceramic bottle) ---
    parts.push(sph(0.5, CERAMIC, { ws: 8, hs: 6, y: 0.45, sy: 0.9, hex2: GLAZE }));

    // --- Shoulder (tapers to neck) ---
    parts.push(cyl(0.35, 0.2, 0.3, 8, CERAMIC, { y: 0.95, hex2: CERAMIC_DARK }));

    // --- Neck (narrow) ---
    parts.push(cyl(0.15, 0.12, 0.35, 8, CERAMIC, { y: 1.25 + j, hex2: GLAZE }));

    // --- Lip/rim ---
    parts.push(cyl(0.16, 0.16, 0.06, 8, CERAMIC_DARK, { y: 1.46 }));

    // --- Cork stopper ---
    parts.push(cyl(0.1, 0.12, 0.12, 6, CORK, { y: 1.55 }));

    // --- Red seal (traditional label) ---
    parts.push(box(0.25, 0.2, 0.02, SEAL_RED, { y: 0.5, z: 0.48 }));

    // --- Base (flat bottom) ---
    parts.push(cyl(0.42, 0.42, 0.06, 8, CERAMIC_DARK, { y: 0.03 }));

    return finish(parts);
  },
};

export default COL_SHAOXING_BOTTLE;
