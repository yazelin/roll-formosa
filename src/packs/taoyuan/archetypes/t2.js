/**
 * @file packs/taoyuan/archetypes/t2.js — Roll Formosa Taoyuan pack, TIER 2 「騎樓邊」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — tofu_cart / temple_incense_burner — at
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

  /* ---- slot 4 ---- 埤塘水位標 — Taoyuan pond water level marker post */
  {
    id: 'irrigation_marker',
    displayName: '埤塘水位標',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8dce0, 0xb8c0c8, 0x2060a0, 0xa8b0b8, 0x3070b0],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Taoyuan pond (埤塘) water level measurement post
      // These concrete posts with painted gradations are common around irrigation ponds
      const post = 0xffffff; // tinted concrete grey
      return finish([
        // base mounting foot (flared for stability)
        cyl(0.35, 0.45, 0.25, 8, 0x8a9098, { y: 0.12 }),
        // main post shaft
        box(0.25, 2.2, 0.2, post, { y: 1.2 }),
        // water level graduation marks (blue bands at different heights)
        box(0.27, 0.08, 0.22, 0x2060a0, { y: 0.5 }),
        box(0.27, 0.08, 0.22, 0x2060a0, { y: 0.9 }),
        box(0.27, 0.08, 0.22, 0x2060a0, { y: 1.3 }),
        box(0.27, 0.08, 0.22, 0x2060a0, { y: 1.7 }),
        box(0.27, 0.08, 0.22, 0x3070b0, { y: 2.1 }), // high-water warning mark
        // red warning cap at top
        box(0.3, 0.12, 0.25, 0xc04040, { y: 2.35 }),
        // "水利" characters panel (simplified as a small plate)
        box(0.22, 0.35, 0.04, 0xf0f0f0, { y: 0.7, z: 0.12 }),
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

  /* ---- slot 6 ---- 木器行木雕 — Daxi woodcraft carving (大溪木藝特產) */
  {
    id: 'daxi_woodcarving',
    displayName: '木器行木雕',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x8a5a38, 0x6a4028, 0xa07048, 0x5a3820, 0xc8a070],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Daxi is famous for its traditional woodcraft (大溪木藝 / 木器行)
      // This represents a carved wooden duck decoy, a classic Daxi souvenir
      const wood = 0xffffff; // tinted wood body
      return finish([
        // duck body (oval, sitting)
        sph(0.7, wood, { ws: 8, hs: 6, sy: 0.7, y: 0.5, hex2: 0xc8a070 }),
        // neck rising
        cyl(0.2, 0.25, 0.5, 6, wood, { y: 0.9, rz: -0.2 }),
        // head
        sph(0.28, wood, { ws: 7, hs: 5, x: -0.15, y: 1.35 }),
        // beak
        cone(0.1, 0.25, 5, 0xd8a040, { x: -0.35, y: 1.35, rz: HALF_PI }),
        // carved wing detail (raised ridges on body)
        box(0.5, 0.08, 0.35, 0x6a4028, { x: 0.1, y: 0.65, z: 0.25 }),
        box(0.5, 0.08, 0.35, 0x6a4028, { x: 0.1, y: 0.65, z: -0.25 }),
        // tail feathers (stacked thin plates)
        box(0.3, 0.15, 0.4, 0x5a3820, { x: 0.55, y: 0.55 }),
        box(0.15, 0.2, 0.35, 0x6a4028, { x: 0.7, y: 0.6 }),
        // wooden base platform
        box(1.0, 0.12, 0.7, 0x4a3018, { y: 0.06 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 埤塘水桶 — Taoyuan pond irrigation water bucket (埤塘灌溉水桶) */
  {
    id: 'pond_bucket',
    displayName: '埤塘水桶',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.45,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x3a6ea0, 0x2858a0, 0x4a8ab8, 0xd8dce2, 0x285890],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Traditional blue plastic water bucket used around Taoyuan's 埤塘 irrigation ponds
      const blue = 0xffffff; // tinted blue body
      return finish([
        // main bucket body (tapered cylinder)
        cyl(0.7, 0.9, 1.2, 10, blue, { y: 0.6, hex2: 0x4a8ab8 }),
        // reinforced rim at top
        cyl(0.92, 0.92, 0.12, 10, 0x2858a0, { y: 1.22, open: true }),
        // bottom base (thicker)
        cyl(0.72, 0.72, 0.08, 10, 0x285890, { y: 0.04 }),
        // horizontal ribs for strength
        cyl(0.82, 0.82, 0.05, 10, 0x3a78b0, { y: 0.4, open: true }),
        cyl(0.86, 0.86, 0.05, 10, 0x3a78b0, { y: 0.8, open: true }),
        // metal handle bail
        torus(0.45, 0.04, 5, 8, 0xc8ccd2, { y: 1.6, arc: PI }),
        // handle attachment lugs
        box(0.08, 0.15, 0.08, 0xd8dce2, { x: -0.45, y: 1.28 }),
        box(0.08, 0.15, 0.08, 0xd8dce2, { x: 0.45, y: 1.28 }),
      ]);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 豆乾推車 — Daxi dried tofu vendor cart w/ steamer trays */
  {
    id: 'tofu_cart',
    displayName: '豆乾推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x5a3824, 0x9a7a52, 0x6a4430, 0xead8b0, 0xd8dce2],
    yOffset: -0.369,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0x9a7a52;
      const tofu = 0x5a3824; // dark brown Daxi tofu color
      return finish([
        // cart body cabinet (wood-toned for traditional look)
        box(2.0, 1.0, 1.1, wood, { y: 0.75 }),
        // stainless steel counter top
        box(2.15, 0.1, 1.25, 0xd8dce2, { y: 1.3 }),
        // glass display case at back
        box(2.0, 0.5, 0.06, 0xbfd8e0, { y: 1.6, z: -0.55 }),
        // steamer tray on the counter (simplified)
        cyl(0.4, 0.42, 0.2, 6, 0xc8b89a, { x: -0.4, y: 1.45 }),
        // tofu block display (simplified)
        box(0.5, 0.1, 0.4, 0xd8dce2, { x: 0.5, y: 1.38 }), // metal tray
        box(0.35, 0.1, 0.3, tofu, { x: 0.5, y: 1.48 }), // tofu stack
        // flat canvas top
        box(2.2, 0.08, 1.2, 0xead8b0, { y: 2.2 }),
        // canopy poles (simplified)
        cyl(0.06, 0.06, 0.9, 4, wood, { x: -0.9, y: 1.75 }),
        cyl(0.06, 0.06, 0.9, 4, wood, { x: 0.9, y: 1.75 }),
        // two cart wheels
        cyl(0.32, 0.32, 0.14, 6, 0x2e3138, { rx: HALF_PI, x: -0.8, y: 0.32, z: 0 }),
        cyl(0.32, 0.32, 0.14, 6, 0x2e3138, { rx: HALF_PI, x: 0.8, y: 0.32, z: 0 }),
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
