/**
 * @file packs/kaohsiung/archetypes/t0.js — Roll Formosa Kaohsiung pack, TIER 0
 *   鹽埕柑仔店桌頭 (corner-store tabletop trinkets), the smallest absorbable band
 *   (radiusNominal 0.01–0.05 m). 10 ArchetypeDefs, ids FROZEN by
 *   packs/kaohsiung/tiers.js TIERS[0].archetypeIds (slots [0..7] absorbable,
 *   slots [8..9] = chunk landmarks 戳戳樂板 / 籤筒, spawnWeight ~0.3).
 *
 * Authored ONLY with the engine geometry vocabulary (geomHelpers.js):
 * box/cyl/cone/sph/ico/torus + paint/xf + finish (merge → recenter →
 * normalize to a UNIT bounding sphere of radius 1.0). The geometry math is an
 * engine red line — we compose primitives, never touch the math.
 *
 * Conventions inherited from the pack catalog:
 *   - Each buildGeometry(rng) returns ONE merged, vertex-colored geometry,
 *     <= 350 triangles (radial segment counts kept ~6-10).
 *   - palette[] is applied per-instance via instanceColor; the "body" part is
 *     baked near-white (0xffffff) so the palette tint shows, while fixed-detail
 *     parts (metal, dark print) are baked with concrete hexes.
 *   - yOffset = -1 - minY_of_normalized_geo (so a ground-sitting object reads
 *     -0.5..-1; a centered object ~0). Measured from the normalized geometry.
 *   - rng() (0..1) only nudges small variation, never structure (determinism).
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T0_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] container_keychain 貨櫃鑰匙圈 — mini shipping container charm   */
  /* ---------------------------------------------------------------- */
  {
    id: 'container_keychain',
    displayName: '貨櫃鑰匙圈',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.012,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc2562b, 0x2f6db0, 0x3f8a47, 0xd8c24a, 0xe04a4a],
    yOffset: -0.58, // box lying flat
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const hull = 0xffffff; // tinted to container colors
      return finish([
        // mini shipping container body
        box(1.8, 0.7, 0.65, hull, { y: 0.35 }),
        // corrugation ribs on side
        box(0.04, 0.6, 0.02, 0x2a2c30, { x: -0.5, y: 0.35, z: 0.34 }),
        box(0.04, 0.6, 0.02, 0x2a2c30, { x: 0.0, y: 0.35, z: 0.34 }),
        box(0.04, 0.6, 0.02, 0x2a2c30, { x: 0.5, y: 0.35, z: 0.34 }),
        // top rail
        box(1.84, 0.06, 0.68, 0x2a2c30, { y: 0.72 }),
        // keyring loop
        torus(0.12, 0.025, 4, 8, 0xc8ccd4, { x: 0.95, y: 0.55, rz: HALF_PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] marlin_fishcake 旗魚黑輪 — iconic Kaohsiung marlin fishcake skewer */
  /* ---------------------------------------------------------------- */
  {
    id: 'marlin_fishcake',
    displayName: '旗魚黑輪',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.018,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8a060, 0xd4a868, 0xb89050, 0xd0a060, 0xc49858],
    yOffset: -0.15, // skewer upright (= -1 - minY of normalized geo)
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // golden-brown fishcake cylinder (fried 黑輪)
        cyl(0.55, 0.5, 1.4, 8, 0xffffff, { y: 1.0, hex2: 0xe8c898 }),
        // fried crust texture bumps
        sph(0.18, 0xd8b070, { ws: 5, hs: 3, x: 0.4, y: 0.8, z: 0.2 }),
        sph(0.15, 0xd0a860, { ws: 5, hs: 3, x: -0.35, y: 1.2, z: 0.3 }),
        // bamboo skewer poking through
        cyl(0.06, 0.06, 2.6, 5, 0xe0c890, { y: 0.8 }),
        // skewer tip
        cone(0.06, 0.2, 5, 0xd8c088, { y: -0.55, rx: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] cijin_shell 旗津貝殼 — Cijin beach seashell souvenir            */
  /* ---------------------------------------------------------------- */
  {
    id: 'cijin_shell',
    displayName: '旗津貝殼',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.01,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf5e8d8, 0xe8d4c0, 0xd8c4b0, 0xf0dcc8, 0xc8b098],
    yOffset: -0.65, // shell lying flat
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // scallop shell body (half sphere, flattened)
        sph(1.0, 0xffffff, { ws: 8, hs: 5, thetaLen: HALF_PI, y: 0.3, sy: 0.5 }),
        // radiating ribs on the shell
        box(0.08, 0.06, 0.9, 0xd8c4a8, { x: -0.4, y: 0.32, rz: -0.15 }),
        box(0.08, 0.06, 0.9, 0xd8c4a8, { x: 0.0, y: 0.35 }),
        box(0.08, 0.06, 0.9, 0xd8c4a8, { x: 0.4, y: 0.32, rz: 0.15 }),
        // hinge area at the back
        sph(0.25, 0xc8b4a0, { ws: 5, hs: 3, y: 0.2, z: -0.8 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] soda_cap 黑松汽水蓋 — shallow crimped soda-bottle crown cap     */
  /* ---------------------------------------------------------------- */
  {
    id: 'soda_cap',
    displayName: '黑松汽水蓋',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.013,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd83a2e, 0x2f64c8, 0x1f9e4a, 0xf0b429, 0xcfd4da],
    yOffset: -0.76, // crown sitting flat-down (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        cyl(1.0, 1.0, 0.16, 14, 0xffffff, { y: 0.42 }), // top disc (printed face, tinted)
        cyl(1.04, 1.04, 0.4, 14, 0xffffff, { y: 0.2 }), // crimped skirt (tinted)
        cyl(0.6, 0.6, 0.06, 12, 0xf2f2f4, { y: 0.51 }), // pale logo medallion
        cyl(0.34, 0.34, 0.08, 10, 0x1f6f3a, { y: 0.53 }), // 黑松 green brand dot
      ];
      // crimp teeth around the skirt (low-count ring of tiny boxes)
      const teeth = 12;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * PI * 2;
        parts.push(box(0.14, 0.42, 0.1, 0xe8eaee, { x: Math.cos(a) * 1.04, z: Math.sin(a) * 1.04, ry: -a, y: 0.2 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] preserved_fruit 鹹酸甜 — dried preserved-plum 蜜餞 snack         */
  /*     knobbly squashed plum dusted with sugar/liquorice powder        */
  /* ---------------------------------------------------------------- */
  {
    id: 'preserved_fruit',
    displayName: '鹹酸甜',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.014,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x8a4a2b, 0x6f3a22, 0xa05a30, 0x7d4226, 0x934e2c],
    yOffset: -0.66, // resting on the table (= -1 - minY of normalized geo)
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // squashed plum body (low-detail icosa reads as a knobbly preserved fruit)
        ico(0.95, 1, 0xffffff, { y: 0.55, sy: 0.72 }), // dark preserved-plum flesh (tinted brown)
        // sugar / liquorice powder dusting — a few pale clumps on top
        ico(0.22, 0, 0xe9dcc2, { x: 0.22, z: 0.0, y: 0.96 }),
        ico(0.18, 0, 0xe9dcc2, { x: -0.28, z: 0.24, y: 0.9 }),
        ico(0.16, 0, 0xe9dcc2, { x: 0.05, z: -0.32, y: 0.92 }),
        // stem nub / pucker at the crown
        cone(0.14, 0.26, 6, 0x3c2114, { y: 1.04 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] dock_rope_coil 港邊繩圈 — dockside mooring rope coil             */
  /* ---------------------------------------------------------------- */
  {
    id: 'dock_rope_coil',
    displayName: '港邊繩圈',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.02,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc8a870, 0xb89860, 0xd8b880, 0xa88850, 0xc0a068],
    yOffset: -0.75, // coil lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // coiled rope layers (concentric tori stacked)
      parts.push(torus(0.75, 0.14, 6, 10, 0xffffff, { y: 0.14, rx: HALF_PI }));
      parts.push(torus(0.55, 0.13, 6, 10, 0xffffff, { y: 0.26, rx: HALF_PI, hex2: 0xe8d4b0 }));
      parts.push(torus(0.38, 0.12, 6, 8, 0xffffff, { y: 0.36, rx: HALF_PI }));
      // loose rope end trailing off
      cyl(0.08, 0.08, 0.6, 5, 0xc8a870, { x: 0.8, y: 0.12, rz: HALF_PI });
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] papaya_milk_cup 木瓜牛奶杯 — iconic Kaohsiung papaya milk cup    */
  /* ---------------------------------------------------------------- */
  {
    id: 'papaya_milk_cup',
    displayName: '木瓜牛奶杯',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.045,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xffa060, 0xffb080, 0xff9050, 0xffc090, 0xffaa70],
    yOffset: -0.12, // cup standing upright (= -1 - minY of normalized geo)
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // plastic cup body (tapered, tinted orange for papaya)
        cyl(0.6, 0.75, 2.0, 10, 0xffffff, { y: 1.0, hex2: 0xffe8d8 }),
        // papaya-orange filling visible through cup
        cyl(0.55, 0.7, 1.7, 8, 0xffa060, { y: 0.95 }),
        // white foam/froth on top
        cyl(0.68, 0.68, 0.2, 8, 0xfff8f0, { y: 1.95 }),
        // dome lid
        sph(0.72, 0xe8e8e8, { ws: 8, hs: 4, thetaLen: HALF_PI, y: 2.0 }),
        // straw poking out
        cyl(0.06, 0.06, 1.2, 6, 0xf06080, { y: 2.6, x: 0.15 }),
        // cup bottom rim
        cyl(0.62, 0.6, 0.1, 8, 0xd8d8d8, { y: 0.05 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] marlin_charm 旗魚墜飾 — marlin fish charm keychain               */
  /* ---------------------------------------------------------------- */
  {
    id: 'marlin_charm',
    displayName: '旗魚墜飾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.011,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3070a0, 0x4080b0, 0x2060a0, 0x5090c0, 0x2858a0],
    yOffset: -0.55, // fish charm lying flat
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // marlin body (elongated tapered)
        cyl(0.35, 0.15, 1.8, 6, 0xffffff, { rz: HALF_PI, y: 0.35, hex2: 0xc8d8e8 }),
        // pointed bill/sword
        cone(0.08, 0.7, 5, 0x4a6080, { rz: HALF_PI, x: 1.3, y: 0.35 }),
        // dorsal fin
        cone(0.18, 0.4, 4, 0x2858a0, { x: 0.0, y: 0.58, rz: 0.3 }),
        // tail fin (forked)
        cone(0.12, 0.35, 4, 0x3070a0, { x: -0.95, y: 0.48, rz: -0.6 }),
        cone(0.12, 0.35, 4, 0x3070a0, { x: -0.95, y: 0.22, rz: 0.6 }),
        // keyring loop
        torus(0.1, 0.02, 4, 8, 0xc8ccd4, { x: -1.1, y: 0.35, rz: HALF_PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] ferry_ticket_holder 渡輪票夾 — CHUNK LANDMARK: ferry ticket rack */
  /* ---------------------------------------------------------------- */
  {
    id: 'ferry_ticket_holder',
    displayName: '渡輪票夾',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x3a6a90, 0x4a7aa0, 0x2a5a80, 0x5a8ab0],
    yOffset: -0.42, // board standing upright
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        // ticket board backing (harbor blue)
        box(2.5, 1.8, 0.16, 0xffffff, { y: 0.9 }),
        // header with ferry icon
        box(2.5, 0.36, 0.18, 0x3a6a90, { y: 1.66 }),
        // boat silhouette on header
        box(0.8, 0.18, 0.04, 0xf0f0e8, { y: 1.66, z: 0.1 }),
        cone(0.15, 0.22, 4, 0xf0f0e8, { x: 0.45, y: 1.72, z: 0.12, rz: -0.3 }),
      ];
      // rows of ticket stubs in slots
      const rows = 3;
      const cols = 4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = -0.75 + c * 0.5;
          const ty = 0.45 + r * 0.38;
          const hasTicket = rng() > 0.3;
          if (hasTicket) {
            parts.push(box(0.38, 0.28, 0.08, 0xf8f4e8, { x: tx, y: ty, z: 0.12 })); // ticket
            parts.push(box(0.32, 0.06, 0.04, 0x3a6a90, { x: tx, y: ty + 0.08, z: 0.16 })); // printed line
          }
        }
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] harbor_buoy_mini 港邊浮球迷你版 — CHUNK LANDMARK: mini harbor buoy */
  /* ---------------------------------------------------------------- */
  {
    id: 'harbor_buoy_mini',
    displayName: '港邊浮球迷你版',
    tier: 0,
    naturalBand: 0,
    radiusNominal: 0.05,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xe06030, 0xf07040, 0xd05020, 0xff8050],
    yOffset: -0.10, // buoy upright
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // buoy body (tapered cylinder, orange)
        cyl(0.7, 0.5, 1.6, 8, 0xffffff, { y: 0.9, hex2: 0xf8e8d8 }),
        // white stripe band
        cyl(0.72, 0.72, 0.3, 8, 0xf0f0e8, { y: 1.0, open: true }),
        // top cap / reflector
        sph(0.4, 0xf0f0e8, { ws: 6, hs: 4, y: 1.7, thetaLen: HALF_PI }),
        // bottom weight / base
        cyl(0.55, 0.6, 0.3, 8, 0x3a3a40, { y: 0.15 }),
        // mounting ring on top
        torus(0.25, 0.05, 4, 8, 0x4a4a50, { y: 1.85, rx: HALF_PI }),
        // number decal (stylized)
        box(0.3, 0.25, 0.04, 0x2a2a30, { y: 0.7, z: 0.52 }),
      ]);
    },
  },
];

export default T0_ARCHETYPES;
