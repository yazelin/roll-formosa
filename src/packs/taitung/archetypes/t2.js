/**
 * @file packs/taitung/archetypes/t2.js — Roll Formosa Taitung pack, TIER 2 「正氣路騎樓」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — sugar_apple_cart / totem_pole — at
 * spawnWeight ~0.3 and ~2.5-4x the largest absorbable radius).
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
  /* ---- slot 0 ---- 紅塑膠椅 — the ubiquitous stackable red stool/chair */
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

  /* ---- slot 1 ---- 安全帽 — scooter half-helmet (open-face) */
  {
    id: 'helmet',
    displayName: '安全帽',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.28,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf2f2ee, 0xe23a2c, 0x2a55a8, 0x2e6a48, 0x303338],
    yOffset: -0.075,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // dome shell (upper hemisphere, baked near-white for tint)
        sph(1.0, 0xffffff, { ws: 10, hs: 6, thetaLen: HALF_PI * 1.15, y: 0.0 }),
        // brim/peak at the front
        box(0.9, 0.06, 0.42, 0xffffff, { y: -0.02, z: 0.78, rx: -0.18 }),
        // visor band (dark tint-resistant strip)
        cyl(1.0, 1.0, 0.16, 10, 0x2a2c30, {
          rx: HALF_PI, y: 0.02, thetaLen: PI, theta0: -HALF_PI,
        }),
        // chin strap stub
        box(0.1, 0.5, 0.1, 0x303338, { x: -0.7, y: -0.5 }),
        box(0.1, 0.5, 0.1, 0x303338, { x: 0.7, y: -0.5 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 電鍋 — the 大同 TATUNG rice cooker */
  {
    id: 'rice_cooker',
    displayName: '電鍋',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xe7d9bf, 0x2e6a48, 0xc4281f, 0xead8b0, 0xb0392c],
    yOffset: -0.253,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const body = 0xffffff; // tinted enamel
      return finish([
        // base ring / foot
        cyl(0.78, 0.82, 0.16, 10, 0xc8b89a, { y: 0.08 }),
        // main drum body
        cyl(0.74, 0.78, 0.9, 10, body, { y: 0.6, hex2: 0xeee0c4 }),
        // shoulder taper
        cyl(0.6, 0.74, 0.2, 10, body, { y: 1.15 }),
        // domed lid
        sph(0.62, body, { ws: 10, hs: 5, thetaLen: HALF_PI * 0.9, y: 1.22 }),
        // lid knob
        cyl(0.1, 0.13, 0.12, 8, 0x303338, { y: 1.66 }),
        // two side handles (small bars)
        box(0.16, 0.1, 0.1, 0x9a8a78, { x: -0.82, y: 0.7 }),
        box(0.16, 0.1, 0.1, 0x9a8a78, { x: 0.82, y: 0.7 }),
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

  /* ---- slot 6 ---- 原民木雕 — tribal carved wooden totem/figure */
  {
    id: 'tribal_wood_carving',
    displayName: '原民木雕',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x7a4a24, 0x5e3818, 0xc04030, 0xf0c030, 0x2a2a28],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const wood = 0x7a4a24;
      const dark = 0x5e3818;
      return finish([
        // carved standing figure body
        cyl(0.4, 0.5, 1.8, 6, wood, { y: 0.9, hex2: dark }),
        // head (larger sphere)
        sph(0.45, wood, { ws: 8, hs: 5, y: 2.0, hex2: dark }),
        // carved facial features
        sph(0.1, 0x2a2a28, { ws: 4, hs: 3, x: -0.2, y: 2.1, z: 0.35 }), // left eye
        sph(0.1, 0x2a2a28, { ws: 4, hs: 3, x: 0.2, y: 2.1, z: 0.35 }), // right eye
        box(0.25, 0.08, 0.1, 0xc04030, { y: 1.9, z: 0.42 }), // mouth
        // headdress
        box(0.7, 0.2, 0.3, 0xc04030, { y: 2.4, hex2: 0xa03020 }),
        // painted tribal pattern bands
        cyl(0.52, 0.52, 0.12, 6, 0xf0c030, { y: 1.4, open: true }),
        cyl(0.48, 0.48, 0.1, 6, 0xc04030, { y: 0.9, open: true }),
        // arms crossed at chest
        box(0.7, 0.15, 0.2, wood, { y: 1.5, z: 0.3 }),
        // base platform
        box(0.8, 0.15, 0.8, dark, { y: 0.08 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 公共腳踏車樁 YouBike-style dock terminal */
  {
    id: 'bike_rack',
    displayName: '公共腳踏車樁',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.55,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x38a858, 0x48b868, 0x303338, 0xd8d8d4, 0x28984a],
    yOffset: -0.2529,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const green = 0x38a858;
      const dark = 0x2a2c30;
      return finish([
        // base plate bolted to pavement
        box(0.7, 0.12, 1.6, dark, { y: 0.06 }),
        // low bike-wheel slot at the base (front)
        box(0.2, 0.4, 1.4, 0x4a4d52, { y: 0.3, z: 0.2 }),
        box(0.08, 0.6, 1.4, 0x6a6d72, { y: 0.5, z: 0.2 }), // upright guide fin
        // dock terminal post (short upright pillar)
        cyl(0.2, 0.24, 1.5, 8, green, { y: 0.95, z: -0.55 }),
        // small angled screen panel on top
        box(0.5, 0.55, 0.16, 0x303338, { y: 1.78, z: -0.48, rx: 0.25 }),
        box(0.4, 0.42, 0.04, 0x202225, { y: 1.78, z: -0.37, rx: 0.25 }), // dark screen face
        // small reader bump
        cyl(0.08, 0.1, 0.08, 6, 0xf0c020, { y: 1.5, z: -0.36 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 釋迦推車 — sugar apple vendor cart */
  {
    id: 'sugar_apple_cart',
    displayName: '釋迦推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x5a9a3a, 0x7ab84a, 0x8a5a32, 0xf0e8d0, 0xc04030],
    yOffset: -0.11,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0x8a5a32;
      const green = 0x5a9a3a;
      const parts = [];
      // cart body (display box)
      parts.push(box(1.8, 0.7, 1.2, 0xf0e8d0, { y: 0.75, hex2: 0xe0d8c0 }));
      // wood frame trim
      parts.push(box(1.9, 0.1, 1.3, wood, { y: 1.12 }));
      // two wheels
      parts.push(cyl(0.38, 0.38, 0.1, 6, 0x2e3138, { rx: HALF_PI, x: -0.55, y: 0.4, z: 0.6 }));
      parts.push(cyl(0.38, 0.38, 0.1, 6, 0x2e3138, { rx: HALF_PI, x: 0.55, y: 0.4, z: 0.6 }));
      // handle bar
      parts.push(box(0.06, 0.5, 0.06, wood, { x: -1.0, y: 1.3 }));
      // parasol
      parts.push(cyl(0.05, 0.05, 1.5, 5, wood, { x: 0.3, y: 1.85 }));
      parts.push(cone(1.1, 0.55, 6, 0xc04030, { x: 0.3, y: 2.8 }));
      // pile of sugar apples on cart (3 instead of 5)
      for (let i = 0; i < 3; i++) {
        const x = -0.4 + i * 0.4;
        parts.push(sph(0.3, green, { ws: 4, hs: 3, x, y: 1.35, z: 0, hex2: 0x7ab84a }));
      }
      // sign
      parts.push(box(0.5, 0.3, 0.04, 0xf0c030, { x: 0.6, y: 1.3, z: 0.62 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 部落圖騰柱 — tribal totem pole */
  {
    id: 'totem_pole',
    displayName: '部落圖騰柱',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x7a4a24, 0x5e3818, 0xc04030, 0xf0c030, 0x2a8a4a],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const wood = 0x7a4a24;
      const dark = 0x5e3818;
      const red = 0xc04030;
      const yellow = 0xf0c030;
      const parts = [];
      // main pole (tapered)
      parts.push(cyl(0.5, 0.7, 4.0, 8, wood, { y: 2.0, hex2: dark }));
      // carved face sections
      // lower face
      parts.push(sph(0.55, wood, { ws: 6, hs: 4, y: 0.8, z: 0.25, hex2: dark }));
      parts.push(sph(0.12, 0x2a2a28, { ws: 4, hs: 3, x: -0.2, y: 0.9, z: 0.5 })); // eye
      parts.push(sph(0.12, 0x2a2a28, { ws: 4, hs: 3, x: 0.2, y: 0.9, z: 0.5 })); // eye
      parts.push(box(0.3, 0.1, 0.15, red, { y: 0.65, z: 0.55 })); // mouth
      // middle face (snake/serpent motif)
      parts.push(cyl(0.58, 0.58, 0.3, 8, yellow, { y: 1.8, open: true }));
      parts.push(sph(0.5, wood, { ws: 6, hs: 4, y: 2.0, z: 0.2 }));
      parts.push(box(0.5, 0.15, 0.2, red, { y: 2.0, z: 0.45, hex2: 0xa03020 })); // zigzag band
      // upper face (bird/eagle)
      parts.push(sph(0.45, wood, { ws: 6, hs: 4, y: 3.2, z: 0.2 }));
      parts.push(cone(0.2, 0.5, 5, yellow, { y: 3.3, z: 0.5, rx: HALF_PI })); // beak
      parts.push(sph(0.1, 0x2a2a28, { ws: 4, hs: 3, x: -0.15, y: 3.35, z: 0.35 })); // eye
      parts.push(sph(0.1, 0x2a2a28, { ws: 4, hs: 3, x: 0.15, y: 3.35, z: 0.35 })); // eye
      // wings extending from sides
      parts.push(box(0.6, 0.5, 0.12, wood, { x: -0.55, y: 3.0, rz: 0.3, hex2: dark }));
      parts.push(box(0.6, 0.5, 0.12, wood, { x: 0.55, y: 3.0, rz: -0.3, hex2: dark }));
      // crown/top decoration
      parts.push(cone(0.35, 0.5, 6, red, { y: 4.2 }));
      // painted bands
      parts.push(cyl(0.72, 0.72, 0.08, 8, 0x2a8a4a, { y: 0.3, open: true }));
      parts.push(cyl(0.68, 0.68, 0.08, 8, red, { y: 2.6, open: true }));
      // stone base
      parts.push(box(1.0, 0.3, 1.0, 0x8a8278, { y: 0.15, hex2: 0x6a6258 }));
      return finish(parts);
    },
  },
];

export default T2_ARCHETYPES;
