/**
 * @file packs/tainan/landmarks/miramar_wheel.js — Roll Formosa Tainan pack, hero LANDMARK.
 *
 * 安平燈塔 (Anping Lighthouse) — the small white lighthouse marking the 安平 coast.
 * Silhouette: a simple tapered white tower (square-ish, slightly narrowing toward
 * the top) banded with a red ring, topped by a red lantern room circled by a
 * small gallery railing, and capped by a little dome with a finial.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so the tall slender white tower with its red cap carries the
 * read. rng() only nudges the lamp glow tint — never structure. <= 600 tris.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const WHITE = 0xf2f2f0; // white tower (hero color)
const WHITE_SH = 0xd8d8d4; // shaded tower side
const WHITE_HI = 0xfdfdfc; // sunlit tower
const RED = 0xc8332a; // red band / lantern room
const RED_HI = 0xe2503f; // lit red
const GALLERY = 0x9aa0a4; // grey gallery railing
const DOME = 0x4a4f54; // dark domed cap
const GLASS = 0xbfe2ef; // lamp glazing
const LAMP = 0xffe08a; // warm lamp glow
const BASE = 0xc9c4b6; // stone base

export const NM_WHEEL = {
  id: 'miramar_wheel',
  name: '安平燈塔',
  colorHex: WHITE,

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x080604; // tiny lamp glow nudge
    const lamp = LAMP - tint;

    const parts = [];

    const baseY = -1.4;

    // === STONE BASE =========================================================
    parts.push(box(1.1, 0.3, 1.1, BASE, { y: baseY + 0.15, hex2: WHITE_SH }));

    // === TAPERED WHITE TOWER (square-ish, slightly narrowing) ===============
    // A tall 4-sided frustum (cone seg=4, rotated so a flat face fronts) reads as
    // a slightly tapered square tower.
    const towH = 2.6;
    const towY = baseY + 0.3;
    parts.push(cone(1.0, towH, 4, WHITE, {
      sx: 0.42, sz: 0.42, ry: PI / 4, y: towY + towH / 2, hex2: WHITE_HI,
    }));
    // A red band ring around the mid tower.
    parts.push(cone(1.0, 0.3, 4, RED, {
      sx: 0.5, sz: 0.5, ry: PI / 4, y: towY + towH * 0.55, hex2: RED_HI,
    }));
    // A small dark doorway at the base.
    parts.push(box(0.18, 0.4, 0.06, DOME, { y: towY + 0.22, z: 0.36 }));

    // === GALLERY (a platform + railing ring near the top) ===================
    const galY = towY + towH;
    parts.push(cyl(0.42, 0.42, 0.08, 12, GALLERY, { y: galY, hex2: WHITE_HI })); // gallery deck
    // Railing ring.
    parts.push(torus(0.4, 0.025, 4, 12, GALLERY, { rx: HALF_PI, y: galY + 0.18 }));
    // A few railing posts.
    const nPost = 8;
    for (let i = 0; i < nPost; i++) {
      const a = (i / nPost) * PI * 2;
      parts.push(box(0.02, 0.18, 0.02, GALLERY, { x: Math.cos(a) * 0.4, z: Math.sin(a) * 0.4, y: galY + 0.1 }));
    }

    // === RED LANTERN ROOM ===================================================
    const lampY = galY + 0.36;
    parts.push(cyl(0.26, 0.28, 0.42, 10, RED, { y: lampY, hex2: RED_HI })); // lantern room wall
    // Glazing band (the light room glass).
    parts.push(cyl(0.27, 0.27, 0.24, 10, GLASS, { y: lampY + 0.02, hex2: 0xaee0f4, open: true }));
    // Warm lamp core glow inside.
    parts.push(sph(0.14, lamp, { y: lampY + 0.02, ws: 8, hs: 6 }));

    // === DOMED CAP + FINIAL =================================================
    const capY = lampY + 0.21;
    parts.push(sph(0.28, DOME, { y: capY, ws: 10, hs: 5, thetaLen: HALF_PI, hex2: 0x6a6f74 })); // dome
    parts.push(cyl(0.03, 0.04, 0.16, 6, GALLERY, { y: capY + 0.3 })); // finial mast
    parts.push(sph(0.05, GALLERY, { y: capY + 0.42, ws: 6, hs: 4 })); // finial ball

    return finish(parts);
  },
};

export default NM_WHEEL;
