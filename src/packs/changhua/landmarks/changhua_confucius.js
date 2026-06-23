/**
 * @file packs/changhua/landmarks/changhua_confucius.js — Roll Formosa Changhua pack.
 *
 * 彰化孔廟 (Changhua Confucius Temple). Built in 1726, one of the oldest
 * Confucius temples in Taiwan. Features the classic 大成殿 (Dacheng Hall)
 * with a wide hip-and-gable roof, red columns, and yellow glazed tiles.
 * The entrance is through a 櫺星門 (Lingxing Gate) with ornate lattice work.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, HALF_PI } from '../geomHelpers.js';

const STONE = 0xc0b8a8;    // grey stone base
const STONE_D = 0xa09888;  // darker stone
const RED = 0xc83838;      // 朱紅 columns
const RED_D = 0x982828;    // deeper red
const YELLOW = 0xe8c848;   // 黃色 glazed roof tiles
const YELLOW_D = 0xc8a838; // darker yellow eave
const GOLD = 0xd8b040;     // ornate ridge
const WHITE = 0xf0e8dc;    // plastered wall
const BROWN = 0x6a5040;    // wood trim

export const NM_CHANGHUA_CONFUCIUS = {
  id: 'changhua_confucius',
  name: '彰化孔廟',
  landmarkId: 10,
  dioramaRHint: 65,
  colorHex: RED,

  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02;
    const parts = [];

    // Stone platform (月台)
    parts.push(box(3.6, 0.24, 2.6, STONE, { y: 0.12, hex2: STONE_D }));
    parts.push(box(3.0, 0.16, 2.0, STONE_D, { y: 0.26 }));
    // Front steps
    parts.push(box(2.0, 0.10, 0.30, STONE, { y: 0.33, z: 1.05 }));

    // Main hall body (大成殿)
    const bodyY = 0.36;
    parts.push(box(2.8, 0.88, 1.8, WHITE, { y: bodyY + 0.44 }));
    parts.push(box(2.4, 0.88, 1.4, RED_D, { y: bodyY + 0.44 }));

    // Central door (大成門) - typically closed during ceremonies
    parts.push(box(0.44, 0.58, 0.06, BROWN, { y: bodyY + 0.29, z: 0.88 }));
    // Side doors
    for (const dx of [-0.80, 0.80]) {
      parts.push(box(0.32, 0.48, 0.06, BROWN, { x: dx, y: bodyY + 0.24, z: 0.88 }));
    }

    // Red columns
    for (const cx of [-1.20, -0.40, 0.40, 1.20]) {
      parts.push(cyl(0.10, 0.11, 0.96, 5, RED, { x: cx, y: bodyY + 0.48, z: 0.90, hex2: RED_D }));
    }
    // Back corner columns
    parts.push(cyl(0.09, 0.10, 0.96, 5, RED, { x: -1.20, y: bodyY + 0.48, z: -0.75, hex2: RED_D }));
    parts.push(cyl(0.09, 0.10, 0.96, 5, RED, { x: 1.20, y: bodyY + 0.48, z: -0.75, hex2: RED_D }));

    // Column-head beam
    parts.push(box(2.8, 0.14, 0.12, RED, { y: bodyY + 0.94, z: 0.90 }));
    parts.push(box(2.8, 0.04, 0.14, GOLD, { y: bodyY + 1.01, z: 0.90 + r }));

    // Hip-and-gable roof (歇山頂) with yellow glazed tiles
    const roofY = bodyY + 1.02;
    // Main roof mass
    parts.push(box(3.0, 0.14, 2.2, YELLOW, { y: roofY + 0.12 }));
    parts.push(box(3.1, 0.08, 2.3, YELLOW_D, { y: roofY + 0.04 }));
    // Ridge
    parts.push(box(2.8, 0.06, 0.10, GOLD, { y: roofY + 0.22 }));
    // Sloped roof panels
    for (const s of [-1, 1]) {
      parts.push(box(2.8, 0.04, 1.0, YELLOW, {
        rx: s * 0.5, y: roofY + 0.28, z: s * 0.70,
      }));
    }

    // Gable end decorations (山牆)
    for (const dx of [-1.45, 1.45]) {
      parts.push(box(0.08, 0.40, 0.80, WHITE, { x: dx, y: roofY + 0.12 }));
    }

    // Ridge ornaments
    const topY = roofY + 0.30;
    parts.push(box(0.60, 0.10, 0.14, GOLD, { y: topY + 0.05 }));
    // 吻獸 (mythical beast finials) at ridge ends
    for (const dx of [-1.20, 1.20]) {
      parts.push(cyl(0.06, 0.08, 0.14, 5, GOLD, { x: dx, y: topY + 0.07 }));
    }

    return finish(parts);
  },
};

export default NM_CHANGHUA_CONFUCIUS;
