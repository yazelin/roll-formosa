/**
 * @file packs/nantou/collectibles/bamboo_basket.js — Roll Formosa Nantou pack.
 *
 * 竹編籃 (Bamboo Woven Basket) — collectibleId for nantou. A traditional
 * handcrafted bamboo basket from Zhushan (竹山), the bamboo capital of Taiwan.
 * Features:
 * - Classic woven basket shape with handles
 * - Natural bamboo tan color
 * - Open weave pattern implied by color variation
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles.
 */

import { cyl, torus, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const BAMBOO = 0xb09060;       // natural bamboo tan
const BAMBOO_DARK = 0x8a7050; // darker bamboo (weave shadow)
const BAMBOO_LIGHT = 0xc8a878; // lighter bamboo (highlights)
const RIM = 0x9a7a58;          // rim binding

export const COL_BAMBOO_BASKET = {
  id: 'bamboo_basket_col',
  name: '竹編籃',
  collectibleId: 8, // replaces youbike
  colorHex: 0xb09060,

  buildGeometry(rng) {
    const parts = [];
    const j = (rng ? rng() - 0.5 : 0) * 0.02;

    // --- Basket body (tapered cylinder, wider at top) ---
    parts.push(cyl(0.35, 0.5, 0.7, 8, BAMBOO, { y: 0.35, hex2: BAMBOO_DARK }));

    // --- Rim binding (torus around top edge) ---
    parts.push(torus(0.5, 0.04, 3, 8, RIM, { rx: HALF_PI, y: 0.72 }));

    // --- Bottom base (flat woven bottom) ---
    parts.push(cyl(0.35, 0.35, 0.06, 8, BAMBOO_LIGHT, { y: 0.03 }));

    // --- Handle (arched over the basket) ---
    parts.push(torus(0.35, 0.035, 3, 6, BAMBOO, {
      rx: HALF_PI,
      y: 0.95 + j,
      theta0: 0,
      thetaLen: PI,
    }));

    // --- Decorative weave band (horizontal ring) ---
    parts.push(cyl(0.45, 0.45, 0.03, 8, BAMBOO_LIGHT, { y: 0.4 }));

    return finish(parts);
  },
};

export default COL_BAMBOO_BASKET;
