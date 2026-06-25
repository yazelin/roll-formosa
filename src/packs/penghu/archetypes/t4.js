/**
 * @file packs/penghu/archetypes/t4.js — Roll Formosa Penghu pack, TIER 4
 * content: 古厝與天后宮 (old houses and Tianhou temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/penghu/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 咾咕石厝 (traditional Penghu coral stone house) ------------ */
  {
    id: 'coral_house',
    displayName: '咾咕石厝',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xb8a890, 0xd0c0a8, 0xa89878, 0x9a8a70],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // low coral stone walls (咾咕石牆) — characteristic rough texture tint
        box(2.2, 1.2, 1.8, 0xffffff, { y: 0.6, hex2: 0xc8b8a0 }),
        // thicker base course (台基)
        box(2.3, 0.25, 1.9, 0xa89878, { y: 0.12 }),
        // traditional red tile roof (閩式紅瓦) — single slope with eave
        box(2.5, 0.12, 2.0, 0xb85a3a, { rz: 0.12, y: 1.38 }),
        // roof ridge tiles
        box(2.5, 0.08, 0.16, 0xc86a4a, { y: 1.5 }),
        // eave overhang detail
        box(2.55, 0.06, 2.05, 0x9a4a2a, { y: 1.26 }),
        // wooden door (朱紅門)
        box(0.6, 0.8, 0.06, 0x8a3a2a, { y: 0.5, z: 0.92 }),
        // small window with stone frame
        box(0.4, 0.35, 0.08, 0x44506a, { x: -0.65, y: 0.7, z: 0.92 }),
        box(0.5, 0.45, 0.06, 0xb8a890, { x: -0.65, y: 0.7, z: 0.88 }), // stone frame
        // stone chimney (灶間煙囪) — Penghu characteristic
        box(0.3, 0.5, 0.3, 0xb8a890, { x: 0.8, y: 1.55 }),
        // wind break low wall (擋風矮牆) — protection from Penghu winds
        box(0.15, 0.6, 1.5, 0xa89878, { x: 1.2, y: 0.3, z: 0.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 漁寮 (Penghu fishing shed / boat shelter) ---------------- */
  {
    id: 'fishing_shed',
    displayName: '漁寮',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a8888, 0x4a7878, 0xc8b8a0, 0x6a9898, 0x3a6868],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // coral stone low wall base (咾咕石)
        box(2.4, 0.7, 1.7, 0xc8b8a0, { y: 0.35 }),
        // upper wooden plank walls (weathered fishing shed)
        box(2.42, 0.6, 1.72, 0x8a7a62, { y: 1.0, hex2: 0xa89878 }),
        // simple pitched tin roof (faded blue-green, salt-weathered)
        box(2.7, 0.1, 1.9, 0xffffff, { rz: 0.14, y: 1.48 }),
      ];
      for (let i = 0; i < 3; i++) {
        const x = -0.8 + i * 0.8;
        parts.push(box(0.04, 0.05, 1.85, 0x6a8a8a, { rz: 0.14, x, y: 1.54 + x * 0.14 })); // roof ribs
      }
      // wide boat door opening (dark)
      parts.push(box(1.4, 0.9, 0.05, 0x3a3a38, { y: 0.55, z: 0.86 }));
      // fishing net drying rack on side
      parts.push(cyl(0.06, 0.06, 1.0, 4, 0x7a6a52, { x: 1.3, y: 0.8, z: 0.4 }));
      parts.push(cyl(0.06, 0.06, 1.0, 4, 0x7a6a52, { x: 1.3, y: 0.8, z: -0.4 }));
      parts.push(box(0.06, 0.8, 0.9, 0x4a7878, { x: 1.3, y: 1.2, rz: 0.15 })); // net draped
      // buoys hanging outside
      parts.push(sph(0.12, 0xf26a1f, { ws: 5, hs: 3, x: -1.2, y: 0.8, z: 0.7 }));
      parts.push(sph(0.1, 0xf0f0e8, { ws: 5, hs: 3, x: -1.0, y: 0.7, z: 0.75 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 老公寓 (low island apartment, 3-storey max) --------------- */
  {
    id: 'old_apartment',
    displayName: '老公寓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe2d8c8, 0xd0d8e0, 0xe0d0c4, 0xd6ddd0, 0xc8bca8],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // squat 3-floor banded slab (island buildings are lower than city)
        towerBanded(2.0, 1.8, 1.3, 6, 0xffffff, 0x44506a, 0xffe0a0, rng, { y: 0.95 }),
        box(2.08, 0.12, 1.38, 0x8a8f9a, { y: 1.9 }), // roof slab
        box(2.04, 0.22, 1.34, 0xc8bca8, { y: 0.16 }), // ground plinth
        // rooftop clutter: water tanks (essential in Penghu)
        cyl(0.28, 0.28, 0.45, 8, 0x3a6ea0, { x: 0.5, y: 2.18 }), // blue tank
        cyl(0.28, 0.28, 0.45, 8, 0x3a6ea0, { x: 0.9, y: 2.18 }), // blue tank
        box(0.5, 0.5, 0.05, 0x6a7078, { y: 0.55, z: 0.7 }), // entrance gate
      ];
      // characteristic iron grille windows on each floor face
      for (let f = 0; f < 3; f++) {
        const y = 0.7 + f * 0.5;
        parts.push(box(0.5, 0.3, 0.16, 0xd8d4cc, { x: -0.55, y, z: 0.66 })); // grille cage L
        parts.push(box(0.5, 0.3, 0.16, 0xd8d4cc, { x: 0.55, y, z: 0.66 })); // grille cage R
      }
      return finish(parts);
    },
  },

  /* ---- slot 3: 超商 (convenience store) --------------------------------- */
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
        // signature orange/green/red tricolor fascia stripe
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
        box(0.5, 0.7, 0.4, 0xd8dce2, { x: -1.0, y: 0.36, z: 0.95 }), // ice box by door
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

  /* ---- slot 4: 公車 (small island bus) ---------------------------------- */
  {
    id: 'island_bus',
    displayName: '公車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.5,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe8e8e2, 0x3a8a6a, 0xf0d040, 0xe0a83a, 0x8a9098],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // smaller island bus (not full city articulated bus)
      const parts = [
        box(2.6, 0.9, 1.1, 0xffffff, { y: 0.85 }), // shorter bus body (tinted)
        box(2.64, 0.16, 1.12, 0x3a8a6a, { y: 0.44 }), // lower green livery band (island style)
        box(2.5, 0.3, 1.14, 0x28323e, { y: 1.08 }), // window band (dark)
        box(2.4, 0.06, 1.0, 0xd2d6dc, { y: 1.38 }), // roof
        box(0.7, 0.14, 1.04, 0xf0d040, { x: 1.0, y: 1.32 }), // roof route sign (yellow)
        box(2.66, 0.45, 0.04, 0xffffff, { z: 0.58, y: 0.85, hex2: 0xeef2f6 }), // side panel sheen
        // windshield + headlights front
        box(0.06, 0.36, 1.08, 0x35414e, { x: 1.33, y: 1.04 }), // windshield
        box(0.06, 0.1, 0.18, 0xffe9a0, { x: 1.35, y: 0.54, z: 0.38 }), // headlight R
        box(0.06, 0.1, 0.18, 0xffe9a0, { x: 1.35, y: 0.54, z: -0.38 }), // headlight L
        box(0.05, 0.6, 0.45, 0x35414e, { x: -1.1, y: 0.8, z: 0.45 }), // door
      ];
      // 4 wheels (smaller bus)
      const wx = [1.0, 1.0, -0.9, -0.9];
      const wz = [0.55, -0.55, 0.55, -0.55];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.28, 0.28, 0.18, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.28 })); // tire
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

  /* ---- slot 7: 漁港涼亭 (Penghu harbor pavilion / resting shelter) ----- */
  {
    id: 'harbor_pavilion',
    displayName: '漁港涼亭',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xb8a890, 0xa89878, 0xd0c0a8, 0x9a8a70],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // traditional Chinese-style pavilion roof (curved eaves)
        cyl(1.4, 1.4, 2.6, 4, 0xb85a3a, { theta0: PI, rx: HALF_PI, sy: 0.45, y: 2.1 }), // curved roof
        box(2.8, 0.12, 2.1, 0xc86a4a, { y: 1.9 }), // eave edge
        // 4 coral stone support columns
        cyl(0.16, 0.18, 1.8, 6, 0xc8b8a0, { x: -1.0, z: 0.7, y: 0.9 }),
        cyl(0.16, 0.18, 1.8, 6, 0xc8b8a0, { x: 1.0, z: 0.7, y: 0.9 }),
        cyl(0.16, 0.18, 1.8, 6, 0xc8b8a0, { x: -1.0, z: -0.7, y: 0.9 }),
        cyl(0.16, 0.18, 1.8, 6, 0xc8b8a0, { x: 1.0, z: -0.7, y: 0.9 }),
        // coral stone base platform
        box(2.6, 0.2, 1.9, 0xa89878, { y: 0.1 }),
        // bench seating inside (stone benches)
        box(1.8, 0.35, 0.4, 0xb8a890, { y: 0.35, z: -0.5 }),
        box(1.8, 0.35, 0.4, 0xb8a890, { y: 0.35, z: 0.5 }),
        // central small stone table
        box(0.6, 0.5, 0.6, 0xc8b8a0, { y: 0.4 }),
        // roof ridge with finial
        box(2.6, 0.1, 0.15, 0xd04838, { y: 2.45 }),
        sph(0.15, 0xe0a83a, { ws: 5, hs: 3, y: 2.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 咾咕石街屋 (chunk landmark — coral stone street-house row) */
  {
    id: 'coral_streethouse_mass',
    displayName: '咾咕石街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xc8b8a0, 0xb8a890, 0xd0c0a8, 0xa89878, 0x9a8a70],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // a contiguous row of 4 abutting coral stone houses (連棟咾咕石厝)
      const parts = [];
      const heights = [1.4, 1.6, 1.5, 1.7];
      const xs = [-2.2, -0.75, 0.75, 2.2];
      const wallTints = [0xc8b8a0, 0xd0c0a8, 0xb8a890, 0xc0b098];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // coral stone wall body
        parts.push(box(1.35, h, 1.4, 0xffffff, { x: xs[i], y: h / 2, hex2: wallTints[i] }));
        // thick base course (台基)
        parts.push(box(1.4, 0.2, 1.45, 0xa89878, { x: xs[i], y: 0.1 }));
        // traditional red tile roof (閩式紅瓦)
        parts.push(box(1.5, 0.1, 1.55, 0xb85a3a, { x: xs[i], rz: (i % 2 === 0 ? 0.1 : -0.1), y: h + 0.1 }));
        // roof ridge
        parts.push(box(1.5, 0.06, 0.12, 0xc86a4a, { x: xs[i], y: h + 0.2 }));
        // wooden door
        parts.push(box(0.4, 0.6, 0.06, 0x8a3a2a, { x: xs[i], y: 0.4, z: 0.72 }));
        // small window
        if (i !== 2) {
          parts.push(box(0.28, 0.25, 0.06, 0x44506a, { x: xs[i] + 0.4, y: 0.8, z: 0.72 }));
        }
      }
      // connecting low coral stone wall between houses (wind break)
      parts.push(box(5.6, 0.5, 0.12, 0xb8a890, { y: 0.25, z: -0.72 }));
      // shared courtyard flagstone
      parts.push(box(5.6, 0.08, 1.0, 0x9a9080, { y: 0.04, z: 0.2 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 漁港牌樓 (chunk landmark — Penghu fishing harbor gate) -- */
  {
    id: 'harbor_gate',
    displayName: '漁港牌樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 12,
    radiusJitter: 0.15,
    spawnWeight: 0.3,
    palette: [0xc8b8a0, 0xb8a890, 0x2a6a8a, 0xa89878, 0xf0c050],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Penghu fishing harbor entrance gate (漁港牌樓) — welcomes boats back
      const parts = [
        // main gate structure — two tall coral stone pillar + arch
        box(0.8, 2.8, 0.8, 0xc8b8a0, { x: -1.8, y: 1.4 }), // left pillar
        box(0.8, 2.8, 0.8, 0xc8b8a0, { x: 1.8, y: 1.4 }), // right pillar
        // connecting beam
        box(4.5, 0.5, 0.7, 0xb8a890, { y: 2.5 }),
        // curved traditional roof on top
        cyl(1.2, 1.2, 4.8, 4, 0xb85a3a, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.0 }),
        // roof ridge
        box(4.8, 0.12, 0.15, 0xc86a4a, { y: 3.3 }),
        // upswept eave ends
        box(0.5, 0.1, 0.14, 0xe0a83a, { rz: 0.4, x: -2.5, y: 3.15 }),
        box(0.5, 0.1, 0.14, 0xe0a83a, { rz: -0.4, x: 2.5, y: 3.15 }),
        // harbor name signboard (lit)
        box(2.4, 0.6, 0.1, 0xffffff, { y: 2.7 }),
        box(2.2, 0.5, 0.05, 0xf0c050, { y: 2.7, z: 0.08 }), // golden text area
        // side decorative fish motifs (澎湖漁港 theme)
        sph(0.2, 0x2a6a8a, { ws: 5, hs: 3, x: -1.8, y: 2.1, z: 0.45 }), // fish decoration L
        sph(0.2, 0x2a6a8a, { ws: 5, hs: 3, x: 1.8, y: 2.1, z: 0.45 }), // fish decoration R
        // coral stone base
        box(4.8, 0.3, 1.2, 0xa89878, { y: 0.15 }),
        // anchor decorations at pillar bases
        torus(0.25, 0.05, 4, 6, 0x5a5248, { x: -1.8, y: 0.5, z: 0.5, rz: HALF_PI }),
        torus(0.25, 0.05, 4, 6, 0x5a5248, { x: 1.8, y: 0.5, z: 0.5, rz: HALF_PI }),
      ];
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
