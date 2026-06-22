/**
 * @file packs/newtaipei/collectibles/ceramic_bowl.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_CERAMIC_BOWL — 鶯歌陶碗 (Yingge Ceramic Bowl). A beautifully crafted
 * traditional rice bowl from Yingge ceramics town. Features classic blue
 * and white decoration, or rustic earth-toned glaze. These bowls are a
 * staple product of the Yingge pottery industry.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const PORCELAIN = 0xf8f8f0;  // white porcelain
const BLUE = 0x2a4a8a;       // traditional blue decoration
const BLUE_LT = 0x4a6aaa;    // lighter blue accent

export const COL_CERAMIC_BOWL = {
  id: 'ceramic_bowl',
  name: '鶯歌陶碗',
  colorHex: BLUE, // blue and white read

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Bowl body (classic rice bowl shape) ------------------------
    // Flared bowl shape
    parts.push(cyl(0.25, 0.65, 0.45, 12, PORCELAIN, { y: 0.225 }));
    // Lip/rim
    parts.push(cyl(0.67, 0.68, 0.04, 12, PORCELAIN, { y: 0.47 }));
    // Inner surface (darker)
    parts.push(cyl(0.22, 0.62, 0.4, 12, 0xf0f0e8, { y: 0.25 }));

    // ---- 2) Foot ring --------------------------------------------------
    parts.push(cyl(0.22, 0.25, 0.06, 10, PORCELAIN, { y: 0.03 }));
    parts.push(cyl(0.18, 0.2, 0.04, 10, 0xe8e8e0, { y: 0.02 })); // inner foot

    // ---- 3) Blue decorative bands --------------------------------------
    // Rim band
    parts.push(cyl(0.685, 0.685, 0.03, 12, BLUE, { y: 0.46, open: true }));
    // Middle band (main decoration zone)
    parts.push(cyl(0.55, 0.55, 0.08, 12, BLUE, { y: 0.35, open: true }));
    // Lower accent band
    parts.push(cyl(0.4, 0.4, 0.03, 12, BLUE_LT, { y: 0.15, open: true }));

    // ---- 4) Floral/geometric motifs (simplified) -----------------------
    // Four medallion patterns on the band
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2;
      const r = 0.52;
      // Flower center
      parts.push(sph(0.05, PORCELAIN, {
        ws: 5, hs: 3,
        x: Math.cos(a) * r,
        y: 0.35,
        z: Math.sin(a) * r,
      }));
      // Petals (simplified as small dots)
      for (let j = 0; j < 4; j++) {
        const pa = a + (j / 4) * PI * 0.5 - PI * 0.125;
        parts.push(sph(0.02, BLUE_LT, {
          ws: 4, hs: 3,
          x: Math.cos(a) * r + Math.cos(pa) * 0.06,
          y: 0.35,
          z: Math.sin(a) * r + Math.sin(pa) * 0.06,
        }));
      }
    }

    // ---- 5) Inner bottom decoration ------------------------------------
    // Small blue circle at bowl bottom
    parts.push(cyl(0.1, 0.1, 0.01, 8, BLUE, { y: 0.08 }));

    return finish(parts);
  },
};

export default COL_CERAMIC_BOWL;
