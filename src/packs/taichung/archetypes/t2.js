/**
 * @file packs/taichung/archetypes/t2.js — T2 一中商圈騎樓 (Yizhong shopping-district arcade).
 *
 * Tier 2 of the Roll Formosa Taichung ladder (一中商圈, the student-packed
 * arcade beside 台中一中). 10 ArchetypeDefs in the FROZEN id order from
 * packs/taichung/tiers.js T2.archetypeIds:
 *   slots [0..7] absorbable arcade/street 小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (一中街攤車 / 騎樓柱招牌, spawnWeight ~0.3).
 *
 * Localized for 一中商圈: keeps the pan-Taiwan generics ANY Taiwan arcade /
 * street has (紅塑膠椅 / 安全帽 / 電鍋 / 瓦斯桶 / 三角錐 / 消防栓 — slots [0..5]
 * are copied verbatim from the Taipei template, they need no change), and
 * swaps slots [6..9] to 一中 signatures — a freestanding 立式燈箱招牌, an
 * oversized 手搖飲大杯, and re-themes both chunk landmarks to a 一中街攤車
 * (snack vendor cart) and a 騎樓柱招牌 (arcade pillar plastered with shop
 * signs). Deliberately avoids the curated collectible 珍奶 — the big drink cup
 * here is a generic 手搖飲 cup, not the named bubble-tea collectible.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band: radiusNominal 0.25–1.2 m. rng() is used ONLY for tiny
 * deterministic-friendly nudges, never structure.
 */

