/**
 * @file packs/miaoli/collectibles/woodcarving.js — Roll Formosa Miaoli pack, COLLECTIBLE.
 *
 * COL_WOODCARVING — 三義木雕 (Sanyi woodcarving). Silhouette: a small carved
 * wooden elephant figurine, a classic souvenir from Sanyi Township (三義鄉),
 * Taiwan's woodcarving capital. The elephant has a rounded body, trunk raised
 * upward (for good luck), large ears, and stands on four stubby legs. Carved
 * from warm-toned wood with visible grain. Reads unmistakably as "carved
 * elephant" at thumbnail size: rounded body + raised trunk + big ears.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Well under the collectible triangle budget. rng() only nudges the
 * wood tone, never structure.
 */

import { sph, cyl, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — carved wood tones. */
const WOOD = 0x8a6a4a; // warm brown carved wood
const WOOD_HI = 0x9a7a5a; // lighter wood highlight
const WOOD_LO = 0x6a5038; // darker wood shadow/grain
const EYE = 0x1a1814; // dark carved eye indent

export const COL_WOODCARVING = {
  id: 'woodcarving',
  name: '三義木雕',
  colorHex: 0x8a6a4a, // warm brown wood — the body read color

  /**
   * Build the elephant carving geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (wood tone).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040302); // tiny per-instance wood tone
    const wood = WOOD + t;
    const parts = [];

    // --- BODY: rounded barrel-shaped torso ---
    parts.push(sph(0.65, wood, {
      ws: 8,
      hs: 6,
      sx: 1.3,
      sy: 0.9,
      sz: 0.95,
      y: 0.45,
      hex2: WOOD_HI,
    }));

    // --- HEAD: rounded head attached to body ---
    parts.push(sph(0.45, wood, {
      ws: 7,
      hs: 5,
      sx: 0.9,
      sy: 0.95,
      sz: 0.9,
      x: 0.7,
      y: 0.7,
      hex2: WOOD_HI,
    }));

    // --- TRUNK: raised trunk curving upward (good luck pose) ---
    // Base of trunk
    parts.push(cyl(0.15, 0.12, 0.35, 6, wood, {
      x: 1.0,
      y: 0.5,
      rz: -0.5,
      hex2: WOOD_LO,
    }));
    // Middle of trunk
    parts.push(cyl(0.12, 0.1, 0.3, 6, wood, {
      x: 1.15,
      y: 0.68,
      rz: 0.3,
    }));
    // Tip of trunk curving up
    parts.push(cyl(0.1, 0.08, 0.25, 5, WOOD_LO, {
      x: 1.1,
      y: 0.95,
      rz: 0.9,
    }));
    // Trunk tip
    parts.push(sph(0.09, WOOD_LO, { ws: 5, hs: 4, x: 0.95, y: 1.12 }));

    // --- EARS: large flat carved ears ---
    // Left ear
    parts.push(sph(0.28, wood, {
      ws: 6,
      hs: 4,
      sx: 0.25,
      sy: 0.9,
      sz: 1.0,
      x: 0.58,
      y: 0.85,
      z: 0.35,
      hex2: WOOD_LO,
    }));
    // Right ear
    parts.push(sph(0.28, wood, {
      ws: 6,
      hs: 4,
      sx: 0.25,
      sy: 0.9,
      sz: 1.0,
      x: 0.58,
      y: 0.85,
      z: -0.35,
      hex2: WOOD_LO,
    }));

    // --- EYES: small carved indents ---
    parts.push(box(0.06, 0.08, 0.05, EYE, { x: 0.92, y: 0.78, z: 0.2 }));
    parts.push(box(0.06, 0.08, 0.05, EYE, { x: 0.92, y: 0.78, z: -0.2 }));

    // --- TUSKS: small curved tusks ---
    parts.push(cyl(0.04, 0.02, 0.2, 4, 0xf0e8d8, {
      x: 0.95,
      y: 0.42,
      z: 0.12,
      rz: -0.4,
      rx: 0.2,
    }));
    parts.push(cyl(0.04, 0.02, 0.2, 4, 0xf0e8d8, {
      x: 0.95,
      y: 0.42,
      z: -0.12,
      rz: -0.4,
      rx: -0.2,
    }));

    // --- LEGS: four stubby cylindrical legs ---
    const legPositions = [
      { x: 0.4, z: 0.3 },
      { x: 0.4, z: -0.3 },
      { x: -0.4, z: 0.3 },
      { x: -0.4, z: -0.3 },
    ];
    for (const leg of legPositions) {
      parts.push(cyl(0.18, 0.2, 0.45, 6, WOOD_LO, {
        x: leg.x,
        y: 0.0,
        z: leg.z,
        hex2: wood,
      }));
      // Foot
      parts.push(cyl(0.2, 0.2, 0.08, 6, WOOD_LO, {
        x: leg.x,
        y: -0.2,
        z: leg.z,
      }));
    }

    // --- TAIL: small curved tail at back ---
    parts.push(cyl(0.06, 0.04, 0.25, 4, WOOD_LO, {
      x: -0.85,
      y: 0.5,
      rz: 0.6,
    }));

    return finish(parts);
  },
};

export default COL_WOODCARVING;
