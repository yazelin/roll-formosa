/**
 * @file packs/penghu/collectibles/xiaolongbao.js — Roll Formosa Penghu pack,
 * COLLECTIBLE (rare-album item the ball rolls up).
 *
 * COL_DRIED_SQUID — 小卷乾 (dried squid). A traditional Penghu specialty:
 * small squid that have been sun-dried on the harbor. Silhouette: a flat,
 * amber-brown dried squid with curled tentacles, slightly twisted body, and
 * the distinctive tapered mantle shape. Often displayed spread out on a
 * bamboo rack or laying flat. The amber-orange translucent color and the
 * tentacle cluster are the unmistakable reads.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a flat tapered squid body with curling tentacles at one end.
 *
 * Palette: amber-orange dried squid (sun-dried translucent color), darker
 * spots, curled tentacles. rng() only nudges tentacle curl — never structure.
 * Budget: <= 350 triangles.
 */

import { cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// Palette: amber-orange dried seafood colors
const SQUID = 0xd4883a;       // amber-orange dried squid body
const SQUID_HI = 0xe8a050;    // lighter translucent highlights
const SQUID_DK = 0xa86428;    // darker spots / shadow areas
const TENTACLE = 0xc87a32;    // tentacle color
const TENTACLE_DK = 0x9a5a20; // darker tentacle tips
const EYE = 0x1a1a1a;         // small dark eye spot

/** @type {CollectibleDef} */
export const COL_DRIED_SQUID = {
  id: 'dried_squid_col',
  name: '小卷乾',
  collectibleId: 4,
  colorHex: SQUID, // amber dried squid — the body read color

  buildGeometry(rng) {
    const tentacleJit = (rng() - 0.5) * 0.08; // tiny non-structural curl wobble

    const parts = [];

    // === MANTLE (main squid body) ============================================
    // Tapered cone shape — wide at the tentacle end, pointed at the tail
    // Flattened (dried and pressed) so sy is compressed
    parts.push(cone(0.55, 1.6, 8, SQUID, {
      y: 0.3, sy: 0.5, hex2: SQUID_HI
    }));

    // Mantle surface texture — slight ridges from drying
    parts.push(cyl(0.48, 0.35, 0.3, 6, SQUID_HI, { y: 0.1, sy: 0.4 }));
    parts.push(cyl(0.42, 0.28, 0.25, 6, SQUID, { y: 0.35, sy: 0.4, hex2: SQUID_DK }));

    // Pointed tail fin at the end (the triangular fins)
    parts.push(cone(0.3, 0.5, 4, SQUID_HI, {
      y: 0.95, sy: 0.3, ry: PI / 4, hex2: SQUID
    }));
    // Side fins (flattened triangular shapes)
    parts.push(sph(0.25, SQUID, {
      ws: 4, hs: 2, sy: 0.2, sx: 1.5,
      x: 0.45, y: 0.5, hex2: SQUID_HI
    }));
    parts.push(sph(0.25, SQUID, {
      ws: 4, hs: 2, sy: 0.2, sx: 1.5,
      x: -0.45, y: 0.5, hex2: SQUID_HI
    }));

    // === HEAD SECTION (between mantle and tentacles) =========================
    parts.push(cyl(0.5, 0.55, 0.25, 8, SQUID, { y: -0.35, sy: 0.6, hex2: SQUID_DK }));

    // Small dark eye spots
    parts.push(sph(0.08, EYE, { ws: 4, hs: 2, x: 0.35, y: -0.3, z: 0.15 }));
    parts.push(sph(0.08, EYE, { ws: 4, hs: 2, x: -0.35, y: -0.3, z: 0.15 }));

    // === TENTACLES (curled cluster at one end) ===============================
    // 8 tentacles arranged in a ring, curling outward and down
    const TENTACLES = 8;
    for (let i = 0; i < TENTACLES; i++) {
      const angle = (i / TENTACLES) * PI * 2;
      const curl = 0.3 + tentacleJit * (i % 2 === 0 ? 1 : -1);
      const r = 0.28 + (i % 2) * 0.06; // alternating lengths

      // Each tentacle is a thin tapered cylinder curving outward
      parts.push(cyl(0.06, 0.03, 0.5, 4, TENTACLE, {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        y: -0.7,
        rx: curl * Math.cos(angle),
        rz: curl * Math.sin(angle),
        hex2: TENTACLE_DK
      }));
    }

    // Two longer tentacles (the feeding tentacles)
    parts.push(cyl(0.05, 0.02, 0.7, 4, TENTACLE, {
      x: 0.15, z: 0.35, y: -0.85,
      rx: 0.5, rz: -0.2,
      hex2: TENTACLE_DK
    }));
    parts.push(cyl(0.05, 0.02, 0.7, 4, TENTACLE, {
      x: -0.15, z: 0.35, y: -0.85,
      rx: 0.5, rz: 0.2,
      hex2: TENTACLE_DK
    }));

    // === DRIED TEXTURE SPOTS =================================================
    // Dark spots scattered on the body (characteristic of dried squid)
    const spots = [
      [0.15, 0.2, 0.22],
      [-0.2, 0.4, 0.18],
      [0.25, 0.6, 0.15],
      [-0.1, 0.1, 0.24],
    ];
    for (const [sx, sy, sz] of spots) {
      parts.push(sph(0.06, SQUID_DK, { ws: 3, hs: 2, x: sx, y: sy, z: sz }));
    }

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_XLB = COL_DRIED_SQUID;

export default COL_DRIED_SQUID;
