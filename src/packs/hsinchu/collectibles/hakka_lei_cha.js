/**
 * @file packs/hsinchu/collectibles/hakka_lei_cha.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_LEI_CHA — 客家擂茶 (Hakka Lei Cha). Traditional Hakka ground tea drink,
 * very popular in Hsinchu's Beipu area. Silhouette: a ceramic bowl filled with
 * the characteristic green-brown ground tea mixture, topped with puffed rice
 * and peanuts, with a wooden grinding pestle nearby.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { cyl, sph, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BOWL = 0xc8b8a0;        // ceramic bowl tan
const BOWL_HI = 0xd8c8b0;     // bowl highlight
const TEA = 0x6a7a4a;         // green-brown lei cha
const TEA_HI = 0x7a8a5a;      // tea highlight
const PUFFED = 0xf8f0e0;      // puffed rice white
const PEANUT = 0xc09060;      // roasted peanut
const WOOD = 0x8a6a4a;        // wooden pestle

export const COL_LEI_CHA = {
  id: 'hakka_lei_cha',
  name: '客家擂茶',
  collectibleId: 11,
  colorHex: TEA,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040402);
    const tea = TEA + t;
    const parts = [];

    // --- ceramic grinding BOWL (mortar style, wider) ---
    parts.push(cyl(0.8, 0.6, 0.5, 10, BOWL, { y: 0.25, hex2: BOWL_HI }));
    // bowl foot ring
    parts.push(cyl(0.5, 0.5, 0.08, 8, 0xb0a090, { y: 0.04 }));
    // bowl rim
    parts.push(cyl(0.82, 0.8, 0.06, 10, BOWL_HI, { y: 0.52 }));

    // --- LEI CHA tea mixture (ground tea paste surface) ---
    parts.push(cyl(0.72, 0.72, 0.12, 10, tea, { y: 0.44, hex2: TEA_HI }));
    // swirled texture on surface
    parts.push(sph(0.55, TEA_HI, { ws: 7, hs: 4, sy: 0.2, y: 0.52 }));

    // --- puffed RICE toppings (scattered white puffs) ---
    parts.push(sph(0.08, PUFFED, { ws: 4, hs: 3, x: 0.2, y: 0.58, z: 0.15 }));
    parts.push(sph(0.07, PUFFED, { ws: 4, hs: 3, x: -0.18, y: 0.56, z: 0.22 }));
    parts.push(sph(0.06, PUFFED, { ws: 4, hs: 3, x: 0.28, y: 0.55, z: -0.12 }));
    parts.push(sph(0.07, PUFFED, { ws: 4, hs: 3, x: -0.25, y: 0.57, z: -0.18 }));
    parts.push(sph(0.05, PUFFED, { ws: 4, hs: 3, x: 0.05, y: 0.58, z: 0.3 }));
    parts.push(sph(0.06, PUFFED, { ws: 4, hs: 3, x: 0.1, y: 0.56, z: -0.28 }));

    // --- roasted PEANUT pieces ---
    parts.push(sph(0.06, PEANUT, { ws: 4, hs: 3, sx: 1.3, x: 0.35, y: 0.54, z: 0.08 }));
    parts.push(sph(0.05, PEANUT, { ws: 4, hs: 3, sx: 1.2, x: -0.32, y: 0.55, z: 0.05 }));
    parts.push(sph(0.055, PEANUT, { ws: 4, hs: 3, sx: 1.25, x: 0, y: 0.56, z: -0.32 }));

    // --- wooden grinding PESTLE (leaning against bowl) ---
    // pestle shaft
    parts.push(cyl(0.08, 0.07, 0.8, 6, WOOD, { x: 0.65, y: 0.7, z: 0.2, rz: -0.5, rx: 0.15, hex2: 0x9a7a5a }));
    // pestle grinding end (rounded)
    parts.push(sph(0.12, 0x7a5a3a, { ws: 5, hs: 3, x: 0.35, y: 0.38, z: 0.12, sy: 1.2 }));
    // handle end
    parts.push(cyl(0.09, 0.08, 0.1, 5, 0x9a7a5a, { x: 0.92, y: 1.0, z: 0.28, rz: -0.5, rx: 0.15 }));

    return finish(parts);
  },
};

export default COL_LEI_CHA;
