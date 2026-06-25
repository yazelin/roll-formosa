/**
 * @file archetypes/t5.js — Hsinchu pack T5 「科學園區」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the science park / tech campus
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.5). ids are the FROZEN CONTRACT
 * declared in packs/hsinchu/tiers.js — spelling must NOT drift.
 *
 * Theme: 科學園區金紫暮色 — fab buildings, tech viaducts, office towers along
 * the Hsinchu Science Park corridors, glass curtain walls, wafer fabs.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * Palette = 4–6 hex tints (catalog.test enforces 4–6). Bodies meant to be
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
  /* ---- slot 0: 竹科辦公樓 hsip_office — HSIP-style tech office ------- */
  {
    id: 'hsip_office',
    displayName: '竹科辦公樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a5a78, 0x5a7a98, 0x8ab0c8, 0x3a8ac0, 0xffd884],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Hsinchu Science Park office building — clean modern with blue tech branding
      return finish([
        towerBanded(2.6, 7.2, 2.0, 14, 0x3a5a78, 0x8ab0c8, 0xffd884, rng, { y: 3.6 }),
        // HSIP blue accent bands (竹科藍)
        box(2.65, 0.25, 2.05, 0x3a8ac0, { y: 1.0 }),
        box(2.65, 0.25, 2.05, 0x3a8ac0, { y: 5.5 }),
        // horizontal sunshade louvers (tech building feature)
        box(2.7, 0.08, 2.1, 0x7a9ab0, { y: 2.5 }),
        box(2.7, 0.08, 2.1, 0x7a9ab0, { y: 4.5 }),
        // ground-floor lobby with blue accent
        box(2.8, 0.9, 2.2, 0x2a3a48, { y: 0.45 }),
        box(1.0, 0.7, 0.06, 0x9fd0e8, { y: 0.4, z: 1.12 }), // lit lobby glass
        // setback crown with tech styling
        box(2.2, 0.7, 1.7, 0xc8d8e8, { y: 7.55 }),
        box(2.2, 0.15, 1.7, 0x3a8ac0, { y: 7.96 }), // blue crown band
        // rooftop unit + antenna
        box(1.0, 0.5, 0.8, 0x5a7080, { y: 8.15 }),
        cyl(0.05, 0.05, 1.2, 6, 0xd0d4dc, { y: 9.0 }),
      ]);
    },
  },

  /* ---- slot 1: 廠辦 fab_building ---------------------------------- */
  {
    id: 'fab_building',
    displayName: '廠辦',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 30,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8c0c8, 0xd0d8e0, 0x7a8690, 0x4a5660, 0x3a8ac0, 0xe8f0f4],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Semiconductor fab/office building: long low clean-room mass with a
      // rooftop mechanical deck, distinctive blue TSMC-style accent band.
      const parts = [
        box(6.0, 3.0, 4.0, 0xffffff, { y: 1.5 }), // main fab body (tinted)
        // horizontal blue accent band (tech company branding)
        box(6.1, 0.4, 4.1, 0x3a8ac0, { y: 2.7 }),
        // flat roof with parapet
        box(6.1, 0.2, 4.1, 0x8a9298, { y: 3.15 }),
        // rooftop mech deck (clean-room HVAC)
        box(3.0, 1.2, 2.0, 0x9aa2aa, { y: 3.6 }),
        box(3.0, 0.1, 2.0, 0x7a828a, { y: 4.25 }),
      ];
      // clean-room windows: narrow horizontal ribbon windows
      for (let i = 0; i < 5; i++) {
        const lit = rng() < 0.4 ? 0xfff0c0 : 0x5a6670;
        parts.push(box(1.0, 0.3, 0.06, lit, { x: -2.0 + i * 1.0, y: 1.8, z: 2.02 }));
      }
      // ground-floor loading bays
      for (let i = 0; i < 3; i++) {
        parts.push(box(1.2, 1.4, 0.1, 0x3a424a, { x: -1.8 + i * 1.8, y: 0.7, z: 2.02 }));
      }
      // rooftop exhaust stacks
      parts.push(cyl(0.2, 0.2, 0.6, 6, 0x5a6268, { x: -0.8, y: 4.5 }));
      parts.push(cyl(0.2, 0.2, 0.6, 6, 0x5a6268, { x: 0.8, y: 4.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 科技園區高架 tech_viaduct -------------------------- */
  {
    id: 'tech_viaduct',
    displayName: '科技園區高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x3a6ca8, 0xe6e2d4],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Science park elevated road: clean modern viaduct with Y-piers,
      // smooth concrete deck, sleek barriers — tech park infrastructure.
      const parts = [
        // continuous deck girder (long along X)
        box(9.0, 0.6, 2.0, 0xffffff, { y: 3.2 }), // deck (tinted concrete)
        box(9.0, 0.4, 0.14, 0x8a9098, { y: 3.4, z: 1.0 }), // side barrier
        box(9.0, 0.4, 0.14, 0x8a9098, { y: 3.4, z: -1.0 }), // side barrier
      ];
      // Y-shaped piers at intervals (modern tech park style)
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        // pier stem
        parts.push(cyl(0.4, 0.5, 2.6, 6, 0xc2c6cc, { x, y: 1.3 }));
        // Y-arm capitals
        parts.push(box(1.6, 0.3, 2.0, 0xb0b6be, { x, y: 2.8 }));
      }
      // center lane markings
      parts.push(box(8.6, 0.02, 0.1, 0xf0f0e0, { y: 3.52, z: 0 }));
      // blue tech-park sign panel
      parts.push(box(1.2, 0.6, 0.08, 0x3a6ca8, { x: 2.5, y: 4.0 }));
      parts.push(box(0.08, 0.5, 0.08, 0x7a8088, { x: 2.5, y: 3.65 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 天橋 pedestrian_bridge ----------------------------- */
  {
    id: 'pedestrian_bridge',
    displayName: '天橋',
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

  /* ---- slot 4: 竹科停車場 hsip_parking — HSIP parking structure ----- */
  {
    id: 'hsip_parking',
    displayName: '竹科停車場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8c0c8, 0x9aa0a8, 0xd0d8e0, 0x3a8ac0, 0xe8f0f4],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // HSIP modern parking structure with tech blue branding
      const parts = [
        box(2.0, 7.0, 2.4, 0xffffff, { y: 3.6 }), // shaft (tinted light)
        // corner columns with tech styling
        box(0.22, 7.0, 0.22, 0x5a7080, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a7080, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a7080, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.22, 7.0, 0.22, 0x5a7080, { x: 0.95, y: 3.6, z: -1.15 }),
        // blue tech accent bands
        box(2.05, 0.25, 2.45, 0x3a8ac0, { y: 0.3 }),
        box(2.05, 0.25, 2.45, 0x3a8ac0, { y: 7.1 }),
        box(2.0, 0.4, 2.4, 0x9aa8b0, { y: 7.3 }), // roof slab
        box(1.0, 0.7, 0.1, 0x3a8ac0, { y: 0.5, z: 1.22 }), // entry gate (blue)
      ];
      // deck floors with tech company car colors
      const carHex = [0x3a8ac0, 0xe8e8e8, 0x3a8ac0, 0xe8e8e8, 0x3a8ac0, 0xe8e8e8];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.62, 0.08, 0x20262e, { y, z: 1.18 }));
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 巨型看板 giant_billboard --------------------------- */
  {
    id: 'giant_billboard',
    displayName: '巨型看板',
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

  /* ---- slot 6: 玻璃帷幕街屋 glass_curtain_house ------------------- */
  {
    id: 'glass_curtain_house',
    displayName: '玻璃帷幕街屋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6fbfd0, 0xbfeaf0, 0x3a6a78, 0x2e3744, 0xe8f4f6],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Narrow mid-rise street shophouse with a full glass curtain wall front.
      const parts = [
        box(2.2, 5.2, 2.0, 0xffffff, { y: 2.8 }), // body (tinted concrete sides)
        // glass curtain wall on the front (proud, gridded)
        box(2.0, 4.6, 0.14, 0x2e3744, { y: 2.9, z: 1.02 }), // mullion grid (dark)
        box(1.8, 4.4, 0.06, 0x8fd6e2, { y: 2.9, z: 1.1 }), // glass (tinted blue-green)
        // ground-floor shop entrance
        box(2.0, 0.9, 0.1, 0x20262c, { y: 0.5, z: 1.06 }),
        box(1.2, 0.7, 0.06, 0xbfeaf0, { y: 0.5, z: 1.12 }), // bright entry glass
        // parapet + a small rooftop water tank
        box(2.3, 0.24, 2.1, 0x4a8090, { y: 5.5 }),
        cyl(0.4, 0.4, 0.6, 7, 0x9aa0a8, { x: 0.5, y: 5.9 }),
      ];
      // horizontal floor-line mullions across the glass (5 floors)
      for (let f = 1; f < 5; f++) {
        parts.push(box(1.85, 0.07, 0.04, 0x223038, { y: 0.6 + f * 0.95, z: 1.14 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 新竹銀行 hsinchu_bank — Hsinchu local bank style ----- */
  {
    id: 'hsinchu_bank',
    displayName: '新竹銀行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8e0e8, 0xc8d8e8, 0x3a8ac0, 0x2a6a90, 0xffd884],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Hsinchu style bank — modern tech-influenced architecture with blue branding
      const parts = [
        box(4.0, 3.4, 3.0, 0xffffff, { y: 1.9 }), // main hall (tinted light)
        // tech blue accent bands (竹科藍影響)
        box(4.1, 0.25, 3.1, 0x3a8ac0, { y: 0.3 }),
        box(4.1, 0.25, 3.1, 0x3a8ac0, { y: 3.55 }),
        box(4.2, 0.2, 3.2, 0x9ab0c0, { y: 3.7 }), // roof edge
        // modern glass entrance (not classical columns)
        box(2.8, 2.4, 0.1, 0x8ab8d0, { y: 1.4, z: 1.52 }), // glass curtain front
        box(2.8, 0.08, 0.12, 0x6a98b0, { y: 2.7, z: 1.56 }), // mullion
        box(2.8, 0.08, 0.12, 0x6a98b0, { y: 1.8, z: 1.56 }), // mullion
        // entrance canopy
        box(3.2, 0.15, 1.0, 0xd8e0e8, { y: 2.85, z: 1.9 }),
        // columns supporting canopy (modern square)
        box(0.25, 2.6, 0.25, 0xc8d0d8, { x: -1.3, y: 1.45, z: 1.8 }),
        box(0.25, 2.6, 0.25, 0xc8d0d8, { x: 1.3, y: 1.45, z: 1.8 }),
        // bank sign with blue background
        box(2.2, 0.4, 0.08, 0x3a8ac0, { y: 3.2, z: 1.58 }),
        box(2.0, 0.3, 0.05, 0xffd884, { y: 3.2, z: 1.62 }), // gold text
        // ATM booth at side
        box(0.8, 1.2, 0.6, 0x3a8ac0, { x: -1.8, y: 0.75, z: 1.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 園區辦公塔 park_office_tower (CHUNK LANDMARK) ------ */
  {
    id: 'park_office_tower',
    displayName: '園區辦公塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3e4e66, 0xaecae0, 0x7a8aa0, 0x232c38, 0xe6eef6, 0x3a8ac0],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Science park office tower — the district's repeatable landmark mass:
      // wide podium → tapered banded glass shaft → crown + antenna, with
      // tech blue accent bands (Hsinchu Science Park signature).
      return finish([
        // multi-floor podium
        box(4.2, 1.8, 3.4, 0xffffff, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x6a7888, { y: 1.85 }),
        // blue tech accent band (TSMC / UMC style)
        box(4.3, 0.3, 3.5, 0x3a8ac0, { y: 2.1 }),
        // main banded shaft (tall)
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x28323e, 0xfff0c0, rng, { y: 6.8 }),
        // mullion fins front
        box(0.12, 9.0, 0.12, 0x2a3340, { x: -0.95, y: 6.8, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.0, y: 6.8, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.95, y: 6.8, z: 1.22 }),
        // first setback
        box(2.4, 0.4, 1.9, 0x7a8aa0, { y: 11.5 }),
        // tapered upper shaft
        towerBanded(1.9, 3.4, 1.6, 7, 0xe6eef6, 0x33404f, 0xfff0c0, rng, { y: 13.4 }),
        // crown
        box(1.5, 0.6, 1.2, 0xaecae0, { y: 15.4 }),
        cone(0.9, 1.2, 6, 0x55657a, { y: 16.3 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.9 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 19.2 }), // beacon
      ]);
    },
  },

  /* ---- slot 9: 晶圓廠 wafer_fab_mass (CHUNK LANDMARK) ------------- */
  {
    id: 'wafer_fab_mass',
    displayName: '晶圓廠',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xb8c0c8, 0xd0d8e0, 0x7a8690, 0x4a5660, 0x3a8ac0, 0xe8f0f4],
    yOffset: -0.41,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // A whole wafer fab complex (TSMC / UMC scale): a long clean-room mass
      // with multiple wings, rooftop mech decks, blue branding bands — the
      // iconic Hsinchu Science Park semiconductor factory.
      const parts = [
        // main fab block (long low clean-room)
        box(7.0, 3.6, 4.4, 0xffffff, { y: 1.8 }), // main fab body (tinted)
        // horizontal blue accent bands (TSMC signature)
        box(7.1, 0.4, 4.5, 0x3a8ac0, { y: 3.4 }),
        // flat roof with parapet
        box(7.1, 0.2, 4.5, 0x8a9298, { y: 3.75 }),
        // second wing (smaller clean-room)
        box(3.0, 2.8, 3.0, 0xe8f0f4, { x: -2.5, y: 1.4, z: -2.8 }),
        box(3.1, 0.3, 3.1, 0x3a8ac0, { x: -2.5, y: 2.7, z: -2.8 }),
        // rooftop mech deck (massive HVAC for clean-room)
        box(4.0, 1.5, 2.5, 0x9aa2aa, { y: 4.3 }),
        box(4.0, 0.1, 2.5, 0x7a828a, { y: 5.1 }),
      ];
      // ribbon windows along the front
      for (let i = 0; i < 6; i++) {
        const lit = rng() < 0.4 ? 0xfff0c0 : 0x5a6670;
        parts.push(box(0.9, 0.35, 0.06, lit, { x: -2.5 + i * 1.0, y: 2.0, z: 2.22 }));
      }
      // loading docks
      for (let i = 0; i < 4; i++) {
        parts.push(box(1.0, 1.5, 0.1, 0x3a424a, { x: -2.3 + i * 1.5, y: 0.75, z: 2.22 }));
      }
      // exhaust stacks on rooftop mech deck
      parts.push(cyl(0.25, 0.25, 0.8, 6, 0x5a6268, { x: -1.0, y: 5.5 }));
      parts.push(cyl(0.25, 0.25, 0.8, 6, 0x5a6268, { x: 1.0, y: 5.5 }));
      parts.push(cyl(0.2, 0.2, 0.6, 6, 0x5a6268, { x: 0.0, y: 5.4 }));
      // company sign pylon
      parts.push(box(0.4, 1.4, 0.4, 0x3a8ac0, { x: 3.0, y: 4.5 }));
      parts.push(box(1.5, 0.6, 0.1, 0xe8f0f4, { x: 2.8, y: 5.0, z: 2.25 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
