/**
 * @file packs/kinmen/archetypes/t4.js — Roll Formosa Kinmen pack, TIER 4
 * content: 洋樓與宗祠 (Mansions & ancestral halls).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/kinmen/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 透天厝 (narrow townhouse — generic Taiwan) --------------- */
  {
    id: 'townhouse',
    displayName: '透天厝',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8ddc8, 0xd9c8b0, 0xcfd6d0, 0xe0d2c0, 0xd0c4b4],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // tall narrow banded body (深長街屋), tinted plaster + warm windows
        towerBanded(1.0, 2.6, 1.5, 8, 0xffffff, 0x40506a, 0xffd98a, rng, { y: 1.4 }),
        box(1.1, 0.12, 1.6, 0x8a8f9a, { y: 2.76 }), // flat roof slab
        box(1.12, 0.22, 1.62, 0xc8bca8, { y: 0.22 }), // ground-floor plinth
        // rooftop 加蓋 (illegal-extension tin penthouse — very Taiwan)
        box(0.8, 0.5, 1.1, 0xb0563a, { y: 3.06, hex2: 0xc8704a }),
        cyl(0.95, 0.95, 1.2, 4, 0x9a4a32, { theta0: PI, rx: HALF_PI, sy: 0.4, x: 0.0, y: 3.5, z: 0.0 }), // gable tin cap
        cyl(0.16, 0.16, 0.5, 6, 0xc8ccd2, { x: 0.45, y: 3.55 }), // rooftop water tank pipe
        box(0.36, 0.32, 0.36, 0x5a6e8a, { x: -0.25, y: 3.4 }), // rooftop blue water tank
        // street-level shutter + tenant sign strip
        box(0.92, 0.6, 0.06, 0x7a8088, { y: 0.5, z: 0.78 }), // roll shutter
        box(0.78, 0.18, 0.05, 0xc83828, { y: 0.94, z: 0.8 }), // shop sign band
      ];
      // stacked balconies with rail + AC unit per floor (公寓陽台 rhythm)
      for (let i = 0; i < 3; i++) {
        const y = 0.95 + i * 0.62;
        parts.push(box(1.06, 0.1, 0.12, 0xd8d4cc, { y, z: 0.78 })); // balcony rail
        if (i < 2) parts.push(box(0.26, 0.22, 0.18, 0xe2e2dc, { x: 0.36, y: y + 0.16, z: 0.74 })); // window AC
      }
      return finish(parts);
    },
  },

  /* ---- slot 1: 閩南洋樓 (Minnan-style mansion — Kinmen signature) ------- */
  {
    id: 'minnan_mansion',
    displayName: '閩南洋樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8dcc8, 0xd2c0a8, 0x8a7a5a, 0xc83a28, 0x3a5a4a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Kinmen Minnan-style two-story mansion with Western/colonial influences
      const parts = [
        // main body (閩南洋樓 — distinctive Kinmen architecture)
        box(2.8, 2.0, 2.0, 0xe8dcc8, { y: 1.0 }), // cream plaster walls
        box(2.9, 0.15, 2.1, 0xd2c0a8, { y: 0.08 }), // stone foundation
        // second floor with arched windows (洋樓特色)
        box(2.7, 0.8, 1.9, 0xf0e4d4, { y: 2.4 }),
        // traditional hip roof (燕尾脊風格)
        cyl(1.2, 1.2, 3.0, 4, 0x8a5a4a, { theta0: PI, rx: HALF_PI, sy: 0.45, y: 3.0 }),
        // roof ridge
        box(3.0, 0.12, 0.18, 0xc83a28, { y: 3.35 }),
        // front arcade with columns (洋樓騎樓)
        box(2.6, 0.2, 0.8, 0xe0d4c4, { y: 0.9, z: 1.1 }), // arcade ceiling
      ];
      // arcade columns (3 round columns, colonial style)
      for (let i = 0; i < 3; i++) {
        const x = -0.8 + i * 0.8;
        parts.push(cyl(0.1, 0.12, 0.85, 6, 0xf0e8dc, { x, y: 0.48, z: 1.35 }));
        parts.push(box(0.22, 0.08, 0.22, 0xe0d4c4, { x, y: 0.92, z: 1.35 })); // capital
      }
      // arched windows on second floor (2 windows)
      for (let i = 0; i < 2; i++) {
        const x = -0.5 + i * 1.0;
        parts.push(box(0.35, 0.45, 0.08, 0x44484f, { x, y: 2.4, z: 1.0 })); // window
        parts.push(cyl(0.18, 0.18, 0.1, 6, 0xf0e4d4, { x, y: 2.68, z: 1.0, theta0: 0, thetaLen: PI, rx: HALF_PI })); // arch top
      }
      // main entrance
      parts.push(box(0.6, 0.7, 0.08, 0x5a4a38, { y: 0.4, z: 1.02 })); // wooden door
      parts.push(box(0.7, 0.1, 0.1, 0xc83a28, { y: 0.78, z: 1.02 })); // door lintel
      return finish(parts);
    },
  },

  /* ---- slot 2: 番仔樓 (Western-influenced building — Kinmen) ------------ */
  {
    id: 'fanzi_lou',
    displayName: '番仔樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.5,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe0d4c0, 0x9a8a6a, 0xc04a3a, 0x4a6a4a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 番仔樓 — Overseas Chinese baroque mansion with elaborate facade
      const parts = [
        // main building body
        box(2.4, 2.2, 1.8, 0xf0e8d8, { y: 1.1 }),
        box(2.5, 0.12, 1.9, 0x9a8a6a, { y: 0.06 }), // stone base
        // elaborate parapet top (巴洛克風格女兒牆)
        box(2.5, 0.4, 0.2, 0xe8dcc8, { y: 2.4, z: 0.85 }),
        box(0.3, 0.5, 0.15, 0xe0d4c0, { x: -1.0, y: 2.55, z: 0.85 }), // parapet finial L
        box(0.3, 0.5, 0.15, 0xe0d4c0, { x: 1.0, y: 2.55, z: 0.85 }), // parapet finial R
        box(0.6, 0.6, 0.15, 0xe0d4c0, { y: 2.6, z: 0.85 }), // central parapet crest
        // decorative horizontal bands
        box(2.42, 0.08, 1.82, 0xc8bca8, { y: 1.2 }),
        box(2.42, 0.08, 1.82, 0xc8bca8, { y: 2.0 }),
        // windows with decorative frames
        box(0.4, 0.5, 0.08, 0x44484f, { x: -0.7, y: 1.5, z: 0.92 }),
        box(0.4, 0.5, 0.08, 0x44484f, { x: 0.7, y: 1.5, z: 0.92 }),
        box(0.5, 0.08, 0.1, 0xc04a3a, { x: -0.7, y: 1.8, z: 0.94 }), // window lintel L
        box(0.5, 0.08, 0.1, 0xc04a3a, { x: 0.7, y: 1.8, z: 0.94 }), // window lintel R
        // entrance with columns
        box(0.55, 0.9, 0.08, 0x5a4a38, { y: 0.5, z: 0.92 }), // door
        cyl(0.08, 0.1, 1.0, 6, 0xf0e4d4, { x: -0.4, y: 0.55, z: 0.95 }), // column L
        cyl(0.08, 0.1, 1.0, 6, 0xf0e4d4, { x: 0.4, y: 0.55, z: 0.95 }), // column R
        // tiled hip roof
        cyl(1.0, 1.0, 2.6, 4, 0xc04a3a, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 2.55 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 超商 (convenience store — generic Taiwan) ---------------- */
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

  /* ---- slot 4: 公車 (island bus — smaller for island) ------------------- */
  {
    id: 'island_bus',
    displayName: '公車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.5,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe8e8e2, 0x2a7a4a, 0xd0a030, 0xe0a83a, 0x8a9098],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Smaller island mini-bus (比市區公車小)
      const parts = [
        box(2.4, 0.85, 1.0, 0xffffff, { y: 0.85 }), // bus body (tinted)
        box(2.44, 0.16, 1.02, 0x2a7a4a, { y: 0.45 }), // lower green livery band (Kinmen color)
        box(2.3, 0.3, 1.04, 0x28323e, { y: 1.08 }), // continuous window band (dark)
        box(2.2, 0.06, 0.9, 0xd2d6dc, { y: 1.32 }), // roof
        box(0.7, 0.14, 0.94, 0xd0a030, { x: 0.9, y: 1.28 }), // roof route sign (gold)
        box(2.46, 0.4, 0.04, 0xffffff, { z: 0.54, y: 0.85, hex2: 0xeef2f6 }), // side panel sheen
        // windshield + headlights front
        box(0.06, 0.36, 0.98, 0x35414e, { x: 1.22, y: 1.0 }), // windshield
        box(0.06, 0.1, 0.18, 0xffe9a0, { x: 1.24, y: 0.56, z: 0.36 }), // headlight R
        box(0.06, 0.1, 0.18, 0xffe9a0, { x: 1.24, y: 0.56, z: -0.36 }), // headlight L
        box(0.05, 0.6, 0.4, 0x35414e, { x: -1.0, y: 0.8, z: 0.42 }), // folding door
      ];
      // 4 wheels (smaller bus)
      const wx = [0.9, 0.9, -0.8, -0.8];
      const wz = [0.5, -0.5, 0.5, -0.5];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.26, 0.26, 0.18, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.26 })); // tire
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 垃圾車 (garbage truck — generic Taiwan) ------------------ */
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

  /* ---- slot 6: 加油站 (gas station — generic Taiwan) -------------------- */
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

  /* ---- slot 7: 騎樓柱列 (arcade pillar colonnade — generic Taiwan) ------ */
  {
    id: 'arcade_pillar',
    displayName: '騎樓柱列',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8cdb8, 0xc8bca8, 0xe0d2c0, 0xcfd6d0, 0xb8ac98],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // the slab beam the storefront sits under (騎樓 ceiling)
        box(3.2, 0.3, 1.2, 0xffffff, { y: 2.0, hex2: 0xe6dcc8 }),
        box(3.24, 0.12, 1.24, 0xb8ac98, { y: 2.2 }), // upper edge band (street-house above)
        box(2.0, 0.5, 1.0, 0xcfd6d0, { z: -0.4, y: 1.4 }), // rear shop wall recess
      ];
      // 4 square arcade columns with capital + base
      const cx = [-1.35, -0.45, 0.45, 1.35];
      for (let i = 0; i < cx.length; i++) {
        parts.push(box(0.34, 1.7, 0.34, 0xffffff, { x: cx[i], y: 0.95 })); // column shaft (tinted)
        parts.push(box(0.46, 0.16, 0.46, 0xc8bca8, { x: cx[i], y: 1.82 })); // capital
        parts.push(box(0.46, 0.18, 0.46, 0xb8ac98, { x: cx[i], y: 0.16 })); // base
        // small shop signboard between alternating columns
        if (i < cx.length - 1 && i % 2 === 0) {
          parts.push(box(0.74, 0.3, 0.06, 0xc83828, { x: cx[i] + 0.45, y: 1.62, z: 0.5 })); // sign
          parts.push(box(0.6, 0.18, 0.05, 0xfff2c0, { x: cx[i] + 0.45, y: 1.62, z: 0.54 })); // lit sign face
        }
      }
      // hanging shop lanterns/lamps under the beam
      parts.push(cyl(0.12, 0.12, 0.2, 7, 0xe0a83a, { x: -0.9, y: 1.78 }));
      parts.push(cyl(0.12, 0.12, 0.2, 7, 0xe0a83a, { x: 0.9, y: 1.78 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 洋樓街屋 (chunk landmark — mansion streethouse row) ------ */
  {
    id: 'mansion_streethouse',
    displayName: '洋樓街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xe8dcc8, 0xd2c0a8, 0xc04a3a, 0x8a7a5a, 0xf0e4d4],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A row of connected Kinmen-style mansions (金門洋樓連棟)
      const parts = [];
      const heights = [2.4, 2.8, 2.2, 2.6];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallHex = [0xe8dcc8, 0xf0e4d4, 0xe8dcc8, 0xf0e4d4];

      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // mansion body
        parts.push(box(1.3, h, 1.3, wallHex[i], { x: xs[i], y: h / 2 }));
        // stone foundation
        parts.push(box(1.36, 0.12, 1.36, 0x8a7a5a, { x: xs[i], y: 0.06 }));
        // traditional roof
        parts.push(cyl(0.8, 0.8, 1.5, 4, 0xc04a3a, { theta0: PI, rx: HALF_PI, sy: 0.4, x: xs[i], y: h + 0.28 }));
        // decorative parapet
        if (i % 2 === 0) {
          parts.push(box(1.1, 0.25, 0.1, 0xd2c0a8, { x: xs[i], y: h + 0.12, z: 0.65 }));
        }
        // arched window
        parts.push(box(0.3, 0.4, 0.08, 0x44484f, { x: xs[i], y: h * 0.55, z: 0.68 }));
        // wooden door
        parts.push(box(0.35, 0.6, 0.08, 0x5a4a38, { x: xs[i], y: 0.35, z: 0.68 }));
      }
      // connecting stone path
      parts.push(box(5.8, 0.15, 0.6, 0x9a8a6a, { y: 0.08, z: 0.5 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 大宗祠 (chunk landmark — grand ancestral hall) ----------- */
  {
    id: 'grand_ancestral_hall',
    displayName: '大宗祠',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 12,
    radiusJitter: 0.15,
    spawnWeight: 0.3,
    palette: [0xc83a28, 0xe0a83a, 0x8a7a5a, 0x3a5a4a, 0xf0e4d4],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Kinmen grand ancestral hall (宗祠) — important clan temple
      const parts = [
        // raised stone platform (祠堂台基)
        box(4.4, 0.35, 3.0, 0x8a7a5a, { y: 0.18 }),
        // main hall body — red walls
        box(3.6, 1.4, 2.2, 0xffffff, { y: 1.05, hex2: 0xc83a28 }),
        // front vermilion columns (龍柱)
      ];
      const cx = [-1.4, -0.5, 0.5, 1.4];
      for (let i = 0; i < cx.length; i++) {
        parts.push(cyl(0.14, 0.16, 1.4, 6, 0xc83a28, { x: cx[i], z: 1.1, y: 1.05 }));
      }
      // sweeping double-eave hip roof (燕尾脊)
      parts.push(cyl(1.7, 1.7, 4.0, 4, 0x3a5a4a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.0 })); // lower eave (green glaze)
      parts.push(box(4.1, 0.12, 2.6, 0xe0a83a, { y: 1.85 })); // golden eave fascia
      parts.push(cyl(1.2, 1.2, 3.6, 4, 0x3a5a4a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.65 })); // upper roof
      // central ridge beam with ornament
      parts.push(box(3.8, 0.18, 0.22, 0xc83a28, { y: 3.05 }));
      // 燕尾脊 — upswept swallow-tail ridge ends
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -2.05, y: 3.15 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 2.05, y: 3.15 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.7, y: 2.7 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.7, y: 2.7 }));
      // central roof finial
      parts.push(sph(0.22, 0xe0a83a, { ws: 6, hs: 4, y: 3.28 }));
      parts.push(cone(0.16, 0.4, 6, 0xe0a83a, { y: 3.6 }));
      // entrance steps + dark double doors
      parts.push(box(3.2, 0.16, 0.5, 0x9a8a6a, { y: 0.44, z: 1.35 }));
      parts.push(box(1.1, 1.0, 0.08, 0x6a2a1a, { y: 0.9, z: 1.12 })); // temple doors
      parts.push(box(1.14, 0.2, 0.1, 0xe0a83a, { y: 1.45, z: 1.12 })); // door lintel plaque
      // stone lion guardians at entrance
      parts.push(box(0.3, 0.4, 0.25, 0x8a8078, { x: -0.9, y: 0.55, z: 1.3 }));
      parts.push(box(0.3, 0.4, 0.25, 0x8a8078, { x: 0.9, y: 0.55, z: 1.3 }));
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
