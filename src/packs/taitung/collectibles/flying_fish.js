/**
 * @file packs/taitung/collectibles/flying_fish.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_FLYING_FISH — 飛魚 (Flying Fish). An iconic food of the indigenous Tao
 * people of Orchid Island (蘭嶼), connected to Taitung. The fish has distinctive
 * large wing-like pectoral fins that allow it to glide above water.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_FLYING_FISH = {
  id: 'flying_fish',
  name: '飛魚',
  collectibleId: 1,
  colorHex: 0x4a6a8a,

  buildGeometry(rng) {
    const BODY = 0x4a6a8a; // blue-silver body
    const BODY_LO = 0x3a5a7a;
    const BELLY = 0xd8d8d0; // silver belly
    const FIN = 0x5a7a9a; // fin blue
    const EYE = 0x1a1a1a;

    const parts = [];

    // Streamlined body
    parts.push(sph(0.3, BODY, {
      ws: 10, hs: 6,
      sx: 2.5,
      sy: 0.7,
      y: 0,
      hex2: BELLY,
    }));

    // Head (front cone)
    parts.push(cone(0.2, 0.5, 8, BODY_LO, {
      rz: -HALF_PI,
      x: 1.0,
      sy: 0.7,
    }));

    // Tail fin (forked)
    parts.push(box(0.5, 0.35, 0.04, FIN, {
      x: -1.1,
      y: 0.1,
      rz: 0.3,
    }));
    parts.push(box(0.5, 0.35, 0.04, FIN, {
      x: -1.1,
      y: -0.1,
      rz: -0.3,
    }));

    // Large wing-like pectoral fins (the distinctive feature)
    parts.push(box(0.8, 0.04, 0.5, FIN, {
      x: 0.2,
      y: 0.12,
      z: 0.35,
      rx: 0.3,
      ry: 0.2,
      hex2: BODY,
    }));
    parts.push(box(0.8, 0.04, 0.5, FIN, {
      x: 0.2,
      y: 0.12,
      z: -0.35,
      rx: -0.3,
      ry: -0.2,
      hex2: BODY,
    }));

    // Dorsal fin
    parts.push(box(0.3, 0.2, 0.03, FIN, {
      x: -0.2,
      y: 0.28,
    }));

    // Eyes
    parts.push(sph(0.06, EYE, { ws: 5, hs: 4, x: 0.9, y: 0.08, z: 0.15 }));
    parts.push(sph(0.06, EYE, { ws: 5, hs: 4, x: 0.9, y: 0.08, z: -0.15 }));

    return finish(parts);
  },
};

export default COL_FLYING_FISH;
