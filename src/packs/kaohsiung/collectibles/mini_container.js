/**
 * @file packs/kaohsiung/collectibles/mini_container.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_MINI_CONTAINER — 貨櫃 (Kaohsiung Port shipping container, mini collectible
 * edition). Silhouette: a stout rectangular shipping-container box, painted the
 * rusty cargo orange you see stacked along Kaohsiung's harbour quays. The long
 * side walls carry the signature corrugated (浪板) ribbing, the end has a pair
 * of vertical door leaves with the locking-bar hardware (門栓), and the corner
 * castings sit dark at each edge. A small, hand-held box — chunky and toy-like,
 * never a full-scale 40-foot container.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the geometry
 * math is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Collectible triangle budget (~150–400). rng() only nudges the paint
 * tint, never structure.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — rusty cargo orange + darker rib shadow, steel corners, door hardware. */
const ORANGE = 0xd06840; // cargo orange body
const ORANGE_HI = 0xe07c52; // sun-lit highlight
const RIB = 0xb55633; // corrugated rib shadow
const STEEL = 0x4a4036; // dark corner castings / frame
const BAR = 0x2e2922; // door locking bars (門栓)
const HANDLE = 0xc8c2b6; // pale handle / lever metal

export const COL_MINI_CONTAINER = {
  id: 'mini_container',
  name: '貨櫃',
  colorHex: 0xd06840, // cargo orange — the body read color

  /**
   * Build the mini-container geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny paint tint nudge only, never structure.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201); // tiny per-instance rust-tint nudge
    const body = ORANGE + t;

    const parts = [];

    // Container half-extents (long along X, the doors face +X end).
    const HX = 1.5; // length
    const HY = 0.62; // height
    const HZ = 0.66; // width

    // --- Main BODY box (orange, faint top highlight gradient) ----------------
    parts.push(box(HX * 2, HY * 2, HZ * 2, body, { hex2: ORANGE_HI }));

    // --- Corrugated RIBBING on the two long side walls -----------------------
    // Thin vertical slabs proud of the wall = the浪板 read. Darker than the body
    // so the corrugation pattern is legible at thumbnail size.
    const ribCount = 5;
    const ribW = 0.12; // along X
    const ribProud = 0.04; // sticks out past the wall
    const span = (HX - 0.16) * 2; // leave the end frames clear
    for (let i = 0; i < ribCount; i++) {
      const fx = -HX + 0.16 + (span * (i + 0.5)) / ribCount;
      // +Z wall rib
      parts.push(box(ribW, HY * 1.7, ribProud, RIB, { x: fx, y: 0, z: HZ + ribProud * 0.5 }));
      // -Z wall rib
      parts.push(box(ribW, HY * 1.7, ribProud, RIB, { x: fx, y: 0, z: -HZ - ribProud * 0.5 }));
    }

    // --- Top & bottom RAILS (steel frame lines along the long edges) ---------
    const railH = 0.1;
    parts.push(box(HX * 2, railH, HZ * 2 + 0.02, STEEL, { y: HY }));
    parts.push(box(HX * 2, railH, HZ * 2 + 0.02, STEEL, { y: -HY }));

    // --- CORNER castings: 8 dark cubes at the box corners --------------------
    const cc = 0.16; // corner cube size
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          parts.push(box(cc, cc, cc, STEEL, { x: sx * HX, y: sy * HY, z: sz * HZ }));
        }
      }
    }

    // --- DOOR end (+X): two vertical leaves with locking bars + handles ------
    const doorX = HX + 0.015; // sit just proud of the end wall
    // two door-leaf seams (thin recessed bars splitting the end into 2 leaves)
    parts.push(box(0.03, HY * 1.85, 0.03, STEEL, { x: doorX + 0.02, y: 0, z: 0 })); // centre seam
    // locking bars (門栓): two tall thin rods per leaf
    const barOffsets = [-0.4, -0.18, 0.18, 0.4];
    for (const bz of barOffsets) {
      parts.push(cyl(0.035, 0.035, HY * 1.7, 6, BAR, { x: doorX, y: 0, z: bz }));
    }
    // cam handles low on each leaf (pale metal nubs)
    for (const bz of [-0.29, 0.29]) {
      parts.push(box(0.1, 0.16, 0.06, HANDLE, { x: doorX + 0.04, y: -0.18, z: bz }));
    }

    return finish(parts);
  },
};

export default COL_MINI_CONTAINER;
