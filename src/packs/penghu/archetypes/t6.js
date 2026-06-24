/**
 * @file packs/penghu/archetypes/t6.js — Roll Formosa Penghu pack, Tier 6.
 *
 * T6 — 離島天際線 (Island skyline). The finale band: wind turbines, the iconic
 * cross-sea bridge, large harbor facilities, and the distinctive low-rise
 * island skyline against the vast ocean sky. Ten ArchetypeDefs, authored in
 * the FROZEN tier order (tiers.js T6.archetypeIds) — slots [0..7] absorbable,
 * slots [8..9] repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (island landmark scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 風力發電機 wind turbine ----------------------------------- */
  {
    id: 'wind_turbine',
    displayName: '風力發電機',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0f4f8, 0xe8ecf0, 0xd0d8e0, 0x8a9098, 0x3a6a9a],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Penghu's iconic wind turbines - clean energy landmark
      const parts = [
        // tower (tapered cylinder)
        cyl(0.4, 0.25, 6.0, 8, 0xf0f4f8, { y: 3.0 }),
        // nacelle (housing)
        box(0.8, 0.5, 0.5, 0xe8ecf0, { y: 6.2 }),
        // hub
        cyl(0.25, 0.25, 0.3, 8, 0xd0d8e0, { y: 6.2, z: 0.35, rx: HALF_PI }),
        // three blades
        box(0.2, 3.5, 0.08, 0xf0f4f8, { y: 7.95, z: 0.5, rx: HALF_PI * 0.1 }), // blade up
        box(0.2, 3.5, 0.08, 0xf0f4f8, { y: 5.1, z: 0.5, rz: 2.09, rx: HALF_PI * 0.1 }), // blade lower-left
        box(0.2, 3.5, 0.08, 0xf0f4f8, { y: 5.1, z: 0.5, rz: -2.09, rx: HALF_PI * 0.1 }), // blade lower-right
        // base platform
        box(1.5, 0.3, 1.5, 0x8a9098, { y: 0.15 }),
        // transformer box at base
        box(0.6, 0.5, 0.5, 0x3a6a9a, { x: 0.8, y: 0.25 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 跨海大橋 cross-sea bridge ---------------------------------- */
  {
    id: 'cross_sea_bridge',
    displayName: '跨海大橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 250,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xd0d4d8, 0xe0e4e8, 0xc94848, 0xb8bcc0, 0x4a5a6a],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      // The iconic Penghu Great Bridge (澎湖跨海大橋)
      const parts = [
        // main deck
        box(5.5, 0.2, 1.0, 0xd0d4d8, { y: 1.5 }),
        // parapets
        box(5.5, 0.15, 0.08, 0xe0e4e8, { y: 1.68, z: 0.48 }),
        box(5.5, 0.15, 0.08, 0xe0e4e8, { y: 1.68, z: -0.48 }),
        // road markings
        box(5.4, 0.02, 0.08, 0xffffff, { y: 1.62 }),
        // approach piers
        cyl(0.25, 0.3, 1.8, 6, 0xb8bcc0, { x: -2.2, y: 0.7 }),
        cyl(0.25, 0.3, 1.8, 6, 0xb8bcc0, { x: 2.2, y: 0.7 }),
      ];
      // Main arch pylons (the distinctive red arch design) - single central pylon
      // arch legs
      parts.push(cyl(0.15, 0.18, 2.5, 6, 0xc94848, { rz: 0.18, x: -0.25, y: 2.7 }));
      parts.push(cyl(0.15, 0.18, 2.5, 6, 0xc94848, { rz: -0.18, x: 0.25, y: 2.7 }));
      // arch crossbeam
      parts.push(box(0.7, 0.15, 0.2, 0xc94848, { y: 3.6 }));
      // suspension cables (reduced from 3 to 2 per side)
      for (let i = 0; i < 2; i++) {
        const span = 0.6 + i * 0.6;
        const len = Math.hypot(span, 2.0);
        const ang = Math.atan2(span, 2.0);
        parts.push(box(0.03, len, 0.03, 0x4a5a6a, { rz: ang, x: -span / 2, y: 2.5 }));
        parts.push(box(0.03, len, 0.03, 0x4a5a6a, { rz: -ang, x: span / 2, y: 2.5 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 大型漁船 large fishing vessel ------------------------------ */
  {
    id: 'large_fishing_vessel',
    displayName: '大型漁船',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 90,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a5a7a, 0x4a6a8a, 0xe8e0d0, 0xc83838, 0x8a9098],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Large commercial fishing vessel
      const parts = [
        // hull
        box(4.0, 1.0, 1.4, 0xffffff, { y: 0.6, hex2: 0x3a5a7a }),
        // bow
        box(1.0, 0.8, 1.0, 0x3a5a7a, { x: 2.2, y: 0.5, sz: 0.6 }),
        cone(0.5, 0.8, 6, 0x3a5a7a, { x: 2.8, y: 0.5, rz: HALF_PI }),
        // stern
        box(0.6, 0.9, 1.3, 0x3a5a7a, { x: -2.0, y: 0.55 }),
        // deck
        box(3.6, 0.12, 1.2, 0xc8b8a0, { y: 1.1 }),
        // bridge/wheelhouse
        box(1.2, 1.0, 1.0, 0xe8e0d0, { x: -0.8, y: 1.65 }),
        box(1.1, 0.5, 0.08, 0x4a7090, { x: -0.8, y: 1.85, z: 0.52 }), // windows
        // crane/derrick
        cyl(0.08, 0.08, 1.8, 6, 0x8a9098, { x: 1.0, y: 2.0 }),
        box(1.2, 0.1, 0.1, 0x8a9098, { x: 0.6, y: 2.8 }),
        // fishing gear on deck
        box(0.6, 0.3, 0.8, 0x6a5a4a, { x: 1.5, y: 1.35 }),
        // red stripe
        box(4.2, 0.15, 0.06, 0xc83838, { y: 0.9, z: 0.72 }),
        // mast with radar
        cyl(0.06, 0.06, 1.5, 6, 0x8a8a8a, { x: -0.8, y: 2.9 }),
        box(0.4, 0.1, 0.4, 0x6a6a6a, { x: -0.8, y: 3.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 燈塔 lighthouse ------------------------------------------- */
  {
    id: 'lighthouse',
    displayName: '燈塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 70,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf8f8f8, 0xe8e8e8, 0xc83838, 0x2a3a48, 0xfff0a0],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Traditional lighthouse (漁翁島燈塔 style)
      const parts = [
        // base platform
        box(2.5, 0.5, 2.5, 0xe8e8e8, { y: 0.25 }),
        // tower body (tapered cylinder, white with red band)
        cyl(0.8, 0.6, 4.5, 6, 0xf8f8f8, { y: 2.75 }),
        // red band
        cyl(0.82, 0.75, 0.6, 6, 0xc83838, { y: 1.3 }),
        // gallery (observation deck)
        cyl(0.85, 0.85, 0.3, 6, 0x2a3a48, { y: 5.1 }),
        box(1.8, 0.1, 1.8, 0x2a3a48, { y: 5.3 }),
        // lantern room
        cyl(0.5, 0.5, 0.8, 6, 0xfff0a0, { y: 5.8 }),
        // dome cap
        sph(0.55, 0xc83838, { ws: 6, hs: 4, y: 6.3, sy: 0.6 }),
        // keeper's house nearby
        box(1.5, 0.8, 1.2, 0xf8f8f8, { x: 1.8, y: 0.65, z: 0 }),
        box(1.6, 0.15, 1.3, 0x8a4a3a, { x: 1.8, y: 1.15, z: 0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 機場航廈 airport terminal ---------------------------------- */
  {
    id: 'airport_terminal',
    displayName: '機場航廈',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e4dc, 0xf0ece4, 0x4a8090, 0xc8c4bc, 0x6a6a6a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Magong Airport terminal (馬公機場)
      const parts = [
        // main terminal building
        box(5.0, 1.8, 3.0, 0xffffff, { y: 1.0, hex2: 0xe8e4dc }),
        // curved roof
        cyl(1.8, 1.8, 5.2, 10, 0xf0ece4, { theta0: PI, rx: HALF_PI, sy: 0.35, y: 2.2 }),
        // glass facade
        box(4.6, 1.4, 0.1, 0x8fc8d8, { y: 0.9, z: 1.55 }),
        // entrance canopy
        box(3.0, 0.15, 1.5, 0x4a8090, { y: 1.8, z: 2.3 }),
        cyl(0.12, 0.12, 1.7, 6, 0xc8c4bc, { x: -1.2, y: 0.95, z: 2.8 }),
        cyl(0.12, 0.12, 1.7, 6, 0xc8c4bc, { x: 1.2, y: 0.95, z: 2.8 }),
        // control tower
        cyl(0.4, 0.35, 3.0, 8, 0xf0ece4, { x: -2.8, y: 1.6 }),
        box(1.0, 0.6, 1.0, 0x4a8090, { x: -2.8, y: 3.3 }),
        box(0.9, 0.35, 0.08, 0x4a6878, { x: -2.8, y: 3.35, z: 0.52 }),
        // runway visible
        box(6.0, 0.08, 1.5, 0x6a6a6a, { y: 0.04, z: -2.5 }),
        box(0.2, 0.02, 1.4, 0xffffff, { y: 0.1, z: -2.5 }),
        // parked plane silhouette
        box(1.5, 0.3, 1.2, 0xe8e8e8, { x: 2.0, y: 0.25, z: -2.5 }),
        box(2.0, 0.08, 0.15, 0xe8e8e8, { x: 2.0, y: 0.4, z: -2.5 }), // wing
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 玄武岩海崖 basalt sea cliff -------------------------------- */
  {
    id: 'basalt_cliff',
    displayName: '玄武岩海崖',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a3a42, 0x4a4a52, 0x5a5a62, 0x2a2a32, 0x4a7090],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Dramatic basalt cliff formation (桶盤嶼/大菓葉 style)
      const parts = [
        // base cliff mass
        box(4.5, 2.0, 3.0, 0x3a3a42, { y: 1.0 }),
        // upper cliff face
        box(4.0, 1.5, 2.5, 0x4a4a52, { y: 2.75 }),
      ];
      // Columnar basalt columns on the cliff face
      const colPositions = [
        { x: -1.5, z: 1.3, h: 3.2 }, { x: -0.8, z: 1.35, h: 3.5 },
        { x: -0.1, z: 1.3, h: 3.3 }, { x: 0.6, z: 1.35, h: 3.6 },
        { x: 1.3, z: 1.3, h: 3.1 }, { x: -1.2, z: 1.5, h: 2.8 },
        { x: 0.3, z: 1.5, h: 2.9 }, { x: 1.0, z: 1.5, h: 2.7 },
      ];
      for (const col of colPositions) {
        const tint = rng() < 0.5 ? 0x3a3a42 : 0x4a4a52;
        parts.push(cyl(0.35, 0.35, col.h, 6, tint, { x: col.x, z: col.z, y: col.h / 2 }));
      }
      // sea foam at base
      parts.push(box(5.0, 0.15, 0.5, 0xd0e0f0, { y: 0.08, z: 1.8 }));
      // grass/vegetation on top
      parts.push(box(3.5, 0.2, 2.0, 0x4a7050, { y: 3.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 度假村 resort complex ------------------------------------- */
  {
    id: 'resort',
    displayName: '度假村',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 100,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8dc, 0xf8f0e8, 0x4a8090, 0xc8c0b4, 0x3a6a4a],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Island resort with Mediterranean/tropical style
      const parts = [
        // main hotel building
        towerBanded(2.5, 3.5, 2.0, 8, 0xffffff, 0x4a6a7a, 0xffd98a, rng, { y: 1.85 }),
        box(2.6, 0.15, 2.1, 0x4a8090, { y: 3.7 }),
        // side wing
        box(2.0, 2.5, 1.8, 0xf0e8dc, { x: 2.5, y: 1.35 }),
        box(1.8, 0.8, 0.08, 0x8fc8d8, { x: 2.5, y: 1.5, z: 0.95 }),
        // pool area
        box(2.5, 0.15, 2.0, 0x4ac0e0, { x: -0.5, y: 0.08, z: 2.0 }),
        // pool deck
        box(3.5, 0.1, 2.5, 0xc8c0b4, { x: -0.5, y: 0.05, z: 2.5 }),
        // palm trees (simplified)
        cyl(0.1, 0.1, 1.5, 6, 0x8a7060, { x: -2.0, y: 0.75, z: 2.5 }),
        sph(0.5, 0x3a6a4a, { ws: 6, hs: 5, x: -2.0, y: 1.7, z: 2.5 }),
        cyl(0.1, 0.1, 1.5, 6, 0x8a7060, { x: 1.5, y: 0.75, z: 3.0 }),
        sph(0.5, 0x3a6a4a, { ws: 6, hs: 5, x: 1.5, y: 1.7, z: 3.0 }),
        // beach umbrellas
        cyl(0.05, 0.05, 0.8, 6, 0x8a8a8a, { x: -1.5, y: 0.5, z: 3.5 }),
        cyl(0.5, 0.0, 0.15, 8, 0xe06030, { x: -1.5, y: 1.0, z: 3.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 風車群 wind farm cluster ---------------------------------- */
  {
    id: 'wind_farm',
    displayName: '風車群',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0f4f8, 0xe8ecf0, 0xd0d8e0, 0x6a9a4a, 0x8a9098],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Multiple wind turbines in a field
      const parts = [
        // ground/field
        box(5.0, 0.15, 4.0, 0x6a9a4a, { y: 0.08 }),
      ];
      // Three turbines at different positions
      const turbines = [
        { x: -1.5, z: -0.8, h: 4.5 },
        { x: 1.2, z: 0.5, h: 5.0 },
        { x: -0.3, z: 1.2, h: 4.2 },
      ];
      for (const t of turbines) {
        // tower
        parts.push(cyl(0.25, 0.18, t.h, 6, 0xf0f4f8, { x: t.x, z: t.z, y: t.h / 2 + 0.15 }));
        // nacelle
        parts.push(box(0.5, 0.35, 0.35, 0xe8ecf0, { x: t.x, z: t.z, y: t.h + 0.3 }));
        // hub
        parts.push(cyl(0.15, 0.15, 0.2, 6, 0xd0d8e0, { x: t.x, z: t.z + 0.25, y: t.h + 0.3, rx: HALF_PI }));
        // blades (simplified - one showing)
        parts.push(box(0.12, 2.2, 0.05, 0xf0f4f8, { x: t.x, z: t.z + 0.35, y: t.h + 1.4 }));
        // base
        parts.push(box(0.8, 0.2, 0.8, 0x8a9098, { x: t.x, z: t.z, y: 0.25 }));
      }
      // access road
      parts.push(box(4.5, 0.08, 0.5, 0xb0a898, { y: 0.19, z: -1.5 }));
      // substation
      box(1.0, 0.6, 0.8, 0x8a9098, { x: 2.0, z: -1.5, y: 0.45 });
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨海大橋群 bridge complex --------------- */
  {
    id: 'bridge_complex',
    displayName: '跨海大橋群',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd0d4d8, 0xe0e4e8, 0xc94848, 0xb8bcc0, 0x4a7090],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Extended cross-sea bridge with multiple spans
      const parts = [
        // main long deck
        box(7.0, 0.22, 1.2, 0xd0d4d8, { y: 1.6 }),
        // parapets
        box(7.0, 0.18, 0.1, 0xe0e4e8, { y: 1.82, z: 0.55 }),
        box(7.0, 0.18, 0.1, 0xe0e4e8, { y: 1.82, z: -0.55 }),
        // road markings
        box(6.8, 0.02, 0.1, 0xffffff, { y: 1.73 }),
      ];
      // Two arch pylons (reduced from 3)
      const pylonX = [-1.8, 1.8];
      for (const px of pylonX) {
        // arch legs
        parts.push(cyl(0.12, 0.15, 2.2, 5, 0xc94848, { rz: 0.15, x: px - 0.2, y: 2.7 }));
        parts.push(cyl(0.12, 0.15, 2.2, 5, 0xc94848, { rz: -0.15, x: px + 0.2, y: 2.7 }));
        // crossbeam
        parts.push(box(0.55, 0.12, 0.18, 0xc94848, { x: px, y: 3.5 }));
        // cables (single cable per side instead of 2)
        const span = 0.7;
        const len = Math.hypot(span, 1.7);
        const ang = Math.atan2(span, 1.7);
        parts.push(box(0.025, len, 0.025, 0x4a5a6a, { rz: ang, x: px - span / 2, y: 2.5 }));
        parts.push(box(0.025, len, 0.025, 0x4a5a6a, { rz: -ang, x: px + span / 2, y: 2.5 }));
      }
      // approach piers (reduced segments)
      parts.push(cyl(0.3, 0.35, 1.9, 5, 0xb8bcc0, { x: -3.2, y: 0.75 }));
      parts.push(cyl(0.3, 0.35, 1.9, 5, 0xb8bcc0, { x: 3.2, y: 0.75 }));
      // water indication
      parts.push(box(7.5, 0.1, 3.0, 0x4a7090, { y: -0.3, sy: 0.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 風電海岸 wind power coast --------------- */
  {
    id: 'wind_power_coast',
    displayName: '風電海岸',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xf0f4f8, 0xd0d8e0, 0x4a7090, 0x6a9a5a, 0x8a9098],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Coastal wind farm with turbines along the shoreline
      const parts = [
        // coastline/beach
        box(6.0, 0.15, 2.0, 0xd8d0c0, { y: 0.08, z: 2.0 }),
        // grass area
        box(6.0, 0.12, 2.5, 0x6a9a5a, { y: 0.06, z: -0.5 }),
        // ocean
        box(6.5, 0.1, 2.0, 0x4a7090, { y: 0.02, z: 3.5 }),
      ];
      // Row of turbines along coast
      const turbineX = [-2.2, -0.7, 0.8, 2.3];
      for (let i = 0; i < turbineX.length; i++) {
        const tx = turbineX[i];
        const h = 4.0 + (i % 2) * 0.5;
        // tower
        parts.push(cyl(0.22, 0.16, h, 6, 0xf0f4f8, { x: tx, z: 0.5, y: h / 2 + 0.15 }));
        // nacelle
        parts.push(box(0.45, 0.32, 0.32, 0xd0d8e0, { x: tx, z: 0.5, y: h + 0.3 }));
        // single visible blade (rotated positions)
        const bladeAng = (i * 1.2) % PI;
        parts.push(box(0.1, 1.8, 0.04, 0xf0f4f8, {
          x: tx, z: 0.75, y: h + 0.3 + Math.cos(bladeAng) * 0.9,
          rz: bladeAng,
        }));
        // base
        parts.push(box(0.7, 0.18, 0.7, 0x8a9098, { x: tx, z: 0.5, y: 0.24 }));
      }
      // transformer station
      parts.push(box(1.2, 0.7, 0.9, 0x8a9098, { x: -2.5, z: -1.5, y: 0.5 }));
      // power lines
      cyl(0.04, 0.04, 2.0, 6, 0x6a6a6a, { x: -1.5, z: -1.5, y: 1.0 });
      cyl(0.04, 0.04, 2.0, 6, 0x6a6a6a, { x: 1.0, z: -1.5, y: 1.0 });
      box(3.0, 0.03, 0.03, 0x4a4a4a, { y: 2.0, z: -1.5 });
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
