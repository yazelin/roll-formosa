/**
 * @file packs/miaoli/collectibles/tung_oil.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_TUNG_OIL — 桐油瓶 (tung oil bottle). Silhouette: a traditional ceramic or
 * glass bottle containing golden-amber tung oil (桐油), extracted from tung tree
 * seeds. Tung oil was historically important in Miaoli's Hakka communities for
 * waterproofing and finishing wood. The bottle has a rounded body, narrow neck,
 * cork stopper, and the oil has a warm amber glow. Reads unmistakably as "oil
 * bottle" at thumbnail size: rounded vessel + narrow neck + amber liquid.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * oil tint, never structure.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — bottle, oil, cork. */
const GLASS = 0x8aa8a0; // blue-green glass bottle
const GLASS_HI = 0x9ab8b0; // lighter glass highlight
const GLASS_LO = 0x6a8880; // darker glass shadow
const OIL = 0xd09030; // golden amber tung oil
const OIL_HI = 0xe0a040; // lighter oil glow
const CORK = 0xa08060; // cork stopper
const CORK_HI = 0xb09070; // lighter cork
const LABEL = 0xf5f0e0; // cream paper label

export const COL_TUNG_OIL = {
  id: 'tung_oil',
  name: '桐油瓶',
  colorHex: 0xd09030, // golden amber oil — the body read color

  /**
   * Build the tung oil bottle geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (oil tint).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302); // tiny per-instance oil tint
    const oil = OIL + t;
    const parts = [];

    // --- BOTTLE BODY: rounded glass vessel ---
    // Main body - spherical with slight vertical stretch
    parts.push(sph(0.7, GLASS, {
      ws: 10,
      hs: 7,
      sy: 1.1,
      y: 0.0,
      hex2: GLASS_HI,
    }));

    // --- OIL INSIDE: golden amber liquid visible through glass ---
    // Oil fills most of the bottle
    parts.push(sph(0.62, oil, {
      ws: 8,
      hs: 6,
      sy: 1.0,
      y: -0.05,
      hex2: OIL_HI,
    }));
    // Oil surface (flat top where air meets oil)
    parts.push(cyl(0.45, 0.45, 0.06, 8, OIL_HI, { y: 0.5 }));

    // --- SHOULDER: transition from body to neck ---
    parts.push(cyl(0.45, 0.25, 0.25, 10, GLASS, { y: 0.72, hex2: GLASS_HI }));

    // --- NECK: narrow cylindrical neck ---
    parts.push(cyl(0.2, 0.18, 0.45, 8, GLASS_HI, { y: 1.05, hex2: GLASS }));
    // Rim lip at top of neck
    parts.push(cyl(0.22, 0.22, 0.08, 8, GLASS, { y: 1.3 }));

    // --- CORK STOPPER: closing the bottle ---
    parts.push(cyl(0.17, 0.15, 0.25, 6, CORK, { y: 1.42, hex2: CORK_HI }));
    // Cork top
    parts.push(sph(0.14, CORK_HI, { ws: 5, hs: 3, sy: 0.4, y: 1.55 }));

    // --- LABEL: paper label on the bottle body ---
    parts.push(sph(0.72, LABEL, {
      ws: 8,
      hs: 4,
      sx: 0.7,
      sy: 0.35,
      sz: 0.15,
      y: 0.0,
      z: 0.65,
    }));
    // Text representation on label (darker marks)
    parts.push(sph(0.1, 0x4a4a4a, {
      ws: 4,
      hs: 3,
      sx: 2.0,
      sy: 0.4,
      sz: 0.1,
      y: 0.02,
      z: 0.72,
    }));
    parts.push(sph(0.08, 0x5a5a5a, {
      ws: 4,
      hs: 3,
      sx: 1.5,
      sy: 0.3,
      sz: 0.1,
      y: -0.1,
      z: 0.71,
    }));

    // --- BOTTLE BASE: flat bottom for stability ---
    parts.push(cyl(0.45, 0.45, 0.1, 10, GLASS_LO, { y: -0.72 }));
    // Slight indent in base (punt)
    parts.push(sph(0.3, GLASS, { ws: 6, hs: 3, sy: 0.25, thetaLen: PI * 0.5, y: -0.72, rx: PI }));

    return finish(parts);
  },
};

export default COL_TUNG_OIL;
