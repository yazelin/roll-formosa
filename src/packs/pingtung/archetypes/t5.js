/**
 * @file packs/pingtung/archetypes/t5.js — Pingtung pack T5 「海生館與度假區」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / resort
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/pingtung/tiers.js.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350.
 */

import {
  paint, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

const TIER = 5;

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T5_ARCHETYPES = [
  /* ---- slot 0: 商辦大樓 office_tower ------------------------------- */
  {
    id: 'office_tower',
    displayName: '商辦大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a5a72, 0xc8d4e2, 0x8a98aa, 0x2e3744, 0xe2e8f0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        towerBanded(2.6, 7.2, 2.0, 14, 0xffffff, 0x2e3a4a, 0xfff0c0, rng, { y: 3.6 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: -0.8, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.0, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.8, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: -0.8, y: 3.6, z: -1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.8, y: 3.6, z: -1.02 }),
        box(2.8, 0.9, 2.2, 0x222a34, { y: 0.45 }),
        box(1.0, 0.7, 0.06, 0x9fb4cc, { y: 0.4, z: 1.12 }),
        box(2.2, 0.7, 1.7, 0xd6dee8, { y: 7.55 }),
        box(2.2, 0.12, 1.7, 0x8a98aa, { y: 7.96 }),
        box(1.0, 0.5, 0.8, 0x5a6472, { y: 8.15 }),
        cyl(0.05, 0.05, 1.2, 6, 0xb04030, { y: 9.0 }),
      ]);
    },
  },

  /* ---- slot 1: 度假飯店 resort_hotel ------------------------------ */
  {
    id: 'resort_hotel',
    displayName: '度假飯店',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4f0, 0x40c0ff, 0xffd040, 0x40a048, 0xe8e4e0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Tropical resort hotel with palm-lined entrance
      const parts = [
        box(4.4, 4.6, 3.4, 0xffffff, { y: 2.5 }),
        box(4.5, 0.3, 3.5, 0xf8f4f0, { y: 4.95 }),
        // Tropical blue accent bands
        box(4.6, 0.2, 0.1, 0x40c0ff, { y: 2.0, z: 1.75 }),
        box(4.6, 0.2, 0.1, 0x40c0ff, { y: 3.5, z: 1.75 }),
        // Ground floor lobby
        box(4.6, 1.5, 0.4, 0x2b3640, { y: 0.95, z: 1.7 }),
        box(4.2, 1.2, 0.06, 0xb9c8da, { y: 0.95, z: 1.92 }),
        // Entrance canopy
        box(2.0, 0.18, 1.2, 0xffffff, { y: 1.9, z: 2.1 }),
        // Pool area hint (blue rectangle)
        box(2.0, 0.1, 1.5, 0x40c0ff, { x: -1.5, y: 0.15, z: -0.5 }),
        // Palm trees at entrance
        cyl(0.08, 0.08, 1.5, 6, 0x8a7050, { x: -1.0, y: 0.75, z: 2.4 }),
        cone(0.4, 0.8, 6, 0x40a048, { x: -1.0, y: 1.8, z: 2.4 }),
        cyl(0.08, 0.08, 1.5, 6, 0x8a7050, { x: 1.0, y: 0.75, z: 2.4 }),
        cone(0.4, 0.8, 6, 0x40a048, { x: 1.0, y: 1.8, z: 2.4 }),
      ];
      // Balcony rows
      for (let i = 0; i < 6; i++) {
        const lit = rng() < 0.5 ? 0xfff0c8 : 0x6a7280;
        parts.push(box(0.42, 0.5, 0.05, lit, { x: -1.7 + i * 0.68, y: 4.0, z: 1.72 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 遊覽車高架 tour_bus_viaduct ------------------------- */
  {
    id: 'tour_bus_viaduct',
    displayName: '遊覽車高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x40c0ff],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Elevated road with a tour bus
      const parts = [
        // Deck
        box(9.0, 0.7, 1.8, 0xffffff, { y: 3.4 }),
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: 0.95 }),
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: -0.95 }),
      ];
      // Piers
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.55, 0.7, 3.1, 6, 0xc2c6cc, { x, y: 1.55 }));
        parts.push(box(1.5, 0.4, 1.9, 0xb0b6be, { x, y: 3.05 }));
      }
      // Tour bus (colorful)
      parts.push(box(4.2, 1.1, 1.2, 0xffffff, { y: 4.35, hex2: 0x40c0ff }));
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: 0.62 }));
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: -0.62 }));
      parts.push(box(4.3, 0.18, 1.24, 0xff6040, { y: 4.95 })); // Tour bus stripe
      return finish(parts);
    },
  },

  /* ---- slot 3: 跨港天橋 harbor_bridge ------------------------------ */
  {
    id: 'harbor_bridge',
    displayName: '跨港天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc6ccd2, 0x9aa0a8, 0xe0e4ea, 0x40c0ff, 0x6a7078],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Harbor pedestrian overpass
      const parts = [
        // Span deck
        box(6.4, 0.32, 1.3, 0xffffff, { y: 2.6 }),
        // Railings
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: 0.6 }),
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: -0.6 }),
        // Curved canopy (ocean theme)
        box(6.4, 0.06, 0.9, 0x40c0ff, { y: 3.55, z: 0.45, rx: 0.22 }),
        box(6.4, 0.06, 0.9, 0x40c0ff, { y: 3.55, z: -0.45, rx: -0.22 }),
        box(6.4, 0.06, 0.16, 0xffffff, { y: 3.78 }),
      ];
      // Supports
      for (let i = 0; i < 4; i++) {
        const x = -2.4 + i * 1.6;
        parts.push(box(0.05, 0.5, 0.05, 0x7a8088, { x, y: 2.85, z: 0.6 }));
        parts.push(box(0.05, 0.5, 0.05, 0x7a8088, { x, y: 2.85, z: -0.6 }));
        if (i % 2 === 0) parts.push(box(0.07, 0.95, 0.07, 0x9aa0a8, { x, y: 3.1, z: 0 }));
      }
      // Stair towers
      for (const sx of [-3.4, 3.4]) {
        parts.push(box(1.0, 2.7, 1.2, 0xb6bcc4, { x: sx, y: 1.35 }));
        parts.push(box(0.9, 0.5, 0.06, 0x40c0ff, { x: sx, y: 1.6, z: 0.63 }));
        for (let s = 0; s < 3; s++) {
          parts.push(box(0.9, 0.07, 0.34, 0x7a8088, { x: sx, y: 0.6 + s * 0.7, z: 0.7 + s * 0.24 }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 停車塔 parking_tower ------------------------------- */
  {
    id: 'parking_tower',
    displayName: '停車塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x9aa0a6, 0x7a8088, 0xc0c4ca, 0x5a6068, 0xe0a838],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        box(2.0, 7.0, 2.4, 0xffffff, { y: 3.6 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: -1.15 }),
        box(2.0, 0.4, 2.4, 0x7a8088, { y: 7.3 }),
        box(1.0, 0.7, 0.1, 0xe0a838, { y: 0.5, z: 1.22 }),
      ];
      const carHex = [0xc94f46, 0x3f6cc4, 0xe0e0e0, 0x49a05f, 0xe0a838, 0x9a9a9a];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.62, 0.08, 0x20262e, { y, z: 1.18 }));
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 海生館看板 aquarium_billboard ----------------------- */
  {
    id: 'aquarium_billboard',
    displayName: '海生館看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x40c0ff, 0x2080c0, 0xffffff, 0xffd040, 0x40a048],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // Ocean-themed billboard for National Marine Biology Museum
      const parts = [
        // Gantry legs
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0 }),
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // Billboard with ocean blue gradient
        box(5.2, 2.4, 0.18, 0x40c0ff, { y: 5.4, hex2: 0x2080c0 }),
        box(5.0, 2.2, 0.06, 0xffffff, { y: 5.4, z: 0.13 }),
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }),
        // Marine life graphics
        sph(0.4, 0x3090d0, { ws: 6, hs: 4, x: -1.0, y: 5.5, z: 0.15 }), // whale shape
        sph(0.25, 0x40c0ff, { ws: 5, hs: 3, x: 0.5, y: 5.2, z: 0.15 }), // fish
        sph(0.2, 0xff6040, { ws: 5, hs: 3, x: 1.2, y: 5.6, z: 0.15 }), // starfish
        // Spotlights
        cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: -1.6, y: 6.6, rx: 0.6 }),
        cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: 1.6, y: 6.6, rx: 0.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 玻璃帷幕民宿 glass_curtain_bnb ---------------------- */
  {
    id: 'glass_curtain_bnb',
    displayName: '玻璃帷幕民宿',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6fbfd0, 0xbfeaf0, 0x3a6a78, 0x2e3744, 0xe8f4f6],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Modern glass B&B typical of Kenting area
      const parts = [
        box(2.2, 5.2, 2.0, 0xffffff, { y: 2.8 }),
        box(2.0, 4.6, 0.14, 0x2e3744, { y: 2.9, z: 1.02 }),
        box(1.8, 4.4, 0.06, 0x8fd6e2, { y: 2.9, z: 1.1 }),
        box(2.0, 0.9, 0.1, 0x20262c, { y: 0.5, z: 1.06 }),
        box(1.2, 0.7, 0.06, 0xbfeaf0, { y: 0.5, z: 1.12 }),
        box(2.3, 0.24, 2.1, 0x4a8090, { y: 5.5 }),
        cyl(0.4, 0.4, 0.6, 7, 0x9aa0a8, { x: 0.5, y: 5.9 }),
      ];
      for (let f = 1; f < 5; f++) {
        parts.push(box(1.85, 0.07, 0.04, 0x223038, { y: 0.6 + f * 0.95, z: 1.14 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 銀行 bank ------------------------------------------ */
  {
    id: 'bank',
    displayName: '銀行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8d0bc, 0xeae4d2, 0x9a8e72, 0x3a4a6a, 0xc8a84a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      const parts = [
        box(4.0, 3.4, 3.0, 0xffffff, { y: 1.9 }),
        box(4.2, 0.3, 3.2, 0x9a8e72, { y: 3.7 }),
        box(3.6, 0.4, 0.5, 0xeae4d2, { y: 3.0, z: 1.6 }),
        box(3.6, 0.6, 0.4, 0xeae4d2, { y: 3.5, z: 1.55, sx: 1, sy: 1, sz: 1 }),
        cone(1.9, 0.7, 4, 0xe2dcca, { y: 3.95, z: 1.55, ry: PI / 4, sz: 0.25 }),
        box(2.0, 0.2, 1.0, 0x8a7e64, { y: 0.18, z: 1.7 }),
      ];
      for (let i = 0; i < 4; i++) {
        const x = -1.35 + i * 0.9;
        parts.push(cyl(0.26, 0.28, 2.5, 6, 0xf0ead8, { x, y: 1.55, z: 1.7 }));
        parts.push(box(0.66, 0.16, 0.66, 0xd8d0bc, { x, y: 0.34, z: 1.7 }));
        parts.push(box(0.66, 0.16, 0.66, 0xd8d0bc, { x, y: 2.78, z: 1.7 }));
      }
      parts.push(box(2.0, 0.34, 0.08, 0xc8a84a, { y: 3.0, z: 1.84 }));
      parts.push(box(0.9, 1.6, 0.08, 0x2a3a58, { y: 1.0, z: 1.76 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 海生館入口塔 aquarium_entrance_tower (CHUNK LANDMARK) - */
  {
    id: 'aquarium_entrance_tower',
    displayName: '海生館入口塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x40c0ff, 0x2080c0, 0xffffff, 0x40a048, 0xe6eef6],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // National Marine Biology Museum entrance tower
      return finish([
        // Main building base
        box(4.2, 1.8, 3.4, 0xffffff, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x40c0ff, { y: 1.85 }),
        // Central tower
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x2080c0, 0xfff0c0, rng, { y: 6.5 }),
        // Wave-pattern accent
        box(0.12, 9.0, 0.12, 0x40c0ff, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x40c0ff, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x40c0ff, { x: 0.95, y: 6.5, z: 1.22 }),
        // Crown with fish sculpture hint
        box(2.4, 0.4, 1.9, 0x7a8aa0, { y: 11.2 }),
        towerBanded(1.9, 3.4, 1.6, 7, 0xe6eef6, 0x3090c0, 0xfff0c0, rng, { y: 13.1 }),
        box(1.5, 0.6, 1.2, 0x40c0ff, { y: 15.1 }),
        // Whale sculpture on top
        sph(0.6, 0x2080c0, { ws: 7, hs: 5, y: 15.8, sx: 1.5 }),
        cone(0.3, 0.8, 6, 0x3090c0, { y: 16.5, rz: 0.2 }),
      ]);
    },
  },

  /* ---- slot 9: 度假村大廳 resort_lobby_mass (CHUNK LANDMARK) ------- */
  {
    id: 'resort_lobby_mass',
    displayName: '度假村大廳',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xf8f4f0, 0x40c0ff, 0x8a7050, 0x40a048, 0xffd040],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Tropical resort lobby complex
      const parts = [
        // Main lobby building
        box(5.6, 3.6, 4.2, 0xffffff, { y: 2.0 }),
        box(4.2, 2.6, 3.4, 0xffffff, { y: 5.1 }),
        box(5.7, 0.3, 4.3, 0xf8f4f0, { y: 3.85 }),
        box(4.3, 0.3, 3.5, 0xf8f4f0, { y: 6.45 }),
        // Thatched roof element
        cyl(2.0, 2.0, 1.0, 8, 0x8a7050, { y: 7.0, hex2: 0x6a5030 }),
        // Entrance atrium
        cyl(1.5, 1.5, 4.6, 9, 0x9fc4d8, { y: 2.3, z: 2.1, rx: HALF_PI, theta0: -HALF_PI, thetaLen: PI }),
        box(2.6, 4.4, 0.12, 0x2c3a44, { y: 2.3, z: 2.0 }),
        // Pool/water feature
        box(2.5, 0.15, 1.8, 0x40c0ff, { x: -1.8, y: 0.1, z: -0.5 }),
        // Palm trees
        cyl(0.1, 0.1, 2.0, 6, 0x8a7050, { x: 2.2, y: 1.0, z: 2.2 }),
        cone(0.6, 1.2, 6, 0x40a048, { x: 2.2, y: 2.4, z: 2.2 }),
        cyl(0.1, 0.1, 2.0, 6, 0x8a7050, { x: -2.2, y: 1.0, z: 2.2 }),
        cone(0.6, 1.2, 6, 0x40a048, { x: -2.2, y: 2.4, z: 2.2 }),
        // Entrance canopy
        box(3.2, 0.22, 1.2, 0xffd040, { y: 1.5, z: 2.7 }),
      ];
      // Windows
      for (let i = 0; i < 7; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.6, 0.05, lit, { x: -2.4 + i * 0.8, y: 3.1, z: 2.12 }));
      }
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
