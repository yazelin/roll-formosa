/**
 * @file packs/matsu/collectibles/mazu_statue.js — Roll Formosa Matsu pack.
 *
 * 媽祖神像 (Mazu Statue) — code 94. A small figurine of the sea goddess Mazu,
 * the deity after whom the Matsu islands are named. According to legend, her
 * body washed ashore here. The statue shows Mazu in traditional robes with
 * an elaborate headdress, often in red and gold colors, serene and dignified.
 *
 * <= 350 triangles.
 */

import { sph, cyl, cone, box, finish, PI } from '../geomHelpers.js';

const ROBE = 0xc41e3a;       // red ceremonial robe
const ROBE_HI = 0xe03050;    // lighter red
const GOLD = 0xd4a020;       // gold trim/crown
const GOLD_HI = 0xf0c040;    // bright gold
const FACE = 0xf0d8c0;       // skin tone
const HAIR = 0x1a1a1a;       // black hair

export const COL_MAZU_STATUE = {
  id: 'mazu_statue',
  name: '媽祖神像',
  colorHex: 0xc41e3a,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Base pedestal
    parts.push(cyl(0.4, 0.45, 0.15, 8, GOLD, { y: 0.075, hex2: GOLD_HI }));

    // Lower robe (wide flowing skirt)
    parts.push(cone(0.55, 0.8, 8, ROBE, { y: 0.55, hex2: ROBE_HI }));

    // Upper robe/torso
    parts.push(sph(0.35, ROBE, { ws: 7, hs: 5, sy: 0.9, y: 1.0, hex2: ROBE_HI }));

    // Gold belt/sash
    parts.push(cyl(0.36, 0.36, 0.08, 8, GOLD, { y: 0.85, hex2: GOLD_HI }));

    // Sleeves (wide ceremonial sleeves)
    parts.push(sph(0.2, ROBE, { ws: 5, hs: 4, sx: 1.3, sy: 0.7, x: -0.4, y: 0.95, hex2: ROBE_HI }));
    parts.push(sph(0.2, ROBE, { ws: 5, hs: 4, sx: 1.3, sy: 0.7, x: 0.4, y: 0.95, hex2: ROBE_HI }));

    // Hands (clasped in front, holding tablet/scepter)
    parts.push(sph(0.12, FACE, { ws: 4, hs: 3, x: 0, y: 0.9, z: 0.28 }));

    // Head
    parts.push(sph(0.22, FACE, { ws: 6, hs: 5, y: 1.35 }));

    // Hair (black, styled up)
    parts.push(sph(0.2, HAIR, { ws: 5, hs: 4, sy: 0.9, y: 1.42, z: -0.08 }));

    // Elaborate headdress/crown (Mazu's distinctive imperial crown)
    parts.push(box(0.45, 0.08, 0.15, GOLD, { y: 1.55, hex2: GOLD_HI }));
    // Crown tiers
    parts.push(box(0.35, 0.12, 0.1, GOLD_HI, { y: 1.65 }));
    parts.push(box(0.25, 0.1, 0.08, GOLD, { y: 1.74, hex2: GOLD_HI }));

    // Crown decorations (beaded curtain effect)
    parts.push(cyl(0.02, 0.02, 0.15, 4, GOLD, { x: -0.18, y: 1.48, z: 0.1 }));
    parts.push(cyl(0.02, 0.02, 0.15, 4, GOLD, { x: 0.18, y: 1.48, z: 0.1 }));
    parts.push(cyl(0.02, 0.02, 0.12, 4, GOLD, { x: -0.12, y: 1.46, z: 0.12 }));
    parts.push(cyl(0.02, 0.02, 0.12, 4, GOLD, { x: 0.12, y: 1.46, z: 0.12 }));

    // Face features (simple)
    parts.push(box(0.04, 0.02, 0.03, HAIR, { x: -0.06, y: 1.36, z: 0.18 })); // eye
    parts.push(box(0.04, 0.02, 0.03, HAIR, { x: 0.06, y: 1.36, z: 0.18 }));  // eye

    // Gold trim on robe front
    parts.push(box(0.06, 0.5, 0.02, GOLD, { y: 0.7, z: 0.32 }));

    return finish(parts);
  },
};

export default COL_MAZU_STATUE;
