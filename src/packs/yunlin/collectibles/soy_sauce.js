/**
 * @file packs/yunlin/collectibles/soy_sauce.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_SOY_SAUCE — 西螺醬油 (Xiluo Soy Sauce). Yunlin's Xiluo Township is famous for
 * its traditional soy sauce breweries. A classic dark glass bottle with a red label,
 * showcasing the deep amber-black liquid inside.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const GLASS = 0x2a1810;       // dark glass bottle
const GLASS_HI = 0x3a2820;    // glass highlight
const SAUCE = 0x1a0c08;       // dark soy sauce
const LABEL = 0xc82020;       // red label
const LABEL_HI = 0xe83838;    // label highlight
const CAP = 0x1a1a1a;         // black cap

export const COL_SOY_SAUCE = {
  id: 'soy_sauce',
  name: '西螺醬油',
  colorHex: 0x2a1810,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Bottle body - main glass container
    parts.push(cyl(0.28, 0.3, 0.7, 8, GLASS, { y: 0.35, hex2: GLASS_HI }));

    // Soy sauce visible inside (slightly smaller cylinder)
    parts.push(cyl(0.24, 0.26, 0.55, 6, SAUCE, { y: 0.28 }));

    // Bottle shoulder (tapering to neck)
    parts.push(cyl(0.12, 0.28, 0.15, 6, GLASS, { y: 0.775, hex2: GLASS_HI }));

    // Bottle neck
    parts.push(cyl(0.1, 0.12, 0.2, 6, GLASS, { y: 0.95, hex2: GLASS_HI }));

    // Cap
    parts.push(cyl(0.12, 0.12, 0.1, 6, CAP, { y: 1.1 }));
    parts.push(sph(0.08, CAP, { ws: 4, hs: 3, y: 1.18 }));

    // Red label wrapped around bottle
    parts.push(cyl(0.29, 0.31, 0.35, 8, LABEL, { y: 0.35 + j, hex2: LABEL_HI }));

    // Label text/decoration (gold stripe on label)
    parts.push(cyl(0.295, 0.305, 0.05, 8, 0xd4a840, { y: 0.35 }));

    // Base of bottle
    parts.push(cyl(0.32, 0.3, 0.05, 8, GLASS, { y: 0.025 }));

    return finish(parts);
  },
};

export default COL_SOY_SAUCE;
