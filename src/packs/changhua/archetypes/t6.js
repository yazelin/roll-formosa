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

  /* ---- slot 4: 紡織廠 (Changhua textile factory) ----------------------- */
  {
    id: 'textile_factory',
    displayName: '紡織廠',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0xc8bca8, 0xb8a898, 0x9a8a78, 0x8a7a6a, 0xe0d8c8],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 彰化傳統紡織廠 (traditional textile factory building)
      const parts = [
        // main factory building
        box(4.0, 2.5, 3.0, 0xffffff, { y: 1.25, hex2: 0xc8bca8 }), // brick body
        // sawtooth factory roof (北向採光屋頂)
        box(4.2, 0.15, 3.2, 0x9a8a78, { y: 2.6 }),
        // sawtooth peaks
        box(1.2, 0.6, 3.0, 0x9a8a78, { x: -1.2, y: 2.8, rz: 0.4 }),
        box(1.2, 0.6, 3.0, 0x9a8a78, { x: 1.2, y: 2.8, rz: 0.4 }),
        // glass skylights on north face
        box(0.8, 0.4, 2.8, 0x9fc4d8, { x: -1.2, y: 3.0, rz: -0.4 }),
        box(0.8, 0.4, 2.8, 0x9fc4d8, { x: 1.2, y: 3.0, rz: -0.4 }),
        // tall loading doors
        box(1.2, 1.8, 0.1, 0x6a5a4a, { y: 0.9, z: 1.55 }),
        box(1.2, 1.8, 0.1, 0x6a5a4a, { x: 2.0, y: 0.9, z: 1.55 }),
        // water tower on roof
        cyl(0.5, 0.5, 1.0, 6, 0x3a6ea0, { x: -1.5, y: 3.5 }),
        // chimney
        cyl(0.25, 0.2, 1.5, 6, 0x8a7a6a, { x: 1.8, y: 3.5 }),
        // loading dock
        box(4.2, 0.3, 0.8, 0x9a8a78, { y: 0.15, z: 2.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 穀倉群 (Changhua grain silos) -------------------------- */
  {
    id: 'grain_silos',
    displayName: '穀倉群',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8d4cc, 0xc8c4bc, 0x9a968e, 0xf0ece4, 0x6a5a4a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // 彰化穀倉群 (agricultural grain storage silos)
      const parts = [
        // three tall cylindrical silos
        cyl(1.0, 1.0, 3.5, 8, 0xffffff, { x: -1.5, y: 1.75, hex2: 0xd8d4cc }),
        cyl(1.0, 1.0, 3.5, 8, 0xffffff, { x: 0, y: 1.75, hex2: 0xc8c4bc }),
        cyl(1.0, 1.0, 3.5, 8, 0xffffff, { x: 1.5, y: 1.75, hex2: 0xd8d4cc }),
        // conical roofs
        cone(1.1, 0.8, 8, 0x9a968e, { x: -1.5, y: 3.9 }),
        cone(1.1, 0.8, 8, 0x9a968e, { x: 0, y: 3.9 }),
        cone(1.1, 0.8, 8, 0x9a968e, { x: 1.5, y: 3.9 }),
        // connecting walkways between silos
        box(1.2, 0.15, 0.4, 0x8a7a6a, { x: -0.75, y: 2.8 }),
        box(1.2, 0.15, 0.4, 0x8a7a6a, { x: 0.75, y: 2.8 }),
        // base platform
        box(5.0, 0.3, 2.5, 0x9a8a7a, { y: 0.15 }),
        // loading conveyor
        box(0.3, 0.2, 2.0, 0x6a5a4a, { x: 2.2, y: 1.5, z: 0, rx: -0.5 }),
        // small control room
        box(1.2, 1.5, 1.0, 0xc8b8a8, { x: 2.8, y: 0.75 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 養殖場 (Changhua oyster/fish farm) --------------------- */
  {
    id: 'aquaculture_farm',
    displayName: '養殖場',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a8a9a, 0x3a7a8a, 0x5a9aaa, 0x9a8a7a, 0xe0d8c8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 彰化海岸養殖場 (coastal aquaculture farm with ponds)
      const parts = [
        // rectangular fish ponds
        box(3.5, 0.3, 2.5, 0x9a8a7a, { y: 0.15 }), // earthen berm outline
        box(3.2, 0.2, 2.2, 0x4a8a9a, { y: 0.1 }), // water surface (tinted)
        // dividing berms
        box(0.2, 0.35, 2.5, 0x8a7a6a, { x: 0, y: 0.18 }),
        // aerator paddlewheels
        cyl(0.3, 0.3, 0.15, 6, 0x6a6a6a, { rx: HALF_PI, x: -0.8, y: 0.4, z: 0.5 }),
        cyl(0.3, 0.3, 0.15, 6, 0x6a6a6a, { rx: HALF_PI, x: 0.8, y: 0.4, z: -0.5 }),
        // small pump house
        box(0.8, 1.0, 0.8, 0xe0d8c8, { x: -2.0, y: 0.5 }),
        box(0.85, 0.1, 0.85, 0x8a7a6a, { x: -2.0, y: 1.05 }),
        // oyster racks in water (簡化蚵架)
        box(0.08, 0.6, 1.5, 0x6a5a4a, { x: -1.0, y: 0.3, z: 0 }),
        box(0.08, 0.6, 1.5, 0x6a5a4a, { x: 1.0, y: 0.3, z: 0 }),
        // sorting area with baskets
        box(1.2, 0.4, 0.8, 0x9a8a78, { x: 2.2, y: 0.2 }),
        sph(0.25, 0xe8e4dc, { ws: 5, hs: 4, x: 2.0, y: 0.5, sy: 0.6 }),
        sph(0.25, 0xe8e4dc, { ws: 5, hs: 4, x: 2.4, y: 0.5, sy: 0.6 }),
      ];
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
