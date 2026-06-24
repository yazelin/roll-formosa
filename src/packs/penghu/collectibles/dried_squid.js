/**
 * @file packs/penghu/collectibles/dried_squid.js — Roll Formosa Penghu pack.
 *
 * COL_DRIED_SQUID — 小管乾 (Dried Squid), Penghu's famous dried seafood.
 * Fresh squid dried and grilled, a popular snack and souvenir.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const SQUID = 0xe8d0b8; // dried squid color
const SQUID_D = 0xc8a890; // darker shade
const CHAR = 0x8a6a50; // charred marks

export const COL_DRIED_SQUID = {
  id: 'dried_squid',
  name: '小管乾',
  collectibleId: 3,
  colorHex: SQUID,

  buildGeometry(rng) {
    const parts = [];

    // Main body (flattened tube shape)
    parts.push(cyl(0.35, 0.3, 1.4, 8, SQUID, {
      rz: HALF_PI,
      y: 0.35,
      sy: 0.5,
      hex2: SQUID_D,
    }));

    // Tentacles at one end
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      const x = -0.8 + Math.cos(a) * 0.08;
      const z = Math.sin(a) * 0.12;
      parts.push(cyl(0.04, 0.02, 0.4, 4, SQUID_D, {
        x,
        y: 0.35,
        z,
        rz: HALF_PI + 0.3 + (rng() - 0.5) * 0.2,
      }));
    }

    // Charred grill marks
    for (let i = 0; i < 4; i++) {
      const x = -0.4 + i * 0.25;
      parts.push(box(0.06, 0.15, 0.45, CHAR, { x, y: 0.4 }));
    }

    return finish(parts);
  },
};

export default COL_DRIED_SQUID;
