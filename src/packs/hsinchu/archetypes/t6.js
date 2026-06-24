/**
 * @file packs/hsinchu/archetypes/t6.js — Roll Formosa Hsinchu pack, Tier 6.
 *
 * T6 — 風城天際線 (Wind City skyline). The finale band: glass curtain-wall
 * highrises, wind turbines, tech towers, NTHU/NCTU campus blocks, cross-street
 * skybridges and rooftop mech rooms lit against the 風城 deep blue-violet
 * night. Ten ArchetypeDefs, authored in the FROZEN tier order
 * (tiers.js T6.archetypeIds) — slots [0..7] absorbable, slots [8..9] repeatable
 * chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (Wind City skyscraper scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 玻璃帷幕高樓 glass curtain-wall highrise ----------------- */
  {
    id: 'glass_highrise',
    displayName: '玻璃帷幕高樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2f5478, 0x4a7aa0, 0x6fb0cc, 0x9fd0e4, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Slender all-glass slab with a stepped glass crown and vertical mullion seams.
      return finish([
        towerBanded(0.95, 3.4, 0.95, 12, 0x2a4868, 0x6fb0cc, 0xffe08a, rng, { y: 1.7 }), // glass shaft (風城藍 + lit windows)
        towerBanded(0.78, 0.9, 0.78, 4, 0x32567a, 0x7ab8d4, 0xffe6a0, rng, { y: 3.85 }), // setback crown box
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: 0.5, y: 1.7, z: 0.5 }), // corner mullion glint
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: -0.5, y: 1.7, z: 0.5 }), // corner mullion glint
        cyl(0.05, 0.05, 0.7, 6, 0xd0d6dc, { y: 4.6 }), // rooftop mast
        box(0.4, 0.14, 0.4, 0x556270, { y: 4.32 }), // mast base plinth
      ]);
    },
  },

  /* ---- slot 1: 風力發電機 wind_turbine ---------------------------------- */
  {
    id: 'wind_turbine',
    displayName: '風力發電機',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e8e8, 0xd0d4d8, 0x9aa0a8, 0x3a6ca8, 0xf4f4f4],
    yOffset: -0.27,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // Hsinchu coastal wind turbine: tall white tower with 3-blade rotor.
      // The wind city's signature renewable energy infrastructure.
      const parts = [
        // tower (tapered white cylinder)
        cyl(0.3, 0.5, 5.0, 8, 0xf4f4f4, { y: 2.5 }),
        // nacelle (generator housing at top)
        box(0.8, 0.5, 0.4, 0xd0d4d8, { y: 5.15 }),
        // rotor hub
        cyl(0.2, 0.2, 0.3, 8, 0x9aa0a8, { y: 5.15, z: 0.3, rx: HALF_PI }),
      ];
      // three blades (thin elongated wedges)
      const bladeLen = 2.8;
      const bladeAngles = [0, 2.094, 4.189]; // 0, 120, 240 degrees
      for (const angle of bladeAngles) {
        const bx = Math.sin(angle) * bladeLen / 2;
        const by = Math.cos(angle) * bladeLen / 2;
        parts.push(box(0.12, bladeLen, 0.06, 0xe8e8e8, {
          x: bx, y: 5.15 + by, z: 0.45, rz: -angle,
        }));
      }
      // base foundation ring
      parts.push(cyl(0.7, 0.7, 0.2, 8, 0x9aa0a8, { y: 0.1 }));
      // aircraft warning light
      parts.push(sph(0.08, 0xff4040, { ws: 6, hs: 4, y: 5.45 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 竹科研發大樓 HSIP R&D building ------------------------- */
  {
    id: 'hsip_rd_building',
    displayName: '竹科研發大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a5a78, 0x5a7a98, 0x8ab0c8, 0xc8d8e0, 0x3a8ac0, 0xffd884],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Hsinchu Science Park R&D building: distinctive tech campus architecture
      // with horizontal blue accent bands and clean-room style
      const parts = [
        // wide tech campus podium
        box(2.6, 0.6, 1.6, 0xc8d0d8, { y: 0.3 }),
        box(2.7, 0.15, 1.7, 0x3a8ac0, { y: 0.65 }), // blue tech band (竹科藍)
        // main tower with horizontal sunshade fins
        towerBanded(1.8, 2.4, 1.2, 8, 0x3a5a78, 0x8ab0c8, 0xffd884, rng, { y: 2.0 }),
        // horizontal sunshade louvers (竹科建築特色)
        box(1.9, 0.06, 1.24, 0x7a9ab0, { y: 1.4 }),
        box(1.9, 0.06, 1.24, 0x7a9ab0, { y: 2.0 }),
        box(1.9, 0.06, 1.24, 0x7a9ab0, { y: 2.6 }),
        box(1.9, 0.06, 1.24, 0x7a9ab0, { y: 3.2 }),
        // second setback tower
        towerBanded(1.2, 1.4, 0.9, 5, 0x4a6a88, 0x9ac0d0, 0xffe0a0, rng, { y: 4.0 }),
        // roof with blue accent
        box(1.3, 0.15, 1.0, 0x3a8ac0, { y: 4.75 }), // blue roof band
        box(0.8, 0.3, 0.6, 0x8a9aa8, { x: 0.2, y: 5.0 }), // rooftop mech unit
        // company sign pylon
        box(0.3, 0.5, 0.1, 0x3a8ac0, { x: -0.8, y: 3.5, z: 0.62 }),
      ];
      // vertical mullion accents
      parts.push(box(0.06, 2.6, 0.06, 0x5a7a98, { x: -0.88, y: 2.1, z: 0.62 }));
      parts.push(box(0.06, 2.6, 0.06, 0x5a7a98, { x: 0.88, y: 2.1, z: 0.62 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 竹科公司門牌 tech campus entrance sign ------------------ */
  {
    id: 'tech_campus_sign',
    displayName: '竹科公司門牌',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd0d4dc, 0xe8ecf0, 0x3a8ac0, 0x2a6a90, 0xffffff],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Hsinchu Science Park company entrance sign (竹科公司門牌)
      // Clean modern corporate entrance with blue accent branding
      const parts = [
        // low-rise entrance gatehouse
        box(2.8, 1.8, 1.2, 0xe8ecf0, { y: 0.9, hex2: 0xd0d4dc }), // clean white building
        // blue horizontal accent band (竹科藍企業識別)
        box(2.9, 0.25, 1.25, 0x3a8ac0, { y: 1.85 }),
        // glass entrance wall
        box(2.6, 1.4, 0.06, 0x8ab8d0, { y: 0.75, z: 0.62 }),
        box(2.6, 0.08, 0.07, 0x6a98b0, { y: 1.48, z: 0.64 }), // mullion
        // automatic door
        box(0.9, 1.2, 0.05, 0x7ab0c8, { x: 0, y: 0.65, z: 0.64 }),
        // company name sign pylon (tall vertical sign)
        box(0.4, 2.8, 0.3, 0xd0d4dc, { x: -1.8, y: 1.4 }),
        box(0.35, 2.4, 0.08, 0x3a8ac0, { x: -1.8, y: 1.5, z: 0.16 }), // blue logo panel
        box(0.28, 1.8, 0.05, 0xffffff, { x: -1.8, y: 1.5, z: 0.2 }), // white company name area
        // horizontal company sign bar
        box(1.8, 0.45, 0.1, 0x3a8ac0, { x: 0.5, y: 2.25, z: 0.65 }), // blue sign
        box(1.6, 0.32, 0.06, 0xffffff, { x: 0.5, y: 2.25, z: 0.7 }), // white text area
        // security booth
        box(0.8, 1.4, 0.8, 0xd8dce2, { x: 1.6, y: 0.7 }),
        box(0.7, 0.5, 0.06, 0x8ab8d0, { x: 1.6, y: 0.85, z: 0.42 }), // booth window
        // parking lot barrier arm
        cyl(0.06, 0.06, 0.8, 6, 0xc83020, { x: 1.0, y: 0.6, z: 1.0, rz: 0.3 }),
        // landscaping planters
        box(0.6, 0.3, 0.6, 0x6a8050, { x: -0.8, y: 0.15, z: 0.8 }),
        box(0.6, 0.3, 0.6, 0x6a8050, { x: 0.8, y: 0.15, z: 0.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 科技塔 tech_tower ---------------------------------------- */
  {
    id: 'tech_tower',
    displayName: '科技塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x3c5e74, 0x6a9ab0, 0xa8d2e0, 0xe6f1f4, 0x3a8ac0, 0xffe6a0],
    yOffset: -0.19,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // TSMC / tech company tower: sleek glass slab with blue tech branding,
      // Hsinchu Science Park corporate headquarters style.
      const parts = [
        // podium with blue accent
        box(2.4, 0.7, 1.8, 0xb8c2cc, { y: 0.35, hex2: 0xc8d2dc }),
        box(2.5, 0.2, 1.9, 0x3a8ac0, { y: 0.75 }), // blue accent band
        // main glass slab
        towerBanded(1.9, 3.2, 1.2, 10, 0x3c5e74, 0xa8d2e0, 0xffe6a0, rng, { y: 2.5 }),
        // horizontal sunshade bands
        box(2.0, 0.08, 1.26, 0x7a9ab0, { y: 1.6 }),
        box(2.0, 0.08, 1.26, 0x7a9ab0, { y: 2.8 }),
        box(2.0, 0.08, 1.26, 0x7a9ab0, { y: 3.6 }),
        // rooftop cap with antenna
        box(1.5, 0.22, 0.9, 0xe6f1f4, { y: 4.2 }),
        box(0.7, 0.3, 0.5, 0x8a9ea8, { x: 0.3, y: 4.45 }), // rooftop unit
        cyl(0.04, 0.04, 0.8, 6, 0xd0d4dc, { y: 4.9 }), // antenna
      ];
      // company logo / sign on front
      parts.push(box(1.0, 0.4, 0.06, 0x3a8ac0, { y: 3.4, z: 0.64 }));
      return finish(parts);
    },
  },

  /* ---- slot 5: 空橋 sky_bridge ------------------------------------------ */
  {
    id: 'sky_bridge',
    displayName: '空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 85,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a6a8a, 0x6a96b8, 0xa0d0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.427,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Two podium towers joined high up by a glazed enclosed pedestrian sky bridge.
      return finish([
        towerBanded(0.9, 2.6, 0.9, 8, 0x3c5876, 0x6a96b8, 0xffe0a0, rng, { x: -1.5, y: 1.3 }), // tower A
        towerBanded(0.9, 2.4, 0.9, 8, 0x3c5876, 0x6a96b8, 0xffe0a0, rng, { x: 1.5, y: 1.2 }), // tower B
        box(2.2, 0.5, 0.6, 0xa0d0e4, { y: 2.0, hex2: 0xc8e4f0 }), // glazed sky bridge tube
        box(2.2, 0.05, 0.62, 0x88a0b4, { y: 2.26 }), // bridge roof cap
        box(2.2, 0.05, 0.62, 0x88a0b4, { y: 1.74 }), // bridge floor slab
        box(0.5, 0.2, 0.5, 0x7a8492, { x: -1.5, y: 2.7 }), // tower A roof unit
        box(0.5, 0.2, 0.5, 0x7a8492, { x: 1.5, y: 2.5 }), // tower B roof unit
      ]);
    },
  },

  /* ---- slot 6: 屋頂機房 rooftop plant room ---------------------------- */
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

  /* ---- slot 7: 清交大樓 campus_block ---------------------------------- */
  {
    id: 'campus_block',
    displayName: '清交大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a7a68, 0xa69888, 0xc8b8a8, 0xe0d4c8, 0x4a8050, 0xffd884],
    yOffset: -0.308,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // NTHU / NCTU campus building block: brick/concrete academic buildings
      // with a tree-lined quad, the iconic Hsinchu university architecture.
      const parts = [
        // campus quad / ground
        box(3.6, 0.16, 1.8, 0x6a8048, { y: 0.08 }), // grassy quad
      ];
      // main academic building (long H-shaped block)
      parts.push(box(2.0, 2.2, 1.4, 0x8a7a68, { x: -0.6, y: 1.2, hex2: 0xa69888 })); // west wing
      parts.push(box(2.0, 2.4, 1.4, 0x8a7a68, { x: 0.9, y: 1.3, hex2: 0xa69888 })); // east wing
      parts.push(box(1.4, 1.8, 0.6, 0x9a8a78, { y: 1.0, z: -0.4 })); // connecting corridor
      // rooftop details
      parts.push(box(2.1, 0.2, 1.45, 0x7a6a58, { x: -0.6, y: 2.35 })); // west wing cornice
      parts.push(box(2.1, 0.2, 1.45, 0x7a6a58, { x: 0.9, y: 2.55 })); // east wing cornice
      // windows (lit classrooms / labs)
      for (let i = 0; i < 4; i++) {
        const lit = rng() < 0.5 ? 0xfff0c0 : 0x5a6670;
        parts.push(box(0.35, 0.5, 0.05, lit, { x: -1.3 + i * 0.4, y: 1.5, z: 0.72 }));
        parts.push(box(0.35, 0.5, 0.05, lit, { x: 0.4 + i * 0.4, y: 1.6, z: 0.72 }));
      }
      // campus trees (simple green cones)
      for (const tx of [-1.5, 0.0, 1.4]) {
        parts.push(cyl(0.04, 0.04, 0.4, 6, 0x5a4a3a, { x: tx, y: 0.36, z: 0.6 })); // trunk
        parts.push(cone(0.25, 0.5, 6, 0x4a8050, { x: tx, y: 0.76, z: 0.6 })); // canopy
      }
      // clock tower or bell tower accent
      parts.push(box(0.3, 0.8, 0.3, 0xc8b8a8, { x: -0.6, y: 2.85 }));
      parts.push(cone(0.2, 0.3, 4, 0x8a7a68, { x: -0.6, y: 3.4 }));
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 crossstreet_skybridge -------- */
  {
    id: 'crossstreet_skybridge',
    displayName: '跨街空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x33526e, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Monumental: a wide multi-level glazed skybridge spanning a street between
      // two big 風城 mixed-use blocks — the signature air-corridor.
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
    palette: [0x42505e, 0x646c7a, 0x8a92a0, 0xb8bcc6, 0xe0c860],
    yOffset: -0.044,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A tall tower crowned by a dense mechanical/antenna mast head — the kind of
      // rooftop mech stack that tops 風城's tallest service towers.
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
