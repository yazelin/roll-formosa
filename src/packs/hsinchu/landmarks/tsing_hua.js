/**
 * @file packs/hsinchu/landmarks/tsing_hua.js — Roll Formosa Hsinchu pack.
 *
 * 清華大學大門 (National Tsing Hua University Main Gate). One of Taiwan's most
 * prestigious universities, originally founded in Beijing in 1911 and re-established
 * in Hsinchu in 1956. The main gate features traditional Chinese architectural
 * elements with the university name inscribed, flanked by ceremonial pillars.
 * The campus is known for its beautiful grounds and academic excellence.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — prestigious university gate with traditional and modern elements.
const STONE = 0xd0c8bc;      // light stone/marble
const STONE_D = 0xb0a898;    // stone shadow
const PILLAR = 0xc8c0b4;     // ceremonial pillar stone
const PILLAR_D = 0xa8a094;   // pillar shadow
const ROOF = 0x3a3835;       // traditional dark roof tiles
const ROOF_D = 0x2a2825;     // roof shadow
const RED = 0xb03028;        // traditional red accents
const GOLD = 0xd4a82c;       // gold trim/characters
const WOOD = 0x8a6a4a;       // wooden eaves
const GRASS = 0x5a8a50;      // campus lawn
const PATH = 0xc0b8a8;       // entrance pathway
const TREE = 0x4a7a40;       // campus trees

export const NM_TSING_HUA = {
  id: 'tsing_hua_gate',
  name: '清華大學大門',
  landmarkId: 14,
  dioramaRHint: 85,
  colorHex: 0xb03028, // traditional red — university's ceremonial color

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Campus grounds and entrance path ---------------------------------
    parts.push(cyl(1.6, 1.7, 0.04, 6, GRASS, { y: 0.02 }));
    parts.push(box(1.2, 0.03, 2.2, PATH, { y: 0.04 }));

    // ---- 2) Main gate structure (ceremonial archway) -------------------------
    const gateY = 0.05;
    const gateW = 1.4;
    const gateH = 0.85;

    // Central pillars
    const pillarW = 0.16;
    const pillarD = 0.16;
    for (const sx of [-1, 1]) {
      const px = sx * (gateW * 0.35);
      // Main pillar
      parts.push(box(pillarW, gateH, pillarD, PILLAR_D, {
        x: px, y: gateY + gateH * 0.5, hex2: PILLAR
      }));
      // Pillar base
      parts.push(box(pillarW + 0.04, 0.08, pillarD + 0.04, STONE_D, {
        x: px, y: gateY + 0.04
      }));
      // Pillar cap
      parts.push(box(pillarW + 0.02, 0.04, pillarD + 0.02, STONE, {
        x: px, y: gateY + gateH
      }));
    }

    // ---- 3) Traditional Chinese roof over the gate ---------------------------
    const roofY = gateY + gateH + 0.02;
    const roofW = gateW * 0.6;
    const roofD = 0.4;

    // Wooden eave support
    parts.push(box(roofW + 0.1, 0.04, roofD + 0.1, WOOD, { y: roofY }));

    // Main roof slopes
    for (const s of [-1, 1]) {
      parts.push(box(roofW + 0.15, 0.04, roofD * 0.55, ROOF, {
        rx: s * 0.48,
        y: roofY + 0.12,
        z: s * roofD * 0.24,
        hex2: ROOF_D,
      }));
    }
    // Ridge
    parts.push(box(roofW + 0.05, 0.035, 0.05, ROOF_D, { y: roofY + 0.17 }));
    // Ridge end ornaments
    for (const sx of [-1, 1]) {
      parts.push(cone(0.04, 0.06, 4, GOLD, {
        x: sx * (roofW * 0.5 + 0.02), y: roofY + 0.2
      }));
    }

    // ---- 4) University name sign plate ---------------------------------------
    const signY = gateY + gateH * 0.6;
    // Sign background
    parts.push(box(0.5, 0.22, 0.04, RED, { y: signY }));
    // Gold border
    parts.push(box(0.52, 0.02, 0.05, GOLD, { y: signY + 0.11 }));
    parts.push(box(0.52, 0.02, 0.05, GOLD, { y: signY - 0.11 }));
    // Character representation (simplified as gold bars)
    for (let i = 0; i < 4; i++) {
      parts.push(box(0.08, 0.12, 0.01, GOLD, { x: -0.16 + i * 0.11, y: signY, z: 0.025 }));
    }

    // ---- 5) Outer ceremonial pillars (華表 style, reduced) -------------------
    for (const sx of [-1, 1]) {
      const outerX = sx * (gateW * 0.65);
      // Tall ceremonial pillar
      parts.push(cyl(0.06, 0.08, 0.7, 5, PILLAR_D, {
        x: outerX, y: gateY + 0.35, hex2: PILLAR
      }));
      // Base
      parts.push(box(0.18, 0.08, 0.18, STONE_D, { x: outerX, y: gateY + 0.04 }));
      // Top ornament
      parts.push(cyl(0.08, 0.04, 0.08, 5, STONE, { x: outerX, y: gateY + 0.74 }));
      parts.push(cone(0.06, 0.1, 4, GOLD, { x: outerX, y: gateY + 0.83 }));
    }

    // ---- 6) Side walls/fences ------------------------------------------------
    for (const sx of [-1, 1]) {
      const wallX = sx * (gateW * 0.5 + 0.2);
      // Low stone wall
      parts.push(box(0.3, 0.25, 0.1, STONE_D, {
        x: wallX, y: gateY + 0.125, hex2: STONE
      }));
      // Wall cap
      parts.push(box(0.34, 0.03, 0.14, STONE, {
        x: wallX, y: gateY + 0.265
      }));
    }

    // ---- 7) Campus trees flanking the entrance (reduced) ---------------------
    for (const sx of [-1, 1]) {
      const treeX = sx * 0.95;
      // Trunk
      parts.push(cyl(0.04, 0.06, 0.35, 4, 0x6b4b2a, {
        x: treeX, y: gateY + 0.175, hex2: 0x8b6b4a
      }));
      // Canopy (single cone)
      parts.push(cyl(0.22, 0.0, 0.35, 5, 0x3a6a30, {
        x: treeX, y: gateY + 0.52, hex2: TREE
      }));
    }

    // ---- 8) Guard booth ------------------------------------------------------
    const boothX = 0.75;
    parts.push(box(0.22, 0.3, 0.22, PILLAR_D, { x: boothX, y: gateY + 0.15, hex2: PILLAR }));
    // Booth window
    parts.push(box(0.12, 0.1, 0.01, 0x4080a0, { x: boothX, y: gateY + 0.22, z: 0.115 }));
    // Booth roof
    parts.push(box(0.28, 0.03, 0.28, ROOF, { x: boothX, y: gateY + 0.315 }));

    // ---- 9) Entrance road markers (reduced) ----------------------------------
    for (const sz of [-1, 1]) {
      parts.push(cyl(0.025, 0.03, 0.15, 4, STONE, {
        x: 0, y: gateY + 0.075, z: sz * 0.85
      }));
    }

    return finish(parts);
  },
};

export default NM_TSING_HUA;
