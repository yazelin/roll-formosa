/**
 * @file archetypes/t5.js — Yilan pack T5 「蘇澳漁港商區」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / harbor
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/yilan/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 漁會大樓 suao_fishery_building (蘇澳漁會) ------------- */
  {
    id: 'suao_fishery_building',
    displayName: '漁會大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a6a8a, 0x6a8aa8, 0x8aaac8, 0x2e4a68, 0xc8d8e8],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 蘇澳漁會 style building: ocean-blue tones, maritime motifs
      return finish([
        towerBanded(2.6, 6.0, 2.0, 12, 0xffffff, 0x2e4a68, 0xffe8a0, rng, { y: 3.0 }),
        // blue maritime stripe bands
        box(2.7, 0.2, 2.1, 0x2a5a8a, { y: 1.2 }),
        box(2.7, 0.2, 2.1, 0x3a6a9a, { y: 3.5 }),
        box(2.7, 0.2, 2.1, 0x4a7aaa, { y: 5.8 }),
        // ground-floor entrance (漁會風格大門)
        box(2.8, 0.9, 2.2, 0x2a3a48, { y: 0.45 }),
        box(1.2, 0.8, 0.06, 0x8fc4e0, { y: 0.45, z: 1.12 }), // glass entrance
        // wave-motif awning over entrance
        box(1.8, 0.08, 0.6, 0x4a8ac0, { y: 0.95, z: 1.3 }),
        // rooftop fish auction sign structure
        box(1.6, 0.8, 0.1, 0x2a5a8a, { y: 6.5, z: 0.0 }),
        // antenna mast
        cyl(0.05, 0.05, 1.0, 6, 0x8a8a8a, { y: 7.1 }),
        // flag pole with fishing flag
        cyl(0.03, 0.03, 0.8, 5, 0x6a6a6a, { x: 0.8, y: 6.9 }),
        box(0.4, 0.25, 0.02, 0x2a5a9a, { x: 0.8, y: 7.2 }),
      ]);
    },
  },

  /* ---- slot 1: 漁倉 fish_warehouse (Suao fish processing warehouse) -- */
  {
    id: 'fish_warehouse',
    displayName: '漁倉',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a9aa8, 0xb0bcc8, 0x6a7a88, 0x4a5a68, 0xd0d8e0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Large industrial warehouse for fish processing
      const parts = [
        box(5.0, 3.2, 4.0, 0xffffff, { y: 1.8 }), // main warehouse body (tinted steel)
        // corrugated roof (arched)
        cyl(2.6, 2.6, 5.2, 8, 0x7a8a98, { y: 3.0, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // loading dock doors
        box(1.2, 2.4, 0.1, 0x4a5a68, { x: -1.5, y: 1.4, z: 2.02 }),
        box(1.2, 2.4, 0.1, 0x4a5a68, { x: 0.5, y: 1.4, z: 2.02 }),
        box(1.2, 2.4, 0.1, 0x4a5a68, { x: 2.5, y: 1.4, z: 2.02, hex2: 0x5a6a78 }),
        // overhead signage
        box(3.5, 0.5, 0.1, 0x2a6a9a, { y: 3.2, z: 2.05 }),
        // forklift ramp
        box(2.0, 0.15, 1.2, 0x8a8a8a, { x: 0.5, y: 0.08, z: 2.6 }),
        // ventilation units on roof
        box(0.6, 0.5, 0.6, 0x5a6a78, { x: -1.5, y: 4.0 }),
        box(0.6, 0.5, 0.6, 0x5a6a78, { x: 1.5, y: 4.0 }),
      ];
      // small windows along sides
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.5, 0.4, 0.05, 0xb0c8d0, { x: -1.8 + i * 1.2, y: 2.8, z: 2.02 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 漁港高架 harbor_viaduct ----------------------------- */
  {
    id: 'harbor_viaduct',
    displayName: '漁港高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x3a6ca8],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Elevated rail: a long box girder deck on twin Y-piers + a train car.
      const parts = [
        // continuous deck girder (long along X)
        box(9.0, 0.7, 1.8, 0xffffff, { y: 3.4 }), // deck (tinted concrete)
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: 0.95 }), // side parapet
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: -0.95 }), // side parapet
      ];
      // piers: square columns with flared caps at intervals
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.55, 0.7, 3.1, 6, 0xc2c6cc, { x, y: 1.55 }));
        parts.push(box(1.5, 0.4, 1.9, 0xb0b6be, { x, y: 3.05 })); // pier cap
      }
      // a train car sitting on the deck
      parts.push(box(4.2, 1.1, 1.2, 0xffffff, { y: 4.35 })); // car body (tinted)
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: 0.62 })); // window strip
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: -0.62 })); // window strip
      parts.push(box(4.3, 0.18, 1.24, 0x3a6ca8, { y: 4.95 })); // brand stripe / roof trim
      return finish(parts);
    },
  },

  /* ---- slot 3: 跨港天橋 harbor_bridge ----------------------------- */
  {
    id: 'harbor_bridge',
    displayName: '跨港天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc6ccd2, 0x9aa0a8, 0xe0e4ea, 0x6a7078, 0x4a8a5a],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Overpass: a flat span with railings + roof canopy, twin stair towers.
      const parts = [
        // span deck
        box(6.4, 0.32, 1.3, 0xffffff, { y: 2.6 }), // walkway (tinted)
        // railings (perforated read = thin top rail + posts)
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: 0.6 }),
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: -0.6 }),
        // arched roof canopy (two leaning panels)
        box(6.4, 0.06, 0.9, 0xc6ccd2, { y: 3.55, z: 0.45, rx: 0.22 }),
        box(6.4, 0.06, 0.9, 0xc6ccd2, { y: 3.55, z: -0.45, rx: -0.22 }),
        box(6.4, 0.06, 0.16, 0x9aa0a8, { y: 3.78 }), // ridge
      ];
      // railing posts (sparse) + canopy supports
      for (let i = 0; i < 4; i++) {
        const x = -2.4 + i * 1.6;
        parts.push(box(0.05, 0.5, 0.05, 0x7a8088, { x, y: 2.85, z: 0.6 }));
        parts.push(box(0.05, 0.5, 0.05, 0x7a8088, { x, y: 2.85, z: -0.6 }));
        if (i % 2 === 0) parts.push(box(0.07, 0.95, 0.07, 0x9aa0a8, { x, y: 3.1, z: 0 }));
      }
      // twin stair / lift towers at the ends
      for (const sx of [-3.4, 3.4]) {
        parts.push(box(1.0, 2.7, 1.2, 0xb6bcc4, { x: sx, y: 1.35 }));
        parts.push(box(0.9, 0.5, 0.06, 0x8fd0a0, { x: sx, y: 1.6, z: 0.63 })); // green-glass panel
        // a couple of diagonal stair treads
        for (let s = 0; s < 3; s++) {
          parts.push(box(0.9, 0.07, 0.34, 0x7a8088, {
            x: sx, y: 0.6 + s * 0.7, z: 0.7 + s * 0.24,
          }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 漁港貨櫃堆 container_stack (蘇澳港區貨櫃) ------------ */
  {
    id: 'container_stack',
    displayName: '漁港貨櫃堆',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2a6a9a, 0xc83030, 0x4a8a4a, 0xe0a030, 0x6a6a6a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Stacked shipping containers at Suao port
      const colors = [0x2a6a9a, 0xc83030, 0x4a8a4a, 0xe0a030, 0x8a6a4a, 0x6a6a9a];
      const parts = [];
      // ground level containers (2 side by side)
      parts.push(box(2.8, 1.1, 1.1, colors[0], { x: -0.7, y: 0.55 }));
      parts.push(box(2.8, 1.1, 1.1, colors[1], { x: 0.7, y: 0.55 }));
      // second level
      parts.push(box(2.8, 1.1, 1.1, colors[2], { x: -0.35, y: 1.65 }));
      parts.push(box(2.8, 1.1, 1.1, colors[3], { x: 0.35, y: 1.65 }));
      // third level (single container)
      parts.push(box(2.8, 1.1, 1.1, colors[4], { y: 2.75 }));
      // container ridges (corrugation detail)
      for (let i = 0; i < 3; i++) {
        const y = 0.55 + i * 1.1;
        parts.push(box(2.82, 0.04, 1.12, 0x4a4a4a, { y: y + 0.5, x: (i % 2 - 0.5) * 0.7 }));
      }
      // container doors (rear end detail)
      parts.push(box(0.06, 0.9, 0.9, 0x3a3a3a, { x: -2.1, y: 0.55 }));
      parts.push(box(0.06, 0.9, 0.9, 0x3a3a3a, { x: 2.1, y: 0.55 }));
      // forklift (small vehicle nearby)
      parts.push(box(0.6, 0.5, 0.4, 0xe0a030, { x: -1.5, y: 0.25, z: 1.2 }));
      parts.push(cyl(0.12, 0.12, 0.1, 6, 0x2a2a2a, { x: -1.7, y: 0.12, z: 1.2, rx: HALF_PI }));
      parts.push(cyl(0.12, 0.12, 0.1, 6, 0x2a2a2a, { x: -1.3, y: 0.12, z: 1.2, rx: HALF_PI }));
      return finish(parts);
    },
  },

  /* ---- slot 5: 港區看板 port_billboard --------------------------- */
  {
    id: 'port_billboard',
    displayName: '港區看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46, 0xf2f2ee],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // A rooftop / roadside billboard: big bright panel on a lattice gantry.
      const parts = [
        // gantry legs (wide A-stance)
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0, rz: 0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // billboard frame + bright face
        box(5.2, 2.4, 0.18, 0x2e3138, { y: 5.4 }), // frame
        box(5.0, 2.2, 0.06, 0xffffff, { y: 5.4, z: 0.13 }), // ad face (tinted bright)
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }), // top spotlight bar
      ];
      // color blocks on the ad face (deterministic mock graphic)
      const adHex = [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46];
      for (let i = 0; i < 4; i++) {
        const w = 0.9 + (i % 2) * 0.4;
        parts.push(box(w, 1.6 - (i % 2) * 0.6, 0.04, adHex[i], {
          x: -1.7 + i * 1.15, y: 5.4, z: 0.17,
        }));
      }
      // spotlights
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: -1.6, y: 6.6, rx: 0.6 }));
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: 1.6, y: 6.6, rx: 0.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 南方澳漁港旅館 nanfangao_inn (南方澳風格民宿) ------- */
  {
    id: 'nanfangao_inn',
    displayName: '南方澳漁港旅館',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a7a9a, 0x6a9aba, 0x8abada, 0x2a5a7a, 0xc8e0f0],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 南方澳 fishing village style inn: nautical colors, balconies facing sea
      const parts = [
        box(2.2, 4.5, 2.0, 0xffffff, { y: 2.4, hex2: 0xc8e0f0 }), // main body
        // ocean-blue accent bands
        box(2.3, 0.15, 2.1, 0x2a5a8a, { y: 1.2 }),
        box(2.3, 0.15, 2.1, 0x3a6a9a, { y: 2.8 }),
        box(2.3, 0.15, 2.1, 0x4a7aaa, { y: 4.4 }),
        // balconies on each floor (facing the sea view)
        box(2.0, 0.08, 0.4, 0xe8e4e0, { y: 1.5, z: 1.2 }),
        box(2.0, 0.08, 0.4, 0xe8e4e0, { y: 2.5, z: 1.2 }),
        box(2.0, 0.08, 0.4, 0xe8e4e0, { y: 3.5, z: 1.2 }),
        // balcony railings (glass panels, sea-view)
        box(2.0, 0.3, 0.04, 0x8fc8e8, { y: 1.65, z: 1.38 }),
        box(2.0, 0.3, 0.04, 0x8fc8e8, { y: 2.65, z: 1.38 }),
        box(2.0, 0.3, 0.04, 0x8fc8e8, { y: 3.65, z: 1.38 }),
        // ground floor entrance
        box(1.0, 0.9, 0.08, 0x3a4a58, { y: 0.5, z: 1.04 }),
        // rooftop with sea-view deck
        box(2.3, 0.12, 2.1, 0x7a8a98, { y: 4.75 }),
        // small rooftop structure (lookout)
        box(1.0, 0.6, 0.8, 0x5a7a9a, { y: 5.1 }),
        // fish-shaped wind vane
        box(0.3, 0.15, 0.04, 0xe0a040, { y: 5.55 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 漁港拍賣場 fish_auction_hall (蘇澳漁市場) ----------- */
  {
    id: 'fish_auction_hall',
    displayName: '漁港拍賣場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x3a6a8a, 0x5a8aaa, 0x7aaaca, 0x2a5a7a, 0xc8d8e8],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // 蘇澳魚市拍賣場: wide industrial hall with arched roof, loading docks
      const parts = [
        // main hall body
        box(4.5, 2.8, 3.2, 0xffffff, { y: 1.6, hex2: 0xc8d8e8 }),
        // arched corrugated roof
        cyl(2.4, 2.4, 4.7, 8, 0x6a8aa8, { y: 2.5, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // entrance canopy (ocean blue)
        box(3.0, 0.1, 1.2, 0x3a6a8a, { y: 1.8, z: 2.2 }),
        // large loading dock doors
        box(1.4, 2.0, 0.08, 0x4a5a68, { x: -1.2, y: 1.0, z: 1.62 }),
        box(1.4, 2.0, 0.08, 0x4a5a68, { x: 1.2, y: 1.0, z: 1.62 }),
        // dock platform
        box(4.0, 0.2, 1.0, 0x8a8a8a, { y: 0.1, z: 2.0 }),
        // 魚市 signage
        box(2.5, 0.5, 0.08, 0x2a5a8a, { y: 3.0, z: 1.65 }),
        box(2.3, 0.35, 0.06, 0xfff0c0, { y: 3.0, z: 1.7 }), // lit sign text
        // ice machine / refrigeration unit
        box(0.8, 1.2, 0.7, 0x8a9aa8, { x: 2.0, y: 0.6 }),
        cyl(0.15, 0.15, 0.4, 6, 0x6a7a88, { x: 2.0, y: 1.4 }), // exhaust
        // fish crates stacked nearby
        box(0.5, 0.3, 0.4, 0x4a8aba, { x: -1.8, y: 0.15, z: 1.8 }),
        box(0.5, 0.3, 0.4, 0x5a9aca, { x: -1.5, y: 0.15, z: 1.7 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 漁港商辦塔 fishing_port_tower (CHUNK LANDMARK) ----- */
  {
    id: 'fishing_port_tower',
    displayName: '漁港商辦塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3e4e66, 0xaecae0, 0x7a8aa0, 0x232c38, 0xe6eef6],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Big setback skyscraper — the district's repeatable landmark mass:
      // wide podium → tapered banded shaft → crown + antenna.
      return finish([
        // multi-floor podium
        box(4.2, 1.8, 3.4, 0xffffff, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x6a7888, { y: 1.85 }),
        // main banded shaft (tall)
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x28323e, 0xfff0c0, rng, { y: 6.5 }),
        // mullion fins front
        box(0.12, 9.0, 0.12, 0x2a3340, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.95, y: 6.5, z: 1.22 }),
        // first setback
        box(2.4, 0.4, 1.9, 0x7a8aa0, { y: 11.2 }),
        // tapered upper shaft
        towerBanded(1.9, 3.4, 1.6, 7, 0xe6eef6, 0x33404f, 0xfff0c0, rng, { y: 13.1 }),
        // crown
        box(1.5, 0.6, 1.2, 0xaecae0, { y: 15.1 }),
        cone(0.9, 1.2, 6, 0x55657a, { y: 16.0 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.6 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 18.9 }), // beacon
      ]);
    },
  },

  /* ---- slot 9: 漁港倉庫 warehouse_mass (CHUNK LANDMARK) ------------ */
  {
    id: 'warehouse_mass',
    displayName: '漁港倉庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xcabfa8, 0xe8dcc4, 0x8a7c60, 0xb8443a, 0xf2ead6],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // A whole department-store block: a broad multi-wing mall mass with a
      // curved glass atrium, escalator-glass front, brand crown.
      const parts = [
        // two stacked retail volumes (wide low + narrower upper)
        box(5.6, 3.6, 4.2, 0xffffff, { y: 2.0 }), // lower mass (tinted)
        box(4.2, 2.6, 3.4, 0xffffff, { y: 5.1 }), // upper mass
        box(5.7, 0.3, 4.3, 0x9a8c70, { y: 3.85 }), // mid cornice
        box(4.3, 0.3, 3.5, 0x9a8c70, { y: 6.45 }), // upper cornice
        // curved glass atrium bay on the front (half-cylinder)
        cyl(1.5, 1.5, 4.6, 9, 0x9fc4d8, { y: 2.3, z: 2.1, rx: HALF_PI,
          theta0: -HALF_PI, thetaLen: PI }),
        box(2.6, 4.4, 0.12, 0x2c3a44, { y: 2.3, z: 2.0 }), // atrium dark frame behind glass
        // entrance canopy + brand band
        box(3.2, 0.22, 1.2, 0xb8443a, { y: 1.5, z: 2.7 }),
        box(4.2, 0.7, 0.16, 0xb8443a, { y: 6.9, z: 1.74 }), // upper brand band
        box(4.0, 0.5, 0.06, 0xf2ead6, { y: 6.9, z: 1.82 }), // band face
        // rooftop services + sign pylon
        box(1.4, 0.7, 1.0, 0x6a6050, { x: 1.0, y: 6.9 }),
        box(0.5, 1.8, 0.5, 0xb8443a, { x: -1.4, y: 7.3 }), // sign pylon
      ];
      // clerestory window rows on both volumes
      for (let i = 0; i < 7; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.6, 0.05, lit, { x: -2.4 + i * 0.8, y: 3.1, z: 2.12 }));
      }
      for (let i = 0; i < 5; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.5, 0.05, lit, { x: -1.6 + i * 0.8, y: 5.5, z: 1.72 }));
      }
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
