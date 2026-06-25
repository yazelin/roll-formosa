/**
 * @file packs/taichung/archetypes/t5.js — T5 「七期·草悟道商業」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the Roll Formosa Taichung ladder: the commercial /
 * civic district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK LANDMARKS
 * (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT declared in
 * packs/taichung/tiers.js — spelling must NOT drift.
 *
 * Taichung re-theme of the Taipei commercial tier: 商辦大樓 / 玻璃帷幕街屋 /
 * 商辦塔樓 / 百貨大樓 / 停車塔 / 銀行 / 巨型看板 stay as pan-Taiwan commercial
 * generics, but the district's signature 七期·草悟道 flavour replaces three
 * slots — 勤美綠園道 (green植生牆 retail), 捷運綠線高架 (Taichung MRT Green
 * Line), 草悟道綠廊樹 (Calligraphy Greenway tree-lined corridor).
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored BufferGeometry
 * built only from the geomHelpers vocabulary, normalized by finish() to a UNIT
 * bounding sphere (radius 1.0). Tri budget <= 350 — keep cyl/sph radial segment
 * counts low (6–10). rng() (0..1) is used only for small deterministic
 * variation (lit window bands, sign/leaf tints), never for structure.
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
  /* ---- slot 0: 七期商辦 qiqi_office (TAICHUNG SWAP: 7th Redevelopment Zone office) */
  {
    id: 'qiqi_office',
    displayName: '七期商辦',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a4a5a, 0x8fd0e8, 0x5a6a7a, 0x2e3844, 0xd0e8f0],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 七期商辦 — a typical Taichung 7th Redevelopment Zone glass office building
      // with the signature blue-tinted curtain wall and curved entrance canopy
      const parts = [
        // main banded glass shaft (七期風格 — 藍色玻璃帷幕)
        towerBanded(2.8, 7.4, 2.2, 14, 0xffffff, 0x2a4058, 0xd0f0ff, rng, { y: 3.8 }),
        // vertical mullion fins (七期玻璃建築特色)
        box(0.1, 7.4, 0.1, 0x2a4050, { x: -0.9, y: 3.8, z: 1.12 }),
        box(0.1, 7.4, 0.1, 0x2a4050, { x: 0.0, y: 3.8, z: 1.12 }),
        box(0.1, 7.4, 0.1, 0x2a4050, { x: 0.9, y: 3.8, z: 1.12 }),
        // curved entrance canopy (七期商辦特色 — 弧形入口雨遮)
        cyl(1.4, 1.4, 2.8, 8, 0xc0d8e8, { y: 1.0, z: 1.3, theta0: -HALF_PI, thetaLen: PI, rx: HALF_PI, sy: 0.25 }),
        // glass lobby base
        box(2.6, 1.1, 2.0, 0x1a2a38, { y: 0.55 }),
        box(1.2, 0.85, 0.06, 0x8fd0e8, { y: 0.5, z: 1.04 }), // bright lobby glass
        // setback crown with 台中七期風格
        box(2.4, 0.5, 1.9, 0xc0d8e8, { y: 7.75 }),
        box(2.4, 0.12, 1.9, 0x6a8090, { y: 8.05 }),
        // rooftop helipad marking (七期高樓特色)
        cyl(0.6, 0.6, 0.05, 8, 0xe8e8e8, { y: 8.15 }),
        box(0.8, 0.04, 0.1, 0xf0f0f0, { y: 8.16 }),
        box(0.1, 0.04, 0.8, 0xf0f0f0, { y: 8.16 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 勤美綠園道 green_facade_mall ----------------------- */
  {
    id: 'green_facade_mall',
    displayName: '勤美綠園道',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x3f7a4a, 0x6fb05a, 0xcfe6c0, 0x2e3a44, 0xe8f2dc],
    yOffset: -0.27,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Calligraphy-Greenway green-wall department block: a broad mass whose
      // street facade is a living vertical garden (植生牆) over a glass podium.
      const parts = [
        box(4.4, 4.6, 3.4, 0xffffff, { y: 2.5 }), // main mass (tinted)
        box(4.5, 0.3, 3.5, 0x6a8a5a, { y: 4.95 }), // planted cornice cap
        // glass display podium (ground 2 floors)
        box(4.6, 1.5, 0.4, 0x2b3640, { y: 0.95, z: 1.7 }), // dark glass frame
        box(4.2, 1.2, 0.06, 0xbcd0c4, { y: 0.95, z: 1.92 }), // bright display glass
        // entrance canopy (planted edge)
        box(2.0, 0.18, 1.0, 0x3f7a4a, { y: 1.9, z: 2.0 }),
        cyl(0.08, 0.08, 1.7, 6, 0x6a7a5a, { x: -0.8, y: 1.0, z: 2.4 }),
        cyl(0.08, 0.08, 1.7, 6, 0x6a7a5a, { x: 0.8, y: 1.0, z: 2.4 }),
        // signature living vertical-garden panel on the upper facade
        box(4.0, 2.6, 0.16, 0x2e3a30, { y: 3.5, z: 1.66 }), // green-wall backing
      ];
      // grid of foliage tufts forming the植生牆 (deterministic green mosaic)
      const leaf = [0x4f9a4a, 0x6fb05a, 0x3f7a4a, 0x88c46a];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const hex = leaf[(r + c + (rng() < 0.3 ? 1 : 0)) % 4];
          parts.push(box(0.74, 0.78, 0.1, hex, {
            x: -1.7 + c * 0.85, y: 2.7 + r * 0.84, z: 1.76,
          }));
        }
      }
      // a small rooftop tree finishing the garden block
      parts.push(cyl(0.07, 0.09, 0.5, 6, 0x6a513a, { x: 1.4, y: 5.4 }));
      parts.push(ico(0.6, 0, 0x4f9a4a, { x: 1.4, y: 5.95 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 捷運綠線高架 mrt_green_viaduct ---------------------- */
  {
    id: 'mrt_green_viaduct',
    displayName: '捷運綠線高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x3f9a52],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Taichung MRT Green Line: long box-girder deck on twin piers + a
      // green-liveried train car (the city's signature 綠線 metro).
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
      // a green-line train car sitting on the deck
      parts.push(box(4.2, 1.1, 1.2, 0xffffff, { y: 4.35 })); // car body (tinted)
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: 0.62 })); // window strip
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: -0.62 })); // window strip
      parts.push(box(4.3, 0.2, 1.24, 0x3f9a52, { y: 4.78 })); // green-line livery stripe
      parts.push(box(4.3, 0.18, 1.24, 0x2f7a40, { y: 4.95 })); // roof trim (deeper green)
      return finish(parts);
    },
  },

  /* ---- slot 3: 草悟道綠廊樹 greenway_tree ------------------------- */
  {
    id: 'greenway_tree',
    displayName: '草悟道綠廊樹',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4f9a4a, 0x6a513a, 0x3f7a3f, 0x88c46a, 0x9aa0a8],
    yOffset: -0.14,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      // A boulevard tree of the Calligraphy Greenway (草悟道綠廊): tall trunk,
      // layered ico canopy, with a circular planter ring + a bench at its foot.
      const parts = [
        // planter base ring + soil
        cyl(1.5, 1.6, 0.4, 8, 0x9aa0a8, { y: 0.2 }), // stone planter rim
        cyl(1.3, 1.3, 0.22, 8, 0x5a4a36, { y: 0.34 }), // soil
        // trunk
        cyl(0.26, 0.36, 3.4, 6, 0x6a513a, { y: 2.0 }),
        // a couple of low branches
        cyl(0.1, 0.14, 1.2, 5, 0x6a513a, { x: 0.5, y: 2.9, rz: -0.9 }),
        cyl(0.1, 0.14, 1.1, 5, 0x6a513a, { x: -0.45, y: 3.2, rz: 1.0 }),
      ];
      // layered canopy (3 ico blobs, slight rng tint per layer)
      const green = [0x4f9a4a, 0x3f7a3f, 0x6aae54];
      parts.push(ico(1.55, 0, green[0], { y: 4.2 }));
      parts.push(ico(1.2, 0, green[1], { x: 0.7, y: 4.9 }));
      parts.push(ico(1.15, 0, rng() < 0.5 ? green[2] : 0x88c46a, { x: -0.7, y: 4.7 }));
      // a wooden boulevard bench at the foot (the greenway's seating)
      parts.push(box(2.0, 0.12, 0.5, 0x7a5a3a, { x: 0, y: 0.7, z: 1.7 })); // seat
      parts.push(box(2.0, 0.5, 0.1, 0x6a4d30, { x: 0, y: 0.95, z: 1.92 })); // backrest
      for (const bx of [-0.8, 0.8]) {
        parts.push(box(0.12, 0.5, 0.12, 0x5a5a5a, { x: bx, y: 0.45, z: 1.7 })); // legs
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 審計新村 shengjicun (TAICHUNG SWAP: Shengjicun market) - */
  {
    id: 'shengjicun',
    displayName: '審計新村',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xc4b8a0, 0x6a8a5a, 0xc23a2e, 0x9a8a72],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 審計新村 — the retro government dormitory village turned creative market:
      // rows of 2-storey refurbished concrete dorms with colorful awnings + vendors.
      const parts = [
        // ground plaza / paved court
        box(5.0, 0.16, 3.6, 0xc4b8a0, { y: 0.08 }),
        // main dormitory building (boxy 50s concrete, repainted cream)
        box(3.8, 2.0, 2.2, 0xf0e8d8, { y: 1.1, hex2: 0xe8e0d0 }),
        box(3.9, 0.12, 2.3, 0x9a8a72, { y: 2.18 }), // roof slab / eave
        // the signature外走廊 (exterior corridor) with colorful canopy
        box(4.0, 0.1, 0.6, 0xc23a2e, { y: 1.7, z: 1.35 }), // red canopy
        box(4.0, 0.1, 0.6, 0x3f8a52, { y: 1.35, z: 1.35 }), // green lower canopy band
        // corridor support posts (simplified: 3 posts as boxes)
        box(0.12, 1.5, 0.12, 0x8a7a62, { x: -1.2, y: 0.85, z: 1.55 }),
        box(0.12, 1.5, 0.12, 0x8a7a62, { x: 0, y: 0.85, z: 1.55 }),
        box(0.12, 1.5, 0.12, 0x8a7a62, { x: 1.2, y: 0.85, z: 1.55 }),
        // simplified market stalls (2 tables + 2 awnings as boxes)
        box(1.0, 0.55, 0.7, 0x9a7a52, { x: -1.2, y: 0.4, z: -0.9 }), // table 1
        box(1.0, 0.55, 0.7, 0x9a7a52, { x: 1.0, y: 0.4, z: -0.9 }), // table 2
        box(1.2, 0.08, 0.8, 0xc23a2e, { x: -1.2, y: 1.1, z: -0.9 }), // awning 1
        box(1.2, 0.08, 0.8, 0x3f8a52, { x: 1.0, y: 1.1, z: -0.9 }), // awning 2
        // hanging lights as boxes instead of spheres
        box(0.18, 0.18, 0.18, 0xffd040, { x: -1.4, y: 1.0, z: 0.3 }),
        box(0.18, 0.18, 0.18, 0xc23a2e, { x: 0, y: 1.0, z: 0.3 }),
        box(0.18, 0.18, 0.18, 0x2a55a8, { x: 1.4, y: 1.0, z: 0.3 }),
      ];
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

  /* ---- slot 6: 精明一街店舖 jingming_shop (TAICHUNG SWAP: Jingming Street shop) */
  {
    id: 'jingming_shop',
    displayName: '精明一街店舖',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xc8b8a0, 0x8a7a5a, 0xe0d0b8, 0xd8c8b0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 精明一街店舖 — a European-style cafe/boutique building on Jingming Street
      // (台中精明一街 — 歐式露天咖啡街)
      const parts = [
        // main cream/stone body (精明一街歐風建築)
        box(2.4, 4.8, 2.2, 0xf0e8d8, { y: 2.6 }),
        // decorative cornice moldings (歐式線腳)
        box(2.5, 0.16, 2.3, 0xe0d0b8, { y: 5.1 }),
        box(2.5, 0.12, 2.3, 0xc8b8a0, { y: 4.95 }),
        // arched windows per floor (歐風拱窗)
        cyl(0.4, 0.4, 0.06, 8, 0x3a4a5a, { y: 3.8, z: 1.12, theta0: 0, thetaLen: PI }),
        box(0.8, 0.7, 0.06, 0x3a4a5a, { y: 3.4, z: 1.12 }),
        cyl(0.4, 0.4, 0.06, 8, 0x3a4a5a, { y: 2.2, z: 1.12, theta0: 0, thetaLen: PI }),
        box(0.8, 0.7, 0.06, 0x3a4a5a, { y: 1.8, z: 1.12 }),
        // ground-floor cafe/shop with awning (露天咖啡座)
        box(2.2, 0.9, 0.1, 0x3a3a40, { y: 0.5, z: 1.1 }),
        box(1.6, 0.7, 0.06, 0xf0d8a0, { y: 0.55, z: 1.14 }), // warm cafe glow
        // striped canvas awning (咖啡街招牌遮陽棚)
        box(2.4, 0.08, 0.8, 0xc83828, { y: 1.05, z: 1.4, rz: -0.15 }),
        box(2.4, 0.06, 0.1, 0xf0e8d8, { y: 1.02, z: 1.3 }),
        // decorative balustrade on top (歐式欄杆)
        box(2.3, 0.3, 0.1, 0xd8c8b0, { y: 5.25, z: 1.05 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 建國市場 jianguo_market (TAICHUNG SWAP: Jianguo Market Hall) */
  {
    id: 'jianguo_market',
    displayName: '建國市場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 30,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc4281f, 0xf0e8d8, 0x8a7a62, 0x3a6ca8, 0xe8b840],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 建國市場 — Taichung's massive traditional wholesale market hall:
      // a long corrugated-roof hangar with vendor stalls and a red arched entrance.
      const parts = [
        // main market hall (long low building with corrugated roof)
        box(5.6, 2.2, 3.4, 0xf0e8d8, { y: 1.3, hex2: 0xe0d8c8 }),
        // corrugated roof (arched metal)
        cyl(3.0, 3.0, 5.8, 8, 0x9aa0a8, { rx: HALF_PI, y: 2.8, theta0: 0, thetaLen: PI }),
        // red entrance arch (the signature red gate)
        box(0.4, 2.6, 2.4, 0xc4281f, { x: -2.9, y: 1.5 }),
        box(0.4, 2.6, 2.4, 0xc4281f, { x: 2.9, y: 1.5 }),
        // arched top connecting the entrance pillars
        box(5.4, 0.5, 0.5, 0xc4281f, { y: 2.9, z: 1.7 }),
        // entrance sign board
        box(3.0, 0.6, 0.1, 0xe8b840, { y: 2.6, z: 1.75 }),
        // vendor stalls inside (simplified as colored boxes peeking out)
        box(1.2, 0.6, 0.8, 0x3a6ca8, { x: -1.5, y: 0.8, z: 1.2 }),
        box(1.2, 0.6, 0.8, 0xc4281f, { x: 0.8, y: 0.8, z: 1.2 }),
        box(1.0, 0.5, 0.6, 0xe8b840, { x: -0.3, y: 0.75, z: 1.2 }),
        // side loading dock
        box(1.2, 0.3, 3.0, 0x8a7a62, { x: 2.5, y: 0.15 }),
        // hanging banners from the roof edge (market atmosphere)
        box(0.08, 0.8, 0.4, 0xc4281f, { x: -1.5, y: 2.6, z: 1.7 }),
        box(0.08, 0.8, 0.4, 0xe8b840, { x: 0.5, y: 2.6, z: 1.7 }),
        box(0.08, 0.8, 0.4, 0x3a6ca8, { x: 1.5, y: 2.6, z: 1.7 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 新光三越塔 shinkong_tower (CHUNK LANDMARK: TAICHUNG SWAP) */
  {
    id: 'shinkong_tower',
    displayName: '新光三越塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xc8b8a0, 0xf0e8d8, 0x8a7a60, 0xb84040, 0xe8dcc8],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 新光三越塔 — Shinkong Mitsukoshi department store tower (台中新光三越)
      // with distinctive stone facade and red brand signage
      const parts = [
        // wide retail podium (百貨裙樓)
        box(4.4, 2.2, 3.6, 0xf0e8d8, { y: 1.1 }),
        box(4.5, 0.2, 3.7, 0xc8b8a0, { y: 2.3 }),
        // main tower shaft (石材外牆)
        towerBanded(3.2, 8.6, 2.6, 12, 0xf0e8d8, 0x3a4a58, 0xfff0c8, rng, { y: 6.65 }),
        // signature red brand band (新光紅色招牌)
        box(3.3, 0.6, 0.12, 0xb84040, { y: 10.6, z: 1.32 }),
        box(3.0, 0.45, 0.06, 0xf8f0e0, { y: 10.6, z: 1.38 }),
        // setback crown
        box(2.6, 0.5, 2.1, 0xe8dcc8, { y: 11.2 }),
        // rooftop signage pylon (樓頂招牌)
        box(0.8, 1.6, 0.3, 0xb84040, { y: 12.3 }),
        box(0.6, 1.4, 0.1, 0xf8f0e0, { y: 12.3, z: 0.16 }),
        // antenna
        cyl(0.06, 0.06, 1.8, 6, 0xa0a8b0, { y: 13.8 }),
        sph(0.12, 0xff4040, { ws: 6, hs: 4, y: 14.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 9: 大遠百 dayuanbai (CHUNK LANDMARK: TAICHUNG SWAP) --- */
  {
    id: 'dayuanbai',
    displayName: '大遠百',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 52,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xd8d0c4, 0xf0e8dc, 0x7a7060, 0x2860a8, 0xe8e0d4],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // 大遠百 — Far Eastern Department Store Taichung (台中大遠百)
      // with distinctive blue branding and curved glass atrium
      const parts = [
        // broad retail base with curved glass front
        box(5.4, 3.4, 4.0, 0xf0e8dc, { y: 1.9 }),
        box(4.0, 2.4, 3.2, 0xf0e8dc, { y: 4.9 }),
        box(5.5, 0.28, 4.1, 0xc8c0b0, { y: 3.7 }),
        box(4.1, 0.28, 3.3, 0xc8c0b0, { y: 6.15 }),
        // curved glass atrium bay (大遠百玻璃中庭)
        cyl(1.4, 1.4, 4.4, 9, 0x80c0e8, { y: 2.2, z: 2.0, rx: HALF_PI, theta0: -HALF_PI, thetaLen: PI }),
        box(2.4, 4.2, 0.12, 0x2a3844, { y: 2.2, z: 1.9 }),
        // signature blue FE brand band (遠東藍)
        box(3.0, 0.5, 0.12, 0x2860a8, { y: 6.5, z: 1.64 }),
        box(2.7, 0.35, 0.06, 0xf8f8f0, { y: 6.5, z: 1.7 }),
        // entrance canopy
        box(3.0, 0.2, 1.0, 0x2860a8, { y: 1.4, z: 2.5 }),
        // rooftop equipment + pylon
        box(1.3, 0.6, 0.9, 0x6a6058, { x: 0.9, y: 6.6 }),
        box(0.5, 1.6, 0.4, 0x2860a8, { x: -1.3, y: 7.1 }),
        box(0.35, 1.4, 0.1, 0xf8f8f0, { x: -1.3, y: 7.1, z: 0.2 }),
      ];
      // lit window rows
      for (let i = 0; i < 6; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5a6470;
        parts.push(box(0.5, 0.55, 0.05, lit, { x: -2.2 + i * 0.85, y: 3.0, z: 2.02 }));
      }
      for (let i = 0; i < 4; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5a6470;
        parts.push(box(0.5, 0.45, 0.05, lit, { x: -1.3 + i * 0.85, y: 5.3, z: 1.62 }));
      }
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
