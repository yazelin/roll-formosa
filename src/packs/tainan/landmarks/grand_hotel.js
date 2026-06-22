/**
 * @file packs/tainan/landmarks/grand_hotel.js — Roll Formosa Tainan pack, landmark 3.
 *
 * 祀典武廟 (Official God-of-War Temple) — landmarkId 3. The iconic image is its
 * long, TALL deep-vermilion FIREWALL / gable wall (山牆) running the length of
 * the street: a long red wall whose top edge rises and falls in a series of
 * undulating curved 馬背 (horse-back) gable crests, with a dark glazed tiled
 * roof tucked behind it and red columns/doors along the front. The deep red
 * wall with its stepped wavy crown is the unmistakable signature.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read: a long, tall red
 * wall with a wavy top, low building depth behind. rng() only nudges crest
 * jitter, never structure.
 *
 * Palette: deep vermilion red wall, ochre coping, dark grey-green tiled roof.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const RED = 0xa8261d; // 武廟 deep vermilion firewall
const RED_D = 0x861b14; // shadow side of the red wall
const RED_L = 0xc23529; // sunlit vermilion
const OCHRE = 0xc89a64; // ochre coping / plinth
const OCHRE_L = 0xd9b07c; // sunlit ochre
const ROOF = 0x3a4642; // dark grey-green glazed tile behind the wall
const ROOF_D = 0x2a3631; // roof underside / shadow
const RIDGE = 0x4a5650; // ridge tile
const STONE = 0xb0a89a; // doorway lintel / stone trim

export const NM_GRAND_HOTEL = {
  id: 'grand_hotel',
  name: '祀典武廟',
  landmarkId: 3,
  dioramaRHint: 60, // long firewall street frontage footprint radius (m)
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // === PLINTH ==============================================================
    parts.push(box(8.0, 0.34, 2.4, OCHRE, { y: 0.17, hex2: OCHRE_L }));

    // === DARK TILED ROOF (behind the firewall, set back in −Z) ==============
    // A long low hip roof tucked behind, only its crest peeks over the wall.
    parts.push(box(7.0, 0.14, 2.0, ROOF, { y: 2.4, z: -0.3, hex2: RIDGE }));
    parts.push(cone(3.4, 0.6, 4, ROOF, { ry: PI / 4, y: 2.8, z: -0.3, sx: 1.6, sz: 0.5, hex2: RIDGE })); // long hip ridge
    parts.push(box(5.6, 0.14, 0.16, RIDGE, { y: 3.04, z: -0.3, hex2: OCHRE_L })); // ridge beam

    // === LONG TALL RED FIREWALL (山牆, front +Z) ============================
    // The signature: one long deep-red wall with an undulating 馬背 top profile.
    const wz = 0.85; // wall front plane
    parts.push(box(8.0, 2.6, 0.5, RED, { y: 1.6, z: wz, hex2: RED_L })); // main tall red wall body

    // Undulating 馬背 crown: a row of curved gable crests across the wall top.
    // Each crest = a half-cylinder hump capping a tall pier, alternating heights
    // for the rise-and-fall wavy silhouette. Built across 5 bays.
    const bays = 5;
    const span = 7.4;
    for (let i = 0; i < bays; i++) {
      const cx = -span / 2 + (span / (bays - 1)) * i;
      const big = i % 2 === 0; // alternate tall/short for undulation
      const ph = big ? 0.55 : 0.28; // pier rise above the wall top
      const topY = 2.9 + ph;
      const j = (rng() - 0.5) * 0.03;
      // Pier rising above the wall top.
      parts.push(box(1.1, ph + 0.2, 0.46, RED, { x: cx, y: 2.8 + ph * 0.5, z: wz, hex2: RED_L }));
      // Curved 馬背 hump capping the pier (half-cylinder, flat face front).
      parts.push(
        cyl(0.58, 0.58, 0.5, 8, RED_L, {
          rx: HALF_PI,
          theta0: 0,
          thetaLen: PI,
          x: cx,
          y: topY + j,
          z: wz,
        })
      );
      // Ochre coping line tracing the curve (big crests only — keeps tri budget).
      if (big) {
        parts.push(
          cyl(0.62, 0.62, 0.1, 8, OCHRE_L, {
            rx: HALF_PI,
            theta0: 0,
            thetaLen: PI,
            open: true,
            x: cx,
            y: topY + j,
            z: wz + 0.06,
          })
        );
        // Small ridge ornament knob on the big crests.
        parts.push(sph(0.12, OCHRE_L, { x: cx, y: topY + 0.5, z: wz, ws: 6, hs: 4 }));
      }
    }

    // === RED COLUMNS + DOORS along the front ================================
    for (let i = -2; i <= 2; i++) {
      parts.push(cyl(0.14, 0.16, 1.7, 6, RED, { x: i * 1.5, y: 1.05, z: wz + 0.45, hex2: RED_L }));
    }
    // Central main doorway with stone lintel.
    parts.push(box(1.3, 1.4, 0.3, RED_D, { y: 0.9, z: wz + 0.3 }));
    parts.push(box(1.5, 0.22, 0.34, STONE, { y: 1.65, z: wz + 0.3 })); // stone lintel
    // Two side doorways (flat panels — cheap).
    parts.push(box(0.8, 1.1, 0.26, RED_D, { x: -2.6, y: 0.75, z: wz + 0.3 }));
    parts.push(box(0.8, 1.1, 0.26, RED_D, { x: 2.6, y: 0.75, z: wz + 0.3 }));

    return finish(parts);
  },
};

export default NM_GRAND_HOTEL;
