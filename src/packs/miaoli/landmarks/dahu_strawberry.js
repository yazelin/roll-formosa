/**
 * @file packs/miaoli/landmarks/dahu_strawberry.js — Roll Formosa Miaoli pack.
 *
 * NM_DAHU_STRAWBERRY — 大湖草莓園 (Dahu Strawberry Farm), the heart of Taiwan's
 * strawberry country. 大湖鄉 produces over 80% of Taiwan's strawberries, and
 * these iconic greenhouse farms with their white plastic tunnel structures
 * are a signature sight during strawberry season (December to April). Rows
 * of elevated strawberry beds inside the greenhouses make picking easy.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Dahu Strawberry Farm materials.
const PLASTIC = 0xf0f0f0; // white greenhouse plastic sheeting
const PLASTIC_D = 0xd8d8d8; // shadowed plastic
const FRAME = 0x808080; // grey metal greenhouse frame
const SOIL = 0x6a4a30; // raised bed soil
const GREEN = 0x3a7a3a; // strawberry plant leaves
const GREEN_D = 0x2a5a2a; // darker green
const RED = 0xd82020; // ripe strawberries
const PINK = 0xffa0a0; // unripe strawberries
const CONCRETE = 0xb0b0a0; // concrete walkway
const WOOD = 0x8a6a40; // wooden signs / structures

export const NM_DAHU_STRAWBERRY = {
  id: 'dahu_strawberry',
  name: '大湖草莓園',
  dioramaRHint: 50, // ~ farm footprint radius in metres
  colorHex: 0xd82020, // signature strawberry red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Ground / concrete pathways --------------------------------------
    parts.push(
      box(3.5, 0.08, 2.2, CONCRETE, { y: 0.04, hex2: 0xa0a090 })
    );

    // ---- Main greenhouse tunnel structure --------------------------------
    const ghW = 2.8;
    const ghD = 1.6;
    const ghH = 0.8;
    const baseY = 0.08;

    // Greenhouse frame arches (semicircular hoops)
    for (let i = 0; i < 5; i++) {
      const gz = -ghD / 2 + 0.2 + i * (ghD / 5);
      // Arch frame (approximated as half-cylinder segments)
      parts.push(
        cyl(ghW / 2, ghW / 2, 0.03, 8, FRAME, {
          rx: HALF_PI,
          y: baseY + ghH / 2,
          z: gz,
          thetaLen: PI,
          theta0: 0,
        })
      );
    }

    // Plastic sheeting over the greenhouse (curved roof surface)
    // Represented as a box with gradients for the rounded look
    parts.push(
      box(ghW, ghH * 0.4, ghD, PLASTIC, {
        y: baseY + ghH * 0.8,
        hex2: PLASTIC_D,
      })
    );
    // Side walls (partial)
    for (const dx of [-1, 1]) {
      parts.push(
        box(0.04, ghH * 0.6, ghD, PLASTIC, {
          x: dx * (ghW / 2 - 0.02),
          y: baseY + ghH * 0.3,
          hex2: PLASTIC_D,
        })
      );
    }

    // ---- Raised strawberry beds inside greenhouse ------------------------
    const bedW = 0.35;
    const bedH = 0.25;
    const bedD = ghD * 0.85;

    for (let row = 0; row < 3; row++) {
      const bx = -0.6 + row * 0.6;

      // Soil bed (raised planting row)
      parts.push(
        box(bedW, bedH, bedD, SOIL, {
          x: bx,
          y: baseY + bedH / 2,
          hex2: 0x503820,
        })
      );

      // Strawberry plants (green foliage on top)
      parts.push(
        box(bedW * 1.1, 0.12, bedD, GREEN, {
          x: bx,
          y: baseY + bedH + 0.06,
          hex2: GREEN_D,
        })
      );

      // Strawberries (red dots scattered on the plants)
      for (let i = 0; i < 4; i++) {
        const sz = -bedD / 2 + 0.2 + i * (bedD / 4);
        const strawColor = rng() > 0.3 ? RED : PINK;
        parts.push(
          sph(0.04, strawColor, {
            ws: 4,
            hs: 3,
            x: bx + (rng() - 0.5) * 0.15,
            y: baseY + bedH + 0.12,
            z: sz,
          })
        );
      }
    }

    // ---- Farm entrance / welcome sign ------------------------------------
    parts.push(
      box(0.08, 0.6, 0.08, WOOD, { x: 1.5, y: baseY + 0.3, z: -0.6 })
    );
    parts.push(
      box(0.08, 0.6, 0.08, WOOD, { x: 1.5, y: baseY + 0.3, z: 0.6 + r })
    );
    // Sign board
    parts.push(
      box(0.06, 0.25, 1.3, WOOD, { x: 1.5, y: baseY + 0.55, z: 0 })
    );
    // Strawberry logo on sign (big red sphere)
    parts.push(
      sph(0.12, RED, {
        ws: 6,
        hs: 4,
        x: 1.55,
        y: baseY + 0.55,
        z: 0,
      })
    );

    // ---- Picking baskets near entrance -----------------------------------
    parts.push(
      cyl(0.1, 0.08, 0.12, 6, 0xf08080, {
        x: 1.2,
        y: baseY + 0.06,
        z: -0.3,
      })
    );
    parts.push(
      cyl(0.1, 0.08, 0.12, 6, 0xf08080, {
        x: 1.25,
        y: baseY + 0.06,
        z: 0.2,
      })
    );

    return finish(parts);
  },
};

export default NM_DAHU_STRAWBERRY;
