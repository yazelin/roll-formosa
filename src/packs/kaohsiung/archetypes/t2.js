/**
 * @file packs/kaohsiung/archetypes/t2.js — Roll Formosa Kaohsiung pack, TIER 2 「鹽埕騎樓」.
 *
 * The 10 arcade-sidewalk (騎樓街邊物件) rollable archetypes, authored in the
 * FROZEN id order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots
 * [8..9] are the repeatable CHUNK LANDMARKS — salt_vendor_cart /
 * temple_incense_burner — at spawnWeight ~0.3 and ~2.5-4x the largest
 * absorbable radius). These are the everyday objects of 鹽埕 (Yancheng), the old
 * salt-trade harbour district of 高雄/港都.
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

  /* ---- slot 2 ---- 愛河遊船票亭 — Love River boat ticket booth (iconic Kaohsiung) */
  {
    id: 'love_river_booth',
    displayName: '愛河遊船票亭',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x3a7ab0, 0x4a8ac0, 0x2a6aa0, 0x5a9ad0, 0x3a6a90],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const booth = 0xffffff; // tinted blue for Love River theme
      return finish([
        // booth base platform
        box(1.2, 0.15, 0.9, 0x8a8a8a, { y: 0.08 }),
        // main booth body (small kiosk)
        box(1.0, 1.1, 0.8, booth, { y: 0.7, hex2: 0xd0e4f4 }),
        // sloped roof
        box(1.2, 0.12, 1.0, 0x4a6080, { y: 1.32, rz: 0.1 }),
        // ticket window (dark)
        box(0.5, 0.4, 0.06, 0x283848, { y: 0.8, z: 0.42 }),
        // counter ledge
        box(0.6, 0.08, 0.15, 0xd8d8d8, { y: 0.55, z: 0.48 }),
        // boat/wave logo (heart shape suggested with spheres)
        sph(0.12, 0xe05080, { ws: 6, hs: 4, y: 1.1, z: 0.42, x: -0.1 }),
        sph(0.12, 0xe05080, { ws: 6, hs: 4, y: 1.1, z: 0.42, x: 0.1 }),
        // small pole sign
        cyl(0.04, 0.04, 0.6, 5, 0x606060, { x: 0.5, y: 1.0, z: 0.3 }),
        box(0.25, 0.18, 0.04, 0xf0c020, { x: 0.5, y: 1.35, z: 0.3 }),
      ]);
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

  /* ---- slot 6 ---- 招財貓 — the beckoning lucky cat, seated with raised paw */
  {
    id: 'lucky_cat',
    displayName: '招財貓',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf6f2ea, 0xffd000, 0xe23a2c, 0xf0ede4, 0xe8b03d],
    yOffset: -0.195,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const white = 0xffffff; // porcelain body, tinted
      return finish([
        // seated body (rounded, slightly tapered)
        cyl(0.62, 0.78, 0.9, 8, white, { y: 0.5 }),
        sph(0.78, white, { ws: 8, hs: 4, thetaLen: HALF_PI, y: 0.95 }),
        // head
        sph(0.62, white, { ws: 8, hs: 5, y: 1.55 }),
        // two ears
        cone(0.22, 0.3, 5, white, { x: -0.36, y: 2.0, z: 0.0, rz: -0.25 }),
        cone(0.22, 0.3, 5, white, { x: 0.36, y: 2.0, z: 0.0, rz: 0.25 }),
        // raised beckoning paw (front-left, up)
        sph(0.2, white, { ws: 6, hs: 4, x: -0.55, y: 1.5, z: 0.45 }),
        cyl(0.1, 0.1, 0.4, 6, white, { x: -0.5, y: 1.2, z: 0.4, rz: -0.3 }),
        // resting paw
        sph(0.18, white, { ws: 6, hs: 4, x: 0.45, y: 0.55, z: 0.55 }),
        // gold bib / coin collar (tint-resistant gold)
        cyl(0.5, 0.6, 0.14, 8, 0xf0c020, { y: 1.18 }),
        box(0.34, 0.24, 0.06, 0xe8a020, { y: 0.95, z: 0.62 }), // koban coin
        // red collar bell
        sph(0.1, 0xd02a1f, { ws: 6, hs: 3, y: 1.18, z: 0.6 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 鐵馬樁 — the bike-share dock post + wheel-slot rail (港都 iBike) */
  {
    id: 'bike_dock',
    displayName: '鐵馬樁',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.55,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe8b03d, 0xf0c050, 0x303338, 0xd8d8d4, 0xc89028],
    yOffset: -0.210,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const yellow = 0xffffff; // tinted yellow housing (港都 iBike)
      const dark = 0x2a2c30;
      return finish([
        // base plate bolted to pavement
        box(0.7, 0.12, 1.6, dark, { y: 0.06 }),
        // angled wheel-slot rail running forward
        box(0.24, 0.5, 1.5, 0x4a4d52, { y: 0.35, z: 0.1 }),
        box(0.1, 0.7, 1.5, 0x6a6d72, { y: 0.6, z: 0.1 }), // upright guide fin
        // dock terminal post
        cyl(0.18, 0.22, 1.7, 8, yellow, { y: 1.05, z: -0.55 }),
        // info/payment head (tilted panel)
        box(0.5, 0.6, 0.18, yellow, { y: 2.0, z: -0.5, rx: 0.25 }),
        box(0.4, 0.46, 0.04, 0x202225, { y: 2.0, z: -0.38, rx: 0.25 }), // dark screen
        // small reader bump
        cyl(0.08, 0.1, 0.08, 6, 0x2e6a48, { y: 1.7, z: -0.36 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 鹽埕推車 — the salt-vendor handcart of old 鹽埕 (Yancheng) */
  {
    id: 'salt_vendor_cart',
    displayName: '鹽埕推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xe9e4d8, 0xc9a36a, 0x9a7a52, 0x7a93a8, 0xd8cdb8],
    yOffset: -0.369,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const cart = 0xffffff; // tinted body
      const wood = 0x9a7a52;
      return finish([
        // cart body cabinet (the salt bin)
        box(2.0, 1.0, 1.1, wood, { y: 0.75 }),
        // plank counter top
        box(2.15, 0.1, 1.25, 0xc9a36a, { y: 1.3 }),
        // heaped salt mounds on the counter (pale, tint-resistant)
        cone(0.4, 0.5, 6, 0xf2efe6, { y: 1.6, x: -0.55, z: 0.0 }),
        cone(0.34, 0.42, 6, 0xeae5da, { y: 1.56, x: 0.3, z: 0.2 }),
        cone(0.28, 0.34, 5, 0xf2efe6, { y: 1.52, x: 0.6, z: -0.3 }),
        // a couple of stacked salt sacks at the back
        box(0.5, 0.55, 0.4, 0xddd2bb, { y: 1.6, z: -0.45, x: -0.7 }),
        box(0.45, 0.5, 0.38, 0xcfc3a8, { y: 1.55, z: -0.45, x: 0.0 }),
        // front signboard face (tint)
        box(2.0, 0.5, 0.06, cart, { y: 0.7, z: 0.56 }),
        // wooden scoop / measuring bucket on the counter
        cyl(0.16, 0.13, 0.26, 6, 0x8a6a40, { y: 1.5, x: 0.9, z: 0.35 }),
        // four roof posts
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: -0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: -0.45 }),
        // canvas awning roof (tint), slightly above the posts
        box(2.4, 0.12, 1.5, cart, { y: 2.6 }),
        // valance strip hanging off the awning front (harbour blue)
        box(2.4, 0.28, 0.06, 0x6f8da6, { y: 2.42, z: 0.74 }),
        // hanging lamp
        sph(0.2, 0xffd06a, { ws: 6, hs: 4, x: 0.7, y: 2.3, z: 0.5 }),
        // two cart wheels (sideways cylinders)
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.34, z: 0 }),
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.34, z: 0 }),
        // push handle
        cyl(0.05, 0.05, 1.0, 5, wood, { rz: HALF_PI, x: 1.2, y: 1.1, rx: 0.2 }),
      ]);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 廟前香爐 — the bronze temple incense burner / ding */
  {
    id: 'temple_incense_burner',
    displayName: '廟前香爐',
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
