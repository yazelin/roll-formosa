/**
 * @file packs/yilan/archetypes/t1.js — T1 羅東夜市 (Luodong night-market items).
 *
 * Tier 1 of the Roll Formosa Yilan ladder (羅東夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/yilan/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (夜市拱門 / 攤車, spawnWeight ~0.3).
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
  /* [0] 溫泉麻糬 — Jiaoxi hot spring mochi: soft round mochi ball        */
  /* ---------------------------------------------------------------- */
  {
    id: 'hot_spring_mochi',
    displayName: '溫泉麻糬',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xf0e8d8, 0xe8e0d0, 0xfff8f0, 0xf4f0e0],
    yOffset: -0.20,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // soft round mochi base (slightly squished)
        sph(0.8, 0xffffff, { ws: 8, hs: 6, y: 0.6, sy: 0.7, hex2: 0xf8f4e8 }),
        // slight indent on top where it sits
        cyl(0.35, 0.4, 0.08, 8, 0xf0e8d8, { y: 0.95 }),
        // peanut powder dusting (light brown spots)
        sph(0.1, 0xd8c8a0, { ws: 4, hs: 3, x: 0.3, y: 0.75, z: 0.2 }),
        sph(0.08, 0xd0c098, { ws: 4, hs: 3, x: -0.25, y: 0.8, z: 0.15 }),
        sph(0.1, 0xd8c8a0, { ws: 4, hs: 3, x: 0.1, y: 0.7, z: -0.3 }),
        sph(0.08, 0xd0c098, { ws: 4, hs: 3, x: -0.15, y: 0.85, z: -0.2 }),
        // bamboo pick stuck in top
        cyl(0.02, 0.02, 0.4, 4, 0xc8a870, { y: 1.05 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 寶特瓶 — clear PET water bottle: ribbed body, blue screw cap */
  /* ---------------------------------------------------------------- */
  {
    id: 'pet_bottle',
    displayName: '寶特瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xcfe6e2, 0xbfdfe8, 0x2f6fb0, 0xeaf4f2, 0x9cc6d2],
    yOffset: -0.1095,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      return finish([
        cyl(0.5, 0.46, 0.28, 9, 0xcfe6e2, { y: 0.16 }), // foot
        cyl(0.5, 0.5, 0.9, 9, 0xcfe6e2, { y: 0.74, hex2: 0xeaf4f2 }), // body
        // grip rings
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.55 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.78 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 1.01 }),
        cyl(0.32, 0.5, 0.34, 9, 0xcfe6e2, { y: 1.36 }), // shoulder
        cyl(0.22, 0.22, 0.22, 9, 0xeaf4f2, { y: 1.62 }), // neck
        cyl(0.27, 0.27, 0.2, 9, 0x2f6fb0, { y: 1.78 }), // blue cap
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 鴨賞 — Yilan dried duck: flat pressed duck jerky slab */
  /* ---------------------------------------------------------------- */
  {
    id: 'duck_jerky',
    displayName: '鴨賞',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a4a2a, 0x6a3a1a, 0xa85a30, 0xc87040, 0x5a2a10],
    yOffset: -0.45,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // flat pressed duck body
        box(1.6, 0.25, 1.0, 0x8a4a2a, { y: 0.12, hex2: 0xa85a30 }),
        // slightly domed top from pressing
        sph(0.8, 0x6a3a1a, { ws: 8, hs: 4, sy: 0.15, y: 0.28 }),
        // vacuum-sealed packaging edge
        box(1.7, 0.04, 1.1, 0xd0c8c0, { y: 0.0 }),
        // label sticker
        box(0.6, 0.02, 0.4, 0xf0e0d0, { x: 0.3, y: 0.26, z: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 香 — single thin incense stick: red shaft, glowing ember tip */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_stick',
    displayName: '香',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8302a, 0x8a4a2a, 0xd8a23a, 0xe6c060, 0x6a3a1e],
    yOffset: -0.0008,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      return finish([
        cyl(0.05, 0.05, 2.7, 6, 0xb8302a, { y: 0.0 }), // red bamboo stick
        cyl(0.07, 0.06, 0.9, 6, 0x8a4a2a, { y: -1.0 }), // incense-paste lower coat
        cyl(0.085, 0.085, 0.12, 6, 0x6a3a1e, { y: 1.32 }), // burnt char band
        sph(0.1, 0xe6c060, { ws: 6, hs: 4, y: 1.46 }), // glowing ember tip
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 金紙 — stack of joss paper: cream sheets, central gold-foil square */
  /* ---------------------------------------------------------------- */
  {
    id: 'joss_paper',
    displayName: '金紙',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8c468, 0xf0deb0, 0xd8a83a, 0xc89a2e, 0xf4e8c8],
    yOffset: -0.5589,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // stacked cream sheets, faint layering via alternating tints
      for (let i = 0; i < 7; i++) {
        const tint = i % 2 === 0 ? 0xf0deb0 : 0xe8d8a8;
        parts.push(box(1.5, 0.12, 1.1, tint, { y: 0.06 + i * 0.12 }));
      }
      // central gold-foil square on the top sheet
      parts.push(box(0.62, 0.04, 0.62, 0xe8c468, { y: 0.9, hex2: 0xd8a83a }));
      // red ledger stripe along one edge
      parts.push(box(0.16, 0.86, 1.12, 0xc24028, { x: -0.67, y: 0.43 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 滷味夾 — luwei serving tongs: two steel arms hinged at a pivot */
  /* ---------------------------------------------------------------- */
  {
    id: 'luwei_tongs',
    displayName: '滷味夾',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.11,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8ccd2, 0xaeb4bc, 0xe0e4ea, 0x8a9098, 0xd4d8de],
    yOffset: -0.5971,
    upright: false,
    collisionScale: 0.6,
    buildGeometry(rng) {
      return finish([
        cyl(0.16, 0.16, 0.16, 8, 0x8a9098, { rz: HALF_PI, y: 0.0 }), // hinge pivot
        // upper arm: opens toward +x, angled up
        box(2.1, 0.12, 0.16, 0xc8ccd2, { rz: 0.22, x: 0.95, y: 0.28 }),
        box(0.4, 0.12, 0.34, 0xe0e4ea, { rz: 0.22, x: 1.95, y: 0.5 }), // upper scoop pad
        // lower arm: angled down
        box(2.1, 0.12, 0.16, 0xaeb4bc, { rz: -0.22, x: 0.95, y: -0.28 }),
        box(0.4, 0.12, 0.34, 0xd4d8de, { rz: -0.22, x: 1.95, y: -0.5 }), // lower scoop pad
        // spring loop behind the pivot
        torus(0.22, 0.05, 5, 8, 0xaeb4bc, { rz: HALF_PI, x: -0.34, y: 0.0, arc: PI * 1.4 }),
      ]);
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
  /* [7] 蔥油餅 — scallion pancake: layered crispy flat cake w/ green bits */
  /* ---------------------------------------------------------------- */
  {
    id: 'scallion_pancake',
    displayName: '蔥油餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8b870, 0xc8a050, 0xe8c880, 0x4a8a3a, 0xf0e0c0],
    yOffset: -0.55,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // layered pancake body
        cyl(0.95, 1.0, 0.12, 10, 0xd8b870, { y: 0.06 }),
        cyl(1.0, 0.95, 0.10, 10, 0xc8a050, { y: 0.17 }),
        cyl(0.92, 0.92, 0.08, 10, 0xe8c880, { y: 0.25 }),
        // crispy golden-brown edges
        cyl(1.02, 1.02, 0.04, 10, 0xb89040, { y: 0.12, open: true }),
      ];
      // scattered scallion bits on top
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2 + (rng ? rng() * 0.3 : 0);
        const r = 0.3 + (i % 3) * 0.2;
        parts.push(
          box(0.12, 0.04, 0.06, 0x4a8a3a, { x: Math.cos(a) * r, y: 0.31, z: Math.sin(a) * r })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 夜市拱門 night-market arch entrance */
  /* ---------------------------------------------------------------- */
  {
    id: 'night_market_arch',
    displayName: '夜市拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xc4203a, 0xfff04a, 0x2f6db0, 0xe8e8ee, 0x39e08a],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // two stout pillars
      parts.push(box(0.45, 3.2, 0.45, 0xc4203a, { x: -2.0, y: 1.6, hex2: 0xff8c1a }));
      parts.push(box(0.45, 3.2, 0.45, 0xc4203a, { x: 2.0, y: 1.6, hex2: 0xff8c1a }));
      // pillar caps
      parts.push(box(0.6, 0.18, 0.6, 0xfff04a, { x: -2.0, y: 3.28 }));
      parts.push(box(0.6, 0.18, 0.6, 0xfff04a, { x: 2.0, y: 3.28 }));
      // arched top beam
      parts.push(torus(2.05, 0.22, 4, 8, 0xfff04a, { x: 0, y: 3.2, arc: PI }));
      // signboard banner
      parts.push(box(3.6, 0.7, 0.18, 0x2f6db0, { x: 0, y: 3.9, hex2: 0x39e08a }));
      parts.push(box(3.4, 0.12, 0.2, 0xfff04a, { x: 0, y: 4.18 }));
      // hanging lanterns
      for (let i = 0; i < 5; i++) {
        const lx = -1.6 + i * 0.8;
        const c = [0xc4203a, 0xfff04a, 0xff8c1a][i % 3];
        parts.push(sph(0.18, c, { x: lx, y: 2.7, ws: 6, hs: 4 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 攤車 wheeled stall cart w/ awning */
  /* ---------------------------------------------------------------- */
  {
    id: 'stall',
    displayName: '攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd83026, 0xe0a050, 0x9a8a78, 0xead8b0, 0xffd06a],
    yOffset: -0.37,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const wood = 0x9a7a52;
      const parts = [
        // cart body cabinet
        box(2.0, 1.0, 1.1, wood, { y: 0.75 }),
        // counter / stainless top
        box(2.15, 0.1, 1.25, 0xd8dce2, { y: 1.3 }),
        // front face panel
        box(2.0, 0.5, 0.06, 0xffffff, { y: 0.7, z: 0.56 }),
        // roof posts
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: 0.45 }),
        // striped awning roof
        box(2.4, 0.12, 1.5, 0xd83026, { y: 2.6 }),
        box(2.4, 0.28, 0.06, 0xe0a050, { y: 2.42, z: 0.74 }),
        // hanging lamp
        sph(0.2, 0xffd06a, { ws: 6, hs: 4, x: 0.7, y: 2.3, z: 0.5 }),
        // cart wheels
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.34, z: 0 }),
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.34, z: 0 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
