/**
 * @file packs/yunlin/archetypes/t1.js — T1 西螺老街夜市 (Xiluo old street night market items).
 *
 * Tier 1 of the Roll Formosa Yunlin ladder (西螺夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/yunlin/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (老街拱門 / 攤車, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band (radiusNominal, REAL meters): 0.05–0.25 m.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] soy_sauce_bottle 西螺醬油瓶 — dark soy sauce bottle w/ red cap */
  /* ---------------------------------------------------------------- */
  {
    id: 'soy_sauce_bottle',
    displayName: '西螺醬油瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2a1a10, 0x3a2818, 0x1a0c06, 0x4a3020],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Base of bottle
        cyl(0.5, 0.55, 0.2, 9, 0x2a1a10, { y: 0.1 }),
        // Main body - dark brown soy sauce bottle
        cyl(0.55, 0.55, 1.2, 9, 0x1a0c06, { y: 0.8, hex2: 0x2a1a10 }),
        // Shoulder taper
        cyl(0.35, 0.55, 0.3, 9, 0x2a1a10, { y: 1.55 }),
        // Neck
        cyl(0.28, 0.32, 0.3, 8, 0x2a1a10, { y: 1.82 }),
        // Red plastic cap (iconic)
        cyl(0.34, 0.34, 0.25, 8, 0xc83828, { y: 2.08 }),
        cyl(0.3, 0.3, 0.06, 8, 0xd84838, { y: 2.22 }),
        // Label band
        cyl(0.58, 0.58, 0.4, 8, 0xf0d8a0, { y: 0.7, open: true }),
        box(0.5, 0.25, 0.06, 0xc83828, { y: 0.7, z: 0.58 }), // brand name area
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] rice_bowl_cake 碗粿 — steamed rice cake in a small bowl       */
  /* ---------------------------------------------------------------- */
  {
    id: 'rice_bowl_cake',
    displayName: '碗粿',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe8dcc8, 0xf8f0e0, 0xd8c8b0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Small ceramic bowl
        cyl(0.75, 0.6, 0.5, 10, 0xf8f8f4, { y: 0.25 }),
        cyl(0.5, 0.5, 0.1, 10, 0xe8e4dc, { y: 0.02 }), // foot ring
        // Steamed rice cake filling (slightly domed, off-white)
        sph(0.72, 0xffffff, { ws: 8, hs: 4, sy: 0.4, y: 0.55, thetaLen: HALF_PI }),
        // Sauce drizzle on top
        box(0.5, 0.04, 0.08, 0x6a4020, { y: 0.72, z: 0.1 }),
        box(0.08, 0.04, 0.4, 0x6a4020, { y: 0.72, x: 0.1 }),
        // Toppings - minced pork bits
        sph(0.08, 0x8a5a3a, { ws: 5, hs: 3, x: 0.2, y: 0.76, z: 0.15 }),
        sph(0.07, 0x8a5a3a, { ws: 5, hs: 3, x: -0.15, y: 0.74, z: -0.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] nine_layer_cake 九層粿 — layered steamed rice cake             */
  /* ---------------------------------------------------------------- */
  {
    id: 'nine_layer_cake',
    displayName: '九層粿',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xe8b8a0, 0xf0c8b0, 0xd8a890, 0xf8d8c0],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [];
      // Nine alternating colored layers
      const colors = [0xf0d8c0, 0xd85040, 0xf0d8c0, 0xd85040, 0xf0d8c0, 0xd85040, 0xf0d8c0, 0xd85040, 0xf0d8c0];
      for (let i = 0; i < 9; i++) {
        parts.push(box(1.2, 0.11, 1.2, colors[i], { y: 0.06 + i * 0.11 }));
      }
      // Slight dome on top layer
      parts.push(sph(0.5, 0xf0d8c0, { ws: 6, hs: 3, sy: 0.2, y: 1.05, thetaLen: HALF_PI }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] mochi_ball 麻糬 — soft glutinous rice ball with peanut powder */
  /* ---------------------------------------------------------------- */
  {
    id: 'mochi_ball',
    displayName: '麻糬',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.04,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xf0ece0, 0xe8e0d0, 0xffffff],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Soft mochi ball - slightly flattened sphere
        sph(0.8, 0xffffff, { ws: 9, hs: 7, sy: 0.7 }),
        // Peanut powder coating (tan speckles around the surface)
        cyl(0.85, 0.85, 0.15, 8, 0xd8b878, { y: -0.25, open: true }),
        // A few peanut powder clumps
        sph(0.12, 0xc8a058, { ws: 4, hs: 3, x: 0.5, y: 0.2, z: 0.3 }),
        sph(0.1, 0xc8a058, { ws: 4, hs: 3, x: -0.4, y: 0.15, z: -0.4 }),
        sph(0.11, 0xc8a058, { ws: 4, hs: 3, x: 0.2, y: 0.3, z: -0.5 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] meatball 肉圓 — Taiwanese meatball with translucent skin      */
  /* ---------------------------------------------------------------- */
  {
    id: 'meatball',
    displayName: '肉圓',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.045,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8d8c0, 0xf0e0cc, 0xd8c8b0, 0xf8e8d8],
    yOffset: -0.30,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Translucent outer skin - slightly dome-shaped
        sph(0.9, 0xffffff, { ws: 10, hs: 7, sy: 0.75, hex2: 0xf8f0e0 }),
        // Meat filling visible through skin (darker center)
        sph(0.65, 0x9a6a4a, { ws: 7, hs: 5, sy: 0.6, y: -0.05 }),
        // Sweet sauce on top
        cyl(0.4, 0.5, 0.08, 8, 0x8a4020, { y: 0.45, open: true }),
        box(0.6, 0.05, 0.15, 0x6a3018, { y: 0.5, rz: 0.3 }),
        // Cilantro garnish
        sph(0.1, 0x4a8a3a, { ws: 4, hs: 3, x: 0.25, y: 0.55, z: 0.1 }),
        sph(0.08, 0x4a8a3a, { ws: 4, hs: 3, x: 0.15, y: 0.52, z: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] spring_roll 春捲 — crispy fried spring roll                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'spring_roll',
    displayName: '春捲',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8a060, 0xc89050, 0xe8b070, 0xb88040],
    yOffset: -0.70,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Crispy golden roll body (cylindrical)
        cyl(0.38, 0.38, 2.2, 8, 0xffffff, { rz: HALF_PI, hex2: 0xe8c080 }),
        // Wrapper texture - spiral ridges
        cyl(0.4, 0.4, 0.08, 8, 0xd8a050, { rz: HALF_PI, x: -0.6 }),
        cyl(0.4, 0.4, 0.08, 8, 0xd8a050, { rz: HALF_PI, x: 0.0 }),
        cyl(0.4, 0.4, 0.08, 8, 0xd8a050, { rz: HALF_PI, x: 0.6 }),
        // Sealed ends
        sph(0.36, 0xc88840, { ws: 6, hs: 4, x: -1.12, sx: 0.3 }),
        sph(0.36, 0xc88840, { ws: 6, hs: 4, x: 1.12, sx: 0.3 }),
        // Slight browning spots
        sph(0.12, 0xa87030, { ws: 4, hs: 3, x: 0.3, y: 0.25, z: 0.2 }),
        sph(0.1, 0xa87030, { ws: 4, hs: 3, x: -0.5, y: 0.2, z: -0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] redwhite_bag 紅白塑膠袋 — knotted red-and-white plastic carrier bag */
  /* ---------------------------------------------------------------- */
  {
    id: 'redwhite_bag',
    displayName: '紅白塑膠袋',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.13,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e4de, 0xd83a34, 0xf4f0ea, 0xc23028, 0xeceae4],
    yOffset: -0.1822,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // bulging white bag body — fuller at the bottom where the goods sit
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        // BOLD red/white horizontal stripes (classic 紅白條紋) — wide bands
        // standing slightly proud of the body so they read as stripes, not rings
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        // gathered white neck pinching up to the handles
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        // two upright red vest-loop handles
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] peanut_candy 花生糖 — Yunlin's famous peanut brittle squares  */
  /* ---------------------------------------------------------------- */
  {
    id: 'peanut_candy',
    displayName: '花生糖',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc89858, 0xd8a868, 0xb88848, 0xe8b878],
    yOffset: -0.58,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // Main candy block - rectangular with rounded edges
        box(1.4, 0.5, 1.0, 0xffffff, { y: 0.25 }),
      ];
      // Peanut pieces embedded in the candy (visible bumps)
      const peanuts = [
        [-0.4, 0.35, 0.25], [0.3, 0.38, -0.2], [-0.2, 0.32, -0.35],
        [0.45, 0.36, 0.3], [-0.5, 0.34, -0.1], [0.1, 0.40, 0.4],
        [0.5, 0.33, -0.35], [-0.35, 0.37, 0.4], [0.25, 0.35, 0.0],
      ];
      for (const [px, py, pz] of peanuts) {
        parts.push(sph(0.12, 0xd8b068, { ws: 5, hs: 4, x: px, y: py, z: pz, sy: 0.7 }));
      }
      // Golden caramelized surface sheen
      parts.push(box(1.42, 0.04, 1.02, 0xe8c078, { y: 0.52 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 西螺老街拱門 Xiluo Old Street arch            */
  /* ---------------------------------------------------------------- */
  {
    id: 'xiluo_oldstreet_arch',
    displayName: '西螺老街拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xb8442a, 0xd85a3a, 0xf0c040, 0x8a3020, 0xf8e8c0],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [
        // Two brick pillars
        box(0.5, 3.0, 0.5, 0xb84428, { x: -1.8, y: 1.5, hex2: 0xc85438 }),
        box(0.5, 3.0, 0.5, 0xb84428, { x: 1.8, y: 1.5, hex2: 0xc85438 }),
        // Pillar bases
        box(0.65, 0.3, 0.65, 0x8a6050, { x: -1.8, y: 0.15 }),
        box(0.65, 0.3, 0.65, 0x8a6050, { x: 1.8, y: 0.15 }),
        // Pillar caps
        box(0.6, 0.2, 0.6, 0xf0c040, { x: -1.8, y: 3.1 }),
        box(0.6, 0.2, 0.6, 0xf0c040, { x: 1.8, y: 3.1 }),
        // Arch beam (curved torus arc)
        torus(1.85, 0.25, 4, 8, 0xd85838, { y: 3.0, arc: PI }),
        // Banner / signboard
        box(3.2, 0.7, 0.15, 0xf8e8c0, { y: 3.7 }),
        box(3.0, 0.5, 0.08, 0xc83020, { y: 3.7, z: 0.08 }), // text panel
        // Decorative elements
        box(3.4, 0.12, 0.2, 0xf0c040, { y: 4.02 }), // top gold trim
        box(3.4, 0.12, 0.2, 0xf0c040, { y: 3.38 }), // bottom gold trim
      ];
      // Hanging lanterns
      for (let i = 0; i < 4; i++) {
        const lx = -1.2 + i * 0.8;
        const c = i % 2 === 0 ? 0xd83030 : 0xf0c030;
        parts.push(sph(0.15, c, { x: lx, y: 2.6, ws: 6, hs: 4 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 攤車 food stall cart                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'food_stall',
    displayName: '攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xb5712f, 0xcf8b3f, 0x9a5a24, 0xe0b85a, 0xd83a34],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [
        // Cart body - wooden cabinet
        box(2.0, 0.9, 1.1, 0x9a7a52, { y: 0.7 }),
        // Counter / stainless top
        box(2.15, 0.08, 1.2, 0xd8dce2, { y: 1.2 }),
        // Glass display case at back
        box(2.0, 0.5, 0.06, 0xbfd8e0, { y: 1.5, z: -0.52 }),
        box(2.0, 0.5, 0.06, 0x2a3038, { y: 1.5, z: -0.55 }), // dark backing
        // Front signboard
        box(2.0, 0.45, 0.06, 0xffffff, { y: 0.65, z: 0.56 }),
        // Menu sign
        box(1.5, 0.3, 0.04, 0xc83020, { y: 0.95, z: 0.58 }),
        // Roof posts
        cyl(0.05, 0.05, 1.0, 5, 0x8a6a40, { x: -0.9, y: 1.75, z: 0.45 }),
        cyl(0.05, 0.05, 1.0, 5, 0x8a6a40, { x: 0.9, y: 1.75, z: 0.45 }),
        cyl(0.05, 0.05, 1.0, 5, 0x8a6a40, { x: -0.9, y: 1.75, z: -0.45 }),
        cyl(0.05, 0.05, 1.0, 5, 0x8a6a40, { x: 0.9, y: 1.75, z: -0.45 }),
        // Striped awning roof
        box(2.3, 0.1, 1.4, 0xd83a34, { y: 2.3 }),
        box(2.3, 0.06, 0.25, 0xf8f8f0, { y: 2.25, z: 0.5 }),
        box(2.3, 0.06, 0.25, 0xf8f8f0, { y: 2.25, z: -0.5 }),
        // Wheels
        cyl(0.25, 0.25, 0.12, 8, 0x2e3138, { rx: HALF_PI, x: -0.8, y: 0.25, z: 0 }),
        cyl(0.25, 0.25, 0.12, 8, 0x2e3138, { rx: HALF_PI, x: 0.8, y: 0.25, z: 0 }),
        // Hanging lamp
        sph(0.15, 0xffd06a, { ws: 6, hs: 4, x: 0.6, y: 2.0, z: 0.4 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
