/**
 * @file packs/yunlin/collectibles/peanut.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_PEANUT — 雲林花生 (Yunlin Peanut). Yunlin is Taiwan's top peanut-producing county.
 * A peanut pod with its characteristic bumpy shell and elongated double-lobed shape.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SHELL = 0xc8a878;       // peanut shell tan
const SHELL_HI = 0xe0c8a0;    // shell highlight
const SHELL_DARK = 0xa08058;  // shell shadow/groove
const NUT = 0xd8b080;         // inner nut color

export const COL_PEANUT = {
  id: 'peanut',
  name: '雲林花生',
  colorHex: 0xc8a878,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Two lobes of the peanut shell
    // Left lobe (slightly larger)
    parts.push(sph(0.35, SHELL, {
      ws: 7, hs: 5, x: -0.22, y: 0.35,
      sx: 0.9, sy: 1.1, sz: 0.85,
      hex2: SHELL_HI
    }));

    // Right lobe
    parts.push(sph(0.32, SHELL, {
      ws: 7, hs: 5, x: 0.22, y: 0.32,
      sx: 0.85, sy: 1.0, sz: 0.8,
      hex2: SHELL_HI
    }));

    // Center pinch/groove connecting the two lobes
    parts.push(cyl(0.18, 0.2, 0.2, 5, SHELL_DARK, {
      y: 0.33, rx: HALF_PI * 0.1 + j
    }));

    // Shell texture bumps (small spheres on surface)
    // Left lobe bumps
    parts.push(sph(0.08, SHELL_HI, { ws: 4, hs: 3, x: -0.35, y: 0.5, z: 0.15 }));
    parts.push(sph(0.07, SHELL_HI, { ws: 4, hs: 3, x: -0.28, y: 0.2, z: -0.18 }));
    parts.push(sph(0.06, SHELL_HI, { ws: 4, hs: 3, x: -0.12, y: 0.42, z: 0.2 }));

    // Right lobe bumps
    parts.push(sph(0.07, SHELL_HI, { ws: 4, hs: 3, x: 0.32, y: 0.45, z: 0.12 }));
    parts.push(sph(0.06, SHELL_HI, { ws: 4, hs: 3, x: 0.25, y: 0.18, z: -0.15 }));
    parts.push(sph(0.05, SHELL_HI, { ws: 4, hs: 3, x: 0.38, y: 0.28, z: 0.08 }));

    // Stem end
    parts.push(cyl(0.05, 0.08, 0.08, 4, SHELL_DARK, { x: -0.45, y: 0.35, rz: HALF_PI }));

    return finish(parts);
  },
};

export default COL_PEANUT;
