/**
 * @file packs/matsu/archetypes/t2.js — Roll Formosa Matsu pack, TIER 2 「芹壁聚落」.
 *
 * The 10 Qinbi village (芹壁聚落) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — qinbi_stone_house / mazu_small_shrine — at
 * spawnWeight ~0.3 and ~2.5-4x the largest absorbable radius).
 *
 * Size band: radiusNominal 0.25-1.2 m. Every buildGeometry(rng) returns ONE
 * merged, vertex-colored BufferGeometry built ONLY from the engine geometry
 * vocabulary (geomHelpers.js: box/cyl/cone/sph/ico/torus + paint/xf + finish)
 * and normalized by finish() to a UNIT bounding sphere (radius 1). Tri budget
 * <= 350 per archetype (kept low via small radial segment counts, 6-10).
 *
 * rng() is used ONLY for tiny deterministic-friendly nudges, never structure.
 */

import {
  box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T2_ARCHETYPES = [
  /* ---- slot 0 ---- 紅塑膠椅 — the ubiquitous stackable red plastic chair */
  {
    id: 'red_plastic_chair',
    displayName: '紅塑膠椅',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.45,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd83026, 0xe23a2c, 0xc4281f, 0xee5a3a, 0xb84a3a],
    yOffset: -0.219,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const r = 0xffffff;
      return finish([
        box(0.9, 0.1, 0.85, r, { y: 0.85 }),
        box(0.9, 0.16, 0.06, r, { y: 0.78, z: 0.42 }),
        box(0.86, 0.7, 0.1, r, { y: 1.2, z: -0.4 }),
        box(0.86, 0.12, 0.1, r, { y: 1.0, z: -0.36 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: -0.36, y: 0.42, z: 0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: 0.36, y: 0.42, z: 0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: -0.36, y: 0.42, z: -0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: 0.36, y: 0.42, z: -0.34 }),
      ]);
    },
  },

  /* ---- slot 1 ---- 漁夫帽 — traditional bamboo fisher hat               */
  {
    id: 'fisher_hat',
    displayName: '漁夫帽',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8b090, 0xb8a080, 0xd8c0a0, 0xa89070, 0xe8d0b0],
    yOffset: -0.65,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const bamboo = 0xffffff; // tinted bamboo color
      const parts = [];
      // conical hat shape
      parts.push(cone(1.2, 0.8, 12, bamboo, { y: 0.4, hex2: 0xd8c0a0 }));
      // brim edge - thicker rim
      parts.push(torus(1.15, 0.08, 6, 12, 0xa89070, { y: 0.05, rx: HALF_PI }));
      // woven texture lines (radial)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        parts.push(box(0.04, 0.45, 0.02, 0xb8a080, {
          x: Math.cos(a) * 0.5, z: Math.sin(a) * 0.5, y: 0.4, ry: a, rz: 0.5
        }));
      }
      // chin strap attachment points
      parts.push(cyl(0.05, 0.05, 0.1, 4, 0x604020, { x: -0.9, y: 0.1 }));
      parts.push(cyl(0.05, 0.05, 0.1, 4, 0x604020, { x: 0.9, y: 0.1 }));
      // chin strap (dangling)
      parts.push(cyl(0.02, 0.02, 0.4, 4, 0x806040, { x: -0.9, y: -0.1, rz: 0.3 }));
      parts.push(cyl(0.02, 0.02, 0.4, 4, 0x806040, { x: 0.9, y: -0.1, rz: -0.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 2 ---- 石臼 — stone mortar for grinding                     */
  {
    id: 'stone_mortar',
    displayName: '石臼',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x909088, 0x808078, 0xa0a098, 0x707068, 0xb0b0a8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const stone = 0xffffff; // tinted stone
      const parts = [];
      // main mortar body
      parts.push(cyl(0.9, 0.8, 0.7, 10, stone, { y: 0.35, hex2: 0xa0a098 }));
      // inner bowl cavity
      parts.push(cyl(0.65, 0.7, 0.5, 10, 0x606058, { y: 0.55 }));
      // rim
      parts.push(cyl(0.92, 0.9, 0.12, 10, 0x888880, { y: 0.72 }));
      // base
      parts.push(cyl(0.75, 0.85, 0.15, 10, 0x707068, { y: 0.08 }));
      // pestle lying beside
      parts.push(cyl(0.12, 0.1, 0.8, 6, 0x787870, { x: 0.8, y: 0.3, rz: -HALF_PI + 0.3 }));
      parts.push(sph(0.15, 0x707068, { ws: 6, hs: 4, x: 1.15, y: 0.35 })); // pestle head
      return finish(parts);
    },
  },

  /* ---- slot 3 ---- 瓦斯桶 — the steel LPG cylinder                      */
  {
    id: 'gas_cylinder',
    displayName: '瓦斯桶',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.32,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xd0c8b8, 0xc94f46, 0xa8a098, 0xb84a3a, 0x9aa0aa],
    yOffset: -0.121,
    upright: true,
    collisionScale: 0.92,
    buildGeometry(rng) {
      const steel = 0xffffff;
      return finish([
        cyl(0.62, 0.66, 0.16, 10, 0x8a8278, { y: 0.08 }),
        cyl(0.6, 0.6, 1.5, 10, steel, { y: 0.9, hex2: 0xe2dccc }),
        sph(0.6, steel, { ws: 10, hs: 5, thetaLen: HALF_PI, y: 1.6 }),
        cyl(0.34, 0.34, 0.34, 8, 0x6a6258, { y: 2.18, open: true }),
        cyl(0.1, 0.1, 0.14, 6, 0xc4281f, { y: 2.18 }),
        cyl(0.04, 0.04, 0.18, 5, 0x9aa0aa, { y: 2.34 }),
      ]);
    },
  },

  /* ---- slot 4 ---- 三角錐 — orange traffic cone                         */
  {
    id: 'traffic_cone',
    displayName: '三角錐',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf26a1f, 0xff7a28, 0xe05a18, 0xf2f2ee, 0xd85518],
    yOffset: -0.263,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const o = 0xffffff;
      return finish([
        box(1.2, 0.14, 1.2, o, { y: 0.07 }),
        cyl(0.62, 0.82, 0.3, 8, o, { y: 0.27 }),
        cone(0.6, 1.7, 8, o, { y: 1.0 }),
        cyl(0.42, 0.5, 0.22, 8, 0xf0ede4, { y: 0.7 }),
        cyl(0.28, 0.34, 0.16, 8, 0xf0ede4, { y: 1.05 }),
      ]);
    },
  },

  /* ---- slot 5 ---- 消防栓 — squat red fire hydrant                      */
  {
    id: 'fire_hydrant',
    displayName: '消防栓',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xd02a1f, 0xe23a2c, 0xb8241c, 0xffd000, 0xc4281f],
    yOffset: -0.188,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const red = 0xffffff;
      return finish([
        cyl(0.66, 0.72, 0.2, 8, 0x9a2018, { y: 0.1 }),
        cyl(0.52, 0.58, 1.1, 8, red, { y: 0.75 }),
        cyl(0.42, 0.52, 0.24, 8, red, { y: 1.42 }),
        sph(0.46, red, { ws: 8, hs: 4, thetaLen: HALF_PI, y: 1.5 }),
        cyl(0.16, 0.2, 0.2, 6, 0xf0c020, { y: 1.92 }),
        cyl(0.18, 0.2, 0.22, 6, red, { rx: HALF_PI, y: 1.0, z: 0.58 }),
        cyl(0.22, 0.22, 0.06, 6, 0xf0c020, { rx: HALF_PI, y: 1.0, z: 0.7 }),
        cyl(0.15, 0.17, 0.2, 6, red, { rz: HALF_PI, x: -0.6, y: 0.85 }),
        cyl(0.15, 0.17, 0.2, 6, red, { rz: HALF_PI, x: 0.6, y: 0.85 }),
      ]);
    },
  },

  /* ---- slot 6 ---- 風燈籠 — wind lantern (traditional island lantern)   */
  {
    id: 'wind_lantern',
    displayName: '風燈籠',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd83020, 0xe84030, 0xc82818, 0xf05040, 0xb02010],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const lantern = 0xffffff; // tinted red
      const parts = [];
      // top cap
      parts.push(cyl(0.3, 0.25, 0.15, 8, 0x3a2a22, { y: 1.65 }));
      // top hanging ring
      parts.push(torus(0.1, 0.03, 4, 6, 0x8a7a60, { y: 1.78 }));
      // main lantern body - barrel shape
      parts.push(cyl(0.5, 0.4, 0.3, 8, lantern, { y: 0.5, hex2: 0xf05040 }));
      parts.push(cyl(0.6, 0.5, 0.4, 8, lantern, { y: 0.85 }));
      parts.push(cyl(0.6, 0.6, 0.35, 8, lantern, { y: 1.2 }));
      parts.push(cyl(0.5, 0.6, 0.25, 8, lantern, { y: 1.45 }));
      // gold trim bands
      parts.push(cyl(0.62, 0.62, 0.06, 8, 0xf0c040, { y: 1.0, open: true }));
      parts.push(cyl(0.58, 0.58, 0.06, 8, 0xf0c040, { y: 1.35, open: true }));
      // bottom cap
      parts.push(cyl(0.35, 0.4, 0.15, 8, 0x3a2a22, { y: 0.38 }));
      // tassel
      parts.push(cyl(0.05, 0.05, 0.2, 5, 0xf0c040, { y: 0.2 }));
      parts.push(cone(0.1, 0.25, 5, 0xf0c040, { y: 0.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 7 ---- 曬魚架 — rack for drying fish                        */
  {
    id: 'fish_drying_rack',
    displayName: '曬魚架',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.8,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a7050, 0x7a6040, 0x9a8060, 0x6a5030, 0xaa9070],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const fish = 0xa08060;
      const parts = [];
      // frame - A-frame structure
      // two vertical posts
      parts.push(cyl(0.08, 0.1, 2.0, 5, wood, { x: -0.8, y: 1.0 }));
      parts.push(cyl(0.08, 0.1, 2.0, 5, wood, { x: 0.8, y: 1.0 }));
      // cross beam at top
      parts.push(cyl(0.06, 0.06, 1.8, 5, 0x7a6040, { y: 1.9, rz: HALF_PI }));
      // lower cross beam
      parts.push(cyl(0.05, 0.05, 1.6, 5, 0x7a6040, { y: 0.5, rz: HALF_PI }));
      // hanging ropes
      for (let i = 0; i < 4; i++) {
        const x = -0.6 + i * 0.4;
        parts.push(cyl(0.02, 0.02, 1.2, 4, 0x604020, { x, y: 1.3 }));
      }
      // drying fish hanging
      for (let i = 0; i < 4; i++) {
        const x = -0.6 + i * 0.4;
        const fy = 0.9 + (rng() - 0.5) * 0.2;
        // fish body
        parts.push(sph(0.15, fish, { ws: 6, hs: 4, x, y: fy, sy: 0.4, sx: 0.7, hex2: 0xb09070 }));
        // fish tail
        parts.push(cone(0.1, 0.12, 5, 0x907050, { x: x + 0.12, y: fy, rz: -HALF_PI }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 芹壁石屋 — Qinbi traditional stone house */
  {
    id: 'qinbi_stone_house',
    displayName: '芹壁石屋',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xa09888, 0x908878, 0xb0a898, 0x807868, 0xc0b8a8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const stone = 0xffffff; // tinted stone
      const parts = [];
      // main house body - rectangular stone block
      parts.push(box(2.2, 1.5, 1.6, stone, { y: 0.75, hex2: 0xb0a898 }));
      // stone texture - horizontal courses
      for (let i = 0; i < 5; i++) {
        parts.push(box(2.22, 0.04, 1.62, 0x706858, { y: 0.3 + i * 0.28, z: 0.0 }));
      }
      // door opening
      parts.push(box(0.5, 0.9, 0.1, 0x4a3a28, { y: 0.45, z: 0.81 }));
      // door frame
      parts.push(box(0.08, 1.0, 0.12, 0x5a4a38, { x: -0.29, y: 0.5, z: 0.82 }));
      parts.push(box(0.08, 1.0, 0.12, 0x5a4a38, { x: 0.29, y: 0.5, z: 0.82 }));
      parts.push(box(0.66, 0.08, 0.12, 0x5a4a38, { y: 1.0, z: 0.82 }));
      // small window
      parts.push(box(0.35, 0.3, 0.1, 0x303840, { x: 0.7, y: 0.9, z: 0.81 }));
      // window frame
      parts.push(box(0.45, 0.05, 0.12, 0x5a4a38, { x: 0.7, y: 1.08, z: 0.82 }));
      parts.push(box(0.45, 0.05, 0.12, 0x5a4a38, { x: 0.7, y: 0.72, z: 0.82 }));
      // roof - traditional Mindong style
      parts.push(box(2.5, 0.15, 1.9, 0x605040, { y: 1.58 }));
      // pitched roof tiles
      parts.push(box(2.6, 0.12, 1.0, 0x505040, { y: 1.72, z: 0.45, rx: -0.25 }));
      parts.push(box(2.6, 0.12, 1.0, 0x505040, { y: 1.72, z: -0.45, rx: 0.25 }));
      // ridge
      parts.push(box(2.6, 0.1, 0.15, 0x404030, { y: 1.85 }));
      // chimney
      parts.push(box(0.25, 0.4, 0.25, 0x706050, { x: -0.8, y: 2.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 媽祖小廟 — small Mazu shrine          */
  {
    id: 'mazu_small_shrine',
    displayName: '媽祖小廟',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc03020, 0xd04030, 0xb02818, 0xe05040, 0xa02010],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const red = 0xffffff; // tinted temple red
      const gold = 0xf0c040;
      const parts = [];
      // base platform
      parts.push(box(2.2, 0.3, 1.6, 0xa09888, { y: 0.15, hex2: 0xb0a898 }));
      // main shrine body
      parts.push(box(1.8, 1.4, 1.2, red, { y: 1.0, hex2: 0xe05040 }));
      // front opening (doorway)
      parts.push(box(0.6, 1.0, 0.1, 0x2a1a10, { y: 0.8, z: 0.61 }));
      // door frame gold trim
      parts.push(box(0.08, 1.1, 0.12, gold, { x: -0.34, y: 0.85, z: 0.62 }));
      parts.push(box(0.08, 1.1, 0.12, gold, { x: 0.34, y: 0.85, z: 0.62 }));
      parts.push(box(0.76, 0.08, 0.12, gold, { y: 1.42, z: 0.62 }));
      // columns flanking entrance
      parts.push(cyl(0.1, 0.12, 1.3, 8, 0xc03020, { x: -0.75, y: 0.95, z: 0.55 }));
      parts.push(cyl(0.1, 0.12, 1.3, 8, 0xc03020, { x: 0.75, y: 0.95, z: 0.55 }));
      // roof structure
      parts.push(box(2.4, 0.15, 1.7, red, { y: 1.75 }));
      // curved roof eaves
      parts.push(box(2.5, 0.12, 0.9, 0x1f5c3a, { y: 1.92, z: 0.4, rx: -0.3 }));
      parts.push(box(2.5, 0.12, 0.9, 0x1f5c3a, { y: 1.92, z: -0.4, rx: 0.3 }));
      // roof ridge
      parts.push(box(2.5, 0.1, 0.2, gold, { y: 2.15 }));
      // ridge decorations (swallowtail)
      parts.push(cone(0.15, 0.4, 5, gold, { x: -1.3, y: 2.3, rz: 0.4 }));
      parts.push(cone(0.15, 0.4, 5, gold, { x: 1.3, y: 2.3, rz: -0.4 }));
      // center finial
      parts.push(sph(0.12, gold, { ws: 6, hs: 4, y: 2.25 }));
      // incense burner in front
      parts.push(cyl(0.2, 0.25, 0.25, 8, 0x8a6a30, { y: 0.42, z: 1.0 }));
      // offerings
      parts.push(cyl(0.1, 0.12, 0.08, 6, 0xe8e0d0, { y: 0.34, z: 0.8, x: -0.3 }));
      parts.push(cyl(0.1, 0.12, 0.08, 6, 0xe8e0d0, { y: 0.34, z: 0.8, x: 0.3 }));
      return finish(parts);
    },
  },
];

export default T2_ARCHETYPES;
