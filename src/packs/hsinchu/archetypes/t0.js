/**
 * @file packs/hsinchu/archetypes/t0.js — Roll Formosa Hsinchu pack, TIER 0
 *   城隍廟口柑仔店 (city god temple corner store trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/hsinchu/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
  /* [0] hsinchu_glass_marble 新竹玻璃珠 — Hsinchu glass craft marble    */
  /* ---------------------------------------------------------------- */
  {
    id: 'hsinchu_glass_marble',
    displayName: '新竹玻璃珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3fbfff, 0x49c45f, 0xff5340, 0xffd84d, 0xa86adf],
    yOffset: 0, // sphere sitting on the ground = centered
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Hsinchu's famous glass industry — artisan glass marble
      return finish([
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }), // clear glass body (tinted by palette)
        // internal decorative spiral (Hsinchu glass craft signature)
        torus(0.4, 0.08, 5, 6, 0x3fbfff, { y: 0.1, rx: 0.3 }), // inner glass ring
        torus(0.5, 0.06, 5, 6, 0xffd84d, { y: -0.1, rx: -0.2 }), // golden accent
        sph(0.2, 0xff5340, { ws: 5, hs: 4 }), // colored core
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] glass_bead_craft 玻璃珠工藝 — Hsinchu glass craft bead         */
  /* ---------------------------------------------------------------- */
  {
    id: 'glass_bead_craft',
    displayName: '玻璃珠工藝',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3f8cff, 0xff5340, 0x49c45f, 0xffd84d, 0xa86adf],
    yOffset: -0.68, // bead resting on table
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Hsinchu's famous glass craft industry — decorative glass bead
      return finish([
        // outer glass sphere (clear tinted) - reduced segments
        sph(1.0, 0xffffff, { ws: 8, hs: 6 }),
        // inner decorative swirls (Hsinchu glass craft signature) - reduced segments
        torus(0.4, 0.1, 5, 6, 0xff5340, { y: 0.0 }),
        torus(0.5, 0.08, 5, 6, 0x3f8cff, { y: 0.15, rx: 0.5 }),
        // center golden sparkle core - reduced segments
        sph(0.25, 0xffd84d, { ws: 5, hs: 3 }),
        // threading hole suggestion
        cyl(0.08, 0.08, 1.4, 5, 0x2a2a2a, { rz: HALF_PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] meatball_pick 貢丸籤 — Hsinchu meatball on toothpick          */
  /* ---------------------------------------------------------------- */
  {
    id: 'meatball_pick',
    displayName: '貢丸籤',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd4a87a, 0xc89868, 0xe0b08a, 0xb88858, 0xf0c8a0],
    yOffset: -0.15, // meatball standing on pick
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Hsinchu famous 貢丸 (pork meatball) on a bamboo toothpick
      return finish([
        // meatball body (slightly irregular sphere)
        sph(0.8, 0xffffff, { ws: 8, hs: 6, y: 0.9 }),
        // surface texture bumps (cooked meatball texture)
        sph(0.15, 0xc89868, { ws: 5, hs: 3, x: 0.4, y: 1.0, z: 0.3 }),
        sph(0.12, 0xb88858, { ws: 5, hs: 3, x: -0.3, y: 1.1, z: 0.35 }),
        sph(0.1, 0xd4a87a, { ws: 5, hs: 3, x: 0.2, y: 0.7, z: -0.4 }),
        // bamboo toothpick
        cyl(0.06, 0.04, 1.6, 5, 0xe8d2a6, { y: 0.1 }),
        // pick tip (pointed bottom)
        cone(0.04, 0.3, 5, 0xd8c296, { rx: PI, y: -0.6 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] bamboo_copter 竹蜻蜓 — traditional bamboo toy helicopter        */
  /* ---------------------------------------------------------------- */
  {
    id: 'bamboo_copter',
    displayName: '竹蜻蜓',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd4a76a, 0xc89858, 0xe8c080, 0xb88848, 0xf0d8a8],
    yOffset: -0.65, // lying on its side
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // central bamboo shaft (the stick you spin between palms)
        cyl(0.08, 0.06, 2.2, 6, 0xd4a76a, { y: 0.0 }),
        // rotor hub at the top
        cyl(0.16, 0.16, 0.12, 6, 0xc89858, { y: 1.1 }),
        // two opposing rotor blades (thin, angled for aerodynamics)
        box(1.8, 0.05, 0.28, 0xe8c080, { y: 1.16, rz: 0.15, hex2: 0xd4a76a }),
        box(1.8, 0.05, 0.28, 0xe8c080, { y: 1.16, rz: -0.15, ry: PI, hex2: 0xd4a76a }),
        // blade tips - slightly darker
        box(0.3, 0.06, 0.26, 0xb88848, { x: 0.85, y: 1.16, rz: 0.15 }),
        box(0.3, 0.06, 0.26, 0xb88848, { x: -0.85, y: 1.16, rz: -0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] rice_candy 米粉糖 — Hsinchu specialty rice noodle candy         */
  /* ---------------------------------------------------------------- */
  {
    id: 'rice_candy',
    displayName: '米粉糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.016,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0xf4e8d0, 0xfff8f0, 0xe8dcc8, 0xfaf5ea],
    yOffset: -0.72, // resting flat
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        // rectangular block of compressed rice noodle candy
        box(1.4, 0.5, 1.0, 0xffffff, { y: 0.25 }), // main candy block (tinted cream)
        // textured top surface - fine rice noodle threads
        box(1.38, 0.06, 0.98, 0xf4e8d0, { y: 0.52 }),
      ];
      // a few visible rice noodle strand lines on top
      for (let i = 0; i < 5; i++) {
        const z = -0.35 + i * 0.18;
        parts.push(box(1.3, 0.03, 0.04, 0xe8dcc8, { y: 0.54, z }));
      }
      // wrapper paper underneath (translucent wax paper look)
      parts.push(box(1.5, 0.04, 1.1, 0xfff8f0, { y: 0.0 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] mifun_chip 米粉餅乾 — Hsinchu rice noodle chip snack            */
  /* ---------------------------------------------------------------- */
  {
    id: 'mifun_chip',
    displayName: '米粉餅乾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0xf4e8d0, 0xe8dcc8, 0xfff8f0],
    yOffset: -0.90, // flat chip lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Hsinchu rice noodle chip — a local snack made from dried mifun
      return finish([
        // thin crispy rice chip (irregular round shape)
        cyl(1.0, 0.95, 0.08, 10, 0xffffff, { y: 0.04 }), // main chip (tinted cream)
        // surface texture - dried rice noodle pattern
        box(0.7, 0.02, 0.06, 0xe8dcc8, { y: 0.08, rz: 0.1 }),
        box(0.6, 0.02, 0.05, 0xf4e8d0, { y: 0.08, x: 0.2, rz: -0.2 }),
        box(0.5, 0.02, 0.04, 0xe8dcc8, { y: 0.08, x: -0.15, rz: 0.15 }),
        // slightly raised edge (fried crispy edge)
        cyl(1.02, 0.95, 0.04, 10, 0xd8c8b0, { y: 0.09, open: true }),
        // sesame seed specks
        sph(0.04, 0xc8b090, { ws: 4, hs: 3, x: 0.3, y: 0.1, z: 0.2 }),
        sph(0.03, 0xc8b090, { ws: 4, hs: 3, x: -0.25, y: 0.1, z: -0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] bamboo_chopstick 竹筷 — Hsinchu bamboo chopstick               */
  /* ---------------------------------------------------------------- */
  {
    id: 'bamboo_chopstick',
    displayName: '竹筷',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xd4a86a, 0xc49858, 0xe4c080, 0xb48848, 0xf0d8a8],
    yOffset: -0.85, // chopstick lying on its side
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Hsinchu bamboo chopstick — local bamboo craft
      return finish([
        // main shaft (square bamboo profile, tapered)
        cyl(0.22, 0.14, 2.8, 4, 0xffffff, { rz: HALF_PI, x: 0.0 }), // bamboo stick (tinted)
        // bamboo node rings (natural bamboo texture)
        cyl(0.24, 0.24, 0.08, 4, 0xb48848, { rz: HALF_PI, x: -0.6 }),
        cyl(0.23, 0.23, 0.08, 4, 0xc49858, { rz: HALF_PI, x: 0.4 }),
        // decorative carved end (traditional Hsinchu craft)
        cyl(0.25, 0.22, 0.25, 4, 0xd4a86a, { rz: HALF_PI, x: -1.3 }),
        box(0.18, 0.05, 0.05, 0xa07040, { rz: HALF_PI, x: -1.35 }), // carved pattern
        // tip (eating end, slightly pointed)
        cone(0.14, 0.2, 4, 0xe4c080, { rz: -HALF_PI, x: 1.5 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] glass_ornament 玻璃飾品 — Hsinchu glass craft ornament         */
  /* ---------------------------------------------------------------- */
  {
    id: 'glass_ornament',
    displayName: '玻璃飾品',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6fbfff, 0xbf6fff, 0xff6f9f, 0x6fff9f, 0xffd84d],
    yOffset: -0.75, // ornament lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Hsinchu glass ornament — decorative glass craft piece
      const parts = [
        // main glass disc (clear with color tint)
        cyl(1.0, 1.0, 0.18, 10, 0xffffff, { y: 0.12 }), // glass base (tinted)
        // decorative swirl pattern on top (Hsinchu glass craft)
        torus(0.5, 0.08, 5, 6, 0x6fbfff, { y: 0.22, rx: 0.1 }),
        torus(0.3, 0.06, 5, 5, 0xffd84d, { y: 0.24, rx: -0.1 }),
        // central flower/star motif
        sph(0.18, 0xff6f9f, { ws: 5, hs: 4, y: 0.26 }),
        // four petal accents
        sph(0.1, 0x6fff9f, { ws: 4, hs: 3, x: 0.35, y: 0.2, z: 0 }),
        sph(0.1, 0x6fff9f, { ws: 4, hs: 3, x: -0.35, y: 0.2, z: 0 }),
        sph(0.1, 0xbf6fff, { ws: 4, hs: 3, x: 0, y: 0.2, z: 0.35 }),
        sph(0.1, 0xbf6fff, { ws: 4, hs: 3, x: 0, y: 0.2, z: -0.35 }),
      ];
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
