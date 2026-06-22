/**
 * @file packs/newtaipei/archetypes/t2.js — Roll Formosa New Taipei pack, TIER 2 「鶯歌陶瓷騎樓」.
 *
 * The 10 Yingge ceramics-street rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — ceramic_cart / kiln — at spawnWeight ~0.3
 * and ~2.5-4x the largest absorbable radius).
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
  /* ---- slot 0 ---- 陶碗組 — classic Yingge ceramic rice bowl stack */
  {
    id: 'ceramic_bowl_stack',
    displayName: '陶碗組',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.25,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e4d8, 0x3a5a8a, 0xc8bca8, 0x6a8ab0, 0xf0ece0],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // Bowl body — classic shape tapered at bottom
      parts.push(cyl(0.8, 0.5, 0.55, 10, 0xe8e4d8, { y: 0.35 }));
      // Bowl rim
      parts.push(cyl(0.82, 0.8, 0.08, 10, 0xf0ece0, { y: 0.62 }));
      // Foot ring
      parts.push(cyl(0.35, 0.38, 0.12, 8, 0xc8bca8, { y: 0.06 }));
      // Blue pattern band (classic blue-white porcelain)
      parts.push(cyl(0.81, 0.72, 0.15, 10, 0x3a5a8a, { y: 0.48, open: true }));
      // Interior glaze
      parts.push(cyl(0.75, 0.45, 0.5, 8, 0xf8f4ec, { y: 0.38 }));
      return finish(parts);
    },
  },

  /* ---- slot 1 ---- 茶壺組 — traditional Yingge teapot set */
  {
    id: 'teapot_set',
    displayName: '茶壺組',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.28,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a5a3a, 0xa06840, 0x6a4028, 0xb87848, 0x5a3820],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const clay = 0x8a5a3a; // Yixing-style purple clay color
      const parts = [];
      // Main body — squat rounded pot
      parts.push(sph(0.6, clay, { ws: 8, hs: 6, sy: 0.75, y: 0.45, hex2: 0xa06840 }));
      // Neck
      parts.push(cyl(0.25, 0.28, 0.15, 8, clay, { y: 0.85 }));
      // Lid
      parts.push(cyl(0.3, 0.28, 0.08, 8, 0x6a4028, { y: 0.98 }));
      // Lid knob
      parts.push(sph(0.1, 0x5a3820, { ws: 6, hs: 4, y: 1.08 }));
      // Spout
      parts.push(cyl(0.08, 0.12, 0.4, 6, clay, { x: 0.55, y: 0.55, rz: -0.8 }));
      parts.push(cyl(0.06, 0.08, 0.1, 6, clay, { x: 0.78, y: 0.72 }));
      // Handle
      parts.push(torus(0.22, 0.05, 5, 6, clay, { x: -0.55, y: 0.55, arc: PI * 1.2 }));
      // Foot
      parts.push(cyl(0.35, 0.38, 0.08, 8, 0x6a4028, { y: 0.08 }));
      return finish(parts);
    },
  },

  /* ---- slot 2 ---- 紅塑膠椅 — the ubiquitous stackable red stool */
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

  /* ---- slot 3 ---- 瓦斯桶 — the steel LPG cylinder */
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
      const steel = 0xffffff; // tinted steel grey/red
      return finish([
        // foot ring
        cyl(0.62, 0.66, 0.16, 10, 0x8a8278, { y: 0.08 }),
        // tank body
        cyl(0.6, 0.6, 1.5, 10, steel, { y: 0.9, hex2: 0xe2dccc }),
        // domed top shoulder
        sph(0.6, steel, { ws: 10, hs: 5, thetaLen: HALF_PI, y: 1.6 }),
        // collar guard ring around the valve
        cyl(0.34, 0.34, 0.34, 8, 0x6a6258, { y: 2.18, open: true }),
        // valve knob
        cyl(0.1, 0.1, 0.14, 6, 0xc4281f, { y: 2.18 }),
        cyl(0.04, 0.04, 0.18, 5, 0x9aa0aa, { y: 2.34 }),
      ]);
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

  /* ---- slot 5 ---- 消防栓 — squat red fire hydrant */
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
      const red = 0xffffff; // tinted red body
      return finish([
        // base foot
        cyl(0.66, 0.72, 0.2, 8, 0x9a2018, { y: 0.1 }),
        // barrel
        cyl(0.52, 0.58, 1.1, 8, red, { y: 0.75 }),
        // shoulder taper
        cyl(0.42, 0.52, 0.24, 8, red, { y: 1.42 }),
        // bonnet dome
        sph(0.46, red, { ws: 8, hs: 4, thetaLen: HALF_PI, y: 1.5 }),
        // top cap nut (yellow, tint-resistant)
        cyl(0.16, 0.2, 0.2, 6, 0xf0c020, { y: 1.92 }),
        // front nozzle outlet
        cyl(0.18, 0.2, 0.22, 6, red, { rx: HALF_PI, y: 1.0, z: 0.58 }),
        cyl(0.22, 0.22, 0.06, 6, 0xf0c020, { rx: HALF_PI, y: 1.0, z: 0.7 }),
        // two side outlets
        cyl(0.15, 0.17, 0.2, 6, red, { rz: HALF_PI, x: -0.6, y: 0.85 }),
        cyl(0.15, 0.17, 0.2, 6, red, { rz: HALF_PI, x: 0.6, y: 0.85 }),
      ]);
    },
  },

  /* ---- slot 6 ---- 陶藝轉盤 — pottery wheel (Yingge ceramic culture) */
  {
    id: 'pottery_wheel',
    displayName: '陶藝轉盤',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x7a6a5a, 0x5a4a3a, 0xb08060, 0x9a7050, 0x4a4a4a],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // Base frame (simplified)
      parts.push(cyl(0.55, 0.6, 0.15, 6, 0x4a4a4a, { y: 0.08 }));
      // Central axle
      parts.push(cyl(0.08, 0.08, 0.35, 5, 0x4a4a4a, { y: 0.35 }));
      // Wheel head (throwing surface)
      parts.push(cyl(0.55, 0.55, 0.06, 6, 0x7a6a5a, { y: 0.58 }));
      // Clay pot being formed (simplified)
      parts.push(cyl(0.2, 0.25, 0.25, 6, 0xb08060, { y: 0.78, hex2: 0x9a7050 }));
      parts.push(cyl(0.25, 0.18, 0.1, 6, 0xb08060, { y: 0.98 }));
      // Foot pedal
      parts.push(cyl(0.35, 0.35, 0.05, 6, 0x5a4a3a, { y: 0.02 }));
      return finish(parts);
    },
  },

  /* ---- slot 7 ---- 花瓶 — decorative ceramic vase */
  {
    id: 'vase',
    displayName: '花瓶',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8e0d0, 0x3a5a8a, 0xc8a060, 0x6a8ab0, 0xf0e8d8],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const parts = [];
      // Base foot
      parts.push(cyl(0.35, 0.4, 0.12, 8, 0xc8a060, { y: 0.06 }));
      // Lower body — wide
      parts.push(cyl(0.4, 0.6, 0.4, 8, 0xe8e0d0, { y: 0.35, hex2: 0xf0e8d8 }));
      // Main body — bulging
      parts.push(sph(0.65, 0xe8e0d0, { ws: 8, hs: 6, sy: 1.2, y: 0.85, hex2: 0xf0e8d8 }));
      // Neck — tapered
      parts.push(cyl(0.45, 0.3, 0.4, 8, 0xe8e0d0, { y: 1.45 }));
      // Rim — flared
      parts.push(cyl(0.3, 0.4, 0.15, 8, 0xc8a060, { y: 1.72 }));
      // Blue decorative band
      parts.push(cyl(0.66, 0.66, 0.1, 8, 0x3a5a8a, { y: 0.9, open: true }));
      parts.push(cyl(0.5, 0.5, 0.06, 8, 0x6a8ab0, { y: 1.35, open: true }));
      return finish(parts);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 陶瓷攤車 — ceramics vendor cart */
  {
    id: 'ceramic_cart',
    displayName: '陶瓷攤車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x9a7a52, 0xe8e0d0, 0x3a5a8a, 0xd8d0c0, 0x6a4a30],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0x9a7a52;
      const parts = [];
      // Cart body cabinet
      parts.push(box(2.0, 0.9, 1.1, wood, { y: 0.7 }));
      // Display shelf top
      parts.push(box(2.15, 0.08, 1.25, 0xd8d0c0, { y: 1.2 }));
      // Display shelf (single)
      parts.push(box(2.0, 0.06, 0.5, 0xd8d0c0, { y: 1.55, z: -0.3 }));
      // Ceramic bowls (3 simplified)
      for (let i = 0; i < 3; i++) {
        parts.push(cyl(0.12, 0.08, 0.08, 5, 0xe8e0d0, { x: -0.5 + i * 0.5, y: 1.28, z: 0.3 }));
      }
      // Teapot (single)
      parts.push(sph(0.12, 0x8a5a3a, { ws: 4, hs: 3, x: 0, y: 1.68, z: -0.3 }));
      // Cart wheels
      parts.push(cyl(0.28, 0.28, 0.14, 5, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.28, z: 0 }));
      parts.push(cyl(0.28, 0.28, 0.14, 5, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.28, z: 0 }));
      // Awning
      parts.push(box(2.2, 0.06, 0.8, 0xc83828, { y: 2.0, z: 0.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 窯爐 — traditional ceramics kiln */
  {
    id: 'kiln',
    displayName: '窯爐',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xa86850, 0x8a5040, 0xc87860, 0x6a4030, 0xd89070],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const brick = 0xa86850;
      const parts = [];
      // Main kiln body — domed brick structure
      parts.push(cyl(0.9, 0.95, 0.8, 10, brick, { y: 0.4, hex2: 0xc87860 }));
      parts.push(sph(0.95, brick, { ws: 8, hs: 5, thetaLen: HALF_PI * 0.9, y: 0.8, hex2: 0x8a5040 }));
      // Firing chamber opening (front arch)
      parts.push(box(0.5, 0.5, 0.1, 0x2a1a10, { y: 0.35, z: 0.9 })); // dark opening
      parts.push(cyl(0.3, 0.3, 0.12, 6, brick, { y: 0.65, z: 0.92, thetaLen: PI })); // arch top
      // Chimney stack
      parts.push(cyl(0.2, 0.18, 0.8, 6, 0x8a5040, { x: 0.4, y: 1.4 }));
      parts.push(cyl(0.22, 0.2, 0.1, 6, 0x6a4030, { x: 0.4, y: 1.85 })); // chimney cap
      // Smoke wisps (light spheres)
      parts.push(sph(0.1, 0x9a9a9a, { ws: 4, hs: 3, x: 0.4, y: 2.0 }));
      parts.push(sph(0.08, 0xaaaaaa, { ws: 4, hs: 3, x: 0.45, y: 2.15 }));
      // Base platform
      parts.push(box(2.2, 0.2, 1.5, 0x8a7a6a, { y: 0.1 }));
      // Firewood stack nearby
      for (let i = 0; i < 3; i++) {
        parts.push(cyl(0.08, 0.08, 0.6, 4, 0x6a4a30, {
          x: -0.8, y: 0.3 + i * 0.12, z: 0.3 + (i % 2) * 0.1,
          rz: HALF_PI,
        }));
      }
      // Ceramic pieces waiting to be fired
      parts.push(cyl(0.12, 0.1, 0.15, 6, 0xd8c8b8, { x: 0.7, y: 0.28, z: 0.5 }));
      parts.push(cyl(0.1, 0.08, 0.12, 6, 0xd8c8b8, { x: 0.9, y: 0.26, z: 0.4 }));
      return finish(parts);
    },
  },
];

export default T2_ARCHETYPES;
