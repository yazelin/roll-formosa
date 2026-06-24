/**
 * @file packs/penghu/collectibles/shilin_big_chicken.js — Roll Formosa Penghu
 * pack, COLLECTIBLE item (the rare rolled-up treats).
 *
 * COL_OYSTER — 牡蠣 (oyster). Penghu's clean waters produce famously delicious
 * oysters. Silhouette: an opened oyster shell with the plump, glistening
 * oyster meat visible inside. The rough, grey-brown exterior shell contrasts
 * with the smooth pearlescent interior and the pale grey oyster flesh.
 * Often shown on the half-shell, ready to eat.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges -> recenters -> normalizes to a UNIT bounding sphere, so this is
 * authored in unit-ish space for correct PROPORTIONS: an irregular shell
 * shape with visible meat inside. <= 350 tris.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — oyster shell and meat colors
const SHELL_OUT = 0x6a6058;    // rough grey-brown outer shell
const SHELL_OUT_DK = 0x4a4038; // darker shell texture
const SHELL_IN = 0xe8e4dc;     // pearlescent interior
const SHELL_IN_HI = 0xf4f0e8;  // bright pearl highlight
const MEAT = 0xc8c0b0;         // pale grey oyster meat
const MEAT_HI = 0xd8d4c8;      // glistening meat highlight
const MEAT_DK = 0xa8a090;      // shadowed meat edge
const MANTLE = 0x8a8278;       // darker mantle edge

export const COL_OYSTER = {
  id: 'oyster',
  name: '牡蠣',
  collectibleId: 11,
  colorHex: SHELL_OUT, // grey-brown shell — the signature color

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.05; // tiny non-structural jitter
    const parts = [];

    // === BOTTOM SHELL (cupped half holding the meat) =========================
    // Irregular oval shape — wider in the middle, tapered at hinge end
    parts.push(sph(0.8, SHELL_OUT, {
      ws: 8, hs: 4, sy: 0.35, sx: 1.2, sz: 0.9,
      y: -0.1,
      thetaLen: PI * 0.6,
      hex2: SHELL_OUT_DK
    }));

    // Rough shell texture — bumpy exterior
    const bumps = [
      [-0.5, -0.15, 0.3],
      [0.3, -0.12, 0.35],
      [-0.2, -0.18, -0.3],
      [0.5, -0.14, -0.15],
      [-0.4, -0.1, 0.0],
      [0.1, -0.16, 0.4],
    ];
    for (const [bx, by, bz] of bumps) {
      parts.push(sph(0.12, SHELL_OUT_DK, {
        ws: 4, hs: 2, sy: 0.5,
        x: bx + j,
        y: by,
        z: bz
      }));
    }

    // Shell rim / edge (thicker lip around the opening)
    parts.push(cyl(0.85, 0.9, 0.08, 10, SHELL_OUT, {
      y: 0.05, sx: 1.2, sz: 0.9, open: true,
      hex2: SHELL_IN
    }));

    // === PEARLESCENT INTERIOR ================================================
    parts.push(sph(0.72, SHELL_IN, {
      ws: 8, hs: 3, sy: 0.25, sx: 1.15, sz: 0.85,
      y: 0.0,
      thetaLen: PI * 0.5,
      hex2: SHELL_IN_HI
    }));

    // === OYSTER MEAT (plump body in the center) ==============================
    // Main meat body — irregular blob shape
    parts.push(sph(0.5, MEAT, {
      ws: 7, hs: 4, sy: 0.45, sx: 1.1, sz: 0.85,
      y: 0.12,
      hex2: MEAT_HI
    }));

    // Glistening highlights on the meat surface
    parts.push(sph(0.35, MEAT_HI, {
      ws: 5, hs: 3, sy: 0.25, sx: 0.9,
      y: 0.2, x: 0.1, z: 0.05
    }));
    parts.push(sph(0.25, MEAT_HI, {
      ws: 4, hs: 2, sy: 0.2,
      y: 0.18, x: -0.2, z: -0.1
    }));

    // Darker mantle edge around the meat
    parts.push(cyl(0.55, 0.6, 0.06, 8, MANTLE, {
      y: 0.08, sx: 1.1, sz: 0.85, open: true
    }));

    // Slight fold/ruffle on the meat edge
    parts.push(sph(0.15, MEAT_DK, {
      ws: 4, hs: 2, sy: 0.4, sx: 1.3,
      y: 0.1, x: 0.4, z: 0.15
    }));
    parts.push(sph(0.12, MEAT_DK, {
      ws: 4, hs: 2, sy: 0.4, sx: 1.2,
      y: 0.08, x: -0.35, z: 0.2
    }));

    // === TOP SHELL (lifted, showing it's been opened) ========================
    // Smaller shell half tilted back at the hinge
    parts.push(sph(0.65, SHELL_OUT, {
      ws: 7, hs: 3, sy: 0.3, sx: 1.1, sz: 0.8,
      y: 0.35, x: -0.3,
      rx: -0.8, ry: 0.1,
      hex2: SHELL_OUT_DK
    }));
    // Interior of top shell
    parts.push(sph(0.55, SHELL_IN, {
      ws: 6, hs: 2, sy: 0.2, sx: 1.0, sz: 0.75,
      y: 0.32, x: -0.28,
      rx: -0.8, ry: 0.1,
      hex2: SHELL_IN_HI
    }));

    // === HINGE AREA (where the two shells connect) ===========================
    parts.push(sph(0.12, SHELL_OUT_DK, {
      ws: 4, hs: 2,
      x: -0.65, y: 0.1, z: 0.0
    }));

    // === WATER DROPLETS / BRINE (tiny glistening dots) =======================
    parts.push(sph(0.04, 0xd0e8f0, { ws: 3, hs: 2, x: 0.25, y: 0.25, z: 0.2 }));
    parts.push(sph(0.03, 0xd0e8f0, { ws: 3, hs: 2, x: -0.1, y: 0.22, z: -0.15 }));
    parts.push(sph(0.035, 0xd0e8f0, { ws: 3, hs: 2, x: 0.0, y: 0.24, z: 0.25 }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_BIGCHICKEN = COL_OYSTER;

export default COL_OYSTER;
