/**
 * @file packs/miaoli/landmarks/sanyi_woodcarving.js — Roll Formosa Miaoli pack.
 *
 * NM_SANYI_WOODCARVING — 三義木雕博物館 (Sanyi Wood Sculpture Museum), Taiwan's
 * only museum dedicated to wood carving, located in 三義鄉, the "woodcarving
 * capital of Taiwan". The museum building features traditional Chinese
 * architecture with curved eaves and houses thousands of wood sculptures.
 * 三義 is famous for its camphor wood carvings and the annual Wood
 * Sculpture Festival.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Sanyi Woodcarving Museum materials.
const WOOD = 0x8b5a2b; // rich wood (camphor wood tone)
const WOOD_D = 0x6b3a1b; // darker wood shadow
const WOOD_L = 0x9b6a3b; // light wood highlight
const TILE = 0x2a3a3a; // dark glazed roof tile
const TILE_D = 0x1a2828; // deeper tile
const WHITE = 0xf5f0e8; // white-washed walls
const WHITE_D = 0xe0d8c8; // shadowed white
const RED = 0xa03020; // red lacquer accents / columns
const RED_D = 0x801810; // darker red
const STONE = 0xb0a8a0; // stone base / courtyard
const GOLD = 0xc9a030; // gold trim / ornaments

export const NM_SANYI_WOODCARVING = {
  id: 'sanyi_woodcarving',
  name: '三義木雕博物館',
  dioramaRHint: 55, // ~ museum footprint radius in metres
  colorHex: 0x8b5a2b, // signature camphor wood color
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Stone courtyard base --------------------------------------------
    parts.push(
      box(3.5, 0.12, 2.4, STONE, { y: 0.06, hex2: 0xa09890 })
    );

    // ---- Main museum building (traditional Chinese architecture) ---------
    const baseY = 0.12;
    const buildingW = 2.6;
    const buildingD = 1.4;
    const buildingH = 0.9;

    // Stone foundation / raised platform
    parts.push(
      box(buildingW + 0.3, 0.15, buildingD + 0.2, STONE, {
        y: baseY + 0.075,
        hex2: WHITE_D,
      })
    );

    // Main building body (white walls)
    parts.push(
      box(buildingW, buildingH, buildingD, WHITE, {
        y: baseY + 0.15 + buildingH / 2,
        hex2: WHITE_D,
      })
    );

    // Red lacquer columns at the entrance (front facade)
    for (const dx of [-1.0, -0.5, 0.5, 1.0]) {
      parts.push(
        cyl(0.06, 0.07, buildingH, 5, RED, {
          x: dx,
          y: baseY + 0.15 + buildingH / 2,
          z: buildingD / 2 + 0.04,
          hex2: RED_D,
        })
      );
    }

    // Wooden beam connecting columns (架枋)
    parts.push(
      box(buildingW, 0.1, 0.1, WOOD, {
        y: baseY + 0.15 + buildingH - 0.05,
        z: buildingD / 2 + 0.04,
        hex2: WOOD_D,
      })
    );

    // ---- Curved eave roof (Chinese style) --------------------------------
    const roofY = baseY + 0.15 + buildingH;

    // Main roof slab with overhang
    parts.push(
      box(buildingW + 0.5, 0.08, buildingD + 0.4, TILE, {
        y: roofY + 0.04,
        hex2: TILE_D,
      })
    );

    // Sloped ridge (hip roof shape approximation)
    parts.push(
      cone((buildingW + 0.3) / 2, 0.4, 4, TILE, {
        ry: HALF_PI / 2,
        y: roofY + 0.08 + 0.2,
        hex2: TILE_D,
      })
    );

    // Roof ridge beam (gold trim)
    parts.push(
      box(buildingW + 0.2, 0.06, 0.1, GOLD, {
        y: roofY + 0.4,
      })
    );

    // Curved eave corners (upturned eaves 飛簷)
    for (const dx of [-1, 1]) {
      for (const dz of [-1, 1]) {
        parts.push(
          box(0.25, 0.06, 0.08, TILE, {
            rz: dx * 0.4,
            x: dx * (buildingW / 2 + 0.15),
            y: roofY + 0.12,
            z: dz * (buildingD / 2 + 0.12),
          })
        );
      }
    }

    // ---- Large wood sculpture display (outdoor) --------------------------
    // Giant wood carving sculpture in the courtyard
    parts.push(
      cyl(0.15, 0.12, 0.6, 6, WOOD, {
        x: -1.4,
        y: baseY + 0.3 + r,
        z: 0.6,
        hex2: WOOD_L,
      })
    );
    // Base for the sculpture
    parts.push(
      box(0.4, 0.08, 0.4, STONE, {
        x: -1.4,
        y: baseY + 0.04,
        z: 0.6,
      })
    );

    // ---- Entrance steps --------------------------------------------------
    for (let i = 0; i < 3; i++) {
      parts.push(
        box(1.0, 0.06, 0.15, STONE, {
          y: baseY + 0.03 + i * 0.05,
          z: buildingD / 2 + 0.15 + i * 0.12,
        })
      );
    }

    // ---- Museum name plaque ----------------------------------------------
    parts.push(
      box(0.8, 0.25, 0.04, WOOD, {
        y: roofY - 0.2,
        z: buildingD / 2 + 0.1,
        hex2: WOOD_D,
      })
    );

    // ---- Side wing / exhibition hall -------------------------------------
    parts.push(
      box(0.8, buildingH * 0.7, 0.6, WHITE, {
        x: buildingW / 2 + 0.4,
        y: baseY + 0.15 + buildingH * 0.35,
        hex2: WHITE_D,
      })
    );
    parts.push(
      box(0.95, 0.06, 0.75, TILE, {
        x: buildingW / 2 + 0.4,
        y: baseY + 0.15 + buildingH * 0.7 + 0.03,
        hex2: TILE_D,
      })
    );

    return finish(parts);
  },
};

export default NM_SANYI_WOODCARVING;
