/**
 * @file packs/penghu/landmarks/daguoye_basalt.js — Roll Formosa Penghu pack, landmark 3.
 *
 * NM_DAGUOYE — 大菓葉玄武岩 (Daguoye Basalt Columns), 西嶼鄉. One of Taiwan's most
 * spectacular geological formations — towering hexagonal basalt columns formed
 * by ancient lava cooling, creating a dramatic cliff face. Silhouette: a wall
 * of vertical hexagonal columns in dark grey.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — dark basalt columns.
const BASALT = 0x4a4e54; // dark grey basalt
const BASALT_D = 0x36393e; // darker crevice
const BASALT_L = 0x5a5e66; // lighter face
const GRASS = 0x5a8a4a; // grass at top

export const NM_DAGUOYE = {
  id: 'daguoye_basalt',
  name: '大菓葉玄武岩',
  landmarkId: 3,
  dioramaRHint: 60, // cliff ~100m wide
  colorHex: BASALT,

  buildGeometry(rng) {
    const parts = [];

    // Create a wall of hexagonal columns (simplified to 8)
    const nCols = 8;
    const colR = 0.1;

    for (let i = 0; i < nCols; i++) {
      const x = (i - (nCols - 1) / 2) * (colR * 1.9);
      const h = 1.2 + (i % 3 - 1) * 0.15; // variation
      const col = i % 2 === 0 ? BASALT : BASALT_L;
      parts.push(cyl(colR, colR * 0.95, h, 6, col, {
        x,
        y: h / 2,
        hex2: BASALT_D,
      }));
    }

    // Grass / vegetation on top edge
    parts.push(box(2.0, 0.08, 0.3, GRASS, { y: 1.35, z: -0.2 }));

    // Rocky base / talus
    parts.push(box(2.2, 0.15, 0.5, BASALT_D, { y: 0.08, hex2: BASALT }));

    return finish(parts);
  },
};

export default NM_DAGUOYE;
