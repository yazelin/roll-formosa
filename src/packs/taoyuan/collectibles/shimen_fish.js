/**
 * @file packs/taoyuan/collectibles/shimen_fish.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_FISH — 石門活魚 (Shimen Reservoir "live fish", Taoyuan's famous reservoir
 * fish feast). Silhouette: a plump steamed fish plated on an oval dish, head and
 * tail lifted, a scored body with a few scallion strands and a red chili laid
 * across it. A small hand-held plated dish — long and low, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the fish tint.
 */

import { cyl, sph, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_FISH = {
  id: 'shimen_fish',
  name: '石門活魚',
  collectibleId: 9,
  colorHex: 0xc9bca8, // steamed fish grey-tan

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030302);
    const fish = 0xc9bca8 + t; // steamed grey-tan
    const fishHi = 0xe0d6c4;
    const belly = 0xf1ece2; // pale belly
    const plate = 0xf3f1ec; // white oval dish
    const plateBand = 0x3f6fae; // blue plate rim
    const scallion = 0x6aa84a; // green scallion
    const chili = 0xc8362b; // red chili

    const parts = [];
    // oval plate (flattened wide disc)
    parts.push(cyl(1.15, 1.2, 0.14, 18, plate, { sz: 0.62, y: 0.16, hex2: 0xe7e3db }));
    parts.push(cyl(1.16, 1.12, 0.06, 18, plateBand, { sz: 0.62, y: 0.24, open: true }));
    // fish body — a long capsule lying along X, slightly arched
    parts.push(cyl(0.4, 0.4, 1.5, 12, fish, { rz: HALF_PI, y: 0.42, sz: 0.78, hex2: fishHi }));
    parts.push(sph(0.4, fish, { ws: 12, hs: 7, x: 0.74, y: 0.42, sz: 0.78, hex2: fishHi })); // head
    parts.push(sph(0.3, fish, { ws: 10, hs: 6, x: -0.74, y: 0.42, sz: 0.78 })); // tail base
    parts.push(cyl(0.42, 0.4, 1.5, 10, belly, { rz: HALF_PI, y: 0.3, sz: 0.5 })); // pale belly underside
    // tail fin (flat triangle-ish via flattened cone substitute: thin box pair)
    parts.push(box(0.5, 0.5, 0.04, fishHi, { x: -1.15, y: 0.5, rz: 0.4 }));
    parts.push(box(0.5, 0.5, 0.04, fishHi, { x: -1.15, y: 0.34, rz: -0.4 }));
    // eye
    parts.push(sph(0.07, 0x2a2320, { ws: 5, hs: 4, x: 0.92, y: 0.52, z: 0.2 }));
    // scallion strands + chili across the body
    parts.push(cyl(0.04, 0.04, 0.9, 5, scallion, { rz: HALF_PI, x: 0.0, y: 0.78, z: 0.06 }));
    parts.push(cyl(0.04, 0.04, 0.7, 5, scallion, { rz: HALF_PI + 0.2, x: -0.2, y: 0.78, z: -0.1 }));
    parts.push(cyl(0.05, 0.03, 0.34, 5, chili, { rz: HALF_PI - 0.3, x: 0.3, y: 0.8, z: 0.0 }));

    return finish(parts);
  },
};

export default COL_FISH;
