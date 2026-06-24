/**
 * @file packs/penghu/landmarks/whale_cave.js — Roll Formosa Penghu pack, landmark 6.
 *
 * NM_WHALE_CAVE — 鯨魚洞 (Whale Cave), 小門嶼. A natural sea arch formed by
 * wave erosion that resembles a whale. Silhouette: a dramatic rock arch
 * with the distinctive whale-like profile rising from the sea.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — dark basalt rock formation.
const ROCK = 0x4a4640; // basalt rock
const ROCK_D = 0x34322e; // darker crevice
const ROCK_L = 0x5a5650; // lighter face
const WATER = 0x3a6a8a; // ocean water

export const NM_WHALE_CAVE = {
  id: 'whale_cave',
  name: '鯨魚洞',
  landmarkId: 6,
  dioramaRHint: 160, // rock formation ~20m
  colorHex: ROCK,

  buildGeometry(rng) {
    const tint = Math.floor(rng() * 0x0a0808);
    const rockCol = ROCK - tint;
    const parts = [];

    // ---- Main rock body (whale back shape) ----
    // Large curved rock mass
    parts.push(sph(0.9, rockCol, {
      ws: 10, hs: 6,
      sx: 1.4, sy: 0.7, sz: 0.8,
      y: 0.5,
      hex2: ROCK_D,
    }));

    // Higher hump (dorsal fin area)
    parts.push(sph(0.5, rockCol, {
      ws: 8, hs: 5,
      sx: 0.8, sy: 1.0, sz: 0.6,
      x: 0.2, y: 0.75,
      hex2: ROCK_L,
    }));

    // ---- The arch / cave opening ----
    // Left pillar
    parts.push(box(0.25, 0.7, 0.35, rockCol, { x: -0.45, y: 0.35, z: 0.35, hex2: ROCK_D }));
    // Right pillar
    parts.push(box(0.25, 0.7, 0.35, rockCol, { x: 0.15, y: 0.35, z: 0.35, hex2: ROCK_D }));
    // Arch top
    parts.push(box(0.6, 0.2, 0.3, rockCol, { x: -0.15, y: 0.8, z: 0.35, hex2: ROCK_L }));
    // Hollow (represented by dark recess)
    parts.push(box(0.5, 0.5, 0.15, 0x1a1816, { x: -0.15, y: 0.4, z: 0.42 }));

    // ---- Whale head shape extending ----
    parts.push(sph(0.4, rockCol, {
      ws: 8, hs: 5,
      sx: 1.2, sy: 0.6, sz: 0.7,
      x: -0.9, y: 0.35,
      hex2: ROCK_D,
    }));

    // ---- Ocean water base ----
    parts.push(box(2.4, 0.08, 1.2, WATER, { y: 0.04, hex2: 0x2a5a7a }));

    // ---- Rocky base / reef ----
    parts.push(box(1.8, 0.12, 0.8, ROCK_D, { y: 0.06, z: -0.1 }));

    return finish(parts);
  },
};

export default NM_WHALE_CAVE;
