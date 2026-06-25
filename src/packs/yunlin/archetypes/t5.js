/**
 * @file archetypes/t5.js — Yunlin pack T5 「古坑咖啡大道」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / civic
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/yunlin/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 布袋戲劇場 puppet_theater (Yunlin puppet performance hall) */
  {
    id: 'puppet_theater',
    displayName: '布袋戲劇場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 25,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83020, 0xe84830, 0x8a4020, 0xf0c040, 0xf8e8c0],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Yunlin puppet theater - grand traditional performance hall
      const parts = [];
      // main building body (traditional style with red accents)
      parts.push(box(4.0, 3.2, 3.0, 0xffffff, { y: 1.8, hex2: 0xf0e0c8 }));
      // sweeping traditional roof (green glazed tiles)
      parts.push(box(4.6, 0.2, 3.6, 0x2e5a3a, { y: 3.5, rx: 0.15 }));
      parts.push(box(4.6, 0.2, 3.6, 0x2e5a3a, { y: 3.5, rx: -0.15 }));
      // ridge with ornaments
      parts.push(box(4.6, 0.15, 0.2, 0xf0c040, { y: 3.85 })); // golden ridge
      // swallowtail tips
      parts.push(cone(0.2, 0.5, 6, 0xf0c040, { x: -2.3, y: 3.95, rz: 0.5 }));
      parts.push(cone(0.2, 0.5, 6, 0xf0c040, { x: 2.3, y: 3.95, rz: -0.5 }));
      // front entrance with grand signboard
      parts.push(box(2.8, 0.6, 0.1, 0xc83020, { y: 3.0, z: 1.55 })); // sign
      parts.push(box(2.4, 0.4, 0.05, 0xf0c040, { y: 3.0, z: 1.58 })); // gold text area
      // entrance columns
      parts.push(cyl(0.2, 0.24, 2.6, 6, 0xc83020, { x: -1.2, y: 1.5, z: 1.5 }));
      parts.push(cyl(0.2, 0.24, 2.6, 6, 0xc83020, { x: 1.2, y: 1.5, z: 1.5 }));
      // main doors
      parts.push(box(1.6, 2.0, 0.1, 0x6a3020, { y: 1.2, z: 1.52 }));
      // decorative lanterns
      parts.push(sph(0.25, 0xd83028, { ws: 6, hs: 4, x: -1.5, y: 2.8, z: 1.7 }));
      parts.push(sph(0.25, 0xd83028, { ws: 6, hs: 4, x: 1.5, y: 2.8, z: 1.7 }));
      // stage area visible through windows
      parts.push(box(3.2, 1.5, 0.06, 0x3a3028, { y: 1.8, z: 1.48 })); // dark stage bg
      // side wing
      parts.push(box(1.2, 2.4, 2.0, 0xf0e0c8, { x: 2.3, y: 1.4 }));
      parts.push(box(1.3, 0.15, 2.2, 0x2e5a3a, { x: 2.3, y: 2.7 })); // side roof
      return finish(parts);
    },
  },

  /* ---- slot 1: 咖啡莊園 coffee_estate ------------------------------ */
  {
    id: 'coffee_estate',
    displayName: '咖啡莊園',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x6b4423, 0x8b5a2b, 0x3d5c3d, 0xdaa520, 0xf5f5dc],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 古坑咖啡莊園: rustic wood building with tasting terrace + coffee tree rows.
      const parts = [
        // main building (wood frame with tile roof)
        box(3.6, 2.4, 2.8, 0xffffff, { y: 1.4 }), // main hall (tinted wood)
        // sloped roof
        box(4.0, 0.2, 3.2, 0x8b4513, { y: 2.7, rx: 0.15 }),
        // tasting terrace with wooden deck
        box(2.0, 0.12, 2.2, 0xa0522d, { x: 2.5, y: 0.3, z: 0 }),
        // entrance awning
        box(1.6, 0.1, 1.4, 0xdaa520, { y: 2.0, z: 1.6 }),
        // sign
        box(1.2, 0.4, 0.08, 0x6b4423, { y: 2.3, z: 1.45 }),
      ];
      // coffee trees (small rounded green shapes, reduced)
      for (let i = 0; i < 3; i++) {
        const x = -1.8 + i * 0.9;
        parts.push(sph(0.35, 0x3d5c3d, { ws: 5, hs: 3, x, y: 0.5, z: -2.0 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 斗六車站 douliu_station_plaza ----------------------- */
  {
    id: 'douliu_station_plaza',
    displayName: '斗六車站',
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
      // 斗六火車站: regional rail station with modern canopy + plaza.
      const parts = [
        // station building (main hall)
        box(4.0, 2.2, 2.4, 0xffffff, { y: 1.3 }), // hall body (tinted)
        box(4.2, 0.3, 2.6, 0x8a9098, { y: 2.5 }), // roof slab
        // glass front entrance
        box(3.4, 1.8, 0.1, 0x2e3a48, { y: 1.2, z: 1.25 }), // glass frame
        box(3.0, 1.5, 0.05, 0x9fb4cc, { y: 1.2, z: 1.28 }), // glass panel
        // platform canopy (modern curved)
        box(6.0, 0.15, 2.0, 0xc6ccd2, { y: 2.8, x: 1.5 }),
        // canopy support columns
        cyl(0.15, 0.15, 2.6, 6, 0x7a8088, { x: -0.5, y: 1.5, z: 0.8 }),
        cyl(0.15, 0.15, 2.6, 6, 0x7a8088, { x: 2.5, y: 1.5, z: 0.8 }),
        cyl(0.15, 0.15, 2.6, 6, 0x7a8088, { x: -0.5, y: 1.5, z: -0.8 }),
        cyl(0.15, 0.15, 2.6, 6, 0x7a8088, { x: 2.5, y: 1.5, z: -0.8 }),
        // station plaza (paved area)
        box(5.0, 0.1, 3.0, 0xa8a8a0, { y: 0.05, z: 2.5 }),
        // station name sign
        box(2.0, 0.5, 0.1, 0x3a6ca8, { y: 2.2, z: 1.4 }),
        // clock tower
        cyl(0.25, 0.25, 1.2, 6, 0xd0d4da, { x: -2.5, y: 2.8 }),
        sph(0.3, 0xf0f0e8, { ws: 7, hs: 5, x: -2.5, y: 3.5 }), // clock face
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 濁水溪大橋 zhuoshui_bridge (Yunlin's river crossing) -- */
  {
    id: 'zhuoshui_bridge',
    displayName: '濁水溪大橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 35,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8c0b0, 0x9aa098, 0xe0dcd0, 0x6a7068, 0x4a6a58],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Zhuoshui River Bridge - major highway bridge crossing the Zhuoshui River
      const parts = [
        // main deck (long span)
        box(8.0, 0.4, 2.2, 0xffffff, { y: 2.4 }), // road deck (tinted concrete)
        // guardrails
        box(8.0, 0.5, 0.1, 0x8a9088, { y: 2.85, z: 1.0 }),
        box(8.0, 0.5, 0.1, 0x8a9088, { y: 2.85, z: -1.0 }),
        // road surface markings
        box(7.5, 0.02, 0.12, 0xf0f0e0, { y: 2.62, z: 0 }), // center line
        // lamp posts along the bridge
        cyl(0.08, 0.08, 1.8, 6, 0x7a8078, { x: -2.5, y: 3.5, z: 0.85 }),
        cyl(0.08, 0.08, 1.8, 6, 0x7a8078, { x: 2.5, y: 3.5, z: 0.85 }),
        sph(0.2, 0xf0e8c0, { ws: 5, hs: 3, x: -2.5, y: 4.5, z: 0.85 }), // lamp
        sph(0.2, 0xf0e8c0, { ws: 5, hs: 3, x: 2.5, y: 4.5, z: 0.85 }), // lamp
      ];
      // bridge piers (concrete columns in the river)
      for (let i = 0; i < 3; i++) {
        const x = -3.0 + i * 3.0;
        // tapered pier
        parts.push(box(0.8, 2.2, 1.6, 0xc0b8a8, { x, y: 1.1 }));
        parts.push(box(1.0, 0.3, 1.8, 0xb0a898, { x, y: 2.25 })); // pier cap
      }
      // entrance structures at both ends
      parts.push(box(1.2, 0.5, 2.4, 0xa8a090, { x: -4.2, y: 0.25 })); // abutment
      parts.push(box(1.2, 0.5, 2.4, 0xa8a090, { x: 4.2, y: 0.25 })); // abutment
      // bridge name sign
      parts.push(box(1.0, 0.4, 0.1, 0x4a6a58, { x: -3.8, y: 2.9, z: 1.15 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 大糧倉 large_granary (industrial rice storage) ----- */
  {
    id: 'large_granary',
    displayName: '大糧倉',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8b898, 0xb8a888, 0xd8c8a8, 0xa89878, 0x7a6848],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Large industrial rice storage facility - typical in Yunlin's agricultural zone
      const parts = [];
      // main cylindrical silos (row of 3)
      for (let i = 0; i < 3; i++) {
        const x = -1.6 + i * 1.6;
        parts.push(cyl(0.7, 0.7, 5.0, 9, 0xffffff, { x, y: 2.5, hex2: 0xe0d0c0 }));
        // conical roof
        parts.push(cone(0.8, 0.6, 9, 0x8a7858, { x, y: 5.3 }));
        // ventilation cap
        parts.push(cyl(0.1, 0.08, 0.2, 5, 0x6a5838, { x, y: 5.7 }));
      }
      // connecting walkway at top
      parts.push(box(4.0, 0.15, 0.5, 0x9a8a78, { y: 4.5 }));
      // loading/unloading building
      parts.push(box(2.0, 2.0, 1.5, 0xd8c8b0, { x: 0, y: 1.0, z: -1.5 }));
      parts.push(box(2.1, 0.12, 1.6, 0x8a7858, { y: 2.1, z: -1.5 })); // roof
      // grain conveyor system
      parts.push(box(0.2, 0.2, 3.0, 0x7a6a58, { x: 0.8, y: 3.5, z: -0.5, rx: -0.3 }));
      // loading dock
      parts.push(box(3.0, 0.2, 1.0, 0x9a9088, { y: 0.1, z: -2.5 }));
      // truck at dock (simplified)
      parts.push(box(1.2, 0.6, 0.6, 0xf0c020, { x: -0.5, y: 0.5, z: -2.8 }));
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

  /* ---- slot 7: 銀行 bank ------------------------------------------ */
  {
    id: 'bank',
    displayName: '銀行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8d0bc, 0xeae4d2, 0x9a8e72, 0x3a4a6a, 0xc8a84a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Classical-front bank: stone block with a portico of fat columns + pediment.
      const parts = [
        box(4.0, 3.4, 3.0, 0xffffff, { y: 1.9 }), // main hall (tinted stone)
        box(4.2, 0.3, 3.2, 0x9a8e72, { y: 3.7 }), // cornice
        // portico: entablature beam + triangular pediment up front
        box(3.6, 0.4, 0.5, 0xeae4d2, { y: 3.0, z: 1.6 }), // architrave
        // pediment (a wide flat triangle via a thin scaled box rotated? use cone-ish prism)
        box(3.6, 0.6, 0.4, 0xeae4d2, { y: 3.5, z: 1.55, sx: 1, sy: 1, sz: 1 }),
        cone(1.9, 0.7, 4, 0xe2dcca, { y: 3.95, z: 1.55, ry: PI / 4, sz: 0.25 }), // pediment apex
        // 4 fat columns
        box(2.0, 0.2, 1.0, 0x8a7e64, { y: 0.18, z: 1.7 }), // stylobate / steps
      ];
      for (let i = 0; i < 4; i++) {
        const x = -1.35 + i * 0.9;
        parts.push(cyl(0.26, 0.28, 2.5, 6, 0xf0ead8, { x, y: 1.55, z: 1.7 })); // shaft
        parts.push(box(0.66, 0.16, 0.66, 0xd8d0bc, { x, y: 0.34, z: 1.7 })); // base
        parts.push(box(0.66, 0.16, 0.66, 0xd8d0bc, { x, y: 2.78, z: 1.7 })); // capital
      }
      // gold name plaque + door
      parts.push(box(2.0, 0.34, 0.08, 0xc8a84a, { y: 3.0, z: 1.84 }));
      parts.push(box(0.9, 1.6, 0.08, 0x2a3a58, { y: 1.0, z: 1.76 })); // dark glass door
      return finish(parts);
    },
  },

  /* ---- slot 8: 車站商辦塔 station_office_tower (CHUNK LANDMARK) --- */
  {
    id: 'station_office_tower',
    displayName: '車站商辦塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3e4e66, 0xaecae0, 0x7a8aa0, 0x232c38, 0xe6eef6],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 斗六車站區域商辦塔: Big setback skyscraper near the station —
      // wide podium → tapered banded shaft → crown + antenna.
      return finish([
        // multi-floor podium
        box(4.2, 1.8, 3.4, 0xffffff, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x6a7888, { y: 1.85 }),
        // main banded shaft (tall)
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x28323e, 0xfff0c0, rng, { y: 6.5 }),
        // mullion fins front
        box(0.12, 9.0, 0.12, 0x2a3340, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.95, y: 6.5, z: 1.22 }),
        // first setback
        box(2.4, 0.4, 1.9, 0x7a8aa0, { y: 11.2 }),
        // tapered upper shaft
        towerBanded(1.9, 3.4, 1.6, 7, 0xe6eef6, 0x33404f, 0xfff0c0, rng, { y: 13.1 }),
        // crown
        box(1.5, 0.6, 1.2, 0xaecae0, { y: 15.1 }),
        cone(0.9, 1.2, 6, 0x55657a, { y: 16.0 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.6 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 18.9 }), // beacon
      ]);
    },
  },

  /* ---- slot 9: 百貨大樓 department_mass (CHUNK LANDMARK) ---------- */
  {
    id: 'department_mass',
    displayName: '百貨大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xcabfa8, 0xe8dcc4, 0x8a7c60, 0xb8443a, 0xf2ead6],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // A whole department-store block: a broad multi-wing mall mass with a
      // curved glass atrium, escalator-glass front, brand crown.
      const parts = [
        // two stacked retail volumes (wide low + narrower upper)
        box(5.6, 3.6, 4.2, 0xffffff, { y: 2.0 }), // lower mass (tinted)
        box(4.2, 2.6, 3.4, 0xffffff, { y: 5.1 }), // upper mass
        box(5.7, 0.3, 4.3, 0x9a8c70, { y: 3.85 }), // mid cornice
        box(4.3, 0.3, 3.5, 0x9a8c70, { y: 6.45 }), // upper cornice
        // curved glass atrium bay on the front (half-cylinder)
        cyl(1.5, 1.5, 4.6, 9, 0x9fc4d8, { y: 2.3, z: 2.1, rx: HALF_PI,
          theta0: -HALF_PI, thetaLen: PI }),
        box(2.6, 4.4, 0.12, 0x2c3a44, { y: 2.3, z: 2.0 }), // atrium dark frame behind glass
        // entrance canopy + brand band
        box(3.2, 0.22, 1.2, 0xb8443a, { y: 1.5, z: 2.7 }),
        box(4.2, 0.7, 0.16, 0xb8443a, { y: 6.9, z: 1.74 }), // upper brand band
        box(4.0, 0.5, 0.06, 0xf2ead6, { y: 6.9, z: 1.82 }), // band face
        // rooftop services + sign pylon
        box(1.4, 0.7, 1.0, 0x6a6050, { x: 1.0, y: 6.9 }),
        box(0.5, 1.8, 0.5, 0xb8443a, { x: -1.4, y: 7.3 }), // sign pylon
      ];
      // clerestory window rows on both volumes
      for (let i = 0; i < 7; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.6, 0.05, lit, { x: -2.4 + i * 0.8, y: 3.1, z: 2.12 }));
      }
      for (let i = 0; i < 5; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.5, 0.05, lit, { x: -1.6 + i * 0.8, y: 5.5, z: 1.72 }));
      }
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
