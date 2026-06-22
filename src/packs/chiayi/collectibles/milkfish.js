/**
 * @file packs/chiayi/collectibles/milkfish.js — Roll Formosa Chiayi pack, COLLECTIBLE.
 *
 * COL_MILKFISH — 虱目魚 (Milkfish). An important fish in southern Taiwan aquaculture
 * and cuisine. Silver-colored fish with distinctive elongated body. Chiayi coastal
 * areas have milkfish farms.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { sph, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SILVER = 0xb8c8d0;    // silver body
const SILVER_HI = 0xd8e4e8; // silver highlight
const BELLY = 0xe8e8e8;     // white belly
const FIN = 0x98a8b0;       // fin grey

export const COL_MILKFISH = {
  id: 'milkfish',
  name: '虱目魚',
  colorHex: 0xb8c8d0,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Body - elongated oval
    parts.push(sph(0.5, SILVER, { ws: 8, hs: 5, y: 0.3, sx: 1.6, sy: 0.55, sz: 0.5, hex2: SILVER_HI }));

    // Belly (lighter underside)
    parts.push(sph(0.35, BELLY, { ws: 6, hs: 4, y: 0.18, sx: 1.4, sy: 0.3, sz: 0.4 }));

    // Head taper
    parts.push(sph(0.2, SILVER, { ws: 5, hs: 4, x: 0.65, y: 0.32, sx: 1.2, hex2: SILVER_HI }));

    // Eye
    parts.push(sph(0.05, 0xf8f8f0, { ws: 4, hs: 3, x: 0.6, y: 0.38, z: 0.14 }));
    parts.push(sph(0.025, 0x101010, { ws: 3, hs: 2, x: 0.62, y: 0.38, z: 0.16 }));

    // Mouth
    parts.push(cyl(0.03, 0.025, 0.06, 4, 0x888888, { x: 0.78, y: 0.3, rz: HALF_PI + j }));

    // Dorsal fin
    parts.push(cone(0.12, 0.18, 3, FIN, { y: 0.52, x: -0.1, rx: 0.3, ry: PI }));

    // Tail fin (forked)
    parts.push(cone(0.15, 0.25, 3, FIN, { x: -0.75, y: 0.4, rz: HALF_PI + 0.3, sz: 0.3 }));
    parts.push(cone(0.15, 0.25, 3, FIN, { x: -0.75, y: 0.2, rz: HALF_PI - 0.3, sz: 0.3 }));

    // Pectoral fin
    parts.push(cone(0.08, 0.15, 3, FIN, { x: 0.3, y: 0.2, z: 0.2, ry: -0.5, rx: -0.3 }));

    // Anal fin
    parts.push(cone(0.06, 0.1, 3, FIN, { x: -0.35, y: 0.12, rx: -0.5 }));

    return finish(parts);
  },
};

export default COL_MILKFISH;
