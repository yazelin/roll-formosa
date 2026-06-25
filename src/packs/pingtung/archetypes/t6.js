/**
 * @file packs/pingtung/archetypes/t6.js — Roll Formosa Pingtung pack, Tier 6.
 *
 * T6 — 國境之南天際線 (Southernmost skyline). The finale band: resort towers,
 * coastal highrises, observation decks and cross-sea skybridges against the
 * deep blue-violet Pingtung night sky. Ten ArchetypeDefs, authored in the
 * FROZEN tier order (tiers.js T6.archetypeIds) — slots [0..7] absorbable,
 * slots [8..9] repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space.
 *
 * Size band: 60-300 m radiusNominal (Pingtung coastal/resort scale).
 */

import { box, cyl, cone, sph, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 玻璃帷幕高樓 glass curtain-wall highrise ----------------- */
  {
    id: 'glass_highrise',
    displayName: '玻璃帷幕高樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a5a7a, 0x4a7aa0, 0x6aa8c8, 0x9fd0e4, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        towerBanded(0.95, 3.4, 0.95, 12, 0x2a4868, 0x6aa8c8, 0xffe08a, rng, { y: 1.7 }),
        towerBanded(0.78, 0.9, 0.78, 4, 0x32567a, 0x7ab8d4, 0xffe6a0, rng, { y: 3.85 }),
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: 0.5, y: 1.7, z: 0.5 }),
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: -0.5, y: 1.7, z: 0.5 }),
        cyl(0.05, 0.05, 0.7, 6, 0xd0d6dc, { y: 4.6 }),
        box(0.4, 0.14, 0.4, 0x556270, { y: 4.32 }),
      ]);
    },
  },

  /* ---- slot 1: 觀景台 observation_deck --------------------------------- */
  {
    id: 'observation_deck',
    displayName: '觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a9098, 0x40c0ff, 0xffffff, 0xd8d4cc, 0xffd040],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Coastal observation platform
      const parts = [
        // Main platform structure
        cyl(1.8, 2.0, 0.4, 10, 0xffffff, { y: 2.8 }),
        // Support column
        cyl(0.6, 0.8, 2.6, 8, 0x8a9098, { y: 1.3 }),
        // Railing around platform
        cyl(2.0, 2.0, 0.15, 10, 0xd8d4cc, { y: 3.05, open: true }),
        // Glass panels
        cyl(1.9, 1.9, 0.5, 10, 0x40c0ff, { y: 3.2, open: true }),
        // Central viewing station
        cyl(0.4, 0.3, 0.8, 8, 0xffffff, { y: 3.4 }),
        // Binocular stands
        box(0.15, 0.4, 0.15, 0x3a3a3a, { x: 0.8, y: 3.2 }),
        cyl(0.1, 0.1, 0.2, 6, 0x2a2a2a, { x: 0.8, y: 3.5, rx: 0.3 }),
        box(0.15, 0.4, 0.15, 0x3a3a3a, { x: -0.8, y: 3.2 }),
        cyl(0.1, 0.1, 0.2, 6, 0x2a2a2a, { x: -0.8, y: 3.5, rx: 0.3 }),
        // Top canopy
        cone(2.2, 0.8, 8, 0xffd040, { y: 4.2 }),
        // Base plaza
        cyl(2.5, 2.5, 0.2, 10, 0xc8c4bc, { y: 0.1 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 其他摩天樓 other skyscraper ----------------------------- */
  {
    id: 'other_skyscraper',
    displayName: '其他摩天樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a5466, 0x5a6678, 0x8a96a8, 0xc0c8d4, 0xffd884],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        towerBanded(1.25, 1.9, 1.25, 6, 0x46566c, 0x8a96a8, 0xffd884, rng, { y: 0.95 }),
        towerBanded(0.95, 1.5, 0.95, 5, 0x4c5e76, 0x96a2b4, 0xffe0a0, rng, { y: 2.65 }),
        towerBanded(0.68, 1.1, 0.68, 4, 0x546880, 0xa4b0c2, 0xffe6ac, rng, { y: 3.95 }),
        box(0.5, 0.18, 0.5, 0x7a8494, { y: 4.6 }),
        cyl(0.035, 0.035, 0.9, 6, 0xcdd4dc, { y: 5.15 }),
      ]);
    },
  },

  /* ---- slot 3: 墾丁度假村看板 resort billboard wall ------------------- */
  {
    id: 'resort_billboard',
    displayName: '墾丁度假村看板',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x40c0ff, 0x2080c0, 0xffd040, 0xff6040, 0xf8f8f8],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Kenting resort/beach billboard with tropical motifs
      const parts = [
        // Building structure with beach resort theme
        box(2.4, 3.2, 0.9, 0xf8f4f0, { y: 1.7, hex2: 0xf0ece8 }),
        // Main billboard with ocean blue background
        box(2.55, 2.6, 0.12, 0x40c0ff, { y: 2.0, z: 0.5 }),
        // Beach/sunset imagery panels
        box(2.4, 1.2, 0.08, 0xff8040, { y: 2.8, z: 0.54 }), // sunset gradient
        box(2.4, 0.8, 0.08, 0x2080c0, { y: 1.5, z: 0.54 }), // ocean
        // Palm tree silhouettes
        box(0.15, 1.0, 0.06, 0x206040, { x: -0.9, y: 2.2, z: 0.56 }),
        cone(0.4, 0.6, 5, 0x308050, { x: -0.9, y: 2.9, z: 0.56 }),
        box(0.12, 0.8, 0.06, 0x206040, { x: 0.95, y: 2.4, z: 0.56 }),
        cone(0.35, 0.5, 5, 0x308050, { x: 0.95, y: 3.0, z: 0.56 }),
        // Resort name banner
        box(1.8, 0.35, 0.08, 0xffd040, { y: 1.9, z: 0.58 }),
        // Decorative sun
        sph(0.3, 0xffd040, { ws: 6, hs: 4, x: 0.0, y: 3.1, z: 0.56 }),
        // Ground/entrance
        box(2.6, 0.1, 0.16, 0xe0dcd0, { y: 0.5, z: 0.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 度假塔 resort_tower ------------------------------------ */
  {
    id: 'resort_tower',
    displayName: '度假塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0xf8f4f0, 0x40c0ff, 0x40a048, 0xffd040, 0x8a7050],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Tropical resort tower
      return finish([
        // Podium with tropical colors
        box(2.4, 0.55, 1.6, 0xf8f4f0, { y: 0.28, hex2: 0xe8e4e0 }),
        // Main tower - white with blue accents
        towerBanded(1.9, 2.9, 1.0, 9, 0xffffff, 0x40c0ff, 0xffd040, rng, { y: 2.0 }),
        // Balcony bands
        box(2.0, 0.1, 1.06, 0xffffff, { y: 1.45 }),
        box(2.0, 0.1, 1.06, 0xffffff, { y: 2.55 }),
        box(2.0, 0.1, 1.06, 0xffffff, { y: 3.45 }),
        // Rooftop garden/pool area
        box(1.4, 0.2, 0.7, 0x40a048, { y: 3.6 }),
        box(0.55, 0.1, 0.55, 0x40c0ff, { x: 0.5, y: 3.75 }), // pool
        // Thatched roof penthouse
        cone(1.0, 0.5, 6, 0x8a7050, { y: 4.0 }),
      ]);
    },
  },

  /* ---- slot 5: 海洋中心 ocean_center ---------------------------------- */
  {
    id: 'ocean_center',
    displayName: '海洋中心',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x40c0ff, 0x2080c0, 0xffffff, 0x40a048, 0xffd040],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Ocean-themed convention/exhibition center
      const parts = [
        // Main hall - wave-like curved roof
        box(3.5, 1.8, 2.8, 0xffffff, { y: 1.0 }),
        // Curved wave roof
        cyl(2.2, 2.2, 4.0, 8, 0x40c0ff, { y: 2.2, rx: HALF_PI, theta0: 0, thetaLen: PI * 0.6, hex2: 0x2080c0 }),
        // Glass atrium front
        box(2.8, 1.5, 0.1, 0x9fd0e4, { y: 1.0, z: 1.45 }),
        box(2.8, 0.2, 0.12, 0x40c0ff, { y: 1.8, z: 1.46 }),
        // Entrance plaza
        box(4.0, 0.15, 2.0, 0xd8d4cc, { y: 0.08, z: 2.0 }),
        // Water feature/fountain
        cyl(0.5, 0.5, 0.3, 8, 0x40c0ff, { x: 0, y: 0.25, z: 2.5 }),
        // Decorative whale tail sculpture
        box(0.3, 1.2, 0.1, 0x2080c0, { x: 1.2, y: 0.7, z: 2.3, rz: -0.4 }),
        box(0.3, 1.2, 0.1, 0x2080c0, { x: -1.2, y: 0.7, z: 2.3, rz: 0.4 }),
        // Side wings
        box(1.0, 1.2, 2.0, 0xf8f4f0, { x: 2.0, y: 0.7 }),
        box(1.0, 1.2, 2.0, 0xf8f4f0, { x: -2.0, y: 0.7 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 屋頂機房 rooftop plant room ---------------------------- */
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
      const parts = [
        box(2.6, 1.6, 2.0, 0x5a6470, { y: 0.8, hex2: 0x6a7280 }),
        box(2.66, 0.16, 2.06, 0x4a525e, { y: 1.6 }),
        box(1.5, 0.9, 1.2, 0xa6aeba, { x: -0.3, y: 2.05, hex2: 0xc8ccd2 }),
        box(0.6, 0.18, 0.4, 0x444a54, { x: -0.3, y: 2.5 }),
      ];
      parts.push(cyl(0.34, 0.34, 0.5, 8, 0x9aa2ae, { x: 0.85, y: 1.93 }));
      parts.push(cyl(0.34, 0.0, 0.16, 8, 0x7a828e, { x: 0.85, y: 2.26 }));
      parts.push(cyl(0.28, 0.28, 0.46, 8, 0x9aa2ae, { x: 0.85, y: 1.91, z: -0.7 }));
      parts.push(box(1.2, 0.18, 0.18, 0x88909c, { x: 0.2, y: 1.78, z: 0.7 }));
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: 0.95 }));
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: -0.95 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 海岸大樓 coastal_block --------------------------------- */
  {
    id: 'coastal_block',
    displayName: '海岸大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf8f4f0, 0x40c0ff, 0x7a86a0, 0xffd040, 0xb0bccc],
    yOffset: -0.308,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Coastal resort block - row of ocean-facing buildings
      const parts = [box(3.6, 0.16, 1.4, 0x2a3142, { y: 0.08 })];
      const hs = [2.4, 3.4, 1.8, 2.9, 2.2];
      const floorsArr = [6, 8, 5, 7, 6];
      const wallHex = [0xf8f4f0, 0xffffff, 0xf0ece8, 0xffffff, 0xf8f4f0];
      for (let i = 0; i < 5; i++) {
        const h = hs[i];
        const x = -1.4 + i * 0.7;
        parts.push(
          towerBanded(0.56, h, 0.78, floorsArr[i], wallHex[i], 0x40c0ff, 0xffd040, rng, {
            x, y: 0.16 + h / 2, z: (i % 2) * 0.18 - 0.09,
          })
        );
        parts.push(box(0.3, 0.16, 0.3, 0x6a7488, { x, y: 0.16 + h + 0.06, z: (i % 2) * 0.18 - 0.09 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨海空橋 cross_sea_skybridge ----------- */
  {
    id: 'cross_sea_skybridge',
    displayName: '跨海空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x40c0ff, 0x2080c0, 0xffffff, 0xffd040, 0x9fd0e4],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Scenic skybridge over water between resort buildings
      const parts = [
        // Two resort towers
        towerBanded(1.3, 2.8, 1.3, 9, 0xffffff, 0x40c0ff, 0xffd040, rng, { x: -2.0, y: 1.4 }),
        towerBanded(1.3, 3.0, 1.3, 9, 0xffffff, 0x40c0ff, 0xffd040, rng, { x: 2.0, y: 1.5 }),
        // Glazed skybridge spans - ocean blue
        box(2.8, 0.6, 0.9, 0x9fd0e4, { y: 1.6, hex2: 0xc8e8f4 }),
        box(2.8, 0.55, 0.85, 0x9fd0e4, { y: 2.4, hex2: 0xc8e8f4 }),
        box(2.8, 0.05, 0.92, 0x40c0ff, { y: 1.32 }),
        box(2.8, 0.05, 0.92, 0x40c0ff, { y: 2.7 }),
      ];
      // Diagonal truss struts
      for (let i = 0; i < 4; i++) {
        const sx = -1.1 + i * 0.73;
        parts.push(box(0.05, 0.85, 0.05, 0xb8c0c8, { rz: (i % 2 ? 1 : -1) * 0.5, x: sx, y: 1.25 }));
      }
      parts.push(box(0.7, 0.26, 0.7, 0xffffff, { x: -2.0, y: 2.95 }));
      parts.push(box(0.7, 0.26, 0.7, 0xffffff, { x: 2.0, y: 3.15 }));
      // Water hint below
      parts.push(box(3.5, 0.1, 1.5, 0x2080c0, { y: -0.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop_mech_tower ---------- */
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
      const parts = [
        towerBanded(1.4, 3.4, 1.4, 11, 0x42505e, 0x8a92a0, 0xe0c860, rng, { y: 1.7 }),
        box(1.5, 0.2, 1.5, 0x363c46, { y: 3.5 }),
        box(1.1, 1.0, 1.1, 0x646c7a, { y: 4.1, hex2: 0x8a92a0 }),
        box(0.7, 0.7, 0.7, 0xb8bcc6, { y: 4.85 }),
      ];
      parts.push(cyl(0.05, 0.05, 1.4, 6, 0xd0d4dc, { y: 5.6 }));
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: 0.28, y: 5.3 }));
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: -0.28, y: 5.3 }));
      parts.push(sph(0.12, 0xe0c860, { ws: 6, hs: 4, y: 6.3 }));
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.5, 0.04, 0.5, 0x9aa0aa, { y: 5.1 + i * 0.45 }));
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
