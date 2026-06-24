/**
 * @file packs/penghu/archetypes/t1.js — T1 漁港夜市 (Penghu harbor night-market street food).
 *
 * Tier 1 of the Roll Formosa Penghu ladder (漁港夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/penghu/tiers.js:
 *   slots [0..7] absorbable 漁港夜市小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (漁市拱門 / 攤車, spawnWeight ~0.3).
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
  /* [0] 仙人掌冰 — Penghu prickly pear ice cream cone                  */
  /* ---------------------------------------------------------------- */
  {
    id: 'cactus_ice_snack',
    displayName: '仙人掌冰',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd83890, 0xc82878, 0xe848a0, 0xf0d8a8, 0xfff4e0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // waffle cone (tapered cylinder, tan)
        cone(0.6, 1.2, 8, 0xf0d8a8, { y: 0.6, hex2: 0xe0c898 }),
        // waffle grid lines
        cyl(0.62, 0.62, 0.05, 8, 0xd8c088, { y: 1.15, open: true }),
        // magenta prickly pear ice cream scoop
        sph(0.65, 0xd83890, { ws: 9, hs: 6, y: 1.6, hex2: 0xc82878 }),
        // smaller scoop on top
        sph(0.45, 0xe848a0, { ws: 8, hs: 5, y: 2.15 }),
        // ice cream drip
        cone(0.12, 0.3, 6, 0xd83890, { y: 1.1, rx: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 烤小管 — grilled fresh squid on a skewer                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'grilled_squid',
    displayName: '烤小管',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf0c890, 0xe8b878, 0xd8a060, 0xc08040, 0xfff8e8],
    yOffset: -0.001,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // bamboo skewer
        cyl(0.05, 0.05, 2.4, 6, 0xe0c890, { y: 0.0 }),
        // squid body (tube-like, slightly translucent white-tan)
        cyl(0.35, 0.3, 1.3, 8, 0xfff8e8, { y: 0.5, hex2: 0xf0e8d8 }),
        // grilled char marks
        cyl(0.36, 0.36, 0.08, 8, 0xc08040, { y: 0.3, open: true }),
        cyl(0.36, 0.36, 0.08, 8, 0xc08040, { y: 0.8, open: true }),
        // tentacles splayed at bottom
        cone(0.4, 0.5, 7, 0xf0e0d0, { y: -0.1, rx: PI }),
        // squid head/mantle tip
        sph(0.28, 0xf0e8d8, { ws: 7, hs: 4, y: 1.25 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 海膽 — fresh sea urchin (uni), spiny ball                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'sea_urchin_snack',
    displayName: '海膽',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x3a2a4a, 0x4a3a5a, 0x2a1a3a, 0x5a4a6a, 0xffd080],
    yOffset: -0.0,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // dark purple spherical body
        sph(0.7, 0x3a2a4a, { ws: 9, hs: 7, hex2: 0x4a3a5a }),
      ];
      // radiating spines
      const spines = 12;
      for (let i = 0; i < spines; i++) {
        const theta = (i / spines) * PI * 2;
        const phi = HALF_PI * 0.6;
        const x = Math.cos(theta) * Math.sin(phi) * 0.6;
        const y = Math.cos(phi) * 0.6 + 0.3;
        const z = Math.sin(theta) * Math.sin(phi) * 0.6;
        parts.push(cyl(0.03, 0.02, 0.5, 4, 0x2a1a3a, { x, y, z, rx: phi * 0.5, ry: theta }));
      }
      // golden uni meat visible at top opening
      parts.push(sph(0.25, 0xffd080, { ws: 6, hs: 4, y: 0.65 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 黑糖糕 — Penghu brown sugar cake, square block                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'brown_sugar_cake_snack',
    displayName: '黑糖糕',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a3a20, 0x6a4a28, 0x4a2a18, 0x7a5a30, 0x3a2010],
    yOffset: -0.56,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // main dark brown cake block
        box(1.2, 0.8, 1.2, 0x5a3a20, { y: 0.4, hex2: 0x6a4a28 }),
        // slightly darker top crust
        box(1.22, 0.08, 1.22, 0x4a2a18, { y: 0.82 }),
        // caramelized bottom
        box(1.22, 0.06, 1.22, 0x3a2010, { y: 0.03 }),
        // crack lines on top
        box(0.8, 0.04, 0.06, 0x7a5a30, { y: 0.85, z: 0.2 }),
        box(0.06, 0.04, 0.6, 0x7a5a30, { y: 0.85, x: 0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 風茹茶 — Penghu fenru herbal tea in plastic cup                */
  /* ---------------------------------------------------------------- */
  {
    id: 'fenru_tea',
    displayName: '風茹茶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6030, 0xa07040, 0xc89050, 0xfff8f0, 0x6a4020],
    yOffset: -0.14,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      return finish([
        // clear plastic cup (slightly amber tea color)
        cyl(0.55, 0.45, 1.4, 9, 0xa07040, { y: 0.7, hex2: 0xc89050 }),
        cyl(0.45, 0.45, 0.06, 9, 0x6a4020, { y: 0.03 }), // base
        cyl(0.57, 0.55, 0.08, 9, 0xfff8f0, { y: 1.38, open: true }), // rim
        // dome lid
        sph(0.55, 0xfff8f0, { ws: 9, hs: 5, sy: 0.4, y: 1.5, thetaLen: PI * 0.5 }),
        // straw poking through
        cyl(0.06, 0.06, 1.0, 6, 0x2a6a2a, { x: 0.15, y: 1.85 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 花枝丸 — cuttlefish ball, fried round snack                    */
  /* ---------------------------------------------------------------- */
  {
    id: 'cuttlefish_ball',
    displayName: '花枝丸',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.04,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8d0a0, 0xd8c090, 0xc8a878, 0xf0e0b8, 0xb89060],
    yOffset: -0.0,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // fried golden ball
        sph(0.9, 0xe8d0a0, { ws: 10, hs: 7, hex2: 0xd8c090 }),
        // darker fried spots
        sph(0.25, 0xb89060, { ws: 5, hs: 3, x: 0.5, y: 0.3, z: 0.2 }),
        sph(0.2, 0xc8a878, { ws: 5, hs: 3, x: -0.4, y: -0.2, z: 0.4 }),
        sph(0.18, 0xb89060, { ws: 5, hs: 3, x: 0.1, y: 0.5, z: -0.3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 炸魚 — fried fish, whole small fish golden-brown               */
  /* ---------------------------------------------------------------- */
  {
    id: 'fried_fish',
    displayName: '炸魚',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8a860, 0xc89850, 0xe8b870, 0xa87840, 0xf0c880],
    yOffset: -0.0,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // fish body (elongated ellipsoid)
        sph(0.5, 0xd8a860, { ws: 9, hs: 6, sx: 2.2, sy: 0.7, hex2: 0xe8b870 }),
        // head
        sph(0.35, 0xc89850, { ws: 7, hs: 5, x: 1.0, sy: 0.8 }),
        // eye
        sph(0.08, 0x1a1a1a, { ws: 4, hs: 3, x: 1.15, y: 0.12, z: 0.18 }),
        // tail fin
        cone(0.3, 0.6, 5, 0xa87840, { rz: HALF_PI, x: -1.3, sy: 0.3 }),
        // dorsal fin
        cone(0.15, 0.4, 4, 0xc89850, { y: 0.35, x: -0.2, sz: 0.3 }),
        // crispy coating texture
        cyl(0.52, 0.52, 0.08, 8, 0xf0c880, { rz: HALF_PI, x: 0.2, sy: 0.7, open: true }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 海菜 — Penghu seaweed/sea lettuce, green cluster               */
  /* ---------------------------------------------------------------- */
  {
    id: 'seaweed',
    displayName: '海菜',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x2a5a2a, 0x3a6a3a, 0x1a4a1a, 0x4a7a4a, 0x5a8a5a],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // base cluster of leafy seaweed
        sph(0.5, 0x2a5a2a, { ws: 7, hs: 5, y: 0.4, sx: 1.2, sy: 0.7, hex2: 0x3a6a3a }),
      ];
      // ruffled leaf fronds
      const fronds = 6;
      for (let i = 0; i < fronds; i++) {
        const a = (i / fronds) * PI * 2;
        const r = 0.5 + (i % 2) * 0.15;
        const h = 0.3 + (i % 3) * 0.15;
        parts.push(sph(0.25, i % 2 ? 0x3a6a3a : 0x1a4a1a, {
          ws: 5, hs: 4,
          x: Math.cos(a) * r,
          y: h,
          z: Math.sin(a) * r,
          sx: 0.6, sy: 1.2,
        }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 漁市拱門 fish market entrance arch             */
  /* ---------------------------------------------------------------- */
  {
    id: 'fish_market_arch',
    displayName: '漁市拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x3a6a9a, 0xf0c040, 0xe8e4de, 0x2a5080, 0x3a2a22],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      return finish([
        // two blue-painted pillars (fishing port style)
        box(0.5, 3.4, 0.5, 0x3a6a9a, { x: -1.9, y: 1.7, hex2: 0x2a5080 }),
        box(0.5, 3.4, 0.5, 0x3a6a9a, { x: 1.9, y: 1.7, hex2: 0x2a5080 }),
        // pillar plinths
        box(0.7, 0.4, 0.7, 0x3a2a22, { x: -1.9, y: 0.2 }),
        box(0.7, 0.4, 0.7, 0x3a2a22, { x: 1.9, y: 0.2 }),
        // top signboard beam (漁市場 / fish market banner)
        box(4.6, 0.7, 0.6, 0x2a5080, { y: 3.7, hex2: 0x3a6a9a }),
        // gold trim on the signboard
        box(4.7, 0.12, 0.62, 0xf0c040, { y: 4.0 }),
        // fish silhouette decoration on top
        sph(0.3, 0xf0c040, { ws: 5, hs: 3, sx: 1.8, sy: 0.5, y: 4.25 }),
        // three lanterns under the beam (simplified)
        sph(0.2, 0xe8e4de, { ws: 5, hs: 3, sx: 1.2, x: -1.0, y: 3.0 }),
        sph(0.2, 0xe8e4de, { ws: 5, hs: 3, sx: 1.2, x: 0.0, y: 3.0 }),
        sph(0.2, 0xe8e4de, { ws: 5, hs: 3, sx: 1.2, x: 1.0, y: 3.0 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 攤車 night-market food cart with awning       */
  /* ---------------------------------------------------------------- */
  {
    id: 'stall',
    displayName: '攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.25,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x3a6a9a, 0xe8e4de, 0xf0c040, 0x9a5a24, 0x4a6a8a],
    yOffset: -0.31,
    upright: true,
    collisionScale: 0.74,
    buildGeometry(rng) {
      const parts = [
        // stainless cart body / counter
        box(3.2, 1.1, 1.6, 0xe8e4de, { y: 1.0, hex2: 0xd8d4ce }),
        box(3.3, 0.2, 1.7, 0xc8ccd2, { y: 1.6 }), // worktop
        // lower cabinet / skirt
        box(3.0, 0.6, 1.5, 0x9a5a24, { y: 0.5, hex2: 0xb5712f }),
        // four corner posts holding the awning
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: -1.45, y: 2.6, z: -0.6 }),
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: 1.45, y: 2.6, z: -0.6 }),
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: -1.45, y: 2.6, z: 0.6 }),
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: 1.45, y: 2.6, z: 0.6 }),
        // striped awning roof (blue/white - Penghu sea theme)
        box(3.6, 0.16, 2.0, 0x3a6a9a, { y: 3.75, hex2: 0x3a6a9a }),
        box(0.5, 0.18, 2.0, 0xe8e4de, { x: -1.1, y: 3.76 }), // white stripe
        box(0.5, 0.18, 2.0, 0xe8e4de, { x: 0.0, y: 3.76 }),
        box(0.5, 0.18, 2.0, 0xe8e4de, { x: 1.1, y: 3.76 }),
        // little hanging menu valance
        box(3.6, 0.4, 0.1, 0xf0c040, { y: 3.5, z: 1.0 }),
        // two cart wheels
        cyl(0.4, 0.4, 0.18, 8, 0x3a2a22, { rx: HALF_PI, x: -1.1, y: 0.3, z: 0.85 }),
        cyl(0.4, 0.4, 0.18, 8, 0x3a2a22, { rx: HALF_PI, x: 1.1, y: 0.3, z: 0.85 }),
        // a seafood display box on the counter
        box(0.8, 0.3, 0.6, 0x4a6a8a, { x: 0.9, y: 1.85 }),
        // ice with seafood on display
        box(0.7, 0.15, 0.5, 0xe8f4f8, { x: 0.9, y: 2.05 }),
        // a stack of cups
        cyl(0.2, 0.2, 0.4, 8, 0xe8e4de, { x: -0.9, y: 1.9 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
