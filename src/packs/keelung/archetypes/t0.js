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
  /* [0] miaokou_peanut 廟口花生 — Keelung temple street roasted peanut snack */
  {
    id: 'miaokou_peanut',
    displayName: '廟口花生',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8906a, 0xa07850, 0xc8a070, 0x9a7048, 0xd0b080],
    yOffset: -0.45,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // peanut shell (elongated oval, bumpy texture)
        sph(1.0, 0xffffff, { ws: 8, hs: 6, sx: 1.5, sy: 0.8, sz: 0.7 }),
        // shell texture ridges
        box(0.12, 0.8, 0.05, 0x9a7048, { x: 0.3, rz: 0.2 }),
        box(0.12, 0.8, 0.05, 0x9a7048, { x: -0.3, rz: -0.2 }),
        // center crease
        box(0.06, 0.6, 0.7, 0xa08060, { y: 0.35 }),
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

  /* [2] rain_candy 雨港糖 — Keelung rain-themed hard candy */
  {
    id: 'rain_candy',
    displayName: '雨港糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6fb0d0, 0x5090b8, 0x80c0e0, 0x70a8d0, 0x90d0f0],
    yOffset: -0.5,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // raindrop-shaped candy body (teardrop)
        sph(0.9, 0xffffff, { ws: 8, hs: 6, y: 0.3, sy: 1.2 }),
        cone(0.5, 0.7, 6, 0xffffff, { y: 1.1 }),
        // wrapper twist
        cone(0.4, 0.5, 6, 0xe8f4f8, { y: -0.4, rx: PI }),
        // shine highlight
        box(0.1, 0.4, 0.08, 0xd0f0ff, { x: 0.25, y: 0.5, z: 0.2 }),
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

  /* [5] fish_scale 魚鱗 — Keelung harbor fish scale (fishmonger discard) */
  {
    id: 'fish_scale',
    displayName: '魚鱗',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xa8c0d0, 0x90b0c8, 0xb8d0e0, 0x80a0b8, 0xc8e0f0],
    yOffset: -0.95,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // fish scale (thin oval disc with iridescent sheen)
        cyl(1.0, 1.0, 0.04, 10, 0xffffff, { y: 0.02, sx: 1.2, sz: 0.8 }),
        // subtle concentric rings
        cyl(0.75, 0.75, 0.05, 8, 0xc8e0f0, { y: 0.03, sx: 1.2, sz: 0.8 }),
        cyl(0.5, 0.5, 0.055, 8, 0xd0e8f8, { y: 0.035, sx: 1.2, sz: 0.8 }),
        // shiny highlight
        box(0.2, 0.06, 0.12, 0xe8f4ff, { x: 0.2, z: 0.1, y: 0.04 }),
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

  /* [7] fishing_hook 魚鉤 — Keelung harbor fishing hook */
  {
    id: 'fishing_hook',
    displayName: '魚鉤',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8ccd4, 0xa8b0b8, 0xd8dce4, 0x9aa0a8, 0xe8ecf0],
    yOffset: -0.20,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // hook shank (straight part)
        cyl(0.12, 0.12, 1.4, 6, 0xc8ccd4, { y: 0.8 }),
        // hook eye (loop at top)
        torus(0.2, 0.06, 4, 8, 0xc8ccd4, { y: 1.55 }),
        // hook bend (curved part)
        torus(0.35, 0.1, 4, 6, 0xffffff, { y: 0.0, rx: HALF_PI, arc: PI }),
        // hook point
        cone(0.12, 0.4, 5, 0xd8dce4, { x: 0.35, y: 0.3, rz: -0.6 }),
        // barb
        box(0.08, 0.15, 0.04, 0xa8b0b8, { x: 0.45, y: 0.45, rz: 0.3 }),
      ]);
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
