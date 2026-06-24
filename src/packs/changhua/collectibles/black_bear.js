/**
 * @file packs/taipei/collectibles/black_bear.js — Roll Formosa Taipei pack.
 *
 * 台灣黑熊 (Formosan black bear) — collectibleId 0. A tiny chibi figurine the
 * katamari can roll up: a glossy black, big-headed plush-bear silhouette sitting
 * upright. Round head with two round ears, stubby arms and legs, and the signature
 * cream "V" crescent mark on the chest (the trait that tells a Formosan black bear
 * apart from any other bear). Proportions are exaggerated chibi: head ~= body so the
 * read is unmistakably "cute bear toy" at thumbnail size.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so the recipe is authored in unit-ish space; the silhouette
 * (round head + round ears + V chest) carries the read. <= 350 triangles.
 *
 * Palette: glossy fur black (0x1a1a20 body / 0x26262e highlight) + cream chest
 * crescent (0xf2e9d0) + muzzle tan (0x8a7a66) + tiny eyes/nose. rng adds only a
 * faint ear-tilt and body-color jitter — never structure.
 */

import { sph, box, finish } from '../geomHelpers.js';

/** Concrete hexes — glossy black fur, cream V, warm muzzle, dark facial marks. */
const FUR = 0x1c1c22;
const FUR_HI = 0x2a2a34;
const CREAM = 0xf3ead2;
const MUZZLE = 0x8c7c68;
const NOSE = 0x101014;
const EYE = 0x0c0c10;

export const COL_BLACK_BEAR = {
  id: 'black_bear',
  name: '台灣黑熊',
  collectibleId: 0,
  colorHex: 0x1c1c22, // glossy fur black — the body read color

  /**
   * Build the figurine geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (ear tilt, fur jitter).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Faint, deterministic-ish jitter so a shelf of figurines isn't identical.
    const furJit = (rng() - 0.5) * 0.06; // +-3% on the highlight blend
    const furHi = furJit > 0 ? FUR_HI : FUR;
    const earTilt = (rng() - 0.5) * 0.18; // small symmetric ear lean

    // --- Body: a rounded sitting torso, slightly egg-shaped (wider at hips). ---
    parts.push(sph(0.62, FUR, { ws: 7, hs: 5, sx: 1.0, sy: 1.08, sz: 0.92, y: 0.46, hex2: furHi }));

    // --- Cream chest crescent (the V): a thin flattened ball laid on the chest,
    //     tilted forward so it reads as the bright Formosan throat-mark. ---
    parts.push(sph(0.3, CREAM, { ws: 6, hs: 4, sx: 0.85, sy: 0.95, sz: 0.28, rx: -0.32, y: 0.62, z: 0.5 }));

    // --- Head: big round ball (chibi: nearly as large as the body). ---
    parts.push(sph(0.62, FUR, { ws: 7, hs: 5, sx: 1.06, sy: 1.0, sz: 1.0, y: 1.32, hex2: furHi }));

    // --- Muzzle: short tan snout pushed out from the lower face. ---
    parts.push(sph(0.26, MUZZLE, { ws: 6, hs: 4, sx: 1.0, sy: 0.82, sz: 0.9, y: 1.16, z: 0.52 }));
    // Nose tip: tiny dark cube on the muzzle front (reads as a dot at thumbnail size).
    parts.push(box(0.13, 0.1, 0.1, NOSE, { y: 1.2, z: 0.72 }));

    // --- Ears: two round flattened balls high on the head, slightly out & up. ---
    const earY = 1.78;
    const earX = 0.42;
    const earZ = -0.04;
    parts.push(sph(0.24, FUR, { ws: 5, hs: 3, sz: 0.5, rz: earTilt, x: -earX, y: earY, z: earZ, hex2: furHi }));
    parts.push(sph(0.24, FUR, { ws: 5, hs: 3, sz: 0.5, rz: -earTilt, x: earX, y: earY, z: earZ, hex2: furHi }));

    // --- Eyes: two tiny dark dots on the face flanking the muzzle. ---
    parts.push(box(0.09, 0.11, 0.07, EYE, { x: -0.22, y: 1.42, z: 0.52 }));
    parts.push(box(0.09, 0.11, 0.07, EYE, { x: 0.22, y: 1.42, z: 0.52 }));

    // --- Arms: stubby little balls hugging the sides of the body. ---
    parts.push(sph(0.22, FUR, { ws: 5, hs: 3, sx: 0.9, sy: 1.1, sz: 0.9, x: -0.6, y: 0.5, z: 0.18, hex2: furHi }));
    parts.push(sph(0.22, FUR, { ws: 5, hs: 3, sx: 0.9, sy: 1.1, sz: 0.9, x: 0.6, y: 0.5, z: 0.18, hex2: furHi }));

    // --- Legs/feet: two short rounded paws splayed forward at the base. ---
    parts.push(sph(0.26, FUR, { ws: 5, hs: 3, sx: 1.0, sy: 0.7, sz: 1.2, x: -0.32, y: -0.04, z: 0.34, hex2: furHi }));
    parts.push(sph(0.26, FUR, { ws: 5, hs: 3, sx: 1.0, sy: 0.7, sz: 1.2, x: 0.32, y: -0.04, z: 0.34, hex2: furHi }));

    return finish(parts);
  },
};
