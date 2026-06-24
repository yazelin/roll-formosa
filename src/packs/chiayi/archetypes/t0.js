/**
 * @file packs/chiayi/archetypes/t0.js — Roll Formosa Chiayi pack, TIER 0
 *   木都柑仔店桌頭 (wood-city corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/chiayi/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [1] hinoki_sachet 檜木香包 — aromatic hinoki wood sachet pouch     */
  /* ---------------------------------------------------------------- */
  {
    id: 'hinoki_sachet',
    displayName: '檜木香包',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8b070, 0xc8a058, 0xe8c888, 0xb89048],
    yOffset: -0.68, // pouch resting on table
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Small fabric pouch with hinoki wood chips inside, tied with string
      return finish([
        // main sachet body (rounded cloth pouch)
        sph(0.9, 0xffffff, { ws: 8, hs: 6, sy: 0.7, y: 0.35 }), // cloth body (tinted)
        // gathered top with tie
        cyl(0.35, 0.2, 0.3, 6, 0xffffff, { y: 0.75 }), // gathered neck
        // string tie wrapping
        torus(0.25, 0.04, 4, 6, 0x8a6040, { y: 0.78 }), // brown string loop
        // decorative wood chip peeking out top
        box(0.15, 0.25, 0.08, 0xd8b070, { x: 0.05, y: 0.9, rz: 0.2 }), // hinoki chip
        box(0.12, 0.2, 0.06, 0xc8a058, { x: -0.08, y: 0.88, rz: -0.15 }), // hinoki chip
        // "檜木" print badge on pouch
        box(0.35, 0.2, 0.05, 0xc04030, { y: 0.35, z: 0.55 }), // red print label
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
  /* [4] fangkuaisu 方塊酥 — Chiayi's signature square layered pastry    */
  /* ---------------------------------------------------------------- */
  {
    id: 'fangkuaisu_stack',
    displayName: '方塊酥',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8c878, 0xd8b058, 0xf0d890, 0xc8a040],
    yOffset: -0.55, // stack of square pastries (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const j = rng() * 0.02;
      const parts = [];
      const CRUST = 0xffffff; // will be tinted
      const LAYER = 0xf0d890; // visible flaky layer
      // Stack of 2 square pastries
      // Bottom pastry
      parts.push(box(1.4, 0.45, 1.4, CRUST, { y: 0.225 }));
      // Layer lines on sides (flaky texture)
      for (let ly = 0.08; ly < 0.4; ly += 0.12) {
        parts.push(box(1.42, 0.03, 0.04, LAYER, { y: ly, z: 0.72 }));
        parts.push(box(0.04, 0.03, 1.42, LAYER, { y: ly, x: 0.72 }));
      }
      // Top pastry (slightly offset for natural stack look)
      parts.push(box(1.35, 0.42, 1.35, CRUST, { x: 0.04 + j, y: 0.68, z: -0.02 }));
      // Scoring marks on top surface
      parts.push(box(1.1, 0.04, 0.04, 0xc8a040, { y: 0.92 }));
      parts.push(box(0.04, 0.04, 1.1, 0xc8a040, { y: 0.92 }));
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
  /* [6] hinoki_ruler 檜木尺 — Chiayi hinoki wood ruler with markings    */
  /* ---------------------------------------------------------------- */
  {
    id: 'hinoki_ruler',
    displayName: '檜木尺',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xd8b070, 0xc8a058, 0xe8c888, 0xb89048, 0xf0d898],
    yOffset: -0.88, // ruler lying flat (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const wood = 0xffffff; // hinoki wood tint
      const dark = 0x5a4030;
      return finish([
        // main ruler body (flat hinoki wood)
        box(2.8, 0.12, 0.7, wood, { y: 0.06 }),
        // measurement markings on top
        box(2.6, 0.02, 0.04, dark, { y: 0.13, z: 0.25 }), // center line
        // tick marks
        box(0.02, 0.02, 0.15, dark, { x: -1.2, y: 0.13, z: 0.15 }),
        box(0.02, 0.02, 0.15, dark, { x: -0.6, y: 0.13, z: 0.15 }),
        box(0.02, 0.02, 0.15, dark, { x: 0.0, y: 0.13, z: 0.15 }),
        box(0.02, 0.02, 0.15, dark, { x: 0.6, y: 0.13, z: 0.15 }),
        box(0.02, 0.02, 0.15, dark, { x: 1.2, y: 0.13, z: 0.15 }),
        // "嘉義檜木" branding stamp
        box(0.5, 0.02, 0.2, 0xc04030, { x: 0.8, y: 0.13, z: -0.15 }),
        // beveled edge (darker wood grain)
        box(2.82, 0.04, 0.08, 0x8a6a48, { y: 0.02, z: 0.36 }),
        box(2.82, 0.04, 0.08, 0x8a6a48, { y: 0.02, z: -0.36 }),
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
