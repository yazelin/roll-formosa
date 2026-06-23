/**
 * @file packs/pingtung/archetypes/t0.js — Roll Formosa Pingtung pack, TIER 0
 *   屏東柑仔店桌頭 (corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/pingtung/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
    yOffset: 0,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }),
        box(0.18, 1.7, 0.5, 0xff8a3d, { rz: 0.5, hex2: 0xffd84d }),
        box(0.18, 1.7, 0.5, 0x3f8cff, { rz: -0.5, ry: HALF_PI, hex2: 0x49c45f }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] eraser 橡皮擦 — rounded block with a printed paper sleeve band  */
  /* ---------------------------------------------------------------- */
  {
    id: 'eraser',
    displayName: '橡皮擦',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xffffff, 0xfbe3ec, 0xeaf3ff, 0xfff4cf],
    yOffset: -0.68,
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      return finish([
        box(2.0, 0.7, 1.0, 0xffffff, { y: 0.35 }),
        box(0.94, 0.74, 1.04, 0x2f64c8, { x: 0.0, y: 0.35 }),
        box(0.1, 0.76, 1.06, 0xf4f6fb, { x: -0.5, y: 0.35 }),
        box(0.1, 0.76, 1.06, 0xf4f6fb, { x: 0.5, y: 0.35 }),
        box(0.6, 0.18, 1.06, 0xf0c23a, { x: 0.0, y: 0.35 }),
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
    yOffset: -0.03,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        sph(0.9, 0xffffff, { ws: 10, hs: 6, theta0: 0, thetaLen: HALF_PI, y: 0.7 }),
        cyl(0.92, 0.92, 0.28, 10, 0xffffff, { y: 0.62 }),
        cyl(0.34, 0.34, 0.5, 8, 0xc8ccd4, { y: 0.2 }),
        cone(0.32, 1.2, 8, 0xdfe3ea, { rx: PI, y: -0.55 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] seashell 貝殼 — spiral conch shell from Kenting beach          */
  /* ---------------------------------------------------------------- */
  {
    id: 'seashell',
    displayName: '貝殼',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xf4e8d8, 0xffe0c0, 0xd8c0a0, 0xf0d8c0, 0xe8d4b8],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Spiral conch shell — cream/pink tinted
      const parts = [
        // Main shell body - tapered cone shape
        cone(0.8, 1.6, 8, 0xffffff, { y: 0.6, hex2: 0xffeee0 }),
        // Spiral ridges around the shell
        torus(0.5, 0.12, 5, 8, 0xf8e8d8, { y: 0.3, rx: 0.2, arc: PI * 1.5 }),
        torus(0.4, 0.1, 5, 8, 0xfce4d4, { y: 0.6, rx: 0.25, arc: PI * 1.3 }),
        torus(0.28, 0.08, 5, 8, 0xf8dcc8, { y: 0.9, rx: 0.3, arc: PI }),
        // Shell opening
        sph(0.35, 0xffd8c0, { ws: 6, hs: 4, y: 0.1, z: 0.3 }),
        // Apex tip
        sph(0.15, 0xf0d4b8, { ws: 5, hs: 3, y: 1.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] coconut_candy 椰子糖 — cube-wrapped coconut candy from Pingtung */
  /* ---------------------------------------------------------------- */
  {
    id: 'coconut_candy',
    displayName: '椰子糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf5e6d0, 0xfff8e8, 0xe8d8c0, 0xffefd8, 0xf0e0c8],
    yOffset: -0.52,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Cube-shaped coconut candy with paper wrapper
      return finish([
        // Candy cube body (cream/white coconut color)
        box(1.2, 1.0, 1.2, 0xffffff, { y: 0.5, hex2: 0xfff8e8 }),
        // Paper wrapper bands
        box(1.24, 0.3, 1.24, 0x2a8a5a, { y: 0.5 }), // green band
        box(1.26, 0.12, 1.26, 0xd8a040, { y: 0.2 }), // gold trim
        box(1.26, 0.12, 1.26, 0xd8a040, { y: 0.8 }), // gold trim
        // Corner coconut texture dots
        sph(0.1, 0xe8d8c0, { ws: 4, hs: 3, x: 0.4, y: 0.9, z: 0.4 }),
        sph(0.1, 0xe8d8c0, { ws: 4, hs: 3, x: -0.4, y: 0.9, z: -0.4 }),
      ]);
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
    yOffset: -0.95,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        cyl(1.0, 1.0, 0.07, 16, 0xffffff, { y: 0.04 }),
        cyl(0.86, 0.86, 0.075, 16, 0xc23a2e, { y: 0.045 }),
        cyl(0.66, 0.66, 0.08, 16, 0xf4e3c0, { y: 0.05 }),
        cyl(0.44, 0.44, 0.085, 14, 0x2f6fb0, { y: 0.052 }),
        cyl(0.24, 0.24, 0.09, 12, 0xf0b429, { y: 0.055 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.0, z: 0.72, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.0, z: -0.72, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: 0.72, z: 0.0, y: 0.05 }),
        box(0.12, 0.09, 0.12, 0x2a2a2e, { x: -0.72, z: 0.0, y: 0.05 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] pencil 鉛筆 — hex shaft + sharpened tip + ferrule + eraser      */
  /* ---------------------------------------------------------------- */
  {
    id: 'pencil',
    displayName: '鉛筆',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xf2c200, 0xe84d3a, 0x2f8f4e, 0x3f7fd0, 0xf08a2a],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        cyl(0.26, 0.26, 2.7, 6, 0xffffff, { rz: HALF_PI, x: -0.1 }),
        cone(0.26, 0.45, 6, 0xe7c9a0, { rz: -HALF_PI, x: 1.45 }),
        cone(0.1, 0.18, 6, 0x33363c, { rz: -HALF_PI, x: 1.72 }),
        cyl(0.29, 0.29, 0.35, 8, 0xb8bcc4, { rz: HALF_PI, x: -1.62 }),
        cyl(0.27, 0.27, 0.35, 8, 0xf09bb0, { rz: HALF_PI, x: -1.95 }),
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
    yOffset: -0.80,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.28, 16, 0xffffff, { y: 0.16 }),
        cyl(0.58, 0.58, 0.18, 14, 0xffffff, { y: 0.3 }),
        cyl(0.46, 0.46, 0.1, 12, 0xd6d8de, { y: 0.36 }),
      ];
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
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        box(2.7, 1.9, 0.18, 0xffffff, { y: 0.95, z: 0.0 }),
        box(2.7, 0.42, 0.2, 0xd83a2e, { y: 1.74, z: 0.02 }),
        box(2.7, 0.26, 0.2, 0xf0b429, { y: 0.18, z: 0.02 }),
      ];
      const cols = 5;
      const rows = 3;
      const x0 = -0.84;
      const y0 = 0.62;
      const dx = 0.42;
      const dy = 0.38;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const popped = rng() < 0.28;
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
        const r = 0.32;
        const tilt = (i % 2 === 0) ? lean : -lean;
        parts.push(
          cyl(0.055, 0.06, 1.6, 4, 0xe8d2a6, {
            rz: tilt,
            rx: Math.sin(a) * lean,
            x: Math.cos(a) * r,
            z: Math.sin(a) * r,
            y: 3.1,
            hex2: 0xc23a2e,
          })
        );
      }
      return finish(parts);
    },
  },
];

export default T0_ARCHETYPES;
