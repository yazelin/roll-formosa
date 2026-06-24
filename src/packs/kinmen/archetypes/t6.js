/**
 * @file packs/kinmen/archetypes/t6.js — Roll Formosa Kinmen pack, TIER 6
 * content: 風獅爺天際線 (Wind Lion God skyline).
 *
 * T6 — The finale band: giant Wind Lion Gods, sea cliffs, cannon forts, the
 * iconic Kinmen coastal landscape and Shuitou Tower. Ten ArchetypeDefs,
 * authored in the FROZEN tier order (tiers.js T6.archetypeIds) — slots [0..7]
 * absorbable, slots [8..9] repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (coastal landmark scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 巨型風獅爺 (giant Wind Lion God — Kinmen icon) ----------- */
  {
    id: 'giant_wind_lion',
    displayName: '巨型風獅爺',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8dcc8, 0xc8b8a0, 0xc83a28, 0x3a5a4a, 0x8a7a5a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Giant Wind Lion God statue (風獅爺 — Kinmen's guardian deity)
      const parts = [
        // stone pedestal base
        box(2.2, 0.6, 2.0, 0x8a7a5a, { y: 0.3 }),
        box(2.0, 0.4, 1.8, 0x9a8a6a, { y: 0.8 }),
        // main body (seated lion form)
        box(1.6, 2.4, 1.4, 0xe8dcc8, { y: 2.2 }), // torso
        // shoulders/arms
        box(2.0, 0.8, 1.2, 0xe8dcc8, { y: 2.8 }),
        // head (larger, fierce expression)
        box(1.4, 1.6, 1.2, 0xe8dcc8, { y: 4.2 }),
        // mane (stylized curls)
        box(1.8, 0.4, 1.4, 0xc8b8a0, { y: 4.8 }),
        box(0.8, 0.6, 0.3, 0xc8b8a0, { x: -0.7, y: 4.4, z: 0.5 }),
        box(0.8, 0.6, 0.3, 0xc8b8a0, { x: 0.7, y: 4.4, z: 0.5 }),
        // eyes (prominent)
        box(0.25, 0.2, 0.15, 0x2a2a2a, { x: -0.35, y: 4.4, z: 0.65 }),
        box(0.25, 0.2, 0.15, 0x2a2a2a, { x: 0.35, y: 4.4, z: 0.65 }),
        // nose
        box(0.35, 0.3, 0.2, 0xc8b8a0, { y: 4.1, z: 0.65 }),
        // mouth (open, holding something)
        box(0.6, 0.3, 0.2, 0x8a2a2a, { y: 3.75, z: 0.65 }),
        // arms holding gourd/item
        cyl(0.3, 0.35, 1.2, 6, 0xe8dcc8, { x: -0.9, y: 2.0, rz: 0.3 }),
        cyl(0.3, 0.35, 1.2, 6, 0xe8dcc8, { x: 0.9, y: 2.0, rz: -0.3 }),
        // red ribbon/sash
        box(1.8, 0.2, 0.15, 0xc83a28, { y: 3.2, z: 0.75 }),
        // legs
        box(0.5, 1.0, 0.5, 0xe8dcc8, { x: -0.5, y: 1.1 }),
        box(0.5, 1.0, 0.5, 0xe8dcc8, { x: 0.5, y: 1.1 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 巨岩 (giant rock) ---------------------------------------- */
  {
    id: 'giant_rock',
    displayName: '巨岩',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.20,
    spawnWeight: 1.0,
    palette: [0x6a7068, 0x5a6058, 0x7a8078, 0x4a5048, 0x8a9088],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Giant coastal granite rock/boulder formation (Kinmen granite)
      const parts = [
        // main rock mass (irregular shape via stacked boxes)
        box(3.2, 2.8, 2.8, 0x6a7068, { y: 1.4 }),
        box(2.6, 2.2, 2.4, 0x7a8078, { x: 0.4, y: 2.0, rz: 0.15 }),
        box(2.0, 1.8, 2.0, 0x5a6058, { x: -0.3, y: 2.8, rz: -0.1 }),
        // secondary boulder
        box(1.8, 1.6, 1.8, 0x6a7068, { x: -1.8, y: 0.8, rz: 0.2 }),
        // base rocks
        box(3.8, 0.6, 3.4, 0x5a6058, { y: 0.3 }),
        // rock texture details
        box(1.0, 0.8, 0.4, 0x8a9088, { x: 1.4, y: 1.6, z: 1.3 }),
        box(0.8, 0.6, 0.5, 0x4a5048, { x: -1.0, y: 2.4, z: -1.2 }),
        // erosion line
        box(3.0, 0.08, 2.6, 0x9a9890, { y: 0.8 }),
      ];
      // small rocks scattered around base
      parts.push(box(0.6, 0.4, 0.5, 0x7a8078, { x: 2.0, y: 0.2, z: 1.2 }));
      parts.push(box(0.5, 0.35, 0.45, 0x6a7068, { x: -1.8, y: 0.18, z: -1.4 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 海崖 (sea cliff) ----------------------------------------- */
  {
    id: 'sea_cliff',
    displayName: '海崖',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7068, 0x5a6058, 0x7a8078, 0x4a5048, 0x3a5a7a],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Dramatic sea cliff face (Kinmen coastline)
      const parts = [
        // main cliff wall
        box(5.0, 4.0, 2.0, 0x6a7068, { y: 2.0 }),
        // cliff face texture (stepped layers)
        box(5.2, 0.8, 0.3, 0x7a8078, { y: 3.5, z: 1.0 }),
        box(5.2, 0.6, 0.25, 0x5a6058, { y: 2.5, z: 1.05 }),
        box(5.2, 0.5, 0.2, 0x7a8078, { y: 1.5, z: 1.1 }),
        // cliff top plateau
        box(5.4, 0.3, 2.2, 0x5a6a5a, { y: 4.15 }), // grassy top
        // cliff base with wave erosion
        box(5.2, 0.4, 0.5, 0x4a5048, { y: 0.2, z: 1.2 }),
        // wave splash zone
        box(5.0, 0.12, 0.4, 0x3a5a7a, { y: 0.08, z: 1.5 }),
        // rock outcrops at ends
        box(1.2, 2.5, 1.4, 0x5a6058, { x: -2.8, y: 1.25 }),
        box(1.0, 2.2, 1.2, 0x6a7068, { x: 2.8, y: 1.1 }),
      ];
      // vegetation hint on top
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.4, 0.3, 0.35, 0x4a6a4a, { x: -1.8 + i * 1.2, y: 4.4, z: -0.4 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 3: 砲台 (cannon fort) --------------------------------------- */
  {
    id: 'cannon_fort',
    displayName: '砲台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6a7268, 0x5a6258, 0x8a9288, 0x4a5248, 0x3a3a3a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Historical cannon fort (砲台 — Kinmen coastal defense)
      const parts = [
        // main fort platform (thick walls)
        box(4.5, 1.2, 4.0, 0x6a7268, { y: 0.6 }),
        // raised gun platform
        box(3.8, 0.8, 3.2, 0x5a6258, { y: 1.6 }),
        // parapet walls
        box(4.0, 0.6, 0.4, 0x6a7268, { y: 2.3, z: 1.6 }), // front
        box(4.0, 0.6, 0.4, 0x6a7268, { y: 2.3, z: -1.6 }), // back
        box(0.4, 0.6, 3.2, 0x6a7268, { x: -2.0, y: 2.3 }), // left
        box(0.4, 0.6, 3.2, 0x6a7268, { x: 2.0, y: 2.3 }), // right
        // embrasures (gun ports)
        box(0.6, 0.3, 0.5, 0x1a1e1a, { x: -1.2, y: 2.2, z: 1.7 }),
        box(0.6, 0.3, 0.5, 0x1a1e1a, { x: 0, y: 2.2, z: 1.7 }),
        box(0.6, 0.3, 0.5, 0x1a1e1a, { x: 1.2, y: 2.2, z: 1.7 }),
        // cannon (central)
        cyl(0.4, 0.35, 2.0, 8, 0x3a3a3a, { y: 2.2, z: 0.5, rx: -0.15 }), // barrel
        cyl(0.5, 0.5, 0.4, 8, 0x4a4a4a, { y: 2.1, z: -0.3 }), // base
        // ammunition storage entrance
        box(1.0, 1.0, 0.3, 0x4a5248, { y: 0.6, z: -2.0 }),
        box(0.8, 0.8, 0.08, 0x3a3e3a, { y: 0.6, z: -2.12 }), // door
        // foundation stones
        box(4.8, 0.2, 4.3, 0x5a6258, { y: 0.1 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 觀景台 (viewpoint platform) ------------------------------ */
  {
    id: 'viewpoint_platform',
    displayName: '觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 100,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a9098, 0x6a7078, 0x5a6068, 0x3a5a7a, 0xd8dce0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Coastal viewing platform (Kinmen scenic viewpoint)
      const parts = [
        // main platform deck
        box(4.0, 0.25, 2.8, 0x8a9098, { y: 1.5 }),
        // support columns
        cyl(0.2, 0.25, 1.4, 6, 0x6a7078, { x: -1.6, z: 1.0, y: 0.7 }),
        cyl(0.2, 0.25, 1.4, 6, 0x6a7078, { x: 1.6, z: 1.0, y: 0.7 }),
        cyl(0.2, 0.25, 1.4, 6, 0x6a7078, { x: -1.6, z: -1.0, y: 0.7 }),
        cyl(0.2, 0.25, 1.4, 6, 0x6a7078, { x: 1.6, z: -1.0, y: 0.7 }),
        // safety railing
        box(4.1, 0.06, 0.06, 0x5a6068, { y: 2.0, z: 1.4 }),
        box(4.1, 0.06, 0.06, 0x5a6068, { y: 1.75, z: 1.4 }),
        box(0.06, 0.5, 0.06, 0x5a6068, { x: -2.0, y: 1.75, z: 1.4 }),
        box(0.06, 0.5, 0.06, 0x5a6068, { x: 2.0, y: 1.75, z: 1.4 }),
        // access stairs
        box(1.2, 0.15, 0.5, 0x8a9098, { z: -1.6, y: 0.4 }),
        box(1.2, 0.15, 0.5, 0x8a9098, { z: -2.0, y: 0.25 }),
        box(1.2, 0.15, 0.5, 0x8a9098, { z: -2.4, y: 0.1 }),
        // information sign
        cyl(0.06, 0.06, 1.2, 6, 0x5a6068, { x: -1.8, y: 2.1 }),
        box(0.6, 0.4, 0.04, 0xd8dce0, { x: -1.8, y: 2.55 }),
        // telescope/binoculars stand
        cyl(0.08, 0.1, 0.8, 6, 0x6a7078, { x: 1.0, y: 1.9 }),
        box(0.25, 0.15, 0.35, 0x4a5058, { x: 1.0, y: 2.4 }),
        // water below hint
        box(4.5, 0.08, 3.0, 0x3a5a7a, { y: 0.04 }),
      ];
      // railing posts
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.06, 0.5, 0.06, 0x5a6068, { x: -2.0 + i * 1.0, y: 1.75, z: 1.4 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 大型坑道口 (giant tunnel mouth) -------------------------- */
  {
    id: 'giant_tunnel_mouth',
    displayName: '大型坑道口',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x6a7068, 0x5a6058, 0x1a2028, 0x8a9088, 0x3a5a7a],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Large tunnel entrance carved into cliff (like Zhaishan Tunnel)
      const parts = [
        // cliff mass surrounding tunnel
        box(5.5, 4.5, 3.5, 0x6a7068, { y: 2.25 }),
        // upper cliff
        box(4.8, 2.0, 3.0, 0x5a6058, { y: 5.0 }),
        // giant arched tunnel entrance
        cyl(2.2, 2.2, 0.8, 10, 0x8a9088, { y: 2.2, z: 1.8, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // tunnel interior darkness
        cyl(2.0, 2.0, 1.2, 10, 0x1a2028, { y: 2.2, z: 1.65, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        box(4.0, 2.2, 1.0, 0x1a2028, { y: 1.1, z: 1.65 }), // lower tunnel dark
        // concrete portal frame
        box(4.8, 0.35, 0.5, 0x8a9088, { y: 0.18, z: 1.85 }), // threshold
        box(0.5, 4.2, 0.5, 0x8a9088, { x: -2.2, y: 2.1, z: 1.85 }), // frame L
        box(0.5, 4.2, 0.5, 0x8a9088, { x: 2.2, y: 2.1, z: 1.85 }), // frame R
        box(5.0, 0.5, 0.5, 0x8a9088, { y: 4.25, z: 1.85 }), // arch crown
        // water channel inside hint (boat tunnel)
        box(3.6, 0.15, 0.8, 0x3a5a7a, { y: 0.1, z: 1.9 }),
        // mooring rings on walls
        cyl(0.15, 0.15, 0.08, 8, 0x5a6068, { x: -1.8, y: 1.0, z: 1.92, rx: HALF_PI }),
        cyl(0.15, 0.15, 0.08, 8, 0x5a6068, { x: 1.8, y: 1.0, z: 1.92, rx: HALF_PI }),
      ];
      // rock details on cliff face
      parts.push(box(1.2, 0.8, 0.3, 0x7a8078, { x: -2.6, y: 3.8, z: 1.7 }));
      parts.push(box(1.0, 0.6, 0.25, 0x7a8078, { x: 2.4, y: 3.5, z: 1.7 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 水頭塔 (Shuitou Tower) ----------------------------------- */
  {
    id: 'shuitou_tower',
    displayName: '水頭塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8dcc8, 0xd2c0a8, 0xc83a28, 0x8a7a5a, 0x3a5a4a],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Shuitou Tower (水頭塔 — historic watchtower in Shuitou Village)
      const parts = [
        // stone base platform
        box(2.4, 0.5, 2.4, 0x8a7a5a, { y: 0.25 }),
        // main tower body (多層樓閣)
        box(2.0, 2.0, 2.0, 0xe8dcc8, { y: 1.5 }), // first floor
        box(1.8, 1.8, 1.8, 0xe8dcc8, { y: 3.4 }), // second floor
        box(1.6, 1.6, 1.6, 0xf0e4d4, { y: 5.0 }), // third floor
        // decorative eave between floors
        box(2.2, 0.15, 2.2, 0xd2c0a8, { y: 2.55 }),
        box(2.0, 0.15, 2.0, 0xd2c0a8, { y: 4.35 }),
        // windows on each floor
        box(0.4, 0.5, 0.08, 0x44484f, { y: 1.5, z: 1.02 }),
        box(0.35, 0.45, 0.08, 0x44484f, { y: 3.4, z: 0.92 }),
        box(0.3, 0.4, 0.08, 0x44484f, { y: 5.0, z: 0.82 }),
        // traditional hip roof
        cyl(1.2, 0.1, 1.8, 4, 0xc83a28, { theta0: PI / 4, rx: HALF_PI, sy: 0.5, y: 6.0 }),
        // roof ridge ornament
        box(1.6, 0.1, 0.1, 0xc83a28, { y: 6.35 }),
        // finial
        cone(0.15, 0.4, 6, 0x3a5a4a, { y: 6.65 }),
        // entrance
        box(0.6, 0.9, 0.08, 0x5a4a38, { y: 0.7, z: 1.02 }),
      ];
      // corner columns (decorative)
      const corners = [[-0.9, -0.9], [-0.9, 0.9], [0.9, -0.9], [0.9, 0.9]];
      for (const [x, z] of corners) {
        parts.push(box(0.15, 5.2, 0.15, 0xd2c0a8, { x, z, y: 3.1 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 海岸大石 (coastal boulder) ------------------------------- */
  {
    id: 'coastal_boulder',
    displayName: '海岸大石',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.20,
    spawnWeight: 1.0,
    palette: [0x7a8078, 0x6a7068, 0x5a6058, 0x8a9088, 0x3a5a7a],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Large coastal boulder partially in water
      const parts = [
        // main boulder
        box(2.8, 2.2, 2.4, 0x7a8078, { y: 1.1, rz: 0.1 }),
        box(2.2, 1.8, 2.0, 0x6a7068, { x: 0.3, y: 1.8, rz: -0.05 }),
        // secondary boulder
        box(1.6, 1.4, 1.5, 0x5a6058, { x: 1.8, y: 0.7, rz: 0.15 }),
        // small rocks
        box(0.8, 0.6, 0.7, 0x6a7068, { x: -1.6, y: 0.3 }),
        box(0.6, 0.5, 0.55, 0x7a8078, { x: 2.2, y: 0.25, z: 1.0 }),
        // tide line
        box(3.6, 0.06, 3.0, 0x8a9088, { y: 0.5 }),
        // water surface
        box(4.0, 0.1, 3.4, 0x3a5a7a, { y: 0.08 }),
        // wet rock surface hint
        box(2.6, 0.04, 2.2, 0x5a6a6a, { y: 0.55 }),
        // barnacle/algae patches
        box(0.5, 0.4, 0.1, 0x4a5a4a, { x: 1.2, y: 0.7, z: 1.1 }),
        box(0.4, 0.35, 0.1, 0x4a5a4a, { x: -0.8, y: 0.8, z: 1.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 海岸觀景台 (chunk landmark — coastal viewpoint complex) -- */
  {
    id: 'coastal_viewpoint',
    displayName: '海岸觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 250,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x8a9098, 0x6a7078, 0x5a6068, 0x3a5a7a, 0xd8dce0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Large coastal viewing platform complex on cliff edge
      const parts = [
        // cliff base
        box(6.0, 2.5, 4.0, 0x6a7068, { y: 1.25 }),
        // main platform
        box(5.0, 0.3, 3.5, 0x8a9098, { y: 2.8 }),
        // elevated viewing deck
        box(3.0, 0.25, 2.5, 0x8a9098, { x: 0.5, y: 4.0 }),
        // support pillars for upper deck
        cyl(0.25, 0.3, 1.0, 4, 0x6a7078, { x: -0.8, z: 0.0, y: 3.4 }),
        cyl(0.25, 0.3, 1.0, 4, 0x6a7078, { x: 1.8, z: 0.0, y: 3.4 }),
        // safety railing
        box(3.1, 0.08, 0.06, 0x5a6068, { x: 0.5, y: 4.4, z: 1.3 }),
        // shelter/pavilion roof
        box(2.0, 0.12, 2.0, 0xd8dce0, { x: -1.8, y: 4.5 }),
      ];
      // shelter posts
      parts.push(cyl(0.12, 0.12, 1.5, 4, 0x6a7078, { x: -2.5, z: 0.4, y: 3.65 }));
      parts.push(cyl(0.12, 0.12, 1.5, 4, 0x6a7078, { x: -1.1, z: 0.4, y: 3.65 }));
      // stairs going down
      for (let i = 0; i < 3; i++) {
        parts.push(box(1.5, 0.12, 0.4, 0x8a9098, { x: 2.6, y: 2.6 - i * 0.4, z: -1.5 - i * 0.4 }));
      }
      // water below
      parts.push(box(7.0, 0.1, 5.0, 0x3a5a7a, { y: 0.05 }));
      // Wind Lion statue on platform
      parts.push(box(0.5, 0.8, 0.4, 0xe8dcc8, { x: 1.5, y: 3.3, z: 0.8 }));
      parts.push(box(0.4, 0.5, 0.35, 0xe8dcc8, { x: 1.5, y: 3.95, z: 0.8 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 風獅爺群 (chunk landmark — Wind Lion cluster) ------------ */
  {
    id: 'wind_lion_cluster',
    displayName: '風獅爺群',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xe8dcc8, 0xc8b8a0, 0xc83a28, 0x8a7a5a, 0x5a6a5a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Multiple Wind Lion God statues (風獅爺群) - simplified
      const parts = [
        // ground/plaza base
        box(6.0, 0.2, 4.5, 0x8a7a5a, { y: 0.1 }),
        // stone path
        box(5.5, 0.08, 1.4, 0x9a8a6a, { y: 0.22, z: 0 }),
      ];
      // Central large Wind Lion
      parts.push(box(1.0, 0.4, 0.9, 0x8a7a5a, { y: 0.4 })); // pedestal
      parts.push(box(0.9, 1.8, 0.8, 0xe8dcc8, { y: 1.5 })); // body
      parts.push(box(0.8, 1.0, 0.7, 0xe8dcc8, { y: 2.9 })); // head
      parts.push(box(1.0, 0.25, 0.8, 0xc8b8a0, { y: 3.3 })); // mane
      parts.push(box(1.0, 0.12, 0.1, 0xc83a28, { y: 2.2, z: 0.45 })); // ribbon

      // Left smaller Wind Lion
      parts.push(box(0.7, 0.3, 0.6, 0x8a7a5a, { x: -2.2, y: 0.35 }));
      parts.push(box(0.6, 1.3, 0.55, 0xe8dcc8, { x: -2.2, y: 1.15 }));
      parts.push(box(0.55, 0.7, 0.5, 0xe8dcc8, { x: -2.2, y: 2.2 }));

      // Right smaller Wind Lion
      parts.push(box(0.7, 0.3, 0.6, 0x8a7a5a, { x: 2.2, y: 0.35 }));
      parts.push(box(0.6, 1.3, 0.55, 0xe8dcc8, { x: 2.2, y: 1.15 }));
      parts.push(box(0.55, 0.7, 0.5, 0xe8dcc8, { x: 2.2, y: 2.2 }));

      // Simple trees (low-segment)
      parts.push(cyl(0.15, 0.2, 1.3, 4, 0x5a4a3a, { x: -2.6, z: 1.5, y: 0.85 }));
      parts.push(cone(0.7, 1.0, 4, 0x5a6a5a, { x: -2.6, z: 1.5, y: 1.9 }));
      parts.push(cyl(0.15, 0.2, 1.3, 4, 0x5a4a3a, { x: 2.6, z: 1.5, y: 0.85 }));
      parts.push(cone(0.7, 1.0, 4, 0x5a6a5a, { x: 2.6, z: 1.5, y: 1.9 }));

      // Incense burner in front
      parts.push(cyl(0.3, 0.35, 0.5, 4, 0x6a5a4a, { z: 1.7, y: 0.45 }));
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
