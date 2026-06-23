/**
 * @file packs/keelung/archetypes/t1.js — T1 廟口夜市 (Miaokou Night Market stall items).
 *
 * Tier 1 of the Roll Formosa Keelung ladder (廟口夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/keelung/tiers.js:
 *   slots [0..7] absorbable 廟口小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (廟口拱門 / 攤車, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band (radiusNominal, REAL meters): 0.05–0.25 m.
 *
 * Keelung 廟口夜市 signature foods: 鼎邊銼, 咖哩餃, 營養三明治, 天婦羅, 豆干包,
 * 吉古拉, 泡泡冰, 旗魚串.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] 鼎邊銼 — Keelung signature soup: white rice-noodle bowl with broth */
  /* ---------------------------------------------------------------- */
  {
    id: 'dingbian_cuo',
    displayName: '鼎邊銼',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf5f2ea, 0xc8a56a, 0x8a6842, 0xf0e8d4, 0x5a7a48],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // ceramic bowl - off-white with blue rim
        cyl(0.92, 0.72, 0.58, 10, 0xf5f2ea, { y: 0.29 }),
        cyl(0.94, 0.94, 0.08, 10, 0x3a5a8a, { y: 0.56 }), // blue rim
        // soup broth surface
        cyl(0.84, 0.84, 0.06, 10, 0xc8a56a, { y: 0.5 }),
        // white rice noodle strips floating
        box(0.5, 0.08, 0.12, 0xf0e8d4, { x: -0.2, z: 0.15, y: 0.54, rz: 0.2 }),
        box(0.4, 0.08, 0.12, 0xf0e8d4, { x: 0.25, z: -0.1, y: 0.56, rz: -0.3 }),
        box(0.35, 0.08, 0.12, 0xf0e8d4, { x: 0.0, z: 0.25, y: 0.55, rz: 0.15 }),
        // green scallion bits
        cyl(0.04, 0.04, 0.1, 4, 0x5a7a48, { x: 0.3, z: 0.2, y: 0.58, rz: 0.8 }),
        cyl(0.04, 0.04, 0.08, 4, 0x5a7a48, { x: -0.15, z: -0.2, y: 0.57, rz: -0.5 }),
        // meat bits
        sph(0.1, 0x8a6842, { ws: 5, hs: 3, x: 0.15, z: 0.3, y: 0.55 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 咖哩餃 — curry puff: golden fried crescent-shaped pastry */
  /* ---------------------------------------------------------------- */
  {
    id: 'curry_puff',
    displayName: '咖哩餃',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8a040, 0xc48830, 0xe8b858, 0xb07828, 0xf0c868],
    yOffset: -0.38,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // crescent-shaped fried pastry
      const parts = [
        // main body - flattened sphere with crimped edge
        sph(0.85, 0xd8a040, { ws: 8, hs: 5, sy: 0.5, sx: 1.2, y: 0.42, hex2: 0xe8b858 }),
        // crispy ridge along the curved edge
        torus(0.6, 0.12, 6, 8, 0xc48830, { rx: HALF_PI, y: 0.48, arc: PI }),
      ];
      // crimped edge marks
      for (let i = 0; i < 5; i++) {
        const a = (i / 4) * PI - HALF_PI;
        parts.push(box(0.08, 0.06, 0.15, 0xb07828, {
          x: Math.cos(a) * 0.55, z: Math.sin(a) * 0.55, y: 0.5, ry: a,
        }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 營養三明治 — nutrition sandwich: iconic fried bread with mayo/ham */
  /* ---------------------------------------------------------------- */
  {
    id: 'nutrition_sandwich',
    displayName: '營養三明治',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a050, 0xf0e8d8, 0xff8080, 0x90c878, 0xf8f0e0],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // fried bread bun - elongated golden torpedo shape
        sph(0.9, 0xd8a050, { ws: 8, hs: 6, sx: 1.6, sy: 0.7, y: 0.48, hex2: 0xc89040 }),
        // cut opening showing filling
        box(1.1, 0.25, 0.5, 0xf8f0e0, { y: 0.55 }), // white mayo layer
        // ham slice peeking out
        box(0.8, 0.08, 0.4, 0xff8080, { y: 0.62, x: 0.1 }),
        // cucumber/lettuce edge
        box(0.7, 0.1, 0.35, 0x90c878, { y: 0.58, x: -0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 天婦羅 — tempura/fish cake: fried fish paste on stick, Keelung style */
  /* ---------------------------------------------------------------- */
  {
    id: 'tempura',
    displayName: '天婦羅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.065,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc88848, 0xd89858, 0xb07838, 0xe8a868, 0x8a6030],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // fried fish cake - irregular oblong
        sph(0.7, 0xc88848, { ws: 7, hs: 5, sy: 0.6, sx: 1.3, y: 0.9, hex2: 0xd89858 }),
        cyl(0.55, 0.65, 0.4, 8, 0xd89858, { y: 0.55 }),
        // browned crispy bottom
        cyl(0.6, 0.5, 0.2, 8, 0xb07838, { y: 0.3 }),
        // bamboo skewer stick
        cyl(0.06, 0.06, 1.4, 5, 0xe8d8b0, { y: -0.3 }),
        cone(0.06, 0.15, 5, 0xd8c8a0, { y: -1.05 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 豆干包 — tofu pocket wrap: golden tofu skin stuffed with filling */
  /* ---------------------------------------------------------------- */
  {
    id: 'bean_curd_wrap',
    displayName: '豆干包',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc89848, 0xd8a858, 0xb08038, 0x5a7848, 0xe8b868],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // golden tofu skin wrap - puffy rectangular pouch
        box(0.9, 0.7, 0.7, 0xc89848, { y: 0.4, hex2: 0xd8a858 }),
        // slightly rounded top from stuffing
        sph(0.45, 0xd8a858, { ws: 6, hs: 4, sy: 0.5, y: 0.72 }),
        // toothpick securing the top
        cyl(0.03, 0.03, 0.5, 4, 0xe8d8b0, { rz: 0.3, y: 0.75, x: 0.15 }),
        // peek of green filling
        sph(0.12, 0x5a7848, { ws: 4, hs: 3, x: -0.2, y: 0.78, z: 0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 吉古拉 — jigu la: fish paste tube cooked on bamboo stick */
  /* ---------------------------------------------------------------- */
  {
    id: 'jigu_la',
    displayName: '吉古拉',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a868, 0xc89048, 0xe8b878, 0xb08038, 0xf8d898],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // fish paste cylinder wrapped around bamboo
        cyl(0.4, 0.4, 1.6, 8, 0xd8a868, { y: 0.8, hex2: 0xe8b878 }),
        // slightly browned ends
        cyl(0.42, 0.38, 0.15, 8, 0xc89048, { y: 1.58 }),
        cyl(0.38, 0.42, 0.15, 8, 0xc89048, { y: 0.08 }),
        // bamboo stick poking out both ends
        cyl(0.08, 0.08, 0.4, 5, 0xe8d8b0, { y: 1.8 }),
        cyl(0.08, 0.08, 0.5, 5, 0xe8d8b0, { y: -0.25 }),
        // grill marks
        box(0.44, 0.04, 0.06, 0xb08038, { y: 0.5, rz: 0.3 }),
        box(0.44, 0.04, 0.06, 0xb08038, { y: 1.1, rz: -0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 泡泡冰杯 — bubble ice cup: shaved ice dessert in cup with toppings */
  /* ---------------------------------------------------------------- */
  {
    id: 'paobing_cup',
    displayName: '泡泡冰',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.065,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf8f0f8, 0xff90b0, 0x80d0a0, 0xffd080, 0x70b0e0],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // clear plastic cup
        cyl(0.6, 0.5, 1.0, 10, 0xe8f0f8, { y: 0.5 }),
        // shaved ice mound piled high
        sph(0.65, 0xf8f0f8, { ws: 8, hs: 5, y: 1.2, sy: 0.8 }),
        // colorful syrup drizzle
        sph(0.2, 0xff90b0, { ws: 4, hs: 3, x: 0.25, y: 1.35, z: 0.1 }),
        sph(0.18, 0x80d0a0, { ws: 4, hs: 3, x: -0.2, y: 1.4, z: -0.15 }),
        sph(0.15, 0xffd080, { ws: 4, hs: 3, x: 0.0, y: 1.45, z: 0.2 }),
        // toppings (beans, fruit)
        sph(0.12, 0x70b0e0, { ws: 4, hs: 3, x: -0.3, y: 1.25, z: 0.2 }),
        sph(0.1, 0xffd080, { ws: 4, hs: 3, x: 0.35, y: 1.2, z: -0.1 }),
        // plastic spoon
        cyl(0.06, 0.06, 0.7, 4, 0xf0f0f0, { rz: 0.5, x: 0.4, y: 1.5 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 旗魚串 — swordfish skewer: grilled swordfish chunks on stick */
  /* ---------------------------------------------------------------- */
  {
    id: 'swordfish_skewer',
    displayName: '旗魚串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8d8c8, 0xc8a898, 0xd8c8b8, 0xb09888, 0xf0e0d0],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const parts = [
        // bamboo skewer
        cyl(0.06, 0.06, 2.4, 5, 0xe8d8b0, { y: 0.2 }),
        cone(0.06, 0.2, 5, 0xd8c8a0, { y: -1.0 }),
      ];
      // three fish chunks
      for (let i = 0; i < 3; i++) {
        const y = 0.4 + i * 0.55;
        parts.push(
          box(0.5, 0.4, 0.45, 0xe8d8c8, { y, hex2: 0xd8c8b8 }),
          // grill char marks
          box(0.52, 0.05, 0.1, 0xb09888, { y: y + 0.05, z: 0.18 }),
          box(0.52, 0.05, 0.1, 0xb09888, { y: y - 0.05, z: -0.15 }),
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 廟口拱門 Miaokou night market entrance arch */
  /* ---------------------------------------------------------------- */
  {
    id: 'miaokou_arch',
    displayName: '廟口拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc82828, 0xf0c040, 0x2a2a2e, 0xe84040, 0xf8e8d0],
    yOffset: -0.02,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [
        // two red pillars
        cyl(0.22, 0.22, 2.2, 8, 0xc82828, { x: -1.0, y: 1.1 }),
        cyl(0.22, 0.22, 2.2, 8, 0xc82828, { x: 1.0, y: 1.1 }),
        // gold capitals
        cyl(0.28, 0.24, 0.15, 8, 0xf0c040, { x: -1.0, y: 2.15 }),
        cyl(0.28, 0.24, 0.15, 8, 0xf0c040, { x: 1.0, y: 2.15 }),
        // horizontal beam with traditional roof profile
        box(2.4, 0.3, 0.4, 0xc82828, { y: 2.35, hex2: 0xe84040 }),
        box(2.6, 0.12, 0.5, 0xf0c040, { y: 2.55 }),
        // curved roof top piece
        box(2.8, 0.15, 0.55, 0x2a2a2e, { y: 2.7 }),
        // sign board
        box(1.4, 0.5, 0.12, 0xf8e8d0, { y: 2.35, z: 0.22 }),
        // lanterns hanging
        sph(0.18, 0xc82828, { ws: 6, hs: 4, x: -0.5, y: 1.9, z: 0.3 }),
        sph(0.18, 0xc82828, { ws: 6, hs: 4, x: 0.5, y: 1.9, z: 0.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 攤車 Miaokou food stall cart with steamer */
  /* ---------------------------------------------------------------- */
  {
    id: 'stall_miaokou',
    displayName: '廟口攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xc8c8c8, 0x3a3a3e, 0xe84040, 0xf8f0e0, 0x8a8a8e],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const parts = [
        // stainless steel cart body
        box(1.8, 0.9, 1.0, 0xc8c8c8, { y: 0.8, hex2: 0x8a8a8e }),
        // cart top surface
        box(1.9, 0.08, 1.1, 0xe0e0e4, { y: 1.3 }),
        // steamer stack on top
        cyl(0.4, 0.4, 0.3, 8, 0xd8d0c0, { x: 0.5, y: 1.5 }),
        cyl(0.42, 0.42, 0.3, 8, 0xd8d0c0, { x: 0.5, y: 1.8 }),
        cyl(0.38, 0.38, 0.12, 8, 0x8a4030, { x: 0.5, y: 2.0 }), // lid handle
        // display trays
        box(0.6, 0.1, 0.5, 0xc8c8c8, { x: -0.5, y: 1.4 }),
        // small food items on display
        sph(0.1, 0xd8a050, { ws: 4, hs: 3, x: -0.6, y: 1.55, z: 0.1 }),
        sph(0.1, 0xd8a050, { ws: 4, hs: 3, x: -0.4, y: 1.55, z: -0.1 }),
        // wheels
        cyl(0.2, 0.2, 0.08, 8, 0x3a3a3e, { rx: HALF_PI, x: -0.7, y: 0.2, z: 0.45 }),
        cyl(0.2, 0.2, 0.08, 8, 0x3a3a3e, { rx: HALF_PI, x: 0.7, y: 0.2, z: 0.45 }),
        cyl(0.2, 0.2, 0.08, 8, 0x3a3a3e, { rx: HALF_PI, x: -0.7, y: 0.2, z: -0.45 }),
        cyl(0.2, 0.2, 0.08, 8, 0x3a3a3e, { rx: HALF_PI, x: 0.7, y: 0.2, z: -0.45 }),
        // awning frame
        box(2.0, 0.06, 1.3, 0xe84040, { y: 2.3 }),
        // support poles
        cyl(0.05, 0.05, 1.0, 4, 0x8a8a8e, { x: -0.85, y: 1.8, z: 0.5 }),
        cyl(0.05, 0.05, 1.0, 4, 0x8a8a8e, { x: 0.85, y: 1.8, z: 0.5 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
