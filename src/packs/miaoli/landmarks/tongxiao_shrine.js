/**
 * @file packs/miaoli/landmarks/tongxiao_shrine.js — Roll Formosa Miaoli pack.
 *
 * NM_TONGXIAO_SHRINE — 通霄神社 (Tongxiao Shinto Shrine), a Japanese-era Shinto
 * shrine built in 1937, one of the best-preserved shrines in Taiwan. Located
 * on Hutoushan (虎頭山) in 通霄鎮, the complex features the iconic red torii
 * gate (鳥居), main worship hall (拜殿), and stone lanterns. After WWII, the
 * shrine was repurposed but has since been restored as a heritage site.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Tongxiao Shrine materials (Japanese Shinto shrine).
const RED = 0xc83030; // vermilion torii (朱紅)
const RED_D = 0xa02020; // darker red shadow
const RED_L = 0xd84040; // highlight red
const WOOD = 0x8a6a40; // aged hinoki cypress
const WOOD_D = 0x6a4a28; // darker wood
const STONE = 0xa8a090; // stone lanterns / path
const STONE_D = 0x888070; // darker stone
const TILE = 0x3a3a3a; // dark roof tile
const TILE_D = 0x2a2828; // deeper tile
const WHITE = 0xf0ece0; // white-painted elements
const CONCRETE = 0xc0b8a8; // steps / platform

export const NM_TONGXIAO_SHRINE = {
  id: 'tongxiao_shrine',
  landmarkId: 4,
  name: '通霄神社',
  dioramaRHint: 60, // ~ shrine footprint radius in metres
  colorHex: 0xc83030, // signature torii red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Stone path / approach (参道) --------------------------------------
    parts.push(
      box(3.5, 0.08, 1.0, STONE, { y: 0.04, hex2: STONE_D })
    );

    // ---- Main Torii Gate (鳥居) at the entrance ----------------------------
    const toriiY = 0.08;
    const toriiH = 1.2;
    const toriiW = 1.0;
    const pillarR = 0.06;

    // Torii pillars (柱)
    for (const dx of [-1, 1]) {
      parts.push(
        cyl(pillarR, pillarR * 1.1, toriiH, 6, RED, {
          x: dx * (toriiW / 2),
          y: toriiY + toriiH / 2,
          z: -1.0,
          hex2: RED_D,
        })
      );
    }

    // Torii top beam (笠木) — curved slightly wider
    parts.push(
      box(toriiW + 0.3, 0.08, 0.12, RED, {
        y: toriiY + toriiH - 0.04,
        z: -1.0,
        hex2: RED_L,
      })
    );

    // Torii lower crossbeam (貫)
    parts.push(
      box(toriiW + 0.1, 0.05, 0.06, RED, {
        y: toriiY + toriiH * 0.7,
        z: -1.0,
        hex2: RED_D,
      })
    );

    // ---- Stone lanterns (石灯籠) flanking the path -------------------------
    for (const dx of [-1, 1]) {
      // Lantern base
      parts.push(
        box(0.15, 0.1, 0.15, STONE, {
          x: dx * 0.6,
          y: toriiY + 0.05,
          z: -0.4,
          hex2: STONE_D,
        })
      );
      // Lantern post
      parts.push(
        cyl(0.04, 0.05, 0.4, 6, STONE, {
          x: dx * 0.6,
          y: toriiY + 0.3,
          z: -0.4,
        })
      );
      // Lantern fire box (火袋)
      parts.push(
        box(0.12, 0.12, 0.12, STONE_D, {
          x: dx * 0.6,
          y: toriiY + 0.56,
          z: -0.4,
        })
      );
      // Lantern roof
      parts.push(
        box(0.18, 0.05, 0.18, STONE, {
          x: dx * 0.6,
          y: toriiY + 0.65,
          z: -0.4,
        })
      );
    }

    // ---- Main Worship Hall (拜殿) ------------------------------------------
    const hallY = 0.08;
    const hallW = 1.4;
    const hallD = 1.0;
    const hallH = 0.7;

    // Raised platform / steps
    parts.push(
      box(hallW + 0.4, 0.15, hallD + 0.3, CONCRETE, {
        y: hallY + 0.075,
        z: 0.6,
        hex2: STONE_D,
      })
    );

    // Main hall body
    parts.push(
      box(hallW, hallH, hallD, WOOD, {
        y: hallY + 0.15 + hallH / 2,
        z: 0.6,
        hex2: WOOD_D,
      })
    );

    // Hall entrance (darker opening)
    parts.push(
      box(hallW * 0.4, hallH * 0.6, 0.04, WOOD_D, {
        y: hallY + 0.15 + hallH * 0.3,
        z: 0.6 - hallD / 2 - 0.02,
      })
    );

    // Hall white trim
    parts.push(
      box(hallW - 0.1, 0.08, hallD - 0.1, WHITE, {
        y: hallY + 0.15 + hallH - 0.04,
        z: 0.6,
      })
    );

    // ---- Shrine roof (sloped tile roof) ------------------------------------
    const roofY = hallY + 0.15 + hallH;

    // Main roof slab
    parts.push(
      box(hallW + 0.3, 0.06, hallD + 0.25, TILE, {
        y: roofY + 0.03,
        z: 0.6,
        hex2: TILE_D,
      })
    );

    // Sloped roof peak
    parts.push(
      box(hallW + 0.1, 0.25, 0.15, TILE, {
        y: roofY + 0.06 + 0.125 + r,
        z: 0.6,
        hex2: TILE_D,
      })
    );

    // Roof ridge (棟)
    parts.push(
      box(hallW, 0.04, 0.08, WOOD, {
        y: roofY + 0.32,
        z: 0.6,
      })
    );

    // ---- Chigi (千木) decorative roof finials -------------------------------
    for (const dx of [-1, 1]) {
      parts.push(
        box(0.04, 0.2, 0.04, WOOD, {
          rz: dx * 0.3,
          x: dx * (hallW / 2 - 0.1),
          y: roofY + 0.4,
          z: 0.6,
        })
      );
    }

    // ---- Offering box (賽銭箱) in front of hall ----------------------------
    parts.push(
      box(0.3, 0.15, 0.2, WOOD, {
        y: hallY + 0.15 + 0.075,
        z: 0.6 - hallD / 2 - 0.25,
        hex2: WOOD_D,
      })
    );

    return finish(parts);
  },
};

export default NM_TONGXIAO_SHRINE;
