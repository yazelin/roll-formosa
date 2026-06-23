/**
 * @file packs/newtaipei/landmarks/yingge_museum.js — Roll Formosa New Taipei pack.
 *
 * NM_YINGGE_MUSEUM — 鶯歌陶瓷博物館 (Yingge Ceramics Museum). A modern
 * architectural masterpiece with clean geometric lines, featuring an iconic
 * tall central tower, sweeping horizontal wings, and large glass curtain walls.
 * The museum celebrates ceramics with earth-toned materials and kiln-inspired
 * forms.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const CONCRETE = 0xa0a0a0;   // exposed concrete grey
const GLASS = 0x88b8d8;      // blue-tinted glass curtain wall
const STEEL = 0x606870;      // dark steel frames
const TERRACOTTA = 0xc07040; // terracotta accent (ceramic reference)
const BRICK = 0x8a5a40;      // kiln brick accent

export const NM_YINGGE_MUSEUM = {
  id: 'yingge_museum',
  name: '鶯歌陶瓷博物館',
  landmarkId: 2,
  dioramaRHint: 40, // ~40 m footprint
  colorHex: GLASS, // glass read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Main horizontal wing (long exhibition hall) ----------------
    parts.push(box(1.6, 0.4, 0.6, CONCRETE, { y: 0.2 })); // base mass
    parts.push(box(1.5, 0.35, 0.55, GLASS, { y: 0.22 })); // glass curtain inset
    parts.push(box(1.62, 0.05, 0.62, STEEL, { y: 0.42 })); // roof parapet

    // ---- 2) Central tower element (vertical accent) --------------------
    const towerX = 0.0;
    const towerZ = -0.15;
    parts.push(box(0.35, 1.0, 0.35, CONCRETE, { x: towerX, y: 0.5, z: towerZ }));
    // glass strip on tower
    parts.push(box(0.08, 0.85, 0.36, GLASS, { x: towerX, y: 0.55, z: towerZ }));
    // tower cap
    parts.push(box(0.38, 0.06, 0.38, STEEL, { x: towerX, y: 1.03, z: towerZ }));
    // small observation deck
    parts.push(cyl(0.12, 0.12, 0.08, 8, CONCRETE, { x: towerX, y: 1.1, z: towerZ }));

    // ---- 3) Kiln-inspired sculptural element (ceramic reference) -------
    // Large ceramic vessel form on the plaza
    parts.push(cyl(0.18, 0.15, 0.35, 10, TERRACOTTA, { x: 0.6, y: 0.175, z: 0.4 }));
    parts.push(cyl(0.12, 0.18, 0.1, 10, TERRACOTTA, { x: 0.6, y: 0.4, z: 0.4 })); // vessel rim

    // ---- 4) Entry canopy (sweeping modern form) ------------------------
    parts.push(box(0.5, 0.04, 0.4, STEEL, { x: -0.4, y: 0.35, z: 0.45 })); // canopy
    // canopy support columns
    parts.push(cyl(0.03, 0.03, 0.35, 6, STEEL, { x: -0.55, y: 0.17, z: 0.6 }));
    parts.push(cyl(0.03, 0.03, 0.35, 6, STEEL, { x: -0.25, y: 0.17, z: 0.6 }));

    // ---- 5) Exhibition wing extension ----------------------------------
    parts.push(box(0.5, 0.3, 0.5, BRICK, { x: -0.6, y: 0.15, z: -0.25 }));
    parts.push(box(0.48, 0.25, 0.48, GLASS, { x: -0.6, y: 0.17, z: -0.25 }));

    // ---- 6) Plaza and reflecting pool ----------------------------------
    parts.push(box(1.8, 0.03, 0.8, 0x808080, { y: 0.015, z: 0.25 })); // plaza
    parts.push(box(0.4, 0.02, 0.3, 0x3a5a7a, { x: 0.3, y: 0.01, z: 0.55 })); // reflecting pool

    // ---- 7) Ceramic art installations on grounds -----------------------
    // Abstract ceramic sculptures
    parts.push(sph(0.08, TERRACOTTA, { ws: 6, hs: 4, x: -0.3, y: 0.1, z: 0.55 }));
    parts.push(cone(0.06, 0.15, 8, BRICK, { x: 0.1, y: 0.1, z: 0.6 }));

    return finish(parts);
  },
};

export default NM_YINGGE_MUSEUM;
