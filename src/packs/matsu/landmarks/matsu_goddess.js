/**
 * @file packs/matsu/landmarks/matsu_goddess.js — Roll Formosa Matsu pack.
 *
 * 媽祖巨神像 (Mazu Goddess Statue). THE GOAL MONUMENT. The iconic 29.6-meter
 * tall statue of the sea goddess Mazu (媽祖) on Nangan Island, the tallest
 * Mazu statue in the world. She faces the sea with her characteristic
 * headdress, flowing robes, and serene expression, blessing and protecting
 * fishermen and sailors. Made of granite, she stands on a decorated pedestal.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so proportions (not absolute size) carry the silhouette.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the巨神像 granite statue with traditional elements.
const GRANITE_LIGHT = 0xb8b0a8; // light granite (face, hands)
const GRANITE_MID = 0x9a9488; // mid-tone granite (robes)
const GRANITE_DARK = 0x7a7468; // darker granite (shadows, folds)
const GOLD = 0xd4a840; // gold accents (headdress, ornaments)
const RED = 0x9a3030; // red accents (trim)
const PEDESTAL = 0x6a6058; // dark stone pedestal
const PEDESTAL_TRIM = 0x7a7068; // pedestal trim
const WATER = 0x3a6a8a; // sea water base

export const NM_MATSU_GODDESS = {
  id: 'matsu_goddess',
  name: '媽祖巨神像',
  landmarkId: 7,
  dioramaRHint: 296, // real height ~29.6m (scaled up for goal monument)
  colorHex: GRANITE_LIGHT, // the distinctive granite color

  buildGeometry(rng) {
    const FACE = HALF_PI / 2;
    void FACE;
    const parts = [];

    // ---- 1) Ocean / ground base --------------------------------------------
    parts.push(box(2.0, 0.08, 2.0, WATER, { y: 0.04 }));
    // Coastal platform
    parts.push(box(1.4, 0.10, 1.4, 0x5a5a50, { y: 0.13 }));

    // ---- 2) Decorated pedestal (multi-tiered) ------------------------------
    // Lower tier
    parts.push(box(0.9, 0.20, 0.9, PEDESTAL, { y: 0.28, hex2: PEDESTAL_TRIM }));
    // Red decorative band
    parts.push(box(0.92, 0.04, 0.92, RED, { y: 0.40 }));
    // Upper tier
    parts.push(box(0.75, 0.18, 0.75, PEDESTAL_TRIM, { y: 0.51, hex2: PEDESTAL }));
    // Gold trim at top of pedestal
    parts.push(box(0.78, 0.03, 0.78, GOLD, { y: 0.62 }));

    // ---- 3) Flowing robes (lower body) -------------------------------------
    // Wide flowing robe base - the statue's iconic draped garments
    parts.push(cyl(0.30, 0.38, 0.60, 6, GRANITE_DARK, { y: 0.94, hex2: GRANITE_MID }));
    // Robe folds (vertical ridges) - reduced from 6 to 4
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * PI * 2;
      const r = 0.34;
      parts.push(box(0.04, 0.55, 0.08, GRANITE_MID, {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 0.92,
        ry: -a,
        hex2: GRANITE_LIGHT,
      }));
    }

    // ---- 4) Upper body / torso ---------------------------------------------
    parts.push(cyl(0.18, 0.24, 0.45, 6, GRANITE_MID, { y: 1.48, hex2: GRANITE_LIGHT }));
    // Shoulders
    parts.push(box(0.50, 0.12, 0.22, GRANITE_MID, { y: 1.68 }));

    // ---- 5) Arms (folded in blessing gesture) ------------------------------
    // Right arm - extended slightly
    parts.push(cyl(0.06, 0.07, 0.28, 4, GRANITE_LIGHT, {
      x: 0.22, y: 1.58, z: 0.08, rz: 0.4, rx: -0.2, hex2: GRANITE_MID,
    }));
    // Left arm
    parts.push(cyl(0.06, 0.07, 0.25, 4, GRANITE_LIGHT, {
      x: -0.20, y: 1.55, z: 0.05, rz: -0.35, rx: -0.15, hex2: GRANITE_MID,
    }));
    // Hands
    parts.push(sph(0.05, GRANITE_LIGHT, { ws: 4, hs: 3, x: 0.32, y: 1.48, z: 0.15 }));
    parts.push(sph(0.05, GRANITE_LIGHT, { ws: 4, hs: 3, x: -0.28, y: 1.46, z: 0.12 }));

    // ---- 6) Neck and head --------------------------------------------------
    parts.push(cyl(0.07, 0.08, 0.10, 5, GRANITE_LIGHT, { y: 1.80 }));
    // Head - slightly oval
    parts.push(sph(0.12, GRANITE_LIGHT, { ws: 6, hs: 4, y: 1.95, sy: 1.1 }));
    // Face features (simplified)
    parts.push(sph(0.10, GRANITE_LIGHT, { ws: 5, hs: 3, y: 1.93, z: 0.03, sy: 0.9, hex2: 0xc0b8b0 }));

    // ---- 7) Elaborate headdress (the iconic Mazu crown) --------------------
    // Base of headdress
    parts.push(cyl(0.14, 0.12, 0.08, 6, GOLD, { y: 2.08 }));
    // Crown tiers
    parts.push(cyl(0.10, 0.13, 0.10, 6, GOLD, { y: 2.17 }));
    parts.push(cyl(0.07, 0.10, 0.08, 6, GOLD, { y: 2.25, hex2: 0xe8c050 }));
    // Phoenix ornament at top
    parts.push(cone(0.05, 0.12, 5, GOLD, { y: 2.35 }));
    // Side dangles (beaded tassels)
    parts.push(cyl(0.02, 0.025, 0.12, 4, GOLD, { x: -0.12, y: 2.02, rz: 0.3 }));
    parts.push(cyl(0.02, 0.025, 0.12, 4, GOLD, { x: 0.12, y: 2.02, rz: -0.3 }));
    // Beads at tassel ends
    parts.push(sph(0.025, RED, { ws: 3, hs: 2, x: -0.16, y: 1.94 }));
    parts.push(sph(0.025, RED, { ws: 3, hs: 2, x: 0.16, y: 1.94 }));

    // ---- 8) Robe decorative elements ---------------------------------------
    // Neckline ornament
    parts.push(box(0.20, 0.04, 0.04, GOLD, { y: 1.72, z: 0.10 }));
    // Waist sash
    parts.push(box(0.35, 0.05, 0.06, RED, { y: 1.28, z: 0.15 }));

    return finish(parts);
  },
};

export default NM_MATSU_GODDESS;
