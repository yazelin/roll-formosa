/**
 * @file packs/penghu/collectibles/brown_sugar_cake.js — Roll Formosa Penghu pack.
 *
 * COL_BROWN_SUGAR_CAKE — 黑糖糕 (Brown Sugar Cake), Penghu's famous sweet treat.
 * A dark, dense sponge cake made with local brown sugar, often sold in stacks.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CAKE = 0x4a3020; // dark brown sugar cake
const CAKE_D = 0x362418; // darker shade
const CAKE_L = 0x5a4030; // lighter top

export const COL_BROWN_SUGAR_CAKE = {
  id: 'brown_sugar_cake',
  name: '黑糖糕',
  collectibleId: 2,
  colorHex: CAKE,

  buildGeometry(rng) {
    const parts = [];
    // Stack of cake slices
    const nSlices = 3;
    for (let i = 0; i < nSlices; i++) {
      const y = i * 0.35 + 0.2;
      const rot = (i * 0.15) + (rng() - 0.5) * 0.1;
      parts.push(box(1.0, 0.32, 0.7, CAKE, {
        y,
        ry: rot,
        hex2: i === nSlices - 1 ? CAKE_L : CAKE_D,
      }));
    }
    return finish(parts);
  },
};

export default COL_BROWN_SUGAR_CAKE;
