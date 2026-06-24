/**
 * @file packs/nantou/landmarks/cien_pagoda.js — Roll Formosa Nantou pack, GOAL LANDMARK.
 *
 * NM_CIEN_PAGODA — 慈恩塔 (Ci-En Pagoda), THE GOAL MONUMENT for Nantou.
 * A nine-story octagonal pagoda at Sun Moon Lake, ~46 m tall, featuring:
 * - Classical Chinese octagonal pagoda silhouette with upturned eaves
 * - Nine tiers of stacked eaves tapering toward the top
 * - Red/brown body with golden trim and green glazed roof tiles
 * - A viewing platform at the top overlooking the lake
 *
 * Built by Chiang Kai-shek in 1971 to commemorate his mother.
 * Located on Shabalan Mountain, overlooking 日月潭 (Sun Moon Lake).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1). Hero budget: <= 600 triangles.
 */

import { cyl, box, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — traditional Chinese pagoda colors
const BODY_RED = 0xa03020;      // vermillion red pagoda body
const BODY_DARK = 0x6a2018;     // darker red accent
const ROOF_GREEN = 0x2a5a3a;    // green glazed roof tiles
const ROOF_DARK = 0x1a3a28;     // darker green eave edge
const GOLD = 0xc9a040;          // golden trim/finial
const GOLD_HI = 0xe8c060;       // gold highlight
const BASE = 0x5a5a5a;          // stone base
const WINDOW = 0x2a1818;        // dark window openings

export const NM_CIEN_PAGODA = {
  id: 'cien_pagoda',
  name: '慈恩塔',
  landmarkId: 8,
  dioramaRHint: 46, // 慈恩塔 ~46 m tall
  colorHex: BODY_RED,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.006;
    const parts = [];

    /* ---- 1) Stone platform ---- */
    parts.push(cyl(1.3, 1.4, 0.12, 6, BASE, { y: 0.06 }));

    /* ---- 2) Nine-tier pagoda body (simplified: body + eave only) ---- */
    const tiers = 9;
    const baseY = 0.18;
    const baseR = 0.8;
    const tierH = 0.35;
    const eaveH = 0.06;
    const taperK = 0.92;

    let curR = baseR;
    let curY = baseY;

    for (let t = 0; t < tiers; t++) {
      const tierR = curR;
      const tierTop = curY + tierH;
      // Pagoda body (hexagonal for tri savings)
      parts.push(cyl(tierR * 0.85, tierR * 0.9, tierH, 6, BODY_RED, {
        y: curY + tierH / 2,
      }));
      // Eave (green roof edge)
      parts.push(cyl(tierR * 1.15, tierR * 0.95, eaveH, 6, ROOF_GREEN, {
        y: tierTop + eaveH / 2,
      }));
      curR *= taperK;
      curY = tierTop + eaveH + 0.02;
    }

    /* ---- 3) Top finial (golden spire) ---- */
    parts.push(cyl(0.03, 0.04, 0.4, 4, GOLD, { y: curY + 0.2 + j }));
    parts.push(cone(0.04, 0.12, 4, GOLD_HI, { y: curY + 0.46 }));

    return finish(parts);
  },
};

export default NM_CIEN_PAGODA;
