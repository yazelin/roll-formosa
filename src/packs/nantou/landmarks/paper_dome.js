/**
 * @file packs/nantou/landmarks/paper_dome.js — Roll Formosa Nantou pack, landmark 4.
 *
 * 紙教堂 (Paper Dome) — A chapel built with 58 paper tubes, originally
 * constructed in Kobe, Japan after the 1995 earthquake, then relocated
 * to Puli (埔里) after the 921 earthquake. Features:
 * - Oval/elliptical footprint
 * - 58 paper tubes forming the main structural columns
 * - Translucent membrane roof
 * - Wooden floor platform
 * - Minimalist, modern aesthetic
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — minimalist paper chapel colors
const PAPER_TUBE = 0xf0e8d8;     // cream-colored paper tubes
const PAPER_DARK = 0xd8d0c0;    // shadow on tubes
const MEMBRANE = 0xf8f8f0;      // translucent white membrane roof
const MEMBRANE_FRAME = 0xc0b8a8; // membrane frame/edge
const WOOD_FLOOR = 0xa08060;    // wooden floor
const WOOD_DARK = 0x806040;     // darker wood
const STONE_BASE = 0x787878;    // stone foundation
const GLASS = 0xc8e0e8;         // glass/window elements

export const NM_PAPER_DOME = {
  id: 'paper_dome',
  name: '紙教堂',
  landmarkId: 4,
  dioramaRHint: 18, // chapel ~36m long
  colorHex: PAPER_TUBE,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.003;
    const parts = [];

    /* ---- 1) Stone foundation + floor ---- */
    parts.push(cyl(1.3, 1.3, 0.1, 8, STONE_BASE, { y: 0.05, sx: 1.3, sz: 0.8 }));
    parts.push(cyl(1.2, 1.2, 0.06, 8, WOOD_FLOOR, { y: 0.13, sx: 1.3, sz: 0.8, hex2: WOOD_DARK }));

    /* ---- 2) Paper tube columns (8 outer tubes only) ---- */
    const tubeH = 0.9;
    for (let t = 0; t < 8; t++) {
      const angle = (t / 8) * PI * 2;
      const tx = Math.sin(angle) * 1.1;
      const tz = Math.cos(angle) * 0.7;
      parts.push(cyl(0.06, 0.05, tubeH, 5, PAPER_TUBE, {
        x: tx, y: 0.16 + tubeH / 2, z: tz, hex2: PAPER_DARK
      }));
    }

    /* ---- 3) Dome membrane (simplified) ---- */
    parts.push(sph(0.95, MEMBRANE, {
      ws: 8, hs: 5,
      y: 0.16 + tubeH + 0.1 + j,
      sx: 1.35, sy: 0.22, sz: 0.85,
      hex2: MEMBRANE_FRAME
    }));

    /* ---- 4) Entrance porch ---- */
    parts.push(box(0.5, 0.04, 0.3, WOOD_FLOOR, { y: 0.12, z: 1.0 }));

    return finish(parts);
  },
};

export default NM_PAPER_DOME;
