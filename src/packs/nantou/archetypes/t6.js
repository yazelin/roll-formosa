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

  /* ---- slot 4: 商辦塔 biz_tower ---------------------------------- */
  {
    id: 'biz_tower',
    displayName: '商辦塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x405068, 0x5878a0, 0x88b0c8, 0xc8d4dc, 0xffd884],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 埔里/日月潭商業大樓
      return finish([
        box(2.4, 0.55, 1.6, 0xb8b2a6, { y: 0.28, hex2: 0xc8c2b6 }), // granite podium
        towerBanded(1.9, 2.9, 1.0, 9, 0x3a4c64, 0x88b0c8, 0xffd884, rng, { y: 2.0 }), // glass slab
        box(2.0, 0.1, 1.06, 0x9aa6b4, { y: 1.45 }), // sunshade band
        box(2.0, 0.1, 1.06, 0x9aa6b4, { y: 2.55 }), // sunshade band
        box(2.0, 0.1, 1.06, 0x9aa6b4, { y: 3.45 }), // sunshade band
        box(1.4, 0.2, 0.7, 0x6a7484, { y: 3.6 }), // rooftop parapet box
        box(0.55, 0.28, 0.55, 0x7e8a98, { x: 0.5, y: 3.84 }), // rooftop cooling unit
      ]);
    },
  },

  /* ---- slot 5: 空橋 sky_bridge ---------------------------------------- */
  {
    id: 'sky_bridge',
    displayName: '空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a6a8a, 0x6a96b8, 0xa0d0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.427,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // 日月潭遊客中心空橋風格: Two podium towers joined by glazed sky bridge
      return finish([
        towerBanded(0.9, 2.6, 0.9, 8, 0x3c5876, 0x6a96b8, 0xffe0a0, rng, { x: -1.5, y: 1.3 }), // tower A
        towerBanded(0.9, 2.4, 0.9, 8, 0x3c5876, 0x6a96b8, 0xffe0a0, rng, { x: 1.5, y: 1.2 }), // tower B
        box(2.2, 0.5, 0.6, 0xa0d0e4, { y: 2.0, hex2: 0xc8e4f0 }), // glazed sky bridge tube
        box(2.2, 0.05, 0.62, 0x88a0b4, { y: 2.26 }), // bridge roof cap
        box(2.2, 0.05, 0.62, 0x88a0b4, { y: 1.74 }), // bridge floor slab
        box(0.5, 0.2, 0.5, 0x7a8492, { x: -1.5, y: 2.7 }), // tower A roof unit
        box(0.5, 0.2, 0.5, 0x7a8492, { x: 1.5, y: 2.5 }), // tower B roof unit
      ]);
    },
  },

  /* ---- slot 6: 屋頂機房 rooftop_plant_room ---------------------------- */
  {
    id: 'rooftop_plant_room',
    displayName: '屋頂機房',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7280, 0x848c9a, 0xa6aeba, 0xc8ccd2, 0xe0c860],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 大型建築屋頂機房區
      const parts = [
        box(2.6, 1.6, 2.0, 0x5a6470, { y: 0.8, hex2: 0x6a7280 }), // truncated building top
        box(2.66, 0.16, 2.06, 0x4a525e, { y: 1.6 }), // roof slab cornice
        box(1.5, 0.9, 1.2, 0xa6aeba, { x: -0.3, y: 2.05, hex2: 0xc8ccd2 }), // plant-room penthouse
        box(0.6, 0.18, 0.4, 0x444a54, { x: -0.3, y: 2.5 }), // penthouse roof hatch
      ];
      // Cooling-tower fans + ducting scattered on the roof.
      parts.push(cyl(0.34, 0.34, 0.5, 8, 0x9aa2ae, { x: 0.85, y: 1.93 })); // cooling tower
      parts.push(cyl(0.34, 0.0, 0.16, 8, 0x7a828e, { x: 0.85, y: 2.26 })); // cooling tower cowl
      parts.push(cyl(0.28, 0.28, 0.46, 8, 0x9aa2ae, { x: 0.85, y: 1.91, z: -0.7 })); // cooling tower 2
      parts.push(box(1.2, 0.18, 0.18, 0x88909c, { x: 0.2, y: 1.78, z: 0.7 })); // duct run
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: 0.95 })); // roof guard rail
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: -0.95 })); // roof guard rail
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

  /* ---- slot 8 (chunk landmark): 跨街空橋 crossstreet_skybridge ------- */
  {
    id: 'crossstreet_skybridge',
    displayName: '跨街空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x3c5876, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // 日月潭遊客中心風格: wide multi-level glazed skybridge
      const parts = [
        towerBanded(1.3, 2.8, 1.3, 9, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: -2.0, y: 1.4 }), // block A
        towerBanded(1.3, 3.0, 1.3, 9, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: 2.0, y: 1.5 }), // block B
        box(2.8, 0.6, 0.9, 0x9fd0e4, { y: 1.6, hex2: 0xc8e8f4 }), // lower glazed span
        box(2.8, 0.55, 0.85, 0x9fd0e4, { y: 2.4, hex2: 0xc8e8f4 }), // upper glazed span
        box(2.8, 0.05, 0.92, 0x88a0b4, { y: 1.32 }), // lower span floor
        box(2.8, 0.05, 0.92, 0x88a0b4, { y: 2.7 }), // upper span roof
      ];
      // diagonal truss struts under the lower span
      for (let i = 0; i < 4; i++) {
        const sx = -1.1 + i * 0.73;
        parts.push(box(0.05, 0.85, 0.05, 0xb8c0c8, { rz: (i % 2 ? 1 : -1) * 0.5, x: sx, y: 1.25 })); // truss strut
      }
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: -2.0, y: 2.95 })); // block A roof unit
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: 2.0, y: 3.15 })); // block B roof unit
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop_mech_tower --------- */
  {
    id: 'rooftop_mech_tower',
    displayName: '屋頂機房塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x4a5260, 0x646c7a, 0x8a92a0, 0xb8bcc6, 0xe0c860],
    yOffset: -0.044,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 大型建築頂層機房塔 — mechanical/antenna mast tower
      const parts = [
        towerBanded(1.4, 3.4, 1.4, 11, 0x42505e, 0x8a92a0, 0xe0c860, rng, { y: 1.7 }), // main shaft
        box(1.5, 0.2, 1.5, 0x363c46, { y: 3.5 }), // roof slab
        box(1.1, 1.0, 1.1, 0x646c7a, { y: 4.1, hex2: 0x8a92a0 }), // mech penthouse
        box(0.7, 0.7, 0.7, 0xb8bcc6, { y: 4.85 }), // upper mech box
      ];
      // antenna mast cluster on top
      parts.push(cyl(0.05, 0.05, 1.4, 6, 0xd0d4dc, { y: 5.6 })); // central mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: 0.28, y: 5.3 })); // side mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: -0.28, y: 5.3 })); // side mast
      parts.push(sph(0.12, 0xe0c860, { ws: 6, hs: 4, y: 6.3 })); // aircraft warning light (lit)
      // three mech-platform rings up the mast
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.5, 0.04, 0.5, 0x9aa0aa, { y: 5.1 + i * 0.45 })); // mast platform
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
