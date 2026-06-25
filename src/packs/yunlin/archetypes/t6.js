/**
 * @file packs/yunlin/archetypes/t6.js — Roll Formosa Yunlin pack, Tier 6.
 *
 * T6 — 西螺大橋天際線 (Xiluo Bridge skyline). The finale band: the iconic
 * Xiluo Bridge silhouette, rice fields, puppet museum, observation decks
 * and rooftop structures lit against the 雲林夜空 deep blue-violet sky.
 * Ten ArchetypeDefs, authored in the FROZEN tier order (tiers.js T6.archetypeIds)
 * — slots [0..7] absorbable, slots [8..9] repeatable chunk landmarks (lower
 * spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (skyline scale).
 */

import { box, cyl, cone, sph, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 大橋遠景 bridge_silhouette ---------------------------- */
  {
    id: 'bridge_silhouette',
    displayName: '大橋遠景',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb84040, 0xc85050, 0x606070, 0xd0d0d8, 0xffe08a],
    yOffset: -0.56,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      // 西螺大橋 (Xiluo Bridge): iconic red truss bridge (simplified).
      const parts = [
        // bridge deck
        box(8.0, 0.2, 1.2, 0x808088, { y: 1.0 }),
        // roadway surface
        box(7.8, 0.08, 1.0, 0x505058, { y: 1.14 }),
      ];
      // Simplified truss spans
      for (let span = 0; span < 2; span++) {
        const sx = -2.0 + span * 4.0;
        // vertical posts
        parts.push(box(0.12, 1.4, 0.12, 0xb84040, { x: sx - 1.0, y: 1.8, z: 0.5 }));
        parts.push(box(0.12, 1.4, 0.12, 0xb84040, { x: sx + 1.0, y: 1.8, z: 0.5 }));
        // top chord
        parts.push(box(2.2, 0.1, 0.1, 0xc85050, { x: sx, y: 2.5, z: 0.5 }));
        parts.push(box(2.2, 0.1, 0.1, 0xc85050, { x: sx, y: 2.5, z: -0.5 }));
        // cross beam
        parts.push(box(0.1, 0.1, 1.1, 0xb84040, { x: sx, y: 2.5 }));
      }
      // pier columns
      parts.push(cyl(0.2, 0.25, 1.0, 5, 0x707078, { x: -2.0, y: 0.5 }));
      parts.push(cyl(0.2, 0.25, 1.0, 5, 0x707078, { x: 2.0, y: 0.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 稻田 rice_field --------------------------------------- */
  {
    id: 'rice_field',
    displayName: '稻田',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a6a2a, 0x5a7a3a, 0x6a8a4a, 0xa08040, 0x88a8c8],
    yOffset: -0.95,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // 雲林稻田: vast paddy field (simplified).
      const parts = [
        // main paddy field (flat)
        box(6.0, 0.12, 5.0, 0x5a7a3a, { y: 0.06 }),
        // water-filled sections (shimmer)
        box(2.6, 0.04, 2.2, 0x88a8c8, { x: -1.4, y: 0.1, z: -1.2 }),
        box(2.6, 0.04, 2.2, 0x88a8c8, { x: 1.4, y: 0.1, z: 1.2 }),
        // irrigation channel banks
        box(6.2, 0.16, 0.2, 0xa08040, { y: 0.08, z: 0 }),
        // field edge bunds
        box(6.2, 0.2, 0.15, 0x8a7030, { y: 0.1, z: 2.55 }),
        box(6.2, 0.2, 0.15, 0x8a7030, { y: 0.1, z: -2.55 }),
      ];
      // rice plant clusters (reduced)
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          const x = -2.0 + i * 1.3;
          const z = -1.4 + j * 1.4;
          parts.push(box(0.5, 0.25, 0.5, 0x4a6a2a, { x, y: 0.22, z }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 布袋戲館 puppet_museum -------------------------------- */
  {
    id: 'puppet_museum',
    displayName: '布袋戲館',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8b4513, 0xcd853f, 0xdaa520, 0xf5f5dc, 0xb22222],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 雲林布袋戲館: traditional theater-museum with ornate facade.
      const parts = [
        // main building mass
        box(4.0, 3.0, 3.5, 0xffffff, { y: 1.6 }), // hall body (tinted)
        // traditional curved roof
        box(4.4, 0.15, 4.0, 0x8b4513, { y: 3.2, rx: 0.08 }),
        box(4.2, 0.12, 3.8, 0x8b4513, { y: 3.35, rx: -0.05 }),
        // roof ridge ornament
        box(0.3, 0.4, 0.3, 0xdaa520, { y: 3.6, z: 0 }),
        // entrance gate (traditional style)
        box(2.4, 0.2, 0.6, 0xb22222, { y: 2.9, z: 1.8 }),
        cyl(0.15, 0.15, 2.6, 6, 0xb22222, { x: -1.0, y: 1.5, z: 1.8 }),
        cyl(0.15, 0.15, 2.6, 6, 0xb22222, { x: 1.0, y: 1.5, z: 1.8 }),
        // entrance door
        box(1.4, 2.0, 0.1, 0x5d3a1a, { y: 1.1, z: 1.78 }),
        // gold plaque above door
        box(1.8, 0.5, 0.08, 0xdaa520, { y: 2.4, z: 1.82 }),
        box(1.6, 0.4, 0.04, 0xf5f5dc, { y: 2.4, z: 1.85 }), // 布袋戲館 text panel
        // side windows (traditional lattice)
        box(0.8, 1.2, 0.1, 0xcd853f, { x: -1.7, y: 1.5, z: 1.78 }),
        box(0.8, 1.2, 0.1, 0xcd853f, { x: 1.7, y: 1.5, z: 1.78 }),
        // display banner poles
        cyl(0.06, 0.06, 3.2, 5, 0x8b4513, { x: -2.3, y: 1.6, z: 2.0 }),
        cyl(0.06, 0.06, 3.2, 5, 0x8b4513, { x: 2.3, y: 1.6, z: 2.0 }),
        // banner flags
        box(0.5, 1.2, 0.04, 0xb22222, { x: -2.3, y: 2.6, z: 2.0 }),
        box(0.5, 1.2, 0.04, 0xb22222, { x: 2.3, y: 2.6, z: 2.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 雲海觀景台 observation_deck --------------------------- */
  {
    id: 'observation_deck',
    displayName: '雲海觀景台',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x606070, 0x808090, 0xa0a0b0, 0xc0c0d0, 0x88b0d0],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // 古坑雲海觀景台: hillside observation platform with shelter.
      const parts = [
        // elevated platform (hexagonal-ish)
        cyl(2.5, 2.5, 0.3, 8, 0xa0a0b0, { y: 2.0 }),
        // platform support structure (tapered column)
        cyl(0.8, 1.2, 2.0, 6, 0x606070, { y: 1.0 }),
        // railing around platform
        cyl(2.55, 2.55, 0.12, 8, 0x808090, { y: 2.2, open: true }),
        // railing posts
        cyl(0.08, 0.08, 0.5, 5, 0x707080, { x: 2.2, y: 2.35, z: 0 }),
        cyl(0.08, 0.08, 0.5, 5, 0x707080, { x: -2.2, y: 2.35, z: 0 }),
        cyl(0.08, 0.08, 0.5, 5, 0x707080, { x: 0, y: 2.35, z: 2.2 }),
        cyl(0.08, 0.08, 0.5, 5, 0x707080, { x: 0, y: 2.35, z: -2.2 }),
        cyl(0.08, 0.08, 0.5, 5, 0x707080, { x: 1.55, y: 2.35, z: 1.55 }),
        cyl(0.08, 0.08, 0.5, 5, 0x707080, { x: -1.55, y: 2.35, z: 1.55 }),
        // shelter roof (angled canopy)
        box(2.4, 0.1, 1.8, 0xc0c0d0, { y: 3.3, rx: 0.15 }),
        // shelter support posts
        cyl(0.1, 0.1, 1.2, 5, 0x808090, { x: -0.9, y: 2.7, z: 0.6 }),
        cyl(0.1, 0.1, 1.2, 5, 0x808090, { x: 0.9, y: 2.7, z: 0.6 }),
        // viewing telescope
        cyl(0.1, 0.08, 0.5, 6, 0x404050, { x: 1.5, y: 2.45, z: -1.0, rx: 0.4 }),
        // access stairs (simplified)
        box(0.8, 0.4, 2.0, 0x909098, { x: 0, y: 0.2, z: 3.0, rx: -0.3 }),
        // info sign
        box(0.6, 0.8, 0.08, 0x88b0d0, { x: -1.8, y: 2.5, z: 0.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 糖廠煙囪 sugar_factory_stack (舊糖廠遺跡) ------------- */
  {
    id: 'sugar_factory_stack',
    displayName: '糖廠煙囪',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x8a5a30, 0xa06a38, 0xc08048, 0xd8a868, 0x5a4028],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.45,
    buildGeometry(rng) {
      // Historic sugar factory smokestack - iconic industrial heritage in Yunlin
      const parts = [
        // main brick chimney stack (tapered)
        cyl(0.8, 1.2, 6.0, 10, 0xffffff, { y: 3.0, hex2: 0xc08048 }),
        // brick bands / rings (decorative)
        cyl(1.25, 1.25, 0.2, 10, 0x8a5a30, { y: 0.1, open: true }),
        cyl(1.1, 1.1, 0.15, 10, 0x8a5a30, { y: 1.5, open: true }),
        cyl(0.95, 0.95, 0.12, 10, 0x8a5a30, { y: 3.0, open: true }),
        cyl(0.85, 0.85, 0.1, 10, 0x8a5a30, { y: 4.5, open: true }),
        // top crown ring
        cyl(0.82, 0.78, 0.25, 10, 0x5a4028, { y: 6.0 }),
        // lightning rod
        cyl(0.04, 0.04, 0.8, 5, 0x707078, { y: 6.5 }),
        // attached factory building base
        box(2.0, 1.5, 1.8, 0xc8b898, { x: 1.5, y: 0.75 }),
        box(2.1, 0.12, 1.9, 0x8a6a40, { x: 1.5, y: 1.55 }), // roof
        // windows on factory
        box(0.4, 0.5, 0.06, 0x4a5a68, { x: 1.2, y: 0.9, z: 0.92 }),
        box(0.4, 0.5, 0.06, 0x4a5a68, { x: 1.8, y: 0.9, z: 0.92 }),
        // historical plaque
        box(0.6, 0.4, 0.04, 0xf0e0c0, { y: 1.5, z: 1.22 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 高壓電塔 power_pylon ---------------------------------- */
  {
    id: 'power_pylon',
    displayName: '高壓電塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x606068, 0x808088, 0xa0a0a8, 0xc0c0c8, 0x404048],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.4,
    buildGeometry(rng) {
      // 高壓電塔: steel lattice transmission tower (common in rural Yunlin).
      const parts = [
        // main lattice body (tapered tower)
        // base section legs (spread at bottom)
        box(0.15, 4.0, 0.15, 0x707078, { x: -0.8, y: 2.0, z: -0.8, rz: 0.08, rx: -0.08 }),
        box(0.15, 4.0, 0.15, 0x707078, { x: 0.8, y: 2.0, z: -0.8, rz: -0.08, rx: -0.08 }),
        box(0.15, 4.0, 0.15, 0x707078, { x: -0.8, y: 2.0, z: 0.8, rz: 0.08, rx: 0.08 }),
        box(0.15, 4.0, 0.15, 0x707078, { x: 0.8, y: 2.0, z: 0.8, rz: -0.08, rx: 0.08 }),
        // upper section (narrower)
        box(0.12, 3.0, 0.12, 0x808088, { x: -0.35, y: 5.5, z: -0.35 }),
        box(0.12, 3.0, 0.12, 0x808088, { x: 0.35, y: 5.5, z: -0.35 }),
        box(0.12, 3.0, 0.12, 0x808088, { x: -0.35, y: 5.5, z: 0.35 }),
        box(0.12, 3.0, 0.12, 0x808088, { x: 0.35, y: 5.5, z: 0.35 }),
        // horizontal cross braces
        box(1.8, 0.1, 0.1, 0x606068, { y: 2.0 }),
        box(0.1, 0.1, 1.8, 0x606068, { y: 2.0 }),
        box(1.4, 0.1, 0.1, 0x606068, { y: 4.0 }),
        box(0.1, 0.1, 1.4, 0x606068, { y: 4.0 }),
        box(0.9, 0.08, 0.08, 0x606068, { y: 6.0 }),
        box(0.08, 0.08, 0.9, 0x606068, { y: 6.0 }),
        // cross arms for power lines (3 levels)
        box(3.0, 0.12, 0.12, 0xa0a0a8, { y: 5.0 }),
        box(2.4, 0.1, 0.1, 0xa0a0a8, { y: 6.0 }),
        box(1.8, 0.08, 0.08, 0xa0a0a8, { y: 6.8 }),
        // insulators (small discs)
        cyl(0.1, 0.12, 0.15, 5, 0xc0c0c8, { x: -1.3, y: 4.9 }),
        cyl(0.1, 0.12, 0.15, 5, 0xc0c0c8, { x: 1.3, y: 4.9 }),
        cyl(0.1, 0.12, 0.15, 5, 0xc0c0c8, { x: -1.0, y: 5.9 }),
        cyl(0.1, 0.12, 0.15, 5, 0xc0c0c8, { x: 1.0, y: 5.9 }),
        // top finial
        cyl(0.06, 0.06, 0.4, 5, 0x808088, { y: 7.2 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 屋頂機房 rooftop_plant_room --------------------------- */
  {
    id: 'rooftop_plant_room',
    displayName: '屋頂機房',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7280, 0x848c9a, 0xa6aeba, 0xc8ccd2, 0xe0c860],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A capped building top: the plant-room penthouse with cooling towers, ducts and rails.
      const parts = [
        box(2.6, 1.6, 2.0, 0x5a6470, { y: 0.8, hex2: 0x6a7280 }), // truncated building top
        box(2.66, 0.16, 2.06, 0x4a525e, { y: 1.6 }), // roof slab cornice
        box(1.5, 0.9, 1.2, 0xa6aeba, { x: -0.3, y: 2.05, hex2: 0xc8ccd2 }), // plant-room penthouse
        box(0.6, 0.18, 0.4, 0x444a54, { x: -0.3, y: 2.5 }), // penthouse roof hatch
      ];
      // Cooling-tower fans + ducting scattered on the roof.
      parts.push(cyl(0.34, 0.34, 0.5, 8, 0x9aa2ae, { x: 0.85, y: 1.93 })); // cooling tower
      parts.push(cyl(0.34, 0.0, 0.16, 8, 0x7a828e, { x: 0.85, y: 2.26 })); // cooling tower cowl
      parts.push(cyl(0.28, 0.28, 0.46, 8, 0x9aa2ae, { x: 0.85, y: 1.91, z: -0.7 })); // cooling tower 2
      parts.push(box(1.2, 0.18, 0.18, 0x88909c, { x: 0.2, y: 1.78, z: 0.7 })); // duct run
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: 0.95 })); // roof guard rail
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: -0.95 })); // roof guard rail
      return finish(parts);
    },
  },

  /* ---- slot 7: 農田 farmland_block ----------------------------------- */
  {
    id: 'farmland_block',
    displayName: '農田',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a7a3a, 0x7a9a5a, 0xa08040, 0x8a6030, 0xd0c0a0],
    yOffset: -0.93,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // 雲林農田區塊: mixed crop fields with paths and farm structures.
      const parts = [
        // main field area
        box(5.5, 0.1, 5.5, 0x5a7a3a, { y: 0.05 }),
        // divided crop sections (different crops = different greens)
        box(2.4, 0.15, 2.4, 0x6a8a4a, { x: -1.3, y: 0.12, z: -1.3 }),
        box(2.4, 0.18, 2.4, 0x7a9a5a, { x: 1.3, y: 0.14, z: -1.3 }),
        box(2.4, 0.12, 2.4, 0x5a7a3a, { x: -1.3, y: 0.11, z: 1.3 }),
        box(2.4, 0.2, 2.4, 0x4a6a2a, { x: 1.3, y: 0.15, z: 1.3 }),
        // dirt paths between fields
        box(5.6, 0.08, 0.35, 0xa08040, { y: 0.04, z: 0 }),
        box(0.35, 0.08, 5.6, 0xa08040, { x: 0, y: 0.04 }),
        // field edges/bunds
        box(5.7, 0.14, 0.12, 0x8a6030, { y: 0.07, z: 2.8 }),
        box(5.7, 0.14, 0.12, 0x8a6030, { y: 0.07, z: -2.8 }),
        box(0.12, 0.14, 5.6, 0x8a6030, { x: 2.8, y: 0.07 }),
        box(0.12, 0.14, 5.6, 0x8a6030, { x: -2.8, y: 0.07 }),
        // small farm shed
        box(0.8, 0.6, 0.6, 0xd0c0a0, { x: 2.0, y: 0.4, z: 2.0 }),
        box(0.9, 0.1, 0.7, 0x8b4513, { x: 2.0, y: 0.75, z: 2.0 }),
        // water tank
        cyl(0.25, 0.25, 0.5, 6, 0x505860, { x: -2.2, y: 0.35, z: 2.2 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 crossstreet_skybridge ------- */
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
      // two big mixed-use blocks — connecting commercial structures.
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

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop_mech_tower --------- */
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
      // rooftop mech stack that tops service towers.
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
