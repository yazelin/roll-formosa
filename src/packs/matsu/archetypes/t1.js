/**
 * @file packs/matsu/archetypes/t1.js — T1 老酒巷 (aged wine alley items).
 *
 * Tier 1 of the Roll Formosa Matsu ladder (老酒巷, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/matsu/tiers.js:
 *   slots [0..7] absorbable Matsu alley items (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (老酒甕 / 石砌小祠, spawnWeight ~0.3).
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
  /* [0] aged_wine_bottle 老酒瓶 — traditional Matsu aged wine bottle   */
  /* ---------------------------------------------------------------- */
  {
    id: 'aged_wine_bottle',
    displayName: '老酒瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a4030, 0x6a4a38, 0x4a3428, 0x7a5a48, 0x3a2a20],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // bottle body - traditional ceramic wine bottle shape
      parts.push(cyl(0.5, 0.4, 0.3, 9, 0xffffff, { y: 0.15 })); // base
      parts.push(cyl(0.55, 0.5, 0.8, 9, 0xffffff, { y: 0.6, hex2: 0x8a7060 })); // belly
      parts.push(cyl(0.4, 0.55, 0.4, 9, 0xffffff, { y: 1.1 })); // shoulder
      parts.push(cyl(0.25, 0.3, 0.3, 8, 0x8a7060, { y: 1.4 })); // neck
      parts.push(cyl(0.3, 0.28, 0.15, 8, 0x6a5040, { y: 1.6 })); // lip
      // cork/stopper
      parts.push(cyl(0.18, 0.2, 0.15, 6, 0xc4a080, { y: 1.72 }));
      // label band
      parts.push(cyl(0.57, 0.57, 0.25, 8, 0xf4e8d0, { y: 0.7, open: true }));
      // red seal mark
      parts.push(cyl(0.12, 0.12, 0.02, 6, 0xc02020, { y: 0.82, z: 0.55 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] noodle_bowl 麵線碗 — bowl of noodles (老酒麵線)                 */
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
      parts.push(cyl(0.5, 0.8, 0.5, 10, 0xffffff, { y: 0.25, hex2: 0xf0e8d8 })); // bowl
      parts.push(cyl(0.82, 0.8, 0.1, 10, 0xe0d8c8, { y: 0.55 })); // rim
      // noodles inside - tangled curves represented as thin cylinders
      parts.push(sph(0.65, 0xf0e0c8, { ws: 8, hs: 5, y: 0.45, sy: 0.5 })); // noodle mass
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
      // chopsticks resting on bowl
      parts.push(cyl(0.03, 0.03, 0.8, 4, 0x5a3a20, { y: 0.7, z: 0.4, rx: 0.3 }));
      parts.push(cyl(0.03, 0.03, 0.8, 4, 0x5a3a20, { y: 0.72, z: 0.35, rx: 0.32 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] oyster_shell 蚵殼 — oyster shell                               */
  /* ---------------------------------------------------------------- */
  {
    id: 'oyster_shell',
    displayName: '蚵殼',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xd8d0c8, 0xc8c0b8, 0xe8e0d8, 0xb8b0a8, 0xf0e8e0],
    yOffset: -0.6,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // main shell - irregular oval shape
      parts.push(sph(0.9, 0xffffff, { ws: 8, hs: 5, y: 0.3, sy: 0.35, sx: 0.8, hex2: 0xe0d8d0 }));
      // shell ridges - radial lines
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * PI - PI / 2;
        parts.push(box(0.06, 0.15, 0.7, 0xc8c0b8, {
          x: Math.cos(a) * 0.3, z: Math.sin(a) * 0.3, y: 0.35, ry: a
        }));
      }
      // inner shell - pearly
      parts.push(sph(0.7, 0xf8f4f0, { ws: 6, hs: 4, y: 0.4, sy: 0.25, sx: 0.7 }));
      // hinge point
      parts.push(sph(0.15, 0xa0988c, { ws: 5, hs: 3, y: 0.35, x: -0.6 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] red_yeast_jar 紅糟瓶 — red yeast paste jar                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'red_yeast_jar',
    displayName: '紅糟瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a2020, 0xa03030, 0x6a1818, 0xc04040, 0x501010],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // jar body - ceramic vessel
      parts.push(cyl(0.55, 0.5, 0.25, 9, 0xe8d8c8, { y: 0.12 })); // base
      parts.push(cyl(0.65, 0.55, 0.7, 9, 0xe8d8c8, { y: 0.55, hex2: 0xf0e4d8 })); // body
      parts.push(cyl(0.5, 0.65, 0.3, 9, 0xe8d8c8, { y: 1.0 })); // shoulder
      parts.push(cyl(0.35, 0.4, 0.2, 8, 0xd8c8b8, { y: 1.2 })); // neck
      // lid
      parts.push(cyl(0.42, 0.38, 0.15, 8, 0xffffff, { y: 1.35 })); // ceramic lid (tinted)
      parts.push(sph(0.15, 0xffffff, { ws: 6, hs: 4, y: 1.48 })); // lid knob
      // red yeast content visible through opening (red)
      parts.push(cyl(0.32, 0.32, 0.08, 8, 0x8a2020, { y: 1.28 }));
      // label
      parts.push(box(0.4, 0.35, 0.02, 0xfff8e8, { y: 0.6, z: 0.64 }));
      parts.push(box(0.25, 0.2, 0.025, 0xa02020, { y: 0.6, z: 0.65 })); // red text area
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] fishing_float 漁網浮球 — fishing net float ball                */
  /* ---------------------------------------------------------------- */
  {
    id: 'fishing_float',
    displayName: '漁網浮球',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.12,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xff6020, 0x20a0ff, 0xffff40, 0x40ff40, 0xff4080],
    yOffset: 0,
    upright: false,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const parts = [];
      // main float ball (reduced segments)
      parts.push(sph(1.0, 0xffffff, { ws: 8, hs: 6 })); // tinted bright color
      // equator seam line (reduced segments)
      parts.push(torus(1.0, 0.06, 4, 8, 0x404040, { rx: HALF_PI }));
      // pole caps (reduced segments)
      parts.push(sph(0.15, 0x303030, { ws: 4, hs: 3, y: 0.95 })); // top cap
      parts.push(sph(0.15, 0x303030, { ws: 4, hs: 3, y: -0.95 })); // bottom cap
      // rope attachment ring (reduced segments)
      parts.push(torus(0.12, 0.04, 4, 6, 0x606060, { y: 1.05 }));
      // weathering marks
      parts.push(box(0.08, 0.5, 0.02, 0x808080, { x: 0.9, y: 0.2, rz: 0.2 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] kerosene_lamp 煤油燈 — old kerosene lamp                       */
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
      const brass = 0xffffff; // tinted brass
      const parts = [];
      // base
      parts.push(cyl(0.6, 0.55, 0.15, 8, brass, { y: 0.08 }));
      // fuel reservoir
      parts.push(cyl(0.5, 0.55, 0.4, 8, brass, { y: 0.35, hex2: 0xd8b880 }));
      // burner collar
      parts.push(cyl(0.25, 0.35, 0.15, 8, 0x8a7a60, { y: 0.62 }));
      // glass chimney
      parts.push(cyl(0.28, 0.22, 0.8, 8, 0xf8f4f0, { y: 1.1, open: true })); // glass
      parts.push(cyl(0.3, 0.3, 0.08, 8, 0x606050, { y: 0.72 })); // base ring
      parts.push(cyl(0.25, 0.25, 0.08, 8, 0x606050, { y: 1.52 })); // top ring
      // flame (warm glow)
      parts.push(sph(0.1, 0xffcc44, { ws: 6, hs: 4, y: 0.9 }));
      // handle
      parts.push(torus(0.25, 0.04, 5, 8, brass, { x: 0.55, y: 0.4 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] dried_fish_string 魚乾串 — string of dried fish                */
  /* ---------------------------------------------------------------- */
  {
    id: 'dried_fish_string',
    displayName: '魚乾串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.15,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa08060, 0x907050, 0xb09070, 0x806040, 0xc0a080],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const fish = 0xffffff; // tinted fish color
      const parts = [];
      // hanging string
      parts.push(cyl(0.03, 0.03, 2.5, 4, 0x604020, { y: 1.25 }));
      // top hook
      parts.push(torus(0.1, 0.02, 4, 6, 0x808080, { y: 2.55, arc: PI * 1.5 }));
      // dried fish - 4 fish hanging
      for (let i = 0; i < 4; i++) {
        const fy = 0.4 + i * 0.5;
        const fa = (i * 0.8) + rng() * 0.3;
        // fish body - flattened oval
        parts.push(sph(0.25, fish, { ws: 6, hs: 4, x: Math.sin(fa) * 0.15, y: fy, sy: 0.4, sx: 0.8, hex2: 0xc0a080 }));
        // fish tail
        parts.push(cone(0.15, 0.2, 5, 0x907050, { x: Math.sin(fa) * 0.15 + 0.2, y: fy, rz: -HALF_PI }));
        // fish head
        parts.push(sph(0.12, 0x907050, { ws: 5, hs: 3, x: Math.sin(fa) * 0.15 - 0.25, y: fy }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] kaoliang_cup 馬祖高粱杯 — kaoliang liquor cup                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'kaoliang_cup',
    displayName: '馬祖高粱杯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.04,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e0d8, 0xd8d0c8, 0xf0e8e0, 0xc8c0b8, 0xfff8f0],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // traditional small ceramic cup
      parts.push(cyl(0.4, 0.5, 0.1, 8, 0xffffff, { y: 0.05 })); // foot
      parts.push(cyl(0.5, 0.45, 0.5, 8, 0xffffff, { y: 0.35, hex2: 0xf0e8e0 })); // body
      parts.push(cyl(0.55, 0.52, 0.08, 8, 0xe8e0d8, { y: 0.64 })); // rim
      // blue decorative band
      parts.push(cyl(0.52, 0.52, 0.1, 8, 0x3060a0, { y: 0.45, open: true }));
      // liquid inside (clear/slight amber)
      parts.push(cyl(0.42, 0.42, 0.15, 8, 0xf8f4e8, { y: 0.55 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 老酒甕 large aged wine urn                    */
  /* ---------------------------------------------------------------- */
  {
    id: 'aged_wine_urn',
    displayName: '老酒甕',
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
      const clay = 0xffffff; // tinted clay color
      const parts = [];
      // large urn body - simplified with fewer segments
      parts.push(cyl(0.6, 0.5, 0.3, 6, clay, { y: 0.15 })); // base
      parts.push(cyl(0.85, 0.6, 0.6, 6, clay, { y: 0.55, hex2: 0x8a7060 })); // lower belly
      parts.push(cyl(0.9, 0.85, 0.5, 6, clay, { y: 1.0 })); // upper belly
      parts.push(cyl(0.7, 0.9, 0.4, 6, clay, { y: 1.4 })); // shoulder
      parts.push(cyl(0.5, 0.6, 0.3, 6, 0x7a5a48, { y: 1.7 })); // neck
      parts.push(cyl(0.55, 0.52, 0.15, 6, 0x6a4a38, { y: 1.92 })); // lip
      // one decorative ring (removed second)
      parts.push(cyl(0.90, 0.90, 0.08, 6, 0x5a4030, { y: 1.0, open: true }));
      // two side handles - simplified
      parts.push(torus(0.15, 0.05, 4, 5, clay, { x: -0.9, y: 1.3 }));
      parts.push(torus(0.15, 0.05, 4, 5, clay, { x: 0.9, y: 1.3 }));
      // cloth cover on top - simplified
      parts.push(sph(0.5, 0xc0a080, { ws: 5, hs: 3, y: 2.0, sy: 0.3, thetaLen: HALF_PI }));
      // rope tie - simplified
      parts.push(torus(0.48, 0.04, 4, 6, 0x604020, { y: 1.88, rx: HALF_PI }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 石砌小祠 small stone shrine                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'stone_shrine',
    displayName: '石砌小祠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xa8a098, 0x989088, 0xb8b0a8, 0x888078, 0xc8c0b8],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const stone = 0xffffff; // tinted stone color
      const parts = [];
      // base platform
      parts.push(box(1.8, 0.2, 1.2, stone, { y: 0.1, hex2: 0xb0a898 }));
      // main shrine body - back wall
      parts.push(box(1.5, 1.2, 0.2, stone, { y: 0.8, z: -0.45 }));
      // side walls
      parts.push(box(0.2, 1.0, 0.9, stone, { x: -0.65, y: 0.7, z: 0.0 }));
      parts.push(box(0.2, 1.0, 0.9, stone, { x: 0.65, y: 0.7, z: 0.0 }));
      // roof - traditional stone slab
      parts.push(box(1.8, 0.15, 1.3, 0x808078, { y: 1.45 }));
      parts.push(box(1.9, 0.1, 1.4, 0x888880, { y: 1.55, hex2: 0x707068 })); // roof cap
      // interior - small deity figure
      parts.push(sph(0.15, 0xf0c040, { ws: 6, hs: 4, y: 0.55, z: -0.2 })); // golden figure
      parts.push(cyl(0.1, 0.12, 0.25, 6, 0xc02020, { y: 0.38, z: -0.2 })); // red base
      // small incense holder at front
      parts.push(cyl(0.1, 0.12, 0.08, 6, 0x8a6a30, { y: 0.24, z: 0.3 }));
      // offerings (small bowls)
      parts.push(cyl(0.08, 0.1, 0.06, 6, 0xe8e0d0, { y: 0.23, z: 0.15, x: -0.25 }));
      parts.push(cyl(0.08, 0.1, 0.06, 6, 0xe8e0d0, { y: 0.23, z: 0.15, x: 0.25 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
