/**
 * @file packs/taitung/collectibles/tao_boat.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_TAO_BOAT — 達悟拼板舟 (Tao Tatala/Carved Canoe). The iconic carved wooden
 * boat of the Tao people of Orchid Island (蘭嶼), featuring distinctive red,
 * white, and black geometric patterns and carved human figures on the bow.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_TAO_BOAT = {
  id: 'tao_boat',
  name: '達悟拼板舟',
  collectibleId: 6,
  colorHex: 0xc84040,

  buildGeometry(rng) {
    const RED = 0xc84040; // traditional red
    const WHITE = 0xf0f0e8;
    const BLACK = 0x2a2a28;
    const WOOD = 0x7a5a3a;

    const parts = [];

    // Hull base (elongated boat shape)
    parts.push(box(2.2, 0.18, 0.5, WOOD, {
      y: 0.09,
      hex2: 0x5a4030,
    }));

    // Curved hull sides (approximated with angled boxes)
    parts.push(box(2.0, 0.25, 0.06, RED, {
      y: 0.25,
      z: 0.25,
      rx: 0.3,
    }));
    parts.push(box(2.0, 0.25, 0.06, RED, {
      y: 0.25,
      z: -0.25,
      rx: -0.3,
    }));

    // White wave patterns on hull
    for (let i = -2; i <= 2; i++) {
      parts.push(box(0.3, 0.06, 0.065, WHITE, {
        x: i * 0.4,
        y: 0.22,
        z: 0.27,
        rx: 0.3,
      }));
      parts.push(box(0.3, 0.06, 0.065, WHITE, {
        x: i * 0.4 + 0.2,
        y: 0.22,
        z: -0.27,
        rx: -0.3,
      }));
    }

    // Pointed bow
    parts.push(cone(0.18, 0.5, 6, RED, {
      rz: -HALF_PI,
      x: 1.3,
      sy: 0.6,
      hex2: WHITE,
    }));

    // Pointed stern
    parts.push(cone(0.15, 0.4, 6, BLACK, {
      rz: HALF_PI,
      x: -1.25,
      sy: 0.5,
    }));

    // Black zigzag pattern band
    parts.push(box(1.6, 0.08, 0.07, BLACK, {
      y: 0.35,
      z: 0.28,
      rx: 0.3,
    }));
    parts.push(box(1.6, 0.08, 0.07, BLACK, {
      y: 0.35,
      z: -0.28,
      rx: -0.3,
    }));

    // Human figure carving on bow (stylized)
    parts.push(sph(0.06, WHITE, { ws: 5, hs: 4, x: 1.05, y: 0.35, sy: 1.2 }));
    parts.push(box(0.04, 0.12, 0.04, WHITE, { x: 1.05, y: 0.22 }));

    return finish(parts);
  },
};

export default COL_TAO_BOAT;
