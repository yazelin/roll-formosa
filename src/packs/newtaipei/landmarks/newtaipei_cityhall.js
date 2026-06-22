/**
 * @file packs/newtaipei/landmarks/newtaipei_cityhall.js — Roll Formosa New Taipei pack.
 *
 * NM_NEWTAIPEI_CITYHALL — 新北市政府大樓 (New Taipei City Hall). A modern
 * high-rise government complex in Banqiao, featuring a distinctive twin-tower
 * design with a connecting sky bridge, glass curtain walls, and a large civic
 * plaza. The towers have a sleek, contemporary design with blue-green glass.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). <= 600 tris.
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const GLASS = 0x4a8aa0;      // blue-green glass curtain wall
const GLASS_HI = 0x6ab0c8;   // brighter glass (catching light)
const STEEL = 0x6a7078;      // dark steel mullions
const CONCRETE = 0xa0a0a0;   // concrete base/podium
const PLAZA = 0x909090;      // civic plaza

export const NM_NEWTAIPEI_CITYHALL = {
  id: 'newtaipei_cityhall',
  name: '新北市政府大樓',
  landmarkId: 7,
  dioramaRHint: 100, // ~100 m footprint (large complex)
  colorHex: GLASS, // glass read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Civic plaza base -------------------------------------------
    parts.push(box(1.8, 0.06, 1.4, PLAZA, { y: 0.03 })); // main plaza
    parts.push(box(1.85, 0.04, 1.45, 0x707070, { y: 0.0 })); // plaza edge

    // ---- 2) Podium structure -------------------------------------------
    parts.push(box(1.4, 0.25, 1.0, CONCRETE, { y: 0.185 }));
    // Podium glass band
    parts.push(box(1.38, 0.15, 0.98, GLASS, { y: 0.2 }));

    // ---- 3) Left tower (taller main tower) -----------------------------
    const ltX = -0.35;
    const towerBotY = 0.31;
    // Tower shaft (multiple bands rising)
    parts.push(box(0.4, 0.5, 0.35, GLASS, { x: ltX, y: towerBotY + 0.25, hex2: GLASS_HI }));
    parts.push(box(0.42, 0.04, 0.37, STEEL, { x: ltX, y: towerBotY + 0.52 })); // floor band
    parts.push(box(0.38, 0.45, 0.33, GLASS, { x: ltX, y: towerBotY + 0.77, hex2: GLASS_HI }));
    parts.push(box(0.4, 0.04, 0.35, STEEL, { x: ltX, y: towerBotY + 1.01 })); // floor band
    parts.push(box(0.36, 0.4, 0.31, GLASS, { x: ltX, y: towerBotY + 1.23, hex2: GLASS_HI }));
    // Tower crown
    parts.push(box(0.38, 0.06, 0.33, STEEL, { x: ltX, y: towerBotY + 1.46 }));
    // Mechanical penthouse
    parts.push(box(0.2, 0.1, 0.18, CONCRETE, { x: ltX, y: towerBotY + 1.54 }));

    // ---- 4) Right tower (shorter secondary tower) ----------------------
    const rtX = 0.35;
    parts.push(box(0.35, 0.45, 0.32, GLASS, { x: rtX, y: towerBotY + 0.22, hex2: GLASS_HI }));
    parts.push(box(0.37, 0.04, 0.34, STEEL, { x: rtX, y: towerBotY + 0.47 }));
    parts.push(box(0.33, 0.4, 0.3, GLASS, { x: rtX, y: towerBotY + 0.69, hex2: GLASS_HI }));
    parts.push(box(0.35, 0.04, 0.32, STEEL, { x: rtX, y: towerBotY + 0.91 }));
    parts.push(box(0.31, 0.3, 0.28, GLASS, { x: rtX, y: towerBotY + 1.08, hex2: GLASS_HI }));
    // Tower crown
    parts.push(box(0.33, 0.05, 0.3, STEEL, { x: rtX, y: towerBotY + 1.25 }));

    // ---- 5) Sky bridge connecting towers -------------------------------
    const bridgeY = towerBotY + 0.65;
    parts.push(box(0.5, 0.12, 0.18, GLASS, { y: bridgeY }));
    parts.push(box(0.52, 0.03, 0.2, STEEL, { y: bridgeY + 0.075 })); // bridge top
    parts.push(box(0.52, 0.03, 0.2, STEEL, { y: bridgeY - 0.075 })); // bridge bottom

    // ---- 6) Entry canopy and features ----------------------------------
    // Main entry canopy projecting forward
    parts.push(box(0.5, 0.04, 0.25, STEEL, { y: 0.35, z: 0.6 }));
    // Canopy supports
    parts.push(cyl(0.03, 0.03, 0.28, 6, STEEL, { x: -0.2, y: 0.2, z: 0.7 }));
    parts.push(cyl(0.03, 0.03, 0.28, 6, STEEL, { x: 0.2, y: 0.2, z: 0.7 }));

    // ---- 7) Plaza features ---------------------------------------------
    // Flagpoles
    for (const x of [-0.6, 0.6]) {
      parts.push(cyl(0.015, 0.02, 0.4, 6, 0xcccccc, { x, y: 0.26, z: 0.55 }));
    }
    // Plaza sculpture (abstract)
    parts.push(cyl(0.08, 0.06, 0.15, 8, 0x8a6a4a, { x: 0, y: 0.14, z: 0.4 }));
    parts.push(sph(0.06, 0x7a8a9a, { ws: 6, hs: 4, y: 0.24, z: 0.4 }));

    // ---- 8) Underground entrance markers -------------------------------
    parts.push(box(0.15, 0.06, 0.15, 0x3a5a7a, { x: -0.5, y: 0.09, z: 0.45 })); // MRT entrance
    parts.push(box(0.15, 0.06, 0.15, 0x3a5a7a, { x: 0.5, y: 0.09, z: 0.45 }));

    return finish(parts);
  },
};

export default NM_NEWTAIPEI_CITYHALL;
