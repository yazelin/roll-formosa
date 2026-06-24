/**
 * @file packs/taichung/archetypes/t6.js — Roll Formosa Taichung pack, Tier 6.
 *
 * T6 — 七期天際線 (Xitun 7th-Redevelopment-Zone skyline). The finale band:
 * glass curtain-wall highrises, cross-street skybridges and rooftop mech rooms
 * lit against the deep blue-violet night, with two 台中-flavoured swaps — the
 * 七期商辦塔 (glossy corner-cut office tower) and the 七期豪宅塔 (slim luxury
 * residential tower with stacked balcony bands), the silhouettes that define the
 * 七期 luxury-tower district. Ten ArchetypeDefs, authored in the FROZEN tier
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
 * Size band: 60-300 m radiusNominal (七期 skyscraper scale).
 */

import { box, cyl, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

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

  /* ---- slot 1: 跨橋 cross bridge -------------------------------------- */
  {
    id: 'cross_bridge',
    displayName: '跨橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8b0a4, 0xc8c0b4, 0xe05a4a, 0xd8d4cc, 0xffd25a],
    yOffset: -0.561,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      // Cable-stayed road bridge: two A-pylons, a long deck, fanned stay cables.
      const parts = [
        box(4.2, 0.16, 0.9, 0xc4bcb0, { y: 1.2 }), // deck (concrete)
        box(4.2, 0.1, 0.06, 0x9a9288, { y: 1.32, z: 0.42 }), // parapet rail near
        box(4.2, 0.1, 0.06, 0x9a9288, { y: 1.32, z: -0.42 }), // parapet rail far
        cyl(0.16, 0.2, 1.1, 6, 0xb0a89c, { x: -3.0, y: 0.55 }), // approach pier
        cyl(0.16, 0.2, 1.1, 6, 0xb0a89c, { x: 3.0, y: 0.55 }), // approach pier
      ];
      // Two A-frame pylons rising from the deck.
      for (const px of [-1.1, 1.1]) {
        parts.push(cyl(0.1, 0.13, 1.9, 6, 0xe05a4a, { rz: 0.13, x: px - 0.18, y: 2.15 })); // pylon leg
        parts.push(cyl(0.1, 0.13, 1.9, 6, 0xe05a4a, { rz: -0.13, x: px + 0.18, y: 2.15 })); // pylon leg
        parts.push(box(0.5, 0.12, 0.16, 0xe05a4a, { x: px, y: 2.7 })); // pylon crossbeam
        // fanned stay cables both directions
        for (let i = 0; i < 3; i++) {
          const span = 0.55 + i * 0.55;
          const len = Math.hypot(span, 1.65);
          const ang = Math.atan2(span, 1.65);
          parts.push(box(0.025, len, 0.025, 0xe8e2d6, { rz: ang, x: px - span / 2, y: 2.1 })); // cable left
          parts.push(box(0.025, len, 0.025, 0xe8e2d6, { rz: -ang, x: px + span / 2, y: 2.1 })); // cable right
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 七期商辦塔 Xitun office tower (台中 swap) ---------------- */
  {
    id: 'xitun_office_tower',
    displayName: '七期商辦塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2e4a66, 0x3e6488, 0x6aa0c4, 0xbfe2f0, 0xffe0a0],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A glossy curtain-wall office tower with a chamfered corner and a brightly
      // lit double-height sky-lobby band — the polished 七期 商辦 silhouette.
      return finish([
        towerBanded(1.2, 4.0, 1.2, 14, 0x2a4460, 0x6aa0c4, 0xffe0a0, rng, { y: 2.0 }), // main glass shaft
        cyl(0.62, 0.62, 4.0, 4, 0x356088, 0x8ec4e0, { y: 2.0, ry: 0.785 }), // chamfered glossy corner column (4-seg = diamond)
        box(1.32, 0.34, 1.32, 0xffe6a0, { y: 2.55 }), // lit sky-lobby band (mid)
        box(1.26, 0.16, 1.26, 0x4a6e90, { y: 3.95 }), // upper transfer-floor band
        box(0.9, 0.5, 0.9, 0x2e5070, { y: 4.3, hex2: 0x6aa0c4 }), // glass crown box
        box(0.46, 0.16, 0.46, 0x9aa6b4, { y: 4.63 }), // crown cap
        cyl(0.03, 0.03, 0.85, 6, 0xcdd4dc, { y: 5.1 }), // slim antenna
      ]);
    },
  },

  /* ---- slot 3: 巨型廣告牆 giant ad wall ------------------------------- */
  {
    id: 'giant_ad_wall',
    displayName: '巨型廣告牆',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2c3140, 0xff3d6e, 0x37c8e0, 0xffd23d, 0xf0f2f6],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // A building face turned into a giant LED billboard wall: bright color panels.
      const panel = [0xff3d6e, 0x37c8e0, 0xffd23d, 0x6ae060, 0xff8a3d];
      const parts = [
        box(2.4, 3.2, 0.9, 0x23272f, { y: 1.7, hex2: 0x2c3140 }), // host building (dark)
        box(2.55, 2.6, 0.12, 0x10131a, { y: 2.0, z: 0.5 }), // billboard backing frame
      ];
      // 3 x 4 grid of glowing LED panels on the front face
      for (let gx = 0; gx < 3; gx++) {
        for (let gy = 0; gy < 4; gy++) {
          const c = panel[(gx * 4 + gy + (rng() < 0.4 ? 1 : 0)) % panel.length];
          parts.push(box(0.66, 0.5, 0.06, c, { x: -0.72 + gx * 0.72, y: 1.15 + gy * 0.6, z: 0.58 })); // LED panel
        }
      }
      parts.push(box(2.6, 0.1, 0.16, 0x55606e, { y: 0.5, z: 0.5 })); // ground catwalk
      return finish(parts);
    },
  },

  /* ---- slot 4: 七期豪宅塔 Xitun luxury residential tower (台中 swap) --- */
  {
    id: 'xitun_luxury_tower',
    displayName: '七期豪宅塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x3a4a5e, 0x556d86, 0x88aac4, 0xd6c79a, 0xffe6b0],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Slim luxury residential tower: a landscaped granite podium, a glass shaft
      // ringed by stacked balcony slabs, and a sculpted glass crown — the 七期
      // 豪宅 look (think 寶輝/聯聚-style towers without naming a real one).
      const parts = [
        box(1.7, 0.5, 1.7, 0xc8c2b6, { y: 0.25, hex2: 0xd6d0c4 }), // landscaped granite podium
        box(1.86, 0.12, 1.86, 0x8a9488, { y: 0.5 }), // podium garden rim (planters)
        towerBanded(1.0, 3.6, 1.0, 12, 0x344458, 0x88aac4, 0xffe6b0, rng, { y: 2.4 }), // residential glass shaft
      ];
      // stacked cantilevered balcony slabs every ~3 floors (warm stone tone)
      for (let i = 0; i < 5; i++) {
        const by = 1.05 + i * 0.66;
        parts.push(box(1.22, 0.07, 1.22, 0xd6c79a, { y: by })); // balcony slab
        parts.push(box(1.22, 0.16, 0.04, 0xb6a880, { y: by + 0.1, z: 0.61 })); // balcony glass rail (front)
      }
      parts.push(box(0.86, 0.6, 0.86, 0x3a5670, { y: 4.4, hex2: 0x9fd0e4 })); // sculpted glass crown
      parts.push(box(0.5, 0.18, 0.5, 0x7e8a98, { y: 4.78 })); // rooftop sky-pool / mech cap
      return finish(parts);
    },
  },

  /* ---- slot 5: 台中車站 taichung_station_bldg (TAICHUNG SWAP: Taichung Station)*/
  {
    id: 'taichung_station_bldg',
    displayName: '台中車站',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 95,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8dcc8, 0xc4b8a0, 0x9a8e72, 0x8a3a2a, 0x2a55a8],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // 台中車站舊站 — the historic red-brick Baroque Revival station (1917)
      // with its iconic gable front and clock tower (now a heritage landmark).
      const brick = 0xb05a3a; // warm red brick
      const cream = 0xe8dcc8; // plaster band
      const parts = [
        // main station hall — wide brick block
        box(3.6, 1.8, 2.0, brick, { y: 0.9, hex2: 0xc06a46 }),
        // cream plaster banding at eave level
        box(3.7, 0.2, 2.06, cream, { y: 1.88 }),
        // central gable pediment (the iconic triangular front)
        box(1.6, 0.1, 0.9, brick, { y: 2.4, z: 1.0, rx: 0.35 }), // gable slope R
        box(1.6, 0.1, 0.9, brick, { y: 2.4, z: 1.0, rx: -0.35 }), // gable slope L
        box(1.5, 0.8, 0.12, cream, { y: 2.4, z: 1.02 }), // pediment face
        box(1.3, 0.16, 0.06, 0x2a55a8, { y: 2.45, z: 1.06 }), // name plaque
        // arched entrance colonnade (3 arched bays)
        box(2.4, 1.3, 0.4, brick, { y: 0.85, z: 1.15 }),
      ];
      // three entrance arches
      for (let i = 0; i < 3; i++) {
        const ax = -0.7 + i * 0.7;
        parts.push(box(0.5, 0.9, 0.14, 0x2a1c14, { x: ax, y: 0.65, z: 1.35 })); // arch openings
        parts.push(cyl(0.25, 0.25, 0.14, 6, 0x2a1c14, { x: ax, y: 1.1, z: 1.35 })); // arch top
      }
      // twin flanking wings
      parts.push(box(1.1, 1.5, 1.4, brick, { x: -2.15, y: 0.75, hex2: 0xa85040 }));
      parts.push(box(1.1, 1.5, 1.4, brick, { x: 2.15, y: 0.75, hex2: 0xa85040 }));
      // central clock tower (台中車站的鐘樓)
      parts.push(box(0.7, 0.8, 0.7, brick, { y: 2.8, z: 0.8 }));
      parts.push(cyl(0.26, 0.26, 0.1, 10, cream, { y: 3.1, z: 0.8 })); // clock face
      parts.push(cyl(0.2, 0.2, 0.08, 8, 0x2a2c30, { y: 3.12, z: 0.82 })); // clock dial
      // pyramid roof cap on tower
      parts.push(box(0.9, 0.1, 0.9, 0x8a3a2a, { y: 3.26, z: 0.8 })); // tower eave
      parts.push(cyl(0.5, 0.0, 0.6, 4, 0x8a3a2a, { y: 3.6, z: 0.8, ry: 0.785 })); // pyramid cap
      return finish(parts);
    },
  },

  /* ---- slot 6: 台中歌劇院 opera_house_bldg (TAICHUNG SWAP: NTT Opera House) */
  {
    id: 'opera_house_bldg',
    displayName: '台中歌劇院',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 80,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0ebe2, 0xe8e0d0, 0xc4b8a0, 0x2a4868, 0x88c8e0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 臺中國家歌劇院 (NTT) — Toyo Ito's organic "Sound Cave" building:
      // a flowing white sculpted shell with curved cave-like apertures.
      const shell = 0xf0ebe2; // white curved shell
      const parts = [
        // main organic mass — simplified as stacked curving boxes
        box(3.2, 2.0, 2.4, shell, { y: 1.1, hex2: 0xe8e0d0 }),
        box(2.8, 1.6, 2.0, shell, { y: 2.7 }),
        box(2.4, 1.0, 1.6, shell, { y: 3.8 }),
        // the curved cave openings / 洞窟入口 (simplified as dark recesses)
        cyl(0.5, 0.5, 0.3, 8, 0x2a4868, { y: 0.8, z: 1.22, rx: HALF_PI }), // ground entrance
        cyl(0.4, 0.4, 0.28, 8, 0x2a4868, { x: 1.1, y: 1.5, rx: HALF_PI, rz: 0.2 }),
        cyl(0.35, 0.35, 0.26, 8, 0x2a4868, { x: -1.0, y: 2.0, rx: HALF_PI, rz: -0.15 }),
        // rooftop garden terrace (the famous public roof garden)
        box(2.0, 0.16, 1.4, 0x88c8e0, { y: 4.3 }), // sky pool / terrace
        // soft curved roof edge (the flowing organic silhouette)
        cyl(1.3, 1.3, 2.5, 6, shell, { y: 3.6, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // reflecting pool in front
        box(3.0, 0.08, 1.0, 0x88c8e0, { y: 0.06, z: 1.8, hex2: 0xaae0f0 }),
        // ground plaza
        box(3.8, 0.1, 3.2, 0xc4b8a0, { y: 0.05 }),
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
      // two big mixed-use blocks — a 七期 air-corridor between luxury towers.
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
      // rooftop mech stack that tops 七期's tallest service towers.
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
