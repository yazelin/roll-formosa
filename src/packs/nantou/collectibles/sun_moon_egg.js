/**
 * @file packs/nantou/collectibles/sun_moon_egg.js — Roll Formosa Nantou pack, COLLECTIBLE.
 *
 * COL_TEA_EGG — 日月潭香菇茶葉蛋 (the famous shiitake tea-eggs sold lakeside at
 * Sun Moon Lake). Two glossy marbled brown tea-eggs on a small dish with a star
 * anise pod. A small hand-held snack dish — low and round, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the marbling tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_TEA_EGG = {
  id: 'sun_moon_egg',
  name: '日月潭茶葉蛋',
  collectibleId: 2,
  colorHex: 0x8a5a32, // marbled tea-egg brown

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const egg = 0x8a5a32 + t; // tea-stained brown
    const eggHi = 0xa8744a; // lighter marble
    const crack = 0x5e3c1f; // dark crack line
    const plate = 0xeceae3; // small dish
    const plateBand = 0x8a3f2f; // earthy rim
    const anise = 0x4a2f1c; // star anise

    const parts = [];
    // small dish
    parts.push(cyl(0.95, 1.0, 0.14, 16, plate, { y: 0.14, hex2: 0xe1ded5 }));
    parts.push(cyl(0.96, 0.9, 0.05, 16, plateBand, { y: 0.21, open: true }));
    // two marbled tea eggs (ovoid)
    const eggs = [{ x: -0.3, z: 0.05 }, { x: 0.28, z: -0.12 }];
    for (const e of eggs) {
      parts.push(sph(0.46, egg, { ws: 12, hs: 9, sy: 1.25, x: e.x, z: e.z, y: 0.6, hex2: eggHi }));
      // crack lines (thin dark bands wrapping the shell)
      parts.push(box(0.04, 0.5, 0.5, crack, { x: e.x, z: e.z, y: 0.62 }));
      parts.push(box(0.5, 0.04, 0.42, crack, { x: e.x, z: e.z, y: 0.72 }));
    }
    // star anise pod on the dish
    parts.push(cyl(0.16, 0.16, 0.06, 8, anise, { x: 0.0, z: 0.5, y: 0.26 }));
    parts.push(sph(0.06, anise, { ws: 5, hs: 4, x: 0.0, z: 0.5, y: 0.32 }));

    return finish(parts);
  },
};

export default COL_TEA_EGG;
