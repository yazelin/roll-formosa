/**
 * @file packs/taitung/archetypes/t3.js — Roll Formosa Taitung pack, Tier 3
 * (伯朗大道 / Brown Avenue rice-paddy countryside). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色田野 藍紫起調 (dusk countryside, blue-purple onset) — but each
 * object keeps its own true-to-life Taitung countryside colors.
 *
 * Slots [0..7] absorbable countryside objects; slots [8..9] (池上飯包小屋 / 稻田觀景台)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T3_ARCHETYPES = [
  /* 0 ── 機車 scooter ─────────────────────────────────────────────────── */
  {
    id: 'scooter',
    displayName: '機車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x2b2f4a, 0xc4203a, 0xe8e8ee, 0x1a1c2a, 0x7a8090],
    yOffset: -0.33,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const body = rng() < 0.5 ? 0xc4203a : 0x2f6db0; // red or blue scooter
      const parts = [];
      // floorboard / step-through deck
      parts.push(box(1.5, 0.12, 0.5, 0x1a1c2a, { x: 0, y: 0.32 }));
      // rear body / seat hump
      parts.push(box(0.9, 0.45, 0.46, body, { x: 0.45, y: 0.62 }));
      parts.push(box(0.72, 0.16, 0.42, 0x14151f, { x: 0.42, y: 0.9 })); // seat
      // front leg-shield rising to handlebars
      parts.push(box(0.34, 0.95, 0.44, body, { x: -0.62, y: 0.72 }));
      // headlight nacelle
      parts.push(box(0.22, 0.26, 0.4, 0xe8e8ee, { x: -0.78, y: 1.12 }));
      // handlebars
      parts.push(cyl(0.035, 0.035, 0.62, 6, 0x7a8090, { x: -0.74, y: 1.32, rx: HALF_PI }));
      // mirror stalks
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: 0.3, ws: 6, hs: 4 }));
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: -0.3, ws: 6, hs: 4 }));
      // two wheels
      const wheel = (wx) => [
        cyl(0.3, 0.3, 0.16, 10, 0x14151f, { x: wx, y: 0.3, rx: HALF_PI }),
        cyl(0.13, 0.13, 0.17, 8, 0x7a8090, { x: wx, y: 0.3, rx: HALF_PI }),
      ];
      parts.push(...wheel(-0.66));
      parts.push(...wheel(0.66));
      return finish(parts);
    },
  },

  /* 1 ── 小貨車 mini truck (blue Kei-style pickup) ─────────────────────── */
  {
    id: 'mini_truck',
    displayName: '小貨車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.6,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xd8dde4, 0x1a1c2a, 0x9aa0ac, 0x3a3f52],
    yOffset: -0.61,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const cab = rng() < 0.5 ? 0x2f6db0 : 0xd8dde4;
      const parts = [];
      // flatbed deck
      parts.push(box(2.0, 0.22, 1.0, 0x9aa0ac, { x: 0.35, y: 0.55 }));
      // bed side rails
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: 0.47 }));
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: -0.47 }));
      parts.push(box(0.06, 0.3, 1.0, 0x7d828e, { x: 1.32, y: 0.78 })); // tailgate
      // cab
      parts.push(box(0.85, 0.7, 1.0, cab, { x: -0.95, y: 0.85 }));
      // windshield
      parts.push(box(0.06, 0.42, 0.86, 0x1a2330, { x: -0.55, y: 1.0 }));
      // front bumper
      parts.push(box(0.18, 0.4, 1.02, 0x3a3f52, { x: -1.42, y: 0.55 }));
      // headlights
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: 0.34 }));
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: -0.34 }));
      // 4 wheels
      const wheel = (wx, wz) => cyl(0.28, 0.28, 0.18, 10, 0x14151f, { x: wx, y: 0.28, z: wz, rx: HALF_PI });
      parts.push(wheel(-0.9, 0.52), wheel(-0.9, -0.52), wheel(0.9, 0.52), wheel(0.9, -0.52));
      return finish(parts);
    },
  },

  /* 2 ── 伯朗大道路標 Brown Avenue road sign ──────────────────────────── */
  {
    id: 'brown_avenue_sign',
    displayName: '伯朗大道路標',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x7a4a24, 0x5e3818, 0xf0e8d0, 0x2a8a4a, 0xe8d8b0],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const wood = 0x7a4a24;
      const parts = [];
      // upright wooden post
      parts.push(cyl(0.12, 0.14, 2.4, 6, wood, { y: 1.2, hex2: 0x5e3818 }));
      // horizontal arm bracket
      parts.push(box(1.2, 0.1, 0.1, wood, { y: 2.1, x: 0.4 }));
      // main sign board
      parts.push(box(1.0, 0.6, 0.08, 0xf0e8d0, { x: 0.4, y: 1.7, hex2: 0xe8d8b0 }));
      // sign frame
      parts.push(box(1.1, 0.08, 0.12, wood, { x: 0.4, y: 2.0 }));
      parts.push(box(1.1, 0.08, 0.12, wood, { x: 0.4, y: 1.4 }));
      // green text/logo area
      parts.push(box(0.8, 0.35, 0.04, 0x2a8a4a, { x: 0.4, y: 1.72, z: 0.05 }));
      // small directional arrow
      parts.push(cone(0.15, 0.25, 4, 0x7a4a24, { x: 0.85, y: 1.7, rz: -HALF_PI }));
      // base stone
      parts.push(box(0.5, 0.25, 0.5, 0x8a8278, { y: 0.12 }));
      return finish(parts);
    },
  },

  /* 3 ── 稻田棧道 paddy boardwalk (wooden walkway through rice fields) ── */
  {
    id: 'paddy_boardwalk',
    displayName: '稻田棧道',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6a42, 0x6a4a22, 0xc8b878, 0x4a8a3a, 0x3a7a2a],
    yOffset: -0.6,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const wood = 0x8a6a42;
      const parts = [];
      // wooden plank deck
      for (let i = 0; i < 6; i++) {
        parts.push(box(0.3, 0.08, 1.4, wood, { x: -0.75 + i * 0.3, y: 0.7, hex2: 0x6a4a22 }));
      }
      // side rails
      parts.push(box(2.0, 0.08, 0.08, wood, { y: 1.1, z: 0.65 }));
      parts.push(box(2.0, 0.08, 0.08, wood, { y: 1.1, z: -0.65 }));
      // rail posts
      for (const x of [-0.8, 0, 0.8]) {
        parts.push(cyl(0.05, 0.05, 0.5, 5, wood, { x, y: 0.9, z: 0.65 }));
        parts.push(cyl(0.05, 0.05, 0.5, 5, wood, { x, y: 0.9, z: -0.65 }));
      }
      // support posts going into the water/paddy
      parts.push(cyl(0.08, 0.1, 0.9, 6, 0x6a4a22, { x: -0.7, y: 0.35 }));
      parts.push(cyl(0.08, 0.1, 0.9, 6, 0x6a4a22, { x: 0.7, y: 0.35 }));
      // hint of rice plants below
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.15, 0.4, 0.1, 0x4a8a3a, { x: -0.9 + i * 0.6, y: 0.2, z: 0.9, hex2: 0x3a7a2a }));
      }
      return finish(parts);
    },
  },

  /* 4 ── 金城武樹 Takeshi Kaneshiro tree (famous lone tree) ───────────── */
  {
    id: 'takeshi_tree_small',
    displayName: '金城武樹',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.4,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a3d28, 0x4a8a3a, 0x3a7a2a, 0x6aba5a, 0x7a5a3a],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const parts = [];
      // trunk
      parts.push(cyl(0.2, 0.3, 1.5, 7, 0x5a3d28, { y: 0.75, hex2: 0x7a5a3a }));
      // main branches spreading wide
      parts.push(cyl(0.12, 0.16, 1.0, 6, 0x6a4a2c, { x: -0.5, y: 1.6, rz: 0.5 }));
      parts.push(cyl(0.12, 0.16, 1.0, 6, 0x6a4a2c, { x: 0.5, y: 1.6, rz: -0.5 }));
      parts.push(cyl(0.1, 0.14, 0.8, 6, 0x6a4a2c, { y: 1.9, rz: 0 }));
      // broad, iconic canopy (distinctive shape of the lone tree)
      const leafColors = [0x4a8a3a, 0x3a7a2a, 0x5a9a4a];
      const blobs = [
        [0, 2.4, 0, 1.1],
        [0.9, 2.2, 0.3, 0.7],
        [-0.9, 2.3, -0.2, 0.72],
        [0.4, 2.6, -0.5, 0.6],
        [-0.4, 2.5, 0.55, 0.62],
        [0.0, 2.8, 0.0, 0.55],
      ];
      for (let i = 0; i < blobs.length; i++) {
        const [bx, by, bz, br] = blobs[i];
        const c = leafColors[i % leafColors.length];
        parts.push(sph(br, c, { x: bx, y: by, z: bz, ws: 6, hs: 4, hex2: 0x6aba5a }));
      }
      return finish(parts);
    },
  },

  /* 5 ── 稻草人 scarecrow in the rice field ──────────────────────────── */
  {
    id: 'scarecrow',
    displayName: '稻草人',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8b878, 0x8a6a42, 0x3a7a2a, 0xd8483a, 0x4a4a48],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const straw = 0xc8b878;
      const parts = [];
      // wooden cross pole
      parts.push(cyl(0.08, 0.1, 2.5, 6, 0x8a6a42, { y: 1.25 }));
      parts.push(box(1.6, 0.1, 0.1, 0x8a6a42, { y: 1.9 })); // arms
      // straw head
      parts.push(sph(0.35, straw, { ws: 7, hs: 5, y: 2.5, hex2: 0xd8c888 }));
      // hat
      parts.push(cone(0.45, 0.4, 8, 0x5a4a3a, { y: 2.9 }));
      parts.push(cyl(0.5, 0.5, 0.08, 8, 0x5a4a3a, { y: 2.72 }));
      // face
      parts.push(sph(0.06, 0x4a4a48, { ws: 4, hs: 3, x: -0.12, y: 2.55, z: 0.3 })); // eye
      parts.push(sph(0.06, 0x4a4a48, { ws: 4, hs: 3, x: 0.12, y: 2.55, z: 0.3 })); // eye
      parts.push(box(0.15, 0.06, 0.08, 0xd8483a, { y: 2.42, z: 0.32 })); // mouth
      // straw body/shirt
      parts.push(box(0.5, 0.8, 0.3, 0xd8483a, { y: 1.5 }));
      // straw tufts sticking out
      parts.push(box(0.3, 0.2, 0.25, straw, { x: -0.8, y: 1.9 }));
      parts.push(box(0.3, 0.2, 0.25, straw, { x: 0.8, y: 1.9 }));
      parts.push(box(0.25, 0.3, 0.2, straw, { y: 1.0 }));
      return finish(parts);
    },
  },

  /* 6 ── 大片稻田 paddy field section ─────────────────────────────────── */
  {
    id: 'paddy_field',
    displayName: '大片稻田',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a9a3a, 0x4a8a2a, 0x6aba4a, 0xc8b878, 0x8ab85a],
    yOffset: -0.85,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // muddy water base
      parts.push(box(2.8, 0.15, 2.2, 0x7a6a4a, { y: 0.08, hex2: 0x5a4a2a }));
      // rice plant rows - reduced to 3x5=15 plants
      for (let row = 0; row < 3; row++) {
        const z = -0.7 + row * 0.7;
        for (let col = 0; col < 5; col++) {
          const x = -1.0 + col * 0.5;
          const green = [0x5a9a3a, 0x4a8a2a, 0x6aba4a][(row + col) % 3];
          parts.push(box(0.1, 0.5, 0.1, green, { x, y: 0.4, z, hex2: 0x8ab85a }));
        }
      }
      // raised paddy dike/berm
      parts.push(box(2.9, 0.2, 0.15, 0x8a7a5a, { y: 0.2, z: 1.1 }));
      parts.push(box(2.9, 0.2, 0.15, 0x8a7a5a, { y: 0.2, z: -1.1 }));
      return finish(parts);
    },
  },

  /* 7 ── 田邊水牛 water buffalo by the paddy ──────────────────────────── */
  {
    id: 'water_buffalo',
    displayName: '田邊水牛',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x3a3a38, 0x4a4a48, 0x2a2a28, 0x5a5a58, 0x8a7a6a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const body = 0x3a3a38;
      const parts = [];
      // massive barrel body
      parts.push(sph(0.9, body, { ws: 6, hs: 5, sx: 1.5, y: 1.0, hex2: 0x4a4a48 }));
      // head (larger to include ears implicitly)
      parts.push(sph(0.5, body, { ws: 5, hs: 4, x: 1.2, y: 1.1, hex2: 0x2a2a28 }));
      // muzzle
      parts.push(box(0.35, 0.28, 0.3, 0x5a5a58, { x: 1.55, y: 0.95 }));
      // curved horns
      parts.push(cyl(0.08, 0.05, 0.6, 4, 0x8a7a6a, { x: 1.1, y: 1.4, z: 0.35, rz: -0.5, rx: 0.8 }));
      parts.push(cyl(0.08, 0.05, 0.6, 4, 0x8a7a6a, { x: 1.1, y: 1.4, z: -0.35, rz: -0.5, rx: -0.8 }));
      // legs (box instead of cylinder)
      parts.push(box(0.2, 0.7, 0.2, body, { x: 0.6, y: 0.35, z: 0.35 }));
      parts.push(box(0.2, 0.7, 0.2, body, { x: 0.6, y: 0.35, z: -0.35 }));
      parts.push(box(0.2, 0.7, 0.2, body, { x: -0.5, y: 0.35, z: 0.35 }));
      parts.push(box(0.2, 0.7, 0.2, body, { x: -0.5, y: 0.35, z: -0.35 }));
      // tail
      parts.push(cyl(0.04, 0.03, 0.5, 4, body, { x: -1.1, y: 0.9, rz: 0.6 }));
      return finish(parts);
    },
  },

  /* 8 ── 池上飯包小屋 Chishang bento hut (CHUNK LANDMARK) ─────────────── */
  {
    id: 'chishang_bento_hut',
    displayName: '池上飯包小屋',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a6a42, 0x6a4a22, 0xc04030, 0xf0e8d0, 0x4a8a3a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const wood = 0x8a6a42;
      const parts = [];
      // wooden hut body
      parts.push(box(2.2, 1.5, 1.8, wood, { y: 0.85, hex2: 0x6a4a22 }));
      // traditional pitched roof
      parts.push(box(2.6, 0.12, 1.1, 0x5a4a3a, { y: 1.85, z: 0.55, rx: -0.4 }));
      parts.push(box(2.6, 0.12, 1.1, 0x5a4a3a, { y: 1.85, z: -0.55, rx: 0.4 }));
      parts.push(box(2.6, 0.1, 0.15, 0x4a3a2a, { y: 2.1 })); // ridge
      // front opening/window
      parts.push(box(1.0, 0.8, 0.1, 0x2a2a28, { y: 0.75, z: 0.92 }));
      // counter
      parts.push(box(1.4, 0.1, 0.4, wood, { y: 0.5, z: 1.0 }));
      // sign above entrance
      parts.push(box(1.2, 0.4, 0.08, 0xf0e8d0, { y: 1.45, z: 0.95, hex2: 0xe0d8c0 }));
      parts.push(box(0.9, 0.25, 0.04, 0xc04030, { y: 1.45, z: 0.98 })); // red text area
      // bento boxes on counter
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.25, 0.15, 0.3, 0x8a5a32, { x: -0.4 + i * 0.4, y: 0.65, z: 1.1 }));
      }
      // small tree/plant beside
      parts.push(cyl(0.06, 0.08, 0.6, 5, 0x5a4a3a, { x: 1.4, y: 0.3 }));
      parts.push(sph(0.35, 0x4a8a3a, { ws: 6, hs: 4, x: 1.4, y: 0.75 }));
      return finish(parts);
    },
  },

  /* 9 ── 稻田觀景台 paddy viewpoint platform (CHUNK LANDMARK) ─────────── */
  {
    id: 'paddy_viewpoint',
    displayName: '稻田觀景台',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a6a42, 0x6a4a22, 0x4a8a3a, 0xc8b878, 0x5a9a3a],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const wood = 0x8a6a42;
      const parts = [];
      // raised platform
      parts.push(box(2.0, 0.15, 2.0, wood, { y: 1.8, hex2: 0x6a4a22 }));
      // four support posts (box instead of cylinder)
      for (const [px, pz] of [[-0.8, 0.8], [0.8, 0.8], [-0.8, -0.8], [0.8, -0.8]]) {
        parts.push(box(0.2, 1.8, 0.2, wood, { x: px, y: 0.9, z: pz }));
      }
      // cross brace
      parts.push(box(1.8, 0.1, 0.08, 0x6a4a22, { y: 1.0, z: 0.8 }));
      // railing around platform (front and back only)
      parts.push(box(2.1, 0.08, 0.06, wood, { y: 2.5, z: 0.95 }));
      parts.push(box(2.1, 0.08, 0.06, wood, { y: 2.5, z: -0.95 }));
      // corner railing posts (box instead of cylinder)
      parts.push(box(0.06, 0.7, 0.06, wood, { x: -0.85, y: 2.15, z: 0.95 }));
      parts.push(box(0.06, 0.7, 0.06, wood, { x: 0.85, y: 2.15, z: 0.95 }));
      // stairs (3 steps instead of 4)
      for (let s = 0; s < 3; s++) {
        parts.push(box(0.6, 0.14, 0.4, wood, { x: -1.3, y: 0.4 + s * 0.5, z: -0.2 + s * 0.3 }));
      }
      // info sign on platform
      parts.push(box(0.5, 0.6, 0.06, 0xf0e8d0, { y: 2.4, z: 0.5 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
