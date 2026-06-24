/**
 * @file packs/penghu/landmarks/xiyu_lighthouse.js — Roll Formosa Penghu pack, landmark 4.
 *
 * NM_XIYU_LIGHTHOUSE — 漁翁島燈塔 (Yuwengdao Lighthouse / Xiyu Lighthouse), 西嶼.
 * Taiwan's oldest lighthouse, built in 1778, with a distinctive white cylindrical
 * tower. Silhouette: a tall white lighthouse tower with a black lantern room
 * on top.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — white lighthouse with black lantern room.
const WHITE = 0xf4f6f8; // white tower
const WHITE_D = 0xdce0e4; // shadowed white
const BLACK = 0x2a2c30; // lantern room
const GLASS = 0xc8e0f0; // lantern glass
const RAIL = 0x3a3c40; // gallery railing
const BASE = 0xe8e4dc; // stone base

export const NM_XIYU_LIGHTHOUSE = {
  id: 'xiyu_lighthouse',
  name: '漁翁島燈塔',
  landmarkId: 4,
  dioramaRHint: 90, // ~11m tall tower
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // ---- Stone base / platform ----
    parts.push(cyl(0.5, 0.5, 0.15, 12, BASE, { y: 0.075 }));

    // ---- Main tower shaft ----
    // Tapered white cylinder
    parts.push(cyl(0.32, 0.26, 1.6, 12, WHITE, { y: 0.95, hex2: WHITE_D }));

    // ---- Cornice / balcony ring ----
    parts.push(cyl(0.34, 0.34, 0.08, 12, WHITE_D, { y: 1.75 }));

    // ---- Gallery deck ----
    parts.push(cyl(0.36, 0.36, 0.03, 8, BLACK, { y: 1.79 }));

    // ---- Gallery railing (simplified to ring only) ----
    parts.push(cyl(0.34, 0.34, 0.1, 8, RAIL, { y: 1.88, open: true }));

    // ---- Lantern room (black octagonal housing) ----
    parts.push(cyl(0.2, 0.2, 0.3, 6, BLACK, { y: 1.96 }));

    // ---- Dome / ventilator cap ----
    parts.push(sph(0.18, BLACK, { ws: 6, hs: 3, theta0: 0, thetaLen: HALF_PI, y: 2.14 }));

    // ---- Lightning rod / finial ----
    parts.push(cyl(0.015, 0.01, 0.15, 4, RAIL, { y: 2.28 }));

    return finish(parts);
  },
};

export default NM_XIYU_LIGHTHOUSE;
