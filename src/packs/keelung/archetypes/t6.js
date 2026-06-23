/**
 * @file packs/keelung/archetypes/t6.js — Roll Formosa Keelung pack, Tier 6.
 *
 * T6 — 基隆海港天際線 (Keelung harbor night skyline). The finale band: glass
 * curtain-wall highrises, cruise terminal, gantry cranes and harbor blocks
 * lit against the 海港夜空 deep blue-violet sky. Ten ArchetypeDefs, authored in
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
 * Size band: 60-300 m radiusNominal (harbor skyscraper scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

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

  /* ---- slot 1: 郵輪碼頭 cruise_terminal --------------------------------- */
  {
    id: 'cruise_terminal',
    displayName: '郵輪碼頭',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e8ee, 0x2f6db0, 0x8a9aa8, 0xffd84d, 0x3a8080],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Keelung's iconic cruise terminal - long modern building with wave-like roof
      const parts = [
        // main terminal building - long and low
        box(5.0, 1.2, 2.4, 0xe8e8ee, { y: 0.6, hex2: 0xd8d8de }),
        // wave-form roof (multiple curved segments)
        cyl(1.3, 1.3, 5.2, 4, 0x8a9aa8, { theta0: PI, rx: HALF_PI, sy: 0.35, y: 1.55 }),
        // glass curtain wall front
        box(4.8, 0.9, 0.08, 0x4a8aa8, { y: 0.65, z: 1.22 }),
        // entrance canopy
        box(2.0, 0.12, 1.0, 0x2f6db0, { y: 1.3, z: 1.7 }),
        cyl(0.08, 0.08, 1.2, 6, 0x6a7a8a, { x: -0.8, y: 0.7, z: 1.7 }),
        cyl(0.08, 0.08, 1.2, 6, 0x6a7a8a, { x: 0.8, y: 0.7, z: 1.7 }),
      ];
      // boarding bridges extending toward water
      parts.push(box(0.8, 0.5, 1.5, 0x7a8a98, { x: -1.5, y: 0.55, z: -1.95 }));
      parts.push(box(0.8, 0.5, 1.5, 0x7a8a98, { x: 1.5, y: 0.55, z: -1.95 }));
      // terminal signage
      parts.push(box(1.5, 0.4, 0.06, 0x2f6db0, { y: 1.5, z: 1.22 }));
      parts.push(box(1.3, 0.25, 0.04, 0xffd84d, { y: 1.5, z: 1.26 }));
      // flagpoles
      parts.push(cyl(0.04, 0.04, 1.4, 6, 0x8a9098, { x: -2.2, y: 1.9, z: 1.4 }));
      parts.push(cyl(0.04, 0.04, 1.4, 6, 0x8a9098, { x: 2.2, y: 1.9, z: 1.4 }));
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
      // Tapered three-tier office tower with a slim antenna — a generic harbor peer.
      return finish([
        towerBanded(1.25, 1.9, 1.25, 6, 0x46566c, 0x8a96a8, 0xffd884, rng, { y: 0.95 }), // base block
        towerBanded(0.95, 1.5, 0.95, 5, 0x4c5e76, 0x96a2b4, 0xffe0a0, rng, { y: 2.65 }), // mid block (setback)
        towerBanded(0.68, 1.1, 0.68, 4, 0x546880, 0xa4b0c2, 0xffe6ac, rng, { y: 3.95 }), // upper block (setback)
        box(0.5, 0.18, 0.5, 0x7a8494, { y: 4.6 }), // crown cap
        cyl(0.035, 0.035, 0.9, 6, 0xcdd4dc, { y: 5.15 }), // antenna
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
    palette: [0x2c3140, 0x2f6db0, 0x3a8080, 0xffd23d, 0xf0f2f6],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // A building face turned into a giant LED billboard wall - harbor/maritime theme
      const panel = [0x2f6db0, 0x3a8080, 0xffd23d, 0xe8e8ee, 0xff8a3d];
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

  /* ---- slot 4: 港務大樓 harbor_tower ----------------------------------- */
  {
    id: 'harbor_tower',
    displayName: '港務大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x3a5a70, 0x5a8aa8, 0x8ab8d0, 0xc8d4dc, 0xffd884],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Harbor authority tower - blue-glass maritime feel
      return finish([
        box(2.4, 0.55, 1.6, 0x9aa8b4, { y: 0.28, hex2: 0xb8c0c8 }), // stone podium
        towerBanded(1.9, 2.9, 1.0, 9, 0x3a5a70, 0x8ab8d0, 0xffd884, rng, { y: 2.0 }), // glass slab - maritime blue
        box(2.0, 0.1, 1.06, 0x6a8a9a, { y: 1.45 }), // accent band
        box(2.0, 0.1, 1.06, 0x6a8a9a, { y: 2.55 }), // accent band
        box(2.0, 0.1, 1.06, 0x6a8a9a, { y: 3.45 }), // accent band
        box(1.4, 0.2, 0.7, 0x5a7a8a, { y: 3.6 }), // rooftop parapet box
        box(0.55, 0.28, 0.55, 0x6a8a98, { x: 0.5, y: 3.84 }), // rooftop equipment
        // Maritime flag pole
        cyl(0.04, 0.04, 0.8, 6, 0x8a9098, { x: -0.6, y: 4.0 }),
      ]);
    },
  },

  /* ---- slot 5: 龍門吊 gantry_crane ------------------------------------ */
  {
    id: 'gantry_crane',
    displayName: '龍門吊',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc94f46, 0xe06050, 0xffd84d, 0x3a3e46, 0xe8e8ee],
    yOffset: -0.36,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Container gantry crane - iconic harbor silhouette
      const parts = [];
      // Four legs (A-frame stance)
      parts.push(box(0.3, 3.5, 0.3, 0xc94f46, { x: -1.3, y: 1.75, z: 0.8, rz: -0.08 }));
      parts.push(box(0.3, 3.5, 0.3, 0xc94f46, { x: -1.3, y: 1.75, z: -0.8, rz: -0.08 }));
      parts.push(box(0.3, 3.5, 0.3, 0xc94f46, { x: 1.3, y: 1.75, z: 0.8, rz: 0.08 }));
      parts.push(box(0.3, 3.5, 0.3, 0xc94f46, { x: 1.3, y: 1.75, z: -0.8, rz: 0.08 }));
      // Cross beams at top
      parts.push(box(3.0, 0.4, 0.3, 0xe06050, { y: 3.6, z: 0.8 }));
      parts.push(box(3.0, 0.4, 0.3, 0xe06050, { y: 3.6, z: -0.8 }));
      parts.push(box(0.3, 0.4, 1.9, 0xe06050, { x: -1.2, y: 3.6 }));
      parts.push(box(0.3, 0.4, 1.9, 0xe06050, { x: 1.2, y: 3.6 }));
      // Main boom (extending outward)
      parts.push(box(4.5, 0.3, 0.8, 0xc94f46, { x: 0.8, y: 3.9 }));
      // Trolley on boom
      parts.push(box(0.5, 0.25, 0.6, 0xffd84d, { x: 1.8, y: 3.65 }));
      // Spreader/hook hanging down
      parts.push(cyl(0.03, 0.03, 1.0, 6, 0x3a3e46, { x: 1.8, y: 3.1 }));
      parts.push(box(0.8, 0.15, 0.4, 0xffd84d, { x: 1.8, y: 2.6 }));
      // Operator cabin
      parts.push(box(0.6, 0.5, 0.5, 0xe8e8ee, { x: -0.8, y: 3.3 }));
      parts.push(box(0.5, 0.35, 0.06, 0x3a5a6a, { x: -0.8, y: 3.35, z: 0.28 })); // cabin window
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

  /* ---- slot 7: 海港大樓 harbor_block ---------------------------------- */
  {
    id: 'harbor_block',
    displayName: '海港大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x36405a, 0x4a5670, 0x6a8aa0, 0xb0bccc, 0xffd884],
    yOffset: -0.308,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // A whole stretch of harbor skyline: staggered lit towers of varying heights
      const parts = [box(3.6, 0.16, 1.4, 0x2a3142, { y: 0.08 })]; // ground / wharf slab
      const hs = [2.4, 3.4, 1.8, 2.9, 2.2];
      const floorsArr = [6, 8, 5, 7, 6];
      const wallHex = [0x36405a, 0x3e4a64, 0x3a5a6a, 0x3a4660, 0x4a5a70]; // cooler harbor tones
      for (let i = 0; i < 5; i++) {
        const h = hs[i];
        const x = -1.4 + i * 0.7;
        parts.push(
          towerBanded(0.56, h, 0.78, floorsArr[i], wallHex[i], 0x6a8aa0, 0xffd884, rng, {
            x, y: 0.16 + h / 2, z: (i % 2) * 0.18 - 0.09,
          }) // skyline tower
        );
        // small rooftop cap so silhouettes vary
        parts.push(box(0.3, 0.16, 0.3, 0x5a7488, { x, y: 0.16 + h + 0.06, z: (i % 2) * 0.18 - 0.09 }));
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
      // two big mixed-use blocks — harbor-district air-corridor.
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
      // rooftop mech stack that tops Keelung's tallest service towers.
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
