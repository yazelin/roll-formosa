/**
 * @file packs/matsu/archetypes/t5.js — Roll Formosa Matsu pack, TIER 5
 * content: 坑道與軍事據點 (Tunnels & military outposts).
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the military installation
 * scale band (radiusNominal 12–60 m real). Eight absorbable archetypes
 * (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK LANDMARKS
 * (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT declared
 * in packs/matsu/tiers.js — spelling must NOT drift.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * yOffset = -1 - minY of the normalized geometry: every object here sits on
 * the ground (bottom near the sphere's lowest point) so yOffset ≈ -1 + a
 * little, measured from the built geometry and rounded.
 */

import {
  paint, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

const TIER = 5;

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T5_ARCHETYPES = [
  /* ---- slot 0: 軍營 (military barracks building) ----------------------- */
  {
    id: 'military_barracks',
    displayName: '軍營',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x5a6a5a, 0x4a5a4a, 0x6a7a6a, 0x3a4a3a, 0x8a9a8a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Military barracks: long low concrete building with barred windows
      const parts = [
        // main barracks body (olive drab concrete)
        box(4.4, 1.8, 2.4, 0x5a6a5a, { y: 0.9 }),
        box(4.5, 0.15, 2.5, 0x4a5a4a, { y: 0.08 }), // concrete foundation
        box(4.5, 0.12, 2.5, 0x6a7a6a, { y: 1.86 }), // roof slab
        // flat military roof with slight overhang
        box(4.6, 0.08, 2.6, 0x5a6268, { y: 1.96 }),
      ];
      // barred windows on front face
      for (let i = 0; i < 5; i++) {
        const x = -1.6 + i * 0.8;
        parts.push(box(0.4, 0.5, 0.08, 0x2a3a3a, { x, y: 1.1, z: 1.22 })); // window dark
        // vertical bars
        for (let b = 0; b < 3; b++) {
          parts.push(box(0.03, 0.5, 0.04, 0x6a7078, { x: x - 0.12 + b * 0.12, y: 1.1, z: 1.26 }));
        }
      }
      // entrance door with military sign
      parts.push(box(0.7, 1.2, 0.1, 0x4a5a4a, { y: 0.65, z: 1.22 })); // door
      parts.push(box(0.8, 0.2, 0.06, 0xc83828, { y: 1.35, z: 1.26 })); // sign above door
      // flagpole
      parts.push(cyl(0.04, 0.04, 2.2, 6, 0x9aa0aa, { x: 2.0, z: 1.4, y: 1.1 }));
      parts.push(box(0.4, 0.25, 0.02, 0xc83828, { x: 2.0, z: 1.42, y: 2.05 })); // flag (red)
      return finish(parts);
    },
  },

  /* ---- slot 1: 坑道入口 (tunnel entrance) ------------------------------ */
  {
    id: 'tunnel_entrance',
    displayName: '坑道入口',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7068, 0x5a6058, 0x8a9088, 0x4a5048, 0x3a4038],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Tunnel entrance: concrete portal into hillside with blast doors
      const parts = [
        // hillside / rock mass
        box(3.6, 2.2, 2.8, 0x6a7068, { y: 1.1 }),
        // tunnel portal (arched concrete frame)
        cyl(1.3, 1.3, 0.5, 8, 0x8a9088, { y: 1.3, z: 1.4, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // dark tunnel interior
        cyl(1.1, 1.1, 0.6, 8, 0x1a1e1a, { y: 1.3, z: 1.35, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        box(2.2, 1.3, 0.3, 0x1a1e1a, { y: 0.65, z: 1.35 }), // lower tunnel dark
        // concrete frame surround
        box(2.8, 0.2, 0.3, 0x8a9088, { y: 0.1, z: 1.4 }), // threshold
        box(0.25, 2.4, 0.3, 0x8a9088, { x: -1.3, y: 1.2, z: 1.4 }), // frame L
        box(0.25, 2.4, 0.3, 0x8a9088, { x: 1.3, y: 1.2, z: 1.4 }), // frame R
        // blast door tracks
        box(2.6, 0.08, 0.1, 0x5a6268, { y: 2.45, z: 1.45 }),
        // warning signs
        box(0.6, 0.4, 0.06, 0xe0a030, { x: -1.6, y: 1.4, z: 1.5 }), // warning sign (yellow)
        box(0.5, 0.12, 0.04, 0x1a1e1a, { x: -1.6, y: 1.4, z: 1.54 }), // text bar
      ];
      // rock texture on hillside
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.8 + Math.sin(i) * 0.2, 0.5, 0.2, 0x5a6058, {
          x: -1.2 + i * 1.2, y: 1.8 + i * 0.15, z: 1.3
        }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 碉堡 (bunker / pillbox) --------------------------------- */
  {
    id: 'bunker',
    displayName: '碉堡',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 15,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7268, 0x5a6258, 0x7a8278, 0x4a5248, 0x8a9288],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Concrete bunker/pillbox with gun slits
      const parts = [
        // main bunker body (thick reinforced concrete)
        box(3.0, 1.6, 2.4, 0x6a7268, { y: 0.8 }),
        // sloped front face for deflection
        box(3.2, 0.3, 0.4, 0x7a8278, { y: 1.7, z: 1.1, rx: -0.3 }),
        // gun slits (horizontal openings)
        box(0.8, 0.15, 0.5, 0x1a1e1a, { x: -0.8, y: 1.0, z: 1.22 }), // slit L
        box(0.8, 0.15, 0.5, 0x1a1e1a, { x: 0.8, y: 1.0, z: 1.22 }), // slit R
        // slit hoods (concrete)
        box(0.9, 0.08, 0.15, 0x8a9288, { x: -0.8, y: 1.12, z: 1.3 }),
        box(0.9, 0.08, 0.15, 0x8a9288, { x: 0.8, y: 1.12, z: 1.3 }),
        // flat reinforced roof
        box(3.2, 0.2, 2.6, 0x5a6258, { y: 1.7 }),
        // camouflage netting support poles
        cyl(0.04, 0.04, 0.5, 6, 0x5a4a3a, { x: -1.3, z: -1.0, y: 2.0 }),
        cyl(0.04, 0.04, 0.5, 6, 0x5a4a3a, { x: 1.3, z: -1.0, y: 2.0 }),
        // entrance at rear
        box(0.6, 1.0, 0.2, 0x3a3e3a, { z: -1.25, y: 0.55 }),
        // sandbag stack beside entrance
        box(0.5, 0.4, 0.4, 0x8a7a5a, { x: 0.7, z: -1.1, y: 0.2 }),
        box(0.5, 0.3, 0.35, 0x8a7a5a, { x: 0.7, z: -1.1, y: 0.55 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 雷達站 (radar station) ---------------------------------- */
  {
    id: 'radar_station',
    displayName: '雷達站',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 25,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8dce0, 0xc8ccd0, 0x5a6a6a, 0x8a9098, 0x3a4a4a],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Radar station: white radome on concrete base with equipment (reduced segments)
      const parts = [
        // concrete base building
        box(3.0, 1.2, 2.4, 0x8a9098, { y: 0.6 }),
        box(3.1, 0.1, 2.5, 0x6a7078, { y: 0.05 }), // foundation
        // radome (spherical radar housing) - reduced segments
        sph(1.4, 0xd8dce0, { ws: 8, hs: 6, y: 2.8 }),
        // radome support pedestal
        cyl(0.7, 0.9, 1.2, 6, 0xc8ccd0, { y: 1.8 }),
        // equipment cabinet on roof
        box(0.8, 0.6, 0.6, 0x5a6a6a, { x: -0.8, y: 1.5 }),
        // door
        box(0.6, 0.9, 0.08, 0x4a5a5a, { y: 0.5, z: 1.22 }),
        // warning light on top
        sph(0.15, 0xc83828, { ws: 4, hs: 3, y: 4.0 }),
        // antenna array beside radome
        box(0.8, 0.4, 0.08, 0xc8ccd0, { x: 1.6, y: 2.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 營舍 (army quarters) ------------------------------------ */
  {
    id: 'army_quarters',
    displayName: '營舍',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x6a7a6a, 0x5a6a5a, 0x8a9a8a, 0x4a5a4a, 0x7a8a7a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Two-story army quarters with external staircase
      const parts = [
        // main building body
        box(4.0, 2.6, 2.2, 0x6a7a6a, { y: 1.3 }),
        box(4.1, 0.12, 2.3, 0x5a6a5a, { y: 0.06 }), // foundation
        // floor divider band
        box(4.1, 0.1, 2.25, 0x7a8a7a, { y: 1.3 }),
        // flat roof
        box(4.2, 0.12, 2.4, 0x5a6268, { y: 2.66 }),
      ];
      // windows on both floors
      for (let floor = 0; floor < 2; floor++) {
        const baseY = 0.6 + floor * 1.3;
        for (let i = 0; i < 4; i++) {
          const x = -1.4 + i * 0.9;
          const lit = rng() < 0.4 ? 0xfff0c0 : 0x2a3a3a;
          parts.push(box(0.4, 0.5, 0.08, lit, { x, y: baseY, z: 1.12 }));
        }
      }
      // external staircase (side)
      parts.push(box(0.8, 1.3, 0.6, 0x8a9a8a, { x: 2.2, y: 0.65, z: -0.5 }));
      for (let s = 0; s < 5; s++) {
        parts.push(box(0.75, 0.08, 0.2, 0x6a7a6a, { x: 2.2, y: 0.15 + s * 0.25, z: -0.1 - s * 0.1 }));
      }
      // upper walkway
      parts.push(box(4.0, 0.08, 0.5, 0x7a8a7a, { y: 1.35, z: 1.35 }));
      parts.push(box(4.0, 0.4, 0.05, 0x6a7a6a, { y: 1.55, z: 1.58 })); // railing
      // entrance
      parts.push(box(0.8, 1.1, 0.1, 0x4a5a4a, { x: -1.2, y: 0.6, z: 1.12 }));
      return finish(parts);
    },
  },

  /* ---- slot 5: 軍事標語牆 (military slogan wall) ----------------------- */
  {
    id: 'military_slogan_wall',
    displayName: '軍事標語牆',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8dce0, 0xc83828, 0x2a6a3a, 0x8a9098, 0x1a2a3a],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Large propaganda wall with military slogans (枕戈待旦, etc.)
      const parts = [
        // main wall structure
        box(5.0, 2.8, 0.4, 0xd8dce0, { y: 1.4 }),
        // wall cap
        box(5.2, 0.15, 0.5, 0x8a9098, { y: 2.88 }),
        // foundation base
        box(5.2, 0.25, 0.6, 0x6a7078, { y: 0.12 }),
        // large red slogan panel
        box(4.2, 1.8, 0.08, 0xc83828, { y: 1.5, z: 0.25 }),
        // white character blocks (representing 枕戈待旦)
        box(0.7, 1.2, 0.04, 0xf8f8f0, { x: -1.4, y: 1.5, z: 0.32 }),
        box(0.7, 1.2, 0.04, 0xf8f8f0, { x: -0.5, y: 1.5, z: 0.32 }),
        box(0.7, 1.2, 0.04, 0xf8f8f0, { x: 0.5, y: 1.5, z: 0.32 }),
        box(0.7, 1.2, 0.04, 0xf8f8f0, { x: 1.4, y: 1.5, z: 0.32 }),
        // decorative frame
        box(4.4, 0.1, 0.06, 0x2a6a3a, { y: 2.5, z: 0.28 }),
        box(4.4, 0.1, 0.06, 0x2a6a3a, { y: 0.55, z: 0.28 }),
        // ROC emblem circle at top
        cyl(0.35, 0.35, 0.06, 10, 0x2a6a3a, { y: 2.72, z: 0.28, rx: HALF_PI }),
        sph(0.15, 0xffffff, { ws: 6, hs: 4, y: 2.72, z: 0.32 }),
      ];
      // support pillars at sides
      parts.push(box(0.3, 2.6, 0.5, 0x8a9098, { x: -2.4, y: 1.3 }));
      parts.push(box(0.3, 2.6, 0.5, 0x8a9098, { x: 2.4, y: 1.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 瞭望塔 (watchtower) ------------------------------------- */
  {
    id: 'watchtower',
    displayName: '瞭望塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6a7a6a, 0x5a6a5a, 0x8a9a8a, 0x4a5a4a, 0xc8ccd0],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Military watchtower with observation platform
      const parts = [
        // main tower shaft (concrete)
        box(1.4, 4.5, 1.4, 0x6a7a6a, { y: 2.25 }),
        // foundation
        box(1.8, 0.3, 1.8, 0x5a6a5a, { y: 0.15 }),
        // observation platform at top
        box(2.2, 0.2, 2.2, 0x5a6a5a, { y: 4.6 }),
        // observation cabin
        box(1.8, 1.2, 1.8, 0x8a9a8a, { y: 5.3 }),
        // windows all around observation cabin
        box(1.4, 0.5, 0.06, 0x2a3a4a, { y: 5.4, z: 0.92 }), // front
        box(1.4, 0.5, 0.06, 0x2a3a4a, { y: 5.4, z: -0.92 }), // back
        box(0.06, 0.5, 1.4, 0x2a3a4a, { y: 5.4, x: 0.92 }), // side
        box(0.06, 0.5, 1.4, 0x2a3a4a, { y: 5.4, x: -0.92 }), // side
        // roof
        cyl(1.3, 0.1, 2.0, 4, 0x4a5a4a, { theta0: PI / 4, rx: HALF_PI, sy: 0.5, y: 6.2 }),
        // searchlight on roof
        cyl(0.15, 0.2, 0.3, 6, 0xc8ccd0, { y: 6.4, rz: 0.3 }),
        // ladder rungs up the side
      ];
      for (let i = 0; i < 8; i++) {
        parts.push(box(0.08, 0.08, 0.15, 0x5a6a5a, { x: 0.75, y: 0.5 + i * 0.5, z: 0 }));
      }
      // flagpole on roof
      parts.push(cyl(0.03, 0.03, 1.0, 6, 0x8a9098, { y: 7.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 彈藥庫 (ammunition depot) ------------------------------- */
  {
    id: 'ammo_depot',
    displayName: '彈藥庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x6a7268, 0x5a6258, 0x7a8278, 0x4a5248, 0xe0a030],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Reinforced ammunition storage building
      const parts = [
        // main bunker body (extra thick walls)
        box(3.4, 1.8, 2.6, 0x6a7268, { y: 0.9 }),
        // reinforced concrete roof (arched for blast protection)
        cyl(1.5, 1.5, 3.6, 8, 0x7a8278, { theta0: 0, thetaLen: PI, rx: HALF_PI, sy: 0.4, y: 1.9 }),
        // foundation
        box(3.6, 0.25, 2.8, 0x5a6258, { y: 0.12 }),
        // blast door (heavy reinforced)
        box(1.2, 1.4, 0.2, 0x4a5248, { y: 0.75, z: 1.35 }),
        box(1.3, 0.15, 0.25, 0x5a6258, { y: 1.5, z: 1.35 }), // door frame top
        // warning signs
        box(0.5, 0.5, 0.06, 0xe0a030, { x: -1.4, y: 1.2, z: 1.35 }), // explosive warning
        box(0.3, 0.3, 0.04, 0x1a1e1a, { x: -1.4, y: 1.2, z: 1.39 }), // symbol
        box(0.5, 0.5, 0.06, 0xc83828, { x: 1.4, y: 1.2, z: 1.35 }), // no smoking
        // ventilation shaft
        cyl(0.25, 0.25, 0.6, 6, 0x5a6258, { x: 1.0, y: 2.3 }),
        cyl(0.3, 0.3, 0.08, 6, 0x6a7268, { x: 1.0, y: 2.65 }),
        // earth berm around building (blast protection)
        box(4.0, 0.5, 0.6, 0x5a6a4a, { y: 0.25, z: -1.6 }),
        box(0.6, 0.5, 2.8, 0x5a6a4a, { x: -2.0, y: 0.25 }),
        box(0.6, 0.5, 2.8, 0x5a6a4a, { x: 2.0, y: 0.25 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 坑道大門 (chunk landmark — large tunnel gate) ----------- */
  {
    id: 'tunnel_gate',
    displayName: '坑道大門',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x6a7068, 0x5a6058, 0x8a9088, 0x4a5048, 0xc83828],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Large military tunnel entrance (like Beihai Tunnel smaller entrance)
      const parts = [
        // rock / cliff mass
        box(6.0, 4.0, 4.0, 0x6a7068, { y: 2.0 }),
        // secondary rock formations
        box(2.0, 3.0, 1.5, 0x5a6058, { x: -3.2, y: 1.5 }),
        box(2.0, 2.5, 1.5, 0x5a6058, { x: 3.2, y: 1.25 }),
        // main tunnel portal (large arched opening)
        cyl(2.0, 2.0, 0.8, 10, 0x8a9088, { y: 2.0, z: 2.05, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // tunnel interior darkness
        cyl(1.7, 1.7, 1.0, 10, 0x0a0e0a, { y: 2.0, z: 1.95, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        box(3.4, 2.0, 0.8, 0x0a0e0a, { y: 1.0, z: 1.95 }), // lower dark
        // concrete portal frame
        box(4.2, 0.3, 0.4, 0x8a9088, { y: 0.15, z: 2.1 }), // threshold
        box(0.4, 4.0, 0.4, 0x8a9088, { x: -2.0, y: 2.0, z: 2.1 }), // frame L
        box(0.4, 4.0, 0.4, 0x8a9088, { x: 2.0, y: 2.0, z: 2.1 }), // frame R
        box(4.4, 0.4, 0.4, 0x8a9088, { y: 4.0, z: 2.1 }), // arch crown
        // blast door rails
        box(4.0, 0.1, 0.15, 0x5a6268, { y: 4.1, z: 2.2 }),
        // military signage
        box(2.0, 0.6, 0.1, 0xc83828, { y: 4.4, z: 2.15 }), // sign board
        box(1.6, 0.4, 0.06, 0xf8f8f0, { y: 4.4, z: 2.22 }), // text area
        // warning lights
        cyl(0.15, 0.15, 0.1, 6, 0xe0a030, { x: -2.2, y: 3.8, z: 2.2, rx: HALF_PI }),
        cyl(0.15, 0.15, 0.1, 6, 0xe0a030, { x: 2.2, y: 3.8, z: 2.2, rx: HALF_PI }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 9: 軍事哨站 (chunk landmark — military outpost) ------------ */
  {
    id: 'military_outpost',
    displayName: '軍事哨站',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 45,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x5a6a5a, 0x4a5a4a, 0x6a7a6a, 0x8a9a8a, 0xc83828],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Simplified military outpost complex
      const parts = [
        // perimeter ground slab
        box(6.0, 0.1, 5.0, 0x5a6258, { y: 0.05 }),
        // guard house
        box(2.0, 1.6, 1.6, 0x5a6a5a, { x: -2.0, y: 0.8 }),
        box(2.1, 0.1, 1.7, 0x4a5a4a, { x: -2.0, y: 1.65 }),
        // barracks
        box(2.8, 1.4, 2.0, 0x6a7a6a, { x: 1.5, z: -1.0, y: 0.7 }),
        box(2.9, 0.1, 2.1, 0x4a5a4a, { x: 1.5, z: -1.0, y: 1.45 }),
        // watchtower (simplified)
        box(1.0, 3.0, 1.0, 0x5a6a5a, { x: 2.5, z: 2.0, y: 1.5 }),
        box(1.2, 0.8, 1.2, 0x6a7a6a, { x: 2.5, z: 2.0, y: 3.3 }),
        // flagpole with flag
        cyl(0.05, 0.05, 2.5, 4, 0x8a9098, { x: -2.0, z: 2.0, y: 1.25 }),
        box(0.5, 0.3, 0.02, 0xc83828, { x: -2.0, z: 2.02, y: 2.35 }),
        // window on guard house
        box(0.4, 0.4, 0.06, 0x2a3a3a, { x: -2.0, y: 0.9, z: 0.82 }),
      ];
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
