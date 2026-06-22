/**
 * @file packs/tainan/landmarks/shennong_street_lm.js — Roll Formosa Tainan pack.
 *
 * 神農街 (Shennong Street) — a preserved Qing-era 老街 in 五條港, lined with narrow
 * two-storey 街屋 (shophouses) standing shoulder to shoulder. Signature read: a
 * short row of slim tall ochre-plaster / warm-wood facades, each with wooden
 * upper-floor shutters and a tiny balcony, low tiled sloping roofs, and a couple
 * of red lanterns hanging over the lane.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so the narrow-and-tall terraced rhythm carries the read.
 * rng() is used only for hair-fine lantern sway / plaster tint — never structure.
 * Hero model budget: <= 600 triangles.
 */

import { box, cyl, sph, finish } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const PLASTER = 0xb5803f; // warm ochre plaster facade (hero color)
const PLASTER_L = 0xc99a5a; // sunlit upper plaster
const PLASTER_D = 0x8c5f2c; // shadowed plaster / party wall
const WOOD = 0x7a5430; // dark timber shutters / balcony
const WOOD_L = 0x9a6e44; // sunlit timber rail
const TILE = 0x5a4636; // grey-brown clay roof tile
const TILE_L = 0x70594a; // lit ridge tile
const DOOR = 0x3a281a; // dark doorway recess
const LANTERN = 0xc8302a; // red hanging lantern
const LANTERN_L = 0xe85a48; // lit lantern glow

export const NM_SHENNONG_ST = {
  id: 'shennong_street_lm',
  name: '神農街',
  landmarkId: 4,
  dioramaRHint: 30,
  colorHex: PLASTER,

  buildGeometry(rng) {
    const parts = [];

    // A row of 3 narrow two-storey shophouses standing side by side along X.
    const houseW = 1.2, gap = 0.05, houseD = 1.5;
    const nHouses = 3;
    const totalW = nHouses * houseW + (nHouses - 1) * gap;
    const x0 = -totalW / 2 + houseW / 2;
    const floor1H = 1.0, floor2H = 0.95;
    const baseY = -0.5;

    for (let i = 0; i < nHouses; i++) {
      const cx = x0 + i * (houseW + gap);
      const tilt = (rng() - 0.5) * 0.04; // tiny roof-pitch variation, not structure
      const wallHex = i % 2 === 0 ? PLASTER : PLASTER_D;

      // Ground floor.
      parts.push(box(houseW, floor1H, houseD, wallHex, {
        x: cx, y: baseY + floor1H / 2, hex2: PLASTER_L,
      }));
      // Upper floor.
      const f2y = baseY + floor1H + floor2H / 2;
      parts.push(box(houseW, floor2H, houseD, wallHex, {
        x: cx, y: f2y, hex2: PLASTER_L,
      }));

      // Doorway / shop opening on the ground floor (front +Z).
      parts.push(box(houseW * 0.6, floor1H * 0.7, 0.12, DOOR, {
        x: cx, y: baseY + floor1H * 0.35, z: houseD / 2 + 0.01,
      }));

      // Upper-floor wooden shutters (a paneled window band).
      parts.push(box(houseW * 0.72, floor2H * 0.55, 0.1, WOOD, {
        x: cx, y: f2y + 0.02, z: houseD / 2 + 0.02, hex2: WOOD_L,
      }));
      // One central shutter mullion to read as paired shutters.
      parts.push(box(0.05, floor2H * 0.5, 0.04, PLASTER_L, {
        x: cx, y: f2y + 0.02, z: houseD / 2 + 0.07,
      }));
      // Small wooden balcony lip under the upper window.
      parts.push(box(houseW * 0.86, 0.08, 0.18, WOOD, {
        x: cx, y: baseY + floor1H + 0.02, z: houseD / 2 + 0.08, hex2: WOOD_L,
      }));
      // Balcony top rail.
      parts.push(box(houseW * 0.86, 0.04, 0.04, WOOD, {
        x: cx, y: baseY + floor1H + 0.2, z: houseD / 2 + 0.14,
      }));

      // Sloping tiled roof per house (a wide thin box pitched forward).
      const roofTopY = baseY + floor1H + floor2H;
      parts.push(box(houseW + 0.12, 0.1, houseD + 0.3, TILE, {
        x: cx, y: roofTopY + 0.16, z: 0.08, rx: -0.22 + tilt, hex2: TILE_L,
      }));
      // Ridge cap.
      parts.push(box(houseW + 0.14, 0.06, 0.1, TILE_L, {
        x: cx, y: roofTopY + 0.26, z: -houseD / 2 - 0.02,
      }));
    }

    // Slim party-wall fire dividers between facades for the terraced look.
    for (let i = 0; i <= nHouses; i++) {
      const px = x0 - houseW / 2 - gap / 2 + i * (houseW + gap);
      parts.push(box(0.06, floor1H + floor2H + 0.1, houseD + 0.05, PLASTER_D, {
        x: px, y: baseY + (floor1H + floor2H) / 2 + 0.05, z: 0.02,
      }));
    }

    // === RED LANTERNS hanging over the lane =================================
    const lanternXs = [-0.6, 0.7];
    for (const lx of lanternXs) {
      const sway = (rng() - 0.5) * 0.1;
      const hangY = baseY + floor1H + floor2H - 0.1;
      // Cord.
      parts.push(cyl(0.012, 0.012, 0.3, 3, WOOD, { x: lx + sway, y: hangY + 0.15, z: houseD / 2 + 0.4 }));
      // Lantern body.
      parts.push(sph(0.18, LANTERN, {
        x: lx + sway, y: hangY - 0.12, z: houseD / 2 + 0.4, sy: 1.2, ws: 6, hs: 4, hex2: LANTERN_L,
      }));
      // Top & bottom caps.
      parts.push(cyl(0.06, 0.06, 0.04, 6, WOOD, { x: lx + sway, y: hangY + 0.02, z: houseD / 2 + 0.4 }));
      parts.push(cyl(0.05, 0.05, 0.04, 6, WOOD, { x: lx + sway, y: hangY - 0.28, z: houseD / 2 + 0.4 }));
    }

    return finish(parts);
  },
};

export default NM_SHENNONG_ST;
