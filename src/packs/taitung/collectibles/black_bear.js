/**
 * @file packs/taitung/collectibles/black_bear.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_BLACK_BEAR — 台灣黑熊 (Formosan Black Bear). Taiwan's iconic endemic
 * subspecies of the Asian black bear, featuring the distinctive white
 * V-shaped chest marking. An endangered species protected in Taitung's
 * mountain forests.
 */

import { box, cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_BLACK_BEAR = {
  id: 'black_bear',
  name: '台灣黑熊',
  collectibleId: 12,
  colorHex: 0x2a2a28,

  buildGeometry(rng) {
    const BLACK = 0x2a2a28;
    const BLACK_LO = 0x1a1a18;
    const WHITE = 0xf0f0e8;
    const NOSE = 0x4a3a30;
    const EYE = 0x1a1a1a;

    const parts = [];

    // Body
    parts.push(sph(0.6, BLACK, {
      ws: 10, hs: 6,
      sx: 1.3,
      y: 0.6,
      hex2: BLACK_LO,
    }));

    // Head
    parts.push(sph(0.4, BLACK, {
      ws: 8, hs: 6,
      x: 0.65,
      y: 0.95,
      hex2: BLACK_LO,
    }));

    // Snout
    parts.push(sph(0.2, BLACK_LO, {
      ws: 6, hs: 4,
      sx: 1.2,
      x: 0.95,
      y: 0.85,
    }));
    // Nose
    parts.push(sph(0.08, NOSE, { ws: 5, hs: 4, x: 1.1, y: 0.88 }));

    // Ears
    parts.push(sph(0.12, BLACK, { ws: 5, hs: 4, x: 0.55, y: 1.28, z: 0.2 }));
    parts.push(sph(0.12, BLACK, { ws: 5, hs: 4, x: 0.55, y: 1.28, z: -0.2 }));

    // Eyes
    parts.push(sph(0.06, EYE, { ws: 4, hs: 3, x: 0.85, y: 1.0, z: 0.15 }));
    parts.push(sph(0.06, EYE, { ws: 4, hs: 3, x: 0.85, y: 1.0, z: -0.15 }));

    // Distinctive V-shaped white chest marking
    parts.push(box(0.08, 0.3, 0.06, WHITE, {
      x: 0.4,
      y: 0.55,
      z: 0.12,
      rz: -0.4,
    }));
    parts.push(box(0.08, 0.3, 0.06, WHITE, {
      x: 0.4,
      y: 0.55,
      z: -0.12,
      rz: -0.4,
    }));
    parts.push(box(0.1, 0.08, 0.2, WHITE, {
      x: 0.52,
      y: 0.45,
    }));

    // Front legs
    parts.push(cyl(0.12, 0.1, 0.4, 8, BLACK, { x: 0.25, y: 0.2, z: 0.25, hex2: BLACK_LO }));
    parts.push(cyl(0.12, 0.1, 0.4, 8, BLACK, { x: 0.25, y: 0.2, z: -0.25, hex2: BLACK_LO }));

    // Back legs
    parts.push(cyl(0.14, 0.12, 0.35, 8, BLACK_LO, { x: -0.3, y: 0.18, z: 0.25 }));
    parts.push(cyl(0.14, 0.12, 0.35, 8, BLACK_LO, { x: -0.3, y: 0.18, z: -0.25 }));

    // Short tail
    parts.push(sph(0.1, BLACK, { ws: 5, hs: 4, x: -0.7, y: 0.65 }));

    return finish(parts);
  },
};

export default COL_BLACK_BEAR;
