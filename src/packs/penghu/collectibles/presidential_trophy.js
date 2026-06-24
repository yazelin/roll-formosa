/**
 * @file packs/penghu/collectibles/presidential_trophy.js — Roll Formosa collectible.
 *
 * COL_CORAL — 珊瑚 (coral). Penghu's waters are famous for beautiful coral
 * formations. This collectible is a decorative coral branch — the kind sold
 * in souvenir shops or displayed in homes. Silhouette: a branching coral
 * structure rising from a small base, with multiple irregular branches
 * reaching upward and outward. The warm coral-red to pink color with white
 * tips is the signature read.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the silhouette: an organic
 * branching structure rising from a compact base. Well under the 350-triangle
 * collectible budget.
 *
 * Palette: coral red/pink body, lighter pink tips, small display base.
 */

import { cyl, cone, sph, finish, PI } from '../geomHelpers.js';

// Palette
const CORAL = 0xe85858;      // warm coral red
const CORAL_LT = 0xf08080;   // lighter coral pink
const CORAL_DK = 0xc04040;   // darker coral (base)
const TIP = 0xf8c8c8;        // pale pink-white tips
const BASE = 0x8a7a6a;       // stone/wood display base

export const COL_CORAL = {
  id: 'coral',
  name: '珊瑚',
  collectibleId: 9,
  colorHex: CORAL,

  buildGeometry(rng) {
    const parts = [];

    // === DISPLAY BASE (small decorative stand) ===============================
    parts.push(cyl(0.4, 0.5, 0.15, 6, BASE, { y: -0.6 }));

    // === MAIN TRUNK (central coral branch) ===================================
    parts.push(cyl(0.18, 0.22, 0.5, 5, CORAL_DK, { y: -0.25, hex2: CORAL }));
    parts.push(cyl(0.12, 0.16, 0.45, 5, CORAL, { y: 0.25, hex2: CORAL_LT }));
    parts.push(sph(0.1, TIP, { ws: 3, hs: 2, y: 0.55 }));

    // === PRIMARY BRANCHES (3 main branches) ==================================
    // Branch 1: right side
    parts.push(cyl(0.1, 0.14, 0.35, 4, CORAL, {
      x: 0.18, y: 0.1, z: 0.08,
      rz: -0.7, rx: 0.2,
      hex2: CORAL_LT
    }));
    parts.push(sph(0.06, TIP, { ws: 3, hs: 2, x: 0.42, y: 0.38, z: 0.12 }));

    // Branch 2: left side
    parts.push(cyl(0.12, 0.15, 0.4, 4, CORAL, {
      x: -0.15, y: -0.05, z: 0.05,
      rz: 0.65, rx: -0.15,
      hex2: CORAL_LT
    }));
    parts.push(sph(0.055, TIP, { ws: 3, hs: 2, x: -0.48, y: 0.32, z: 0.08 }));

    // Branch 3: forward
    parts.push(cyl(0.09, 0.12, 0.32, 4, CORAL, {
      x: 0.05, y: 0.05, z: 0.2,
      rx: 0.55, rz: 0.15,
      hex2: CORAL_LT
    }));
    parts.push(sph(0.05, TIP, { ws: 3, hs: 2, x: 0.12, y: 0.3, z: 0.48 }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_PRES_TROPHY = COL_CORAL;

export default COL_CORAL;
