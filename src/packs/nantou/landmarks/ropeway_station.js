/**
 * @file packs/nantou/landmarks/ropeway_station.js — Roll Formosa Nantou pack, landmark 6.
 *
 * 日月潭纜車站 — Sun Moon Lake Ropeway Station, the cable car system
 * connecting Sun Moon Lake to Formosan Aboriginal Culture Village.
 * Features:
 * - Modern station building with curved roof
 * - Tall cable car support towers
 * - Glass and steel modern architecture
 * - Cable car gondolas (colored capsules)
 * - Mountain backdrop with cables spanning across
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — modern ropeway station
const STEEL_GREY = 0x606060;     // steel structure
const STEEL_LIGHT = 0x808080;   // lighter steel
const GLASS = 0x88b8c8;         // glass panels (blue tint)
const GLASS_DARK = 0x5890a0;    // darker glass
const ROOF_WHITE = 0xf0f0f0;    // white curved roof
const CONCRETE = 0x989898;      // concrete base
const CABLE = 0x303030;         // dark cable
const GONDOLA_RED = 0xc03030;   // red gondola
const GONDOLA_BLUE = 0x3050a0;  // blue gondola
const GONDOLA_YELLOW = 0xd0a020; // yellow gondola
const PLATFORM = 0x707070;       // platform

export const NM_ROPEWAY_STATION = {
  id: 'ropeway_station',
  name: '日月潭纜車',
  landmarkId: 6,
  dioramaRHint: 50, // station complex ~100m with tower
  colorHex: STEEL_GREY,

  buildGeometry(rng) {
    const j = (rng ? rng() - 0.5 : 0) * 0.003;
    const parts = [];

    /* ---- 1) Station base / platform -------------------------------------- */
    parts.push(box(2.2, 0.12, 1.6, CONCRETE, { y: 0.06 }));
    parts.push(box(2.0, 0.08, 1.4, PLATFORM, { y: 0.16 }));

    /* ---- 2) Main station building ---------------------------------------- */
    const stnY = 0.20;
    // Main structure (glass and steel box)
    parts.push(box(1.4, 0.5, 0.9, GLASS, { y: stnY + 0.45, hex2: GLASS_DARK }));
    // Steel frame outline (top only)
    parts.push(box(1.45, 0.04, 0.92, STEEL_GREY, { y: stnY + 0.68 }));
    // Vertical steel columns (reduced to 3)
    for (const sx of [-0.5, 0, 0.5]) {
      parts.push(box(0.05, 0.46, 0.05, STEEL_GREY, { x: sx, y: stnY + 0.45, z: 0.44 }));
    }
    // Curved roof (simplified)
    parts.push(sph(0.8, ROOF_WHITE, {
      ws: 6, hs: 4, y: stnY + 0.75 + j, sx: 1.0, sy: 0.2, sz: 0.65
    }));

    /* ---- 3) Main support tower (the tall pylon) -------------------------- */
    const towerX = -0.9, towerZ = -0.3;
    // Tower legs (A-frame structure, simplified)
    parts.push(cyl(0.08, 0.06, 1.1, 5, STEEL_GREY, { x: towerX, y: 0.9, z: towerZ }));
    // Top cable wheel housing
    parts.push(box(0.35, 0.12, 0.2, STEEL_GREY, { x: towerX, y: 1.48, z: towerZ }));

    /* ---- 4) Secondary tower (distant) ------------------------------------ */
    const t2x = 0.95, t2z = -0.5;
    parts.push(cyl(0.05, 0.04, 0.7, 5, STEEL_GREY, { x: t2x, y: 0.55, z: t2z }));

    /* ---- 5) Cable (single) ----------------------------------------------- */
    parts.push(cyl(0.015, 0.015, 2.0, 4, CABLE, { x: 0, y: 1.3, z: towerZ, ry: 0.15 }));

    /* ---- 6) Gondolas (cable cars, reduced to 2) -------------------------- */
    const g1x = -0.2, g1y = 1.1, g1z = -0.25;
    parts.push(sph(0.08, GONDOLA_RED, { ws: 5, hs: 3, x: g1x, y: g1y, z: g1z, sy: 0.9 }));
    const g2x = 0.5, g2y = 1.0, g2z = -0.35;
    parts.push(sph(0.08, GONDOLA_BLUE, { ws: 5, hs: 3, x: g2x, y: g2y, z: g2z, sy: 0.9 }));

    return finish(parts);
  },
};

export default NM_ROPEWAY_STATION;
