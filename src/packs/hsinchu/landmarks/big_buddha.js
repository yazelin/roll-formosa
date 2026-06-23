/**
 * @file packs/hsinchu/landmarks/big_buddha.js — Roll Formosa Hsinchu pack.
 *
 * 青草湖大佛 (Qingcao Lake Big Buddha / Fa Yuan Temple Giant Buddha). A large
 * golden Buddha statue located at Fa Yuan Temple (法源寺) overlooking scenic
 * Qingcao Lake (青草湖). The seated Amitabha Buddha statue is a prominent
 * religious landmark visible from around the lake area, representing the
 * spiritual heritage of Hsinchu.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — golden Buddha statue and temple grounds.
const GOLD = 0xd4a82c;       // golden Buddha (main)
const GOLD_D = 0xb08820;     // gold shadow
const GOLD_L = 0xe8c048;     // gold highlight
const SKIN = 0xe0c090;       // Buddha face/hands tone
const ROBE = 0xc89820;       // darker gold robe folds
const LOTUS = 0xe8b8c8;      // pink lotus petals
const LOTUS_D = 0xc898a8;    // lotus shadow
const PEDESTAL = 0x808888;   // grey stone pedestal
const PEDESTAL_D = 0x606868; // pedestal shadow
const TREE = 0x4a7a40;       // hillside trees
const WATER = 0x5090a8;      // lake water
const HILL = 0x6a8a58;       // green hillside

export const NM_BIG_BUDDHA = {
  id: 'qingcao_buddha',
  name: '青草湖大佛',
  landmarkId: 17,
  dioramaRHint: 190,
  colorHex: 0xd4a82c, // golden — the Buddha statue's primary color

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Lake and hillside landscape --------------------------------------
    // Lake water (reduced segments)
    parts.push(cyl(1.3, 1.4, 0.05, 6, 0x4080a0, { y: 0.025, hex2: WATER }));
    // Hillside behind Buddha (reduced segments)
    parts.push(sph(1.0, HILL, { ws: 5, hs: 3, y: -0.3, z: -0.5, sy: 0.5, thetaLen: HALF_PI }));

    // ---- 2) Temple platform/terrace ------------------------------------------
    const baseY = 0.05;
    parts.push(box(1.3, 0.1, 0.9, PEDESTAL_D, { y: baseY + 0.05, hex2: PEDESTAL }));
    // Upper terrace
    parts.push(box(1.1, 0.08, 0.75, PEDESTAL_D, { y: baseY + 0.14, hex2: PEDESTAL }));

    // ---- 3) Lotus throne base ------------------------------------------------
    const lotusY = baseY + 0.18;
    const lotusR = 0.42;

    // Lower lotus ring (reduced segments)
    parts.push(cyl(lotusR, lotusR * 1.1, 0.08, 6, LOTUS_D, { y: lotusY + 0.04, hex2: LOTUS }));

    // Lotus petals (reduced count from 10 to 6)
    const petalN = 6;
    for (let i = 0; i < petalN; i++) {
      const angle = (i / petalN) * PI * 2;
      const px = Math.cos(angle) * lotusR * 0.85;
      const pz = Math.sin(angle) * lotusR * 0.85;
      parts.push(cone(0.1, 0.15, 3, LOTUS, {
        x: px, y: lotusY + 0.12, z: pz,
        ry: -angle,
        rx: 0.4,
        hex2: LOTUS_D
      }));
    }

    // Upper lotus cushion (reduced segments)
    parts.push(cyl(lotusR * 0.75, lotusR * 0.8, 0.06, 5, GOLD_D, { y: lotusY + 0.17, hex2: GOLD }));

    // ---- 4) Seated Buddha figure (the hero element) --------------------------
    const buddhaY = lotusY + 0.2;

    // Lower body / crossed legs (wide low form, reduced segments)
    parts.push(sph(0.38, ROBE, {
      ws: 5, hs: 3,
      y: buddhaY + 0.12,
      sy: 0.4, sx: 1.2,
      hex2: GOLD_D
    }));

    // Torso (reduced segments)
    parts.push(sph(0.28, GOLD_D, {
      ws: 5, hs: 3,
      y: buddhaY + 0.35,
      sy: 1.1,
      hex2: GOLD
    }));

    // Head (reduced segments)
    const headY = buddhaY + 0.58;
    parts.push(sph(0.18, SKIN, { ws: 5, hs: 3, y: headY }));

    // Hair curls (ushnisha - the bump on top, reduced segments)
    parts.push(sph(0.1, 0x2a2520, { ws: 4, hs: 2, y: headY + 0.12 }));
    parts.push(sph(0.06, 0x2a2520, { ws: 3, hs: 2, y: headY + 0.2 }));

    // Ears (elongated lobes, reduced segments)
    for (const sx of [-1, 1]) {
      parts.push(sph(0.04, SKIN, {
        ws: 3, hs: 2,
        x: sx * 0.16, y: headY - 0.04,
        sy: 1.5
      }));
    }

    // Hands in meditation mudra (lap, reduced segments)
    parts.push(sph(0.08, SKIN, { ws: 4, hs: 2, y: buddhaY + 0.18, z: 0.15, sy: 0.6 }));

    // ---- 5) Halo / backdrop (circular nimbus, reduced segments) ---------------
    parts.push(cyl(0.55, 0.55, 0.03, 8, GOLD_L, {
      y: buddhaY + 0.4, z: -0.25, rx: HALF_PI,
      thetaLen: PI, theta0: -HALF_PI,
      hex2: GOLD
    }));

    // ---- 6) Hillside trees (reduced) ------------------------------------------
    for (const pos of [[-0.8, -0.3], [0.85, -0.25]]) {
      parts.push(cyl(0.02, 0.03, 0.15, 3, 0x5a4030, { x: pos[0], y: 0.15, z: pos[1] }));
      parts.push(cone(0.1, 0.2, 4, 0x3a6a30, { x: pos[0], y: 0.3, z: pos[1], hex2: TREE }));
    }

    // ---- 7) Incense burner in front ------------------------------------------
    parts.push(cyl(0.06, 0.08, 0.12, 4, 0x705848, { y: baseY + 0.24, z: 0.45 }));

    // ---- 8) Stone railings around the terrace --------------------------------
    for (const sx of [-1, 1]) {
      parts.push(box(0.03, 0.08, 0.7, PEDESTAL, {
        x: sx * 0.6, y: baseY + 0.22, z: 0.05
      }));
    }
    parts.push(box(1.2, 0.03, 0.03, PEDESTAL, { y: baseY + 0.25, z: 0.38 }));

    return finish(parts);
  },
};

export default NM_BIG_BUDDHA;
