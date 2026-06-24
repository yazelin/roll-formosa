/**
 * @file packs/penghu/landmarks/fenggui_cave.js — Roll Formosa Penghu pack, landmark 7.
 *
 * NM_FENGGUI — 風櫃洞 (Fenggui Blowhole / Wind Cabinet Cave), 馬公市. A natural
 * blowhole where waves crash into a sea cave, forcing air and spray through
 * holes in the rock with a thunderous roar. Silhouette: coastal basalt cliffs
 * with a distinctive vent formation.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — dark basalt coastal rock.
const ROCK = 0x464440; // basalt
const ROCK_D = 0x323028; // dark crevice
const ROCK_L = 0x565450; // weathered surface
const SPRAY = 0xd0e8f8; // sea spray/foam
const WATER = 0x3a6a8a; // ocean

export const NM_FENGGUI = {
  id: 'fenggui_cave',
  name: '風櫃洞',
  landmarkId: 7,
  dioramaRHint: 200, // coastal cliff section
  colorHex: ROCK,

  buildGeometry(rng) {
    const tint = Math.floor(rng() * 0x0a0808);
    const rockCol = ROCK - tint;
    const parts = [];

    // ---- Main cliff face ----
    parts.push(box(1.6, 0.9, 0.5, rockCol, { y: 0.45, z: -0.15, hex2: ROCK_D }));

    // Irregular cliff top
    parts.push(box(1.4, 0.2, 0.4, ROCK_L, { y: 0.95, z: -0.1 }));
    parts.push(box(0.5, 0.15, 0.35, ROCK_L, { x: -0.4, y: 1.0, z: -0.12 }));
    parts.push(box(0.4, 0.12, 0.3, rockCol, { x: 0.5, y: 0.98, z: -0.08 }));

    // ---- The blowhole vent ----
    // Main vent opening
    parts.push(cyl(0.12, 0.15, 0.25, 8, ROCK_D, { y: 0.88, x: 0.1 }));
    // Dark cave interior
    parts.push(cyl(0.1, 0.1, 0.15, 6, 0x181614, { y: 0.8, x: 0.1 }));

    // ---- Secondary holes ----
    parts.push(cyl(0.06, 0.08, 0.15, 6, ROCK_D, { y: 0.85, x: -0.2, z: 0.05 }));
    parts.push(cyl(0.05, 0.06, 0.12, 6, ROCK_D, { y: 0.82, x: 0.3, z: 0.08 }));

    // ---- Sea spray effect ----
    // Small spheres representing spray bursting upward
    parts.push(sph(0.08, SPRAY, { ws: 6, hs: 4, x: 0.1, y: 1.1 }));
    parts.push(sph(0.05, SPRAY, { ws: 5, hs: 3, x: 0.05, y: 1.2, z: 0.03 }));
    parts.push(sph(0.04, SPRAY, { ws: 4, hs: 3, x: 0.15, y: 1.15, z: -0.02 }));

    // ---- Basalt column texture on cliff face ----
    for (let i = 0; i < 6; i++) {
      const cx = (i - 2.5) * 0.24;
      const h = 0.6 + (rng() - 0.5) * 0.2;
      parts.push(cyl(0.08, 0.075, h, 6, rockCol, {
        x: cx, y: h / 2 + 0.15, z: 0.12,
        hex2: ROCK_D,
      }));
    }

    // ---- Ocean base ----
    parts.push(box(2.0, 0.1, 0.8, WATER, { y: 0.05, z: 0.35, hex2: 0x2a5a7a }));

    // ---- Tidal platform ----
    parts.push(box(1.8, 0.08, 0.3, ROCK_D, { y: 0.1, z: 0.0 }));

    return finish(parts);
  },
};

export default NM_FENGGUI;
