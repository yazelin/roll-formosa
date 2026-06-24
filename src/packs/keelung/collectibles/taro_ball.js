/**
 * @file packs/keelung/collectibles/taro_ball.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_TARO_BALL — 連珍芋泥球 (the taro-paste balls from Keelung's century-old 連珍
 * pastry shop): a paper tray holding three dusted purple taro-paste balls. A
 * small hand-held box of sweets — low and round, never a tower.
 *
 * Built ONLY with geomHelpers.js; finish() normalizes to a UNIT sphere.
 * <= 350 triangles. rng() only nudges the taro tint.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_TARO_BALL = {
  id: 'taro_ball',
  name: '連珍芋泥球',
  collectibleId: 4,
  colorHex: 0x9a7bb5, // taro purple

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020103);
    const taro = 0x9a7bb5 + t; // taro purple
    const taroHi = 0xb89cce; // lighter taro
    const dust = 0xe7dcec; // powder dusting
    const tray = 0xece7da; // paper tray
    const trayDk = 0xd5cfc0;

    const parts = [];
    // paper tray (low open box)
    parts.push(box(1.7, 0.3, 1.2, tray, { y: 0.2, hex2: trayDk }));
    parts.push(box(1.5, 0.22, 1.0, 0xf4f0e6, { y: 0.34 })); // inner liner
    // three taro balls
    const pos = [{ x: -0.42, z: 0.0 }, { x: 0.2, z: 0.22 }, { x: 0.34, z: -0.28 }];
    for (const p of pos) {
      parts.push(sph(0.42, taro, { ws: 9, hs: 6, x: p.x, z: p.z, y: 0.66, hex2: taroHi }));
      parts.push(sph(0.4, dust, { ws: 7, hs: 3, sy: 0.2, thetaLen: 1.4, x: p.x, z: p.z, y: 0.86 })); // dusting cap
    }

    return finish(parts);
  },
};

export default COL_TARO_BALL;
