/**
 * @file packs/hualien/archetypes/t1.js — T1 東大門夜市 (night-market stall items).
 *
 * Tier 1 of the Roll Formosa Hualien ladder (夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/hualien/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (攤車燈籠 / 彈珠台, spawnWeight ~0.3).
 *
 * Hualien theme: 扁食/麻糬/炸彈蔥油餅/官財板 — local night market specialties.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] wonton_bowl 扁食碗 — Hualien's famous flat wonton soup bowl   */
  /* ---------------------------------------------------------------- */
  {
    id: 'wonton_bowl',
    displayName: '扁食碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xe8e0d0, 0xd8c8a0, 0xf0e8d8],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional white ceramic bowl with wontons and soup
      return finish([
        // Bowl body
        cyl(0.9, 0.5, 0.8, 10, 0xffffff, { y: 0.4 }), // tapered bowl (tinted)
        cyl(0.5, 0.5, 0.1, 10, 0xf0e8d8, { y: 0.05 }), // foot ring
        // Soup surface (warm broth color)
        cyl(0.82, 0.82, 0.08, 10, 0xd8c090, { y: 0.7 }),
        // Wontons floating (cream colored dumplings)
        sph(0.18, 0xf8f0e0, { ws: 6, hs: 4, x: 0.2, y: 0.78, z: 0.15 }),
        sph(0.16, 0xf0e8d8, { ws: 6, hs: 4, x: -0.25, y: 0.76, z: -0.1 }),
        sph(0.15, 0xf8f0e0, { ws: 6, hs: 4, x: 0.0, y: 0.77, z: -0.25 }),
        // Green onion garnish
        cyl(0.03, 0.03, 0.2, 4, 0x4a8a3a, { x: 0.1, y: 0.82, z: 0.0, rx: 0.4 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] pet_bottle 寶特瓶 — clear PET water bottle: ribbed body       */
  /* ---------------------------------------------------------------- */
  {
    id: 'pet_bottle',
    displayName: '寶特瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xcfe6e2, 0xbfdfe8, 0x2f6fb0, 0xeaf4f2, 0x9cc6d2],
    yOffset: -0.1095,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      return finish([
        cyl(0.5, 0.46, 0.28, 9, 0xcfe6e2, { y: 0.16 }),
        cyl(0.5, 0.5, 0.9, 9, 0xcfe6e2, { y: 0.74, hex2: 0xeaf4f2 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.55 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.78 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 1.01 }),
        cyl(0.32, 0.5, 0.34, 9, 0xcfe6e2, { y: 1.36 }),
        cyl(0.22, 0.22, 0.22, 9, 0xeaf4f2, { y: 1.62 }),
        cyl(0.27, 0.27, 0.2, 9, 0x2f6fb0, { y: 1.78 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] mochi_box 麻糬盒 — box of Hualien's famous mochi             */
  /* ---------------------------------------------------------------- */
  {
    id: 'mochi_box',
    displayName: '麻糬盒',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf8e8d0, 0xe8d8c0, 0xc83828, 0xf0e0c8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Gift box with traditional red accents and mochi inside
      const parts = [
        box(1.6, 0.6, 1.2, 0xffffff, { y: 0.3 }), // box base (tinted cream)
        box(1.64, 0.1, 1.24, 0xf8e0c0, { y: 0.65 }), // lid
        // Red ribbon cross on top
        box(1.5, 0.08, 0.2, 0xc83828, { y: 0.72 }),
        box(0.2, 0.08, 1.1, 0xc83828, { y: 0.72 }),
        // Ribbon bow
        sph(0.15, 0xc83828, { ws: 6, hs: 4, y: 0.82 }),
        // Label
        box(0.6, 0.04, 0.4, 0xf0d8a0, { y: 0.7, z: 0.35 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] incense_stick 香 — single thin incense stick                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_stick',
    displayName: '香',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8302a, 0x8a4a2a, 0xd8a23a, 0xe6c060, 0x6a3a1e],
    yOffset: -0.0008,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      return finish([
        cyl(0.05, 0.05, 2.7, 6, 0xb8302a, { y: 0.0 }),
        cyl(0.07, 0.06, 0.9, 6, 0x8a4a2a, { y: -1.0 }),
        cyl(0.085, 0.085, 0.12, 6, 0x6a3a1e, { y: 1.32 }),
        sph(0.1, 0xe6c060, { ws: 6, hs: 4, y: 1.46 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] joss_paper 金紙 — stack of joss paper                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'joss_paper',
    displayName: '金紙',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8c468, 0xf0deb0, 0xd8a83a, 0xc89a2e, 0xf4e8c8],
    yOffset: -0.5589,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      for (let i = 0; i < 7; i++) {
        const tint = i % 2 === 0 ? 0xf0deb0 : 0xe8d8a8;
        parts.push(box(1.5, 0.12, 1.1, tint, { y: 0.06 + i * 0.12 }));
      }
      parts.push(box(0.62, 0.04, 0.62, 0xe8c468, { y: 0.9, hex2: 0xd8a83a }));
      parts.push(box(0.16, 0.86, 1.12, 0xc24028, { x: -0.67, y: 0.43 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] coffin_bread 官財板 — Hualien's famous coffin bread toast    */
  /* ---------------------------------------------------------------- */
  {
    id: 'coffin_bread',
    displayName: '官財板',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a050, 0xc89040, 0xf0e8d0, 0xe8c870],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Deep-fried toast box filled with creamy filling — coffin-shaped
      return finish([
        // Main toast box (golden fried)
        box(1.4, 0.9, 1.0, 0xffffff, { y: 0.45, hex2: 0xe8c870 }), // toast shell (tinted golden)
        // Hollow interior with creamy filling
        box(1.1, 0.6, 0.7, 0xf0e8d0, { y: 0.55 }), // cream filling
        // Lid slightly ajar
        box(1.38, 0.15, 0.98, 0xd8a050, { y: 0.98, rx: 0.15 }),
        // Crispy texture ridges
        box(1.42, 0.08, 0.1, 0xc89040, { y: 0.1 }),
        box(1.42, 0.08, 0.1, 0xc89040, { y: 0.85, z: 0.4 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] redwhite_bag 紅白塑膠袋 — knotted red-and-white bag          */
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
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] scallion_pancake 炸彈蔥油餅 — Hualien's bomb scallion pancake */
  /* ---------------------------------------------------------------- */
  {
    id: 'scallion_pancake',
    displayName: '炸彈蔥油餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a048, 0xc89038, 0xf0e0b0, 0xe8c060],
    yOffset: -0.4,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Round fried pancake with egg inside (the "bomb" is the runny yolk)
      const parts = [
        // Pancake base — flaky crispy layers
        cyl(1.0, 1.0, 0.35, 10, 0xffffff, { y: 0.18, hex2: 0xe8c060 }), // golden pancake (tinted)
        // Crispy edge texture
        cyl(1.02, 0.98, 0.1, 10, 0xc89038, { y: 0.32 }),
        // Fried egg on top (the signature "bomb")
        cyl(0.55, 0.55, 0.08, 8, 0xf8f8f0, { y: 0.4 }), // egg white
        sph(0.22, 0xf0a020, { ws: 6, hs: 4, y: 0.5 }), // yolk "bomb"
        // Green onion bits scattered
        box(0.08, 0.04, 0.04, 0x4a8a3a, { x: 0.4, y: 0.38, z: 0.2 }),
        box(0.06, 0.04, 0.06, 0x4a8a3a, { x: -0.35, y: 0.38, z: -0.25 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 攤車燈籠 stall-cart paper lantern            */
  /* ---------------------------------------------------------------- */
  {
    id: 'stall_lantern',
    displayName: '攤車燈籠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd8302a, 0xe85a3a, 0xf0c040, 0xc02824, 0x3a2a22],
    yOffset: -0.0238,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        cyl(0.34, 0.34, 0.16, 8, 0x3a2a22, { y: 1.78 }),
        cyl(0.34, 0.34, 0.16, 8, 0x3a2a22, { y: 0.42 }),
        cyl(0.5, 0.4, 0.34, 8, 0xd8302a, { y: 0.6, hex2: 0xe85a3a }),
        cyl(0.66, 0.5, 0.3, 8, 0xe85a3a, { y: 0.9 }),
        cyl(0.66, 0.66, 0.3, 8, 0xe85a3a, { y: 1.18 }),
        cyl(0.5, 0.66, 0.3, 8, 0xe85a3a, { y: 1.46 }),
        cyl(0.4, 0.5, 0.2, 8, 0xd8302a, { y: 1.66, hex2: 0xc02824 }),
        cyl(0.67, 0.67, 0.05, 8, 0xf0c040, { y: 1.04, open: true }),
        cyl(0.67, 0.67, 0.05, 8, 0xf0c040, { y: 1.32, open: true }),
        cyl(0.06, 0.06, 0.2, 6, 0xf0c040, { y: 0.24 }),
        cone(0.12, 0.3, 6, 0xf0c040, { y: 0.0 }),
        cyl(0.09, 0.09, 1.2, 6, 0x3a2a22, { y: -0.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 彈珠台 slanted wooden pinball board          */
  /* ---------------------------------------------------------------- */
  {
    id: 'pinball_table',
    displayName: '彈珠台',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xb5712f, 0xcf8b3f, 0x9a5a24, 0xe0b85a, 0xd83a34],
    yOffset: -0.5306,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        box(2.0, 0.16, 2.6, 0xcf8b3f, { rx: -0.32, y: 0.6, hex2: 0xe0b85a }),
        box(0.16, 0.34, 2.7, 0x9a5a24, { rx: -0.32, x: -1.0, y: 0.72 }),
        box(0.16, 0.34, 2.7, 0x9a5a24, { rx: -0.32, x: 1.0, y: 0.72 }),
        box(2.16, 0.34, 0.16, 0x9a5a24, { rx: -0.32, y: 1.32, z: -1.28 }),
        box(2.16, 0.28, 0.16, 0xb5712f, { rx: -0.32, y: 0.04, z: 1.28 }),
        cyl(0.12, 0.12, 0.7, 5, 0x9a5a24, { x: -0.86, y: 0.0, z: 0.9 }),
        cyl(0.12, 0.12, 1.1, 5, 0x9a5a24, { x: -0.86, y: 0.2, z: -0.9 }),
        cyl(0.12, 0.12, 0.7, 5, 0x9a5a24, { x: 0.86, y: 0.0, z: 0.9 }),
        cyl(0.12, 0.12, 1.1, 5, 0x9a5a24, { x: 0.86, y: 0.2, z: -0.9 }),
      ];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const px = -0.6 + c * 0.6;
          const pz = -0.6 + r * 0.6;
          const py = 0.78 + (-pz) * 0.33;
          parts.push(cyl(0.06, 0.06, 0.18, 4, 0xe0b85a, { rx: -0.32, x: px, y: py, z: pz }));
        }
      }
      parts.push(sph(0.12, 0xd83a34, { ws: 5, hs: 3, x: -0.3, y: 0.5, z: 1.0 }));
      parts.push(sph(0.12, 0xcfe6e2, { ws: 5, hs: 3, x: 0.35, y: 0.5, z: 1.0 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
