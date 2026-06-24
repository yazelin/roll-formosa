/**
 * @file packs/penghu/archetypes/t0.js — Roll Formosa Penghu pack, TIER 0
 *   海灘小物 (beach & harbor trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/penghu/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 珊瑚擺飾 / 貝殼風鈴, spawnWeight ~0.3).
 *
 * Penghu themes: shells, coral, dried fish, basalt pebbles, sea glass
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
    yOffset: -0.68, // block resting on the table (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      return finish([
        box(2.0, 0.7, 1.0, 0xffffff, { y: 0.35 }), // rubber body (tinted off-white/pastel)
        // paper sleeve wrapping the middle (printed blue band + white edge stripes)
        box(0.94, 0.74, 1.04, 0x2f64c8, { x: 0.0, y: 0.35 }), // blue sleeve
        box(0.1, 0.76, 1.06, 0xf4f6fb, { x: -0.5, y: 0.35 }), // white edge stripe
        box(0.1, 0.76, 1.06, 0xf4f6fb, { x: 0.5, y: 0.35 }), // white edge stripe
        box(0.6, 0.18, 1.06, 0xf0c23a, { x: 0.0, y: 0.35 }), // tiny gold label flash
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
  /* [3] seashell 貝殼 — Penghu beach scallop shell                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'seashell',
    displayName: '貝殼',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xf8f0e6, 0xf0d8c0, 0xe8c8b0, 0xfff4e8, 0xd8b8a0],
    yOffset: -0.76,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // scallop shell fan shape - flat half sphere with ridges
      parts.push(sph(1.0, 0xffffff, { ws: 10, hs: 5, thetaLen: HALF_PI * 0.9, y: 0.1, sy: 0.3 }));
      // radiating ridges on the shell
      for (let i = 0; i < 7; i++) {
        const a = (-0.5 + i * 0.166) * PI;
        parts.push(box(0.08, 0.12, 0.9, 0xf0dcc8, { ry: a, y: 0.15 }));
      }
      // hinge at the base
      parts.push(cyl(0.15, 0.12, 0.2, 6, 0xe8d4c0, { y: 0.05, z: -0.4 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] coral_piece 珊瑚碎片 — small pink coral fragment               */
  /* ---------------------------------------------------------------- */
  {
    id: 'coral_piece',
    displayName: '珊瑚碎片',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xffb0a0, 0xff9080, 0xffc0b0, 0xffa090, 0xffd0c0],
    yOffset: -0.4,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // branching coral structure
      parts.push(cyl(0.2, 0.15, 0.6, 6, 0xffffff, { y: 0.3 })); // main trunk
      // branches
      parts.push(cyl(0.12, 0.08, 0.5, 5, 0xffffff, { y: 0.7, rz: 0.4, x: 0.15 }));
      parts.push(cyl(0.12, 0.08, 0.5, 5, 0xffffff, { y: 0.7, rz: -0.3, x: -0.12 }));
      parts.push(cyl(0.1, 0.06, 0.35, 5, 0xffffff, { y: 0.9, rz: 0.5, x: 0.3 }));
      // porous texture dots
      parts.push(sph(0.06, 0xffe0d8, { x: 0.1, y: 0.5, z: 0.1, ws: 4, hs: 3 }));
      parts.push(sph(0.06, 0xffe0d8, { x: -0.08, y: 0.4, z: -0.08, ws: 4, hs: 3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] dried_fish 小魚乾 — tiny dried anchovy/whitebait               */
  /* ---------------------------------------------------------------- */
  {
    id: 'dried_fish',
    displayName: '小魚乾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8c0b0, 0xb8b0a0, 0xd8d0c0, 0xa8a090, 0xe0d8c8],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // fish body (elongated ellipsoid)
        sph(0.4, 0xffffff, { ws: 8, hs: 6, sx: 2.5, y: 0.0 }),
        // head taper
        cone(0.35, 0.5, 6, 0xe8e0d8, { rz: -HALF_PI, x: -1.1 }),
        // tail fin (flat triangle)
        box(0.5, 0.02, 0.3, 0xd0c8b8, { x: 1.15, y: 0.0 }),
        // eye dot
        sph(0.08, 0x2a2a2e, { x: -0.85, y: 0.12, z: 0.15, ws: 4, hs: 3 }),
        // dorsal ridge
        box(0.8, 0.08, 0.04, 0xd8d0c0, { x: 0.0, y: 0.35 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] basalt_pebble 玄武岩石 — small dark volcanic basalt stone      */
  /* ---------------------------------------------------------------- */
  {
    id: 'basalt_pebble',
    displayName: '玄武岩石',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x3a3a3e, 0x4a4a4e, 0x2a2a2e, 0x5a5a5e, 0x3e3e42],
    yOffset: -0.5,
    upright: false,
    collisionScale: 0.9,
    buildGeometry(rng) {
      return finish([
        // irregular angular stone body (stretched icosphere-ish)
        sph(0.9, 0xffffff, { ws: 7, hs: 5, sx: 1.2, sy: 0.7 }),
        // angular facets suggested by box cuts
        box(0.6, 0.5, 0.8, 0x4a4a4e, { y: 0.1, rz: 0.2, rx: 0.15 }),
        box(0.5, 0.4, 0.6, 0x3e3e42, { y: -0.15, rz: -0.1, rx: -0.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] sea_glass 海玻璃 — frosted beach glass shard                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'sea_glass',
    displayName: '海玻璃',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8fd4c8, 0xb0e8dc, 0x70c4b8, 0xa0d8cc, 0x90dcd0],
    yOffset: -0.75,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // frosted irregular glass piece
        box(1.4, 0.25, 1.0, 0xffffff, { y: 0.12, rz: 0.1 }),
        // rounded edges from tumbling
        sph(0.3, 0xffffff, { x: 0.5, y: 0.1, z: 0.3, ws: 5, hs: 3 }),
        sph(0.25, 0xffffff, { x: -0.4, y: 0.1, z: -0.2, ws: 5, hs: 3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] coral_ornament 珊瑚擺飾 — CHUNK LANDMARK: decorative coral piece */
  /* ---------------------------------------------------------------- */
  {
    id: 'coral_ornament',
    displayName: '珊瑚擺飾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xffb8a8, 0xff9888, 0xffc8b8, 0xffa898, 0xffd8c8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // wooden display base
      parts.push(cyl(0.5, 0.55, 0.15, 8, 0x8a6a4a, { y: 0.08 }));
      // main coral trunk
      parts.push(cyl(0.18, 0.14, 1.2, 6, 0xffffff, { y: 0.7 }));
      // branching coral arms
      parts.push(cyl(0.12, 0.08, 0.7, 5, 0xffffff, { y: 1.1, rz: 0.5, x: 0.25 }));
      parts.push(cyl(0.12, 0.08, 0.7, 5, 0xffffff, { y: 1.0, rz: -0.45, x: -0.22 }));
      parts.push(cyl(0.1, 0.06, 0.5, 5, 0xffffff, { y: 1.3, rz: 0.3, x: 0.1, z: 0.15 }));
      parts.push(cyl(0.08, 0.05, 0.4, 5, 0xffffff, { y: 1.5, rz: 0.6, x: 0.35 }));
      parts.push(cyl(0.08, 0.05, 0.4, 5, 0xffffff, { y: 1.4, rz: -0.55, x: -0.3 }));
      // tips
      parts.push(sph(0.08, 0xffd0c0, { x: 0.55, y: 1.65, ws: 4, hs: 3 }));
      parts.push(sph(0.08, 0xffd0c0, { x: -0.48, y: 1.55, ws: 4, hs: 3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] shell_windchime 貝殼風鈴 — CHUNK LANDMARK: hanging shell chime  */
  /* ---------------------------------------------------------------- */
  {
    id: 'shell_windchime',
    displayName: '貝殼風鈴',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xf8f0e8, 0xf0e0d0, 0xe8d8c8, 0xfff8f0, 0xd8c8b8],
    yOffset: -0.02,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      // driftwood top bar
      parts.push(cyl(0.08, 0.06, 1.6, 5, 0x9a7a5a, { rz: HALF_PI, y: 1.8 }));
      // hanging strings with shells (3 instead of 5)
      const shellX = [-0.35, 0, 0.35];
      for (let i = 0; i < 3; i++) {
        const x = shellX[i];
        const len = 0.8 + (i % 2) * 0.3;
        // string
        parts.push(cyl(0.015, 0.015, len, 3, 0xc8b8a0, { x, y: 1.8 - len / 2 }));
        // shell at bottom (scallop shape)
        parts.push(sph(0.12, 0xffffff, { x, y: 1.4 - len, ws: 5, hs: 3, sy: 0.4 }));
      }
      // center larger shell
      parts.push(sph(0.18, 0xf8e8d8, { y: 0.6, ws: 5, hs: 3, sy: 0.5 }));
      // hanging loop at top
      parts.push(torus(0.1, 0.02, 3, 5, 0x9a7a5a, { y: 1.95 }));
      return finish(parts);
    },
  },
];

export default T0_ARCHETYPES;
