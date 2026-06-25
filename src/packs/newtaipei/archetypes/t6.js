/**
 * @file packs/newtaipei/archetypes/t6.js — Roll Formosa New Taipei pack, Tier 6.
 *
 * T6 — 淡水天際線 (Tamsui night skyline). The finale band: glass curtain-wall
 * highrises, river bridges, business towers, riverside blocks and rooftop mech rooms
 * lit against the 淡水夜空 deep blue-violet sky. Ten ArchetypeDefs, authored in
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
 * Size band: 60-300 m radiusNominal (Tamsui riverfront skyscraper scale).
 */

import { box, cyl, sph, towerBanded, finish, HALF_PI, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 新板特區大樓 Banqiao special district tower -------------- */
  {
    id: 'banqiao_special_tower',
    displayName: '新板特區大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a6a8a, 0x6a8aaa, 0x8ab0c8, 0xc0d8e8, 0xffd884],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Banqiao Special District style tower — modern mixed-use with retail podium
      return finish([
        // Wide retail podium
        box(1.4, 0.8, 1.2, 0xe8e8ee, { y: 0.4 }),
        box(1.5, 0.1, 1.3, 0x4a6a8a, { y: 0.85 }), // blue trim
        // Main tower shaft
        towerBanded(0.9, 3.0, 0.9, 10, 0x4a6a8a, 0x8ab0c8, 0xffd884, rng, { y: 2.3 }),
        // Crown with New Taipei modern style
        box(0.7, 0.5, 0.7, 0x6a8aaa, { y: 4.05 }),
        box(0.5, 0.3, 0.5, 0xc0d8e8, { y: 4.45 }),
        // Antenna
        cyl(0.04, 0.04, 0.8, 6, 0xd0d6dc, { y: 5.0 }),
        // Ground level entrance
        box(0.8, 0.4, 0.1, 0x9fc4d8, { y: 0.25, z: 0.62 }),
      ]);
    },
  },

  /* ---- slot 1: 淡水河大橋 river bridge ----------------------------------- */
  {
    id: 'river_bridge',
    displayName: '淡水河大橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8b0a4, 0xc8c0b4, 0x4a8ae0, 0xd8d4cc, 0xffd25a],
    yOffset: -0.561,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      // 淡水河大橋 — simplified arch bridge
      const parts = [
        box(4.6, 0.16, 0.9, 0xc4bcb0, { y: 1.2 }), // deck
        cyl(0.2, 0.22, 1.0, 5, 0xb0a89c, { x: -2.0, y: 0.55 }), // pier
        cyl(0.2, 0.22, 1.0, 5, 0xb0a89c, { x: 2.0, y: 0.55 }), // pier
      ];
      // Blue arch (single simplified arch)
      parts.push(box(1.6, 0.14, 0.12, 0x4a8ae0, { rz: 0.4, x: -1.2, y: 2.2, z: 0 }));
      parts.push(box(1.4, 0.14, 0.12, 0x4a8ae0, { x: 0, y: 2.5, z: 0 }));
      parts.push(box(1.6, 0.14, 0.12, 0x4a8ae0, { rz: -0.4, x: 1.2, y: 2.2, z: 0 }));
      // Vertical hangers (3)
      parts.push(cyl(0.06, 0.06, 1.0, 4, 0x4a8ae0, { x: -1.0, y: 1.75, z: 0 }));
      parts.push(cyl(0.06, 0.06, 1.25, 4, 0x4a8ae0, { x: 0, y: 1.88, z: 0 }));
      parts.push(cyl(0.06, 0.06, 1.0, 4, 0x4a8ae0, { x: 1.0, y: 1.75, z: 0 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 中和環球大樓 Zhonghe Global Mall tower ------------------- */
  {
    id: 'zhonghe_global_tower',
    displayName: '中和環球大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a5a6a, 0x6a7a8a, 0x9aaaba, 0xc8d8e8, 0xffd040],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Zhonghe Global Mall style commercial tower — rounded corners, mall base
      return finish([
        // Large mall podium
        box(1.8, 1.2, 1.5, 0xe8e8ee, { y: 0.6 }),
        box(1.9, 0.15, 1.6, 0xffd040, { y: 1.25 }), // yellow trim (Global branding)
        // Curved glass atrium
        cyl(0.8, 0.8, 1.3, 8, 0x9fc4d8, { y: 0.65, z: 0.85, rx: HALF_PI, theta0: -HALF_PI, thetaLen: PI }),
        // Office tower
        towerBanded(1.0, 2.2, 1.0, 8, 0x4a5a6a, 0x9aaaba, 0xffd884, rng, { y: 2.35 }),
        // Crown
        box(0.8, 0.4, 0.8, 0x6a7a8a, { y: 3.65 }),
        cyl(0.04, 0.04, 0.7, 6, 0xc8ccd2, { y: 4.2 }),
        // Rooftop signage
        box(0.6, 0.25, 0.1, 0xffd040, { y: 3.5, z: 0.52 }),
      ]);
    },
  },

  /* ---- slot 3: 淡水老街招牌牆 tamsui_signage_wall ---------------------- */
  {
    id: 'tamsui_signage_wall',
    displayName: '淡水老街招牌牆',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83030, 0xe8a020, 0xf8d848, 0x3a6ea0, 0xf0e8d8],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Tamsui old street commercial building with traditional signage
      const parts = [
        box(2.4, 3.2, 0.9, 0xf0e8d8, { y: 1.7, hex2: 0xe0d8c8 }), // building (cream)
        box(2.5, 0.3, 0.95, 0x3a6ea0, { y: 0.15 }), // blue base
        // Traditional shop signs (vertical banners)
        box(0.4, 2.0, 0.1, 0xc83030, { x: -0.9, y: 2.0, z: 0.52 }),
        box(0.35, 1.8, 0.06, 0xf8d848, { x: -0.9, y: 2.0, z: 0.58 }),
        box(0.4, 2.0, 0.1, 0xe8a020, { x: 0.0, y: 2.2, z: 0.52 }),
        box(0.35, 1.8, 0.06, 0xffffff, { x: 0.0, y: 2.2, z: 0.58 }),
        box(0.4, 2.0, 0.1, 0xc83030, { x: 0.9, y: 1.9, z: 0.52 }),
        box(0.35, 1.8, 0.06, 0xf8d848, { x: 0.9, y: 1.9, z: 0.58 }),
        // Awning
        box(2.6, 0.1, 0.6, 0x3a6ea0, { y: 1.0, z: 0.7 }),
        // Shop windows with warm glow
        box(0.6, 0.7, 0.06, 0xffd868, { x: -0.7, y: 0.6, z: 0.5 }),
        box(0.6, 0.7, 0.06, 0xffd868, { x: 0.7, y: 0.6, z: 0.5 }),
        // Roof tiles
        box(2.5, 0.15, 1.0, 0x6a4030, { y: 3.4 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 板橋車站大樓 banqiao_station_tower --------------------- */
  {
    id: 'banqiao_station_tower',
    displayName: '板橋車站大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x4a5a6a, 0x6a8aa0, 0xa0c8d8, 0xc8d8e4, 0xffd884],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Banqiao Station complex — modern transit tower with retail podium
      return finish([
        // Wide station podium
        box(3.0, 1.0, 2.0, 0xe8e8ee, { y: 0.5 }),
        box(3.1, 0.12, 2.1, 0x3a6ea0, { y: 1.06 }), // blue trim
        // Tower rising from podium
        towerBanded(1.5, 3.2, 1.2, 10, 0x4a5a6a, 0xa0c8d8, 0xffd884, rng, { y: 2.6 }),
        // Station entrance canopy
        box(1.8, 0.1, 1.2, 0x6a8aa0, { y: 0.8, z: 1.2 }),
        cyl(0.08, 0.08, 0.7, 6, 0xc8ccd2, { x: -0.6, y: 0.45, z: 1.4 }),
        cyl(0.08, 0.08, 0.7, 6, 0xc8ccd2, { x: 0.6, y: 0.45, z: 1.4 }),
        // Glass curtain entrance
        box(1.4, 0.6, 0.08, 0x9fc4d8, { y: 0.4, z: 1.05 }),
        // Crown with transit signage
        box(1.6, 0.3, 1.3, 0x6a8aa0, { y: 4.35 }),
        box(0.8, 0.2, 0.1, 0x3a6ea0, { y: 4.2, z: 0.66 }), // sign
        // Antenna mast
        cyl(0.04, 0.04, 0.8, 6, 0xc8ccd2, { y: 4.9 }),
      ]);
    },
  },

  /* ---- slot 5: 林口長庚醫療城 Linkou Chang Gung medical complex --------- */
  {
    id: 'linkou_changgung',
    displayName: '林口長庚醫療城',
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
      // Linkou Chang Gung Medical Center style complex — hospital towers connected
      return finish([
        // Main hospital tower
        towerBanded(1.0, 2.8, 1.0, 9, 0xe8e8ee, 0x6a96b8, 0xffe0a0, rng, { x: -1.2, y: 1.4 }),
        // Secondary tower
        towerBanded(0.8, 2.2, 0.8, 7, 0xe8e8ee, 0x7aa8c8, 0xfff0c0, rng, { x: 1.2, y: 1.1 }),
        // Connecting bridge
        box(1.6, 0.4, 0.5, 0xa0d0e4, { y: 1.8, hex2: 0xc8e4f0 }),
        // Medical cross symbol (simplified)
        box(0.3, 0.5, 0.06, 0xc83030, { x: -1.2, y: 2.5, z: 0.52 }),
        box(0.5, 0.15, 0.06, 0xc83030, { x: -1.2, y: 2.6, z: 0.52 }),
        // Helipad on main tower
        cyl(0.35, 0.35, 0.05, 8, 0x4a5a6a, { x: -1.2, y: 2.88 }),
        box(0.25, 0.02, 0.05, 0xffffff, { x: -1.2, y: 2.92 }),
        box(0.05, 0.02, 0.25, 0xffffff, { x: -1.2, y: 2.92 }),
        // Roof equipment
        box(0.4, 0.15, 0.3, 0x7a8a9a, { x: 1.2, y: 2.35 }),
      ]);
    },
  },

  /* ---- slot 6: 新莊副都心大樓 xinzhuang_tower ------------------------- */
  {
    id: 'xinzhuang_tower',
    displayName: '新莊副都心大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a6080, 0x6a8aa8, 0xa0c0d8, 0xc8d8e8, 0xffd884],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Xinzhuang Fuduxin office tower — modern glass tower
      const parts = [
        // Base podium
        box(2.6, 1.2, 2.0, 0xe8e8ee, { y: 0.6 }),
        box(2.7, 0.1, 2.1, 0x4a6080, { y: 1.25 }), // trim
        // Glass tower shaft
        towerBanded(1.6, 2.4, 1.4, 8, 0x4a6080, 0xa0c0d8, 0xffd884, rng, { y: 2.45 }),
        // Crown setback
        box(1.2, 0.4, 1.0, 0x6a8aa8, { y: 3.85 }),
        // Rooftop equipment
        box(0.5, 0.3, 0.4, 0x7a8a9a, { x: 0.3, y: 4.2 }),
        cyl(0.15, 0.15, 0.3, 6, 0x9aa8b8, { x: -0.3, y: 4.2 }),
        // Antenna
        cyl(0.04, 0.04, 0.6, 6, 0xc8ccd2, { y: 4.6 }),
        // Ground entrance
        box(1.0, 0.6, 0.1, 0x9fc4d8, { y: 0.35, z: 1.02 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 汐止科學園區大樓 Xizhi Science Park tower ---------------- */
  {
    id: 'xizhi_scipark_tower',
    displayName: '汐止科學園區大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a5a7a, 0x5a7a9a, 0x8ab0c8, 0xc8e0f0, 0xffd884],
    yOffset: -0.308,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Xizhi Science Park style tech campus tower
      const parts = [
        // Large campus base with green landscaping
        box(3.5, 0.2, 1.8, 0x4a8a5a, { y: 0.1 }), // green landscaping base
        box(3.0, 0.15, 1.5, 0xe8e8ee, { y: 0.22 }), // plaza
      ];
      // Twin office towers (tech park style)
      parts.push(towerBanded(0.9, 2.6, 0.8, 8, 0x3a5a7a, 0x8ab0c8, 0xffd884, rng, { x: -0.9, y: 1.6 }));
      parts.push(towerBanded(0.9, 3.0, 0.8, 9, 0x3a5a7a, 0x9ac0d8, 0xffe0a0, rng, { x: 0.9, y: 1.8 }));
      // Modern glass lobby
      box(2.2, 0.8, 0.5, 0x9fc4d8, { y: 0.7, z: 0.65, hex2: 0xc8e0f0 });
      // Rooftop equipment
      parts.push(box(0.4, 0.2, 0.3, 0x6a7a8a, { x: -0.9, y: 2.95 }));
      parts.push(box(0.5, 0.25, 0.4, 0x5a6a7a, { x: 0.9, y: 3.35 }));
      // Antenna mast
      parts.push(cyl(0.04, 0.04, 0.6, 6, 0xc8ccd2, { x: 0.9, y: 3.8 }));
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
      // two big mixed-use blocks — New Taipei's commercial district air-corridor.
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
      // rooftop mech stack that tops New Taipei's tallest service towers.
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
