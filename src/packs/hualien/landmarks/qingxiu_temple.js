/**
 * @file packs/hualien/landmarks/qingxiu_temple.js — Roll Formosa Hualien pack.
 *
 * NM_QINGXIU — 慶修院 (Qingxiu Temple / Yoshino Shingon-ji), a Japanese-era
 * Shingon Buddhist temple built in 1917 during the Japanese colonial period.
 * Features traditional Japanese temple architecture with a distinctive main
 * hall (本堂) and bell tower, surrounded by 88 stone Buddhist statues.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Japanese temple colors
const WOOD = 0x5a3a2a; // dark wood structure
const WOOD_L = 0x7a5a40; // lighter wood panels
const TILE = 0x2a2a2a; // dark grey roof tiles
const STONE = 0x9a9a8a; // stone base/lanterns
const GOLD = 0xd4a820; // gold accents
const WHITE = 0xf0ece0; // white walls (shoji screens implied)

export const NM_QINGXIU = {
  id: 'qingxiu_temple',
  name: '慶修院',
  landmarkId: 0,
  dioramaRHint: 35,
  colorHex: WOOD,

  buildGeometry(rng) {
    const parts = [];

    // ---- Stone foundation platform -----------------------------------------
    parts.push(box(2.8, 0.12, 2.2, STONE, { y: 0.06 }));
    parts.push(box(3.0, 0.06, 2.4, 0x7a7a6a, { y: 0.03 }));

    // ---- Main hall (本堂) --------------------------------------------------
    const hallW = 2.0;
    const hallD = 1.6;
    const hallH = 1.2;
    const hallY = 0.12;

    // Raised wood floor platform
    parts.push(box(hallW + 0.2, 0.15, hallD + 0.2, WOOD, { y: hallY + 0.075 }));

    // Main hall walls
    parts.push(box(hallW, hallH, hallD, WHITE, { y: hallY + 0.15 + hallH / 2 }));
    // Wood frame posts at corners
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(box(0.12, hallH + 0.3, 0.12, WOOD, { x: sx * hallW / 2, z: sz * hallD / 2, y: hallY + 0.15 + hallH / 2 }));
      }
    }

    // ---- Main roof (irimoya style - hipped-gable) --------------------------
    const roofY = hallY + 0.15 + hallH;
    // Lower hipped section
    parts.push(box(hallW + 0.5, 0.08, hallD + 0.5, WOOD, { y: roofY + 0.04 })); // eave underside
    parts.push(cone(hallW / 2 + 0.4, 0.6, 4, TILE, { y: roofY + 0.38 })); // pyramidal hip
    // Upper gable ridge
    parts.push(box(hallW + 0.3, 0.15, 0.2, TILE, { y: roofY + 0.65 }));
    // Ridge ornament
    parts.push(cyl(0.08, 0.04, 0.3, 6, GOLD, { y: roofY + 0.85 }));

    // ---- Bell tower (鐘楼) to the side -------------------------------------
    const bellX = -1.4;
    const bellZ = 0.3;
    // Four corner posts
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(cyl(0.06, 0.06, 1.3, 6, WOOD, { x: bellX + sx * 0.25, z: bellZ + sz * 0.25, y: 0.12 + 0.65 }));
      }
    }
    // Bell tower roof
    parts.push(cone(0.55, 0.45, 4, TILE, { x: bellX, z: bellZ, y: 1.65 }));
    // Bell (simplified as cylinder)
    parts.push(cyl(0.12, 0.10, 0.25, 8, 0x3a3a30, { x: bellX, z: bellZ, y: 1.15 }));

    // ---- Stone lanterns (石燈籠) -------------------------------------------
    for (const sx of [-1, 1]) {
      const lx = sx * 1.2;
      parts.push(box(0.15, 0.08, 0.15, STONE, { x: lx, z: 0.95, y: 0.16 })); // base
      parts.push(cyl(0.05, 0.05, 0.4, 6, STONE, { x: lx, z: 0.95, y: 0.40 })); // shaft
      parts.push(box(0.18, 0.12, 0.18, STONE, { x: lx, z: 0.95, y: 0.66 })); // lantern body
      parts.push(cone(0.14, 0.15, 4, STONE, { x: lx, z: 0.95, y: 0.80 })); // cap
    }

    return finish(parts);
  },
};

export default NM_QINGXIU;
