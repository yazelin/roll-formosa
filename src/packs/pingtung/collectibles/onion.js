/**
 * @file packs/pingtung/collectibles/onion.js — Roll Formosa Pingtung pack.
 *
 * 洋蔥 (Onion) — collectibleId 4. One of Hengchun's Three Treasures (恆春三寶).
 * The sweet onions grown in Hengchun are famous across Taiwan.
 * Silhouette: a round, layered onion with papery golden-brown skin and
 * green shoot sprouts on top.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, cyl, finish, HALF_PI } from '../geomHelpers.js';

const BROWN_SKIN = 0xa87040;    // outer papery skin
const GOLD_SKIN = 0xc8a060;     // inner gold layer
const WHITE = 0xf8f5f0;         // white flesh peeking
const GREEN = 0x60a840;         // green sprouts

export const COL_ONION = {
  id: 'onion',
  name: '洋蔥',
  collectibleId: 4,
  colorHex: BROWN_SKIN,

  buildGeometry(rng) {
    const parts = [];

    // --- Main onion body (simplified: single layered sphere) ---
    parts.push(sph(0.8, BROWN_SKIN, { ws: 6, hs: 5, sx: 1.0, sy: 0.85, sz: 1.0, y: 0.1, hex2: GOLD_SKIN }));

    // --- Top neck ---
    parts.push(cyl(0.2, 0.3, 0.25, 5, GOLD_SKIN, { y: 0.7 }));

    // --- Green sprouts (reduced to 2) ---
    parts.push(cyl(0.05, 0.03, 0.4, 4, GREEN, { y: 1.0, rx: 0.1 }));
    parts.push(cyl(0.04, 0.02, 0.35, 4, GREEN, { y: 0.95, x: 0.06, rx: -0.15, rz: 0.1 }));

    // --- Root base ---
    parts.push(sph(0.2, WHITE, { ws: 4, hs: 2, sy: 0.4, y: -0.55 }));

    return finish(parts);
  },
};

export default COL_ONION;
