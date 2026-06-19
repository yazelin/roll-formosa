/**
 * @file packs/taichung/archetypes/t0.js — Roll Formosa Taichung pack, TIER 0
 *   中區老城柑仔店桌頭 (old-town corner-store tabletop trinkets), the smallest
 *   absorbable band (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/taichung/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 戳戳樂板 / 籤筒, spawnWeight ~0.3).
 *
 * Localized from Taipei t0: almost all pan-Taiwan 文具/桌頭 generics are kept
 * verbatim (彈珠/橡皮擦/圖釘/尪仔標/鉛筆/鈕扣 + 戳戳樂板/籤筒). Two slots are
 * re-flavoured to 台中中區老雜貨味: the generic soda cap → 黑松汽水蓋 (the
 * quintessential old-grocery crown cap), and the candy → 王子麵 (Wei Lih's
 * central-Taiwan snack-noodle brick that kids crush and eat dry at the 桌頭).
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
        cone(0.32, 1.2, 8, 0xdfe3ea, { ry: 0, y: -0.55 }), // steel spike pointing down (cone apex down)
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] heysong_cap 黑松汽水蓋 — TAICHUNG SWAP: crimped HeySong soda    */
  /*     crown cap (老柑仔店 sarsaparilla brown body + red star face)    */
  /* ---------------------------------------------------------------- */
  {
    id: 'heysong_cap',
    displayName: '黑松汽水蓋',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x5a2f1a, 0x6e3a20, 0x4f2715, 0x7a4326, 0xc0392b],
    yOffset: -0.75, // crown sitting flat-down (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.16, 14, 0xffffff, { y: 0.42 }), // top disc (printed face, tinted sarsaparilla brown)
        cyl(1.04, 1.04, 0.4, 14, 0xffffff, { y: 0.2 }), // crimped skirt (tinted)
        cyl(0.62, 0.62, 0.06, 12, 0xc0392b, { y: 0.51 }), // red brand medallion (黑松 red roundel)
        cyl(0.3, 0.3, 0.07, 10, 0xf4d23a, { y: 0.535 }), // gold inner emblem plate (柑仔店 印象)
      ];
      // crimp teeth around the skirt (low-count ring of tiny boxes)
      const teeth = 12;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * PI * 2;
        parts.push(box(0.14, 0.42, 0.1, 0x7a4326, { x: Math.cos(a) * 1.04, z: Math.sin(a) * 1.04, ry: -a, y: 0.2 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] prince_noodle 王子麵 — TAICHUNG SWAP: Wei Lih snack-noodle      */
  /*     brick (central-TW 柑仔店 staple; yellow noodle slab + wrapper)  */
  /* ---------------------------------------------------------------- */
  {
    id: 'prince_noodle',
    displayName: '王子麵',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf2b53a, 0xe8a52c, 0xf6c24e, 0xeeb030],
    yOffset: -0.73, // brick lying flat on the table (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      const parts = [
        // crinkly fried noodle slab (slightly domed top via two stacked boxes)
        box(2.0, 0.5, 1.5, 0xffffff, { y: 0.3 }), // noodle brick body (tinted golden)
        box(1.7, 0.18, 1.2, 0xffffff, { y: 0.62 }), // raised crinkle crown (tinted)
        // clear cellophane wrapper hint: thin bright edge bands
        box(2.06, 0.12, 1.56, 0xfff0c4, { y: 0.12 }), // wrapper bottom seam
        box(2.06, 0.12, 1.56, 0xfff0c4, { y: 0.52 }), // wrapper upper seam
        // printed label band across the middle (red brand stripe + white panel)
        box(0.9, 0.56, 1.58, 0xd23b2e, { y: 0.32 }), // red label band
        box(0.62, 0.34, 1.6, 0xf6f1e4, { y: 0.32 }), // white label panel
        box(0.34, 0.16, 1.62, 0xf2b53a, { y: 0.32 }), // tiny gold seasoning-pack flash
      ];
      // a couple of noodle-texture ridges baked dark on the crown
      for (let i = -1; i <= 1; i++) {
        parts.push(box(1.5, 0.06, 0.1, 0xc8902a, { x: 0.0, z: i * 0.34, y: 0.72 }));
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
