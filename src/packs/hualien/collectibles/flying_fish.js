/**
 * @file packs/hualien/collectibles/flying_fish.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_FLYING_FISH — 飛魚 (flying fish). The silvery flying fish of Taiwan's
 * east coast, a traditional catch of the indigenous Amis people. Features
 * the distinctive extended pectoral fins that allow the fish to glide above
 * the water, displayed as if in mid-flight.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { cyl, cone, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BODY = 0x6080a0; // blue-silver body
const BELLY = 0xd0d8e0; // silvery white belly
const FIN = 0x8090b0; // translucent blue-grey fin
const FIN_EDGE = 0xa0b0c8;
const EYE = 0x202020;

export const COL_FLYING_FISH = {
  id: 'flying_fish',
  name: '飛魚',
  collectibleId: 9,
  colorHex: 0x6080a0, // blue-silver

  buildGeometry(rng) {
    const parts = [];

    // --- BODY: streamlined torpedo shape ---
    // Main body
    parts.push(cyl(0.25, 0.2, 1.4, 8, BODY, { rz: HALF_PI, y: 0.0, hex2: BELLY }));
    // Head taper
    parts.push(cone(0.22, 0.35, 8, BODY, { rz: HALF_PI, x: 0.85, y: 0.0, hex2: BELLY }));
    // Tail taper
    parts.push(cone(0.18, 0.4, 6, BODY, { rz: -HALF_PI, x: -0.88, y: 0.0 }));

    // --- EXTENDED PECTORAL FINS (the flying fins) ---
    // Left wing fin
    parts.push(box(0.5, 0.02, 0.6, FIN, { x: 0.15, y: 0.2, z: 0.4, rx: 0.3, ry: 0.2, hex2: FIN_EDGE }));
    // Right wing fin
    parts.push(box(0.5, 0.02, 0.6, FIN, { x: 0.15, y: 0.2, z: -0.4, rx: -0.3, ry: -0.2, hex2: FIN_EDGE }));

    // --- TAIL FIN (forked) ---
    parts.push(box(0.25, 0.35, 0.04, FIN, { x: -1.15, y: 0.15, z: 0, rx: 0, rz: 0.4, hex2: FIN_EDGE }));
    parts.push(box(0.25, 0.35, 0.04, FIN, { x: -1.15, y: -0.15, z: 0, rx: 0, rz: -0.4, hex2: FIN_EDGE }));

    // --- DORSAL FIN ---
    parts.push(box(0.3, 0.15, 0.02, FIN, { x: -0.2, y: 0.3, z: 0 }));

    // --- EYES ---
    parts.push(sph(0.06, EYE, { ws: 4, hs: 3, x: 0.95, y: 0.08, z: 0.12 }));
    parts.push(sph(0.06, EYE, { ws: 4, hs: 3, x: 0.95, y: 0.08, z: -0.12 }));

    return finish(parts);
  },
};

export default COL_FLYING_FISH;
