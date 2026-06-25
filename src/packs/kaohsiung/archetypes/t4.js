/**
 * @file packs/kaohsiung/archetypes/t4.js — Roll Formosa Kaohsiung pack, TIER 4
 * content: 鹽埕街屋與廟 (Yancheng shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/kaohsiung/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 鹽埕港邊街屋 (Yancheng port-district townhouse) ---------- */
  {
    id: 'yancheng_townhouse',
    displayName: '鹽埕港邊街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe0d8c4, 0xd0c4b0, 0xc8c0b4, 0xd8d0c0, 0xc4b8a8],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // tall narrow banded body (港邊街屋), tinted harbour-worn plaster + warm windows
        towerBanded(1.0, 2.6, 1.5, 8, 0xffffff, 0x3a4a5a, 0xffd98a, rng, { y: 1.4 }),
        box(1.1, 0.12, 1.6, 0x7a848e, { y: 2.76 }), // flat roof slab
        box(1.12, 0.22, 1.62, 0xb8aca0, { y: 0.22 }), // ground-floor plinth
        // harbour-style rooftop with salt-air worn tin penthouse
        box(0.8, 0.5, 1.1, 0x8a9a8a, { y: 3.06, hex2: 0xa0b0a0 }), // greyed tin (salt-air patina)
        cyl(0.95, 0.95, 1.2, 4, 0x7a8a7a, { theta0: PI, rx: HALF_PI, sy: 0.4, x: 0.0, y: 3.5, z: 0.0 }), // gable tin cap
        cyl(0.16, 0.16, 0.5, 6, 0xa0a8b0, { x: 0.45, y: 3.55 }), // rooftop water tank pipe
        box(0.36, 0.32, 0.36, 0x4a5a70, { x: -0.25, y: 3.4 }), // rooftop blue water tank
        // street-level shutter + harbour-district signage
        box(0.92, 0.6, 0.06, 0x6a747e, { y: 0.5, z: 0.78 }), // roll shutter (weathered)
        box(0.78, 0.18, 0.05, 0x3a7090, { y: 0.94, z: 0.8 }), // blue harbour-theme shop sign
      ];
      // stacked balconies with rail + AC unit per floor — harbour-side rhythm
      for (let i = 0; i < 3; i++) {
        const y = 0.95 + i * 0.62;
        parts.push(box(1.06, 0.1, 0.12, 0xc8c4bc, { y, z: 0.78 })); // balcony rail (weathered)
        if (i < 2) parts.push(box(0.26, 0.22, 0.18, 0xd0d0c8, { x: 0.36, y: y + 0.16, z: 0.74 })); // window AC
      }
      return finish(parts);
    },
  },

  /* ---- slot 1: 鐵皮屋 (low corrugated-tin shed) ------------------------ */
  {
    id: 'tin_roof_house',
    displayName: '鐵皮屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc05a3a, 0xb0563a, 0x9aa0aa, 0x8a4a8a, 0x6a8a6a],
    yOffset: -0.43,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        box(2.4, 1.0, 1.7, 0xd8d4cc, { y: 0.5 }), // breeze-block / plaster lower walls
        box(2.42, 0.5, 1.72, 0xffffff, { y: 1.2, hex2: 0xe0d8d0 }), // upper tin walls (tinted)
        // single-slope corrugated tin roof (rusty red) — leaning lid
        box(2.7, 0.1, 1.9, 0xffffff, { rz: 0.16, y: 1.62 }),
        // corrugation ridges suggested by thin batten boxes along the slope
      ];
      for (let i = 0; i < 4; i++) {
        const x = -0.95 + i * 0.64;
        parts.push(box(0.06, 0.04, 1.9, 0xa84a30, { rz: 0.16, x, y: 1.69 + x * 0.16 })); // tin rib
      }
      parts.push(box(2.74, 0.06, 0.12, 0x6a4a32, { rz: 0.16, y: 1.7, z: 0.92 })); // eave gutter front
      parts.push(box(0.7, 0.7, 0.05, 0x44484f, { x: 0.6, y: 0.5, z: 0.86 })); // dark roll door
      parts.push(box(0.4, 0.45, 0.06, 0x9fc4d8, { x: -0.7, y: 0.55, z: 0.86 })); // small window
      // water-tank + vent on roof (typical 違建 detail)
      parts.push(cyl(0.28, 0.28, 0.4, 8, 0x3a6ea0, { x: -0.7, y: 1.95 })); // blue water tank
      parts.push(cyl(0.08, 0.08, 0.3, 6, 0x9aa0aa, { x: 0.7, y: 1.9 })); // vent pipe
      return finish(parts);
    },
  },

  /* ---- slot 2: 鹽埕洋樓 (Yancheng western-style building — colonial port district) */
  {
    id: 'yancheng_colonial',
    displayName: '鹽埕洋樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe8dcc8, 0xd8c8b0, 0xf4ece0, 0xc8b8a0],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const wall = 0xffffff; // tinted cream stucco
      const parts = [
        // 3-storey colonial/Japanese-era building body
        box(2.2, 2.2, 1.4, wall, { y: 1.2, hex2: 0xf8f0e4 }),
        // arched arcade at ground floor (騎樓 with arches — Yancheng style)
        box(2.24, 0.7, 1.44, 0xe0d4c4, { y: 0.35 }),
        // arcade arches (3 rounded openings)
      ];
      for (let i = 0; i < 3; i++) {
        const ax = -0.65 + i * 0.65;
        parts.push(cyl(0.25, 0.25, 0.5, 6, 0x404850, { y: 0.35, x: ax, z: 0.74, thetaLen: PI, theta0: -HALF_PI, rx: HALF_PI }));
      }
      // decorative cornice band at roofline
      parts.push(box(2.3, 0.2, 1.5, 0xd8cbb8, { y: 2.4 }));
      parts.push(box(2.32, 0.08, 1.52, 0xc8b8a0, { y: 2.54 }));
      // rooftop parapet with dentil detailing
      parts.push(box(2.26, 0.15, 0.08, 0xd4c8b4, { y: 2.62, z: 0.72 }));
      parts.push(box(2.26, 0.15, 0.08, 0xd4c8b4, { y: 2.62, z: -0.72 }));
      // windows with shutters (colonial style)
      for (let f = 0; f < 2; f++) {
        const y = 0.95 + f * 0.75;
        parts.push(box(0.35, 0.5, 0.06, 0x3a506a, { x: -0.65, y, z: 0.72 })); // window
        parts.push(box(0.35, 0.5, 0.06, 0x3a506a, { x: 0.0, y, z: 0.72 })); // window
        parts.push(box(0.35, 0.5, 0.06, 0x3a506a, { x: 0.65, y, z: 0.72 })); // window
      }
      // small balcony rails at 2F
      parts.push(box(0.45, 0.08, 0.12, 0xb8aca0, { x: -0.65, y: 0.72, z: 0.78 }));
      parts.push(box(0.45, 0.08, 0.12, 0xb8aca0, { x: 0.65, y: 0.72, z: 0.78 }));
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
    yOffset: -0.56,
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

  /* ---- slot 7: 港邊倉庫棚架 (harbor warehouse shed) -------------------- */
  {
    id: 'harbor_warehouse_shed',
    displayName: '港邊倉庫棚架',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x7a8a9a, 0x8a9aa8, 0x9aaab8, 0x6a7a8a, 0x5a6a7a],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // corrugated steel shed body (港邊倉庫風)
        box(3.0, 1.5, 1.4, 0xffffff, { y: 0.85, hex2: 0xb8c0c8 }),
        // gable roof (salt-weathered tin)
        cyl(1.6, 1.6, 3.2, 4, 0x8a9aa8, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 1.8 }),
        // large cargo door (sliding steel)
        box(1.4, 1.1, 0.06, 0x5a6a78, { y: 0.6, z: 0.72 }),
        box(1.38, 0.08, 0.04, 0x4a5a68, { y: 1.16, z: 0.74 }), // door rail
        // dock loading platform
        box(3.2, 0.2, 0.5, 0x9aa0a8, { y: 0.1, z: 0.95 }),
      ];
      // vertical corrugation ribs on the sides
      for (let i = 0; i < 5; i++) {
        const x = -1.2 + i * 0.6;
        parts.push(box(0.04, 1.3, 0.04, 0x6a7a88, { x, y: 0.75, z: 0.72 }));
      }
      // forklift pallet on the platform
      parts.push(box(0.6, 0.1, 0.5, 0xc8b090, { x: -0.8, y: 0.25, z: 0.9 }));
      // harbor signage
      parts.push(box(0.9, 0.3, 0.04, 0x3a6a90, { y: 1.5, z: 0.73 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 鹽埕街屋 (chunk landmark — Yancheng street-house row) */
  {
    id: 'saltfield_streethouse_mass',
    displayName: '鹽埕街屋',
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
      // a contiguous row of 4 abutting Yancheng street-houses of varying height (連棟街屋)
      const parts = [];
      const heights = [2.2, 2.8, 2.4, 3.0];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallTints = [0xffffff, 0xf0ead8, 0xffffff, 0xf2e6dc];
      const winTints = [0x44506a, 0x3e4a64, 0x4a5470, 0x40506a];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // floors=3 keeps the banded-window read while staying in tri budget
        parts.push(towerBanded(1.3, h, 1.3, 3, wallTints[i], winTints[i], 0xffd98a, rng, { x: xs[i], y: h / 2 }));
        parts.push(box(1.36, 0.1, 1.36, 0x8a8f9a, { x: xs[i], y: h + 0.05 })); // roof slab
        // rooftop water tanks / tin add-on (the chaotic skyline)
        if (i !== 3) parts.push(cyl(0.2, 0.2, 0.34, 5, 0x3a6ea0, { x: xs[i] - 0.3, y: h + 0.27 }));
        if (i % 2 === 0) parts.push(box(0.7, 0.4, 0.9, 0xb0563a, { x: xs[i] + 0.2, y: h + 0.25, hex2: 0xc8704a })); // tin penthouse
      }
      // continuous 騎樓 colonnade across the whole ground floor front
      parts.push(box(5.8, 0.24, 1.36, 0xc6baa6, { y: 0.78, z: 0.02 })); // arcade beam
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.3, 0.7, 0.3, 0xd6cbb6, { x: -2.4 + i * 1.2, y: 0.35, z: 0.55 })); // arcade column
      }
      // street-front shop sign band
      parts.push(box(5.6, 0.2, 0.06, 0xc83828, { y: 0.96, z: 0.7 }));
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
