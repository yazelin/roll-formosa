/**
 * @file packs/penghu/landmarks/presidential.js — Roll Formosa Penghu pack, landmark 4.
 *
 * 西嶼燈塔 (Xiyu Lighthouse / Yuwengdao Lighthouse) — also known as 漁翁島燈塔,
 * the oldest lighthouse in Taiwan (built 1778, rebuilt 1875). A classic white
 * cylindrical lighthouse with a distinctive black lantern room at the top,
 * standing on the western tip of Xiyu Island. The colonial-era compound includes
 * white buildings with red tile roofs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1).
 *
 * Palette: white tower + black lantern + red roof keeper's house.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const WHITE = 0xf0ece4; // lighthouse white
const WHITE_D = 0xd8d4cc; // shaded white
const BLACK = 0x2a2a28; // lantern room black
const GLASS = 0x88c8d8; // lantern glass
const GLASS_L = 0xc8e8f0; // glass highlight
const RED = 0xb84030; // red tile roof
const RED_D = 0x982820; // darker roof
const STONE = 0xa8a090; // stone base/ground
const STONE_D = 0x888070; // darker stone
const GOLD = 0xd8b840; // brass fittings
const GREEN = 0x5a7848; // grass

export const NM_SIYU_LIGHTHOUSE = {
  id: 'siyu_lighthouse',
  name: '西嶼燈塔',
  landmarkId: 4,
  dioramaRHint: 20, // ~40 m tall lighthouse tower
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // ---- ground platform / compound base ----
    parts.push(cyl(2.8, 3.0, 0.25, 8, STONE_D, { y: 0.125, hex2: STONE }));
    parts.push(box(4.5, 0.15, 3.5, STONE, { y: 0.32 }));

    // ---- keeper's house (red roof colonial building) ----
    parts.push(box(1.4, 0.7, 1.0, WHITE_D, { x: 1.2, y: 0.75, z: -0.6, hex2: WHITE }));
    parts.push(box(1.5, 0.3, 1.1, RED, { x: 1.2, y: 1.25, z: -0.6, hex2: RED_D }));

    // ---- main lighthouse tower ----
    const towerX = 0;
    const towerZ = 0;

    // Base plinth
    parts.push(cyl(0.7, 0.75, 0.35, 8, WHITE_D, { x: towerX, y: 0.52, z: towerZ, hex2: WHITE }));

    // Tapered white tower shaft
    parts.push(
      cyl(0.55, 0.65, 2.8, 8, WHITE_D, {
        x: towerX,
        y: 2.1,
        z: towerZ,
        hex2: WHITE,
      })
    );

    // Gallery / walkway platform
    parts.push(cyl(0.72, 0.75, 0.12, 8, WHITE, { x: towerX, y: 3.56, z: towerZ }));

    // ---- lantern room (black with glass) ----
    parts.push(cyl(0.5, 0.52, 0.6, 8, BLACK, { x: towerX, y: 3.92, z: towerZ, hex2: 0x3a3a38 }));

    // ---- dome roof of lantern ----
    parts.push(
      sph(0.48, BLACK, {
        ws: 6,
        hs: 3,
        thetaLen: HALF_PI,
        x: towerX,
        y: 4.22,
        z: towerZ,
        sy: 0.6,
      })
    );

    // ---- finial ----
    parts.push(sph(0.1, GOLD, { ws: 4, hs: 3, x: towerX, y: 4.52, z: towerZ }));
    parts.push(cone(0.04, 0.18, 4, GOLD, { x: towerX, y: 4.72, z: towerZ }));

    // ---- flag pole ----
    parts.push(cyl(0.025, 0.025, 1.2, 4, WHITE, { x: 1.8, y: 1.0, z: 0.8 }));
    parts.push(box(0.3, 0.18, 0.02, RED, { x: 1.95, y: 1.5, z: 0.8 }));

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_PRESIDENTIAL)
export const NM_PRESIDENTIAL = NM_SIYU_LIGHTHOUSE;

export default NM_SIYU_LIGHTHOUSE;
