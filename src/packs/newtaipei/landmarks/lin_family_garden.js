/**
 * @file packs/newtaipei/landmarks/lin_family_garden.js — Roll Formosa New Taipei pack.
 *
 * NM_LIN_FAMILY_GARDEN — 板橋林家花園 (Lin Family Mansion and Garden). A
 * stunning Qing dynasty garden estate, the finest example of traditional
 * Chinese garden architecture in Taiwan. Features pavilions, moon gates,
 * ornate rockeries, winding corridors, lotus ponds, and traditional
 * southern Fujianese/Cantonese architecture with curved roofs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const WALL = 0xf0e8d8;       // white-washed garden walls
const ROOF = 0x4a4a4a;       // dark grey tile roofs
const WOOD = 0x6a3a2a;       // reddish-brown wood
const STONE = 0x8a8070;      // garden rocks/rockery
const POND = 0x3a6a7a;       // pond water
const GREEN = 0x3a8a4a;      // garden vegetation

export const NM_LIN_FAMILY_GARDEN = {
  id: 'lin_family_garden',
  name: '板橋林家花園',
  landmarkId: 6,
  dioramaRHint: 60, // ~60 m footprint (large estate)
  colorHex: WALL, // white wall read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Garden grounds and lotus pond ------------------------------
    parts.push(box(1.6, 0.04, 1.2, 0x6a7a5a, { y: 0.02 })); // garden floor
    // Lotus pond (irregular shape approximated)
    parts.push(cyl(0.35, 0.38, 0.06, 10, POND, { x: 0.3, y: 0.05, z: 0.15 }));
    parts.push(cyl(0.2, 0.22, 0.06, 8, POND, { x: 0.55, y: 0.05, z: 0.0 }));

    // ---- 2) Main pavilion (定靜堂 style) -------------------------------
    const pavX = -0.35;
    const pavZ = -0.25;
    parts.push(box(0.5, 0.35, 0.4, WALL, { x: pavX, y: 0.2, z: pavZ }));
    // Curved roof
    parts.push(box(0.56, 0.04, 0.46, ROOF, { x: pavX, y: 0.4, z: pavZ }));
    parts.push(cyl(0.32, 0.35, 0.04, 4, ROOF, { x: pavX, y: 0.44, z: pavZ, ry: PI/4 }));
    // Upturned eaves
    for (const dx of [-0.28, 0.28]) {
      for (const dz of [-0.23, 0.23]) {
        parts.push(cone(0.04, 0.08, 4, ROOF, { x: pavX + dx, y: 0.42, z: pavZ + dz, rz: dx > 0 ? 0.3 : -0.3 }));
      }
    }
    // Red wooden columns
    for (const dx of [-0.18, 0.18]) {
      parts.push(cyl(0.025, 0.025, 0.35, 6, WOOD, { x: pavX + dx, y: 0.2, z: pavZ + 0.21 }));
    }

    // ---- 3) Moon gate (圓門) -------------------------------------------
    const gateX = 0.0;
    const gateZ = -0.4;
    // Wall section with circular opening
    parts.push(box(0.35, 0.4, 0.06, WALL, { x: gateX - 0.25, y: 0.22, z: gateZ }));
    parts.push(box(0.35, 0.4, 0.06, WALL, { x: gateX + 0.25, y: 0.22, z: gateZ }));
    parts.push(box(0.2, 0.12, 0.06, WALL, { x: gateX, y: 0.36, z: gateZ }));
    // Moon gate circle (represented as torus)
    parts.push(cyl(0.14, 0.14, 0.07, 12, WALL, { x: gateX, y: 0.16, z: gateZ, open: true }));

    // ---- 4) Covered corridor (長廊) ------------------------------------
    const corrZ = 0.35;
    parts.push(box(0.8, 0.04, 0.15, ROOF, { x: -0.2, y: 0.35, z: corrZ }));
    // Corridor columns
    for (let i = 0; i < 5; i++) {
      parts.push(cyl(0.02, 0.02, 0.3, 6, WOOD, { x: -0.5 + i * 0.2, y: 0.18, z: corrZ }));
    }
    // Lattice railing (simplified)
    parts.push(box(0.78, 0.08, 0.02, WOOD, { x: -0.2, y: 0.12, z: corrZ + 0.06 }));

    // ---- 5) Waterside pavilion (來青閣) --------------------------------
    const wpX = 0.55;
    const wpZ = 0.25;
    // Elevated platform over water
    parts.push(box(0.3, 0.08, 0.25, STONE, { x: wpX, y: 0.08, z: wpZ }));
    // Pavilion structure
    parts.push(box(0.25, 0.25, 0.2, WALL, { x: wpX, y: 0.24, z: wpZ }));
    parts.push(box(0.28, 0.03, 0.23, ROOF, { x: wpX, y: 0.38, z: wpZ }));
    parts.push(cone(0.16, 0.12, 4, ROOF, { x: wpX, y: 0.46, z: wpZ, ry: PI/4 }));

    // ---- 6) Rockery (假山) ---------------------------------------------
    parts.push(sph(0.12, STONE, { ws: 5, hs: 4, x: -0.6, y: 0.14, z: 0.3 }));
    parts.push(sph(0.08, STONE, { ws: 5, hs: 3, x: -0.68, y: 0.1, z: 0.25 }));
    parts.push(cone(0.1, 0.2, 5, STONE, { x: -0.55, y: 0.18, z: 0.35 }));
    // Small plants on rockery
    parts.push(sph(0.06, GREEN, { ws: 4, hs: 3, x: -0.58, y: 0.25, z: 0.3 }));

    // ---- 7) Garden trees -----------------------------------------------
    for (const pos of [{ x: 0.15, z: -0.1 }, { x: 0.65, z: -0.3 }, { x: -0.7, z: -0.1 }]) {
      parts.push(cyl(0.025, 0.03, 0.2, 6, 0x4a3020, { x: pos.x, y: 0.12, z: pos.z })); // trunk
      parts.push(sph(0.1, GREEN, { ws: 5, hs: 4, x: pos.x, y: 0.28, z: pos.z })); // canopy
    }

    // ---- 8) Boundary wall with decorative tiles ------------------------
    parts.push(box(0.04, 0.25, 1.1, WALL, { x: 0.8, y: 0.15, z: 0 })); // east wall
    parts.push(box(1.65, 0.25, 0.04, WALL, { y: 0.15, z: -0.55 })); // north wall

    return finish(parts);
  },
};

export default NM_LIN_FAMILY_GARDEN;
