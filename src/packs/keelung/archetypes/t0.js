/**
 * @file packs/keelung/archetypes/t0.js — Roll Formosa Keelung pack, TIER 0
 *   柑仔店桌頭 (corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/keelung/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 戳戳樂板 / 籤筒, spawnWeight ~0.3).
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T0_ARCHETYPES = [
  /* [0] marble 彈珠 */
  {
    id: 'marble',
    displayName: '彈珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3f8cff, 0x49c45f, 0xff5340, 0xffd84d, 0xa86adf],
    yOffset: 0,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }),
        box(0.18, 1.7, 0.5, 0xff8a3d, { rz: 0.5, hex2: 0xffd84d }),
        box(0.18, 1.7, 0.5, 0x3f8cff, { rz: -0.5, ry: HALF_PI, hex2: 0x49c45f }),
      ]);
    },
  },

  /* [1] shaved_ice_cup 剉冰杯 — Keelung temple-street shaved ice cup */
  {
    id: 'shaved_ice_cup',
    displayName: '剉冰杯',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8f4f8, 0xffeedd, 0xd0f0ff, 0xfff4e8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      return finish([
        // plastic cup (tapered cylinder)
        cyl(0.7, 0.9, 1.4, 8, 0xffffff, { y: 0.7 }),
        // shaved ice mound (white fluffy dome)
        sph(0.85, 0xe8f4f8, { ws: 8, hs: 5, y: 1.5, hex2: 0xd0f0ff }),
        // syrup drizzle (colorful streaks)
        box(0.1, 0.6, 0.2, 0xc23a2e, { x: 0.3, y: 1.5, z: 0.2 }),
        box(0.1, 0.5, 0.2, 0x2f6db0, { x: -0.2, y: 1.55, z: -0.25 }),
        // toppings (small spheres for beans/fruits)
        sph(0.12, 0x3a2a1a, { ws: 5, hs: 3, x: 0.25, y: 1.85, z: 0.1 }), // red bean
        sph(0.1, 0xe8d060, { ws: 5, hs: 3, x: -0.15, y: 1.9, z: 0.2 }), // mango
      ]);
    },
  },

  /* [2] pushpin 圖釘 */
  {
    id: 'pushpin',
    displayName: '圖釘',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xff5340, 0x3f8cff, 0x49c45f, 0xffd84d, 0xff8a3d],
    yOffset: -0.03,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        sph(0.9, 0xffffff, { ws: 10, hs: 6, theta0: 0, thetaLen: HALF_PI, y: 0.7 }),
        cyl(0.92, 0.92, 0.28, 10, 0xffffff, { y: 0.62 }),
        cyl(0.34, 0.34, 0.5, 8, 0xc8ccd4, { y: 0.2 }),
        cone(0.32, 1.2, 8, 0xdfe3ea, { rx: PI, y: -0.55 }),
      ]);
    },
  },

  /* [3] soda_cap 黑松汽水蓋 — shallow crimped soda-bottle crown cap */
  {
    id: 'soda_cap',
    displayName: '黑松汽水蓋',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd83a2e, 0x2f64c8, 0x1f9e4a, 0xf0b429, 0xcfd4da],
    yOffset: -0.76,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.16, 14, 0xffffff, { y: 0.42 }),
        cyl(1.04, 1.04, 0.4, 14, 0xffffff, { y: 0.2 }),
        cyl(0.6, 0.6, 0.06, 12, 0xf2f2f4, { y: 0.51 }),
        cyl(0.34, 0.34, 0.08, 10, 0x1f6f3a, { y: 0.53 }),
      ];
      const teeth = 12;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * PI * 2;
        parts.push(box(0.14, 0.42, 0.1, 0xe8eaee, { x: Math.cos(a) * 1.04, z: Math.sin(a) * 1.04, ry: -a, y: 0.2 }));
      }
      return finish(parts);
    },
  },

  /* [4] preserved_fruit 鹹酸甜 — dried preserved-plum snack */
  {
    id: 'preserved_fruit',
    displayName: '鹹酸甜',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x8a4a2b, 0x6f3a22, 0xa05a30, 0x7d4226, 0x934e2c],
    yOffset: -0.66,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        ico(0.95, 1, 0xffffff, { y: 0.55, sy: 0.72 }),
        ico(0.22, 0, 0xe9dcc2, { x: 0.22, z: 0.0, y: 0.96 }),
        ico(0.18, 0, 0xe9dcc2, { x: -0.28, z: 0.24, y: 0.9 }),
        ico(0.16, 0, 0xe9dcc2, { x: 0.05, z: -0.32, y: 0.92 }),
        cone(0.14, 0.26, 6, 0x3c2114, { y: 1.04 }),
      ];
      return finish(parts);
    },
  },

  /* [5] ngiauimia_card 尪仔標 */
  {
    id: 'ngiauimia_card',
    displayName: '尪仔標',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf4e3c0, 0xf6d68a, 0xeac98e, 0xf0dcae],
    yOffset: -0.95,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        cyl(1.0, 1.0, 0.07, 16, 0xffffff, { y: 0.04 }),
        cyl(0.86, 0.86, 0.075, 16, 0xc23a2e, { y: 0.045 }),
        cyl(0.66, 0.66, 0.08, 16, 0xf4e3c0, { y: 0.05 }),
        cyl(0.44, 0.44, 0.085, 14, 0x2f6fb0, { y: 0.052 }),
        cyl(0.24, 0.24, 0.09, 12, 0xf0b429, { y: 0.055 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.0, z: 0.72, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.0, z: -0.72, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.72, z: 0.0, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: -0.72, z: 0.0, y: 0.05 }),
      ]);
    },
  },

  /* [6] ding_bian_cuo_bowl 鼎邊趖碗 — Keelung famous ding bian cuo bowl */
  {
    id: 'ding_bian_cuo_bowl',
    displayName: '鼎邊趖碗',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xe8dcc8, 0xd0c4b0, 0xfff8e8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // ceramic bowl (tapered)
        cyl(0.9, 1.1, 0.9, 10, 0xf8f4e8, { y: 0.45, hex2: 0xe8dcc8 }),
        // bowl rim
        cyl(1.12, 1.12, 0.1, 10, 0xe0d4c0, { y: 0.92 }),
        // soup broth (tan liquid inside)
        cyl(0.95, 0.95, 0.1, 8, 0xd8c8a8, { y: 0.85 }),
        // ding bian cuo strips (white rice noodle pieces floating)
        box(0.6, 0.08, 0.15, 0xf8f8f0, { x: 0.2, y: 0.92, z: 0.1 }),
        box(0.5, 0.08, 0.12, 0xfaf8f2, { x: -0.25, y: 0.94, z: -0.15 }),
        box(0.4, 0.08, 0.14, 0xf6f4ec, { x: 0.0, y: 0.93, z: 0.25 }),
        // topping (small meat/veggie bits)
        sph(0.08, 0x8a6a4a, { ws: 5, hs: 3, x: 0.3, y: 0.98, z: -0.1 }),
        sph(0.06, 0x4a8a4a, { ws: 5, hs: 3, x: -0.2, y: 0.97, z: 0.2 }),
      ]);
    },
  },

  /* [7] button 鈕扣 */
  {
    id: 'button',
    displayName: '鈕扣',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf3f3f5, 0x3f6fb0, 0xd84d6a, 0x6fae5e, 0x2a2d33],
    yOffset: -0.80,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.28, 16, 0xffffff, { y: 0.16 }),
        cyl(0.58, 0.58, 0.18, 14, 0xffffff, { y: 0.3 }),
        cyl(0.46, 0.46, 0.1, 12, 0xd6d8de, { y: 0.36 }),
      ];
      const d = 0.2;
      const holes = [[d, d], [-d, d], [d, -d], [-d, -d]];
      for (const [hx, hz] of holes) {
        parts.push(cyl(0.07, 0.07, 0.18, 8, 0x1d1f24, { x: hx, z: hz, y: 0.34 }));
      }
      return finish(parts);
    },
  },

  /* [8] scratch_card_board 戳戳樂板 — CHUNK LANDMARK */
  {
    id: 'scratch_card_board',
    displayName: '戳戳樂板',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xf4e3c0, 0xf6d4a0, 0xead9b6, 0xf2dcb0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        box(2.7, 1.9, 0.18, 0xffffff, { y: 0.95, z: 0.0 }),
        box(2.7, 0.42, 0.2, 0xd83a2e, { y: 1.74, z: 0.02 }),
        box(2.7, 0.26, 0.2, 0xf0b429, { y: 0.18, z: 0.02 }),
      ];
      const cols = 5, rows = 3, x0 = -0.84, y0 = 0.62, dx = 0.42, dy = 0.38;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const popped = rng() < 0.28;
          parts.push(cyl(0.15, 0.15, 0.12, 6, popped ? 0x2a2a2e : 0xfff6e4, { rx: HALF_PI, x: x0 + c * dx, y: y0 + r * dy, z: 0.12, open: true }));
        }
      }
      return finish(parts);
    },
  },

  /* [9] fortune_stick_tube 籤筒 — CHUNK LANDMARK */
  {
    id: 'fortune_stick_tube',
    displayName: '籤筒',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc24a2c, 0xd45a30, 0xb8431f, 0xcf5226],
    yOffset: -0.10,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        cyl(0.92, 0.86, 2.3, 12, 0xffffff, { y: 1.15 }),
        cyl(0.98, 0.98, 0.22, 12, 0xf0b429, { y: 0.12 }),
        cyl(0.98, 0.98, 0.22, 12, 0xf0b429, { y: 2.18 }),
        cyl(0.78, 0.78, 0.18, 12, 0x2a1c14, { y: 2.2 }),
        box(0.1, 1.9, 0.06, 0xf0b429, { x: 0.0, z: 0.9, y: 1.15 }),
        box(0.1, 1.9, 0.06, 0xf0b429, { x: 0.9, z: 0.0, y: 1.15, ry: HALF_PI }),
      ];
      const sticks = 7;
      for (let i = 0; i < sticks; i++) {
        const a = (i / sticks) * PI * 2;
        const lean = 0.18 + (i % 3) * 0.05;
        const r = 0.32;
        const tilt = (i % 2 === 0) ? lean : -lean;
        parts.push(cyl(0.055, 0.06, 1.6, 4, 0xe8d2a6, {
          rz: tilt, rx: Math.sin(a) * lean,
          x: Math.cos(a) * r, z: Math.sin(a) * r, y: 3.1, hex2: 0xc23a2e,
        }));
      }
      return finish(parts);
    },
  },
];

export default T0_ARCHETYPES;
