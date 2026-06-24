/**
 * @file packs/penghu/collectibles/boba.js — Roll Formosa Penghu pack, COLLECTIBLE.
 *
 * COL_CACTUS_ICE — 仙人掌冰 (cactus ice cream). Silhouette: a bright magenta-pink
 * soft-serve ice cream swirl on a waffle cone, made from Penghu's signature
 * prickly pear cactus fruit. The swirl is the classic soft-serve twist rising
 * to a point, sitting atop a crispy golden-brown waffle cone with a grid pattern.
 * The vivid pink-magenta color is the unmistakable cactus-fruit read.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are what we
 * author here. <= 350 triangles (collectible budget). rng() only nudges the
 * ice cream tint, never structure.
 */

import { cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

// Palette: bright cactus-fruit magenta ice cream, golden waffle cone
const ICE = 0xe54d8a;       // bright cactus-fruit magenta
const ICE_HI = 0xf76ba3;    // lighter ice cream highlight (swirl top)
const ICE_DK = 0xc73b72;    // deeper magenta shadow
const CONE = 0xc8923a;      // waffle cone golden-brown
const CONE_DK = 0x9a6b22;   // waffle cone darker lines
const CONE_HI = 0xe0a84e;   // waffle cone highlight

export const COL_CACTUS_ICE = {
  id: 'cactus_ice',
  name: '仙人掌冰',
  collectibleId: 1,
  colorHex: ICE, // bright cactus magenta — the signature color

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const ice = ICE + t;

    const parts = [];

    // --- WAFFLE CONE: crispy pointed cone base ----------------------------
    parts.push(cone(0.52, 1.4, 6, CONE, { y: -0.4, hex2: CONE_DK }));
    // Cone rim ring at the top
    parts.push(cyl(0.54, 0.52, 0.08, 6, CONE_HI, { y: 0.32 }));
    // Waffle grid texture (reduced)
    parts.push(cyl(0.35, 0.18, 0.06, 5, CONE_DK, { y: -0.2 }));

    // --- ICE CREAM SWIRL: soft-serve twist rising up ----------------------
    // Base dome
    parts.push(sph(0.48, ice, { ws: 6, hs: 3, sy: 0.7, y: 0.52, hex2: ICE_HI }));

    // Soft-serve swirl layers (reduced)
    const swirl = [
      { y: 0.75, r: 0.42, x: 0.0, z: 0.0 },
      { y: 1.00, r: 0.35, x: 0.06, z: 0.05 },
      { y: 1.22, r: 0.28, x: -0.05, z: 0.06 },
      { y: 1.42, r: 0.20, x: 0.04, z: -0.04 },
    ];
    for (const s of swirl) {
      parts.push(sph(s.r, ice, {
        ws: 5, hs: 2, sy: 0.5,
        x: s.x, y: s.y, z: s.z,
        hex2: ICE_HI
      }));
    }

    // Pointed swirl tip
    parts.push(cone(0.10, 0.22, 4, ICE_HI, { y: 1.58, hex2: ice }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_BOBA = COL_CACTUS_ICE;

export default COL_CACTUS_ICE;
