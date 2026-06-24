/**
 * @file packs/changhua/landmarks/lukang_tianhou.js — Roll Formosa Changhua pack.
 *
 * 鹿港天后宮 (Lukang Tianhou Temple / Mazu Temple). One of Taiwan's most
 * important Mazu temples, established in 1725. The temple houses the "old
 * Mazu" (大媽) statue brought from Meizhou in 1685. Features multiple halls,
 * ornate stone carvings, and the classic swallowtail roof with dragon
 * ridges and colorful 剪黏 (cut-and-paste ceramic) decorations.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, HALF_PI, PI } from '../geomHelpers.js';

const STONE = 0xbcb5a8;   // grey courtyard stone
const STONE_D = 0x9a948a; // darker stone
const RED = 0xb82e38;     // 朱紅 lacquered columns
const RED_D = 0x8f1f28;   // deeper red
const GREEN = 0x2e5840;   // 墨綠 glazed roof tile
const GREEN_D = 0x1f4230; // deeper green eave
const GOLD = 0xd8a848;    // ornate ridge / dragon
const YELLOW = 0xe8c24a;  // bright yellow trim
const WHITE = 0xece8dc;   // plastered wall

function swallowRoof(out, y, hw, hd, th, ridgeH) {
  out.push(box(hw * 2, th * 0.6, hd * 2, GREEN, { y: y + th * 0.7 }));
  out.push(box(hw * 2 + 0.10, th * 0.42, hd * 2 + 0.10, GREEN_D, { y: y + th * 0.20 }));
  for (const s of [-1, 1]) {
    out.push(box(hw * 2 - 0.05, 0.04, hd * 1.1, GREEN, {
      rx: s * 0.58, y: y + th + ridgeH * 0.48, z: s * hd * 0.40,
    }));
  }
  out.push(box(hw * 2 - 0.04, ridgeH * 0.52, 0.11, GOLD, { y: y + th + ridgeH * 0.72 }));
  const sweep = 0.52;
  const spurLen = hw * 0.62;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      out.push(box(spurLen, 0.06, 0.11, GREEN, {
        rz: sx * sweep, x: sx * hw - sx * spurLen * 0.30,
        y: y + th * 0.48 + spurLen * 0.16, z: sz * hd,
      }));
      out.push(box(0.18, 0.055, 0.09, GOLD, {
        rz: sx * (sweep + 0.28), x: sx * hw + sx * 0.16,
        y: y + th * 0.48 + spurLen * 0.42, z: sz * hd,
      }));
    }
  }
}

export const NM_LUKANG_TIANHOU = {
  id: 'lukang_tianhou',
  name: '鹿港天后宮',
  landmarkId: 10,
  dioramaRHint: 88,
  colorHex: RED,

  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02;
    const parts = [];

    // Courtyard platform
    parts.push(box(3.8, 0.26, 2.8, STONE, { y: 0.13, hex2: STONE_D }));
    parts.push(box(3.2, 0.18, 2.2, STONE_D, { y: 0.28 }));
    parts.push(box(2.6, 0.11, 0.34, STONE, { y: 0.36, z: 1.08 }));

    // Main hall body
    const bodyY = 0.40;
    parts.push(box(3.0, 0.95, 2.0, WHITE, { y: bodyY + 0.475 }));
    parts.push(box(2.6, 0.95, 1.6, RED_D, { y: bodyY + 0.475 }));

    // Central doorway with 媽祖 shrine feel
    parts.push(box(0.52, 0.64, 0.08, 0x381518, { y: bodyY + 0.32, z: 0.98 }));
    for (const dx of [-0.88, 0.88]) {
      parts.push(box(0.34, 0.50, 0.08, 0x381518, { x: dx, y: bodyY + 0.25, z: 0.98 }));
    }

    // Red lacquer columns
    for (const cx of [-1.30, -0.42, 0.42, 1.30]) {
      parts.push(cyl(0.11, 0.12, 1.02, 5, RED, { x: cx, y: bodyY + 0.51, z: 0.98, hex2: RED_D }));
    }

    // Column-head beam with gold trim
    parts.push(box(3.0, 0.15, 0.13, RED, { y: bodyY + 1.00, z: 0.98 }));
    parts.push(box(3.0, 0.05, 0.15, GOLD, { y: bodyY + 1.08, z: 0.98 + r }));

    // Swallowtail roof
    swallowRoof(parts, bodyY + 1.08, 2.0, 1.4, 0.18, 0.50);

    // Dragon ridge ornament (龍脊)
    const topY = bodyY + 1.08 + 0.18 + 0.50;
    parts.push(box(0.68, 0.12, 0.18, GOLD, { y: topY + 0.06 }));
    // Simplified dragon heads at ends
    for (const dx of [-0.50, 0.50]) {
      parts.push(box(0.16, 0.10, 0.12, YELLOW, { x: dx, y: topY + 0.11 }));
    }
    parts.push(cyl(0.05, 0.08, 0.20, 6, GOLD, { y: topY + 0.18 }));
    parts.push(cyl(0.06, 0.0, 0.14, 6, GOLD, { y: topY + 0.34 + r }));

    return finish(parts);
  },
};

export default NM_LUKANG_TIANHOU;
