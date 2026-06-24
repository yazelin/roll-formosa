/**
 * @file packs/changhua/archetypes/t0.js — Roll Formosa Changhua pack, TIER 0
 *   鹿港柑仔店桌頭 (corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/changhua/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [0] flour_tea_packet 麵茶包 — Lukang specialty roasted flour tea   */
  /* ---------------------------------------------------------------- */
  {
    id: 'flour_tea_packet',
    displayName: '麵茶包',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8a868, 0xb89858, 0xd8b878, 0xe0c888, 0xa08048],
    yOffset: -0.55, // packet lying flat
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // Small sachet packet (rectangular pouch)
        box(1.4, 0.3, 1.0, 0xffffff, { y: 0.15 }), // paper/plastic packet (tinted)
        // Serrated seal edge at top
        box(1.4, 0.08, 0.08, 0xc8a868, { y: 0.32, z: 0.46 }),
        // Printed label with red accent
        box(0.9, 0.2, 0.02, 0xc83828, { y: 0.18, z: 0.52 }),
        // Content bulge showing flour tea inside
        sph(0.35, 0xd8c088, { ws: 6, hs: 4, sy: 0.3, y: 0.18 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] incense_coil 小盤香 — mini spiral incense coil from Lukang      */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_coil',
    displayName: '小盤香',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc84028, 0xb83820, 0xd84830, 0xa83018],
    yOffset: -0.90, // flat coil lying on surface
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      const parts = [];
      // Spiral coil (approximated with 3 concentric rings - reduced from 5 for tri budget)
      parts.push(torus(0.90, 0.08, 4, 8, 0xffffff, { y: 0.08 }));
      parts.push(torus(0.55, 0.08, 4, 8, 0xffffff, { y: 0.08 }));
      parts.push(torus(0.25, 0.08, 4, 6, 0xffffff, { y: 0.08 }));
      // Center point
      parts.push(cyl(0.12, 0.12, 0.10, 5, 0xffffff, { y: 0.05 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] bagua_postcard 八卦山明信片 — postcard with Great Buddha image  */
  /* ---------------------------------------------------------------- */
  {
    id: 'bagua_postcard',
    displayName: '八卦山明信片',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a9ac8, 0x3a7aa8, 0x6abae8, 0xf0e8d0, 0x2a6a98],
    yOffset: -0.90, // flat card lying down
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // Postcard body (rectangular card)
        box(1.6, 0.06, 1.1, 0xffffff, { y: 0.03 }), // white card stock (tinted)
        // Photo area (sky blue gradient for 八卦山 scenery)
        box(1.4, 0.065, 0.9, 0x6abadf, { y: 0.035 }),
        // Buddha silhouette (simplified golden icon)
        sph(0.25, 0xd8b050, { ws: 6, hs: 4, sy: 1.3, y: 0.08 }),
        // Red stamp in corner
        box(0.2, 0.07, 0.2, 0xc83828, { x: 0.6, z: 0.4, y: 0.04 }),
        // Text line at bottom
        box(1.2, 0.065, 0.12, 0x2a3a4a, { y: 0.035, z: -0.4 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] lukang_candy 鹿港糖 — traditional wrapped Lukang candy          */
  /* ---------------------------------------------------------------- */
  {
    id: 'lukang_candy',
    displayName: '鹿港糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd83a2e, 0xf0b429, 0x1f9e4a, 0xcf5226, 0xcfd4da],
    yOffset: -0.49, // resting on its side
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        sph(0.85, 0xffffff, { ws: 10, hs: 7, sx: 1.2 }), // candy body (tinted)
        // traditional wrapper with gold foil accents
        torus(0.58, 0.14, 6, 10, 0xf0b429, { ry: HALF_PI }), // gold band
        cone(0.45, 0.6, 8, 0xfff0f4, { rz: -HALF_PI, x: 1.05 }), // right twist
        cone(0.45, 0.6, 8, 0xfff0f4, { rz: HALF_PI, x: -1.05 }), // left twist
        cone(0.30, 0.40, 6, 0xffe2ea, { rz: -HALF_PI, x: 1.40 }), // right twist tip
        cone(0.30, 0.40, 6, 0xffe2ea, { rz: HALF_PI, x: -1.40 }), // left twist tip
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] fan_charm 扇墜 — mini decorative fan charm from Lukang          */
  /* ---------------------------------------------------------------- */
  {
    id: 'fan_charm',
    displayName: '扇墜',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf4ece0, 0xe8dcc8, 0xc8a868, 0xf8d0a0],
    yOffset: -0.55, // flat fan lying down
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // Fan surface (half-sphere flattened)
      parts.push(sph(0.9, 0xffffff, {
        ws: 10, hs: 5,
        sy: 0.08,
        thetaLen: PI,
        y: 0.4,
      }));
      // Handle
      parts.push(cyl(0.08, 0.08, 0.5, 4, 0xc8a868, { y: 0.05 }));
      // Decorative tassel
      parts.push(cyl(0.04, 0.04, 0.25, 4, 0xc82828, { y: -0.20 }));
      parts.push(sph(0.06, 0xf0b429, { ws: 4, hs: 3, y: -0.35 }));
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
  /* [6] calligraphy_brush 小毛筆 — mini brush for Lukang calligraphy    */
  /* ---------------------------------------------------------------- */
  {
    id: 'calligraphy_brush',
    displayName: '小毛筆',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x8b5a28, 0x6b4520, 0xa06830, 0x7a4a20],
    yOffset: -0.85, // brush lying on its side
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // bamboo handle
        cyl(0.22, 0.22, 2.2, 6, 0xffffff, { rz: HALF_PI, x: -0.2 }), // bamboo shaft (tinted)
        // metal ferrule
        cyl(0.24, 0.24, 0.25, 8, 0xb8bcc4, { rz: HALF_PI, x: 1.0 }),
        // brush tip (cone of bristles)
        cone(0.22, 0.7, 8, 0x2a2420, { rz: -HALF_PI, x: 1.55 }), // dark bristles
        // decorative cap end
        sph(0.24, 0xc82828, { ws: 6, hs: 4, x: -1.35 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] temple_bead 廟珠 — wooden temple prayer bead                    */
  /* ---------------------------------------------------------------- */
  {
    id: 'temple_bead',
    displayName: '廟珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8b4513, 0x654321, 0xa0522d, 0x5d3a1a, 0x704214],
    yOffset: 0, // sphere sitting on the ground
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        sph(0.95, 0xffffff, { ws: 10, hs: 8 }), // wooden bead (tinted brown)
        // hole through center
        cyl(0.15, 0.15, 2.0, 6, 0x2a1c14, { }), // dark hole
        // carved ring decoration
        torus(0.85, 0.08, 6, 12, 0x3c2814, { }),
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