import {
  box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T2_ARCHETYPES = [
  /* ---- slot 0 ---- 紅塑膠椅 — the ubiquitous stackable red night-market stool/chair (pan-Taiwan) */
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

  /* ---- slot 1 ---- 安全帽 — scooter half-helmet (open-face), the daily commuter shell (pan-Taiwan) */
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

  /* ---- slot 2 ---- 電鍋 — the 大同 TATUNG rice cooker, drum body + domed lid + knob (pan-Taiwan) */
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

  /* ---- slot 3 ---- 瓦斯桶 — the steel LPG cylinder chained outside every eatery (pan-Taiwan) */
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

  /* ---- slot 4 ---- 三角錐 — orange traffic cone, the eternal road-side territory marker (pan-Taiwan) */
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

  /* ---- slot 5 ---- 消防栓 — squat red fire hydrant with side outlets + bonnet cap (pan-Taiwan) */
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

  /* ---- slot 6 ---- 立式燈箱招牌 — freestanding vertical illuminated lightbox advertising a shop */
  {
    id: 'lightbox_sign',
    displayName: '立式燈箱招牌',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf4f1e8, 0xe23a2c, 0x2a55a8, 0xf6c038, 0x303338],
    yOffset: -0.073,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const glow = 0xffffff; // glowing acrylic face, tinted bright
      const frame = 0x2a2c30; // dark aluminium frame (tint-resistant)
      return finish([
        // weighted base slab so it stands on the pavement
        box(0.7, 0.16, 0.5, frame, { y: 0.08 }),
        // upright support post behind the box
        cyl(0.07, 0.08, 1.7, 6, frame, { y: 0.95, z: -0.18 }),
        // tall glowing lightbox body (the bright acrylic panel)
        box(0.84, 1.5, 0.22, glow, { y: 1.55, hex2: 0xf6e8c0 }),
        // dark frame trim — top + bottom rails of the box
        box(0.92, 0.1, 0.28, frame, { y: 2.34 }),
        box(0.92, 0.1, 0.28, frame, { y: 0.78 }),
        // a coloured menu/headline band across the glowing face
        box(0.78, 0.34, 0.04, 0xe23a2c, { y: 2.0, z: 0.13 }),
        // a second accent strip lower down (price/特價 banner)
        box(0.78, 0.2, 0.04, 0x2a55a8, { y: 1.2, z: 0.13 }),
        // little side bracket clamping the box to the post
        box(0.12, 0.3, 0.12, frame, { y: 1.55, z: -0.06 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 手搖飲大杯 — oversized hand-shaken tea cup: dome lid, fat straw, pearls at the bottom */
  {
    id: 'bubble_tea_cup',
    displayName: '手搖飲大杯',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xeef2f4, 0xd6c4a8, 0x3a2a20, 0xc8442e, 0xc8d6da],
    yOffset: -0.048,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const cup = 0xeef2f4; // clear plastic cup wall
      const pearl = 0x3a2a20; // dark tapioca pearls (tint-resistant brown)
      const parts = [
        // clear plastic cup wall, tapering to a narrower base
        cyl(0.66, 0.5, 1.7, 9, cup, { y: 0.85, hex2: 0xdfe6ea }),
        // milk-tea fill (warm tan), shown as an inner open band
        cyl(0.62, 0.5, 1.0, 9, 0xd6c4a8, { y: 0.5, open: true, hex2: 0xc8b290 }),
        // rim ring at the top
        cyl(0.68, 0.68, 0.08, 9, 0xc8d6da, { y: 1.7, open: true }),
        // domed sealed lid (the heat-pressed film dome)
        sph(0.68, cup, { ws: 9, hs: 4, sy: 0.62, y: 1.72, thetaLen: PI * 0.55 }),
        // lid skirt gripping the rim
        cyl(0.68, 0.66, 0.12, 9, 0xc8d6da, { y: 1.74 }),
        // fat straw poking through the dome at an angle
        cyl(0.13, 0.13, 1.7, 6, 0xc8442e, { x: 0.16, y: 2.3, rz: 0.16 }),
      ];
      // tapioca pearls clustered at the bottom of the cup (deterministic ring + center)
      parts.push(ico(0.16, 0, pearl, { y: 0.18, x: 0.0, z: 0.0 }));
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        parts.push(
          ico(0.15, 0, pearl, { x: Math.cos(a) * 0.26, y: 0.16, z: Math.sin(a) * 0.26 })
        );
      }
      return finish(parts);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 一中街攤車 — wheeled snack vendor cart w/ parasol canopy + counter snacks */
  {
    id: 'yizhong_snack_cart',
    displayName: '一中街攤車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.22,
    radiusJitter: 0.13,
    spawnWeight: 0.3,
    palette: [0xe04a2e, 0xf6c038, 0xc8c4be, 0x9a7a52, 0xeae2d0],
    yOffset: -0.138,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wood = 0x9a7a52; // wooden cart cabinet
      const canopy = 0xe04a2e; // bright parasol canopy (tint)
      const parts = [
        // cart body cabinet
        box(2.0, 1.0, 1.05, wood, { y: 0.75, hex2: 0x8a6a44 }),
        // stainless counter top
        box(2.15, 0.1, 1.2, 0xc8c4be, { y: 1.32 }),
        // front signboard panel on the cabinet face
        box(1.7, 0.44, 0.06, 0xf6c038, { y: 0.72, z: 0.54 }),
        // four canopy posts rising from the corners
        cyl(0.05, 0.05, 1.3, 5, wood, { x: -0.85, y: 2.0, z: 0.42 }),
        cyl(0.05, 0.05, 1.3, 5, wood, { x: 0.85, y: 2.0, z: 0.42 }),
        cyl(0.05, 0.05, 1.3, 5, wood, { x: -0.85, y: 2.0, z: -0.42 }),
        cyl(0.05, 0.05, 1.3, 5, wood, { x: 0.85, y: 2.0, z: -0.42 }),
        // octagonal parasol canopy peaked over the cart
        cone(1.55, 0.7, 8, canopy, { y: 3.0, hex2: 0xc83a22 }),
        // canopy valance fringe hanging off the front edge
        box(2.5, 0.26, 0.05, 0xf6c038, { y: 2.7, z: 0.86 }),
        // two cart wheels (sideways cylinders)
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.34, z: 0 }),
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.34, z: 0 }),
        // push handle off the back
        cyl(0.05, 0.05, 0.9, 5, wood, { rz: HALF_PI, x: -1.18, y: 1.15, rx: 0.2 }),
      ];
      // a few snack items lined up on the counter (skewered balls / fried bites)
      const snackHex = [0xd87a3a, 0xe8b840, 0xb86a3a];
      for (let i = 0; i < 3; i++) {
        parts.push(ico(0.2, 0, snackHex[i], { x: -0.5 + i * 0.5, y: 1.55, z: 0.2 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 騎樓柱招牌 — arcade structural pillar plastered with stacked shop signboards */
  {
    id: 'arcade_pillar_signs',
    displayName: '騎樓柱招牌',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.24,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd8d2c4, 0xe23a2c, 0x2a55a8, 0xf6c038, 0x2e8a6a],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const pillar = 0xd8d2c4; // tiled concrete arcade column (tint)
      const dark = 0x2a2c30;
      return finish([
        // base plinth of the column
        box(0.86, 0.2, 0.86, dark, { y: 0.1 }),
        // main structural pillar (square arcade column)
        box(0.62, 3.4, 0.62, pillar, { y: 1.95, hex2: 0xc4beae }),
        // capital at the top where it meets the arcade ceiling
        box(0.84, 0.22, 0.84, dark, { y: 3.78 }),
        // stacked shop signboards climbing the front face (different shops)
        box(0.78, 0.42, 0.1, 0xe23a2c, { y: 1.1, z: 0.34 }),
        box(0.78, 0.42, 0.1, 0xf6c038, { y: 1.62, z: 0.34 }),
        box(0.78, 0.42, 0.1, 0x2a55a8, { y: 2.14, z: 0.34 }),
        box(0.78, 0.42, 0.1, 0x2e8a6a, { y: 2.66, z: 0.34 }),
        box(0.78, 0.42, 0.1, 0xe23a2c, { y: 3.18, z: 0.34 }),
        // a couple of perpendicular projecting lightbox blades off the side
        box(0.1, 0.5, 0.7, 0xf4f1e8, { x: 0.36, y: 1.9, z: 0.0 }),
        box(0.1, 0.5, 0.7, 0xf4f1e8, { x: -0.36, y: 2.9, z: 0.0 }),
        // a banner sign wrapping the other face
        box(0.66, 0.5, 0.08, 0x2a55a8, { y: 2.4, z: -0.34 }),
      ]);
    },
  },
];

export default T2_ARCHETYPES;
