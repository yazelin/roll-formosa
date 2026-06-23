/**
 * @file packs/changhua/collectibles/misua.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_MISUA — 麵線 (misua / thin wheat noodles), a Lukang and coastal Taiwan
 * specialty. Silhouette: a bowl of thin, reddish-brown noodles in savory broth,
 * topped with pig intestines (大腸) or oysters, and garnished with cilantro
 * and black vinegar drizzle. The fine, thread-like noodles are distinctive.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const NOODLE = 0xc89868;      // reddish-brown misua noodles
const BROTH = 0xa87848;       // savory brown broth
const INTESTINE = 0xd8c8a8;   // pig intestine
const CILANTRO = 0x48a848;    // cilantro
const VINEGAR = 0x2a1a10;     // black vinegar
const BOWL = 0xd85030;        // red bowl (classic night market style)

export const COL_MISUA = {
  id: 'misua',
  name: '麵線',
  collectibleId: 7,
  colorHex: NOODLE,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201);
    const parts = [];

    // Red bowl
    parts.push(cyl(0.82, 0.70, 0.32, 10, BOWL, { y: 0.16, open: true }));
    parts.push(cyl(0.66, 0.66, 0.04, 8, BOWL, { y: 0.02 }));

    // Broth
    parts.push(cyl(0.65, 0.65, 0.20, 10, BROTH, { y: 0.22 }));

    // Misua noodles - bundles of thin strands
    parts.push(sph(0.55, NOODLE + t, { ws: 10, hs: 5, y: 0.42, sy: 0.45, hex2: 0xd8a878 }));
    // Noodle texture - thin boxes to suggest strands
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * PI * 2;
      const x = Math.cos(angle) * 0.25;
      const z = Math.sin(angle) * 0.25;
      parts.push(box(0.04, 0.02, 0.35, NOODLE, { x, y: 0.50, z, ry: angle }));
    }

    // Pig intestine pieces
    parts.push(cyl(0.10, 0.08, 0.25, 5, INTESTINE, { x: -0.18, y: 0.52, z: 0.12, rx: 0.3 }));
    parts.push(cyl(0.09, 0.07, 0.20, 5, INTESTINE, { x: 0.15, y: 0.52, z: -0.10, rx: -0.2 }));

    // Cilantro garnish
    parts.push(box(0.10, 0.03, 0.08, CILANTRO, { x: 0.08, y: 0.58, z: 0.18 }));
    parts.push(box(0.08, 0.03, 0.06, CILANTRO, { x: -0.10, y: 0.58, z: 0.05 }));

    // Black vinegar drizzle
    parts.push(box(0.25, 0.02, 0.04, VINEGAR, { x: 0, y: 0.60, z: 0 }));

    return finish(parts);
  },
};

export default COL_MISUA;
