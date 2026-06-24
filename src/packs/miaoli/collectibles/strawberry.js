/**
 * @file packs/miaoli/collectibles/strawberry.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_STRAWBERRY — 大湖草莓 (Dahu strawberry). Silhouette: a plump red strawberry
 * with the characteristic conical shape, dotted with tiny yellow seeds, topped
 * with a green leafy calyx (the star-shaped cap). Dahu Township (大湖鄉) in Miaoli
 * is Taiwan's strawberry capital. Reads unmistakably as "fresh strawberry" at
 * thumbnail size: red teardrop shape + green cap.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * ripeness tint, never structure.
 */

import { sph, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — strawberry red, green calyx, yellow seeds. */
const RED = 0xdc3545; // bright strawberry red
const RED_HI = 0xe8505f; // lighter red highlight
const RED_TIP = 0xc82333; // darker tip
const GREEN = 0x2a8a3a; // calyx leaf green
const GREEN_HI = 0x3a9a4a; // lighter leaf
const SEED = 0xf0d060; // yellow seed dots
const STEM = 0x5a7a40; // green stem

export const COL_STRAWBERRY = {
  id: 'col_strawberry',
  name: '大湖草莓',
  colorHex: 0xdc3545, // strawberry red — the body read color

  /**
   * Build the strawberry geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (ripeness tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201); // tiny per-instance ripeness nudge
    const red = RED - t;
    const parts = [];

    // --- BERRY BODY: plump conical shape, wider at top tapering to tip ---
    // Main body: egg-shaped sphere, stretched vertically
    parts.push(sph(0.7, red, {
      ws: 10,
      hs: 7,
      sy: 1.3,
      y: 0.0,
      hex2: RED_HI,
    }));
    // Narrower lower portion for the tapered tip
    parts.push(sph(0.5, RED_TIP, {
      ws: 8,
      hs: 5,
      sy: 0.9,
      y: -0.7,
      hex2: red,
    }));
    // Pointed tip at the bottom
    parts.push(cone(0.25, 0.4, 6, RED_TIP, { y: -1.15, rx: PI }));

    // --- SEEDS: tiny yellow dots scattered on the surface ---
    const seedPositions = [
      { x: 0.5, y: 0.2, z: 0.4 },
      { x: -0.4, y: 0.1, z: 0.5 },
      { x: 0.3, y: -0.3, z: 0.55 },
      { x: -0.35, y: -0.4, z: 0.45 },
      { x: 0.45, y: -0.1, z: -0.4 },
      { x: -0.5, y: 0.0, z: -0.35 },
      { x: 0.0, y: -0.5, z: 0.5 },
      { x: 0.2, y: 0.4, z: -0.5 },
    ];
    for (const pos of seedPositions) {
      parts.push(sph(0.06, SEED, { ws: 4, hs: 3, x: pos.x, y: pos.y, z: pos.z }));
    }

    // --- CALYX: green star-shaped leafy cap at the top ---
    // Central hub where leaves meet
    parts.push(cyl(0.2, 0.2, 0.15, 6, GREEN, { y: 0.75 }));
    // Five pointed leaves radiating outward
    const leafN = 5;
    for (let i = 0; i < leafN; i++) {
      const ang = (i / leafN) * PI * 2;
      const lx = Math.cos(ang) * 0.45;
      const lz = Math.sin(ang) * 0.45;
      // Each leaf is a small flattened cone pointing outward
      parts.push(cone(0.18, 0.4, 4, GREEN, {
        x: lx,
        y: 0.82,
        z: lz,
        rz: Math.sin(ang) * 0.6,
        rx: -Math.cos(ang) * 0.6,
        hex2: GREEN_HI,
      }));
    }

    // --- STEM: short green stem at the very top ---
    parts.push(cyl(0.06, 0.06, 0.25, 5, STEM, { y: 0.95 }));

    return finish(parts);
  },
};

export default COL_STRAWBERRY;
