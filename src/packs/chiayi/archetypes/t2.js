/**
 * @file packs/chiayi/archetypes/t2.js — Roll Formosa Chiayi pack, TIER 2 「檜意騎樓」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — hinoki_vendor_cart / temple_incense_burner — at
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

  /* ---- slot 2 ---- 電鍋 — the 大同 TATUNG rice cooker, drum body + domed lid + knob */
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

  /* ---- slot 5 ---- 雞肉飯攤 — Chiayi turkey rice stall with steaming pot */
  {
    id: 'turkey_rice_stall',
    displayName: '雞肉飯攤',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.45,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xd8b070, 0xc8a058, 0xe8c888, 0xb89048, 0xf0d898],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const steel = 0xc8c8c8;
      return finish([
        // counter/table base (wood)
        box(1.4, 0.7, 0.9, wood, { y: 0.35 }),
        // stainless steel top
        box(1.5, 0.08, 1.0, steel, { y: 0.74 }),
        // large rice pot (cylindrical, with lid)
        cyl(0.4, 0.38, 0.5, 8, steel, { x: -0.35, y: 1.0 }),
        sph(0.36, steel, { ws: 8, hs: 4, thetaLen: HALF_PI, x: -0.35, y: 1.25 }), // lid dome
        cyl(0.08, 0.08, 0.08, 6, 0x2a2a2a, { x: -0.35, y: 1.45 }), // lid knob
        // turkey container (rectangular steel pan)
        box(0.5, 0.25, 0.4, steel, { x: 0.3, y: 0.87 }),
        // turkey meat inside (tan color)
        box(0.45, 0.1, 0.35, 0xd8a060, { x: 0.3, y: 0.95 }),
        // condiment bottles on side
        cyl(0.06, 0.05, 0.2, 6, 0xc83020, { x: 0.6, y: 0.88, z: 0.3 }), // soy sauce
        cyl(0.06, 0.05, 0.18, 6, 0xe8d090, { x: 0.6, y: 0.87, z: 0.15 }), // oil
        // signboard above
        box(0.8, 0.25, 0.05, 0xc04030, { y: 1.5, z: -0.4 }),
        box(0.7, 0.18, 0.02, 0xf8f0e0, { y: 1.5, z: -0.38 }), // text area
        // steam rising (simple white cylinder)
        cyl(0.08, 0.04, 0.3, 6, 0xe8e8e8, { x: -0.35, y: 1.65, open: true }),
      ]);
    },
  },

  /* ---- slot 6 ---- 檜木盒 — hinoki wood box (gift box), iconic Chiayi souvenir */
  {
    id: 'hinoki_box',
    displayName: '檜木盒',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.32,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8b878, 0xc8a860, 0xe8c888, 0xb89850, 0xf0d898],
    yOffset: -0.240,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted hinoki wood
      const dark = 0x8a7048;
      return finish([
        // main box body
        box(1.0, 0.7, 0.7, wood, { y: 0.35 }),
        // lid (slightly lifted)
        box(1.04, 0.12, 0.74, wood, { y: 0.76 }),
        // lid knob
        box(0.2, 0.08, 0.1, dark, { y: 0.86 }),
        // wood grain lines (darker bands)
        box(1.01, 0.04, 0.02, dark, { y: 0.25, z: 0.34 }),
        box(1.01, 0.04, 0.02, dark, { y: 0.45, z: 0.34 }),
        box(1.01, 0.04, 0.02, dark, { y: 0.25, z: -0.34 }),
        box(1.01, 0.04, 0.02, dark, { y: 0.45, z: -0.34 }),
        // corner joints / metal clasps
        box(0.08, 0.5, 0.08, 0x9a8a6a, { x: -0.48, y: 0.35, z: 0.32 }),
        box(0.08, 0.5, 0.08, 0x9a8a6a, { x: 0.48, y: 0.35, z: 0.32 }),
        box(0.08, 0.5, 0.08, 0x9a8a6a, { x: -0.48, y: 0.35, z: -0.32 }),
        box(0.08, 0.5, 0.08, 0x9a8a6a, { x: 0.48, y: 0.35, z: -0.32 }),
        // hinoki branded stamp mark on top
        cyl(0.15, 0.15, 0.02, 6, 0xc04030, { y: 0.83, x: 0.25 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 嘉義公車站牌 — Chiayi bus stop sign with green/white BRT style */
  {
    id: 'chiayi_bus_stop',
    displayName: '嘉義公車站牌',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.5,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x28a060, 0x38b070, 0xf0f0e8, 0x208050, 0x48c080],
    yOffset: -0.185,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const green = 0xffffff; // tinted BRT green
      const white = 0xf0f0e8;
      const post = 0x4a4a48;
      return finish([
        // base plate
        box(0.5, 0.08, 0.5, post, { y: 0.04 }),
        // main pole
        cyl(0.08, 0.1, 2.2, 6, post, { y: 1.1 }),
        // sign panel (double sided, green with white route info)
        box(0.8, 0.6, 0.06, green, { y: 2.1 }),
        // white route info area
        box(0.7, 0.4, 0.07, white, { y: 2.15 }),
        // "嘉義" header strip
        box(0.7, 0.12, 0.072, 0x28a060, { y: 2.38 }),
        // shelter arm (small canopy bracket)
        box(0.6, 0.06, 0.4, post, { y: 2.0, z: 0.22 }),
        // route number circle
        cyl(0.12, 0.12, 0.02, 6, 0xf05030, { y: 2.0, z: 0.035 }),
        // BRT logo (small green rectangle)
        box(0.2, 0.08, 0.02, 0x28a060, { y: 1.75, z: 0.04 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 檜木推車 — hinoki wood vendor cart, Hinoki Village style */
  {
    id: 'hinoki_vendor_cart',
    displayName: '檜木推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd8b070, 0xc8a058, 0xe8c888, 0xb89048, 0xf0d898],
    yOffset: -0.369,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const hinoki = 0xffffff; // tinted hinoki wood body
      const darkWood = 0x8a6a38;
      return finish([
        // cart body - japanese style display counter
        box(2.0, 0.9, 1.0, hinoki, { y: 0.7 }),
        // display top shelf (dark wood edge)
        box(2.1, 0.08, 1.1, darkWood, { y: 1.18 }),
        // raised glass display case
        box(1.8, 0.4, 0.06, 0xc8e0e8, { y: 1.45, z: -0.45 }),
        box(1.8, 0.4, 0.06, 0xc8e0e8, { y: 1.45, z: 0.45 }),
        // wooden frame around display
        cyl(0.05, 0.05, 0.5, 4, darkWood, { x: -0.9, y: 1.4, z: 0.45 }),
        cyl(0.05, 0.05, 0.5, 4, darkWood, { x: 0.9, y: 1.4, z: 0.45 }),
        cyl(0.05, 0.05, 0.5, 4, darkWood, { x: -0.9, y: 1.4, z: -0.45 }),
        cyl(0.05, 0.05, 0.5, 4, darkWood, { x: 0.9, y: 1.4, z: -0.45 }),
        // roof eaves (japanese style)
        box(2.4, 0.08, 1.4, darkWood, { y: 1.72 }),
        box(2.5, 0.12, 0.2, darkWood, { y: 1.8, z: 0.65 }),
        // "檜意森活村" sign board
        box(1.2, 0.3, 0.04, 0xc04030, { y: 0.8, z: 0.52 }),
        // small lantern
        cyl(0.12, 0.1, 0.25, 6, 0xffd070, { x: 0.85, y: 1.55, z: 0.5 }),
        // wheels (wooden spoke style)
        cyl(0.32, 0.32, 0.1, 8, 0x6a5a38, { rx: HALF_PI, x: -0.85, y: 0.32, z: 0 }),
        cyl(0.32, 0.32, 0.1, 8, 0x6a5a38, { rx: HALF_PI, x: 0.85, y: 0.32, z: 0 }),
        // push handle (curved wood)
        cyl(0.04, 0.04, 0.9, 4, darkWood, { rz: HALF_PI, x: 1.15, y: 1.0, rx: 0.15 }),
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
