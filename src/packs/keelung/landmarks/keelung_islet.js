/**
 * @file packs/keelung/landmarks/keelung_islet.js — Roll Formosa Keelung pack.
 *
 * 基隆嶼燈塔 — Keelung Islet with its lighthouse, a volcanic island visible
 * from Keelung Harbor. The small island features steep cliffs and a white
 * lighthouse at the summit. It's an iconic symbol of Keelung's maritime
 * heritage and a popular boat excursion destination.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const ROCK = 0x5a5854;        // Volcanic rock
const ROCK_GREEN = 0x4a5a44;  // Vegetated rock
const WATER = 0x3a7888;       // Sea water
const WHITE = 0xf8f8f4;       // Lighthouse white
const RED = 0xc42a28;         // Lighthouse top
const LIGHT = 0xfff8d0;       // Lighthouse light

export const NM_KEELUNG_ISLET = {
  id: 'keelung_islet',
  name: '基隆嶼燈塔',
  landmarkId: 7,
  dioramaRHint: 80,
  colorHex: ROCK,

  buildGeometry(rng) {
    const parts = [];

    // ---- Sea base ----
    parts.push(box(3.0, 0.1, 2.0, WATER, { y: 0.05 }));

    // ---- Island rock mass (volcanic cone shape) ----
    // Base of island
    parts.push(cone(1.2, 0.8, 8, ROCK, { y: 0.5 }));
    parts.push(cone(0.95, 1.2, 8, ROCK_GREEN, { y: 1.4, hex2: ROCK }));
    parts.push(cone(0.6, 0.8, 8, ROCK_GREEN, { y: 2.2 }));

    // Secondary peaks
    parts.push(cone(0.4, 0.5, 6, ROCK, { x: 0.5, y: 0.8, z: 0.3 }));
    parts.push(cone(0.3, 0.4, 6, ROCK_GREEN, { x: -0.4, y: 0.7, z: -0.2 }));

    // Rocky texture
    parts.push(sph(0.25, ROCK, { ws: 5, hs: 4, x: 0.3, y: 1.6, z: 0.25 }));
    parts.push(sph(0.2, ROCK, { ws: 4, hs: 3, x: -0.25, y: 1.5, z: -0.2 }));

    // ---- Lighthouse at summit ----
    // Lighthouse base/platform
    parts.push(cyl(0.2, 0.22, 0.12, 8, ROCK, { y: 2.66 }));

    // Tower body (tapered cylinder)
    parts.push(cyl(0.1, 0.14, 0.6, 8, WHITE, { y: 3.02 }));

    // Gallery deck (观光台)
    parts.push(cyl(0.16, 0.16, 0.06, 10, WHITE, { y: 3.35 }));

    // Lantern room
    parts.push(cyl(0.12, 0.12, 0.18, 8, LIGHT, { y: 3.47 }));

    // Dome top
    parts.push(sph(0.12, RED, { ws: 6, hs: 5, y: 3.62, sy: 0.6 }));

    // Finial
    parts.push(cyl(0.02, 0.02, 0.08, 4, RED, { y: 3.72 }));

    // ---- Rocky shoreline details ----
    parts.push(box(0.4, 0.15, 0.3, ROCK, { x: 0.9, y: 0.18, z: 0.5 }));
    parts.push(box(0.35, 0.12, 0.25, ROCK, { x: -0.85, y: 0.16, z: -0.4 }));

    // ---- Small pier/dock hint ----
    parts.push(box(0.5, 0.06, 0.15, 0x706860, { x: -0.7, y: 0.13, z: 0.6 }));

    return finish(parts);
  },
};

export default NM_KEELUNG_ISLET;
