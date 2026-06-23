/**
 * @file packs/chiayi/collectibles/santaizi.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_SANTAIZI — 三太子 (Third Prince / Nezha). The energetic child deity figure
 * popular in Taiwanese temple parades. Colorful costume with the distinctive
 * two-ring hairstyle and playful pose. A Taiwan-wide icon, especially popular
 * in southern temple festivals.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const FACE = 0xf0d8c0;      // skin tone
const HAIR = 0x1a1a1a;      // black hair
const GOLD = 0xe8c030;      // gold accessories
const RED = 0xd82828;       // red costume
const BLUE = 0x2858a8;      // blue accent

export const COL_SANTAIZI = {
  id: 'santaizi',
  name: '三太子',
  colorHex: 0xe8c030,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Body/costume
    parts.push(cyl(0.22, 0.25, 0.45, 6, RED, { y: 0.225, hex2: 0xe84040 }));

    // Face
    parts.push(sph(0.22, FACE, { ws: 6, hs: 5, y: 0.65, hex2: 0xf8e8d8 }));

    // Eyes (cute style)
    parts.push(sph(0.04, 0x1a1a1a, { ws: 3, hs: 2, x: -0.08, y: 0.68, z: 0.18 }));
    parts.push(sph(0.04, 0x1a1a1a, { ws: 3, hs: 2, x: 0.08, y: 0.68, z: 0.18 }));

    // Cheek blush
    parts.push(sph(0.04, 0xff8080, { ws: 3, hs: 2, x: -0.14, y: 0.62, z: 0.14 }));
    parts.push(sph(0.04, 0xff8080, { ws: 3, hs: 2, x: 0.14, y: 0.62, z: 0.14 }));

    // Hair buns (two rings style)
    parts.push(sph(0.12, HAIR, { ws: 5, hs: 4, x: -0.2, y: 0.85, z: -0.05 }));
    parts.push(sph(0.12, HAIR, { ws: 5, hs: 4, x: 0.2, y: 0.85, z: -0.05 }));

    // Gold headpiece/crown
    parts.push(box(0.25, 0.08, 0.12, GOLD, { y: 0.88, z: 0.1 + j }));
    parts.push(cone(0.08, 0.12, 4, GOLD, { y: 0.98 }));

    // Arms
    parts.push(cyl(0.06, 0.07, 0.22, 5, RED, { x: -0.28, y: 0.38, rz: 0.6 }));
    parts.push(cyl(0.06, 0.07, 0.22, 5, RED, { x: 0.28, y: 0.38, rz: -0.6 }));

    // Hands
    parts.push(sph(0.05, FACE, { ws: 4, hs: 3, x: -0.38, y: 0.48 }));
    parts.push(sph(0.05, FACE, { ws: 4, hs: 3, x: 0.38, y: 0.48 }));

    // Sash/belt
    parts.push(box(0.26, 0.06, 0.26, BLUE, { y: 0.12 }));

    // Fire wheels at feet (his signature)
    parts.push(cyl(0.15, 0.15, 0.04, 8, 0xff6020, { x: -0.12, y: 0.02, z: 0, rx: HALF_PI }));
    parts.push(cyl(0.15, 0.15, 0.04, 8, 0xff6020, { x: 0.12, y: 0.02, z: 0, rx: HALF_PI }));

    return finish(parts);
  },
};

export default COL_SANTAIZI;
