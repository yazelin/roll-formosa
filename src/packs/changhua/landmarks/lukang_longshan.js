/**
 * @file packs/changhua/landmarks/lukang_longshan.js — Roll Formosa Changhua pack.
 *
 * 鹿港龍山寺 (Lukang Longshan Temple). The finest preserved Qing-dynasty Buddhist
 * temple in Taiwan, built in 1786. Famous for its intricate woodcarving, the
 * swallowtail roof with 燕尾 corners, octagonal caisson ceiling (藻井), and
 * the iconic red columns with gold trim. A wide temple compound with a front
 * courtyard, 三川殿 entry hall, and main worship hall.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, finish, HALF_PI, PI } from '../geomHelpers.js';

const STONE = 0xbab3a4;   // grey courtyard stone
const STONE_D = 0x9d9587; // darker stone
const RED = 0xc0303a;     // 朱紅 lacquered columns
const RED_D = 0x931f27;   // deeper red
const GREEN = 0x2f5d44;   // 墨綠 glazed roof tile
const GREEN_D = 0x224534; // deeper green eave
const GOLD = 0xd4a64a;    // ornate ridge
const WHITE = 0xece6da;   // plastered wall
const WOOD = 0x8b6b4a;    // wood trim

function swallowRoof(out, y, hw, hd, th, ridgeH) {
  out.push(box(hw * 2, th * 0.6, hd * 2, GREEN, { y: y + th * 0.7 }));
  out.push(box(hw * 2 + 0.12, th * 0.45, hd * 2 + 0.12, GREEN_D, { y: y + th * 0.22 }));
  const slopeLen = hd * 1.2;
  for (const s of [-1, 1]) {
    out.push(box(hw * 2 - 0.06, 0.04, slopeLen, GREEN, {
      rx: s * 0.6, y: y + th + ridgeH * 0.5, z: s * hd * 0.42,
    }));
  }
  out.push(box(hw * 2 - 0.04, ridgeH * 0.55, 0.12, GOLD, { y: y + th + ridgeH * 0.75 }));
  const sweep = 0.55;
  const spurLen = hw * 0.66;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerX = sx * hw;
      const cornerZ = sz * hd;
      out.push(box(spurLen, 0.07, 0.12, GREEN, {
        rz: sx * sweep, x: cornerX - sx * spurLen * 0.32,
        y: y + th * 0.5 + spurLen * 0.18, z: cornerZ,
      }));
      out.push(box(0.2, 0.06, 0.1, GOLD, {
        rz: sx * (sweep + 0.3), x: cornerX + sx * 0.18,
        y: y + th * 0.5 + spurLen * 0.46, z: cornerZ,
      }));
    }
  }
}

export const NM_LUKANG_LONGSHAN = {
  id: 'lukang_longshan',
  name: '鹿港龍山寺',
  landmarkId: 10,
  dioramaRHint: 95,
  colorHex: RED,

  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02;
    const parts = [];

    // Courtyard platform
    parts.push(box(4.2, 0.28, 3.0, STONE, { y: 0.14, hex2: STONE_D }));
    parts.push(box(3.4, 0.20, 2.4, STONE_D, { y: 0.30 }));
    parts.push(box(2.8, 0.12, 0.36, STONE, { y: 0.38, z: 1.15 }));

    // Main hall body
    const bodyY = 0.42;
    parts.push(box(3.2, 1.0, 2.2, WHITE, { y: bodyY + 0.50 }));
    parts.push(box(2.8, 1.0, 1.8, RED_D, { y: bodyY + 0.50 }));

    // Three-bay doorway
    parts.push(box(0.50, 0.68, 0.08, 0x3a1417, { y: bodyY + 0.34, z: 1.05 }));
    for (const dx of [-0.92, 0.92]) {
      parts.push(box(0.36, 0.54, 0.08, 0x3a1417, { x: dx, y: bodyY + 0.27, z: 1.05 }));
    }

    // Red lacquer columns
    for (const cx of [-1.38, -0.46, 0.46, 1.38]) {
      parts.push(cyl(0.12, 0.13, 1.10, 5, RED, { x: cx, y: bodyY + 0.55, z: 1.05, hex2: RED_D }));
    }
    parts.push(cyl(0.11, 0.12, 1.10, 5, RED, { x: -1.38, y: bodyY + 0.55, z: -0.90, hex2: RED_D }));

    // Column-head beam
    parts.push(box(3.2, 0.16, 0.14, RED, { y: bodyY + 1.08, z: 1.05 }));
    parts.push(box(3.2, 0.05, 0.16, GOLD, { y: bodyY + 1.16, z: 1.05 + r }));

    // Swallowtail roof
    swallowRoof(parts, bodyY + 1.15, 2.2, 1.5, 0.20, 0.55);

    // Ridge ornament
    const topY = bodyY + 1.15 + 0.20 + 0.55;
    parts.push(box(0.72, 0.14, 0.20, GOLD, { y: topY + 0.07 }));
    parts.push(cyl(0.06, 0.10, 0.24, 6, GOLD, { y: topY + 0.22 }));
    parts.push(cyl(0.08, 0.0, 0.18, 6, GOLD, { y: topY + 0.42 + r }));

    return finish(parts);
  },
};

export default NM_LUKANG_LONGSHAN;
