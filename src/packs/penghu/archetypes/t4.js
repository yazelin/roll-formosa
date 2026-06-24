/**
 * @file packs/penghu/archetypes/t4.js — Roll Formosa Penghu pack, TIER 4
 * content: 馬公街區 (Magong streets & traditional structures).
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
  /* ---- slot 0: 咾咕石屋 (traditional coral stone house) -------------------- */
  {
    id: 'coral_stone_house',
    displayName: '咾咕石屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8a88c, 0x9a8a70, 0xc8b8a0, 0x8a7a60, 0xd0c0a8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Penghu coral stone house with thick walls and low profile
      const parts = [
        // thick coral stone walls (咾咕石)
        box(2.0, 1.2, 1.6, 0xffffff, { y: 0.6, hex2: 0xb8a88c }),
        box(2.06, 0.2, 1.66, 0x9a8a70, { y: 0.1 }), // stone foundation
        // traditional sloped roof with dark tiles
        box(2.3, 0.12, 1.9, 0x5a4a3a, { y: 1.35, rz: 0.15 }),
        box(2.3, 0.08, 0.12, 0x4a3a2a, { y: 1.45, z: 0.9, rz: 0.15 }), // roof edge
        // small window openings (to block wind)
        box(0.3, 0.25, 0.08, 0x2a3038, { x: -0.5, y: 0.7, z: 0.82 }),
        box(0.3, 0.25, 0.08, 0x2a3038, { x: 0.5, y: 0.7, z: 0.82 }),
        // wooden door
        box(0.4, 0.7, 0.06, 0x6a4a32, { y: 0.4, z: 0.82 }),
        // stone chimney (for cooking)
        box(0.3, 0.5, 0.3, 0x8a7a60, { x: -0.7, y: 1.4, z: -0.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 石滬 (stone weir fish trap) --------------------------------- */
  {
    id: 'stone_weir',
    displayName: '石滬',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7a8a, 0x8a9aa8, 0x5a6a78, 0xa0b0c0, 0x4a5a68],
    yOffset: -0.75,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Heart-shaped stone weir (雙心石滬 style)
      const parts = [
        // base water pool area
        cyl(1.8, 1.8, 0.15, 12, 0x4a7090, { y: 0.08 }),
        // stone wall forming the weir (heart shape simplified)
        // outer curved walls
        cyl(1.6, 1.6, 0.5, 10, 0x6a7a8a, { y: 0.35, theta0: 0, thetaLen: PI * 0.7 }),
        cyl(1.6, 1.6, 0.5, 10, 0x6a7a8a, { y: 0.35, theta0: PI * 0.7, thetaLen: PI * 0.7 }),
        // inner heart point
        box(0.4, 0.5, 1.0, 0x8a9aa8, { z: -0.5, y: 0.35 }),
        // stone texture blocks on top
        box(0.3, 0.2, 0.3, 0x5a6a78, { x: 1.2, z: 0.4, y: 0.5 }),
        box(0.3, 0.2, 0.3, 0x5a6a78, { x: -1.2, z: 0.4, y: 0.5 }),
        box(0.3, 0.2, 0.3, 0x5a6a78, { x: 0, z: 1.2, y: 0.5 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 超商 (convenience store — universal Taiwan) ----------------- */
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

  /* ---- slot 3: 垃圾車 (garbage truck — universal Taiwan) ------------------- */
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

  /* ---- slot 4: 仙人掌籬 (cactus fence) ------------------------------------- */
  {
    id: 'cactus_fence',
    displayName: '仙人掌籬',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a7a4a, 0x4a8a5a, 0x2a6a3a, 0x5a9a6a, 0x1a5a2a],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Traditional Penghu cactus fence (used as windbreak)
      const parts = [
        // stone base
        box(3.0, 0.3, 0.4, 0x9a8a78, { y: 0.15 }),
      ];
      // multiple cactus pads (opuntia style)
      const positions = [-1.1, -0.5, 0.1, 0.7, 1.2];
      for (let i = 0; i < positions.length; i++) {
        const x = positions[i];
        const h = 0.8 + (i % 2) * 0.3;
        // main pad (flat oval shape using squished box)
        parts.push(box(0.4, h, 0.15, 0x3a7a4a, { x, y: 0.5 + h / 2, hex2: 0x4a8a5a }));
        // secondary pad branching off
        if (i % 2 === 0) {
          parts.push(box(0.3, 0.5, 0.12, 0x4a8a5a, { x: x + 0.2, y: 1.0 + h * 0.3, rz: 0.4 }));
        }
        // cactus fruit (yellow prickly pear)
        if (i === 1 || i === 3) {
          parts.push(sph(0.1, 0xe8c040, { ws: 5, hs: 4, x: x + 0.15, y: 0.9 + h }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 漁筏 (fishing raft) ------------------------------------------ */
  {
    id: 'fishing_raft',
    displayName: '漁筏',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x3a6a9a, 0x4a7aaa, 0xe8e0d8, 0xc83838, 0x8a9098],
    yOffset: -0.68,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Traditional Penghu fishing boat
      const parts = [
        // hull (tapered box shape)
        box(3.2, 0.7, 1.0, 0xffffff, { y: 0.45, hex2: 0x3a6a9a }),
        // bow (pointed front)
        box(0.8, 0.5, 0.7, 0x3a6a9a, { x: 1.8, y: 0.35, rz: 0.2 }),
        // stern
        box(0.5, 0.6, 0.9, 0x3a6a9a, { x: -1.6, y: 0.4 }),
        // deck
        box(2.8, 0.1, 0.85, 0xc8b8a0, { y: 0.75 }),
        // wheelhouse
        box(0.8, 0.7, 0.7, 0xe8e0d8, { x: -0.5, y: 1.15 }),
        box(0.76, 0.3, 0.06, 0x4a7090, { x: -0.5, y: 1.25, z: 0.37 }), // window
        // red stripe (fishing boat tradition)
        box(3.3, 0.12, 0.06, 0xc83838, { y: 0.65, z: 0.52 }),
        // mast
        cyl(0.06, 0.06, 1.2, 6, 0x8a7a6a, { x: 0.5, y: 1.4 }),
        // fishing net rigging
        box(0.8, 0.06, 0.06, 0x8a9098, { x: 0.5, y: 1.9 }),
        // buoys
        sph(0.12, 0xe06030, { ws: 5, hs: 4, x: 1.0, y: 0.9, z: 0.4 }),
        sph(0.12, 0x3080e0, { ws: 5, hs: 4, x: 0.7, y: 0.9, z: 0.4 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 玄武岩壁 (basalt wall formation) ----------------------------- */
  {
    id: 'basalt_wall',
    displayName: '玄武岩壁',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.5,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a3a40, 0x4a4a50, 0x5a5a60, 0x2a2a30, 0x6a6a70],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Penghu's famous hexagonal basalt columns (大菓葉玄武岩)
      const parts = [];
      // base rock platform
      parts.push(box(2.5, 0.4, 1.8, 0x4a4a50, { y: 0.2 }));
      // hexagonal columns at varying heights (using 6-seg cylinders)
      const cols = [
        { x: -0.8, z: 0.3, h: 1.8 },
        { x: -0.3, z: 0.5, h: 2.2 },
        { x: 0.2, z: 0.4, h: 2.0 },
        { x: 0.7, z: 0.3, h: 1.6 },
        { x: -0.5, z: -0.3, h: 1.9 },
        { x: 0.0, z: -0.4, h: 2.1 },
        { x: 0.5, z: -0.3, h: 1.7 },
      ];
      for (const c of cols) {
        const tint = rng() < 0.5 ? 0x3a3a40 : 0x4a4a50;
        parts.push(cyl(0.28, 0.28, c.h, 6, tint, { x: c.x, z: c.z, y: 0.4 + c.h / 2 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 民宿 (bed and breakfast) ------------------------------------ */
  {
    id: 'guesthouse',
    displayName: '民宿',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e0d8, 0xf0e8e0, 0xd0c8c0, 0x4a8090, 0xc8c0b8],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Penghu style guesthouse (often renovated traditional houses)
      const parts = [
        // main building body
        towerBanded(2.0, 2.2, 1.4, 6, 0xffffff, 0x4a6a7a, 0xffd98a, rng, { y: 1.15 }),
        box(2.08, 0.12, 1.48, 0x8a8f9a, { y: 2.3 }), // roof slab
        box(2.04, 0.22, 1.44, 0xd0c8c0, { y: 0.14 }), // ground plinth
        // Mediterranean-style blue accents (common in Penghu tourism)
        box(0.5, 0.5, 0.05, 0x4a8090, { y: 0.55, z: 0.74 }), // entrance (blue door)
        box(1.8, 0.08, 0.06, 0x4a8090, { y: 1.0, z: 0.74 }), // blue trim
        // balcony with sea view
        box(1.6, 0.1, 0.4, 0xe8e0d8, { y: 1.5, z: 0.9 }),
        box(1.6, 0.3, 0.06, 0xffffff, { y: 1.65, z: 1.05 }), // railing
        // rooftop water tank
        cyl(0.24, 0.24, 0.4, 8, 0x3a6ea0, { x: 0.6, y: 2.55 }),
        // sign
        box(0.6, 0.25, 0.04, 0xc8a840, { x: -0.5, y: 1.8, z: 0.76 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 石頭屋群 (chunk landmark — stone house cluster) ------------- */
  {
    id: 'stone_house_cluster',
    displayName: '石頭屋群',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xb8a88c, 0x9a8a70, 0xc8b8a0, 0x5a4a3a, 0x8a7a60],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A cluster of traditional Penghu coral stone houses
      const parts = [];
      const houses = [
        { x: -1.8, z: 0.2, w: 1.6, h: 1.0, d: 1.3 },
        { x: -0.4, z: 0.4, w: 1.8, h: 1.2, d: 1.4 },
        { x: 1.2, z: 0.1, w: 1.5, h: 0.9, d: 1.2 },
        { x: 0.4, z: -0.6, w: 1.4, h: 1.0, d: 1.3 },
      ];
      for (let i = 0; i < houses.length; i++) {
        const h = houses[i];
        const tint = [0xb8a88c, 0xa89878, 0xc8b8a0, 0xb0a080][i];
        // house body
        parts.push(box(h.w, h.h, h.d, 0xffffff, { x: h.x, y: h.h / 2, z: h.z, hex2: tint }));
        // sloped roof
        parts.push(box(h.w * 1.1, 0.1, h.d * 1.1, 0x5a4a3a, { x: h.x, y: h.h + 0.1, z: h.z, rz: 0.12 }));
        // small door
        parts.push(box(0.25, 0.45, 0.05, 0x5a4030, { x: h.x, y: 0.25, z: h.z + h.d / 2 + 0.02 }));
      }
      // stone path between houses
      parts.push(box(4.5, 0.08, 0.6, 0x9a9088, { y: 0.04, z: 0.1 }));
      // well or cistern
      cyl(0.3, 0.3, 0.4, 8, 0x7a7068, { x: 2.0, z: -0.4, y: 0.2 });
      return finish(parts);
    },
  },

  /* ---- slot 9: 天后宮 (chunk landmark — Mazu temple) ------------------------ */
  {
    id: 'mazu_temple',
    displayName: '天后宮',
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
