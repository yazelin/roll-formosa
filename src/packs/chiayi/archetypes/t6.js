/**
 * @file packs/chiayi/archetypes/t6.js — Roll Formosa Chiayi pack, Tier 6.
 *
 * T6 — 嘉義公園天際線 (Chiayi Park skyline / Alishan finale). The finale band:
 * Alishan mountain scenery, sacred trees, the Alishan forest railway, sea of
 * clouds observation decks, and city elements lit against the deep blue-violet
 * finale sky. Ten ArchetypeDefs, authored in the FROZEN tier order
 * (tiers.js T6.archetypeIds) — slots [0..7] absorbable, slots [8..9]
 * repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (finale scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 射日塔遠景 sun_tower_silhouette (distant 射日塔) ----------- */
  {
    id: 'sun_tower_silhouette',
    displayName: '射日塔遠景',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc06020, 0xd88030, 0xf0a040, 0x5a4030, 0xffc860],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Distant silhouette of 射日塔 (Sun-Shooting Tower) - simplified iconic shape
      const parts = [];
      const bronze = 0xc06020;
      const bronzeHi = 0xd88030;
      // Main cylindrical tower body
      parts.push(cyl(0.7, 0.8, 3.0, 8, bronze, { y: 1.5, hex2: bronzeHi }));
      // Tapered top section
      parts.push(cyl(0.6, 0.7, 1.0, 8, bronzeHi, { y: 3.2 }));
      // Iconic angular crown (射日意象)
      parts.push(cone(0.5, 0.8, 6, 0xf0a040, { y: 4.0 }));
      // Observation deck ring
      parts.push(cyl(0.85, 0.85, 0.15, 8, 0x5a4030, { y: 2.8 }));
      // Base platform
      parts.push(cyl(1.0, 1.1, 0.3, 8, 0x6a5040, { y: 0.15 }));
      // Park trees around base
      parts.push(sph(0.4, 0x2a5828, { ws: 5, hs: 3, x: 1.1, y: 0.5, z: 0.3 }));
      parts.push(sph(0.35, 0x3a6838, { ws: 5, hs: 3, x: -1.0, y: 0.45, z: -0.4 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 神木群 sacred_tree_grove (Alishan ancient trees) --------- */
  {
    id: 'sacred_tree_grove',
    displayName: '神木群',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a3828, 0x7a5838, 0x2a4828, 0x3a5838, 0xc8d8e0],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Grove of ancient red cypress (紅檜) sacred trees in Alishan
      const parts = [];
      const bark = 0x5a3828;
      const barkHi = 0x7a5838;
      const foliage = 0x2a4828;
      // Giant central sacred tree with massive trunk
      parts.push(cyl(0.5, 0.7, 2.5, 8, bark, { y: 1.25, hex2: barkHi }));
      parts.push(cyl(0.4, 0.5, 1.5, 7, bark, { y: 3.0 }));
      parts.push(sph(1.0, foliage, { ws: 7, hs: 5, y: 3.8, sx: 1.2, sy: 0.8, sz: 1.2, hex2: 0x3a5838 }));
      // Companion trees
      parts.push(cyl(0.25, 0.35, 1.8, 6, bark, { x: 1.3, y: 0.9, z: -0.5, hex2: barkHi }));
      parts.push(sph(0.6, foliage, { ws: 6, hs: 4, x: 1.3, y: 2.2, z: -0.5, hex2: 0x3a5838 }));
      parts.push(cyl(0.2, 0.3, 1.5, 6, bark, { x: -1.1, y: 0.75, z: 0.6 }));
      parts.push(sph(0.5, foliage, { ws: 6, hs: 4, x: -1.1, y: 1.8, z: 0.6, hex2: 0x3a5838 }));
      // Forest floor with ferns
      parts.push(cyl(2.5, 2.8, 0.15, 10, 0x4a4838, { y: 0.08 })); // forest floor
      parts.push(cone(0.3, 0.25, 5, 0x3a6838, { x: 0.8, y: 0.2, z: 0.9 })); // fern
      parts.push(cone(0.25, 0.2, 5, 0x4a7848, { x: -0.7, y: 0.18, z: -0.8 })); // fern
      // Mountain mist effect
      parts.push(sph(0.8, 0xc8d8e0, { ws: 5, hs: 3, x: -0.5, y: 0.4, z: 1.2, sy: 0.3, sx: 1.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 阿里山小火車 alishan_train_scene (forest railway train) -------- */
  {
    id: 'alishan_train_scene',
    displayName: '阿里山小火車',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8282a, 0xd83838, 0x2a2828, 0xe8d8c0, 0x5a5048],
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Alishan Forest Railway train - iconic red narrow-gauge locomotive and car
      const parts = [];
      const red = 0xb8282a;
      const redHi = 0xd83838;
      // Locomotive
      parts.push(box(1.4, 0.9, 0.8, red, { x: -1.5, y: 0.6, hex2: redHi })); // cab
      parts.push(box(0.9, 0.5, 0.65, 0x2a2828, { x: -2.1, y: 0.7 })); // chimney area
      parts.push(cyl(0.12, 0.1, 0.4, 5, 0x3a3838, { x: -2.3, y: 1.1 })); // chimney
      parts.push(box(0.7, 0.3, 0.6, 0x5a5048, { x: -1.5, y: 1.08 })); // roof
      // Passenger car (single car to save tris)
      parts.push(box(1.8, 0.7, 0.7, red, { x: 0.6, y: 0.55, hex2: redHi }));
      parts.push(box(1.6, 0.2, 0.05, 0x9fd0e4, { x: 0.6, y: 0.65, z: 0.36 })); // windows
      parts.push(box(1.6, 0.2, 0.05, 0x9fd0e4, { x: 0.6, y: 0.65, z: -0.36 })); // windows
      parts.push(box(1.6, 0.12, 0.6, 0x5a5048, { x: 0.6, y: 0.95 })); // roof
      // Track / rail suggestion
      parts.push(box(4.5, 0.06, 0.05, 0x5a5a5a, { y: 0.03, z: 0.22 }));
      parts.push(box(4.5, 0.06, 0.05, 0x5a5a5a, { y: 0.03, z: -0.22 }));
      // Wheels (reduced: 4 positions, fewer segs)
      for (const wx of [-1.8, -1.1, 0.2, 1.0]) {
        parts.push(cyl(0.16, 0.16, 0.1, 5, 0x2a2828, { x: wx, y: 0.16, z: 0.36, rx: HALF_PI }));
        parts.push(cyl(0.16, 0.16, 0.1, 5, 0x2a2828, { x: wx, y: 0.16, z: -0.36, rx: HALF_PI }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 3: 雲海觀景台 sea_of_clouds_deck (Alishan viewing platform) - */
  {
    id: 'sea_of_clouds_deck',
    displayName: '雲海觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a7a68, 0xa89878, 0xc8d8e8, 0x5a4838, 0xe0e8f0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Alishan sea of clouds (雲海) observation deck / viewing platform
      const parts = [];
      const wood = 0x6a5038;
      const woodHi = 0x8a7058;
      // Main observation platform deck
      parts.push(box(3.0, 0.18, 2.0, wood, { y: 1.0, hex2: woodHi }));
      // Support posts (reduced from 4 to 2)
      parts.push(cyl(0.12, 0.12, 1.0, 5, 0x5a4838, { x: -1.3, y: 0.5, z: 0 }));
      parts.push(cyl(0.12, 0.12, 1.0, 5, 0x5a4838, { x: 1.3, y: 0.5, z: 0 }));
      // Wooden railing (simplified)
      parts.push(box(3.1, 0.08, 0.08, wood, { y: 1.5, z: 0.95 }));
      parts.push(box(3.1, 0.08, 0.08, wood, { y: 1.5, z: -0.95 }));
      // Railing posts (reduced from 6 to 4)
      for (const rx of [-1.2, 1.2]) {
        parts.push(box(0.06, 0.5, 0.06, wood, { x: rx, y: 1.25, z: 0.95 }));
        parts.push(box(0.06, 0.5, 0.06, wood, { x: rx, y: 1.25, z: -0.95 }));
      }
      // Sea of clouds below (simplified to 2 spheres)
      parts.push(sph(1.5, 0xc8d8e8, { ws: 6, hs: 3, x: 0, y: 0.3, z: 0, sy: 0.3, sx: 2.0, sz: 1.5, hex2: 0xe0e8f0 }));
      parts.push(sph(0.9, 0xd8e8f0, { ws: 5, hs: 3, x: 1.0, y: 0.25, z: 0.6, sy: 0.25, sx: 1.4 }));
      // Roof shelter
      parts.push(box(2.0, 0.1, 1.4, 0x5a4838, { y: 2.0, rz: 0.15 }));
      parts.push(cyl(0.08, 0.08, 1.0, 4, 0x5a4838, { x: -0.8, y: 1.5 }));
      parts.push(cyl(0.08, 0.08, 1.0, 4, 0x5a4838, { x: 0.8, y: 1.5 }));
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

  /* ---- slot 5: 纜車柱 ropeway pole (Alishan cable car support) -------- */
  {
    id: 'ropeway_pole',
    displayName: '纜車柱',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a5a5a, 0x7a7a7a, 0x9a9a9a, 0xb82020, 0xd84040],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Alishan ropeway / cable car support tower with cables and gondola
      const parts = [];
      const steel = 0x5a5a5a;
      const steelHi = 0x7a7a7a;
      // Main tower structure (A-frame style)
      parts.push(box(0.25, 3.5, 0.25, steel, { x: -0.4, y: 1.75, rz: 0.08, hex2: steelHi }));
      parts.push(box(0.25, 3.5, 0.25, steel, { x: 0.4, y: 1.75, rz: -0.08, hex2: steelHi }));
      // Cross braces
      parts.push(box(1.0, 0.12, 0.12, steel, { y: 1.2 }));
      parts.push(box(0.8, 0.1, 0.1, steel, { y: 2.4 }));
      parts.push(box(0.6, 0.1, 0.1, steel, { y: 3.2 }));
      // Cable wheel housing at top
      parts.push(box(0.7, 0.35, 0.4, steelHi, { y: 3.7 }));
      parts.push(cyl(0.2, 0.2, 0.45, 8, 0x4a4a4a, { y: 3.7, rx: HALF_PI })); // wheel
      // Cables (simplified)
      parts.push(box(4.0, 0.03, 0.03, 0x3a3a3a, { y: 3.65, rz: 0.1 }));
      parts.push(box(4.0, 0.03, 0.03, 0x3a3a3a, { y: 3.75, rz: -0.05 }));
      // Gondola cabin (red, iconic Alishan cable car)
      parts.push(box(0.5, 0.45, 0.4, 0xb82020, { x: 1.5, y: 3.2, hex2: 0xd84040 })); // cabin body
      parts.push(box(0.45, 0.15, 0.35, 0x9fd0e4, { x: 1.5, y: 3.35 })); // windows
      parts.push(box(0.1, 0.25, 0.08, 0x4a4a4a, { x: 1.5, y: 3.65 })); // hanger
      // Concrete base
      parts.push(box(1.2, 0.25, 0.8, 0x8a8a8a, { y: 0.125 }));
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

  /* ---- slot 7: 公園 park block (Chiayi Park district) ------------- */
  {
    id: 'park_block',
    displayName: '公園',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2a5828, 0x3a6838, 0x4a7848, 0x8a7a68, 0xc8d8e8],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Chiayi Park area: green space with trees, pagoda, and walking paths
      const parts = [];
      const grass = 0x3a6838;
      const pathStone = 0xa89888;
      // Park ground (reduced segments: 12→8)
      parts.push(cyl(2.8, 3.0, 0.15, 8, grass, { y: 0.08, hex2: 0x4a7848 }));
      // Walking paths (crossing pattern)
      parts.push(box(5.0, 0.08, 0.35, pathStone, { y: 0.16 }));
      parts.push(box(0.35, 0.08, 4.0, pathStone, { y: 0.16 }));
      // Large trees (banyan style for Chiayi Park - reduced segments)
      parts.push(cyl(0.35, 0.45, 1.5, 5, 0x5a4030, { x: -1.3, y: 0.85, z: 0.8 })); // trunk
      parts.push(sph(1.1, 0x2a5828, { ws: 5, hs: 4, x: -1.3, y: 2.0, z: 0.8, sy: 0.7, hex2: 0x3a6838 }));
      parts.push(cyl(0.3, 0.4, 1.3, 5, 0x5a4030, { x: 1.2, y: 0.75, z: -0.9 })); // trunk
      parts.push(sph(0.9, 0x2a5828, { ws: 5, hs: 3, x: 1.2, y: 1.7, z: -0.9, sy: 0.65, hex2: 0x3a6838 }));
      // Small pagoda / pavilion (reduced segments: 8→6)
      parts.push(cyl(0.8, 0.85, 0.12, 6, pathStone, { x: 1.0, y: 0.22, z: 0.6 })); // platform
      parts.push(cyl(0.08, 0.08, 0.8, 4, 0x6a3020, { x: 1.0, y: 0.68, z: 0.6 })); // pillar
      parts.push(cone(0.7, 0.45, 6, 0x4a3828, { x: 1.0, y: 1.35, z: 0.6 })); // roof
      // Single flower bed (reduced from 2)
      parts.push(cyl(0.4, 0.45, 0.18, 6, 0xe85888, { x: -0.6, y: 0.24, z: -0.5, hex2: 0xf878a8 })); // flowers
      // Park bench (reduced from 2 to 1)
      parts.push(box(0.5, 0.2, 0.2, 0x6a5040, { x: -0.3, y: 0.26, z: -1.2 }));
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
