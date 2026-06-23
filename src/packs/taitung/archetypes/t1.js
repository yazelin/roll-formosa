/**
 * @file packs/taitung/archetypes/t1.js — T1 鐵花夜市 (Tiehua night-market items).
 *
 * Tier 1 of the Roll Formosa Taitung ladder (鐵花夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/taitung/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (鐵花彩燈球 / 原民攤車, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band (radiusNominal, REAL meters): 0.05–0.25 m.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] rice_wine 米酒 — traditional Taiwan rice wine bottle          */
  /* ---------------------------------------------------------------- */
  {
    id: 'rice_wine',
    displayName: '米酒',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e4d8, 0xf4f0e8, 0xc8a040, 0x3a6a2a, 0xf8f4e8],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // glass bottle body
        cyl(0.5, 0.5, 1.6, 10, 0xf4f0e8, { y: 0.85, hex2: 0xe8e4d8 }),
        // bottle neck
        cyl(0.22, 0.35, 0.6, 8, 0xf0ece0, { y: 1.9 }),
        cyl(0.2, 0.2, 0.3, 8, 0xe8e0d0, { y: 2.35 }),
        // red cap
        cyl(0.24, 0.24, 0.2, 8, 0xc83020, { y: 2.6 }),
        // label
        box(0.9, 0.6, 0.06, 0xf0e8d0, { y: 0.9, z: 0.48 }),
        box(0.7, 0.4, 0.04, 0xc8a040, { y: 0.9, z: 0.51 }),
        // base
        cyl(0.52, 0.52, 0.12, 10, 0xe0dcd0, { y: 0.08 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] boar_skewer 烤山豬肉串 — grilled wild boar on skewer          */
  /* ---------------------------------------------------------------- */
  {
    id: 'boar_skewer',
    displayName: '烤山豬肉串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa85848, 0x884838, 0xf0e8d8, 0x4a3028, 0x8a6a4a],
    yOffset: -0.6019,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // wooden skewer stick running lengthwise (x)
        cyl(0.07, 0.07, 3.0, 6, 0x8a6a4a, { rz: HALF_PI, y: 0.0, hex2: 0x9a7a52 }),
        // chunks of grilled boar meat
        box(0.5, 0.4, 0.4, 0xa85848, { x: -0.8, y: 0.0, hex2: 0x884838 }),
        box(0.45, 0.38, 0.38, 0x985040, { x: 0.0, y: 0.0, hex2: 0x784030 }),
        box(0.48, 0.42, 0.4, 0xa86050, { x: 0.8, y: 0.0, hex2: 0x884838 }),
        // fat marbling
        box(0.4, 0.08, 0.35, 0xf0e8d8, { x: -0.8, y: 0.18 }),
        box(0.35, 0.06, 0.3, 0xf0e0d0, { x: 0.8, y: 0.16 }),
        // charred marks
        box(0.46, 0.06, 0.42, 0x4a3028, { x: 0.0, y: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] millet_zongzi 小米粽 — millet-wrapped rice dumpling            */
  /* ---------------------------------------------------------------- */
  {
    id: 'millet_zongzi',
    displayName: '小米粽',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8c868, 0xd8b858, 0x5a8a3a, 0xc8a848, 0x8a6a3a],
    yOffset: -0.55,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // triangular zongzi shape (pyramid-like via cone)
        cone(0.8, 1.2, 4, 0xe8c868, { y: 0.6, hex2: 0xd8b858 }),
        // leaf wrapping bands
        box(1.3, 0.15, 0.08, 0x5a8a3a, { y: 0.5, rz: 0.5 }),
        box(1.3, 0.15, 0.08, 0x4a7a2a, { y: 0.5, rz: -0.5 }),
        // string tie
        cyl(0.03, 0.03, 1.0, 5, 0x8a6a3a, { rz: 0.3, y: 0.8 }),
        // millet grain texture (small bumps)
        sph(0.12, 0xf0d070, { ws: 4, hs: 3, x: 0.3, y: 0.8, z: 0.2 }),
        sph(0.1, 0xe8c868, { ws: 4, hs: 3, x: -0.25, y: 0.7, z: 0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] makao_sausage 馬告香腸 — makao pepper sausage                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'makao_sausage',
    displayName: '馬告香腸',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa84830, 0x883820, 0xc85840, 0x6a3820, 0x3a2018],
    yOffset: -0.6019,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // wooden skewer stick
        cyl(0.06, 0.06, 3.0, 6, 0x8a5a32, { rz: HALF_PI, y: 0.0, hex2: 0xa67242 }),
        // reddish-brown sausage body, rounded ends
        sph(0.5, 0xa84830, { ws: 9, hs: 6, sx: 2.2, y: 0.0, hex2: 0xc85840 }),
        // charred glaze rings cinched around the sausage
        cyl(0.52, 0.52, 0.1, 8, 0x6a3820, { rz: HALF_PI, x: -0.4 }),
        cyl(0.52, 0.52, 0.1, 8, 0x6a3820, { rz: HALF_PI, x: 0.4 }),
        // visible makao pepper specks
        sph(0.06, 0x2a2018, { ws: 4, hs: 3, x: 0.2, y: 0.3, z: 0.1 }),
        sph(0.05, 0x3a2820, { ws: 4, hs: 3, x: -0.3, y: 0.25, z: -0.15 }),
        sph(0.04, 0x2a2018, { ws: 4, hs: 3, x: 0.0, y: 0.28, z: 0.2 }),
        // darker char patch on top
        sph(0.5, 0x3a2018, { ws: 7, hs: 4, sx: 1.0, thetaLen: PI * 0.4, y: 0.18, hex2: 0x883820 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] flying_fish_dry 飛魚乾 — dried flying fish (達悟族特產)        */
  /* ---------------------------------------------------------------- */
  {
    id: 'flying_fish_dry',
    displayName: '飛魚乾',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a4a3a, 0x7a6a4a, 0x8a7a5a, 0x4a3a2a, 0xc8b898],
    yOffset: -0.75,
    upright: false,
    collisionScale: 0.6,
    buildGeometry(rng) {
      return finish([
        // dried fish body (flattened, elongated)
        box(2.2, 0.2, 0.8, 0x7a6a4a, { y: 0.1, hex2: 0x5a4a3a }),
        // tapered head
        cone(0.4, 0.6, 5, 0x6a5a3a, { rz: -HALF_PI, x: 1.2, y: 0.1 }),
        // tail fin (forked)
        box(0.5, 0.16, 0.4, 0x5a4a3a, { x: -1.3, y: 0.1, rz: 0.3 }),
        box(0.5, 0.16, 0.4, 0x5a4a3a, { x: -1.3, y: 0.1, rz: -0.3 }),
        // extended wing fins (the "flying" part)
        box(0.8, 0.06, 0.9, 0x8a7a5a, { x: 0.3, y: 0.2, z: 0.7, rx: -0.2 }),
        box(0.8, 0.06, 0.9, 0x8a7a5a, { x: 0.3, y: 0.2, z: -0.7, rx: 0.2 }),
        // dried texture lines
        box(1.8, 0.04, 0.7, 0x4a3a2a, { y: 0.22 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] sugar_apple 釋迦 — Taitung famous custard apple                */
  /* ---------------------------------------------------------------- */
  {
    id: 'sugar_apple',
    displayName: '釋迦',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a9a3a, 0x7ab84a, 0x4a8a2a, 0x8aba5a, 0x3a7a1a],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // main body (bumpy sphere) - simplified
      parts.push(sph(0.9, 0xffffff, { ws: 6, hs: 5, y: 0.5, hex2: 0x8aba5a }));
      // characteristic bumps (6 instead of 12)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * PI * 2;
        const y = 0.5 + (i % 2 - 0.5) * 0.2;
        parts.push(sph(0.22, 0x7ab84a, { ws: 3, hs: 2, x: Math.cos(a) * 0.68, y, z: Math.sin(a) * 0.68, hex2: 0x5a9a3a }));
      }
      // single top bump
      parts.push(sph(0.18, 0x5a9a3a, { ws: 3, hs: 2, y: 1.1 }));
      // stem
      parts.push(cyl(0.06, 0.05, 0.25, 5, 0x5a4a2a, { y: 1.28 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] redwhite_bag 紅白塑膠袋 — knotted red-and-white plastic bag   */
  /* ---------------------------------------------------------------- */
  {
    id: 'redwhite_bag',
    displayName: '紅白塑膠袋',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.13,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e4de, 0xd83a34, 0xf4f0ea, 0xc23028, 0xeceae4],
    yOffset: -0.1822,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // bulging white bag body
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        // red/white horizontal stripes
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        // gathered white neck
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        // two upright red vest-loop handles
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] tribal_beads 原住民串珠 — colorful indigenous beadwork         */
  /* ---------------------------------------------------------------- */
  {
    id: 'tribal_beads',
    displayName: '原住民串珠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe83030, 0x3080e8, 0xf8c030, 0x30a850, 0xf0f0e8],
    yOffset: -0.5,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // string of colorful beads in a curved arrangement - reduced count
      const colors = [0xe83030, 0xf8c030, 0x3080e8, 0x30a850, 0xf0f0e8];
      const beadCount = 7;
      for (let i = 0; i < beadCount; i++) {
        const t = i / (beadCount - 1);
        const x = (t - 0.5) * 2.0;
        const y = 0.3 + Math.sin(t * PI) * 0.5;
        const color = colors[i % colors.length];
        parts.push(sph(0.24, color, { ws: 4, hs: 3, x, y }));
      }
      // thread visible between beads
      parts.push(box(2.2, 0.05, 0.05, 0x2a2a28, { y: 0.5 }));
      // decorative dangles at ends
      parts.push(cone(0.14, 0.28, 4, 0xf8c030, { x: -1.1, y: 0.12, rx: PI }));
      parts.push(cone(0.14, 0.28, 4, 0xe83030, { x: 1.1, y: 0.12, rx: PI }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] tiehua_lantern 鐵花彩燈球 — CHUNK LANDMARK: Tiehua painted ball */
  /* ---------------------------------------------------------------- */
  {
    id: 'tiehua_lantern',
    displayName: '鐵花彩燈球',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xe83838, 0x3888e8, 0xf8c838, 0x38a858, 0xf0f0e0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // main painted balloon sphere - simplified
      parts.push(sph(1.0, 0xffffff, { ws: 8, hs: 6, y: 1.2, hex2: 0xf0f0e0 }));
      // colorful painted bands (4 patches instead of 8)
      const colors = [0xe83838, 0x3888e8, 0xf8c838, 0x38a858];
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        const color = colors[i];
        parts.push(sph(0.32, color, { ws: 3, hs: 2, x: Math.cos(a) * 0.88, y: 1.2, z: Math.sin(a) * 0.88 }));
      }
      // hanging string
      parts.push(cyl(0.05, 0.05, 0.5, 4, 0x2a2a28, { y: 2.4 }));
      // tassel at bottom
      parts.push(cone(0.18, 0.35, 5, 0xe83838, { y: -0.1 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] tribal_stall 原民攤車 — CHUNK LANDMARK: indigenous food cart    */
  /* ---------------------------------------------------------------- */
  {
    id: 'tribal_stall',
    displayName: '原民攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x8a5a32, 0xa87242, 0xc04030, 0xf0c030, 0x2a8a4a],
    yOffset: -0.16,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const wood = 0x8a5a32;
      const parts = [];
      // wooden cart body
      parts.push(box(1.8, 0.8, 1.0, wood, { y: 0.7, hex2: 0xa87242 }));
      // wood frame trim
      parts.push(box(1.9, 0.1, 1.1, 0x6a4a22, { y: 1.12 }));
      parts.push(box(1.9, 0.1, 1.1, 0x6a4a22, { y: 0.32 }));
      // wheels
      parts.push(cyl(0.35, 0.35, 0.12, 8, 0x2e3138, { rx: HALF_PI, x: -0.6, y: 0.35, z: 0.56 }));
      parts.push(cyl(0.35, 0.35, 0.12, 8, 0x2e3138, { rx: HALF_PI, x: 0.6, y: 0.35, z: 0.56 }));
      // tribal pattern banner on front
      parts.push(box(1.6, 0.5, 0.06, 0xc04030, { y: 0.9, z: 0.52, hex2: 0xa83020 }));
      // triangular pattern details
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.2, 0.2, 0.04, i % 2 ? 0xf0c030 : 0x2a8a4a, { x: -0.6 + i * 0.4, y: 0.9, z: 0.55 }));
      }
      // hanging sign
      parts.push(cyl(0.06, 0.06, 1.5, 5, wood, { x: 0.8, y: 1.6 }));
      parts.push(box(0.6, 0.4, 0.06, 0xf0c030, { x: 0.8, y: 2.2, z: 0.2, hex2: 0xe0b020 }));
      // cooking items on top
      parts.push(cyl(0.3, 0.25, 0.3, 8, 0x3a3a38, { x: -0.4, y: 1.3 })); // pot
      parts.push(box(0.5, 0.15, 0.4, 0x7a6a5a, { x: 0.4, y: 1.2 })); // grill
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
