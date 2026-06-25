/**
 * @file packs/miaoli/archetypes/t0.js — Roll Formosa Miaoli pack, TIER 0
 *   客庄柑仔店 (Hakka corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/miaoli/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
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
 *
 * T0 theme: 客庄柑仔店 — Hakka village corner store items
 * Items: marble, eraser, pushpin, strawberry_candy, leicha_packet,
 *        ngiauimia_card, pencil, button, scratch_card_board, fortune_stick_tube
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T0_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] tung_blossom_petal 桐花瓣 — fallen white tung blossom petal    */
  /*     The iconic 油桐花 petals that blanket Miaoli in spring          */
  /* ---------------------------------------------------------------- */
  {
    id: 'tung_blossom_petal',
    displayName: '桐花瓣',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xffffff, 0xfff8f0, 0xfff0e8, 0xf8f4f0, 0xffeee0],
    yOffset: -0.92, // flat petal lying on ground
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // White tung blossom petal (油桐花瓣) — the "May snow" symbol of Miaoli.
      // Five-petaled flower form, each petal is a rounded elongated shape.
      const parts = [];
      // Five petals radiating from center
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * PI * 2;
        parts.push(
          sph(0.35, 0xffffff, {
            ws: 5, hs: 3,
            sx: 0.8, sy: 0.15, sz: 0.45,
            x: Math.cos(a) * 0.5,
            z: Math.sin(a) * 0.5,
            y: 0.08,
            ry: a,
          })
        );
      }
      // Yellow stamen center
      parts.push(cyl(0.15, 0.15, 0.1, 6, 0xffd84d, { y: 0.1 }));
      // tiny red-orange stamens
      parts.push(sph(0.06, 0xff6040, { ws: 4, hs: 2, x: 0.08, y: 0.15, z: 0.05 }));
      parts.push(sph(0.06, 0xff6040, { ws: 4, hs: 2, x: -0.06, y: 0.15, z: 0.08 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] hakka_flower_sachet 客家花布香包 — Hakka floral fabric sachet    */
  /*     The iconic blue/pink floral fabric sachets sold in Miaoli       */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_flower_sachet',
    displayName: '客家花布香包',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a6a9a, 0xff6b8a, 0x3a5a8a, 0xe8405a, 0x6a8aaa],
    yOffset: -0.45, // sachet resting flat
    upright: false,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Traditional Hakka floral fabric sachet (客家花布香包).
      // Pillow-shaped pouch with characteristic blue/pink flower patterns.
      return finish([
        // main sachet body (pillow-shaped, slightly rounded)
        sph(0.8, 0xffffff, { ws: 8, hs: 5, sx: 1.4, sy: 0.5, y: 0.3, hex2: 0xf0e8f0 }),
        // Hakka flower pattern (simplified as colored patches)
        sph(0.2, 0xff6b8a, { ws: 4, hs: 2, x: 0.3, y: 0.4, z: 0.3 }), // pink flower
        sph(0.15, 0x4a6a9a, { ws: 4, hs: 2, x: -0.25, y: 0.38, z: 0.25 }), // blue flower
        sph(0.12, 0x3a8a4a, { ws: 4, hs: 2, x: 0.0, y: 0.42, z: 0.4 }), // green leaf
        sph(0.18, 0xe84060, { ws: 4, hs: 2, x: -0.35, y: 0.36, z: -0.15 }), // red flower
        // top gathered tie (ribbon/string closure)
        cyl(0.1, 0.08, 0.3, 5, 0xf4e8c8, { y: 0.55 }), // gathered top
        box(0.6, 0.06, 0.08, 0xff6b8a, { y: 0.65 }), // ribbon bow
        box(0.12, 0.15, 0.06, 0xff6b8a, { x: 0.2, y: 0.72 }), // bow loop
        box(0.12, 0.15, 0.06, 0xff6b8a, { x: -0.2, y: 0.72 }), // bow loop
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
  /* [3] strawberry_candy 草莓糖 — twist-wrap strawberry candy           */
  /*     Miaoli Dahu strawberry-themed candy with pink wrapper         */
  /* ---------------------------------------------------------------- */
  {
    id: 'strawberry_candy',
    displayName: '草莓糖',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xff6b8a, 0xff4a6a, 0xffa0b8, 0xe8405a, 0xffb8c8],
    yOffset: -0.49, // resting on its side
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // strawberry-red candy body (oval)
        sph(0.9, 0xffffff, { ws: 10, hs: 7, x: 0.0, sx: 1.25 }), // candy body (tinted pink)
        // wrapper stripe band over the body — classic candy look
        torus(0.62, 0.16, 6, 10, 0xff4a6a, { ry: HALF_PI, x: 0.0 }), // strawberry stripe
        // twisted wrapper ends: cones fanning outward at each tip
        cone(0.5, 0.7, 8, 0xfff0f4, { rz: -HALF_PI, x: 1.15 }), // right twist
        cone(0.5, 0.7, 8, 0xfff0f4, { rz: HALF_PI, x: -1.15 }), // left twist
        cone(0.34, 0.46, 6, 0xffe2ea, { rz: -HALF_PI, x: 1.55 }), // right twist tip
        cone(0.34, 0.46, 6, 0xffe2ea, { rz: HALF_PI, x: -1.55 }), // left twist tip
        // tiny strawberry seed dots on the candy body
        sph(0.08, 0xffd84d, { ws: 4, hs: 3, x: 0.3, y: 0.2, z: 0.6 }),
        sph(0.08, 0xffd84d, { ws: 4, hs: 3, x: -0.25, y: -0.1, z: 0.55 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] leicha_packet 擂茶粉包 — small packet of Hakka leicha powder    */
  /*     The iconic ground-tea powder sachet from Miaoli/Beipu         */
  /* ---------------------------------------------------------------- */
  {
    id: 'leicha_packet',
    displayName: '擂茶粉包',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0x9a7040, 0xc8a870],
    yOffset: -0.72, // packet lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // foil packet body — rectangular sachet
        box(1.8, 0.3, 1.2, 0xffffff, { y: 0.15 }), // main packet body (tinted brown)
        // top crimp seal
        box(1.8, 0.12, 0.08, 0xc8a870, { y: 0.32, z: -0.56 }),
        box(1.8, 0.12, 0.08, 0xc8a870, { y: 0.32, z: 0.56 }),
        // printed label area — green tea leaf motif
        box(1.2, 0.32, 0.7, 0x4a7a3a, { y: 0.16 }),
        // Chinese characters area (cream strip)
        box(0.8, 0.34, 0.3, 0xf4e8c8, { y: 0.17, z: 0.0 }),
        // small Hakka flower emblem
        cyl(0.15, 0.15, 0.05, 6, 0xff6b8a, { y: 0.34, x: 0.5, z: 0.0 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] hakka_round_tag 客家圓牌 — Hakka village blessing tag           */
  /*     Traditional red round blessing tags hung at Hakka temples       */
  /* ---------------------------------------------------------------- */
  {
    id: 'hakka_round_tag',
    displayName: '客家圓牌',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.025,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe84838, 0xb82818, 0xf4e8c8, 0xd84030],
    yOffset: -0.92, // flat tag lying down
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Hakka blessing tag (客家圓牌) — red with gold characters,
      // often seen at 義民廟 and other Hakka temples in Miaoli.
      return finish([
        cyl(1.0, 1.0, 0.08, 14, 0xffffff, { y: 0.04 }), // main red disc (tinted)
        cyl(0.88, 0.88, 0.09, 14, 0xf4e8c8, { y: 0.05 }), // cream inner field
        cyl(0.78, 0.78, 0.095, 12, 0xc83828, { y: 0.055 }), // red blessing text area
        // simplified 福 character (blessing) as cross pattern
        box(0.5, 0.1, 0.08, 0xf0b429, { y: 0.06 }), // horizontal gold stroke
        box(0.08, 0.1, 0.5, 0xf0b429, { y: 0.06 }), // vertical gold stroke
        box(0.35, 0.1, 0.06, 0xf0b429, { y: 0.065, z: 0.18 }), // top stroke
        box(0.35, 0.1, 0.06, 0xf0b429, { y: 0.065, z: -0.18 }), // bottom stroke
        // hanging hole at top
        cyl(0.08, 0.08, 0.12, 6, 0x2a2a2e, { y: 0.04, z: 0.85 }),
        // red tassel hint
        box(0.06, 0.06, 0.3, 0xc83828, { y: 0.03, z: 1.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] wood_carving_chip 木雕屑 — curled wood shaving/chip from carving */
  /*     The byproduct of 三義's famous woodcarving industry              */
  /* ---------------------------------------------------------------- */
  {
    id: 'wood_carving_chip',
    displayName: '木雕屑',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.03,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xc8a870, 0xe8d8b0, 0x9a7a4a, 0xb89860, 0xd8c090],
    yOffset: -0.75, // curled chip lying on surface
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Curled wood shaving (木雕屑) — the fragrant camphor/hinoki chips
      // found around Sanyi's woodcarving workshops.
      const parts = [];
      // Main curled shaving — a partial torus with thin cross-section
      parts.push(torus(0.7, 0.08, 4, 10, 0xffffff, { arc: PI * 1.5, y: 0.3, rz: 0.3 }));
      // second thinner curl
      parts.push(torus(0.5, 0.06, 4, 8, 0xc8a870, { arc: PI, y: 0.25, x: 0.2, rz: -0.4 }));
      // a few small chip fragments
      parts.push(box(0.3, 0.05, 0.12, 0xe8d8b0, { x: -0.4, y: 0.05, z: 0.3, ry: 0.5 }));
      parts.push(box(0.25, 0.04, 0.1, 0xd8c090, { x: 0.35, y: 0.04, z: -0.25, ry: -0.3 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] ceramic_bowl 苗栗陶瓷碗 — traditional Hakka ceramic rice bowl    */
  /* ---------------------------------------------------------------- */
  {
    id: 'ceramic_bowl',
    displayName: '陶瓷碗',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.06,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf4f0e8, 0x4a6a9a, 0xe8e4dc, 0x3a5a8a, 0xc8c4b8],
    yOffset: -0.55, // bowl sitting upright
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Hakka ceramic rice bowl — Miaoli has a pottery tradition.
      // White/cream glazed bowl with blue floral patterns.
      const parts = [
        // bowl body (tapered cylinder, wider at top)
        cyl(0.9, 0.5, 0.7, 10, 0xffffff, { y: 0.4, hex2: 0xf4f0e8 }),
        // rim
        cyl(0.95, 0.9, 0.08, 10, 0xe8e4dc, { y: 0.76 }),
        // foot ring base
        cyl(0.4, 0.45, 0.12, 8, 0xe8e4dc, { y: 0.06 }),
        // interior (slightly darker)
        cyl(0.82, 0.4, 0.5, 8, 0xd8d4cc, { y: 0.5 }),
      ];
      // Blue floral pattern bands (simplified as colored rings)
      parts.push(cyl(0.92, 0.88, 0.08, 10, 0x4a6a9a, { y: 0.35, open: true }));
      parts.push(cyl(0.78, 0.74, 0.06, 10, 0x3a5a8a, { y: 0.55, open: true }));
      // small flower motif dots
      parts.push(sph(0.08, 0x4a6a9a, { ws: 4, hs: 2, x: 0.6, y: 0.45, z: 0.4 }));
      parts.push(sph(0.08, 0x4a6a9a, { ws: 4, hs: 2, x: -0.55, y: 0.45, z: 0.45 }));
      parts.push(sph(0.08, 0x3a5a8a, { ws: 4, hs: 2, x: 0.0, y: 0.45, z: 0.7 }));
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
