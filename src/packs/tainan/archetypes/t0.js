/**
 * @file packs/tainan/archetypes/t0.js — Roll Formosa Tainan pack, TIER 0
 *   府城柑仔店桌頭 (corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/tainan/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 戳戳樂板 / 籤筒, spawnWeight ~0.3).
 *
 * Authored ONLY with the engine geometry vocabulary (geomHelpers.js):
 * box/cyl/cone/sph/ico/torus + paint/xf + finish (merge → recenter →
 * normalize to a UNIT bounding sphere of radius 1.0). The geometry math is an
 * engine red line — we compose primitives, never touch the math.
 *
 * Conventions inherited from the pack catalog:
 *   - Each buildGeometry(rng) returns ONE merged, vertex-colored geometry,
 *     <= 350 triangles (radial segment counts kept ~6-10).
 *   - palette[] is applied per-instance via instanceColor; the "body" part is
 *     baked near-white (0xffffff) so the palette tint shows, while fixed-detail
 *     parts (metal, dark print) are baked with concrete hexes.
 *   - yOffset = -1 - minY_of_normalized_geo (so a ground-sitting object reads
 *     -0.5..-1; a centered object ~0). Measured from the normalized geometry.
 *   - rng() (0..1) only nudges small variation, never structure (determinism).
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T0_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] yizai_candy 椪糖 — Tainan's classic yizai caramelized sugar disc */
  /* ---------------------------------------------------------------- */
  {
    id: 'yizai_candy',
    displayName: '椪糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd89040, 0xc88030, 0xe8a050, 0xf0b060, 0xb87028],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // flat round caramelized sugar candy (椪糖/椪餅) with stamped shape
      return finish([
        cyl(1.0, 1.0, 0.12, 12, 0xffffff, { y: 0.06 }), // caramel disc (tinted amber)
        cyl(0.95, 0.95, 0.04, 12, 0xd08030, { y: 0.12 }), // slightly darker top
        // stamped heart/umbrella outline (simplified as a small disc pattern)
        cyl(0.5, 0.5, 0.03, 8, 0xc07020, { y: 0.14 }),
        // tiny needle mark (the traditional breaking-out game)
        cyl(0.03, 0.03, 0.04, 4, 0x4a3020, { y: 0.15, x: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] wagui_bowl 碗粿小碗 — Tainan's iconic steamed rice pudding dish  */
  /* ---------------------------------------------------------------- */
  {
    id: 'wagui_bowl',
    displayName: '碗粿小碗',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf6f2ea, 0xe8dcc8, 0xf0e8d8, 0xfff8e8],
    yOffset: -0.68,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // small white ceramic bowl holding steamed rice pudding (碗粿)
      return finish([
        // bowl body (short wide cylinder with slight taper)
        cyl(0.9, 0.8, 0.5, 10, 0xf6f2ea, { y: 0.28 }),
        // bowl lip rim
        cyl(0.92, 0.92, 0.08, 10, 0xf6f2ea, { y: 0.55 }),
        // rice pudding filling inside (slight dome, off-white)
        sph(0.72, 0xf0e8d8, { ws: 8, hs: 4, sy: 0.3, y: 0.58 }),
        // sauce drizzle on top (dark soy sauce)
        box(0.4, 0.04, 0.08, 0x4a3020, { y: 0.68, z: 0.1 }),
        box(0.06, 0.04, 0.3, 0x4a3020, { y: 0.68, x: 0.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] shrimp_roll 蝦卷 — Tainan's signature fried shrimp roll         */
  /* ---------------------------------------------------------------- */
  {
    id: 'shrimp_roll',
    displayName: '蝦卷',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8a050, 0xc89040, 0xe8b060, 0xb88030, 0xf0c070],
    yOffset: -0.5,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // cylindrical fried shrimp roll (蝦卷), golden-brown fried bean curd skin
      return finish([
        cyl(0.4, 0.4, 2.0, 8, 0xffffff, { rz: HALF_PI }), // roll body (tinted golden)
        // crispy fried skin texture (darker bands)
        cyl(0.42, 0.42, 0.2, 8, 0xb07030, { rz: HALF_PI, x: -0.5 }),
        cyl(0.42, 0.42, 0.2, 8, 0xb07030, { rz: HALF_PI, x: 0.5 }),
        // visible pink shrimp filling at ends
        cyl(0.35, 0.35, 0.1, 8, 0xf0a0a0, { rz: HALF_PI, x: 0.98 }),
        cyl(0.35, 0.35, 0.1, 8, 0xf0a0a0, { rz: HALF_PI, x: -0.98 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] sword_lion 劍獅鑰匙圈 — Tainan's iconic sword-biting lion charm */
  /* ---------------------------------------------------------------- */
  {
    id: 'sword_lion',
    displayName: '劍獅鑰匙圈',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe04838, 0xd83828, 0xf05040, 0xb02818],
    yOffset: -0.6,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 劍獅 (sword lion) face keychain charm - Anping's guardian symbol
      const parts = [
        // lion face disc (red)
        cyl(1.0, 1.0, 0.2, 10, 0xffffff, { y: 0.0 }), // main body (tinted red)
        // mane ring around the face
        cyl(1.1, 1.1, 0.12, 10, 0xd8a040, { y: 0.0, open: true }),
        // eyes (gold/yellow)
        sph(0.18, 0xf0d030, { ws: 6, hs: 4, x: -0.35, y: 0.12, z: 0.3 }),
        sph(0.18, 0xf0d030, { ws: 6, hs: 4, x: 0.35, y: 0.12, z: 0.3 }),
        // pupils
        sph(0.08, 0x1a1a1a, { ws: 4, hs: 3, x: -0.35, y: 0.14, z: 0.38 }),
        sph(0.08, 0x1a1a1a, { ws: 4, hs: 3, x: 0.35, y: 0.14, z: 0.38 }),
        // nose
        sph(0.15, 0x2a2a2a, { ws: 5, hs: 3, y: -0.1, z: 0.4 }),
        // sword in mouth (horizontal)
        box(1.8, 0.08, 0.04, 0xc8ccd2, { y: -0.35, z: 0.3 }), // blade
        box(0.15, 0.2, 0.08, 0xd8a040, { y: -0.35, z: 0.32 }), // hilt
        // keyring loop at top
        torus(0.15, 0.04, 5, 6, 0xc8ccd2, { y: 0.55, z: 0.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 蜜餞 — Anping candied dried plum: one wrinkled deep-red plum    */
  /*     (lumpy squashed sphere, sugary speckles) on a paper wrapper.    */
  /* ---------------------------------------------------------------- */
  {
    id: 'preserved_plum',
    displayName: '蜜餞',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.016,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x7a2418, 0x9a3220, 0x5e1a12, 0xc89a6a, 0xe8c89a],
    yOffset: -0.6053,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // thin square paper wrapper underneath
        box(2.0, 0.06, 2.0, 0xe8c89a, { y: 0.03, hex2: 0xf0dcb8 }),
        // squashed lumpy plum body (deep red-brown), flattened in y
        sph(0.96, 0x9a3220, { ws: 10, hs: 7, sy: 0.62, y: 0.62, hex2: 0x7a2418 }),
        // a darker dimple lobe to make it look wrinkled/lumpy
        sph(0.42, 0x5e1a12, { ws: 6, hs: 4, sy: 0.6, x: 0.34, y: 0.78, z: -0.2 }),
        sph(0.34, 0x5e1a12, { ws: 6, hs: 4, sy: 0.6, x: -0.4, y: 0.74, z: 0.22 }),
      ];
      // sugary speckles dusted over the plum (deterministic ring)
      const sugar = 7;
      for (let i = 0; i < sugar; i++) {
        const a = (i / sugar) * PI * 2;
        const r = 0.36 + (i % 2) * 0.22;
        parts.push(
          sph(0.07, 0xe8c89a, { ws: 4, hs: 3, x: Math.cos(a) * r, y: 0.82 - (i % 3) * 0.05, z: Math.sin(a) * r })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] shrimp_cracker 蝦餅 — Anping dried shrimp cracker              */
  /* ---------------------------------------------------------------- */
  {
    id: 'shrimp_cracker',
    displayName: '蝦餅',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xe8c8a0, 0xf0d8b0, 0xd8b890, 0xc8a878],
    yOffset: -0.9,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // round fried shrimp cracker (蝦餅) - Anping's famous snack
      return finish([
        // thin round cracker (slightly wavy with overlapping discs)
        cyl(1.0, 1.0, 0.08, 12, 0xffffff, { y: 0.04 }), // base layer (tinted golden)
        cyl(0.9, 0.9, 0.06, 12, 0xe8c8a0, { y: 0.1, x: 0.05 }),
        cyl(0.85, 0.85, 0.05, 12, 0xd8b890, { y: 0.14, x: -0.05, z: 0.05 }),
        // visible tiny shrimp specks
        sph(0.08, 0xf08060, { ws: 4, hs: 3, x: 0.2, y: 0.16, z: 0.1 }),
        sph(0.06, 0xf08060, { ws: 4, hs: 3, x: -0.25, y: 0.15, z: -0.1 }),
        sph(0.07, 0xf08060, { ws: 4, hs: 3, x: 0.1, y: 0.17, z: -0.2 }),
        sph(0.05, 0xf08060, { ws: 4, hs: 3, x: -0.1, y: 0.16, z: 0.25 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] danzai_mian 擔仔麵小碗 — mini bowl of Tainan's signature noodles  */
  /* ---------------------------------------------------------------- */
  {
    id: 'danzai_mian',
    displayName: '擔仔麵小碗',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xf6f2ea, 0xd8a060, 0xc89048, 0xe8c088, 0xf0e0c0],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // small blue-white ceramic bowl of 擔仔麵 with shrimp + minced pork
      return finish([
        // bowl exterior (blue-white porcelain)
        cyl(0.85, 0.7, 0.65, 10, 0xeef6f8, { y: 0.35 }),
        cyl(0.88, 0.88, 0.1, 10, 0xeef6f8, { y: 0.7 }), // rim
        // blue pattern band
        cyl(0.87, 0.87, 0.12, 10, 0x4a78a8, { y: 0.5, open: true }),
        // broth inside (tan)
        cyl(0.75, 0.75, 0.1, 8, 0xd8a060, { y: 0.65 }),
        // noodle tangle (yellow strands suggested by overlapping thin cylinders)
        cyl(0.5, 0.5, 0.08, 6, 0xf0d898, { y: 0.72 }),
        cyl(0.4, 0.4, 0.06, 6, 0xf0d898, { y: 0.78, x: 0.1, z: 0.1 }),
        // minced pork topping (brown mound)
        sph(0.22, 0x8a5a30, { ws: 6, hs: 4, sy: 0.5, y: 0.82 }),
        // shrimp (orange curved shape)
        cyl(0.1, 0.08, 0.25, 5, 0xe88048, { rx: 0.3, x: 0.2, y: 0.9, z: 0.15 }),
        // green scallion garnish
        cyl(0.03, 0.03, 0.2, 4, 0x4a8a40, { y: 0.9, x: -0.15, z: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] coffin_bread 棺材板小份 — Tainan's signature fried toast box    */
  /* ---------------------------------------------------------------- */
  {
    id: 'coffin_bread',
    displayName: '棺材板小份',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8a050, 0xc89040, 0xe8b860, 0xf0c870, 0xd09030],
    yOffset: -0.75,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 棺材板: fried bread box with creamy filling
      return finish([
        // thick slice of fried bread (golden box)
        box(1.6, 0.7, 1.4, 0xd8a050, { y: 0.4 }),
        // top crust (darker golden lid)
        box(1.5, 0.12, 1.3, 0xc89040, { y: 0.78 }),
        // hollowed-out center showing creamy filling
        box(1.2, 0.25, 1.0, 0xf0e8d0, { y: 0.55 }), // cream filling
        // bits of chicken/vegetable chunks in cream
        sph(0.12, 0xe8c0a0, { ws: 4, hs: 3, x: 0.2, y: 0.68 }),
        sph(0.1, 0xe8c0a0, { ws: 4, hs: 3, x: -0.25, y: 0.66, z: 0.15 }),
        sph(0.08, 0x90a060, { ws: 4, hs: 3, x: 0.1, y: 0.65, z: -0.2 }), // pea
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] scratch_card_board 戳戳樂板 — CHUNK LANDMARK: poke-hole board    */
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
    yOffset: -0.42, // board standing upright (= -1 - minY of normalized geo)
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        box(2.7, 1.9, 0.18, 0xffffff, { y: 0.95, z: 0.0 }), // cardboard backing (tinted)
        box(2.7, 0.42, 0.2, 0xd83a2e, { y: 1.74, z: 0.02 }), // red header banner strip
        box(2.7, 0.26, 0.2, 0xf0b429, { y: 0.18, z: 0.02 }), // gold footer prize strip
      ];
      // grid of paper-covered poke holes (each a small open ring — capless to
      // stay under the tri cap; the dark backing reads through as the hole)
      const cols = 5;
      const rows = 3;
      const x0 = -0.84;
      const y0 = 0.62;
      const dx = 0.42;
      const dy = 0.38;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const popped = rng() < 0.28; // a few already poked
          const px = x0 + c * dx;
          const py = y0 + r * dy;
          parts.push(
            cyl(0.15, 0.15, 0.12, 6, popped ? 0x2a2a2e : 0xfff6e4, { rx: HALF_PI, x: px, y: py, z: 0.12, open: true })
          );
        }
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] fortune_stick_tube 籤筒 — CHUNK LANDMARK: bamboo fortune tube    */
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
    yOffset: -0.10, // tube standing upright (= -1 - minY of normalized geo)
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        cyl(0.92, 0.86, 2.3, 12, 0xffffff, { y: 1.15 }), // lacquered bamboo tube (tinted red)
        cyl(0.98, 0.98, 0.22, 12, 0xf0b429, { y: 0.12 }), // gold base ring
        cyl(0.98, 0.98, 0.22, 12, 0xf0b429, { y: 2.18 }), // gold mouth ring
        cyl(0.78, 0.78, 0.18, 12, 0x2a1c14, { y: 2.2 }), // dark inner mouth (sticks emerge here)
        // gold vertical accent stripes on the body
        box(0.1, 1.9, 0.06, 0xf0b429, { x: 0.0, z: 0.9, y: 1.15 }),
        box(0.1, 1.9, 0.06, 0xf0b429, { x: 0.9, z: 0.0, y: 1.15, ry: HALF_PI }),
      ];
      // bundle of fortune sticks poking out the top at slight angles
      const sticks = 7;
      for (let i = 0; i < sticks; i++) {
        const a = (i / sticks) * PI * 2;
        const lean = 0.18 + (i % 3) * 0.05;
        const r = 0.32;
        const tilt = (i % 2 === 0) ? lean : -lean;
        // one stick = single 4-sided shaft with a red-painted top via gradient
        parts.push(
          cyl(0.055, 0.06, 1.6, 4, 0xe8d2a6, {
            rz: tilt,
            rx: Math.sin(a) * lean,
            x: Math.cos(a) * r,
            z: Math.sin(a) * r,
            y: 3.1,
            hex2: 0xc23a2e, // red-dipped fortune tip (top of gradient)
          })
        );
      }
      return finish(parts);
    },
  },
];

export default T0_ARCHETYPES;
