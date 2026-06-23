/**
 * @file packs/pingtung/landmarks/eluanbi_lighthouse.js — Roll Formosa hero landmark.
 *
 * NM_ELUANBI — 鵝鑾鼻燈塔 (Eluanbi Lighthouse), THE GOAL MONUMENT. Taiwan's
 * southernmost lighthouse, built in 1883, is a distinctive white cylindrical
 * tower with an octagonal iron railing gallery, a glazed lantern room, and a
 * black domed cap. Uniquely, it was once fortified with a surrounding wall
 * and gun emplacements due to its strategic position at the tip of 恆春半島.
 * The lighthouse stands 21.4m tall (56m above sea level including the cliff).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — lighthouse materials.
const WHITE = 0xf4f4ec; // whitewashed cylindrical tower (signature off-white)
const WHITE_D = 0xdcdcd4; // shaded lower band
const BASE = 0xc8c4b8; // stone/concrete base and fortification wall
const BASE_D = 0xa8a498; // darker base stone shadow
const DARK = 0x2a2e32; // black-grey gallery railing / lantern frame / dome
const GLASS = 0xa0d8e0; // pale cyan lantern-room glazing
const BRASS = 0xc9a14a; // brass finial atop the dome
const RED = 0xd82020; // red band around the base (historical marking)
const WALL = 0xb8b4a8; // fortification wall surrounding

export const NM_ELUANBI = {
  id: 'eluanbi_lighthouse',
  name: '鵝鑾鼻燈塔',
  landmarkId: 8,
  dioramaRHint: 56, // total height above sea level including cliff/base ~56m
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Base platform (simplified) ----
    parts.push(cyl(1.1, 1.3, 0.18, 8, BASE, { y: 0.09, hex2: BASE_D }));
    parts.push(cyl(0.65, 0.70, 0.25, 8, BASE, { y: 0.50, hex2: WALL }));

    // ---- 2) Lighthouse stone base with red band ----
    const towerBot = 0.62;
    parts.push(cyl(0.50, 0.55, 0.30, 8, WHITE_D, { y: towerBot + 0.15 }));
    parts.push(cyl(0.56, 0.56, 0.06, 8, RED, { y: towerBot + 0.03 }));

    // ---- 3) Main white cylindrical tower ----
    const shaftBot = towerBot + 0.30;
    const shaftH = 1.60;
    parts.push(cyl(0.35, 0.48, shaftH, 8, WHITE, { y: shaftBot + shaftH / 2 }));
    const shaftTop = shaftBot + shaftH;

    // ---- 4) Gallery balcony ----
    const galY = shaftTop;
    parts.push(cyl(0.50, 0.50, 0.05, 8, DARK, { y: galY + 0.025 }));
    parts.push(cyl(0.48, 0.48, 0.02, 8, DARK, { y: galY + 0.20 }));

    // ---- 5) Glazed lantern room ----
    const lantBot = galY + 0.08;
    parts.push(cyl(0.32, 0.34, 0.32, 8, GLASS, { y: lantBot + 0.24 }));

    // ---- 6) Black domed cap ----
    const domeY = lantBot + 0.42;
    parts.push(cone(0.35, 0.22, 8, DARK, { y: domeY + 0.11 }));
    parts.push(sph(0.10, DARK, { ws: 5, hs: 3, y: domeY + 0.24 }));
    parts.push(cyl(0.015, 0.02, 0.15, 4, BRASS, { y: domeY + 0.35 }));
    parts.push(sph(0.03, BRASS, { ws: 4, hs: 2, y: domeY + 0.44 }));

    return finish(parts);
  },
};

export default NM_ELUANBI;
