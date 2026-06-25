/**
 * @file packs/nantou/archetypes/t0.js — Roll Formosa Nantou pack, TIER 0
 *   竹山柑仔店桌頭 (Zhushan corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/nantou/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [0] plum_candy 梅子糖 — Xinyi plum candy (南投信義特產)              */
  /* ---------------------------------------------------------------- */
  {
    id: 'plum_candy',
    displayName: '梅子糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x9a3060, 0xb04070, 0x7a2050, 0xc05080, 0x6a1840],
    yOffset: -0.49,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // plum candy body (oval, plum-colored)
        sph(0.9, 0xffffff, { ws: 10, hs: 7, x: 0.0, sx: 1.2 }),
        // sugar coating shimmer
        torus(0.5, 0.12, 6, 10, 0xffffff, { ry: HALF_PI, x: 0.0 }),
        // wrapper twist ends (clear cellophane)
        cone(0.4, 0.6, 8, 0xf8f0e8, { rz: -HALF_PI, x: 1.0 }),
        cone(0.4, 0.6, 8, 0xf8f0e8, { rz: HALF_PI, x: -1.0 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] oolong_tea_ball 凍頂烏龍茶球 — rolled oolong tea ball            */
  /* ---------------------------------------------------------------- */
  {
    id: 'oolong_tea_ball',
    displayName: '凍頂烏龍茶球',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a5030, 0x4a6040, 0x2a4020, 0x5a7050, 0x6a8060],
    yOffset: 0,
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      return finish([
        // tightly rolled oolong tea ball (南投鹿谷特產)
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }),
        // subtle leaf texture ridges
        box(0.1, 0.9, 0.1, 0x2a4020, { rz: 0.3, ry: 0.2 }),
        box(0.1, 0.85, 0.1, 0x2a4020, { rz: -0.4, ry: 1.0 }),
        box(0.1, 0.8, 0.1, 0x2a4020, { rz: 0.5, ry: 2.0 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] bamboo_shoot_tip 筍尖 — small bamboo shoot tip (竹山特產)         */
  /* ---------------------------------------------------------------- */
  {
    id: 'bamboo_shoot_tip',
    displayName: '筍尖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8b090, 0xd8c0a0, 0xb8a080, 0xe8d0b0, 0xa89070],
    yOffset: -0.03,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // bamboo shoot tip (竹山筍)
        cone(0.7, 1.6, 8, 0xffffff, { y: 0.8 }), // main body
        // layered husk rings
        cyl(0.72, 0.68, 0.2, 8, 0xb8a080, { y: 0.3 }),
        cyl(0.65, 0.58, 0.18, 8, 0xc8b090, { y: 0.5 }),
        cyl(0.55, 0.45, 0.16, 8, 0xd8c0a0, { y: 0.7 }),
        // tip
        cone(0.2, 0.4, 6, 0xe8d8c0, { y: 1.5 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] shaoxing_cap 紹興酒蓋 — ceramic-style wine bottle cap          */
  /* ---------------------------------------------------------------- */
  {
    id: 'shaoxing_cap',
    displayName: '紹興酒蓋',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6a50, 0x6a4a38, 0xc02020, 0xa08060, 0x9a7a5a],
    yOffset: -0.76,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // ceramic stopper cap (tan colored)
        cyl(1.0, 0.9, 0.5, 10, 0xffffff, { y: 0.25 }), // main cap body (tinted ceramic)
        cyl(0.75, 0.75, 0.15, 10, 0x6a4a38, { y: 0.55 }), // cap neck
        // red seal/wax ring around the top
        cyl(1.02, 1.02, 0.12, 10, 0xc02020, { y: 0.35 }),
        // cork insert underneath
        cyl(0.6, 0.65, 0.2, 8, 0xa08060, { y: 0.05 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] tea_bag 茶包 — folded pyramid tea bag with tag                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'tea_bag',
    displayName: '茶包',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8a060, 0xd8b878, 0x5a4030, 0xf0e8d0, 0x8a6a40],
    yOffset: -0.49,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // pyramid tea bag body (triangle prism via scaled box + rotation)
        box(1.2, 0.8, 1.2, 0xffffff, { y: 0.4, ry: PI / 4 }), // mesh bag body (tinted)
        // tea leaves visible inside (darker fill)
        box(0.9, 0.5, 0.9, 0x5a4030, { y: 0.3, ry: PI / 4 }),
        // string going up
        cyl(0.03, 0.03, 0.8, 4, 0xf0e8d0, { y: 0.9, rz: 0.3 }),
        // paper tag at end of string
        box(0.3, 0.2, 0.04, 0xf0e8d0, { y: 1.2, x: 0.25, hex2: 0xc8a060 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] sun_cake 太陽餅 — Nantou/Taichung sun cake piece                */
  /* ---------------------------------------------------------------- */
  {
    id: 'sun_cake',
    displayName: '太陽餅',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf4d8a0, 0xe8c890, 0xf0e0b0, 0xdab878],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // flaky pastry disc
        cyl(1.0, 1.0, 0.3, 12, 0xffffff, { y: 0.15 }),
        // golden baked top
        cyl(0.95, 0.95, 0.08, 12, 0xe8c070, { y: 0.32 }),
        // flaky layers on edge
        cyl(1.02, 1.02, 0.06, 12, 0xf0d8a0, { y: 0.08 }),
        cyl(1.02, 1.02, 0.06, 12, 0xf4e0b0, { y: 0.18 }),
        // center stamp mark
        cyl(0.3, 0.3, 0.04, 8, 0xd8a060, { y: 0.35 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] incense_stick 線香 — temple incense stick (南投廟宇)             */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_stick',
    displayName: '線香',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xc83020, 0xd84030, 0xb82818, 0xe05040, 0xa82010],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // red incense stick body
        cyl(0.08, 0.08, 2.4, 6, 0xffffff, { rz: HALF_PI, x: 0.0 }),
        // bamboo stick core at base
        cyl(0.05, 0.05, 0.8, 6, 0xc8b090, { rz: HALF_PI, x: -1.5 }),
        // ash tip (grey)
        cyl(0.07, 0.04, 0.3, 6, 0x8a8a8a, { rz: HALF_PI, x: 1.4 }),
        // glowing ember end
        sph(0.08, 0xf06020, { ws: 6, hs: 4, x: 1.55 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] deer_antler_slice 鹿茸片 — deer antler slice (埔里特產)           */
  /* ---------------------------------------------------------------- */
  {
    id: 'deer_antler_slice',
    displayName: '鹿茸片',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xa87850, 0xb88860, 0x986840, 0xc89870, 0x886038],
    yOffset: -0.80,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // oval antler slice
        cyl(1.0, 1.0, 0.15, 12, 0xffffff, { y: 0.08, sx: 1.2 }),
        // outer ring (darker bone)
        cyl(1.02, 1.02, 0.12, 12, 0x886040, { y: 0.08, sx: 1.2, open: true }),
        // center spongy core pattern
        cyl(0.5, 0.5, 0.16, 10, 0xc8a080, { y: 0.08, sx: 1.2 }),
        // small pores
        cyl(0.12, 0.12, 0.17, 6, 0x9a7050, { x: 0.2, z: 0.15, y: 0.08 }),
        cyl(0.1, 0.1, 0.17, 6, 0x9a7050, { x: -0.15, z: -0.1, y: 0.08 }),
        cyl(0.08, 0.08, 0.17, 6, 0x9a7050, { x: 0.1, z: -0.2, y: 0.08 }),
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
