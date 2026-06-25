/**
 * @file packs/miaoli/archetypes/t6.js — Roll Formosa Miaoli pack, Tier 6.
 *
 * T6 — 龍騰斷橋天際線 (Longteng Bridge skyline). The finale band: the iconic
 * ruined brick arches of Longteng Bridge rising against the 舊山線 mountain
 * night sky, surrounded by glass highrises, railway viaducts, skybridges and
 * rooftop mech rooms lit against the deep blue-violet Miaoli dusk.
 * Ten ArchetypeDefs, authored in the FROZEN tier order (tiers.js T6.archetypeIds)
 * — slots [0..7] absorbable, slots [8..9] repeatable chunk landmarks (lower
 * spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (Miaoli skyline scale).
 */

import { box, cyl, sph, towerBanded, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 龍騰斷橋拱門 Longteng Bridge ruined brick arch ----------- */
  {
    id: 'longteng_arch',
    displayName: '龍騰斷橋拱門',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8443a, 0xa03a30, 0xc85848, 0x8a6a4a, 0x6a4a32],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Iconic ruined brick arches of Longteng Bridge (龍騰斷橋) — the 1935
      // earthquake left dramatic standalone piers. Multiple brick piers with
      // semicircular arch remnants against the mountain dusk.
      const parts = [];
      // Four massive brick piers (some intact, some broken)
      const piers = [-2.2, -0.8, 0.8, 2.2];
      const heights = [3.8, 4.2, 3.5, 3.0]; // varying heights (ruined)
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // brick pier body
        parts.push(box(0.7, h, 0.9, 0xb8443a, { x: piers[i], y: h / 2, hex2: 0xa03a30 }));
        // pier cap (those still intact)
        if (i < 3) parts.push(box(0.78, 0.18, 0.98, 0x8a5a40, { x: piers[i], y: h + 0.09 }));
        // rugged brick detail bands
        parts.push(box(0.72, 0.12, 0.92, 0x9a4a38, { x: piers[i], y: h * 0.3 }));
        parts.push(box(0.72, 0.12, 0.92, 0x9a4a38, { x: piers[i], y: h * 0.6 }));
      }
      // Surviving arch segments between some piers (half-cylinder arches)
      parts.push(cyl(0.65, 0.65, 0.85, 8, 0xb8443a, {
        x: -1.5, y: 3.0, rx: HALF_PI, thetaLen: Math.PI, theta0: 0,
      }));
      parts.push(cyl(0.55, 0.55, 0.85, 8, 0xa03a30, {
        x: 0.0, y: 2.8, rx: HALF_PI, thetaLen: Math.PI * 0.7, theta0: 0.3,
      })); // partial arch
      // Ground rubble / foundation stones
      parts.push(box(5.5, 0.3, 1.4, 0x7a6a58, { y: 0.15 }));
      // Vegetation creeping on ruins
      parts.push(sph(0.25, 0x3a6a3a, { ws: 5, hs: 3, x: -2.2, y: 3.9, z: 0.3 }));
      parts.push(sph(0.2, 0x4a7a4a, { ws: 5, hs: 3, x: 0.8, y: 3.6, z: -0.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 勝興月台 shenxing_platform (heritage station platform) ---- */
  {
    id: 'shenxing_platform',
    displayName: '勝興月台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0xc8b090, 0x5a4a3a, 0xe8e0d0, 0xb04030],
    yOffset: -0.54,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Shenxing Station platform (勝興車站月台) — the heritage railway
      // platform with wooden awning and historic signage, Taiwan's highest
      // railway station on the Old Mountain Line.
      const parts = [
        // long concrete platform
        box(6.0, 0.4, 1.8, 0x9a8a78, { y: 0.2 }),
        // yellow safety edge stripe
        box(6.0, 0.42, 0.15, 0xffd84d, { y: 0.22, z: 0.88 }),
        // wooden platform awning structure
        box(5.5, 0.1, 1.5, 0x8a7a68, { y: 2.2 }),
        // awning support posts (wooden)
        cyl(0.12, 0.12, 2.0, 6, 0x6a4a32, { x: -2.2, y: 1.2, z: 0.6 }),
        cyl(0.12, 0.12, 2.0, 6, 0x6a4a32, { x: 0, y: 1.2, z: 0.6 }),
        cyl(0.12, 0.12, 2.0, 6, 0x6a4a32, { x: 2.2, y: 1.2, z: 0.6 }),
        cyl(0.12, 0.12, 2.0, 6, 0x6a4a32, { x: -2.2, y: 1.2, z: -0.6 }),
        cyl(0.12, 0.12, 2.0, 6, 0x6a4a32, { x: 2.2, y: 1.2, z: -0.6 }),
        // station name sign board
        box(1.6, 0.6, 0.08, 0xe8e0d0, { y: 1.8, z: 0.72 }),
        box(1.4, 0.4, 0.04, 0x5a4a3a, { y: 1.8, z: 0.76 }), // text area
        // red accent on sign
        box(1.6, 0.08, 0.1, 0xb04030, { y: 2.02, z: 0.72 }),
        // wooden benches on platform
        box(1.0, 0.35, 0.4, 0x9a7a4a, { x: -1.5, y: 0.58, z: -0.4 }),
        box(1.0, 0.35, 0.4, 0x9a7a4a, { x: 1.5, y: 0.58, z: -0.4 }),
        // rail track alongside platform
        box(6.2, 0.08, 0.1, 0x5a5a5a, { y: 0.04, z: 1.4 }),
        box(6.2, 0.08, 0.1, 0x5a5a5a, { y: 0.04, z: 1.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 木雕工廠 woodcarving factory ------------------------------ */
  {
    id: 'woodcarving_factory',
    displayName: '木雕工廠',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0x6a4a2a, 0xa08050, 0xc8a870, 0x5a3a1a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Large Sanyi woodcarving factory/workshop complex — the heart of
      // Miaoli's famed wood sculpture industry. Multiple connected sheds
      // with traditional wood construction and carving displays.
      const parts = [];
      // Main factory hall (large wood-frame structure)
      parts.push(box(4.2, 2.8, 3.0, 0xffffff, { y: 1.4, hex2: 0xf0e8d8 }));
      // Gabled roof with wide eaves
      parts.push(box(4.6, 0.15, 1.7, 0x6a4a32, { y: 2.95, z: 0.85, rx: 0.25 }));
      parts.push(box(4.6, 0.15, 1.7, 0x6a4a32, { y: 2.95, z: -0.85, rx: -0.25 }));
      parts.push(box(4.6, 0.18, 0.2, 0x5a3a1a, { y: 3.2 })); // ridge
      // Side workshop wing
      parts.push(box(2.0, 2.2, 2.4, 0xffffff, { x: 2.8, y: 1.1, hex2: 0xe8dcc8 }));
      parts.push(box(2.2, 0.12, 2.6, 0x7a5a40, { x: 2.8, y: 2.28 })); // flat roof
      // Dark wood structural beams
      parts.push(box(0.18, 2.8, 0.18, 0x5a3a1a, { x: -1.9, y: 1.4, z: 1.4 }));
      parts.push(box(0.18, 2.8, 0.18, 0x5a3a1a, { x: 1.9, y: 1.4, z: 1.4 }));
      parts.push(box(0.18, 2.8, 0.18, 0x5a3a1a, { x: -1.9, y: 1.4, z: -1.4 }));
      parts.push(box(0.18, 2.8, 0.18, 0x5a3a1a, { x: 1.9, y: 1.4, z: -1.4 }));
      // Display area with large wood sculptures outside
      parts.push(box(3.0, 0.2, 1.5, 0xa09080, { x: 0, y: 0.1, z: 2.0 })); // platform
      // Giant wood elephant sculpture (三義 signature piece)
      parts.push(sph(0.5, 0x8a6a3a, { ws: 6, hs: 4, x: -0.5, y: 0.7, z: 2.0 })); // body
      parts.push(sph(0.3, 0x7a5a30, { ws: 5, hs: 3, x: -0.9, y: 0.85, z: 2.0 })); // head
      parts.push(cyl(0.08, 0.04, 0.5, 5, 0x6a4a2a, { x: -1.15, y: 0.5, z: 2.0, rz: 0.5 })); // trunk
      // Buddha figure
      parts.push(cyl(0.25, 0.3, 0.6, 6, 0xa08050, { x: 0.6, y: 0.5, z: 2.0 }));
      parts.push(sph(0.2, 0xa08050, { ws: 5, hs: 3, x: 0.6, y: 0.95, z: 2.0 }));
      // Signage
      parts.push(box(1.8, 0.5, 0.1, 0xc8a870, { y: 2.6, z: 1.52 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 客家聚落 Hakka village cluster ---------------------------- */
  {
    id: 'hakka_village_cluster',
    displayName: '客家聚落',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xe6d4b8, 0x8a7a5a, 0xb04030, 0x6a4a32],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Traditional Hakka village compound (客家聚落) — multiple connected
      // 夥房 structures typical of rural Miaoli, with central ancestral hall.
      const parts = [];
      // Central ancestral hall (正廳) — the largest building
      parts.push(box(2.0, 2.0, 2.0, 0xffffff, { y: 1.0, hex2: 0xf0e8d8 }));
      // Hip roof with sweeping eaves
      parts.push(cyl(1.4, 1.4, 2.4, 4, 0x6a4a32, { theta0: Math.PI, rx: HALF_PI, sy: 0.5, y: 2.3 }));
      parts.push(box(2.5, 0.15, 0.2, 0xb04030, { y: 2.6 })); // red ridge
      // Left wing house
      parts.push(box(1.6, 1.5, 1.6, 0xffffff, { x: -1.9, y: 0.75, hex2: 0xf0e8d8 }));
      parts.push(box(1.8, 0.12, 1.8, 0x7a5a40, { x: -1.9, y: 1.56 }));
      // Right wing house
      parts.push(box(1.6, 1.5, 1.6, 0xffffff, { x: 1.9, y: 0.75, hex2: 0xf0e8d8 }));
      parts.push(box(1.8, 0.12, 1.8, 0x7a5a40, { x: 1.9, y: 1.56 }));
      // Rear row of houses
      parts.push(box(1.4, 1.3, 1.4, 0xffffff, { x: -1.2, y: 0.65, z: -2.0, hex2: 0xe8dcc8 }));
      parts.push(box(1.4, 1.3, 1.4, 0xffffff, { x: 1.2, y: 0.65, z: -2.0, hex2: 0xe8dcc8 }));
      // Courtyard (禾埕) in front
      parts.push(box(4.5, 0.1, 2.0, 0xb0a890, { y: 0.05, z: 1.8 }));
      // Half-moon pond (風水池)
      parts.push(cyl(0.6, 0.6, 0.15, 8, 0x4a7a8a, { y: 0.08, z: 2.8, thetaLen: Math.PI }));
      // Dark wood entrance frame
      parts.push(box(0.8, 1.3, 0.1, 0x5a3a2a, { y: 0.7, z: 1.0 }));
      // Red door frame accent
      parts.push(box(0.9, 0.15, 0.12, 0xb04030, { y: 1.4, z: 1.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 舊山線隧道口 Old Mountain Line tunnel entrance ----------- */
  {
    id: 'railway_tunnel',
    displayName: '舊山線隧道口',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0xb8443a, 0x8a6a58, 0xa03a30, 0x4a6a4a, 0x5a4a3a],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Iconic Old Mountain Line (舊山線) brick tunnel entrance — the
      // heritage railway tunnels with their distinctive red brick portals.
      const parts = [];
      // Mountain / hillside mass
      parts.push(sph(2.5, 0x4a6a4a, { ws: 6, hs: 4, y: 1.0, thetaLen: HALF_PI * 1.2, hex2: 0x3a5a3a }));
      // Tunnel portal - brick arch entrance
      // Brick portal frame
      parts.push(box(2.4, 2.8, 0.5, 0xb8443a, { y: 1.4, z: 1.8, hex2: 0xa03a30 }));
      // Dark tunnel opening
      parts.push(cyl(0.8, 0.8, 0.6, 10, 0x1a1a1e, { y: 1.2, z: 1.95, rx: HALF_PI }));
      // Arch over the opening
      parts.push(cyl(0.95, 0.95, 0.55, 8, 0xb8443a, {
        y: 1.5, z: 1.82, rx: HALF_PI, thetaLen: Math.PI, theta0: 0,
      }));
      // Decorative brick bands
      parts.push(box(2.6, 0.15, 0.12, 0x8a5a40, { y: 2.7, z: 2.05 }));
      parts.push(box(2.6, 0.15, 0.12, 0x8a5a40, { y: 0.3, z: 2.05 }));
      // Keystone at arch top
      parts.push(box(0.3, 0.35, 0.15, 0x9a8a78, { y: 2.35, z: 2.0 }));
      // Rail tracks emerging from tunnel
      parts.push(box(3.0, 0.08, 0.12, 0x5a5a5a, { y: 0.04, z: 2.6, x: 0.4 }));
      parts.push(box(3.0, 0.08, 0.12, 0x5a5a5a, { y: 0.04, z: 2.6, x: -0.4 }));
      // Cross ties
      parts.push(box(0.15, 0.06, 1.0, 0x6a5040, { y: 0.03, z: 2.8 }));
      parts.push(box(0.15, 0.06, 1.0, 0x6a5040, { y: 0.03, z: 3.3 }));
      // Platform / ground
      parts.push(box(4.0, 0.2, 2.5, 0x8a7a68, { y: 0.1, z: 3.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 5: 空橋 sky bridge ------------------------------------------ */
  {
    id: 'sky_bridge',
    displayName: '空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a6a8a, 0x6a96b8, 0xa0d0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.43,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Two towers joined by glazed sky bridge — 勝興車站 area development.
      return finish([
        towerBanded(0.9, 2.6, 0.9, 8, 0x3c5876, 0x6a96b8, 0xffe0a0, rng, { x: -1.5, y: 1.3 }), // tower A
        towerBanded(0.9, 2.4, 0.9, 8, 0x3c5876, 0x6a96b8, 0xffe0a0, rng, { x: 1.5, y: 1.2 }), // tower B
        box(2.2, 0.5, 0.6, 0xa0d0e4, { y: 2.0, hex2: 0xc8e4f0 }), // glazed bridge tube
        box(2.2, 0.05, 0.62, 0x88a0b4, { y: 2.26 }), // bridge roof
        box(2.2, 0.05, 0.62, 0x88a0b4, { y: 1.74 }), // bridge floor
        box(0.5, 0.2, 0.5, 0x7a8492, { x: -1.5, y: 2.7 }), // tower A roof unit
        box(0.5, 0.2, 0.5, 0x7a8492, { x: 1.5, y: 2.5 }), // tower B roof unit
      ]);
    },
  },

  /* ---- slot 6: 舊山線鐵橋 Old Mountain Railway bridge -------------------- */
  {
    id: 'old_mountain_rail_bridge',
    displayName: '舊山線鐵橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a5a40, 0xb8443a, 0xa03a30, 0x6a5040, 0x9a8a78],
    yOffset: -0.56,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Old Mountain Railway (舊山線) iron truss bridge — heritage rail crossing
      // over mountain valleys, with iconic red-brown steel trusses.
      const parts = [
        // Main deck (wooden ties on steel girders)
        box(4.0, 0.12, 0.9, 0x6a5040, { y: 1.6 }), // deck
        // Steel rail tracks
        box(4.0, 0.06, 0.08, 0x4a4a4a, { y: 1.68, z: 0.3 }), // rail L
        box(4.0, 0.06, 0.08, 0x4a4a4a, { y: 1.68, z: -0.3 }), // rail R
        // Cross ties (reduced to 3)
        box(0.12, 0.06, 0.8, 0x5a4030, { x: -1.2, y: 1.65 }),
        box(0.12, 0.06, 0.8, 0x5a4030, { x: 0.0, y: 1.65 }),
        box(0.12, 0.06, 0.8, 0x5a4030, { x: 1.2, y: 1.65 }),
      ];
      // Steel truss structure on both sides
      for (const zs of [0.5, -0.5]) {
        // Bottom chord
        parts.push(box(4.0, 0.1, 0.08, 0x8a5a40, { y: 1.5, z: zs }));
        // Top chord
        parts.push(box(4.0, 0.1, 0.08, 0x8a5a40, { y: 2.4, z: zs }));
        // Vertical posts (reduced to 4)
        for (let i = 0; i < 4; i++) {
          const x = -1.5 + i * 1.0;
          parts.push(box(0.08, 0.9, 0.06, 0x9a6a48, { x, y: 1.95, z: zs }));
        }
        // Diagonal braces (reduced to 3)
        for (let i = 0; i < 3; i++) {
          const x = -1.0 + i * 1.0;
          const dir = i % 2 === 0 ? 0.6 : -0.6;
          parts.push(box(0.05, 1.0, 0.04, 0x7a5a38, { x, y: 1.95, z: zs, rz: dir }));
        }
      }
      // Cross bracing on top
      parts.push(box(0.06, 0.06, 1.0, 0x8a5a40, { x: -1.0, y: 2.42 }));
      parts.push(box(0.06, 0.06, 1.0, 0x8a5a40, { x: 1.0, y: 2.42 }));
      // Stone pier abutments
      parts.push(box(1.0, 1.5, 1.1, 0x9a8a78, { x: -2.2, y: 0.75 }));
      parts.push(box(1.0, 1.5, 1.1, 0x9a8a78, { x: 2.2, y: 0.75 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 客家文化園區 hakka_cultural_complex ----------------------- */
  {
    id: 'hakka_cultural_complex',
    displayName: '客家文化園區',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0x8a6a4a, 0xe8e0d0, 0x6a4a32, 0xb04030],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Taiwan Hakka Cultural Park complex (客家文化園區) — the curved-roof
      // museum buildings that celebrate Hakka heritage in Miaoli.
      const parts = [
        // main exhibition hall (modern curved design)
        box(4.0, 2.5, 3.0, 0xffffff, { y: 1.25, hex2: 0xf0e8d8 }),
        // curved metal roof (characteristic wave form)
        cyl(2.0, 2.0, 4.4, 6, 0xb0a890, { theta0: Math.PI * 0.8, thetaLen: Math.PI * 0.4, rx: HALF_PI, y: 2.8 }),
        // entrance pavilion
        box(2.0, 1.8, 2.0, 0xffffff, { x: 2.5, y: 0.9, hex2: 0xe8e0d0 }),
        box(2.2, 0.12, 2.2, 0x8a6a4a, { x: 2.5, y: 1.88 }), // pavilion roof
        // connecting gallery
        box(1.5, 1.5, 0.8, 0xf0e8d8, { x: 1.3, y: 0.75 }),
        // traditional Hakka elements — red accent pillars
        cyl(0.12, 0.12, 1.8, 6, 0xb04030, { x: 1.6, y: 0.9, z: 1.52 }),
        cyl(0.12, 0.12, 1.8, 6, 0xb04030, { x: 3.4, y: 0.9, z: 1.02 }),
        // Hakka floral pattern panels
        box(1.4, 1.2, 0.1, 0xe83050, { y: 1.0, z: 1.52 }),
        box(0.8, 0.8, 0.08, 0xffd84d, { y: 1.0, z: 1.58 }), // flower center
        // water feature courtyard
        box(2.0, 0.15, 2.0, 0x4a7a8a, { x: 0, y: 0.08, z: 2.2 }),
        // heritage signage
        box(1.2, 0.5, 0.1, 0x6a4a32, { x: -1.5, y: 1.5, z: 1.52 }),
        box(1.0, 0.3, 0.06, 0xf0e8d8, { x: -1.5, y: 1.5, z: 1.58 }),
        // side wing (cultural workshops)
        box(2.0, 2.0, 2.5, 0xffffff, { x: -2.0, y: 1.0, hex2: 0xf0e8d8 }),
        box(2.2, 0.1, 2.7, 0x9a8a78, { x: -2.0, y: 2.05 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 cross-street skybridge --------- */
  {
    id: 'crossstreet_skybridge',
    displayName: '跨街空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x3c5876, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Monumental multi-level skybridge spanning between mixed-use blocks —
      // the kind of urban connector that might emerge in Miaoli's future development.
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
        parts.push(box(0.05, 0.85, 0.05, 0xb8c0c8, { rz: (i % 2 ? 1 : -1) * 0.5, x: sx, y: 1.25 }));
      }
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: -2.0, y: 2.95 })); // block A roof unit
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: 2.0, y: 3.15 })); // block B roof unit
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop mech tower ----------- */
  {
    id: 'rooftop_mech_tower',
    displayName: '屋頂機房塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x4a5260, 0x646c7a, 0x8a92a0, 0xb8bcc6, 0xe0c860],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Tall tower crowned by dense mechanical/antenna mast — service tower
      // overlooking the 龍騰斷橋 valley.
      const parts = [
        towerBanded(1.4, 3.4, 1.4, 11, 0x42505e, 0x8a92a0, 0xe0c860, rng, { y: 1.7 }), // main shaft
        box(1.5, 0.2, 1.5, 0x363c46, { y: 3.5 }), // roof slab
        box(1.1, 1.0, 1.1, 0x646c7a, { y: 4.1, hex2: 0x8a92a0 }), // mech penthouse
        box(0.7, 0.7, 0.7, 0xb8bcc6, { y: 4.85 }), // upper mech box
      ];
      // Antenna mast cluster on top
      parts.push(cyl(0.05, 0.05, 1.4, 6, 0xd0d4dc, { y: 5.6 })); // central mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: 0.28, y: 5.3 })); // side mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: -0.28, y: 5.3 })); // side mast
      parts.push(sph(0.12, 0xe0c860, { ws: 6, hs: 4, y: 6.3 })); // aircraft warning light
      // Mast platform rings
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.5, 0.04, 0.5, 0x9aa0aa, { y: 5.1 + i * 0.45 }));
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
