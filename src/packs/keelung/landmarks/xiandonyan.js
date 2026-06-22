/**
 * @file packs/keelung/landmarks/xiandonyan.js — Roll Formosa Keelung pack.
 *
 * 仙洞巖 — Xiandonyan (Fairy Cave), a natural sea cave temple carved into the
 * rocky headland near Keelung Harbor. Features Buddhist and Taoist shrines
 * inside the cave, with the entrance marked by traditional gate architecture.
 * A unique spiritual site combining natural rock formations with religious art.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const ROCK = 0x6a6460;        // Natural rock
const ROCK_DARK = 0x4a4844;   // Cave interior
const ROCK_MOSS = 0x5a6458;   // Mossy rock
const GATE_RED = 0xc42a28;    // Temple gate red
const GOLD = 0xe8c860;        // Gold accents
const LANTERN = 0xe83a28;     // Red lanterns
const ROOF_TILE = 0x3a3e44;   // Dark tiles

export const NM_XIANDONYAN = {
  id: 'xiandonyan',
  name: '仙洞巖',
  landmarkId: 4,
  dioramaRHint: 40,
  colorHex: ROCK,

  buildGeometry(rng) {
    const parts = [];

    // ---- Rocky cliff face ----
    // Main rock mass
    parts.push(box(2.8, 2.2, 1.4, ROCK, { y: 1.1 }));

    // Irregular rock texture (stacked boxes for natural look)
    parts.push(box(2.6, 0.3, 0.3, ROCK_MOSS, { y: 2.35, z: 0.6 }));
    parts.push(box(2.2, 0.4, 0.4, ROCK, { y: 0.2, z: 0.55 }));
    parts.push(sph(0.5, ROCK_MOSS, { ws: 6, hs: 5, x: 1.2, y: 2.0, z: 0.5 }));
    parts.push(sph(0.4, ROCK_MOSS, { ws: 5, hs: 4, x: -1.0, y: 1.8, z: 0.55 }));

    // ---- Cave entrance (dark void) ----
    parts.push(box(1.0, 1.4, 0.4, ROCK_DARK, { y: 0.7, z: 0.56 }));
    // Arch top of cave
    parts.push(cyl(0.5, 0.5, 0.4, 8, ROCK_DARK, {
      rx: HALF_PI, y: 1.4, z: 0.56, theta0: 0, thetaLen: PI
    }));

    // ---- Temple gate at entrance ----
    // Two pillars
    parts.push(cyl(0.1, 0.12, 1.3, 8, GATE_RED, { x: -0.6, y: 0.65, z: 0.78 }));
    parts.push(cyl(0.1, 0.12, 1.3, 8, GATE_RED, { x: 0.6, y: 0.65, z: 0.78 }));

    // Gate beam
    parts.push(box(1.4, 0.15, 0.2, GATE_RED, { y: 1.35, z: 0.78 }));
    parts.push(box(1.5, 0.06, 0.24, GOLD, { y: 1.44, z: 0.78 }));

    // Small roof over gate
    parts.push(box(1.6, 0.08, 0.4, ROOF_TILE, { y: 1.52, z: 0.78 }));
    parts.push(box(1.4, 0.1, 0.3, ROOF_TILE, { y: 1.6, z: 0.78 }));

    // ---- Lanterns ----
    for (const lx of [-0.4, 0.4]) {
      parts.push(cyl(0.08, 0.1, 0.22, 8, LANTERN, { x: lx, y: 1.12, z: 0.82 }));
      parts.push(cyl(0.04, 0.04, 0.06, 8, GOLD, { x: lx, y: 1.25, z: 0.82 }));
    }

    // ---- Stone steps leading to entrance ----
    for (let i = 0; i < 4; i++) {
      parts.push(box(1.2, 0.1, 0.25, ROCK, {
        y: 0.05 + i * 0.08,
        z: 1.1 + i * 0.15
      }));
    }

    // ---- Small shrine inside cave (hint) ----
    parts.push(cyl(0.12, 0.12, 0.5, 8, GOLD, { y: 0.35, z: 0.3 })); // buddha figure hint

    return finish(parts);
  },
};

export default NM_XIANDONYAN;
