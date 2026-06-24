/**
 * @file packs/nantou/collectibles/sunmoon_tea.js — Roll Formosa Nantou pack.
 *
 * 日月潭紅茶 (Sun Moon Lake Red Tea) — collectibleId 11. A traditional red tea
 * bottle/container, representing the famous Assam black tea grown around Sun
 * Moon Lake. Features the distinctive amber-red tea color visible through a
 * glass bottle with a wooden cap.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

const GLASS = 0xc86040;       // amber glass with red tea color
const GLASS_HI = 0xe08050;    // glass highlight
const TEA = 0x8a3020;         // dark red tea inside
const CAP_WOOD = 0x6a4a30;    // wooden cap
const CAP_DARK = 0x4a3420;    // cap shadow
const LABEL = 0xf8f0e0;       // cream label

export const COL_SUNMOON_TEA = {
  id: 'sunmoon_tea',
  name: '日月潭紅茶',
  collectibleId: 11,
  colorHex: 0xc86040,

  buildGeometry(rng) {
    const parts = [];
    const j = (rng ? rng() - 0.5 : 0) * 0.02;

    // --- Bottle body (cylindrical glass bottle) ---
    parts.push(cyl(0.35, 0.32, 1.1, 10, GLASS, { y: 0.55, hex2: GLASS_HI }));

    // --- Tea inside (slightly smaller, darker) ---
    parts.push(cyl(0.28, 0.26, 0.9, 8, TEA, { y: 0.5 }));

    // --- Bottle neck (narrower) ---
    parts.push(cyl(0.18, 0.22, 0.25, 8, GLASS, { y: 1.22 + j, hex2: GLASS_HI }));

    // --- Wooden cap/cork ---
    parts.push(cyl(0.2, 0.2, 0.15, 8, CAP_WOOD, { y: 1.42, hex2: CAP_DARK }));
    parts.push(cyl(0.22, 0.22, 0.06, 8, CAP_DARK, { y: 1.52 }));

    // --- Label band (white/cream around bottle) ---
    parts.push(cyl(0.36, 0.36, 0.25, 10, LABEL, { y: 0.6 }));

    // --- Bottle base (thicker glass bottom) ---
    parts.push(cyl(0.36, 0.36, 0.1, 10, GLASS_HI, { y: 0.05 }));

    return finish(parts);
  },
};

export default COL_SUNMOON_TEA;
