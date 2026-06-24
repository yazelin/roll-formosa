/**
 * @file packs/penghu/collectibles/fishing_boat.js — Roll Formosa Penghu pack.
 *
 * COL_FISHING_BOAT — 漁船模型 (Fishing Boat Model), a miniature traditional
 * Penghu fishing boat. Fishing is the lifeblood of these islands.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const HULL = 0x3060a0; // blue hull
const HULL_D = 0x204080; // darker blue
const DECK = 0x8a7060; // wood deck
const CABIN = 0xe8e0d8; // white cabin
const MAST = 0x605040; // wood mast

export const COL_FISHING_BOAT = {
  id: 'fishing_boat_model',
  name: '漁船模型',
  collectibleId: 8,
  colorHex: HULL,

  buildGeometry(rng) {
    const parts = [];

    // Hull body (boat-shaped box, tapered at ends)
    parts.push(box(1.6, 0.35, 0.5, HULL, { y: 0.2, hex2: HULL_D }));
    // Bow taper
    parts.push(box(0.3, 0.3, 0.35, HULL, { x: 0.85, y: 0.18, hex2: HULL_D }));
    // Stern taper
    parts.push(box(0.2, 0.28, 0.4, HULL, { x: -0.8, y: 0.16, hex2: HULL_D }));

    // Deck
    parts.push(box(1.3, 0.06, 0.42, DECK, { y: 0.38 }));

    // Cabin
    parts.push(box(0.4, 0.28, 0.32, CABIN, { x: -0.3, y: 0.52 }));
    parts.push(box(0.38, 0.08, 0.3, 0x4080c0, { x: -0.3, y: 0.68 })); // roof

    // Mast
    parts.push(cyl(0.03, 0.03, 0.7, 6, MAST, { x: 0.25, y: 0.72 }));

    // Fishing equipment (simplified)
    parts.push(box(0.5, 0.08, 0.1, 0x5a5040, { x: 0.4, y: 0.42, z: 0.18 }));

    return finish(parts);
  },
};

export default COL_FISHING_BOAT;
