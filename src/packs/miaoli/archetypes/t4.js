/**
 * @file packs/miaoli/archetypes/t4.js — Roll Formosa Miaoli pack, TIER 4
 * content: 客庄街屋與廟 (Hakka village shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/miaoli/tiers.js TIERS[4].archetypeIds — slots [0..7]
 * absorbable street structures (spawnWeight 1.0), slots [8..9] repeatable
 * CHUNK LANDMARK masses (spawnWeight ~0.3, ~2.5–3x the tier's largest body).
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored BufferGeometry
 * (<= 350 tris) composed of low-segment primitives from geomHelpers.js, then
 * finish()-normalized to a UNIT bounding sphere (radius 1.0). rng() drives
 * only small per-instance variation (lit windows), never structure.
 *
 * yOffset = -1 - minY(normalized geo) so each building sits on the ground;
 * measured/rounded per id (all sit, so all are strongly negative).
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T4_ARCHETYPES = [
  /* ---- slot 0: 客家老屋 (traditional Hakka old house, 2-storey) -------- */
  {
    id: 'hakka_old_house',
    displayName: '客家老屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xe6d4b8, 0x8a7a5a, 0x6a4a32, 0xf0e8d8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional 2-storey Hakka old house (客家老屋) — earth-tone walls,
      // dark wood trim, traditional tile roof. Common in 南庄/三義 old streets.
      const parts = [
        // main house body (earth-tone plaster)
        box(2.0, 1.8, 1.5, 0xffffff, { y: 0.9, hex2: 0xf0e8d8 }),
        // dark wood beam trim
        box(2.1, 0.1, 0.1, 0x5a3a2a, { y: 0.2, z: 0.76 }),
        box(2.1, 0.1, 0.1, 0x5a3a2a, { y: 1.0, z: 0.76 }),
        box(2.1, 0.1, 0.1, 0x5a3a2a, { y: 1.75, z: 0.76 }),
        // vertical wood posts
        box(0.12, 1.8, 0.12, 0x6a4a32, { x: -0.9, y: 0.9, z: 0.72 }),
        box(0.12, 1.8, 0.12, 0x6a4a32, { x: 0.9, y: 0.9, z: 0.72 }),
        box(0.12, 1.8, 0.12, 0x6a4a32, { x: 0, y: 0.9, z: 0.72 }),
        // hip tile roof
        cyl(1.2, 1.2, 2.3, 4, 0x7a5a40, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 2.1 }),
        box(2.3, 0.12, 0.15, 0x6a4a32, { y: 2.38 }), // ridge
        // traditional windows (lattice style)
        box(0.55, 0.5, 0.08, 0xe8e0d0, { x: -0.5, y: 1.3, z: 0.78 }),
        box(0.55, 0.5, 0.08, 0xe8e0d0, { x: 0.5, y: 1.3, z: 0.78 }),
        // dark wood lattice bars on windows
        box(0.06, 0.5, 0.04, 0x5a3a2a, { x: -0.5, y: 1.3, z: 0.82 }),
        box(0.06, 0.5, 0.04, 0x5a3a2a, { x: 0.5, y: 1.3, z: 0.82 }),
        // entrance door
        box(0.6, 1.0, 0.08, 0x5a3a2a, { y: 0.5, z: 0.78 }),
        // 客家花布 awning
        box(2.1, 0.06, 0.4, 0x4a6a9a, { y: 1.85, z: 0.92 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 茶廠寮 (tea processing shed — Miaoli tea industry) ------ */
  {
    id: 'tea_processing_shed',
    displayName: '茶廠寮',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0x6a4a2a, 0x4a7a3a, 0x9aa0aa, 0xc8b890],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Tea processing shed (茶廠寮) — traditional open-sided structure for
      // drying and processing tea leaves, common in Miaoli's tea-growing areas.
      const parts = [
        // wood frame structure (open sided)
        box(2.5, 0.15, 1.6, 0x9a7a4a, { y: 0.08 }), // floor platform
        // corner posts
        cyl(0.1, 0.12, 1.8, 6, 0x6a4a2a, { x: -1.1, y: 0.9, z: 0.7 }),
        cyl(0.1, 0.12, 1.8, 6, 0x6a4a2a, { x: 1.1, y: 0.9, z: 0.7 }),
        cyl(0.1, 0.12, 1.8, 6, 0x6a4a2a, { x: -1.1, y: 0.9, z: -0.7 }),
        cyl(0.1, 0.12, 1.8, 6, 0x6a4a2a, { x: 1.1, y: 0.9, z: -0.7 }),
        // beam structure
        box(2.4, 0.1, 0.1, 0x5a3a1a, { y: 1.8, z: 0.7 }),
        box(2.4, 0.1, 0.1, 0x5a3a1a, { y: 1.8, z: -0.7 }),
        box(0.1, 0.1, 1.5, 0x5a3a1a, { x: -1.1, y: 1.8 }),
        box(0.1, 0.1, 1.5, 0x5a3a1a, { x: 1.1, y: 1.8 }),
        // sloped roof (thatched/tin style)
        box(2.8, 0.12, 1.9, 0xc8b890, { y: 2.1, rx: -0.15, hex2: 0xb8a880 }),
        // tea drying racks inside
        box(2.0, 0.08, 1.2, 0xc8a870, { y: 0.4 }),
        box(2.0, 0.08, 1.2, 0xc8a870, { y: 0.8 }),
        // tea leaves on racks (green)
        box(1.8, 0.05, 1.0, 0x4a7a3a, { y: 0.45 }),
        // woven baskets with tea
        cyl(0.3, 0.25, 0.25, 6, 0x9a7a4a, { x: -0.8, y: 0.28, z: 0.0 }),
        cyl(0.3, 0.25, 0.25, 6, 0x9a7a4a, { x: 0.8, y: 0.28, z: 0.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 客家夥房 (Hakka traditional house with courtyard) ------- */
  {
    id: 'hakka_house',
    displayName: '客家夥房',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xe6d4b8, 0x8a7a5a, 0xb04030, 0x4a6a4a],
    yOffset: -0.50,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Hakka compound house (夥房屋) — U-shaped with central hall
      const parts = [
        // raised platform base (夯土台基)
        box(4.6, 0.3, 3.0, 0xa09080, { y: 0.15 }),
        // main hall (正廳) at center — taller
        box(1.8, 1.6, 1.8, 0xffffff, { y: 0.95, hex2: 0xf0e8d8 }),
        // left wing (橫屋)
        box(1.2, 1.2, 1.6, 0xffffff, { x: -1.6, y: 0.75, hex2: 0xf0e8d8 }),
        // right wing (橫屋)
        box(1.2, 1.2, 1.6, 0xffffff, { x: 1.6, y: 0.75, hex2: 0xf0e8d8 }),
        // sweeping hip roof on main hall (燕尾脊 style)
        cyl(1.2, 1.2, 2.0, 4, 0x6a4a32, { theta0: PI, rx: HALF_PI, sy: 0.45, y: 1.9 }),
        box(2.2, 0.14, 0.2, 0xb04030, { y: 2.28 }), // ridge beam (red tile)
        // wing roofs (simpler slopes)
        box(1.4, 0.1, 1.8, 0x7a5a40, { x: -1.6, rz: 0.15, y: 1.5 }),
        box(1.4, 0.1, 1.8, 0x7a5a40, { x: 1.6, rz: -0.15, y: 1.5 }),
        // front courtyard (禾埕) with flagstones
        box(3.8, 0.08, 1.2, 0xb0a890, { y: 0.04, z: 2.0 }),
        // main entrance door (dark wood)
        box(0.8, 1.1, 0.08, 0x5a3a2a, { y: 0.7, z: 0.92 }),
        // door frame + lintel (red)
        box(1.0, 0.16, 0.1, 0xb04030, { y: 1.32, z: 0.92 }),
        // side doors on wings
        box(0.5, 0.8, 0.06, 0x6a4a38, { x: -1.6, y: 0.55, z: 0.82 }),
        box(0.5, 0.8, 0.06, 0x6a4a38, { x: 1.6, y: 0.55, z: 0.82 }),
        // 客家花布 awning strips (blue checkered cloth)
        box(1.4, 0.06, 0.4, 0x4a6a9a, { y: 1.4, z: 1.05 }),
      ];
      // lattice windows on wings
      for (const sx of [-1.6, 1.6]) {
        parts.push(box(0.3, 0.35, 0.06, 0xe8e0d0, { x: sx, y: 0.9, z: 0.82 }));
        parts.push(box(0.04, 0.35, 0.04, 0x5a4030, { x: sx - 0.1, y: 0.9, z: 0.86 })); // lattice bar
        parts.push(box(0.04, 0.35, 0.04, 0x5a4030, { x: sx + 0.1, y: 0.9, z: 0.86 })); // lattice bar
      }
      return finish(parts);
    },
  },

  /* ---- slot 3: 客家米店 (Hakka rice shop) ------------------------------ */
  {
    id: 'hakka_rice_shop',
    displayName: '客家米店',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xe6d4b8, 0x8a7a5a, 0xf4e8d0, 0xa09070],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Traditional Hakka rice shop — low-rise shophouse with rice sacks
      // displayed outside, wooden signage with Chinese characters.
      const parts = [
        // main shop building (earth-tone walls)
        box(2.6, 1.2, 1.5, 0xffffff, { y: 0.6, hex2: 0xf0e8d8 }),
        // dark wood trim beams (horizontal)
        box(2.7, 0.12, 0.08, 0x5a4a3a, { y: 0.18, z: 0.76 }),
        box(2.7, 0.12, 0.08, 0x5a4a3a, { y: 1.18, z: 0.76 }),
        // sloped tile roof
        box(2.8, 0.12, 0.9, 0x7a5a40, { y: 1.35, z: 0.4, rx: -0.15 }),
        box(2.8, 0.12, 0.9, 0x7a5a40, { y: 1.35, z: -0.4, rx: 0.15 }),
        // wooden signboard
        box(1.6, 0.5, 0.1, 0x6a4a2a, { y: 1.1, z: 0.82 }),
        box(1.4, 0.35, 0.04, 0xf4e8c8, { y: 1.1, z: 0.88 }), // text area
        // open shop front with display
        box(2.2, 0.8, 0.06, 0x2a2a2e, { y: 0.5, z: 0.76 }), // dark interior
        // rice sacks displayed in front (burlap bags)
        box(0.5, 0.35, 0.4, 0xc8b8a0, { x: -0.8, y: 0.18, z: 0.95 }),
        box(0.5, 0.35, 0.4, 0xe6d4b8, { x: -0.3, y: 0.18, z: 0.95 }),
        box(0.5, 0.35, 0.4, 0xd8c8b0, { x: 0.2, y: 0.18, z: 0.95 }),
        // stacked rice sacks
        box(0.45, 0.3, 0.35, 0xb8a890, { x: -0.55, y: 0.48, z: 0.95 }),
        // weighing scale
        box(0.3, 0.05, 0.3, 0x8a8a8a, { x: 0.75, y: 0.2, z: 0.9 }),
        cyl(0.04, 0.04, 0.3, 5, 0x6a6a6a, { x: 0.75, y: 0.38, z: 0.9 }),
        // awning support posts
        cyl(0.08, 0.08, 1.0, 6, 0x5a4a3a, { x: -1.2, y: 0.5, z: 0.9 }),
        cyl(0.08, 0.08, 1.0, 6, 0x5a4a3a, { x: 1.2, y: 0.5, z: 0.9 }),
        // cloth awning
        box(2.6, 0.08, 0.6, 0x4a6a9a, { y: 1.02, z: 1.05 }), // Hakka blue cloth
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 公車 (city bus) ---------------------------------------- */
  {
    id: 'city_bus',
    displayName: '公車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe8e8e2, 0x3a6ea0, 0xc94f46, 0xe0a83a, 0x8a9098],
    yOffset: -0.63,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        box(3.6, 1.0, 1.2, 0xffffff, { y: 0.95 }), // long bus body (tinted)
        box(3.64, 0.18, 1.22, 0x3a6ea0, { y: 0.5 }), // lower livery band
        box(3.5, 0.34, 1.24, 0x28323e, { y: 1.18 }), // continuous window band (dark)
        box(3.4, 0.06, 1.1, 0xd2d6dc, { y: 1.5 }), // roof
        box(1.0, 0.18, 1.14, 0xe0a83a, { x: 1.4, y: 1.46 }), // roof route-number sign
        box(3.66, 0.5, 0.04, 0xffffff, { z: 0.64, y: 0.95, hex2: 0xeef2f6 }), // side panel sheen
        // windshield + headlights front
        box(0.06, 0.4, 1.18, 0x35414e, { x: 1.83, y: 1.16 }), // windshield
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: 0.42 }), // headlight R
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: -0.42 }), // headlight L
        box(0.05, 0.7, 0.5, 0x35414e, { x: -1.55, y: 0.9, z: 0.5 }), // folding door (rear)
        box(0.05, 0.55, 0.06, 0xc94f46, { x: 0.2, y: 0.5 }), // hot-red accent stripe
      ];
      // 6 wheels (front pair + dual rear), low-seg tires for tri budget
      const wx = [1.4, 1.4, -1.2, -1.2, -1.55, -1.55];
      const wz = [0.6, -0.6, 0.6, -0.6, 0.6, -0.6];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.32, 0.32, 0.2, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.32 })); // tire
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 垃圾車 (garbage truck — the musical yellow one) -------- */
  {
    id: 'garbage_truck',
    displayName: '垃圾車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe0c83a, 0xd8b830, 0xe8d048, 0x9aa0aa, 0x6a7078],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [
        box(1.0, 0.95, 1.15, 0xffffff, { x: 1.4, y: 0.92, hex2: 0xf4e26a }), // yellow cab (tinted)
        box(0.9, 0.34, 1.08, 0x28323e, { x: 1.42, y: 1.18 }), // windshield band
        box(0.06, 0.12, 0.22, 0xffe9a0, { x: 1.92, y: 0.66, z: 0.4 }), // headlight R
        box(0.06, 0.12, 0.22, 0xffe9a0, { x: 1.92, y: 0.66, z: -0.4 }), // headlight L
        box(2.3, 1.35, 1.16, 0xffffff, { x: -0.55, y: 1.1, hex2: 0xf0dc58 }), // compactor body (yellow)
        box(2.34, 0.18, 1.12, 0x9aa0aa, { x: -0.55, y: 0.44 }), // underframe
        // angled rear loading hopper (sloped tail — defining silhouette)
        box(0.9, 1.1, 1.18, 0x9aa0aa, { rz: -0.28, x: -1.75, y: 1.0 }),
        box(0.06, 0.7, 1.0, 0x44484f, { x: -1.95, y: 0.7 }), // rear opening (dark)
        // hydraulic arm + handrails on the back
        cyl(0.06, 0.06, 0.9, 6, 0x6a7078, { rz: 0.5, x: -1.4, y: 1.5 }),
        box(2.0, 0.06, 1.18, 0xd0b830, { x: -0.55, y: 1.78 }), // body roof rib
        box(0.06, 0.7, 0.6, 0xc83828, { x: 0.78, y: 1.0, z: 0.6 }), // warning chevron stripe
      ];
      // 6 wheels (low-seg for tri budget)
      const wx = [1.35, 1.35, -0.7, -0.7, -1.3, -1.3];
      const wz = [0.56, -0.56, 0.56, -0.56, 0.56, -0.56];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.3, 0.3, 0.22, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.3 })); // tire
      }
      return finish(parts);
    },
  },

  /* ---- slot 6: 加油站 (gas station — canopy + pumps) ------------------ */
  {
    id: 'gas_station',
    displayName: '加油站',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 9.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xeef2f4, 0xc94f46, 0x3a6ea0, 0xe0a83a, 0xd8dce2],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // big flat canopy roof on slender columns
        box(3.4, 0.26, 2.4, 0xffffff, { y: 1.9 }), // canopy slab (tinted white)
        box(3.46, 0.14, 2.46, 0xc94f46, { y: 2.06 }), // red fascia trim
        box(3.46, 0.06, 2.46, 0x3a6ea0, { y: 2.14 }), // blue trim stripe
      ];
      // 4 support columns
      const cx = [-1.3, 1.3, -1.3, 1.3];
      const cz = [0.9, 0.9, -0.9, -0.9];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.16, 0.16, 1.8, 7, 0xd8dce2, { x: cx[i], z: cz[i], y: 0.9 }));
      }
      // ground island slab
      parts.push(box(2.2, 0.12, 1.2, 0x9aa0aa, { y: 0.06 }));
      // 2 fuel pumps (boxy dispensers with hose post)
      const px = [-0.6, 0.6];
      for (let i = 0; i < 2; i++) {
        parts.push(box(0.36, 0.7, 0.5, 0xeef2f4, { x: px[i], y: 0.5 })); // pump body
        parts.push(box(0.32, 0.22, 0.46, 0x2a3138, { x: px[i], y: 0.78 })); // pump screen (dark)
        parts.push(box(0.3, 0.06, 0.4, 0xe0a83a, { x: px[i], y: 0.92 })); // pump top cap (amber)
        parts.push(cyl(0.05, 0.05, 0.5, 6, 0x44484f, { x: px[i] + 0.22, y: 0.5, z: 0.28 })); // hose post
      }
      // tall price totem sign at the corner
      parts.push(cyl(0.1, 0.1, 2.1, 6, 0xbfc4ca, { x: 1.7, z: -0.7, y: 1.05 })); // pole
      parts.push(box(0.7, 0.8, 0.14, 0xc94f46, { x: 1.7, z: -0.7, y: 2.1 })); // price board
      parts.push(box(0.6, 0.5, 0.05, 0xfff2c0, { x: 1.7, z: -0.84, y: 2.1 })); // lit price digits
      return finish(parts);
    },
  },

  /* ---- slot 7: 木雕騎樓 (woodcarving arcade colonnade) ----------------- */
  {
    id: 'woodcarving_arcade',
    displayName: '木雕騎樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0xc8a870, 0x5a3a1a],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Sanyi woodcarving shop arcade — wooden colonnade with carved displays
      // Simplified to stay under tri cap
      const parts = [
        // the slab beam the storefront sits under (騎樓 ceiling) — wood-toned
        box(3.2, 0.3, 1.2, 0xffffff, { y: 2.0, hex2: 0xe8dcc0 }),
        box(3.24, 0.12, 1.24, 0x6a4a2a, { y: 2.2 }), // dark wood edge band
        box(2.0, 0.5, 1.0, 0xf0e8d8, { z: -0.4, y: 1.4 }), // rear shop wall recess
      ];
      // 4 square wooden columns (boxes instead of cylinders to save tris)
      const cx = [-1.35, -0.45, 0.45, 1.35];
      for (let i = 0; i < cx.length; i++) {
        parts.push(box(0.28, 1.7, 0.28, 0xffffff, { x: cx[i], y: 0.95, hex2: 0xa08050 })); // wood column
        parts.push(box(0.36, 0.14, 0.36, 0x6a4a2a, { x: cx[i], y: 1.82 })); // capital
        parts.push(box(0.36, 0.16, 0.36, 0x5a3a1a, { x: cx[i], y: 0.16 })); // base
      }
      // wood carving signboard
      parts.push(box(1.8, 0.45, 0.1, 0x8a6a3a, { y: 1.7, z: 0.5 }));
      parts.push(box(1.6, 0.32, 0.04, 0xf4e8c8, { y: 1.7, z: 0.56 })); // carved text area
      // display sculptures outside (simplified)
      parts.push(box(0.3, 0.4, 0.3, 0x5a3a1a, { x: -0.9, y: 0.2, z: 0.6 })); // pedestal
      parts.push(box(0.25, 0.35, 0.2, 0x8a6a3a, { x: -0.9, y: 0.55, z: 0.6 })); // carving
      parts.push(box(0.3, 0.4, 0.3, 0x5a3a1a, { x: 0.9, y: 0.2, z: 0.6 })); // pedestal
      parts.push(box(0.25, 0.35, 0.15, 0xa08050, { x: 0.9, y: 0.6, z: 0.6 })); // buddha
      // hanging lanterns (boxes instead of cyls)
      parts.push(box(0.18, 0.2, 0.18, 0xc8a870, { x: -0.9, y: 1.78 }));
      parts.push(box(0.18, 0.2, 0.18, 0xc8a870, { x: 0.9, y: 1.78 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 客家街屋 (chunk landmark — Hakka street-house row) ----- */
  {
    id: 'hakka_streethouse',
    displayName: '客家街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xe0d6c4, 0xc6baa6, 0xced6de, 0xd6c6ae, 0xb6aa96],
    yOffset: -0.50,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A contiguous row of 4 Hakka-style street-houses of varying height (連棟客家街屋)
      // Features: 客家花布 awnings, earth-tone walls, traditional lattice windows
      const parts = [];
      const heights = [2.2, 2.8, 2.4, 3.0];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallTints = [0xffffff, 0xf0e8d6, 0xffffff, 0xf2e4d0];
      const winTints = [0x44506a, 0x3e4a64, 0x4a5470, 0x40506a];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // floors=2 keeps the banded-window read while staying under tri budget
        parts.push(towerBanded(1.3, h, 1.3, 2, wallTints[i], winTints[i], 0xffd98a, rng, { x: xs[i], y: h / 2 }));
        parts.push(box(1.36, 0.1, 1.36, 0x8a8f9a, { x: xs[i], y: h + 0.05 })); // roof slab
        // traditional sloped roof tiles (Hakka style)
        parts.push(box(1.5, 0.08, 1.5, 0x7a5a40, { x: xs[i], y: h + 0.15, rz: (i % 2 === 0 ? 0.1 : -0.1) }));
      }
      // continuous 騎樓 colonnade across the whole ground floor front
      parts.push(box(5.8, 0.24, 1.36, 0xc6baa6, { y: 0.78, z: 0.02 })); // arcade beam
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.3, 0.7, 0.3, 0xd6cbb6, { x: -2.1 + i * 1.4, y: 0.35, z: 0.55 })); // arcade column
      }
      // 客家花布 awning strip across the front (blue checkered pattern characteristic)
      parts.push(box(5.6, 0.08, 0.3, 0x4a6a9a, { y: 0.96, z: 0.72 }));
      // street-front shop sign band (earthy red)
      parts.push(box(5.6, 0.14, 0.06, 0xa04030, { y: 1.08, z: 0.7 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 大廟 (chunk landmark — temple mass, 燕尾脊) ------------ */
  {
    id: 'temple_mass',
    displayName: '大廟',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 12,
    radiusJitter: 0.15,
    spawnWeight: 0.3,
    palette: [0xc23a26, 0xd2402a, 0xe0a83a, 0xb83422, 0x3a6a4a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // raised stone platform (廟埕台基)
        box(4.2, 0.4, 2.8, 0xb6aa96, { y: 0.2 }),
        // main hall body — red walls + warm interior glow
        box(3.4, 1.3, 2.0, 0xffffff, { y: 1.05, hex2: 0xd2402a }),
        // front vermilion columns (龍柱) of the portico
      ];
      const cx = [-1.4, -0.5, 0.5, 1.4];
      for (let i = 0; i < cx.length; i++) {
        parts.push(cyl(0.14, 0.16, 1.3, 6, 0xffffff, { x: cx[i], z: 1.0, y: 1.05 })); // vermilion column (tinted)
      }
      // sweeping double-eave hip roof — wide lower eave + narrower upper ridge.
      // low-seg cyl(seg=4) half-cylinders give the curved tiled slopes.
      parts.push(cyl(1.6, 1.6, 3.8, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 1.95 })); // lower eave roof (green-glaze tint)
      parts.push(box(3.9, 0.12, 2.5, 0xe0a83a, { y: 1.78 })); // golden eave fascia under lower roof
      parts.push(cyl(1.1, 1.1, 3.4, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.55 })); // upper roof tier
      // central ridge beam with ornament
      parts.push(box(3.6, 0.18, 0.22, 0xc94f46, { y: 2.95 })); // main ridge
      // 燕尾脊 — upswept swallow-tail ridge ends (the defining temple silhouette)
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.95, y: 3.05 })); // swallowtail L
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.95, y: 3.05 })); // swallowtail R
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.6, y: 2.62, z: 0 })); // lower-eave tail L
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.6, y: 2.62, z: 0 })); // lower-eave tail R
      // central roof ornament (寶塔 / 葫蘆 finial)
      parts.push(sph(0.22, 0xe0a83a, { ws: 6, hs: 4, y: 3.18 }));
      parts.push(cone(0.16, 0.4, 6, 0xe0a83a, { y: 3.5 }));
      // entrance steps + dark double doors
      parts.push(box(3.0, 0.16, 0.5, 0x9aa0aa, { y: 0.46, z: 1.35 })); // steps
      parts.push(box(1.0, 0.9, 0.08, 0x6a2a1a, { y: 0.85, z: 1.02 })); // temple doors (dark red)
      parts.push(box(1.04, 0.18, 0.1, 0xe0a83a, { y: 1.36, z: 1.02 })); // door lintel plaque (gold)
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
