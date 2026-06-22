/**
 * @file packs/taoyuan/landmarks/cihu_mausoleum.js — Roll Formosa Taoyuan pack.
 *
 * 慈湖陵寢 (Cihu Mausoleum) — the mausoleum of Chiang Kai-shek, located near
 * Daxi in Taoyuan. The traditional Chinese architecture features red columns,
 * black tile roofs, and sits beside the scenic Cihu (Kindness Lake). The site
 * includes a memorial park with the famous collection of Chiang statues.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: red columns, black glazed roof tiles, white walls, gold accents.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const RED = 0xb83020; // vermillion columns
const BLACK = 0x2a2828; // black glazed roof tiles
const WHITE = 0xf0ece4; // white walls
const GOLD = 0xc8a838; // gold roof ridge ornaments
const WOOD = 0x6a4830; // wood eaves
const STONE = 0xa8a098; // stone base/plaza

export const NM_CIHU_MAUSOLEUM = {
  id: 'cihu_mausoleum',
  name: '慈湖陵寢',
  landmarkId: 4, // medium-large landmark
  dioramaRHint: 70, // ~80 m traditional building complex
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // === STONE PLATFORM BASE =================================================
    parts.push(box(3.6, 0.25, 2.4, STONE, { y: 0.12 }));
    parts.push(box(3.8, 0.12, 2.6, 0x989088, { y: 0.06 })); // lower step

    // === MAIN HALL BODY ======================================================
    parts.push(box(2.8, 1.2, 1.8, WHITE, { y: 0.85 }));

    // Red columns (front colonnade)
    for (let i = 0; i < 5; i++) {
      parts.push(cyl(0.1, 0.1, 1.1, 6, RED, { x: -1.2 + i * 0.6, y: 0.8, z: 1.0 }));
    }

    // Red columns (side colonnades)
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        parts.push(cyl(0.1, 0.1, 1.1, 6, RED, { x: sx * 1.3, y: 0.8, z: -0.4 + i * 0.7 }));
      }
    }

    // === TRADITIONAL ROOF (重簷歇山頂) =======================================
    // Lower eave
    parts.push(box(3.4, 0.12, 2.3, WOOD, { y: 1.5 }));
    parts.push(cone(2.0, 0.5, 4, BLACK, { ry: PI / 4, y: 1.9, sx: 1.2, sz: 0.8, hex2: 0x3a3838 }));

    // Upper eave (smaller)
    parts.push(box(2.6, 0.1, 1.8, WOOD, { y: 2.2 }));
    parts.push(cone(1.4, 0.4, 4, BLACK, { ry: PI / 4, y: 2.5, sx: 1.2, sz: 0.8, hex2: 0x3a3838 }));

    // Ridge beam with gold ornaments
    parts.push(box(2.2, 0.1, 0.14, GOLD, { y: 2.72 }));
    // Ridge end ornaments (鴟吻)
    parts.push(box(0.16, 0.22, 0.18, GOLD, { x: -1.0, y: 2.82 }));
    parts.push(box(0.16, 0.22, 0.18, GOLD, { x: 1.0, y: 2.82 }));

    // Upturned eave corners (翹角)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(box(0.3, 0.06, 0.06, BLACK, {
          rz: sx * 0.4,
          ry: sx * sz * 0.4,
          x: sx * 1.6,
          y: 1.58,
          z: sz * 1.1,
        }));
      }
    }

    // === ENTRANCE DOOR =======================================================
    parts.push(box(0.5, 0.8, 0.08, WOOD, { y: 0.65, z: 1.05 }));
    parts.push(box(0.55, 0.08, 0.1, GOLD, { y: 1.08, z: 1.05 })); // door lintel

    // === FRONT STEPS =========================================================
    for (let i = 0; i < 3; i++) {
      parts.push(box(1.0, 0.08, 0.15, STONE, { y: 0.04 + i * 0.08, z: 1.25 + i * 0.15 }));
    }

    return finish(parts);
  },
};

export default NM_CIHU_MAUSOLEUM;
