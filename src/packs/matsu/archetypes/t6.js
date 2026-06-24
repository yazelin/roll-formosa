/**
 * @file packs/matsu/archetypes/t6.js — Roll Formosa Matsu pack, TIER 6
 * content: 藍眼淚海岸天際線 (Blue Tears coastal skyline).
 *
 * T6 — The finale band: lighthouses, sea caves, coastal cliffs, the giant
 * Beihai Tunnel mouth, and viewing platforms for the famous blue tears
 * bioluminescence. Ten ArchetypeDefs, authored in the FROZEN tier order
 * (tiers.js T6.archetypeIds) — slots [0..7] absorbable, slots [8..9]
 * repeatable chunk landmarks (lower spawnWeight).
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
  /* ---- slot 0: 燈塔 (lighthouse) --------------------------------------- */
  {
    id: 'lighthouse',
    displayName: '燈塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0f0e8, 0xe0e0d8, 0x3a4a5a, 0xc83828, 0xffd860],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Matsu lighthouse: white cylindrical tower with red band and lantern room
      const parts = [
        // stone base platform
        cyl(1.4, 1.5, 0.5, 6, 0x8a9088, { y: 0.25 }),
        // main tower shaft (tapered, white)
        cyl(1.0, 0.75, 4.5, 6, 0xf0f0e8, { y: 2.75 }),
        // red horizontal band
        cyl(0.82, 0.80, 0.4, 6, 0xc83828, { y: 3.2 }),
        // gallery deck (observation ring)
        cyl(1.0, 1.0, 0.15, 6, 0xe0e0d8, { y: 5.05 }),
      ];
      // fewer railing posts (4 instead of 8)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        parts.push(cyl(0.04, 0.04, 0.3, 4, 0x3a4a5a, {
          x: Math.cos(a) * 0.9, z: Math.sin(a) * 0.9, y: 5.25
        }));
      }
      // lantern room (glass enclosure)
      parts.push(cyl(0.65, 0.65, 0.9, 6, 0x9fd0e4, { y: 5.6 })); // glass (blue tint)
      // lantern room roof
      parts.push(cone(0.75, 0.6, 6, 0xe0e0d8, { y: 6.35 }));
      // vent ball on top
      parts.push(sph(0.15, 0x3a4a5a, { ws: 4, hs: 3, y: 6.75 }));
      // light glow (simplified)
      parts.push(sph(0.35, 0xffd860, { ws: 4, hs: 3, y: 5.6 })); // warm light
      // keeper's house at base
      parts.push(box(1.6, 0.8, 1.2, 0xf0f0e8, { x: 2.0, y: 0.4 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 巨岩 (giant rock) --------------------------------------- */
  {
    id: 'giant_rock',
    displayName: '巨岩',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.20,
    spawnWeight: 1.0,
    palette: [0x6a7068, 0x5a6058, 0x7a8078, 0x4a5048, 0x8a9088],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Giant coastal granite rock/boulder formation
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

  /* ---- slot 2: 海蝕洞 (sea cave) --------------------------------------- */
  {
    id: 'sea_cave',
    displayName: '海蝕洞',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7068, 0x5a6058, 0x1a2a3a, 0x8a9088, 0x3a5a7a],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Sea cave in coastal rock formation
      const parts = [
        // main cliff/rock mass
        box(4.0, 3.2, 3.0, 0x6a7068, { y: 1.6 }),
        // upper rock mass
        box(3.6, 1.8, 2.6, 0x5a6058, { y: 3.5, rz: 0.08 }),
        // cave opening (arched, dark interior)
        cyl(1.4, 1.4, 1.2, 8, 0x8a9088, { y: 1.4, z: 1.55, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        // dark cave interior
        cyl(1.2, 1.2, 1.6, 8, 0x1a2a3a, { y: 1.4, z: 1.45, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        box(2.4, 1.4, 1.0, 0x1a2a3a, { y: 0.7, z: 1.45 }), // lower cave dark
        // rock ledges around cave
        box(3.0, 0.3, 0.6, 0x7a8078, { y: 2.6, z: 1.5 }),
        box(0.6, 2.4, 0.5, 0x7a8078, { x: -1.6, y: 1.2, z: 1.45 }),
        box(0.6, 2.4, 0.5, 0x7a8078, { x: 1.6, y: 1.2, z: 1.45 }),
        // tide pool water hint at cave entrance
        box(2.0, 0.1, 0.8, 0x3a5a7a, { y: 0.08, z: 1.8 }),
        // boulders at base
        box(1.0, 0.6, 0.8, 0x5a6058, { x: 2.2, y: 0.3, z: 0.8 }),
        box(0.8, 0.5, 0.7, 0x6a7068, { x: -2.0, y: 0.25, z: 1.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 海崖 (sea cliff) ---------------------------------------- */
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
      // Dramatic sea cliff face
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

  /* ---- slot 4: 藍眼淚觀景台 (blue tears viewing platform) -------------- */
  {
    id: 'blue_tears_platform',
    displayName: '藍眼淚觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 100,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a9098, 0x6a7078, 0x5a6068, 0x2a5a9a, 0xd8dce0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Viewing platform for watching blue tears bioluminescence
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
        // blue accent light strips (for night viewing)
        box(3.8, 0.04, 0.1, 0x2a5a9a, { y: 1.4, z: 1.35 }),
        // water below hint
        box(4.5, 0.08, 3.0, 0x2a4a6a, { y: 0.04 }),
      ];
      // railing posts
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.06, 0.5, 0.06, 0x5a6068, { x: -2.0 + i * 1.0, y: 1.75, z: 1.4 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 巨型坑道口 (giant tunnel mouth - like Beihai Tunnel) ---- */
  {
    id: 'giant_tunnel_mouth',
    displayName: '巨型坑道口',
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
      // Large tunnel entrance carved into cliff (like Beihai Tunnel entrance)
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
        // water channel inside hint
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

  /* ---- slot 6: 北竿機場塔 (Beigan airport tower) ----------------------- */
  {
    id: 'airport_tower',
    displayName: '北竿機場塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 90,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8dce0, 0xc8ccd0, 0x3a4a5a, 0x2a7a4a, 0xffd060],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Airport control tower (Beigan Airport)
      const parts = [
        // base building
        box(2.4, 1.2, 2.0, 0xd8dce0, { y: 0.6 }),
        box(2.5, 0.1, 2.1, 0xc8ccd0, { y: 0.05 }), // foundation
        // tower shaft
        box(1.2, 4.0, 1.2, 0xd8dce0, { y: 3.2 }),
        // control cab (octagonal approximated with boxes)
        box(2.0, 1.2, 2.0, 0x3a4a5a, { y: 5.8 }), // dark cab body
        // cab windows all around
        box(1.8, 0.8, 0.08, 0x6aa8c8, { y: 5.9, z: 1.0 }), // front glass
        box(1.8, 0.8, 0.08, 0x6aa8c8, { y: 5.9, z: -1.0 }), // back glass
        box(0.08, 0.8, 1.8, 0x6aa8c8, { y: 5.9, x: 1.0 }), // side glass
        box(0.08, 0.8, 1.8, 0x6aa8c8, { y: 5.9, x: -1.0 }), // side glass
        // cab roof
        box(2.2, 0.15, 2.2, 0xc8ccd0, { y: 6.48 }),
        // observation deck below cab
        box(2.4, 0.12, 2.4, 0xc8ccd0, { y: 5.15 }),
        // antenna mast
        cyl(0.08, 0.06, 1.5, 6, 0x8a9098, { y: 7.25 }),
        // warning light
        sph(0.12, 0xffd060, { ws: 6, hs: 4, y: 8.0 }),
        // radar dish
        cyl(0.5, 0.5, 0.08, 8, 0xc8ccd0, { x: 0.6, y: 6.7, rz: 0.5 }),
        // green accent band
        box(2.5, 0.15, 2.1, 0x2a7a4a, { y: 1.2 }),
        box(1.3, 0.1, 1.3, 0x2a7a4a, { y: 5.2 }),
      ];
      // entrance
      parts.push(box(0.7, 1.0, 0.08, 0x4a5a6a, { y: 0.55, z: 1.02 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 海岸大石 (coastal boulder) ------------------------------ */
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

  /* ---- slot 8: 海岸觀景台 (chunk landmark - coastal viewpoint) --------- */
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
      // Large coastal viewing platform complex on cliff edge - simplified
      const parts = [
        // cliff base
        box(6.0, 2.5, 4.0, 0x6a7068, { y: 1.25 }),
        // main platform
        box(5.0, 0.3, 3.5, 0x8a9098, { y: 2.8 }),
        // elevated viewing deck
        box(3.0, 0.25, 2.5, 0x8a9098, { x: 0.5, y: 4.0 }),
        // support pillars for upper deck (reduced from 4 to 2 + fewer segments)
        cyl(0.25, 0.3, 1.0, 4, 0x6a7078, { x: -0.8, z: 0.0, y: 3.4 }),
        cyl(0.25, 0.3, 1.0, 4, 0x6a7078, { x: 1.8, z: 0.0, y: 3.4 }),
        // safety railing - single rail
        box(3.1, 0.08, 0.06, 0x5a6068, { x: 0.5, y: 4.4, z: 1.3 }),
        // shelter/pavilion roof
        box(2.0, 0.12, 2.0, 0xd8dce0, { x: -1.8, y: 4.5 }),
      ];
      // shelter posts (reduced from 4 to 2 + fewer segments)
      parts.push(cyl(0.12, 0.12, 1.5, 4, 0x6a7078, { x: -2.5, z: 0.4, y: 3.65 }));
      parts.push(cyl(0.12, 0.12, 1.5, 4, 0x6a7078, { x: -1.1, z: 0.4, y: 3.65 }));
      // stairs going down (reduced from 5 to 3)
      for (let i = 0; i < 3; i++) {
        parts.push(box(1.5, 0.12, 0.4, 0x8a9098, { x: 2.6, y: 2.6 - i * 0.4, z: -1.5 - i * 0.4 }));
      }
      // water below
      parts.push(box(7.0, 0.1, 5.0, 0x3a5a7a, { y: 0.05 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 巨岩群 (chunk landmark - rock formation) ---------------- */
  {
    id: 'rock_formation',
    displayName: '巨岩群',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0x6a7068, 0x5a6058, 0x7a8078, 0x4a5048, 0x3a5a7a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Dramatic coastal rock formation (multiple large rocks)
      const parts = [
        // main central rock spire
        box(2.0, 4.5, 2.0, 0x6a7068, { y: 2.25 }),
        box(1.6, 1.5, 1.6, 0x5a6058, { y: 5.0, rz: 0.1 }),
        // second large rock
        box(2.4, 3.2, 2.2, 0x7a8078, { x: 2.8, y: 1.6, rz: -0.08 }),
        box(1.8, 1.2, 1.6, 0x6a7068, { x: 2.8, y: 3.5 }),
        // third rock
        box(2.0, 2.8, 1.8, 0x5a6058, { x: -2.5, y: 1.4, rz: 0.12 }),
        // connecting base rocks
        box(8.0, 1.0, 4.0, 0x6a7068, { y: 0.5 }),
        box(6.0, 0.6, 3.0, 0x5a6058, { y: 1.3 }),
        // smaller rocks scattered
        box(1.4, 1.6, 1.3, 0x7a8078, { x: -1.0, z: 1.8, y: 0.8, rz: 0.15 }),
        box(1.2, 1.2, 1.1, 0x6a7068, { x: 1.5, z: -1.5, y: 0.6, rz: -0.1 }),
        box(1.0, 0.8, 0.9, 0x5a6058, { x: -3.2, z: 1.2, y: 0.4 }),
        // water around formation
        box(9.0, 0.12, 5.0, 0x3a5a7a, { y: 0.06 }),
        // wave splash zones
        box(0.8, 0.15, 0.4, 0x8ac8e8, { x: 0, z: 2.2, y: 0.5 }),
        box(0.6, 0.12, 0.35, 0x8ac8e8, { x: 3.2, z: 1.8, y: 0.45 }),
        // erosion lines on rocks
        box(1.8, 0.05, 1.8, 0x8a9088, { y: 1.5 }),
        box(2.2, 0.05, 2.0, 0x8a9088, { x: 2.8, y: 1.2 }),
      ];
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
