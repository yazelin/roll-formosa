/**
 * @file packs/yunlin/archetypes/t0.js — Roll Formosa Yunlin pack, TIER 0
 *   戲棚腳柑仔店 (puppet-stage corner-store trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/yunlin/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [0] peanut_shell_bit 土豆殼碎 — broken peanut shell fragment        */
  /* ---------------------------------------------------------------- */
  {
    id: 'peanut_shell_bit',
    displayName: '土豆殼碎',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.20,
    spawnWeight: 1.0,
    palette: [0xc8a060, 0xd8b070, 0xb89050, 0xe8c080, 0xa88040],
    yOffset: -0.45, // shell fragment lying flat
    upright: false,
    collisionScale: 0.80,
    buildGeometry(rng) {
      // Yunlin peanut shell fragment - broken piece from shelling
      return finish([
        // curved shell fragment (half of a peanut lobe)
        sph(0.7, 0xffffff, { ws: 7, hs: 5, sy: 0.45, thetaLen: PI * 0.7 }),
        // rough edge where shell broke
        box(0.8, 0.08, 0.5, 0xa88040, { y: -0.1, rz: 0.2 }),
        // shell texture ridges
        box(0.6, 0.04, 0.08, 0xb89050, { y: 0.15, z: 0.2 }),
        box(0.5, 0.04, 0.08, 0xb89050, { y: 0.12, z: -0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] soy_sauce_cap 醬油蓋 — Xiluo soy sauce bottle cap              */
  /* ---------------------------------------------------------------- */
  {
    id: 'soy_sauce_cap',
    displayName: '醬油蓋',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xd84838, 0xb82818, 0xe85848],
    yOffset: -0.72, // cap lying flat
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Iconic red plastic cap from Xiluo soy sauce bottles
      return finish([
        // Main cap body (red plastic)
        cyl(1.0, 1.0, 0.35, 10, 0xffffff, { y: 0.18 }),
        // Ribbed grip texture around the side
        cyl(1.05, 1.05, 0.28, 12, 0xd82818, { y: 0.18, open: true }),
        // Top surface with spout hole
        cyl(1.0, 1.0, 0.06, 10, 0xffffff, { y: 0.38 }),
        // Central dispensing nozzle
        cyl(0.25, 0.2, 0.18, 8, 0xffffff, { y: 0.5 }),
        cyl(0.15, 0.15, 0.06, 8, 0x2a1a10, { y: 0.58 }), // dark hole
        // Inner threading ridge
        cyl(0.85, 0.85, 0.1, 10, 0xb82818, { y: 0.08 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] incense_stub 香腳 — burnt incense stick base (北港香)           */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_stub',
    displayName: '香腳',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc83820, 0xd84828, 0xb82810, 0xe85838, 0xa82008],
    yOffset: -0.85, // stub lying on its side
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Burnt incense stick base - from Beigang Mazu temple visits
      return finish([
        // bamboo stick core (natural tan)
        cyl(0.08, 0.08, 2.4, 5, 0xd8b878, { rz: HALF_PI }),
        // remaining red coating on the dipped end
        cyl(0.1, 0.1, 0.6, 5, 0xffffff, { rz: HALF_PI, x: -0.9 }),
        // charred burnt tip
        cone(0.08, 0.2, 5, 0x2a2018, { rz: HALF_PI, x: 1.3 }),
        // ash residue ring
        cyl(0.12, 0.1, 0.15, 5, 0x8a8078, { rz: HALF_PI, x: 1.1 }),
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
  /* [4] peanut_pod 花生 — Yunlin's iconic peanut in shell              */
  /* ---------------------------------------------------------------- */
  {
    id: 'peanut_pod',
    displayName: '花生',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8b878, 0xc8a060, 0xe8c888, 0xb89048],
    yOffset: -0.48, // peanut lying on its side
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Peanut shell: two lobes with a pinch in the middle
      return finish([
        // Left lobe (larger)
        sph(0.7, 0xffffff, { ws: 8, hs: 6, x: -0.55, sy: 0.8, sz: 0.8 }),
        // Right lobe (slightly smaller)
        sph(0.6, 0xffffff, { ws: 8, hs: 6, x: 0.45, sy: 0.75, sz: 0.75 }),
        // Pinch / waist connecting the lobes
        cyl(0.35, 0.35, 0.3, 8, 0xffffff, { rz: HALF_PI, x: -0.05 }),
        // Shell texture ridges (longitudinal lines)
        box(1.6, 0.04, 0.06, 0xc8a060, { y: 0.3, z: 0.0 }),
        box(1.6, 0.04, 0.06, 0xc8a060, { y: -0.1, z: 0.25 }),
        box(1.6, 0.04, 0.06, 0xc8a060, { y: -0.1, z: -0.25 }),
        // Stem nub at one end
        cyl(0.12, 0.08, 0.15, 6, 0xa88040, { x: -1.0, rz: HALF_PI }),
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
  /* [6] fortune_slip 籤紙 — red fortune paper slip from temple         */
  /* ---------------------------------------------------------------- */
  {
    id: 'fortune_slip',
    displayName: '籤紙',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf0d8a0, 0xf8e0b0, 0xe8c890, 0xf4d898, 0xf0c880],
    yOffset: -0.92, // paper lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Temple fortune slip paper (籤詩) - common at Beigang Mazu
      return finish([
        // thin paper slip body (yellowish traditional paper)
        box(2.2, 0.04, 0.9, 0xffffff, { y: 0.02 }),
        // red border trim
        box(2.22, 0.05, 0.06, 0xc83020, { y: 0.03, z: 0.42 }),
        box(2.22, 0.05, 0.06, 0xc83020, { y: 0.03, z: -0.42 }),
        box(0.06, 0.05, 0.9, 0xc83020, { y: 0.03, x: 1.08 }),
        box(0.06, 0.05, 0.9, 0xc83020, { y: 0.03, x: -1.08 }),
        // printed text lines (black ink)
        box(1.6, 0.03, 0.08, 0x2a2018, { y: 0.04, z: 0.2 }),
        box(1.4, 0.03, 0.08, 0x2a2018, { y: 0.04, z: 0.0 }),
        box(1.5, 0.03, 0.08, 0x2a2018, { y: 0.04, z: -0.2 }),
        // fortune number stamp (red seal)
        cyl(0.15, 0.15, 0.02, 6, 0xc83020, { y: 0.05, x: 0.8, z: 0.3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] incense_coil 線香環 — Beigang spiral incense coil (北港香)       */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_coil',
    displayName: '線香環',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83a20, 0xd84a28, 0xb83018, 0xe85a38, 0xa82810],
    yOffset: -0.90, // coil lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Spiral incense coil - iconic Beigang temple product (low-seg for tri budget)
      return finish([
        // Outer coil ring (reduced segments)
        torus(0.9, 0.08, 4, 8, 0xffffff, { y: 0.1 }),
        // Middle coil ring
        torus(0.65, 0.07, 4, 7, 0xffffff, { y: 0.1 }),
        // Inner coil ring
        torus(0.4, 0.06, 4, 6, 0xffffff, { y: 0.1 }),
        // Center nub
        cyl(0.15, 0.12, 0.12, 5, 0xffffff, { y: 0.1 }),
        // Hanging string loop at center
        torus(0.08, 0.02, 3, 5, 0xc8a060, { y: 0.2, rx: HALF_PI }),
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
