/**
 * @file packs/newtaipei/collectibles/fishball.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_FISHBALL — 魚丸 (Fishball). Tamsui is famous for its fishball soup.
 * These bouncy white fish balls are served in clear broth with celery
 * and sometimes stuffed with pork. Shown as a small bowl of fishball soup
 * with several floating fishballs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const FISHBALL = 0xf4f0e8;   // white/cream fishball
const FISHBALL_HI = 0xffffff; // highlight
const BROTH = 0xe8dcc4;      // clear soup broth
const CELERY = 0x4a9a4a;     // green celery bits
const BOWL = 0xf8f4ec;       // white ceramic bowl

export const COL_FISHBALL = {
  id: 'fishball',
  name: '魚丸',
  colorHex: FISHBALL, // white fishball read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Soup bowl --------------------------------------------------
    parts.push(cyl(0.8, 0.7, 0.4, 8, BOWL, { y: 0.2 }));
    parts.push(cyl(0.85, 0.82, 0.05, 8, BOWL, { y: 0.42 })); // rim
    parts.push(cyl(0.65, 0.62, 0.3, 8, 0xf0ece4, { y: 0.22 })); // inner

    // ---- 2) Clear broth ------------------------------------------------
    parts.push(cyl(0.6, 0.58, 0.15, 8, BROTH, { y: 0.28 }));

    // ---- 3) Fishballs floating -----------------------------------------
    const fishballPos = [
      { x: 0.0, y: 0.45, z: 0.0 },
      { x: -0.22, y: 0.42, z: 0.12 },
      { x: 0.2, y: 0.43, z: -0.15 },
      { x: 0.05, y: 0.4, z: 0.22 },
      { x: -0.15, y: 0.41, z: -0.18 },
    ];

    for (let i = 0; i < fishballPos.length; i++) {
      const { x, y, z } = fishballPos[i];
      // Main fishball body
      parts.push(sph(0.15, FISHBALL, {
        ws: 7, hs: 5,
        x, y, z,
        hex2: FISHBALL_HI,
      }));
      // Some fishballs are "stuffed" - show pork center
      if (i < 2) {
        parts.push(sph(0.06, 0xc8a080, {
          ws: 4, hs: 3,
          x, y: y + 0.05, z,
        })); // pork filling peek
      }
    }

    // ---- 4) Celery bits floating ---------------------------------------
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2 + rng() * 0.5;
      const r = 0.25 + rng() * 0.2;
      parts.push(box(0.06, 0.02, 0.03, CELERY, {
        x: Math.cos(a) * r,
        y: 0.35,
        z: Math.sin(a) * r,
        ry: rng() * PI,
      }));
    }

    // ---- 5) Soup spoon -------------------------------------------------
    parts.push(cyl(0.1, 0.08, 0.02, 8, 0xffffff, { x: 0.45, y: 0.38, z: 0.3 }));
    parts.push(box(0.04, 0.02, 0.25, 0xffffff, { x: 0.58, y: 0.39, z: 0.42 }));

    return finish(parts);
  },
};

export default COL_FISHBALL;
