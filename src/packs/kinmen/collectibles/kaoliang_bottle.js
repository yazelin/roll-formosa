/**
 * @file packs/kinmen/collectibles/kaoliang_bottle.js — Roll Formosa Kinmen pack.
 *
 * 金門高粱酒 (Kinmen Kaoliang) — code 71. The famous sorghum liquor that is
 * Kinmen's most famous export. The distinctive white ceramic bottle with
 * red label is an iconic symbol of the island.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const CERAMIC = 0xf8f4e8;     // white ceramic
const CERAMIC_HI = 0xffffff;
const LABEL_RED = 0xc41e3a;   // red label
const LABEL_GOLD = 0xdaa520;
const NECK = 0xf0ece0;
const CAP_RED = 0xb81c1c;

export const COL_KAOLIANG_BOTTLE = {
  id: 'kaoliang_bottle_col',
  name: '金門高粱酒',
  colorHex: CERAMIC,

  buildGeometry(rng) {
    const parts = [];

    // Bottle body (tall, slightly rounded)
    parts.push(cyl(0.4, 0.38, 1.2, 8, CERAMIC, { y: 0.6, hex2: CERAMIC_HI }));

    // Rounded bottom
    parts.push(sph(0.4, CERAMIC, { ws: 6, hs: 4, y: 0.15, theta0: HALF_PI, thetaLen: HALF_PI }));

    // Bottle shoulder
    parts.push(cyl(0.38, 0.2, 0.2, 8, CERAMIC, { y: 1.3, hex2: NECK }));

    // Bottle neck
    parts.push(cyl(0.16, 0.14, 0.3, 8, NECK, { y: 1.55 }));

    // Bottle rim
    parts.push(cyl(0.18, 0.16, 0.04, 8, CERAMIC_HI, { y: 1.72 }));

    // Cap
    parts.push(cyl(0.14, 0.12, 0.12, 6, CAP_RED, { y: 1.8 }));
    parts.push(cyl(0.08, 0.06, 0.05, 5, LABEL_GOLD, { y: 1.88 }));

    // Main red label
    parts.push(box(0.5, 0.45, 0.04, LABEL_RED, { y: 0.7, z: 0.38 }));

    // Gold border on label
    parts.push(box(0.52, 0.04, 0.045, LABEL_GOLD, { y: 0.95, z: 0.38 }));
    parts.push(box(0.52, 0.04, 0.045, LABEL_GOLD, { y: 0.45, z: 0.38 }));

    // 金門 text area (simplified as gold bar)
    parts.push(box(0.3, 0.12, 0.05, LABEL_GOLD, { y: 0.72, z: 0.4 }));

    return finish(parts);
  },
};

export default COL_KAOLIANG_BOTTLE;
