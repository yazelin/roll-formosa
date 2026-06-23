/**
 * @file packs/taoyuan/landmarks/daxi_bridge.js — Roll Formosa Taoyuan pack.
 *
 * 大溪橋 (Daxi Bridge) — a beautiful baroque-style pedestrian bridge spanning
 * the 大漢溪 (Dahan River) in Daxi. The bridge features ornate white arches
 * and decorative lampposts, connecting the old town to the riverbank park.
 * Completed in 2001, it evokes the colonial-era architecture of Daxi Old Street.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: cream/white concrete arches, bronze lamp posts, red tile accents.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const CREAM = 0xf0e8d8; // cream white concrete
const CREAM_D = 0xd8d0c0; // shadowed cream
const BRONZE = 0x8a6840; // lamp post bronze
const RED_TILE = 0xc85038; // red accent tiles
const DECK = 0xc8c0b8; // bridge deck (grey)
const RAIL = 0xe8e0d4; // balustrade

export const NM_DAXI_BRIDGE = {
  id: 'daxi_bridge',
  name: '大溪橋',
  landmarkId: 0, // smallest Taoyuan landmark
  dioramaRHint: 12, // ~15 m span arch
  colorHex: CREAM,

  buildGeometry(rng) {
    const parts = [];

    // === MAIN ARCHED SPAN ====================================================
    // The bridge deck
    parts.push(box(4.0, 0.16, 1.0, DECK, { y: 0.8, hex2: CREAM_D }));

    // Two main arches beneath the deck
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.7, 0.7, 0.18, 10, CREAM, {
        rx: HALF_PI,
        theta0: 0,
        thetaLen: PI,
        x: sx * 0.9,
        y: 0.4,
        z: 0,
        hex2: CREAM_D,
      }));
    }

    // Pier supports
    parts.push(box(0.3, 0.7, 0.8, CREAM_D, { x: -1.8, y: 0.35 }));
    parts.push(box(0.3, 0.7, 0.8, CREAM_D, { x: 1.8, y: 0.35 }));
    parts.push(box(0.25, 0.7, 0.7, CREAM_D, { y: 0.35 })); // center pier

    // === BALUSTRADE ==========================================================
    // Decorative railings on both sides
    for (const sz of [-1, 1]) {
      parts.push(box(3.8, 0.08, 0.06, RAIL, { y: 1.12, z: sz * 0.46 }));
      parts.push(box(3.8, 0.04, 0.08, RAIL, { y: 0.92, z: sz * 0.46 }));
      // Balusters
      for (let i = 0; i < 6; i++) {
        parts.push(box(0.05, 0.2, 0.05, RAIL, { x: -1.5 + i * 0.6, y: 1.0, z: sz * 0.46 }));
      }
    }

    // === LAMP POSTS ==========================================================
    // Ornate bronze lamp posts at each end
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.06, 0.06, 0.7, 6, BRONZE, { x: sx * 1.7, y: 1.23 }));
      parts.push(sph(0.12, 0xffe8a0, { ws: 6, hs: 4, x: sx * 1.7, y: 1.65 })); // lamp globe
      parts.push(box(0.18, 0.06, 0.18, BRONZE, { x: sx * 1.7, y: 1.5 })); // lamp bracket
    }

    // === ENTRY ARCHES (decorative gate towers) ===============================
    for (const sx of [-1, 1]) {
      // Tower base
      parts.push(box(0.4, 1.0, 0.6, CREAM, { x: sx * 2.1, y: 0.5, hex2: CREAM_D }));
      // Tower cap with red tile roof
      parts.push(box(0.5, 0.12, 0.7, RED_TILE, { x: sx * 2.1, y: 1.06 }));
      // Decorative finial
      parts.push(cyl(0.06, 0.03, 0.2, 6, CREAM, { x: sx * 2.1, y: 1.22 }));
    }

    return finish(parts);
  },
};

export default NM_DAXI_BRIDGE;
