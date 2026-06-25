/**
 * @file packs/tainan/archetypes/t5.js — Tainan pack T5 「東區商圈」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / civic
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/taipei/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 林百貨風格樓 linbai_tower — Art Deco style (Tainan) ---- */
  {
    id: 'linbai_tower',
    displayName: '林百貨風格樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8c8a8, 0xe8dcc0, 0xb8a888, 0x8a7a5a, 0xf0e8d0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Art Deco style mid-rise inspired by Tainan's historic 林百貨
      const parts = [
        // main body (stone-tinted)
        box(3.0, 5.8, 2.4, 0xffffff, { y: 3.0 }),
        // horizontal band lines (Art Deco motif)
        box(3.1, 0.12, 2.5, 0xb8a888, { y: 1.2 }),
        box(3.1, 0.12, 2.5, 0xb8a888, { y: 2.4 }),
        box(3.1, 0.12, 2.5, 0xb8a888, { y: 3.6 }),
        box(3.1, 0.12, 2.5, 0xb8a888, { y: 4.8 }),
        // vertical pilasters (Art Deco)
        box(0.2, 5.8, 0.1, 0xc8b898, { x: -1.3, y: 3.0, z: 1.22 }),
        box(0.2, 5.8, 0.1, 0xc8b898, { x: 1.3, y: 3.0, z: 1.22 }),
        // corner tower element (signature Tainan Art Deco)
        box(0.8, 1.2, 0.8, 0xe8dcc0, { x: -1.0, y: 6.5, z: 1.0 }),
        box(0.6, 0.8, 0.6, 0xd8c8a8, { x: -1.0, y: 7.3, z: 1.0 }),
        // ground-floor arcade entry
        box(2.8, 1.0, 2.2, 0x4a3a2a, { y: 0.5 }),
        box(1.2, 0.8, 0.06, 0xc8b898, { y: 0.5, z: 1.22 }), // door
        // parapet decoration
        box(3.2, 0.3, 2.6, 0xb8a888, { y: 6.05 }),
      ];
      // windows (grid)
      for (let f = 0; f < 4; f++) {
        for (let w = 0; w < 3; w++) {
          const lit = rng() < 0.4 ? 0xfff0c0 : 0x4a5a6a;
          parts.push(box(0.5, 0.7, 0.05, lit, { x: -0.9 + w * 0.9, y: 1.6 + f * 1.2, z: 1.22 }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 1: 虱目魚店 milkfish_shop — Tainan's signature milkfish shop */
  {
    id: 'milkfish_shop',
    displayName: '虱目魚店',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a8ab0, 0x6ab0d0, 0x3a6a88, 0xf0f8fc, 0xc8e0f0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Tainan's iconic milkfish shop: low-rise seafood restaurant with tanks
      const parts = [
        // main shop body (two-story)
        box(4.4, 3.0, 3.4, 0xf0f8fc, { y: 1.7 }),
        // blue-tiled lower facade (seafood shop style)
        box(4.5, 1.2, 0.2, 0x4a8ab0, { y: 0.6, z: 1.72 }),
        // large shop sign across the top
        box(4.2, 0.8, 0.14, 0x3a6a88, { y: 2.9, z: 1.74 }),
        box(3.8, 0.6, 0.06, 0xfff0c0, { y: 2.9, z: 1.82 }), // lit sign face
        // awning over entrance
        box(4.6, 0.12, 1.4, 0x6ab0d0, { y: 2.0, z: 2.3, rx: -0.1 }),
        // fish tanks at ground level (stainless + glass)
        box(1.6, 0.9, 0.8, 0xd8e4ea, { x: -1.2, y: 0.5, z: 1.5 }),
        box(1.4, 0.7, 0.06, 0x8ac8e0, { x: -1.2, y: 0.55, z: 1.92 }), // glass front
        box(1.6, 0.9, 0.8, 0xd8e4ea, { x: 1.2, y: 0.5, z: 1.5 }),
        box(1.4, 0.7, 0.06, 0x8ac8e0, { x: 1.2, y: 0.55, z: 1.92 }), // glass front
        // entrance door
        box(1.0, 1.6, 0.08, 0x3a4a58, { y: 0.9, z: 1.76 }),
        // rooftop water tank
        cyl(0.5, 0.5, 0.7, 8, 0x3a6ea0, { x: 1.5, y: 3.55 }),
        // second floor windows
        box(1.2, 0.6, 0.06, 0x6a8aa0, { x: -1.3, y: 2.4, z: 1.74 }),
        box(1.2, 0.6, 0.06, 0x6a8aa0, { x: 1.3, y: 2.4, z: 1.74 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 台鐵高架 tainan_railway ----------------------------- */
  {
    id: 'tainan_railway',
    displayName: '台鐵高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x5a4a3a],
    yOffset: -0.6104,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Elevated TRA railway: a long concrete track deck on a row of stout
      // pillars, with a railing and a hint of rail track on top.
      const parts = [
        // continuous concrete track deck (long along X)
        box(9.0, 0.7, 1.8, 0xffffff, { y: 3.4 }), // deck (tinted concrete)
        box(9.0, 0.5, 0.16, 0x8a9098, { y: 3.65, z: 0.92 }), // side railing
        box(9.0, 0.5, 0.16, 0x8a9098, { y: 3.65, z: -0.92 }), // side railing
      ];
      // a few railing posts along both edges
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(box(0.08, 0.5, 0.08, 0x6a7078, { x, y: 3.65, z: 0.92 }));
        parts.push(box(0.08, 0.5, 0.08, 0x6a7078, { x, y: 3.65, z: -0.92 }));
      }
      // stout pillars at intervals
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.55, 0.62, 3.1, 6, 0xc2c6cc, { x, y: 1.55 }));
        parts.push(box(1.4, 0.4, 1.9, 0xb0b6be, { x, y: 3.05 })); // pier cap
      }
      // hint of twin steel rail track on top of the deck
      parts.push(box(9.0, 0.1, 0.1, 0x5a4a3a, { y: 3.8, z: 0.35 }));
      parts.push(box(9.0, 0.1, 0.1, 0x5a4a3a, { y: 3.8, z: -0.35 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 神農街街屋 shennong_street — historic Tainan street row */
  {
    id: 'shennong_street',
    displayName: '神農街街屋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8c8a8, 0xe8dcc0, 0xc8b8a0, 0x9a8a70, 0xf0e8d0],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Historic Shennong Street row: 3-4 low narrow shop-houses with traditional facades
      const parts = [];
      const heights = [2.4, 2.8, 2.2, 2.6];
      const xs = [-2.4, -0.8, 0.8, 2.4];
      const wallTints = [0xe8dcc0, 0xd8c8a8, 0xf0e4d0, 0xc8b8a0];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // narrow traditional shop-house body
        parts.push(box(1.4, h, 1.8, wallTints[i], { x: xs[i], y: h / 2 }));
        // dark wooden door frame at ground level
        parts.push(box(0.7, 1.2, 0.08, 0x5a4a30, { x: xs[i], y: 0.7, z: 0.92 }));
        // traditional horizontal window above door
        parts.push(box(1.0, 0.4, 0.06, 0x4a5a6a, { x: xs[i], y: h * 0.7, z: 0.92 }));
        // parapet / simple cornice
        parts.push(box(1.5, 0.15, 1.9, 0x9a8a70, { x: xs[i], y: h + 0.08 }));
        // hanging red lantern (every other shop)
        if (i % 2 === 0) {
          parts.push(sph(0.2, 0xc83020, { ws: 6, hs: 4, x: xs[i] + 0.4, y: h * 0.55, z: 1.0 }));
        }
      }
      // continuous ground-level stone pavement
      parts.push(box(6.6, 0.12, 2.0, 0xa89880, { y: 0.06, z: 0.2 }));
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

  /* ---- slot 6: 安平老街商家 anping_old_shop — Anping old street shop row */
  {
    id: 'anping_old_shop',
    displayName: '安平老街商家',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8b898, 0xd8c8a8, 0xa89878, 0x8a7a58, 0xe8d8c0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Anping old street shop: low-rise with awning and displays
      const parts = [
        // main shop body (weathered plaster walls)
        box(3.2, 3.4, 2.4, 0xffffff, { y: 1.9 }),
        // sloped tile roof
        cyl(1.4, 1.4, 3.4, 4, 0x8a6a4a, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.8 }),
        // front awning (striped canvas)
        box(3.4, 0.08, 1.2, 0xc83828, { y: 2.6, z: 1.6, rx: -0.15 }),
        box(3.4, 0.06, 0.15, 0xf0f0e0, { y: 2.55, z: 2.15 }), // awning edge
        // open storefront display
        box(2.8, 1.4, 0.08, 0x3a3a30, { y: 0.9, z: 1.22 }), // dark open front
        // display tables with goods (shrimp crackers, dried fruit)
        box(1.2, 0.4, 0.6, 0x9a8a70, { x: -0.7, y: 0.4, z: 1.5 }), // table
        box(1.2, 0.4, 0.6, 0x9a8a70, { x: 0.7, y: 0.4, z: 1.5 }), // table
        // merchandise on tables (colored boxes/baskets)
        box(0.4, 0.2, 0.4, 0xd8a050, { x: -0.9, y: 0.7, z: 1.5 }),
        box(0.4, 0.2, 0.4, 0xc83020, { x: -0.5, y: 0.7, z: 1.5 }),
        box(0.4, 0.2, 0.4, 0x4a8a40, { x: 0.5, y: 0.7, z: 1.5 }),
        box(0.4, 0.2, 0.4, 0xe8b860, { x: 0.9, y: 0.7, z: 1.5 }),
        // shop sign above
        box(2.6, 0.5, 0.1, 0xc83020, { y: 2.9, z: 1.26 }),
        box(2.2, 0.35, 0.06, 0xf0e8c0, { y: 2.9, z: 1.32 }), // lit sign face
        // second floor window
        box(2.0, 0.5, 0.06, 0x5a6a7a, { y: 2.3, z: -1.18 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 德記洋行 deji_trading — Tainan's historic trading house */
  {
    id: 'deji_trading',
    displayName: '德記洋行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf0f0e8, 0xe8e0d0, 0xc8c0b0, 0x4a8a50, 0x8a7a60],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Historic white colonial trading house with arched veranda (德記洋行 style)
      const parts = [
        // main two-story white body
        box(4.4, 3.8, 3.2, 0xffffff, { y: 2.1 }),
        // green shuttered windows (upper floor)
        box(0.6, 0.9, 0.08, 0x4a8a50, { x: -1.4, y: 3.0, z: 1.62 }),
        box(0.6, 0.9, 0.08, 0x4a8a50, { x: 0.0, y: 3.0, z: 1.62 }),
        box(0.6, 0.9, 0.08, 0x4a8a50, { x: 1.4, y: 3.0, z: 1.62 }),
        // arched arcade/veranda at ground floor
        box(4.6, 1.4, 1.0, 0xe8e0d0, { y: 0.9, z: 1.2 }),
      ];
      // arcade arches (3 bays)
      for (let i = 0; i < 3; i++) {
        const ax = -1.4 + i * 1.4;
        // dark archway opening
        parts.push(box(0.9, 1.0, 0.12, 0x3a3a30, { x: ax, y: 0.7, z: 1.72 }));
        // arch top (half cylinder)
        parts.push(cyl(0.45, 0.45, 0.12, 6, 0x3a3a30, { x: ax, y: 1.2, z: 1.72, rx: HALF_PI, thetaLen: PI, theta0: 0 }));
      }
      // columns between arches
      parts.push(cyl(0.15, 0.15, 1.4, 6, 0xe8e0d0, { x: -0.7, y: 0.9, z: 1.68 }));
      parts.push(cyl(0.15, 0.15, 1.4, 6, 0xe8e0d0, { x: 0.7, y: 0.9, z: 1.68 }));
      // low-pitched roof
      box(4.6, 0.3, 3.4, 0x8a7a60, { y: 4.15 });
      parts.push(box(4.6, 0.15, 3.4, 0x8a6a50, { y: 4.32 }));
      // cornice band
      parts.push(box(4.5, 0.15, 3.3, 0xc8c0b0, { y: 4.0 }));
      // entrance steps
      parts.push(box(2.0, 0.2, 0.5, 0xa89878, { y: 0.1, z: 2.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 商辦塔樓 commercial_tower (CHUNK LANDMARK) --------- */
  {
    id: 'commercial_tower',
    displayName: '商辦塔樓',
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
      // Big setback skyscraper — the district's repeatable landmark mass:
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
