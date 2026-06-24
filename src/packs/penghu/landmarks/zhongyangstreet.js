/**
 * @file packs/penghu/landmarks/zhongyangstreet.js — Roll Formosa Penghu pack, landmark 2.
 *
 * NM_ZHONGYANG — 中央老街 (Zhongyang Old Street), 馬公市. The oldest commercial
 * street in Penghu, dating to the Qing dynasty, with traditional red-brick
 * shophouses selling local specialties. Silhouette: a row of narrow two-story
 * shophouses with arched facades and colorful signs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — traditional red-brick shophouses.
const BRICK = 0xb86450; // red brick
const BRICK_D = 0x8a4a3a; // darker brick
const WALL = 0xe8dcc8; // cream plaster
const WOOD = 0x6e4a30; // wood doors/windows
const SIGN = 0xc82020; // red signage

export const NM_ZHONGYANG = {
  id: 'zhongyang_street',
  name: '中央老街',
  landmarkId: 2,
  dioramaRHint: 45, // street block ~90m
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];

    // Row of shophouses
    const nShops = 5;
    const shopW = 0.36;
    const gap = 0.02;

    for (let i = 0; i < nShops; i++) {
      const x = (i - (nShops - 1) / 2) * (shopW + gap);
      const h = 0.7 + (rng() * 0.15); // slight height variation

      // Main building body
      parts.push(box(shopW, h, 0.5, BRICK, { x, y: h / 2, hex2: BRICK_D }));

      // Arched facade top
      parts.push(box(shopW, 0.15, 0.08, WALL, { x, y: h + 0.08, z: 0.24 }));

      // Ground floor arcade opening
      parts.push(box(shopW * 0.6, 0.35, 0.12, 0x2a2520, { x, y: 0.2, z: 0.24 }));

      // Shop sign
      const signCol = i % 2 === 0 ? SIGN : 0x2060a0;
      parts.push(box(shopW * 0.5, 0.12, 0.04, signCol, { x, y: h * 0.7, z: 0.28 }));

      // Upper floor window
      parts.push(box(shopW * 0.4, 0.15, 0.06, WOOD, { x, y: h * 0.55, z: 0.26 }));
    }

    // Street pavement
    parts.push(box(2.2, 0.04, 0.6, 0x9a9590, { y: 0.02, z: 0.6 }));

    // Lanterns hanging
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.6;
      parts.push(cyl(0.05, 0.04, 0.1, 6, 0xc82020, { x, y: 0.9, z: 0.4 }));
    }

    return finish(parts);
  },
};

export default NM_ZHONGYANG;
