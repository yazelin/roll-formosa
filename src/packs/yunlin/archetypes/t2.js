/**
 * @file packs/yunlin/archetypes/t2.js — Roll Formosa Yunlin pack, TIER 2 「戲院騎樓」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — puppet_vendor_cart / temple_incense_burner — at
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
  /* ---- slot 0 ---- 廟口板凳 — temple courtyard wooden bench */
  {
    id: 'temple_bench',
    displayName: '廟口板凳',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.45,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a5a30, 0xa06a38, 0x6a4020, 0xb07a48, 0x5a3018],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Traditional wooden bench seen outside Beigang Mazu temple
      return finish([
        // seat plank (thick wooden board)
        box(1.4, 0.12, 0.5, 0xffffff, { y: 0.56, hex2: 0xb88050 }),
        // two thick leg supports
        box(0.12, 0.52, 0.46, 0x8a5a30, { x: -0.55, y: 0.26 }),
        box(0.12, 0.52, 0.46, 0x8a5a30, { x: 0.55, y: 0.26 }),
        // cross brace between legs
        box(1.0, 0.08, 0.1, 0x6a4020, { y: 0.18 }),
        // decorative carved ends (temple style)
        box(0.08, 0.08, 0.5, 0xc87038, { x: -0.72, y: 0.56 }),
        box(0.08, 0.08, 0.5, 0xc87038, { x: 0.72, y: 0.56 }),
        // slight wear marks on seat
        box(0.8, 0.02, 0.3, 0xa87040, { y: 0.63 }),
      ]);
    },
  },

  /* ---- slot 1 ---- 斗笠 — traditional bamboo farmer's hat (雲林農民標配) */
  {
    id: 'bamboo_hat',
    displayName: '斗笠',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.30,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8a060, 0xd8b070, 0xb89050, 0xe8c080, 0xa08040],
    yOffset: -0.75, // hat lying flat or upside down
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional woven bamboo conical hat - iconic for Yunlin farmers
      return finish([
        // conical woven bamboo body
        cone(1.2, 0.7, 10, 0xffffff, { y: 0.35, hex2: 0xd8b070 }),
        // rim edge (darker woven band)
        cyl(1.22, 1.22, 0.08, 10, 0xa08040, { y: 0.02, open: true }),
        // inner headband padding
        cyl(0.35, 0.35, 0.12, 8, 0x8a7050, { y: 0.25 }),
        // woven texture lines (radial)
        box(1.1, 0.03, 0.05, 0xb89050, { y: 0.3, rz: 0.3 }),
        box(1.1, 0.03, 0.05, 0xb89050, { y: 0.3, rz: -0.3 }),
        box(0.05, 0.03, 1.1, 0xb89050, { y: 0.28 }),
        // chin cord attachment points
        sph(0.08, 0x6a5030, { ws: 4, hs: 3, x: -0.5, y: 0.1, z: 0.5 }),
        sph(0.08, 0x6a5030, { ws: 4, hs: 3, x: 0.5, y: 0.1, z: 0.5 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 醬油甕 — Xiluo soy sauce fermentation urn (西螺醬油甕) */
  {
    id: 'soy_sauce_urn',
    displayName: '醬油甕',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x5a4028, 0x6a5038, 0x4a3018, 0x7a6048, 0x3a2010],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      // Traditional earthenware urn for Xiluo soy sauce fermentation
      const clay = 0xffffff; // tinted clay
      return finish([
        // base foot ring
        cyl(0.55, 0.6, 0.12, 8, 0x4a3018, { y: 0.06 }),
        // lower body (tapered belly)
        cyl(0.55, 0.75, 0.6, 8, clay, { y: 0.42 }),
        // wide belly
        cyl(0.75, 0.78, 0.5, 8, clay, { y: 0.95, hex2: 0x6a5038 }),
        // upper shoulder taper
        cyl(0.6, 0.75, 0.35, 8, clay, { y: 1.38 }),
        // narrow neck
        cyl(0.45, 0.55, 0.25, 8, clay, { y: 1.68 }),
        // rim lip
        cyl(0.5, 0.48, 0.1, 8, 0x5a4028, { y: 1.85 }),
        // woven bamboo lid cover
        cyl(0.52, 0.52, 0.08, 6, 0xa08050, { y: 1.94 }),
        cyl(0.35, 0.3, 0.15, 6, 0x906838, { y: 2.05 }), // lid knob
        // decorative band (stamped pattern)
        cyl(0.77, 0.77, 0.08, 8, 0x4a3018, { y: 0.95, open: true }),
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

  /* ---- slot 6 ---- 布袋戲偶盒 — glove puppet carrying case (Yunlin specialty) */
  {
    id: 'puppet_box',
    displayName: '布袋戲偶盒',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x8a4a28, 0xa85a30, 0x6a3a1a, 0xc86a38, 0xf0c060],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Wooden carrying case body
        box(1.4, 1.6, 0.6, 0xffffff, { y: 0.8, hex2: 0xd8a868 }),
        // Lid (slightly raised)
        box(1.44, 0.12, 0.64, 0xc88848, { y: 1.64 }),
        // Metal hinges
        box(0.12, 0.08, 0.08, 0x8a8a88, { x: -0.6, y: 1.58, z: -0.28 }),
        box(0.12, 0.08, 0.08, 0x8a8a88, { x: 0.6, y: 1.58, z: -0.28 }),
        // Front clasp
        box(0.18, 0.12, 0.06, 0xb89050, { y: 0.8, z: 0.32 }),
        cyl(0.05, 0.05, 0.08, 6, 0x8a8a88, { y: 0.8, z: 0.36 }),
        // Decorative red trim (traditional style)
        box(1.42, 0.06, 0.62, 0xc83020, { y: 1.5 }),
        box(1.42, 0.06, 0.62, 0xc83020, { y: 0.12 }),
        // Carrying handle on top
        torus(0.25, 0.04, 4, 6, 0x6a4a28, { y: 1.78, rx: HALF_PI, arc: PI }),
        // Label plate
        box(0.6, 0.4, 0.04, 0xf0d8a0, { y: 0.9, z: 0.33 }),
        // Puppet head peeking out suggestion (through gap)
        sph(0.15, 0xf0c8a0, { ws: 6, hs: 4, y: 1.55, z: 0.15, x: 0.3 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 雲林公車站牌 — Yunlin bus stop sign */
  {
    id: 'yunlin_bus_stop',
    displayName: '雲林公車站牌',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.6,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2a6a9a, 0x3a7ab0, 0xf8f8f4, 0x4a8ac0, 0xf0c040],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      return finish([
        // Main pole (blue)
        cyl(0.12, 0.12, 3.2, 8, 0xffffff, { y: 1.6 }),
        // Base plate
        box(0.5, 0.12, 0.5, 0x4a4a48, { y: 0.06 }),
        // Sign panel (rectangular, double-sided)
        box(1.2, 0.8, 0.08, 0xf8f8f4, { y: 2.8 }),
        // Blue header bar
        box(1.22, 0.18, 0.1, 0x2a6a9a, { y: 3.12 }),
        // Route number area
        box(0.4, 0.3, 0.02, 0xf0c040, { y: 2.9, z: 0.05 }),
        // Bus icon suggestion
        box(0.25, 0.15, 0.02, 0x2a6a9a, { y: 2.6, z: 0.05, x: -0.35 }),
        // Yunlin county logo area
        cyl(0.12, 0.12, 0.02, 8, 0x2e8a4a, { y: 2.6, z: 0.05, x: 0.35 }),
        // Schedule panel below
        box(0.8, 0.4, 0.06, 0xe8e8e4, { y: 2.35 }),
        // Shelter mini-roof suggestion
        box(1.4, 0.06, 0.4, 0x4a8ac0, { y: 3.28, z: 0.15, rx: -0.2 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 戲棚推車 — puppet show vendor cart */
  {
    id: 'puppet_vendor_cart',
    displayName: '戲棚推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a4a28, 0xc86838, 0xf0c040, 0x2a8a4a, 0xc83020],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0x9a6a38;
      return finish([
        // Cart base body
        box(2.2, 0.8, 1.3, wood, { y: 0.65, hex2: 0xb88048 }),
        // Display counter top
        box(2.3, 0.1, 1.4, 0xd8a868, { y: 1.1 }),
        // Back panel with puppet display
        box(2.2, 1.4, 0.12, 0xc86838, { y: 1.9, z: -0.6 }),
        // Decorative curtain valance
        box(2.3, 0.3, 0.08, 0xf0c040, { y: 2.55, z: -0.58 }),
        // Stage opening (dark)
        box(1.6, 0.9, 0.06, 0x2a2018, { y: 1.6, z: -0.56 }),
        // Side posts
        cyl(0.08, 0.1, 1.6, 5, 0xc83020, { x: -1.05, y: 1.9, z: -0.55 }),
        cyl(0.08, 0.1, 1.6, 5, 0xc83020, { x: 1.05, y: 1.9, z: -0.55 }),
        // Wheels
        cyl(0.28, 0.28, 0.14, 6, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.28 }),
        cyl(0.28, 0.28, 0.14, 6, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.28 }),
        // Hanging lantern
        sph(0.18, 0xd83028, { ws: 5, hs: 3, y: 2.4, z: 0.0 }),
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
