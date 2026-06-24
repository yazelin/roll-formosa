/**
 * @file packs/taoyuan/archetypes/t0.js — Roll Formosa Taoyuan pack, TIER 0
 *   柑仔店桌頭 (corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/taoyuan/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [1] daxi_top 大溪陀螺 — Daxi traditional wooden spinning top        */
  /* ---------------------------------------------------------------- */
  {
    id: 'daxi_top_street',
    displayName: '大溪陀螺',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83040, 0x2060a0, 0x30a850, 0xf0c040, 0x8a5a38],
    yOffset: -0.15, // spinning top resting on its point
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Daxi (大溪) is famous for traditional handmade wooden spinning tops (陀螺)
      const wood = 0x8a5a38;
      return finish([
        // main body - painted wood with color rings (classic Daxi style)
        cyl(0.7, 0.2, 0.5, 8, 0xffffff, { y: 0.6 }), // upper dome (tinted)
        cyl(0.5, 0.7, 0.3, 8, 0xffffff, { y: 0.35 }), // shoulder (tinted)
        // tapered point
        cone(0.5, 0.7, 8, wood, { y: 0.0, rx: PI }),
        // decorative color rings (Daxi tops have painted stripes)
        cyl(0.72, 0.72, 0.08, 8, 0xc83040, { y: 0.55, open: true }),
        cyl(0.65, 0.65, 0.06, 8, 0x2060a0, { y: 0.7, open: true }),
        cyl(0.52, 0.52, 0.05, 8, 0xf0c040, { y: 0.4, open: true }),
        // metal tip at the very point
        cone(0.12, 0.15, 6, 0xc8ccd4, { y: -0.35, rx: PI }),
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
  /* [3] peanut_candy 花生糖 — Daxi specialty peanut brittle chunk       */
  /* ---------------------------------------------------------------- */
  {
    id: 'peanut_candy',
    displayName: '花生糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd4a85a, 0xc89846, 0xe8b86a, 0xdcaa58],
    yOffset: -0.65, // block sitting on table
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // rectangular block of peanut brittle
        box(1.6, 0.5, 1.0, 0xffffff, { y: 0.25 }), // main body (tinted golden)
        // visible peanut bumps on the surface
        sph(0.18, 0xb88a3c, { ws: 5, hs: 4, x: 0.3, y: 0.48, z: 0.2 }),
        sph(0.16, 0xc09644, { ws: 5, hs: 4, x: -0.4, y: 0.46, z: -0.1 }),
        sph(0.15, 0xb88a3c, { ws: 5, hs: 4, x: 0.1, y: 0.45, z: -0.3 }),
        sph(0.17, 0xc4984a, { ws: 5, hs: 4, x: -0.2, y: 0.47, z: 0.35 }),
        sph(0.14, 0xb08840, { ws: 5, hs: 4, x: 0.5, y: 0.44, z: 0.0 }),
        // sugar glaze sheen on top
        box(1.5, 0.06, 0.9, 0xf4dca0, { y: 0.52 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] daxi_tofu 大溪豆乾 — Daxi dried tofu block                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'daxi_tofu',
    displayName: '大溪豆乾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x5a3824, 0x6a4430, 0x4e3020, 0x62402c],
    yOffset: -0.60, // square block sitting flat
    upright: false,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [
        // square block of dried tofu (dark soy-marinated color)
        box(1.2, 0.6, 1.2, 0xffffff, { y: 0.3 }), // main body (tinted dark brown)
        // scored grid lines on top (classic Daxi tofu pattern)
        box(1.18, 0.04, 0.08, 0x3a2418, { y: 0.62, z: 0.3 }),
        box(1.18, 0.04, 0.08, 0x3a2418, { y: 0.62, z: -0.3 }),
        box(0.08, 0.04, 1.18, 0x3a2418, { y: 0.62, x: 0.3 }),
        box(0.08, 0.04, 1.18, 0x3a2418, { y: 0.62, x: -0.3 }),
        // slightly glossy surface sheen
        box(1.15, 0.02, 1.15, 0x7a5840, { y: 0.64 }),
      ];
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
  /* [6] hakka_floral_cloth 客家花布小方巾 — folded Hakka floral fabric square */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_floral_cloth',
    displayName: '客家花布小方巾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.04,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc83040, 0x2060a0, 0x308848, 0xf0c040, 0xd04050],
    yOffset: -0.72, // folded cloth sitting on table
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Hakka floral fabric (客家花布) - iconic red/blue/green with peony patterns
      // Taoyuan Longtan (龍潭) is a center of Hakka culture
      const base = 0xffffff; // tinted body
      return finish([
        // folded fabric square (layered for volume)
        box(1.6, 0.15, 1.4, base, { y: 0.08 }), // bottom layer
        box(1.4, 0.12, 1.3, base, { y: 0.22, x: 0.05 }), // middle fold
        box(1.2, 0.1, 1.1, base, { y: 0.34, x: -0.08 }), // top fold
        // floral pattern elements (peony/牡丹 simplified as circles + leaves)
        sph(0.18, 0xf04060, { ws: 5, hs: 4, x: 0.3, y: 0.42, z: 0.2 }), // red flower
        sph(0.15, 0x3070b0, { ws: 5, hs: 4, x: -0.3, y: 0.40, z: -0.15 }), // blue flower
        sph(0.12, 0xf0c040, { ws: 5, hs: 3, x: 0.0, y: 0.38, z: 0.0 }), // yellow center
        // green leaves (small boxes)
        box(0.15, 0.04, 0.08, 0x308848, { x: 0.5, y: 0.36, z: 0.1 }),
        box(0.12, 0.04, 0.1, 0x408858, { x: -0.45, y: 0.34, z: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] button 鈕扣 — flat sew-through button with 4 thread holes       */
  /* ---------------------------------------------------------------- */
  {
    id: 'button',
    displayName: '鈕扣',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf3f3f5, 0x3f6fb0, 0xd84d6a, 0x6fae5e, 0x2a2d33],
    yOffset: -0.80, // disc lying flat (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.28, 16, 0xffffff, { y: 0.16 }), // button body (tinted)
        cyl(0.58, 0.58, 0.18, 14, 0xffffff, { y: 0.3 }), // raised inner well rim (tinted lighter)
        cyl(0.46, 0.46, 0.1, 12, 0xd6d8de, { y: 0.36 }), // recessed thread well floor
      ];
      // four thread holes (dark recessed dots in a square)
      const d = 0.2;
      const holes = [
        [d, d], [-d, d], [d, -d], [-d, -d],
      ];
      for (const [hx, hz] of holes) {
        parts.push(cyl(0.07, 0.07, 0.18, 8, 0x1d1f24, { x: hx, z: hz, y: 0.34 }));
      }
      return finish(parts);
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
  /* [9] fortune_sticks 籤筒 — CHUNK LANDMARK: bamboo fortune tube       */
  /* ---------------------------------------------------------------- */
  {
    id: 'fortune_sticks',
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
