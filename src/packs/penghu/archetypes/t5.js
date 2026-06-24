/**
 * @file archetypes/t5.js — Penghu pack T5 「漁港商區」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the fishing harbor / commercial
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/penghu/tiers.js — spelling must NOT drift.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * Palette = 4–5 hex tints (catalog.test enforces 4–6). Bodies meant to be
 * tinted per-instance are baked near-white (0xffffff) so instanceColor reads
 * through; fixed parts (glass, steel, asphalt) are baked dark/desaturated so
 * tints only nudge them.
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
  /* ---- slot 0: 漁會大樓 fishermen's association building --------------- */
  {
    id: 'fishermen_association',
    displayName: '漁會大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a6a8a, 0xc8d4e2, 0x8a98aa, 0x2e3744, 0xe2e8f0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Fishermen's association building - common in Penghu fishing ports
      return finish([
        towerBanded(2.6, 5.5, 2.0, 10, 0xffffff, 0x2e4a5a, 0xfff0c0, rng, { y: 2.75 }),
        // nautical blue trim bands
        box(2.7, 0.2, 2.1, 0x3a6a9a, { y: 0.4 }),
        box(2.7, 0.15, 2.1, 0x3a6a9a, { y: 5.6 }),
        // ground-floor lobby
        box(2.8, 0.9, 2.2, 0x222a34, { y: 0.45 }),
        box(1.0, 0.7, 0.06, 0x9fb4cc, { y: 0.4, z: 1.12 }), // lit lobby glass
        // rooftop with antenna
        box(2.2, 0.3, 1.7, 0xd6dee8, { y: 5.9 }),
        cyl(0.05, 0.05, 1.0, 6, 0xb04030, { y: 6.6 }),
        // fish logo/sign on front
        box(1.2, 0.4, 0.08, 0x4a8ac0, { y: 4.5, z: 1.02 }),
      ]);
    },
  },

  /* ---- slot 1: 魚市場 fish market -------------------------------------- */
  {
    id: 'fish_market',
    displayName: '魚市場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 30,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd0d8e0, 0xe8eef4, 0x8a9098, 0x3a6a9a, 0xf0f4f8],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Large covered fish market building
      const parts = [
        // main warehouse structure
        box(5.0, 2.5, 3.5, 0xffffff, { y: 1.4 }), // main body
        // arched roof (using half cylinder)
        cyl(2.0, 2.0, 5.2, 8, 0xd0d8e0, { theta0: PI, rx: HALF_PI, sy: 0.6, y: 3.2 }),
        // open sides (roll-up doors)
        box(4.6, 1.8, 0.08, 0x2a3a48, { y: 1.0, z: 1.78 }),
        // loading dock
        box(5.2, 0.3, 1.0, 0x9aa0aa, { y: 0.15, z: 2.2 }),
        // blue trim typical of fishing facilities
        box(5.1, 0.15, 0.06, 0x3a6a9a, { y: 2.7, z: 1.78 }),
        // ventilation units
        box(0.6, 0.4, 0.6, 0x8a9098, { x: -1.8, y: 3.6 }),
        box(0.6, 0.4, 0.6, 0x8a9098, { x: 1.8, y: 3.6 }),
        // sign
        box(2.0, 0.5, 0.1, 0x3a6a9a, { y: 3.0, z: 1.8 }),
        box(1.8, 0.35, 0.06, 0xffffff, { y: 3.0, z: 1.86 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 漁港碼頭 fishing pier ----------------------------------- */
  {
    id: 'fishing_pier',
    displayName: '漁港碼頭',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x3a6ca8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Fishing pier with mooring posts and crane
      const parts = [
        // main pier deck
        box(8.0, 0.5, 2.0, 0xb0b6be, { y: 0.75 }),
        // pier supports (pylons)
        cyl(0.4, 0.5, 1.5, 6, 0x8a9098, { x: -3.0, y: 0.25 }),
        cyl(0.4, 0.5, 1.5, 6, 0x8a9098, { x: 0.0, y: 0.25 }),
        cyl(0.4, 0.5, 1.5, 6, 0x8a9098, { x: 3.0, y: 0.25 }),
        // mooring bollards
        cyl(0.15, 0.2, 0.3, 6, 0x44484f, { x: -2.5, z: 0.7, y: 1.15 }),
        cyl(0.15, 0.2, 0.3, 6, 0x44484f, { x: 0.5, z: 0.7, y: 1.15 }),
        cyl(0.15, 0.2, 0.3, 6, 0x44484f, { x: 2.5, z: 0.7, y: 1.15 }),
        // small crane
        box(0.4, 2.5, 0.4, 0xe0a838, { x: 3.2, y: 2.25 }),
        box(2.0, 0.2, 0.3, 0xe0a838, { x: 2.4, y: 3.4 }),
        cyl(0.04, 0.04, 1.5, 6, 0x6a7078, { x: 1.6, y: 2.7 }), // cable
        // fenders
        box(0.3, 0.5, 0.15, 0x2a2a30, { x: -3.5, z: 0.95, y: 0.75 }),
        box(0.3, 0.5, 0.15, 0x2a2a30, { x: 3.5, z: 0.95, y: 0.75 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 超商 (convenience store — universal Taiwan) ------------- */
  {
    id: 'island_convenience_store',
    displayName: '離島超商',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xffffff, 0xe8edf2, 0xf6f0e6, 0xe06a1a, 0xd8dee6],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Larger island convenience store with parking
      const parts = [
        // main store building
        box(3.5, 1.8, 2.5, 0xffffff, { y: 0.95 }),
        // signature stripes
        box(3.6, 0.25, 2.6, 0xe06a1a, { y: 1.95 }),
        box(3.6, 0.1, 2.6, 0x2a8a3a, { y: 2.12 }),
        box(3.6, 0.08, 2.6, 0xc83828, { y: 2.22 }),
        // large glass front
        box(3.0, 1.3, 0.08, 0x9fc4d8, { y: 0.75, z: 1.28 }),
        // entrance overhang
        box(2.5, 0.12, 1.0, 0xe06a1a, { y: 1.85, z: 1.8 }),
        cyl(0.08, 0.08, 1.7, 6, 0xd8dce2, { x: -1.0, y: 0.95, z: 2.2 }),
        cyl(0.08, 0.08, 1.7, 6, 0xd8dce2, { x: 1.0, y: 0.95, z: 2.2 }),
        // parking lot
        box(3.5, 0.08, 2.0, 0x5a5a5a, { y: 0.04, z: 3.0 }),
        // scooter parking
        box(0.6, 0.3, 0.4, 0x4a4a4a, { x: 1.2, y: 0.2, z: 3.2 }),
        box(0.6, 0.3, 0.4, 0x3a6a9a, { x: 0.4, y: 0.2, z: 3.2 }),
        // AC units
        box(0.5, 0.4, 0.4, 0xb8bec8, { x: 1.4, y: 2.4 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 製冰廠 ice factory -------------------------------------- */
  {
    id: 'ice_factory',
    displayName: '製冰廠',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 25,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd0e0f0, 0x9ab0c8, 0xe0eef8, 0x6a8aa0, 0xf0f8ff],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Ice factory - essential for fishing industry
      const parts = [
        // main factory building
        box(3.5, 4.5, 3.0, 0xffffff, { y: 2.4, hex2: 0xd0e0f0 }),
        // cold storage silos
        cyl(0.8, 0.8, 4.0, 8, 0xe0eef8, { x: -2.2, y: 2.0 }),
        cyl(0.8, 0.8, 4.0, 8, 0xe0eef8, { x: -2.2, y: 2.0, z: -1.4 }),
        // silo caps
        cone(0.9, 0.8, 8, 0x9ab0c8, { x: -2.2, y: 4.4 }),
        cone(0.9, 0.8, 8, 0x9ab0c8, { x: -2.2, y: 4.4, z: -1.4 }),
        // loading bay
        box(2.0, 1.5, 0.1, 0x4a5a68, { y: 0.85, z: 1.55 }),
        box(2.2, 0.2, 0.8, 0x8a9098, { y: 0.1, z: 1.9 }),
        // cooling unit on roof
        box(1.5, 0.8, 1.2, 0x8a9aa8, { x: 1.0, y: 5.1 }),
        // ice sign
        box(1.5, 0.5, 0.08, 0x6ac0e8, { y: 4.0, z: 1.55 }),
        // pipes
        cyl(0.1, 0.1, 3.0, 6, 0x6a8aa0, { x: 2.0, y: 3.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 觀光船碼頭 tourist boat terminal ------------------------ */
  {
    id: 'tourist_terminal',
    displayName: '觀光船碼頭',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8e0d0, 0xf0e8e0, 0x4a8090, 0xc8c0b0, 0x8a7a6a],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Tourist boat terminal with covered waiting area
      const parts = [
        // main terminal building
        box(4.0, 2.0, 2.5, 0xffffff, { y: 1.15, hex2: 0xe8e0d0 }),
        // large glass windows (sea views)
        box(3.6, 1.4, 0.08, 0x8fc8d8, { y: 1.2, z: 1.28 }),
        // covered pier walkway
        box(5.0, 0.1, 1.5, 0xc8c0b0, { y: 2.3, z: 2.5 }),
        // support posts
        cyl(0.12, 0.12, 2.2, 6, 0x8a7a6a, { x: -2.0, y: 1.15, z: 2.5 }),
        cyl(0.12, 0.12, 2.2, 6, 0x8a7a6a, { x: 0.0, y: 1.15, z: 2.5 }),
        cyl(0.12, 0.12, 2.2, 6, 0x8a7a6a, { x: 2.0, y: 1.15, z: 2.5 }),
        // ticket booth
        box(1.0, 1.5, 1.0, 0x4a8090, { x: -1.8, y: 0.75, z: 1.8 }),
        // blue accents (island tourism style)
        box(4.1, 0.15, 0.08, 0x4a8090, { y: 2.1, z: 1.28 }),
        // roof signage
        box(2.0, 0.4, 0.1, 0x4a8090, { y: 2.4, z: 1.28 }),
        box(1.8, 0.3, 0.06, 0xffffff, { y: 2.4, z: 1.35 }),
        // benches
        box(1.2, 0.25, 0.4, 0x8a7a6a, { x: 1.2, y: 0.3, z: 2.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 加油站 gas station (universal Taiwan) ------------------- */
  {
    id: 'gas_station',
    displayName: '加油站',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xeef2f4, 0xc94f46, 0x3a6ea0, 0xe0a83a, 0xd8dce2],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // big flat canopy roof on slender columns
        box(4.5, 0.3, 3.2, 0xffffff, { y: 2.5 }), // canopy slab
        box(4.6, 0.16, 3.3, 0xc94f46, { y: 2.72 }), // red fascia trim
        box(4.6, 0.08, 3.3, 0x3a6ea0, { y: 2.82 }), // blue trim stripe
      ];
      // 4 support columns
      const cx = [-1.8, 1.8, -1.8, 1.8];
      const cz = [1.2, 1.2, -1.2, -1.2];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.2, 0.2, 2.4, 7, 0xd8dce2, { x: cx[i], z: cz[i], y: 1.2 }));
      }
      // ground island slab
      parts.push(box(3.0, 0.15, 1.6, 0x9aa0aa, { y: 0.08 }));
      // 3 fuel pumps
      const px = [-0.9, 0.0, 0.9];
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.4, 0.9, 0.55, 0xeef2f4, { x: px[i], y: 0.6 }));
        parts.push(box(0.36, 0.28, 0.5, 0x2a3138, { x: px[i], y: 1.0 }));
        parts.push(box(0.34, 0.08, 0.45, 0xe0a83a, { x: px[i], y: 1.18 }));
      }
      // price sign
      parts.push(cyl(0.12, 0.12, 2.8, 6, 0xbfc4ca, { x: 2.4, z: -1.0, y: 1.4 }));
      parts.push(box(0.9, 1.0, 0.16, 0xc94f46, { x: 2.4, z: -1.0, y: 2.8 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 海產店 seafood restaurant ------------------------------ */
  {
    id: 'seafood_restaurant',
    displayName: '海產店',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe0d8c8, 0xf0e8d8, 0xc83838, 0x4a8090, 0xb8a890],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Penghu seafood restaurant with outdoor seating
      const parts = [
        // main building
        box(3.5, 2.4, 2.8, 0xffffff, { y: 1.3, hex2: 0xe0d8c8 }),
        // red banner sign (typical of 海產店)
        box(3.6, 0.6, 0.1, 0xc83838, { y: 2.3, z: 1.45 }),
        box(3.4, 0.45, 0.06, 0xfff0c0, { y: 2.3, z: 1.52 }),
        // front entrance with fish tanks visible
        box(2.8, 1.0, 0.08, 0x6ac8e0, { y: 0.6, z: 1.42 }), // glass front showing tanks
        // outdoor dining area
        box(3.8, 0.1, 1.5, 0xb8a890, { y: 0.05, z: 2.6 }), // patio
        // tables
        box(0.7, 0.4, 0.7, 0x8a7a6a, { x: -1.2, y: 0.3, z: 2.6 }),
        box(0.7, 0.4, 0.7, 0x8a7a6a, { x: 1.2, y: 0.3, z: 2.6 }),
        // sun umbrella
        cyl(0.06, 0.06, 1.5, 6, 0x6a6a6a, { x: 0, y: 0.95, z: 2.6 }),
        cyl(0.8, 0.0, 0.2, 8, 0xc83838, { x: 0, y: 1.8, z: 2.6 }),
        // lanterns
        sph(0.15, 0xc83838, { ws: 6, hs: 4, x: -1.6, y: 2.0, z: 1.5 }),
        sph(0.15, 0xc83838, { ws: 6, hs: 4, x: 1.6, y: 2.0, z: 1.5 }),
        // AC unit
        box(0.5, 0.4, 0.4, 0xb8bec8, { x: 1.5, y: 2.8, z: -1.2 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 漁港設施群 fishing port facilities (CHUNK LANDMARK) ----- */
  {
    id: 'fishing_port_complex',
    displayName: '漁港設施群',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xb0b8c0, 0xd0d8e0, 0x3a6a9a, 0x8a9098, 0xe8f0f8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Large fishing port facility complex
      const parts = [
        // main processing building
        box(4.5, 3.5, 3.5, 0xffffff, { x: -1.5, y: 1.85 }),
        box(4.6, 0.2, 3.6, 0x3a6a9a, { x: -1.5, y: 3.7 }),
        // cold storage
        box(2.5, 4.5, 2.5, 0xe8f0f8, { x: 2.5, y: 2.35 }),
        // crane/derrick
        cyl(0.25, 0.25, 5.0, 6, 0xe0a838, { x: 4.2, y: 2.5 }),
        box(3.0, 0.2, 0.25, 0xe0a838, { x: 3.0, y: 5.0 }),
        // pier extension
        box(8.0, 0.4, 2.0, 0x9aa0a8, { y: 0.2, z: 3.5 }),
        // bollards
        cyl(0.18, 0.22, 0.35, 6, 0x44484f, { x: -3.0, z: 4.2, y: 0.58 }),
        cyl(0.18, 0.22, 0.35, 6, 0x44484f, { x: 0.0, z: 4.2, y: 0.58 }),
        cyl(0.18, 0.22, 0.35, 6, 0x44484f, { x: 3.0, z: 4.2, y: 0.58 }),
        // fuel tanks
        cyl(0.8, 0.8, 1.8, 8, 0xc94f46, { x: 4.5, z: -1.5, y: 0.9, rx: HALF_PI * 0.1 }),
        // office on top
        box(2.0, 1.2, 1.8, 0xd0d8e0, { x: -1.5, y: 4.5 }),
        towerBanded(1.8, 1.0, 1.6, 4, 0xe8f0f8, 0x4a6a7a, 0xffd98a, rng, { x: -1.5, y: 4.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 9: 遊客中心 visitor center (CHUNK LANDMARK) --------------- */
  {
    id: 'visitor_center',
    displayName: '遊客中心',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xe8e0d0, 0xf0ebe4, 0x4a8090, 0xc8c0b0, 0x3a6a4a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Penghu tourism visitor center with modern architecture
      const parts = [
        // main building - modern curved design
        box(5.5, 2.8, 4.0, 0xffffff, { y: 1.5, hex2: 0xe8e0d0 }),
        // curved roof element
        cyl(2.2, 2.2, 5.8, 10, 0xf0ebe4, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.3 }),
        // large glass facade
        box(5.0, 2.2, 0.1, 0x8fd6e8, { y: 1.3, z: 2.05 }),
        // entrance canopy
        box(3.0, 0.15, 2.0, 0x4a8090, { y: 2.8, z: 3.0 }),
        cyl(0.15, 0.15, 2.7, 6, 0xc8c0b0, { x: -1.2, y: 1.4, z: 3.8 }),
        cyl(0.15, 0.15, 2.7, 6, 0xc8c0b0, { x: 1.2, y: 1.4, z: 3.8 }),
        // observation deck on side
        box(2.0, 3.5, 2.0, 0xe8e0d0, { x: -3.5, y: 1.85 }),
        box(1.8, 0.4, 0.08, 0x8fd6e8, { x: -3.5, y: 2.8, z: 1.02 }),
        // landscaping mound
        sph(1.5, 0x3a6a4a, { ws: 8, hs: 6, x: 2.5, y: 0.3, z: 3.5, sy: 0.4 }),
        // info kiosk
        box(1.0, 1.8, 1.0, 0x4a8090, { x: 3.0, y: 0.9, z: 1.5 }),
        // parking area
        box(4.0, 0.08, 3.0, 0x6a6a6a, { x: 0, y: 0.04, z: -2.5 }),
        // flag poles
        cyl(0.06, 0.06, 3.5, 6, 0x9a9a9a, { x: 4.0, y: 1.75, z: 2.0 }),
        box(0.6, 0.4, 0.05, 0xc83838, { x: 4.3, y: 3.3, z: 2.0 }),
      ];
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
