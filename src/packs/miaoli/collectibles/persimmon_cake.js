/**
 * @file packs/miaoli/collectibles/persimmon_cake.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_PERSIMMON_CAKE — 柿餅 (dried persimmon cake). Silhouette: a flattened,
 * round dried persimmon with the characteristic wrinkled surface and white
 * sugar bloom coating. Xinpu (新埔) in Miaoli/Hsinchu area is famous for its
 * traditional sun-dried persimmon cakes. Reads unmistakably as "dried fruit"
 * at thumbnail size: flattened disk + orange-brown color + powdery white coating.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * surface tint, never structure.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — dried persimmon, sugar bloom, stem. */
const PERSIMMON = 0xc86830; // deep orange-brown dried persimmon
const PERSIMMON_HI = 0xd87840; // lighter orange
const BLOOM = 0xf8f4f0; // white sugar bloom coating
const BLOOM_LO = 0xe8e0d8; // slightly darker bloom
const STEM = 0x5a4030; // brown dried stem
const CALYX = 0x6a5a40; // dried calyx (cap)

export const COL_PERSIMMON_CAKE = {
  id: 'persimmon_cake',
  name: '柿餅',
  colorHex: 0xc86830, // deep orange-brown — the body read color

  /**
   * Build the persimmon cake geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (surface tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302); // tiny per-instance tint
    const persimmon = PERSIMMON - t;
    const parts = [];

    // --- MAIN BODY: flattened disk shape of dried persimmon ---
    // Core orange-brown body
    parts.push(sph(0.85, persimmon, {
      ws: 10,
      hs: 6,
      sy: 0.45,
      y: 0.0,
      hex2: PERSIMMON_HI,
    }));

    // Wrinkled surface texture - small bumps around the edge
    const wrinkleN = 8;
    for (let i = 0; i < wrinkleN; i++) {
      const ang = (i / wrinkleN) * Math.PI * 2;
      const wx = Math.cos(ang) * 0.6;
      const wz = Math.sin(ang) * 0.6;
      parts.push(sph(0.2, persimmon, {
        ws: 5,
        hs: 3,
        sy: 0.5,
        x: wx,
        y: 0.08,
        z: wz,
      }));
    }

    // --- SUGAR BLOOM: white powdery coating on the surface ---
    // Top surface bloom
    parts.push(sph(0.75, BLOOM, {
      ws: 8,
      hs: 4,
      sy: 0.2,
      y: 0.22,
      hex2: BLOOM_LO,
    }));
    // Bottom surface bloom
    parts.push(sph(0.7, BLOOM_LO, {
      ws: 8,
      hs: 4,
      sy: 0.15,
      y: -0.2,
    }));
    // Scattered bloom patches
    parts.push(sph(0.25, BLOOM, { ws: 5, hs: 3, sy: 0.3, x: 0.35, y: 0.15, z: 0.25 }));
    parts.push(sph(0.22, BLOOM, { ws: 5, hs: 3, sy: 0.3, x: -0.3, y: 0.18, z: -0.3 }));

    // --- CALYX: dried cap at the top (where stem attaches) ---
    // Flattened dried calyx
    parts.push(cyl(0.3, 0.35, 0.12, 6, CALYX, { y: 0.35 }));
    // Four dried calyx leaves pointing outward
    const calyxN = 4;
    for (let i = 0; i < calyxN; i++) {
      const ang = (i / calyxN) * Math.PI * 2 + 0.3;
      const cx = Math.cos(ang) * 0.25;
      const cz = Math.sin(ang) * 0.25;
      parts.push(sph(0.12, CALYX, {
        ws: 4,
        hs: 3,
        sx: 0.6,
        sy: 0.3,
        sz: 1.2,
        ry: -ang,
        x: cx,
        y: 0.38,
        z: cz,
      }));
    }

    // --- STEM: small dried stem stub ---
    parts.push(cyl(0.06, 0.04, 0.2, 5, STEM, { y: 0.48 }));

    return finish(parts);
  },
};

export default COL_PERSIMMON_CAKE;
