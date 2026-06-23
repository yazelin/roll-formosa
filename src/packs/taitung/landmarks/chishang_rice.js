/**
 * @file packs/taitung/landmarks/chishang_rice.js — Roll Formosa Taitung pack, landmark 2.
 *
 * NM_CHISHANG — 池上飯包文化故事館, the famous Chishang lunchbox cultural museum
 * and restaurant, known for its wooden Japanese-style architecture and
 * connection to Taiwan's best rice from the Chishang rice paddies.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

const WOOD = 0xa87a4a; // warm wood
const WOOD_LO = 0x7a5a2a; // darker wood
const ROOF = 0x4a3a2a; // dark tile roof
const ROOF_HI = 0x5a4a36; // lighter roof
const PAPER = 0xf8f0e4; // shoji paper white
const TRIM = 0x8a6a4a; // wood trim

export const NM_CHISHANG = {
  id: 'chishang_rice',
  name: '池上飯包文化故事館',
  landmarkId: 2,
  dioramaRHint: 40,
  colorHex: WOOD,

  buildGeometry(rng) {
    const parts = [];

    // Platform
    parts.push(box(2.2, 0.12, 1.6, 0x706860, { y: 0.06 }));

    // Raised wooden floor platform
    parts.push(box(2.0, 0.08, 1.4, WOOD, { y: 0.18 }));

    // Main building body
    parts.push(box(1.8, 0.7, 1.2, PAPER, { y: 0.57, hex2: WOOD }));

    // Japanese-style hip roof
    parts.push(box(2.1, 0.12, 1.5, ROOF, { y: 0.98, hex2: ROOF_HI }));
    parts.push(box(1.9, 0.12, 1.3, ROOF_HI, { y: 1.12, hex2: ROOF }));
    parts.push(box(1.6, 0.1, 1.0, ROOF, { y: 1.22 }));

    // Wooden frame posts
    const postPositions = [
      [-0.8, 0.3], [-0.8, -0.3], [0.8, 0.3], [0.8, -0.3],
      [0, 0.5], [0, -0.5],
    ];
    for (const [px, pz] of postPositions) {
      parts.push(box(0.06, 0.55, 0.06, WOOD_LO, { x: px, y: 0.52, z: pz }));
    }

    // Entrance with noren curtain hint
    parts.push(box(0.5, 0.5, 0.04, 0x2a4a7a, { y: 0.5, z: 0.62 })); // blue noren

    // Side shoji screens
    for (const sx of [-0.5, 0.5]) {
      parts.push(box(0.4, 0.5, 0.02, PAPER, { x: sx, y: 0.5, z: 0.61 }));
      // Grid lines
      parts.push(box(0.02, 0.5, 0.025, TRIM, { x: sx, y: 0.5, z: 0.62 }));
      parts.push(box(0.4, 0.02, 0.025, TRIM, { x: sx, y: 0.5, z: 0.62 }));
    }

    // Signboard
    parts.push(box(0.6, 0.2, 0.04, WOOD_LO, { y: 0.85, z: 0.62 }));

    // Small lunchbox display (iconic element)
    parts.push(box(0.18, 0.08, 0.14, 0xc8a060, { x: 0.6, y: 0.3, z: 0.5 }));

    return finish(parts);
  },
};

export default NM_CHISHANG;
