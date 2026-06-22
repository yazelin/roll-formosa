/**
 * @file packs/hualien/archetypes/t6.js — Roll Formosa Hualien pack, Tier 6.
 *
 * T6 — 清水斷崖天際 (Qingshui Cliff Skyline). The finale band: dramatic
 * sea cliffs rising sheer from the Pacific, the winding Suhua Highway with
 * tunnels carved through rock, viewing platforms, lighthouses, and the
 * monumental scale of Taiwan's most spectacular coastal scenery.
 *
 * Ten ArchetypeDefs, authored in the FROZEN tier order (tiers.js T6.archetypeIds)
 * — slots [0..7] absorbable, slots [8..9] repeatable chunk landmarks.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (monumental cliff scale).
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// Qingshui Cliff color palette
const CLIFF_DARK = 0x5a5a50;    // dark cliff rock
const CLIFF_MED = 0x7a7a70;     // medium cliff face
const CLIFF_LIGHT = 0x9a9a90;   // lighter cliff
const MARBLE_W = 0xe8e0d8;      // white marble veins
const OCEAN = 0x2a6888;         // deep Pacific blue
const OCEAN_L = 0x4a98b8;       // lighter ocean
const HIGHWAY = 0x5a5a5a;       // road asphalt
const GUARDRAIL = 0xd8d0c0;     // concrete guardrail
const TUNNEL = 0x3a3a3a;        // tunnel interior
const LIGHTHOUSE = 0xf8f8f0;    // lighthouse white

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 斷崖岩壁 cliff wall ------------------------------------ */
  {
    id: 'cliff_wall',
    displayName: '斷崖岩壁',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [CLIFF_DARK, CLIFF_MED, CLIFF_LIGHT, MARBLE_W, OCEAN],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Dramatic vertical sea cliff with layered rock faces
      const parts = [];
      // Main cliff mass
      parts.push(box(1.8, 3.5, 1.2, CLIFF_MED, { y: 1.75, hex2: CLIFF_DARK }));
      // Layered rock texture
      parts.push(box(0.2, 1.2, 1.0, CLIFF_LIGHT, { x: 0.9, y: 1.8, z: 0.2 }));
      parts.push(box(0.15, 0.9, 0.8, CLIFF_DARK, { x: 0.85, y: 2.8, z: -0.2 }));
      parts.push(box(0.18, 1.5, 0.7, CLIFF_MED, { x: 0.88, y: 1.0, z: 0.3 }));
      // Marble veins
      parts.push(box(0.08, 2.0, 0.5, MARBLE_W, { x: 0.92, y: 2.0, z: 0 }));
      // Ocean at base
      parts.push(box(2.0, 0.15, 1.4, OCEAN, { y: 0.08, hex2: OCEAN_L }));
      // Cliff top vegetation hint
      parts.push(box(1.6, 0.2, 1.0, 0x4a6a4a, { y: 3.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 公路護欄 highway guardrail ----------------------------- */
  {
    id: 'highway_guardrail',
    displayName: '公路護欄',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [HIGHWAY, GUARDRAIL, 0xea4a30, 0xf8f8f0, CLIFF_MED],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Suhua Highway section with concrete guardrails and cliff backdrop
      const parts = [];
      // Road surface
      parts.push(box(4.0, 0.12, 1.2, HIGHWAY, { y: 0.06 }));
      // Center line
      parts.push(box(3.8, 0.02, 0.08, 0xf0e080, { y: 0.13 }));
      // Concrete guardrail (ocean side)
      parts.push(box(4.2, 0.8, 0.25, GUARDRAIL, { y: 0.52, z: 0.6 }));
      // Red reflector posts
      for (let x = -1.5; x <= 1.5; x += 1.0) {
        parts.push(cyl(0.04, 0.04, 0.9, 6, 0xea4a30, { x, y: 0.57, z: 0.68 }));
      }
      // Cliff side retaining wall
      parts.push(box(4.0, 1.5, 0.4, CLIFF_MED, { y: 0.87, z: -0.7, hex2: CLIFF_DARK }));
      // Drainage gutter
      parts.push(box(4.0, 0.08, 0.15, 0x6a6a60, { y: 0.16, z: -0.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 觀景平台 scenic platform ------------------------------- */
  {
    id: 'scenic_platform',
    displayName: '觀景平台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 100,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a8a80, GUARDRAIL, 0x5a4a3a, 0x3a6a3a, OCEAN],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Cliff-edge viewing platform with safety railings and info boards
      const parts = [];
      // Platform deck
      parts.push(box(2.5, 0.15, 2.0, 0x8a8a80, { y: 0.08 }));
      // Support pillars
      parts.push(cyl(0.15, 0.18, 1.2, 6, 0x7a7a70, { x: -1.0, y: 0.6, z: 0.8 }));
      parts.push(cyl(0.15, 0.18, 1.2, 6, 0x7a7a70, { x: 1.0, y: 0.6, z: 0.8 }));
      // Safety railing
      parts.push(box(2.6, 0.06, 0.06, 0x5a5a5a, { y: 1.1, z: 0.95 }));
      parts.push(box(2.6, 0.06, 0.06, 0x5a5a5a, { y: 0.7, z: 0.95 }));
      // Railing posts
      for (let x = -1.2; x <= 1.2; x += 0.6) {
        parts.push(cyl(0.03, 0.03, 1.0, 6, 0x5a5a5a, { x, y: 0.65, z: 0.95 }));
      }
      // Info board
      parts.push(box(0.08, 0.9, 0.08, 0x5a4a3a, { x: -0.8, y: 0.60, z: -0.5 }));
      parts.push(box(0.6, 0.4, 0.04, 0xf0e8d0, { x: -0.8, y: 0.95, z: -0.52 }));
      // Bench
      parts.push(box(0.8, 0.1, 0.35, 0x5a4a3a, { x: 0.6, y: 0.5, z: -0.4 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 巨型海蝕洞 giant sea cave ------------------------------ */
  {
    id: 'sea_cave',
    displayName: '巨型海蝕洞',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [CLIFF_DARK, CLIFF_MED, TUNNEL, OCEAN, MARBLE_W],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Massive sea cave eroded into the cliff base
      const parts = [];
      // Cliff surrounding the cave
      parts.push(box(2.5, 2.8, 1.8, CLIFF_MED, { y: 1.4, hex2: CLIFF_DARK }));
      // Cave opening (darker inset)
      parts.push(box(1.2, 1.5, 0.8, TUNNEL, { y: 0.75, z: 0.6 }));
      // Cave arch detail
      parts.push(cyl(0.6, 0.5, 0.3, 8, CLIFF_DARK, { y: 1.5, z: 0.6, rx: HALF_PI }));
      // Ocean water in cave
      parts.push(box(1.0, 0.1, 0.6, OCEAN, { y: 0.05, z: 0.6, hex2: OCEAN_L }));
      // Rocky outcrop
      parts.push(ico(0.3, 1, CLIFF_LIGHT, { x: 1.0, y: 0.25, z: 0.8 }));
      // White foam
      parts.push(box(0.8, 0.05, 0.3, 0xf0f8ff, { y: 0.12, z: 0.9 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 蘇花隧道 Suhua tunnel ---------------------------------- */
  {
    id: 'suhua_tunnel',
    displayName: '蘇花隧道',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [CLIFF_MED, TUNNEL, 0xf0e080, HIGHWAY, 0xea4a30],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Mountain tunnel entrance carved through cliff
      const parts = [];
      // Mountain mass
      parts.push(cone(2.0, 3.2, 8, CLIFF_MED, { y: 1.6, hex2: CLIFF_DARK }));
      // Tunnel portal
      parts.push(cyl(0.7, 0.7, 1.0, 8, TUNNEL, { y: 0.5, z: 1.0, rx: HALF_PI }));
      // Portal frame (concrete)
      parts.push(cyl(0.85, 0.85, 0.15, 8, 0x9a9a90, { y: 0.5, z: 1.05, rx: HALF_PI }));
      // Road leading in
      parts.push(box(0.9, 0.08, 1.5, HIGHWAY, { y: 0.04, z: 1.5 }));
      // Road markings
      parts.push(box(0.08, 0.02, 1.4, 0xf0e080, { y: 0.09, z: 1.5 }));
      // Tunnel sign
      parts.push(box(0.04, 0.6, 0.04, 0x5a5a5a, { x: -0.6, y: 0.35, z: 1.3 }));
      parts.push(box(0.5, 0.3, 0.03, 0x1a5a1a, { x: -0.6, y: 0.60, z: 1.32 }));
      // Vegetation on mountain
      parts.push(ico(0.35, 0, 0x3a5a3a, { x: 0.6, y: 1.8, z: 0 }));
      return finish(parts);
    },
  },

  /* ---- slot 5: 斷崖量體 cliff mass ------------------------------------ */
  {
    id: 'cliff_mass',
    displayName: '斷崖量體',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 220,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [CLIFF_DARK, CLIFF_MED, CLIFF_LIGHT, MARBLE_W, 0x3a5a3a],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Monumental cliff section showing full vertical drop
      const parts = [];
      // Main cliff body - stepped for drama
      parts.push(box(2.2, 4.0, 1.6, CLIFF_MED, { y: 2.0, hex2: CLIFF_DARK }));
      parts.push(box(1.8, 3.2, 1.2, CLIFF_LIGHT, { x: 0.3, y: 1.6, z: 0.3 }));
      // Layered striations
      for (let i = 0; i < 4; i++) {
        const y = 0.8 + i * 0.9;
        parts.push(box(2.3, 0.08, 1.7, CLIFF_DARK, { y }));
      }
      // Marble band
      parts.push(box(2.25, 0.15, 0.1, MARBLE_W, { y: 2.5, z: 0.8 }));
      // Cliff top with trees
      parts.push(box(2.0, 0.25, 1.4, 0x3a5a3a, { y: 4.12 }));
      // Fallen rock at base
      parts.push(ico(0.25, 1, CLIFF_LIGHT, { x: 0.8, y: 0.2, z: 0.7 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 海上巨岩 sea rock -------------------------------------- */
  {
    id: 'sea_rock',
    displayName: '海上巨岩',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 90,
    radiusJitter: 0.20,
    spawnWeight: 1.0,
    palette: [CLIFF_DARK, CLIFF_MED, OCEAN, OCEAN_L, 0xf0f8ff],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Dramatic sea stack rising from the Pacific
      const parts = [];
      // Ocean base
      parts.push(cyl(1.8, 1.8, 0.12, 12, OCEAN, { y: 0.06, hex2: OCEAN_L }));
      // Main rock stack
      parts.push(ico(0.8, 1, CLIFF_MED, { y: 0.9 }));
      parts.push(ico(0.5, 1, CLIFF_DARK, { y: 1.6 }));
      parts.push(ico(0.3, 0, CLIFF_LIGHT, { y: 2.1 }));
      // Wave foam ring
      parts.push(cyl(1.0, 0.9, 0.08, 10, 0xf0f8ff, { y: 0.14 }));
      // Bird on top
      parts.push(cone(0.08, 0.12, 4, 0xf8f8f8, { y: 2.35 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 燈塔 lighthouse ---------------------------------------- */
  {
    id: 'lighthouse',
    displayName: '燈塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 75,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [LIGHTHOUSE, 0xea4a30, 0x3a3a3a, CLIFF_MED, 0xf8e060],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Classic coastal lighthouse on rocky base
      const parts = [];
      // Rocky base
      parts.push(ico(0.7, 1, CLIFF_MED, { y: 0.35 }));
      // Lighthouse tower
      parts.push(cyl(0.35, 0.28, 2.2, 8, LIGHTHOUSE, { y: 1.8 }));
      // Red band
      parts.push(cyl(0.36, 0.35, 0.3, 8, 0xea4a30, { y: 1.5 }));
      // Lantern room
      parts.push(cyl(0.32, 0.32, 0.5, 8, 0x3a3a3a, { y: 3.15 }));
      // Glass windows (light)
      parts.push(cyl(0.28, 0.28, 0.4, 8, 0xf8e060, { y: 3.15 }));
      // Dome roof
      parts.push(sph(0.32, 0x3a3a3a, { ws: 8, hs: 4, y: 3.45 }));
      // Gallery railing
      parts.push(cyl(0.38, 0.38, 0.05, 8, 0x2a2a2a, { y: 2.92 }));
      // Door
      parts.push(box(0.15, 0.35, 0.05, 0x5a4030, { y: 0.88, z: 0.32 }));
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 清水斷崖觀景 Qingshui viewpoint ------- */
  {
    id: 'qingshui_viewpoint',
    displayName: '清水斷崖觀景',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [CLIFF_DARK, CLIFF_MED, CLIFF_LIGHT, OCEAN, MARBLE_W],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Monumental: the famous Qingshui Cliff viewpoint with dramatic cliffs
      // plunging into the Pacific, viewing platform, and Suhua Highway carved
      // into the cliff face
      const parts = [];
      // Main cliff - sheer vertical drop
      parts.push(box(3.0, 4.5, 2.0, CLIFF_MED, { y: 2.25, hex2: CLIFF_DARK }));
      // Layered rock faces
      parts.push(box(0.3, 2.0, 1.5, CLIFF_LIGHT, { x: 1.45, y: 1.5, z: 0 }));
      parts.push(box(0.25, 1.5, 1.2, CLIFF_DARK, { x: 1.4, y: 3.0, z: 0.3 }));
      // Marble veins
      parts.push(box(0.1, 3.0, 0.3, MARBLE_W, { x: 1.5, y: 2.0, z: -0.3 }));
      // Highway carved into cliff (mid-height)
      parts.push(box(3.2, 0.12, 0.6, HIGHWAY, { y: 2.2, z: 1.0 }));
      parts.push(box(3.2, 0.5, 0.15, GUARDRAIL, { y: 2.45, z: 1.25 }));
      // Viewing platform extension
      parts.push(box(0.8, 0.1, 0.6, 0x8a8a80, { x: 0, y: 2.25, z: 1.4 }));
      // Safety railing on platform
      parts.push(box(0.85, 0.6, 0.04, 0x5a5a5a, { y: 2.55, z: 1.65 }));
      // Ocean at base
      parts.push(box(3.5, 0.2, 2.5, OCEAN, { y: 0.1, hex2: OCEAN_L }));
      // White wave spray
      parts.push(box(2.8, 0.08, 0.4, 0xf0f8ff, { y: 0.22, z: 0.8 }));
      // Cliff top forest
      parts.push(box(2.6, 0.3, 1.6, 0x3a5a3a, { y: 4.65 }));
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 蘇花公路彎道 Suhua Highway curve ------ */
  {
    id: 'suhua_curve',
    displayName: '蘇花公路彎道',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [CLIFF_MED, HIGHWAY, GUARDRAIL, 0xea4a30, OCEAN],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // The famous winding Suhua Highway with dramatic cliff backdrop and
      // ocean views - a signature element of Hualien's coastal scenery
      const parts = [];
      // Cliff backdrop
      parts.push(box(3.5, 3.8, 1.5, CLIFF_MED, { y: 1.9, z: -0.8, hex2: CLIFF_DARK }));
      // Highway - curved suggestion via angled segments
      parts.push(box(2.0, 0.12, 1.0, HIGHWAY, { y: 0.06, z: 0.3, ry: 0.2 }));
      parts.push(box(2.0, 0.12, 1.0, HIGHWAY, { x: 1.5, y: 0.06, z: 0.8, ry: 0.5 }));
      parts.push(box(1.5, 0.12, 1.0, HIGHWAY, { x: -1.3, y: 0.06, z: 0, ry: -0.3 }));
      // Centerline markings
      parts.push(box(1.8, 0.02, 0.08, 0xf0e080, { y: 0.13, z: 0.3, ry: 0.2 }));
      parts.push(box(1.8, 0.02, 0.08, 0xf0e080, { x: 1.5, y: 0.13, z: 0.8, ry: 0.5 }));
      // Guardrails (ocean side)
      parts.push(box(2.2, 0.7, 0.2, GUARDRAIL, { y: 0.45, z: 1.0, ry: 0.2 }));
      parts.push(box(2.2, 0.7, 0.2, GUARDRAIL, { x: 1.5, y: 0.45, z: 1.5, ry: 0.5 }));
      // Warning reflectors
      for (let i = 0; i < 4; i++) {
        const angle = 0.2 + i * 0.15;
        parts.push(cyl(0.05, 0.05, 0.8, 6, 0xea4a30, {
          x: -0.8 + i * 0.7, y: 0.5, z: 1.1 + i * 0.15, ry: angle,
        }));
      }
      // Retaining wall (cliff side)
      parts.push(box(3.2, 1.0, 0.3, CLIFF_LIGHT, { y: 0.5, z: -0.3 }));
      // Ocean
      parts.push(box(4.0, 0.15, 1.5, OCEAN, { y: 0.08, z: 2.2, hex2: OCEAN_L }));
      // Tunnel entrance in cliff
      parts.push(cyl(0.5, 0.5, 0.3, 8, TUNNEL, { x: -1.8, y: 0.5, z: -0.6, ry: 0.3 }));
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
