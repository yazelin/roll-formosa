/**
 * @file packs/penghu/archetypes/t1.js — T1 漁村小物 (fishing village items).
 *
 * Tier 1 of the Roll Formosa Penghu ladder (漁港, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/penghu/tiers.js:
 *   slots [0..7] absorbable fishing village 小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (浮球堆 / 蚵架, spawnWeight ~0.3).
 *
 * Penghu themes: brown sugar cake, cactus fruit, seafood, fishing floats
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
  /* [0] 黑糖糕 — Penghu brown sugar cake, layered square dessert      */
  /* ---------------------------------------------------------------- */
  {
    id: 'brown_sugar_cake',
    displayName: '黑糖糕',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a3a28, 0x6a4a38, 0x4a2a18, 0x7a5a48, 0x3a2a18],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // layered cake body
        box(1.2, 0.35, 1.2, 0xffffff, { y: 0.18 }), // bottom layer (darkest, tinted)
        box(1.18, 0.3, 1.18, 0x7a5a48, { y: 0.48 }), // middle layer
        box(1.16, 0.28, 1.16, 0x8a6a58, { y: 0.76 }), // top layer (lighter)
        // glossy surface sheen
        box(1.14, 0.04, 1.14, 0x9a7a68, { y: 0.92 }),
        // cut marks on top
        box(0.02, 0.06, 1.1, 0x4a3a28, { y: 0.88 }),
        box(1.1, 0.06, 0.02, 0x4a3a28, { y: 0.88 }),
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
  /* [2] 仙人掌果 — prickly pear cactus fruit, purple-red oval         */
  /* ---------------------------------------------------------------- */
  {
    id: 'cactus_fruit',
    displayName: '仙人掌果',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb83060, 0xc84070, 0xa82050, 0xd85080, 0x982040],
    yOffset: -0.2,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // main fruit body (ovoid)
        sph(0.8, 0xffffff, { ws: 9, hs: 7, sy: 1.4, y: 0.7 }),
        // stem nub at bottom
        cyl(0.2, 0.15, 0.2, 6, 0x4a8a3a, { y: 0.1 }),
        // crown at top (dried flower remnant)
        cyl(0.25, 0.15, 0.15, 6, 0x8a6a4a, { y: 1.55 }),
      ];
      // small spines/dots on surface
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        parts.push(sph(0.06, 0xd8c0b0, { x: Math.cos(a) * 0.65, y: 0.7, z: Math.sin(a) * 0.65, ws: 4, hs: 3 }));
      }
      return finish(parts);
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
  /* [4] 小卷乾 — dried squid snack, flat reddish-brown body           */
  /* ---------------------------------------------------------------- */
  {
    id: 'dried_squid',
    displayName: '小卷乾',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xb86840, 0xc87850, 0xa85830, 0xd88860, 0x984820],
    yOffset: -0.75,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // flattened body
        sph(0.8, 0xffffff, { ws: 8, hs: 6, sy: 0.25, sx: 1.3, y: 0.12 }),
        // head end (tapered)
        cone(0.5, 0.6, 6, 0xd08868, { rz: -HALF_PI, x: -0.9, sy: 0.3 }),
        // tail fins (triangular)
        box(0.5, 0.05, 0.6, 0xc07858, { x: 0.8, rz: 0.2 }),
        // tentacle hints
        box(0.15, 0.04, 0.12, 0xb06848, { x: -1.2, z: 0.15 }),
        box(0.15, 0.04, 0.12, 0xb06848, { x: -1.2, z: -0.15 }),
        box(0.12, 0.04, 0.1, 0xb06848, { x: -1.25, z: 0.0 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 釣線捲 — fishing line spool, cylindrical plastic reel         */
  /* ---------------------------------------------------------------- */
  {
    id: 'fishing_line_spool',
    displayName: '釣線捲',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x40a0e0, 0x50b0f0, 0x3090d0, 0x60c0ff, 0x2080c0],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // central spool hub
        cyl(0.3, 0.3, 0.6, 8, 0x3a3a40, { rz: HALF_PI }),
        // side flanges
        cyl(0.7, 0.7, 0.08, 10, 0xffffff, { rz: HALF_PI, x: -0.35 }),
        cyl(0.7, 0.7, 0.08, 10, 0xffffff, { rz: HALF_PI, x: 0.35 }),
        // wound line on spool (tinted)
        cyl(0.6, 0.6, 0.5, 10, 0xffffff, { rz: HALF_PI, x: 0.0 }),
        // line texture rings
        cyl(0.62, 0.62, 0.1, 10, 0xd0e8f8, { rz: HALF_PI, x: -0.15 }),
        cyl(0.62, 0.62, 0.1, 10, 0xd0e8f8, { rz: HALF_PI, x: 0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 紅白塑膠袋 — knotted red-and-white plastic carrier bag        */
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
        // BOLD red/white horizontal stripes (classic red-white stripes) — wide bands
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
  /* [7] 花生酥 — Penghu peanut candy, round disc shape                */
  /* ---------------------------------------------------------------- */
  {
    id: 'peanut_candy',
    displayName: '花生酥',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a860, 0xe8b870, 0xc89850, 0xf0c880, 0xb88840],
    yOffset: -0.65,
    upright: false,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [
        // round disc body
        cyl(1.0, 1.0, 0.35, 12, 0xffffff, { y: 0.18 }),
        // slightly domed top
        sph(1.0, 0xf0d0a0, { ws: 8, hs: 3, thetaLen: HALF_PI * 0.3, y: 0.32, sy: 0.3 }),
      ];
      // peanut bits visible on surface
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * PI * 2;
        const r = 0.5 + (i % 2) * 0.2;
        parts.push(sph(0.1, 0xc8a050, { x: Math.cos(a) * r, y: 0.38, z: Math.sin(a) * r, ws: 4, hs: 3 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 浮球堆 pile of fishing floats                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'float_pile',
    displayName: '浮球堆',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x40a0e0, 0xf07030, 0xe0e040, 0x30b060, 0xe04050],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      const colors = [0x40a0e0, 0xf07030, 0xe0e040, 0x30b060, 0xe04050];
      // bottom layer - 4 floats (reduced segments: ws=6, hs=4)
      parts.push(sph(0.4, colors[0], { x: -0.35, y: 0.4, z: 0.35, ws: 6, hs: 4 }));
      parts.push(sph(0.4, colors[1], { x: 0.35, y: 0.4, z: 0.35, ws: 6, hs: 4 }));
      parts.push(sph(0.4, colors[2], { x: -0.35, y: 0.4, z: -0.35, ws: 6, hs: 4 }));
      parts.push(sph(0.4, colors[3], { x: 0.35, y: 0.4, z: -0.35, ws: 6, hs: 4 }));
      // top layer - 2 floats
      parts.push(sph(0.38, colors[4], { x: -0.15, y: 1.0, z: 0.0, ws: 6, hs: 4 }));
      parts.push(sph(0.38, colors[0], { x: 0.25, y: 1.0, z: 0.1, ws: 6, hs: 4 }));
      // rope tying them together
      parts.push(torus(0.6, 0.04, 3, 6, 0x8a7a5a, { y: 0.5, rx: 0.3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 蚵架 small oyster rack frame                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'oyster_rack',
    displayName: '蚵架',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x6a5a4a, 0x7a6a5a, 0x5a4a3a, 0x8a7a6a, 0x4a3a2a],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      const bamboo = 0x9a8a5a;
      // A-frame structure (reduced segments: 4)
      // left legs
      parts.push(cyl(0.06, 0.05, 1.8, 4, bamboo, { x: -0.7, y: 0.9, z: 0.4, rz: 0.25 }));
      parts.push(cyl(0.06, 0.05, 1.8, 4, bamboo, { x: -0.7, y: 0.9, z: -0.4, rz: 0.25 }));
      // right legs
      parts.push(cyl(0.06, 0.05, 1.8, 4, bamboo, { x: 0.7, y: 0.9, z: 0.4, rz: -0.25 }));
      parts.push(cyl(0.06, 0.05, 1.8, 4, bamboo, { x: 0.7, y: 0.9, z: -0.4, rz: -0.25 }));
      // top crossbar
      parts.push(cyl(0.07, 0.06, 1.6, 4, bamboo, { y: 1.75, rz: HALF_PI }));
      // horizontal bar connecting legs
      parts.push(cyl(0.05, 0.05, 0.9, 4, bamboo, { y: 0.5, z: 0.4, rz: HALF_PI }));
      parts.push(cyl(0.05, 0.05, 0.9, 4, bamboo, { y: 0.5, z: -0.4, rz: HALF_PI }));
      // hanging oyster strings (ropes with lumpy oysters) - 2 instead of 3
      for (let i = 0; i < 2; i++) {
        const x = -0.3 + i * 0.6;
        parts.push(cyl(0.02, 0.02, 1.2, 3, 0x5a4a3a, { x, y: 1.1 }));
        // oyster clusters
        parts.push(sph(0.12, 0x8a8a80, { x, y: 1.3, ws: 4, hs: 3, sy: 1.3 }));
        parts.push(sph(0.11, 0x9a9a90, { x: x - 0.03, y: 0.7, ws: 4, hs: 3, sy: 1.3 }));
      }
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
