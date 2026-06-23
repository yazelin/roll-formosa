/**
 * @file packs/changhua/archetypes/t6.js — Roll Formosa Changhua pack, Tier 6.
 *
 * T6 — 彰化地標 (Changhua landmarks). The finale band: historic temples,
 * the Great Buddha, traditional street houses, and agricultural infrastructure
 * defining Changhua's landscape. Ten ArchetypeDefs, authored in the FROZEN tier
 * order (tiers.js T6.archetypeIds) — slots [0..7] absorbable, slots [8..9]
 * repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (regional landmark scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 龍山寺塔 (Longshan Temple pagoda tower) ----------------- */
  {
    id: 'longshan_pagoda',
    displayName: '龍山寺塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe0a83a, 0x2e5a3a, 0x6a4a32, 0xfff2c0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // 鹿港龍山寺塔 (historic temple pagoda tower)
      const parts = [
        // base platform
        box(2.0, 0.5, 2.0, 0x8a7a6a, { y: 0.25 }),
        box(1.8, 0.3, 1.8, 0x9a8a7a, { y: 0.55 }),
      ];
      // multi-tier pagoda levels
      const tiers = 5;
      for (let t = 0; t < tiers; t++) {
        const y = 0.7 + t * 0.8;
        const scale = 1.0 - t * 0.12;
        // body of this tier
        parts.push(box(1.4 * scale, 0.5, 1.4 * scale, 0xc83828, { y: y + 0.25 }));
        // eave roof
        parts.push(cyl(1.1 * scale, 1.1 * scale, 1.5 * scale, 4, 0x2e5a3a, {
          theta0: PI / 4, rx: HALF_PI, sy: 0.3, y: y + 0.6,
        }));
        // eave edge decoration
        parts.push(box(1.6 * scale, 0.08, 1.6 * scale, 0xe0a83a, { y: y + 0.52 }));
      }
      // top finial (寶頂)
      const topY = 0.7 + tiers * 0.8;
      parts.push(cyl(0.15, 0.08, 0.4, 6, 0xe0a83a, { y: topY + 0.4 }));
      parts.push(sph(0.12, 0xe0a83a, { ws: 6, hs: 4, y: topY + 0.7 }));
      parts.push(cone(0.08, 0.3, 6, 0xe0a83a, { y: topY + 0.95 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 鹿港街屋 (Lukang historic street house row) -------------- */
  {
    id: 'lukang_street_row',
    displayName: '鹿港街屋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb85a3a, 0xd8d4cc, 0x6a4a32, 0x2e5a3a, 0xfff2c0],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 鹿港老街連棟街屋 (row of traditional Lukang shophouses) - simplified
      const parts = [];
      const widths = [1.3, 1.2, 1.4];
      const heights = [2.4, 2.8, 2.6];
      let xPos = -2.0;
      for (let i = 0; i < 3; i++) {
        const w = widths[i];
        const h = heights[i];
        const x = xPos + w / 2;
        xPos += w + 0.15;
        // main building body (red brick)
        parts.push(box(w, h, 1.8, 0xb85a3a, { x, y: h / 2, hex2: 0xc86a4a }));
        // traditional facade decoration (baroque / Western influenced)
        parts.push(box(w + 0.1, 0.35, 0.15, 0xd8d4cc, { x, y: h + 0.18, z: 0.95 }));
        // ground floor arcade beam (騎樓)
        parts.push(box(w, 0.12, 0.5, 0x6a4a32, { x, y: 0.75, z: 1.15 }));
        // shop signage
        parts.push(box(w * 0.65, 0.2, 0.06, 0xfff2c0, { x, y: 0.9, z: 0.95 }));
      }
      // street paving
      parts.push(box(5.0, 0.1, 2.2, 0x8a7a6a, { y: 0.05, z: 1.7 }));
      // single arcade column detail
      parts.push(cyl(0.1, 0.1, 0.7, 5, 0xd8d4cc, { x: -1.0, y: 0.35, z: 1.05 }));
      parts.push(cyl(0.1, 0.1, 0.7, 5, 0xd8d4cc, { x: 1.0, y: 0.35, z: 1.05 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 大佛座 (Changhua Great Buddha statue) ------------------- */
  {
    id: 'great_buddha',
    displayName: '大佛座',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd4b896, 0xc4a886, 0xe0c8a8, 0x8a7a6a, 0x2e5a3a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 八卦山大佛 (Bagua Mountain Great Buddha - simplified for tri budget)
      const parts = [
        // lotus pedestal base (蓮花座)
        cyl(1.8, 2.0, 0.8, 8, 0x8a7a6a, { y: 0.4 }),
        cyl(1.6, 1.5, 0.5, 8, 0xe0c8a8, { y: 1.1 }),
        // Buddha body (seated position - simplified)
        // lower body / lap
        sph(1.3, 0xd4b896, { ws: 7, hs: 5, y: 1.9, sy: 0.5 }),
        // torso
        cyl(0.9, 0.7, 1.8, 6, 0xd4b896, { y: 2.9 }),
        // head
        sph(0.6, 0xd4b896, { ws: 6, hs: 5, y: 4.2 }),
        // ushnisha (頭頂肉髻)
        sph(0.25, 0xd4b896, { ws: 5, hs: 4, y: 4.75 }),
        // hands in meditation mudra
        sph(0.3, 0xd4b896, { ws: 5, hs: 4, y: 2.0 }),
        // platform / viewing deck around base
        box(4.0, 0.2, 4.0, 0x6a5a4a, { y: 0.1 }),
        // stairs leading up
        box(1.0, 0.15, 0.8, 0x8a7a6a, { z: 2.2, y: 0.18 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 田尾花市棚 (Tianwei flower market greenhouse) ----------- */
  {
    id: 'flower_market',
    displayName: '田尾花市棚',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8f4e8, 0x4a8a4a, 0xe04080, 0xffd040, 0x6a5a4a],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 田尾公路花園花市 (Tianwei Highway Garden flower market complex) - simplified
      const parts = [
        // main greenhouse structure
        box(4.5, 0.15, 3.5, 0x6a5a4a, { y: 0.08 }), // concrete floor
        // arched greenhouse frame (simplified half-cylinder)
        cyl(2.2, 2.2, 4.8, 6, 0xe8f4e8, { theta0: 0, thetaLen: PI, rx: HALF_PI, y: 2.0 }),
        // structural ribs (reduced to 3)
        cyl(0.08, 0.08, 2.2, 4, 0xc0d0c0, { x: -1.5, y: 1.1, z: 1.5 }),
        cyl(0.08, 0.08, 2.2, 4, 0xc0d0c0, { x: 0, y: 1.1, z: 1.5 }),
        cyl(0.08, 0.08, 2.2, 4, 0xc0d0c0, { x: 1.5, y: 1.1, z: 1.5 }),
        // flower display tables with continuous flower mass (simplified)
        box(4.0, 0.5, 0.5, 0x6a5a4a, { y: 0.45, z: -0.8 }), // table 1
        box(3.8, 0.25, 0.4, 0xe04080, { y: 0.95, z: -0.8 }), // flower mass pink
        box(4.0, 0.5, 0.5, 0x6a5a4a, { y: 0.45, z: 0.2 }), // table 2
        box(3.8, 0.25, 0.4, 0xffd040, { y: 0.95, z: 0.2 }), // flower mass yellow
        box(4.0, 0.5, 0.5, 0x6a5a4a, { y: 0.45, z: 1.2 }), // table 3
        box(3.8, 0.25, 0.4, 0xff6060, { y: 0.95, z: 1.2 }), // flower mass red
        // entrance signage
        cyl(0.12, 0.12, 2.5, 5, 0x6a4a32, { x: 2.5, y: 1.25, z: 1.8 }),
        box(1.5, 0.6, 0.1, 0xfff2c0, { x: 2.5, y: 2.6, z: 1.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 商辦塔 business tower ---------------------------------- */
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
      // Wide glass office slab on a granite podium with a horizontal sunshade band.
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

  /* ---- slot 5: 空橋 sky bridge ---------------------------------------- */
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
      // Two podium towers joined high up by a glazed enclosed pedestrian sky bridge.
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
      // A capped building top: the plant-room penthouse with cooling towers, ducts and rails.
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

  /* ---- slot 7: 摩天大樓 skyline block ------------------------------- */
  {
    id: 'skyline_block',
    displayName: '摩天大樓',
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
      // A whole stretch of skyline: a row of staggered lit towers of varying heights.
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
          }) // skyline tower
        );
        // small rooftop cap so silhouettes vary
        parts.push(box(0.3, 0.16, 0.3, 0x6a7488, { x, y: 0.16 + h + 0.06, z: (i % 2) * 0.18 - 0.09 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 cross-street skybridge ------- */
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
      // Monumental: a wide multi-level glazed skybridge spanning a street between
      // two big mixed-use blocks — the signature Xinyi air-corridor.
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

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop mech tower --------- */
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
      // A tall tower crowned by a dense mechanical/antenna mast head — the kind of
      // rooftop mech stack that tops Xinyi's tallest service towers.
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
