/**
 * @file packs/changhua/landmarks/lukang_first_street.js — Roll Formosa Changhua pack, LANDMARK.
 *
 * NM_LUKANG_FIRST_STREET — 鹿港第一市場 (Lukang First Market), the traditional
 * covered market established during Japanese rule. Features an arcade-style
 * covered shopping area with various food stalls selling local specialties
 * like meatballs, noodles, and traditional snacks.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const ROOF = 0xd05830;        // terracotta roof
const ROOF_D = 0xa84828;      // roof shadow
const STRUCTURE = 0xe8e0d0;   // building structure
const STALL = 0xf8f0e8;       // market stall
const AWNING_R = 0xc82828;    // red awning
const AWNING_B = 0x2858a8;    // blue awning

export const NM_LUKANG_FIRST_STREET = {
  id: 'lukang_first_street',
  name: '鹿港第一市場',
  landmarkId: 97,
  dioramaRHint: 40,
  colorHex: ROOF,

  buildGeometry(rng) {
    const parts = [];

    // Main market building structure
    parts.push(box(1.2, 0.30, 0.6, STRUCTURE, { y: 0.15 }));

    // Pitched roof
    parts.push(box(1.3, 0.08, 0.35, ROOF, { y: 0.35, hex2: ROOF_D }));
    parts.push(box(1.3, 0.08, 0.35, ROOF, { y: 0.35, rz: PI, hex2: ROOF_D }));
    parts.push(box(1.25, 0.05, 0.10, ROOF, { y: 0.42 }));

    // Market stalls inside (visible through openings)
    for (let i = 0; i < 5; i++) {
      const x = -0.45 + i * 0.22;
      const awningColor = i % 2 === 0 ? AWNING_R : AWNING_B;
      // Stall counter
      parts.push(box(0.18, 0.12, 0.20, STALL, { x, y: 0.06, z: -0.15 }));
      // Awning
      parts.push(box(0.20, 0.02, 0.12, awningColor, { x, y: 0.18, z: -0.20 }));
    }

    // Opposite side stalls
    for (let i = 0; i < 5; i++) {
      const x = -0.45 + i * 0.22;
      const awningColor = i % 2 === 0 ? AWNING_B : AWNING_R;
      parts.push(box(0.18, 0.12, 0.20, STALL, { x, y: 0.06, z: 0.15 }));
      parts.push(box(0.20, 0.02, 0.12, awningColor, { x, y: 0.18, z: 0.20 }));
    }

    // Central walkway
    parts.push(box(1.0, 0.01, 0.15, 0x707068, { y: 0.01 }));

    // Support columns
    for (const x of [-0.50, 0.00, 0.50]) {
      parts.push(cyl(0.03, 0.03, 0.30, 4, 0x808080, { x, y: 0.15, z: -0.28 }));
      parts.push(cyl(0.03, 0.03, 0.30, 4, 0x808080, { x, y: 0.15, z: 0.28 }));
    }

    // Entrance signs
    parts.push(box(0.25, 0.08, 0.02, 0xf8e8c8, { x: 0, y: 0.28, z: 0.31 }));

    return finish(parts);
  },
};

export default NM_LUKANG_FIRST_STREET;
