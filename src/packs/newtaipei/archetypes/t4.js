/**
 * @file packs/newtaipei/archetypes/t4.js — Roll Formosa New Taipei pack, TIER 4
 * content: 老鎮街屋與廟 (Old town shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/newtaipei/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 九份山城屋 (Jiufen hillside house — narrow multi-story) -- */
  {
    id: 'jiufen_hillside_house',
    displayName: '九份山城屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c8b0, 0xc8a890, 0xa88870, 0xe8d8c0, 0xb89878],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Jiufen-style hillside house with traditional elements and red lanterns
      const parts = [
        // Main body — aged plaster with dark wood trim
        box(1.1, 2.4, 1.4, 0xffffff, { y: 1.3, hex2: 0xe8d8c0 }),
        box(1.14, 0.2, 1.44, 0x6a5040, { y: 0.15 }), // dark wood base
        // Traditional sloped roof
        cyl(1.2, 1.2, 1.2, 4, 0x5a4030, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 2.7, z: 0 }),
        box(1.3, 0.08, 0.12, 0x4a3020, { y: 2.95 }), // roof ridge
        // Wooden balcony/veranda (characteristic Jiufen)
        box(1.2, 0.1, 0.5, 0x7a6050, { y: 1.5, z: 0.95 }),
        box(0.08, 0.5, 0.08, 0x6a5040, { x: -0.5, y: 1.25, z: 1.1 }), // post L
        box(0.08, 0.5, 0.08, 0x6a5040, { x: 0.5, y: 1.25, z: 1.1 }), // post R
        box(1.1, 0.06, 0.06, 0x7a6050, { y: 1.52, z: 1.12 }), // rail
        // Hanging red lantern (Jiufen signature)
        sph(0.15, 0xc83030, { ws: 6, hs: 4, x: 0, y: 1.4, z: 1.2 }),
        // Shop window with warm glow
        box(0.6, 0.5, 0.05, 0xffd868, { y: 0.8, z: 0.72 }),
        box(0.08, 0.55, 0.08, 0x5a4030, { x: -0.35, y: 0.8, z: 0.74 }), // frame L
        box(0.08, 0.55, 0.08, 0x5a4030, { x: 0.35, y: 0.8, z: 0.74 }), // frame R
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 紅磚屋 (traditional red brick house — New Taipei style) -- */
  {
    id: 'redbrick_house',
    displayName: '紅磚屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa84a32, 0x9a4028, 0xb85a3a, 0xc8704a, 0x8a3a28],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // red brick main body — classic Taiwan vernacular architecture
        box(2.2, 1.1, 1.6, 0xffffff, { y: 0.55, hex2: 0xa84a32 }), // red brick walls
        box(2.24, 0.18, 1.62, 0x8a3a28, { y: 0.09 }), // darker brick base course
      ];
      // brick texture: horizontal grooves
      for (let i = 0; i < 4; i++) {
        parts.push(box(2.22, 0.02, 1.64, 0x7a3020, { y: 0.25 + i * 0.25 }));
      }
      // traditional gable roof (red tile)
      parts.push(cyl(1.4, 1.4, 2.3, 4, 0xc23a26, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 1.5 }));
      // roof ridge
      parts.push(box(2.4, 0.1, 0.16, 0xd84a36, { y: 1.85 }));
      // wooden door and window frames
      parts.push(box(0.5, 0.75, 0.08, 0x5a4030, { x: 0, y: 0.45, z: 0.82 })); // door
      parts.push(box(0.35, 0.35, 0.08, 0x9fc4d8, { x: -0.7, y: 0.65, z: 0.82 })); // window L
      parts.push(box(0.35, 0.35, 0.08, 0x9fc4d8, { x: 0.7, y: 0.65, z: 0.82 })); // window R
      parts.push(box(0.38, 0.04, 0.1, 0x5a4030, { x: -0.7, y: 0.85, z: 0.84 })); // lintel L
      parts.push(box(0.38, 0.04, 0.1, 0x5a4030, { x: 0.7, y: 0.85, z: 0.84 })); // lintel R
      // small chimney or vent
      parts.push(cyl(0.1, 0.1, 0.3, 6, 0x6a5a4a, { x: 0.7, y: 2.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 老公寓 (5-storey 老公寓 walk-up — aged style) ------------ */
  {
    id: 'old_apartment',
    displayName: '老公寓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8cdb8, 0xc8bca8, 0xd0c4b4, 0xc4b8a4, 0xbcae98],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // wide squat 5-floor banded slab (公寓比透天矮胖) — aged plaster tint
        towerBanded(2.0, 2.4, 1.3, 10, 0xffffff, 0x44506a, 0xffe0a0, rng, { y: 1.25, hex2: 0xe8dcd0 }),
        box(2.08, 0.12, 1.38, 0x8a8f9a, { y: 2.5 }), // roof slab
        box(2.04, 0.22, 1.34, 0xc8bca8, { y: 0.16 }), // ground plinth
        // rooftop clutter: water tanks + 鐵皮加蓋 (more cluttered than new buildings)
        box(1.2, 0.5, 0.9, 0xb0563a, { x: -0.35, y: 2.8, hex2: 0xc8704a }), // tin penthouse
        cyl(0.28, 0.28, 0.45, 8, 0x3a6ea0, { x: 0.6, y: 2.8 }), // blue tank
        cyl(0.28, 0.28, 0.45, 8, 0x3a6ea0, { x: 0.95, y: 2.8 }), // blue tank
        box(0.5, 0.5, 0.05, 0x6a7078, { y: 0.55, z: 0.7 }), // entrance gate
        box(2.06, 0.12, 0.06, 0x8a7a6a, { y: 2.18, z: 0.66 }), // aged trim band
        // stained wall patches (aged appearance)
        box(0.4, 0.6, 0.02, 0xc8baa8, { x: -0.6, y: 1.5, z: 0.68 }),
      ];
      // characteristic 鐵窗 (security-grille) cages on each floor face — more prominent
      for (let f = 0; f < 4; f++) {
        const y = 0.9 + f * 0.5;
        parts.push(box(0.52, 0.36, 0.18, 0xd0c4b4, { x: -0.55, y, z: 0.66 })); // grille cage L
        parts.push(box(0.52, 0.36, 0.18, 0xd0c4b4, { x: 0.55, y, z: 0.66 })); // grille cage R
      }
      return finish(parts);
    },
  },

  /* ---- slot 3: 超商 (小七/全家 convenience store) --------------------- */
  {
    id: 'convenience_store',
    displayName: '超商',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xffffff, 0xe8edf2, 0xf6f0e6, 0xdfeae2, 0xd8dee6],
    yOffset: -0.6,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const parts = [
        box(2.6, 0.95, 1.5, 0xffffff, { y: 0.48 }), // store box (tinted white)
        // 小七 signature orange/green/red tricolor fascia stripe
        box(2.66, 0.22, 1.54, 0xe06a1a, { y: 1.06 }), // orange band
        box(2.66, 0.08, 1.54, 0x2a8a3a, { y: 1.21 }), // green stripe
        box(2.66, 0.06, 1.54, 0xc83828, { y: 1.28 }), // red stripe
        box(1.1, 0.16, 0.06, 0xfff2c0, { x: -0.5, y: 1.06, z: 0.79 }), // lit logo plate
        box(2.72, 0.06, 1.6, 0x8a9098, { y: 1.34 }), // roof lip
        box(0.42, 0.32, 0.32, 0xb8bec8, { x: 0.9, y: 1.46 }), // rooftop AC unit
        // glass storefront with warm interior shelf glow
        box(2.2, 0.6, 0.06, 0x9fc4d8, { y: 0.46, z: 0.76 }), // glass front
        box(2.1, 0.1, 0.07, 0xffe9b0, { y: 0.62, z: 0.765 }), // top shelf glow
        box(2.1, 0.08, 0.07, 0xf0d8a0, { y: 0.4, z: 0.765 }), // mid shelf glow
        box(0.5, 0.66, 0.08, 0x7a8088, { x: 0.92, y: 0.36, z: 0.78 }), // auto door
        box(0.46, 0.42, 0.05, 0x9fc4d8, { x: 0.92, y: 0.44, z: 0.81 }), // door glass
        box(0.5, 0.7, 0.4, 0xd8dce2, { x: -1.0, y: 0.36, z: 0.95 }), // ATM / ice box by door
        cyl(0.06, 0.06, 0.7, 6, 0xc8ccd2, { x: -1.25, y: 0.85, z: 0.7 }), // pole sign post
        box(0.4, 0.34, 0.06, 0xe06a1a, { x: -1.25, y: 1.25, z: 0.7 }), // pole sign panel
      ];
      // mullions splitting the glass front
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.06, 0.62, 0.08, 0xe8e4da, { x: -0.7 + i * 0.6, y: 0.44, z: 0.77 }));
      }
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
    yOffset: -0.6,
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

  /* ---- slot 7: 淡水老街騎樓 (Tamsui old street arcade) ----------------- */
  {
    id: 'tamsui_arcade',
    displayName: '淡水老街騎樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xa84a32, 0xc8bca8, 0xd8cdb8, 0x8a3a28, 0xe0d2c0],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Tamsui old street arcade with red brick and traditional shop fronts
      const parts = [
        // Red brick upper structure
        box(3.2, 1.2, 1.2, 0xa84a32, { y: 1.6, hex2: 0x8a3a28 }),
        // Arcade ceiling
        box(3.2, 0.2, 1.2, 0xd8cdb8, { y: 1.0 }),
        box(3.24, 0.12, 1.24, 0xc8bca8, { y: 2.26 }), // parapet cap
      ];
      // 4 arcade columns (round, colonial style)
      const cx = [-1.35, -0.45, 0.45, 1.35];
      for (let i = 0; i < cx.length; i++) {
        parts.push(cyl(0.16, 0.18, 0.9, 8, 0xd8cdb8, { x: cx[i], y: 0.55, z: 0.5 }));
        parts.push(box(0.4, 0.1, 0.4, 0xc8bca8, { x: cx[i], y: 0.08, z: 0.5 })); // base
        parts.push(box(0.35, 0.08, 0.35, 0xe0d2c0, { x: cx[i], y: 0.98, z: 0.5 })); // capital
      }
      // Shop signs (Tamsui specialties)
      parts.push(box(0.6, 0.4, 0.06, 0xc83030, { x: -0.9, y: 0.75, z: 0.65 })); // 阿給 sign
      parts.push(box(0.55, 0.3, 0.04, 0xf8d848, { x: -0.9, y: 0.75, z: 0.7 }));
      parts.push(box(0.6, 0.4, 0.06, 0x3a6ea0, { x: 0.9, y: 0.75, z: 0.65 })); // 鐵蛋 sign
      parts.push(box(0.55, 0.3, 0.04, 0xf8f8f0, { x: 0.9, y: 0.75, z: 0.7 }));
      // Brick texture lines
      parts.push(box(3.22, 0.04, 1.22, 0x7a2a18, { y: 1.4 }));
      parts.push(box(3.22, 0.04, 1.22, 0x7a2a18, { y: 1.8 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 三峽老街屋 (chunk landmark — Sanxia old street row) ------ */
  {
    id: 'sanxia_streethouse',
    displayName: '三峽老街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xa84a32, 0xc8bca8, 0xd8cdb8, 0x8a3a28, 0xe0d2c0],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Sanxia Old Street — iconic red brick baroque-style street houses (simplified)
      const parts = [];
      // Two red brick houses
      parts.push(box(1.8, 2.4, 1.2, 0xa84a32, { x: -1.1, y: 1.2, hex2: 0x8a3a28 }));
      parts.push(box(1.8, 2.6, 1.2, 0xa84a32, { x: 1.1, y: 1.3, hex2: 0x8a3a28 }));
      // Baroque-style parapet (山牆)
      parts.push(box(1.9, 0.5, 0.2, 0xc8bca8, { x: -1.1, y: 2.65, z: 0.55 }));
      parts.push(box(1.9, 0.5, 0.2, 0xc8bca8, { x: 1.1, y: 2.85, z: 0.55 }));
      // Arcade walkway floor
      parts.push(box(4.0, 0.18, 0.9, 0xd8cdb8, { y: 0.09, z: 0.5 }));
      // Central column
      parts.push(box(0.3, 0.8, 0.3, 0xc8bca8, { x: 0, y: 0.5, z: 0.55 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 大廟 (chunk landmark — temple mass, 燕尾脊) -------- */
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
        box(4.2, 0.4, 2.8, 0xb8ac98, { y: 0.2 }),
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
