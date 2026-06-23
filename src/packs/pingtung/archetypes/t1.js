/**
 * @file packs/pingtung/archetypes/t1.js — T1 墾丁大街 (Kenting Street food items).
 *
 * Tier 1 of the Roll Formosa Pingtung ladder (墾丁大街, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/pingtung/tiers.js:
 *   slots [0..7] absorbable 墾丁大街小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (墾丁大街拱門 / 海鮮攤車, spawnWeight ~0.3).
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
  /* [0] tuna_sashimi 黑鮪魚生魚片 — thick slab of raw bluefin tuna      */
  /* ---------------------------------------------------------------- */
  {
    id: 'tuna_sashimi',
    displayName: '黑鮪魚生魚片',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc83848, 0xd84858, 0xa82838, 0xe86878, 0xb83040],
    yOffset: -0.55,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Thick slab of deep red tuna
        box(1.6, 0.5, 1.0, 0xffffff, { y: 0.25, hex2: 0xd84858 }),
        // Fatty marbling streaks
        box(1.4, 0.08, 0.15, 0xffc8c8, { y: 0.45, z: 0.2 }),
        box(1.2, 0.08, 0.12, 0xffd0d0, { y: 0.42, z: -0.15 }),
        box(1.0, 0.08, 0.1, 0xffe0e0, { y: 0.38, z: 0.35 }),
        // Slight sheen on top
        box(1.5, 0.04, 0.9, 0xff5868, { y: 0.52 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] grilled_flying_fish 烤飛魚 — whole grilled flying fish on stick */
  /* ---------------------------------------------------------------- */
  {
    id: 'grilled_flying_fish',
    displayName: '烤飛魚',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0xa07850, 0x6a5038, 0xb88860, 0x7a5a40],
    yOffset: -0.48,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // Fish body - grilled brown
        sph(0.5, 0xffffff, { ws: 8, hs: 6, sx: 2.0, sy: 0.8, y: 0.3, hex2: 0xa07850 }),
        // Head
        cone(0.35, 0.6, 6, 0x9a7048, { rz: -HALF_PI, x: 1.2, y: 0.3 }),
        // Tail fin
        box(0.5, 0.5, 0.08, 0x7a5a40, { x: -1.3, y: 0.35, rz: 0.3 }),
        // Pectoral fins (the flying fish wings)
        box(0.6, 0.08, 0.8, 0x8a6848, { x: 0.2, y: 0.5, z: 0.4, rx: 0.15 }),
        box(0.6, 0.08, 0.8, 0x8a6848, { x: 0.2, y: 0.5, z: -0.4, rx: -0.15 }),
        // Bamboo skewer
        cyl(0.06, 0.06, 2.8, 6, 0xd8c090, { rz: HALF_PI, y: 0.1 }),
        // Grill char marks
        box(0.12, 0.08, 0.7, 0x4a3020, { x: 0.3, y: 0.52 }),
        box(0.12, 0.08, 0.7, 0x4a3020, { x: -0.3, y: 0.52 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] pig_trotter_chunk 萬巒豬腳塊 — chunk of braised pork trotter    */
  /* ---------------------------------------------------------------- */
  {
    id: 'pig_trotter_chunk',
    displayName: '萬巒豬腳塊',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc87848, 0xb86838, 0xa85828, 0xd88858, 0xe89868],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Main chunk of braised pork
        sph(0.75, 0xffffff, { ws: 8, hs: 6, sy: 0.8, y: 0.4, hex2: 0xc87848 }),
        // Glazed skin layer on top
        sph(0.72, 0xd89060, { ws: 7, hs: 4, sy: 0.4, y: 0.7, thetaLen: HALF_PI }),
        // Bone end showing
        cyl(0.15, 0.18, 0.4, 6, 0xf0e8d8, { x: 0.5, y: 0.3 }),
        // Sauce glaze drips
        box(0.2, 0.1, 0.3, 0x8a4820, { x: -0.3, y: 0.15, z: 0.3 }),
        box(0.15, 0.08, 0.25, 0x8a4820, { x: 0.2, y: 0.12, z: -0.25 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] coconut_juice 椰子汁 — fresh coconut with straw                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'coconut_juice',
    displayName: '椰子汁',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x8a6a48, 0x9a7858, 0x7a5a38, 0xa88868, 0x6a4a28],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Coconut body (brown husk)
        sph(0.9, 0xffffff, { ws: 10, hs: 7, y: 0.9, hex2: 0x9a7858 }),
        // Cut opening on top
        cyl(0.4, 0.4, 0.15, 8, 0xf8f0e8, { y: 1.65 }),
        // White flesh visible
        cyl(0.35, 0.35, 0.08, 8, 0xffffff, { y: 1.7 }),
        // Colorful bendable straw
        cyl(0.06, 0.06, 0.8, 6, 0xff6080, { y: 2.0 }),
        cyl(0.06, 0.06, 0.3, 6, 0xff6080, { rz: 0.6, x: 0.08, y: 2.35 }),
        // Fiber texture lines
        box(0.06, 0.8, 0.06, 0x6a4a28, { x: 0.7, y: 0.9, z: 0.4 }),
        box(0.06, 0.8, 0.06, 0x6a4a28, { x: -0.5, y: 0.9, z: -0.6 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] seafood_bowl_pt 海鮮攤碗 — bowl of mixed Kenting seafood        */
  /* ---------------------------------------------------------------- */
  {
    id: 'seafood_bowl_pt',
    displayName: '海鮮攤碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4f0, 0xe8e4e0, 0xd8d4d0, 0xf0ece8, 0xe0dcd8],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // White ceramic bowl
        cyl(0.8, 0.6, 0.8, 10, 0xffffff, { y: 0.4 }),
        cyl(0.75, 0.75, 0.12, 10, 0xf0ece8, { y: 0.85 }),
        // Seafood contents
        sph(0.25, 0xd85848, { ws: 6, hs: 4, x: 0.2, y: 0.9, z: 0.1 }), // shrimp
        sph(0.22, 0xd85848, { ws: 6, hs: 4, x: -0.25, y: 0.85, z: -0.15 }), // shrimp
        box(0.35, 0.15, 0.25, 0xf8f0e8, { x: 0, y: 0.95, z: 0.25 }), // squid piece
        sph(0.18, 0x2a2a2a, { ws: 5, hs: 3, x: 0.3, y: 0.88, z: -0.2 }), // mussel
        // Chopsticks
        cyl(0.03, 0.03, 1.0, 4, 0xd8c098, { rz: 0.3, x: 0.5, y: 1.1 }),
        cyl(0.03, 0.03, 1.0, 4, 0xd8c098, { rz: 0.35, x: 0.6, y: 1.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] mango_ice_cup 芒果冰杯 — cup of fresh mango shaved ice          */
  /* ---------------------------------------------------------------- */
  {
    id: 'mango_ice_cup',
    displayName: '芒果冰杯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.065,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xffc040, 0xffb030, 0xffd050, 0xffe060, 0xffa020],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // Clear plastic cup
        cyl(0.55, 0.7, 1.1, 10, 0xe8f4f8, { y: 0.55 }),
        // Shaved ice mound (white/yellow)
        sph(0.6, 0xfff8e8, { ws: 8, hs: 5, y: 1.2, hex2: 0xfff0d0 }),
        // Fresh mango chunks on top
        box(0.25, 0.18, 0.2, 0xffc040, { x: 0.15, y: 1.55, z: 0.1 }),
        box(0.22, 0.16, 0.18, 0xffb030, { x: -0.2, y: 1.5, z: -0.12 }),
        box(0.2, 0.14, 0.22, 0xffd050, { x: 0.05, y: 1.6, z: -0.2 }),
        // Mango sauce drizzle
        box(0.5, 0.06, 0.1, 0xffa020, { y: 1.45, rz: 0.2 }),
        // Plastic spoon
        sph(0.12, 0xf8f8f8, { ws: 5, hs: 3, x: 0.4, y: 1.4 }),
        cyl(0.04, 0.04, 0.6, 4, 0xf8f8f8, { x: 0.55, y: 1.5, rz: 0.4 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] grilled_corn_pt 烤玉米 — grilled corn on the cob with sauce     */
  /* ---------------------------------------------------------------- */
  {
    id: 'grilled_corn_pt',
    displayName: '烤玉米',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8c040, 0xd8b030, 0xf8d050, 0xc8a020, 0xe8b838],
    yOffset: -0.50,
    upright: false,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const parts = [
        // Corn cob body
        cyl(0.4, 0.4, 2.0, 8, 0xffffff, { rz: HALF_PI, hex2: 0xe8c040 }),
        // Kernel bumps (simple boxes instead of high-tri torus)
        box(0.1, 0.5, 0.5, 0xf8d050, { x: -0.6, y: 0.3 }),
        box(0.1, 0.5, 0.5, 0xf8d050, { x: 0.0, y: 0.3 }),
        box(0.1, 0.5, 0.5, 0xf8d050, { x: 0.6, y: 0.3 }),
        box(0.1, 0.5, 0.5, 0xf8d050, { x: -0.6, y: -0.3 }),
        box(0.1, 0.5, 0.5, 0xf8d050, { x: 0.0, y: -0.3 }),
        box(0.1, 0.5, 0.5, 0xf8d050, { x: 0.6, y: -0.3 }),
        // Char marks from grilling
        box(0.12, 0.5, 0.12, 0x6a4020, { x: 0.2, y: 0.35 }),
        box(0.12, 0.5, 0.12, 0x6a4020, { x: -0.4, y: 0.35 }),
        // Sauce glaze
        box(1.6, 0.08, 0.3, 0xc87030, { y: 0.45 }),
        // Bamboo stick handle
        cyl(0.08, 0.08, 0.6, 6, 0xd8c090, { rz: HALF_PI, x: 1.3, y: 0 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] seaweed_skewer 海藻串 — skewer of seasoned seaweed from beach   */
  /* ---------------------------------------------------------------- */
  {
    id: 'seaweed_skewer',
    displayName: '海藻串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2a5a3a, 0x3a6a4a, 0x1a4a2a, 0x4a7a5a, 0x2a6040],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // Bamboo skewer
        cyl(0.06, 0.06, 2.4, 6, 0xd8c090, { y: 1.2 }),
      ];
      // Folded seaweed pieces on the skewer
      for (let i = 0; i < 4; i++) {
        const y = 0.5 + i * 0.45;
        const rot = i * 0.4;
        parts.push(
          box(0.4, 0.15, 0.5, 0xffffff, { y, ry: rot, hex2: 0x3a6a4a }),
          box(0.35, 0.12, 0.45, 0x2a5a3a, { y: y + 0.08, ry: rot + 0.2 })
        );
      }
      // Sesame seed sprinkle
      parts.push(sph(0.04, 0xf8f0e0, { ws: 4, hs: 3, x: 0.15, y: 1.0, z: 0.2 }));
      parts.push(sph(0.04, 0xf8f0e0, { ws: 4, hs: 3, x: -0.1, y: 1.4, z: -0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — kenting_street_arch 墾丁大街拱門               */
  /* ---------------------------------------------------------------- */
  {
    id: 'kenting_street_arch',
    displayName: '墾丁大街拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xff6040, 0xffd040, 0x40c0ff, 0x40ff80, 0xff40a0],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [
        // Two colorful pillars
        box(0.4, 3.0, 0.4, 0xff6040, { x: -1.8, y: 1.5, hex2: 0xff8060 }),
        box(0.4, 3.0, 0.4, 0x40c0ff, { x: 1.8, y: 1.5, hex2: 0x60d0ff }),
        // Pillar caps
        box(0.55, 0.15, 0.55, 0xffd040, { x: -1.8, y: 3.1 }),
        box(0.55, 0.15, 0.55, 0xffd040, { x: 1.8, y: 3.1 }),
        // Tropical arch top with wavy beach theme
        torus(1.85, 0.2, 4, 8, 0x40ff80, { y: 3.0, arc: PI }),
        // Sign board
        box(3.2, 0.6, 0.15, 0xff40a0, { y: 3.7 }),
        box(3.0, 0.5, 0.08, 0xffffff, { y: 3.7, z: 0.05 }),
        // Decorative palm leaf shapes on top
        box(0.8, 0.3, 0.08, 0x40c040, { x: -1.2, y: 4.0, rz: 0.3 }),
        box(0.8, 0.3, 0.08, 0x40c040, { x: 1.2, y: 4.0, rz: -0.3 }),
        // Hanging string lights
      ];
      for (let i = 0; i < 5; i++) {
        const lx = -1.4 + i * 0.7;
        const c = [0xff6040, 0xffd040, 0x40c0ff, 0x40ff80, 0xff40a0][i];
        parts.push(sph(0.12, c, { ws: 5, hs: 4, x: lx, y: 2.5 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — seafood_stall 海鮮攤車                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'seafood_stall',
    displayName: '海鮮攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x3080c0, 0x40a0e0, 0xf8f4f0, 0xd8d4d0, 0xff6850],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const parts = [
        // Cart body - ocean blue
        box(2.2, 1.0, 1.2, 0xffffff, { y: 0.75, hex2: 0x40a0e0 }),
        // Stainless steel counter top
        box(2.35, 0.1, 1.35, 0xd8dce2, { y: 1.3 }),
        // Ice display bed
        box(2.0, 0.25, 1.1, 0xe8f8ff, { y: 1.45 }),
        // Seafood on display
        sph(0.2, 0xd85848, { ws: 5, hs: 3, x: -0.5, y: 1.65 }), // shrimp pile
        sph(0.18, 0xd85848, { ws: 5, hs: 3, x: -0.3, y: 1.6 }),
        box(0.4, 0.15, 0.3, 0xc83848, { x: 0.3, y: 1.58 }), // fish fillet
        box(0.35, 0.12, 0.25, 0xc83848, { x: 0.6, y: 1.55 }),
        // Canopy poles
        cyl(0.06, 0.06, 1.3, 5, 0x8a7a6a, { x: -1.0, y: 2.0, z: 0.5 }),
        cyl(0.06, 0.06, 1.3, 5, 0x8a7a6a, { x: 1.0, y: 2.0, z: 0.5 }),
        // Striped canopy
        box(2.5, 0.1, 1.5, 0xff6850, { y: 2.7, rx: 0.1 }),
        box(2.4, 0.08, 0.3, 0xffffff, { y: 2.68, z: 0.3 }),
        box(2.4, 0.08, 0.3, 0xffffff, { y: 2.68, z: -0.3 }),
        // Wheels
        cyl(0.25, 0.25, 0.12, 8, 0x2e3138, { rx: HALF_PI, x: -0.9, y: 0.25, z: 0 }),
        cyl(0.25, 0.25, 0.12, 8, 0x2e3138, { rx: HALF_PI, x: 0.9, y: 0.25, z: 0 }),
        // Sign
        box(0.8, 0.4, 0.06, 0xffffff, { x: 0, y: 2.2, z: 0.7 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
