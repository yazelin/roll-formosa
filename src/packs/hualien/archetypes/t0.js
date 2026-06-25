/**
 * @file packs/hualien/archetypes/t0.js — Roll Formosa Hualien pack, TIER 0
 *   文創小店桌頭 (craft shop tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/hualien/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 戳戳樂板 / 籤筒, spawnWeight ~0.3).
 *
 * Authored ONLY with the engine geometry vocabulary (geomHelpers.js):
 * box/cyl/cone/sph/ico/torus + paint/xf + finish (merge → recenter →
 * normalize to a UNIT bounding sphere of radius 1.0). The geometry math is an
 * engine red line — we compose primitives, never touch the math.
 *
 * Hualien theme: 太魯閣大理石 + 原民圖騰 + 七星潭海濱 — marble beads, tribal
 * woven cords, and coastal craft-shop vibes.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T0_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] qixingtan_pebble 七星潭鵝卵石 — smooth Qixingtan beach pebble   */
  /* ---------------------------------------------------------------- */
  {
    id: 'qixingtan_pebble',
    displayName: '七星潭鵝卵石',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xa0a8a0, 0x909088, 0xb0b8a8, 0x888880, 0xc0c8b8],
    yOffset: 0,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Smooth grey-green pebble from Qixingtan beach — characteristic oval shape
      return finish([
        sph(1.0, 0xffffff, { ws: 8, hs: 6, sy: 0.7, sx: 1.1 }), // flattened oval pebble (tinted)
        // subtle color variation bands (beach stone character)
        box(0.06, 1.2, 0.8, 0x8a9088, { rz: 0.3, y: 0.05 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] flying_fish_chip 飛魚乾片 — dried flying fish chip (蘭嶼/花東特色) */
  /* ---------------------------------------------------------------- */
  {
    id: 'flying_fish_chip',
    displayName: '飛魚乾片',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa08060, 0x907050, 0xb09070, 0x806040],
    yOffset: -0.75,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Dried flying fish slice — amber-brown, fish-shaped, thin & crispy
      return finish([
        // Fish body — elongated oval, flattened
        sph(0.9, 0xffffff, { ws: 8, hs: 5, sx: 2.0, sy: 0.2, sz: 0.7, y: 0.1, hex2: 0xc0a080 }),
        // Tail fin
        cone(0.2, 0.5, 4, 0xa08060, { rz: -HALF_PI, x: 1.2, y: 0.1 }),
        // Dorsal texture lines
        box(0.8, 0.05, 0.04, 0x806040, { y: 0.18 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] seashell 貝殼 — small cowrie/clam shell from Hualien coast     */
  /* ---------------------------------------------------------------- */
  {
    id: 'seashell',
    displayName: '貝殼',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0xe8d8c0, 0xf0e8d0, 0xd8c8b0, 0xfff8e8],
    yOffset: -0.45,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Small cowrie-type seashell — creamy white, ridged dome
      return finish([
        // Shell body — half-sphere dome
        sph(0.9, 0xffffff, { ws: 8, hs: 5, thetaLen: HALF_PI, y: 0.0 }),
        // Ridge texture lines radiating outward
        box(0.04, 0.5, 0.8, 0xe8d0b8, { ry: 0.3, y: 0.3 }),
        box(0.04, 0.5, 0.8, 0xe0c8b0, { ry: -0.3, y: 0.3 }),
        box(0.04, 0.5, 0.7, 0xd8c0a8, { y: 0.3 }),
        // Aperture slit
        box(0.6, 0.08, 0.1, 0xc8b8a0, { y: 0.05 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] marble_bead 大理石珠 — polished Taroko marble bead with veins  */
  /* ---------------------------------------------------------------- */
  {
    id: 'marble_bead',
    displayName: '大理石珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.015,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8e0d8, 0xd0c8c0, 0xc8d0d0, 0xf0e8e0],
    yOffset: 0,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Polished Taroko marble bead — white/grey base with characteristic veins
      return finish([
        sph(1.0, 0xffffff, { ws: 10, hs: 8 }), // white marble base (tinted)
        // grey-green veins running through the marble
        box(0.08, 1.8, 0.6, 0x8a9088, { rz: 0.4, ry: 0.2, hex2: 0xa0a8a0 }),
        box(0.06, 1.6, 0.4, 0x7a8a78, { rz: -0.5, ry: -0.3, hex2: 0x98a898 }),
        // subtle golden streaks (Taroko marble characteristic)
        box(0.04, 1.4, 0.3, 0xc8b890, { rz: 0.3, ry: 0.6 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] tribal_weave_cord 原民編織繩 — braided aboriginal cord         */
  /* ---------------------------------------------------------------- */
  {
    id: 'tribal_weave_cord',
    displayName: '原民編織繩',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc83020, 0x2a6a3a, 0xe8a030, 0x1a1a1a],
    yOffset: -0.5,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Braided cord in traditional Truku/Amis colors (red, green, yellow, black)
      const parts = [];
      // Main cord body — coiled/bundled rope
      parts.push(cyl(0.4, 0.4, 2.2, 8, 0xffffff, { rz: HALF_PI, y: 0.0 })); // base cord (tinted)
      // Colored stripe wraps in tribal pattern
      for (let i = 0; i < 5; i++) {
        const colors = [0xc83020, 0x2a6a3a, 0xe8a030, 0x1a1a1a];
        const c = colors[i % colors.length];
        const x = -0.8 + i * 0.4;
        parts.push(cyl(0.44, 0.44, 0.15, 8, c, { rz: HALF_PI, x, y: 0.0 }));
      }
      // Frayed ends with thread tassels
      parts.push(cone(0.3, 0.4, 6, 0xc83020, { rz: -HALF_PI, x: 1.3, y: 0.0 }));
      parts.push(cone(0.3, 0.4, 6, 0x2a6a3a, { rz: HALF_PI, x: -1.3, y: 0.0 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] jade_pendant 玉墜 — small jade pendant (花蓮玉石特產)           */
  /* ---------------------------------------------------------------- */
  {
    id: 'jade_pendant',
    displayName: '玉墜',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x7ab080, 0x6aa070, 0x8ac090, 0x5a9060, 0x9ad0a0],
    yOffset: -0.1,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Polished Taiwan jade pendant — green translucent disc with hole
      return finish([
        // Main pendant body — flattened disc
        cyl(1.0, 1.0, 0.25, 10, 0xffffff, { y: 0.0 }), // jade body (tinted green)
        // Center hole for string
        cyl(0.2, 0.2, 0.3, 8, 0x2a3a2a, { y: 0.0 }),
        // Subtle carved pattern ring
        cyl(0.7, 0.7, 0.04, 10, 0x5a9060, { y: 0.12 }),
        // String loop at top
        torus(0.12, 0.03, 4, 6, 0xc83020, { y: 0.5, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] bamboo_chopstick 竹筷 — single bamboo chopstick (花蓮竹藝)      */
  /* ---------------------------------------------------------------- */
  {
    id: 'bamboo_chopstick',
    displayName: '竹筷',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.04,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8c090, 0xc8b080, 0xe8d0a0, 0xb8a070, 0xf0e0b0],
    yOffset: -0.88,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Single bamboo chopstick — tapered, natural bamboo color
      return finish([
        // Main shaft — square cross-section tapering to round tip
        cyl(0.2, 0.16, 2.8, 4, 0xffffff, { rz: HALF_PI, x: 0.0 }), // bamboo body (tinted)
        // Tapered tip
        cone(0.16, 0.4, 4, 0xc8b080, { rz: -HALF_PI, x: 1.5 }),
        // Bamboo joint/node ring
        cyl(0.22, 0.22, 0.1, 4, 0xb8a070, { rz: HALF_PI, x: -0.8 }),
        cyl(0.22, 0.22, 0.1, 4, 0xb8a070, { rz: HALF_PI, x: 0.3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] tribal_bead 原民琉璃珠 — Amis/Truku glass bead                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'tribal_bead',
    displayName: '原民琉璃珠',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2a6a8a, 0xc83020, 0xe8a030, 0x2a8a4a, 0x1a1a1a],
    yOffset: 0,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Traditional aboriginal glass bead — colorful with geometric patterns
      return finish([
        // Main bead body — sphere
        sph(1.0, 0xffffff, { ws: 8, hs: 6 }), // base color (tinted)
        // Traditional stripe patterns
        cyl(1.02, 1.02, 0.15, 8, 0xc83020, { y: 0.3, open: true }), // red band
        cyl(1.02, 1.02, 0.15, 8, 0xe8a030, { y: -0.3, open: true }), // yellow band
        // Center hole (bead string hole)
        cyl(0.15, 0.15, 2.0, 6, 0x1a1a1a, { y: 0.0 }),
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
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        box(2.7, 1.9, 0.18, 0xffffff, { y: 0.95, z: 0.0 }),
        box(2.7, 0.42, 0.2, 0xd83a2e, { y: 1.74, z: 0.02 }),
        box(2.7, 0.26, 0.2, 0xf0b429, { y: 0.18, z: 0.02 }),
      ];
      const cols = 5;
      const rows = 3;
      const x0 = -0.84;
      const y0 = 0.62;
      const dx = 0.42;
      const dy = 0.38;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const popped = rng() < 0.28;
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
