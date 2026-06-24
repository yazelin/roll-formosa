/**
 * @file packs/penghu/landmarks/cross_sea_bridge.js — Roll Formosa Penghu pack, GOAL monument.
 *
 * NM_CROSS_SEA_BRIDGE — 澎湖跨海大橋 (Penghu Great Bridge), connecting 白沙島 and 西嶼.
 * At 2,494 meters it was the longest bridge in East Asia when completed in 1970
 * (rebuilt 1996). Silhouette: a long, arching WHITE box-girder deck supported by
 * multiple concrete piers, with a distinctive curved profile that rises toward
 * the center — the unmistakable landmark of Penghu visible from afar against
 * the sea.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so PROPORTIONS (a long curved deck, multiple piers) carry
 * the silhouette. <= 600 triangles (hero budget); rng() only nudges the deck
 * sheen so it is non-structural.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — white concrete bridge over deep blue sea.
const DECK = 0xeef0f4; // bright white deck
const DECK_D = 0xd8dce4; // cooler grey underside / shadow
const RAIL = 0xf6f8fc; // near-white barrier rail
const PIER = 0xc8ccd4; // grey concrete pier
const PIER_D = 0xa0a8b4; // darker pier base

export const NM_CROSS_SEA_BRIDGE = {
  id: 'cross_sea_bridge',
  name: '澎湖跨海大橋',
  dioramaRHint: 420, // 2.5 km long — massive scale
  colorHex: 0xe8ecf2, // pale white concrete

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x030304;
    const deckHi = DECK - tint;
    const parts = [];

    // ---- 1) Long curved deck — simplified arch profile --------
    const nSeg = 7; // reduced from 11
    const segLen = 0.72;
    const segW = 0.24;
    const archHeight = 0.28;
    const deckBaseY = 0.5;

    for (let i = 0; i < nSeg; i++) {
      const t = (i - (nSeg - 1) / 2) / ((nSeg - 1) / 2);
      const cx = (i - (nSeg - 1) / 2) * segLen * 0.95;
      const segY = deckBaseY + archHeight * (1 - t * t);

      // Main deck plate
      parts.push(box(segLen, 0.08, segW, deckHi, { x: cx, y: segY, hex2: DECK_D }));
      // One side rail (combined)
      parts.push(box(segLen, 0.06, 0.02, RAIL, { x: cx, y: segY + 0.05, z: segW * 0.48 }));
    }

    // ---- 2) Concrete piers (simplified to 4) ----------------------------
    const nPiers = 4;
    for (let i = 0; i < nPiers; i++) {
      const px = (i - (nPiers - 1) / 2) * segLen * 1.7;
      const t = px / ((nSeg - 1) / 2 * segLen * 0.95);
      const deckY = deckBaseY + archHeight * (1 - Math.min(1, t * t));
      const pierH = deckY - 0.1;
      // Main pier column
      parts.push(box(0.12, pierH, 0.14, PIER, { x: px, y: pierH / 2, hex2: PIER_D }));
    }

    // ---- 3) End abutments on both sides -----------------------------------
    const abutX = ((nSeg - 1) / 2) * segLen * 0.95 + segLen * 0.4;
    parts.push(box(0.3, 0.4, 0.32, PIER, { x: -abutX, y: 0.22, hex2: PIER_D }));
    parts.push(box(0.3, 0.4, 0.32, PIER, { x: abutX, y: 0.22, hex2: PIER_D }));

    return finish(parts);
  },
};

export default NM_CROSS_SEA_BRIDGE;
