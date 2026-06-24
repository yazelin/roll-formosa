/**
 * @file packs/penghu/collectibles/cactus_ice.js — Roll Formosa Penghu pack.
 *
 * COL_CACTUS_ICE — 仙人掌冰 (Cactus Ice Cream), Penghu's signature dessert.
 * A distinctive magenta-pink ice cream made from local prickly pear cactus
 * fruit, served in a cone or cup.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const MAGENTA = 0xd83890; // cactus fruit magenta
const MAGENTA_D = 0xb82870; // darker magenta
const CONE = 0xe8c878; // waffle cone
const CONE_D = 0xc8a858; // darker cone

export const COL_CACTUS_ICE = {
  id: 'cactus_ice',
  name: '仙人掌冰',
  collectibleId: 1,
  colorHex: MAGENTA,

  buildGeometry(rng) {
    const tint = Math.floor(rng() * 0x100808);
    const iceCol = MAGENTA - tint;

    return finish([
      // Waffle cone
      cone(0.55, 1.4, 12, CONE, { rx: PI, y: 0.7, hex2: CONE_D }),
      // Ice cream scoops (magenta cactus flavor)
      sph(0.52, iceCol, { ws: 10, hs: 6, y: 1.35, hex2: MAGENTA_D }),
      sph(0.4, iceCol, { ws: 8, hs: 5, y: 1.75, z: 0.1, hex2: MAGENTA_D }),
      // Small texture bumps
      sph(0.12, MAGENTA_D, { ws: 5, hs: 3, x: -0.25, y: 1.5, z: 0.35 }),
      sph(0.1, MAGENTA_D, { ws: 5, hs: 3, x: 0.2, y: 1.65, z: 0.28 }),
    ]);
  },
};

export default COL_CACTUS_ICE;
