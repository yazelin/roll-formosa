/**
 * @file packs/yilan/archetypes/t2.js — Roll Formosa Yilan pack, TIER 2 「騎樓邊」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — old_street_cart / temple_incense_burner — at
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

  /* ---- slot 1 ---- 礁溪溫泉蛋 — Jiaoxi hot spring egg: brown-shelled soft-boiled egg */
  {
    id: 'jiaoxi_egg',
    displayName: '礁溪溫泉蛋',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.035,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xa87850, 0xb88860, 0x986840, 0xc89870, 0x886030],
    yOffset: -0.20,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // egg shell - oval shape (brown-tinted from hot spring)
        sph(0.8, 0xffffff, { ws: 8, hs: 6, y: 0.7, sy: 1.2, hex2: 0xc89870 }),
        // slight narrowing at the top (egg point)
        sph(0.5, 0xffffff, { ws: 7, hs: 5, y: 1.3, sy: 0.8, hex2: 0xa87850 }),
        // small wire basket cradle at bottom (eggs are sold in baskets)
        torus(0.4, 0.03, 5, 6, 0x6a6a6a, { y: 0.15 }),
        // basket wire supports
        cyl(0.02, 0.02, 0.15, 4, 0x5a5a5a, { x: 0.35, y: 0.08 }),
        cyl(0.02, 0.02, 0.15, 4, 0x5a5a5a, { x: -0.35, y: 0.08 }),
        cyl(0.02, 0.02, 0.15, 4, 0x5a5a5a, { z: 0.35, y: 0.08 }),
        cyl(0.02, 0.02, 0.15, 4, 0x5a5a5a, { z: -0.35, y: 0.08 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 蔥油餅攤爐 — scallion pancake griddle, signature Yilan street food */
  {
    id: 'scallion_griddle',
    displayName: '蔥油餅攤爐',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.38,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x4a4a4a, 0x3a3a3a, 0x6a6a6a, 0xd8b870, 0xc8a050],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // large flat griddle plate (round, cast iron look)
        cyl(1.1, 1.1, 0.12, 10, 0x3a3a3a, { y: 0.9 }),
        // raised edge rim
        cyl(1.12, 1.12, 0.06, 10, 0x2a2a2a, { y: 0.97, open: true }),
        // gas burner base stand
        box(1.4, 0.7, 1.0, 0x5a5a5a, { y: 0.35 }),
        // burner grate slats
        box(1.3, 0.05, 0.08, 0x4a4a4a, { y: 0.72, z: -0.2 }),
        box(1.3, 0.05, 0.08, 0x4a4a4a, { y: 0.72, z: 0.2 }),
        // gas knob
        cyl(0.08, 0.08, 0.06, 6, 0x2a2a2a, { x: 0.75, y: 0.4, z: 0.45 }),
        // golden scallion pancake cooking on top
        cyl(0.4, 0.4, 0.08, 8, 0xd8b870, { y: 1.0, x: -0.25 }),
        // scallion bits on the pancake
        box(0.06, 0.03, 0.04, 0x4a8a3a, { x: -0.2, y: 1.05, z: 0.05 }),
        box(0.05, 0.03, 0.04, 0x4a8a3a, { x: -0.35, y: 1.05, z: -0.05 }),
        // spatula resting nearby
        box(0.5, 0.02, 0.15, 0x8a8a8a, { x: 0.4, y: 0.98, z: 0.1 }),
        cyl(0.04, 0.04, 0.25, 4, 0x6a5a4a, { x: 0.7, y: 0.98, z: 0.1 }),
      ];
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

  /* ---- slot 6 ---- 溫泉桶 — Jiaoxi hot spring wooden bucket, signature Yilan bathing */
  {
    id: 'hot_spring_bucket',
    displayName: '溫泉桶',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xb89060, 0xa07850, 0xc8a070, 0x8a6840, 0xd0b080],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const parts = [
        // main bucket body (wooden staves)
        cyl(0.8, 0.7, 1.4, 8, wood, { y: 0.7, hex2: 0xc8a070 }),
        // metal bands around the bucket
        cyl(0.82, 0.82, 0.08, 8, 0x6a6a6a, { y: 0.25 }),
        cyl(0.78, 0.78, 0.08, 8, 0x6a6a6a, { y: 1.1 }),
        // wooden handle (arched)
        cyl(0.06, 0.06, 0.5, 5, 0x8a6840, { x: 0.0, y: 1.7, rz: HALF_PI }),
        // handle supports
        cyl(0.05, 0.05, 0.3, 4, 0x8a6840, { x: -0.42, y: 1.55, rz: 0.3 }),
        cyl(0.05, 0.05, 0.3, 4, 0x8a6840, { x: 0.42, y: 1.55, rz: -0.3 }),
        // steam wisps (simple white spheres)
        sph(0.12, 0xe8e8e8, { ws: 5, hs: 4, x: 0.0, y: 1.8, z: 0.2 }),
        sph(0.08, 0xf0f0f0, { ws: 4, hs: 3, x: 0.15, y: 1.95, z: -0.1 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7 ---- 鐵馬樁 — simple bike parking post common in Yilan countryside */
  {
    id: 'bike_dock',
    displayName: '鐵馬樁',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.50,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x4a5a68, 0x6a7a88, 0x3a4a58, 0x8a9aa8, 0x2a3a48],
    yOffset: -0.200,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const steel = 0xffffff; // tinted steel
      return finish([
        // base plate
        box(0.6, 0.08, 0.4, 0x3a3a3a, { y: 0.04 }),
        // main vertical post
        cyl(0.06, 0.06, 1.4, 6, steel, { y: 0.78 }),
        // inverted U-shape bike rack
        cyl(0.05, 0.05, 0.8, 6, steel, { x: -0.25, y: 0.88 }),
        cyl(0.05, 0.05, 0.8, 6, steel, { x: 0.25, y: 0.88 }),
        // top connecting bar
        cyl(0.05, 0.05, 0.5, 6, steel, { y: 1.28, rz: HALF_PI }),
        // small info sign on post
        box(0.18, 0.12, 0.02, 0x2a6a2a, { y: 1.38, z: 0.08 }),
        // bike icon on sign (small circles)
        sph(0.03, 0xf0f0f0, { x: -0.04, y: 1.38, z: 0.10, ws: 4, hs: 3 }),
        sph(0.03, 0xf0f0f0, { x: 0.04, y: 1.38, z: 0.10, ws: 4, hs: 3 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 老街推車 — vintage wooden cart on Toucheng Old Street */
  {
    id: 'old_street_cart',
    displayName: '老街推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a6a42, 0xa07a52, 0x6a5a32, 0xc8a870, 0x5a4a28],
    yOffset: -0.369,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const darkWood = 0x5a4a32;
      return finish([
        // cart body - vintage wooden box
        box(1.8, 0.9, 1.0, wood, { y: 0.70, hex2: 0xc8a870 }),
        // wooden planks texture (two strips)
        box(1.82, 0.05, 1.02, darkWood, { y: 0.50 }),
        box(1.82, 0.05, 1.02, darkWood, { y: 0.90 }),
        // counter top - worn wood
        box(1.9, 0.08, 1.1, 0xb89860, { y: 1.19 }),
        // fabric awning (red old street style)
        box(2.0, 0.06, 1.3, 0xc83030, { y: 2.2, rx: 0.1 }),
        // awning support poles (fewer)
        cyl(0.05, 0.05, 1.0, 4, darkWood, { x: -0.8, y: 1.75, z: 0.45 }),
        cyl(0.05, 0.05, 1.0, 4, darkWood, { x: 0.8, y: 1.75, z: 0.45 }),
        // vintage wooden wheels
        cyl(0.40, 0.40, 0.12, 5, darkWood, { rx: HALF_PI, x: -0.85, y: 0.40, z: 0 }),
        cyl(0.40, 0.40, 0.12, 5, darkWood, { rx: HALF_PI, x: 0.85, y: 0.40, z: 0 }),
        // wheel hubs
        cyl(0.10, 0.10, 0.16, 4, 0x4a3a28, { rx: HALF_PI, x: -0.85, y: 0.40, z: 0 }),
        cyl(0.10, 0.10, 0.16, 4, 0x4a3a28, { rx: HALF_PI, x: 0.85, y: 0.40, z: 0 }),
        // push handle at back (boxes instead of cylinders)
        box(0.08, 0.8, 0.08, darkWood, { x: -0.95, y: 1.0, rz: 0.3 }),
        box(0.08, 0.8, 0.08, darkWood, { x: 0.95, y: 1.0, rz: -0.3 }),
        box(0.6, 0.08, 0.08, darkWood, { y: 1.38 }),
        // hanging red lantern
        sph(0.15, 0xe02020, { ws: 4, hs: 3, x: 0.0, y: 2.0, z: 0.55 }),
      ]);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 廟前香爐(鼎) — the bronze temple incense burner / ding */
  {
    id: 'temple_incense_burner',
    displayName: '廟前香爐(鼎)',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x9a7b3a, 0xb89048, 0x7a5e2a, 0xc8a050, 0x6a4e22],
    yOffset: -0.215,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const bronze = 0xffffff; // tinted aged-bronze
      return finish([
        // round cauldron belly
        sph(1.0, bronze, { ws: 8, hs: 4, y: 1.0, hex2: 0xead8b0 }),
        // rim band of the bowl
        cyl(1.02, 1.02, 0.2, 8, 0x8a6a30, { y: 1.6, open: true }),
        // ash fill (sand) inside the rim (top disc only, low-tri)
        cyl(0.92, 0.92, 0.1, 8, 0xc8b89a, { y: 1.62, open: true }),
        // three short legs (tripod ding)
        cyl(0.12, 0.16, 0.7, 5, bronze, { y: 0.35, z: 0.7 }),
        cyl(0.12, 0.16, 0.7, 5, bronze, { y: 0.35, x: -0.6, z: -0.4 }),
        cyl(0.12, 0.16, 0.7, 5, bronze, { y: 0.35, x: 0.6, z: -0.4 }),
        // two upright loop handles at the rim
        torus(0.28, 0.07, 4, 5, bronze, { x: -1.0, y: 1.7 }),
        torus(0.28, 0.07, 4, 5, bronze, { x: 1.0, y: 1.7 }),
        // dragon-pillar uprights flanking the bowl
        cyl(0.1, 0.12, 1.6, 5, bronze, { x: -1.05, y: 1.0 }),
        cyl(0.1, 0.12, 1.6, 5, bronze, { x: 1.05, y: 1.0 }),
        // small pagoda-roof finial on top
        cone(0.5, 0.5, 6, 0xc83020, { y: 2.0 }),
        cyl(0.06, 0.06, 0.3, 5, 0xf0c020, { y: 2.35 }),
        // a few incense sticks poking out of the ash
        cyl(0.018, 0.018, 0.8, 4, 0xc4281f, { y: 2.0, x: 0.2, z: 0.1 }),
        cyl(0.018, 0.018, 0.8, 4, 0xc4281f, { y: 2.0, x: -0.18, z: 0.2 }),
        cyl(0.018, 0.018, 0.8, 4, 0xc4281f, { y: 2.0, x: 0.0, z: -0.2 }),
      ]);
    },
  },
];

export default T2_ARCHETYPES;
