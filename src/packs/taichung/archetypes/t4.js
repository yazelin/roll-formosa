/**
 * @file packs/taichung/archetypes/t4.js — Roll Formosa Taichung pack, TIER 4
 * content: 南屯老街與廟 (犁頭店 / 萬和宮一帶 — old-street shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/taichung/tiers.js TIERS[4].archetypeIds — slots [0..7]
 * absorbable street structures (spawnWeight 1.0), slots [8..9] repeatable
 * CHUNK LANDMARK masses (spawnWeight ~0.3, ~2.5–3x the tier's largest body).
 *
 * Pan-Taiwan generics kept verbatim from the shared street vocabulary
 * (透天厝 / 公寓 / 超商 / 公車). The 南屯-flavoured slots are localized: the
 * 犁頭店 brick old-street shophouse, the blacksmith forge that gave 犁頭店 its
 * name, the temple-court gold-paper furnace + outdoor opera stage of 萬和宮,
 * and the two chunk masses (連棟紅磚老街屋 row + 萬和宮 temple body).
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
  /* ---- slot 0: 透天厝 (narrow 3–4 storey townhouse) -------------------- */
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

  /* ---- slot 1: 老街街屋 (犁頭店 single-storey brick old-street house) -- */
  {
    id: 'oldstreet_shophouse',
    displayName: '老街街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xa84e34, 0xb86a44, 0xc8bca8, 0x7a4a32, 0xd8c8a8],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // squat red-brick shop body (閩南式紅磚街屋) — warm brick + plaster top band
        box(2.3, 1.1, 1.6, 0xb05a3a, { y: 0.55, hex2: 0xc06a46 }),
        box(2.34, 0.22, 1.64, 0xe6dcc6, { y: 1.18 }), // white plaster parapet band (商號匾)
        box(1.5, 0.16, 0.05, 0xc83828, { y: 1.18, z: 0.84 }), // 老字號 sign plate
        // low pitched tiled gable roof (紅瓦雙坡) — two leaning slabs
        box(1.5, 0.08, 1.78, 0x8a3a2a, { rz: 0.2, x: -0.55, y: 1.5 }), // tile slope L
        box(1.5, 0.08, 1.78, 0x8a3a2a, { rz: -0.2, x: 0.55, y: 1.5 }), // tile slope R
        box(0.12, 0.12, 1.8, 0x6a4a32, { y: 1.66 }), // ridge beam
        // 亭仔腳 (arcade) — a covered walk in front on two brick posts
        box(2.3, 0.14, 0.7, 0xd8c8a8, { y: 1.02, z: 1.0 }), // arcade canopy slab
        box(0.2, 0.95, 0.2, 0xa84e34, { x: -0.95, y: 0.48, z: 1.28 }), // arcade post L
        box(0.2, 0.95, 0.2, 0xa84e34, { x: 0.95, y: 0.48, z: 1.28 }), // arcade post R
        // shopfront — wooden plank board-up + half-door + small window
        box(1.0, 0.8, 0.05, 0x6a4a30, { x: -0.4, y: 0.5, z: 0.82 }), // wood plank shutter
        box(0.5, 0.85, 0.06, 0x4a3422, { x: 0.62, y: 0.52, z: 0.82 }), // dark wood door
        box(0.42, 0.4, 0.05, 0xf0d8a0, { x: -0.4, y: 0.62, z: 0.84 }), // warm interior glow
      ];
      // hanging paper lanterns under the arcade (老街攤鋪)
      parts.push(cyl(0.12, 0.12, 0.22, 7, 0xc83828, { x: -0.55, y: 0.86, z: 1.0 }));
      parts.push(cyl(0.12, 0.12, 0.22, 7, 0xc83828, { x: 0.55, y: 0.86, z: 1.0 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 公寓 (5-storey 老公寓 walk-up) -------------------------- */
  {
    id: 'apartment',
    displayName: '公寓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe2d8c8, 0xd0d8e0, 0xe0d0c4, 0xd6ddd0, 0xc8bca8],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // wide squat 5-floor banded slab (公寓比透天矮胖)
        towerBanded(2.0, 2.4, 1.3, 10, 0xffffff, 0x44506a, 0xffe0a0, rng, { y: 1.25 }),
        box(2.08, 0.12, 1.38, 0x8a8f9a, { y: 2.5 }), // roof slab
        box(2.04, 0.22, 1.34, 0xc8bca8, { y: 0.16 }), // ground plinth
        // rooftop clutter: water tanks + 鐵皮加蓋
        box(1.0, 0.5, 0.9, 0xb0563a, { x: -0.4, y: 2.8, hex2: 0xc8704a }), // tin penthouse
        cyl(0.26, 0.26, 0.42, 8, 0x3a6ea0, { x: 0.6, y: 2.78 }), // blue tank
        cyl(0.26, 0.26, 0.42, 8, 0x3a6ea0, { x: 0.95, y: 2.78 }), // blue tank
        box(0.5, 0.5, 0.05, 0x6a7078, { y: 0.55, z: 0.7 }), // entrance gate
        box(2.06, 0.12, 0.06, 0xc83828, { y: 2.18, z: 0.66 }), // top trim band
      ];
      // characteristic 鐵窗 (security-grille) cages on each floor face
      for (let f = 0; f < 4; f++) {
        const y = 0.9 + f * 0.5;
        parts.push(box(0.5, 0.34, 0.16, 0xd8d4cc, { x: -0.55, y, z: 0.66 })); // grille cage L
        parts.push(box(0.5, 0.34, 0.16, 0xd8d4cc, { x: 0.55, y, z: 0.66 })); // grille cage R
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

  /* ---- slot 5: 打鐵爐 (犁頭店 blacksmith brick forge + chimney) ------- */
  {
    id: 'blacksmith_forge',
    displayName: '打鐵爐',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x7a4a36, 0x8a3a2a, 0x44484f, 0xc06a2a, 0x9aa0aa],
    yOffset: -0.46,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // open-fronted brick forge shed (打鐵舖) — soot-stained brick walls
        box(2.4, 1.2, 1.7, 0x8a4a36, { y: 0.6, hex2: 0x6a3a28 }),
        box(2.44, 0.16, 1.74, 0x5a3424, { y: 1.24 }), // dark eave band
        // single-slope tin roof, smoke-darkened
        box(2.7, 0.1, 1.9, 0x44484f, { rz: 0.14, y: 1.5 }),
        box(2.7, 0.05, 0.12, 0x2a2c32, { rz: 0.14, y: 1.52, z: 0.92 }), // front eave
        // the brick hearth/furnace block with glowing fire mouth (爐口)
        box(0.9, 0.8, 0.8, 0x7a4234, { x: -0.6, y: 0.4, z: 0.4, hex2: 0x5a3022 }),
        box(0.46, 0.42, 0.05, 0xff7a2a, { x: -0.6, y: 0.42, z: 0.82, hex2: 0xffd060 }), // glowing coals
        // tall brick chimney venting the forge
        box(0.44, 1.7, 0.44, 0x7a4234, { x: -0.6, y: 1.45, z: 0.0, hex2: 0x5a3022 }),
        cyl(0.18, 0.2, 0.24, 6, 0x35373d, { x: -0.6, y: 2.34 }), // chimney cap
        // the anvil (鐵砧) on a stump out front — the blacksmith's defining tool
        box(0.18, 0.16, 0.42, 0x2a2c32, { x: 0.7, y: 0.62, z: 0.9 }), // anvil body
        cyl(0.12, 0.16, 0.4, 7, 0x5a3a24, { x: 0.7, y: 0.34, z: 0.9 }), // wooden stump
        // a board of plow blades + tools (犁頭 — the namesake of 犁頭店)
        box(0.06, 0.7, 0.7, 0x6a4a30, { x: 0.95, y: 0.7, z: -0.2 }), // tool board
        cone(0.16, 0.4, 4, 0x9aa0aa, { rz: HALF_PI, x: 1.04, y: 0.9, z: -0.35 }), // hung plow blade
        cone(0.14, 0.36, 4, 0x8a9098, { rz: HALF_PI, x: 1.04, y: 0.55, z: -0.05 }), // hung plow blade
        box(0.05, 0.5, 0.06, 0x35373d, { x: 1.02, y: 0.62, z: 0.2 }), // hung tongs
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 廟前金爐 (temple-court gold-paper burning furnace) ----- */
  {
    id: 'temple_gold_furnace',
    displayName: '廟前金爐',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xc23a26, 0xd2402a, 0xe0a83a, 0xb83422, 0x9aa0aa],
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // stone base platform on the 廟埕
        box(1.9, 0.3, 1.9, 0x9aa0aa, { y: 0.15 }),
        // tapered red-tiled furnace body (爐身) — vermilion with warm interior
        box(1.4, 1.5, 1.4, 0xffffff, { y: 1.05, hex2: 0xd2402a }),
        box(1.1, 0.9, 1.1, 0xc23426, { y: 1.7, hex2: 0xb02e22 }), // upper narrower drum
        // glowing burning mouth where 金紙 goes in (front opening)
        box(0.6, 0.6, 0.08, 0x2a1410, { y: 0.85, z: 0.72 }), // mouth recess (dark)
        box(0.5, 0.46, 0.06, 0xff7a2a, { y: 0.84, z: 0.76, hex2: 0xffd060 }), // glowing fire
        box(0.86, 0.16, 0.06, 0xe0a83a, { y: 1.2, z: 0.72 }), // gold lintel plaque (爐額)
        // octagon-ish hipped tile roof on the furnace (廟式爐頂) via low-seg cone
        cone(1.1, 0.7, 8, 0x2e5a3a, { y: 2.3 }), // green-glaze tiled cap
        box(1.0, 0.1, 1.0, 0xe0a83a, { y: 1.96 }), // golden eave fascia
        // little upswept ridge ornaments + finial (廟味)
        box(0.5, 0.1, 0.14, 0xe0a83a, { rz: 0.5, x: -0.5, y: 2.18 }), // ridge tail L
        box(0.5, 0.1, 0.14, 0xe0a83a, { rz: -0.5, x: 0.5, y: 2.18 }), // ridge tail R
        sph(0.16, 0xe0a83a, { ws: 6, hs: 4, y: 2.66 }), // 葫蘆 finial
        cone(0.1, 0.26, 6, 0xe0a83a, { y: 2.86 }),
        // wisp of smoke (light grey) rising from the roof vent
        cyl(0.05, 0.07, 0.4, 5, 0xc8ccd2, { y: 3.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 廟埕戲台 (萬和宮 outdoor 字姓戲 opera stage) ------------ */
  {
    id: 'temple_opera_stage',
    displayName: '廟埕戲台',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.5,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xc23a26, 0xe0a83a, 0xd2402a, 0x6a4a30, 0xb83422],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // raised wooden stage deck (戲台板) on a red skirt
        box(3.0, 0.5, 2.0, 0xc23426, { y: 0.25, hex2: 0xa02a20 }), // stage skirt (red)
        box(3.0, 0.16, 2.0, 0x6a4a30, { y: 0.55 }), // wooden stage floor
        // red backdrop wall at the rear with gold trim (後台屏)
        box(2.8, 1.3, 0.12, 0xffffff, { y: 1.3, z: -0.8, hex2: 0xd2402a }),
        box(2.6, 0.2, 0.06, 0xe0a83a, { y: 1.86, z: -0.74 }), // gold top trim
        box(1.0, 0.5, 0.06, 0x2a1410, { y: 1.0, z: -0.72 }), // dark stage-door opening
        // four vermilion stage posts holding the canopy
        cyl(0.12, 0.12, 1.6, 6, 0xc23426, { x: -1.25, z: 0.7, y: 1.4 }),
        cyl(0.12, 0.12, 1.6, 6, 0xc23426, { x: 1.25, z: 0.7, y: 1.4 }),
        cyl(0.12, 0.12, 1.6, 6, 0xc23426, { x: -1.25, z: -0.7, y: 1.4 }),
        cyl(0.12, 0.12, 1.6, 6, 0xc23426, { x: 1.25, z: -0.7, y: 1.4 }),
        // curved tiled canopy roof (歇山式戲台頂) via low-seg half-cylinder
        cyl(1.05, 1.05, 3.3, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.55, y: 2.3 }),
        box(3.4, 0.12, 2.3, 0xe0a83a, { y: 2.12 }), // golden eave fascia
        box(3.1, 0.16, 0.2, 0xc94f46, { y: 2.7 }), // ridge beam
        // upswept swallow-tail ridge ends (燕尾) — temple-stage silhouette
        box(0.6, 0.12, 0.18, 0xe0a83a, { rz: 0.5, x: -1.7, y: 2.78 }),
        box(0.6, 0.12, 0.18, 0xe0a83a, { rz: -0.5, x: 1.7, y: 2.78 }),
        // a hanging red banner + paper lanterns at the front (酬神戲)
        box(0.7, 0.5, 0.05, 0xc83828, { y: 1.7, z: 0.74 }), // banner cloth
        box(0.6, 0.16, 0.05, 0xe0a83a, { y: 1.9, z: 0.76 }), // banner gold header
      ];
      parts.push(cyl(0.14, 0.14, 0.28, 7, 0xc83828, { x: -1.0, y: 1.9, z: 0.7 })); // lantern L
      parts.push(cyl(0.14, 0.14, 0.28, 7, 0xc83828, { x: 1.0, y: 1.9, z: 0.7 })); // lantern R
      return finish(parts);
    },
  },

  /* ---- slot 8: 老街街屋 (chunk landmark — 連棟紅磚老街屋 row mass) - */
  {
    id: 'oldstreet_row_mass',
    displayName: '老街街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xa84e34, 0xb86a44, 0xc8bca8, 0x8a3a2a, 0xd8c8a8],
    yOffset: -0.46,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // a contiguous row of 4 閩南-style brick old-street houses (南屯老街連棟街屋)
      const parts = [];
      const heights = [1.5, 1.7, 1.5, 1.8];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const brickTints = [0xb05a3a, 0xa84e34, 0xb86a46, 0x9a4a32];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // squat brick body + white plaster 商號 parapet (老街立面)
        parts.push(box(1.32, h, 1.4, brickTints[i], { x: xs[i], y: h / 2, hex2: 0xc06a46 }));
        parts.push(box(1.36, 0.2, 1.44, 0xe6dcc6, { x: xs[i], y: h + 0.1 })); // plaster parapet band
        parts.push(box(0.9, 0.14, 0.05, 0xc83828, { x: xs[i], y: h + 0.04, z: 0.74 })); // 老字號 sign
        // low red-tile shallow gable cap per house (起伏的紅瓦稜線)
        parts.push(box(1.4, 0.1, 1.5, 0x8a3a2a, { rz: i % 2 ? 0.12 : -0.12, x: xs[i], y: h + 0.3 }));
      }
      // continuous 亭仔腳 (arcade walk) across the whole street front
      parts.push(box(5.8, 0.18, 0.7, 0xd8c8a8, { y: 1.05, z: 0.62 })); // arcade canopy
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.22, 0.95, 0.22, 0xa84e34, { x: -2.4 + i * 1.2, y: 0.48, z: 0.92 })); // brick post
      }
      // warm shopfront glows along the walk (the lit old-street row)
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.6, 0.34, 0.05, 0xf0d8a0, { x: -2.1 + i * 1.4, y: 0.55, z: 0.68 })); // shop glow
      }
      return finish(parts);
    },
  },

  /* ---- slot 9: 萬和宮 (chunk landmark — Wanhe temple mass, 燕尾脊) - */
  {
    id: 'wanhe_temple_mass',
    displayName: '萬和宮',
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
        // main hall body — red walls + warm interior glow (萬和宮正殿)
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
