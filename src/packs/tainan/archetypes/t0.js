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
  /* [0] marble 彈珠 — glass sphere with a colored swirl core           */
  /* ---------------------------------------------------------------- */
  {
    id: 'marble',
    displayName: '彈珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3f8cff, 0x49c45f, 0xff5340, 0xffd84d, 0xa86adf],
    yOffset: 0, // sphere sitting on the ground = centered
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }), // clear/tinted glass body (takes palette tint)
        // internal swirl ribbon: two thin crossed bands of saturated color
        box(0.18, 1.7, 0.5, 0xff8a3d, { rz: 0.5, hex2: 0xffd84d }), // warm swirl
        box(0.18, 1.7, 0.5, 0x3f8cff, { rz: -0.5, ry: HALF_PI, hex2: 0x49c45f }), // cool swirl
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
  /* [2] pushpin 圖釘 — dome head + tapered steel spike                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'pushpin',
    displayName: '圖釘',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xff5340, 0x3f8cff, 0x49c45f, 0xffd84d, 0xff8a3d],
    yOffset: -0.03, // spike-down, head up (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        sph(0.9, 0xffffff, { ws: 10, hs: 6, theta0: 0, thetaLen: HALF_PI, y: 0.7 }), // colored plastic dome (tinted)
        cyl(0.92, 0.92, 0.28, 10, 0xffffff, { y: 0.62 }), // dome skirt/rim (tinted)
        cyl(0.34, 0.34, 0.5, 8, 0xc8ccd4, { y: 0.2 }), // steel shoulder
        cone(0.32, 1.2, 8, 0xdfe3ea, { rx: PI, y: -0.55 }), // steel spike pointing down (cone apex down)
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] bottle_cap 瓶蓋 — shallow crimped soda-bottle cap              */
  /* ---------------------------------------------------------------- */
  {
    id: 'bottle_cap',
    displayName: '瓶蓋',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd83a2e, 0x2f64c8, 0x1f9e4a, 0xf0b429, 0xcfd4da],
    yOffset: -0.76, // crown sitting flat-down (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.16, 14, 0xffffff, { y: 0.42 }), // top disc (printed face, tinted)
        cyl(1.04, 1.04, 0.4, 14, 0xffffff, { y: 0.2 }), // crimped skirt (tinted)
        cyl(0.6, 0.6, 0.06, 12, 0xf2f2f4, { y: 0.51 }), // pale logo medallion
      ];
      // crimp teeth around the skirt (low-count ring of tiny boxes)
      const teeth = 12;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * PI * 2;
        parts.push(box(0.14, 0.42, 0.1, 0xe8eaee, { x: Math.cos(a) * 1.04, z: Math.sin(a) * 1.04, ry: -a, y: 0.2 }));
      }
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
  /* [5] ngiauimia_card 尪仔標 — round printed paper play-card           */
  /* ---------------------------------------------------------------- */
  {
    id: 'ngiauimia_card',
    displayName: '尪仔標',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf4e3c0, 0xf6d68a, 0xeac98e, 0xf0dcae],
    yOffset: -0.95, // flat paper disc lying flat (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        cyl(1.0, 1.0, 0.07, 16, 0xffffff, { y: 0.04 }), // thin card stock (tinted cream)
        cyl(0.86, 0.86, 0.075, 16, 0xc23a2e, { y: 0.045 }), // printed red outer ring
        cyl(0.66, 0.66, 0.08, 16, 0xf4e3c0, { y: 0.05 }), // cream field
        cyl(0.44, 0.44, 0.085, 14, 0x2f6fb0, { y: 0.052 }), // blue inner ring (printed hero medallion)
        cyl(0.24, 0.24, 0.09, 12, 0xf0b429, { y: 0.055 }), // gold center figure dot
        // four print marks around the field
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.0, z: 0.72, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.0, z: -0.72, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.72, z: 0.0, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: -0.72, z: 0.0, y: 0.05 }),
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
