/**
 * @file archetypes/t5.js — Taoyuan pack T5 「工業與商業區」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the industrial / commercial
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/taoyuan/tiers.js — spelling must NOT drift.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * Palette = 4–5 hex tints (catalog.test enforces 4–6). Bodies meant to be
 * tinted per-instance are baked near-white (0xffffff) so instanceColor reads
 * through; fixed parts (glass, steel, asphalt) are baked dark/desaturated so
 * tints only nudge them.
 *
 * yOffset = -1 - minY of the normalized geometry: every object here sits on
 * the ground (bottom near the sphere's lowest point) so yOffset ≈ -1 + a
 * little, measured from the built geometry and rounded.
 */

import {
  paint, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

const TIER = 5;

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T5_ARCHETYPES = [
  /* ---- slot 0: 桃園捷運高架站 metro_station_taoyuan (機捷特色) -------- */
  {
    id: 'metro_station_taoyuan',
    displayName: '桃園捷運高架站',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6a4a8a, 0x8a6aaa, 0xa0c8e0, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Taoyuan Airport MRT elevated station (桃園機場捷運高架站) with purple accents
      const parts = [];
      const concrete = 0xc8ccd4;
      const glass = 0xa0c8e0;
      const purple = 0x6a4a8a; // 機捷 corporate color
      // Platform deck (elevated)
      parts.push(box(5.0, 0.5, 2.0, concrete, { y: 2.25 }));
      // Support columns (Y-shaped piers typical of 機捷)
      for (const px of [-1.8, 1.8]) {
        parts.push(cyl(0.4, 0.5, 2.0, 6, 0x9aa0a8, { x: px, y: 1.0 }));
        parts.push(box(1.0, 0.3, 1.8, 0xb0b8c0, { x: px, y: 2.0 })); // pier cap
      }
      // Station canopy (curved roof)
      parts.push(cyl(2.0, 2.0, 5.2, 10, 0x8aa0b8, { rx: PI / 2, y: 3.5, thetaLen: PI }));
      // Glass walls
      parts.push(box(4.8, 1.0, 0.12, glass, { y: 2.9, z: 0.95 }));
      parts.push(box(4.8, 1.0, 0.12, glass, { y: 2.9, z: -0.95 }));
      // Platform edge strips (purple - 機捷 corporate color)
      parts.push(box(4.9, 0.08, 0.2, purple, { y: 2.52, z: 0.85 }));
      parts.push(box(4.9, 0.08, 0.2, purple, { y: 2.52, z: -0.85 }));
      // Signage (purple 機捷 sign)
      parts.push(box(1.5, 0.5, 0.12, purple, { y: 3.8, z: 0 }));
      // Purple stripe on canopy
      parts.push(box(5.1, 0.12, 0.3, purple, { y: 3.6, z: 0 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 科技園區大門 tech_park_gate (桃園科技園區特色) ---------- */
  {
    id: 'tech_park_gate',
    displayName: '科技園區大門',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x3a5a8a, 0x5a7aaa, 0x8ab0d0, 0xc8d4e0, 0xe8f0f8],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      // Taoyuan tech park entrance gate (桃園科技園區 / 華亞科技園區 style)
      const parts = [];
      const steel = 0x4a6080;
      const glass = 0x8ab0d0;
      // Main gate arch structure
      parts.push(box(0.5, 4.0, 0.5, steel, { x: -2.5, y: 2.0 })); // left pillar
      parts.push(box(0.5, 4.0, 0.5, steel, { x: 2.5, y: 2.0 })); // right pillar
      // Horizontal beam connecting pillars
      parts.push(box(5.5, 0.6, 0.8, steel, { y: 4.2 }));
      // Glass canopy over entrance
      parts.push(box(6.0, 0.15, 2.0, glass, { y: 4.6 }));
      // Gate booth (security)
      parts.push(box(1.5, 1.5, 1.2, 0xc8d4e0, { x: -3.5, y: 0.75 }));
      parts.push(box(1.4, 0.5, 0.06, 0x9fc4d8, { x: -3.5, y: 1.0, z: 0.63 })); // booth window
      // Road barriers
      parts.push(box(2.0, 0.8, 0.15, 0xe0a030, { x: 0, y: 0.4, z: 0.8 })); // yellow barrier
      parts.push(box(2.0, 0.8, 0.15, 0xe0a030, { x: 0, y: 0.4, z: -0.8 }));
      // Company logos / signage on gate beam
      parts.push(box(2.5, 0.5, 0.12, 0x3a6ea0, { y: 4.1, z: 0.45 }));
      // Ground pavement markings
      parts.push(box(5.0, 0.05, 3.0, 0x5a5a5a, { y: 0.03 })); // asphalt
      parts.push(box(0.2, 0.06, 2.5, 0xffffff, { x: -1.0, y: 0.06 })); // lane marking
      parts.push(box(0.2, 0.06, 2.5, 0xffffff, { x: 1.0, y: 0.06 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 捷運高架 metro_viaduct ----------------------------- */
  {
    id: 'metro_viaduct',
    displayName: '捷運高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x3a6ca8],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Elevated rail: a long box girder deck on twin Y-piers + a train car.
      const parts = [
        // continuous deck girder (long along X)
        box(9.0, 0.7, 1.8, 0xffffff, { y: 3.4 }), // deck (tinted concrete)
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: 0.95 }), // side parapet
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: -0.95 }), // side parapet
      ];
      // piers: square columns with flared caps at intervals
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.55, 0.7, 3.1, 6, 0xc2c6cc, { x, y: 1.55 }));
        parts.push(box(1.5, 0.4, 1.9, 0xb0b6be, { x, y: 3.05 })); // pier cap
      }
      // a train car sitting on the deck
      parts.push(box(4.2, 1.1, 1.2, 0xffffff, { y: 4.35 })); // car body (tinted)
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: 0.62 })); // window strip
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: -0.62 })); // window strip
      parts.push(box(4.3, 0.18, 1.24, 0x3a6ca8, { y: 4.95 })); // brand stripe / roof trim
      return finish(parts);
    },
  },

  /* ---- slot 3: 機捷連通天橋 airport mrt skybridge -------------------- */
  {
    id: 'airport_mrt_skybridge',
    displayName: '機捷連通天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6a4a8a, 0x8a6aaa, 0xc8d0d8, 0xa0c8e0, 0x9aa0a8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Taoyuan Airport MRT (機捷) station connection skybridge with purple accents
      const parts = [];
      const purple = 0x6a4a8a; // 機捷 corporate purple
      const glass = 0xa0c8e0;
      const concrete = 0xc8d0d8;
      // Main enclosed walkway tube (curved roof)
      parts.push(box(6.0, 1.0, 1.5, concrete, { y: 2.5 }));
      // Curved glass roof
      parts.push(cyl(1.5, 1.5, 6.2, 10, glass, { rx: PI / 2, y: 3.3, thetaLen: PI }));
      // Purple accent stripe along the walkway (機捷 branding)
      parts.push(box(6.2, 0.12, 0.2, purple, { y: 2.1, z: 0.65 }));
      parts.push(box(6.2, 0.12, 0.2, purple, { y: 2.1, z: -0.65 }));
      // Glass side panels
      parts.push(box(5.8, 0.8, 0.08, glass, { y: 2.6, z: 0.72 }));
      parts.push(box(5.8, 0.8, 0.08, glass, { y: 2.6, z: -0.72 }));
      // Support columns (Y-shaped piers typical of 機捷)
      for (const sx of [-2.5, 2.5]) {
        parts.push(cyl(0.25, 0.35, 2.0, 6, 0x9aa0a8, { x: sx, y: 1.0 }));
        parts.push(box(0.8, 0.2, 1.3, 0xb0b8c0, { x: sx, y: 1.95 })); // pier cap
      }
      // Elevator tower at one end
      parts.push(box(1.2, 3.0, 1.2, concrete, { x: -3.5, y: 1.5 }));
      parts.push(box(1.0, 0.6, 0.08, glass, { x: -3.5, y: 2.0, z: 0.62 })); // glass panel
      // Purple signage
      parts.push(box(0.8, 0.4, 0.1, purple, { x: -3.5, y: 2.8, z: 0.64 }));
      // Ground level entrance
      parts.push(box(1.6, 0.8, 1.0, 0x9aa0a8, { x: 3.5, y: 0.4 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 茶葉批發行 tea_wholesale (龍潭/平鎮茶業特色) --------- */
  {
    id: 'tea_wholesale',
    displayName: '茶葉批發行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2a4030, 0x385040, 0xd8c8a0, 0x1e3028, 0xc8a050],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Taoyuan tea wholesale warehouse (龍潭/平鎮茶葉批發行)
      // Part of Taoyuan's historic tea industry
      const parts = [];
      const concrete = 0xd8d0c0;
      const tea_green = 0x2a4030;
      // main warehouse building
      parts.push(box(4.0, 2.8, 3.0, concrete, { y: 1.4 }));
      // traditional-style sloped roof
      parts.push(box(4.2, 0.15, 3.2, 0x4a4a48, { y: 2.9 }));
      parts.push(box(4.4, 0.4, 3.4, 0x3a3a38, { y: 3.1, rx: 0.1 })); // roof slope
      // large roll-up door for truck loading
      parts.push(box(2.0, 2.0, 0.1, 0x5a6068, { x: 0, y: 1.0, z: 1.52 }));
      // tea company signage (green with gold text - typical style)
      parts.push(box(3.0, 0.6, 0.12, tea_green, { y: 2.5, z: 1.56 }));
      parts.push(box(2.6, 0.4, 0.08, 0xc8a050, { y: 2.5, z: 1.62 })); // gold text
      // stacked tea crates outside
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.8, 0.5, 0.6, 0xc8b890, { x: 1.8, y: 0.25 + i * 0.5, z: 1.2 }));
      }
      parts.push(box(0.8, 0.5, 0.6, 0xc8b890, { x: 1.8, y: 0.25, z: 0.5 }));
      // forklift / pallet area
      parts.push(box(2.5, 0.08, 2.0, 0x9a9890, { y: 0.04, z: 2.2 }));
      // office section with tea display
      parts.push(box(1.2, 2.0, 1.5, 0xe8e0d0, { x: -2.2, y: 1.0, z: 0.5 }));
      parts.push(box(1.0, 0.5, 0.06, 0x9fc4d8, { x: -2.2, y: 1.4, z: 1.28 })); // window
      return finish(parts);
    },
  },

  /* ---- slot 5: 巨型看板 giant_billboard --------------------------- */
  {
    id: 'giant_billboard',
    displayName: '巨型看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46, 0xf2f2ee],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // A rooftop / roadside billboard: big bright panel on a lattice gantry.
      const parts = [
        // gantry legs (wide A-stance)
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0, rz: 0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // billboard frame + bright face
        box(5.2, 2.4, 0.18, 0x2e3138, { y: 5.4 }), // frame
        box(5.0, 2.2, 0.06, 0xffffff, { y: 5.4, z: 0.13 }), // ad face (tinted bright)
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }), // top spotlight bar
      ];
      // color blocks on the ad face (deterministic mock graphic)
      const adHex = [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46];
      for (let i = 0; i < 4; i++) {
        const w = 0.9 + (i % 2) * 0.4;
        parts.push(box(w, 1.6 - (i % 2) * 0.6, 0.04, adHex[i], {
          x: -1.7 + i * 1.15, y: 5.4, z: 0.17,
        }));
      }
      // spotlights
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: -1.6, y: 6.6, rx: 0.6 }));
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: 1.6, y: 6.6, rx: 0.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 玻璃帷幕街屋 glass_curtain_house ------------------- */
  {
    id: 'glass_curtain_house',
    displayName: '玻璃帷幕街屋',
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
      // Narrow mid-rise street shophouse with a full glass curtain wall front.
      const parts = [
        box(2.2, 5.2, 2.0, 0xffffff, { y: 2.8 }), // body (tinted concrete sides)
        // glass curtain wall on the front (proud, gridded)
        box(2.0, 4.6, 0.14, 0x2e3744, { y: 2.9, z: 1.02 }), // mullion grid (dark)
        box(1.8, 4.4, 0.06, 0x8fd6e2, { y: 2.9, z: 1.1 }), // glass (tinted blue-green)
        // ground-floor shop entrance
        box(2.0, 0.9, 0.1, 0x20262c, { y: 0.5, z: 1.06 }),
        box(1.2, 0.7, 0.06, 0xbfeaf0, { y: 0.5, z: 1.12 }), // bright entry glass
        // parapet + a small rooftop water tank
        box(2.3, 0.24, 2.1, 0x4a8090, { y: 5.5 }),
        cyl(0.4, 0.4, 0.6, 7, 0x9aa0a8, { x: 0.5, y: 5.9 }),
      ];
      // horizontal floor-line mullions across the glass (5 floors)
      for (let f = 1; f < 5; f++) {
        parts.push(box(1.85, 0.07, 0.04, 0x223038, { y: 0.6 + f * 0.95, z: 1.14 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 客家文化館 hakka_cultural_center (桃園客家特色) ---- */
  {
    id: 'hakka_cultural_center',
    displayName: '客家文化館',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc83040, 0x2060a0, 0xd8c8a0, 0x308848, 0xf0d050],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Taoyuan Hakka Cultural Center (客家文化館) - celebrating Hakka heritage
      // Inspired by 桃園市客家文化館 / 平鎮客家文化園區
      const parts = [];
      const hakka_red = 0xc83040; // Hakka signature red
      const earth = 0xd8c8a0;
      // main building body (modern cultural center with traditional elements)
      parts.push(box(4.5, 2.8, 3.5, earth, { y: 1.4 }));
      // traditional-style curved roof (客家圓樓風格)
      parts.push(cyl(2.0, 2.0, 4.6, 10, 0x4a4a48, { rx: PI / 2, y: 3.2, thetaLen: PI }));
      // roof ridge ornament
      parts.push(box(4.4, 0.15, 0.2, hakka_red, { y: 3.3 }));
      // Hakka floral pattern facade elements
      parts.push(box(3.8, 1.0, 0.15, 0xffffff, { y: 2.0, z: 1.78 }));
      // flower pattern circles (客家花布元素)
      parts.push(cyl(0.3, 0.3, 0.08, 8, hakka_red, { x: -1.2, y: 2.2, z: 1.86, rx: HALF_PI }));
      parts.push(cyl(0.25, 0.25, 0.08, 8, 0x2060a0, { x: 0, y: 2.0, z: 1.86, rx: HALF_PI }));
      parts.push(cyl(0.28, 0.28, 0.08, 8, 0x308848, { x: 1.2, y: 2.2, z: 1.86, rx: HALF_PI }));
      // entrance with traditional door frame
      parts.push(box(1.5, 2.0, 0.2, 0x6a4a32, { y: 1.0, z: 1.7 }));
      parts.push(box(1.3, 1.8, 0.08, 0x9fc4d8, { y: 1.0, z: 1.82 })); // glass door
      // signage (客家文化館)
      parts.push(box(2.5, 0.5, 0.12, hakka_red, { y: 2.8, z: 1.86 }));
      parts.push(box(2.2, 0.35, 0.08, 0xf0d050, { y: 2.8, z: 1.92 })); // gold text
      // courtyard with Hakka cultural elements
      parts.push(box(3.5, 0.08, 1.5, 0x9a9890, { y: 0.04, z: 2.5 })); // courtyard
      // oil-paper umbrella display (客家油紙傘)
      parts.push(cyl(0.8, 0.0, 0.3, 8, hakka_red, { x: -1.5, y: 1.5, z: 2.5, rx: 0.3 }));
      parts.push(cyl(0.04, 0.04, 0.8, 6, 0x6a4a32, { x: -1.5, y: 1.0, z: 2.5 })); // handle
      return finish(parts);
    },
  },

  /* ---- slot 8: 工業廠房 factory_mass (CHUNK LANDMARK) ---------- */
  {
    id: 'factory_mass',
    displayName: '工業廠房',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x8a9098, 0xc0c8d0, 0x6a7078, 0x4a5058, 0xe0e4e8],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Taoyuan industrial zone factory — large sawtooth-roof manufacturing plant
      // typical of the 桃園工業區 / 觀音工業區 landscape.
      const parts = [];
      // main factory building body
      parts.push(box(6.0, 2.8, 4.0, 0xc0c8d0, { y: 1.4 }));
      // sawtooth roof (三角屋頂 / 鋸齒形天窗) — iconic industrial silhouette
      for (let i = 0; i < 4; i++) {
        const z = -1.4 + i * 1.0;
        // sloped roof segment
        parts.push(box(6.0, 0.12, 0.9, 0x8a9098, { y: 2.9 + i * 0.08, z, rx: -0.3 }));
        // vertical skylight window
        parts.push(box(5.8, 0.4, 0.06, 0x9fc4d8, { y: 3.0, z: z + 0.4 }));
      }
      // large roll-up loading doors
      for (let i = 0; i < 3; i++) {
        parts.push(box(1.4, 2.0, 0.08, 0x4a5058, { x: -2.0 + i * 2.0, y: 1.0, z: 2.02 }));
        // door frames
        parts.push(box(1.5, 0.1, 0.1, 0x6a7078, { x: -2.0 + i * 2.0, y: 2.05, z: 2.02 }));
      }
      // office annex attached to the side
      parts.push(box(1.6, 2.0, 2.0, 0xe0e4e8, { x: 3.4, y: 1.0 }));
      parts.push(box(1.4, 0.5, 0.06, 0x9fc4d8, { x: 3.6, y: 1.2, z: 1.02 })); // office window
      // smokestack / exhaust vent
      parts.push(cyl(0.25, 0.3, 2.5, 8, 0x6a7078, { x: -2.5, y: 4.1, z: -1.5 }));
      // external pipe runs along wall
      parts.push(cyl(0.12, 0.12, 5.8, 6, 0x8a9098, { y: 2.2, z: -2.02, rz: HALF_PI }));
      // loading dock platform
      parts.push(box(5.4, 0.3, 0.8, 0x9aa0a8, { y: 0.15, z: 2.4 }));
      // company signage
      parts.push(box(2.0, 0.6, 0.1, 0x3a6ea0, { x: 0, y: 2.4, z: 2.04 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 物流倉庫 warehouse_mass (CHUNK LANDMARK) -------- */
  {
    id: 'warehouse_mass',
    displayName: '物流倉庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x8a9098, 0xc0c8d0, 0x4a5058, 0x6a7078, 0xe0e4e8],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      // Taoyuan logistics warehouse — large distribution center typical of
      // 桃園航空城 / 物流園區. Long rectangular with loading docks.
      const parts = [];
      // main warehouse body (very long and low)
      parts.push(box(7.0, 2.4, 4.0, 0xc0c8d0, { y: 1.2 }));
      // corrugated metal roof with slight slope
      parts.push(box(7.2, 0.12, 4.2, 0x8a9098, { y: 2.48, rx: 0.05 }));
      // roof ribs (corrugation suggestion)
      for (let i = 0; i < 5; i++) {
        parts.push(box(7.2, 0.06, 0.1, 0x6a7078, { y: 2.54, z: -1.5 + i * 0.8 }));
      }
      // loading dock bays with roll-up doors
      for (let i = 0; i < 5; i++) {
        const x = -2.5 + i * 1.25;
        // roll-up door
        parts.push(box(1.0, 1.8, 0.08, 0x4a5058, { x, y: 1.0, z: 2.02 }));
        // dock leveler platform
        parts.push(box(1.1, 0.2, 0.6, 0x9aa0a8, { x, y: 0.1, z: 2.32 }));
        // dock number sign
        parts.push(box(0.3, 0.3, 0.06, 0xe0a030, { x, y: 2.1, z: 2.04 }));
      }
      // truck docking area (concrete apron)
      parts.push(box(7.4, 0.1, 2.0, 0x9a9890, { y: 0.05, z: 3.0 }));
      // forklift / pallet area markings (yellow stripe)
      parts.push(box(6.0, 0.02, 0.15, 0xe0c020, { y: 0.12, z: 2.5 }));
      // office section on the side
      parts.push(box(1.5, 2.0, 2.5, 0xe0e4e8, { x: -4.0, y: 1.0, z: 0 }));
      // office windows
      for (let i = 0; i < 2; i++) {
        parts.push(box(1.2, 0.5, 0.06, 0x9fc4d8, { x: -4.0, y: 0.8 + i * 0.8, z: 1.28 }));
      }
      // company logo / signage on main building
      parts.push(box(2.5, 0.8, 0.1, 0x3a6ea0, { x: 1.5, y: 2.0, z: 2.04 }));
      // parking for trucks (concrete strip)
      parts.push(box(6.0, 0.08, 1.2, 0x9a988a, { y: 0.04, z: -2.6 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
