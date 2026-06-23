/**
 * @file packs/pingtung/collectibles/whale_shark.js — Roll Formosa Pingtung pack.
 *
 * 鯨鯊 (Whale Shark) — collectibleId 6. The majestic whale shark at the
 * National Museum of Marine Biology and Aquarium (海生館) in Checheng.
 * Silhouette: a large, flat-headed shark with distinctive white spots,
 * wide mouth, and the characteristic whale shark pattern.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 600 triangles.
 */

import { sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const GREY_BLUE = 0x4a5a6a;    // main body grey-blue
const WHITE = 0xf0f5f8;        // belly white
const SPOT = 0xe8eef2;         // white spots
const FIN = 0x5a6a7a;          // fin color

export const COL_WHALE_SHARK = {
  id: 'whale_shark',
  name: '鯨鯊',
  collectibleId: 6,
  colorHex: GREY_BLUE,

  buildGeometry(rng) {
    const parts = [];

    // --- Main body (simplified: 2 sections) ---
    // Head + body (flat, wide)
    parts.push(sph(0.8, GREY_BLUE, { ws: 6, hs: 4, sx: 1.1, sy: 0.65, sz: 2.0, z: 0.3, hex2: WHITE }));
    // Tail section
    parts.push(sph(0.35, GREY_BLUE, { ws: 5, hs: 3, sx: 0.5, sy: 0.4, sz: 1.2, z: -1.4 }));

    // --- Mouth ---
    parts.push(box(0.8, 0.12, 0.15, 0x3a4a5a, { z: 1.5, y: -0.2 }));

    // --- White spots (reduced to 4) ---
    parts.push(sph(0.07, SPOT, { ws: 3, hs: 2, x: 0.3, y: 0.3, z: 0.4 }));
    parts.push(sph(0.06, SPOT, { ws: 3, hs: 2, x: -0.35, y: 0.28, z: 0.1 }));
    parts.push(sph(0.07, SPOT, { ws: 3, hs: 2, x: 0.25, y: 0.25, z: -0.3 }));
    parts.push(sph(0.06, SPOT, { ws: 3, hs: 2, x: -0.3, y: 0.3, z: -0.6 }));

    // --- Dorsal fin ---
    parts.push(box(0.05, 0.35, 0.25, FIN, { y: 0.5, z: -0.2 }));

    // --- Pectoral fins ---
    parts.push(box(0.6, 0.04, 0.35, FIN, { x: 0.55, y: -0.15, z: 0.2, rz: -0.2 }));
    parts.push(box(0.6, 0.04, 0.35, FIN, { x: -0.55, y: -0.15, z: 0.2, rz: 0.2 }));

    // --- Tail fin ---
    parts.push(box(0.04, 0.4, 0.2, FIN, { y: 0.15, z: -1.9, rx: 0.3 }));
    parts.push(box(0.04, 0.3, 0.15, FIN, { y: -0.15, z: -1.9, rx: -0.25 }));

    return finish(parts);
  },
};

export default COL_WHALE_SHARK;
