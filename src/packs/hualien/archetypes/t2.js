/**
 * @file packs/hualien/archetypes/t2.js — Roll Formosa Hualien pack, TIER 2 「原民街巷」.
 *
 * The 10 aboriginal-street (原民街) rollable archetypes, authored in the FROZEN id
 * order of tiers.js T2.archetypeIds (slots [0..7] absorbable, slots [8..9] are
 * the repeatable CHUNK LANDMARKS — tribal_totem_pole / temple_incense_burner — at
 * spawnWeight ~0.3 and ~2.5-4x the largest absorbable radius).
 *
 * Hualien theme: 原民圖騰/竹蒸籠/編織籃/獵人刀 — aboriginal culture mixed with
 * everyday Taiwanese street elements.
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
        cyl(1.0, 1.0, 0.16, 10, 0x2a2c30, {
          rx: HALF_PI, y: 0.02, thetaLen: PI, theta0: -HALF_PI,
        }),
        box(0.1, 0.5, 0.1, 0x303338, { x: -0.7, y: -0.5 }),
        box(0.1, 0.5, 0.1, 0x303338, { x: 0.7, y: -0.5 }),
      ]);
    },
  },

  /* ---- slot 2 ---- 竹蒸籠 — bamboo steamer (dim sum style) */
  {
    id: 'bamboo_steamer',
    displayName: '竹蒸籠',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.25,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c090, 0xc8a870, 0xe0d0a0, 0xb89860],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Stacked bamboo steamers — classic dim sum look
      return finish([
        // Bottom tier
        cyl(0.9, 0.9, 0.5, 10, 0xffffff, { y: 0.25, hex2: 0xe0d0a0 }), // bamboo body (tinted)
        cyl(0.92, 0.92, 0.06, 10, 0xb89860, { y: 0.5 }), // rim
        // Middle tier
        cyl(0.9, 0.9, 0.5, 10, 0xffffff, { y: 0.78, hex2: 0xd8c090 }),
        cyl(0.92, 0.92, 0.06, 10, 0xb89860, { y: 1.03 }),
        // Domed lid on top
        sph(0.92, 0xc8a870, { ws: 8, hs: 4, y: 1.3, thetaLen: HALF_PI }),
        // Woven bamboo pattern (lid handle)
        cyl(0.15, 0.12, 0.15, 6, 0xa88850, { y: 1.65 }),
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
      const red = 0xffffff;
      return finish([
        cyl(0.66, 0.72, 0.2, 8, 0x9a2018, { y: 0.1 }),
        cyl(0.52, 0.58, 1.1, 8, red, { y: 0.75 }),
        cyl(0.42, 0.52, 0.24, 8, red, { y: 1.42 }),
        sph(0.46, red, { ws: 8, hs: 4, thetaLen: HALF_PI, y: 1.5 }),
        cyl(0.16, 0.2, 0.2, 6, 0xf0c020, { y: 1.92 }),
        cyl(0.18, 0.2, 0.22, 6, red, { rx: HALF_PI, y: 1.0, z: 0.58 }),
        cyl(0.22, 0.22, 0.06, 6, 0xf0c020, { rx: HALF_PI, y: 1.0, z: 0.7 }),
        cyl(0.15, 0.17, 0.2, 6, red, { rz: HALF_PI, x: -0.6, y: 0.85 }),
        cyl(0.15, 0.17, 0.2, 6, red, { rz: HALF_PI, x: 0.6, y: 0.85 }),
      ]);
    },
  },

  /* ---- slot 6 ---- 編織籃 — Amis-style woven basket */
  {
    id: 'woven_basket',
    displayName: '編織籃',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.35,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8a870, 0xb89050, 0xe0c890, 0xa87840],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional woven rattan basket — Amis craft style
      const parts = [
        // Basket body (tapered cylinder)
        cyl(0.7, 0.9, 1.2, 10, 0xffffff, { y: 0.6, hex2: 0xe0c890 }), // woven body (tinted)
        // Rim
        cyl(0.92, 0.9, 0.12, 10, 0xa87840, { y: 1.22 }),
        // Bottom
        cyl(0.68, 0.68, 0.08, 10, 0xb89050, { y: 0.04 }),
        // Woven pattern bands (darker horizontal rings)
        cyl(0.74, 0.78, 0.1, 10, 0xa87840, { y: 0.35 }),
        cyl(0.82, 0.86, 0.1, 10, 0xa87840, { y: 0.75 }),
        // Handle arch
        torus(0.5, 0.06, 6, 8, 0xa87840, { y: 1.55, arc: PI }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7 ---- 獵人刀架 — display rack with hunter knives */
  {
    id: 'hunter_knife_rack',
    displayName: '獵人刀架',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 0.4,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x6a5040, 0x8a7060, 0xc8ccd2, 0x4a3028],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Wooden display rack with traditional aboriginal hunting knives
      const parts = [
        // Wooden rack base
        box(1.4, 0.15, 0.6, 0x6a5040, { y: 0.08 }),
        // Vertical support posts
        cyl(0.08, 0.08, 1.4, 6, 0x8a7060, { x: -0.55, y: 0.78 }),
        cyl(0.08, 0.08, 1.4, 6, 0x8a7060, { x: 0.55, y: 0.78 }),
        // Horizontal display bars
        cyl(0.05, 0.05, 1.2, 6, 0x6a5040, { x: 0, y: 0.5, rz: HALF_PI }),
        cyl(0.05, 0.05, 1.2, 6, 0x6a5040, { x: 0, y: 1.0, rz: HALF_PI }),
        // Hunting knives (3) with curved blades and wrapped handles
        // Knife 1
        box(0.06, 0.4, 0.12, 0x4a3028, { x: -0.3, y: 0.7, rz: 0.3 }), // handle
        box(0.04, 0.5, 0.08, 0xc8ccd2, { x: -0.3, y: 1.15, rz: 0.3 }), // blade
        // Knife 2
        box(0.06, 0.35, 0.12, 0x4a3028, { x: 0.0, y: 0.65, rz: -0.1 }),
        box(0.04, 0.45, 0.08, 0xc8ccd2, { x: 0.0, y: 1.05, rz: -0.1 }),
        // Knife 3
        box(0.06, 0.38, 0.12, 0x4a3028, { x: 0.3, y: 0.68, rz: 0.2 }),
        box(0.04, 0.48, 0.08, 0xc8ccd2, { x: 0.3, y: 1.1, rz: 0.2 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8 (CHUNK LANDMARK) ---- 原民圖騰柱 — aboriginal totem pole */
  {
    id: 'tribal_totem_pole',
    displayName: '原民圖騰柱',
    tier: 2,
    naturalBand: 2,
    radiusNominal: 1.2,
    radiusJitter: 0.15,
    spawnWeight: 0.3,
    palette: [0xc83020, 0x2a6a3a, 0xe8a030, 0x1a1a1a, 0xf0e8d0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Traditional Amis/Truku totem pole with carved faces and patterns
      const parts = [
        // Main pole body (wood, carved)
        cyl(0.45, 0.5, 3.5, 8, 0x8a6040, { y: 1.75, hex2: 0xa87850 }),
        // Stone base
        cyl(0.7, 0.8, 0.4, 8, 0x9a9088, { y: 0.2 }),
        // Carved face sections with tribal colors
        // Lower face
        cyl(0.52, 0.52, 0.6, 8, 0xc83020, { y: 0.8 }), // red band
        box(0.3, 0.15, 0.55, 0xf0e8d0, { y: 0.9, z: 0.0 }), // face
        sph(0.08, 0x1a1a1a, { ws: 6, hs: 4, x: -0.12, y: 0.95, z: 0.45 }), // eye
        sph(0.08, 0x1a1a1a, { ws: 6, hs: 4, x: 0.12, y: 0.95, z: 0.45 }), // eye
        // Middle section
        cyl(0.5, 0.5, 0.5, 8, 0x2a6a3a, { y: 1.55 }), // green band
        // Zigzag pattern boxes
        box(0.15, 0.3, 0.52, 0xe8a030, { x: -0.2, y: 1.55, z: 0.0 }),
        box(0.15, 0.3, 0.52, 0xe8a030, { x: 0.2, y: 1.55, z: 0.0 }),
        // Upper face
        cyl(0.48, 0.48, 0.6, 8, 0xc83020, { y: 2.3 }),
        box(0.28, 0.15, 0.5, 0xf0e8d0, { y: 2.4, z: 0.0 }),
        // Top crown
        cone(0.4, 0.5, 6, 0x1a1a1a, { y: 3.6 }),
        cyl(0.15, 0.08, 0.3, 6, 0xe8a030, { y: 3.95 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 9 (CHUNK LANDMARK) ---- 廟前香爐(鼎) — temple incense burner */
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
      const bronze = 0xffffff;
      return finish([
        sph(1.0, bronze, { ws: 8, hs: 4, y: 1.0, hex2: 0xead8b0 }),
        cyl(1.02, 1.02, 0.2, 8, 0x8a6a30, { y: 1.6, open: true }),
        cyl(0.92, 0.92, 0.1, 8, 0xc8b89a, { y: 1.62, open: true }),
        cyl(0.12, 0.16, 0.7, 5, bronze, { y: 0.35, z: 0.7 }),
        cyl(0.12, 0.16, 0.7, 5, bronze, { y: 0.35, x: -0.6, z: -0.4 }),
        cyl(0.12, 0.16, 0.7, 5, bronze, { y: 0.35, x: 0.6, z: -0.4 }),
        torus(0.28, 0.07, 4, 5, bronze, { x: -1.0, y: 1.7 }),
        torus(0.28, 0.07, 4, 5, bronze, { x: 1.0, y: 1.7 }),
        cyl(0.1, 0.12, 1.6, 5, bronze, { x: -1.05, y: 1.0 }),
        cyl(0.1, 0.12, 1.6, 5, bronze, { x: 1.05, y: 1.0 }),
        cone(0.5, 0.5, 6, 0xc83020, { y: 2.0 }),
        cyl(0.06, 0.06, 0.3, 5, 0xf0c020, { y: 2.35 }),
        cyl(0.018, 0.018, 0.8, 4, 0xc4281f, { y: 2.0, x: 0.2, z: 0.1 }),
        cyl(0.018, 0.018, 0.8, 4, 0xc4281f, { y: 2.0, x: -0.18, z: 0.2 }),
        cyl(0.018, 0.018, 0.8, 4, 0xc4281f, { y: 2.0, x: 0.0, z: -0.2 }),
      ]);
    },
  },
];

export default T2_ARCHETYPES;
