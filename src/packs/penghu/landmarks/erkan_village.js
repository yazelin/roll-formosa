/**
 * @file packs/penghu/landmarks/erkan_village.js — Roll Formosa Penghu pack, landmark 5.
 *
 * NM_ERKAN — 二崁聚落 (Erkan Traditional Settlement), 西嶼鄉. A well-preserved
 * traditional Fujianese village with distinctive coral-stone houses and
 * narrow alleys. Silhouette: cluster of low traditional houses with curved
 * roofs made from coral stone (咾咕石).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — coral stone village.
const CORAL = 0xd0c8b8; // coral stone walls
const CORAL_D = 0xa89888; // darker coral
const ROOF = 0x6a5a4a; // dark roof tiles
const ROOF_D = 0x4a3e30; // roof shadow
const WOOD = 0x6e5040; // wood elements

export const NM_ERKAN = {
  id: 'erkan_village',
  name: '二崁聚落',
  landmarkId: 5,
  dioramaRHint: 120, // village cluster ~200m
  colorHex: CORAL,

  buildGeometry(rng) {
    const parts = [];

    // Main cluster of traditional houses
    const houses = [
      { x: -0.4, z: -0.2, w: 0.5, d: 0.4, h: 0.45 },
      { x: 0.3, z: -0.15, w: 0.45, d: 0.35, h: 0.4 },
      { x: -0.1, z: 0.3, w: 0.55, d: 0.45, h: 0.5 },
      { x: 0.5, z: 0.25, w: 0.4, d: 0.35, h: 0.38 },
      { x: -0.5, z: 0.35, w: 0.35, d: 0.3, h: 0.35 },
    ];

    for (const h of houses) {
      const wallTint = Math.floor(rng() * 0x101008);
      // Coral stone walls
      parts.push(box(h.w, h.h, h.d, CORAL - wallTint, { x: h.x, y: h.h / 2, z: h.z, hex2: CORAL_D }));

      // Curved roof (swallowtail style, simplified)
      parts.push(box(h.w * 1.1, 0.06, h.d * 1.1, ROOF, {
        x: h.x, y: h.h + 0.03, z: h.z, hex2: ROOF_D,
      }));
      // Roof ridge
      parts.push(box(h.w * 0.9, 0.08, 0.06, ROOF_D, {
        x: h.x, y: h.h + 0.1, z: h.z,
      }));

      // Door opening
      parts.push(box(h.w * 0.25, h.h * 0.6, 0.04, WOOD, {
        x: h.x, y: h.h * 0.3, z: h.z + h.d / 2 + 0.01,
      }));
    }

    // Stone-paved alleyways
    parts.push(box(0.12, 0.02, 1.2, CORAL_D, { x: 0.1, y: 0.01 }));
    parts.push(box(1.4, 0.02, 0.1, CORAL_D, { z: 0.1, y: 0.01 }));

    // Traditional well
    parts.push(cyl(0.08, 0.08, 0.1, 8, CORAL_D, { x: 0.1, z: -0.4, y: 0.05 }));

    // Wind-blocking stone wall
    parts.push(box(0.08, 0.3, 0.6, CORAL, { x: -0.75, z: 0.1, y: 0.15, hex2: CORAL_D }));

    return finish(parts);
  },
};

export default NM_ERKAN;
