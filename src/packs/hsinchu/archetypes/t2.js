/**
 * @file packs/hsinchu/archetypes/t2.js — Roll Formosa Hsinchu pack, TIER 2 「護城河騎樓」.
 *
 * The 10 moat-arcade sidewalk (護城河騎樓) rollable archetypes, authored in the
 * FROZEN id order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots
 * [8..9] are the repeatable CHUNK LANDMARKS — noodle_vendor_cart /
 * moat_railing — at spawnWeight ~0.3 and ~2.5-4x the largest absorbable radius).
 * These are the everyday objects along the historic moat area of 新竹 (Hsinchu),
 * the windy city famous for rice noodles and tech industry.
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

  /* ---- slot 1 ---- 安全帽 — scooter half-helmet (open-face), the daily commuter shell */
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

  /* ---- slot 2 ---- 米粉曬架 — rack for drying rice noodles (Hsinchu specialty) */
  {
    id: 'noodle_rack',
    displayName: '米粉曬架',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.6,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd4a06a, 0xc89858, 0xe8c080, 0xb88848, 0xf8f4e8],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0xc89858;
      const noodle = 0xf8f4e8;
      const parts = [
        // A-frame wooden stand - two angled legs
        box(0.12, 2.0, 0.12, wood, { x: -0.6, y: 1.0, rz: 0.15 }),
        box(0.12, 2.0, 0.12, wood, { x: 0.6, y: 1.0, rz: -0.15 }),
        // cross beam at top
        box(1.4, 0.1, 0.12, 0xd4a06a, { y: 1.9 }),
        // horizontal drying pole
        cyl(0.06, 0.06, 2.2, 6, 0xb88848, { rz: HALF_PI, y: 1.7 }),
      ];
      // hanging rice noodles (white strands draped over the pole)
      for (let i = 0; i < 5; i++) {
        const x = -0.7 + i * 0.35;
        // noodle bundle - thin boxes for strands
        parts.push(box(0.15, 1.2, 0.04, noodle, { x, y: 1.1, z: 0.05 }));
        parts.push(box(0.12, 1.1, 0.03, noodle, { x: x + 0.06, y: 1.05, z: -0.03 }));
      }
      // feet stabilizers
      parts.push(box(0.3, 0.08, 0.14, wood, { x: -0.55, y: 0.04 }));
      parts.push(box(0.3, 0.08, 0.14, wood, { x: 0.55, y: 0.04 }));
      return finish(parts);
    },
  },

  /* ---- slot 3 ---- 瓦斯桶 — the steel LPG cylinder chained outside every eatery */
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

  /* ---- slot 4 ---- 三角錐 — orange traffic cone, the eternal road-side territory marker */
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

  /* ---- slot 5 ---- 消防栓 — squat red fire hydrant with side outlets + bonnet cap */
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

  /* ---- slot 6 ---- 風城風箏 — Wind City kite, Hsinchu's windy identity */
  {
    id: 'wind_kite',
    displayName: '風城風箏',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.5,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe84040, 0x4080e8, 0xf0c040, 0x40b868, 0xe080c0],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [
        // diamond-shaped kite body (two triangular halves)
        box(1.6, 0.04, 1.2, 0xffffff, { y: 0.0, rz: 0.1 }), // main sail (tinted)
        // cross frame sticks
        cyl(0.03, 0.03, 1.8, 5, 0x9a7a50, { rz: HALF_PI, y: 0.02 }), // horizontal spar
        cyl(0.03, 0.03, 1.4, 5, 0x9a7a50, { y: 0.02 }), // vertical spar
        // decorative center circle
        cyl(0.25, 0.25, 0.03, 8, 0xf0c040, { y: 0.04 }),
        // flying bridle strings
        cyl(0.015, 0.015, 0.8, 4, 0xe8e0d0, { rx: 0.4, y: -0.3, z: 0.3 }),
        cyl(0.015, 0.015, 0.8, 4, 0xe8e0d0, { rx: 0.4, y: -0.3, z: -0.3 }),
      ];
      // tail streamers
      for (let i = 0; i < 3; i++) {
        const x = -0.3 + i * 0.3;
        parts.push(
          box(0.08, 0.02, 0.8, i % 2 === 0 ? 0xe84040 : 0xf0c040, {
            rx: 0.3 + i * 0.1, x, y: -0.5, z: -0.2 - i * 0.15,
          })
        );
      }
      return finish(parts);
    },
  },

  /* ---- slot 7 ---- 風力計 — anemometer, wind measuring device (wind city!) */
  {
    id: 'anemometer',
    displayName: '風力計',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc8ccd2, 0x4a8ac8, 0xe8e4de, 0x2a6a9a, 0xf0ece4],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [
        // central vertical shaft/pole
        cyl(0.08, 0.1, 2.0, 8, 0xc8ccd2, { y: 1.0 }),
        // base plate
        cyl(0.4, 0.5, 0.12, 8, 0x8a9098, { y: 0.06 }),
        // rotating head hub
        cyl(0.12, 0.12, 0.2, 8, 0x6a7a88, { y: 2.0 }),
      ];
      // three cup arms (hemispherical cups on horizontal arms)
      const cups = 3;
      for (let i = 0; i < cups; i++) {
        const a = (i / cups) * PI * 2;
        // arm
        parts.push(
          cyl(0.04, 0.04, 0.7, 5, 0xc8ccd2, { rz: HALF_PI, ry: a, x: Math.cos(a) * 0.35, y: 2.0, z: Math.sin(a) * 0.35 })
        );
        // cup (hemisphere)
        parts.push(
          sph(0.18, 0xffffff, { ws: 6, hs: 4, thetaLen: HALF_PI, x: Math.cos(a) * 0.7, y: 2.0, z: Math.sin(a) * 0.7, ry: a + HALF_PI })
        );
      }
      // wind vane tail on top
      parts.push(box(0.6, 0.25, 0.02, 0x4a8ac8, { y: 2.3, x: 0.3 }));
      parts.push(cone(0.12, 0.3, 4, 0x4a8ac8, { y: 2.3, x: -0.15, rz: -HALF_PI }));
      return finish(parts);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 米粉攤車 — rice noodle vendor cart */
  {
    id: 'noodle_vendor_cart',
    displayName: '米粉攤車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xe8e4de, 0xc9a36a, 0x9a7a52, 0x7a93a8, 0xd8cdb8],
    yOffset: -0.37,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const cart = 0xffffff; // tinted body
      const wood = 0x9a7a52;
      return finish([
        // cart body cabinet
        box(2.0, 1.0, 1.1, wood, { y: 0.75 }),
        // stainless steel counter top
        box(2.15, 0.1, 1.25, 0xd8dce2, { y: 1.3 }),
        // glass display case showing noodles
        box(1.8, 0.6, 0.08, 0xbfe0f0, { y: 1.6, z: 0.5 }),
        // piles of rice noodles on display (reduced segments for tri cap)
        sph(0.35, 0xf8f4e8, { ws: 5, hs: 3, sy: 0.4, x: -0.4, y: 1.5, z: 0.2 }),
        sph(0.3, 0xfff8f0, { ws: 5, hs: 3, sy: 0.4, x: 0.3, y: 1.5, z: 0.2 }),
        // front signboard (米粉 text implied)
        box(2.0, 0.5, 0.06, cart, { y: 0.7, z: 0.56 }),
        // four roof posts
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: -0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: -0.45 }),
        // canvas awning roof
        box(2.4, 0.12, 1.5, cart, { y: 2.6 }),
        // valance strip with noodle pattern
        box(2.4, 0.28, 0.06, 0xf8f0e0, { y: 2.42, z: 0.74 }),
        // hanging lamp (reduced segments)
        sph(0.2, 0xffd06a, { ws: 5, hs: 3, x: 0.7, y: 2.3, z: 0.5 }),
        // two cart wheels (6 segments for tri budget)
        cyl(0.34, 0.34, 0.16, 6, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.34, z: 0 }),
        cyl(0.34, 0.34, 0.16, 6, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.34, z: 0 }),
        // cooking pot for soup (6 segments)
        cyl(0.4, 0.4, 0.4, 6, 0x7a93a8, { x: -0.7, y: 1.5 }),
        // push handle
        cyl(0.05, 0.05, 1.0, 5, wood, { rz: HALF_PI, x: 1.2, y: 1.1, rx: 0.2 }),
      ]);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 護城河欄杆 — moat/canal railing section */
  {
    id: 'moat_railing',
    displayName: '護城河欄杆',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x6a7a6a, 0x8a9a8a, 0x5a6a5a, 0x7a8a7a, 0x4a5a4a],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const metal = 0xffffff; // tinted green-grey
      const parts = [
        // two main posts (6 segments for tri budget)
        cyl(0.14, 0.16, 2.0, 6, metal, { x: -1.2, y: 1.0 }),
        cyl(0.14, 0.16, 2.0, 6, metal, { x: 1.2, y: 1.0 }),
        // decorative post caps (reduced segments)
        sph(0.2, metal, { ws: 5, hs: 3, x: -1.2, y: 2.1 }),
        sph(0.2, metal, { ws: 5, hs: 3, x: 1.2, y: 2.1 }),
        // top horizontal rail
        cyl(0.08, 0.08, 2.5, 5, metal, { rz: HALF_PI, y: 1.8 }),
        // middle horizontal rail
        cyl(0.06, 0.06, 2.5, 5, metal, { rz: HALF_PI, y: 1.2 }),
        // bottom horizontal rail
        cyl(0.06, 0.06, 2.5, 5, metal, { rz: HALF_PI, y: 0.5 }),
      ];
      // vertical balusters (reduced from 7 to 5)
      const balusters = 5;
      for (let i = 0; i < balusters; i++) {
        const x = -1.0 + i * (2.0 / (balusters - 1));
        parts.push(cyl(0.04, 0.04, 1.4, 4, metal, { x, y: 1.15 }));
      }
      // decorative scrollwork in center (simplified)
      parts.push(torus(0.2, 0.03, 4, 5, metal, { y: 1.5, rz: HALF_PI }));
      // concrete base
      parts.push(box(2.8, 0.2, 0.4, 0x8a8a88, { y: 0.1 }));
      return finish(parts);
    },
  },
];

export default T2_ARCHETYPES;
