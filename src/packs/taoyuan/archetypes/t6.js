/**
 * @file packs/taoyuan/archetypes/t6.js — Roll Formosa Taoyuan pack, Tier 6.
 *
 * T6 — 桃園機場天際線 (Taoyuan Airport skyline). The finale band: glass highrises,
 * airport control tower, cross-street skybridges, terminal buildings and rooftop
 * mech rooms lit against the 桃園機場夜空 deep blue-violet sky. Ten ArchetypeDefs,
 * authored in the FROZEN tier order (tiers.js T6.archetypeIds) — slots [0..7]
 * absorbable, slots [8..9] repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (airport/urban skyline scale).
 */

import { box, cyl, sph, towerBanded, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 航空貨櫃堆 airport cargo container stack ----------------- */
  {
    id: 'cargo_container_stack',
    displayName: '航空貨櫃堆',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a7aaa, 0x8ab0c8, 0xc0c8d0, 0xe0a030, 0x3a6080],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      // Taoyuan Airport air cargo ULD containers (Unit Load Devices) stacked at cargo terminal
      const parts = [];
      // Ground row - 3 containers
      for (let i = 0; i < 3; i++) {
        const x = -2.0 + i * 2.0;
        const color = [0x4a7aaa, 0xc0c8d0, 0x3a6080][i];
        parts.push(box(1.6, 1.4, 1.8, color, { x, y: 0.7 }));
        // container door handles / latches
        parts.push(box(0.15, 0.8, 0.06, 0x6a7a8a, { x: x + 0.6, y: 0.7, z: 0.92 }));
        // airline logo sticker
        parts.push(box(0.6, 0.3, 0.04, 0xe0a030, { x, y: 1.0, z: 0.92 }));
      }
      // Second row - 2 containers offset
      for (let i = 0; i < 2; i++) {
        const x = -1.0 + i * 2.0;
        const color = [0x8ab0c8, 0x4a7aaa][i];
        parts.push(box(1.6, 1.4, 1.8, color, { x, y: 2.1 }));
        parts.push(box(0.15, 0.8, 0.06, 0x6a7a8a, { x: x + 0.6, y: 2.1, z: 0.92 }));
      }
      // Top container
      parts.push(box(1.6, 1.4, 1.8, 0xc0c8d0, { x: 0, y: 3.5 }));
      // Ground pallet (wooden pallet base)
      parts.push(box(6.5, 0.15, 2.2, 0x9a8a70, { y: 0.075 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 跨橋 cross bridge -------------------------------------- */
  {
    id: 'cross_bridge',
    displayName: '跨橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8b0a4, 0xc8c0b4, 0xe05a4a, 0xd8d4cc, 0xffd25a],
    yOffset: -0.561,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      // Cable-stayed road bridge: two A-pylons, a long deck, fanned stay cables.
      const parts = [
        box(4.2, 0.16, 0.9, 0xc4bcb0, { y: 1.2 }), // deck (concrete)
        box(4.2, 0.1, 0.06, 0x9a9288, { y: 1.32, z: 0.42 }), // parapet rail near
        box(4.2, 0.1, 0.06, 0x9a9288, { y: 1.32, z: -0.42 }), // parapet rail far
        cyl(0.16, 0.2, 1.1, 6, 0xb0a89c, { x: -3.0, y: 0.55 }), // approach pier
        cyl(0.16, 0.2, 1.1, 6, 0xb0a89c, { x: 3.0, y: 0.55 }), // approach pier
      ];
      // Two A-frame pylons rising from the deck.
      for (const px of [-1.1, 1.1]) {
        parts.push(cyl(0.1, 0.13, 1.9, 6, 0xe05a4a, { rz: 0.13, x: px - 0.18, y: 2.15 })); // pylon leg
        parts.push(cyl(0.1, 0.13, 1.9, 6, 0xe05a4a, { rz: -0.13, x: px + 0.18, y: 2.15 })); // pylon leg
        parts.push(box(0.5, 0.12, 0.16, 0xe05a4a, { x: px, y: 2.7 })); // pylon crossbeam
        // fanned stay cables both directions
        for (let i = 0; i < 3; i++) {
          const span = 0.55 + i * 0.55;
          const len = Math.hypot(span, 1.65);
          const ang = Math.atan2(span, 1.65);
          parts.push(box(0.025, len, 0.025, 0xe8e2d6, { rz: ang, x: px - span / 2, y: 2.1 })); // cable left
          parts.push(box(0.025, len, 0.025, 0xe8e2d6, { rz: -ang, x: px + span / 2, y: 2.1 })); // cable right
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 貨運站 cargo_terminal (TPE air cargo) ------------------ */
  {
    id: 'cargo_terminal',
    displayName: '貨運站',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a6a7a, 0x8a98a8, 0xb0c0d0, 0xd0d8e0, 0xffe880],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // TPE airport air cargo terminal — long warehouse with aircraft parking
      const parts = [];
      const metal = 0x8a98a8;
      const concrete = 0xc0c8d0;
      // Main cargo warehouse (very long, low)
      parts.push(box(6.0, 1.8, 3.0, metal, { y: 0.9 }));
      // Corrugated roof
      parts.push(box(6.2, 0.15, 3.2, 0x6a7a88, { y: 1.85 }));
      // Loading dock doors
      for (let i = 0; i < 4; i++) {
        parts.push(box(1.2, 1.4, 0.1, 0x4a5a68, { x: -2.25 + i * 1.5, y: 0.7, z: 1.52 }));
      }
      // Aircraft apron (tarmac)
      parts.push(box(7.0, 0.08, 4.0, 0x4a5058, { y: 0.04, z: -2.0 }));
      // Yellow taxi lines on tarmac
      parts.push(box(6.5, 0.06, 0.12, 0xe0c020, { y: 0.1, z: -1.5 }));
      parts.push(box(6.5, 0.06, 0.12, 0xe0c020, { y: 0.1, z: -2.5 }));
      // Cargo containers (ULDs) on apron
      parts.push(box(0.6, 0.5, 0.5, 0xc0c0c0, { x: -1.5, y: 0.25, z: -2.0 }));
      parts.push(box(0.6, 0.5, 0.5, 0x4a7aaa, { x: -0.5, y: 0.25, z: -2.2 }));
      parts.push(box(0.6, 0.5, 0.5, 0xc0c0c0, { x: 0.5, y: 0.25, z: -1.8 }));
      // Forklift / ground handling equipment
      parts.push(box(0.4, 0.3, 0.25, 0xe0a030, { x: 1.5, y: 0.15, z: -1.5 }));
      // Office section
      parts.push(box(1.5, 2.2, 1.5, concrete, { x: 3.5, y: 1.1 }));
      parts.push(box(1.3, 0.6, 0.08, 0x90b8d0, { x: 3.5, y: 1.5, z: 0.78 })); // office windows
      return finish(parts);
    },
  },

  /* ---- slot 3: 巨型廣告牆 giant ad wall ------------------------------- */
  {
    id: 'giant_ad_wall',
    displayName: '巨型廣告牆',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2c3140, 0xff3d6e, 0x37c8e0, 0xffd23d, 0xf0f2f6],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // A building face turned into a giant LED billboard wall: bright color panels.
      const panel = [0xff3d6e, 0x37c8e0, 0xffd23d, 0x6ae060, 0xff8a3d];
      const parts = [
        box(2.4, 3.2, 0.9, 0x23272f, { y: 1.7, hex2: 0x2c3140 }), // host building (dark)
        box(2.55, 2.6, 0.12, 0x10131a, { y: 2.0, z: 0.5 }), // billboard backing frame
      ];
      // 3 x 4 grid of glowing LED panels on the front face
      for (let gx = 0; gx < 3; gx++) {
        for (let gy = 0; gy < 4; gy++) {
          const c = panel[(gx * 4 + gy + (rng() < 0.4 ? 1 : 0)) % panel.length];
          parts.push(box(0.66, 0.5, 0.06, c, { x: -0.72 + gx * 0.72, y: 1.15 + gy * 0.6, z: 0.58 })); // LED panel
        }
      }
      parts.push(box(2.6, 0.1, 0.16, 0x55606e, { y: 0.5, z: 0.5 })); // ground catwalk
      return finish(parts);
    },
  },

  /* ---- slot 4: 塔台 control tower (TPE airport ATC tower) ------------- */
  {
    id: 'control_tower',
    displayName: '塔台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x3a5a7a, 0x5888b0, 0x88c8e0, 0xd0d8e0, 0xffe08a],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Airport control tower: tapered concrete shaft + glazed cab + antenna mast
      const parts = [];
      const concrete = 0xc8c8c0;
      const glass = 0x88c8e0;
      const mast = 0xd0d8e0;
      // Flared base platform
      parts.push(box(2.4, 0.35, 2.4, 0x9a9890, { y: 0.18 }));
      // Tapered concrete shaft (wider at bottom)
      parts.push(cyl(0.7, 0.5, 3.6, 8, concrete, { y: 2.0 }));
      // Observation deck ring (the flare below the cab)
      parts.push(cyl(0.85, 0.8, 0.3, 8, 0xa0a098, { y: 3.65 }));
      // Glazed control cab (the iconic sloped glass box)
      parts.push(cyl(0.75, 0.65, 0.9, 8, glass, { y: 4.25 }));
      // Cab roof (flat with slight overhang)
      parts.push(cyl(0.72, 0.72, 0.12, 8, 0x6a7a88, { y: 4.76 }));
      // Antenna mast cluster on top
      parts.push(cyl(0.06, 0.06, 1.2, 6, mast, { y: 5.4 })); // main mast
      parts.push(cyl(0.04, 0.04, 0.7, 6, mast, { x: 0.18, y: 5.15 })); // side mast
      parts.push(cyl(0.04, 0.04, 0.7, 6, mast, { x: -0.18, y: 5.15 })); // side mast
      // Radar dome on top
      parts.push(sph(0.14, 0xf0f0f0, { ws: 6, hs: 4, y: 6.1 }));
      // Warning light
      parts.push(sph(0.08, 0xff3030, { ws: 4, hs: 3, y: 5.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 5: 登機空橋 boarding jet bridge (TPE airport) ------------ */
  {
    id: 'jetbridge',
    displayName: '登機空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 95,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a98a8, 0xb0c0d0, 0xd0d8e0, 0x4a6a8a, 0xffe880],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // TPE Airport jet bridge (登機空橋) — the telescoping passenger boarding bridge
      const parts = [];
      const metal = 0xb0c0d0;
      const glass = 0x90c8e0;
      // Fixed terminal end (rotunda mounting point)
      parts.push(cyl(0.6, 0.6, 0.8, 8, 0x8a98a8, { x: -2.2, y: 1.0 }));
      parts.push(cyl(0.65, 0.65, 0.15, 8, 0x6a7a88, { x: -2.2, y: 1.45 })); // rotunda roof
      // First segment (fixed near terminal)
      parts.push(box(1.6, 0.6, 0.8, metal, { x: -1.2, y: 1.0 }));
      parts.push(box(1.5, 0.15, 0.7, glass, { x: -1.2, y: 1.2 })); // windows
      // Second segment (telescoping)
      parts.push(box(1.8, 0.55, 0.75, 0xa0b0c0, { x: 0.4, y: 0.95 }));
      parts.push(box(1.7, 0.12, 0.65, glass, { x: 0.4, y: 1.12 })); // windows
      // Third segment (aircraft end, angled down)
      parts.push(box(1.4, 0.5, 0.7, metal, { x: 1.9, y: 0.75, rz: -0.15 }));
      parts.push(box(1.3, 0.1, 0.6, glass, { x: 1.9, y: 0.9, rz: -0.15 })); // windows
      // Aircraft cabin adaptor (the flexible end)
      parts.push(box(0.4, 0.45, 0.65, 0x4a5060, { x: 2.7, y: 0.55 }));
      // Support column (hydraulic)
      parts.push(cyl(0.12, 0.15, 1.0, 6, 0x6a7a88, { x: 0.4, y: 0.35 }));
      parts.push(box(0.35, 0.12, 0.35, 0x5a6a78, { x: 0.4, y: -0.15 })); // base plate
      // Wheels on the ground
      parts.push(cyl(0.12, 0.12, 0.25, 6, 0x3a4048, { x: 0.2, y: 0.06, z: 0.35, rx: 1.57 }));
      parts.push(cyl(0.12, 0.12, 0.25, 6, 0x3a4048, { x: 0.6, y: 0.06, z: 0.35, rx: 1.57 }));
      parts.push(cyl(0.12, 0.12, 0.25, 6, 0x3a4048, { x: 0.2, y: 0.06, z: -0.35, rx: 1.57 }));
      parts.push(cyl(0.12, 0.12, 0.25, 6, 0x3a4048, { x: 0.6, y: 0.06, z: -0.35, rx: 1.57 }));
      // Accordion canopy joint (between segments)
      parts.push(box(0.15, 0.5, 0.78, 0x6a7a88, { x: -0.35, y: 0.95 }));
      parts.push(box(0.15, 0.48, 0.76, 0x5a6a78, { x: 1.25, y: 0.88 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 機場雷達站 airport radar station ----------------------- */
  {
    id: 'airport_radar',
    displayName: '機場雷達站',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 75,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd0d8e0, 0xf0f0f0, 0x4a6a8a, 0x8aa0b8, 0xff4040],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // TPE Airport primary surveillance radar (機場雷達站)
      // The distinctive rotating radar antenna and radome
      const parts = [];
      const concrete = 0xb8b8b0;
      const white = 0xf0f0f0;
      // Equipment building base
      parts.push(box(2.0, 1.2, 1.8, concrete, { y: 0.6 }));
      parts.push(box(2.1, 0.1, 1.9, 0x9a9a90, { y: 1.25 })); // roof
      // Door and windows
      parts.push(box(0.5, 0.8, 0.08, 0x4a5a68, { x: 0.5, y: 0.45, z: 0.92 }));
      parts.push(box(0.35, 0.35, 0.06, 0x90b8d0, { x: -0.5, y: 0.7, z: 0.92 }));
      // Radar tower/pedestal
      parts.push(cyl(0.4, 0.35, 1.6, 8, concrete, { y: 2.1 }));
      // Radar antenna platform
      parts.push(cyl(0.55, 0.55, 0.15, 8, 0x8a98a8, { y: 2.97 }));
      // Primary radar antenna (the big rectangular reflector)
      parts.push(box(2.2, 0.8, 0.15, white, { y: 3.5, rz: 0.05 }));
      parts.push(box(2.0, 0.7, 0.08, 0x4a6a8a, { y: 3.5, z: -0.06, rz: 0.05 })); // feedhorn side
      // Antenna support struts
      parts.push(box(0.08, 0.5, 0.1, 0x8a98a8, { x: -0.7, y: 3.2 }));
      parts.push(box(0.08, 0.5, 0.1, 0x8a98a8, { x: 0.7, y: 3.2 }));
      // Secondary surveillance radar (SSR) antenna on top
      parts.push(box(1.4, 0.25, 0.08, 0x8aa0b8, { y: 4.0 }));
      // Warning lights
      parts.push(sph(0.08, 0xff4040, { ws: 4, hs: 3, x: -1.0, y: 3.5 }));
      parts.push(sph(0.08, 0xff4040, { ws: 4, hs: 3, x: 1.0, y: 3.5 }));
      // Cable/waveguide running down
      parts.push(cyl(0.06, 0.06, 1.5, 6, 0x6a7a88, { x: 0.35, y: 2.0 }));
      // Perimeter fence posts
      parts.push(box(0.08, 0.6, 0.08, 0x8a8a8a, { x: -1.3, y: 0.3, z: 1.2 }));
      parts.push(box(0.08, 0.6, 0.08, 0x8a8a8a, { x: 1.3, y: 0.3, z: 1.2 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 航廈大樓 airport terminal (TPE Terminal building) ------ */
  {
    id: 'airport_terminal',
    displayName: '航廈大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a6878, 0x8aa0b8, 0xb8d0e0, 0xe0e8f0, 0xffe880],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Taoyuan International Airport terminal: long curved roof, jet bridges, control tower accent
      const parts = [];
      const glass = 0xb8d0e0;
      const steel = 0x8aa0b8;
      const concrete = 0xc0c8d0;
      // Main terminal body — wide and long
      parts.push(box(5.0, 1.4, 2.2, glass, { y: 0.7, hex2: 0xe0e8f0 }));
      // Curved roof structure (segmented arch)
      parts.push(cyl(2.6, 2.6, 5.2, 12, steel, { rx: Math.PI / 2, y: 1.65, thetaLen: Math.PI }));
      // Apron/ground slab
      parts.push(box(6.0, 0.1, 3.0, 0x606870, { y: 0.05 }));
      // Jet bridges extending from terminal (3 gates)
      for (let i = 0; i < 3; i++) {
        const gx = -1.8 + i * 1.8;
        parts.push(box(0.3, 0.35, 1.2, concrete, { x: gx, y: 0.5, z: 1.7 })); // jet bridge
        parts.push(box(0.4, 0.25, 0.4, 0x4a5260, { x: gx, y: 0.4, z: 2.35 })); // bridge end
      }
      // Departure hall glass facade (front)
      parts.push(box(4.6, 0.9, 0.15, 0x90c0d8, { y: 0.9, z: -1.05 }));
      // Roof accent ridge
      parts.push(box(4.8, 0.08, 0.25, 0x5a6878, { y: 1.95 }));
      // Small control tower accent on one end
      parts.push(cyl(0.25, 0.2, 0.9, 6, concrete, { x: 2.2, y: 1.85 }));
      parts.push(cyl(0.3, 0.28, 0.25, 6, 0x70a8c0, { x: 2.2, y: 2.42 })); // cab
      parts.push(cyl(0.04, 0.04, 0.4, 6, 0xd0d8e0, { x: 2.2, y: 2.75 })); // antenna
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 cross-street skybridge ------- */
  {
    id: 'crossstreet_skybridge',
    displayName: '跨街空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x3c5876, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Monumental: a wide multi-level glazed skybridge spanning a street between
      // two big mixed-use blocks — the signature Xinyi air-corridor.
      const parts = [
        towerBanded(1.3, 2.8, 1.3, 9, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: -2.0, y: 1.4 }), // block A
        towerBanded(1.3, 3.0, 1.3, 9, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: 2.0, y: 1.5 }), // block B
        box(2.8, 0.6, 0.9, 0x9fd0e4, { y: 1.6, hex2: 0xc8e8f4 }), // lower glazed span
        box(2.8, 0.55, 0.85, 0x9fd0e4, { y: 2.4, hex2: 0xc8e8f4 }), // upper glazed span
        box(2.8, 0.05, 0.92, 0x88a0b4, { y: 1.32 }), // lower span floor
        box(2.8, 0.05, 0.92, 0x88a0b4, { y: 2.7 }), // upper span roof
      ];
      // diagonal truss struts under the lower span
      for (let i = 0; i < 4; i++) {
        const sx = -1.1 + i * 0.73;
        parts.push(box(0.05, 0.85, 0.05, 0xb8c0c8, { rz: (i % 2 ? 1 : -1) * 0.5, x: sx, y: 1.25 })); // truss strut
      }
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: -2.0, y: 2.95 })); // block A roof unit
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: 2.0, y: 3.15 })); // block B roof unit
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop mech tower --------- */
  {
    id: 'rooftop_mech_tower',
    displayName: '屋頂機房塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x4a5260, 0x646c7a, 0x8a92a0, 0xb8bcc6, 0xe0c860],
    yOffset: -0.044,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A tall tower crowned by a dense mechanical/antenna mast head — the kind of
      // rooftop mech stack that tops Xinyi's tallest service towers.
      const parts = [
        towerBanded(1.4, 3.4, 1.4, 11, 0x42505e, 0x8a92a0, 0xe0c860, rng, { y: 1.7 }), // main shaft
        box(1.5, 0.2, 1.5, 0x363c46, { y: 3.5 }), // roof slab
        box(1.1, 1.0, 1.1, 0x646c7a, { y: 4.1, hex2: 0x8a92a0 }), // mech penthouse
        box(0.7, 0.7, 0.7, 0xb8bcc6, { y: 4.85 }), // upper mech box
      ];
      // antenna mast cluster on top
      parts.push(cyl(0.05, 0.05, 1.4, 6, 0xd0d4dc, { y: 5.6 })); // central mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: 0.28, y: 5.3 })); // side mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: -0.28, y: 5.3 })); // side mast
      parts.push(sph(0.12, 0xe0c860, { ws: 6, hs: 4, y: 6.3 })); // aircraft warning light (lit)
      // three mech-platform rings up the mast
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.5, 0.04, 0.5, 0x9aa0aa, { y: 5.1 + i * 0.45 })); // mast platform
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
