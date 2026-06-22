/**
 * @file packs/taitung/collectibles/mazu.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_MAZU — 媽祖神像 (Mazu Goddess Statue). The sea goddess Mazu is worshipped
 * throughout Taiwan, including Taitung's coastal communities. Small shrine
 * figures show her in imperial robes with a ceremonial tablet.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_MAZU = {
  id: 'mazu',
  name: '媽祖神像',
  collectibleId: 9,
  colorHex: 0xc84040,

  buildGeometry(rng) {
    const ROBE = 0xc84040; // red imperial robe
    const ROBE_GOLD = 0xe8b848;
    const FACE = 0xe8d0b0;
    const CROWN = 0xe8c848;
    const BEADS = 0xf0e8d0;
    const BASE = 0x5a4a3a;

    const parts = [];

    // Base platform
    parts.push(box(0.7, 0.15, 0.5, BASE, { y: 0.08 }));

    // Seated body in robes
    parts.push(box(0.55, 0.6, 0.4, ROBE, { y: 0.55, hex2: 0xa83030 }));

    // Sleeve details
    parts.push(box(0.7, 0.2, 0.35, ROBE_GOLD, { y: 0.6 }));
    parts.push(box(0.65, 0.15, 0.32, ROBE, { y: 0.75 }));

    // Head
    parts.push(sph(0.2, FACE, { ws: 8, hs: 6, y: 1.05 }));

    // Imperial crown (elaborate headdress)
    parts.push(box(0.35, 0.12, 0.25, CROWN, { y: 1.22 }));
    parts.push(box(0.28, 0.18, 0.2, CROWN, { y: 1.35, hex2: 0xd8a838 }));
    // Crown decorations
    parts.push(cyl(0.03, 0.03, 0.12, 6, CROWN, { x: -0.12, y: 1.45 }));
    parts.push(cyl(0.03, 0.03, 0.12, 6, CROWN, { x: 0.12, y: 1.45 }));
    parts.push(sph(0.04, 0xc84040, { ws: 4, hs: 3, y: 1.52 }));

    // Bead curtains from crown
    for (let i = -2; i <= 2; i++) {
      parts.push(cyl(0.015, 0.015, 0.15, 4, BEADS, {
        x: i * 0.08,
        y: 1.12,
        z: 0.15,
      }));
    }

    // Hands holding ceremonial tablet
    parts.push(box(0.12, 0.25, 0.04, 0xd8c080, { y: 0.75, z: 0.22 })); // tablet
    parts.push(sph(0.08, FACE, { ws: 5, hs: 4, x: -0.12, y: 0.72, z: 0.18 })); // hand
    parts.push(sph(0.08, FACE, { ws: 5, hs: 4, x: 0.12, y: 0.72, z: 0.18 })); // hand

    return finish(parts);
  },
};

export default COL_MAZU;
