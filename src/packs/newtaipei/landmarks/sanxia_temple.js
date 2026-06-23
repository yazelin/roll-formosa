/**
 * @file packs/newtaipei/landmarks/sanxia_temple.js — Roll Formosa New Taipei pack.
 *
 * NM_SANXIA_TEMPLE — 三峽祖師廟 (Sanxia Zushi Temple). Known as the "Oriental
 * Art Palace" (東方藝術殿堂), this temple is famous for its extraordinarily
 * detailed stone and wood carvings. Features traditional southern Fujianese
 * architecture with ornate dragon pillars, multi-tiered roofs with upturned
 * eaves, and intricate relief carvings on every surface.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const STONE = 0xd8d0c0;      // carved stone (columns, walls)
const ROOF_TILE = 0x8b4513;  // brown glazed roof tiles
const GOLD = 0xd4a840;       // gold trim and accents
const DRAGON = 0x2a8a4a;     // green dragon/ceramic dragon
const RED = 0xc83030;        // red painted wood
const WOOD_DARK = 0x4a3020;  // dark carved wood

export const NM_SANXIA_TEMPLE = {
  id: 'sanxia_temple',
  name: '三峽祖師廟',
  landmarkId: 3,
  dioramaRHint: 35, // ~35 m footprint
  colorHex: ROOF_TILE, // temple roof read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Stone platform base ----------------------------------------
    parts.push(box(1.4, 0.12, 1.0, 0x9a9080, { y: 0.06 })); // platform base
    parts.push(box(1.35, 0.06, 0.95, STONE, { y: 0.15 })); // platform top

    // ---- 2) Main hall structure ----------------------------------------
    parts.push(box(1.1, 0.5, 0.7, STONE, { y: 0.43 })); // main hall walls
    // carved stone door frame
    parts.push(box(0.25, 0.4, 0.02, RED, { y: 0.38, z: 0.36 })); // main entrance

    // ---- 3) Dragon pillars (iconic carved columns) ---------------------
    const pillarY = 0.35;
    for (const x of [-0.35, 0.35]) {
      // stone pillar with dragon wrapped around
      parts.push(cyl(0.06, 0.06, 0.5, 8, STONE, { x, y: pillarY, z: 0.38 }));
      // dragon coil (simplified as spiral bumps)
      for (let i = 0; i < 3; i++) {
        const a = i * PI * 0.8;
        parts.push(sph(0.025, DRAGON, {
          ws: 4, hs: 3,
          x: x + Math.cos(a) * 0.06,
          y: 0.2 + i * 0.15,
          z: 0.38 + Math.sin(a) * 0.06,
        }));
      }
    }

    // ---- 4) Multi-tiered roof with upturned eaves ----------------------
    // Main roof (first tier)
    const roofY1 = 0.68;
    parts.push(box(1.3, 0.06, 0.85, ROOF_TILE, { y: roofY1 }));
    // roof ridge
    parts.push(cyl(0.05, 0.05, 1.1, 4, ROOF_TILE, { rz: HALF_PI, y: roofY1 + 0.08, ry: HALF_PI/2 }));
    // upturned eave corners (swallow-tail燕尾)
    for (const x of [-0.65, 0.65]) {
      for (const z of [-0.42, 0.42]) {
        parts.push(cone(0.08, 0.12, 4, ROOF_TILE, { x, y: roofY1 + 0.02, z, rz: x > 0 ? 0.3 : -0.3, rx: z > 0 ? 0.3 : -0.3 }));
      }
    }

    // Second tier roof (smaller, on top)
    const roofY2 = roofY1 + 0.25;
    parts.push(box(0.7, 0.5, 0.5, STONE, { y: roofY2 - 0.08 })); // inner hall
    parts.push(box(0.85, 0.05, 0.6, ROOF_TILE, { y: roofY2 + 0.18 }));
    parts.push(cyl(0.04, 0.04, 0.7, 4, ROOF_TILE, { rz: HALF_PI, y: roofY2 + 0.24, ry: HALF_PI/2 }));

    // ---- 5) Roof decorations (dragons, phoenix, pagoda finials) --------
    // Central ridge ornament
    parts.push(cone(0.04, 0.12, 6, GOLD, { y: roofY2 + 0.32 })); // pagoda finial
    // Dragon at ridge ends
    for (const x of [-0.34, 0.34]) {
      parts.push(box(0.08, 0.06, 0.04, DRAGON, { x, y: roofY2 + 0.26 })); // dragon body
      parts.push(sph(0.025, DRAGON, { ws: 4, hs: 3, x, y: roofY2 + 0.3 })); // dragon head
    }

    // ---- 6) Incense burner in front courtyard --------------------------
    parts.push(cyl(0.08, 0.06, 0.12, 8, 0x8a6a4a, { y: 0.24, z: 0.55 })); // incense urn
    parts.push(cyl(0.1, 0.1, 0.03, 8, GOLD, { y: 0.31, z: 0.55 })); // urn rim

    // ---- 7) Side wing halls --------------------------------------------
    for (const x of [-0.65, 0.65]) {
      parts.push(box(0.25, 0.35, 0.4, STONE, { x, y: 0.35, z: -0.2 }));
      parts.push(box(0.28, 0.04, 0.45, ROOF_TILE, { x, y: 0.55, z: -0.2 }));
    }

    return finish(parts);
  },
};

export default NM_SANXIA_TEMPLE;
