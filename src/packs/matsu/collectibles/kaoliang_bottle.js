/**
 * @file packs/matsu/collectibles/kaoliang_bottle.js — Roll Formosa Matsu pack.
 *
 * 馬祖高粱酒 (Matsu Kaoliang) — code 74. A ceramic bottle of Matsu's famous
 * kaoliang (sorghum) liquor. Known as "Tunnel 88" aged in old military tunnels,
 * Matsu kaoliang rivals Kinmen's. The traditional ceramic bottle has a distinctive
 * shape with a short neck and often a red label or seal.
 *
 * <= 350 triangles.
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

const CERAMIC = 0xf2e8d8;    // off-white ceramic
const CERAMIC_HI = 0xfff8f0;
const LABEL = 0xc41e3a;      // red label/seal
const NECK = 0xe8dcc8;       // slightly darker neck
const CAP = 0x8b4513;        // brown cap/cork

export const COL_KAOLIANG_BOTTLE = {
  id: 'kaoliang_bottle',
  name: '馬祖高粱酒',
  colorHex: 0xf2e8d8,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Bottle body (rounded ceramic)
    parts.push(sph(0.6, CERAMIC, { ws: 8, hs: 6, sy: 1.3, y: 0.6, hex2: CERAMIC_HI }));

    // Bottle shoulder (transition to neck)
    parts.push(cyl(0.5, 0.28, 0.25, 8, CERAMIC, { y: 1.25, hex2: NECK }));

    // Bottle neck
    parts.push(cyl(0.22, 0.2, 0.4, 8, NECK, { y: 1.52 }));

    // Bottle rim
    parts.push(cyl(0.24, 0.22, 0.06, 8, CERAMIC_HI, { y: 1.74 }));

    // Cap/cork
    parts.push(cyl(0.18, 0.16, 0.15, 6, CAP, { y: 1.85 }));

    // Base
    parts.push(cyl(0.48, 0.5, 0.1, 8, CERAMIC, { y: 0.02 }));

    // Red label on front
    parts.push(box(0.4, 0.5, 0.05, LABEL, { y: 0.65, z: 0.56 }));

    // Small seal/badge
    parts.push(sph(0.12, LABEL, { ws: 5, hs: 3, sz: 0.3, y: 1.0, z: 0.52 }));

    return finish(parts);
  },
};

export default COL_KAOLIANG_BOTTLE;
