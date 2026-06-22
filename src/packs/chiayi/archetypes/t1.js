/**
 * @file packs/chiayi/archetypes/t1.js — T1 文化路夜市 (Wenhua Road night-market items).
 *
 * Tier 1 of the Roll Formosa Chiayi ladder (文化路夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/chiayi/tiers.js:
 *   slots [0..7] absorbable night-market 小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (夜市拱門 / 攤車, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0).
 *
 * Size band (radiusNominal, REAL meters): 0.05–0.25 m.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] turkey_rice 雞肉飯 — Chiayi's iconic shredded turkey over rice  */
  /* ---------------------------------------------------------------- */
  {
    id: 'turkey_rice_bowl',
    displayName: '雞肉飯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8d0a8, 0xf0dcc0, 0xf8f4e8, 0xd8c090, 0xc8a060],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const j = rng() * 0.02;
      const parts = [];
      // Bowl
      parts.push(cyl(0.8, 0.7, 0.5, 8, 0xf0e8d8, { y: 0.25 }));
      parts.push(cyl(0.82, 0.82, 0.06, 8, 0xe0d8c8, { y: 0.53 })); // rim
      // Rice mound
      parts.push(sph(0.55, 0xf8f4e8, { ws: 7, hs: 5, y: 0.65, sy: 0.45, thetaLen: HALF_PI }));
      // Shredded turkey meat on top
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * PI * 2 + j;
        parts.push(box(0.25, 0.04, 0.08, 0xe8d0a8, { x: Math.sin(a) * 0.2, y: 0.78, z: Math.cos(a) * 0.2, ry: a }));
      }
      // Oil drizzle
      parts.push(sph(0.08, 0xc8a060, { ws: 4, hs: 3, y: 0.82, sy: 0.3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] liangmian 涼麵 — cold sesame noodles in a bowl                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'liangmian',
    displayName: '涼麵',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0e8d0, 0xe8d8b8, 0xc8a868, 0x88b850, 0xd85030],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // Styrofoam container
      parts.push(box(1.4, 0.55, 1.1, 0xf4f4f4, { y: 0.275 }));
      // Noodles (coiled mass)
      parts.push(sph(0.55, 0xf0e8d0, { ws: 7, hs: 5, y: 0.6, sy: 0.4, sx: 1.1 }));
      // Sesame sauce drizzle
      parts.push(cyl(0.4, 0.35, 0.04, 6, 0xc8a868, { y: 0.75 }));
      // Cucumber shreds
      parts.push(box(0.4, 0.04, 0.1, 0x88b850, { x: 0.25, y: 0.72, ry: 0.3 }));
      parts.push(box(0.35, 0.04, 0.08, 0x88b850, { x: -0.2, y: 0.7, ry: -0.4 }));
      // Chili oil dot
      parts.push(sph(0.06, 0xd85030, { ws: 4, hs: 3, y: 0.76 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] turkey_slice 火雞肉片 — sliced turkey meat portion              */
  /* ---------------------------------------------------------------- */
  {
    id: 'turkey_slice',
    displayName: '火雞肉片',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8d8c0, 0xf0e0c8, 0xd8c8a8, 0xc8b090],
    yOffset: -0.60,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const j = rng() * 0.03;
      const parts = [];
      // Plate
      parts.push(cyl(1.0, 1.02, 0.1, 8, 0xf4f0e8, { y: 0.05 }));
      // Stacked meat slices
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.7 - i * 0.08, 0.08, 0.5 - i * 0.05, 0xe8d8c0, {
          x: i * 0.06 - 0.1, y: 0.14 + i * 0.09, ry: i * 0.12 + j,
        }));
      }
      // Sauce drizzle
      parts.push(sph(0.12, 0x8a6040, { ws: 4, hs: 3, x: 0.3, y: 0.35, sy: 0.3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] miso_soup 味噌湯 — small bowl of miso soup with tofu            */
  /* ---------------------------------------------------------------- */
  {
    id: 'miso_soup',
    displayName: '味噌湯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.065,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a860, 0xc89850, 0xf0e8d8, 0x58a048],
    yOffset: -0.20,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // Bowl
      parts.push(cyl(0.7, 0.6, 0.5, 8, 0x2a2420, { y: 0.25 })); // dark lacquer
      parts.push(cyl(0.72, 0.72, 0.05, 8, 0xc89850, { y: 0.53 })); // gold rim
      // Soup surface
      parts.push(cyl(0.58, 0.58, 0.06, 8, 0xd8a860, { y: 0.48 }));
      // Tofu cubes
      parts.push(box(0.15, 0.12, 0.15, 0xf0e8d8, { x: 0.15, y: 0.56, z: 0.1 }));
      parts.push(box(0.12, 0.1, 0.12, 0xf0e8d8, { x: -0.18, y: 0.54, z: -0.08 }));
      // Green onion
      parts.push(cyl(0.03, 0.03, 0.2, 4, 0x58a048, { x: 0, y: 0.55, rz: HALF_PI }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] fish_head_pot 沙鍋魚頭 — claypot with fish head stew            */
  /* ---------------------------------------------------------------- */
  {
    id: 'fish_head_pot',
    displayName: '沙鍋魚頭',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.14,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6850, 0xa07860, 0xd8c0a0, 0xf0e8d8],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const parts = [];
      // Claypot body
      parts.push(cyl(0.85, 0.7, 0.7, 10, 0x8a6850, { y: 0.35, hex2: 0xa07860 }));
      parts.push(cyl(0.9, 0.9, 0.08, 10, 0x6a4830, { y: 0.72 })); // rim
      // Handles
      parts.push(torus(0.12, 0.05, 4, 6, 0x6a4830, { x: 0.85, y: 0.55, rz: HALF_PI }));
      parts.push(torus(0.12, 0.05, 4, 6, 0x6a4830, { x: -0.85, y: 0.55, rz: HALF_PI }));
      // Stew/soup visible
      parts.push(cyl(0.75, 0.75, 0.06, 10, 0xd8c0a0, { y: 0.68 }));
      // Fish pieces and vegetables peeking out
      parts.push(sph(0.2, 0xf0e8d8, { ws: 5, hs: 4, x: 0.2, y: 0.78, sy: 0.5 }));
      parts.push(sph(0.15, 0x88a850, { ws: 4, hs: 3, x: -0.25, y: 0.75 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] spring_roll 春捲 — fresh rolled spring roll                    */
  /* ---------------------------------------------------------------- */
  {
    id: 'spring_roll',
    displayName: '春捲',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8d0, 0xe8dcc0, 0x88b050, 0xc88040],
    yOffset: -0.55,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // Wrapper (rolled cylinder)
      parts.push(cyl(0.28, 0.28, 1.6, 8, 0xf0e8d0, { rz: HALF_PI, hex2: 0xe8dcc0 }));
      // End caps showing filling
      parts.push(cyl(0.25, 0.25, 0.06, 8, 0x88b050, { x: 0.82, rz: HALF_PI }));
      parts.push(cyl(0.25, 0.25, 0.06, 8, 0x88b050, { x: -0.82, rz: HALF_PI }));
      // Wrapper fold lines
      parts.push(box(0.02, 0.29, 1.5, 0xd8ccb0, { y: 0.14 }));
      parts.push(box(0.02, 0.29, 1.5, 0xd8ccb0, { y: -0.12 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] redwhite_bag 紅白塑膠袋 — knotted red-and-white plastic bag     */
  /* ---------------------------------------------------------------- */
  {
    id: 'redwhite_bag',
    displayName: '紅白塑膠袋',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.13,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e4de, 0xd83a34, 0xf4f0ea, 0xc23028, 0xeceae4],
    yOffset: -0.18,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] douhua 豆花 — silken tofu dessert in a bowl                    */
  /* ---------------------------------------------------------------- */
  {
    id: 'douhua',
    displayName: '豆花',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xf0ece0, 0xd8a050, 0x8a3020],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // Bowl
      parts.push(cyl(0.72, 0.64, 0.45, 8, 0xf0f0f0, { y: 0.225 }));
      parts.push(cyl(0.74, 0.74, 0.05, 8, 0xe0e0e0, { y: 0.48 }));
      // Tofu pudding surface
      parts.push(cyl(0.58, 0.58, 0.08, 8, 0xf8f4e8, { y: 0.48 }));
      // Sugar syrup
      parts.push(cyl(0.5, 0.5, 0.03, 8, 0xd8a050, { y: 0.54 }));
      // Toppings (red beans, peanuts)
      parts.push(sph(0.06, 0x8a3020, { ws: 4, hs: 3, x: 0.2, y: 0.56 }));
      parts.push(sph(0.05, 0x8a3020, { ws: 4, hs: 3, x: 0.1, y: 0.55, z: 0.18 }));
      parts.push(sph(0.05, 0xc8a868, { ws: 4, hs: 3, x: -0.15, y: 0.55, z: -0.1 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 夜市拱門 wenhua_market_arch                    */
  /* ---------------------------------------------------------------- */
  {
    id: 'wenhua_market_arch',
    displayName: '文化路夜市拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd82828, 0xe8c020, 0xff6090, 0x50ff80],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      // Two vertical posts
      parts.push(box(0.2, 1.8, 0.2, 0x808080, { x: -0.9, y: 0.9 }));
      parts.push(box(0.2, 1.8, 0.2, 0x808080, { x: 0.9, y: 0.9 }));
      // Top sign board
      parts.push(box(2.2, 0.5, 0.25, 0xd82828, { y: 1.95 }));
      // Gold inset
      parts.push(box(1.8, 0.35, 0.27, 0xe8c020, { y: 1.95 }));
      // Neon lights
      parts.push(cyl(0.03, 0.03, 1.0, 4, 0xff6090, { x: -0.6, y: 1.4, ry: 0.3 }));
      parts.push(cyl(0.03, 0.03, 0.8, 4, 0x50ff80, { x: 0.5, y: 1.5, ry: -0.2 }));
      // Light bulbs
      for (let i = 0; i < 5; i++) {
        parts.push(sph(0.06, 0xfff0a0, { ws: 4, hs: 3, x: -0.8 + i * 0.4, y: 1.72 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 攤車 food_stall night market cart              */
  /* ---------------------------------------------------------------- */
  {
    id: 'food_stall',
    displayName: '夜市攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x907040, 0xc82020, 0xe8c020, 0xf4f0e8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // Cart body
      parts.push(box(1.6, 0.8, 1.0, 0x907040, { y: 0.7 }));
      // Counter top
      parts.push(box(1.7, 0.08, 1.1, 0x606060, { y: 1.14 }));
      // Awning
      parts.push(box(1.8, 0.06, 1.2, 0xc82020, { y: 1.5, rx: 0.15 }));
      // Awning supports
      parts.push(cyl(0.04, 0.04, 0.45, 4, 0x505050, { x: -0.8, y: 1.32, z: 0.5 }));
      parts.push(cyl(0.04, 0.04, 0.45, 4, 0x505050, { x: 0.8, y: 1.32, z: 0.5 }));
      // Sign
      parts.push(box(0.8, 0.4, 0.05, 0xe8c020, { y: 1.35, z: 0.55 }));
      // Wheels
      parts.push(cyl(0.15, 0.15, 0.08, 8, 0x2a2a2a, { x: -0.7, y: 0.15, z: 0.45, rx: HALF_PI }));
      parts.push(cyl(0.15, 0.15, 0.08, 8, 0x2a2a2a, { x: 0.7, y: 0.15, z: 0.45, rx: HALF_PI }));
      // Food items on counter
      parts.push(sph(0.1, 0xf4f0e8, { ws: 5, hs: 3, x: 0.3, y: 1.25, z: 0.2 }));
      parts.push(sph(0.08, 0xe8c060, { ws: 4, hs: 3, x: -0.2, y: 1.22, z: 0.3 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
