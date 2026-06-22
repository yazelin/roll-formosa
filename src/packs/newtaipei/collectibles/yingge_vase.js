/**
 * @file packs/newtaipei/collectibles/yingge_vase.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_YINGGE_VASE — 鶯歌陶瓷花瓶 (Yingge Ceramic Vase). A beautiful traditional
 * Chinese ceramic vase from Yingge, the pottery capital of Taiwan. Features
 * classic blue and white (青花) porcelain decoration with floral or landscape
 * motifs, elegant curved profile.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const PORCELAIN = 0xf8f8f4;  // white porcelain base
const BLUE = 0x2a5090;       // cobalt blue decoration
const BLUE_LT = 0x4a70b0;    // lighter blue
const GOLD = 0xd4a840;       // gold trim (if any)

export const COL_YINGGE_VASE = {
  id: 'yingge_vase',
  name: '鶯歌陶瓷花瓶',
  colorHex: BLUE, // blue and white read

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Vase profile (classic meiping 梅瓶 shape) ------------------
    // Base foot
    parts.push(cyl(0.3, 0.35, 0.1, 10, PORCELAIN, { y: 0.05 }));
    // Lower body (wider)
    parts.push(cyl(0.35, 0.55, 0.35, 10, PORCELAIN, { y: 0.275 }));
    // Middle body (widest)
    parts.push(cyl(0.55, 0.6, 0.4, 10, PORCELAIN, { y: 0.65, hex2: 0xffffff }));
    // Upper body (tapering)
    parts.push(cyl(0.6, 0.45, 0.35, 10, PORCELAIN, { y: 1.025 }));
    // Shoulder
    parts.push(cyl(0.45, 0.3, 0.2, 10, PORCELAIN, { y: 1.3 }));
    // Neck
    parts.push(cyl(0.25, 0.22, 0.15, 10, PORCELAIN, { y: 1.475 }));
    // Lip/rim
    parts.push(cyl(0.26, 0.28, 0.08, 10, PORCELAIN, { y: 1.59 }));

    // ---- 2) Blue decoration bands --------------------------------------
    // Base band
    parts.push(cyl(0.36, 0.36, 0.04, 10, BLUE, { y: 0.12, open: true }));
    // Main decorative band (widest part)
    parts.push(cyl(0.61, 0.61, 0.25, 10, BLUE, { y: 0.65, open: true }));
    // Inner lighter pattern within band
    parts.push(cyl(0.605, 0.605, 0.15, 10, BLUE_LT, { y: 0.65, open: true }));
    // Shoulder band
    parts.push(cyl(0.46, 0.46, 0.05, 10, BLUE, { y: 1.17, open: true }));
    // Neck band
    parts.push(cyl(0.27, 0.27, 0.04, 10, BLUE, { y: 1.45, open: true }));

    // ---- 3) Painted motif details (simplified) -------------------------
    // Floral/landscape elements represented as small shapes on the blue band
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2;
      // Flower-like dot clusters
      parts.push(sph(0.06, PORCELAIN, {
        ws: 5, hs: 4,
        x: Math.cos(a) * 0.56,
        y: 0.65,
        z: Math.sin(a) * 0.56,
      }));
      // Small decorative dots around
      parts.push(sph(0.025, PORCELAIN, {
        ws: 4, hs: 3,
        x: Math.cos(a + 0.3) * 0.58,
        y: 0.72,
        z: Math.sin(a + 0.3) * 0.58,
      }));
    }

    // ---- 4) Gold rim accent (optional traditional detail) --------------
    parts.push(cyl(0.29, 0.29, 0.02, 10, GOLD, { y: 1.63, open: true }));

    return finish(parts);
  },
};

export default COL_YINGGE_VASE;
