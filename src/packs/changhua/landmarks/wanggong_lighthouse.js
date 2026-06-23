/**
 * @file packs/changhua/landmarks/wanggong_lighthouse.js — Roll Formosa Changhua pack.
 *
 * 王功燈塔 (Wanggong Lighthouse). A distinctive lighthouse in the Wanggong
 * fishing village, standing at 37.4 meters. Features the classic black-and-
 * white horizontal striped pattern. The lighthouse overlooks the oyster
 * farms and wetlands of the western coast. Built in 1983.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, HALF_PI, PI } from '../geomHelpers.js';

const WHITE = 0xf8f8f8;       // white bands
const BLACK = 0x2a2a2a;       // black bands
const GLASS = 0x90c8e0;       // lantern glass
const STEEL = 0x808888;       // steel railing
const CONCRETE = 0xc0b8a8;    // concrete base
const RED = 0xe84030;         // navigation light

export const NM_WANGGONG_LIGHTHOUSE = {
  id: 'wanggong_lighthouse',
  name: '王功燈塔',
  landmarkId: 10,
  dioramaRHint: 37.4,
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // Concrete base platform (reduced segments)
    parts.push(cyl(0.70, 0.75, 0.20, 6, CONCRETE, { y: 0.10 }));

    // Main tower - alternating black and white bands (reduced to 3)
    const baseY = 0.25;
    const bandH = 0.55;
    const bandCount = 3;
    const taperBot = 0.45;
    const taperTop = 0.30;

    for (let i = 0; i < bandCount; i++) {
      const y = baseY + i * bandH + bandH / 2;
      const t = i / bandCount;
      const r = taperBot + (taperTop - taperBot) * t;
      const rTop = taperBot + (taperTop - taperBot) * ((i + 1) / bandCount);
      const color = i % 2 === 0 ? WHITE : BLACK;
      parts.push(cyl(rTop, r, bandH, 8, color, { y }));
    }

    // Gallery (observation deck)
    const galleryY = baseY + bandCount * bandH;
    parts.push(cyl(0.35, 0.32, 0.08, 8, CONCRETE, { y: galleryY + 0.04 }));
    // Simplified railing ring only
    parts.push(cyl(0.36, 0.36, 0.04, 6, STEEL, { y: galleryY + 0.16, open: true }));

    // Lantern room
    const lanternY = galleryY + 0.08;
    parts.push(cyl(0.22, 0.25, 0.30, 6, GLASS, { y: lanternY + 0.23 }));

    // Dome roof
    parts.push(cone(0.0, 0.24, 0.20, 6, BLACK, { y: lanternY + 0.48 }));

    // Top finial
    parts.push(cyl(0.02, 0.02, 0.20, 4, STEEL, { y: lanternY + 0.68 }));
    parts.push(sph(0.04, RED, { ws: 4, hs: 3, y: lanternY + 0.82 }));

    return finish(parts);
  },
};

export default NM_WANGGONG_LIGHTHOUSE;
