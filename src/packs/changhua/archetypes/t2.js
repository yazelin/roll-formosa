/**
 * @file packs/changhua/archetypes/t2.js — Roll Formosa Changhua pack, TIER 2 「鹿港騎樓」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — vendor_cart / temple_incense_burner — at
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
  /* ---- slot 0 ---- 紙扇 — traditional paper folding fan */
  {
    id: 'paper_fan',
    displayName: '紙扇',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf4ece0, 0xe8dcc8, 0xc8a868, 0x8b5a28, 0xc82828],
    yOffset: -0.5,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // Fan ribs (bamboo)
      for (let i = 0; i < 9; i++) {
        const angle = (-0.4 + i * 0.1);
        parts.push(box(0.03, 1.6, 0.02, 0x8b5a28, { rz: angle, y: 0.8 }));
      }
      // Paper surface (flattened half-sphere)
      parts.push(sph(1.0, 0xffffff, {
        ws: 12, hs: 6,
        sy: 0.06, sx: 1.2,
        thetaLen: PI * 0.6,
        y: 0.85,
      }));
      // Decorative red pattern
      parts.push(box(0.6, 0.08, 0.01, 0xc82828, { y: 1.2, z: 0.02 }));
      parts.push(box(0.4, 0.08, 0.01, 0xc82828, { y: 1.0, z: 0.02 }));
      // Handle pivot
      parts.push(cyl(0.08, 0.08, 0.15, 6, 0x654321, { y: 0.08 }));
      return finish(parts);
    },
  },

  /* ---- slot 1 ---- 香爐(小) — small brass incense burner */
  {
    id: 'small_incense_burner',
    displayName: '香爐(小)',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.28,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb89048, 0x9a7b3a, 0xc8a050, 0x7a5e2a, 0xd4b060],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Bowl body
        sph(0.8, 0xffffff, { ws: 10, hs: 5, thetaLen: HALF_PI * 1.1, y: 0.4 }),
        // Rim
        cyl(0.82, 0.82, 0.1, 10, 0x9a7b3a, { y: 0.85, open: true }),
        // Ash inside
        cyl(0.7, 0.7, 0.08, 10, 0xc8b89a, { y: 0.78 }),
        // Three legs
        cyl(0.1, 0.12, 0.4, 6, 0xffffff, { y: 0.2, x: 0.5 }),
        cyl(0.1, 0.12, 0.4, 6, 0xffffff, { y: 0.2, x: -0.25, z: 0.43 }),
        cyl(0.1, 0.12, 0.4, 6, 0xffffff, { y: 0.2, x: -0.25, z: -0.43 }),
        // Loop handles
        torus(0.18, 0.04, 4, 6, 0xffffff, { x: -0.75, y: 0.6 }),
        torus(0.18, 0.04, 4, 6, 0xffffff, { x: 0.75, y: 0.6 }),
        // Incense sticks
        cyl(0.02, 0.02, 0.6, 4, 0xc4281f, { y: 1.1, x: 0.1 }),
        cyl(0.02, 0.02, 0.55, 4, 0xc4281f, { y: 1.05, x: -0.1, rz: 0.08 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 肉圓碗 — bowl of Changhua meatball (肉圓) */
  {
    id: 'meatball_bowl',
    displayName: '肉圓碗',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.25,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf0e8d0, 0xc8a060, 0x8a5030, 0xd0b080, 0xa86830],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      return finish([
        // White ceramic bowl
        cyl(0.75, 0.55, 0.5, 10, 0xf0ece4, { y: 0.3 }),
        cyl(0.8, 0.8, 0.1, 10, 0xf0ece4, { y: 0.55, open: true }),
        // Meatball (translucent tapioca shell with meat visible)
        sph(0.5, 0xffffff, { ws: 10, hs: 7, y: 0.75, hex2: 0xe8d8c0 }), // shell (tinted)
        // Meat filling showing through
        sph(0.35, 0x8a5030, { ws: 6, hs: 4, y: 0.7 }),
        // Sweet sauce on top
        sph(0.25, 0xc8a060, { ws: 6, hs: 4, sy: 0.4, y: 1.05 }),
        // Cilantro garnish
        sph(0.12, 0x3a8a3a, { ws: 4, hs: 3, y: 1.15, x: 0.1 }),
        sph(0.1, 0x4a9a4a, { ws: 4, hs: 3, y: 1.12, x: -0.12 }),
      ]);
    },
  },

  /* ---- slot 3 ---- 爌肉飯盒 — braised pork rice box (爌肉飯) */
  {
    id: 'braised_pork_box',
    displayName: '爌肉飯盒',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xf4f0ea, 0x6a3a20, 0xf0e8d0, 0x8a5030, 0x3a8a3a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      return finish([
        // Paper lunch box
        box(1.4, 0.7, 1.0, 0xf4f0ea, { y: 0.35 }),
        box(1.42, 0.05, 1.02, 0xe8e0d0, { y: 0.7 }), // rim
        // Rice mound
        sph(0.55, 0xf0e8d0, { ws: 8, hs: 4, sy: 0.5, y: 0.55, x: 0.3 }),
        // Braised pork belly (the star - 爌肉)
        box(0.5, 0.35, 0.4, 0x6a3a20, { y: 0.55, x: -0.35, hex2: 0x8a5030 }),
        // Layers of meat and fat
        box(0.48, 0.08, 0.38, 0xf0d8c0, { y: 0.65, x: -0.35 }), // fat layer
        // Pickled vegetables (酸菜)
        box(0.35, 0.15, 0.25, 0x9a8a50, { y: 0.45, x: 0.35, z: 0.3 }),
        // Boiled egg half
        sph(0.18, 0xf0ece4, { ws: 6, hs: 4, y: 0.58, z: -0.3, x: 0.2 }),
        sph(0.12, 0xf0c040, { ws: 4, hs: 3, y: 0.62, z: -0.3, x: 0.2 }), // yolk
      ]);
    },
  },

  /* ---- slot 4 ---- 玻璃藝品 — Lukang glass art piece */
  {
    id: 'glass_art',
    displayName: '玻璃藝品',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.32,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a9ac8, 0x3a7aa8, 0x6abae8, 0x2a6a98, 0xaae0f8],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // Base
        cyl(0.5, 0.55, 0.15, 6, 0x2a3a4a, { y: 0.08 }),
        // Vase body (blown glass effect) - reduced segments
        cyl(0.45, 0.35, 0.4, 6, 0xffffff, { y: 0.35 }), // base (tinted)
        cyl(0.55, 0.45, 0.5, 6, 0xffffff, { y: 0.7 }), // belly
        cyl(0.35, 0.55, 0.3, 6, 0xffffff, { y: 1.05 }), // shoulder
        cyl(0.25, 0.35, 0.2, 6, 0xffffff, { y: 1.25 }), // neck
        cyl(0.35, 0.25, 0.1, 6, 0xffffff, { y: 1.4 }), // rim flare
        // Decorative swirls (colored glass)
        torus(0.4, 0.04, 4, 6, 0x3a7aa8, { y: 0.7, rx: 0.3 }),
        torus(0.35, 0.04, 4, 6, 0x6abae8, { y: 0.9, rx: -0.3 }),
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

  /* ---- slot 6 ---- 招財貓 — the beckoning lucky cat (招財貓), seated with raised paw */
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

  /* ---- slot 7 ---- YouBike樁柱 — the orange dock post + slot rail of a YouBike station */
  {
    id: 'youbike_dock',
    displayName: 'YouBike樁柱',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.55,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xf26a1f, 0xff7a28, 0x303338, 0xd8d8d4, 0xe05a18],
    yOffset: -0.210,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const orange = 0xffffff; // tinted orange housing
      const dark = 0x2a2c30;
      return finish([
        // base plate bolted to pavement
        box(0.7, 0.12, 1.6, dark, { y: 0.06 }),
        // angled wheel-slot rail running forward
        box(0.24, 0.5, 1.5, 0x4a4d52, { y: 0.35, z: 0.1 }),
        box(0.1, 0.7, 1.5, 0x6a6d72, { y: 0.6, z: 0.1 }), // upright guide fin
        // dock terminal post
        cyl(0.18, 0.22, 1.7, 8, orange, { y: 1.05, z: -0.55 }),
        // info/payment head (tilted panel)
        box(0.5, 0.6, 0.18, orange, { y: 2.0, z: -0.5, rx: 0.25 }),
        box(0.4, 0.46, 0.04, 0x202225, { y: 2.0, z: -0.38, rx: 0.25 }), // dark screen
        // small reader bump
        cyl(0.08, 0.1, 0.08, 6, 0xf0c020, { y: 1.7, z: -0.36 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 攤販推車 — wheeled street vendor cart w/ awning + lamp */
  {
    id: 'vendor_cart',
    displayName: '攤販推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd83026, 0xe0a050, 0xc94f46, 0x9a8a78, 0xead8b0],
    yOffset: -0.369,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const cart = 0xffffff; // tinted body
      const wood = 0x9a7a52;
      return finish([
        // cart body cabinet
        box(2.0, 1.0, 1.1, wood, { y: 0.75 }),
        // counter / stainless top
        box(2.15, 0.1, 1.25, 0xd8dce2, { y: 1.3 }),
        // glass display upstand at back
        box(2.0, 0.5, 0.06, 0xbfd8e0, { y: 1.6, z: -0.55 }),
        // front face panel (signboard, tint)
        box(2.0, 0.5, 0.06, cart, { y: 0.7, z: 0.56 }),
        // four roof posts
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: -0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: -0.45 }),
        // striped awning roof (tint), slightly peaked
        box(2.4, 0.12, 1.5, cart, { y: 2.6, rx: 0.0 }),
        // valance strip hanging off the awning front
        box(2.4, 0.28, 0.06, 0xe0a050, { y: 2.42, z: 0.74 }),
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
