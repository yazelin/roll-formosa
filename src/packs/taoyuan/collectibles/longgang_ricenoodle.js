/**
 * @file packs/taoyuan/collectibles/longgang_ricenoodle.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_RICENOODLE — 龍岡米干 (Longgang Yunnan-style rice noodles, the signature
 * dish of Taoyuan's Yunnan-Burmese 龍岡 military-village community). Silhouette:
 * a wide ceramic bowl of pale broth with a mound of flat white rice noodles,
 * a few green herb flecks and a red chili, with a pair of chopsticks resting
 * across the rim. A small hand-held bowl — wide and squat, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges broth tint.
 */

import { cyl, sph, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_RICENOODLE = {
  id: 'longgang_ricenoodle',
  name: '龍岡米干',
  collectibleId: 4,
  colorHex: 0xeae0cf, // pale rice-noodle white

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040402);
    const broth = 0xe9d8a8 + t; // pale golden broth
    const bowl = 0xf3f0ea; // white ceramic
    const bowlBand = 0x3f6fae; // blue rim print
    const noodle = 0xf2ece0; // white flat noodle
    const herb = 0x5b9a45; // green herb
    const chili = 0xc8362b; // red chili
    const wood = 0xcaa86e; // chopsticks

    const parts = [];
    // bowl
    parts.push(cyl(0.92, 0.56, 0.86, 16, bowl, { y: 0.5, hex2: 0xe6e2da }));
    parts.push(cyl(0.94, 0.9, 0.12, 16, bowlBand, { y: 0.9, open: true }));
    parts.push(cyl(0.56, 0.56, 0.05, 8, 0xe2ded6, { y: 0.08 }));
    // broth surface
    parts.push(cyl(0.84, 0.84, 0.06, 16, broth, { y: 0.86, hex2: 0xf0e3b8 }));
    // noodle mound
    parts.push(sph(0.62, noodle, { ws: 12, hs: 6, sy: 0.5, y: 0.96, hex2: 0xfbf6ec }));
    parts.push(sph(0.3, noodle, { ws: 8, hs: 4, sy: 0.6, x: 0.22, z: 0.16, y: 1.18 }));
    // toppings
    parts.push(sph(0.1, herb, { ws: 5, hs: 3, x: -0.2, z: 0.2, y: 1.12 }));
    parts.push(sph(0.09, herb, { ws: 5, hs: 3, x: 0.3, z: -0.18, y: 1.1 }));
    parts.push(cyl(0.05, 0.03, 0.34, 5, chili, { x: -0.1, z: -0.26, y: 1.12, rz: 0.5 }));
    // chopsticks across the rim
    parts.push(box(0.05, 0.05, 1.7, wood, { x: 0.34, y: 1.06, z: 0.0, rx: 0.06, hex2: 0xb8945e }));
    parts.push(box(0.05, 0.05, 1.7, wood, { x: 0.46, y: 1.04, z: 0.0, rx: 0.06, hex2: 0xb8945e }));

    return finish(parts);
  },
};

export default COL_RICENOODLE;
