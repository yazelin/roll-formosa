/**
 * @file packs/taitung/collectibles/tribal_beads.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_TRIBAL_BEADS — 原住民串珠 (Indigenous Beaded Necklace). Traditional
 * colorful beaded jewelry worn by Taiwan's indigenous peoples, featuring
 * geometric patterns in vibrant colors.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

export const COL_TRIBAL_BEADS = {
  id: 'col_tribal_beads',
  name: '原住民串珠',
  collectibleId: 3,
  colorHex: 0xc84848,

  buildGeometry(rng) {
    const RED = 0xc84848;
    const BLUE = 0x4878c8;
    const YELLOW = 0xe8c848;
    const GREEN = 0x48a868;
    const WHITE = 0xf0f0e8;
    const STRING = 0x4a4030;

    const parts = [];
    const colors = [RED, BLUE, YELLOW, GREEN, WHITE, RED, BLUE, YELLOW];

    // Main necklace loop (beads arranged in a circle)
    const beadCount = 18;
    const radius = 0.7;

    for (let i = 0; i < beadCount; i++) {
      const a = (i / beadCount) * PI * 2;
      const color = colors[i % colors.length];
      const size = 0.08 + (i % 3) * 0.02;
      parts.push(sph(size, color, {
        ws: 4, hs: 3,
        x: Math.cos(a) * radius,
        z: Math.sin(a) * radius,
        y: 0,
      }));
    }

    // String through beads (visible arc)
    parts.push(cyl(0.02, 0.02, 0.5, 6, STRING, {
      x: 0,
      y: 0,
      z: radius,
      rx: HALF_PI,
    }));

    // Central pendant piece
    parts.push(sph(0.15, RED, { ws: 6, hs: 4, x: 0, y: -0.2, z: radius + 0.12 }));
    parts.push(sph(0.1, YELLOW, { ws: 5, hs: 4, x: 0, y: -0.38, z: radius + 0.08 }));
    parts.push(sph(0.08, GREEN, { ws: 5, hs: 4, x: 0, y: -0.52, z: radius + 0.05 }));

    return finish(parts);
  },
};

const HALF_PI = PI / 2;

export default COL_TRIBAL_BEADS;
