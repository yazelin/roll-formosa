/**
 * @file packs/newtaipei/archetypes/t0.js — Roll Formosa New Taipei pack, TIER 0
 *   九份柑仔店桌頭 (Jiufen corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/newtaipei/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [3] iron_egg_pack 淡水鐵蛋包 — vacuum-sealed iron eggs (Tamsui)    */
  /* ---------------------------------------------------------------- */
  {
    id: 'iron_egg_pack',
    displayName: '淡水鐵蛋包',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a2820, 0x5a4030, 0x2a1810, 0xc83030],
    yOffset: -0.62,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Vacuum-sealed pack of Tamsui iron eggs (dark brown small eggs in plastic)
      const EGG = 0x3a2820;
      const EGG_HI = 0x5a4030;
      const PLASTIC = 0xe8e8e8;
      const parts = [];
      // Clear plastic vacuum pack (slightly visible)
      parts.push(box(1.2, 0.5, 0.8, PLASTIC, { y: 0.25, hex2: 0xd8d8d8 }));
      // Iron eggs inside (small dark eggs)
      parts.push(sph(0.22, EGG, { ws: 6, hs: 5, x: -0.3, y: 0.25, z: 0.15, sy: 1.2, hex2: EGG_HI }));
      parts.push(sph(0.22, EGG, { ws: 6, hs: 5, x: 0.2, y: 0.25, z: 0.15, sy: 1.2, hex2: EGG_HI }));
      parts.push(sph(0.2, EGG, { ws: 6, hs: 5, x: -0.1, y: 0.3, z: -0.2, sy: 1.15, hex2: EGG_HI }));
      parts.push(sph(0.18, EGG, { ws: 6, hs: 5, x: 0.35, y: 0.22, z: -0.15, sy: 1.2, hex2: EGG_HI }));
      // Red label band
      parts.push(box(0.8, 0.18, 0.82, 0xc83030, { y: 0.25 }));
      parts.push(box(0.7, 0.12, 0.05, 0xf8d848, { y: 0.26, z: 0.42 })); // gold text
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] miner_lamp_vintage — vintage carbide mining lamp              */
  /* ---------------------------------------------------------------- */
  {
    id: 'miner_lamp_vintage',
    displayName: '礦工油燈',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc8a060, 0xd8b878, 0xa88848, 0xe8c888],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const BRASS = 0xc8a060;
      const BRASS_HI = 0xe8c888;
      const GLASS = 0xf8e8c8;
      const parts = [];
      // Water tank (lower cylindrical body)
      parts.push(cyl(0.5, 0.55, 0.7, 8, BRASS, { y: 0.35, hex2: BRASS_HI }));
      // Carbide chamber (upper section)
      parts.push(cyl(0.45, 0.42, 0.5, 8, BRASS, { y: 0.9 }));
      // Reflector dish behind burner
      parts.push(cyl(0.52, 0.3, 0.25, 8, BRASS_HI, { y: 1.28 }));
      // Glass chimney
      parts.push(cyl(0.18, 0.2, 0.4, 6, GLASS, { y: 1.5 }));
      // Hook/handle on top
      parts.push(torus(0.22, 0.04, 5, 8, BRASS, { y: 1.85, rx: HALF_PI }));
      // Burner tip
      parts.push(cone(0.08, 0.12, 6, 0xffd84d, { y: 1.35 }));
      // Control valve knob
      parts.push(cyl(0.08, 0.08, 0.08, 6, 0x4a3a2a, { x: 0.5, y: 0.7, rz: HALF_PI }));
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
    yOffset: -0.85, // pencil lying on its side (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        cyl(0.26, 0.26, 2.7, 6, 0xffffff, { rz: HALF_PI, x: -0.1 }), // painted hex barrel (tinted, 6-side = hex)
        // sharpened wood cone + graphite tip at +x end
        cone(0.26, 0.45, 6, 0xe7c9a0, { rz: -HALF_PI, x: 1.45 }), // bare wood cone
        cone(0.1, 0.18, 6, 0x33363c, { rz: -HALF_PI, x: 1.72 }), // graphite point
        // metal ferrule + eraser at -x end
        cyl(0.29, 0.29, 0.35, 8, 0xb8bcc4, { rz: HALF_PI, x: -1.62 }), // aluminium ferrule
        cyl(0.27, 0.27, 0.35, 8, 0xf09bb0, { rz: HALF_PI, x: -1.95 }), // pink eraser
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] agei_mini 阿給小盤 — Tamsui A-ge (stuffed tofu) mini serving   */
  /* ---------------------------------------------------------------- */
  {
    id: 'agei_mini',
    displayName: '阿給小盤',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8a050, 0xc89040, 0xe8b060, 0xf8c070],
    yOffset: -0.72,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Small serving of Tamsui A-ge (fried tofu stuffed with noodles)
      const TOFU = 0xd8a050;
      const TOFU_HI = 0xe8b060;
      const PLATE = 0xf0f0f0;
      const parts = [];
      // Small plate
      parts.push(cyl(1.0, 1.0, 0.12, 10, PLATE, { y: 0.06 }));
      parts.push(cyl(0.85, 0.85, 0.08, 10, 0xe8e8e8, { y: 0.12 }));
      // A-ge tofu (triangular fried tofu pouch)
      parts.push(box(0.6, 0.4, 0.5, TOFU, { y: 0.38, hex2: TOFU_HI }));
      // Stuffed appearance (slight bulge)
      parts.push(sph(0.25, TOFU_HI, { ws: 5, hs: 4, y: 0.42, z: 0.05 }));
      // Sauce drizzle (dark sweet sauce)
      parts.push(box(0.5, 0.04, 0.4, 0x4a2810, { y: 0.58 }));
      parts.push(box(0.3, 0.04, 0.3, 0x5a3820, { y: 0.58, x: 0.15 }));
      // Noodles peeking out
      parts.push(cyl(0.05, 0.05, 0.3, 4, 0xf8f0e0, { y: 0.35, rz: 0.2, x: -0.2 }));
      parts.push(cyl(0.05, 0.05, 0.25, 4, 0xf8f0e0, { y: 0.38, rz: -0.15, x: 0.15 }));
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
