/**
 * @file packs/nantou/collectibles/thao_canoe.js — Roll Formosa Nantou pack, COLLECTIBLE.
 *
 * COL_CANOE — 邵族獨木舟 (the Thao people's dugout canoe of Sun Moon Lake, paired
 * with their 杵音 pestle music). A hollowed dark-wood dugout with upturned ends
 * and a carved gunwale, a single 杵 pestle laid across it. A small hand-held
 * boat — long and low, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the wood tint.
 */

import { cyl, cone, sph, box, finish, HALF_PI, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_CANOE = {
  id: 'thao_canoe',
  name: '邵族獨木舟',
  collectibleId: 6,
  colorHex: 0x6e4a2c, // dark dugout wood

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const wood = 0x6e4a2c + t; // dark wood
    const woodHi = 0x8a6038;
    const hollow = 0x4a3120; // shaded hollow interior
    const pole = 0xcaa86e; // pale 杵 pestle

    const parts = [];
    // HULL bottom — a long narrow rounded keel (half-ellipsoid, flat-ish)
    parts.push(sph(1.3, wood, { ws: 15, hs: 8, sy: 0.34, sz: 0.34, y: 0.5, hex2: woodHi }));
    // two long GUNWALE rails along each side, raised above the keel
    for (const sz of [-1, 1]) {
      parts.push(box(2.0, 0.14, 0.12, woodHi, { z: sz * 0.28, y: 0.78, hex2: wood }));
    }
    // sunken dark INTERIOR channel between the rails (the open dugout)
    parts.push(box(1.95, 0.12, 0.42, hollow, { y: 0.74 }));
    parts.push(box(1.7, 0.1, 0.34, hollow, { y: 0.82 }));
    // upturned pointed BOW + STERN (cones angled up and outward)
    parts.push(cone(0.26, 0.7, 8, wood, { x: 1.2, y: 0.78, rz: -1.0, hex2: woodHi }));
    parts.push(cone(0.26, 0.7, 8, wood, { x: -1.2, y: 0.78, rz: 1.0, hex2: woodHi }));
    // a 杵 (pestle) standing UPRIGHT in the canoe — the Thao 杵音 read
    parts.push(cyl(0.07, 0.09, 1.5, 8, pole, { x: -0.2, y: 1.4, rz: 0.12, hex2: 0xb8945e }));
    parts.push(cyl(0.12, 0.1, 0.14, 8, pole, { x: -0.2, y: 2.12, rz: 0.12 })); // pestle top knob

    return finish(parts);
  },
};

export default COL_CANOE;
