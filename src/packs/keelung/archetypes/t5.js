/**
 * @file archetypes/t5.js — Keelung pack T5 「商港與商業」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / port
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/keelung/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 商辦大樓 office_tower ------------------------------- */
  {
    id: 'office_tower',
    displayName: '商辦大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a5a72, 0xc8d4e2, 0x8a98aa, 0x2e3744, 0xe2e8f0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Slab high-rise: banded glass shaft + setback crown + rooftop plant box.
      return finish([
        towerBanded(2.6, 7.2, 2.0, 14, 0xffffff, 0x2e3a4a, 0xfff0c0, rng, { y: 3.6 }),
        // vertical mullion fins (front + back) to read as a curtain wall
        box(0.1, 7.2, 0.1, 0x33404f, { x: -0.8, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.0, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.8, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: -0.8, y: 3.6, z: -1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.8, y: 3.6, z: -1.02 }),
        // ground-floor lobby (darker, recessed)
        box(2.8, 0.9, 2.2, 0x222a34, { y: 0.45 }),
        box(1.0, 0.7, 0.06, 0x9fb4cc, { y: 0.4, z: 1.12 }), // lit lobby glass
        // setback crown + parapet
        box(2.2, 0.7, 1.7, 0xd6dee8, { y: 7.55 }),
        box(2.2, 0.12, 1.7, 0x8a98aa, { y: 7.96 }),
        // rooftop plant box + mast
        box(1.0, 0.5, 0.8, 0x5a6472, { y: 8.15 }),
        cyl(0.05, 0.05, 1.2, 6, 0xb04030, { y: 9.0 }),
      ]);
    },
  },

  /* ---- slot 1: 港倉 port_warehouse --------------------------------- */
  {
    id: 'port_warehouse',
    displayName: '港倉',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a9098, 0xa0a8b0, 0x6a7078, 0xc94f46, 0xe8e0d0],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Large corrugated-metal harbor warehouse with loading bays
      const parts = [
        // main warehouse body - long metal shed
        box(5.0, 2.2, 3.0, 0x8a9098, { y: 1.1, hex2: 0xa0a8b0 }),
        // pitched roof
        cyl(1.6, 1.6, 5.2, 4, 0x7a8088, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 2.5 }),
        // roof ridge
        box(5.0, 0.1, 0.2, 0x6a7078, { y: 2.95 }),
      ];
      // corrugation ribs
      for (let i = 0; i < 6; i++) {
        const x = -2.0 + i * 0.8;
        parts.push(box(0.06, 2.0, 3.02, 0x7a8088, { x, y: 1.1 }));
      }
      // loading bay doors (roll-up style)
      parts.push(box(1.2, 1.6, 0.08, 0x5a6068, { x: -1.5, y: 0.8, z: 1.52 }));
      parts.push(box(1.2, 1.6, 0.08, 0x5a6068, { x: 1.5, y: 0.8, z: 1.52 }));
      // warning stripe
      parts.push(box(5.0, 0.2, 0.05, 0xc94f46, { y: 0.1, z: 1.52 }));
      // port number sign
      parts.push(box(0.8, 0.5, 0.06, 0xe8e0d0, { x: 0, y: 1.8, z: 1.52 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 貨櫃堆 container_stack ------------------------------ */
  {
    id: 'container_stack',
    displayName: '貨櫃堆',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 35,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc94f46, 0x2f6db0, 0x3a8a4a, 0xe0a838, 0x8a9098],
    yOffset: -0.46,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Stacked shipping containers - iconic port scene
      const colors = [0xc94f46, 0x2f6db0, 0x3a8a4a, 0xe0a838, 0x8a9098];
      const parts = [];
      // bottom row - 3 containers
      for (let i = 0; i < 3; i++) {
        const c = colors[(i + Math.floor(rng() * 3)) % colors.length];
        parts.push(box(2.4, 1.0, 1.0, c, { x: -2.4 + i * 2.4, y: 0.5 }));
        // container door lines
        parts.push(box(0.04, 0.9, 0.02, 0x3a3e46, { x: -2.4 + i * 2.4 + 1.15, y: 0.5, z: 0.51 }));
        parts.push(box(0.04, 0.9, 0.02, 0x3a3e46, { x: -2.4 + i * 2.4 - 1.15, y: 0.5, z: 0.51 }));
      }
      // second row - 2 containers
      for (let i = 0; i < 2; i++) {
        const c = colors[(i + 2 + Math.floor(rng() * 2)) % colors.length];
        parts.push(box(2.4, 1.0, 1.0, c, { x: -1.2 + i * 2.4, y: 1.5 }));
      }
      // top container
      const topC = colors[Math.floor(rng() * colors.length)];
      parts.push(box(2.4, 1.0, 1.0, topC, { x: 0, y: 2.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 跨港天橋 harbor_bridge ------------------------------ */
  {
    id: 'harbor_bridge',
    displayName: '跨港天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 45,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7a8a, 0x8a9aa8, 0xd0d4da, 0x3a6ca8, 0xffe090],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Pedestrian/vehicle bridge spanning the harbor (simplified for tri budget)
      const parts = [
        // main deck girder (long span)
        box(8.0, 0.5, 1.5, 0x8a9aa8, { y: 2.8, hex2: 0x6a7a8a }),
        // side barriers (solid instead of posts)
        box(8.0, 0.4, 0.08, 0xd0d4da, { y: 3.2, z: 0.72 }),
        box(8.0, 0.4, 0.08, 0xd0d4da, { y: 3.2, z: -0.72 }),
      ];
      // support piers (2 instead of 3)
      for (let i = 0; i < 2; i++) {
        const x = -2.5 + i * 5.0;
        parts.push(cyl(0.4, 0.5, 2.6, 6, 0x6a7a8a, { x, y: 1.3 }));
        parts.push(box(1.2, 0.3, 1.6, 0x8a9aa8, { x, y: 2.55 })); // pier cap
      }
      // light poles (2 lights)
      parts.push(cyl(0.06, 0.06, 0.8, 4, 0x4a5460, { x: -2.0, y: 3.6 }));
      parts.push(box(0.2, 0.2, 0.2, 0xffe090, { x: -2.0, y: 4.05 }));
      parts.push(cyl(0.06, 0.06, 0.8, 4, 0x4a5460, { x: 2.0, y: 3.6 }));
      parts.push(box(0.2, 0.2, 0.2, 0xffe090, { x: 2.0, y: 4.05 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 停車塔 parking_tower ------------------------------- */
  {
    id: 'parking_tower',
    displayName: '停車塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x9aa0a6, 0x7a8088, 0xc0c4ca, 0x5a6068, 0xe0a838],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Mechanical car-stacker: a tall narrow concrete shaft with open deck
      // slots (dark gaps) and parked-car chips peeking out.
      const parts = [
        box(2.0, 7.0, 2.4, 0xffffff, { y: 3.6 }), // shaft (tinted concrete)
        // corner columns to emphasize the open-frame look
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: -1.15 }),
        box(2.0, 0.4, 2.4, 0x7a8088, { y: 7.3 }), // roof slab
        box(1.0, 0.7, 0.1, 0xe0a838, { y: 0.5, z: 1.22 }), // entry gate (yellow)
      ];
      // 6 deck floors: each a dark slot + a colored car chip on the front
      const carHex = [0xc94f46, 0x3f6cc4, 0xe0e0e0, 0x49a05f, 0xe0a838, 0x9a9a9a];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.62, 0.08, 0x20262e, { y, z: 1.18 })); // open deck shadow
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 })); // car chip
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 港區看板 port_billboard ----------------------------- */
  {
    id: 'port_billboard',
    displayName: '港區看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0x3a8080, 0xffd84d, 0xe8e8ee, 0x44484f],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // Harbor-district billboard: big bright panel on a lattice gantry
      const parts = [
        // gantry legs (wide A-stance)
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0, rz: 0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // billboard frame + bright face - maritime theme
        box(5.2, 2.4, 0.18, 0x2e3138, { y: 5.4 }), // frame
        box(5.0, 2.2, 0.06, 0x2f6db0, { y: 5.4, z: 0.13 }), // ad face (harbor blue)
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }), // top spotlight bar
      ];
      // maritime motifs on the ad face
      parts.push(box(1.6, 1.4, 0.04, 0xe8e8ee, { x: -1.2, y: 5.4, z: 0.17 })); // ship silhouette area
      parts.push(box(1.4, 1.2, 0.04, 0xffd84d, { x: 1.0, y: 5.4, z: 0.17 })); // sun/logo
      parts.push(box(2.0, 0.4, 0.04, 0x3a8080, { x: 0, y: 4.5, z: 0.17 })); // wave pattern
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
        // pediment
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

  /* ---- slot 8: 港邊商辦塔 waterfront_office_tower (CHUNK LANDMARK) -- */
  {
    id: 'waterfront_office_tower',
    displayName: '港邊商辦塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3e5066, 0x6a8aa8, 0x9abace, 0x232c38, 0xe6eef6],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Harbor-district office tower — maritime palette, blue-green glass
      return finish([
        // multi-floor podium
        box(4.2, 1.8, 3.4, 0xffffff, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x5a7088, { y: 1.85 }),
        // main banded shaft (tall) - cooler harbor colors
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x2a4050, 0xfff0c0, rng, { y: 6.5 }),
        // mullion fins front - maritime teal
        box(0.12, 9.0, 0.12, 0x2a4050, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a4050, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a4050, { x: 0.95, y: 6.5, z: 1.22 }),
        // first setback
        box(2.4, 0.4, 1.9, 0x6a8aa8, { y: 11.2 }),
        // tapered upper shaft
        towerBanded(1.9, 3.4, 1.6, 7, 0xe6eef6, 0x3a5060, 0xfff0c0, rng, { y: 13.1 }),
        // crown - harbor blue accent
        box(1.5, 0.6, 1.2, 0x9abace, { y: 15.1 }),
        cone(0.9, 1.2, 6, 0x4a6a80, { y: 16.0 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.6 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 18.9 }), // beacon
      ]);
    },
  },

  /* ---- slot 9: 港邊倉庫 warehouse_mass (CHUNK LANDMARK) ------------- */
  {
    id: 'warehouse_mass',
    displayName: '港邊倉庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x8a9098, 0xa0a8b0, 0x6a7078, 0xc94f46, 0x2f6db0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // A large warehouse complex mass - multiple connected sheds
      const parts = [];
      // Main warehouse A
      parts.push(box(4.0, 2.4, 3.0, 0x8a9098, { x: -2.2, y: 1.2, hex2: 0xa0a8b0 }));
      parts.push(cyl(1.5, 1.5, 4.2, 4, 0x7a8088, { theta0: PI, rx: HALF_PI, sy: 0.4, x: -2.2, y: 2.7 }));
      // Warehouse B (taller)
      parts.push(box(3.6, 3.0, 2.8, 0x9aa0a8, { x: 1.6, y: 1.5, hex2: 0x8a9098 }));
      parts.push(cyl(1.4, 1.4, 3.8, 4, 0x7a8088, { theta0: PI, rx: HALF_PI, sy: 0.4, x: 1.6, y: 3.3 }));
      // Loading docks
      parts.push(box(1.4, 1.8, 0.08, 0x5a6068, { x: -3.5, y: 0.9, z: 1.52 }));
      parts.push(box(1.4, 1.8, 0.08, 0x5a6068, { x: -0.9, y: 0.9, z: 1.52 }));
      parts.push(box(1.2, 2.2, 0.08, 0x5a6068, { x: 1.6, y: 1.1, z: 1.42 }));
      // Port numbers
      parts.push(box(0.6, 0.4, 0.05, 0x2f6db0, { x: -2.2, y: 2.0, z: 1.52 }));
      parts.push(box(0.6, 0.4, 0.05, 0x2f6db0, { x: 1.6, y: 2.6, z: 1.42 }));
      // Warning stripes
      parts.push(box(4.0, 0.15, 0.04, 0xc94f46, { x: -2.2, y: 0.1, z: 1.52 }));
      parts.push(box(3.6, 0.15, 0.04, 0xc94f46, { x: 1.6, y: 0.1, z: 1.42 }));
      // Connecting covered walkway
      parts.push(box(0.8, 0.4, 1.8, 0x6a7078, { x: -0.2, y: 2.4 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
