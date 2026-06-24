/**
 * @file packs/miaoli/landmarks/tongxiao_station.js — Roll Formosa Miaoli pack.
 *
 * NM_TONGXIAO_SHRINE — 通霄神社 (Tongxiao Shrine), a well-preserved Japanese
 * Shinto shrine built in 1937 in 通霄鎮. One of the few remaining intact
 * Japanese shrines in Taiwan, featuring the classic torii gate (鳥居),
 * stone lanterns (石燈籠), the haiden (拜殿) worship hall, and the main
 * hall (本殿). The shrine sits on 虎頭山 with views over the town.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Tongxiao Shrine materials (Japanese Shinto shrine).
const TORII = 0xc03020; // vermillion red torii gate
const TORII_D = 0x901810; // darker torii shadow
const WOOD = 0x9a7040; // aged shrine wood
const WOOD_D = 0x6a4a28; // darker wood
const STONE = 0xa8a090; // grey stone (lanterns, steps)
const STONE_D = 0x888070; // darker stone
const TILE = 0x4a4a4a; // dark roof tile
const TILE_D = 0x2a2a2a; // deeper tile
const WHITE = 0xf5f0e8; // white paper / shimenawa rope
const COPPER = 0x5a8070; // oxidized copper roof accent
const GOLD = 0xc9a030; // gold ornaments

export const NM_TONGXIAO_SHRINE = {
  id: 'tongxiao_shrine',
  name: '通霄神社',
  dioramaRHint: 45, // ~ shrine compound footprint radius in metres
  colorHex: 0xc03020, // signature torii vermillion
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Stone path and base ---------------------------------------------
    parts.push(
      box(3.0, 0.1, 2.4, STONE, { y: 0.05, hex2: STONE_D })
    );

    // ---- Torii gate (鳥居) at the entrance --------------------------------
    const toriiY = 0.1;
    const toriiW = 1.0;
    const toriiH = 1.0;

    // Two main pillars (hashira)
    for (const dx of [-1, 1]) {
      parts.push(
        cyl(0.06, 0.07, toriiH, 6, TORII, {
          x: dx * toriiW / 2,
          y: toriiY + toriiH / 2,
          z: -0.9,
          hex2: TORII_D,
        })
      );
    }

    // Top beam (kasagi) - curved
    parts.push(
      box(toriiW + 0.25, 0.08, 0.12, TORII, {
        y: toriiY + toriiH,
        z: -0.9,
        hex2: TORII_D,
      })
    );

    // Second beam (nuki) below the top
    parts.push(
      box(toriiW + 0.05, 0.05, 0.08, TORII, {
        y: toriiY + toriiH * 0.8,
        z: -0.9,
      })
    );

    // ---- Stone lanterns (石燈籠) flanking the path -----------------------
    for (const dx of [-1, 1]) {
      const lx = dx * 0.5;

      // Lantern base
      parts.push(
        box(0.12, 0.08, 0.12, STONE, {
          x: lx,
          y: 0.14,
          z: -0.5,
        })
      );
      // Lantern pillar
      parts.push(
        cyl(0.04, 0.05, 0.25, 4, STONE, {
          x: lx,
          y: 0.1 + 0.08 + 0.125,
          z: -0.5,
          hex2: STONE_D,
        })
      );
      // Lantern light box
      parts.push(
        box(0.14, 0.12, 0.14, STONE, {
          x: lx,
          y: 0.1 + 0.08 + 0.25 + 0.06,
          z: -0.5,
        })
      );
      // Lantern roof
      parts.push(
        cone(0.12, 0.1, 4, STONE_D, {
          ry: HALF_PI / 2,
          x: lx + r,
          y: 0.1 + 0.08 + 0.25 + 0.12 + 0.05,
          z: -0.5,
        })
      );
    }

    // ---- Haiden (拜殿) worship hall --------------------------------------
    const haidenY = 0.1;
    const haidenW = 1.2;
    const haidenD = 0.7;
    const haidenH = 0.6;

    // Raised platform
    parts.push(
      box(haidenW + 0.2, 0.12, haidenD + 0.15, STONE, {
        y: haidenY + 0.06,
        z: 0.2,
      })
    );

    // Haiden building body (wood)
    parts.push(
      box(haidenW, haidenH, haidenD, WOOD, {
        y: haidenY + 0.12 + haidenH / 2,
        z: 0.2,
        hex2: WOOD_D,
      })
    );

    // Front opening / entrance
    parts.push(
      box(haidenW * 0.5, haidenH * 0.65, 0.04, WOOD_D, {
        y: haidenY + 0.12 + haidenH * 0.35,
        z: 0.2 - haidenD / 2 - 0.02,
      })
    );

    // Haiden roof (irimoya style)
    parts.push(
      box(haidenW + 0.35, 0.08, haidenD + 0.3, TILE, {
        y: haidenY + 0.12 + haidenH + 0.04,
        z: 0.2,
        hex2: TILE_D,
      })
    );
    parts.push(
      cone((haidenW + 0.2) / 2, 0.3, 4, TILE, {
        ry: HALF_PI / 2,
        y: haidenY + 0.12 + haidenH + 0.08 + 0.15,
        z: 0.2,
        hex2: TILE_D,
      })
    );

    // ---- Honden (本殿) main hall behind haiden ---------------------------
    const hondenW = 0.8;
    const hondenD = 0.5;
    const hondenH = 0.5;

    parts.push(
      box(hondenW, hondenH, hondenD, WOOD, {
        y: haidenY + 0.12 + hondenH / 2,
        z: 0.2 + haidenD / 2 + 0.25,
        hex2: WOOD_D,
      })
    );

    // Honden roof
    parts.push(
      box(hondenW + 0.2, 0.06, hondenD + 0.2, COPPER, {
        y: haidenY + 0.12 + hondenH + 0.03,
        z: 0.2 + haidenD / 2 + 0.25,
        hex2: TILE_D,
      })
    );
    parts.push(
      cone((hondenW + 0.1) / 2, 0.2, 4, COPPER, {
        ry: HALF_PI / 2,
        y: haidenY + 0.12 + hondenH + 0.06 + 0.1,
        z: 0.2 + haidenD / 2 + 0.25,
      })
    );

    // Gold finial on honden
    parts.push(
      cyl(0.02, 0.02, 0.12, 4, GOLD, {
        y: haidenY + 0.12 + hondenH + 0.06 + 0.2 + 0.06,
        z: 0.2 + haidenD / 2 + 0.25,
      })
    );

    // ---- Shimenawa rope on haiden entrance -------------------------------
    parts.push(
      box(haidenW * 0.6, 0.04, 0.06, WHITE, {
        y: haidenY + 0.12 + haidenH - 0.1,
        z: 0.2 - haidenD / 2 - 0.05,
      })
    );

    return finish(parts);
  },
};

export default NM_TONGXIAO_SHRINE;
