/**
 * @file packs/penghu/landmarks/cks_memorial.js — Roll Formosa Penghu pack, landmark 5.
 *
 * 中央老街 (Zhongyang Old Street / Central Street) — the historic commercial
 * street in Magong, Penghu's oldest settlement. A row of traditional Minnan-style
 * shophouses with baroque-influenced facades, dating from the Qing and Japanese
 * colonial eras. Characterized by narrow storefronts, decorative parapets, and
 * covered arcades (騎樓).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1).
 *
 * Palette: warm ochre/cream facades + red brick accents + dark shop interiors.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const OCHRE = 0xd8c8a0; // warm ochre facade
const OCHRE_D = 0xc8b890; // darker ochre
const CREAM = 0xe8e0d0; // cream white trim
const BRICK = 0xa85040; // red brick accent
const BRICK_D = 0x884030; // darker brick
const DARK = 0x2a2820; // dark shop interior / arcade shadow
const ROOF = 0x6a6055; // grey-brown roof tiles
const ROOF_D = 0x4a4035; // darker roof
const WOOD = 0x6a5040; // wooden doors/shutters
const GREEN = 0x4a6840; // plants
const STONE = 0x9a9080; // stone street

export const NM_ZHONGYANG_STREET = {
  id: 'zhongyang_street',
  name: '中央老街',
  landmarkId: 5,
  dioramaRHint: 40, // ~80 m street section
  colorHex: OCHRE,

  buildGeometry(rng) {
    const parts = [];

    // ---- stone street base ----
    parts.push(box(5.5, 0.15, 2.2, STONE, { y: 0.075, hex2: 0x8a8070 }));

    // ---- row of shophouses (simplified - 3 shops) ----
    const shopPositions = [-1.6, 0.0, 1.6];
    const shopWidths = [1.4, 1.5, 1.4];
    const shopColors = [OCHRE, CREAM, OCHRE_D];

    for (let i = 0; i < shopPositions.length; i++) {
      const x = shopPositions[i];
      const w = shopWidths[i];
      const col = shopColors[i];
      const h = 1.7;

      // Main building body
      parts.push(box(w, h, 1.1, col, { x, y: h / 2 + 0.15, z: -0.4, hex2: CREAM }));

      // Arcade (騎樓) - covered walkway at ground level
      parts.push(box(w, 0.65, 0.35, DARK, { x, y: 0.48, z: 0.2 }));

      // Shop entrance (dark recess)
      parts.push(box(w * 0.6, 0.55, 0.1, DARK, { x, y: 0.43, z: 0.0 }));

      // Upper floor window
      parts.push(box(w * 0.4, 0.35, 0.08, DARK, { x, y: h * 0.6, z: 0.15 }));

      // Decorative parapet (baroque-influenced top)
      parts.push(box(w, 0.35, 0.15, CREAM, { x, y: h + 0.32, z: 0.15 }));

      // Roof behind parapet
      parts.push(box(w, 0.2, 1.0, ROOF, { x, y: h + 0.25, z: -0.4, hex2: ROOF_D }));
    }

    // ---- street details ----
    // Single red lantern
    parts.push(cyl(0.08, 0.06, 0.18, 5, 0xc82020, { x: 0, y: 0.92, z: 0.3 }));

    // Street lamp
    parts.push(cyl(0.04, 0.04, 1.2, 4, 0x3a3a38, { x: 0, y: 0.75, z: 0.85 }));
    parts.push(box(0.15, 0.2, 0.15, 0xf8f0d0, { x: 0, y: 1.45, z: 0.85 }));

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_CKS)
export const NM_CKS = NM_ZHONGYANG_STREET;

export default NM_ZHONGYANG_STREET;
