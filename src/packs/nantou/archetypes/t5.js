/**
 * @file archetypes/t5.js — Nantou pack T5 「清境農場」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the highland resort / farm
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/nantou/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 觀光飯店 resort_hotel ------------------------------- */
  {
    id: 'resort_hotel',
    displayName: '觀光飯店',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8c8b0, 0xe8dcc4, 0x8a7e66, 0xb84a3a, 0xf0e8d8],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 日月潭風格觀光飯店: broad stone block with balconied facade
      const parts = [
        box(4.4, 4.6, 3.4, 0xffffff, { y: 2.5 }), // main stone mass (tinted)
        box(4.5, 0.3, 3.5, 0x9a8a72, { y: 4.95 }), // cornice cap
        // glass lobby (ground 2 floors) wrapping the front
        box(4.6, 1.5, 0.4, 0x2b3640, { y: 0.95, z: 1.7 }), // dark glass frame
        box(4.2, 1.2, 0.06, 0xb9c8da, { y: 0.95, z: 1.92 }), // bright display glass
        // entrance canopy
        box(2.0, 0.18, 1.0, 0xb84a3a, { y: 1.9, z: 2.0 }),
        cyl(0.08, 0.08, 1.7, 6, 0x8a7a64, { x: -0.8, y: 1.0, z: 2.4 }),
        cyl(0.08, 0.08, 1.7, 6, 0x8a7a64, { x: 0.8, y: 1.0, z: 2.4 }),
        // vertical brand band on the corner - 日月潭風
        box(0.5, 3.6, 0.12, 0x2a6a5a, { x: -2.15, y: 2.9, z: 1.66 }), // 湖水綠
        box(0.34, 3.2, 0.06, 0xf0e0c8, { x: -2.15, y: 2.9, z: 1.73 }),
      ];
      // a row of square clerestory windows along the upper facade
      for (let i = 0; i < 6; i++) {
        const lit = rng() < 0.5 ? 0xfff0c8 : 0x6a7280;
        parts.push(box(0.42, 0.5, 0.05, lit, { x: -1.7 + i * 0.68, y: 4.0, z: 1.72 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 1: 民宿 minsu_cottage ------------------------------ */
  {
    id: 'minsu_cottage',
    displayName: '民宿',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8c8a8, 0xe8d8c0, 0x8a7a60, 0x6a4a30, 0xf0e8d0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 清境民宿: cozy 2-storey gable-roof cottage
      const parts = [
        box(2.4, 1.8, 2.0, 0xffffff, { y: 0.9, hex2: 0xe8d8c0 }), // main body
        // gable roof
        cyl(1.4, 1.4, 2.6, 4, 0x8a5030, { theta0: PI, rx: HALF_PI, sy: 0.6, y: 2.1 }),
        box(2.5, 0.12, 2.1, 0x7a4a28, { y: 1.8 }), // eave lip
        // chimney
        box(0.3, 0.8, 0.3, 0x6a4a30, { x: 0.7, y: 2.5 }),
        // front porch
        box(1.8, 0.16, 0.8, 0xc8b898, { y: 0.08, z: 1.4 }), // deck
        cyl(0.1, 0.1, 1.2, 6, 0x8a7a60, { x: -0.7, y: 0.6, z: 1.7 }), // porch column
        cyl(0.1, 0.1, 1.2, 6, 0x8a7a60, { x: 0.7, y: 0.6, z: 1.7 }), // porch column
        box(1.6, 0.1, 0.6, 0x8a5030, { y: 1.2, z: 1.5 }), // porch roof
        // windows with warm glow
        box(0.5, 0.5, 0.06, rng() < 0.5 ? 0xffe8a0 : 0x8ab0c0, { x: -0.6, y: 1.1, z: 1.02 }),
        box(0.5, 0.5, 0.06, rng() < 0.5 ? 0xffe8a0 : 0x8ab0c0, { x: 0.6, y: 1.1, z: 1.02 }),
        // door
        box(0.4, 0.8, 0.06, 0x5a3a20, { y: 0.4, z: 1.02 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 纜車柱 ropeway_pole ----------------------------- */
  {
    id: 'ropeway_pole',
    displayName: '纜車柱',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0xc83030],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // 日月潭纜車 support tower: A-frame steel pylon
      const parts = [
        // A-frame legs
        cyl(0.28, 0.35, 4.5, 6, 0xc83030, { rz: 0.12, x: -0.6, y: 2.25 }), // left leg (red)
        cyl(0.28, 0.35, 4.5, 6, 0xc83030, { rz: -0.12, x: 0.6, y: 2.25 }), // right leg (red)
        // cross braces
        box(1.6, 0.18, 0.18, 0x8a9098, { y: 1.5 }),
        box(1.4, 0.18, 0.18, 0x8a9098, { y: 3.0 }),
        box(1.2, 0.18, 0.18, 0x8a9098, { y: 4.2 }),
        // cable sheave housing at top
        box(1.0, 0.5, 0.6, 0x6a7078, { y: 4.7 }),
        cyl(0.35, 0.35, 0.2, 8, 0xb0b6be, { rx: HALF_PI, y: 4.7, z: 0.4 }), // sheave wheel
        cyl(0.35, 0.35, 0.2, 8, 0xb0b6be, { rx: HALF_PI, y: 4.7, z: -0.4 }), // sheave wheel
        // cable lines (simplified as thin boxes)
        box(6.0, 0.04, 0.04, 0x44484f, { y: 4.65, rz: 0.1 }),
        box(6.0, 0.04, 0.04, 0x44484f, { y: 4.75, rz: -0.05 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 景觀天橋 skywalk_bridge ----------------------------- */
  {
    id: 'skywalk_bridge',
    displayName: '景觀天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc6ccd2, 0x9aa0a8, 0xe0e4ea, 0x6a7078, 0x4a8a5a],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // 清境天空步道風格: elevated glass-deck walkway
      const parts = [
        // span deck
        box(6.4, 0.32, 1.3, 0xffffff, { y: 2.6 }), // walkway (tinted)
        // glass floor panels (blue tint)
        box(5.8, 0.08, 1.0, 0x88c0d0, { y: 2.48 }),
        // railings (perforated read = thin top rail + posts)
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: 0.6 }),
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: -0.6 }),
        // glass panel railings
        box(6.2, 0.4, 0.04, 0xa0d0e0, { y: 2.95, z: 0.58 }),
        box(6.2, 0.4, 0.04, 0xa0d0e0, { y: 2.95, z: -0.58 }),
      ];
      // support pylons
      for (let i = 0; i < 3; i++) {
        const x = -2.4 + i * 2.4;
        parts.push(cyl(0.2, 0.25, 2.4, 6, 0x9aa0a8, { x, y: 1.2 })); // pylon
        parts.push(box(0.5, 0.2, 1.4, 0xc6ccd2, { x, y: 2.46 })); // deck support beam
      }
      // observation platforms at ends
      for (const sx of [-3.4, 3.4]) {
        parts.push(box(1.2, 0.2, 1.6, 0xe0e4ea, { x: sx, y: 2.52 })); // platform
        parts.push(box(1.0, 0.6, 0.04, 0xa0d0e0, { x: sx, y: 2.85, z: 0.78 })); // glass rail
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 停車場 parking_lot ------------------------------- */
  {
    id: 'parking_lot',
    displayName: '停車場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x606468, 0x7a7e82, 0xffffff, 0xe0c040, 0x9aa0a6],
    yOffset: -0.72,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 清境觀光停車場: open asphalt lot with parked cars
      const parts = [
        box(5.0, 0.12, 4.0, 0x606468, { y: 0.06 }), // asphalt surface
        // parking lines
        box(4.6, 0.02, 0.08, 0xffffff, { y: 0.13, z: -1.5 }),
        box(4.6, 0.02, 0.08, 0xffffff, { y: 0.13, z: 0 }),
        box(4.6, 0.02, 0.08, 0xffffff, { y: 0.13, z: 1.5 }),
      ];
      // perpendicular parking lines
      for (let i = 0; i < 6; i++) {
        parts.push(box(0.08, 0.02, 1.4, 0xffffff, { x: -2.0 + i * 0.8, y: 0.13, z: -0.75 }));
        parts.push(box(0.08, 0.02, 1.4, 0xffffff, { x: -2.0 + i * 0.8, y: 0.13, z: 0.75 }));
      }
      // parked cars (simplified)
      const carColors = [0xc94f46, 0x3f6cc4, 0xffffff, 0x2e7a46, 0xe0c040];
      for (let i = 0; i < 4; i++) {
        const x = -1.6 + i * 1.0;
        const z = (i % 2) ? 0.75 : -0.75;
        parts.push(box(0.7, 0.4, 0.5, carColors[i % 5], { x, y: 0.32, z }));
        parts.push(box(0.5, 0.2, 0.45, 0x28323e, { x, y: 0.5, z })); // windshield
      }
      // lot light pole
      parts.push(cyl(0.08, 0.08, 1.8, 6, 0x9aa0a6, { x: 2.2, y: 0.9, z: 1.5 }));
      parts.push(box(0.4, 0.1, 0.2, 0xffe8a0, { x: 2.2, y: 1.85, z: 1.5 })); // light
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
      // 清境/日月潭 roadside billboard
      const parts = [
        // gantry legs (wide A-stance)
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0, rz: 0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // billboard frame + bright face - 清境農場/日月潭風景區
        box(5.2, 2.4, 0.18, 0x2e3138, { y: 5.4 }), // frame
        box(5.0, 2.2, 0.06, 0xffffff, { y: 5.4, z: 0.13 }), // ad face (tinted bright)
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }), // top spotlight bar
      ];
      // color blocks on the ad face (清境主題色: 草原綠/天空藍)
      const adHex = [0x4a9a5a, 0x6ac0e0, 0xffd84d, 0xffffff];
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

  /* ---- slot 6: 歐式木屋 alpine_chalet ------------------- */
  {
    id: 'alpine_chalet',
    displayName: '歐式木屋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6040, 0xb08060, 0xd8c8a8, 0x5a4030, 0xf0e8d0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 清境小瑞士風格 Alpine chalet
      const parts = [
        // stone/plaster base
        box(2.8, 1.2, 2.2, 0xd8c8a8, { y: 0.6 }),
        // wooden upper floor
        box(2.9, 1.4, 2.3, 0x8a6040, { y: 1.9, hex2: 0xb08060 }),
        // steep gable roof (Alpine style)
        cyl(1.8, 1.8, 3.1, 4, 0x5a4030, { theta0: PI, rx: HALF_PI, sy: 0.8, y: 3.2 }),
        // wooden beam details
        box(3.0, 0.12, 0.12, 0x5a4030, { y: 1.18, z: 1.1 }), // eave beam
        box(0.12, 1.4, 0.12, 0x5a4030, { x: -1.3, y: 1.9, z: 1.12 }), // corner post
        box(0.12, 1.4, 0.12, 0x5a4030, { x: 1.3, y: 1.9, z: 1.12 }), // corner post
        // balcony with flower boxes
        box(2.4, 0.1, 0.5, 0x8a6040, { y: 1.25, z: 1.35 }), // balcony floor
        box(2.4, 0.3, 0.08, 0x8a6040, { y: 1.45, z: 1.55 }), // balcony rail
        box(0.5, 0.2, 0.15, 0xe04040, { x: -0.7, y: 1.4, z: 1.5 }), // flower box (red)
        box(0.5, 0.2, 0.15, 0xe04040, { x: 0.7, y: 1.4, z: 1.5 }), // flower box (red)
        // windows
        box(0.5, 0.6, 0.06, rng() < 0.5 ? 0xffe8a0 : 0x8ab0c0, { x: -0.6, y: 2.0, z: 1.16 }),
        box(0.5, 0.6, 0.06, rng() < 0.5 ? 0xffe8a0 : 0x8ab0c0, { x: 0.6, y: 2.0, z: 1.16 }),
        // chimney
        box(0.35, 0.9, 0.35, 0x7a5a3a, { x: 0.8, y: 3.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 牧場 sheep_pasture ------------------------------------------ */
  {
    id: 'sheep_pasture',
    displayName: '牧場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a9a5a, 0x8aba7a, 0xf0f0e8, 0x8a6a4a, 0xffffff],
    yOffset: -0.68,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 清境農場 sheep pasture with fence and sheep (simplified)
      const parts = [
        // grass field
        box(5.5, 0.15, 4.5, 0x6a9a5a, { y: 0.075, hex2: 0x8aba7a }),
      ];
      // simplified fence (corner posts + rails only)
      for (const [x, z] of [[-2.5, 2.1], [2.5, 2.1], [-2.5, -2.1], [2.5, -2.1]]) {
        parts.push(cyl(0.08, 0.08, 0.6, 5, 0x8a6a4a, { x, y: 0.3, z }));
      }
      // horizontal rails (2 per side, front and back only)
      parts.push(box(5.0, 0.06, 0.06, 0x8a6a4a, { y: 0.35, z: 2.1 }));
      parts.push(box(5.0, 0.06, 0.06, 0x8a6a4a, { y: 0.35, z: -2.1 }));
      // sheep (3 simplified blobs)
      const sheepPos = [{ x: -1.2, z: 0.3 }, { x: 0.5, z: -0.4 }, { x: 1.5, z: 0.6 }];
      for (const sp of sheepPos) {
        parts.push(sph(0.3, 0xf0f0e8, { ws: 5, hs: 4, x: sp.x, y: 0.35, z: sp.z }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8: 清境商圈 qingjing_plaza (CHUNK LANDMARK) --------- */
  {
    id: 'qingjing_plaza',
    displayName: '清境商圈',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd8c8b0, 0xe8dcc4, 0x8a7e66, 0x6a9a5a, 0xf0e8d8],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 清境遊客服務區 plaza with shops and viewing deck
      const parts = [
        // main plaza building (visitor center)
        box(4.2, 2.4, 3.4, 0xffffff, { y: 1.2 }),
        box(4.3, 0.2, 3.5, 0x9a8a72, { y: 2.45 }),
        // gable roof section
        cyl(2.0, 2.0, 4.4, 4, 0x8a5030, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 3.0 }),
        // outdoor viewing deck
        box(5.5, 0.2, 2.5, 0xc8b898, { y: 0.1, z: 2.8 }),
        // deck railing
        box(5.4, 0.4, 0.08, 0x8a6a4a, { y: 0.4, z: 4.0 }),
        // railing posts
      ];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.06, 0.06, 0.4, 6, 0x8a6a4a, { x: -2.5 + i * 1.0, y: 0.3, z: 4.0 }));
      }
      // shop stalls along the side
      for (let i = 0; i < 3; i++) {
        const x = -1.6 + i * 1.6;
        parts.push(box(1.2, 1.2, 0.9, 0xffffff, { x, y: 0.6, z: -2.2, hex2: 0xe8dcc4 }));
        parts.push(box(1.3, 0.08, 1.0, 0xc83030, { x, y: 1.3, z: -2.2 })); // awning (red)
        // shop window glow
        parts.push(box(0.8, 0.5, 0.04, rng() < 0.5 ? 0xffe8a0 : 0x88a8c0, { x, y: 0.5, z: -1.74 }));
      }
      // mountain view silhouette markers (decorative)
      parts.push(cone(0.5, 1.5, 6, 0x6a9a5a, { x: 3.0, y: 0.85, z: 3.5 })); // tree
      parts.push(cone(0.4, 1.2, 6, 0x5a8a4a, { x: -2.8, y: 0.7, z: 3.8 })); // tree
      return finish(parts);
    },
  },

  /* ---- slot 9: 高山牧場 highland_ranch (CHUNK LANDMARK) ---------- */
  {
    id: 'highland_ranch',
    displayName: '高山牧場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 60,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x6a9a5a, 0x8aba7a, 0xf0f0e8, 0x8a6040, 0xc8b898],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // 清境農場全景: simplified ranch with barn and pasture
      const parts = [
        // large grass pasture
        box(6.5, 0.15, 5.5, 0x6a9a5a, { y: 0.075, hex2: 0x8aba7a }),
        // main barn
        box(2.5, 1.8, 2.0, 0x8a6040, { x: -1.8, y: 0.9 }),
        cyl(1.3, 1.3, 2.7, 4, 0x6a4a2a, { theta0: PI, rx: HALF_PI, sy: 0.6, x: -1.8, y: 2.2 }),
        // silo
        cyl(0.5, 0.5, 2.4, 6, 0xb0a898, { x: -0.2, y: 1.2 }),
        cone(0.55, 0.6, 6, 0x8a7a6a, { x: -0.2, y: 2.5 }),
        // fence rail
        box(5.5, 0.06, 0.06, 0x8a6a4a, { y: 0.3, z: 2.5 }),
      ];
      // sheep herd (3 simplified)
      const sheepPos = [{ x: 1.2, z: 0.5 }, { x: 2.0, z: 1.0 }, { x: 1.6, z: -0.5 }];
      for (const sp of sheepPos) {
        parts.push(sph(0.25, 0xf0f0e8, { ws: 5, hs: 4, x: sp.x, y: 0.3, z: sp.z }));
      }
      // wind turbine tower + hub (no blades for budget)
      parts.push(cyl(0.12, 0.14, 3.5, 5, 0xd0d4d8, { x: 2.8, y: 1.75, z: -2.0 }));
      parts.push(sph(0.3, 0xc8ccd0, { ws: 5, hs: 4, x: 2.8, y: 3.5, z: -2.0 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
