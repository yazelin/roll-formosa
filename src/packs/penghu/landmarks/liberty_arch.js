/**
 * @file packs/penghu/landmarks/liberty_arch.js — Roll Formosa Penghu pack, landmark 6.
 *
 * 觀音亭 (Guanyinting / Guanyin Pavilion) — a historic seaside temple in Magong
 * dedicated to Guanyin (Avalokitesvara), famous for its rainbow bridge (彩虹橋)
 * and beautiful sunset views. The temple overlooks Magong Bay and features
 * traditional architecture with a distinctive multi-colored pedestrian bridge
 * extending into the sea.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1).
 *
 * Palette: temple red/gold + rainbow bridge colors + sea blue.
 */

import { box, cyl, cone, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const RED = 0xc83028; // temple red
const RED_D = 0xa82018; // darker red
const GOLD = 0xd8a830; // gold trim
const GREEN_TILE = 0x2a5a3a; // green glazed roof
const GREEN_D = 0x1a4028; // darker green
const WHITE = 0xf0e8d8; // white walls
const SEA = 0x3a8ab0; // sea blue
const SEA_L = 0x5aaad0; // lighter sea
const STONE = 0xa8a090; // stone base
const FOAM = 0xe8f4f8; // sea foam

// Rainbow bridge colors
const RAINBOW = [
  0xe83030, // red
  0xe87830, // orange
  0xe8d030, // yellow
  0x40b840, // green
  0x3080d0, // blue
  0x6840a8, // purple
];

export const NM_GUANYINTING = {
  id: 'guanyinting',
  name: '觀音亭',
  landmarkId: 6,
  dioramaRHint: 45, // ~90 m area including bridge
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // ---- sea base ----
    parts.push(cyl(3.2, 3.4, 0.15, 8, SEA, { y: 0.075, hex2: SEA_L }));

    // ---- temple platform on shore ----
    parts.push(box(2.5, 0.35, 1.8, STONE, { x: -1.2, y: 0.25, z: -0.8, hex2: 0xb8b0a0 }));

    // ---- main temple building ----
    const templeX = -1.2;
    const templeZ = -0.8;
    const templeY = 0.62;

    // Temple body
    parts.push(box(1.6, 0.9, 1.1, WHITE, { x: templeX, y: templeY + 0.45, z: templeZ }));
    parts.push(box(1.3, 0.9, 0.9, RED_D, { x: templeX, y: templeY + 0.45, z: templeZ }));

    // Gold beam
    parts.push(box(1.7, 0.08, 0.1, GOLD, { x: templeX, y: templeY + 0.92, z: templeZ + 0.55 }));

    // Temple roof (green glazed tiles with swallowtail)
    parts.push(box(1.9, 0.12, 1.4, GREEN_D, { x: templeX, y: templeY + 1.0, z: templeZ }));
    parts.push(cone(1.2, 0.5, 4, GREEN_TILE, { ry: PI / 4, x: templeX, y: templeY + 1.32, z: templeZ, hex2: GREEN_D }));

    // Ridge ornament
    parts.push(box(0.4, 0.08, 0.12, GOLD, { x: templeX, y: templeY + 1.55, z: templeZ }));

    // ---- rainbow bridge (彩虹橋) extending into the sea ----
    const bridgeStartZ = templeZ + 0.9;
    const bridgeLen = 3.5;
    const archCount = 4; // Reduced from 6

    // Bridge deck
    parts.push(box(0.6, 0.08, bridgeLen, STONE, { x: templeX + 0.8, y: 0.35, z: bridgeStartZ + bridgeLen / 2 }));

    // Rainbow arches (simplified - fewer arches, no supports)
    for (let i = 0; i < archCount; i++) {
      const az = bridgeStartZ + 0.5 + i * (bridgeLen / archCount);
      const color = RAINBOW[i % RAINBOW.length];

      // Arch (semi-circular using torus segment)
      parts.push(
        torus(0.35, 0.06, 4, 6, color, {
          arc: PI,
          ry: HALF_PI,
          x: templeX + 0.8,
          y: 0.4,
          z: az,
        })
      );
    }

    // Bridge end platform
    parts.push(cyl(0.5, 0.55, 0.15, 6, STONE, { x: templeX + 0.8, y: 0.38, z: bridgeStartZ + bridgeLen + 0.3 }));

    // ---- sunset glow on water (subtle reflection effect) ----
    parts.push(box(1.5, 0.02, 2.0, 0xe8a050, { x: 0.8, y: 0.08, z: 1.5, sy: 0.3 }));

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_LIBERTY_ARCH)
export const NM_LIBERTY_ARCH = NM_GUANYINTING;

export default NM_GUANYINTING;
