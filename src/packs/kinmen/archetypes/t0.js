/**
 * @file packs/kinmen/archetypes/t0.js — Roll Formosa Kinmen pack, TIER 0
 *   柑仔店與貢糖桌頭 (corner-store & gong tang tabletop trinkets),
 *   the smallest absorbable band (radiusNominal 0.01–0.05 m).
 *   10 ArchetypeDefs, ids FROZEN by packs/kinmen/tiers.js TIERS[0].archetypeIds
 *   (slots [0..7] absorbable, slots [8..9] = chunk landmarks).
 *
 * Authored ONLY with the engine geometry vocabulary (geomHelpers.js):
 * box/cyl/cone/sph/ico/torus + paint/xf + finish (merge -> recenter ->
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
  /* [3] gong_tang 貢糖 — Kinmen's famous peanut candy block             */
  /* ---------------------------------------------------------------- */
  {
    id: 'gong_tang',
    displayName: '貢糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0d8a8, 0xe8c890, 0xf4e0b0, 0xd8b878, 0xfff0c8],
    yOffset: -0.65,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // layered peanut candy block - flaky texture
      parts.push(box(1.6, 0.5, 0.9, 0xffffff, { y: 0.25, hex2: 0xf4e0b0 }));
      // visible layer lines
      parts.push(box(1.62, 0.03, 0.92, 0xd8b878, { y: 0.15 }));
      parts.push(box(1.62, 0.03, 0.92, 0xd8b878, { y: 0.28 }));
      parts.push(box(1.62, 0.03, 0.92, 0xd8b878, { y: 0.41 }));
      // peanut bits visible on cut surface
      parts.push(sph(0.06, 0xc8a060, { ws: 4, hs: 3, x: 0.3, y: 0.3, z: 0.42 }));
      parts.push(sph(0.05, 0xc8a060, { ws: 4, hs: 3, x: -0.2, y: 0.2, z: 0.43 }));
      parts.push(sph(0.06, 0xc8a060, { ws: 4, hs: 3, x: 0.1, y: 0.35, z: 0.42 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] kaoliang_candy 高粱糖 — kaoliang liquor flavored candy          */
  /* ---------------------------------------------------------------- */
  {
    id: 'kaoliang_candy',
    displayName: '高粱糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0xf0e8d0, 0xfff8e8, 0xe8dcc8, 0xfffcf0],
    yOffset: -0.50,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // candy body - slightly translucent white, rectangular
        box(1.4, 0.6, 0.6, 0xffffff, { y: 0.3, hex2: 0xfff8e8 }),
        // wrapper twist ends
        cone(0.4, 0.5, 6, 0xd8c8a0, { rz: -HALF_PI, x: 0.95, y: 0.3 }),
        cone(0.4, 0.5, 6, 0xd8c8a0, { rz: HALF_PI, x: -0.95, y: 0.3 }),
        // wrapper crinkle detail
        box(0.2, 0.62, 0.62, 0xf0e0c0, { x: 0.6, y: 0.3 }),
        box(0.2, 0.62, 0.62, 0xf0e0c0, { x: -0.6, y: 0.3 }),
        // gold label strip
        box(0.6, 0.1, 0.64, 0xd4a030, { y: 0.5 }),
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
  /* [8] small_incense_burner 神明小香爐 — CHUNK LANDMARK: small temple incense burner */
  /* ---------------------------------------------------------------- */
  {
    id: 'small_incense_burner',
    displayName: '神明小香爐',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x9a7a3a, 0xb89048, 0x7a5e2a, 0xc8a050, 0x6a4e22],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const bronze = 0xffffff;
      const parts = [
        // base foot
        cyl(0.7, 0.8, 0.2, 10, bronze, { y: 0.1 }),
        // main bowl body
        cyl(0.6, 0.75, 0.6, 10, bronze, { y: 0.5, hex2: 0xc8a050 }),
        // bowl rim
        cyl(0.8, 0.78, 0.15, 10, 0x8a6a30, { y: 0.85 }),
        // ash fill
        cyl(0.68, 0.68, 0.08, 10, 0xc8b89a, { y: 0.88 }),
        // two side handles (loop ears)
        torus(0.18, 0.05, 4, 5, bronze, { x: -0.78, y: 0.65 }),
        torus(0.18, 0.05, 4, 5, bronze, { x: 0.78, y: 0.65 }),
        // three small incense sticks
        cyl(0.02, 0.02, 0.8, 4, 0xc4281f, { y: 1.3, x: 0.1, z: 0.05 }),
        cyl(0.02, 0.02, 0.75, 4, 0xc4281f, { y: 1.27, x: -0.08, z: 0.1 }),
        cyl(0.02, 0.02, 0.7, 4, 0xc4281f, { y: 1.24, x: 0.02, z: -0.1 }),
      ];
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
