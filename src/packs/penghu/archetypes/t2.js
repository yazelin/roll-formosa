/**
 * @file packs/penghu/archetypes/t2.js — Roll Formosa Penghu pack, TIER 2 「漁港邊」.
 *
 * The 10 harbor-side (漁港) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — seafood_stall / stone_house — at
 * spawnWeight ~0.3 and ~2.5-4x the largest absorbable radius).
 *
 * Penghu themes: fishing gear, buoys, cactus, wind lion statues, stone houses
 *
 * Size band: radiusNominal 0.25–1.2 m. Every buildGeometry(rng) returns ONE
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
  /* ---- slot 0 ---- 紅塑膠椅 — the ubiquitous stackable red night-market stool/chair */
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
      const r = 0xffffff; // body baked white -> instanceColor tints red
      return finish([
        // seat slab
        box(0.9, 0.1, 0.85, r, { y: 0.85 }),
        // seat lip front
        box(0.9, 0.16, 0.06, r, { y: 0.78, z: 0.42 }),
        // back rest
        box(0.86, 0.7, 0.1, r, { y: 1.2, z: -0.4 }),
        box(0.86, 0.12, 0.1, r, { y: 1.0, z: -0.36 }), // back lower rail
        // four legs (slightly splayed)
        cyl(0.05, 0.06, 0.85, 6, r, { x: -0.36, y: 0.42, z: 0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: 0.36, y: 0.42, z: 0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: -0.36, y: 0.42, z: -0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: 0.36, y: 0.42, z: -0.34 }),
      ]);
    },
  },

  /* ---- slot 1 ---- 大浮球 — large fishing buoy, spherical with rope loop */
  {
    id: 'fishing_buoy',
    displayName: '大浮球',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x40a0e0, 0xf07030, 0xe0e040, 0x30b060, 0xe04050],
    yOffset: -0.1,
    upright: false,
    collisionScale: 0.9,
    buildGeometry(rng) {
      return finish([
        // main buoy sphere
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }),
        // equator band
        cyl(1.02, 1.02, 0.15, 10, 0x3a3a40, { open: true }),
        // top mounting loop
        torus(0.25, 0.06, 4, 6, 0x3a3a40, { y: 0.95 }),
        // bottom nub
        cyl(0.15, 0.1, 0.2, 6, 0x3a3a40, { y: -0.95 }),
        // rope attached
        torus(0.35, 0.04, 4, 8, 0x8a7a5a, { y: 1.15, rx: 0.4 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 仙人掌 — potted cactus paddle, iconic Penghu plant */
  {
    id: 'potted_cactus',
    displayName: '仙人掌',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a9a3a, 0x5aaa4a, 0x3a8a2a, 0x6aba5a, 0x2a7a1a],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // terracotta pot
      parts.push(cyl(0.55, 0.5, 0.45, 6, 0xc87050, { y: 0.28 })); // pot body
      parts.push(cyl(0.6, 0.55, 0.1, 6, 0xd88060, { y: 0.55 })); // rim
      // soil
      parts.push(cyl(0.5, 0.5, 0.08, 6, 0x5a4a3a, { y: 0.52 }));
      // main cactus paddle (flat oval)
      parts.push(sph(0.6, 0xffffff, { ws: 6, hs: 4, sy: 1.4, sz: 0.3, y: 1.3 }));
      // smaller paddles branching
      parts.push(sph(0.35, 0xffffff, { ws: 5, hs: 3, sy: 1.2, sz: 0.25, x: 0.4, y: 1.8, rz: 0.3 }));
      parts.push(sph(0.35, 0xffffff, { ws: 5, hs: 3, sy: 1.2, sz: 0.25, x: -0.35, y: 1.7, rz: -0.25 }));
      return finish(parts);
    },
  },

  /* ---- slot 3 ---- 魚簍 — traditional woven fish basket/trap */
  {
    id: 'fish_basket',
    displayName: '魚簍',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.45,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x9a7a4a, 0xaa8a5a, 0x8a6a3a, 0xba9a6a, 0x7a5a2a],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      const bamboo = 0xffffff;
      // conical basket body
      parts.push(cyl(0.8, 0.3, 1.5, 10, bamboo, { y: 0.75, hex2: 0xc8a870 }));
      // weave bands
      for (let i = 0; i < 5; i++) {
        parts.push(cyl(0.82 - i * 0.1, 0.82 - i * 0.1, 0.06, 10, 0x8a6a3a, { y: 0.2 + i * 0.3, open: true }));
      }
      // funnel entrance at top
      parts.push(cyl(0.25, 0.35, 0.2, 8, 0x9a7a4a, { y: 1.55 }));
      // base ring
      parts.push(cyl(0.85, 0.85, 0.08, 10, 0x7a5a2a, { y: 0.04 }));
      return finish(parts);
    },
  },

  /* ---- slot 4 ---- 三角錐 — orange traffic cone */
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
      const o = 0xffffff; // tinted orange
      return finish([
        // square base slab
        box(1.2, 0.14, 1.2, o, { y: 0.07 }),
        // lower flare of the cone
        cyl(0.62, 0.82, 0.3, 8, o, { y: 0.27 }),
        // main cone body
        cone(0.6, 1.7, 8, o, { y: 1.0 }),
        // white reflective collar (baked light, tint-resistant)
        cyl(0.42, 0.5, 0.22, 8, 0xf0ede4, { y: 0.7 }),
        cyl(0.28, 0.34, 0.16, 8, 0xf0ede4, { y: 1.05 }),
      ]);
    },
  },

  /* ---- slot 5 ---- 風獅爺 — stone wind lion guardian statue */
  {
    id: 'wind_lion',
    displayName: '風獅爺',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xb8a888, 0xc8b898, 0xa89878, 0xd8c8a8, 0x988868],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const stone = 0xffffff;
      const parts = [];
      // rectangular pedestal base
      parts.push(box(1.0, 0.25, 0.7, 0x9a8a6a, { y: 0.12 }));
      // seated lion body (blocky, folk-art style)
      parts.push(box(0.7, 0.8, 0.55, stone, { y: 0.65 }));
      // head (blocky sphere)
      parts.push(sph(0.45, stone, { y: 1.35, ws: 7, hs: 5 }));
      // mane (rough ring around head)
      parts.push(torus(0.35, 0.12, 5, 8, 0xb8a070, { y: 1.3 }));
      // snout
      parts.push(box(0.25, 0.2, 0.25, stone, { y: 1.2, z: 0.35 }));
      // eyes (hollowed dots)
      parts.push(sph(0.08, 0x2a2a2e, { x: -0.15, y: 1.45, z: 0.35, ws: 5, hs: 3 }));
      parts.push(sph(0.08, 0x2a2a2e, { x: 0.15, y: 1.45, z: 0.35, ws: 5, hs: 3 }));
      // ears
      parts.push(cone(0.1, 0.2, 5, stone, { x: -0.3, y: 1.65 }));
      parts.push(cone(0.1, 0.2, 5, stone, { x: 0.3, y: 1.65 }));
      // front paws
      parts.push(box(0.2, 0.3, 0.2, stone, { x: -0.25, y: 0.4, z: 0.3 }));
      parts.push(box(0.2, 0.3, 0.2, stone, { x: 0.25, y: 0.4, z: 0.3 }));
      // tail curl
      parts.push(sph(0.15, stone, { x: 0, y: 0.9, z: -0.35, ws: 5, hs: 4 }));
      return finish(parts);
    },
  },

  /* ---- slot 6 ---- 漁網堆 — pile of fishing nets */
  {
    id: 'net_pile',
    displayName: '漁網堆',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.55,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x40a080, 0x50b090, 0x309070, 0x60c0a0, 0x208060],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      const net = 0xffffff;
      // lumpy pile of bundled nets
      parts.push(sph(0.7, net, { y: 0.4, ws: 6, hs: 4, sy: 0.6 }));
      parts.push(sph(0.55, net, { x: 0.4, y: 0.35, z: 0.2, ws: 5, hs: 3, sy: 0.5 }));
      parts.push(sph(0.5, net, { x: -0.35, y: 0.3, z: -0.2, ws: 5, hs: 3, sy: 0.55 }));
      // floats attached (reduced)
      parts.push(sph(0.15, 0xf07030, { x: 0.6, y: 0.5, z: 0.4, ws: 4, hs: 3 }));
      parts.push(sph(0.12, 0x4090d0, { x: -0.5, y: 0.45, z: 0.3, ws: 4, hs: 3 }));
      // rope coil on top
      parts.push(torus(0.25, 0.05, 3, 6, 0x8a7a5a, { y: 0.65, rx: 0.2, rz: 0.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 7 ---- 保麗龍箱 — styrofoam seafood cooler box */
  {
    id: 'styrofoam_box',
    displayName: '保麗龍箱',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.45,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xf0f0f0, 0xe8e8e8, 0xf8f8f8, 0xe0e0e0, 0xd8d8d8],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      return finish([
        // main box body
        box(1.4, 0.8, 1.0, 0xffffff, { y: 0.4 }),
        // lid (slightly raised)
        box(1.42, 0.15, 1.02, 0xf0f0f0, { y: 0.88 }),
        // lid handle indent
        box(0.4, 0.08, 0.1, 0xe0e0e0, { y: 0.92, z: 0.45 }),
        // drainage holes on sides
        cyl(0.05, 0.05, 0.15, 4, 0xd0d0d0, { x: -0.65, y: 0.2, rx: HALF_PI }),
        cyl(0.05, 0.05, 0.15, 4, 0xd0d0d0, { x: 0.65, y: 0.2, rx: HALF_PI }),
        // corner reinforcement bands
        box(0.1, 0.82, 0.1, 0xc8c8c8, { x: -0.65, y: 0.41, z: 0.45 }),
        box(0.1, 0.82, 0.1, 0xc8c8c8, { x: 0.65, y: 0.41, z: 0.45 }),
        box(0.1, 0.82, 0.1, 0xc8c8c8, { x: -0.65, y: 0.41, z: -0.45 }),
        box(0.1, 0.82, 0.1, 0xc8c8c8, { x: 0.65, y: 0.41, z: -0.45 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 海產攤 — seafood vendor stall with canopy */
  {
    id: 'seafood_stall',
    displayName: '海產攤',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x40a0e0, 0xe0a050, 0xc04040, 0x9a8a78, 0xead8b0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      const wood = 0x9a7a52;
      // counter table with stainless steel top
      parts.push(box(2.2, 0.8, 1.0, wood, { y: 0.65 }));
      parts.push(box(2.25, 0.06, 1.05, 0xd0d8e0, { y: 1.08 })); // steel top
      // ice display trays
      parts.push(box(0.6, 0.15, 0.8, 0xd0e8f0, { x: -0.7, y: 1.2 }));
      parts.push(box(0.6, 0.15, 0.8, 0xd0e8f0, { x: 0.0, y: 1.2 }));
      parts.push(box(0.6, 0.15, 0.8, 0xd0e8f0, { x: 0.7, y: 1.2 }));
      // awning posts
      parts.push(cyl(0.06, 0.06, 1.5, 5, wood, { x: -1.0, y: 1.85, z: 0.4 }));
      parts.push(cyl(0.06, 0.06, 1.5, 5, wood, { x: 1.0, y: 1.85, z: 0.4 }));
      // striped awning (blue/white)
      parts.push(box(2.4, 0.08, 1.2, 0x40a0e0, { y: 2.65 }));
      parts.push(box(2.4, 0.1, 0.3, 0xf0f0f0, { y: 2.6, z: 0.45 }));
      // signboard
      parts.push(box(1.5, 0.4, 0.08, 0xc04040, { y: 2.35, z: 0.55 }));
      // scale
      parts.push(cyl(0.15, 0.12, 0.25, 8, 0x808080, { x: 0.8, y: 1.35 }));
      parts.push(cyl(0.2, 0.2, 0.05, 8, 0xa0a0a0, { x: 0.8, y: 1.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 咾咕石屋 — traditional Penghu coral stone house */
  {
    id: 'stone_house',
    displayName: '咾咕石屋',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xa09080, 0xb0a090, 0x908070, 0xc0b0a0, 0x807060],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const stone = 0xffffff;
      const parts = [];
      // main house body (coral stone walls)
      parts.push(box(2.0, 1.4, 1.5, stone, { y: 0.7 }));
      // stone texture - slightly protruding blocks
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const sx = -0.75 + col * 0.5;
          const sy = 0.3 + row * 0.45;
          parts.push(box(0.4, 0.35, 0.08, 0xb8a898, { x: sx, y: sy, z: 0.77 }));
        }
      }
      // doorway (dark recessed opening)
      parts.push(box(0.5, 0.9, 0.12, 0x3a3028, { x: 0.5, y: 0.5, z: 0.76 }));
      // window opening
      parts.push(box(0.35, 0.35, 0.12, 0x4a4038, { x: -0.5, y: 0.9, z: 0.76 }));
      // traditional sloped tile roof
      parts.push(box(2.3, 0.12, 1.0, 0x8a6a4a, { y: 1.52, z: 0.25, rx: -0.25 }));
      parts.push(box(2.3, 0.12, 1.0, 0x8a6a4a, { y: 1.52, z: -0.25, rx: 0.25 }));
      // ridge cap
      parts.push(box(2.3, 0.1, 0.15, 0x9a7a5a, { y: 1.68 }));
      // low coral stone wall in front
      parts.push(box(2.4, 0.4, 0.2, 0xa09080, { y: 0.2, z: 1.0 }));
      return finish(parts);
    },
  },
];

export default T2_ARCHETYPES;
