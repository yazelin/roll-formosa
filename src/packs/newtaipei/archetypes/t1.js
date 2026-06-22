/**
 * @file packs/newtaipei/archetypes/t1.js — T1 老街夜市 (old street night market items).
 *
 * Tier 1 of the Roll Formosa New Taipei ladder (老街夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/newtaipei/tiers.js:
 *   slots [0..7] absorbable 老街小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (天燈攤 / 老街燈籠, spawnWeight ~0.3).
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
  /* [0] 阿給盤 — Tamsui agei: fried tofu pouch stuffed with noodles, sealed with fish paste */
  /* ---------------------------------------------------------------- */
  {
    id: 'agei_serving',
    displayName: '阿給盤',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc88040, 0xd89050, 0xa86828, 0xe8a868, 0xf0d090],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // Fried tofu pouch — golden brown irregular cube
      parts.push(box(0.9, 0.7, 0.85, 0xc88040, { y: 0.4, hex2: 0xd89050 }));
      // Slightly rounded top from stuffing
      parts.push(sph(0.5, 0xd89050, { ws: 6, hs: 4, sy: 0.5, y: 0.8 }));
      // Fish paste seal on top (white/pink)
      parts.push(cyl(0.35, 0.3, 0.12, 6, 0xf0d8c8, { y: 0.92 }));
      // Visible noodle bits peeking out
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * PI * 2;
        parts.push(cyl(0.04, 0.04, 0.2, 4, 0xf0d090, {
          x: Math.cos(a) * 0.25,
          y: 0.85,
          z: Math.sin(a) * 0.25,
          rx: 0.3,
        }));
      }
      // Sauce drizzle (brown sweet sauce)
      parts.push(box(0.6, 0.03, 0.1, 0x6a4020, { y: 0.96, rz: 0.2 }));
      parts.push(box(0.5, 0.03, 0.08, 0x6a4020, { y: 0.95, z: 0.15, rz: -0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 鐵蛋包 — Tamsui iron egg cluster: dark braised eggs */
  /* ---------------------------------------------------------------- */
  {
    id: 'iron_egg_cluster',
    displayName: '鐵蛋包',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.04,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a2818, 0x4a3020, 0x2a1810, 0x5a4030, 0x1a0c08],
    yOffset: -0.15,
    upright: false,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const parts = [];
      // Very dark, shrunken egg — multiple eggs in a cluster
      // Main egg (slightly elongated sphere, very dark brown)
      parts.push(sph(0.55, 0x3a2818, { ws: 8, hs: 6, sy: 1.3, y: 0.55, hex2: 0x4a3020 }));
      // Second egg
      parts.push(sph(0.45, 0x2a1810, { ws: 7, hs: 5, sy: 1.25, x: 0.5, y: 0.45, z: 0.2, hex2: 0x3a2818 }));
      // Third egg
      parts.push(sph(0.4, 0x4a3020, { ws: 6, hs: 5, sy: 1.2, x: -0.35, y: 0.4, z: 0.3, hex2: 0x3a2818 }));
      // Wrinkled texture (small bumps showing chewy dried surface)
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * PI * 2;
        parts.push(sph(0.08, 0x5a4030, {
          ws: 4, hs: 3,
          x: Math.cos(a) * 0.35,
          y: 0.5 + (i % 2) * 0.15,
          z: Math.sin(a) * 0.35,
        }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 天燈盞 — Sky lantern: paper lantern with wire frame */
  /* ---------------------------------------------------------------- */
  {
    id: 'sky_lantern_lit',
    displayName: '天燈盞',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.12,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xe83830, 0xf85040, 0xff8040, 0xc82020, 0xffd040],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // Main balloon body — tapers at top and bottom
      parts.push(cyl(0.25, 0.55, 0.4, 8, 0xe83830, { y: 0.25, hex2: 0xf85040 })); // lower taper
      parts.push(cyl(0.55, 0.65, 0.5, 8, 0xf85040, { y: 0.7, hex2: 0xff8040 })); // main body
      parts.push(cyl(0.65, 0.6, 0.4, 8, 0xf85040, { y: 1.15 })); // upper body
      parts.push(cyl(0.6, 0.35, 0.35, 8, 0xe83830, { y: 1.5 })); // top taper
      parts.push(cyl(0.35, 0.15, 0.2, 6, 0xc82020, { y: 1.8 })); // top opening
      // Wire frame lines (vertical ribs)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        parts.push(cyl(0.02, 0.02, 1.6, 4, 0x4a4040, {
          x: Math.cos(a) * 0.5,
          y: 0.85,
          z: Math.sin(a) * 0.5,
        }));
      }
      // Bottom opening / burner frame
      parts.push(cyl(0.28, 0.28, 0.08, 6, 0x4a4040, { y: 0.04 }));
      // Burner (glowing)
      parts.push(sph(0.12, 0xffd040, { ws: 5, hs: 4, y: 0.1 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 芋圓碗 — Taro ball bowl: purple/orange chewy balls in a bowl */
  /* ---------------------------------------------------------------- */
  {
    id: 'taro_ball_bowl',
    displayName: '芋圓碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8860a8, 0xe89050, 0xf8e8a0, 0x6848a0, 0xc07040],
    yOffset: -0.48,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // Bowl
      parts.push(cyl(0.7, 0.55, 0.35, 8, 0xe8e0d0, { y: 0.18 }));
      parts.push(cyl(0.55, 0.55, 0.08, 8, 0xd8d0c0, { y: 0.4 })); // rim
      // Sweet soup base
      parts.push(cyl(0.5, 0.5, 0.15, 8, 0xb09070, { y: 0.35 }));
      // Taro balls (purple) — irregular placement
      parts.push(sph(0.18, 0x8860a8, { ws: 5, hs: 4, x: -0.15, y: 0.55, z: 0.1 }));
      parts.push(sph(0.16, 0x6848a0, { ws: 5, hs: 4, x: 0.2, y: 0.52, z: -0.1 }));
      parts.push(sph(0.14, 0x8860a8, { ws: 5, hs: 4, x: 0.05, y: 0.58, z: 0.2 }));
      // Sweet potato balls (orange)
      parts.push(sph(0.17, 0xe89050, { ws: 5, hs: 4, x: -0.1, y: 0.5, z: -0.2 }));
      parts.push(sph(0.15, 0xc07040, { ws: 5, hs: 4, x: 0.25, y: 0.55, z: 0.15 }));
      // Tapioca/small balls
      parts.push(sph(0.1, 0xf8e8a0, { ws: 4, hs: 3, x: -0.25, y: 0.48, z: 0.0 }));
      parts.push(sph(0.08, 0xf8e8a0, { ws: 4, hs: 3, x: 0.0, y: 0.46, z: -0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 魚丸串 — Fish ball skewer: bouncy white fish balls on skewer */
  /* ---------------------------------------------------------------- */
  {
    id: 'fishball_skewer',
    displayName: '魚丸串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf4f0e8, 0xe8e4dc, 0xd8d0c8, 0xfcf8f0, 0xc8beb0],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // Bamboo skewer
      parts.push(cyl(0.04, 0.04, 2.0, 4, 0xc8a060, { y: 0.6 }));
      // Fish balls on skewer
      parts.push(sph(0.32, 0xf4f0e8, { ws: 7, hs: 5, y: 0.3, hex2: 0xe8e4dc }));
      parts.push(sph(0.30, 0xe8e4dc, { ws: 7, hs: 5, y: 0.75, hex2: 0xf4f0e8 }));
      parts.push(sph(0.28, 0xfcf8f0, { ws: 6, hs: 5, y: 1.15 }));
      // Optional: one loose ball beside
      parts.push(sph(0.25, 0xf4f0e8, { ws: 6, hs: 4, x: 0.5, y: 0.25, z: 0.2 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 酸梅湯杯 — Sour plum drink cup: dark drink in a plastic cup */
  /* ---------------------------------------------------------------- */
  {
    id: 'sour_plum_cup',
    displayName: '酸梅湯杯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a2028, 0x6a3038, 0x8a4048, 0xcfe6e2, 0xf8f4f0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const parts = [];
      // Clear plastic cup
      parts.push(cyl(0.4, 0.5, 1.2, 8, 0xcfe6e2, { y: 0.6, hex2: 0xf8f4f0 }));
      // Dark plum drink inside (visible through cup)
      parts.push(cyl(0.35, 0.45, 1.0, 8, 0x4a2028, { y: 0.55, hex2: 0x6a3038 }));
      // Dome lid
      parts.push(cyl(0.5, 0.5, 0.05, 8, 0xf8f4f0, { y: 1.22 }));
      parts.push(sph(0.35, 0xf8f4f0, { ws: 6, hs: 3, sy: 0.4, y: 1.35, thetaLen: PI * 0.5 }));
      // Straw
      parts.push(cyl(0.05, 0.05, 0.8, 4, 0xe83030, { y: 1.6 }));
      // Ice cubes showing through
      parts.push(box(0.12, 0.1, 0.12, 0xe8f0f4, { x: 0.15, y: 1.0, z: 0.1 }));
      parts.push(box(0.1, 0.08, 0.1, 0xe8f0f4, { x: -0.1, y: 0.9, z: -0.12 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 寶特瓶 — clear PET water bottle: ribbed body, blue screw cap */
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
        cyl(0.5, 0.46, 0.28, 9, 0xcfe6e2, { y: 0.16 }), // foot
        cyl(0.5, 0.5, 0.9, 9, 0xcfe6e2, { y: 0.74, hex2: 0xeaf4f2 }), // body
        // grip rings
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.55 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.78 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 1.01 }),
        cyl(0.32, 0.5, 0.34, 9, 0xcfe6e2, { y: 1.36 }), // shoulder
        cyl(0.22, 0.22, 0.22, 9, 0xeaf4f2, { y: 1.62 }), // neck
        cyl(0.27, 0.27, 0.2, 9, 0x2f6fb0, { y: 1.78 }), // blue cap
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 胡椒餅 — pepper bun: round sesame-crusted baked bun */
  /* ---------------------------------------------------------------- */
  {
    id: 'pepper_bun',
    displayName: '胡椒餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc88a4a, 0xb87838, 0xe0b070, 0xa66828, 0xf0e8d0],
    yOffset: -0.4474,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // domed baked top, flatter bottom
        sph(0.92, 0xc88a4a, { ws: 10, hs: 6, sy: 0.62, y: 0.55, thetaLen: PI * 0.62, hex2: 0xe0b070 }),
        cyl(0.92, 0.86, 0.34, 10, 0xb87838, { y: 0.17 }), // crusty side wall
        cyl(0.86, 0.86, 0.08, 10, 0xa66828, { y: 0.02 }), // browned base
      ];
      // scattered sesame seeds on the dome (deterministic ring)
      const seeds = 9;
      for (let i = 0; i < seeds; i++) {
        const a = (i / seeds) * PI * 2;
        const r = 0.42 + (i % 2) * 0.22;
        parts.push(
          sph(0.07, 0xf0e8d0, { ws: 4, hs: 3, x: Math.cos(a) * r, y: 0.72 - (i % 3) * 0.05, z: Math.sin(a) * r })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 天燈攤 sky lantern stall selling lanterns */
  /* ---------------------------------------------------------------- */
  {
    id: 'lantern_stall',
    displayName: '天燈攤',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xe83830, 0xf0c040, 0x4a3028, 0xff8040, 0x3a2a22],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [];
      // Stall table/counter
      parts.push(box(1.4, 0.1, 0.8, 0x4a3028, { y: 0.65 }));
      // Table legs (simplified to 2)
      parts.push(box(0.08, 0.6, 0.08, 0x3a2a22, { x: -0.6, y: 0.3, z: 0 }));
      parts.push(box(0.08, 0.6, 0.08, 0x3a2a22, { x: 0.6, y: 0.3, z: 0 }));
      // Hanging rack above
      parts.push(box(1.5, 0.04, 0.04, 0x3a2a22, { y: 1.3 }));
      // Hanging lanterns (simplified to 3)
      const lanternColors = [0xe83830, 0xff8040, 0xf0c040];
      for (let i = 0; i < 3; i++) {
        const x = -0.45 + i * 0.45;
        // Simple lantern shape
        parts.push(cyl(0.14, 0.18, 0.28, 5, lanternColors[i], { x, y: 1.05 }));
      }
      // One lantern on table
      parts.push(cyl(0.16, 0.2, 0.28, 5, 0xe83830, { x: 0, y: 0.85, z: 0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 老街燈籠 old street lantern string */
  /* ---------------------------------------------------------------- */
  {
    id: 'oldstreet_lantern',
    displayName: '老街燈籠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd83030, 0xff5a4a, 0x3a2818, 0xd4a840, 0x4a3020],
    yOffset: -0.02,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      // Simplified: 2 lanterns on a string
      const lanternPos = [
        { x: -0.3, y: 0.5 },
        { x: 0.3, y: 0.45 },
      ];

      for (const { x, y } of lanternPos) {
        // Main lantern body (single barrel shape)
        parts.push(cyl(0.22, 0.24, 0.35, 5, 0xd83030, { x, y, hex2: 0xff5a4a }));
        // Top cap
        parts.push(cyl(0.1, 0.1, 0.05, 5, 0x3a2818, { x, y: y + 0.22 }));
        // Bottom cap
        parts.push(cyl(0.1, 0.1, 0.04, 5, 0x3a2818, { x, y: y - 0.2 }));
        // Gold trim
        parts.push(cyl(0.25, 0.25, 0.02, 5, 0xd4a840, { x, y: y + 0.08, open: true }));
        // Tassel
        parts.push(cone(0.05, 0.1, 4, 0xd4a840, { x, y: y - 0.3 }));
      }

      // Connecting string
      parts.push(cyl(0.015, 0.015, 0.8, 4, 0x4a3020, { y: 0.75, rz: HALF_PI }));
      // Hanging cords
      parts.push(cyl(0.012, 0.012, 0.08, 4, 0x4a3020, { x: -0.3, y: 0.7 }));
      parts.push(cyl(0.012, 0.012, 0.1, 4, 0x4a3020, { x: 0.3, y: 0.68 }));

      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
