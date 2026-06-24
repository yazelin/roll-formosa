/**
 * @file packs/penghu/collectibles/budaixi.js — Roll Formosa Penghu collectible.
 *
 * COL_FISHING_BOAT — 漁船 (traditional fishing boat). A small wooden fishing
 * boat typical of Penghu harbors: a compact, colorful vessel with a rounded
 * hull, small cabin, fishing nets draped over the sides, and navigation flags.
 * The bright blue or green hull with red/orange accents is the signature
 * Penghu fishing boat look.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so this is authored in unit-ish space for correct
 * PROPORTIONS: a low wide boat hull with a small cabin structure. rng only
 * nudges tiny non-structural details. Triangle budget kept well under 350.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — fishing boat materials
const HULL = 0x2878a8;       // bright blue boat hull
const HULL_DK = 0x1a5878;    // darker hull bottom (waterline)
const HULL_HI = 0x4090c0;    // lighter hull highlight
const DECK = 0xc8a870;       // warm wood deck
const DECK_DK = 0xa08050;    // darker wood grain
const CABIN = 0xf0e8d8;      // white/cream cabin
const CABIN_ROOF = 0xc83030; // red cabin roof
const TRIM = 0xe84030;       // red trim / accents
const NET = 0x8a7a6a;        // fishing net grey-brown
const FLAG = 0xe84030;       // red navigation flag
const MAST = 0x9a8a78;       // wooden mast

export const COL_FISHING_BOAT = {
  id: 'fishing_boat_col',
  name: '漁船',
  collectibleId: 7,
  colorHex: HULL, // bright blue — the boat body read color

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.03; // tiny non-structural jitter
    const parts = [];

    // === HULL (rounded boat body) ============================================
    // Main hull — elongated ellipsoid shape, narrowing at bow and stern
    parts.push(sph(0.9, HULL, {
      ws: 8, hs: 4, sx: 1.6, sy: 0.45, sz: 0.75,
      y: 0.15, hex2: HULL_DK
    }));
    // Hull upper sides (gunwale)
    parts.push(sph(0.85, HULL_HI, {
      ws: 7, hs: 3, sx: 1.5, sy: 0.25, sz: 0.7,
      y: 0.35, thetaLen: HALF_PI
    }));

    // Bow (pointed front)
    parts.push(cone(0.35, 0.5, 5, HULL, {
      x: 1.2, y: 0.25, rz: HALF_PI, sz: 0.8, hex2: HULL_HI
    }));
    // Stern (flat back)
    parts.push(box(0.15, 0.35, 0.55, HULL_DK, { x: -1.1, y: 0.22 }));

    // Red trim line along hull
    parts.push(box(2.2, 0.06, 0.02, TRIM, { y: 0.38, z: 0.5 }));
    parts.push(box(2.2, 0.06, 0.02, TRIM, { y: 0.38, z: -0.5 }));

    // === DECK ================================================================
    parts.push(box(1.8, 0.08, 0.9, DECK, { y: 0.42, hex2: DECK_DK }));
    // Deck planks (visible lines)
    parts.push(box(1.7, 0.02, 0.02, DECK_DK, { y: 0.47, z: 0.2 }));
    parts.push(box(1.7, 0.02, 0.02, DECK_DK, { y: 0.47, z: -0.2 }));

    // === CABIN (small wheelhouse) ============================================
    // Main cabin structure
    parts.push(box(0.5, 0.4, 0.5, CABIN, { x: -0.3, y: 0.66 }));
    // Cabin roof (red)
    parts.push(box(0.55, 0.08, 0.55, CABIN_ROOF, { x: -0.3, y: 0.9 }));
    // Cabin windows (dark)
    parts.push(box(0.15, 0.12, 0.02, 0x2a3a4a, { x: -0.3, y: 0.7, z: 0.26 }));
    parts.push(box(0.02, 0.12, 0.15, 0x2a3a4a, { x: -0.04, y: 0.7, z: 0 }));

    // === MAST with flag ======================================================
    parts.push(cyl(0.04, 0.04, 0.7, 5, MAST, { x: 0.4, y: 0.85 }));
    // Small flag at top
    parts.push(box(0.2, 0.12, 0.02, FLAG, {
      x: 0.52, y: 1.15, rz: 0.1 + j
    }));

    // === FISHING EQUIPMENT ===================================================
    // Net pile on deck
    parts.push(sph(0.2, NET, {
      ws: 5, hs: 3, sy: 0.6, sx: 1.2,
      x: 0.6, y: 0.52
    }));
    parts.push(sph(0.15, NET, {
      ws: 4, hs: 2, sy: 0.5,
      x: 0.75, y: 0.48
    }));

    // Buoys (colorful floats)
    parts.push(sph(0.08, TRIM, { ws: 4, hs: 3, x: 0.85, y: 0.5, z: 0.25 }));
    parts.push(sph(0.07, 0x40a040, { ws: 4, hs: 3, x: 0.9, y: 0.48, z: -0.15 }));

    // Rope coil
    parts.push(cyl(0.12, 0.12, 0.06, 6, DECK_DK, {
      x: -0.75, y: 0.48
    }));

    // === BOW DETAILS =========================================================
    // Anchor
    parts.push(cyl(0.03, 0.03, 0.15, 4, 0x4a4a4a, {
      x: 1.0, y: 0.35, z: 0.2, rz: 0.3
    }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_PUPPET = COL_FISHING_BOAT;

export default COL_FISHING_BOAT;
