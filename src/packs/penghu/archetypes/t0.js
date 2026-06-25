/**
 * @file packs/penghu/archetypes/t0.js — Roll Formosa Penghu pack, TIER 0
 *   漁村柑仔店 (fishing village corner store), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/penghu/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 戳戳樂板 / 籤筒, spawnWeight ~0.3).
 *
 * Authored ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T0_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] coral_bead 珊瑚珠 — Penghu red coral bead trinket               */
  /* ---------------------------------------------------------------- */
  {
    id: 'coral_bead',
    displayName: '珊瑚珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd83040, 0xc82838, 0xe84050, 0xf05060, 0xb82030],
    yOffset: 0,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // red coral bead body with natural coral texture
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }),
        // natural coral grain patterns
        cyl(0.08, 0.08, 1.8, 4, 0xf8c0b0, { rz: 0.3, y: 0.1 }),
        cyl(0.06, 0.06, 1.5, 4, 0xf8d0c0, { rz: -0.4, ry: HALF_PI }),
        // through-hole for stringing
        cyl(0.12, 0.12, 2.2, 6, 0x2a2024, { y: 0, open: true }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] windlion_charm 風獅爺吊飾 — tiny Penghu windlion guardian charm */
  /* ---------------------------------------------------------------- */
  {
    id: 'windlion_charm',
    displayName: '風獅爺吊飾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8a868, 0xb89858, 0xd4b878, 0xe0c088, 0xa88848],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      return finish([
        // body base (seated lion form)
        cyl(0.5, 0.6, 0.8, 6, 0xffffff, { y: 0.4 }),
        // rounded back
        sph(0.48, 0xffffff, { ws: 6, hs: 4, thetaLen: HALF_PI, y: 0.8 }),
        // head
        sph(0.36, 0xffffff, { ws: 6, hs: 4, y: 1.1 }),
        // mane ridge
        cyl(0.32, 0.38, 0.16, 6, 0xffffff, { y: 1.0 }),
        // two ears
        cone(0.1, 0.14, 4, 0xffffff, { x: -0.22, y: 1.35, rz: -0.2 }),
        cone(0.1, 0.14, 4, 0xffffff, { x: 0.22, y: 1.35, rz: 0.2 }),
        // snout
        box(0.14, 0.1, 0.12, 0xffffff, { y: 1.05, z: 0.3 }),
        // eyes (dark)
        sph(0.04, 0x2a2820, { ws: 4, hs: 3, x: -0.12, y: 1.15, z: 0.26 }),
        sph(0.04, 0x2a2820, { ws: 4, hs: 3, x: 0.12, y: 1.15, z: 0.26 }),
        // hanging loop
        torus(0.12, 0.03, 4, 6, 0xc8a060, { y: 1.55 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] fish_hook 魚鉤 — Penghu fishing hook with barb                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'fish_hook',
    displayName: '魚鉤',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8ccd4, 0xb8bcc4, 0xd8dce4, 0xa8acb4, 0xe8ecf4],
    yOffset: -0.15,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // hook shank (straight part)
        cyl(0.12, 0.1, 1.4, 6, 0xffffff, { y: 0.7 }),
        // hook eye (loop at top)
        torus(0.18, 0.06, 4, 6, 0xffffff, { y: 1.5 }),
        // hook bend (curved part using quarter torus)
        torus(0.5, 0.1, 4, 8, 0xffffff, { y: -0.1, ry: HALF_PI, theta0: 0, thetaLen: PI * 0.7 }),
        // barb point
        cone(0.08, 0.3, 4, 0xffffff, { rz: 0.3, x: 0.3, y: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] seashell 貝殼 — Penghu beach shell                              */
  /* ---------------------------------------------------------------- */
  {
    id: 'seashell',
    displayName: '貝殼',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe8d8c8, 0xf4ece0, 0xd8c8b8],
    yOffset: -0.7,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        sph(0.8, 0xffffff, { ws: 8, hs: 5, sx: 1.3, sy: 0.5, y: 0.3, hex2: 0xe0d0c0 }),
        sph(0.3, 0xf0c8c0, { ws: 6, hs: 3, x: -0.3, y: 0.25, z: 0.15 }),
        cyl(0.15, 0.3, 0.2, 6, 0xe8d8c8, { x: 0.4, y: 0.25, rz: 0.3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] cactus_candy 仙人掌糖 — Penghu prickly pear candy               */
  /* ---------------------------------------------------------------- */
  {
    id: 'cactus_candy',
    displayName: '仙人掌糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd83890, 0xc82878, 0xe848a0, 0xb81868],
    yOffset: -0.49,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        sph(0.9, 0xffffff, { ws: 10, hs: 7, x: 0.0, sx: 1.25 }),
        torus(0.62, 0.16, 6, 10, 0xffffff, { ry: HALF_PI, x: 0.0 }),
        cone(0.5, 0.7, 8, 0xfff0f4, { rz: -HALF_PI, x: 1.15 }),
        cone(0.5, 0.7, 8, 0xfff0f4, { rz: HALF_PI, x: -1.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] stone_tablet 石敢當小牌 — miniature Penghu stone tablet amulet   */
  /* ---------------------------------------------------------------- */
  {
    id: 'stone_tablet',
    displayName: '石敢當小牌',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xa89880, 0x988870, 0xb8a890, 0xc8b8a0, 0x887860],
    yOffset: -0.72,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // stone tablet body (rectangular upright)
        box(0.9, 1.6, 0.25, 0xffffff, { y: 0.8 }),
        // top cap (traditional rounded/peaked)
        box(0.95, 0.2, 0.28, 0xffffff, { y: 1.65 }),
        sph(0.35, 0xffffff, { ws: 6, hs: 4, thetaLen: HALF_PI, y: 1.75 }),
        // carved "石敢當" characters (represented by relief lines)
        box(0.6, 0.12, 0.04, 0x5a4a3a, { y: 1.2, z: 0.14 }),
        box(0.6, 0.12, 0.04, 0x5a4a3a, { y: 0.95, z: 0.14 }),
        box(0.6, 0.12, 0.04, 0x5a4a3a, { y: 0.7, z: 0.14 }),
        // base platform
        box(1.0, 0.12, 0.35, 0x9a8a78, { y: 0.06 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] dried_squid_snack 小卷乾 — Penghu dried squid snack strip       */
  /* ---------------------------------------------------------------- */
  {
    id: 'dried_squid_snack',
    displayName: '小卷乾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xd8a878, 0xc89868, 0xe8b888, 0xb88858, 0xf0c898],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // dried squid body (elongated, flat, slightly curled)
        box(2.2, 0.18, 0.6, 0xffffff, { rz: 0.05, x: -0.1 }),
        // tapered tail end
        box(0.8, 0.14, 0.4, 0xffffff, { x: 1.3, rz: 0.1 }),
        cone(0.2, 0.5, 4, 0xffffff, { rz: -HALF_PI, x: 1.85 }),
        // head end (wider)
        box(0.6, 0.16, 0.7, 0xffffff, { x: -1.2 }),
        // tentacle hints
        cyl(0.06, 0.04, 0.4, 4, 0xffffff, { rz: HALF_PI, x: -1.6, z: 0.15 }),
        cyl(0.06, 0.04, 0.4, 4, 0xffffff, { rz: HALF_PI, x: -1.6, z: -0.15 }),
        // surface texture ridges
        box(0.1, 0.04, 0.55, 0xe0c090, { x: 0.3 }),
        box(0.1, 0.04, 0.55, 0xe0c090, { x: -0.3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] shell_button 貝殼釦 — Penghu mother-of-pearl shell button       */
  /* ---------------------------------------------------------------- */
  {
    id: 'shell_button',
    displayName: '貝殼釦',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8e0, 0xe8e0d8, 0xf8f0e8, 0xf0d8d0, 0xe0d8d0],
    yOffset: -0.80,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // shell button body (iridescent mother-of-pearl)
        cyl(1.0, 1.0, 0.24, 12, 0xffffff, { y: 0.14 }),
        // natural shell edge variation
        cyl(0.98, 0.95, 0.08, 12, 0xf8f0e8, { y: 0.26 }),
        // center depression
        cyl(0.55, 0.55, 0.16, 10, 0xe8e0d8, { y: 0.28 }),
        // iridescent shimmer layers
        cyl(0.8, 0.8, 0.02, 10, 0xd8f0f8, { y: 0.18 }),
        cyl(0.6, 0.6, 0.02, 8, 0xf0e8f8, { y: 0.22 }),
      ];
      // two holes (shell button style)
      const holes = [[0.15, 0], [-0.15, 0]];
      for (const [hx, hz] of holes) {
        parts.push(cyl(0.08, 0.08, 0.2, 6, 0x2a2428, { x: hx, z: hz, y: 0.3 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] scratch_card_board 戳戳樂板 — CHUNK LANDMARK                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'scratch_card_board',
    displayName: '戳戳樂板',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xf4e3c0, 0xf6d4a0, 0xead9b6, 0xf2dcb0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        box(2.7, 1.9, 0.18, 0xffffff, { y: 0.95 }),
        box(2.7, 0.42, 0.2, 0xd83a2e, { y: 1.74, z: 0.02 }),
        box(2.7, 0.26, 0.2, 0xf0b429, { y: 0.18, z: 0.02 }),
      ];
      const cols = 5, rows = 3, x0 = -0.84, y0 = 0.62, dx = 0.42, dy = 0.38;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const popped = rng() < 0.28;
          parts.push(cyl(0.15, 0.15, 0.12, 6, popped ? 0x2a2a2e : 0xfff6e4, { rx: HALF_PI, x: x0 + c * dx, y: y0 + r * dy, z: 0.12, open: true }));
        }
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] fortune_stick_tube 籤筒 — CHUNK LANDMARK: fortune tube          */
  /* ---------------------------------------------------------------- */
  {
    id: 'fortune_stick_tube',
    displayName: '籤筒',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc24a2c, 0xd45a30, 0xb8431f, 0xcf5226],
    yOffset: -0.10,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        cyl(0.92, 0.86, 2.3, 12, 0xffffff, { y: 1.15 }),
        cyl(0.98, 0.98, 0.22, 12, 0xf0b429, { y: 0.12 }),
        cyl(0.98, 0.98, 0.22, 12, 0xf0b429, { y: 2.18 }),
        cyl(0.78, 0.78, 0.18, 12, 0x2a1c14, { y: 2.2 }),
        box(0.1, 1.9, 0.06, 0xf0b429, { x: 0.0, z: 0.9, y: 1.15 }),
        box(0.1, 1.9, 0.06, 0xf0b429, { x: 0.9, z: 0.0, y: 1.15, ry: HALF_PI }),
      ];
      const sticks = 7;
      for (let i = 0; i < sticks; i++) {
        const a = (i / sticks) * PI * 2;
        const lean = 0.18 + (i % 3) * 0.05;
        const tilt = (i % 2 === 0) ? lean : -lean;
        parts.push(cyl(0.055, 0.06, 1.6, 4, 0xe8d2a6, {
          rz: tilt, rx: Math.sin(a) * lean, x: Math.cos(a) * 0.32, z: Math.sin(a) * 0.32, y: 3.1, hex2: 0xc23a2e,
        }));
      }
      return finish(parts);
    },
  },
];

export default T0_ARCHETYPES;
