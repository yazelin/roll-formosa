/**
 * @file packs/matsu/collectibles/fishing_boat.js — Roll Formosa Matsu pack.
 *
 * 馬祖漁船 (Matsu Fishing Boat) — code 78. A small traditional wooden fishing
 * boat typical of the Matsu islands. Features a curved hull painted in bright
 * colors (often blue or red), with a simple cabin and fishing equipment. These
 * boats dot Matsu's harbors and are essential to the islands' fishing culture.
 *
 * <= 350 triangles.
 */

import { box, cyl, sph, cone, finish, PI } from '../geomHelpers.js';

const HULL = 0x2858a8;       // blue painted hull
const HULL_HI = 0x3a6ac0;    // lighter top
const DECK = 0x8b7355;       // wooden deck
const CABIN = 0xf0e6d8;      // white cabin
const TRIM = 0xc41e3a;       // red trim
const MAST = 0x6b5545;       // wooden mast

export const COL_FISHING_BOAT = {
  id: 'fishing_boat',
  name: '馬祖漁船',
  colorHex: 0x2858a8,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Hull (elongated curved shape)
    parts.push(sph(0.6, HULL, { ws: 8, hs: 5, sx: 1.8, sy: 0.45, sz: 0.7, y: 0.2, hex2: HULL_HI }));

    // Hull keel (bottom ridge)
    parts.push(box(1.4, 0.08, 0.15, HULL, { y: -0.02 }));

    // Bow (pointed front)
    parts.push(cone(0.25, 0.4, 6, HULL_HI, { rx: -PI / 2, x: 0.85, y: 0.25, z: 0 }));

    // Stern (back)
    parts.push(box(0.15, 0.3, 0.35, HULL, { x: -0.7, y: 0.25, hex2: HULL_HI }));

    // Deck surface
    parts.push(box(1.2, 0.05, 0.5, DECK, { y: 0.38 }));

    // Red trim line
    parts.push(box(1.4, 0.04, 0.02, TRIM, { y: 0.32, z: 0.32 }));
    parts.push(box(1.4, 0.04, 0.02, TRIM, { y: 0.32, z: -0.32 }));

    // Cabin (small wheelhouse)
    parts.push(box(0.35, 0.28, 0.32, CABIN, { x: -0.2, y: 0.55 }));
    // Cabin roof
    parts.push(box(0.4, 0.04, 0.36, DECK, { x: -0.2, y: 0.72 }));

    // Mast
    parts.push(cyl(0.03, 0.03, 0.6, 6, MAST, { x: 0.25, y: 0.68 }));

    // Fishing pole/boom
    parts.push(cyl(0.02, 0.02, 0.5, 4, MAST, { x: 0.5, y: 0.5, rz: PI / 4 }));

    return finish(parts);
  },
};

export default COL_FISHING_BOAT;
