/**
 * @file packs/yunlin/landmarks/janfusun_fancyworld.js — Roll Formosa Yunlin pack, LANDMARK.
 *
 * NM_JANFUSUN_FANCYWORLD — 劍湖山世界 (Janfusun Fancyworld). One of Taiwan's largest
 * theme parks, famous for its iconic Ferris wheel and roller coasters. The park
 * is a major tourist attraction in Yunlin County.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WHEEL_FRAME = 0x3858a8;  // blue steel frame
const WHEEL_HI = 0x4878c8;     // frame highlight
const CABIN = 0xe84848;        // red cabin
const CABIN2 = 0x48a848;       // green cabin
const CABIN3 = 0xe8c848;       // yellow cabin
const SUPPORT = 0x585858;      // grey support
const GROUND = 0x68a858;       // park ground

export const NM_JANFUSUN_FANCYWORLD = {
  id: 'janfusun_fancyworld',
  name: '劍湖山世界',
  landmarkId: 7,
  dioramaRHint: 60, // theme park
  colorHex: WHEEL_FRAME,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Park ground
    parts.push(box(4.0, 0.12, 3.5, GROUND, { y: 0.06, hex2: 0x78b868 }));

    const baseY = 0.12;

    // FERRIS WHEEL - main attraction
    const wheelY = baseY + 1.3;
    const wheelR = 1.1;

    // Main support structure (A-frame)
    parts.push(box(0.15, 1.6, 0.3, SUPPORT, { x: -0.25, y: baseY + 0.8, rz: 0.15 }));
    parts.push(box(0.15, 1.6, 0.3, SUPPORT, { x: 0.25, y: baseY + 0.8, rz: -0.15 }));

    // Wheel rim (simplified)
    parts.push(torus(wheelR, 0.06, 10, 4, WHEEL_FRAME, { y: wheelY, rx: HALF_PI, hex2: WHEEL_HI }));

    // Wheel spokes (reduced)
    for (let s = 0; s < 4; s++) {
      const angle = (s * PI) / 2;
      parts.push(box(wheelR * 0.9, 0.04, 0.04, WHEEL_FRAME, { y: wheelY, ry: angle, rx: HALF_PI }));
    }

    // Hub
    parts.push(cyl(0.15, 0.15, 0.12, 6, WHEEL_HI, { y: wheelY, rx: HALF_PI }));

    // Gondola cabins (reduced to 4)
    const cabinColors = [CABIN, CABIN2, CABIN3, CABIN];
    for (let c = 0; c < 4; c++) {
      const angle = (c * PI) / 2 + j;
      const cx = Math.sin(angle) * wheelR;
      const cy = wheelY + Math.cos(angle) * wheelR;
      parts.push(box(0.12, 0.15, 0.1, cabinColors[c], { x: cx, y: cy, hex2: 0xf8f8f8 }));
    }

    // ENTRANCE GATE
    const gateZ = 1.3;
    parts.push(box(0.15, 0.8, 0.15, 0xd84040, { x: -0.5, y: baseY + 0.4, z: gateZ }));
    parts.push(box(0.15, 0.8, 0.15, 0xd84040, { x: 0.5, y: baseY + 0.4, z: gateZ }));
    // Arch
    parts.push(box(1.2, 0.2, 0.15, 0xe85858, { y: baseY + 0.85, z: gateZ }));

    // Tree
    parts.push(cone(0.25, 0.5, 5, 0x388838, { x: 1.4, y: baseY + 0.6, z: 0.8 }));

    return finish(parts);
  },
};

export default NM_JANFUSUN_FANCYWORLD;
