/**
 * @file packs/hsinchu/landmarks/hsinchu_zoo.js — Roll Formosa Hsinchu pack.
 *
 * 新竹動物園 (Hsinchu Zoo). Founded in 1936, it's the oldest zoo in Taiwan. Located
 * in Hsinchu Park, the zoo underwent major renovations and reopened in 2019 with
 * a modern, animal-friendly design. Features a distinctive entrance arch with
 * playful animal motifs and lush greenery.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, ico, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — zoo entrance with playful, natural colors.
const ARCH = 0xd8cfc0;       // cream/beige entrance arch
const ARCH_D = 0xc0b8a8;     // arch shadow
const WOOD = 0x8b6b4a;       // wooden accents
const WOOD_D = 0x6b4b2a;     // darker wood
const METAL = 0x707880;      // metal railings
const GREEN = 0x4a8a40;      // foliage green
const GREEN_D = 0x3a6a30;    // darker foliage
const GRASS = 0x68a858;      // lawn
const PATH = 0xc4b8a0;       // walkway
const SIGN = 0xe0e8f0;       // signage background
const TEXT_RED = 0xc83828;   // red accent (zoo branding)
const ANIMAL_TAN = 0xd4b896; // tan animal figure
const ANIMAL_DARK = 0x5a4a3a;// dark animal accents

export const NM_HSINCHU_ZOO = {
  id: 'hsinchu_zoo',
  name: '新竹動物園',
  landmarkId: 13,
  dioramaRHint: 60,
  colorHex: 0x4a8a40, // green — the zoo's lush natural setting

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Grass and pathway base -------------------------------------------
    parts.push(cyl(1.5, 1.6, 0.05, 6, GRASS, { y: 0.025 }));
    parts.push(box(1.4, 0.04, 1.8, PATH, { y: 0.045 }));

    // ---- 2) Main entrance arch -----------------------------------------------
    const archY = 0.05;
    const archW = 1.3;
    const archH = 0.75;
    const archD = 0.18;

    // Left pillar
    parts.push(box(0.22, archH, archD, ARCH_D, {
      x: -archW * 0.5 + 0.11, y: archY + archH * 0.5, hex2: ARCH
    }));
    // Right pillar
    parts.push(box(0.22, archH, archD, ARCH_D, {
      x: archW * 0.5 - 0.11, y: archY + archH * 0.5, hex2: ARCH
    }));

    // Arch top beam (curved effect with a wide box)
    parts.push(box(archW, 0.18, archD, ARCH_D, { y: archY + archH + 0.05, hex2: ARCH }));

    // Decorative curved arch element (reduced segments)
    parts.push(cyl(archW * 0.35, archW * 0.35, archD + 0.02, 5, ARCH, {
      y: archY + archH * 0.75, rx: PI / 2, thetaLen: PI, theta0: 0
    }));

    // ---- 3) Zoo name sign on top ---------------------------------------------
    const signY = archY + archH + 0.14;
    parts.push(box(0.8, 0.18, 0.06, SIGN, { y: signY + 0.09 }));
    // Red accent strip under sign
    parts.push(box(0.85, 0.03, 0.07, TEXT_RED, { y: signY }));

    // ---- 4) Decorative animal figures on the pillars (reduced segments) ------
    // Left pillar - stylized monkey figure
    const monkeyX = -archW * 0.5 + 0.11;
    const monkeyY = archY + archH + 0.08;
    // Body
    parts.push(sph(0.09, ANIMAL_TAN, { ws: 4, hs: 3, x: monkeyX - 0.15, y: monkeyY, sy: 1.2 }));
    // Head
    parts.push(sph(0.065, ANIMAL_TAN, { ws: 4, hs: 3, x: monkeyX - 0.15, y: monkeyY + 0.12 }));

    // Right pillar - stylized bird figure
    const birdX = archW * 0.5 - 0.11;
    const birdY = archY + archH + 0.06;
    // Body
    parts.push(sph(0.08, GREEN_D, { ws: 4, hs: 3, x: birdX + 0.12, y: birdY, sy: 1.3, hex2: GREEN }));
    // Head
    parts.push(sph(0.05, GREEN, { ws: 4, hs: 3, x: birdX + 0.12, y: birdY + 0.12 }));

    // ---- 5) Entrance gates (metal railings, reduced) -------------------------
    const gateY = archY;
    const gateH = 0.45;

    // Gate posts (reduced from 4 to 2)
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.03, 0.04, gateH, 4, METAL, {
        x: sx * 0.32, y: gateY + gateH * 0.5
      }));
    }
    // Gate top rail
    parts.push(box(1.0, 0.03, 0.03, METAL, { y: gateY + gateH }));

    // ---- 6) Decorative trees/shrubs flanking the entrance (reduced) ----------
    for (const sx of [-1, 1]) {
      const treeX = sx * 0.85;
      // Trunk
      parts.push(cyl(0.04, 0.06, 0.25, 4, WOOD_D, { x: treeX, y: 0.05 + 0.125, hex2: WOOD }));
      // Foliage (reduced to 2 layers)
      parts.push(sph(0.18, GREEN_D, { ws: 4, hs: 3, x: treeX, y: 0.35, hex2: GREEN }));
      parts.push(sph(0.12, GREEN_D, { ws: 4, hs: 3, x: treeX, y: 0.52, hex2: GREEN }));
    }

    // ---- 7) Ticket booth to the side -----------------------------------------
    const boothX = -0.65;
    const boothY = 0.05;
    parts.push(box(0.28, 0.35, 0.28, ARCH_D, { x: boothX, y: boothY + 0.175, hex2: ARCH }));
    // Booth window
    parts.push(box(0.16, 0.14, 0.02, 0x4080a0, { x: boothX, y: boothY + 0.25, z: 0.14 }));
    // Booth roof (simplified)
    parts.push(box(0.34, 0.06, 0.34, WOOD, { x: boothX, y: boothY + 0.38 }));

    // ---- 8) Small decorative hedges ------------------------------------------
    for (const sz of [-1, 1]) {
      parts.push(box(0.6, 0.12, 0.15, GREEN_D, {
        x: 0, y: 0.11, z: sz * 0.6, hex2: GREEN
      }));
    }

    // ---- 9) Playful animal paw prints on the path (reduced) ------------------
    for (let i = 0; i < 2; i++) {
      parts.push(cyl(0.04, 0.04, 0.01, 4, ANIMAL_DARK, {
        x: 0.05 - i * 0.2, y: 0.06, z: -0.55 - i * 0.2
      }));
    }

    return finish(parts);
  },
};

export default NM_HSINCHU_ZOO;
