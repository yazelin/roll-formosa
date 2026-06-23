/**
 * @file packs/yunlin/landmarks/xiluo_bridge.js — Roll Formosa Yunlin pack, GOAL MONUMENT.
 *
 * NM_XILUO_BRIDGE — 西螺大橋 (Xiluo Bridge). One of Taiwan's most iconic bridges,
 * a historic steel truss bridge spanning the Zhuoshui River. Built in 1953, it was
 * once the longest bridge in the Far East. Features distinctive red/orange steel
 * truss structure. This serves as the GOAL MONUMENT for the Yunlin pack.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). Hero budget ≤600 tris.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const STEEL_RED = 0xc84030;   // iconic red steel
const STEEL_HI = 0xe85848;    // red highlight
const DECK = 0x686058;        // road deck grey
const PIER = 0xa8a098;        // concrete pier
const RAILING = 0x3a3a3a;     // dark railing

export const NM_XILUO_BRIDGE = {
  id: 'xiluo_bridge',
  name: '西螺大橋',
  landmarkId: 8, // goal monument
  dioramaRHint: 420, // large goal monument
  colorHex: STEEL_RED,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01;
    const parts = [];

    // Bridge spans multiple truss sections
    const deckY = 0.3;
    const deckW = 4.5;
    const deckD = 0.8;
    const deckH = 0.12;

    // Bridge deck (road surface)
    parts.push(box(deckW, deckH, deckD, DECK, { y: deckY }));

    // Support piers (concrete pillars)
    for (const px of [-1.8, 0, 1.8]) {
      parts.push(box(0.25, 0.5, 0.5, PIER, { x: px, y: deckY / 2 - 0.05 }));
    }

    // Warren truss structure (triangular pattern on sides)
    const trussH = 0.7;
    const trussY = deckY + trussH / 2 + deckH / 2;

    // Top chord (horizontal beam at top)
    parts.push(box(deckW - 0.2, 0.08, 0.08, STEEL_RED, { y: trussY + trussH / 2 - 0.04, z: 0.35, hex2: STEEL_HI }));
    parts.push(box(deckW - 0.2, 0.08, 0.08, STEEL_RED, { y: trussY + trussH / 2 - 0.04, z: -0.35, hex2: STEEL_HI }));

    // Bottom chord (on deck)
    parts.push(box(deckW - 0.2, 0.06, 0.06, STEEL_RED, { y: deckY + deckH / 2 + 0.03, z: 0.35 }));
    parts.push(box(deckW - 0.2, 0.06, 0.06, STEEL_RED, { y: deckY + deckH / 2 + 0.03, z: -0.35 }));

    // Vertical posts
    for (const px of [-2.0, -1.2, -0.4, 0.4, 1.2, 2.0]) {
      // Front side
      parts.push(box(0.06, trussH, 0.06, STEEL_RED, { x: px, y: trussY, z: 0.35, hex2: STEEL_HI }));
      // Back side
      parts.push(box(0.06, trussH, 0.06, STEEL_RED, { x: px, y: trussY, z: -0.35, hex2: STEEL_HI }));
    }

    // Diagonal bracing (Warren truss pattern)
    for (let i = 0; i < 5; i++) {
      const startX = -2.0 + i * 0.8;
      const up = i % 2 === 0;
      // Front diagonals
      parts.push(box(0.05, 0.85, 0.05, STEEL_RED, {
        x: startX + 0.4, y: trussY, z: 0.35,
        rz: up ? 0.65 : -0.65, hex2: STEEL_HI
      }));
      // Back diagonals
      parts.push(box(0.05, 0.85, 0.05, STEEL_RED, {
        x: startX + 0.4 + j, y: trussY, z: -0.35,
        rz: up ? 0.65 : -0.65, hex2: STEEL_HI
      }));
    }

    // Cross bracing (top, connecting front and back)
    for (const px of [-1.6, -0.8, 0, 0.8, 1.6]) {
      parts.push(box(0.04, 0.04, 0.65, STEEL_RED, { x: px, y: trussY + trussH / 2 - 0.04 }));
    }

    // Portal frames (end towers)
    for (const ex of [-2.15, 2.15]) {
      // Vertical legs
      parts.push(box(0.1, trussH + 0.15, 0.1, STEEL_RED, { x: ex, y: trussY + 0.08, z: 0.35, hex2: STEEL_HI }));
      parts.push(box(0.1, trussH + 0.15, 0.1, STEEL_RED, { x: ex, y: trussY + 0.08, z: -0.35, hex2: STEEL_HI }));
      // Top beam
      parts.push(box(0.08, 0.08, 0.78, STEEL_RED, { x: ex, y: trussY + trussH / 2 + 0.12 }));
    }

    // Railings on sides
    parts.push(box(deckW - 0.1, 0.04, 0.03, RAILING, { y: deckY + 0.12, z: 0.42 }));
    parts.push(box(deckW - 0.1, 0.04, 0.03, RAILING, { y: deckY + 0.12, z: -0.42 }));

    // Road markings (center line)
    parts.push(box(deckW - 0.5, 0.01, 0.05, 0xe8e8d0, { y: deckY + deckH / 2 + 0.01 }));

    return finish(parts);
  },
};

export default NM_XILUO_BRIDGE;
