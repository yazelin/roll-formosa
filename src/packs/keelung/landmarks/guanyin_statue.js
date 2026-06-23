/**
 * @file packs/keelung/landmarks/guanyin_statue.js — Roll Formosa Keelung pack.
 *
 * 中正公園觀音像 — The iconic white Guanyin (Goddess of Mercy) statue standing
 * atop Zhongzheng Park hill, overlooking Keelung Harbor. At 22.5 meters tall,
 * it's one of Keelung's most recognizable landmarks, visible from across the
 * harbor and symbolizing the city's protective maritime spirit.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const WHITE = 0xf8f8f4;       // Pure white statue
const CREAM = 0xf4f0e8;       // Slightly warmer white for robes
const GOLD = 0xe8c860;        // Gold accents
const LOTUS = 0xffd0d8;       // Lotus pink
const PEDESTAL = 0x9a9690;    // Grey stone pedestal
const PLINTH = 0x706860;      // Dark stone base

export const NM_GUANYIN_STATUE = {
  id: 'guanyin_statue',
  name: '中正公園觀音像',
  landmarkId: 1,
  dioramaRHint: 23,
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // ---- Multi-tiered pedestal ----
    // Wide base platform
    parts.push(box(1.8, 0.2, 1.8, PLINTH, { y: 0.1 }));
    parts.push(box(1.6, 0.15, 1.6, PEDESTAL, { y: 0.28 }));

    // Octagonal pedestal (simplified as cylinder)
    parts.push(cyl(0.7, 0.8, 0.5, 8, PEDESTAL, { y: 0.6 }));
    parts.push(cyl(0.65, 0.7, 0.3, 8, PEDESTAL, { y: 0.95 }));

    // Upper pedestal with lotus motif
    parts.push(cyl(0.55, 0.65, 0.25, 8, PEDESTAL, { y: 1.18 }));
    parts.push(cyl(0.5, 0.55, 0.1, 8, LOTUS, { y: 1.32 })); // lotus ring

    // ---- Guanyin statue body ----
    // Flowing robes (lower body)
    parts.push(cone(0.45, 1.6, 8, CREAM, { y: 2.08 }));

    // Torso
    parts.push(cyl(0.32, 0.38, 0.7, 8, WHITE, { y: 3.2 }));

    // Chest/shoulder area
    parts.push(sph(0.35, WHITE, { ws: 5, hs: 4, y: 3.6, sy: 0.6 }));

    // Arms (simplified - one holding vase, one in blessing gesture)
    // Left arm down holding vase
    parts.push(cyl(0.08, 0.08, 0.5, 6, WHITE, { x: -0.35, y: 3.2, rz: 0.3 }));
    parts.push(cyl(0.06, 0.08, 0.25, 6, GOLD, { x: -0.52, y: 2.85 })); // vase

    // Right arm in blessing mudra
    parts.push(cyl(0.08, 0.08, 0.4, 6, WHITE, { x: 0.32, y: 3.4, rz: -0.4 }));
    parts.push(sph(0.1, WHITE, { ws: 4, hs: 3, x: 0.45, y: 3.6 })); // hand

    // ---- Head ----
    parts.push(sph(0.22, WHITE, { ws: 10, hs: 8, y: 3.95 })); // head
    parts.push(sph(0.16, WHITE, { ws: 5, hs: 4, y: 4.08, sz: 0.8 })); // hair bun

    // Crown/headdress
    parts.push(cyl(0.18, 0.2, 0.12, 8, GOLD, { y: 4.18 }));
    parts.push(cone(0.12, 0.15, 8, GOLD, { y: 4.32 }));

    // ---- Halo/nimbus behind head ----
    parts.push(cyl(0.35, 0.35, 0.02, 16, GOLD, { y: 4.0, z: -0.2, rx: HALF_PI }));

    return finish(parts);
  },
};

export default NM_GUANYIN_STATUE;
