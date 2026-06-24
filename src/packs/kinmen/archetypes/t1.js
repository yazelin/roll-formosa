/**
 * @file packs/kinmen/archetypes/t1.js — T1 高粱酒巷 (kaoliang alley items).
 *
 * Tier 1 of the Roll Formosa Kinmen ladder (高粱酒巷, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/kinmen/tiers.js:
 *   slots [0..7] absorbable Kinmen alley items (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (高粱酒甕 / 石敢當, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band (radiusNominal, REAL meters): 0.05-0.25 m.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] kaoliang_bottle 高粱酒瓶 — Kinmen kaoliang liquor bottle        */
  /* ---------------------------------------------------------------- */
  {
    id: 'kaoliang_bottle',
    displayName: '高粱酒瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xe8e0d0, 0xffffff, 0xd8d0c0, 0xfff8f0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // classic white ceramic kaoliang bottle shape
      parts.push(cyl(0.5, 0.45, 0.25, 9, 0xffffff, { y: 0.12 })); // base
      parts.push(cyl(0.52, 0.5, 0.7, 9, 0xffffff, { y: 0.5, hex2: 0xf8f4e8 })); // body
      parts.push(cyl(0.45, 0.52, 0.35, 9, 0xffffff, { y: 0.95 })); // shoulder
      parts.push(cyl(0.28, 0.35, 0.25, 8, 0xf0e8d8, { y: 1.2 })); // neck
      parts.push(cyl(0.32, 0.3, 0.12, 8, 0xe0d8c8, { y: 1.38 })); // lip
      // red cap/cork
      parts.push(cyl(0.25, 0.28, 0.18, 6, 0xc02020, { y: 1.52 }));
      // red label band with gold characters
      parts.push(cyl(0.54, 0.54, 0.28, 8, 0xc02020, { y: 0.55, open: true }));
      // gold trim lines
      parts.push(cyl(0.55, 0.55, 0.04, 8, 0xd4a030, { y: 0.42, open: true }));
      parts.push(cyl(0.55, 0.55, 0.04, 8, 0xd4a030, { y: 0.68, open: true }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] beef_jerky 牛肉乾 — Kinmen specialty beef jerky pack            */
  /* ---------------------------------------------------------------- */
  {
    id: 'beef_jerky',
    displayName: '牛肉乾',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a3020, 0x6a2418, 0xa04028, 0x5a1c14, 0xb84830],
    yOffset: -0.55,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // vacuum-sealed pack shape
      parts.push(box(1.4, 0.3, 1.0, 0xffffff, { y: 0.15, hex2: 0xf0e8d8 })); // plastic pack
      // visible jerky pieces inside (dark red-brown)
      parts.push(box(1.2, 0.22, 0.85, 0x8a3020, { y: 0.15, hex2: 0x6a2418 }));
      // label area on top
      parts.push(box(0.9, 0.05, 0.7, 0xf8f0e0, { y: 0.28 }));
      // red brand label
      parts.push(box(0.6, 0.06, 0.4, 0xc02020, { y: 0.29 }));
      // gold seal
      parts.push(cyl(0.12, 0.12, 0.03, 8, 0xd4a030, { x: 0.35, y: 0.3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] gong_tang_box 貢糖盒 — box of gong tang peanut candy            */
  /* ---------------------------------------------------------------- */
  {
    id: 'gong_tang_box',
    displayName: '貢糖盒',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd4a030, 0xc89020, 0xe8b840, 0xb88018, 0xf0c848],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [];
      // traditional gift box shape
      parts.push(box(1.6, 0.8, 1.2, 0xffffff, { y: 0.4, hex2: 0xf0c848 })); // main box body
      // lid slightly raised
      parts.push(box(1.65, 0.12, 1.25, 0xe8b840, { y: 0.85 }));
      // decorative border
      parts.push(box(1.68, 0.08, 0.08, 0xc89020, { y: 0.82, z: 0.6 }));
      parts.push(box(1.68, 0.08, 0.08, 0xc89020, { y: 0.82, z: -0.6 }));
      parts.push(box(0.08, 0.08, 1.28, 0xc89020, { y: 0.82, x: 0.78 }));
      parts.push(box(0.08, 0.08, 1.28, 0xc89020, { y: 0.82, x: -0.78 }));
      // brand label on top
      parts.push(box(0.8, 0.04, 0.5, 0xc02020, { y: 0.92 }));
      // gold characters
      parts.push(box(0.5, 0.05, 0.25, 0xd4a030, { y: 0.93 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] stone_oyster 石蚵 — Kinmen's stone-farmed oyster cluster        */
  /* ---------------------------------------------------------------- */
  {
    id: 'stone_oyster',
    displayName: '石蚵',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xa09888, 0x908878, 0xb0a898, 0x807868, 0xc0b8a8],
    yOffset: -0.45,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // stone base
      parts.push(sph(0.7, 0xffffff, { ws: 6, hs: 4, y: 0.35, sy: 0.5, hex2: 0xb0a898 }));
      // attached oyster shells - irregular clusters
      parts.push(sph(0.35, 0x989080, { ws: 5, hs: 3, x: 0.3, y: 0.55, sy: 0.3 }));
      parts.push(sph(0.3, 0x888070, { ws: 5, hs: 3, x: -0.25, y: 0.6, sy: 0.25 }));
      parts.push(sph(0.28, 0xa09888, { ws: 5, hs: 3, x: 0.1, y: 0.65, z: 0.2, sy: 0.3 }));
      parts.push(sph(0.25, 0x908878, { ws: 5, hs: 3, x: -0.1, y: 0.58, z: -0.2, sy: 0.28 }));
      // shell ridges
      parts.push(box(0.04, 0.15, 0.25, 0x706860, { x: 0.3, y: 0.6, ry: 0.3 }));
      parts.push(box(0.04, 0.12, 0.2, 0x706860, { x: -0.2, y: 0.62, ry: -0.4 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] wine_cup 酒杯 — small ceramic wine cup for kaoliang             */
  /* ---------------------------------------------------------------- */
  {
    id: 'wine_cup',
    displayName: '酒杯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.04,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0e8e0, 0xe0d8d0, 0xfff8f0, 0xd0c8c0, 0xfffff8],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // traditional small ceramic cup
      parts.push(cyl(0.4, 0.5, 0.12, 8, 0xffffff, { y: 0.06 })); // foot
      parts.push(cyl(0.52, 0.45, 0.5, 8, 0xffffff, { y: 0.35, hex2: 0xfff8f0 })); // body
      parts.push(cyl(0.56, 0.54, 0.08, 8, 0xf0e8e0, { y: 0.64 })); // rim
      // blue decorative band (classic style)
      parts.push(cyl(0.54, 0.54, 0.1, 8, 0x3060a0, { y: 0.45, open: true }));
      // liquid inside (clear)
      parts.push(cyl(0.44, 0.44, 0.12, 8, 0xf8f4ec, { y: 0.55 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] kerosene_lamp 煤油燈 — old kerosene lamp                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'kerosene_lamp',
    displayName: '煤油燈',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8a870, 0xb89860, 0xd8b880, 0xa88850, 0xe8c890],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const brass = 0xffffff;
      const parts = [];
      // base
      parts.push(cyl(0.6, 0.55, 0.15, 8, brass, { y: 0.08 }));
      // fuel reservoir
      parts.push(cyl(0.5, 0.55, 0.4, 8, brass, { y: 0.35, hex2: 0xd8b880 }));
      // burner collar
      parts.push(cyl(0.25, 0.35, 0.15, 8, 0x8a7a60, { y: 0.62 }));
      // glass chimney
      parts.push(cyl(0.28, 0.22, 0.8, 8, 0xf8f4f0, { y: 1.1, open: true }));
      parts.push(cyl(0.3, 0.3, 0.08, 8, 0x606050, { y: 0.72 }));
      parts.push(cyl(0.25, 0.25, 0.08, 8, 0x606050, { y: 1.52 }));
      // flame (warm glow)
      parts.push(sph(0.1, 0xffcc44, { ws: 6, hs: 4, y: 0.9 }));
      // handle
      parts.push(torus(0.25, 0.04, 5, 8, brass, { x: 0.55, y: 0.4 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] oyster_skewer 蚵仔串 — skewer of stone oysters                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'oyster_skewer',
    displayName: '蚵仔串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.12,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xb0a090, 0xd8c8b0, 0xa09080, 0xe8d8c0],
    yOffset: -0.10,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [];
      // bamboo skewer stick
      parts.push(cyl(0.04, 0.04, 2.2, 5, 0xa08050, { y: 1.1 }));
      // oysters on skewer - flattened spheres
      for (let i = 0; i < 5; i++) {
        const oy = 0.4 + i * 0.35;
        const tilt = (i % 2 === 0) ? 0.15 : -0.15;
        parts.push(sph(0.2, 0xffffff, { ws: 6, hs: 4, y: oy, sy: 0.5, sx: 0.8, rz: tilt, hex2: 0xd8c8b0 }));
        // darker edge detail
        parts.push(sph(0.12, 0x908878, { ws: 4, hs: 3, y: oy + 0.05, x: 0.08, sy: 0.3 }));
      }
      // pointed top of skewer
      parts.push(cone(0.04, 0.15, 4, 0x906830, { y: 2.25 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] noodle_bowl 麵線碗 — bowl of noodles                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'noodle_bowl',
    displayName: '麵線碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe0d4c0, 0xf4ece0, 0xd0c4b0, 0xfff8e8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // bowl body
      parts.push(cyl(0.5, 0.8, 0.5, 10, 0xffffff, { y: 0.25, hex2: 0xf0e8d8 }));
      parts.push(cyl(0.82, 0.8, 0.1, 10, 0xe0d8c8, { y: 0.55 })); // rim
      // noodles inside
      parts.push(sph(0.65, 0xf0e0c8, { ws: 8, hs: 5, y: 0.45, sy: 0.5 }));
      // noodle strands on top
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * PI * 2;
        parts.push(cyl(0.04, 0.04, 0.4, 4, 0xf8f0e0, {
          x: Math.cos(a) * 0.25, z: Math.sin(a) * 0.25, y: 0.65,
          rz: 0.3 + rng() * 0.2, ry: a
        }));
      }
      // broth color
      parts.push(cyl(0.7, 0.7, 0.08, 8, 0xc8a880, { y: 0.35 }));
      // chopsticks
      parts.push(cyl(0.03, 0.03, 0.8, 4, 0x5a3a20, { y: 0.7, z: 0.4, rx: 0.3 }));
      parts.push(cyl(0.03, 0.03, 0.8, 4, 0x5a3a20, { y: 0.72, z: 0.35, rx: 0.32 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 高粱酒甕 large kaoliang wine urn               */
  /* ---------------------------------------------------------------- */
  {
    id: 'kaoliang_urn',
    displayName: '高粱酒甕',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x5a4030, 0x6a4a38, 0x4a3428, 0x7a5a48, 0x3a2a20],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const clay = 0xffffff;
      const parts = [];
      // large urn body
      parts.push(cyl(0.6, 0.5, 0.3, 6, clay, { y: 0.15 })); // base
      parts.push(cyl(0.85, 0.6, 0.6, 6, clay, { y: 0.55, hex2: 0x8a7060 })); // lower belly
      parts.push(cyl(0.9, 0.85, 0.5, 6, clay, { y: 1.0 })); // upper belly
      parts.push(cyl(0.7, 0.9, 0.4, 6, clay, { y: 1.4 })); // shoulder
      parts.push(cyl(0.5, 0.6, 0.3, 6, 0x7a5a48, { y: 1.7 })); // neck
      parts.push(cyl(0.55, 0.52, 0.15, 6, 0x6a4a38, { y: 1.92 })); // lip
      // decorative ring
      parts.push(cyl(0.90, 0.90, 0.08, 6, 0x5a4030, { y: 1.0, open: true }));
      // side handles
      parts.push(torus(0.15, 0.05, 4, 5, clay, { x: -0.9, y: 1.3 }));
      parts.push(torus(0.15, 0.05, 4, 5, clay, { x: 0.9, y: 1.3 }));
      // red paper seal on top
      parts.push(sph(0.5, 0xc02020, { ws: 5, hs: 3, y: 2.0, sy: 0.25, thetaLen: HALF_PI }));
      // rope tie
      parts.push(torus(0.48, 0.04, 4, 6, 0x604020, { y: 1.88, rx: HALF_PI }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 石敢當 stone talisman pillar                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'stone_gandang',
    displayName: '石敢當',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xa8a098, 0x989088, 0xb8b0a8, 0x888078, 0xc8c0b8],
    yOffset: -0.20,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const stone = 0xffffff;
      const parts = [];
      // base stone slab
      parts.push(box(0.8, 0.2, 0.5, stone, { y: 0.1, hex2: 0xb0a898 }));
      // main stone pillar - slightly tapered
      parts.push(box(0.55, 1.4, 0.35, stone, { y: 0.9, hex2: 0xc8c0b8 }));
      // carved top - rounded
      parts.push(sph(0.35, 0xa8a098, { ws: 6, hs: 4, y: 1.6, sy: 0.4, thetaLen: HALF_PI }));
      // carved character area (indented)
      parts.push(box(0.35, 0.5, 0.02, 0x707068, { y: 0.9, z: 0.175 }));
      // red paint in characters (simplified as rectangles)
      parts.push(box(0.12, 0.35, 0.025, 0xc02020, { y: 0.92, z: 0.18 }));
      parts.push(box(0.08, 0.25, 0.025, 0xc02020, { y: 0.85, z: 0.18, x: 0.08 }));
      // weathering marks
      parts.push(box(0.04, 0.3, 0.02, 0x686860, { x: 0.25, y: 0.7, z: 0.17 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
