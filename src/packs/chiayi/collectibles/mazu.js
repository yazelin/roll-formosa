/**
 * @file packs/chiayi/collectibles/mazu.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_MAZU — 媽祖 (Mazu). The sea goddess widely worshipped in Taiwan, especially
 * important in coastal Chiayi and nearby Beigang. Depicted in imperial robes
 * with distinctive flat ceremonial headdress.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const FACE = 0xf0d8c8;      // serene face
const ROBE = 0xd82030;      // imperial red
const ROBE_HI = 0xe84050;   // robe highlight
const GOLD = 0xe8c030;      // gold trim
const CROWN = 0x282828;     // black crown base

export const COL_MAZU = {
  id: 'mazu',
  name: '媽祖',
  colorHex: 0xd82030,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Robe body (wide flowing imperial robe)
    parts.push(cone(0.4, 0.65, 8, ROBE, { y: 0.325, hex2: ROBE_HI }));

    // Gold trim at hem
    parts.push(cyl(0.4, 0.41, 0.06, 8, GOLD, { y: 0.03 }));

    // Chest/upper robe
    parts.push(cyl(0.2, 0.25, 0.2, 6, ROBE, { y: 0.55, hex2: ROBE_HI }));

    // Gold collar/neckpiece
    parts.push(cyl(0.18, 0.2, 0.05, 6, GOLD, { y: 0.65 }));

    // Face
    parts.push(sph(0.15, FACE, { ws: 6, hs: 5, y: 0.8, hex2: 0xf8e8d8 }));

    // Serene eyes (closed/gentle)
    parts.push(box(0.05, 0.015, 0.02, 0x3a3030, { x: -0.05, y: 0.8, z: 0.13 }));
    parts.push(box(0.05, 0.015, 0.02, 0x3a3030, { x: 0.05, y: 0.8, z: 0.13 }));

    // Flat ceremonial headdress (冕旒)
    parts.push(box(0.35, 0.06, 0.2, CROWN, { y: 0.98 + j }));
    parts.push(box(0.38, 0.03, 0.22, GOLD, { y: 1.02 }));

    // Beaded curtain (strings hanging from front of crown)
    for (const bx of [-0.12, -0.04, 0.04, 0.12]) {
      parts.push(cyl(0.012, 0.012, 0.2, 3, GOLD, { x: bx, y: 0.88, z: 0.18 }));
    }

    // Crown ornament
    parts.push(sph(0.04, GOLD, { ws: 4, hs: 3, y: 1.06 }));

    // Sleeves (wide imperial style)
    parts.push(cone(0.12, 0.18, 5, ROBE, { x: -0.3, y: 0.45, rz: 0.6, hex2: ROBE_HI }));
    parts.push(cone(0.12, 0.18, 5, ROBE, { x: 0.3, y: 0.45, rz: -0.6, hex2: ROBE_HI }));

    // Hands (holding position)
    parts.push(sph(0.045, FACE, { ws: 4, hs: 3, x: -0.12, y: 0.55, z: 0.2 }));
    parts.push(sph(0.045, FACE, { ws: 4, hs: 3, x: 0.12, y: 0.55, z: 0.2 }));

    return finish(parts);
  },
};

export default COL_MAZU;
