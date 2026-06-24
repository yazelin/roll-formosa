/**
 * @file packs/miaoli/archetypes/t1.js — T1 客家小吃街 (Hakka street food).
 *
 * Tier 1 of the Roll Formosa Miaoli ladder (客家小吃街, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/miaoli/tiers.js:
 *   slots [0..7] absorbable 客家小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (客家花布棚 / 擂茶攤, spawnWeight ~0.3).
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
 * T1 theme: 客家小吃街 — Hakka street food items
 * Items: leicha_bowl, bantiao, strawberry, hakka_sausage, hakka_mochi,
 *        ginger_shreds, redwhite_bag, caibao, hakka_cloth_awning, leicha_stall
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] leicha_bowl 擂茶碗 — Hakka ground-tea bowl with pestle           */
  /* ---------------------------------------------------------------- */
  {
    id: 'leicha_bowl',
    displayName: '擂茶碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.12,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0xc8a870, 0x5a3a1a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // wide ceramic grinding bowl (擂缽)
        cyl(1.0, 0.7, 0.6, 10, 0xffffff, { y: 0.3, hex2: 0xd8c8a0 }), // tinted brown ceramic
        cyl(0.7, 0.7, 0.08, 10, 0x8a6a3a, { y: 0.02 }), // base ring
        cyl(1.02, 1.0, 0.1, 10, 0xa08050, { y: 0.58, open: true }), // rim
        // leicha green tea paste inside
        cyl(0.85, 0.85, 0.08, 10, 0x6a8a4a, { y: 0.5 }),
        // wooden pestle (擂棍) resting in the bowl
        cyl(0.12, 0.1, 1.8, 6, 0x9a7a4a, { rz: 0.5, x: 0.2, y: 1.2, hex2: 0xc8a870 }),
        // pestle rounded end
        sph(0.14, 0x8a6a3a, { ws: 6, hs: 4, x: -0.5, y: 0.5 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] bantiao 粄條 — flat Hakka rice noodles in a bowl                */
  /* ---------------------------------------------------------------- */
  {
    id: 'bantiao',
    displayName: '粄條',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf4e8d8, 0xe8d8c0, 0xd8c8a8, 0xf0e0c8, 0xc8b890],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // ceramic soup bowl
        cyl(1.0, 0.6, 0.65, 10, 0xf4f0e8, { y: 0.32, hex2: 0xe8e4dc }),
        cyl(0.6, 0.6, 0.08, 10, 0xd8d4cc, { y: 0.02 }), // base
        cyl(1.02, 1.0, 0.08, 10, 0x2a6ab0, { y: 0.62, open: true }), // blue rim pattern
        // broth
        cyl(0.9, 0.9, 0.06, 10, 0xd8c8a8, { y: 0.55 }),
      ];
      // pile of pale flat noodles (bantiao)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        parts.push(
          box(0.6, 0.08, 0.2, 0xffffff, { // tinted cream noodles
            x: Math.cos(a) * 0.3,
            y: 0.62 + i * 0.06,
            z: Math.sin(a) * 0.3,
            ry: a + rng() * 0.3,
          })
        );
      }
      // green onion garnish
      parts.push(cyl(0.04, 0.04, 0.3, 4, 0x6a9a4a, { rz: 0.3, x: 0.35, y: 0.8 }));
      parts.push(cyl(0.04, 0.04, 0.25, 4, 0x6a9a4a, { rz: -0.2, x: -0.3, y: 0.78 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] strawberry 草莓 — fresh Dahu strawberry                         */
  /* ---------------------------------------------------------------- */
  {
    id: 'strawberry',
    displayName: '草莓',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.03,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xe83040, 0xd02838, 0xf04050, 0xc82030, 0xff5060],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // strawberry body — conical berry shape
        cone(0.8, 1.3, 8, 0xffffff, { y: 0.4, hex2: 0xe83040 }), // red tinted body
        sph(0.82, 0xffffff, { ws: 8, hs: 4, y: 0.9, thetaLen: HALF_PI * 0.8 }), // rounded top
        // green calyx (leaf cap)
        cone(0.35, 0.25, 6, 0x4a8a3a, { y: 1.35, rx: PI }),
        // stem
        cyl(0.06, 0.08, 0.3, 5, 0x5a7a3a, { y: 1.5 }),
      ];
      // seed dimples (yellow dots)
      const seeds = 8;
      for (let i = 0; i < seeds; i++) {
        const a = (i / seeds) * PI * 2;
        const h = 0.4 + (i % 3) * 0.25;
        const r = 0.5 - h * 0.2;
        parts.push(
          sph(0.06, 0xffd84d, {
            ws: 4, hs: 3,
            x: Math.cos(a) * r,
            y: h,
            z: Math.sin(a) * r,
          })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] hakka_sausage 客家香腸 — dark-red Hakka-style sausage            */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_sausage',
    displayName: '客家香腸',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a2a2a, 0xa03838, 0x6a1a1a, 0xb04848, 0x7a2828],
    yOffset: -0.71,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // dark glossy Hakka sausage barrel
        cyl(0.5, 0.5, 2.0, 9, 0xffffff, { rz: HALF_PI, hex2: 0xc85050 }), // tinted dark red
        // rounded ends
        sph(0.5, 0xa03838, { ws: 9, hs: 5, x: -1.0 }),
        sph(0.5, 0xa03838, { ws: 9, hs: 5, x: 1.0 }),
        // bamboo skewer
        cyl(0.07, 0.07, 1.4, 6, 0xe0c890, { rz: HALF_PI, x: 1.4 }),
        // grill char marks
        cyl(0.52, 0.52, 0.1, 9, 0x5a1a1a, { rz: HALF_PI, x: -0.35, open: true }),
        cyl(0.52, 0.52, 0.1, 9, 0x5a1a1a, { rz: HALF_PI, x: 0.35, open: true }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] hakka_mochi 客家麻糬 — chewy Hakka mochi with peanut powder      */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_mochi',
    displayName: '客家麻糬',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf4e8d8, 0xe8d8c0, 0xf0e0c8, 0xd8c8a8, 0xfff0e0],
    yOffset: -0.50,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // soft white mochi body (slightly irregular blob)
        sph(0.85, 0xffffff, { ws: 8, hs: 6, sy: 0.7, y: 0.4 }), // tinted cream-white
        // peanut powder coating (sandy brown layer)
        cyl(0.9, 0.88, 0.15, 8, 0xc8a860, { y: 0.25 }),
      ];
      // scattered peanut powder grains on top
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * PI * 2;
        parts.push(
          ico(0.08, 0, 0xb89850, { x: Math.cos(a) * 0.4, y: 0.65, z: Math.sin(a) * 0.4 })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] ginger_shreds 薑絲 — pile of shredded ginger (for 薑絲炒大腸)      */
  /* ---------------------------------------------------------------- */
  {
    id: 'ginger_shreds',
    displayName: '薑絲',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.04,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xf0d890, 0xe8c870, 0xf8e0a0, 0xd8b860, 0xfff0b0],
    yOffset: -0.60,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // pile of thin ginger shreds — elongated boxes at random angles
      const shreds = 12;
      for (let i = 0; i < shreds; i++) {
        const a = (i / shreds) * PI * 2 + rng() * 0.5;
        const r = 0.15 + rng() * 0.35;
        const h = 0.1 + (i % 4) * 0.08;
        parts.push(
          box(0.6, 0.06, 0.08, 0xffffff, { // tinted pale yellow
            x: Math.cos(a) * r,
            y: h,
            z: Math.sin(a) * r,
            ry: a + rng() * 0.8,
            rz: (rng() - 0.5) * 0.4,
          })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] redwhite_bag 紅白塑膠袋 — knotted red-and-white carrier bag       */
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
        // bulging white bag body — fuller at the bottom
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        // BOLD red/white horizontal stripes (classic 紅白條紋)
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        // gathered white neck
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        // two upright red vest-loop handles
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] caibao 客家菜包 — Hakka vegetable-filled bun (green leaf wrap)   */
  /* ---------------------------------------------------------------- */
  {
    id: 'caibao',
    displayName: '客家菜包',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x6a9a4a, 0x5a8a3a, 0x7aaa5a, 0x4a7a2a, 0x8aba6a],
    yOffset: -0.48,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // green mugwort/leaf-wrapped exterior (半圓形)
        sph(0.9, 0xffffff, { ws: 10, hs: 5, sy: 0.65, y: 0.4, thetaLen: PI * 0.55 }), // tinted green
        // flat base
        cyl(0.85, 0.85, 0.12, 10, 0x5a8a3a, { y: 0.06 }),
        // pleated crimp seam on top (decorative ridge)
        box(1.2, 0.1, 0.15, 0x4a7a2a, { y: 0.72, rz: 0.1 }),
        // visible filling peek (pale mochi-like interior at edges)
        sph(0.25, 0xf4e8d0, { ws: 5, hs: 3, x: 0.55, y: 0.35, z: 0.0 }),
        sph(0.22, 0xf4e8d0, { ws: 5, hs: 3, x: -0.52, y: 0.32, z: 0.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 客家花布棚 Hakka floral-cloth awning             */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_cloth_awning',
    displayName: '客家花布棚',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xe83050, 0xff6080, 0x2a7a4a, 0xffd84d, 0x3a3a3a],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // four corner posts
        cyl(0.08, 0.08, 2.0, 6, 0x9a7a4a, { x: -1.0, y: 1.0, z: 0.6 }),
        cyl(0.08, 0.08, 2.0, 6, 0x9a7a4a, { x: 1.0, y: 1.0, z: 0.6 }),
        cyl(0.08, 0.08, 2.0, 6, 0x9a7a4a, { x: -1.0, y: 1.0, z: -0.6 }),
        cyl(0.08, 0.08, 2.0, 6, 0x9a7a4a, { x: 1.0, y: 1.0, z: -0.6 }),
        // top frame rails
        box(2.2, 0.08, 0.08, 0x8a6a3a, { x: 0, y: 2.0, z: 0.6 }),
        box(2.2, 0.08, 0.08, 0x8a6a3a, { x: 0, y: 2.0, z: -0.6 }),
        // Hakka floral cloth canopy (red base with flower pattern)
        box(2.4, 0.06, 1.4, 0xe83050, { y: 2.08 }),
        // flower pattern accents (simplified as colored dots)
        cyl(0.2, 0.2, 0.07, 6, 0xffd84d, { y: 2.12, x: -0.6, z: 0 }),
        cyl(0.2, 0.2, 0.07, 6, 0x2a7a4a, { y: 2.12, x: 0.6, z: 0 }),
        cyl(0.15, 0.15, 0.07, 6, 0xff6080, { y: 2.12, x: 0, z: 0.35 }),
        cyl(0.15, 0.15, 0.07, 6, 0xff6080, { y: 2.12, x: 0, z: -0.35 }),
        // valance hanging down front
        box(2.4, 0.3, 0.05, 0xe83050, { y: 1.88, z: 0.72, hex2: 0xff6080 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 擂茶攤 leicha grinding stall                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'leicha_stall',
    displayName: '擂茶攤',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.25,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x9a7a4a, 0xc8a870, 0x8a6a3a, 0x6a9a4a, 0xf4e8d0],
    yOffset: -0.31,
    upright: true,
    collisionScale: 0.74,
    buildGeometry(rng) {
      const parts = [
        // wooden counter/table
        box(2.4, 0.16, 1.2, 0xc8a870, { y: 1.08, hex2: 0x9a7a4a }),
        // lower cabinet
        box(2.3, 0.9, 1.1, 0x8a6a3a, { y: 0.5 }),
        // grinding bowls on counter (2 leicha bowls)
        cyl(0.4, 0.28, 0.28, 8, 0xd8c8a0, { x: -0.6, y: 1.3 }),
        cyl(0.4, 0.28, 0.28, 8, 0xd8c8a0, { x: 0.5, y: 1.3 }),
        // pestles leaning in bowls
        cyl(0.05, 0.04, 0.9, 5, 0x9a7a4a, { rz: 0.4, x: -0.5, y: 1.7 }),
        cyl(0.05, 0.04, 0.9, 5, 0x9a7a4a, { rz: -0.35, x: 0.6, y: 1.65 }),
        // tea powder containers
        cyl(0.2, 0.2, 0.4, 6, 0x6a9a4a, { x: -0.2, y: 1.36 }),
        cyl(0.18, 0.18, 0.35, 6, 0x8a6a3a, { x: 0.15, y: 1.34 }),
        // menu sign board at back
        box(2.0, 0.6, 0.08, 0xf4e8d0, { y: 2.0, z: -0.58 }),
        box(1.8, 0.1, 0.1, 0xe83050, { y: 2.25, z: -0.58 }), // red header
        // stools in front
        cyl(0.25, 0.28, 0.5, 6, 0xc8a870, { x: -0.8, y: 0.25, z: 0.9 }),
        cyl(0.25, 0.28, 0.5, 6, 0xc8a870, { x: 0.8, y: 0.25, z: 0.9 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
