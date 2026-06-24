/**
 * @file packs/miaoli/landmarks/shengxing_station.js — Roll Formosa Miaoli pack.
 *
 * NM_SHENGXING_STATION — 勝興車站 (Shengxing Station), the highest railway
 * station in Taiwan at 402.326m elevation. Built in 1908 during the Japanese
 * era, this iconic wooden station features traditional Japanese-style
 * architecture with a distinctive hip-and-gable roof (入母屋造), wooden beam
 * construction, and a covered platform. After the old mountain line was
 * decommissioned in 1998, it became a popular tourist destination.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Shengxing Station materials (Japanese-era wooden station).
const WOOD = 0x8b6914; // aged wood siding (signature warm brown)
const WOOD_D = 0x6b4e0f; // darker wood shadow / base
const WOOD_L = 0xa67d1a; // sunlit wood highlight
const TILE = 0x3a3a3a; // dark grey/black roof tile (黑瓦)
const TILE_D = 0x2a2a2a; // deeper tile shadow
const WHITE = 0xf0ece0; // white-painted window frames / trim
const PLATFORM = 0xc0b8a0; // concrete platform
const RAIL = 0x4a4a4a; // railway tracks
const RED = 0xb03030; // station name board accent

export const NM_SHENGXING_STATION = {
  id: 'shengxing_station',
  name: '勝興車站',
  dioramaRHint: 35, // ~ station footprint radius in metres
  colorHex: 0x8b6914, // signature aged wood color
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Platform base (concrete railway platform) -----------------------
    parts.push(
      box(3.2, 0.18, 1.4, PLATFORM, { y: 0.09, hex2: 0xa09080 })
    );

    // ---- Railway tracks in front of station ------------------------------
    for (const dz of [-0.5, -0.55]) {
      parts.push(
        box(3.4, 0.04, 0.06, RAIL, { y: 0.02, z: dz })
      );
    }
    // Cross ties
    for (let i = -5; i <= 5; i++) {
      parts.push(
        box(0.08, 0.03, 0.3, WOOD_D, { x: i * 0.3, y: 0.015, z: -0.52 })
      );
    }

    // ---- Main station building (wooden structure) ------------------------
    const baseY = 0.18;
    const buildingW = 2.0;
    const buildingD = 0.9;
    const buildingH = 0.7;

    // Wooden base / foundation
    parts.push(
      box(buildingW + 0.1, 0.08, buildingD + 0.1, WOOD_D, {
        y: baseY + 0.04,
        z: 0.25,
      })
    );

    // Main building body (wooden walls)
    parts.push(
      box(buildingW, buildingH, buildingD, WOOD, {
        y: baseY + 0.08 + buildingH / 2,
        z: 0.25,
        hex2: WOOD_L,
      })
    );

    // Window frames (white painted)
    for (const dx of [-0.6, 0, 0.6]) {
      parts.push(
        box(0.28, 0.3, 0.04, WHITE, {
          x: dx,
          y: baseY + 0.08 + buildingH * 0.5,
          z: 0.25 - buildingD / 2 - 0.02,
        })
      );
    }

    // Station entrance door (center)
    parts.push(
      box(0.35, 0.45, 0.04, WOOD_D, {
        y: baseY + 0.08 + 0.225,
        z: 0.25 - buildingD / 2 - 0.02,
      })
    );

    // ---- Hip-and-gable roof (入母屋造) ------------------------------------
    const roofY = baseY + 0.08 + buildingH;
    const roofOverhang = 0.25;

    // Main roof slab (wider than building for overhang)
    parts.push(
      box(buildingW + roofOverhang * 2, 0.06, buildingD + roofOverhang, TILE, {
        y: roofY + 0.03,
        z: 0.25 - roofOverhang / 4,
        hex2: TILE_D,
      })
    );

    // Sloped roof ridge (central peak)
    parts.push(
      cone((buildingW + roofOverhang * 2) / 2, 0.35, 4, TILE, {
        ry: HALF_PI / 2,
        y: roofY + 0.06 + 0.175,
        z: 0.25,
        hex2: TILE_D,
      })
    );

    // Roof ridge beam
    parts.push(
      box(buildingW + roofOverhang, 0.05, 0.08, WOOD_D, {
        y: roofY + 0.38,
        z: 0.25,
      })
    );

    // ---- Covered waiting area / platform canopy --------------------------
    const canopyY = baseY + 0.5;
    // Support posts
    for (const dx of [-0.85, 0.85]) {
      parts.push(
        cyl(0.04, 0.04, 0.5, 4, WOOD, {
          x: dx,
          y: baseY + 0.25,
          z: -0.15,
        })
      );
    }
    // Canopy roof
    parts.push(
      box(2.0, 0.05, 0.5, TILE, {
        y: canopyY + 0.025,
        z: -0.15,
        hex2: TILE_D,
      })
    );

    // ---- Station name board (勝興 signage) --------------------------------
    parts.push(
      box(0.5, 0.2, 0.03, WHITE, {
        y: roofY - 0.15,
        z: 0.25 - buildingD / 2 - 0.04,
      })
    );
    parts.push(
      box(0.48, 0.04, 0.035, RED, {
        y: roofY - 0.08 + r,
        z: 0.25 - buildingD / 2 - 0.045,
      })
    );

    return finish(parts);
  },
};

export default NM_SHENGXING_STATION;
