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

import { box, cyl, sph, towerBanded, finish } from '../geomHelpers.js';

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
      // Slender all-glass slab with a stepped glass crown and a vertical mullion seam.
      return finish([
        towerBanded(0.95, 3.4, 0.95, 12, 0x2a4868, 0x6aa8c8, 0xffe08a, rng, { y: 1.7 }), // glass shaft (cool blue + lit windows)
        towerBanded(0.78, 0.9, 0.78, 4, 0x32567a, 0x7ab8d4, 0xffe6a0, rng, { y: 3.85 }), // setback crown box
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: 0.5, y: 1.7, z: 0.5 }), // corner mullion glint
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: -0.5, y: 1.7, z: 0.5 }), // corner mullion glint
        cyl(0.05, 0.05, 0.7, 6, 0xd0d6dc, { y: 4.6 }), // rooftop mast
        box(0.4, 0.14, 0.4, 0x556270, { y: 4.32 }), // mast base plinth
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

  /* ---- slot 2: 其他摩天樓 other skyscraper --------------------------- */
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
      // Tapered three-tier office tower with a slim antenna — a generic New Taipei peer.
      return finish([
        towerBanded(1.25, 1.9, 1.25, 6, 0x46566c, 0x8a96a8, 0xffd884, rng, { y: 0.95 }), // base block
        towerBanded(0.95, 1.5, 0.95, 5, 0x4c5e76, 0x96a2b4, 0xffe0a0, rng, { y: 2.65 }), // mid block (setback)
        towerBanded(0.68, 1.1, 0.68, 4, 0x546880, 0xa4b0c2, 0xffe6ac, rng, { y: 3.95 }), // upper block (setback)
        box(0.5, 0.18, 0.5, 0x7a8494, { y: 4.6 }), // crown cap
        cyl(0.035, 0.035, 0.9, 6, 0xcdd4dc, { y: 5.15 }), // antenna
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

  /* ---- slot 7: 河岸大樓 riverside block -------------------------------- */
  {
    id: 'riverside_block',
    displayName: '河岸大樓',
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
      // 淡水河岸大樓 — simplified riverside development
      const parts = [
        box(3.5, 0.16, 1.5, 0x2a3142, { y: 0.08 }), // ground slab
      ];
      // Two simplified towers
      parts.push(box(1.0, 2.8, 0.8, 0x36405a, { x: -0.8, y: 1.5, z: 0.2, hex2: 0x4a5670 }));
      parts.push(box(1.0, 3.4, 0.8, 0x3e4a64, { x: 0.8, y: 1.8, z: 0.2, hex2: 0x4a5670 }));
      // Rooftop caps
      parts.push(box(0.4, 0.12, 0.4, 0x6a7488, { x: -0.8, y: 2.96 }));
      parts.push(box(0.4, 0.12, 0.4, 0x6a7488, { x: 0.8, y: 3.56 }));
      // Riverside edge
      parts.push(box(3.2, 0.06, 0.1, 0x6080a0, { y: 0.14, z: -0.75 }));
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
