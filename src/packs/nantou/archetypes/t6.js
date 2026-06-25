/**
 * @file packs/nantou/archetypes/t6.js — Roll Formosa Nantou pack, Tier 6.
 *
 * T6 — 日月潭湖畔天際線 (Sun Moon Lake lakeside skyline). The finale band:
 * lakeside hotels, marina, cable car towers and lakeview decks lit against
 * the 日月潭夜空 deep blue-violet sky. Ten ArchetypeDefs, authored in
 * the FROZEN tier order (tiers.js T6.archetypeIds) — slots [0..7] absorbable,
 * slots [8..9] repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (lakeside resort scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 湖畔飯店 lakeside_hotel ------------------------------- */
  {
    id: 'lakeside_hotel',
    displayName: '湖畔飯店',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8c8b0, 0xe8dcc4, 0x2a6a7a, 0x9fd0e4, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 日月潭涵碧樓風格 lakeside luxury resort hotel
      return finish([
        towerBanded(0.95, 3.4, 0.95, 12, 0xffffff, 0x2a6a7a, 0xffe08a, rng, { y: 1.7 }), // main tower (湖水綠+暖窗)
        towerBanded(0.78, 0.9, 0.78, 4, 0xe8dcc4, 0x3a7a8a, 0xffe6a0, rng, { y: 3.85 }), // setback crown
        // corner mullion glints
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: 0.5, y: 1.7, z: 0.5 }),
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: -0.5, y: 1.7, z: 0.5 }),
        // rooftop viewing deck
        box(1.0, 0.08, 0.8, 0xd8c8b0, { y: 4.35 }),
        box(0.9, 0.3, 0.06, 0xa0d0e0, { y: 4.55, z: 0.38 }), // glass rail
        cyl(0.05, 0.05, 0.7, 6, 0xd0d6dc, { y: 4.7 }), // rooftop mast
      ]);
    },
  },

  /* ---- slot 1: 遊艇碼頭 yacht_marina ---------------------------------- */
  {
    id: 'yacht_marina',
    displayName: '遊艇碼頭',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x5a7a8a, 0x8ab0c0, 0xffffff, 0xd8c8b0, 0xc83030],
    yOffset: -0.62,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // 日月潭遊艇碼頭: floating dock with boats (simplified)
      const parts = [
        // main dock platform
        box(4.5, 0.25, 2.0, 0xd8c8b0, { y: 0.12 }),
      ];
      // corner dock posts only
      for (const [x, z] of [[-2.0, 0.9], [2.0, 0.9], [-2.0, -0.9], [2.0, -0.9]]) {
        parts.push(cyl(0.1, 0.1, 0.5, 5, 0x6a5a4a, { x, y: 0.0, z }));
      }
      // moored boats (2 boats, simplified)
      parts.push(box(1.2, 0.35, 0.55, 0xffffff, { x: -1.0, y: 0.28, z: 1.4 }));
      parts.push(box(1.2, 0.35, 0.55, 0xc83030, { x: 1.0, y: 0.28, z: 1.4 }));
      // dock building (ticket booth)
      parts.push(box(1.2, 1.0, 1.0, 0xffffff, { x: 2.0, y: 0.62 }));
      parts.push(cyl(0.7, 0.7, 1.3, 4, 0x8a5030, { theta0: PI, rx: HALF_PI, sy: 0.5, x: 2.0, y: 1.35 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 纜車塔 cable_car_tower --------------------------------- */
  {
    id: 'cable_car_tower',
    displayName: '纜車塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83030, 0x8a9098, 0xd0d4da, 0x44484f, 0xffe8a0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // 日月潭纜車 main station tower: large A-frame pylon with gondolas
      const parts = [
        // massive A-frame main legs
        cyl(0.4, 0.5, 6.0, 6, 0xc83030, { rz: 0.1, x: -0.9, y: 3.0 }),
        cyl(0.4, 0.5, 6.0, 6, 0xc83030, { rz: -0.1, x: 0.9, y: 3.0 }),
        // cross bracing
        box(2.2, 0.25, 0.25, 0x8a9098, { y: 2.0 }),
        box(1.8, 0.25, 0.25, 0x8a9098, { y: 4.0 }),
        box(1.4, 0.25, 0.25, 0x8a9098, { y: 5.5 }),
        // station platform at base
        box(3.0, 0.3, 2.0, 0xd0d4da, { y: 0.15 }),
        // cable housing at top
        box(1.6, 0.7, 0.8, 0x44484f, { y: 6.2 }),
        // sheave wheels
        cyl(0.5, 0.5, 0.3, 8, 0x8a9098, { rx: HALF_PI, y: 6.2, z: 0.55 }),
        cyl(0.5, 0.5, 0.3, 8, 0x8a9098, { rx: HALF_PI, y: 6.2, z: -0.55 }),
        // cables
        box(8.0, 0.05, 0.05, 0x44484f, { y: 6.15, rz: 0.15 }),
        box(8.0, 0.05, 0.05, 0x44484f, { y: 6.25, rz: -0.1 }),
        // gondola (approaching)
        box(0.5, 0.6, 0.4, 0xc83030, { x: -2.5, y: 5.5 }),
        box(0.45, 0.25, 0.35, 0x88b8c8, { x: -2.5, y: 5.45 }), // window
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 環湖觀景台 lakeview_deck -------------------------------- */
  {
    id: 'lakeview_deck',
    displayName: '環湖觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8b898, 0x8a7a60, 0xa0d0e0, 0x6a9a5a, 0xffe8a0],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // 日月潭環湖步道觀景台: elevated wooden viewing platform
      const parts = [
        // main platform
        box(4.0, 0.2, 3.0, 0xc8b898, { y: 1.5 }),
        // support structure (wooden posts)
      ];
      const postPos = [
        { x: -1.6, z: 1.2 }, { x: 1.6, z: 1.2 },
        { x: -1.6, z: -1.2 }, { x: 1.6, z: -1.2 },
        { x: 0, z: 1.2 }, { x: 0, z: -1.2 },
      ];
      for (const p of postPos) {
        parts.push(cyl(0.15, 0.15, 1.5, 6, 0x8a7a60, { x: p.x, y: 0.75, z: p.z }));
      }
      // cross bracing
      parts.push(box(3.6, 0.1, 0.1, 0x8a7a60, { y: 0.5, z: 1.2 }));
      parts.push(box(3.6, 0.1, 0.1, 0x8a7a60, { y: 0.5, z: -1.2 }));
      // railings with glass panels
      parts.push(box(4.0, 0.5, 0.06, 0xa0d0e0, { y: 1.85, z: 1.48 })); // front glass
      parts.push(box(4.0, 0.08, 0.08, 0x8a7a60, { y: 2.1, z: 1.48 })); // top rail
      // side railings
      parts.push(box(0.06, 0.5, 2.9, 0xa0d0e0, { x: 1.98, y: 1.85 }));
      parts.push(box(0.06, 0.5, 2.9, 0xa0d0e0, { x: -1.98, y: 1.85 }));
      // stairs
      for (let s = 0; s < 4; s++) {
        parts.push(box(1.0, 0.15, 0.4, 0xc8b898, { x: -2.4, y: 0.35 + s * 0.3, z: 0.4 - s * 0.3 }));
      }
      // decorative tree nearby
      parts.push(cone(0.6, 1.8, 6, 0x6a9a5a, { x: 2.8, y: 0.9, z: -0.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 日月潭遊客中心 visitor_center ------------------------ */
  {
    id: 'visitor_center',
    displayName: '日月潭遊客中心',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x8a7a60, 0x9a8a70, 0x6a9080, 0xc8d4dc, 0xffd884],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 日月潭遊客中心 - 木造+現代玻璃風格
      return finish([
        box(2.4, 0.55, 1.6, 0x8a7a60, { y: 0.28 }), // 木造基座
        towerBanded(1.9, 2.9, 1.0, 9, 0x5a7068, 0x6a9080, 0xffd884, rng, { y: 2.0 }), // 玻璃帷幕+木框
        box(2.0, 0.1, 1.06, 0x7a6a58, { y: 1.45 }), // 木飾條
        box(2.0, 0.1, 1.06, 0x7a6a58, { y: 2.55 }), // 木飾條
        box(2.0, 0.1, 1.06, 0x7a6a58, { y: 3.45 }), // 木飾條
        box(1.4, 0.2, 0.7, 0x6a5a48, { y: 3.6 }), // 木造屋頂
        cyl(0.4, 0.4, 0.6, 8, 0x5a8a70, { x: 0.5, y: 3.9 }), // 觀景台綠化
      ]);
    },
  },

  /* ---- slot 5: 木棧觀景橋 wooden_bridge --------------------------------- */
  {
    id: 'wooden_bridge',
    displayName: '木棧觀景橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a7a60, 0x9a8a70, 0x6a5a48, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.427,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // 日月潭環湖木棧橋: 兩端觀景亭+木橋連接
      return finish([
        box(0.9, 2.6, 0.9, 0x8a7a60, { x: -1.5, y: 1.3 }), // 觀景亭 A
        box(0.9, 2.4, 0.9, 0x8a7a60, { x: 1.5, y: 1.2 }), // 觀景亭 B
        box(2.2, 0.2, 0.6, 0x9a8a70, { y: 1.8 }), // 木棧橋面
        box(2.2, 0.5, 0.08, 0x7a6a58, { y: 2.0, z: 0.28 }), // 木欄杆
        box(2.2, 0.5, 0.08, 0x7a6a58, { y: 2.0, z: -0.28 }), // 木欄杆
        // 亭頂
        cyl(0.7, 0.7, 0.8, 4, 0x6a5a48, { theta0: PI, rx: HALF_PI, sy: 0.4, x: -1.5, y: 2.9 }),
        cyl(0.7, 0.7, 0.8, 4, 0x6a5a48, { theta0: PI, rx: HALF_PI, sy: 0.4, x: 1.5, y: 2.7 }),
      ]);
    },
  },

  /* ---- slot 6: 清境觀山亭 mountain_pavilion --------------------------- */
  {
    id: 'mountain_pavilion',
    displayName: '清境觀山亭',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a7a60, 0x9a8a70, 0x5a8060, 0xc8ccd2, 0xe0c860],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 清境農場觀山亭
      const parts = [
        box(2.6, 0.3, 2.0, 0x9a8a70, { y: 0.15 }), // 木平台
        // 四角亭柱
        cyl(0.15, 0.15, 2.0, 6, 0x7a6a50, { x: -1.1, z: 0.8, y: 1.0 }),
        cyl(0.15, 0.15, 2.0, 6, 0x7a6a50, { x: 1.1, z: 0.8, y: 1.0 }),
        cyl(0.15, 0.15, 2.0, 6, 0x7a6a50, { x: -1.1, z: -0.8, y: 1.0 }),
        cyl(0.15, 0.15, 2.0, 6, 0x7a6a50, { x: 1.1, z: -0.8, y: 1.0 }),
        // 傳統斜屋頂
        cyl(1.4, 1.4, 2.8, 4, 0x6a5a48, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.3 }),
        // 屋脊飾
        box(2.9, 0.1, 0.15, 0x5a4a38, { y: 2.8 }),
        // 觀景木欄杆
        box(2.4, 0.4, 0.08, 0x8a7a60, { y: 0.5, z: 0.95 }),
        box(2.4, 0.4, 0.08, 0x8a7a60, { y: 0.5, z: -0.95 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 湖畔大樓 lakefront_block ------------------------------- */
  {
    id: 'lakefront_block',
    displayName: '湖畔大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x36405a, 0x4a5670, 0x7a86a0, 0xb0bccc, 0xffd884],
    yOffset: -0.308,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // 日月潭畔飯店群 lakefront hotel/condo strip
      const parts = [box(3.6, 0.16, 1.4, 0x2a3142, { y: 0.08 })]; // ground / street slab
      const hs = [2.4, 3.4, 1.8, 2.9, 2.2];
      const floorsArr = [6, 8, 5, 7, 6];
      const wallHex = [0x36405a, 0x3e4a64, 0x44506c, 0x3a4660, 0x404c66];
      for (let i = 0; i < 5; i++) {
        const h = hs[i];
        const x = -1.4 + i * 0.7;
        parts.push(
          towerBanded(0.56, h, 0.78, floorsArr[i], wallHex[i], 0x7a86a0, 0xffd884, rng, {
            x, y: 0.16 + h / 2, z: (i % 2) * 0.18 - 0.09,
          }) // lakefront tower
        );
        // small rooftop cap so silhouettes vary
        parts.push(box(0.3, 0.16, 0.3, 0x6a7488, { x, y: 0.16 + h + 0.06, z: (i % 2) * 0.18 - 0.09 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 日月潭環湖步道 lake_trail --------------- */
  {
    id: 'lake_trail',
    displayName: '日月潭環湖步道',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x8a7a60, 0x9a8a70, 0x5a8060, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // 日月潭環湖木棧步道 + 觀景亭群
      const parts = [
        // 長木棧道
        box(5.0, 0.15, 1.0, 0x9a8a70, { y: 0.08 }),
        // 欄杆
        box(5.0, 0.4, 0.06, 0x8a7a60, { y: 0.35, z: 0.48 }),
        box(5.0, 0.4, 0.06, 0x8a7a60, { y: 0.35, z: -0.48 }),
        // 涼亭 A
        box(1.2, 2.0, 1.2, 0x8a7a60, { x: -1.8, y: 1.1 }),
        cyl(0.9, 0.9, 1.4, 4, 0x6a5a48, { theta0: PI, rx: HALF_PI, sy: 0.5, x: -1.8, y: 2.4 }),
        // 涼亭 B
        box(1.2, 2.2, 1.2, 0x8a7a60, { x: 1.8, y: 1.2 }),
        cyl(0.9, 0.9, 1.4, 4, 0x6a5a48, { theta0: PI, rx: HALF_PI, sy: 0.5, x: 1.8, y: 2.6 }),
        // 觀景平台
        box(1.5, 0.2, 1.8, 0x7a6a58, { x: 0, y: 0.2, z: 1.2 }),
      ];
      // 步道欄杆柱
      for (let i = 0; i < 6; i++) {
        const sx = -2.2 + i * 0.88;
        parts.push(cyl(0.05, 0.05, 0.5, 5, 0x7a6a58, { x: sx, y: 0.35, z: 0.48 }));
        parts.push(cyl(0.05, 0.05, 0.5, 5, 0x7a6a58, { x: sx, y: 0.35, z: -0.48 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 清境觀星台 stargazing_tower ------------ */
  {
    id: 'stargazing_tower',
    displayName: '清境觀星台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x8a7a60, 0x9a8a70, 0x5a4a38, 0xb8bcc6, 0xe0c860],
    yOffset: -0.044,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 清境農場觀星塔 — 木造高塔觀景台
      const parts = [
        // 主塔身 (木造)
        box(1.4, 3.4, 1.4, 0x8a7a60, { y: 1.7 }),
        // 橫木飾條
        box(1.5, 0.1, 1.5, 0x7a6a58, { y: 0.8 }),
        box(1.5, 0.1, 1.5, 0x7a6a58, { y: 1.8 }),
        box(1.5, 0.1, 1.5, 0x7a6a58, { y: 2.8 }),
        // 頂層觀景台
        box(1.8, 0.2, 1.8, 0x9a8a70, { y: 3.5 }),
        // 觀景欄杆
        box(1.8, 0.5, 0.08, 0x8a7a60, { y: 3.75, z: 0.86 }),
        box(1.8, 0.5, 0.08, 0x8a7a60, { y: 3.75, z: -0.86 }),
        box(0.08, 0.5, 1.7, 0x8a7a60, { x: 0.86, y: 3.75 }),
        box(0.08, 0.5, 1.7, 0x8a7a60, { x: -0.86, y: 3.75 }),
        // 斜屋頂
        cyl(1.2, 1.2, 2.0, 4, 0x6a5a48, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 4.3 }),
        // 屋頂風向標
        cyl(0.04, 0.04, 0.8, 5, 0x9aa0aa, { y: 4.9 }),
        sph(0.1, 0xe0c860, { ws: 6, hs: 4, y: 5.35 }), // 頂燈
      ];
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
