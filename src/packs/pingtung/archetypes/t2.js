/**
 * @file packs/pingtung/archetypes/t2.js — Roll Formosa Pingtung pack, TIER 2 「恆春老街」.
 *
 * The 10 arcade-sidewalk (騎樓) rollable archetypes for Hengchun old street,
 * authored in the FROZEN id order of tiers.js T2.archetypeIds (slots [0..7]
 * absorbable, slots [8..9] are the repeatable CHUNK LANDMARKS —
 * hengchun_vendor_cart / temple_incense_burner — at spawnWeight ~0.3).
 *
 * Size band: radiusNominal 0.25–1.2 m. Every buildGeometry(rng) returns ONE
 * merged, vertex-colored BufferGeometry built ONLY from the engine geometry
 * vocabulary (geomHelpers.js: box/cyl/cone/sph/ico/torus + paint/xf + finish)
 * and normalized by finish() to a UNIT bounding sphere (radius 1). Tri budget
 * <= 350 per archetype (kept low via small radial segment counts, 6-10).
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
      const r = 0xffffff;
      return finish([
        box(0.9, 0.1, 0.85, r, { y: 0.85 }),
        box(0.9, 0.16, 0.06, r, { y: 0.78, z: 0.42 }),
        box(0.86, 0.7, 0.1, r, { y: 1.2, z: -0.4 }),
        box(0.86, 0.12, 0.1, r, { y: 1.0, z: -0.36 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: -0.36, y: 0.42, z: 0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: 0.36, y: 0.42, z: 0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: -0.36, y: 0.42, z: -0.34 }),
        cyl(0.05, 0.06, 0.85, 6, r, { x: 0.36, y: 0.42, z: -0.34 }),
      ]);
    },
  },

  /* ---- slot 1 ---- 安全帽 — scooter half-helmet */
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
        sph(1.0, 0xffffff, { ws: 10, hs: 6, thetaLen: HALF_PI * 1.15, y: 0.0 }),
        box(0.9, 0.06, 0.42, 0xffffff, { y: -0.02, z: 0.78, rx: -0.18 }),
        cyl(1.0, 1.0, 0.16, 10, 0x2a2c30, { rx: HALF_PI, y: 0.02, thetaLen: PI, theta0: -HALF_PI }),
        box(0.1, 0.5, 0.1, 0x303338, { x: -0.7, y: -0.5 }),
        box(0.1, 0.5, 0.1, 0x303338, { x: 0.7, y: -0.5 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 電鍋 — the TATUNG rice cooker */
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
      const body = 0xffffff;
      return finish([
        cyl(0.78, 0.82, 0.16, 10, 0xc8b89a, { y: 0.08 }),
        cyl(0.74, 0.78, 0.9, 10, body, { y: 0.6, hex2: 0xeee0c4 }),
        cyl(0.6, 0.74, 0.2, 10, body, { y: 1.15 }),
        sph(0.62, body, { ws: 10, hs: 5, thetaLen: HALF_PI * 0.9, y: 1.22 }),
        cyl(0.1, 0.13, 0.12, 8, 0x303338, { y: 1.66 }),
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
      const steel = 0xffffff;
      return finish([
        cyl(0.62, 0.66, 0.16, 10, 0x8a8278, { y: 0.08 }),
        cyl(0.6, 0.6, 1.5, 10, steel, { y: 0.9, hex2: 0xe2dccc }),
        sph(0.6, steel, { ws: 10, hs: 5, thetaLen: HALF_PI, y: 1.6 }),
        cyl(0.34, 0.34, 0.34, 8, 0x6a6258, { y: 2.18, open: true }),
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
      const o = 0xffffff;
      return finish([
        box(1.2, 0.14, 1.2, o, { y: 0.07 }),
        cyl(0.62, 0.82, 0.3, 8, o, { y: 0.27 }),
        cone(0.6, 1.7, 8, o, { y: 1.0 }),
        cyl(0.42, 0.5, 0.22, 8, 0xf0ede4, { y: 0.7 }),
        cyl(0.28, 0.34, 0.16, 8, 0xf0ede4, { y: 1.05 }),
      ]);
    },
  },

  /* ---- slot 5 ---- 洋蔥籃 — basket of Hengchun onions */
  {
    id: 'onion_basket',
    displayName: '洋蔥籃',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xd8a060, 0xc89050, 0xe8b070, 0xb88040, 0xf0c080],
    yOffset: -0.188,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Woven basket with Hengchun onions piled inside
      const basket = 0xffffff;
      return finish([
        // Basket body - tapered cylinder
        cyl(0.7, 0.9, 0.9, 10, basket, { y: 0.5, hex2: 0xd8a060 }),
        // Basket rim
        cyl(0.92, 0.92, 0.12, 10, 0xc89050, { y: 0.98 }),
        // Woven texture bands
        cyl(0.75, 0.85, 0.08, 10, 0xb88040, { y: 0.35 }),
        cyl(0.78, 0.88, 0.08, 10, 0xb88040, { y: 0.65 }),
        // Onions piled on top
        sph(0.3, 0xf0e0c0, { ws: 6, hs: 4, x: 0, y: 1.2, z: 0, hex2: 0xe8d0b0 }),
        sph(0.28, 0xf0e0c0, { ws: 6, hs: 4, x: 0.3, y: 1.1, z: 0.2 }),
        sph(0.26, 0xf0e0c0, { ws: 6, hs: 4, x: -0.25, y: 1.15, z: 0.15 }),
        sph(0.24, 0xf0e0c0, { ws: 6, hs: 4, x: 0.1, y: 1.0, z: -0.25 }),
        // Green onion tops
        cyl(0.04, 0.02, 0.5, 4, 0x60a048, { x: 0, y: 1.5, rz: 0.3 }),
        cyl(0.04, 0.02, 0.45, 4, 0x60a048, { x: 0.3, y: 1.4, rz: -0.25 }),
      ]);
    },
  },

  /* ---- slot 6 ---- 浮潛面鏡 — snorkel mask for Kenting diving */
  {
    id: 'snorkel_mask',
    displayName: '浮潛面鏡',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.3,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x40c0ff, 0x60d0ff, 0x2090c0, 0xffffff, 0x80e0ff],
    yOffset: -0.195,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Diving/snorkeling mask with transparent lens
      return finish([
        // Silicone skirt frame
        box(1.6, 0.9, 0.3, 0xffffff, { y: 0.5, hex2: 0x40c0ff }),
        // Lens frame
        box(1.4, 0.7, 0.1, 0x2a2a2a, { y: 0.5, z: 0.15 }),
        // Double lenses (transparent blue tint)
        box(0.5, 0.5, 0.06, 0x80d8f0, { x: -0.35, y: 0.5, z: 0.18 }),
        box(0.5, 0.5, 0.06, 0x80d8f0, { x: 0.35, y: 0.5, z: 0.18 }),
        // Nose bridge
        box(0.2, 0.3, 0.12, 0x2a2a2a, { y: 0.35, z: 0.12 }),
        // Strap connectors
        box(0.15, 0.2, 0.15, 0x2a2a2a, { x: -0.85, y: 0.5 }),
        box(0.15, 0.2, 0.15, 0x2a2a2a, { x: 0.85, y: 0.5 }),
        // Elastic strap pieces
        box(0.4, 0.12, 0.08, 0x40c0ff, { x: -1.1, y: 0.5, z: -0.1 }),
        box(0.4, 0.12, 0.08, 0x40c0ff, { x: 1.1, y: 0.5, z: -0.1 }),
      ]);
    },
  },

  /* ---- slot 7 ---- 衝浪板架 — surfboard rack near beach shops */
  {
    id: 'surfboard_rack',
    displayName: '衝浪板架',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.6,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x8a7a6a, 0x40c0ff, 0xff6040, 0xffd040, 0x40ff80],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const wood = 0x8a7a6a;
      const parts = [
        // Wooden frame
        cyl(0.08, 0.08, 2.0, 6, wood, { x: -0.8, y: 1.0 }),
        cyl(0.08, 0.08, 2.0, 6, wood, { x: 0.8, y: 1.0 }),
        box(1.8, 0.1, 0.1, wood, { y: 0.5 }),
        box(1.8, 0.1, 0.1, wood, { y: 1.5 }),
        // Surfboards leaning on rack
        box(0.3, 2.2, 0.08, 0x40c0ff, { x: -0.4, y: 1.1, rz: 0.15 }),
        box(0.28, 2.0, 0.08, 0xff6040, { x: 0.0, y: 1.0, rz: 0.1 }),
        box(0.32, 2.1, 0.08, 0xffd040, { x: 0.4, y: 1.05, rz: 0.05 }),
        // Board fin details
        box(0.08, 0.2, 0.12, 0x2a2a2a, { x: -0.4, y: 0.3, z: 0.08, rz: 0.15 }),
        box(0.08, 0.18, 0.12, 0x2a2a2a, { x: 0.0, y: 0.25, z: 0.08, rz: 0.1 }),
        box(0.08, 0.2, 0.12, 0x2a2a2a, { x: 0.4, y: 0.28, z: 0.08, rz: 0.05 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 恆春推車 — wheeled Hengchun vendor cart */
  {
    id: 'hengchun_vendor_cart',
    displayName: '恆春推車',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.8,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x2a8a5a, 0xe0a050, 0xf8f4f0, 0x9a8a78, 0xead8b0],
    yOffset: -0.369,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const cart = 0xffffff;
      const wood = 0x9a7a52;
      return finish([
        // Cart body
        box(2.0, 1.0, 1.1, wood, { y: 0.75 }),
        // Counter top
        box(2.15, 0.1, 1.25, 0xd8dce2, { y: 1.3 }),
        // Glass display
        box(2.0, 0.5, 0.06, 0xbfd8e0, { y: 1.6, z: -0.55 }),
        // Front panel (green Hengchun style)
        box(2.0, 0.5, 0.06, cart, { y: 0.7, z: 0.56, hex2: 0x2a8a5a }),
        // Roof posts
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: 0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: -0.85, y: 1.95, z: -0.45 }),
        cyl(0.06, 0.06, 1.2, 5, wood, { x: 0.85, y: 1.95, z: -0.45 }),
        // Striped awning
        box(2.4, 0.12, 1.5, cart, { y: 2.6 }),
        box(2.4, 0.28, 0.06, 0xe0a050, { y: 2.42, z: 0.74 }),
        // Lamp
        sph(0.2, 0xffd06a, { ws: 6, hs: 4, x: 0.7, y: 2.3, z: 0.5 }),
        // Wheels
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.34, z: 0 }),
        cyl(0.34, 0.34, 0.16, 8, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.34, z: 0 }),
        // Push handle
        cyl(0.05, 0.05, 1.0, 5, wood, { rz: HALF_PI, x: 1.2, y: 1.1, rx: 0.2 }),
      ]);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 海灘躺椅組 — beach lounge chair set */
  {
    id: 'beach_lounge_set',
    displayName: '海灘躺椅組',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x40c0ff, 0xff6040, 0xffd040, 0x40ff80, 0xffffff],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Kenting beach lounge chair set
      const parts = [
        // Main lounge chair - reclined
        box(2.2, 0.12, 0.9, 0xffffff, { y: 0.5, rz: -0.15, hex2: 0x40c0ff }),
        // Chair legs - tubular frame
        cyl(0.05, 0.05, 0.5, 5, 0xd8d8d8, { x: -0.9, y: 0.25, z: 0.35 }),
        cyl(0.05, 0.05, 0.5, 5, 0xd8d8d8, { x: -0.9, y: 0.25, z: -0.35 }),
        cyl(0.05, 0.05, 0.35, 5, 0xd8d8d8, { x: 0.8, y: 0.18, z: 0.35 }),
        cyl(0.05, 0.05, 0.35, 5, 0xd8d8d8, { x: 0.8, y: 0.18, z: -0.35 }),
        // Headrest
        box(0.5, 0.35, 0.8, 0x40c0ff, { x: -1.0, y: 0.75, rz: 0.3 }),
        // Small side table
        cyl(0.4, 0.4, 0.08, 6, 0xffffff, { x: 1.4, y: 0.55 }),
        cyl(0.08, 0.08, 0.55, 5, 0xd8d8d8, { x: 1.4, y: 0.27 }),
        // Drink on table
        cyl(0.12, 0.1, 0.25, 6, 0xff6040, { x: 1.4, y: 0.72 }),
        // Beach umbrella folded nearby
        cyl(0.04, 0.04, 1.5, 5, 0xd8d8d8, { x: 0.3, y: 0.75, rz: 0.4 }),
        cone(0.4, 1.2, 6, 0xffd040, { x: -0.1, y: 1.5, rz: 0.4 }),
        // Beach towel draped
        box(1.0, 0.03, 0.6, 0xff6040, { x: 0.1, y: 0.58, rz: -0.1 }),
      ];
      return finish(parts);
    },
  },
];

export default T2_ARCHETYPES;
