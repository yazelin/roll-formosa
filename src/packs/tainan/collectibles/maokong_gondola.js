/**
 * @file packs/tainan/collectibles/maokong_gondola.js — Roll Formosa Tainan pack.
 *
 * 鹹粥 (savory milkfish congee) — collectibleId 10. Tainan's classic breakfast: a
 * wide bowl of creamy rice porridge topped with milkfish chunks, oyster bits and
 * a scatter of chopped green onion. As a small hand-rollable collectible it reads
 * as a wide low bowl brimming with pale rice congee, with pale fish pieces and
 * little oysters on top and green flecks — distinct from a plain bowl of rice.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (a wide low bowl, congee filling it
 * flush, fish + oyster lumps clustered on top) carry the silhouette. rng only
 * scatters the toppings a hair — never structure. <= 350 triangles.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

const BOWL = 0xeef0f2;   // pale ceramic bowl
const BOWL_D = 0xcfd3d7; // bowl shadow / inner wall
const RIM = 0x3a6fa0;    // blue painted rim band
const CONGEE = 0xe8e2cc; // creamy rice porridge
const CONGEE_T = 0xf4efde; // glossy porridge highlight
const FISH = 0xeae3d4;   // pale milkfish chunk
const FISH_D = 0xcdbfa6; // browned fish edge
const OYSTER = 0xb8a98c; // grey-brown oyster
const SCALLION = 0x5e9a3e; // green onion fleck

export const COL_GONDOLA = {
  id: 'maokong_gondola',
  name: '鹹粥',
  collectibleId: 10,
  colorHex: CONGEE, // creamy rice porridge — the body read color
  buildGeometry(rng) {
    const parts = [];

    // ---- Bowl (wide shallow vessel) --------------------------------------
    parts.push(cyl(1.0, 0.6, 0.6, 10, BOWL, { y: -0.2, open: true, hex2: BOWL_D }));
    parts.push(cyl(0.6, 0.6, 0.08, 10, BOWL_D, { y: -0.46 }));     // base disc
    parts.push(cyl(1.02, 1.02, 0.07, 10, RIM, { y: 0.08, open: true })); // painted rim band

    // ---- Congee (creamy rice porridge brimming flush) --------------------
    parts.push(cyl(0.92, 0.58, 0.36, 10, CONGEE, { y: -0.06, hex2: CONGEE_T }));
    parts.push(
      sph(0.9, CONGEE, { y: 0.1, sy: 0.32, ws: 10, hs: 4, thetaLen: PI / 2, hex2: CONGEE_T })
    );

    // ---- Fish chunks (pale milkfish pieces on top) -----------------------
    // Squashed boxes read as flaky fish pieces; oysters are small lumps.
    parts.push(box(0.42, 0.14, 0.3, FISH, { x: 0.18, z: -0.1, y: 0.22, rz: 0.2, hex2: FISH_D }));
    parts.push(box(0.36, 0.13, 0.26, FISH, { x: -0.22, z: 0.16, y: 0.22, rz: -0.25, hex2: FISH_D }));

    // ---- Oyster bits ------------------------------------------------------
    parts.push(sph(0.14, OYSTER, { x: 0.1, z: 0.28, y: 0.22, ws: 6, hs: 4, sy: 0.7 }));
    parts.push(sph(0.12, OYSTER, { x: -0.05, z: -0.26, y: 0.22, ws: 6, hs: 4, sy: 0.7 }));

    // ---- Chopped green onion scatter -------------------------------------
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * PI * 2;
      const jx = (rng() - 0.5) * 0.06;
      const jz = (rng() - 0.5) * 0.06;
      parts.push(
        box(0.12, 0.04, 0.05, SCALLION, {
          rz: a,
          x: Math.cos(a) * 0.3 + jx,
          z: Math.sin(a) * 0.3 + jz,
          y: 0.3,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_GONDOLA;
