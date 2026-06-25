/**
 * @file packs/taoyuan/archetypes/t1.js — T1 中壢夜市攤頭 (night-market stall items).
 *
 * Tier 1 of the Roll Formosa Taoyuan ladder (中壢夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/taoyuan/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (攤車燈籠 / 彈珠台, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band (radiusNominal, REAL meters): 0.05–0.25 m.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] 客家擂茶杯 — Hakka Lei Cha (擂茶) ceramic cup with powder      */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_leicha_cup',
    displayName: '客家擂茶杯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c8a0, 0xc8b890, 0x60883a, 0x508030, 0xe8d8b8],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Hakka Lei Cha (擂茶) is a traditional tea from Taoyuan's Hakka regions (Longtan/Xinwu)
      return finish([
        // ceramic tea bowl (wider at top)
        cyl(0.8, 0.55, 0.7, 9, 0xffffff, { y: 0.35, hex2: 0xe8d8b8 }), // bowl body (tinted)
        // rim
        cyl(0.84, 0.82, 0.1, 9, 0xd8c8a0, { y: 0.72 }),
        // green tea powder surface inside
        cyl(0.72, 0.72, 0.08, 9, 0x60883a, { y: 0.62 }),
        // small ceramic base ring
        cyl(0.45, 0.5, 0.12, 9, 0xc8b890, { y: 0.06 }),
        // visible ground tea leaves/nuts on surface (characteristic of Lei Cha)
        sph(0.08, 0x508030, { ws: 5, hs: 4, x: 0.2, y: 0.68, z: 0.15 }),
        sph(0.06, 0x70a048, { ws: 5, hs: 4, x: -0.25, y: 0.66, z: -0.1 }),
        sph(0.07, 0x508030, { ws: 5, hs: 4, x: 0.0, y: 0.67, z: -0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 黑豆乾罐 — Daxi black bean dried tofu jar                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'tofu_jar',
    displayName: '黑豆乾罐',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a3824, 0x6a4430, 0x4e3020, 0x3a2818, 0x724a38],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Daxi (大溪) is famous for its dried tofu - shown in traditional glass jar
      return finish([
        // clear glass jar body
        cyl(0.65, 0.5, 1.3, 9, 0xd8e0e4, { y: 0.65, hex2: 0xe8f0f4 }),
        // visible dried tofu blocks inside (dark brown)
        box(0.4, 0.3, 0.4, 0x5a3824, { y: 0.45 }),
        box(0.35, 0.28, 0.38, 0x4e3020, { y: 0.78, x: 0.08, z: 0.05 }),
        box(0.32, 0.25, 0.35, 0x6a4430, { y: 1.05, x: -0.05 }),
        // jar rim and red plastic lid
        cyl(0.68, 0.68, 0.1, 9, 0xc8d0d4, { y: 1.32 }),
        cyl(0.58, 0.58, 0.25, 9, 0xc83030, { y: 1.48 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 落花生 — raw peanut in shell, Taoyuan farming specialty      */
  /* ---------------------------------------------------------------- */
  {
    id: 'ground_nut',
    displayName: '落花生',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc4a070, 0xb89060, 0xd8b888, 0xa88050, 0xe0c498],
    yOffset: -0.10,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Raw peanut in shell - Taoyuan/Daxi area farms peanuts for 花生糖
      return finish([
        // double-bulb peanut shell, narrowed in the middle
        sph(0.55, 0xffffff, { ws: 8, hs: 6, y: 0.55, sx: 0.9, hex2: 0xd8b888 }), // lower bulb
        sph(0.45, 0xffffff, { ws: 8, hs: 6, y: 1.35, sx: 0.85, hex2: 0xe0c498 }), // upper bulb
        // pinched waist between the two chambers
        cyl(0.32, 0.38, 0.25, 8, 0xb89060, { y: 0.95 }),
        // textured surface ridges (characteristic peanut shell pattern)
        box(0.08, 0.6, 0.06, 0xa88050, { x: 0.35, y: 0.6, z: 0.0 }),
        box(0.08, 0.6, 0.06, 0xa88050, { x: -0.35, y: 0.6, z: 0.0 }),
        box(0.06, 0.45, 0.08, 0xa88050, { x: 0.0, y: 1.3, z: 0.3 }),
        // stem remnant at top
        cyl(0.08, 0.06, 0.12, 5, 0x8a6a40, { y: 1.78 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 客家米篩目 — Hakka rice noodle (米篩目) in a bowl                */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_misaimu',
    displayName: '客家米篩目',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe8dcc8, 0xf4eee0, 0xdcd0c0, 0xfcf4e8],
    yOffset: -0.30,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Hakka rice noodle soup - traditional Longtan/Taoyuan Hakka dish
      return finish([
        // ceramic bowl
        cyl(0.9, 0.6, 0.7, 9, 0xf4f0e8, { y: 0.35 }),
        cyl(0.94, 0.88, 0.1, 9, 0xe8e2d8, { y: 0.72 }),
        // clear soup broth
        cyl(0.8, 0.8, 0.06, 9, 0xd8c8a0, { y: 0.68 }),
        // white rice noodles (short, thick strands)
        cyl(0.08, 0.08, 0.4, 5, 0xf0e8d8, { rx: 0.2, x: 0.2, y: 0.72, z: 0.1 }),
        cyl(0.08, 0.08, 0.35, 5, 0xfcf4e8, { rx: -0.15, x: -0.15, y: 0.74, z: -0.15 }),
        cyl(0.08, 0.08, 0.38, 5, 0xe8dcc8, { rx: 0.1, x: 0.05, y: 0.73, z: 0.2, rz: 0.3 }),
        // fried shallots garnish
        sph(0.06, 0xb89060, { ws: 4, hs: 3, x: 0.25, y: 0.78, z: -0.2 }),
        sph(0.05, 0xc89858, { ws: 4, hs: 3, x: -0.3, y: 0.76, z: 0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 茶葉罐 — Longtan tea tin canister                              */
  /* ---------------------------------------------------------------- */
  {
    id: 'tea_canister',
    displayName: '茶葉罐',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2a4030, 0x385040, 0x1e3028, 0xd8c878, 0x304838],
    yOffset: -0.30,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Longtan (龍潭) tea region - traditional tea storage tin
      const parts = [
        // cylindrical tin body
        cyl(0.6, 0.6, 1.2, 10, 0xffffff, { y: 0.6 }), // body (tinted green)
        // decorative bands
        cyl(0.62, 0.62, 0.08, 10, 0xd8c878, { y: 0.2, open: true }),
        cyl(0.62, 0.62, 0.08, 10, 0xd8c878, { y: 1.0, open: true }),
        // lid
        cyl(0.58, 0.58, 0.2, 10, 0x2a4030, { y: 1.25 }),
        cyl(0.25, 0.25, 0.1, 8, 0xd8c878, { y: 1.38 }), // lid knob
        // tea leaf label motif (simplified as colored box)
        box(0.5, 0.4, 0.06, 0xf0e8d0, { y: 0.6, z: 0.56 }),
        box(0.35, 0.25, 0.07, 0x3a5040, { y: 0.6, z: 0.58 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 牛肉麵碗 — Zhongli beef noodle bowl                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'beef_noodle_bowl',
    displayName: '牛肉麵碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.12,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf4f0e8, 0xe8e2d8, 0xd4cec4, 0xf8f4ec, 0xfcf8f0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // ceramic bowl body - tapered, wider at top
        cyl(1.1, 0.7, 0.9, 10, 0xf4f0e8, { y: 0.45, hex2: 0xfcf8f0 }),
        // rim ring
        cyl(1.14, 1.08, 0.12, 10, 0xe8e2d8, { y: 0.94 }),
        // broth surface (dark, rich beef soup)
        cyl(0.95, 0.95, 0.08, 10, 0x5a3820, { y: 0.88 }),
        // noodles visible (pale strands peeking through)
        box(0.6, 0.06, 0.4, 0xf0e8c8, { x: 0.2, y: 0.92, z: 0.1 }),
        box(0.5, 0.06, 0.35, 0xf4ead0, { x: -0.25, y: 0.94, z: -0.15 }),
        // beef slices
        sph(0.22, 0x8a4028, { ws: 5, hs: 3, sy: 0.4, x: 0.3, y: 0.98, z: -0.2 }),
        sph(0.18, 0x7a3822, { ws: 5, hs: 3, sy: 0.4, x: -0.2, y: 0.96, z: 0.25 }),
        // green onion garnish
        cyl(0.04, 0.04, 0.2, 4, 0x4a8a3a, { rx: HALF_PI, x: 0.0, y: 1.0, z: 0.3 }),
        cyl(0.04, 0.04, 0.15, 4, 0x5a9a4a, { rx: HALF_PI, x: -0.35, y: 0.98, z: 0.0, ry: 0.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 紅白塑膠袋 — knotted red-and-white plastic carrier bag */
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
    yOffset: -0.1822,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // bulging white bag body — fuller at the bottom where the goods sit
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        // BOLD red/white horizontal stripes (classic 紅白條紋) — wide bands
        // standing slightly proud of the body so they read as stripes, not rings
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        // gathered white neck pinching up to the handles
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        // two upright red vest-loop handles
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 蔥油餅 — Zhongli scallion pancake                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'scallion_pancake',
    displayName: '蔥油餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a858, 0xc89848, 0xe8b868, 0xb88838, 0xf8c878],
    yOffset: -0.70,
    upright: false,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [
        // flat round pancake, golden fried surface
        cyl(1.0, 1.0, 0.25, 12, 0xffffff, { y: 0.125 }), // main body (tinted golden)
        // crispy browned edges
        cyl(1.02, 1.02, 0.08, 12, 0xb88838, { y: 0.04, open: true }),
        // visible green scallion bits baked into surface
        box(0.15, 0.06, 0.08, 0x4a8a3a, { x: 0.3, y: 0.28, z: 0.2 }),
        box(0.12, 0.06, 0.06, 0x5a9a4a, { x: -0.4, y: 0.28, z: -0.1 }),
        box(0.1, 0.06, 0.07, 0x4a8a3a, { x: 0.15, y: 0.28, z: -0.35 }),
        box(0.13, 0.06, 0.08, 0x5a9a4a, { x: -0.2, y: 0.28, z: 0.4 }),
        // oil sheen highlights
        box(0.3, 0.02, 0.25, 0xf8d070, { x: 0.1, y: 0.3, z: 0.05 }),
        box(0.25, 0.02, 0.2, 0xf0c060, { x: -0.3, y: 0.3, z: -0.2 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 攤車燈籠 stall-cart paper lantern on a pole */
  /* ---------------------------------------------------------------- */
  {
    id: 'stall_lantern',
    displayName: '攤車燈籠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd8302a, 0xe85a3a, 0xf0c040, 0xc02824, 0x3a2a22],
    yOffset: -0.0238,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // top & bottom wooden caps
        cyl(0.34, 0.34, 0.16, 8, 0x3a2a22, { y: 1.78 }),
        cyl(0.34, 0.34, 0.16, 8, 0x3a2a22, { y: 0.42 }),
        // bulbous red lantern body (stacked discs make the barrel curve)
        cyl(0.5, 0.4, 0.34, 8, 0xd8302a, { y: 0.6, hex2: 0xe85a3a }),
        cyl(0.66, 0.5, 0.3, 8, 0xe85a3a, { y: 0.9 }),
        cyl(0.66, 0.66, 0.3, 8, 0xe85a3a, { y: 1.18 }),
        cyl(0.5, 0.66, 0.3, 8, 0xe85a3a, { y: 1.46 }),
        cyl(0.4, 0.5, 0.2, 8, 0xd8302a, { y: 1.66, hex2: 0xc02824 }),
        // gold trim rings
        cyl(0.67, 0.67, 0.05, 8, 0xf0c040, { y: 1.04, open: true }),
        cyl(0.67, 0.67, 0.05, 8, 0xf0c040, { y: 1.32, open: true }),
        // tassel hanging below
        cyl(0.06, 0.06, 0.2, 6, 0xf0c040, { y: 0.24 }),
        cone(0.12, 0.3, 6, 0xf0c040, { y: 0.0 }),
        // mounting pole rising from the cart
        cyl(0.09, 0.09, 1.2, 6, 0x3a2a22, { y: -0.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 彈珠台 slanted wooden pinball board with pegs */
  /* ---------------------------------------------------------------- */
  {
    id: 'pinball_machine',
    displayName: '彈珠台',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xb5712f, 0xcf8b3f, 0x9a5a24, 0xe0b85a, 0xd83a34],
    yOffset: -0.5306,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        // slanted board: tilted around x so the far edge lifts
        box(2.0, 0.16, 2.6, 0xcf8b3f, { rx: -0.32, y: 0.6, hex2: 0xe0b85a }),
        // raised wooden side rails
        box(0.16, 0.34, 2.7, 0x9a5a24, { rx: -0.32, x: -1.0, y: 0.72 }),
        box(0.16, 0.34, 2.7, 0x9a5a24, { rx: -0.32, x: 1.0, y: 0.72 }),
        box(2.16, 0.34, 0.16, 0x9a5a24, { rx: -0.32, y: 1.32, z: -1.28 }), // top rail
        box(2.16, 0.28, 0.16, 0xb5712f, { rx: -0.32, y: 0.04, z: 1.28 }), // bottom lip
        // four stubby legs
        cyl(0.12, 0.12, 0.7, 5, 0x9a5a24, { x: -0.86, y: 0.0, z: 0.9 }),
        cyl(0.12, 0.12, 1.1, 5, 0x9a5a24, { x: -0.86, y: 0.2, z: -0.9 }),
        cyl(0.12, 0.12, 0.7, 5, 0x9a5a24, { x: 0.86, y: 0.0, z: 0.9 }),
        cyl(0.12, 0.12, 1.1, 5, 0x9a5a24, { x: 0.86, y: 0.2, z: -0.9 }),
      ];
      // grid of brass pegs on the playfield (deterministic lattice)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const px = -0.6 + c * 0.6;
          const pz = -0.6 + r * 0.6;
          // raise pegs along the tilt so they sit on the board surface
          const py = 0.78 + (-pz) * 0.33;
          parts.push(cyl(0.06, 0.06, 0.18, 4, 0xe0b85a, { rx: -0.32, x: px, y: py, z: pz }));
        }
      }
      // a couple of marbles resting at the low end
      parts.push(sph(0.12, 0xd83a34, { ws: 5, hs: 3, x: -0.3, y: 0.5, z: 1.0 }));
      parts.push(sph(0.12, 0xcfe6e2, { ws: 5, hs: 3, x: 0.35, y: 0.5, z: 1.0 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
